# Zustand State Management

Zustand is a small, fast, and scalable state management solution for React applications that uses simplified flux principles without boilerplate.

## Basic Setup

### Simple Store Creation

```typescript
import { create } from "zustand";

interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));
```

### Using the Store

```typescript
import React from "react";

const Counter: React.FC = () => {
  const { count, increment, decrement, reset } = useCounterStore();

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
};
```

### Selective Subscriptions

```typescript
const CountDisplay: React.FC = () => {
  const count = useCounterStore((state) => state.count);

  return <div>Count: {count}</div>;
};

const CountControls: React.FC = () => {
  const { increment, decrement } = useCounterStore((state) => ({
    increment: state.increment,
    decrement: state.decrement,
  }));

  return (
    <div>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
};
```

## Advanced Store Patterns

### Complex State Structure

```typescript
interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoState {
  todos: Todo[];
  filter: "all" | "active" | "completed";
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
  setFilter: (filter: "all" | "active" | "completed") => void;
  clearCompleted: () => void;
  filteredTodos: () => Todo[];
}

const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],
  filter: "all",

  addTodo: (text: string) =>
    set((state) => ({
      todos: [
        ...state.todos,
        {
          id: Date.now().toString(),
          text,
          completed: false,
        },
      ],
    })),

  toggleTodo: (id: string) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ),
    })),

  removeTodo: (id: string) =>
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    })),

  setFilter: (filter) => set({ filter }),

  clearCompleted: () =>
    set((state) => ({
      todos: state.todos.filter((todo) => !todo.completed),
    })),

  filteredTodos: () => {
    const { todos, filter } = get();
    switch (filter) {
      case "active":
        return todos.filter((todo) => !todo.completed);
      case "completed":
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  },
}));
```

### Async Actions

```typescript
interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  createUser: (userData: Omit<User, "id">) => Promise<void>;
  updateUser: (id: string, userData: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

const useUserStore = create<UserState>((set, get) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const users = await response.json();
      set({ users, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createUser: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error("Failed to create user");
      const newUser = await response.json();
      set((state) => ({
        users: [...state.users, newUser],
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  updateUser: async (id, userData) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error("Failed to update user");
      const updatedUser = await response.json();
      set((state) => ({
        users: state.users.map((user) => (user.id === id ? updatedUser : user)),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  deleteUser: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete user");
      set((state) => ({
        users: state.users.filter((user) => user.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));
```

## Middleware and Persistence

### Persisting State

```typescript
import { persist, createJSONStorage } from "zustand/middleware";

interface SettingsState {
  theme: "light" | "dark";
  language: string;
  notifications: boolean;
  setTheme: (theme: "light" | "dark") => void;
  setLanguage: (language: string) => void;
  toggleNotifications: () => void;
}

const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "light",
      language: "en",
      notifications: true,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      toggleNotifications: () =>
        set((state) => ({ notifications: !state.notifications })),
    }),
    {
      name: "settings-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

### Custom Storage

```typescript
import { StateStorage } from "zustand/middleware";

const customStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await AsyncStorage.getItem(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await AsyncStorage.setItem(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await AsyncStorage.removeItem(name);
  },
};

const usePersistedStore = create<State>()(
  persist(
    (set) => ({
      // store definition
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => customStorage),
    }
  )
);
```

### DevTools Integration

```typescript
import { devtools } from "zustand/middleware";

const useStore = create<State>()(
  devtools(
    (set) => ({
      // store definition
    }),
    {
      name: "my-store",
    }
  )
);
```

### Combining Middleware

```typescript
const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // store definition
      }),
      {
        name: "app-storage",
        partialize: (state) => ({
          user: state.user,
          settings: state.settings,
        }),
      }
    ),
    {
      name: "app-store",
    }
  )
);
```

## Store Composition

### Slice Pattern

```typescript
interface AuthSlice {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const createAuthSlice = (set: any, get: any): AuthSlice => ({
  user: null,
  token: null,
  login: async (email, password) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const { user, token } = await response.json();
      set({ user, token });
    } catch (error) {
      console.error("Login failed:", error);
    }
  },
  logout: () => set({ user: null, token: null }),
});

interface CartSlice {
  items: CartItem[];
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

const createCartSlice = (set: any, get: any): CartSlice => ({
  items: [],
  total: 0,
  addItem: (item) =>
    set((state: any) => {
      const existingItem = state.items.find((i: any) => i.id === item.id);
      const items = existingItem
        ? state.items.map((i: any) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [...state.items, { ...item, quantity: 1 }];
      const total = items.reduce(
        (sum: number, item: any) => sum + item.price * item.quantity,
        0
      );
      return { items, total };
    }),
  removeItem: (id) =>
    set((state: any) => {
      const items = state.items.filter((item: any) => item.id !== id);
      const total = items.reduce(
        (sum: number, item: any) => sum + item.price * item.quantity,
        0
      );
      return { items, total };
    }),
  clearCart: () => set({ items: [], total: 0 }),
});

type AppState = AuthSlice & CartSlice;

const useAppStore = create<AppState>((set, get) => ({
  ...createAuthSlice(set, get),
  ...createCartSlice(set, get),
}));
```

### Store Dependencies

```typescript
const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (item) => {
    const { user } = useAuthStore.getState();
    if (!user) {
      throw new Error("User must be logged in");
    }

    set((state) => ({
      items: [...state.items, item],
    }));
  },
}));

const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],

  createOrder: async () => {
    const { items, clearCart } = useCartStore.getState();
    const { user, token } = useAuthStore.getState();

    if (!user || !token) {
      throw new Error("Authentication required");
    }

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items }),
      });

      const order = await response.json();
      set((state) => ({ orders: [...state.orders, order] }));
      clearCart();
    } catch (error) {
      console.error("Order creation failed:", error);
    }
  },
}));
```

## Testing Zustand

### Store Testing

```typescript
import { renderHook, act } from "@testing-library/react";
import { useCounterStore } from "./counterStore";

describe("useCounterStore", () => {
  beforeEach(() => {
    useCounterStore.setState({ count: 0 });
  });

  it("should increment count", () => {
    const { result } = renderHook(() => useCounterStore());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it("should decrement count", () => {
    const { result } = renderHook(() => useCounterStore());

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(-1);
  });

  it("should reset count", () => {
    const { result } = renderHook(() => useCounterStore());

    act(() => {
      result.current.increment();
      result.current.increment();
      result.current.reset();
    });

    expect(result.current.count).toBe(0);
  });
});
```

### Component Testing

```typescript
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useCounterStore } from "./counterStore";
import Counter from "./Counter";

describe("Counter", () => {
  beforeEach(() => {
    useCounterStore.setState({ count: 0 });
  });

  it("should display current count", () => {
    render(<Counter />);
    expect(screen.getByText("Count: 0")).toBeInTheDocument();
  });

  it("should increment when plus button is clicked", () => {
    render(<Counter />);
    fireEvent.click(screen.getByText("+"));
    expect(screen.getByText("Count: 1")).toBeInTheDocument();
  });

  it("should decrement when minus button is clicked", () => {
    render(<Counter />);
    fireEvent.click(screen.getByText("-"));
    expect(screen.getByText("Count: -1")).toBeInTheDocument();
  });
});
```

### Mock Store for Testing

```typescript
import { create } from "zustand";

const createMockStore = (initialState: Partial<CounterState> = {}) =>
  create<CounterState>((set) => ({
    count: 0,
    increment: jest.fn(() => set((state) => ({ count: state.count + 1 }))),
    decrement: jest.fn(() => set((state) => ({ count: state.count - 1 }))),
    reset: jest.fn(() => set({ count: 0 })),
    ...initialState,
  }));

describe("Counter with mock store", () => {
  let mockStore: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    mockStore = createMockStore();
  });

  it("should call increment function", () => {
    const { result } = renderHook(() => mockStore());

    act(() => {
      result.current.increment();
    });

    expect(result.current.increment).toHaveBeenCalled();
  });
});
```

## Performance Optimization

### Shallow Comparison

```typescript
import { shallow } from "zustand/shallow";

const Component: React.FC = () => {
  const { count, increment, decrement } = useCounterStore(
    (state) => ({
      count: state.count,
      increment: state.increment,
      decrement: state.decrement,
    }),
    shallow
  );

  return (
    <div>
      <span>{count}</span>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
};
```

### Memoized Selectors

```typescript
import { useMemo } from "react";

const useTodoStats = () => {
  const todos = useTodoStore((state) => state.todos);

  return useMemo(
    () => ({
      total: todos.length,
      completed: todos.filter((todo) => todo.completed).length,
      active: todos.filter((todo) => !todo.completed).length,
    }),
    [todos]
  );
};

const TodoStats: React.FC = () => {
  const stats = useTodoStats();

  return (
    <div>
      <span>Total: {stats.total}</span>
      <span>Completed: {stats.completed}</span>
      <span>Active: {stats.active}</span>
    </div>
  );
};
```

### Subscription Patterns

```typescript
const useOptimizedTodos = () => {
  const todos = useTodoStore((state) => state.todos);
  const filter = useTodoStore((state) => state.filter);

  return useMemo(() => {
    switch (filter) {
      case "active":
        return todos.filter((todo) => !todo.completed);
      case "completed":
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);
};
```

## Best Practices

### Store Organization

- Keep stores focused and cohesive
- Use slice pattern for large applications
- Separate actions from state
- Use TypeScript for type safety

### State Structure

- Keep state flat when possible
- Use normalized data for lists
- Separate UI state from domain state
- Use computed values for derived state

### Performance

- Use selective subscriptions
- Implement shallow comparison for objects
- Memoize expensive computations
- Avoid unnecessary re-renders

### Testing

- Test store logic separately from components
- Use mock stores for component testing
- Reset store state between tests
- Test async actions with proper error handling

## Common Patterns

### Form State Management

```typescript
interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  setFieldValue: (field: string, value: any) => void;
  setFieldError: (field: string, error: string) => void;
  setFieldTouched: (field: string, touched: boolean) => void;
  validateField: (field: string) => void;
  submitForm: () => Promise<void>;
  resetForm: () => void;
}

const useFormStore = create<FormState>((set, get) => ({
  values: {},
  errors: {},
  touched: {},
  isSubmitting: false,

  setFieldValue: (field, value) =>
    set((state) => ({
      values: { ...state.values, [field]: value },
      errors: { ...state.errors, [field]: "" },
    })),

  setFieldError: (field, error) =>
    set((state) => ({
      errors: { ...state.errors, [field]: error },
    })),

  setFieldTouched: (field, touched) =>
    set((state) => ({
      touched: { ...state.touched, [field]: touched },
    })),

  validateField: (field) => {
    const { values } = get();
    const value = values[field];

    if (!value || value.trim() === "") {
      get().setFieldError(field, "This field is required");
    }
  },

  submitForm: async () => {
    const { values, validateField } = get();
    set({ isSubmitting: true });

    Object.keys(values).forEach(validateField);

    const { errors } = get();
    const hasErrors = Object.values(errors).some((error) => error !== "");

    if (!hasErrors) {
      try {
        await submitFormData(values);
        get().resetForm();
      } catch (error) {
        console.error("Form submission failed:", error);
      }
    }

    set({ isSubmitting: false });
  },

  resetForm: () =>
    set({
      values: {},
      errors: {},
      touched: {},
      isSubmitting: false,
    }),
}));
```

## Interview Questions

**Q: What is Zustand and how does it differ from Redux?**
A: Zustand is a lightweight state management library that:

- Has less boilerplate than Redux
- Doesn't require providers or context
- Uses hooks directly
- Has built-in TypeScript support
- Supports middleware and persistence
- Is smaller in bundle size

**Q: How do you prevent unnecessary re-renders in Zustand?**
A: Several strategies:

- Use selective subscriptions to only subscribe to needed state
- Use shallow comparison for object selections
- Memoize expensive computations
- Split large stores into focused smaller stores

**Q: How do you handle async operations in Zustand?**
A: Create async actions within the store:

- Set loading states before operations
- Handle success and error cases
- Update state based on results
- Use try-catch for error handling

**Q: How do you test Zustand stores?**
A: Testing approaches:

- Test store logic with renderHook
- Reset store state between tests
- Mock external dependencies
- Test async actions with proper error scenarios
- Use mock stores for component testing

**Q: When would you choose Zustand over other state management solutions?**
A: Choose Zustand when:

- You want minimal boilerplate
- You prefer hooks-based API
- You need TypeScript support out of the box
- Bundle size is important
- You want built-in persistence and devtools
- You prefer a more flexible architecture than Redux
