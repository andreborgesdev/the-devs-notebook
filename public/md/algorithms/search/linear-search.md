# Linear Search

**Linear Search** (also called **sequential search**) is the simplest searching algorithm.  
It checks each element of a collection one by one until the target element is found or the collection ends.

## Key Concepts

- **No requirement for sorted data**.
- Checks **each element in sequence**.
- Stops when the target is found or all elements have been checked.

## Time and Space Complexity

|              | Complexity                               |
| ------------ | ---------------------------------------- |
| Best Case    | O(1) (if the target is at the beginning) |
| Average Case | O(n)                                     |
| Worst Case   | O(n)                                     |
| Space        | O(1)                                     |

**Note:**  
Each individual comparison is **O(1)** time → total time depends linearly on the number of elements.

## Java Example

```java showLineNumbers
public int linearSearch(int[] nums, int target) {
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] == target) {
            return i; // Target found at index i
        }
    }
    return -1; // Target not found
}
```

## When to Use Linear Search

- When the **array is unsorted**.
- When the **collection is small**.
- When performing a **single search** where the overhead of sorting or binary search is not justified.
- When working with **linked lists** or other data structures that don’t support random access.

## Advantages

- **Simple to implement**.
- **No sorting** or preprocessing required.
- **Works on any data structure** that supports sequential access.

## Disadvantages

- **Inefficient** for large datasets.
- Time grows **linearly** with the number of elements.

## Common Mistakes

- Forgetting to handle the case where the target is not found.
- Not considering early termination if the target is found early (for certain implementations).

## Comparison to Other Searches

| Algorithm     | Sorted Data Required      | Average Time Complexity |
| ------------- | ------------------------- | ----------------------- |
| Linear Search | No                        | O(n)                    |
| Binary Search | Yes                       | O(log n)                |
| Hash Lookup   | No (but hashing required) | O(1) (average)          |

## Interview Tip

Linear search is **rarely optimal** for large collections but:

- It’s useful in **simple problems**.
- Serves as a **baseline** before optimizing with binary search, hash tables, or other advanced methods.
- Often used as a **fallback** method or initial brute-force solution.
