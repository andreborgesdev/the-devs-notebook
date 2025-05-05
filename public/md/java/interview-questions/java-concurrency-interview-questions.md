# Java Concurrency Interview Questions & Answers

### What is the difference between a process and a thread?

- **Process**: Independent execution unit with isolated memory.
- **Thread**: Execution unit within a process sharing common memory with other threads of the same process.

### What is the difference between parallelism and concurrency?

- **Concurrency**: Multiple tasks make progress simultaneously, not necessarily at the same instant.
- **Parallelism**: Multiple tasks execute literally at the same time, typically on multiple cores.

### How can you create a thread instance and run it?

- **Using Runnable**:

```java
Thread t = new Thread(() -> System.out.println("Hello"));
t.start();
```

- **Subclassing Thread**:

```java
Thread t = new Thread() {
    public void run() { System.out.println("Hello"); }
};
t.start();
```

### Describe the different states of a thread.

- **NEW**: Created but not started.
- **RUNNABLE**: Ready to run or running.
- **BLOCKED**: Waiting to enter a synchronized block.
- **WAITING**: Waiting indefinitely for another thread’s action.
- **TIMED_WAITING**: Waiting for a specified time.
- **TERMINATED**: Finished execution.

### What is the difference between Runnable and Callable?

- **Runnable**: No return value or checked exception.
- **Callable**: Returns a value and can throw checked exceptions. Used with `ExecutorService` for asynchronous tasks.

### What is a daemon thread? How can you create one?

A background thread that does not prevent JVM termination.
Example:

```java
Thread t = new Thread(() -> ...);
t.setDaemon(true);
t.start();
```

### What is the thread’s interrupt flag?

Indicates if a thread has been interrupted. Can be set using `interrupt()` and checked with `isInterrupted()` or `Thread.interrupted()`.

### What are Executor and ExecutorService?

- **Executor**: Interface for launching tasks (`execute(Runnable)`).
- **ExecutorService**: Extends Executor, adds lifecycle management and returns `Future` results.

### What are the available implementations of ExecutorService?

- **ThreadPoolExecutor**: Reuses threads.
- **ScheduledThreadPoolExecutor**: Supports task scheduling.
- **ForkJoinPool**: Efficient for recursive tasks using work-stealing.

### What is the Java Memory Model (JMM)?

Specifies rules for visibility and ordering of variables between threads. Guarantees consistency across different architectures and prevents surprising behaviors due to compiler or CPU optimizations.

### What is a volatile field?

- Guarantees visibility of changes across threads.
- Prevents instruction reordering.
- Ensures atomic reads/writes for long and double variables.

### Which of the following are atomic?

- Writing to a non-volatile int → Yes.
- Writing to a volatile int → Yes.
- Writing to a non-volatile long → Not guaranteed.
- Writing to a volatile long → Yes.
- Incrementing a volatile long → No. Use `AtomicLong` for atomic increments.

### What guarantees does the JMM provide for final fields?

Final fields are safely published—once a constructor finishes, all threads will see the properly initialized final fields.

### What does the synchronized keyword mean?

- **Method**: Locks the instance (non-static) or class (static).
- **Block**: Locks the specified object.

### Can two threads calling a synchronized method on different instances block each other?

No for instance methods (different locks).
Yes for static methods (lock is the class object).

### What are wait, notify, and notifyAll used for?

They allow threads to coordinate access to shared resources:

- `wait()` releases the lock and suspends the thread.
- `notify()` wakes one waiting thread.
- `notifyAll()` wakes all waiting threads.

### Describe deadlock, livelock, and starvation.

- **Deadlock**: Threads block each other indefinitely.
- **Livelock**: Threads keep reacting to each other but make no progress.
- **Starvation**: A thread is perpetually denied access to resources.

### What is the purpose of the Fork/Join framework?

Enables parallel execution of recursive tasks using work-stealing to maximize CPU usage without requiring a thread per recursive call.
