# Error Handling in React Data Fetching

Comprehensive error handling strategies for React applications to provide robust user experiences and maintainable code.

## Error Types and Classification

### Network Errors

```tsx
interface NetworkError {
  name: "NetworkError";
  status?: number;
  statusText?: string;
  message: string;
  url?: string;
}

class NetworkErrorHandler {
  static classify(error: any): NetworkError | null {
    if (!navigator.onLine) {
      return {
        name: "NetworkError",
        message: "No internet connection",
        status: 0,
      };
    }

    if (error.code === "NETWORK_ERROR" || !error.response) {
      return {
        name: "NetworkError",
        message: "Network request failed",
        status: 0,
      };
    }

    if (error.response?.status >= 500) {
      return {
        name: "NetworkError",
        message: "Server error occurred",
        status: error.response.status,
        statusText: error.response.statusText,
      };
    }

    return null;
  }

  static getRetryDelay(attemptCount: number): number {
    return Math.min(1000 * Math.pow(2, attemptCount), 30000);
  }

  static shouldRetry(error: NetworkError, attemptCount: number): boolean {
    return attemptCount < 3 && (error.status === 0 || error.status >= 500);
  }
}
```

### Application Errors

```tsx
interface ApplicationError {
  name: "ApplicationError";
  code: string;
  message: string;
  field?: string;
  context?: Record<string, any>;
}

class ApplicationErrorHandler {
  static classify(error: any): ApplicationError | null {
    if (error.response?.status >= 400 && error.response?.status < 500) {
      return {
        name: "ApplicationError",
        code: error.response.data?.code || "CLIENT_ERROR",
        message: error.response.data?.message || "Request failed",
        field: error.response.data?.field,
        context: error.response.data?.context,
      };
    }

    return null;
  }

  static getDisplayMessage(error: ApplicationError): string {
    const messages: Record<string, string> = {
      VALIDATION_ERROR: "Please check your input and try again",
      UNAUTHORIZED: "Please log in to continue",
      FORBIDDEN: "You do not have permission to perform this action",
      NOT_FOUND: "The requested resource was not found",
      CONFLICT: "This action conflicts with existing data",
      RATE_LIMITED: "Too many requests. Please try again later",
    };

    return messages[error.code] || error.message;
  }
}
```

## Error Boundary Implementation

### Generic Error Boundary

```tsx
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
}

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
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

    this.props.onError?.(error, errorInfo);

    console.error("Error Boundary caught an error:", error, errorInfo);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetKeys } = this.props;
    const prevResetKeys = prevProps.resetKeys;

    if (
      (this.state.hasError &&
        prevResetKeys &&
        resetKeys &&
        prevResetKeys.length !== resetKeys.length) ||
      resetKeys.some((resetKey, idx) => prevResetKeys[idx] !== resetKey)
    ) {
      this.resetErrorBoundary();
    }
  }

  resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }

    this.resetTimeoutId = setTimeout(() => {
      this.setState({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
      });
    }, 100);
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;

      return (
        <FallbackComponent
          error={this.state.error!}
          resetErrorBoundary={this.resetErrorBoundary}
        />
      );
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({
  error,
  resetErrorBoundary,
}: ErrorFallbackProps) {
  return (
    <div className="error-fallback">
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}
```

### Async Error Boundary

```tsx
function AsyncErrorBoundary({ children }: { children: ReactNode }) {
  const [error, setError] = useState<Error | null>(null);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      setError(new Error(event.reason));
      event.preventDefault();
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
    };
  }, []);

  if (error) {
    return (
      <div className="async-error-boundary">
        <h2>Async Error Occurred</h2>
        <p>{error.message}</p>
        <button onClick={resetError}>Reset</button>
      </div>
    );
  }

  return <>{children}</>;
}
```

## Hook-Based Error Handling

### useErrorHandler Hook

```tsx
interface ErrorHandlerOptions {
  retryCount?: number;
  retryDelay?: number;
  onError?: (error: Error) => void;
  shouldRetry?: (error: Error, attemptCount: number) => boolean;
}

function useErrorHandler(options: ErrorHandlerOptions = {}) {
  const [error, setError] = useState<Error | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  const {
    retryCount = 3,
    retryDelay = 1000,
    onError,
    shouldRetry = () => true,
  } = options;

  const handleError = useCallback(
    async (error: Error, retryFn?: () => Promise<any>) => {
      setError(error);
      onError?.(error);

      if (
        retryFn &&
        attemptCount < retryCount &&
        shouldRetry(error, attemptCount)
      ) {
        setIsRetrying(true);
        setAttemptCount((prev) => prev + 1);

        await new Promise((resolve) => setTimeout(resolve, retryDelay));

        try {
          await retryFn();
          setError(null);
          setAttemptCount(0);
        } catch (retryError) {
          await handleError(retryError as Error, retryFn);
        } finally {
          setIsRetrying(false);
        }
      }
    },
    [attemptCount, retryCount, retryDelay, shouldRetry, onError]
  );

  const clearError = useCallback(() => {
    setError(null);
    setAttemptCount(0);
  }, []);

  const retry = useCallback(
    async (fn: () => Promise<any>) => {
      clearError();
      try {
        return await fn();
      } catch (error) {
        await handleError(error as Error, fn);
      }
    },
    [clearError, handleError]
  );

  return {
    error,
    isRetrying,
    attemptCount,
    handleError,
    clearError,
    retry,
  };
}
```

### useAsyncError Hook

```tsx
function useAsyncError() {
  const [, setError] = useState<Error>();

  return useCallback((error: Error) => {
    setError(() => {
      throw error;
    });
  }, []);
}

function AsyncComponent() {
  const throwError = useAsyncError();

  const handleAsyncAction = async () => {
    try {
      await someAsyncOperation();
    } catch (error) {
      throwError(error as Error);
    }
  };

  return <button onClick={handleAsyncAction}>Trigger Async Action</button>;
}
```

## API Integration Error Handling

### Axios Error Handler

```tsx
import axios, { AxiosError, AxiosRequestConfig } from "axios";

interface ApiError {
  message: string;
  code: string;
  status: number;
  field?: string;
  context?: Record<string, any>;
}

class ApiErrorHandler {
  static handleAxiosError(error: AxiosError): ApiError {
    if (error.response) {
      return {
        message: error.response.data?.message || "Request failed",
        code: error.response.data?.code || "API_ERROR",
        status: error.response.status,
        field: error.response.data?.field,
        context: error.response.data?.context,
      };
    }

    if (error.request) {
      return {
        message: "Network error - please check your connection",
        code: "NETWORK_ERROR",
        status: 0,
      };
    }

    return {
      message: error.message,
      code: "UNKNOWN_ERROR",
      status: 0,
    };
  }

  static createRetryInterceptor(maxRetries = 3) {
    return axios.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const config = error.config as AxiosRequestConfig & {
          retryCount?: number;
        };

        if (!config || !this.shouldRetry(error)) {
          return Promise.reject(error);
        }

        config.retryCount = config.retryCount || 0;

        if (config.retryCount >= maxRetries) {
          return Promise.reject(error);
        }

        config.retryCount += 1;

        const delay = Math.pow(2, config.retryCount) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));

        return axios(config);
      }
    );
  }

  private static shouldRetry(error: AxiosError): boolean {
    return !error.response || error.response.status >= 500;
  }
}
```

### Fetch Error Handler

```tsx
interface FetchError extends Error {
  status?: number;
  statusText?: string;
  url?: string;
}

class FetchErrorHandler {
  static async handleResponse(response: Response): Promise<any> {
    if (!response.ok) {
      const error: FetchError = new Error(
        `HTTP error! status: ${response.status}`
      );
      error.status = response.status;
      error.statusText = response.statusText;
      error.url = response.url;

      try {
        const errorData = await response.json();
        error.message = errorData.message || error.message;
      } catch {
        // If response body is not JSON, use status text
      }

      throw error;
    }

    return response.json();
  }

  static async withRetry<T>(
    fetchFn: () => Promise<T>,
    maxRetries = 3,
    delay = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await fetchFn();
      } catch (error) {
        lastError = error as Error;

        if (i === maxRetries) {
          throw lastError;
        }

        if (!this.shouldRetry(error as FetchError)) {
          throw error;
        }

        await new Promise((resolve) =>
          setTimeout(resolve, delay * Math.pow(2, i))
        );
      }
    }

    throw lastError!;
  }

  private static shouldRetry(error: FetchError): boolean {
    if (!error.status) return true; // Network error
    return error.status >= 500; // Server error
  }
}
```

## React Query Error Handling

### Global Error Handler

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        if (error?.status === 404) return false;
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      onError: (error: any) => {
        console.error("Query error:", error);

        if (error?.status === 401) {
          // Handle authentication error
          window.location.href = "/login";
        }
      },
    },
    mutations: {
      onError: (error: any) => {
        console.error("Mutation error:", error);

        const message =
          error?.response?.data?.message || "Something went wrong";
        toast.error(message);
      },
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}
```

### Query Error Handling

```tsx
function UserProfile({ userId }: { userId: string }) {
  const {
    data: user,
    error,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId),
    retry: (failureCount, error: any) => {
      if (error?.status === 404) return false;
      return failureCount < 2;
    },
    onError: (error: any) => {
      if (error?.status !== 404) {
        console.error("Failed to load user:", error);
      }
    },
  });

  if (isLoading) return <UserSkeleton />;

  if (isError) {
    if (error?.status === 404) {
      return <UserNotFound userId={userId} />;
    }

    return (
      <ErrorState
        title="Failed to load user"
        message="There was a problem loading the user profile"
        onRetry={() => refetch()}
      />
    );
  }

  return <UserCard user={user} />;
}
```

## Error UI Components

### Error State Component

```tsx
interface ErrorStateProps {
  title?: string;
  message?: string;
  error?: Error;
  onRetry?: () => void;
  showDetails?: boolean;
  className?: string;
}

function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred",
  error,
  onRetry,
  showDetails = false,
  className = "",
}: ErrorStateProps) {
  const [showErrorDetails, setShowErrorDetails] = useState(false);

  return (
    <div className={`error-state ${className}`}>
      <div className="error-icon">⚠️</div>

      <h3 className="error-title">{title}</h3>
      <p className="error-message">{message}</p>

      {error && showDetails && (
        <details className="error-details">
          <summary
            onClick={() => setShowErrorDetails(!showErrorDetails)}
            className="error-summary"
          >
            {showErrorDetails ? "Hide" : "Show"} error details
          </summary>

          {showErrorDetails && (
            <div className="error-stack">
              <strong>Error:</strong> {error.message}
              {error.stack && (
                <pre className="error-stack-trace">{error.stack}</pre>
              )}
            </div>
          )}
        </details>
      )}

      {onRetry && (
        <button onClick={onRetry} className="retry-button">
          Try Again
        </button>
      )}
    </div>
  );
}
```

### Toast Error Handler

```tsx
import { toast } from "react-hot-toast";

interface ToastErrorOptions {
  title?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

class ToastErrorHandler {
  static show(error: Error, options: ToastErrorOptions = {}) {
    const { title = "Error", duration = 5000, action } = options;

    toast.error(
      (t) => (
        <div className="toast-error">
          <div className="toast-content">
            <strong>{title}</strong>
            <p>{error.message}</p>
          </div>

          <div className="toast-actions">
            {action && (
              <button
                onClick={() => {
                  action.onClick();
                  toast.dismiss(t.id);
                }}
                className="toast-action"
              >
                {action.label}
              </button>
            )}

            <button
              onClick={() => toast.dismiss(t.id)}
              className="toast-dismiss"
            >
              ×
            </button>
          </div>
        </div>
      ),
      { duration }
    );
  }

  static showNetworkError(retryFn?: () => void) {
    this.show(new Error("Check your internet connection and try again"), {
      title: "Network Error",
      action: retryFn ? { label: "Retry", onClick: retryFn } : undefined,
    });
  }

  static showValidationError(message: string) {
    this.show(new Error(message), {
      title: "Validation Error",
      duration: 4000,
    });
  }
}
```

## Form Error Handling

### Field-Level Errors

```tsx
interface FormErrors {
  [key: string]: string | string[];
}

function useFormErrors() {
  const [errors, setErrors] = useState<FormErrors>({});

  const setFieldError = useCallback(
    (field: string, error: string | string[]) => {
      setErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
    },
    []
  );

  const clearFieldError = useCallback((field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const hasError = useCallback(
    (field: string) => {
      return Boolean(errors[field]);
    },
    [errors]
  );

  const getError = useCallback(
    (field: string) => {
      const error = errors[field];
      if (Array.isArray(error)) {
        return error[0];
      }
      return error;
    },
    [errors]
  );

  return {
    errors,
    setFieldError,
    clearFieldError,
    clearAllErrors,
    hasError,
    getError,
  };
}

function ContactForm() {
  const {
    errors,
    setFieldError,
    clearFieldError,
    clearAllErrors,
    hasError,
    getError,
  } = useFormErrors();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAllErrors();

    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      await submitContact(formData);
    } catch (error: any) {
      if (error.response?.data?.errors) {
        Object.entries(error.response.data.errors).forEach(
          ([field, message]) => {
            setFieldError(field, message as string);
          }
        );
      } else {
        toast.error("Failed to submit form");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          className={hasError("email") ? "error" : ""}
          onChange={() => clearFieldError("email")}
        />
        {hasError("email") && (
          <span className="field-error">{getError("email")}</span>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          className={hasError("message") ? "error" : ""}
          onChange={() => clearFieldError("message")}
        />
        {hasError("message") && (
          <span className="field-error">{getError("message")}</span>
        )}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
```

## Error Logging and Monitoring

### Error Logger

```tsx
interface ErrorLog {
  timestamp: string;
  level: "error" | "warning" | "info";
  message: string;
  stack?: string;
  context?: Record<string, any>;
  userId?: string;
  sessionId?: string;
}

class ErrorLogger {
  private static logs: ErrorLog[] = [];
  private static maxLogs = 100;

  static log(
    level: ErrorLog["level"],
    message: string,
    error?: Error,
    context?: Record<string, any>
  ) {
    const log: ErrorLog = {
      timestamp: new Date().toISOString(),
      level,
      message,
      stack: error?.stack,
      context,
      userId: this.getCurrentUserId(),
      sessionId: this.getSessionId(),
    };

    this.logs.push(log);

    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Send to monitoring service
    this.sendToMonitoring(log);

    console[level](message, error, context);
  }

  static error(message: string, error?: Error, context?: Record<string, any>) {
    this.log("error", message, error, context);
  }

  static warning(message: string, context?: Record<string, any>) {
    this.log("warning", message, undefined, context);
  }

  static info(message: string, context?: Record<string, any>) {
    this.log("info", message, undefined, context);
  }

  static getLogs(): ErrorLog[] {
    return [...this.logs];
  }

  private static getCurrentUserId(): string | undefined {
    // Implementation depends on your auth system
    return localStorage.getItem("userId") || undefined;
  }

  private static getSessionId(): string {
    let sessionId = sessionStorage.getItem("sessionId");
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem("sessionId", sessionId);
    }
    return sessionId;
  }

  private static async sendToMonitoring(log: ErrorLog) {
    try {
      await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(log),
      });
    } catch (error) {
      console.error("Failed to send log to monitoring:", error);
    }
  }
}
```

## Testing Error Handling

### Error Boundary Testing

```tsx
import { render, screen } from "@testing-library/react";

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div>No error</div>;
};

describe("ErrorBoundary", () => {
  it("catches and displays error", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Test error")).toBeInTheDocument();
  });

  it("renders children when no error", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText("No error")).toBeInTheDocument();
  });
});
```

### Hook Error Testing

```tsx
import { renderHook, act } from "@testing-library/react";

describe("useErrorHandler", () => {
  it("handles errors with retry", async () => {
    const mockFn = jest
      .fn()
      .mockRejectedValueOnce(new Error("First failure"))
      .mockResolvedValueOnce("Success");

    const { result } = renderHook(() => useErrorHandler());

    await act(async () => {
      await result.current.retry(mockFn);
    });

    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(result.current.error).toBeNull();
  });
});
```

## Best Practices

### Error Handling Checklist

```tsx
const ErrorHandlingChecklist = {
  boundaries: [
    "Implement error boundaries at appropriate levels",
    "Use fallback UIs for error states",
    "Reset error boundaries when needed",
  ],

  async: [
    "Handle promise rejections",
    "Use try-catch in async functions",
    "Implement retry logic for transient errors",
  ],

  user_experience: [
    "Show meaningful error messages",
    "Provide action buttons (retry, contact support)",
    "Maintain app state during errors",
  ],

  monitoring: [
    "Log errors with context",
    "Monitor error rates",
    "Set up alerts for critical errors",
  ],

  testing: [
    "Test error scenarios",
    "Verify error boundaries work",
    "Test retry mechanisms",
  ],
};
```

## Interview Questions

**Q: What are the different types of errors in React applications?**
A: JavaScript errors (syntax, runtime), React errors (render, lifecycle), network errors (fetch failures, timeouts), and user errors (validation, authentication).

**Q: How do error boundaries work and what are their limitations?**
A: Error boundaries catch errors during rendering, in lifecycle methods, and in constructors of the component tree below them. They don't catch errors in event handlers, async code, or during SSR.

**Q: What's the difference between error boundaries and try-catch?**
A: Error boundaries catch errors in React's component tree during rendering, while try-catch catches errors in imperative code like event handlers and async operations.

**Q: How do you handle async errors in React?**
A: Use try-catch in async functions, handle promise rejections, use error states in hooks, and potentially throw errors to error boundaries using custom hooks.

**Q: What strategies do you use for error recovery?**
A: Retry mechanisms with exponential backoff, fallback UIs, graceful degradation, cache fallbacks, and user-initiated recovery actions.

**Q: How do you implement global error handling?**
A: Use error boundaries at the app level, global error handlers for unhandled promises, axios/fetch interceptors, and centralized logging systems.
