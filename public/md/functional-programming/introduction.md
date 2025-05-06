# Functional Programming (FP)

## What is Functional Programming?

Functional Programming (FP) is a **programming paradigm** that treats computation as the evaluation of mathematical functions and avoids changing state and mutable data. It emphasizes **pure functions**, **immutability**, and **higher-order functions**.

Many modern languages support FP principles, including Java (from version 8 with lambdas), JavaScript, Python, Scala, and Haskell.

## Why Functional Programming?

- **Predictable behavior**: Pure functions always produce the same output for the same input
- **Easier testing and debugging**: No side effects simplify reasoning about code
- **Concurrency friendly**: Immutable data structures eliminate common threading issues
- **Encourages concise and expressive code**
- **Promotes modularity and reusability**

## Core Principles

| Concept                    | Description                                                                                        |
| -------------------------- | -------------------------------------------------------------------------------------------------- |
| **Pure Functions**         | Functions with no side effects that return the same output for the same input                      |
| **Immutability**           | Data cannot be changed after it is created                                                         |
| **First-class Functions**  | Functions are treated as values and can be passed as arguments, returned, or assigned to variables |
| **Higher-order Functions** | Functions that take other functions as arguments or return them                                    |
| **Function Composition**   | Combining simple functions to build more complex ones                                              |
| **Declarative Code**       | Focus on what to do rather than how to do it                                                       |

## Important Concepts

### Pure Function

A function that:

- **Does not modify any external state**
- **Produces no side effects**
- **Always returns the same result given the same input**

```javascript
// Pure function example
function add(a, b) {
  return a + b;
}
```

### Immutability

Data structures are not modified after creation. Instead, new versions are created.

```javascript
const arr = [1, 2, 3];
const newArr = arr.concat(4); // arr remains unchanged
```

### First-class Functions

Functions can be assigned to variables, passed as arguments, and returned from other functions.

```javascript
const greet = () => "Hello";
const say = greet;
console.log(say()); // Output: Hello
```

### Higher-order Functions

```javascript
function applyOperation(arr, operation) {
  return arr.map(operation);
}
console.log(applyOperation([1, 2, 3], (x) => x * 2)); // Output: [2, 4, 6]
```

### Function Composition

Combining functions to build complex operations.

```javascript
const multiply = (x) => x * 2;
const increment = (x) => x + 1;
const composed = (x) => increment(multiply(x));
console.log(composed(3)); // Output: 7
```

## FP vs OOP

| Feature           | Functional Programming                       | Object-Oriented Programming                           |
| ----------------- | -------------------------------------------- | ----------------------------------------------------- |
| State management  | Immutable                                    | Mutable                                               |
| Data + Behavior   | Functions and data are separate              | Encapsulation: behavior and data grouped in objects   |
| Side effects      | Avoided                                      | Often used                                            |
| Concurrency       | Easier due to immutability                   | Harder due to shared mutable state                    |
| Code organization | Declarative, emphasizes function composition | Hierarchical, emphasizes class and object hierarchies |

## Key FP Concepts in Java (since Java 8)

- **Lambda expressions**
- **Streams API**
- **Functional interfaces (Predicate, Function, Consumer, etc.)**
- **Method references**

Example:

```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
List<Integer> doubled = numbers.stream()
                               .map(n -> n * 2)
                               .collect(Collectors.toList());
```

## Common Functional Patterns

- **Map**: Apply a function to each item in a collection
- **Filter**: Select items based on a predicate
- **Reduce**: Aggregate a collection into a single value
- **Currying**: Converting a function with multiple arguments into a sequence of functions each with a single argument

Example (JavaScript reduce):

```javascript
const sum = [1, 2, 3, 4].reduce((acc, val) => acc + val, 0);
console.log(sum); // Output: 10
```

## Functional Programming Best Practices

- Favor **pure functions** and **immutability**
- Use **higher-order functions** for abstraction
- Prefer **function composition** over deeply nested function calls
- **Minimize side effects** and isolate them when necessary
- Write **small, reusable functions**

## Summary

Functional Programming encourages writing clean, predictable, and modular code by avoiding mutable state and side effects. Mastering FP concepts can greatly improve code quality, especially for applications requiring high scalability and concurrency.
