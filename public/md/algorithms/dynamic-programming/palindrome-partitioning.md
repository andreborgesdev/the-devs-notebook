# Palindrome Partitioning

**Palindrome Partitioning** is a dynamic programming problem that involves partitioning a string into palindromic substrings. There are several variants of this problem, each with different objectives.

## Problem Variants

### 1. Minimum Cuts for Palindrome Partitioning

Given a string, find the minimum number of cuts needed to partition it such that every substring is a palindrome.

### 2. All Possible Palindrome Partitions

Return all possible ways to partition a string such that every substring is a palindrome.

### 3. Check if String Can Be Partitioned

Determine if a string can be partitioned into palindromes with certain constraints.

## Algorithm Overview

The problem uses **Dynamic Programming** with **String Processing** patterns.

### Time Complexity: O(n²) to O(n³)

### Space Complexity: O(n²)

## Implementation

### 1. Minimum Cuts (DP Solution)

```typescript
function minCut(s: string): number {
  const n = s.length;

  // isPalindrome[i][j] = true if s[i..j] is palindrome
  const isPalindrome: boolean[][] = Array(n)
    .fill(null)
    .map(() => Array(n).fill(false));

  // Precompute palindrome table
  for (let i = 0; i < n; i++) {
    isPalindrome[i][i] = true;
  }

  for (let length = 2; length <= n; length++) {
    for (let i = 0; i <= n - length; i++) {
      const j = i + length - 1;
      if (s[i] === s[j]) {
        isPalindrome[i][j] = length === 2 || isPalindrome[i + 1][j - 1];
      }
    }
  }

  // dp[i] = minimum cuts for s[0..i]
  const dp: number[] = Array(n).fill(Infinity);

  for (let i = 0; i < n; i++) {
    if (isPalindrome[0][i]) {
      dp[i] = 0;
    } else {
      for (let j = 0; j < i; j++) {
        if (isPalindrome[j + 1][i]) {
          dp[i] = Math.min(dp[i], dp[j] + 1);
        }
      }
    }
  }

  return dp[n - 1];
}
```

### 2. Optimized Minimum Cuts (Expand Around Centers)

```typescript
function minCutOptimized(s: string): number {
  const n = s.length;
  const dp: number[] = Array(n)
    .fill(0)
    .map((_, i) => i);

  for (let center = 0; center < n; center++) {
    // Odd length palindromes
    expandAroundCenter(s, dp, center, center);

    // Even length palindromes
    expandAroundCenter(s, dp, center, center + 1);
  }

  return dp[n - 1];
}

function expandAroundCenter(
  s: string,
  dp: number[],
  left: number,
  right: number
): void {
  while (left >= 0 && right < s.length && s[left] === s[right]) {
    if (left === 0) {
      dp[right] = 0;
    } else {
      dp[right] = Math.min(dp[right], dp[left - 1] + 1);
    }
    left--;
    right++;
  }
}
```

### 3. All Palindrome Partitions (Backtracking)

```typescript
function partition(s: string): string[][] {
  const result: string[][] = [];
  const currentPartition: string[] = [];

  // Precompute palindrome table for efficiency
  const isPalindrome = buildPalindromeTable(s);

  backtrack(s, 0, currentPartition, result, isPalindrome);
  return result;
}

function buildPalindromeTable(s: string): boolean[][] {
  const n = s.length;
  const isPalindrome: boolean[][] = Array(n)
    .fill(null)
    .map(() => Array(n).fill(false));

  for (let i = 0; i < n; i++) {
    isPalindrome[i][i] = true;
  }

  for (let length = 2; length <= n; length++) {
    for (let i = 0; i <= n - length; i++) {
      const j = i + length - 1;
      if (s[i] === s[j]) {
        isPalindrome[i][j] = length === 2 || isPalindrome[i + 1][j - 1];
      }
    }
  }

  return isPalindrome;
}

function backtrack(
  s: string,
  start: number,
  currentPartition: string[],
  result: string[][],
  isPalindrome: boolean[][]
): void {
  if (start === s.length) {
    result.push([...currentPartition]);
    return;
  }

  for (let end = start; end < s.length; end++) {
    if (isPalindrome[start][end]) {
      currentPartition.push(s.substring(start, end + 1));
      backtrack(s, end + 1, currentPartition, result, isPalindrome);
      currentPartition.pop();
    }
  }
}
```

### 4. Count All Palindrome Partitions

```typescript
function countPalindromePartitions(s: string): number {
  const n = s.length;
  const isPalindrome = buildPalindromeTable(s);

  // dp[i] = number of ways to partition s[0..i]
  const dp: number[] = Array(n + 1).fill(0);
  dp[0] = 1;

  for (let i = 1; i <= n; i++) {
    for (let j = 0; j < i; j++) {
      if (isPalindrome[j][i - 1]) {
        dp[i] += dp[j];
      }
    }
  }

  return dp[n];
}
```

### 5. Palindrome Partitioning with K Parts

```typescript
function canPartitionKPalindromes(s: string, k: number): boolean {
  const n = s.length;
  if (k > n) return false;
  if (k === n) return true;

  const isPalindrome = buildPalindromeTable(s);

  // dp[i][j] = true if first i characters can be partitioned into j palindromes
  const dp: boolean[][] = Array(n + 1)
    .fill(null)
    .map(() => Array(k + 1).fill(false));

  dp[0][0] = true;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= Math.min(i, k); j++) {
      for (let prev = j - 1; prev < i; prev++) {
        if (dp[prev][j - 1] && isPalindrome[prev][i - 1]) {
          dp[i][j] = true;
          break;
        }
      }
    }
  }

  return dp[n][k];
}
```

## Step-by-Step Example

### String: "aab"

**Palindrome Table:**

```
    a  a  b
a   T  T  F
a   -  T  F
b   -  -  T
```

**Minimum Cuts:**

- Whole string "aab": not palindrome
- Try cuts: "a|ab", "aa|b", "a|a|b"
- "aa|b": "aa" is palindrome, "b" is palindrome → 1 cut
- Result: 1 cut

**All Partitions:**

1. ["a", "a", "b"]
2. ["aa", "b"]

## Advanced Variations

### 1. Minimum Cuts with Custom Cost

```typescript
function minCutWithCost(s: string, costs: number[]): number {
  const n = s.length;
  const isPalindrome = buildPalindromeTable(s);
  const dp: number[] = Array(n).fill(Infinity);

  for (let i = 0; i < n; i++) {
    if (isPalindrome[0][i]) {
      dp[i] = 0;
    } else {
      for (let j = 0; j < i; j++) {
        if (isPalindrome[j + 1][i]) {
          dp[i] = Math.min(dp[i], dp[j] + costs[j]);
        }
      }
    }
  }

  return dp[n - 1];
}
```

### 2. Longest Palindromic Substring Count

```typescript
function longestPalindromePartition(s: string): string[] {
  const n = s.length;
  const isPalindrome = buildPalindromeTable(s);

  // dp[i] = minimum partitions for maximum palindrome length
  const dp: number[] = Array(n).fill(Infinity);
  const parent: number[] = Array(n).fill(-1);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      if (isPalindrome[j][i]) {
        const cost = j === 0 ? 0 : dp[j - 1] + 1;
        if (cost < dp[i]) {
          dp[i] = cost;
          parent[i] = j;
        }
      }
    }
  }

  // Reconstruct partition
  const result: string[] = [];
  let i = n - 1;
  while (i >= 0) {
    const start = parent[i];
    result.unshift(s.substring(start, i + 1));
    i = start - 1;
  }

  return result;
}
```

### 3. Palindrome Partitioning with Forbidden Patterns

```typescript
function partitionWithForbidden(s: string, forbidden: Set<string>): string[][] {
  const result: string[][] = [];
  const currentPartition: string[] = [];
  const isPalindrome = buildPalindromeTable(s);

  function backtrackWithConstraints(start: number): void {
    if (start === s.length) {
      result.push([...currentPartition]);
      return;
    }

    for (let end = start; end < s.length; end++) {
      const substring = s.substring(start, end + 1);

      if (isPalindrome[start][end] && !forbidden.has(substring)) {
        currentPartition.push(substring);
        backtrackWithConstraints(end + 1);
        currentPartition.pop();
      }
    }
  }

  backtrackWithConstraints(0);
  return result;
}
```

## Optimization Techniques

### 1. Manacher's Algorithm Integration

```typescript
function minCutManacher(s: string): number {
  const preprocessed = preprocess(s);
  const palindromeRadii = manacher(preprocessed);

  const n = s.length;
  const dp: number[] = Array(n).fill(n - 1);

  for (let center = 0; center < palindromeRadii.length; center++) {
    const radius = palindromeRadii[center];
    const originalCenter = Math.floor(center / 2);

    for (let r = 0; r <= radius; r++) {
      const left = originalCenter - Math.floor(r / 2);
      const right = originalCenter + Math.floor(r / 2);

      if (left >= 0 && right < n) {
        if (left === 0) {
          dp[right] = 0;
        } else {
          dp[right] = Math.min(dp[right], dp[left - 1] + 1);
        }
      }
    }
  }

  return dp[n - 1];
}

function preprocess(s: string): string {
  return "^#" + s.split("").join("#") + "#$";
}

function manacher(s: string): number[] {
  const n = s.length;
  const palindromeRadii: number[] = Array(n).fill(0);
  let center = 0;
  let rightBoundary = 0;

  for (let i = 1; i < n - 1; i++) {
    const mirror = 2 * center - i;

    if (i < rightBoundary) {
      palindromeRadii[i] = Math.min(rightBoundary - i, palindromeRadii[mirror]);
    }

    while (s[i + palindromeRadii[i] + 1] === s[i - palindromeRadii[i] - 1]) {
      palindromeRadii[i]++;
    }

    if (i + palindromeRadii[i] > rightBoundary) {
      center = i;
      rightBoundary = i + palindromeRadii[i];
    }
  }

  return palindromeRadii;
}
```

## Practice Problems

### LeetCode Problems

- [131. Palindrome Partitioning](https://leetcode.com/problems/palindrome-partitioning/)
- [132. Palindrome Partitioning II](https://leetcode.com/problems/palindrome-partitioning-ii/)
- [1278. Palindrome Partitioning III](https://leetcode.com/problems/palindrome-partitioning-iii/)
- [1745. Palindrome Partitioning IV](https://leetcode.com/problems/palindrome-partitioning-iv/)
- [2472. Maximum Number of Non-overlapping Palindrome Substrings](https://leetcode.com/problems/maximum-number-of-non-overlapping-palindrome-substrings/)

### Test Cases

```typescript
// Test implementations
console.log(minCut("aab")); // 1
console.log(minCut("aba")); // 0
console.log(minCut("abcde")); // 4

console.log(partition("aab")); // [["a","a","b"],["aa","b"]]
console.log(partition("raceacar")); // [["r","a","c","e","a","c","a","r"],["r","a","c","e","aca","r"],["r","a","cec","a","r"],["r","ace","c","a","r"],["race","a","car"],["raceacar"]]

console.log(countPalindromePartitions("aab")); // 2
console.log(canPartitionKPalindromes("abc", 2)); // false
console.log(canPartitionKPalindromes("abccba", 3)); // true
```

## Key Insights

1. **Palindrome Precomputation**: Building the palindrome table once saves repeated checks
2. **DP State Design**: Choose between 1D or 2D based on constraints
3. **Optimization Opportunities**: Expand around centers, Manacher's algorithm
4. **Space-Time Tradeoffs**: Precomputation vs on-the-fly checks

## Applications

- **Text Processing**: Document segmentation, word breaking
- **Bioinformatics**: DNA sequence analysis, gene structure prediction
- **Data Compression**: Palindromic pattern recognition
- **String Algorithms**: Efficient palindrome detection and manipulation

## Related Algorithms

- **Longest Palindromic Substring**: Single palindrome optimization
- **Manacher's Algorithm**: Linear time palindrome detection
- **Edit Distance**: String transformation problems
- **Word Break**: Similar partitioning pattern with different constraints

## Complexity Analysis

| Algorithm      | Time    | Space | Use Case                    |
| -------------- | ------- | ----- | --------------------------- |
| Min Cuts DP    | O(n²)   | O(n²) | Minimum partitions          |
| Expand Centers | O(n²)   | O(n)  | Optimized min cuts          |
| All Partitions | O(n×2ⁿ) | O(n²) | Generate all solutions      |
| K-Partitions   | O(n²k)  | O(nk) | Fixed number of parts       |
| With Manacher  | O(n)    | O(n)  | Linear palindrome detection |
