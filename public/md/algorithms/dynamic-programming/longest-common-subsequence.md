# Longest Common Subsequence (LCS)

**Longest Common Subsequence (LCS)** is a classic dynamic programming problem that finds the longest subsequence common to two sequences. A subsequence maintains the relative order of elements but doesn't need to be contiguous.

This problem is fundamental in bioinformatics (DNA sequence analysis), version control systems (diff algorithms), and text processing applications.

## Key Concepts

- **Subsequence**: Elements appear in same relative order but not necessarily contiguous
- **Optimal Substructure**: LCS of two strings depends on LCS of their prefixes
- **Overlapping Subproblems**: Same subproblems solved multiple times in recursive approach
- **State Definition**: dp[i][j] = length of LCS of first i characters of X and first j characters of Y

## Time and Space Complexity

| Approach          | Time Complexity | Space Complexity |
| ----------------- | --------------- | ---------------- |
| Recursive (Naive) | O(2^(m+n))      | O(m+n)           |
| Memoization       | O(m × n)        | O(m × n)         |
| Tabulation        | O(m × n)        | O(m × n)         |
| Space Optimized   | O(m × n)        | O(min(m, n))     |

**m** = length of first string, **n** = length of second string

## Problem Formulation

**Input:**

- Two strings X[0..m-1] and Y[0..n-1]

**Output:**

- Length of longest common subsequence
- Optional: The actual LCS string

## Algorithm Approaches

### 1. Recursive Solution

```java showLineNumbers
public class LCSRecursive {

    public static int lcs(String X, String Y, int m, int n) {
        // Base case: if either string is empty
        if (m == 0 || n == 0) {
            return 0;
        }

        // If last characters match
        if (X.charAt(m-1) == Y.charAt(n-1)) {
            return 1 + lcs(X, Y, m-1, n-1);
        }

        // If last characters don't match
        return Math.max(lcs(X, Y, m, n-1), lcs(X, Y, m-1, n));
    }

    public static void demonstrateRecursive() {
        String X = "ABCDGH";
        String Y = "AEDFHR";

        System.out.println("String X: " + X);
        System.out.println("String Y: " + Y);

        int result = lcs(X, Y, X.length(), Y.length());
        System.out.printf("LCS Length (Recursive): %d\n", result);
    }
}
```

### 2. Memoization (Top-Down)

```java showLineNumbers
public class LCSMemoization {
    private static int[][] memo;

    public static int lcs(String X, String Y) {
        int m = X.length();
        int n = Y.length();
        memo = new int[m + 1][n + 1];

        // Initialize memo with -1
        for (int i = 0; i <= m; i++) {
            Arrays.fill(memo[i], -1);
        }

        return lcsHelper(X, Y, m, n);
    }

    private static int lcsHelper(String X, String Y, int m, int n) {
        // Base case
        if (m == 0 || n == 0) {
            return 0;
        }

        // Return memoized result
        if (memo[m][n] != -1) {
            return memo[m][n];
        }

        // If last characters match
        if (X.charAt(m-1) == Y.charAt(n-1)) {
            memo[m][n] = 1 + lcsHelper(X, Y, m-1, n-1);
        } else {
            // If last characters don't match
            memo[m][n] = Math.max(
                lcsHelper(X, Y, m, n-1),
                lcsHelper(X, Y, m-1, n)
            );
        }

        return memo[m][n];
    }

    public static void printMemoTable(String X, String Y) {
        System.out.println("\nMemoization Table:");
        System.out.print("    ");
        for (int j = 0; j < Y.length(); j++) {
            System.out.printf(" %c ", Y.charAt(j));
        }
        System.out.println();

        for (int i = 0; i <= X.length(); i++) {
            if (i == 0) {
                System.out.print("  ");
            } else {
                System.out.printf("%c ", X.charAt(i-1));
            }

            for (int j = 0; j <= Y.length(); j++) {
                if (memo[i][j] == -1) {
                    System.out.print(" - ");
                } else {
                    System.out.printf(" %d ", memo[i][j]);
                }
            }
            System.out.println();
        }
    }
}
```

### 3. Tabulation (Bottom-Up)

```java showLineNumbers
public class LCSTabulation {

    public static int lcs(String X, String Y) {
        int m = X.length();
        int n = Y.length();
        int[][] dp = new int[m + 1][n + 1];

        // Build LCS table bottom-up
        for (int i = 0; i <= m; i++) {
            for (int j = 0; j <= n; j++) {
                if (i == 0 || j == 0) {
                    dp[i][j] = 0;
                } else if (X.charAt(i-1) == Y.charAt(j-1)) {
                    dp[i][j] = dp[i-1][j-1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
                }
            }
        }

        return dp[m][n];
    }

    public static void printDPTable(String X, String Y) {
        int m = X.length();
        int n = Y.length();
        int[][] dp = new int[m + 1][n + 1];

        for (int i = 0; i <= m; i++) {
            for (int j = 0; j <= n; j++) {
                if (i == 0 || j == 0) {
                    dp[i][j] = 0;
                } else if (X.charAt(i-1) == Y.charAt(j-1)) {
                    dp[i][j] = dp[i-1][j-1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
                }
            }
        }

        System.out.println("\nDP Table:");
        System.out.print("      ");
        for (int j = 0; j < n; j++) {
            System.out.printf(" %c ", Y.charAt(j));
        }
        System.out.println();

        for (int i = 0; i <= m; i++) {
            if (i == 0) {
                System.out.print("    ");
            } else {
                System.out.printf(" %c  ", X.charAt(i-1));
            }

            for (int j = 0; j <= n; j++) {
                System.out.printf(" %d ", dp[i][j]);
            }
            System.out.println();
        }
    }

    public static String findLCS(String X, String Y) {
        int m = X.length();
        int n = Y.length();
        int[][] dp = new int[m + 1][n + 1];

        // Build DP table
        for (int i = 0; i <= m; i++) {
            for (int j = 0; j <= n; j++) {
                if (i == 0 || j == 0) {
                    dp[i][j] = 0;
                } else if (X.charAt(i-1) == Y.charAt(j-1)) {
                    dp[i][j] = dp[i-1][j-1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
                }
            }
        }

        // Backtrack to find LCS string
        StringBuilder lcs = new StringBuilder();
        int i = m, j = n;

        while (i > 0 && j > 0) {
            if (X.charAt(i-1) == Y.charAt(j-1)) {
                lcs.append(X.charAt(i-1));
                i--;
                j--;
            } else if (dp[i-1][j] > dp[i][j-1]) {
                i--;
            } else {
                j--;
            }
        }

        return lcs.reverse().toString();
    }
}
```

### 4. Space Optimized Solution

```java showLineNumbers
public class LCSSpaceOptimized {

    public static int lcs(String X, String Y) {
        int m = X.length();
        int n = Y.length();

        // Use only two rows instead of full table
        int[] prev = new int[n + 1];
        int[] curr = new int[n + 1];

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (X.charAt(i-1) == Y.charAt(j-1)) {
                    curr[j] = prev[j-1] + 1;
                } else {
                    curr[j] = Math.max(prev[j], curr[j-1]);
                }
            }

            // Swap rows
            int[] temp = prev;
            prev = curr;
            curr = temp;
            Arrays.fill(curr, 0);
        }

        return prev[n];
    }

    public static int lcsUltraOptimized(String X, String Y) {
        // Ensure Y is the shorter string for better space complexity
        if (X.length() < Y.length()) {
            return lcsUltraOptimized(Y, X);
        }

        int m = X.length();
        int n = Y.length();
        int[] dp = new int[n + 1];

        for (int i = 1; i <= m; i++) {
            int prev = 0;
            for (int j = 1; j <= n; j++) {
                int temp = dp[j];
                if (X.charAt(i-1) == Y.charAt(j-1)) {
                    dp[j] = prev + 1;
                } else {
                    dp[j] = Math.max(dp[j], dp[j-1]);
                }
                prev = temp;
            }
        }

        return dp[n];
    }
}
```

## Example Walkthrough

**Input:**

- X = "ABCDGH"
- Y = "AEDFHR"

### Step-by-Step DP Table Construction

|     |     | A   | E   | D   | F   | H   | R   |
| --- | --- | --- | --- | --- | --- | --- | --- |
|     | 0   | 0   | 0   | 0   | 0   | 0   | 0   |
| A   | 0   | 1   | 1   | 1   | 1   | 1   | 1   |
| B   | 0   | 1   | 1   | 1   | 1   | 1   | 1   |
| C   | 0   | 1   | 1   | 1   | 1   | 1   | 1   |
| D   | 0   | 1   | 1   | 2   | 2   | 2   | 2   |
| G   | 0   | 1   | 1   | 2   | 2   | 2   | 2   |
| H   | 0   | 1   | 1   | 2   | 2   | 3   | 3   |

**LCS Length:** 3  
**LCS String:** "ADH"

## Advanced Implementations

### LCS with Path Tracking

```java showLineNumbers
public class LCSWithPath {

    public static class LCSResult {
        int length;
        String sequence;
        List<String> allLCS;

        LCSResult(int length, String sequence, List<String> allLCS) {
            this.length = length;
            this.sequence = sequence;
            this.allLCS = allLCS;
        }
    }

    public static LCSResult findAllLCS(String X, String Y) {
        int m = X.length();
        int n = Y.length();
        int[][] dp = new int[m + 1][n + 1];

        // Build DP table
        for (int i = 0; i <= m; i++) {
            for (int j = 0; j <= n; j++) {
                if (i == 0 || j == 0) {
                    dp[i][j] = 0;
                } else if (X.charAt(i-1) == Y.charAt(j-1)) {
                    dp[i][j] = dp[i-1][j-1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
                }
            }
        }

        // Find all LCS strings
        Set<String> allLCS = new HashSet<>();
        findAllLCSHelper(X, Y, m, n, dp, "", allLCS);

        return new LCSResult(dp[m][n], allLCS.iterator().next(), new ArrayList<>(allLCS));
    }

    private static void findAllLCSHelper(String X, String Y, int i, int j,
                                       int[][] dp, String current, Set<String> allLCS) {
        if (i == 0 || j == 0) {
            allLCS.add(new StringBuilder(current).reverse().toString());
            return;
        }

        if (X.charAt(i-1) == Y.charAt(j-1)) {
            findAllLCSHelper(X, Y, i-1, j-1, dp, current + X.charAt(i-1), allLCS);
        } else {
            if (dp[i-1][j] >= dp[i][j-1]) {
                findAllLCSHelper(X, Y, i-1, j, dp, current, allLCS);
            }
            if (dp[i][j-1] >= dp[i-1][j]) {
                findAllLCSHelper(X, Y, i, j-1, dp, current, allLCS);
            }
        }
    }
}
```

### LCS for Multiple Strings

```java showLineNumbers
public class LCSMultipleStrings {

    public static int lcs3(String X, String Y, String Z) {
        int m = X.length();
        int n = Y.length();
        int o = Z.length();
        int[][][] dp = new int[m + 1][n + 1][o + 1];

        for (int i = 0; i <= m; i++) {
            for (int j = 0; j <= n; j++) {
                for (int k = 0; k <= o; k++) {
                    if (i == 0 || j == 0 || k == 0) {
                        dp[i][j][k] = 0;
                    } else if (X.charAt(i-1) == Y.charAt(j-1) && Y.charAt(j-1) == Z.charAt(k-1)) {
                        dp[i][j][k] = dp[i-1][j-1][k-1] + 1;
                    } else {
                        dp[i][j][k] = Math.max(Math.max(dp[i-1][j][k], dp[i][j-1][k]), dp[i][j][k-1]);
                    }
                }
            }
        }

        return dp[m][n][o];
    }

    public static int lcsMultiple(String[] strings) {
        if (strings.length == 0) return 0;
        if (strings.length == 1) return strings[0].length();
        if (strings.length == 2) return LCSTabulation.lcs(strings[0], strings[1]);

        // For more than 3 strings, use recursive approach
        // This is exponential but demonstrates the concept
        String result = strings[0];
        for (int i = 1; i < strings.length; i++) {
            result = getLCSString(result, strings[i]);
        }
        return result.length();
    }

    private static String getLCSString(String X, String Y) {
        return LCSTabulation.findLCS(X, Y);
    }
}
```

## Complete Demo Class

```java showLineNumbers
public class LCSDemo {

    public static void main(String[] args) {
        String X = "ABCDGH";
        String Y = "AEDFHR";

        System.out.println("=== Longest Common Subsequence Demo ===");
        System.out.println("String X: " + X);
        System.out.println("String Y: " + Y);
        System.out.println();

        // Recursive solution
        System.out.println("1. Recursive Solution:");
        LCSRecursive.demonstrateRecursive();

        // Memoization solution
        System.out.println("\n2. Memoization Solution:");
        int memoResult = LCSMemoization.lcs(X, Y);
        System.out.printf("LCS Length (Memoization): %d\n", memoResult);
        LCSMemoization.printMemoTable(X, Y);

        // Tabulation solution
        System.out.println("\n3. Tabulation Solution:");
        int tabulationResult = LCSTabulation.lcs(X, Y);
        System.out.printf("LCS Length (Tabulation): %d\n", tabulationResult);
        LCSTabulation.printDPTable(X, Y);

        String lcsString = LCSTabulation.findLCS(X, Y);
        System.out.printf("LCS String: \"%s\"\n", lcsString);

        // Space optimized solution
        System.out.println("\n4. Space Optimized Solution:");
        int spaceOptResult = LCSSpaceOptimized.lcs(X, Y);
        System.out.printf("LCS Length (Space Optimized): %d\n", spaceOptResult);

        int ultraOptResult = LCSSpaceOptimized.lcsUltraOptimized(X, Y);
        System.out.printf("LCS Length (Ultra Optimized): %d\n", ultraOptResult);

        // Find all LCS
        System.out.println("\n5. All Possible LCS:");
        LCSWithPath.LCSResult result = LCSWithPath.findAllLCS(X, Y);
        System.out.printf("LCS Length: %d\n", result.length);
        System.out.println("All possible LCS: " + result.allLCS);

        // Multiple strings
        System.out.println("\n6. LCS of Multiple Strings:");
        String Z = "AEFH";
        int lcs3Result = LCSMultipleStrings.lcs3(X, Y, Z);
        System.out.printf("LCS of \"%s\", \"%s\", \"%s\": %d\n", X, Y, Z, lcs3Result);
    }
}
```

## Applications

### Bioinformatics

- **DNA sequence alignment**
- **Protein sequence comparison**
- **Phylogenetic analysis**
- **Gene prediction**

### Text Processing

- **Diff algorithms** (version control)
- **Plagiarism detection**
- **Text comparison tools**
- **Document similarity**

### Data Compression

- **Pattern detection**
- **Redundancy elimination**
- **Delta encoding**

## Related Problems

### Longest Common Substring

- Must be contiguous
- Different DP recurrence
- Reset to 0 when characters don't match

### Edit Distance (Levenshtein)

- Minimum operations to transform one string to another
- Operations: insert, delete, substitute
- Related to LCS: EditDistance = m + n - 2\*LCS

### Shortest Common Supersequence

- Shortest string that contains both input strings as subsequences
- Length = m + n - LCS(X, Y)

## Interview Tips

### When to Recognize LCS Problems

1. **Comparing sequences** or strings
2. **Finding similarities** between data
3. **Optimization problems** involving order preservation
4. **"Longest/Shortest" with subsequence** constraints

### Key Points to Remember

- **Subsequence vs substring**: Order matters, continuity doesn't
- **State definition**: dp[i][j] represents LCS of first i and j characters
- **Recurrence**: Match → extend LCS; No match → take maximum
- **Space optimization**: Only need previous row

### Common Interview Questions

1. **"Difference between LCS and longest common substring?"**

   - LCS: maintains order, not necessarily contiguous
   - Substring: must be contiguous

2. **"How to find the actual LCS string?"**

   - Backtrack through DP table

3. **"Space optimization strategy?"**
   - Use rolling arrays, only need O(min(m,n)) space

## Common Mistakes

1. **Confusing subsequence with substring**
2. **Wrong indexing** in string comparison
3. **Incorrect base case** handling
4. **Off-by-one errors** in DP table
5. **Inefficient backtracking** for finding LCS string

## Variations and Extensions

### Weighted LCS

- Different weights for different characters
- Maximize total weight instead of length

### LCS with Limited Gaps

- Restrict number of mismatches allowed
- Additional state for gap count

### Approximate LCS

- Allow some errors in matching
- Useful for noisy data comparison

## Practice Problems

### Essential LeetCode Problems

1. **Longest Common Subsequence** (Medium) - Direct application
2. **Edit Distance** (Hard) - Related DP problem
3. **Delete Operation for Two Strings** (Medium) - LCS variant
4. **Shortest Common Supersequence** (Hard) - Advanced LCS

### Advanced Applications

- **Longest Palindromic Subsequence** - LCS with reverse
- **Minimum ASCII Delete Sum** - Weighted LCS variant
- **Uncrossed Lines** - LCS with visualization
- **Maximum Length of Repeated Subarray** - LCS variant for arrays

### Real-world Systems

- **Git diff algorithms**
- **Genome sequencing tools**
- **Document comparison systems**
- **Code plagiarism detectors**
