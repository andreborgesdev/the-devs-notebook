# React Render Props Pattern

Render props is a technique for sharing code between React components using a prop whose value is a function. This pattern provides a way to share stateful logic while keeping components flexible and reusable.

## Understanding Render Props

The render props pattern involves passing a function as a prop to a component, where that function returns a React element and is called in the component's render method.

### Basic Render Props Implementation

```typescript
interface MousePosition {
  x: number;
  y: number;
}

interface MouseTrackerProps {
  render: (mouse: MousePosition) => React.ReactNode;
}

class MouseTracker extends React.Component<MouseTrackerProps> {
  state: MousePosition = { x: 0, y: 0 };

  handleMouseMove = (event: React.MouseEvent) => {
    this.setState({
      x: event.clientX,
      y: event.clientY,
    });
  };

  render() {
    return (
      <div style={{ height: "100vh" }} onMouseMove={this.handleMouseMove}>
        {this.props.render(this.state)}
      </div>
    );
  }
}

const App = () => (
  <MouseTracker
    render={({ x, y }) => (
      <h1>
        Mouse position: ({x}, {y})
      </h1>
    )}
  />
);
```

### Functional Component with Render Props

```typescript
interface DataFetcherProps<T> {
  url: string;
  render: (data: {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
  }) => React.ReactNode;
}

function DataFetcher<T>({ url, render }: DataFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      {render({
        data,
        loading,
        error,
        refetch: fetchData,
      })}
    </>
  );
}

interface User {
  id: number;
  name: string;
  email: string;
}

const UserList = () => (
  <DataFetcher<User[]>
    url="/api/users"
    render={({ data, loading, error, refetch }) => {
      if (loading) return <div>Loading...</div>;
      if (error) return <div>Error: {error}</div>;
      if (!data) return <div>No data</div>;

      return (
        <div>
          <button onClick={refetch}>Refresh</button>
          <ul>
            {data.map((user) => (
              <li key={user.id}>
                {user.name} - {user.email}
              </li>
            ))}
          </ul>
        </div>
      );
    }}
  />
);
```

## Advanced Render Props Patterns

### Multiple Render Props

```typescript
interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

interface FormProviderProps {
  initialValues: Record<string, any>;
  onSubmit: (values: Record<string, any>) => void;
  validate?: (values: Record<string, any>) => Record<string, string>;
  children: (formProps: {
    values: Record<string, any>;
    errors: Record<string, string>;
    touched: Record<string, boolean>;
    handleChange: (name: string, value: any) => void;
    handleBlur: (name: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
    isValid: boolean;
  }) => React.ReactNode;
  renderHeader?: (formState: FormState) => React.ReactNode;
  renderFooter?: (formState: FormState) => React.ReactNode;
}

const FormProvider: React.FC<FormProviderProps> = ({
  initialValues,
  onSubmit,
  validate,
  children,
  renderHeader,
  renderFooter,
}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));

    if (touched[name] && validate) {
      const newErrors = validate({ ...values, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: newErrors[name] || "" }));
    }
  };

  const handleBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));

    if (validate) {
      const newErrors = validate(values);
      setErrors((prev) => ({ ...prev, [name]: newErrors[name] || "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate) {
      const newErrors = validate(values);
      setErrors(newErrors);

      const touchedAll = Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      );
      setTouched(touchedAll);

      if (Object.keys(newErrors).length === 0) {
        onSubmit(values);
      }
    } else {
      onSubmit(values);
    }
  };

  const isValid = Object.keys(errors).every((key) => !errors[key]);
  const formState = { values, errors, touched };

  return (
    <form onSubmit={handleSubmit}>
      {renderHeader?.(formState)}

      {children({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isValid,
      })}

      {renderFooter?.(formState)}
    </form>
  );
};

const RegistrationForm = () => (
  <FormProvider
    initialValues={{ name: "", email: "", password: "" }}
    validate={(values) => {
      const errors: Record<string, string> = {};

      if (!values.name) errors.name = "Name is required";
      if (!values.email) errors.email = "Email is required";
      if (values.email && !/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = "Email is invalid";
      }
      if (!values.password) errors.password = "Password is required";
      if (values.password && values.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
      }

      return errors;
    }}
    onSubmit={(values) => {
      console.log("Form submitted:", values);
    }}
    renderHeader={(formState) => (
      <div>
        <h2>Registration Form</h2>
        <div>
          Progress: {Object.keys(formState.touched).length}/3 fields completed
        </div>
      </div>
    )}
    renderFooter={(formState) => (
      <div>
        <small>
          {Object.keys(formState.errors).length > 0
            ? "Please fix the errors above"
            : "All fields are valid"}
        </small>
      </div>
    )}
  >
    {({ values, errors, touched, handleChange, handleBlur, isValid }) => (
      <div>
        <div>
          <input
            type="text"
            placeholder="Name"
            value={values.name}
            onChange={(e) => handleChange("name", e.target.value)}
            onBlur={() => handleBlur("name")}
          />
          {touched.name && errors.name && (
            <span style={{ color: "red" }}>{errors.name}</span>
          )}
        </div>

        <div>
          <input
            type="email"
            placeholder="Email"
            value={values.email}
            onChange={(e) => handleChange("email", e.target.value)}
            onBlur={() => handleBlur("email")}
          />
          {touched.email && errors.email && (
            <span style={{ color: "red" }}>{errors.email}</span>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={values.password}
            onChange={(e) => handleChange("password", e.target.value)}
            onBlur={() => handleBlur("password")}
          />
          {touched.password && errors.password && (
            <span style={{ color: "red" }}>{errors.password}</span>
          )}
        </div>

        <button type="submit" disabled={!isValid}>
          Register
        </button>
      </div>
    )}
  </FormProvider>
);
```

### Render Props with Generic Types

```typescript
interface Resource<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface ResourceProviderProps<T> {
  resource: () => Promise<T>;
  dependencies?: any[];
  render: (resource: Resource<T> & { retry: () => void }) => React.ReactNode;
}

function ResourceProvider<T>({
  resource,
  dependencies = [],
  render,
}: ResourceProviderProps<T>) {
  const [state, setState] = useState<Resource<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const loadResource = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await resource();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }, [resource]);

  useEffect(() => {
    loadResource();
  }, [loadResource, ...dependencies]);

  return (
    <>
      {render({
        ...state,
        retry: loadResource,
      })}
    </>
  );
}

interface ApiResponse {
  users: User[];
  totalCount: number;
}

const UsersDashboard = () => {
  const [page, setPage] = useState(1);

  return (
    <ResourceProvider<ApiResponse>
      resource={() =>
        fetch(`/api/users?page=${page}`).then((res) => res.json())
      }
      dependencies={[page]}
      render={({ data, loading, error, retry }) => (
        <div>
          <h1>Users Dashboard</h1>

          {loading && <div>Loading users...</div>}

          {error && (
            <div>
              <p>Error: {error}</p>
              <button onClick={retry}>Retry</button>
            </div>
          )}

          {data && (
            <div>
              <p>Total Users: {data.totalCount}</p>
              <ul>
                {data.users.map((user) => (
                  <li key={user.id}>{user.name}</li>
                ))}
              </ul>

              <div>
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 1}
                >
                  Previous
                </button>
                <span>Page {page}</span>
                <button onClick={() => setPage((p) => p + 1)}>Next</button>
              </div>
            </div>
          )}
        </div>
      )}
    />
  );
};
```

## Render Props vs Hooks

### Converting Render Props to Custom Hooks

```typescript
// Render Props approach
interface WindowSizeProps {
  render: (size: { width: number; height: number }) => React.ReactNode;
}

const WindowSizeProvider: React.FC<WindowSizeProps> = ({ render }) => {
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

  return <>{render(windowSize)}</>;
};

// Custom Hook approach
const useWindowSize = () => {
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
};

// Usage comparison
const ComponentWithRenderProp = () => (
  <WindowSizeProvider
    render={({ width, height }) => (
      <div>
        Window size: {width}x{height}
      </div>
    )}
  />
);

const ComponentWithHook = () => {
  const { width, height } = useWindowSize();

  return (
    <div>
      Window size: {width}x{height}
    </div>
  );
};
```

### Hybrid Approach: Render Props + Hooks

```typescript
interface ScrollPosition {
  x: number;
  y: number;
}

const useScrollPosition = (): ScrollPosition => {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition({
        x: window.pageXOffset,
        y: window.pageYOffset,
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollPosition;
};

interface ScrollProviderProps {
  children: (scrollPosition: ScrollPosition) => React.ReactNode;
}

const ScrollProvider: React.FC<ScrollProviderProps> = ({ children }) => {
  const scrollPosition = useScrollPosition();
  return <>{children(scrollPosition)}</>;
};

// Can be used both ways
const ScrollExample = () => {
  // Using hook directly
  const scrollPosition = useScrollPosition();

  return (
    <div>
      <div>Direct hook usage: {scrollPosition.y}</div>

      {/* Using render prop */}
      <ScrollProvider>
        {({ y }) => <div>Render prop usage: {y}</div>}
      </ScrollProvider>
    </div>
  );
};
```

## Complex Render Props Patterns

### Compound Components with Render Props

```typescript
interface TabsContextValue {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

interface TabsProps {
  defaultTab?: string;
  children: React.ReactNode;
}

const Tabs: React.FC<TabsProps> = ({ defaultTab = "", children }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
};

interface TabListProps {
  render: (tabProps: {
    activeTab: string;
    setActiveTab: (tab: string) => void;
  }) => React.ReactNode;
}

const TabList: React.FC<TabListProps> = ({ render }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabList must be used within Tabs");

  return (
    <div className="tab-list">
      {render({
        activeTab: context.activeTab,
        setActiveTab: context.setActiveTab,
      })}
    </div>
  );
};

interface TabPanelsProps {
  render: (activeTab: string) => React.ReactNode;
}

const TabPanels: React.FC<TabPanelsProps> = ({ render }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabPanels must be used within Tabs");

  return <div className="tab-panels">{render(context.activeTab)}</div>;
};

const TabsExample = () => (
  <Tabs defaultTab="tab1">
    <TabList
      render={({ activeTab, setActiveTab }) => (
        <div>
          {["tab1", "tab2", "tab3"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                backgroundColor: activeTab === tab ? "#007bff" : "#f8f9fa",
              }}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    />

    <TabPanels
      render={(activeTab) => (
        <div>
          {activeTab === "tab1" && <div>Content for Tab 1</div>}
          {activeTab === "tab2" && <div>Content for Tab 2</div>}
          {activeTab === "tab3" && <div>Content for Tab 3</div>}
        </div>
      )}
    />
  </Tabs>
);
```

### State Machine with Render Props

```typescript
type State = "idle" | "loading" | "success" | "error";

interface StateMachineState<T> {
  state: State;
  data: T | null;
  error: string | null;
}

interface StateMachineActions {
  start: () => void;
  success: (data: any) => void;
  error: (error: string) => void;
  reset: () => void;
}

interface AsyncStateMachineProps<T> {
  children: (
    state: StateMachineState<T>,
    actions: StateMachineActions
  ) => React.ReactNode;
}

function AsyncStateMachine<T>({ children }: AsyncStateMachineProps<T>) {
  const [state, setState] = useState<StateMachineState<T>>({
    state: "idle",
    data: null,
    error: null,
  });

  const actions: StateMachineActions = {
    start: () =>
      setState((prev) => ({
        ...prev,
        state: "loading",
        error: null,
      })),

    success: (data: T) =>
      setState({
        state: "success",
        data,
        error: null,
      }),

    error: (error: string) =>
      setState({
        state: "error",
        data: null,
        error,
      }),

    reset: () =>
      setState({
        state: "idle",
        data: null,
        error: null,
      }),
  };

  return <>{children(state, actions)}</>;
}

const AsyncOperationExample = () => (
  <AsyncStateMachine<string>
    children={(state, actions) => (
      <div>
        <h3>Current State: {state.state}</h3>

        {state.state === "idle" && (
          <button
            onClick={() => {
              actions.start();
              // Simulate async operation
              setTimeout(() => {
                if (Math.random() > 0.5) {
                  actions.success("Operation completed successfully!");
                } else {
                  actions.error("Operation failed!");
                }
              }, 2000);
            }}
          >
            Start Operation
          </button>
        )}

        {state.state === "loading" && <div>Loading... Please wait</div>}

        {state.state === "success" && (
          <div>
            <div style={{ color: "green" }}>Success: {state.data}</div>
            <button onClick={actions.reset}>Reset</button>
          </div>
        )}

        {state.state === "error" && (
          <div>
            <div style={{ color: "red" }}>Error: {state.error}</div>
            <button onClick={actions.reset}>Reset</button>
          </div>
        )}
      </div>
    )}
  />
);
```

## Performance Optimization

### Memoizing Render Props

```typescript
interface ExpensiveComponentProps {
  render: (data: { count: number; increment: () => void }) => React.ReactNode;
}

const ExpensiveComponent: React.FC<ExpensiveComponentProps> = ({ render }) => {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  const renderProps = useMemo(
    () => ({
      count,
      increment,
    }),
    [count, increment]
  );

  console.log("ExpensiveComponent rendered");

  return <>{render(renderProps)}</>;
};

const OptimizedParent = () => {
  const [otherState, setOtherState] = useState(0);

  const memoizedRender = useCallback(
    ({ count, increment }: { count: number; increment: () => void }) => (
      <div>
        <div>Count: {count}</div>
        <button onClick={increment}>Increment</button>
      </div>
    ),
    []
  );

  return (
    <div>
      <div>Other state: {otherState}</div>
      <button onClick={() => setOtherState((prev) => prev + 1)}>
        Update Other State
      </button>

      <ExpensiveComponent render={memoizedRender} />
    </div>
  );
};
```

## Testing Render Props

### Testing Strategy

```typescript
import { render, screen, fireEvent } from "@testing-library/react";

const TestableRenderProp: React.FC<{
  render: (data: { value: number; increment: () => void }) => React.ReactNode;
}> = ({ render }) => {
  const [value, setValue] = useState(0);
  const increment = () => setValue((prev) => prev + 1);

  return <>{render({ value, increment })}</>;
};

describe("TestableRenderProp", () => {
  it("should provide value and increment function", () => {
    const renderSpy = jest.fn().mockReturnValue(<div>test</div>);

    render(<TestableRenderProp render={renderSpy} />);

    expect(renderSpy).toHaveBeenCalledWith({
      value: 0,
      increment: expect.any(Function),
    });
  });

  it("should update value when increment is called", () => {
    render(
      <TestableRenderProp
        render={({ value, increment }) => (
          <div>
            <span data-testid="value">{value}</span>
            <button data-testid="increment" onClick={increment}>
              Increment
            </button>
          </div>
        )}
      />
    );

    expect(screen.getByTestId("value")).toHaveTextContent("0");

    fireEvent.click(screen.getByTestId("increment"));

    expect(screen.getByTestId("value")).toHaveTextContent("1");
  });
});
```

## Best Practices

### When to Use Render Props

```typescript
// ✅ Good: Sharing stateful logic
const DataProvider = ({ url, render }) => {
  // Complex data fetching logic
  return render({ data, loading, error });
};

// ✅ Good: Flexible component composition
const Layout = ({ renderHeader, renderContent, renderFooter }) => (
  <div>
    <header>{renderHeader()}</header>
    <main>{renderContent()}</main>
    <footer>{renderFooter()}</footer>
  </div>
);

// ❌ Avoid: Simple prop passing
const BadExample = ({ render }) => {
  const staticData = { message: "Hello" };
  return render(staticData); // Better as regular prop
};

// ✅ Good: Instead use regular props
const GoodExample = ({ message, children }) => <div>{children || message}</div>;
```

### Performance Considerations

```typescript
// ❌ Poor performance: Inline render function
const BadPerformance = () => (
  <MouseTracker
    render={(
      { x, y } // New function on every render
    ) => (
      <div>
        Mouse: {x}, {y}
      </div>
    )}
  />
);

// ✅ Better performance: Memoized render function
const GoodPerformance = () => {
  const renderMouse = useCallback(
    ({ x, y }) => (
      <div>
        Mouse: {x}, {y}
      </div>
    ),
    []
  );

  return <MouseTracker render={renderMouse} />;
};
```

## Common Interview Questions

### Basic Questions

**Q: What are render props in React?**

Render props is a technique for sharing code between React components using a prop whose value is a function. The component calls this function in its render method, passing data as arguments, and renders the returned React elements.

**Q: How do render props work?**

```typescript
const DataProvider = ({ render }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData().then(setData);
  }, []);

  return render({ data, loading: !data });
};

// Usage
<DataProvider
  render={({ data, loading }) =>
    loading ? <div>Loading...</div> : <div>{data}</div>
  }
/>;
```

**Q: What are the advantages of render props?**

- Code reusability and sharing of stateful logic
- Flexible component composition
- Inversion of control - consuming component controls rendering
- TypeScript-friendly with proper generics

### Intermediate Questions

**Q: How do render props compare to higher-order components?**

Render props:

- More explicit and easier to understand
- Better TypeScript support
- No prop name collisions
- More flexible composition

HOCs:

- Can be composed more easily
- Less visual nesting
- Can modify props before passing down

**Q: What are the performance implications of render props?**

- Inline render functions create new instances on every render
- Can cause unnecessary re-renders of child components
- Should be memoized using useCallback when possible
- Consider using React.memo for render prop components

**Q: How do you test components that use render props?**

Focus on testing the behavior rather than implementation:

```typescript
test("render prop provides expected data", () => {
  const renderSpy = jest.fn().mockReturnValue(<div>test</div>);

  render(<DataProvider render={renderSpy} />);

  expect(renderSpy).toHaveBeenCalledWith({
    data: expect.any(Object),
    loading: expect.any(Boolean),
  });
});
```

### Advanced Questions

**Q: When should you choose render props over custom hooks?**

Use render props when:

- You need to share JSX structure along with logic
- Working with class components
- Need multiple render functions
- Creating reusable UI patterns

Use custom hooks when:

- Sharing stateful logic only
- Working primarily with functional components
- Want cleaner component composition
- Logic is purely data-oriented

**Q: How do you implement generic render props with TypeScript?**

```typescript
interface RenderPropComponent<T> {
  data: T;
  render: (data: T) => React.ReactNode;
}

function GenericRenderProp<T>({ data, render }: RenderPropComponent<T>) {
  return <>{render(data)}</>;
}

// Usage with type inference
<GenericRenderProp
  data={{ name: "John", age: 30 }}
  render={(user) => <div>{user.name}</div>} // user is properly typed
/>;
```

**Q: How do you handle multiple render props in a single component?**

```typescript
interface MultiRenderProps {
  renderHeader: () => React.ReactNode;
  renderContent: (data: any) => React.ReactNode;
  renderFooter: (actions: any) => React.ReactNode;
}

const MultiRenderComponent: React.FC<MultiRenderProps> = ({
  renderHeader,
  renderContent,
  renderFooter,
}) => {
  const [data, setData] = useState(null);
  const actions = { refresh: () => {}, save: () => {} };

  return (
    <div>
      <header>{renderHeader()}</header>
      <main>{renderContent(data)}</main>
      <footer>{renderFooter(actions)}</footer>
    </div>
  );
};
```

The render props pattern provides a powerful way to share component logic while maintaining flexibility in how that logic is rendered, making it an essential pattern for creating reusable and composable React components.
