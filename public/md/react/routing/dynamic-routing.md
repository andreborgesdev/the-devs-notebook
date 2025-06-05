# Dynamic Routing in React

Dynamic routing allows React applications to handle routes with variable parameters, enabling flexible URL structures and data-driven navigation. React Router provides powerful tools for creating dynamic routes that can adapt to different content and user interactions.

## Basic Dynamic Routes

### Route Parameters

```tsx
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/users/:userId" element={<UserProfile />} />
        <Route path="/posts/:postId" element={<PostDetail />} />
        <Route
          path="/categories/:category/:subcategory"
          element={<CategoryPage />}
        />
        <Route
          path="/products/:id/reviews/:reviewId"
          element={<ReviewDetail />}
        />
      </Routes>
    </BrowserRouter>
  );
};

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();

  return (
    <div>
      <h1>User Profile</h1>
      <p>User ID: {userId}</p>
    </div>
  );
};

const PostDetail: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();

  return (
    <div>
      <h1>Post Details</h1>
      <p>Post ID: {postId}</p>
    </div>
  );
};
```

### Multiple Parameters

```tsx
interface CategoryParams {
  category: string;
  subcategory: string;
}

const CategoryPage: React.FC = () => {
  const { category, subcategory } = useParams<CategoryParams>();

  return (
    <div>
      <h1>Category: {category}</h1>
      <h2>Subcategory: {subcategory}</h2>
    </div>
  );
};

interface ReviewParams {
  id: string;
  reviewId: string;
}

const ReviewDetail: React.FC = () => {
  const { id, reviewId } = useParams<ReviewParams>();

  return (
    <div>
      <h1>
        Product {id} - Review {reviewId}
      </h1>
    </div>
  );
};
```

## Advanced Parameter Handling

### Optional Parameters

```tsx
import { Routes, Route, useParams } from "react-router-dom";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/products/:category?/:id?" element={<ProductPage />} />
      <Route path="/blog/:year?/:month?/:slug?" element={<BlogPost />} />
    </Routes>
  );
};

interface ProductParams {
  category?: string;
  id?: string;
}

const ProductPage: React.FC = () => {
  const { category, id } = useParams<ProductParams>();

  if (!category) {
    return <ProductCatalog />;
  }

  if (!id) {
    return <CategoryProducts category={category} />;
  }

  return <ProductDetail category={category} id={id} />;
};

interface BlogParams {
  year?: string;
  month?: string;
  slug?: string;
}

const BlogPost: React.FC = () => {
  const { year, month, slug } = useParams<BlogParams>();

  if (!year) return <BlogArchive />;
  if (!month) return <YearlyArchive year={year} />;
  if (!slug) return <MonthlyArchive year={year} month={month} />;

  return <PostContent year={year} month={month} slug={slug} />;
};
```

### Parameter Validation and Type Conversion

```tsx
import { useParams, Navigate } from "react-router-dom";

interface UserParams {
  userId: string;
}

const UserProfile: React.FC = () => {
  const { userId } = useParams<UserParams>();

  const numericUserId = userId ? parseInt(userId, 10) : NaN;

  if (!userId || isNaN(numericUserId) || numericUserId <= 0) {
    return <Navigate to="/users" replace />;
  }

  return <UserProfileContent userId={numericUserId} />;
};

const useValidatedParams = <T extends Record<string, string>>(
  validators: Record<keyof T, (value: string) => boolean>
) => {
  const params = useParams<T>();
  const [isValid, setIsValid] = useState(true);
  const [validatedParams, setValidatedParams] = useState<T | null>(null);

  useEffect(() => {
    const entries = Object.entries(params) as [keyof T, string][];
    const valid = entries.every(([key, value]) => {
      const validator = validators[key];
      return validator ? validator(value) : true;
    });

    setIsValid(valid);
    setValidatedParams(valid ? params : null);
  }, [params, validators]);

  return { params: validatedParams, isValid };
};

const ProductDetail: React.FC = () => {
  const { params, isValid } = useValidatedParams({
    productId: (value) => /^\d+$/.test(value),
    category: (value) => value.length > 0,
  });

  if (!isValid) {
    return <Navigate to="/products" replace />;
  }

  return (
    <div>
      <h1>
        Product {params?.productId} in {params?.category}
      </h1>
    </div>
  );
};
```

## Wildcard and Catch-All Routes

### Splat Routes

```tsx
import { Routes, Route, useParams } from "react-router-dom";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/files/*" element={<FileExplorer />} />
      <Route path="/docs/*" element={<Documentation />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const FileExplorer: React.FC = () => {
  const { "*": splat } = useParams();
  const pathSegments = splat ? splat.split("/").filter(Boolean) : [];

  return (
    <div>
      <h1>File Explorer</h1>
      <nav>
        {pathSegments.map((segment, index) => (
          <span key={index}>
            /{" "}
            <Link to={`/files/${pathSegments.slice(0, index + 1).join("/")}`}>
              {segment}
            </Link>
          </span>
        ))}
      </nav>
      <FileSystemView path={splat} />
    </div>
  );
};
```

### Dynamic Route Generation

```tsx
interface RouteConfig {
  path: string;
  component: React.ComponentType<any>;
  exact?: boolean;
}

const useDynamicRoutes = (configs: RouteConfig[]) => {
  return (
    <Routes>
      {configs.map(({ path, component: Component, exact = false }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}
    </Routes>
  );
};

const DynamicApp: React.FC = () => {
  const [routeConfigs, setRouteConfigs] = useState<RouteConfig[]>([]);

  useEffect(() => {
    fetchRouteConfigs().then(setRouteConfigs);
  }, []);

  const routes = useDynamicRoutes(routeConfigs);

  return <BrowserRouter>{routes}</BrowserRouter>;
};
```

## Data Loading with Dynamic Routes

### Route-based Data Fetching

```tsx
import { useParams, useLoaderData } from "react-router-dom";

interface User {
  id: number;
  name: string;
  email: string;
}

const userLoader = async ({ params }: { params: any }): Promise<User> => {
  const response = await fetch(`/api/users/${params.userId}`);
  if (!response.ok) {
    throw new Response("User not found", { status: 404 });
  }
  return response.json();
};

const UserProfile: React.FC = () => {
  const user = useLoaderData() as User;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/users/:userId",
    element: <UserProfile />,
    loader: userLoader,
    errorElement: <ErrorBoundary />,
  },
]);
```

### Custom Data Loading Hook

```tsx
const useRouteData = <T>(
  fetcher: (params: Record<string, string>) => Promise<T>,
  dependencies: string[] = []
) => {
  const params = useParams();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetcher(params);

        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [params, ...dependencies]);

  return { data, loading, error };
};

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();

  const { data: product, loading, error } = useRouteData(
    async (params) => {
      const response = await fetch(`/api/products/${params.productId}`);
      return response.json();
    }
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!product) return <NotFound />;

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </div>
  );
};
```

## Nested Dynamic Routes

### Complex Route Structures

```tsx
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/organizations/:orgId" element={<OrganizationLayout />}>
          <Route index element={<OrganizationDashboard />} />
          <Route path="projects/:projectId" element={<ProjectLayout />}>
            <Route index element={<ProjectOverview />} />
            <Route path="tasks/:taskId" element={<TaskDetail />} />
            <Route path="files/*" element={<ProjectFiles />} />
          </Route>
          <Route path="members" element={<MembersList />} />
          <Route path="settings" element={<OrganizationSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

const OrganizationLayout: React.FC = () => {
  const { orgId } = useParams<{ orgId: string }>();
  const { data: organization, loading } = useRouteData(async (params) =>
    fetchOrganization(params.orgId!)
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="organization-layout">
      <header>
        <h1>{organization?.name}</h1>
        <nav>
          <Link to={`/organizations/${orgId}`}>Dashboard</Link>
          <Link to={`/organizations/${orgId}/members`}>Members</Link>
          <Link to={`/organizations/${orgId}/settings`}>Settings</Link>
        </nav>
      </header>
      <main>
        <Outlet context={{ organization }} />
      </main>
    </div>
  );
};

const ProjectLayout: React.FC = () => {
  const { orgId, projectId } = useParams<{
    orgId: string;
    projectId: string;
  }>();
  const { organization } = useOutletContext<{ organization: Organization }>();

  const { data: project } = useRouteData(async (params) =>
    fetchProject(params.orgId!, params.projectId!)
  );

  return (
    <div className="project-layout">
      <aside>
        <h2>{project?.name}</h2>
        <nav>
          <Link to={`/organizations/${orgId}/projects/${projectId}`}>
            Overview
          </Link>
          <Link to={`/organizations/${orgId}/projects/${projectId}/files`}>
            Files
          </Link>
        </nav>
      </aside>
      <main>
        <Outlet context={{ organization, project }} />
      </main>
    </div>
  );
};
```

### Context Sharing in Nested Routes

```tsx
interface RouteContext {
  organization: Organization;
  project?: Project;
  user: User;
}

const useRouteContext = (): RouteContext => {
  return useOutletContext<RouteContext>();
};

const TaskDetail: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { organization, project, user } = useRouteContext();

  const { data: task } = useRouteData(
    async (params) => fetchTask(params.taskId!),
    [taskId]
  );

  const canEditTask = useMemo(() => {
    return (
      user.role === "admin" ||
      user.id === task?.assignedTo ||
      project?.members.includes(user.id)
    );
  }, [user, task, project]);

  return (
    <div>
      <h1>{task?.title}</h1>
      <p>Project: {project?.name}</p>
      <p>Organization: {organization.name}</p>
      {canEditTask && <EditTaskButton task={task} />}
    </div>
  );
};
```

## Route-based Code Splitting

### Lazy Loading Dynamic Routes

```tsx
import { lazy, Suspense } from "react";

const LazyUserProfile = lazy(() => import("./components/UserProfile"));
const LazyProductDetail = lazy(() => import("./components/ProductDetail"));
const LazyPostDetail = lazy(() => import("./components/PostDetail"));

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/users/:userId" element={<LazyUserProfile />} />
          <Route path="/products/:productId" element={<LazyProductDetail />} />
          <Route path="/posts/:postId" element={<LazyPostDetail />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};
```

### Dynamic Import with Parameters

```tsx
const useDynamicComponent = (componentName: string) => {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadComponent = async () => {
      try {
        setLoading(true);
        const module = await import(`./components/${componentName}`);
        setComponent(() => module.default);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadComponent();
  }, [componentName]);

  return { Component, loading, error };
};

const DynamicRoute: React.FC = () => {
  const { componentName } = useParams<{ componentName: string }>();
  const { Component, loading, error } = useDynamicComponent(componentName!);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!Component) return <NotFound />;

  return <Component />;
};
```

## SEO and Meta Tags for Dynamic Routes

### Dynamic Meta Tags

```tsx
import { Helmet } from "react-helmet-async";

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { data: product } = useRouteData(async (params) =>
    fetchProduct(params.productId!)
  );

  if (!product) return <NotFound />;

  return (
    <>
      <Helmet>
        <title>{product.name} - Our Store</title>
        <meta name="description" content={product.shortDescription} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.shortDescription} />
        <meta property="og:image" content={product.imageUrl} />
        <meta
          property="og:url"
          content={`https://ourstore.com/products/${productId}`}
        />
        <link
          rel="canonical"
          href={`https://ourstore.com/products/${productId}`}
        />
      </Helmet>

      <div>
        <h1>{product.name}</h1>
        <img src={product.imageUrl} alt={product.name} />
        <p>{product.description}</p>
      </div>
    </>
  );
};
```

### Structured Data

```tsx
const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post } = useRouteData(async (params) =>
    fetchBlogPost(params.slug!)
  );

  if (!post) return <NotFound />;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    author: {
      "@type": "Person",
      name: post.author.name,
    },
    datePublished: post.publishedDate,
    dateModified: post.modifiedDate,
    image: post.featuredImage,
  };

  return (
    <>
      <Helmet>
        <title>{post.title} - Our Blog</title>
        <meta name="description" content={post.excerpt} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <article>
        <h1>{post.title}</h1>
        <time dateTime={post.publishedDate}>
          {new Date(post.publishedDate).toLocaleDateString()}
        </time>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </>
  );
};
```

## Testing Dynamic Routes

### Testing Route Parameters

```tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { UserProfile } from "./UserProfile";

describe("UserProfile", () => {
  const renderWithRouter = (initialEntries: string[]) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/users/:userId" element={<UserProfile />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it("should display user ID from route params", () => {
    renderWithRouter(["/users/123"]);

    expect(screen.getByText("User ID: 123")).toBeInTheDocument();
  });

  it("should handle invalid user ID", () => {
    renderWithRouter(["/users/invalid"]);

    expect(screen.getByText(/user not found/i)).toBeInTheDocument();
  });

  it("should redirect when user ID is missing", () => {
    renderWithRouter(["/users/"]);

    expect(screen.getByText(/not found/i)).toBeInTheDocument();
  });
});
```

### Testing Data Loading

```tsx
import { rest } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
  rest.get("/api/users/:userId", (req, res, ctx) => {
    const { userId } = req.params;

    if (userId === "123") {
      return res(
        ctx.json({
          id: 123,
          name: "John Doe",
          email: "john@example.com",
        })
      );
    }

    return res(ctx.status(404));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("UserProfile with data loading", () => {
  it("should load and display user data", async () => {
    renderWithRouter(["/users/123"]);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });

  it("should handle loading errors", async () => {
    renderWithRouter(["/users/404"]);

    await waitFor(() => {
      expect(screen.getByText(/user not found/i)).toBeInTheDocument();
    });
  });
});
```

## Performance Optimization

### Route-based Preloading

```tsx
const useRoutePreloader = () => {
  const preloadRoute = useCallback((path: string) => {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = path;
    document.head.appendChild(link);
  }, []);

  const preloadData = useCallback(async (fetcher: () => Promise<any>) => {
    try {
      const data = await fetcher();
      // Cache the data for later use
      return data;
    } catch (error) {
      console.warn("Failed to preload data:", error);
    }
  }, []);

  return { preloadRoute, preloadData };
};

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { preloadRoute, preloadData } = useRoutePreloader();

  const handleMouseEnter = () => {
    preloadRoute(`/products/${product.id}`);
    preloadData(() => fetchProduct(product.id));
  };

  return (
    <Link
      to={`/products/${product.id}`}
      onMouseEnter={handleMouseEnter}
      className="product-card"
    >
      <img src={product.thumbnail} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
    </Link>
  );
};
```

### Memoization with Route Parameters

```tsx
const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();

  const product = useMemo(async () => {
    return fetchProduct(productId!);
  }, [productId]);

  const relatedProducts = useMemo(async () => {
    if (!product) return [];
    return fetchRelatedProducts(product.category, product.id);
  }, [product]);

  const memoizedComponent = useMemo(
    () => (
      <ProductDetailView product={product} relatedProducts={relatedProducts} />
    ),
    [product, relatedProducts]
  );

  return memoizedComponent;
};
```

## Best Practices

### Route Organization

1. **Consistent naming**: Use clear, predictable parameter names
2. **Logical hierarchy**: Structure routes to reflect data relationships
3. **SEO-friendly URLs**: Use descriptive slugs and avoid deep nesting
4. **Validation**: Always validate route parameters
5. **Error handling**: Provide graceful fallbacks for invalid routes

### Performance Considerations

1. **Code splitting**: Lazy load route components
2. **Data prefetching**: Preload data for likely navigation paths
3. **Caching**: Cache frequently accessed route data
4. **Memoization**: Memoize expensive computations based on route params
5. **Bundle optimization**: Split bundles by route boundaries

### Security and Validation

```tsx
const useSecureRouteParams = <T extends Record<string, string>>(
  sanitizers: Record<keyof T, (value: string) => string>
) => {
  const params = useParams<T>();

  const sanitizedParams = useMemo(() => {
    const result = {} as T;

    Object.entries(params).forEach(([key, value]) => {
      const sanitizer = sanitizers[key as keyof T];
      result[key as keyof T] = sanitizer ? sanitizer(value) : value;
    });

    return result;
  }, [params, sanitizers]);

  return sanitizedParams;
};

const UserProfile: React.FC = () => {
  const { userId } = useSecureRouteParams({
    userId: (value) => value.replace(/[^0-9]/g, ""),
  });

  if (!userId || userId.length === 0) {
    return <Navigate to="/users" replace />;
  }

  return <UserProfileContent userId={userId} />;
};
```

## Interview Questions

### Basic Questions

**Q: What are dynamic routes in React Router?**

A: Dynamic routes are routes that contain variable segments (parameters) that can change based on the URL. They use colon syntax (`:paramName`) to define variable parts of the URL path. For example, `/users/:userId` can match `/users/123`, `/users/456`, etc.

**Q: How do you access route parameters in a React component?**

A: Route parameters are accessed using the `useParams` hook from React Router:

```tsx
import { useParams } from "react-router-dom";

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  return <div>User ID: {userId}</div>;
};
```

**Q: What's the difference between route parameters and query parameters?**

A: Route parameters are part of the URL path structure (`:userId` in `/users/:userId`) and are accessed via `useParams`. Query parameters are key-value pairs after the `?` in the URL (`?page=1&sort=name`) and are accessed via `useSearchParams`.

### Intermediate Questions

**Q: How do you handle optional route parameters?**

A: Optional parameters are defined with a `?` after the parameter name. You can handle them by checking if the parameter exists:

```tsx
// Route: /products/:category?/:id?
const ProductPage = () => {
  const { category, id } = useParams<{ category?: string; id?: string }>();

  if (!category) return <AllProducts />;
  if (!id) return <CategoryProducts category={category} />;
  return <ProductDetail category={category} id={id} />;
};
```

**Q: How do you validate route parameters?**

A: Route parameters should be validated to ensure they meet expected formats and constraints:

```tsx
const useValidatedParams = (validators) => {
  const params = useParams();
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    const valid = Object.entries(params).every(([key, value]) => {
      const validator = validators[key];
      return validator ? validator(value) : true;
    });
    setIsValid(valid);
  }, [params, validators]);

  return { params: isValid ? params : null, isValid };
};
```

**Q: How do you implement nested dynamic routes?**

A: Nested dynamic routes combine multiple parameters across route levels:

```tsx
<Routes>
  <Route path="/organizations/:orgId" element={<OrgLayout />}>
    <Route path="projects/:projectId" element={<ProjectLayout />}>
      <Route path="tasks/:taskId" element={<TaskDetail />} />
    </Route>
  </Route>
</Routes>;

// TaskDetail can access orgId, projectId, and taskId
const TaskDetail = () => {
  const { orgId, projectId, taskId } = useParams();
  // Access all three parameters
};
```

### Advanced Questions

**Q: How do you implement route-based data loading with dynamic parameters?**

A: Route-based data loading can be implemented using loaders or custom hooks:

```tsx
// Using React Router loaders
const userLoader = async ({ params }) => {
  const response = await fetch(`/api/users/${params.userId}`);
  return response.json();
};

// Using custom hook
const useRouteData = (fetcher, dependencies = []) => {
  const params = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetcher(params)
      .then(setData)
      .finally(() => setLoading(false));
  }, [params, ...dependencies]);

  return { data, loading };
};
```

**Q: How do you optimize performance for dynamic routes?**

A: Performance optimization strategies include:

1. **Code splitting**: Lazy load route components
2. **Data prefetching**: Preload data on hover/focus
3. **Caching**: Cache route data and components
4. **Memoization**: Memoize computations based on parameters
5. **Bundle splitting**: Split bundles by route boundaries

```tsx
const ProductDetail = lazy(() => import("./ProductDetail"));

const useRoutePreloader = () => {
  const preloadData = useCallback(async (fetcher) => {
    try {
      return await fetcher();
    } catch (error) {
      console.warn("Preload failed:", error);
    }
  }, []);

  return { preloadData };
};
```

**Q: How do you handle SEO for dynamic routes?**

A: SEO for dynamic routes involves:

1. **Dynamic meta tags**: Update title, description based on content
2. **Structured data**: Add JSON-LD for rich snippets
3. **Canonical URLs**: Set canonical links for duplicate content
4. **Server-side rendering**: Ensure content is available for crawlers

```tsx
const ProductDetail = () => {
  const { productId } = useParams();
  const { data: product } = useRouteData(fetchProduct);

  return (
    <>
      <Helmet>
        <title>{product?.name} - Store</title>
        <meta name="description" content={product?.description} />
        <link rel="canonical" href={`/products/${productId}`} />
      </Helmet>
      <ProductContent product={product} />
    </>
  );
};
```

**Q: How do you test components with dynamic routes?**

A: Testing dynamic routes requires setting up router context and mocking route parameters:

```tsx
const renderWithRouter = (route, initialEntries = [route]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/users/:userId" element={<UserProfile />} />
      </Routes>
    </MemoryRouter>
  );
};

describe("UserProfile", () => {
  it("should display user data for valid ID", async () => {
    renderWithRouter("/users/123");

    await waitFor(() => {
      expect(screen.getByText("User: John Doe")).toBeInTheDocument();
    });
  });

  it("should handle invalid user ID", () => {
    renderWithRouter("/users/invalid");

    expect(screen.getByText(/user not found/i)).toBeInTheDocument();
  });
});
```
