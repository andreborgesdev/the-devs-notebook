# Graphs

A **Graph** is a non-linear data structure consisting of a set of **vertices** (also called **nodes**) and a set of **edges** connecting pairs of vertices. Graphs are used to model relationships and connections between entities.

## Characteristics

- **Vertices (Nodes)**: Fundamental units or points.
- **Edges**: Connections between pairs of vertices.
- **Directed or Undirected**:
  - **Directed Graph (Digraph)**: Edges have direction.
  - **Undirected Graph**: Edges have no direction.
- **Weighted or Unweighted**:
  - **Weighted**: Edges have a value (weight).
  - **Unweighted**: All edges are equal.
- **Cyclic or Acyclic**:
  - **Cyclic**: Contains at least one cycle.
  - **Acyclic**: Contains no cycles.

## Graph Representations

| Representation       | Description                                                                          |
| -------------------- | ------------------------------------------------------------------------------------ |
| **Adjacency Matrix** | 2D array where `matrix[i][j]` indicates edge existence or weight.                    |
| **Adjacency List**   | Each vertex has a list of its adjacent vertices. Memory-efficient for sparse graphs. |
| **Edge List**        | A list of all edges represented as pairs (or triples if weighted).                   |

## Common Operations

| Operation          | Time Complexity (Adjacency List) | Time Complexity (Adjacency Matrix) |
| ------------------ | -------------------------------- | ---------------------------------- |
| Add Vertex         | O(1)                             | O(n²)                              |
| Add Edge           | O(1)                             | O(1)                               |
| Remove Vertex/Edge | O(V + E) / O(1)                  | O(1)                               |
| Search (BFS/DFS)   | O(V + E)                         | O(V²)                              |

`V`: Number of vertices  
`E`: Number of edges

## Java Example: Graph Using Adjacency List

```java showLineNumbers
import java.util.*;

class Graph {
private Map<Integer, List<Integer>> adjList = new HashMap<>();

    // Add a vertex
    public void addVertex(int vertex) {
        adjList.putIfAbsent(vertex, new ArrayList<>());
    }

    // Add an edge (undirected)
    public void addEdge(int v1, int v2) {
        adjList.get(v1).add(v2);
        adjList.get(v2).add(v1);
    }

    // Print the graph
    public void printGraph() {
        for (var entry : adjList.entrySet()) {
            System.out.println(entry.getKey() + " -> " + entry.getValue());
        }
    }

}
```

## Traversal Algorithms

### Breadth-First Search (BFS)

Visits all nodes at the current depth before moving to the next level.

```java showLineNumbers
public void bfs(int start) {
Queue<Integer> queue = new LinkedList<>();
Set<Integer> visited = new HashSet<>();

    queue.add(start);
    visited.add(start);

    while (!queue.isEmpty()) {
        int vertex = queue.poll();
        System.out.print(vertex + " ");

        for (int neighbor : adjList.get(vertex)) {
            if (!visited.contains(neighbor)) {
                visited.add(neighbor);
                queue.add(neighbor);
            }
        }
    }

}
```

### Depth-First Search (DFS)

Explores as far as possible along a branch before backtracking.

```java showLineNumbers
public void dfs(int start) {
Set<Integer> visited = new HashSet<>();
dfsHelper(start, visited);
}

private void dfsHelper(int vertex, Set<Integer> visited) {
visited.add(vertex);
System.out.print(vertex + " ");

    for (int neighbor : adjList.get(vertex)) {
        if (!visited.contains(neighbor)) {
            dfsHelper(neighbor, visited);
        }
    }

}
```

## Common Applications

- Social networks (users as vertices, relationships as edges)
- Web crawlers (web pages as vertices, hyperlinks as edges)
- GPS and navigation systems (locations and roads)
- Networking (routers and connections)
- Scheduling and dependency resolution (topological sort)
- Pathfinding algorithms (Dijkstra’s, A\*)

## Interview Tips

- Be comfortable with both **BFS** and **DFS**.
- Understand when to use **Adjacency List** vs **Adjacency Matrix**.
- Know how to detect **cycles** in both directed and undirected graphs.
- Practice **topological sort** for directed acyclic graphs (DAGs).
- Be ready to implement:
  - Graph traversals (BFS/DFS)
  - Shortest path (Dijkstra’s, Bellman-Ford)
  - Union-Find (Disjoint Set Union - DSU)
  - Minimum spanning tree (Prim’s, Kruskal’s)

## Variants

- **Directed Acyclic Graph (DAG)**: Used in task scheduling and build systems.
- **Weighted Graph**: Common in pathfinding and network flow problems.
- **Bipartite Graph**: Vertices can be divided into two disjoint sets.
- **Tree**: A special case of a graph that is connected and acyclic.

## Summary

A **Graph** is a versatile data structure essential for modeling real-world problems involving networks and relationships. Mastering graph representations, traversals, and algorithms is crucial for both technical interviews and practical applications in software engineering.
