# React Container Pattern

The Container Pattern separates presentational and business logic concerns by splitting components into Container (smart) components that handle data and logic, and Presentational (dumb) components that handle UI rendering. This pattern promotes separation of concerns and reusability.

## Basic Container Pattern

### Simple Container-Presenter Split

```tsx
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: "online" | "offline" | "away";
}

interface UserListProps {
  users: User[];
  loading: boolean;
  error: string | null;
  onUserClick: (user: User) => void;
  onRefresh: () => void;
}

function UserListPresenter({
  users,
  loading,
  error,
  onUserClick,
  onRefresh,
}: UserListProps) {
  if (loading) {
    return (
      <div className="user-list-loading">
        <div className="spinner" />
        <p>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-list-error">
        <p>Error: {error}</p>
        <button onClick={onRefresh}>Retry</button>
      </div>
    );
  }

  return (
    <div className="user-list">
      <div className="user-list-header">
        <h2>Users ({users.length})</h2>
        <button onClick={onRefresh}>Refresh</button>
      </div>

      <div className="user-grid">
        {users.map((user) => (
          <div
            key={user.id}
            className="user-card"
            onClick={() => onUserClick(user)}
          >
            <img src={user.avatar} alt={user.name} />
            <div className="user-info">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <span className={`status ${user.status}`}>{user.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UserListContainer() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const userData = await response.json();
      setUsers(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleUserClick = useCallback((user: User) => {
    console.log("User clicked:", user);
  }, []);

  const handleRefresh = useCallback(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <UserListPresenter
      users={users}
      loading={loading}
      error={error}
      onUserClick={handleUserClick}
      onRefresh={handleRefresh}
    />
  );
}
```

## Advanced Container Patterns

### Generic Data Container

```tsx
interface DataContainerState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface DataContainerProps<T> {
  fetcher: () => Promise<T>;
  children: (
    state: DataContainerState<T> & {
      refetch: () => void;
      reset: () => void;
    }
  ) => React.ReactNode;
  dependencies?: any[];
  initialData?: T;
}

function DataContainer<T>({
  fetcher,
  children,
  dependencies = [],
  initialData = null,
}: DataContainerProps<T>) {
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  const reset = useCallback(() => {
    setData(initialData);
    setError(null);
    setLoading(false);
  }, [initialData]);

  useEffect(() => {
    fetchData();
  }, [...dependencies, fetchData]);

  return (
    <>
      {children({
        data,
        loading,
        error,
        refetch: fetchData,
        reset,
      })}
    </>
  );
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

function ProductList() {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const fetchProducts = useCallback(async () => {
    const url =
      categoryFilter === "all"
        ? "/api/products"
        : `/api/products?category=${categoryFilter}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return response.json();
  }, [categoryFilter]);

  return (
    <div>
      <div className="filters">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="books">Books</option>
        </select>
      </div>

      <DataContainer<Product[]>
        fetcher={fetchProducts}
        dependencies={[categoryFilter]}
        initialData={[]}
      >
        {({ data: products, loading, error, refetch }) => (
          <ProductListPresenter
            products={products || []}
            loading={loading}
            error={error}
            onRefresh={refetch}
            category={categoryFilter}
          />
        )}
      </DataContainer>
    </div>
  );
}

interface ProductListPresenterProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  category: string;
}

function ProductListPresenter({
  products,
  loading,
  error,
  onRefresh,
  category,
}: ProductListPresenterProps) {
  if (loading) {
    return (
      <div className="products-loading">
        <div className="skeleton-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton-card" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-error">
        <h3>Failed to load products</h3>
        <p>{error}</p>
        <button onClick={onRefresh}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="products-grid">
      <div className="products-header">
        <h2>
          {category === "all" ? "All Products" : `${category} Products`}
          <span className="count">({products.length})</span>
        </h2>
        <button onClick={onRefresh}>Refresh</button>
      </div>

      <div className="product-cards">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p className="price">${product.price}</p>
            <span className="category">{product.category}</span>
            <button>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Form Container Pattern

### Reusable Form Container

```tsx
interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

interface FormContainerProps<T> {
  initialValues: T;
  validationSchema?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit: (values: T) => Promise<void>;
  children: (
    formState: FormState<T> & {
      setValue: (field: keyof T, value: any) => void;
      setFieldTouched: (field: keyof T) => void;
      handleSubmit: (e: React.FormEvent) => void;
      resetForm: () => void;
    }
  ) => React.ReactNode;
}

function FormContainer<T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit,
  children,
}: FormContainerProps<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = useCallback(
    (currentValues: T) => {
      if (!validationSchema) return {};
      return validationSchema(currentValues);
    },
    [validationSchema]
  );

  const isValid = useMemo(() => {
    const currentErrors = validate(values);
    return Object.keys(currentErrors).length === 0;
  }, [values, validate]);

  const setValue = useCallback(
    (field: keyof T, value: any) => {
      setValues((prev) => ({ ...prev, [field]: value }));

      if (touched[field]) {
        const newValues = { ...values, [field]: value };
        const newErrors = validate(newValues);
        setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
      }
    },
    [values, touched, validate]
  );

  const setFieldTouched = useCallback(
    (field: keyof T) => {
      setTouched((prev) => ({ ...prev, [field]: true }));

      const currentErrors = validate(values);
      if (currentErrors[field]) {
        setErrors((prev) => ({ ...prev, [field]: currentErrors[field] }));
      }
    },
    [values, validate]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const allErrors = validate(values);
      const allTouched = Object.keys(values).reduce(
        (acc, key) => ({
          ...acc,
          [key]: true,
        }),
        {} as Partial<Record<keyof T, boolean>>
      );

      setTouched(allTouched);
      setErrors(allErrors);

      if (Object.keys(allErrors).length > 0) {
        return;
      }

      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error("Form submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validate, onSubmit]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return (
    <>
      {children({
        values,
        errors,
        touched,
        isSubmitting,
        isValid,
        setValue,
        setFieldTouched,
        handleSubmit,
        resetForm,
      })}
    </>
  );
}

interface LoginFormData {
  email: string;
  password: string;
}

function LoginForm() {
  const validateLogin = (values: LoginFormData) => {
    const errors: Partial<Record<keyof LoginFormData, string>> = {};

    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Email is invalid";
    }

    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    return errors;
  };

  const handleSubmit = async (values: LoginFormData) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    console.log("Login successful:", data);
  };

  return (
    <FormContainer
      initialValues={{ email: "", password: "" }}
      validationSchema={validateLogin}
      onSubmit={handleSubmit}
    >
      {({
        values,
        errors,
        touched,
        isSubmitting,
        isValid,
        setValue,
        setFieldTouched,
        handleSubmit,
        resetForm,
      }) => (
        <LoginFormPresenter
          values={values}
          errors={errors}
          touched={touched}
          isSubmitting={isSubmitting}
          isValid={isValid}
          onFieldChange={setValue}
          onFieldBlur={setFieldTouched}
          onSubmit={handleSubmit}
          onReset={resetForm}
        />
      )}
    </FormContainer>
  );
}

interface LoginFormPresenterProps {
  values: LoginFormData;
  errors: Partial<Record<keyof LoginFormData, string>>;
  touched: Partial<Record<keyof LoginFormData, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
  onFieldChange: (field: keyof LoginFormData, value: string) => void;
  onFieldBlur: (field: keyof LoginFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
}

function LoginFormPresenter({
  values,
  errors,
  touched,
  isSubmitting,
  isValid,
  onFieldChange,
  onFieldBlur,
  onSubmit,
  onReset,
}: LoginFormPresenterProps) {
  return (
    <form onSubmit={onSubmit} className="login-form">
      <h2>Login</h2>

      <div className="form-field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={values.email}
          onChange={(e) => onFieldChange("email", e.target.value)}
          onBlur={() => onFieldBlur("email")}
          className={errors.email && touched.email ? "error" : ""}
        />
        {errors.email && touched.email && (
          <span className="error-message">{errors.email}</span>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={values.password}
          onChange={(e) => onFieldChange("password", e.target.value)}
          onBlur={() => onFieldBlur("password")}
          className={errors.password && touched.password ? "error" : ""}
        />
        {errors.password && touched.password && (
          <span className="error-message">{errors.password}</span>
        )}
      </div>

      <div className="form-actions">
        <button type="button" onClick={onReset}>
          Reset
        </button>
        <button type="submit" disabled={!isValid || isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </div>
    </form>
  );
}
```

## Higher-Order Container Components

### Enhanced Container HOC

```tsx
interface WithDataProps<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function withDataFetching<T, P extends WithDataProps<T>>(
  WrappedComponent: React.ComponentType<P>,
  fetcher: () => Promise<T>,
  options: {
    pollInterval?: number;
    retryAttempts?: number;
    cacheKey?: string;
  } = {}
) {
  return function WithDataComponent(props: Omit<P, keyof WithDataProps<T>>) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    const { pollInterval, retryAttempts = 3, cacheKey } = options;

    const fetchData = useCallback(async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await fetcher();
        setData(result);
        setRetryCount(0);

        if (cacheKey) {
          sessionStorage.setItem(cacheKey, JSON.stringify(result));
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch data";
        setError(errorMessage);

        if (retryCount < retryAttempts) {
          setTimeout(() => {
            setRetryCount((prev) => prev + 1);
            fetchData();
          }, 1000 * Math.pow(2, retryCount));
        }
      } finally {
        setLoading(false);
      }
    }, [retryCount, retryAttempts, cacheKey]);

    useEffect(() => {
      if (cacheKey) {
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          try {
            setData(JSON.parse(cached));
            setLoading(false);
            return;
          } catch {
            sessionStorage.removeItem(cacheKey);
          }
        }
      }

      fetchData();
    }, [fetchData, cacheKey]);

    useEffect(() => {
      if (!pollInterval) return;

      const interval = setInterval(fetchData, pollInterval);
      return () => clearInterval(interval);
    }, [fetchData, pollInterval]);

    const enhancedProps = {
      ...props,
      data,
      loading,
      error,
      refetch: fetchData,
    } as P;

    return <WrappedComponent {...enhancedProps} />;
  };
}

interface NotificationListProps extends WithDataProps<Notification[]> {
  onMarkAsRead: (id: string) => void;
}

function NotificationListPresenter({
  data: notifications,
  loading,
  error,
  refetch,
  onMarkAsRead,
}: NotificationListProps) {
  if (loading) return <div>Loading notifications...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!notifications?.length) return <div>No notifications</div>;

  return (
    <div className="notifications">
      {notifications.map((notification) => (
        <div key={notification.id} className="notification">
          <p>{notification.message}</p>
          <button onClick={() => onMarkAsRead(notification.id)}>
            Mark as Read
          </button>
        </div>
      ))}
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}

const NotificationListContainer = withDataFetching(
  NotificationListPresenter,
  async () => {
    const response = await fetch("/api/notifications");
    return response.json();
  },
  {
    pollInterval: 30000,
    retryAttempts: 3,
    cacheKey: "notifications",
  }
);

function NotificationList() {
  const handleMarkAsRead = useCallback(async (id: string) => {
    await fetch(`/api/notifications/${id}/read`, { method: "PUT" });
  }, []);

  return <NotificationListContainer onMarkAsRead={handleMarkAsRead} />;
}
```

## Container Pattern with Custom Hooks

### Data Fetching Hook

```tsx
function useDataFetching<T>(
  fetcher: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    fetchData();
  }, [...dependencies, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

function DashboardContainer() {
  const [dateRange, setDateRange] = useState({
    start: "2024-01-01",
    end: "2024-12-31",
  });

  const {
    data: analytics,
    loading: analyticsLoading,
    error: analyticsError,
    refetch: refetchAnalytics,
  } = useDataFetching(
    () =>
      fetch(
        `/api/analytics?start=${dateRange.start}&end=${dateRange.end}`
      ).then((res) => res.json()),
    [dateRange]
  );

  const {
    data: notifications,
    loading: notificationsLoading,
    error: notificationsError,
    refetch: refetchNotifications,
  } = useDataFetching(() =>
    fetch("/api/notifications").then((res) => res.json())
  );

  const handleDateRangeChange = useCallback((newRange: typeof dateRange) => {
    setDateRange(newRange);
  }, []);

  const handleRefreshAll = useCallback(() => {
    refetchAnalytics();
    refetchNotifications();
  }, [refetchAnalytics, refetchNotifications]);

  return (
    <DashboardPresenter
      analytics={analytics}
      analyticsLoading={analyticsLoading}
      analyticsError={analyticsError}
      notifications={notifications}
      notificationsLoading={notificationsLoading}
      notificationsError={notificationsError}
      dateRange={dateRange}
      onDateRangeChange={handleDateRangeChange}
      onRefreshAll={handleRefreshAll}
    />
  );
}

interface DashboardPresenterProps {
  analytics: any;
  analyticsLoading: boolean;
  analyticsError: string | null;
  notifications: any[];
  notificationsLoading: boolean;
  notificationsError: string | null;
  dateRange: { start: string; end: string };
  onDateRangeChange: (range: { start: string; end: string }) => void;
  onRefreshAll: () => void;
}

function DashboardPresenter({
  analytics,
  analyticsLoading,
  analyticsError,
  notifications,
  notificationsLoading,
  notificationsError,
  dateRange,
  onDateRangeChange,
  onRefreshAll,
}: DashboardPresenterProps) {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="controls">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) =>
              onDateRangeChange({ ...dateRange, start: e.target.value })
            }
          />
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) =>
              onDateRangeChange({ ...dateRange, end: e.target.value })
            }
          />
          <button onClick={onRefreshAll}>Refresh All</button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="analytics-section">
          <h2>Analytics</h2>
          {analyticsLoading && <div>Loading analytics...</div>}
          {analyticsError && <div>Error: {analyticsError}</div>}
          {analytics && <AnalyticsChart data={analytics} />}
        </div>

        <div className="notifications-section">
          <h2>Notifications</h2>
          {notificationsLoading && <div>Loading notifications...</div>}
          {notificationsError && <div>Error: {notificationsError}</div>}
          {notifications && <NotificationList notifications={notifications} />}
        </div>
      </div>
    </div>
  );
}
```

## Testing Container Components

### Container Testing Strategies

```tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
  rest.get("/api/users", (req, res, ctx) => {
    return res(
      ctx.json([
        { id: "1", name: "John Doe", email: "john@example.com" },
        { id: "2", name: "Jane Smith", email: "jane@example.com" },
      ])
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("UserListContainer", () => {
  it("should fetch and display users", async () => {
    render(<UserListContainer />);

    expect(screen.getByText("Loading users...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });

    expect(screen.getByText("Users (2)")).toBeInTheDocument();
  });

  it("should handle errors gracefully", async () => {
    server.use(
      rest.get("/api/users", (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: "Server error" }));
      })
    );

    render(<UserListContainer />);

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });

    expect(screen.getByText("Retry")).toBeInTheDocument();
  });

  it("should refetch data on retry", async () => {
    server.use(
      rest.get("/api/users", (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: "Server error" }));
      })
    );

    render(<UserListContainer />);

    await waitFor(() => {
      expect(screen.getByText("Retry")).toBeInTheDocument();
    });

    server.use(
      rest.get("/api/users", (req, res, ctx) => {
        return res(
          ctx.json([{ id: "1", name: "John Doe", email: "john@example.com" }])
        );
      })
    );

    fireEvent.click(screen.getByText("Retry"));

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
  });
});

describe("DataContainer", () => {
  it("should handle generic data fetching", async () => {
    const mockFetcher = jest.fn().mockResolvedValue(["item1", "item2"]);

    render(
      <DataContainer fetcher={mockFetcher}>
        {({ data, loading, error }) => (
          <div>
            {loading && <span>Loading...</span>}
            {error && <span>Error: {error}</span>}
            {data && <span>Items: {data.join(", ")}</span>}
          </div>
        )}
      </DataContainer>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Items: item1, item2")).toBeInTheDocument();
    });

    expect(mockFetcher).toHaveBeenCalledTimes(1);
  });
});
```

## Best Practices

### Container Pattern Guidelines

1. **Clear Separation**: Keep business logic in containers and UI logic in presenters.

2. **Prop Interface**: Define clear prop interfaces between containers and presenters.

3. **Reusability**: Design presenters to be reusable with different data sources.

4. **Testing**: Test containers and presenters separately for better test coverage.

5. **Performance**: Use React.memo for presenters to prevent unnecessary re-renders.

6. **Error Boundaries**: Wrap containers with error boundaries for better error handling.

### Performance Optimization

```tsx
const UserListPresenter = React.memo<UserListProps>(
  ({ users, loading, error, onUserClick, onRefresh }) => {
    const memoizedUsers = useMemo(() => users, [users]);

    const handleUserClick = useCallback(
      (user: User) => {
        onUserClick(user);
      },
      [onUserClick]
    );

    if (loading) return <LoadingComponent />;
    if (error) return <ErrorComponent error={error} onRetry={onRefresh} />;

    return (
      <div className="user-list">
        {memoizedUsers.map((user) => (
          <UserCard key={user.id} user={user} onClick={handleUserClick} />
        ))}
      </div>
    );
  }
);

const UserCard = React.memo<{ user: User; onClick: (user: User) => void }>(
  ({ user, onClick }) => {
    const handleClick = useCallback(() => {
      onClick(user);
    }, [user, onClick]);

    return (
      <div className="user-card" onClick={handleClick}>
        <h3>{user.name}</h3>
        <p>{user.email}</p>
      </div>
    );
  }
);
```

## Interview Questions

**Q: What is the Container Pattern and what problems does it solve?**
A: The Container Pattern separates data fetching and business logic (containers) from UI rendering (presenters). It solves problems like code reusability, separation of concerns, and easier testing by keeping UI components pure and focused on presentation.

**Q: How does the Container Pattern differ from custom hooks?**
A: Container Pattern uses component composition to separate concerns, while custom hooks extract stateful logic into reusable functions. Custom hooks are more modern and provide better reusability, but Container Pattern offers clearer component boundaries.

**Q: When would you choose Container Pattern over custom hooks?**
A: Use Container Pattern when you need clear separation between data logic and UI components, when working with class components, or when you want to enforce strict boundaries between business logic and presentation layers.

**Q: How do you test Container components effectively?**
A: Test containers and presenters separately. Mock API calls for container tests to focus on data flow and state management. Test presenters with different prop combinations to ensure UI renders correctly for all states.

**Q: What are the performance implications of the Container Pattern?**
A: Container Pattern can cause unnecessary re-renders if not optimized. Use React.memo for presenters, useCallback for event handlers, and useMemo for expensive computations. Consider splitting large containers into smaller ones to minimize re-render scope.

The Container Pattern provides a structured approach to separating concerns in React applications, making code more maintainable, testable, and reusable while clearly defining the boundaries between data management and UI presentation.
