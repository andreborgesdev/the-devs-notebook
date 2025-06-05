# Context API vs Redux

Understanding when to use React's Context API versus Redux for state management is crucial for making the right architectural decisions in React applications.

## Context API Overview

### Basic Context Setup

```typescript
import React, { createContext, useContext, useReducer, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
```

### Context with useReducer

```typescript
type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_ERROR"; payload: string }
  | { type: "LOGOUT" }
  | { type: "CLEAR_ERROR" };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, isLoading: true, error: null };
    case "LOGIN_SUCCESS":
      return { ...state, user: action.payload, isLoading: false, error: null };
    case "LOGIN_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    case "LOGOUT":
      return { ...state, user: null, isLoading: false, error: null };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
};

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: false,
    error: null,
  });

  const login = async (email: string, password: string) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Login failed");

      const user = await response.json();
      dispatch({ type: "LOGIN_SUCCESS", payload: user });
    } catch (error) {
      dispatch({ type: "LOGIN_ERROR", payload: error.message });
    }
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

## Redux Overview

### Redux Store Setup

```typescript
import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    loginError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isLoading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { loginStart, loginSuccess, loginError, logout, clearError } =
  authSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Redux Component Usage

```typescript
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { loginStart, loginSuccess, loginError } from "../authSlice";

const useAppSelector = (selector: (state: RootState) => any) =>
  useSelector(selector);
const useAppDispatch = () => useDispatch<AppDispatch>();

const LoginComponent: React.FC = () => {
  const { user, isLoading, error } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogin = async (email: string, password: string) => {
    dispatch(loginStart());
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Login failed");

      const user = await response.json();
      dispatch(loginSuccess(user));
    } catch (error) {
      dispatch(loginError(error.message));
    }
  };

  return (
    <div>
      {user ? (
        <p>Welcome, {user.name}!</p>
      ) : (
        <LoginForm onLogin={handleLogin} loading={isLoading} error={error} />
      )}
    </div>
  );
};
```

## Detailed Comparison

### Performance Comparison

#### Context API Re-render Behavior

```typescript
// Problem: All consumers re-render when any part of context value changes
const AppContext = createContext({
  user: null,
  theme: "light",
  settings: {},
  updateUser: () => {},
  updateTheme: () => {},
  updateSettings: () => {},
});

// Component that only needs theme will re-render when user changes
const ThemeToggle: React.FC = () => {
  const { theme, updateTheme } = useContext(AppContext);

  console.log("ThemeToggle rendered"); // This logs on every context change

  return (
    <button onClick={() => updateTheme(theme === "light" ? "dark" : "light")}>
      {theme} mode
    </button>
  );
};
```

#### Context Optimization Strategies

```typescript
// Split contexts to minimize re-renders
const UserContext = createContext<UserContextType>(null!);
const ThemeContext = createContext<ThemeContextType>(null!);
const SettingsContext = createContext<SettingsContextType>(null!);

// Use memo to prevent unnecessary re-renders
const OptimizedThemeToggle: React.FC = memo(() => {
  const { theme, updateTheme } = useContext(ThemeContext);

  return (
    <button onClick={() => updateTheme(theme === "light" ? "dark" : "light")}>
      {theme} mode
    </button>
  );
});

// Split state and actions
const AppStateContext = createContext<AppState>(null!);
const AppActionsContext = createContext<AppActions>(null!);
```

#### Redux Performance Benefits

```typescript
// Redux components only re-render when selected state changes
const ThemeToggle: React.FC = () => {
  const theme = useSelector((state: RootState) => state.ui.theme);
  const dispatch = useDispatch();

  // Only re-renders when theme changes, not when user or other state changes
  return <button onClick={() => dispatch(toggleTheme())}>{theme} mode</button>;
};

// Memoized selectors prevent unnecessary re-renders
const selectUserName = createSelector(
  (state: RootState) => state.auth.user,
  (user) => user?.name
);

const UserGreeting: React.FC = () => {
  const userName = useSelector(selectUserName);

  // Only re-renders when user.name changes, not other user properties
  return <h1>Hello, {userName}!</h1>;
};
```

### Complexity and Boilerplate

#### Context API Simplicity

```typescript
// Minimal setup for simple state
const CounterContext = createContext<{
  count: number;
  increment: () => void;
  decrement: () => void;
}>(null!);

const CounterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [count, setCount] = useState(0);

  const value = {
    count,
    increment: () => setCount((prev) => prev + 1),
    decrement: () => setCount((prev) => prev - 1),
  };

  return (
    <CounterContext.Provider value={value}>{children}</CounterContext.Provider>
  );
};
```

#### Redux Boilerplate

```typescript
// More setup required but with better structure
const counterSlice = createSlice({
  name: "counter",
  initialState: { count: 0 },
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
    decrement: (state) => {
      state.count -= 1;
    },
    incrementByAmount: (state, action) => {
      state.count += action.payload;
    },
  },
});

// Store configuration
const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
});

// Provider setup
const App: React.FC = () => (
  <Provider store={store}>
    <Counter />
  </Provider>
);
```

### Developer Experience

#### Context API DevTools

```typescript
// Custom DevTools integration
const ContextDevTools: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      (window as any).__CONTEXT_STATE__ = state;
    }
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
```

#### Redux DevTools

```typescript
// Built-in DevTools support
const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== "production",
});

// Automatic time-travel debugging, action logging, state inspection
```

### Testing Comparison

#### Testing Context

```typescript
import { render, screen } from "@testing-library/react";

const renderWithContext = (
  component: ReactElement,
  contextValue: Partial<AuthContextType> = {}
) => {
  const defaultValue: AuthContextType = {
    user: null,
    isLoading: false,
    error: null,
    login: jest.fn(),
    logout: jest.fn(),
    clearError: jest.fn(),
    ...contextValue,
  };

  return render(
    <AuthContext.Provider value={defaultValue}>
      {component}
    </AuthContext.Provider>
  );
};

describe("LoginComponent", () => {
  it("should show login form when user is not logged in", () => {
    renderWithContext(<LoginComponent />);
    expect(screen.getByRole("form")).toBeInTheDocument();
  });

  it("should show user greeting when logged in", () => {
    renderWithContext(<LoginComponent />, {
      user: { id: "1", name: "John", email: "john@example.com" },
    });
    expect(screen.getByText("Welcome, John!")).toBeInTheDocument();
  });
});
```

#### Testing Redux

```typescript
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

const createMockStore = (initialState: Partial<RootState> = {}) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState: {
      auth: {
        user: null,
        isLoading: false,
        error: null,
      },
      ...initialState,
    },
  });
};

const renderWithRedux = (
  component: ReactElement,
  initialState: Partial<RootState> = {}
) => {
  const store = createMockStore(initialState);
  return render(<Provider store={store}>{component}</Provider>);
};

describe("LoginComponent", () => {
  it("should show login form when user is not logged in", () => {
    renderWithRedux(<LoginComponent />);
    expect(screen.getByRole("form")).toBeInTheDocument();
  });

  it("should show user greeting when logged in", () => {
    renderWithRedux(<LoginComponent />, {
      auth: {
        user: { id: "1", name: "John", email: "john@example.com" },
        isLoading: false,
        error: null,
      },
    });
    expect(screen.getByText("Welcome, John!")).toBeInTheDocument();
  });
});
```

## When to Use Each

### Use Context API When:

#### Simple Application State

```typescript
// Theme management
const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

#### Dependency Injection

```typescript
// Service injection
interface Services {
  apiService: ApiService;
  authService: AuthService;
  notificationService: NotificationService;
}

const ServicesContext = createContext<Services>(null!);

const ServicesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const services = useMemo(
    () => ({
      apiService: new ApiService(),
      authService: new AuthService(),
      notificationService: new NotificationService(),
    }),
    []
  );

  return (
    <ServicesContext.Provider value={services}>
      {children}
    </ServicesContext.Provider>
  );
};
```

#### Component Configuration

```typescript
// Form configuration
const FormConfigContext = createContext<{
  validationRules: ValidationRules;
  submitHandler: SubmitHandler;
  errorHandler: ErrorHandler;
}>(null!);
```

### Use Redux When:

#### Complex State Logic

```typescript
// E-commerce cart with complex logic
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    total: 0,
    discounts: [],
    shipping: null,
    tax: 0,
  },
  reducers: {
    addItem: (state, action) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      // Recalculate totals, apply discounts, etc.
      recalculateCart(state);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      recalculateCart(state);
    },
    applyDiscount: (state, action) => {
      state.discounts.push(action.payload);
      recalculateCart(state);
    },
  },
});
```

#### Cross-Component Communication

```typescript
// Notification system
const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
  },
  reducers: {
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now().toString(),
        ...action.payload,
        timestamp: new Date().toISOString(),
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
  },
});

// Any component can dispatch notifications
const SomeComponent: React.FC = () => {
  const dispatch = useDispatch();

  const handleSave = async () => {
    try {
      await saveData();
      dispatch(
        addNotification({
          type: "success",
          message: "Data saved successfully",
        })
      );
    } catch (error) {
      dispatch(
        addNotification({
          type: "error",
          message: "Failed to save data",
        })
      );
    }
  };

  return <button onClick={handleSave}>Save</button>;
};
```

#### Time-Travel Debugging

```typescript
// Complex form with undo/redo functionality
const formSlice = createSlice({
  name: "form",
  initialState: {
    fields: {},
    history: [],
    historyIndex: -1,
  },
  reducers: {
    updateField: (state, action) => {
      // Save current state to history
      if (state.historyIndex < state.history.length - 1) {
        state.history = state.history.slice(0, state.historyIndex + 1);
      }
      state.history.push({ ...state.fields });
      state.historyIndex += 1;

      // Update field
      state.fields[action.payload.name] = action.payload.value;
    },
    undo: (state) => {
      if (state.historyIndex > 0) {
        state.historyIndex -= 1;
        state.fields = { ...state.history[state.historyIndex] };
      }
    },
    redo: (state) => {
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex += 1;
        state.fields = { ...state.history[state.historyIndex] };
      }
    },
  },
});
```

## Hybrid Approach

### Combining Context and Redux

```typescript
// Redux for global application state
const store = configureStore({
  reducer: {
    auth: authReducer,
    notifications: notificationReducer,
    cart: cartReducer,
  },
});

// Context for component-specific state
const ModalContext = createContext<{
  isOpen: boolean;
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
}>(null!);

const App: React.FC = () => (
  <Provider store={store}>
    <ModalProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </Router>
    </ModalProvider>
  </Provider>
);
```

### Context for Redux Store Access

```typescript
// Custom hook that combines both
const useAppContext = () => {
  const dispatch = useDispatch();
  const { openModal, closeModal } = useContext(ModalContext);

  return {
    // Redux actions
    login: (credentials: LoginCredentials) => dispatch(loginAsync(credentials)),
    logout: () => dispatch(logout()),
    addToCart: (item: CartItem) => dispatch(addItem(item)),

    // Context actions
    showConfirmation: (message: string, onConfirm: () => void) => {
      openModal(<ConfirmationDialog message={message} onConfirm={onConfirm} />);
    },
    closeModal,
  };
};
```

## Migration Strategies

### From Context to Redux

```typescript
// Before: Context-based auth
const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (credentials: LoginCredentials) => {
    const user = await authService.login(credentials);
    setUser(user);
  };

  return (
    <AuthContext.Provider value={{ user, login }}>
      {children}
    </AuthContext.Provider>
  );
};

// After: Redux-based auth
const authSlice = createSlice({
  name: "auth",
  initialState: { user: null },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginAsync.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

// Migration component that gradually moves from context to Redux
const MigrationAuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const contextValue = {
    user,
    login: (credentials: LoginCredentials) => dispatch(loginAsync(credentials)),
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
```

## Decision Matrix

| Factor             | Context API           | Redux                      |
| ------------------ | --------------------- | -------------------------- |
| **Bundle Size**    | Smaller (built-in)    | Larger (external lib)      |
| **Learning Curve** | Easier                | Steeper                    |
| **Boilerplate**    | Minimal               | More setup required        |
| **Performance**    | Can cause re-renders  | Optimized subscriptions    |
| **DevTools**       | Manual setup          | Built-in support           |
| **Time Travel**    | Manual implementation | Built-in                   |
| **Middleware**     | Custom implementation | Rich ecosystem             |
| **Testing**        | Straightforward       | More tooling available     |
| **Scalability**    | Good for simple state | Excellent for complex apps |
| **Community**      | React ecosystem       | Large Redux ecosystem      |

## Interview Questions

**Q: When would you choose Context API over Redux?**
A: Choose Context API when:

- Simple application state (theme, user preferences)
- Dependency injection (services, configuration)
- Small to medium applications
- Want to avoid external dependencies
- State changes are infrequent
- Don't need time-travel debugging

**Q: What are the performance implications of Context API?**
A: Context performance considerations:

- All consumers re-render when context value changes
- Can be optimized by splitting contexts
- Use React.memo to prevent unnecessary re-renders
- Consider using multiple contexts for different concerns
- Redux provides better performance for frequent updates

**Q: How do you test components that use Context vs Redux?**
A: Testing approaches:

- **Context**: Create wrapper providers with mock values
- **Redux**: Use mock stores with configureStore
- Both require proper setup in test utilities
- Redux has more established testing patterns
- Context testing is more straightforward but less tooling

**Q: Can you use Context API and Redux together?**
A: Yes, hybrid approaches work well:

- Redux for global application state
- Context for component-specific state
- Context can wrap Redux for easier access
- Use each tool for its strengths
- Avoid duplicating state between both systems

**Q: What are the main differences in developer experience?**
A: Developer experience comparison:

- **Context**: Simpler setup, less tooling, manual DevTools
- **Redux**: Rich DevTools, time-travel debugging, extensive ecosystem
- **Context**: Better for prototyping and simple apps
- **Redux**: Better for large teams and complex applications
- **Context**: Less abstraction, more direct
- **Redux**: More predictable patterns, better debugging
