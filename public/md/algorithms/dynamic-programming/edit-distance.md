# Edit Distance (Levenshtein Distance)

The **Edit Distance** (also known as Levenshtein Distance) is the minimum number of single-character edits (insertions, deletions, or substitutions) required to change one string into another.

## Problem Statement

Given two strings `word1` and `word2`, return the minimum number of operations required to convert `word1` to `word2`.

You have the following three operations permitted on a word:

- Insert a character
- Delete a character
- Replace a character

## Algorithm Overview

This is a classic **Dynamic Programming** problem where we build a 2D table to store the minimum edit distance between all prefixes of the two strings.

### Time Complexity: O(m × n)

### Space Complexity: O(m × n) or O(min(m, n)) with optimization

## Implementation

### Basic DP Solution

```typescript
function minDistance(word1: string, word2: string): number {
  const m = word1.length;
  const n = word2.length;

  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;
  }

  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] =
          1 +
          Math.min(
            dp[i - 1][j], // deletion
            dp[i][j - 1], // insertion
            dp[i - 1][j - 1] // substitution
          );
      }
    }
  }

  return dp[m][n];
}
```

### Space-Optimized Solution

```typescript
function minDistanceOptimized(word1: string, word2: string): number {
  const m = word1.length;
  const n = word2.length;

  if (m < n) {
    return minDistanceOptimized(word2, word1);
  }

  let prev: number[] = Array(n + 1)
    .fill(0)
    .map((_, i) => i);

  for (let i = 1; i <= m; i++) {
    const curr: number[] = Array(n + 1).fill(0);
    curr[0] = i;

    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        curr[j] = prev[j - 1];
      } else {
        curr[j] = 1 + Math.min(prev[j], curr[j - 1], prev[j - 1]);
      }
    }

    prev = curr;
  }

  return prev[n];
}
```

## Step-by-Step Example

Converting "horse" to "ros":

```
    ""  r   o   s
""   0   1   2   3
h    1   1   2   3
o    2   2   1   2
r    3   2   2   2
s    4   3   3   2
e    5   4   4   3
```

**Operations:**

1. Replace 'h' with 'r' → "rorse"
2. Delete 'r' → "rose"
3. Delete 'e' → "ros"

**Result: 3 operations**

## Variations

### 1. Edit Distance with Custom Costs

```typescript
function minDistanceWithCosts(
  word1: string,
  word2: string,
  insertCost: number = 1,
  deleteCost: number = 1,
  replaceCost: number = 1
): number {
  const m = word1.length;
  const n = word2.length;

  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) {
    dp[i][0] = i * deleteCost;
  }

  for (let j = 0; j <= n; j++) {
    dp[0][j] = j * insertCost;
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + deleteCost,
          dp[i][j - 1] + insertCost,
          dp[i - 1][j - 1] + replaceCost
        );
      }
    }
  }

  return dp[m][n];
}
```

### 2. Edit Distance with Operation Tracking

```typescript
interface EditOperation {
  type: "insert" | "delete" | "replace" | "match";
  char?: string;
  position: number;
}

function minDistanceWithOperations(
  word1: string,
  word2: string
): {
  distance: number;
  operations: EditOperation[];
} {
  const m = word1.length;
  const n = word2.length;

  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  const operations: EditOperation[] = [];
  let i = m,
    j = n;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && word1[i - 1] === word2[j - 1]) {
      operations.unshift({ type: "match", position: i - 1 });
      i--;
      j--;
    } else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
      operations.unshift({
        type: "replace",
        char: word2[j - 1],
        position: i - 1,
      });
      i--;
      j--;
    } else if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
      operations.unshift({ type: "delete", position: i - 1 });
      i--;
    } else {
      operations.unshift({
        type: "insert",
        char: word2[j - 1],
        position: i,
      });
      j--;
    }
  }

  return { distance: dp[m][n], operations };
}
```

## Practice Problems

### LeetCode Problems

- [72. Edit Distance](https://leetcode.com/problems/edit-distance/)
- [161. One Edit Distance](https://leetcode.com/problems/one-edit-distance/)
- [583. Delete Operation for Two Strings](https://leetcode.com/problems/delete-operation-for-two-strings/)
- [712. Minimum ASCII Delete Sum for Two Strings](https://leetcode.com/problems/minimum-ascii-delete-sum-for-two-strings/)

### Test Cases

```typescript
// Test the implementation
console.log(minDistance("horse", "ros")); // 3
console.log(minDistance("intention", "execution")); // 5
console.log(minDistance("", "abc")); // 3
console.log(minDistance("abc", "")); // 3
console.log(minDistance("same", "same")); // 0
```

## Key Insights

1. **Base Cases**: Empty string to any string requires insertions equal to target length
2. **Recurrence**: If characters match, no operation needed; otherwise, try all three operations
3. **Optimization**: Can reduce space to O(min(m,n)) by using only two rows
4. **Applications**: Spell checkers, DNA sequence alignment, version control systems

## Related Algorithms

- **Longest Common Subsequence (LCS)**: `EditDistance = m + n - 2 * LCS`
- **Hamming Distance**: Edit distance for strings of equal length with only substitutions
- **Damerau-Levenshtein Distance**: Includes transposition operations
