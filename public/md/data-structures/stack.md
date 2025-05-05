# Stack

A **Stack** is a linear data structure that follows the **Last-In-First-Out (LIFO)** principle. The last element added to the stack is the first one to be removed, similar to a stack of plates.

## Characteristics

- **LIFO Order**: The last inserted element is the first to be removed.
- **Single Access Point**: All insertions and deletions happen at the **top** of the stack.
- **Abstract Data Type (ADT)**: Stack can be implemented using arrays or linked lists.

## Common Operations

| Operation | Description                      | Time Complexity |
| --------- | -------------------------------- | --------------- |
| Push      | Insert an element on the top     | O(1)            |
| Pop       | Remove the top element           | O(1)            |
| Peek/Top  | View the top element without pop | O(1)            |
| isEmpty   | Check if the stack is empty      | O(1)            |
| Size      | Get the number of elements       | O(1)            |

## Use Cases

- Undo functionality in editors
- Syntax parsing (e.g., parentheses matching)
- Recursive function call simulation
- Expression evaluation (postfix, infix, prefix)
- Depth-first search (DFS) in graphs/trees
- Backtracking algorithms (like Sudoku or maze solving)

## Java Example: Stack Using Java's Built-In Class

```java showLineNumbers
import java.util.Stack;

public class StackExample {
public static void main(String[] args) {
Stack<Integer> stack = new Stack<>();

        // Push
        stack.push(10);
        stack.push(20);
        stack.push(30);

        // Peek
        System.out.println("Top element: " + stack.peek());

        // Pop
        System.out.println("Popped: " + stack.pop());

        // Print Stack
        System.out.println("Current Stack: " + stack);
    }

}
```

## Custom Stack Implementation (Array-Based)

```java
class MyStack {
private int[] arr;
private int top;
private int capacity;

    public MyStack(int size) {
        arr = new int[size];
        capacity = size;
        top = -1;
    }

    public void push(int x) {
        if (top == capacity - 1) {
            throw new RuntimeException("Stack Overflow");
        }
        arr[++top] = x;
    }

    public int pop() {
        if (isEmpty()) {
            throw new RuntimeException("Stack Underflow");
        }
        return arr[top--];
    }

    public int peek() {
        if (isEmpty()) {
            throw new RuntimeException("Stack is Empty");
        }
        return arr[top];
    }

    public boolean isEmpty() {
        return top == -1;
    }

}
```

## Interview Tips

- Be ready to implement a stack **from scratch** using both arrays and linked lists.
- Understand how stacks can be used to:
  - Reverse strings
  - Evaluate expressions
  - Check balanced parentheses or HTML tags
- Know how to implement a stack with an additional `getMin()` function in O(1) time.
- Practice converting **recursive** solutions to **iterative** using an explicit stack.

## Stack vs Queue

| Feature          | Stack (LIFO)       | Queue (FIFO)    |
| ---------------- | ------------------ | --------------- |
| Insert at        | Top                | Rear            |
| Remove from      | Top                | Front           |
| Use case example | Undo, backtracking | Scheduling, BFS |

## Summary

A **Stack** is a simple but powerful data structure that plays a crucial role in recursion, parsing, and many core algorithms. Its LIFO behavior makes it an ideal tool for managing execution context and undo features. Mastering stacks will help you tackle a wide range of algorithm and system design problems.
