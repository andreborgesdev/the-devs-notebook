# Asynchronous JavaScript

## Understanding JavaScript's Single-Threaded Nature

### Event Loop Fundamentals

```javascript
console.log("Start"); // 1. Synchronous

setTimeout(() => {
  console.log("Timeout"); // 4. Asynchronous (Macrotask)
}, 0);

Promise.resolve().then(() => {
  console.log("Promise"); // 3. Asynchronous (Microtask)
});

console.log("End"); // 2. Synchronous

// Output: Start, End, Promise, Timeout
```

### Call Stack, Event Loop, and Queues

```javascript
// The JavaScript runtime consists of:
// 1. Call Stack - where function calls are stored
// 2. Web APIs - browser/Node.js APIs (setTimeout, DOM events, HTTP requests)
// 3. Callback Queue (Macrotask Queue) - setTimeout, setInterval, I/O callbacks
// 4. Microtask Queue - Promise callbacks, queueMicrotask()
// 5. Event Loop - orchestrates execution between stack and queues

function demonstrateEventLoop() {
  console.log("1: Start");

  // Macrotask
  setTimeout(() => console.log("2: Timeout 1"), 0);
  setTimeout(() => console.log("3: Timeout 2"), 0);

  // Microtasks
  Promise.resolve().then(() => console.log("4: Promise 1"));
  Promise.resolve().then(() => console.log("5: Promise 2"));

  // More microtasks
  queueMicrotask(() => console.log("6: Microtask"));

  console.log("7: End");

  // Output: 1, 7, 4, 5, 6, 2, 3
  // Microtasks always execute before macrotasks
}
```

## Callbacks

### Basic Callbacks

```javascript
// Simple callback
function fetchUserData(userId, callback) {
  // Simulate API call
  setTimeout(() => {
    const userData = { id: userId, name: "John Doe" };
    callback(null, userData);
  }, 1000);
}

fetchUserData(123, (error, user) => {
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("User:", user);
  }
});
```

### Callback Hell (Pyramid of Doom)

```javascript
// Nested callbacks - hard to read and maintain
function processUser(userId) {
  fetchUser(userId, (err, user) => {
    if (err) return console.error(err);

    fetchUserPosts(user.id, (err, posts) => {
      if (err) return console.error(err);

      fetchPostComments(posts[0].id, (err, comments) => {
        if (err) return console.error(err);

        processComments(comments, (err, result) => {
          if (err) return console.error(err);

          console.log("Final result:", result);
        });
      });
    });
  });
}
```

### Error Handling in Callbacks

```javascript
// Error-first callback pattern (Node.js convention)
function readFile(filename, callback) {
  // Simulate file reading
  setTimeout(() => {
    if (filename.endsWith(".txt")) {
      callback(null, "File contents");
    } else {
      callback(new Error("Invalid file type"), null);
    }
  }, 100);
}

// Usage
readFile("data.txt", (error, content) => {
  if (error) {
    console.error("Failed to read file:", error.message);
    return;
  }
  console.log("File content:", content);
});
```

## Promises

### Promise Basics

```javascript
// Creating a Promise
const promise = new Promise((resolve, reject) => {
  const success = Math.random() > 0.5;

  setTimeout(() => {
    if (success) {
      resolve("Operation successful!");
    } else {
      reject(new Error("Operation failed!"));
    }
  }, 1000);
});

// Consuming a Promise
promise
  .then((result) => {
    console.log("Success:", result);
    return result.toUpperCase(); // Return value for next .then()
  })
  .then((uppercaseResult) => {
    console.log("Uppercase:", uppercaseResult);
  })
  .catch((error) => {
    console.error("Error:", error.message);
  })
  .finally(() => {
    console.log("Promise completed");
  });
```

### Promise States and Methods

```javascript
// Promise states: pending, fulfilled, rejected

// Static methods
Promise.resolve("Immediate value").then((value) => console.log(value));

Promise.reject(new Error("Immediate error")).catch((error) =>
  console.error(error.message)
);

// Promise.all - waits for all promises to resolve
const promises = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];

Promise.all(promises).then((results) => console.log(results)); // [1, 2, 3]

// If any promise rejects, Promise.all rejects immediately
const mixedPromises = [
  Promise.resolve(1),
  Promise.reject(new Error("Failed")),
  Promise.resolve(3),
];

Promise.all(mixedPromises).catch((error) =>
  console.error("One failed:", error.message)
);

// Promise.allSettled - waits for all promises to settle
Promise.allSettled(mixedPromises).then((results) => {
  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      console.log(`Promise ${index} resolved:`, result.value);
    } else {
      console.log(`Promise ${index} rejected:`, result.reason.message);
    }
  });
});

// Promise.race - resolves/rejects with first settled promise
Promise.race([
  new Promise((resolve) => setTimeout(() => resolve("Fast"), 100)),
  new Promise((resolve) => setTimeout(() => resolve("Slow"), 500)),
]).then((result) => console.log(result)); // 'Fast'

// Promise.any - resolves with first fulfilled promise
Promise.any([
  Promise.reject("Error 1"),
  Promise.reject("Error 2"),
  Promise.resolve("Success"),
]).then((result) => console.log(result)); // 'Success'
```

### Promise Chaining and Error Handling

```javascript
// Proper promise chaining
function fetchUserProfile(userId) {
  return fetch(`/api/users/${userId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then((user) => {
      // Transform data
      return {
        ...user,
        fullName: `${user.firstName} ${user.lastName}`,
        isActive: user.lastLogin > Date.now() - 30 * 24 * 60 * 60 * 1000,
      };
    });
}

// Error propagation
fetchUserProfile(123)
  .then((user) => {
    console.log("User profile:", user);

    // Return another promise
    return fetch(`/api/users/${user.id}/posts`);
  })
  .then((response) => response.json())
  .then((posts) => {
    console.log("User posts:", posts);
  })
  .catch((error) => {
    // Catches errors from any step in the chain
    console.error("Error in chain:", error.message);
  });
```

### Converting Callbacks to Promises

```javascript
// Utility function to promisify callback-based functions
function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };
}

// Usage
const readFileAsync = promisify(readFile);
readFileAsync("data.txt")
  .then((content) => console.log(content))
  .catch((error) => console.error(error));

// Manual promise wrapper
function fetchUserDataPromise(userId) {
  return new Promise((resolve, reject) => {
    fetchUserData(userId, (error, user) => {
      if (error) {
        reject(error);
      } else {
        resolve(user);
      }
    });
  });
}
```

## Async/Await

### Basic Async/Await

```javascript
// async functions always return a Promise
async function fetchUser(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Error fetching user:", error.message);
    throw error; // Re-throw for caller to handle
  }
}

// Using async function
async function displayUserInfo() {
  try {
    const user = await fetchUser(123);
    console.log("User name:", user.name);

    const posts = await fetch(`/api/users/${user.id}/posts`);
    const postsData = await posts.json();
    console.log("Post count:", postsData.length);
  } catch (error) {
    console.error("Failed to display user info:", error.message);
  }
}
```

### Error Handling with Async/Await

```javascript
async function robustAsyncFunction() {
  try {
    // Multiple await operations
    const user = await fetchUser(123);
    const profile = await fetchProfile(user.id);
    const settings = await fetchSettings(user.id);

    return { user, profile, settings };
  } catch (error) {
    // Handle specific error types
    if (error.name === "NetworkError") {
      console.error("Network issue:", error.message);
      // Maybe retry logic here
    } else if (error.status === 404) {
      console.error("Resource not found");
    } else {
      console.error("Unexpected error:", error);
    }

    // Optionally re-throw or return default value
    throw error;
  } finally {
    // Cleanup code
    console.log("Function completed");
  }
}
```

### Parallel Execution with Async/Await

```javascript
// Sequential execution (slow)
async function sequentialExecution() {
  const start = Date.now();

  const user1 = await fetchUser(1); // Wait 1 second
  const user2 = await fetchUser(2); // Wait another 1 second
  const user3 = await fetchUser(3); // Wait another 1 second

  console.log("Sequential time:", Date.now() - start); // ~3 seconds
  return [user1, user2, user3];
}

// Parallel execution (fast)
async function parallelExecution() {
  const start = Date.now();

  // Start all promises simultaneously
  const userPromises = [fetchUser(1), fetchUser(2), fetchUser(3)];

  const users = await Promise.all(userPromises);

  console.log("Parallel time:", Date.now() - start); // ~1 second
  return users;
}

// Mixed approach
async function mixedExecution() {
  // First, get user data in parallel
  const [user1, user2] = await Promise.all([fetchUser(1), fetchUser(2)]);

  // Then, get their posts sequentially (if needed for logic)
  const posts1 = await fetchUserPosts(user1.id);
  const posts2 = await fetchUserPosts(user2.id);

  return { user1, user2, posts1, posts2 };
}
```

### Async Iteration

```javascript
// for await...of loop
async function processUsers(userIds) {
  const results = [];

  for await (const userId of userIds) {
    try {
      const user = await fetchUser(userId);
      results.push(user);
      console.log(`Processed user: ${user.name}`);
    } catch (error) {
      console.error(`Failed to process user ${userId}:`, error.message);
    }
  }

  return results;
}

// Async generator
async function* userGenerator(userIds) {
  for (const userId of userIds) {
    try {
      const user = await fetchUser(userId);
      yield user;
    } catch (error) {
      console.error(`Failed to fetch user ${userId}`);
      yield null;
    }
  }
}

// Using async generator
async function consumeUsers() {
  const userIds = [1, 2, 3, 4, 5];

  for await (const user of userGenerator(userIds)) {
    if (user) {
      console.log("Processing user:", user.name);
    }
  }
}
```

## Advanced Asynchronous Patterns

### Debouncing and Throttling with Promises

```javascript
// Debounced async function
function debounceAsync(fn, delay) {
  let timeoutId;
  let lastPromise;

  return function (...args) {
    clearTimeout(timeoutId);

    return new Promise((resolve, reject) => {
      timeoutId = setTimeout(async () => {
        try {
          const result = await fn.apply(this, args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
}

// Usage
const debouncedSearch = debounceAsync(async (query) => {
  const response = await fetch(`/api/search?q=${query}`);
  return response.json();
}, 300);

// Throttled async function
function throttleAsync(fn, limit) {
  let inThrottle;
  let lastPromise;

  return function (...args) {
    if (!inThrottle) {
      inThrottle = true;

      lastPromise = fn.apply(this, args);

      setTimeout(() => {
        inThrottle = false;
      }, limit);

      return lastPromise;
    } else {
      return lastPromise;
    }
  };
}
```

### Retry Logic

```javascript
async function retry(fn, maxAttempts = 3, delay = 1000) {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      console.log(`Attempt ${attempt} failed:`, error.message);

      if (attempt < maxAttempts) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      }
    }
  }

  throw new Error(
    `Failed after ${maxAttempts} attempts. Last error: ${lastError.message}`
  );
}

// Usage
async function fetchWithRetry(url) {
  return retry(
    async () => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    },
    3,
    1000
  );
}
```

### Circuit Breaker Pattern

```javascript
class CircuitBreaker {
  constructor(request, options = {}) {
    this.request = request;
    this.state = "CLOSED"; // CLOSED, OPEN, HALF_OPEN
    this.failureCount = 0;
    this.successCount = 0;
    this.nextAttempt = Date.now();

    this.failureThreshold = options.failureThreshold || 5;
    this.successThreshold = options.successThreshold || 2;
    this.timeout = options.timeout || 60000;
  }

  async call(...args) {
    if (this.state === "OPEN") {
      if (this.nextAttempt > Date.now()) {
        throw new Error("Circuit breaker is OPEN");
      } else {
        this.state = "HALF_OPEN";
        this.successCount = 0;
      }
    }

    try {
      const result = await this.request(...args);
      return this.onSuccess(result);
    } catch (error) {
      return this.onFailure(error);
    }
  }

  onSuccess(result) {
    this.failureCount = 0;

    if (this.state === "HALF_OPEN") {
      this.successCount++;
      if (this.successCount >= this.successThreshold) {
        this.state = "CLOSED";
      }
    }

    return result;
  }

  onFailure(error) {
    this.failureCount++;

    if (this.failureCount >= this.failureThreshold) {
      this.state = "OPEN";
      this.nextAttempt = Date.now() + this.timeout;
    }

    throw error;
  }
}

// Usage
const apiCall = new CircuitBreaker(async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("API Error");
  return response.json();
});
```

### Queue Management

```javascript
class AsyncQueue {
  constructor(concurrency = 1) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }

  async add(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        task,
        resolve,
        reject,
      });

      this.process();
    });
  }

  async process() {
    if (this.running >= this.concurrency || this.queue.length === 0) {
      return;
    }

    this.running++;
    const { task, resolve, reject } = this.queue.shift();

    try {
      const result = await task();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.running--;
      this.process();
    }
  }
}

// Usage
const queue = new AsyncQueue(2); // Max 2 concurrent operations

async function processUrls(urls) {
  const promises = urls.map((url) =>
    queue.add(async () => {
      const response = await fetch(url);
      return response.json();
    })
  );

  return Promise.all(promises);
}
```

## Web APIs and Asynchronous Operations

### Fetch API

```javascript
// Basic fetch
async function basicFetch() {
  try {
    const response = await fetch("/api/data");

    // Check if request was successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

// Advanced fetch with options
async function advancedFetch(url, data) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer token123",
    },
    body: JSON.stringify(data),
    credentials: "include", // Include cookies
    cache: "no-cache",
    redirect: "follow",
  });

  return response.json();
}

// Fetch with timeout
async function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Request timed out");
    }
    throw error;
  }
}
```

### File API and Streams

```javascript
// Reading files asynchronously
async function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

// Streaming large files
async function processLargeFile(file) {
  const stream = file.stream();
  const reader = stream.getReader();

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      // Process chunk
      console.log("Processing chunk of size:", value.length);
    }
  } finally {
    reader.releaseLock();
  }
}
```

## Performance and Best Practices

### Memory Management

```javascript
// Avoid memory leaks with proper cleanup
class DataProcessor {
  constructor() {
    this.cache = new Map();
    this.abortController = new AbortController();
  }

  async processData(id) {
    if (this.cache.has(id)) {
      return this.cache.get(id);
    }

    try {
      const data = await fetch(`/api/data/${id}`, {
        signal: this.abortController.signal,
      });

      const result = await data.json();
      this.cache.set(id, result);
      return result;
    } catch (error) {
      if (error.name !== "AbortError") {
        throw error;
      }
    }
  }

  cleanup() {
    this.abortController.abort();
    this.cache.clear();
  }
}
```

### Error Boundaries for Async Operations

```javascript
class AsyncErrorBoundary {
  constructor() {
    this.errors = [];
    this.maxErrors = 10;
  }

  async safeExecute(asyncFn, context = "Unknown") {
    try {
      return await asyncFn();
    } catch (error) {
      this.logError(error, context);
      return null; // or throw based on strategy
    }
  }

  logError(error, context) {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    };

    this.errors.push(errorInfo);

    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    console.error(`[${context}] Async error:`, error);
  }

  getErrorSummary() {
    return this.errors.slice();
  }
}
```

## Common Interview Questions and Patterns

### Event Loop Questions

```javascript
// What's the output?
console.log("1");

setTimeout(() => console.log("2"), 0);

Promise.resolve().then(() => console.log("3"));

console.log("4");

// Answer: 1, 4, 3, 2
// Explanation: Microtasks (Promises) execute before macrotasks (setTimeout)
```

### Promise Implementation

```javascript
// Basic Promise implementation
class SimplePromise {
  constructor(executor) {
    this.state = "pending";
    this.value = undefined;
    this.handlers = [];

    try {
      executor(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject(error);
    }
  }

  resolve(value) {
    if (this.state === "pending") {
      this.state = "fulfilled";
      this.value = value;
      this.handlers.forEach(this.handle.bind(this));
      this.handlers = [];
    }
  }

  reject(reason) {
    if (this.state === "pending") {
      this.state = "rejected";
      this.value = reason;
      this.handlers.forEach(this.handle.bind(this));
      this.handlers = [];
    }
  }

  then(onFulfilled, onRejected) {
    return new SimplePromise((resolve, reject) => {
      this.handle({
        onFulfilled,
        onRejected,
        resolve,
        reject,
      });
    });
  }

  handle(handler) {
    if (this.state === "pending") {
      this.handlers.push(handler);
      return;
    }

    setTimeout(() => {
      const callback =
        this.state === "fulfilled" ? handler.onFulfilled : handler.onRejected;

      if (!callback) {
        const settle =
          this.state === "fulfilled" ? handler.resolve : handler.reject;
        settle(this.value);
        return;
      }

      try {
        const result = callback(this.value);
        handler.resolve(result);
      } catch (error) {
        handler.reject(error);
      }
    }, 0);
  }
}
```

Understanding asynchronous JavaScript is crucial for modern web development. These concepts are fundamental to handling user interactions, API calls, and creating responsive applications.
