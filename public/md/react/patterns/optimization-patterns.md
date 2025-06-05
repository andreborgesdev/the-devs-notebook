# React Optimization Patterns

React optimization involves implementing patterns and techniques to improve application performance, reduce unnecessary re-renders, and optimize bundle size and loading times.

## Memoization Patterns

### React.memo for Component Memoization

```typescript
import React from "react";

interface UserCardProps {
  user: {
    id: number;
    name: string;
    email: string;
    avatar: string;
  };
  onEdit: (userId: number) => void;
  theme: "light" | "dark";
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit, theme }) => {
  console.log("UserCard render:", user.name);

  return (
    <div className={`user-card ${theme}`}>
      <img src={user.avatar} alt={user.name} />
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <button onClick={() => onEdit(user.id)}>Edit</button>
    </div>
  );
};

// Basic memoization
const MemoizedUserCard = React.memo(UserCard);

// Custom comparison function
const OptimizedUserCard = React.memo(UserCard, (prevProps, nextProps) => {
  return (
    prevProps.user.id === nextProps.user.id &&
    prevProps.user.name === nextProps.user.name &&
    prevProps.user.email === nextProps.user.email &&
    prevProps.theme === nextProps.theme
    // Note: onEdit function reference is ignored in comparison
  );
});

// Usage
function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const handleEdit = useCallback((userId: number) => {
    console.log("Editing user:", userId);
  }, []);

  return (
    <div>
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        Toggle Theme
      </button>
      {users.map((user) => (
        <OptimizedUserCard
          key={user.id}
          user={user}
          onEdit={handleEdit}
          theme={theme}
        />
      ))}
    </div>
  );
}
```

### useMemo for Expensive Calculations

```typescript
import { useMemo, useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  rating: number;
  inStock: boolean;
}

interface ProductListProps {
  products: Product[];
  searchTerm: string;
  sortBy: "name" | "price" | "rating";
  filterCategory: string;
  showOutOfStock: boolean;
}

function ProductList({
  products,
  searchTerm,
  sortBy,
  filterCategory,
  showOutOfStock,
}: ProductListProps) {
  // Expensive filtering and sorting operation
  const processedProducts = useMemo(() => {
    console.log("Processing products..."); // This should only log when dependencies change

    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (filterCategory && filterCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === filterCategory
      );
    }

    // Filter by stock status
    if (!showOutOfStock) {
      filtered = filtered.filter((product) => product.inStock);
    }

    // Sort products
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          return a.price - b.price;
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    return sorted;
  }, [products, searchTerm, sortBy, filterCategory, showOutOfStock]);

  // Memoize expensive statistics calculation
  const statistics = useMemo(() => {
    return {
      totalProducts: processedProducts.length,
      averagePrice:
        processedProducts.reduce((sum, p) => sum + p.price, 0) /
        processedProducts.length,
      averageRating:
        processedProducts.reduce((sum, p) => sum + p.rating, 0) /
        processedProducts.length,
      inStockCount: processedProducts.filter((p) => p.inStock).length,
    };
  }, [processedProducts]);

  return (
    <div>
      <div className="statistics">
        <p>Total: {statistics.totalProducts}</p>
        <p>Avg Price: ${statistics.averagePrice.toFixed(2)}</p>
        <p>Avg Rating: {statistics.averageRating.toFixed(1)}</p>
        <p>In Stock: {statistics.inStockCount}</p>
      </div>

      <div className="products">
        {processedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
```

### useCallback for Stable Function References

```typescript
interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

function TodoApp() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  // Stable function references using useCallback
  const addTodo = useCallback((text: string) => {
    const newTodo: TodoItem = {
      id: Date.now().toString(),
      text,
      completed: false,
    };
    setTodos((prev) => [...prev, newTodo]);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  }, []);

  // Memoized filtered todos
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case "active":
        return todos.filter((todo) => !todo.completed);
      case "completed":
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  return (
    <div>
      <TodoInput onAddTodo={addTodo} />
      <TodoList
        todos={filteredTodos}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
      />
      <TodoFilters
        currentFilter={filter}
        onFilterChange={setFilter}
        onClearCompleted={clearCompleted}
        hasCompleted={todos.some((todo) => todo.completed)}
      />
    </div>
  );
}

// Memoized child components
const TodoInput = React.memo<{ onAddTodo: (text: string) => void }>(
  ({ onAddTodo }) => {
    const [text, setText] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (text.trim()) {
        onAddTodo(text.trim());
        setText("");
      }
    };

    return (
      <form onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a todo..."
        />
        <button type="submit">Add</button>
      </form>
    );
  }
);

const TodoList = React.memo<{
  todos: TodoItem[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}>(({ todos, onToggle, onDelete }) => {
  return (
    <ul>
      {todos.map((todo) => (
        <TodoItemComponent
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
});

const TodoItemComponent = React.memo<{
  todo: TodoItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}>(({ todo, onToggle, onDelete }) => {
  return (
    <li>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span className={todo.completed ? "completed" : ""}>{todo.text}</span>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </li>
  );
});
```

## Code Splitting and Lazy Loading

### Component-Level Code Splitting

```typescript
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Lazy load components
const HomePage = lazy(() => import("../pages/HomePage"));
const ProductsPage = lazy(() => import("../pages/ProductsPage"));
const UserDashboard = lazy(() => import("../pages/UserDashboard"));
const AdminPanel = lazy(() =>
  import("../pages/AdminPanel").then((module) => ({
    default: module.AdminPanel,
  }))
);

// Dynamic import with error handling
const DynamicChart = lazy(() =>
  import("../components/Chart").catch(
    () => import("../components/ChartFallback")
  )
);

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <HomePage />
          </Suspense>
        }
      />
      <Route
        path="/products"
        element={
          <Suspense fallback={<div>Loading products...</div>}>
            <ProductsPage />
          </Suspense>
        }
      />
      <Route
        path="/dashboard"
        element={
          <Suspense fallback={<DashboardSkeleton />}>
            <UserDashboard />
          </Suspense>
        }
      />
      <Route
        path="/admin"
        element={
          <Suspense fallback={<AdminLoadingSkeleton />}>
            <AdminPanel />
          </Suspense>
        }
      />
    </Routes>
  );
}

// Advanced loading component with timeout
function LoadingSpinner({ timeout = 5000 }: { timeout?: number }) {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFallback(true);
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout]);

  if (showFallback) {
    return (
      <div>
        <p>Loading is taking longer than expected...</p>
        <button onClick={() => window.location.reload()}>Reload Page</button>
      </div>
    );
  }

  return <div>Loading...</div>;
}
```

### Conditional and Feature-Based Loading

```typescript
// Feature-based lazy loading
const AdvancedFeatures = lazy(() => {
  // Only load if user has premium features
  if (user.isPremium) {
    return import("../components/PremiumFeatures");
  }
  return Promise.resolve({
    default: () => <div>Upgrade to access premium features</div>,
  });
});

// Conditional component loading
function FeatureComponent() {
  const { user } = useAuth();
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div>
      <h2>Standard Features</h2>
      <StandardFeaturesList />

      {user.isPremium && (
        <button onClick={() => setShowAdvanced(!showAdvanced)}>
          {showAdvanced ? "Hide" : "Show"} Advanced Features
        </button>
      )}

      {showAdvanced && (
        <Suspense fallback={<div>Loading advanced features...</div>}>
          <AdvancedFeatures />
        </Suspense>
      )}
    </div>
  );
}

// Progressive loading pattern
function ProgressiveDataTable() {
  const [loadedChunks, setLoadedChunks] = useState(1);
  const [allData, setAllData] = useState([]);

  const loadMoreData = useCallback(async () => {
    const chunk = await import(`../data/chunk-${loadedChunks + 1}.json`);
    setAllData((prev) => [...prev, ...chunk.default]);
    setLoadedChunks((prev) => prev + 1);
  }, [loadedChunks]);

  return (
    <div>
      <DataTable data={allData} />
      <button onClick={loadMoreData}>Load More Data</button>
    </div>
  );
}
```

## Virtual Scrolling and Windowing

### React Window Implementation

```typescript
import { FixedSizeList as List, VariableSizeList } from "react-window";

interface VirtualListProps {
  items: any[];
  height: number;
  itemHeight: number;
}

const VirtualizedList: React.FC<VirtualListProps> = ({
  items,
  height,
  itemHeight,
}) => {
  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => (
    <div style={style}>
      <ItemComponent item={items[index]} />
    </div>
  );

  return (
    <List
      height={height}
      itemCount={items.length}
      itemSize={itemHeight}
      width="100%"
    >
      {Row}
    </List>
  );
};

// Variable size list for dynamic content
const VariableSizeVirtualList: React.FC<{ items: any[] }> = ({ items }) => {
  const listRef = useRef<VariableSizeList>(null);
  const [itemHeights, setItemHeights] = useState<Record<number, number>>({});

  const getItemSize = (index: number) => {
    return itemHeights[index] || 50; // Default height
  };

  const setItemHeight = (index: number, height: number) => {
    setItemHeights((prev) => ({ ...prev, [index]: height }));
    // Reset cache for updated item
    if (listRef.current) {
      listRef.current.resetAfterIndex(index);
    }
  };

  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => (
    <div style={style}>
      <MeasuredItem
        item={items[index]}
        index={index}
        onHeightChange={setItemHeight}
      />
    </div>
  );

  return (
    <VariableSizeList
      ref={listRef}
      height={600}
      itemCount={items.length}
      itemSize={getItemSize}
      width="100%"
    >
      {Row}
    </VariableSizeList>
  );
};

// Component that measures its own height
const MeasuredItem: React.FC<{
  item: any;
  index: number;
  onHeightChange: (index: number, height: number) => void;
}> = ({ item, index, onHeightChange }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const height = ref.current.getBoundingClientRect().height;
      onHeightChange(index, height);
    }
  }, [index, onHeightChange, item]);

  return (
    <div ref={ref}>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      {item.image && <img src={item.image} alt={item.title} />}
    </div>
  );
};
```

### Intersection Observer for Lazy Loading

```typescript
function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, options]);

  return isIntersecting;
}

// Lazy loading image component
const LazyImage: React.FC<{
  src: string;
  alt: string;
  placeholder?: string;
}> = ({ src, alt, placeholder = "/placeholder.jpg" }) => {
  const ref = useRef<HTMLImageElement>(null);
  const isVisible = useIntersectionObserver(ref, { threshold: 0.1 });
  const [loaded, setLoaded] = useState(false);

  return (
    <img
      ref={ref}
      src={isVisible ? src : placeholder}
      alt={alt}
      onLoad={() => setLoaded(true)}
      style={{
        opacity: loaded ? 1 : 0.5,
        transition: "opacity 0.3s",
      }}
    />
  );
};

// Infinite scroll implementation
function useInfiniteScroll(fetchMore: () => Promise<void>, hasMore: boolean) {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
          document.documentElement.offsetHeight ||
        isFetching ||
        !hasMore
      ) {
        return;
      }
      setIsFetching(true);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching, hasMore]);

  useEffect(() => {
    if (!isFetching) return;

    fetchMore().finally(() => {
      setIsFetching(false);
    });
  }, [isFetching, fetchMore]);

  return [isFetching, setIsFetching] as const;
}
```

## State Management Optimization

### State Normalization

```typescript
// Normalized state structure
interface NormalizedState {
  users: {
    byId: Record<string, User>;
    allIds: string[];
  };
  posts: {
    byId: Record<string, Post>;
    allIds: string[];
  };
  comments: {
    byId: Record<string, Comment>;
    allIds: string[];
  };
}

// Selectors for normalized data
const selectUser = (state: NormalizedState, userId: string) =>
  state.users.byId[userId];

const selectUserPosts = (state: NormalizedState, userId: string) =>
  state.posts.allIds
    .map((id) => state.posts.byId[id])
    .filter((post) => post.authorId === userId);

const selectPostWithComments = (state: NormalizedState, postId: string) => {
  const post = state.posts.byId[postId];
  const comments = post.commentIds.map((id) => state.comments.byId[id]);
  return { ...post, comments };
};

// Memoized selectors
const createUserPostsSelector = () => {
  return useMemo(
    () =>
      createSelector([selectUser, selectUserPosts], (user, posts) => ({
        user,
        posts,
      })),
    []
  );
};
```

### State Colocation and Lifting

```typescript
// State colocation - keep state close to where it's used
function TodoItem({ todo }: { todo: TodoItem }) {
  // Local state for editing
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSave = () => {
    // Update global state only when necessary
    updateTodo(todo.id, { text: editText });
    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <input
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />
      ) : (
        <span onClick={() => setIsEditing(true)}>{todo.text}</span>
      )}
    </div>
  );
}

// State lifting pattern with minimal re-renders
function OptimizedParent() {
  const [sharedState, setSharedState] = useState(null);

  // Split handlers to minimize re-renders
  const handleChildAUpdate = useCallback((data) => {
    setSharedState((prev) => ({ ...prev, childA: data }));
  }, []);

  const handleChildBUpdate = useCallback((data) => {
    setSharedState((prev) => ({ ...prev, childB: data }));
  }, []);

  return (
    <div>
      <ChildA data={sharedState?.childA} onUpdate={handleChildAUpdate} />
      <ChildB data={sharedState?.childB} onUpdate={handleChildBUpdate} />
    </div>
  );
}
```

## Bundle Optimization

### Tree Shaking and Import Optimization

```typescript
// ❌ Bad: Imports entire library
import _ from "lodash";
import * as R from "ramda";

// ✅ Good: Import only what you need
import { debounce } from "lodash";
import { pipe, filter, map } from "ramda";

// ✅ Better: Use specific imports
import debounce from "lodash/debounce";
import throttle from "lodash/throttle";

// Dynamic imports for large libraries
const loadChart = async () => {
  const { Chart } = await import("chart.js");
  return Chart;
};

// Conditional loading
const ChartComponent: React.FC<{ data: any[] }> = ({ data }) => {
  const [Chart, setChart] = useState<any>(null);

  useEffect(() => {
    if (data.length > 0) {
      loadChart().then(setChart);
    }
  }, [data]);

  if (!Chart || data.length === 0) {
    return <div>No chart data available</div>;
  }

  return <Chart data={data} />;
};

// Webpack magic comments for chunk naming
const AdminDashboard = lazy(
  () =>
    import(
      /* webpackChunkName: "admin-dashboard" */
      "../pages/AdminDashboard"
    )
);

const ReportsPage = lazy(
  () =>
    import(
      /* webpackChunkName: "reports" */
      /* webpackPreload: true */
      "../pages/ReportsPage"
    )
);
```

### Resource Preloading

```typescript
// Preload components based on user behavior
function usePreloadComponent(
  shouldPreload: boolean,
  importFn: () => Promise<any>
) {
  useEffect(() => {
    if (shouldPreload) {
      importFn().catch(console.error);
    }
  }, [shouldPreload, importFn]);
}

// Smart preloading based on route
function NavigationMenu() {
  const location = useLocation();
  const [hoveredRoute, setHoveredRoute] = useState<string | null>(null);

  // Preload route component on hover
  usePreloadComponent(
    hoveredRoute === "/dashboard",
    () => import("../pages/Dashboard")
  );

  usePreloadComponent(
    hoveredRoute === "/reports",
    () => import("../pages/Reports")
  );

  return (
    <nav>
      <Link
        to="/dashboard"
        onMouseEnter={() => setHoveredRoute("/dashboard")}
        onMouseLeave={() => setHoveredRoute(null)}
      >
        Dashboard
      </Link>
      <Link
        to="/reports"
        onMouseEnter={() => setHoveredRoute("/reports")}
        onMouseLeave={() => setHoveredRoute(null)}
      >
        Reports
      </Link>
    </nav>
  );
}

// Prefetch data on route hover
function usePrefetchQuery(
  key: string,
  queryFn: () => Promise<any>,
  enabled: boolean
) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (enabled) {
      queryClient.prefetchQuery({
        queryKey: [key],
        queryFn,
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
    }
  }, [enabled, key, queryFn, queryClient]);
}
```

## Rendering Optimization

### Virtualized Components

```typescript
// Custom virtualization for complex items
function useVirtualizer({
  items,
  containerHeight,
  itemHeight,
  overscan = 5,
}: {
  items: any[];
  containerHeight: number;
  itemHeight: number;
  overscan?: number;
}) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight),
    items.length - 1
  );

  const startIndex = Math.max(0, visibleStart - overscan);
  const endIndex = Math.min(items.length - 1, visibleEnd + overscan);

  const visibleItems = items
    .slice(startIndex, endIndex + 1)
    .map((item, index) => ({
      ...item,
      index: startIndex + index,
    }));

  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    onScroll: (e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    },
  };
}

// Usage
function VirtualizedTable({ data }: { data: any[] }) {
  const { visibleItems, totalHeight, offsetY, onScroll } = useVirtualizer({
    items: data,
    containerHeight: 400,
    itemHeight: 50,
  });

  return (
    <div style={{ height: 400, overflow: "auto" }} onScroll={onScroll}>
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
          {visibleItems.map((item) => (
            <TableRow key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
```

### Concurrent Features Optimization

```typescript
// Using React 18 concurrent features
function OptimizedApp() {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const deferredQuery = useDeferredValue(query);

  const handleSearch = (value: string) => {
    setQuery(value);

    // Mark expensive updates as non-urgent
    startTransition(() => {
      performExpensiveSearch(value);
    });
  };

  return (
    <div>
      <SearchInput value={query} onChange={handleSearch} loading={isPending} />

      {/* This will render with deferred value, allowing input to stay responsive */}
      <SearchResults query={deferredQuery} />
    </div>
  );
}

// Concurrent rendering with Suspense
function ConcurrentDataFetching() {
  return (
    <Suspense fallback={<GlobalSkeleton />}>
      <div>
        <Suspense fallback={<UserSkeleton />}>
          <UserProfile />
        </Suspense>

        <Suspense fallback={<PostsSkeleton />}>
          <UserPosts />
        </Suspense>

        <Suspense fallback={<CommentsSkeleton />}>
          <RecentComments />
        </Suspense>
      </div>
    </Suspense>
  );
}
```

## Performance Monitoring

### Performance Metrics Collection

```typescript
// Performance monitoring hook
function usePerformanceMonitor(componentName: string) {
  const renderStartTime = useRef<number>();
  const mountTime = useRef<number>();

  // Track component mount time
  useEffect(() => {
    mountTime.current = performance.now();

    return () => {
      if (mountTime.current) {
        const mountDuration = performance.now() - mountTime.current;
        console.log(`${componentName} was mounted for ${mountDuration}ms`);
      }
    };
  }, [componentName]);

  // Track render performance
  useEffect(() => {
    if (renderStartTime.current) {
      const renderDuration = performance.now() - renderStartTime.current;
      console.log(`${componentName} render took ${renderDuration}ms`);
    }
  });

  renderStartTime.current = performance.now();
}

// Memory usage monitoring
function useMemoryMonitor() {
  const [memoryInfo, setMemoryInfo] = useState<any>(null);

  useEffect(() => {
    const checkMemory = () => {
      if ("memory" in performance) {
        setMemoryInfo({
          used: Math.round(
            (performance as any).memory.usedJSHeapSize / 1048576
          ),
          total: Math.round(
            (performance as any).memory.totalJSHeapSize / 1048576
          ),
          limit: Math.round(
            (performance as any).memory.jsHeapSizeLimit / 1048576
          ),
        });
      }
    };

    checkMemory();
    const interval = setInterval(checkMemory, 5000);

    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
}

// Usage
function MonitoredComponent() {
  usePerformanceMonitor("MonitoredComponent");
  const memoryInfo = useMemoryMonitor();

  return (
    <div>
      <h2>Component Content</h2>
      {memoryInfo && (
        <div>
          Memory: {memoryInfo.used}MB / {memoryInfo.total}MB
        </div>
      )}
    </div>
  );
}
```

## Best Practices

### Performance Optimization Checklist

1. **Minimize Re-renders**

   - Use React.memo for pure components
   - Implement proper memoization with useMemo and useCallback
   - Avoid creating objects and functions in render

2. **Optimize Bundle Size**

   - Implement code splitting and lazy loading
   - Use tree shaking effectively
   - Analyze and optimize bundle sizes

3. **State Management**

   - Keep state close to where it's used
   - Normalize complex state structures
   - Use appropriate state management solutions

4. **Data Fetching**

   - Implement proper caching strategies
   - Use Suspense for data fetching
   - Preload data when possible

5. **Rendering Performance**
   - Use virtualization for large lists
   - Implement proper loading states
   - Optimize expensive calculations

## Interview Questions

### Basic Level

**Q: What is React.memo and when should you use it?**

A: React.memo is a higher-order component that memoizes the result of a component. Use it for pure functional components that receive the same props frequently to prevent unnecessary re-renders.

**Q: What's the difference between useMemo and useCallback?**

A: useMemo memoizes a computed value, while useCallback memoizes a function. Use useMemo for expensive calculations and useCallback to prevent function recreation that causes child re-renders.

**Q: How do you prevent unnecessary re-renders in React?**

A: Use React.memo, useMemo, useCallback, and proper state structure. Avoid creating objects/functions in render and keep state as local as possible.

### Intermediate Level

**Q: How do you implement code splitting in React?**

A: Use React.lazy() with dynamic imports and Suspense boundaries:

```typescript
const LazyComponent = lazy(() => import("./Component"));
<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>;
```

**Q: What are the benefits of state normalization?**

A: Normalized state prevents deep nesting, reduces duplication, makes updates easier, and improves performance by enabling better memoization and selective updates.

**Q: How do you optimize performance for large lists?**

A: Use virtualization/windowing techniques with libraries like react-window, implement pagination, or use intersection observers for lazy loading.

### Advanced Level

**Q: How do you measure and monitor React performance?**

A: Use React DevTools Profiler, implement custom performance monitoring hooks, measure Core Web Vitals, and set up performance budgets in your build process.

**Q: What are the trade-offs of different memoization strategies?**

A: Memoization uses memory to trade CPU time. Over-memoization can hurt performance. Consider the cost of comparison vs recomputation, and be careful with deep object comparisons.

**Q: How do you optimize React applications for mobile devices?**

A: Implement aggressive code splitting, use service workers for caching, optimize images, reduce JavaScript bundle sizes, use CSS containment, and implement proper touch interactions.
