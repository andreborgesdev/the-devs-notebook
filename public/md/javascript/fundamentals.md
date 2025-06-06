# JavaScript Fundamentals

## Overview

**JavaScript (JS)** is a high-level, interpreted programming language that was originally designed to make web pages interactive. Today, it's a versatile, multi-paradigm language that powers modern web development, server-side applications, mobile apps, and more.

### Core Characteristics

- **Dynamically Typed**: Variable types are determined at runtime
- **Interpreted**: No compilation step required
- **Prototype-Based**: Object inheritance through prototypes
- **Multi-Paradigm**: Supports functional, object-oriented, and imperative programming
- **First-Class Functions**: Functions are treated as values
- **Event-Driven**: Built for handling user interactions and asynchronous operations

## JavaScript Engine and Execution

### V8 Engine Architecture

JavaScript engines like V8 (Chrome, Node.js) consist of:

- **Memory Heap**: Where memory allocation happens
- **Call Stack**: Where execution contexts are stored
- **Event Loop**: Handles asynchronous operations
- **Callback Queue**: Queues callback functions

### Execution Context

Every JavaScript code runs inside an execution context containing:

- **Variable Environment**: var declarations and function declarations
- **Lexical Environment**: let/const declarations and outer environment reference
- **This Binding**: Reference to the current object

```javascript
// Global Execution Context
var globalVar = "global";

function outerFunction() {
  // Function Execution Context
  var outerVar = "outer";

  function innerFunction() {
    // Another Function Execution Context
    var innerVar = "inner";
    console.log(globalVar, outerVar, innerVar);
  }

  innerFunction();
}

outerFunction();
```

## Data Types Deep Dive

### Primitive Types

#### Number

- **Range**: -(2^53 - 1) to 2^53 - 1
- **Special Values**: `Infinity`, `-Infinity`, `NaN`
- **Precision**: 64-bit floating point (IEEE 754)

```javascript
const integer = 42;
const float = 3.14159;
const scientific = 2.5e6; // 2,500,000
const binary = 0b1010; // 10 in decimal
const octal = 0o12; // 10 in decimal
const hex = 0xff; // 255 in decimal

// Special values
console.log(1 / 0); // Infinity
console.log(-1 / 0); // -Infinity
console.log(0 / 0); // NaN
console.log(Math.sqrt(-1)); // NaN

// Number methods
Number.isInteger(42); // true
Number.isNaN(NaN); // true
Number.parseFloat("3.14abc"); // 3.14
Number.parseInt("42px", 10); // 42
```

#### String

- **Encoding**: UTF-16
- **Immutable**: String operations create new strings
- **Template Literals**: Embedded expressions and multi-line support

```javascript
const single = "Single quotes";
const double = "Double quotes";
const template = `Template literal with ${single}`;
const multiline = `
    Multi-line
    string
`;

// String methods
"hello".charAt(1); // 'e'
"hello".indexOf("l"); // 2
"hello".slice(1, 4); // 'ell'
"hello".substring(1, 4); // 'ell'
"hello".substr(1, 3); // 'ell' (deprecated)
"HELLO".toLowerCase(); // 'hello'
"  hello  ".trim(); // 'hello'
"hello,world".split(","); // ['hello', 'world']
```

#### Boolean

```javascript
const isTrue = true;
const isFalse = false;

// Falsy values in JavaScript
Boolean(false); // false
Boolean(0); // false
Boolean(-0); // false
Boolean(0n); // false
Boolean(""); // false
Boolean(null); // false
Boolean(undefined); // false
Boolean(NaN); // false

// Everything else is truthy
Boolean("0"); // true
Boolean([]); // true
Boolean({}); // true
Boolean(function () {}); // true
```

#### null vs undefined

```javascript
let uninitialized; // undefined
const empty = null; // null

typeof undefined; // 'undefined'
typeof null; // 'object' (historical bug)

undefined == null; // true (type coercion)
undefined === null; // false (strict equality)
```

#### Symbol (ES6)

- **Unique**: Every Symbol is unique
- **Immutable**: Cannot be changed
- **Non-Enumerable**: Don't show up in for...in loops

```javascript
const sym1 = Symbol();
const sym2 = Symbol("description");
const sym3 = Symbol("description");

sym2 === sym3; // false (each Symbol is unique)

// Global Symbol registry
const globalSym1 = Symbol.for("shared");
const globalSym2 = Symbol.for("shared");
globalSym1 === globalSym2; // true

// Well-known symbols
const obj = {
  [Symbol.iterator]: function* () {
    yield 1;
    yield 2;
    yield 3;
  },
};

for (const value of obj) {
  console.log(value); // 1, 2, 3
}
```

#### BigInt (ES2020)

- **Purpose**: Arbitrary precision integers
- **Range**: Beyond Number.MAX_SAFE_INTEGER

```javascript
const bigInt1 = 123n;
const bigInt2 = BigInt(123);
const bigInt3 = BigInt("123");

// Operations
const sum = 123n + 456n; // 579n
const product = 123n * 456n; // 56088n

// Cannot mix with regular numbers
// 123n + 456; // TypeError
123n + BigInt(456); // 579n
```

### Non-Primitive Types

#### Objects

```javascript
// Object literal
const person = {
  name: "John",
  age: 30,
  "full-name": "John Doe", // Property names with special characters
  1: "numeric key", // Numeric keys are converted to strings

  // Method shorthand (ES6)
  greet() {
    return `Hello, I'm ${this.name}`;
  },

  // Computed property names (ES6)
  [Symbol.toStringTag]: "Person",
};

// Property access
person.name; // 'John'
person["name"]; // 'John'
person["full-name"]; // 'John Doe'

// Dynamic property access
const prop = "age";
person[prop]; // 30

// Object methods
Object.keys(person); // ['name', 'age', 'full-name', '1', 'greet']
Object.values(person); // ['John', 30, 'John Doe', 'numeric key', function]
Object.entries(person); // [['name', 'John'], ['age', 30], ...]
Object.hasOwnProperty.call(person, "name"); // true

// Property descriptors
Object.defineProperty(person, "id", {
  value: 123,
  writable: false,
  enumerable: false,
  configurable: false,
});

Object.getOwnPropertyDescriptor(person, "name");
// { value: 'John', writable: true, enumerable: true, configurable: true }
```

#### Arrays

```javascript
const arr = [1, 2, 3, "four", { five: 5 }];

// Array methods - Mutating
arr.push(6); // Add to end, returns new length
arr.pop(); // Remove from end, returns removed element
arr.unshift(0); // Add to beginning, returns new length
arr.shift(); // Remove from beginning, returns removed element
arr.splice(1, 2, "a", "b"); // Remove/add elements at index
arr.sort(); // Sort in place
arr.reverse(); // Reverse in place

// Array methods - Non-mutating
arr.concat([7, 8]); // Merge arrays
arr.slice(1, 3); // Extract portion
arr.join("-"); // Convert to string
arr.indexOf(2); // Find index
arr.includes(2); // Check existence

// Higher-order methods
[1, 2, 3, 4, 5]
  .filter((x) => x % 2 === 0) // [2, 4]
  .map((x) => x * 2) // [4, 8]
  .reduce((sum, x) => sum + x, 0); // 12

// Array iteration
const numbers = [1, 2, 3];
numbers.forEach((num, index) => console.log(index, num));

for (const num of numbers) console.log(num); // Values
for (const index in numbers) console.log(index); // Indices
```

## Variables and Scoping

### Variable Declarations

#### var (Function Scoped)

```javascript
function varExample() {
  if (true) {
    var x = 1;
  }
  console.log(x); // 1 - accessible outside block
}

// Hoisting with var
console.log(hoistedVar); // undefined (not error)
var hoistedVar = "hello";
```

#### let (Block Scoped)

```javascript
function letExample() {
  if (true) {
    let y = 1;
  }
  // console.log(y); // ReferenceError
}

// Temporal Dead Zone
console.log(temporalVar); // ReferenceError
let temporalVar = "hello";
```

#### const (Block Scoped, Immutable Binding)

```javascript
const PI = 3.14159;
// PI = 3.14; // TypeError

// Objects and arrays are mutable
const obj = { name: "John" };
obj.name = "Jane"; // Allowed
obj.age = 30; // Allowed

const arr = [1, 2, 3];
arr.push(4); // Allowed
```

### Scope Chain

```javascript
const global = "Global scope";

function outer() {
  const outerVar = "Outer scope";

  function inner() {
    const innerVar = "Inner scope";
    console.log(global, outerVar, innerVar); // Access all scopes
  }

  inner();
}

outer();
```

## Type System and Coercion

### Type Checking

```javascript
typeof 42; // 'number'
typeof "hello"; // 'string'
typeof true; // 'boolean'
typeof undefined; // 'undefined'
typeof null; // 'object' (historical bug)
typeof {}; // 'object'
typeof []; // 'object'
typeof function () {}; // 'function'
typeof Symbol(); // 'symbol'
typeof 123n; // 'bigint'

// Better type checking
Array.isArray([]); // true
Number.isNaN(NaN); // true
Number.isInteger(42); // true
```

### Type Coercion

```javascript
// Implicit coercion
"5" + 3; // '53' (string concatenation)
"5" - 3; // 2 (numeric subtraction)
"5" * 3; // 15 (numeric multiplication)
true + 1; // 2
false + 1; // 1
null + 1; // 1
undefined + 1; // NaN

// Explicit coercion
String(123); // '123'
Number("123"); // 123
Boolean(0); // false
parseInt("123px"); // 123
parseFloat("123.45px"); // 123.45
```

### Equality Comparisons

```javascript
// Loose equality (==) with type coercion
5 == "5"; // true
true == 1; // true
false == 0; // true
null == undefined; // true
"" == 0; // true
[] == 0; // true

// Strict equality (===) no coercion
5 === "5"; // false
true === 1; // false
null === undefined; // false

// Object.is() - "same value" equality
Object.is(0, -0); // false
Object.is(NaN, NaN); // true
0 === -0; // true
NaN === NaN; // false
```

## Control Flow

### Conditional Statements

```javascript
// if-else
const age = 18;
if (age >= 18) {
  console.log("Adult");
} else if (age >= 13) {
  console.log("Teenager");
} else {
  console.log("Child");
}

// Ternary operator
const status = age >= 18 ? "Adult" : "Minor";

// Switch statement
const day = "Monday";
switch (day) {
  case "Monday":
  case "Tuesday":
    console.log("Weekday");
    break;
  case "Saturday":
  case "Sunday":
    console.log("Weekend");
    break;
  default:
    console.log("Unknown day");
}
```

### Loops

```javascript
// for loop
for (let i = 0; i < 5; i++) {
  console.log(i);
}

// for...in (object properties)
const obj = { a: 1, b: 2, c: 3 };
for (const key in obj) {
  console.log(key, obj[key]);
}

// for...of (iterable values)
const arr = [1, 2, 3];
for (const value of arr) {
  console.log(value);
}

// while loop
let count = 0;
while (count < 5) {
  console.log(count);
  count++;
}

// do-while loop
do {
  console.log("Executed at least once");
} while (false);
```

### Error Handling

```javascript
try {
  // Risky code
  JSON.parse("invalid json");
} catch (error) {
  console.error("Parsing error:", error.message);
} finally {
  console.log("Cleanup code");
}

// Throwing custom errors
function divide(a, b) {
  if (b === 0) {
    throw new Error("Division by zero");
  }
  return a / b;
}

// Custom error types
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}
```

## Summary

JavaScript's fundamentals form the foundation for all advanced concepts. Understanding data types, scoping, type coercion, and control flow is crucial for writing effective JavaScript code and succeeding in technical interviews.
