# Breadth-First Search (BFS)

**Breadth-First Search (BFS)** is a **vertex-based graph traversal algorithm** that explores all the neighbors of a node before moving to the next level of neighbors.  
It uses a **Queue** data structure (**First-In-First-Out**, FIFO).

BFS is commonly used to find:

- The **shortest path** in unweighted graphs.
- Connected components.
- Level-order traversal in trees.

## Key Concepts

- Start from a given node (**source**).
- Visit and mark the node.
- Add all unvisited neighbors to the **queue**.
- Continue visiting nodes from the front of the queue and expanding their neighbors.

## Time and Space Complexity

|       | Complexity |
| ----- | ---------- |
| Time  | O(V + E)   |
| Space | O(V)       |

V = number of vertices, E = number of edges.

## How It Works

Each iteration expands the "frontier" outwards:

1. Visit all the neighbors of the current node.
2. For each visited neighbor, visit their neighbors.
3. Continue until all reachable nodes are visited.

## Example

**Input graph:**

```
        A
       / \
      B   C
     /   / \
    D   E   F
```

**BFS Output:**  
`A, B, C, D, E, F`

## Java Example

```java showLineNumbers
import java.util.*;

class Graph {
private Map<Character, List<Character>> adjList = new HashMap<>();

    public void addEdge(char u, char v) {
        adjList.computeIfAbsent(u, k -> new ArrayList<>()).add(v);
        adjList.computeIfAbsent(v, k -> new ArrayList<>()).add(u); // For undirected graph
    }

    public void bfs(char start) {
        Set<Character> visited = new HashSet<>();
        Queue<Character> queue = new LinkedList<>();

        visited.add(start);
        queue.add(start);

        while (!queue.isEmpty()) {
            char node = queue.poll();
            System.out.print(node + " ");

            for (char neighbor : adjList.getOrDefault(node, new ArrayList<>())) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.add(neighbor);
                }
            }
        }
    }

    public static void main(String[] args) {
        Graph g = new Graph();
        g.addEdge('A', 'B');
        g.addEdge('A', 'C');
        g.addEdge('B', 'D');
        g.addEdge('C', 'E');
        g.addEdge('C', 'F');

        System.out.println("BFS Traversal starting from A:");
        g.bfs('A'); // Output: A B C D E F
    }

}
```

## BFS vs DFS

|                  | BFS                         | DFS                               |
| ---------------- | --------------------------- | --------------------------------- |
| Data Structure   | Queue                       | Stack (or Recursion)              |
| Space Complexity | O(V)                        | O(V)                              |
| Time Complexity  | O(V + E)                    | O(V + E)                          |
| Use Cases        | Shortest paths, Level-order | Cycle detection, Topological sort |

## Applications

- Shortest path finding in unweighted graphs.
- Web crawling.
- Social networking sites (friend recommendations).
- Peer-to-peer networks.
- Level-order traversal of trees.
- Solving puzzles (e.g., sliding puzzles, chess problems).

## Interview Tips

- **Key idea:** Visit neighbors level by level.
- Know how to implement BFS using both **adjacency list** and **adjacency matrix**.
- Be ready to apply BFS for:
  - Shortest path in unweighted graphs.
  - Cycle detection in undirected graphs.
  - Level-order traversal in trees.
- Be able to explain **why BFS guarantees shortest path** in unweighted graphs.
