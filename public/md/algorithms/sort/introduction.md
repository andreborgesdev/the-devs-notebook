# Sorting Algorithms

**Sorting** is the process of arranging elements of a collection in a certain order, typically **ascending** or **descending**.

Sorting is a fundamental operation in computer science because:

- It simplifies searching.
- It optimizes other algorithms (e.g., binary search requires sorted data).
- It organizes data for better readability and processing.

## Why Sorting Matters

- **Efficiency**: Faster sorting often leads to faster overall performance in applications.
- **Simplicity**: Pre-sorted data simplifies complex operations like merging, searching, and analyzing.
- **Interview Essential**: Sorting algorithms frequently appear in interviews, both directly and as parts of larger problems.

## Key Properties of Sorting Algorithms

| Property             | Description                                     |
| -------------------- | ----------------------------------------------- |
| **Time Complexity**  | How the time grows with input size (**Big O**). |
| **Space Complexity** | Extra memory required.                          |
| **Stable**           | Maintains relative order of equal elements.     |
| **In-place**         | Uses only a constant amount of extra memory.    |

## Naively Sorting

If you pass a list that’s **already sorted** to some sorting algorithms, they may still perform all their comparisons and swaps as if the list were unsorted.  
Advanced algorithms like **Timsort** (used by Java’s `Arrays.sort()` for objects and Python’s `sorted()` function) detect this and can avoid unnecessary work, running in **O(n)** instead of **O(n log n)** when the list is already sorted.

## Sorting Algorithm Categories

| Category                 | Description                                                     | Examples                                                       |
| ------------------------ | --------------------------------------------------------------- | -------------------------------------------------------------- |
| **Comparison-Based**     | Elements compared directly to determine order.                  | Bubble Sort, Insertion Sort, Merge Sort, Quick Sort, Heap Sort |
| **Non-Comparison-Based** | Sorts based on other properties (useful for integers, strings). | Counting Sort, Radix Sort, Bucket Sort                         |

## Common Sorting Algorithms

| Algorithm      | Best Time  | Average Time | Worst Time | Space    | Stable |
| -------------- | ---------- | ------------ | ---------- | -------- | ------ |
| Bubble Sort    | O(n)       | O(n²)        | O(n²)      | O(1)     | Yes    |
| Insertion Sort | O(n)       | O(n²)        | O(n²)      | O(1)     | Yes    |
| Merge Sort     | O(n log n) | O(n log n)   | O(n log n) | O(n)     | Yes    |
| Quick Sort     | O(n log n) | O(n log n)   | O(n²)      | O(log n) | No     |
| Heap Sort      | O(n log n) | O(n log n)   | O(n log n) | O(1)     | No     |
| Counting Sort  | O(n + k)   | O(n + k)     | O(n + k)   | O(n + k) | Yes    |

`n` = number of elements  
`k` = range of input values (Counting Sort, Radix Sort)

## Visual Learning Resources

- [Visualgo.net Sorting Visualizations](https://visualgo.net/en/sorting?slide=1)
- [USFCA Comparison Sort Visualization](https://www.cs.usfca.edu/~galles/visualization/ComparisonSort.html)

## Summary

Sorting is essential to many algorithms and real-world applications.  
Understanding the strengths and weaknesses of different sorting algorithms helps you choose the right tool for the job and improves your problem-solving skills — especially important for coding interviews.
