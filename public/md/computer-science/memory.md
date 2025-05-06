# Memory

## Overview

**Memory** in computer science refers to devices and data storage technologies that are used to store and retrieve digital information. Memory can be categorized by volatility, speed, and the role it plays in program execution.

| Type         | Description                                         |
| ------------ | --------------------------------------------------- |
| Volatile     | Data lost when power is off (e.g., RAM)             |
| Non-Volatile | Data persists without power (e.g., HDD, SSD, Flash) |
| Primary      | Directly accessible by CPU (RAM, cache)             |
| Secondary    | Slower, persistent storage (disk drives)            |

## Memory Hierarchy

| Level       | Example                     | Speed     | Cost     | Capacity  |
| ----------- | --------------------------- | --------- | -------- | --------- |
| Registers   | CPU registers               | Fastest   | High     | Very low  |
| Cache       | L1, L2, L3                  | Very Fast | High     | Low       |
| Main Memory | RAM                         | Fast      | Medium   | Medium    |
| Secondary   | SSD, HDD                    | Slow      | Low      | High      |
| Tertiary    | Magnetic tape, optical disc | Slowest   | Very Low | Very High |

## Heap vs Stack

| Feature      | Stack                                      | Heap                                           |
| ------------ | ------------------------------------------ | ---------------------------------------------- |
| Purpose      | Stores function frames and local variables | Stores dynamic memory (objects)                |
| Memory Size  | Usually smaller                            | Usually larger                                 |
| Access Speed | Faster                                     | Slower                                         |
| Allocation   | Automatically managed (LIFO)               | Requires manual management (new/delete)        |
| Lifetime     | Limited to function/block scope            | Until explicitly released or garbage collected |

### Stack Example

```java
void function() {
    int x = 10; // Allocated on stack
}
```

### Heap Example

```java
Person p = new Person(); // Allocated on heap
```

## Garbage Collection

- **Automatic memory management** in languages like Java, Python, and C#
- Frees up memory in the heap that is no longer referenced
- Common algorithms:

  - Mark and Sweep
  - Generational GC
  - Reference Counting

## Static vs Dynamic Memory

| Type           | Description                           |
| -------------- | ------------------------------------- |
| Static Memory  | Allocated at compile time, size fixed |
| Dynamic Memory | Allocated at runtime, size flexible   |

## Virtual Memory

- Combines RAM with disk space to create an illusion of a larger contiguous memory space
- Enables **process isolation** and efficient multitasking
- Implements **paging** and **segmentation**

## Memory Leaks

Occurs when allocated memory is not properly released, leading to exhaustion of available memory.

**Common Causes:**

- Unused object references held unintentionally
- Improper resource management (file handles, sockets)

## Memory Management in Popular Languages

| Language | Memory Management                     |
| -------- | ------------------------------------- |
| C/C++    | Manual (malloc/free or new/delete)    |
| Java     | Automatic (Garbage Collection)        |
| Python   | Automatic (Reference Counting + GC)   |
| Rust     | Ownership model (compile-time safety) |
| Go       | Automatic (Concurrent GC)             |

## Cache Memory

- Small, fast memory located inside or near the CPU
- Stores frequently accessed data to reduce latency
- Levels:

  - **L1 Cache** (smallest, fastest)
  - **L2 Cache**
  - **L3 Cache** (largest, shared across cores)

## Common Interview Topics

- **Stack Overflow**: Occurs when too much memory is used on the stack
- **Heap Overflow**: Occurs when heap memory exceeds limits
- **Dangling Pointer**: A pointer referencing memory that has been freed
- **Segmentation Fault**: Invalid access to memory

## Best Practices

- Avoid unnecessary object creation
- Release resources promptly
- Be aware of scope and lifetimes
- Use memory profiling tools to detect leaks and bottlenecks

## Visual Diagram

```plaintext
+------------------------+
|      Registers         |
+------------------------+
|      Cache (L1/L2/L3)  |
+------------------------+
|         RAM            |
+------------------------+
| Secondary Storage (SSD)|
+------------------------+
|  Tertiary Storage (Tape)|
+------------------------+
```

## Summary

Understanding memory concepts such as the stack, heap, garbage collection, and caching is crucial for efficient software development. Mastery of memory management enables developers to write high-performance, scalable, and reliable applications.
