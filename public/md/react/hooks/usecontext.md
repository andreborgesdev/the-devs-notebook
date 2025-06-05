# useContext Hook

## Overview

The `useContext` hook provides a way to consume context values in functional components without wrapping them in a Consumer component. It's essential for sharing state across multiple components without prop drilling.

## Basic Setup

### Creating Context

```javascript
import React, { createContext, useContext, useState } from "react";

// Create the context
const ThemeContext = createContext();

// Provider component
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const value = {
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// Custom hook for using the context
function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// Usage in component
function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header style={{ backgroundColor: theme === "light" ? "#fff" : "#333" }}>
      <button onClick={toggleTheme}>
        Switch to {theme === "light" ? "dark" : "light"} theme
      </button>
    </header>
  );
}

// App component
function App() {
  return (
    <ThemeProvider>
      <Header />
    </ThemeProvider>
  );
}
```

## Authentication Context Example

```javascript
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem("token");
    if (token) {
      validateToken(token)
        .then((userData) => setUser(userData))
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const { token, user } = await response.json();
        localStorage.setItem("token", token);
        setUser(user);
        return { success: true };
      } else {
        return { success: false, error: "Invalid credentials" };
      }
    } catch (error) {
      return { success: false, error: "Network error" };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Usage
function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
      {error && <div className="error">{error}</div>}
      <button type="submit">Login</button>
    </form>
  );
}

function UserProfile() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h2>Welcome, {user.name}!</h2>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <LoginForm />;
}
```

## Shopping Cart Context

```javascript
const CartContext = createContext();

function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = (product) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeItem = (productId) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isOpen,
    setIsOpen,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

// Usage components
function ProductCard({ product }) {
  const { addItem } = useCart();

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={() => addItem(product)}>Add to Cart</button>
    </div>
  );
}

function CartIcon() {
  const { totalItems, setIsOpen } = useCart();

  return <button onClick={() => setIsOpen(true)}>Cart ({totalItems})</button>;
}

function CartDrawer() {
  const { items, updateQuantity, removeItem, totalPrice, isOpen, setIsOpen } =
    useCart();

  if (!isOpen) return null;

  return (
    <div className="cart-drawer">
      <button onClick={() => setIsOpen(false)}>Close</button>
      {items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <span>{item.name}</span>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(item.id, parseInt(e.target.value))
                }
                min="1"
              />
              <span>${item.price * item.quantity}</span>
              <button onClick={() => removeItem(item.id)}>Remove</button>
            </div>
          ))}
          <div>Total: ${totalPrice.toFixed(2)}</div>
        </>
      )}
    </div>
  );
}
```

## Multiple Contexts

```javascript
// Language context
const LanguageContext = createContext();

function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");

  const translations = {
    en: { welcome: "Welcome", goodbye: "Goodbye" },
    es: { welcome: "Bienvenido", goodbye: "Adiós" },
    fr: { welcome: "Bienvenue", goodbye: "Au revoir" },
  };

  const value = {
    language,
    setLanguage,
    t: (key) => translations[language][key] || key,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

// Settings context
const SettingsContext = createContext();

function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    notifications: true,
    autoSave: false,
    theme: "auto",
  });

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const value = {
    settings,
    updateSetting,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}

// App with multiple providers
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <SettingsProvider>
            <CartProvider>
              <Router>
                <Layout />
              </Router>
            </CartProvider>
          </SettingsProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

// Component using multiple contexts
function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { totalItems } = useCart();

  return (
    <header>
      <h1>{t("welcome")}</h1>
      {user && <span>Hello, {user.name}</span>}
      <CartIcon />
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="fr">Français</option>
      </select>
      <button onClick={toggleTheme}>Toggle Theme</button>
      {user && <button onClick={logout}>Logout</button>}
    </header>
  );
}
```

## Context with Reducer

```javascript
import { useReducer, createContext, useContext } from "react";

// Actions
const TODO_ACTIONS = {
  ADD_TODO: "ADD_TODO",
  TOGGLE_TODO: "TOGGLE_TODO",
  DELETE_TODO: "DELETE_TODO",
  SET_FILTER: "SET_FILTER",
};

// Reducer
function todoReducer(state, action) {
  switch (action.type) {
    case TODO_ACTIONS.ADD_TODO:
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

    case TODO_ACTIONS.TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      };

    case TODO_ACTIONS.DELETE_TODO:
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };

    case TODO_ACTIONS.SET_FILTER:
      return {
        ...state,
        filter: action.payload,
      };

    default:
      return state;
  }
}

// Context
const TodoContext = createContext();

function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(todoReducer, {
    todos: [],
    filter: "all",
  });

  const addTodo = (text) => {
    dispatch({ type: TODO_ACTIONS.ADD_TODO, payload: text });
  };

  const toggleTodo = (id) => {
    dispatch({ type: TODO_ACTIONS.TOGGLE_TODO, payload: id });
  };

  const deleteTodo = (id) => {
    dispatch({ type: TODO_ACTIONS.DELETE_TODO, payload: id });
  };

  const setFilter = (filter) => {
    dispatch({ type: TODO_ACTIONS.SET_FILTER, payload: filter });
  };

  const filteredTodos = state.todos.filter((todo) => {
    switch (state.filter) {
      case "active":
        return !todo.completed;
      case "completed":
        return todo.completed;
      default:
        return true;
    }
  });

  const value = {
    todos: filteredTodos,
    filter: state.filter,
    addTodo,
    toggleTodo,
    deleteTodo,
    setFilter,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

function useTodos() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodos must be used within a TodoProvider");
  }
  return context;
}
```

## Best Practices

### Custom Hook Pattern

```javascript
// ✅ Always create custom hooks for context
function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// ❌ Don't use useContext directly in components
function Component() {
  const theme = useContext(ThemeContext); // Avoid this
  return <div>{theme.value}</div>;
}
```

### Context Composition

```javascript
// ✅ Compose providers at app level
function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>{children}</LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

function App() {
  return (
    <AppProviders>
      <Router />
    </AppProviders>
  );
}
```

### Split Contexts by Concern

```javascript
// ✅ Separate contexts for different concerns
const UserContext = createContext(); // User data
const PreferencesContext = createContext(); // User preferences
const CartContext = createContext(); // Shopping cart

// ❌ Don't put everything in one context
const AppContext = createContext(); // Too broad
```

## Interview Questions

### Q: When should you use Context vs Props?

| Use Context                    | Use Props                  |
| ------------------------------ | -------------------------- |
| Data needed by many components | Parent-child communication |
| Avoiding prop drilling         | Simple data passing        |
| Global app state               | Component-specific data    |
| Theme, auth, language          | Event handlers, callbacks  |

### Q: What are the performance implications of Context?

- All consumers re-render when context value changes
- Use multiple contexts to minimize re-renders
- Memoize context values when appropriate
- Consider splitting read/write contexts

### Q: How do you avoid unnecessary re-renders?

```javascript
// ✅ Memoize the context value
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  const value = useMemo(
    () => ({
      theme,
      setTheme,
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
```

## Common Mistakes

### Forgetting Provider

```javascript
// ❌ Using context without provider
function App() {
  return <Component />; // ThemeContext will be undefined
}

// ✅ Wrap with provider
function App() {
  return (
    <ThemeProvider>
      <Component />
    </ThemeProvider>
  );
}
```

### Creating New Objects in Render

```javascript
// ❌ Creates new object on every render
function Provider({ children }) {
  const [user, setUser] = useState(null);

  return (
    <Context.Provider value={{ user, setUser }}>{children}</Context.Provider>
  );
}

// ✅ Memoize the value
function Provider({ children }) {
  const [user, setUser] = useState(null);

  const value = useMemo(() => ({ user, setUser }), [user]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
```

## TypeScript Usage

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const login = async (email: string, password: string): Promise<void> => {
    // Implementation
  };

  const logout = (): void => {
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
```

## Performance Optimization

### Split Context by Update Frequency

```javascript
// Separate frequently changing data
const UserDataContext = createContext();
const UserActionsContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  // Actions don't change, data might
  const actions = useMemo(
    () => ({
      updateUser: (updates) => setUser((prev) => ({ ...prev, ...updates })),
      logout: () => setUser(null),
    }),
    []
  );

  return (
    <UserActionsContext.Provider value={actions}>
      <UserDataContext.Provider value={user}>
        {children}
      </UserDataContext.Provider>
    </UserActionsContext.Provider>
  );
}
```

### Use React.memo with Context

```javascript
const ExpensiveComponent = React.memo(({ data }) => {
  // Expensive computation
  return <div>{data}</div>;
});

function Parent() {
  const { expensiveData } = useContext(SomeContext);

  return <ExpensiveComponent data={expensiveData} />;
}
```
