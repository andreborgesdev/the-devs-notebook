# JavaScript Memory Management and Performance

## Memory Management Fundamentals

### JavaScript Memory Model

```javascript
// Stack vs Heap Memory
// Stack: Primitive values, function calls, local variables
let number = 42; // Stored in stack
let string = "hello"; // Stored in stack (small strings)
let boolean = true; // Stored in stack

// Heap: Objects, arrays, functions
let object = { a: 1 }; // Reference in stack, object in heap
let array = [1, 2, 3]; // Reference in stack, array in heap
let func = function () {}; // Reference in stack, function in heap

// Memory allocation examples
function demonstrateMemoryAllocation() {
  // Primitive values - allocated on stack
  let primitiveValue = 100;

  // Objects - allocated on heap
  let objectValue = {
    name: "John",
    age: 30,
    hobbies: ["reading", "gaming"],
  };

  // Function scope creates new stack frame
  function innerFunction() {
    let localVar = "local"; // New stack frame
    return localVar;
  }

  return innerFunction();
}
```

### Garbage Collection

```javascript
// Automatic garbage collection examples
function createObjects() {
  let obj1 = { name: "Object 1" };
  let obj2 = { name: "Object 2", ref: obj1 };

  // When function exits, obj1 and obj2 become unreachable
  // and eligible for garbage collection
}

createObjects(); // Objects created here will be GC'd

// Circular references (handled by modern GC)
function circularReference() {
  let objA = { name: "A" };
  let objB = { name: "B" };

  objA.ref = objB;
  objB.ref = objA; // Circular reference

  // Modern GC can handle this, but be aware of memory implications
}

// Manual memory management patterns
class ResourceManager {
  constructor() {
    this.resources = new Map();
    this.listeners = new Set();
  }

  addResource(id, resource) {
    this.resources.set(id, resource);
  }

  removeResource(id) {
    const resource = this.resources.get(id);
    if (resource && resource.cleanup) {
      resource.cleanup(); // Manual cleanup if needed
    }
    this.resources.delete(id);
  }

  addEventListener(element, event, handler) {
    element.addEventListener(event, handler);
    this.listeners.add({ element, event, handler });
  }

  cleanup() {
    // Remove all event listeners to prevent memory leaks
    this.listeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this.listeners.clear();

    // Clear all resources
    this.resources.forEach((resource) => {
      if (resource.cleanup) {
        resource.cleanup();
      }
    });
    this.resources.clear();
  }
}
```

## Memory Leaks and Prevention

### Common Memory Leak Patterns

```javascript
// 1. Detached DOM Nodes
class DOMMemoryLeak {
  constructor() {
    this.elements = [];
  }

  // BAD: Keeping references to removed DOM elements
  badPatternDetachedDOM() {
    const element = document.createElement("div");
    document.body.appendChild(element);
    this.elements.push(element); // Keep reference

    document.body.removeChild(element); // Remove from DOM
    // element is still referenced in this.elements - MEMORY LEAK
  }

  // GOOD: Clear references when removing DOM elements
  goodPatternDetachedDOM() {
    const element = document.createElement("div");
    document.body.appendChild(element);
    const elementIndex = this.elements.length;
    this.elements.push(element);

    // When removing
    document.body.removeChild(element);
    this.elements.splice(elementIndex, 1); // Clear reference
  }
}

// 2. Event Listeners
class EventListenerLeaks {
  constructor() {
    this.handlers = new Map();
  }

  // BAD: Not removing event listeners
  badPatternEventListeners() {
    const button = document.createElement("button");
    const handler = () => console.log("clicked");

    button.addEventListener("click", handler);
    document.body.appendChild(button);

    // Later, removing button without removing listener
    document.body.removeChild(button); // MEMORY LEAK
  }

  // GOOD: Always remove event listeners
  goodPatternEventListeners() {
    const button = document.createElement("button");
    const handler = () => console.log("clicked");

    button.addEventListener("click", handler);
    this.handlers.set(button, { event: "click", handler });
    document.body.appendChild(button);

    // When removing
    const listenerInfo = this.handlers.get(button);
    button.removeEventListener(listenerInfo.event, listenerInfo.handler);
    this.handlers.delete(button);
    document.body.removeChild(button);
  }
}

// 3. Closures holding references
function closureMemoryLeak() {
  let largeData = new Array(1000000).fill("data");

  // BAD: Closure holds reference to large data
  return function smallFunction() {
    console.log("I only need this small function");
    // largeData is still accessible here, preventing GC
  };
}

// GOOD: Clear references in closures
function closureGoodPattern() {
  let largeData = new Array(1000000).fill("data");

  // Process data
  const result = largeData.reduce((acc, item) => acc + item.length, 0);

  // Clear reference
  largeData = null;

  return function smallFunction() {
    console.log("Result:", result);
    // largeData can be garbage collected
  };
}

// 4. Timers and intervals
class TimerMemoryLeaks {
  constructor() {
    this.timers = new Set();
    this.data = new Array(1000000).fill("data");
  }

  // BAD: Not clearing timers
  badPatternTimers() {
    const timer = setInterval(() => {
      console.log(this.data.length); // Keeps 'this' alive
    }, 1000);

    // If object is no longer needed but timer isn't cleared,
    // the entire object stays in memory
  }

  // GOOD: Always clear timers
  goodPatternTimers() {
    const timer = setInterval(() => {
      console.log(this.data.length);
    }, 1000);

    this.timers.add(timer);

    // Clear when done
    setTimeout(() => {
      clearInterval(timer);
      this.timers.delete(timer);
    }, 10000);
  }

  cleanup() {
    this.timers.forEach((timer) => clearInterval(timer));
    this.timers.clear();
  }
}
```

### Memory Leak Detection

```javascript
class MemoryMonitor {
  static measureMemoryUsage(fn, iterations = 1000) {
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }

    const initialMemory = process.memoryUsage();
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      fn();
    }

    if (global.gc) {
      global.gc();
    }

    const finalMemory = process.memoryUsage();
    const end = performance.now();

    return {
      heapUsedDiff: finalMemory.heapUsed - initialMemory.heapUsed,
      heapTotalDiff: finalMemory.heapTotal - initialMemory.heapTotal,
      executionTime: end - start,
      memoryPerOperation:
        (finalMemory.heapUsed - initialMemory.heapUsed) / iterations,
    };
  }

  static detectMemoryLeaks(fn, threshold = 1024 * 1024) {
    // 1MB threshold
    const results = [];

    for (let i = 0; i < 10; i++) {
      if (global.gc) global.gc();

      const before = process.memoryUsage().heapUsed;
      fn();

      if (global.gc) global.gc();

      const after = process.memoryUsage().heapUsed;
      const leak = after - before;

      results.push(leak);

      if (leak > threshold) {
        console.warn(`Potential memory leak detected: ${leak} bytes`);
      }
    }

    return results;
  }
}

// Usage
const memoryStats = MemoryMonitor.measureMemoryUsage(() => {
  const arr = new Array(1000).fill("test");
  return arr.map((x) => x.toUpperCase());
});

console.log("Memory usage:", memoryStats);
```

## Performance Optimization

### Object Creation Optimization

```javascript
// Object pooling pattern
class ObjectPool {
  constructor(createFn, resetFn, maxSize = 100) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.maxSize = maxSize;
    this.pool = [];
  }

  acquire() {
    if (this.pool.length > 0) {
      return this.pool.pop();
    }
    return this.createFn();
  }

  release(obj) {
    if (this.pool.length < this.maxSize) {
      this.resetFn(obj);
      this.pool.push(obj);
    }
  }
}

// Example: Vector object pool
class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  add(vector) {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  }

  reset() {
    this.x = 0;
    this.y = 0;
    return this;
  }
}

const vectorPool = new ObjectPool(
  () => new Vector(),
  (vector) => vector.reset()
);

// Usage
function performCalculations() {
  const v1 = vectorPool.acquire();
  const v2 = vectorPool.acquire();

  v1.x = 10;
  v1.y = 20;
  v2.x = 5;
  v2.y = 15;

  v1.add(v2);

  // Return to pool
  vectorPool.release(v1);
  vectorPool.release(v2);
}
```

### Array and String Optimization

```javascript
class ArrayOptimizations {
  // Efficient array operations
  static efficientArrayConcat(arrays) {
    // BAD: Multiple concat calls create new arrays
    // let result = [];
    // arrays.forEach(arr => result = result.concat(arr));

    // GOOD: Calculate total length and use single allocation
    const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
    const result = new Array(totalLength);
    let index = 0;

    for (const arr of arrays) {
      for (const item of arr) {
        result[index++] = item;
      }
    }

    return result;
  }

  // Efficient array filtering and mapping
  static efficientFilterMap(array, filterFn, mapFn) {
    // BAD: Two passes through array
    // return array.filter(filterFn).map(mapFn);

    // GOOD: Single pass
    const result = [];
    for (const item of array) {
      if (filterFn(item)) {
        result.push(mapFn(item));
      }
    }
    return result;
  }

  // Efficient array deduplication
  static efficientDedup(array) {
    // For primitive values
    if (array.length < 1000) {
      return [...new Set(array)];
    }

    // For large arrays, Map might be faster
    const seen = new Map();
    const result = [];

    for (const item of array) {
      if (!seen.has(item)) {
        seen.set(item, true);
        result.push(item);
      }
    }

    return result;
  }
}

class StringOptimizations {
  // Efficient string concatenation
  static efficientStringConcat(strings) {
    // BAD: Multiple string concatenations
    // let result = '';
    // strings.forEach(str => result += str);

    // GOOD: Use array join
    return strings.join("");
  }

  // Efficient string building
  static buildHTML(items) {
    const parts = ["<ul>"];

    for (const item of items) {
      parts.push(`<li>${item.name}: ${item.value}</li>`);
    }

    parts.push("</ul>");
    return parts.join("");
  }

  // Template literal optimization
  static formatMessage(user, action, timestamp) {
    // Pre-compute expensive operations
    const formattedTime = new Date(timestamp).toLocaleString();

    return `User ${user.name} performed ${action} at ${formattedTime}`;
  }
}
```

### Function Optimization

```javascript
// Memoization for expensive calculations
function memoize(fn, getKey = (...args) => args.join(",")) {
  const cache = new Map();

  return function memoized(...args) {
    const key = getKey(...args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Example: Fibonacci with memoization
const fibonacci = memoize(function (n) {
  if (n < 2) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});

// Debouncing and throttling
function debounce(fn, delay) {
  let timeoutId;

  return function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

function throttle(fn, interval) {
  let lastCall = 0;

  return function throttled(...args) {
    const now = Date.now();
    if (now - lastCall >= interval) {
      lastCall = now;
      return fn.apply(this, args);
    }
  };
}

// Lazy evaluation
class LazySequence {
  constructor(iterable) {
    this.source = iterable;
    this.operations = [];
  }

  map(fn) {
    this.operations.push({ type: "map", fn });
    return this;
  }

  filter(fn) {
    this.operations.push({ type: "filter", fn });
    return this;
  }

  take(count) {
    this.operations.push({ type: "take", count });
    return this;
  }

  *[Symbol.iterator]() {
    let taken = 0;

    for (const item of this.source) {
      let current = item;
      let skip = false;

      for (const op of this.operations) {
        if (op.type === "map") {
          current = op.fn(current);
        } else if (op.type === "filter") {
          if (!op.fn(current)) {
            skip = true;
            break;
          }
        } else if (op.type === "take") {
          if (taken >= op.count) {
            return;
          }
        }
      }

      if (!skip) {
        yield current;
        taken++;
      }
    }
  }

  toArray() {
    return [...this];
  }
}

// Usage
const numbers = new Array(1000000).fill(0).map((_, i) => i);
const result = new LazySequence(numbers)
  .filter((x) => x % 2 === 0)
  .map((x) => x * 2)
  .take(10)
  .toArray();
```

## Performance Monitoring

### Performance Measurement

```javascript
class PerformanceProfiler {
  static profile(name, fn) {
    const start = performance.now();
    const startMemory = performance.memory
      ? performance.memory.usedJSHeapSize
      : 0;

    try {
      const result = fn();

      if (result && typeof result.then === "function") {
        return result.then((value) => {
          this.logProfile(name, start, startMemory);
          return value;
        });
      }

      this.logProfile(name, start, startMemory);
      return result;
    } catch (error) {
      this.logProfile(name, start, startMemory, error);
      throw error;
    }
  }

  static logProfile(name, start, startMemory, error = null) {
    const end = performance.now();
    const endMemory = performance.memory
      ? performance.memory.usedJSHeapSize
      : 0;

    console.log(`Performance Profile: ${name}`);
    console.log(`  Time: ${(end - start).toFixed(2)}ms`);
    console.log(
      `  Memory: ${((endMemory - startMemory) / 1024 / 1024).toFixed(2)}MB`
    );

    if (error) {
      console.log(`  Error: ${error.message}`);
    }
  }

  static benchmark(name, fn, iterations = 1000) {
    const times = [];

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      fn();
      const end = performance.now();
      times.push(end - start);
    }

    const avg = times.reduce((a, b) => a + b) / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);
    const median = times.sort((a, b) => a - b)[Math.floor(times.length / 2)];

    console.log(`Benchmark: ${name}`);
    console.log(`  Iterations: ${iterations}`);
    console.log(`  Average: ${avg.toFixed(2)}ms`);
    console.log(`  Median: ${median.toFixed(2)}ms`);
    console.log(`  Min: ${min.toFixed(2)}ms`);
    console.log(`  Max: ${max.toFixed(2)}ms`);

    return { avg, median, min, max };
  }
}

// Usage
PerformanceProfiler.profile("Array Processing", () => {
  const arr = new Array(100000).fill(0).map((_, i) => i);
  return arr.filter((x) => x % 2 === 0).map((x) => x * 2);
});

PerformanceProfiler.benchmark(
  "Object Creation",
  () => {
    return { name: "test", value: Math.random() };
  },
  10000
);
```

### Memory Profiling

```javascript
class MemoryProfiler {
  static takeSnapshot() {
    if (!performance.memory) {
      console.warn("Performance.memory not available");
      return null;
    }

    return {
      used: performance.memory.usedJSHeapSize,
      total: performance.memory.totalJSHeapSize,
      limit: performance.memory.jsHeapSizeLimit,
      timestamp: Date.now(),
    };
  }

  static compareSnapshots(before, after) {
    if (!before || !after) return null;

    return {
      usedDiff: after.used - before.used,
      totalDiff: after.total - before.total,
      timeDiff: after.timestamp - before.timestamp,
      rate: (after.used - before.used) / (after.timestamp - before.timestamp),
    };
  }

  static monitorMemoryUsage(duration = 10000, interval = 1000) {
    const snapshots = [];
    const startTime = Date.now();

    const monitor = setInterval(() => {
      const snapshot = this.takeSnapshot();
      if (snapshot) {
        snapshots.push(snapshot);
      }

      if (Date.now() - startTime >= duration) {
        clearInterval(monitor);
        this.analyzeMemoryTrend(snapshots);
      }
    }, interval);

    return snapshots;
  }

  static analyzeMemoryTrend(snapshots) {
    if (snapshots.length < 2) return;

    const increases = snapshots
      .slice(1)
      .map((snapshot, i) => snapshot.used - snapshots[i].used);

    const totalIncrease =
      snapshots[snapshots.length - 1].used - snapshots[0].used;
    const avgIncrease = increases.reduce((a, b) => a + b, 0) / increases.length;

    console.log("Memory Usage Analysis:");
    console.log(
      `  Total increase: ${(totalIncrease / 1024 / 1024).toFixed(2)} MB`
    );
    console.log(
      `  Average per interval: ${(avgIncrease / 1024 / 1024).toFixed(2)} MB`
    );
    console.log(`  Potential leak: ${avgIncrease > 0 ? "Yes" : "No"}`);
  }
}
```

## Best Practices

### Memory Management Guidelines

```javascript
class MemoryBestPractices {
  // 1. Use weak references when appropriate
  static createWeakCache() {
    const cache = new WeakMap();

    return {
      set(key, value) {
        if (typeof key === "object") {
          cache.set(key, value);
        }
      },
      get(key) {
        return cache.get(key);
      },
      // No need to manually clear - objects are GC'd when no other references exist
    };
  }

  // 2. Avoid global variables
  static avoidGlobals() {
    // BAD
    // window.myGlobalData = new Array(1000000);

    // GOOD - Use modules or namespaces
    const MyModule = (() => {
      let privateData = new Array(1000000);

      return {
        getData() {
          return privateData;
        },
        clearData() {
          privateData = null;
        },
      };
    })();

    return MyModule;
  }

  // 3. Clean up event listeners
  static properEventListenerManagement() {
    class Component {
      constructor(element) {
        this.element = element;
        this.listeners = [];
        this.setupEventListeners();
      }

      setupEventListeners() {
        const clickHandler = this.handleClick.bind(this);
        const resizeHandler = this.handleResize.bind(this);

        this.element.addEventListener("click", clickHandler);
        window.addEventListener("resize", resizeHandler);

        this.listeners.push(
          { element: this.element, event: "click", handler: clickHandler },
          { element: window, event: "resize", handler: resizeHandler }
        );
      }

      handleClick(event) {
        console.log("Clicked");
      }

      handleResize(event) {
        console.log("Resized");
      }

      destroy() {
        this.listeners.forEach(({ element, event, handler }) => {
          element.removeEventListener(event, handler);
        });
        this.listeners = [];
      }
    }

    return Component;
  }

  // 4. Use object pooling for frequently created objects
  static implementObjectPooling() {
    class ParticlePool {
      constructor(maxSize = 1000) {
        this.pool = [];
        this.maxSize = maxSize;
      }

      acquire() {
        if (this.pool.length > 0) {
          return this.pool.pop().reset();
        }
        return new Particle();
      }

      release(particle) {
        if (this.pool.length < this.maxSize) {
          this.pool.push(particle);
        }
      }
    }

    class Particle {
      constructor() {
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.life = 1;
      }

      reset() {
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.life = 1;
        return this;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 0.01;
      }
    }

    return ParticlePool;
  }
}
```

## Common Interview Questions

**Q: How does JavaScript garbage collection work?**
A: JavaScript uses automatic garbage collection, primarily mark-and-sweep algorithm. It identifies unreachable objects and frees their memory.

**Q: What are the main causes of memory leaks in JavaScript?**
A: Detached DOM nodes, uncleaned event listeners, closures holding large objects, forgotten timers/intervals, and global variables.

**Q: How do you detect memory leaks?**
A: Use browser dev tools, monitor memory usage over time, use performance.memory API, and implement memory profiling in your code.

**Q: What's the difference between stack and heap memory?**
A: Stack stores primitive values and function calls (LIFO), heap stores objects and complex data structures with references.

**Q: How can you optimize performance in JavaScript?**
A: Use efficient algorithms, minimize DOM operations, implement memoization, use object pooling, avoid memory leaks, and profile your code.

**Q: What are WeakMap and WeakSet used for?**
A: They hold weak references to objects, allowing garbage collection when no other references exist. Useful for caching and avoiding memory leaks.

This comprehensive guide covers memory management and performance optimization essential for JavaScript technical interviews and production applications.
