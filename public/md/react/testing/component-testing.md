# Component Testing with React Testing Library

React Testing Library provides utilities for testing React components in a way that resembles how users interact with your application, focusing on testing behavior rather than implementation details.

## Core Principles and Setup

### Testing Philosophy

React Testing Library follows these principles:

- Test your software the way users use it
- Find elements by accessibility markers, not implementation details
- Test behavior, not implementation
- Avoid testing internal state or methods

### Basic Setup

```typescript
// src/setupTests.ts
import "@testing-library/jest-dom";
import { configure } from "@testing-library/react";

configure({
  testIdAttribute: "data-testid",
  asyncUtilTimeout: 2000,
});

// Global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
```

## Finding Elements

### Query Types and Priority

```typescript
import React from "react";
import { render, screen } from "@testing-library/react";

const LoginForm: React.FC = () => {
  return (
    <form aria-label="Login form">
      <h1>Sign In</h1>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        placeholder="Enter your email"
        aria-describedby="email-help"
      />
      <div id="email-help">We'll never share your email</div>

      <label htmlFor="password">Password</label>
      <input id="password" type="password" placeholder="Enter password" />

      <button type="submit">Sign In</button>
      <a href="/forgot-password">Forgot password?</a>

      <img src="/logo.png" alt="Company logo" />
      <div data-testid="login-status">Ready to login</div>
    </form>
  );
};

describe("LoginForm Queries", () => {
  beforeEach(() => {
    render(<LoginForm />);
  });

  describe("Accessible queries (preferred)", () => {
    it("should find by role", () => {
      expect(
        screen.getByRole("form", { name: "Login form" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "Sign In" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("textbox", { name: "Email" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Sign In" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: "Forgot password?" })
      ).toBeInTheDocument();
    });

    it("should find by label text", () => {
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();
    });

    it("should find by placeholder text", () => {
      expect(
        screen.getByPlaceholderText("Enter your email")
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Enter password")).toBeInTheDocument();
    });

    it("should find by text content", () => {
      expect(screen.getByText("Sign In")).toBeInTheDocument();
      expect(
        screen.getByText("We'll never share your email")
      ).toBeInTheDocument();
    });
  });

  describe("Semantic queries", () => {
    it("should find by alt text", () => {
      expect(screen.getByAltText("Company logo")).toBeInTheDocument();
    });

    it("should find by display value", () => {
      const emailInput = screen.getByDisplayValue("");
      expect(emailInput).toBeInTheDocument();
    });
  });

  describe("Test ID queries (last resort)", () => {
    it("should find by test id", () => {
      expect(screen.getByTestId("login-status")).toBeInTheDocument();
    });
  });
});
```

### Query Variants

```typescript
describe("Query Variants", () => {
  it("should demonstrate getBy queries", () => {
    render(<LoginForm />);

    // getBy* - throws error if not found or multiple found
    expect(screen.getByRole("button")).toBeInTheDocument();

    // Throws error if multiple buttons exist
    expect(() => screen.getByRole("textbox")).toThrow();
  });

  it("should demonstrate queryBy queries", () => {
    render(<LoginForm />);

    // queryBy* - returns null if not found, throws if multiple found
    expect(screen.queryByText("Not found")).toBeNull();
    expect(screen.queryByRole("button")).toBeInTheDocument();
  });

  it("should demonstrate findBy queries", async () => {
    render(<AsyncComponent />);

    // findBy* - returns promise, waits for element to appear
    const asyncElement = await screen.findByText("Loaded content");
    expect(asyncElement).toBeInTheDocument();
  });

  it("should demonstrate getAllBy queries", () => {
    render(<LoginForm />);

    // getAllBy* - returns array, throws if none found
    const textboxes = screen.getAllByRole("textbox");
    expect(textboxes).toHaveLength(2);
  });

  it("should demonstrate queryAllBy queries", () => {
    render(<LoginForm />);

    // queryAllBy* - returns array, returns empty array if none found
    const nonExistentElements = screen.queryAllByText("Not found");
    expect(nonExistentElements).toHaveLength(0);
  });
});
```

## User Interactions

### FireEvent vs UserEvent

```typescript
import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const InteractiveForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    agree: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, name: e.target.value }))
        }
      />

      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, email: e.target.value }))
        }
      />

      <label>
        <input
          type="checkbox"
          checked={formData.agree}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, agree: e.target.checked }))
          }
        />
        I agree to terms
      </label>

      <button type="submit">Submit</button>
      <div data-testid="form-data">{JSON.stringify(formData)}</div>
    </form>
  );
};

describe("User Interactions", () => {
  describe("Using fireEvent (synchronous)", () => {
    it("should handle form interactions with fireEvent", () => {
      render(<InteractiveForm />);

      const nameInput = screen.getByPlaceholderText("Name");
      const emailInput = screen.getByPlaceholderText("Email");
      const checkbox = screen.getByRole("checkbox");

      // Fire events directly
      fireEvent.change(nameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.click(checkbox);

      expect(nameInput).toHaveValue("John Doe");
      expect(emailInput).toHaveValue("john@example.com");
      expect(checkbox).toBeChecked();
    });
  });

  describe("Using userEvent (recommended)", () => {
    it("should handle form interactions with userEvent", async () => {
      const user = userEvent.setup();
      render(<InteractiveForm />);

      const nameInput = screen.getByPlaceholderText("Name");
      const emailInput = screen.getByPlaceholderText("Email");
      const checkbox = screen.getByRole("checkbox");

      // Simulate real user interactions
      await user.type(nameInput, "John Doe");
      await user.type(emailInput, "john@example.com");
      await user.click(checkbox);

      expect(nameInput).toHaveValue("John Doe");
      expect(emailInput).toHaveValue("john@example.com");
      expect(checkbox).toBeChecked();
    });

    it("should handle complex typing scenarios", async () => {
      const user = userEvent.setup();
      render(<InteractiveForm />);

      const nameInput = screen.getByPlaceholderText("Name");

      // Type and then clear
      await user.type(nameInput, "John");
      await user.clear(nameInput);
      await user.type(nameInput, "Jane Doe");

      expect(nameInput).toHaveValue("Jane Doe");
    });

    it("should handle keyboard interactions", async () => {
      const user = userEvent.setup();
      render(<InteractiveForm />);

      const nameInput = screen.getByPlaceholderText("Name");

      await user.type(nameInput, "John Doe");
      await user.keyboard("{Tab}");

      const emailInput = screen.getByPlaceholderText("Email");
      expect(emailInput).toHaveFocus();

      await user.type(emailInput, "john@example.com");
      await user.keyboard("{Enter}");

      // Form should be submitted
    });
  });
});
```

### Advanced Interactions

```typescript
const AdvancedComponent: React.FC = () => {
  const [items, setItems] = useState(["Item 1", "Item 2"]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleDragStart = (item: string) => {
    setDraggedItem(item);
  };

  const handleDrop = (targetItem: string) => {
    if (draggedItem && draggedItem !== targetItem) {
      const newItems = [...items];
      const draggedIndex = newItems.indexOf(draggedItem);
      const targetIndex = newItems.indexOf(targetItem);

      newItems.splice(draggedIndex, 1);
      newItems.splice(targetIndex, 0, draggedItem);

      setItems(newItems);
    }
    setDraggedItem(null);
  };

  return (
    <div>
      {items.map((item) => (
        <div
          key={item}
          draggable
          onDragStart={() => handleDragStart(item)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(item)}
          data-testid={`item-${item.replace(" ", "-").toLowerCase()}`}
        >
          {item}
        </div>
      ))}

      <input
        type="file"
        onChange={(e) => console.log("File selected:", e.target.files)}
        data-testid="file-input"
      />
    </div>
  );
};

describe("Advanced Interactions", () => {
  it("should handle drag and drop", async () => {
    const user = userEvent.setup();
    render(<AdvancedComponent />);

    const item1 = screen.getByTestId("item-item-1");
    const item2 = screen.getByTestId("item-item-2");

    // Simulate drag and drop
    await user.pointer([
      { keys: "[MouseLeft>]", target: item1 },
      { coords: { x: 0, y: 0 } },
      { target: item2 },
      { keys: "[/MouseLeft]" },
    ]);

    // Verify order changed
    const items = screen.getAllByTestId(/item-/);
    expect(items[0]).toHaveTextContent("Item 2");
    expect(items[1]).toHaveTextContent("Item 1");
  });

  it("should handle file upload", async () => {
    const user = userEvent.setup();
    render(<AdvancedComponent />);

    const file = new File(["hello"], "hello.png", { type: "image/png" });
    const fileInput = screen.getByTestId("file-input");

    await user.upload(fileInput, file);

    expect(fileInput.files[0]).toBe(file);
    expect(fileInput.files).toHaveLength(1);
  });

  it("should handle hover interactions", async () => {
    const user = userEvent.setup();
    const mockOnHover = jest.fn();

    const HoverComponent: React.FC = () => (
      <div onMouseEnter={mockOnHover} data-testid="hover-target">
        Hover me
      </div>
    );

    render(<HoverComponent />);

    const target = screen.getByTestId("hover-target");
    await user.hover(target);

    expect(mockOnHover).toHaveBeenCalled();
  });
});
```

## Async Testing

### Waiting for Elements

```typescript
const AsyncDataComponent: React.FC = () => {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await fetch("/api/data");

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.text();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={fetchData}>Load Data</button>
      {loading && <div>Loading...</div>}
      {error && <div role="alert">Error: {error}</div>}
      {data && <div data-testid="data-content">{data}</div>}
    </div>
  );
};

describe("Async Testing", () => {
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    mockFetch.mockClear();
  });

  it("should show loading state and then data", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: async () => "Fetched data",
    } as Response);

    const user = userEvent.setup();
    render(<AsyncDataComponent />);

    const loadButton = screen.getByRole("button", { name: "Load Data" });
    await user.click(loadButton);

    // Wait for loading state
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    // Wait for data to appear
    const dataContent = await screen.findByTestId("data-content");
    expect(dataContent).toHaveTextContent("Fetched data");

    // Loading should be gone
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("should show error state on failed request", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
    } as Response);

    const user = userEvent.setup();
    render(<AsyncDataComponent />);

    await user.click(screen.getByRole("button", { name: "Load Data" }));

    const errorMessage = await screen.findByRole("alert");
    expect(errorMessage).toHaveTextContent("Error: Failed to fetch data");
  });

  it("should handle multiple state changes", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        text: async () => "First data",
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        text: async () => "Second data",
      } as Response);

    const user = userEvent.setup();
    render(<AsyncDataComponent />);

    const loadButton = screen.getByRole("button", { name: "Load Data" });

    // First request
    await user.click(loadButton);
    await screen.findByText("First data");

    // Second request
    await user.click(loadButton);
    await screen.findByText("Second data");

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});
```

### Using waitFor for Complex Conditions

```typescript
import { waitFor } from "@testing-library/react";

const ComplexAsyncComponent: React.FC = () => {
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState("idle");

  const handleComplexOperation = async () => {
    setStatus("processing");

    for (let i = 0; i < 5; i++) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setCount((prev) => prev + 1);
    }

    setStatus("complete");
  };

  return (
    <div>
      <button onClick={handleComplexOperation}>Start Operation</button>
      <div data-testid="count">Count: {count}</div>
      <div data-testid="status">Status: {status}</div>
    </div>
  );
};

describe("Complex Async Operations", () => {
  it("should wait for multiple state updates", async () => {
    const user = userEvent.setup();
    render(<ComplexAsyncComponent />);

    await user.click(screen.getByRole("button", { name: "Start Operation" }));

    // Wait for processing to start
    await waitFor(() => {
      expect(screen.getByTestId("status")).toHaveTextContent(
        "Status: processing"
      );
    });

    // Wait for final state
    await waitFor(
      () => {
        expect(screen.getByTestId("count")).toHaveTextContent("Count: 5");
        expect(screen.getByTestId("status")).toHaveTextContent(
          "Status: complete"
        );
      },
      { timeout: 2000 }
    );
  });

  it("should wait for custom condition", async () => {
    const user = userEvent.setup();
    render(<ComplexAsyncComponent />);

    await user.click(screen.getByRole("button"));

    // Wait for count to reach specific value
    await waitFor(() => {
      const countElement = screen.getByTestId("count");
      const countText = countElement.textContent;
      const currentCount = parseInt(countText.replace("Count: ", ""));
      expect(currentCount).toBeGreaterThan(2);
    });
  });

  it("should handle timeout scenarios", async () => {
    const SlowComponent: React.FC = () => {
      const [show, setShow] = useState(false);

      useEffect(() => {
        setTimeout(() => setShow(true), 3000);
      }, []);

      return show ? <div>Finally appeared</div> : <div>Waiting...</div>;
    };

    render(<SlowComponent />);

    // This should timeout
    await expect(
      waitFor(() => screen.getByText("Finally appeared"), { timeout: 1000 })
    ).rejects.toThrow();
  });
});
```

## Testing Custom Hooks

### Hook Testing Utilities

```typescript
import { renderHook, act } from "@testing-library/react";

// Custom hook to test
function useCounter(initialValue = 0) {
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

  return {
    count,
    increment,
    decrement,
    reset,
  };
}

describe("useCounter Hook", () => {
  it("should initialize with default value", () => {
    const { result } = renderHook(() => useCounter());

    expect(result.current.count).toBe(0);
  });

  it("should initialize with custom value", () => {
    const { result } = renderHook(() => useCounter(5));

    expect(result.current.count).toBe(5);
  });

  it("should increment count", () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it("should decrement count", () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(4);
  });

  it("should reset to initial value", () => {
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

  it("should update when initial value changes", () => {
    let initialValue = 0;
    const { result, rerender } = renderHook(() => useCounter(initialValue));

    expect(result.current.count).toBe(0);

    initialValue = 5;
    rerender();

    act(() => {
      result.current.reset();
    });

    expect(result.current.count).toBe(5);
  });
});
```

### Testing Hooks with Context

```typescript
import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  user: { name: string } | null;
  login: (name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ name: string } | null>(null);

  const login = (name: string) => setUser({ name });
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

describe("useAuth Hook", () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  it("should throw error when used outside provider", () => {
    const { result } = renderHook(() => useAuth());

    expect(result.error).toEqual(
      Error("useAuth must be used within AuthProvider")
    );
  });

  it("should provide auth functionality", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBeNull();

    act(() => {
      result.current.login("John Doe");
    });

    expect(result.current.user).toEqual({ name: "John Doe" });

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
  });
});
```

## Testing Forms

### Complex Form Testing

```typescript
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const userSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  age: z.number().min(18, "Must be at least 18 years old"),
  terms: z.boolean().refine((val) => val === true, "You must accept the terms"),
});

type UserFormData = z.infer<typeof userSchema>;

const UserForm: React.FC<{ onSubmit: (data: UserFormData) => void }> = ({
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="firstName">First Name</label>
        <input
          id="firstName"
          {...register("firstName")}
          aria-invalid={errors.firstName ? "true" : "false"}
        />
        {errors.firstName && (
          <span role="alert" id="firstName-error">
            {errors.firstName.message}
          </span>
        )}
      </div>

      <div>
        <label htmlFor="lastName">Last Name</label>
        <input
          id="lastName"
          {...register("lastName")}
          aria-invalid={errors.lastName ? "true" : "false"}
        />
        {errors.lastName && (
          <span role="alert" id="lastName-error">
            {errors.lastName.message}
          </span>
        )}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register("email")}
          aria-invalid={errors.email ? "true" : "false"}
        />
        {errors.email && (
          <span role="alert" id="email-error">
            {errors.email.message}
          </span>
        )}
      </div>

      <div>
        <label htmlFor="age">Age</label>
        <input
          id="age"
          type="number"
          {...register("age", { valueAsNumber: true })}
          aria-invalid={errors.age ? "true" : "false"}
        />
        {errors.age && (
          <span role="alert" id="age-error">
            {errors.age.message}
          </span>
        )}
      </div>

      <div>
        <label>
          <input type="checkbox" {...register("terms")} />I accept the terms and
          conditions
        </label>
        {errors.terms && (
          <span role="alert" id="terms-error">
            {errors.terms.message}
          </span>
        )}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

describe("UserForm", () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it("should submit valid form data", async () => {
    const user = userEvent.setup();
    render(<UserForm onSubmit={mockOnSubmit} />);

    // Fill out the form
    await user.type(screen.getByLabelText("First Name"), "John");
    await user.type(screen.getByLabelText("Last Name"), "Doe");
    await user.type(screen.getByLabelText("Email"), "john@example.com");
    await user.type(screen.getByLabelText("Age"), "25");
    await user.click(
      screen.getByLabelText("I accept the terms and conditions")
    );

    // Submit the form
    await user.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        age: 25,
        terms: true,
      });
    });
  });

  it("should show validation errors for invalid data", async () => {
    const user = userEvent.setup();
    render(<UserForm onSubmit={mockOnSubmit} />);

    // Try to submit empty form
    await user.click(screen.getByRole("button", { name: "Submit" }));

    // Check for validation errors
    await waitFor(() => {
      expect(
        screen.getByText("First name must be at least 2 characters")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Last name must be at least 2 characters")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Please enter a valid email")
      ).toBeInTheDocument();
      expect(screen.getByText("You must accept the terms")).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("should show email validation error", async () => {
    const user = userEvent.setup();
    render(<UserForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByLabelText("Email"), "invalid-email");
    await user.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(
        screen.getByText("Please enter a valid email")
      ).toBeInTheDocument();
    });
  });

  it("should show age validation error", async () => {
    const user = userEvent.setup();
    render(<UserForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByLabelText("Age"), "16");
    await user.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(
        screen.getByText("Must be at least 18 years old")
      ).toBeInTheDocument();
    });
  });

  it("should disable submit button while submitting", async () => {
    const mockSlowSubmit = jest
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 1000))
      );

    const user = userEvent.setup();
    render(<UserForm onSubmit={mockSlowSubmit} />);

    // Fill valid data
    await user.type(screen.getByLabelText("First Name"), "John");
    await user.type(screen.getByLabelText("Last Name"), "Doe");
    await user.type(screen.getByLabelText("Email"), "john@example.com");
    await user.type(screen.getByLabelText("Age"), "25");
    await user.click(
      screen.getByLabelText("I accept the terms and conditions")
    );

    // Submit form
    await user.click(screen.getByRole("button", { name: "Submit" }));

    // Button should be disabled and show submitting text
    const submitButton = screen.getByRole("button", { name: "Submitting..." });
    expect(submitButton).toBeDisabled();
  });
});
```

## Best Practices and Patterns

### Custom Render Utilities

```typescript
// test-utils/customRender.tsx
import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  initialEntries?: string[];
  theme?: any;
}

const AllTheProviders: React.FC<{
  children: React.ReactNode;
  initialEntries?: string[];
  theme?: any;
}> = ({ children, initialEntries = ["/"], theme = defaultTheme }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (ui: ReactElement, options: CustomRenderOptions = {}) => {
  const { initialEntries, theme, ...renderOptions } = options;

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <AllTheProviders initialEntries={initialEntries} theme={theme}>
      {children}
    </AllTheProviders>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

export * from "@testing-library/react";
export { customRender as render };
```

### Page Object Model

```typescript
// test-utils/pageObjects/LoginPage.ts
export class LoginPage {
  constructor(private user: ReturnType<typeof userEvent.setup>) {}

  get emailInput() {
    return screen.getByLabelText("Email");
  }

  get passwordInput() {
    return screen.getByLabelText("Password");
  }

  get submitButton() {
    return screen.getByRole("button", { name: /sign in/i });
  }

  get errorMessage() {
    return screen.queryByRole("alert");
  }

  async fillEmail(email: string) {
    await this.user.clear(this.emailInput);
    await this.user.type(this.emailInput, email);
  }

  async fillPassword(password: string) {
    await this.user.clear(this.passwordInput);
    await this.user.type(this.passwordInput, password);
  }

  async submit() {
    await this.user.click(this.submitButton);
  }

  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submit();
  }

  expectErrorMessage(message: string) {
    expect(this.errorMessage).toHaveTextContent(message);
  }

  expectSuccessfulLogin() {
    expect(this.errorMessage).not.toBeInTheDocument();
  }
}

// Usage in tests
describe("Login Flow", () => {
  it("should handle successful login", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const loginPage = new LoginPage(user);

    await loginPage.login("user@example.com", "password123");

    loginPage.expectSuccessfulLogin();
  });
});
```

## Interview Questions

**Q: What's the difference between getBy, queryBy, and findBy queries?**
A: Query differences:

- **getBy**: Throws error if not found, immediate
- **queryBy**: Returns null if not found, immediate
- **findBy**: Returns promise, waits for element
- **getAllBy**: Returns array, throws if none found
- **queryAllBy**: Returns empty array if none found

**Q: How do you test user interactions in React Testing Library?**
A: Use userEvent for realistic interactions:

- `userEvent.click()` for clicks
- `userEvent.type()` for typing
- `userEvent.hover()` for hover
- `userEvent.keyboard()` for key presses
- `userEvent.upload()` for file uploads
- Prefer userEvent over fireEvent for better simulation

**Q: How do you handle async operations in tests?**
A: Several approaches:

- `findBy` queries that wait for elements
- `waitFor` for complex conditions
- Mock async functions with resolved/rejected values
- Test loading and error states
- Use proper timeouts for slow operations

**Q: What's the best way to query elements?**
A: Priority order:

1. **Accessible queries**: getByRole, getByLabelText
2. **Semantic queries**: getByAltText, getByTitle
3. **Content queries**: getByText, getByDisplayValue
4. **Test IDs**: getByTestId (last resort)
5. Avoid querying by class names or IDs

**Q: How do you test custom hooks?**
A: Use renderHook from React Testing Library:

- `renderHook()` to render the hook
- `act()` to wrap state updates
- Test hook behavior, not implementation
- Provide context wrappers when needed
- Test hook dependencies and updates
