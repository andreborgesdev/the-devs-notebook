# Custom Hooks Patterns

Custom hooks are JavaScript functions that start with "use" and can call other hooks. They enable logic sharing between components while maintaining the benefits of React's hook system.

## Basic Custom Hook Patterns

### State Management Hook

```typescript
import { useState, useCallback } from "react";

interface UseToggleReturn {
  value: boolean;
  toggle: () => void;
  setTrue: () => void;
  setFalse: () => void;
  setValue: (value: boolean) => void;
}

function useToggle(initialValue: boolean = false): UseToggleReturn {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return {
    value,
    toggle,
    setTrue,
    setFalse,
    setValue,
  };
}

// Usage
function Modal() {
  const { value: isOpen, toggle, setFalse } = useToggle();

  return (
    <>
      <button onClick={toggle}>Open Modal</button>
      {isOpen && (
        <div className="modal">
          <p>Modal Content</p>
          <button onClick={setFalse}>Close</button>
        </div>
      )}
    </>
  );
}
```

### Counter Hook with Advanced Features

```typescript
interface UseCounterOptions {
  min?: number;
  max?: number;
  step?: number;
}

interface UseCounterReturn {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  set: (value: number) => void;
  canIncrement: boolean;
  canDecrement: boolean;
}

function useCounter(
  initialValue: number = 0,
  options: UseCounterOptions = {}
): UseCounterReturn {
  const { min = -Infinity, max = Infinity, step = 1 } = options;
  const [count, setCount] = useState(() => {
    return Math.max(min, Math.min(max, initialValue));
  });

  const increment = useCallback(() => {
    setCount((prev) => Math.min(max, prev + step));
  }, [max, step]);

  const decrement = useCallback(() => {
    setCount((prev) => Math.max(min, prev - step));
  }, [min, step]);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  const set = useCallback(
    (value: number) => {
      setCount(Math.max(min, Math.min(max, value)));
    },
    [min, max]
  );

  return {
    count,
    increment,
    decrement,
    reset,
    set,
    canIncrement: count < max,
    canDecrement: count > min,
  };
}

// Usage
function CounterComponent() {
  const { count, increment, decrement, reset, canIncrement, canDecrement } =
    useCounter(0, { min: 0, max: 10, step: 2 });

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment} disabled={!canIncrement}>
        +2
      </button>
      <button onClick={decrement} disabled={!canDecrement}>
        -2
      </button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

## Data Fetching Hooks

### Generic API Hook

```typescript
interface UseApiOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  transform?: (data: any) => T;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
}

function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<any>,
  options: UseApiOptions<T> = {}
): UseApiReturn<T> {
  const {
    immediate = false,
    onSuccess,
    onError,
    transform = (data) => data,
  } = options;

  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: Error | null;
  }>({
    data: null,
    loading: immediate,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const response = await apiFunction(...args);
        const transformedData = transform(response);

        setState({
          data: transformedData,
          loading: false,
          error: null,
        });

        onSuccess?.(transformedData);
        return transformedData;
      } catch (error) {
        const errorObj =
          error instanceof Error ? error : new Error("Unknown error");
        setState({
          data: null,
          loading: false,
          error: errorObj,
        });

        onError?.(errorObj);
        throw errorObj;
      }
    },
    [apiFunction, transform, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    ...state,
    execute,
    reset,
  };
}

// Usage
interface User {
  id: number;
  name: string;
  email: string;
}

function UserProfile({ userId }: { userId: number }) {
  const fetchUser = useCallback(
    (id: number) => fetch(`/api/users/${id}`).then((res) => res.json()),
    []
  );

  const {
    data: user,
    loading,
    error,
    execute,
  } = useApi<User>(fetchUser, {
    immediate: true,
    onSuccess: (user) => console.log("User loaded:", user.name),
    onError: (error) => console.error("Failed to load user:", error),
  });

  useEffect(() => {
    execute(userId);
  }, [userId, execute]);

  if (loading) return <div>Loading user...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!user) return <div>No user found</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

### Paginated Data Hook

```typescript
interface UsePaginationOptions<T> {
  pageSize?: number;
  immediate?: boolean;
  transform?: (response: any) => { items: T[]; total: number };
}

interface UsePaginationReturn<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (page: number) => void;
  refresh: () => void;
}

function usePagination<T>(
  fetchFunction: (page: number, pageSize: number) => Promise<any>,
  options: UsePaginationOptions<T> = {}
): UsePaginationReturn<T> {
  const {
    pageSize = 10,
    immediate = true,
    transform = (response) => response,
  } = options;

  const [state, setState] = useState({
    data: [] as T[],
    loading: immediate,
    error: null as Error | null,
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
  });

  const fetchPage = useCallback(
    async (page: number) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const response = await fetchFunction(page, pageSize);
        const { items, total } = transform(response);

        setState((prev) => ({
          ...prev,
          data: items,
          loading: false,
          currentPage: page,
          totalItems: total,
          totalPages: Math.ceil(total / pageSize),
        }));
      } catch (error) {
        const errorObj =
          error instanceof Error ? error : new Error("Unknown error");
        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorObj,
        }));
      }
    },
    [fetchFunction, pageSize, transform]
  );

  const nextPage = useCallback(() => {
    if (state.currentPage < state.totalPages) {
      fetchPage(state.currentPage + 1);
    }
  }, [state.currentPage, state.totalPages, fetchPage]);

  const previousPage = useCallback(() => {
    if (state.currentPage > 1) {
      fetchPage(state.currentPage - 1);
    }
  }, [state.currentPage, fetchPage]);

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= state.totalPages) {
        fetchPage(page);
      }
    },
    [state.totalPages, fetchPage]
  );

  const refresh = useCallback(() => {
    fetchPage(state.currentPage);
  }, [state.currentPage, fetchPage]);

  useEffect(() => {
    if (immediate) {
      fetchPage(1);
    }
  }, [immediate, fetchPage]);

  return {
    ...state,
    hasNextPage: state.currentPage < state.totalPages,
    hasPreviousPage: state.currentPage > 1,
    nextPage,
    previousPage,
    goToPage,
    refresh,
  };
}
```

## Form Handling Hooks

### Advanced Form Hook

```typescript
interface UseFormOptions<T> {
  initialValues: T;
  validationSchema?: (values: T) => Record<keyof T, string>;
  onSubmit: (values: T) => Promise<void> | void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
  handleChange: (field: keyof T, value: any) => void;
  handleBlur: (field: kyof T) => void;
  handleSubmit: (e?: React.FormEvent) => void;
  setFieldValue: (field: keyof T, value: any) => void;
  setFieldError: (field: keyof T, error: string) => void;
  resetForm: () => void;
}

function useForm<T extends Record<string, any>>(
  options: UseFormOptions<T>
): UseFormReturn<T> {
  const {
    initialValues,
    validationSchema,
    onSubmit,
    validateOnChange = true,
    validateOnBlur = true
  } = options;

  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = useCallback((valuesToValidate: T) => {
    if (!validationSchema) return {};
    return validationSchema(valuesToValidate);
  }, [validationSchema]);

  const handleChange = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));

    if (validateOnChange && validationSchema) {
      const newValues = { ...values, [field]: value };
      const fieldErrors = validate(newValues);
      setErrors(prev => ({
        ...prev,
        [field]: fieldErrors[field]
      }));
    }
  }, [values, validate, validateOnChange, validationSchema]);

  const handleBlur = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));

    if (validateOnBlur && validationSchema) {
      const fieldErrors = validate(values);
      setErrors(prev => ({
        ...prev,
        [field]: fieldErrors[field]
      }));
    }
  }, [values, validate, validateOnBlur, validationSchema]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();

    const formErrors = validate(values);
    setErrors(formErrors);

    const hasErrors = Object.values(formErrors).some(error => error);
    if (hasErrors) return;

    try {
      setIsSubmitting(true);
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validate, onSubmit]);

  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
  }, []);

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const isValid = useMemo(() => {
    return Object.values(errors).every(error => !error);
  }, [errors]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    resetForm
  };
}

// Usage
interface LoginForm {
  email: string;
  password: string;
}

function LoginComponent() {
  const form = useForm<LoginForm>({
    initialValues: { email: '', password: '' },
    validationSchema: (values) => {
      const errors: Partial<Record<keyof LoginForm, string>> = {};

      if (!values.email) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = 'Email is invalid';
      }

      if (!values.password) {
        errors.password = 'Password is required';
      } else if (values.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }

      return errors;
    },
    onSubmit: async (values) => {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }
    }
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <div>
        <input
          type="email"
          value={form.values.email}
          onChange={(e) => form.handleChange('email', e.target.value)}
          onBlur={() => form.handleBlur('email')}
          placeholder="Email"
        />
        {form.touched.email && form.errors.email && (
          <span className="error">{form.errors.email}</span>
        )}
      </div>

      <div>
        <input
          type="password"
          value={form.values.password}
          onChange={(e) => form.handleChange('password', e.target.value)}
          onBlur={() => form.handleBlur('password')}
          placeholder="Password"
        />
        {form.touched.password && form.errors.password && (
          <span className="error">{form.errors.password}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={form.isSubmitting || !form.isValid}
      >
        {form.isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

## Storage Hooks

### Local Storage Hook with Sync

```typescript
interface UseLocalStorageOptions<T> {
  serializer?: {
    parse: (value: string) => T;
    stringify: (value: T) => string;
  };
  syncAcrossTabs?: boolean;
}

function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions<T> = {}
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const {
    serializer = {
      parse: JSON.parse,
      stringify: JSON.stringify,
    },
    syncAcrossTabs = true,
  } = options;

  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? serializer.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, serializer.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue, serializer]
  );

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  useEffect(() => {
    if (!syncAcrossTabs) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(serializer.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing localStorage key "${key}":`, error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, serializer, syncAcrossTabs]);

  return [storedValue, setValue, removeValue];
}

// Usage
function SettingsComponent() {
  const [theme, setTheme, removeTheme] = useLocalStorage("theme", "light");
  const [userPrefs, setUserPrefs] = useLocalStorage("userPrefs", {
    notifications: true,
    language: "en",
  });

  return (
    <div>
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        Current theme: {theme}
      </button>

      <label>
        <input
          type="checkbox"
          checked={userPrefs.notifications}
          onChange={(e) =>
            setUserPrefs((prev) => ({
              ...prev,
              notifications: e.target.checked,
            }))
          }
        />
        Enable notifications
      </label>
    </div>
  );
}
```

## Event Handling Hooks

### Event Listener Hook

```typescript
interface UseEventListenerOptions {
  passive?: boolean;
  capture?: boolean;
}

function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: Window,
  options?: UseEventListenerOptions
): void;

function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void,
  element: Document,
  options?: UseEventListenerOptions
): void;

function useEventListener<K extends keyof HTMLElementEventMap>(
  eventName: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  element: HTMLElement | null,
  options?: UseEventListenerOptions
): void;

function useEventListener(
  eventName: string,
  handler: (event: Event) => void,
  element: EventTarget | null = window,
  options: UseEventListenerOptions = {}
) {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!element?.addEventListener) return;

    const eventListener = (event: Event) => savedHandler.current(event);

    element.addEventListener(eventName, eventListener, options);

    return () => {
      element.removeEventListener(eventName, eventListener, options);
    };
  }, [eventName, element, options.passive, options.capture]);
}

// Usage examples
function WindowSizeTracker() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEventListener("resize", () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  });

  return (
    <div>
      Window size: {windowSize.width} x {windowSize.height}
    </div>
  );
}

function EscapeKeyHandler() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEventListener("keydown", (event) => {
    if (event.key === "Escape" && isModalOpen) {
      setIsModalOpen(false);
    }
  });

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>Open Modal</button>
      {isModalOpen && (
        <div className="modal">
          <p>Press Escape to close</p>
          <button onClick={() => setIsModalOpen(false)}>Close</button>
        </div>
      )}
    </div>
  );
}
```

### Debounced Value Hook

```typescript
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

// Advanced debounced callback hook
function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): T {
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout>();

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      const newTimer = setTimeout(() => {
        callback(...args);
      }, delay);

      setDebounceTimer(newTimer);
    },
    [callback, delay, ...deps]
  ) as T;

  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return debouncedCallback;
}

// Usage
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const performSearch = useDebouncedCallback(
    async (term: string) => {
      if (term) {
        const response = await fetch(`/api/search?q=${term}`);
        const data = await response.json();
        setResults(data);
      } else {
        setResults([]);
      }
    },
    300,
    []
  );

  useEffect(() => {
    performSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, performSearch]);

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
      />

      <div>
        {results.map((result: any) => (
          <div key={result.id}>{result.title}</div>
        ))}
      </div>
    </div>
  );
}
```

## Advanced Patterns

### Compound Hook Pattern

```typescript
interface UseDisclosureReturn {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  getButtonProps: () => {
    "aria-expanded": boolean;
    onClick: () => void;
  };
  getDisclosureProps: () => {
    hidden: boolean;
  };
}

function useDisclosure(initialState: boolean = false): UseDisclosureReturn {
  const [isOpen, setIsOpen] = useState(initialState);

  const onOpen = useCallback(() => setIsOpen(true), []);
  const onClose = useCallback(() => setIsOpen(false), []);
  const onToggle = useCallback(() => setIsOpen((prev) => !prev), []);

  const getButtonProps = useCallback(
    () => ({
      "aria-expanded": isOpen,
      onClick: onToggle,
    }),
    [isOpen, onToggle]
  );

  const getDisclosureProps = useCallback(
    () => ({
      hidden: !isOpen,
    }),
    [isOpen]
  );

  return {
    isOpen,
    onOpen,
    onClose,
    onToggle,
    getButtonProps,
    getDisclosureProps,
  };
}

// Usage
function AccordionItem({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { getButtonProps, getDisclosureProps } = useDisclosure();

  return (
    <div>
      <button {...getButtonProps()}>{title}</button>
      <div {...getDisclosureProps()}>{children}</div>
    </div>
  );
}
```

### State Machine Hook

```typescript
type State = "idle" | "loading" | "success" | "error";
type Event = "FETCH" | "SUCCESS" | "ERROR" | "RESET";

interface StateMachine {
  [key: string]: {
    [event: string]: State;
  };
}

const stateMachine: StateMachine = {
  idle: {
    FETCH: "loading",
  },
  loading: {
    SUCCESS: "success",
    ERROR: "error",
  },
  success: {
    FETCH: "loading",
    RESET: "idle",
  },
  error: {
    FETCH: "loading",
    RESET: "idle",
  },
};

interface UseStateMachineReturn {
  state: State;
  send: (event: Event) => void;
  can: (event: Event) => boolean;
}

function useStateMachine(initialState: State): UseStateMachineReturn {
  const [state, setState] = useState<State>(initialState);

  const send = useCallback(
    (event: Event) => {
      const currentStateConfig = stateMachine[state];
      const nextState = currentStateConfig?.[event];

      if (nextState) {
        setState(nextState);
      }
    },
    [state]
  );

  const can = useCallback(
    (event: Event) => {
      const currentStateConfig = stateMachine[state];
      return Boolean(currentStateConfig?.[event]);
    },
    [state]
  );

  return { state, send, can };
}

// Usage
function DataFetcher() {
  const { state, send, can } = useStateMachine("idle");
  const [data, setData] = useState(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!can("FETCH")) return;

    send("FETCH");

    try {
      const response = await fetch("/api/data");
      const result = await response.json();
      setData(result);
      send("SUCCESS");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      send("ERROR");
    }
  }, [send, can]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    send("RESET");
  }, [send]);

  return (
    <div>
      <p>State: {state}</p>

      {state === "idle" && <button onClick={fetchData}>Fetch Data</button>}

      {state === "loading" && <div>Loading...</div>}

      {state === "success" && (
        <div>
          <pre>{JSON.stringify(data, null, 2)}</pre>
          <button onClick={fetchData} disabled={!can("FETCH")}>
            Refresh
          </button>
          <button onClick={reset}>Reset</button>
        </div>
      )}

      {state === "error" && (
        <div>
          <p>Error: {error}</p>
          <button onClick={fetchData}>Retry</button>
          <button onClick={reset}>Reset</button>
        </div>
      )}
    </div>
  );
}
```

## Testing Custom Hooks

### Hook Testing Utilities

```typescript
import { renderHook, act } from "@testing-library/react";

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

  it("should respect max boundary", () => {
    const { result } = renderHook(() => useCounter(9, { max: 10 }));

    act(() => {
      result.current.increment();
      result.current.increment(); // Should not exceed max
    });

    expect(result.current.count).toBe(10);
    expect(result.current.canIncrement).toBe(false);
  });
});

describe("useApi", () => {
  const mockApiFunction = jest.fn();

  beforeEach(() => {
    mockApiFunction.mockClear();
  });

  it("should handle successful API call", async () => {
    const mockData = { id: 1, name: "Test" };
    mockApiFunction.mockResolvedValue(mockData);

    const { result } = renderHook(() => useApi(mockApiFunction));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should handle API error", async () => {
    const mockError = new Error("API Error");
    mockApiFunction.mockRejectedValue(mockError);

    const { result } = renderHook(() => useApi(mockApiFunction));

    await act(async () => {
      try {
        await result.current.execute();
      } catch (error) {
        // Expected to throw
      }
    });

    expect(result.current.data).toBe(null);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toEqual(mockError);
  });
});
```

## Performance Optimization

### Memoized Hook Pattern

```typescript
function useExpensiveValue<T>(
  computeValue: () => T,
  deps: React.DependencyList
): T {
  const memoizedValue = useMemo(computeValue, deps);
  return memoizedValue;
}

function useStableCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  return useCallback(callback, deps);
}

// Usage
function ExpensiveComponent({
  data,
  onUpdate,
}: {
  data: any[];
  onUpdate: (id: string) => void;
}) {
  const processedData = useExpensiveValue(() => {
    return data.map((item) => ({
      ...item,
      computed: expensiveComputation(item),
    }));
  }, [data]);

  const stableOnUpdate = useStableCallback(onUpdate, []);

  return (
    <div>
      {processedData.map((item) => (
        <div key={item.id} onClick={() => stableOnUpdate(item.id)}>
          {item.computed}
        </div>
      ))}
    </div>
  );
}
```

## Best Practices

### Hook Composition Guidelines

1. **Single Responsibility**: Each hook should have a single, well-defined purpose
2. **Stable API**: Provide consistent return values and function signatures
3. **Performance**: Use memoization appropriately to prevent unnecessary re-renders
4. **Error Handling**: Handle errors gracefully and provide meaningful error states
5. **Testing**: Write comprehensive tests for all hook behaviors

### Common Patterns

```typescript
// ✅ Good: Stable return object
function useUserData(userId: string) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    // fetch logic
  }, [userId]);

  // Return stable object structure
  return useMemo(
    () => ({
      user,
      loading,
      refetch: fetchUser,
    }),
    [user, loading, fetchUser]
  );
}

// ❌ Bad: Unstable return values
function useUserDataBad(userId: string) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Returns new object every render
  return {
    user,
    loading,
    refetch: () => fetchUser(userId), // New function every render
  };
}
```

## Interview Questions

### Basic Level

**Q: What are custom hooks and why would you use them?**

A: Custom hooks are JavaScript functions that start with "use" and can call other hooks. They enable logic reuse between components while maintaining the benefits of React's hook system, such as automatic cleanup and state management.

**Q: How do you create a simple custom hook?**

A: Create a function that starts with "use" and can call other hooks:

```typescript
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  const increment = () => setCount((prev) => prev + 1);
  return { count, increment };
}
```

**Q: What's the difference between custom hooks and utility functions?**

A: Custom hooks can call other hooks and participate in React's hook system, while utility functions cannot. Custom hooks can manage state and side effects, utility functions are typically pure functions.

### Intermediate Level

**Q: How do you handle cleanup in custom hooks?**

A: Use useEffect with cleanup functions:

```typescript
function useEventListener(event, handler, element = window) {
  useEffect(() => {
    element.addEventListener(event, handler);
    return () => element.removeEventListener(event, handler);
  }, [event, handler, element]);
}
```

**Q: How do you optimize custom hooks for performance?**

A: Use useCallback for stable function references, useMemo for expensive computations, and return stable object structures to prevent unnecessary re-renders.

**Q: How do you test custom hooks?**

A: Use @testing-library/react's renderHook utility to test hooks in isolation, and use act() for state updates and async operations.

### Advanced Level

**Q: How do you implement a generic data fetching hook with TypeScript?**

A: Create a generic hook with proper typing and error handling:

```typescript
function useApi<T>(apiFunction: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  // Implementation details...
}
```

**Q: How do you compose multiple custom hooks effectively?**

A: Create hooks that work well together by maintaining stable APIs, proper dependency management, and clear separation of concerns. Use hook composition patterns and ensure hooks don't create circular dependencies.

**Q: How do you handle complex state logic in custom hooks?**

A: Use useReducer for complex state logic, implement state machines, or create hooks that return dispatch functions for predictable state updates.
