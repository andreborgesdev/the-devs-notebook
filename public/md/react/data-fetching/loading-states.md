# Loading States in React Data Fetching

Managing loading states effectively is crucial for providing excellent user experience during data fetching operations. This guide covers comprehensive strategies for handling loading states in React applications.

## Basic Loading States

### Simple Loading Hook

```tsx
import { useState, useEffect } from "react";

interface UseLoadingState {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  withLoading: <T extends any[], R>(
    fn: (...args: T) => Promise<R>
  ) => (...args: T) => Promise<R>;
}

function useLoading(initialState = false): UseLoadingState {
  const [isLoading, setIsLoading] = useState(initialState);

  const withLoading = <T extends any[], R>(fn: (...args: T) => Promise<R>) => {
    return async (...args: T): Promise<R> => {
      setIsLoading(true);
      try {
        const result = await fn(...args);
        return result;
      } finally {
        setIsLoading(false);
      }
    };
  };

  return { isLoading, setIsLoading, withLoading };
}

function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const { isLoading, withLoading } = useLoading();

  const fetchUser = withLoading(async (id: string) => {
    const response = await fetch(`/api/users/${id}`);
    const userData = await response.json();
    setUser(userData);
    return userData;
  });

  useEffect(() => {
    fetchUser(userId);
  }, [userId]);

  if (isLoading) return <div>Loading user...</div>;
  if (!user) return <div>User not found</div>;

  return <div>Welcome, {user.name}!</div>;
}
```

### Multiple Loading States

```tsx
interface LoadingStates {
  user: boolean;
  posts: boolean;
  comments: boolean;
}

function useMultipleLoadingStates() {
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    user: false,
    posts: false,
    comments: false,
  });

  const setLoading = (key: keyof LoadingStates, loading: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [key]: loading }));
  };

  const isAnyLoading = Object.values(loadingStates).some(Boolean);
  const areAllLoading = Object.values(loadingStates).every(Boolean);

  return {
    loadingStates,
    setLoading,
    isAnyLoading,
    areAllLoading,
  };
}

function Dashboard() {
  const [data, setData] = useState({
    user: null,
    posts: [],
    comments: [],
  });

  const { loadingStates, setLoading, isAnyLoading } =
    useMultipleLoadingStates();

  const fetchUserData = async () => {
    setLoading("user", true);
    try {
      const user = await fetchUser();
      setData((prev) => ({ ...prev, user }));
    } finally {
      setLoading("user", false);
    }
  };

  const fetchPosts = async () => {
    setLoading("posts", true);
    try {
      const posts = await fetchUserPosts();
      setData((prev) => ({ ...prev, posts }));
    } finally {
      setLoading("posts", false);
    }
  };

  const fetchComments = async () => {
    setLoading("comments", true);
    try {
      const comments = await fetchUserComments();
      setData((prev) => ({ ...prev, comments }));
    } finally {
      setLoading("comments", false);
    }
  };

  useEffect(() => {
    Promise.all([fetchUserData(), fetchPosts(), fetchComments()]);
  }, []);

  return (
    <div className="dashboard">
      {isAnyLoading && <div className="global-loading">Loading...</div>}

      <section>
        {loadingStates.user ? <UserSkeleton /> : <UserCard user={data.user} />}
      </section>

      <section>
        {loadingStates.posts ? (
          <PostsSkeleton />
        ) : (
          <PostsList posts={data.posts} />
        )}
      </section>

      <section>
        {loadingStates.comments ? (
          <CommentsSkeleton />
        ) : (
          <CommentsList comments={data.comments} />
        )}
      </section>
    </div>
  );
}
```

## Advanced Loading Patterns

### Sequential Loading

```tsx
interface Step {
  name: string;
  action: () => Promise<any>;
  completed: boolean;
}

function useSequentialLoading(steps: Omit<Step, "completed">[]) {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepsState, setStepsState] = useState<Step[]>(
    steps.map((step) => ({ ...step, completed: false }))
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const executeSteps = async () => {
    setIsLoading(true);
    setError(null);

    for (let i = 0; i < stepsState.length; i++) {
      setCurrentStep(i);

      try {
        await stepsState[i].action();
        setStepsState((prev) =>
          prev.map((step, index) =>
            index === i ? { ...step, completed: true } : step
          )
        );
      } catch (err) {
        setError(err as Error);
        setIsLoading(false);
        return;
      }
    }

    setIsLoading(false);
    setCurrentStep(stepsState.length);
  };

  const progress = (currentStep / stepsState.length) * 100;

  return {
    executeSteps,
    currentStep,
    stepsState,
    isLoading,
    error,
    progress,
    isComplete: currentStep === stepsState.length,
  };
}

function DataMigration() {
  const steps = [
    { name: "Backing up data", action: () => backupData() },
    { name: "Transforming records", action: () => transformData() },
    { name: "Validating integrity", action: () => validateData() },
    { name: "Finalizing migration", action: () => finalizeMigration() },
  ];

  const {
    executeSteps,
    currentStep,
    stepsState,
    isLoading,
    error,
    progress,
    isComplete,
  } = useSequentialLoading(steps);

  return (
    <div className="migration-container">
      <h2>Data Migration</h2>

      {!isLoading && !isComplete && (
        <button onClick={executeSteps}>Start Migration</button>
      )}

      {isLoading && (
        <div className="migration-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>

          <div className="steps-list">
            {stepsState.map((step, index) => (
              <div
                key={step.name}
                className={`step ${
                  index < currentStep
                    ? "completed"
                    : index === currentStep
                    ? "active"
                    : "pending"
                }`}
              >
                <span className="step-indicator">
                  {step.completed ? "✓" : index === currentStep ? "⟳" : "○"}
                </span>
                {step.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="error-message">
          Migration failed at step {currentStep + 1}: {error.message}
        </div>
      )}

      {isComplete && (
        <div className="success-message">Migration completed successfully!</div>
      )}
    </div>
  );
}
```

### Debounced Loading

```tsx
import { useCallback, useRef, useState, useEffect } from "react";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function useDebouncedLoading<T>(
  asyncFunction: (params: T) => Promise<any>,
  delay: number = 300
) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const debouncedExecute = useCallback(
    async (params: T) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      setIsLoading(true);
      setError(null);

      try {
        const result = await asyncFunction(params);
        if (!abortControllerRef.current.signal.aborted) {
          setData(result);
        }
      } catch (err) {
        if (!abortControllerRef.current.signal.aborted) {
          setError(err as Error);
        }
      } finally {
        if (!abortControllerRef.current.signal.aborted) {
          setIsLoading(false);
        }
      }
    },
    [asyncFunction]
  );

  const [params, setParams] = useState<T | null>(null);
  const debouncedParams = useDebounce(params, delay);

  useEffect(() => {
    if (debouncedParams !== null) {
      debouncedExecute(debouncedParams);
    }
  }, [debouncedParams, debouncedExecute]);

  const execute = useCallback((newParams: T) => {
    setParams(newParams);
  }, []);

  return { execute, isLoading, data, error };
}

function SearchUsers() {
  const [searchTerm, setSearchTerm] = useState("");

  const searchUsers = async (term: string) => {
    if (!term.trim()) return [];

    const response = await fetch(
      `/api/users/search?q=${encodeURIComponent(term)}`
    );
    return response.json();
  };

  const {
    execute,
    isLoading,
    data: users,
    error,
  } = useDebouncedLoading(searchUsers, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    execute(value);
  };

  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search users..."
          className="search-input"
        />
        {isLoading && <div className="search-spinner">⟳</div>}
      </div>

      {error && (
        <div className="error-message">Search failed: {error.message}</div>
      )}

      {users && users.length > 0 && (
        <div className="search-results">
          {users.map((user: any) => (
            <div key={user.id} className="user-result">
              <img src={user.avatar} alt={user.name} />
              <div>
                <h4>{user.name}</h4>
                <p>{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {users && users.length === 0 && searchTerm && !isLoading && (
        <div className="no-results">No users found</div>
      )}
    </div>
  );
}
```

## Loading UI Components

### Skeleton Components

```tsx
interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
}

function Skeleton({
  width = "100%",
  height = "1rem",
  borderRadius = "0.25rem",
  className = "",
}: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-200 ${className}`}
      style={{
        width,
        height,
        borderRadius,
      }}
    />
  );
}

function UserCardSkeleton() {
  return (
    <div className="user-card-skeleton">
      <div className="flex items-center space-x-4">
        <Skeleton width={48} height={48} borderRadius="50%" />
        <div className="flex-1 space-y-2">
          <Skeleton height="1rem" width="60%" />
          <Skeleton height="0.875rem" width="40%" />
        </div>
      </div>
    </div>
  );
}

function PostSkeleton() {
  return (
    <div className="post-skeleton p-4 border rounded-lg">
      <div className="flex items-center space-x-3 mb-4">
        <Skeleton width={32} height={32} borderRadius="50%" />
        <div className="flex-1">
          <Skeleton height="0.875rem" width="25%" />
        </div>
      </div>

      <div className="space-y-3">
        <Skeleton height="1.25rem" width="90%" />
        <Skeleton height="1rem" width="100%" />
        <Skeleton height="1rem" width="85%" />
        <Skeleton height="1rem" width="70%" />
      </div>

      <div className="mt-4">
        <Skeleton height="12rem" width="100%" borderRadius="0.5rem" />
      </div>

      <div className="flex justify-between mt-4">
        <Skeleton width={60} height="2rem" borderRadius="0.25rem" />
        <Skeleton width={80} height="2rem" borderRadius="0.25rem" />
      </div>
    </div>
  );
}

function PostListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="post-list-skeleton space-y-6">
      {Array.from({ length: count }).map((_, index) => (
        <PostSkeleton key={index} />
      ))}
    </div>
  );
}
```

### Spinner Components

```tsx
interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
}

function Spinner({
  size = "md",
  color = "currentColor",
  className = "",
}: SpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div
      className={`animate-spin rounded-full border-2 border-gray-200 border-t-current ${sizeClasses[size]} ${className}`}
      style={{ borderTopColor: color }}
    />
  );
}

function ButtonWithLoading({
  children,
  isLoading,
  disabled,
  onClick,
  ...props
}: {
  children: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      onClick={onClick}
      className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
    >
      {isLoading && <Spinner size="sm" color="white" />}
      <span>{children}</span>
    </button>
  );
}

function InlineLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex items-center space-x-2 text-gray-600">
      <Spinner size="sm" />
      <span className="text-sm">{text}</span>
    </div>
  );
}
```

### Progress Indicators

```tsx
interface ProgressBarProps {
  progress: number;
  className?: string;
  showPercentage?: boolean;
  color?: string;
}

function ProgressBar({
  progress,
  className = "",
  showPercentage = false,
  color = "#3b82f6",
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`progress-bar-container ${className}`}>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="h-2.5 rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${clampedProgress}%`,
            backgroundColor: color,
          }}
        />
      </div>

      {showPercentage && (
        <span className="text-sm text-gray-600 mt-1">
          {Math.round(clampedProgress)}%
        </span>
      )}
    </div>
  );
}

function CircularProgress({
  progress,
  size = 40,
  strokeWidth = 4,
  color = "#3b82f6",
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="circular-progress">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
        {Math.round(progress)}%
      </div>
    </div>
  );
}

function FileUploadProgress({
  file,
  progress,
}: {
  file: File;
  progress: number;
}) {
  return (
    <div className="file-upload-item p-3 border rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium truncate">{file.name}</span>
        <span className="text-xs text-gray-500">
          {(file.size / 1024 / 1024).toFixed(2)} MB
        </span>
      </div>

      <ProgressBar progress={progress} showPercentage />

      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-gray-500">
          {progress === 100 ? "Complete" : "Uploading..."}
        </span>
        {progress === 100 && <span className="text-green-500 text-xs">✓</span>}
      </div>
    </div>
  );
}
```

## Loading States with React Query

### Query Loading States

```tsx
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";

function UserProfile({ userId }: { userId: string }) {
  const {
    data: user,
    isLoading,
    isError,
    error,
    isFetching,
    isRefetching,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="user-profile">
      <div className="header">
        <h1>User Profile</h1>
        {isFetching && !isLoading && (
          <div className="refresh-indicator">
            <Spinner size="sm" />
            <span>Updating...</span>
          </div>
        )}
      </div>

      {isLoading ? (
        <UserCardSkeleton />
      ) : isError ? (
        <div className="error-state">
          <p>Failed to load user: {error.message}</p>
          <button onClick={() => refetch()}>Try Again</button>
        </div>
      ) : (
        <UserCard user={user} />
      )}

      {isRefetching && (
        <div className="refetch-indicator">
          <InlineLoader text="Refreshing data..." />
        </div>
      )}
    </div>
  );
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
    queryKey: ["posts"],
    queryFn: ({ pageParam = 0 }) => fetchPosts(pageParam),
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length : undefined,
  });

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  if (status === "loading") {
    return <PostListSkeleton count={5} />;
  }

  if (status === "error") {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="infinite-posts">
      <div className="posts-grid">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {isFetchingNextPage && (
        <div className="loading-more">
          <PostListSkeleton count={2} />
        </div>
      )}

      {hasNextPage && !isFetchingNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="load-more-btn"
        >
          Load More Posts
        </button>
      )}

      {isFetching && !isFetchingNextPage && (
        <div className="background-update">
          <InlineLoader text="Checking for updates..." />
        </div>
      )}
    </div>
  );
}
```

### Mutation Loading States

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";

function CreatePostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn: (newPost: { title: string; content: string }) =>
      createPost(newPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setTitle("");
      setContent("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPostMutation.mutate({ title, content });
  };

  return (
    <form onSubmit={handleSubmit} className="create-post-form">
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={createPostMutation.isPending}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={createPostMutation.isPending}
          rows={5}
          required
        />
      </div>

      <div className="form-actions">
        <ButtonWithLoading
          type="submit"
          isLoading={createPostMutation.isPending}
          disabled={!title.trim() || !content.trim()}
        >
          {createPostMutation.isPending ? "Creating Post..." : "Create Post"}
        </ButtonWithLoading>

        {createPostMutation.isError && (
          <div className="error-message">
            Failed to create post: {createPostMutation.error.message}
          </div>
        )}

        {createPostMutation.isSuccess && (
          <div className="success-message">Post created successfully!</div>
        )}
      </div>

      {createPostMutation.isPending && (
        <div className="form-overlay">
          <div className="form-loading">
            <Spinner />
            <p>Creating your post...</p>
          </div>
        </div>
      )}
    </form>
  );
}
```

## Loading States with SWR

### SWR Loading Patterns

```tsx
import useSWR from "swr";

function UserDashboard({ userId }: { userId: string }) {
  const {
    data: user,
    error: userError,
    isLoading: userLoading,
  } = useSWR(`/users/${userId}`, fetcher);

  const {
    data: posts,
    error: postsError,
    isLoading: postsLoading,
  } = useSWR(user ? `/users/${userId}/posts` : null, fetcher);

  const {
    data: stats,
    error: statsError,
    isLoading: statsLoading,
  } = useSWR(user ? `/users/${userId}/stats` : null, fetcher);

  const isAnyLoading = userLoading || postsLoading || statsLoading;
  const hasAnyError = userError || postsError || statsError;

  if (userLoading) {
    return (
      <div className="dashboard-loading">
        <UserCardSkeleton />
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Skeleton height="8rem" />
          <Skeleton height="8rem" />
        </div>
        <div className="mt-6">
          <PostListSkeleton count={3} />
        </div>
      </div>
    );
  }

  if (userError) {
    return <div>Failed to load user data</div>;
  }

  return (
    <div className="dashboard">
      <UserCard user={user} />

      <div className="stats-section">
        {statsLoading ? (
          <div className="grid grid-cols-2 gap-4">
            <Skeleton height="8rem" />
            <Skeleton height="8rem" />
          </div>
        ) : statsError ? (
          <div className="error-state">Failed to load stats</div>
        ) : (
          <StatsCards stats={stats} />
        )}
      </div>

      <div className="posts-section">
        <h2>Recent Posts</h2>
        {postsLoading ? (
          <PostListSkeleton count={3} />
        ) : postsError ? (
          <div className="error-state">Failed to load posts</div>
        ) : (
          <PostsList posts={posts} />
        )}
      </div>

      {isAnyLoading && (
        <div className="global-refresh-indicator">
          <InlineLoader text="Updating data..." />
        </div>
      )}
    </div>
  );
}

function useConditionalSWR(shouldFetch: boolean, key: string, fetcher: any) {
  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? key : null,
    fetcher
  );

  return {
    data,
    error,
    isLoading: shouldFetch ? isLoading : false,
    mutate,
  };
}

function ConditionalDataComponent() {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const { data: basicData, isLoading: basicLoading } = useSWR(
    "/api/basic-data",
    fetcher
  );

  const { data: advancedData, isLoading: advancedLoading } = useConditionalSWR(
    showAdvanced,
    "/api/advanced-data",
    fetcher
  );

  return (
    <div>
      <section>
        {basicLoading ? (
          <Skeleton height="4rem" />
        ) : (
          <BasicDataDisplay data={basicData} />
        )}
      </section>

      <button onClick={() => setShowAdvanced(!showAdvanced)}>
        {showAdvanced ? "Hide" : "Show"} Advanced Data
      </button>

      {showAdvanced && (
        <section>
          {advancedLoading ? (
            <Skeleton height="6rem" />
          ) : (
            <AdvancedDataDisplay data={advancedData} />
          )}
        </section>
      )}
    </div>
  );
}
```

## Global Loading State Management

### Context-Based Loading Manager

```tsx
import React, { createContext, useContext, useReducer, ReactNode } from "react";

interface LoadingState {
  [key: string]: boolean;
}

interface LoadingAction {
  type: "SET_LOADING" | "CLEAR_LOADING" | "CLEAR_ALL";
  key?: string;
  value?: boolean;
}

const LoadingContext = createContext<{
  state: LoadingState;
  dispatch: React.Dispatch<LoadingAction>;
} | null>(null);

function loadingReducer(
  state: LoadingState,
  action: LoadingAction
): LoadingState {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        [action.key!]: action.value!,
      };
    case "CLEAR_LOADING":
      const { [action.key!]: _, ...rest } = state;
      return rest;
    case "CLEAR_ALL":
      return {};
    default:
      return state;
  }
}

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(loadingReducer, {});

  return (
    <LoadingContext.Provider value={{ state, dispatch }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useGlobalLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useGlobalLoading must be used within LoadingProvider");
  }

  const { state, dispatch } = context;

  const setLoading = (key: string, loading: boolean) => {
    dispatch({ type: "SET_LOADING", key, value: loading });
  };

  const clearLoading = (key: string) => {
    dispatch({ type: "CLEAR_LOADING", key });
  };

  const clearAllLoading = () => {
    dispatch({ type: "CLEAR_ALL" });
  };

  const isLoading = (key: string) => Boolean(state[key]);
  const isAnyLoading = Object.values(state).some(Boolean);
  const getLoadingKeys = () => Object.keys(state).filter((key) => state[key]);

  return {
    isLoading,
    isAnyLoading,
    setLoading,
    clearLoading,
    clearAllLoading,
    getLoadingKeys,
    loadingState: state,
  };
}

function GlobalLoadingIndicator() {
  const { isAnyLoading, getLoadingKeys } = useGlobalLoading();

  if (!isAnyLoading) return null;

  const loadingOperations = getLoadingKeys();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-blue-500 text-white p-2">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Spinner size="sm" color="white" />
          <span>
            Loading{" "}
            {loadingOperations.length > 1
              ? `${loadingOperations.length} operations`
              : loadingOperations[0]}
            ...
          </span>
        </div>

        <div className="text-sm opacity-75">{loadingOperations.join(", ")}</div>
      </div>
    </div>
  );
}

function UserActions({ userId }: { userId: string }) {
  const { setLoading, isLoading } = useGlobalLoading();

  const handleUpdateProfile = async () => {
    setLoading("updateProfile", true);
    try {
      await updateUserProfile(userId);
    } finally {
      setLoading("updateProfile", false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading("deleteAccount", true);
    try {
      await deleteUserAccount(userId);
    } finally {
      setLoading("deleteAccount", false);
    }
  };

  return (
    <div className="user-actions">
      <ButtonWithLoading
        onClick={handleUpdateProfile}
        isLoading={isLoading("updateProfile")}
      >
        Update Profile
      </ButtonWithLoading>

      <ButtonWithLoading
        onClick={handleDeleteAccount}
        isLoading={isLoading("deleteAccount")}
      >
        Delete Account
      </ButtonWithLoading>
    </div>
  );
}
```

## Best Practices

### Performance Considerations

```tsx
// Avoid loading states that cause layout shifts
function OptimizedUserCard({ userId }: { userId: string }) {
  const { data: user, isLoading } = useSWR(`/users/${userId}`, fetcher);

  return (
    <div className="user-card" style={{ minHeight: "120px" }}>
      {isLoading ? (
        <UserCardSkeleton />
      ) : (
        <div className="user-content">
          <img src={user.avatar} alt={user.name} />
          <div>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Use skeleton screens instead of spinners for better perceived performance
function PostsList() {
  const { data: posts, isLoading } = useSWR("/posts", fetcher);

  return (
    <div className="posts-list">
      {isLoading
        ? Array.from({ length: 5 }).map((_, i) => <PostSkeleton key={i} />)
        : posts?.map((post) => <PostCard key={post.id} post={post} />)}
    </div>
  );
}

// Implement progressive loading for better user experience
function ProgressiveUserProfile({ userId }: { userId: string }) {
  const { data: basicData, isLoading: basicLoading } = useSWR(
    `/users/${userId}/basic`,
    fetcher
  );

  const { data: detailedData, isLoading: detailLoading } = useSWR(
    basicData ? `/users/${userId}/detailed` : null,
    fetcher
  );

  if (basicLoading) {
    return <UserCardSkeleton />;
  }

  return (
    <div className="user-profile">
      <UserBasicInfo user={basicData} />

      {detailLoading ? (
        <div className="details-loading">
          <InlineLoader text="Loading additional details..." />
        </div>
      ) : (
        <UserDetailedInfo user={detailedData} />
      )}
    </div>
  );
}
```

### Accessibility Considerations

```tsx
function AccessibleLoadingStates() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsLoading(true)}
        disabled={isLoading}
        aria-describedby={isLoading ? "loading-status" : undefined}
      >
        {isLoading ? "Submitting..." : "Submit"}
      </button>

      {isLoading && (
        <div
          id="loading-status"
          role="status"
          aria-live="polite"
          aria-label="Form is being submitted"
        >
          <span className="sr-only">Loading, please wait...</span>
          <Spinner />
        </div>
      )}

      <div
        role="region"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {isLoading ? "Form submission in progress" : ""}
      </div>
    </div>
  );
}

function AccessibleInfiniteList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["posts"],
      queryFn: ({ pageParam = 0 }) => fetchPosts(pageParam),
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <div>
      <div role="feed" aria-label="Blog posts" aria-busy={isFetchingNextPage}>
        {posts.map((post, index) => (
          <article
            key={post.id}
            role="article"
            aria-posinset={index + 1}
            aria-setsize={-1}
          >
            <PostCard post={post} />
          </article>
        ))}
      </div>

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          aria-describedby="load-more-status"
        >
          Load More Posts
        </button>
      )}

      {isFetchingNextPage && (
        <div id="load-more-status" role="status" aria-live="polite">
          <span className="sr-only">Loading more posts</span>
          <InlineLoader />
        </div>
      )}
    </div>
  );
}
```

## Testing Loading States

### Testing Hooks

```tsx
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useLoading", () => {
  it("should handle loading states correctly", async () => {
    const mockAsyncFn = jest.fn().mockResolvedValue("result");

    const { result } = renderHook(() => useLoading());

    expect(result.current.isLoading).toBe(false);

    const wrappedFn = result.current.withLoading(mockAsyncFn);

    const promise = wrappedFn("test");

    expect(result.current.isLoading).toBe(true);

    const resolvedValue = await promise;

    expect(result.current.isLoading).toBe(false);
    expect(resolvedValue).toBe("result");
    expect(mockAsyncFn).toHaveBeenCalledWith("test");
  });

  it("should handle errors correctly", async () => {
    const mockError = new Error("Test error");
    const mockAsyncFn = jest.fn().mockRejectedValue(mockError);

    const { result } = renderHook(() => useLoading());

    const wrappedFn = result.current.withLoading(mockAsyncFn);

    await expect(wrappedFn()).rejects.toThrow("Test error");
    expect(result.current.isLoading).toBe(false);
  });
});

describe("useDebouncedLoading", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should debounce function calls", async () => {
    const mockAsyncFn = jest.fn().mockResolvedValue("result");

    const { result } = renderHook(() => useDebouncedLoading(mockAsyncFn, 300));

    result.current.execute("param1");
    result.current.execute("param2");
    result.current.execute("param3");

    expect(result.current.isLoading).toBe(false);
    expect(mockAsyncFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(300);

    await waitFor(() => {
      expect(mockAsyncFn).toHaveBeenCalledTimes(1);
      expect(mockAsyncFn).toHaveBeenCalledWith("param3");
    });
  });
});
```

### Component Testing

```tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockFetch = jest.fn();

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

describe("UserProfile Loading States", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it("should show loading skeleton initially", () => {
    mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves

    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <UserProfile userId="123" />
      </QueryClientProvider>
    );

    expect(screen.getByTestId("user-skeleton")).toBeInTheDocument();
  });

  it("should show user data after loading", async () => {
    const mockUser = { id: "123", name: "John Doe", email: "john@example.com" };
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockUser),
    });

    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <UserProfile userId="123" />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
    });

    expect(screen.queryByTestId("user-skeleton")).not.toBeInTheDocument();
  });

  it("should show error state on fetch failure", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <UserProfile userId="123" />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/failed to load user/i)).toBeInTheDocument();
    });
  });
});

describe("ButtonWithLoading", () => {
  it("should show spinner when loading", () => {
    render(<ButtonWithLoading isLoading>Submit</ButtonWithLoading>);

    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("should be clickable when not loading", () => {
    const mockClick = jest.fn();

    render(<ButtonWithLoading onClick={mockClick}>Submit</ButtonWithLoading>);

    const button = screen.getByRole("button");
    expect(button).not.toBeDisabled();

    fireEvent.click(button);
    expect(mockClick).toHaveBeenCalledTimes(1);
  });
});
```

## Interview Questions

### Common Questions

**Q: How do you prevent layout shifts when showing loading states?**

A: Use skeleton screens with fixed dimensions that match the actual content, implement min-height/min-width constraints, and avoid changing the DOM structure between loading and loaded states.

**Q: What's the difference between optimistic loading and pessimistic loading?**

A: Optimistic loading immediately shows the expected result and rolls back on error, while pessimistic loading waits for confirmation before updating the UI. Optimistic provides better perceived performance but requires careful error handling.

**Q: How do you handle multiple concurrent loading states?**

A: Use a global loading state manager, implement loading keys for different operations, provide loading priorities, and consider showing aggregate loading indicators for better UX.

**Q: When should you use skeleton screens vs spinners?**

A: Use skeleton screens for content with known structure (lists, cards, profiles) and spinners for indeterminate operations (form submissions, quick actions). Skeleton screens provide better perceived performance for content loading.

**Q: How do you test loading states effectively?**

A: Mock async operations with controlled promises, test loading, success, and error states, verify accessibility attributes, and ensure proper cleanup of loading states.

**Q: What are the accessibility considerations for loading states?**

A: Use ARIA live regions for status updates, provide screen reader announcements, ensure keyboard navigation works during loading, and include proper role and aria-label attributes.

This comprehensive guide covers all aspects of loading state management in React applications, from basic implementations to advanced patterns and testing strategies.
