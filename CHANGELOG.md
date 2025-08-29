# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive godoc documentation for all public APIs
- Detailed examples for all functions and methods
- Separate `doc.go` file for clean package documentation
- Performance benchmarks showing 121x speed improvement over `time.Now()`

### Changed
- Improved code organization with separated documentation
- Enhanced example code with better explanations

### Documentation
- Added complete API documentation following Go standards
- Created comprehensive examples covering all use cases
- Improved README with detailed performance metrics

## [v1.0.0] - 2025-01-27

### Added
- Initial release of go-timecache library
- `TimeCache` struct for cached time access
- Zero-allocation time access methods:
  - `CachedTimeNano()` - returns nanoseconds since Unix epoch
  - `CachedTime()` - returns time.Time value
  - `CachedTimeString()` - returns RFC3339Nano formatted string
- Global default cache instance with automatic initialization
- Configurable update resolution via `NewWithResolution()`
- Thread-safe concurrent access from multiple goroutines
- Background goroutine for automatic time updates
- Cache lifecycle management with `Stop()` method
- Global API functions for convenient access:
  - `CachedTimeNano()` - global zero-allocation access
  - `CachedTime()` - global time.Time access
  - `CachedTimeString()` - global formatted string access
  - `DefaultCache()` - access to default cache instance
  - `StopDefaultCache()` - stop default cache (for testing/shutdown)

### Performance
- Zero heap allocations for time access
- Atomic operations for thread safety
- Configurable precision vs CPU usage trade-offs
- Optimized for high-throughput scenarios

### Use Cases
- High-volume logging with minimal overhead
- Metrics collection with consistent timestamps
- Real-time systems requiring predictable performance
- Microservices reducing GC pressure from frequent timestamps

---

## Version History

- **v1.0.0** (2025-01-27): Initial release with core functionality
- **Unreleased**: Documentation improvements and code organization

## Contributing

When adding new features or making breaking changes, please update this changelog following the format above.

### Types of Changes

- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for vulnerability fixes
