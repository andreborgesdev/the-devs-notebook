# React Performance Best Practices

A comprehensive guide to React performance optimization techniques, patterns, and strategies for building fast, scalable applications.

## Core Performance Principles

### 1. Minimize Re-renders

```jsx
// ❌ Bad: Causes unnecessary re-renders
function App() {
  const [count, setCount] = useState(0);

  const style = { color: "red" }; // New object every render
  const handleClick = () => setCount((c) => c + 1); // New function every render

  return (
    <div>
      <ExpensiveComponent style={style} onClick={handleClick} />
      <span>{count}</span>
    </div>
  );
}

// ✅ Good: Stable references
function App() {
  const [count, setCount] = useState(0);

  const style = useMemo(() => ({ color: "red" }), []);
  const handleClick = useCallback(() => setCount((c) => c + 1), []);

  return (
    <div>
      <ExpensiveComponent style={style} onClick={handleClick} />
      <span>{count}</span>
    </div>
  );
}
```

### 2. Optimize Component Structure

```jsx
// ❌ Bad: Tightly coupled components
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);

  // All data fetched together
  useEffect(() => {
    fetchUserData(userId).then((data) => {
      setUser(data.user);
      setPosts(data.posts);
      setComments(data.comments);
    });
  }, [userId]);

  return (
    <div>
      <UserInfo user={user} />
      <UserPosts posts={posts} />
      <UserComments comments={comments} />
    </div>
  );
}

// ✅ Good: Separated concerns
function UserProfile({ userId }) {
  return (
    <div>
      <UserInfo userId={userId} />
      <UserPosts userId={userId} />
      <UserComments userId={userId} />
    </div>
  );
}

function UserInfo({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);

  return <div>{user?.name}</div>;
}
```

## Component Optimization

### 1. React.memo for Pure Components

```jsx
// ❌ Bad: Re-renders on every parent render
function UserCard({ user }) {
  return (
    <div className="user-card">
      <img src={user.avatar} alt={user.name} />
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
}

// ✅ Good: Only re-renders when props change
const UserCard = React.memo(function UserCard({ user }) {
  return (
    <div className="user-card">
      <img src={user.avatar} alt={user.name} />
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
});

// ✅ Better: With custom comparison
const UserCard = React.memo(
  function UserCard({ user, isSelected }) {
    return (
      <div className={`user-card ${isSelected ? "selected" : ""}`}>
        <img src={user.avatar} alt={user.name} />
        <h3>{user.name}</h3>
        <p>{user.email}</p>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.user.id === nextProps.user.id &&
      prevProps.isSelected === nextProps.isSelected
    );
  }
);
```

### 2. Optimize List Rendering

```jsx
// ❌ Bad: Missing keys and expensive operations
function UserList({ users }) {
  return (
    <div>
      {users.map((user) => (
        <UserCard
          key={Math.random()} // Bad key
          user={user}
          formattedDate={formatDate(user.createdAt)} // Expensive operation
        />
      ))}
    </div>
  );
}

// ✅ Good: Stable keys and memoized operations
function UserList({ users }) {
  const memoizedUsers = useMemo(
    () =>
      users.map((user) => ({
        ...user,
        formattedDate: formatDate(user.createdAt),
      })),
    [users]
  );

  return (
    <div>
      {memoizedUsers.map((user) => (
        <UserCard
          key={user.id} // Stable key
          user={user}
          formattedDate={user.formattedDate}
        />
      ))}
    </div>
  );
}
```

## State Management Performance

### 1. State Normalization

```jsx
// ❌ Bad: Nested state structure
const [state, setState] = useState({
  users: [
    { id: 1, name: "John", posts: [{ id: 1, title: "Post 1" }] },
    { id: 2, name: "Jane", posts: [{ id: 2, title: "Post 2" }] },
  ],
});

// ✅ Good: Normalized state
const [state, setState] = useState({
  users: { 1: { id: 1, name: "John" }, 2: { id: 2, name: "Jane" } },
  posts: {
    1: { id: 1, title: "Post 1", userId: 1 },
    2: { id: 2, title: "Post 2", userId: 2 },
  },
  userPosts: { 1: [1], 2: [2] },
});
```

### 2. State Splitting

```jsx
// ❌ Bad: Monolithic state
function Dashboard() {
  const [state, setState] = useState({
    user: null,
    notifications: [],
    settings: {},
    analytics: {},
    messages: [],
  });

  // Any update causes entire component re-render
  const updateNotifications = (notifications) => {
    setState((prev) => ({ ...prev, notifications }));
  };

  return (
    <div>
      <UserProfile user={state.user} />
      <NotificationPanel notifications={state.notifications} />
      <Settings settings={state.settings} />
    </div>
  );
}

// ✅ Good: Split state by concern
function Dashboard() {
  return (
    <div>
      <UserProfile />
      <NotificationPanel />
      <Settings />
    </div>
  );
}

function NotificationPanel() {
  const [notifications, setNotifications] = useState([]);
  // Only this component re-renders when notifications change

  return <div>{/* Notifications UI */}</div>;
}
```

## Rendering Optimization

### 1. Conditional Rendering Optimization

```jsx
// ❌ Bad: Expensive conditional rendering
function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <Header />
      <MainContent />
      {showModal && <ExpensiveModal />} {/* Re-mounts every time */}
      <Footer />
    </div>
  );
}

// ✅ Good: Stable conditional rendering
function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <Header />
      <MainContent />
      <ExpensiveModal isVisible={showModal} />
      <Footer />
    </div>
  );
}

function ExpensiveModal({ isVisible }) {
  if (!isVisible) return null;

  return <div>{/* Modal content */}</div>;
}
```

### 2. Virtual Scrolling for Large Lists

```jsx
import { FixedSizeList as List } from "react-window";

// ✅ Good: Virtual scrolling for large datasets
function VirtualizedList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      <UserCard user={items[index]} />
    </div>
  );

  return (
    <List height={600} itemCount={items.length} itemSize={100} width="100%">
      {Row}
    </List>
  );
}
```

## Bundle Optimization

### 1. Code Splitting

```jsx
// ✅ Route-based splitting
const Dashboard = lazy(() => import("./Dashboard"));
const Profile = lazy(() => import("./Profile"));
const Settings = lazy(() => import("./Settings"));

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

// ✅ Component-based splitting
function Dashboard() {
  const [showChart, setShowChart] = useState(false);

  const ChartComponent = lazy(() => import("./ExpensiveChart"));

  return (
    <div>
      <button onClick={() => setShowChart(true)}>Show Chart</button>
      {showChart && (
        <Suspense fallback={<div>Loading chart...</div>}>
          <ChartComponent />
        </Suspense>
      )}
    </div>
  );
}
```

### 2. Tree Shaking Optimization

```jsx
// ❌ Bad: Imports entire library
import _ from "lodash";
import * as utils from "./utils";

function Component() {
  const result = _.debounce(handleSearch, 300);
  const formatted = utils.formatDate(date);
}

// ✅ Good: Import only what you need
import debounce from "lodash/debounce";
import { formatDate } from "./utils";

function Component() {
  const result = debounce(handleSearch, 300);
  const formatted = formatDate(date);
}
```

## Network Performance

### 1. Efficient Data Fetching

```jsx
// ❌ Bad: Sequential requests
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchUser(userId).then(setUser);
    fetchUserPosts(userId).then(setPosts);
    fetchUserComments(userId).then(setComments);
  }, [userId]);
}

// ✅ Good: Parallel requests
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    Promise.all([
      fetchUser(userId),
      fetchUserPosts(userId),
      fetchUserComments(userId),
    ]).then(([userData, postsData, commentsData]) => {
      setUser(userData);
      setPosts(postsData);
      setComments(commentsData);
    });
  }, [userId]);
}

// ✅ Better: With React Query
import { useQueries } from "react-query";

function UserProfile({ userId }) {
  const results = useQueries([
    { queryKey: ["user", userId], queryFn: () => fetchUser(userId) },
    { queryKey: ["posts", userId], queryFn: () => fetchUserPosts(userId) },
    {
      queryKey: ["comments", userId],
      queryFn: () => fetchUserComments(userId),
    },
  ]);

  const [userQuery, postsQuery, commentsQuery] = results;
}
```

### 2. Request Deduplication

```jsx
// ✅ Custom hook for request deduplication
const requestCache = new Map();

function useRequest(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (requestCache.has(url)) {
      setData(requestCache.get(url));
      return;
    }

    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        requestCache.set(url, data);
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [url]);

  return { data, loading, error };
}
```

## Memory Management

### 1. Cleanup Side Effects

```jsx
// ❌ Bad: Memory leaks
function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => c + 1);
    }, 1000);
    // Missing cleanup
  }, []);

  return <div>{count}</div>;
}

// ✅ Good: Proper cleanup
function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => c + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <div>{count}</div>;
}
```

### 2. Weak References for Large Objects

```jsx
// ✅ Using WeakMap for component-specific data
const componentData = new WeakMap();

function ExpensiveComponent({ config }) {
  const processedData = useMemo(() => {
    if (componentData.has(config)) {
      return componentData.get(config);
    }

    const result = expensiveProcessing(config);
    componentData.set(config, result);
    return result;
  }, [config]);

  return <div>{/* Use processedData */}</div>;
}
```

## Development Tools

### 1. React DevTools Profiler

```jsx
// Enable profiler in development
import { Profiler } from "react";

function App() {
  const onRenderCallback = (id, phase, actualDuration) => {
    if (process.env.NODE_ENV === "development") {
      console.log("Profiler:", { id, phase, actualDuration });
    }
  };

  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <Router>
        <Routes>{/* Your routes */}</Routes>
      </Router>
    </Profiler>
  );
}
```

### 2. Performance Monitoring Hook

```jsx
// Custom hook for performance monitoring
function usePerformanceMonitor(componentName) {
  const renderCount = useRef(0);
  const startTime = useRef(performance.now());

  useEffect(() => {
    renderCount.current += 1;
    const endTime = performance.now();
    const renderTime = endTime - startTime.current;

    if (process.env.NODE_ENV === "development") {
      console.log(
        `${componentName} render #${renderCount.current}: ${renderTime}ms`
      );
    }

    startTime.current = performance.now();
  });

  return renderCount.current;
}
```

## Performance Monitoring

### 1. Web Vitals Integration

```jsx
import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";

function reportWebVitals() {
  getCLS(console.log);
  getFID(console.log);
  getFCP(console.log);
  getLCP(console.log);
  getTTFB(console.log);
}

// In your app
useEffect(() => {
  if ("requestIdleCallback" in window) {
    requestIdleCallback(reportWebVitals);
  } else {
    setTimeout(reportWebVitals, 0);
  }
}, []);
```

### 2. Custom Performance Metrics

```jsx
// Performance tracking component
function PerformanceTracker({ children, name }) {
  const startTime = useRef(performance.now());

  useLayoutEffect(() => {
    const endTime = performance.now();
    const duration = endTime - startTime.current;

    // Send to analytics
    analytics.track("component_render_time", {
      component: name,
      duration,
      timestamp: Date.now(),
    });
  });

  return children;
}
```

## Anti-Patterns to Avoid

### 1. Inline Object/Function Creation

```jsx
// ❌ Bad
function Parent() {
  return (
    <Child
      style={{ margin: 10 }} // New object every render
      onClick={() => console.log("clicked")} // New function every render
    />
  );
}

// ✅ Good
const CHILD_STYLE = { margin: 10 };

function Parent() {
  const handleClick = useCallback(() => {
    console.log("clicked");
  }, []);

  return <Child style={CHILD_STYLE} onClick={handleClick} />;
}
```

### 2. Overusing useEffect

```jsx
// ❌ Bad: Derived state in useEffect
function Component({ items }) {
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    setFilteredItems(items.filter((item) => item.active));
  }, [items]);

  return <List items={filteredItems} />;
}

// ✅ Good: Derived state during render
function Component({ items }) {
  const filteredItems = useMemo(
    () => items.filter((item) => item.active),
    [items]
  );

  return <List items={filteredItems} />;
}
```

### 3. Premature Optimization

```jsx
// ❌ Bad: Over-optimizing simple components
const SimpleComponent = React.memo(
  function SimpleComponent({ text }) {
    return <span>{text}</span>;
  },
  (prevProps, nextProps) => {
    // Complex comparison for simple component
    return JSON.stringify(prevProps) === JSON.stringify(nextProps);
  }
);

// ✅ Good: Keep it simple
function SimpleComponent({ text }) {
  return <span>{text}</span>;
}
```

## Performance Checklist

### Build Time

- [ ] Code splitting implemented
- [ ] Bundle size analyzed
- [ ] Tree shaking configured
- [ ] Dead code eliminated
- [ ] Images optimized

### Runtime

- [ ] Components properly memoized
- [ ] State updates optimized
- [ ] Event handlers stable
- [ ] List keys unique and stable
- [ ] Large lists virtualized

### Network

- [ ] Requests deduplicated
- [ ] Data cached appropriately
- [ ] Lazy loading implemented
- [ ] Prefetching configured
- [ ] Error boundaries in place

### Memory

- [ ] Event listeners cleaned up
- [ ] Timers/intervals cleared
- [ ] Large objects released
- [ ] Component refs managed
- [ ] Memory leaks prevented

## Interview Questions

### Basic Questions

**Q: What are the main causes of poor React performance?**

A: The main causes include:

- Unnecessary re-renders due to unstable object/function references
- Large component trees without proper optimization
- Inefficient state management and updates
- Missing keys or incorrect keys in lists
- Expensive operations in render functions
- Memory leaks from uncleaned side effects
- Large bundle sizes without code splitting

**Q: How do you identify performance bottlenecks in React?**

A: Using several tools and techniques:

- React DevTools Profiler to identify slow components
- Browser DevTools Performance tab for general performance
- React DevTools to examine component re-renders
- Bundle analyzers like webpack-bundle-analyzer
- Performance monitoring with Web Vitals
- Custom performance hooks for specific measurements

### Intermediate Questions

**Q: Explain the difference between React.memo, useMemo, and useCallback.**

A:

- **React.memo**: Higher-order component that memoizes the entire component based on props
- **useMemo**: Hook that memoizes expensive calculations
- **useCallback**: Hook that memoizes function references to prevent re-creation

**Q: When should you use useCallback vs useMemo?**

A:

- **useCallback**: When passing functions as props to memoized components or as dependencies in other hooks
- **useMemo**: When performing expensive calculations that depend on specific values

### Advanced Questions

**Q: How would you optimize a React app that renders 10,000 items?**

A: Multiple strategies:

- Virtual scrolling with react-window or react-virtualized
- Pagination or infinite scrolling
- Memoization of list items with React.memo
- Stable keys and avoiding index as key
- State normalization to avoid deep object updates
- Code splitting for the list component
- Debounced search/filtering

**Q: Describe your approach to measuring and monitoring React performance in production.**

A: Comprehensive monitoring strategy:

- Web Vitals integration for core metrics
- Custom performance hooks for component-specific metrics
- Error boundary integration with performance tracking
- User interaction tracking (click-to-paint time)
- Bundle size monitoring in CI/CD
- Real User Monitoring (RUM) tools
- A/B testing for performance optimizations

## Best Practices Summary

### Development

1. **Profile first, optimize second** - Don't guess, measure
2. **Start with React DevTools** - Use built-in tools before external ones
3. **Optimize the critical path** - Focus on what users see first
4. **Monitor in production** - Performance varies across devices and networks

### Code Organization

1. **Split by features** - Organize components by business logic
2. **Separate concerns** - Keep data fetching, state, and UI separate
3. **Use TypeScript** - Catch performance issues at compile time
4. **Document optimizations** - Explain why specific optimizations exist

### Performance Culture

1. **Set performance budgets** - Define acceptable thresholds
2. **Automate performance testing** - Include in CI/CD pipeline
3. **Regular performance reviews** - Schedule routine optimization sessions
4. **Team education** - Ensure all developers understand performance best practices
