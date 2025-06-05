# Event Handling in React

Event handling is fundamental to creating interactive React applications. React provides a synthetic event system that wraps native DOM events to ensure consistent behavior across browsers.

## React Synthetic Events

React wraps native DOM events in SyntheticEvent objects to provide consistent behavior across different browsers.

```jsx
function Button() {
  const handleClick = (event) => {
    console.log("Event type:", event.type);
    console.log("Target element:", event.target);
    console.log("Current target:", event.currentTarget);

    event.preventDefault();
    event.stopPropagation();
  };

  return <button onClick={handleClick}>Click me</button>;
}
```

## Event Handler Patterns

### Function Declaration

```jsx
function LoginForm() {
  function handleSubmit(event) {
    event.preventDefault();
    console.log("Form submitted");
  }

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Login</button>
    </form>
  );
}
```

### Arrow Functions

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}
```

### Inline Arrow Functions

```jsx
function TodoList() {
  const [todos, setTodos] = useState([]);

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          {todo.text}
          <button onClick={() => removeTodo(todo.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
```

## Passing Parameters to Event Handlers

### Using Arrow Functions

```jsx
function NumberList() {
  const numbers = [1, 2, 3, 4, 5];

  const handleClick = (number) => {
    console.log("Clicked number:", number);
  };

  return (
    <ul>
      {numbers.map((number) => (
        <li key={number}>
          <button onClick={() => handleClick(number)}>{number}</button>
        </li>
      ))}
    </ul>
  );
}
```

### Using bind()

```jsx
function NumberList() {
  const numbers = [1, 2, 3, 4, 5];

  const handleClick = (number, event) => {
    console.log("Clicked number:", number);
    console.log("Event:", event);
  };

  return (
    <ul>
      {numbers.map((number) => (
        <li key={number}>
          <button onClick={this.handleClick.bind(this, number)}>
            {number}
          </button>
        </li>
      ))}
    </ul>
  );
}
```

### Using Data Attributes

```jsx
function NumberList() {
  const numbers = [1, 2, 3, 4, 5];

  const handleClick = (event) => {
    const number = parseInt(event.target.dataset.number);
    console.log("Clicked number:", number);
  };

  return (
    <ul>
      {numbers.map((number) => (
        <li key={number}>
          <button data-number={number} onClick={handleClick}>
            {number}
          </button>
        </li>
      ))}
    </ul>
  );
}
```

## Form Event Handling

### Controlled Components

```jsx
function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form data:", formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Message"
      />
      <button type="submit">Send</button>
    </form>
  );
}
```

### Checkbox Handling

```jsx
function PreferencesForm() {
  const [preferences, setPreferences] = useState({
    newsletter: false,
    notifications: true,
    darkMode: false,
  });

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  return (
    <form>
      <label>
        <input
          type="checkbox"
          name="newsletter"
          checked={preferences.newsletter}
          onChange={handleCheckboxChange}
        />
        Subscribe to newsletter
      </label>
      <label>
        <input
          type="checkbox"
          name="notifications"
          checked={preferences.notifications}
          onChange={handleCheckboxChange}
        />
        Enable notifications
      </label>
      <label>
        <input
          type="checkbox"
          name="darkMode"
          checked={preferences.darkMode}
          onChange={handleCheckboxChange}
        />
        Dark mode
      </label>
    </form>
  );
}
```

## Keyboard Event Handling

```jsx
function SearchInput() {
  const [query, setQuery] = useState("");

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      console.log("Search for:", query);
    }

    if (event.key === "Escape") {
      setQuery("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={handleKeyDown}
      onKeyPress={handleKeyPress}
      placeholder="Search..."
    />
  );
}
```

## Mouse Event Handling

```jsx
function InteractiveBox() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (event) => {
    setPosition({
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        width: 300,
        height: 200,
        backgroundColor: isHovered ? "lightblue" : "lightgray",
        border: "1px solid black",
      }}
    >
      Mouse position: {position.x}, {position.y}
    </div>
  );
}
```

## Event Delegation Pattern

```jsx
function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Learn React", completed: false },
    { id: 2, text: "Build an app", completed: true },
  ]);

  const handleListClick = (event) => {
    const button = event.target.closest("button");
    if (!button) return;

    const todoId = parseInt(button.dataset.todoId);
    const action = button.dataset.action;

    switch (action) {
      case "toggle":
        setTodos(
          todos.map((todo) =>
            todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
          )
        );
        break;
      case "delete":
        setTodos(todos.filter((todo) => todo.id !== todoId));
        break;
    }
  };

  return (
    <ul onClick={handleListClick}>
      {todos.map((todo) => (
        <li key={todo.id}>
          <span
            style={{
              textDecoration: todo.completed ? "line-through" : "none",
            }}
          >
            {todo.text}
          </span>
          <button data-todo-id={todo.id} data-action="toggle">
            {todo.completed ? "Undo" : "Complete"}
          </button>
          <button data-todo-id={todo.id} data-action="delete">
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
```

## Custom Event Handlers

```jsx
function useDebounce(callback, delay) {
  const timeoutRef = useRef(null);

  return useCallback(
    (...args) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => callback(...args), delay);
    },
    [callback, delay]
  );
}

function SearchWithDebounce() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const performSearch = async (searchQuery) => {
    if (!searchQuery) {
      setResults([]);
      return;
    }

    console.log("Searching for:", searchQuery);
  };

  const debouncedSearch = useDebounce(performSearch, 300);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search..."
      />
      <ul>
        {results.map((result) => (
          <li key={result.id}>{result.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

## TypeScript Event Handling

```tsx
import React, { useState, ChangeEvent, FormEvent, MouseEvent } from "react";

interface FormData {
  username: string;
  email: string;
}

function TypedForm(): JSX.Element {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
  });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleButtonClick = (event: MouseEvent<HTMLButtonElement>): void => {
    console.log("Button clicked:", event.currentTarget.textContent);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleInputChange}
        placeholder="Username"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="Email"
      />
      <button type="submit" onClick={handleButtonClick}>
        Submit
      </button>
    </form>
  );
}
```

## Common Event Types

| Event          | Description          | Common Use Cases                     |
| -------------- | -------------------- | ------------------------------------ |
| `onClick`      | Mouse click          | Buttons, links, interactive elements |
| `onChange`     | Input value change   | Form inputs, controlled components   |
| `onSubmit`     | Form submission      | Form validation and processing       |
| `onFocus`      | Element gains focus  | Input highlighting, validation       |
| `onBlur`       | Element loses focus  | Input validation, saving data        |
| `onKeyDown`    | Key press down       | Keyboard shortcuts, navigation       |
| `onKeyUp`      | Key release          | Real-time input processing           |
| `onMouseEnter` | Mouse enters element | Hover effects, tooltips              |
| `onMouseLeave` | Mouse leaves element | Hiding tooltips, resetting state     |
| `onScroll`     | Element scrolling    | Infinite scrolling, sticky headers   |

## Performance Considerations

### Avoiding Inline Functions

```jsx
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleToggle = useCallback(
    (id) => {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    },
    [todos]
  );

  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onToggle={handleToggle} />
      ))}
    </ul>
  );
}
```

### Event Handler Memoization

```jsx
function ExpensiveList({ items, onItemClick }) {
  const memoizedHandlers = useMemo(() => {
    return items.reduce((handlers, item) => {
      handlers[item.id] = () => onItemClick(item.id);
      return handlers;
    }, {});
  }, [items, onItemClick]);

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <button onClick={memoizedHandlers[item.id]}>{item.name}</button>
        </li>
      ))}
    </ul>
  );
}
```

## Best Practices

1. **Use SyntheticEvents**: Leverage React's synthetic event system for cross-browser compatibility
2. **Prevent Default Behavior**: Use `event.preventDefault()` to prevent default browser behavior
3. **Avoid Inline Functions**: Extract event handlers to prevent unnecessary re-renders
4. **Use Event Delegation**: Handle multiple similar events with a single handler
5. **Memoize Handlers**: Use `useCallback` for expensive event handlers
6. **Type Events**: Use TypeScript for better type safety with events
7. **Debounce Expensive Operations**: Debounce search, API calls, and other expensive operations
8. **Clean Up Listeners**: Remove event listeners in cleanup functions

## Common Mistakes

1. **Forgetting to Bind Context**: Not properly binding `this` in class components
2. **Inline Function Overuse**: Creating new functions on every render
3. **Not Preventing Default**: Forgetting to prevent default form submission
4. **Memory Leaks**: Not cleaning up event listeners
5. **Wrong Event Type**: Using wrong event type for specific interactions
6. **Performance Issues**: Not optimizing event handlers for large lists

## Interview Questions

**Q: What are React SyntheticEvents and why are they used?**
A: SyntheticEvents are React's wrapper around native DOM events that provide consistent behavior across browsers, automatic event delegation, and additional React-specific functionality.

**Q: How do you pass parameters to event handlers?**
A: You can use arrow functions, bind(), or data attributes to pass parameters to event handlers.

**Q: What's the difference between onChange and onInput events?**
A: onChange fires when the input loses focus and the value has changed, while onInput fires immediately as the user types. React normalizes this behavior.

**Q: How do you optimize event handlers for performance?**
A: Use useCallback for memoization, avoid inline functions, implement event delegation, and debounce expensive operations.

**Q: What's event delegation and how is it used in React?**
A: Event delegation involves handling events at a parent level instead of individual child elements, reducing memory usage and improving performance for large lists.
