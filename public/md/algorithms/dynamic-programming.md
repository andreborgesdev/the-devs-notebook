# Dynamic Programming (DP)

**Dynamic Programming (DP)** is an optimization technique used to solve problems by breaking them down into overlapping subproblems, solving each subproblem only once, and storing their solutions.

It is especially useful for problems with **overlapping subproblems** and **optimal substructure** properties.

## Key Concepts

- **Overlapping Subproblems** → The problem can be broken into smaller subproblems which repeat.
- **Optimal Substructure** → The global optimal solution can be constructed from the optimal solutions of its subproblems.

## Two Main Approaches

### Top-Down (Memoization)

- Start with the original problem.
- Recursively solve subproblems.
- Store the results to avoid recomputation.

```java showLineNumbers
Map<Integer, Integer> memo = new HashMap<>();

int fib(int n) {
if (n <= 1) return n;
if (!memo.containsKey(n)) {
memo.put(n, fib(n - 1) + fib(n - 2));
}
return memo.get(n);
}
```

### Bottom-Up (Tabulation)

- Solve all possible small subproblems first.
- Combine them to solve larger subproblems.

```java showLineNumbers
int fib(int n) {
    if (n <= 1) return n;
    int[] dp = new int[n + 1];
    dp[0] = 0;
    dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}
```

## Time and Space Complexity

| Approach    | Time | Space                       |
| ----------- | ---- | --------------------------- |
| Memoization | O(n) | O(n)                        |
| Tabulation  | O(n) | O(n) or O(1) (if optimized) |

## Recognizing DP Problems

Clues:

- The problem asks for the **maximum/minimum**, **counting** or **number of ways**.
- You can break it into **smaller, repeating subproblems**.
- Trying brute force results in a lot of **repeated work**.

## Common DP Problem Types

- **Fibonacci sequence**
- **Climbing stairs**
- **Coin change / minimum coins**
- **Knapsack problem**
- **Longest Common Subsequence / Substring**
- **Matrix pathfinding (min path sum)**
- **Palindrome partitioning**
- **Subset sum**

## Space Optimization

Some DP problems allow reducing space complexity:

- Keep only the last two results (e.g., Fibonacci → O(1) space).
- For 2D DP, sometimes previous rows/columns are enough.

## Tips for Interviews

- Identify subproblems and write out recurrence relations.
- Decide whether **top-down** or **bottom-up** is better for the given constraints.
- Watch out for **state variables** (many DP problems need more than just the index → e.g., remaining capacity, last choice, etc.).
- Think about **state compression** (bitmasking) for advanced problems.
- Start by writing a brute-force recursive solution before optimizing with DP.

## Advanced Concepts

- **Bitmask DP** → Compress multiple states into a single integer using bits.
- **Tree DP** → DP on tree structures.
- **DP with monotonic queues/stacks** → For optimization in certain sliding window DP problems.
- **Memory efficient DP** → Reducing dimensionality.

## Summary

Dynamic Programming is the go-to strategy for solving complex problems involving:

- **Optimal solutions built from smaller subproblems**
- **Reducing repeated work**
- **Efficient state management**

With practice, recognizing DP patterns becomes faster and you'll naturally identify **state variables** and **transition formulas**.
