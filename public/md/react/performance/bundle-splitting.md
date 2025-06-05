# React Bundle Splitting and Code Optimization

## Overview

Bundle splitting is a technique to divide your React application into smaller chunks that can be loaded on demand, reducing initial load time and improving performance. Modern tools like Webpack, Vite, and Parcel make this process seamless.

## React.lazy and Dynamic Imports

### Basic Lazy Loading

```javascript
import React, { Suspense, lazy } from "react";

// Lazy load components
const Dashboard = lazy(() => import("./Dashboard"));
const Profile = lazy(() => import("./Profile"));
const Settings = lazy(() => import("./Settings"));

const App = () => {
  const [currentView, setCurrentView] = useState("dashboard");

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard />;
      case "profile":
        return <Profile />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div>
      <nav>
        <button onClick={() => setCurrentView("dashboard")}>Dashboard</button>
        <button onClick={() => setCurrentView("profile")}>Profile</button>
        <button onClick={() => setCurrentView("settings")}>Settings</button>
      </nav>

      <Suspense fallback={<div>Loading...</div>}>{renderView()}</Suspense>
    </div>
  );
};
```

### Route-based Code Splitting

```javascript
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

// Lazy load route components
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const ProductList = lazy(() => import("./pages/ProductList"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));

const App = () => (
  <Router>
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/products">Products</Link>
      </nav>

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
        </Routes>
      </Suspense>
    </div>
  </Router>
);

const PageLoader = () => (
  <div className="page-loader">
    <div className="spinner" />
    <p>Loading page...</p>
  </div>
);
```

### Advanced Lazy Loading with Error Boundaries

```javascript
import { ErrorBoundary } from "react-error-boundary";

const LazyWrapper = ({ children, fallback, chunkName }) => (
  <ErrorBoundary
    fallback={<ChunkErrorFallback chunkName={chunkName} />}
    onError={(error, errorInfo) => {
      console.error(`Error loading chunk ${chunkName}:`, error, errorInfo);
    }}
  >
    <Suspense fallback={fallback}>{children}</Suspense>
  </ErrorBoundary>
);

const ChunkErrorFallback = ({ chunkName }) => (
  <div className="chunk-error">
    <h3>Failed to load {chunkName}</h3>
    <button onClick={() => window.location.reload()}>Retry</button>
  </div>
);

const Dashboard = () => {
  const AnalyticsDashboard = lazy(() =>
    import("./components/AnalyticsDashboard").catch(() => ({
      default: () => <div>Analytics unavailable</div>,
    }))
  );

  return (
    <div>
      <h1>Dashboard</h1>
      <LazyWrapper
        fallback={<AnalyticsLoader />}
        chunkName="Analytics Dashboard"
      >
        <AnalyticsDashboard />
      </LazyWrapper>
    </div>
  );
};
```

## Component-based Code Splitting

### Feature-based Splitting

```javascript
// components/FeatureLoader.js
export const loadFeature = (featureName) => {
  switch (featureName) {
    case "calendar":
      return import("./features/Calendar/CalendarFeature");
    case "messaging":
      return import("./features/Messaging/MessagingFeature");
    case "analytics":
      return import("./features/Analytics/AnalyticsFeature");
    case "reporting":
      return import("./features/Reporting/ReportingFeature");
    default:
      return Promise.reject(new Error(`Unknown feature: ${featureName}`));
  }
};

// Usage
const FeatureContainer = ({ featureName, ...props }) => {
  const [Feature, setFeature] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFeature(featureName)
      .then((module) => {
        setFeature(() => module.default);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [featureName]);

  if (loading) return <FeatureLoader />;
  if (error) return <FeatureError error={error} />;
  if (!Feature) return null;

  return <Feature {...props} />;
};
```

### Modal-based Splitting

```javascript
const useAsyncModal = () => {
  const [modalComponent, setModalComponent] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(async (modalName, props = {}) => {
    setIsOpen(true);

    try {
      const modalModule = await import(`./modals/${modalName}Modal`);
      setModalComponent(() => modalModule.default);
    } catch (error) {
      console.error(`Failed to load modal: ${modalName}`, error);
      setIsOpen(false);
    }
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setModalComponent(null);
  }, []);

  return { modalComponent, isOpen, openModal, closeModal };
};

const App = () => {
  const {
    modalComponent: Modal,
    isOpen,
    openModal,
    closeModal,
  } = useAsyncModal();

  return (
    <div>
      <button onClick={() => openModal("UserProfile", { userId: 123 })}>
        Open Profile
      </button>
      <button onClick={() => openModal("Settings")}>Open Settings</button>

      {isOpen && (
        <Suspense fallback={<ModalLoader />}>
          {Modal && <Modal onClose={closeModal} />}
        </Suspense>
      )}
    </div>
  );
};
```

## Library Code Splitting

### Vendor Chunk Optimization

```javascript
// webpack.config.js
module.exports = {
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
          priority: 5,
          reuseExistingChunk: true,
        },
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: "react",
          chunks: "all",
        },
        lodash: {
          test: /[\\/]node_modules[\\/]lodash[\\/]/,
          name: "lodash",
          chunks: "all",
        },
      },
    },
  },
};
```

### Dynamic Library Loading

```javascript
const useDynamicLibrary = (libraryName) => {
  const [library, setLibrary] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadLibrary = useCallback(async () => {
    if (library || loading) return library;

    setLoading(true);
    try {
      const lib = await import(libraryName);
      setLibrary(lib);
      return lib;
    } catch (error) {
      console.error(`Failed to load library: ${libraryName}`, error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [library, loading, libraryName]);

  return { library, loading, loadLibrary };
};

// Usage examples
const ChartComponent = ({ data }) => {
  const {
    library: chartLib,
    loading,
    loadLibrary,
  } = useDynamicLibrary("chart.js");
  const chartRef = useRef();

  useEffect(() => {
    loadLibrary().then((lib) => {
      if (chartRef.current) {
        new lib.Chart(chartRef.current, {
          type: "bar",
          data: data,
        });
      }
    });
  }, [data, loadLibrary]);

  if (loading) return <div>Loading chart...</div>;

  return <canvas ref={chartRef} />;
};
```

## Preloading Strategies

### Link Preloading

```javascript
const usePreloadRoute = () => {
  const preloadRoute = useCallback((routePath) => {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = routePath;
    document.head.appendChild(link);
  }, []);

  return preloadRoute;
};

const NavigationLink = ({ to, children, preload = false }) => {
  const preloadRoute = usePreloadRoute();

  const handleMouseEnter = useCallback(() => {
    if (preload) {
      preloadRoute(to);
    }
  }, [preload, preloadRoute, to]);

  return (
    <Link to={to} onMouseEnter={handleMouseEnter}>
      {children}
    </Link>
  );
};
```

### Component Preloading

```javascript
const ComponentPreloader = ({ components }) => {
  useEffect(() => {
    components.forEach((componentPath) => {
      import(componentPath).catch((error) => {
        console.warn(`Failed to preload component: ${componentPath}`, error);
      });
    });
  }, [components]);

  return null;
};

const App = () => {
  return (
    <div>
      <ComponentPreloader
        components={[
          "./components/UserProfile",
          "./components/Settings",
          "./components/Dashboard",
        ]}
      />
      <Router>{/* Routes */}</Router>
    </div>
  );
};
```

## Bundle Analysis

### Webpack Bundle Analyzer

```javascript
// webpack.config.js
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
};
```

### Custom Bundle Monitor

```javascript
const useBundleMonitor = () => {
  useEffect(() => {
    if ("connection" in navigator) {
      const connection = navigator.connection;

      if (
        connection.effectiveType === "slow-2g" ||
        connection.effectiveType === "2g"
      ) {
        console.warn(
          "Slow connection detected, consider loading fewer resources"
        );
      }
    }

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === "navigation") {
          console.log(
            "Bundle load time:",
            entry.loadEventEnd - entry.fetchStart
          );
        }
      }
    });

    observer.observe({ entryTypes: ["navigation"] });

    return () => observer.disconnect();
  }, []);
};
```

## Advanced Optimization Techniques

### Tree Shaking

```javascript
// ❌ Imports entire library
import _ from "lodash";

// ✅ Imports only needed functions
import debounce from "lodash/debounce";
import throttle from "lodash/throttle";

// ✅ Using ES modules for better tree shaking
import { debounce, throttle } from "lodash-es";
```

### Dead Code Elimination

```javascript
// utils/conditionalImports.js
export const importIfSupported = async (feature, fallback) => {
  if (typeof window !== "undefined" && window[feature]) {
    return import("./modernFeature");
  }
  return import("./fallbackFeature");
};

// Usage
const FeatureComponent = () => {
  const [Component, setComponent] = useState(null);

  useEffect(() => {
    importIfSupported("IntersectionObserver", "polyfill").then((module) =>
      setComponent(() => module.default)
    );
  }, []);

  return Component ? <Component /> : <div>Loading feature...</div>;
};
```

### Service Worker Integration

```javascript
// sw.js
const CACHE_NAME = "react-app-v1";
const urlsToCache = ["/", "/static/js/main.js", "/static/css/main.css"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// React component
const useServiceWorker = () => {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered:", registration);
        })
        .catch((error) => {
          console.log("SW registration failed:", error);
        });
    }
  }, []);
};
```

## Performance Monitoring

### Bundle Size Tracking

```javascript
const useBundleSizeMonitor = () => {
  useEffect(() => {
    const measureBundleSize = () => {
      const scripts = document.querySelectorAll("script[src]");
      let totalSize = 0;

      scripts.forEach((script) => {
        fetch(script.src, { method: "HEAD" }).then((response) => {
          const size = response.headers.get("content-length");
          if (size) {
            totalSize += parseInt(size);
            console.log(`Bundle size: ${(totalSize / 1024).toFixed(2)} KB`);
          }
        });
      });
    };

    measureBundleSize();
  }, []);
};
```

### Load Time Optimization

```javascript
const LoadTimeOptimizer = ({ children }) => {
  const [isSlowConnection, setIsSlowConnection] = useState(false);

  useEffect(() => {
    if ("connection" in navigator) {
      const connection = navigator.connection;
      setIsSlowConnection(
        connection.effectiveType === "slow-2g" ||
          connection.effectiveType === "2g"
      );
    }
  }, []);

  if (isSlowConnection) {
    return <LightweightVersion />;
  }

  return children;
};
```

## Best Practices

### ✅ Do

```javascript
// Split by routes
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));

// Split by features
const AdminPanel = lazy(() => import("./features/Admin"));

// Preload critical chunks
const preloadCriticalChunks = () => {
  import("./components/UserMenu");
  import("./components/SearchBar");
};

// Use meaningful chunk names
const Dashboard = lazy(() =>
  import(/* webpackChunkName: "dashboard" */ "./Dashboard")
);
```

### ❌ Don't

```javascript
// Don't split every component
const SmallComponent = lazy(() => import("./SmallComponent"));

// Don't create too many small chunks
const TinyFeature = lazy(() => import("./TinyFeature"));

// Don't forget error boundaries
const RiskyComponent = lazy(() => import("./RiskyComponent"));
```

## Interview Questions

**Q: What is code splitting and why is it important?**
A: Code splitting divides your application bundle into smaller chunks that load on demand, reducing initial load time and improving performance, especially for large applications.

**Q: How does React.lazy work?**
A: React.lazy enables dynamic imports of components, returning a Promise that resolves to a module with a default export containing a React component.

**Q: What's the difference between static and dynamic imports?**
A: Static imports are evaluated at compile time and include all code in the main bundle. Dynamic imports are evaluated at runtime and enable code splitting.

**Q: How do you handle errors in lazy-loaded components?**
A: Use Error Boundaries to catch errors from lazy components and provide fallback UI. You can also handle import errors in the dynamic import promise.

## Common Patterns

1. **Route-based splitting** - Split by page/route
2. **Feature-based splitting** - Split by feature modules
3. **Vendor splitting** - Separate vendor libraries
4. **Preloading** - Load chunks before needed
5. **Progressive loading** - Load features as user progresses

Bundle splitting is essential for modern React applications. Focus on meaningful splits that improve user experience while maintaining code organization.
