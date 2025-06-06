# Coin Change Problem

The **Coin Change Problem** is a classic dynamic programming problem that finds the minimum number of coins needed to make a given amount of money, or counts the number of ways to make the amount.

## Problem Statement

Given an array of coin denominations and a target amount, find:

1. **Minimum coins**: Fewest coins needed to make the amount
2. **Number of ways**: How many different ways to make the amount

**Input**: Coin denominations array and target amount
**Output**: Minimum coins needed or number of ways

## Key Concepts

- **Optimal Substructure**: Optimal solution contains optimal solutions to subproblems
- **Overlapping Subproblems**: Same subproblems are solved multiple times
- **Greedy vs DP**: Greedy doesn't always work (e.g., coins=[1,3,4], amount=6)

## Time and Space Complexity

| Approach                | Time Complexity       | Space Complexity  |
| ----------------------- | --------------------- | ----------------- |
| Recursive (Brute Force) | O(amount^coins)       | O(amount)         |
| Memoization             | O(coins × amount)     | O(coins × amount) |
| Tabulation              | O(coins × amount)     | O(amount)         |
| **Space Optimized**     | **O(coins × amount)** | **O(amount)**     |

## Algorithm Approaches

### 1. Minimum Coins (Bottom-Up DP)

```java showLineNumbers
import java.util.*;

public class CoinChangeMinimum {

    public static int coinChange(int[] coins, int amount) {
        if (amount == 0) return 0;

        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1); // Initialize with impossible value
        dp[0] = 0;

        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (coin <= i) {
                    dp[i] = Math.min(dp[i], dp[i - coin] + 1);
                }
            }
        }

        return dp[amount] > amount ? -1 : dp[amount];
    }

    public static List<Integer> getCoinsUsed(int[] coins, int amount) {
        if (amount == 0) return new ArrayList<>();

        int[] dp = new int[amount + 1];
        int[] parent = new int[amount + 1];

        Arrays.fill(dp, amount + 1);
        Arrays.fill(parent, -1);
        dp[0] = 0;

        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (coin <= i && dp[i - coin] + 1 < dp[i]) {
                    dp[i] = dp[i - coin] + 1;
                    parent[i] = coin;
                }
            }
        }

        if (dp[amount] > amount) return null; // Impossible

        List<Integer> result = new ArrayList<>();
        int curr = amount;
        while (curr > 0) {
            result.add(parent[curr]);
            curr -= parent[curr];
        }

        return result;
    }

    public static void demonstrateMinimumCoins() {
        int[] coins = {1, 3, 4};
        int amount = 6;

        System.out.printf("Coins: %s\n", Arrays.toString(coins));
        System.out.printf("Amount: %d\n", amount);

        int minCoins = coinChange(coins, amount);
        System.out.printf("Minimum coins needed: %d\n", minCoins);

        List<Integer> coinsUsed = getCoinsUsed(coins, amount);
        if (coinsUsed != null) {
            System.out.printf("Coins used: %s\n", coinsUsed);
        } else {
            System.out.println("Amount cannot be made with given coins");
        }
    }
}
```

### 2. Number of Ways (Bottom-Up DP)

```java showLineNumbers
public class CoinChangeWays {

    public static int coinChangeWays(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        dp[0] = 1; // One way to make amount 0: use no coins

        for (int coin : coins) {
            for (int i = coin; i <= amount; i++) {
                dp[i] += dp[i - coin];
            }
        }

        return dp[amount];
    }

    public static void demonstrateWays() {
        int[] coins = {1, 2, 5};
        int amount = 5;

        System.out.printf("Coins: %s\n", Arrays.toString(coins));
        System.out.printf("Amount: %d\n", amount);

        int ways = coinChangeWays(coins, amount);
        System.out.printf("Number of ways: %d\n", ways);

        // Show all combinations
        List<List<Integer>> allWays = findAllWays(coins, amount);
        System.out.println("All ways:");
        for (List<Integer> way : allWays) {
            System.out.println(way);
        }
    }

    public static List<List<Integer>> findAllWays(int[] coins, int amount) {
        List<List<Integer>> result = new ArrayList<>();
        findWaysHelper(coins, amount, 0, new ArrayList<>(), result);
        return result;
    }

    private static void findWaysHelper(int[] coins, int remaining, int coinIndex,
                                      List<Integer> current, List<List<Integer>> result) {
        if (remaining == 0) {
            result.add(new ArrayList<>(current));
            return;
        }

        if (remaining < 0 || coinIndex >= coins.length) {
            return;
        }

        int coin = coins[coinIndex];

        // Include current coin (can use multiple times)
        current.add(coin);
        findWaysHelper(coins, remaining - coin, coinIndex, current, result);
        current.remove(current.size() - 1);

        // Exclude current coin and move to next
        findWaysHelper(coins, remaining, coinIndex + 1, current, result);
    }
}
```

### 3. Memoization Approach (Top-Down)

```java showLineNumbers
public class CoinChangeMemoization {

    public static int coinChangeMinMemo(int[] coins, int amount) {
        Map<Integer, Integer> memo = new HashMap<>();
        int result = coinChangeHelper(coins, amount, memo);
        return result == Integer.MAX_VALUE ? -1 : result;
    }

    private static int coinChangeHelper(int[] coins, int amount, Map<Integer, Integer> memo) {
        if (amount == 0) return 0;
        if (amount < 0) return Integer.MAX_VALUE;

        if (memo.containsKey(amount)) {
            return memo.get(amount);
        }

        int minCoins = Integer.MAX_VALUE;
        for (int coin : coins) {
            int subResult = coinChangeHelper(coins, amount - coin, memo);
            if (subResult != Integer.MAX_VALUE) {
                minCoins = Math.min(minCoins, subResult + 1);
            }
        }

        memo.put(amount, minCoins);
        return minCoins;
    }

    public static int coinChangeWaysMemo(int[] coins, int amount) {
        Map<String, Integer> memo = new HashMap<>();
        return waysHelper(coins, amount, 0, memo);
    }

    private static int waysHelper(int[] coins, int amount, int coinIndex,
                                 Map<String, Integer> memo) {
        if (amount == 0) return 1;
        if (amount < 0 || coinIndex >= coins.length) return 0;

        String key = amount + "," + coinIndex;
        if (memo.containsKey(key)) {
            return memo.get(key);
        }

        int ways = waysHelper(coins, amount - coins[coinIndex], coinIndex, memo) +
                   waysHelper(coins, amount, coinIndex + 1, memo);

        memo.put(key, ways);
        return ways;
    }
}
```

## Variations and Extensions

### 1. Exact Change (Finite Coin Supply)

```java showLineNumbers
public class CoinChangeExact {

    public static int coinChangeExact(int[] coins, int[] counts, int amount) {
        int[][] dp = new int[coins.length + 1][amount + 1];

        // Initialize with impossible values
        for (int i = 0; i <= coins.length; i++) {
            Arrays.fill(dp[i], amount + 1);
            dp[i][0] = 0;
        }

        for (int i = 1; i <= coins.length; i++) {
            int coin = coins[i - 1];
            int maxCount = counts[i - 1];

            for (int j = 0; j <= amount; j++) {
                dp[i][j] = dp[i - 1][j]; // Don't use current coin

                for (int k = 1; k <= maxCount && k * coin <= j; k++) {
                    if (dp[i - 1][j - k * coin] != amount + 1) {
                        dp[i][j] = Math.min(dp[i][j], dp[i - 1][j - k * coin] + k);
                    }
                }
            }
        }

        return dp[coins.length][amount] > amount ? -1 : dp[coins.length][amount];
    }
}
```

### 2. Maximum Value with Weight Constraint

```java showLineNumbers
public class CoinChangeValue {

    static class Coin {
        int denomination;
        int value;
        int weight;

        Coin(int denomination, int value, int weight) {
            this.denomination = denomination;
            this.value = value;
            this.weight = weight;
        }
    }

    public static int maxValueWithWeight(Coin[] coins, int maxWeight, int targetAmount) {
        // 3D DP: [coin index][weight][amount]
        int[][][] dp = new int[coins.length + 1][maxWeight + 1][targetAmount + 1];

        for (int i = 1; i <= coins.length; i++) {
            Coin coin = coins[i - 1];

            for (int w = 0; w <= maxWeight; w++) {
                for (int a = 0; a <= targetAmount; a++) {
                    // Don't use current coin
                    dp[i][w][a] = dp[i - 1][w][a];

                    // Use current coin if possible
                    if (w >= coin.weight && a >= coin.denomination) {
                        dp[i][w][a] = Math.max(dp[i][w][a],
                            dp[i][w - coin.weight][a - coin.denomination] + coin.value);
                    }
                }
            }
        }

        return dp[coins.length][maxWeight][targetAmount];
    }
}
```

### 3. Coin Change with Order Matters (Permutations)

```java showLineNumbers
public class CoinChangePermutations {

    public static int coinChangePermutations(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        dp[0] = 1;

        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (coin <= i) {
                    dp[i] += dp[i - coin];
                }
            }
        }

        return dp[amount];
    }

    public static void demonstratePermutations() {
        int[] coins = {1, 2};
        int amount = 3;

        System.out.printf("Coins: %s, Amount: %d\n", Arrays.toString(coins), amount);

        int combinations = CoinChangeWays.coinChangeWays(coins, amount);
        int permutations = coinChangePermutations(coins, amount);

        System.out.printf("Combinations (order doesn't matter): %d\n", combinations);
        System.out.printf("Permutations (order matters): %d\n", permutations);
    }
}
```

## Algorithm Comparison

| Problem Variant   | Approach             | Time                      | Space           | Use Case        |
| ----------------- | -------------------- | ------------------------- | --------------- | --------------- |
| Minimum Coins     | DP (amount)          | O(coins×amount)           | O(amount)       | Fewest coins    |
| Number of Ways    | DP (combinations)    | O(coins×amount)           | O(amount)       | Count solutions |
| Finite Supply     | 2D DP                | O(coins×amount×max_count) | O(coins×amount) | Limited coins   |
| With Permutations | DP (different order) | O(coins×amount)           | O(amount)       | Order matters   |

## Real-world Applications

### Financial Systems

- **Currency exchange** optimization
- **Payment processing** with minimal fees
- **Cash register** change calculation

### Resource Allocation

- **Task scheduling** with time slots
- **Memory allocation** with fixed blocks
- **Inventory management** optimization

### Gaming and Puzzles

- **Score achievement** with limited moves
- **Resource collection** games
- **Puzzle solving** with constraints

## Interview Tips

### Common Questions

1. **"Why doesn't greedy work for all coin systems?"**

   - Counterexample: coins=[1,3,4], amount=6. Greedy gives [4,1,1] but optimal is [3,3]

2. **"How to optimize space complexity?"**

   - Use 1D array instead of 2D, process coins in outer loop

3. **"Difference between combinations and permutations?"**
   - Combinations: loop coins first. Permutations: loop amount first

### Implementation Notes

- **Initialize DP array carefully**: Use impossible values for minimum problems
- **Handle edge cases**: amount=0, empty coins array, impossible amounts
- **Consider integer overflow**: For counting problems with large numbers

### Quick Decision Framework

- **Minimum coins needed** → DP with min operation
- **Count ways** → DP with sum operation
- **Find actual coins** → DP with parent tracking
- **Limited coin supply** → 2D DP with coin counts

## Practice Problems

### Essential LeetCode Problems

1. **Coin Change** (Medium) - Minimum coins
2. **Coin Change 2** (Medium) - Number of ways
3. **Perfect Squares** (Medium) - Similar DP pattern
4. **Combination Sum IV** (Medium) - Permutations variant

### Advanced Applications

- **Knapsack with unlimited items**
- **Making change with foreign currencies**
- **Resource optimization** with constraints
- **Game theory** with coin collection

### Real-world Systems

- **ATM cash dispensing** algorithms
- **Cryptocurrency** transaction optimization
- **Retail point-of-sale** systems
- **Financial trading** algorithms

## Summary

The **Coin Change Problem** is fundamental to understanding dynamic programming. The key insights are identifying optimal substructure, choosing the right DP state representation, and understanding the difference between combinations and permutations. This problem pattern appears in many optimization scenarios involving resource allocation and constraint satisfaction.
