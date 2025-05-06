# Recursion

## Overview

**Recursion** is a programming technique where a function calls itself directly or indirectly to solve a problem by breaking it down into smaller subproblems.

It is commonly used to simplify solutions for problems involving:

- Divide and conquer
- Backtracking
- Tree and graph traversals
- Dynamic programming

## Key Concepts

| Concept        | Description                                                                     |
| -------------- | ------------------------------------------------------------------------------- |
| Base case      | The condition under which the recursion stops. Prevents infinite loops.         |
| Recursive case | The part of the function where it calls itself with a simpler or smaller input. |

## How It Works

Each recursive call creates a new frame in the call stack:

1. Work is deferred until the base case is reached.
2. Once at the base case, the function begins returning and unwinding the stack.

## Example: Factorial (Java)

```java
public class RecursionExample {
    public static int factorial(int n) {
        if (n == 0) { // Base case
            return 1;
        } else { // Recursive case
            return n * factorial(n - 1);
        }
    }

    public static void main(String[] args) {
        System.out.println(factorial(5)); // Output: 120
    }
}
```

## Example: Fibonacci Sequence (Java)

```java
public class Fibonacci {
    public static int fibonacci(int n) {
        if (n <= 1) return n; // Base cases
        return fibonacci(n - 1) + fibonacci(n - 2); // Recursive case
    }

    public static void main(String[] args) {
        System.out.println(fibonacci(6)); // Output: 8
    }
}
```

## Types of Recursion

| Type               | Description                                 | Example                  |
| ------------------ | ------------------------------------------- | ------------------------ |
| Direct Recursion   | Function calls itself directly              | factorial()              |
| Indirect Recursion | Function A calls B, and B calls A           | Mutual recursion         |
| Tail Recursion     | Recursive call is the last operation        | Optimizable by compilers |
| Head Recursion     | Recursive call happens before any operation | Printing in reverse      |

## When to Use Recursion

- Problems with a natural recursive structure (such as trees and graphs)
- Divide-and-conquer algorithms (such as merge sort and quick sort)
- When an iterative solution is complex or less readable

## Drawbacks

- Performance overhead: Each recursive call adds a frame to the stack.
- Stack overflow: Too deep recursion can exhaust the call stack.
- Can be less efficient without optimization techniques such as memoization.

## Optimizations

- Memoization: Cache results of expensive recursive calls.
- Tail Call Optimization (TCO): Some languages optimize tail-recursive functions to avoid stack growth. Note that Java does not natively support TCO.
- Convert to iteration when possible to reduce stack usage.

## Recursion vs. Iteration

| Feature      | Recursion                         | Iteration                                   |
| ------------ | --------------------------------- | ------------------------------------------- |
| Readability  | Often clearer                     | Can be verbose                              |
| Performance  | Can be slower                     | Generally faster                            |
| Memory Usage | Uses stack frames                 | Uses constant space                         |
| Best Use     | Problems with recursive structure | Repetitive tasks with predictable iteration |

## Common Real-World Use Cases

- Tree traversals (preorder, inorder, postorder)
- Graph algorithms (depth-first search)
- Backtracking (Sudoku solver, maze exploration)
- Divide and conquer (sorting and searching algorithms)
- Dynamic programming problems (knapsack, longest common subsequence)
