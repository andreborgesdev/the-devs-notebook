# React Design Patterns

React design patterns are reusable solutions to common problems in React application development. These patterns help create maintainable, scalable, and efficient applications by establishing proven architectural approaches.

## Core Design Patterns

### Container-Presenter Pattern

Separates business logic from presentation logic by creating container components that handle data and state, while presenter components focus purely on rendering.

```tsx
// Container Component
const UserListContainer: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  return <UserList users={users} loading={loading} />;
};

// Presenter Component
interface UserListProps {
  users: User[];
  loading: boolean;
}

const UserList: React.FC<UserListProps> = ({ users, loading }) => {
  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
};
```

### Provider Pattern

Uses React Context to share data across multiple components without prop drilling, creating a centralized state management solution.

```tsx
interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
```

### Composition Pattern

Builds complex UIs by combining simpler components, promoting reusability and flexibility over inheritance.

```tsx
interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`card ${className}`}>{children}</div>
);

const CardHeader: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="card-header">{children}</div>
);

const CardBody: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="card-body">{children}</div>
);

const CardFooter: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="card-footer">{children}</div>
);

// Usage
const ProfileCard = () => (
  <Card>
    <CardHeader>
      <h2>User Profile</h2>
    </CardHeader>
    <CardBody>
      <UserInfo />
    </CardBody>
    <CardFooter>
      <ActionButtons />
    </CardFooter>
  </Card>
);
```

## Advanced Patterns

### Higher-Order Components (HOC)

Functions that take a component and return a new component with enhanced functionality.

```tsx
interface WithLoadingProps {
  loading: boolean;
}

function withLoading<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return (props: P & WithLoadingProps) => {
    const { loading, ...restProps } = props;

    if (loading) {
      return <LoadingSpinner />;
    }

    return <WrappedComponent {...(restProps as P)} />;
  };
}

// Usage
const UserListWithLoading = withLoading(UserList);
```

### Render Props Pattern

Shares code between components using a prop whose value is a function that returns JSX.

```tsx
interface MouseTrackerProps {
  children: (position: { x: number; y: number }) => ReactNode;
}

const MouseTracker: React.FC<MouseTrackerProps> = ({ children }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return <>{children(position)}</>;
};

// Usage
const App = () => (
  <MouseTracker>
    {({ x, y }) => (
      <div>
        Mouse position: {x}, {y}
      </div>
    )}
  </MouseTracker>
);
```

### Custom Hooks Pattern

Extracts component logic into reusable functions that can share stateful logic between components.

```tsx
interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useFetch<T>(url: string): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
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
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    };

    fetchData();
  }, [url]);

  return state;
}

// Usage
const UserProfile: React.FC<{ userId: string }> = ({ userId }) => {
  const { data: user, loading, error } = useFetch<User>(`/api/users/${userId}`);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!user) return <div>No user found</div>;

  return <UserDetails user={user} />;
};
```

## State Management Patterns

### Reducer Pattern

Uses useReducer for complex state logic with predictable state transitions.

```tsx
interface State {
  count: number;
  step: number;
}

type Action =
  | { type: "INCREMENT" }
  | { type: "DECREMENT" }
  | { type: "SET_STEP"; payload: number }
  | { type: "RESET" };

const initialState: State = { count: 0, step: 1 };

function counterReducer(state: State, action: Action): State {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, count: state.count + state.step };
    case "DECREMENT":
      return { ...state, count: state.count - state.step };
    case "SET_STEP":
      return { ...state, step: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

const Counter: React.FC = () => {
  const [state, dispatch] = useReducer(counterReducer, initialState);

  return (
    <div>
      <div>Count: {state.count}</div>
      <button onClick={() => dispatch({ type: "INCREMENT" })}>+</button>
      <button onClick={() => dispatch({ type: "DECREMENT" })}>-</button>
      <button onClick={() => dispatch({ type: "RESET" })}>Reset</button>
    </div>
  );
};
```

### Flux/Redux Pattern

Unidirectional data flow architecture for predictable state management.

```tsx
// Actions
interface IncrementAction {
  type: "INCREMENT";
  payload: number;
}

interface DecrementAction {
  type: "DECREMENT";
  payload: number;
}

type CounterAction = IncrementAction | DecrementAction;

// Action Creators
const increment = (amount: number): IncrementAction => ({
  type: "INCREMENT",
  payload: amount,
});

const decrement = (amount: number): DecrementAction => ({
  type: "DECREMENT",
  payload: amount,
});

// Reducer
interface CounterState {
  value: number;
}

const initialState: CounterState = { value: 0 };

function counterReducer(
  state = initialState,
  action: CounterAction
): CounterState {
  switch (action.type) {
    case "INCREMENT":
      return { value: state.value + action.payload };
    case "DECREMENT":
      return { value: state.value - action.payload };
    default:
      return state;
  }
}
```

## Performance Patterns

### Memoization Pattern

Optimizes performance by preventing unnecessary re-renders and recalculations.

```tsx
interface ExpensiveListProps {
  items: Item[];
  filter: string;
}

const ExpensiveList: React.FC<ExpensiveListProps> = ({ items, filter }) => {
  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);

  const expensiveValue = useMemo(() => {
    return filteredItems.reduce((sum, item) => sum + item.value, 0);
  }, [filteredItems]);

  return (
    <div>
      <div>Total Value: {expensiveValue}</div>
      {filteredItems.map((item) => (
        <ItemComponent key={item.id} item={item} />
      ))}
    </div>
  );
};

const ItemComponent = memo<{ item: Item }>(({ item }) => {
  return (
    <div>
      {item.name}: {item.value}
    </div>
  );
});
```

### Virtualization Pattern

Renders only visible items in large lists to improve performance.

```tsx
interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => ReactNode;
}

function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );

  const visibleItems = items.slice(startIndex, endIndex);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  return (
    <div
      style={{ height: containerHeight, overflow: "auto" }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

## Error Handling Patterns

### Error Boundary Pattern

Catches JavaScript errors in component tree and displays fallback UI.

```tsx
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div>
            <h2>Something went wrong.</h2>
            <details>{this.state.error?.message}</details>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// Usage
const App = () => (
  <ErrorBoundary fallback={<ErrorFallback />}>
    <Header />
    <MainContent />
    <Footer />
  </ErrorBoundary>
);
```

## Testing Patterns

### Component Testing Pattern

Structures components for testability and maintainability.

```tsx
// Testable Component
interface UserFormProps {
  onSubmit: (userData: UserData) => void;
  initialData?: UserData;
  loading?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({
  onSubmit,
  initialData,
  loading = false,
}) => {
  const [formData, setFormData] = useState<UserData>(
    initialData || { name: "", email: "" }
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} data-testid="user-form">
      <input
        data-testid="name-input"
        value={formData.name}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, name: e.target.value }))
        }
        disabled={loading}
      />
      <input
        data-testid="email-input"
        type="email"
        value={formData.email}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, email: e.target.value }))
        }
        disabled={loading}
      />
      <button type="submit" disabled={loading} data-testid="submit-button">
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

// Test
import { render, screen, fireEvent } from "@testing-library/react";

describe("UserForm", () => {
  it("should call onSubmit with form data", () => {
    const mockSubmit = jest.fn();
    render(<UserForm onSubmit={mockSubmit} />);

    fireEvent.change(screen.getByTestId("name-input"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByTestId("email-input"), {
      target: { value: "john@example.com" },
    });
    fireEvent.click(screen.getByTestId("submit-button"));

    expect(mockSubmit).toHaveBeenCalledWith({
      name: "John Doe",
      email: "john@example.com",
    });
  });
});
```

## Architectural Patterns

### Module Federation Pattern

Allows multiple React applications to share components and dependencies at runtime.

```tsx
// webpack.config.js (Host App)
const ModuleFederationPlugin = require("@module-federation/webpack");

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "host",
      remotes: {
        mfApp: "mfApp@http://localhost:3001/remoteEntry.js",
      },
    }),
  ],
};

// Component usage
const RemoteComponent = lazy(() => import("mfApp/Component"));

const App = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <RemoteComponent />
  </Suspense>
);
```

### Micro-Frontend Pattern

Breaks down frontend monoliths into smaller, manageable pieces.

```tsx
interface MicroFrontendProps {
  name: string;
  host: string;
  history: History;
}

const MicroFrontend: React.FC<MicroFrontendProps> = ({
  name,
  host,
  history,
}) => {
  useEffect(() => {
    const scriptId = `micro-frontend-script-${name}`;

    if (document.getElementById(scriptId)) {
      renderMicroFrontend();
      return;
    }

    fetch(`${host}/asset-manifest.json`)
      .then((res) => res.json())
      .then((manifest) => {
        const script = document.createElement("script");
        script.id = scriptId;
        script.crossOrigin = "";
        script.src = `${host}${manifest.files["main.js"]}`;
        script.onload = renderMicroFrontend;
        document.head.appendChild(script);
      });

    function renderMicroFrontend() {
      window[`render${name}`](`${name}-container`, history);
    }

    return () => {
      window[`unmount${name}`] && window[`unmount${name}`](`${name}-container`);
    };
  }, [name, host, history]);

  return <div id={`${name}-container`} />;
};
```

## Best Practices

### Pattern Selection Guidelines

1. **Container-Presenter**: Use for separating business logic from UI
2. **Provider Pattern**: Use for sharing state across many components
3. **Composition**: Use for building flexible, reusable UI components
4. **HOC**: Use for cross-cutting concerns (authentication, logging)
5. **Custom Hooks**: Use for sharing stateful logic between components
6. **Render Props**: Use when you need maximum flexibility in rendering
7. **Reducer**: Use for complex state logic with multiple actions

### Performance Considerations

- Use `memo` for expensive components
- Implement virtualization for large lists
- Leverage `useMemo` and `useCallback` strategically
- Consider code splitting with `lazy` and `Suspense`
- Profile with React DevTools Profiler

### Common Anti-Patterns

- Prop drilling when Context would be better
- Overusing Context for local state
- Not memoizing expensive calculations
- Creating objects/functions in render
- Mutating state directly
- Using index as key in dynamic lists

## Interview Questions

### Basic Questions

**Q: What are React design patterns and why are they important?**
A: React design patterns are reusable solutions to common problems in React development. They provide structured approaches to component organization, state management, and code reuse, making applications more maintainable and scalable.

**Q: Explain the Container-Presenter pattern.**
A: The Container-Presenter pattern separates business logic (containers) from presentation logic (presenters). Containers handle data fetching, state management, and business logic, while presenters focus purely on rendering UI based on props.

**Q: When would you use the Provider pattern?**
A: Use the Provider pattern when you need to share data across multiple components at different levels of the component tree, avoiding prop drilling. It's ideal for themes, user authentication, language settings, or global application state.

### Intermediate Questions

**Q: Compare HOCs vs Custom Hooks for code reuse.**
A: HOCs wrap components to add functionality but can create wrapper hell and make debugging harder. Custom hooks share stateful logic without changing component hierarchy, are more composable, and work better with TypeScript inference.

**Q: How do you implement the Compound Component pattern?**
A: Compound components work together as a unit, sharing state through React Context. Examples include `<Select>` with `<Option>` components or `<Tabs>` with `<Tab>` and `<TabPanel>` components.

### Advanced Questions

**Q: Explain the trade-offs between different state management patterns.**
A: Local state with hooks is simple but doesn't scale. Context is good for sharing state but can cause performance issues. Redux provides predictable state updates but adds complexity. Zustand offers simpler syntax with good performance.

**Q: How would you implement a render prop pattern with TypeScript?**
A: Use generic types for the render prop function, ensuring type safety for the data passed to the render function while maintaining flexibility for different rendering implementations.

**Q: Design a pattern for handling async operations with error boundaries.**
A: Combine error boundaries with suspense boundaries and custom hooks that handle loading, error, and success states. Use error boundaries to catch async errors and display appropriate fallback UIs.
