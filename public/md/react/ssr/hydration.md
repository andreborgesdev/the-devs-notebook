# Hydration in React SSR

Hydration is the process of attaching event listeners and state to server-rendered HTML, making it interactive in the browser while preserving the initial server-rendered content.

## Understanding Hydration

### The Hydration Process

```typescript
// Server-side rendering produces static HTML
// Client-side JavaScript "hydrates" this HTML to make it interactive

// Server Component
export default async function UserProfile({ userId }: { userId: string }) {
  const user = await getUser(userId);

  return (
    <div className="user-profile">
      <img src={user.avatar} alt={user.name} />
      <h1>{user.name}</h1>
      <p>{user.bio}</p>

      {/* This button needs hydration to become interactive */}
      <FollowButton userId={userId} initialFollowState={user.isFollowing} />
    </div>
  );
}

// Client Component that needs hydration
("use client");

import { useState } from "react";

interface FollowButtonProps {
  userId: string;
  initialFollowState: boolean;
}

export default function FollowButton({
  userId,
  initialFollowState,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialFollowState);
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    setLoading(true);
    try {
      await toggleFollow(userId);
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Failed to toggle follow:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`btn ${isFollowing ? "btn-secondary" : "btn-primary"}`}
    >
      {loading ? "Loading..." : isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
}
```

### Hydration Mismatch Prevention

```typescript
// Common hydration mismatch: Date/time rendering
// ❌ Wrong - will cause hydration mismatch
export default function LastUpdated() {
  return <div>Last updated: {new Date().toLocaleString()}</div>;
}

// ✅ Correct - use useEffect for client-only rendering
("use client");

import { useState, useEffect } from "react";

export default function LastUpdated() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Last updated: Loading...</div>;
  }

  return <div>Last updated: {new Date().toLocaleString()}</div>;
}

// Better approach with custom hook
function useHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}

export default function ClientOnlyContent() {
  const hydrated = useHydrated();

  if (!hydrated) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p>Current time: {new Date().toLocaleString()}</p>
      <p>Random number: {Math.random()}</p>
    </div>
  );
}
```

## Selective Hydration

### Component-Level Hydration Control

```typescript
// Lazy hydration for non-critical components
import { lazy, Suspense } from "react";

const LazyModal = lazy(() => import("./Modal"));
const LazyChart = lazy(() => import("./Chart"));

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>

      {/* Critical content renders immediately */}
      <div className="stats">
        <StatCard title="Users" value="1,234" />
        <StatCard title="Revenue" value="$12,345" />
      </div>

      {/* Non-critical components hydrate lazily */}
      <Suspense fallback={<div>Loading chart...</div>}>
        <LazyChart />
      </Suspense>

      <Suspense fallback={<div>Loading modal...</div>}>
        <LazyModal />
      </Suspense>
    </div>
  );
}

// Custom hook for intersection-based hydration
function useIntersectionHydration() {
  const [shouldHydrate, setShouldHydrate] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldHydrate(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return { ref, shouldHydrate };
}

// Component that hydrates only when visible
export default function LazyComponent() {
  const { ref, shouldHydrate } = useIntersectionHydration();

  return (
    <div ref={ref}>
      {shouldHydrate ? (
        <ExpensiveInteractiveComponent />
      ) : (
        <StaticPlaceholder />
      )}
    </div>
  );
}
```

### Progressive Enhancement

```typescript
// Base functionality works without JavaScript
// Enhanced features require hydration

interface SearchFormProps {
  initialQuery?: string;
}

export default function SearchForm({ initialQuery = "" }: SearchFormProps) {
  return (
    <form action="/search" method="GET">
      <input
        name="q"
        type="search"
        defaultValue={initialQuery}
        placeholder="Search..."
        required
      />
      <button type="submit">Search</button>

      {/* Enhanced version with client-side features */}
      <EnhancedSearchFeatures />
    </form>
  );
}

// Client component for enhanced features
("use client");

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function EnhancedSearchFeatures() {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const debouncedSearch = useDebouncedCallback(async (searchQuery: string) => {
    if (searchQuery.length > 2) {
      const results = await fetchSuggestions(searchQuery);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  }, 300);

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  const handleSelect = (suggestion: string) => {
    router.push(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  return (
    <div className="search-enhancements">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type to search with suggestions..."
      />

      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSelect(suggestion)}
              className="suggestion-item"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## Hydration Performance

### Measuring Hydration Performance

```typescript
// Performance monitoring for hydration
"use client";

import { useEffect } from "react";

export default function HydrationMonitor() {
  useEffect(() => {
    // Measure Time to Interactive (TTI)
    const startTime = performance.now();

    const measureHydration = () => {
      const endTime = performance.now();
      const hydrationTime = endTime - startTime;

      // Send metrics to analytics
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "hydration_complete", {
          custom_parameter_1: hydrationTime,
          event_category: "Performance",
          event_label: "Hydration Time",
          value: Math.round(hydrationTime),
        });
      }

      // Log to console in development
      if (process.env.NODE_ENV === "development") {
        console.log(`Hydration completed in ${hydrationTime.toFixed(2)}ms`);
      }
    };

    // Use requestIdleCallback for non-blocking measurement
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      window.requestIdleCallback(measureHydration);
    } else {
      setTimeout(measureHydration, 0);
    }
  }, []);

  return null;
}

// Add to root layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {children}
        <HydrationMonitor />
      </body>
    </html>
  );
}
```

### Optimizing Hydration Bundle Size

```typescript
// Code splitting for better hydration performance
import { lazy, Suspense } from "react";

// Split heavy components
const HeavyChart = lazy(() => import("./HeavyChart"));
const ComplexForm = lazy(() => import("./ComplexForm"));
const ImageGallery = lazy(() => import("./ImageGallery"));

// Preload critical components
const CriticalComponent = lazy(() =>
  import("./CriticalComponent").then((module) => {
    // Preload related modules
    import("./RelatedComponent");
    return module;
  })
);

export default function OptimizedPage() {
  return (
    <div>
      {/* Critical content hydrates immediately */}
      <header>
        <Navigation />
      </header>

      <main>
        {/* Non-critical components load on demand */}
        <Suspense fallback={<ChartSkeleton />}>
          <HeavyChart />
        </Suspense>

        <Suspense fallback={<FormSkeleton />}>
          <ComplexForm />
        </Suspense>

        <Suspense fallback={<GallerySkeleton />}>
          <ImageGallery />
        </Suspense>
      </main>
    </div>
  );
}

// Dynamic imports with conditions
export default function ConditionalComponents() {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const loadAdvancedFeatures = async () => {
    const { AdvancedFeatures } = await import("./AdvancedFeatures");
    return AdvancedFeatures;
  };

  return (
    <div>
      <button onClick={() => setShowAdvanced(true)}>
        Show Advanced Features
      </button>

      {showAdvanced && (
        <Suspense fallback={<div>Loading advanced features...</div>}>
          <AsyncComponent loader={loadAdvancedFeatures} />
        </Suspense>
      )}
    </div>
  );
}
```

## Hydration Error Handling

### Error Boundaries for Hydration

```typescript
"use client";

import React, { ErrorInfo, ReactNode } from "react";

interface HydrationErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface HydrationErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default class HydrationErrorBoundary extends React.Component<
  HydrationErrorBoundaryProps,
  HydrationErrorBoundaryState
> {
  constructor(props: HydrationErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): HydrationErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log hydration errors
    console.error("Hydration error:", error, errorInfo);

    // Send to error reporting service
    if (typeof window !== "undefined") {
      // Report to Sentry, LogRocket, etc.
      reportError(error, {
        context: "hydration",
        componentStack: errorInfo.componentStack,
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="hydration-error">
            <h2>Something went wrong during hydration</h2>
            <button onClick={() => window.location.reload()}>
              Reload page
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// Usage
export default function App() {
  return (
    <HydrationErrorBoundary
      fallback={<div>Failed to load interactive features</div>}
    >
      <InteractiveComponent />
    </HydrationErrorBoundary>
  );
}
```

### Graceful Degradation

```typescript
// Component that works without hydration
"use client";

import { useState, useEffect } from "react";

interface SurveyFormProps {
  questions: Question[];
}

export default function SurveyForm({ questions }: SurveyFormProps) {
  const [hydrated, setHydrated] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    // Fallback to traditional form submission
    return (
      <form action="/submit-survey" method="POST">
        {questions.map((question) => (
          <div key={question.id}>
            <label>{question.text}</label>
            <input
              name={`answer_${question.id}`}
              type="text"
              required={question.required}
            />
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    );
  }

  // Enhanced interactive version
  return (
    <div className="interactive-survey">
      {questions.map((question) => (
        <div key={question.id}>
          <label>{question.text}</label>
          <input
            type="text"
            value={answers[question.id] || ""}
            onChange={(e) =>
              setAnswers((prev) => ({
                ...prev,
                [question.id]: e.target.value,
              }))
            }
            required={question.required}
          />
        </div>
      ))}

      <button onClick={() => submitAnswers(answers)}>Submit</button>

      {/* Progress indicator only in interactive mode */}
      <div className="progress">
        {Object.keys(answers).length} / {questions.length} completed
      </div>
    </div>
  );
}
```

## Advanced Hydration Patterns

### Partial Hydration

```typescript
// Hydrate only specific parts of a component
"use client";

import { useState, useEffect, useRef } from "react";

interface PartiallyHydratedComponentProps {
  staticContent: string;
  interactiveElements: string[];
}

export default function PartiallyHydratedComponent({
  staticContent,
  interactiveElements,
}: PartiallyHydratedComponentProps) {
  const [hydratedElements, setHydratedElements] = useState<Set<string>>(
    new Set()
  );
  const intersectionRefs = useRef<Record<string, HTMLDivElement>>({});

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    interactiveElements.forEach((elementId) => {
      const element = intersectionRefs.current[elementId];
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setHydratedElements((prev) => new Set([...prev, elementId]));
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [interactiveElements]);

  return (
    <div>
      {/* Static content doesn't need hydration */}
      <div dangerouslySetInnerHTML={{ __html: staticContent }} />

      {/* Interactive elements hydrate on demand */}
      {interactiveElements.map((elementId) => (
        <div
          key={elementId}
          ref={(el) => {
            if (el) intersectionRefs.current[elementId] = el;
          }}
        >
          {hydratedElements.has(elementId) ? (
            <InteractiveElement id={elementId} />
          ) : (
            <StaticPlaceholder id={elementId} />
          )}
        </div>
      ))}
    </div>
  );
}
```

### Streaming Hydration

```typescript
// Hydrate components as they stream in
import { Suspense } from "react";

export default function StreamingPage() {
  return (
    <div>
      <h1>Streaming Hydration Demo</h1>

      {/* First component hydrates immediately */}
      <Suspense fallback={<div>Loading header...</div>}>
        <Header />
      </Suspense>

      {/* Second component hydrates when ready */}
      <Suspense fallback={<div>Loading content...</div>}>
        <MainContent />
      </Suspense>

      {/* Third component hydrates last */}
      <Suspense fallback={<div>Loading sidebar...</div>}>
        <Sidebar />
      </Suspense>
    </div>
  );
}

// Each component can have its own hydration strategy
async function Header() {
  // Fast data fetch
  const navigation = await getNavigation();

  return (
    <header>
      <Navigation items={navigation} />
      <UserMenu /> {/* Hydrates immediately */}
    </header>
  );
}

async function MainContent() {
  // Slower data fetch
  const content = await getContent();

  return (
    <main>
      <Article content={content} />
      <Comments articleId={content.id} /> {/* Hydrates after main content */}
    </main>
  );
}
```

## Best Practices

### Hydration Guidelines

- Minimize hydration mismatches
- Use progressive enhancement
- Implement graceful degradation
- Monitor hydration performance

### Performance Optimization

- Split code at component boundaries
- Use lazy loading for non-critical components
- Implement intersection-based hydration
- Optimize bundle sizes

### Error Handling

- Use error boundaries for hydration errors
- Provide meaningful fallbacks
- Log hydration issues for debugging
- Implement retry mechanisms

### Development Tips

- Use React DevTools for hydration debugging
- Test with JavaScript disabled
- Monitor Core Web Vitals
- Use proper TypeScript types

### Production Considerations

- Monitor hydration performance
- Set up error reporting
- Use CDN for faster script loading
- Implement proper caching strategies

This comprehensive guide covers hydration in React SSR applications, providing the knowledge needed to build fast, resilient applications with excellent user experience.
