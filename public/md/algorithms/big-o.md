# Big O Notation

**Big O notation** is a mathematical way to describe the **time or space complexity** of an algorithm as a function of input size `n`.

It provides an **upper bound** on the growth rate of an algorithm—helping us understand performance as inputs scale. Think of it like a triathlon: if you're bad at one event, your overall time is limited by that event, no matter how good you are at the others.

## ✂️ Simplification Rules

As `n` becomes large:

- Drop lower-order terms
- Drop constant multipliers

> Example:  
> $$O\left(\frac{n^2}{2} + 3n\right) = O\left(\frac{n^2}{2}\right) = O(n^2)$$

## ⏱️ Time Complexity

- Describes how the **runtime** of an algorithm grows in the **worst-case scenario**
- Helps compare algorithms as input size increases

## 🧠 Space Complexity

- Describes how **memory usage** grows
- Focuses on the **additional memory** needed as input grows
- Also considers temporary memory during algorithm execution

## 🚀 Common Time Complexities

|   Complexity | Name         | Description / Example                      |
| -----------: | ------------ | ------------------------------------------ |
|       `O(1)` | Constant     | Array access by index                      |
|   `O(log n)` | Logarithmic  | Binary search                              |
|       `O(n)` | Linear       | Loop through array once                    |
| `O(n log n)` | Linearithmic | Merge sort, quicksort (avg)                |
|      `O(n²)` | Quadratic    | Nested loops (e.g. bubble sort)            |
|      `O(n³)` | Cubic        | Triple nested loops, matrix multiplication |
|      `O(2ⁿ)` | Exponential  | Recursive Fibonacci                        |
|      `O(n!)` | Factorial    | Permutations, traveling salesman           |

> Any mathematical expression containing `n` can be wrapped in Big O:
>
> - `O(n + c) = O(n)`
> - `O(cn) = O(n)` where `c > 0`

## 📌 Notes

- Algorithms with better **Big O** may still be slower on small inputs
- Focus on the **dominant term**
- Constants don’t matter in Big O (since `∞ * c = ∞`)

## 📏 Best, Worst, and Average Case

Big O notation typically describes the **worst-case** complexity, but understanding all three cases is crucial:

| Case        | Description                           | Example (Quick Sort)                              |
| ----------- | ------------------------------------- | ------------------------------------------------- |
| **Best**    | Optimal input scenario                | O(n) – all elements are equal                     |
| **Average** | Expected performance over many inputs | O(n log n)                                        |
| **Worst**   | Pathological input                    | O(n²) – always chose the biggest element as pivot |

> 🧠 Be prepared to discuss all three cases for common algorithms.

## 🧮 Amortized Time Complexity

Some operations are costly occasionally but cheap on average:

- **Example**: Appending to a dynamic array
  - Usually `O(1)`
  - Occasionally `O(n)` during resize
  - **Amortized** time per operation is still `O(1)`

> 📌 **Amortized ≠ Average case**: It refers to the cost spread over a series of operations, not different inputs.

## 🔁 Common Pitfalls in Interviews

- Confusing **log(n)** with **n log n**
- Underestimating how quickly **quadratic time (O(n²))** grows
- Forgetting constant-time operations in **nested loops**
- Misidentifying recursion complexity — always analyze:
  - Using a **recurrence relation**
  - Or a **recursion tree method**

## 📚 Big O in Common Data Structures

| Data Structure             | Access   | Search   | Insert   | Delete   |
| -------------------------- | -------- | -------- | -------- | -------- |
| Array                      | O(1)     | O(n)     | O(n)     | O(n)     |
| Stack / Queue              | O(n)     | O(n)     | O(1)     | O(1)     |
| Hash Table (average case)  | O(1)     | O(1)     | O(1)     | O(1)     |
| Linked List                | O(n)     | O(n)     | O(1)\*   | O(1)\*   |
| Binary Search Tree (avg)   | O(log n) | O(log n) | O(log n) | O(log n) |
| Binary Search Tree (worst) | O(n)     | O(n)     | O(n)     | O(n)     |

## Common Data Structure Operations

| Data Structure         | Time Complexity (Average) |          |           |          | Time Complexity (Worst) |          |           |          | Space Complexity |
| ---------------------- | ------------------------- | -------- | --------- | -------- | ----------------------- | -------- | --------- | -------- | ---------------- |
|                        | Access                    | Search   | Insertion | Deletion | Access                  | Search   | Insertion | Deletion | Worst            |
| **Array**              | O(1)                      | O(n)     | O(n)      | O(n)     | O(1)                    | O(n)     | O(n)      | O(n)     | O(n)             |
| **Stack**              | O(n)                      | O(n)     | O(1)      | O(1)     | O(n)                    | O(n)     | O(1)      | O(1)     | O(n)             |
| **Queue**              | O(n)                      | O(n)     | O(1)      | O(1)     | O(n)                    | O(n)     | O(1)      | O(1)     | O(n)             |
| **Singly-Linked List** | O(n)                      | O(n)     | O(1)      | O(1)     | O(n)                    | O(n)     | O(1)      | O(1)     | O(n)             |
| **Doubly-Linked List** | O(n)                      | O(n)     | O(1)      | O(1)     | O(n)                    | O(n)     | O(1)      | O(1)     | O(n)             |
| **Skip List**          | O(log n)                  | O(log n) | O(log n)  | O(log n) | O(n)                    | O(n)     | O(n)      | O(n)     | O(n log n)       |
| **Hash Table**         | N/A                       | O(1)     | O(1)      | O(1)     | N/A                     | O(n)     | O(n)      | O(n)     | O(n)             |
| **Binary Search Tree** | O(log n)                  | O(log n) | O(log n)  | O(log n) | O(n)                    | O(n)     | O(n)      | O(n)     | O(n)             |
| **Cartesian Tree**     | N/A                       | O(log n) | O(log n)  | O(log n) | N/A                     | O(n)     | O(n)      | O(n)     | O(n)             |
| **B-Tree**             | O(log n)                  | O(log n) | O(log n)  | O(log n) | O(log n)                | O(log n) | O(log n)  | O(log n) | O(n)             |
| **Red-Black Tree**     | O(log n)                  | O(log n) | O(log n)  | O(log n) | O(log n)                | O(log n) | O(log n)  | O(log n) | O(n)             |
| **Splay Tree**         | N/A                       | O(log n) | O(log n)  | O(log n) | O(log n)                | O(log n) | O(log n)  | O(log n) | O(n)             |
| **AVL Tree**           | O(log n)                  | O(log n) | O(log n)  | O(log n) | O(log n)                | O(log n) | O(log n)  | O(log n) | O(n)             |
| **KD Tree**            | O(log n)                  | O(log n) | O(log n)  | O(log n) | O(n)                    | O(n)     | O(n)      | O(n)     | O(n)             |

> `*` Insert/Delete assumes access to head/tail or known position.  
> Balanced BSTs like **AVL** or **Red-Black Trees** maintain `O(log n)` in all operations.

## 📊 Big O Cheat Sheet

![big-o-3](../../images/big-o-3.png)  
![big-o-1](../../images/big-o-1.png)  
![big-o-2](../../images/big-o-2.png)  
![Big O Poster](https://www.bigocheatsheet.com/img/big-o-cheat-sheet-poster.png)

## ⚖️ Big O, Big Θ (Theta), and Big Ω (Omega)

| Notation | Meaning     | Analogy / Bound  |
| -------- | ----------- | ---------------- |
| `O`      | Upper bound | ≤ — Worst-case   |
| `Ω`      | Lower bound | ≥ — Best-case    |
| `Θ`      | Tight bound | ≈ — Exact growth |

### Example

For printing elements of an array:

- **O(n)** – Worst-case upper bound
- **Ω(n)** – Best-case lower bound
- **Θ(n)** – Tight bound (it’s always `n`)

> 💬 **Industry vs Academia**:
>
> - In **academia**, `O(n²)` is technically valid for a linear algorithm—it’s just a loose upper bound.
> - In **industry** and interviews, we typically express the **tightest** possible bound, e.g., say `O(n)` not `O(n²)` for a linear loop.
