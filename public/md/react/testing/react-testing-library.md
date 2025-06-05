# React Testing Library

React Testing Library is a testing utility that focuses on testing components in a way that resembles how users interact with your application. It encourages better testing practices by testing behavior rather than implementation details.

## Setup and Installation

### Basic Setup

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

```tsx
// setupTests.ts
import "@testing-library/jest-dom";

// Mock window.matchMedia for responsive components
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};
```

## Basic Component Testing

### Simple Component Tests

```tsx
// components/Button.tsx
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  type?: "button" | "submit";
}

export function Button({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant} ${disabled ? "btn-disabled" : ""}`}
      data-testid="button"
    >
      {children}
    </button>
  );
}

// components/__tests__/Button.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../Button";

describe("Button Component", () => {
  it("renders button with text", () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole("button", { name: /click me/i })
    ).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <Button onClick={handleClick} disabled>
        Click me
      </Button>
    );

    await user.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("applies correct CSS classes", () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole("button")).toHaveClass("btn", "btn-primary");

    rerender(
      <Button variant="secondary" disabled>
        Secondary
      </Button>
    );
    expect(screen.getByRole("button")).toHaveClass(
      "btn",
      "btn-secondary",
      "btn-disabled"
    );
  });

  it("has correct button type", () => {
    const { rerender } = render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");

    rerender(<Button>Default</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });
});
```

### Form Component Testing

```tsx
// components/ContactForm.tsx
import { useState } from "react";

interface ContactFormProps {
  onSubmit: (data: { name: string; email: string; message: string }) => void;
}

export function ContactForm({ onSubmit }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
      setFormData({ name: "", email: "", message: "" });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <div id="name-error" role="alert">
            {errors.name}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <div id="email-error" role="alert">
            {errors.email}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message && (
          <div id="message-error" role="alert">
            {errors.message}
          </div>
        )}
      </div>

      <button type="submit">Send Message</button>
    </form>
  );
}

// components/__tests__/ContactForm.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "../ContactForm";

describe("ContactForm", () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it("renders all form fields", () => {
    render(<ContactForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send message/i })
    ).toBeInTheDocument();
  });

  it("submits form with valid data", async () => {
    const user = userEvent.setup();
    render(<ContactForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(
      screen.getByLabelText(/message/i),
      "Hello, this is a test message."
    );

    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: "John Doe",
      email: "john@example.com",
      message: "Hello, this is a test message.",
    });
  });

  it("shows validation errors for empty fields", async () => {
    const user = userEvent.setup();
    render(<ContactForm onSubmit={mockOnSubmit} />);

    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(screen.getByText("Message is required")).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("shows validation error for invalid email", async () => {
    const user = userEvent.setup();
    render(<ContactForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "invalid-email");
    await user.type(screen.getByLabelText(/message/i), "Test message");

    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText("Email is invalid")).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("clears validation errors when user starts typing", async () => {
    const user = userEvent.setup();
    render(<ContactForm onSubmit={mockOnSubmit} />);

    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/name/i), "John");

    expect(screen.queryByText("Name is required")).not.toBeInTheDocument();
  });

  it("clears form after successful submission", async () => {
    const user = userEvent.setup();
    render(<ContactForm onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/message/i);

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "john@example.com");
    await user.type(messageInput, "Test message");

    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(nameInput).toHaveValue("");
      expect(emailInput).toHaveValue("");
      expect(messageInput).toHaveValue("");
    });
  });
});
```

## Testing Hooks

### Custom Hook Testing

```tsx
// hooks/useCounter.ts
import { useState, useCallback } from "react";

export function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  const decrement = useCallback(() => {
    setCount((prev) => prev - 1);
  }, []);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  const setValue = useCallback((value: number) => {
    setCount(value);
  }, []);

  return {
    count,
    increment,
    decrement,
    reset,
    setValue,
  };
}

// hooks/__tests__/useCounter.test.ts
import { renderHook, act } from "@testing-library/react";
import { useCounter } from "../useCounter";

describe("useCounter", () => {
  it("initializes with default value", () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it("initializes with custom value", () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });

  it("increments count", () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(6);
  });

  it("decrements count", () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(4);
  });

  it("resets to initial value", () => {
    const { result } = renderHook(() => useCounter(10));

    act(() => {
      result.current.increment();
      result.current.increment();
    });

    expect(result.current.count).toBe(12);

    act(() => {
      result.current.reset();
    });

    expect(result.current.count).toBe(10);
  });

  it("sets specific value", () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.setValue(42);
    });

    expect(result.current.count).toBe(42);
  });

  it("updates initial value on rerender", () => {
    let initialValue = 0;
    const { result, rerender } = renderHook(() => useCounter(initialValue));

    expect(result.current.count).toBe(0);

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);

    initialValue = 100;
    rerender();

    act(() => {
      result.current.reset();
    });

    expect(result.current.count).toBe(100);
  });
});
```

### Complex Hook Testing

```tsx
// hooks/useFetch.ts
import { useState, useEffect, useCallback } from "react";

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useFetch<T>(url: string, options?: RequestInit) {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState({ data: null, loading: true, error: null });

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : "An error occurred",
      });
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch };
}

// hooks/__tests__/useFetch.test.ts
import { renderHook, waitFor } from "@testing-library/react";
import { useFetch } from "../useFetch";

// Mock fetch
global.fetch = jest.fn();

describe("useFetch", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it("fetches data successfully", async () => {
    const mockData = { id: 1, name: "John Doe" };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useFetch("/api/user"));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBe(null);
    expect(fetch).toHaveBeenCalledWith("/api/user", undefined);
  });

  it("handles fetch error", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useFetch("/api/user"));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe("Network error");
  });

  it("handles HTTP error status", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const { result } = renderHook(() => useFetch("/api/user"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe("HTTP error! status: 404");
  });

  it("refetches data when refetch is called", async () => {
    const mockData = { id: 1, name: "John Doe" };
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useFetch("/api/user"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetch).toHaveBeenCalledTimes(1);

    await act(async () => {
      result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("refetches when URL changes", async () => {
    const mockData = { id: 1, name: "John Doe" };
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    let url = "/api/user/1";
    const { result, rerender } = renderHook(() => useFetch(url));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetch).toHaveBeenCalledWith("/api/user/1", undefined);

    url = "/api/user/2";
    rerender();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetch).toHaveBeenCalledWith("/api/user/2", undefined);
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
```

## Testing with Context

### Testing Context Providers

```tsx
// contexts/AuthContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
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

// components/UserProfile.tsx
import { useAuth } from "../contexts/AuthContext";

export function UserProfile() {
  const { user, logout, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not logged in</div>;

  return (
    <div>
      <h2 data-testid="user-name">{user.name}</h2>
      <p data-testid="user-email">{user.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

// components/__tests__/UserProfile.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "../../contexts/AuthContext";
import { UserProfile } from "../UserProfile";

// Test helper component
function TestComponent() {
  const { login, error } = useAuth();

  return (
    <div>
      <button onClick={() => login("test@example.com", "password")}>
        Login
      </button>
      {error && <div data-testid="error">{error}</div>}
      <UserProfile />
    </div>
  );
}

// Custom render function with AuthProvider
function renderWithAuth(ui: React.ReactElement) {
  return render(<AuthProvider>{ui}</AuthProvider>);
}

// Mock fetch
global.fetch = jest.fn();

describe("UserProfile with AuthContext", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('shows "Not logged in" when user is not authenticated', () => {
    renderWithAuth(<UserProfile />);
    expect(screen.getByText("Not logged in")).toBeInTheDocument();
  });

  it("shows user information when authenticated", async () => {
    const mockUser = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    });

    const user = userEvent.setup();
    renderWithAuth(<TestComponent />);

    await user.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(screen.getByTestId("user-name")).toHaveTextContent("John Doe");
      expect(screen.getByTestId("user-email")).toHaveTextContent(
        "john@example.com"
      );
    });
  });

  it("handles login error", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    const user = userEvent.setup();
    renderWithAuth(<TestComponent />);

    await user.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(screen.getByTestId("error")).toHaveTextContent("Login failed");
    });
  });

  it("logs out user successfully", async () => {
    const mockUser = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    });

    const user = userEvent.setup();
    renderWithAuth(<TestComponent />);

    await user.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(screen.getByTestId("user-name")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Logout"));

    expect(screen.getByText("Not logged in")).toBeInTheDocument();
  });
});
```

## Testing Async Components

### Testing with Loading States

```tsx
// components/PostList.tsx
import { useState, useEffect } from "react";

interface Post {
  id: number;
  title: string;
  body: string;
}

export function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div data-testid="loading">Loading posts...</div>;
  }

  if (error) {
    return <div data-testid="error">Error: {error}</div>;
  }

  if (posts.length === 0) {
    return <div data-testid="no-posts">No posts available</div>;
  }

  return (
    <ul data-testid="posts-list">
      {posts.map((post) => (
        <li key={post.id} data-testid={`post-${post.id}`}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </li>
      ))}
    </ul>
  );
}

// components/__tests__/PostList.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import { PostList } from "../PostList";

global.fetch = jest.fn();

describe("PostList", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it("shows loading state initially", () => {
    (fetch as jest.Mock).mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<PostList />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("displays posts after successful fetch", async () => {
    const mockPosts = [
      { id: 1, title: "Post 1", body: "Content 1" },
      { id: 2, title: "Post 2", body: "Content 2" },
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPosts,
    });

    render(<PostList />);

    expect(screen.getByTestId("loading")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("posts-list")).toBeInTheDocument();
    });

    expect(screen.getByTestId("post-1")).toBeInTheDocument();
    expect(screen.getByTestId("post-2")).toBeInTheDocument();
    expect(screen.getByText("Post 1")).toBeInTheDocument();
    expect(screen.getByText("Content 1")).toBeInTheDocument();
  });

  it("displays error message on fetch failure", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    render(<PostList />);

    await waitFor(() => {
      expect(screen.getByTestId("error")).toBeInTheDocument();
    });

    expect(screen.getByText("Error: Network error")).toBeInTheDocument();
  });

  it("displays no posts message when array is empty", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<PostList />);

    await waitFor(() => {
      expect(screen.getByTestId("no-posts")).toBeInTheDocument();
    });

    expect(screen.getByText("No posts available")).toBeInTheDocument();
  });

  it("handles HTTP error status", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(<PostList />);

    await waitFor(() => {
      expect(screen.getByTestId("error")).toBeInTheDocument();
    });

    expect(
      screen.getByText("Error: Failed to fetch posts")
    ).toBeInTheDocument();
  });
});
```

## Testing Best Practices

### Query Priority

```tsx
// Good: Use accessible queries first
screen.getByRole("button", { name: /submit/i });
screen.getByLabelText(/email/i);
screen.getByPlaceholderText(/enter your name/i);
screen.getByText(/welcome/i);

// Less ideal: Use test IDs as a last resort
screen.getByTestId("submit-button");
```

### Test Structure

```tsx
describe("Component Name", () => {
  // Setup before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Group related tests
  describe("when user is authenticated", () => {
    it("should display user dashboard", () => {
      // Test implementation
    });
  });

  describe("when user is not authenticated", () => {
    it("should redirect to login", () => {
      // Test implementation
    });
  });

  // Test error states
  describe("error handling", () => {
    it("should display error message when API fails", () => {
      // Test implementation
    });
  });
});
```

## Common Testing Patterns

### Testing Custom Hooks with Dependencies

```tsx
// hooks/useDebounce.ts
import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number): T {
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

// hooks/__tests__/useDebounce.test.ts
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "../useDebounce";

// Mock timers
jest.useFakeTimers();

describe("useDebounce", () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it("returns initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 500));
    expect(result.current).toBe("initial");
  });

  it("debounces value changes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 500 } }
    );

    expect(result.current).toBe("initial");

    // Change value
    rerender({ value: "updated", delay: 500 });
    expect(result.current).toBe("initial"); // Still initial

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe("updated");
  });

  it("cancels previous timeout on rapid changes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 500 } }
    );

    rerender({ value: "first", delay: 500 });
    rerender({ value: "second", delay: 500 });
    rerender({ value: "final", delay: 500 });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe("final");
  });
});
```

## Interview Questions

### Q: What's the difference between getByRole and getByTestId?

**Answer:** `getByRole` queries elements by their accessibility role (button, textbox, etc.) and is more user-centric. `getByTestId` uses data-testid attributes and should be used as a last resort when accessible queries aren't sufficient.

### Q: How do you test async operations in React components?

**Answer:** Use `waitFor` for async state changes, mock API calls with jest.fn(), handle loading states, and test both success and error scenarios. Always wait for the loading state to complete.

### Q: What's the best way to test components that use Context?

**Answer:** Create a custom render function that wraps components with the necessary providers, or create test-specific context values and providers for different test scenarios.

### Q: How do you test custom hooks?

**Answer:** Use `renderHook` from @testing-library/react-hooks, wrap hooks in act() when triggering state changes, and test both the hook's return values and side effects.
