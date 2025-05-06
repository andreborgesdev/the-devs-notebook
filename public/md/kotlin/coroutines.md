# Kotlin Coroutines

## What Are Coroutines?

**Coroutines** are a concurrency design pattern that allows asynchronous, non-blocking code to be written in a sequential manner. Coroutines are a lightweight alternative to threads, managed by the Kotlin runtime rather than the operating system.

Introduced as part of Kotlin's standard library, coroutines simplify tasks such as:

- Performing background operations
- Managing concurrency
- Writing asynchronous code without callbacks

## Why Use Coroutines?

| Benefit                | Description                                                                           |
| ---------------------- | ------------------------------------------------------------------------------------- |
| Lightweight            | Hundreds of thousands of coroutines can run concurrently with minimal memory overhead |
| Sequential code style  | Write asynchronous code as if it were synchronous                                     |
| Non-blocking           | Keeps main/UI thread responsive                                                       |
| Built-in cancellation  | Easily cancel long-running tasks                                                      |
| Structured concurrency | Hierarchical coroutine management                                                     |

## Basic Syntax

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
    launch {
        delay(1000L)
        println("World!")
    }
    println("Hello,")
}
```

**Output:**

```
Hello,
World!
```

## Key Coroutine Builders

| Builder       | Description                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------- |
| `launch`      | Fire-and-forget. Returns a `Job`                                                                        |
| `async`       | Returns a `Deferred` for obtaining a result asynchronously                                              |
| `runBlocking` | Blocks the current thread until coroutine completes. Mainly for bridging blocking and non-blocking code |

### Example: `launch` vs `async`

```kotlin
runBlocking {
    launch {
        println("Launch: Running in coroutine.")
    }

    val result = async {
        "Async: Result from coroutine."
    }
    println(result.await())
}
```

## Suspending Functions

Functions marked with the `suspend` keyword can be paused and resumed without blocking the thread.

```kotlin
suspend fun doWork() {
    delay(1000)
    println("Work done!")
}
```

```kotlin
runBlocking {
    doWork()
}
```

## Coroutine Scopes

**Scopes** control the lifecycle of coroutines.

| Scope            | Usage                                               |
| ---------------- | --------------------------------------------------- |
| `GlobalScope`    | Application-wide coroutines                         |
| `runBlocking`    | Blocking scope, useful for testing or bridging      |
| `CoroutineScope` | Structured concurrency, tied to specific components |

```kotlin
CoroutineScope(Dispatchers.IO).launch {
    // Background work here
}
```

## Dispatchers

Control the thread pool where the coroutine runs.

| Dispatcher               | Description                                    |
| ------------------------ | ---------------------------------------------- |
| `Dispatchers.Default`    | Shared background pool (CPU intensive tasks)   |
| `Dispatchers.IO`         | Optimized for disk/network I/O                 |
| `Dispatchers.Main`       | Main/UI thread (Android, JavaFX, etc.)         |
| `Dispatchers.Unconfined` | Runs in current thread until suspension occurs |

### Example:

```kotlin
launch(Dispatchers.IO) {
    // Perform network request or database operations
}
```

## Structured Concurrency

Child coroutines are automatically cancelled when their parent coroutine is cancelled.

```kotlin
coroutineScope {
    launch {
        delay(1000)
        println("Child coroutine finished")
    }
}
```

## Exception Handling

```kotlin
val handler = CoroutineExceptionHandler { _, exception ->
    println("Caught exception: $exception")
}

GlobalScope.launch(handler) {
    throw RuntimeException("Something went wrong!")
}
```

## Coroutine Cancellation

```kotlin
val job = launch {
    repeat(1000) { i ->
        println("Job: I'm working $i ...")
        delay(500L)
    }
}
delay(1300L)
job.cancelAndJoin()
println("Job cancelled")
```

## Comparison: Coroutines vs Threads

| Feature           | Coroutines                         | Threads                     |
| ----------------- | ---------------------------------- | --------------------------- |
| Creation Overhead | Low                                | High                        |
| Memory Footprint  | Small (~a few KB per coroutine)    | Large (MBs per thread)      |
| Scalability       | Can scale to hundreds of thousands | Limited by system resources |
| Cancellation      | Structured concurrency support     | Complex manual management   |

## Best Practices

- Use `withContext` for switching contexts in suspend functions.
- Prefer `viewModelScope` and `lifecycleScope` in Android.
- Always handle exceptions in coroutines.
- Avoid `GlobalScope` unless absolutely necessary.
- Use structured concurrency to manage lifecycles cleanly.

## Summary

**Kotlin Coroutines** provide an efficient, scalable way to perform asynchronous and concurrent programming. They replace callback-based patterns with clean, readable, and maintainable code structures while offering advanced concurrency control, lightweight resource management, and simplified error handling.
