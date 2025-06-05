# Advanced TypeScript Patterns in React

Advanced TypeScript patterns enable sophisticated type safety, better developer experience, and maintainable React applications.

## Conditional Types

### Component Props Based on Conditions

```typescript
// Conditional props based on a variant
type ButtonVariant = 'primary' | 'secondary' | 'link';

type ButtonProps<T extends ButtonVariant> = {
  variant: T;
  children: React.ReactNode;
} & (T extends 'link'
  ? { href: string; target?: string }
  : { onClick: () => void }
);

function Button<T extends ButtonVariant>(props: ButtonProps<T>) {
  if (props.variant === 'link') {
    return (
      <a href={props.href} target={props.target}>
        {props.children}
      </a>
    );
  }

  return (
    <button
      className={`btn btn-${props.variant}`}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

// Usage - TypeScript enforces correct props
<Button variant="primary" onClick={() => {}}>Click me</Button>
<Button variant="link" href="/home" target="_blank">Go home</Button>
```

### Conditional Return Types

```typescript
interface ApiOptions {
  returnRaw?: boolean;
}

type ApiResponse<T, O extends ApiOptions> = O["returnRaw"] extends true
  ? Response
  : { data: T; success: boolean; message: string };

async function fetchData<T, O extends ApiOptions = {}>(
  url: string,
  options?: O
): Promise<ApiResponse<T, O>> {
  const response = await fetch(url);

  if (options?.returnRaw) {
    return response as ApiResponse<T, O>;
  }

  const data: T = await response.json();
  return {
    data,
    success: response.ok,
    message: response.ok ? "Success" : "Error",
  } as ApiResponse<T, O>;
}

// Usage
const rawResponse = await fetchData("/api/users", { returnRaw: true });
const processedResponse = await fetchData<User[]>("/api/users");
```

## Mapped Types

### Form State Generation

```typescript
// Generate form state from model
type FormState<T> = {
  [K in keyof T]: {
    value: T[K];
    error: string | null;
    touched: boolean;
  };
};

// Generate validation rules
type ValidationRules<T> = {
  [K in keyof T]?: Array<{
    test: (value: T[K]) => boolean;
    message: string;
  }>;
};

interface User {
  name: string;
  email: string;
  age: number;
}

// Automatically typed form state
const userFormState: FormState<User> = {
  name: { value: "", error: null, touched: false },
  email: { value: "", error: null, touched: false },
  age: { value: 0, error: null, touched: false },
};

const userValidation: ValidationRules<User> = {
  name: [{ test: (value) => value.length > 0, message: "Name is required" }],
  email: [{ test: (value) => value.includes("@"), message: "Invalid email" }],
  age: [{ test: (value) => value >= 18, message: "Must be 18 or older" }],
};
```

### Partial Props Patterns

```typescript
// Make specific properties optional
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Make specific properties required
type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;

interface ComponentProps {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

// Make description optional
type FlexibleProps = PartialBy<ComponentProps, "description">;

// Make isActive required (if it was optional before)
type StrictProps = RequiredBy<ComponentProps, "isActive">;

function FlexibleComponent(props: FlexibleProps) {
  return <div>{props.name}</div>;
}
```

## Template Literal Types

### Dynamic Component Names

```typescript
type Size = "sm" | "md" | "lg";
type Color = "primary" | "secondary" | "danger";

type ButtonClass = `btn-${Size}-${Color}`;

interface DynamicButtonProps {
  size: Size;
  color: Color;
  children: React.ReactNode;
}

function DynamicButton({ size, color, children }: DynamicButtonProps) {
  const className: ButtonClass = `btn-${size}-${color}`;
  return <button className={className}>{children}</button>;
}
```

### API Endpoint Types

```typescript
type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";
type ResourceType = "users" | "posts" | "comments";

type ApiEndpoint = `/${ResourceType}` | `/${ResourceType}/${string}`;
type ApiUrl = `https://api.example.com${ApiEndpoint}`;

interface ApiRequest<T extends HTTPMethod> {
  method: T;
  url: ApiUrl;
  body?: T extends "POST" | "PUT" ? Record<string, any> : never;
}

async function apiRequest<T extends HTTPMethod>(
  request: ApiRequest<T>
): Promise<any> {
  const response = await fetch(request.url, {
    method: request.method,
    body: request.body ? JSON.stringify(request.body) : undefined,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.json();
}

// Usage
await apiRequest({
  method: "GET",
  url: "https://api.example.com/users",
});

await apiRequest({
  method: "POST",
  url: "https://api.example.com/users",
  body: { name: "John", email: "john@example.com" },
});
```

## Utility Types in Components

### Extracting Component Props

```typescript
// Extract props from existing components
type ButtonProps = React.ComponentProps<"button">;
type InputProps = React.ComponentProps<"input">;

// Create enhanced versions
interface EnhancedButtonProps extends ButtonProps {
  loading?: boolean;
  variant?: "primary" | "secondary";
}

function EnhancedButton({
  loading,
  variant = "primary",
  children,
  disabled,
  ...rest
}: EnhancedButtonProps) {
  return (
    <button
      {...rest}
      className={`btn btn-${variant}`}
      disabled={disabled || loading}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
```

### Component Ref Types

```typescript
// Extract ref types
type ButtonElement = React.ElementRef<"button">;
type InputElement = React.ElementRef<"input">;

interface CustomInputProps extends Omit<InputProps, "ref"> {
  label: string;
}

const CustomInput = forwardRef<InputElement, CustomInputProps>(
  ({ label, ...props }, ref) => {
    return (
      <div>
        <label>{label}</label>
        <input ref={ref} {...props} />
      </div>
    );
  }
);
```

## Advanced Hook Patterns

### Discriminated Union Hook

```typescript
type AsyncState<T, E = Error> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: E };

function useAsyncState<T, E = Error>() {
  const [state, setState] = useState<AsyncState<T, E>>({ status: "idle" });

  const setLoading = useCallback(() => {
    setState({ status: "loading" });
  }, []);

  const setSuccess = useCallback((data: T) => {
    setState({ status: "success", data });
  }, []);

  const setError = useCallback((error: E) => {
    setState({ status: "error", error });
  }, []);

  const reset = useCallback(() => {
    setState({ status: "idle" });
  }, []);

  return {
    state,
    setLoading,
    setSuccess,
    setError,
    reset,
    isIdle: state.status === "idle",
    isLoading: state.status === "loading",
    isSuccess: state.status === "success",
    isError: state.status === "error",
  };
}

// Usage with type narrowing
function UserProfile({ userId }: { userId: string }) {
  const { state, setLoading, setSuccess, setError } = useAsyncState<User>();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading();
      try {
        const user = await api.getUser(userId);
        setSuccess(user);
      } catch (error) {
        setError(error as Error);
      }
    };

    fetchUser();
  }, [userId, setLoading, setSuccess, setError]);

  // TypeScript knows the exact shape based on status
  switch (state.status) {
    case "idle":
      return <div>Click to load user</div>;
    case "loading":
      return <div>Loading...</div>;
    case "success":
      return <div>Hello, {state.data.name}!</div>; // state.data is User
    case "error":
      return <div>Error: {state.error.message}</div>; // state.error is Error
  }
}
```

### Builder Pattern Hook

```typescript
interface QueryBuilder<T> {
  where<K extends keyof T>(key: K, value: T[K]): QueryBuilder<T>;
  orderBy<K extends keyof T>(
    key: K,
    direction?: "asc" | "desc"
  ): QueryBuilder<T>;
  limit(count: number): QueryBuilder<T>;
  build(): QueryOptions<T>;
}

interface QueryOptions<T> {
  filters: Partial<T>;
  sort: { field: keyof T; direction: "asc" | "desc" } | null;
  limit: number | null;
}

function createQueryBuilder<T>(): QueryBuilder<T> {
  let filters: Partial<T> = {};
  let sort: { field: keyof T; direction: "asc" | "desc" } | null = null;
  let limitCount: number | null = null;

  return {
    where<K extends keyof T>(key: K, value: T[K]) {
      filters[key] = value;
      return this;
    },

    orderBy<K extends keyof T>(key: K, direction: "asc" | "desc" = "asc") {
      sort = { field: key, direction };
      return this;
    },

    limit(count: number) {
      limitCount = count;
      return this;
    },

    build(): QueryOptions<T> {
      return {
        filters,
        sort,
        limit: limitCount,
      };
    },
  };
}

function useQuery<T>(data: T[]) {
  const [filteredData, setFilteredData] = useState<T[]>(data);

  const query = useCallback(
    (builderFn: (builder: QueryBuilder<T>) => QueryBuilder<T>) => {
      const options = builderFn(createQueryBuilder<T>()).build();

      let result = [...data];

      // Apply filters
      Object.entries(options.filters).forEach(([key, value]) => {
        if (value !== undefined) {
          result = result.filter((item) => item[key as keyof T] === value);
        }
      });

      // Apply sorting
      if (options.sort) {
        result.sort((a, b) => {
          const aVal = a[options.sort!.field];
          const bVal = b[options.sort!.field];

          if (aVal < bVal) return options.sort!.direction === "asc" ? -1 : 1;
          if (aVal > bVal) return options.sort!.direction === "asc" ? 1 : -1;
          return 0;
        });
      }

      // Apply limit
      if (options.limit) {
        result = result.slice(0, options.limit);
      }

      setFilteredData(result);
    },
    [data]
  );

  return { data: filteredData, query };
}

// Usage
const { data: users, query } = useQuery(allUsers);

// Fluent API with full type safety
query((builder) =>
  builder.where("role", "admin").orderBy("name", "asc").limit(10)
);
```

## Type-Safe Event Handling

### Custom Event System

```typescript
type EventMap = {
  "user:login": { userId: string; timestamp: Date };
  "user:logout": { userId: string };
  "data:update": { type: string; payload: any };
  "ui:notification": { message: string; level: "info" | "warning" | "error" };
};

type EventListener<T extends keyof EventMap> = (data: EventMap[T]) => void;

class TypedEventEmitter {
  private listeners: {
    [K in keyof EventMap]?: EventListener<K>[];
  } = {};

  on<T extends keyof EventMap>(event: T, listener: EventListener<T>) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);
  }

  off<T extends keyof EventMap>(event: T, listener: EventListener<T>) {
    const eventListeners = this.listeners[event];
    if (eventListeners) {
      const index = eventListeners.indexOf(listener);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  emit<T extends keyof EventMap>(event: T, data: EventMap[T]) {
    const eventListeners = this.listeners[event];
    if (eventListeners) {
      eventListeners.forEach((listener) => listener(data));
    }
  }
}

// React hook for typed events
function useTypedEvents() {
  const emitterRef = useRef(new TypedEventEmitter());

  const on = useCallback(
    <T extends keyof EventMap>(event: T, listener: EventListener<T>) => {
      emitterRef.current.on(event, listener);

      return () => {
        emitterRef.current.off(event, listener);
      };
    },
    []
  );

  const emit = useCallback(
    <T extends keyof EventMap>(event: T, data: EventMap[T]) => {
      emitterRef.current.emit(event, data);
    },
    []
  );

  return { on, emit };
}

// Usage in components
function UserComponent() {
  const { on, emit } = useTypedEvents();

  useEffect(() => {
    const unsubscribe = on("user:login", (data) => {
      // data is properly typed as { userId: string; timestamp: Date }
      console.log(`User ${data.userId} logged in at ${data.timestamp}`);
    });

    return unsubscribe;
  }, [on]);

  const handleLogin = () => {
    emit("user:login", {
      userId: "123",
      timestamp: new Date(),
    });
  };

  return <button onClick={handleLogin}>Login</button>;
}
```

## Performance Optimization Types

### Memoization with Dependencies

```typescript
type DependencyList = ReadonlyArray<any>;

interface MemoOptions<T> {
  deps?: DependencyList;
  compare?: (prev: DependencyList, next: DependencyList) => boolean;
}

function useSmartMemo<T>(factory: () => T, options: MemoOptions<T> = {}): T {
  const { deps = [], compare } = options;

  const memoRef = useRef<{
    value: T;
    deps: DependencyList;
  }>();

  const hasChanged = useMemo(() => {
    if (!memoRef.current) return true;

    if (compare) {
      return !compare(memoRef.current.deps, deps);
    }

    return deps.some((dep, index) => dep !== memoRef.current!.deps[index]);
  }, deps);

  if (hasChanged) {
    memoRef.current = {
      value: factory(),
      deps,
    };
  }

  return memoRef.current!.value;
}

// Usage
interface ExpensiveData {
  processedItems: ProcessedItem[];
  summary: Summary;
}

function DataView({ items, filters }: { items: Item[]; filters: Filter[] }) {
  const expensiveData = useSmartMemo<ExpensiveData>(
    () => {
      // Expensive computation
      const processedItems = processItems(items, filters);
      const summary = generateSummary(processedItems);

      return { processedItems, summary };
    },
    {
      deps: [items, filters],
      compare: (prev, next) => {
        // Custom comparison logic
        return shallowEqual(prev[0], next[0]) && shallowEqual(prev[1], next[1]);
      },
    }
  );

  return (
    <div>
      <Summary data={expensiveData.summary} />
      <ItemList items={expensiveData.processedItems} />
    </div>
  );
}
```

## Best Practices

### Type Organization

- Group related types together
- Use namespace for complex type hierarchies
- Export types alongside components
- Document complex type relationships

### Performance

- Use conditional types sparingly
- Prefer utility types over complex mapped types
- Consider compilation performance
- Use type assertions carefully

### Maintainability

- Keep types close to usage
- Use meaningful type names
- Provide type examples in comments
- Test complex type logic

### Error Handling

- Use discriminated unions for error states
- Type error boundaries properly
- Provide helpful error messages
- Handle edge cases in types

This comprehensive guide covers advanced TypeScript patterns that enable sophisticated React applications with excellent type safety and developer experience.
