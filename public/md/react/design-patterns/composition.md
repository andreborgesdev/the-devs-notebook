# React Composition Pattern

The Composition Pattern is a fundamental React pattern that allows you to build complex components by combining simpler ones. It promotes reusability, flexibility, and maintainability by favoring composition over inheritance.

## Basic Composition Concepts

### Children Prop Pattern

```tsx
interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

function Container({ children, className = "" }: ContainerProps) {
  return <div className={`container ${className}`}>{children}</div>;
}

function App() {
  return (
    <Container>
      <h1>Welcome</h1>
      <p>This is composed content</p>
    </Container>
  );
}
```

### Component Composition

```tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

function Card({ children, className = "" }: CardProps) {
  return <div className={`card ${className}`}>{children}</div>;
}

interface CardHeaderProps {
  children: React.ReactNode;
  actions?: React.ReactNode;
}

function CardHeader({ children, actions }: CardHeaderProps) {
  return (
    <div className="card-header">
      <div className="card-title">{children}</div>
      {actions && <div className="card-actions">{actions}</div>}
    </div>
  );
}

interface CardBodyProps {
  children: React.ReactNode;
}

function CardBody({ children }: CardBodyProps) {
  return <div className="card-body">{children}</div>;
}

interface CardFooterProps {
  children: React.ReactNode;
}

function CardFooter({ children }: CardFooterProps) {
  return <div className="card-footer">{children}</div>;
}

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

function UserProfileCard({ user }: { user: User }) {
  return (
    <Card className="user-profile">
      <Card.Header actions={<button className="edit-btn">Edit</button>}>
        {user.name}
      </Card.Header>

      <Card.Body>
        <img src={user.avatar} alt={user.name} />
        <p>{user.bio}</p>
        <div className="user-stats">
          <span>Posts: {user.postCount}</span>
          <span>Followers: {user.followerCount}</span>
        </div>
      </Card.Body>

      <Card.Footer>
        <button className="follow-btn">Follow</button>
        <button className="message-btn">Message</button>
      </Card.Footer>
    </Card>
  );
}
```

## Advanced Composition Patterns

### Render Props Pattern

```tsx
interface DataFetcherProps<T> {
  url: string;
  children: (data: {
    data: T | null;
    loading: boolean;
    error: Error | null;
    refetch: () => void;
  }) => React.ReactNode;
}

function DataFetcher<T>({ url, children }: DataFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return <>{children({ data, loading, error, refetch: fetchData })}</>;
}

function UserList() {
  return (
    <DataFetcher<User[]> url="/api/users">
      {({ data: users, loading, error, refetch }) => {
        if (loading) return <div>Loading users...</div>;
        if (error) return <div>Error: {error.message}</div>;
        if (!users) return <div>No users found</div>;

        return (
          <div>
            <button onClick={refetch}>Refresh</button>
            <ul>
              {users.map((user) => (
                <li key={user.id}>{user.name}</li>
              ))}
            </ul>
          </div>
        );
      }}
    </DataFetcher>
  );
}

function UserCount() {
  return (
    <DataFetcher<User[]> url="/api/users">
      {({ data: users, loading }) =>
        loading ? (
          <span>Loading...</span>
        ) : (
          <span>Total Users: {users?.length || 0}</span>
        )
      }
    </DataFetcher>
  );
}
```

### Function as Children Pattern

```tsx
interface ToggleProps {
  initial?: boolean;
  children: (state: {
    isOn: boolean;
    toggle: () => void;
    turnOn: () => void;
    turnOff: () => void;
  }) => React.ReactNode;
}

function Toggle({ initial = false, children }: ToggleProps) {
  const [isOn, setIsOn] = useState(initial);

  const toggle = useCallback(() => setIsOn((prev) => !prev), []);
  const turnOn = useCallback(() => setIsOn(true), []);
  const turnOff = useCallback(() => setIsOn(false), []);

  return <>{children({ isOn, toggle, turnOn, turnOff })}</>;
}

function ToggleButton() {
  return (
    <Toggle>
      {({ isOn, toggle }) => (
        <button onClick={toggle} className={isOn ? "btn-on" : "btn-off"}>
          {isOn ? "ON" : "OFF"}
        </button>
      )}
    </Toggle>
  );
}

function ToggleContent() {
  return (
    <Toggle initial={true}>
      {({ isOn, toggle, turnOff }) => (
        <div>
          <button onClick={toggle}>Toggle Content</button>
          {isOn && (
            <div className="content">
              <p>This content can be toggled</p>
              <button onClick={turnOff}>Hide</button>
            </div>
          )}
        </div>
      )}
    </Toggle>
  );
}
```

### Higher-Order Component (HOC) Composition

```tsx
interface WithLoadingProps {
  isLoading?: boolean;
}

function withLoading<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithLoadingComponent(props: P & WithLoadingProps) {
    const { isLoading, ...otherProps } = props;

    if (isLoading) {
      return (
        <div className="loading-wrapper">
          <div className="spinner" />
          <p>Loading...</p>
        </div>
      );
    }

    return <WrappedComponent {...(otherProps as P)} />;
  };
}

interface WithErrorProps {
  error?: Error | null;
}

function withError<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function WithErrorComponent(props: P & WithErrorProps) {
    const { error, ...otherProps } = props;

    if (error) {
      return (
        <div className="error-wrapper">
          <h3>Something went wrong</h3>
          <p>{error.message}</p>
        </div>
      );
    }

    return <WrappedComponent {...(otherProps as P)} />;
  };
}

function UserProfile({ user }: { user: User }) {
  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}

const EnhancedUserProfile = withError(withLoading(UserProfile));

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchUser()
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return <EnhancedUserProfile user={user!} isLoading={loading} error={error} />;
}
```

## Layout Composition Patterns

### Flexible Layout Components

```tsx
interface LayoutProps {
  children: React.ReactNode;
  direction?: "row" | "column";
  spacing?: "none" | "sm" | "md" | "lg";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
}

function Flex({
  children,
  direction = "row",
  spacing = "md",
  align = "start",
  justify = "start",
}: LayoutProps) {
  const classNames = [
    "flex",
    `flex-${direction}`,
    `spacing-${spacing}`,
    `align-${align}`,
    `justify-${justify}`,
  ].join(" ");

  return <div className={classNames}>{children}</div>;
}

interface GridProps {
  children: React.ReactNode;
  columns?: number | "auto";
  gap?: "none" | "sm" | "md" | "lg";
  responsive?: boolean;
}

function Grid({
  children,
  columns = "auto",
  gap = "md",
  responsive = true,
}: GridProps) {
  const classNames = [
    "grid",
    columns === "auto" ? "grid-auto" : `grid-cols-${columns}`,
    `gap-${gap}`,
    responsive && "grid-responsive",
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={classNames}>{children}</div>;
}

function AppLayout() {
  return (
    <div className="app">
      <header className="app-header">
        <Flex justify="between" align="center">
          <div className="logo">Logo</div>
          <nav>
            <Flex spacing="lg" align="center">
              <a href="/home">Home</a>
              <a href="/about">About</a>
              <a href="/contact">Contact</a>
            </Flex>
          </nav>
        </Flex>
      </header>

      <main className="app-main">
        <Flex direction="row" spacing="lg">
          <aside className="sidebar">
            <div>Sidebar Content</div>
          </aside>

          <div className="content">
            <Grid columns={3} gap="lg" responsive>
              <Card>Card 1</Card>
              <Card>Card 2</Card>
              <Card>Card 3</Card>
              <Card>Card 4</Card>
              <Card>Card 5</Card>
              <Card>Card 6</Card>
            </Grid>
          </div>
        </Flex>
      </main>

      <footer className="app-footer">
        <p>&copy; 2024 My App</p>
      </footer>
    </div>
  );
}
```

### Conditional Composition

```tsx
interface ConditionalWrapperProps {
  condition: boolean;
  wrapper: (children: React.ReactNode) => React.ReactNode;
  children: React.ReactNode;
}

function ConditionalWrapper({
  condition,
  wrapper,
  children,
}: ConditionalWrapperProps) {
  return condition ? <>{wrapper(children)}</> : <>{children}</>;
}

interface ShowProps {
  when: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

function Show({ when, children, fallback = null }: ShowProps) {
  return when ? <>{children}</> : <>{fallback}</>;
}

function For<T>({
  each,
  render,
  fallback,
}: {
  each: T[];
  render: (item: T, index: number) => React.ReactNode;
  fallback?: React.ReactNode;
}) {
  if (each.length === 0) {
    return <>{fallback}</>;
  }

  return <>{each.map(render)}</>;
}

function UserDashboard({
  user,
  posts,
  isAdmin,
}: {
  user: User;
  posts: Post[];
  isAdmin: boolean;
}) {
  return (
    <div className="dashboard">
      <ConditionalWrapper
        condition={isAdmin}
        wrapper={(children) => (
          <div className="admin-panel">
            <div className="admin-badge">Admin</div>
            {children}
          </div>
        )}
      >
        <h1>Welcome, {user.name}</h1>
      </ConditionalWrapper>

      <Show
        when={user.isVerified}
        fallback={
          <div className="verification-notice">
            Please verify your email address
          </div>
        }
      >
        <div className="verified-badge">✓ Verified</div>
      </Show>

      <section className="posts-section">
        <h2>Your Posts</h2>
        <For
          each={posts}
          render={(post, index) => (
            <PostCard key={post.id} post={post} index={index} />
          )}
          fallback={
            <div className="no-posts">
              <p>You haven't created any posts yet.</p>
              <button>Create Your First Post</button>
            </div>
          }
        />
      </section>
    </div>
  );
}
```

## Form Composition Patterns

### Compound Form Components

```tsx
interface FormContextType {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  setValue: (name: string, value: any) => void;
  setError: (name: string, error: string) => void;
  setTouched: (name: string, touched: boolean) => void;
  validateField: (name: string) => void;
  resetForm: () => void;
}

const FormContext = createContext<FormContextType | null>(null);

function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("Form components must be used within a Form");
  }
  return context;
}

interface FormProps {
  initialValues?: Record<string, any>;
  onSubmit: (values: Record<string, any>) => void;
  children: React.ReactNode;
}

function Form({ initialValues = {}, onSubmit, children }: FormProps) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const setValue = useCallback(
    (name: string, value: any) => {
      setValues((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors((prev) => {
          const { [name]: _, ...rest } = prev;
          return rest;
        });
      }
    },
    [errors]
  );

  const setError = useCallback((name: string, error: string) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  const setTouchedField = useCallback((name: string, isTouched: boolean) => {
    setTouched((prev) => ({ ...prev, [name]: isTouched }));
  }, []);

  const validateField = useCallback(
    (name: string) => {
      // Basic validation - extend as needed
      const value = values[name];
      if (!value && value !== 0) {
        setError(name, `${name} is required`);
      }
    },
    [values, setError]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fieldNames = Object.keys(values);
    const hasErrors = fieldNames.some((name) => {
      validateField(name);
      return errors[name];
    });

    if (!hasErrors) {
      onSubmit(values);
    }
  };

  const contextValue: FormContextType = {
    values,
    errors,
    touched,
    setValue,
    setError,
    setTouched: setTouchedField,
    validateField,
    resetForm,
  };

  return (
    <FormContext.Provider value={contextValue}>
      <form onSubmit={handleSubmit}>{children}</form>
    </FormContext.Provider>
  );
}

interface FieldProps {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  validate?: (value: any) => string | undefined;
}

function Field({
  name,
  label,
  type = "text",
  placeholder,
  required = false,
  validate,
}: FieldProps) {
  const { values, errors, touched, setValue, setError, setTouched } =
    useFormContext();

  const value = values[name] || "";
  const error = errors[name];
  const isTouched = touched[name];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(name, newValue);

    if (validate) {
      const validationError = validate(newValue);
      if (validationError) {
        setError(name, validationError);
      }
    }
  };

  const handleBlur = () => {
    setTouched(name, true);
    if (required && !value) {
      setError(name, `${label || name} is required`);
    }
  };

  return (
    <div className="field">
      {label && (
        <label htmlFor={name} className="field-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`field-input ${error && isTouched ? "error" : ""}`}
        aria-invalid={error && isTouched ? "true" : "false"}
        aria-describedby={error && isTouched ? `${name}-error` : undefined}
      />

      {error && isTouched && (
        <div id={`${name}-error`} className="field-error">
          {error}
        </div>
      )}
    </div>
  );
}

function SubmitButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { errors } = useFormContext();
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <button
      type="submit"
      disabled={hasErrors}
      {...props}
      className={`submit-button ${hasErrors ? "disabled" : ""}`}
    >
      {children}
    </button>
  );
}

function ResetButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { resetForm } = useFormContext();

  return (
    <button
      type="button"
      onClick={resetForm}
      {...props}
      className="reset-button"
    >
      {children}
    </button>
  );
}

Form.Field = Field;
Form.Submit = SubmitButton;
Form.Reset = ResetButton;

function ContactForm() {
  const handleSubmit = (values: Record<string, any>) => {
    console.log("Form submitted:", values);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
  };

  return (
    <Form
      initialValues={{ name: "", email: "", message: "" }}
      onSubmit={handleSubmit}
    >
      <Form.Field
        name="name"
        label="Full Name"
        placeholder="Enter your full name"
        required
      />

      <Form.Field
        name="email"
        label="Email"
        type="email"
        placeholder="Enter your email"
        required
        validate={validateEmail}
      />

      <Form.Field
        name="message"
        label="Message"
        placeholder="Enter your message"
        required
      />

      <div className="form-actions">
        <Form.Reset>Reset</Form.Reset>
        <Form.Submit>Send Message</Form.Submit>
      </div>
    </Form>
  );
}
```

## Modal and Dialog Composition

### Compound Modal Components

```tsx
interface ModalContextType {
  isOpen: boolean;
  close: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("Modal components must be used within a Modal");
  }
  return context;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
}

function Modal({
  isOpen,
  onClose,
  children,
  closeOnBackdrop = true,
  closeOnEscape = true,
}: ModalProps) {
  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
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
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, closeOnEscape]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  const contextValue: ModalContextType = {
    isOpen,
    close: onClose,
  };

  return (
    <ModalContext.Provider value={contextValue}>
      <div className="modal-backdrop" onClick={handleBackdropClick}>
        <div className="modal-content" role="dialog" aria-modal="true">
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  );
}

interface ModalHeaderProps {
  children: React.ReactNode;
  showCloseButton?: boolean;
}

function ModalHeader({ children, showCloseButton = true }: ModalHeaderProps) {
  const { close } = useModalContext();

  return (
    <div className="modal-header">
      <h2 className="modal-title">{children}</h2>
      {showCloseButton && (
        <button
          className="modal-close-button"
          onClick={close}
          aria-label="Close modal"
        >
          ×
        </button>
      )}
    </div>
  );
}

function ModalBody({ children }: { children: React.ReactNode }) {
  return <div className="modal-body">{children}</div>;
}

function ModalFooter({ children }: { children: React.ReactNode }) {
  return <div className="modal-footer">{children}</div>;
}

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header>Confirm Deletion</Modal.Header>

      <Modal.Body>
        <p>
          Are you sure you want to delete <strong>{itemName}</strong>? This
          action cannot be undone.
        </p>
      </Modal.Body>

      <Modal.Footer>
        <button className="btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button
          className="btn-danger"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          Delete
        </button>
      </Modal.Footer>
    </Modal>
  );
}
```

## Data Composition Patterns

### Provider Composition

```tsx
interface User {
  id: string;
  name: string;
  email: string;
}

interface Theme {
  mode: "light" | "dark";
  primaryColor: string;
}

interface Settings {
  language: string;
  notifications: boolean;
}

const UserContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
} | null>(null);

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
  updateTheme: (theme: Partial<Theme>) => void;
} | null>(null);

const SettingsContext = createContext<{
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
} | null>(null);

function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>({
    mode: "light",
    primaryColor: "#3b82f6",
  });

  const toggleTheme = useCallback(() => {
    setTheme((prev) => ({
      ...prev,
      mode: prev.mode === "light" ? "dark" : "light",
    }));
  }, []);

  const updateTheme = useCallback((newTheme: Partial<Theme>) => {
    setTheme((prev) => ({ ...prev, ...newTheme }));
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme.mode);
    document.documentElement.style.setProperty(
      "--primary-color",
      theme.primaryColor
    );
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>({
    language: "en",
    notifications: true,
  });

  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

function ComposeProviders({
  providers,
  children,
}: {
  providers: React.ComponentType<{ children: React.ReactNode }>[];
  children: React.ReactNode;
}) {
  return providers.reduceRight(
    (acc, Provider) => <Provider>{acc}</Provider>,
    children
  );
}

function App() {
  return (
    <ComposeProviders
      providers={[UserProvider, ThemeProvider, SettingsProvider]}
    >
      <AppContent />
    </ComposeProviders>
  );
}

function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
}

function Header() {
  const { user } = useUser();
  const { theme, toggleTheme } = useTheme();
  const { settings } = useSettings();

  return (
    <header className="app-header">
      <h1>My App</h1>
      <div className="header-actions">
        <span>Language: {settings.language}</span>
        <button onClick={toggleTheme}>
          {theme.mode === "light" ? "🌙" : "☀️"}
        </button>
        {user ? <span>Welcome, {user.name}</span> : <button>Login</button>}
      </div>
    </header>
  );
}
```

## Testing Composition Patterns

### Testing Composed Components

```tsx
import { render, screen, fireEvent } from "@testing-library/react";

describe("Card Composition", () => {
  it("should render all card sections", () => {
    render(
      <Card>
        <Card.Header>Test Header</Card.Header>
        <Card.Body>Test Body</Card.Body>
        <Card.Footer>Test Footer</Card.Footer>
      </Card>
    );

    expect(screen.getByText("Test Header")).toBeInTheDocument();
    expect(screen.getByText("Test Body")).toBeInTheDocument();
    expect(screen.getByText("Test Footer")).toBeInTheDocument();
  });

  it("should render with custom className", () => {
    render(
      <Card className="custom-card">
        <Card.Body>Content</Card.Body>
      </Card>
    );

    const card = screen.getByText("Content").closest(".card");
    expect(card).toHaveClass("custom-card");
  });
});

describe("Form Composition", () => {
  it("should handle form submission", () => {
    const handleSubmit = jest.fn();

    render(
      <Form onSubmit={handleSubmit}>
        <Form.Field name="name" label="Name" />
        <Form.Submit>Submit</Form.Submit>
      </Form>
    );

    const nameInput = screen.getByLabelText("Name");
    const submitButton = screen.getByRole("button", { name: /submit/i });

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.click(submitButton);

    expect(handleSubmit).toHaveBeenCalledWith({ name: "John Doe" });
  });

  it("should show validation errors", () => {
    render(
      <Form onSubmit={() => {}}>
        <Form.Field name="email" label="Email" required />
        <Form.Submit>Submit</Form.Submit>
      </Form>
    );

    const emailInput = screen.getByLabelText("Email *");
    const submitButton = screen.getByRole("button", { name: /submit/i });

    fireEvent.blur(emailInput);
    fireEvent.click(submitButton);

    expect(screen.getByText("Email is required")).toBeInTheDocument();
  });
});

describe("Toggle Render Props", () => {
  it("should toggle state correctly", () => {
    render(
      <Toggle>
        {({ isOn, toggle }) => (
          <div>
            <span>{isOn ? "ON" : "OFF"}</span>
            <button onClick={toggle}>Toggle</button>
          </div>
        )}
      </Toggle>
    );

    expect(screen.getByText("OFF")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /toggle/i }));

    expect(screen.getByText("ON")).toBeInTheDocument();
  });
});

describe("Modal Composition", () => {
  it("should open and close modal", () => {
    const TestModal = () => {
      const [isOpen, setIsOpen] = useState(false);

      return (
        <div>
          <button onClick={() => setIsOpen(true)}>Open Modal</button>
          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <Modal.Header>Test Modal</Modal.Header>
            <Modal.Body>Modal Content</Modal.Body>
          </Modal>
        </div>
      );
    };

    render(<TestModal />);

    expect(screen.queryByText("Test Modal")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /open modal/i }));

    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByText("Modal Content")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Close modal"));

    expect(screen.queryByText("Test Modal")).not.toBeInTheDocument();
  });
});
```

## Best Practices

### Composition Guidelines

1. **Favor Composition Over Inheritance**: Use composition to combine smaller, focused components rather than creating large, monolithic components.

2. **Keep Components Focused**: Each component should have a single responsibility and be easily testable.

3. **Use Prop Drilling Wisely**: For deeply nested components, consider using Context or state management libraries.

4. **Document Component APIs**: Clearly document how composed components should be used together.

5. **Provide Sensible Defaults**: Make composed components easy to use with good default values.

6. **Consider Performance**: Use React.memo, useMemo, and useCallback appropriately to prevent unnecessary re-renders.

### Performance Optimization

```tsx
const MemoizedCard = React.memo(Card);
const MemoizedCardHeader = React.memo(Card.Header);
const MemoizedCardBody = React.memo(Card.Body);

function OptimizedUserList({ users }: { users: User[] }) {
  const renderUser = useCallback(
    (user: User) => (
      <MemoizedCard key={user.id}>
        <MemoizedCardHeader>{user.name}</MemoizedCardHeader>
        <MemoizedCardBody>{user.email}</MemoizedCardBody>
      </MemoizedCard>
    ),
    []
  );

  return <div className="user-list">{users.map(renderUser)}</div>;
}
```

## Interview Questions

**Q: What's the difference between composition and inheritance in React?**

A: Composition builds components by combining smaller components, while inheritance extends classes. React favors composition because it's more flexible, easier to test, and avoids the complex hierarchies that inheritance can create.

**Q: When would you use render props vs children props?**

A: Use render props when you need to pass complex logic or multiple values to children. Use children props for simpler content composition where you just need to nest components.

**Q: How do you prevent prop drilling in composed components?**

A: Use React Context, state management libraries (Redux, Zustand), or component composition patterns that keep related state and logic close together.

**Q: What are the benefits of compound components?**

A: Compound components provide a flexible API, enforce relationships between components, reduce prop drilling, and create intuitive component hierarchies that are easy to understand and maintain.

**Q: How do you test composed components effectively?**

A: Test the integration between composed components, test individual component behaviors, use proper mocking for context providers, and test both happy paths and error scenarios.

The composition pattern is fundamental to writing maintainable, reusable React components. It enables you to build complex UIs from simple, focused components while maintaining flexibility and testability.
