# Context API in React

The Context API provides a way to share data through the component tree without passing props down manually at every level. It's React's built-in solution for managing global state.

## Basic Context Usage

### Creating and Using Context

```tsx
import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
}

interface UserContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}

// Usage in components
function LoginForm() {
  const { login, loading, error } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}

function UserProfile() {
  const { user, logout } = useUser();

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div>
      <h2>Welcome, {user.name}!</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Advanced Context Patterns

### Multiple Context Providers

```tsx
import { createContext, useContext, useReducer, ReactNode } from "react";

interface ThemeContextValue {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

interface SettingsContextValue {
  language: string;
  notifications: boolean;
  setLanguage: (lang: string) => void;
  toggleNotifications: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const SettingsContext = createContext<SettingsContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState({
    language: "en",
    notifications: true,
  });

  const setLanguage = (lang: string) => {
    setSettings((prev) => ({ ...prev, language: lang }));
  };

  const toggleNotifications = () => {
    setSettings((prev) => ({ ...prev, notifications: !prev.notifications }));
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        setLanguage,
        toggleNotifications,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

// Compound Provider Pattern
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <ThemeProvider>
        <SettingsProvider>{children}</SettingsProvider>
      </ThemeProvider>
    </UserProvider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
}
```

### Context with Reducer Pattern

```tsx
import { createContext, useContext, useReducer, ReactNode } from "react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
}

interface TodoState {
  todos: Todo[];
  filter: "all" | "active" | "completed";
  searchQuery: string;
  loading: boolean;
}

type TodoAction =
  | { type: "ADD_TODO"; payload: Omit<Todo, "id"> }
  | { type: "TOGGLE_TODO"; payload: number }
  | { type: "DELETE_TODO"; payload: number }
  | { type: "UPDATE_TODO"; payload: { id: number; updates: Partial<Todo> } }
  | { type: "SET_FILTER"; payload: TodoState["filter"] }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "LOAD_TODOS"; payload: Todo[] };

const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
  switch (action.type) {
    case "ADD_TODO":
      return {
        ...state,
        todos: [...state.todos, { ...action.payload, id: Date.now() }],
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
    case "UPDATE_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id
            ? { ...todo, ...action.payload.updates }
            : todo
        ),
      };
    case "SET_FILTER":
      return {
        ...state,
        filter: action.payload,
      };
    case "SET_SEARCH_QUERY":
      return {
        ...state,
        searchQuery: action.payload,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "LOAD_TODOS":
      return {
        ...state,
        todos: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

interface TodoContextValue {
  state: TodoState;
  dispatch: React.Dispatch<TodoAction>;
  filteredTodos: Todo[];
  addTodo: (todo: Omit<Todo, "id">) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  updateTodo: (id: number, updates: Partial<Todo>) => void;
}

const TodoContext = createContext<TodoContextValue | null>(null);

export function TodoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(todoReducer, {
    todos: [],
    filter: "all",
    searchQuery: "",
    loading: false,
  });

  const filteredTodos = useMemo(() => {
    let filtered = state.todos;

    if (state.filter !== "all") {
      filtered = filtered.filter((todo) =>
        state.filter === "completed" ? todo.completed : !todo.completed
      );
    }

    if (state.searchQuery) {
      filtered = filtered.filter((todo) =>
        todo.text.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [state.todos, state.filter, state.searchQuery]);

  const addTodo = (todo: Omit<Todo, "id">) => {
    dispatch({ type: "ADD_TODO", payload: todo });
  };

  const toggleTodo = (id: number) => {
    dispatch({ type: "TOGGLE_TODO", payload: id });
  };

  const deleteTodo = (id: number) => {
    dispatch({ type: "DELETE_TODO", payload: id });
  };

  const updateTodo = (id: number, updates: Partial<Todo>) => {
    dispatch({ type: "UPDATE_TODO", payload: { id, updates } });
  };

  useEffect(() => {
    const loadTodos = async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const response = await fetch("/api/todos");
        const todos = await response.json();
        dispatch({ type: "LOAD_TODOS", payload: todos });
      } catch (error) {
        console.error("Failed to load todos:", error);
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    loadTodos();
  }, []);

  return (
    <TodoContext.Provider
      value={{
        state,
        dispatch,
        filteredTodos,
        addTodo,
        toggleTodo,
        deleteTodo,
        updateTodo,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function useTodos() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodos must be used within TodoProvider");
  }
  return context;
}
```

## Context Performance Optimization

### Splitting Context for Performance

```tsx
import { createContext, useContext, useState, ReactNode } from "react";

interface UserData {
  id: number;
  name: string;
  email: string;
}

interface UserActions {
  updateProfile: (updates: Partial<UserData>) => void;
  deleteAccount: () => void;
}

const UserDataContext = createContext<UserData | null>(null);
const UserActionsContext = createContext<UserActions | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null);

  const userActions: UserActions = useMemo(
    () => ({
      updateProfile: (updates: Partial<UserData>) => {
        setUserData((prev) => (prev ? { ...prev, ...updates } : null));
      },
      deleteAccount: () => {
        setUserData(null);
      },
    }),
    []
  );

  return (
    <UserDataContext.Provider value={userData}>
      <UserActionsContext.Provider value={userActions}>
        {children}
      </UserActionsContext.Provider>
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error("useUserData must be used within UserProvider");
  }
  return context;
}

export function useUserActions() {
  const context = useContext(UserActionsContext);
  if (!context) {
    throw new Error("useUserActions must be used within UserProvider");
  }
  return context;
}

// Components that only need data won't re-render when actions change
const UserDisplay = React.memo(() => {
  const userData = useUserData();
  return userData ? <div>{userData.name}</div> : null;
});

// Components that only need actions won't re-render when data changes
const UserControls = React.memo(() => {
  const { updateProfile, deleteAccount } = useUserActions();
  return (
    <div>
      <button onClick={() => updateProfile({ name: "New Name" })}>
        Update Name
      </button>
      <button onClick={deleteAccount}>Delete Account</button>
    </div>
  );
});
```

### Context with Selectors

```tsx
import { createContext, useContext, useState, useMemo, ReactNode } from "react";

interface AppState {
  user: User | null;
  posts: Post[];
  comments: Comment[];
  ui: {
    sidebarOpen: boolean;
    theme: "light" | "dark";
    loading: boolean;
  };
}

interface AppContextValue {
  state: AppState;
  updateState: (updater: (prev: AppState) => AppState) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    user: null,
    posts: [],
    comments: [],
    ui: {
      sidebarOpen: false,
      theme: "light",
      loading: false,
    },
  });

  const updateState = useMemo(
    () => (updater: (prev: AppState) => AppState) => {
      setState(updater);
    },
    []
  );

  return (
    <AppContext.Provider value={{ state, updateState }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook with selector pattern
export function useAppSelector<T>(selector: (state: AppState) => T): T {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppSelector must be used within AppProvider");
  }

  return useMemo(() => selector(context.state), [selector, context.state]);
}

export function useAppActions() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppActions must be used within AppProvider");
  }

  return useMemo(
    () => ({
      setUser: (user: User | null) =>
        context.updateState((prev) => ({ ...prev, user })),

      setPosts: (posts: Post[]) =>
        context.updateState((prev) => ({ ...prev, posts })),

      toggleSidebar: () =>
        context.updateState((prev) => ({
          ...prev,
          ui: { ...prev.ui, sidebarOpen: !prev.ui.sidebarOpen },
        })),

      setTheme: (theme: "light" | "dark") =>
        context.updateState((prev) => ({
          ...prev,
          ui: { ...prev.ui, theme },
        })),
    }),
    [context.updateState]
  );
}

// Usage with selectors
function UserProfile() {
  const user = useAppSelector((state) => state.user);
  const { setUser } = useAppActions();

  if (!user) return <div>Not logged in</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <button onClick={() => setUser(null)}>Logout</button>
    </div>
  );
}

function ThemeToggle() {
  const theme = useAppSelector((state) => state.ui.theme);
  const { setTheme } = useAppActions();

  return (
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      Current: {theme}
    </button>
  );
}
```

## Context vs Other State Solutions

| Feature            | Context API            | Redux            | Zustand  | Local State |
| ------------------ | ---------------------- | ---------------- | -------- | ----------- |
| **Learning Curve** | Low                    | High             | Low      | Very Low    |
| **Bundle Size**    | 0KB                    | ~10KB            | ~2KB     | 0KB         |
| **DevTools**       | Limited                | Excellent        | Good     | Basic       |
| **Performance**    | Good with optimization | Excellent        | Good     | Excellent   |
| **Async Actions**  | Manual                 | With middlewares | Built-in | Manual      |
| **Type Safety**    | Good                   | Excellent        | Good     | Excellent   |

## Best Practices

### Context Structure

```tsx
// Good: Focused context
interface AuthContextValue {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

// Bad: Kitchen sink context
interface AppContextValue {
  user: User | null;
  posts: Post[];
  comments: Comment[];
  theme: string;
  sidebarOpen: boolean;
  login: () => void;
  logout: () => void;
  addPost: () => void;
  deletePost: () => void;
  toggleSidebar: () => void;
}
```

### Error Boundaries with Context

```tsx
import { createContext, useContext, useState, ReactNode } from "react";

interface ErrorContextValue {
  error: Error | null;
  setError: (error: Error | null) => void;
  clearError: () => void;
}

const ErrorContext = createContext<ErrorContextValue | null>(null);

export function ErrorProvider({ children }: { children: ReactNode }) {
  const [error, setError] = useState<Error | null>(null);

  const clearError = () => setError(null);

  return (
    <ErrorContext.Provider value={{ error, setError, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
}

export function useError() {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useError must be used within ErrorProvider");
  }
  return context;
}

// Error Boundary component
class ErrorBoundary extends React.Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    const errorContext = this.context as ErrorContextValue;
    errorContext?.setError(error);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}

ErrorBoundary.contextType = ErrorContext;

function ErrorFallback() {
  const { error, clearError } = useError();

  return (
    <div className="error-boundary">
      <h2>Something went wrong</h2>
      <details>
        <summary>Error details</summary>
        <pre>{error?.stack}</pre>
      </details>
      <button onClick={clearError}>Try again</button>
    </div>
  );
}
```

## Common Pitfalls

### Avoiding Unnecessary Re-renders

```tsx
// Problem: Creating new objects in render
function BadProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isLoggedIn: user !== null,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

// Solution: Memoize the context value
function GoodProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      isLoggedIn: user !== null,
    }),
    [user]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}
```

## Interview Questions

### Q: When should you use Context API vs props drilling?

**Answer:** Use Context API when data needs to be shared across many levels of components or when the intermediate components don't need the data. Use props drilling for simple cases or when you want explicit data flow.

### Q: How do you optimize Context performance?

**Answer:** Split contexts by concern, memoize context values, use selectors to prevent unnecessary re-renders, and consider using React.memo for components that consume context.

### Q: What are the limitations of Context API?

**Answer:** Limited DevTools support, can cause performance issues if not optimized, doesn't handle async actions well without additional patterns, and can lead to provider hell with many contexts.

### Q: How does Context API compare to Redux?

**Answer:** Context is simpler and built-in, while Redux offers better DevTools, middleware support, and predictable state updates. Context is good for simpler apps, Redux for complex state management needs.
