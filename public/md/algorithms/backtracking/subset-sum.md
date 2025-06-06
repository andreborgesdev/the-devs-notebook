# Subset Sum Problems

**Subset Sum** is a fundamental problem in computer science that involves finding subsets of a given set that satisfy certain sum conditions. This problem demonstrates multiple algorithmic paradigms including dynamic programming, backtracking, and meet-in-the-middle approaches.

## Problem Variants

### 1. Subset Sum (Decision Problem)

Given a set of integers and a target sum, determine if there exists a subset that sums to the target.

### 2. Subset Sum (Count All)

Count the number of subsets that sum to the target.

### 3. All Subsets with Target Sum

Find all subsets that sum to the target value.

### 4. Equal Sum Partition

Determine if the array can be partitioned into two subsets with equal sum.

## Algorithm Overview

The problem can be solved using different approaches:

- **Dynamic Programming**: O(n × sum) time and space
- **Backtracking**: O(2ⁿ) time, O(n) space
- **Meet-in-the-Middle**: O(2^(n/2)) time and space

### Time Complexity: O(n × sum) for DP, O(2ⁿ) for backtracking

### Space Complexity: O(n × sum) for DP, O(n) for backtracking

## Implementation

### 1. Dynamic Programming Solution

```typescript
function canPartition(nums: number[], target: number): boolean {
  if (target < 0) return false;

  const dp: boolean[] = Array(target + 1).fill(false);
  dp[0] = true;

  for (const num of nums) {
    for (let sum = target; sum >= num; sum--) {
      dp[sum] = dp[sum] || dp[sum - num];
    }
  }

  return dp[target];
}

function subsetSum2D(nums: number[], target: number): boolean {
  const n = nums.length;
  const dp: boolean[][] = Array(n + 1)
    .fill(null)
    .map(() => Array(target + 1).fill(false));

  // Base case: sum 0 is always possible with empty subset
  for (let i = 0; i <= n; i++) {
    dp[i][0] = true;
  }

  for (let i = 1; i <= n; i++) {
    for (let sum = 1; sum <= target; sum++) {
      dp[i][sum] = dp[i - 1][sum];

      if (sum >= nums[i - 1]) {
        dp[i][sum] = dp[i][sum] || dp[i - 1][sum - nums[i - 1]];
      }
    }
  }

  return dp[n][target];
}
```

### 2. Backtracking Solution (All Subsets)

```typescript
function findAllSubsetsWithSum(nums: number[], target: number): number[][] {
  const result: number[][] = [];
  const currentSubset: number[] = [];

  backtrack(nums, target, 0, currentSubset, result);
  return result;
}

function backtrack(
  nums: number[],
  remainingSum: number,
  index: number,
  currentSubset: number[],
  result: number[][]
): void {
  if (remainingSum === 0) {
    result.push([...currentSubset]);
    return;
  }

  if (remainingSum < 0 || index >= nums.length) {
    return;
  }

  // Include current element
  currentSubset.push(nums[index]);
  backtrack(nums, remainingSum - nums[index], index + 1, currentSubset, result);
  currentSubset.pop();

  // Skip current element
  backtrack(nums, remainingSum, index + 1, currentSubset, result);
}
```

### 3. Count Subsets with Target Sum

```typescript
function countSubsets(nums: number[], target: number): number {
  const dp: number[] = Array(target + 1).fill(0);
  dp[0] = 1;

  for (const num of nums) {
    for (let sum = target; sum >= num; sum--) {
      dp[sum] += dp[sum - num];
    }
  }

  return dp[target];
}

function countSubsets2D(nums: number[], target: number): number {
  const n = nums.length;
  const dp: number[][] = Array(n + 1)
    .fill(null)
    .map(() => Array(target + 1).fill(0));

  for (let i = 0; i <= n; i++) {
    dp[i][0] = 1;
  }

  for (let i = 1; i <= n; i++) {
    for (let sum = 0; sum <= target; sum++) {
      dp[i][sum] = dp[i - 1][sum];

      if (sum >= nums[i - 1]) {
        dp[i][sum] += dp[i - 1][sum - nums[i - 1]];
      }
    }
  }

  return dp[n][target];
}
```

### 4. Equal Sum Partition

```typescript
function canPartitionEqual(nums: number[]): boolean {
  const totalSum = nums.reduce((sum, num) => sum + num, 0);

  if (totalSum % 2 !== 0) return false;

  const target = totalSum / 2;
  return canPartition(nums, target);
}

function canPartitionEqualBacktrack(nums: number[]): boolean {
  const totalSum = nums.reduce((sum, num) => sum + num, 0);

  if (totalSum % 2 !== 0) return false;

  const target = totalSum / 2;
  const memo = new Map<string, boolean>();

  return canPartitionHelper(nums, 0, target, memo);
}

function canPartitionHelper(
  nums: number[],
  index: number,
  target: number,
  memo: Map<string, boolean>
): boolean {
  if (target === 0) return true;
  if (target < 0 || index >= nums.length) return false;

  const key = `${index},${target}`;
  if (memo.has(key)) return memo.get(key)!;

  const result =
    canPartitionHelper(nums, index + 1, target - nums[index], memo) ||
    canPartitionHelper(nums, index + 1, target, memo);

  memo.set(key, result);
  return result;
}
```

### 5. Meet-in-the-Middle Approach

```typescript
function subsetSumMeetInMiddle(nums: number[], target: number): boolean {
  const n = nums.length;
  const mid = Math.floor(n / 2);

  const leftSums = generateAllSums(nums.slice(0, mid));
  const rightSums = generateAllSums(nums.slice(mid));

  const rightSet = new Set(rightSums);

  for (const leftSum of leftSums) {
    if (rightSet.has(target - leftSum)) {
      return true;
    }
  }

  return false;
}

function generateAllSums(nums: number[]): number[] {
  const sums: number[] = [];
  const n = nums.length;

  for (let mask = 0; mask < 1 << n; mask++) {
    let sum = 0;
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        sum += nums[i];
      }
    }
    sums.push(sum);
  }

  return sums;
}
```

### 6. Subset Sum with Path Reconstruction

```typescript
interface SubsetResult {
  exists: boolean;
  subset: number[];
}

function findSubsetWithSum(nums: number[], target: number): SubsetResult {
  const n = nums.length;
  const dp: boolean[][] = Array(n + 1)
    .fill(null)
    .map(() => Array(target + 1).fill(false));

  for (let i = 0; i <= n; i++) {
    dp[i][0] = true;
  }

  for (let i = 1; i <= n; i++) {
    for (let sum = 1; sum <= target; sum++) {
      dp[i][sum] = dp[i - 1][sum];

      if (sum >= nums[i - 1]) {
        dp[i][sum] = dp[i][sum] || dp[i - 1][sum - nums[i - 1]];
      }
    }
  }

  if (!dp[n][target]) {
    return { exists: false, subset: [] };
  }

  // Reconstruct path
  const subset: number[] = [];
  let i = n,
    sum = target;

  while (i > 0 && sum > 0) {
    if (!dp[i - 1][sum]) {
      subset.push(nums[i - 1]);
      sum -= nums[i - 1];
    }
    i--;
  }

  return { exists: true, subset: subset.reverse() };
}
```

## Step-by-Step Example

### Array: [3, 34, 4, 12, 5, 2], Target: 9

**DP Table Construction:**

```
     0  1  2  3  4  5  6  7  8  9
[]   T  F  F  F  F  F  F  F  F  F
[3]  T  F  F  T  F  F  F  F  F  F
[34] T  F  F  T  F  F  F  F  F  F
[4]  T  F  F  T  T  F  F  T  F  F
[12] T  F  F  T  T  F  F  T  F  F
[5]  T  F  F  T  T  T  F  T  T  T
[2]  T  F  T  T  T  T  T  T  T  T
```

**Result**: dp[6][9] = True, so subset [4, 5] or [7, 2] exists.

## Advanced Variations

### 1. Subset Sum with Minimum Difference

```typescript
function minimumSubsetSumDifference(nums: number[]): number {
  const totalSum = nums.reduce((sum, num) => sum + num, 0);
  const target = Math.floor(totalSum / 2);

  const dp: boolean[] = Array(target + 1).fill(false);
  dp[0] = true;

  for (const num of nums) {
    for (let sum = target; sum >= num; sum--) {
      dp[sum] = dp[sum] || dp[sum - num];
    }
  }

  for (let sum = target; sum >= 0; sum--) {
    if (dp[sum]) {
      return totalSum - 2 * sum;
    }
  }

  return totalSum;
}
```

### 2. Subset Sum with Limited Count

```typescript
function subsetSumWithCount(
  nums: number[],
  target: number,
  maxCount: number
): boolean {
  const memo = new Map<string, boolean>();

  return backtrackWithCount(nums, 0, target, maxCount, memo);
}

function backtrackWithCount(
  nums: number[],
  index: number,
  remainingSum: number,
  remainingCount: number,
  memo: Map<string, boolean>
): boolean {
  if (remainingSum === 0) return true;
  if (remainingSum < 0 || remainingCount <= 0 || index >= nums.length)
    return false;

  const key = `${index},${remainingSum},${remainingCount}`;
  if (memo.has(key)) return memo.get(key)!;

  const result =
    backtrackWithCount(
      nums,
      index + 1,
      remainingSum - nums[index],
      remainingCount - 1,
      memo
    ) ||
    backtrackWithCount(nums, index + 1, remainingSum, remainingCount, memo);

  memo.set(key, result);
  return result;
}
```

### 3. Target Sum (Add/Subtract Assignment)

```typescript
function findTargetSumWays(nums: number[], target: number): number {
  const totalSum = nums.reduce((sum, num) => sum + num, 0);

  if (Math.abs(target) > totalSum || (target + totalSum) % 2 !== 0) {
    return 0;
  }

  const positiveSum = (target + totalSum) / 2;
  return countSubsets(nums, positiveSum);
}

function findTargetSumWaysBacktrack(nums: number[], target: number): number {
  const memo = new Map<string, number>();

  return backtrackTargetSum(nums, 0, target, memo);
}

function backtrackTargetSum(
  nums: number[],
  index: number,
  remainingTarget: number,
  memo: Map<string, number>
): number {
  if (index === nums.length) {
    return remainingTarget === 0 ? 1 : 0;
  }

  const key = `${index},${remainingTarget}`;
  if (memo.has(key)) return memo.get(key)!;

  const result =
    backtrackTargetSum(nums, index + 1, remainingTarget - nums[index], memo) +
    backtrackTargetSum(nums, index + 1, remainingTarget + nums[index], memo);

  memo.set(key, result);
  return result;
}
```

## Practice Problems

### LeetCode Problems

- [416. Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum/)
- [494. Target Sum](https://leetcode.com/problems/target-sum/)
- [698. Partition to K Equal Sum Subsets](https://leetcode.com/problems/partition-to-k-equal-sum-subsets/)
- [1049. Last Stone Weight II](https://leetcode.com/problems/last-stone-weight-ii/)
- [1593. Split a String Into the Max Number of Unique Substrings](https://leetcode.com/problems/split-a-string-into-the-max-number-of-unique-substrings/)

### Test Cases

```typescript
// Test implementations
console.log(canPartition([3, 34, 4, 12, 5, 2], 9)); // true
console.log(canPartitionEqual([1, 5, 11, 5])); // true
console.log(countSubsets([1, 1, 2, 3], 4)); // 3
console.log(findTargetSumWays([1, 1, 1, 1, 1], 3)); // 5

const allSubsets = findAllSubsetsWithSum([2, 3, 6, 7], 7);
console.log(allSubsets); // [[7], [2, 3]]

const subsetResult = findSubsetWithSum([3, 34, 4, 12, 5, 2], 9);
console.log(subsetResult); // {exists: true, subset: [4, 5]}

console.log(minimumSubsetSumDifference([1, 6, 11, 5])); // 1
```

## Key Insights

1. **DP vs Backtracking**: DP is better for decision/counting, backtracking for finding all solutions
2. **Space Optimization**: 1D DP array can replace 2D when only previous row is needed
3. **Early Termination**: Sort array descending for better pruning in backtracking
4. **Problem Transformation**: Many problems can be reduced to subset sum

## Applications

- **Resource Allocation**: Distributing resources with constraints
- **Cryptography**: Knapsack-based cryptographic systems
- **Game Theory**: Partition games and fair division
- **Optimization**: Bin packing and scheduling problems

## Related Algorithms

- **0/1 Knapsack**: Generalization with weights and values
- **Coin Change**: Unbounded version of subset sum
- **Partition Problem**: Special case with equal sums
- **Set Cover**: Different type of subset selection problem

## Complexity Analysis

| Algorithm          | Time       | Space      | Use Case            |
| ------------------ | ---------- | ---------- | ------------------- |
| DP (1D)            | O(n×sum)   | O(sum)     | Decision/counting   |
| DP (2D)            | O(n×sum)   | O(n×sum)   | Path reconstruction |
| Backtracking       | O(2ⁿ)      | O(n)       | All solutions       |
| Meet-in-Middle     | O(2^(n/2)) | O(2^(n/2)) | Large inputs        |
| Memoized Recursion | O(n×sum)   | O(n×sum)   | Natural recursion   |
