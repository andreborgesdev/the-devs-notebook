# Floyd-Warshall Algorithm

**Floyd-Warshall Algorithm** is a graph algorithm for finding **shortest paths between all pairs of vertices** in a weighted graph. It can handle both positive and negative edge weights (but not negative cycles) and works on **dense graphs** where you need distances between every pair of nodes.

It's particularly useful when you need to answer multiple shortest path queries efficiently.

## Key Concepts

- **All-Pairs Shortest Path (APSP)**: Finds shortest paths between every pair of vertices
- **Dynamic Programming**: Uses optimal substructure to build solutions
- **Negative Weights Allowed**: Can handle negative edges but not negative cycles
- **Dense Graph Optimization**: More efficient than running Dijkstra V times for dense graphs

## Time and Space Complexity

| Operation           | Time Complexity | Space Complexity |
| ------------------- | --------------- | ---------------- |
| Standard Algorithm  | O(V³)           | O(V²)            |
| Path Reconstruction | O(V) per query  | O(V²) additional |
| Space Optimized     | O(V³)           | O(V²)            |

**V** = number of vertices

## How It Works

The algorithm uses **dynamic programming** with the following recurrence:

```
dist[i][j][k] = minimum distance from i to j using vertices {0,1,...,k} as intermediates

dist[i][j][k] = min(
    dist[i][j][k-1],           // Don't use vertex k
    dist[i][k][k-1] + dist[k][j][k-1]  // Use vertex k as intermediate
)
```

Since we only need the previous "layer" k-1, we can optimize space to 2D.

## Algorithm Steps

```
1. Initialize distance matrix:
   - dist[i][i] = 0 (distance to self)
   - dist[i][j] = weight(i,j) if edge exists
   - dist[i][j] = ∞ otherwise

2. For k = 0 to V-1:
   For i = 0 to V-1:
     For j = 0 to V-1:
       if dist[i][k] + dist[k][j] < dist[i][j]:
         dist[i][j] = dist[i][k] + dist[k][j]
         next[i][j] = next[i][k] (for path reconstruction)

3. Check for negative cycles:
   If dist[i][i] < 0 for any i, negative cycle exists
```

## Java Implementation

```java showLineNumbers
import java.util.*;

public class FloydWarshall {
    private static final int INF = Integer.MAX_VALUE / 2; // Avoid overflow

    public static class Result {
        int[][] distances;
        int[][] next; // For path reconstruction
        boolean hasNegativeCycle;

        Result(int[][] distances, int[][] next, boolean hasNegativeCycle) {
            this.distances = distances;
            this.next = next;
            this.hasNegativeCycle = hasNegativeCycle;
        }
    }

    public static Result floydWarshall(int[][] graph) {
        int n = graph.length;
        int[][] dist = new int[n][n];
        int[][] next = new int[n][n];

        // Initialize distance and next matrices
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                dist[i][j] = graph[i][j];
                if (i != j && graph[i][j] != INF) {
                    next[i][j] = j;
                } else {
                    next[i][j] = -1;
                }
            }
        }

        // Main Floyd-Warshall algorithm
        for (int k = 0; k < n; k++) {
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < n; j++) {
                    if (dist[i][k] != INF && dist[k][j] != INF) {
                        if (dist[i][k] + dist[k][j] < dist[i][j]) {
                            dist[i][j] = dist[i][k] + dist[k][j];
                            next[i][j] = next[i][k];
                        }
                    }
                }
            }
        }

        // Check for negative cycles
        boolean hasNegativeCycle = false;
        for (int i = 0; i < n; i++) {
            if (dist[i][i] < 0) {
                hasNegativeCycle = true;
                break;
            }
        }

        return new Result(dist, next, hasNegativeCycle);
    }

    public static List<Integer> reconstructPath(int[][] next, int start, int end) {
        if (next[start][end] == -1) {
            return new ArrayList<>(); // No path exists
        }

        List<Integer> path = new ArrayList<>();
        int current = start;
        path.add(current);

        while (current != end) {
            current = next[current][end];
            path.add(current);
        }

        return path;
    }

    public static void printSolution(Result result) {
        int n = result.distances.length;

        if (result.hasNegativeCycle) {
            System.out.println("Graph contains negative cycle!");
            return;
        }

        System.out.println("Shortest distances between all pairs:");
        System.out.print("     ");
        for (int j = 0; j < n; j++) {
            System.out.printf("%8d", j);
        }
        System.out.println();

        for (int i = 0; i < n; i++) {
            System.out.printf("%3d: ", i);
            for (int j = 0; j < n; j++) {
                if (result.distances[i][j] == INF) {
                    System.out.printf("%8s", "INF");
                } else {
                    System.out.printf("%8d", result.distances[i][j]);
                }
            }
            System.out.println();
        }
    }

    // Example usage
    public static void main(String[] args) {
        int[][] graph = {
            {0, 3, INF, 7},
            {8, 0, 2, INF},
            {5, INF, 0, 1},
            {2, INF, INF, 0}
        };

        Result result = floydWarshall(graph);
        printSolution(result);

        // Example path reconstruction
        List<Integer> path = reconstructPath(result.next, 0, 3);
        System.out.println("Path from 0 to 3: " + path);
    }
}
```

## Example Walkthrough

**Initial Graph:**

```
    (0)----3--->(1)
     |          |
     |          |2
     7          ↓
     |         (2)----1--->(3)
     ↓          ↑
    (3)<---2---(2)
             5
```

**Step-by-step execution:**

### Initial Distance Matrix

```
     0   1   2   3
0:   0   3  ∞   7
1:   8   0   2  ∞
2:   5  ∞   0   1
3:   2  ∞  ∞   0
```

### After k=0 (using vertex 0 as intermediate)

```
     0   1   2   3
0:   0   3  ∞   7
1:   8   0   2  15  // 1→0→3 = 8+7 = 15
2:   5   8   0   1  // 2→0→1 = 5+3 = 8
3:   2   5  ∞   0  // 3→0→1 = 2+3 = 5
```

### After k=1 (using vertex 1 as intermediate)

```
     0   1   2   3
0:   0   3   5   7  // 0→1→2 = 3+2 = 5
1:   8   0   2   3  // 1→2→3 = 2+1 = 3
2:   5   8   0   1
3:   2   5   7   0  // 3→0→1→2 = 2+3+2 = 7
```

### After k=2 (using vertex 2 as intermediate)

```
     0   1   2   3
0:   0   3   5   6  // 0→1→2→3 = 3+2+1 = 6
1:   7   0   2   3  // 1→2→0 = 2+5 = 7
2:   5   8   0   1
3:   2   5   7   0
```

### After k=3 (using vertex 3 as intermediate)

```
     0   1   2   3
0:   0   3   5   6
1:   5   0   2   3  // 1→2→3→0→1 = 2+1+2+3 = 8, but 1→2→0→1 = 2+5+3 = 10
2:   3   6   0   1  // 2→3→0 = 1+2 = 3, 2→3→0→1 = 1+2+3 = 6
3:   2   5   7   0
```

## Advanced Implementations

### Memory-Optimized Version

```java showLineNumbers
public class MemoryOptimizedFloydWarshall {

    public static int[][] floydWarshallOptimized(int[][] graph) {
        int n = graph.length;
        int[][] dist = new int[n][n];

        // Copy input graph
        for (int i = 0; i < n; i++) {
            System.arraycopy(graph[i], 0, dist[i], 0, n);
        }

        // Floyd-Warshall without path reconstruction
        for (int k = 0; k < n; k++) {
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < n; j++) {
                    if (dist[i][k] != INF && dist[k][j] != INF &&
                        dist[i][k] + dist[k][j] < dist[i][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j];
                    }
                }
            }
        }

        return dist;
    }
}
```

### Parallel Floyd-Warshall

```java showLineNumbers
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class ParallelFloydWarshall {

    public static int[][] parallelFloydWarshall(int[][] graph, int numThreads) {
        int n = graph.length;
        int[][] dist = new int[n][n];

        // Initialize distance matrix
        for (int i = 0; i < n; i++) {
            System.arraycopy(graph[i], 0, dist[i], 0, n);
        }

        ExecutorService executor = Executors.newFixedThreadPool(numThreads);

        for (int k = 0; k < n; k++) {
            final int currentK = k;

            // Parallelize the inner loops
            for (int i = 0; i < n; i++) {
                final int currentI = i;
                executor.submit(() -> {
                    for (int j = 0; j < n; j++) {
                        if (dist[currentI][currentK] != INF &&
                            dist[currentK][j] != INF &&
                            dist[currentI][currentK] + dist[currentK][j] < dist[currentI][j]) {
                            dist[currentI][j] = dist[currentI][currentK] + dist[currentK][j];
                        }
                    }
                });
            }

            // Wait for all threads to complete this iteration
            try {
                executor.shutdown();
                executor.awaitTermination(Long.MAX_VALUE, TimeUnit.NANOSECONDS);
                executor = Executors.newFixedThreadPool(numThreads);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }

        executor.shutdown();
        return dist;
    }
}
```

### Transitive Closure

```java showLineNumbers
public class TransitiveClosure {

    public static boolean[][] transitiveClosure(boolean[][] graph) {
        int n = graph.length;
        boolean[][] reach = new boolean[n][n];

        // Initialize reachability matrix
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                reach[i][j] = graph[i][j] || (i == j);
            }
        }

        // Floyd-Warshall for reachability
        for (int k = 0; k < n; k++) {
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < n; j++) {
                    reach[i][j] = reach[i][j] || (reach[i][k] && reach[k][j]);
                }
            }
        }

        return reach;
    }
}
```

## Applications

### Road Network Analysis

```java showLineNumbers
class RoadNetwork {
    private int[][] distances;
    private String[] cityNames;

    public class RouteInfo {
        List<String> cities;
        int totalDistance;

        RouteInfo(List<String> cities, int totalDistance) {
            this.cities = cities;
            this.totalDistance = totalDistance;
        }
    }

    public RouteInfo findShortestRoute(String from, String to) {
        FloydWarshall.Result result = FloydWarshall.floydWarshall(distances);

        int fromIndex = getCityIndex(from);
        int toIndex = getCityIndex(to);

        List<Integer> pathIndices = FloydWarshall.reconstructPath(
            result.next, fromIndex, toIndex);

        List<String> cities = pathIndices.stream()
            .map(i -> cityNames[i])
            .collect(Collectors.toList());

        return new RouteInfo(cities, result.distances[fromIndex][toIndex]);
    }
}
```

### Social Network Analysis

```java showLineNumbers
class SocialNetwork {

    public int[][] calculateInfluenceMatrix(int[][] connections) {
        // Use Floyd-Warshall to find shortest paths between all users
        // Influence decreases with distance in the social graph
        FloydWarshall.Result result = FloydWarshall.floydWarshall(connections);

        int n = connections.length;
        int[][] influence = new int[n][n];

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (result.distances[i][j] != INF) {
                    // Influence inversely proportional to distance
                    influence[i][j] = 100 / (result.distances[i][j] + 1);
                }
            }
        }

        return influence;
    }
}
```

### Game Theory - Nash Equilibrium

```java showLineNumbers
class GameTheory {

    public boolean[][] findDominantStrategies(int[][] payoffMatrix) {
        int n = payoffMatrix.length;
        boolean[][] dominance = new boolean[n][n];

        // Use Floyd-Warshall concept to find transitive dominance relationships
        // Strategy i dominates strategy j if payoff[i][k] >= payoff[j][k] for all k

        for (int k = 0; k < n; k++) {
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < n; j++) {
                    if (dominance[i][k] && dominance[k][j]) {
                        dominance[i][j] = true;
                    }
                }
            }
        }

        return dominance;
    }
}
```

## Comparison with Other Algorithms

| Algorithm              | Time             | Space | Use Case                | Negative Weights | Best For                            |
| ---------------------- | ---------------- | ----- | ----------------------- | ---------------- | ----------------------------------- |
| Floyd-Warshall         | O(V³)            | O(V²) | All-pairs shortest path | ✅ Yes           | Dense graphs, multiple queries      |
| Dijkstra (V times)     | O(V(V+E) log V)  | O(V²) | All-pairs, non-negative | ❌ No            | Sparse graphs                       |
| Johnson's Algorithm    | O(V² log V + VE) | O(V²) | All-pairs, any weights  | ✅ Yes           | Sparse graphs with negative weights |
| Bellman-Ford (V times) | O(V²E)           | O(V²) | All-pairs, any weights  | ✅ Yes           | Rare, very specific cases           |

## Common Optimizations

### Early Termination

```java showLineNumbers
public static boolean hasConverged(int[][] prev, int[][] curr) {
    int n = prev.length;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (prev[i][j] != curr[i][j]) {
                return false;
            }
        }
    }
    return true;
}
```

### Blocked Floyd-Warshall

```java showLineNumbers
public class BlockedFloydWarshall {

    public static int[][] blockedFloydWarshall(int[][] graph, int blockSize) {
        int n = graph.length;
        int[][] dist = new int[n][n];

        // Initialize
        for (int i = 0; i < n; i++) {
            System.arraycopy(graph[i], 0, dist[i], 0, n);
        }

        // Process in blocks for better cache performance
        for (int k = 0; k < n; k += blockSize) {
            int kEnd = Math.min(k + blockSize, n);

            for (int i = 0; i < n; i += blockSize) {
                int iEnd = Math.min(i + blockSize, n);

                for (int j = 0; j < n; j += blockSize) {
                    int jEnd = Math.min(j + blockSize, n);

                    // Process block
                    for (int kk = k; kk < kEnd; kk++) {
                        for (int ii = i; ii < iEnd; ii++) {
                            for (int jj = j; jj < jEnd; jj++) {
                                if (dist[ii][kk] != INF && dist[kk][jj] != INF &&
                                    dist[ii][kk] + dist[kk][jj] < dist[ii][jj]) {
                                    dist[ii][jj] = dist[ii][kk] + dist[kk][jj];
                                }
                            }
                        }
                    }
                }
            }
        }

        return dist;
    }
}
```

## Interview Tips

### When to Use Floyd-Warshall

1. **Need all-pairs shortest paths**
2. **Dense graph** (E close to V²)
3. **Multiple shortest path queries**
4. **Graph fits in memory**
5. **Negative weights but no negative cycles**

### Key Points to Remember

- **O(V³) time complexity** - cubic in vertices
- **O(V²) space** for distance matrix
- **Can handle negative weights** but not negative cycles
- **Simple implementation** with three nested loops

### Implementation Details

- **Intermediate vertex approach**: Key insight of the algorithm
- **Path reconstruction**: Use next[][] matrix
- **Negative cycle detection**: Check diagonal elements
- **Overflow prevention**: Use INF = Integer.MAX_VALUE / 2

### Common Interview Questions

1. **"When would you use Floyd-Warshall over Dijkstra?"**

   - When you need all-pairs shortest paths and graph is dense

2. **"How do you detect negative cycles?"**

   - After algorithm completes, check if any dist[i][i] < 0

3. **"Can you optimize Floyd-Warshall?"**

   - Parallel processing, blocking for cache efficiency, early termination

4. **"What if the graph doesn't fit in memory?"**
   - Use external memory algorithms or distributed approaches

## Practice Problems

### Essential LeetCode Problems

1. **Find the City With the Smallest Number of Neighbors at a Threshold Distance** (Medium)
2. **Shortest Path Visiting All Nodes** (Hard) - Can use Floyd-Warshall preprocessing
3. **Cheapest Flights Within K Stops** (Medium) - Compare with modified Dijkstra

### Advanced Applications

- **Network reliability analysis**
- **Protein folding pathways**
- **Economic market analysis**
- **Traffic flow optimization**

### Real-world Systems

- **GPS routing systems** for preprocessing
- **Social network analysis**
- **Game AI pathfinding**
- **Computer network routing tables**
