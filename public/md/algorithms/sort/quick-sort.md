# Quick Sort

Quick Sort is a highly efficient **divide-and-conquer** sorting algorithm. It works by selecting a **pivot** element and partitioning the array such that:

- Elements **less than the pivot** are placed to the **left**.
- Elements **greater than the pivot** are placed to the **right**.

This process is recursively applied to the left and right subarrays until the entire array is sorted.

## Key Concepts

- **Average Time Complexity**: `O(n log n)`
- **Worst Case Time Complexity**: `O(n²)` (when the smallest or largest element is always picked as pivot)
- **Space Complexity**: `O(log n)` due to recursion stack
- **In-place**: Yes (no need for extra arrays)
- **Stable**: No
- **Faster than Merge Sort in practice** for most inputs, despite the worse worst-case complexity

## Algorithm Steps

1. Choose a pivot element (commonly middle, first, last, or random).
2. Rearrange elements so that:
   - All items < pivot are moved to the left.
   - All items > pivot are moved to the right.
3. Recursively apply the above steps to left and right subarrays.

> **Note**: Pivot selection is crucial. Randomized pivot selection helps avoid the worst-case `O(n²)` time.

## Visualization

![QuickSort Partitioning](https://www.geeksforgeeks.org/wp-content/uploads/gq/2014/01/QuickSort2.png)

## Example: Java Implementation

```java showLineNumbers
void quickSort(int[] arr, int left, int right) {
    int index = partition(arr, left, right);

    if (left < index - 1) {
        quickSort(arr, left, index - 1);  // Sort left half
    }
    if (index < right) {
        quickSort(arr, index, right);     // Sort right half
    }
}

int partition(int[] arr, int left, int right) {
    int pivot = arr[(left + right) / 2];  // Choose middle element as pivot

    while (left <= right) {
        while (arr[left] < pivot) left++;
        while (arr[right] > pivot) right--;

        if (left <= right) {
            swap(arr, left, right);  // Swap elements
            left++;
            right--;
        }
    }
    return left;
}
```

## When to Use Quick Sort

- When average-case performance matters more than worst-case
- When working in memory-constrained environments (it's in-place)
- When data can be randomized to avoid worst-case behavior

## When to Avoid Quick Sort

While Quick Sort performs well on average, there are scenarios where it might not be ideal:

- **Unstable**: It does **not preserve the order** of equal elements.
- **Worst-case `O(n²)`**: Especially when pivot selection is poor (e.g., already sorted arrays).
- **Poor for linked lists**: Linked lists don't support efficient random access; Merge Sort is better suited.

## Interview Tips

Be prepared to explain:

- Why Quick Sort is **fast in practice** despite the `O(n²)` worst-case.
- The importance of **pivot strategy**:
  - First/last/middle element
  - **Random element** _(recommended to avoid worst case)_
  - **Median-of-three**: average of first, middle, and last element
- The **in-place partitioning process**.
- How to **convert it to an iterative version** (with a stack).
- What the **call stack depth** is (up to `O(log n)`).

## In-Place vs Non-In-Place

Quick Sort is typically **in-place**, requiring no extra memory apart from the recursion stack.

> ⚠️ Merge Sort, by comparison, needs `O(n)` additional space.

## Optimizations

- **Tail recursion optimization**:
  - Always recurse on the smaller subarray first to minimize stack depth.
  - Use a loop for the larger half.
- **Switch to Insertion Sort for small partitions** (commonly `n < 10`):
  - Helps reduce overhead and improve cache performance.
- **Hybrid algorithms**:
  - **Introsort** (used in C++ STL): switches to Heap Sort when recursion goes too deep.
  - **Timsort** (used in Python): optimized Merge Sort that handles real-world data more efficiently.

## Test Edge Cases

Make sure your implementation handles:

- An empty array
- An array with a single element
- Already sorted input (ascending/descending)
- Arrays with **many duplicate elements**
- Arrays with **all elements the same**
