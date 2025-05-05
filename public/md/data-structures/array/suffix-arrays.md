# Suffix Arrays

A **Suffix Array (SA)** is an array of the starting positions of all the **sorted suffixes** of a string.  
It provides a **space-efficient alternative to suffix trees** (which themselves are compressed Tries).

| Term             | Definition                                                                                                                   |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Suffix**       | A non-empty substring at the end of a string. Example: S = "banana", suffixes → "banana", "anana", "nana", "ana", "na", "a". |
| **Suffix Array** | An array storing the starting indices of all sorted suffixes.                                                                |

**Note**:  
A **Suffix Array + Longest Common Prefix (LCP) array** can do everything a suffix tree can, often more efficiently in practice.

## Why Use Suffix Arrays?

- **Efficient pattern matching**.
- **Space-saving** vs suffix trees.
- Crucial in **bioinformatics**, **data compression**, **plagiarism detection**, and **search engines**.
- Solves problems like:
  - **Longest Common Substring (LCS)**.
  - **Longest Repeated Substring (LRS)**.
  - **Pattern matching** (like fast search).

## How Suffix Arrays Work

Given `S = "banana"`:

| Suffix   | Starting index |
| -------- | -------------- |
| "a"      | 5              |
| "ana"    | 3              |
| "anana"  | 1              |
| "banana" | 0              |
| "na"     | 4              |
| "nana"   | 2              |

**Suffix Array** = [5, 3, 1, 0, 4, 2]

The **Suffix Array** contains the starting indices of the lexicographically sorted suffixes.

## Longest Common Prefix (LCP) Array

An auxiliary array that stores the length of the longest common prefix between consecutive suffixes in the Suffix Array.

Used to answer substring queries efficiently.

## Key Applications

### Longest Common Substring (LCS)

**Problem**: Find the longest common substring shared among `k` strings.

**Approach**:

1. Concatenate the `k` strings into a single string `T` using unique **sentinels** (characters not found in the strings) to separate them.  
   Example: `T = S1 + "#" + S2 + "$" + S3 + "%"`.
2. Build the **Suffix Array** and **LCP array** for `T`.
3. Slide a window over the Suffix Array to find ranges containing suffixes from at least `k` different strings (**suffix colors**).
4. For each window, query the minimum LCP value → the largest among these is the **LCS** length.

**Complexity**:

- Total time → **O(n1 + n2 + ... + nk)** (linear in total string length).
- Alternatively, using a segment tree → **O(n log n)**.

### Longest Repeated Substring (LRS)

**Problem**: Find the longest substring that repeats within the same string.

**Approach**:

1. Build the **Suffix Array** and **LCP array**.
2. The **maximum LCP value** is the length of the longest repeated substring.

## Suffix Array vs Suffix Tree

| Feature           | Suffix Array                                                                             | Suffix Tree                                                       |
| ----------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Space             | Lower                                                                                    | Higher                                                            |
| Construction time | O(n log n)                                                                               | O(n)                                                              |
| Supports LCP      | With additional LCP array                                                                | Yes                                                               |
| Practical use     | Preferred in many applications due to better space efficiency and simpler implementation | Used for advanced substring matching and theoretical applications |

## Interview Tips

- Understand the **concept of sorted suffixes and their indices**.
- Know how to **build a suffix array** (at least conceptually — building in O(n log n) can be complex to implement from scratch).
- Be familiar with the **LCP array** and why it’s essential for solving **LCS** and **LRS**.
- Be ready to explain the **sliding window technique** for multi-string LCS problems.
- Understand when a **segment tree** or other range query data structure might be used alongside Suffix Arrays.

## Summary

A **Suffix Array** provides a compact, efficient way to perform complex substring operations.  
With an **LCP array**, it can efficiently handle tasks like **Longest Common Substring** and **Longest Repeated Substring** problems — crucial for text processing, data compression, and bioinformatics.
