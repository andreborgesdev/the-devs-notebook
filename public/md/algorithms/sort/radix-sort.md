# Radix Sort

**Radix Sort** is a **non-comparison sorting algorithm** ideal for sorting integers (and some other data types).  
It works by sorting elements **digit by digit**, starting from the least significant digit (LSD) to the most significant digit (MSD), using a **stable sorting algorithm** (usually Counting Sort) at each digit level.

## Key Concepts

| Property             | Description                                                                |
| -------------------- | -------------------------------------------------------------------------- |
| **Time Complexity**  | O(K \* N), where N is the number of elements and K is the number of digits |
| **Space Complexity** | O(N + K)                                                                   |
| **Stable**           | Yes                                                                        |
| **In-place**         | No (requires auxiliary storage)                                            |

> Unlike comparison-based algorithms (which have a lower bound of O(N log N)), **Radix Sort can achieve linear time** for certain data types.

## How It Works

1. **Find the maximum number** to determine the number of digits (`K`).
2. **Sort the array** starting from the least significant digit (LSD) to the most significant digit (MSD).
3. **Repeat** for each digit using a stable sorting algorithm.

## Example

Unsorted list:
`170, 45, 75, 90, 802, 24, 2, 66`

### Pass 1 (1s place):

`170, 90, 802, 2, 24, 45, 75, 66`

### Pass 2 (10s place):

`802, 2, 24, 45, 66, 170, 75, 90`

### Pass 3 (100s place):

`2, 24, 45, 66, 75, 90, 170, 802`

The array is now sorted.

## Visualization

Imagine the digits of each number in **columns**, and sorting is done **column by column** from right to left.

## Java Example

```java showLineNumbers
import java.util.Arrays;

class RadixSort {

    // Counting sort based on the digit at 'place'
    void countingSort(int[] array, int size, int place) {
        int[] output = new int[size];
        int[] count = new int[10];

        // Count occurrences of digits
        for (int i = 0; i < size; i++) {
            int digit = (array[i] / place) % 10;
            count[digit]++;
        }

        // Calculate cumulative count
        for (int i = 1; i < 10; i++) {
            count[i] += count[i - 1];
        }

        // Build the output array (stable sort)
        for (int i = size - 1; i >= 0; i--) {
            int digit = (array[i] / place) % 10;
            output[count[digit] - 1] = array[i];
            count[digit]--;
        }

        // Copy the sorted values back to the original array
        for (int i = 0; i < size; i++) {
            array[i] = output[i];
        }
    }

    // Main Radix Sort function
    void radixSort(int[] array) {
        int max = getMax(array);

        // Apply counting sort for each digit place
        for (int place = 1; max / place > 0; place *= 10) {
            countingSort(array, array.length, place);
        }
    }

    // Utility to find the maximum value in the array
    int getMax(int[] array) {
        int max = array[0];
        for (int num : array) {
            if (num > max) max = num;
        }
        return max;
    }

    // Test the algorithm
    public static void main(String[] args) {
        int[] data = {121, 432, 564, 23, 1, 45, 788};
        RadixSort sorter = new RadixSort();
        sorter.radixSort(data);
        System.out.println("Sorted Array:");
        System.out.println(Arrays.toString(data));
    }

}
```

## Advantages

- **Linear time** for small ranges of numbers.
- Great for **large datasets of fixed-length keys** (e.g., integers, strings of equal length).
- **Stable sort** — preserves the order of equal elements.

## Disadvantages

- Not comparison-based — **data must be sortable by digits or positions**.
- Requires **extra space** for counting sort.
- Efficiency depends on the number of digits (K).

## Interview Tips

- Be ready to explain **why it’s faster than O(N log N)** for fixed-size digit inputs.
- Understand how **Counting Sort is used as a stable sorter** at each digit level.
- Know when to **prefer Radix Sort over other algorithms**:
  - When working with **large arrays of integers** or **fixed-size strings**.
  - When **constant-time digit access** is possible.

## Summary

**Radix Sort** is a fast, non-comparison-based sorting algorithm that works especially well for integers and other data types with fixed-length representations.  
By processing digits from least to most significant, it avoids the O(N log N) lower bound of comparison sorts and achieves O(K \* N) time.
