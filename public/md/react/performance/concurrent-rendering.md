# Concurrent Rendering

## Overview

Concurrent rendering is React's ability to interrupt, pause, resume, or abandon rendering work to keep the UI responsive. It enables React to work on multiple tasks simultaneously and prioritize urgent updates.

## Key Concepts

### Interruptible Rendering

```tsx
import { createRoot } from "react-dom/client";

const container = document.getElementById("root")!;
const root = createRoot(container);

// Enables concurrent features
root.render(<App />);
```

### Time Slicing

React breaks rendering work into small chunks and yields control back to the browser:

```tsx
function ExpensiveComponent() {
  const [items, setItems] = useState([]);

  // This expensive operation can be interrupted
  const processedItems = useMemo(() => {
    return items.map((item) => ({
      ...item,
      processed: expensiveProcessing(item.data),
    }));
  }, [items]);

  return (
    <div>
      {processedItems.map((item) => (
        <ItemComponent key={item.id} item={item} />
      ))}
    </div>
  );
}
```

## Concurrent Features

### startTransition for Non-Urgent Updates

```tsx
function SearchInterface() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (searchTerm) => {
    setQuery(searchTerm); // Urgent - immediate UI update

    startTransition(() => {
      // Non-urgent - can be interrupted
      const searchResults = performExpensiveSearch(searchTerm);
      setResults(searchResults);
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

      <div className={isPending ? "stale" : ""}>
        {results.map((result) => (
          <SearchResult key={result.id} result={result} />
        ))}
      </div>
    </div>
  );
}
```

### useDeferredValue for Background Updates

```tsx
function DataVisualization() {
  const [filterOptions, setFilterOptions] = useState({});
  const deferredFilters = useDeferredValue(filterOptions);

  return (
    <div>
      <FilterControls
        value={filterOptions}
        onChange={setFilterOptions} // Immediate UI response
      />

      {/* Uses deferred value - lower priority */}
      <ExpensiveChart filters={deferredFilters} />
    </div>
  );
}
```

## Practical Examples

### Large List Rendering

```tsx
function VirtualizedList({ items }) {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 50 });
  const [isPending, startTransition] = useTransition();

  const handleScroll = (scrollTop) => {
    // Calculate new visible range immediately
    const newStart = Math.floor(scrollTop / itemHeight);
    const newEnd = newStart + visibleItems;

    startTransition(() => {
      // Update visible items with lower priority
      setVisibleRange({ start: newStart, end: newEnd });
    });
  };

  return (
    <div
      className="list-container"
      onScroll={(e) => handleScroll(e.target.scrollTop)}
    >
      {isPending && <div className="loading-indicator">Loading...</div>}

      <div style={{ height: items.length * itemHeight }}>
        {items
          .slice(visibleRange.start, visibleRange.end)
          .map((item, index) => (
            <ListItem
              key={item.id}
              item={item}
              style={{
                position: "absolute",
                top: (visibleRange.start + index) * itemHeight,
              }}
            />
          ))}
      </div>
    </div>
  );
}
```

### Responsive Navigation

```tsx
function TabNavigation() {
  const [activeTab, setActiveTab] = useState("home");
  const [tabContent, setTabContent] = useState(null);
  const [isPending, startTransition] = useTransition();

  const switchTab = (newTab) => {
    setActiveTab(newTab); // Immediate UI feedback

    startTransition(() => {
      // Load heavy content with lower priority
      const content = loadTabContent(newTab);
      setTabContent(content);
    });
  };

  return (
    <div>
      <nav className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => switchTab(tab.id)}
            className={`tab ${activeTab === tab.id ? "active" : ""}`}
            disabled={isPending && activeTab === tab.id}
          >
            {tab.label}
            {isPending && activeTab === tab.id && " (Loading...)"}
          </button>
        ))}
      </nav>

      <div className="tab-content">
        {isPending ? (
          <div className="content-placeholder">
            Loading {activeTab} content...
          </div>
        ) : (
          <TabContent data={tabContent} />
        )}
      </div>
    </div>
  );
}
```

## Update Priority System

React's concurrent scheduler prioritizes updates:

```tsx
function PriorityExample() {
  const [urgentState, setUrgentState] = useState("");
  const [backgroundState, setBackgroundState] = useState("");

  const handleInput = (value) => {
    // High priority - user input
    setUrgentState(value);

    // Low priority - background processing
    startTransition(() => {
      setBackgroundState(processBackgroundData(value));
    });
  };

  return (
    <div>
      <input
        value={urgentState}
        onChange={(e) => handleInput(e.target.value)}
        placeholder="Type here..."
      />

      <div>Urgent: {urgentState}</div>
      <div>Background: {backgroundState}</div>
    </div>
  );
}
```

## Performance Monitoring

### Measuring Concurrent Performance

```tsx
function PerformanceMonitor() {
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === "measure") {
          setMetrics((prev) => ({
            ...prev,
            [entry.name]: entry.duration,
          }));
        }
      });
    });

    observer.observe({ entryTypes: ["measure"] });
    return () => observer.disconnect();
  }, []);

  const measureExpensiveOperation = () => {
    performance.mark("expensive-start");

    startTransition(() => {
      performExpensiveWork();
      performance.mark("expensive-end");
      performance.measure(
        "expensive-operation",
        "expensive-start",
        "expensive-end"
      );
    });
  };

  return (
    <div>
      <button onClick={measureExpensiveOperation}>
        Run Expensive Operation
      </button>

      <div>
        Performance Metrics:
        {Object.entries(metrics).map(([name, duration]) => (
          <div key={name}>
            {name}: {duration.toFixed(2)}ms
          </div>
        ))}
      </div>
    </div>
  );
}
```

### React DevTools Profiler

```tsx
function ProfilerWrapper({ children }) {
  const onRenderCallback = (id, phase, actualDuration) => {
    console.log(`${id} ${phase}: ${actualDuration}ms`);
  };

  return (
    <Profiler id="App" onRender={onRenderCallback}>
      {children}
    </Profiler>
  );
}
```

## Best Practices

### Use Concurrent Features Appropriately

```tsx
// ✅ Good: Non-urgent updates
startTransition(() => {
  setSearchResults(expensiveSearch(query));
  setAnalytics(calculateAnalytics(data));
});

// ❌ Bad: Urgent user interactions
startTransition(() => {
  setInputValue(e.target.value); // Should be immediate
});
```

### Optimize Heavy Components

```tsx
const HeavyComponent = memo(({ data }) => {
  const processedData = useMemo(() => {
    return expensiveDataProcessing(data);
  }, [data]);

  return <div>{/* Render processed data */}</div>;
});
```

### Provide Loading States

```tsx
function SmartLoadingState() {
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState(null);

  const loadData = () => {
    startTransition(async () => {
      const result = await fetchExpensiveData();
      setData(result);
    });
  };

  return (
    <div>
      <button onClick={loadData} disabled={isPending}>
        {isPending ? "Loading..." : "Load Data"}
      </button>

      {isPending && (
        <div className="loading-skeleton">
          <div className="skeleton-line" />
          <div className="skeleton-line" />
          <div className="skeleton-line" />
        </div>
      )}

      {data && <DataDisplay data={data} />}
    </div>
  );
}
```

## Advanced Patterns

### Selective Concurrent Updates

```tsx
function useSelectiveConcurrency(condition) {
  const [state, setState] = useState();
  const [isPending, startTransition] = useTransition();

  const updateState = useCallback(
    (newValue) => {
      if (condition) {
        startTransition(() => setState(newValue));
      } else {
        setState(newValue);
      }
    },
    [condition]
  );

  return [state, updateState, isPending];
}
```

### Concurrent Form Validation

```tsx
function ConcurrentForm() {
  const [formData, setFormData] = useState({});
  const [validationResults, setValidationResults] = useState({});
  const [isPending, startTransition] = useTransition();

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    startTransition(() => {
      const validation = validateField(field, value);
      setValidationResults((prev) => ({
        ...prev,
        [field]: validation,
      }));
    });
  };

  return (
    <form>
      <input onChange={(e) => updateField("email", e.target.value)} />
      {isPending ? (
        <span>Validating...</span>
      ) : (
        <span>{validationResults.email?.message}</span>
      )}
    </form>
  );
}
```

## Key Benefits

- **Responsive UI**: Prevents blocking on expensive operations
- **Better UX**: Prioritizes user interactions
- **Interruptible**: Can abandon work when priorities change
- **Automatic**: React handles scheduling and prioritization

Concurrent rendering is fundamental to building highly responsive React applications that can handle complex, expensive operations without sacrificing user experience.
