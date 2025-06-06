# Longest Increasing Subsequence (LIS)

The **Longest Increasing Subsequence** problem is to find the length of the longest subsequence of a given sequence such that all elements of the subsequence are sorted in increasing order.

## Problem Statement

Given an integer array `nums`, return the length of the longest **strictly increasing** subsequence.

A **subsequence** is a sequence that can be derived from an array by deleting some or no elements without changing the order of the remaining elements.

## Algorithm Overview

There are multiple approaches to solve this problem:

1. **Dynamic Programming**: O(n²) time, O(n) space
2. **Binary Search + DP**: O(n log n) time, O(n) space
3. **Patience Sorting**: O(n log n) time, O(n) space

### Time Complexity: O(n²) or O(n log n)

### Space Complexity: O(n)

## Implementation

### 1. Dynamic Programming Solution

```typescript
function lengthOfLIS(nums: number[]): number {
  if (nums.length === 0) return 0;

  const dp: number[] = Array(nums.length).fill(1);
  let maxLength = 1;

  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
    maxLength = Math.max(maxLength, dp[i]);
  }

  return maxLength;
}
```

### 2. Binary Search Solution (Optimal)

```typescript
function lengthOfLISOptimal(nums: number[]): number {
  if (nums.length === 0) return 0;

  const tails: number[] = [];

  for (const num of nums) {
    let left = 0;
    let right = tails.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (tails[mid] < num) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    if (left === tails.length) {
      tails.push(num);
    } else {
      tails[left] = num;
    }
  }

  return tails.length;
}
```

### 3. LIS with Actual Sequence

```typescript
function findLIS(nums: number[]): number[] {
  if (nums.length === 0) return [];

  const dp: number[] = Array(nums.length).fill(1);
  const parent: number[] = Array(nums.length).fill(-1);
  let maxLength = 1;
  let maxIndex = 0;

  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i] && dp[j] + 1 > dp[i]) {
        dp[i] = dp[j] + 1;
        parent[i] = j;
      }
    }
    if (dp[i] > maxLength) {
      maxLength = dp[i];
      maxIndex = i;
    }
  }

  const lis: number[] = [];
  let current = maxIndex;

  while (current !== -1) {
    lis.unshift(nums[current]);
    current = parent[current];
  }

  return lis;
}
```

### 4. Count of LIS

```typescript
function findNumberOfLIS(nums: number[]): number {
  if (nums.length === 0) return 0;

  const lengths: number[] = Array(nums.length).fill(1);
  const counts: number[] = Array(nums.length).fill(1);

  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        if (lengths[j] + 1 > lengths[i]) {
          lengths[i] = lengths[j] + 1;
          counts[i] = counts[j];
        } else if (lengths[j] + 1 === lengths[i]) {
          counts[i] += counts[j];
        }
      }
    }
  }

  const maxLength = Math.max(...lengths);
  let result = 0;

  for (let i = 0; i < nums.length; i++) {
    if (lengths[i] === maxLength) {
      result += counts[i];
    }
  }

  return result;
}
```

## Step-by-Step Example

Array: `[10, 9, 2, 5, 3, 7, 101, 18]`

### DP Approach:

```
Index:  0   1   2   3   4   5   6    7
Value: 10   9   2   5   3   7  101   18
DP:     1   1   1   2   2   3   4    4
```

**LIS**: `[2, 3, 7, 18]` or `[2, 3, 7, 101]` (length = 4)

### Binary Search Approach:

```
Step 1: [10]
Step 2: [9]          (replace 10 with 9)
Step 3: [2]          (replace 9 with 2)
Step 4: [2, 5]       (append 5)
Step 5: [2, 3]       (replace 5 with 3)
Step 6: [2, 3, 7]    (append 7)
Step 7: [2, 3, 7, 101] (append 101)
Step 8: [2, 3, 7, 18]  (replace 101 with 18)
```

## Variations

### 1. Longest Decreasing Subsequence

```typescript
function lengthOfLDS(nums: number[]): number {
  if (nums.length === 0) return 0;

  const dp: number[] = Array(nums.length).fill(1);
  let maxLength = 1;

  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] > nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
    maxLength = Math.max(maxLength, dp[i]);
  }

  return maxLength;
}
```

### 2. Longest Non-Decreasing Subsequence

```typescript
function lengthOfLNDS(nums: number[]): number {
  if (nums.length === 0) return 0;

  const tails: number[] = [];

  for (const num of nums) {
    let left = 0;
    let right = tails.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (tails[mid] <= num) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    if (left === tails.length) {
      tails.push(num);
    } else {
      tails[left] = num;
    }
  }

  return tails.length;
}
```

### 3. Russian Doll Envelopes (2D LIS)

```typescript
function maxEnvelopes(envelopes: number[][]): number {
  envelopes.sort((a, b) => (a[0] === b[0] ? b[1] - a[1] : a[0] - b[0]));

  const heights = envelopes.map((env) => env[1]);
  return lengthOfLISOptimal(heights);
}
```

### 4. Minimum Number of Arrows (LIS Application)

```typescript
function minArrowsToPopBalloons(points: number[][]): number {
  if (points.length === 0) return 0;

  points.sort((a, b) => a[1] - b[1]);

  let arrows = 1;
  let lastArrow = points[0][1];

  for (let i = 1; i < points.length; i++) {
    if (points[i][0] > lastArrow) {
      arrows++;
      lastArrow = points[i][1];
    }
  }

  return arrows;
}
```

## Practice Problems

### LeetCode Problems

- [300. Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/)
- [673. Number of Longest Increasing Subsequence](https://leetcode.com/problems/number-of-longest-increasing-subsequence/)
- [354. Russian Doll Envelopes](https://leetcode.com/problems/russian-doll-envelopes/)
- [646. Maximum Length of Pair Chain](https://leetcode.com/problems/maximum-length-of-pair-chain/)
- [1671. Minimum Number of Removals to Make Mountain Array](https://leetcode.com/problems/minimum-number-of-removals-to-make-mountain-array/)

### Test Cases

```typescript
// Test the implementations
console.log(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18])); // 4
console.log(lengthOfLIS([0, 1, 0, 3, 2, 3])); // 4
console.log(lengthOfLIS([7, 7, 7, 7, 7, 7, 7])); // 1
console.log(lengthOfLIS([1, 3, 6, 7, 9, 4, 10, 5, 6])); // 6

console.log(findLIS([10, 9, 2, 5, 3, 7, 101, 18])); // [2, 3, 7, 18]
console.log(findNumberOfLIS([1, 3, 5, 4, 7])); // 2
```

## Key Insights

1. **DP State**: `dp[i]` represents the length of LIS ending at index `i`
2. **Binary Search**: Maintains array of smallest tail elements for each length
3. **Greedy Choice**: Always replace with smaller element to keep more possibilities
4. **Patience Sorting**: The binary search approach is based on patience sorting algorithm

## Applications

- **Scheduling Problems**: Activity selection, interval scheduling
- **Bioinformatics**: DNA sequence alignment, protein folding
- **Economics**: Stock price analysis, trend detection
- **Algorithms**: Patience sorting, dilworth's theorem

## Related Algorithms

- **Longest Common Subsequence (LCS)**: Can be reduced to LIS in some cases
- **Maximum Subarray**: Different type of subsequence problem
- **Edit Distance**: Related dynamic programming problem
- **Kadane's Algorithm**: For contiguous subsequences
