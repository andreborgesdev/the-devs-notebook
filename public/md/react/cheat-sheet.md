# React Cheat Sheet

## Core Concepts

### JSX

```jsx
const element = <h1>Hello, World!</h1>;
const element = <h1>Hello, {name}!</h1>;
const element = (
  <div>
    <h1>Title</h1>
    <p>Description</p>
  </div>
);
```

### Components

```jsx
// Function Component
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// Arrow Function Component
const Welcome = (props) => <h1>Hello, {props.name}</h1>;

// Component with destructuring
const Welcome = ({ name, age }) => (
  <div>
    <h1>Hello, {name}</h1>
    <p>Age: {age}</p>
  </div>
);
```

### Props

```jsx
// Passing props
<Welcome name="Alice" age={25} isActive={true} />;

// Props with children
function Container({ children, title }) {
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  );
}

// Default props
function Greeting({ name = "Guest" }) {
  return <h1>Hello, {name}</h1>;
}
```

## React Hooks

### useState

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount((prev) => prev + 1)}>
        + (functional)
      </button>
    </div>
  );
}
```

### useEffect

```jsx
import { useEffect, useState } from "react";

function DataComponent() {
  const [data, setData] = useState(null);

  // Run once on mount
  useEffect(() => {
    fetchData().then(setData);
  }, []);

  // Run when dependency changes
  useEffect(() => {
    updateData(data);
  }, [data]);

  // Cleanup
  useEffect(() => {
    const timer = setInterval(() => {
      console.log("Timer tick");
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return <div>{data ? "Loaded" : "Loading..."}</div>;
}
```

### useContext

```jsx
import { createContext, useContext } from "react";

const ThemeContext = createContext();

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <ThemedComponent />
    </ThemeContext.Provider>
  );
}

function ThemedComponent() {
  const theme = useContext(ThemeContext);
  return <div className={theme}>Content</div>;
}
```

### useReducer

```jsx
import { useReducer } from "react";

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    case "reset":
      return initialState;
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      Count: {state.count}
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
    </div>
  );
}
```

### useMemo

```jsx
import { useMemo } from "react";

function ExpensiveComponent({ items, filter }) {
  const filteredItems = useMemo(() => {
    return items.filter((item) => item.includes(filter));
  }, [items, filter]);

  const expensiveValue = useMemo(() => {
    return someExpensiveCalculation(items);
  }, [items]);

  return <div>{filteredItems.length} items</div>;
}
```

### useCallback

```jsx
import { useCallback, useState } from "react";

function Parent() {
  const [count, setCount] = useState(0);
  const [todos, setTodos] = useState([]);

  const handleClick = useCallback(() => {
    setCount((c) => c + 1);
  }, []);

  const addTodo = useCallback((text) => {
    setTodos((prev) => [...prev, { id: Date.now(), text }]);
  }, []);

  return (
    <div>
      <Child onClick={handleClick} />
      <TodoForm onSubmit={addTodo} />
    </div>
  );
}
```

### useRef

```jsx
import { useRef, useEffect } from "react";

function FocusInput() {
  const inputRef = useRef(null);
  const countRef = useRef(0);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleClick = () => {
    countRef.current++;
    console.log("Clicked", countRef.current, "times");
  };

  return (
    <div>
      <input ref={inputRef} />
      <button onClick={handleClick}>Click me</button>
    </div>
  );
}
```

### Custom Hooks

```jsx
// Custom hook for API calls
function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}

// Custom hook for local storage
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setStoredValue = (value) => {
    try {
      setValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [value, setStoredValue];
}

// Usage
function App() {
  const { data, loading, error } = useApi("/api/users");
  const [theme, setTheme] = useLocalStorage("theme", "light");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>Data loaded: {data.length} items</div>;
}
```

## Event Handling

```jsx
function Button() {
  const handleClick = (e) => {
    e.preventDefault();
    console.log("Button clicked");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log(Object.fromEntries(formData));
  };

  const handleChange = (e) => {
    console.log(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleChange} />
      <button onClick={handleClick}>Submit</button>
    </form>
  );
}
```

## Conditional Rendering

```jsx
// If-else with ternary
function Greeting({ isLoggedIn }) {
  return (
    <div>{isLoggedIn ? <h1>Welcome back!</h1> : <h1>Please log in</h1>}</div>
  );
}

// Logical AND
function Notifications({ notifications }) {
  return (
    <div>
      {notifications.length > 0 && (
        <div>You have {notifications.length} notifications</div>
      )}
    </div>
  );
}

// Switch-like rendering
function StatusBadge({ status }) {
  const getStatusColor = () => {
    switch (status) {
      case "active":
        return "green";
      case "inactive":
        return "red";
      case "pending":
        return "yellow";
      default:
        return "gray";
    }
  };

  return <span style={{ color: getStatusColor() }}>{status}</span>;
}
```

## Lists and Keys

```jsx
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          <span>{todo.text}</span>
          <button onClick={() => deleteTodo(todo.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

// Avoid using array index as key
function BadExample({ items }) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item}</li> // ❌ Avoid this
      ))}
    </ul>
  );
}

// Use stable, unique identifiers
function GoodExample({ items }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.name}</li> // ✅ Good
      ))}
    </ul>
  );
}
```

## Forms

```jsx
// Controlled components
function LoginForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <label>
        <input
          type="checkbox"
          name="remember"
          checked={formData.remember}
          onChange={handleChange}
        />
        Remember me
      </label>
      <button type="submit">Login</button>
    </form>
  );
}

// Uncontrolled components
function UncontrolledForm() {
  const formRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    console.log(Object.fromEntries(formData));
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <input name="username" defaultValue="" />
      <input name="password" type="password" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

## React Router

```jsx
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/users/123">User Profile</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users/:id" element={<UserProfile />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      <h1>User {id}</h1>
      <button onClick={() => navigate("/")}>Go Home</button>
      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
}
```

## Styling

```jsx
// Inline styles
function StyledComponent() {
  const styles = {
    container: {
      padding: "20px",
      backgroundColor: "#f0f0f0",
      borderRadius: "8px",
    },
    title: {
      color: "#333",
      fontSize: "24px",
      marginBottom: "16px",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Styled Component</h1>
    </div>
  );
}

// CSS classes
function CSSComponent() {
  return (
    <div className="container">
      <h1 className="title">CSS Component</h1>
      <button className="btn btn-primary">Click me</button>
    </div>
  );
}

// CSS Modules
import styles from "./Component.module.css";

function ModuleComponent() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Module Component</h1>
    </div>
  );
}

// Styled Components
import styled from "styled-components";

const Container = styled.div`
  padding: 20px;
  background-color: ${(props) => props.theme.background};
`;

const Title = styled.h1`
  color: ${(props) => props.color || "#333"};
  font-size: 24px;
`;

function StyledComponentsExample() {
  return (
    <Container>
      <Title color="blue">Styled Component</Title>
    </Container>
  );
}
```

## Performance Optimization

```jsx
import { memo, useMemo, useCallback } from "react";

// React.memo for component memoization
const ExpensiveComponent = memo(function ExpensiveComponent({
  data,
  onUpdate,
}) {
  return (
    <div>
      {data.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
});

// useMemo for expensive calculations
function DataProcessor({ items, filter }) {
  const processedData = useMemo(() => {
    return items
      .filter((item) => item.category === filter)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((item) => ({ ...item, processed: true }));
  }, [items, filter]);

  return <div>{processedData.length} processed items</div>;
}

// useCallback for stable function references
function Parent() {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);

  const handleItemClick = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleIncrement = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  return (
    <div>
      <button onClick={handleIncrement}>Count: {count}</button>
      <ItemList items={items} onItemClick={handleItemClick} />
    </div>
  );
}
```

## Code Splitting and Lazy Loading

```jsx
import { lazy, Suspense } from "react";

// Lazy load components
const LazyComponent = lazy(() => import("./LazyComponent"));
const Dashboard = lazy(() => import("./Dashboard"));

function App() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <LazyComponent />
      </Suspense>

      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Suspense>
    </div>
  );
}

// Loading component
function LoadingSpinner() {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
}
```

## Error Boundaries

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details>{this.state.error && this.state.error.toString()}</details>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
function App() {
  return (
    <ErrorBoundary>
      <Header />
      <MainContent />
      <Footer />
    </ErrorBoundary>
  );
}
```

## Portals

```jsx
import { createPortal } from "react-dom";

function Modal({ children, isOpen }) {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-content">{children}</div>
    </div>,
    document.body
  );
}

// Usage
function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <button onClick={() => setShowModal(true)}>Open Modal</button>

      <Modal isOpen={showModal}>
        <h2>Modal Content</h2>
        <button onClick={() => setShowModal(false)}>Close</button>
      </Modal>
    </div>
  );
}
```

## Context API

```jsx
import { createContext, useContext, useReducer } from "react";

// Create context
const AppContext = createContext();

// Context provider component
function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const value = {
    ...state,
    dispatch,
    login: (user) => dispatch({ type: "LOGIN", payload: user }),
    logout: () => dispatch({ type: "LOGOUT" }),
    updateProfile: (data) =>
      dispatch({ type: "UPDATE_PROFILE", payload: data }),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Custom hook to use context
function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}

// Component using context
function Profile() {
  const { user, updateProfile } = useApp();

  return (
    <div>
      <h1>{user.name}</h1>
      <button onClick={() => updateProfile({ name: "New Name" })}>
        Update Name
      </button>
    </div>
  );
}

// App with context
function App() {
  return (
    <AppProvider>
      <Header />
      <Profile />
      <Footer />
    </AppProvider>
  );
}
```

## TypeScript with React

```tsx
import React, { useState, ReactNode } from "react";

// Props interface
interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

// Component with TypeScript
const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );
};

// Generic component
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => ReactNode;
  keyExtractor: (item: T) => string | number;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// Hook with TypeScript
function useCounter(initialValue: number = 0) {
  const [count, setCount] = useState<number>(initialValue);

  const increment = (): void => setCount((prev) => prev + 1);
  const decrement = (): void => setCount((prev) => prev - 1);
  const reset = (): void => setCount(initialValue);

  return { count, increment, decrement, reset };
}

// Event handlers
interface FormData {
  name: string;
  email: string;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
      />
      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <button type="submit">Submit</button>
    </form>
  );
};
```

## Testing

```jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Basic component test
test("renders button with correct text", () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
});

// User interaction test
test("calls onClick when button is clicked", async () => {
  const handleClick = jest.fn();
  const user = userEvent.setup();

  render(<Button onClick={handleClick}>Click me</Button>);

  await user.click(screen.getByRole("button"));
  expect(handleClick).toHaveBeenCalledTimes(1);
});

// Async test
test("displays loading then data", async () => {
  render(<DataComponent />);

  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText(/data loaded/i)).toBeInTheDocument();
  });
});

// Mocking
jest.mock("./api", () => ({
  fetchUser: jest.fn(() => Promise.resolve({ id: 1, name: "John" })),
}));

// Hook testing
import { renderHook, act } from "@testing-library/react";

test("useCounter hook", () => {
  const { result } = renderHook(() => useCounter(0));

  expect(result.current.count).toBe(0);

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});
```

## Common Patterns

### Higher-Order Components (HOC)

```jsx
function withLoading(WrappedComponent) {
  return function WithLoadingComponent(props) {
    if (props.loading) {
      return <div>Loading...</div>;
    }
    return <WrappedComponent {...props} />;
  };
}

const EnhancedComponent = withLoading(MyComponent);
```

### Render Props

```jsx
function DataProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData().then((data) => {
      setData(data);
      setLoading(false);
    });
  }, []);

  return children({ data, loading });
}

// Usage
function App() {
  return (
    <DataProvider>
      {({ data, loading }) => (
        <div>{loading ? <div>Loading...</div> : <div>{data}</div>}</div>
      )}
    </DataProvider>
  );
}
```

### Compound Components

```jsx
function Tabs({ children, defaultTab = 0 }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className="tabs">
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child, { activeTab, setActiveTab, index })
      )}
    </div>
  );
}

function TabList({ children, activeTab, setActiveTab }) {
  return (
    <div className="tab-list">
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child, {
          isActive: activeTab === index,
          onClick: () => setActiveTab(index),
        })
      )}
    </div>
  );
}

function Tab({ children, isActive, onClick }) {
  return (
    <button className={`tab ${isActive ? "active" : ""}`} onClick={onClick}>
      {children}
    </button>
  );
}

function TabPanels({ children, activeTab }) {
  return (
    <div className="tab-panels">
      {React.Children.toArray(children)[activeTab]}
    </div>
  );
}

function TabPanel({ children }) {
  return <div className="tab-panel">{children}</div>;
}

// Usage
function App() {
  return (
    <Tabs defaultTab={0}>
      <TabList>
        <Tab>Tab 1</Tab>
        <Tab>Tab 2</Tab>
        <Tab>Tab 3</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>Content 1</TabPanel>
        <TabPanel>Content 2</TabPanel>
        <TabPanel>Content 3</TabPanel>
      </TabPanels>
    </Tabs>
  );
}
```

## Quick Tips

### Performance

- Use React.memo for component memoization
- Use useMemo for expensive calculations
- Use useCallback for stable function references
- Avoid creating objects/functions in render
- Use React DevTools Profiler to identify bottlenecks

### Best Practices

- Keep components small and focused
- Use meaningful component and prop names
- Extract custom hooks for reusable logic
- Use TypeScript for better type safety
- Write tests for critical functionality
- Use ESLint and Prettier for code quality

### Common Mistakes

- Mutating state directly
- Missing dependencies in useEffect
- Using array index as key in lists
- Not handling loading and error states
- Creating functions/objects in render method
- Forgetting to cleanup side effects

### Debugging

- Use React Developer Tools
- Add console.log strategically
- Use debugger statement
- Check the network tab for API calls
- Verify props are being passed correctly
- Use React Strict Mode in development
