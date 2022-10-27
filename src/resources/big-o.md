# Big O notation

Time complexity is how the algorithm works on the worst case scenario. It can never perform worst than the worst scenario (upper bound). It helps to quantify the performance as the input size becomes arbitrarily large. 

Big O notation is the theoretical definition of the complexity of an algorithm as a function of size.

The upper bound is determined by the step that takes longer (triathlon, if one of them is bad we’re bound to it and it is irrelevant if we improve the other two).

There are some languages that prefer recursion over iteration. For some, recursion depth doesn’t matter. It is called “tail call optimization” - when the recursive call is the last thing to be called on a function.

**Space complexity:**

- Concerns memory usage. It is also determined by the worst case scenario. Space complexity doesn’t care about measuring how much additional storage we need if our list grows.
- It cares about which additional storage is needed as the algorithm runs and tries to find a solution.

O → Big O / Order of magnitude of complexity

O(1) → Constant runtime

O(n) → Linear runtime → n is the size of the input

O(n²) → Quadratic runtime

O(n³) → Cubic runtime

O(Log n) → Logarithmic runtime or sublinear → Every time we double the value of N it only takes one more operation to get tot the result.

2³ = 8 ↔ log2(8) = 3

O(n Log n) → Quasilinear runtime → For every value of N we’re going to execute a log N number of operations. For example, Merge Sort is O (N Log N) because we have to do N comparison operations. Then Log N comes because of the Merge part.

O(n^K) → Polynomial runtime

O(X^n) → Exponential runtime

O(n!) → Factorial/Combinatorial runtime. F.e. Travel salesman problem. 3! = 3 x 2 x 1 = 6

Any math expression containing n can be wrapped around a big O.

O(n+c) = O(n)

O(cn) = O(n), c > 0

If we multiply a constant by infinite we get infinite. So, we can ignore constants. We stay with the biggest/most dominant term in the function

![big-o](./images/big-o-1.png)

![big-o](./images/big-o-2.png)

![big-o](./images/big-o-3.png)

![https://www.bigocheatsheet.com/img/big-o-cheat-sheet-poster.png](https://www.bigocheatsheet.com/img/big-o-cheat-sheet-poster.png)