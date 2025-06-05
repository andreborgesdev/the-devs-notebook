# React Axios Integration

Axios is a popular HTTP client library that provides a simple and powerful API for making HTTP requests in React applications.

## Basic Setup and Configuration

### Installation and Basic Setup

```bash
pnpm add axios
pnpm add -D @types/axios
```

```tsx
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
```

### Request and Response Interceptors

```tsx
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
});

api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem("authToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("Request sent:", config);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log("Response received:", response);
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }

    console.error("Response error:", error);
    return Promise.reject(error);
  }
);

export default api;
```

## Creating API Services

### User Service

```tsx
import api from "./api";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "admin" | "user" | "moderator";
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: "admin" | "user" | "moderator";
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: "admin" | "user" | "moderator";
}

export const userService = {
  async getUsers(): Promise<User[]> {
    const response = await api.get<User[]>("/users");
    return response.data;
  },

  async getUser(id: string): Promise<User> {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  async createUser(userData: CreateUserData): Promise<User> {
    const response = await api.post<User>("/users", userData);
    return response.data;
  },

  async updateUser(id: string, userData: UpdateUserData): Promise<User> {
    const response = await api.put<User>(`/users/${id}`, userData);
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },

  async uploadAvatar(id: string, file: File): Promise<User> {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await api.post<User>(`/users/${id}/avatar`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
```

### Posts Service with Pagination

```tsx
import api from "./api";

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  tags: string[];
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PostsResponse {
  posts: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CreatePostData {
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  publishedAt?: string;
}

export interface PostFilters {
  page?: number;
  limit?: number;
  search?: string;
  tags?: string[];
  authorId?: string;
  published?: boolean;
  sortBy?: "createdAt" | "publishedAt" | "title";
  sortOrder?: "asc" | "desc";
}

export const postsService = {
  async getPosts(filters: PostFilters = {}): Promise<PostsResponse> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v));
        } else {
          params.append(key, String(value));
        }
      }
    });

    const response = await api.get<PostsResponse>(`/posts?${params}`);
    return response.data;
  },

  async getPost(id: string): Promise<Post> {
    const response = await api.get<Post>(`/posts/${id}`);
    return response.data;
  },

  async createPost(postData: CreatePostData): Promise<Post> {
    const response = await api.post<Post>("/posts", postData);
    return response.data;
  },

  async updatePost(
    id: string,
    postData: Partial<CreatePostData>
  ): Promise<Post> {
    const response = await api.put<Post>(`/posts/${id}`, postData);
    return response.data;
  },

  async deletePost(id: string): Promise<void> {
    await api.delete(`/posts/${id}`);
  },

  async publishPost(id: string): Promise<Post> {
    const response = await api.patch<Post>(`/posts/${id}/publish`);
    return response.data;
  },

  async unpublishPost(id: string): Promise<Post> {
    const response = await api.patch<Post>(`/posts/${id}/unpublish`);
    return response.data;
  },
};
```

## React Hooks with Axios

### Custom API Hook

```tsx
import { useState, useEffect, useCallback } from "react";
import { AxiosError, AxiosRequestConfig } from "axios";
import api from "../services/api";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions extends AxiosRequestConfig {
  immediate?: boolean;
}

export function useApi<T = any>(
  url: string,
  options: UseApiOptions = {}
): UseApiState<T> & {
  execute: () => Promise<T>;
  reset: () => void;
} {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (): Promise<T> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await api(url, options);
      setState({
        data: response.data,
        loading: false,
        error: null,
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : "An unexpected error occurred";

      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
      throw error;
    }
  }, [url, options]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  useEffect(() => {
    if (options.immediate !== false) {
      execute();
    }
  }, [execute, options.immediate]);

  return {
    ...state,
    execute,
    reset,
  };
}
```

### Posts List Hook

```tsx
import { useState, useEffect, useCallback } from "react";
import { postsService, Post, PostFilters } from "../services/postsService";

export function usePosts(initialFilters: PostFilters = {}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PostFilters>(initialFilters);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await postsService.getPosts(filters);
      setPosts(response.posts);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const updateFilters = useCallback((newFilters: Partial<PostFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const goToPage = useCallback(
    (page: number) => {
      updateFilters({ page });
    },
    [updateFilters]
  );

  const searchPosts = useCallback(
    (search: string) => {
      updateFilters({ search, page: 1 });
    },
    [updateFilters]
  );

  const filterByTag = useCallback(
    (tag: string) => {
      updateFilters({ tags: [tag], page: 1 });
    },
    [updateFilters]
  );

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    goToPage,
    searchPosts,
    filterByTag,
    clearFilters,
    refetch: fetchPosts,
  };
}
```

### User Management Hook

```tsx
import { useState, useCallback } from "react";
import {
  userService,
  User,
  CreateUserData,
  UpdateUserData,
} from "../services/userService";

export function useUserManagement() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAsync = useCallback(
    async <T,>(asyncFn: () => Promise<T>): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        const result = await asyncFn();
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createUser = useCallback(
    async (userData: CreateUserData): Promise<User | null> => {
      return handleAsync(() => userService.createUser(userData));
    },
    [handleAsync]
  );

  const updateUser = useCallback(
    async (id: string, userData: UpdateUserData): Promise<User | null> => {
      return handleAsync(() => userService.updateUser(id, userData));
    },
    [handleAsync]
  );

  const deleteUser = useCallback(
    async (id: string): Promise<boolean> => {
      const result = await handleAsync(() => userService.deleteUser(id));
      return result !== null;
    },
    [handleAsync]
  );

  const uploadAvatar = useCallback(
    async (id: string, file: File): Promise<User | null> => {
      return handleAsync(() => userService.uploadAvatar(id, file));
    },
    [handleAsync]
  );

  return {
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
    uploadAvatar,
  };
}
```

## Error Handling

### Global Error Handler

```tsx
import axios, { AxiosError } from "axios";

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

export function handleApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      return {
        message: axiosError.response.data?.message || "Server error",
        code: axiosError.response.data?.code,
        status: axiosError.response.status,
        details: axiosError.response.data,
      };
    }

    if (axiosError.request) {
      return {
        message: "Network error - please check your connection",
        code: "NETWORK_ERROR",
      };
    }
  }

  return {
    message:
      error instanceof Error ? error.message : "An unexpected error occurred",
    code: "UNKNOWN_ERROR",
  };
}

export function useErrorHandler() {
  const [error, setError] = useState<ApiError | null>(null);

  const handleError = useCallback((error: unknown) => {
    const apiError = handleApiError(error);
    setError(apiError);

    console.error("API Error:", apiError);

    if (apiError.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, clearError };
}
```

### Retry Logic

```tsx
import { AxiosRequestConfig } from "axios";
import api from "./api";

interface RetryConfig {
  retries: number;
  retryDelay: number;
  retryCondition?: (error: any) => boolean;
}

export async function apiWithRetry<T>(
  config: AxiosRequestConfig,
  retryConfig: RetryConfig = { retries: 3, retryDelay: 1000 }
): Promise<T> {
  const { retries, retryDelay, retryCondition } = retryConfig;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await api(config);
      return response.data;
    } catch (error) {
      const shouldRetry =
        attempt < retries && (retryCondition ? retryCondition(error) : true);

      if (!shouldRetry) {
        throw error;
      }

      await new Promise((resolve) =>
        setTimeout(resolve, retryDelay * (attempt + 1))
      );
    }
  }

  throw new Error("Max retries exceeded");
}

export function useApiWithRetry() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async <T,>(
      config: AxiosRequestConfig,
      retryConfig?: RetryConfig
    ): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        const data = await apiWithRetry<T>(config, retryConfig);
        return data;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Request failed");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { execute, loading, error };
}
```

## Request Cancellation

### Cancellation with AbortController

```tsx
import { useEffect, useRef, useCallback } from "react";
import api from "../services/api";

export function useCancellableRequest() {
  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(
    async <T,>(url: string, config: AxiosRequestConfig = {}): Promise<T> => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      const response = await api(url, {
        ...config,
        signal: abortControllerRef.current.signal,
      });

      return response.data;
    },
    []
  );

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  return { execute, cancel };
}
```

### Search with Debounce and Cancellation

```tsx
import { useState, useEffect, useMemo } from "react";
import { postsService, Post } from "../services/postsService";
import { useCancellableRequest } from "./useCancellableRequest";
import { useDebounce } from "./useDebounce";

export function useSearchPosts(initialQuery = "") {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedQuery = useDebounce(query, 300);
  const { execute, cancel } = useCancellableRequest();

  const search = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await execute<PostsResponse>("/posts", {
          params: { search: searchQuery, limit: 10 },
        });

        setResults(response.posts);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err instanceof Error ? err.message : "Search failed");
        }
      } finally {
        setLoading(false);
      }
    },
    [execute]
  );

  useEffect(() => {
    search(debouncedQuery);
  }, [debouncedQuery, search]);

  const clearSearch = useCallback(() => {
    setQuery("");
    setResults([]);
    setError(null);
    cancel();
  }, [cancel]);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    clearSearch,
  };
}
```

## File Upload with Progress

### File Upload Hook

```tsx
import { useState, useCallback } from "react";
import api from "../services/api";

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export function useFileUpload() {
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (url: string, file: File, fieldName = "file"): Promise<any> => {
      setLoading(true);
      setError(null);
      setProgress(null);

      const formData = new FormData();
      formData.append(fieldName, file);

      try {
        const response = await api.post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent;
            const percentage = Math.round((loaded * 100) / (total || 1));

            setProgress({
              loaded,
              total: total || 0,
              percentage,
            });
          },
        });

        return response.data;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setProgress(null);
    setLoading(false);
    setError(null);
  }, []);

  return {
    upload,
    progress,
    loading,
    error,
    reset,
  };
}
```

### Multiple Files Upload

```tsx
export function useMultipleFileUpload() {
  const [uploads, setUploads] = useState<Map<string, UploadProgress>>(
    new Map()
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFiles = useCallback(
    async (url: string, files: File[]): Promise<any[]> => {
      setLoading(true);
      setError(null);
      setUploads(new Map());

      try {
        const uploadPromises = files.map(async (file, index) => {
          const fileId = `${file.name}-${index}`;
          const formData = new FormData();
          formData.append("file", file);

          return api.post(url, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              const { loaded, total } = progressEvent;
              const percentage = Math.round((loaded * 100) / (total || 1));

              setUploads((prev) =>
                new Map(prev).set(fileId, {
                  loaded,
                  total: total || 0,
                  percentage,
                })
              );
            },
          });
        });

        const responses = await Promise.all(uploadPromises);
        return responses.map((response) => response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    uploadFiles,
    uploads,
    loading,
    error,
  };
}
```

## Testing Axios Integration

### Mocking Axios

```tsx
import axios from "axios";
import { renderHook, waitFor } from "@testing-library/react";
import { usePosts } from "./usePosts";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("usePosts Hook", () => {
  beforeEach(() => {
    mockedAxios.create.mockReturnValue(mockedAxios);
    mockedAxios.get.mockReset();
  });

  it("should fetch posts successfully", async () => {
    const mockResponse = {
      posts: [{ id: "1", title: "Test Post", content: "Content" }],
      pagination: { page: 1, limit: 10, total: 1, pages: 1 },
    };

    mockedAxios.get.mockResolvedValue({ data: mockResponse });

    const { result } = renderHook(() => usePosts());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.posts).toEqual(mockResponse.posts);
    expect(result.current.pagination).toEqual(mockResponse.pagination);
  });

  it("should handle API errors", async () => {
    mockedAxios.get.mockRejectedValue(new Error("API Error"));

    const { result } = renderHook(() => usePosts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("API Error");
    expect(result.current.posts).toEqual([]);
  });
});
```

## Interview Questions

**Q: How do you handle authentication with Axios?**
A: Use request interceptors to add auth tokens to headers and response interceptors to handle 401 errors and redirect to login.

**Q: How do you implement request cancellation in React?**
A: Use AbortController with Axios signal option and cancel requests in useEffect cleanup or when new requests are made.

**Q: How do you handle file uploads with progress tracking?**
A: Use FormData with multipart/form-data content type and onUploadProgress callback to track upload progress.

**Q: What's the difference between Axios and fetch?**
A: Axios provides automatic JSON parsing, request/response interceptors, built-in error handling, and request cancellation, while fetch requires manual handling.

**Q: How do you implement retry logic with Axios?**
A: Create a wrapper function that catches errors, checks retry conditions, and uses setTimeout for delay between attempts.
