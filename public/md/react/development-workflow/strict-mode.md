# React Strict Mode

## Overview

React Strict Mode is a development tool that helps identify and fix common issues in React applications. It activates additional checks and warnings for its descendants, helping prepare your code for future React features and concurrent mode.

## Enabling Strict Mode

### Application Level

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const root = createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

### Component Level

```tsx
function App() {
  return (
    <div>
      <Header />
      <StrictMode>
        <ExperimentalFeature />
        <NewComponent />
      </StrictMode>
      <Footer />
    </div>
  );
}
```

## Strict Mode Behaviors

### Double Rendering

Strict Mode intentionally double-invokes functions to help detect side effects:

```tsx
function Component() {
  console.log("Component rendered"); // Logged twice in development

  useEffect(() => {
    console.log("Effect ran"); // Logged twice in development

    return () => {
      console.log("Cleanup ran"); // Also logged twice
    };
  }, []);

  return <div>Hello World</div>;
}
```

### State Initializer Double Invocation

```tsx
function ExpensiveInitialization() {
  const [data, setData] = useState(() => {
    console.log("Expensive calculation"); // Called twice in Strict Mode
    return computeExpensiveValue();
  });

  const [user, setUser] = useReducer((state, action) => {
    console.log("Reducer called"); // Called twice in Strict Mode
    switch (action.type) {
      case "SET_USER":
        return action.payload;
      default:
        return state;
    }
  }, null);

  return <div>{data}</div>;
}
```

## Identifying Common Issues

### Memory Leaks Detection

```tsx
// ❌ Problematic: Missing cleanup
function ProblematicComponent() {
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Still running...");
    }, 1000);

    // Missing cleanup - Strict Mode will help identify this
  }, []);

  return <div>Check console for memory leak</div>;
}

// ✅ Fixed: Proper cleanup
function FixedComponent() {
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Running with cleanup");
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <div>Properly cleaned up</div>;
}
```

### Event Listener Cleanup

```tsx
// ❌ Problematic: Event listener not removed
function ProblematicEventComponent() {
  useEffect(() => {
    const handleResize = () => {
      console.log("Window resized");
    };

    window.addEventListener("resize", handleResize);
    // Missing cleanup
  }, []);

  return <div>Resize the window</div>;
}

// ✅ Fixed: Proper event cleanup
function FixedEventComponent() {
  useEffect(() => {
    const handleResize = () => {
      console.log("Window resized");
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <div>Resize the window</div>;
}
```

### Subscription Management

```tsx
interface DataSubscription {
  unsubscribe(): void;
}

// ✅ Proper subscription cleanup
function SubscriptionComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const subscription = subscribeToRealTimeData((newData) => {
      setData(newData);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return <div>{JSON.stringify(data)}</div>;
}
```

## Best Practices

### Safe State Initialization

```tsx
// ✅ Pure function - safe for double invocation
function SafeInitialization() {
  const [count, setCount] = useState(() => {
    return Math.floor(Math.random() * 10); // Pure calculation
  });

  const [user, setUser] = useState(() => {
    // Safe: reading from localStorage is idempotent
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  return <div>Count: {count}</div>;
}

// ❌ Avoid side effects in initializers
function UnsafeInitialization() {
  const [id, setId] = useState(() => {
    // Unsafe: has side effects
    const newId = generateUniqueId();
    logAnalytics("component-initialized", newId); // Side effect!
    return newId;
  });

  return <div>ID: {id}</div>;
}
```

### Effect Idempotency

```tsx
function IdempotentEffects() {
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;

    // Make request idempotent with cancellation
    fetchUserData().then((result) => {
      if (!cancelled) {
        setData(result);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return <div>{data ? data.name : "Loading..."}</div>;
}
```

### Custom Hook Cleanup

```tsx
function useWebSocket(url: string) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onmessage = (event) => {
      setData(JSON.parse(event.data));
    };

    ws.onerror = (error) => {
      setError(error);
    };

    // Strict Mode will test this cleanup
    return () => {
      ws.close();
    };
  }, [url]);

  return { data, error };
}

function WebSocketComponent() {
  const { data, error } = useWebSocket("ws://localhost:8080");

  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>Connecting...</div>;

  return <div>Data: {JSON.stringify(data)}</div>;
}
```

## Migration Strategies

### Gradual Strict Mode Adoption

```tsx
// Step 1: Enable for new components only
function NewFeature() {
  return (
    <StrictMode>
      <NewComponent />
      <AnotherNewComponent />
    </StrictMode>
  );
}

// Step 2: Gradually expand coverage
function App() {
  return (
    <div>
      <LegacyHeader />
      <StrictMode>
        <NewFeature />
        <RecentlyUpdatedComponent />
      </StrictMode>
      <LegacyFooter />
    </div>
  );
}

// Step 3: Full application coverage
function App() {
  return (
    <StrictMode>
      <Header />
      <Main />
      <Footer />
    </StrictMode>
  );
}
```

### Legacy Code Preparation

```tsx
function StrictModeWrapper({
  children,
  enableStrictMode = false,
}: {
  children: React.ReactNode;
  enableStrictMode?: boolean;
}) {
  if (enableStrictMode) {
    return <StrictMode>{children}</StrictMode>;
  }

  return <>{children}</>;
}

function LegacyComponentWithMigration() {
  const [strictModeEnabled, setStrictModeEnabled] = useState(false);

  return (
    <div>
      <button onClick={() => setStrictModeEnabled(!strictModeEnabled)}>
        {strictModeEnabled ? "Disable" : "Enable"} Strict Mode Testing
      </button>

      <StrictModeWrapper enableStrictMode={strictModeEnabled}>
        <LegacyComponent />
      </StrictModeWrapper>
    </div>
  );
}
```

## Advanced Debugging

### Effect Dependency Analysis

```tsx
function DebuggableComponent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("Effect dependencies changed:", { count, name });
    }

    const timer = setInterval(() => {
      console.log(`Timer with count: ${count}, name: ${name}`);
    }, 1000);

    return () => {
      if (process.env.NODE_ENV === "development") {
        console.log("Cleaning up effect with:", { count, name });
      }
      clearInterval(timer);
    };
  }, [count, name]);

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={() => setCount((c) => c + 1)}>Count: {count}</button>
    </div>
  );
}
```

### Cleanup Verification

```tsx
function useCleanupVerification(name: string) {
  useEffect(() => {
    console.log(`${name}: Effect started`);
    const startTime = Date.now();

    return () => {
      const duration = Date.now() - startTime;
      console.log(`${name}: Effect cleaned up after ${duration}ms`);
    };
  }, [name]);
}

function ComponentWithVerification() {
  useCleanupVerification("ComponentWithVerification");
  const [mounted, setMounted] = useState(true);

  return (
    <div>
      <button onClick={() => setMounted(!mounted)}>
        {mounted ? "Unmount" : "Mount"} Child
      </button>
      {mounted && <ChildWithCleanup />}
    </div>
  );
}

function ChildWithCleanup() {
  useCleanupVerification("ChildWithCleanup");
  return <div>Child component with cleanup verification</div>;
}
```

## Performance Considerations

### Avoiding Double Work

```tsx
function OptimizedComponent() {
  const [data, setData] = useState(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    // Prevent double fetching in Strict Mode during development
    if (fetchedRef.current) return;

    fetchedRef.current = true;

    fetchData().then(setData).catch(console.error);
  }, []);

  return <div>{data ? JSON.stringify(data) : "Loading..."}</div>;
}
```

### Debounced Effects

```tsx
function useDebouncedEffect(
  callback: () => void,
  dependencies: React.DependencyList,
  delay: number = 500
) {
  useEffect(() => {
    const timer = setTimeout(callback, delay);
    return () => clearTimeout(timer);
  }, [...dependencies, delay]);
}

function DebouncedSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useDebouncedEffect(
    () => {
      if (query) {
        searchAPI(query).then(setResults);
      } else {
        setResults([]);
      }
    },
    [query],
    300
  );

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <ul>
        {results.map((result) => (
          <li key={result.id}>{result.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Common Patterns

### Resource Management

```tsx
class ResourceManager {
  private resources = new Map<string, any>();

  acquire(id: string, factory: () => any) {
    if (!this.resources.has(id)) {
      this.resources.set(id, factory());
    }
    return this.resources.get(id);
  }

  release(id: string, cleanup?: (resource: any) => void) {
    const resource = this.resources.get(id);
    if (resource && cleanup) {
      cleanup(resource);
    }
    this.resources.delete(id);
  }
}

const resourceManager = new ResourceManager();

function useResource<T>(
  id: string,
  factory: () => T,
  cleanup?: (resource: T) => void
) {
  useEffect(() => {
    const resource = resourceManager.acquire(id, factory);

    return () => {
      if (cleanup) {
        resourceManager.release(id, cleanup);
      }
    };
  }, [id]);

  return resourceManager.resources.get(id);
}
```

### State Synchronization

```tsx
function useSyncedState<T>(
  key: string,
  initialValue: T,
  storage: Storage = localStorage
) {
  const [state, setState] = useState<T>(() => {
    try {
      const item = storage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      storage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save to storage:", error);
    }
  }, [key, state, storage]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setState(JSON.parse(e.newValue));
        } catch {
          // Invalid JSON, ignore
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  return [state, setState] as const;
}
```

## Interview Questions

**Q: What is React Strict Mode and why should you use it?**
A: Strict Mode is a development tool that helps identify potential problems by activating additional checks and warnings. It helps prepare code for concurrent features and identifies unsafe lifecycles, legacy API usage, and side effects.

**Q: Why does Strict Mode double-invoke functions?**
A: To help detect side effects and ensure components are resilient to being mounted, unmounted, and remounted - which can happen with concurrent features like Suspense.

**Q: What should you do if Strict Mode breaks your component?**
A: Fix the underlying issue rather than removing Strict Mode. Common fixes include adding proper cleanup to effects, making state initializers pure, and ensuring components are side-effect-free.

**Q: Does Strict Mode affect production builds?**
A: No, Strict Mode checks only run in development mode and are automatically stripped from production builds.

**Q: How do you gradually adopt Strict Mode in a large application?**
A: Start by wrapping new components, then gradually expand to recently updated components, and finally apply it to the entire application once all issues are resolved.

## Best Practices Summary

1. **Always use Strict Mode** during development
2. **Fix issues** rather than removing Strict Mode
3. **Keep components pure** and side-effect-free
4. **Provide cleanup functions** for all effects
5. **Make state initializers pure** without side effects
6. **Test component mounting/unmounting** behavior
7. **Use cancellation patterns** for async operations
8. **Gradually adopt** in large codebases
