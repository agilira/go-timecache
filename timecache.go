// timecache.go: Ultra-fast time caching for high-performance applications
//
// TimeCache provides zero-allocation access to cached time.Now() values,
// eliminating the performance overhead of repeated time.Now() calls in
// high-throughput scenarios like logging and metrics collection.
//
// Copyright (c) 2025 AGILira
// Series: an AGLIra fragment
// SPDX-License-Identifier: MPL-2.0

package timecache

import (
	"sync/atomic"
	"time"
)

// TimeCache provides cached time access to eliminate time.Now() allocations
// Optimized for high-throughput scenarios where multiple goroutines need
// frequent access to the current time with minimal overhead.
type TimeCache struct {
	cachedTimeNano int64 // atomic int64 - current time in nanoseconds
	ticker         *time.Ticker
	stopCh         chan struct{}
	resolution     time.Duration // update frequency
}

// Global time cache instance with default settings
var defaultCache *TimeCache

func init() {
	// Initialize the default time cache with standard settings
	defaultCache = NewWithResolution(500 * time.Microsecond)
}

// New creates a new TimeCache with default resolution (500µs)
func New() *TimeCache {
	return NewWithResolution(500 * time.Microsecond)
}

// NewWithResolution creates a new TimeCache with custom update resolution
//
// The resolution parameter controls how frequently the cached time is updated.
// Smaller values provide more accurate timestamps but consume more CPU.
// Recommended values:
// - 100µs to 500µs for high precision
// - 1ms to 10ms for balanced performance
// - >10ms only for non-critical timing with minimal CPU impact
func NewWithResolution(resolution time.Duration) *TimeCache {
	tc := &TimeCache{
		resolution: resolution,
		stopCh:     make(chan struct{}),
	}

	// Initialize with current time
	tc.cachedTimeNano = time.Now().UnixNano()
	tc.ticker = time.NewTicker(resolution)

	// Start background updater
	go tc.updateLoop()

	return tc
}

// updateLoop runs in background to update cached time
func (tc *TimeCache) updateLoop() {
	for {
		select {
		case <-tc.ticker.C:
			// Update cached time atomically - zero allocation
			atomic.StoreInt64(&tc.cachedTimeNano, time.Now().UnixNano())
		case <-tc.stopCh:
			tc.ticker.Stop()
			return
		}
	}
}

// CachedTimeNano returns cached time in nanoseconds (ZERO ALLOCATION)
func (tc *TimeCache) CachedTimeNano() int64 {
	return atomic.LoadInt64(&tc.cachedTimeNano)
}

// CachedTime returns cached time as time.Time
func (tc *TimeCache) CachedTime() time.Time {
	nanos := atomic.LoadInt64(&tc.cachedTimeNano)
	return time.Unix(0, nanos)
}

// CachedTimeString returns cached time formatted as RFC3339Nano string
func (tc *TimeCache) CachedTimeString() string {
	nanos := atomic.LoadInt64(&tc.cachedTimeNano)
	return time.Unix(0, nanos).UTC().Format(time.RFC3339Nano)
}

// Resolution returns the update frequency of this cache
func (tc *TimeCache) Resolution() time.Duration {
	return tc.resolution
}

// Stop permanently stops the time cache updater
// The cache will no longer be updated after this call
func (tc *TimeCache) Stop() {
	close(tc.stopCh)
}

// Global API functions using the default time cache instance

// CachedTimeNano returns cached time in nanoseconds from default cache (ZERO ALLOCATION)
func CachedTimeNano() int64 {
	return defaultCache.CachedTimeNano()
}

// CachedTime returns cached time as time.Time from default cache
func CachedTime() time.Time {
	return defaultCache.CachedTime()
}

// CachedTimeString returns cached time formatted as RFC3339Nano string from default cache
func CachedTimeString() string {
	return defaultCache.CachedTimeString()
}

// DefaultCache returns the global default TimeCache instance
func DefaultCache() *TimeCache {
	return defaultCache
}

// StopDefaultCache stops the global default time cache
// Note: This is mainly for testing and shutdown scenarios
func StopDefaultCache() {
	defaultCache.Stop()
}
