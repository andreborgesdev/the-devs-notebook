# Merge Sort

**Merge Sort** is a **divide and conquer** algorithm that divides the array into halves, sorts each half, and then merges them back together. The **merge** step does the heavy lifting by combining sorted subarrays into a sorted whole.

## How It Works

1. **Divide** the array into two halves.
2. **Recursively sort** each half.
3. **Merge** the two sorted halves.

This process continues until you’re merging two single-element arrays.

## Time and Space Complexity

| Case    | Time Complexity |
| ------- | --------------- |
| Best    | O(n log n)      |
| Average | O(n log n)      |
| Worst   | O(n log n)      |

| Space Complexity | O(n) |
| ---------------- | ---- |

**Why O(n log n)?**

- **log n** → Number of times the array is split.
- **n** → Work done during each merge step.

## Key Characteristics

- **Stable** sort.
- **Not in-place** (requires additional space for merging).
- Works similarly to **binary search** in how it splits the array.

## Visualization

![Merge Sort Animation](https://res.cloudinary.com/practicaldev/image/fetch/s--A-kq2byS--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/xokw1fxci67ttscu23vy.gif)

## Java Example

```java showLineNumbers
public class MergeSort {

    public static void mergesort(int[] array) {
        int[] helper = new int[array.length];
        mergesort(array, helper, 0, array.length - 1);
    }

    private static void mergesort(int[] array, int[] helper, int low, int high) {
        if (low < high) {
            int middle = (low + high) / 2;
            mergesort(array, helper, low, middle);          // Sort left half
            mergesort(array, helper, middle + 1, high);     // Sort right half
            merge(array, helper, low, middle, high);        // Merge them
        }
    }

    private static void merge(int[] array, int[] helper, int low, int middle, int high) {
        // Copy both halves into the helper array
        for (int i = low; i <= high; i++) {
            helper[i] = array[i];
        }

        int helperLeft = low;
        int helperRight = middle + 1;
        int current = low;

        // Compare and copy the smaller element from each half into the original array
        while (helperLeft <= middle && helperRight <= high) {
            if (helper[helperLeft] <= helper[helperRight]) {
                array[current] = helper[helperLeft];
                helperLeft++;
            } else {
                array[current] = helper[helperRight];
                helperRight++;
            }
            current++;
        }

        // Copy the rest of the left side into the target array
        int remaining = middle - helperLeft;
        for (int i = 0; i <= remaining; i++) {
            array[current + i] = helper[helperLeft + i];
        }
        // No need to copy the right half — it's already in place
    }

    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        mergesort(arr);
        System.out.println("Sorted array:");
        for (int num : arr) {
            System.out.print(num + " ");
        }
    }

}
```

## Why We Don’t Copy the Right Half at the End

When merging, once the smaller elements are copied from the left half, the remaining elements in the right half are **already in the correct position** in both the helper and target arrays. No additional copying is needed.

## Advantages

- **Consistent O(n log n)** time complexity.
- Performs well on large datasets.
- **Stable** (preserves order of equal elements).
- Predictable performance — worst case is the same as the average case.

## Disadvantages

- Requires **extra memory** (O(n) space).
- Not in-place.
- Usually slower than in-place algorithms like Quick Sort for small datasets.

## Interview Tips

- Know the **divide and conquer strategy**.
- Be able to write the recursive Merge Sort algorithm.
- Understand the **merge step** thoroughly.
- Mention that it’s often used in **external sorting** (sorting data too large to fit into memory).

## Summary

**Merge Sort** is a reliable, stable, divide and conquer sorting algorithm with **O(n log n)** time in all cases. It divides the data into smaller parts, sorts them, and merges them back into a sorted array. Its extra space requirement is the primary trade-off for its predictability and performance.
