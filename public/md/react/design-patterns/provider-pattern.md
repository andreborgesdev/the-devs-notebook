# React Provider Pattern

The Provider Pattern is a fundamental React pattern that uses Context API to share data and functionality across component trees without prop drilling. It's essential for managing global state, themes, authentication, and other cross-cutting concerns.

## Basic Provider Pattern

### Simple Context Provider

```tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const userData = await response.json();
      setUser(userData.user);
      localStorage.setItem("token", userData.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function LoginForm() {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
      </div>
      <div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
      </div>
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}

function UserProfile() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="user-profile">
      <h2>Welcome, {user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Theme Provider

```tsx
interface Theme {
  mode: "light" | "dark";
  primaryColor: string;
  secondaryColor: string;
  fontSize: "small" | "medium" | "large";
  spacing: number;
}

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Partial<Theme>) => void;
  toggleTheme: () => void;
  resetTheme: () => void;
}

const defaultTheme: Theme = {
  mode: "light",
  primaryColor: "#3b82f6",
  secondaryColor: "#64748b",
  fontSize: "medium",
  spacing: 8,
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: Partial<Theme>;
}

export function ThemeProvider({ children, initialTheme }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>({
    ...defaultTheme,
    ...initialTheme,
  });

  const setTheme = useCallback((newTheme: Partial<Theme>) => {
    setThemeState((prev) => ({ ...prev, ...newTheme }));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme({ mode: theme.mode === "light" ? "dark" : "light" });
  }, [theme.mode, setTheme]);

  const resetTheme = useCallback(() => {
    setThemeState(defaultTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        setThemeState((prev) => ({ ...prev, ...parsedTheme }));
      } catch (error) {
        console.warn("Failed to parse saved theme:", error);
      }
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--primary-color", theme.primaryColor);
    root.style.setProperty("--secondary-color", theme.secondaryColor);
    root.style.setProperty("--spacing", `${theme.spacing}px`);
    root.setAttribute("data-theme", theme.mode);
    root.setAttribute("data-font-size", theme.fontSize);
  }, [theme]);

  const value: ThemeContextType = {
    theme,
    setTheme,
    toggleTheme,
    resetTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

function ThemeControls() {
  const { theme, setTheme, toggleTheme, resetTheme } = useTheme();

  return (
    <div className="theme-controls">
      <h3>Theme Settings</h3>

      <div className="control-group">
        <label>Color Mode:</label>
        <button onClick={toggleTheme}>
          {theme.mode === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>

      <div className="control-group">
        <label>Primary Color:</label>
        <input
          type="color"
          value={theme.primaryColor}
          onChange={(e) => setTheme({ primaryColor: e.target.value })}
        />
      </div>

      <div className="control-group">
        <label>Font Size:</label>
        <select
          value={theme.fontSize}
          onChange={(e) =>
            setTheme({ fontSize: e.target.value as Theme["fontSize"] })
          }
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>

      <div className="control-group">
        <label>Spacing:</label>
        <input
          type="range"
          min="4"
          max="16"
          value={theme.spacing}
          onChange={(e) => setTheme({ spacing: parseInt(e.target.value) })}
        />
        <span>{theme.spacing}px</span>
      </div>

      <button onClick={resetTheme}>Reset to Default</button>
    </div>
  );
}
```

## Advanced Provider Patterns

### Multi-Provider Composition

```tsx
interface AppProviderProps {
  children: ReactNode;
}

function AppProvider({ children }: AppProviderProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <ShoppingCartProvider>{children}</ShoppingCartProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

function ComposeProviders({
  providers,
  children,
}: {
  providers: React.ComponentType<{ children: ReactNode }>[];
  children: ReactNode;
}) {
  return providers.reduceRight(
    (acc, Provider) => <Provider>{acc}</Provider>,
    children
  );
}

function App() {
  const providers = [
    ThemeProvider,
    AuthProvider,
    NotificationProvider,
    ShoppingCartProvider,
  ];

  return (
    <ComposeProviders providers={providers}>
      <AppContent />
    </ComposeProviders>
  );
}
```

### State Management Provider

```tsx
type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: User | null }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_PRODUCTS"; payload: Product[] }
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "CLEAR_CART" };

interface AppState {
  user: User | null;
  products: Product[];
  cart: CartItem[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AppState = {
  user: null,
  products: [],
  cart: [],
  isLoading: false,
  error: null,
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_USER":
      return { ...state, user: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "SET_PRODUCTS":
      return { ...state, products: action.payload };

    case "ADD_TO_CART": {
      const existingItem = state.cart.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      return { ...state, cart: [...state.cart, action.payload] };
    }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      };

    case "CLEAR_CART":
      return { ...state, cart: [] };

    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  actions: {
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    fetchProducts: () => Promise<void>;
    addToCart: (product: Product, quantity: number) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
  };
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const actions = useMemo(
    () => ({
      login: async (email: string, password: string) => {
        dispatch({ type: "SET_LOADING", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });

        try {
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            throw new Error("Login failed");
          }

          const { user } = await response.json();
          dispatch({ type: "SET_USER", payload: user });
        } catch (error) {
          dispatch({
            type: "SET_ERROR",
            payload: error instanceof Error ? error.message : "Login failed",
          });
        } finally {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      },

      logout: () => {
        dispatch({ type: "SET_USER", payload: null });
        dispatch({ type: "CLEAR_CART" });
        localStorage.removeItem("token");
      },

      fetchProducts: async () => {
        dispatch({ type: "SET_LOADING", payload: true });

        try {
          const response = await fetch("/api/products");
          const products = await response.json();
          dispatch({ type: "SET_PRODUCTS", payload: products });
        } catch (error) {
          dispatch({
            type: "SET_ERROR",
            payload: "Failed to fetch products",
          });
        } finally {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      },

      addToCart: (product: Product, quantity: number = 1) => {
        dispatch({
          type: "ADD_TO_CART",
          payload: {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity,
          },
        });
      },

      removeFromCart: (productId: string) => {
        dispatch({ type: "REMOVE_FROM_CART", payload: productId });
      },

      clearCart: () => {
        dispatch({ type: "CLEAR_CART" });
      },
    }),
    []
  );

  const value: AppContextType = {
    state,
    dispatch,
    actions,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function ProductList() {
  const { state, actions } = useApp();

  useEffect(() => {
    actions.fetchProducts();
  }, [actions]);

  if (state.isLoading) return <div>Loading products...</div>;
  if (state.error) return <div>Error: {state.error}</div>;

  return (
    <div className="product-list">
      {state.products.map((product) => (
        <div key={product.id} className="product-card">
          <h3>{product.name}</h3>
          <p>${product.price}</p>
          <button
            onClick={() => actions.addToCart(product)}
            disabled={!state.user}
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}

function ShoppingCart() {
  const { state, actions } = useApp();

  const total = state.cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="shopping-cart">
      <h2>Shopping Cart</h2>
      {state.cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {state.cart.map((item) => (
            <div key={item.id} className="cart-item">
              <span>{item.name}</span>
              <span>Qty: {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
              <button onClick={() => actions.removeFromCart(item.id)}>
                Remove
              </button>
            </div>
          ))}
          <div className="cart-total">
            <strong>Total: ${total.toFixed(2)}</strong>
          </div>
          <button onClick={actions.clearCart}>Clear Cart</button>
        </>
      )}
    </div>
  );
}
```

### Async Provider with Loading States

```tsx
interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
}

interface DataProviderProps<T> {
  children: ReactNode;
  fetcher: () => Promise<T>;
  refreshInterval?: number;
  cacheTime?: number;
}

function createAsyncProvider<T>() {
  interface DataContextType {
    state: AsyncState<T>;
    refetch: () => Promise<void>;
    invalidate: () => void;
  }

  const DataContext = createContext<DataContextType | null>(null);

  function useData() {
    const context = useContext(DataContext);
    if (!context) {
      throw new Error("useData must be used within DataProvider");
    }
    return context;
  }

  function DataProvider({
    children,
    fetcher,
    refreshInterval,
    cacheTime = 5 * 60 * 1000, // 5 minutes
  }: DataProviderProps<T>) {
    const [state, setState] = useState<AsyncState<T>>({
      data: null,
      loading: false,
      error: null,
      lastFetch: null,
    });

    const fetchData = useCallback(async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const data = await fetcher();
        setState({
          data,
          loading: false,
          error: null,
          lastFetch: Date.now(),
        });
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : "An error occurred",
        }));
      }
    }, [fetcher]);

    const refetch = useCallback(async () => {
      await fetchData();
    }, [fetchData]);

    const invalidate = useCallback(() => {
      setState((prev) => ({ ...prev, lastFetch: null }));
    }, []);

    useEffect(() => {
      const shouldFetch =
        !state.lastFetch ||
        (cacheTime && Date.now() - state.lastFetch > cacheTime);

      if (shouldFetch) {
        fetchData();
      }
    }, [fetchData, state.lastFetch, cacheTime]);

    useEffect(() => {
      if (!refreshInterval) return;

      const interval = setInterval(() => {
        if (!document.hidden) {
          fetchData();
        }
      }, refreshInterval);

      return () => clearInterval(interval);
    }, [fetchData, refreshInterval]);

    useEffect(() => {
      const handleVisibilityChange = () => {
        if (!document.hidden && state.lastFetch) {
          const timeSinceLastFetch = Date.now() - state.lastFetch;
          if (timeSinceLastFetch > cacheTime) {
            fetchData();
          }
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);
      return () => {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
      };
    }, [fetchData, state.lastFetch, cacheTime]);

    const value: DataContextType = {
      state,
      refetch,
      invalidate,
    };

    return (
      <DataContext.Provider value={value}>{children}</DataContext.Provider>
    );
  }

  return { DataProvider, useData };
}

const { DataProvider: UsersProvider, useData: useUsers } =
  createAsyncProvider<User[]>();
const { DataProvider: PostsProvider, useData: usePosts } =
  createAsyncProvider<Post[]>();

function UsersDashboard() {
  return (
    <UsersProvider
      fetcher={() => fetch("/api/users").then((res) => res.json())}
      refreshInterval={30000} // 30 seconds
      cacheTime={60000} // 1 minute
    >
      <UsersContent />
    </UsersProvider>
  );
}

function UsersContent() {
  const { state, refetch } = useUsers();

  if (state.loading && !state.data) {
    return <div>Loading users...</div>;
  }

  if (state.error) {
    return (
      <div>
        <p>Error: {state.error}</p>
        <button onClick={refetch}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      <div className="header">
        <h2>Users ({state.data?.length || 0})</h2>
        <button onClick={refetch} disabled={state.loading}>
          {state.loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="users-list">
        {state.data?.map((user) => (
          <div key={user.id} className="user-item">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Provider Pattern for Feature Modules

### Feature-Based Provider

```tsx
interface FeatureConfig {
  enableDarkMode: boolean;
  enableNotifications: boolean;
  enableAnalytics: boolean;
  maxFileUpload: number;
  apiEndpoint: string;
}

interface FeatureContextType {
  config: FeatureConfig;
  isFeatureEnabled: (feature: keyof FeatureConfig) => boolean;
  updateConfig: (updates: Partial<FeatureConfig>) => void;
}

const defaultConfig: FeatureConfig = {
  enableDarkMode: true,
  enableNotifications: true,
  enableAnalytics: false,
  maxFileUpload: 10 * 1024 * 1024, // 10MB
  apiEndpoint: "/api",
};

const FeatureContext = createContext<FeatureContextType | null>(null);

export function useFeatures() {
  const context = useContext(FeatureContext);
  if (!context) {
    throw new Error("useFeatures must be used within FeatureProvider");
  }
  return context;
}

interface FeatureProviderProps {
  children: ReactNode;
  initialConfig?: Partial<FeatureConfig>;
}

export function FeatureProvider({
  children,
  initialConfig,
}: FeatureProviderProps) {
  const [config, setConfig] = useState<FeatureConfig>({
    ...defaultConfig,
    ...initialConfig,
  });

  const isFeatureEnabled = useCallback(
    (feature: keyof FeatureConfig) => {
      return Boolean(config[feature]);
    },
    [config]
  );

  const updateConfig = useCallback((updates: Partial<FeatureConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  useEffect(() => {
    const fetchRemoteConfig = async () => {
      try {
        const response = await fetch("/api/config");
        const remoteConfig = await response.json();
        setConfig((prev) => ({ ...prev, ...remoteConfig }));
      } catch (error) {
        console.warn("Failed to fetch remote config:", error);
      }
    };

    fetchRemoteConfig();
  }, []);

  const value: FeatureContextType = {
    config,
    isFeatureEnabled,
    updateConfig,
  };

  return (
    <FeatureContext.Provider value={value}>{children}</FeatureContext.Provider>
  );
}

function ConditionalFeature({
  feature,
  children,
  fallback = null,
}: {
  feature: keyof FeatureConfig;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { isFeatureEnabled } = useFeatures();

  return isFeatureEnabled(feature) ? <>{children}</> : <>{fallback}</>;
}

function AppHeader() {
  const { isFeatureEnabled } = useFeatures();

  return (
    <header className="app-header">
      <div className="logo">My App</div>

      <nav>
        <a href="/home">Home</a>
        <a href="/about">About</a>

        <ConditionalFeature feature="enableNotifications">
          <a href="/notifications">Notifications</a>
        </ConditionalFeature>
      </nav>

      <ConditionalFeature feature="enableDarkMode">
        <ThemeToggle />
      </ConditionalFeature>
    </header>
  );
}

function FileUpload() {
  const { config } = useFeatures();

  const handleFileSelect = (file: File) => {
    if (file.size > config.maxFileUpload) {
      alert(`File size exceeds ${config.maxFileUpload / 1024 / 1024}MB limit`);
      return;
    }

    // Handle file upload
  };

  return (
    <div className="file-upload">
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
      />
      <p>Maximum file size: {config.maxFileUpload / 1024 / 1024}MB</p>
    </div>
  );
}
```

## Error Boundary Provider

```tsx
interface ErrorInfo {
  error: Error;
  errorInfo: React.ErrorInfo;
  timestamp: number;
  userId?: string;
  pathname: string;
}

interface ErrorContextType {
  errors: ErrorInfo[];
  clearErrors: () => void;
  reportError: (error: Error, errorInfo?: React.ErrorInfo) => void;
}

const ErrorContext = createContext<ErrorContextType | null>(null);

export function useErrorHandler() {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useErrorHandler must be used within ErrorProvider");
  }
  return context;
}

interface ErrorProviderProps {
  children: ReactNode;
  onError?: (error: ErrorInfo) => void;
  maxErrors?: number;
}

export function ErrorProvider({
  children,
  onError,
  maxErrors = 10,
}: ErrorProviderProps) {
  const [errors, setErrors] = useState<ErrorInfo[]>([]);

  const reportError = useCallback(
    (error: Error, errorInfo?: React.ErrorInfo) => {
      const errorReport: ErrorInfo = {
        error,
        errorInfo: errorInfo || { componentStack: "" },
        timestamp: Date.now(),
        userId: getCurrentUserId(),
        pathname: window.location.pathname,
      };

      setErrors((prev) => {
        const newErrors = [errorReport, ...prev].slice(0, maxErrors);
        return newErrors;
      });

      onError?.(errorReport);

      console.error("Error caught by ErrorProvider:", error, errorInfo);
    },
    [onError, maxErrors]
  );

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const value: ErrorContextType = {
    errors,
    clearErrors,
    reportError,
  };

  return (
    <ErrorContext.Provider value={value}>
      <ErrorBoundary onError={reportError}>{children}</ErrorBoundary>
    </ErrorContext.Provider>
  );
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  {
    children: ReactNode;
    onError: (error: Error, errorInfo: React.ErrorInfo) => void;
  },
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <p>We're sorry, but something unexpected happened.</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
          <details>
            <summary>Error details</summary>
            <pre>{this.state.error?.stack}</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

function ErrorDisplay() {
  const { errors, clearErrors } = useErrorHandler();

  if (errors.length === 0) return null;

  return (
    <div className="error-display">
      <div className="error-header">
        <h3>Recent Errors ({errors.length})</h3>
        <button onClick={clearErrors}>Clear All</button>
      </div>

      <div className="error-list">
        {errors.map((errorInfo, index) => (
          <div key={index} className="error-item">
            <div className="error-message">{errorInfo.error.message}</div>
            <div className="error-meta">
              <span>{new Date(errorInfo.timestamp).toLocaleString()}</span>
              <span>{errorInfo.pathname}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getCurrentUserId(): string | undefined {
  return localStorage.getItem("userId") || undefined;
}
```

## Testing Provider Patterns

### Provider Testing Utilities

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react";

function createTestWrapper(
  providers: React.ComponentType<{ children: ReactNode }>[]
) {
  return ({ children }: { children: ReactNode }) => {
    return providers.reduceRight(
      (acc, Provider) => <Provider>{acc}</Provider>,
      children
    );
  };
}

function renderWithProviders(
  ui: React.ReactElement,
  providers: React.ComponentType<{ children: ReactNode }>[] = []
) {
  const Wrapper = createTestWrapper(providers);
  return render(ui, { wrapper: Wrapper });
}

describe("AuthProvider", () => {
  const TestComponent = () => {
    const { user, login, logout, isLoading, error } = useAuth();

    return (
      <div>
        <div data-testid="user">{user?.name || "Not logged in"}</div>
        <div data-testid="loading">{isLoading ? "Loading" : "Not loading"}</div>
        <div data-testid="error">{error || "No error"}</div>
        <button onClick={() => login("test@example.com", "password")}>
          Login
        </button>
        <button onClick={logout}>Logout</button>
      </div>
    );
  };

  beforeEach(() => {
    global.fetch = jest.fn();
    localStorage.clear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should handle successful login", async () => {
    const mockUser = {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "user" as const,
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ user: mockUser, token: "fake-token" }),
    });

    renderWithProviders(<TestComponent />, [AuthProvider]);

    expect(screen.getByTestId("user")).toHaveTextContent("Not logged in");
    expect(screen.getByTestId("loading")).toHaveTextContent("Not loading");

    fireEvent.click(screen.getByText("Login"));

    expect(screen.getByTestId("loading")).toHaveTextContent("Loading");

    await waitFor(() => {
      expect(screen.getByTestId("user")).toHaveTextContent("John Doe");
      expect(screen.getByTestId("loading")).toHaveTextContent("Not loading");
    });

    expect(localStorage.getItem("token")).toBe("fake-token");
  });

  it("should handle login failure", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    renderWithProviders(<TestComponent />, [AuthProvider]);

    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(screen.getByTestId("error")).toHaveTextContent(
        "Invalid credentials"
      );
      expect(screen.getByTestId("loading")).toHaveTextContent("Not loading");
    });
  });

  it("should handle logout", async () => {
    const mockUser = {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "user" as const,
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ user: mockUser, token: "fake-token" }),
    });

    renderWithProviders(<TestComponent />, [AuthProvider]);

    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(screen.getByTestId("user")).toHaveTextContent("John Doe");
    });

    fireEvent.click(screen.getByText("Logout"));

    expect(screen.getByTestId("user")).toHaveTextContent("Not logged in");
    expect(localStorage.getItem("token")).toBeNull();
  });
});

describe("ThemeProvider", () => {
  it("should toggle theme mode", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.theme.mode).toBe("light");

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme.mode).toBe("dark");
  });

  it("should update theme properties", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    act(() => {
      result.current.setTheme({ primaryColor: "#ff0000" });
    });

    expect(result.current.theme.primaryColor).toBe("#ff0000");
  });

  it("should reset theme to default", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    act(() => {
      result.current.setTheme({ primaryColor: "#ff0000", mode: "dark" });
    });

    act(() => {
      result.current.resetTheme();
    });

    expect(result.current.theme.primaryColor).toBe("#3b82f6");
    expect(result.current.theme.mode).toBe("light");
  });
});

describe("AppProvider (useReducer)", () => {
  it("should add items to cart", () => {
    const TestComponent = () => {
      const { state, actions } = useApp();

      const product = {
        id: "1",
        name: "Test Product",
        price: 10.99,
        description: "A test product",
      };

      return (
        <div>
          <div data-testid="cart-count">{state.cart.length}</div>
          <button onClick={() => actions.addToCart(product)}>
            Add to Cart
          </button>
        </div>
      );
    };

    renderWithProviders(<TestComponent />, [AppProvider]);

    expect(screen.getByTestId("cart-count")).toHaveTextContent("0");

    fireEvent.click(screen.getByText("Add to Cart"));

    expect(screen.getByTestId("cart-count")).toHaveTextContent("1");
  });
});
```

## Best Practices

### Provider Pattern Guidelines

1. **Single Responsibility**: Each provider should handle one specific concern (auth, theme, etc.).

2. **Error Boundaries**: Always wrap providers with error boundaries to prevent crashes.

3. **Performance Optimization**: Use useMemo and useCallback to prevent unnecessary re-renders.

4. **Type Safety**: Always provide proper TypeScript types for context values.

5. **Testing**: Create test utilities for easy provider testing.

### Performance Optimization

```tsx
function OptimizedProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(initialState);

  const contextValue = useMemo(
    () => ({
      state,
      actions: {
        updateUser: (user: User) => setState((prev) => ({ ...prev, user })),
        clearUser: () => setState((prev) => ({ ...prev, user: null })),
      },
    }),
    [state]
  );

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}

const MemoizedChildComponent = React.memo(ChildComponent);

function ParentComponent() {
  const { state } = useContext();

  return (
    <div>
      <MemoizedChildComponent user={state.user} />
    </div>
  );
}
```

## Interview Questions

**Q: When should you use Context API vs other state management solutions?**

A: Use Context API for application-wide state that doesn't change frequently (theme, auth, user preferences). For complex state with frequent updates, consider Redux, Zustand, or other specialized libraries.

**Q: How do you prevent unnecessary re-renders in Context consumers?**

A: Use React.memo for components, split contexts by update frequency, use useMemo for context values, and consider using separate contexts for different pieces of state.

**Q: What's the difference between Provider pattern and prop drilling?**

A: Provider pattern uses React Context to share data across component trees without passing props through intermediate components. Prop drilling passes data through every level of the component tree.

**Q: How do you handle loading states in providers?**

A: Include loading state in your context, use async actions with try/catch blocks, provide loading indicators in UI components, and consider implementing global loading management.

**Q: What are the performance implications of Context API?**

A: Context API can cause re-renders of all consuming components when context value changes. Optimize by splitting contexts, memoizing values, and using React.memo for components.

The Provider Pattern is essential for managing application-wide state and avoiding prop drilling while maintaining clean, maintainable code architecture.
