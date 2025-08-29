# API Reference

Complete API documentation for go-timecache.

## Package Overview

Package `timecache` provides ultra-fast time caching for high-performance Go applications.

## Global Functions

### CachedTimeNano

```go
func CachedTimeNano() int64
```

Returns the cached time in nanoseconds since Unix epoch from the default cache. This function provides zero-allocation access to the current timestamp and is the fastest way to get time information.

**Returns:** `int64` - Nanoseconds since January 1, 1970 UTC

**Performance:** Zero allocation, atomic read operation

**Example:**
```go
nano := timecache.CachedTimeNano()
fmt.Printf("Timestamp: %d nanoseconds\n", nano)
```

### CachedTime

```go
func CachedTime() time.Time
```

Returns the cached time as a time.Time value from the default cache. This function converts the internal nanosecond timestamp to a time.Time for convenient use with Go's time package functions.

**Returns:** `time.Time` - Current cached time

**Performance:** Minimal allocation for time.Time conversion

**Example:**
```go
now := timecache.CachedTime()
fmt.Printf("Current time: %v\n", now)
```

### CachedTimeString

```go
func CachedTimeString() string
```

Returns the cached time formatted as an RFC3339Nano string from the default cache. The returned string is in UTC timezone and follows the format: "2006-01-02T15:04:05.999999999Z07:00"

**Returns:** `string` - Formatted time string in RFC3339Nano format

**Performance:** String allocation for formatting

**Example:**
```go
timeStr := timecache.CachedTimeString()
fmt.Printf("ISO timestamp: %s\n", timeStr)
```

### DefaultCache

```go
func DefaultCache() *TimeCache
```

Returns the global default TimeCache instance. This allows access to the default cache for advanced operations like checking resolution or stopping the cache.

**Returns:** `*TimeCache` - The default cache instance

**Example:**
```go
defaultCache := timecache.DefaultCache()
fmt.Printf("Default cache resolution: %v\n", defaultCache.Resolution())
```

### StopDefaultCache

```go
func StopDefaultCache()
```

Stops the global default time cache. After calling this function, the default cache will no longer be updated and the background goroutine will terminate.

**Note:** This function is mainly intended for testing and shutdown scenarios. In normal application usage, the default cache should remain running.

**Example:**
```go
// During application shutdown
timecache.StopDefaultCache()
```

## Cache Creation Functions

### New

```go
func New() *TimeCache
```

Creates a new TimeCache with default resolution (500µs). The default resolution provides a good balance between accuracy and CPU usage for most high-throughput applications.

**Returns:** `*TimeCache` - New cache instance

**Performance:** Starts background goroutine immediately

**Example:**
```go
tc := timecache.New()
defer tc.Stop()
now := tc.CachedTime()
```

### NewWithResolution

```go
func NewWithResolution(resolution time.Duration) *TimeCache
```

Creates a new TimeCache with custom update resolution. The resolution parameter controls how frequently the cached time is updated.

**Parameters:**
- `resolution time.Duration` - Update frequency

**Returns:** `*TimeCache` - New cache instance

**Recommended Values:**
- 100µs to 500µs: High precision, suitable for real-time systems
- 1ms to 10ms: Balanced performance, good for most applications
- >10ms: Minimal CPU impact, suitable for non-critical timing

**Example:**
```go
// High precision cache
tc := timecache.NewWithResolution(100 * time.Microsecond)
defer tc.Stop()

// Balanced cache
tc2 := timecache.NewWithResolution(1 * time.Millisecond)
defer tc2.Stop()
```

## TimeCache Methods

### CachedTimeNano

```go
func (tc *TimeCache) CachedTimeNano() int64
```

Returns the cached time in nanoseconds since Unix epoch. This method provides zero-allocation access to the current timestamp and is the fastest way to get time information from the cache.

**Returns:** `int64` - Nanoseconds since January 1, 1970 UTC

**Performance:** Zero allocation, atomic read operation

**Example:**
```go
tc := timecache.New()
defer tc.Stop()
nano := tc.CachedTimeNano()
fmt.Printf("Timestamp: %d nanoseconds\n", nano)
```

### CachedTime

```go
func (tc *TimeCache) CachedTime() time.Time
```

Returns the cached time as a time.Time value. This method converts the internal nanosecond timestamp to a time.Time for convenient use with Go's time package functions.

**Returns:** `time.Time` - Current cached time

**Performance:** Minimal allocation for time.Time conversion

**Example:**
```go
tc := timecache.New()
defer tc.Stop()
now := tc.CachedTime()
fmt.Printf("Current time: %v\n", now)
```

### CachedTimeString

```go
func (tc *TimeCache) CachedTimeString() string
```

Returns the cached time formatted as an RFC3339Nano string. The returned string is in UTC timezone and follows the format: "2006-01-02T15:04:05.999999999Z07:00"

**Returns:** `string` - Formatted time string in RFC3339Nano format

**Performance:** String allocation for formatting

**Example:**
```go
tc := timecache.New()
defer tc.Stop()
timeStr := tc.CachedTimeString()
fmt.Printf("ISO timestamp: %s\n", timeStr)
```

### Resolution

```go
func (tc *TimeCache) Resolution() time.Duration
```

Returns the update frequency of this cache. This is the interval at which the cached time value is refreshed by the background updater goroutine.

**Returns:** `time.Duration` - Cache update frequency

**Example:**
```go
tc := timecache.NewWithResolution(1 * time.Millisecond)
defer tc.Stop()
fmt.Printf("Cache updates every: %v\n", tc.Resolution())
```

### Stop

```go
func (tc *TimeCache) Stop()
```

Permanently stops the time cache updater. After calling Stop, the cached time value will no longer be updated and the background goroutine will terminate.

**Important:** It is important to call Stop to prevent goroutine leaks when the cache is no longer needed.

**Example:**
```go
tc := timecache.New()
// ... use the cache ...
tc.Stop() // Clean up resources
```

## Performance Characteristics

### Memory Allocation

| Method | Allocations | Performance |
|--------|-------------|-------------|
| `CachedTimeNano()` | 0 | Fastest |
| `CachedTime()` | 1 (time.Time) | Fast |
| `CachedTimeString()` | 1 (string) | Moderate |

### Thread Safety

All methods are thread-safe and can be called concurrently from multiple goroutines without additional synchronization.

### Precision vs CPU Usage

| Resolution | Precision | CPU Usage | Use Case |
|------------|-----------|-----------|----------|
| 100µs | Very High | High | Real-time systems |
| 500µs | High | Medium | High-performance apps |
| 1ms | Good | Low | General purpose |
| 10ms | Moderate | Very Low | Non-critical timing |

## Error Handling

go-timecache is designed to be robust and doesn't return errors in normal operation. The only potential issues are:

1. **Goroutine leaks**: Always call `Stop()` on custom caches
2. **Stale time**: After calling `Stop()`, the cached time becomes stale

## Best Practices

1. **Use global functions** for simple cases
2. **Create custom caches** for specific precision needs
3. **Always stop custom caches** to prevent goroutine leaks
4. **Choose appropriate resolution** based on your needs
5. **Use CachedTimeNano()** for maximum performance
6. **Use CachedTimeString()** for logging and APIs

## See Also

- [Quick Start Guide](QUICK_START.md)
- [Performance Guide](PERFORMANCE.md)
- [Examples](../example_test.go)
- [Online Documentation](https://godoc.org/github.com/agilira/go-timecache)

---

go-timecache • an AGILira library