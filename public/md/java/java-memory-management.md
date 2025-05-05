# Java Memory Management

**Memory management** in Java is a core concept that allows developers to create robust applications without manually handling memory allocation and deallocation.

The **Java Virtual Machine (JVM)** automatically manages memory, but understanding how it works is essential for writing efficient, scalable applications and for troubleshooting performance issues.

## JVM Memory Structure

| Memory Area                       | Description                                                                             |
| --------------------------------- | --------------------------------------------------------------------------------------- |
| **Heap**                          | Stores objects and class instances. Garbage Collected.                                  |
| **Stack**                         | Stores method frames (local variables, partial results). Each thread has its own stack. |
| **Metaspace (Java 8+)**           | Stores class metadata. Replaces PermGen from earlier versions.                          |
| **Program Counter (PC) Register** | Tracks the current instruction being executed.                                          |
| **Native Method Stack**           | Used by native methods written in languages like C/C++.                                 |

## Heap Memory Breakdown

| Region                             | Description                                               |
| ---------------------------------- | --------------------------------------------------------- |
| **Young Generation**               | Newly created objects. Includes Eden and Survivor spaces. |
| **Old Generation (Tenured)**       | Objects that survive multiple garbage collection cycles.  |
| **Permanent Generation (PermGen)** | (Before Java 8) Metadata storage. Replaced by Metaspace.  |

## Garbage Collection (GC)

Java automatically reclaims memory no longer in use through **Garbage Collection**.

Common GC algorithms:

- **Serial GC** — single-threaded, best for small applications.
- **Parallel GC** — multi-threaded, good for multi-core processors.
- **CMS (Concurrent Mark Sweep)** — minimizes pause times.
- **G1 (Garbage First)** — replaces CMS, optimized for larger heaps and predictable pause times.

## Common Memory Issues

- **Memory Leaks** — Unreferenced objects linger due to incorrect references.
- **OutOfMemoryError** — Not enough heap or metaspace.
- **GC Overhead Limit Exceeded** — Too much time spent in garbage collection.

## Collections and Memory Efficiency

Poorly optimized **Java Collections** can waste significant memory. For example:

```java
Map<String, List<String>> map = new HashMap<>();
```

- Large initial capacities may allocate excessive memory.
- Use appropriate initial capacities when possible.
- Prefer smaller or immutable collections where appropriate.

### Tip:

To detect collection-related memory waste:

- **Heap dump** analysis tools: Eclipse MAT, VisualVM, YourKit.
- **CPU & Memory profiling**: IntelliJ Profiler, JProfiler.

[Prevent Java Collections Wasting Memory](https://dzone.com/articles/preventing-your-java-collections-from-wasting-memo)

## Weak References

Use `WeakHashMap` or similar structures when you want to allow the garbage collector to reclaim keys when they are no longer in ordinary use.

```java
Map<Key, Value> map = new WeakHashMap<>();
```

[Read more about WeakHashMap](https://www.baeldung.com/java-weakhashmap)

## Tools for Memory Analysis

| Tool                                   | Purpose                                      |
| -------------------------------------- | -------------------------------------------- |
| **VisualVM**                           | Monitor memory usage and analyze heap dumps. |
| **JConsole**                           | Monitor memory, CPU, and threads.            |
| **Eclipse MAT (Memory Analyzer Tool)** | Advanced heap dump analysis.                 |
| **YourKit, JProfiler**                 | Full-featured profilers for memory and CPU.  |
| **IntelliJ Profiler**                  | Integrated CPU and memory profiling.         |

[InfoQ: Troubleshooting Java Memory Issues](https://www.infoq.com/articles/Troubleshooting-Java-Memory-Issues/)

[IntelliJ CPU & Memory Profiler](https://www.jetbrains.com/help/idea/cpu-profiler.html)

[Java Performance Tuning](https://stackify.com/java-performance-tuning/)

## Best Practices

- Avoid unnecessary object creation (e.g., use `StringBuilder` over `String` concatenation in loops).
- Use primitive types instead of wrapper classes when possible.
- Free up large objects when no longer needed.
- Prefer immutable objects to minimize memory leaks.
- Tune JVM parameters (`-Xms`, `-Xmx`, `-XX:+UseG1GC`, etc.).
- Profile early and often — don’t wait for production problems.

## Interview Tip

**Be ready to explain**:

- The basics of heap structure and GC.
- What causes memory leaks in Java.
- How to tune memory usage.
- How to analyze a memory leak.
- Why memory management in Java makes the language safer than C/C++ but not foolproof.

## Cheat Summary

| Concept            | Key Idea                                 |
| ------------------ | ---------------------------------------- |
| Heap               | Object storage; GC managed               |
| Stack              | Method frames, thread-specific           |
| Garbage Collection | Reclaims unused objects                  |
| WeakHashMap        | Auto-removes entries when keys are GC’ed |
| Heap Dump          | Snapshot of memory usage for analysis    |
| Profiling          | Helps identify memory hotspots           |
