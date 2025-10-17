// Package timecache provides ultra-fast time caching for high-performance Go applications.
//
// TimeCache eliminates the performance overhead of repeated time.Now() calls by
// maintaining a cached timestamp that is updated at configurable intervals.
// This is particularly beneficial in high-throughput scenarios like logging,
// metrics collection, and real-time data processing where frequent timestamp
// generation can become a bottleneck.
//
// Key Features:
//   - Zero-allocation time access for maximum performance
//   - Configurable update resolution (precision vs CPU usage)
//   - Thread-safe concurrent access from multiple goroutines
//   - Multiple output formats: time.Time, nanoseconds, and formatted strings
//   - Global default instance for convenience
//
// Performance Benefits:
//   - CachedTime() is ~121x faster than time.Now()
//   - CachedTimeNano() provides zero-allocation access to Unix nanoseconds
//   - Parallel access scales better than standard time.Now()
//
// Example Usage:
//
//	// Using the global default cache
//	now := timecache.CachedTime()
//	nano := timecache.CachedTimeNano() // Zero allocation!
//
//	// Create custom cache with specific resolution
//	tc := timecache.NewWithResolution(1 * time.Millisecond)
//	defer tc.Stop()
//	customTime := tc.CachedTime()
//
// Copyright (c) 2025 AGILira - A. Giordano
// Series: an AGLIra fragment
// SPDX-License-Identifier: MPL-2.0
package timecache
