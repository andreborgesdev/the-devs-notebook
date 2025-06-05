# React Authentication Patterns

Authentication in React applications requires careful consideration of security, user experience, and maintainability. This guide covers various authentication patterns, from basic implementations to advanced security features.

## JWT Authentication

### Basic JWT Implementation

```tsx
interface JWTPayload {
  sub: string;
  email: string;
  roles: string[];
  exp: number;
  iat: number;
}

interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

class JWTAuthService {
  private static readonly ACCESS_TOKEN_KEY = "access_token";
  private static readonly REFRESH_TOKEN_KEY = "refresh_token";

  static decodeToken(token: string): JWTPayload | null {
    try {
      const payload = token.split(".")[1];
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch {
      return null;
    }
  }

  static isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  }

  static getAccessToken(): string | null {
    const token = localStorage.getItem(this.ACCESS_TOKEN_KEY);
    if (!token || this.isTokenExpired(token)) {
      return null;
    }
    return token;
  }

  static setTokens(authToken: AuthToken): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, authToken.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, authToken.refreshToken);
  }

  static clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  static async refreshAccessToken(): Promise<string | null> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    if (!refreshToken) return null;

    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const authToken: AuthToken = await response.json();
        this.setTokens(authToken);
        return authToken.accessToken;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
    }

    this.clearTokens();
    return null;
  }
}

// JWT Authentication Context
interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const JWTAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const authToken: AuthToken = await response.json();
          JWTAuthService.setTokens(authToken);

          const tokenPayload = JWTAuthService.decodeToken(
            authToken.accessToken
          );
          if (tokenPayload) {
            setUser({
              id: tokenPayload.sub,
              email: tokenPayload.email,
              name: tokenPayload.email,
              roles: tokenPayload.roles,
            });
            return true;
          }
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
    JWTAuthService.clearTokens();
    setUser(null);
  }, []);

  const refreshAuth = useCallback(async () => {
    const token = JWTAuthService.getAccessToken();
    if (token) {
      const payload = JWTAuthService.decodeToken(token);
      if (payload) {
        setUser({
          id: payload.sub,
          email: payload.email,
          name: payload.email,
          roles: payload.roles,
        });
        return;
      }
    }

    const refreshedToken = await JWTAuthService.refreshAccessToken();
    if (refreshedToken) {
      const payload = JWTAuthService.decodeToken(refreshedToken);
      if (payload) {
        setUser({
          id: payload.sub,
          email: payload.email,
          name: payload.email,
          roles: payload.roles,
        });
      }
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      await refreshAuth();
      setIsLoading(false);
    };

    initAuth();
  }, [refreshAuth]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within JWTAuthProvider");
  }
  return context;
};
```

### JWT Token Refresh Strategy

```tsx
interface TokenRefreshConfig {
  refreshThreshold: number; // Refresh when token expires in X seconds
  maxRetries: number;
  retryDelay: number;
}

class TokenRefreshManager {
  private refreshPromise: Promise<string | null> | null = null;
  private refreshTimer: NodeJS.Timeout | null = null;
  private config: TokenRefreshConfig;

  constructor(config: TokenRefreshConfig) {
    this.config = config;
  }

  startAutoRefresh(): void {
    this.scheduleRefresh();
  }

  stopAutoRefresh(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  private scheduleRefresh(): void {
    const token = JWTAuthService.getAccessToken();
    if (!token) return;

    const payload = JWTAuthService.decodeToken(token);
    if (!payload) return;

    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = payload.exp - currentTime;
    const refreshTime = Math.max(
      0,
      (timeUntilExpiry - this.config.refreshThreshold) * 1000
    );

    this.refreshTimer = setTimeout(() => {
      this.performRefresh();
    }, refreshTime);
  }

  private async performRefresh(): Promise<void> {
    if (this.refreshPromise) {
      await this.refreshPromise;
      return;
    }

    this.refreshPromise = this.refreshWithRetry();
    await this.refreshPromise;
    this.refreshPromise = null;
    this.scheduleRefresh();
  }

  private async refreshWithRetry(attempt = 0): Promise<string | null> {
    try {
      const newToken = await JWTAuthService.refreshAccessToken();
      if (newToken) {
        return newToken;
      }
    } catch (error) {
      console.error(`Token refresh attempt ${attempt + 1} failed:`, error);
    }

    if (attempt < this.config.maxRetries) {
      await new Promise((resolve) =>
        setTimeout(resolve, this.config.retryDelay)
      );
      return this.refreshWithRetry(attempt + 1);
    }

    return null;
  }
}

// Enhanced Auth Provider with automatic token refresh
const EnhancedJWTAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const tokenManager = useRef<TokenRefreshManager>();

  useEffect(() => {
    tokenManager.current = new TokenRefreshManager({
      refreshThreshold: 300, // 5 minutes
      maxRetries: 3,
      retryDelay: 1000,
    });

    return () => {
      tokenManager.current?.stopAutoRefresh();
    };
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const authToken: AuthToken = await response.json();
          JWTAuthService.setTokens(authToken);

          const tokenPayload = JWTAuthService.decodeToken(
            authToken.accessToken
          );
          if (tokenPayload) {
            setUser({
              id: tokenPayload.sub,
              email: tokenPayload.email,
              name: tokenPayload.email,
              roles: tokenPayload.roles,
            });

            tokenManager.current?.startAutoRefresh();
            return true;
          }
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
    tokenManager.current?.stopAutoRefresh();
    JWTAuthService.clearTokens();
    setUser(null);
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const token = JWTAuthService.getAccessToken();
      if (token) {
        const payload = JWTAuthService.decodeToken(token);
        if (payload) {
          setUser({
            id: payload.sub,
            email: payload.email,
            name: payload.email,
            roles: payload.roles,
          });
          tokenManager.current?.startAutoRefresh();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshAuth: async () => {},
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
```

## OAuth2 / Social Authentication

### OAuth2 Implementation

```tsx
interface OAuthProvider {
  name: string;
  clientId: string;
  redirectUri: string;
  scope: string;
  authUrl: string;
  tokenUrl: string;
}

interface OAuthConfig {
  google: OAuthProvider;
  github: OAuthProvider;
  facebook: OAuthProvider;
}

const oauthConfig: OAuthConfig = {
  google: {
    name: "google",
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID!,
    redirectUri: `${window.location.origin}/auth/callback/google`,
    scope: "openid profile email",
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
  },
  github: {
    name: "github",
    clientId: process.env.REACT_APP_GITHUB_CLIENT_ID!,
    redirectUri: `${window.location.origin}/auth/callback/github`,
    scope: "user:email",
    authUrl: "https://github.com/login/oauth/authorize",
    tokenUrl: "https://github.com/login/oauth/access_token",
  },
  facebook: {
    name: "facebook",
    clientId: process.env.REACT_APP_FACEBOOK_CLIENT_ID!,
    redirectUri: `${window.location.origin}/auth/callback/facebook`,
    scope: "email",
    authUrl: "https://www.facebook.com/v12.0/dialog/oauth",
    tokenUrl: "https://graph.facebook.com/v12.0/oauth/access_token",
  },
};

class OAuthService {
  static generateState(): string {
    return btoa(
      Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)
    );
  }

  static generateCodeVerifier(): string {
    const array = new Uint32Array(56 / 2);
    window.crypto.getRandomValues(array);
    return Array.from(array, (dec) => ("0" + dec.toString(16)).substr(-2)).join(
      ""
    );
  }

  static async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await window.crypto.subtle.digest("SHA-256", data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
  }

  static buildAuthUrl(
    provider: OAuthProvider,
    state: string,
    codeChallenge?: string
  ): string {
    const params = new URLSearchParams({
      client_id: provider.clientId,
      redirect_uri: provider.redirectUri,
      scope: provider.scope,
      response_type: "code",
      state,
    });

    if (codeChallenge) {
      params.append("code_challenge", codeChallenge);
      params.append("code_challenge_method", "S256");
    }

    return `${provider.authUrl}?${params.toString()}`;
  }

  static async exchangeCodeForToken(
    provider: OAuthProvider,
    code: string,
    codeVerifier?: string
  ): Promise<any> {
    const params: Record<string, string> = {
      client_id: provider.clientId,
      redirect_uri: provider.redirectUri,
      code,
      grant_type: "authorization_code",
    };

    if (codeVerifier) {
      params.code_verifier = codeVerifier;
    }

    const response = await fetch(provider.tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(params),
    });

    return response.json();
  }
}

// OAuth Authentication Hook
const useOAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const initiateOAuth = useCallback(async (providerName: keyof OAuthConfig) => {
    try {
      setIsLoading(true);
      const provider = oauthConfig[providerName];
      const state = OAuthService.generateState();
      const codeVerifier = OAuthService.generateCodeVerifier();
      const codeChallenge = await OAuthService.generateCodeChallenge(
        codeVerifier
      );

      // Store PKCE verifier and state
      sessionStorage.setItem("oauth_state", state);
      sessionStorage.setItem("oauth_code_verifier", codeVerifier);
      sessionStorage.setItem("oauth_provider", providerName);

      const authUrl = OAuthService.buildAuthUrl(provider, state, codeChallenge);
      window.location.href = authUrl;
    } catch (error) {
      console.error("OAuth initiation failed:", error);
      setIsLoading(false);
    }
  }, []);

  const handleOAuthCallback = useCallback(
    async (providerName: keyof OAuthConfig, code: string, state: string) => {
      try {
        setIsLoading(true);

        // Verify state
        const storedState = sessionStorage.getItem("oauth_state");
        if (state !== storedState) {
          throw new Error("Invalid state parameter");
        }

        const codeVerifier = sessionStorage.getItem("oauth_code_verifier");
        const provider = oauthConfig[providerName];

        // Exchange code for token
        const tokenResponse = await OAuthService.exchangeCodeForToken(
          provider,
          code,
          codeVerifier || undefined
        );

        // Send token to backend for verification and user creation
        const authResponse = await fetch("/api/auth/oauth/callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provider: providerName,
            accessToken: tokenResponse.access_token,
          }),
        });

        if (authResponse.ok) {
          const authToken: AuthToken = await authResponse.json();
          JWTAuthService.setTokens(authToken);

          // Clean up session storage
          sessionStorage.removeItem("oauth_state");
          sessionStorage.removeItem("oauth_code_verifier");
          sessionStorage.removeItem("oauth_provider");

          return true;
        }

        return false;
      } catch (error) {
        console.error("OAuth callback failed:", error);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { initiateOAuth, handleOAuthCallback, isLoading };
};

// OAuth Login Component
const OAuthLoginButtons: React.FC = () => {
  const { initiateOAuth, isLoading } = useOAuth();

  return (
    <div className="oauth-buttons">
      <button
        onClick={() => initiateOAuth("google")}
        disabled={isLoading}
        className="oauth-button google"
      >
        <GoogleIcon />
        Continue with Google
      </button>

      <button
        onClick={() => initiateOAuth("github")}
        disabled={isLoading}
        className="oauth-button github"
      >
        <GitHubIcon />
        Continue with GitHub
      </button>

      <button
        onClick={() => initiateOAuth("facebook")}
        disabled={isLoading}
        className="oauth-button facebook"
      >
        <FacebookIcon />
        Continue with Facebook
      </button>
    </div>
  );
};

// OAuth Callback Handler Component
const OAuthCallback: React.FC = () => {
  const { handleOAuthCallback } = useOAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const processCallback = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get("code");
      const state = params.get("state");
      const error = params.get("error");

      if (error) {
        console.error("OAuth error:", error);
        navigate("/login?error=oauth_failed");
        return;
      }

      if (!code || !state) {
        navigate("/login?error=invalid_callback");
        return;
      }

      const provider = sessionStorage.getItem(
        "oauth_provider"
      ) as keyof OAuthConfig;
      if (!provider) {
        navigate("/login?error=missing_provider");
        return;
      }

      const success = await handleOAuthCallback(provider, code, state);
      if (success) {
        navigate("/dashboard");
      } else {
        navigate("/login?error=oauth_failed");
      }
    };

    processCallback();
  }, [handleOAuthCallback, navigate, location.search]);

  return (
    <div className="oauth-callback">
      <div>Processing authentication...</div>
    </div>
  );
};
```

## Multi-Factor Authentication (MFA)

### TOTP Implementation

```tsx
interface MFASetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

interface MFAContext {
  mfaEnabled: boolean;
  setupMFA: () => Promise<MFASetup | null>;
  enableMFA: (token: string) => Promise<boolean>;
  disableMFA: (token: string) => Promise<boolean>;
  verifyMFA: (token: string) => Promise<boolean>;
}

const MFAContext = createContext<MFAContext | null>(null);

const MFAProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const { user } = useAuth();

  const setupMFA = useCallback(async (): Promise<MFASetup | null> => {
    try {
      const response = await fetch("/api/auth/mfa/setup", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${JWTAuthService.getAccessToken()}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        return response.json();
      }
      return null;
    } catch (error) {
      console.error("MFA setup failed:", error);
      return null;
    }
  }, []);

  const enableMFA = useCallback(async (token: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/mfa/enable", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${JWTAuthService.getAccessToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        setMfaEnabled(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error("MFA enable failed:", error);
      return false;
    }
  }, []);

  const disableMFA = useCallback(async (token: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/mfa/disable", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${JWTAuthService.getAccessToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        setMfaEnabled(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error("MFA disable failed:", error);
      return false;
    }
  }, []);

  const verifyMFA = useCallback(async (token: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/mfa/verify", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${JWTAuthService.getAccessToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      return response.ok;
    } catch (error) {
      console.error("MFA verification failed:", error);
      return false;
    }
  }, []);

  useEffect(() => {
    const checkMFAStatus = async () => {
      if (user) {
        try {
          const response = await fetch("/api/auth/mfa/status", {
            headers: {
              Authorization: `Bearer ${JWTAuthService.getAccessToken()}`,
            },
          });

          if (response.ok) {
            const { enabled } = await response.json();
            setMfaEnabled(enabled);
          }
        } catch (error) {
          console.error("MFA status check failed:", error);
        }
      }
    };

    checkMFAStatus();
  }, [user]);

  return (
    <MFAContext.Provider
      value={{
        mfaEnabled,
        setupMFA,
        enableMFA,
        disableMFA,
        verifyMFA,
      }}
    >
      {children}
    </MFAContext.Provider>
  );
};

const useMFA = () => {
  const context = useContext(MFAContext);
  if (!context) {
    throw new Error("useMFA must be used within MFAProvider");
  }
  return context;
};

// MFA Setup Component
const MFASetupModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { setupMFA, enableMFA } = useMFA();
  const [step, setStep] = useState<"setup" | "verify">("setup");
  const [mfaData, setMfaData] = useState<MFASetup | null>(null);
  const [verificationToken, setVerificationToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSetup = useCallback(async () => {
    setIsLoading(true);
    const data = await setupMFA();
    if (data) {
      setMfaData(data);
      setStep("verify");
    }
    setIsLoading(false);
  }, [setupMFA]);

  const handleVerify = useCallback(async () => {
    if (!verificationToken) return;

    setIsLoading(true);
    const success = await enableMFA(verificationToken);
    if (success) {
      onClose();
    } else {
      alert("Invalid verification code. Please try again.");
    }
    setIsLoading(false);
  }, [enableMFA, verificationToken, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Setup Two-Factor Authentication</h2>

        {step === "setup" && (
          <div>
            <p>Enhance your account security with two-factor authentication.</p>
            <button onClick={handleSetup} disabled={isLoading}>
              {isLoading ? "Setting up..." : "Setup MFA"}
            </button>
          </div>
        )}

        {step === "verify" && mfaData && (
          <div>
            <p>Scan this QR code with your authenticator app:</p>
            <img src={mfaData.qrCode} alt="MFA QR Code" />

            <p>
              Or enter this secret manually: <code>{mfaData.secret}</code>
            </p>

            <div>
              <label>Enter verification code:</label>
              <input
                type="text"
                value={verificationToken}
                onChange={(e) => setVerificationToken(e.target.value)}
                placeholder="123456"
                maxLength={6}
              />
            </div>

            <div>
              <h3>Backup Codes</h3>
              <p>Save these backup codes in a safe place:</p>
              <ul>
                {mfaData.backupCodes.map((code, index) => (
                  <li key={index}>
                    <code>{code}</code>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={handleVerify}
              disabled={isLoading || !verificationToken}
            >
              {isLoading ? "Verifying..." : "Enable MFA"}
            </button>
          </div>
        )}

        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

// MFA Verification Component
const MFAVerification: React.FC<{ onSuccess: () => void }> = ({
  onSuccess,
}) => {
  const { verifyMFA } = useMFA();
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!token) return;

      setIsLoading(true);
      setError("");

      const success = await verifyMFA(token);
      if (success) {
        onSuccess();
      } else {
        setError("Invalid verification code. Please try again.");
      }

      setIsLoading(false);
    },
    [verifyMFA, token, onSuccess]
  );

  return (
    <form onSubmit={handleVerify} className="mfa-verification">
      <h2>Two-Factor Authentication</h2>
      <p>Enter the 6-digit code from your authenticator app:</p>

      <input
        type="text"
        value={token}
        onChange={(e) =>
          setToken(e.target.value.replace(/\D/g, "").slice(0, 6))
        }
        placeholder="123456"
        maxLength={6}
        required
      />

      {error && <div className="error">{error}</div>}

      <button type="submit" disabled={isLoading || token.length !== 6}>
        {isLoading ? "Verifying..." : "Verify"}
      </button>
    </form>
  );
};
```

## Route Protection

### Advanced Route Guards

```tsx
interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRoles?: string[];
  requirePermissions?: Array<{ resource: string; action: string }>;
  redirectTo?: string;
  fallback?: React.ComponentType;
}

const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  requireAuth = true,
  requireRoles = [],
  requirePermissions = [],
  redirectTo = "/login",
  fallback: Fallback,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { hasPermission } = usePermissions();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (requireRoles.length > 0 && user) {
    const hasRequiredRole = requireRoles.some((role) =>
      user.roles.some((userRole) => userRole.name === role)
    );

    if (!hasRequiredRole) {
      return Fallback ? <Fallback /> : <div>Access Denied</div>;
    }
  }

  if (requirePermissions.length > 0) {
    const hasAllPermissions = requirePermissions.every((permission) =>
      hasPermission(permission.resource, permission.action)
    );

    if (!hasAllPermissions) {
      return Fallback ? <Fallback /> : <div>Access Denied</div>;
    }
  }

  return <>{children}</>;
};

// Enhanced Protected Route Component
interface ProtectedRouteProps {
  element: React.ReactElement;
  requireAuth?: boolean;
  requireRoles?: string[];
  requirePermissions?: Array<{ resource: string; action: string }>;
  requireMFA?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  requireAuth = true,
  requireRoles = [],
  requirePermissions = [],
  requireMFA = false,
}) => {
  const { user, isAuthenticated } = useAuth();
  const { mfaEnabled } = useMFA();
  const [mfaVerified, setMfaVerified] = useState(false);

  if (requireMFA && mfaEnabled && !mfaVerified) {
    return <MFAVerification onSuccess={() => setMfaVerified(true)} />;
  }

  return (
    <RouteGuard
      requireAuth={requireAuth}
      requireRoles={requireRoles}
      requirePermissions={requirePermissions}
    >
      {element}
    </RouteGuard>
  );
};

// Route Configuration
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/auth/callback/:provider" element={<OAuthCallback />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={<ProtectedRoute element={<Dashboard />} />}
      />

      {/* Admin routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute
            element={<AdminPanel />}
            requireRoles={["admin"]}
            requireMFA={true}
          />
        }
      />

      {/* Permission-based routes */}
      <Route
        path="/users/manage"
        element={
          <ProtectedRoute
            element={<UserManagement />}
            requirePermissions={[{ resource: "users", action: "manage" }]}
          />
        }
      />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
```

## Session Management

### Advanced Session Handling

```tsx
interface SessionInfo {
  sessionId: string;
  createdAt: Date;
  lastActivity: Date;
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
}

interface SessionContextType {
  currentSession: SessionInfo | null;
  allSessions: SessionInfo[];
  refreshSessions: () => Promise<void>;
  terminateSession: (sessionId: string) => Promise<boolean>;
  terminateAllOtherSessions: () => Promise<boolean>;
}

const SessionContext = createContext<SessionContextType | null>(null);

const SessionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentSession, setCurrentSession] = useState<SessionInfo | null>(
    null
  );
  const [allSessions, setAllSessions] = useState<SessionInfo[]>([]);
  const { user } = useAuth();

  const refreshSessions = useCallback(async () => {
    if (!user) return;

    try {
      const response = await fetch("/api/auth/sessions", {
        headers: { Authorization: `Bearer ${JWTAuthService.getAccessToken()}` },
      });

      if (response.ok) {
        const { currentSession, allSessions } = await response.json();
        setCurrentSession(currentSession);
        setAllSessions(allSessions);
      }
    } catch (error) {
      console.error("Failed to refresh sessions:", error);
    }
  }, [user]);

  const terminateSession = useCallback(
    async (sessionId: string): Promise<boolean> => {
      try {
        const response = await fetch(`/api/auth/sessions/${sessionId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${JWTAuthService.getAccessToken()}`,
          },
        });

        if (response.ok) {
          await refreshSessions();
          return true;
        }
        return false;
      } catch (error) {
        console.error("Failed to terminate session:", error);
        return false;
      }
    },
    [refreshSessions]
  );

  const terminateAllOtherSessions = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/sessions/terminate-others", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${JWTAuthService.getAccessToken()}` },
      });

      if (response.ok) {
        await refreshSessions();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to terminate other sessions:", error);
      return false;
    }
  }, [refreshSessions]);

  useEffect(() => {
    if (user) {
      refreshSessions();

      // Refresh sessions every 5 minutes
      const interval = setInterval(refreshSessions, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [user, refreshSessions]);

  return (
    <SessionContext.Provider
      value={{
        currentSession,
        allSessions,
        refreshSessions,
        terminateSession,
        terminateAllOtherSessions,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return context;
};

// Session Management Component
const SessionManager: React.FC = () => {
  const {
    currentSession,
    allSessions,
    terminateSession,
    terminateAllOtherSessions,
  } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleTerminateSession = async (sessionId: string) => {
    setIsLoading(true);
    await terminateSession(sessionId);
    setIsLoading(false);
  };

  const handleTerminateOthers = async () => {
    setIsLoading(true);
    await terminateAllOtherSessions();
    setIsLoading(false);
  };

  return (
    <div className="session-manager">
      <h2>Active Sessions</h2>

      <div className="session-actions">
        <button
          onClick={handleTerminateOthers}
          disabled={isLoading || allSessions.length <= 1}
        >
          Terminate All Other Sessions
        </button>
      </div>

      <div className="sessions-list">
        {allSessions.map((session) => (
          <div key={session.sessionId} className="session-item">
            <div className="session-info">
              <div className="session-header">
                {session.sessionId === currentSession?.sessionId ? (
                  <span className="current-session">Current Session</span>
                ) : (
                  <span>Session</span>
                )}
                <span
                  className={`status ${
                    session.isActive ? "active" : "inactive"
                  }`}
                >
                  {session.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="session-details">
                <p>IP Address: {session.ipAddress}</p>
                <p>User Agent: {session.userAgent}</p>
                <p>Created: {new Date(session.createdAt).toLocaleString()}</p>
                <p>
                  Last Activity:{" "}
                  {new Date(session.lastActivity).toLocaleString()}
                </p>
              </div>
            </div>

            {session.sessionId !== currentSession?.sessionId && (
              <button
                onClick={() => handleTerminateSession(session.sessionId)}
                disabled={isLoading}
                className="terminate-button"
              >
                Terminate
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
```

## Best Practices

### Authentication Security Guidelines

1. **Token Storage**: Use httpOnly cookies for refresh tokens, memory storage for access tokens
2. **Token Rotation**: Implement automatic token refresh with rotation
3. **Session Management**: Track and manage user sessions across devices
4. **MFA Implementation**: Require MFA for sensitive operations
5. **OAuth Security**: Use PKCE for OAuth flows, validate state parameters
6. **Rate Limiting**: Implement login attempt rate limiting
7. **Password Policies**: Enforce strong password requirements
8. **Audit Logging**: Log all authentication events for security monitoring

### Authentication Testing

```tsx
// Authentication test utilities
const AuthTestUtils = {
  mockAuthProvider: (initialUser: User | null = null) => {
    const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({
      children,
    }) => {
      const [user, setUser] = useState(initialUser);

      return (
        <AuthContext.Provider
          value={{
            user,
            isAuthenticated: !!user,
            isLoading: false,
            login: jest.fn().mockResolvedValue(true),
            logout: jest.fn().mockImplementation(() => setUser(null)),
            refreshAuth: jest.fn(),
          }}
        >
          {children}
        </AuthContext.Provider>
      );
    };

    return MockAuthProvider;
  },

  renderWithAuth: (component: React.ReactElement, user: User | null = null) => {
    const MockProvider = AuthTestUtils.mockAuthProvider(user);
    return render(<MockProvider>{component}</MockProvider>);
  },
};

// Example authentication tests
describe("Authentication", () => {
  describe("JWT Service", () => {
    it("should decode JWT tokens correctly", () => {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
      const payload = JWTAuthService.decodeToken(token);

      expect(payload).toEqual({
        sub: "1234567890",
        name: "John Doe",
        iat: 1516239022,
      });
    });

    it("should detect expired tokens", () => {
      const expiredToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZXhwIjoxNTE2MjM5MDIyfQ.123456";
      const isExpired = JWTAuthService.isTokenExpired(expiredToken);

      expect(isExpired).toBe(true);
    });
  });

  describe("Protected Routes", () => {
    it("should redirect unauthenticated users", () => {
      AuthTestUtils.renderWithAuth(
        <ProtectedRoute element={<div>Protected</div>} />
      );

      expect(screen.queryByText("Protected")).not.toBeInTheDocument();
    });

    it("should render content for authenticated users", () => {
      const user: User = {
        id: "1",
        email: "test@example.com",
        name: "Test User",
        roles: [],
      };

      AuthTestUtils.renderWithAuth(
        <ProtectedRoute element={<div>Protected Content</div>} />,
        user
      );

      expect(screen.getByText("Protected Content")).toBeInTheDocument();
    });
  });

  describe("OAuth Flow", () => {
    it("should generate secure state and PKCE parameters", async () => {
      const state = OAuthService.generateState();
      const verifier = OAuthService.generateCodeVerifier();
      const challenge = await OAuthService.generateCodeChallenge(verifier);

      expect(state).toHaveLength(44);
      expect(verifier).toHaveLength(112);
      expect(challenge).toMatch(/^[A-Za-z0-9_-]+$/);
    });
  });
});
```

## Interview Questions

### Basic Questions

**Q: What is the difference between authentication and authorization?**

A: Authentication verifies who a user is (identity), while authorization determines what they can access (permissions). Authentication comes first and establishes identity, then authorization checks if that identity has permission for specific resources or actions.

**Q: How do you securely store authentication tokens in React?**

A: Secure token storage options:

- **httpOnly cookies**: Most secure, protected from XSS
- **Memory storage**: Secure but lost on refresh
- **localStorage**: Convenient but vulnerable to XSS
- **sessionStorage**: Similar to localStorage but cleared on tab close

Best practice is httpOnly cookies for refresh tokens and memory/state for access tokens.

**Q: What is JWT and how does it work?**

A: JSON Web Token (JWT) is a compact, URL-safe token format consisting of three parts: header, payload, and signature. It's stateless, self-contained, and can be verified without server-side storage. JWTs are commonly used for authentication and information exchange.

### Intermediate Questions

**Q: How do you implement automatic token refresh in React?**

A: Automatic token refresh involves:

- Monitoring token expiration times
- Setting up timers to refresh before expiration
- Implementing retry logic with exponential backoff
- Handling concurrent requests during refresh
- Using refresh tokens to obtain new access tokens

**Q: What is OAuth2 and how do you implement it securely?**

A: OAuth2 is an authorization framework allowing third-party access without exposing credentials. Secure implementation includes:

- Using PKCE (Proof Key for Code Exchange) for public clients
- Validating state parameters to prevent CSRF
- Implementing proper redirect URI validation
- Using secure random generators for state and code verifiers

**Q: How do you implement role-based access control?**

A: RBAC implementation involves:

- Defining roles and permissions on the backend
- Creating permission checking utilities and hooks
- Implementing route guards and component wrappers
- Using context providers for user permissions
- Creating reusable authorization components

### Advanced Questions

**Q: How do you implement Multi-Factor Authentication in React?**

A: MFA implementation includes:

- TOTP (Time-based One-Time Password) setup with QR codes
- Backup code generation and storage
- MFA verification flows and UI components
- Integration with authentication flows
- Graceful fallback handling for MFA failures

**Q: How do you handle session management across multiple devices?**

A: Session management involves:

- Tracking active sessions with metadata
- Providing session termination capabilities
- Implementing concurrent session limits
- Monitoring for suspicious session activities
- Synchronizing session state across tabs/windows

**Q: How do you implement secure password reset flows?**

A: Secure password reset includes:

- Generating cryptographically secure reset tokens
- Implementing token expiration and single-use policies
- Using email verification for identity confirmation
- Rate limiting reset requests
- Logging security events for monitoring
