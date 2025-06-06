# Bellman-Ford Algorithm

**Bellman-Ford Algorithm** is a graph algorithm that computes shortest paths from a single source vertex to all other vertices in a **weighted graph**. Unlike Dijkstra's algorithm, it can handle **negative edge weights** and can **detect negative cycles**.

It's essential for networks where edge weights can be negative and when you need to detect negative cycles that make shortest path undefined.

## Key Concepts

- **Single-Source Shortest Path**: Finds shortest paths from one source to all vertices
- **Negative Weights Allowed**: Can handle negative edge weights correctly
- **Negative Cycle Detection**: Can detect if negative cycles exist
- **Dynamic Programming**: Uses relaxation principle repeatedly

## Time and Space Complexity

| Operation                | Time Complexity         | Space Complexity |
| ------------------------ | ----------------------- | ---------------- |
| Standard Algorithm       | O(VE)                   | O(V)             |
| With Early Termination   | O(VE) best, O(VE) worst | O(V)             |
| Negative Cycle Detection | O(VE)                   | O(V)             |

**V** = number of vertices, **E** = number of edges

## How It Works

1. **Initialize**: Set distance to source as 0, all others as infinity
2. **Relax Edges**: For V-1 iterations, relax all edges
3. **Detect Negative Cycles**: Run one more iteration to check for improvements
4. **If distance decreases in step 3**: Negative cycle exists

## Algorithm Steps

```
1. Initialize distances: dist[source] = 0, dist[others] = ∞
2. For i = 1 to V-1:
   For each edge (u,v) with weight w:
     if dist[u] + w < dist[v]:
       dist[v] = dist[u] + w
       previous[v] = u
3. For each edge (u,v) with weight w:
   if dist[u] + w < dist[v]:
     return "Negative cycle detected"
4. Return distances array
```

## Java Implementation

```java showLineNumbers
import java.util.*;

class BellmanFordGraph {
    private int vertices;
    private List<Edge> edges;

    static class Edge {
        int source;
        int destination;
        int weight;

        Edge(int source, int destination, int weight) {
            this.source = source;
            this.destination = destination;
            this.weight = weight;
        }
    }

    static class BellmanFordResult {
        int[] distances;
        int[] previous;
        boolean hasNegativeCycle;

        BellmanFordResult(int[] distances, int[] previous, boolean hasNegativeCycle) {
            this.distances = distances;
            this.previous = previous;
            this.hasNegativeCycle = hasNegativeCycle;
        }
    }

    public BellmanFordGraph(int vertices) {
        this.vertices = vertices;
        this.edges = new ArrayList<>();
    }

    public void addEdge(int source, int dest, int weight) {
        edges.add(new Edge(source, dest, weight));
    }

    public BellmanFordResult bellmanFord(int source) {
        int[] distances = new int[vertices];
        int[] previous = new int[vertices];

        Arrays.fill(distances, Integer.MAX_VALUE);
        Arrays.fill(previous, -1);
        distances[source] = 0;

        // Step 1: Relax edges repeatedly
        for (int i = 1; i < vertices; i++) {
            boolean updated = false;

            for (Edge edge : edges) {
                int u = edge.source;
                int v = edge.destination;
                int weight = edge.weight;

                if (distances[u] != Integer.MAX_VALUE &&
                    distances[u] + weight < distances[v]) {
                    distances[v] = distances[u] + weight;
                    previous[v] = u;
                    updated = true;
                }
            }

            // Early termination if no updates
            if (!updated) {
                break;
            }
        }

        // Step 2: Check for negative cycles
        boolean hasNegativeCycle = false;
        for (Edge edge : edges) {
            int u = edge.source;
            int v = edge.destination;
            int weight = edge.weight;

            if (distances[u] != Integer.MAX_VALUE &&
                distances[u] + weight < distances[v]) {
                hasNegativeCycle = true;
                break;
            }
        }

        return new BellmanFordResult(distances, previous, hasNegativeCycle);
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

    public void printResults(int source) {
        BellmanFordResult result = bellmanFord(source);

        if (result.hasNegativeCycle) {
            System.out.println("Graph contains negative cycle!");
            return;
        }

        System.out.println("Shortest distances from vertex " + source + ":");
        for (int i = 0; i < vertices; i++) {
            if (result.distances[i] == Integer.MAX_VALUE) {
                System.out.println("Vertex " + i + ": No path");
            } else {
                System.out.println("Vertex " + i + ": " + result.distances[i]);
            }
        }
    }
}
```

## Example Walkthrough

**Graph with negative edges:**

```
    (0)----1----(1)
     |         / |
     |       -3  |
     4      /    2
     |     /     |
     |    /      |
    (2)---5-----(3)
```

**Step-by-step execution from source 0:**

| Iteration | Edge Relaxations           | Distances  | Updates              |
| --------- | -------------------------- | ---------- | -------------------- |
| Initial   | -                          | [0,∞,∞,∞]  | -                    |
| 1         | (0,1): 0+1<∞, (0,2): 0+4<∞ | [0,1,4,∞]  | dist[1]=1, dist[2]=4 |
| 2         | (1,3): 1+2<∞, (2,3): 4+5<∞ | [0,1,4,3]  | dist[3]=3            |
| 3         | (1,2): 1+(-3)<4            | [0,1,-2,3] | dist[2]=-2           |
| 4         | (2,3): -2+5<3              | [0,1,-2,3] | dist[3]=3            |

**Check for negative cycle:** No further improvements possible.

## Negative Cycle Detection

```java showLineNumbers
public class NegativeCycleDetector {

    public List<Integer> findNegativeCycle(BellmanFordGraph graph, int source) {
        BellmanFordResult result = graph.bellmanFord(source);

        if (!result.hasNegativeCycle) {
            return new ArrayList<>(); // No negative cycle
        }

        // Find vertices affected by negative cycle
        int[] distances = result.distances.clone();
        int[] previous = result.previous.clone();

        // Run additional iterations to find cycle
        int affectedVertex = -1;
        for (Edge edge : graph.edges) {
            int u = edge.source;
            int v = edge.destination;
            int weight = edge.weight;

            if (distances[u] != Integer.MAX_VALUE &&
                distances[u] + weight < distances[v]) {
                distances[v] = distances[u] + weight;
                previous[v] = u;
                affectedVertex = v;
            }
        }

        // Trace back to find the cycle
        List<Integer> cycle = new ArrayList<>();
        Set<Integer> visited = new HashSet<>();
        int current = affectedVertex;

        while (!visited.contains(current)) {
            visited.add(current);
            cycle.add(current);
            current = previous[current];
        }

        // Extract the actual cycle
        int cycleStart = current;
        List<Integer> actualCycle = new ArrayList<>();
        do {
            actualCycle.add(current);
            current = previous[current];
        } while (current != cycleStart);

        return actualCycle;
    }
}
```

## Advanced Implementations

### Space-Optimized Version

```java showLineNumbers
public class SpaceOptimizedBellmanFord {

    public boolean hasNegativeCycle(List<Edge> edges, int vertices, int source) {
        int[] distances = new int[vertices];
        Arrays.fill(distances, Integer.MAX_VALUE);
        distances[source] = 0;

        // Relax edges V-1 times
        for (int i = 1; i < vertices; i++) {
            for (Edge edge : edges) {
                if (distances[edge.source] != Integer.MAX_VALUE) {
                    distances[edge.destination] = Math.min(
                        distances[edge.destination],
                        distances[edge.source] + edge.weight
                    );
                }
            }
        }

        // Check for negative cycle
        for (Edge edge : edges) {
            if (distances[edge.source] != Integer.MAX_VALUE &&
                distances[edge.source] + edge.weight < distances[edge.destination]) {
                return true;
            }
        }

        return false;
    }
}
```

### SPFA (Shortest Path Faster Algorithm)

```java showLineNumbers
public class SPFAAlgorithm {

    public int[] spfa(List<List<Edge>> adjList, int source) {
        int vertices = adjList.size();
        int[] distances = new int[vertices];
        boolean[] inQueue = new boolean[vertices];
        int[] count = new int[vertices]; // Count of times vertex is processed

        Arrays.fill(distances, Integer.MAX_VALUE);
        distances[source] = 0;

        Queue<Integer> queue = new LinkedList<>();
        queue.offer(source);
        inQueue[source] = true;

        while (!queue.isEmpty()) {
            int u = queue.poll();
            inQueue[u] = false;
            count[u]++;

            // If vertex processed more than V times, negative cycle exists
            if (count[u] > vertices) {
                return null; // Negative cycle detected
            }

            for (Edge edge : adjList.get(u)) {
                int v = edge.destination;
                int weight = edge.weight;

                if (distances[u] + weight < distances[v]) {
                    distances[v] = distances[u] + weight;

                    if (!inQueue[v]) {
                        queue.offer(v);
                        inQueue[v] = true;
                    }
                }
            }
        }

        return distances;
    }
}
```

## Comparison with Other Algorithms

| Algorithm      | Time Complexity | Space | Negative Weights | Negative Cycles | Use Case                          |
| -------------- | --------------- | ----- | ---------------- | --------------- | --------------------------------- |
| Bellman-Ford   | O(VE)           | O(V)  | ✅ Yes           | ✅ Detects      | Negative weights, cycle detection |
| Dijkstra       | O((V+E) log V)  | O(V)  | ❌ No            | ❌ No           | Non-negative weights only         |
| Floyd-Warshall | O(V³)           | O(V²) | ✅ Yes           | ✅ Detects      | All-pairs shortest path           |
| SPFA           | O(VE) worst     | O(V)  | ✅ Yes           | ✅ Detects      | Often faster than Bellman-Ford    |

## Applications

### Currency Arbitrage Detection

```java showLineNumbers
class CurrencyArbitrage {

    public boolean hasArbitrageOpportunity(double[][] exchangeRates) {
        int n = exchangeRates.length;
        List<Edge> edges = new ArrayList<>();

        // Convert to negative log weights
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (i != j && exchangeRates[i][j] > 0) {
                    int weight = (int)(-Math.log(exchangeRates[i][j]) * 1000);
                    edges.add(new Edge(i, j, weight));
                }
            }
        }

        // If negative cycle exists, arbitrage opportunity exists
        BellmanFordGraph graph = new BellmanFordGraph(n);
        for (Edge edge : edges) {
            graph.addEdge(edge.source, edge.destination, edge.weight);
        }

        return graph.bellmanFord(0).hasNegativeCycle;
    }
}
```

### Network Routing with QoS

```java showLineNumbers
class QoSRouting {

    public class QoSEdge extends Edge {
        int delay;
        int bandwidth;

        QoSEdge(int source, int dest, int cost, int delay, int bandwidth) {
            super(source, dest, cost);
            this.delay = delay;
            this.bandwidth = bandwidth;
        }
    }

    public int[] findOptimalRouting(List<QoSEdge> network, int source) {
        // Use Bellman-Ford with composite weights considering cost, delay, bandwidth
        // Can handle negative preferences (higher bandwidth = negative weight)
        return null; // Implementation specific to QoS requirements
    }
}
```

### Distance Vector Routing Protocol

- **RIP (Routing Information Protocol)**: Uses Bellman-Ford principle
- **BGP (Border Gateway Protocol)**: Path vector variant
- **Handles link failures and recovery**

## Common Pitfalls and Edge Cases

### Integer Overflow

```java showLineNumbers
public boolean safeAdd(int a, int b) {
    if (a == Integer.MAX_VALUE || b == Integer.MAX_VALUE) {
        return false;
    }
    return Long.valueOf(a) + Long.valueOf(b) <= Integer.MAX_VALUE;
}
```

### Disconnected Components

```java showLineNumbers
public boolean isReachable(int source, int target, int[] distances) {
    return distances[target] != Integer.MAX_VALUE;
}
```

### Early Termination Optimization

```java showLineNumbers
// Stop early if no updates in an iteration
for (int i = 1; i < vertices; i++) {
    boolean hasUpdate = false;

    for (Edge edge : edges) {
        // ... relaxation logic
        if (updated) {
            hasUpdate = true;
        }
    }

    if (!hasUpdate) {
        break; // Converged early
    }
}
```

## Interview Tips

### When to Use Bellman-Ford

1. **Graph has negative edge weights**
2. **Need to detect negative cycles**
3. **Distributed systems** (distance vector routing)
4. **Currency arbitrage problems**

### Key Points to Mention

- **O(VE) time complexity** vs Dijkstra's O((V+E) log V)
- **Can handle negative weights** unlike Dijkstra
- **Detects negative cycles** which make shortest path undefined
- **Uses dynamic programming** principle (relaxation)

### Implementation Details

- **Why V-1 iterations?** Longest simple path has at most V-1 edges
- **Relaxation order doesn't matter** (unlike Dijkstra)
- **Early termination possible** if no updates in iteration

### Common Interview Questions

1. **"Why does Bellman-Ford work with negative weights but Dijkstra doesn't?"**

   - Bellman-Ford doesn't make greedy choices; it considers all possibilities

2. **"How to detect negative cycles?"**

   - Run algorithm for V iterations; if Vth iteration updates distances, negative cycle exists

3. **"Can you optimize Bellman-Ford?"**
   - SPFA algorithm, early termination, queue-based improvements

## Advanced Topics

### Detecting All Negative Cycles

```java showLineNumbers
public List<List<Integer>> findAllNegativeCycles(BellmanFordGraph graph) {
    // Use DFS after detecting negative cycle to find all affected vertices
    // Multiple passes may be needed for disconnected negative cycles
}
```

### Parallel Bellman-Ford

```java showLineNumbers
public class ParallelBellmanFord {
    // Partition edges among threads
    // Synchronize distance updates
    // Useful for large graphs
}
```

## Practice Problems

### Essential LeetCode Problems

1. **Cheapest Flights Within K Stops** (Medium) - Modified Bellman-Ford
2. **Network Delay Time** (Medium) - Compare with Dijkstra
3. **Find the City With the Smallest Number of Neighbors** (Medium)

### Advanced Problems

- **Currency Exchange** - Negative cycle detection
- **Time Travel** - Temporal graph shortest paths
- **Wormhole Problems** - Negative weight cycles

### Real-world Applications

- **Internet routing protocols**
- **Financial arbitrage detection**
- **Game theory equilibrium**
- **Supply chain optimization**
