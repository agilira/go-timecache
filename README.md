# go-timecache: Ultra-fast time caching for high-performance Go applications
### an AGILira library

[![Go](https://github.com/agilira/go-timecache/actions/workflows/go.yml/badge.svg)](https://github.com/agilira/go-timecache/actions/workflows/go.yml)
[![Security](https://img.shields.io/badge/security-gosec-brightgreen.svg)](https://github.com/agilira/go-timecache/actions)
[![Go Report Card](https://goreportcard.com/badge/github.com/agilira/go-timecache)](https://goreportcard.com/report/github.com/agilira/go-timecache)
[![codecov](https://codecov.io/gh/agilira/go-timecache/branch/main/graph/badge.svg)](https://codecov.io/gh/agilira/go-timecache)

Originally developed for Iris, `go-timecache` provides zero-allocation access to cached time values, eliminating the performance overhead of repeated `time.Now()` calls in high-throughput scenarios like logging, metrics collection, and real-time data processing.

## Features

- **Zero-allocation time access**: Get current time without heap allocations
- **Configurable precision**: Choose your ideal balance between accuracy and performance
- **Thread-safe**: Safe for concurrent use from multiple goroutines
- **Simple API**: Drop-in replacement for `time.Now()` with minimal code changes
- **Multiple formats**: Access time as `time.Time`, nanoseconds, or formatted string

## Installation

```bash
go get github.com/agilira/go-timecache
```

## Documentation

- **[Quick Start Guide](docs/QUICK_START.md)** - Get up and running in minutes
- **[API Reference](docs/API.md)** - Complete API documentation  
- **[Performance Guide](docs/PERFORMANCE.md)** - Optimization and benchmarking
- **[FAQ](docs/FAQ.md)** - Frequently asked questions
- **[Documentation Index](docs/README.md)** - All documentation in one place

## Usage

```go
import "github.com/agilira/go-timecache"

// Using the default global cache
now := timecache.CachedTime()
nanos := timecache.CachedTimeNano()  // Zero allocation!

// Create your own cache with custom settings
tc := timecache.NewWithResolution(1 * time.Millisecond)
defer tc.Stop()  // Important: remember to stop when done

customTime := tc.CachedTime()
```

## Performance

Benchmarks show dramatic improvements over standard `time.Now()`:

```
BenchmarkTimeNow-8                      25118025                42.98 ns/op            0 B/op          0 allocs/op
BenchmarkCachedTime-8                   1000000000               0.3549 ns/op          0 B/op          0 allocs/op
BenchmarkCachedTimeNano-8               1000000000               0.3574 ns/op          0 B/op          0 allocs/op
BenchmarkTimeNowUnixNano-8              27188656                42.68 ns/op            0 B/op          0 allocs/op
BenchmarkCachedTimeParallel-8           1000000000               0.1737 ns/op          0 B/op          0 allocs/op
BenchmarkTimeNowParallel-8              184139052                6.417 ns/op           0 B/op          0 allocs/op
```

* `CachedTime` is **~121x faster** than `time.Now()`
* `CachedTimeParallel` is **~37x faster** than parallel `time.Now()`
* Zero heap allocations in all operations

## When to Use

- **High-volume logging**: Eliminate time-related allocations in hot paths
- **Metrics collection**: Timestamp events with minimal overhead
- **Real-time systems**: Get consistent timestamps with predictable performance
- **Microservices**: Reduce GC pressure from frequent timestamp generation

## API Reference

### Global Functions

- `CachedTime() time.Time`: Get current time from default cache
- `CachedTimeNano() int64`: Get nanoseconds since epoch (zero allocation)
- `CachedTimeString() string`: Get formatted time string
- `DefaultCache() *TimeCache`: Access the default TimeCache instance
- `StopDefaultCache()`: Stop the default cache (use during shutdown)

### TimeCache Methods

- `New() *TimeCache`: Create a new cache with default settings
- `NewWithResolution(resolution time.Duration) *TimeCache`: Custom resolution
- `CachedTime() time.Time`: Get current time from this cache
- `CachedTimeNano() int64`: Get nanoseconds from this cache (zero allocation)
- `CachedTimeString() string`: Get formatted time from this cache
- `Resolution() time.Duration`: Get this cache's resolution
- `Stop()`: Stop this cache's background updater

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a detailed history of changes and version information.

## License

go-timecache is licensed under the [Mozilla Public License 2.0](./LICENSE).

---

go-timecache • an AGILira library
