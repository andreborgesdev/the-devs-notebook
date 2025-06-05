# React Performance Optimization

## Overview

React performance optimization involves identifying bottlenecks and applying strategies to improve rendering speed, reduce bundle size, and enhance user experience. Modern React provides built-in tools and patterns for efficient applications.

## React.memo for Component Memoization

```javascript
import React, { memo, useState } from "react";

const ExpensiveComponent = memo(({ user, settings }) => {
  console.log("ExpensiveComponent rendered");

  const expensiveCalculation = () => {
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += Math.random();
    }
    return result;
  };

  return (
    <div>
      <h3>{user.name}</h3>
      <p>Expensive result: {expensiveCalculation()}</p>
      <p>Theme: {settings.theme}</p>
    </div>
  );
});

const OptimizedUserList = memo(({ users, onUserClick }) => {
  console.log("UserList rendered");

  return (
    <div>
      {users.map((user) => (
        <UserItem key={user.id} user={user} onClick={onUserClick} />
      ))}
    </div>
  );
});

const UserItem = memo(({ user, onClick }) => {
  return (
    <div onClick={() => onClick(user)} className="user-item">
      <img src={user.avatar} alt={user.name} />
      <span>{user.name}</span>
    </div>
  );
});

function App() {
  const [users, setUsers] = useState([]);
  const [count, setCount] = useState(0);
  const [settings, setSettings] = useState({ theme: "light" });

  const handleUserClick = useCallback((user) => {
    console.log("User clicked:", user.name);
  }, []);

  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>Count: {count}</button>

      <OptimizedUserList users={users} onUserClick={handleUserClick} />

      {users[0] && <ExpensiveComponent user={users[0]} settings={settings} />}
    </div>
  );
}
```

## Custom Comparison Functions

```javascript
import { memo } from "react";

const areEqual = (prevProps, nextProps) => {
  if (prevProps.items.length !== nextProps.items.length) {
    return false;
  }

  return prevProps.items.every((item, index) => {
    const nextItem = nextProps.items[index];
    return (
      item.id === nextItem.id &&
      item.name === nextItem.name &&
      item.status === nextItem.status
    );
  });
};

const ItemList = memo(({ items, onItemUpdate }) => {
  console.log("ItemList rendered with", items.length, "items");

  return (
    <div>
      {items.map((item) => (
        <div key={item.id}>
          <span>{item.name}</span>
          <button onClick={() => onItemUpdate(item.id)}>Update</button>
        </div>
      ))}
    </div>
  );
}, areEqual);

const DeepComparisonComponent = memo(
  ({ config }) => {
    return (
      <div>
        <p>API URL: {config.api.url}</p>
        <p>Timeout: {config.api.timeout}</p>
        <p>Theme: {config.ui.theme}</p>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.config.api.url === nextProps.config.api.url &&
      prevProps.config.api.timeout === nextProps.config.api.timeout &&
      prevProps.config.ui.theme === nextProps.config.ui.theme
    );
  }
);
```

## useMemo for Expensive Calculations

```javascript
import { useMemo, useState } from "react";

function DataProcessor({ data, filters, sortBy }) {
  const processedData = useMemo(() => {
    console.log("Processing data...");

    let filtered = data.filter((item) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return item[key]
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      });
    });

    if (sortBy) {
      filtered.sort((a, b) => {
        if (sortBy.direction === "asc") {
          return a[sortBy.field] > b[sortBy.field] ? 1 : -1;
        }
        return a[sortBy.field] < b[sortBy.field] ? 1 : -1;
      });
    }

    return filtered;
  }, [data, filters, sortBy]);

  const statistics = useMemo(() => {
    console.log("Calculating statistics...");

    return {
      total: processedData.length,
      average:
        processedData.reduce((sum, item) => sum + item.value, 0) /
        processedData.length,
      max: Math.max(...processedData.map((item) => item.value)),
      min: Math.min(...processedData.map((item) => item.value)),
    };
  }, [processedData]);

  return (
    <div>
      <div>
        <h3>Statistics</h3>
        <p>Total: {statistics.total}</p>
        <p>Average: {statistics.average.toFixed(2)}</p>
        <p>Max: {statistics.max}</p>
        <p>Min: {statistics.min}</p>
      </div>

      <div>
        {processedData.map((item) => (
          <div key={item.id}>
            {item.name}: {item.value}
          </div>
        ))}
      </div>
    </div>
  );
}

function ExpensiveChart({ data, config }) {
  const chartData = useMemo(() => {
    console.log("Generating chart data...");

    const processedData = data.map((point) => ({
      ...point,
      normalizedValue: (point.value - config.min) / (config.max - config.min),
      color:
        point.value > config.threshold ? config.colors.high : config.colors.low,
    }));

    return {
      points: processedData,
      boundaries: {
        xMin: Math.min(...processedData.map((p) => p.x)),
        xMax: Math.max(...processedData.map((p) => p.x)),
        yMin: Math.min(...processedData.map((p) => p.y)),
        yMax: Math.max(...processedData.map((p) => p.y)),
      },
    };
  }, [data, config.min, config.max, config.threshold, config.colors]);

  return (
    <svg width={400} height={300}>
      {chartData.points.map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r={5}
          fill={point.color}
        />
      ))}
    </svg>
  );
}
```

## useCallback for Stable References

```javascript
import { useCallback, useState, memo } from "react";

const TodoItem = memo(({ todo, onToggle, onDelete, onEdit }) => {
  console.log(`Rendering todo: ${todo.text}`);

  return (
    <div className="todo-item">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span
        style={{
          textDecoration: todo.completed ? "line-through" : "none",
        }}
        onDoubleClick={() => onEdit(todo.id)}
      >
        {todo.text}
      </span>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </div>
  );
});

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const toggleTodo = useCallback((id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  const editTodo = useCallback((id) => {
    setEditingId(id);
  }, []);

  const updateTodo = useCallback((id, newText) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo))
    );
    setEditingId(null);
  }, []);

  const addTodo = useCallback((text) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
    };
    setTodos((prev) => [...prev, newTodo]);
  }, []);

  return (
    <div>
      <AddTodoForm onAdd={addTodo} />

      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onEdit={editTodo}
        />
      ))}
    </div>
  );
}

const AddTodoForm = memo(({ onAdd }) => {
  const [text, setText] = useState("");

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (text.trim()) {
        onAdd(text.trim());
        setText("");
      }
    },
    [text, onAdd]
  );

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add new todo..."
      />
      <button type="submit">Add</button>
    </form>
  );
});
```

## Virtual Scrolling Implementation

```javascript
import { useState, useMemo, useCallback } from "react";

function VirtualScrollList({ items, itemHeight = 50, containerHeight = 400 }) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleRange = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );

    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, items.length]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex);
  }, [items, visibleRange]);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.startIndex * itemHeight;

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  return (
    <div
      style={{
        height: containerHeight,
        overflow: "auto",
        border: "1px solid #ccc",
      }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {visibleItems.map((item, index) => (
            <VirtualItem
              key={visibleRange.startIndex + index}
              item={item}
              height={itemHeight}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const VirtualItem = memo(({ item, height }) => (
  <div
    style={{
      height,
      display: "flex",
      alignItems: "center",
      padding: "0 16px",
      borderBottom: "1px solid #eee",
    }}
  >
    <span>{item.name}</span>
    <span style={{ marginLeft: "auto" }}>{item.value}</span>
  </div>
));

function VirtualScrollDemo() {
  const largeDataset = useMemo(
    () =>
      Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
        value: Math.floor(Math.random() * 1000),
      })),
    []
  );

  return (
    <div>
      <h2>Virtual Scroll List (10,000 items)</h2>
      <VirtualScrollList
        items={largeDataset}
        itemHeight={60}
        containerHeight={500}
      />
    </div>
  );
}
```

## Lazy Loading and Code Splitting

```javascript
import { lazy, Suspense, useState } from "react";

const HeavyChart = lazy(() =>
  import("./components/HeavyChart").then((module) => ({
    default: module.HeavyChart,
  }))
);

const AdminPanel = lazy(() => import("./components/AdminPanel"));

const UserSettings = lazy(
  () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(import("./components/UserSettings"));
      }, 1000);
    })
);

function LoadingSpinner() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "200px",
      }}
    >
      <div className="spinner">Loading...</div>
    </div>
  );
}

function ErrorBoundary({ children, fallback }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return fallback || <div>Something went wrong loading the component.</div>;
  }

  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;
}

function App() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <nav>
        <button
          onClick={() => setCurrentView("dashboard")}
          disabled={currentView === "dashboard"}
        >
          Dashboard
        </button>
        <button
          onClick={() => setCurrentView("admin")}
          disabled={currentView === "admin"}
        >
          Admin
        </button>
        <button
          onClick={() => setCurrentView("settings")}
          disabled={currentView === "settings"}
        >
          Settings
        </button>
      </nav>

      <main>
        {currentView === "dashboard" && (
          <div>
            <h1>Dashboard</h1>
            <button onClick={() => setShowChart(!showChart)}>
              {showChart ? "Hide" : "Show"} Chart
            </button>

            {showChart && (
              <ErrorBoundary fallback={<div>Chart failed to load</div>}>
                <HeavyChart data={[]} />
              </ErrorBoundary>
            )}
          </div>
        )}

        {currentView === "admin" && (
          <ErrorBoundary>
            <AdminPanel />
          </ErrorBoundary>
        )}

        {currentView === "settings" && (
          <ErrorBoundary>
            <UserSettings />
          </ErrorBoundary>
        )}
      </main>
    </div>
  );
}
```

## Debouncing and Throttling

```javascript
import { useState, useCallback, useRef, useMemo } from "react";

function useDebounce(callback, delay) {
  const timeoutRef = useRef(null);

  return useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}

function useThrottle(callback, delay) {
  const lastCallRef = useRef(0);

  return useCallback(
    (...args) => {
      const now = Date.now();

      if (now - lastCallRef.current >= delay) {
        lastCallRef.current = now;
        callback(...args);
      }
    },
    [callback, delay]
  );
}

function SearchComponent({ onSearch, data }) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const performSearch = useCallback(
    async (searchQuery) => {
      if (!searchQuery.trim()) {
        setIsSearching(false);
        return;
      }

      setIsSearching(true);

      try {
        await onSearch(searchQuery);
      } finally {
        setIsSearching(false);
      }
    },
    [onSearch]
  );

  const debouncedSearch = useDebounce(performSearch, 500);

  const handleInputChange = useCallback(
    (e) => {
      const value = e.target.value;
      setQuery(value);

      if (value.trim()) {
        setIsSearching(true);
      }

      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  const filteredData = useMemo(() => {
    if (!query.trim()) return data;

    return data.filter(
      (item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
    );
  }, [data, query]);

  return (
    <div>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search..."
          style={{ width: "100%", padding: "8px" }}
        />
        {isSearching && (
          <div
            style={{
              position: "absolute",
              right: "8px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            🔍
          </div>
        )}
      </div>

      <div>
        {filteredData.map((item) => (
          <div
            key={item.id}
            style={{ padding: "8px", borderBottom: "1px solid #eee" }}
          >
            <h4>{item.name}</h4>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const throttledScroll = useThrottle((e) => {
    setScrollY(window.scrollY);
  }, 100);

  const debouncedScrollEnd = useDebounce(() => {
    setIsScrolling(false);
  }, 150);

  useEffect(() => {
    const handleScroll = (e) => {
      setIsScrolling(true);
      throttledScroll(e);
      debouncedScrollEnd();
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [throttledScroll, debouncedScrollEnd]);

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        background: "rgba(0,0,0,0.8)",
        color: "white",
        padding: "8px",
      }}
    >
      Scroll: {scrollY}px {isScrolling && "(scrolling)"}
    </div>
  );
}
```

## Bundle Size Optimization

```javascript
import { useState, useCallback } from "react";

const loadLibrary = async (libraryName) => {
  switch (libraryName) {
    case "chart":
      const { Chart } = await import("chart.js/auto");
      return Chart;

    case "date":
      const { format, parseISO } = await import("date-fns");
      return { format, parseISO };

    case "utils":
      const utils = await import("lodash-es");
      return utils;

    default:
      throw new Error(`Unknown library: ${libraryName}`);
  }
};

function FeatureComponent() {
  const [activeFeature, setActiveFeature] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadFeature = useCallback(async (featureName) => {
    setLoading(true);

    try {
      const library = await loadLibrary(featureName);
      setActiveFeature({ name: featureName, lib: library });
    } catch (error) {
      console.error("Failed to load feature:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div>
      <h2>Dynamic Feature Loading</h2>

      <div>
        <button onClick={() => loadFeature("chart")} disabled={loading}>
          Load Chart Library
        </button>

        <button onClick={() => loadFeature("date")} disabled={loading}>
          Load Date Utils
        </button>

        <button onClick={() => loadFeature("utils")} disabled={loading}>
          Load Utility Functions
        </button>
      </div>

      {loading && <div>Loading feature...</div>}

      {activeFeature && (
        <div>
          <h3>Loaded: {activeFeature.name}</h3>
          <p>Library object available in console</p>
        </div>
      )}
    </div>
  );
}

const TreeShaking = () => {
  const handleSpecificImport = async () => {
    const { debounce } = await import("lodash-es/debounce");

    const debouncedFunction = debounce(() => {
      console.log("Debounced!");
    }, 300);

    debouncedFunction();
  };

  const handleDateFormatting = async () => {
    const { format } = await import("date-fns/format");

    const formatted = format(new Date(), "yyyy-MM-dd");
    console.log("Formatted date:", formatted);
  };

  return (
    <div>
      <h3>Tree Shaking Examples</h3>
      <button onClick={handleSpecificImport}>
        Use Specific Lodash Function
      </button>
      <button onClick={handleDateFormatting}>Use Specific Date Function</button>
    </div>
  );
};
```

## Performance Monitoring

```javascript
import { useEffect, useRef, useState } from "react";

function usePerformanceMonitor(componentName) {
  const renderStartRef = useRef(null);
  const mountStartRef = useRef(performance.now());
  const [metrics, setMetrics] = useState({
    mountTime: 0,
    renderTimes: [],
    averageRenderTime: 0,
  });

  useEffect(() => {
    const mountTime = performance.now() - mountStartRef.current;
    setMetrics((prev) => ({ ...prev, mountTime }));

    console.log(`${componentName} mounted in ${mountTime.toFixed(2)}ms`);
  }, [componentName]);

  useEffect(() => {
    if (renderStartRef.current) {
      const renderTime = performance.now() - renderStartRef.current;

      setMetrics((prev) => {
        const newRenderTimes = [...prev.renderTimes, renderTime].slice(-10);
        const averageRenderTime =
          newRenderTimes.reduce((a, b) => a + b, 0) / newRenderTimes.length;

        return {
          ...prev,
          renderTimes: newRenderTimes,
          averageRenderTime,
        };
      });

      console.log(`${componentName} rendered in ${renderTime.toFixed(2)}ms`);
    }
  });

  const startRenderTiming = () => {
    renderStartRef.current = performance.now();
  };

  return { metrics, startRenderTiming };
}

function MonitoredComponent({ data }) {
  const { metrics, startRenderTiming } =
    usePerformanceMonitor("MonitoredComponent");

  startRenderTiming();

  const expensiveComputation = useMemo(() => {
    const start = performance.now();

    const result = data.reduce((acc, item) => {
      return acc + Math.sqrt(item.value) * Math.random();
    }, 0);

    const end = performance.now();
    console.log(`Expensive computation took ${(end - start).toFixed(2)}ms`);

    return result;
  }, [data]);

  return (
    <div>
      <h3>Performance Metrics</h3>
      <p>Mount Time: {metrics.mountTime.toFixed(2)}ms</p>
      <p>Average Render Time: {metrics.averageRenderTime.toFixed(2)}ms</p>
      <p>Recent Renders: {metrics.renderTimes.length}</p>

      <div>
        <h4>Computed Result</h4>
        <p>{expensiveComputation.toFixed(2)}</p>
      </div>
    </div>
  );
}

function PerformanceBenchmark() {
  const [itemCount, setItemCount] = useState(1000);
  const [renderCount, setRenderCount] = useState(0);

  const data = useMemo(
    () =>
      Array.from({ length: itemCount }, (_, i) => ({
        id: i,
        value: Math.random() * 100,
      })),
    [itemCount]
  );

  const measureRender = () => {
    const start = performance.now();

    setRenderCount((prev) => prev + 1);

    setTimeout(() => {
      const end = performance.now();
      console.log(`Forced render took ${(end - start).toFixed(2)}ms`);
    }, 0);
  };

  return (
    <div>
      <div>
        <label>
          Item Count:
          <input
            type="range"
            min="100"
            max="10000"
            step="100"
            value={itemCount}
            onChange={(e) => setItemCount(parseInt(e.target.value))}
          />
          {itemCount}
        </label>
      </div>

      <button onClick={measureRender}>Force Render ({renderCount})</button>

      <MonitoredComponent data={data} />
    </div>
  );
}
```

## Performance Anti-Patterns

```javascript
function PerformanceAntiPatterns() {
  const [count, setCount] = useState(0);
  const [users, setUsers] = useState([]);

  const BadInlineObject = () => (
    <ExpensiveComponent
      config={{ theme: "dark", size: "large" }}
      style={{ margin: "10px" }}
    />
  );

  const BadInlineFunction = () => (
    <button onClick={() => console.log("clicked")}>Click me</button>
  );

  const badFilter = users.filter((user) => user.active);

  const GoodWithMemo = useMemo(() => {
    const config = { theme: "dark", size: "large" };
    const style = { margin: "10px" };

    return <ExpensiveComponent config={config} style={style} />;
  }, []);

  const handleClick = useCallback(() => {
    console.log("clicked");
  }, []);

  const filteredUsers = useMemo(
    () => users.filter((user) => user.active),
    [users]
  );

  return (
    <div>
      <h3>Anti-Patterns vs Good Patterns</h3>

      <div>
        <h4>❌ Bad: New objects on every render</h4>
        <BadInlineObject />

        <h4>✅ Good: Memoized objects</h4>
        {GoodWithMemo}
      </div>

      <div>
        <h4>❌ Bad: Inline functions</h4>
        <BadInlineFunction />

        <h4>✅ Good: useCallback</h4>
        <button onClick={handleClick}>Click me</button>
      </div>

      <div>
        <h4>❌ Bad: Computed values in render</h4>
        <p>Active users: {badFilter.length}</p>

        <h4>✅ Good: useMemo for computations</h4>
        <p>Active users: {filteredUsers.length}</p>
      </div>
    </div>
  );
}
```

## Performance Checklist

| Optimization      | When to Use                             | Example                       |
| ----------------- | --------------------------------------- | ----------------------------- |
| React.memo        | Component re-renders unnecessarily      | Wrapping expensive components |
| useMemo           | Expensive calculations                  | Complex data processing       |
| useCallback       | Functions passed to memoized components | Event handlers                |
| Code splitting    | Large bundles                           | Route-based splitting         |
| Virtual scrolling | Large lists                             | 1000+ items                   |
| Debouncing        | Frequent user input                     | Search inputs                 |
| Lazy loading      | Non-critical features                   | Admin panels, charts          |

## Interview Questions

### Q1: What are the main techniques for optimizing React performance?

**Answer:**

- **React.memo**: Prevent unnecessary re-renders
- **useMemo/useCallback**: Optimize expensive computations and functions
- **Code splitting**: Reduce initial bundle size
- **Virtual scrolling**: Handle large lists efficiently
- **Debouncing/Throttling**: Limit expensive operations
- **Proper key props**: Optimize list reconciliation

### Q2: When should you use React.memo?

**Answer:** Use React.memo when:

- Component re-renders frequently with same props
- Component has expensive rendering logic
- Parent component re-renders often
- Props are primitive values or stable references

### Q3: What's the difference between useMemo and useCallback?

**Answer:**

- **useMemo**: Memoizes computed values/objects
- **useCallback**: Memoizes function references
- Both prevent unnecessary recalculations when dependencies haven't changed

### Q4: How do you identify performance bottlenecks in React?

**Answer:**

- React DevTools Profiler
- Browser DevTools Performance tab
- Console timing measurements
- Bundle analyzers for size optimization
- User-reported performance metrics

## Best Practices

1. **Measure first** - Profile before optimizing
2. **Start with low-hanging fruit** - Fix obvious anti-patterns
3. **Use tools** - React DevTools, Webpack Bundle Analyzer
4. **Optimize strategically** - Focus on user-facing performance
5. **Monitor in production** - Track real-world performance
6. **Avoid premature optimization** - Don't optimize everything
7. **Test optimizations** - Verify improvements actually help

## Common Mistakes

1. **Over-memoization** - Memoizing everything hurts performance
2. **Unstable dependencies** - Objects/functions that change every render
3. **Missing keys** - Using array indices for dynamic lists
4. **Inline objects/functions** - Creating new references on every render
5. **Not profiling** - Optimizing without measuring impact
6. **Ignoring bundle size** - Not code splitting large dependencies
7. **Blocking the main thread** - Long synchronous operations
