# Selection Sort

**Selection Sort** is a simple **comparison-based sorting algorithm**.  
It divides the input into a **sorted** and an **unsorted** region. In each iteration, it selects the smallest element from the unsorted region and moves it to the end of the sorted region.

## How It Works

1. Start with the entire array as the **unsorted list**.
2. **Find the smallest element** in the unsorted list.
3. Swap it with the **first unsorted element** (expanding the sorted list by one).
4. Repeat for the remaining unsorted elements until the array is sorted.

## Time and Space Complexity

| Case    | Time Complexity |
| ------- | --------------- |
| Best    | O(n²)           |
| Average | O(n²)           |
| Worst   | O(n²)           |

| Space Complexity | O(1) (in-place) |
| ---------------- | --------------- |

**Note**: Selection Sort always performs the same number of comparisons, regardless of input order.

## Example

Initial array:
`64, 25, 12, 22, 11`

### Pass 1:

Find min (11) → Swap with first element.  
`11, 25, 12, 22, 64`

### Pass 2:

Find min (12) → Swap with second element.  
`11, 12, 25, 22, 64`

### Pass 3:

Find min (22) → Swap with third element.  
`11, 12, 22, 25, 64`

### Pass 4:

Find min (25) → Already in place.

Sorted array:
`11, 12, 22, 25, 64`

## Visualizations

![Selection Sort Animation 1](https://res.cloudinary.com/practicaldev/image/fetch/s--musoV4Rk--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/vweh1mcmiap8q3onqxz8.gif)

## Java Example

```java showLineNumbers
import java.util.Arrays;

class SelectionSort {

    void selectionSort(int array[]) {
        int size = array.length;

        for (int step = 0; step < size - 1; step++) {
            int min_idx = step;

            for (int i = step + 1; i < size; i++) {
                // Find the minimum element
                if (array[i] < array[min_idx]) {
                    min_idx = i;
                }
            }

            // Swap the found minimum with the first unsorted element
            int temp = array[step];
            array[step] = array[min_idx];
            array[min_idx] = temp;
        }
    }

    public static void main(String args[]) {
        int[] data = { 20, 12, 10, 15, 2 };
        SelectionSort ss = new SelectionSort();
        ss.selectionSort(data);
        System.out.println("Sorted Array in Ascending Order: ");
        System.out.println(Arrays.toString(data));
    }

}
```

## Advantages

- **Simple** and easy to understand.
- **In-place**: Requires no additional memory.
- **Performs well on small datasets**.

## Disadvantages

- **Inefficient on large datasets**.
- **Not stable**: Equal elements might not maintain their relative order.
- Performs the same number of comparisons regardless of array state.

## Interview Tips

- Know how to **write Selection Sort from scratch**.
- Be ready to explain why it’s **inefficient for large arrays**.
- Understand the difference between **Selection Sort** and **Bubble Sort** (Selection Sort minimizes the number of swaps but does not reduce comparisons).
- Mention that Selection Sort is often considered a **teaching algorithm** to introduce sorting concepts.

## Summary

**Selection Sort** repeatedly selects the minimum element from the unsorted part and places it at the beginning.  
It’s simple but inefficient for large datasets, making it mostly useful for educational purposes or very small arrays.
