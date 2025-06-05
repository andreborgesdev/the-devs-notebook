# React 18 Concurrent Features

## Overview

React 18 introduced concurrent features that enable React to interrupt, pause, resume, or abandon rendering work. This allows React to keep the UI responsive during expensive operations.

## Key Concepts

### Concurrent Rendering

```tsx
import { createRoot } from "react-dom/client";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(<App />);
```

### Time Slicing

```tsx
function ExpensiveComponent() {
  const [count, setCount] = useState(0);

  const expensiveValue = useMemo(() => {
    let result = 0;
    for (let i = 0; i < count * 100000; i++) {
      result += Math.random();
    }
    return result;
  }, [count]);

  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>Count: {count}</button>
      <p>Expensive calculation: {expensiveValue}</p>
    </div>
  );
}
```

## Concurrent Features Comparison

| Feature   | React 17    | React 18          |
| --------- | ----------- | ----------------- |
| Rendering | Blocking    | Interruptible     |
| Updates   | Synchronous | Can be concurrent |
| Priority  | All equal   | Prioritized       |
| Batching  | Limited     | Automatic         |

## useTransition Hook

### Basic Usage

```tsx
import { useTransition, useState } from "react";

function SearchResults() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (value: string) => {
    setQuery(value);

    startTransition(() => {
      const filteredResults = performExpensiveSearch(value);
      setResults(filteredResults);
    });
  };

  return (
    <div>
      <input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
      />
      {isPending && <div>Searching...</div>}
      <ResultsList results={results} />
    </div>
  );
}
```

### Complex Transition Example

```tsx
interface TabsProps {
  tabs: Array<{ id: string; label: string; content: React.ComponentType }>;
}

function Tabs({ tabs }: TabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id);
  const [isPending, startTransition] = useTransition();

  const handleTabChange = (tabId: string) => {
    startTransition(() => {
      setActiveTab(tabId);
    });
  };

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div>
      <div className="tab-list">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`tab ${activeTab === tab.id ? "active" : ""}`}
            disabled={isPending}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {isPending && <div className="loading">Loading...</div>}
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
}
```

## useDeferredValue Hook

### Basic Implementation

```tsx
import { useDeferredValue, useState, useMemo } from "react";

function ProductSearch() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const results = useMemo(() => {
    if (!deferredQuery) return [];
    return searchProducts(deferredQuery);
  }, [deferredQuery]);

  const isStale = query !== deferredQuery;

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
      />
      <div className={isStale ? "stale" : ""}>
        {results.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
```

### Advanced Deferred Pattern

```tsx
interface LiveSearchProps {
  onSearch: (query: string) => Promise<SearchResult[]>;
}

function LiveSearch({ onSearch }: LiveSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    if (!deferredQuery) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    onSearch(deferredQuery)
      .then(setResults)
      .finally(() => setIsLoading(false));
  }, [deferredQuery, onSearch]);

  const isStale = query !== deferredQuery;

  return (
    <div className="live-search">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type to search..."
      />
      {isLoading && <Spinner />}
      <div className={`results ${isStale ? "stale" : ""}`}>
        {results.map((result) => (
          <SearchResultItem key={result.id} result={result} />
        ))}
      </div>
    </div>
  );
}
```

## startTransition API

### Direct Usage

```tsx
import { startTransition } from "react";

function FilterableList({ items }: { items: Item[] }) {
  const [filter, setFilter] = useState("");
  const [filteredItems, setFilteredItems] = useState(items);

  const handleFilterChange = (value: string) => {
    setFilter(value);

    startTransition(() => {
      const filtered = items.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredItems(filtered);
    });
  };

  return (
    <div>
      <input
        value={filter}
        onChange={(e) => handleFilterChange(e.target.value)}
        placeholder="Filter items..."
      />
      <List items={filteredItems} />
    </div>
  );
}
```

## Priority Levels

### Update Priority Examples

```tsx
function MultiPriorityApp() {
  const [urgentValue, setUrgentValue] = useState("");
  const [backgroundValue, setBackgroundValue] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleUrgentUpdate = (value: string) => {
    setUrgentValue(value);
  };

  const handleBackgroundUpdate = (value: string) => {
    startTransition(() => {
      setBackgroundValue(value);
    });
  };

  return (
    <div>
      <input
        placeholder="Urgent updates"
        onChange={(e) => handleUrgentUpdate(e.target.value)}
      />
      <input
        placeholder="Background updates"
        onChange={(e) => handleBackgroundUpdate(e.target.value)}
      />

      <div>Urgent: {urgentValue}</div>
      <div>
        Background: {backgroundValue} {isPending && "(updating...)"}
      </div>
    </div>
  );
}
```

## Performance Patterns

### Concurrent Safe Components

```tsx
interface DataVisualizationProps {
  data: DataPoint[];
  config: ChartConfig;
}

function DataVisualization({ data, config }: DataVisualizationProps) {
  const [processedData, setProcessedData] = useState<ProcessedData[]>([]);
  const [isPending, startTransition] = useTransition();

  const processData = useCallback(
    (rawData: DataPoint[], chartConfig: ChartConfig) => {
      return rawData.map((point) => ({
        ...point,
        processed: expensiveCalculation(point, chartConfig),
      }));
    },
    []
  );

  useEffect(() => {
    startTransition(() => {
      const processed = processData(data, config);
      setProcessedData(processed);
    });
  }, [data, config, processData]);

  return (
    <div className="chart-container">
      {isPending && <div className="processing-indicator">Processing...</div>}
      <Chart data={processedData} config={config} />
    </div>
  );
}
```

### Optimistic Updates

```tsx
function OptimisticTodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isPending, startTransition] = useTransition();

  const addTodo = async (text: string) => {
    const optimisticTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
      pending: true,
    };

    setTodos((prev) => [...prev, optimisticTodo]);

    try {
      const savedTodo = await apiSaveTodo(text);
      startTransition(() => {
        setTodos((prev) =>
          prev.map((todo) =>
            todo.id === optimisticTodo.id
              ? { ...savedTodo, pending: false }
              : todo
          )
        );
      });
    } catch (error) {
      setTodos((prev) => prev.filter((todo) => todo.id !== optimisticTodo.id));
    }
  };

  return (
    <div>
      <TodoForm onSubmit={addTodo} />
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          className={todo.pending ? "pending" : ""}
        />
      ))}
    </div>
  );
}
```

## Migration Strategies

### From Class Components

```tsx
class LegacyExpensiveComponent extends Component {
  state = { data: [], loading: false };

  updateData = (newData) => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ data: newData, loading: false });
    }, 1000);
  };

  render() {
    return (
      <div>
        {this.state.loading && <Spinner />}
        <DataList data={this.state.data} />
      </div>
    );
  }
}

function ModernConcurrentComponent() {
  const [data, setData] = useState([]);
  const [isPending, startTransition] = useTransition();

  const updateData = (newData) => {
    startTransition(() => {
      setData(newData);
    });
  };

  return (
    <div>
      {isPending && <Spinner />}
      <DataList data={data} />
    </div>
  );
}
```

## Testing Concurrent Features

### Testing Transitions

```tsx
import { act, renderHook } from "@testing-library/react";
import { useTransition } from "react";

describe("useTransition", () => {
  it("should handle pending states", async () => {
    const { result } = renderHook(() => useTransition());

    expect(result.current[0]).toBe(false);

    act(() => {
      result.current[1](() => {
        // Simulate expensive operation
      });
    });

    expect(result.current[0]).toBe(true);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current[0]).toBe(false);
  });
});
```

### Integration Testing

```tsx
import { render, screen, fireEvent } from "@testing-library/react";

function ConcurrentSearchComponent() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (value) => {
    setQuery(value);
    startTransition(() => {
      setResults(mockSearch(value));
    });
  };

  return (
    <div>
      <input
        data-testid="search-input"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
      />
      {isPending && <div data-testid="loading">Loading...</div>}
      <div data-testid="results">
        {results.map((r) => (
          <div key={r.id}>{r.name}</div>
        ))}
      </div>
    </div>
  );
}

test("shows loading state during transition", async () => {
  render(<ConcurrentSearchComponent />);

  const input = screen.getByTestId("search-input");
  fireEvent.change(input, { target: { value: "test" } });

  expect(screen.getByTestId("loading")).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
  });
});
```

## Best Practices

### When to Use Transitions

- **Use for**: Non-urgent updates, filtering, sorting, navigation
- **Don't use for**: Form inputs, animations, immediate feedback

### Performance Guidelines

```tsx
function PerformantConcurrentComponent() {
  const [immediateState, setImmediateState] = useState("");
  const [expensiveState, setExpensiveState] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleImmediateChange = (value: string) => {
    setImmediateState(value);

    startTransition(() => {
      setExpensiveState(processExpensiveOperation(value));
    });
  };

  return (
    <div>
      <input
        value={immediateState}
        onChange={(e) => handleImmediateChange(e.target.value)}
      />
      <div className={isPending ? "updating" : ""}>{expensiveState}</div>
    </div>
  );
}
```

## Common Patterns

### Debounced Transitions

```tsx
function useDebouncedTransition(delay: number = 300) {
  const [isPending, startTransition] = useTransition();
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedStartTransition = useCallback(
    (callback: () => void) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        startTransition(callback);
      }, delay);
    },
    [delay, startTransition]
  );

  return [isPending, debouncedStartTransition] as const;
}
```

### Progressive Enhancement

```tsx
function ProgressiveSearchResults() {
  const [query, setQuery] = useState("");
  const [quickResults, setQuickResults] = useState([]);
  const [detailedResults, setDetailedResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (value: string) => {
    setQuery(value);

    const quick = getQuickResults(value);
    setQuickResults(quick);

    startTransition(() => {
      const detailed = getDetailedResults(value);
      setDetailedResults(detailed);
    });
  };

  return (
    <div>
      <input value={query} onChange={(e) => handleSearch(e.target.value)} />

      <div className="quick-results">
        {quickResults.map((result) => (
          <QuickResultItem key={result.id} result={result} />
        ))}
      </div>

      {isPending && <div>Loading detailed results...</div>}
      <div className="detailed-results">
        {detailedResults.map((result) => (
          <DetailedResultItem key={result.id} result={result} />
        ))}
      </div>
    </div>
  );
}
```

## Interview Questions

### Technical Questions

**Q: What are React 18's concurrent features?**
A: Concurrent features allow React to interrupt rendering work to keep the UI responsive. Key features include useTransition, useDeferredValue, startTransition, and automatic batching.

**Q: When should you use useTransition vs useDeferredValue?**
A: Use useTransition when you control the update trigger, useDeferredValue when you want to defer a prop or state value that comes from elsewhere.

**Q: How do transitions affect performance?**
A: Transitions allow urgent updates to interrupt less important work, preventing UI blocking during expensive operations while maintaining responsiveness.

**Q: What's the difference between blocking and concurrent rendering?**
A: Blocking rendering processes the entire component tree synchronously, while concurrent rendering can pause and resume work, allowing high-priority updates to take precedence.

**Q: How do you test concurrent features?**
A: Use React Testing Library with act() for transitions, test loading states, and verify that urgent updates aren't blocked by expensive operations.

## Common Mistakes

### Overusing Transitions

```tsx
function BadExample() {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(() => {
      setCount((c) => c + 1);
    });
  };

  return <button onClick={handleClick}>Count: {count}</button>;
}

function GoodExample() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount((c) => c + 1);
  };

  return <button onClick={handleClick}>Count: {count}</button>;
}
```

### Memory Leaks in Transitions

```tsx
function ProblematicComponent() {
  const [data, setData] = useState([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      fetchData().then(setData);
    });
  }, []);

  return <DataList data={data} />;
}

function SafeComponent() {
  const [data, setData] = useState([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;

    startTransition(() => {
      fetchData().then((result) => {
        if (!cancelled) {
          setData(result);
        }
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return <DataList data={data} />;
}
```

## TypeScript Integration

### Type-Safe Transitions

```tsx
interface SearchState<T> {
  query: string;
  results: T[];
  isPending: boolean;
}

function useSearchTransition<T>(
  searchFn: (query: string) => T[]
): [SearchState<T>, (query: string) => void] {
  const [state, setState] = useState<SearchState<T>>({
    query: "",
    results: [],
    isPending: false,
  });
  const [isPending, startTransition] = useTransition();

  const search = useCallback(
    (query: string) => {
      setState((prev) => ({ ...prev, query, isPending: true }));

      startTransition(() => {
        const results = searchFn(query);
        setState((prev) => ({ ...prev, results, isPending: false }));
      });
    },
    [searchFn]
  );

  return [{ ...state, isPending }, search];
}
```

### Generic Deferred Values

```tsx
function useDeferredState<T>(
  initialValue: T
): [T, T, (value: T) => void, boolean] {
  const [value, setValue] = useState<T>(initialValue);
  const deferredValue = useDeferredValue(value);
  const isDeferred = value !== deferredValue;

  return [value, deferredValue, setValue, isDeferred];
}
```

## Resources

- [React 18 Concurrent Features Documentation](https://react.dev/reference/react/useTransition)
- [Concurrent Rendering Explanation](https://react.dev/learn/render-and-commit)
- [Migration Guide](https://react.dev/blog/2022/03/08/react-18-upgrade-guide)
