# Quick Start Guide

Get up and running with go-timecache in minutes!

## Installation

```bash
go get github.com/agilira/go-timecache
```

## Basic Usage

### Using the Global Default Cache

The simplest way to use go-timecache is with the global default cache:

```go
package main

import (
    "fmt"
    "github.com/agilira/go-timecache"
)

func main() {
    // Get current time - zero allocation!
    now := timecache.CachedTime()
    fmt.Printf("Current time: %v\n", now)

    // Get nanoseconds since epoch - fastest method
    nano := timecache.CachedTimeNano()
    fmt.Printf("Nanoseconds: %d\n", nano)

    // Get formatted time string for logging
    timeStr := timecache.CachedTimeString()
    fmt.Printf("ISO timestamp: %s\n", timeStr)
}
```

### Creating a Custom Cache

For more control over precision and lifecycle:

```go
package main

import (
    "fmt"
    "time"
    "github.com/agilira/go-timecache"
)

func main() {
    // Create cache with 1ms resolution
    tc := timecache.NewWithResolution(1 * time.Millisecond)
    defer tc.Stop() // Important: clean up resources

    // Use the custom cache
    now := tc.CachedTime()
    fmt.Printf("Custom cache time: %v\n", now)
    fmt.Printf("Cache resolution: %v\n", tc.Resolution())
}
```

## Common Use Cases

### 1. High-Volume Logging

```go
func logEvent(message string) {
    // Zero-allocation timestamp
    timestamp := timecache.CachedTimeNano()
    
    // Use in your logging system
    fmt.Printf("[%d] %s\n", timestamp, message)
}
```

### 2. Metrics Collection

```go
func recordMetric(name string, value float64) {
    // Consistent timestamps across all metrics
    timestamp := timecache.CachedTimeString()
    
    // Send to your metrics system
    sendMetric(name, value, timestamp)
}
```

### 3. Real-Time Systems

```go
func processEvent(event Event) {
    // High-precision cache for real-time systems
    tc := timecache.NewWithResolution(100 * time.Microsecond)
    defer tc.Stop()
    
    // Process with minimal latency
    startTime := tc.CachedTimeNano()
    // ... process event ...
    endTime := tc.CachedTimeNano()
    
    fmt.Printf("Processing took %d ns\n", endTime-startTime)
}
```

## Performance Tips

### Choose the Right Resolution

- **100µs - 500µs**: High precision, real-time systems
- **1ms - 10ms**: Balanced performance, most applications
- **>10ms**: Minimal CPU impact, non-critical timing

### Use Zero-Allocation Methods

```go
// ✅ Fastest - zero allocation
nano := timecache.CachedTimeNano()

// ✅ Good - minimal allocation
now := timecache.CachedTime()

// ⚠️ Slower - string allocation
timeStr := timecache.CachedTimeString()
```

### Cache Lifecycle Management

```go
// ✅ Always stop custom caches
tc := timecache.New()
defer tc.Stop()

// ✅ Global cache stops automatically on shutdown
// (but you can stop it manually if needed)
timecache.StopDefaultCache()
```

## Migration from time.Now()

### Before (slow)
```go
func logMessage(msg string) {
    timestamp := time.Now() // Allocates memory
    fmt.Printf("[%v] %s\n", timestamp, msg)
}
```

### After (fast)
```go
func logMessage(msg string) {
    timestamp := timecache.CachedTimeNano() // Zero allocation
    fmt.Printf("[%d] %s\n", timestamp, msg)
}
```

## Next Steps

- Read the [API Documentation](API.md) for complete reference
- Check [Performance Guide](PERFORMANCE.md) for optimization tips
- See [Examples](../example_test.go) for more use cases
- Visit [godoc.org](https://godoc.org/github.com/agilira/go-timecache) for online documentation

## Need Help?

- Check the [FAQ](FAQ.md)
- Open an [issue](https://github.com/agilira/go-timecache/issues)
- Read the [Contributing Guide](../CONTRIBUTING.md)

---

go-timecache • an AGILira library