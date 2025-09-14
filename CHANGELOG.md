# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [v1.0.2] - 2025-09-14

### Fixed
- Resolved 2 errcheck issues for improved error handling compliance
- Enhanced code quality with comprehensive error checking

### Changed  
- Updated README with improved navigation and professional presentation
- Added compact Table of Contents for better mobile experience
- Enhanced badge collection with GoDoc documentation link

### Added
- `.codecov.yml` configuration file for coverage reporting
- Professional TOC navigation matching AGILira library standards
- GoDoc badge for direct access to API documentation

### Quality Improvements
- 100% errcheck compliance with proper error handling
- Enhanced developer experience with improved README structure
- Better project discoverability through documentation badges

### Documentation
- Improved README navigation with compact TOC design
- Enhanced badge presentation for project quality indicators
- Better mobile responsiveness for documentation access

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
- **v1.0.2** (2025-09-14): Quality improvements, README enhancements, and codecov integration

## Contributing

When adding new features or making breaking changes, please update this changelog following the format above.

### Types of Changes

- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for vulnerability fixes
