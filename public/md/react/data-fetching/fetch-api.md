# Data Fetching with Fetch API

The Fetch API is the modern standard for making HTTP requests in React applications. It provides a Promise-based interface for network requests and is supported in all modern browsers.

## Basic Fetch Operations

### Simple GET Request

```tsx
import { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </li>
      ))}
    </ul>
  );
}
```

### POST Request with Form Data

```tsx
import { useState } from "react";

interface CreateUserData {
  name: string;
  email: string;
  username: string;
}

function CreateUserForm() {
  const [formData, setFormData] = useState<CreateUserData>({
    name: "",
    email: "",
    username: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newUser = await response.json();
      console.log("User created:", newUser);

      setSuccess(true);
      setFormData({ name: "", email: "", username: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">User created successfully!</div>}

      <div>
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create User"}
      </button>
    </form>
  );
}
```

## Advanced Fetch Patterns

### Custom Fetch Hook

```tsx
import { useState, useEffect, useCallback } from "react";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface FetchOptions extends RequestInit {
  dependencies?: any[];
}

function useFetch<T>(url: string, options: FetchOptions = {}) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const { dependencies = [], ...fetchOptions } = options;

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setState({ data, loading: false, error: null });
    } catch (err) {
      setState({
        data: null,
        loading: false,
        error: err instanceof Error ? err.message : "An error occurred",
      });
    }
  }, [url, ...dependencies]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch };
}

// Usage
function UserProfile({ userId }: { userId: number }) {
  const {
    data: user,
    loading,
    error,
    refetch,
  } = useFetch<User>(`https://jsonplaceholder.typicode.com/users/${userId}`, {
    dependencies: [userId],
  });

  if (loading) return <div>Loading user...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

### Fetch with AbortController

```tsx
import { useState, useEffect, useRef } from "react";

function SearchUsers() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    const searchUsers = async () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/users?q=${encodeURIComponent(
            query
          )}`,
          {
            signal: abortControllerRef.current.signal,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUsers(data);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          console.log("Request was aborted");
        } else {
          setError(err instanceof Error ? err.message : "Search failed");
        }
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchUsers, 300);

    return () => {
      clearTimeout(timeoutId);
      abortControllerRef.current?.abort();
    };
  }, [query]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search users..."
      />

      {loading && <div>Searching...</div>}
      {error && <div>Error: {error}</div>}

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Fetch with Retry Logic

```tsx
import { useState, useCallback } from "react";

interface RetryOptions {
  retries: number;
  retryDelay: number;
  backoff?: boolean;
}

function useFetchWithRetry<T>(url: string, options: RequestInit = {}) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchWithRetry = useCallback(
    async (retryOptions: RetryOptions = { retries: 3, retryDelay: 1000 }) => {
      setState({ data: null, loading: true, error: null });

      const { retries, retryDelay, backoff = true } = retryOptions;

      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          const response = await fetch(url, options);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          setState({ data, loading: false, error: null });
          return data;
        } catch (err) {
          const isLastAttempt = attempt === retries;

          if (isLastAttempt) {
            setState({
              data: null,
              loading: false,
              error: err instanceof Error ? err.message : "Request failed",
            });
            throw err;
          }

          const delay = backoff
            ? retryDelay * Math.pow(2, attempt)
            : retryDelay;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    },
    [url, options]
  );

  return { ...state, fetchWithRetry };
}

// Usage
function RobustDataComponent() {
  const { data, loading, error, fetchWithRetry } = useFetchWithRetry<User[]>(
    "https://api.example.com/users"
  );

  const handleFetch = () => {
    fetchWithRetry({
      retries: 3,
      retryDelay: 1000,
      backoff: true,
    });
  };

  return (
    <div>
      <button onClick={handleFetch} disabled={loading}>
        {loading ? "Fetching..." : "Fetch Data"}
      </button>

      {error && <div>Error: {error}</div>}
      {data && (
        <ul>
          {data.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## Authentication with Fetch

### Bearer Token Authentication

```tsx
import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";

interface AuthContextValue {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("authToken")
  );

  useEffect(() => {
    if (token) {
      localStorage.setItem("authToken", token);
    } else {
      localStorage.removeItem("authToken");
    }
  }, [token]);

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

// Authenticated fetch hook
function useAuthenticatedFetch() {
  const { token, logout } = useAuth();

  const authenticatedFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      const headers = {
        "Content-Type": "application/json",
        ...options.headers,
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        logout();
        throw new Error("Authentication required");
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    },
    [token, logout]
  );

  return authenticatedFetch;
}

// Usage in component
function ProtectedDataComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const authenticatedFetch = useAuthenticatedFetch();

  const fetchProtectedData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await authenticatedFetch("/api/protected-data");
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={fetchProtectedData} disabled={loading}>
        {loading ? "Loading..." : "Fetch Protected Data"}
      </button>

      {error && <div>Error: {error}</div>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
```

## Error Handling Patterns

### Comprehensive Error Handling

```tsx
interface ApiError extends Error {
  status?: number;
  code?: string;
  details?: any;
}

class FetchError extends Error implements ApiError {
  status?: number;
  code?: string;
  details?: any;

  constructor(message: string, status?: number, code?: string, details?: any) {
    super(message);
    this.name = "FetchError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

async function safeFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      let errorDetails;

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        errorDetails = errorData;
      } catch {
        errorMessage = (await response.text()) || errorMessage;
      }

      throw new FetchError(
        errorMessage,
        response.status,
        response.status.toString(),
        errorDetails
      );
    }

    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      return await response.json();
    }

    return (await response.text()) as unknown as T;
  } catch (error) {
    if (error instanceof FetchError) {
      throw error;
    }

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new FetchError(
        "Network error - please check your connection",
        0,
        "NETWORK_ERROR"
      );
    }

    throw new FetchError(
      error instanceof Error ? error.message : "Unknown error occurred",
      0,
      "UNKNOWN_ERROR"
    );
  }
}

// Error boundary for fetch errors
function ErrorDisplay({
  error,
  onRetry,
}: {
  error: ApiError;
  onRetry?: () => void;
}) {
  const getErrorMessage = () => {
    switch (error.status) {
      case 400:
        return "Bad request. Please check your input.";
      case 401:
        return "You are not authorized. Please log in.";
      case 403:
        return "You do not have permission to access this resource.";
      case 404:
        return "The requested resource was not found.";
      case 500:
        return "Server error. Please try again later.";
      default:
        return error.message || "An unexpected error occurred.";
    }
  };

  return (
    <div className="error-container">
      <h3>Error</h3>
      <p>{getErrorMessage()}</p>

      {error.details && (
        <details>
          <summary>Error Details</summary>
          <pre>{JSON.stringify(error.details, null, 2)}</pre>
        </details>
      )}

      {onRetry && <button onClick={onRetry}>Try Again</button>}
    </div>
  );
}

// Usage with error handling
function DataComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await safeFetch<User[]>("/api/users");
      setData(result);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <ErrorDisplay error={error} onRetry={fetchData} />;

  return (
    <div>
      {data && (
        <ul>
          {data.map((user: User) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## Fetch vs Other Libraries

| Feature                           | Fetch API       | Axios        | SWR             | React Query     |
| --------------------------------- | --------------- | ------------ | --------------- | --------------- |
| **Bundle Size**                   | 0KB (native)    | ~33KB        | ~4KB            | ~37KB           |
| **Browser Support**               | Modern browsers | All browsers | Modern browsers | Modern browsers |
| **Request/Response Interceptors** | Manual          | Built-in     | No              | Custom          |
| **Automatic JSON Parsing**        | Manual          | Built-in     | Manual          | Manual          |
| **Request Cancellation**          | AbortController | Built-in     | Built-in        | Built-in        |
| **Caching**                       | Manual          | Manual       | Built-in        | Built-in        |
| **Background Updates**            | Manual          | Manual       | Built-in        | Built-in        |

## Performance Optimization

### Request Deduplication

```tsx
import { useRef, useCallback } from "react";

function useRequestDeduplication() {
  const pendingRequests = useRef<Map<string, Promise<any>>>(new Map());

  const deduplicatedFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      const key = `${url}-${JSON.stringify(options)}`;

      if (pendingRequests.current.has(key)) {
        return pendingRequests.current.get(key);
      }

      const request = fetch(url, options)
        .then(async (response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .finally(() => {
          pendingRequests.current.delete(key);
        });

      pendingRequests.current.set(key, request);
      return request;
    },
    []
  );

  return deduplicatedFetch;
}
```

### Request Batching

```tsx
interface BatchedRequest {
  url: string;
  options?: RequestInit;
  resolve: (value: any) => void;
  reject: (error: Error) => void;
}

class RequestBatcher {
  private batch: BatchedRequest[] = [];
  private timeout: NodeJS.Timeout | null = null;
  private batchDelay = 10; // milliseconds

  addRequest(url: string, options: RequestInit = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      this.batch.push({ url, options, resolve, reject });

      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      this.timeout = setTimeout(() => {
        this.executeBatch();
      }, this.batchDelay);
    });
  }

  private async executeBatch() {
    const currentBatch = [...this.batch];
    this.batch = [];
    this.timeout = null;

    const results = await Promise.allSettled(
      currentBatch.map(({ url, options }) => fetch(url, options))
    );

    results.forEach((result, index) => {
      const request = currentBatch[index];

      if (result.status === "fulfilled") {
        result.value.json().then(request.resolve).catch(request.reject);
      } else {
        request.reject(result.reason);
      }
    });
  }
}

const requestBatcher = new RequestBatcher();

function useBatchedFetch() {
  return useCallback((url: string, options: RequestInit = {}) => {
    return requestBatcher.addRequest(url, options);
  }, []);
}
```

## Best Practices

### Fetch Configuration

```tsx
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3000/api";

const defaultFetchOptions: RequestInit = {
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include", // Include cookies
};

function createApiClient(baseURL: string = API_BASE_URL) {
  return {
    get: (endpoint: string, options: RequestInit = {}) =>
      fetch(`${baseURL}${endpoint}`, { ...defaultFetchOptions, ...options }),

    post: (endpoint: string, data: any, options: RequestInit = {}) =>
      fetch(`${baseURL}${endpoint}`, {
        ...defaultFetchOptions,
        ...options,
        method: "POST",
        body: JSON.stringify(data),
      }),

    put: (endpoint: string, data: any, options: RequestInit = {}) =>
      fetch(`${baseURL}${endpoint}`, {
        ...defaultFetchOptions,
        ...options,
        method: "PUT",
        body: JSON.stringify(data),
      }),

    delete: (endpoint: string, options: RequestInit = {}) =>
      fetch(`${baseURL}${endpoint}`, {
        ...defaultFetchOptions,
        ...options,
        method: "DELETE",
      }),
  };
}

const apiClient = createApiClient();
```

## Common Pitfalls

### Memory Leaks Prevention

```tsx
import { useState, useEffect, useRef } from "react";

function useAsyncOperation<T>() {
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: string | null;
  }>({ data: null, loading: false, error: null });

  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async (asyncFn: () => Promise<T>) => {
    setState({ data: null, loading: true, error: null });

    try {
      const result = await asyncFn();

      if (mountedRef.current) {
        setState({ data: result, loading: false, error: null });
      }
    } catch (error) {
      if (mountedRef.current) {
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : "An error occurred",
        });
      }
    }
  }, []);

  return { ...state, execute };
}
```

## Interview Questions

### Q: What are the advantages of Fetch API over XMLHttpRequest?

**Answer:** Fetch API provides a Promise-based interface (cleaner async code), better error handling, request/response objects with useful methods, support for Service Workers, and a more modern, functional approach to HTTP requests.

### Q: How do you handle request cancellation with Fetch API?

**Answer:** Use AbortController to create an abort signal, pass it to the fetch options, and call abort() when needed. This is essential for preventing memory leaks in components that unmount during ongoing requests.

### Q: What's the difference between fetch() throwing an error and returning a failed response?

**Answer:** Fetch only throws for network errors, CORS issues, or other request failures. HTTP error statuses (400, 500, etc.) resolve successfully, so you must check response.ok or response.status manually.

### Q: How do you implement request retry logic with exponential backoff?

**Answer:** Use a loop with try-catch, implement delays with setTimeout/Promise, and multiply the delay by a factor (usually 2) on each retry attempt to avoid overwhelming the server.
