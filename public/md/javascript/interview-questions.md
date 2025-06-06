# JavaScript Interview Questions - Essential Topics

This gui## Variable Declarations and Hoisting

### What is hoisting?

Hoisting is JavaScript's behavior of moving variable and function declarations to the top of their scope during compilation, before code execution.

```javascript
// Variable hoisting
console.log(x); // undefined (not ReferenceError)
var x = 5;

// Equivalent to:
var x;
console.log(x); // undefined
x = 5;

// Function hoisting
sayHello(); // "Hello!" - works due to hoisting

function sayHello() {
  return "Hello!";
}
```

### What are the differences between `var`, `let`, and `const`?

| Feature                | `var`                            | `let`            | `const`          |
| ---------------------- | -------------------------------- | ---------------- | ---------------- |
| **Scope**              | Function or global               | Block            | Block            |
| **Hoisting**           | Yes (initialized with undefined) | Yes (but in TDZ) | Yes (but in TDZ) |
| **Reassignment**       | Yes                              | Yes              | No               |
| **Redeclaration**      | Yes                              | No               | No               |
| **Temporal Dead Zone** | No                               | Yes              | Yes              |

````javascript
// var - function scoped
function example() {
  if (true) {
    var x = 1;
  }
  console.log(x); // 1 - accessible outside block
}

// let - block scoped
function example() {
  if (true) {
    let y = 1;
  }
  console.log(y); // ReferenceError: y is not defined
}

// const - block scoped, no reassignment
const name = "John";
name = "Jane"; // TypeError: Assignment to constant variable

// But object content can change
const user = { name: "John" };
user.name = "Jane"; // Valid - object content can change
```vers fundamental JavaScript interview questions that are commonly asked in technical interviews. For comprehensive interview preparation with detailed explanations and advanced topics, see our [Comprehensive Interview Questions](./comprehensive-interview-questions.md) guide.

> **Quick Reference**: Check out our [JavaScript Cheat Sheet](./cheat-sheet.md) for quick syntax lookup during interviews.

## Data Types and Type System

### What are the different data types in JavaScript?
JavaScript has **8 data types**:
- **Primitive types (7)**: String, Number, Boolean, null, undefined, Symbol, BigInt
- **Non-primitive types (1)**: Object (includes arrays, functions, dates, etc.)

```javascript
// Primitive types
typeof "hello"      // "string"
typeof 42           // "number"
typeof true         // "boolean"
typeof null         // "object" (historical bug)
typeof undefined    // "undefined"
typeof Symbol('id') // "symbol"
typeof 123n         // "bigint"

// Non-primitive type
typeof {}           // "object"
typeof []           // "object"
typeof function(){} // "function"
````

### What is the difference between `==` and `===`?

- `==` performs **loose equality** with type coercion
- `===` performs **strict equality** without type coercion

```javascript
// Loose equality (==) - with type coercion
"5" == 5; // true
0 == false; // true
null == undefined; // true

// Strict equality (===) - no type coercion
"5" === 5; // false
0 === false; // false
null === undefined; // false
```

### What is type coercion in JavaScript?

Type coercion is the automatic or implicit conversion of values from one data type to another.

```javascript
// Implicit coercion
"5" + 3; // "53" (number to string)
"5" - 3; // 2 (string to number)
"5" * "3"; // 15 (both to numbers)
!!"hello"; // true (string to boolean)

// Explicit coercion
Number("123"); // 123
String(123); // "123"
Boolean(0); // false
```

What is hoisting?
Hoisting is JavaScript’s behavior of moving declarations to the top of their scope before code execution.

What are the differences between `var`, `let`, and `const`?
`var` is function-scoped and hoisted. `let` and `const` are block-scoped, with `const` also preventing reassignment.

## Functions and Scope

### What is a closure?

A closure is a function that retains access to variables from its outer (lexical) scope even after the outer function has finished executing.

```javascript
function outerFunction(x) {
  // Outer scope variable
  return function innerFunction(y) {
    // Inner function has access to 'x'
    return x + y;
  };
}

const addFive = outerFunction(5);
console.log(addFive(3)); // 8

// Practical example - private variables
function createCounter() {
  let count = 0;

  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count,
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.getCount()); // 1
// count is not accessible directly
```

### What is the difference between function declarations and function expressions?

```javascript
// Function Declaration - hoisted
console.log(declaredFunction()); // "I'm declared!" - works

function declaredFunction() {
  return "I'm declared!";
}

// Function Expression - not hoisted
console.log(expressedFunction()); // TypeError: expressedFunction is not a function

var expressedFunction = function () {
  return "I'm expressed!";
};

// Arrow Function Expression - not hoisted
const arrowFunction = () => "I'm an arrow!";
```

### How does `this` behave in regular functions vs. arrow functions?

```javascript
const obj = {
  name: "John",

  // Regular function - 'this' refers to the calling object
  regularMethod: function () {
    console.log(this.name); // "John"

    setTimeout(function () {
      console.log(this.name); // undefined (or global object)
    }, 100);
  },

  // Arrow function - 'this' is lexically bound
  arrowMethod: function () {
    console.log(this.name); // "John"

    setTimeout(() => {
      console.log(this.name); // "John" - inherits from outer scope
    }, 100);
  },
};
```

### What is the purpose of `bind()`, `call()`, and `apply()`?

These methods allow you to explicitly set the `this` context and pass arguments to functions.

```javascript
const person = {
  name: "John",
  age: 30,
};

function introduce(greeting, punctuation) {
  return `${greeting}, I'm ${this.name} and I'm ${this.age} years old${punctuation}`;
}

// call() - passes arguments individually
console.log(introduce.call(person, "Hello", "!"));
// "Hello, I'm John and I'm 30 years old!"

// apply() - passes arguments as an array
console.log(introduce.apply(person, ["Hi", "."]));
// "Hi, I'm John and I'm 30 years old."

// bind() - creates a new function with bound context
const boundIntroduce = introduce.bind(person);
console.log(boundIntroduce("Hey", "!!!"));
// "Hey, I'm John and I'm 30 years old!!!"
```

## Objects and Inheritance

### What is prototypal inheritance?

JavaScript objects inherit properties and methods from other objects through the prototype chain.

```javascript
// Constructor function
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function () {
  return `Hello, I'm ${this.name}`;
};

function Developer(name, language) {
  Person.call(this, name); // Call parent constructor
  this.language = language;
}

// Set up inheritance
Developer.prototype = Object.create(Person.prototype);
Developer.prototype.constructor = Developer;

Developer.prototype.code = function () {
  return `${this.name} writes ${this.language}`;
};

const dev = new Developer("John", "JavaScript");
console.log(dev.greet()); // "Hello, I'm John" (inherited)
console.log(dev.code()); // "John writes JavaScript"
```

### What is the difference between `Object.create()` and constructor functions?

```javascript
// Object.create() - creates object with specified prototype
const personPrototype = {
  greet() {
    return `Hello, I'm ${this.name}`;
  },
};

const person1 = Object.create(personPrototype);
person1.name = "Alice";

// Constructor function - creates and initializes object
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function () {
  return `Hello, I'm ${this.name}`;
};

const person2 = new Person("Bob");
```

### What is the difference between `Object.assign()` and the spread operator?

```javascript
const source = { a: 1, b: 2 };
const target = { c: 3 };

// Object.assign() - mutates target object
Object.assign(target, source);
console.log(target); // { c: 3, a: 1, b: 2 }

// Spread operator - creates new object
const newObj = { ...target, ...source };
console.log(newObj); // { c: 3, a: 1, b: 2 }

// For arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

// Spread creates new array
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]
```

### What are the different ways to create objects in JavaScript?

```javascript
// 1. Object literal
const obj1 = { name: "John", age: 30 };

// 2. Constructor function
function Person(name, age) {
  this.name = name;
  this.age = age;
}
const obj2 = new Person("Jane", 25);

// 3. Object.create()
const obj3 = Object.create({
  greet() {
    return "Hello";
  },
});

// 4. ES6 Classes
class User {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}
const obj4 = new User("Bob", 35);

// 5. Factory function
function createPerson(name, age) {
  return { name, age };
}
const obj5 = createPerson("Alice", 28);
```

## Asynchronous JavaScript

### What is the event loop?

The event loop is the mechanism that handles asynchronous operations in JavaScript's single-threaded environment.

```javascript
// Event loop execution order
console.log("1"); // Synchronous - executes immediately

setTimeout(() => {
  console.log("2"); // Macro task - goes to task queue
}, 0);

Promise.resolve().then(() => {
  console.log("3"); // Micro task - goes to microtask queue
});

console.log("4"); // Synchronous - executes immediately

// Output: 1, 4, 3, 2
// Microtasks have higher priority than macrotasks
```

### What are Promises and how do they work?

Promises represent the eventual completion or failure of an asynchronous operation.

```javascript
// Creating a Promise
const fetchData = new Promise((resolve, reject) => {
  setTimeout(() => {
    const success = Math.random() > 0.5;
    if (success) {
      resolve("Data loaded successfully");
    } else {
      reject(new Error("Failed to load data"));
    }
  }, 1000);
});

// Using Promises
fetchData
  .then((data) => {
    console.log(data);
    return "processed data";
  })
  .then((processedData) => {
    console.log(processedData);
  })
  .catch((error) => {
    console.error("Error:", error.message);
  })
  .finally(() => {
    console.log("Cleanup completed");
  });
```

### Explain `async/await` syntax

`async/await` provides a more readable way to work with Promises, making asynchronous code look synchronous.

```javascript
// Traditional Promise chain
function fetchUserData() {
  return fetchUser()
    .then((user) => {
      return fetchUserPosts(user.id);
    })
    .then((posts) => {
      return { user, posts };
    })
    .catch((error) => {
      console.error("Error:", error);
      throw error;
    });
}

// Using async/await
async function fetchUserData() {
  try {
    const user = await fetchUser();
    const posts = await fetchUserPosts(user.id);
    return { user, posts };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// Multiple async operations
async function loadAllData() {
  try {
    // Sequential execution
    const user = await fetchUser();
    const posts = await fetchPosts();

    // Parallel execution
    const [profile, settings] = await Promise.all([
      fetchProfile(user.id),
      fetchSettings(user.id),
    ]);

    return { user, posts, profile, settings };
  } catch (error) {
    console.error("Failed to load data:", error);
  }
}
```

### What is the difference between callbacks, Promises, and async/await?

```javascript
// 1. Callbacks - can lead to callback hell
function fetchUserCallback(userId, callback) {
  setTimeout(() => {
    const user = { id: userId, name: "John" };
    callback(null, user);
  }, 1000);
}

fetchUserCallback(1, (err, user) => {
  if (err) {
    console.error(err);
  } else {
    fetchUserPosts(user.id, (err, posts) => {
      if (err) {
        console.error(err);
      } else {
        // More nesting...
      }
    });
  }
});

// 2. Promises - chainable
function fetchUserPromise(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ id: userId, name: "John" });
    }, 1000);
  });
}

fetchUserPromise(1)
  .then((user) => fetchUserPosts(user.id))
  .then((posts) => console.log(posts))
  .catch((error) => console.error(error));

// 3. Async/await - most readable
async function fetchUserAsync(userId) {
  try {
    const user = await fetchUserPromise(userId);
    const posts = await fetchUserPosts(user.id);
    console.log(posts);
  } catch (error) {
    console.error(error);
  }
}
```

What is the difference between microtasks and macrotasks?
Microtasks (e.g., Promises) have higher priority and execute before macrotasks (e.g., `setTimeout` callbacks).

## ES6+ Modern Features

### What are arrow functions and how do they differ from regular functions?

```javascript
// Regular function
function regularFunction(a, b) {
  console.log(arguments); // Has arguments object
  return a + b;
}

// Arrow function
const arrowFunction = (a, b) => {
  // console.log(arguments); // ReferenceError: arguments is not defined
  return a + b;
};

// Key differences:
// 1. 'this' binding
const obj = {
  name: "John",
  regularMethod: function () {
    setTimeout(function () {
      console.log(this.name); // undefined (lost context)
    }, 100);
  },
  arrowMethod: function () {
    setTimeout(() => {
      console.log(this.name); // "John" (lexical this)
    }, 100);
  },
};

// 2. Cannot be used as constructors
const ArrowConstructor = () => {};
// new ArrowConstructor(); // TypeError
```

### What is destructuring assignment?

```javascript
// Array destructuring
const colors = ["red", "green", "blue"];
const [primary, secondary, tertiary] = colors;

// With default values
const [first, second, third = "yellow"] = ["red", "green"];

// Rest pattern
const [head, ...tail] = [1, 2, 3, 4, 5];
console.log(head); // 1
console.log(tail); // [2, 3, 4, 5]

// Object destructuring
const person = { name: "John", age: 30, city: "New York" };
const { name, age, city: location } = person;

// Nested destructuring
const user = {
  id: 1,
  profile: {
    name: "John",
    contact: {
      email: "john@example.com",
    },
  },
};

const {
  profile: {
    name: userName,
    contact: { email },
  },
} = user;
```

### What are template literals and their benefits?

```javascript
// Traditional string concatenation
const name = "John";
const age = 30;
const message = "Hello, my name is " + name + " and I'm " + age + " years old.";

// Template literals
const messageTemplate = `Hello, my name is ${name} and I'm ${age} years old.`;

// Multi-line strings
const multiLine = `
  This is a
  multi-line string
  with proper formatting
`;

// Expression evaluation
const price = 19.99;
const tax = 0.08;
const total = `Total: $${(price * (1 + tax)).toFixed(2)}`;

// Tagged templates
function highlight(strings, ...values) {
  return strings.reduce((result, string, i) => {
    const value = values[i] ? `<mark>${values[i]}</mark>` : "";
    return result + string + value;
  }, "");
}

const highlighted = highlight`Hello ${name}, you are ${age} years old!`;
```

## Error Handling and Debugging

### How do you handle errors in JavaScript?

```javascript
// Try-catch for synchronous code
try {
  const result = JSON.parse(invalidJson);
} catch (error) {
  console.error("JSON parsing failed:", error.message);
} finally {
  console.log("Cleanup code here");
}

// Async error handling
async function fetchData() {
  try {
    const response = await fetch("/api/data");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error; // Re-throw to let caller handle
  }
}

// Promise error handling
fetchData()
  .then((data) => console.log(data))
  .catch((error) => console.error("Application error:", error));

// Custom error types
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

function validateEmail(email) {
  if (!email.includes("@")) {
    throw new ValidationError("Invalid email format", "email");
  }
}
```

### What are common debugging techniques?

```javascript
// Console methods
console.log("Basic logging");
console.warn("Warning message");
console.error("Error message");
console.table([
  { name: "John", age: 30 },
  { name: "Jane", age: 25 },
]);
console.time("operation");
// ... some operation
console.timeEnd("operation");

// Debugging with breakpoints
function complexFunction(data) {
  debugger; // Browser will pause here when dev tools are open

  const processed = data.map((item) => {
    // Processing logic
    return item * 2;
  });

  return processed;
}

// Stack traces
function func1() {
  func2();
}

function func2() {
  func3();
}

function func3() {
  console.trace("Call stack trace");
}

func1();
```

## Advanced Concepts

### What is event delegation?

```javascript
// Instead of adding listeners to each button
const buttons = document.querySelectorAll("button");
buttons.forEach((button) => {
  button.addEventListener("click", handleClick);
});

// Use event delegation on parent
document.getElementById("container").addEventListener("click", function (e) {
  if (e.target.tagName === "BUTTON") {
    handleClick(e);
  }
});

// Benefits:
// 1. Better performance with many elements
// 2. Works with dynamically added elements
// 3. Less memory usage
```

### What is the difference between shallow and deep copying?

```javascript
const original = {
  name: "John",
  address: {
    city: "New York",
    country: "USA",
  },
  hobbies: ["reading", "coding"],
};

// Shallow copy - only first level is copied
const shallowCopy = { ...original };
shallowCopy.address.city = "Boston"; // Modifies original too!

const shallowCopy2 = Object.assign({}, original);

// Deep copy methods
// 1. JSON methods (limitations: no functions, dates become strings, etc.)
const deepCopy1 = JSON.parse(JSON.stringify(original));

// 2. Manual deep copy function
function deepCopy(obj) {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof Array) return obj.map((item) => deepCopy(item));
  if (typeof obj === "object") {
    const copy = {};
    Object.keys(obj).forEach((key) => {
      copy[key] = deepCopy(obj[key]);
    });
    return copy;
  }
}

const deepCopy2 = deepCopy(original);

// 3. Using libraries like Lodash
// const deepCopy3 = _.cloneDeep(original);
```

## Performance and Best Practices

### What are some JavaScript performance optimization techniques?

```javascript
// 1. Debouncing expensive operations
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

const expensiveSearch = debounce((query) => {
  // Expensive search operation
  searchAPI(query);
}, 300);

// 2. Throttling for frequent events
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

const throttledScroll = throttle(() => {
  // Handle scroll event
}, 100);

// 3. Efficient DOM manipulation
// Bad - causes multiple reflows
for (let i = 0; i < 1000; i++) {
  document.body.appendChild(document.createElement("div"));
}

// Good - single reflow
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  fragment.appendChild(document.createElement("div"));
}
document.body.appendChild(fragment);

// 4. Memory leak prevention
class EventManager {
  constructor() {
    this.listeners = [];
  }

  addListener(element, event, handler) {
    element.addEventListener(event, handler);
    this.listeners.push({ element, event, handler });
  }

  cleanup() {
    this.listeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this.listeners = [];
  }
}
```

## Related Resources

For more in-depth coverage of these topics and advanced concepts, explore:

- 📖 [JavaScript Fundamentals](./fundamentals.md) - Comprehensive language basics
- 🔧 [Functions and Scope](./functions-and-scope.md) - Advanced function concepts
- 🔄 [Asynchronous JavaScript](./asynchronous-javascript.md) - Complete async programming guide
- 💼 [Comprehensive Interview Questions](./comprehensive-interview-questions.md) - Detailed technical interview preparation
- 📋 [JavaScript Cheat Sheet](./cheat-sheet.md) - Quick reference for interviews
- 📚 [JavaScript Index](./index.md) - Complete learning roadmap

These fundamental concepts form the foundation for JavaScript technical interviews. Practice implementing these patterns and be prepared to explain the reasoning behind different approaches.
