// timecache.go: Ultra-fast time caching implementation
//
// Copyright (c) 2025 AGILira
// Series: an AGLIra fragment
// SPDX-License-Identifier: MPL-2.0

package timecache

import (
	"sync/atomic"
	"time"
)

// TimeCache provides cached time access to eliminate time.Now() allocations.
// It is optimized for high-throughput scenarios where multiple goroutines need
// frequent access to the current time with minimal overhead.
//
// A TimeCache maintains an internal timestamp that is updated at regular intervals
// by a background goroutine. All access methods are thread-safe and provide
// zero-allocation access to the cached time value.
//
// The cache automatically starts updating when created and must be stopped
// explicitly to prevent goroutine leaks.
type TimeCache struct {
	// cachedTimeNano stores the current time in nanoseconds since Unix epoch.
	// This field is accessed atomically and provides zero-allocation time access.
	cachedTimeNano int64

	// ticker drives the periodic updates of the cached time value.
	ticker *time.Ticker

	// stopCh is used to signal the background updater goroutine to stop.
	stopCh chan struct{}

	// resolution controls how frequently the cached time is updated.
	// Smaller values provide more accurate timestamps but consume more CPU.
	resolution time.Duration
}

// defaultCache is the global time cache instance with default settings.
// It is initialized automatically when the package is imported and provides
// convenient access to cached time without requiring explicit cache management.
var defaultCache *TimeCache

func init() {
	// Initialize the default time cache with standard settings (500µs resolution)
	// This provides a good balance between accuracy and CPU usage for most applications.
	defaultCache = NewWithResolution(500 * time.Microsecond)
}

// New creates a new TimeCache with default resolution (500µs).
//
// The default resolution provides a good balance between accuracy and CPU usage
// for most high-throughput applications. The cache starts updating immediately
// and must be stopped explicitly to prevent goroutine leaks.
//
// Example:
//
//	tc := timecache.New()
//	defer tc.Stop()
//	now := tc.CachedTime()
func New() *TimeCache {
	return NewWithResolution(500 * time.Microsecond)
}

// NewWithResolution creates a new TimeCache with custom update resolution.
//
// The resolution parameter controls how frequently the cached time is updated.
// Smaller values provide more accurate timestamps but consume more CPU.
//
// Recommended resolution values:
//   - 100µs to 500µs: High precision, suitable for real-time systems
//   - 1ms to 10ms: Balanced performance, good for most applications
//   - >10ms: Minimal CPU impact, suitable for non-critical timing
//
// The cache starts updating immediately and must be stopped explicitly
// to prevent goroutine leaks.
//
// Example:
//
//	// High precision cache for real-time logging
//	tc := timecache.NewWithResolution(100 * time.Microsecond)
//	defer tc.Stop()
//
//	// Balanced cache for general use
//	tc2 := timecache.NewWithResolution(1 * time.Millisecond)
//	defer tc2.Stop()
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

// updateLoop runs in background to update cached time.
// This method is called automatically when a TimeCache is created
// and runs until the cache is stopped.
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

// CachedTimeNano returns the cached time in nanoseconds since Unix epoch.
// This method provides zero-allocation access to the current timestamp
// and is the fastest way to get time information from the cache.
//
// The returned value represents nanoseconds since January 1, 1970 UTC.
//
// Example:
//
//	tc := timecache.New()
//	defer tc.Stop()
//	nano := tc.CachedTimeNano()
//	fmt.Printf("Timestamp: %d nanoseconds\n", nano)
func (tc *TimeCache) CachedTimeNano() int64 {
	return atomic.LoadInt64(&tc.cachedTimeNano)
}

// CachedTime returns the cached time as a time.Time value.
// This method converts the internal nanosecond timestamp to a time.Time
// for convenient use with Go's time package functions.
//
// Example:
//
//	tc := timecache.New()
//	defer tc.Stop()
//	now := tc.CachedTime()
//	fmt.Printf("Current time: %v\n", now)
func (tc *TimeCache) CachedTime() time.Time {
	nanos := atomic.LoadInt64(&tc.cachedTimeNano)
	return time.Unix(0, nanos)
}

// CachedTimeString returns the cached time formatted as an RFC3339Nano string.
// The returned string is in UTC timezone and follows the format:
// "2006-01-02T15:04:05.999999999Z07:00"
//
// This method is useful for logging, API responses, or any scenario
// where a standardized time string format is required.
//
// Example:
//
//	tc := timecache.New()
//	defer tc.Stop()
//	timeStr := tc.CachedTimeString()
//	fmt.Printf("ISO timestamp: %s\n", timeStr)
func (tc *TimeCache) CachedTimeString() string {
	nanos := atomic.LoadInt64(&tc.cachedTimeNano)
	return time.Unix(0, nanos).UTC().Format(time.RFC3339Nano)
}

// Resolution returns the update frequency of this cache.
// This is the interval at which the cached time value is refreshed
// by the background updater goroutine.
//
// Example:
//
//	tc := timecache.NewWithResolution(1 * time.Millisecond)
//	defer tc.Stop()
//	fmt.Printf("Cache updates every: %v\n", tc.Resolution())
func (tc *TimeCache) Resolution() time.Duration {
	return tc.resolution
}

// Stop permanently stops the time cache updater.
// After calling Stop, the cached time value will no longer be updated
// and the background goroutine will terminate.
//
// It is important to call Stop to prevent goroutine leaks when
// the cache is no longer needed.
//
// Example:
//
//	tc := timecache.New()
//	// ... use the cache ...
//	tc.Stop() // Clean up resources
func (tc *TimeCache) Stop() {
	close(tc.stopCh)
}

// Global API functions using the default time cache instance.
// These functions provide convenient access to cached time without
// requiring explicit cache management.

// CachedTimeNano returns the cached time in nanoseconds since Unix epoch from the default cache.
// This function provides zero-allocation access to the current timestamp
// and is the fastest way to get time information.
//
// The returned value represents nanoseconds since January 1, 1970 UTC.
//
// Example:
//
//	nano := timecache.CachedTimeNano()
//	fmt.Printf("Timestamp: %d nanoseconds\n", nano)
func CachedTimeNano() int64 {
	return defaultCache.CachedTimeNano()
}

// CachedTime returns the cached time as a time.Time value from the default cache.
// This function converts the internal nanosecond timestamp to a time.Time
// for convenient use with Go's time package functions.
//
// Example:
//
//	now := timecache.CachedTime()
//	fmt.Printf("Current time: %v\n", now)
func CachedTime() time.Time {
	return defaultCache.CachedTime()
}

// CachedTimeString returns the cached time formatted as an RFC3339Nano string from the default cache.
// The returned string is in UTC timezone and follows the format:
// "2006-01-02T15:04:05.999999999Z07:00"
//
// This function is useful for logging, API responses, or any scenario
// where a standardized time string format is required.
//
// Example:
//
//	timeStr := timecache.CachedTimeString()
//	fmt.Printf("ISO timestamp: %s\n", timeStr)
func CachedTimeString() string {
	return defaultCache.CachedTimeString()
}

// DefaultCache returns the global default TimeCache instance.
// This allows access to the default cache for advanced operations
// like checking resolution or stopping the cache.
//
// Example:
//
//	defaultCache := timecache.DefaultCache()
//	fmt.Printf("Default cache resolution: %v\n", defaultCache.Resolution())
func DefaultCache() *TimeCache {
	return defaultCache
}

// StopDefaultCache stops the global default time cache.
// After calling this function, the default cache will no longer be updated
// and the background goroutine will terminate.
//
// This function is mainly intended for testing and shutdown scenarios.
// In normal application usage, the default cache should remain running.
//
// Example:
//
//	// During application shutdown
//	timecache.StopDefaultCache()
func StopDefaultCache() {
	defaultCache.Stop()
}
