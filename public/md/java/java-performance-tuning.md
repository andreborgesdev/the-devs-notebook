# Java Performance Tuning and Optimization

## Overview

Performance optimization is crucial for enterprise Java applications. This guide covers profiling techniques, JVM tuning, memory optimization, and best practices for writing high-performance Java code.

## Performance Fundamentals

### Understanding Performance Metrics

- **Throughput**: Operations per unit time
- **Latency**: Response time for single operation
- **Memory Usage**: Heap and non-heap memory consumption
- **CPU Usage**: Processor utilization
- **Garbage Collection**: GC pause times and frequency

### Performance Trade-offs

```java
// Memory vs Speed trade-off
Map<String, ExpensiveObject> cache = new ConcurrentHashMap<>();

public ExpensiveObject getCachedObject(String key) {
    return cache.computeIfAbsent(key, k -> new ExpensiveObject(k));
}
```

## JVM Performance Tuning

### Heap Size Configuration

```bash
# Basic heap settings
-Xms4g          # Initial heap size
-Xmax8g         # Maximum heap size
-XX:NewRatio=3  # Old:Young generation ratio

# Advanced heap tuning
-XX:MaxNewSize=2g           # Maximum young generation size
-XX:SurvivorRatio=8         # Eden:Survivor ratio
-XX:MaxTenuringThreshold=15 # Objects promotion threshold
```

### Garbage Collection Tuning

```bash
# G1 Collector (recommended for large heaps)
-XX:+UseG1GC
-XX:MaxGCPauseMillis=200    # Target pause time
-XX:G1HeapRegionSize=16m    # Region size
-XX:G1NewSizePercent=30     # Young generation size
-XX:G1MaxNewSizePercent=40  # Max young generation size

# Parallel Collector (high throughput)
-XX:+UseParallelGC
-XX:ParallelGCThreads=8     # GC thread count

# ZGC (ultra-low latency)
-XX:+UseZGC
```

### JIT Compiler Optimization

```bash
# C1 and C2 compiler settings
-XX:TieredStopAtLevel=4     # Enable tiered compilation
-XX:CompileThreshold=10000  # Method compilation threshold
-XX:+PrintCompilation       # Debug compilation
```

### JVM Monitoring Flags

```bash
# GC logging
-Xlog:gc*:gc.log:time,level,tags

# Memory monitoring
-XX:+PrintGCDetails
-XX:+PrintGCTimeStamps
-XX:+PrintStringDeduplicationStatistics

# JIT monitoring
-XX:+PrintInlining
-XX:+PrintCodeCache
```

## Memory Optimization

### Object Creation Patterns

```java
// ❌ Inefficient - creates many objects
public String formatData(List<String> items) {
    String result = "";
    for (String item : items) {
        result += item + ",";
    }
    return result;
}

// ✅ Efficient - reuses StringBuilder
public String formatData(List<String> items) {
    StringBuilder sb = new StringBuilder(items.size() * 20); // Pre-size
    for (String item : items) {
        sb.append(item).append(",");
    }
    return sb.toString();
}
```

### Object Pooling

```java
public class ObjectPool<T> {
    private final Queue<T> pool = new ConcurrentLinkedQueue<>();
    private final Supplier<T> factory;
    private final Consumer<T> resetFunction;

    public ObjectPool(Supplier<T> factory, Consumer<T> resetFunction) {
        this.factory = factory;
        this.resetFunction = resetFunction;
    }

    public T acquire() {
        T object = pool.poll();
        return object != null ? object : factory.get();
    }

    public void release(T object) {
        resetFunction.accept(object);
        pool.offer(object);
    }
}

// Usage example
ObjectPool<StringBuilder> stringBuilderPool = new ObjectPool<>(
    StringBuilder::new,
    sb -> sb.setLength(0)
);
```

### Memory Leak Prevention

```java
// ❌ Memory leak - listeners not removed
public class EventPublisher {
    private final List<EventListener> listeners = new ArrayList<>();

    public void addListener(EventListener listener) {
        listeners.add(listener);
    }
    // Missing removeListener method
}

// ✅ Proper cleanup
public class EventPublisher {
    private final List<WeakReference<EventListener>> listeners = new ArrayList<>();

    public void addListener(EventListener listener) {
        listeners.add(new WeakReference<>(listener));
    }

    public void removeListener(EventListener listener) {
        listeners.removeIf(ref -> ref.get() == null || ref.get() == listener);
    }
}
```

## Collection Performance

### Choosing Right Collections

```java
// Performance characteristics
Map<String, Integer> scenarios = Map.of(
    "Random access", "ArrayList > LinkedList",
    "Frequent insertions", "LinkedList > ArrayList",
    "Thread-safe operations", "ConcurrentHashMap > Hashtable",
    "Ordered iteration", "LinkedHashMap > HashMap",
    "Memory efficient", "ArrayDeque > LinkedList"
);
```

### Collection Optimization

```java
// Pre-size collections
List<String> list = new ArrayList<>(expectedSize);
Map<String, String> map = new HashMap<>(expectedSize * 4/3);

// Use primitive collections for performance-critical code
// TIntArrayList instead of List<Integer>

// Efficient iteration
// ✅ Enhanced for loop (uses iterator)
for (String item : list) {
    process(item);
}

// ❌ Index-based iteration for LinkedList
for (int i = 0; i < list.size(); i++) {
    process(list.get(i)); // O(n) for each get()
}
```

### Stream Performance

```java
// ❌ Inefficient stream usage
list.stream()
    .filter(expensive::predicate)
    .filter(another::predicate)
    .map(complex::transformation)
    .collect(Collectors.toList());

// ✅ Optimized stream
list.parallelStream()  // Use parallel for large datasets
    .filter(item -> expensive.predicate(item) && another.predicate(item))
    .map(complex::transformation)
    .collect(Collectors.toList());

// Pre-filter before stream operations
List<Item> filtered = list.stream()
    .filter(Item::isValid)
    .collect(Collectors.toList());
```

## CPU Optimization

### Loop Optimization

```java
// ❌ Inefficient loop
for (int i = 0; i < list.size(); i++) {  // size() called each iteration
    if (expensiveCheck()) {              // Expensive operation in loop
        process(list.get(i));
    }
}

// ✅ Optimized loop
int size = list.size();
boolean shouldProcess = expensiveCheck();  // Move outside loop
for (int i = 0; i < size; i++) {
    if (shouldProcess) {
        process(list.get(i));
    }
}
```

### Method Inlining

```java
// ✅ JIT-friendly code - small methods get inlined
public final class MathUtils {
    public static int add(int a, int b) {
        return a + b;  // Simple method, likely to be inlined
    }

    public static boolean isEven(int number) {
        return (number & 1) == 0;  // Bitwise operation
    }
}
```

### Branch Prediction Optimization

```java
// ❌ Unpredictable branches
for (int i = 0; i < array.length; i++) {
    if (random.nextBoolean()) {  // Unpredictable
        process(array[i]);
    }
}

// ✅ Predictable branches
Arrays.sort(array);  // Sort first
for (int value : array) {
    if (value > THRESHOLD) {  // More predictable after sorting
        process(value);
    }
}
```

## Concurrency Performance

### Lock-Free Programming

```java
// AtomicInteger for counters
AtomicInteger counter = new AtomicInteger(0);

// Compare-and-swap operations
public boolean incrementIfLessThan(AtomicInteger value, int threshold) {
    int current;
    do {
        current = value.get();
        if (current >= threshold) {
            return false;
        }
    } while (!value.compareAndSet(current, current + 1));
    return true;
}
```

### Thread Pool Optimization

```java
// Configure thread pools based on workload
ExecutorService cpuIntensivePool = Executors.newFixedThreadPool(
    Runtime.getRuntime().availableProcessors()
);

ExecutorService ioIntensivePool = Executors.newFixedThreadPool(
    Runtime.getRuntime().availableProcessors() * 2
);

// Custom ThreadPoolExecutor for fine-tuning
ThreadPoolExecutor customPool = new ThreadPoolExecutor(
    corePoolSize,
    maximumPoolSize,
    keepAliveTime,
    TimeUnit.SECONDS,
    new LinkedBlockingQueue<>(queueCapacity),
    new ThreadFactory() {
        private final AtomicInteger threadNumber = new AtomicInteger(1);

        @Override
        public Thread newThread(Runnable r) {
            Thread t = new Thread(r, "Worker-" + threadNumber.getAndIncrement());
            t.setDaemon(false);
            return t;
        }
    }
);
```

### Parallel Processing

```java
// ForkJoinPool for divide-and-conquer algorithms
public class ParallelSum extends RecursiveTask<Long> {
    private final int[] array;
    private final int start;
    private final int end;
    private static final int THRESHOLD = 1000;

    public ParallelSum(int[] array, int start, int end) {
        this.array = array;
        this.start = start;
        this.end = end;
    }

    @Override
    protected Long compute() {
        if (end - start <= THRESHOLD) {
            long sum = 0;
            for (int i = start; i < end; i++) {
                sum += array[i];
            }
            return sum;
        }

        int mid = (start + end) / 2;
        ParallelSum leftTask = new ParallelSum(array, start, mid);
        ParallelSum rightTask = new ParallelSum(array, mid, end);

        leftTask.fork();
        long rightResult = rightTask.compute();
        long leftResult = leftTask.join();

        return leftResult + rightResult;
    }
}
```

## I/O Performance

### NIO vs Traditional I/O

```java
// Traditional I/O - blocking
try (BufferedReader reader = Files.newBufferedReader(path)) {
    String line;
    while ((line = reader.readLine()) != null) {
        processLine(line);
    }
}

// NIO - non-blocking for large files
try (FileChannel channel = FileChannel.open(path, StandardOpenOption.READ)) {
    ByteBuffer buffer = ByteBuffer.allocateDirect(8192);
    while (channel.read(buffer) > 0) {
        buffer.flip();
        processBuffer(buffer);
        buffer.clear();
    }
}
```

### Buffering Strategies

```java
// Optimal buffer sizes
private static final int BUFFER_SIZE = 8192;  // 8KB typical optimal size

// Batch database operations
public void batchInsert(List<Record> records) {
    String sql = "INSERT INTO table (col1, col2) VALUES (?, ?)";

    try (PreparedStatement stmt = connection.prepareStatement(sql)) {
        for (Record record : records) {
            stmt.setString(1, record.getCol1());
            stmt.setString(2, record.getCol2());
            stmt.addBatch();

            if (records.indexOf(record) % 1000 == 0) {
                stmt.executeBatch();  // Execute in batches
            }
        }
        stmt.executeBatch();  // Execute remaining
    }
}
```

## Profiling and Monitoring

### JVM Built-in Tools

```bash
# Java Flight Recorder
-XX:+FlightRecorder
-XX:StartFlightRecording=duration=60s,filename=profile.jfr

# JVisualVM profiling
jvisualvm --jdkhome $JAVA_HOME

# JProfiler command line
java -javaagent:jprofiler.jar=port=8849 MyApplication
```

### Application Metrics

```java
// Simple performance monitoring
public class PerformanceMonitor {
    private final Map<String, LongAdder> counters = new ConcurrentHashMap<>();
    private final Map<String, AtomicLong> timers = new ConcurrentHashMap<>();

    public void incrementCounter(String name) {
        counters.computeIfAbsent(name, k -> new LongAdder()).increment();
    }

    public void recordTime(String operation, long milliseconds) {
        timers.computeIfAbsent(operation, k -> new AtomicLong()).addAndGet(milliseconds);
    }

    public <T> T timeOperation(String operation, Supplier<T> supplier) {
        long start = System.nanoTime();
        try {
            return supplier.get();
        } finally {
            long duration = (System.nanoTime() - start) / 1_000_000; // Convert to ms
            recordTime(operation, duration);
        }
    }
}
```

### Microbenchmarking with JMH

```java
@BenchmarkMode(Mode.AverageTime)
@OutputTimeUnit(TimeUnit.NANOSECONDS)
@State(Scope.Benchmark)
public class StringConcatenationBenchmark {

    private final String[] strings = {"Hello", " ", "World", "!"};

    @Benchmark
    public String stringConcatenation() {
        String result = "";
        for (String s : strings) {
            result += s;
        }
        return result;
    }

    @Benchmark
    public String stringBuilderConcatenation() {
        StringBuilder sb = new StringBuilder();
        for (String s : strings) {
            sb.append(s);
        }
        return sb.toString();
    }
}
```

## Database Performance

### Connection Pool Optimization

```java
// HikariCP configuration
HikariConfig config = new HikariConfig();
config.setJdbcUrl("jdbc:mysql://localhost:3306/mydb");
config.setUsername("user");
config.setPassword("password");
config.setMaximumPoolSize(20);          // Pool size
config.setMinimumIdle(5);               // Minimum connections
config.setConnectionTimeout(30000);     // 30 seconds
config.setIdleTimeout(600000);          // 10 minutes
config.setMaxLifetime(1800000);         // 30 minutes
config.setLeakDetectionThreshold(60000); // 1 minute

HikariDataSource dataSource = new HikariDataSource(config);
```

### Query Optimization

```java
// Use PreparedStatement for repeated queries
private final PreparedStatement findUserStmt =
    connection.prepareStatement("SELECT * FROM users WHERE id = ?");

// Batch operations
public void insertUsers(List<User> users) {
    String sql = "INSERT INTO users (name, email) VALUES (?, ?)";

    try (PreparedStatement stmt = connection.prepareStatement(sql)) {
        for (User user : users) {
            stmt.setString(1, user.getName());
            stmt.setString(2, user.getEmail());
            stmt.addBatch();
        }
        stmt.executeBatch();
    }
}

// Pagination for large result sets
public List<User> getUsers(int page, int pageSize) {
    String sql = "SELECT * FROM users LIMIT ? OFFSET ?";
    int offset = page * pageSize;

    try (PreparedStatement stmt = connection.prepareStatement(sql)) {
        stmt.setInt(1, pageSize);
        stmt.setInt(2, offset);
        return executeQuery(stmt);
    }
}
```

## Caching Strategies

### Application-Level Caching

```java
// Caffeine cache implementation
Cache<String, ExpensiveObject> cache = Caffeine.newBuilder()
    .maximumSize(10_000)
    .expireAfterWrite(Duration.ofMinutes(10))
    .refreshAfterWrite(Duration.ofMinutes(5))
    .recordStats()
    .build();

public ExpensiveObject getObject(String key) {
    return cache.get(key, k -> createExpensiveObject(k));
}
```

### Multi-Level Caching

```java
public class MultiLevelCache<K, V> {
    private final Cache<K, V> l1Cache;  // Fast, small cache
    private final Cache<K, V> l2Cache;  // Slower, larger cache

    public V get(K key) {
        // Try L1 first
        V value = l1Cache.getIfPresent(key);
        if (value != null) {
            return value;
        }

        // Try L2
        value = l2Cache.getIfPresent(key);
        if (value != null) {
            l1Cache.put(key, value);  // Promote to L1
            return value;
        }

        // Load from source
        value = loadFromSource(key);
        l1Cache.put(key, value);
        l2Cache.put(key, value);
        return value;
    }
}
```

## Best Practices

### Code-Level Optimizations

1. **Avoid Premature Optimization**: Profile first, optimize second
2. **Use Appropriate Data Structures**: ArrayList vs LinkedList, HashMap vs TreeMap
3. **Minimize Object Creation**: Reuse objects, use object pools
4. **Optimize Loops**: Move invariants outside, use enhanced for loops
5. **Use Primitive Collections**: For performance-critical code with primitives

### JVM-Level Optimizations

1. **Tune Heap Size**: Set appropriate -Xms and -Xmx values
2. **Choose Right GC**: G1 for low latency, Parallel for throughput
3. **Enable Compression**: -XX:+UseCompressedOops for heap < 32GB
4. **Monitor GC**: Log and analyze garbage collection behavior

### System-Level Optimizations

1. **CPU Affinity**: Pin JVM to specific CPU cores
2. **NUMA Awareness**: Configure for NUMA architectures
3. **Network Tuning**: Adjust TCP buffer sizes, use NIO
4. **Disk I/O**: Use SSD, optimize file system settings

## Performance Anti-Patterns

### Common Mistakes

```java
// ❌ Anti-pattern: String concatenation in loop
String result = "";
for (int i = 0; i < 1000; i++) {
    result += "data" + i;
}

// ❌ Anti-pattern: Inefficient collection operations
List<String> list = new ArrayList<>();
for (String item : largeList) {
    if (list.contains(item)) {  // O(n) operation in loop
        continue;
    }
    list.add(item);
}

// ❌ Anti-pattern: Autoboxing in tight loops
List<Integer> numbers = new ArrayList<>();
for (int i = 0; i < 1000000; i++) {
    numbers.add(i);  // Autoboxing creates Integer objects
}

// ❌ Anti-pattern: Exception handling for control flow
try {
    Integer.parseInt(maybeNumber);
    return true;
} catch (NumberFormatException e) {
    return false;  // Using exceptions for control flow
}
```

## Interview Questions

### Fundamental Questions

1. **What are the key performance metrics in Java applications?**

   - Throughput, latency, memory usage, CPU utilization, GC performance

2. **How do you identify performance bottlenecks in Java applications?**

   - Profiling tools (JProfiler, YourKit), JVM monitoring (JVisualVM), APM tools

3. **What is the difference between -Xms and -Xmx?**
   - -Xms: Initial heap size, -Xmx: Maximum heap size

### Intermediate Questions

4. **How does garbage collection affect application performance?**

   - Stop-the-world pauses, memory fragmentation, throughput impact

5. **When would you use StringBuilder vs StringBuffer?**

   - StringBuilder: Single-threaded, better performance
   - StringBuffer: Multi-threaded, synchronized methods

6. **How do you optimize database access in Java?**
   - Connection pooling, prepared statements, batch operations, pagination

### Advanced Questions

7. **Explain the performance characteristics of different collection types.**

   - ArrayList: O(1) access, O(n) insertion
   - LinkedList: O(n) access, O(1) insertion at known position
   - HashMap: O(1) average access, O(n) worst case

8. **How would you implement a high-performance cache?**

   - Consider eviction policies, thread safety, memory management
   - Multi-level caching, cache warming strategies

9. **What are the trade-offs between different garbage collectors?**
   - Serial: Low overhead, single-threaded
   - Parallel: High throughput, multi-threaded
   - G1: Low latency, predictable pause times
   - ZGC: Ultra-low latency, concurrent collection

### Scenario-Based Questions

10. **Your application has high CPU usage. How do you diagnose and fix it?**

    - Profile CPU usage, identify hot methods, optimize algorithms
    - Check for inefficient loops, excessive object creation

11. **How would you optimize a slow web service?**
    - Database query optimization, caching strategies, connection pooling
    - Asynchronous processing, load balancing

## Summary

Java performance optimization requires understanding multiple layers:

### Key Areas

- **JVM Tuning**: Heap sizing, garbage collection, JIT compilation
- **Memory Management**: Object pooling, leak prevention, efficient data structures
- **Concurrency**: Lock-free programming, proper thread pool sizing
- **I/O Operations**: NIO, buffering, batch processing
- **Database Access**: Connection pooling, query optimization, caching

### Optimization Process

1. **Measure First**: Establish baseline performance metrics
2. **Profile**: Identify actual bottlenecks, not assumed ones
3. **Optimize**: Make targeted improvements
4. **Verify**: Measure improvements and ensure no regressions
5. **Monitor**: Continuous performance monitoring in production

### Tools and Techniques

- **Profiling**: JProfiler, YourKit, Java Flight Recorder
- **Monitoring**: JVisualVM, Application Performance Monitoring
- **Benchmarking**: JMH for microbenchmarks
- **Load Testing**: JMeter, Gatling for system testing

Understanding these concepts and being able to apply them systematically is crucial for senior Java developer interviews and building high-performance applications.
