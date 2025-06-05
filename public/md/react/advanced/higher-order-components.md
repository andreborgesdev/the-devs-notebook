# React Higher-Order Components (HOCs)

## Overview

Higher-Order Components (HOCs) are a pattern for reusing component logic. A HOC is a function that takes a component and returns a new component with additional props or behavior. It's a composition pattern based on React's compositional nature.

## Basic HOC Structure

```javascript
function withEnhancement(WrappedComponent) {
  return function EnhancedComponent(props) {
    return <WrappedComponent {...props} />;
  };
}

const EnhancedComponent = withEnhancement(OriginalComponent);
```

## Authentication HOC

```javascript
import React from "react";
import { useAuth } from "./AuthContext";

function withAuth(WrappedComponent, options = {}) {
  const { redirectTo = "/login", requiredRole = null } = options;

  function WithAuthComponent(props) {
    const { user, isLoading, isAuthenticated } = useAuth();

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      if (typeof window !== "undefined") {
        window.location.href = redirectTo;
      }
      return <div>Redirecting to login...</div>;
    }

    if (requiredRole && user?.role !== requiredRole) {
      return (
        <div>
          <h2>Access Denied</h2>
          <p>You don't have permission to view this page.</p>
        </div>
      );
    }

    return <WrappedComponent {...props} user={user} />;
  }

  WithAuthComponent.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;
  return WithAuthComponent;
}

const ProtectedProfile = withAuth(UserProfile);
const AdminPanel = withAuth(AdminDashboard, { requiredRole: "admin" });

function UserProfile({ user }) {
  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
    </div>
  );
}

function AdminDashboard({ user }) {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Admin: {user.name}</p>
    </div>
  );
}
```

## Loading HOC

```javascript
function withLoading(WrappedComponent, options = {}) {
  const {
    loadingComponent: LoadingComponent = DefaultLoader,
    loadingProp = "isLoading",
  } = options;

  return function WithLoadingComponent(props) {
    if (props[loadingProp]) {
      return <LoadingComponent />;
    }

    const filteredProps = { ...props };
    delete filteredProps[loadingProp];

    return <WrappedComponent {...filteredProps} />;
  };
}

function DefaultLoader() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "200px",
      }}
    >
      <div>Loading...</div>
    </div>
  );
}

function CustomLoader() {
  return (
    <div className="spinner">
      <div className="spinner-circle"></div>
    </div>
  );
}

const UserList = ({ users }) => (
  <div>
    {users.map((user) => (
      <div key={user.id}>{user.name}</div>
    ))}
  </div>
);

const LoadingUserList = withLoading(UserList, {
  loadingComponent: CustomLoader,
});

function App() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers().then((data) => {
      setUsers(data);
      setIsLoading(false);
    });
  }, []);

  return <LoadingUserList users={users} isLoading={isLoading} />;
}
```

## Error Handling HOC

```javascript
function withErrorHandling(WrappedComponent, options = {}) {
  const {
    fallbackComponent: FallbackComponent = DefaultErrorFallback,
    onError = () => {},
    resetOnPropsChange = true,
  } = options;

  return class WithErrorHandlingComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        hasError: false,
        error: null,
        errorInfo: null,
        prevProps: props,
      };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
      if (
        resetOnPropsChange &&
        prevState.prevProps !== nextProps &&
        prevState.hasError
      ) {
        return {
          hasError: false,
          error: null,
          errorInfo: null,
          prevProps: nextProps,
        };
      }
      return { prevProps: nextProps };
    }

    componentDidCatch(error, errorInfo) {
      this.setState({ error, errorInfo });
      onError(error, errorInfo);
    }

    handleRetry = () => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
      });
    };

    render() {
      if (this.state.hasError) {
        return (
          <FallbackComponent
            error={this.state.error}
            errorInfo={this.state.errorInfo}
            onRetry={this.handleRetry}
          />
        );
      }

      return <WrappedComponent {...this.props} />;
    }
  };
}

function DefaultErrorFallback({ error, onRetry }) {
  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid red",
        borderRadius: "4px",
        margin: "10px",
      }}
    >
      <h3>Something went wrong</h3>
      <p>{error?.message}</p>
      <button onClick={onRetry}>Try Again</button>
    </div>
  );
}

const SafeComponent = withErrorHandling(RiskyComponent, {
  onError: (error, errorInfo) => {
    console.error("Component error:", error);
    logErrorToService(error, errorInfo);
  },
});
```

## Data Fetching HOC

```javascript
function withApiData(WrappedComponent, apiEndpoint, options = {}) {
  const {
    initialData = null,
    loadingComponent: LoadingComponent = () => <div>Loading...</div>,
    errorComponent: ErrorComponent = ({ error, retry }) => (
      <div>
        <p>Error: {error.message}</p>
        <button onClick={retry}>Retry</button>
      </div>
    ),
    propName = "data",
    dependencies = [],
  } = options;

  return function WithApiDataComponent(props) {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const endpoint =
          typeof apiEndpoint === "function" ? apiEndpoint(props) : apiEndpoint;

        const response = await fetch(endpoint);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }, [props, ...dependencies]);

    useEffect(() => {
      fetchData();
    }, [fetchData]);

    if (loading) return <LoadingComponent />;
    if (error) return <ErrorComponent error={error} retry={fetchData} />;

    const enhancedProps = {
      ...props,
      [propName]: data,
      refetch: fetchData,
    };

    return <WrappedComponent {...enhancedProps} />;
  };
}

const UserProfile = ({ userData, refetch }) => (
  <div>
    <h1>{userData.name}</h1>
    <p>{userData.email}</p>
    <button onClick={refetch}>Refresh</button>
  </div>
);

const UserProfileWithData = withApiData(
  UserProfile,
  (props) => `/api/users/${props.userId}`,
  {
    propName: "userData",
    dependencies: ["userId"],
  }
);

function App() {
  const [userId, setUserId] = useState(1);

  return (
    <div>
      <button onClick={() => setUserId((id) => id + 1)}>Next User</button>
      <UserProfileWithData userId={userId} />
    </div>
  );
}
```

## Theme HOC

```javascript
import React, { createContext, useContext } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ theme, children }) {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

function withTheme(WrappedComponent) {
  return function WithThemeComponent(props) {
    const theme = useContext(ThemeContext);

    if (!theme) {
      console.warn("withTheme HOC used outside of ThemeProvider");
      return <WrappedComponent {...props} />;
    }

    return <WrappedComponent {...props} theme={theme} />;
  };
}

const Button = ({ theme, children, ...props }) => (
  <button
    style={{
      backgroundColor: theme.primary,
      color: theme.text,
      border: `1px solid ${theme.border}`,
      padding: "8px 16px",
      borderRadius: "4px",
    }}
    {...props}
  >
    {children}
  </button>
);

const ThemedButton = withTheme(Button);

const darkTheme = {
  primary: "#333",
  text: "#fff",
  border: "#555",
};

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <ThemedButton>Click me</ThemedButton>
    </ThemeProvider>
  );
}
```

## Performance Monitoring HOC

```javascript
function withPerformanceMonitoring(WrappedComponent, componentName) {
  return class WithPerformanceMonitoringComponent extends React.Component {
    constructor(props) {
      super(props);
      this.renderStart = null;
      this.mountStart = performance.now();
    }

    componentDidMount() {
      const mountTime = performance.now() - this.mountStart;
      console.log(`${componentName} mount time: ${mountTime.toFixed(2)}ms`);
    }

    componentDidUpdate(prevProps) {
      if (this.renderStart) {
        const renderTime = performance.now() - this.renderStart;
        console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);

        const changedProps = Object.keys(this.props).filter(
          (key) => this.props[key] !== prevProps[key]
        );

        if (changedProps.length > 0) {
          console.log(`${componentName} props changed:`, changedProps);
        }
      }
    }

    render() {
      this.renderStart = performance.now();
      return <WrappedComponent {...this.props} />;
    }
  };
}

const MonitoredUserList = withPerformanceMonitoring(UserList, "UserList");
```

## Conditional Rendering HOC

```javascript
function withConditionalRendering(
  WrappedComponent,
  condition,
  fallback = null
) {
  return function WithConditionalRenderingComponent(props) {
    const shouldRender =
      typeof condition === "function" ? condition(props) : Boolean(condition);

    if (!shouldRender) {
      return typeof fallback === "function" ? fallback(props) : fallback;
    }

    return <WrappedComponent {...props} />;
  };
}

const FeatureFlag = ({ feature, children }) => {
  const features = useFeatureFlags();
  return features[feature] ? children : null;
};

const AdminOnlyButton = withConditionalRendering(
  Button,
  (props) => props.user?.role === "admin",
  <div>Access denied</div>
);

const PremiumFeature = withConditionalRendering(
  PremiumComponent,
  (props) => props.user?.subscription === "premium",
  ({ user }) => (
    <div>
      <p>This is a premium feature</p>
      <button>Upgrade to Premium</button>
    </div>
  )
);
```

## Composing Multiple HOCs

```javascript
import { compose } from "redux";

const enhance = compose(
  withAuth,
  withLoading,
  withErrorHandling,
  withTheme,
  withApiData("/api/dashboard")
);

const EnhancedDashboard = enhance(Dashboard);

function composeHOCs(...hocs) {
  return (BaseComponent) => {
    return hocs.reduceRight((acc, hoc) => hoc(acc), BaseComponent);
  };
}

const enhanceAlternative = composeHOCs(
  withAuth,
  withLoading,
  withErrorHandling,
  withTheme
);

const AlternativeEnhancedDashboard = enhanceAlternative(Dashboard);
```

## HOC with Ref Forwarding

```javascript
function withInputValidation(WrappedComponent) {
  const WithInputValidationComponent = React.forwardRef((props, ref) => {
    const [error, setError] = useState("");

    const validate = (value) => {
      if (props.required && !value) {
        setError("This field is required");
        return false;
      }
      if (props.minLength && value.length < props.minLength) {
        setError(`Minimum length is ${props.minLength}`);
        return false;
      }
      setError("");
      return true;
    };

    const handleChange = (e) => {
      const value = e.target.value;
      validate(value);
      if (props.onChange) {
        props.onChange(e);
      }
    };

    return (
      <div>
        <WrappedComponent {...props} ref={ref} onChange={handleChange} />
        {error && <div style={{ color: "red" }}>{error}</div>}
      </div>
    );
  });

  WithInputValidationComponent.displayName = `withInputValidation(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;

  return WithInputValidationComponent;
}

const ValidatedInput = withInputValidation(
  React.forwardRef((props, ref) => <input ref={ref} {...props} />)
);

function Form() {
  const inputRef = useRef();

  return (
    <form>
      <ValidatedInput
        ref={inputRef}
        required
        minLength={3}
        placeholder="Enter name"
      />
    </form>
  );
}
```

## TypeScript HOC

```typescript
import React, { ComponentType } from "react";

interface WithLoadingProps {
  isLoading?: boolean;
}

function withLoading<P extends object>(WrappedComponent: ComponentType<P>) {
  return (props: P & WithLoadingProps) => {
    const { isLoading, ...restProps } = props;

    if (isLoading) {
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...(restProps as P)} />;
  };
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserProfileProps {
  user: User;
  onEdit: (user: User) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onEdit }) => (
  <div>
    <h1>{user.name}</h1>
    <p>{user.email}</p>
    <button onClick={() => onEdit(user)}>Edit</button>
  </div>
);

const LoadingUserProfile = withLoading(UserProfile);

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  return (
    <LoadingUserProfile user={user!} onEdit={setUser} isLoading={loading} />
  );
}
```

## HOCs vs Hooks Comparison

| HOCs                            | Hooks                    |
| ------------------------------- | ------------------------ |
| Class or function components    | Function components only |
| Wrapper hell with multiple HOCs | Cleaner composition      |
| Props collision possible        | Direct state access      |
| Complex debugging               | Easier to debug          |
| Reusable across class/function  | Function components only |

## Interview Questions

### Q1: What are Higher-Order Components and when would you use them?

**Answer:** HOCs are functions that take a component and return a new enhanced component. They're used for:

- Code reuse across components
- Cross-cutting concerns (auth, logging, theming)
- Conditional rendering
- Props manipulation
- Adding lifecycle behavior

### Q2: What are the disadvantages of HOCs?

**Answer:**

- **Wrapper hell**: Multiple HOCs create deep nesting
- **Props collision**: HOCs might override props with same names
- **Debugging complexity**: Hard to trace through multiple wrappers
- **Static composition**: Structure determined at build time
- **Ref issues**: Need forwardRef for ref passing

### Q3: How do HOCs compare to Render Props and Hooks?

**Answer:**

- **HOCs**: Good for enhancing components with additional props/behavior
- **Render Props**: More flexible, avoid wrapper hell, runtime composition
- **Hooks**: Cleaner, more composable, better for function components

### Q4: How do you handle ref forwarding in HOCs?

**Answer:** Use `React.forwardRef` to forward refs through the HOC to the wrapped component, ensuring ref access works properly.

## Best Practices

1. **Use descriptive names** - Prefix with `with` (e.g., `withAuth`, `withLoading`)
2. **Copy static methods** - Use `hoist-non-react-statics` library
3. **Set displayName** - For better debugging experience
4. **Don't mutate** - Return new components, don't modify originals
5. **Compose carefully** - Order matters when combining multiple HOCs
6. **Consider alternatives** - Hooks are often cleaner for function components
7. **Forward refs** - When wrapped component needs ref access

## Common Mistakes

1. **Using inside render** - Creates new component on every render
2. **Forgetting displayName** - Makes debugging harder
3. **Props collision** - Multiple HOCs overriding same props
4. **Not copying statics** - Losing static methods from wrapped component
5. **Mutating components** - Modifying instead of wrapping
6. **Overusing HOCs** - Consider hooks or render props alternatives

## Migration to Hooks

```javascript
function withCounter(WrappedComponent) {
  return function WithCounterComponent(props) {
    const [count, setCount] = useState(0);

    return (
      <WrappedComponent
        {...props}
        count={count}
        increment={() => setCount((c) => c + 1)}
        decrement={() => setCount((c) => c - 1)}
      />
    );
  };
}

function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => setCount((c) => c + 1), []);
  const decrement = useCallback(() => setCount((c) => c - 1), []);

  return { count, increment, decrement };
}

function ComponentWithHook() {
  const { count, increment, decrement } = useCounter();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}
```

## Performance Considerations

- HOCs add component layers, potentially affecting performance
- Use React.memo with HOCs to prevent unnecessary re-renders
- Be careful with object/function props to avoid breaking memoization
- Consider using useMemo/useCallback for expensive computations in HOCs
- Profile wrapped components to ensure HOCs don't impact performance negatively
