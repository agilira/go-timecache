// example_test.go: Usage examples for timecache library
//
// Copyright (c) 2025 AGILira - A. Giordano
// Series: an AGILira library
// SPDX-License-Identifier: MPL-2.0

package timecache_test

import (
	"fmt"
	"time"

	"github.com/agilira/go-timecache"
)

func Example() {
	// Using the default global cache - no setup required!
	now := timecache.CachedTime()
	fmt.Printf("Current time: %v\n", now)

	// Get time as Unix nano (zero allocation - fastest method)
	nano := timecache.CachedTimeNano()
	fmt.Printf("Nanoseconds since epoch: %d\n", nano)

	// Get formatted time string (useful for logging)
	timeStr := timecache.CachedTimeString()
	fmt.Printf("ISO timestamp: %s\n", timeStr)

}

func ExampleNew() {
	// Create a custom time cache with 1ms resolution
	tc := timecache.NewWithResolution(1 * time.Millisecond)
	defer tc.Stop() // Important: stop the cache when done to prevent goroutine leak

	// Use the custom cache instance
	now := tc.CachedTime()
	fmt.Printf("Custom cache time: %v\n", now)
	fmt.Printf("Cache resolution: %v\n", tc.Resolution())

}

func ExampleTimeCache_CachedTimeNano() {
	// Create a new cache with default settings
	tc := timecache.New()
	defer tc.Stop()

	// Get cached time as nanoseconds (zero allocation - fastest method)
	nano := tc.CachedTimeNano()
	fmt.Printf("Nanoseconds: %d\n", nano)

	// Convert nanoseconds to time.Time if needed
	tm := time.Unix(0, nano)
	fmt.Printf("Converted to time.Time: %v\n", tm)

	// Multiple calls return the same value within the cache resolution
	nano2 := tc.CachedTimeNano()
	fmt.Printf("Same value: %t\n", nano == nano2)

}

// High throughput usage
func Example_highThroughputUsage() {
	// This example demonstrates a typical high-throughput usage pattern
	// where you need to timestamp many events with minimal overhead

	// In your init() or setup code:
	tc := timecache.New()
	defer tc.Stop()

	// Simulate processing multiple events
	process := func(id int) {
		// Get timestamp with zero allocation (fastest method)
		timestamp := tc.CachedTimeNano()

		// Use timestamp in your high-performance code
		// This could be logging, metrics, or event processing
		_ = fmt.Sprintf("Event %d processed at %d", id, timestamp)
	}

	// Process multiple events with minimal overhead
	for i := 0; i < 10; i++ {
		process(i)
	}

	// All events processed with consistent, fast timestamps
	fmt.Println("All events processed with cached timestamps")

}

func ExampleTimeCache_CachedTimeString() {
	// Create a cache for logging scenarios
	tc := timecache.New()
	defer tc.Stop()

	// Get formatted time string (useful for logs, APIs, etc.)
	timeStr := tc.CachedTimeString()
	fmt.Printf("Log entry: [%s] User logged in\n", timeStr)

	// Multiple calls within cache resolution return same formatted string
	timeStr2 := tc.CachedTimeString()
	fmt.Printf("Same timestamp: %t\n", timeStr == timeStr2)

}

func ExampleNewWithResolution() {
	// Create different caches for different precision needs

	// High precision for real-time systems
	highPrecision := timecache.NewWithResolution(100 * time.Microsecond)
	defer highPrecision.Stop()

	// Balanced for general use
	balanced := timecache.NewWithResolution(1 * time.Millisecond)
	defer balanced.Stop()

	// Low precision for non-critical timing
	lowPrecision := timecache.NewWithResolution(10 * time.Millisecond)
	defer lowPrecision.Stop()

	fmt.Printf("High precision resolution: %v\n", highPrecision.Resolution())
	fmt.Printf("Balanced resolution: %v\n", balanced.Resolution())
	fmt.Printf("Low precision resolution: %v\n", lowPrecision.Resolution())

}

func ExampleDefaultCache() {
	// Access the default cache for advanced operations
	defaultCache := timecache.DefaultCache()

	// Check the default resolution
	fmt.Printf("Default cache resolution: %v\n", defaultCache.Resolution())

	// Use the default cache directly
	now := defaultCache.CachedTime()
	fmt.Printf("Time from default cache: %v\n", now)

}
