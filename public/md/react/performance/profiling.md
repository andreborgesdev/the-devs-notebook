# React Profiling and Debugging

## Overview

React provides powerful tools for profiling performance, debugging rendering issues, and optimizing application performance. Understanding these tools is crucial for building fast, efficient React applications.

## React DevTools Profiler

### Basic Profiling

```javascript
import { Profiler } from "react";

function onRenderCallback(
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime
) {
  console.log("Profiler metrics:", {
    id, // Component tree being profiled
    phase, // "mount" or "update"
    actualDuration, // Time spent rendering the update
    baseDuration, // Estimated time to render entire subtree without memoization
    startTime, // When React began rendering this update
    commitTime, // When React committed this update
  });
}

const App = () => (
  <div>
    <Profiler id="Navigation" onRender={onRenderCallback}>
      <Navigation />
    </Profiler>

    <Profiler id="Main" onRender={onRenderCallback}>
      <MainContent />
    </Profiler>
  </div>
);
```

### Advanced Profiling with Custom Hooks

```javascript
const useProfiler = (componentName) => {
  const renderCount = useRef(0);
  const startTime = useRef();

  useEffect(() => {
    renderCount.current += 1;
  });

  const startProfiling = useCallback(() => {
    startTime.current = performance.now();
  }, []);

  const endProfiling = useCallback(() => {
    if (startTime.current) {
      const duration = performance.now() - startTime.current;
      console.log(
        `${componentName} render ${renderCount.current}: ${duration.toFixed(
          2
        )}ms`
      );
    }
  }, [componentName]);

  useLayoutEffect(() => {
    startProfiling();
    return endProfiling;
  });

  return { renderCount: renderCount.current };
};

const ExpensiveComponent = ({ data }) => {
  const { renderCount } = useProfiler("ExpensiveComponent");

  const processedData = useMemo(() => {
    const start = performance.now();
    const result = data.map((item) => ({
      ...item,
      processed: true,
      timestamp: Date.now(),
    }));
    const end = performance.now();
    console.log(`Data processing took ${(end - start).toFixed(2)}ms`);
    return result;
  }, [data]);

  return (
    <div>
      <h3>Component rendered {renderCount} times</h3>
      <ul>
        {processedData.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};
```

## Performance Monitoring

### Render Performance Tracking

```javascript
const useRenderTracking = (componentName) => {
  const renderTimes = useRef([]);
  const mountTime = useRef();

  useEffect(() => {
    mountTime.current = performance.now();

    return () => {
      const unmountTime = performance.now();
      const totalLifetime = unmountTime - mountTime.current;
      console.log(
        `${componentName} total lifetime: ${totalLifetime.toFixed(2)}ms`
      );
    };
  }, [componentName]);

  useLayoutEffect(() => {
    const renderStart = performance.now();

    return () => {
      const renderEnd = performance.now();
      const renderTime = renderEnd - renderStart;
      renderTimes.current.push(renderTime);

      const avgRenderTime =
        renderTimes.current.reduce((a, b) => a + b, 0) /
        renderTimes.current.length;

      if (renderTime > 16.67) {
        // Slower than 60fps
        console.warn(
          `${componentName} slow render: ${renderTime.toFixed(
            2
          )}ms (avg: ${avgRenderTime.toFixed(2)}ms)`
        );
      }
    };
  });
};

const TrackedComponent = ({ data }) => {
  useRenderTracking("TrackedComponent");

  return (
    <div>
      {data.map((item) => (
        <ExpensiveListItem key={item.id} item={item} />
      ))}
    </div>
  );
};
```

### Memory Usage Monitoring

```javascript
const useMemoryMonitor = (interval = 5000) => {
  const [memoryInfo, setMemoryInfo] = useState(null);

  useEffect(() => {
    const checkMemory = () => {
      if (performance.memory) {
        setMemoryInfo({
          used: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
          total: Math.round(performance.memory.totalJSHeapSize / 1048576), // MB
          limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576), // MB
        });
      }
    };

    checkMemory();
    const intervalId = setInterval(checkMemory, interval);

    return () => clearInterval(intervalId);
  }, [interval]);

  return memoryInfo;
};

const MemoryMonitorComponent = () => {
  const memoryInfo = useMemoryMonitor();

  if (!memoryInfo) return null;

  const usagePercentage = (memoryInfo.used / memoryInfo.limit) * 100;

  return (
    <div className={`memory-monitor ${usagePercentage > 80 ? "warning" : ""}`}>
      <p>
        Memory Usage: {memoryInfo.used}MB / {memoryInfo.limit}MB (
        {usagePercentage.toFixed(1)}%)
      </p>
      {usagePercentage > 80 && (
        <p className="warning">High memory usage detected!</p>
      )}
    </div>
  );
};
```

## Debugging Hooks

### useWhyDidYouUpdate

```javascript
const useWhyDidYouUpdate = (name, props) => {
  const previous = useRef();

  useEffect(() => {
    if (previous.current) {
      const allKeys = Object.keys({ ...previous.current, ...props });
      const changedProps = {};

      allKeys.forEach((key) => {
        if (previous.current[key] !== props[key]) {
          changedProps[key] = {
            from: previous.current[key],
            to: props[key],
          };
        }
      });

      if (Object.keys(changedProps).length) {
        console.log("[why-did-you-update]", name, changedProps);
      }
    }

    previous.current = props;
  });
};

const OptimizedComponent = memo(({ user, settings, data }) => {
  useWhyDidYouUpdate("OptimizedComponent", { user, settings, data });

  return (
    <div>
      <h3>{user.name}</h3>
      <p>Theme: {settings.theme}</p>
      <ul>
        {data.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
});
```

### useTraceUpdate

```javascript
const useTraceUpdate = (props) => {
  const prev = useRef(props);

  useEffect(() => {
    const keys = Object.keys(props);
    const changedKeys = keys.filter((key) => prev.current[key] !== props[key]);

    if (changedKeys.length > 0) {
      console.group("🔄 Props changed");
      changedKeys.forEach((key) => {
        console.log(`${key}:`, {
          previous: prev.current[key],
          current: props[key],
        });
      });
      console.groupEnd();
    }

    prev.current = props;
  });
};

const DebuggableComponent = (props) => {
  useTraceUpdate(props);

  return <div>{/* Component content */}</div>;
};
```

## React DevTools Browser Extension

### Component Inspector

```javascript
// Add displayName for better debugging
const EnhancedComponent = memo(({ data }) => {
  return <div>{/* component content */}</div>;
});

EnhancedComponent.displayName = "EnhancedComponent";

// Add custom hooks debugging
const useCustomHook = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  // This will show in React DevTools
  useDebugValue(value > 10 ? "High" : "Low");

  return [value, setValue];
};
```

### Component Tree Analysis

```javascript
const ComponentTreeAnalyzer = () => {
  useEffect(() => {
    // Log component tree depth
    const analyzeDepth = (element, depth = 0) => {
      if (!element) return depth;

      const children = React.Children.toArray(element.props?.children || []);
      const maxChildDepth = children.reduce((max, child) => {
        return Math.max(max, analyzeDepth(child, depth + 1));
      }, depth);

      return maxChildDepth;
    };

    console.log("Component tree depth:", analyzeDepth);
  }, []);

  return null;
};
```

## Performance Testing

### Component Load Testing

```javascript
const useLoadTesting = (componentName, iterations = 1000) => {
  const [results, setResults] = useState(null);

  const runLoadTest = useCallback(async () => {
    const startTime = performance.now();
    const renderTimes = [];

    for (let i = 0; i < iterations; i++) {
      const renderStart = performance.now();

      // Simulate component render
      await new Promise((resolve) => {
        setTimeout(() => {
          const renderEnd = performance.now();
          renderTimes.push(renderEnd - renderStart);
          resolve();
        }, 0);
      });
    }

    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const averageRenderTime =
      renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length;
    const maxRenderTime = Math.max(...renderTimes);
    const minRenderTime = Math.min(...renderTimes);

    setResults({
      totalTime,
      averageRenderTime,
      maxRenderTime,
      minRenderTime,
      iterations,
    });

    console.log(`Load test results for ${componentName}:`, {
      totalTime: `${totalTime.toFixed(2)}ms`,
      averageRenderTime: `${averageRenderTime.toFixed(2)}ms`,
      maxRenderTime: `${maxRenderTime.toFixed(2)}ms`,
      minRenderTime: `${minRenderTime.toFixed(2)}ms`,
      iterations,
    });
  }, [componentName, iterations]);

  return { results, runLoadTest };
};
```

### Bundle Size Impact Analysis

```javascript
const useBundleImpactAnalysis = () => {
  useEffect(() => {
    const measureBundleImpact = () => {
      const scripts = document.querySelectorAll('script[src*="chunk"]');
      const totalScripts = scripts.length;

      scripts.forEach((script, index) => {
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.href = script.src;

        link.onload = () => {
          fetch(script.src, { method: "HEAD" }).then((response) => {
            const size = response.headers.get("content-length");
            if (size) {
              console.log(
                `Chunk ${index + 1}/${totalScripts}: ${(
                  parseInt(size) / 1024
                ).toFixed(2)} KB`
              );
            }
          });
        };

        document.head.appendChild(link);
      });
    };

    measureBundleImpact();
  }, []);
};
```

## Error Boundary with Profiling

```javascript
class ProfilingErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      renderCount: 0,
      errorTime: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
      errorTime: performance.now(),
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });

    // Log error with performance context
    console.error("Error Boundary caught error:", {
      error: error.message,
      errorInfo,
      renderCount: this.state.renderCount,
      errorTime: this.state.errorTime,
      componentStack: errorInfo.componentStack,
    });

    // Send to error reporting service
    if (this.props.onError) {
      this.props.onError(error, errorInfo, {
        renderCount: this.state.renderCount,
        errorTime: this.state.errorTime,
      });
    }
  }

  componentDidUpdate() {
    this.setState((prevState) => ({
      renderCount: prevState.renderCount + 1,
    }));
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="error-boundary">
            <h2>Something went wrong.</h2>
            <details style={{ whiteSpace: "pre-wrap" }}>
              <summary>Error Details</summary>
              <p>
                <strong>Error:</strong> {this.state.error?.message}
              </p>
              <p>
                <strong>Render Count:</strong> {this.state.renderCount}
              </p>
              <p>
                <strong>Error Time:</strong> {this.state.errorTime}ms
              </p>
              <p>
                <strong>Stack:</strong> {this.state.errorInfo?.componentStack}
              </p>
            </details>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Try Again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

## Real-time Performance Dashboard

```javascript
const PerformanceDashboard = () => {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    memoryUsage: 0,
    componentCount: 0,
    reRenderCount: 0,
  });

  const updateMetrics = useCallback((newMetrics) => {
    setMetrics((prev) => ({ ...prev, ...newMetrics }));
  }, []);

  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === "measure") {
          updateMetrics({ renderTime: entry.duration });
        }
      }
    });

    observer.observe({ entryTypes: ["measure"] });

    return () => observer.disconnect();
  }, [updateMetrics]);

  const memoryInfo = useMemoryMonitor(1000);

  useEffect(() => {
    if (memoryInfo) {
      updateMetrics({ memoryUsage: memoryInfo.used });
    }
  }, [memoryInfo, updateMetrics]);

  return (
    <div className="performance-dashboard">
      <h3>Performance Metrics</h3>
      <div className="metrics-grid">
        <div className="metric">
          <label>Render Time</label>
          <span>{metrics.renderTime.toFixed(2)}ms</span>
        </div>
        <div className="metric">
          <label>Memory Usage</label>
          <span>{metrics.memoryUsage}MB</span>
        </div>
        <div className="metric">
          <label>Component Count</label>
          <span>{metrics.componentCount}</span>
        </div>
        <div className="metric">
          <label>Re-renders</label>
          <span>{metrics.reRenderCount}</span>
        </div>
      </div>
    </div>
  );
};
```

## DevTools Integration

```javascript
// Custom DevTools hook
const useDevTools = (componentName, data) => {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.__REACT_DEVTOOLS_GLOBAL_HOOK__
    ) {
      const devTools = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;

      // Send custom data to DevTools
      devTools.onCommitFiberRoot?.(null, {
        componentName,
        data,
        timestamp: Date.now(),
      });
    }
  }, [componentName, data]);
};

// Performance markers for DevTools
const usePerformanceMarkers = (componentName) => {
  useLayoutEffect(() => {
    performance.mark(`${componentName}-render-start`);

    return () => {
      performance.mark(`${componentName}-render-end`);
      performance.measure(
        `${componentName}-render`,
        `${componentName}-render-start`,
        `${componentName}-render-end`
      );
    };
  });
};
```

## Interview Questions

**Q: How do you use React DevTools Profiler?**
A: React DevTools Profiler records performance information about components during renders, showing render duration, component hierarchies, and identifying performance bottlenecks in the application.

**Q: What metrics should you monitor for React performance?**
A: Key metrics include render times, re-render frequency, memory usage, bundle size, Time to First Byte (TTFB), First Contentful Paint (FCP), and Largest Contentful Paint (LCP).

**Q: How do you debug unnecessary re-renders?**
A: Use React DevTools Profiler, custom hooks like useWhyDidYouUpdate, React.memo for components, and useMemo/useCallback for values and functions to prevent unnecessary re-renders.

**Q: What's the difference between the Profiler component and React DevTools?**
A: The Profiler component programmatically collects performance data in your code, while React DevTools provides a visual interface for profiling and debugging in the browser.

## Best Practices

1. **Use Profiler judiciously** - Only in development or when debugging
2. **Monitor real user metrics** - Don't just rely on lab testing
3. **Set performance budgets** - Define acceptable thresholds
4. **Profile regularly** - Make it part of your development process
5. **Focus on user-perceived performance** - Optimize for user experience

Effective profiling and debugging are essential for maintaining high-performance React applications. Use these tools and techniques to identify bottlenecks and optimize your components systematically.
