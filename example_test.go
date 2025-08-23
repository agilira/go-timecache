// example_test.go: Usage examples for timecache library
//
// Copyright (c) 2025 AGILira
// Series: an AGLIra fragment
// SPDX-License-Identifier: MPL-2.0

package timecache_test

import (
	"fmt"
	"time"

	"github.com/agilira/go-timecache"
)

func Example() {
	// Using the default global cache
	now := timecache.CachedTime()
	fmt.Printf("Current time: %v\n", now)

	// Get time as Unix nano (zero allocation)
	nano := timecache.CachedTimeNano()
	fmt.Printf("Nanoseconds since epoch: %d\n", nano)

	// Get formatted time string
	timeStr := timecache.CachedTimeString()
	fmt.Printf("Formatted time: %s\n", timeStr)
}

func ExampleNew() {
	// Create a custom time cache with 1ms resolution
	tc := timecache.NewWithResolution(1 * time.Millisecond)
	defer tc.Stop() // Important: stop the cache when done to prevent goroutine leak

	// Use the custom cache instance
	now := tc.CachedTime()
	fmt.Printf("Custom cache time: %v\n", now)
}

func ExampleTimeCache_CachedTimeNano() {
	// Create a new cache with default settings
	tc := timecache.New()
	defer tc.Stop()

	// Get cached time as nanoseconds (zero allocation)
	nano := tc.CachedTimeNano()
	fmt.Printf("Nanoseconds: %d\n", nano)

	// Convert nanoseconds to time.Time if needed
	tm := time.Unix(0, nano)
	fmt.Printf("Converted to time.Time: %v\n", tm)
}

// High throughput usage
func Example_highThroughputUsage() {
	// This example demonstrates a typical high-throughput usage pattern

	// In your init() or setup code:
	tc := timecache.New()
	defer tc.Stop()

	// Simulate processing multiple events
	process := func(id int) {
		// Get timestamp with zero allocation
		timestamp := tc.CachedTimeNano()

		// Use timestamp in your high-performance code
		_ = fmt.Sprintf("Event %d processed at %d", id, timestamp)
	}

	// Process multiple events with minimal overhead
	for i := 0; i < 10; i++ {
		process(i)
	}
}
