# Kruskal’s Minimum Spanning Tree (MST)

**Kruskal’s Algorithm** is a **greedy algorithm** used to find the **Minimum Spanning Tree (MST)** of a connected, undirected, weighted graph.  
An MST connects all vertices in the graph with the **minimum possible total edge weight** and **no cycles**.

## Key Concepts

- Greedily picks the smallest edge that **does not form a cycle**.
- Uses the **Union-Find (Disjoint Set)** data structure to detect cycles efficiently.
- Works well for **sparse graphs**.

## Time and Space Complexity

| Operation             | Complexity                                                       |
| --------------------- | ---------------------------------------------------------------- |
| Sorting edges         | O(E log E)                                                       |
| Union-Find operations | Almost O(1) (amortized, with path compression and union by rank) |
| Overall               | O(E log E)                                                       |

E = Number of edges, V = Number of vertices

## Steps

1. **Sort all edges** in non-decreasing order of their weight.
2. Initialize the **Union-Find (Disjoint Set)** for all vertices.
3. For each edge in sorted order:
   - If adding the edge does **not** create a cycle (nodes are in different sets), add it to the MST and **union** their sets.
   - If adding the edge creates a cycle, skip it.
4. Repeat until MST has **V - 1** edges.

## Visualization

Example graph edges sorted by weight:

```
(0, 1) - 4
(1, 2) - 8
(0, 2) - 10
...
```

Edges are added one by one if they don’t form cycles, until the MST is built.

## Java Example

```java showLineNumbers
import java.util.*;

class Edge implements Comparable<Edge> {
int src, dest, weight;

    public Edge(int src, int dest, int weight) {
        this.src = src;
        this.dest = dest;
        this.weight = weight;
    }

    public int compareTo(Edge compareEdge) {
        return this.weight - compareEdge.weight;
    }

}

class UnionFind {
int[] parent, rank;

    public UnionFind(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    int find(int x) {
        if (parent[x] != x)
            parent[x] = find(parent[x]); // Path compression
        return parent[x];
    }

    boolean union(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);
        if (rootX == rootY) return false; // Already connected

        // Union by rank
        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }
        return true;
    }

}

public class KruskalMST {

    public static List<Edge> kruskalMST(List<Edge> edges, int numVertices) {
        Collections.sort(edges); // Sort edges by weight
        UnionFind uf = new UnionFind(numVertices);
        List<Edge> mst = new ArrayList<>();

        for (Edge edge : edges) {
            if (uf.union(edge.src, edge.dest)) {
                mst.add(edge);
                if (mst.size() == numVertices - 1) break;
            }
        }

        return mst;
    }

    public static void main(String[] args) {
        int numVertices = 4;
        List<Edge> edges = Arrays.asList(
            new Edge(0, 1, 10),
            new Edge(0, 2, 6),
            new Edge(0, 3, 5),
            new Edge(1, 3, 15),
            new Edge(2, 3, 4)
        );

        List<Edge> mst = kruskalMST(edges, numVertices);
        System.out.println("Edges in MST:");
        for (Edge e : mst) {
            System.out.println(e.src + " - " + e.dest + " : " + e.weight);
        }
    }

}
```

## Why Use Kruskal’s Algorithm?

- **Efficient for sparse graphs** (few edges compared to vertices).
- Easy to implement.
- Avoids building an entire graph structure — operates mainly on edges.

## Comparison with Prim’s Algorithm

|                | Kruskal’s     | Prim’s                    |
| -------------- | ------------- | ------------------------- |
| Best for       | Sparse graphs | Dense graphs              |
| Approach       | Edge-based    | Vertex-based              |
| Data structure | Union-Find    | Priority Queue (Min-Heap) |
| Complexity     | O(E log E)    | O(E + V log V)            |

## Interview Tips

- Know how to:
  - Sort edges.
  - Implement Union-Find with path compression and union by rank.
- Be able to explain why **Union-Find avoids cycles** efficiently.
- Mention **Kruskal’s vs Prim’s** trade-offs when asked about MST algorithms.
- Common interview problem types:
  - **Design network/cabling** with minimal cost.
  - **Cluster analysis** (grouping connected components).

## Summary

**Kruskal’s Algorithm** builds the MST by greedily picking the smallest edges and connecting components using **Union-Find** to avoid cycles.  
It’s a classic and efficient choice for finding MSTs, especially in **sparse graphs**.
