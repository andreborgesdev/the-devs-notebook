# JavaScript Comprehensive Interview Questions

## Core Language Fundamentals

### Data Types and Variables

**Q: What are all the data types in JavaScript?**
A: **Primitive types**: String, Number, Boolean, null, undefined, Symbol (ES6), BigInt (ES2020)
**Non-primitive types**: Object (includes Array, Function, Date, RegExp, etc.)

```javascript
// Primitive examples
let str = "hello"; // String
let num = 42; // Number
let bool = true; // Boolean
let nothing = null; // null
let notDefined; // undefined
let sym = Symbol("id"); // Symbol
let bigNum = BigInt(123); // BigInt

// Non-primitive examples
let obj = { name: "John" }; // Object
let arr = [1, 2, 3]; // Array (type of Object)
let func = function () {}; // Function (type of Object)
```

**Q: What's the difference between `==` and `===`?**
A: `==` performs type coercion before comparison, `===` checks both value and type without coercion.

```javascript
console.log(5 == "5"); // true (coercion)
console.log(5 === "5"); // false (strict)
console.log(null == undefined); // true (special case)
console.log(null === undefined); // false
```

**Q: Explain hoisting in JavaScript.**
A: Hoisting moves variable and function declarations to the top of their scope. `var` declarations are hoisted and initialized with `undefined`, while `let/const` are hoisted but not initialized (temporal dead zone).

```javascript
console.log(x); // undefined (not ReferenceError)
var x = 5;

console.log(y); // ReferenceError
let y = 10;

// Function declarations are fully hoisted
sayHello(); // "Hello!" - works
function sayHello() {
  console.log("Hello!");
}

// Function expressions are not hoisted
sayGoodbye(); // TypeError
var sayGoodbye = function () {
  console.log("Goodbye!");
};
```

**Q: What's the difference between `var`, `let`, and `const`?**
A:

- `var`: Function-scoped, hoisted, can be redeclared
- `let`: Block-scoped, temporal dead zone, cannot be redeclared
- `const`: Block-scoped, temporal dead zone, cannot be redeclared or reassigned

```javascript
// var - function scoped
function example() {
  if (true) {
    var x = 1;
  }
  console.log(x); // 1 - accessible outside block
}

// let - block scoped
function example2() {
  if (true) {
    let y = 1;
  }
  console.log(y); // ReferenceError
}

// const - cannot be reassigned
const obj = { name: "John" };
obj.name = "Jane"; // OK - modifying property
// obj = {}; // TypeError - reassigning
```

### Type Coercion and Conversion

**Q: How does type coercion work in JavaScript?**
A: JavaScript automatically converts types in certain operations through implicit coercion.

```javascript
// String coercion
console.log("5" + 3); // "53" - number to string
console.log("5" - 3); // 2 - string to number
console.log("5" * "2"); // 10 - both to numbers

// Boolean coercion
console.log(Boolean(0)); // false
console.log(Boolean("")); // false
console.log(Boolean(null)); // false
console.log(Boolean(undefined)); // false
console.log(Boolean(NaN)); // false
console.log(Boolean([])); // true (object)
console.log(Boolean({})); // true (object)

// Object to primitive
const obj = {
  valueOf() {
    return 42;
  },
  toString() {
    return "hello";
  },
};
console.log(obj + 1); // 43 (valueOf used)
console.log(String(obj)); // "hello" (toString used)
```

## Functions and Scope

### Function Types and Behavior

**Q: What are the different ways to create functions?**
A: Function declarations, function expressions, arrow functions, constructor functions, and method definitions.

```javascript
// Function declaration
function declaration() {
  return "declaration";
}

// Function expression
const expression = function () {
  return "expression";
};

// Arrow function
const arrow = () => "arrow";

// Constructor function
function Person(name) {
  this.name = name;
}

// Method definition
const obj = {
  method() {
    return "method";
  },
};
```

**Q: Explain closures with practical examples.**
A: A closure gives access to an outer function's scope from an inner function, even after the outer function returns.

```javascript
// Basic closure
function outerFunction(x) {
  return function innerFunction(y) {
    return x + y; // Accesses x from outer scope
  };
}
const addFive = outerFunction(5);
console.log(addFive(3)); // 8

// Practical example: Module pattern
function createCounter() {
  let count = 0;
  return {
    increment() {
      return ++count;
    },
    decrement() {
      return --count;
    },
    getCount() {
      return count;
    },
  };
}
const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.getCount()); // 1
// count is private and cannot be accessed directly
```

**Q: How does `this` work in different contexts?**
A: `this` binding depends on how a function is called.

```javascript
// Global context
console.log(this); // window (browser) or global (Node.js)

// Object method
const obj = {
  name: "John",
  greet() {
    console.log(this.name); // "John"
  },
};
obj.greet();

// Regular function
function regularFunction() {
  console.log(this); // window/global (non-strict) or undefined (strict)
}

// Arrow function
const arrowFunction = () => {
  console.log(this); // Inherits from lexical scope
};

// Constructor function
function Person(name) {
  this.name = name; // `this` refers to new instance
}
const person = new Person("Jane");

// Call/Apply/Bind
const boundFunction = regularFunction.bind(obj);
boundFunction(); // `this` is obj
```

### Advanced Function Concepts

**Q: What are higher-order functions?**
A: Functions that take other functions as arguments or return functions.

```javascript
// Function that takes a function as argument
function processArray(arr, callback) {
  return arr.map(callback);
}

// Function that returns a function
function multiplier(factor) {
  return function (number) {
    return number * factor;
  };
}

const double = multiplier(2);
console.log(double(5)); // 10

// Built-in higher-order functions
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((x) => x * 2);
const evens = numbers.filter((x) => x % 2 === 0);
const sum = numbers.reduce((acc, x) => acc + x, 0);
```

**Q: What is currying and provide examples?**
A: Currying transforms a function with multiple arguments into a sequence of functions each taking one argument.

```javascript
// Regular function
function add(a, b, c) {
  return a + b + c;
}

// Curried version
function curriedAdd(a) {
  return function (b) {
    return function (c) {
      return a + b + c;
    };
  };
}

// Or with arrow functions
const curriedAddArrow = (a) => (b) => (c) => a + b + c;

// Usage
const add5 = curriedAdd(5);
const add5And3 = add5(3);
console.log(add5And3(2)); // 10

// Practical currying function
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function (...nextArgs) {
      return curried.apply(this, args.concat(nextArgs));
    };
  };
}

const curriedMultiply = curry((a, b, c) => a * b * c);
console.log(curriedMultiply(2)(3)(4)); // 24
```

## Objects and Prototypes

### Object Creation and Manipulation

**Q: What are the different ways to create objects?**
A: Object literals, constructor functions, Object.create(), ES6 classes, and factory functions.

```javascript
// Object literal
const obj1 = { name: "John", age: 30 };

// Constructor function
function Person(name, age) {
  this.name = name;
  this.age = age;
}
const obj2 = new Person("Jane", 25);

// Object.create()
const proto = {
  greet() {
    console.log("Hello");
  },
};
const obj3 = Object.create(proto);
obj3.name = "Bob";

// ES6 Class
class Animal {
  constructor(name) {
    this.name = name;
  }
}
const obj4 = new Animal("Dog");

// Factory function
function createUser(name, email) {
  return {
    name,
    email,
    login() {
      console.log(`${this.name} logged in`);
    },
  };
}
const obj5 = createUser("Alice", "alice@example.com");
```

**Q: How does prototypal inheritance work?**
A: Objects can inherit properties and methods from other objects through the prototype chain.

```javascript
// Prototype chain
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function () {
  console.log(`${this.name} makes a sound`);
};

function Dog(name, breed) {
  Animal.call(this, name); // Call parent constructor
  this.breed = breed;
}

// Set up inheritance
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function () {
  console.log(`${this.name} barks`);
};

const dog = new Dog("Rex", "Labrador");
dog.speak(); // "Rex makes a sound" (inherited)
dog.bark(); // "Rex barks" (own method)

console.log(dog instanceof Dog); // true
console.log(dog instanceof Animal); // true
```

**Q: Explain the prototype chain and property lookup.**
A: When accessing a property, JavaScript looks up the prototype chain until it finds the property or reaches null.

```javascript
const grandparent = {
  surname: "Smith",
  greet() {
    console.log(`Hello, I'm ${this.name} ${this.surname}`);
  },
};

const parent = Object.create(grandparent);
parent.profession = "Engineer";

const child = Object.create(parent);
child.name = "John";
child.age = 25;

console.log(child.name); // "John" (own property)
console.log(child.profession); // "Engineer" (from parent)
console.log(child.surname); // "Smith" (from grandparent)
child.greet(); // "Hello, I'm John Smith"

// Property lookup order: child -> parent -> grandparent -> Object.prototype -> null
```

## Asynchronous JavaScript

### Event Loop and Execution

**Q: How does the JavaScript event loop work?**
A: The event loop handles asynchronous operations by managing the call stack, callback queue, and microtask queue.

```javascript
console.log("1"); // Synchronous

setTimeout(() => {
  console.log("2"); // Macro task
}, 0);

Promise.resolve().then(() => {
  console.log("3"); // Micro task
});

console.log("4"); // Synchronous

// Output: 1, 4, 3, 2
// Microtasks have higher priority than macrotasks
```

**Q: What's the difference between microtasks and macrotasks?**
A: Microtasks (Promises, queueMicrotask) have higher priority and execute before macrotasks (setTimeout, setInterval, DOM events).

```javascript
// Detailed execution order
console.log("Start");

setTimeout(() => console.log("Macro 1"), 0);

Promise.resolve()
  .then(() => console.log("Micro 1"))
  .then(() => console.log("Micro 2"));

setTimeout(() => console.log("Macro 2"), 0);

Promise.resolve().then(() => {
  console.log("Micro 3");
  setTimeout(() => console.log("Macro 3"), 0);
});

console.log("End");

// Output: Start, End, Micro 1, Micro 2, Micro 3, Macro 1, Macro 2, Macro 3
```

**Q: What are Promises and how do they work?**
A: Promises represent eventual completion/failure of asynchronous operations with three states: pending, fulfilled, rejected.

```javascript
// Creating promises
const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Success!");
  }, 1000);
});

const promise2 = Promise.resolve("Immediate success");
const promise3 = Promise.reject(new Error("Failed"));

// Consuming promises
promise1
  .then((result) => console.log(result))
  .catch((error) => console.error(error))
  .finally(() => console.log("Done"));

// Promise combinators
Promise.all([promise1, promise2]).then((results) => console.log(results));

Promise.allSettled([promise1, promise2, promise3]).then((results) =>
  console.log(results)
);

Promise.race([promise1, promise2]).then((result) => console.log(result));
```

**Q: How do async/await work?**
A: Async/await provides syntactic sugar for working with Promises in a synchronous-looking way.

```javascript
// Async function always returns a Promise
async function fetchData() {
  try {
    const response = await fetch("/api/data");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// Parallel execution with async/await
async function fetchMultipleData() {
  const [users, posts, comments] = await Promise.all([
    fetch("/api/users").then((r) => r.json()),
    fetch("/api/posts").then((r) => r.json()),
    fetch("/api/comments").then((r) => r.json()),
  ]);

  return { users, posts, comments };
}

// Error handling patterns
async function robustFetch(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

## ES6+ Modern Features

### Destructuring and Spread

**Q: How does destructuring work?**
A: Destructuring extracts values from arrays or properties from objects into distinct variables.

```javascript
// Array destructuring
const [a, b, ...rest] = [1, 2, 3, 4, 5];
console.log(a); // 1
console.log(b); // 2
console.log(rest); // [3, 4, 5]

// Object destructuring
const { name, age, city = "Unknown" } = { name: "John", age: 30 };
console.log(name); // "John"
console.log(city); // "Unknown" (default value)

// Nested destructuring
const user = {
  id: 1,
  profile: {
    name: "Alice",
    settings: {
      theme: "dark",
    },
  },
};

const {
  profile: {
    name: userName,
    settings: { theme },
  },
} = user;
console.log(userName); // "Alice"
console.log(theme); // "dark"

// Function parameter destructuring
function greet({ name, age = 25 }) {
  console.log(`Hello ${name}, you are ${age} years old`);
}

greet({ name: "Bob" }); // "Hello Bob, you are 25 years old"
```

**Q: What's the spread operator and how is it used?**
A: The spread operator (...) spreads elements of iterables or properties of objects.

```javascript
// Array spread
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

// Object spread
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const merged = { ...obj1, ...obj2 }; // { a: 1, b: 2, c: 3, d: 4 }

// Function arguments
function sum(a, b, c) {
  return a + b + c;
}
const numbers = [1, 2, 3];
console.log(sum(...numbers)); // 6

// Copying arrays/objects
const arrCopy = [...arr1];
const objCopy = { ...obj1 };

// Overriding properties
const updated = { ...obj1, b: 10 }; // { a: 1, b: 10 }
```

### Classes and Modules

**Q: How do ES6 classes work and how do they differ from constructor functions?**
A: ES6 classes provide syntactic sugar over prototypal inheritance with cleaner syntax and additional features.

```javascript
// ES6 Class
class Animal {
  constructor(name, type) {
    this.name = name;
    this.type = type;
  }

  speak() {
    console.log(`${this.name} makes a sound`);
  }

  static getSpecies() {
    return "Animalia";
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name, "Canine");
    this.breed = breed;
  }

  speak() {
    console.log(`${this.name} barks`);
  }

  wagTail() {
    console.log(`${this.name} wags tail`);
  }
}

// Private fields (ES2022)
class BankAccount {
  #balance = 0;

  constructor(initialBalance) {
    this.#balance = initialBalance;
  }

  deposit(amount) {
    this.#balance += amount;
  }

  getBalance() {
    return this.#balance;
  }
}

const account = new BankAccount(100);
// console.log(account.#balance); // SyntaxError - private field
```

## Advanced Concepts

### Generators and Iterators

**Q: What are generators and how do they work?**
A: Generators are functions that can pause and resume execution, yielding values on demand.

```javascript
// Basic generator
function* numberGenerator() {
  console.log("Start");
  yield 1;
  console.log("Middle");
  yield 2;
  console.log("End");
  return 3;
}

const gen = numberGenerator();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: true }

// Infinite sequence generator
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

const fib = fibonacci();
console.log(fib.next().value); // 0
console.log(fib.next().value); // 1
console.log(fib.next().value); // 1

// Generator for async operations
function* fetchUsers() {
  const users = yield fetch("/api/users");
  const profiles = yield fetch("/api/profiles");
  return { users, profiles };
}
```

**Q: What are iterators and how do you create custom iterables?**
A: Iterators implement the iterator protocol with a next() method returning {value, done}.

```javascript
// Custom iterable
const range = {
  start: 1,
  end: 5,
  [Symbol.iterator]() {
    let current = this.start;
    const end = this.end;
    return {
      next() {
        if (current <= end) {
          return { value: current++, done: false };
        }
        return { done: true };
      },
    };
  },
};

for (const num of range) {
  console.log(num); // 1, 2, 3, 4, 5
}

// Using generator for iterator
const rangeGenerator = {
  start: 1,
  end: 5,
  *[Symbol.iterator]() {
    for (let i = this.start; i <= this.end; i++) {
      yield i;
    }
  },
};
```

### Symbols and WeakMap/WeakSet

**Q: What are Symbols and when would you use them?**
A: Symbols are unique primitive values often used for object properties that should be private or avoid naming conflicts.

```javascript
// Creating symbols
const sym1 = Symbol("description");
const sym2 = Symbol("description");
console.log(sym1 === sym2); // false - each symbol is unique

// Using symbols as object keys
const user = {
  name: "John",
  [Symbol("id")]: 12345,
  [Symbol.for("globalKey")]: "global value",
};

// Well-known symbols
class MyArray {
  constructor(...items) {
    this.items = items;
  }

  *[Symbol.iterator]() {
    yield* this.items;
  }

  [Symbol.toPrimitive](hint) {
    if (hint === "number") {
      return this.items.length;
    }
    return this.items.join(",");
  }
}

const arr = new MyArray(1, 2, 3);
console.log(Number(arr)); // 3
console.log(String(arr)); // "1,2,3"
```

**Q: What are WeakMap and WeakSet and when should you use them?**
A: WeakMap and WeakSet hold weak references to objects, allowing garbage collection when no other references exist.

```javascript
// WeakMap for private data
const privateData = new WeakMap();

class User {
  constructor(name, email) {
    this.name = name;
    privateData.set(this, { email, loginCount: 0 });
  }

  login() {
    const data = privateData.get(this);
    data.loginCount++;
    console.log(`${this.name} logged in ${data.loginCount} times`);
  }

  getEmail() {
    return privateData.get(this).email;
  }
}

// WeakSet for tracking
const processedObjects = new WeakSet();

function processObject(obj) {
  if (processedObjects.has(obj)) {
    return; // Already processed
  }

  // Process the object
  console.log("Processing object:", obj);
  processedObjects.add(obj);
}
```

## Performance and Memory Management

**Q: How do you optimize JavaScript performance?**
A: Use efficient algorithms, minimize DOM operations, implement caching, and avoid memory leaks.

```javascript
// Memoization
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = args.join(",");
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const expensiveFunction = memoize((n) => {
  console.log(`Computing for ${n}`);
  return n * n;
});

// Debouncing
function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Throttling
function throttle(fn, interval) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= interval) {
      lastCall = now;
      return fn.apply(this, args);
    }
  };
}

// Efficient array operations
const largeArray = new Array(1000000).fill().map((_, i) => i);

// Bad: Multiple iterations
const result1 = largeArray
  .filter((x) => x % 2 === 0)
  .map((x) => x * 2)
  .slice(0, 100);

// Good: Single iteration
const result2 = [];
for (let i = 0; i < largeArray.length && result2.length < 100; i++) {
  if (largeArray[i] % 2 === 0) {
    result2.push(largeArray[i] * 2);
  }
}
```

## Common Patterns and Best Practices

**Q: What is the Module Pattern and how does it work?**
A: The Module Pattern uses closures to create private scope and expose only necessary functionality.

```javascript
// IIFE Module Pattern
const UserModule = (() => {
  let users = [];
  let currentUser = null;

  function addUser(user) {
    users.push({ ...user, id: Date.now() });
  }

  function removeUser(id) {
    users = users.filter((user) => user.id !== id);
  }

  function findUser(id) {
    return users.find((user) => user.id === id);
  }

  return {
    add: addUser,
    remove: removeUser,
    find: findUser,
    getAllUsers: () => [...users],
    setCurrentUser: (id) => (currentUser = findUser(id)),
    getCurrentUser: () => currentUser,
  };
})();

// ES6 Module
// userService.js
export class UserService {
  constructor() {
    this.users = [];
  }

  addUser(user) {
    this.users.push({ ...user, id: Date.now() });
  }

  getUsers() {
    return [...this.users];
  }
}

// main.js
import { UserService } from "./userService.js";
const userService = new UserService();
```

**Q: What is event delegation and why is it useful?**
A: Event delegation uses event bubbling to handle events at a parent level instead of individual child elements.

```javascript
// Without delegation (inefficient for many elements)
document.querySelectorAll(".button").forEach((button) => {
  button.addEventListener("click", handleClick);
});

// With delegation (efficient)
document.querySelector(".container").addEventListener("click", (event) => {
  if (event.target.matches(".button")) {
    handleClick(event);
  }
});

// Advanced delegation with data attributes
document.addEventListener("click", (event) => {
  const action = event.target.dataset.action;

  switch (action) {
    case "delete":
      deleteItem(event.target.dataset.id);
      break;
    case "edit":
      editItem(event.target.dataset.id);
      break;
    case "save":
      saveItem(event.target.dataset.id);
      break;
  }
});
```

**Q: How do you implement inheritance in modern JavaScript?**
A: Use ES6 classes with extends keyword or composition patterns.

```javascript
// ES6 Classes
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name} makes a sound`);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }

  speak() {
    console.log(`${this.name} barks`);
  }

  wagTail() {
    console.log(`${this.name} wags tail`);
  }
}

// Composition over inheritance
const canFly = {
  fly() {
    console.log(`${this.name} is flying`);
  },
};

const canSwim = {
  swim() {
    console.log(`${this.name} is swimming`);
  },
};

function createDuck(name) {
  const duck = { name };
  return Object.assign(duck, canFly, canSwim);
}

const duck = createDuck("Donald");
duck.fly(); // "Donald is flying"
duck.swim(); // "Donald is swimming"
```

This comprehensive guide covers the most essential JavaScript concepts and interview questions with detailed explanations and practical examples.
