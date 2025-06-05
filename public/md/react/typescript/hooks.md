# TypeScript with React Hooks

React hooks with TypeScript provide type safety and better developer experience. This guide covers typing patterns for all React hooks.

## useState Hook

### Basic State Types

```typescript
import { useState } from "react";

// Primitive types
const [count, setCount] = useState<number>(0);
const [name, setName] = useState<string>("");
const [isVisible, setIsVisible] = useState<boolean>(true);

// Array types
const [items, setItems] = useState<string[]>([]);
const [numbers, setNumbers] = useState<number[]>([1, 2, 3]);

// Object types
interface User {
  id: number;
  name: string;
  email: string;
}

const [user, setUser] = useState<User | null>(null);
```

### Complex State Types

```typescript
// Union types
type Status = "loading" | "success" | "error";
const [status, setStatus] = useState<Status>("loading");

// Generic state
interface ApiResponse<T> {
  data: T;
  loading: boolean;
  error: string | null;
}

const [apiState, setApiState] = useState<ApiResponse<User[]>>({
  data: [],
  loading: false,
  error: null,
});

// Lazy initial state
const [expensiveValue, setExpensiveValue] = useState<number>(() => {
  return computeExpensiveValue();
});
```

## useEffect Hook

### Basic Effect Typing

```typescript
import { useEffect } from "react";

// Basic effect
useEffect(() => {
  console.log("Component mounted");
}, []);

// Effect with cleanup
useEffect(() => {
  const timer = setInterval(() => {
    console.log("Timer tick");
  }, 1000);

  return () => {
    clearInterval(timer);
  };
}, []);

// Effect with dependencies
useEffect(() => {
  fetchUserData(userId);
}, [userId]);
```

### Async Effects

```typescript
// Correct way to handle async in useEffect
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch("/api/users");
      const users: User[] = await response.json();
      setUsers(users);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  fetchData();
}, []);

// With AbortController
useEffect(() => {
  const controller = new AbortController();

  const fetchData = async () => {
    try {
      const response = await fetch("/api/users", {
        signal: controller.signal,
      });
      const users: User[] = await response.json();
      setUsers(users);
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Failed to fetch users:", error);
      }
    }
  };

  fetchData();

  return () => {
    controller.abort();
  };
}, []);
```

## useRef Hook

### Basic Ref Types

```typescript
import { useRef, useEffect } from "react";

// DOM element refs
const inputRef = useRef<HTMLInputElement>(null);
const divRef = useRef<HTMLDivElement>(null);
const buttonRef = useRef<HTMLButtonElement>(null);

// Using refs
useEffect(() => {
  if (inputRef.current) {
    inputRef.current.focus();
  }
}, []);

// Mutable value refs
const countRef = useRef<number>(0);
const timerRef = useRef<NodeJS.Timeout | null>(null);
```

### Generic Refs

```typescript
// Generic component ref
interface CustomComponentRef {
  reset: () => void;
  getValue: () => string;
}

const customRef = useRef<CustomComponentRef>(null);

// Using with forwardRef
const CustomInput = forwardRef<HTMLInputElement, { placeholder: string }>(
  ({ placeholder }, ref) => {
    return <input ref={ref} placeholder={placeholder} />;
  }
);
```

## useContext Hook

### Typed Context

```typescript
import { createContext, useContext, ReactNode } from "react";

// Define context type
interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

// Create context with default value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Custom hook for using context
const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Provider component
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

## useReducer Hook

### Basic Reducer Typing

```typescript
import { useReducer } from "react";

// State type
interface CounterState {
  count: number;
  step: number;
}

// Action types
type CounterAction =
  | { type: "increment" }
  | { type: "decrement" }
  | { type: "set"; payload: number }
  | { type: "setStep"; payload: number };

// Reducer function
const counterReducer = (
  state: CounterState,
  action: CounterAction
): CounterState => {
  switch (action.type) {
    case "increment":
      return { ...state, count: state.count + state.step };
    case "decrement":
      return { ...state, count: state.count - state.step };
    case "set":
      return { ...state, count: action.payload };
    case "setStep":
      return { ...state, step: action.payload };
    default:
      return state;
  }
};

// Using the reducer
const Counter: React.FC = () => {
  const [state, dispatch] = useReducer(counterReducer, {
    count: 0,
    step: 1,
  });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
      <button onClick={() => dispatch({ type: "set", payload: 10 })}>
        Set to 10
      </button>
    </div>
  );
};
```

### Complex Reducer Example

```typescript
// Form state management
interface FormField {
  value: string;
  error: string | null;
  touched: boolean;
}

interface FormState {
  fields: Record<string, FormField>;
  isSubmitting: boolean;
  isValid: boolean;
}

type FormAction =
  | { type: "SET_FIELD"; field: string; value: string }
  | { type: "SET_ERROR"; field: string; error: string | null }
  | { type: "SET_TOUCHED"; field: string }
  | { type: "SET_SUBMITTING"; isSubmitting: boolean }
  | { type: "RESET_FORM" };

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        fields: {
          ...state.fields,
          [action.field]: {
            ...state.fields[action.field],
            value: action.value,
          },
        },
      };
    case "SET_ERROR":
      return {
        ...state,
        fields: {
          ...state.fields,
          [action.field]: {
            ...state.fields[action.field],
            error: action.error,
          },
        },
      };
    default:
      return state;
  }
};
```

## useCallback Hook

### Basic Callback Typing

```typescript
import { useCallback } from "react";

// Basic callback
const handleClick = useCallback(() => {
  console.log("Button clicked");
}, []);

// Callback with parameters
const handleSubmit = useCallback((data: FormData) => {
  submitForm(data);
}, []);

// Event handlers
const handleInputChange = useCallback(
  (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  },
  []
);

// Generic callback
const createHandler = useCallback(
  <T>(item: T) =>
    (event: React.MouseEvent) => {
      handleItemClick(item);
    },
  []
);
```

## useMemo Hook

### Memoized Values

```typescript
import { useMemo } from "react";

// Basic memoization
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// Memoized object
const config = useMemo(
  () => ({
    apiUrl: process.env.REACT_APP_API_URL,
    timeout: 5000,
    retries: 3,
  }),
  []
);

// Memoized filtered data
const filteredUsers = useMemo(() => {
  return users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
}, [users, searchTerm]);

// Complex memoization
interface ProcessedData {
  total: number;
  average: number;
  categories: Record<string, number>;
}

const processedData = useMemo((): ProcessedData => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const average = total / data.length;
  const categories = data.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.value;
    return acc;
  }, {} as Record<string, number>);

  return { total, average, categories };
}, [data]);
```

## Custom Hooks

### Basic Custom Hook

```typescript
// Custom hook for local storage
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
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
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
```

### Generic Custom Hooks

```typescript
// Generic API hook
interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useApi<T>(url: string): ApiState<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: T = await response.json();
        setState({ data, loading: false, error: null });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    };

    fetchData();
  }, [url]);

  return state;
}

// Usage
const { data: users, loading, error } = useApi<User[]>("/api/users");
```

### Advanced Custom Hook

```typescript
// Form validation hook
interface ValidationRule<T> {
  test: (value: T) => boolean;
  message: string;
}

interface UseFormOptions<T> {
  initialValues: T;
  validationRules?: Partial<Record<keyof T, ValidationRule<T[keyof T]>[]>>;
  onSubmit: (values: T) => void | Promise<void>;
}

function useForm<T extends Record<string, any>>({
  initialValues,
  validationRules = {},
  onSubmit,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback(
    (name: keyof T, value: T[keyof T]) => {
      const rules = validationRules[name];
      if (!rules) return null;

      for (const rule of rules) {
        if (!rule.test(value)) {
          return rule.message;
        }
      }
      return null;
    },
    [validationRules]
  );

  const handleChange = useCallback(
    (name: keyof T) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value as T[keyof T];
      setValues((prev) => ({ ...prev, [name]: value }));

      if (touched[name]) {
        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error || undefined }));
      }
    },
    [touched, validateField]
  );

  const handleBlur = useCallback(
    (name: keyof T) => () => {
      setTouched((prev) => ({ ...prev, [name]: true }));
      const error = validateField(name, values[name]);
      setErrors((prev) => ({ ...prev, [name]: error || undefined }));
    },
    [values, validateField]
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setIsSubmitting(true);

      // Validate all fields
      const newErrors: Partial<Record<keyof T, string>> = {};
      for (const name in values) {
        const error = validateField(name, values[name]);
        if (error) newErrors[name] = error;
      }

      setErrors(newErrors);
      setTouched(
        Object.keys(values).reduce((acc, key) => {
          acc[key as keyof T] = true;
          return acc;
        }, {} as Partial<Record<keyof T, boolean>>)
      );

      if (Object.keys(newErrors).length === 0) {
        try {
          await onSubmit(values);
        } catch (error) {
          console.error("Form submission error:", error);
        }
      }

      setIsSubmitting(false);
    },
    [values, validateField, onSubmit]
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  };
}
```

## Best Practices

### Type Safety

- Always provide explicit types for complex state
- Use union types for status/state enums
- Leverage TypeScript's inference when possible
- Use generic types for reusable hooks

### Performance

- Type useCallback and useMemo return values
- Use proper dependency arrays
- Avoid creating objects in render

### Error Handling

- Type error states properly
- Use optional chaining for refs
- Handle async operations safely
- Provide fallback values

### Custom Hooks

- Export types alongside hooks
- Use generic constraints appropriately
- Document complex hook behaviors
- Test custom hooks thoroughly

## Common Patterns

### Controlled Components

```typescript
interface InputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

const Input: React.FC<InputProps> = ({ value, onChange, label }) => {
  return (
    <div>
      <label>{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
```

### Render Props Pattern

```typescript
interface RenderPropsComponent<T> {
  children: (data: T, loading: boolean, error: string | null) => ReactNode;
  url: string;
}

function DataProvider<T>({ children, url }: RenderPropsComponent<T>) {
  const { data, loading, error } = useApi<T>(url);
  return <>{children(data, loading, error)}</>;
}
```

This comprehensive guide covers TypeScript integration with React hooks, providing type-safe patterns for modern React development.
