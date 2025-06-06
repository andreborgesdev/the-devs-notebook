# Heap Sort

**Heap Sort** is a comparison-based sorting algorithm that uses a **binary heap** data structure. It's known for its **O(n log n)** time complexity in all cases and **O(1)** space complexity, making it one of the most reliable sorting algorithms.

## Key Concepts

- **Max Heap**: Parent nodes are greater than or equal to their children
- **Min Heap**: Parent nodes are less than or equal to their children
- **Heapify**: Process of maintaining heap property
- **Complete Binary Tree**: All levels filled except possibly the last level

## How It Works

1. **Build a Max Heap** from the input array
2. **Extract the maximum** (root) and place it at the end
3. **Reduce heap size** by 1 and **heapify** the root
4. **Repeat** until heap size becomes 1

## Time and Space Complexity

| Case    | Time Complexity |
| ------- | --------------- |
| Best    | O(n log n)      |
| Average | O(n log n)      |
| Worst   | O(n log n)      |

| Space Complexity | O(1) (in-place) |
| ---------------- | --------------- |

## Visualization

```
Initial Array: [4, 10, 3, 5, 1]

Step 1: Build Max Heap
       10
      /  \
     5    3
    / \
   4   1

Step 2: Extract max (10), place at end
Array: [5, 4, 3, 1, 10]

Step 3: Heapify and extract max (5)
Array: [4, 1, 3, 5, 10]

Continue until sorted: [1, 3, 4, 5, 10]
```

## Java Implementation

```java showLineNumbers
public class HeapSort {

    public static void heapSort(int[] arr) {
        int n = arr.length;

        // Build max heap
        for (int i = n / 2 - 1; i >= 0; i--) {
            heapify(arr, n, i);
        }

        // Extract elements from heap one by one
        for (int i = n - 1; i > 0; i--) {
            // Move current root to end
            swap(arr, 0, i);

            // Call heapify on the reduced heap
            heapify(arr, i, 0);
        }
    }

    private static void heapify(int[] arr, int n, int i) {
        int largest = i; // Initialize largest as root
        int left = 2 * i + 1;
        int right = 2 * i + 2;

        // If left child is larger than root
        if (left < n && arr[left] > arr[largest]) {
            largest = left;
        }

        // If right child is larger than largest so far
        if (right < n && arr[right] > arr[largest]) {
            largest = right;
        }

        // If largest is not root
        if (largest != i) {
            swap(arr, i, largest);
            // Recursively heapify the affected sub-tree
            heapify(arr, n, largest);
        }
    }

    private static void swap(int[] arr, int i, int j) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    public static void main(String[] args) {
        int[] arr = {12, 11, 13, 5, 6, 7};
        heapSort(arr);

        System.out.println("Sorted array:");
        for (int value : arr) {
            System.out.print(value + " ");
        }
    }
}
```

## Array Representation of Heap

For any element at index `i`:

- **Left child**: `2*i + 1`
- **Right child**: `2*i + 2`
- **Parent**: `(i-1)/2`

## Advantages

- **Guaranteed O(n log n)** time complexity
- **In-place sorting** (O(1) space)
- **Not affected by input distribution**
- **Stable performance** across all cases

## Disadvantages

- **Not stable** (equal elements may change relative order)
- **Poor cache performance** due to non-sequential access
- **Slower than Quick Sort** in practice for average cases

## Interview Tips

- Understand the **heap property** and **heapify process**
- Know how to **build a heap** in O(n) time vs O(n log n)
- Be able to explain why it's **O(n log n)** in all cases
- Mention **applications**: priority queues, top-K problems
- Compare with other **O(n log n)** algorithms like Merge Sort

## When to Use Heap Sort

- When you need **guaranteed O(n log n)** performance
- When **memory is limited** (in-place sorting)
- When **worst-case performance** matters more than average case
- For **embedded systems** where predictable performance is crucial

## Applications

- **Operating system scheduling**
- **Priority queue implementation**
- **Top-K elements problems**
- **External sorting** for large datasets
- **Real-time systems** requiring predictable performance

## Summary

**Heap Sort** provides reliable O(n log n) performance in all cases with minimal space requirements. While not the fastest in practice, its consistency and in-place nature make it valuable for systems where predictable performance is crucial.
