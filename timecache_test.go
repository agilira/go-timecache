// timecache_test.go: Test suite for ultra-fast time caching
//
// Copyright (c) 2025 AGILira - A. Giordano
// Series: an AGILira library
// SPDX-License-Identifier: MPL-2.0

package timecache

import (
	"testing"
	"time"
)

func TestCachedTimeNano(t *testing.T) {
	// Test that CachedTimeNano returns a reasonable timestamp
	nano := CachedTimeNano()
	now := time.Now().UnixNano()

	// Should be within 1ms of actual time (allowing for cache precision)
	diff := now - nano
	if diff < 0 {
		diff = -diff
	}

	if diff > int64(time.Millisecond) {
		t.Errorf("CachedTimeNano too far from actual time: diff=%dms", diff/int64(time.Millisecond))
	}
}

func TestCachedTime(t *testing.T) {
	// Test that CachedTime returns a reasonable time.Time
	cached := CachedTime()
	now := time.Now()

	// Should be within 1ms of actual time
	diff := now.Sub(cached)
	if diff < 0 {
		diff = -diff
	}

	if diff > time.Millisecond {
		t.Errorf("CachedTime too far from actual time: diff=%v", diff)
	}
}

func TestTimeCacheConsistency(t *testing.T) {
	// Multiple calls within the cache update interval should return same value
	time1 := CachedTimeNano()
	time2 := CachedTimeNano()
	time3 := CachedTimeNano()

	// All should be exactly the same (cached value)
	if time1 != time2 || time2 != time3 {
		t.Errorf("CachedTimeNano not consistent: %d, %d, %d", time1, time2, time3)
	}
}

func TestTimeCacheProgression(t *testing.T) {
	// Wait for multiple cache update cycles to ensure progression
	start := CachedTimeNano()

	// Wait long enough to guarantee at least 2-3 ticker updates
	time.Sleep(2 * time.Millisecond) // 4x the 500μs update interval

	end := CachedTimeNano()

	// Time should have progressed
	if end <= start {
		t.Errorf("CachedTimeNano did not progress: start=%d, end=%d", start, end)
	}

	// Verify the progression is reasonable (should be at least the sleep duration)
	diff := end - start
	minExpected := int64(time.Millisecond) // At least 1ms progression
	if diff < minExpected {
		t.Errorf("CachedTimeNano progression too small: got %d ns, expected at least %d ns", diff, minExpected)
	}
}

func TestCustomInstanceCreation(t *testing.T) {
	// Create a custom instance with different resolution
	custom := NewWithResolution(1 * time.Millisecond)
	defer custom.Stop()

	// Verify resolution is set correctly
	if custom.Resolution() != 1*time.Millisecond {
		t.Errorf("Custom resolution not set correctly: got %v, want %v",
			custom.Resolution(), 1*time.Millisecond)
	}

	// Basic functionality check
	nano := custom.CachedTimeNano()
	now := time.Now().UnixNano()
	diff := now - nano
	if diff < 0 {
		diff = -diff
	}

	// Should be within 2ms (resolution + potential delay)
	if diff > int64(2*time.Millisecond) {
		t.Errorf("Custom cache too far from actual time: diff=%dms",
			diff/int64(time.Millisecond))
	}
}

func TestCacheStop(t *testing.T) {
	// Create a cache just for this test
	tc := New()

	// Get initial time
	initial := tc.CachedTimeNano()

	// Stop the cache
	tc.Stop()

	// Wait long enough that it would have updated if running
	time.Sleep(5 * time.Millisecond)

	// Time should not have changed after stopping
	after := tc.CachedTimeNano()

	if after != initial {
		t.Errorf("Time changed after cache was stopped: initial=%d, after=%d",
			initial, after)
	}
}

func BenchmarkTimeNow(b *testing.B) {
	for i := 0; i < b.N; i++ {
		_ = time.Now()
	}
}

func BenchmarkCachedTime(b *testing.B) {
	for i := 0; i < b.N; i++ {
		_ = CachedTime()
	}
}

func BenchmarkCachedTimeNano(b *testing.B) {
	for i := 0; i < b.N; i++ {
		_ = CachedTimeNano()
	}
}

func BenchmarkTimeNowUnixNano(b *testing.B) {
	for i := 0; i < b.N; i++ {
		_ = time.Now().UnixNano()
	}
}

func BenchmarkCachedTimeParallel(b *testing.B) {
	b.RunParallel(func(pb *testing.PB) {
		for pb.Next() {
			_ = CachedTime()
		}
	})
}

func BenchmarkTimeNowParallel(b *testing.B) {
	b.RunParallel(func(pb *testing.PB) {
		for pb.Next() {
			_ = time.Now()
		}
	})
}

func TestCachedTimeString(t *testing.T) {
	// Test the string representation of cached time
	timeStr := CachedTimeString()

	// Verify that it's a properly formatted time string
	_, err := time.Parse(time.RFC3339Nano, timeStr)
	if err != nil {
		t.Errorf("CachedTimeString returned invalid time format: %s, error: %v", timeStr, err)
	}

	// Test the instance method version
	tc := New()
	defer tc.Stop()

	instanceTimeStr := tc.CachedTimeString()
	_, err = time.Parse(time.RFC3339Nano, instanceTimeStr)
	if err != nil {
		t.Errorf("Instance CachedTimeString returned invalid time format: %s, error: %v", instanceTimeStr, err)
	}
}

func TestDefaultCache(t *testing.T) {
	// Test getting the default cache instance
	defaultCache := DefaultCache()

	// It should not be nil
	if defaultCache == nil {
		t.Error("DefaultCache returned nil")
	}

	// Test that it returns a singleton instance
	secondCall := DefaultCache()
	if defaultCache != secondCall {
		t.Error("DefaultCache did not return the same instance on multiple calls")
	}

	// Check basic functionality
	cachedTime := defaultCache.CachedTimeNano()
	if cachedTime == 0 {
		t.Error("Default cache returned zero timestamp")
	}
}

func TestStopDefaultCache(t *testing.T) {
	// First, ensure default cache is initialized
	DefaultCache()

	// Get initial time from default cache
	initial := CachedTimeNano()

	// Stop the default cache
	StopDefaultCache()

	// Wait long enough that it would have updated if running
	time.Sleep(5 * time.Millisecond)

	// After stopping, the global functions should return the last cached value
	// and not update anymore (this is the correct behavior)
	after := CachedTimeNano()

	// The time should be the same (last cached value, not updating)
	if after != initial {
		t.Errorf("Time should not change after stopping default cache: initial=%d, after=%d",
			initial, after)
	}

	// After tests, reinitialize default cache for other tests
	DefaultCache()
}
