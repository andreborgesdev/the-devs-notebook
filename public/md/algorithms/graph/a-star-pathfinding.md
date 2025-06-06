# A\* Pathfinding Algorithm

The **A\* (A-star) Algorithm** is a graph traversal and pathfinding algorithm that finds the optimal path between nodes by using heuristics to guide the search towards the goal more efficiently than Dijkstra's algorithm.

## Problem Statement

Find the shortest path from a start node to a goal node in a weighted graph, using a heuristic function to guide the search and reduce the number of nodes explored.

**Input**: Graph, start node, goal node, heuristic function
**Output**: Shortest path from start to goal

## Key Concepts

- **Heuristic Function**: Estimates distance from current node to goal (must be admissible)
- **f(n) = g(n) + h(n)**: Total estimated cost (actual cost + heuristic)
- **Admissible Heuristic**: Never overestimates the true cost to reach the goal
- **Consistent Heuristic**: h(n) ≤ c(n,n') + h(n') for all neighbors n'

## Time and Space Complexity

| Implementation   | Time Complexity | Space Complexity |
| ---------------- | --------------- | ---------------- |
| Priority Queue   | O(b^d)          | O(b^d)           |
| **Optimal Case** | **O(b^d)**      | **O(b^d)**       |

**b** = branching factor, **d** = depth of optimal solution

**Note**: A\* is optimal when using an admissible heuristic

## Algorithm Steps

1. **Initialize** open set with start node, closed set empty
2. **While** open set is not empty:
   - Select node with **lowest f(n)** from open set
   - If node is **goal**, reconstruct and return path
   - **Move node** from open to closed set
   - **For each neighbor**:
     - Skip if in closed set
     - Calculate tentative g(n)
     - If neighbor not in open set or better path found, update it
3. **Return** failure if no path exists

## Java Implementation

### Basic A\* Implementation

```java showLineNumbers
import java.util.*;

public class AStar {

    static class Node {
        int x, y;
        double gCost; // Distance from start
        double hCost; // Heuristic (estimated distance to goal)
        double fCost; // gCost + hCost
        Node parent;

        public Node(int x, int y) {
            this.x = x;
            this.y = y;
            this.gCost = Double.MAX_VALUE;
            this.hCost = 0;
            this.fCost = 0;
            this.parent = null;
        }

        public void calculateFCost() {
            this.fCost = this.gCost + this.hCost;
        }

        @Override
        public boolean equals(Object obj) {
            if (this == obj) return true;
            if (obj == null || getClass() != obj.getClass()) return false;
            Node node = (Node) obj;
            return x == node.x && y == node.y;
        }

        @Override
        public int hashCode() {
            return Objects.hash(x, y);
        }

        @Override
        public String toString() {
            return String.format("(%d,%d)", x, y);
        }
    }

    private static final int[][] DIRECTIONS = {
        {-1, 0}, {1, 0}, {0, -1}, {0, 1}, // Cardinal directions
        {-1, -1}, {-1, 1}, {1, -1}, {1, 1} // Diagonal directions
    };

    public static List<Node> findPath(int[][] grid, Node start, Node goal) {
        if (grid == null || start == null || goal == null) {
            return new ArrayList<>();
        }

        int rows = grid.length;
        int cols = grid[0].length;

        if (!isValid(start, rows, cols) || !isValid(goal, rows, cols) ||
            grid[start.x][start.y] == 1 || grid[goal.x][goal.y] == 1) {
            return new ArrayList<>();
        }

        PriorityQueue<Node> openSet = new PriorityQueue<>((a, b) ->
            Double.compare(a.fCost, b.fCost));
        Set<Node> closedSet = new HashSet<>();
        Map<String, Node> allNodes = new HashMap<>();

        start.gCost = 0;
        start.hCost = heuristic(start, goal);
        start.calculateFCost();

        openSet.add(start);
        allNodes.put(getKey(start), start);

        while (!openSet.isEmpty()) {
            Node current = openSet.poll();

            if (current.equals(goal)) {
                return reconstructPath(current);
            }

            closedSet.add(current);

            for (Node neighbor : getNeighbors(current, grid, rows, cols)) {
                if (closedSet.contains(neighbor)) {
                    continue;
                }

                String neighborKey = getKey(neighbor);
                Node existingNeighbor = allNodes.get(neighborKey);

                if (existingNeighbor == null) {
                    existingNeighbor = new Node(neighbor.x, neighbor.y);
                    allNodes.put(neighborKey, existingNeighbor);
                }

                double tentativeGCost = current.gCost + getDistance(current, existingNeighbor);

                if (tentativeGCost < existingNeighbor.gCost) {
                    existingNeighbor.parent = current;
                    existingNeighbor.gCost = tentativeGCost;
                    existingNeighbor.hCost = heuristic(existingNeighbor, goal);
                    existingNeighbor.calculateFCost();

                    if (!openSet.contains(existingNeighbor)) {
                        openSet.add(existingNeighbor);
                    }
                }
            }
        }

        return new ArrayList<>(); // No path found
    }

    private static List<Node> getNeighbors(Node node, int[][] grid, int rows, int cols) {
        List<Node> neighbors = new ArrayList<>();

        for (int[] direction : DIRECTIONS) {
            int newX = node.x + direction[0];
            int newY = node.y + direction[1];

            Node neighbor = new Node(newX, newY);

            if (isValid(neighbor, rows, cols) && grid[newX][newY] == 0) {
                neighbors.add(neighbor);
            }
        }

        return neighbors;
    }

    private static boolean isValid(Node node, int rows, int cols) {
        return node.x >= 0 && node.x < rows && node.y >= 0 && node.y < cols;
    }

    private static double heuristic(Node a, Node b) {
        // Manhattan distance for grid-based pathfinding
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

        // Euclidean distance (admissible for any metric)
        // return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

        // Diagonal distance (Chebyshev distance)
        // return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
    }

    private static double getDistance(Node a, Node b) {
        // Actual movement cost between adjacent nodes
        if (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) == 1) {
            return 1.0; // Cardinal movement
        } else {
            return Math.sqrt(2); // Diagonal movement
        }
    }

    private static List<Node> reconstructPath(Node goalNode) {
        List<Node> path = new ArrayList<>();
        Node current = goalNode;

        while (current != null) {
            path.add(current);
            current = current.parent;
        }

        Collections.reverse(path);
        return path;
    }

    private static String getKey(Node node) {
        return node.x + "," + node.y;
    }

    public static void demonstrateAStar() {
        int[][] grid = {
            {0, 0, 0, 0, 1, 0, 0, 0, 0, 0},
            {0, 0, 0, 0, 1, 0, 0, 0, 0, 0},
            {0, 0, 0, 0, 1, 0, 0, 0, 0, 0},
            {0, 0, 0, 0, 1, 0, 0, 0, 0, 0},
            {0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
            {0, 0, 0, 0, 1, 0, 0, 0, 0, 0},
            {0, 0, 0, 0, 1, 0, 0, 0, 0, 0},
            {0, 0, 0, 0, 1, 0, 0, 0, 0, 0},
            {0, 0, 0, 0, 1, 0, 0, 0, 0, 0},
            {0, 0, 0, 0, 0, 0, 0, 0, 0, 0}
        };

        Node start = new Node(0, 0);
        Node goal = new Node(9, 9);

        System.out.println("Grid (0=free, 1=obstacle):");
        printGrid(grid);
        System.out.printf("Start: %s, Goal: %s\n", start, goal);

        List<Node> path = findPath(grid, start, goal);

        if (!path.isEmpty()) {
            System.out.printf("Path found with %d steps:\n", path.size());
            for (int i = 0; i < path.size(); i++) {
                System.out.printf("Step %d: %s\n", i, path.get(i));
            }

            System.out.println("\nGrid with path (*):");
            printGridWithPath(grid, path);
        } else {
            System.out.println("No path found!");
        }
    }

    private static void printGrid(int[][] grid) {
        for (int[] row : grid) {
            for (int cell : row) {
                System.out.print(cell + " ");
            }
            System.out.println();
        }
    }

    private static void printGridWithPath(int[][] grid, List<Node> path) {
        char[][] display = new char[grid.length][grid[0].length];

        for (int i = 0; i < grid.length; i++) {
            for (int j = 0; j < grid[0].length; j++) {
                display[i][j] = grid[i][j] == 1 ? '█' : '.';
            }
        }

        for (Node node : path) {
            display[node.x][node.y] = '*';
        }

        if (!path.isEmpty()) {
            display[path.get(0).x][path.get(0).y] = 'S';
            display[path.get(path.size() - 1).x][path.get(path.size() - 1).y] = 'G';
        }

        for (char[] row : display) {
            for (char cell : row) {
                System.out.print(cell + " ");
            }
            System.out.println();
        }
    }
}
```

### A\* with Different Heuristics

```java showLineNumbers
public class AStarHeuristics {

    public enum HeuristicType {
        MANHATTAN, EUCLIDEAN, DIAGONAL, ZERO
    }

    public static double calculateHeuristic(Node a, Node b, HeuristicType type) {
        switch (type) {
            case MANHATTAN:
                return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

            case EUCLIDEAN:
                return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

            case DIAGONAL:
                int dx = Math.abs(a.x - b.x);
                int dy = Math.abs(a.y - b.y);
                return Math.max(dx, dy) + (Math.sqrt(2) - 1) * Math.min(dx, dy);

            case ZERO:
                return 0; // Degrades to Dijkstra's algorithm

            default:
                return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
        }
    }

    public static void compareHeuristics() {
        int[][] grid = createMaze();
        Node start = new Node(0, 0);
        Node goal = new Node(19, 19);

        for (HeuristicType type : HeuristicType.values()) {
            long startTime = System.nanoTime();
            List<AStar.Node> path = findPathWithHeuristic(grid, start, goal, type);
            long endTime = System.nanoTime();

            double timeMs = (endTime - startTime) / 1_000_000.0;

            System.out.printf("%s Heuristic:\n", type);
            System.out.printf("  Path length: %d\n", path.size());
            System.out.printf("  Time: %.2f ms\n\n", timeMs);
        }
    }

    private static int[][] createMaze() {
        // Create a simple maze for testing
        int[][] maze = new int[20][20];

        // Add some obstacles
        for (int i = 5; i < 15; i++) {
            maze[i][10] = 1;
        }
        for (int j = 5; j < 15; j++) {
            maze[5][j] = 1;
        }

        return maze;
    }

    private static List<AStar.Node> findPathWithHeuristic(int[][] grid, Node start,
                                                         Node goal, HeuristicType heuristic) {
        // Modified A* implementation that accepts heuristic type
        // Implementation similar to basic A* but uses specified heuristic
        return AStar.findPath(grid, start, goal);
    }
}
```

### Optimized A\* with Jump Point Search

```java showLineNumbers
public class JumpPointSearch {

    public static List<AStar.Node> findPathJPS(int[][] grid, AStar.Node start, AStar.Node goal) {
        PriorityQueue<AStar.Node> openSet = new PriorityQueue<>((a, b) ->
            Double.compare(a.fCost, b.fCost));
        Set<AStar.Node> closedSet = new HashSet<>();

        start.gCost = 0;
        start.hCost = heuristic(start, goal);
        start.calculateFCost();
        openSet.add(start);

        while (!openSet.isEmpty()) {
            AStar.Node current = openSet.poll();

            if (current.equals(goal)) {
                return reconstructPath(current);
            }

            closedSet.add(current);

            List<AStar.Node> successors = identifySuccessors(current, goal, grid);

            for (AStar.Node successor : successors) {
                if (closedSet.contains(successor)) {
                    continue;
                }

                double tentativeG = current.gCost + getDistance(current, successor);

                if (!openSet.contains(successor) || tentativeG < successor.gCost) {
                    successor.parent = current;
                    successor.gCost = tentativeG;
                    successor.hCost = heuristic(successor, goal);
                    successor.calculateFCost();

                    if (!openSet.contains(successor)) {
                        openSet.add(successor);
                    }
                }
            }
        }

        return new ArrayList<>();
    }

    private static List<AStar.Node> identifySuccessors(AStar.Node current, AStar.Node goal,
                                                      int[][] grid) {
        List<AStar.Node> successors = new ArrayList<>();
        List<int[]> directions = getPrunedDirections(current);

        for (int[] direction : directions) {
            AStar.Node jumpPoint = jump(current, direction, goal, grid);
            if (jumpPoint != null) {
                successors.add(jumpPoint);
            }
        }

        return successors;
    }

    private static AStar.Node jump(AStar.Node current, int[] direction, AStar.Node goal,
                                  int[][] grid) {
        int dx = direction[0];
        int dy = direction[1];

        AStar.Node next = new AStar.Node(current.x + dx, current.y + dy);

        if (!isWalkable(next, grid)) {
            return null;
        }

        if (next.equals(goal)) {
            return next;
        }

        // Check for forced neighbors
        if (hasForced Neighbors(next, direction, grid)) {
            return next;
        }

        // For diagonal movement, check horizontal and vertical directions
        if (dx != 0 && dy != 0) {
            if (jump(next, new int[]{dx, 0}, goal, grid) != null ||
                jump(next, new int[]{0, dy}, goal, grid) != null) {
                return next;
            }
        }

        return jump(next, direction, goal, grid);
    }

    private static boolean hasForced Neighbors(AStar.Node node, int[] direction, int[][] grid) {
        int x = node.x;
        int y = node.y;
        int dx = direction[0];
        int dy = direction[1];

        if (dx != 0 && dy != 0) {
            // Diagonal movement
            return (!isWalkable(new AStar.Node(x - dx, y), grid) &&
                    isWalkable(new AStar.Node(x - dx, y + dy), grid)) ||
                   (!isWalkable(new AStar.Node(x, y - dy), grid) &&
                    isWalkable(new AStar.Node(x + dx, y - dy), grid));
        } else if (dx != 0) {
            // Horizontal movement
            return (!isWalkable(new AStar.Node(x, y + 1), grid) &&
                    isWalkable(new AStar.Node(x + dx, y + 1), grid)) ||
                   (!isWalkable(new AStar.Node(x, y - 1), grid) &&
                    isWalkable(new AStar.Node(x + dx, y - 1), grid));
        } else {
            // Vertical movement
            return (!isWalkable(new AStar.Node(x + 1, y), grid) &&
                    isWalkable(new AStar.Node(x + 1, y + dy), grid)) ||
                   (!isWalkable(new AStar.Node(x - 1, y), grid) &&
                    isWalkable(new AStar.Node(x - 1, y + dy), grid));
        }
    }

    private static List<int[]> getPrunedDirections(AStar.Node current) {
        List<int[]> directions = new ArrayList<>();

        if (current.parent == null) {
            // First move, consider all directions
            directions.addAll(Arrays.asList(
                new int[]{-1, 0}, new int[]{1, 0}, new int[]{0, -1}, new int[]{0, 1},
                new int[]{-1, -1}, new int[]{-1, 1}, new int[]{1, -1}, new int[]{1, 1}
            ));
        } else {
            // Prune directions based on parent
            int dx = current.x - current.parent.x;
            int dy = current.y - current.parent.y;

            // Normalize direction
            dx = Integer.compare(dx, 0);
            dy = Integer.compare(dy, 0);

            directions.add(new int[]{dx, dy});

            // Add natural neighbors for diagonal movement
            if (dx != 0 && dy != 0) {
                directions.add(new int[]{dx, 0});
                directions.add(new int[]{0, dy});
            }
        }

        return directions;
    }

    private static boolean isWalkable(AStar.Node node, int[][] grid) {
        return node.x >= 0 && node.x < grid.length &&
               node.y >= 0 && node.y < grid[0].length &&
               grid[node.x][node.y] == 0;
    }

    private static double heuristic(AStar.Node a, AStar.Node b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    private static double getDistance(AStar.Node a, AStar.Node b) {
        double dx = Math.abs(a.x - b.x);
        double dy = Math.abs(a.y - b.y);
        return dx + dy + (Math.sqrt(2) - 2) * Math.min(dx, dy);
    }

    private static List<AStar.Node> reconstructPath(AStar.Node goalNode) {
        List<AStar.Node> path = new ArrayList<>();
        AStar.Node current = goalNode;

        while (current != null) {
            path.add(current);
            current = current.parent;
        }

        Collections.reverse(path);
        return path;
    }
}
```

## Heuristic Functions

### Common Heuristics for Grid-Based Pathfinding

| Heuristic | Formula                                                      | Use Case                         | Admissible |
| --------- | ------------------------------------------------------------ | -------------------------------- | ---------- |
| Manhattan | \|x₁-x₂\| + \|y₁-y₂\|                                        | 4-directional movement           | ✅ Yes     |
| Euclidean | √((x₁-x₂)² + (y₁-y₂)²)                                       | Any movement                     | ✅ Yes     |
| Diagonal  | max(\|x₁-x₂\|, \|y₁-y₂\|)                                    | 8-directional movement           | ✅ Yes     |
| Octile    | max(\|x₁-x₂\|, \|y₁-y₂\|) + (√2-1)×min(\|x₁-x₂\|, \|y₁-y₂\|) | 8-directional with diagonal cost | ✅ Yes     |

## Optimizations and Variants

### 1. Bidirectional A\*

- Run A\* from both start and goal simultaneously
- Stop when searches meet
- Can reduce search space significantly

### 2. Hierarchical A\*

- Preprocess map into clusters
- Find path between clusters first
- Refine path within clusters

### 3. Jump Point Search (JPS)

- Optimization for uniform-cost grids
- Skips intermediate nodes in straight lines
- Dramatically reduces nodes explored

## Real-world Applications

### Game Development

- **NPC pathfinding** in games
- **Real-time strategy** unit movement
- **Procedural navigation** mesh generation

### Robotics

- **Robot navigation** and path planning
- **Autonomous vehicle** routing
- **Drone flight** path optimization

### Network Routing

- **Network packet** routing
- **Telecommunication** path finding
- **Social network** analysis

## Comparison with Other Algorithms

| Algorithm         | Time           | Space  | Optimality                | Use Case                    |
| ----------------- | -------------- | ------ | ------------------------- | --------------------------- |
| A\*               | O(b^d)         | O(b^d) | ✅ Optimal (admissible h) | Goal-directed search        |
| Dijkstra          | O((V+E) log V) | O(V)   | ✅ Optimal                | Single-source shortest path |
| Greedy Best-First | O(b^m)         | O(b^m) | ❌ Not optimal            | Fast approximate solutions  |
| BFS               | O(V+E)         | O(V)   | ✅ Optimal (unweighted)   | Unweighted shortest path    |

## Interview Tips

### Common Questions

1. **"When is A\* optimal?"**

   - When the heuristic is admissible (never overestimates true cost)

2. **"How do you choose a good heuristic?"**

   - Balance between being informative and being admissible

3. **"What happens if heuristic overestimates?"**
   - May not find optimal path, but can be faster

### Implementation Notes

- **Priority queue efficiency**: Use binary heap or Fibonacci heap
- **Duplicate handling**: Check if better path found to same node
- **Memory management**: Consider memory-bounded variants for large spaces

### Quick Decision Framework

- **Known goal + good heuristic** → A\*
- **Unknown goal or no heuristic** → Dijkstra
- **Unweighted graph** → BFS
- **Multiple goals** → Dijkstra from goals backward

## Practice Problems

### Essential Problems

1. **Word Ladder** - Shortest transformation sequence
2. **Sliding Puzzle** - Minimum moves to solve
3. **Knight's Tour** - Chess knight movement
4. **Robot Path Planning** - Grid-based navigation

### Advanced Applications

- **Game AI** pathfinding
- **Route planning** with traffic
- **Resource allocation** optimization
- **Network routing** protocols

### Real-world Systems

- **GPS navigation** systems
- **Game engine** pathfinding
- **Robot operating** systems
- **AI planning** frameworks

## Summary

**A\* Algorithm** combines the optimality of Dijkstra's algorithm with the efficiency of greedy search by using admissible heuristics to guide the search. The key insight is balancing exploration and exploitation - the heuristic guides search toward promising areas while maintaining optimality guarantees. Understanding A\* is crucial for pathfinding, game AI, and many optimization problems.
