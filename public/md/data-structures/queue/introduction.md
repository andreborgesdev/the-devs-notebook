# Queue

A **Queue** is a linear data structure that follows the **First-In-First-Out (FIFO)** principle. The first element added to the queue will be the first one to be removed, just like a real-life queue (e.g., a line at the grocery store).

## Characteristics

- **FIFO Order**: Elements are enqueued (inserted) at the rear and dequeued (removed) from the front.
- **Linear Structure**: Unlike stacks (LIFO), queues maintain the order of processing.

## Common Operations

| Operation    | Description                      | Time Complexity |
| ------------ | -------------------------------- | --------------- |
| Enqueue      | Add an element to the rear       | O(1)            |
| Dequeue      | Remove an element from the front | O(1)            |
| Peek / Front | View the element at the front    | O(1)            |
| isEmpty      | Check if the queue is empty      | O(1)            |
| Size         | Get the number of elements       | O(1)            |

## Use Cases

- Scheduling (CPU task scheduling, printer queues)
- Breadth-first search (BFS) in graphs and trees
- Caching mechanisms
- Handling asynchronous data (e.g., message queues)
- Buffers in streaming data (like I/O buffers)

## Types of Queues

- **Simple Queue**: Basic FIFO implementation
- **Circular Queue**: Reuses empty spaces to avoid wasted memory
- **Deque (Double-Ended Queue)**: Allows insertion/removal from both ends
- **Priority Queue**: Elements are dequeued based on priority, not just order

## Java Example: Simple Queue Using LinkedList

```java showLineNumbers
import java.util.LinkedList;
import java.util.Queue;

public class QueueExample {
public static void main(String[] args) {
Queue<Integer> queue = new LinkedList<>();

        // Enqueue
        queue.add(10);
        queue.add(20);
        queue.add(30);

        // Peek
        System.out.println("Front element: " + queue.peek());

        // Dequeue
        System.out.println("Removed: " + queue.poll());

        // Print Queue
        System.out.println("Current Queue: " + queue);
    }

}
```

## Interview Tips

- Be familiar with both **array-based** and **linked list-based** queue implementations.
- Understand circular queue behavior and why it’s useful in fixed-size buffer problems.
- Be prepared to implement a **queue using two stacks** or a **stack using two queues**.
- Know the difference between `add()` and `offer()` in Java's Queue interface.
- For graph problems like **shortest path in unweighted graphs**, BFS (which uses a queue) is key.

## Queue vs Stack

| Feature          | Queue (FIFO)    | Stack (LIFO)    |
| ---------------- | --------------- | --------------- |
| Insert at        | Rear            | Top             |
| Remove from      | Front           | Top             |
| Use case example | Task scheduling | Recursion, undo |

## Summary

A **Queue** is a foundational data structure perfect for processing elements in a strict order. It's widely used in scheduling systems, graph algorithms, and real-time processing. Mastering queues, along with related variations like circular queues and priority queues, is essential for technical interviews and real-world applications.
