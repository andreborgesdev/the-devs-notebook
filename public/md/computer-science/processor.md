# Processor & CPU Concepts

## Overview

A **Processor (CPU)** is the central component of a computer system responsible for executing instructions from computer programs. It performs basic arithmetic, logic, control, and input/output operations specified by the instructions.

| Component | Description                                 |
| --------- | ------------------------------------------- |
| ALU       | Arithmetic Logic Unit (performs operations) |
| CU        | Control Unit (directs operations)           |
| Registers | Small, fast storage locations               |
| Cache     | Fast memory to reduce data access time      |

---

## Processes and Threads

### Processes

A **process** is an instance of a program in execution. Each process has its own memory space, file descriptors, and state.

| Property       | Description                      |
| -------------- | -------------------------------- |
| Isolation      | Separate address space           |
| Context Switch | Relatively expensive             |
| Example        | Running multiple browser windows |

### Threads

A **thread** is the smallest unit of execution within a process. Threads within the same process share the same memory and resources.

| Property      | Description                          |
| ------------- | ------------------------------------ |
| Shared Memory | Threads share process memory         |
| Lightweight   | Lower context-switch overhead        |
| Example       | Downloading files while rendering UI |

---

## Concurrency vs Parallelism

| Concept     | Description                                                                              |
| ----------- | ---------------------------------------------------------------------------------------- |
| Concurrency | Structuring a program to handle multiple tasks logically at once (interleaved execution) |
| Parallelism | Physically executing multiple tasks simultaneously, usually on multiple cores            |

**Concurrency ≠ Parallelism**, but they can coexist.

```plaintext
Concurrency → Managing multiple tasks
Parallelism → Running multiple tasks simultaneously
```

---

## Synchronization

### Purpose

Prevent data races and ensure **mutual exclusion** and **correct ordering** of operations when multiple threads/processes access shared resources.

### Mechanisms

| Mechanism | Description                                                           |
| --------- | --------------------------------------------------------------------- |
| Mutex     | Mutual exclusion lock (one thread at a time)                          |
| Semaphore | Counter-based lock controlling access to resources                    |
| Spinlock  | Busy-waiting for a lock                                               |
| Monitor   | High-level abstraction (encapsulates mutexes and condition variables) |

### Example (Mutex in Java)

```java
synchronized(this) {
    // Critical section
}
```

---

## Scheduling Algorithms

The **CPU scheduler** decides which process/thread runs at any given time.

| Algorithm                       | Description                                               |
| ------------------------------- | --------------------------------------------------------- |
| First-Come, First-Served (FCFS) | Processes run in order of arrival                         |
| Shortest Job Next (SJN)         | Runs shortest estimated time process next                 |
| Round Robin                     | Time slices (quantums) for fairness                       |
| Priority Scheduling             | Highest priority task runs first                          |
| Multilevel Queue Scheduling     | Separate queues for different process types               |
| Multilevel Feedback Queue       | Allows processes to move between queues based on behavior |

---

## Multithreading Models

| Model        | Description                                     |
| ------------ | ----------------------------------------------- |
| Many-to-One  | Many user threads mapped to one kernel thread   |
| One-to-One   | Each user thread maps to a kernel thread        |
| Many-to-Many | Many user threads mapped to many kernel threads |

Modern OSes like Linux and Windows generally use **one-to-one** or **many-to-many** models.

---

## Context Switching

- **What**: Saving the state of a running process/thread and loading the state of another.
- **Cost**: Context switching incurs overhead (memory/cache reloads, CPU time).
- **Minimization**: Lightweight threads, cooperative multitasking, processor affinity.

---

## CPU Cores and Hyperthreading

| Term           | Description                                       |
| -------------- | ------------------------------------------------- |
| Multi-core     | Multiple independent CPU cores on one chip        |
| Hyperthreading | Each core appears as two logical processors to OS |
| Benefit        | Improved parallelism and multitasking capability  |

---

## Instruction Pipelining

- **Stages**: Fetch → Decode → Execute → Memory → Write Back
- Allows multiple instructions to be processed simultaneously at different stages, increasing CPU throughput.

---

## Cache Coherency

In multi-core processors, **cache coherence protocols** ensure that all caches reflect the latest value of shared variables.

Examples:

- MESI (Modified, Exclusive, Shared, Invalid)
- MOESI, MSI, etc.

---

## Deadlocks and Race Conditions

| Issue          | Description                                                                                                       |
| -------------- | ----------------------------------------------------------------------------------------------------------------- |
| Deadlock       | Two or more processes waiting indefinitely for each other to release resources                                    |
| Race Condition | Multiple processes/threads accessing shared data without proper synchronization, leading to unpredictable results |

---

## Real-world Example

**Web Server Handling Requests**

- Each incoming request handled by a separate **thread**.
- CPU scheduler allocates cores to threads based on scheduling algorithm.
- Shared resources (databases, caches) accessed with **mutexes** or **semaphores**.
- Multiple requests may be handled **concurrently** or **in parallel** based on hardware and software architecture.

---

## Summary

Efficient processor usage requires understanding:

- How processes and threads work
- Synchronization methods to avoid concurrency issues
- Scheduling algorithms for fair and efficient CPU time allocation
- Modern multi-core and hyperthreaded CPU capabilities
