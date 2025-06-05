# Higher-Order Components (HOC) Pattern

Higher-Order Components are functions that take a component and return a new enhanced component. They enable component logic reuse and cross-cutting concerns implementation.

## Basic HOC Implementation

### Simple Enhancement HOC

```typescript
import React, { ComponentType } from "react";

function withLoading<P extends object>(WrappedComponent: ComponentType<P>) {
  return function WithLoadingComponent(props: P & { isLoading: boolean }) {
    const { isLoading, ...restProps } = props;

    if (isLoading) {
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...(restProps as P)} />;
  };
}

const UserProfile: React.FC<{ name: string }> = ({ name }) => (
  <div>Profile: {name}</div>
);

const UserProfileWithLoading = withLoading(UserProfile);

function App() {
  return <UserProfileWithLoading name="John Doe" isLoading={false} />;
}
```

### Props Manipulation HOC

```typescript
interface WithDefaultProps {
  theme?: "light" | "dark";
  size?: "small" | "medium" | "large";
}

function withDefaults<P extends WithDefaultProps>(
  WrappedComponent: ComponentType<P>,
  defaultProps: Partial<WithDefaultProps>
) {
  return function WithDefaultsComponent(props: P) {
    const mergedProps = { ...defaultProps, ...props } as P;
    return <WrappedComponent {...mergedProps} />;
  };
}

const Button: React.FC<WithDefaultProps & { children: React.ReactNode }> = ({
  theme = "light",
  size = "medium",
  children,
}) => <button className={`btn btn-${theme} btn-${size}`}>{children}</button>;

const DefaultButton = withDefaults(Button, {
  theme: "dark",
  size: "large",
});
```

## Authentication HOC

### Route Protection

```typescript
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

function withAuth<P extends object>(WrappedComponent: ComponentType<P>) {
  return function WithAuthComponent(props: P) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
      return <div>Authenticating...</div>;
    }

    if (!user) {
      return <Navigate to="/login" replace />;
    }

    return <WrappedComponent {...props} />;
  };
}

const Dashboard: React.FC = () => <div>Protected Dashboard Content</div>;

const ProtectedDashboard = withAuth(Dashboard);
```

### Role-Based Access Control

```typescript
interface WithRoleProps {
  requiredRoles: string[];
  fallback?: React.ComponentType;
}

function withRole<P extends object>(
  WrappedComponent: ComponentType<P>,
  { requiredRoles, fallback: Fallback }: WithRoleProps
) {
  return function WithRoleComponent(props: P) {
    const { user } = useAuth();

    const hasRequiredRole = requiredRoles.some((role) =>
      user?.roles?.includes(role)
    );

    if (!hasRequiredRole) {
      return Fallback ? <Fallback /> : <div>Access Denied</div>;
    }

    return <WrappedComponent {...props} />;
  };
}

const AdminPanel: React.FC = () => <div>Admin Panel Content</div>;

const AdminPanelWithRole = withRole(AdminPanel, {
  requiredRoles: ["admin", "super-admin"],
  fallback: () => <div>You need admin privileges</div>,
});
```

## Data Fetching HOCs

### Generic Data Fetcher

```typescript
interface WithDataProps<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function withData<T, P extends object>(
  WrappedComponent: ComponentType<P & WithDataProps<T>>,
  fetchData: () => Promise<T>
) {
  return function WithDataComponent(props: P) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAndSetData = useCallback(async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchData();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }, []);

    useEffect(() => {
      fetchAndSetData();
    }, [fetchAndSetData]);

    return (
      <WrappedComponent
        {...props}
        data={data}
        loading={loading}
        error={error}
        refetch={fetchAndSetData}
      />
    );
  };
}

interface User {
  id: number;
  name: string;
  email: string;
}

const UserList: React.FC<WithDataProps<User[]>> = ({
  data,
  loading,
  error,
  refetch,
}) => {
  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No users found</div>;

  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      {data.map((user) => (
        <div key={user.id}>
          {user.name} - {user.email}
        </div>
      ))}
    </div>
  );
};

const UserListWithData = withData(UserList, () =>
  fetch("/api/users").then((res) => res.json())
);
```

### Paginated Data HOC

```typescript
interface PaginatedData<T> {
  items: T[];
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface WithPaginationProps<T> extends WithDataProps<PaginatedData<T>> {
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (page: number) => void;
}

function withPagination<T, P extends object>(
  WrappedComponent: ComponentType<P & WithPaginationProps<T>>,
  fetchPage: (page: number) => Promise<PaginatedData<T>>
) {
  return function WithPaginationComponent(props: P) {
    const [currentPage, setCurrentPage] = useState(1);
    const [data, setData] = useState<PaginatedData<T> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async (page: number) => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchPage(page);
        setData(result);
        setCurrentPage(page);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }, []);

    useEffect(() => {
      fetchData(currentPage);
    }, [fetchData, currentPage]);

    const nextPage = useCallback(() => {
      if (data?.hasNextPage) {
        fetchData(currentPage + 1);
      }
    }, [data?.hasNextPage, currentPage, fetchData]);

    const previousPage = useCallback(() => {
      if (data?.hasPreviousPage) {
        fetchData(currentPage - 1);
      }
    }, [data?.hasPreviousPage, currentPage, fetchData]);

    const goToPage = useCallback(
      (page: number) => {
        fetchData(page);
      },
      [fetchData]
    );

    const refetch = useCallback(() => {
      fetchData(currentPage);
    }, [fetchData, currentPage]);

    return (
      <WrappedComponent
        {...props}
        data={data}
        loading={loading}
        error={error}
        refetch={refetch}
        nextPage={nextPage}
        previousPage={previousPage}
        goToPage={goToPage}
      />
    );
  };
}
```

## Performance-Oriented HOCs

### Memoization HOC

```typescript
function withMemo<P extends object>(
  WrappedComponent: ComponentType<P>,
  areEqual?: (prevProps: P, nextProps: P) => boolean
) {
  const MemoizedComponent = React.memo<P>(WrappedComponent, areEqual);

  return function WithMemoComponent(props: P) {
    return <MemoizedComponent {...props} />;
  };
}

const ExpensiveComponent: React.FC<{ data: any[] }> = ({ data }) => {
  const processedData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      computed: heavyComputation(item),
    }));
  }, [data]);

  return (
    <div>
      {processedData.map((item) => (
        <div key={item.id}>{item.computed}</div>
      ))}
    </div>
  );
};

const MemoizedExpensiveComponent = withMemo(
  ExpensiveComponent,
  (prevProps, nextProps) => {
    return JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data);
  }
);
```

### Debounced Input HOC

```typescript
interface WithDebounceProps {
  debounceMs?: number;
}

function withDebounce<P extends object>(
  WrappedComponent: ComponentType<P>,
  defaultDebounceMs: number = 300
) {
  return function WithDebounceComponent(props: P & WithDebounceProps) {
    const { debounceMs = defaultDebounceMs, ...restProps } = props;
    const [debouncedProps, setDebouncedProps] = useState(restProps);

    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedProps(restProps);
      }, debounceMs);

      return () => clearTimeout(timer);
    }, [restProps, debounceMs]);

    return <WrappedComponent {...(debouncedProps as P)} />;
  };
}

const SearchResults: React.FC<{ query: string }> = ({ query }) => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query) {
      searchAPI(query).then(setResults);
    }
  }, [query]);

  return (
    <div>
      {results.map((result) => (
        <div key={result.id}>{result.title}</div>
      ))}
    </div>
  );
};

const DebouncedSearchResults = withDebounce(SearchResults, 500);
```

## Error Handling HOCs

### Error Boundary HOC

```typescript
interface ErrorInfo {
  componentStack: string;
  errorBoundary?: string;
}

interface WithErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

function withErrorBoundary<P extends object>(
  WrappedComponent: ComponentType<P>,
  fallback?: ComponentType<{ error: Error; retry: () => void }>
) {
  return class WithErrorBoundaryComponent extends Component<
    P,
    WithErrorBoundaryState
  > {
    constructor(props: P) {
      super(props);
      this.state = {
        hasError: false,
        error: null,
        errorInfo: null,
      };
    }

    static getDerivedStateFromError(error: Error) {
      return {
        hasError: true,
        error,
      };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
      this.setState({
        error,
        errorInfo,
      });

      console.error("Error caught by HOC:", error, errorInfo);
    }

    retry = () => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
      });
    };

    render() {
      if (this.state.hasError && this.state.error) {
        if (fallback) {
          const FallbackComponent = fallback;
          return (
            <FallbackComponent error={this.state.error} retry={this.retry} />
          );
        }

        return (
          <div>
            <h2>Something went wrong</h2>
            <button onClick={this.retry}>Try Again</button>
            <details>
              <summary>Error Details</summary>
              <pre>{this.state.error.message}</pre>
            </details>
          </div>
        );
      }

      return <WrappedComponent {...this.props} />;
    }
  };
}

const CustomErrorFallback: React.FC<{ error: Error; retry: () => void }> = ({
  error,
  retry,
}) => (
  <div className="error-boundary">
    <h3>Oops! Something went wrong</h3>
    <p>{error.message}</p>
    <button onClick={retry}>Retry</button>
  </div>
);

const ProblematicComponent: React.FC = () => {
  throw new Error("This component always fails");
  return <div>This will never render</div>;
};

const SafeProblematicComponent = withErrorBoundary(
  ProblematicComponent,
  CustomErrorFallback
);
```

## Composing Multiple HOCs

### HOC Composition Utility

```typescript
function compose<T>(...fns: Array<(arg: T) => T>) {
  return (arg: T) => fns.reduceRight((acc, fn) => fn(acc), arg);
}

const enhance = compose(withAuth, withLoading, withErrorBoundary, withMemo);

const EnhancedComponent = enhance(MyComponent);
```

### Reusable Enhancement Pipeline

```typescript
interface EnhancementOptions {
  requireAuth?: boolean;
  showLoading?: boolean;
  enableErrorBoundary?: boolean;
  memoize?: boolean;
  debounceMs?: number;
}

function createEnhancedComponent<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: EnhancementOptions = {}
) {
  let EnhancedComponent = WrappedComponent;

  if (options.memoize) {
    EnhancedComponent = withMemo(EnhancedComponent);
  }

  if (options.debounceMs) {
    EnhancedComponent = withDebounce(EnhancedComponent, options.debounceMs);
  }

  if (options.enableErrorBoundary) {
    EnhancedComponent = withErrorBoundary(EnhancedComponent);
  }

  if (options.showLoading) {
    EnhancedComponent = withLoading(EnhancedComponent);
  }

  if (options.requireAuth) {
    EnhancedComponent = withAuth(EnhancedComponent);
  }

  return EnhancedComponent;
}

const MyEnhancedComponent = createEnhancedComponent(MyComponent, {
  requireAuth: true,
  showLoading: true,
  enableErrorBoundary: true,
  memoize: true,
  debounceMs: 300,
});
```

## Testing HOCs

### HOC Testing Utilities

```typescript
import { render, screen } from "@testing-library/react";
import { AuthProvider } from "../contexts/AuthContext";

function renderWithAuth(component: React.ReactElement, user = null) {
  return render(<AuthProvider initialUser={user}>{component}</AuthProvider>);
}

describe("withAuth HOC", () => {
  const TestComponent = () => <div>Protected Content</div>;
  const ProtectedComponent = withAuth(TestComponent);

  it("renders component when user is authenticated", () => {
    renderWithAuth(<ProtectedComponent />, { id: 1, name: "John" });
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("redirects when user is not authenticated", () => {
    renderWithAuth(<ProtectedComponent />);
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });
});

describe("withLoading HOC", () => {
  const TestComponent = () => <div>Content</div>;
  const LoadingComponent = withLoading(TestComponent);

  it("shows loading state", () => {
    render(<LoadingComponent isLoading={true} />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows content when not loading", () => {
    render(<LoadingComponent isLoading={false} />);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});
```

### Mock HOC for Testing

```typescript
const mockWithAuth = <P extends object>(Component: ComponentType<P>) => {
  return function MockedAuthComponent(props: P) {
    return <Component {...props} />;
  };
};

jest.mock("../hocs/withAuth", () => ({
  withAuth: mockWithAuth,
}));
```

## Performance Considerations

### HOC Optimization Best Practices

```typescript
const withOptimizedData = <T, P extends object>(
  WrappedComponent: ComponentType<P & WithDataProps<T>>,
  fetchData: () => Promise<T>
) => {
  const MemoizedWrapper = React.memo<P>(function OptimizedDataComponent(props) {
    const [state, setState] = useState({
      data: null as T | null,
      loading: true,
      error: null as string | null,
    });

    const stableFetchData = useCallback(fetchData, []);

    useEffect(() => {
      let cancelled = false;

      stableFetchData()
        .then((data) => {
          if (!cancelled) {
            setState({ data, loading: false, error: null });
          }
        })
        .catch((error) => {
          if (!cancelled) {
            setState({
              data: null,
              loading: false,
              error: error.message,
            });
          }
        });

      return () => {
        cancelled = true;
      };
    }, [stableFetchData]);

    const refetch = useCallback(() => {
      setState((prev) => ({ ...prev, loading: true }));
      stableFetchData()
        .then((data) => setState({ data, loading: false, error: null }))
        .catch((error) =>
          setState({
            data: null,
            loading: false,
            error: error.message,
          })
        );
    }, [stableFetchData]);

    return <WrappedComponent {...props} {...state} refetch={refetch} />;
  });

  MemoizedWrapper.displayName = `withOptimizedData(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;

  return MemoizedWrapper;
};
```

## HOC vs Hooks Comparison

### When to Use HOCs

HOCs are ideal for:

- Cross-cutting concerns that affect multiple components
- Component enhancement that doesn't require component state
- Legacy code integration
- Library/framework integration

### When to Use Hooks

Hooks are better for:

- Component-specific logic
- State management within components
- Side effects that depend on component lifecycle
- Logic that benefits from React's built-in optimizations

### Migration Example

```typescript
// HOC approach
const withCounter = (WrappedComponent) => {
  return class extends React.Component {
    state = { count: 0 };

    increment = () => {
      this.setState((prev) => ({ count: prev.count + 1 }));
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          count={this.state.count}
          increment={this.increment}
        />
      );
    }
  };
};

// Hook approach
const useCounter = (initialValue = 0) => {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  return { count, increment };
};

// Usage with hook
const CounterComponent = () => {
  const { count, increment } = useCounter();
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
};
```

## Best Practices

### HOC Design Guidelines

1. **Don't Mutate the Original Component**
2. **Pass Through Unrelated Props**
3. **Maximize Composability**
4. **Use Display Names for Debugging**
5. **Don't Use HOCs Inside render Methods**
6. **Copy Static Methods**
7. **Forward Refs When Necessary**

### Implementation Best Practices

```typescript
function withBestPractices<P extends object>(
  WrappedComponent: ComponentType<P>
) {
  const WithBestPracticesComponent = React.forwardRef<any, P>(
    function WithBestPracticesComponent(props, ref) {
      return <WrappedComponent {...props} ref={ref} />;
    }
  );

  WithBestPracticesComponent.displayName = `withBestPractices(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;

  // Copy static methods
  hoistNonReactStatics(WithBestPracticesComponent, WrappedComponent);

  return WithBestPracticesComponent;
}
```

## Interview Questions

### Basic Level

**Q: What is a Higher-Order Component (HOC)?**

A: A Higher-Order Component is a function that takes a component and returns a new component with enhanced functionality. It's a pattern for reusing component logic, following the higher-order function concept from functional programming.

**Q: How do you create a simple HOC?**

A: Create a function that accepts a component as parameter and returns a new component:

```typescript
function withEnhancement(WrappedComponent) {
  return function EnhancedComponent(props) {
    return <WrappedComponent {...props} additionalProp="value" />;
  };
}
```

**Q: What's the difference between HOCs and regular components?**

A: HOCs are functions that transform components, while regular components render UI. HOCs operate at the component definition level, not the instance level.

### Intermediate Level

**Q: How do you handle prop collision in HOCs?**

A: Use prop separation and clear naming conventions:

```typescript
function withData(WrappedComponent) {
  return function WithDataComponent({ dataProps, ...restProps }) {
    return <WrappedComponent {...restProps} data={dataProps} />;
  };
}
```

**Q: How do you compose multiple HOCs?**

A: Use function composition or create a compose utility:

```typescript
const enhance = compose(withAuth, withLoading, withData);
const EnhancedComponent = enhance(MyComponent);
```

**Q: How do you test components wrapped with HOCs?**

A: Test the HOC logic separately and use mock HOCs for component testing, or test the enhanced component as a whole with proper setup.

### Advanced Level

**Q: How do you handle ref forwarding in HOCs?**

A: Use React.forwardRef to properly forward refs:

```typescript
function withRef(WrappedComponent) {
  return React.forwardRef((props, ref) => (
    <WrappedComponent {...props} ref={ref} />
  ));
}
```

**Q: What are the performance implications of HOCs?**

A: HOCs can create additional wrapper components affecting the component tree depth. Use React.memo for optimization and avoid creating HOCs inside render methods.

**Q: When should you choose HOCs over hooks?**

A: Use HOCs for cross-cutting concerns affecting multiple components, component enhancement without state requirements, and when integrating with libraries that expect component wrappers. Use hooks for component-specific logic and state management.
