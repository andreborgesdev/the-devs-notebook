# React Mocking Strategies

Effective mocking is crucial for isolating components and testing specific functionality without external dependencies.

## Mocking External Dependencies

### Mocking API Calls

```tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { UserProfile } from "./UserProfile";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

interface User {
  id: string;
  name: string;
  email: string;
}

function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/users/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

describe("UserProfile", () => {
  beforeEach(() => {
    mockedAxios.get.mockReset();
  });

  it("should display user information", async () => {
    const mockUser = {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
    };

    mockedAxios.get.mockResolvedValue({ data: mockUser });

    render(<UserProfile userId="1" />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
    });

    expect(mockedAxios.get).toHaveBeenCalledWith("/api/users/1");
  });

  it("should handle API error", async () => {
    mockedAxios.get.mockRejectedValue(new Error("Network error"));

    render(<UserProfile userId="1" />);

    await waitFor(() => {
      expect(screen.getByText("User not found")).toBeInTheDocument();
    });
  });
});
```

### Mocking Fetch API

```tsx
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe("DataFetcher", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("should fetch and display data", async () => {
    const mockData = { message: "Hello World" };

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockData,
    } as Response);

    render(<DataFetcher url="/api/data" />);

    await waitFor(() => {
      expect(screen.getByText("Hello World")).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/data");
  });

  it("should handle fetch error", async () => {
    mockFetch.mockRejectedValue(new Error("Failed to fetch"));

    render(<DataFetcher url="/api/data" />);

    await waitFor(() => {
      expect(screen.getByText("Error loading data")).toBeInTheDocument();
    });
  });
});
```

## Mocking Browser APIs

### Mocking localStorage

```tsx
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

function UserSettings() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div>
      <span>Current theme: {theme}</span>
      <button onClick={() => handleThemeChange("dark")}>Switch to Dark</button>
    </div>
  );
}

describe("UserSettings", () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    jest.clearAllMocks();
  });

  it("should load theme from localStorage", () => {
    mockLocalStorage.getItem.mockReturnValue("dark");

    render(<UserSettings />);

    expect(screen.getByText("Current theme: dark")).toBeInTheDocument();
  });

  it("should save theme to localStorage", async () => {
    const user = userEvent.setup();

    render(<UserSettings />);

    await user.click(screen.getByText("Switch to Dark"));

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith("theme", "dark");
  });
});
```

### Mocking IntersectionObserver

```tsx
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
});

Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: mockIntersectionObserver,
});

function LazyImage({ src, alt }: { src: string; alt: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <img ref={imgRef} src={isVisible ? src : "placeholder.jpg"} alt={alt} />
  );
}

describe("LazyImage", () => {
  it("should observe image element", () => {
    const mockObserve = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: mockObserve,
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    });

    render(<LazyImage src="image.jpg" alt="Test" />);

    expect(mockObserve).toHaveBeenCalled();
  });
});
```

### Mocking ResizeObserver

```tsx
const mockResizeObserver = jest.fn();
mockResizeObserver.mockReturnValue({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
});

Object.defineProperty(window, "ResizeObserver", {
  writable: true,
  configurable: true,
  value: mockResizeObserver,
});

function ResponsiveComponent() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setSize({ width, height });
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      Size: {size.width} x {size.height}
    </div>
  );
}
```

## Mocking React Router

### Mocking useNavigate

```tsx
import { useNavigate } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

const mockNavigate = jest.fn();
(useNavigate as jest.Mock).mockReturnValue(mockNavigate);

function LoginForm() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Login</button>
    </form>
  );
}

describe("LoginForm", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  it("should navigate to dashboard on submit", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: "Login" }));

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});
```

### Mocking useParams

```tsx
import { useParams } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

function UserDetail() {
  const { userId } = useParams<{ userId: string }>();

  return <div>User ID: {userId}</div>;
}

describe("UserDetail", () => {
  it("should display user ID from params", () => {
    (useParams as jest.Mock).mockReturnValue({ userId: "123" });

    render(<UserDetail />);

    expect(screen.getByText("User ID: 123")).toBeInTheDocument();
  });
});
```

## Mocking Third-Party Libraries

### Mocking React Query

```tsx
import { useQuery } from "@tanstack/react-query";

jest.mock("@tanstack/react-query", () => ({
  ...jest.requireActual("@tanstack/react-query"),
  useQuery: jest.fn(),
}));

const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery>;

function UserList() {
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading users</div>;

  return (
    <ul>
      {users?.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

describe("UserList", () => {
  it("should display loading state", () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any);

    render(<UserList />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should display users", () => {
    const mockUsers = [
      { id: "1", name: "John" },
      { id: "2", name: "Jane" },
    ];

    mockUseQuery.mockReturnValue({
      data: mockUsers,
      isLoading: false,
      error: null,
    } as any);

    render(<UserList />);

    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Jane")).toBeInTheDocument();
  });
});
```

### Mocking Custom Hooks

```tsx
import { useAuth } from "../hooks/useAuth";

jest.mock("../hooks/useAuth");
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

function ProtectedComponent() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return <div>Welcome, {user?.name}</div>;
}

describe("ProtectedComponent", () => {
  it("should show login message when not authenticated", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    render(<ProtectedComponent />);

    expect(screen.getByText("Please log in")).toBeInTheDocument();
  });

  it("should show welcome message when authenticated", () => {
    mockUseAuth.mockReturnValue({
      user: { id: "1", name: "John Doe" },
      isAuthenticated: true,
      login: jest.fn(),
      logout: jest.fn(),
    });

    render(<ProtectedComponent />);

    expect(screen.getByText("Welcome, John Doe")).toBeInTheDocument();
  });
});
```

## Mocking Timers and Dates

### Mocking setTimeout/setInterval

```tsx
function DelayedMessage({ delay = 1000 }: { delay?: number }) {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return showMessage ? <div>Message appeared!</div> : null;
}

describe("DelayedMessage", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should show message after delay", () => {
    render(<DelayedMessage delay={1000} />);

    expect(screen.queryByText("Message appeared!")).not.toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText("Message appeared!")).toBeInTheDocument();
  });
});
```

### Mocking Date

```tsx
const mockDate = new Date("2023-01-01T12:00:00Z");

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(mockDate);
});

afterEach(() => {
  jest.useRealTimers();
});

function CurrentTime() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <div>{time.toISOString()}</div>;
}

describe("CurrentTime", () => {
  it("should display current time", () => {
    render(<CurrentTime />);

    expect(screen.getByText("2023-01-01T12:00:00.000Z")).toBeInTheDocument();
  });

  it("should update time every second", () => {
    render(<CurrentTime />);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText("2023-01-01T12:00:01.000Z")).toBeInTheDocument();
  });
});
```

## Advanced Mocking Patterns

### Partial Mocking

```tsx
import * as api from "../services/api";

jest.mock("../services/api", () => ({
  ...jest.requireActual("../services/api"),
  fetchUser: jest.fn(),
}));

const mockFetchUser = api.fetchUser as jest.MockedFunction<
  typeof api.fetchUser
>;

describe("UserComponent", () => {
  it("should call mocked fetchUser", async () => {
    mockFetchUser.mockResolvedValue({
      id: "1",
      name: "John Doe",
    });

    render(<UserComponent userId="1" />);

    expect(mockFetchUser).toHaveBeenCalledWith("1");
  });
});
```

### Mock Implementation

```tsx
const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};

jest.mock("../utils/logger", () => mockLogger);

function ErrorBoundary({ children }: { children: ReactNode }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error: Error) => {
      logger.error("Component error:", error);
      setHasError(true);
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  if (hasError) {
    return <div>Something went wrong</div>;
  }

  return <>{children}</>;
}

describe("ErrorBoundary", () => {
  it("should log errors", () => {
    const ThrowError = () => {
      throw new Error("Test error");
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(mockLogger.error).toHaveBeenCalledWith(
      "Component error:",
      expect.any(Error)
    );
  });
});
```

## Best Practices

### Mock Cleanup

```tsx
describe("Component tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
```

### Mock Factories

```tsx
const createMockUser = (overrides = {}): User => ({
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  ...overrides,
});

const createMockApiResponse = <T,>(data: T) => ({
  data,
  status: 200,
  statusText: "OK",
  headers: {},
  config: {},
});

describe("UserService", () => {
  it("should handle user data", () => {
    const mockUser = createMockUser({ name: "Jane Doe" });
    const mockResponse = createMockApiResponse(mockUser);

    mockedAxios.get.mockResolvedValue(mockResponse);
  });
});
```

### Mock Providers

```tsx
const createMockProviders = ({
  user = null,
  theme = "light",
}: {
  user?: User | null;
  theme?: string;
} = {}) => {
  return function MockProviders({ children }: { children: ReactNode }) {
    return (
      <AuthProvider value={{ user, login: jest.fn(), logout: jest.fn() }}>
        <ThemeProvider value={{ theme, setTheme: jest.fn() }}>
          {children}
        </ThemeProvider>
      </AuthProvider>
    );
  };
};

const renderWithProviders = (ui: ReactElement, options = {}) => {
  return render(ui, {
    wrapper: createMockProviders(options),
    ...options,
  });
};
```

## Interview Questions

**Q: How do you mock external API calls in React tests?**
A: Use Jest to mock axios/fetch, then mock resolved/rejected values. Use `waitFor` to handle async operations and verify calls with `toHaveBeenCalledWith`.

**Q: How do you mock browser APIs like localStorage?**
A: Create mock implementations and assign them to window properties using `Object.defineProperty`. Include all required methods and maintain state.

**Q: How do you partially mock a module?**
A: Use spread operator with `jest.requireActual` to keep original exports while mocking specific functions: `...jest.requireActual('module')`.

**Q: How do you mock timers in React tests?**
A: Use `jest.useFakeTimers()` and `jest.advanceTimersByTime()` to control timer execution. Wrap timer advances in `act()` for React updates.

**Q: How do you mock custom hooks?**
A: Mock the hook module with Jest and return mock values/functions. Use `jest.MockedFunction` for type safety with TypeScript.
