# JavaScript Error Handling and Debugging

## Error Types and Handling

### Built-in Error Types

```javascript
// SyntaxError - Code parsing errors
try {
  eval("invalid syntax {");
} catch (error) {
  console.log(error instanceof SyntaxError); // true
}

// TypeError - Wrong type operations
try {
  null.property;
} catch (error) {
  console.log(error instanceof TypeError); // true
}

// ReferenceError - Undefined variables
try {
  undefinedVariable;
} catch (error) {
  console.log(error instanceof ReferenceError); // true
}

// RangeError - Out of range values
try {
  new Array(-1);
} catch (error) {
  console.log(error instanceof RangeError); // true
}
```

### Custom Error Classes

```javascript
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

class NetworkError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = "NetworkError";
    this.statusCode = statusCode;
  }
}

function validateUser(user) {
  if (!user.email) {
    throw new ValidationError("Email is required", "email");
  }
  if (!user.email.includes("@")) {
    throw new ValidationError("Invalid email format", "email");
  }
}
```

## Try-Catch-Finally

### Basic Error Handling

```javascript
function safeJsonParse(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Parse error:", error.message);
    return null;
  } finally {
    console.log("Parse attempt completed");
  }
}

// Nested try-catch
function processData(data) {
  try {
    try {
      const parsed = JSON.parse(data);
      return validateData(parsed);
    } catch (parseError) {
      console.log("Parse failed, trying alternative format");
      return parseAlternativeFormat(data);
    }
  } catch (error) {
    console.error("All parsing methods failed:", error);
    throw new Error("Unable to process data");
  }
}
```

### Error Propagation

```javascript
function deepFunction() {
  throw new Error("Deep error");
}

function middleFunction() {
  deepFunction(); // Error propagates up
}

function topFunction() {
  try {
    middleFunction();
  } catch (error) {
    console.log("Caught at top level:", error.message);
  }
}
```

## Async Error Handling

### Promises Error Handling

```javascript
// Promise rejection handling
function fetchUserData(id) {
  return fetch(`/api/users/${id}`)
    .then((response) => {
      if (!response.ok) {
        throw new NetworkError(`HTTP ${response.status}`, response.status);
      }
      return response.json();
    })
    .catch((error) => {
      if (error instanceof NetworkError) {
        console.error("Network issue:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      throw error; // Re-throw for caller
    });
}

// Multiple error types
Promise.allSettled([fetchUserData(1), fetchUserData(2), fetchUserData(3)]).then(
  (results) => {
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(`User ${index + 1} failed:`, result.reason);
      }
    });
  }
);
```

### Async/Await Error Handling

```javascript
async function processUserData(userId) {
  try {
    const user = await fetchUserData(userId);
    const profile = await fetchUserProfile(user.id);
    const permissions = await fetchUserPermissions(user.id);

    return { user, profile, permissions };
  } catch (error) {
    if (error instanceof NetworkError && error.statusCode === 404) {
      return null; // User not found
    }
    throw error; // Re-throw unexpected errors
  }
}

// Error handling with retries
async function fetchWithRetry(url, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new NetworkError(`HTTP ${response.status}`, response.status);
      }
      return await response.json();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
}
```

## Global Error Handling

### Window Error Events

```javascript
// Global error handler
window.addEventListener("error", (event) => {
  console.error("Global error:", {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error,
  });

  // Send to error reporting service
  sendErrorReport({
    type: "javascript_error",
    message: event.message,
    stack: event.error?.stack,
    url: window.location.href,
  });
});

// Unhandled promise rejections
window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);

  // Prevent default browser behavior
  event.preventDefault();

  // Report the error
  sendErrorReport({
    type: "unhandled_promise_rejection",
    reason: event.reason,
    promise: event.promise,
  });
});
```

### Node.js Error Handling

```javascript
// Process-level error handling
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});
```

## Debugging Techniques

### Console Methods

```javascript
// Advanced console usage
console.log("Basic log");
console.info("Information");
console.warn("Warning message");
console.error("Error message");

// Object inspection
const user = { name: "John", age: 30, hobbies: ["reading", "gaming"] };
console.table(user);
console.dir(user, { depth: null });

// Grouping
console.group("User Processing");
console.log("Processing user:", user.name);
console.groupCollapsed("Details");
console.log("Age:", user.age);
console.log("Hobbies:", user.hobbies);
console.groupEnd();
console.groupEnd();

// Timing
console.time("Operation");
// ... some operation
console.timeEnd("Operation");

// Stack trace
console.trace("Execution path");
```

### Debugger Statement

```javascript
function complexCalculation(data) {
  let result = 0;

  for (let i = 0; i < data.length; i++) {
    if (data[i] > 100) {
      debugger; // Execution will pause here
    }
    result += data[i] * 2;
  }

  return result;
}
```

### Error Monitoring and Logging

```javascript
class Logger {
  static levels = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3,
  };

  static currentLevel = Logger.levels.INFO;

  static error(message, data = {}) {
    if (this.currentLevel >= this.levels.ERROR) {
      console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, data);
      this.sendToService("error", message, data);
    }
  }

  static warn(message, data = {}) {
    if (this.currentLevel >= this.levels.WARN) {
      console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, data);
    }
  }

  static info(message, data = {}) {
    if (this.currentLevel >= this.levels.INFO) {
      console.info(`[INFO] ${new Date().toISOString()}: ${message}`, data);
    }
  }

  static debug(message, data = {}) {
    if (this.currentLevel >= this.levels.DEBUG) {
      console.debug(`[DEBUG] ${new Date().toISOString()}: ${message}`, data);
    }
  }

  static sendToService(level, message, data) {
    fetch("/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        level,
        message,
        data,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      }),
    }).catch((err) => console.error("Failed to send log:", err));
  }
}
```

## Advanced Error Patterns

### Error Boundaries (React-like pattern)

```javascript
class ErrorBoundary {
  constructor(fallback) {
    this.fallback = fallback;
    this.hasError = false;
  }

  wrap(fn) {
    return (...args) => {
      try {
        if (this.hasError) {
          return this.fallback();
        }
        return fn(...args);
      } catch (error) {
        this.hasError = true;
        console.error("Error boundary caught:", error);
        return this.fallback(error);
      }
    };
  }

  reset() {
    this.hasError = false;
  }
}

const boundary = new ErrorBoundary(() => "Error occurred");
const safeFunction = boundary.wrap((data) => {
  return JSON.parse(data).value;
});
```

### Circuit Breaker Pattern

```javascript
class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000) {
    this.threshold = threshold;
    this.timeout = timeout;
    this.failureCount = 0;
    this.state = "CLOSED"; // CLOSED, OPEN, HALF_OPEN
    this.nextAttempt = Date.now();
  }

  async execute(operation) {
    if (this.state === "OPEN") {
      if (Date.now() < this.nextAttempt) {
        throw new Error("Circuit breaker is OPEN");
      }
      this.state = "HALF_OPEN";
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failureCount = 0;
    this.state = "CLOSED";
  }

  onFailure() {
    this.failureCount++;
    if (this.failureCount >= this.threshold) {
      this.state = "OPEN";
      this.nextAttempt = Date.now() + this.timeout;
    }
  }
}
```

## Performance Monitoring

### Error Impact Tracking

```javascript
class PerformanceMonitor {
  static trackError(error, context = {}) {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
      context,
      performance: {
        memory: performance.memory
          ? {
              used: performance.memory.usedJSHeapSize,
              total: performance.memory.totalJSHeapSize,
              limit: performance.memory.jsHeapSizeLimit,
            }
          : null,
        timing: performance.timing,
        navigation: performance.navigation.type,
      },
    };

    this.sendMetrics(errorInfo);
  }

  static sendMetrics(data) {
    if ("sendBeacon" in navigator) {
      navigator.sendBeacon("/api/metrics", JSON.stringify(data));
    } else {
      fetch("/api/metrics", {
        method: "POST",
        body: JSON.stringify(data),
        keepalive: true,
      });
    }
  }
}
```

## Testing Error Scenarios

### Unit Testing Errors

```javascript
// Testing with Jest
describe("Error handling", () => {
  test("should throw validation error for invalid email", () => {
    expect(() => {
      validateUser({ email: "invalid" });
    }).toThrow(ValidationError);
  });

  test("should handle network errors gracefully", async () => {
    fetch.mockRejectedValue(new NetworkError("Network failed", 500));

    const result = await fetchWithRetry("/api/data");
    expect(result).toBeNull();
  });

  test("should retry on transient failures", async () => {
    fetch
      .mockRejectedValueOnce(new NetworkError("Timeout", 408))
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: "success" }),
      });

    const result = await fetchWithRetry("/api/data");
    expect(result.data).toBe("success");
  });
});
```

## Common Interview Questions

### Error Handling Concepts

**Q: What's the difference between Error and Exception?**
A: In JavaScript, both terms are often used interchangeably. However, technically:

- **Error**: An object that represents an error condition
- **Exception**: The event of throwing an error that disrupts normal flow

**Q: When should you use try-catch vs .catch()?**
A:

- **try-catch**: For synchronous code and async/await
- **.catch()**: For promise chains
- Both can be used with async/await, but try-catch is more readable

**Q: How do you handle errors in async/await vs Promises?**
A:

```javascript
// Promises
fetch("/api/data")
  .then((response) => response.json())
  .catch((error) => console.error(error));

// Async/Await
try {
  const response = await fetch("/api/data");
  const data = await response.json();
} catch (error) {
  console.error(error);
}
```

**Q: What happens to unhandled promise rejections?**
A: They trigger the `unhandledrejection` event and can cause memory leaks or crashes in Node.js

**Q: How do you create custom error types?**
A: Extend the Error class and set appropriate properties like name, message, and custom fields

This comprehensive guide covers all aspects of error handling and debugging in JavaScript, essential for technical interviews and production applications.
