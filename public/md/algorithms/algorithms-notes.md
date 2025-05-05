# Notes from the Exercises

This page summarizes patterns, observations, and techniques gathered while solving coding problems. Ideal for daily reference, cheatsheets, and interview prep.

## Useful Links

[LeetCode Patterns](https://seanprashad.com/leetcode-patterns/)  
[14 Patterns to Ace Any Coding Interview](https://hackernoon.com/14-patterns-to-ace-any-coding-interview-question-c5bb3357f6ed)  
[Interview School](https://interviews.school/)  
[VisuAlgo](https://visualgo.net/en)

## General Concepts

Some languages optimize recursion depth (tail call optimization) where the recursive call is the last operation in a function.

Know the difference between recursion and iteration. In languages without tail call optimization, too much recursion can cause stack overflows.

Many problems boil down to combinations of:

- Sliding window
- Two pointers
- Recursion
- Dynamic programming
- Divide and conquer
- Hashing / frequency counting
- Graph traversal (BFS/DFS)
- Priority queues (heaps)

**Tip:** Be aware of space vs time tradeoffs. Many optimized solutions use extra space for faster runtimes (e.g., hash maps, dynamic programming tables).

## Arrays

Techniques:

- Sliding window (prefer `i` and `i-1` over `i` and `i+1` to avoid index overflow checks)
- Dynamic Programming
- Divide and Conquer

Notes:

- In-place modification can reduce space usage. Use with care to avoid side effects.
- Tracking frequency → use a Map or an array (if the value range is known)
- Searching a sorted array:
  - Two pointers → O(max(N, M))
  - Binary search → O(k log N), where k = size of smaller array

If one array can’t fit into memory:

- Use HashMaps for intersection checks
- Use distributed approaches (MapReduce)
- Process in chunks or streams

Extra tip:
For "kth smallest/largest" problems, consider QuickSelect (average O(n)) or Heaps (O(n log k)).

## 2D Arrays (Matrices)

All rows have the same column length → `matrix[0].length`

Common techniques:

- DFS/BFS for island counting or flood fill problems
- Dynamic Programming for pathfinding or minimal/maximal sum problems
- Binary Search when the matrix is sorted in some manner (e.g., search in row/column-wise sorted matrix)

## Strings

Techniques:

- Substring, `charAt(index)`, or convert to char arrays

Frequency counting:

- Map or integer array
- For lowercase → `new int[26]` (`char - 'a'` index)
- Full ASCII → `new int[128]`

Unicode handling in Java:

- Use `codePointAt` and `charCount` to correctly process multi-char Unicode symbols

Common patterns:

- Sliding window (longest substring without repeating characters)
- Two pointers
- Hash maps/sets for uniqueness and frequency

Extra tip:
Palindrome problems often use two pointers or dynamic programming.

## Linked Lists

Key points:

- Manage pointers carefully, check for nulls early
- Dummy nodes (`fakeHead`) simplify edge cases
- Recursive solutions can hit stack overflow for large lists
- Two pointer techniques (fast/slow pointers) solve many problems efficiently

Techniques:

- Reverse a list → use iteration, pointing head backward
- Find middle → slow and fast pointers
- Cycle detection → Floyd’s Tortoise and Hare algorithm

Extra tip:
Many in-place linked list problems reduce to careful pointer reassignment (reverse, swap, partition).

## Stacks / Queues

Key points:

- Stack → LIFO
- Queue → FIFO

Techniques:

- Use two stacks to implement a queue and vice versa
- Monotonic stacks for problems involving next/previous greater/smaller elements
- BFS often uses a queue

Java note:
When using `Queue = new LinkedList` use `offer()` and `poll()` instead of `add()` and `remove()`.

## Trees

Traversals:

- Preorder
- Inorder (in BST → sorted order)
- Postorder
- Level order (BFS)

Techniques:

- Recursive and iterative solutions (stack for DFS, queue for BFS)
- Dynamic Programming on Trees (Tree DP)
- Binary Lifting for ancestor queries

Common patterns:

- Lowest Common Ancestor (LCA)
- Validate BST
- Balanced tree checks
- Diameter of tree

## Graphs

Traversal:

- DFS (recursive or with stack)
- BFS (queue)

Techniques:

- Topological sort → DAGs
- Union Find → connected components / clusters
- Kruskal’s / Prim’s algorithms → Minimum Spanning Tree
- Dijkstra’s algorithm → shortest path with weights

Common patterns:

- Cycle detection
- Bipartite graph checks
- Flood fill / island counting
- Kahn’s algorithm for topological sort

## Dynamic Programming

Techniques:

- Top-down (recursion + memoization)
- Bottom-up (tabulation)

Patterns:

- Knapsack
- Longest Common Subsequence
- Maximum subarray/sum problems
- Palindromic subsequences/substrings
- Coin change / minimum paths

Tips:

- Identify overlapping subproblems and optimal substructure.
- Optimize space when possible by storing only necessary previous results.

## Greedy Algorithms

Look for:

- Local optimum leads to global optimum.
- Prove the greedy choice property or counterexamples.

Common problems:

- Activity selection
- Interval scheduling
- Huffman coding
- Minimum spanning tree

## Bit Manipulation

Useful when:

- Constraints are small (e.g., numbers <= 2³¹)
- Problems involve parity, masks, or subsets

Common techniques:

- Bitwise AND, OR, XOR
- Counting set bits
- Shifting

## Priority Queues / Heaps

Use cases:

- Find k-th largest/smallest
- Real-time median
- Merge k sorted lists
- Scheduling problems

Note:
If you need constant time for contains or fast remove, consider using an **indexed priority queue**.

## Two Pointer and Sliding Window

When to use:

- Subarray/subsequence problems
- String/array search problems
- Palindrome checks

Optimize from O(n²) to O(n) where possible.

## HashMap / HashSet

Use cases:

- Constant time lookup
- Frequency counting
- Detecting duplicates
- Storing precomputed results for DP

## Sum-Up Decision Chart

If input array is sorted:

- Binary search
- Two pointers

If asked for all permutations/subsets:

- Backtracking

If given a tree:

- DFS
- BFS

If given a graph:

- DFS
- BFS

If given a linked list:

- Two pointers

If recursion is banned:

- Use a stack

If must solve in-place:

- Swap values
- Store multiple values in one pointer

If asked for maximum/minimum subarray/subset/options:

- Dynamic programming

If asked for top/least K items:

- Heap

If asked for common strings:

- Map
- Trie

Otherwise:

- Map/Set for O(1) time & O(n) space
- Sort input for O(n log n) time and O(1) space

## Additional Topics You May Want to Include

### Tries

- Efficient retrieval of words/prefixes.
- Common in autocomplete and spell check problems.

### Disjoint Set / Union Find

- Quickly determine connected components.
- Useful for Kruskal’s algorithm, dynamic connectivity, and counting clusters.

### Segment Trees / Fenwick Trees

- Range queries and updates in logarithmic time.

### Monotonic Queues/Stacks

- Optimizing sliding window min/max problems.

### Top K / Reservoir Sampling

- Sampling from data streams or maintaining top K elements dynamically.

### Floyd-Warshall / Bellman-Ford

- Alternative shortest path algorithms for graphs.

### Rolling Hash

- Efficient substring hashing (e.g., Rabin-Karp).

### Binary Indexed Trees (Fenwick Tree)

- Efficient prefix sums and range queries.

### Bitmask DP

- Advanced DP technique for subsets.
