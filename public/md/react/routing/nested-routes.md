# Nested Routes in React Router

Nested routes allow you to create complex layouts with multiple levels of routing, perfect for applications with hierarchical navigation structures.

## Basic Nested Routes

### Route Configuration

```tsx
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/settings">Settings</Link>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

const DashboardLayout = () => {
  return (
    <div className="dashboard">
      <aside>
        <Link to="/dashboard">Overview</Link>
        <Link to="/dashboard/analytics">Analytics</Link>
        <Link to="/dashboard/reports">Reports</Link>
        <Link to="/dashboard/users">Users</Link>
      </aside>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          <Route path="dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="reports" element={<Reports />} />
            <Route path="users" element={<Users />} />
          </Route>

          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
```

### Components

```tsx
const Home = () => <h1>Welcome Home</h1>;

const DashboardOverview = () => (
  <div>
    <h2>Dashboard Overview</h2>
    <div className="stats">
      <div className="stat-card">
        <h3>Users</h3>
        <p>1,234</p>
      </div>
      <div className="stat-card">
        <h3>Revenue</h3>
        <p>$12,345</p>
      </div>
    </div>
  </div>
);

const Analytics = () => (
  <div>
    <h2>Analytics</h2>
    <div className="charts">
      <div className="chart">User Growth Chart</div>
      <div className="chart">Revenue Chart</div>
    </div>
  </div>
);

const Reports = () => (
  <div>
    <h2>Reports</h2>
    <div className="report-list">
      <div className="report-item">Monthly Report</div>
      <div className="report-item">Quarterly Report</div>
      <div className="report-item">Annual Report</div>
    </div>
  </div>
);
```

## Advanced Nested Routing

### Multi-level Nesting

```tsx
const SettingsLayout = () => {
  return (
    <div className="settings-layout">
      <nav className="settings-nav">
        <Link to="/settings">General</Link>
        <Link to="/settings/profile">Profile</Link>
        <Link to="/settings/security">Security</Link>
        <Link to="/settings/notifications">Notifications</Link>
      </nav>
      <div className="settings-content">
        <Outlet />
      </div>
    </div>
  );
};

const ProfileSettings = () => {
  return (
    <div>
      <h3>Profile Settings</h3>
      <nav className="profile-nav">
        <Link to="/settings/profile">Basic Info</Link>
        <Link to="/settings/profile/avatar">Avatar</Link>
        <Link to="/settings/profile/preferences">Preferences</Link>
      </nav>
      <Outlet />
    </div>
  );
};

const AdvancedNestedApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          <Route path="settings" element={<SettingsLayout />}>
            <Route index element={<GeneralSettings />} />

            <Route path="profile" element={<ProfileSettings />}>
              <Route index element={<BasicInfo />} />
              <Route path="avatar" element={<AvatarSettings />} />
              <Route path="preferences" element={<PreferencesSettings />} />
            </Route>

            <Route path="security" element={<SecuritySettings />} />
            <Route path="notifications" element={<NotificationSettings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
```

## Dynamic Nested Routes

### Route Parameters in Nested Routes

```tsx
const UserLayout = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserById(userId);
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  if (loading) return <div>Loading user...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="user-layout">
      <header className="user-header">
        <img src={user.avatar} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </header>

      <nav className="user-nav">
        <Link to={`/users/${userId}`}>Profile</Link>
        <Link to={`/users/${userId}/posts`}>Posts</Link>
        <Link to={`/users/${userId}/followers`}>Followers</Link>
        <Link to={`/users/${userId}/following`}>Following</Link>
      </nav>

      <main className="user-content">
        <Outlet context={{ user }} />
      </main>
    </div>
  );
};

const UserPosts = () => {
  const { user } = useOutletContext<{ user: User }>();
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const userPosts = await getUserPosts(userId);
      setPosts(userPosts);
    };
    fetchPosts();
  }, [userId]);

  return (
    <div className="user-posts">
      <h3>{user.name}'s Posts</h3>
      <div className="posts-grid">
        {posts.map((post) => (
          <Link
            key={post.id}
            to={`/users/${userId}/posts/${post.id}`}
            className="post-card"
          >
            <h4>{post.title}</h4>
            <p>{post.excerpt}</p>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

const PostDetail = () => {
  const { userId, postId } = useParams();
  const { user } = useOutletContext<{ user: User }>();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const postData = await getPost(postId);
      setPost(postData);
    };
    fetchPost();
  }, [postId]);

  if (!post) return <div>Loading post...</div>;

  return (
    <article className="post-detail">
      <header>
        <h1>{post.title}</h1>
        <div className="post-meta">
          <span>By {user.name}</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
      </header>
      <div className="post-content">{post.content}</div>
    </article>
  );
};

const DynamicNestedApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="users/:userId" element={<UserLayout />}>
            <Route index element={<UserProfile />} />
            <Route path="posts" element={<UserPosts />} />
            <Route path="posts/:postId" element={<PostDetail />} />
            <Route path="followers" element={<UserFollowers />} />
            <Route path="following" element={<UserFollowing />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
```

## Conditional Nested Routes

### Route Guards and Permissions

```tsx
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  fallback = <Navigate to="/login" replace />,
}) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return fallback;
  }

  if (requiredPermission && !user?.permissions?.includes(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <nav className="admin-nav">
        <Link to="/admin">Dashboard</Link>
        <Link to="/admin/users">Users</Link>
        <Link to="/admin/content">Content</Link>
        <Link to="/admin/settings">Settings</Link>
      </nav>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

const ConditionalNestedApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          <Route
            path="admin/*"
            element={
              <ProtectedRoute requiredPermission="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route
            path="profile/*"
            element={
              <ProtectedRoute>
                <ProfileLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<UserProfile />} />
            <Route path="edit" element={<EditProfile />} />
            <Route path="security" element={<SecuritySettings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
```

## Route Data Loading

### Loader Pattern with Nested Routes

```tsx
import { useLoaderData, useParams } from "react-router-dom";

const dashboardLoader = async () => {
  const [users, analytics, reports] = await Promise.all([
    fetchUsers(),
    fetchAnalytics(),
    fetchReports(),
  ]);

  return { users, analytics, reports };
};

const userLoader = async ({ params }: { params: { userId: string } }) => {
  const user = await fetchUser(params.userId);
  if (!user) {
    throw new Response("User not found", { status: 404 });
  }
  return user;
};

const postsLoader = async ({ params }: { params: { userId: string } }) => {
  return await fetchUserPosts(params.userId);
};

const LoaderBasedApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            path="dashboard"
            element={<DashboardWithLoader />}
            loader={dashboardLoader}
          >
            <Route index element={<DashboardOverview />} />
            <Route path="analytics" element={<AnalyticsWithData />} />
            <Route path="reports" element={<ReportsWithData />} />
          </Route>

          <Route
            path="users/:userId"
            element={<UserLayoutWithLoader />}
            loader={userLoader}
          >
            <Route index element={<UserProfile />} />
            <Route
              path="posts"
              element={<UserPostsWithLoader />}
              loader={postsLoader}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

const DashboardWithLoader = () => {
  const { users, analytics, reports } = useLoaderData() as {
    users: User[];
    analytics: Analytics;
    reports: Report[];
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <nav>
        <Link to="/dashboard">Overview</Link>
        <Link to="/dashboard/analytics">Analytics</Link>
        <Link to="/dashboard/reports">Reports</Link>
      </nav>
      <Outlet context={{ users, analytics, reports }} />
    </div>
  );
};

const UserLayoutWithLoader = () => {
  const user = useLoaderData() as User;

  return (
    <div className="user-layout">
      <header>
        <h1>{user.name}</h1>
        <p>{user.email}</p>
      </header>
      <nav>
        <Link to={`/users/${user.id}`}>Profile</Link>
        <Link to={`/users/${user.id}/posts`}>Posts</Link>
      </nav>
      <Outlet context={{ user }} />
    </div>
  );
};
```

## Breadcrumb Navigation

### Dynamic Breadcrumbs

```tsx
interface BreadcrumbItem {
  label: string;
  path: string;
  isActive?: boolean;
}

const useBreadcrumbs = () => {
  const location = useLocation();
  const params = useParams();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [{ label: "Home", path: "/" }];

    let currentPath = "";

    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;

      let label = segment.charAt(0).toUpperCase() + segment.slice(1);

      if (params.userId && segment === params.userId) {
        label = `User ${params.userId}`;
      }
      if (params.postId && segment === params.postId) {
        label = `Post ${params.postId}`;
      }

      breadcrumbs.push({
        label,
        path: currentPath,
        isActive: isLast,
      });
    });

    return breadcrumbs;
  };

  return generateBreadcrumbs();
};

const Breadcrumbs = () => {
  const breadcrumbs = useBreadcrumbs();

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.path} className={crumb.isActive ? "active" : ""}>
            {crumb.isActive ? (
              <span>{crumb.label}</span>
            ) : (
              <Link to={crumb.path}>{crumb.label}</Link>
            )}
            {index < breadcrumbs.length - 1 && (
              <span className="separator">›</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

const LayoutWithBreadcrumbs = () => {
  return (
    <div>
      <header>
        <nav>Main Navigation</nav>
      </header>
      <Breadcrumbs />
      <main>
        <Outlet />
      </main>
    </div>
  );
};
```

## Error Boundaries for Routes

### Route-specific Error Handling

```tsx
import { ErrorBoundary } from "react-error-boundary";

const RouteErrorFallback = ({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) => {
  return (
    <div className="error-fallback">
      <h2>Something went wrong in this section</h2>
      <p>{error.message}</p>
      <button onClick={resetErrorBoundary}>Try again</button>
      <Link to="/">Go to Home</Link>
    </div>
  );
};

const ErrorBoundaryRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          <Route
            path="dashboard/*"
            element={
              <ErrorBoundary
                FallbackComponent={RouteErrorFallback}
                onReset={() => window.location.reload()}
              >
                <DashboardLayout />
              </ErrorBoundary>
            }
          >
            <Route index element={<DashboardOverview />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
```

## Performance Optimization

### Lazy Loading Nested Routes

```tsx
import { lazy, Suspense } from "react";

const DashboardLayout = lazy(() => import("./layouts/DashboardLayout"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Reports = lazy(() => import("./pages/Reports"));
const UserProfile = lazy(() => import("./pages/UserProfile"));

const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>Loading...</p>
  </div>
);

const OptimizedNestedApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          <Route
            path="dashboard/*"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <DashboardLayout />
              </Suspense>
            }
          >
            <Route index element={<div>Dashboard Overview</div>} />
            <Route
              path="analytics"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <Analytics />
                </Suspense>
              }
            />
            <Route
              path="reports"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <Reports />
                </Suspense>
              }
            />
          </Route>

          <Route
            path="users/:userId"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <UserProfile />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
```

## Best Practices

1. **Use Outlet**: Always use `<Outlet />` in parent route components
2. **Share Context**: Use `useOutletContext` to pass data between nested routes
3. **Loading States**: Implement loading states for async route data
4. **Error Boundaries**: Wrap route sections in error boundaries
5. **Lazy Loading**: Code-split nested routes for better performance
6. **Breadcrumbs**: Implement breadcrumb navigation for deep nesting
7. **Route Guards**: Protect nested routes with authentication/authorization
8. **URL Structure**: Keep URLs logical and RESTful

## Common Patterns

| Pattern            | Use Case             | Implementation                            |
| ------------------ | -------------------- | ----------------------------------------- |
| Layout Routes      | Shared layouts       | Parent route with `<Outlet />`            |
| Index Routes       | Default child route  | `<Route index element={<Component />} />` |
| Dynamic Segments   | User profiles, posts | `:userId`, `:postId` parameters           |
| Catch-all Routes   | 404 pages            | `path="*"`                                |
| Conditional Routes | Authentication       | Conditional rendering or guards           |

Nested routes in React Router provide a powerful way to structure complex applications with hierarchical navigation while maintaining clean, maintainable code.
