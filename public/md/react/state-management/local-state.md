# Local State Management in React

Local state management is the foundation of React component state handling. It encompasses managing component-specific data that doesn't need to be shared across multiple components.

## Component State vs Local State

| Aspect          | Component State     | Local State                 |
| --------------- | ------------------- | --------------------------- |
| **Scope**       | Single component    | Component and children      |
| **Sharing**     | Not shared          | Shared via props/context    |
| **Performance** | Isolated re-renders | Can affect child components |
| **Complexity**  | Simple              | Can become complex          |

## useState for Local State

### Basic State Management

```tsx
import { useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/users/${id}`);
      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      setError("Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {user && (
        <div>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      )}
    </div>
  );
}
```

### Complex Local State with useReducer

```tsx
import { useReducer } from "react";

interface TodoState {
  todos: Todo[];
  filter: "all" | "active" | "completed";
  loading: boolean;
}

type TodoAction =
  | { type: "ADD_TODO"; payload: string }
  | { type: "TOGGLE_TODO"; payload: number }
  | { type: "DELETE_TODO"; payload: number }
  | { type: "SET_FILTER"; payload: "all" | "active" | "completed" }
  | { type: "SET_LOADING"; payload: boolean };

const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
  switch (action.type) {
    case "ADD_TODO":
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: Date.now(),
            text: action.payload,
            completed: false,
          },
        ],
      };
    case "TOGGLE_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      };
    case "DELETE_TODO":
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };
    case "SET_FILTER":
      return {
        ...state,
        filter: action.payload,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

function TodoApp() {
  const [state, dispatch] = useReducer(todoReducer, {
    todos: [],
    filter: "all",
    loading: false,
  });

  const addTodo = (text: string) => {
    dispatch({ type: "ADD_TODO", payload: text });
  };

  const toggleTodo = (id: number) => {
    dispatch({ type: "TOGGLE_TODO", payload: id });
  };

  const filteredTodos = state.todos.filter((todo) => {
    if (state.filter === "active") return !todo.completed;
    if (state.filter === "completed") return todo.completed;
    return true;
  });

  return (
    <div>
      <TodoInput onAdd={addTodo} />
      <FilterBar
        currentFilter={state.filter}
        onFilterChange={(filter) =>
          dispatch({ type: "SET_FILTER", payload: filter })
        }
      />
      <TodoList
        todos={filteredTodos}
        onToggle={toggleTodo}
        onDelete={(id) => dispatch({ type: "DELETE_TODO", payload: id })}
      />
    </div>
  );
}
```

## Custom Hooks for Local State

### Form State Management Hook

```tsx
import { useState, useCallback } from "react";

interface UseFormOptions<T> {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit?: (values: T) => void | Promise<void>;
}

function useForm<T extends Record<string, any>>({
  initialValues,
  validate,
  onSubmit,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);

  const setValue = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      if (touched[field] && errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [touched, errors]
  );

  const setFieldTouched = useCallback(<K extends keyof T>(field: K) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      const validationErrors = validate?.(values) || {};
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length === 0) {
        setSubmitting(true);
        try {
          await onSubmit?.(values);
        } catch (error) {
          console.error("Form submission error:", error);
        } finally {
          setSubmitting(false);
        }
      }
    },
    [values, validate, onSubmit]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    submitting,
    setValue,
    setFieldTouched,
    handleSubmit,
    reset,
  };
}

// Usage
function ContactForm() {
  const {
    values,
    errors,
    touched,
    submitting,
    setValue,
    setFieldTouched,
    handleSubmit,
  } = useForm({
    initialValues: {
      name: "",
      email: "",
      message: "",
    },
    validate: (values) => {
      const errors: any = {};
      if (!values.name) errors.name = "Name is required";
      if (!values.email) errors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(values.email))
        errors.email = "Email is invalid";
      if (!values.message) errors.message = "Message is required";
      return errors;
    },
    onSubmit: async (values) => {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      alert("Message sent!");
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={values.name}
        onChange={(e) => setValue("name", e.target.value)}
        onBlur={() => setFieldTouched("name")}
        placeholder="Name"
      />
      {touched.name && errors.name && <span>{errors.name}</span>}

      <input
        type="email"
        value={values.email}
        onChange={(e) => setValue("email", e.target.value)}
        onBlur={() => setFieldTouched("email")}
        placeholder="Email"
      />
      {touched.email && errors.email && <span>{errors.email}</span>}

      <textarea
        value={values.message}
        onChange={(e) => setValue("message", e.target.value)}
        onBlur={() => setFieldTouched("message")}
        placeholder="Message"
      />
      {touched.message && errors.message && <span>{errors.message}</span>}

      <button type="submit" disabled={submitting}>
        {submitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
```

### Data Fetching State Hook

```tsx
import { useState, useEffect, useCallback } from "react";

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useFetch<T>(url: string, dependencies: any[] = []) {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : "An error occurred",
      });
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch };
}

// Usage
function UserList() {
  const {
    data: users,
    loading,
    error,
    refetch,
  } = useFetch<User[]>("/api/users");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <button onClick={refetch}>Refresh Users</button>
      <ul>
        {users?.map((user) => (
          <li key={user.id} onClick={() => setSelectedUser(user)}>
            {user.name}
          </li>
        ))}
      </ul>
      {selectedUser && <UserDetail user={selectedUser} />}
    </div>
  );
}
```

## State Composition Patterns

### Compound State Management

```tsx
import { useState, createContext, useContext, ReactNode } from "react";

interface ShoppingCartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface ShoppingCartState {
  items: ShoppingCartItem[];
  isOpen: boolean;
  total: number;
}

interface ShoppingCartContextValue extends ShoppingCartState {
  addItem: (item: Omit<ShoppingCartItem, "quantity">) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  toggleCart: () => void;
  clearCart: () => void;
}

const ShoppingCartContext = createContext<ShoppingCartContextValue | null>(
  null
);

export function ShoppingCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ShoppingCartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const addItem = (newItem: Omit<ShoppingCartItem, "quantity">) => {
    setItems((prev) => {
      const existingItem = prev.find((item) => item.id === newItem.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const toggleCart = () => setIsOpen((prev) => !prev);
  const clearCart = () => setItems([]);

  return (
    <ShoppingCartContext.Provider
      value={{
        items,
        isOpen,
        total,
        addItem,
        removeItem,
        updateQuantity,
        toggleCart,
        clearCart,
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
}

export function useShoppingCart() {
  const context = useContext(ShoppingCartContext);
  if (!context) {
    throw new Error("useShoppingCart must be used within ShoppingCartProvider");
  }
  return context;
}
```

## Performance Optimization

### State Splitting

```tsx
function OptimizedComponent() {
  const [fastChangingState, setFastChangingState] = useState(0);
  const [slowChangingState, setSlowChangingState] = useState("");

  return (
    <div>
      <FastComponent
        value={fastChangingState}
        onChange={setFastChangingState}
      />
      <SlowComponent
        value={slowChangingState}
        onChange={setSlowChangingState}
      />
    </div>
  );
}

const FastComponent = React.memo(({ value, onChange }) => {
  return (
    <div>
      <button onClick={() => onChange((prev) => prev + 1)}>
        Fast: {value}
      </button>
    </div>
  );
});

const SlowComponent = React.memo(({ value, onChange }) => {
  return (
    <div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Slow changing state"
      />
    </div>
  );
});
```

### Lazy State Initialization

```tsx
function ExpensiveComponent() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("expensiveData");
    return saved ? JSON.parse(saved) : computeExpensiveValue();
  });

  useEffect(() => {
    localStorage.setItem("expensiveData", JSON.stringify(data));
  }, [data]);

  return <div>{/* Component content */}</div>;
}

function computeExpensiveValue() {
  return Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    value: Math.random(),
  }));
}
```

## Best Practices

### State Structure

```tsx
interface AppState {
  user: {
    profile: UserProfile | null;
    preferences: UserPreferences;
    loading: boolean;
  };
  ui: {
    sidebarOpen: boolean;
    theme: "light" | "dark";
    notifications: Notification[];
  };
  data: {
    posts: Post[];
    comments: Record<number, Comment[]>;
    loading: Record<string, boolean>;
    errors: Record<string, string>;
  };
}

function useAppState() {
  const [state, setState] = useState<AppState>(() => ({
    user: {
      profile: null,
      preferences: { theme: "light", notifications: true },
      loading: false,
    },
    ui: {
      sidebarOpen: false,
      theme: "light",
      notifications: [],
    },
    data: {
      posts: [],
      comments: {},
      loading: {},
      errors: {},
    },
  }));

  const updateUser = useCallback((updates: Partial<AppState["user"]>) => {
    setState((prev) => ({
      ...prev,
      user: { ...prev.user, ...updates },
    }));
  }, []);

  const updateUI = useCallback((updates: Partial<AppState["ui"]>) => {
    setState((prev) => ({
      ...prev,
      ui: { ...prev.ui, ...updates },
    }));
  }, []);

  return { state, updateUser, updateUI };
}
```

## Common Mistakes

### Avoid Direct State Mutation

```tsx
function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = (text: string) => {
    todos.push({ id: Date.now(), text, completed: false });
    setTodos(todos);
  };

  const toggleTodo = (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      setTodos([...todos]);
    }
  };

  return <div>{/* Component content */}</div>;
}
```

### Correct Approach

```tsx
function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = (text: string) => {
    setTodos((prev) => [...prev, { id: Date.now(), text, completed: false }]);
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return <div>{/* Component content */}</div>;
}
```

## Interview Questions

### Q: When should you use useState vs useReducer for local state?

**Answer:** Use `useState` for simple state (primitives, simple objects), and `useReducer` for complex state logic, multiple related state variables, or when state transitions depend on previous state.

### Q: How do you optimize local state performance?

**Answer:**

- Split state into separate pieces to avoid unnecessary re-renders
- Use lazy initialization for expensive initial state
- Memoize state-derived values with useMemo
- Use callback functions for state updates when depending on previous state

### Q: What's the difference between local state and derived state?

**Answer:** Local state is stored in component memory and triggers re-renders when updated. Derived state is computed from existing state/props and should be calculated during render or memoized with useMemo rather than stored in state.

### Q: How do you handle asynchronous operations with local state?

**Answer:** Use loading/error states, cleanup functions in useEffect, and AbortController for cancelling requests. Always check if component is still mounted before setting state.
