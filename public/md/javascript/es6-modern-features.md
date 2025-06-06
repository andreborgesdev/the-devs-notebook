# ES6+ Modern JavaScript Features

## ES6 (ES2015) Core Features

### let and const

```javascript
// Block scoping
if (true) {
  let blockScoped = "I am block scoped";
  const alsoBlockScoped = "Me too";
  var functionScoped = "I am function scoped";
}

// console.log(blockScoped); // ReferenceError
// console.log(alsoBlockScoped); // ReferenceError
console.log(functionScoped); // 'I am function scoped'

// Temporal Dead Zone
console.log(hoistedVar); // undefined
console.log(notHoisted); // ReferenceError

var hoistedVar = "I am hoisted";
let notHoisted = "I am not hoisted";

// const immutability
const obj = { name: "John" };
obj.name = "Jane"; // Allowed - object content can change
obj.age = 30; // Allowed

// obj = {}; // TypeError - cannot reassign const variable

const arr = [1, 2, 3];
arr.push(4); // Allowed
arr[0] = 10; // Allowed
// arr = []; // TypeError
```

### Arrow Functions

```javascript
// Traditional function vs arrow function
const traditional = function (a, b) {
  return a + b;
};

const arrow = (a, b) => a + b;

// Variations
const single = (x) => x * 2; // Single parameter, no parentheses needed
const noParams = () => "Hello World";
const block = (x, y) => {
  const sum = x + y;
  return sum * 2;
};

// Object return requires parentheses
const createUser = (name) => ({ name, active: true });

// this binding differences
const obj = {
  name: "Object",

  traditional: function () {
    console.log("Traditional this:", this.name); // 'Object'

    setTimeout(function () {
      console.log("Callback this:", this.name); // undefined
    }, 100);
  },

  arrow: function () {
    console.log("Arrow this:", this.name); // 'Object'

    setTimeout(() => {
      console.log("Arrow callback this:", this.name); // 'Object'
    }, 100);
  },
};

// Arrow functions cannot be constructors
const ArrowConstructor = () => {};
// new ArrowConstructor(); // TypeError

// No arguments object
const withArguments = function () {
  console.log(arguments); // Arguments object
};

const withoutArguments = () => {
  // console.log(arguments); // ReferenceError
};

const withRest = (...args) => {
  console.log(args); // Regular array
};
```

### Template Literals

```javascript
const name = "John";
const age = 30;

// Basic interpolation
const message = `Hello, my name is ${name} and I am ${age} years old.`;

// Multi-line strings
const multiline = `
    This is a
    multi-line
    string
`;

// Expression evaluation
const calculation = `2 + 3 = ${2 + 3}`;
const conditional = `Status: ${age >= 18 ? "Adult" : "Minor"}`;

// Nested templates
const nested = `User: ${name} (${`Age: ${age}`})`;

// Tagged template literals
function highlight(strings, ...values) {
  return strings.reduce((result, string, i) => {
    const value = values[i] ? `<mark>${values[i]}</mark>` : "";
    return result + string + value;
  }, "");
}

const highlighted = highlight`Name: ${name}, Age: ${age}`;
// 'Name: <mark>John</mark>, Age: <mark>30</mark>'

// HTML templating
const createHTML = (title, content) => `
    <div class="card">
        <h2>${title}</h2>
        <p>${content}</p>
    </div>
`;
```

### Destructuring Assignment

```javascript
// Array destructuring
const numbers = [1, 2, 3, 4, 5];
const [first, second, ...rest] = numbers;
console.log(first); // 1
console.log(second); // 2
console.log(rest); // [3, 4, 5]

// Skipping elements
const [a, , c] = numbers; // Skip second element

// Default values
const [x = 10, y = 20] = [1]; // x = 1, y = 20

// Swapping variables
let var1 = "a";
let var2 = "b";
[var1, var2] = [var2, var1];

// Object destructuring
const user = {
  name: "John",
  age: 30,
  email: "john@example.com",
  address: {
    city: "New York",
    country: "USA",
  },
};

const { name, age } = user;
const { name: userName, age: userAge } = user; // Renaming
const { phone = "Not provided" } = user; // Default value

// Nested destructuring
const {
  address: { city, country },
} = user;

// Function parameter destructuring
function greetUser({ name, age = "unknown" }) {
  return `Hello ${name}, you are ${age} years old`;
}

greetUser({ name: "Alice", age: 25 });

// Complex destructuring
const response = {
  data: {
    users: [
      { id: 1, name: "John", active: true },
      { id: 2, name: "Jane", active: false },
    ],
  },
  status: "success",
};

const {
  data: {
    users: [firstUser, ...otherUsers],
  },
  status,
} = response;
```

### Spread and Rest Operators

```javascript
// Spread operator with arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

// Array copying
const original = [1, 2, 3];
const copy = [...original]; // Shallow copy

// Finding max/min
const numbers = [1, 5, 3, 9, 2];
const max = Math.max(...numbers); // 9

// Converting NodeList to Array
const divs = document.querySelectorAll("div");
const divsArray = [...divs];

// Spread with objects
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const merged = { ...obj1, ...obj2 }; // { a: 1, b: 2, c: 3, d: 4 }

// Object copying and overriding
const user = { name: "John", age: 30 };
const updatedUser = { ...user, age: 31 }; // { name: 'John', age: 31 }

// Rest parameters
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

sum(1, 2, 3, 4, 5); // 15

// Rest in destructuring
const [head, ...tail] = [1, 2, 3, 4, 5];
const { name, ...otherProps } = { name: "John", age: 30, city: "NYC" };
```

### Default Parameters

```javascript
// Basic default parameters
function greet(name = "Guest", greeting = "Hello") {
  return `${greeting}, ${name}!`;
}

greet(); // 'Hello, Guest!'
greet("John"); // 'Hello, John!'

// Default parameters can reference earlier parameters
function createUser(name, role = "user", id = name.toLowerCase()) {
  return { name, role, id };
}

// Default parameters with destructuring
function processConfig({ host = "localhost", port = 3000, ssl = false } = {}) {
  return { host, port, ssl };
}

processConfig(); // { host: 'localhost', port: 3000, ssl: false }
processConfig({ port: 8080 }); // { host: 'localhost', port: 8080, ssl: false }

// Complex default values
function fetchData(url, options = {}) {
  const config = {
    method: "GET",
    headers: {},
    timeout: 5000,
    ...options,
  };

  return fetch(url, config);
}
```

### Enhanced Object Literals

```javascript
const name = "John";
const age = 30;

// Shorthand property names
const user = { name, age }; // { name: 'John', age: 30 }

// Method shorthand
const calculator = {
  add(a, b) {
    return a + b;
  },

  subtract(a, b) {
    return a - b;
  },
};

// Computed property names
const dynamicKey = "score";
const gameState = {
  player: "John",
  [dynamicKey]: 100,
  [`${dynamicKey}_timestamp`]: Date.now(),
};

// Combining features
function createAPI(baseURL) {
  return {
    baseURL,

    get(endpoint) {
      return fetch(`${this.baseURL}/${endpoint}`);
    },

    post(endpoint, data) {
      return fetch(`${this.baseURL}/${endpoint}`, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    [`${baseURL.split("://")[1]}_custom`]: "Custom method",
  };
}
```

## ES2016+ Features

### Array.includes() (ES2016)

```javascript
const numbers = [1, 2, 3, NaN];

// Old way
numbers.indexOf(2) !== -1; // true
numbers.indexOf(NaN) !== -1; // false (indexOf can't find NaN)

// New way
numbers.includes(2); // true
numbers.includes(NaN); // true (includes can find NaN)
numbers.includes(4); // false

// With fromIndex parameter
[1, 2, 3, 1, 2, 3].includes(2, 3); // true (starts search from index 3)
```

### Exponentiation Operator (ES2016)

```javascript
// Old way
Math.pow(2, 3); // 8

// New way
2 ** 3; // 8

// Assignment operator
let x = 2;
x **= 3; // x = 8

// Precedence (right-associative)
2 ** (3 ** 2); // 2 ** (3 ** 2) = 2 ** 9 = 512
```

### Async/Await (ES2017)

```javascript
// Promise-based approach
function fetchUserData() {
  return fetch("/api/user")
    .then((response) => response.json())
    .then((user) => {
      return fetch(`/api/posts/${user.id}`);
    })
    .then((response) => response.json())
    .catch((error) => console.error(error));
}

// Async/await approach
async function fetchUserDataAsync() {
  try {
    const userResponse = await fetch("/api/user");
    const user = await userResponse.json();

    const postsResponse = await fetch(`/api/posts/${user.id}`);
    const posts = await postsResponse.json();

    return posts;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Error handling patterns
async function robustFetch(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Network error");
    }
    throw error;
  }
}
```

### Object.entries() and Object.values() (ES2017)

```javascript
const user = { name: "John", age: 30, city: "NYC" };

// Object.entries()
Object.entries(user); // [['name', 'John'], ['age', 30], ['city', 'NYC']]

// Iteration with destructuring
for (const [key, value] of Object.entries(user)) {
  console.log(`${key}: ${value}`);
}

// Object.values()
Object.values(user); // ['John', 30, 'NYC']

// Practical use cases
const totals = Object.values({
  sales: 1000,
  marketing: 500,
  development: 1500,
}).reduce((sum, value) => sum + value, 0); // 3000

// Convert object to Map
const userMap = new Map(Object.entries(user));

// Object from entries
const recreated = Object.fromEntries(Object.entries(user));
```

### String padding (ES2017)

```javascript
// padStart()
"5".padStart(3, "0"); // '005'
"hello".padStart(10); // '     hello' (default padding is space)
"world".padStart(10, ".*"); // '.*.*.*world'

// padEnd()
"5".padEnd(3, "0"); // '500'
"hello".padEnd(10, "."); // 'hello.....'

// Practical examples
const numbers = [5, 42, 123];
numbers.forEach((num) => {
  console.log(num.toString().padStart(4, "0")); // 0005, 0042, 0123
});

// Table formatting
const data = [
  { name: "John", score: 95 },
  { name: "Jane", score: 87 },
  { name: "Bob", score: 92 },
];

data.forEach(({ name, score }) => {
  console.log(`${name.padEnd(10)} ${score.toString().padStart(3)}`);
});
```

## ES2018+ Features

### Rest/Spread Properties

```javascript
// Object rest
const user = { name: "John", age: 30, city: "NYC", country: "USA" };
const { name, ...otherInfo } = user;
console.log(otherInfo); // { age: 30, city: 'NYC', country: 'USA' }

// Object spread
const defaults = { theme: "dark", language: "en" };
const userPrefs = { language: "es", notifications: true };
const config = { ...defaults, ...userPrefs };
// { theme: 'dark', language: 'es', notifications: true }

// Function parameters
function updateUser(id, { name, ...updates }) {
  console.log(`Updating user ${id}`);
  console.log(`Name: ${name}`);
  console.log("Other updates:", updates);
}

updateUser(123, { name: "John", age: 31, email: "john@new.com" });
```

### Asynchronous Iteration

```javascript
// Async iterators
async function* asyncGenerator() {
  for (let i = 0; i < 3; i++) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    yield i;
  }
}

// Consuming async iterators
async function consumeAsyncIterator() {
  for await (const value of asyncGenerator()) {
    console.log(value); // 0, 1, 2 (with 1 second delays)
  }
}

// Async iteration with real data
async function* fetchUsers(userIds) {
  for (const id of userIds) {
    const response = await fetch(`/api/users/${id}`);
    const user = await response.json();
    yield user;
  }
}

async function processUsers() {
  const userIds = [1, 2, 3, 4, 5];

  for await (const user of fetchUsers(userIds)) {
    console.log(`Processing user: ${user.name}`);
    // Process user individually as they arrive
  }
}
```

### Regular Expression Features

```javascript
// Named capture groups
const dateRegex = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const match = "2023-12-25".match(dateRegex);
console.log(match.groups); // { year: '2023', month: '12', day: '25' }

// Lookbehind assertions
const price = /(?<=\$)\d+\.\d{2}/; // Positive lookbehind
"Price: $19.99".match(price); // ['19.99']

const notPrice = /(?<!\$)\d+\.\d{2}/; // Negative lookbehind
"Version: 2.15".match(notPrice); // ['2.15']

// Unicode property escapes
const emoji = /\p{Emoji}/u;
emoji.test("😀"); // true

const letter = /\p{Letter}/u;
letter.test("ñ"); // true

// dotAll flag
const multiline = /hello.world/s; // s flag makes . match newlines
multiline.test("hello\nworld"); // true
```

## ES2019+ Features

### Array.flat() and Array.flatMap()

```javascript
// Array.flat()
const nested = [1, [2, 3], [4, [5, 6]]];
nested.flat(); // [1, 2, 3, 4, [5, 6]]
nested.flat(2); // [1, 2, 3, 4, 5, 6]
nested.flat(Infinity); // Completely flatten

// Array.flatMap()
const sentences = ["Hello world", "How are you"];
const words = sentences.flatMap((sentence) => sentence.split(" "));
// ['Hello', 'world', 'How', 'are', 'you']

// Practical example
const users = [
  { name: "John", hobbies: ["reading", "gaming"] },
  { name: "Jane", hobbies: ["cooking", "traveling"] },
];

const allHobbies = users.flatMap((user) => user.hobbies);
// ['reading', 'gaming', 'cooking', 'traveling']
```

### Object.fromEntries()

```javascript
// Convert entries back to object
const entries = [
  ["name", "John"],
  ["age", 30],
];
const obj = Object.fromEntries(entries); // { name: 'John', age: 30 }

// Transform object
const scores = { math: 95, english: 87, science: 92 };
const grades = Object.fromEntries(
  Object.entries(scores).map(([subject, score]) => [
    subject,
    score >= 90 ? "A" : score >= 80 ? "B" : "C",
  ])
);
// { math: 'A', english: 'B', science: 'A' }

// URL search params to object
const params = new URLSearchParams("name=John&age=30");
const query = Object.fromEntries(params); // { name: 'John', age: '30' }
```

### String.trimStart() and String.trimEnd()

```javascript
const text = "   hello world   ";

text.trimStart(); // 'hello world   '
text.trimEnd(); // '   hello world'
text.trim(); // 'hello world'

// Aliases
text.trimLeft(); // Same as trimStart()
text.trimRight(); // Same as trimEnd()
```

## ES2020+ Features

### Optional Chaining (?.)

```javascript
const user = {
  name: "John",
  address: {
    street: "123 Main St",
    city: "Boston",
  },
};

// Without optional chaining (verbose and error-prone)
const city1 = user && user.address && user.address.city;

// With optional chaining
const city2 = user?.address?.city; // 'Boston'
const zipCode = user?.address?.zipCode; // undefined (no error)

// With arrays
const users = [{ name: "John", posts: [{ title: "Hello" }] }, { name: "Jane" }];

const firstPostTitle = users[0]?.posts?.[0]?.title; // 'Hello'
const secondPostTitle = users[1]?.posts?.[0]?.title; // undefined

// With function calls
const result = user?.address?.getCoordinates?.(); // undefined (safe)

// Practical example
function displayUserInfo(user) {
  const name = user?.name ?? "Unknown";
  const email = user?.contact?.email ?? "No email";
  const phone = user?.contact?.phone ?? "No phone";

  return { name, email, phone };
}
```

### Nullish Coalescing (??)

```javascript
// Difference between || and ??
const config = {
  timeout: 0,
  retries: 0,
  debug: false,
};

// Using || (problematic with falsy values)
const timeout1 = config.timeout || 5000; // 5000 (not what we want!)
const retries1 = config.retries || 3; // 3 (not what we want!)

// Using ?? (only null/undefined trigger default)
const timeout2 = config.timeout ?? 5000; // 0 (correct!)
const retries2 = config.retries ?? 3; // 0 (correct!)

// Combining with optional chaining
const theme = user?.preferences?.theme ?? "light";

// Assignment operator
let value;
value ??= "default"; // Assigns only if value is null/undefined
```

### BigInt

```javascript
// Creating BigInt
const big1 = 123n;
const big2 = BigInt(123);
const big3 = BigInt("123456789012345678901234567890");

// Operations
const sum = 123n + 456n; // 579n
const product = 123n * 456n; // 56088n

// Cannot mix with regular numbers
// 123n + 456; // TypeError
const mixed = 123n + BigInt(456); // 579n

// Comparisons
123n === 123; // false (different types)
123n == 123; // true (type coercion)
123n > 122; // true

// Use cases
const largeId = BigInt(Number.MAX_SAFE_INTEGER) + 1n;
const timestamp = BigInt(Date.now()) * 1000000n; // Nanosecond precision
```

### Dynamic Imports

```javascript
// Static imports (top-level)
import { utility } from "./utils.js";

// Dynamic imports (anywhere in code)
async function loadModule() {
  try {
    const module = await import("./heavy-module.js");
    module.doSomething();
  } catch (error) {
    console.error("Failed to load module:", error);
  }
}

// Conditional loading
async function loadChart(type) {
  let chartModule;

  switch (type) {
    case "bar":
      chartModule = await import("./bar-chart.js");
      break;
    case "line":
      chartModule = await import("./line-chart.js");
      break;
    default:
      throw new Error("Unknown chart type");
  }

  return chartModule.default;
}

// Code splitting with webpack
const LazyComponent = React.lazy(() => import("./LazyComponent"));
```

## ES2021+ Features

### Logical Assignment Operators

```javascript
let obj = { a: 1 };

// &&= (AND assignment)
obj.a &&= 5; // obj.a = obj.a && 5; (only assigns if left side is truthy)
console.log(obj.a); // 5

obj.b &&= 10; // obj.b is undefined, so no assignment
console.log(obj.b); // undefined

// ||= (OR assignment)
obj.c ||= "default"; // obj.c = obj.c || 'default';
console.log(obj.c); // 'default'

obj.c ||= "new value"; // obj.c is already truthy, no assignment
console.log(obj.c); // 'default'

// ??= (Nullish assignment)
obj.d ??= "fallback"; // obj.d = obj.d ?? 'fallback';
console.log(obj.d); // 'fallback'

// Practical example
function processConfig(config = {}) {
  config.host ??= "localhost";
  config.port ??= 3000;
  config.ssl ??= false;

  return config;
}
```

### Numeric Separators

```javascript
// Large numbers are hard to read
const million = 1000000;
const billion = 1000000000;

// With numeric separators (for readability)
const readableMillion = 1_000_000;
const readableBillion = 1_000_000_000;

// Works with different number formats
const binary = 0b1010_0001;
const octal = 0o755_000;
const hex = 0xff_ec_de_5e;
const bigInt = 123_456n;
const decimal = 3.141_592_653;
```

### String.replaceAll()

```javascript
const text = "The quick brown fox jumps over the lazy dog";

// Old way (using regex)
text.replace(/the/g, "a"); // 'a quick brown fox jumps over a lazy dog'

// New way
text.replaceAll("the", "a"); // 'a quick brown fox jumps over a lazy dog'
text.replaceAll("The", "A"); // 'A quick brown fox jumps over the lazy dog'

// With function
text.replaceAll("o", (match, offset) => {
  return offset < 10 ? "O" : "o";
});
```

## ES2022+ Features

### Top-level await

```javascript
// Previously, await could only be used inside async functions
// Now it can be used at the top level of modules

// config.js
const response = await fetch("/api/config");
const config = await response.json();
export default config;

// main.js
import config from "./config.js"; // config is already loaded

// Conditional imports
let translations;
if (userLanguage === "es") {
  translations = await import("./translations/es.js");
} else {
  translations = await import("./translations/en.js");
}
```

### Class Fields and Private Methods

```javascript
class User {
  // Public fields
  name = "Unknown";
  #id = Math.random(); // Private field

  // Private method
  #generateHash() {
    return Math.random().toString(36);
  }

  // Private getter
  get #internalId() {
    return this.#id;
  }

  constructor(name) {
    this.name = name;
    this.#id = this.#generateHash();
  }

  getId() {
    return this.#internalId; // Can access private members within class
  }

  // Static private field
  static #instances = 0;

  static getInstanceCount() {
    return User.#instances;
  }
}

const user = new User("John");
console.log(user.name); // 'John' (public)
// console.log(user.#id); // SyntaxError (private)
console.log(user.getId()); // Works (public method accessing private)
```

### RegExp Match Indices

```javascript
const regex = /(\d{4})-(\d{2})-(\d{2})/d; // 'd' flag for indices
const match = "2023-12-25".match(regex);

console.log(match.indices);
// [
//   [0, 10],    // Full match indices
//   [0, 4],     // First group (year)
//   [5, 7],     // Second group (month)
//   [8, 10]     // Third group (day)
// ]
```

## Module System Enhancements

### Import Assertions

```javascript
// JSON modules
import data from "./data.json" assert { type: "json" };

// CSS modules (proposed)
import styles from "./styles.css" assert { type: "css" };

// Dynamic imports with assertions
const config = await import("./config.json", {
  assert: { type: "json" },
});
```

### Export Extensions

```javascript
// Re-exporting with renaming
export { default as Button } from './Button.js';
export { theme as defaultTheme } from './theme.js';

// Export all from module
export * from './utils.js';

// Conditional exports in package.json
{
    "exports": {
        ".": {
            "import": "./dist/module.mjs",
            "require": "./dist/module.cjs",
            "browser": "./dist/browser.js"
        }
    }
}
```

## Performance and Best Practices

### Modern JavaScript Optimization

```javascript
// Use modern array methods for better performance
const data = [1, 2, 3, 4, 5];

// Avoid mutations
const doubled = data.map((x) => x * 2); // Good
const doubled2 = data.forEach((x) => x * 2); // Bad (mutation)

// Use appropriate methods
const hasEven = data.some((x) => x % 2 === 0); // Good (stops on first match)
const hasEven2 = data.filter((x) => x % 2 === 0).length > 0; // Bad (processes all)

// Use Set for unique values
const unique = [...new Set(data)]; // Good
const unique2 = data.filter((v, i, arr) => arr.indexOf(v) === i); // Slower

// Use Map for key-value pairs with object keys
const cache = new Map(); // Good for object keys
const cache2 = {}; // Limited to string keys

// Use WeakMap for memory-efficient object metadata
const metadata = new WeakMap(); // Good (allows GC)
const metadata2 = new Map(); // Might cause memory leaks
```

### Modern Async Patterns

```javascript
// Prefer async/await over Promise chains
async function fetchUserData(id) {
  try {
    const user = await fetch(`/api/users/${id}`).then((r) => r.json());
    const posts = await fetch(`/api/users/${id}/posts`).then((r) => r.json());
    return { user, posts };
  } catch (error) {
    throw new Error(`Failed to fetch user data: ${error.message}`);
  }
}

// Use Promise.allSettled for handling multiple async operations
async function fetchMultipleUsers(ids) {
  const results = await Promise.allSettled(ids.map((id) => fetchUserData(id)));

  const successful = results
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);

  const failed = results
    .filter((result) => result.status === "rejected")
    .map((result) => result.reason);

  return { successful, failed };
}
```

Modern JavaScript features make code more readable, maintainable, and performant. Understanding these features is essential for technical interviews and modern development practices.
