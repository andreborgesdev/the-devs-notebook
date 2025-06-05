# Circular Buffer (Ring Buffer)

A **Circular Buffer** (also called a **Ring Buffer**) is a fixed-size data structure that uses a single, contiguous block of memory as if it were connected end-to-end. When the buffer becomes full, new data overwrites the oldest data, creating a "circular" effect.

## Key Characteristics

- **Fixed Size**: Memory allocated once, size never changes
- **Overwrite Behavior**: New data overwrites old when buffer is full
- **Efficient Memory Usage**: No dynamic allocation/deallocation
- **Cache Friendly**: Contiguous memory access pattern
- **Lock-Free Capable**: Can be implemented without locks for single producer/consumer

## Core Concepts

### Pointers

- **Head (Read Pointer)**: Points to the oldest data (next to read)
- **Tail (Write Pointer)**: Points to the next position to write
- **Size**: Current number of elements
- **Capacity**: Maximum number of elements

### States

- **Empty**: `head == tail && size == 0`
- **Full**: `size == capacity`
- **Partial**: `0 < size < capacity`

## Time Complexity

| Operation | Time Complexity |
| --------- | --------------- |
| Enqueue   | O(1)            |
| Dequeue   | O(1)            |
| Peek      | O(1)            |
| Is Full   | O(1)            |
| Is Empty  | O(1)            |

## Java Implementation

```java showLineNumbers
public class CircularBuffer<T> {
    private final T[] buffer;
    private int head;     // Read pointer
    private int tail;     // Write pointer
    private int size;     // Current number of elements
    private final int capacity;

    @SuppressWarnings("unchecked")
    public CircularBuffer(int capacity) {
        this.capacity = capacity;
        this.buffer = (T[]) new Object[capacity];
        this.head = 0;
        this.tail = 0;
        this.size = 0;
    }

    public boolean enqueue(T item) {
        if (isFull()) {
            // Overwrite oldest data
            buffer[tail] = item;
            tail = (tail + 1) % capacity;
            head = (head + 1) % capacity; // Move head forward
            return true;
        }

        buffer[tail] = item;
        tail = (tail + 1) % capacity;
        size++;
        return true;
    }

    public T dequeue() {
        if (isEmpty()) {
            return null;
        }

        T item = buffer[head];
        buffer[head] = null; // Help GC
        head = (head + 1) % capacity;
        size--;
        return item;
    }

    public T peek() {
        return isEmpty() ? null : buffer[head];
    }

    public boolean isEmpty() {
        return size == 0;
    }

    public boolean isFull() {
        return size == capacity;
    }

    public int size() {
        return size;
    }

    public int remaining() {
        return capacity - size;
    }
}
```

## Non-Overwriting Version

```java showLineNumbers
public class SafeCircularBuffer<T> {
    private final T[] buffer;
    private int head;
    private int tail;
    private int size;
    private final int capacity;

    public boolean enqueue(T item) {
        if (isFull()) {
            return false; // Don't overwrite, reject new data
        }

        buffer[tail] = item;
        tail = (tail + 1) % capacity;
        size++;
        return true;
    }

    // Other methods remain the same...
}
```

## Use Cases

### 1. **Audio/Video Streaming**

Buffer audio samples or video frames for smooth playback

### 2. **Logging Systems**

Keep recent log entries, automatically discarding old ones

### 3. **Network Packet Buffers**

Handle network data with bounded memory usage

### 4. **Real-Time Data Processing**

Process sensor data streams without unbounded memory growth

### 5. **Producer-Consumer Problems**

Efficient communication between threads

### 6. **Moving Averages**

Calculate rolling statistics over fixed windows

```java
public class MovingAverage {
    private final CircularBuffer<Double> buffer;
    private double sum;

    public MovingAverage(int windowSize) {
        this.buffer = new CircularBuffer<>(windowSize);
        this.sum = 0.0;
    }

    public double addValue(double value) {
        if (buffer.isFull()) {
            Double oldValue = buffer.peek();
            sum -= oldValue;
        }

        buffer.enqueue(value);
        sum += value;

        return sum / buffer.size();
    }
}
```

## Thread-Safe Implementation

```java showLineNumbers
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class ThreadSafeCircularBuffer<T> {
    private final T[] buffer;
    private volatile int head;
    private volatile int tail;
    private volatile int size;
    private final int capacity;
    private final ReadWriteLock lock = new ReentrantReadWriteLock();

    public boolean enqueue(T item) {
        lock.writeLock().lock();
        try {
            // Implementation same as above
            return true;
        } finally {
            lock.writeLock().unlock();
        }
    }

    public T dequeue() {
        lock.writeLock().lock();
        try {
            // Implementation same as above
            return null;
        } finally {
            lock.writeLock().unlock();
        }
    }

    public T peek() {
        lock.readLock().lock();
        try {
            return isEmpty() ? null : buffer[head];
        } finally {
            lock.readLock().unlock();
        }
    }
}
```

## Lock-Free Implementation (Single Producer/Consumer)

```java showLineNumbers
import java.util.concurrent.atomic.AtomicInteger;

public class LockFreeCircularBuffer<T> {
    private final T[] buffer;
    private final AtomicInteger head = new AtomicInteger(0);
    private final AtomicInteger tail = new AtomicInteger(0);
    private final int capacity;

    @SuppressWarnings("unchecked")
    public LockFreeCircularBuffer(int capacity) {
        // Capacity must be power of 2 for efficient modulo
        this.capacity = nextPowerOfTwo(capacity);
        this.buffer = (T[]) new Object[this.capacity];
    }

    public boolean enqueue(T item) {
        int currentTail = tail.get();
        int nextTail = (currentTail + 1) & (capacity - 1); // Fast modulo for power of 2

        if (nextTail == head.get()) {
            return false; // Buffer full
        }

        buffer[currentTail] = item;
        tail.set(nextTail);
        return true;
    }

    public T dequeue() {
        int currentHead = head.get();
        if (currentHead == tail.get()) {
            return null; // Buffer empty
        }

        T item = buffer[currentHead];
        buffer[currentHead] = null;
        head.set((currentHead + 1) & (capacity - 1));
        return item;
    }

    private int nextPowerOfTwo(int n) {
        int power = 1;
        while (power < n) {
            power <<= 1;
        }
        return power;
    }
}
```

## Advantages

- **Constant Time Operations**: All operations are O(1)
- **Memory Efficient**: Fixed memory footprint
- **Cache Friendly**: Sequential memory access
- **No Fragmentation**: Reuses same memory locations
- **Predictable Performance**: No garbage collection spikes

## Disadvantages

- **Fixed Size**: Cannot grow beyond initial capacity
- **Data Loss**: May overwrite unread data when full
- **Complexity**: Index wrapping logic can be error-prone
- **Memory Waste**: May not fully utilize allocated space

## Implementation Variations

### 1. **Power of 2 Sizing**

Use bitwise operations for faster modulo:

```java
index = (index + 1) & (capacity - 1); // Instead of (index + 1) % capacity
```

### 2. **Separate Read/Write Buffers**

Use two separate arrays for better cache performance in producer/consumer scenarios

### 3. **Memory Barriers**

Add memory barriers for correct ordering in concurrent environments

## Interview Tips

- **Understand the modulo operation**: `(index + 1) % capacity` for wrapping
- **Know power of 2 optimization**: Bitwise AND for faster modulo
- **Discuss thread safety**: Various approaches from locks to lock-free
- **Memory considerations**: Fixed vs dynamic allocation trade-offs
- **Use cases**: Real-time systems, streaming, bounded queues

## Common Pitfalls

1. **Off-by-one errors**: Careful with empty vs full detection
2. **Thread safety**: Race conditions with head/tail pointers
3. **Memory barriers**: Ensuring visibility in concurrent access
4. **Overflow handling**: What happens when buffer is full

## Summary

**Circular Buffers** are excellent for scenarios requiring bounded memory usage with predictable performance. They're particularly valuable in real-time systems, streaming applications, and producer-consumer patterns where you need efficient FIFO behavior without dynamic memory allocation.
