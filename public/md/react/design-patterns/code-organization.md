# React Code Organization

Proper code organization is crucial for maintaining large React applications. This guide covers file structure patterns, component organization, import strategies, and architectural decisions that scale with your application.

## Project Structure Patterns

### Feature-Based Organization

```
src/
├── components/           # Shared/reusable components
│   ├── ui/              # Basic UI components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   ├── Button.stories.tsx
│   │   │   └── index.ts
│   │   ├── Input/
│   │   └── Modal/
│   ├── layout/          # Layout components
│   │   ├── Header/
│   │   ├── Sidebar/
│   │   └── Footer/
│   └── forms/           # Form-related components
├── features/            # Feature-based modules
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm/
│   │   │   ├── SignupForm/
│   │   │   └── UserProfile/
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── useLogin.ts
│   │   ├── services/
│   │   │   └── authApi.ts
│   │   ├── types/
│   │   │   └── auth.types.ts
│   │   ├── utils/
│   │   │   └── validators.ts
│   │   └── index.ts
│   ├── products/
│   │   ├── components/
│   │   │   ├── ProductList/
│   │   │   ├── ProductCard/
│   │   │   └── ProductDetail/
│   │   ├── hooks/
│   │   │   ├── useProducts.ts
│   │   │   └── useProductDetail.ts
│   │   ├── services/
│   │   │   └── productApi.ts
│   │   └── types/
│   │       └── product.types.ts
│   └── dashboard/
├── hooks/               # Global custom hooks
│   ├── useLocalStorage.ts
│   ├── useApi.ts
│   └── useDebounce.ts
├── services/            # API services
│   ├── api.ts
│   ├── httpClient.ts
│   └── endpoints.ts
├── stores/              # State management
│   ├── userStore.ts
│   ├── appStore.ts
│   └── index.ts
├── types/               # Global type definitions
│   ├── api.types.ts
│   ├── common.types.ts
│   └── index.ts
├── utils/               # Utility functions
│   ├── formatters.ts
│   ├── validators.ts
│   ├── constants.ts
│   └── helpers.ts
├── styles/              # Global styles
│   ├── globals.css
│   ├── variables.css
│   └── components.css
└── App.tsx
```

### Layer-Based Organization

```
src/
├── presentation/        # UI Layer
│   ├── components/
│   │   ├── atoms/
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   └── Label/
│   │   ├── molecules/
│   │   │   ├── SearchBox/
│   │   │   ├── UserCard/
│   │   │   └── FormField/
│   │   ├── organisms/
│   │   │   ├── Header/
│   │   │   ├── ProductList/
│   │   │   └── UserForm/
│   │   ├── templates/
│   │   │   ├── PageLayout/
│   │   │   └── DashboardLayout/
│   │   └── pages/
│   │       ├── HomePage/
│   │       ├── ProductPage/
│   │       └── UserPage/
│   ├── hooks/
│   │   ├── useForm.ts
│   │   ├── useModal.ts
│   │   └── useToggle.ts
│   └── styles/
├── domain/              # Business Logic Layer
│   ├── entities/
│   │   ├── User.ts
│   │   ├── Product.ts
│   │   └── Order.ts
│   ├── repositories/
│   │   ├── UserRepository.ts
│   │   ├── ProductRepository.ts
│   │   └── OrderRepository.ts
│   ├── services/
│   │   ├── AuthService.ts
│   │   ├── PaymentService.ts
│   │   └── NotificationService.ts
│   └── validators/
│       ├── userValidators.ts
│       └── productValidators.ts
├── infrastructure/      # External Concerns
│   ├── api/
│   │   ├── httpClient.ts
│   │   ├── endpoints.ts
│   │   └── interceptors.ts
│   ├── storage/
│   │   ├── localStorage.ts
│   │   └── sessionStorage.ts
│   └── external/
│       ├── analytics.ts
│       └── monitoring.ts
└── shared/              # Shared Utilities
    ├── types/
    ├── constants/
    ├── utils/
    └── config/
```

## Component Organization Patterns

### Atomic Design Structure

```tsx
// atoms/Button/Button.tsx
interface ButtonProps {
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  children,
  onClick,
}: ButtonProps) {
  const classNames = [
    "btn",
    `btn--${variant}`,
    `btn--${size}`,
    disabled && "btn--disabled",
    loading && "btn--loading",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={classNames}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
}

// atoms/Button/index.ts
export { Button } from "./Button";
export type { ButtonProps } from "./Button";

// molecules/SearchBox/SearchBox.tsx
import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";

interface SearchBoxProps {
  value: string;
  placeholder?: string;
  onSearch: (query: string) => void;
  onChange: (value: string) => void;
  loading?: boolean;
}

export function SearchBox({
  value,
  placeholder = "Search...",
  onSearch,
  onChange,
  loading = false,
}: SearchBoxProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
  };

  return (
    <form onSubmit={handleSubmit} className="search-box">
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="search-box__input"
      />
      <Button type="submit" loading={loading} className="search-box__button">
        Search
      </Button>
    </form>
  );
}

// organisms/ProductList/ProductList.tsx
import { ProductCard } from "../../molecules/ProductCard";
import { SearchBox } from "../../molecules/SearchBox";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface ProductListProps {
  products: Product[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: (query: string) => void;
  onProductClick: (product: Product) => void;
  loading?: boolean;
}

export function ProductList({
  products,
  searchQuery,
  onSearchChange,
  onSearch,
  onProductClick,
  loading = false,
}: ProductListProps) {
  return (
    <div className="product-list">
      <div className="product-list__header">
        <h2>Products ({products.length})</h2>
        <SearchBox
          value={searchQuery}
          onChange={onSearchChange}
          onSearch={onSearch}
          loading={loading}
        />
      </div>

      <div className="product-list__grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => onProductClick(product)}
          />
        ))}
      </div>
    </div>
  );
}
```

### Container-Presenter Pattern

```tsx
// features/products/containers/ProductListContainer.tsx
import { useState, useEffect, useCallback } from "react";
import { ProductListPresenter } from "../components/ProductListPresenter";
import { useProducts } from "../hooks/useProducts";
import { Product } from "../types/product.types";

export function ProductListContainer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const { products, loading, error, searchProducts } = useProducts();

  useEffect(() => {
    if (searchQuery) {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [products, searchQuery]);

  const handleSearch = useCallback(
    async (query: string) => {
      if (query.trim()) {
        await searchProducts(query);
      }
    },
    [searchProducts]
  );

  const handleProductClick = useCallback((product: Product) => {
    console.log("Product clicked:", product);
    // Navigate to product detail or open modal
  }, []);

  return (
    <ProductListPresenter
      products={filteredProducts}
      searchQuery={searchQuery}
      loading={loading}
      error={error}
      onSearchChange={setSearchQuery}
      onSearch={handleSearch}
      onProductClick={handleProductClick}
    />
  );
}

// features/products/components/ProductListPresenter.tsx
import { ProductList } from "../../../components/organisms/ProductList";
import { ErrorBoundary } from "../../../components/ui/ErrorBoundary";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";

interface ProductListPresenterProps {
  products: Product[];
  searchQuery: string;
  loading: boolean;
  error: string | null;
  onSearchChange: (query: string) => void;
  onSearch: (query: string) => void;
  onProductClick: (product: Product) => void;
}

export function ProductListPresenter({
  products,
  searchQuery,
  loading,
  error,
  onSearchChange,
  onSearch,
  onProductClick,
}: ProductListPresenterProps) {
  if (error) {
    return (
      <ErrorBoundary>
        <div className="error-state">
          <h2>Something went wrong</h2>
          <p>{error}</p>
        </div>
      </ErrorBoundary>
    );
  }

  if (loading && products.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="product-list-page">
      <ProductList
        products={products}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onSearch={onSearch}
        onProductClick={onProductClick}
        loading={loading}
      />
    </div>
  );
}
```

## Import Organization

### Barrel Exports Pattern

```tsx
// components/ui/index.ts
export { Button } from "./Button";
export { Input } from "./Input";
export { Modal } from "./Modal";
export { Spinner } from "./Spinner";
export { Card } from "./Card";

export type { ButtonProps } from "./Button";
export type { InputProps } from "./Input";
export type { ModalProps } from "./Modal";

// features/auth/index.ts
export { LoginForm } from "./components/LoginForm";
export { SignupForm } from "./components/SignupForm";
export { UserProfile } from "./components/UserProfile";

export { useAuth } from "./hooks/useAuth";
export { useLogin } from "./hooks/useLogin";

export type { User, AuthState } from "./types/auth.types";

// hooks/index.ts
export { useLocalStorage } from "./useLocalStorage";
export { useDebounce } from "./useDebounce";
export { useToggle } from "./useToggle";
export { useApi } from "./useApi";

// Usage in components
import { Button, Input, Modal } from "../components/ui";
import { LoginForm, useAuth } from "../features/auth";
import { useLocalStorage, useDebounce } from "../hooks";
```

### Absolute Imports Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "@/components/*": ["components/*"],
      "@/features/*": ["features/*"],
      "@/hooks/*": ["hooks/*"],
      "@/services/*": ["services/*"],
      "@/types/*": ["types/*"],
      "@/utils/*": ["utils/*"],
      "@/styles/*": ["styles/*"]
    }
  }
}
```

```tsx
// Using absolute imports
import { Button, Input } from "@/components/ui";
import { ProductList } from "@/features/products";
import { useLocalStorage } from "@/hooks";
import { formatCurrency } from "@/utils/formatters";
import { Product } from "@/types/product.types";
```

## State Management Organization

### Store Structure

```tsx
// stores/slices/userSlice.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

interface UserActions {
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearUser: () => void;
}

type UserStore = UserState & UserActions;

export const useUserStore = create<UserStore>()(
  devtools(
    (set, get) => ({
      // State
      user: null,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user) => set({ user, error: null }, false, "setUser"),

      updateUser: (updates) =>
        set(
          (state) => ({
            user: state.user ? { ...state.user, ...updates } : null,
          }),
          false,
          "updateUser"
        ),

      setLoading: (isLoading) => set({ isLoading }, false, "setLoading"),

      setError: (error) => set({ error }, false, "setError"),

      clearUser: () =>
        set(
          {
            user: null,
            error: null,
            isLoading: false,
          },
          false,
          "clearUser"
        ),
    }),
    { name: "user-store" }
  )
);

// stores/index.ts
export { useUserStore } from "./slices/userSlice";
export { useProductStore } from "./slices/productSlice";
export { useAppStore } from "./slices/appSlice";

// Combined store hook
export function useStore() {
  const user = useUserStore();
  const products = useProductStore();
  const app = useAppStore();

  return {
    user,
    products,
    app,
  };
}
```

## Service Layer Organization

### API Service Structure

```tsx
// services/httpClient.ts
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

class HttpClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("authToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("authToken");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.get(url, config);
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.client.post(url, data, config);
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.client.put(url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.delete(url, config);
  }
}

export const httpClient = new HttpClient(process.env.REACT_APP_API_URL || "");

// services/api/userApi.ts
import { httpClient } from "../httpClient";
import { User, CreateUserRequest, UpdateUserRequest } from "@/types/user.types";

export const userApi = {
  getUsers: (): Promise<User[]> => httpClient.get("/users"),

  getUserById: (id: string): Promise<User> => httpClient.get(`/users/${id}`),

  createUser: (userData: CreateUserRequest): Promise<User> =>
    httpClient.post("/users", userData),

  updateUser: (id: string, updates: UpdateUserRequest): Promise<User> =>
    httpClient.put(`/users/${id}`, updates),

  deleteUser: (id: string): Promise<void> => httpClient.delete(`/users/${id}`),

  searchUsers: (query: string): Promise<User[]> =>
    httpClient.get(`/users/search?q=${encodeURIComponent(query)}`),
};

// services/api/index.ts
export { userApi } from "./userApi";
export { productApi } from "./productApi";
export { authApi } from "./authApi";
```

## Custom Hooks Organization

### Feature-Specific Hooks

```tsx
// features/auth/hooks/useAuth.ts
import { useState, useCallback } from "react";
import { useUserStore } from "@/stores";
import { authApi } from "@/services/api";
import { LoginCredentials, SignupData } from "../types/auth.types";

export function useAuth() {
  const { user, setUser, setLoading, setError, clearUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authApi.login(credentials);
        setUser(response.user);
        localStorage.setItem("authToken", response.token);
        return response.user;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Login failed";
        setError(message);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [setUser, setError]
  );

  const signup = useCallback(
    async (data: SignupData) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authApi.signup(data);
        setUser(response.user);
        localStorage.setItem("authToken", response.token);
        return response.user;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Signup failed";
        setError(message);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [setUser, setError]
  );

  const logout = useCallback(() => {
    clearUser();
    localStorage.removeItem("authToken");
  }, [clearUser]);

  return {
    user,
    isLoading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };
}

// hooks/useApi.ts
import { useState, useEffect, useCallback } from "react";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  immediate?: boolean;
  dependencies?: any[];
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions = {}
) {
  const { immediate = true, dependencies = [] } = options;

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const result = await apiCall();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      setState((prev) => ({ ...prev, loading: false, error: message }));
      throw error;
    }
  }, [apiCall]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute, ...dependencies]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
    refetch: execute,
  };
}
```

## Type Organization

### Centralized Type Definitions

```tsx
// types/common.types.ts
export interface ApiResponse<T> {
  data: T;
  message: string;
  status: "success" | "error";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// types/user.types.ts
import { BaseEntity } from "./common.types";

export interface User extends BaseEntity {
  name: string;
  email: string;
  role: "admin" | "user" | "moderator";
  avatar?: string;
  isActive: boolean;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role?: User["role"];
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: User["role"];
  isActive?: boolean;
}

// types/product.types.ts
import { BaseEntity } from "./common.types";

export interface Product extends BaseEntity {
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  images: string[];
  tags: string[];
}

export interface ProductFilters {
  category?: string;
  priceRange?: [number, number];
  inStock?: boolean;
  tags?: string[];
  search?: string;
}

// types/index.ts
export type * from "./common.types";
export type * from "./user.types";
export type * from "./product.types";
export type * from "./auth.types";
```

## Environment and Configuration

### Configuration Management

```tsx
// config/environment.ts
interface EnvironmentConfig {
  api: {
    baseUrl: string;
    timeout: number;
  };
  auth: {
    tokenKey: string;
    sessionTimeout: number;
  };
  features: {
    enableAnalytics: boolean;
    enableNotifications: boolean;
    debugMode: boolean;
  };
}

const development: EnvironmentConfig = {
  api: {
    baseUrl: "http://localhost:3001/api",
    timeout: 10000,
  },
  auth: {
    tokenKey: "dev_auth_token",
    sessionTimeout: 60 * 60 * 1000, // 1 hour
  },
  features: {
    enableAnalytics: false,
    enableNotifications: true,
    debugMode: true,
  },
};

const production: EnvironmentConfig = {
  api: {
    baseUrl: process.env.REACT_APP_API_URL || "",
    timeout: 30000,
  },
  auth: {
    tokenKey: "auth_token",
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
  },
  features: {
    enableAnalytics: true,
    enableNotifications: true,
    debugMode: false,
  },
};

export const config =
  process.env.NODE_ENV === "production" ? production : development;

// config/constants.ts
export const APP_CONSTANTS = {
  ROUTES: {
    HOME: "/",
    LOGIN: "/login",
    DASHBOARD: "/dashboard",
    PRODUCTS: "/products",
    PROFILE: "/profile",
  },
  API_ENDPOINTS: {
    AUTH: "/auth",
    USERS: "/users",
    PRODUCTS: "/products",
  },
  STORAGE_KEYS: {
    AUTH_TOKEN: "authToken",
    USER_PREFERENCES: "userPreferences",
    THEME: "theme",
  },
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
  },
} as const;

export type Routes = typeof APP_CONSTANTS.ROUTES;
export type StorageKeys = typeof APP_CONSTANTS.STORAGE_KEYS;
```

## Testing Organization

### Test Structure

```tsx
// components/ui/Button/__tests__/Button.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../Button";

describe("Button Component", () => {
  it("renders children correctly", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("handles click events", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("displays loading state", () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });
});

// features/auth/hooks/__tests__/useAuth.test.ts
import { renderHook, act } from "@testing-library/react";
import { useAuth } from "../useAuth";

jest.mock("@/services/api", () => ({
  authApi: {
    login: jest.fn(),
    signup: jest.fn(),
  },
}));

describe("useAuth Hook", () => {
  it("should login successfully", async () => {
    const mockUser = { id: "1", name: "John", email: "john@example.com" };
    (authApi.login as jest.Mock).mockResolvedValue({
      user: mockUser,
      token: "fake-token",
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login({
        email: "john@example.com",
        password: "password",
      });
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });
});

// __tests__/utils/test-utils.tsx
import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <ThemeProvider>{children}</ThemeProvider>
    </BrowserRouter>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
```

## Best Practices

### Code Organization Guidelines

1. **Consistent Structure**: Follow the same patterns across features and components.

2. **Clear Boundaries**: Separate concerns clearly between presentation, business logic, and data access.

3. **Scalable Imports**: Use barrel exports and absolute imports to simplify import statements.

4. **Type Safety**: Organize types logically and use TypeScript throughout the application.

5. **Feature Isolation**: Keep related code together in feature modules to improve maintainability.

6. **Shared Components**: Create a robust component library for reusable UI elements.

### Performance Considerations

```tsx
// Lazy loading feature modules
const ProductsFeature = React.lazy(() => import("@/features/products"));
const AuthFeature = React.lazy(() => import("@/features/auth"));

// Code splitting by route
function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/products/*" element={<ProductsFeature />} />
        <Route path="/auth/*" element={<AuthFeature />} />
      </Routes>
    </Suspense>
  );
}

// Optimize barrel exports
// Instead of exporting everything:
export * from "./Button"; // ❌ Can cause large bundles

// Export specifically:
export { Button } from "./Button"; // ✅ Better for tree shaking
```

## Interview Questions

**Q: How do you organize code in a large React application?**
A: Use feature-based organization where related components, hooks, services, and types are grouped together. Implement atomic design for UI components, use absolute imports with path mapping, and maintain consistent file naming conventions.

**Q: What's the difference between feature-based and layer-based organization?**
A: Feature-based groups code by business domain (auth, products, etc.), making it easier to maintain and understand. Layer-based separates by technical concerns (components, services, etc.), which can work for smaller apps but becomes harder to navigate as the app grows.

**Q: How do you prevent circular dependencies in React projects?**
A: Use dependency inversion, avoid importing from parent directories, use barrel exports carefully, implement clear dependency layers (presentation → domain → infrastructure), and use tools like dependency-cruiser to detect circular dependencies.

**Q: How do you structure shared components vs feature-specific components?**
A: Shared components go in a common components directory and should be generic and reusable. Feature-specific components live within their feature modules and can contain business logic specific to that domain.

**Q: What strategies do you use for managing imports in large React applications?**
A: Use absolute imports with TypeScript path mapping, implement barrel exports for public APIs, organize imports in a consistent order (external → internal → relative), and use tools like ESLint to enforce import organization rules.

Proper code organization is essential for building maintainable React applications that can scale with your team and business requirements.
