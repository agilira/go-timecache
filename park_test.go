// park_test.go: the updater stops waking the process when nobody reads the cache
//
// Copyright (c) 2025-2026 AGILira - A. Giordano
// Series: an AGILira library
// SPDX-License-Identifier: MPL-2.0

package timecache

import (
	"sync"
	"sync/atomic"
	"testing"
	"time"
)

const testResolution = 100 * time.Microsecond

func waitState(t *testing.T, tc *TimeCache, want int32) {
	t.Helper()
	deadline := time.Now().Add(2 * time.Second)
	for stateOf(atomic.LoadInt32(&tc.flags)) != want {
		if time.Now().After(deadline) {
			t.Fatalf("state = %d, want %d", stateOf(atomic.LoadInt32(&tc.flags)), want)
		}
		time.Sleep(50 * time.Microsecond)
	}
}

func TestUpdaterParksWhenUnread(t *testing.T) {
	tc := NewWithResolution(testResolution)
	defer tc.Stop()
	waitState(t, tc, stateParked)
}

func TestReadAfterParkIsFreshAndResumes(t *testing.T) {
	tc := NewWithResolution(testResolution)
	defer tc.Stop()
	waitState(t, tc, stateParked)
	time.Sleep(20 * time.Millisecond)

	before := time.Now().UnixNano()
	got := tc.CachedTimeNano()
	if got < before {
		t.Fatalf("read after park returned a value %v older than the call", time.Duration(before-got))
	}
	waitState(t, tc, stateRunning)
	// While running the value keeps moving.
	time.Sleep(2 * time.Millisecond)
	if next := tc.CachedTimeNano(); next <= got {
		t.Fatalf("value did not progress after resuming: %d -> %d", got, next)
	}
}

func TestSteadyReaderKeepsUpdaterRunning(t *testing.T) {
	tc := NewWithResolution(testResolution)
	defer tc.Stop()
	end := time.Now().Add(30 * time.Millisecond)
	for time.Now().Before(end) {
		tc.CachedTime()
		time.Sleep(testResolution / 2)
	}
	if s := stateOf(atomic.LoadInt32(&tc.flags)); s != stateRunning {
		t.Fatalf("updater parked under a steady reader: state %d", s)
	}
}

func TestStopEndsTheUpdaterInEveryState(t *testing.T) {
	running := NewWithResolution(time.Hour)
	running.Stop()
	parked := NewWithResolution(testResolution)
	waitState(t, parked, stateParked)
	parked.Stop()
	for name, tc := range map[string]*TimeCache{"running": running, "parked": parked} {
		select {
		case <-tc.done:
		case <-time.After(2 * time.Second):
			t.Fatalf("%s: updater did not exit after Stop", name)
		}
	}
	// A stopped cache keeps serving its last value and never restarts.
	last := parked.CachedTimeNano()
	time.Sleep(time.Millisecond)
	if parked.CachedTimeNano() != last || stateOf(atomic.LoadInt32(&parked.flags)) != stateStopped {
		t.Fatal("stopped cache changed")
	}
}

// TestReadsStayFreshAcrossParking hammers the park and wake transitions from many
// goroutines. Every read must be no older than a generous bound; before parking was
// correct, a read right after a park could return time from the last active period.
func TestReadsStayFreshAcrossParking(t *testing.T) {
	tc := NewWithResolution(testResolution)
	defer tc.Stop()
	const maxStale = int64(50 * time.Millisecond)
	var wg sync.WaitGroup
	var worst atomic.Int64
	for g := 0; g < 8; g++ {
		wg.Add(1)
		go func(seed int) {
			defer wg.Done()
			for i := 0; i < 200; i++ {
				before := time.Now().UnixNano()
				if stale := before - tc.CachedTimeNano(); stale > worst.Load() {
					worst.Store(stale)
				}
				// Pauses from 0 to ~3 ms straddle the ~1 ms park threshold.
				time.Sleep(time.Duration((seed*31+i*17)%30) * 100 * time.Microsecond)
			}
		}(g)
	}
	wg.Wait()
	if w := worst.Load(); w > maxStale {
		t.Fatalf("a read returned time %v old", time.Duration(w))
	}
}
