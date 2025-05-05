# Map (Dictionaries / Associative Arrays)

A **Map** (also known as a Dictionary, Associative Array, or Symbol Table) is a fundamental data structure that stores a collection of **key-value pairs**. It provides a mapping from unique keys to values using a technique called **hashing** (for hash-based maps) or comparison (for tree-based maps). Each key in the map must be **unique**, and it is used to efficiently look up its corresponding value. Keys must be unique, but values can be repeated.

## Key Characteristics

- **Key-Value Pairs**: Stores data as associated keys and values.
- **Unique Keys**: Each key within a map must be unique. Adding a pair with an existing key typically updates the value associated with that key.
- **Hashable/Comparable Keys**:
  - For hash-based maps, keys must be _hashable_. This typically means they must be **immutable** (their state doesn't change in a way that affects their hash code or equality) and have a consistent, **deterministic hash function** (`H(x)`) defined. Any type, including objects, can be a key if it meets these criteria.
  - For tree-based maps, keys must be comparable (either via natural ordering or a provided comparator).
- **Fast Key-Based Lookup**: Maps are optimized for retrieving the value associated with a given key.
- **Order Varies**: The order depends on the implementation (unordered, sorted by key, insertion order).
- **Nulls**: Allowance depends on the implementation (e.g., Java `HashMap` allows one null key, `TreeMap` forbids null keys).

## Common Implementations

Maps are commonly implemented using Hash Tables or Balanced Binary Search Trees.

### 1. Hash Map (e.g., `HashMap` in Java, `dict` in Python)

Uses a **hash table** internally. A hash table is essentially an array where the index for storing a key-value pair is derived from the key using a hash function.

- **Mechanism**:
  - **Hash Function (`H(x)`):** Maps a key `x` to an integer index (hash code) within the array's bounds. A good hash function should be **deterministic** (always produce the same output for the same input) and aim for **uniform distribution** to minimize collisions.
  - **Buckets:** Each array slot is often called a bucket.
  - **Hash Collisions:** Occur when different keys map to the same index (`H(x) = H(y)` where `x != y`). This is handled using collision resolution techniques, most commonly **Separate Chaining** (storing a linked list or tree of entries in the bucket) or **Open Addressing** (probing for the next available slot).
  - **`hashCode()` & `equals()` Contract:** Crucial for correctness. `hashCode()` determines the bucket. If multiple keys land in the same bucket (collision), `equals()` is used to differentiate them. If `H(x) != H(y)`, then `x` and `y` are definitely not equal. If `H(x) == H(y)`, `x` and `y` _might_ be equal, requiring a check with `equals()`.
  - **Load Factor (`α`):** Measures how full the hash table is (`α = number of items / table size`). To maintain performance, if the load factor exceeds a certain threshold (e.g., 0.75), the table is **resized** (usually doubled or increased exponentially) and all existing entries are **rehashed** into the new, larger table.
- **Order**: Unordered.
- **Performance**:
  - `put`, `get`, `remove`, `containsKey`: **Average time complexity is $O(1)$** _if_ the hash function is uniform and the load factor is managed via resizing.
  - **Worst-case time complexity is $O(N)$**. This occurs with many hash collisions (e.g., all keys map to the same bucket, degrading to a linked list search) or during a resize operation.
- **Pros**: Fastest average performance. Flexible.
- **Cons**: Unordered; worst-case performance depends heavily on hash function quality and collision handling; resizing can cause occasional pauses.

### 2. Tree Map (e.g., `TreeMap` in Java)

Uses a balanced binary search tree (typically a Red-Black Tree) ordered by keys.

- **Mechanism**: Keys are stored and ordered within the tree structure based on comparison (`Comparable` or `Comparator`).
- **Order**: Sorted by key.
- **Nulls**: Does _not_ allow `null` keys.
- **Performance**:
  - `put`, `get`, `remove`, `containsKey`: Guaranteed $O(\log N)$.
  - Supports efficient ordered traversal and range queries.
- **Pros**: Maintains sorted order; guaranteed logarithmic performance.
- **Cons**: Slower than `HashMap` average case; no null keys.

### 3. Linked Hash Map (e.g., `LinkedHashMap` in Java)

Combines a hash table with a doubly-linked list running through entries.

- **Mechanism**: Hash table provides fast lookup; linked list maintains order.
- **Order**: Maintains **insertion order** (or optionally access order).
- **Nulls**: Allows one null key and multiple null values.
- **Performance**:
  - `put`, `get`, `remove`, `containsKey`: Average $O(1)$.
  - Iteration is $O(N)$ over elements, regardless of capacity.
- **Pros**: Predictable iteration order with `HashMap` speed.
- **Cons**: Slightly higher memory overhead than `HashMap`.

## Operations & Complexity Comparison

| Operation              | HashMap (Average) | HashMap (Worst) | TreeMap (Guaranteed) | LinkedHashMap (Average) | Iteration Order                |
| :--------------------- | :---------------- | :-------------- | :------------------- | :---------------------- | :----------------------------- |
| `put`, `get`, `remove` | $O(1)$ **†**      | $O(N)$          | $O(\log N)$          | $O(1)$ **†**            | ---                            |
| `containsKey`          | $O(1)$ **†**      | $O(N)$          | $O(\log N)$          | $O(1)$ **†**            | ---                            |
| Iteration              | $O(N + Capacity)$ | $O(N + C)$      | $O(N)$               | $O(N)$                  | Unordered / Sorted / Insertion |

**†** _Assumes a good uniform hash function and managed load factor._

## Common Use Cases

- **Counting Frequencies**: Mapping items to counts (e.g., word counts in text).
- **Caching**: Storing results (Key: input, Value: result). `LinkedHashMap` often used for LRU caches.
- **Indexing Data**: Associating records with unique IDs.
- **Configuration Settings**: Storing key-value settings.
- **Graph Representation**: Adjacency lists (Node -> List of Neighbors).
- **Choose `HashMap`**: Default choice for speed when order is irrelevant.
- **Choose `TreeMap`**: When sorted key order or range queries are needed.
- **Choose `LinkedHashMap`**: When insertion order matters with fast lookups.

## Tips for Interviews

- **Recognize Map Problems**: Identify needs for key-value association, fast lookups by identifier, or frequency counting.
- **Justify Implementation Choice**: Explain the `HashMap` vs. `TreeMap` vs. `LinkedHashMap` decision based on order and performance requirements.
- **State Complexities**: Clearly state average and worst-case times. Explain that `HashMap`'s $O(1)$ average depends on good hashing and load factor management, while the worst case is $O(N)$. `TreeMap` is reliably $O(\log N)$.
- **Key Requirements**:
  - For `HashMap`: Keys must be hashable (immutable state affecting hash/equals, consistent `hashCode()` and `equals()` implementations). Explain the contract: equal objects MUST have equal hash codes.
  - For `TreeMap`: Keys must be comparable (`Comparable` or `Comparator`).
- **Hashing Concepts (for HashMap)**: Briefly explain hash functions, buckets, collisions, collision resolution (separate chaining is common), load factor, and resizing/rehashing. Show you understand _why_ the average case is fast and how the worst case happens.
- **Iteration**: Know how to iterate over keys (`keySet()`), values (`values()`), or entries (`entrySet()`).
- **Edge Cases**: Discuss null keys/values, empty maps.
- **Communication**: Clearly articulate why a Map is appropriate and why the specific implementation was chosen.
