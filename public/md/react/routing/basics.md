# React Router Basics

A comprehensive guide to client-side routing in React applications using React Router.

## Introduction to Routing

Routing enables navigation between different views in a single-page application (SPA) without full page reloads.

### Why React Router?

- **Declarative routing** - Define routes as JSX components
- **Dynamic routing** - Routes render as components
- **Nested routing** - Complex UI structures
- **History management** - Browser back/forward support
- **Code splitting** - Lazy load route components

```jsx
// Basic routing example
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## Installation and Setup

### Installation

```bash
# npm
npm install react-router-dom

# pnpm
pnpm install react-router-dom

# yarn
yarn add react-router-dom
```

### Basic Setup

```jsx
// main.jsx or index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

### TypeScript Setup

```tsx
// App.tsx
import { Routes, Route } from "react-router-dom";
import type { FC } from "react";

const App: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/users/:id" element={<UserProfile />} />
    </Routes>
  );
};

export default App;
```

## Basic Routing Concepts

### URL Structure

```
https://example.com/users/123/posts/456
                   └─────┬─────┘
                         │
                    Route path
```

### Route Matching

```jsx
function App() {
  return (
    <Routes>
      {/* Exact match */}
      <Route path="/" element={<Home />} />

      {/* Dynamic segments */}
      <Route path="/users/:id" element={<User />} />

      {/* Optional segments */}
      <Route path="/posts/:id?" element={<Posts />} />

      {/* Wildcard */}
      <Route path="/files/*" element={<FileExplorer />} />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
```

### Route Priority

Routes are matched in the order they appear:

```jsx
function App() {
  return (
    <Routes>
      {/* More specific routes first */}
      <Route path="/users/new" element={<NewUser />} />
      <Route path="/users/:id" element={<User />} />

      {/* Catch-all last */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
```

## Router Components

### BrowserRouter

Uses HTML5 History API for clean URLs:

```jsx
import { BrowserRouter } from "react-router-dom";

function App() {
  return <BrowserRouter>{/* Your routes */}</BrowserRouter>;
}

// URLs: /users/123, /about, /contact
```

### HashRouter

Uses URL hash for compatibility:

```jsx
import { HashRouter } from "react-router-dom";

function App() {
  return <HashRouter>{/* Your routes */}</HashRouter>;
}

// URLs: /#/users/123, /#/about, /#/contact
```

### MemoryRouter

For testing and non-browser environments:

```jsx
import { MemoryRouter } from "react-router-dom";

function App() {
  return (
    <MemoryRouter initialEntries={["/users/123"]}>
      {/* Your routes */}
    </MemoryRouter>
  );
}
```

## Route Configuration

### Basic Routes

```jsx
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetail />} />
    </Routes>
  );
}
```

### Route Objects

```jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "users/:id",
        element: <User />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}
```

### Index Routes

```jsx
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
      </Route>
    </Routes>
  );
}

function Layout() {
  return (
    <div>
      <nav>{/* Navigation */}</nav>
      <main>
        <Outlet /> {/* Child routes render here */}
      </main>
    </div>
  );
}
```

## Navigation

### Link Component

```jsx
import { Link } from "react-router-dom";

function Navigation() {
  return (
    <nav>
      {/* Basic link */}
      <Link to="/about">About</Link>

      {/* Link with state */}
      <Link to="/users/123" state={{ from: "navigation" }}>
        User Profile
      </Link>

      {/* Conditional styling */}
      <Link
        to="/products"
        className={({ isActive }) => (isActive ? "active-link" : "link")}
      >
        Products
      </Link>
    </nav>
  );
}
```

### NavLink Component

```jsx
import { NavLink } from "react-router-dom";

function Navigation() {
  return (
    <nav>
      <NavLink
        to="/dashboard"
        className={({ isActive, isPending }) =>
          isPending ? "pending" : isActive ? "active" : ""
        }
      >
        Dashboard
      </NavLink>

      <NavLink
        to="/settings"
        style={({ isActive }) => ({
          color: isActive ? "red" : "black",
        })}
      >
        Settings
      </NavLink>
    </nav>
  );
}
```

### Programmatic Navigation

```jsx
import { useNavigate, useLocation } from "react-router-dom";

function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (credentials) => {
    try {
      await login(credentials);

      // Navigate to intended destination or home
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleCancel = () => {
    // Go back to previous page
    navigate(-1);
  };

  return (
    <form onSubmit={handleLogin}>
      {/* Form fields */}
      <button type="submit">Login</button>
      <button type="button" onClick={handleCancel}>
        Cancel
      </button>
    </form>
  );
}
```

### Replace vs Push

```jsx
function Component() {
  const navigate = useNavigate();

  const redirectUser = () => {
    // Add to history stack (default)
    navigate("/dashboard");

    // Replace current entry
    navigate("/dashboard", { replace: true });

    // Navigate with state
    navigate("/profile", {
      state: { user: currentUser },
      replace: true,
    });
  };
}
```

## Route Parameters

### URL Parameters

```jsx
import { useParams } from "react-router-dom";

function UserProfile() {
  const { id } = useParams();

  useEffect(() => {
    fetchUser(id);
  }, [id]);

  return <div>User ID: {id}</div>;
}

// Route: /users/:id
// URL: /users/123
// params: { id: "123" }
```

### Multiple Parameters

```jsx
function BlogPost() {
  const { category, slug } = useParams();

  return (
    <article>
      <nav>Category: {category}</nav>
      <h1>Post: {slug}</h1>
    </article>
  );
}

// Route: /blog/:category/:slug
// URL: /blog/tech/react-hooks
// params: { category: "tech", slug: "react-hooks" }
```

### Optional Parameters

```jsx
function Posts() {
  const { page = "1" } = useParams();

  const currentPage = parseInt(page, 10);

  return (
    <div>
      <h1>Posts - Page {currentPage}</h1>
      {/* Posts list */}
    </div>
  );
}

// Route: /posts/:page?
// URL: /posts or /posts/2
```

### Search Parameters

```jsx
import { useSearchParams } from "react-router-dom";

function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filter = searchParams.get("filter") || "all";
  const sort = searchParams.get("sort") || "name";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const updateFilter = (newFilter) => {
    setSearchParams((prev) => {
      prev.set("filter", newFilter);
      prev.set("page", "1"); // Reset to first page
      return prev;
    });
  };

  return (
    <div>
      <select value={filter} onChange={(e) => updateFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      {/* Product list */}
    </div>
  );
}

// URL: /products?filter=active&sort=name&page=2
```

## Nested Routes

### Basic Nesting

```jsx
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="users" element={<Users />}>
          <Route index element={<UserList />} />
          <Route path=":id" element={<UserDetail />} />
          <Route path=":id/edit" element={<UserEdit />} />
          <Route path="new" element={<UserNew />} />
        </Route>
      </Route>
    </Routes>
  );
}

function Layout() {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

function Users() {
  return (
    <div className="users-layout">
      <aside>
        <nav>
          <Link to="/users">All Users</Link>
          <Link to="/users/new">New User</Link>
        </nav>
      </aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
```

### Relative Navigation

```jsx
function UserProfile() {
  const navigate = useNavigate();

  const handleEdit = () => {
    // Relative navigation
    navigate("edit");

    // Absolute navigation
    navigate("/users/123/edit");

    // Go up one level
    navigate("..");
  };

  return (
    <div>
      <h1>User Profile</h1>
      <Link to="edit">Edit</Link>
      <Link to="../settings">Settings</Link>
    </div>
  );
}
```

## Protected Routes

### Authentication Guard

```jsx
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
```

### Role-Based Access

```jsx
function RoleProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.roles.includes(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

function App() {
  return (
    <Routes>
      <Route
        path="/admin"
        element={
          <RoleProtectedRoute requiredRole="admin">
            <AdminPanel />
          </RoleProtectedRoute>
        }
      />
    </Routes>
  );
}
```

### Multiple Conditions

```jsx
function ConditionalRoute({ children, condition, fallback }) {
  if (!condition) {
    return fallback;
  }

  return children;
}

function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      <Route
        path="/profile"
        element={
          <ConditionalRoute
            condition={user?.emailVerified}
            fallback={<Navigate to="/verify-email" replace />}
          >
            <Profile />
          </ConditionalRoute>
        }
      />
    </Routes>
  );
}
```

## Performance Considerations

### Lazy Loading

```jsx
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Lazy load components
const Dashboard = lazy(() => import("./Dashboard"));
const UserProfile = lazy(() => import("./UserProfile"));
const Settings = lazy(() => import("./Settings"));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
```

### Preloading Routes

```jsx
// Preload on hover
function Navigation() {
  const handleMouseEnter = () => {
    import("./Dashboard"); // Preload component
  };

  return (
    <Link to="/dashboard" onMouseEnter={handleMouseEnter}>
      Dashboard
    </Link>
  );
}

// Preload based on user actions
function App() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Preload likely next routes
      import("./Dashboard");
      import("./Profile");
    }
  }, [user]);

  return <Routes>{/* Routes */}</Routes>;
}
```

## Best Practices

### 1. Route Organization

```jsx
// routes/index.js
export const routes = {
  home: "/",
  users: {
    index: "/users",
    detail: "/users/:id",
    edit: "/users/:id/edit",
    new: "/users/new",
  },
  admin: {
    index: "/admin",
    users: "/admin/users",
    settings: "/admin/settings",
  },
};

// Usage
<Link to={routes.users.detail.replace(":id", user.id)}>View User</Link>;
```

### 2. URL Construction Helpers

```jsx
// utils/routes.js
export const buildPath = (template, params) => {
  return Object.entries(params).reduce(
    (path, [key, value]) => path.replace(`:${key}`, value),
    template
  );
};

// Usage
const userPath = buildPath("/users/:id/posts/:postId", {
  id: "123",
  postId: "456",
});
// Result: '/users/123/posts/456'
```

### 3. Route Constants

```jsx
// constants/routes.js
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  USER_PROFILE: '/users/:id',
  USER_EDIT: '/users/:id/edit'
} as const;

// Type-safe usage with TypeScript
type RouteKey = keyof typeof ROUTES;
type RoutePath = typeof ROUTES[RouteKey];
```

### 4. Error Boundaries for Routes

```jsx
function RouteErrorBoundary({ children }) {
  return (
    <ErrorBoundary
      fallback={<RouteErrorPage />}
      onError={(error, errorInfo) => {
        console.error("Route error:", error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

function App() {
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <RouteErrorBoundary>
            <Dashboard />
          </RouteErrorBoundary>
        }
      />
    </Routes>
  );
}
```

## Interview Questions

### Basic Questions

**Q: What is React Router and why do we need it?**

A: React Router is a library for implementing client-side routing in React SPAs. It enables navigation between different views without full page reloads, maintains browser history, and provides declarative routing through components.

**Q: What's the difference between BrowserRouter and HashRouter?**

A: BrowserRouter uses HTML5 History API for clean URLs (/about), while HashRouter uses URL hash (/#/about). BrowserRouter requires server configuration for deep links, while HashRouter works without server setup.

### Intermediate Questions

**Q: How do you handle protected routes in React Router?**

A: Create wrapper components that check authentication status and redirect unauthenticated users to login. Use conditional rendering with Navigate component and preserve the intended destination in location state.

**Q: Explain the difference between useNavigate and Link components.\*\***

A: Link is for declarative navigation in JSX, while useNavigate is for programmatic navigation in event handlers or effects. useNavigate provides more control with options like replace, state, and relative navigation.

### Advanced Questions

**Q: How would you implement role-based routing with React Router?**

A: Create higher-order components or wrapper components that check user roles and render appropriate content or redirects. Implement hierarchical role checking and combine with authentication guards.

**Q: Describe strategies for optimizing routing performance in large applications.**

A: Use lazy loading with React.lazy(), implement route-based code splitting, preload routes on user interaction, optimize bundle sizes, and use React.memo for route components that don't need frequent updates.

## Summary

React Router provides powerful, declarative routing for React applications:

- **Declarative routing** with JSX components
- **Dynamic and nested routes** for complex applications
- **Programmatic navigation** with hooks
- **Protected routes** for authentication and authorization
- **Performance optimization** with lazy loading
- **Type safety** with TypeScript integration
- **Flexible configuration** with route objects or JSX
