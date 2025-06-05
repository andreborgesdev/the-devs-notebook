# Conditional Rendering in React

Conditional rendering allows you to render different UI elements based on certain conditions. React provides several techniques to implement conditional rendering effectively.

## Basic Conditional Rendering

### if/else Statements

```jsx
function UserGreeting({ isLoggedIn, username }) {
  if (isLoggedIn) {
    return <h1>Welcome back, {username}!</h1>;
  } else {
    return <h1>Please sign in</h1>;
  }
}
```

### Ternary Operator

```jsx
function UserStatus({ isLoggedIn, username }) {
  return (
    <div>
      {isLoggedIn ? <h1>Welcome, {username}!</h1> : <h1>Please log in</h1>}
    </div>
  );
}
```

### Logical AND (&&) Operator

```jsx
function NotificationBadge({ count }) {
  return (
    <div>
      <span>Messages</span>
      {count > 0 && <span className="badge">{count}</span>}
    </div>
  );
}
```

## Advanced Conditional Patterns

### Multiple Conditions

```jsx
function UserDashboard({ user, isLoading, error }) {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!user) {
    return <div>No user found</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
    </div>
  );
}
```

### Switch-like Conditional Rendering

```jsx
function StatusIndicator({ status }) {
  const renderStatus = () => {
    switch (status) {
      case "loading":
        return <div className="spinner">Loading...</div>;
      case "success":
        return <div className="success">✓ Success</div>;
      case "error":
        return <div className="error">✗ Error</div>;
      case "idle":
        return <div className="idle">Ready</div>;
      default:
        return <div>Unknown status</div>;
    }
  };

  return <div className="status-container">{renderStatus()}</div>;
}
```

### Object-based Conditional Rendering

```jsx
function AlertMessage({ type, message }) {
  const alertTypes = {
    success: {
      icon: "✓",
      className: "alert-success",
      color: "green",
    },
    warning: {
      icon: "⚠",
      className: "alert-warning",
      color: "orange",
    },
    error: {
      icon: "✗",
      className: "alert-error",
      color: "red",
    },
    info: {
      icon: "ℹ",
      className: "alert-info",
      color: "blue",
    },
  };

  const alert = alertTypes[type] || alertTypes.info;

  return (
    <div className={alert.className} style={{ color: alert.color }}>
      <span>{alert.icon}</span>
      <span>{message}</span>
    </div>
  );
}
```

## Conditional Rendering with Hooks

### useState for Toggle States

```jsx
function ToggleContent() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div>
      <button onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? "Hide" : "Show"} Content
      </button>
      {isVisible && (
        <div className="content">
          <p>This content is conditionally rendered!</p>
        </div>
      )}
    </div>
  );
}
```

### useEffect for Conditional Loading

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchUser(userId)
      .then((userData) => {
        setUser(userData);
        setError(null);
      })
      .catch((err) => {
        setError(err);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  if (!userId) {
    return <div>No user ID provided</div>;
  }

  if (loading) {
    return <div>Loading user profile...</div>;
  }

  if (error) {
    return <div>Error loading profile: {error.message}</div>;
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      {user.avatar && <img src={user.avatar} alt="Avatar" />}
    </div>
  );
}
```

## Complex Conditional Logic

### Nested Conditions

```jsx
function PostCard({ post, currentUser }) {
  return (
    <div className="post-card">
      <h3>{post.title}</h3>
      <p>{post.content}</p>

      {currentUser && (
        <div className="post-actions">
          {currentUser.id === post.authorId && (
            <div className="author-actions">
              <button>Edit</button>
              <button>Delete</button>
            </div>
          )}

          {currentUser.id !== post.authorId && (
            <div className="user-actions">
              <button>Like</button>
              <button>Share</button>
              {currentUser.canReport && <button>Report</button>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

### Function-based Conditional Rendering

```jsx
function ShoppingCart({ items, user }) {
  const renderEmptyCart = () => (
    <div className="empty-cart">
      <h3>Your cart is empty</h3>
      <p>Add some items to get started!</p>
    </div>
  );

  const renderCartItems = () => (
    <div className="cart-items">
      {items.map((item) => (
        <div key={item.id} className="cart-item">
          <span>{item.name}</span>
          <span>${item.price}</span>
        </div>
      ))}
    </div>
  );

  const renderCheckoutSection = () => (
    <div className="checkout-section">
      <div className="total">
        Total: ${items.reduce((sum, item) => sum + item.price, 0)}
      </div>
      {user ? (
        <button className="checkout-btn">Proceed to Checkout</button>
      ) : (
        <div>
          <p>Please log in to checkout</p>
          <button>Login</button>
        </div>
      )}
    </div>
  );

  return (
    <div className="shopping-cart">
      <h2>Shopping Cart</h2>
      {items.length === 0 ? (
        renderEmptyCart()
      ) : (
        <>
          {renderCartItems()}
          {renderCheckoutSection()}
        </>
      )}
    </div>
  );
}
```

## Conditional Styling

### Conditional CSS Classes

```jsx
function Button({ variant, disabled, children }) {
  const getButtonClass = () => {
    let classes = ["btn"];

    if (variant === "primary") classes.push("btn-primary");
    if (variant === "secondary") classes.push("btn-secondary");
    if (disabled) classes.push("btn-disabled");

    return classes.join(" ");
  };

  return (
    <button className={getButtonClass()} disabled={disabled}>
      {children}
    </button>
  );
}
```

### Conditional Inline Styles

```jsx
function ProgressBar({ progress, status }) {
  const getBarStyle = () => ({
    width: `${progress}%`,
    backgroundColor:
      status === "error" ? "red" : status === "warning" ? "orange" : "green",
    transition: "width 0.3s ease",
  });

  return (
    <div className="progress-container">
      <div className="progress-bar" style={getBarStyle()} />
      {progress > 0 && <span className="progress-text">{progress}%</span>}
    </div>
  );
}
```

## Conditional Rendering Patterns

### Guard Clauses

```jsx
function UserCard({ user }) {
  if (!user) return null;
  if (user.isDeleted) return <div>User not found</div>;
  if (user.isBanned) return <div>User is banned</div>;

  return (
    <div className="user-card">
      <img src={user.avatar} alt={user.name} />
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
}
```

### HOC for Conditional Rendering

```jsx
function withAuth(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
      return <LoginPrompt />;
    }

    if (!user.isVerified) {
      return <VerificationRequired />;
    }

    return <WrappedComponent {...props} user={user} />;
  };
}

const ProtectedDashboard = withAuth(Dashboard);
```

### Custom Hook for Conditional Logic

```jsx
function usePermissions(user, resource) {
  return useMemo(() => {
    if (!user) return { canRead: false, canWrite: false, canDelete: false };

    const isOwner = user.id === resource.ownerId;
    const isAdmin = user.role === "admin";
    const isModerator = user.role === "moderator";

    return {
      canRead: true,
      canWrite: isOwner || isAdmin || isModerator,
      canDelete: isOwner || isAdmin,
    };
  }, [user, resource]);
}

function ResourceCard({ resource }) {
  const { user } = useAuth();
  const permissions = usePermissions(user, resource);

  return (
    <div className="resource-card">
      <h3>{resource.title}</h3>
      <p>{resource.description}</p>

      {permissions.canWrite && <button>Edit</button>}

      {permissions.canDelete && <button>Delete</button>}
    </div>
  );
}
```

## Performance Considerations

### Avoiding Unnecessary Re-renders

```jsx
function ExpensiveComponent({ shouldRender, data }) {
  const memoizedComponent = useMemo(() => {
    if (!shouldRender) return null;

    return (
      <div>
        <h2>Expensive Calculation</h2>
        <ComplexVisualization data={data} />
      </div>
    );
  }, [shouldRender, data]);

  return memoizedComponent;
}
```

### Lazy Loading with Conditional Rendering

```jsx
const LazyComponent = lazy(() => import("./HeavyComponent"));

function ConditionalLazyLoader({ shouldLoad }) {
  return (
    <div>
      {shouldLoad ? (
        <Suspense fallback={<div>Loading...</div>}>
          <LazyComponent />
        </Suspense>
      ) : (
        <button onClick={() => setShouldLoad(true)}>Load Component</button>
      )}
    </div>
  );
}
```

## TypeScript Conditional Rendering

```tsx
interface User {
  id: number;
  name: string;
  role: "admin" | "user" | "moderator";
  isActive: boolean;
}

interface UserCardProps {
  user: User | null;
  showActions?: boolean;
}

function UserCard({ user, showActions = false }: UserCardProps): JSX.Element {
  if (!user) {
    return <div>No user data available</div>;
  }

  const renderUserActions = (): JSX.Element | null => {
    if (!showActions) return null;

    return (
      <div className="user-actions">
        {user.role === "admin" && <button>Admin Panel</button>}
        {user.isActive ? (
          <button>Deactivate</button>
        ) : (
          <button>Activate</button>
        )}
      </div>
    );
  };

  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <span className={`role role-${user.role}`}>
        {user.role.toUpperCase()}
      </span>
      {renderUserActions()}
    </div>
  );
}
```

## Conditional Rendering Techniques Comparison

| Technique      | Use Case               | Pros                   | Cons                            |
| -------------- | ---------------------- | ---------------------- | ------------------------------- |
| `if/else`      | Complex logic          | Clear, readable        | Can't be used inline            |
| Ternary `? :`  | Simple conditions      | Inline, concise        | Can be hard to read when nested |
| Logical `&&`   | Show/hide elements     | Very concise           | Falsy values can cause issues   |
| Switch         | Multiple conditions    | Clean for many options | Verbose for simple cases        |
| Function calls | Complex rendering      | Reusable, testable     | Extra function calls            |
| Object mapping | Status-based rendering | Maintainable, fast     | Setup overhead                  |

## Best Practices

1. **Keep It Simple**: Use the simplest conditional rendering technique for each case
2. **Avoid Deep Nesting**: Extract complex conditions into separate functions or components
3. **Use Guard Clauses**: Return early for invalid states to reduce nesting
4. **Memoize Expensive Conditions**: Use useMemo for computationally expensive conditional logic
5. **Handle Falsy Values**: Be careful with && operator and falsy values (0, '', false)
6. **Extract Complex Logic**: Move complex conditional logic to custom hooks or utility functions
7. **Type Your Conditions**: Use TypeScript to ensure type safety in conditional rendering
8. **Consider Performance**: Avoid creating new objects/functions in render conditions

## Common Mistakes

1. **Falsy Value Rendering**: `{count && <div>{count}</div>}` renders 0 when count is 0
2. **Creating Objects in Render**: Creating new objects/arrays in conditional expressions
3. **Not Handling Loading States**: Forgetting to show loading indicators
4. **Overly Complex Conditions**: Making conditions too complex and hard to read
5. **Not Using Keys**: Forgetting keys when conditionally rendering lists
6. **Memory Leaks**: Not cleaning up resources in conditionally rendered components

## Interview Questions

**Q: What's the difference between conditional rendering with && and ternary operator?**
A: The && operator only renders when the condition is truthy, while ternary always renders one of two options. && can cause issues with falsy values like 0.

**Q: How do you handle multiple conditional renders efficiently?**
A: Use guard clauses for early returns, extract logic into functions, use object mapping for status-based rendering, or implement switch-like patterns.

**Q: What are the performance implications of conditional rendering?**
A: Conditional rendering can cause components to mount/unmount, triggering lifecycle methods. Use techniques like CSS visibility or React.memo for better performance when appropriate.

**Q: How do you conditionally render components with TypeScript?**
A: Use union types, optional properties, and proper type guards to ensure type safety in conditional rendering scenarios.

**Q: When should you use a Higher-Order Component for conditional rendering?**
A: When you have common conditional logic (like authentication) that applies to multiple components, HOCs can provide a clean abstraction.
