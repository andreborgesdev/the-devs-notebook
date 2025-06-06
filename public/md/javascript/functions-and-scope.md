# JavaScript Functions and Scope

## Function Fundamentals

### Function Declaration vs Expression vs Arrow Functions

#### Function Declaration

```javascript
// Hoisted - can be called before declaration
console.log(add(2, 3)); // 5

function add(a, b) {
  return a + b;
}

// Function properties
add.name; // 'add'
add.length; // 2 (number of parameters)
```

#### Function Expression

```javascript
// Not hoisted - cannot be called before assignment
// console.log(subtract(5, 2)); // ReferenceError

const subtract = function (a, b) {
  return a - b;
};

// Named function expression
const multiply = function mult(a, b) {
  // 'mult' is only available inside the function
  return a * b;
};
```

#### Arrow Functions (ES6)

```javascript
// Concise syntax
const divide = (a, b) => a / b;

// Multiple parameters
const sum = (a, b, c) => a + b + c;

// Single parameter (parentheses optional)
const square = (x) => x * x;
const double = (x) => x * 2;

// No parameters
const random = () => Math.random();

// Block body
const processArray = (arr) => {
  const result = arr.map((x) => x * 2);
  return result.filter((x) => x > 10);
};

// Returning object literals (wrap in parentheses)
const createUser = (name) => ({ name, active: true });
```

### Key Differences: Arrow vs Regular Functions

#### this Binding

```javascript
const obj = {
  name: "Object",

  // Regular function - 'this' is dynamic
  regularMethod: function () {
    console.log(this.name); // 'Object'

    setTimeout(function () {
      console.log(this.name); // undefined (or global object)
    }, 100);
  },

  // Arrow function - 'this' is lexically bound
  arrowMethod: function () {
    console.log(this.name); // 'Object'

    setTimeout(() => {
      console.log(this.name); // 'Object'
    }, 100);
  },
};
```

#### Arguments Object

```javascript
function regularFunction() {
  console.log(arguments); // Arguments object available
  console.log(Array.from(arguments));
}

const arrowFunction = () => {
  // console.log(arguments); // ReferenceError
  // Use rest parameters instead
};

const arrowWithRest = (...args) => {
  console.log(args); // Array of arguments
};
```

#### Constructor Usage

```javascript
function RegularConstructor(name) {
  this.name = name;
}

const obj1 = new RegularConstructor("John"); // Works

const ArrowConstructor = (name) => {
  this.name = name;
};

// const obj2 = new ArrowConstructor('Jane'); // TypeError
```

## Function Parameters and Arguments

### Default Parameters (ES6)

```javascript
function greet(name = "Guest", greeting = "Hello") {
  return `${greeting}, ${name}!`;
}

greet(); // 'Hello, Guest!'
greet("John"); // 'Hello, John!'
greet("Jane", "Hi"); // 'Hi, Jane!'

// Default parameters can reference earlier parameters
function createUser(name, role = "user", id = name.toLowerCase()) {
  return { name, role, id };
}
```

### Rest Parameters (ES6)

```javascript
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

sum(1, 2, 3, 4, 5); // 15

// Rest parameter must be last
function logMessage(message, ...details) {
  console.log(message);
  details.forEach((detail) => console.log("-", detail));
}
```

### Destructuring Parameters (ES6)

```javascript
// Object destructuring
function createUser({ name, age, email = "not provided" }) {
  return { name, age, email };
}

createUser({ name: "John", age: 30 });

// Array destructuring
function getCoordinates([x, y, z = 0]) {
  return { x, y, z };
}

getCoordinates([10, 20]); // { x: 10, y: 20, z: 0 }
```

## Scope and Closures

### Lexical Scoping

```javascript
const globalVar = "global";

function outer() {
  const outerVar = "outer";

  function inner() {
    const innerVar = "inner";

    // Can access all variables in scope chain
    console.log(globalVar, outerVar, innerVar);
  }

  return inner;
}

const innerFunc = outer();
innerFunc(); // Still has access to outerVar
```

### Closures

```javascript
// Basic closure
function createCounter() {
  let count = 0;

  return function () {
    count++;
    return count;
  };
}

const counter1 = createCounter();
const counter2 = createCounter();

console.log(counter1()); // 1
console.log(counter1()); // 2
console.log(counter2()); // 1 (separate closure)

// Closure with parameters
function createMultiplier(multiplier) {
  return function (value) {
    return value * multiplier;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
```

### Module Pattern with Closures

```javascript
const calculator = (function () {
  let result = 0;

  return {
    add(value) {
      result += value;
      return this;
    },

    subtract(value) {
      result -= value;
      return this;
    },

    multiply(value) {
      result *= value;
      return this;
    },

    getResult() {
      return result;
    },

    reset() {
      result = 0;
      return this;
    },
  };
})();

calculator.add(10).multiply(2).subtract(5).getResult(); // 15
```

## Advanced Function Concepts

### Higher-Order Functions

```javascript
// Function that takes other functions as arguments
function processArray(arr, callback) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    result.push(callback(arr[i], i, arr));
  }
  return result;
}

const numbers = [1, 2, 3, 4, 5];
const doubled = processArray(numbers, (x) => x * 2);
const indexed = processArray(numbers, (x, i) => `${i}: ${x}`);

// Function that returns other functions
function createValidator(type) {
  const validators = {
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    phone: (value) => /^\d{10}$/.test(value),
    required: (value) => value != null && value !== "",
  };

  return validators[type] || (() => true);
}

const validateEmail = createValidator("email");
console.log(validateEmail("test@example.com")); // true
```

### Function Composition

```javascript
// Simple composition
const compose = (f, g) => (x) => f(g(x));

const add1 = (x) => x + 1;
const multiply2 = (x) => x * 2;

const add1ThenMultiply2 = compose(multiply2, add1);
console.log(add1ThenMultiply2(3)); // 8

// Multiple function composition
const pipe =
  (...functions) =>
  (value) =>
    functions.reduce((acc, fn) => fn(acc), value);

const pipeline = pipe(
  (x) => x + 1,
  (x) => x * 2,
  (x) => x - 3
);

console.log(pipeline(5)); // 9
```

### Currying

```javascript
// Manual currying
function add(a) {
  return function (b) {
    return function (c) {
      return a + b + c;
    };
  };
}

const result = add(1)(2)(3); // 6

// Arrow function currying
const multiply = (a) => (b) => (c) => a * b * c;
const result2 = multiply(2)(3)(4); // 24

// Curry helper function
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function (...nextArgs) {
        return curried.apply(this, args.concat(nextArgs));
      };
    }
  };
}

const curriedAdd = curry((a, b, c) => a + b + c);
console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6
console.log(curriedAdd(1)(2, 3)); // 6
```

### Partial Application

```javascript
function partial(fn, ...presetArgs) {
  return function (...laterArgs) {
    return fn(...presetArgs, ...laterArgs);
  };
}

function greet(greeting, punctuation, name) {
  return `${greeting}, ${name}${punctuation}`;
}

const sayHello = partial(greet, "Hello", "!");
console.log(sayHello("John")); // 'Hello, John!'

const askQuestion = partial(greet, "Hello", "?");
console.log(askQuestion("Jane")); // 'Hello, Jane?'
```

## Function Methods: call, apply, bind

### call()

```javascript
function introduce() {
  return `Hi, I'm ${this.name} and I'm ${this.age} years old`;
}

const person = { name: "John", age: 30 };
console.log(introduce.call(person)); // 'Hi, I'm John and I'm 30 years old'

// With arguments
function greet(greeting, punctuation) {
  return `${greeting}, I'm ${this.name}${punctuation}`;
}

console.log(greet.call(person, "Hello", "!")); // 'Hello, I'm John!'
```

### apply()

```javascript
// Same as call, but arguments as array
console.log(greet.apply(person, ["Hi", "."])); // 'Hi, I'm John.'

// Useful for functions that take multiple arguments
const numbers = [1, 2, 3, 4, 5];
const max = Math.max.apply(null, numbers); // 5

// ES6 spread is often preferred
const maxES6 = Math.max(...numbers); // 5
```

### bind()

```javascript
// Creates new function with bound context
const boundIntroduce = introduce.bind(person);
console.log(boundIntroduce()); // 'Hi, I'm John and I'm 30 years old'

// Partial application with bind
function multiply(a, b) {
  return a * b;
}

const double = multiply.bind(null, 2);
console.log(double(5)); // 10

// Event handler binding
class Component {
  constructor(name) {
    this.name = name;
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    console.log(`${this.name} was clicked`);
  }
}
```

## Function Performance and Optimization

### Memoization

```javascript
function memoize(fn) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const expensiveOperation = memoize((n) => {
  console.log(`Computing for ${n}`);
  return n * n * n;
});

console.log(expensiveOperation(5)); // Computing for 5, returns 125
console.log(expensiveOperation(5)); // Returns 125 (from cache)
```

### Debouncing and Throttling

```javascript
// Debouncing - delay execution until after delay period
function debounce(func, delay) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Throttling - limit execution to once per time period
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

// Usage examples
const debouncedSearch = debounce(searchFunction, 300);
const throttledScroll = throttle(scrollHandler, 100);
```

## Function Best Practices

### Pure Functions

```javascript
// Pure function - same input, same output, no side effects
function add(a, b) {
  return a + b; // Pure
}

// Impure function - has side effects
let counter = 0;
function impureIncrement() {
  counter++; // Side effect
  return counter;
}

// Make it pure
function pureIncrement(value) {
  return value + 1; // Pure
}
```

### Function Naming and Organization

```javascript
// Use descriptive names
function calculateMonthlyPayment(principal, rate, years) {
  return (principal * rate) / (1 - Math.pow(1 + rate, -years));
}

// Single responsibility
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sendEmail(email, subject, body) {
  // Send email logic
}

// Instead of one function doing both validation and sending
```

## Common Interview Questions

### Function Hoisting

```javascript
// What will this output?
console.log(foo()); // "Hello" - function declarations are hoisted

function foo() {
  return "Hello";
}

console.log(bar()); // TypeError - bar is not a function
var bar = function () {
  return "World";
};
```

### Closure Traps

```javascript
// Common mistake
for (var i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log(i); // 3, 3, 3
  }, 100);
}

// Solutions
// 1. Use let
for (let i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log(i); // 0, 1, 2
  }, 100);
}

// 2. Use closure
for (var i = 0; i < 3; i++) {
  (function (j) {
    setTimeout(function () {
      console.log(j); // 0, 1, 2
    }, 100);
  })(i);
}
```

Functions and scope are fundamental to JavaScript mastery. Understanding these concepts deeply will help you write better code and excel in technical interviews.
