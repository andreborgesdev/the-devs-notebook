# Heap

A **Heap** is a special **complete binary tree** data structure that satisfies the **heap property**:

- **Max-Heap**: Every parent node is greater than or equal to its children.
- **Min-Heap**: Every parent node is less than or equal to its children.

## Characteristics

- **Complete Binary Tree**: All levels are fully filled except possibly the last, which is filled from left to right.
- **Heap Property**: Maintained during insertion and deletion.
- **Efficient Priority Queue Implementation**.

## Types of Heaps

| Type       | Property                                         |
| ---------- | ------------------------------------------------ |
| Max-Heap   | Largest element is at the root.                  |
| Min-Heap   | Smallest element is at the root.                 |
| d-ary Heap | Generalized heap where each node has d children. |

## Time Complexity

| Operation            | Time Complexity |
| -------------------- | --------------- |
| Insert               | O(log n)        |
| Remove min/max       | O(log n)        |
| Peek min/max         | O(1)            |
| Heapify (build heap) | O(n)            |

## Example (Min-Heap)

Array representation: `[2, 4, 5, 7, 6, 8]`

```
        2
      /   \
     4     5
    / \   /
   7   6 8
```

## Use Cases

- **Priority Queues**
- **Dijkstra’s algorithm** (for shortest path)
- **Heap Sort**
- **Scheduling systems**
- **Top-K elements problems**
- **Median maintenance (using two heaps)**

## Heap vs Binary Search Tree

| Feature                  | Heap                      | Binary Search Tree        |
| ------------------------ | ------------------------- | ------------------------- |
| Structure                | Complete Binary Tree      | Binary Search Tree        |
| Order property           | Parent-child relationship | In-order traversal sorted |
| Access min/max           | O(1)                      | O(log n)                  |
| Search arbitrary element | O(n)                      | O(log n)                  |

## Java Example: Min-Heap Using PriorityQueue

```java showLineNumbers
import java.util.PriorityQueue;

public class MinHeapExample {
public static void main(String[] args) {
PriorityQueue<Integer> minHeap = new PriorityQueue<>();

        minHeap.add(10);
        minHeap.add(5);
        minHeap.add(20);

        System.out.println("Min element: " + minHeap.peek()); // 5

        System.out.println("Removed: " + minHeap.poll());     // 5
        System.out.println("Next Min: " + minHeap.peek());    // 10
    }

}
```

## Custom Max-Heap Example

```java showLineNumbers
import java.util.Collections;
import java.util.PriorityQueue;

public class MaxHeapExample {
public static void main(String[] args) {
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());

        maxHeap.add(10);
        maxHeap.add(5);
        maxHeap.add(20);

        System.out.println("Max element: " + maxHeap.peek()); // 20
    }

}
```

## Interview Tips

- Know how to implement a heap using an **array**.
  - For node at index `i`:
    - Left child → `2*i + 1`
    - Right child → `2*i + 2`
    - Parent → `(i - 1) / 2`
- Understand the difference between a **heap** and a **binary search tree (BST)**:
  - Heaps guarantee order between parent and children, **but not between siblings or across the tree**.
  - BSTs guarantee full ordering → in-order traversal returns sorted data.
- Be ready to discuss the **Heapify process** and its O(n) build time.
- Mention that heaps can be used for **Top K** problems, **streaming medians**, and **task scheduling**.

## Common Pitfalls

- Forgetting that **heap is not a search structure** — searching for arbitrary elements is slow (O(n)).
- Misunderstanding the difference between **balanced BSTs** (which keep in-order traversal sorted) and **heaps** (which only maintain the min/max property).

## Summary

A **Heap** is a complete binary tree used to implement efficient priority queues. It supports fast access to the highest or lowest element and is a key tool in many classic algorithms and interview problems.
