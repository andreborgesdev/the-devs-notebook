# Kotlin Concurrency and Multithreading

## Thread Basics

### Creating and Running Threads

```kotlin
import kotlin.concurrent.thread

thread {
    println("Running in thread: ${Thread.currentThread().name}")
}

thread(start = false, name = "MyThread") {
    println("Custom thread")
}.start()

val thread = Thread {
    println("Traditional thread creation")
}
thread.start()
thread.join()  // Wait for completion
```

### Thread Safety Issues

```kotlin
class UnsafeCounter {
    private var count = 0

    fun increment() {
        count++  // Not thread-safe
    }

    fun get() = count
}

class SafeCounter {
    @Volatile
    private var count = 0

    @Synchronized
    fun increment() {
        count++  // Thread-safe
    }

    fun get() = count
}
```

## Synchronization Primitives

### Synchronized Blocks

```kotlin
class BankAccount(private var balance: Double) {
    private val lock = Any()

    fun deposit(amount: Double) {
        synchronized(lock) {
            balance += amount
        }
    }

    fun withdraw(amount: Double): Boolean {
        synchronized(lock) {
            return if (balance >= amount) {
                balance -= amount
                true
            } else {
                false
            }
        }
    }

    fun getBalance(): Double {
        synchronized(lock) {
            return balance
        }
    }
}
```

### Volatile Variables

```kotlin
class TaskManager {
    @Volatile
    private var isRunning = false

    fun start() {
        isRunning = true
        thread {
            while (isRunning) {
                // Do work
                Thread.sleep(100)
            }
        }
    }

    fun stop() {
        isRunning = false
    }
}
```

### Atomic Operations

```kotlin
import java.util.concurrent.atomic.AtomicInteger
import java.util.concurrent.atomic.AtomicReference

class AtomicCounter {
    private val count = AtomicInteger(0)

    fun increment() = count.incrementAndGet()
    fun get() = count.get()
}

class AtomicCache<T> {
    private val value = AtomicReference<T>()

    fun set(newValue: T) {
        value.set(newValue)
    }

    fun get(): T? = value.get()

    fun compareAndSet(expected: T, new: T): Boolean {
        return value.compareAndSet(expected, new)
    }
}
```

## Concurrent Collections

### Thread-Safe Collections

```kotlin
import java.util.concurrent.*

val concurrentMap = ConcurrentHashMap<String, Int>()
val blockingQueue = LinkedBlockingQueue<String>()
val copyOnWriteList = CopyOnWriteArrayList<String>()

concurrentMap["key"] = 1
concurrentMap.putIfAbsent("key2", 2)

blockingQueue.put("item")  // Blocking if queue is full
val item = blockingQueue.take()  // Blocking if queue is empty

copyOnWriteList.add("item")  // Thread-safe for reads
```

### Producer-Consumer Pattern

```kotlin
import java.util.concurrent.BlockingQueue
import java.util.concurrent.LinkedBlockingQueue

class ProducerConsumer {
    private val queue: BlockingQueue<String> = LinkedBlockingQueue(10)

    fun producer() = thread {
        repeat(20) { i ->
            queue.put("Item $i")
            println("Produced: Item $i")
            Thread.sleep(100)
        }
    }

    fun consumer() = thread {
        repeat(20) {
            val item = queue.take()
            println("Consumed: $item")
            Thread.sleep(200)
        }
    }

    fun start() {
        producer()
        consumer()
    }
}
```

## Thread Pools and Executors

### ExecutorService

```kotlin
import java.util.concurrent.*

val executor = Executors.newFixedThreadPool(4)

repeat(10) { i ->
    executor.submit {
        println("Task $i running on ${Thread.currentThread().name}")
        Thread.sleep(1000)
    }
}

executor.shutdown()
executor.awaitTermination(5, TimeUnit.SECONDS)
```

### Different Types of Thread Pools

```kotlin
val fixedPool = Executors.newFixedThreadPool(4)
val cachedPool = Executors.newCachedThreadPool()
val singleThread = Executors.newSingleThreadExecutor()
val scheduledPool = Executors.newScheduledThreadPool(2)

scheduledPool.schedule({
    println("Delayed task")
}, 5, TimeUnit.SECONDS)

scheduledPool.scheduleAtFixedRate({
    println("Periodic task")
}, 0, 2, TimeUnit.SECONDS)
```

### CompletableFuture

```kotlin
import java.util.concurrent.CompletableFuture

fun fetchUserAsync(id: String): CompletableFuture<User> {
    return CompletableFuture.supplyAsync {
        Thread.sleep(1000)  // Simulate network delay
        User(id, "User $id")
    }
}

fun processUserData() {
    val userFuture = fetchUserAsync("123")
    val profileFuture = fetchUserAsync("123").thenCompose { user ->
        fetchProfileAsync(user.id)
    }

    userFuture.thenAccept { user ->
        println("User: ${user.name}")
    }

    CompletableFuture.allOf(userFuture, profileFuture).join()
}
```

## Coroutines vs Threads

### Performance Comparison

```kotlin
import kotlinx.coroutines.*
import kotlin.system.measureTimeMillis

fun threadExample() {
    val time = measureTimeMillis {
        val threads = (1..10000).map {
            thread {
                Thread.sleep(1000)
            }
        }
        threads.forEach { it.join() }
    }
    println("Threads took: $time ms")
}

fun coroutineExample() = runBlocking {
    val time = measureTimeMillis {
        val jobs = (1..10000).map {
            launch {
                delay(1000)
            }
        }
        jobs.joinAll()
    }
    println("Coroutines took: $time ms")
}
```

### Memory Usage

```kotlin
fun compareMemoryUsage() {
    val runtime = Runtime.getRuntime()

    // Measure threads
    runtime.gc()
    val beforeThreads = runtime.totalMemory() - runtime.freeMemory()

    val threads = (1..1000).map {
        thread(start = false) {
            Thread.sleep(10000)
        }
    }
    threads.forEach { it.start() }

    val afterThreads = runtime.totalMemory() - runtime.freeMemory()
    println("Threads memory: ${(afterThreads - beforeThreads) / 1024 / 1024} MB")

    // Measure coroutines
    runBlocking {
        runtime.gc()
        val beforeCoroutines = runtime.totalMemory() - runtime.freeMemory()

        val jobs = (1..1000).map {
            launch {
                delay(10000)
            }
        }

        val afterCoroutines = runtime.totalMemory() - runtime.freeMemory()
        println("Coroutines memory: ${(afterCoroutines - beforeCoroutines) / 1024 / 1024} MB")

        jobs.joinAll()
    }
}
```

## Advanced Threading Patterns

### Actor Pattern

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*

sealed class CounterMsg
object IncMsg : CounterMsg()
object DecMsg : CounterMsg()
class GetMsg(val response: CompletableDeferred<Int>) : CounterMsg()

fun counterActor() = CoroutineScope(Dispatchers.Default).actor<CounterMsg> {
    var counter = 0
    for (msg in channel) {
        when (msg) {
            is IncMsg -> counter++
            is DecMsg -> counter--
            is GetMsg -> msg.response.complete(counter)
        }
    }
}

suspend fun actorExample() {
    val counter = counterActor()

    withContext(Dispatchers.Default) {
        massiveRun {
            counter.send(IncMsg)
        }
    }

    val response = CompletableDeferred<Int>()
    counter.send(GetMsg(response))
    println("Counter = ${response.await()}")
    counter.close()
}
```

### Worker Pool Pattern

```kotlin
class WorkerPool<T>(
    private val workerCount: Int,
    private val worker: suspend (T) -> Unit
) {
    private val channel = Channel<T>(Channel.UNLIMITED)

    fun start() = CoroutineScope(Dispatchers.Default).launch {
        repeat(workerCount) {
            launch {
                for (item in channel) {
                    worker(item)
                }
            }
        }
    }

    suspend fun submit(item: T) {
        channel.send(item)
    }

    fun close() {
        channel.close()
    }
}

suspend fun workerPoolExample() {
    val pool = WorkerPool<String>(4) { item ->
        println("Processing $item on ${Thread.currentThread().name}")
        delay(1000)
    }

    pool.start()

    repeat(20) { i ->
        pool.submit("Item $i")
    }

    delay(5000)
    pool.close()
}
```

### Pipeline Pattern

```kotlin
fun pipeline() = runBlocking {
    val producer = produce<Int> {
        repeat(10) { i ->
            send(i)
            delay(100)
        }
    }

    val processor = produce<String> {
        for (number in producer) {
            send("Processed: $number")
            delay(200)
        }
    }

    for (result in processor) {
        println(result)
    }
}
```

## Thread-Safe Design Patterns

### Singleton with Thread Safety

```kotlin
class ThreadSafeSingleton private constructor() {
    companion object {
        @Volatile
        private var INSTANCE: ThreadSafeSingleton? = null

        fun getInstance(): ThreadSafeSingleton {
            return INSTANCE ?: synchronized(this) {
                INSTANCE ?: ThreadSafeSingleton().also { INSTANCE = it }
            }
        }
    }
}

object KotlinSingleton {
    // Thread-safe by default
    fun doSomething() {
        println("Singleton operation")
    }
}
```

### Observer Pattern with Thread Safety

```kotlin
import java.util.concurrent.CopyOnWriteArrayList

interface Observer<T> {
    fun onChanged(value: T)
}

class ThreadSafeObservable<T> {
    private val observers = CopyOnWriteArrayList<Observer<T>>()

    fun addObserver(observer: Observer<T>) {
        observers.add(observer)
    }

    fun removeObserver(observer: Observer<T>) {
        observers.remove(observer)
    }

    fun notifyObservers(value: T) {
        observers.forEach { it.onChanged(value) }
    }
}
```

## Debugging and Testing

### Thread Debugging

```kotlin
fun debugThreads() {
    thread(name = "DebugThread") {
        println("Thread: ${Thread.currentThread().name}")
        println("Thread ID: ${Thread.currentThread().id}")
        println("Thread State: ${Thread.currentThread().state}")

        Thread.dumpStack()  // Print stack trace
    }
}
```

### Testing Concurrent Code

```kotlin
import kotlinx.coroutines.test.*
import org.junit.Test

class ConcurrentTest {
    @Test
    fun testThreadSafety() {
        val counter = AtomicCounter()
        val threads = (1..100).map {
            thread {
                repeat(1000) {
                    counter.increment()
                }
            }
        }

        threads.forEach { it.join() }
        assertEquals(100000, counter.get())
    }

    @Test
    fun testWithTimeout() = runTest {
        withTimeout(1000) {
            // Test that should complete within timeout
            delay(500)
        }
    }
}
```

## Performance Considerations

### Lock-Free Programming

```kotlin
import java.util.concurrent.atomic.AtomicReference

class LockFreeStack<T> {
    private val head = AtomicReference<Node<T>?>()

    private data class Node<T>(val item: T, val next: Node<T>?)

    fun push(item: T) {
        val newNode = Node(item, null)
        do {
            val currentHead = head.get()
            newNode.next = currentHead
        } while (!head.compareAndSet(currentHead, newNode))
    }

    fun pop(): T? {
        do {
            val currentHead = head.get() ?: return null
            val newHead = currentHead.next
        } while (!head.compareAndSet(currentHead, newHead))

        return currentHead.item
    }
}
```

### Reducing Contention

```kotlin
import java.util.concurrent.ThreadLocalRandom

class LowContentionCounter {
    private val counters = Array(Runtime.getRuntime().availableProcessors()) {
        AtomicInteger(0)
    }

    fun increment() {
        val index = ThreadLocalRandom.current().nextInt(counters.size)
        counters[index].incrementAndGet()
    }

    fun sum(): Int = counters.sumOf { it.get() }
}
```

## Best Practices

### Thread Safety Guidelines

1. **Prefer immutable objects** when possible
2. **Use thread-safe collections** for shared data
3. **Minimize shared mutable state**
4. **Use proper synchronization** for shared mutable state
5. **Prefer higher-level concurrency utilities** over low-level primitives
6. **Avoid blocking operations** in performance-critical code
7. **Use coroutines** for I/O-bound operations
8. **Profile and measure** concurrent code performance
