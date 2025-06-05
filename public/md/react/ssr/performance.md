# SSR Performance Optimization

Server-side rendering (SSR) performance optimization focuses on reducing time to first byte (TTFB), improving initial page load times, and ensuring smooth hydration while maintaining good user experience and SEO benefits.

## Core SSR Performance Metrics

### Critical Performance Indicators

```typescript
interface SSRMetrics {
  ttfb: number; // Time to First Byte
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  tti: number; // Time to Interactive
  hydrationTime: number; // Client-side hydration duration
  serverRenderTime: number; // Server rendering duration
}

const SSRPerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<SSRMetrics | null>(null);

  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();

      const navigationEntry = entries.find(
        (entry) => entry.entryType === "navigation"
      ) as PerformanceNavigationTiming;

      if (navigationEntry) {
        const newMetrics: SSRMetrics = {
          ttfb: navigationEntry.responseStart - navigationEntry.requestStart,
          fcp:
            performance.getEntriesByName("first-contentful-paint")[0]
              ?.startTime || 0,
          lcp:
            performance.getEntriesByName("largest-contentful-paint")[0]
              ?.startTime || 0,
          tti:
            performance.getEntriesByName("first-input-delay")[0]?.startTime ||
            0,
          hydrationTime:
            performance.getEntriesByName("hydration-complete")[0]?.startTime ||
            0,
          serverRenderTime:
            navigationEntry.domContentLoadedEventStart -
            navigationEntry.responseStart,
        };

        setMetrics(newMetrics);
      }
    });

    observer.observe({
      entryTypes: ["navigation", "paint", "largest-contentful-paint"],
    });

    return () => observer.disconnect();
  }, []);

  return metrics;
};
```

## Server-Side Optimization Strategies

### Streaming SSR Implementation

```typescript
import { renderToPipeableStream } from "react-dom/server";
import { PassThrough } from "stream";

const StreamingServerRenderer = async (
  App: React.ComponentType,
  request: Request
) => {
  return new Promise((resolve, reject) => {
    const stream = new PassThrough();
    let shellReady = false;

    const { pipe, abort } = renderToPipeableStream(<App />, {
      onShellReady() {
        shellReady = true;
        stream.setHeader("Content-Type", "text/html");
        pipe(stream);
      },
      onShellError(error) {
        reject(error);
      },
      onAllReady() {
        if (!shellReady) {
          stream.setHeader("Content-Type", "text/html");
          pipe(stream);
        }
      },
      onError(error) {
        console.error("Streaming error:", error);
      },
    });

    setTimeout(() => {
      abort();
      reject(new Error("SSR timeout"));
    }, 10000); // 10 second timeout

    resolve(stream);
  });
};

// Next.js 13+ streaming with Suspense
const StreamingPage = () => {
  return (
    <html>
      <head>
        <title>Streaming SSR Page</title>
        <link rel="preload" href="/critical-styles.css" as="style" />
      </head>
      <body>
        <div id="root">
          {/* Critical above-the-fold content */}
          <header>
            <nav>Navigation Menu</nav>
          </header>

          <main>
            <section>
              <h1>Welcome to Our Site</h1>
              <p>This content loads immediately</p>
            </section>

            {/* Streaming content with Suspense boundaries */}
            <Suspense fallback={<UserProfileSkeleton />}>
              <UserProfile />
            </Suspense>

            <Suspense fallback={<RecommendationsSkeleton />}>
              <PersonalizedRecommendations />
            </Suspense>

            <Suspense fallback={<AnalyticsSkeleton />}>
              <AnalyticsDashboard />
            </Suspense>
          </main>
        </div>
      </body>
    </html>
  );
};
```

### Selective Hydration Optimization

```typescript
import { hydrateRoot } from "react-dom/client";

const SelectiveHydrationManager = () => {
  const [hydratedComponents, setHydratedComponents] = useState<Set<string>>(
    new Set()
  );
  const observerRef = useRef<IntersectionObserver>();

  useEffect(() => {
    // Create intersection observer for progressive hydration
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const componentId = entry.target.getAttribute("data-component-id");
            if (componentId && !hydratedComponents.has(componentId)) {
              hydrateComponent(componentId);
              setHydratedComponents((prev) => new Set([...prev, componentId]));
            }
          }
        });
      },
      {
        rootMargin: "100px",
        threshold: 0.1,
      }
    );

    // Observe all hydration candidates
    document
      .querySelectorAll("[data-hydrate-on-visible]")
      .forEach((element) => {
        observerRef.current?.observe(element);
      });

    return () => observerRef.current?.disconnect();
  }, [hydratedComponents]);

  const hydrateComponent = async (componentId: string) => {
    const element = document.querySelector(
      `[data-component-id="${componentId}"]`
    );
    if (!element) return;

    try {
      performance.mark(`hydration-start-${componentId}`);

      const { component } = await import(`../components/${componentId}`);
      const root = hydrateRoot(element, component);

      performance.mark(`hydration-end-${componentId}`);
      performance.measure(
        `hydration-${componentId}`,
        `hydration-start-${componentId}`,
        `hydration-end-${componentId}`
      );

      console.log(`Hydrated component: ${componentId}`);
    } catch (error) {
      console.error(`Failed to hydrate component ${componentId}:`, error);
    }
  };

  return null;
};

// Component wrapper for selective hydration
const HydrationBoundary: React.FC<{
  children: React.ReactNode;
  componentId: string;
  priority?: "high" | "medium" | "low";
  hydrateOnVisible?: boolean;
}> = ({
  children,
  componentId,
  priority = "medium",
  hydrateOnVisible = true,
}) => {
  const isServer = typeof window === "undefined";

  if (isServer) {
    return (
      <div
        data-component-id={componentId}
        data-hydrate-on-visible={hydrateOnVisible}
        data-priority={priority}
      >
        {children}
      </div>
    );
  }

  return <>{children}</>;
};
```

## Caching and Data Optimization

### Server-Side Caching Strategies

```typescript
import { LRUCache } from "lru-cache";

interface CacheConfig {
  maxSize: number;
  ttl: number; // Time to live in milliseconds
  staleWhileRevalidate?: number;
}

class SSRCacheManager {
  private cache: LRUCache<string, any>;
  private renderCache: LRUCache<string, string>;
  private dataCache: LRUCache<string, any>;

  constructor() {
    this.cache = new LRUCache({
      max: 1000,
      ttl: 1000 * 60 * 5, // 5 minutes
    });

    this.renderCache = new LRUCache({
      max: 500,
      ttl: 1000 * 60 * 10, // 10 minutes
    });

    this.dataCache = new LRUCache({
      max: 2000,
      ttl: 1000 * 60 * 15, // 15 minutes
    });
  }

  generateCacheKey(url: string, userAgent?: string, cookies?: string): string {
    const urlParams = new URL(url);
    const sortedParams = Array.from(urlParams.searchParams.entries()).sort(
      ([a], [b]) => a.localeCompare(b)
    );

    return [
      urlParams.pathname,
      JSON.stringify(sortedParams),
      userAgent ? btoa(userAgent).slice(0, 10) : "",
      cookies ? btoa(cookies).slice(0, 10) : "",
    ].join("::");
  }

  async getCachedRender(cacheKey: string): Promise<string | null> {
    return this.renderCache.get(cacheKey) || null;
  }

  setCachedRender(cacheKey: string, html: string, customTtl?: number): void {
    if (customTtl) {
      this.renderCache.set(cacheKey, html, { ttl: customTtl });
    } else {
      this.renderCache.set(cacheKey, html);
    }
  }

  async getCachedData<T>(key: string): Promise<T | null> {
    return this.dataCache.get(key) || null;
  }

  setCachedData<T>(key: string, data: T, customTtl?: number): void {
    if (customTtl) {
      this.dataCache.set(key, data, { ttl: customTtl });
    } else {
      this.dataCache.set(key, data);
    }
  }

  invalidateByPattern(pattern: RegExp): void {
    for (const key of this.renderCache.keys()) {
      if (pattern.test(key)) {
        this.renderCache.delete(key);
      }
    }

    for (const key of this.dataCache.keys()) {
      if (pattern.test(key)) {
        this.dataCache.delete(key);
      }
    }
  }

  getStats() {
    return {
      renderCache: {
        size: this.renderCache.size,
        hits: this.renderCache.calculatedSize,
      },
      dataCache: {
        size: this.dataCache.size,
        hits: this.dataCache.calculatedSize,
      },
    };
  }
}

const cacheManager = new SSRCacheManager();

// Usage in Next.js API route or server component
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const cacheKey = cacheManager.generateCacheKey(
    context.resolvedUrl,
    context.req.headers["user-agent"],
    context.req.headers.cookie
  );

  let cachedData = await cacheManager.getCachedData(cacheKey);

  if (!cachedData) {
    performance.mark("data-fetch-start");

    cachedData = await Promise.all([
      fetchUserData(context.params?.id),
      fetchRecentPosts(),
      fetchRecommendations(context.params?.id),
    ]);

    performance.mark("data-fetch-end");
    performance.measure("data-fetch", "data-fetch-start", "data-fetch-end");

    // Cache for 5 minutes
    cacheManager.setCachedData(cacheKey, cachedData, 1000 * 60 * 5);
  }

  return {
    props: {
      data: cachedData,
      cacheKey,
      timestamp: Date.now(),
    },
  };
}
```

### Data Prefetching and Preloading

```typescript
interface PrefetchStrategy {
  route: string;
  priority: "high" | "medium" | "low";
  prefetchOn: "hover" | "visible" | "idle";
  prefetchData?: boolean;
}

const usePrefetchOptimization = () => {
  const router = useRouter();
  const [prefetchedRoutes, setPrefetchedRoutes] = useState<Set<string>>(
    new Set()
  );

  const prefetchStrategies: PrefetchStrategy[] = [
    {
      route: "/dashboard",
      priority: "high",
      prefetchOn: "hover",
      prefetchData: true,
    },
    {
      route: "/profile",
      priority: "medium",
      prefetchOn: "visible",
      prefetchData: true,
    },
    {
      route: "/settings",
      priority: "low",
      prefetchOn: "idle",
      prefetchData: false,
    },
  ];

  const prefetchRoute = useCallback(
    async (route: string, strategy: PrefetchStrategy) => {
      if (prefetchedRoutes.has(route)) return;

      try {
        performance.mark(`prefetch-start-${route}`);

        // Prefetch the page component
        await router.prefetch(route);

        // Optionally prefetch data
        if (strategy.prefetchData) {
          const response = await fetch(`/api${route}`, {
            headers: { "X-Prefetch": "true" },
          });

          if (response.ok) {
            const data = await response.json();
            // Store in cache or state management
            cacheManager.setCachedData(`prefetch-${route}`, data);
          }
        }

        performance.mark(`prefetch-end-${route}`);
        performance.measure(
          `prefetch-${route}`,
          `prefetch-start-${route}`,
          `prefetch-end-${route}`
        );

        setPrefetchedRoutes((prev) => new Set([...prev, route]));
      } catch (error) {
        console.error(`Failed to prefetch ${route}:`, error);
      }
    },
    [router, prefetchedRoutes]
  );

  const setupPrefetching = useCallback(() => {
    prefetchStrategies.forEach((strategy) => {
      const elements = document.querySelectorAll(`[href="${strategy.route}"]`);

      elements.forEach((element) => {
        switch (strategy.prefetchOn) {
          case "hover":
            element.addEventListener("mouseenter", () =>
              prefetchRoute(strategy.route, strategy)
            );
            break;
          case "visible":
            const observer = new IntersectionObserver(
              ([entry]) => {
                if (entry.isIntersecting) {
                  prefetchRoute(strategy.route, strategy);
                  observer.disconnect();
                }
              },
              { rootMargin: "100px" }
            );
            observer.observe(element);
            break;
          case "idle":
            if ("requestIdleCallback" in window) {
              requestIdleCallback(() =>
                prefetchRoute(strategy.route, strategy)
              );
            } else {
              setTimeout(() => prefetchRoute(strategy.route, strategy), 2000);
            }
            break;
        }
      });
    });
  }, [prefetchRoute]);

  useEffect(() => {
    setupPrefetching();
  }, [setupPrefetching]);

  return { prefetchedRoutes, prefetchRoute };
};
```

## Bundle and Asset Optimization

### Critical Resource Loading

```typescript
interface CriticalResourceManager {
  preloadCriticalAssets(): void;
  prefetchNonCriticalAssets(): void;
  optimizeImageLoading(): void;
}

const useCriticalResourceManager = (): CriticalResourceManager => {
  const preloadCriticalAssets = useCallback(() => {
    const criticalAssets = [
      { href: "/styles/critical.css", as: "style" },
      {
        href: "/fonts/primary-font.woff2",
        as: "font",
        type: "font/woff2",
        crossorigin: "anonymous",
      },
      { href: "/api/user-data", as: "fetch", crossorigin: "anonymous" },
    ];

    criticalAssets.forEach((asset) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = asset.href;
      link.as = asset.as;
      if (asset.type) link.type = asset.type;
      if (asset.crossorigin) link.crossOrigin = asset.crossorigin;

      document.head.appendChild(link);
    });
  }, []);

  const prefetchNonCriticalAssets = useCallback(() => {
    const nonCriticalAssets = [
      "/js/analytics.js",
      "/js/chat-widget.js",
      "/styles/non-critical.css",
      "/images/hero-background.webp",
    ];

    nonCriticalAssets.forEach((href) => {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = href;
      document.head.appendChild(link);
    });
  }, []);

  const optimizeImageLoading = useCallback(() => {
    if ("loading" in HTMLImageElement.prototype) {
      // Native lazy loading support
      document.querySelectorAll("img[data-src]").forEach((img) => {
        img.loading = "lazy";
        img.src = img.dataset.src!;
      });
    } else {
      // Fallback to Intersection Observer
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src!;
            img.classList.remove("lazy");
            imageObserver.unobserve(img);
          }
        });
      });

      document.querySelectorAll("img[data-src]").forEach((img) => {
        imageObserver.observe(img);
      });
    }
  }, []);

  return {
    preloadCriticalAssets,
    prefetchNonCriticalAssets,
    optimizeImageLoading,
  };
};

// Next.js optimization with custom Document
class OptimizedDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return initialProps;
  }

  render() {
    return (
      <Html>
        <Head>
          {/* Critical CSS inline */}
          <style
            dangerouslySetInnerHTML={{
              __html: criticalCSS, // Generated critical CSS
            }}
          />

          {/* Preload critical resources */}
          <link
            rel="preload"
            href="/fonts/primary.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/api/initial-data"
            as="fetch"
            crossOrigin="anonymous"
          />

          {/* DNS prefetch for external domains */}
          <link rel="dns-prefetch" href="//cdn.example.com" />
          <link rel="dns-prefetch" href="//analytics.google.com" />

          {/* Preconnect for critical external resources */}
          <link rel="preconnect" href="//fonts.googleapis.com" />
          <link rel="preconnect" href="//api.example.com" />
        </Head>
        <body>
          <Main />
          <NextScript />

          {/* Non-critical CSS */}
          <link
            rel="stylesheet"
            href="/styles/non-critical.css"
            media="print"
            onLoad="this.media='all'"
          />
        </body>
      </Html>
    );
  }
}
```

## Error Handling and Resilience

### SSR Error Boundaries and Fallbacks

```typescript
interface SSRErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  fallbackMode: "server" | "client" | "static";
}

class SSRErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<any> },
  SSRErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      hasError: false,
      fallbackMode: "server",
    };
  }

  static getDerivedStateFromError(
    error: Error
  ): Partial<SSRErrorBoundaryState> {
    return {
      hasError: true,
      error,
      fallbackMode: typeof window === "undefined" ? "server" : "client",
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("SSR Error:", error, errorInfo);

    // Send error to monitoring service
    if (typeof window !== "undefined") {
      fetch("/api/error-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: error.toString(),
          errorInfo,
          userAgent: navigator.userAgent,
          url: window.location.href,
          timestamp: new Date().toISOString(),
        }),
      }).catch(console.error);
    }
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultSSRFallback;

      return (
        <FallbackComponent
          error={this.state.error}
          fallbackMode={this.state.fallbackMode}
          retry={() => this.setState({ hasError: false, error: undefined })}
        />
      );
    }

    return this.props.children;
  }
}

const DefaultSSRFallback: React.FC<{
  error?: Error;
  fallbackMode: "server" | "client" | "static";
  retry: () => void;
}> = ({ error, fallbackMode, retry }) => {
  return (
    <div className="ssr-error-fallback">
      <h2>Something went wrong</h2>
      <p>An error occurred during {fallbackMode} rendering.</p>
      {fallbackMode === "client" && <button onClick={retry}>Try Again</button>}
      <details style={{ marginTop: "1rem" }}>
        <summary>Error details</summary>
        <pre>{error?.toString()}</pre>
      </details>
    </div>
  );
};

// Graceful degradation for hydration failures
const useHydrationErrorRecovery = () => {
  const [hydrationError, setHydrationError] = useState<boolean>(false);

  useEffect(() => {
    const handleHydrationError = (event: ErrorEvent) => {
      if (event.error?.message?.includes("Hydration")) {
        setHydrationError(true);
        console.warn(
          "Hydration error detected, falling back to client-side rendering"
        );

        // Force client-side re-render
        const root = document.getElementById("__next");
        if (root) {
          root.innerHTML = "";
          // Re-initialize React on client side only
          import("../client-only-entry").then(({ renderApp }) => {
            renderApp();
          });
        }
      }
    };

    window.addEventListener("error", handleHydrationError);
    return () => window.removeEventListener("error", handleHydrationError);
  }, []);

  return hydrationError;
};
```

## Performance Monitoring and Analytics

### SSR Performance Tracking

```typescript
interface SSRPerformanceAnalytics {
  trackRenderTime(componentName: string, renderTime: number): void;
  trackHydrationTime(componentName: string, hydrationTime: number): void;
  trackCacheHitRate(cacheType: string, hitRate: number): void;
  trackResourceLoadTime(resourceUrl: string, loadTime: number): void;
  generatePerformanceReport(): PerformanceReport;
}

interface PerformanceReport {
  serverRenderTime: number;
  hydrationTime: number;
  cacheHitRates: Record<string, number>;
  slowestComponents: Array<{ name: string; renderTime: number }>;
  criticalResourcesLoadTime: Record<string, number>;
  recommendations: string[];
}

class SSRPerformanceTracker implements SSRPerformanceAnalytics {
  private metrics: Map<string, number[]> = new Map();
  private cacheMetrics: Map<string, { hits: number; misses: number }> =
    new Map();
  private resourceMetrics: Map<string, number[]> = new Map();

  trackRenderTime(componentName: string, renderTime: number): void {
    const existing = this.metrics.get(`render-${componentName}`) || [];
    existing.push(renderTime);
    this.metrics.set(`render-${componentName}`, existing);
  }

  trackHydrationTime(componentName: string, hydrationTime: number): void {
    const existing = this.metrics.get(`hydration-${componentName}`) || [];
    existing.push(hydrationTime);
    this.metrics.set(`hydration-${componentName}`, existing);
  }

  trackCacheHitRate(cacheType: string, hitRate: number): void {
    const existing = this.cacheMetrics.get(cacheType) || { hits: 0, misses: 0 };
    if (hitRate > 0) {
      existing.hits++;
    } else {
      existing.misses++;
    }
    this.cacheMetrics.set(cacheType, existing);
  }

  trackResourceLoadTime(resourceUrl: string, loadTime: number): void {
    const existing = this.resourceMetrics.get(resourceUrl) || [];
    existing.push(loadTime);
    this.resourceMetrics.set(resourceUrl, existing);
  }

  generatePerformanceReport(): PerformanceReport {
    const serverRenderMetrics = this.metrics.get("server-render") || [0];
    const hydrationMetrics = this.metrics.get("hydration-total") || [0];

    const slowestComponents = Array.from(this.metrics.entries())
      .filter(([key]) => key.startsWith("render-"))
      .map(([key, times]) => ({
        name: key.replace("render-", ""),
        renderTime: Math.max(...times),
      }))
      .sort((a, b) => b.renderTime - a.renderTime)
      .slice(0, 5);

    const cacheHitRates: Record<string, number> = {};
    this.cacheMetrics.forEach((metrics, cacheType) => {
      const total = metrics.hits + metrics.misses;
      cacheHitRates[cacheType] = total > 0 ? (metrics.hits / total) * 100 : 0;
    });

    const criticalResourcesLoadTime: Record<string, number> = {};
    this.resourceMetrics.forEach((times, resource) => {
      criticalResourcesLoadTime[resource] = Math.max(...times);
    });

    const recommendations = this.generateRecommendations(
      Math.max(...serverRenderMetrics),
      Math.max(...hydrationMetrics),
      cacheHitRates,
      slowestComponents
    );

    return {
      serverRenderTime: Math.max(...serverRenderMetrics),
      hydrationTime: Math.max(...hydrationMetrics),
      cacheHitRates,
      slowestComponents,
      criticalResourcesLoadTime,
      recommendations,
    };
  }

  private generateRecommendations(
    serverRenderTime: number,
    hydrationTime: number,
    cacheHitRates: Record<string, number>,
    slowestComponents: Array<{ name: string; renderTime: number }>
  ): string[] {
    const recommendations: string[] = [];

    if (serverRenderTime > 1000) {
      recommendations.push(
        "Consider implementing streaming SSR to reduce TTFB"
      );
      recommendations.push("Optimize database queries and API calls");
    }

    if (hydrationTime > 2000) {
      recommendations.push(
        "Implement selective hydration for better perceived performance"
      );
      recommendations.push("Consider code splitting for large components");
    }

    Object.entries(cacheHitRates).forEach(([cacheType, hitRate]) => {
      if (hitRate < 70) {
        recommendations.push(
          `Improve cache strategy for ${cacheType} (current hit rate: ${hitRate.toFixed(
            1
          )}%)`
        );
      }
    });

    if (slowestComponents.length > 0 && slowestComponents[0].renderTime > 500) {
      recommendations.push(
        `Optimize ${slowestComponents[0].name} component rendering (${slowestComponents[0].renderTime}ms)`
      );
    }

    return recommendations;
  }
}

const performanceTracker = new SSRPerformanceTracker();

// Hook for component-level performance tracking
const useSSRPerformanceTracking = (componentName: string) => {
  const renderStartTime = useRef<number>();
  const hydrationStartTime = useRef<number>();

  useEffect(() => {
    // Track server render time
    if (renderStartTime.current) {
      const renderTime = performance.now() - renderStartTime.current;
      performanceTracker.trackRenderTime(componentName, renderTime);
    }

    // Track hydration time
    hydrationStartTime.current = performance.now();

    return () => {
      if (hydrationStartTime.current) {
        const hydrationTime = performance.now() - hydrationStartTime.current;
        performanceTracker.trackHydrationTime(componentName, hydrationTime);
      }
    };
  }, [componentName]);

  renderStartTime.current = performance.now();
};

export { performanceTracker, useSSRPerformanceTracking };
```

## Best Practices and Guidelines

### SSR Performance Checklist

1. **Server Optimization**

   - Implement server-side caching with appropriate TTL values
   - Use streaming SSR for improved TTFB
   - Optimize database queries and API calls
   - Implement proper error handling and fallbacks

2. **Bundle Optimization**

   - Split critical and non-critical CSS
   - Implement intelligent code splitting
   - Use resource hints (preload, prefetch, dns-prefetch)
   - Optimize font loading with preload and font-display

3. **Hydration Strategy**

   - Implement selective hydration for non-critical components
   - Use progressive hydration based on viewport visibility
   - Minimize hydration mismatches
   - Handle hydration errors gracefully

4. **Caching Strategy**

   - Implement multi-level caching (CDN, server, browser)
   - Use stale-while-revalidate patterns
   - Cache at component and data levels
   - Implement cache invalidation strategies

5. **Monitoring and Analytics**
   - Track Core Web Vitals (TTFB, FCP, LCP, CLS)
   - Monitor hydration performance
   - Measure cache hit rates
   - Set up performance budgets and alerts

## Common Interview Questions

### Basic Level

**Q: What are the main performance benefits of SSR?**

A: SSR provides several performance benefits:

- **Improved TTFB**: Server renders initial HTML, reducing time to first meaningful content
- **Better SEO**: Search engines can crawl pre-rendered content
- **Faster perceived performance**: Users see content before JavaScript loads
- **Reduced client-side work**: Initial rendering happens on server

**Q: How does streaming SSR improve performance?**

A: Streaming SSR sends HTML chunks as they become ready rather than waiting for complete page rendering, improving TTFB and perceived performance by showing content progressively.

### Intermediate Level

**Q: What is selective hydration and why is it important?**

A: Selective hydration allows React to hydrate components independently as they become needed (e.g., when visible or on interaction), reducing initial JavaScript execution time and improving Time to Interactive (TTI).

**Q: How do you optimize SSR caching strategies?**

A: Effective SSR caching involves:

- Page-level caching with appropriate TTL
- Component-level caching for expensive renders
- Data caching with cache invalidation
- CDN caching for static assets
- Browser caching with proper cache headers

### Advanced Level

**Q: How do you handle hydration mismatches in SSR applications?**

A: Handle hydration mismatches by:

- Ensuring server and client render the same content
- Using suppressHydrationWarning sparingly for unavoidable differences
- Implementing graceful fallbacks with error boundaries
- Using useEffect for client-only content
- Implementing proper error recovery mechanisms

**Q: What are the trade-offs of streaming SSR vs traditional SSR?**

A: Streaming SSR trade-offs:

- **Benefits**: Better TTFB, progressive content loading, improved perceived performance
- **Challenges**: More complex error handling, requires Suspense boundaries, can increase overall page load time
- **Best for**: Content-heavy pages with independent sections
- **Avoid for**: Simple pages where traditional SSR is sufficient

SSR performance optimization is crucial for delivering fast, user-friendly web applications that maintain SEO benefits while providing excellent user experience through strategic caching, streaming, and hydration techniques.
