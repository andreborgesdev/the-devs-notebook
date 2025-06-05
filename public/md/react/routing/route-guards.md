# Route Guards in React Router

Route guards protect specific routes by implementing authentication, authorization, and other access control mechanisms.

## Authentication Guards

### Basic Authentication Guard

```tsx
import { Navigate, useLocation } from "react-router-dom";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  fallback,
  redirectTo = "/login",
}) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return fallback || <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const useAuth = () => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          const user = await verifyToken(token);
          setAuthState({
            isAuthenticated: true,
            user,
            loading: false,
          });
        } else {
          setAuthState({
            isAuthenticated: false,
            user: null,
            loading: false,
          });
        }
      } catch (error) {
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
        });
      }
    };

    checkAuth();
  }, []);

  return authState;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          }
        />

        <Route
          path="/profile"
          element={
            <AuthGuard>
              <Profile />
            </AuthGuard>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
```

### Role-Based Access Control

```tsx
interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
}

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  requiredPermissions?: string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  requiredRoles = [],
  requiredPermissions = [],
  requireAll = false,
  fallback = <Navigate to="/unauthorized" replace />,
}) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const hasRequiredRoles = () => {
    if (requiredRoles.length === 0) return true;

    if (requireAll) {
      return requiredRoles.every((role) => user.roles.includes(role));
    } else {
      return requiredRoles.some((role) => user.roles.includes(role));
    }
  };

  const hasRequiredPermissions = () => {
    if (requiredPermissions.length === 0) return true;

    if (requireAll) {
      return requiredPermissions.every((permission) =>
        user.permissions.includes(permission)
      );
    } else {
      return requiredPermissions.some((permission) =>
        user.permissions.includes(permission)
      );
    }
  };

  if (!hasRequiredRoles() || !hasRequiredPermissions()) {
    return fallback;
  }

  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => (
  <RoleGuard requiredRoles={["admin"]}>{children}</RoleGuard>
);

const ModeratorRoute = ({ children }: { children: React.ReactNode }) => (
  <RoleGuard requiredRoles={["admin", "moderator"]}>{children}</RoleGuard>
);

const PermissionRoute = ({
  children,
  permission,
}: {
  children: React.ReactNode;
  permission: string;
}) => <RoleGuard requiredPermissions={[permission]}>{children}</RoleGuard>;

const AppWithRoles = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="settings" element={<SystemSettings />} />
        </Route>

        <Route
          path="/moderation"
          element={
            <ModeratorRoute>
              <ModerationPanel />
            </ModeratorRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <PermissionRoute permission="view_reports">
              <Reports />
            </PermissionRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
```

## Advanced Guard Patterns

### Conditional Route Access

```tsx
interface ConditionalGuardProps {
  children: React.ReactNode;
  condition: (user: User | null) => boolean;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

const ConditionalGuard: React.FC<ConditionalGuardProps> = ({
  children,
  condition,
  fallback,
  redirectTo = "/unauthorized",
}) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!condition(user)) {
    return fallback || <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

const ProfileOwnerGuard = ({
  children,
  profileUserId,
}: {
  children: React.ReactNode;
  profileUserId: string;
}) => (
  <ConditionalGuard
    condition={(user) =>
      user?.id === profileUserId || user?.roles.includes("admin")
    }
    fallback={<div>You can only view your own profile</div>}
  >
    {children}
  </ConditionalGuard>
);

const PremiumFeatureGuard = ({ children }: { children: React.ReactNode }) => (
  <ConditionalGuard
    condition={(user) => user?.subscription === "premium"}
    fallback={
      <div>
        <h2>Premium Feature</h2>
        <p>This feature is only available to premium subscribers.</p>
        <Link to="/upgrade">Upgrade Now</Link>
      </div>
    }
  >
    {children}
  </ConditionalGuard>
);

const TrialGuard = ({ children }: { children: React.ReactNode }) => (
  <ConditionalGuard
    condition={(user) => {
      if (!user?.trialEndsAt) return true;
      return new Date() < new Date(user.trialEndsAt);
    }}
    fallback={
      <div>
        <h2>Trial Expired</h2>
        <p>Your trial has expired. Please subscribe to continue.</p>
        <Link to="/subscribe">Subscribe Now</Link>
      </div>
    }
  >
    {children}
  </ConditionalGuard>
);
```

### Multiple Guard Composition

```tsx
const GuardComposer = ({
  guards,
  children,
}: {
  guards: React.ComponentType<{ children: React.ReactNode }>[];
  children: React.ReactNode;
}) => {
  return guards.reduceRight(
    (acc, Guard) => <Guard>{acc}</Guard>,
    <>{children}</>
  );
};

const ProtectedAdminPremiumRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <GuardComposer guards={[AuthGuard, AdminRoute, PremiumFeatureGuard]}>
    {children}
  </GuardComposer>
);

const ComplexProtectedApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/admin/premium-analytics"
          element={
            <ProtectedAdminPremiumRoute>
              <PremiumAnalytics />
            </ProtectedAdminPremiumRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
```

## Async Route Guards

### Async Permission Checking

```tsx
const useAsyncAuth = () => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
  });

  const checkPermission = async (permission: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/auth/check-permission/${permission}`);
      const result = await response.json();
      return result.hasPermission;
    } catch (error) {
      console.error("Permission check failed:", error);
      return false;
    }
  };

  const refreshUserData = async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true }));
      const response = await fetch("/api/auth/me");
      const user = await response.json();
      setAuthState({
        isAuthenticated: true,
        user,
        loading: false,
        error: null,
      });
    } catch (error) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: "Failed to load user data",
      });
    }
  };

  return { ...authState, checkPermission, refreshUserData };
};

const AsyncPermissionGuard = ({
  children,
  permission,
  fallback,
}: {
  children: React.ReactNode;
  permission: string;
  fallback?: React.ReactNode;
}) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const { checkPermission, isAuthenticated } = useAsyncAuth();

  useEffect(() => {
    if (isAuthenticated) {
      checkPermission(permission).then(setHasPermission);
    }
  }, [permission, isAuthenticated, checkPermission]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (hasPermission === null) {
    return <div>Checking permissions...</div>;
  }

  if (!hasPermission) {
    return fallback || <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
```

### Resource-Based Guards

```tsx
const useResourceAccess = (resourceType: string, resourceId: string) => {
  const [access, setAccess] = useState({
    canRead: false,
    canWrite: false,
    canDelete: false,
    loading: true,
  });

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const response = await fetch(
          `/api/resources/${resourceType}/${resourceId}/access`
        );
        const accessData = await response.json();
        setAccess({ ...accessData, loading: false });
      } catch (error) {
        setAccess({
          canRead: false,
          canWrite: false,
          canDelete: false,
          loading: false,
        });
      }
    };

    checkAccess();
  }, [resourceType, resourceId]);

  return access;
};

const ResourceGuard = ({
  children,
  resourceType,
  resourceId,
  requiredAccess = "read",
}: {
  children: React.ReactNode;
  resourceType: string;
  resourceId: string;
  requiredAccess?: "read" | "write" | "delete";
}) => {
  const access = useResourceAccess(resourceType, resourceId);

  if (access.loading) {
    return <div>Checking resource access...</div>;
  }

  const hasAccess = () => {
    switch (requiredAccess) {
      case "read":
        return access.canRead;
      case "write":
        return access.canWrite;
      case "delete":
        return access.canDelete;
      default:
        return false;
    }
  };

  if (!hasAccess()) {
    return (
      <div>
        <h2>Access Denied</h2>
        <p>You don't have permission to {requiredAccess} this resource.</p>
      </div>
    );
  }

  return <>{children}</>;
};

const DocumentEditor = () => {
  const { documentId } = useParams();

  return (
    <ResourceGuard
      resourceType="document"
      resourceId={documentId!}
      requiredAccess="write"
    >
      <div>
        <h1>Document Editor</h1>
        <textarea placeholder="Edit document..." />
        <button>Save</button>
      </div>
    </ResourceGuard>
  );
};
```

## Guard State Management

### Guard Context Provider

```tsx
interface GuardState {
  user: User | null;
  permissions: string[];
  roles: string[];
  loading: boolean;
  error: string | null;
}

interface GuardContextType extends GuardState {
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  hasAllRoles: (roles: string[]) => boolean;
  refreshAuth: () => Promise<void>;
}

const GuardContext = createContext<GuardContextType | null>(null);

const GuardProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<GuardState>({
    user: null,
    permissions: [],
    roles: [],
    loading: true,
    error: null,
  });

  const hasPermission = (permission: string) =>
    state.permissions.includes(permission);

  const hasRole = (role: string) => state.roles.includes(role);

  const hasAnyRole = (roles: string[]) =>
    roles.some((role) => state.roles.includes(role));

  const hasAllRoles = (roles: string[]) =>
    roles.every((role) => state.roles.includes(role));

  const refreshAuth = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      const response = await fetch("/api/auth/me");
      const userData = await response.json();

      setState({
        user: userData.user,
        permissions: userData.permissions,
        roles: userData.roles,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({
        user: null,
        permissions: [],
        roles: [],
        loading: false,
        error: "Authentication failed",
      });
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  const value = {
    ...state,
    hasPermission,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    refreshAuth,
  };

  return (
    <GuardContext.Provider value={value}>{children}</GuardContext.Provider>
  );
};

const useGuard = () => {
  const context = useContext(GuardContext);
  if (!context) {
    throw new Error("useGuard must be used within GuardProvider");
  }
  return context;
};

const GuardedRoute = ({
  children,
  permissions = [],
  roles = [],
  requireAll = false,
}: {
  children: React.ReactNode;
  permissions?: string[];
  roles?: string[];
  requireAll?: boolean;
}) => {
  const { user, hasPermission, hasRole, hasAnyRole, hasAllRoles, loading } =
    useGuard();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const permissionCheck =
    permissions.length === 0 ||
    (requireAll
      ? permissions.every(hasPermission)
      : permissions.some(hasPermission));

  const roleCheck =
    roles.length === 0 || (requireAll ? hasAllRoles(roles) : hasAnyRole(roles));

  if (!permissionCheck || !roleCheck) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
```

## Testing Route Guards

```tsx
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./AuthProvider";

const renderWithRouter = (component: React.ReactElement, initialAuth = {}) => {
  return render(
    <BrowserRouter>
      <AuthProvider initialState={initialAuth}>{component}</AuthProvider>
    </BrowserRouter>
  );
};

describe("AuthGuard", () => {
  it("redirects to login when user is not authenticated", () => {
    renderWithRouter(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>,
      { isAuthenticated: false }
    );

    expect(window.location.pathname).toBe("/login");
  });

  it("renders children when user is authenticated", () => {
    renderWithRouter(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>,
      { isAuthenticated: true }
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });
});

describe("RoleGuard", () => {
  it("blocks access for users without required role", () => {
    renderWithRouter(
      <RoleGuard requiredRoles={["admin"]}>
        <div>Admin Content</div>
      </RoleGuard>,
      {
        isAuthenticated: true,
        user: { roles: ["user"] },
      }
    );

    expect(window.location.pathname).toBe("/unauthorized");
  });

  it("allows access for users with required role", () => {
    renderWithRouter(
      <RoleGuard requiredRoles={["admin"]}>
        <div>Admin Content</div>
      </RoleGuard>,
      {
        isAuthenticated: true,
        user: { roles: ["admin"] },
      }
    );

    expect(screen.getByText("Admin Content")).toBeInTheDocument();
  });
});
```

## Best Practices

1. **Fail Secure**: Default to denying access when in doubt
2. **Loading States**: Show loading indicators during auth checks
3. **Error Handling**: Handle authentication failures gracefully
4. **Performance**: Cache permission checks when possible
5. **Composition**: Use guard composition for complex requirements
6. **Testing**: Test all guard scenarios thoroughly
7. **User Experience**: Provide clear feedback for access denials
8. **Security**: Never rely solely on frontend guards for security

## Common Guard Patterns

| Pattern           | Use Case               | Implementation             |
| ----------------- | ---------------------- | -------------------------- |
| Auth Guard        | Basic authentication   | Check token/session        |
| Role Guard        | Role-based access      | Check user roles           |
| Permission Guard  | Granular permissions   | Check specific permissions |
| Resource Guard    | Resource ownership     | Check resource access      |
| Conditional Guard | Custom logic           | Custom condition function  |
| Async Guard       | Server-side validation | Async permission checking  |

Route guards provide essential security and user experience improvements by controlling access to different parts of your React application based on authentication status, user roles, and permissions.
