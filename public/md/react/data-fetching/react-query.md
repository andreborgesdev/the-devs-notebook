# React Query (TanStack Query)

React Query is a powerful data synchronization library that simplifies server state management in React applications.

## Installation and Setup

### Basic Installation

```bash
pnpm add @tanstack/react-query
pnpm add @tanstack/react-query-devtools
```

### Query Client Setup

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/users" element={<UsersPage />} />
        </Routes>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

## Basic Queries

### Simple Data Fetching

```tsx
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

async function fetchUser(userId: string): Promise<User> {
  const response = await api.get(`/users/${userId}`);
  return response.data;
}

function UserProfile({ userId }: { userId: string }) {
  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId,
  });

  if (isLoading) {
    return <div className="spinner">Loading user...</div>;
  }

  if (isError) {
    return (
      <div className="error">
        <p>Error: {error.message}</p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="user-profile">
      <img src={user.avatar} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

### Query with Parameters

```tsx
interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
}

interface PostsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

async function fetchPosts(params: PostsParams): Promise<{
  posts: Post[];
  total: number;
  page: number;
  totalPages: number;
}> {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.set(key, String(value));
    }
  });

  const response = await api.get(`/posts?${searchParams}`);
  return response.data;
}

function PostsList() {
  const [filters, setFilters] = useState<PostsParams>({
    page: 1,
    limit: 10,
  });

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["posts", filters],
    queryFn: () => fetchPosts(filters),
    keepPreviousData: true, // Keep old data while fetching new
  });

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  };

  if (isLoading) {
    return <div>Loading posts...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="posts-list">
      <SearchInput onSearch={handleSearch} />

      {isFetching && <div className="loading-indicator">Updating...</div>}

      <div className="posts">
        {data.posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <Pagination
        current={data.page}
        total={data.totalPages}
        onChange={handlePageChange}
      />
    </div>
  );
}
```

## Advanced Query Patterns

### Parallel Queries

```tsx
function UserDashboard({ userId }: { userId: string }) {
  const userQuery = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId),
  });

  const postsQuery = useQuery({
    queryKey: ["posts", "user", userId],
    queryFn: () => fetchUserPosts(userId),
    enabled: !!userId,
  });

  const statsQuery = useQuery({
    queryKey: ["stats", userId],
    queryFn: () => fetchUserStats(userId),
    enabled: !!userId,
  });

  const isLoading =
    userQuery.isLoading || postsQuery.isLoading || statsQuery.isLoading;
  const hasError =
    userQuery.isError || postsQuery.isError || statsQuery.isError;

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  if (hasError) {
    return <div>Error loading dashboard</div>;
  }

  return (
    <div className="dashboard">
      <UserHeader user={userQuery.data} />
      <StatsPanel stats={statsQuery.data} />
      <PostsList posts={postsQuery.data} />
    </div>
  );
}
```

### Dependent Queries

```tsx
function UserPosts({ userId }: { userId: string }) {
  const userQuery = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId),
  });

  const postsQuery = useQuery({
    queryKey: ["posts", "user", userId],
    queryFn: () => fetchUserPosts(userId),
    enabled: !!userQuery.data?.id,
  });

  const commentsQuery = useQuery({
    queryKey: ["comments", "posts", postsQuery.data?.map((p) => p.id)],
    queryFn: () =>
      fetchCommentsForPosts(postsQuery.data?.map((p) => p.id) || []),
    enabled: !!postsQuery.data && postsQuery.data.length > 0,
  });

  return (
    <div>
      {userQuery.isLoading && <div>Loading user...</div>}
      {postsQuery.isLoading && <div>Loading posts...</div>}
      {commentsQuery.isLoading && <div>Loading comments...</div>}

      {postsQuery.data?.map((post) => (
        <PostWithComments
          key={post.id}
          post={post}
          comments={commentsQuery.data?.[post.id] || []}
        />
      ))}
    </div>
  );
}
```

### Infinite Queries

```tsx
interface PostsPage {
  posts: Post[];
  nextCursor?: string;
  hasNextPage: boolean;
}

async function fetchPostsPage({
  pageParam = undefined,
}: {
  pageParam?: string;
}): Promise<PostsPage> {
  const params = new URLSearchParams();
  if (pageParam) {
    params.set("cursor", pageParam);
  }
  params.set("limit", "10");

  const response = await api.get(`/posts?${params}`);
  return response.data;
}

function InfinitePostsList() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["posts", "infinite"],
    queryFn: fetchPostsPage,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined,
  });

  const allPosts = data?.pages.flatMap((page) => page.posts) ?? [];

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "error") {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <div className="posts">
        {allPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <div className="load-more">
        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
            ? "Load More"
            : "Nothing more to load"}
        </button>
      </div>

      {isFetching && !isFetchingNextPage && <div>Background updating...</div>}
    </div>
  );
}
```

## Mutations

### Basic Mutations

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreatePostData {
  title: string;
  content: string;
  categoryId: string;
}

async function createPost(data: CreatePostData): Promise<Post> {
  const response = await api.post("/posts", data);
  return response.data;
}

function CreatePostForm() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: (newPost) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      queryClient.setQueryData(["post", newPost.id], newPost);

      toast.success("Post created successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to create post: ${error.message}`);
    },
  });

  const handleSubmit = (formData: CreatePostData) => {
    mutation.mutate(formData);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        handleSubmit({
          title: formData.get("title") as string,
          content: formData.get("content") as string,
          categoryId: formData.get("categoryId") as string,
        });
      }}
    >
      <input name="title" placeholder="Post title" required />
      <textarea name="content" placeholder="Post content" required />
      <select name="categoryId" required>
        <option value="">Select category</option>
        <option value="tech">Technology</option>
        <option value="design">Design</option>
      </select>

      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Creating..." : "Create Post"}
      </button>

      {mutation.isError && (
        <div className="error">{mutation.error.message}</div>
      )}
    </form>
  );
}
```

### Optimistic Updates

```tsx
interface UpdatePostData {
  id: string;
  title?: string;
  content?: string;
}

async function updatePost({ id, ...data }: UpdatePostData): Promise<Post> {
  const response = await api.put(`/posts/${id}`, data);
  return response.data;
}

function EditPostForm({ post }: { post: Post }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updatePost,
    onMutate: async (updatedPost) => {
      await queryClient.cancelQueries({ queryKey: ["post", updatedPost.id] });

      const previousPost = queryClient.getQueryData(["post", updatedPost.id]);

      queryClient.setQueryData(["post", updatedPost.id], (old: Post) => ({
        ...old,
        ...updatedPost,
      }));

      return { previousPost };
    },
    onError: (err, updatedPost, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(
          ["post", updatedPost.id],
          context.previousPost
        );
      }
    },
    onSettled: (data, error, updatedPost) => {
      queryClient.invalidateQueries({ queryKey: ["post", updatedPost.id] });
    },
  });

  const handleSubmit = (formData: UpdatePostData) => {
    mutation.mutate(formData);
  };

  return (
    <EditForm
      initialData={post}
      onSubmit={handleSubmit}
      isSubmitting={mutation.isPending}
      error={mutation.error?.message}
    />
  );
}
```

### Bulk Operations

```tsx
async function deleteMultiplePosts(postIds: string[]): Promise<void> {
  await api.delete("/posts/bulk", { data: { ids: postIds } });
}

function PostsManagement() {
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteMultiplePosts,
    onMutate: async (postIds) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previousPosts = queryClient.getQueryData(["posts"]);

      queryClient.setQueryData(["posts"], (old: PostsPage) => ({
        ...old,
        posts: old.posts.filter((post) => !postIds.includes(post.id)),
      }));

      return { previousPosts };
    },
    onError: (err, postIds, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
      toast.error("Failed to delete posts");
    },
    onSuccess: () => {
      setSelectedPosts([]);
      toast.success("Posts deleted successfully");
    },
  });

  const handleBulkDelete = () => {
    if (selectedPosts.length > 0) {
      deleteMutation.mutate(selectedPosts);
    }
  };

  return (
    <div>
      <button
        onClick={handleBulkDelete}
        disabled={selectedPosts.length === 0 || deleteMutation.isPending}
      >
        Delete Selected ({selectedPosts.length})
      </button>

      <PostsList
        selectedPosts={selectedPosts}
        onSelectionChange={setSelectedPosts}
      />
    </div>
  );
}
```

## Custom Hooks

### Resource Hook Pattern

```tsx
function usePost(postId: string) {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: () => fetchPost(postId),
    enabled: !!postId,
  });
}

function usePosts(filters: PostsParams = {}) {
  return useQuery({
    queryKey: ["posts", filters],
    queryFn: () => fetchPosts(filters),
    keepPreviousData: true,
  });
}

function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePost,
    onSuccess: (updatedPost) => {
      queryClient.setQueryData(["post", updatedPost.id], updatedPost);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: (_, deletedPostId) => {
      queryClient.removeQueries({ queryKey: ["post", deletedPostId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
```

### Search Hook with Debouncing

```tsx
function useSearchPosts(initialQuery = "") {
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 300);

  const searchQuery = useQuery({
    queryKey: ["posts", "search", debouncedQuery],
    queryFn: () => searchPosts(debouncedQuery),
    enabled: debouncedQuery.length > 2,
    keepPreviousData: true,
  });

  return {
    query,
    setQuery,
    results: searchQuery.data || [],
    isLoading: searchQuery.isLoading,
    error: searchQuery.error,
  };
}

function PostSearch() {
  const { query, setQuery, results, isLoading } = useSearchPosts();

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search posts..."
      />

      {isLoading && <div>Searching...</div>}

      <div className="search-results">
        {results.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
```

## Background Sync and Offline Support

### Background Updates

```tsx
function useBackgroundSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.refetchQueries({
        stale: true,
        type: "active",
      });
    }, 5 * 60 * 1000); // Refetch every 5 minutes

    return () => clearInterval(interval);
  }, [queryClient]);

  useEffect(() => {
    const handleFocus = () => {
      queryClient.refetchQueries({
        stale: true,
        type: "active",
      });
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [queryClient]);
}

function App() {
  useBackgroundSync();

  return <AppContent />;
}
```

### Offline Mutations Queue

```tsx
function useOfflineMutations() {
  const [offlineQueue, setOfflineQueue] = useState<
    Array<{
      id: string;
      mutation: () => Promise<any>;
      retry: number;
    }>
  >([]);

  const processQueue = useCallback(async () => {
    if (!navigator.onLine || offlineQueue.length === 0) return;

    const queue = [...offlineQueue];
    setOfflineQueue([]);

    for (const item of queue) {
      try {
        await item.mutation();
      } catch (error) {
        if (item.retry > 0) {
          setOfflineQueue((prev) => [
            ...prev,
            {
              ...item,
              retry: item.retry - 1,
            },
          ]);
        }
      }
    }
  }, [offlineQueue]);

  useEffect(() => {
    const handleOnline = () => {
      processQueue();
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [processQueue]);

  const addToQueue = useCallback((mutation: () => Promise<any>) => {
    const id = Math.random().toString(36);
    setOfflineQueue((prev) => [...prev, { id, mutation, retry: 3 }]);
  }, []);

  return { addToQueue, queueLength: offlineQueue.length };
}
```

## Error Handling and Retry Logic

### Global Error Boundary

```tsx
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

function QueryErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <div className="error-boundary">
              <h2>Something went wrong:</h2>
              <pre>{error.message}</pre>
              <button onClick={resetErrorBoundary}>Try again</button>
            </div>
          )}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
```

### Custom Retry Logic

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error.status === 404) return false;
        if (error.status >= 500) return failureCount < 3;
        return failureCount < 1;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});
```

## Testing React Query

### Testing Queries

```tsx
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePost } from "./usePost";

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

function createWrapper() {
  const testQueryClient = createTestQueryClient();
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={testQueryClient}>
      {children}
    </QueryClientProvider>
  );
}

describe("usePost", () => {
  it("should fetch post successfully", async () => {
    const mockPost = { id: "1", title: "Test Post" };
    jest.spyOn(api, "get").mockResolvedValue({ data: mockPost });

    const { result } = renderHook(() => usePost("1"), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockPost);
  });
});
```

### Testing Mutations

```tsx
describe("useCreatePost", () => {
  it("should create post and invalidate queries", async () => {
    const mockPost = { id: "1", title: "New Post" };
    jest.spyOn(api, "post").mockResolvedValue({ data: mockPost });

    const queryClient = createTestQueryClient();
    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useCreatePost(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    act(() => {
      result.current.mutate({
        title: "New Post",
        content: "Content",
        categoryId: "tech",
      });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["posts"] });
  });
});
```

## Interview Questions

**Q: What are the benefits of React Query over useState for server state?**
A: React Query provides caching, background updates, optimistic updates, automatic retries, deduplication, and better loading states management out of the box.

**Q: How does React Query handle caching?**
A: Uses query keys for cache identification, configurable stale/cache times, automatic garbage collection, and intelligent cache invalidation strategies.

**Q: What's the difference between staleTime and gcTime?**
A: staleTime determines when data is considered stale and needs refetching. gcTime (formerly cacheTime) determines how long unused data stays in cache.

**Q: How do you handle optimistic updates in React Query?**
A: Use onMutate to update cache immediately, onError to rollback on failure, and onSettled to clean up and invalidate related queries.

**Q: How do you implement infinite scrolling with React Query?**
A: Use useInfiniteQuery with getNextPageParam to determine next page, fetchNextPage to load more, and flatten pages data for rendering.
