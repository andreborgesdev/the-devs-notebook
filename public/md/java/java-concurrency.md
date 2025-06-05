# Java Concurrency and Multithreading

## Thread Fundamentals

### What is a Thread?

A thread is a lightweight subprocess that can run concurrently with other threads within a program. Java supports multithreading at the language level.

### Thread Lifecycle

```
NEW → RUNNABLE → BLOCKED/WAITING/TIMED_WAITING → TERMINATED
```

| State         | Description                                    |
| ------------- | ---------------------------------------------- |
| NEW           | Thread created but not started                 |
| RUNNABLE      | Thread executing or ready to execute           |
| BLOCKED       | Thread blocked waiting for monitor lock        |
| WAITING       | Thread waiting indefinitely for another thread |
| TIMED_WAITING | Thread waiting for specified period            |
| TERMINATED    | Thread execution completed                     |

## Creating Threads

### Method 1: Extending Thread Class

```java
public class MyThread extends Thread {
    private String threadName;

    public MyThread(String name) {
        this.threadName = name;
    }

    @Override
    public void run() {
        for (int i = 0; i < 5; i++) {
            System.out.println(threadName + " - Count: " + i);
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                System.out.println(threadName + " interrupted");
                return;
            }
        }
        System.out.println(threadName + " finished");
    }
}

// Usage
MyThread thread1 = new MyThread("Thread-1");
MyThread thread2 = new MyThread("Thread-2");
thread1.start();
thread2.start();
```

### Method 2: Implementing Runnable Interface

```java
public class MyRunnable implements Runnable {
    private String taskName;

    public MyRunnable(String name) {
        this.taskName = name;
    }

    @Override
    public void run() {
        for (int i = 0; i < 5; i++) {
            System.out.println(taskName + " - Count: " + i);
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                System.out.println(taskName + " interrupted");
                return;
            }
        }
        System.out.println(taskName + " finished");
    }
}

// Usage
Thread thread1 = new Thread(new MyRunnable("Task-1"));
Thread thread2 = new Thread(new MyRunnable("Task-2"));
thread1.start();
thread2.start();
```

### Method 3: Lambda Expressions

```java
// Simple runnable with lambda
Thread thread = new Thread(() -> {
    System.out.println("Running in thread: " + Thread.currentThread().getName());
});
thread.start();

// More complex example
Thread workerThread = new Thread(() -> {
    for (int i = 0; i < 10; i++) {
        System.out.println("Working... " + i);
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return;
        }
    }
});
workerThread.start();
```

### Method 4: Callable and Future

```java
import java.util.concurrent.*;

public class MyCallable implements Callable<String> {
    private String taskName;

    public MyCallable(String name) {
        this.taskName = name;
    }

    @Override
    public String call() throws Exception {
        Thread.sleep(2000);
        return "Result from " + taskName;
    }
}

// Usage
ExecutorService executor = Executors.newSingleThreadExecutor();
Future<String> future = executor.submit(new MyCallable("Task-1"));

try {
    String result = future.get();  // Blocking call
    System.out.println(result);
} catch (InterruptedException | ExecutionException e) {
    e.printStackTrace();
}

executor.shutdown();
```

## Thread Methods and Properties

### Important Thread Methods

```java
Thread currentThread = Thread.currentThread();

// Thread information
String name = currentThread.getName();
long id = currentThread.getId();
Thread.State state = currentThread.getState();
int priority = currentThread.getPriority();
boolean isAlive = currentThread.isAlive();
boolean isDaemon = currentThread.isDaemon();

// Thread control
currentThread.setName("NewName");
currentThread.setPriority(Thread.MAX_PRIORITY);  // 1-10
currentThread.setDaemon(true);

// Static methods
Thread.sleep(1000);  // Sleep for 1 second
Thread.yield();      // Hint to scheduler to switch threads
Thread.interrupted(); // Check and clear interrupt status

// Instance methods
thread.start();      // Start thread execution
thread.join();       // Wait for thread to complete
thread.join(5000);   // Wait max 5 seconds
thread.interrupt();  // Interrupt the thread
```

## Synchronization

### The Problem: Race Conditions

```java
public class Counter {
    private int count = 0;

    public void increment() {
        count++;  // Not atomic! Read-modify-write operation
    }

    public int getCount() {
        return count;
    }
}

// Race condition example
Counter counter = new Counter();

Runnable task = () -> {
    for (int i = 0; i < 1000; i++) {
        counter.increment();
    }
};

Thread t1 = new Thread(task);
Thread t2 = new Thread(task);
t1.start();
t2.start();

t1.join();
t2.join();

System.out.println("Count: " + counter.getCount()); // May not be 2000!
```

### Synchronized Methods

```java
public class SynchronizedCounter {
    private int count = 0;

    public synchronized void increment() {
        count++;  // Now thread-safe
    }

    public synchronized int getCount() {
        return count;
    }

    // Static synchronized method
    private static int staticCount = 0;

    public static synchronized void incrementStatic() {
        staticCount++;
    }
}
```

### Synchronized Blocks

```java
public class SynchronizedBlockExample {
    private int count = 0;
    private final Object lock = new Object();

    public void increment() {
        synchronized (lock) {
            count++;
        }
    }

    public void incrementWithThis() {
        synchronized (this) {
            count++;
        }
    }

    public void incrementWithClass() {
        synchronized (SynchronizedBlockExample.class) {
            count++;
        }
    }
}
```

### Volatile Keyword

```java
public class VolatileExample {
    private volatile boolean flag = false;
    private volatile int counter = 0;

    public void setFlag() {
        flag = true;  // Immediately visible to all threads
    }

    public boolean isFlag() {
        return flag;
    }

    // Note: volatile doesn't guarantee atomicity
    public void incrementCounter() {
        counter++;  // Still not thread-safe for compound operations
    }
}
```

## Locks and Advanced Synchronization

### ReentrantLock

```java
import java.util.concurrent.locks.ReentrantLock;

public class ReentrantLockExample {
    private final ReentrantLock lock = new ReentrantLock();
    private int count = 0;

    public void increment() {
        lock.lock();
        try {
            count++;
        } finally {
            lock.unlock();  // Always unlock in finally block
        }
    }

    public boolean tryIncrement() {
        if (lock.tryLock()) {
            try {
                count++;
                return true;
            } finally {
                lock.unlock();
            }
        }
        return false;
    }

    public boolean tryIncrementWithTimeout() throws InterruptedException {
        if (lock.tryLock(1, TimeUnit.SECONDS)) {
            try {
                count++;
                return true;
            } finally {
                lock.unlock();
            }
        }
        return false;
    }
}
```

### ReadWriteLock

```java
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class ReadWriteLockExample {
    private final ReadWriteLock lock = new ReentrantReadWriteLock();
    private final Map<String, String> data = new HashMap<>();

    public String read(String key) {
        lock.readLock().lock();
        try {
            return data.get(key);
        } finally {
            lock.readLock().unlock();
        }
    }

    public void write(String key, String value) {
        lock.writeLock().lock();
        try {
            data.put(key, value);
        } finally {
            lock.writeLock().unlock();
        }
    }
}
```

### StampedLock (Java 8+)

```java
import java.util.concurrent.locks.StampedLock;

public class StampedLockExample {
    private final StampedLock lock = new StampedLock();
    private double x, y;

    public void write(double newX, double newY) {
        long stamp = lock.writeLock();
        try {
            x = newX;
            y = newY;
        } finally {
            lock.unlockWrite(stamp);
        }
    }

    public double distanceFromOrigin() {
        long stamp = lock.tryOptimisticRead();
        double curX = x, curY = y;

        if (!lock.validate(stamp)) {
            stamp = lock.readLock();
            try {
                curX = x;
                curY = y;
            } finally {
                lock.unlockRead(stamp);
            }
        }
        return Math.sqrt(curX * curX + curY * curY);
    }
}
```

## Thread Communication

### wait(), notify(), and notifyAll()

```java
public class ProducerConsumer {
    private final Object lock = new Object();
    private boolean dataReady = false;
    private String data;

    public void produce(String newData) throws InterruptedException {
        synchronized (lock) {
            while (dataReady) {
                lock.wait();  // Wait until data is consumed
            }

            data = newData;
            dataReady = true;
            System.out.println("Produced: " + data);
            lock.notifyAll();  // Notify all waiting consumers
        }
    }

    public String consume() throws InterruptedException {
        synchronized (lock) {
            while (!dataReady) {
                lock.wait();  // Wait until data is available
            }

            String consumedData = data;
            dataReady = false;
            System.out.println("Consumed: " + consumedData);
            lock.notifyAll();  // Notify all waiting producers
            return consumedData;
        }
    }
}
```

### Condition Variables

```java
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

public class ConditionExample {
    private final ReentrantLock lock = new ReentrantLock();
    private final Condition notEmpty = lock.newCondition();
    private final Condition notFull = lock.newCondition();
    private final Queue<String> queue = new LinkedList<>();
    private final int capacity = 10;

    public void produce(String item) throws InterruptedException {
        lock.lock();
        try {
            while (queue.size() == capacity) {
                notFull.await();  // Wait until queue is not full
            }

            queue.offer(item);
            System.out.println("Produced: " + item);
            notEmpty.signal();  // Signal that queue is not empty
        } finally {
            lock.unlock();
        }
    }

    public String consume() throws InterruptedException {
        lock.lock();
        try {
            while (queue.isEmpty()) {
                notEmpty.await();  // Wait until queue is not empty
            }

            String item = queue.poll();
            System.out.println("Consumed: " + item);
            notFull.signal();  // Signal that queue is not full
            return item;
        } finally {
            lock.unlock();
        }
    }
}
```

## Executor Framework

### Types of Executors

```java
import java.util.concurrent.*;

// Single thread executor
ExecutorService singleExecutor = Executors.newSingleThreadExecutor();

// Fixed thread pool
ExecutorService fixedPool = Executors.newFixedThreadPool(4);

// Cached thread pool (creates threads as needed)
ExecutorService cachedPool = Executors.newCachedThreadPool();

// Scheduled executor
ScheduledExecutorService scheduledExecutor = Executors.newScheduledThreadPool(2);

// Work stealing pool (Java 8+)
ExecutorService workStealingPool = Executors.newWorkStealingPool();
```

### Using ExecutorService

```java
ExecutorService executor = Executors.newFixedThreadPool(3);

// Submit Runnable tasks
Future<?> future1 = executor.submit(() -> {
    System.out.println("Task 1 executed by " + Thread.currentThread().getName());
});

// Submit Callable tasks
Future<String> future2 = executor.submit(() -> {
    Thread.sleep(1000);
    return "Task 2 result";
});

// Execute without Future
executor.execute(() -> {
    System.out.println("Task 3 executed");
});

// Get results
try {
    String result = future2.get(2, TimeUnit.SECONDS);
    System.out.println(result);
} catch (TimeoutException e) {
    future2.cancel(true);  // Cancel if timeout
} catch (InterruptedException | ExecutionException e) {
    e.printStackTrace();
}

// Shutdown executor
executor.shutdown();
try {
    if (!executor.awaitTermination(5, TimeUnit.SECONDS)) {
        executor.shutdownNow();
    }
} catch (InterruptedException e) {
    executor.shutdownNow();
}
```

### CompletableFuture (Java 8+)

```java
// Simple async computation
CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
    try {
        Thread.sleep(1000);
    } catch (InterruptedException e) {
        throw new RuntimeException(e);
    }
    return "Hello";
});

// Chain operations
CompletableFuture<String> result = future
    .thenApply(s -> s + " World")
    .thenApply(s -> s + "!")
    .exceptionally(throwable -> "Error: " + throwable.getMessage());

// Non-blocking get
result.thenAccept(System.out::println);

// Combining futures
CompletableFuture<String> future1 = CompletableFuture.supplyAsync(() -> "Hello");
CompletableFuture<String> future2 = CompletableFuture.supplyAsync(() -> "World");

CompletableFuture<String> combined = future1.thenCombine(future2, (s1, s2) -> s1 + " " + s2);

// All of
CompletableFuture<Void> allOf = CompletableFuture.allOf(future1, future2);
allOf.join();  // Wait for all to complete

// Any of
CompletableFuture<Object> anyOf = CompletableFuture.anyOf(future1, future2);
```

## Concurrent Collections

### ConcurrentHashMap

```java
import java.util.concurrent.ConcurrentHashMap;

ConcurrentHashMap<String, Integer> map = new ConcurrentHashMap<>();

// Thread-safe operations
map.put("key1", 1);
map.putIfAbsent("key2", 2);
map.replace("key1", 1, 10);  // Replace only if current value is 1
map.compute("key3", (key, val) -> val == null ? 1 : val + 1);
map.merge("key4", 1, Integer::sum);

// Atomic operations
map.forEach((key, value) -> System.out.println(key + ": " + value));
map.search(1, (key, value) -> value > 5 ? key : null);
map.reduce(1, (key, value) -> value, Integer::sum);
```

### CopyOnWriteArrayList

```java
import java.util.concurrent.CopyOnWriteArrayList;

// Good for read-heavy, write-light scenarios
CopyOnWriteArrayList<String> list = new CopyOnWriteArrayList<>();
list.add("item1");
list.add("item2");

// Safe iteration even during modifications
for (String item : list) {
    // Another thread can modify the list during iteration
    System.out.println(item);
}
```

### BlockingQueue Implementations

```java
import java.util.concurrent.*;

// ArrayBlockingQueue - bounded queue
BlockingQueue<String> boundedQueue = new ArrayBlockingQueue<>(10);

// LinkedBlockingQueue - optionally bounded
BlockingQueue<String> unboundedQueue = new LinkedBlockingQueue<>();
BlockingQueue<String> boundedLinkedQueue = new LinkedBlockingQueue<>(100);

// PriorityBlockingQueue - unbounded priority queue
BlockingQueue<Integer> priorityQueue = new PriorityBlockingQueue<>();

// SynchronousQueue - no capacity
BlockingQueue<String> synchronousQueue = new SynchronousQueue<>();

// Producer
executor.submit(() -> {
    try {
        boundedQueue.put("item");  // Blocks if full
        boundedQueue.offer("item", 1, TimeUnit.SECONDS);  // Timeout
    } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
    }
});

// Consumer
executor.submit(() -> {
    try {
        String item = boundedQueue.take();  // Blocks if empty
        String item2 = boundedQueue.poll(1, TimeUnit.SECONDS);  // Timeout
    } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
    }
});
```

## Atomic Classes

### Basic Atomic Types

```java
import java.util.concurrent.atomic.*;

// AtomicInteger
AtomicInteger atomicInt = new AtomicInteger(0);
int value = atomicInt.get();
atomicInt.set(10);
int oldValue = atomicInt.getAndSet(20);
int newValue = atomicInt.incrementAndGet();
boolean updated = atomicInt.compareAndSet(20, 30);

// AtomicLong
AtomicLong atomicLong = new AtomicLong(0L);
long result = atomicLong.addAndGet(100L);

// AtomicBoolean
AtomicBoolean atomicBoolean = new AtomicBoolean(false);
boolean wasTrue = atomicBoolean.getAndSet(true);

// AtomicReference
AtomicReference<String> atomicRef = new AtomicReference<>("initial");
String oldRef = atomicRef.getAndSet("new value");
boolean success = atomicRef.compareAndSet("new value", "newer value");
```

### Advanced Atomic Operations

```java
// Custom atomic operations
AtomicInteger counter = new AtomicInteger(0);

// Update with function
counter.updateAndGet(x -> x * 2);
counter.accumulateAndGet(5, Integer::sum);

// Custom atomic object
public class AtomicCounter {
    private final AtomicReference<CounterState> state =
        new AtomicReference<>(new CounterState(0, 0));

    public void increment() {
        state.updateAndGet(current ->
            new CounterState(current.count + 1, current.version + 1));
    }

    public int getCount() {
        return state.get().count;
    }

    private static class CounterState {
        final int count;
        final int version;

        CounterState(int count, int version) {
            this.count = count;
            this.version = version;
        }
    }
}
```

## Common Concurrency Patterns

### Producer-Consumer with BlockingQueue

```java
public class ProducerConsumerExample {
    private final BlockingQueue<String> queue = new ArrayBlockingQueue<>(10);

    class Producer implements Runnable {
        @Override
        public void run() {
            try {
                for (int i = 0; i < 10; i++) {
                    String item = "Item " + i;
                    queue.put(item);
                    System.out.println("Produced: " + item);
                    Thread.sleep(100);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }

    class Consumer implements Runnable {
        @Override
        public void run() {
            try {
                while (true) {
                    String item = queue.take();
                    System.out.println("Consumed: " + item);
                    Thread.sleep(200);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }
}
```

### Thread-Safe Singleton

```java
public class ThreadSafeSingleton {
    private static volatile ThreadSafeSingleton instance;

    private ThreadSafeSingleton() {}

    public static ThreadSafeSingleton getInstance() {
        if (instance == null) {
            synchronized (ThreadSafeSingleton.class) {
                if (instance == null) {
                    instance = new ThreadSafeSingleton();
                }
            }
        }
        return instance;
    }
}

// Better approach: Initialization-on-demand holder idiom
public class Singleton {
    private Singleton() {}

    private static class SingletonHolder {
        private static final Singleton INSTANCE = new Singleton();
    }

    public static Singleton getInstance() {
        return SingletonHolder.INSTANCE;
    }
}
```

### CountDownLatch

```java
import java.util.concurrent.CountDownLatch;

public class CountDownLatchExample {
    public static void main(String[] args) throws InterruptedException {
        int taskCount = 3;
        CountDownLatch latch = new CountDownLatch(taskCount);

        for (int i = 0; i < taskCount; i++) {
            new Thread(new Task(latch, "Task-" + i)).start();
        }

        latch.await();  // Wait for all tasks to complete
        System.out.println("All tasks completed!");
    }

    static class Task implements Runnable {
        private final CountDownLatch latch;
        private final String name;

        Task(CountDownLatch latch, String name) {
            this.latch = latch;
            this.name = name;
        }

        @Override
        public void run() {
            try {
                Thread.sleep(1000);
                System.out.println(name + " completed");
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            } finally {
                latch.countDown();
            }
        }
    }
}
```

### CyclicBarrier

```java
import java.util.concurrent.CyclicBarrier;

public class CyclicBarrierExample {
    public static void main(String[] args) {
        int parties = 3;
        CyclicBarrier barrier = new CyclicBarrier(parties, () -> {
            System.out.println("All parties reached the barrier!");
        });

        for (int i = 0; i < parties; i++) {
            new Thread(new Worker(barrier, "Worker-" + i)).start();
        }
    }

    static class Worker implements Runnable {
        private final CyclicBarrier barrier;
        private final String name;

        Worker(CyclicBarrier barrier, String name) {
            this.barrier = barrier;
            this.name = name;
        }

        @Override
        public void run() {
            try {
                System.out.println(name + " is working...");
                Thread.sleep((long) (Math.random() * 2000));
                System.out.println(name + " reached the barrier");
                barrier.await();
                System.out.println(name + " continuing after barrier");
            } catch (Exception e) {
                Thread.currentThread().interrupt();
            }
        }
    }
}
```

### Semaphore

```java
import java.util.concurrent.Semaphore;

public class SemaphoreExample {
    private final Semaphore semaphore = new Semaphore(2);  // Only 2 permits

    public void accessResource() {
        try {
            semaphore.acquire();  // Acquire permit
            System.out.println(Thread.currentThread().getName() + " acquired resource");
            Thread.sleep(2000);  // Simulate work
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } finally {
            System.out.println(Thread.currentThread().getName() + " released resource");
            semaphore.release();  // Release permit
        }
    }
}
```

## Best Practices

### Thread Safety Guidelines

1. **Prefer immutable objects**
2. **Use thread-safe collections**
3. **Minimize shared mutable state**
4. **Use proper synchronization**
5. **Avoid nested locks (deadlock prevention)**
6. **Use timeout versions of blocking methods**
7. **Handle InterruptedException properly**
8. **Prefer high-level concurrency utilities over low-level primitives**

### Performance Tips

1. **Use appropriate collection types**
2. **Minimize lock contention**
3. **Use lock-free algorithms when possible**
4. **Consider using volatile for simple flags**
5. **Use executor services instead of creating threads manually**
6. **Profile and measure performance**

### Common Pitfalls

1. **Forgetting to call start() method**
2. **Using stop(), suspend(), resume() (deprecated)**
3. **Accessing shared variables without synchronization**
4. **Deadlocks from lock ordering**
5. **Not handling InterruptedException**
6. **Creating too many threads**
7. **Memory leaks from ThreadLocal**

## Interview Tips

### Common Questions

1. **Difference between Thread and Runnable**
2. **How does synchronization work?**
3. **What is volatile keyword?**
4. **Explain wait(), notify(), notifyAll()**
5. **What is deadlock and how to prevent it?**
6. **Difference between synchronized and ReentrantLock**
7. **What is ThreadLocal?**
8. **How does ConcurrentHashMap work?**
9. **What is the difference between CountDownLatch and CyclicBarrier?**
10. **How do you handle exceptions in multithreaded environments?**

### Code Examples to Remember

```java
// Proper thread interruption handling
public void interruptibleTask() {
    while (!Thread.currentThread().isInterrupted()) {
        try {
            // Do work
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();  // Restore interrupt status
            return;
        }
    }
}

// Double-checked locking
private volatile Singleton instance;

public Singleton getInstance() {
    if (instance == null) {
        synchronized (this) {
            if (instance == null) {
                instance = new Singleton();
            }
        }
    }
    return instance;
}

// Proper executor shutdown
ExecutorService executor = Executors.newFixedThreadPool(4);
try {
    // Submit tasks
} finally {
    executor.shutdown();
    try {
        if (!executor.awaitTermination(60, TimeUnit.SECONDS)) {
            executor.shutdownNow();
        }
    } catch (InterruptedException e) {
        executor.shutdownNow();
    }
}
```
