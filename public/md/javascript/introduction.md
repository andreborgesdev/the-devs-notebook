# JavaScript

## Overview

**JavaScript (JS)** is a high-level, interpreted programming language primarily known for enabling interactive web pages. It follows a **multi-paradigm** approach, supporting **object-oriented**, **functional**, and **event-driven** programming.

JavaScript is the **de facto language for web development**, running in browsers and widely used on servers (Node.js).

## Key Features

| Feature               | Description                                                 |
| --------------------- | ----------------------------------------------------------- |
| Dynamic Typing        | Types are determined at runtime                             |
| First-Class Functions | Functions are treated as variables and can be passed around |
| Event-Driven          | Especially useful for UI and asynchronous operations        |
| Prototype-Based       | Inheritance is achieved via prototypes                      |
| Multi-Paradigm        | Supports functional, OOP, and imperative styles             |
| Asynchronous Support  | Via callbacks, promises, and async/await                    |
| Cross-Platform        | Runs in browsers, servers, desktops, and even IoT devices   |

## Basic Syntax

```javascript
// Variables
let x = 5;
const y = 10;

// Function
function add(a, b) {
  return a + b;
}

// Arrow Function
const multiply = (a, b) => a * b;

console.log(add(2, 3)); // 5
console.log(multiply(2, 3)); // 6
```

## Data Types

- **Primitive**: Number, String, Boolean, null, undefined, Symbol, BigInt
- **Non-Primitive**: Objects, Arrays, Functions

```javascript
let name = "John"; // String
let age = 30; // Number
let active = true; // Boolean
let person = { name: "Alice", age: 25 }; // Object
```

## Control Structures

```javascript
if (x > y) {
  console.log("x is greater");
} else {
  console.log("y is greater");
}

for (let i = 0; i < 5; i++) {
  console.log(i);
}
```

## Functions

```javascript
// Function Declaration
function greet(name) {
  return `Hello, ${name}`;
}

// Function Expression
const farewell = function (name) {
  return `Goodbye, ${name}`;
};
```

## Objects and Arrays

```javascript
let car = {
  brand: "Toyota",
  model: "Corolla",
  year: 2020,
};

let fruits = ["Apple", "Banana", "Cherry"];
```

## ES6+ Features

- **let** and **const**
- Arrow functions `()=>{}`
- Template literals `` `Hello, ${name}` ``
- Destructuring

```javascript
const { brand, model } = car;
```

- Spread/rest operators

```javascript
const newFruits = [...fruits, "Date"];
```

- Default parameters

```javascript
function greet(name = "Guest") {
  return `Hello, ${name}`;
}
```

- Modules (`import` / `export`)

```javascript
export function sum(a, b) {
  return a + b;
}
import { sum } from "./utils.js";
```

## Asynchronous JavaScript

### Callbacks

```javascript
function fetchData(callback) {
  setTimeout(() => callback("Data received"), 1000);
}
```

### Promises

```javascript
let promise = new Promise((resolve, reject) => {
  resolve("Success");
});

promise.then((result) => console.log(result));
```

### Async/Await

```javascript
async function fetchData() {
  return "Data received";
}

fetchData().then(console.log);
```

## Prototype and Inheritance

```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function () {
  return `Hello, ${this.name}`;
};

let p = new Person("Alice");
console.log(p.greet());
```

## Classes (ES6)

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return `${this.name} makes a noise`;
  }
}

let dog = new Animal("Dog");
console.log(dog.speak());
```

## Closures

```javascript
function outer() {
  let count = 0;
  return function inner() {
    count++;
    return count;
  };
}

const counter = outer();
console.log(counter()); // 1
console.log(counter()); // 2
```

## Event Loop

JavaScript uses a **single-threaded event loop** model to handle asynchronous operations. The event loop picks tasks from the queue and executes them in the order they arrive.

## Common Built-in Objects

| Object | Purpose                       |
| ------ | ----------------------------- |
| Math   | Math operations               |
| Date   | Date and time manipulation    |
| JSON   | Parsing and stringifying JSON |
| RegExp | Regular expressions           |

## DOM Manipulation (Browser)

```javascript
document.getElementById("myId").innerText = "Hello!";
```

## JavaScript in System Design

| Use Case            | Notes                                                 |
| ------------------- | ----------------------------------------------------- |
| Frontend UI         | Primary language for browser-based user interfaces    |
| Backend Development | Node.js allows JavaScript on the server-side          |
| Real-time Apps      | WebSockets, Server-Sent Events, long polling          |
| Microservices       | Lightweight services with frameworks like Express.js  |
| Serverless          | AWS Lambda, Google Cloud Functions support JavaScript |

## Tools and Frameworks

| Category           | Examples                    |
| ------------------ | --------------------------- |
| Frontend           | React, Angular, Vue         |
| Backend            | Node.js, Express.js, NestJS |
| Testing            | Jest, Mocha, Jasmine        |
| Build Tools        | Webpack, Babel, Rollup      |
| Package Manager    | npm, yarn                   |
| Linting/Formatting | ESLint, Prettier            |

## Best Practices

- Use `const` and `let` over `var`
- Prefer **arrow functions** where appropriate
- Avoid deep nesting
- Handle asynchronous code with **async/await**
- Always handle errors in promises
- Keep code modular and DRY (Don't Repeat Yourself)

## Summary

JavaScript is a versatile, high-level language essential for modern web and full-stack development. Its flexibility, powerful ecosystem, and active community make it indispensable for both frontend and backend developers.
