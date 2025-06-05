# Jest Testing with React

Jest is a delightful JavaScript testing framework with a focus on simplicity, providing everything needed to test React applications out of the box.

## Setup and Configuration

### Basic Jest Configuration

```json
{
  "name": "react-app",
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "jest": {
    "testEnvironment": "jsdom",
    "setupFilesAfterEnv": ["<rootDir>/src/setupTests.ts"],
    "moduleNameMapping": {
      "^@/(.*)$": "<rootDir>/src/$1",
      "\\.(css|less|scss|sass)$": "identity-obj-proxy"
    },
    "transform": {
      "^.+\\.(ts|tsx)$": "ts-jest",
      "^.+\\.(js|jsx)$": "babel-jest"
    },
    "collectCoverageFrom": [
      "src/**/*.{ts,tsx}",
      "!src/**/*.d.ts",
      "!src/index.tsx"
    ]
  }
}
```

### Setup File Configuration

```typescript
// src/setupTests.ts
import "@testing-library/jest-dom";
import { configure } from "@testing-library/react";

configure({ testIdAttribute: "data-testid" });

global.matchMedia =
  global.matchMedia ||
  function (query) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };
  };

Object.defineProperty(window, "localStorage", {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
});

global.fetch = jest.fn();
```

## Basic Testing Patterns

### Testing Pure Functions

```typescript
// utils/math.ts
export const add = (a: number, b: number): number => a + b;

export const multiply = (a: number, b: number): number => a * b;

export const divide = (a: number, b: number): number => {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// utils/__tests__/math.test.ts
import { add, multiply, divide, formatCurrency } from "../math";

describe("Math utilities", () => {
  describe("add", () => {
    it("should add two positive numbers", () => {
      expect(add(2, 3)).toBe(5);
    });

    it("should add negative numbers", () => {
      expect(add(-2, -3)).toBe(-5);
    });

    it("should add zero", () => {
      expect(add(5, 0)).toBe(5);
    });
  });

  describe("multiply", () => {
    it("should multiply two numbers", () => {
      expect(multiply(3, 4)).toBe(12);
    });

    it("should return zero when multiplied by zero", () => {
      expect(multiply(5, 0)).toBe(0);
    });
  });

  describe("divide", () => {
    it("should divide two numbers", () => {
      expect(divide(10, 2)).toBe(5);
    });

    it("should throw error when dividing by zero", () => {
      expect(() => divide(10, 0)).toThrow("Cannot divide by zero");
    });
  });

  describe("formatCurrency", () => {
    it("should format currency correctly", () => {
      expect(formatCurrency(1234.56)).toBe("$1,234.56");
    });

    it("should handle zero", () => {
      expect(formatCurrency(0)).toBe("$0.00");
    });
  });
});
```

### Testing Async Functions

```typescript
// services/userService.ts
export interface User {
  id: string;
  name: string;
  email: string;
}

export class UserService {
  async fetchUser(id: string): Promise<User> {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }
    return response.json();
  }

  async createUser(userData: Omit<User, "id">): Promise<User> {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error(`Failed to create user: ${response.statusText}`);
    }
    return response.json();
  }
}

// services/__tests__/userService.test.ts
import { UserService } from "../userService";

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe("UserService", () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    mockFetch.mockClear();
  });

  describe("fetchUser", () => {
    it("should fetch user successfully", async () => {
      const mockUser = { id: "1", name: "John Doe", email: "john@example.com" };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      } as Response);

      const result = await userService.fetchUser("1");

      expect(mockFetch).toHaveBeenCalledWith("/api/users/1");
      expect(result).toEqual(mockUser);
    });

    it("should throw error when fetch fails", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: "Not Found",
      } as Response);

      await expect(userService.fetchUser("1")).rejects.toThrow(
        "Failed to fetch user: Not Found"
      );
    });
  });

  describe("createUser", () => {
    it("should create user successfully", async () => {
      const userData = { name: "Jane Doe", email: "jane@example.com" };
      const createdUser = { id: "2", ...userData };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => createdUser,
      } as Response);

      const result = await userService.createUser(userData);

      expect(mockFetch).toHaveBeenCalledWith("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      expect(result).toEqual(createdUser);
    });
  });
});
```

## Mocking Strategies

### Mocking Modules

```typescript
// utils/dateUtils.ts
export const getCurrentDate = (): string => {
  return new Date().toISOString().split("T")[0];
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US");
};

// components/DateDisplay.tsx
import React from "react";
import { getCurrentDate, formatDate } from "../utils/dateUtils";

export const DateDisplay: React.FC = () => {
  const currentDate = getCurrentDate();
  const formattedDate = formatDate(new Date(currentDate));

  return (
    <div>
      <p>Current Date: {currentDate}</p>
      <p>Formatted: {formattedDate}</p>
    </div>
  );
};

// components/__tests__/DateDisplay.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { DateDisplay } from "../DateDisplay";

// Mock the entire module
jest.mock("../../utils/dateUtils", () => ({
  getCurrentDate: jest.fn(() => "2023-12-25"),
  formatDate: jest.fn(() => "December 25, 2023"),
}));

describe("DateDisplay", () => {
  it("should display current and formatted date", () => {
    render(<DateDisplay />);

    expect(screen.getByText("Current Date: 2023-12-25")).toBeInTheDocument();
    expect(
      screen.getByText("Formatted: December 25, 2023")
    ).toBeInTheDocument();
  });
});
```

### Partial Mocking

```typescript
// services/apiService.ts
export class ApiService {
  private baseUrl = process.env.REACT_APP_API_URL || "/api";

  async get(endpoint: string) {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    return response.json();
  }

  async post(endpoint: string, data: any) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  getBaseUrl() {
    return this.baseUrl;
  }
}

// services/__tests__/apiService.test.ts
import { ApiService } from "../apiService";

// Partial mock - only mock fetch, keep other methods
jest.mock("global", () => ({
  ...jest.requireActual("global"),
  fetch: jest.fn(),
}));

describe("ApiService", () => {
  let apiService: ApiService;
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    apiService = new ApiService();
    mockFetch.mockClear();
  });

  it("should make GET requests", async () => {
    const mockData = { id: 1, name: "Test" };
    mockFetch.mockResolvedValueOnce({
      json: async () => mockData,
    } as Response);

    const result = await apiService.get("/users");

    expect(mockFetch).toHaveBeenCalledWith("/api/users");
    expect(result).toEqual(mockData);
  });

  it("should return correct base URL", () => {
    expect(apiService.getBaseUrl()).toBe("/api");
  });
});
```

### Mock Implementations

```typescript
// hooks/useLocalStorage.ts
import { useState, useEffect } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  return [storedValue, setValue];
}

// hooks/__tests__/useLocalStorage.test.ts
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "../useLocalStorage";

describe("useLocalStorage", () => {
  const mockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };

  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      value: mockLocalStorage,
      writable: true,
    });
    jest.clearAllMocks();
  });

  it("should return initial value when localStorage is empty", () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useLocalStorage("test-key", "default"));

    expect(result.current[0]).toBe("default");
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith("test-key");
  });

  it("should return stored value from localStorage", () => {
    mockLocalStorage.getItem.mockReturnValue('"stored value"');

    const { result } = renderHook(() => useLocalStorage("test-key", "default"));

    expect(result.current[0]).toBe("stored value");
  });

  it("should save value to localStorage", () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useLocalStorage("test-key", "default"));

    act(() => {
      result.current[1]("new value");
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      "test-key",
      '"new value"'
    );
    expect(result.current[0]).toBe("new value");
  });

  it("should handle localStorage errors gracefully", () => {
    mockLocalStorage.getItem.mockImplementation(() => {
      throw new Error("localStorage error");
    });

    const { result } = renderHook(() => useLocalStorage("test-key", "default"));

    expect(result.current[0]).toBe("default");
  });
});
```

## Testing Timers and Dates

### Testing with Fake Timers

```typescript
// utils/timer.ts
export class Timer {
  private timeoutId: NodeJS.Timeout | null = null;

  start(callback: () => void, delay: number) {
    this.timeoutId = setTimeout(callback, delay);
  }

  stop() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}

// components/AutoSave.tsx
import React, { useEffect, useState } from "react";
import { Timer } from "../utils/timer";

interface AutoSaveProps {
  data: string;
  onSave: (data: string) => void;
  delay?: number;
}

export const AutoSave: React.FC<AutoSaveProps> = ({
  data,
  onSave,
  delay = 2000,
}) => {
  const [timer] = useState(() => new Timer());
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    timer.stop();

    if (data) {
      timer.start(() => {
        setIsSaving(true);
        onSave(data);
        setIsSaving(false);
      }, delay);
    }

    return () => timer.stop();
  }, [data, onSave, delay, timer]);

  return <div>{isSaving && <span>Saving...</span>}</div>;
};

// components/__tests__/AutoSave.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { AutoSave } from "../AutoSave";

describe("AutoSave", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should call onSave after delay", () => {
    const mockOnSave = jest.fn();

    render(<AutoSave data="test data" onSave={mockOnSave} delay={1000} />);

    expect(mockOnSave).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1000);

    expect(mockOnSave).toHaveBeenCalledWith("test data");
  });

  it("should reset timer when data changes", () => {
    const mockOnSave = jest.fn();

    const { rerender } = render(
      <AutoSave data="initial" onSave={mockOnSave} delay={1000} />
    );

    jest.advanceTimersByTime(500);

    rerender(<AutoSave data="updated" onSave={mockOnSave} delay={1000} />);

    jest.advanceTimersByTime(500);
    expect(mockOnSave).not.toHaveBeenCalled();

    jest.advanceTimersByTime(500);
    expect(mockOnSave).toHaveBeenCalledWith("updated");
  });

  it("should show saving indicator", () => {
    const mockOnSave = jest.fn();

    render(<AutoSave data="test" onSave={mockOnSave} delay={1000} />);

    expect(screen.queryByText("Saving...")).not.toBeInTheDocument();

    jest.advanceTimersByTime(1000);

    expect(screen.getByText("Saving...")).toBeInTheDocument();
  });
});
```

### Testing Date-Dependent Code

```typescript
// utils/dateHelpers.ts
export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

export const getBusinessDaysUntil = (targetDate: Date): number => {
  const today = new Date();
  let businessDays = 0;
  const current = new Date(today);

  while (current < targetDate) {
    if (!isWeekend(current)) {
      businessDays++;
    }
    current.setDate(current.getDate() + 1);
  }

  return businessDays;
};

// utils/__tests__/dateHelpers.test.ts
import { isWeekend, getBusinessDaysUntil } from "../dateHelpers";

describe("Date helpers", () => {
  describe("isWeekend", () => {
    it("should return true for Saturday", () => {
      const saturday = new Date("2023-12-23"); // Saturday
      expect(isWeekend(saturday)).toBe(true);
    });

    it("should return true for Sunday", () => {
      const sunday = new Date("2023-12-24"); // Sunday
      expect(isWeekend(sunday)).toBe(true);
    });

    it("should return false for weekdays", () => {
      const monday = new Date("2023-12-25"); // Monday
      expect(isWeekend(monday)).toBe(false);
    });
  });

  describe("getBusinessDaysUntil", () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2023-12-20")); // Wednesday
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should calculate business days correctly", () => {
      const targetDate = new Date("2023-12-27"); // Next Wednesday
      const businessDays = getBusinessDaysUntil(targetDate);

      expect(businessDays).toBe(5); // Thu, Fri, Mon, Tue, Wed
    });

    it("should exclude weekends", () => {
      const targetDate = new Date("2023-12-25"); // Monday
      const businessDays = getBusinessDaysUntil(targetDate);

      expect(businessDays).toBe(3); // Thu, Fri, Mon
    });
  });
});
```

## Snapshot Testing

### Component Snapshots

```typescript
// components/UserCard.tsx
import React from "react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "admin" | "user";
}

interface UserCardProps {
  user: User;
  onClick?: () => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onClick }) => {
  return (
    <div className="user-card" onClick={onClick}>
      {user.avatar && <img src={user.avatar} alt={`${user.name}'s avatar`} />}
      <div className="user-info">
        <h3>{user.name}</h3>
        <p>{user.email}</p>
        <span className={`role role-${user.role}`}>{user.role}</span>
      </div>
    </div>
  );
};

// components/__tests__/UserCard.test.tsx
import React from "react";
import { render } from "@testing-library/react";
import { UserCard } from "../UserCard";

describe("UserCard", () => {
  const mockUser = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "admin" as const,
  };

  it("should match snapshot with basic user", () => {
    const { container } = render(<UserCard user={mockUser} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should match snapshot with avatar", () => {
    const userWithAvatar = {
      ...mockUser,
      avatar: "https://example.com/avatar.jpg",
    };

    const { container } = render(<UserCard user={userWithAvatar} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should match snapshot for regular user", () => {
    const regularUser = {
      ...mockUser,
      role: "user" as const,
    };

    const { container } = render(<UserCard user={regularUser} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
```

### Inline Snapshots

```typescript
// components/__tests__/Button.test.tsx
import React from "react";
import { render } from "@testing-library/react";
import { Button } from "../Button";

describe("Button", () => {
  it("should render primary button", () => {
    const { container } = render(
      <Button variant="primary" onClick={() => {}}>
        Click me
      </Button>
    );

    expect(container.firstChild).toMatchInlineSnapshot(`
      <button
        class="button button-primary"
        type="button"
      >
        Click me
      </button>
    `);
  });

  it("should render disabled button", () => {
    const { container } = render(
      <Button disabled onClick={() => {}}>
        Disabled
      </Button>
    );

    expect(container.firstChild).toMatchInlineSnapshot(`
      <button
        class="button"
        disabled=""
        type="button"
      >
        Disabled
      </button>
    `);
  });
});
```

## Testing Patterns and Best Practices

### Test Organization

```typescript
// components/__tests__/TodoList.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { TodoList } from "../TodoList";

describe("TodoList", () => {
  const defaultProps = {
    todos: [
      { id: "1", text: "First todo", completed: false },
      { id: "2", text: "Second todo", completed: true },
    ],
    onToggle: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render all todos", () => {
      render(<TodoList {...defaultProps} />);

      expect(screen.getByText("First todo")).toBeInTheDocument();
      expect(screen.getByText("Second todo")).toBeInTheDocument();
    });

    it("should render empty state when no todos", () => {
      render(<TodoList {...defaultProps} todos={[]} />);

      expect(screen.getByText("No todos found")).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("should call onToggle when checkbox is clicked", () => {
      render(<TodoList {...defaultProps} />);

      const firstCheckbox = screen.getAllByRole("checkbox")[0];
      fireEvent.click(firstCheckbox);

      expect(defaultProps.onToggle).toHaveBeenCalledWith("1");
    });

    it("should call onDelete when delete button is clicked", () => {
      render(<TodoList {...defaultProps} />);

      const deleteButtons = screen.getAllByLabelText("Delete todo");
      fireEvent.click(deleteButtons[0]);

      expect(defaultProps.onDelete).toHaveBeenCalledWith("1");
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels", () => {
      render(<TodoList {...defaultProps} />);

      expect(screen.getByRole("list")).toBeInTheDocument();
      expect(screen.getAllByRole("listitem")).toHaveLength(2);
    });
  });
});
```

### Custom Test Utilities

```typescript
// test-utils/renderWithProviders.tsx
import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { configureStore } from "@reduxjs/toolkit";
import { theme } from "../styles/theme";

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  preloadedState?: any;
  store?: any;
  route?: string;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    store = configureStore({
      reducer: {},
      preloadedState,
    }),
    route = "/",
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  window.history.pushState({}, "Test page", route);

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </BrowserRouter>
      </Provider>
    );
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

// Usage in tests
import { renderWithProviders } from "../../test-utils/renderWithProviders";

describe("ConnectedComponent", () => {
  it("should render with Redux store", () => {
    renderWithProviders(<ConnectedComponent />, {
      preloadedState: {
        auth: { user: mockUser },
      },
    });

    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
  });
});
```

### Testing Error Boundaries

```typescript
// components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div>
            <h2>Something went wrong</h2>
            <p>{this.state.error?.message}</p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// components/__tests__/ErrorBoundary.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "../ErrorBoundary";

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div>No error</div>;
};

describe("ErrorBoundary", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should render children when no error", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText("No error")).toBeInTheDocument();
  });

  it("should render error fallback when error occurs", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Test error")).toBeInTheDocument();
  });

  it("should render custom fallback", () => {
    const customFallback = <div>Custom error message</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Custom error message")).toBeInTheDocument();
  });
});
```

## Performance Testing

### Testing Component Performance

```typescript
// test-utils/performanceUtils.ts
export const measureRenderTime = (renderFn: () => void): number => {
  const start = performance.now();
  renderFn();
  const end = performance.now();
  return end - start;
};

export const expectFastRender = (renderTime: number, threshold = 16): void => {
  expect(renderTime).toBeLessThan(threshold);
};

// components/__tests__/ExpensiveComponent.test.tsx
import React from "react";
import { render } from "@testing-library/react";
import { ExpensiveComponent } from "../ExpensiveComponent";
import {
  measureRenderTime,
  expectFastRender,
} from "../../test-utils/performanceUtils";

describe("ExpensiveComponent Performance", () => {
  it("should render quickly with small dataset", () => {
    const smallData = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
    }));

    const renderTime = measureRenderTime(() => {
      render(<ExpensiveComponent data={smallData} />);
    });

    expectFastRender(renderTime, 50);
  });

  it("should handle large datasets efficiently", () => {
    const largeData = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
    }));

    const renderTime = measureRenderTime(() => {
      render(<ExpensiveComponent data={largeData} />);
    });

    expect(renderTime).toBeLessThan(100);
  });
});
```

## Interview Questions

**Q: How do you test async operations in Jest?**
A: Several approaches:

- Use `async/await` with test functions
- Use `resolves` and `rejects` matchers
- Mock fetch or axios requests
- Use `waitFor` from React Testing Library
- Test loading and error states

**Q: What's the difference between unit tests and integration tests?**
A:

- **Unit tests**: Test individual functions/components in isolation
- **Integration tests**: Test how multiple parts work together
- **Unit**: Fast, focused, many in number
- **Integration**: Slower, broader scope, fewer in number
- Both are important for comprehensive testing

**Q: How do you mock external dependencies in Jest?**
A: Multiple strategies:

- `jest.mock()` for entire modules
- `jest.fn()` for individual functions
- Manual mocks in `__mocks__` directory
- Partial mocking with `jest.requireActual()`
- Spy on methods with `jest.spyOn()`

**Q: What are snapshot tests and when should you use them?**
A: Snapshot tests capture component output:

- Good for preventing unintended UI changes
- Useful for testing component props combinations
- Can become brittle with frequent changes
- Should supplement, not replace, other test types
- Update snapshots carefully after reviewing changes

**Q: How do you test components that use timers or dates?**
A: Use Jest's fake timers:

- `jest.useFakeTimers()` before tests
- `jest.advanceTimersByTime()` to fast-forward
- `jest.setSystemTime()` for date testing
- `jest.useRealTimers()` in cleanup
- Mock date constructors for consistent results
