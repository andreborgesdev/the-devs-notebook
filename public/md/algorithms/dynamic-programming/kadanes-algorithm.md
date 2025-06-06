# Kadane's Algorithm (Maximum Subarray)

**Kadane's Algorithm** is a dynamic programming algorithm used to find the maximum sum of a contiguous subarray within a one-dimensional array of numbers. It's one of the most elegant and efficient algorithms for solving the maximum subarray problem.

## Problem Statement

Given an integer array `nums`, find the contiguous subarray with the largest sum and return its sum.

**Example**: `[-2,1,-3,4,-1,2,1,-5,4]` → Output: `6` (subarray `[4,-1,2,1]`)

## Algorithm Overview

Kadane's algorithm uses the principle of **optimal substructure** where the maximum subarray ending at position `i` either:

1. Starts at position `i` (just the element itself)
2. Extends the maximum subarray ending at position `i-1`

### Time Complexity: O(n)

### Space Complexity: O(1)

## Implementation

### 1. Basic Kadane's Algorithm

```typescript
function maxSubArray(nums: number[]): number {
  let maxSoFar = nums[0];
  let maxEndingHere = nums[0];

  for (let i = 1; i < nums.length; i++) {
    maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);
    maxSoFar = Math.max(maxSoFar, maxEndingHere);
  }

  return maxSoFar;
}
```

### 2. Kadane's with Subarray Indices

```typescript
interface SubarrayResult {
  maxSum: number;
  startIndex: number;
  endIndex: number;
  subarray: number[];
}

function maxSubArrayWithIndices(nums: number[]): SubarrayResult {
  let maxSoFar = nums[0];
  let maxEndingHere = nums[0];
  let start = 0;
  let end = 0;
  let tempStart = 0;

  for (let i = 1; i < nums.length; i++) {
    if (maxEndingHere < 0) {
      maxEndingHere = nums[i];
      tempStart = i;
    } else {
      maxEndingHere += nums[i];
    }

    if (maxEndingHere > maxSoFar) {
      maxSoFar = maxEndingHere;
      start = tempStart;
      end = i;
    }
  }

  return {
    maxSum: maxSoFar,
    startIndex: start,
    endIndex: end,
    subarray: nums.slice(start, end + 1),
  };
}
```

### 3. Kadane's for All Negative Numbers

```typescript
function maxSubArrayAllNegative(nums: number[]): number {
  if (nums.length === 0) return 0;

  let maxSoFar = nums[0];
  let maxEndingHere = nums[0];

  for (let i = 1; i < nums.length; i++) {
    maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);
    maxSoFar = Math.max(maxSoFar, maxEndingHere);
  }

  return maxSoFar;
}
```

### 4. Modified Kadane's (At Least K Elements)

```typescript
function maxSubArrayAtLeastK(nums: number[], k: number): number {
  if (nums.length < k) return -Infinity;

  // Calculate sum of first k elements
  let currentSum = 0;
  for (let i = 0; i < k; i++) {
    currentSum += nums[i];
  }

  let maxSum = currentSum;
  let minPrefixSum = 0;
  let prefixSum = 0;

  for (let i = k; i < nums.length; i++) {
    currentSum += nums[i];
    prefixSum += nums[i - k];
    minPrefixSum = Math.min(minPrefixSum, prefixSum);
    maxSum = Math.max(maxSum, currentSum - minPrefixSum);
  }

  return maxSum;
}
```

### 5. 2D Kadane's Algorithm (Maximum Rectangle)

```typescript
function maximalRectangle(matrix: string[][]): number {
  if (matrix.length === 0 || matrix[0].length === 0) return 0;

  const rows = matrix.length;
  const cols = matrix[0].length;
  const heights: number[] = Array(cols).fill(0);
  let maxArea = 0;

  for (let i = 0; i < rows; i++) {
    // Update heights array
    for (let j = 0; j < cols; j++) {
      heights[j] = matrix[i][j] === "1" ? heights[j] + 1 : 0;
    }

    // Apply Kadane's algorithm on heights
    maxArea = Math.max(maxArea, largestRectangleInHistogram(heights));
  }

  return maxArea;
}

function largestRectangleInHistogram(heights: number[]): number {
  const stack: number[] = [];
  let maxArea = 0;

  for (let i = 0; i <= heights.length; i++) {
    const currentHeight = i === heights.length ? 0 : heights[i];

    while (
      stack.length > 0 &&
      currentHeight < heights[stack[stack.length - 1]]
    ) {
      const height = heights[stack.pop()!];
      const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
      maxArea = Math.max(maxArea, height * width);
    }

    stack.push(i);
  }

  return maxArea;
}
```

## Variations and Extensions

### 1. Maximum Product Subarray

```typescript
function maxProduct(nums: number[]): number {
  let maxSoFar = nums[0];
  let maxEndingHere = nums[0];
  let minEndingHere = nums[0];

  for (let i = 1; i < nums.length; i++) {
    if (nums[i] < 0) {
      [maxEndingHere, minEndingHere] = [minEndingHere, maxEndingHere];
    }

    maxEndingHere = Math.max(nums[i], maxEndingHere * nums[i]);
    minEndingHere = Math.min(nums[i], minEndingHere * nums[i]);

    maxSoFar = Math.max(maxSoFar, maxEndingHere);
  }

  return maxSoFar;
}
```

### 2. Maximum Subarray with At Most K Distinct Elements

```typescript
function maxSubArrayKDistinct(nums: number[], k: number): number {
  const frequencyMap = new Map<number, number>();
  let left = 0;
  let maxSum = -Infinity;
  let currentSum = 0;

  for (let right = 0; right < nums.length; right++) {
    currentSum += nums[right];
    frequencyMap.set(nums[right], (frequencyMap.get(nums[right]) || 0) + 1);

    while (frequencyMap.size > k) {
      const leftNum = nums[left];
      currentSum -= leftNum;
      frequencyMap.set(leftNum, frequencyMap.get(leftNum)! - 1);

      if (frequencyMap.get(leftNum) === 0) {
        frequencyMap.delete(leftNum);
      }

      left++;
    }

    maxSum = Math.max(maxSum, currentSum);
  }

  return maxSum;
}
```

### 3. Maximum Circular Subarray

```typescript
function maxSubarraySumCircular(nums: number[]): number {
  function kadane(arr: number[]): number {
    let maxSoFar = arr[0];
    let maxEndingHere = arr[0];

    for (let i = 1; i < arr.length; i++) {
      maxEndingHere = Math.max(arr[i], maxEndingHere + arr[i]);
      maxSoFar = Math.max(maxSoFar, maxEndingHere);
    }

    return maxSoFar;
  }

  function kadaneMin(arr: number[]): number {
    let minSoFar = arr[0];
    let minEndingHere = arr[0];

    for (let i = 1; i < arr.length; i++) {
      minEndingHere = Math.min(arr[i], minEndingHere + arr[i]);
      minSoFar = Math.min(minSoFar, minEndingHere);
    }

    return minSoFar;
  }

  const totalSum = nums.reduce((sum, num) => sum + num, 0);
  const maxKadane = kadane(nums);
  const minKadane = kadaneMin(nums);

  // If all elements are negative, return the maximum single element
  if (totalSum === minKadane) {
    return maxKadane;
  }

  return Math.max(maxKadane, totalSum - minKadane);
}
```

### 4. Maximum Subarray with Exactly K Elements

```typescript
function maxSubArrayExactlyK(nums: number[], k: number): number {
  if (nums.length < k) return -Infinity;

  let maxSum = -Infinity;

  for (let i = 0; i <= nums.length - k; i++) {
    let currentSum = 0;
    for (let j = i; j < i + k; j++) {
      currentSum += nums[j];
    }
    maxSum = Math.max(maxSum, currentSum);
  }

  return maxSum;
}

// Optimized sliding window version
function maxSubArrayExactlyKOptimized(nums: number[], k: number): number {
  if (nums.length < k) return -Infinity;

  let currentSum = 0;
  for (let i = 0; i < k; i++) {
    currentSum += nums[i];
  }

  let maxSum = currentSum;

  for (let i = k; i < nums.length; i++) {
    currentSum = currentSum - nums[i - k] + nums[i];
    maxSum = Math.max(maxSum, currentSum);
  }

  return maxSum;
}
```

## Step-by-Step Example

Array: `[-2, 1, -3, 4, -1, 2, 1, -5, 4]`

```
Index: 0   1   2   3   4   5   6   7   8
Value: -2  1  -3   4  -1   2   1  -5   4

Step-by-step execution:
i=0: maxEndingHere = -2, maxSoFar = -2
i=1: maxEndingHere = max(1, -2+1) = 1, maxSoFar = max(-2, 1) = 1
i=2: maxEndingHere = max(-3, 1-3) = -2, maxSoFar = max(1, -2) = 1
i=3: maxEndingHere = max(4, -2+4) = 4, maxSoFar = max(1, 4) = 4
i=4: maxEndingHere = max(-1, 4-1) = 3, maxSoFar = max(4, 3) = 4
i=5: maxEndingHere = max(2, 3+2) = 5, maxSoFar = max(4, 5) = 5
i=6: maxEndingHere = max(1, 5+1) = 6, maxSoFar = max(5, 6) = 6
i=7: maxEndingHere = max(-5, 6-5) = 1, maxSoFar = max(6, 1) = 6
i=8: maxEndingHere = max(4, 1+4) = 5, maxSoFar = max(6, 5) = 6

Result: 6 (subarray [4, -1, 2, 1])
```

## Advanced Applications

### 1. Stock Trading (Buy Low, Sell High)

```typescript
function maxProfit(prices: number[]): number {
  if (prices.length < 2) return 0;

  const profits: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    profits.push(prices[i] - prices[i - 1]);
  }

  return Math.max(0, maxSubArray(profits));
}
```

### 2. Game Score Optimization

```typescript
function maxGameScore(scores: number[], moves: number): number {
  if (moves >= scores.length) {
    return scores.reduce((sum, score) => sum + score, 0);
  }

  let maxScore = -Infinity;

  for (let start = 0; start <= scores.length - moves; start++) {
    let currentScore = 0;
    for (let i = start; i < start + moves; i++) {
      currentScore += scores[i];
    }
    maxScore = Math.max(maxScore, currentScore);
  }

  return maxScore;
}
```

### 3. Maximum Sum No Adjacent Elements

```typescript
function maxSumNoAdjacent(nums: number[]): number {
  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];

  let inclusive = nums[0];
  let exclusive = 0;

  for (let i = 1; i < nums.length; i++) {
    const newExclusive = Math.max(inclusive, exclusive);
    inclusive = exclusive + nums[i];
    exclusive = newExclusive;
  }

  return Math.max(inclusive, exclusive);
}
```

## Practice Problems

### LeetCode Problems

- [53. Maximum Subarray](https://leetcode.com/problems/maximum-subarray/)
- [152. Maximum Product Subarray](https://leetcode.com/problems/maximum-product-subarray/)
- [918. Maximum Sum Circular Subarray](https://leetcode.com/problems/maximum-sum-circular-subarray/)
- [1186. Maximum Subarray Sum with One Deletion](https://leetcode.com/problems/maximum-subarray-sum-with-one-deletion/)
- [1191. K-Concatenation Maximum Sum](https://leetcode.com/problems/k-concatenation-maximum-sum/)

### Test Cases

```typescript
// Test the implementations
console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6
console.log(maxSubArray([1])); // 1
console.log(maxSubArray([5, 4, -1, 7, 8])); // 23
console.log(maxSubArray([-1])); // -1

const result = maxSubArrayWithIndices([-2, 1, -3, 4, -1, 2, 1, -5, 4]);
console.log(result.maxSum); // 6
console.log(result.subarray); // [4, -1, 2, 1]

console.log(maxProduct([2, 3, -2, 4])); // 6
console.log(maxSubarraySumCircular([1, -2, 3, -2])); // 3
```

## Key Insights

1. **Local vs Global Maximum**: At each position, decide whether to extend or start new
2. **Single Pass**: Algorithm runs in linear time with constant space
3. **Handles All Cases**: Works for all positive, all negative, and mixed arrays
4. **Optimal Substructure**: Perfect example of dynamic programming principles

## Applications

- **Financial Analysis**: Maximum profit periods, trend analysis
- **Signal Processing**: Peak detection, noise filtering
- **Data Mining**: Pattern recognition, anomaly detection
- **Game Development**: Score optimization, resource management

## Related Algorithms

- **Maximum Product Subarray**: Multiplicative version with different logic
- **Longest Increasing Subsequence**: Different optimization objective
- **Sliding Window Maximum**: Fixed-size window optimization
- **Dynamic Programming**: Foundational technique for optimization problems

## Complexity Comparison

| Algorithm       | Time    | Space | Use Case                    |
| --------------- | ------- | ----- | --------------------------- |
| Kadane's Basic  | O(n)    | O(1)  | Maximum sum subarray        |
| With Indices    | O(n)    | O(1)  | Track subarray location     |
| Product Version | O(n)    | O(1)  | Multiplicative optimization |
| Circular Array  | O(n)    | O(1)  | Wraparound consideration    |
| 2D Version      | O(m×n²) | O(n)  | Maximum rectangle           |
