# React Router Navigation

Navigation is a core aspect of React Router that enables users to move between different routes in your application. This guide covers all navigation techniques, from basic links to programmatic navigation and advanced patterns.

## Basic Navigation Components

### Link Component

The `Link` component is the primary way to navigate between routes in React Router.

```jsx
import { Link } from "react-router-dom";

function Navigation() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/products">Products</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
      </ul>
    </nav>
  );
}
```

### NavLink Component

`NavLink` is a special version of `Link` that adds styling attributes when it matches the current URL.

```jsx
import { NavLink } from "react-router-dom";

function NavigationMenu() {
  return (
    <nav className="main-nav">
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? "nav-link active" : "nav-link"
        }
      >
        Home
      </NavLink>

      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          isActive ? "nav-link active" : "nav-link"
        }
        style={({ isActive }) => ({
          color: isActive ? "#ff6b6b" : "#333",
          textDecoration: isActive ? "underline" : "none",
        })}
      >
        Dashboard
      </NavLink>

      <NavLink
        to="/profile"
        className="nav-link"
        end // Only active when exact match
      >
        Profile
      </NavLink>
    </nav>
  );
}
```

### Advanced NavLink Patterns

```jsx
function SidebarNavigation() {
  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: "📊" },
    { to: "/users", label: "Users", icon: "👥" },
    { to: "/settings", label: "Settings", icon: "⚙️" },
    { to: "/reports", label: "Reports", icon: "📈" },
  ];

  return (
    <aside className="sidebar">
      <nav>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive, isPending }) => {
              let classes = "nav-item";
              if (isActive) classes += " active";
              if (isPending) classes += " pending";
              return classes;
            }}
          >
            <span className="icon">{item.icon}</span>
            <span className="label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
```

## Programmatic Navigation

### useNavigate Hook

The `useNavigate` hook provides a function to navigate programmatically.

```jsx
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await login(credentials);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Go back one page
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={credentials.email}
        onChange={(e) =>
          setCredentials((prev) => ({ ...prev, email: e.target.value }))
        }
        placeholder="Email"
      />
      <input
        type="password"
        value={credentials.password}
        onChange={(e) =>
          setCredentials((prev) => ({ ...prev, password: e.target.value }))
        }
        placeholder="Password"
      />
      <button type="submit">Login</button>
      <button type="button" onClick={handleCancel}>
        Cancel
      </button>
    </form>
  );
}
```

### Navigation with State

```jsx
function ProductList() {
  const navigate = useNavigate();
  const products = [
    { id: 1, name: "Laptop", category: "Electronics" },
    { id: 2, name: "Book", category: "Education" },
  ];

  const handleProductClick = (product) => {
    navigate(`/products/${product.id}`, {
      state: {
        product,
        from: "/products",
        timestamp: Date.now(),
      },
    });
  };

  return (
    <div>
      <h2>Products</h2>
      {products.map((product) => (
        <div key={product.id} onClick={() => handleProductClick(product)}>
          <h3>{product.name}</h3>
          <p>{product.category}</p>
        </div>
      ))}
    </div>
  );
}

function ProductDetail() {
  const location = useLocation();
  const { product, from } = location.state || {};

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      <h1>{product.name}</h1>
      <p>Category: {product.category}</p>
      <p>Navigated from: {from}</p>
    </div>
  );
}
```

### Replace vs Push Navigation

```jsx
function NavigationExamples() {
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate("/profile"); // Adds to history stack
  };

  const replaceWithLogin = () => {
    navigate("/login", { replace: true }); // Replaces current entry
  };

  const goBack = () => {
    navigate(-1); // Go back one page
  };

  const goForward = () => {
    navigate(1); // Go forward one page
  };

  const goToSpecificPage = () => {
    navigate(-3); // Go back 3 pages
  };

  return (
    <div>
      <button onClick={goToProfile}>Go to Profile</button>
      <button onClick={replaceWithLogin}>Replace with Login</button>
      <button onClick={goBack}>Go Back</button>
      <button onClick={goForward}>Go Forward</button>
      <button onClick={goToSpecificPage}>Go Back 3 Pages</button>
    </div>
  );
}
```

## Navigation with Parameters

### URL Parameters

```jsx
function UserNavigation() {
  const navigate = useNavigate();
  const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
  ];

  const viewUser = (userId) => {
    navigate(`/users/${userId}`);
  };

  const editUser = (userId) => {
    navigate(`/users/${userId}/edit`);
  };

  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>
          <span>{user.name}</span>
          <button onClick={() => viewUser(user.id)}>View</button>
          <button onClick={() => editUser(user.id)}>Edit</button>
        </div>
      ))}
    </div>
  );
}
```

### Query Parameters

```jsx
function SearchResults() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const updateSearch = (newQuery) => {
    const params = new URLSearchParams(searchParams);
    if (newQuery) {
      params.set("q", newQuery);
    } else {
      params.delete("q");
    }
    setSearchParams(params);
  };

  const updateFilters = (filters) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    setSearchParams(params);
  };

  const navigateWithQuery = (path, query) => {
    navigate(`${path}?q=${encodeURIComponent(query)}`);
  };

  return (
    <div>
      <input
        type="text"
        value={searchParams.get("q") || ""}
        onChange={(e) => updateSearch(e.target.value)}
        placeholder="Search..."
      />

      <select
        value={searchParams.get("category") || ""}
        onChange={(e) => updateFilters({ category: e.target.value })}
      >
        <option value="">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="books">Books</option>
      </select>

      <button onClick={() => navigateWithQuery("/products", "laptop")}>
        Search for Laptops
      </button>
    </div>
  );
}
```

## Navigation Guards and Protection

### Protected Routes

```jsx
function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user || user.role !== "admin") {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return children;
}
```

### Navigation Confirmation

```jsx
function FormWithNavigationGuard() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleLeavePage = (path) => {
    if (hasUnsavedChanges) {
      const shouldLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      if (shouldLeave) {
        setHasUnsavedChanges(false);
        navigate(path);
      }
    } else {
      navigate(path);
    }
  };

  return (
    <div>
      <form onChange={() => setHasUnsavedChanges(true)}>
        <input type="text" placeholder="Enter some data..." />
        <button type="submit">Save</button>
      </form>

      <button onClick={() => handleLeavePage("/dashboard")}>
        Go to Dashboard
      </button>
    </div>
  );
}
```

## Breadcrumb Navigation

### Dynamic Breadcrumbs

```jsx
function Breadcrumbs() {
  const location = useLocation();
  const navigate = useNavigate();

  const pathnames = location.pathname.split("/").filter((x) => x);

  const breadcrumbNameMap = {
    "/users": "Users",
    "/users/create": "Create User",
    "/products": "Products",
    "/products/categories": "Categories",
    "/settings": "Settings",
    "/settings/profile": "Profile",
  };

  const getBreadcrumbName = (pathname) => {
    return (
      breadcrumbNameMap[pathname] ||
      pathname.split("/").pop()?.replace(/-/g, " ") ||
      "Unknown"
    );
  };

  return (
    <nav className="breadcrumbs">
      <button onClick={() => navigate("/")}>Home</button>
      {pathnames.map((_, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;

        return (
          <span key={routeTo}>
            <span className="separator"> / </span>
            {isLast ? (
              <span className="current">{getBreadcrumbName(routeTo)}</span>
            ) : (
              <button onClick={() => navigate(routeTo)}>
                {getBreadcrumbName(routeTo)}
              </button>
            )}
          </span>
        );
      })}
    </nav>
  );
}
```

## Advanced Navigation Patterns

### Modal Navigation

```jsx
function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;

  return (
    <div>
      <Routes location={background || location}>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/photo/:id" element={<PhotoPage />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path="/photo/:id"
            element={
              <Modal onClose={() => navigate(-1)}>
                <PhotoModal />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
}

function Gallery() {
  const navigate = useNavigate();
  const location = useLocation();

  const openPhoto = (photoId) => {
    navigate(`/photo/${photoId}`, {
      state: { background: location },
    });
  };

  return (
    <div className="gallery">
      {photos.map((photo) => (
        <img
          key={photo.id}
          src={photo.thumbnail}
          onClick={() => openPhoto(photo.id)}
          alt={photo.title}
        />
      ))}
    </div>
  );
}
```

### Tab Navigation

```jsx
function TabNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { id: "overview", label: "Overview", path: "/dashboard" },
    { id: "analytics", label: "Analytics", path: "/dashboard/analytics" },
    { id: "reports", label: "Reports", path: "/dashboard/reports" },
    { id: "settings", label: "Settings", path: "/dashboard/settings" },
  ];

  const activeTab =
    tabs.find(
      (tab) =>
        location.pathname === tab.path ||
        location.pathname.startsWith(tab.path + "/")
    )?.id || "overview";

  return (
    <div className="tab-container">
      <div className="tab-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => navigate(tab.path)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        <Outlet />
      </div>
    </div>
  );
}
```

### Wizard Navigation

```jsx
function WizardNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const steps = [
    { id: 1, path: "/wizard/step1", label: "Personal Info" },
    { id: 2, path: "/wizard/step2", label: "Contact Details" },
    { id: 3, path: "/wizard/step3", label: "Preferences" },
    { id: 4, path: "/wizard/step4", label: "Review" },
  ];

  const currentStep =
    steps.find((step) => location.pathname === step.path)?.id || 1;

  const goToStep = (stepId) => {
    const step = steps.find((s) => s.id === stepId);
    if (step) {
      navigate(step.path);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      goToStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  return (
    <div className="wizard">
      <div className="wizard-nav">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`step ${step.id === currentStep ? "active" : ""} ${
              step.id < currentStep ? "completed" : ""
            }`}
            onClick={() => goToStep(step.id)}
          >
            <span className="step-number">{step.id}</span>
            <span className="step-label">{step.label}</span>
          </div>
        ))}
      </div>

      <div className="wizard-content">
        <Outlet />
      </div>

      <div className="wizard-controls">
        <button onClick={prevStep} disabled={currentStep === 1}>
          Previous
        </button>
        <button onClick={nextStep} disabled={currentStep === steps.length}>
          Next
        </button>
      </div>
    </div>
  );
}
```

## TypeScript Navigation

```tsx
import { useNavigate, NavigateFunction, To } from 'react-router-dom';

interface NavigationState {
  from?: string;
  returnTo?: string;
  data?: any;
}

interface NavigationOptions {
  replace?: boolean;
  state?: NavigationState;
}

function useTypedNavigation() {
  const navigate = useNavigate();

  const navigateTo = (to: To, options?: NavigationOptions): void => {
    navigate(to, options);
  };

  const navigateWithState = <T>(
    to: To,
    state: T,
    replace = false
  ): void => {
    navigate(to, { state, replace });
  };

  const goBack = (): void => {
    navigate(-1);
  };

  const goForward = (): void => {
    navigate(1);
  };

  const replace = (to: To): void => {
    navigate(to, { replace: true });
  };

  return {
    navigateTo,
    navigateWithState,
    goBack,
    goForward,
    replace
  };
}

interface User {
  id: number;
  name: string;
  role: 'admin' | 'user';
}

function TypedUserList(): JSX.Element {
  const { navigateWithState } = useTypedNavigation();

  const users: User[] = [
    { id: 1, name: 'Alice', role: 'admin' },
    { id: 2, name: 'Bob', role: 'user' }
  ];

  const handleUserClick = (user: User): void => {
    navigateWithState(`/users/${user.id}`, {
      user,
      from: '/users'
    });
  };

  return (
    <div>
      {users.map(user => (
        <div key={user.id} onClick={() => handleUserClick(user)}>
          {user.name} ({user.role})
        </div>
      ))}
    </div>
  );
}
```

## Navigation Performance

### Lazy Loading Routes

```jsx
const Dashboard = lazy(() => import("./Dashboard"));
const Profile = lazy(() => import("./Profile"));
const Settings = lazy(() => import("./Settings"));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
```

### Preloading Routes

```jsx
function NavigationWithPreload() {
  const preloadDashboard = () => {
    import("./Dashboard");
  };

  const preloadProfile = () => {
    import("./Profile");
  };

  return (
    <nav>
      <Link to="/dashboard" onMouseEnter={preloadDashboard}>
        Dashboard
      </Link>
      <Link to="/profile" onMouseEnter={preloadProfile}>
        Profile
      </Link>
    </nav>
  );
}
```

## Best Practices

1. **Use Link for Navigation**: Always use `Link` or `NavLink` for internal navigation instead of anchor tags
2. **Programmatic Navigation**: Use `useNavigate` for navigation based on user actions or side effects
3. **State Management**: Pass data through navigation state when appropriate
4. **URL Structure**: Design clean, predictable URL structures
5. **Accessibility**: Ensure navigation is keyboard accessible and screen reader friendly
6. **Performance**: Implement lazy loading for large route components
7. **User Experience**: Provide visual feedback for active routes and loading states
8. **Error Handling**: Handle navigation errors gracefully

## Common Patterns

| Pattern     | Use Case                     | Implementation                |
| ----------- | ---------------------------- | ----------------------------- |
| Breadcrumbs | Show navigation hierarchy    | Parse location pathname       |
| Tabs        | Switch between related views | Use nested routes with Outlet |
| Wizard      | Multi-step processes         | Sequential route navigation   |
| Modal       | Overlay content              | Background location state     |
| Sidebar     | Persistent navigation        | NavLink with active states    |
| Mobile menu | Responsive navigation        | Toggle visibility with state  |

## Interview Questions

**Q: What's the difference between Link and NavLink?**
A: `Link` provides basic navigation, while `NavLink` adds active state styling capabilities, making it ideal for navigation menus that need to show the current page.

**Q: How do you navigate programmatically in React Router?**
A: Use the `useNavigate` hook, which returns a navigate function that can be called with a path and optional configuration like `replace` or `state`.

**Q: How do you pass data between routes?**
A: You can pass data through URL parameters, query strings, or navigation state using the `state` option in navigate functions.

**Q: How do you implement navigation guards?**
A: Create wrapper components that check conditions (like authentication) and conditionally render the target component or redirect to another route.

**Q: What's the difference between replace and push navigation?**
A: Push navigation adds a new entry to the history stack, while replace navigation replaces the current entry, affecting browser back/forward behavior.
