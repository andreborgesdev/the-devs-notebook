# React State

Understanding state management in React - the foundation of interactive and dynamic user interfaces.

## What is State?

State represents data that can change over time and affects what the component renders. Unlike props, state is managed within the component and can be updated.

### Key Characteristics

- **Mutable**: Can be changed during component lifecycle
- **Local**: Belongs to the component that declares it
- **Reactive**: Changes trigger re-renders
- **Asynchronous**: State updates may be batched

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

## useState Hook

The primary hook for managing local component state.

### Basic Usage

```jsx
import { useState } from "react";

function UserProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <form>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      {isLoading && <div>Saving...</div>}
    </form>
  );
}
```

### Initial State Patterns

```jsx
// Static initial value
const [count, setCount] = useState(0);

// Function initial value (for expensive computations)
const [data, setData] = useState(() => {
  const saved = localStorage.getItem("data");
  return saved ? JSON.parse(saved) : [];
});

// Object initial state
const [user, setUser] = useState({
  name: "",
  email: "",
  preferences: {},
});

// Array initial state
const [items, setItems] = useState([]);
```

### State Setter Patterns

```jsx
function App() {
  const [count, setCount] = useState(0);

  // Direct value
  const increment = () => setCount(count + 1);

  // Functional update (recommended for dependent updates)
  const incrementSafe = () => setCount((prev) => prev + 1);

  // Multiple rapid updates
  const incrementBy3 = () => {
    setCount((prev) => prev + 1);
    setCount((prev) => prev + 1);
    setCount((prev) => prev + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={incrementSafe}>Increment Safe</button>
      <button onClick={incrementBy3}>Increment by 3</button>
    </div>
  );
}
```

## State vs Props

Understanding the differences between state and props is crucial for React development.

| Aspect         | State                    | Props                            |
| -------------- | ------------------------ | -------------------------------- |
| **Mutability** | Mutable within component | Immutable (read-only)            |
| **Ownership**  | Owned by component       | Passed from parent               |
| **Updates**    | Updated with setState    | Updated by parent re-render      |
| **Purpose**    | Internal component data  | Communication between components |
| **Scope**      | Local to component       | Flows down component tree        |

```jsx
// Parent component with state
function TodoApp() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Learn React", completed: false },
  ]);

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo} // Props from parent
          onToggle={toggleTodo} // Function prop
        />
      ))}
    </div>
  );
}

// Child component receiving props
function TodoItem({ todo, onToggle }) {
  // No state needed, just displays props
  return (
    <div>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span
        style={{
          textDecoration: todo.completed ? "line-through" : "none",
        }}
      >
        {todo.text}
      </span>
    </div>
  );
}
```

## State Updates

Understanding how state updates work is essential for building reliable React applications.

### Batching

React automatically batches state updates for performance.

```jsx
function BatchingExample() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");

  const handleClick = () => {
    console.log("Before updates:", count, name);

    // These updates are batched together
    setCount(count + 1);
    setName("Updated");

    // This will still show old values
    console.log("After updates:", count, name);
  };

  useEffect(() => {
    console.log("After re-render:", count, name);
  }, [count, name]);

  return <button onClick={handleClick}>Update State</button>;
}
```

### Asynchronous Nature

```jsx
function AsyncExample() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);

    // This still shows old value
    console.log("Current count:", count);

    // To access updated value, use useEffect or functional update
    setCount((prev) => {
      console.log("Updated count:", prev + 1);
      return prev + 1;
    });
  };

  return <button onClick={handleClick}>Count: {count}</button>;
}
```

### Object and Array Updates

```jsx
function ComplexStateExample() {
  const [user, setUser] = useState({
    name: "John",
    email: "john@example.com",
    preferences: {
      theme: "light",
      notifications: true,
    },
  });

  const [items, setItems] = useState(["apple", "banana"]);

  // ❌ Wrong: Mutating state directly
  const wrongUpdate = () => {
    user.name = "Jane"; // Don't do this
    setUser(user);
  };

  // ✅ Correct: Creating new object
  const updateName = (newName) => {
    setUser((prev) => ({
      ...prev,
      name: newName,
    }));
  };

  // ✅ Correct: Nested object update
  const updateTheme = (theme) => {
    setUser((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        theme,
      },
    }));
  };

  // ✅ Correct: Array updates
  const addItem = (item) => {
    setItems((prev) => [...prev, item]);
  };

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index, newItem) => {
    setItems((prev) => prev.map((item, i) => (i === index ? newItem : item)));
  };

  return (
    <div>
      <p>
        User: {user.name} ({user.email})
      </p>
      <p>Theme: {user.preferences.theme}</p>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
```

## State Patterns

Common patterns for managing different types of state.

### Toggle State

```jsx
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue((v) => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return [value, { toggle, setTrue, setFalse }];
}

function Modal() {
  const [isOpen, { toggle, setFalse }] = useToggle();

  return (
    <div>
      <button onClick={toggle}>{isOpen ? "Close" : "Open"} Modal</button>
      {isOpen && (
        <div className="modal">
          <p>Modal Content</p>
          <button onClick={setFalse}>Close</button>
        </div>
      )}
    </div>
  );
}
```

### Form State

```jsx
function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const setError = (name, error) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    handleChange,
    setError,
    reset,
  };
}

function LoginForm() {
  const { values, errors, handleChange, setError, reset } = useForm({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(values);
    } catch (error) {
      setError("email", "Invalid credentials");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={values.email}
        onChange={(e) => handleChange("email", e.target.value)}
      />
      {errors.email && <span>{errors.email}</span>}

      <input
        type="password"
        value={values.password}
        onChange={(e) => handleChange("password", e.target.value)}
      />

      <button type="submit">Login</button>
      <button type="button" onClick={reset}>
        Reset
      </button>
    </form>
  );
}
```

### List State

```jsx
function useList(initialList = []) {
  const [list, setList] = useState(initialList);

  const add = useCallback((item) => {
    setList((prev) => [...prev, item]);
  }, []);

  const remove = useCallback((index) => {
    setList((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const update = useCallback((index, newItem) => {
    setList((prev) => prev.map((item, i) => (i === index ? newItem : item)));
  }, []);

  const clear = useCallback(() => {
    setList([]);
  }, []);

  const move = useCallback((fromIndex, toIndex) => {
    setList((prev) => {
      const newList = [...prev];
      const [movedItem] = newList.splice(fromIndex, 1);
      newList.splice(toIndex, 0, movedItem);
      return newList;
    });
  }, []);

  return {
    list,
    add,
    remove,
    update,
    clear,
    move,
  };
}
```

## Local vs Global State

Understanding when to use local state vs global state.

### Local State Use Cases

```jsx
// UI state
function Accordion() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      {isOpen && <div>Content</div>}
    </div>
  );
}

// Form state
function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  // Form logic...
}

// Component-specific calculations
function Chart({ data }) {
  const [selectedRange, setSelectedRange] = useState("1M");

  const filteredData = useMemo(() => {
    return filterDataByRange(data, selectedRange);
  }, [data, selectedRange]);

  // Chart rendering...
}
```

### Global State Use Cases

```jsx
// User authentication
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Auth logic...

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Application settings
function useSettings() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("settings");
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const updateSetting = (key, value) => {
    setSettings((prev) => {
      const newSettings = { ...prev, [key]: value };
      localStorage.setItem("settings", JSON.stringify(newSettings));
      return newSettings;
    });
  };

  return [settings, updateSetting];
}
```

## State Best Practices

### 1. Keep State Minimal

```jsx
// ❌ Bad: Redundant state
function UserComponent({ userId }) {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    fetchUser(userId).then((userData) => {
      setUser(userData);
      setUserName(userData.name);
      setUserEmail(userData.email);
    });
  }, [userId]);
}

// ✅ Good: Single source of truth
function UserComponent({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

### 2. Derive State When Possible

```jsx
// ❌ Bad: Storing derived state
function ShoppingCart({ items }) {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const newTotal = items.reduce((sum, item) => sum + item.price, 0);
    setTotal(newTotal);
  }, [items]);

  return <div>Total: ${total}</div>;
}

// ✅ Good: Calculate during render
function ShoppingCart({ items }) {
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return <div>Total: ${total}</div>;
}
```

### 3. Use Functional Updates

```jsx
// ❌ Bad: Dependent on current state
function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);

  return <button onClick={increment}>Count: {count}</button>;
}

// ✅ Good: Functional update
function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount((prev) => prev + 1);

  return <button onClick={increment}>Count: {count}</button>;
}
```

## Common Mistakes

### 1. Mutating State Directly

```jsx
// ❌ Wrong
const [items, setItems] = useState([]);

const addItem = (item) => {
  items.push(item); // Mutating state
  setItems(items);
};

// ✅ Correct
const addItem = (item) => {
  setItems((prev) => [...prev, item]);
};
```

### 2. Using State for Everything

```jsx
// ❌ Wrong: Storing props in state
function UserDisplay({ user }) {
  const [currentUser, setCurrentUser] = useState(user);

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  return <div>{currentUser.name}</div>;
}

// ✅ Correct: Use props directly
function UserDisplay({ user }) {
  return <div>{user.name}</div>;
}
```

### 3. Stale Closures

```jsx
// ❌ Wrong: Stale closure
function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(count + 1); // Captures initial value
    }, 1000);

    return () => clearInterval(timer);
  }, []); // Empty dependency array

  return <div>{count}</div>;
}

// ✅ Correct: Functional update
function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return <div>{count}</div>;
}
```

## Performance Considerations

### 1. Minimize State Updates

```jsx
// ❌ Bad: Multiple state updates
function SearchComponent() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = async (searchQuery) => {
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const data = await searchAPI(searchQuery);
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
}

// ✅ Better: Batched state updates
function SearchComponent() {
  const [searchState, setSearchState] = useState({
    query: "",
    results: [],
    loading: false,
    error: null,
  });

  const search = async (searchQuery) => {
    setSearchState((prev) => ({
      ...prev,
      loading: true,
      error: null,
      results: [],
    }));

    try {
      const data = await searchAPI(searchQuery);
      setSearchState((prev) => ({
        ...prev,
        loading: false,
        results: data,
      }));
    } catch (err) {
      setSearchState((prev) => ({
        ...prev,
        loading: false,
        error: err.message,
      }));
    }
  };
}
```

### 2. Optimize Re-renders

```jsx
// ❌ Bad: Causes child re-renders
function Parent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <ExpensiveChild count={count} />
    </div>
  );
}

// ✅ Good: Isolated state updates
function Parent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <NameInput />
      <ExpensiveChild count={count} />
    </div>
  );
}

function NameInput() {
  const [name, setName] = useState("");

  return <input value={name} onChange={(e) => setName(e.target.value)} />;
}
```

## Interview Questions

### Basic Questions

**Q: What is state in React and how is it different from props?**

A: State is mutable data owned by a component that can change over time and trigger re-renders. Props are immutable data passed from parent components. State is local and can be updated, while props are read-only and controlled by the parent.

**Q: Why can't you mutate state directly in React?**

A: React uses Object.is() comparison to detect state changes. If you mutate state directly, the reference remains the same, so React won't detect the change and won't re-render. You must create new objects/arrays to trigger updates.

### Intermediate Questions

**Q: Explain the difference between useState and useReducer.**

A: useState is for simple state logic with a single value, while useReducer is for complex state logic with multiple sub-values or when the next state depends on the previous one. useReducer is better for state machines and complex updates.

**Q: What happens when you call setState multiple times in the same function?**

A: React batches state updates for performance. Multiple setState calls in the same event handler are batched together and result in a single re-render. Use functional updates to ensure each update sees the latest state.

### Advanced Questions

**Q: How would you implement a custom hook for managing complex form state?**

A: Implementation would include state for values, errors, touched fields, validation, and submission status, with methods for handling changes, validation, reset, and submission.

**Q: Describe strategies for optimizing state updates in a large React application.**

A: Strategies include state colocation, state normalization, splitting state by concern, using reducers for complex logic, memoization, and careful component architecture to minimize re-renders.

## Summary

React state is fundamental to building interactive applications. Key takeaways:

- **State is mutable data** that belongs to and is managed within a component
- **Never mutate state directly** - always create new objects/arrays
- **Use functional updates** when new state depends on previous state
- **Keep state minimal** and derive values when possible
- **Colocate state** with the components that need it
- **Consider performance** when designing state architecture
- **Choose the right tool** - useState for simple state, useReducer for complex logic
