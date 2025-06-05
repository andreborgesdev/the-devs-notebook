# JVM Internals and Garbage Collection - Complete Guide

## JVM Architecture

### JVM Components Overview

```java
/*
JVM Architecture:
┌─────────────────────────────────────────────────────────────┐
│                    Java Virtual Machine                     │
├─────────────────────────────────────────────────────────────┤
│  Class Loader Subsystem                                    │
│  ├── Bootstrap Class Loader                                │
│  ├── Extension Class Loader                                │
│  └── Application Class Loader                              │
├─────────────────────────────────────────────────────────────┤
│  Runtime Data Areas                                        │
│  ├── Method Area (Metaspace in Java 8+)                   │
│  ├── Heap Memory                                           │
│  │   ├── Young Generation                                  │
│  │   │   ├── Eden Space                                    │
│  │   │   ├── Survivor Space S0                            │
│  │   │   └── Survivor Space S1                            │
│  │   └── Old Generation (Tenured Space)                   │
│  ├── Stack Memory                                          │
│  ├── PC (Program Counter) Register                         │
│  └── Native Method Stacks                                  │
├─────────────────────────────────────────────────────────────┤
│  Execution Engine                                          │
│  ├── Interpreter                                           │
│  ├── JIT Compiler                                          │
│  └── Garbage Collector                                     │
└─────────────────────────────────────────────────────────────┘
*/
```

### Memory Areas Detailed

#### Heap Memory

```java
public class HeapMemoryExample {

    // Objects are created in heap
    private String name;           // Reference in stack, object in heap
    private List<String> items;    // Reference in stack, ArrayList in heap
    private int[] numbers;         // Reference in stack, array in heap

    public void demonstrateHeapUsage() {
        // All these objects go to heap
        String localString = new String("Hello");           // Heap
        StringBuilder sb = new StringBuilder();             // Heap
        List<Integer> list = new ArrayList<>();            // Heap
        int[] array = new int[1000];                       // Heap

        // Primitive values go to stack (method local)
        int localInt = 42;                                 // Stack
        boolean flag = true;                               // Stack
    }

    // Static variables go to Method Area/Metaspace
    private static final String CONSTANT = "Constant";     // Method Area
    private static List<String> staticList = new ArrayList<>(); // Method Area
}

// Memory allocation demonstration
public class MemoryAllocation {

    public static void main(String[] args) {
        // Young Generation allocation
        for (int i = 0; i < 1000; i++) {
            String str = new String("Object " + i);       // Eden space
            // Most of these become unreachable quickly
        }

        // Long-lived objects eventually move to Old Generation
        List<String> longLivedList = new ArrayList<>();
        for (int i = 0; i < 10000; i++) {
            longLivedList.add("Item " + i);
        }

        // Trigger garbage collection
        System.gc(); // Suggestion to JVM (not guaranteed)

        // Check memory usage
        Runtime runtime = Runtime.getRuntime();
        long totalMemory = runtime.totalMemory();
        long freeMemory = runtime.freeMemory();
        long usedMemory = totalMemory - freeMemory;

        System.out.println("Total Memory: " + totalMemory / (1024 * 1024) + " MB");
        System.out.println("Used Memory: " + usedMemory / (1024 * 1024) + " MB");
        System.out.println("Free Memory: " + freeMemory / (1024 * 1024) + " MB");
    }
}
```

#### Stack Memory

```java
public class StackMemoryExample {

    // Each thread has its own stack
    public void methodA() {
        int a = 10;                    // Stack frame for methodA
        String str = "Hello";          // Reference in stack
        methodB(a);                    // New stack frame created
    }                                  // Stack frame destroyed

    public void methodB(int param) {
        int b = param * 2;             // Stack frame for methodB
        char[] chars = new char[5];    // Reference in stack, array in heap
        methodC();                     // Another stack frame
    }                                  // Stack frame destroyed

    public void methodC() {
        boolean flag = true;           // Stack frame for methodC
        // Method returns, stack frame destroyed
    }

    // Stack overflow demonstration
    public void recursiveMethod(int depth) {
        System.out.println("Depth: " + depth);
        recursiveMethod(depth + 1);    // Eventually causes StackOverflowError
    }

    // Each thread gets its own stack
    public void demonstrateThreadStacks() {
        // Main thread stack
        int mainThreadVar = 100;

        // Create new thread with its own stack
        Thread newThread = new Thread(() -> {
            int threadVar = 200;       // Different stack
            System.out.println("Thread variable: " + threadVar);
        });

        newThread.start();
    }
}
```

#### Method Area/Metaspace

```java
public class MethodAreaExample {

    // Class-level information stored in Method Area
    private static final String CLASS_CONSTANT = "Constant";
    private static int staticVariable = 42;
    private static List<String> staticCollection = new ArrayList<>();

    // Method bytecode stored in Method Area
    public void instanceMethod() {
        System.out.println("Instance method");
    }

    public static void staticMethod() {
        System.out.println("Static method");
    }

    // Inner classes also stored in Method Area
    static class InnerClass {
        private String innerField = "Inner";
    }

    // Demonstrate class loading and Method Area usage
    public static void demonstrateClassLoading() {
        try {
            // Load class dynamically
            Class<?> clazz = Class.forName("java.util.HashMap");

            // Class metadata goes to Method Area
            System.out.println("Class name: " + clazz.getName());
            System.out.println("Methods count: " + clazz.getMethods().length);
            System.out.println("Fields count: " + clazz.getFields().length);

        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }
}
```

## Garbage Collection

### GC Fundamentals

```java
public class GCFundamentals {

    // Object lifecycle demonstration
    public void objectLifecycle() {
        // 1. Object creation - allocated in Eden space
        String str1 = new String("Hello");
        List<String> list = new ArrayList<>();

        // 2. Object usage
        list.add(str1);
        list.add("World");

        // 3. Object becomes unreachable
        str1 = null;  // String "Hello" becomes eligible for GC
        list = null;  // ArrayList becomes eligible for GC

        // 4. Garbage collection (happens automatically)
        // Objects are removed from memory
    }

    // Demonstrate different reference types
    public void referenceTypes() {
        // Strong reference - prevents GC
        String strongRef = new String("Strong");

        // Weak reference - allows GC
        WeakReference<String> weakRef = new WeakReference<>(new String("Weak"));

        // Soft reference - GC when memory pressure
        SoftReference<String> softRef = new SoftReference<>(new String("Soft"));

        // Phantom reference - for cleanup actions
        ReferenceQueue<String> queue = new ReferenceQueue<>();
        PhantomReference<String> phantomRef = new PhantomReference<>(
            new String("Phantom"), queue);

        // Force GC
        System.gc();

        System.out.println("Strong ref: " + strongRef);
        System.out.println("Weak ref: " + weakRef.get());     // May be null
        System.out.println("Soft ref: " + softRef.get());     // Usually not null
        System.out.println("Phantom ref: " + phantomRef.get()); // Always null
    }

    // Memory leak demonstration
    public static class MemoryLeakExample {
        private static List<String> staticList = new ArrayList<>();

        public void createMemoryLeak() {
            // Objects added to static collection never get GC'd
            for (int i = 0; i < 10000; i++) {
                staticList.add("Leak " + i);
            }
        }

        public void fixMemoryLeak() {
            // Clear references to allow GC
            staticList.clear();
        }
    }
}
```

### Generational Garbage Collection

```java
public class GenerationalGC {

    // Young generation objects
    public void createShortLivedObjects() {
        for (int i = 0; i < 1000; i++) {
            // These objects die young - stay in young generation
            String temp = new String("Temporary " + i);
            StringBuilder sb = new StringBuilder(temp);
            // Objects become unreachable at end of loop
        }
    }

    // Old generation objects
    private static List<String> longLivedData = new ArrayList<>();

    public void createLongLivedObjects() {
        for (int i = 0; i < 1000; i++) {
            // These survive multiple GC cycles - move to old generation
            longLivedData.add("Persistent " + i);
        }
    }

    // Demonstrate survivor space behavior
    public void survivorSpaceDemo() {
        List<String> survivors = new ArrayList<>();

        for (int generation = 0; generation < 10; generation++) {
            // Create objects that survive a few GC cycles
            for (int i = 0; i < 100; i++) {
                String survivor = "Generation " + generation + " Item " + i;
                survivors.add(survivor);
            }

            // Simulate some objects becoming unreachable
            if (generation % 3 == 0) {
                survivors.clear();
                survivors = new ArrayList<>();
            }

            // Suggest GC
            System.gc();

            System.out.println("After generation " + generation +
                             ", survivors: " + survivors.size());
        }
    }
}
```

### GC Algorithms

#### Serial GC

```java
// JVM flags: -XX:+UseSerialGC
public class SerialGCExample {

    public static void main(String[] args) {
        System.out.println("Serial GC - Single threaded");
        System.out.println("Best for: Small applications, single core machines");

        // Simulate workload
        List<byte[]> memory = new ArrayList<>();

        long startTime = System.currentTimeMillis();

        for (int i = 0; i < 1000; i++) {
            // Allocate memory
            memory.add(new byte[1024 * 1024]); // 1MB each

            // Occasionally clear some memory
            if (i % 100 == 0) {
                memory.subList(0, Math.min(50, memory.size())).clear();
            }

            if (i % 200 == 0) {
                System.out.println("Allocated " + i + " MB");
            }
        }

        long endTime = System.currentTimeMillis();
        System.out.println("Time taken: " + (endTime - startTime) + "ms");
    }
}
```

#### Parallel GC

```java
// JVM flags: -XX:+UseParallelGC -XX:ParallelGCThreads=4
public class ParallelGCExample {

    public static void main(String[] args) {
        System.out.println("Parallel GC - Multiple threads for GC");
        System.out.println("Best for: Multi-core machines, throughput-focused");

        // Get number of available processors
        int processors = Runtime.getRuntime().availableProcessors();
        System.out.println("Available processors: " + processors);

        // Simulate concurrent workload
        ExecutorService executor = Executors.newFixedThreadPool(processors);

        for (int thread = 0; thread < processors; thread++) {
            final int threadId = thread;
            executor.submit(() -> {
                List<String> threadData = new ArrayList<>();
                for (int i = 0; i < 10000; i++) {
                    threadData.add("Thread " + threadId + " Data " + i);

                    if (i % 1000 == 0) {
                        threadData.clear(); // Allow GC
                    }
                }
            });
        }

        executor.shutdown();
        try {
            executor.awaitTermination(30, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
```

#### G1 Garbage Collector

```java
// JVM flags: -XX:+UseG1GC -XX:MaxGCPauseMillis=100
public class G1GCExample {

    public static void main(String[] args) {
        System.out.println("G1 GC - Low latency, predictable pause times");
        System.out.println("Best for: Large heaps, latency-sensitive applications");

        // Simulate mixed workload (short and long-lived objects)
        List<String> longLived = new ArrayList<>();

        long startTime = System.currentTimeMillis();

        for (int i = 0; i < 10000; i++) {
            // Create short-lived objects
            List<String> shortLived = new ArrayList<>();
            for (int j = 0; j < 100; j++) {
                shortLived.add("Short lived " + i + "-" + j);
            }

            // Some objects survive longer
            if (i % 10 == 0) {
                longLived.add("Long lived " + i);
            }

            // Simulate processing
            shortLived.clear();

            if (i % 1000 == 0) {
                System.out.println("Processed " + i + " iterations");

                // Memory usage
                Runtime runtime = Runtime.getRuntime();
                long used = runtime.totalMemory() - runtime.freeMemory();
                System.out.println("Memory used: " + used / (1024 * 1024) + " MB");
            }
        }

        long endTime = System.currentTimeMillis();
        System.out.println("Time taken: " + (endTime - startTime) + "ms");
        System.out.println("Long lived objects: " + longLived.size());
    }
}
```

#### ZGC and Shenandoah

```java
// ZGC flags: -XX:+UseZGC (Java 11+)
// Shenandoah flags: -XX:+UseShenandoahGC (OpenJDK)
public class ModernGCExample {

    public static void main(String[] args) {
        System.out.println("Modern GC (ZGC/Shenandoah)");
        System.out.println("Ultra-low latency collectors");

        // Simulate very large heap usage
        Map<String, byte[]> largeDataSet = new ConcurrentHashMap<>();

        // Create large objects to test low-latency collection
        ExecutorService executor = Executors.newFixedThreadPool(4);

        for (int i = 0; i < 4; i++) {
            final int threadId = i;
            executor.submit(() -> {
                for (int j = 0; j < 1000; j++) {
                    String key = "Thread-" + threadId + "-Item-" + j;
                    byte[] data = new byte[1024 * 1024]; // 1MB
                    largeDataSet.put(key, data);

                    // Simulate processing time
                    try {
                        Thread.sleep(10);
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                        break;
                    }

                    // Occasionally remove old data
                    if (j % 100 == 0) {
                        largeDataSet.entrySet().removeIf(entry ->
                            entry.getKey().contains("-Item-" + (j - 50)));
                    }
                }
            });
        }

        // Monitor GC behavior
        Thread monitor = new Thread(() -> {
            while (!executor.isShutdown()) {
                Runtime runtime = Runtime.getRuntime();
                long total = runtime.totalMemory();
                long free = runtime.freeMemory();
                long used = total - free;

                System.out.printf("Memory: Used=%dMB, Free=%dMB, Total=%dMB%n",
                    used / (1024 * 1024), free / (1024 * 1024), total / (1024 * 1024));

                try {
                    Thread.sleep(5000);
                } catch (InterruptedException e) {
                    break;
                }
            }
        });

        monitor.start();
        executor.shutdown();

        try {
            executor.awaitTermination(60, TimeUnit.SECONDS);
            monitor.interrupt();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
```

## JVM Tuning and Monitoring

### Memory Monitoring

```java
public class MemoryMonitoring {

    public static void printMemoryInfo() {
        MemoryMXBean memoryBean = ManagementFactory.getMemoryMXBean();

        // Heap memory
        MemoryUsage heapUsage = memoryBean.getHeapMemoryUsage();
        System.out.println("Heap Memory Usage:");
        System.out.println("  Used: " + heapUsage.getUsed() / (1024 * 1024) + " MB");
        System.out.println("  Committed: " + heapUsage.getCommitted() / (1024 * 1024) + " MB");
        System.out.println("  Max: " + heapUsage.getMax() / (1024 * 1024) + " MB");

        // Non-heap memory
        MemoryUsage nonHeapUsage = memoryBean.getNonHeapMemoryUsage();
        System.out.println("Non-Heap Memory Usage:");
        System.out.println("  Used: " + nonHeapUsage.getUsed() / (1024 * 1024) + " MB");
        System.out.println("  Committed: " + nonHeapUsage.getCommitted() / (1024 * 1024) + " MB");

        // Memory pools
        List<MemoryPoolMXBean> memoryPools = ManagementFactory.getMemoryPoolMXBeans();
        for (MemoryPoolMXBean pool : memoryPools) {
            MemoryUsage usage = pool.getUsage();
            System.out.println("Pool: " + pool.getName());
            System.out.println("  Type: " + pool.getType());
            System.out.println("  Used: " + usage.getUsed() / (1024 * 1024) + " MB");
        }
    }

    public static void monitorGC() {
        List<GarbageCollectorMXBean> gcBeans = ManagementFactory.getGarbageCollectorMXBeans();

        for (GarbageCollectorMXBean gcBean : gcBeans) {
            System.out.println("GC Name: " + gcBean.getName());
            System.out.println("  Collection Count: " + gcBean.getCollectionCount());
            System.out.println("  Collection Time: " + gcBean.getCollectionTime() + " ms");
            System.out.println("  Memory Pools: " + Arrays.toString(gcBean.getMemoryPoolNames()));
        }
    }

    // Set up memory threshold notifications
    public static void setupMemoryThresholds() {
        List<MemoryPoolMXBean> memoryPools = ManagementFactory.getMemoryPoolMXBeans();

        for (MemoryPoolMXBean pool : memoryPools) {
            if (pool.getType() == MemoryType.HEAP && pool.isUsageThresholdSupported()) {
                long maxMemory = pool.getUsage().getMax();
                long threshold = (long) (maxMemory * 0.8); // 80% threshold

                pool.setUsageThreshold(threshold);

                // Add notification listener
                MemoryMXBean memoryBean = ManagementFactory.getMemoryMXBean();
                NotificationEmitter emitter = (NotificationEmitter) memoryBean;

                emitter.addNotificationListener(
                    (notification, handback) -> {
                        if (notification.getType().equals(MemoryNotificationInfo.MEMORY_THRESHOLD_EXCEEDED)) {
                            System.out.println("Memory threshold exceeded for: " + pool.getName());
                        }
                    },
                    null,
                    null
                );
            }
        }
    }
}
```

### JVM Tuning Parameters

```java
/*
Common JVM Tuning Parameters:

Heap Size:
-Xms<size>          Initial heap size
-Xmx<size>          Maximum heap size
-XX:NewRatio=<n>    Ratio of old/young generation
-XX:NewSize=<size>  Initial young generation size
-XX:MaxNewSize=<size> Maximum young generation size

Garbage Collection:
-XX:+UseSerialGC              Serial GC
-XX:+UseParallelGC            Parallel GC
-XX:+UseG1GC                  G1 GC
-XX:+UseZGC                   ZGC (Java 11+)
-XX:+UseShenandoahGC          Shenandoah GC
-XX:MaxGCPauseMillis=<ms>     Target pause time (G1)
-XX:ParallelGCThreads=<n>     Parallel GC threads

Metaspace (Java 8+):
-XX:MetaspaceSize=<size>      Initial metaspace size
-XX:MaxMetaspaceSize=<size>   Maximum metaspace size

Logging and Monitoring:
-XX:+PrintGC                  Print GC info
-XX:+PrintGCDetails           Detailed GC info
-XX:+PrintGCTimeStamps        GC timestamps
-XX:+UseGCLogFileRotation     Rotate GC logs
-XX:NumberOfGCLogFiles=<n>    Number of GC log files
-XX:GCLogFileSize=<size>      GC log file size

Performance:
-XX:+UseCompressedOops        Compressed ordinary object pointers
-XX:+UseBiasedLocking         Biased locking optimization
-XX:+OptimizeStringConcat     String concatenation optimization
*/

public class JVMTuningExample {

    // Example application with different memory patterns
    public static void main(String[] args) {
        String mode = args.length > 0 ? args[0] : "mixed";

        switch (mode) {
            case "throughput":
                throughputWorkload();
                break;
            case "latency":
                latencyWorkload();
                break;
            case "mixed":
                mixedWorkload();
                break;
            default:
                System.out.println("Unknown mode: " + mode);
        }
    }

    // High throughput workload - use Parallel GC
    // -XX:+UseParallelGC -Xms2g -Xmx4g
    private static void throughputWorkload() {
        System.out.println("Throughput-focused workload");

        List<String> data = new ArrayList<>();
        long startTime = System.currentTimeMillis();

        for (int i = 0; i < 1000000; i++) {
            data.add("Data item " + i);

            if (i % 100000 == 0) {
                System.out.println("Processed " + i + " items");
            }
        }

        long endTime = System.currentTimeMillis();
        System.out.println("Throughput workload completed in: " + (endTime - startTime) + "ms");
    }

    // Low latency workload - use G1 or ZGC
    // -XX:+UseG1GC -XX:MaxGCPauseMillis=50 -Xms4g -Xmx4g
    private static void latencyWorkload() {
        System.out.println("Latency-sensitive workload");

        Map<String, String> cache = new ConcurrentHashMap<>();
        Random random = new Random();

        for (int i = 0; i < 100000; i++) {
            String key = "key-" + random.nextInt(10000);
            String value = "value-" + i;

            cache.put(key, value);

            // Simulate request processing
            if (i % 1000 == 0) {
                long start = System.nanoTime();
                String retrieved = cache.get(key);
                long end = System.nanoTime();

                if ((end - start) > 1000000) { // > 1ms
                    System.out.println("High latency detected: " + (end - start) / 1000000.0 + "ms");
                }
            }

            // Clean up occasionally
            if (i % 5000 == 0) {
                cache.entrySet().removeIf(entry -> random.nextBoolean());
            }
        }
    }

    // Mixed workload
    private static void mixedWorkload() {
        System.out.println("Mixed workload");

        // Both throughput and latency requirements
        ExecutorService executor = Executors.newFixedThreadPool(4);

        // Background throughput task
        executor.submit(() -> {
            List<byte[]> largeObjects = new ArrayList<>();
            for (int i = 0; i < 1000; i++) {
                largeObjects.add(new byte[1024 * 1024]); // 1MB
                try {
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                    break;
                }
            }
        });

        // Latency-sensitive task
        executor.submit(() -> {
            for (int i = 0; i < 10000; i++) {
                long start = System.nanoTime();
                String result = processRequest("Request " + i);
                long end = System.nanoTime();

                long latency = (end - start) / 1000000;
                if (latency > 10) { // > 10ms
                    System.out.println("High latency: " + latency + "ms");
                }

                try {
                    Thread.sleep(10);
                } catch (InterruptedException e) {
                    break;
                }
            }
        });

        executor.shutdown();
        try {
            executor.awaitTermination(60, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    private static String processRequest(String request) {
        // Simulate processing
        return request.toUpperCase();
    }
}
```

## Performance Optimization

### Memory Leaks Detection and Prevention

```java
public class MemoryLeakPrevention {

    // Common memory leak: Static collections
    private static List<Object> staticList = new ArrayList<>(); // Potential leak

    // Common memory leak: Listeners not removed
    private EventListenerList listeners = new EventListenerList();

    // Common memory leak: ThreadLocal not cleared
    private static ThreadLocal<String> threadLocal = new ThreadLocal<>();

    public void demonstrateMemoryLeaks() {
        // Leak 1: Static collection growing unbounded
        for (int i = 0; i < 10000; i++) {
            staticList.add(new Object()); // Objects never removed
        }

        // Fix: Clear static collections or use WeakReference
        // staticList.clear();

        // Leak 2: Event listeners
        addListener(new MyEventListener());
        // Fix: Always remove listeners
        // removeListener(listener);

        // Leak 3: ThreadLocal not cleared
        threadLocal.set("Some data");
        // Fix: Always clear ThreadLocal
        // threadLocal.remove();
    }

    // Proper resource management
    public void properResourceManagement() {
        // Use try-with-resources
        try (FileInputStream fis = new FileInputStream("file.txt")) {
            // Resource automatically closed
        } catch (IOException e) {
            e.printStackTrace();
        }

        // Clear collections when done
        List<String> tempList = new ArrayList<>();
        // ... use tempList
        tempList.clear(); // Help GC
        tempList = null;  // Remove reference

        // Remove listeners
        MyEventListener listener = new MyEventListener();
        addListener(listener);
        // ... use listener
        removeListener(listener); // Important!

        // Clear ThreadLocal
        threadLocal.set("data");
        try {
            // Use threadLocal data
        } finally {
            threadLocal.remove(); // Clean up
        }
    }

    // Memory-efficient collections
    public void efficientCollections() {
        // Use appropriate initial capacity
        List<String> list = new ArrayList<>(1000); // Avoid resizing
        Map<String, String> map = new HashMap<>(1000, 0.75f);

        // Use memory-efficient data structures
        Set<String> set = new HashSet<>(); // vs TreeSet for simple lookup

        // Consider primitive collections (e.g., Trove, Eclipse Collections)
        // TIntList intList = new TIntArrayList(); // Saves memory vs List<Integer>
    }

    private void addListener(MyEventListener listener) {
        listeners.add(MyEventListener.class, listener);
    }

    private void removeListener(MyEventListener listener) {
        listeners.remove(MyEventListener.class, listener);
    }

    private static class MyEventListener {
        // Event listener implementation
    }
}

// Weak reference cache example
public class WeakReferenceCache<K, V> {
    private final Map<K, WeakReference<V>> cache = new ConcurrentHashMap<>();

    public void put(K key, V value) {
        cache.put(key, new WeakReference<>(value));
    }

    public V get(K key) {
        WeakReference<V> ref = cache.get(key);
        if (ref != null) {
            V value = ref.get();
            if (value == null) {
                cache.remove(key); // Clean up dead reference
            }
            return value;
        }
        return null;
    }

    // Periodic cleanup of dead references
    public void cleanup() {
        cache.entrySet().removeIf(entry -> entry.getValue().get() == null);
    }
}
```

## Common Interview Questions

### JVM Architecture

**Q: Explain the JVM memory structure.**
A: JVM memory is divided into Heap (Young Generation: Eden, S0, S1; Old Generation), Method Area/Metaspace, Stack (per thread), PC Register, and Native Method Stack.

**Q: What's the difference between stack and heap memory?**
A: Stack stores method-specific data (local variables, method parameters) and is thread-specific. Heap stores objects and is shared among threads.

### Garbage Collection

**Q: What is garbage collection and when does it occur?**
A: GC is the automatic memory management process that reclaims memory occupied by objects that are no longer reachable. It occurs when heap memory is low or explicitly requested.

**Q: Explain different types of GC algorithms.**
A: Serial GC (single-threaded), Parallel GC (multi-threaded for throughput), G1 GC (low-latency, large heap), ZGC/Shenandoah (ultra-low latency).

**Q: What are weak, soft, and phantom references?**
A: Strong references prevent GC, weak references allow GC, soft references are GC'd under memory pressure, phantom references are for cleanup actions after GC.

### Performance

**Q: How do you identify memory leaks in Java?**
A: Use profiling tools (JProfiler, VisualVM), monitor heap dumps, check for growing static collections, unreleased listeners, and unclosed resources.

**Q: What JVM parameters would you use for a high-throughput application?**
A: Use Parallel GC (-XX:+UseParallelGC), large heap (-Xmx), appropriate thread counts (-XX:ParallelGCThreads), and throughput-focused settings.

**Q: How does the JIT compiler improve performance?**
A: JIT compiles frequently executed bytecode to native machine code, applies optimizations like inlining and loop unrolling, and adapts to runtime behavior.
