# Hash Collisions

A **hash collision** occurs when two different keys produce the same hash value and attempt to occupy the same bucket in a hash table. Collisions are inevitable when hashing a large number of possible keys into a finite number of buckets (**Pigeonhole Principle**).

## Why Collisions Happen

- **Finite bucket space** vs. infinite possible keys.
- Hash functions distribute keys into buckets, but multiple distinct keys can still end up in the same bucket.

## Collision Resolution Strategies

### 1. Separate Chaining

- Each bucket holds a **data structure** (typically a linked list) where all keys hashing to the same value are stored.
- Lookup involves hashing the key, going to the corresponding bucket, and searching the list.
- Other possible data structures: dynamic arrays, balanced trees (e.g., Java HashMap switches to a red-black tree once the bucket’s list exceeds a certain length).

**Advantages**:

- Easy to implement.
- Handles high load factors gracefully.

**Java HashMap Note**:  
Switches from linked lists to **balanced trees** when many collisions occur in a bucket (Java 8+).

### 2. Open Addressing

Instead of storing multiple items in a bucket, **keys are placed directly into the table**. If the target bucket is occupied, probing is used to find the next available slot.

#### Probing Techniques

| Method                | Probing Function P(x)          |
| --------------------- | ------------------------------ |
| **Linear Probing**    | P(x) = a \* x                  |
| **Quadratic Probing** | P(x) = a _ x² + b _ x + c      |
| **Double Hashing**    | P(k, x) = x \* H2(k)           |
| **Random Probing**    | Uses a pseudo-random generator |

**Important**:

- Probing functions **must avoid cycles** (which can cause infinite loops).
- For example, linear probing produces a full cycle when `a` and the table size `N` are relatively prime (**GCD(a, N) = 1**).

#### Deletion in Open Addressing

- Direct deletion isn’t possible without affecting search correctness.
- **Tombstones** (special markers) are used to indicate deleted slots without breaking the probe sequence.
- **Lazy deletion** can speed up future searches by filling earlier tombstone slots with newly inserted key-value pairs.

#### Key Considerations

- Open addressing is **sensitive to hash function and probe function design**.
- High load factors can drastically increase search and insertion times.

### 3. Rehashing

- Resize the table and redistribute all elements when the load factor crosses a threshold.
- Typically doubles the table size (preferably to the next prime number) to reduce future collisions.

## mod N and Probing

All probing functions use **mod N** (the table size) to wrap around the table boundaries. Choosing `N` wisely (often a prime number) helps ensure even distribution and avoids short cycles in probing sequences.

## Interview Tips

- Know how **chaining** and **open addressing** differ.
- Understand **how and when to use probing functions**.
- Be able to explain **why open addressing can suffer from clustering and cycles**.
- For advanced interviews: discuss **lazy deletion** and **Java’s treeification in HashMap**.
- Always mention how resizing (rehashing) mitigates performance degradation.

## Summary

- **Collisions are unavoidable** but can be managed.
- Use **separate chaining** for flexibility and high load factor tolerance.
- Use **open addressing** when memory overhead must be minimized.
- Design **good hash functions** and **probing sequences** to minimize collision frequency and impact.
