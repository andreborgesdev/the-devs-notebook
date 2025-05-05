# Priority Queue (PQ)

A **Priority Queue** is an **abstract data type (ADT)** similar to a regular queue, except that each element has a **priority**. Elements are removed in order of priority, not order of insertion.

**Important**:  
The internal storage **does not need to be ordered by priority** at all times — only the next element to remove must be the highest (or lowest) priority.

## Characteristics

- Elements must be **comparable** so priorities can be established.
- **Heap** is the canonical data structure used to implement PQs (efficient time complexities).
- Other implementations (unsorted arrays, sorted lists) are possible but usually less efficient.

## Common Operations

| Operation     | Description                                            |
| ------------- | ------------------------------------------------------ |
| Add / Insert  | Add an element to the PQ.                              |
| Poll / Remove | Remove and return the highest priority element.        |
| Peek / Top    | View the highest priority element without removing it. |
| Contains      | Check if an element exists (may not be efficient).     |

## Time Complexity (Binary Heap Implementation)

| Operation                            | Time Complexity |
| ------------------------------------ | --------------- |
| Binary heap construction             | O(n)            |
| Poll (remove root)                   | O(log n)        |
| Peek                                 | O(1)            |
| Add                                  | O(log n)        |
| Naïve remove (not root)              | O(n)            |
| Contains (naïve)                     | O(n)            |
| Contains (optimized with hash table) | O(1)            |

## Java Example: Min Priority Queue

```java showLineNumbers
import java.util.PriorityQueue;

public class PriorityQueueExample {
public static void main(String[] args) {
PriorityQueue<Integer> pq = new PriorityQueue<>();

        pq.add(10);
        pq.add(5);
        pq.add(20);

        System.out.println("Min element: " + pq.peek()); // 5
        System.out.println("Removed: " + pq.poll());     // 5
        System.out.println("Next min: " + pq.peek());    // 10
    }

}
```

## Turning a Min PQ into a Max PQ

If the language only provides a Min PQ:

- **Numbers**: Negate values before insertion and after removal.
- **Strings/Objects**: Reverse the comparator logic.

```java showLineNumbers
PriorityQueue<Integer> maxPQ = new PriorityQueue<>(Collections.reverseOrder());
```

## Underlying Heaps

Common heap choices for PQs:

- **Binary Heap** (default and most common)
- **Fibonacci Heap**
- **Binomial Heap**
- **Pairing Heap**

**Note**:  
Although heaps are the standard, other structures are possible. However, they usually provide worse time complexities.

## Indexed Priority Queue (IPQ)

A **variant of the PQ** that supports:

- Fast updates.
- Fast deletions.
- Key-value pairs.

**Use Case**:  
When you need to efficiently **update the priority** of specific elements (e.g., Dijkstra’s and Prim’s algorithms).

| Operation             | Time Complexity |
| --------------------- | --------------- |
| delete (by index)     | O(log n)        |
| valueOf (by index)    | O(1)            |
| contains (by index)   | O(1)            |
| peekMinKeyIndex       | O(1)            |
| pollMinKeyIndex       | O(log n)        |
| peekMinValue          | O(1)            |
| pollMinValue          | O(log n)        |
| insert (index, value) | O(log n)        |
| update (index, value) | O(log n)        |
| decreaseKey           | O(log n)        |
| increaseKey           | O(log n)        |

**Key Ideas**:

- Maintains **bidirectional mappings** between heap positions and values.
- Supports efficient **swapping and heap restructuring** during updates or deletions.

## Interview Tips

- Know how to implement a PQ using a **binary heap**.
- Understand the difference between **poll** (remove and return) and **peek** (view only).
- Be able to explain how a **Max PQ** can be built from a Min PQ using negation or custom comparators.
- For advanced interviews:
  - Understand when to use an **Indexed Priority Queue (IPQ)** for dynamic key updates.
  - Discuss **heapify** process and complexity.
  - Be prepared to explain why heaps are preferred over sorted lists or unsorted arrays.

## Summary

A **Priority Queue** allows elements to be added in any order but always removes the highest priority element first.  
While it’s an **ADT** (meaning multiple implementations are possible), **heaps** provide the best time complexities and are the de facto underlying data structure.
