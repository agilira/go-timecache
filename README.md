# go-timecache: Ultra-fast time caching for high-performance Go applications
### an AGILira library

[![CI/CD](https://github.com/agilira/go-timecache/actions/workflows/ci.yml/badge.svg)](https://github.com/agilira/go-timecache/actions/workflows/ci.yml)
[![Security](https://img.shields.io/badge/security-gosec-brightgreen.svg)](https://github.com/agilira/go-timecache/actions/workflows/ci.yml)
[![Go Report Card](https://goreportcard.com/badge/github.com/agilira/go-timecache?v=2)](https://goreportcard.com/report/github.com/agilira/go-timecache)
[![codecov](https://codecov.io/gh/agilira/go-timecache/branch/main/graph/badge.svg)](https://codecov.io/gh/agilira/go-timecache)
[![GoDoc](https://godoc.org/github.com/agilira/go-timecache?status.svg)](https://godoc.org/github.com/agilira/go-timecache)

**[Features](#features) • [Quick Start](#quick-start) • [Performance](#performance) • [Usage](#usage) • [API Reference](#api-reference) • [Documentation](#documentation)**

Complete documentation is available at: [https://agilira.github.io/go-timecache/](https://agilira.github.io/go-timecache/)

Part of our Xantos Core, `go-timecache` provides zero-allocation access to cached time values, eliminating the performance overhead of repeated `time.Now()` calls in high-throughput scenarios like logging, metrics collection, and real-time data processing.

## Features

- **Zero-allocation time access**: Get current time without heap allocations
- **Configurable precision**: Choose your ideal balance between accuracy and performance
- **Thread-safe**: Safe for concurrent use from multiple goroutines
- **Idle costs nothing**: the updater parks when nobody reads the cache, so an idle process gets no timer wake-ups; the next read refreshes the value and restarts it
- **Simple API**: Drop-in replacement for `time.Now()` with minimal code changes
- **Multiple formats**: Access time as `time.Time`, nanoseconds, or formatted string

## Compatibility and Support

go-timecache is designed for Go 1.23+ environments and follows Long-Term Support guidelines to ensure consistent performance across production deployments.

## Performance

Benchmarks show dramatic improvements over standard `time.Now()`:

```
AMD Ryzen 5 7520U with Radeon Graphics
BenchmarkTimeNow-8                      27495522           44.35 ns/op          0 B/op         0 allocs/op
BenchmarkCachedTime-8                   457731061           2.595 ns/op         0 B/op         0 allocs/op
BenchmarkCachedTimeNano-8               1000000000          0.5139 ns/op         0 B/op         0 allocs/op
BenchmarkTimeNowUnixNano-8              27020379           43.52 ns/op          0 B/op         0 allocs/op
BenchmarkCachedTimeParallel-8           1000000000          0.7152 ns/op         0 B/op         0 allocs/op
BenchmarkTimeNowParallel-8              166697638           7.231 ns/op         0 B/op         0 allocs/op
```

**Reproduce benchmarks**:
```bash
go test -bench=. -benchmem
```

* `CachedTimeNano` is **~85x faster** than `time.Now().UnixNano()`, `CachedTime` **~17x faster** than `time.Now()`
* `CachedTimeParallel` is **~10x faster** than parallel `time.Now()`
* An idle process importing the package uses no CPU: the updater parks after 10 ticks without a reader
* Zero heap allocations in all operations

## Quick Start

### Installation

```bash
go get github.com/agilira/go-timecache
```

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

## Documentation

[https://agilira.github.io/go-timecache/](https://agilira.github.io/go-timecache/)

## License

go-timecache is licensed under the [Mozilla Public License 2.0](./LICENSE).

---

go-timecache • an AGILira library
