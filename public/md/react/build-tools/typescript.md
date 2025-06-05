# TypeScript with React

TypeScript provides static type checking for React applications, enabling better development experience with IntelliSense, compile-time error detection, and improved code maintainability. This guide covers comprehensive TypeScript integration with React development.

## Basic Setup and Configuration

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": "src",
    "paths": {
      "@/*": ["*"],
      "@components/*": ["components/*"],
      "@utils/*": ["utils/*"],
      "@types/*": ["types/*"]
    }
  },
  "include": ["src/**/*", "src/**/*.tsx", "src/**/*.ts"],
  "exclude": ["node_modules", "build", "dist"]
}
```

### Package.json Dependencies

```json
{
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
```

## Component Type Definitions

### Functional Components

```typescript
interface Props {
  title: string;
  count: number;
  isVisible?: boolean;
  onClick: () => void;
}

const MyComponent: React.FC<Props> = ({
  title,
  count,
  isVisible = true,
  onClick,
}) => {
  return (
    <div>
      <h1>{title}</h1>
      {isVisible && <p>Count: {count}</p>}
      <button onClick={onClick}>Click me</button>
    </div>
  );
};

// Alternative syntax (preferred)
const MyComponent = ({ title, count, isVisible = true, onClick }: Props) => {
  return (
    <div>
      <h1>{title}</h1>
      {isVisible && <p>Count: {count}</p>}
      <button onClick={onClick}>Click me</button>
    </div>
  );
};
```

### Class Components

```typescript
interface Props {
  initialCount: number;
  onCountChange: (count: number) => void;
}

interface State {
  count: number;
  error: string | null;
}

class Counter extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      count: props.initialCount,
      error: null,
    };
  }

  handleIncrement = (): void => {
    this.setState(
      (prevState) => ({ count: prevState.count + 1 }),
      () => this.props.onCountChange(this.state.count)
    );
  };

  render(): React.ReactNode {
    const { count, error } = this.state;

    if (error) {
      return <div>Error: {error}</div>;
    }

    return (
      <div>
        <p>Count: {count}</p>
        <button onClick={this.handleIncrement}>Increment</button>
      </div>
    );
  }
}
```

### Component with Children

```typescript
interface CardProps {
  title: string;
  className?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, className, children }) => (
  <div className={`card ${className || ""}`}>
    <h2>{title}</h2>
    <div className="card-content">{children}</div>
  </div>
);

// Specific children types
interface TabsProps {
  children: React.ReactElement<TabProps> | React.ReactElement<TabProps>[];
  activeTab: string;
}

interface TabProps {
  id: string;
  label: string;
  children: React.ReactNode;
}

const Tabs: React.FC<TabsProps> = ({ children, activeTab }) => {
  const tabs = React.Children.toArray(
    children
  ) as React.ReactElement<TabProps>[];

  return (
    <div>
      <div className="tab-headers">
        {tabs.map((tab) => (
          <button key={tab.props.id}>{tab.props.label}</button>
        ))}
      </div>
      <div className="tab-content">
        {tabs.find((tab) => tab.props.id === activeTab)?.props.children}
      </div>
    </div>
  );
};
```

## Hooks with TypeScript

### useState Hook

```typescript
// Basic state
const [count, setCount] = useState<number>(0);
const [name, setName] = useState<string>("");
const [isLoading, setIsLoading] = useState<boolean>(false);

// Complex state
interface User {
  id: number;
  name: string;
  email: string;
}

const [user, setUser] = useState<User | null>(null);
const [users, setUsers] = useState<User[]>([]);

// State with initial value inference
const [theme, setTheme] = useState("light"); // inferred as string
const [config, setConfig] = useState({
  apiUrl: "https://api.example.com",
  timeout: 5000,
}); // inferred object type
```

### useEffect Hook

```typescript
import { useEffect, useState } from "react";

const DataFetcher: React.FC<{ userId: number }> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const fetchUser = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const userData: User = await response.json();

        if (!isCancelled) {
          setUser(userData);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchUser();

    return () => {
      isCancelled = true;
    };
  }, [userId]);

  return { user, loading, error };
};
```

### useReducer Hook

```typescript
interface State {
  count: number;
  step: number;
  history: number[];
}

type Action =
  | { type: "increment" }
  | { type: "decrement" }
  | { type: "set_step"; payload: number }
  | { type: "reset" }
  | { type: "undo" };

const initialState: State = {
  count: 0,
  step: 1,
  history: [0],
};

function counterReducer(state: State, action: Action): State {
  switch (action.type) {
    case "increment":
      const newCount = state.count + state.step;
      return {
        ...state,
        count: newCount,
        history: [...state.history, newCount],
      };
    case "decrement":
      const decrementedCount = state.count - state.step;
      return {
        ...state,
        count: decrementedCount,
        history: [...state.history, decrementedCount],
      };
    case "set_step":
      return {
        ...state,
        step: action.payload,
      };
    case "reset":
      return initialState;
    case "undo":
      const previousHistory = state.history.slice(0, -1);
      return {
        ...state,
        count: previousHistory[previousHistory.length - 1] || 0,
        history: previousHistory,
      };
    default:
      return state;
  }
}

const Counter: React.FC = () => {
  const [state, dispatch] = useReducer(counterReducer, initialState);

  return (
    <div>
      <p>Count: {state.count}</p>
      <p>Step: {state.step}</p>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
      <button onClick={() => dispatch({ type: "undo" })}>Undo</button>
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
    </div>
  );
};
```

### Custom Hooks

```typescript
interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
}

function useFetch<T>(url: string, options?: FetchOptions): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async (): Promise<void> => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const response = await fetch(url, {
          method: options?.method || "GET",
          headers: {
            "Content-Type": "application/json",
            ...options?.headers,
          },
          body: options?.body ? JSON.stringify(options.body) : undefined,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: T = await response.json();

        if (!isCancelled) {
          setState({ data, loading: false, error: null });
        }
      } catch (error) {
        if (!isCancelled) {
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, [
    url,
    options?.method,
    JSON.stringify(options?.headers),
    JSON.stringify(options?.body),
  ]);

  return state;
}

// Usage
interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

const PostList: React.FC = () => {
  const { data: posts, loading, error } = useFetch<Post[]>("/api/posts");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!posts) return <div>No posts found</div>;

  return (
    <div>
      {posts.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
        </article>
      ))}
    </div>
  );
};
```

## Event Handling

### Event Types

```typescript
const FormComponent: React.FC = () => {
  const [formData, setFormData] = useState({ name: "", email: "" });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (event.key === "Enter") {
      event.preventDefault();
      // Handle enter key
    }
  };

  const handleButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    console.log("Button clicked:", event.currentTarget.name);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Name"
      />
      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="Email"
      />
      <button type="submit" onClick={handleButtonClick}>
        Submit
      </button>
    </form>
  );
};
```

### Generic Event Handlers

```typescript
interface FormField {
  name: string;
  value: string;
  type: "text" | "email" | "password" | "number";
}

const GenericForm: React.FC = () => {
  const [fields, setFields] = useState<FormField[]>([
    { name: "username", value: "", type: "text" },
    { name: "email", value: "", type: "email" },
    { name: "password", value: "", type: "password" },
  ]);

  const handleFieldChange =
    <T extends HTMLInputElement | HTMLTextAreaElement>(fieldName: string) =>
    (event: React.ChangeEvent<T>): void => {
      setFields((prev) =>
        prev.map((field) =>
          field.name === fieldName
            ? { ...field, value: event.target.value }
            : field
        )
      );
    };

  return (
    <form>
      {fields.map((field) => (
        <input
          key={field.name}
          name={field.name}
          type={field.type}
          value={field.value}
          onChange={handleFieldChange(field.name)}
          placeholder={field.name}
        />
      ))}
    </form>
  );
};
```

## Context API with TypeScript

### Typed Context

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user" | "moderator";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const userData: User = await response.json();
      setUser(userData);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
    localStorage.removeItem("auth-token");
  };

  const updateUser = (userData: Partial<User>): void => {
    setUser((prev) => (prev ? { ...prev, ...userData } : null));
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
```

## Advanced Patterns

### Higher-Order Components

```typescript
interface WithLoadingProps {
  loading: boolean;
}

function withLoading<P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.ComponentType<P & WithLoadingProps> {
  const WithLoadingComponent = (props: P & WithLoadingProps) => {
    const { loading, ...restProps } = props;

    if (loading) {
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...(restProps as P)} />;
  };

  WithLoadingComponent.displayName = `withLoading(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;

  return WithLoadingComponent;
}

// Usage
interface UserListProps {
  users: User[];
  onUserSelect: (user: User) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onUserSelect }) => (
  <div>
    {users.map((user) => (
      <div key={user.id} onClick={() => onUserSelect(user)}>
        {user.name}
      </div>
    ))}
  </div>
);

const UserListWithLoading = withLoading(UserList);

// Usage with both original and HOC props
<UserListWithLoading
  users={users}
  onUserSelect={handleUserSelect}
  loading={isLoading}
/>;
```

### Render Props

```typescript
interface MousePosition {
  x: number;
  y: number;
}

interface MouseTrackerProps {
  children: (mouse: MousePosition) => React.ReactNode;
}

const MouseTracker: React.FC<MouseTrackerProps> = ({ children }) => {
  const [mouse, setMouse] = useState<MousePosition>({ x: 0, y: 0 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>): void => {
    setMouse({
      x: event.clientX,
      y: event.clientY,
    });
  };

  return (
    <div style={{ height: "100vh" }} onMouseMove={handleMouseMove}>
      {children(mouse)}
    </div>
  );
};

// Usage
const App: React.FC = () => (
  <MouseTracker>
    {({ x, y }) => (
      <div>
        <h1>
          Mouse position: ({x}, {y})
        </h1>
      </div>
    )}
  </MouseTracker>
);
```

### Compound Components

```typescript
interface SelectContextType {
  value: string;
  onChange: (value: string) => void;
  isOpen: boolean;
  toggle: () => void;
}

const SelectContext = createContext<SelectContextType | undefined>(undefined);

const useSelectContext = (): SelectContextType => {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error("Select compound components must be used within Select");
  }
  return context;
};

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> & {
  Trigger: React.FC<{ children: React.ReactNode }>;
  Options: React.FC<{ children: React.ReactNode }>;
  Option: React.FC<{ value: string; children: React.ReactNode }>;
} = ({ value, onChange, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen((prev) => !prev);

  const contextValue: SelectContextType = {
    value,
    onChange,
    isOpen,
    toggle,
  };

  return (
    <SelectContext.Provider value={contextValue}>
      <div className="select-container">{children}</div>
    </SelectContext.Provider>
  );
};

Select.Trigger = ({ children }) => {
  const { toggle } = useSelectContext();
  return (
    <button onClick={toggle} className="select-trigger">
      {children}
    </button>
  );
};

Select.Options = ({ children }) => {
  const { isOpen } = useSelectContext();
  if (!isOpen) return null;

  return <div className="select-options">{children}</div>;
};

Select.Option = ({ value, children }) => {
  const { onChange, toggle } = useSelectContext();

  const handleClick = () => {
    onChange(value);
    toggle();
  };

  return (
    <div onClick={handleClick} className="select-option">
      {children}
    </div>
  );
};

// Usage
const App: React.FC = () => {
  const [selectedValue, setSelectedValue] = useState("");

  return (
    <Select value={selectedValue} onChange={setSelectedValue}>
      <Select.Trigger>{selectedValue || "Select an option"}</Select.Trigger>
      <Select.Options>
        <Select.Option value="option1">Option 1</Select.Option>
        <Select.Option value="option2">Option 2</Select.Option>
        <Select.Option value="option3">Option 3</Select.Option>
      </Select.Options>
    </Select>
  );
};
```

## Type Utilities and Helpers

### Common Type Patterns

```typescript
// Pick specific props from a component
type ButtonVariant = "primary" | "secondary" | "danger";

interface BaseButtonProps {
  variant: ButtonVariant;
  size: "small" | "medium" | "large";
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

// Create a link button that excludes onClick but adds href
type LinkButtonProps = Omit<BaseButtonProps, "onClick"> & {
  href: string;
  target?: "_blank" | "_self";
};

// Extract component props type
type DivProps = React.ComponentProps<"div">;
type ButtonProps = React.ComponentProps<"button">;

// Extend native element props
interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  error,
  className,
  ...inputProps
}) => (
  <div className="input-group">
    <label>{label}</label>
    <input
      className={`input ${className || ""} ${error ? "error" : ""}`}
      {...inputProps}
    />
    {error && <span className="error-message">{error}</span>}
  </div>
);
```

### Generic Components

```typescript
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
}

function List<T>({
  items,
  renderItem,
  keyExtractor,
  emptyMessage = "No items found",
}: ListProps<T>): React.ReactElement {
  if (items.length === 0) {
    return <div className="empty-message">{emptyMessage}</div>;
  }

  return (
    <div className="list">
      {items.map((item, index) => (
        <div key={keyExtractor(item)} className="list-item">
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}

// Usage
interface Product {
  id: number;
  name: string;
  price: number;
}

const ProductList: React.FC<{ products: Product[] }> = ({ products }) => (
  <List
    items={products}
    keyExtractor={(product) => product.id}
    renderItem={(product) => (
      <div>
        <h3>{product.name}</h3>
        <p>${product.price}</p>
      </div>
    )}
    emptyMessage="No products available"
  />
);
```

## Testing with TypeScript

### Component Testing

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

interface CounterProps {
  initialCount?: number;
  onCountChange?: (count: number) => void;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  onCountChange,
}) => {
  const [count, setCount] = useState(initialCount);

  const handleIncrement = (): void => {
    const newCount = count + 1;
    setCount(newCount);
    onCountChange?.(newCount);
  };

  return (
    <div>
      <span data-testid="count">{count}</span>
      <button data-testid="increment" onClick={handleIncrement}>
        Increment
      </button>
    </div>
  );
};

describe("Counter", () => {
  it("should render with initial count", () => {
    render(<Counter initialCount={5} />);
    expect(screen.getByTestId("count")).toHaveTextContent("5");
  });

  it("should increment count when button is clicked", () => {
    const mockOnCountChange = jest.fn();
    render(<Counter onCountChange={mockOnCountChange} />);

    fireEvent.click(screen.getByTestId("increment"));

    expect(screen.getByTestId("count")).toHaveTextContent("1");
    expect(mockOnCountChange).toHaveBeenCalledWith(1);
  });
});
```

### Hook Testing

```typescript
import { renderHook, act } from "@testing-library/react";

interface UseCounterOptions {
  initialValue?: number;
  step?: number;
}

interface UseCounterReturn {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

const useCounter = (options: UseCounterOptions = {}): UseCounterReturn => {
  const { initialValue = 0, step = 1 } = options;
  const [count, setCount] = useState(initialValue);

  const increment = (): void => setCount((prev) => prev + step);
  const decrement = (): void => setCount((prev) => prev - step);
  const reset = (): void => setCount(initialValue);

  return { count, increment, decrement, reset };
};

describe("useCounter", () => {
  it("should initialize with default value", () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it("should increment by step value", () => {
    const { result } = renderHook(() => useCounter({ step: 5 }));

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(5);
  });
});
```

## Best Practices

### Type Safety Guidelines

1. **Always type component props explicitly**
2. **Use strict TypeScript configuration**
3. **Prefer interfaces over types for component props**
4. **Use generic types for reusable components**
5. **Type event handlers properly**
6. **Leverage utility types (Pick, Omit, Partial)**

### Performance Considerations

```typescript
// Use React.memo with proper typing
interface ExpensiveComponentProps {
  data: ComplexData;
  onAction: (id: string) => void;
}

const ExpensiveComponent = React.memo<ExpensiveComponentProps>(
  ({ data, onAction }) => {
    // Component implementation
    return <div>{/* Complex rendering */}</div>;
  },
  (prevProps, nextProps) => {
    return prevProps.data.id === nextProps.data.id;
  }
);

// Use useCallback with proper typing
const ParentComponent: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);

  const handleItemAction = useCallback((id: string): void => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return <ExpensiveComponent data={complexData} onAction={handleItemAction} />;
};
```

## Interview Questions

### Basic Questions

**Q: How do you type a React functional component in TypeScript?**
A: Use `React.FC<PropsType>` or define props parameter type directly. The direct approach is preferred: `const Component = (props: PropsType) => { ... }`

**Q: What's the difference between interface and type for component props?**
A: Interfaces are extensible and better for component props, while types are better for unions and computed types. Interfaces can be merged and extended more easily.

**Q: How do you handle optional props in TypeScript?**
A: Use the optional operator `?` in the interface definition and provide default values in destructuring or with default parameters.

### Intermediate Questions

**Q: How do you type custom hooks in TypeScript?**
A: Define the return type interface, use proper generic types for flexibility, and ensure all internal state and functions are properly typed.

**Q: Explain how to type Context API in TypeScript.**
A: Create typed context with proper interface, use undefined as default to enforce provider usage, and create custom hook with proper error handling.

### Advanced Questions

**Q: How do you create type-safe generic components?**
A: Use generic type parameters with constraints, proper type inference, and utility types to create flexible yet type-safe components.

**Q: Design a type-safe form system with TypeScript and React.**
A: Create generic form types, use mapped types for field validation, implement proper error handling, and ensure type safety throughout the form lifecycle.
