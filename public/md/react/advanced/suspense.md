# React Suspense and Concurrent Features

React Suspense is a powerful feature that allows components to suspend rendering while waiting for asynchronous operations to complete. Combined with React 18's concurrent features, it enables building more responsive and user-friendly applications.

## Understanding Suspense

Suspense lets components declare that they're waiting for some data or resource before they can render, showing a fallback UI in the meantime.

### Basic Suspense Usage

```typescript
import React, { Suspense, lazy } from "react";

const LazyComponent = lazy(() => import("./LazyComponent"));

const BasicSuspenseExample = () => {
  const [showComponent, setShowComponent] = useState(false);

  return (
    <div>
      <button onClick={() => setShowComponent(!showComponent)}>
        {showComponent ? "Hide" : "Show"} Component
      </button>

      {showComponent && (
        <Suspense
          fallback={<div className="loading">Loading component...</div>}
        >
          <LazyComponent />
        </Suspense>
      )}
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>Loading...</p>
  </div>
);

const AdvancedSuspenseExample = () => {
  return (
    <div className="app">
      <header>
        <h1>My App</h1>
      </header>

      <main>
        <Suspense fallback={<LoadingSpinner />}>
          <UserDashboard />
        </Suspense>
      </main>
    </div>
  );
};
```

### Nested Suspense Boundaries

```typescript
const NestedSuspenseExample = () => {
  return (
    <div className="dashboard">
      <Suspense fallback={<div>Loading dashboard...</div>}>
        <DashboardHeader />

        <div className="dashboard-content">
          <Suspense fallback={<div>Loading sidebar...</div>}>
            <Sidebar />
          </Suspense>

          <main className="main-content">
            <Suspense fallback={<div>Loading main content...</div>}>
              <MainContent />

              <Suspense fallback={<div>Loading chart...</div>}>
                <Chart />
              </Suspense>
            </Suspense>
          </main>
        </div>
      </Suspense>
    </div>
  );
};

const Chart = lazy(() =>
  import("./Chart").then((module) => ({
    default: module.Chart,
  }))
);

const MainContent = () => {
  return (
    <div>
      <h2>Main Content</h2>
      <p>This loads first...</p>

      {/* Chart will load independently */}
      <div className="chart-container">
        <Chart />
      </div>
    </div>
  );
};
```

## Data Fetching with Suspense

### Creating Suspense-compatible Resources

```typescript
interface CacheEntry<T> {
  status: 'pending' | 'fulfilled' | 'rejected';
  value?: T;
  error?: Error;
  promise?: Promise<T>;
}

class SuspenseCache {
  private cache = new Map<string, CacheEntry<any>>();

  createResource<T>(key: string, fetcher: () => Promise<T>) {
    if (!this.cache.has(key)) {
      this.cache.set(key, { status: 'pending' });

      const promise = fetcher()
        .then(data => {
          const entry = this.cache.get(key)!;
          entry.status = 'fulfilled';
          entry.value = data;
          return data;
        })
        .catch(error => {
          const entry = this.cache.get(key)!;
          entry.status = 'rejected';
          entry.error = error;
          throw error;
        });

      this.cache.get(key)!.promise = promise;
    }

    const entry = this.cache.get(key)!;

    switch (entry.status) {
      case 'pending':
        throw entry.promise;
      case 'rejected':
        throw entry.error;
      case 'fulfilled':
        return entry.value;
    }
  }

  invalidate(key: string) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }
}

const suspenseCache = new SuspenseCache();

// Custom hook for data fetching with Suspense
const useSuspenseQuery = <T>(key: string, fetcher: () => Promise<T>): T => {
  return suspenseCache.createResource(key, fetcher);
};

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

const UserProfile = ({ userId }: { userId: number }) => {
  const user = useSuspenseQuery<User>(
    `user-${userId}`,
    () => fetch(`/api/users/${userId}`).then(res => res.json())
  );

  return (
    <div className="user-profile">
      <img src={user.avatar} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
};

const UserProfileWithSuspense = ({ userId }: { userId: number }) => {
  return (
    <Suspense
      fallback={
        <div className="user-profile-skeleton">
          <div className="skeleton-avatar"></div>
          <div className="skeleton-name"></div>
          <div className="skeleton-email"></div>
        </div>
      }
    >
      <UserProfile userId={userId} />
    </Suspense>
  );
};
```

### Advanced Data Fetching Patterns

```typescript
interface PostsResponse {
  posts: Post[];
  totalCount: number;
}

interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
}

const useParallelSuspenseQueries = () => {
  // These will fetch in parallel and each can suspend independently
  const user = useSuspenseQuery<User>("current-user", () =>
    fetch("/api/user").then((res) => res.json())
  );

  const posts = useSuspenseQuery<PostsResponse>("user-posts", () =>
    fetch("/api/posts").then((res) => res.json())
  );

  return { user, posts };
};

const UserDashboard = () => {
  const { user, posts } = useParallelSuspenseQueries();

  return (
    <div className="user-dashboard">
      <header>
        <h1>Welcome, {user.name}!</h1>
      </header>

      <main>
        <h2>Your Posts ({posts.totalCount})</h2>
        <div className="posts-grid">
          {posts.posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </main>
    </div>
  );
};

// Waterfall vs Parallel data fetching
const WaterfallExample = () => {
  return (
    <Suspense fallback={<div>Loading user...</div>}>
      <UserInfo />
      <Suspense fallback={<div>Loading posts...</div>}>
        <UserPosts />
      </Suspense>
    </Suspense>
  );
};

const ParallelExample = () => {
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <UserDashboard /> {/* Both user and posts fetch in parallel */}
    </Suspense>
  );
};
```

## React 18 Concurrent Features

### Concurrent Rendering and useTransition

```typescript
import { useTransition, useDeferredValue, startTransition } from "react";

interface SearchResultsProps {
  query: string;
}

const SearchResults = ({ query }: SearchResultsProps) => {
  const results = useSuspenseQuery<SearchResult[]>(`search-${query}`, () =>
    fetch(`/api/search?q=${encodeURIComponent(query)}`).then((res) =>
      res.json()
    )
  );

  return (
    <div className="search-results">
      <h3>
        Results for "{query}" ({results.length})
      </h3>
      <ul>
        {results.map((result) => (
          <li key={result.id}>
            <h4>{result.title}</h4>
            <p>{result.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

const SearchWithTransition = () => {
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark the search as a non-urgent update
    startTransition(() => {
      setSearchQuery(query);
    });
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
        />
        <button type="submit" disabled={isPending}>
          {isPending ? "Searching..." : "Search"}
        </button>
      </form>

      {searchQuery && (
        <Suspense
          fallback={
            <div className="search-loading">
              <div className="spinner"></div>
              <p>Searching for "{searchQuery}"...</p>
            </div>
          }
        >
          <SearchResults query={searchQuery} />
        </Suspense>
      )}
    </div>
  );
};
```

### useDeferredValue for Performance

```typescript
const DeferredSearchExample = () => {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [isPending, startTransition] = useTransition();

  // The input updates immediately, search updates with lower priority
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Type to search..."
      />

      <div className={isPending ? "opacity-50 transition-opacity" : ""}>
        {deferredQuery && (
          <Suspense fallback={<SearchSkeleton />}>
            <SearchResults query={deferredQuery} />
          </Suspense>
        )}
      </div>
    </div>
  );
};

const SearchSkeleton = () => (
  <div className="search-skeleton">
    {Array.from({ length: 5 }, (_, i) => (
      <div key={i} className="skeleton-item">
        <div className="skeleton-title"></div>
        <div className="skeleton-description"></div>
      </div>
    ))}
  </div>
);
```

### Streaming and Selective Hydration

```typescript
// Server-side streaming setup (Next.js example)
const StreamingPage = () => {
  return (
    <div>
      <header>
        <h1>My App</h1>
      </header>

      <main>
        {/* This content renders immediately */}
        <section className="above-fold">
          <h2>Welcome!</h2>
          <p>This content loads first...</p>
        </section>

        {/* This content streams in as it becomes ready */}
        <Suspense fallback={<UserProfileSkeleton />}>
          <UserProfileSection />
        </Suspense>

        <Suspense fallback={<RecommendationsSkeleton />}>
          <RecommendationsSection />
        </Suspense>

        {/* Heavy component that hydrates independently */}
        <Suspense fallback={<ChartSkeleton />}>
          <InteractiveChart />
        </Suspense>
      </main>
    </div>
  );
};

// Client-side selective hydration
const InteractiveChart = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const chartData = useSuspenseQuery("chart-data", fetchChartData);

  useEffect(() => {
    // Heavy chart library only loads on client
    import("chart.js").then(() => {
      setIsHydrated(true);
    });
  }, []);

  if (!isHydrated) {
    return <ChartSkeleton />;
  }

  return <Chart data={chartData} />;
};
```

## Error Boundaries with Suspense

### Advanced Error Handling

```typescript
interface SuspenseErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

class SuspenseErrorBoundary extends React.Component<
  {
    children: React.ReactNode;
    fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  },
  SuspenseErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): SuspenseErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error!} retry={this.retry} />;
    }

    return this.props.children;
  }
}

const DefaultErrorFallback = ({
  error,
  retry,
}: {
  error: Error;
  retry: () => void;
}) => (
  <div className="error-boundary">
    <h2>Something went wrong</h2>
    <p>{error.message}</p>
    <button onClick={retry}>Try Again</button>
  </div>
);

const RobustSuspenseComponent = () => {
  return (
    <SuspenseErrorBoundary
      fallback={({ error, retry }) => (
        <div className="custom-error">
          <h3>Failed to load content</h3>
          <p>Error: {error.message}</p>
          <button onClick={retry}>Retry</button>
        </div>
      )}
      onError={(error, errorInfo) => {
        console.error("Suspense error:", error, errorInfo);
        // Send to error reporting service
      }}
    >
      <Suspense fallback={<ContentSkeleton />}>
        <RiskyComponent />
      </Suspense>
    </SuspenseErrorBoundary>
  );
};
```

### Graceful Degradation

```typescript
const useErrorRecovery = () => {
  const [retryCount, setRetryCount] = useState(0);
  const [shouldFallback, setShouldFallback] = useState(false);

  const retry = useCallback(() => {
    if (retryCount < 3) {
      setRetryCount((prev) => prev + 1);
      setShouldFallback(false);
    } else {
      setShouldFallback(true);
    }
  }, [retryCount]);

  return { retryCount, shouldFallback, retry };
};

const GracefulDegradationExample = () => {
  const { retryCount, shouldFallback, retry } = useErrorRecovery();

  if (shouldFallback) {
    return <StaticFallbackContent />;
  }

  return (
    <SuspenseErrorBoundary
      key={retryCount} // Force remount on retry
      fallback={({ error, retry: boundaryRetry }) => (
        <div className="error-with-retry">
          <p>Failed to load. Attempt {retryCount + 1}/3</p>
          <button
            onClick={() => {
              boundaryRetry();
              retry();
            }}
          >
            Retry
          </button>
          {retryCount >= 2 && (
            <button onClick={() => setShouldFallback(true)}>
              Use Basic Version
            </button>
          )}
        </div>
      )}
    >
      <Suspense fallback={<LoadingSkeleton />}>
        <DynamicContent />
      </Suspense>
    </SuspenseErrorBoundary>
  );
};

const StaticFallbackContent = () => (
  <div className="static-content">
    <h2>Basic Content</h2>
    <p>This is a simplified version of the content.</p>
  </div>
);
```

## Performance Optimization

### Optimizing Suspense Boundaries

```typescript
// ❌ Poor: Too many small suspense boundaries
const OverSuspendedComponent = () => (
  <div>
    <Suspense fallback={<div>Loading header...</div>}>
      <Header />
    </Suspense>
    <Suspense fallback={<div>Loading nav...</div>}>
      <Navigation />
    </Suspense>
    <Suspense fallback={<div>Loading content...</div>}>
      <Content />
    </Suspense>
  </div>
);

// ✅ Better: Strategic suspense boundaries
const OptimizedSuspenseComponent = () => (
  <div>
    {/* Critical above-the-fold content loads together */}
    <Suspense fallback={<PageSkeleton />}>
      <Header />
      <Navigation />
      <MainContent />
    </Suspense>

    {/* Non-critical content can suspend separately */}
    <Suspense fallback={<SidebarSkeleton />}>
      <Sidebar />
    </Suspense>
  </div>
);

// Smart suspense with priority
const PrioritizedSuspense = () => {
  const [showSecondary, setShowSecondary] = useState(false);

  useEffect(() => {
    // Show secondary content after primary loads
    const timer = setTimeout(() => setShowSecondary(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <Suspense fallback={<PrimarySkeleton />}>
        <PrimaryContent />
      </Suspense>

      {showSecondary && (
        <Suspense fallback={<SecondarySkeleton />}>
          <SecondaryContent />
        </Suspense>
      )}
    </div>
  );
};
```

### Memory Management

```typescript
const SuspenseCacheManager = () => {
  useEffect(() => {
    // Clean up cache periodically
    const interval = setInterval(() => {
      suspenseCache.clear();
    }, 5 * 60 * 1000); // Clear every 5 minutes

    return () => clearInterval(interval);
  }, []);

  // Clean up on route changes
  const location = useLocation();
  useEffect(() => {
    // Keep only current route data
    suspenseCache.invalidate("old-route-data");
  }, [location]);

  return null;
};

// Memory-efficient resource management
const useMemoryEfficientResource = <T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 5 * 60 * 1000 // 5 minutes
) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      suspenseCache.invalidate(key);
    }, ttl);

    return () => clearTimeout(timer);
  }, [key, ttl]);

  return useSuspenseQuery(key, fetcher);
};
```

## Testing Suspense Components

### Testing Strategies

```typescript
import { render, screen, waitFor } from "@testing-library/react";
import { Suspense } from "react";

// Mock async dependencies
const mockFetch = jest.fn();
global.fetch = mockFetch;

const TestSuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<div data-testid="loading">Loading...</div>}>
    {children}
  </Suspense>
);

describe("Suspense Components", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it("should show loading state while component is suspended", () => {
    mockFetch.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    render(
      <TestSuspenseWrapper>
        <AsyncComponent />
      </TestSuspenseWrapper>
    );

    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("should render component after data loads", async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ name: "Test User" }),
    });

    render(
      <TestSuspenseWrapper>
        <AsyncComponent />
      </TestSuspenseWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Test User")).toBeInTheDocument();
    });

    expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
  });

  it("should handle errors gracefully", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    render(
      <SuspenseErrorBoundary>
        <TestSuspenseWrapper>
          <AsyncComponent />
        </TestSuspenseWrapper>
      </SuspenseErrorBoundary>
    );

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });
});

// Testing concurrent features
describe("Concurrent Features", () => {
  it("should handle transitions properly", async () => {
    const user = userEvent.setup();

    render(<SearchWithTransition />);

    const input = screen.getByPlaceholderText("Search...");
    const button = screen.getByText("Search");

    await user.type(input, "test query");
    await user.click(button);

    expect(button).toHaveTextContent("Searching...");

    await waitFor(() => {
      expect(button).toHaveTextContent("Search");
    });
  });
});
```

## React 18 Suspense Enhancements

### Concurrent Suspense

React 18 integrates Suspense with concurrent features for better performance:

```tsx
import { useTransition, Suspense } from "react";

function ConcurrentSuspenseDemo() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState("posts");

  const switchTab = (newTab) => {
    startTransition(() => {
      setTab(newTab);
    });
  };

  return (
    <div>
      <div className="tabs">
        {["posts", "comments", "about"].map((tabName) => (
          <button
            key={tabName}
            onClick={() => switchTab(tabName)}
            className={tab === tabName ? "active" : ""}
          >
            {tabName}
          </button>
        ))}
      </div>

      {isPending && <div>Switching tabs...</div>}

      <Suspense fallback={<TabContentSkeleton />}>
        <TabContent tab={tab} />
      </Suspense>
    </div>
  );
}
```

### Streaming SSR

React 18 enables streaming server-side rendering with Suspense:

```tsx
// Server-side
import { renderToPipeableStream } from "react-dom/server";

function ServerApp() {
  return (
    <html>
      <head>
        <title>Streaming SSR App</title>
      </head>
      <body>
        <div id="root">
          <Suspense fallback={<HeaderSkeleton />}>
            <Header />
          </Suspense>

          <main>
            <Suspense fallback={<div>Loading content...</div>}>
              <AsyncContent />
            </Suspense>
          </main>
        </div>
      </body>
    </html>
  );
}

const { pipe } = renderToPipeableStream(<ServerApp />, {
  bootstrapScripts: ["/client.js"],
  onShellReady() {
    response.setHeader("content-type", "text/html");
    pipe(response);
  },
});
```

### Suspense with useDeferredValue

```tsx
function SearchWithSuspense() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />

      <Suspense fallback={<SearchSkeleton />}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </div>
  );
}

function SearchResults({ query }) {
  if (!query) return <div>Enter a search term</div>;

  // This will suspend when query changes
  const results = use(searchAPI(query));

  return (
    <ul>
      {results.map((result) => (
        <li key={result.id}>{result.title}</li>
      ))}
    </ul>
  );
}
```

### Selective Hydration

React 18 enables selective hydration with Suspense boundaries:

```tsx
function App() {
  return (
    <div>
      <header>
        <h1>My App</h1>
      </header>

      {/* This can hydrate independently */}
      <Suspense fallback={<SidebarSkeleton />}>
        <Sidebar />
      </Suspense>

      {/* This can hydrate independently */}
      <Suspense fallback={<MainContentSkeleton />}>
        <MainContent />
      </Suspense>

      {/* This can hydrate independently */}
      <Suspense fallback={<CommentsLoader />}>
        <Comments />
      </Suspense>
    </div>
  );
}
```

### Advanced Error Boundaries with Suspense

```tsx
function SuspenseWithErrorBoundary() {
  return (
    <ErrorBoundary
      fallback={({ error, reset }) => (
        <div>
          <h2>Something went wrong:</h2>
          <p>{error.message}</p>
          <button onClick={reset}>Try again</button>
        </div>
      )}
    >
      <Suspense fallback={<LoadingSpinner />}>
        <AsyncDataComponent />
      </Suspense>
    </ErrorBoundary>
  );
}
```

### Modern Data Fetching Patterns

```tsx
// Using the experimental `use` hook
function ModernDataFetching() {
  const [userId, setUserId] = useState(1);

  return (
    <div>
      <UserSelector value={userId} onChange={setUserId} />

      <Suspense fallback={<UserProfileSkeleton />}>
        <UserProfile userId={userId} />
      </Suspense>
    </div>
  );
}

function UserProfile({ userId }) {
  // `use` automatically handles suspense
  const user = use(fetchUser(userId));
  const posts = use(fetchUserPosts(userId));

  return (
    <div>
      <h2>{user.name}</h2>
      <div>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
```

## Best Practices for Modern Suspense

### Progressive Loading

```tsx
function ProgressiveApp() {
  return (
    <div>
      {/* Critical content loads first */}
      <header>
        <h1>My App</h1>
      </header>

      {/* Secondary content can suspend */}
      <Suspense fallback={<NavSkeleton />}>
        <Navigation />
      </Suspense>

      {/* Main content loads after navigation */}
      <Suspense fallback={<MainContentSkeleton />}>
        <MainContent />

        {/* Tertiary content loads last */}
        <Suspense fallback={<SidebarSkeleton />}>
          <Sidebar />
        </Suspense>
      </Suspense>
    </div>
  );
}
```

### Smart Loading States

```tsx
function SmartLoadingStates() {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div>
      <Suspense
        fallback={
          <ContentSkeleton
            showAdvanced={showAdvanced}
            onToggle={() => setShowAdvanced(!showAdvanced)}
          />
        }
      >
        <Content showAdvanced={showAdvanced} />
      </Suspense>
    </div>
  );
}

function ContentSkeleton({ showAdvanced, onToggle }) {
  return (
    <div className="skeleton">
      <div className="skeleton-header" />
      <div className="skeleton-content" />

      <button onClick={onToggle}>
        {showAdvanced ? "Show Less" : "Show More"} (while loading)
      </button>

      {showAdvanced && (
        <div className="skeleton-advanced">
          <div className="skeleton-line" />
          <div className="skeleton-line" />
        </div>
      )}
    </div>
  );
}
```

## Common Interview Questions

### Basic Questions

**Q: What is React Suspense and what problem does it solve?**

Suspense is a React feature that lets components declare that they're waiting for some data before rendering. It solves the problem of coordinating loading states across an application by letting you declaratively specify loading UI at any level of the component tree.

**Q: How does Suspense work with React.lazy?**

Suspense catches the promise thrown by lazy components and shows the fallback UI while the component bundle loads:

```typescript
const LazyComponent = React.lazy(() => import("./Component"));

<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>;
```

**Q: What's the difference between Suspense and regular loading states?**

- Suspense is declarative and works with any async operation that "suspends"
- Regular loading states require manual state management
- Suspense can handle multiple async operations at once
- Suspense enables streaming and selective hydration

### Intermediate Questions

**Q: How do you create a Suspense-compatible data fetching library?**

You need to throw a promise when data is loading:

```typescript
const createResource = (fetcher) => {
  let status = "pending";
  let result;

  const promise = fetcher().then(
    (data) => {
      status = "success";
      result = data;
    },
    (error) => {
      status = "error";
      result = error;
    }
  );

  return () => {
    if (status === "pending") throw promise;
    if (status === "error") throw result;
    return result;
  };
};
```

**Q: What are React 18's concurrent features and how do they relate to Suspense?**

- **useTransition**: Mark updates as non-urgent, allowing React to interrupt them
- **useDeferredValue**: Defer expensive updates while keeping UI responsive
- **Streaming**: Send HTML progressively as components become ready
- **Selective Hydration**: Hydrate interactive components as needed

**Q: How do you handle errors in Suspense components?**

Use Error Boundaries to catch errors from suspended components:

```typescript
<ErrorBoundary fallback={<ErrorUI />}>
  <Suspense fallback={<Loading />}>
    <AsyncComponent />
  </Suspense>
</ErrorBoundary>
```

### Advanced Questions

**Q: How do you optimize Suspense boundaries for performance?**

- Group related components that load together
- Avoid too many small suspense boundaries
- Use meaningful, content-aware loading states
- Implement proper cache invalidation strategies
- Consider critical vs non-critical content placement

**Q: What's the difference between streaming and traditional SSR?**

- Traditional SSR: Server renders complete HTML, then hydrates everything
- Streaming SSR: Server sends HTML progressively as components become ready
- Selective hydration: Interactive components hydrate independently as needed
- Better Time to First Byte (TTFB) and perceived performance

**Q: How do you test components that use Suspense?**

- Mock async dependencies
- Test loading states appear correctly
- Test successful data loading
- Test error scenarios
- Use `waitFor` to handle async state changes
- Test concurrent features like transitions

**Q: What are the limitations of Suspense?**

- Only works with specific patterns (lazy components, suspense-compatible libraries)
- Requires careful boundary placement for optimal UX
- Can be complex to debug when things go wrong
- Not all third-party libraries support it yet
- SSR streaming requires specific server setup

Suspense and concurrent features represent a paradigm shift toward more responsive and user-friendly React applications, enabling sophisticated loading patterns and better performance characteristics.
