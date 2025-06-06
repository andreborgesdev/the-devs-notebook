# DOM and Browser APIs

## DOM Fundamentals

### What is the DOM?

The Document Object Model (DOM) is a programming interface for HTML and XML documents. It represents the page so that programs can change the document structure, style, and content.

```javascript
// DOM Tree Structure
/*
Document
├── html
    ├── head
    │   ├── title
    │   └── meta
    └── body
        ├── div
        └── p
*/
```

### DOM Node Types

```javascript
// Common Node Types
console.log(Node.ELEMENT_NODE); // 1
console.log(Node.TEXT_NODE); // 3
console.log(Node.COMMENT_NODE); // 8
console.log(Node.DOCUMENT_NODE); // 9

// Check node type
const element = document.getElementById("myDiv");
if (element.nodeType === Node.ELEMENT_NODE) {
  console.log("This is an element node");
}
```

## DOM Selection Methods

### Modern Selection Methods

```javascript
// Single element selection
const elementById = document.getElementById("myId");
const elementByQuery = document.querySelector(".my-class");
const elementByQuery2 = document.querySelector("#myId");

// Multiple elements selection
const elementsByClass = document.getElementsByClassName("my-class");
const elementsByTag = document.getElementsByTagName("div");
const elementsByQuery = document.querySelectorAll(".my-class");

// Advanced selectors
const complexSelector = document.querySelector("div.container > p:first-child");
const pseudoSelector = document.querySelector("input:checked");
const attributeSelector = document.querySelector('[data-role="button"]');
```

### Selection Performance Comparison

```javascript
// Performance benchmark
function benchmarkSelectors() {
  const iterations = 100000;

  // getElementById - fastest
  console.time("getElementById");
  for (let i = 0; i < iterations; i++) {
    document.getElementById("test");
  }
  console.timeEnd("getElementById");

  // querySelector - slower but more flexible
  console.time("querySelector");
  for (let i = 0; i < iterations; i++) {
    document.querySelector("#test");
  }
  console.timeEnd("querySelector");
}
```

## DOM Manipulation

### Creating and Modifying Elements

```javascript
// Creating elements
const div = document.createElement("div");
const textNode = document.createTextNode("Hello World");
const fragment = document.createDocumentFragment();

// Setting attributes
div.setAttribute("class", "my-class");
div.setAttribute("data-id", "123");
div.id = "myDiv";
div.className = "container";

// Modern attribute methods
div.classList.add("active", "highlight");
div.classList.remove("inactive");
div.classList.toggle("visible");
div.classList.contains("active"); // true

// Setting content
div.textContent = "Plain text content";
div.innerHTML = "<span>HTML content</span>";
div.innerText = "Text respecting CSS visibility";

// Safe HTML insertion
div.insertAdjacentHTML("beforeend", "<p>New paragraph</p>");
```

### DOM Insertion and Removal

```javascript
// Insertion methods
const parent = document.getElementById("parent");
const child = document.createElement("div");

// Traditional methods
parent.appendChild(child);
parent.insertBefore(child, parent.firstChild);

// Modern methods
parent.append(child, "text", anotherElement);
parent.prepend(child);
child.before(newElement);
child.after(newElement);
child.replaceWith(newElement);

// Removal
child.remove(); // Modern
parent.removeChild(child); // Traditional

// Cloning
const clone = child.cloneNode(true); // Deep clone
const shallowClone = child.cloneNode(false);
```

### DocumentFragment for Performance

```javascript
// Efficient DOM manipulation with fragments
function efficientListCreation(items) {
  const fragment = document.createDocumentFragment();

  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item.name;
    li.dataset.id = item.id;
    fragment.appendChild(li);
  });

  // Single DOM operation
  document.getElementById("list").appendChild(fragment);
}

// Performance comparison
function inefficientWay(items) {
  const list = document.getElementById("list");
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item.name;
    list.appendChild(li); // Multiple DOM operations
  });
}
```

## Event Handling

### Event Listener Patterns

```javascript
// Basic event listeners
const button = document.getElementById("myButton");

// Method 1: Property assignment (not recommended)
button.onclick = function () {
  console.log("Clicked");
};

// Method 2: addEventListener (recommended)
button.addEventListener("click", function (event) {
  console.log("Button clicked", event);
});

// Method 3: Arrow function
button.addEventListener("click", (event) => {
  event.preventDefault();
  console.log("Arrow function handler");
});

// Method 4: Named function for removal
function handleClick(event) {
  console.log("Named function handler");
}
button.addEventListener("click", handleClick);
button.removeEventListener("click", handleClick);
```

### Event Object Properties

```javascript
function handleEvent(event) {
  // Event properties
  console.log("Type:", event.type);
  console.log("Target:", event.target);
  console.log("Current target:", event.currentTarget);
  console.log("Phase:", event.eventPhase);
  console.log("Bubbles:", event.bubbles);
  console.log("Cancelable:", event.cancelable);
  console.log("Timestamp:", event.timeStamp);

  // Mouse events
  if (event.type.startsWith("mouse")) {
    console.log("Client X/Y:", event.clientX, event.clientY);
    console.log("Page X/Y:", event.pageX, event.pageY);
    console.log("Screen X/Y:", event.screenX, event.screenY);
    console.log("Button:", event.button);
    console.log("Buttons:", event.buttons);
  }

  // Keyboard events
  if (event.type.startsWith("key")) {
    console.log("Key:", event.key);
    console.log("Code:", event.code);
    console.log("Ctrl:", event.ctrlKey);
    console.log("Alt:", event.altKey);
    console.log("Shift:", event.shiftKey);
  }
}
```

### Event Delegation

```javascript
// Efficient event handling for dynamic content
const container = document.getElementById("container");

container.addEventListener("click", function (event) {
  // Check if clicked element matches selector
  if (event.target.matches(".delete-btn")) {
    handleDelete(event);
  } else if (event.target.matches(".edit-btn")) {
    handleEdit(event);
  } else if (event.target.closest(".item")) {
    handleItemClick(event);
  }
});

// Custom delegation helper
function delegate(container, selector, eventType, handler) {
  container.addEventListener(eventType, function (event) {
    const target = event.target.closest(selector);
    if (target && container.contains(target)) {
      handler.call(target, event);
    }
  });
}

// Usage
delegate(document.body, ".button", "click", function (event) {
  console.log("Button clicked:", this);
});
```

### Custom Events

```javascript
// Creating custom events
const customEvent = new CustomEvent("userLogin", {
  detail: {
    username: "john_doe",
    timestamp: Date.now(),
  },
  bubbles: true,
  cancelable: true,
});

// Dispatching custom events
document.addEventListener("userLogin", function (event) {
  console.log("User logged in:", event.detail);
});

document.dispatchEvent(customEvent);

// Event constructor patterns
class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(eventName, callback) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }
    this.events.get(eventName).push(callback);
  }

  emit(eventName, data) {
    const callbacks = this.events.get(eventName);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }

  off(eventName, callback) {
    const callbacks = this.events.get(eventName);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }
}
```

## Browser APIs

### Local Storage and Session Storage

```javascript
// localStorage - persists until manually cleared
localStorage.setItem("user", JSON.stringify({ name: "John", age: 30 }));
const user = JSON.parse(localStorage.getItem("user"));
localStorage.removeItem("user");
localStorage.clear();

// sessionStorage - persists for session only
sessionStorage.setItem("tempData", "temporary value");
const tempData = sessionStorage.getItem("tempData");

// Storage event listener
window.addEventListener("storage", function (event) {
  console.log("Storage changed:", {
    key: event.key,
    oldValue: event.oldValue,
    newValue: event.newValue,
    storageArea: event.storageArea,
  });
});

// Storage utility class
class StorageManager {
  static set(key, value, useSession = false) {
    const storage = useSession ? sessionStorage : localStorage;
    try {
      storage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("Storage error:", error);
      return false;
    }
  }

  static get(key, useSession = false) {
    const storage = useSession ? sessionStorage : localStorage;
    try {
      const item = storage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Parse error:", error);
      return null;
    }
  }

  static remove(key, useSession = false) {
    const storage = useSession ? sessionStorage : localStorage;
    storage.removeItem(key);
  }

  static clear(useSession = false) {
    const storage = useSession ? sessionStorage : localStorage;
    storage.clear();
  }
}
```

### Fetch API

```javascript
// Basic fetch usage
async function fetchData(url) {
  try {
    const response = await fetch(url);

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
async function postData(url, data) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken(),
    },
    body: JSON.stringify(data),
    credentials: "include",
    mode: "cors",
    cache: "no-cache",
  });

  return response.json();
}

// Fetch with timeout
function fetchWithTimeout(url, timeout = 5000) {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), timeout)
    ),
  ]);
}

// Fetch utility class
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: { ...this.defaultHeaders, ...options.headers },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  get(endpoint, options) {
    return this.request(endpoint, { method: "GET", ...options });
  }

  post(endpoint, data, options) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
      ...options,
    });
  }

  put(endpoint, data, options) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
      ...options,
    });
  }

  delete(endpoint, options) {
    return this.request(endpoint, { method: "DELETE", ...options });
  }
}
```

### Intersection Observer API

```javascript
// Basic intersection observer
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        console.log("Element is visible");
        entry.target.classList.add("visible");
      } else {
        entry.target.classList.remove("visible");
      }
    });
  },
  {
    threshold: 0.5,
    rootMargin: "0px 0px -100px 0px",
  }
);

// Observe elements
const elementsToObserve = document.querySelectorAll(".animate-on-scroll");
elementsToObserve.forEach((el) => observer.observe(el));

// Lazy loading with Intersection Observer
class LazyLoader {
  constructor() {
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      { threshold: 0.1 }
    );
  }

  handleIntersection(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        this.observer.unobserve(img);
      }
    });
  }

  observe(element) {
    this.observer.observe(element);
  }
}

// Usage
const lazyLoader = new LazyLoader();
document.querySelectorAll("img[data-src]").forEach((img) => {
  lazyLoader.observe(img);
});
```

### Geolocation API

```javascript
// Basic geolocation
function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000,
      }
    );
  });
}

// Usage
async function getLocation() {
  try {
    const position = await getCurrentPosition();
    console.log("Latitude:", position.coords.latitude);
    console.log("Longitude:", position.coords.longitude);
    console.log("Accuracy:", position.coords.accuracy, "meters");
  } catch (error) {
    console.error("Location error:", error.message);
  }
}

// Watch position changes
let watchId;

function startWatching() {
  watchId = navigator.geolocation.watchPosition(
    (position) => {
      console.log("Position updated:", position.coords);
    },
    (error) => {
      console.error("Watch error:", error);
    },
    { enableHighAccuracy: true }
  );
}

function stopWatching() {
  if (watchId) {
    navigator.geolocation.clearWatch(watchId);
  }
}
```

### Web Workers

```javascript
// Main thread
if (typeof Worker !== "undefined") {
  const worker = new Worker("worker.js");

  // Send data to worker
  worker.postMessage({ command: "start", data: [1, 2, 3, 4, 5] });

  // Receive data from worker
  worker.onmessage = function (event) {
    console.log("Worker result:", event.data);
  };

  // Handle worker errors
  worker.onerror = function (error) {
    console.error("Worker error:", error);
  };

  // Terminate worker
  setTimeout(() => {
    worker.terminate();
  }, 10000);
}

// worker.js
self.onmessage = function (event) {
  const { command, data } = event.data;

  if (command === "start") {
    // Perform heavy computation
    const result = data.map((num) => {
      let factorial = 1;
      for (let i = 2; i <= num; i++) {
        factorial *= i;
      }
      return factorial;
    });

    // Send result back to main thread
    self.postMessage(result);
  }
};

// Worker utility class
class WorkerManager {
  constructor(workerScript) {
    this.worker = new Worker(workerScript);
    this.callbacks = new Map();
    this.messageId = 0;

    this.worker.onmessage = this.handleMessage.bind(this);
    this.worker.onerror = this.handleError.bind(this);
  }

  handleMessage(event) {
    const { id, result, error } = event.data;
    const callback = this.callbacks.get(id);

    if (callback) {
      if (error) {
        callback.reject(new Error(error));
      } else {
        callback.resolve(result);
      }
      this.callbacks.delete(id);
    }
  }

  handleError(error) {
    console.error("Worker error:", error);
  }

  execute(data) {
    return new Promise((resolve, reject) => {
      const id = ++this.messageId;
      this.callbacks.set(id, { resolve, reject });
      this.worker.postMessage({ id, data });
    });
  }

  terminate() {
    this.worker.terminate();
    this.callbacks.clear();
  }
}
```

## Performance Optimization

### DOM Performance Best Practices

```javascript
// Batch DOM operations
function batchDOMUpdates(elements, updates) {
  // Force layout/reflow before batching
  const height = document.body.offsetHeight;

  // Batch all updates
  elements.forEach((element, index) => {
    element.style.transform = updates[index].transform;
    element.style.opacity = updates[index].opacity;
  });
}

// Use requestAnimationFrame for animations
function animateElement(element, startValue, endValue, duration) {
  const startTime = performance.now();

  function animate(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const value = startValue + (endValue - startValue) * progress;
    element.style.opacity = value;

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}

// Debounce scroll events
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

const debouncedScrollHandler = debounce(() => {
  console.log("Scroll event handled");
}, 100);

window.addEventListener("scroll", debouncedScrollHandler);

// Throttle resize events
function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

const throttledResizeHandler = throttle(() => {
  console.log("Resize event handled");
}, 250);

window.addEventListener("resize", throttledResizeHandler);
```

### Virtual Scrolling

```javascript
class VirtualScrollList {
  constructor(container, items, itemHeight) {
    this.container = container;
    this.items = items;
    this.itemHeight = itemHeight;
    this.visibleCount = Math.ceil(container.clientHeight / itemHeight) + 2;
    this.startIndex = 0;

    this.setupContainer();
    this.setupScrollHandler();
    this.render();
  }

  setupContainer() {
    this.container.style.overflowY = "auto";
    this.container.style.height = "400px";

    this.viewport = document.createElement("div");
    this.viewport.style.height = `${this.items.length * this.itemHeight}px`;
    this.viewport.style.position = "relative";

    this.container.appendChild(this.viewport);
  }

  setupScrollHandler() {
    this.container.addEventListener("scroll", () => {
      const scrollTop = this.container.scrollTop;
      const newStartIndex = Math.floor(scrollTop / this.itemHeight);

      if (newStartIndex !== this.startIndex) {
        this.startIndex = newStartIndex;
        this.render();
      }
    });
  }

  render() {
    this.viewport.innerHTML = "";

    const endIndex = Math.min(
      this.startIndex + this.visibleCount,
      this.items.length
    );

    for (let i = this.startIndex; i < endIndex; i++) {
      const item = document.createElement("div");
      item.style.position = "absolute";
      item.style.top = `${i * this.itemHeight}px`;
      item.style.height = `${this.itemHeight}px`;
      item.style.width = "100%";
      item.textContent = this.items[i];

      this.viewport.appendChild(item);
    }
  }
}

// Usage
const container = document.getElementById("scroll-container");
const items = Array.from({ length: 10000 }, (_, i) => `Item ${i + 1}`);
const virtualList = new VirtualScrollList(container, items, 40);
```

## Common Interview Questions

### DOM Manipulation Questions

**Q: What's the difference between innerHTML, textContent, and innerText?**

```javascript
const element = document.createElement("div");
element.innerHTML = '<span style="display: none;">Hidden</span>Visible';

console.log(element.innerHTML); // '<span style="display: none;">Hidden</span>Visible'
console.log(element.textContent); // 'HiddenVisible'
console.log(element.innerText); // 'Visible' (respects CSS)

// Security consideration
// innerHTML can execute scripts (XSS vulnerability)
element.innerHTML = '<script>alert("XSS")</script>'; // Dangerous

// textContent is safe
element.textContent = '<script>alert("Safe")</script>'; // Shows as text
```

**Q: How do you check if an element exists in the DOM?**

```javascript
// Method 1: Check if selection returns element
function elementExists(selector) {
  return document.querySelector(selector) !== null;
}

// Method 2: Check if element is in document
function isInDOM(element) {
  return document.contains(element);
}

// Method 3: Check with try-catch for invalid selectors
function safeElementExists(selector) {
  try {
    return document.querySelector(selector) !== null;
  } catch (error) {
    return false;
  }
}
```

**Q: How do you handle memory leaks with event listeners?**

```javascript
class ComponentWithListeners {
  constructor(element) {
    this.element = element;
    this.handleClick = this.handleClick.bind(this);
    this.handleScroll = this.handleScroll.bind(this);

    this.setupListeners();
  }

  setupListeners() {
    this.element.addEventListener("click", this.handleClick);
    window.addEventListener("scroll", this.handleScroll);
  }

  handleClick(event) {
    console.log("Clicked");
  }

  handleScroll(event) {
    console.log("Scrolled");
  }

  // Important: Clean up listeners to prevent memory leaks
  destroy() {
    this.element.removeEventListener("click", this.handleClick);
    window.removeEventListener("scroll", this.handleScroll);
  }
}

// Automatic cleanup with AbortController (modern approach)
class ModernComponent {
  constructor(element) {
    this.element = element;
    this.controller = new AbortController();
    this.setupListeners();
  }

  setupListeners() {
    this.element.addEventListener("click", this.handleClick, {
      signal: this.controller.signal,
    });

    window.addEventListener("scroll", this.handleScroll, {
      signal: this.controller.signal,
    });
  }

  handleClick = (event) => {
    console.log("Clicked");
  };

  handleScroll = (event) => {
    console.log("Scrolled");
  };

  destroy() {
    this.controller.abort(); // Removes all listeners at once
  }
}
```

### Event Handling Questions

**Q: Explain event bubbling and capturing.**

```javascript
// Event phases demonstration
document.addEventListener(
  "click",
  (e) => {
    console.log("Document - Capture Phase");
  },
  true
); // true = capture phase

document.body.addEventListener(
  "click",
  (e) => {
    console.log("Body - Capture Phase");
  },
  true
);

document.body.addEventListener("click", (e) => {
  console.log("Body - Bubble Phase");
}); // false = bubble phase (default)

document.addEventListener("click", (e) => {
  console.log("Document - Bubble Phase");
});

// Stopping propagation
function stopBubbling(event) {
  event.stopPropagation(); // Prevents bubbling
  event.stopImmediatePropagation(); // Prevents other listeners on same element
}

// Preventing default behavior
function preventFormSubmit(event) {
  event.preventDefault(); // Prevents default form submission
  return false; // Alternative way (older)
}
```

**Q: How do you implement event delegation?**

```javascript
// Event delegation for dynamic content
class TodoList {
  constructor(container) {
    this.container = container;
    this.todos = [];
    this.setupEventDelegation();
  }

  setupEventDelegation() {
    this.container.addEventListener("click", (event) => {
      const action = event.target.dataset.action;
      const todoId = event.target.closest("[data-todo-id]")?.dataset.todoId;

      switch (action) {
        case "delete":
          this.deleteTodo(todoId);
          break;
        case "toggle":
          this.toggleTodo(todoId);
          break;
        case "edit":
          this.editTodo(todoId);
          break;
      }
    });

    // Handle input events for editing
    this.container.addEventListener("input", (event) => {
      if (event.target.matches(".todo-input")) {
        const todoId = event.target.closest("[data-todo-id]").dataset.todoId;
        this.updateTodoText(todoId, event.target.value);
      }
    });
  }

  deleteTodo(id) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    this.render();
  }

  toggleTodo(id) {
    const todo = this.todos.find((todo) => todo.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.render();
    }
  }

  render() {
    this.container.innerHTML = this.todos
      .map(
        (todo) => `
            <div data-todo-id="${todo.id}" class="todo-item">
                <input type="checkbox" ${
                  todo.completed ? "checked" : ""
                } data-action="toggle">
                <span class="todo-text">${todo.text}</span>
                <button data-action="edit">Edit</button>
                <button data-action="delete">Delete</button>
            </div>
        `
      )
      .join("");
  }
}
```

This comprehensive guide covers DOM manipulation, event handling, browser APIs, and performance optimization techniques essential for JavaScript interviews and real-world development.
