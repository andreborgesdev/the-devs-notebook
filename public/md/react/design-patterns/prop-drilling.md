# React Prop Drilling Solutions

Prop drilling occurs when data needs to be passed through multiple component layers to reach components that actually need it. This creates maintenance challenges and tightly couples components. Here are various solutions to avoid prop drilling.

## Understanding Prop Drilling

### Example of Prop Drilling Problem

```tsx
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

interface Theme {
  mode: "light" | "dark";
  primaryColor: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<Theme>({
    mode: "light",
    primaryColor: "#007bff",
  });

  return (
    <Layout
      user={user}
      theme={theme}
      onThemeChange={setTheme}
      onUserUpdate={setUser}
    />
  );
}

function Layout({
  user,
  theme,
  onThemeChange,
  onUserUpdate,
}: {
  user: User | null;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  onUserUpdate: (user: User | null) => void;
}) {
  return (
    <div className={`layout ${theme.mode}`}>
      <Header user={user} theme={theme} onThemeChange={onThemeChange} />
      <main>
        <Dashboard user={user} theme={theme} onUserUpdate={onUserUpdate} />
      </main>
    </div>
  );
}

function Header({
  user,
  theme,
  onThemeChange,
}: {
  user: User | null;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}) {
  return (
    <header>
      <Navigation user={user} />
      <ThemeToggle theme={theme} onThemeChange={onThemeChange} />
    </header>
  );
}

function Navigation({ user }: { user: User | null }) {
  if (!user) return <LoginButton />;

  return (
    <nav>
      <span>Welcome, {user.name}</span>
      <UserMenu user={user} />
    </nav>
  );
}

function UserMenu({ user }: { user: User | null }) {
  if (!user) return null;

  return (
    <div className="user-menu">
      <ProfileLink user={user} />
      <SettingsLink user={user} />
    </div>
  );
}
```

## Solution 1: Context API

### Basic Context Implementation

```tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface AppContextType {
  user: User | null;
  theme: Theme;
  updateUser: (user: User | null) => void;
  updateTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<Theme>({
    mode: "light",
    primaryColor: "#007bff",
  });

  const updateUser = useCallback((newUser: User | null) => {
    setUser(newUser);
  }, []);

  const updateTheme = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => ({
      ...prev,
      mode: prev.mode === "light" ? "dark" : "light",
    }));
  }, []);

  const value = useMemo(
    () => ({
      user,
      theme,
      updateUser,
      updateTheme,
      toggleTheme,
    }),
    [user, theme, updateUser, updateTheme, toggleTheme]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function App() {
  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  );
}

function Layout() {
  const { theme } = useAppContext();

  return (
    <div className={`layout ${theme.mode}`}>
      <Header />
      <main>
        <Dashboard />
      </main>
    </div>
  );
}

function Header() {
  return (
    <header>
      <Navigation />
      <ThemeToggle />
    </header>
  );
}

function Navigation() {
  const { user } = useAppContext();

  if (!user) return <LoginButton />;

  return (
    <nav>
      <span>Welcome, {user.name}</span>
      <UserMenu />
    </nav>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useAppContext();

  return (
    <button onClick={toggleTheme}>
      {theme.mode === "light" ? "🌙" : "☀️"}
    </button>
  );
}
```

## Solution 2: Multiple Specialized Contexts

### Splitting Contexts by Concern

```tsx
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Login failed");

      const userData = await response.json();
      setUser(userData.user);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("authToken");
  }, []);

  const updateProfile = useCallback((updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      updateProfile,
      isLoading,
    }),
    [user, login, logout, updateProfile, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

interface ThemeContextType {
  theme: Theme;
  updateTheme: (theme: Partial<Theme>) => void;
  toggleMode: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>({
    mode: "light",
    primaryColor: "#007bff",
  });

  const updateTheme = useCallback((updates: Partial<Theme>) => {
    setTheme((prev) => ({ ...prev, ...updates }));
  }, []);

  const toggleMode = useCallback(() => {
    setTheme((prev) => ({
      ...prev,
      mode: prev.mode === "light" ? "dark" : "light",
    }));
  }, []);

  const isDark = theme.mode === "dark";

  const value = useMemo(
    () => ({
      theme,
      updateTheme,
      toggleMode,
      isDark,
    }),
    [theme, updateTheme, toggleMode, isDark]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </ThemeProvider>
  );
}

function UserProfile() {
  const { user, updateProfile } = useAuth();
  const { theme } = useTheme();

  if (!user) return null;

  return (
    <div
      className="user-profile"
      style={{ backgroundColor: theme.primaryColor }}
    >
      <h2>{user.name}</h2>
      <button onClick={() => updateProfile({ name: "Updated Name" })}>
        Update Name
      </button>
    </div>
  );
}
```

## Solution 3: Component Composition

### Using Children and Render Props

```tsx
interface DataProviderProps<T> {
  data: T;
  children: React.ReactNode;
}

function DataProvider<T>({ data, children }: DataProviderProps<T>) {
  return <div data-context={JSON.stringify(data)}>{children}</div>;
}

interface WithDataProps<T> {
  children: (data: T) => React.ReactNode;
  fallback?: React.ReactNode;
}

function WithData<T>({ children, fallback }: WithDataProps<T>) {
  const dataElement = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    const element = dataElement.current?.closest("[data-context]");
    if (element) {
      try {
        const contextData = JSON.parse(
          element.getAttribute("data-context") || ""
        );
        setData(contextData);
      } catch {
        setData(null);
      }
    }
  }, []);

  return <div ref={dataElement}>{data ? children(data) : fallback}</div>;
}

function UserDashboard() {
  const [user] = useState<User>({
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
  });

  return (
    <DataProvider data={user}>
      <div className="dashboard">
        <Sidebar />
        <MainContent />
      </div>
    </DataProvider>
  );
}

function Sidebar() {
  return (
    <aside>
      <WithData<User>>
        {(user) => (
          <div>
            <h3>Welcome, {user.name}</h3>
            <UserMenu user={user} />
          </div>
        )}
      </WithData>
    </aside>
  );
}

function MainContent() {
  return (
    <main>
      <WithData<User>>
        {(user) => (
          <div>
            <h1>Dashboard for {user.name}</h1>
            <UserStats user={user} />
          </div>
        )}
      </WithData>
    </main>
  );
}
```

## Solution 4: State Management Libraries

### Using Zustand

```tsx
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AppStore {
  user: User | null;
  theme: Theme;
  notifications: Notification[];

  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
}

const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        theme: { mode: "light", primaryColor: "#007bff" },
        notifications: [],

        setUser: (user) => set({ user }, false, "setUser"),

        updateUser: (updates) =>
          set(
            (state) => ({
              user: state.user ? { ...state.user, ...updates } : null,
            }),
            false,
            "updateUser"
          ),

        setTheme: (theme) => set({ theme }, false, "setTheme"),

        toggleTheme: () =>
          set(
            (state) => ({
              theme: {
                ...state.theme,
                mode: state.theme.mode === "light" ? "dark" : "light",
              },
            }),
            false,
            "toggleTheme"
          ),

        addNotification: (notification) =>
          set(
            (state) => ({
              notifications: [
                ...state.notifications,
                { ...notification, id: Date.now().toString() },
              ],
            }),
            false,
            "addNotification"
          ),

        removeNotification: (id) =>
          set(
            (state) => ({
              notifications: state.notifications.filter((n) => n.id !== id),
            }),
            false,
            "removeNotification"
          ),
      }),
      {
        name: "app-storage",
        partialize: (state) => ({
          theme: state.theme,
          user: state.user,
        }),
      }
    )
  )
);

function UserProfile() {
  const { user, updateUser } = useAppStore((state) => ({
    user: state.user,
    updateUser: state.updateUser,
  }));

  if (!user) return <div>Please log in</div>;

  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <button onClick={() => updateUser({ name: "Updated Name" })}>
        Update Profile
      </button>
    </div>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useAppStore((state) => ({
    theme: state.theme,
    toggleTheme: state.toggleTheme,
  }));

  return <button onClick={toggleTheme}>Current theme: {theme.mode}</button>;
}

function NotificationCenter() {
  const { notifications, removeNotification } = useAppStore((state) => ({
    notifications: state.notifications,
    removeNotification: state.removeNotification,
  }));

  return (
    <div className="notification-center">
      {notifications.map((notification) => (
        <div key={notification.id} className="notification">
          <p>{notification.message}</p>
          <button onClick={() => removeNotification(notification.id)}>
            Dismiss
          </button>
        </div>
      ))}
    </div>
  );
}
```

## Solution 5: Custom Hooks

### Extracting Logic into Hooks

```tsx
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue] as const;
}

function useAuth() {
  const [user, setUser] = useLocalStorage<User | null>("user", null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) throw new Error("Login failed");

        const data = await response.json();
        setUser(data.user);
        return data.user;
      } finally {
        setIsLoading(false);
      }
    },
    [setUser]
  );

  const logout = useCallback(() => {
    setUser(null);
  }, [setUser]);

  const updateProfile = useCallback(
    (updates: Partial<User>) => {
      setUser((prev) => (prev ? { ...prev, ...updates } : null));
    },
    [setUser]
  );

  return {
    user,
    isLoading,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };
}

function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>("theme", {
    mode: "light",
    primaryColor: "#007bff",
  });

  const updateTheme = useCallback(
    (updates: Partial<Theme>) => {
      setTheme((prev) => ({ ...prev, ...updates }));
    },
    [setTheme]
  );

  const toggleMode = useCallback(() => {
    setTheme((prev) => ({
      ...prev,
      mode: prev.mode === "light" ? "dark" : "light",
    }));
  }, [setTheme]);

  return {
    theme,
    updateTheme,
    toggleMode,
    isDark: theme.mode === "dark",
  };
}

function UserProfile() {
  const { user, updateProfile, isAuthenticated } = useAuth();
  const { theme } = useTheme();

  if (!isAuthenticated) {
    return <div>Please log in to view your profile</div>;
  }

  return (
    <div
      className="user-profile"
      style={{
        backgroundColor: theme.mode === "dark" ? "#333" : "#fff",
        color: theme.mode === "dark" ? "#fff" : "#333",
      }}
    >
      <h2>{user?.name}</h2>
      <p>{user?.email}</p>
      <button onClick={() => updateProfile({ name: "Updated Name" })}>
        Update Profile
      </button>
    </div>
  );
}

function ThemeToggle() {
  const { theme, toggleMode } = useTheme();

  return (
    <button onClick={toggleMode}>
      {theme.mode === "light" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}

function App() {
  return (
    <div className="app">
      <header>
        <ThemeToggle />
      </header>
      <main>
        <UserProfile />
      </main>
    </div>
  );
}
```

## Solution 6: Event-Driven Architecture

### Using Event Emitters

```tsx
class EventEmitter {
  private events: { [key: string]: Function[] } = {};

  on(event: string, callback: Function) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  off(event: string, callback: Function) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter((cb) => cb !== callback);
    }
  }

  emit(event: string, data?: any) {
    if (this.events[event]) {
      this.events[event].forEach((callback) => callback(data));
    }
  }
}

const globalEvents = new EventEmitter();

function useEventListener(event: string, handler: Function) {
  useEffect(() => {
    globalEvents.on(event, handler);
    return () => globalEvents.off(event, handler);
  }, [event, handler]);
}

function useEventEmitter() {
  return {
    emit: globalEvents.emit.bind(globalEvents),
    on: globalEvents.on.bind(globalEvents),
    off: globalEvents.off.bind(globalEvents),
  };
}

function UserLogin() {
  const { emit } = useEventEmitter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Login failed");

      const data = await response.json();
      emit("user:login", data.user);
      emit("notification:success", "Login successful!");
    } catch (error) {
      emit("notification:error", "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        handleLogin(
          formData.get("email") as string,
          formData.get("password") as string
        );
      }}
    >
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}

function UserProfile() {
  const [user, setUser] = useState<User | null>(null);

  useEventListener("user:login", (userData: User) => {
    setUser(userData);
  });

  useEventListener("user:logout", () => {
    setUser(null);
  });

  if (!user) {
    return <div>Please log in</div>;
  }

  return (
    <div className="user-profile">
      <h2>Welcome, {user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}

function NotificationCenter() {
  const [notifications, setNotifications] = useState<
    Array<{
      id: string;
      type: "success" | "error";
      message: string;
    }>
  >([]);

  useEventListener("notification:success", (message: string) => {
    const notification = {
      id: Date.now().toString(),
      type: "success" as const,
      message,
    };
    setNotifications((prev) => [...prev, notification]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    }, 5000);
  });

  useEventListener("notification:error", (message: string) => {
    const notification = {
      id: Date.now().toString(),
      type: "error" as const,
      message,
    };
    setNotifications((prev) => [...prev, notification]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    }, 5000);
  });

  return (
    <div className="notification-center">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification ${notification.type}`}
        >
          {notification.message}
        </div>
      ))}
    </div>
  );
}
```

## Performance Considerations

### Optimizing Context Performance

```tsx
interface UserContextType {
  user: User | null;
  updateUser: (user: User | null) => void;
}

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const UserContext = createContext<UserContextType | null>(null);
const ThemeContext = createContext<ThemeContextType | null>(null);

function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const updateUser = useCallback((newUser: User | null) => {
    setUser(newUser);
  }, []);

  const value = useMemo(
    () => ({
      user,
      updateUser,
    }),
    [user, updateUser]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>({
    mode: "light",
    primaryColor: "#007bff",
  });

  const toggleTheme = useCallback(() => {
    setTheme((prev) => ({
      ...prev,
      mode: prev.mode === "light" ? "dark" : "light",
    }));
  }, []);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
    }),
    [theme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

const UserConsumer = React.memo(
  ({ children }: { children: (user: User | null) => ReactNode }) => {
    const { user } = useContext(UserContext)!;
    return <>{children(user)}</>;
  }
);

const ThemeConsumer = React.memo(
  ({ children }: { children: (theme: Theme) => ReactNode }) => {
    const { theme } = useContext(ThemeContext)!;
    return <>{children(theme)}</>;
  }
);
```

## Best Practices

### Choosing the Right Solution

1. **Context API**: Best for global state that doesn't change frequently (theme, auth, language).

2. **Custom Hooks**: Ideal for reusable stateful logic that can be shared across components.

3. **State Management Libraries**: Use for complex state requirements with many interdependencies.

4. **Component Composition**: Great for passing data through a few levels with flexible component structures.

5. **Event-Driven**: Suitable for loosely coupled components that need to communicate across the app.

### Performance Guidelines

```tsx
function OptimizedComponent() {
  const { user } = useAuth();
  const { theme } = useTheme();

  const memoizedUser = useMemo(() => user, [user?.id, user?.name]);

  const handleUserUpdate = useCallback((updates: Partial<User>) => {
    console.log("Updating user:", updates);
  }, []);

  return (
    <MemoizedUserCard
      user={memoizedUser}
      theme={theme}
      onUpdate={handleUserUpdate}
    />
  );
}

const MemoizedUserCard = React.memo<{
  user: User | null;
  theme: Theme;
  onUpdate: (updates: Partial<User>) => void;
}>(({ user, theme, onUpdate }) => {
  if (!user) return null;

  return (
    <div style={{ backgroundColor: theme.primaryColor }}>
      <h3>{user.name}</h3>
      <button onClick={() => onUpdate({ name: "New Name" })}>Update</button>
    </div>
  );
});
```

## Interview Questions

**Q: What is prop drilling and why is it problematic?**
A: Prop drilling is passing data through multiple component layers to reach deeply nested components. It's problematic because it creates tight coupling, makes components harder to maintain, and requires intermediate components to know about data they don't use.

**Q: When should you use Context API vs custom hooks to solve prop drilling?**
A: Use Context API for global state that needs to be shared across many components (auth, theme). Use custom hooks for reusable stateful logic that can be encapsulated and shared. Custom hooks are more testable and don't cause re-render issues.

**Q: How can Context API cause performance issues and how do you prevent them?**
A: Context causes all consuming components to re-render when context value changes. Prevent by splitting contexts by concern, memoizing context values, and using React.memo for components that consume context.

**Q: What are the trade-offs between different prop drilling solutions?**
A: Context API is simple but can cause performance issues. State management libraries add complexity but handle complex state well. Custom hooks are testable and performant but require more setup. Component composition is flexible but limited to nearby components.

**Q: How do you decide between local state, Context, and external state management?**
A: Use local state for component-specific data, Context for global but simple state (theme, auth), and external state management for complex state with many interdependencies, frequent updates, or advanced features like time travel debugging.

These solutions provide various approaches to avoid prop drilling, each with specific use cases and trade-offs. Choose based on your application's complexity, performance requirements, and maintainability needs.
