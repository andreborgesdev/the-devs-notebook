# Insertion Sort

**Insertion Sort** is a simple comparison-based sorting algorithm that builds the final sorted array **one item at a time**. It is intuitive and easy to implement, often used for small datasets or nearly sorted arrays.

## How It Works

1. **Assume** the first element is already sorted.
2. For each subsequent element:
   - Compare it to the elements before it.
   - Shift larger elements one position to the right.
   - **Insert** the current element into its correct position.
3. Repeat until the entire array is sorted.

## Time and Space Complexity

| Case    | Time Complexity                         |
| ------- | --------------------------------------- |
| Best    | O(n) (when the array is already sorted) |
| Average | O(n²)                                   |
| Worst   | O(n²)                                   |

| Space Complexity | O(1) (in-place) |
| ---------------- | --------------- |

## Visualization

![Insertion Sort Diagram](https://res.cloudinary.com/practicaldev/image/fetch/s--98gGOQtF--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/kdcqz1o3weeqjxwcdfpq.png)

## Java Example

```java showLineNumbers
public class InsertionSort {

    static void insertionSort(int[] arr) {
        int n = arr.length;

        for (int i = 1; i < n; i++) {
            int key = arr[i];
            int j = i - 1;

            // Move elements greater than key to one position ahead
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j = j - 1;
            }
            arr[j + 1] = key;
        }
    }

    public static void main(String[] args) {
        int[] arr = { 12, 11, 13, 5, 6 };
        insertionSort(arr);
        System.out.println("Sorted array:");
        for (int num : arr) {
            System.out.print(num + " ");
        }
    }

}
```

## Advantages

- **Simple** to understand and implement.
- **Efficient** for small or nearly sorted datasets.
- **Stable** sorting algorithm (preserves the order of equal elements).
- **In-place** (no extra memory required).

## Disadvantages

- Inefficient for large datasets (**O(n²)** time in the worst case).

## Interview Tips

- Be able to **code it from scratch** quickly.
- Know why it’s good for **small or nearly sorted arrays**.
- Understand how the shifting process works compared to swapping in other algorithms.
- Mention its use as a **helper algorithm** inside more complex sorts like **Bucket Sort** (for sorting individual buckets efficiently).

## Summary

**Insertion Sort** builds the sorted array one element at a time by inserting each new element into its proper position.  
It is efficient for small or nearly sorted datasets and provides a solid introduction to sorting algorithms and algorithmic thinking.
