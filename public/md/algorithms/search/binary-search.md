# Binary Search

**Binary Search** is an efficient algorithm for finding an element in a **sorted array** by repeatedly dividing the search interval in half.

It eliminates half of the remaining elements at each step, reducing the time complexity significantly.

## Time and Space Complexity

|       | Complexity                                             |
| ----- | ------------------------------------------------------ |
| Time  | O(log n)                                               |
| Space | O(1) iterative, O(log n) recursive (due to call stack) |

## Key Concept

At each iteration:

1. Compute the **middle index**.
2. Compare the middle element with the target.
3. If the middle element is the target → done.
4. Otherwise, **discard** the half where the target cannot lie and continue searching.

## Visual Reference

![binary-search](../../images/binary-search.gif)

## Example (Iterative - Upper Mid)

```java showLineNumbers
public int binarySearch(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo + 1) / 2; // upper mid
        if (target < nums[mid]) {
            hi = mid - 1;
        } else {
            lo = mid;
        }
    }
    return (nums[lo] == target) ? lo : -1;
}
```

## Core Principles

### 1. Initialize Boundaries

```java showLineNumbers
int lo = 0;
int hi = nums.length - 1;
```

**Both boundaries must include all valid positions** where the target could be.

### 2. Safe `mid` Calculation

```java showLineNumbers
int mid = lo + (hi - lo) / 2;       // Lower mid
int mid = lo + (hi - lo + 1) / 2;   // Upper mid
```

Avoid `mid = (lo + hi) / 2` to prevent **integer overflow**.

### 3. Shrink the Search Space

Two main patterns:

**Option A (exclude `mid` when moving left):**

```java showLineNumbers
if (target < nums[mid]) {
    hi = mid - 1;
} else {
    lo = mid;
}
```

**Option B (exclude `mid` when moving right):**

```java showLineNumbers
if (target > nums[mid]) {
    lo = mid + 1;
} else {
    hi = mid;
}
```

Pick **one strategy** and be consistent.

### 4. Loop Condition

```java showLineNumbers
while (lo < hi)
```

This ensures the loop terminates when `lo == hi`, leaving only one element to check.

## Common Mistakes

- Using `<=` in the loop and mishandling boundary conditions.
- Infinite loops from wrong `mid` calculation or boundary updates.
- Forgetting to check the last element (`nums[lo]`) after the loop ends.
- Applying binary search on **unsorted arrays**.

## Binary Search Pattern (Robust)

1. Initialize `lo` and `hi` to include **all possible answers**.
2. Use safe `mid` calculation.
3. Write boundary updates that **guarantee the search space shrinks**.
4. Exclude the `mid` from at least one side to avoid infinite loops.
5. Always handle the **two-element case** properly.

## When to Use Binary Search

- Searching for an element in a sorted array.
- Searching for the **first/last occurrence** of an element.
- Finding an **insert position**.
- Optimization problems with a **monotonic condition** (e.g., "minimum k such that...").
- Solving problems on sorted 2D matrices or rotated sorted arrays.

## Recursive Version Example

```java showLineNumbers
public int binarySearchRecursive(int[] nums, int target, int lo, int hi) {
if (lo > hi) return -1;

    int mid = lo + (hi - lo) / 2;

    if (nums[mid] == target) return mid;
    else if (target < nums[mid])
        return binarySearchRecursive(nums, target, lo, mid - 1);
    else
        return binarySearchRecursive(nums, target, mid + 1, hi);

}
```

## Summary Cheatsheet

| Concept         | Best Practice                           |
| --------------- | --------------------------------------- |
| Input           | Must be sorted                          |
| Boundaries      | Include all possible answers            |
| Mid calculation | `lo + (hi - lo) / 2` or with `+1`       |
| Loop condition  | `while (lo < hi)`                       |
| Progress        | Update `lo` or `hi` to ensure shrinking |
| Final return    | Check `nums[lo]` if target found        |

**Pro Tip:**  
Binary Search seems simple but is easy to break. Consistent patterns and testing edge cases (e.g., empty array, single element, two elements) are critical for correctness.
