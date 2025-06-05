# React Security Fundamentals

React security involves protecting applications from various threats including XSS, CSRF, injection attacks, and unauthorized access. Understanding security fundamentals is crucial for building robust React applications that protect user data and maintain system integrity.

## Common Security Threats

### Cross-Site Scripting (XSS)

XSS attacks inject malicious scripts into web applications, potentially stealing user data or performing unauthorized actions.

#### Preventing XSS in React

```tsx
const UserProfile: React.FC<{ userData: UserData }> = ({ userData }) => {
  // Safe: React automatically escapes content
  return (
    <div>
      <h1>{userData.name}</h1>
      <p>{userData.bio}</p>
    </div>
  );
};

// Dangerous: Using dangerouslySetInnerHTML without sanitization
const UnsafeComponent: React.FC<{ htmlContent: string }> = ({
  htmlContent,
}) => {
  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

// Safe: Using DOMPurify to sanitize HTML
import DOMPurify from "dompurify";

const SafeHTMLComponent: React.FC<{ htmlContent: string }> = ({
  htmlContent,
}) => {
  const sanitizedHTML = DOMPurify.sanitize(htmlContent);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />;
};
```

#### Content Security Policy (CSP)

```tsx
const SecurityHeaders: React.FC = () => {
  useEffect(() => {
    // Set CSP meta tag dynamically (better done server-side)
    const meta = document.createElement("meta");
    meta.httpEquiv = "Content-Security-Policy";
    meta.content =
      "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline';";
    document.head.appendChild(meta);

    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  return null;
};

// Server-side CSP header (Express.js example)
const setCspHeaders = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; " +
      "script-src 'self' 'unsafe-eval'; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https:; " +
      "font-src 'self' https:; " +
      "connect-src 'self' https://api.example.com;"
  );
  next();
};
```

### Cross-Site Request Forgery (CSRF)

CSRF attacks trick authenticated users into performing unintended actions.

#### CSRF Protection Implementation

```tsx
interface CSRFTokenContextType {
  token: string | null;
  refreshToken: () => Promise<void>;
}

const CSRFTokenContext = createContext<CSRFTokenContextType | null>(null);

const CSRFTokenProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);

  const refreshToken = useCallback(async () => {
    try {
      const response = await fetch("/api/csrf-token", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.csrfToken);
      }
    } catch (error) {
      console.error("Failed to fetch CSRF token:", error);
    }
  }, []);

  useEffect(() => {
    refreshToken();
  }, [refreshToken]);

  return (
    <CSRFTokenContext.Provider value={{ token, refreshToken }}>
      {children}
    </CSRFTokenContext.Provider>
  );
};

const useCSRFToken = () => {
  const context = useContext(CSRFTokenContext);
  if (!context) {
    throw new Error("useCSRFToken must be used within CSRFTokenProvider");
  }
  return context;
};

// Secure API request hook with CSRF protection
const useSecureAPI = () => {
  const { token } = useCSRFToken();

  const secureRequest = useCallback(
    async (url: string, options: RequestInit = {}) => {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...options.headers,
      };

      if (
        token &&
        (options.method === "POST" ||
          options.method === "PUT" ||
          options.method === "DELETE")
      ) {
        headers["X-CSRF-Token"] = token;
      }

      return fetch(url, {
        ...options,
        headers,
        credentials: "include",
      });
    },
    [token]
  );

  return { secureRequest };
};
```

## Authentication Security

### Secure Token Storage

```tsx
interface TokenStorage {
  getToken: () => string | null;
  setToken: (token: string) => void;
  removeToken: () => void;
}

// Secure token storage implementation
const createSecureTokenStorage = (): TokenStorage => {
  const TOKEN_KEY = "auth_token";

  return {
    getToken: () => {
      try {
        // Use httpOnly cookies for most secure storage
        // This is just for demonstration - httpOnly cookies can't be accessed via JS
        const token = localStorage.getItem(TOKEN_KEY);
        return token;
      } catch {
        return null;
      }
    },

    setToken: (token: string) => {
      try {
        localStorage.setItem(TOKEN_KEY, token);

        // Also set as httpOnly cookie via API call
        fetch("/api/auth/set-cookie", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
          credentials: "include",
        });
      } catch (error) {
        console.error("Failed to store token:", error);
      }
    },

    removeToken: () => {
      try {
        localStorage.removeItem(TOKEN_KEY);

        // Clear httpOnly cookie
        fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
        });
      } catch (error) {
        console.error("Failed to remove token:", error);
      }
    },
  };
};

const tokenStorage = createSecureTokenStorage();

// Secure authentication context
interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<boolean> => {
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
          credentials: "include",
        });

        if (response.ok) {
          const { user, token } = await response.json();

          // Store token securely
          tokenStorage.setToken(token);
          setUser(user);

          return true;
        }

        return false;
      } catch (error) {
        console.error("Login failed:", error);
        return false;
      }
    },
    []
  );

  const logout = useCallback(() => {
    tokenStorage.removeToken();
    setUser(null);
  }, []);

  // Verify authentication on app load
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch("/api/auth/verify", {
          credentials: "include",
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("Auth verification failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, []);

  if (isLoading) {
    return <div>Authenticating...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
```

### Role-Based Access Control (RBAC)

```tsx
interface Permission {
  resource: string;
  action: string;
}

interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

interface User {
  id: string;
  email: string;
  roles: Role[];
}

const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = useCallback(
    (resource: string, action: string): boolean => {
      if (!user) return false;

      return user.roles.some((role) =>
        role.permissions.some(
          (permission) =>
            permission.resource === resource && permission.action === action
        )
      );
    },
    [user]
  );

  const hasRole = useCallback(
    (roleName: string): boolean => {
      if (!user) return false;
      return user.roles.some((role) => role.name === roleName);
    },
    [user]
  );

  return { hasPermission, hasRole };
};

// Permission-based component wrapper
interface RequirePermissionProps {
  resource: string;
  action: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const RequirePermission: React.FC<RequirePermissionProps> = ({
  resource,
  action,
  children,
  fallback = <div>Access Denied</div>,
}) => {
  const { hasPermission } = usePermissions();

  if (!hasPermission(resource, action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// Usage example
const AdminPanel: React.FC = () => {
  return (
    <RequirePermission resource="admin" action="read">
      <div>
        <h1>Admin Panel</h1>

        <RequirePermission resource="users" action="delete">
          <button>Delete Users</button>
        </RequirePermission>

        <RequirePermission resource="settings" action="write">
          <button>Update Settings</button>
        </RequirePermission>
      </div>
    </RequirePermission>
  );
};
```

## Input Validation and Sanitization

### Client-Side Validation

```tsx
interface ValidationRule<T> {
  validate: (value: T) => boolean;
  message: string;
}

interface ValidationSchema<T> {
  [K in keyof T]: ValidationRule<T[K]>[];
}

const useFormValidation = <T extends Record<string, any>>(
  schema: ValidationSchema<T>
) => {
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const validateField = useCallback((field: keyof T, value: T[keyof T]): string | null => {
    const rules = schema[field];
    if (!rules) return null;

    for (const rule of rules) {
      if (!rule.validate(value)) {
        return rule.message;
      }
    }

    return null;
  }, [schema]);

  const validateForm = useCallback((values: T): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(schema).forEach(field => {
      const key = field as keyof T;
      const error = validateField(key, values[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [schema, validateField]);

  return { errors, validateField, validateForm, setErrors };
};

// Secure input component with validation and sanitization
interface SecureInputProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password';
  sanitize?: boolean;
  maxLength?: number;
  pattern?: RegExp;
  required?: boolean;
}

const SecureInput: React.FC<SecureInputProps> = ({
  name,
  value,
  onChange,
  type = 'text',
  sanitize = true,
  maxLength = 1000,
  pattern,
  required = false
}) => {
  const [error, setError] = useState<string>('');

  const sanitizeInput = useCallback((input: string): string => {
    if (!sanitize) return input;

    // Remove potentially dangerous characters
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim()
      .slice(0, maxLength);
  }, [sanitize, maxLength]);

  const validateInput = useCallback((input: string): string => {
    if (required && !input.trim()) {
      return `${name} is required`;
    }

    if (pattern && !pattern.test(input)) {
      return `${name} format is invalid`;
    }

    if (input.length > maxLength) {
      return `${name} must be less than ${maxLength} characters`;
    }

    return '';
  }, [name, pattern, required, maxLength]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const sanitizedValue = sanitizeInput(rawValue);
    const validationError = validateInput(sanitizedValue);

    setError(validationError);
    onChange(sanitizedValue);
  }, [sanitizeInput, validateInput, onChange]);

  return (
    <div>
      <input
        type={type}
        value={value}
        onChange={handleChange}
        maxLength={maxLength}
        required={required}
      />
      {error && <span className="error">{error}</span>}
    </div>
  );
};
```

### Server-Side Validation

```tsx
// API endpoint validation schema
interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
}

const createUserSchema: ValidationSchema<CreateUserRequest> = {
  email: [
    {
      validate: (value) => typeof value === "string" && value.length > 0,
      message: "Email is required",
    },
    {
      validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: "Invalid email format",
    },
  ],
  password: [
    {
      validate: (value) => typeof value === "string" && value.length >= 8,
      message: "Password must be at least 8 characters",
    },
    {
      validate: (value) => /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value),
      message: "Password must contain uppercase, lowercase, and number",
    },
  ],
  name: [
    {
      validate: (value) => typeof value === "string" && value.trim().length > 0,
      message: "Name is required",
    },
    {
      validate: (value) => value.length <= 100,
      message: "Name must be less than 100 characters",
    },
  ],
};

// Secure API request with validation
const useSecureAPI = () => {
  const validateAndSanitize = useCallback(
    <T,>(
      data: T,
      schema: ValidationSchema<T>
    ): { isValid: boolean; sanitizedData: T; errors: string[] } => {
      const errors: string[] = [];
      const sanitizedData = { ...data };

      Object.keys(schema).forEach((field) => {
        const key = field as keyof T;
        const rules = schema[key];
        const value = data[key];

        for (const rule of rules) {
          if (!rule.validate(value)) {
            errors.push(rule.message);
            break;
          }
        }

        // Sanitize string values
        if (typeof value === "string") {
          sanitizedData[key] = DOMPurify.sanitize(value) as T[keyof T];
        }
      });

      return {
        isValid: errors.length === 0,
        sanitizedData,
        errors,
      };
    },
    []
  );

  const secureRequest = useCallback(
    async <T,>(
      url: string,
      data: T,
      schema: ValidationSchema<T>,
      options: RequestInit = {}
    ) => {
      const { isValid, sanitizedData, errors } = validateAndSanitize(
        data,
        schema
      );

      if (!isValid) {
        throw new Error(`Validation failed: ${errors.join(", ")}`);
      }

      return fetch(url, {
        ...options,
        method: options.method || "POST",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        body: JSON.stringify(sanitizedData),
        credentials: "include",
      });
    },
    [validateAndSanitize]
  );

  return { secureRequest };
};
```

## Secure API Communication

### Request/Response Interceptors

```tsx
interface APIConfig {
  baseURL: string;
  timeout: number;
  retries: number;
}

class SecureAPIClient {
  private config: APIConfig;
  private refreshTokenPromise: Promise<string> | null = null;

  constructor(config: APIConfig) {
    this.config = config;
  }

  private async getAuthToken(): Promise<string | null> {
    // Try to get token from secure storage
    const token = tokenStorage.getToken();

    if (!token) return null;

    // Verify token is not expired
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const isExpired = payload.exp * 1000 < Date.now();

      if (isExpired) {
        return this.refreshToken();
      }

      return token;
    } catch {
      return null;
    }
  }

  private async refreshToken(): Promise<string | null> {
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise;
    }

    this.refreshTokenPromise = this.performTokenRefresh();
    const newToken = await this.refreshTokenPromise;
    this.refreshTokenPromise = null;

    return newToken;
  }

  private async performTokenRefresh(): Promise<string | null> {
    try {
      const response = await fetch(`${this.config.baseURL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const { token } = await response.json();
        tokenStorage.setToken(token);
        return token;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
    }

    return null;
  }

  async request(
    endpoint: string,
    options: RequestInit & { retries?: number } = {}
  ): Promise<Response> {
    const { retries = this.config.retries, ...requestOptions } = options;
    const url = `${this.config.baseURL}${endpoint}`;

    // Add authentication header
    const token = await this.getAuthToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...requestOptions.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Add security headers
    headers["X-Requested-With"] = "XMLHttpRequest";
    headers["X-Content-Type-Options"] = "nosniff";

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        ...requestOptions,
        headers,
        credentials: "include",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle token expiration
      if (response.status === 401 && token) {
        const newToken = await this.refreshToken();

        if (newToken && retries > 0) {
          return this.request(endpoint, { ...options, retries: retries - 1 });
        }
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);

      if (
        retries > 0 &&
        error instanceof Error &&
        error.name !== "AbortError"
      ) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return this.request(endpoint, { ...options, retries: retries - 1 });
      }

      throw error;
    }
  }
}

const apiClient = new SecureAPIClient({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3000/api",
  timeout: 10000,
  retries: 3,
});

// Secure API hooks
const useSecureQuery = <T,>(endpoint: string, options: RequestInit = {}) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiClient.request(endpoint, options);

        if (!response.ok) {
          throw new Error(
            `API Error: ${response.status} ${response.statusText}`
          );
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, JSON.stringify(options)]);

  return { data, loading, error };
};
```

## Security Monitoring and Logging

### Security Event Tracking

```tsx
interface SecurityEvent {
  type:
    | "auth_failure"
    | "suspicious_activity"
    | "data_access"
    | "permission_denied";
  severity: "low" | "medium" | "high" | "critical";
  details: Record<string, any>;
  timestamp: Date;
  userAgent: string;
  ipAddress?: string;
}

class SecurityMonitor {
  private events: SecurityEvent[] = [];
  private alertThresholds = {
    auth_failure: 5,
    suspicious_activity: 3,
    permission_denied: 10,
  };

  logSecurityEvent(
    event: Omit<SecurityEvent, "timestamp" | "userAgent">
  ): void {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
    };

    this.events.push(securityEvent);

    // Send to server immediately for critical events
    if (event.severity === "critical") {
      this.reportEvent(securityEvent);
    }

    // Check for patterns that might indicate attacks
    this.analyzeEventPatterns(securityEvent);

    // Clean old events (keep last 100)
    if (this.events.length > 100) {
      this.events = this.events.slice(-100);
    }
  }

  private analyzeEventPatterns(event: SecurityEvent): void {
    const recentEvents = this.events.filter(
      (e) =>
        e.type === event.type && Date.now() - e.timestamp.getTime() < 300000 // 5 minutes
    );

    const threshold = this.alertThresholds[event.type];
    if (threshold && recentEvents.length >= threshold) {
      this.triggerSecurityAlert(event.type, recentEvents);
    }
  }

  private triggerSecurityAlert(
    eventType: string,
    events: SecurityEvent[]
  ): void {
    const alertEvent: SecurityEvent = {
      type: "suspicious_activity",
      severity: "high",
      details: {
        pattern: eventType,
        eventCount: events.length,
        timeWindow: "5 minutes",
      },
      timestamp: new Date(),
      userAgent: navigator.userAgent,
    };

    this.reportEvent(alertEvent);
  }

  private async reportEvent(event: SecurityEvent): Promise<void> {
    try {
      await fetch("/api/security/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
        credentials: "include",
      });
    } catch (error) {
      console.error("Failed to report security event:", error);
    }
  }
}

const securityMonitor = new SecurityMonitor();

// Security monitoring hooks
const useSecurityMonitoring = () => {
  const logAuthFailure = useCallback((details: Record<string, any>) => {
    securityMonitor.logSecurityEvent({
      type: "auth_failure",
      severity: "medium",
      details,
    });
  }, []);

  const logSuspiciousActivity = useCallback((details: Record<string, any>) => {
    securityMonitor.logSecurityEvent({
      type: "suspicious_activity",
      severity: "high",
      details,
    });
  }, []);

  const logDataAccess = useCallback((resource: string, action: string) => {
    securityMonitor.logSecurityEvent({
      type: "data_access",
      severity: "low",
      details: { resource, action },
    });
  }, []);

  const logPermissionDenied = useCallback(
    (resource: string, action: string) => {
      securityMonitor.logSecurityEvent({
        type: "permission_denied",
        severity: "medium",
        details: { resource, action },
      });
    },
    []
  );

  return {
    logAuthFailure,
    logSuspiciousActivity,
    logDataAccess,
    logPermissionDenied,
  };
};

// Enhanced authentication with security monitoring
const useSecureAuth = () => {
  const { logAuthFailure, logSuspiciousActivity } = useSecurityMonitoring();
  const [user, setUser] = useState<User | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<boolean> => {
      try {
        // Rate limiting check
        if (loginAttempts >= 5) {
          logSuspiciousActivity({
            action: "excessive_login_attempts",
            attempts: loginAttempts,
          });
          throw new Error("Too many login attempts. Please try again later.");
        }

        const response = await apiClient.request("/auth/login", {
          method: "POST",
          body: JSON.stringify(credentials),
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData.user);
          setLoginAttempts(0);
          return true;
        } else {
          setLoginAttempts((prev) => prev + 1);
          logAuthFailure({
            email: credentials.email,
            attempt: loginAttempts + 1,
            reason: "invalid_credentials",
          });
          return false;
        }
      } catch (error) {
        logAuthFailure({
          email: credentials.email,
          error: error instanceof Error ? error.message : "Unknown error",
        });
        throw error;
      }
    },
    [loginAttempts, logAuthFailure, logSuspiciousActivity]
  );

  return { user, login };
};
```

## Environment and Configuration Security

### Secure Environment Configuration

```tsx
interface SecurityConfig {
  apiUrl: string;
  enableDevTools: boolean;
  logLevel: "error" | "warn" | "info" | "debug";
  csrfProtection: boolean;
  httpsOnly: boolean;
}

const getSecurityConfig = (): SecurityConfig => {
  const isDevelopment = process.env.NODE_ENV === "development";

  // Validate required environment variables
  const requiredEnvVars = ["REACT_APP_API_URL"];
  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }

  return {
    apiUrl: process.env.REACT_APP_API_URL!,
    enableDevTools:
      isDevelopment && process.env.REACT_APP_ENABLE_DEVTOOLS === "true",
    logLevel:
      (process.env.REACT_APP_LOG_LEVEL as SecurityConfig["logLevel"]) ||
      "error",
    csrfProtection: process.env.REACT_APP_CSRF_PROTECTION !== "false",
    httpsOnly: process.env.REACT_APP_HTTPS_ONLY !== "false",
  };
};

// Secure configuration provider
const SecurityConfigContext = createContext<SecurityConfig | null>(null);

const SecurityConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [config] = useState(() => getSecurityConfig());

  // Development security warnings
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      if (!config.httpsOnly) {
        console.warn("HTTPS is disabled in development mode");
      }

      if (!config.csrfProtection) {
        console.warn("CSRF protection is disabled");
      }
    }
  }, [config]);

  return (
    <SecurityConfigContext.Provider value={config}>
      {children}
    </SecurityConfigContext.Provider>
  );
};

const useSecurityConfig = () => {
  const context = useContext(SecurityConfigContext);
  if (!context) {
    throw new Error(
      "useSecurityConfig must be used within SecurityConfigProvider"
    );
  }
  return context;
};
```

## Best Practices

### Security Checklist

1. **Input Validation**: Always validate and sanitize user inputs
2. **Authentication**: Implement secure authentication with proper token handling
3. **Authorization**: Use role-based access control with least privilege principle
4. **HTTPS**: Always use HTTPS in production
5. **CSP**: Implement Content Security Policy headers
6. **CSRF Protection**: Use CSRF tokens for state-changing operations
7. **XSS Prevention**: Sanitize HTML content and avoid dangerouslySetInnerHTML
8. **Secure Storage**: Use httpOnly cookies for sensitive data
9. **Rate Limiting**: Implement rate limiting for API endpoints
10. **Security Monitoring**: Log and monitor security events

### Security Testing

```tsx
// Security test utilities
const SecurityTestUtils = {
  // Test for XSS vulnerabilities
  testXSSPrevention: (component: React.ComponentType<any>, props: any) => {
    const maliciousInputs = [
      '<script>alert("XSS")</script>',
      'javascript:alert("XSS")',
      '<img src="x" onerror="alert(\'XSS\')" />',
      "<iframe src=\"javascript:alert('XSS')\"></iframe>",
    ];

    maliciousInputs.forEach((input) => {
      const { container } = render(
        React.createElement(component, { ...props, value: input })
      );

      // Should not contain script tags or javascript: protocols
      expect(container.innerHTML).not.toContain("<script>");
      expect(container.innerHTML).not.toContain("javascript:");
      expect(container.innerHTML).not.toContain("onerror=");
    });
  },

  // Test authentication flows
  testAuthenticationSecurity: async (
    loginFunction: (creds: any) => Promise<boolean>
  ) => {
    // Test with invalid credentials
    const result = await loginFunction({
      email: "test@test.com",
      password: "wrong",
    });
    expect(result).toBe(false);

    // Test with malicious input
    const maliciousResult = await loginFunction({
      email: '<script>alert("xss")</script>',
      password: "password",
    });
    expect(maliciousResult).toBe(false);
  },

  // Test CSRF protection
  testCSRFProtection: async (apiFunction: (data: any) => Promise<Response>) => {
    // Mock request without CSRF token
    const mockFetch = jest
      .fn()
      .mockResolvedValue(new Response("", { status: 403 }));
    global.fetch = mockFetch;

    const response = await apiFunction({ test: "data" });
    expect(response.status).toBe(403);
  },
};

// Example security tests
describe("Security Tests", () => {
  describe("XSS Prevention", () => {
    it("should prevent XSS in user input fields", () => {
      SecurityTestUtils.testXSSPrevention(SecureInput, {
        name: "test",
        value: "",
        onChange: jest.fn(),
      });
    });
  });

  describe("Authentication Security", () => {
    it("should handle authentication securely", async () => {
      const mockLogin = jest.fn().mockResolvedValue(false);
      await SecurityTestUtils.testAuthenticationSecurity(mockLogin);
    });
  });

  describe("CSRF Protection", () => {
    it("should reject requests without CSRF token", async () => {
      const mockAPI = jest
        .fn()
        .mockResolvedValue(new Response("", { status: 403 }));
      await SecurityTestUtils.testCSRFProtection(mockAPI);
    });
  });
});
```

## Interview Questions

### Basic Questions

**Q: What is XSS and how do you prevent it in React?**

A: Cross-Site Scripting (XSS) is an attack where malicious scripts are injected into web applications. React helps prevent XSS by:

- Automatically escaping content in JSX expressions
- Avoiding `dangerouslySetInnerHTML` or sanitizing content with libraries like DOMPurify
- Implementing Content Security Policy (CSP) headers
- Validating and sanitizing user inputs

**Q: How do you securely store authentication tokens in React?**

A: Secure token storage options include:

- **httpOnly cookies**: Most secure, can't be accessed via JavaScript
- **localStorage**: Less secure but convenient for development
- **sessionStorage**: Similar to localStorage but cleared on tab close
- **Memory storage**: Most secure but lost on refresh

Always use HTTPS and implement token expiration and refresh mechanisms.

**Q: What is CSRF and how do you protect against it?**

A: Cross-Site Request Forgery (CSRF) tricks authenticated users into performing unintended actions. Protection includes:

- Using CSRF tokens in forms and AJAX requests
- Implementing SameSite cookie attributes
- Verifying the Origin/Referer headers
- Using double-submit cookie pattern

### Intermediate Questions

**Q: How do you implement role-based access control in React?**

A: RBAC implementation involves:

- Defining permissions and roles on the backend
- Creating permission checking hooks and components
- Implementing route guards for protected pages
- Using context providers for user permissions
- Creating reusable permission wrapper components

**Q: How do you validate user input securely in React?**

A: Secure input validation includes:

- Client-side validation for UX (never trust client-side only)
- Server-side validation for security
- Input sanitization to remove dangerous content
- Type checking and format validation
- Length limits and character restrictions
- Using validation libraries like Yup or Joi

**Q: How do you implement secure API communication?**

A: Secure API communication involves:

- Using HTTPS for all requests
- Implementing request/response interceptors
- Adding authentication headers (Bearer tokens)
- Handling token refresh automatically
- Implementing retry logic with exponential backoff
- Validating server certificates

### Advanced Questions

**Q: How do you implement security monitoring in React applications?**

A: Security monitoring includes:

- Logging security events (auth failures, permission denials)
- Implementing real-time threat detection
- Setting up alerting for suspicious activities
- Tracking user behavior patterns
- Reporting security incidents to backend services
- Implementing client-side security policies

**Q: How do you handle sensitive data in React applications?**

A: Handling sensitive data securely:

- Never store sensitive data in localStorage/sessionStorage
- Use environment variables for configuration
- Implement data encryption for sensitive client-side storage
- Minimize sensitive data exposure in state
- Clear sensitive data from memory when no longer needed
- Implement proper data lifecycle management

**Q: How do you implement Content Security Policy in React applications?**

A: CSP implementation involves:

- Setting CSP headers on the server
- Defining allowed sources for scripts, styles, and images
- Using nonces for inline scripts and styles
- Implementing CSP reporting for violations
- Gradually tightening CSP policies
- Testing CSP policies in report-only mode first
