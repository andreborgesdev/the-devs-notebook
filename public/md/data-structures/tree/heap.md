# Heap

A heap is a tree based DS that satisfies the heap invariant (also called heap property):

**If A is a parent node of B, then A is ordered with respect to B for all node A, B in the heap.**

What this means is the value of the parent node is always ≥ to the value of the child node for all nodes, or the other way around, ≤.

![https://www.geeksforgeeks.org/wp-content/uploads/MinHeapAndMaxHeap.png](https://www.geeksforgeeks.org/wp-content/uploads/MinHeapAndMaxHeap.png)

**Max-Heap**: In a Max-Heap the key present at the root node must be greatest among the keys present at all of it’s children. The same property must be recursively true for all sub-trees in that Binary Tree.

**Min-Heap**: In a Min-Heap the key present at the root node must be minimum among the keys present at all of it’s children. The same property must be recursively true for all sub-trees in that Binary Tree.

A binary heap is a binary tree that supports the heap invariant (parent > children). In a BT every node has exactly two children (one can be null, or two in the case of the leaves).

Binomial heaps can have any number of branches.

There are many types of heaps, including:

- Binary heap
- Fibonacci heap
- Binomial heap
- Pairing heap
- ...

We can represent a heap using arrays or objects and pointers and recursively add and remove nodes as needed. Arrays are faster and more elegant.

Let i be the parent node index (zero based)

Left child index = 2i + 1

Right child index = 2i + 2

Adding elements to a binary heap:

If we want to insert a new root to the tree, we add it normally to the left-most possible spot and then do a “bubbling up”, “swimming”, or “sifting up”. The idea is that we compare it with the parent and swap them if the value is smaller. We do this operation for all values inserted to keep the heap consistent (invariant).

Removing elements from root of a binary heap (polling):

When we do this we have to swap the root (first element) with the last one and then we delete the root that is now at the last position (right-most position). Now, we are not satisfying the heap invariant because we have a high value as root, so we have to bubble it down. On bubble down, we swap positions with the smallest child until the child is > than the value. In case we have a tie between children swap with the left one.

Removing elements from a binary heap (other than the root):

We first do a linear search to look for the element we want to remove. When we find its position we swap it with the last node and delete it. Finally, we have to move the node until the heap invariant is satisfied.

| Operation | Complexity |
| --- | --- |
| O(n log n) | Polling |
| O(n) | Removing |

Removing elements from a binary heap in O(log n):

The inefficiency of the removal algo comes from the fact that we have to perform a linear search to find out where an element is indexed at. What if instead we did a lookup using an HT to find out where a node is indexed at?

- A HT provides a O(1) time lookup and update for a mapping from a key (the node value) to a value (the index). Of course, if we have 2 or more equal values we’ll have a problem. We can solve it by instead of mapping one value to one position we will map one value to multiple positions. We can maintain a Set or TreeSet of indexes for which a particular node value (key) maps to.
- For repeated nodes (values), it doesn’t matter which one we remove as long as we satisfy the heap invariant in the end.
- When we do a node swap we have to update the indexes on the HT (swap the indexes between the nodes).

We can use the heapify (it takes O(n) instead of O(n log n)) process if we know all the elements it will have.