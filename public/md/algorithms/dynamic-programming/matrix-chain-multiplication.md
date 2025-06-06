# Matrix Chain Multiplication

The **Matrix Chain Multiplication** problem is to find the most efficient way to multiply a sequence of matrices. The problem is not about actually multiplying the matrices, but about determining the optimal order of multiplication to minimize the total number of scalar multiplications.

## Problem Statement

Given a sequence of matrices `A₁, A₂, ..., Aₙ`, find the optimal way to parenthesize the product `A₁A₂...Aₙ` such that the total number of scalar multiplications is minimized.

## Key Concepts

- **Matrix dimensions**: For matrices A(p×q) and B(q×r), the product AB requires p×q×r scalar multiplications
- **Associative property**: Matrix multiplication is associative, so `(AB)C = A(BC)`
- **Different parenthesizations**: Lead to different numbers of scalar multiplications

## Algorithm Overview

This is a classic **Dynamic Programming** problem using **Interval DP** pattern.

### Time Complexity: O(n³)

### Space Complexity: O(n²)

## Implementation

### 1. Basic DP Solution

```typescript
function matrixChainOrder(dimensions: number[]): number {
  const n = dimensions.length - 1; // number of matrices

  // dp[i][j] = minimum cost to multiply matrices from i to j
  const dp: number[][] = Array(n + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  // length is the chain length
  for (let length = 2; length <= n; length++) {
    for (let i = 1; i <= n - length + 1; i++) {
      const j = i + length - 1;
      dp[i][j] = Infinity;

      // Try all possible positions to split the product
      for (let k = i; k < j; k++) {
        const cost =
          dp[i][k] +
          dp[k + 1][j] +
          dimensions[i - 1] * dimensions[k] * dimensions[j];
        dp[i][j] = Math.min(dp[i][j], cost);
      }
    }
  }

  return dp[1][n];
}
```

### 2. Solution with Parenthesization

```typescript
interface MatrixChainResult {
  minCost: number;
  parenthesization: string;
}

function matrixChainOrderWithParens(dimensions: number[]): MatrixChainResult {
  const n = dimensions.length - 1;
  const dp: number[][] = Array(n + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));
  const split: number[][] = Array(n + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  for (let length = 2; length <= n; length++) {
    for (let i = 1; i <= n - length + 1; i++) {
      const j = i + length - 1;
      dp[i][j] = Infinity;

      for (let k = i; k < j; k++) {
        const cost =
          dp[i][k] +
          dp[k + 1][j] +
          dimensions[i - 1] * dimensions[k] * dimensions[j];

        if (cost < dp[i][j]) {
          dp[i][j] = cost;
          split[i][j] = k;
        }
      }
    }
  }

  function buildParenthesization(i: number, j: number): string {
    if (i === j) {
      return `M${i}`;
    }

    const k = split[i][j];
    const left = buildParenthesization(i, k);
    const right = buildParenthesization(k + 1, j);

    return `(${left} × ${right})`;
  }

  return {
    minCost: dp[1][n],
    parenthesization: buildParenthesization(1, n),
  };
}
```

### 3. Memoized Recursive Solution

```typescript
function matrixChainMemo(dimensions: number[]): number {
  const n = dimensions.length - 1;
  const memo: Map<string, number> = new Map();

  function dp(i: number, j: number): number {
    if (i === j) return 0;

    const key = `${i},${j}`;
    if (memo.has(key)) {
      return memo.get(key)!;
    }

    let minCost = Infinity;

    for (let k = i; k < j; k++) {
      const cost =
        dp(i, k) +
        dp(k + 1, j) +
        dimensions[i - 1] * dimensions[k] * dimensions[j];
      minCost = Math.min(minCost, cost);
    }

    memo.set(key, minCost);
    return minCost;
  }

  return dp(1, n);
}
```

### 4. Space-Optimized Solution

```typescript
function matrixChainOptimized(dimensions: number[]): number {
  const n = dimensions.length - 1;

  // Only store current and previous diagonals
  let prev: number[] = Array(n + 1).fill(0);
  let curr: number[] = Array(n + 1).fill(0);

  for (let length = 2; length <= n; length++) {
    for (let i = 1; i <= n - length + 1; i++) {
      const j = i + length - 1;
      curr[i] = Infinity;

      for (let k = i; k < j; k++) {
        const cost =
          (length === 2 ? 0 : prev[i]) +
          (k + 1 === j ? 0 : prev[k + 1]) +
          dimensions[i - 1] * dimensions[k] * dimensions[j];
        curr[i] = Math.min(curr[i], cost);
      }
    }

    [prev, curr] = [curr, prev];
  }

  return prev[1];
}
```

## Step-by-Step Example

Matrices with dimensions: `[1, 2, 3, 4, 5]`

- Matrix A₁: 1×2
- Matrix A₂: 2×3
- Matrix A₃: 3×4
- Matrix A₄: 4×5

### DP Table Construction:

```
    1   2   3   4
1   0   6  18  30
2   -   0  24  48
3   -   -   0  60
4   -   -   -   0
```

### Calculations:

**Length 2:**

- `dp[1][2]`: A₁A₂ = 1×2×3 = 6
- `dp[2][3]`: A₂A₃ = 2×3×4 = 24
- `dp[3][4]`: A₃A₄ = 3×4×5 = 60

**Length 3:**

- `dp[1][3]`: min(A₁(A₂A₃), (A₁A₂)A₃) = min(6+24+1×2×4, 6+24+2×3×4) = min(38, 54) = 18
- `dp[2][4]`: min(A₂(A₃A₄), (A₂A₃)A₄) = min(24+60+2×3×5, 24+60+3×4×5) = min(114, 144) = 48

**Length 4:**

- `dp[1][4]`: min of three options = 30

**Optimal Parenthesization**: `((A₁A₂)A₃)A₄`

## Variations

### 1. Matrix Chain with Different Costs

```typescript
function matrixChainWithCosts(dimensions: number[], costs: number[][]): number {
  const n = dimensions.length - 1;
  const dp: number[][] = Array(n + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  for (let length = 2; length <= n; length++) {
    for (let i = 1; i <= n - length + 1; i++) {
      const j = i + length - 1;
      dp[i][j] = Infinity;

      for (let k = i; k < j; k++) {
        const cost = dp[i][k] + dp[k + 1][j] + costs[i - 1][j - 1];
        dp[i][j] = Math.min(dp[i][j], cost);
      }
    }
  }

  return dp[1][n];
}
```

### 2. Optimal Binary Search Tree (Similar Pattern)

```typescript
function optimalBST(keys: number[], freq: number[]): number {
  const n = keys.length;
  const dp: number[][] = Array(n + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));
  const sum: number[][] = Array(n + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  // Calculate frequency sums
  for (let i = 0; i <= n; i++) {
    for (let j = i; j <= n; j++) {
      if (i === j) {
        sum[i][j] = 0;
      } else {
        sum[i][j] = sum[i][j - 1] + freq[j - 1];
      }
    }
  }

  for (let length = 1; length <= n; length++) {
    for (let i = 0; i <= n - length; i++) {
      const j = i + length;
      dp[i][j] = Infinity;

      for (let k = i + 1; k <= j; k++) {
        const cost = dp[i][k - 1] + dp[k][j] + sum[i][j];
        dp[i][j] = Math.min(dp[i][j], cost);
      }
    }
  }

  return dp[0][n];
}
```

### 3. Burst Balloons (Similar DP Pattern)

```typescript
function maxCoins(nums: number[]): number {
  const n = nums.length;
  const arr = [1, ...nums, 1];
  const dp: number[][] = Array(n + 2)
    .fill(null)
    .map(() => Array(n + 2).fill(0));

  for (let length = 1; length <= n; length++) {
    for (let i = 1; i <= n - length + 1; i++) {
      const j = i + length - 1;

      for (let k = i; k <= j; k++) {
        const cost =
          dp[i][k - 1] + dp[k + 1][j] + arr[i - 1] * arr[k] * arr[j + 1];
        dp[i][j] = Math.max(dp[i][j], cost);
      }
    }
  }

  return dp[1][n];
}
```

## Practice Problems

### LeetCode Problems

- [312. Burst Balloons](https://leetcode.com/problems/burst-balloons/)
- [1039. Minimum Score Triangulation of Polygon](https://leetcode.com/problems/minimum-score-triangulation-of-polygon/)
- [1000. Minimum Cost to Merge Stones](https://leetcode.com/problems/minimum-cost-to-merge-stones/)
- [96. Unique Binary Search Trees](https://leetcode.com/problems/unique-binary-search-trees/)

### Test Cases

```typescript
// Test the implementation
console.log(matrixChainOrder([1, 2, 3, 4, 5])); // 30
console.log(matrixChainOrder([40, 20, 30, 10, 30])); // 26000
console.log(matrixChainOrder([1, 2, 3, 4])); // 18
console.log(matrixChainOrder([2, 1, 3, 4])); // 14

const result = matrixChainOrderWithParens([1, 2, 3, 4, 5]);
console.log(result.minCost); // 30
console.log(result.parenthesization); // ((M1 × M2) × M3) × M4
```

## Key Insights

1. **Interval DP**: Problem structure involves optimal splitting of intervals
2. **Optimal Substructure**: Optimal solution contains optimal solutions to subproblems
3. **Overlapping Subproblems**: Same subproblems are solved multiple times
4. **Bottom-up Approach**: Build solutions from smaller to larger intervals

## Applications

- **Compiler Optimization**: Expression evaluation order
- **Database Query Optimization**: Join order optimization
- **Computer Graphics**: Transformation matrix multiplication
- **Scientific Computing**: Efficient matrix operations

## Related Problems

- **Optimal Binary Search Tree**: Similar interval DP pattern
- **Burst Balloons**: Interval DP with multiplication
- **Palindrome Partitioning**: Interval DP with different objective
- **Minimum Cost Polygon Triangulation**: Geometric version of interval DP

## Complexity Analysis

- **Time**: O(n³) - three nested loops
- **Space**: O(n²) - 2D DP table
- **Optimization**: Can be reduced to O(n²) space using rolling arrays
- **Parallelization**: Different intervals can be computed in parallel
