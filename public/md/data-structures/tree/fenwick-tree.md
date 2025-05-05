# Fenwick Tree (Binary Indexed Tree)

A **Fenwick Tree**, also called a **Binary Indexed Tree (BIT)**, is a tree-structured array that supports **efficient prefix sum queries and element updates**.

## Characteristics

- **Time Complexity**:
  - Prefix sum query: O(log n)
  - Update: O(log n)
- **Space Complexity**: O(n)
- **1-based indexing** is typically used.
- Common in competitive programming and interview problems involving **dynamic cumulative sums**.

## Use Cases

- Dynamic **range sum queries**.
- **Counting inversions** in arrays.
- **Frequency table updates**.
- **2D range sum queries** (advanced variants).

## Core Operations

| Operation                 | Purpose                 | Time Complexity |
| ------------------------- | ----------------------- | --------------- |
| `update(index, delta)`    | Add delta to an element | O(log n)        |
| `query(index)`            | Prefix sum up to index  | O(log n)        |
| `rangeQuery(left, right)` | Sum of a subarray       | O(log n)        |

## Key Concept

A Fenwick Tree stores cumulative data in an array where:

- Each element represents a cumulative sum over a specific range.
- The range is determined by the **least significant bit** in the index’s binary representation.

To **move up** the tree:  
`index -= index & -index`  
To **move to the next responsible node**:  
`index += index & -index`

## Java Example: Fenwick Tree

```java showLineNumbers
class FenwickTree {
private int[] bit;
private int n;

    public FenwickTree(int size) {
        this.n = size;
        this.bit = new int[n + 1]; // 1-based indexing
    }

    // Add delta to index
    public void update(int index, int delta) {
        while (index <= n) {
            bit[index] += delta;
            index += index & -index;
        }
    }

    // Query prefix sum up to index
    public int query(int index) {
        int sum = 0;
        while (index > 0) {
            sum += bit[index];
            index -= index & -index;
        }
        return sum;
    }

    // Query sum between left and right (inclusive)
    public int rangeQuery(int left, int right) {
        return query(right) - query(left - 1);
    }

}

public class FenwickTreeExample {
public static void main(String[] args) {
FenwickTree ft = new FenwickTree(10);

        ft.update(3, 5);  // Add 5 at index 3
        ft.update(5, 2);  // Add 2 at index 5
        ft.update(7, 7);  // Add 7 at index 7

        System.out.println("Sum of first 5 elements: " + ft.query(5));     // 7
        System.out.println("Sum from index 3 to 7: " + ft.rangeQuery(3, 7)); // 14
    }

}
```

## Interview Tips

- Be ready to **implement Fenwick Trees from scratch**.
- Understand **why O(log n) updates** are better than O(n) in brute-force prefix sum arrays.
- Practice solving:
  - **Range sum queries**.
  - **Dynamic frequency counting**.
  - **Counting inversions in O(n log n)**.
- Know the difference between **Fenwick Tree** and **Segment Tree**:
  - Fenwick Tree is **simpler** and usually faster for prefix sums.
  - Segment Tree supports **range updates and queries** more flexibly.

## Common Pitfalls

- **Off-by-one errors**: 1-based indexing is standard.
- Forgetting to handle **updates properly** when dealing with negative values or deletions.
- Not differentiating **point updates** (Fenwick Tree) vs **range updates** (Segment Tree).

## Summary

A **Fenwick Tree** offers a fast and memory-efficient way to handle prefix sums and updates. It’s essential for many interview problems involving dynamic cumulative operations and a must-know for competitive programming.
