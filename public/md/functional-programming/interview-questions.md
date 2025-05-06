# Functional Programming Interview Questions

### **What is Functional Programming?**

Functional Programming (FP) is a programming paradigm where computation is treated as the evaluation of mathematical functions and avoids changing state or mutable data.

### **What are the key principles of Functional Programming?**

- **Pure Functions**
- **Immutability**
- **First-Class and Higher-Order Functions**
- **Function Composition**
- **Recursion over Iteration**
- **Referential Transparency**
- **Declarative Code**

### **What is a Pure Function?**

A pure function always produces the same output for the same input and has no side effects (does not modify any external state).

### **What is Immutability?**

Immutability means once data is created, it cannot be changed. Instead, new copies with modified data are created.

### **What is Referential Transparency?**

An expression is referentially transparent if it can be replaced by its value without changing the program’s behavior.

### **Explain First-Class and Higher-Order Functions.**

- **First-Class Functions**: Functions are treated like any other variable.
- **Higher-Order Functions**: Functions that take other functions as arguments or return them as results.

### **What is Function Composition?**

Function composition is the process of combining two or more functions to produce a new function. Example:
`f ∘ g (x) = f(g(x))`

### **How does recursion differ from iteration in Functional Programming?**

FP prefers recursion over iteration because it avoids mutable state changes, keeping code pure and declarative.

### **What are Side Effects?**

Operations that affect state outside a function’s scope, such as modifying global variables, performing I/O, or changing a database.

### **What is Lazy Evaluation?**

Lazy evaluation delays computation until the value is actually needed, improving efficiency.

### **What is a Monad?**

A Monad is a design pattern that allows for structuring programs generically while handling side effects, sequencing computations, and managing context (e.g., `Maybe`, `Either`, `IO`).

### **What is Currying?**

Currying transforms a function with multiple arguments into a series of functions each taking one argument.

```javascript
function add(a) {
  return function (b) {
    return a + b;
  };
}
```

### **What is Partial Application?**

Partial application refers to fixing a few arguments of a function, producing another function of smaller arity.

```javascript
function multiply(a, b) {
  return a * b;
}

const double = multiply.bind(null, 2);
```

### **What is Memoization?**

An optimization technique that stores the results of expensive function calls and returns the cached result when the same inputs occur again.

### **What are Algebraic Data Types (ADT)?**

Composite types like **Sum Types** (e.g., `Either`, `Option`) and **Product Types** (e.g., tuples, records) used to model data structures.

### **What is the difference between Declarative and Imperative Programming?**

- **Imperative**: Describes _how_ to perform tasks.
- **Declarative**: Describes _what_ to do without specifying control flow.

### **Can you name some functional programming languages?**

- Pure FP: Haskell, Elm, PureScript
- Multi-paradigm: Scala, F#, OCaml, Clojure, JavaScript (ES6+), Python (FP support), Kotlin

### **How does FP improve testability?**

Pure functions and immutability eliminate side effects, making functions predictable and easy to test.

### **How does FP handle error handling?**

Uses constructs like `Option`, `Either`, and `Try` to explicitly handle errors without throwing exceptions.

### **Explain the concept of Functors and Applicatives.**

- **Functor**: A type that can be mapped over (supports `map` operation).
- **Applicative**: A Functor that can apply functions wrapped in the context to values in the same context.

### **What are some common functional patterns?**

- Map/Filter/Reduce
- Composition
- Pipelines
- Monads
- Lenses

### **What is Tail-Call Optimization (TCO)?**

An optimization where tail-recursive function calls are executed without adding a new stack frame, preventing stack overflows.

### **How do side effects fit into FP (if at all)?**

Side effects are isolated at the boundaries of the application (e.g., using Monads, IO types, or effect systems) while keeping the core logic pure.

### **What is a Monad and how does it differ from a Functor?**

A **Functor** allows mapping a function over wrapped values.
A **Monad** extends Functor by adding `flatMap` (or `bind`) to support chaining operations that themselves return wrapped values, enabling sequencing of computations.

### **What is the Monad Laws?**

1. **Left Identity**: `unit(x).flatMap(f)` ≡ `f(x)`
2. **Right Identity**: `m.flatMap(unit)` ≡ `m`
3. **Associativity**: `m.flatMap(f).flatMap(g)` ≡ `m.flatMap(x => f(x).flatMap(g))`

These laws ensure predictability and composability of monadic operations.

### **What is a Functor Law?**

1. **Identity**: `F.map(id)` ≡ `F`
2. **Composition**: `F.map(f).map(g)` ≡ `F.map(g ∘ f)`

These guarantee consistent mapping over wrapped values.

### **Explain Higher-Kinded Types.**

Types that take other types as parameters (e.g., `List[_]`, `Option[_]`).
They enable generic programming with Functors, Monads, etc.

Example in Scala:

```scala
trait Functor[F[_]] {
  def map[A, B](fa: F[A])(f: A => B): F[B]
}
```

### **What is a Type Class?**

A type class defines behavior that types can implement without altering their original definitions.
Example: `Eq`, `Show`, `Functor` in Scala, Haskell.

### **Explain Category Theory's relevance to FP.**

Category Theory provides the mathematical foundation for functional abstractions like Functors, Monads, and natural transformations, enabling reasoning about data flow and composition.

### **What is a Natural Transformation?**

A transformation between two functors that preserves structure:

```scala
// Scala pseudocode
def transform[F[_], G[_], A](fa: F[A]): G[A]
```

### **Explain Applicative Functor and how it differs from Monad.**

An **Applicative Functor** allows applying a wrapped function to a wrapped value (`ap` function).
Unlike Monads, Applicatives do not allow sequencing dependent operations (no `flatMap`).

### **What is the difference between flatMap and map?**

- `map`: Applies a function returning a plain value.
- `flatMap`: Applies a function returning a wrapped value and flattens the result.

### **What is Currying and why is it useful?**

Currying transforms a function with multiple arguments into a sequence of single-argument functions, enabling partial application and better function composition.

### **Explain Algebraic Data Types (ADTs).**

- **Sum Types** (disjoint unions, e.g., `Either`, `Option`)
- **Product Types** (combinations, e.g., tuples, case classes)

Used to model complex data in a type-safe manner.

### **What is Immutability’s impact on concurrency?**

Immutability eliminates shared mutable state, removing common concurrency issues like race conditions and making parallelism safer.

### **Explain the concept of Lenses.**

A **Lens** focuses on a specific part of a data structure, allowing immutable updates and reads.

Example in Scala (pseudo):

```scala
val lens = Lens[Person, Address](
  get = _.address,
  set = (p, newAddr) => p.copy(address = newAddr)
)
```

### **What is Tail Recursion and Tail-Call Optimization (TCO)?**

Tail recursion occurs when a function’s recursive call is its final action.
**TCO** allows compilers/interpreters to optimize tail-recursive calls into loops, avoiding stack overflows.

### **What is Lazy Evaluation and where is it useful?**

Delays computation until the value is needed.
Useful for improving performance and enabling infinite data structures like streams.

### **What is Effect Systems in FP?**

Effect systems track side effects at the type level, improving reasoning about purity and side-effect management (e.g., `IO` monads, ZIO in Scala).

### **Explain the concept of Referential Transparency.**

An expression is referentially transparent if it can be replaced with its resulting value without affecting the program’s behavior.

### **What is the difference between Eager and Lazy Evaluation?**

- **Eager**: Computes values immediately.
- **Lazy**: Defers computation until required.

### **What is the Y Combinator?**

A higher-order function used to enable recursion in anonymous functions, particularly in languages without named recursion.

### **What are Free Monads?**

Free Monads decouple program description from interpretation, enabling different interpreters (pure, async, logging, etc.) for the same abstract computation.

### **Explain the significance of the Either and Option types.**

- **Either**: Represents a value that can be either a success or an error.
- **Option**: Represents a value that may be present (`Some`) or absent (`None`).

Encourages explicit error and null handling.

### **What is the significance of Type Inference in FP?**

Type inference reduces verbosity, enabling developers to write concise code while maintaining type safety.
