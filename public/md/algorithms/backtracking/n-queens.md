# N-Queens Problem

The **N-Queens Problem** is a classic backtracking algorithm that places N chess queens on an N×N chessboard so that no two queens can attack each other.

## Problem Statement

Place N queens on an N×N chessboard such that:

- No two queens are in the same **row**
- No two queens are in the same **column**
- No two queens are on the same **diagonal**

**Input**: Board size N
**Output**: All possible solutions or count of solutions

## Key Concepts

- **Backtracking**: Try placing queens and backtrack when conflicts arise
- **Constraint Satisfaction**: Each placement must satisfy all constraints
- **Pruning**: Early termination when constraints are violated

## Time and Space Complexity

| Approach                | Time Complexity            | Space Complexity |
| ----------------------- | -------------------------- | ---------------- |
| Basic Backtracking      | O(N!)                      | O(N²)            |
| Optimized (Bitmasking)  | O(N!)                      | O(N)             |
| **Typical Performance** | **Much better than O(N!)** | **O(N)**         |

**Note**: While worst-case is O(N!), pruning makes practical performance much better.

## Algorithm Steps

1. **Start** with the first row
2. **For each column** in the current row:
   - Check if placing queen is **safe**
   - If safe, **place queen** and recurse to next row
   - If solution found, **record it**
   - **Backtrack** by removing queen
3. **Safety check**: No conflicts in column, diagonal, or anti-diagonal
4. **Base case**: All queens placed successfully

## Java Implementation

### Basic N-Queens Implementation

```java showLineNumbers
import java.util.*;

public class NQueens {

    public static List<List<String>> solveNQueens(int n) {
        List<List<String>> solutions = new ArrayList<>();
        char[][] board = new char[n][n];

        // Initialize board with dots
        for (int i = 0; i < n; i++) {
            Arrays.fill(board[i], '.');
        }

        backtrack(board, 0, solutions);
        return solutions;
    }

    private static void backtrack(char[][] board, int row, List<List<String>> solutions) {
        int n = board.length;

        // Base case: all queens placed
        if (row == n) {
            solutions.add(constructSolution(board));
            return;
        }

        // Try placing queen in each column of current row
        for (int col = 0; col < n; col++) {
            if (isSafe(board, row, col)) {
                // Place queen
                board[row][col] = 'Q';

                // Recurse to next row
                backtrack(board, row + 1, solutions);

                // Backtrack
                board[row][col] = '.';
            }
        }
    }

    private static boolean isSafe(char[][] board, int row, int col) {
        int n = board.length;

        // Check column
        for (int i = 0; i < row; i++) {
            if (board[i][col] == 'Q') {
                return false;
            }
        }

        // Check diagonal (top-left to bottom-right)
        for (int i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
            if (board[i][j] == 'Q') {
                return false;
            }
        }

        // Check anti-diagonal (top-right to bottom-left)
        for (int i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
            if (board[i][j] == 'Q') {
                return false;
            }
        }

        return true;
    }

    private static List<String> constructSolution(char[][] board) {
        List<String> solution = new ArrayList<>();
        for (char[] row : board) {
            solution.add(new String(row));
        }
        return solution;
    }

    public static void demonstrateNQueens() {
        int n = 4;
        List<List<String>> solutions = solveNQueens(n);

        System.out.printf("N-Queens solutions for %dx%d board:\n\n", n, n);

        for (int i = 0; i < solutions.size(); i++) {
            System.out.printf("Solution %d:\n", i + 1);
            for (String row : solutions.get(i)) {
                System.out.println(row);
            }
            System.out.println();
        }

        System.out.printf("Total solutions: %d\n", solutions.size());
    }
}
```

### Optimized Implementation with Bitmasking

```java showLineNumbers
public class NQueensOptimized {
    private int count = 0;

    public int totalNQueens(int n) {
        count = 0;
        backtrack(0, 0, 0, 0, n);
        return count;
    }

    private void backtrack(int row, int cols, int diagonals, int antiDiagonals, int n) {
        // Base case: all queens placed
        if (row == n) {
            count++;
            return;
        }

        // Available positions in current row
        int availablePositions = ((1 << n) - 1) & ~(cols | diagonals | antiDiagonals);

        while (availablePositions != 0) {
            // Get rightmost available position
            int position = availablePositions & -availablePositions;
            availablePositions ^= position;

            backtrack(
                row + 1,
                cols | position,                    // Mark column as occupied
                (diagonals | position) << 1,       // Mark diagonal as occupied
                (antiDiagonals | position) >> 1,   // Mark anti-diagonal as occupied
                n
            );
        }
    }

    public List<List<String>> solveNQueensOptimized(int n) {
        List<List<String>> solutions = new ArrayList<>();
        int[] queens = new int[n]; // queens[i] = column of queen in row i

        backtrackWithPositions(0, 0, 0, 0, n, queens, solutions);
        return solutions;
    }

    private void backtrackWithPositions(int row, int cols, int diagonals,
                                       int antiDiagonals, int n, int[] queens,
                                       List<List<String>> solutions) {
        if (row == n) {
            solutions.add(constructBoard(queens, n));
            return;
        }

        int availablePositions = ((1 << n) - 1) & ~(cols | diagonals | antiDiagonals);

        while (availablePositions != 0) {
            int position = availablePositions & -availablePositions;
            availablePositions ^= position;

            int col = Integer.numberOfTrailingZeros(position);
            queens[row] = col;

            backtrackWithPositions(
                row + 1,
                cols | position,
                (diagonals | position) << 1,
                (antiDiagonals | position) >> 1,
                n, queens, solutions
            );
        }
    }

    private List<String> constructBoard(int[] queens, int n) {
        List<String> board = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            char[] row = new char[n];
            Arrays.fill(row, '.');
            row[queens[i]] = 'Q';
            board.add(new String(row));
        }
        return board;
    }
}
```

### Space-Optimized Implementation

```java showLineNumbers
public class NQueensSpaceOptimized {

    public int totalNQueens(int n) {
        boolean[] cols = new boolean[n];
        boolean[] diagonals = new boolean[2 * n - 1];
        boolean[] antiDiagonals = new boolean[2 * n - 1];

        return backtrack(0, n, cols, diagonals, antiDiagonals);
    }

    private int backtrack(int row, int n, boolean[] cols,
                         boolean[] diagonals, boolean[] antiDiagonals) {
        if (row == n) {
            return 1;
        }

        int count = 0;
        for (int col = 0; col < n; col++) {
            int diagonalId = row - col + n - 1;
            int antiDiagonalId = row + col;

            if (cols[col] || diagonals[diagonalId] || antiDiagonals[antiDiagonalId]) {
                continue;
            }

            // Place queen
            cols[col] = diagonals[diagonalId] = antiDiagonals[antiDiagonalId] = true;

            count += backtrack(row + 1, n, cols, diagonals, antiDiagonals);

            // Backtrack
            cols[col] = diagonals[diagonalId] = antiDiagonals[antiDiagonalId] = false;
        }

        return count;
    }
}
```

## Constraint Analysis

### Diagonal Constraints

- **Main diagonal**: `row - col = constant`
- **Anti-diagonal**: `row + col = constant`
- For N×N board:
  - Main diagonals: `2N - 1` total
  - Anti-diagonals: `2N - 1` total

### Bitmasking Optimization

- **Column constraints**: Single integer bitmask
- **Diagonal constraints**: Shift left for main diagonal
- **Anti-diagonal constraints**: Shift right for anti-diagonal

## Variations and Extensions

### 1. N-Queens Count Only

```java showLineNumbers
public class NQueensCount {

    public static int countSolutions(int n) {
        return backtrackCount(0, 0, 0, 0, n);
    }

    private static int backtrackCount(int row, int cols, int diag1, int diag2, int n) {
        if (row == n) return 1;

        int count = 0;
        int available = ((1 << n) - 1) & ~(cols | diag1 | diag2);

        while (available != 0) {
            int pos = available & -available;
            available ^= pos;

            count += backtrackCount(row + 1, cols | pos,
                                   (diag1 | pos) << 1, (diag2 | pos) >> 1, n);
        }

        return count;
    }
}
```

### 2. N-Queens with Obstacles

```java showLineNumbers
public class NQueensWithObstacles {

    public static List<List<String>> solveWithObstacles(int n, int[][] obstacles) {
        List<List<String>> solutions = new ArrayList<>();
        char[][] board = new char[n][n];

        // Initialize board
        for (int i = 0; i < n; i++) {
            Arrays.fill(board[i], '.');
        }

        // Place obstacles
        for (int[] obstacle : obstacles) {
            board[obstacle[0]][obstacle[1]] = 'X';
        }

        backtrackWithObstacles(board, 0, solutions);
        return solutions;
    }

    private static void backtrackWithObstacles(char[][] board, int row,
                                              List<List<String>> solutions) {
        int n = board.length;

        if (row == n) {
            List<String> solution = new ArrayList<>();
            for (char[] r : board) {
                solution.add(new String(r));
            }
            solutions.add(solution);
            return;
        }

        for (int col = 0; col < n; col++) {
            if (board[row][col] == 'X') continue; // Skip obstacles

            if (isSafeWithObstacles(board, row, col)) {
                board[row][col] = 'Q';
                backtrackWithObstacles(board, row + 1, solutions);
                board[row][col] = '.';
            }
        }
    }

    private static boolean isSafeWithObstacles(char[][] board, int row, int col) {
        int n = board.length;

        // Check column
        for (int i = 0; i < row; i++) {
            if (board[i][col] == 'Q') return false;
        }

        // Check diagonals
        for (int i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
            if (board[i][j] == 'Q') return false;
        }

        for (int i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
            if (board[i][j] == 'Q') return false;
        }

        return true;
    }
}
```

## Mathematical Properties

### Solution Counts for Small N

| N   | Solutions |
| --- | --------- |
| 1   | 1         |
| 2   | 0         |
| 3   | 0         |
| 4   | 2         |
| 5   | 10        |
| 6   | 4         |
| 7   | 40        |
| 8   | 92        |

### Symmetry Reduction

- **Rotational symmetry**: 4-fold rotation
- **Reflection symmetry**: Horizontal/vertical reflection
- Can reduce search space by factor of 8 for some cases

## Real-world Applications

### Constraint Satisfaction Problems

- **Scheduling** with conflict constraints
- **Resource allocation** with exclusivity
- **Graph coloring** problems

### Game Theory

- **Puzzle solving** algorithms
- **Strategic placement** problems
- **Conflict resolution** systems

### Optimization

- **Facility location** with interference
- **Network design** with collision avoidance
- **VLSI placement** problems

## Interview Tips

### Common Questions

1. **"How do you optimize the basic solution?"**

   - Use bitmasking instead of 2D array checks

2. **"What's the time complexity and why?"**

   - O(N!) worst case, but pruning makes it much better in practice

3. **"How do you check diagonal conflicts efficiently?"**
   - Use `row - col` and `row + col` formulas

### Implementation Notes

- **Focus on constraint checking**: Most important part
- **Use appropriate data structures**: Bitmasking for optimization
- **Handle base cases**: Empty board, impossible cases

### Quick Decision Framework

- **Count only** → Optimized backtracking with bitmasking
- **All solutions** → Standard backtracking
- **First solution** → Return early from backtracking
- **Large N** → Consider symmetry reduction

## Practice Problems

### Essential LeetCode Problems

1. **N-Queens** (Hard) - All solutions
2. **N-Queens II** (Hard) - Count solutions
3. **Sudoku Solver** (Hard) - Similar backtracking pattern
4. **Permutations** (Medium) - Backtracking foundation

### Advanced Extensions

- **Generalized N-Queens** with different piece types
- **3D N-Queens** problem
- **N-Queens with additional constraints**
- **Parallel N-Queens** solving

### Real-world Applications

- **Constraint satisfaction** in scheduling
- **Resource allocation** systems
- **Game AI** and puzzle solvers
- **Layout optimization** problems

## Summary

The **N-Queens Problem** is a fundamental example of backtracking algorithms. The key insights are efficient constraint checking using mathematical formulas for diagonals and optimization through bitmasking. Understanding this problem provides a strong foundation for solving other constraint satisfaction and combinatorial search problems.
