# useState Hook

## Overview

The `useState` hook is the most fundamental hook in React, allowing functional components to manage local state. It returns a stateful value and a function to update it.

## Basic Syntax

```javascript
const [state, setState] = useState(initialValue);
```

## Simple Examples

### Counter Example

```javascript
import React, { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

### Input Field Example

```javascript
function InputForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, email });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Advanced Patterns

### Functional Updates

When the new state depends on the previous state, use functional updates:

```javascript
function Counter() {
  const [count, setCount] = useState(0);

  // ✅ Good - Using functional update
  const increment = () => setCount((prevCount) => prevCount + 1);

  // ❌ Avoid - Direct state dependency
  const incrementBad = () => setCount(count + 1);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

### Object State Updates

```javascript
function UserProfile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    age: 0,
  });

  const updateUser = (field, value) => {
    setUser((prevUser) => ({
      ...prevUser,
      [field]: value,
    }));
  };

  return (
    <form>
      <input
        value={user.name}
        onChange={(e) => updateUser("name", e.target.value)}
        placeholder="Name"
      />
      <input
        value={user.email}
        onChange={(e) => updateUser("email", e.target.value)}
        placeholder="Email"
      />
      <input
        type="number"
        value={user.age}
        onChange={(e) => updateUser("age", parseInt(e.target.value))}
        placeholder="Age"
      />
    </form>
  );
}
```

### Array State Updates

```javascript
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos((prevTodos) => [
        ...prevTodos,
        { id: Date.now(), text: inputValue, completed: false },
      ]);
      setInputValue("");
    }
  };

  const toggleTodo = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const removeTodo = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  return (
    <div>
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Add todo"
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
              onClick={() => toggleTodo(todo.id)}
            >
              {todo.text}
            </span>
            <button onClick={() => removeTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Lazy Initial State

For expensive computations, use lazy initialization:

```javascript
function ExpensiveComponent() {
  // ❌ Runs on every render
  const [state, setState] = useState(expensiveComputation());

  // ✅ Runs only once
  const [state, setState] = useState(() => expensiveComputation());

  return <div>{state}</div>;
}

function expensiveComputation() {
  console.log("Computing...");
  return Math.random() * 1000;
}
```

## Multiple useState vs Single useState

### Multiple useState (Recommended)

```javascript
function UserForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Each piece of state is independent
  return (
    // JSX
  );
}
```

### Single useState (When Related)

```javascript
function UserForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    // JSX
  );
}
```

## Common Patterns

### Toggle State

```javascript
function ToggleExample() {
  const [isVisible, setIsVisible] = useState(false);

  const toggle = () => setIsVisible((prev) => !prev);

  return (
    <div>
      <button onClick={toggle}>{isVisible ? "Hide" : "Show"}</button>
      {isVisible && <div>Content</div>}
    </div>
  );
}
```

### Form Validation

```javascript
function ValidatedForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validateEmail(email)) {
      newErrors.email = "Invalid email address";
    }

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form is valid");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>
      <div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Interview Questions

### Q: What is the difference between state and props?

| Aspect         | State                        | Props                            |
| -------------- | ---------------------------- | -------------------------------- |
| **Mutability** | Mutable (within component)   | Immutable                        |
| **Ownership**  | Owned by component           | Passed from parent               |
| **Updates**    | Can be updated with setState | Cannot be changed by child       |
| **Purpose**    | Internal component data      | Communication between components |

### Q: Why should you use functional updates?

Functional updates ensure you're working with the latest state value, especially important in:

- Event handlers
- Async operations
- When multiple state updates might happen

### Q: What happens if you call useState with the same value?

React will skip the re-render if the new state value is identical to the current state (using Object.is comparison).

## Best Practices

| Practice                         | Description                              | Example                               |
| -------------------------------- | ---------------------------------------- | ------------------------------------- |
| **Use functional updates**       | When new state depends on previous state | `setState(prev => prev + 1)`          |
| **Don't mutate state directly**  | Always create new objects/arrays         | `setState([...prev, newItem])`        |
| **Initialize with proper types** | Provide appropriate initial values       | `useState('')` not `useState()`       |
| **Split related state**          | Group related state variables            | Separate loading states from data     |
| **Use lazy initialization**      | For expensive initial state calculations | `useState(() => expensiveFunction())` |

## Common Mistakes

### Directly Mutating State

```javascript
// ❌ Wrong - Mutating state directly
const [items, setItems] = useState([]);
const addItem = (item) => {
  items.push(item); // Mutation!
  setItems(items);
};

// ✅ Correct - Creating new array
const addItem = (item) => {
  setItems((prevItems) => [...prevItems, item]);
};
```

### Forgetting Functional Updates

```javascript
// ❌ Potential issue with stale closure
const [count, setCount] = useState(0);
const handleClick = () => {
  setTimeout(() => {
    setCount(count + 1); // Might use stale value
  }, 1000);
};

// ✅ Always uses current value
const handleClick = () => {
  setTimeout(() => {
    setCount((prevCount) => prevCount + 1);
  }, 1000);
};
```

### Unnecessary Object State

```javascript
// ❌ Overcomplicating simple state
const [user, setUser] = useState({ name: "" });
const updateName = (name) => setUser({ ...user, name });

// ✅ Simple state for simple values
const [name, setName] = useState("");
```

## Performance Considerations

- useState triggers re-renders when state changes
- Object.is comparison is used to determine if state changed
- Multiple setState calls in the same event handler are batched
- Use lazy initialization for expensive computations
- Consider useReducer for complex state logic

## TypeScript Usage

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

function UserComponent() {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    // JSX
  );
}
```
