# Big O notation

Big O notation, written O(), is the mathematical notation of the complexity of an algorithm as a function of size.

The O() notation puts an upper bound on the value of the thing we're measuring (time, memory, and so on), and it is determined by the step that takes longer (for example, in triathlon, if we are bad at one of the modalities, we’re bound to it and it is irrelevant if we improve the other two).

Sometimes, we come up with fairly complex O() functions, but because the highest-order term will dominate the values as _n_ increases, the convention is to remove all lower-order terms, and not to bother any constant multiplying factors:

$$
O\!\Bigl(\frac{n^2}{2} + 3n\Bigr) = O\!\Bigl(\frac{n^2}{2}\Bigr) = O(n^2)
$$

One algorithm can be faster than another for small inputs, but slower for larger inputs. Big O notation helps to determine the performance of an algorithm as the input size grows.

### Time complexity

Time complexity is how the algorithm works on the worst case scenario. It can never perform worst than the worst scenario (upper bound). It helps to quantify the performance as the input size becomes arbitrarily large.

### Space complexity

- Concerns memory usage. It is also determined by the worst case scenario. Space complexity doesn’t care about measuring how much additional storage we need if our list grows.
- It cares about which additional storage is needed as the algorithm runs and tries to find a solution.

### Complexity

O → Big O / Order of magnitude of complexity

There is no fixed list of possible runtimes, but the most common ones are:

O(1) → Constant runtime → The time it takes to run the algorithm is constant and does not depend on the size of the input. For example, accessing an element in an array by index is O(1) because it takes the same amount of time regardless of the size of the array.

O(log n) → Logarithmic/Sublinear runtime → The time it takes to run the algorithm grows logarithmically in relation to the input size. For example, binary search is O(log n) because it cuts the input size in half with each iteration. 2³ = 8 ↔ log2(8) = 3

O(n) → Linear runtime → The time it takes to run the algorithm grows linearly in relation to the input size. For example, a simple loop that iterates through an array is O(n) because it processes each element once.

O(n log n) → Linearithmic/Quasilinear runtime → The time it takes to run the algorithm grows in relation to the input size and the logarithm of the input size. For example, merge sort is O(n log n) because it divides the input in half and processes each half separately.

O(n²) → Quadratic/Square runtime → The time it takes to run the algorithm grows quadratically in relation to the input size. For example, a nested loop that iterates through an array is O(n²) because it processes each element for every other element.

O(n³) → Cubic runtime → The time it takes to run the algorithm grows cubically in relation to the input size. For example, a triple nested loop that iterates through an array is O(n³) because it processes each element for every other element for every other element. Same as multiplying two n x n matrices.

O(X^n) → Exponential runtime → The time it takes to run the algorithm grows exponentially in relation to the input size. For example, the Fibonacci sequence can be calculated using an exponential algorithm that takes O(2^n) time because it branches out into two recursive calls for each element.

O(n^K) → Polynomial runtime → The time it takes to run the algorithm grows polynomially in relation to the input size. For example, a polynomial function of degree K is O(n^K) because it processes each element K times.

O(n!) → Factorial/Combinatorial runtime → The time it takes to run the algorithm grows factorially in relation to the input size. For example, generating all permutations of a set of n elements is O(n!) because it processes each element in every possible order. F.e. Travel salesman problem. 3! = 3 x 2 x 1 = 6

Any math expression containing n can be wrapped around a big O.

O(n+c) = O(n)

O(cn) = O(n), c > 0

If we multiply a constant by infinite we get infinite. So, we can ignore constants. We stay with the biggest/most dominant term in the function

### Big O Cheat Sheet

![big-o](../../images/big-o-3.png)

![big-o](../../images/big-o-1.png)

![big-o](../../images/big-o-2.png)

![https://www.bigocheatsheet.com/img/big-o-cheat-sheet-poster.png](https://www.bigocheatsheet.com/img/big-o-cheat-sheet-poster.png)

### Big O, Big Theta, and Big Omega

The differences between big O, big theta, and big omega are subtle but important. In academia, the definitions are as follows:

- **O (big O):** In academia, big O describes an upper bound on the time. An algorithm that prints all the values in an array could be described as O(N), but it could also be described as O(n²), O(n³), or O(2N) (or many other big O times). The algorithm is at least as fast as each of these; therefore they are upper bounds on the runtime. This is similar to a less-than-or-equal-to relationship. If Bob is X years old (I'll assume no one lives past age 130), then you could say X <= 130. It would also be correct to say that X <= 1, 000 or X <= 1,000,000. It's technically true (although not terribly useful). Likewise, a simple algorithm to print the values in an array is O(N) as well as O(n³) or any runtime bigger than O(N).
- Ω (big omega): In academia, Ω is the equivalent concept but for lower bound. Printing the values in an array is Ω(N) as well as Ω(log N) and Ω(1). After all, you know that it won't be faster than those runtimes.
- Θ (big theta): In academia, Θ means both O and Ω. That is, an algorithm is Θ(N) if it is both Θ(N) and Ω(N). Θ gives a tight bound on runtime.

In industry (and therefore in interviews), people seem to have merged Θ and O together. Industry's meaning of big O is closer to what academics mean by 0, in that it would be seen as incorrect to describe printing an array as O(n²). Industry would just say this is O(N).
