# 0/1 Knapsack Problem

**0/1 Knapsack** is a classic dynamic programming problem where you have a knapsack with limited capacity and items with specific weights and values. The goal is to maximize the total value while staying within the weight capacity. Each item can be taken **at most once** (0 or 1).

This problem demonstrates the fundamental principles of dynamic programming and is frequently asked in technical interviews.

## Key Concepts

- **Binary Decision**: Each item can either be included (1) or excluded (0)
- **Optimal Substructure**: Solution to larger problem depends on solutions to smaller subproblems
- **Overlapping Subproblems**: Same subproblems are solved multiple times in naive recursion
- **State Definition**: dp[i][w] = maximum value using first i items with weight limit w

## Time and Space Complexity

| Approach          | Time Complexity | Space Complexity |
| ----------------- | --------------- | ---------------- |
| Recursive (Naive) | O(2^n)          | O(n)             |
| Memoization       | O(n × W)        | O(n × W)         |
| Tabulation        | O(n × W)        | O(n × W)         |
| Space Optimized   | O(n × W)        | O(W)             |

**n** = number of items, **W** = knapsack capacity

## Problem Formulation

**Input:**

- `n` items with weights `w[0], w[1], ..., w[n-1]`
- Values `v[0], v[1], ..., v[n-1]`
- Knapsack capacity `W`

**Output:**

- Maximum value that can be obtained with weight ≤ W

## Algorithm Approaches

### 1. Recursive Solution (Brute Force)

```java showLineNumbers
public class KnapsackRecursive {

    public static int knapsack(int[] weights, int[] values, int capacity, int n) {
        // Base case: no items or no capacity
        if (n == 0 || capacity == 0) {
            return 0;
        }

        // If weight of nth item is more than capacity, cannot include it
        if (weights[n-1] > capacity) {
            return knapsack(weights, values, capacity, n-1);
        }

        // Return maximum of including or excluding the nth item
        int include = values[n-1] + knapsack(weights, values, capacity - weights[n-1], n-1);
        int exclude = knapsack(weights, values, capacity, n-1);

        return Math.max(include, exclude);
    }

    public static void demonstrateRecursive() {
        int[] weights = {1, 3, 4, 5};
        int[] values = {1, 4, 5, 7};
        int capacity = 7;
        int n = weights.length;

        System.out.println("Items:");
        for (int i = 0; i < n; i++) {
            System.out.printf("Item %d: Weight=%d, Value=%d\n", i+1, weights[i], values[i]);
        }
        System.out.printf("Knapsack Capacity: %d\n", capacity);

        int maxValue = knapsack(weights, values, capacity, n);
        System.out.printf("Maximum value (Recursive): %d\n", maxValue);
    }
}
```

### 2. Memoization (Top-Down DP)

```java showLineNumbers
public class KnapsackMemoization {
    private static int[][] memo;

    public static int knapsack(int[] weights, int[] values, int capacity, int n) {
        memo = new int[n + 1][capacity + 1];
        for (int i = 0; i <= n; i++) {
            Arrays.fill(memo[i], -1);
        }

        return knapsackHelper(weights, values, capacity, n);
    }

    private static int knapsackHelper(int[] weights, int[] values, int capacity, int n) {
        // Base case
        if (n == 0 || capacity == 0) {
            return 0;
        }

        // Return memoized result
        if (memo[n][capacity] != -1) {
            return memo[n][capacity];
        }

        // If weight of nth item is more than capacity
        if (weights[n-1] > capacity) {
            memo[n][capacity] = knapsackHelper(weights, values, capacity, n-1);
        } else {
            // Include or exclude the nth item
            int include = values[n-1] + knapsackHelper(weights, values, capacity - weights[n-1], n-1);
            int exclude = knapsackHelper(weights, values, capacity, n-1);
            memo[n][capacity] = Math.max(include, exclude);
        }

        return memo[n][capacity];
    }

    public static void printMemoTable(int n, int capacity) {
        System.out.println("\nMemoization Table:");
        System.out.print("Items\\Capacity: ");
        for (int w = 0; w <= capacity; w++) {
            System.out.printf("%3d ", w);
        }
        System.out.println();

        for (int i = 0; i <= n; i++) {
            System.out.printf("Item %d:         ", i);
            for (int w = 0; w <= capacity; w++) {
                if (memo[i][w] == -1) {
                    System.out.print(" -  ");
                } else {
                    System.out.printf("%3d ", memo[i][w]);
                }
            }
            System.out.println();
        }
    }
}
```

### 3. Tabulation (Bottom-Up DP)

```java showLineNumbers
public class KnapsackTabulation {

    public static int knapsack(int[] weights, int[] values, int capacity) {
        int n = weights.length;
        int[][] dp = new int[n + 1][capacity + 1];

        // Build table dp[][] in bottom-up manner
        for (int i = 0; i <= n; i++) {
            for (int w = 0; w <= capacity; w++) {
                if (i == 0 || w == 0) {
                    dp[i][w] = 0;
                } else if (weights[i-1] <= w) {
                    // Include current item or exclude it
                    int include = values[i-1] + dp[i-1][w - weights[i-1]];
                    int exclude = dp[i-1][w];
                    dp[i][w] = Math.max(include, exclude);
                } else {
                    // Current item weight is more than capacity
                    dp[i][w] = dp[i-1][w];
                }
            }
        }

        return dp[n][capacity];
    }

    public static void printDPTable(int[][] dp, int n, int capacity) {
        System.out.println("\nDP Table:");
        System.out.print("Items\\Capacity: ");
        for (int w = 0; w <= capacity; w++) {
            System.out.printf("%3d ", w);
        }
        System.out.println();

        for (int i = 0; i <= n; i++) {
            System.out.printf("Item %d:         ", i);
            for (int w = 0; w <= capacity; w++) {
                System.out.printf("%3d ", dp[i][w]);
            }
            System.out.println();
        }
    }

    public static List<Integer> findSelectedItems(int[] weights, int[] values, int capacity) {
        int n = weights.length;
        int[][] dp = new int[n + 1][capacity + 1];

        // Build DP table
        for (int i = 0; i <= n; i++) {
            for (int w = 0; w <= capacity; w++) {
                if (i == 0 || w == 0) {
                    dp[i][w] = 0;
                } else if (weights[i-1] <= w) {
                    dp[i][w] = Math.max(
                        values[i-1] + dp[i-1][w - weights[i-1]],
                        dp[i-1][w]
                    );
                } else {
                    dp[i][w] = dp[i-1][w];
                }
            }
        }

        // Backtrack to find selected items
        List<Integer> selectedItems = new ArrayList<>();
        int w = capacity;
        for (int i = n; i > 0 && w > 0; i--) {
            // If value comes from including current item
            if (dp[i][w] != dp[i-1][w]) {
                selectedItems.add(i-1); // 0-indexed
                w -= weights[i-1];
            }
        }

        Collections.reverse(selectedItems);
        return selectedItems;
    }
}
```

### 4. Space Optimized Solution

```java showLineNumbers
public class KnapsackSpaceOptimized {

    public static int knapsack(int[] weights, int[] values, int capacity) {
        int n = weights.length;
        int[] dp = new int[capacity + 1];

        for (int i = 0; i < n; i++) {
            // Traverse backwards to avoid using updated values
            for (int w = capacity; w >= weights[i]; w--) {
                dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
            }

            // Print intermediate states
            System.out.printf("After item %d: ", i + 1);
            for (int w = 0; w <= capacity; w++) {
                System.out.printf("%d ", dp[w]);
            }
            System.out.println();
        }

        return dp[capacity];
    }

    public static void demonstrateSpaceOptimized() {
        int[] weights = {1, 3, 4, 5};
        int[] values = {1, 4, 5, 7};
        int capacity = 7;

        System.out.println("Space-Optimized Knapsack:");
        System.out.println("Items: Weight|Value");
        for (int i = 0; i < weights.length; i++) {
            System.out.printf("Item %d: %d|%d\n", i+1, weights[i], values[i]);
        }
        System.out.println("Capacity: " + capacity);
        System.out.println("\nDP Array evolution:");

        int result = knapsack(weights, values, capacity);
        System.out.printf("\nMaximum value: %d\n", result);
    }
}
```

## Example Walkthrough

**Input:**

- Items: [(1,1), (3,4), (4,5), (5,7)] (weight, value)
- Capacity: 7

### Step-by-Step DP Table Construction

| Items\Capacity | 0   | 1   | 2   | 3   | 4   | 5   | 6   | 7   |
| -------------- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 (no items)   | 0   | 0   | 0   | 0   | 0   | 0   | 0   | 0   |
| 1 (w=1, v=1)   | 0   | 1   | 1   | 1   | 1   | 1   | 1   | 1   |
| 2 (w=3, v=4)   | 0   | 1   | 1   | 4   | 5   | 5   | 5   | 5   |
| 3 (w=4, v=5)   | 0   | 1   | 1   | 4   | 5   | 6   | 6   | 9   |
| 4 (w=5, v=7)   | 0   | 1   | 1   | 4   | 5   | 7   | 8   | 9   |

**Solution:** Maximum value = 9 (items 1 and 3: weights 1+4=5, values 1+5=6)

## Complete Demo Class

```java showLineNumbers
public class KnapsackDemo {

    public static void main(String[] args) {
        int[] weights = {1, 3, 4, 5};
        int[] values = {1, 4, 5, 7};
        int capacity = 7;

        System.out.println("=== 0/1 Knapsack Problem Demo ===");
        System.out.println("Items (Weight, Value):");
        for (int i = 0; i < weights.length; i++) {
            System.out.printf("Item %d: (%d, %d)\n", i+1, weights[i], values[i]);
        }
        System.out.printf("Knapsack Capacity: %d\n\n", capacity);

        // Recursive solution
        System.out.println("1. Recursive Solution:");
        KnapsackRecursive.demonstrateRecursive();

        // Memoization solution
        System.out.println("\n2. Memoization Solution:");
        int memoResult = KnapsackMemoization.knapsack(weights, values, capacity, weights.length);
        System.out.printf("Maximum value (Memoization): %d\n", memoResult);
        KnapsackMemoization.printMemoTable(weights.length, capacity);

        // Tabulation solution
        System.out.println("\n3. Tabulation Solution:");
        int tabulationResult = KnapsackTabulation.knapsack(weights, values, capacity);
        System.out.printf("Maximum value (Tabulation): %d\n", tabulationResult);

        // Find selected items
        List<Integer> selectedItems = KnapsackTabulation.findSelectedItems(weights, values, capacity);
        System.out.println("Selected items: " + selectedItems);
        System.out.print("Items included: ");
        int totalWeight = 0, totalValue = 0;
        for (int i : selectedItems) {
            System.out.printf("Item %d (w=%d, v=%d) ", i+1, weights[i], values[i]);
            totalWeight += weights[i];
            totalValue += values[i];
        }
        System.out.printf("\nTotal weight: %d, Total value: %d\n", totalWeight, totalValue);

        // Space optimized solution
        System.out.println("\n4. Space Optimized Solution:");
        KnapsackSpaceOptimized.demonstrateSpaceOptimized();
    }
}
```

## Variations and Extensions

### Fractional Knapsack (Greedy)

- Items can be broken into fractions
- Greedy approach: sort by value/weight ratio
- Time complexity: O(n log n)

### Unbounded Knapsack

- Unlimited copies of each item available
- Different DP recurrence relation
- Inner loop goes forward instead of backward

### Multiple Knapsack

- Multiple knapsacks with different capacities
- 3D DP or reduce to 0/1 knapsack instances

## Interview Tips

### When to Recognize Knapsack Problems

1. **Limited resource** (capacity, budget, time)
2. **Items with weights/costs and values/benefits**
3. **Maximize value** subject to constraints
4. **Binary choice** for each item

### Key Points to Remember

- **State definition**: dp[i][w] = max value with first i items and capacity w
- **Recurrence relation**: dp[i][w] = max(dp[i-1][w], dp[i-1]w-weight[i]] + value[i])
- **Space optimization**: Use 1D array, iterate backwards
- **Item tracking**: Backtrack through DP table

### Common Interview Questions

1. **"Why iterate backwards in space-optimized version?"**

   - Prevents using updated values from current iteration

2. **"How to handle item repetition?"**

   - Forward iteration for unbounded knapsack

3. **"Time vs space tradeoffs?"**
   - O(nW) time with O(W) space vs O(nW) space

## Common Mistakes

1. **Iterating forward** in space-optimized version
2. **Wrong base case** initialization
3. **Off-by-one errors** in indexing
4. **Forgetting weight constraint** check
5. **Incorrect backtracking** for item selection

## Applications

### Resource Allocation

- Budget allocation among projects
- Memory allocation in systems
- Bandwidth allocation in networks

### Investment Problems

- Portfolio optimization
- Capital budgeting
- Resource scheduling

### Game Development

- Inventory management
- Character skill point allocation
- Quest reward optimization

## Practice Problems

### Essential LeetCode Problems

1. **Partition Equal Subset Sum** (Medium) - Subset sum variant
2. **Target Sum** (Medium) - Assignment problem variant
3. **Coin Change II** (Medium) - Unbounded knapsack
4. **Ones and Zeroes** (Medium) - 2D knapsack

### Advanced Applications

- **Multiple choice knapsack**
- **Knapsack with conflicts**
- **2D knapsack problem**
- **Knapsack with dependencies**

### Real-world Optimization

- **Cloud resource allocation**
- **Logistics and shipping**
- **Manufacturing planning**
- **Financial portfolio optimization**
