# React Error Boundaries

## Overview

Error Boundaries are React components that catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI instead of the component tree that crashed. They work like a JavaScript `try...catch` block for components.

## Class Component Error Boundary

```javascript
import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    console.error("Error caught by boundary:", error, errorInfo);

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.state.errorInfo);
      }

      return (
        <div
          style={{ padding: "20px", border: "1px solid red", margin: "10px" }}
        >
          <h2>Something went wrong</h2>
          <details style={{ whiteSpace: "pre-wrap" }}>
            <summary>Error details</summary>
            <p>
              <strong>Error:</strong>{" "}
              {this.state.error && this.state.error.toString()}
            </p>
            <p>
              <strong>Stack trace:</strong>
            </p>
            <pre>{this.state.errorInfo.componentStack}</pre>
          </details>
          {this.props.showReload && (
            <button onClick={() => window.location.reload()}>
              Reload Page
            </button>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
```

## Advanced Error Boundary with Recovery

```javascript
class RecoverableErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorId: Date.now(),
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });

    if (this.props.onError) {
      this.props.onError(error, errorInfo, this.state.retryCount);
    }

    if (this.props.logError) {
      this.logErrorToService(error, errorInfo);
    }
  }

  logErrorToService = async (error, errorInfo) => {
    try {
      await fetch("/api/log-error", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (logError) {
      console.error("Failed to log error:", logError);
    }
  };

  handleRetry = () => {
    this.setState((prevState) => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1,
    }));
  };

  render() {
    if (this.state.hasError) {
      const { maxRetries = 3, children, fallback } = this.props;
      const canRetry = this.state.retryCount < maxRetries;

      if (fallback) {
        return fallback({
          error: this.state.error,
          errorInfo: this.state.errorInfo,
          retry: canRetry ? this.handleRetry : null,
          retryCount: this.state.retryCount,
        });
      }

      return (
        <div className="error-boundary">
          <h2>Oops! Something went wrong</h2>
          <p>We're sorry for the inconvenience. The error has been reported.</p>

          {canRetry && (
            <button onClick={this.handleRetry} className="retry-button">
              Try Again ({maxRetries - this.state.retryCount} attempts left)
            </button>
          )}

          {!canRetry && (
            <div>
              <p>Maximum retry attempts reached.</p>
              <button onClick={() => window.location.reload()}>
                Reload Page
              </button>
            </div>
          )}

          {process.env.NODE_ENV === "development" && (
            <details>
              <summary>Error Details (Development Only)</summary>
              <pre>{this.state.error.stack}</pre>
            </details>
          )}
        </div>
      );
    }

    return children;
  }
}
```

## Hook-based Error Boundary (React 16.8+)

```javascript
import { useState, useEffect } from "react";

function useErrorHandler() {
  const [error, setError] = useState(null);

  const resetError = () => setError(null);

  const captureError = (error, errorInfo) => {
    setError({ error, errorInfo });
  };

  useEffect(() => {
    if (error) {
      console.error("Error captured:", error);
    }
  }, [error]);

  return { error, resetError, captureError };
}

function withErrorBoundary(Component, errorBoundaryConfig = {}) {
  const WrappedComponent = (props) => {
    const { error, resetError, captureError } = useErrorHandler();

    if (error) {
      const { fallback: Fallback } = errorBoundaryConfig;

      if (Fallback) {
        return <Fallback error={error.error} reset={resetError} />;
      }

      return (
        <div>
          <h2>Something went wrong</h2>
          <button onClick={resetError}>Try again</button>
        </div>
      );
    }

    try {
      return <Component {...props} onError={captureError} />;
    } catch (err) {
      captureError(err);
      return null;
    }
  };

  WrappedComponent.displayName = `withErrorBoundary(${
    Component.displayName || Component.name
  })`;
  return WrappedComponent;
}
```

## Error Boundary HOC Pattern

```javascript
function withErrorBoundary(WrappedComponent, errorBoundaryProps = {}) {
  class WithErrorBoundaryComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
      console.error("HOC Error Boundary caught an error:", error, errorInfo);

      if (errorBoundaryProps.onError) {
        errorBoundaryProps.onError(error, errorInfo);
      }
    }

    render() {
      if (this.state.hasError) {
        if (errorBoundaryProps.fallback) {
          return errorBoundaryProps.fallback;
        }

        return (
          <div>
            <h2>Component Error</h2>
            <p>This component has encountered an error.</p>
          </div>
        );
      }

      return <WrappedComponent {...this.props} />;
    }
  }

  WithErrorBoundaryComponent.displayName = `withErrorBoundary(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;

  return WithErrorBoundaryComponent;
}

const SafeUserProfile = withErrorBoundary(UserProfile, {
  fallback: <div>Failed to load user profile</div>,
  onError: (error, errorInfo) => {
    console.log("UserProfile error:", error);
  },
});
```

## Async Error Handling

```javascript
import React, { useState, useEffect } from "react";

function AsyncErrorBoundary({ children, fallback }) {
  const [asyncError, setAsyncError] = useState(null);

  useEffect(() => {
    const handleUnhandledRejection = (event) => {
      setAsyncError(event.reason);
    };

    const handleError = (event) => {
      setAsyncError(event.error);
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
      window.removeEventListener("error", handleError);
    };
  }, []);

  if (asyncError) {
    if (fallback) {
      return fallback(asyncError);
    }

    return (
      <div>
        <h2>Async Error Occurred</h2>
        <p>{asyncError.message}</p>
        <button onClick={() => setAsyncError(null)}>Clear Error</button>
      </div>
    );
  }

  return <ErrorBoundary>{children}</ErrorBoundary>;
}

function useAsyncError() {
  const [, setError] = useState();

  return (error) => {
    setError(() => {
      throw error;
    });
  };
}

function AsyncComponent() {
  const throwAsyncError = useAsyncError();

  const handleAsyncOperation = async () => {
    try {
      const result = await riskyAsyncOperation();
      console.log(result);
    } catch (error) {
      throwAsyncError(error);
    }
  };

  return (
    <button onClick={handleAsyncOperation}>Trigger Async Operation</button>
  );
}
```

## Multiple Error Boundaries

```javascript
function App() {
  return (
    <div>
      <ErrorBoundary
        fallback={(error) => (
          <div>
            <h2>Navigation Error</h2>
            <p>The navigation component failed to load.</p>
          </div>
        )}
      >
        <Navigation />
      </ErrorBoundary>

      <main>
        <ErrorBoundary
          fallback={(error) => (
            <div>
              <h2>Sidebar Error</h2>
              <p>The sidebar encountered an issue.</p>
            </div>
          )}
        >
          <Sidebar />
        </ErrorBoundary>

        <ErrorBoundary
          fallback={(error) => (
            <div>
              <h2>Content Error</h2>
              <p>Failed to load main content.</p>
              <button onClick={() => window.location.reload()}>Reload</button>
            </div>
          )}
          onError={(error, errorInfo) => {
            logErrorToService("MainContent", error, errorInfo);
          }}
        >
          <MainContent />
        </ErrorBoundary>
      </main>
    </div>
  );
}
```

## Error Boundary with Context

```javascript
import React, { createContext, useContext, useState } from "react";

const ErrorContext = createContext();

export function ErrorProvider({ children }) {
  const [errors, setErrors] = useState([]);

  const addError = (error, componentName) => {
    const errorEntry = {
      id: Date.now(),
      error,
      componentName,
      timestamp: new Date(),
    };

    setErrors((prev) => [...prev, errorEntry]);
  };

  const removeError = (id) => {
    setErrors((prev) => prev.filter((error) => error.id !== id));
  };

  const clearAllErrors = () => {
    setErrors([]);
  };

  return (
    <ErrorContext.Provider
      value={{
        errors,
        addError,
        removeError,
        clearAllErrors,
      }}
    >
      {children}
    </ErrorContext.Provider>
  );
}

export function useErrorContext() {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useErrorContext must be used within ErrorProvider");
  }
  return context;
}

class ContextualErrorBoundary extends React.Component {
  static contextType = ErrorContext;

  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const { addError } = this.context;
    addError(error, this.props.componentName || "Unknown");
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Component Error</div>;
    }

    return this.props.children;
  }
}

function ErrorDisplay() {
  const { errors, removeError, clearAllErrors } = useErrorContext();

  if (errors.length === 0) return null;

  return (
    <div className="error-display">
      <div className="error-header">
        <h3>Application Errors ({errors.length})</h3>
        <button onClick={clearAllErrors}>Clear All</button>
      </div>

      {errors.map(({ id, error, componentName, timestamp }) => (
        <div key={id} className="error-item">
          <div className="error-meta">
            <strong>{componentName}</strong>
            <span>{timestamp.toLocaleTimeString()}</span>
            <button onClick={() => removeError(id)}>×</button>
          </div>
          <div className="error-message">{error.message}</div>
        </div>
      ))}
    </div>
  );
}
```

## Testing Error Boundaries

```javascript
import { render, screen } from "@testing-library/react";
import ErrorBoundary from "./ErrorBoundary";

const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div>No error</div>;
};

describe("ErrorBoundary", () => {
  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText("No error")).toBeInTheDocument();
  });

  it("renders error message when there is an error", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("calls onError callback when error occurs", () => {
    const onError = jest.fn();
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    render(
      <ErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
      })
    );

    consoleSpy.mockRestore();
  });
});
```

## What Error Boundaries Catch

| ✅ Catches                  | ❌ Does NOT Catch                   |
| --------------------------- | ----------------------------------- |
| Errors in render methods    | Event handlers                      |
| Errors in lifecycle methods | Async code (setTimeout, promises)   |
| Errors in constructors      | Server-side rendering               |
| Errors in child components  | Errors in the error boundary itself |

## Best Practices

1. **Strategic placement** - Place boundaries at different levels of your component tree
2. **Granular boundaries** - Use multiple small boundaries rather than one large one
3. **Meaningful fallbacks** - Provide helpful error messages and recovery options
4. **Log errors** - Always log errors for debugging and monitoring
5. **Development vs production** - Show more details in development, less in production
6. **Recovery mechanisms** - Provide ways for users to recover from errors
7. **Testing** - Test error scenarios and boundary behavior

## Common Patterns

```javascript
const AppWithErrorBoundaries = () => (
  <ErrorBoundary name="App" fallback={<AppErrorFallback />}>
    <Header />

    <ErrorBoundary name="Router" fallback={<RoutingErrorFallback />}>
      <Router>
        <Routes>
          <Route
            path="/profile"
            element={
              <ErrorBoundary name="Profile" fallback={<ProfileErrorFallback />}>
                <UserProfile />
              </ErrorBoundary>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ErrorBoundary
                name="Dashboard"
                fallback={<DashboardErrorFallback />}
              >
                <Dashboard />
              </ErrorBoundary>
            }
          />
        </Routes>
      </Router>
    </ErrorBoundary>

    <Footer />
  </ErrorBoundary>
);
```

## Interview Questions

### Q1: What are Error Boundaries and when would you use them?

**Answer:** Error Boundaries are React components that catch JavaScript errors in their child component tree and display fallback UI. Use them to prevent the entire app from crashing when individual components fail, providing better user experience and error isolation.

### Q2: What types of errors do Error Boundaries NOT catch?

**Answer:** Error Boundaries don't catch:

- Event handler errors
- Asynchronous code errors (setTimeout, promises)
- Server-side rendering errors
- Errors in the error boundary itself

### Q3: How do you handle async errors in React?

**Answer:** Use try-catch blocks in async functions and either:

- Set error state to display error UI
- Use a custom hook that throws errors to be caught by boundaries
- Use global error handlers for unhandled promise rejections

### Q4: Can you create Error Boundaries with hooks?

**Answer:** No, Error Boundaries require class components with `componentDidCatch` and `getDerivedStateFromError`. However, you can create HOCs or custom hooks that work with class-based error boundaries.

## Performance Considerations

- Error boundaries add minimal overhead when no errors occur
- Avoid deeply nested error boundaries unless necessary
- Consider the scope of each boundary to balance granularity and performance
- Use React DevTools to identify components that frequently error
- Implement efficient error logging to avoid performance impacts
