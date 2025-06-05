# React Best Practices Guide

## Component Design Principles

### Single Responsibility Principle

Each component should have a single, well-defined purpose.

```jsx
// ❌ Bad: Component doing too many things
function UserDashboard({ userId }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Multiple data fetching, rendering logic, etc.
  return <div>{/* Complex mixed rendering */}</div>;
}

// ✅ Good: Split into focused components
function UserDashboard({ userId }) {
  return (
    <div className="dashboard">
      <UserProfile userId={userId} />
      <UserPosts userId={userId} />
      <UserAnalytics userId={userId} />
      <NotificationCenter userId={userId} />
    </div>
  );
}

function UserProfile({ userId }) {
  const { user, loading, error } = useUser(userId);

  if (loading) return <ProfileSkeleton />;
  if (error) return <ErrorMessage error={error} />;

  return <ProfileCard user={user} />;
}
```

### Composition Over Configuration

Prefer composable components over complex configuration objects.

```jsx
// ❌ Bad: Heavy configuration
function DataTable({
  data,
  columns,
  sortable,
  filterable,
  pageable,
  selectable,
  actions,
  rowHeight,
  headerStyle,
  cellRenderer,
  // ... many more props
}) {
  // Complex internal logic to handle all configurations
}

// ✅ Good: Composable design
function DataTable({ children }) {
  return <div className="data-table">{children}</div>;
}

function TableHeader({ children }) {
  return <thead>{children}</thead>;
}

function TableBody({ children }) {
  return <tbody>{children}</tbody>;
}

function TableRow({ children, selectable, onSelect }) {
  return <tr onClick={selectable ? onSelect : undefined}>{children}</tr>;
}

// Usage - much more flexible
function UserTable({ users }) {
  return (
    <DataTable>
      <TableHeader>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Actions</th>
        </tr>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id} selectable onSelect={() => selectUser(user)}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>
              <ActionButtons user={user} />
            </td>
          </TableRow>
        ))}
      </TableBody>
    </DataTable>
  );
}
```

### Predictable Props Interface

Design clear, predictable prop interfaces with good defaults.

```jsx
// ✅ Good: Clear prop interface with TypeScript
interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
}

function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  onClick,
  type = "button",
  fullWidth = false,
  ...restProps
}: ButtonProps) {
  const classNames = [
    "btn",
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth && "btn-full-width",
    loading && "btn-loading",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classNames}
      disabled={disabled || loading}
      onClick={onClick}
      {...restProps}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
}
```

## State Management Best Practices

### State Colocation

Keep state as close to where it's used as possible.

```jsx
// ❌ Bad: State lifted unnecessarily high
function App() {
  const [userFormData, setUserFormData] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <Header />
      <UserList searchQuery={searchQuery} onSearch={setSearchQuery} />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <UserForm data={userFormData} onChange={setUserFormData} />
      </Modal>
    </div>
  );
}

// ✅ Good: State colocated where it's used
function App() {
  return (
    <div>
      <Header />
      <UserListSection />
      <UserModalSection />
    </div>
  );
}

function UserListSection() {
  const [searchQuery, setSearchQuery] = useState("");

  return <UserList searchQuery={searchQuery} onSearch={setSearchQuery} />;
}

function UserModalSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [userFormData, setUserFormData] = useState({});

  return (
    <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
      <UserForm data={userFormData} onChange={setUserFormData} />
    </Modal>
  );
}
```

### Derived State

Avoid storing derived state when possible.

```jsx
// ❌ Bad: Storing derived state
function ShoppingCart({ items }) {
  const [total, setTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    const newTotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const newCount = items.reduce((sum, item) => sum + item.quantity, 0);
    setTotal(newTotal);
    setItemCount(newCount);
  }, [items]);

  return (
    <div>
      <p>Items: {itemCount}</p>
      <p>Total: ${total}</p>
    </div>
  );
}

// ✅ Good: Calculate derived state
function ShoppingCart({ items }) {
  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  return (
    <div>
      <p>Items: {itemCount}</p>
      <p>Total: ${total}</p>
    </div>
  );
}
```

### State Normalization

Normalize complex state structures for better performance and maintainability.

```jsx
// ❌ Bad: Nested state structure
const [state, setState] = useState({
  users: [
    {
      id: 1,
      name: "John",
      posts: [
        { id: 1, title: "Post 1", comments: [{ id: 1, text: "Comment 1" }] },
      ],
    },
  ],
});

// ✅ Good: Normalized state structure
const [state, setState] = useState({
  users: {
    byId: {
      1: { id: 1, name: "John", postIds: [1] },
    },
    allIds: [1],
  },
  posts: {
    byId: {
      1: { id: 1, title: "Post 1", userId: 1, commentIds: [1] },
    },
    allIds: [1],
  },
  comments: {
    byId: {
      1: { id: 1, text: "Comment 1", postId: 1 },
    },
    allIds: [1],
  },
});

// Selector functions for easy access
const getUser = (state, userId) => state.users.byId[userId];
const getUserPosts = (state, userId) => {
  const user = getUser(state, userId);
  return user?.postIds?.map((postId) => state.posts.byId[postId]) || [];
};
```

## Performance Optimization

### Memoization Strategy

Use memoization wisely to prevent unnecessary re-renders.

```jsx
// ✅ Good: Strategic memoization
const ExpensiveListItem = memo(function ListItem({ item, onUpdate, onDelete }) {
  const handleUpdate = useCallback(
    (newData) => {
      onUpdate(item.id, newData);
    },
    [item.id, onUpdate]
  );

  const handleDelete = useCallback(() => {
    onDelete(item.id);
  }, [item.id, onDelete]);

  const processedData = useMemo(() => {
    return expensiveProcessing(item.data);
  }, [item.data]);

  return (
    <div className="list-item">
      <h3>{item.title}</h3>
      <p>{processedData}</p>
      <button onClick={handleUpdate}>Update</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
});

function List({ items }) {
  const [selectedItems, setSelectedItems] = useState(new Set());

  const handleUpdate = useCallback((id, newData) => {
    // Update logic - this function reference is stable
    updateItem(id, newData);
  }, []);

  const handleDelete = useCallback((id) => {
    // Delete logic - this function reference is stable
    deleteItem(id);
  }, []);

  return (
    <div>
      {items.map((item) => (
        <ExpensiveListItem
          key={item.id}
          item={item}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
```

### Avoid Creating Objects in Render

Don't create new objects/arrays/functions in render methods.

```jsx
// ❌ Bad: Creating objects in render
function UserProfile({ user }) {
  return (
    <div>
      <Avatar
        user={user}
        style={{ width: 50, height: 50 }} // New object every render
        onClick={() => openProfile(user.id)} // New function every render
      />
      <UserDetails
        data={{ name: user.name, email: user.email }} // New object every render
      />
    </div>
  );
}

// ✅ Good: Stable references
const AVATAR_STYLE = { width: 50, height: 50 };

function UserProfile({ user }) {
  const handleAvatarClick = useCallback(() => {
    openProfile(user.id);
  }, [user.id]);

  const userData = useMemo(
    () => ({
      name: user.name,
      email: user.email,
    }),
    [user.name, user.email]
  );

  return (
    <div>
      <Avatar user={user} style={AVATAR_STYLE} onClick={handleAvatarClick} />
      <UserDetails data={userData} />
    </div>
  );
}
```

### Virtualization for Large Lists

Use virtualization for rendering large datasets.

```jsx
import { FixedSizeList as List } from "react-window";

function VirtualizedUserList({ users }) {
  const Row = useCallback(
    ({ index, style }) => (
      <div style={style}>
        <UserCard user={users[index]} />
      </div>
    ),
    [users]
  );

  return (
    <List height={600} itemCount={users.length} itemSize={120} width="100%">
      {Row}
    </List>
  );
}

// For dynamic heights
import { VariableSizeList } from "react-window";

function DynamicVirtualizedList({ items }) {
  const [itemHeights, setItemHeights] = useState({});

  const getItemSize = useCallback(
    (index) => {
      return itemHeights[index] || 100; // Default height
    },
    [itemHeights]
  );

  const setItemHeight = useCallback((index, height) => {
    setItemHeights((prev) => ({ ...prev, [index]: height }));
  }, []);

  const Row = useCallback(
    ({ index, style }) => (
      <div style={style}>
        <MeasuredItem
          item={items[index]}
          onHeightChange={(height) => setItemHeight(index, height)}
        />
      </div>
    ),
    [items, setItemHeight]
  );

  return (
    <VariableSizeList
      height={600}
      itemCount={items.length}
      itemSize={getItemSize}
      width="100%"
    >
      {Row}
    </VariableSizeList>
  );
}
```

## Error Handling and Resilience

### Comprehensive Error Boundaries

Implement error boundaries at multiple levels.

```tsx
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<any> },
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
    this.setState({ errorInfo });

    // Log error to monitoring service
    logError(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    });
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent
          error={this.state.error}
          resetError={() => this.setState({ hasError: false })}
        />
      );
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({
  error,
  resetError,
}: {
  error?: Error;
  resetError: () => void;
}) {
  return (
    <div className="error-boundary">
      <h2>Something went wrong</h2>
      <details style={{ whiteSpace: "pre-wrap" }}>{error?.toString()}</details>
      <button onClick={resetError}>Try again</button>
    </div>
  );
}

// Usage: Wrap different parts of your app
function App() {
  return (
    <ErrorBoundary>
      <Header />
      <ErrorBoundary fallback={MainContentError}>
        <MainContent />
      </ErrorBoundary>
      <ErrorBoundary fallback={SidebarError}>
        <Sidebar />
      </ErrorBoundary>
    </ErrorBoundary>
  );
}
```

### Graceful Loading States

Handle loading and error states consistently.

```jsx
// Custom hook for async operations
function useAsyncOperation(asyncFn, dependencies = []) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });

  const execute = useCallback(async (...args) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await asyncFn(...args);
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      setState({ data: null, loading: false, error });
      throw error;
    }
  }, dependencies);

  useEffect(() => {
    execute();
  }, [execute]);

  return { ...state, retry: execute };
}

// Component with proper loading states
function UserProfile({ userId }) {
  const {
    data: user,
    loading,
    error,
    retry,
  } = useAsyncOperation(() => fetchUser(userId), [userId]);

  if (loading) {
    return <UserProfileSkeleton />;
  }

  if (error) {
    return (
      <ErrorMessage
        error={error}
        onRetry={retry}
        message="Failed to load user profile"
      />
    );
  }

  if (!user) {
    return <EmptyState message="User not found" />;
  }

  return <UserProfileCard user={user} />;
}

// Reusable loading components
function UserProfileSkeleton() {
  return (
    <div className="user-profile-skeleton">
      <div className="skeleton-avatar" />
      <div className="skeleton-name" />
      <div className="skeleton-email" />
      <div className="skeleton-bio" />
    </div>
  );
}

function ErrorMessage({ error, onRetry, message }) {
  return (
    <div className="error-message">
      <h3>{message}</h3>
      <p>{error.message}</p>
      {onRetry && (
        <button onClick={onRetry} className="retry-button">
          Try Again
        </button>
      )}
    </div>
  );
}
```

## Code Organization and Architecture

### Feature-Based Folder Structure

Organize code by features rather than file types.

```
src/
├── components/           # Shared/common components
│   ├── ui/
│   │   ├── Button/
│   │   ├── Modal/
│   │   └── Input/
│   └── layout/
│       ├── Header/
│       └── Sidebar/
├── features/            # Feature-based organization
│   ├── authentication/
│   │   ├── components/
│   │   │   ├── LoginForm/
│   │   │   └── SignupForm/
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   ├── services/
│   │   │   └── authApi.ts
│   │   └── types/
│   │       └── auth.types.ts
│   ├── dashboard/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── services/
│   └── user-management/
│       ├── components/
│       ├── hooks/
│       └── services/
├── hooks/               # Global custom hooks
├── services/            # Global services
├── utils/               # Utility functions
├── types/               # Global types
└── constants/           # Global constants
```

### Custom Hooks for Logic Reuse

Extract and reuse logic through custom hooks.

```jsx
// Custom hook for form handling
function useForm(initialValues, validationSchema) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (name, value) => {
      setValues((prev) => ({ ...prev, [name]: value }));

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: null }));
      }
    },
    [errors]
  );

  const handleBlur = useCallback(
    (name) => {
      setTouched((prev) => ({ ...prev, [name]: true }));

      // Validate field on blur
      if (validationSchema) {
        const fieldError = validateField(name, values[name], validationSchema);
        setErrors((prev) => ({ ...prev, [name]: fieldError }));
      }
    },
    [values, validationSchema]
  );

  const handleSubmit = useCallback(
    async (onSubmit) => {
      setIsSubmitting(true);

      try {
        // Validate all fields
        const validationErrors = validateAll(values, validationSchema);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
          await onSubmit(values);
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validationSchema]
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    setErrors,
  };
}

// Custom hook for API calls
function useApi(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(
    async (overrideOptions = {}) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, { ...options, ...overrideOptions });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
        return result;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [url, options]
  );

  return { data, loading, error, request };
}

// Custom hook for local storage
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
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

  return [storedValue, setValue];
}
```

### Service Layer Pattern

Separate business logic from components.

```jsx
// services/userService.ts
class UserService {
  private baseUrl = '/api/users';

  async getUser(id: string): Promise<User> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    return response.json();
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to update user');
    }

    return response.json();
  }

  async deleteUser(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
  }
}

export const userService = new UserService();

// hooks/useUser.ts
function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchUser() {
      try {
        setLoading(true);
        const userData = await userService.getUser(userId);

        if (!cancelled) {
          setUser(userData);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchUser();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const updateUser = useCallback(async (data: Partial<User>) => {
    try {
      const updatedUser = await userService.updateUser(userId, data);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [userId]);

  return { user, loading, error, updateUser };
}
```

## Testing Best Practices

### Component Testing Strategy

Write tests that focus on behavior rather than implementation.

```jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserProfile } from "./UserProfile";

// Mock external dependencies
jest.mock("../services/userService", () => ({
  userService: {
    getUser: jest.fn(),
    updateUser: jest.fn(),
  },
}));

describe("UserProfile", () => {
  const mockUser = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("displays user information when loaded", async () => {
    userService.getUser.mockResolvedValue(mockUser);

    render(<UserProfile userId="1" />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
    });
  });

  test("handles edit mode correctly", async () => {
    userService.getUser.mockResolvedValue(mockUser);
    userService.updateUser.mockResolvedValue({ ...mockUser, name: "Jane Doe" });

    const user = userEvent.setup();
    render(<UserProfile userId="1" />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // Enter edit mode
    await user.click(screen.getByRole("button", { name: /edit/i }));

    // Update name
    const nameInput = screen.getByDisplayValue("John Doe");
    await user.clear(nameInput);
    await user.type(nameInput, "Jane Doe");

    // Save changes
    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    });

    expect(userService.updateUser).toHaveBeenCalledWith("1", {
      name: "Jane Doe",
    });
  });

  test("displays error message when fetch fails", async () => {
    userService.getUser.mockRejectedValue(new Error("Network error"));

    render(<UserProfile userId="1" />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
    });
  });
});
```

### Custom Hook Testing

Test custom hooks in isolation.

```jsx
import { renderHook, act } from "@testing-library/react";
import { useForm } from "./useForm";

describe("useForm", () => {
  const initialValues = { name: "", email: "" };
  const validationSchema = {
    name: { required: true },
    email: { required: true, email: true },
  };

  test("initializes with correct values", () => {
    const { result } = renderHook(() =>
      useForm(initialValues, validationSchema)
    );

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
  });

  test("handles field changes correctly", () => {
    const { result } = renderHook(() =>
      useForm(initialValues, validationSchema)
    );

    act(() => {
      result.current.handleChange("name", "John Doe");
    });

    expect(result.current.values.name).toBe("John Doe");
  });

  test("validates fields on blur", () => {
    const { result } = renderHook(() =>
      useForm(initialValues, validationSchema)
    );

    act(() => {
      result.current.handleBlur("name");
    });

    expect(result.current.errors.name).toBe("Name is required");
    expect(result.current.touched.name).toBe(true);
  });

  test("handles form submission with validation", async () => {
    const onSubmit = jest.fn();
    const { result } = renderHook(() =>
      useForm(initialValues, validationSchema)
    );

    await act(async () => {
      await result.current.handleSubmit(onSubmit);
    });

    expect(onSubmit).not.toHaveBeenCalled();
    expect(result.current.errors.name).toBe("Name is required");
    expect(result.current.errors.email).toBe("Email is required");
  });
});
```

## Security Best Practices

### Input Sanitization and Validation

Always validate and sanitize user inputs.

```jsx
import DOMPurify from "dompurify";

// Input validation hook
function useInputValidation() {
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const sanitizeHTML = (html) => {
    return DOMPurify.sanitize(html);
  };

  const validateLength = (text, min = 0, max = Infinity) => {
    return text.length >= min && text.length <= max;
  };

  return { validateEmail, sanitizeHTML, validateLength };
}

// Secure form component
function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const { validateEmail, sanitizeHTML, validateLength } = useInputValidation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    // Validate name
    if (!validateLength(formData.name.trim(), 2, 50)) {
      newErrors.name = "Name must be between 2 and 50 characters";
    }

    // Validate email
    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Validate message
    if (!validateLength(formData.message.trim(), 10, 1000)) {
      newErrors.message = "Message must be between 10 and 1000 characters";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Sanitize data before sending
      const sanitizedData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        message: sanitizeHTML(formData.message.trim()),
      };

      await submitForm(sanitizedData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.name}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, name: e.target.value }))
        }
        maxLength={50}
        required
      />
      {errors.name && <span className="error">{errors.name}</span>}

      <input
        type="email"
        value={formData.email}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, email: e.target.value }))
        }
        required
      />
      {errors.email && <span className="error">{errors.email}</span>}

      <textarea
        value={formData.message}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, message: e.target.value }))
        }
        maxLength={1000}
        required
      />
      {errors.message && <span className="error">{errors.message}</span>}

      <button type="submit">Send Message</button>
    </form>
  );
}
```

### Environment Configuration

Properly manage environment variables and secrets.

```jsx
// config/environment.ts
interface EnvironmentConfig {
  apiUrl: string;
  environment: 'development' | 'staging' | 'production';
  enableAnalytics: boolean;
  maxFileSize: number;
  allowedFileTypes: string[];
}

function getEnvironmentConfig(): EnvironmentConfig {
  const env = process.env.NODE_ENV || 'development';

  // Only expose safe environment variables to client
  const config: EnvironmentConfig = {
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001',
    environment: env as any,
    enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
    maxFileSize: parseInt(process.env.REACT_APP_MAX_FILE_SIZE || '5242880'), // 5MB
    allowedFileTypes: (process.env.REACT_APP_ALLOWED_FILE_TYPES || 'jpg,jpeg,png,gif').split(',')
  };

  // Validate configuration
  if (!config.apiUrl) {
    throw new Error('API_URL environment variable is required');
  }

  return config;
}

export const environmentConfig = getEnvironmentConfig();

// Usage in components
function FileUpload() {
  const { maxFileSize, allowedFileTypes } = environmentConfig;

  const validateFile = (file) => {
    if (file.size > maxFileSize) {
      throw new Error(`File size must be less than ${maxFileSize / 1024 / 1024}MB`);
    }

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!allowedFileTypes.includes(fileExtension)) {
      throw new Error(`File type not allowed. Allowed types: ${allowedFileTypes.join(', ')}`);
    }
  };

  return (
    <input
      type="file"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          try {
            validateFile(file);
            handleFileUpload(file);
          } catch (error) {
            showError(error.message);
          }
        }
      }}
    />
  );
}
```

## Accessibility Best Practices

### Semantic HTML and ARIA

Use semantic HTML and ARIA attributes appropriately.

```jsx
function AccessibleModal({ isOpen, onClose, title, children }) {
  const modalRef = useRef();
  const previousFocusRef = useRef();

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      modalRef.current?.focus();
    } else {
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div ref={modalRef} className="modal-content" tabIndex={-1}>
        <header className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="modal-close"
          >
            ×
          </button>
        </header>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

function AccessibleForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subscribe: false,
  });
  const [errors, setErrors] = useState({});

  return (
    <form noValidate>
      <div className="form-field">
        <label htmlFor="name">Full Name *</label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          aria-required="true"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <div id="name-error" role="alert" className="error">
            {errors.name}
          </div>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="email">Email Address *</label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : "email-hint"}
        />
        <div id="email-hint" className="hint">
          We'll never share your email address
        </div>
        {errors.email && (
          <div id="email-error" role="alert" className="error">
            {errors.email}
          </div>
        )}
      </div>

      <div className="form-field">
        <label>
          <input
            type="checkbox"
            checked={formData.subscribe}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, subscribe: e.target.checked }))
            }
          />
          Subscribe to newsletter
        </label>
      </div>

      <button type="submit">Submit Form</button>
    </form>
  );
}
```

### Focus Management

Properly manage focus for keyboard navigation.

```jsx
function AccessibleDropdown({ options, value, onChange, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef();
  const optionRefs = useRef([]);

  const handleKeyDown = (e) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(0);
        } else {
          setFocusedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
        }
        break;

      case "ArrowUp":
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
        }
        break;

      case "Enter":
      case " ":
        e.preventDefault();
        if (isOpen && focusedIndex >= 0) {
          onChange(options[focusedIndex]);
          setIsOpen(false);
          setFocusedIndex(-1);
        } else {
          setIsOpen(!isOpen);
        }
        break;

      case "Escape":
        setIsOpen(false);
        setFocusedIndex(-1);
        dropdownRef.current?.focus();
        break;
    }
  };

  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && optionRefs.current[focusedIndex]) {
      optionRefs.current[focusedIndex].scrollIntoView({
        block: "nearest",
      });
    }
  }, [focusedIndex, isOpen]);

  return (
    <div className="dropdown" onKeyDown={handleKeyDown}>
      <button
        ref={dropdownRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby="dropdown-label"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value || placeholder}
      </button>

      {isOpen && (
        <ul role="listbox" className="dropdown-options">
          {options.map((option, index) => (
            <li
              key={option.value}
              ref={(el) => (optionRefs.current[index] = el)}
              role="option"
              aria-selected={option.value === value}
              className={`dropdown-option ${
                index === focusedIndex ? "focused" : ""
              }`}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## Key Takeaways

### Performance

- Minimize re-renders with proper memoization
- Use virtualization for large datasets
- Implement code splitting and lazy loading
- Avoid creating objects/functions in render
- Profile your app regularly

### Architecture

- Organize code by features, not file types
- Use composition over configuration
- Extract reusable logic into custom hooks
- Implement proper error boundaries
- Separate business logic from UI logic

### Code Quality

- Write tests that focus on behavior
- Use TypeScript for better type safety
- Implement consistent error handling
- Follow accessibility best practices
- Validate and sanitize all inputs

### Developer Experience

- Use meaningful component and prop names
- Provide good defaults for optional props
- Write comprehensive documentation
- Use linting and formatting tools
- Implement proper CI/CD processes
