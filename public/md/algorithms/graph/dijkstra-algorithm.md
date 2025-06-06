# Dijkstra's Algorithm

**Dijkstra's Algorithm** is a graph traversal and pathfinding algorithm that finds the shortest path between nodes in a **weighted graph with non-negative edge weights**.

It's one of the most important algorithms for solving **Single-Source Shortest Path (SSSP)** problems and is widely used in networking, GPS navigation, and social networks.

## Key Concepts

- **Single-Source Shortest Path**: Find shortest paths from one source vertex to all other vertices
- **Greedy Algorithm**: Always selects the nearest unvisited vertex
- **Non-negative weights only**: Cannot handle negative edge weights
- **Optimal Substructure**: Uses previously computed shortest paths to build longer ones

## Time and Space Complexity

| Implementation | Time Complexity  | Space Complexity |
| -------------- | ---------------- | ---------------- |
| Array (Basic)  | O(V²)            | O(V)             |
| Binary Heap    | O((V + E) log V) | O(V)             |
| Fibonacci Heap | O(E + V log V)   | O(V)             |

**V** = number of vertices, **E** = number of edges

## How It Works

1. **Initialize**: Set distance to source as 0, all others as infinity
2. **Priority Queue**: Use min-heap to always process nearest vertex first
3. **Relax Edges**: For each neighbor, check if path through current vertex is shorter
4. **Update Distances**: If shorter path found, update distance and add to queue
5. **Repeat**: Continue until all vertices are processed

## Algorithm Steps

```
1. Create distance array: dist[source] = 0, dist[others] = ∞
2. Create priority queue with all vertices
3. While priority queue is not empty:
   a. Extract vertex u with minimum distance
   b. For each neighbor v of u:
      - Calculate alt = dist[u] + weight(u,v)
      - If alt < dist[v]:
          * dist[v] = alt
          * previous[v] = u (for path reconstruction)
4. Return distance array
```

## Java Implementation

```java showLineNumbers
import java.util.*;

class DijkstraGraph {
    private int vertices;
    private List<List<Edge>> adjList;

    static class Edge {
        int destination;
        int weight;

        Edge(int destination, int weight) {
            this.destination = destination;
            this.weight = weight;
        }
    }

    static class Node implements Comparable<Node> {
        int vertex;
        int distance;

        Node(int vertex, int distance) {
            this.vertex = vertex;
            this.distance = distance;
        }

        @Override
        public int compareTo(Node other) {
            return Integer.compare(this.distance, other.distance);
        }
    }

    public DijkstraGraph(int vertices) {
        this.vertices = vertices;
        this.adjList = new ArrayList<>();
        for (int i = 0; i < vertices; i++) {
            adjList.add(new ArrayList<>());
        }
    }

    public void addEdge(int source, int dest, int weight) {
        adjList.get(source).add(new Edge(dest, weight));
        adjList.get(dest).add(new Edge(source, weight)); // For undirected graph
    }

    public int[] dijkstra(int source) {
        int[] distances = new int[vertices];
        int[] previous = new int[vertices];
        boolean[] visited = new boolean[vertices];

        Arrays.fill(distances, Integer.MAX_VALUE);
        Arrays.fill(previous, -1);
        distances[source] = 0;

        PriorityQueue<Node> pq = new PriorityQueue<>();
        pq.offer(new Node(source, 0));

        while (!pq.isEmpty()) {
            Node current = pq.poll();
            int u = current.vertex;

            if (visited[u]) continue;
            visited[u] = true;

            for (Edge edge : adjList.get(u)) {
                int v = edge.destination;
                int weight = edge.weight;

                if (!visited[v] && distances[u] + weight < distances[v]) {
                    distances[v] = distances[u] + weight;
                    previous[v] = u;
                    pq.offer(new Node(v, distances[v]));
                }
            }
        }

        return distances;
    }

    public List<Integer> getPath(int source, int target, int[] previous) {
        List<Integer> path = new ArrayList<>();
        int current = target;

        while (current != -1) {
            path.add(current);
            current = previous[current];
        }

        Collections.reverse(path);
        return path.get(0) == source ? path : new ArrayList<>();
    }

    public void printShortestPaths(int source) {
        int[] distances = dijkstra(source);

        System.out.println("Shortest distances from vertex " + source + ":");
        for (int i = 0; i < vertices; i++) {
            if (distances[i] == Integer.MAX_VALUE) {
                System.out.println("Vertex " + i + ": No path");
            } else {
                System.out.println("Vertex " + i + ": " + distances[i]);
            }
        }
    }
}
```

## Example Walkthrough

**Graph:**

```
    (0)----4----(1)
     |         / |
     |        /  |
     2       1   5
     |      /    |
     |     /     |
    (2)---3-----(3)
```

**Step-by-step execution from source 0:**

| Step | Current | Queue State   | Distances | Action                           |
| ---- | ------- | ------------- | --------- | -------------------------------- |
| 1    | 0       | [(0,0)]       | [0,∞,∞,∞] | Start from vertex 0              |
| 2    | 0       | [(1,4),(2,2)] | [0,4,2,∞] | Process vertex 0 neighbors       |
| 3    | 2       | [(1,4),(3,5)] | [0,4,2,5] | Process vertex 2, update dist[3] |
| 4    | 1       | [(3,5),(3,9)] | [0,4,2,5] | Process vertex 1, no updates     |
| 5    | 3       | []            | [0,4,2,5] | Process vertex 3, done           |

**Final shortest distances:** [0, 4, 2, 5]

## Variants and Extensions

### Dijkstra with Path Reconstruction

```java showLineNumbers
public class DijkstraWithPath {
    public static class Result {
        int[] distances;
        int[] previous;

        Result(int[] distances, int[] previous) {
            this.distances = distances;
            this.previous = previous;
        }
    }

    public Result dijkstraWithPath(int source) {
        int[] distances = new int[vertices];
        int[] previous = new int[vertices];
        boolean[] visited = new boolean[vertices];

        Arrays.fill(distances, Integer.MAX_VALUE);
        Arrays.fill(previous, -1);
        distances[source] = 0;

        PriorityQueue<Node> pq = new PriorityQueue<>();
        pq.offer(new Node(source, 0));

        while (!pq.isEmpty()) {
            Node current = pq.poll();
            int u = current.vertex;

            if (visited[u]) continue;
            visited[u] = true;

            for (Edge edge : adjList.get(u)) {
                int v = edge.destination;
                int weight = edge.weight;

                if (!visited[v] && distances[u] + weight < distances[v]) {
                    distances[v] = distances[u] + weight;
                    previous[v] = u;
                    pq.offer(new Node(v, distances[v]));
                }
            }
        }

        return new Result(distances, previous);
    }
}
```

## Comparison with Other Algorithms

| Algorithm      | Use Case                            | Time Complexity | Negative Weights |
| -------------- | ----------------------------------- | --------------- | ---------------- |
| Dijkstra       | Single-source, non-negative weights | O((V+E) log V)  | ❌ No            |
| Bellman-Ford   | Single-source, negative weights OK  | O(VE)           | ✅ Yes           |
| Floyd-Warshall | All-pairs shortest path             | O(V³)           | ✅ Yes           |
| A\*            | Single-target with heuristic        | O(b^d)          | ❌ No            |

## Applications

### GPS Navigation Systems

```java showLineNumbers
class GPSNavigation {
    public List<String> findRoute(String start, String destination) {
        DijkstraGraph map = loadRoadNetwork();
        int startId = getLocationId(start);
        int destId = getLocationId(destination);

        int[] distances = map.dijkstra(startId);
        return reconstructRoute(startId, destId, distances);
    }
}
```

### Network Routing Protocols

- **OSPF (Open Shortest Path First)**: Uses Dijkstra for routing tables
- **IS-IS Protocol**: Link-state routing using shortest path first

### Social Networks

- Find shortest connection path between users
- Friend recommendation systems
- Influence propagation analysis

## Common Pitfalls and Edge Cases

### Negative Weights

```java
// Dijkstra CANNOT handle negative weights
// This will produce incorrect results:
graph.addEdge(0, 1, -5);  // ❌ Wrong!
```

### Disconnected Graphs

```java showLineNumbers
public boolean isReachable(int source, int target) {
    int[] distances = dijkstra(source);
    return distances[target] != Integer.MAX_VALUE;
}
```

### Self-loops and Multiple Edges

```java showLineNumbers
// Handle multiple edges by keeping only the minimum weight
public void addEdgeOptimized(int source, int dest, int weight) {
    List<Edge> edges = adjList.get(source);

    // Check if edge already exists
    for (Edge edge : edges) {
        if (edge.destination == dest) {
            edge.weight = Math.min(edge.weight, weight);
            return;
        }
    }

    edges.add(new Edge(dest, weight));
}
```

## Interview Tips

### Time Complexity Analysis

- **Why O((V+E) log V)?** Each vertex is extracted once (V log V), each edge is relaxed once (E log V)
- **When is it O(V²)?** Dense graphs where E ≈ V², or using array-based implementation

### Implementation Details

- **Priority Queue**: Always use min-heap for efficiency
- **Visited Array**: Prevents reprocessing vertices
- **Distance Initialization**: Set source to 0, others to infinity

### Common Interview Questions

1. **"Why doesn't Dijkstra work with negative weights?"**

   - Greedy choice may become suboptimal when negative weights are encountered later

2. **"How to modify for finding longest path?"**

   - Use max-heap and negate all weights (only works for DAGs due to negative cycles)

3. **"Space optimization techniques?"**
   - Bidirectional search, A\* with admissible heuristic

### Quick Decision Framework

- **Single-source + non-negative weights** → Dijkstra
- **Need to handle negative weights** → Bellman-Ford
- **All-pairs shortest paths** → Floyd-Warshall
- **Single target + good heuristic** → A\*

## Advanced Optimizations

### Bidirectional Dijkstra

```java showLineNumbers
public int bidirectionalDijkstra(int source, int target) {
    // Run Dijkstra from both source and target simultaneously
    // Stop when they meet in the middle
    // Can reduce search space significantly
}
```

### A\* Algorithm Enhancement

```java showLineNumbers
public int aStarDijkstra(int source, int target, Heuristic h) {
    // Use Dijkstra with admissible heuristic
    // Guarantees optimal solution while potentially faster
}
```

## Practice Problems

### Essential LeetCode Problems

1. **Network Delay Time** (Medium) - Direct Dijkstra application
2. **Cheapest Flights Within K Stops** (Medium) - Modified Dijkstra
3. **Path with Maximum Probability** (Medium) - Max-probability variant
4. **Minimum Cost to Make at Least One Valid Path** (Hard) - 0-1 BFS variation

### Advanced Problems

- **Shortest Path with Alternating Colors**
- **Minimum Cost to Connect All Points**
- **Find the City With the Smallest Number of Neighbors**
