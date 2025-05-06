# JavaScript Interview Questions

## Fundamentals

What are the different data types in JavaScript?
Primitive types include String, Number, Boolean, Null, Undefined, Symbol, and BigInt. Non-primitive types include Object, Array, and Function.

What is the difference between `==` and `===`?
`==` checks for value equality with type coercion, while `===` checks for both value and type equality without coercion.

What is hoisting?
Hoisting is JavaScript’s behavior of moving declarations to the top of their scope before code execution.

What are the differences between `var`, `let`, and `const`?
`var` is function-scoped and hoisted. `let` and `const` are block-scoped, with `const` also preventing reassignment.

## Functions and Scope

What is a closure?
A closure is a function that retains access to its lexical scope even when executed outside its original scope.

What is the difference between function declarations and function expressions?
Function declarations are hoisted, while function expressions are not.

How does `this` behave in regular functions vs. arrow functions?
In regular functions, `this` refers to the calling object. In arrow functions, `this` is lexically bound to its enclosing scope.

What is the purpose of `bind()`, `call()`, and `apply()`?
`bind()` creates a new function with a specified `this`. `call()` and `apply()` invoke a function with a specified `this` and arguments, with `apply()` accepting an array of arguments.

## Objects and Prototypes

What is prototypal inheritance?
Objects can inherit properties and methods from other objects via the prototype chain.

What is the difference between `Object.create()` and constructor functions?
`Object.create()` creates a new object with a specified prototype, while constructor functions use the `new` keyword to create and initialize objects.

What is the difference between `Object.assign()` and the spread operator?
Both copy properties from one object to another, but the spread operator provides a more concise syntax and can also spread elements into arrays.

## Asynchronous JavaScript

What is the event loop?
The event loop handles asynchronous operations by pushing callbacks to the message queue and executing them once the call stack is clear.

What are Promises?
Promises represent the eventual completion or failure of an asynchronous operation and its resulting value.

Explain `async/await`.
`async/await` syntax simplifies working with Promises, allowing asynchronous code to be written in a synchronous style.

What is the difference between microtasks and macrotasks?
Microtasks (e.g., Promises) have higher priority and execute before macrotasks (e.g., `setTimeout` callbacks).

## Advanced Topics

What is the difference between `null` and `undefined`?
`null` represents an explicitly assigned "no value", while `undefined` means a variable has been declared but not assigned a value.

What is currying?
Currying is the process of transforming a function with multiple arguments into a series of functions that take one argument at a time.

What is memoization?
Memoization is an optimization technique where the results of expensive function calls are cached for future use.

Explain debouncing and throttling.
Debouncing delays execution until a certain amount of time has passed without triggering the event again. Throttling ensures that a function is only called once in a specified period.

What are generators and how do they differ from regular functions?
Generators are functions that can pause execution using the `yield` keyword and resume later, enabling iterative control over function execution.

## ES6+ Features

What are template literals?
Template literals allow embedded expressions and multi-line strings using backticks.

What is destructuring?
Destructuring is a syntax for extracting values from arrays or properties from objects into distinct variables.

What are arrow functions?
Arrow functions provide a shorter syntax for writing functions and lexically bind the `this` value.

What are `Map` and `Set`?
`Map` is a collection of key-value pairs where keys can be any type. `Set` is a collection of unique values.

What is the difference between `for...in` and `for...of` loops?
`for...in` iterates over enumerable properties of an object. `for...of` iterates over iterable objects like arrays.

## Modules and Tooling

What is the difference between CommonJS and ES6 modules?
CommonJS uses `require()` and `module.exports`, while ES6 modules use `import` and `export` statements.

What are bundlers and why are they used?
Bundlers like Webpack and Rollup combine multiple JavaScript files into one or more bundles, optimizing load time and resource management.

What is tree shaking?
Tree shaking is a feature of modern bundlers that eliminates unused code from the final bundle.

## Performance and Memory

What is memory leak and how can it occur in JavaScript?
A memory leak occurs when objects are no longer needed but are not released, often due to lingering references like closures or global variables.

What are some ways to optimize JavaScript performance?
Minimizing DOM manipulations, debouncing or throttling expensive functions, using efficient algorithms, lazy loading, and leveraging modern JavaScript features.
