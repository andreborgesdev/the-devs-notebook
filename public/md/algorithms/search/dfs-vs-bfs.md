# DFS vs BFS

Both **Depth-First Search (DFS)** and **Breadth-First Search (BFS)** are fundamental graph traversal algorithms.  
Each has its strengths and ideal use cases.

## Core Concepts

- **DFS (Depth-First Search)** → Explores as deep as possible along each branch before backtracking.
- **BFS (Breadth-First Search)** → Explores all neighbors at the current depth before moving to nodes at the next depth level.

## Data Structures Used

| Algorithm | Data Structure                               |
| --------- | -------------------------------------------- |
| DFS       | Stack (explicit or call stack via recursion) |
| BFS       | Queue (FIFO)                                 |

## Time and Space Complexity

| Algorithm | Time     | Space |
| --------- | -------- | ----- |
| DFS       | O(V + E) | O(V)  |
| BFS       | O(V + E) | O(V)  |

V = number of vertices  
E = number of edges

_(Complexity is the same for both when using adjacency lists. Using adjacency matrices results in O(V²) time.)_

## Key Differences

| BFS                                                             | DFS                                                                       |
| --------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Uses **Queue**                                                  | Uses **Stack** (or recursion)                                             |
| Visits all neighbors at current depth first                     | Explores a full path/branch deeply before backtracking                    |
| Guarantees finding the **shortest path** in an unweighted graph | May not find the shortest path                                            |
| More suitable for **closer solutions**                          | Better for solutions located **far from the root/source**                 |
| Ideal for **shortest path problems, level-order traversal**     | Ideal for **cycle detection, topological sorting, backtracking, puzzles** |
| Siblings visited **before children**                            | Children visited **before siblings**                                      |

## Visual Comparison

![https://miro.medium.com/max/1280/1*GT9oSo0agIeIj6nTg3jFEA.gif](https://miro.medium.com/max/1280/1*GT9oSo0agIeIj6nTg3jFEA.gif)

![https://miro.medium.com/max/750/0*ZIsIX-f-j7kvxJMW.png](https://miro.medium.com/max/750/0*ZIsIX-f-j7kvxJMW.png)

![DFS & BFS Algorithms](https://miro.medium.com/max/1400/1*Js-o5Lsxh7v0DmTmsLavTg.gif)

## Example (BFS vs DFS Output)

```
Graph:
        A
       / \
      B   C
     /   / \
    D   E   F
```

- **BFS Output:** A, B, C, D, E, F
- **DFS Output:** A, B, D, C, E, F

## Typical Applications

| BFS                                      | DFS                                      |
| ---------------------------------------- | ---------------------------------------- |
| Shortest path in unweighted graphs       | Cycle detection                          |
| Level-order traversal                    | Topological sorting                      |
| Finding connected components             | Backtracking (e.g., mazes, puzzles)      |
| Social networks (friend recommendations) | Solving constraint satisfaction problems |

## Important Notes

- **DFS may use less memory** than BFS when the graph has many neighbors at each level.
- **BFS guarantees shortest path** only in **unweighted graphs**.
- DFS can be easily implemented **recursively**.
- BFS is often implemented using a **queue** and is inherently **iterative**.

## Interview Tip

When solving problems:

- **Closer or shortest solution → BFS**.
- **Deeper exploration or all solutions → DFS**.

Understanding when to choose BFS or DFS based on problem requirements is often more important than the implementation itself in interviews.
