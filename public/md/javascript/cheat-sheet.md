# JavaScript Quick Reference Cheat Sheet

## Variables and Data Types

```javascript
// Variable declarations
let variable = "mutable";
const constant = "immutable";
var oldStyle = "function-scoped";

// Primitive types
let string = "text";
let number = 42;
let boolean = true;
let nullValue = null;
let undefinedValue = undefined;
let symbol = Symbol("unique");
let bigint = 123n;

// Reference types
let object = { key: "value" };
let array = [1, 2, 3];
let func = function () {
  return "hello";
};
```

## Functions

```javascript
// Function declaration
function regularFunction(a, b) {
  return a + b;
}

// Arrow functions
const arrowFunction = (a, b) => a + b;
const singleParam = (x) => x * 2;
const noParams = () => "hello";

// Higher-order functions
const map = (arr) => (fn) => arr.map(fn);
const filter = (arr) => (predicate) => arr.filter(predicate);

// Destructuring parameters
const greet = ({ name, age = 25 }) => `Hello ${name}, you are ${age}`;
```

## Objects and Arrays

```javascript
// Object creation and manipulation
const obj = { a: 1, b: 2 };
const { a, b } = obj; // Destructuring
const newObj = { ...obj, c: 3 }; // Spread

// Array methods (immutable)
const arr = [1, 2, 3, 4, 5];
arr.map((x) => x * 2); // [2, 4, 6, 8, 10]
arr.filter((x) => x > 2); // [3, 4, 5]
arr.reduce((sum, x) => sum + x, 0); // 15
arr.find((x) => x > 3); // 4
arr.some((x) => x > 3); // true
arr.every((x) => x > 0); // true

// Array destructuring
const [first, second, ...rest] = arr;
```

## Asynchronous JavaScript

```javascript
// Promises
const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve("data"), 1000);
  });
};

// Async/await
async function getData() {
  try {
    const data = await fetchData();
    return data;
  } catch (error) {
    console.error(error);
  }
}

// Promise methods
Promise.all([promise1, promise2]);
Promise.race([promise1, promise2]);
Promise.allSettled([promise1, promise2]);
```

## ES6+ Features

```javascript
// Template literals
const name = "World";
const greeting = `Hello, ${name}!`;

// Default parameters
function greet(name = "Guest") {
  return `Hello, ${name}`;
}

// Rest/Spread operators
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}
const newArray = [...oldArray, 4, 5, 6];

// Classes
class Person {
  constructor(name) {
    this.name = name;
  }

  greet() {
    return `Hello, I'm ${this.name}`;
  }
}

// Modules
export const utility = () => "helper";
export default class MainClass {}
import MainClass, { utility } from "./module.js";
```

## Common Patterns

```javascript
// Immediately Invoked Function Expression (IIFE)
(function () {
  // Private scope
})();

// Module pattern
const module = (function () {
  let privateVar = 0;

  return {
    increment: () => ++privateVar,
    getCount: () => privateVar,
  };
})();

// Factory function
function createUser(name, email) {
  return {
    name,
    email,
    greet() {
      return `Hello, I'm ${this.name}`;
    },
  };
}

// Currying
const multiply = (a) => (b) => a * b;
const double = multiply(2);
const triple = multiply(3);
```

## DOM Manipulation

```javascript
// Element selection
const element = document.getElementById("myId");
const elements = document.querySelectorAll(".myClass");
const single = document.querySelector(".myClass");

// Event handling
element.addEventListener("click", (event) => {
  event.preventDefault();
  console.log("Clicked!");
});

// Creating and modifying elements
const newDiv = document.createElement("div");
newDiv.textContent = "Hello World";
newDiv.classList.add("my-class");
document.body.appendChild(newDiv);

// Modern fetch API
fetch("/api/data")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

## Error Handling

```javascript
// Try-catch with async/await
async function safeAsyncOperation() {
  try {
    const result = await riskyOperation();
    return result;
  } catch (error) {
    console.error("Operation failed:", error);
    throw new Error("Custom error message");
  } finally {
    console.log("Cleanup code");
  }
}

// Custom error types
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}
```

## Useful Built-in Methods

```javascript
// String methods
"hello world".charAt(0); // "h"
"hello world".substring(0, 5); // "hello"
"hello world".split(" "); // ["hello", "world"]
"  hello  ".trim(); // "hello"
"hello".toUpperCase(); // "HELLO"

// Number methods
Number.isInteger(42); // true
Number.isNaN(NaN); // true
parseInt("42px"); // 42
parseFloat("3.14"); // 3.14

// Array utility methods
Array.from("hello"); // ["h", "e", "l", "l", "o"]
Array.isArray([1, 2, 3]); // true

// Object methods
Object.keys(obj); // ["key1", "key2"]
Object.values(obj); // ["value1", "value2"]
Object.entries(obj); // [["key1", "value1"], ["key2", "value2"]]
Object.assign({}, obj); // Shallow copy
```

## Regular Expressions

```javascript
// Basic patterns
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;

// Usage
const email = "user@example.com";
emailRegex.test(email); // true
email.match(emailRegex); // Array with match details
email.replace(emailRegex, "***"); // Replace with stars
```

## Performance Tips

```javascript
// Use const/let instead of var
const data = getData();

// Avoid global variables
(function () {
  const localVar = "contained";
})();

// Debounce expensive operations
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Use object/array destructuring
const { name, age } = user;
const [first, ...rest] = array;

// Prefer map/filter/reduce over loops
const doubled = numbers.map((n) => n * 2);
const evens = numbers.filter((n) => n % 2 === 0);
```

## Common Interview Concepts

```javascript
// Closure example
function counter() {
  let count = 0;
  return function () {
    return ++count;
  };
}

// Prototype inheritance
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function () {
  return `${this.name} makes a sound`;
};

// Event delegation
document.addEventListener("click", (event) => {
  if (event.target.matches(".button")) {
    handleButtonClick(event);
  }
});

// Deep clone
function deepClone(obj) {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof Array) return obj.map(deepClone);

  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}
```

---

_This cheat sheet covers the most commonly used JavaScript features and patterns for quick reference during development and interviews._
