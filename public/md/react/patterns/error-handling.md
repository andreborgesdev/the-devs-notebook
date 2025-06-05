# Error Handling Patterns

Error handling in React involves implementing patterns to gracefully handle errors, provide meaningful feedback to users, and maintain application stability.

## Error Boundaries

### Basic Error Boundary Implementation

```typescript
import React, { Component, ReactNode } from "react";

interface ErrorInfo {
  componentStack: string;
  errorBoundary?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  isolate?: boolean;
}

interface ErrorFallbackProps {
  error: Error;
  errorInfo: ErrorInfo | null;
  resetError: () => void;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
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

    // Log error to monitoring service
    this.props.onError?.(error, errorInfo);

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error Boundary caught an error:", error);
      console.error("Error Info:", errorInfo);
    }

    // Report to error monitoring service
    this.reportError(error, errorInfo);
  }

  reportError = (error: Error, errorInfo: ErrorInfo) => {
    // Example: Send to Sentry, LogRocket, etc.
    if (typeof window !== "undefined" && window.Sentry) {
      window.Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack,
          },
        },
      });
    }
  };

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;

      return (
        <FallbackComponent
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

// Default error fallback component
const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  errorInfo,
  resetError,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="error-boundary">
      <div className="error-content">
        <h2>Something went wrong</h2>
        <p>We're sorry, but something unexpected happened.</p>

        <div className="error-actions">
          <button onClick={resetError} className="btn-primary">
            Try Again
          </button>

          <button
            onClick={() => window.location.reload()}
            className="btn-secondary"
          >
            Reload Page
          </button>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="btn-text"
          >
            {showDetails ? "Hide" : "Show"} Details
          </button>
        </div>

        {showDetails && (
          <details className="error-details">
            <summary>Error Details</summary>
            <pre>{error.message}</pre>
            {errorInfo?.componentStack && <pre>{errorInfo.componentStack}</pre>}
          </details>
        )}
      </div>
    </div>
  );
};

// Usage
function App() {
  return (
    <ErrorBoundary
      fallback={CustomErrorFallback}
      onError={(error, errorInfo) => {
        console.log("Error caught:", error);
        // Send to analytics or error tracking
      }}
    >
      <Header />
      <MainContent />
      <Footer />
    </ErrorBoundary>
  );
}
```

### Advanced Error Boundary with Recovery

```typescript
interface RetryableErrorBoundaryState extends ErrorBoundaryState {
  retryCount: number;
  isRetrying: boolean;
}

class RetryableErrorBoundary extends Component<
  ErrorBoundaryProps & { maxRetries?: number; retryDelay?: number },
  RetryableErrorBoundaryState
> {
  private retryTimeoutId: number | null = null;
  private readonly maxRetries: number;
  private readonly retryDelay: number;

  constructor(
    props: ErrorBoundaryProps & { maxRetries?: number; retryDelay?: number }
  ) {
    super(props);
    this.maxRetries = props.maxRetries || 3;
    this.retryDelay = props.retryDelay || 1000;

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      isRetrying: false,
    };
  }

  static getDerivedStateFromError(
    error: Error
  ): Partial<RetryableErrorBoundaryState> {
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

    // Auto-retry for certain types of errors
    if (
      this.shouldAutoRetry(error) &&
      this.state.retryCount < this.maxRetries
    ) {
      this.scheduleRetry();
    }
  }

  shouldAutoRetry = (error: Error): boolean => {
    // Auto-retry for network errors, chunk load errors, etc.
    return (
      error.message.includes("Loading chunk") ||
      error.message.includes("Network Error") ||
      error.name === "ChunkLoadError"
    );
  };

  scheduleRetry = () => {
    this.setState({ isRetrying: true });

    this.retryTimeoutId = window.setTimeout(() => {
      this.setState((prevState) => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1,
        isRetrying: false,
      }));
    }, this.retryDelay * (this.state.retryCount + 1)); // Exponential backoff
  };

  manualRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.scheduleRetry();
    } else {
      // Hard reset
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: 0,
        isRetrying: false,
      });
    }
  };

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.state.isRetrying) {
        return (
          <div className="error-boundary retrying">
            <div>
              Attempting to recover... (Attempt {this.state.retryCount + 1})
            </div>
          </div>
        );
      }

      return (
        <ErrorRetryFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          retryCount={this.state.retryCount}
          maxRetries={this.maxRetries}
          onRetry={this.manualRetry}
        />
      );
    }

    return this.props.children;
  }
}

const ErrorRetryFallback: React.FC<{
  error: Error;
  errorInfo: ErrorInfo | null;
  retryCount: number;
  maxRetries: number;
  onRetry: () => void;
}> = ({ error, errorInfo, retryCount, maxRetries, onRetry }) => {
  const canRetry = retryCount < maxRetries;

  return (
    <div className="error-boundary retry-fallback">
      <h2>Something went wrong</h2>
      <p>{error.message}</p>

      {canRetry ? (
        <button onClick={onRetry}>
          Retry ({retryCount}/{maxRetries})
        </button>
      ) : (
        <div>
          <p>Maximum retry attempts reached.</p>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      )}
    </div>
  );
};
```

### Granular Error Boundaries

```typescript
// Feature-specific error boundaries
const FeatureErrorBoundary: React.FC<{
  children: ReactNode;
  featureName: string;
  fallback?: ComponentType<any>;
}> = ({ children, featureName, fallback: Fallback }) => {
  return (
    <ErrorBoundary
      fallback={
        Fallback ||
        (() => (
          <div className="feature-error">
            <p>The {featureName} feature is temporarily unavailable.</p>
            <button onClick={() => window.location.reload()}>
              Refresh Page
            </button>
          </div>
        ))
      }
      onError={(error, errorInfo) => {
        // Feature-specific error tracking
        trackError(`${featureName}_error`, error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

// Usage with granular error boundaries
function Dashboard() {
  return (
    <div>
      <FeatureErrorBoundary featureName="User Profile">
        <UserProfile />
      </FeatureErrorBoundary>

      <FeatureErrorBoundary featureName="Recent Activity">
        <RecentActivity />
      </FeatureErrorBoundary>

      <FeatureErrorBoundary
        featureName="Analytics Dashboard"
        fallback={AnalyticsFallback}
      >
        <AnalyticsDashboard />
      </FeatureErrorBoundary>
    </div>
  );
}
```

## Async Error Handling

### useAsyncError Hook

```typescript
import { useCallback } from "react";

function useAsyncError() {
  const [, setError] = useState();

  return useCallback((error: Error) => {
    setError(() => {
      throw error;
    });
  }, []);
}

// Usage in async operations
function useApiCall<T>(apiFunction: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const throwError = useAsyncError();

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      const result = await apiFunction();
      setData(result);
    } catch (error) {
      // This will be caught by the nearest error boundary
      throwError(error instanceof Error ? error : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  }, [apiFunction, throwError]);

  return { data, loading, execute };
}

// Component using async error handling
function UserProfile({ userId }: { userId: string }) {
  const { data: user, loading, execute } = useApiCall(() => fetchUser(userId));

  useEffect(() => {
    execute();
  }, [execute]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>No user data</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

### Error State Management

```typescript
interface ErrorState {
  hasError: boolean;
  error: Error | null;
  errorType: "network" | "validation" | "permission" | "unknown";
  retryable: boolean;
}

type ErrorAction =
  | {
      type: "SET_ERROR";
      payload: { error: Error; errorType?: ErrorState["errorType"] };
    }
  | { type: "CLEAR_ERROR" }
  | { type: "SET_RETRYABLE"; payload: boolean };

function errorReducer(state: ErrorState, action: ErrorAction): ErrorState {
  switch (action.type) {
    case "SET_ERROR":
      return {
        hasError: true,
        error: action.payload.error,
        errorType: action.payload.errorType || "unknown",
        retryable: determineIfRetryable(
          action.payload.error,
          action.payload.errorType
        ),
      };
    case "CLEAR_ERROR":
      return {
        hasError: false,
        error: null,
        errorType: "unknown",
        retryable: false,
      };
    case "SET_RETRYABLE":
      return {
        ...state,
        retryable: action.payload,
      };
    default:
      return state;
  }
}

function determineIfRetryable(
  error: Error,
  errorType?: ErrorState["errorType"]
): boolean {
  if (errorType === "network") return true;
  if (errorType === "permission") return false;
  if (error.message.includes("timeout")) return true;
  if (error.message.includes("400") || error.message.includes("401"))
    return false;
  return true;
}

function useErrorState() {
  const [state, dispatch] = useReducer(errorReducer, {
    hasError: false,
    error: null,
    errorType: "unknown",
    retryable: false,
  });

  const setError = useCallback(
    (error: Error, errorType?: ErrorState["errorType"]) => {
      dispatch({ type: "SET_ERROR", payload: { error, errorType } });
    },
    []
  );

  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  return {
    ...state,
    setError,
    clearError,
  };
}

// Usage
function DataFetcher() {
  const { hasError, error, errorType, retryable, setError, clearError } =
    useErrorState();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      clearError();

      const response = await fetch("/api/data");

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized");
        } else if (response.status >= 500) {
          throw new Error("Server Error");
        } else {
          throw new Error("Request Failed");
        }
      }

      const result = await response.json();
      setData(result);
    } catch (error) {
      let errorType: ErrorState["errorType"] = "unknown";

      if (error instanceof TypeError && error.message.includes("fetch")) {
        errorType = "network";
      } else if (error.message.includes("Unauthorized")) {
        errorType = "permission";
      }

      setError(
        error instanceof Error ? error : new Error("Unknown error"),
        errorType
      );
    } finally {
      setLoading(false);
    }
  }, [setError, clearError]);

  if (hasError && error) {
    return (
      <ErrorDisplay
        error={error}
        errorType={errorType}
        retryable={retryable}
        onRetry={retryable ? fetchData : undefined}
        onDismiss={clearError}
      />
    );
  }

  return (
    <div>
      {loading && <div>Loading...</div>}
      {data && <DataDisplay data={data} />}
      <button onClick={fetchData}>Fetch Data</button>
    </div>
  );
}
```

## Form Error Handling

### Form Validation with Error States

```typescript
interface FormErrors {
  [key: string]: string | undefined;
}

interface UseFormValidationOptions<T> {
  validationSchema: (values: T) => FormErrors;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  options: UseFormValidationOptions<T>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = useCallback(
    (valuesToValidate: T): FormErrors => {
      return options.validationSchema(valuesToValidate);
    },
    [options.validationSchema]
  );

  const setFieldValue = useCallback(
    (field: keyof T, value: any) => {
      setValues((prev) => ({ ...prev, [field]: value }));

      if (options.validateOnChange) {
        const newValues = { ...values, [field]: value };
        const fieldErrors = validate(newValues);
        setErrors((prev) => ({
          ...prev,
          [field]: fieldErrors[field as string],
        }));
      }
    },
    [values, validate, options.validateOnChange]
  );

  const setFieldTouched = useCallback(
    (field: keyof T) => {
      setTouched((prev) => ({ ...prev, [field]: true }));

      if (options.validateOnBlur) {
        const fieldErrors = validate(values);
        setErrors((prev) => ({
          ...prev,
          [field]: fieldErrors[field as string],
        }));
      }
    },
    [values, validate, options.validateOnBlur]
  );

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  const clearFieldError = useCallback((field: keyof T) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const handleSubmit = useCallback(
    async (onSubmit: (values: T) => Promise<void>) => {
      const formErrors = validate(values);
      setErrors(formErrors);

      const hasErrors = Object.values(formErrors).some((error) => error);
      if (hasErrors) {
        return;
      }

      try {
        setIsSubmitting(true);
        await onSubmit(values);
      } catch (error) {
        // Handle server errors
        if (error instanceof Error) {
          const message = error.message;

          // Try to map server errors to form fields
          if (message.includes("email")) {
            setFieldError(
              "email",
              "Email address is invalid or already exists"
            );
          } else if (message.includes("password")) {
            setFieldError("password", "Password does not meet requirements");
          } else {
            // General form error
            setFieldError("_form", message);
          }
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validate, setFieldError]
  );

  const isValid = useMemo(() => {
    return Object.values(errors).every((error) => !error);
  }, [errors]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    setFieldValue,
    setFieldTouched,
    setFieldError,
    clearFieldError,
    handleSubmit,
  };
}

// Usage
interface LoginForm {
  email: string;
  password: string;
}

function LoginForm() {
  const form = useFormValidation<LoginForm>(
    { email: "", password: "" },
    {
      validationSchema: (values) => {
        const errors: FormErrors = {};

        if (!values.email) {
          errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(values.email)) {
          errors.email = "Email is invalid";
        }

        if (!values.password) {
          errors.password = "Password is required";
        } else if (values.password.length < 8) {
          errors.password = "Password must be at least 8 characters";
        }

        return errors;
      },
      validateOnChange: true,
      validateOnBlur: true,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.handleSubmit(async (values) => {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {form.errors._form && (
        <div className="form-error">{form.errors._form}</div>
      )}

      <div className="field">
        <input
          type="email"
          value={form.values.email}
          onChange={(e) => form.setFieldValue("email", e.target.value)}
          onBlur={() => form.setFieldTouched("email")}
          placeholder="Email"
          className={form.errors.email ? "error" : ""}
        />
        {form.touched.email && form.errors.email && (
          <span className="field-error">{form.errors.email}</span>
        )}
      </div>

      <div className="field">
        <input
          type="password"
          value={form.values.password}
          onChange={(e) => form.setFieldValue("password", e.target.value)}
          onBlur={() => form.setFieldTouched("password")}
          placeholder="Password"
          className={form.errors.password ? "error" : ""}
        />
        {form.touched.password && form.errors.password && (
          <span className="field-error">{form.errors.password}</span>
        )}
      </div>

      <button type="submit" disabled={form.isSubmitting || !form.isValid}>
        {form.isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
```

## Global Error Handling

### Global Error Context

```typescript
interface GlobalError {
  id: string;
  message: string;
  type: "error" | "warning" | "info";
  dismissible: boolean;
  timestamp: number;
  details?: any;
}

interface ErrorContextValue {
  errors: GlobalError[];
  addError: (error: Omit<GlobalError, "id" | "timestamp">) => string;
  removeError: (id: string) => void;
  clearAllErrors: () => void;
}

const ErrorContext = createContext<ErrorContextValue | undefined>(undefined);

export function ErrorProvider({ children }: { children: ReactNode }) {
  const [errors, setErrors] = useState<GlobalError[]>([]);

  const addError = useCallback(
    (error: Omit<GlobalError, "id" | "timestamp">) => {
      const id = `error-${Date.now()}-${Math.random()}`;
      const newError: GlobalError = {
        ...error,
        id,
        timestamp: Date.now(),
      };

      setErrors((prev) => [...prev, newError]);

      // Auto-remove dismissible errors after 5 seconds
      if (error.dismissible) {
        setTimeout(() => {
          removeError(id);
        }, 5000);
      }

      return id;
    },
    []
  );

  const removeError = useCallback((id: string) => {
    setErrors((prev) => prev.filter((error) => error.id !== id));
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const value = useMemo(
    () => ({
      errors,
      addError,
      removeError,
      clearAllErrors,
    }),
    [errors, addError, removeError, clearAllErrors]
  );

  return (
    <ErrorContext.Provider value={value}>
      {children}
      <GlobalErrorDisplay />
    </ErrorContext.Provider>
  );
}

export function useErrorContext() {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useErrorContext must be used within an ErrorProvider");
  }
  return context;
}

// Global error display component
function GlobalErrorDisplay() {
  const { errors, removeError } = useErrorContext();

  if (errors.length === 0) return null;

  return (
    <div className="global-errors">
      {errors.map((error) => (
        <div key={error.id} className={`error-toast ${error.type}`}>
          <div className="error-content">
            <strong>{error.message}</strong>
            {error.details && (
              <details>
                <summary>Details</summary>
                <pre>{JSON.stringify(error.details, null, 2)}</pre>
              </details>
            )}
          </div>

          {error.dismissible && (
            <button
              onClick={() => removeError(error.id)}
              className="error-dismiss"
            >
              ×
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

// Hook for easy error reporting
export function useErrorReporting() {
  const { addError } = useErrorContext();

  const reportError = useCallback(
    (message: string, details?: any, type: GlobalError["type"] = "error") => {
      return addError({
        message,
        type,
        dismissible: true,
        details,
      });
    },
    [addError]
  );

  const reportNetworkError = useCallback(
    (error: Error) => {
      return reportError(
        "Network error occurred. Please check your connection.",
        { error: error.message },
        "error"
      );
    },
    [reportError]
  );

  const reportValidationError = useCallback(
    (message: string) => {
      return reportError(message, undefined, "warning");
    },
    [reportError]
  );

  return {
    reportError,
    reportNetworkError,
    reportValidationError,
  };
}
```

## Error Recovery Patterns

### Retry Mechanisms

```typescript
interface RetryOptions {
  maxRetries: number;
  retryDelay: number;
  backoffMultiplier?: number;
  shouldRetry?: (error: Error, attempt: number) => boolean;
}

function useRetryableOperation<T>(
  operation: () => Promise<T>,
  options: RetryOptions
) {
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: Error | null;
    retryCount: number;
  }>({
    data: null,
    loading: false,
    error: null,
    retryCount: 0,
  });

  const execute = useCallback(async () => {
    const {
      maxRetries,
      retryDelay,
      backoffMultiplier = 1.5,
      shouldRetry,
    } = options;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await operation();
        setState({
          data: result,
          loading: false,
          error: null,
          retryCount: attempt,
        });
        return result;
      } catch (error) {
        const isLastAttempt = attempt === maxRetries;
        const err = error instanceof Error ? error : new Error("Unknown error");

        if (isLastAttempt || !shouldRetry?.(err, attempt)) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: err,
            retryCount: attempt,
          }));
          throw err;
        }

        // Wait before retrying
        const delay = retryDelay * Math.pow(backoffMultiplier, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }, [operation, options]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      retryCount: 0,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Usage
function DataFetcherWithRetry() {
  const fetchData = useCallback(async () => {
    const response = await fetch("/api/data");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }, []);

  const { data, loading, error, retryCount, execute } = useRetryableOperation(
    fetchData,
    {
      maxRetries: 3,
      retryDelay: 1000,
      backoffMultiplier: 2,
      shouldRetry: (error, attempt) => {
        // Retry on network errors but not on 4xx errors
        return !error.message.includes("4");
      },
    }
  );

  useEffect(() => {
    execute();
  }, [execute]);

  if (loading) {
    return <div>Loading... {retryCount > 0 && `(Retry ${retryCount})`}</div>;
  }

  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
        <p>Failed after {retryCount + 1} attempts</p>
        <button onClick={execute}>Try Again</button>
      </div>
    );
  }

  return <div>{JSON.stringify(data, null, 2)}</div>;
}
```

### Circuit Breaker Pattern

```typescript
enum CircuitState {
  CLOSED = "CLOSED",
  OPEN = "OPEN",
  HALF_OPEN = "HALF_OPEN",
}

class CircuitBreaker {
  private failureCount = 0;
  private lastFailureTime = 0;
  private state = CircuitState.CLOSED;

  constructor(
    private threshold: number = 5,
    private timeout: number = 60000,
    private monitor?: (state: CircuitState) => void
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() - this.lastFailureTime >= this.timeout) {
        this.state = CircuitState.HALF_OPEN;
        this.monitor?.(this.state);
      } else {
        throw new Error("Circuit breaker is OPEN");
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failureCount = 0;
    this.state = CircuitState.CLOSED;
    this.monitor?.(this.state);
  }

  private onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.threshold) {
      this.state = CircuitState.OPEN;
      this.monitor?.(this.state);
    }
  }

  getState() {
    return this.state;
  }

  reset() {
    this.failureCount = 0;
    this.lastFailureTime = 0;
    this.state = CircuitState.CLOSED;
    this.monitor?.(this.state);
  }
}

function useCircuitBreaker(
  operation: () => Promise<any>,
  options: { threshold?: number; timeout?: number } = {}
) {
  const [circuitState, setCircuitState] = useState(CircuitState.CLOSED);

  const circuitBreaker = useMemo(
    () =>
      new CircuitBreaker(options.threshold, options.timeout, setCircuitState),
    [options.threshold, options.timeout]
  );

  const execute = useCallback(async () => {
    return circuitBreaker.execute(operation);
  }, [circuitBreaker, operation]);

  const reset = useCallback(() => {
    circuitBreaker.reset();
  }, [circuitBreaker]);

  return {
    execute,
    reset,
    circuitState,
  };
}
```

## Best Practices

### Error Handling Guidelines

1. **Use Error Boundaries**: Wrap components that might throw with error boundaries
2. **Graceful Degradation**: Provide fallback UI when features fail
3. **User-Friendly Messages**: Show meaningful error messages to users
4. **Error Logging**: Log errors for debugging and monitoring
5. **Recovery Mechanisms**: Implement retry logic and reset functionality

### Error Categorization

```typescript
enum ErrorCategory {
  NETWORK = "NETWORK",
  VALIDATION = "VALIDATION",
  PERMISSION = "PERMISSION",
  BUSINESS_LOGIC = "BUSINESS_LOGIC",
  UNKNOWN = "UNKNOWN",
}

function categorizeError(error: Error): ErrorCategory {
  if (error.message.includes("fetch") || error.message.includes("network")) {
    return ErrorCategory.NETWORK;
  }

  if (
    error.message.includes("validation") ||
    error.message.includes("invalid")
  ) {
    return ErrorCategory.VALIDATION;
  }

  if (
    error.message.includes("unauthorized") ||
    error.message.includes("forbidden")
  ) {
    return ErrorCategory.PERMISSION;
  }

  return ErrorCategory.UNKNOWN;
}
```

## Interview Questions

### Basic Level

**Q: What are Error Boundaries in React?**

A: Error Boundaries are React components that catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI. They use componentDidCatch and getDerivedStateFromError lifecycle methods.

**Q: How do you handle errors in async operations?**

A: Use try-catch blocks in async functions, implement proper error states in components, and consider using custom hooks like useAsyncError to propagate errors to Error Boundaries.

**Q: What's the difference between Error Boundaries and try-catch?**

A: Error Boundaries catch errors in React components during rendering, lifecycle methods, and constructors. Try-catch handles errors in imperative code like event handlers and async operations.

### Intermediate Level

**Q: How do you implement error recovery in React applications?**

A: Implement retry mechanisms, circuit breaker patterns, and provide reset functionality. Use retry hooks, exponential backoff, and graceful degradation strategies.

**Q: How do you handle form validation errors?**

A: Create validation schemas, manage error state per field, show errors conditionally based on touched state, and handle both client-side and server-side validation errors.

**Q: What are best practices for error logging?**

A: Log errors with context, categorize errors by type, include user actions and environment info, use structured logging, and integrate with monitoring services.

### Advanced Level

**Q: How do you implement a global error handling system?**

A: Create an error context provider, implement centralized error reporting, categorize errors, provide user feedback mechanisms, and integrate with error monitoring services.

**Q: How do you handle errors in concurrent React features?**

A: Use Suspense with Error Boundaries, handle errors in useTransition and useDeferredValue, implement proper error boundaries for concurrent rendering.

**Q: What strategies do you use for error boundary testing?**

A: Test error boundary behavior with throwing components, verify fallback UI rendering, test error recovery mechanisms, and mock error scenarios in different component states.
