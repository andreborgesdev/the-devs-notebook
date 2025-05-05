# Depth-First Search (DFS)

**Depth-First Search (DFS)** is an **edge-based graph traversal algorithm**.  
It explores as far as possible along each branch before backtracking.

DFS can be implemented:

- **Recursively** (most common and intuitive).
- **Iteratively** using a **Stack** (explicit stack for manual control).

## Key Concepts

- **Explore deeply** into a path before exploring siblings.
- Can be used for both **trees** and **graphs**.
- Uses **Stack** behavior:
  - Recursive → Call stack manages nodes.
  - Iterative → Use an explicit Stack.

## Time and Space Complexity

|       | Complexity |
| ----- | ---------- |
| Time  | O(V + E)   |
| Space | O(V)       |

V = number of vertices, E = number of edges.

## Example Input Graph

```
        A
       / \
      B   C
     /   / \
    D   E   F
```

**DFS Output:**  
`A, B, D, C, E, F`

## Recursive DFS (Java)

```java showLineNumbers
import java.util.*;

class Graph {
private Map<Character, List<Character>> adjList = new HashMap<>();

    public void addEdge(char u, char v) {
        adjList.computeIfAbsent(u, k -> new ArrayList<>()).add(v);
        adjList.computeIfAbsent(v, k -> new ArrayList<>()).add(u); // Undirected graph
    }

    public void dfs(char start) {
        Set<Character> visited = new HashSet<>();
        dfsHelper(start, visited);
    }

    private void dfsHelper(char node, Set<Character> visited) {
        if (visited.contains(node)) return;

        visited.add(node);
        System.out.print(node + " ");

        for (char neighbor : adjList.getOrDefault(node, new ArrayList<>())) {
            dfsHelper(neighbor, visited);
        }
    }

    public static void main(String[] args) {
        Graph g = new Graph();
        g.addEdge('A', 'B');
        g.addEdge('A', 'C');
        g.addEdge('B', 'D');
        g.addEdge('C', 'E');
        g.addEdge('C', 'F');

        System.out.println("DFS Traversal starting from A:");
        g.dfs('A'); // Output: A B D C E F
    }

}
```

## Iterative DFS (Using Stack)

```java showLineNumbers
public void dfsIterative(char start) {
Set<Character> visited = new HashSet<>();
Stack<Character> stack = new Stack<>();

    stack.push(start);

    while (!stack.isEmpty()) {
        char node = stack.pop();
        if (!visited.contains(node)) {
            visited.add(node);
            System.out.print(node + " ");

            // Important: Reverse the neighbor order if you want the same output as recursive DFS
            for (char neighbor : adjList.getOrDefault(node, new ArrayList<>())) {
                stack.push(neighbor);
            }
        }
    }

}
```

## General DFS Steps

1. **Base Case:**  
   Check if the node should not be visited (out of bounds, already visited, or invalid value).
2. **Mark as Visited:**  
   Either use a `visited` data structure (like a Set) or mark the node directly (e.g., set value to -1 if valid).
3. **Recursive Calls / Stack Pushes:**  
   For each neighbor or adjacent node, recursively apply DFS.

## Example (Matrix DFS / Flood Fill)

```java showLineNumbers
void dfs(int[][] image, int sr, int sc, int newColor, int baseColor, boolean[][] visited) {
if (sr < 0 || sr >= image.length || sc < 0 || sc >= image[0].length
|| image[sr][sc] != baseColor || visited[sr][sc]) {
return;
}

    visited[sr][sc] = true;
    image[sr][sc] = newColor;

    dfs(image, sr + 1, sc, newColor, baseColor, visited);
    dfs(image, sr - 1, sc, newColor, baseColor, visited);
    dfs(image, sr, sc + 1, newColor, baseColor, visited);
    dfs(image, sr, sc - 1, newColor, baseColor, visited);

}
```

## DFS vs BFS

|                | DFS                                                     | BFS                                   |
| -------------- | ------------------------------------------------------- | ------------------------------------- |
| Data Structure | Stack / Recursion                                       | Queue                                 |
| Space          | O(V)                                                    | O(V)                                  |
| Use Case       | Topological sort, Cycle detection, Connected components | Shortest paths, Level-order traversal |

## Applications

- **Cycle detection** in graphs
- **Topological sorting**
- **Connected components**
- **Solving puzzles** (like mazes or Sudoku)
- **Tree traversals** (Preorder, Inorder, Postorder)
- **Pathfinding algorithms**

## Interview Tips

- Understand **when to use DFS**:  
  When you want to explore all possibilities/depths first, especially in problems like connected components, backtracking, or searching for paths/cycles.

- Know both **recursive** and **iterative** implementations.
- For **grid problems**, always remember the 4 (or 8) directions for adjacency.
- Space complexity of recursive DFS depends on the **maximum depth** of recursion.
