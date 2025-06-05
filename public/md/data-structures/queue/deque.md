# Deque (Double-Ended Queue)

A **Deque** (pronounced "deck") is a linear data structure that allows insertions and deletions from both ends - the front and the rear. It combines the functionality of both stacks and queues, providing maximum flexibility for element manipulation.

## Key Characteristics

- **Bidirectional**: Operations possible at both ends
- **Dynamic Size**: Can grow and shrink during runtime
- **Versatile**: Can be used as a stack, queue, or both simultaneously
- **Efficient**: O(1) operations at both ends

## Common Operations

| Operation     | Description                        | Time Complexity |
| ------------- | ---------------------------------- | --------------- |
| addFirst()    | Insert element at the front        | O(1)            |
| addLast()     | Insert element at the rear         | O(1)            |
| removeFirst() | Remove element from the front      | O(1)            |
| removeLast()  | Remove element from the rear       | O(1)            |
| peekFirst()   | View first element without removal | O(1)            |
| peekLast()    | View last element without removal  | O(1)            |
| isEmpty()     | Check if deque is empty            | O(1)            |
| size()        | Get number of elements             | O(1)            |

## Common Implementations

### 1. Array-Based (Circular Buffer)

- **Pros**: Good cache locality, minimal memory overhead
- **Cons**: Fixed size (unless dynamic resizing), complex index management

### 2. Doubly Linked List

- **Pros**: Dynamic size, simple implementation
- **Cons**: Extra memory for pointers, poor cache locality

## Java Implementation Examples

### Using ArrayDeque

```java showLineNumbers
import java.util.ArrayDeque;
import java.util.Deque;

public class DequeExample {
    public static void main(String[] args) {
        Deque<Integer> deque = new ArrayDeque<>();

        // Add elements
        deque.addFirst(10);    // [10]
        deque.addLast(20);     // [10, 20]
        deque.addFirst(5);     // [5, 10, 20]
        deque.addLast(30);     // [5, 10, 20, 30]

        System.out.println("Deque: " + deque);

        // Remove elements
        System.out.println("Removed from front: " + deque.removeFirst()); // 5
        System.out.println("Removed from rear: " + deque.removeLast());   // 30

        // Peek operations
        System.out.println("First: " + deque.peekFirst()); // 10
        System.out.println("Last: " + deque.peekLast());   // 20
    }
}
```

### Using LinkedList

```java showLineNumbers
import java.util.LinkedList;
import java.util.Deque;

public class LinkedListDeque {
    public static void main(String[] args) {
        Deque<String> deque = new LinkedList<>();

        deque.addFirst("B");
        deque.addFirst("A");    // [A, B]
        deque.addLast("C");     // [A, B, C]
        deque.addLast("D");     // [A, B, C, D]

        // Use as stack (LIFO)
        deque.addFirst("Stack");
        String stackPop = deque.removeFirst();

        // Use as queue (FIFO)
        deque.addLast("Queue");
        String queuePoll = deque.removeFirst();
    }
}
```

## Use Cases

### 1. **Sliding Window Problems**

Efficiently maintain min/max elements in a window

```java
// Sliding window maximum using deque
public int[] maxSlidingWindow(int[] nums, int k) {
    Deque<Integer> deque = new ArrayDeque<>();
    int[] result = new int[nums.length - k + 1];

    for (int i = 0; i < nums.length; i++) {
        // Remove indices outside window
        while (!deque.isEmpty() && deque.peekFirst() < i - k + 1) {
            deque.removeFirst();
        }

        // Remove smaller elements
        while (!deque.isEmpty() && nums[deque.peekLast()] < nums[i]) {
            deque.removeLast();
        }

        deque.addLast(i);

        if (i >= k - 1) {
            result[i - k + 1] = nums[deque.peekFirst()];
        }
    }

    return result;
}
```

### 2. **Palindrome Checking**

Check strings or sequences from both ends

### 3. **Undo/Redo Operations**

Navigate history in both directions

### 4. **Browser History**

Navigate back and forward through pages

### 5. **Task Scheduling**

Priority adjustments by adding urgent tasks to front

## ArrayDeque vs LinkedList

| Feature            | ArrayDeque      | LinkedList             |
| ------------------ | --------------- | ---------------------- |
| Memory overhead    | Lower           | Higher                 |
| Cache performance  | Better          | Worse                  |
| Insertion/Deletion | O(1) amortized  | O(1)                   |
| Random access      | Not supported   | O(n)                   |
| Best for           | General purpose | Frequent modifications |

## Interview Tips

- **Know the implementations**: Understand when to use ArrayDeque vs LinkedList
- **Sliding window patterns**: Many problems use deque for maintaining order
- **Monotonic deque**: Keeping elements in increasing/decreasing order
- **Memory considerations**: ArrayDeque is generally preferred for performance
- **API familiarity**: Know Java's Deque interface methods

## Common Pitfalls

1. **Null values**: ArrayDeque doesn't allow null elements
2. **Exception vs null**: `removeFirst()` throws exception, `pollFirst()` returns null
3. **Iterator behavior**: Don't modify deque while iterating
4. **Capacity**: ArrayDeque automatically resizes, but initial capacity matters for performance

## Monotonic Deque Pattern

```java
// Monotonic decreasing deque for sliding window maximum
public void maintainMonotonicDeque(Deque<Integer> deque, int[] arr, int newIndex) {
    // Remove elements that are smaller than current element
    while (!deque.isEmpty() && arr[deque.peekLast()] <= arr[newIndex]) {
        deque.removeLast();
    }
    deque.addLast(newIndex);
}
```

## Summary

**Deque** is a versatile data structure that provides the functionality of both stacks and queues. Its ability to efficiently add and remove elements from both ends makes it invaluable for algorithms involving sliding windows, palindromes, and bidirectional processing. ArrayDeque is typically the preferred implementation due to better performance characteristics.
