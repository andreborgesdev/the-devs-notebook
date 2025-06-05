# SWR (Stale-While-Revalidate)

SWR is a data fetching library for React that implements the stale-while-revalidate strategy for optimal user experience.

## Installation and Setup

### Basic Installation

```bash
pnpm add swr
```

### Basic Configuration

```tsx
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function Profile() {
  const { data, error, isLoading } = useSWR("/api/user", fetcher);

  if (error) return <div>Failed to load</div>;
  if (isLoading) return <div>Loading...</div>;
  return <div>Hello {data.name}!</div>;
}
```

### Global Configuration

```tsx
import { SWRConfig } from "swr";

function App() {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) => fetch(url).then((res) => res.json()),
        refreshInterval: 3000,
        revalidateOnFocus: false,
        errorRetryCount: 3,
        errorRetryInterval: 5000,
      }}
    >
      <Profile />
    </SWRConfig>
  );
}
```

## Core Features

### Basic Data Fetching

```tsx
import useSWR from "swr";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

const api = axios.create({
  baseURL: "https://api.example.com",
});

const fetcher = (url: string) => api.get(url).then((res) => res.data);

function UserProfile({ userId }: { userId: string }) {
  const {
    data: user,
    error,
    isLoading,
    mutate,
  } = useSWR<User>(`/users/${userId}`, fetcher);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="user-profile">
      <img src={user.avatar} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <button onClick={() => mutate()}>Refresh</button>
    </div>
  );
}
```

### Conditional Fetching

```tsx
function UserPosts({ userId }: { userId?: string }) {
  const { data, error, isLoading } = useSWR(
    userId ? `/users/${userId}/posts` : null,
    fetcher
  );

  if (!userId) return <div>Select a user</div>;
  if (isLoading) return <div>Loading posts...</div>;
  if (error) return <div>Error loading posts</div>;

  return (
    <div>
      {data?.map((post: any) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

## Advanced Patterns

### Pagination

```tsx
interface PostsResponse {
  posts: Post[];
  hasMore: boolean;
  nextCursor?: string;
}

function usePaginatedPosts(limit = 10) {
  const [pages, setPages] = useState<string[]>([""]);

  const { data, error, isLoading, mutate } = useSWR(
    `/posts?limit=${limit}&cursor=${pages[pages.length - 1]}`,
    fetcher
  );

  const loadMore = useCallback(() => {
    if (data?.hasMore && data.nextCursor) {
      setPages((prev) => [...prev, data.nextCursor]);
    }
  }, [data]);

  const reset = useCallback(() => {
    setPages([""]);
    mutate();
  }, [mutate]);

  return {
    data,
    error,
    isLoading,
    loadMore,
    reset,
    hasMore: data?.hasMore || false,
  };
}

function PostsList() {
  const { data, error, isLoading, loadMore, hasMore } = usePaginatedPosts();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {hasMore && <button onClick={loadMore}>Load More</button>}
    </div>
  );
}
```

### Infinite Loading

```tsx
import useSWRInfinite from "swr/infinite";

function useInfinitePosts() {
  const getKey = (
    pageIndex: number,
    previousPageData: PostsResponse | null
  ) => {
    if (previousPageData && !previousPageData.hasMore) return null;

    if (pageIndex === 0) return "/posts?limit=10";
    return `/posts?limit=10&cursor=${previousPageData?.nextCursor}`;
  };

  const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(
    getKey,
    fetcher
  );

  const posts = data ? data.flatMap((page) => page.posts) : [];
  const isLoading = !error && !data;
  const isReachingEnd = data && !data[data.length - 1]?.hasMore;

  return {
    posts,
    error,
    isLoading,
    isValidating,
    loadMore: () => setSize(size + 1),
    refresh: () => mutate(),
    isReachingEnd,
  };
}

function InfinitePostsList() {
  const { posts, error, isLoading, isValidating, loadMore, isReachingEnd } =
    useInfinitePosts();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {!isReachingEnd && (
        <button onClick={loadMore} disabled={isValidating}>
          {isValidating ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}
```

### Local Mutations (Optimistic Updates)

```tsx
function useUpdateUser() {
  const { mutate } = useSWR("/api/user", fetcher);

  const updateUser = useCallback(
    async (updates: Partial<User>) => {
      try {
        await mutate(
          async (currentUser: User) => {
            const updated = { ...currentUser, ...updates };

            await api.patch("/api/user", updates);

            return updated;
          },
          {
            optimisticData: (currentUser: User) => ({
              ...currentUser,
              ...updates,
            }),
            rollbackOnError: true,
            populateCache: true,
            revalidate: false,
          }
        );
      } catch (error) {
        console.error("Failed to update user:", error);
        throw error;
      }
    },
    [mutate]
  );

  return { updateUser };
}

function UserSettings() {
  const { data: user, mutate } = useSWR("/api/user", fetcher);
  const { updateUser } = useUpdateUser();

  const handleNameChange = async (newName: string) => {
    try {
      await updateUser({ name: newName });
    } catch (error) {
      console.error("Update failed");
    }
  };

  return (
    <div>
      <input
        value={user?.name || ""}
        onChange={(e) => handleNameChange(e.target.value)}
        placeholder="User name"
      />
    </div>
  );
}
```

## TypeScript Integration

### Typed Hooks

```tsx
import useSWR, { KeyedMutator } from "swr";

interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

function useUser(userId: string): {
  user: User | undefined;
  isLoading: boolean;
  error: any;
  mutate: KeyedMutator<ApiResponse<User>>;
} {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<User>>(
    `/users/${userId}`,
    fetcher
  );

  return {
    user: data?.data,
    isLoading,
    error,
    mutate,
  };
}
```

### Generic SWR Hook

```tsx
function useApi<T>(
  key: string | null,
  options?: {
    refreshInterval?: number;
    revalidateOnFocus?: boolean;
  }
) {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<T>>(
    key,
    fetcher,
    options
  );

  return {
    data: data?.data,
    error,
    isLoading,
    mutate,
    refresh: () => mutate(),
  };
}

function useUsers() {
  return useApi<User[]>("/users");
}

function usePost(postId: string) {
  return useApi<Post>(`/posts/${postId}`);
}
```

## Error Handling

### Global Error Handler

```tsx
import { SWRConfig } from "swr";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        fetcher,
        onError: (error, key) => {
          if (error.status !== 403 && error.status !== 404) {
            console.error("SWR Error:", error, "Key:", key);

            toast.error("Something went wrong. Please try again.");
          }
        },
        onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
          if (error.status === 404) return;

          if (retryCount >= 10) return;

          setTimeout(() => revalidate({ retryCount }), 5000);
        },
      }}
    >
      <Component {...pageProps} />
    </SWRConfig>
  );
}
```

### Component-Level Error Handling

```tsx
function UserProfile({ userId }: { userId: string }) {
  const { data, error, isLoading, mutate } = useSWR(
    `/users/${userId}`,
    fetcher,
    {
      onError: (error) => {
        if (error.status === 404) {
          console.log("User not found");
        } else {
          console.error("Failed to load user:", error);
        }
      },
      shouldRetryOnError: (error) => {
        return error.status >= 500;
      },
      errorRetryCount: 3,
      errorRetryInterval: 1000,
    }
  );

  if (isLoading) return <div>Loading...</div>;

  if (error) {
    return (
      <div className="error">
        <p>Failed to load user</p>
        <button onClick={() => mutate()}>Retry</button>
      </div>
    );
  }

  return <div>User: {data.name}</div>;
}
```

## Performance Optimization

### Preloading

```tsx
import { preload } from "swr";

function UserCard({ userId }: { userId: string }) {
  const handleMouseEnter = () => {
    preload(`/users/${userId}`, fetcher);
  };

  return (
    <div onMouseEnter={handleMouseEnter}>
      <Link to={`/users/${userId}`}>View Profile</Link>
    </div>
  );
}
```

### Custom Cache

```tsx
import { Cache } from "swr";

function createCache(): Cache<any> {
  const map = new Map();

  return {
    get: (key) => map.get(key),
    set: (key, value) => map.set(key, value),
    delete: (key) => map.delete(key),
    clear: () => map.clear(),
  };
}

function App() {
  const cache = useMemo(() => createCache(), []);

  return (
    <SWRConfig value={{ provider: () => cache }}>
      <Router />
    </SWRConfig>
  );
}
```

### Focus Revalidation

```tsx
function useDocumentTitle(title: string) {
  const { data } = useSWR("document-title", () => title, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
  });

  useEffect(() => {
    if (data) {
      document.title = data;
    }
  }, [data]);
}
```

## Testing SWR

### Mock Setup

```tsx
import { renderHook } from "@testing-library/react";
import { SWRConfig } from "swr";

const mockFetcher = jest.fn();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SWRConfig value={{ fetcher: mockFetcher, provider: () => new Map() }}>
    {children}
  </SWRConfig>
);

describe("useUser", () => {
  beforeEach(() => {
    mockFetcher.mockClear();
  });

  it("should fetch user data", async () => {
    const mockUser = { id: "1", name: "John" };
    mockFetcher.mockResolvedValue(mockUser);

    const { result, waitForNextUpdate } = renderHook(() => useUser("1"), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isLoading).toBe(false);
  });

  it("should handle errors", async () => {
    const error = new Error("API Error");
    mockFetcher.mockRejectedValue(error);

    const { result, waitForNextUpdate } = renderHook(() => useUser("1"), {
      wrapper,
    });

    await waitForNextUpdate();

    expect(result.current.error).toEqual(error);
  });
});
```

### Integration Testing

```tsx
import { render, screen, waitFor } from "@testing-library/react";
import { SWRConfig } from "swr";
import { server } from "./mocks/server";

function TestWrapper({ children }: { children: React.ReactNode }) {
  return <SWRConfig value={{ dedupingInterval: 0 }}>{children}</SWRConfig>;
}

describe("UserProfile", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("displays user information", async () => {
    render(<UserProfile userId="1" />, { wrapper: TestWrapper });

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
  });
});
```

## SWR vs React Query Comparison

| Feature            | SWR            | React Query    |
| ------------------ | -------------- | -------------- |
| Bundle Size        | Smaller (~4KB) | Larger (~12KB) |
| Learning Curve     | Simpler        | More features  |
| TypeScript         | Good           | Excellent      |
| Mutations          | Basic          | Advanced       |
| DevTools           | Basic          | Rich DevTools  |
| Offline Support    | Basic          | Advanced       |
| Background Updates | Yes            | Yes            |
| Cache Management   | Simple         | Advanced       |

## Custom Hooks Examples

### Authentication Hook

```tsx
function useAuth() {
  const { data: user, error, mutate } = useSWR("/api/me", fetcher);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const response = await api.post("/auth/login", credentials);
      await mutate(response.data.user);
      return response.data;
    },
    [mutate]
  );

  const logout = useCallback(async () => {
    await api.post("/auth/logout");
    await mutate(null);
  }, [mutate]);

  return {
    user,
    isLoading: !error && !user,
    isError: error,
    login,
    logout,
  };
}
```

### Search Hook

```tsx
function useSearch<T>(searchTerm: string, endpoint: string, debounceMs = 300) {
  const debouncedSearch = useDebounce(searchTerm, debounceMs);

  const { data, error, isLoading } = useSWR<T[]>(
    debouncedSearch ? `${endpoint}?q=${debouncedSearch}` : null,
    fetcher
  );

  return {
    results: data || [],
    isLoading,
    error,
    hasResults: Boolean(data?.length),
  };
}

function SearchComponent() {
  const [query, setQuery] = useState("");
  const { results, isLoading } = useSearch(query, "/api/search");

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />

      {isLoading && <div>Searching...</div>}

      {results.map((item) => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
}
```

## Best Practices

### Key Management

```tsx
const swrKeys = {
  user: (id: string) => ["user", id],
  posts: (filters: PostFilters) => ["posts", filters],
  search: (query: string) => ["search", query],
} as const;

function useUser(id: string) {
  return useSWR(swrKeys.user(id), fetcher);
}
```

### Error Boundaries

```tsx
class SWRErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("SWR Error Boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong with data fetching.</div>;
    }

    return this.props.children;
  }
}
```

### Resource Cleanup

```tsx
function useCleanupOnUnmount() {
  const { mutate } = useSWRConfig();

  useEffect(() => {
    return () => {
      mutate(() => true, undefined, { revalidate: false });
    };
  }, [mutate]);
}
```

## Interview Questions

**Q: What is SWR and how does it differ from useState for data fetching?**
A: SWR is a data fetching library that implements stale-while-revalidate strategy. Unlike useState, it provides caching, automatic revalidation, error handling, and optimistic updates out of the box.

**Q: Explain the stale-while-revalidate strategy.**
A: It returns cached data first (stale), then fetches fresh data in the background (revalidate), and updates the UI when new data arrives.

**Q: How does SWR handle cache invalidation?**
A: Through automatic revalidation on focus, reconnect, and interval. Manual invalidation via mutate() function, and automatic cache deduplication.

**Q: What are the benefits of using SWR over React Query?**
A: Smaller bundle size, simpler API, built-in TypeScript support, and easier learning curve for basic use cases.

**Q: How do you implement optimistic updates with SWR?**
A: Use mutate() with optimisticData option to immediately update UI, and rollbackOnError to revert changes if the request fails.

**Q: What is the difference between useSWR and useSWRInfinite?**
A: useSWR is for simple data fetching, while useSWRInfinite is for pagination and infinite loading scenarios with dynamic keys.
