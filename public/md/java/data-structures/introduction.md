# Java Collections Framework

A **Collection** in Java is like a container that can hold **zero**, **one**, or **many** elements.  
The Java Collections Framework (JCF) provides a **standardized architecture** to store, retrieve, and manipulate data efficiently.

## Why Collections?

- **Simplify data handling** — no need to write custom data structures.
- Provide **high-performance**, **scalable** implementations.
- Offer **flexibility** to choose the best data structure for the problem.

## Core Structure

The **Collections Framework** has:

1. **Interfaces** → Define behavior (e.g., List, Set, Queue, Map).
2. **Implementations** → Concrete data structures (e.g., ArrayList, HashSet, HashMap).
3. **Algorithms** → Sorting, searching, shuffling, etc.

## Key Interfaces

| Interface  | Description                                   |
| ---------- | --------------------------------------------- |
| Collection | Root interface for most containers            |
| List       | Ordered collection, allows duplicates         |
| Set        | Unordered collection, **no duplicates**       |
| Queue      | Holds elements for processing, typically FIFO |
| Deque      | Double-ended queue                            |
| Map        | Key-value pairs, no duplicate keys            |

## Why Use Interface Types?

```java
List<String> names = new ArrayList<>();
```

- You should **declare variables using interfaces** (`List`)
- You should **instantiate using implementations** (`ArrayList`)

This improves **flexibility** and allows changing the implementation easily without rewriting the logic.

## Collection Behaviors

- **Ordering** → Some implementations (like `List` and `LinkedHashSet`) maintain order.
- **Uniqueness** → `Set` ensures no duplicates.
- **Sorting** → `TreeSet` and `TreeMap` maintain sorted order.
- **Null Handling** → Some implementations allow `null` values or keys, others do not.

## Iterable & Iterator

The `Collection` interface **extends `Iterable`**, meaning:

- Collections can be **looped over** using an `Iterator`.
- Example:

```java
for (String name : names) {
    System.out.println(name);
}
```

> 🔎 Since Java 8, **Streams** offer more advanced iteration and functional-style operations, but iterators remain fundamental.

## Popular Implementations

| Interface | Popular Implementations                    |
| --------- | ------------------------------------------ |
| List      | ArrayList, LinkedList                      |
| Set       | HashSet, LinkedHashSet, TreeSet            |
| Queue     | LinkedList, PriorityQueue                  |
| Deque     | ArrayDeque, LinkedList                     |
| Map       | HashMap, LinkedHashMap, TreeMap, Hashtable |

## Performance Characteristics (Summary)

| Implementation    | Access   | Insert         | Remove   |
| ----------------- | -------- | -------------- | -------- |
| ArrayList         | O(1)     | O(1) amortized | O(n)     |
| LinkedList        | O(n)     | O(1)           | O(1)     |
| HashSet / HashMap | O(1)     | O(1)           | O(1)     |
| TreeSet / TreeMap | O(log n) | O(log n)       | O(log n) |

> ⚠ **Note:** Performance depends heavily on usage patterns and data size.

## Visual Overview

![java-collections-api](../../images/java-collections-api.png)

![java-map-api](../../images/java-map-api.png)

![java-collections-interfaces-vs-implementation](../../images/java-collections-interfaces-vs-implementation.png)

## Cheat Sheets

![java-iterable](../../images/java-iterable.png)

![java-collections-cheat-sheet](../../images/java-collections-cheat-sheet.png)

![https://miro.medium.com/max/1400/1*Ge_3VrVfKOnVIv7OdLXlog.jpeg](https://miro.medium.com/max/1400/1*Ge_3VrVfKOnVIv7OdLXlog.jpeg)

![https://code.intfast.ca/images/JavaCollections.jpg](https://code.intfast.ca/images/JavaCollections.jpg)

![https://miro.medium.com/max/1400/1*ZhEFIo3v6lmnyhc8gI2foQ.png](https://miro.medium.com/max/1400/1*ZhEFIo3v6lmnyhc8gI2foQ.png)

![https://miro.medium.com/max/800/1*QSi6EBlAxXMNDnOyt4liVQ.jpeg](https://miro.medium.com/max/800/1*QSi6EBlAxXMNDnOyt4liVQ.jpeg)

## Interview Tips

- **Know the hierarchy** → Especially the differences between List, Set, Map, and Queue.
- **Performance trade-offs** → Understand which implementation to use for access, insertion, and removal patterns.
- Be able to explain:
  - Why `ArrayList` is better for random access.
  - Why `LinkedList` is better for frequent insertions/removals.
  - When to use `HashSet` vs `TreeSet`.
  - How **HashMap** handles collisions (separate chaining / balanced trees).
- **Prefer interface types** → Always code to the interface, not the implementation.

## Java Streams (Advanced Note)

While **Streams** (introduced in Java 8) offer powerful ways to process collections, understanding the **core collection mechanics** (interfaces, iterators, and algorithms) is essential for both legacy code and interviews.
