# React Hooks Testing

Testing React hooks is essential for ensuring your custom hooks work correctly in isolation and within components.

## Testing Custom Hooks with renderHook

### Basic Hook Testing

```tsx
import { renderHook, act } from "@testing-library/react";
import { useCounter } from "./useCounter";

function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => setCount((c) => c + 1), []);
  const decrement = useCallback(() => setCount((c) => c - 1), []);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);

  return { count, increment, decrement, reset };
}

describe("useCounter", () => {
  it("should initialize with default value", () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it("should initialize with custom value", () => {
    const { result } = renderHook(() => useCounter(5));
    expect(result.current.count).toBe(5);
  });

  it("should increment count", () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it("should reset to initial value", () => {
    const { result } = renderHook(() => useCounter(10));

    act(() => {
      result.current.increment();
      result.current.reset();
    });

    expect(result.current.count).toBe(10);
  });
});
```

### Testing Hooks with Dependencies

```tsx
import { renderHook } from "@testing-library/react";
import { useLocalStorage } from "./useLocalStorage";

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("should return initial value when localStorage is empty", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));
    expect(result.current[0]).toBe("initial");
  });

  it("should return stored value from localStorage", () => {
    localStorage.setItem("test-key", JSON.stringify("stored-value"));

    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));
    expect(result.current[0]).toBe("stored-value");
  });

  it("should update localStorage when value changes", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    act(() => {
      result.current[1]("new-value");
    });

    expect(localStorage.getItem("test-key")).toBe('"new-value"');
    expect(result.current[0]).toBe("new-value");
  });
});
```

## Testing Hooks with Context

### Creating Test Wrapper

```tsx
import { ReactNode } from "react";
import { renderHook } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const createWrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe("useAuth", () => {
  it("should provide initial auth state", () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper,
    });

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("should handle login", async () => {
    const mockUser = { id: "1", email: "test@example.com" };
    jest.spyOn(authService, "login").mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper,
    });

    await act(async () => {
      await result.current.login("test@example.com", "password");
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.loading).toBe(false);
  });
});
```

### Testing Hook with Custom Provider

```tsx
interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const createThemeWrapper = (initialTheme: "light" | "dark" = "light") => {
  return function ThemeWrapper({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<"light" | "dark">(initialTheme);

    const toggleTheme = () => {
      setTheme((current) => (current === "light" ? "dark" : "light"));
    };

    return (
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    );
  };
};

describe("useTheme", () => {
  it("should use initial theme", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: createThemeWrapper("dark"),
    });

    expect(result.current.theme).toBe("dark");
  });

  it("should toggle theme", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: createThemeWrapper("light"),
    });

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe("dark");
  });
});
```

## Testing Async Hooks

### Testing API Hooks

```tsx
import { renderHook, waitFor } from "@testing-library/react";
import { useApi } from "./useApi";

function useApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch");
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

describe("useApi", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("should fetch data successfully", async () => {
    const mockData = { id: 1, name: "Test" };
    fetchMock.mockResponseOnce(JSON.stringify(mockData));

    const { result } = renderHook(() => useApi<typeof mockData>("/api/test"));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it("should handle fetch error", async () => {
    fetchMock.mockRejectOnce(new Error("Network error"));

    const { result } = renderHook(() => useApi("/api/test"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Network error");
    expect(result.current.data).toBeNull();
  });
});
```

### Testing Hook with Debounce

```tsx
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "./useDebounce";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

describe("useDebounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should debounce value changes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 500 } }
    );

    expect(result.current).toBe("initial");

    rerender({ value: "updated", delay: 500 });
    expect(result.current).toBe("initial");

    act(() => {
      jest.advanceTimersByTime(250);
    });
    expect(result.current).toBe("initial");

    act(() => {
      jest.advanceTimersByTime(250);
    });
    expect(result.current).toBe("updated");
  });
});
```

## Testing Hook Side Effects

### Testing useEffect Cleanup

```tsx
import { renderHook } from "@testing-library/react";
import { useWindowSize } from "./useWindowSize";

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

describe("useWindowSize", () => {
  const originalInnerWidth = window.innerWidth;
  const originalInnerHeight = window.innerHeight;

  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 768,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: originalInnerHeight,
    });
  });

  it("should return initial window size", () => {
    const { result } = renderHook(() => useWindowSize());

    expect(result.current).toEqual({
      width: 1024,
      height: 768,
    });
  });

  it("should update size on window resize", () => {
    const { result } = renderHook(() => useWindowSize());

    act(() => {
      Object.defineProperty(window, "innerWidth", { value: 1920 });
      Object.defineProperty(window, "innerHeight", { value: 1080 });
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current).toEqual({
      width: 1920,
      height: 1080,
    });
  });

  it("should cleanup event listener on unmount", () => {
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useWindowSize());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "resize",
      expect.any(Function)
    );
  });
});
```

## Testing Hook Errors

### Error Boundary Testing

```tsx
import { renderHook } from "@testing-library/react";
import { ErrorBoundary } from "react-error-boundary";
import { useAsyncError } from "./useAsyncError";

function useAsyncError() {
  const [error, setError] = useState<Error | null>(null);

  const throwError = useCallback((error: Error) => {
    setError(error);
  }, []);

  useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { throwError };
}

function ErrorFallback({ error }: { error: Error }) {
  return <div>Error: {error.message}</div>;
}

const createErrorWrapper = ({ children }: { children: ReactNode }) => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>
);

describe("useAsyncError", () => {
  it("should throw error when throwError is called", () => {
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { result } = renderHook(() => useAsyncError(), {
      wrapper: createErrorWrapper,
    });

    expect(() => {
      act(() => {
        result.current.throwError(new Error("Test error"));
      });
    }).toThrow("Test error");

    consoleError.mockRestore();
  });
});
```

## Performance Testing

### Testing Hook Performance

```tsx
import { renderHook } from "@testing-library/react";
import { useExpensiveCalculation } from "./useExpensiveCalculation";

function useExpensiveCalculation(input: number) {
  return useMemo(() => {
    let result = 0;
    for (let i = 0; i < input * 1000000; i++) {
      result += i;
    }
    return result;
  }, [input]);
}

describe("useExpensiveCalculation", () => {
  it("should memoize expensive calculations", () => {
    const { result, rerender } = renderHook(
      ({ input }) => useExpensiveCalculation(input),
      { initialProps: { input: 5 } }
    );

    const firstResult = result.current;

    rerender({ input: 5 });
    expect(result.current).toBe(firstResult);

    rerender({ input: 10 });
    expect(result.current).not.toBe(firstResult);
  });

  it("should not recalculate with same input", () => {
    const spy = jest.fn();

    function useTestCalculation(input: number) {
      return useMemo(() => {
        spy();
        return input * 2;
      }, [input]);
    }

    const { rerender } = renderHook(({ input }) => useTestCalculation(input), {
      initialProps: { input: 5 },
    });

    expect(spy).toHaveBeenCalledTimes(1);

    rerender({ input: 5 });
    expect(spy).toHaveBeenCalledTimes(1);

    rerender({ input: 10 });
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
```

## Best Practices

### Hook Testing Patterns

```tsx
const renderHookWithQuery = <T,>(hook: () => T) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return { ...renderHook(hook, { wrapper }), queryClient };
};

const mockLocalStorage = () => {
  const store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach((key) => delete store[key]);
    }),
  };
};

beforeEach(() => {
  Object.defineProperty(window, "localStorage", {
    value: mockLocalStorage(),
  });
});
```

### Common Testing Utilities

```tsx
export const createMockIntersectionObserver = () => {
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  });

  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    configurable: true,
    value: mockIntersectionObserver,
  });

  return mockIntersectionObserver;
};

export const createMockResizeObserver = () => {
  const mockResizeObserver = jest.fn();
  mockResizeObserver.mockReturnValue({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  });

  Object.defineProperty(window, "ResizeObserver", {
    writable: true,
    configurable: true,
    value: mockResizeObserver,
  });

  return mockResizeObserver;
};
```

## Interview Questions

**Q: How do you test custom hooks in React?**
A: Use `renderHook` from React Testing Library. Wrap state updates in `act()` and use `waitFor` for async operations.

**Q: How do you test hooks that use Context?**
A: Create a wrapper component that provides the necessary context and pass it to `renderHook` options.

**Q: How do you test hook cleanup functions?**
A: Use spies on cleanup functions and call `unmount()` on the hook result to verify cleanup is called.

**Q: How do you test async hooks?**
A: Use `waitFor` to wait for async operations to complete and mock external dependencies like fetch or API calls.

**Q: How do you test hook performance?**
A: Test that memoized values don't change with same inputs and that expensive calculations are only run when dependencies change.
