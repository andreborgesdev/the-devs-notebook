# Segment Tree

A **Segment Tree** is a binary tree data structure used for efficiently answering range queries and performing range updates on an array. It allows both operations to be performed in O(log n) time, making it ideal for problems involving frequent range operations.

## Key Characteristics

- **Binary Tree**: Each node represents a segment of the array
- **Range Queries**: Efficiently compute range sum, min, max, etc.
- **Range Updates**: Update ranges of elements efficiently
- **Space Complexity**: O(4n) ≈ O(n) space
- **Time Complexity**: O(log n) for both query and update

## Core Concepts

### Node Structure

- **Leaf nodes**: Represent individual array elements
- **Internal nodes**: Represent merged values of child segments
- **Root**: Represents the entire array range [0, n-1]

### Tree Properties

- **Height**: O(log n)
- **Array representation**: Can be stored in array form
- **Index mapping**: For node at index i, children are at 2i and 2i+1

## Basic Implementation (Range Sum)

```java showLineNumbers
public class SegmentTree {
    private int[] tree;
    private int n;

    public SegmentTree(int[] arr) {
        n = arr.length;
        tree = new int[4 * n]; // Safe size for segment tree
        build(arr, 0, 0, n - 1);
    }

    // Build the segment tree
    private void build(int[] arr, int node, int start, int end) {
        if (start == end) {
            tree[node] = arr[start]; // Leaf node
        } else {
            int mid = start + (end - start) / 2;
            int leftChild = 2 * node + 1;
            int rightChild = 2 * node + 2;

            build(arr, leftChild, start, mid);
            build(arr, rightChild, mid + 1, end);

            tree[node] = tree[leftChild] + tree[rightChild]; // Internal node
        }
    }

    // Query range sum
    public int query(int left, int right) {
        return query(0, 0, n - 1, left, right);
    }

    private int query(int node, int start, int end, int left, int right) {
        if (right < start || left > end) {
            return 0; // No overlap
        }

        if (left <= start && end <= right) {
            return tree[node]; // Complete overlap
        }

        // Partial overlap
        int mid = start + (end - start) / 2;
        int leftChild = 2 * node + 1;
        int rightChild = 2 * node + 2;

        int leftSum = query(leftChild, start, mid, left, right);
        int rightSum = query(rightChild, mid + 1, end, left, right);

        return leftSum + rightSum;
    }

    // Update single element
    public void update(int index, int value) {
        update(0, 0, n - 1, index, value);
    }

    private void update(int node, int start, int end, int index, int value) {
        if (start == end) {
            tree[node] = value; // Leaf node
        } else {
            int mid = start + (end - start) / 2;
            int leftChild = 2 * node + 1;
            int rightChild = 2 * node + 2;

            if (index <= mid) {
                update(leftChild, start, mid, index, value);
            } else {
                update(rightChild, mid + 1, end, index, value);
            }

            tree[node] = tree[leftChild] + tree[rightChild];
        }
    }
}
```

## Range Minimum Query (RMQ) Implementation

```java showLineNumbers
public class RMQSegmentTree {
    private int[] tree;
    private int n;

    public RMQSegmentTree(int[] arr) {
        n = arr.length;
        tree = new int[4 * n];
        build(arr, 0, 0, n - 1);
    }

    private void build(int[] arr, int node, int start, int end) {
        if (start == end) {
            tree[node] = arr[start];
        } else {
            int mid = start + (end - start) / 2;
            int leftChild = 2 * node + 1;
            int rightChild = 2 * node + 2;

            build(arr, leftChild, start, mid);
            build(arr, rightChild, mid + 1, end);

            tree[node] = Math.min(tree[leftChild], tree[rightChild]);
        }
    }

    public int queryMin(int left, int right) {
        return queryMin(0, 0, n - 1, left, right);
    }

    private int queryMin(int node, int start, int end, int left, int right) {
        if (right < start || left > end) {
            return Integer.MAX_VALUE; // No overlap
        }

        if (left <= start && end <= right) {
            return tree[node]; // Complete overlap
        }

        int mid = start + (end - start) / 2;
        int leftChild = 2 * node + 1;
        int rightChild = 2 * node + 2;

        int leftMin = queryMin(leftChild, start, mid, left, right);
        int rightMin = queryMin(rightChild, mid + 1, end, left, right);

        return Math.min(leftMin, rightMin);
    }

    public void update(int index, int value) {
        update(0, 0, n - 1, index, value);
    }

    private void update(int node, int start, int end, int index, int value) {
        if (start == end) {
            tree[node] = value;
        } else {
            int mid = start + (end - start) / 2;
            int leftChild = 2 * node + 1;
            int rightChild = 2 * node + 2;

            if (index <= mid) {
                update(leftChild, start, mid, index, value);
            } else {
                update(rightChild, mid + 1, end, index, value);
            }

            tree[node] = Math.min(tree[leftChild], tree[rightChild]);
        }
    }
}
```

## Lazy Propagation for Range Updates

```java showLineNumbers
public class LazySegmentTree {
    private long[] tree;
    private long[] lazy;
    private int n;

    public LazySegmentTree(int[] arr) {
        n = arr.length;
        tree = new long[4 * n];
        lazy = new long[4 * n];
        build(arr, 0, 0, n - 1);
    }

    private void build(int[] arr, int node, int start, int end) {
        if (start == end) {
            tree[node] = arr[start];
        } else {
            int mid = start + (end - start) / 2;
            int leftChild = 2 * node + 1;
            int rightChild = 2 * node + 2;

            build(arr, leftChild, start, mid);
            build(arr, rightChild, mid + 1, end);

            tree[node] = tree[leftChild] + tree[rightChild];
        }
    }

    private void push(int node, int start, int end) {
        if (lazy[node] != 0) {
            tree[node] += lazy[node] * (end - start + 1);

            if (start != end) { // Not a leaf
                int leftChild = 2 * node + 1;
                int rightChild = 2 * node + 2;
                lazy[leftChild] += lazy[node];
                lazy[rightChild] += lazy[node];
            }

            lazy[node] = 0;
        }
    }

    // Range update: add value to range [left, right]
    public void updateRange(int left, int right, int value) {
        updateRange(0, 0, n - 1, left, right, value);
    }

    private void updateRange(int node, int start, int end, int left, int right, int value) {
        push(node, start, end);

        if (right < start || left > end) {
            return; // No overlap
        }

        if (left <= start && end <= right) {
            lazy[node] += value;
            push(node, start, end);
            return;
        }

        int mid = start + (end - start) / 2;
        int leftChild = 2 * node + 1;
        int rightChild = 2 * node + 2;

        updateRange(leftChild, start, mid, left, right, value);
        updateRange(rightChild, mid + 1, end, left, right, value);

        push(leftChild, start, mid);
        push(rightChild, mid + 1, end);

        tree[node] = tree[leftChild] + tree[rightChild];
    }

    public long query(int left, int right) {
        return query(0, 0, n - 1, left, right);
    }

    private long query(int node, int start, int end, int left, int right) {
        if (right < start || left > end) {
            return 0;
        }

        push(node, start, end);

        if (left <= start && end <= right) {
            return tree[node];
        }

        int mid = start + (end - start) / 2;
        int leftChild = 2 * node + 1;
        int rightChild = 2 * node + 2;

        long leftSum = query(leftChild, start, mid, left, right);
        long rightSum = query(rightChild, mid + 1, end, left, right);

        return leftSum + rightSum;
    }
}
```

## Generic Segment Tree

```java showLineNumbers
import java.util.function.BinaryOperator;

public class GenericSegmentTree<T> {
    private T[] tree;
    private int n;
    private BinaryOperator<T> combiner;
    private T identity;

    @SuppressWarnings("unchecked")
    public GenericSegmentTree(T[] arr, BinaryOperator<T> combiner, T identity) {
        this.n = arr.length;
        this.combiner = combiner;
        this.identity = identity;
        this.tree = (T[]) new Object[4 * n];
        build(arr, 0, 0, n - 1);
    }

    private void build(T[] arr, int node, int start, int end) {
        if (start == end) {
            tree[node] = arr[start];
        } else {
            int mid = start + (end - start) / 2;
            int leftChild = 2 * node + 1;
            int rightChild = 2 * node + 2;

            build(arr, leftChild, start, mid);
            build(arr, rightChild, mid + 1, end);

            tree[node] = combiner.apply(tree[leftChild], tree[rightChild]);
        }
    }

    public T query(int left, int right) {
        return query(0, 0, n - 1, left, right);
    }

    private T query(int node, int start, int end, int left, int right) {
        if (right < start || left > end) {
            return identity;
        }

        if (left <= start && end <= right) {
            return tree[node];
        }

        int mid = start + (end - start) / 2;
        int leftChild = 2 * node + 1;
        int rightChild = 2 * node + 2;

        T leftResult = query(leftChild, start, mid, left, right);
        T rightResult = query(rightChild, mid + 1, end, left, right);

        return combiner.apply(leftResult, rightResult);
    }

    public void update(int index, T value) {
        update(0, 0, n - 1, index, value);
    }

    private void update(int node, int start, int end, int index, T value) {
        if (start == end) {
            tree[node] = value;
        } else {
            int mid = start + (end - start) / 2;
            int leftChild = 2 * node + 1;
            int rightChild = 2 * node + 2;

            if (index <= mid) {
                update(leftChild, start, mid, index, value);
            } else {
                update(rightChild, mid + 1, end, index, value);
            }

            tree[node] = combiner.apply(tree[leftChild], tree[rightChild]);
        }
    }
}

// Usage examples:
// Sum tree: new GenericSegmentTree<>(arr, Integer::sum, 0)
// Min tree: new GenericSegmentTree<>(arr, Integer::min, Integer.MAX_VALUE)
// Max tree: new GenericSegmentTree<>(arr, Integer::max, Integer.MIN_VALUE)
```

## Time and Space Complexity

| Operation    | Time Complexity | Space Complexity |
| ------------ | --------------- | ---------------- |
| Build        | O(n)            | O(n)             |
| Point Update | O(log n)        | O(1)             |
| Range Update | O(log n)        | O(1)             |
| Range Query  | O(log n)        | O(1)             |

## Use Cases

### 1. **Range Sum Queries**

Calculate sum of elements in any range

### 2. **Range Minimum/Maximum Queries**

Find min/max element in any range

### 3. **Range Updates**

Update all elements in a range efficiently

### 4. **Dynamic Programming Optimization**

Optimize DP problems with range queries

### 5. **Computational Geometry**

Rectangle queries, point location

## Common Applications

### Stock Price Analysis

```java
// Track maximum stock price in any time range
Integer[] prices = {100, 120, 90, 140, 110, 160};
GenericSegmentTree<Integer> stockTree = new GenericSegmentTree<>(
    prices, Integer::max, Integer.MIN_VALUE
);

int maxPrice = stockTree.query(1, 4); // Max price from day 1 to 4
```

### Range Assignment with Lazy Propagation

```java
// Set all elements in range to a specific value
public void setRange(int left, int right, int value) {
    // Implementation would modify lazy propagation
    // to handle assignment instead of addition
}
```

## Advantages

- **Efficient Range Operations**: O(log n) for both queries and updates
- **Flexible**: Can handle various operations (sum, min, max, etc.)
- **Memory Efficient**: Linear space complexity
- **Lazy Propagation**: Efficient range updates

## Disadvantages

- **Memory Overhead**: 4x array size for worst case
- **Implementation Complexity**: More complex than simple arrays
- **Cache Performance**: Tree traversal may have poor cache locality
- **Not Dynamic**: Cannot easily insert/delete elements

## Interview Tips

- **Understand when to use**: Range queries with updates
- **Know alternatives**: Fenwick Tree (simpler but less flexible)
- **Lazy propagation**: Essential for range updates
- **Generic implementation**: Show understanding of different operations
- **Time/space analysis**: Be clear about complexities

## Common Patterns

### 1. **Range Sum with Point Updates**

Most basic segment tree application

### 2. **Range Min/Max Queries**

Common in competitive programming

### 3. **Range Updates with Lazy Propagation**

Essential for efficient range modifications

### 4. **Count of Elements in Range**

Using segment tree with coordinate compression

## Comparison with Alternatives

| Data Structure | Build | Query    | Update   | Space |
| -------------- | ----- | -------- | -------- | ----- |
| Segment Tree   | O(n)  | O(log n) | O(log n) | O(n)  |
| Fenwick Tree   | O(n)  | O(log n) | O(log n) | O(n)  |
| Square Root    | O(1)  | O(√n)    | O(√n)    | O(n)  |
| Naive Array    | O(1)  | O(n)     | O(1)     | O(n)  |

## Summary

**Segment Trees** are powerful data structures for range queries and updates. They provide excellent time complexity for both operations while maintaining reasonable space usage. Understanding segment trees is crucial for competitive programming and technical interviews, especially for problems involving range operations on arrays.
