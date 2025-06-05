# React Lazy Loading and Code Splitting

React lazy loading enables code splitting by allowing you to load components dynamically, reducing the initial bundle size and improving application performance. This technique is essential for building scalable React applications.

## Understanding React.lazy

React.lazy enables dynamic imports for React components, creating separate bundles that are loaded on demand.

### Basic React.lazy Implementation

```typescript
import React, { Suspense } from "react";

// Traditional import (included in main bundle)
// import Dashboard from './Dashboard';

// Lazy import (separate bundle, loaded on demand)
const Dashboard = React.lazy(() => import("./Dashboard"));
const Profile = React.lazy(() => import("./Profile"));
const Settings = React.lazy(() => import("./Settings"));

const App = () => {
  const [currentView, setCurrentView] = useState<
    "dashboard" | "profile" | "settings"
  >("dashboard");

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard />;
      case "profile":
        return <Profile />;
      case "settings":
        return <Settings />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div>
      <nav>
        <button onClick={() => setCurrentView("dashboard")}>Dashboard</button>
        <button onClick={() => setCurrentView("profile")}>Profile</button>
        <button onClick={() => setCurrentView("settings")}>Settings</button>
      </nav>

      <main>
        <Suspense fallback={<div>Loading...</div>}>{renderView()}</Suspense>
      </main>
    </div>
  );
};

export default App;
```

### Lazy Loading with Error Boundaries

```typescript
import React, { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class LazyLoadErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Lazy loading error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="error-boundary">
            <h2>Something went wrong loading this component.</h2>
            <button onClick={() => this.setState({ hasError: false })}>
              Try Again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

const LazyComponentWithErrorBoundary = () => {
  const [showComponent, setShowComponent] = useState(false);

  const HeavyComponent = React.lazy(() =>
    import("./HeavyComponent").catch(() => ({
      default: () => <div>Failed to load component</div>,
    }))
  );

  return (
    <div>
      <button onClick={() => setShowComponent(!showComponent)}>
        {showComponent ? "Hide" : "Show"} Heavy Component
      </button>

      {showComponent && (
        <LazyLoadErrorBoundary
          fallback={
            <div>
              <p>Failed to load the component</p>
              <button onClick={() => setShowComponent(false)}>Close</button>
            </div>
          }
        >
          <Suspense fallback={<div>Loading heavy component...</div>}>
            <HeavyComponent />
          </Suspense>
        </LazyLoadErrorBoundary>
      )}
    </div>
  );
};
```

## Advanced Lazy Loading Patterns

### Preloading Components

```typescript
interface LazyComponentInfo {
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  preload: () => Promise<{ default: React.ComponentType<any> }>;
}

const createLazyComponent = (
  importFn: () => Promise<{ default: React.ComponentType<any> }>
): LazyComponentInfo => {
  const component = React.lazy(importFn);

  return {
    component,
    preload: importFn,
  };
};

const lazyComponents = {
  Dashboard: createLazyComponent(() => import("./pages/Dashboard")),
  Analytics: createLazyComponent(() => import("./pages/Analytics")),
  Reports: createLazyComponent(() => import("./pages/Reports")),
  UserManagement: createLazyComponent(() => import("./pages/UserManagement")),
};

const PreloadingApp = () => {
  const [currentPage, setCurrentPage] =
    useState<keyof typeof lazyComponents>("Dashboard");

  const handleNavigation = (page: keyof typeof lazyComponents) => {
    setCurrentPage(page);
  };

  const handleMouseEnter = (page: keyof typeof lazyComponents) => {
    // Preload on hover
    lazyComponents[page].preload();
  };

  useEffect(() => {
    // Preload critical components after initial load
    const timer = setTimeout(() => {
      lazyComponents.Analytics.preload();
      lazyComponents.Reports.preload();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const CurrentComponent = lazyComponents[currentPage].component;

  return (
    <div>
      <nav>
        {Object.keys(lazyComponents).map((page) => (
          <button
            key={page}
            onClick={() =>
              handleNavigation(page as keyof typeof lazyComponents)
            }
            onMouseEnter={() =>
              handleMouseEnter(page as keyof typeof lazyComponents)
            }
            className={currentPage === page ? "active" : ""}
          >
            {page}
          </button>
        ))}
      </nav>

      <main>
        <Suspense fallback={<PageLoader />}>
          <CurrentComponent />
        </Suspense>
      </main>
    </div>
  );
};

const PageLoader = () => (
  <div className="page-loader">
    <div className="spinner"></div>
    <p>Loading page...</p>
  </div>
);
```

### Conditional Lazy Loading

```typescript
interface FeatureFlag {
  enableNewDashboard: boolean;
  enableAdvancedAnalytics: boolean;
  enableBetaFeatures: boolean;
}

const useFeatureFlags = (): FeatureFlag => {
  const [flags, setFlags] = useState<FeatureFlag>({
    enableNewDashboard: false,
    enableAdvancedAnalytics: false,
    enableBetaFeatures: false,
  });

  useEffect(() => {
    // Simulate fetching feature flags
    setTimeout(() => {
      setFlags({
        enableNewDashboard: true,
        enableAdvancedAnalytics: true,
        enableBetaFeatures: false,
      });
    }, 1000);
  }, []);

  return flags;
};

const ConditionalLazyLoading = () => {
  const featureFlags = useFeatureFlags();

  // Conditionally create lazy components based on feature flags
  const DashboardComponent = useMemo(() => {
    if (featureFlags.enableNewDashboard) {
      return React.lazy(() => import("./components/NewDashboard"));
    }
    return React.lazy(() => import("./components/LegacyDashboard"));
  }, [featureFlags.enableNewDashboard]);

  const AnalyticsComponent = useMemo(() => {
    if (featureFlags.enableAdvancedAnalytics) {
      return React.lazy(() => import("./components/AdvancedAnalytics"));
    }
    return React.lazy(() => import("./components/BasicAnalytics"));
  }, [featureFlags.enableAdvancedAnalytics]);

  const BetaFeaturesComponent = useMemo(() => {
    if (featureFlags.enableBetaFeatures) {
      return React.lazy(() => import("./components/BetaFeatures"));
    }
    return null;
  }, [featureFlags.enableBetaFeatures]);

  return (
    <div>
      <Suspense fallback={<div>Loading dashboard...</div>}>
        <DashboardComponent />
      </Suspense>

      <Suspense fallback={<div>Loading analytics...</div>}>
        <AnalyticsComponent />
      </Suspense>

      {BetaFeaturesComponent && (
        <Suspense fallback={<div>Loading beta features...</div>}>
          <BetaFeaturesComponent />
        </Suspense>
      )}
    </div>
  );
};
```

### Lazy Loading with Route-based Code Splitting

```typescript
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Lazy load pages
const HomePage = React.lazy(() => import("./pages/HomePage"));
const AboutPage = React.lazy(() => import("./pages/AboutPage"));
const ContactPage = React.lazy(() => import("./pages/ContactPage"));
const DashboardPage = React.lazy(() => import("./pages/DashboardPage"));
const ProfilePage = React.lazy(() => import("./pages/ProfilePage"));

// Lazy load dashboard sub-components
const DashboardOverview = React.lazy(
  () => import("./components/DashboardOverview")
);
const DashboardSettings = React.lazy(
  () => import("./components/DashboardSettings")
);
const DashboardAnalytics = React.lazy(
  () => import("./components/DashboardAnalytics")
);

interface LoadingComponentProps {
  message?: string;
}

const LoadingComponent: React.FC<LoadingComponentProps> = ({
  message = "Loading...",
}) => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <p>{message}</p>
  </div>
);

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isAuthenticated = useAuth(); // Custom hook for auth state

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppRouter = () => {
  return (
    <Router>
      <div className="app">
        <Navigation />

        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <Suspense
                  fallback={<LoadingComponent message="Loading home page..." />}
                >
                  <HomePage />
                </Suspense>
              }
            />

            <Route
              path="/about"
              element={
                <Suspense
                  fallback={
                    <LoadingComponent message="Loading about page..." />
                  }
                >
                  <AboutPage />
                </Suspense>
              }
            />

            <Route
              path="/contact"
              element={
                <Suspense
                  fallback={
                    <LoadingComponent message="Loading contact page..." />
                  }
                >
                  <ContactPage />
                </Suspense>
              }
            />

            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <Suspense
                    fallback={
                      <LoadingComponent message="Loading dashboard..." />
                    }
                  >
                    <DashboardPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Suspense
                    fallback={<LoadingComponent message="Loading profile..." />}
                  >
                    <ProfilePage />
                  </Suspense>
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

// Dashboard with nested lazy loading
const DashboardPage = () => {
  return (
    <div className="dashboard">
      <aside className="dashboard-sidebar">
        <DashboardNavigation />
      </aside>

      <main className="dashboard-content">
        <Routes>
          <Route
            path="/"
            element={
              <Suspense
                fallback={<LoadingComponent message="Loading overview..." />}
              >
                <DashboardOverview />
              </Suspense>
            }
          />

          <Route
            path="/settings"
            element={
              <Suspense
                fallback={<LoadingComponent message="Loading settings..." />}
              >
                <DashboardSettings />
              </Suspense>
            }
          />

          <Route
            path="/analytics"
            element={
              <Suspense
                fallback={<LoadingComponent message="Loading analytics..." />}
              >
                <DashboardAnalytics />
              </Suspense>
            }
          />
        </Routes>
      </main>
    </div>
  );
};
```

## Dynamic Component Loading

### Runtime Component Loading

```typescript
interface DynamicComponentLoaderProps {
  componentName: string;
  props?: Record<string, any>;
  fallback?: React.ReactNode;
}

const DynamicComponentLoader: React.FC<DynamicComponentLoaderProps> = ({
  componentName,
  props = {},
  fallback = <div>Loading component...</div>,
}) => {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadComponent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Dynamic import based on component name
        const module = await import(`./components/${componentName}`);
        setComponent(() => module.default);
      } catch (err) {
        console.error(`Failed to load component: ${componentName}`, err);
        setError(`Failed to load ${componentName}`);
      } finally {
        setLoading(false);
      }
    };

    loadComponent();
  }, [componentName]);

  if (loading) {
    return <>{fallback}</>;
  }

  if (error) {
    return (
      <div className="component-error">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!Component) {
    return <div>Component not found: {componentName}</div>;
  }

  return <Component {...props} />;
};

// Usage
const DynamicComponentExample = () => {
  const [selectedComponent, setSelectedComponent] = useState("UserProfile");
  const [componentProps, setComponentProps] = useState({ userId: 123 });

  const availableComponents = [
    "UserProfile",
    "ProductList",
    "OrderHistory",
    "PaymentSettings",
  ];

  return (
    <div>
      <div>
        <label>Select Component:</label>
        <select
          value={selectedComponent}
          onChange={(e) => setSelectedComponent(e.target.value)}
        >
          {availableComponents.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <DynamicComponentLoader
        componentName={selectedComponent}
        props={componentProps}
        fallback={
          <div className="loading-skeleton">
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
          </div>
        }
      />
    </div>
  );
};
```

### Lazy Loading with Data Dependencies

```typescript
interface LazyComponentWithDataProps {
  userId: number;
}

const LazyComponentWithData: React.FC<LazyComponentWithDataProps> = ({
  userId,
}) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Preload data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // Lazy load component that depends on data
  const UserProfileComponent = useMemo(() => {
    if (!userData) return null;

    return React.lazy(() =>
      import("./components/UserProfile").then((module) => ({
        default: (props: any) => (
          <module.default {...props} userData={userData} />
        ),
      }))
    );
  }, [userData]);

  if (loading) {
    return <div>Loading user data...</div>;
  }

  if (!UserProfileComponent) {
    return <div>No user data available</div>;
  }

  return (
    <Suspense fallback={<div>Loading user profile component...</div>}>
      <UserProfileComponent userId={userId} />
    </Suspense>
  );
};

// Smart preloading with intersection observer
const useLazyComponentPreload = (
  componentImport: () => Promise<{ default: React.ComponentType<any> }>
) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const preloadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoaded) {
          componentImport().then(() => {
            setIsLoaded(true);
          });
        }
      },
      { rootMargin: "100px" } // Start loading 100px before element is visible
    );

    if (preloadRef.current) {
      observer.observe(preloadRef.current);
    }

    return () => observer.disconnect();
  }, [componentImport, isLoaded]);

  return preloadRef;
};

const IntersectionLazyLoad = () => {
  const HeavyComponent = React.lazy(
    () => import("./components/HeavyComponent")
  );

  const preloadRef = useLazyComponentPreload(
    () => import("./components/HeavyComponent")
  );

  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
        }
      },
      { threshold: 0.1 }
    );

    if (preloadRef.current) {
      observer.observe(preloadRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <div style={{ height: "150vh" }}>
        <p>Scroll down to load the heavy component...</p>
      </div>

      <div ref={preloadRef} style={{ minHeight: "400px" }}>
        {shouldRender && (
          <Suspense fallback={<div>Loading heavy component...</div>}>
            <HeavyComponent />
          </Suspense>
        )}
      </div>
    </div>
  );
};
```

## Performance Optimization

### Bundle Analysis and Optimization

```typescript
// webpack-bundle-analyzer configuration
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      openAnalyzer: false,
      reportFilename: "bundle-report.html",
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
        common: {
          name: "common",
          minChunks: 2,
          chunks: "all",
          enforce: true,
        },
      },
    },
  },
};

// Component-level optimization
const OptimizedLazyComponent = React.memo(
  React.lazy(() => import("./ExpensiveComponent"))
);

const LazyComponentWithOptimization = () => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [key, setKey] = useState(0);

  // Refresh component instance
  const refreshComponent = () => {
    setKey((prev) => prev + 1);
  };

  return (
    <div>
      <button onClick={() => setShouldLoad(!shouldLoad)}>
        {shouldLoad ? "Hide" : "Show"} Component
      </button>

      <button onClick={refreshComponent}>Refresh Component</button>

      {shouldLoad && (
        <Suspense fallback={<ComponentSkeleton />}>
          <OptimizedLazyComponent key={key} />
        </Suspense>
      )}
    </div>
  );
};

const ComponentSkeleton = () => (
  <div className="skeleton">
    <div className="skeleton-header"></div>
    <div className="skeleton-content">
      <div className="skeleton-line"></div>
      <div className="skeleton-line"></div>
      <div className="skeleton-line short"></div>
    </div>
  </div>
);
```

### Resource Hints and Preloading

```typescript
interface ResourceHintsProps {
  preloadRoutes?: string[];
  prefetchRoutes?: string[];
}

const ResourceHints: React.FC<ResourceHintsProps> = ({
  preloadRoutes = [],
  prefetchRoutes = [],
}) => {
  useEffect(() => {
    // Add preload hints for critical routes
    preloadRoutes.forEach((route) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "script";
      link.href = route;
      document.head.appendChild(link);
    });

    // Add prefetch hints for likely future routes
    prefetchRoutes.forEach((route) => {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = route;
      document.head.appendChild(link);
    });

    return () => {
      // Cleanup
      const preloadLinks = document.querySelectorAll('link[rel="preload"]');
      const prefetchLinks = document.querySelectorAll('link[rel="prefetch"]');

      preloadLinks.forEach((link) => link.remove());
      prefetchLinks.forEach((link) => link.remove());
    };
  }, [preloadRoutes, prefetchRoutes]);

  return null;
};

// Usage with route-based optimization
const OptimizedApp = () => {
  const location = useLocation();

  const getResourceHints = () => {
    switch (location.pathname) {
      case "/":
        return {
          preloadRoutes: ["/dashboard"], // User likely goes to dashboard
          prefetchRoutes: ["/profile", "/settings"],
        };
      case "/dashboard":
        return {
          prefetchRoutes: ["/analytics", "/reports"],
        };
      default:
        return {};
    }
  };

  const { preloadRoutes, prefetchRoutes } = getResourceHints();

  return (
    <div>
      <ResourceHints
        preloadRoutes={preloadRoutes}
        prefetchRoutes={prefetchRoutes}
      />

      <Routes>{/* Route definitions */}</Routes>
    </div>
  );
};
```

## Testing Lazy Components

### Testing Strategies

```typescript
import { render, screen, waitFor } from "@testing-library/react";
import { Suspense } from "react";

// Mock the lazy component
jest.mock("./LazyComponent", () => ({
  __esModule: true,
  default: () => <div data-testid="lazy-component">Lazy Component Loaded</div>,
}));

const LazyComponent = React.lazy(() => import("./LazyComponent"));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<div data-testid="loading">Loading...</div>}>
    {children}
  </Suspense>
);

describe("Lazy Component Loading", () => {
  it("should show loading state initially", () => {
    render(
      <TestWrapper>
        <LazyComponent />
      </TestWrapper>
    );

    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("should load lazy component after suspense resolves", async () => {
    render(
      <TestWrapper>
        <LazyComponent />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId("lazy-component")).toBeInTheDocument();
    });

    expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
  });
});

// Testing error boundaries with lazy components
describe("Lazy Component Error Handling", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console.error for these tests
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it("should handle lazy loading errors", async () => {
    // Mock a failed import
    jest.doMock(
      "./FailingComponent",
      () => {
        throw new Error("Failed to load component");
      },
      { virtual: true }
    );

    const FailingComponent = React.lazy(() => import("./FailingComponent"));

    render(
      <LazyLoadErrorBoundary>
        <Suspense fallback={<div>Loading...</div>}>
          <FailingComponent />
        </Suspense>
      </LazyLoadErrorBoundary>
    );

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });
});
```

## Best Practices

### Performance Guidelines

```typescript
// ✅ Good: Strategic code splitting
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const AdminPanel = React.lazy(() => import("./pages/AdminPanel")); // Heavy, admin-only

// ❌ Bad: Over-splitting small components
const Button = React.lazy(() => import("./components/Button")); // Too small for splitting

// ✅ Good: Grouping related components
const AuthComponents = React.lazy(() => import("./components/auth")); // Login, Register, etc.

// ✅ Good: Smart preloading
const useSmartPreload = () => {
  useEffect(() => {
    const preloadCriticalRoutes = () => {
      import("./pages/Dashboard"); // Preload likely next page
    };

    const timer = setTimeout(preloadCriticalRoutes, 2000);
    return () => clearTimeout(timer);
  }, []);
};

// ✅ Good: Error handling
const withLazyLoading = (importFn: () => Promise<any>) => {
  return React.lazy(() =>
    importFn().catch(() => ({
      default: () => <div>Failed to load component</div>,
    }))
  );
};

// ✅ Good: Loading states that match content
const ContentAwareSkeleton = ({ type }: { type: "list" | "card" | "form" }) => {
  switch (type) {
    case "list":
      return <ListSkeleton />;
    case "card":
      return <CardSkeleton />;
    case "form":
      return <FormSkeleton />;
    default:
      return <GenericSkeleton />;
  }
};
```

## Common Interview Questions

### Basic Questions

**Q: What is React.lazy and how does it work?**

React.lazy is a function that allows you to render a dynamic import as a regular component. It enables code splitting by creating separate bundles that are loaded on demand:

```typescript
const LazyComponent = React.lazy(() => import("./MyComponent"));

// Must be wrapped in Suspense
<Suspense fallback={<div>Loading...</div>}>
  <LazyComponent />
</Suspense>;
```

**Q: What is Suspense and why is it required with React.lazy?**

Suspense is a component that lets you specify a loading UI while waiting for lazy components to load. It's required because lazy components are asynchronous and React needs to know what to render while the component is being loaded.

**Q: What are the benefits of code splitting?**

- Reduced initial bundle size
- Faster initial page load
- Better caching strategies
- Load components only when needed
- Improved performance for large applications

### Intermediate Questions

**Q: How do you handle errors in lazy-loaded components?**

Use Error Boundaries to catch and handle errors:

```typescript
class LazyErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong</div>;
    }
    return this.props.children;
  }
}
```

**Q: How do you preload lazy components?**

You can preload by calling the import function:

```typescript
const LazyComponent = React.lazy(() => import("./Component"));

// Preload
const preload = () => import("./Component");

// Trigger preload on hover or after initial load
useEffect(() => {
  setTimeout(preload, 2000);
}, []);
```

**Q: What's the difference between React.lazy and dynamic imports?**

- React.lazy is specifically for React components and returns a React component
- Dynamic imports are a JavaScript feature that returns a Promise
- React.lazy must be used with Suspense, dynamic imports don't require it

### Advanced Questions

**Q: How do you implement route-based code splitting with React Router?**

```typescript
const Home = React.lazy(() => import("./pages/Home"));
const About = React.lazy(() => import("./pages/About"));

<Router>
  <Suspense fallback={<div>Loading page...</div>}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  </Suspense>
</Router>;
```

**Q: How do you optimize bundle splitting strategies?**

- Split at route level for different pages
- Split large libraries into separate chunks
- Group related functionality together
- Use webpack-bundle-analyzer to identify opportunities
- Implement smart preloading based on user behavior

**Q: How do you test components that use React.lazy?**

Mock the lazy component and test the loading states:

```typescript
jest.mock("./LazyComponent", () => ({
  __esModule: true,
  default: () => <div>Mocked Component</div>,
}));

test("shows loading state", () => {
  render(
    <Suspense fallback={<div>Loading</div>}>
      <LazyComponent />
    </Suspense>
  );

  expect(screen.getByText("Loading")).toBeInTheDocument();
});
```

**Q: What are the performance implications of lazy loading?**

- Reduces initial bundle size but adds network requests
- Can cause layout shifts if not handled properly
- Requires thoughtful loading states and error handling
- May increase complexity but improves perceived performance
- Best for large components or features not immediately needed

Lazy loading is essential for building performant React applications at scale, enabling you to deliver faster initial experiences while maintaining rich functionality.
