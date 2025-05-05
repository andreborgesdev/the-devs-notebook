# List

A **List** is a fundamental data structure representing an **ordered collection of items**. Unlike Sets, Lists allow **duplicate elements**, and unlike mathematical sets, the order in which elements appear is significant and maintained. Elements in a list can typically be accessed using an index.

## Key Characteristics

- **Ordered**: Elements maintain a specific sequence based on insertion order.
- **Indexed**: Elements can usually be accessed by their position (index), often starting from 0.
- **Mutable**: Lists are generally dynamic, meaning elements can be added, removed, or changed after creation.
- **Allows Duplicates**: The same element can appear multiple times in a list.
- **Variable Content**: Depending on the language, lists might store elements of the same type (like in Java arrays backing ArrayList) or mixed types (like Python lists).

## Common Implementations

Lists are typically implemented using one of two underlying structures: Arrays (often dynamic) or Linked Nodes.

### 1. Array-based Lists (Dynamic Arrays)

These lists use a contiguous block of memory, like an array, to store elements. When the array runs out of space, a larger array is allocated, and the existing elements are copied over. Examples include Java's `ArrayList` and Python's built-in `list`.

- **Mechanism**: Stores elements side-by-side in memory. Resizing (e.g., doubling capacity) occurs when full.
- **Pros**:
  - Fast random access by index ($O(1)$).
  - Good cache locality (elements are stored together), potentially leading to faster iteration.
  - Memory efficient (less overhead per element compared to linked lists).
- **Cons**:
  - Slow insertion/deletion at the beginning or middle ($O(N)$) because subsequent elements must be shifted.
  - Resizing, although infrequent, can be a costly $O(N)$ operation when it occurs.
- **Amortized Append**: While resizing costs $O(N)$, the cost is spread out over many appends. Adding N elements takes $O(N)$ total time, making the _amortized_ cost of appending to the end $O(1)$.

### 2. Linked Lists

These lists store elements in individual 'nodes', where each node contains the data element and one or two pointers (references) linking to the next (and possibly previous) node in the sequence.

- **Mechanism**: Nodes are linked via pointers; memory allocation is non-contiguous. Can be Singly-Linked (next pointer only) or Doubly-Linked (next and previous pointers).
- **Pros**:
  - Fast insertion/deletion at the beginning or end ($O(1)$ for doubly-linked lists or singly-linked with tail pointer).
  - Fast insertion/deletion in the middle _if you already have a reference to the node_ ($O(1)$).
  - Dynamic size without large reallocation overhead.
- **Cons**:
  - Slow random access by index ($O(N)$) because you must traverse the list from the beginning (or end for doubly-linked).
  - Slow search by value ($O(N)$).
  - Higher memory overhead per element due to storing pointers.
  - Poor cache locality as nodes can be scattered in memory.

## Operations & Complexity Comparison

| Operation                  | Array List (Avg)   | Linked List (Avg) | Notes                                                                                                          |
| :------------------------- | :----------------- | :---------------- | :------------------------------------------------------------------------------------------------------------- |
| Access by Index (`get(i)`) | $O(1)$             | $O(N)$            | Array provides direct computation; Linked List requires traversal.                                             |
| Search by Value            | $O(N)$             | $O(N)$            | Both require checking elements sequentially in the worst case.                                                 |
| Insert/Delete at Beginning | $O(N)$             | $O(1)$            | Array requires shifting all elements; Linked List just updates head pointer.                                   |
| Insert/Delete at End       | $O(1)$ (Amortized) | $O(1)$            | Array List append is amortized constant; Linked List updates tail pointer.                                     |
| Insert/Delete in Middle    | $O(N)$             | $O(N)$\*          | Array requires shifting; Linked List requires $O(N)$ traversal to find the node, then $O(1)$ pointer update\*. |
| Get Size                   | $O(1)$             | $O(1)$            | Most implementations store the size separately.                                                                |

\* _Note: Linked List insertion/deletion is $O(1)$ if you already have a pointer/reference to the node before/after the insertion/deletion point._

## Common Use Cases

- **Choose Array List when**:
  - You need frequent access to elements by index.
  - Most insertions/deletions occur at the end of the list.
  - Memory usage per element is a concern.
  - Predictable iteration performance (good cache locality) is important.
- **Choose Linked List when**:
  - You need frequent insertions/deletions at the beginning or middle of the list (and can efficiently get to the location).
  - Random access by index is infrequent.
  - The list size fluctuates greatly, and the cost of array resizing is undesirable.
  - Implementing other data structures like Stacks or Queues (especially Deques).
