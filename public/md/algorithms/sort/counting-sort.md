# Counting Sort

**Counting Sort** is a **non-comparison-based** sorting algorithm that works by counting the occurrences of each distinct element. It's particularly efficient when the **range of input values (k) is small** compared to the number of elements (n).

## Key Concepts

- **Non-comparison based**: Doesn't compare elements directly
- **Integer sorting**: Works best with integers or objects with integer keys
- **Range dependency**: Efficiency depends on the range of values
- **Stable algorithm**: Maintains relative order of equal elements

## How It Works

1. **Find the range** of input values (min to max)
2. **Count occurrences** of each value
3. **Calculate cumulative counts** for positioning
4. **Build output array** using cumulative counts
5. **Copy back** to original array

## Time and Space Complexity

| Case    | Time Complexity |
| ------- | --------------- |
| Best    | O(n + k)        |
| Average | O(n + k)        |
| Worst   | O(n + k)        |

| Space Complexity | O(k) |
| ---------------- | ---- |

Where:

- **n** = number of elements
- **k** = range of input values

## Visualization

```
Input Array: [4, 2, 2, 8, 3, 3, 1]
Range: 1 to 8 (k = 8)

Step 1: Count occurrences
Count: [0, 1, 2, 2, 1, 0, 0, 0, 1]
Index:  0  1  2  3  4  5  6  7  8

Step 2: Cumulative count
Count: [0, 1, 3, 5, 6, 6, 6, 6, 7]

Step 3: Place elements in output
Output: [1, 2, 2, 3, 3, 4, 8]
```

## Java Implementation

```java showLineNumbers
import java.util.Arrays;

public class CountingSort {

    public static void countingSort(int[] arr) {
        if (arr.length <= 1) return;

        // Find the range of input
        int max = Arrays.stream(arr).max().orElse(0);
        int min = Arrays.stream(arr).min().orElse(0);
        int range = max - min + 1;

        // Count array to store count of each element
        int[] count = new int[range];
        int[] output = new int[arr.length];

        // Store count of each element
        for (int value : arr) {
            count[value - min]++;
        }

        // Calculate cumulative count
        for (int i = 1; i < range; i++) {
            count[i] += count[i - 1];
        }

        // Build output array (traverse from right to maintain stability)
        for (int i = arr.length - 1; i >= 0; i--) {
            output[count[arr[i] - min] - 1] = arr[i];
            count[arr[i] - min]--;
        }

        // Copy output array to original array
        System.arraycopy(output, 0, arr, 0, arr.length);
    }

    // Simplified version for non-negative integers
    public static void countingSortSimple(int[] arr) {
        if (arr.length <= 1) return;

        int max = Arrays.stream(arr).max().orElse(0);
        int[] count = new int[max + 1];

        // Count occurrences
        for (int value : arr) {
            count[value]++;
        }

        // Reconstruct array
        int index = 0;
        for (int i = 0; i <= max; i++) {
            while (count[i]-- > 0) {
                arr[index++] = i;
            }
        }
    }

    public static void main(String[] args) {
        int[] arr = {4, 2, 2, 8, 3, 3, 1};
        System.out.println("Original: " + Arrays.toString(arr));

        countingSort(arr);
        System.out.println("Sorted: " + Arrays.toString(arr));
    }
}
```

## Variations

### Modified for Negative Numbers

```java showLineNumbers
public static void countingSortWithNegatives(int[] arr) {
    if (arr.length <= 1) return;

    int max = Arrays.stream(arr).max().orElse(0);
    int min = Arrays.stream(arr).min().orElse(0);
    int range = max - min + 1;

    int[] count = new int[range];

    // Count with offset for negative numbers
    for (int value : arr) {
        count[value - min]++;
    }

    // Reconstruct
    int index = 0;
    for (int i = 0; i < range; i++) {
        while (count[i]-- > 0) {
            arr[index++] = i + min;
        }
    }
}
```

## Advantages

- **Linear time** when k = O(n)
- **Stable sorting** algorithm
- **Simple to implement** and understand
- **Efficient** for small ranges of integers
- **No comparisons** needed

## Disadvantages

- **Large space complexity** when k >> n
- **Only works with integers** or objects with integer keys
- **Inefficient** when range is much larger than array size
- **Not suitable** for floating-point numbers or strings

## Interview Tips

- Explain why it's **faster than O(n log n)** comparison sorts
- Understand the **trade-off between time and space**
- Know when **NOT to use** counting sort (large ranges)
- Mention **applications**: histogram generation, bucket sort
- Be ready to handle **negative numbers** and **stability**

## When to Use Counting Sort

✅ **Good for:**

- Small range of integers (k ≤ n)
- Frequency counting problems
- Preprocessing for radix sort
- When stability is required

❌ **Avoid when:**

- Range is much larger than array size
- Working with floating-point numbers
- Memory is very limited
- Input contains arbitrary objects

## Applications

- **Histogram generation**
- **Bucket sort preprocessing**
- **Radix sort digit sorting**
- **Grade distribution analysis**
- **Character frequency counting**

## Comparison with Other Algorithms

| Algorithm     | Time Complexity | Space | Stable | Use Case                    |
| ------------- | --------------- | ----- | ------ | --------------------------- |
| Counting Sort | O(n + k)        | O(k)  | Yes    | Small integer ranges        |
| Radix Sort    | O(d(n + k))     | O(k)  | Yes    | Multi-digit integers        |
| Quick Sort    | O(n log n)      | O(1)  | No     | General purpose, large data |
| Merge Sort    | O(n log n)      | O(n)  | Yes    | Stable, predictable         |

## Summary

**Counting Sort** excels when sorting integers within a small range, achieving linear time complexity. It's the foundation for more complex algorithms like Radix Sort and is essential for understanding non-comparison-based sorting techniques.
