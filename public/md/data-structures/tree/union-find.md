# Union Find (Disjoint Set Union)

The **Union Find** data structure (also called **Disjoint Set Union - DSU**) efficiently tracks a set of elements partitioned into disjoint (non-overlapping) sets.

It supports two primary operations:

| Operation       | Description                                                                                 |
| --------------- | ------------------------------------------------------------------------------------------- |
| **Find(x)**     | Determines which set the element `x` belongs to (returns the set representative or "root"). |
| **Union(x, y)** | Merges the sets containing `x` and `y`.                                                     |

## Time Complexity (With Path Compression and Union by Rank)

| Operation          | Time Complexity |
| ------------------ | --------------- |
| Construction       | O(n)            |
| Union              | O(α(n))         |
| Find               | O(α(n))         |
| Get component size | O(α(n))         |
| Check if connected | O(α(n))         |
| Count components   | O(1)            |

**α(n)** = Inverse Ackermann function → practically constant time for all reasonable input sizes.

## Real World Use Cases

- **Kruskal’s algorithm** for Minimum Spanning Tree (MST).
- **Cycle detection** in undirected graphs.
- **Dynamic connectivity** queries.
- **Network connectivity**.
- **Image processing** (detecting connected components).
- **Percolation models** in physics simulations.

## How It Works

- Initially, each element forms a singleton set where the element is its own parent (self loop).
- Sets are merged by updating the parent pointers.
- **Find** follows parent pointers until reaching the root.
- **Union** connects the roots of two sets.

## Path Compression

- Applied during **Find**.
- After finding the root of a node, all nodes along the path are pointed directly to the root.
- Greatly reduces the height of the trees representing sets → leads to nearly constant time operations.

## Union by Size / Rank

- When merging two sets, the smaller set’s root points to the larger set’s root.
- Keeps the tree shallow → improves performance.

## Java Example: Union Find with Path Compression

``\`\`\`java
class UnionFind {
private int[] parent;
private int[] size;
private int components;

    public UnionFind(int n) {
        parent = new int[n];
        size = new int[n];
        components = n;
        for (int i = 0; i < n; i++) {
            parent[i] = i; // Each element is its own root initially
            size[i] = 1;
        }
    }

    // Find with path compression
    public int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]); // Path compression
        }
        return parent[x];
    }

    // Union by size
    public void union(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);

        if (rootX == rootY) return; // Already connected

        // Merge smaller tree into larger tree
        if (size[rootX] < size[rootY]) {
            parent[rootX] = rootY;
            size[rootY] += size[rootX];
        } else {
            parent[rootY] = rootX;
            size[rootX] += size[rootY];
        }
        components--;
    }

    public boolean connected(int x, int y) {
        return find(x) == find(y);
    }

    public int countComponents() {
        return components;
    }

}
``\`\`\`

## Example Usage

``\`\`\`java
public class Main {
public static void main(String[] args) {
UnionFind uf = new UnionFind(5);

        uf.union(0, 1);
        uf.union(1, 2);

        System.out.println(uf.connected(0, 2)); // true
        System.out.println(uf.connected(3, 4)); // false

        System.out.println("Number of components: " + uf.countComponents()); // 3
    }

}
``\`\`\`

## Union Find in Kruskal's Algorithm (for MST)

**Process**:

1. Sort edges by ascending weight.
2. For each edge:
   - If the two nodes belong to the same set → skip (would create a cycle).
   - Otherwise → add the edge to the MST and **union** their sets.
3. Stop when all nodes are connected or all edges have been processed.

## Interview Tips

- Understand **path compression** and **union by size/rank** — be ready to implement both.
- Be ready to use Union Find in:
  - Kruskal’s algorithm.
  - Cycle detection.
  - Dynamic connectivity problems.
- Know why **un-union** is generally not supported (would require expensive tree restructuring).
- Remember that the **number of components** equals the number of remaining roots.

## Summary

**Union Find** (DSU) is a powerful structure for tracking disjoint sets with nearly constant-time union and find operations, especially when optimized with **path compression** and **union by size/rank**. It is a key tool in graph algorithms and dynamic connectivity problems.
