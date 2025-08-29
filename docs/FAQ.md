# Frequently Asked Questions

Common questions and answers about go-timecache.

## General Questions

### What is go-timecache?

go-timecache is a high-performance time caching library for Go that eliminates the overhead of repeated `time.Now()` calls by maintaining a cached timestamp that is updated at configurable intervals.

### Why should I use go-timecache instead of time.Now()?

- **Performance**: 121x faster than `time.Now()`
- **Zero allocations**: No heap allocations for time access
- **Consistency**: Predictable performance regardless of system load
- **Configurable precision**: Choose the right balance between accuracy and CPU usage

### Is go-timecache thread-safe?

Yes, all methods are thread-safe and can be called concurrently from multiple goroutines without additional synchronization.

## Usage Questions

### How do I get started quickly?

```go
import "github.com/agilira/go-timecache"

// Use the global default cache
now := timecache.CachedTime()
nano := timecache.CachedTimeNano() // Zero allocation!
```

See the [Quick Start Guide](QUICK_START.md) for more details.

### When should I create a custom cache vs using the global one?

**Use the global cache when:**
- You need simple, consistent time access
- You don't need specific precision requirements
- You want zero setup overhead

**Create a custom cache when:**
- You need specific precision (e.g., real-time systems)
- You want to control the cache lifecycle
- You need different resolutions for different parts of your application

### What resolution should I choose?

| Resolution | Use Case | CPU Usage |
|------------|----------|-----------|
| 100µs - 500µs | Real-time systems | High |
| 1ms - 10ms | General applications | Low |
| >10ms | Non-critical timing | Very Low |

### Do I need to stop the global cache?

No, the global cache is designed to run for the lifetime of your application. Only stop it during testing or application shutdown.

### Do I need to stop custom caches?

Yes, always call `Stop()` on custom caches to prevent goroutine leaks:

```go
tc := timecache.New()
defer tc.Stop() // Important!
```

## Performance Questions

### How much faster is it really?

Based on benchmarks:
- `CachedTime()` is ~121x faster than `time.Now()`
- `CachedTimeNano()` is ~121x faster than `time.Now().UnixNano()`
- Parallel access is ~37x faster than parallel `time.Now()`

### Does it use more memory?

No, go-timecache actually reduces memory usage by eliminating allocations from frequent `time.Now()` calls.

### What about CPU usage?

The background goroutine uses minimal CPU. Higher resolution settings use more CPU but provide better precision.

### Can I use it in high-throughput scenarios?

Yes, go-timecache is specifically designed for high-throughput scenarios like:
- High-volume logging
- Metrics collection
- Real-time data processing
- Microservices

## Technical Questions

### How does it work internally?

go-timecache runs a background goroutine that updates a cached timestamp at regular intervals. All access methods use atomic operations to read the cached value safely.

### What's the precision of the cached time?

The precision depends on the resolution you choose. The default 500µs resolution means the cached time is updated every 500 microseconds.

### Is the cached time always accurate?

The cached time is accurate within the resolution interval. For example, with 1ms resolution, the cached time may be up to 1ms behind the actual time.

### Can I use it with time zones?

The cached time is always in UTC. You can convert it to other time zones using Go's time package:

```go
utcTime := timecache.CachedTime()
localTime := utcTime.Local()
```

### Does it work on all platforms?

Yes, go-timecache works on all platforms supported by Go, including Windows, macOS, Linux, and others.

## Troubleshooting

### My application is using more CPU than expected

Check your resolution setting. Higher resolution (smaller values) uses more CPU:

```go
// High CPU usage
tc := timecache.NewWithResolution(100 * time.Microsecond)

// Lower CPU usage
tc := timecache.NewWithResolution(10 * time.Millisecond)
```

### I'm getting inconsistent timestamps

Make sure you're not creating multiple caches unnecessarily. Use the global cache for consistent behavior:

```go
// ✅ Consistent
timestamp := timecache.CachedTimeNano()

// ❌ May be inconsistent
tc := timecache.New()
timestamp := tc.CachedTimeNano()
```

### My tests are failing

Make sure to stop custom caches in your tests:

```go
func TestSomething(t *testing.T) {
    tc := timecache.New()
    defer tc.Stop() // Important for tests
    
    // Your test code
}
```

### The cached time seems stale

This can happen if:
1. The cache was stopped
2. The resolution is too high (too infrequent updates)
3. System time was changed

## Integration Questions

### Can I use it with logging libraries?

Yes, go-timecache works well with any logging library:

```go
// With logrus
log.WithField("timestamp", timecache.CachedTimeNano()).Info("message")

// With zap
logger.Info("message", zap.Int64("timestamp", timecache.CachedTimeNano()))
```

### Can I use it with metrics libraries?

Yes, it's perfect for metrics collection:

```go
// With Prometheus
counter.WithLabelValues("event").Add(1)
gauge.WithLabelValues("timestamp").Set(float64(timecache.CachedTimeNano()))
```

### Can I use it with HTTP servers?

Yes, it's great for request timing:

```go
func handler(w http.ResponseWriter, r *http.Request) {
    startTime := timecache.CachedTimeNano()
    
    // Process request
    
    duration := timecache.CachedTimeNano() - startTime
    log.Printf("Request took %d ns", duration)
}
```

## Contributing Questions

### How can I contribute?

See the [Contributing Guide](../CONTRIBUTING.md) for details on how to contribute to the project.

### How do I report a bug?

Open an [issue](https://github.com/agilira/go-timecache/issues) with:
- Description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Go version and platform

### How do I request a feature?

Open an [issue](https://github.com/agilira/go-timecache/issues) with:
- Description of the feature
- Use case and motivation
- Proposed API design (if applicable)

## Still Have Questions?

- Check the [API Reference](API.md) for detailed documentation
- Review the [Performance Guide](PERFORMANCE.md) for optimization tips
- Look at the [Examples](../example_test.go) for practical usage
- Open an [issue](https://github.com/agilira/go-timecache/issues) for specific questions

---

go-timecache • an AGILira library