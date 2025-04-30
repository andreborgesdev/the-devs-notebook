# Binary Search

Binary Search is an efficient algorithm for finding an element in a **sorted array** by repeatedly dividing the search interval in half.

- **Time Complexity**: O(log n)
- **Space Complexity**: O(1) (iterative), O(log n) (recursive)

## Key Concept

At each step:

1. Compute the middle index.
2. Compare the middle element with the target.
3. Discard the half where the target cannot lie.

## Visual Reference

![binary-search](../../images/binary-search.gif)

## Example

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

### 1. Initialize the Boundaries

```java showLineNumbers
int lo = 0;
int hi = nums.length - 1;
```

The search boundary must include **all valid positions** where the target could be.

### 2. Safe `mid` Calculation

```java showLineNumbers
int mid = lo + (hi - lo) / 2;       // Left (lower) mid
int mid = lo + (hi - lo + 1) / 2;   // Right (upper) mid
```

Avoid `(lo + hi) / 2` to prevent potential integer overflow.

### 3. Shrink the Search Space

Two equivalent and valid patterns:

**Option A: Exclude `mid` when going left**

```java showLineNumbers
if (target < nums[mid]) {
    hi = mid - 1;
} else {
    lo = mid;
}
```

**Option B: Exclude `mid` when going right**

```java showLineNumbers
if (target > nums[mid]) {
    lo = mid + 1;
} else {
    hi = mid;
}
```

Choose one and be consistent.

### 4. Loop Condition

```java showLineNumbers
while (lo < hi)
```

This ensures the loop exits when `lo == hi`, leaving a single element to inspect.

## Common Mistakes

- Using `<=` or inconsistent boundaries, leading to off-by-one errors.
- Infinite loops from incorrect `mid` calculation and update logic.
- Misunderstanding when `lo` or `hi` should be returned.
- Forgetting that the array must be **sorted**.

## The Pattern (for Robust Binary Search)

1. Start with `lo = 0` and `hi = nums.length - 1` (or `hi = nums.length` for insert problems).
2. Use safe mid calculation.
3. Write a condition that guarantees the boundary shrinks.
4. Ensure `mid` is excluded from at least one side.
5. Always consider the edge case where only **two elements remain**.

## When to Use Binary Search

- Search in sorted arrays
- Search insert positions
- Finding first/last occurrence
- Optimization problems with a monotonic condition (e.g., "minimum k such that...")

## TL;DR (Cheatsheet)

| Concept              | Recommendation                              |
| -------------------- | ------------------------------------------- |
| Sorted input         | Required                                    |
| Initial boundary     | Include all valid answers                   |
| Midpoint calculation | `lo + (hi - lo) / 2` or with `+1` if needed |
| Loop condition       | `while (lo < hi)`                           |
| Boundary updates     | Be consistent; ensure progress              |
| Final return         | Check `nums[lo] == target` if needed        |

1. Include **ALL** possible answers when initialize `lo` & `hi`
2. Don't overflow the `mid` calculation
3. Shrink boundary using a logic that will **exclude** mid
4. Avoid infinity loop by picking the correct `mid` and shrinking logic
5. Always think of the case when there are 2 elements left

---

_Binary search is easy to understand but easy to break. Follow a consistent pattern and test against edge cases to build confidence._
