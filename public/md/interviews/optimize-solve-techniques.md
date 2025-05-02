# Optimize & Solve Techniques

These techniques are designed to help when you’re stuck or when it’s time to improve your brute-force solution.

## BUD (Bottlenecks, Unnecessary Work, Duplicated Work)

- **What it is**: A framework specifically for **optimizing** an existing (often brute-force) algorithm.
- **How it helps**: Provides a structured way to analyze inefficiencies.
  - **B**ottlenecks: Identify the part of your code that contributes most to the runtime (e.g., the innermost loop in nested loops, a slow subroutine). Can you optimize this specific part?
  - **U**nnecessary Work: Are you performing calculations or steps that don't actually contribute to the final answer? Can they be eliminated? (e.g., calculating the same sum repeatedly inside a loop when it could be done once outside).
  - **D**uplicated Work: Are you re-computing the same value multiple times across different parts of your algorithm or recursive calls? Can you cache results (memoization/dynamic programming)?
- **Example**: In a recursive Fibonacci calculation `fib(n) = fib(n-1) + fib(n-2)`, `fib(k)` is computed many times (Duplicated Work). Using memoization fixes this.

## DIY (Do It Yourself) / Example Walkthrough

- **What it is**: Manually working through a concrete, specific example of the problem, often on paper or a whiteboard.
- **How it helps**:
  - Deepens understanding of the problem statement and edge cases.
  - Helps visualize the process and identify patterns or potential algorithms.
  - Allows testing of a potential algorithm _before_ writing complex code.
  - Excellent way to start when unsure how to proceed.
- **Example**: For a string manipulation problem, write down a sample input string and manually perform the steps you think the algorithm should take, tracking variables and intermediate results.

## Simplify and Generalize

- **What it is**: Temporarily modifying the problem to make it easier, solving the simpler version, and then adapting the solution back to the original, harder problem.
- **How it helps**:
  - Breaks down overwhelming problems into manageable parts.
  - Can reveal core logic needed for the general case.
- **Example**: If asked to find the median of two sorted arrays of different sizes, first solve it for arrays of the _same_ size. Then, generalize the solution. Or, if constraints seem complex, solve without them first, then add them back.

## Base Case and Build

- **What it is**: A recursive approach where you define the solution for the simplest possible input (the base case, e.g., n=0 or n=1) and then figure out how to solve for a given case 'n' by leveraging the solution for smaller cases (e.g., n-1 or n/2).
- **How it helps**:
  - Naturally leads to recursive algorithms.
  - Fundamental to dynamic programming (solving subproblems and building up).
- **Example**: For calculating the nth Fibonacci number, the base cases are F(0)=0 and F(1)=1. The 'build' step is F(n) = F(n-1) + F(n-2).

## Data Structure Brainstorming

- **What it is**: Systematically considering various data structures and how they might apply to the problem, especially when looking for efficiency gains or ways to organize data.
- **How it helps**:
  - Breaks fixation on a suboptimal approach.
  - Prompts consideration of space/time trade-offs associated with different structures.
- **Process**: Run through common structures: Array, Hash Map/Table, Linked List, Stack, Queue, Tree (BST, Trie, Heap), Graph. For each, ask: "Could this structure help store, retrieve, or process the data more effectively for this specific problem?"

## BCR (Best Conceivable Runtime)

- **What it is**: A thought experiment to estimate the theoretical lower bound on the runtime complexity. Ask: "What is the minimum work required?"
- **How it helps**:
  - Sets a target for optimization – if your solution matches the BCR, further time optimization might be impossible.
  - Helps quickly determine if a brute-force $O(N^2)$ solution could potentially be improved to $O(N)$ or $O(N \log N)$.
- **Example**: If you need to find the maximum element in an unsorted array, you _must_ look at every element at least once, so the BCR is $O(N)$. If you need to find a pair that sums to a value, you likely need to examine each element, hinting towards at least $O(N)$.
