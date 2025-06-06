# Security in System Design

## Security Fundamentals

### Security Principles

#### Defense in Depth

- **Multiple Security Layers**: No single point of failure
- **Redundant Controls**: Overlapping security measures
- **Fail-Safe Defaults**: Secure by default configuration
- **Least Privilege**: Minimum necessary access rights

#### Zero Trust Architecture

- **Never Trust, Always Verify**: Verify every request
- **Assume Breach**: Design for compromise scenarios
- **Least Privilege Access**: Minimal access by default
- **Continuous Verification**: Ongoing authentication and authorization

#### Security by Design

- **Threat Modeling**: Identify threats early in design
- **Secure Coding Practices**: Prevent vulnerabilities
- **Regular Security Reviews**: Ongoing security assessment
- **Privacy by Design**: Built-in privacy protection

### Common Security Threats

#### OWASP Top 10 (2021)

1. **Broken Access Control**

   - Elevation of privilege
   - Viewing sensitive data
   - Modifying or destroying data

2. **Cryptographic Failures**

   - Weak encryption algorithms
   - Poor key management
   - Data exposure in transit/rest

3. **Injection**

   - SQL injection
   - NoSQL injection
   - Command injection
   - LDAP injection

4. **Insecure Design**

   - Missing security controls
   - Ineffective security controls
   - Threat modeling failures

5. **Security Misconfiguration**

   - Default configurations
   - Incomplete configurations
   - Overly permissive settings

6. **Vulnerable Components**

   - Outdated libraries
   - Unpatched dependencies
   - Insecure third-party components

7. **Identification and Authentication Failures**

   - Weak passwords
   - Session management flaws
   - Credential stuffing attacks

8. **Software and Data Integrity Failures**

   - Unsigned software updates
   - Insecure CI/CD pipelines
   - Supply chain attacks

9. **Security Logging and Monitoring Failures**

   - Insufficient logging
   - Poor incident response
   - Lack of real-time monitoring

10. **Server-Side Request Forgery (SSRF)**
    - Unauthorized server requests
    - Internal network scanning
    - Cloud metadata access

## Authentication and Authorization

### Authentication Methods

#### Password-Based Authentication

```javascript
// Secure password handling
const bcrypt = require("bcrypt");

class AuthService {
  async hashPassword(password) {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  async verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  async authenticateUser(email, password) {
    const user = await User.findByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValid = await this.verifyPassword(password, user.passwordHash);
    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    return user;
  }
}
```

#### Multi-Factor Authentication (MFA)

```javascript
// TOTP-based MFA
const speakeasy = require("speakeasy");

class MFAService {
  generateSecret(userEmail) {
    return speakeasy.generateSecret({
      name: "Your App",
      account: userEmail,
      issuer: "Your Company",
    });
  }

  verifyToken(secret, token) {
    return speakeasy.totp.verify({
      secret: secret,
      encoding: "base32",
      token: token,
      window: 2, // Allow 2 time steps tolerance
    });
  }

  async authenticateWithMFA(userId, password, mfaToken) {
    // First factor: password
    const user = await this.authenticateUser(userId, password);

    // Second factor: TOTP
    const isValidMFA = this.verifyToken(user.mfaSecret, mfaToken);
    if (!isValidMFA) {
      throw new Error("Invalid MFA token");
    }

    return user;
  }
}
```

#### Certificate-Based Authentication

```javascript
// Client certificate authentication
const https = require("https");
const fs = require("fs");

const server = https.createServer(
  {
    key: fs.readFileSync("server-key.pem"),
    cert: fs.readFileSync("server-cert.pem"),
    ca: fs.readFileSync("ca-cert.pem"),
    requestCert: true,
    rejectUnauthorized: true,
  },
  (req, res) => {
    const cert = req.connection.getPeerCertificate();

    if (req.client.authorized) {
      res.writeHead(200);
      res.end(`Hello ${cert.subject.CN}`);
    } else {
      res.writeHead(401);
      res.end("Unauthorized");
    }
  }
);
```

### JSON Web Tokens (JWT)

#### JWT Structure and Implementation

```javascript
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

class JWTService {
  constructor() {
    this.secretKey =
      process.env.JWT_SECRET || crypto.randomBytes(64).toString("hex");
    this.refreshSecretKey =
      process.env.JWT_REFRESH_SECRET || crypto.randomBytes(64).toString("hex");
  }

  generateTokens(user) {
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
      permissions: user.permissions,
    };

    const accessToken = jwt.sign(payload, this.secretKey, {
      expiresIn: "15m",
      issuer: "your-app",
      audience: "your-app-users",
    });

    const refreshToken = jwt.sign({ sub: user.id }, this.refreshSecretKey, {
      expiresIn: "7d",
    });

    return { accessToken, refreshToken };
  }

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, this.secretKey);
    } catch (error) {
      throw new Error("Invalid token");
    }
  }

  async refreshTokens(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, this.refreshSecretKey);
      const user = await User.findById(decoded.sub);

      if (!user) {
        throw new Error("User not found");
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new Error("Invalid refresh token");
    }
  }
}
```

#### JWT Security Considerations

```javascript
// Secure JWT middleware
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwtService.verifyAccessToken(token);

    // Check token blacklist (for logout functionality)
    if (await TokenBlacklist.isBlacklisted(token)) {
      return res.status(401).json({ error: 'Token has been revoked' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}
```

### OAuth 2.0 and OpenID Connect

#### OAuth 2.0 Authorization Code Flow

```javascript
// OAuth 2.0 implementation
class OAuthService {
  generateAuthorizationUrl(clientId, redirectUri, scopes) {
    const params = new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: scopes.join(" "),
      state: crypto.randomBytes(32).toString("hex"),
    });

    return `https://auth-server.com/authorize?${params.toString()}`;
  }

  async exchangeCodeForTokens(code, clientId, clientSecret, redirectUri) {
    const response = await fetch("https://auth-server.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${clientId}:${clientSecret}`
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      throw new Error("Token exchange failed");
    }

    return await response.json();
  }
}
```

#### OpenID Connect Implementation

```javascript
// OpenID Connect ID token validation
const jose = require("jose");

class OpenIDConnectService {
  async validateIdToken(idToken, issuer, audience) {
    try {
      // Get JWKS from the issuer
      const JWKS = jose.createRemoteJWKSet(
        new URL(`${issuer}/.well-known/jwks.json`)
      );

      // Verify and decode the token
      const { payload } = await jose.jwtVerify(idToken, JWKS, {
        issuer: issuer,
        audience: audience,
      });

      // Additional validation
      if (payload.exp < Date.now() / 1000) {
        throw new Error("Token expired");
      }

      return payload;
    } catch (error) {
      throw new Error("Invalid ID token");
    }
  }
}
```

### Role-Based Access Control (RBAC)

#### RBAC Implementation

```javascript
class RBACService {
  constructor() {
    this.permissions = new Map();
    this.roles = new Map();
    this.userRoles = new Map();
  }

  definePermission(name, description) {
    this.permissions.set(name, { name, description });
  }

  defineRole(name, permissions) {
    this.roles.set(name, { name, permissions: new Set(permissions) });
  }

  assignRole(userId, roleName) {
    if (!this.userRoles.has(userId)) {
      this.userRoles.set(userId, new Set());
    }
    this.userRoles.get(userId).add(roleName);
  }

  hasPermission(userId, permission) {
    const userRoles = this.userRoles.get(userId) || new Set();

    for (const roleName of userRoles) {
      const role = this.roles.get(roleName);
      if (role && role.permissions.has(permission)) {
        return true;
      }
    }

    return false;
  }

  // Middleware for permission checking
  requirePermission(permission) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      if (!this.hasPermission(req.user.sub, permission)) {
        return res.status(403).json({ error: "Insufficient permissions" });
      }

      next();
    };
  }
}

// Usage example
const rbac = new RBACService();

// Define permissions
rbac.definePermission("users:read", "Read user data");
rbac.definePermission("users:write", "Create and update users");
rbac.definePermission("admin:all", "Full administrative access");

// Define roles
rbac.defineRole("viewer", ["users:read"]);
rbac.defineRole("editor", ["users:read", "users:write"]);
rbac.defineRole("admin", ["users:read", "users:write", "admin:all"]);

// Protect routes
app.get(
  "/users",
  authenticateJWT,
  rbac.requirePermission("users:read"),
  getUsersHandler
);
app.post(
  "/users",
  authenticateJWT,
  rbac.requirePermission("users:write"),
  createUserHandler
);
```

### Attribute-Based Access Control (ABAC)

#### ABAC Policy Engine

```javascript
class ABACPolicyEngine {
  constructor() {
    this.policies = [];
  }

  addPolicy(policy) {
    this.policies.push(policy);
  }

  evaluate(subject, resource, action, environment = {}) {
    for (const policy of this.policies) {
      const result = this.evaluatePolicy(
        policy,
        subject,
        resource,
        action,
        environment
      );

      if (result === "Deny") {
        return false;
      }

      if (result === "Permit") {
        return true;
      }
    }

    // Default deny
    return false;
  }

  evaluatePolicy(policy, subject, resource, action, environment) {
    try {
      // Simple rule evaluation (in practice, use a proper policy language)
      const context = { subject, resource, action, environment };
      return policy.rule(context) ? "Permit" : "NotApplicable";
    } catch (error) {
      return "Indeterminate";
    }
  }
}

// Example policies
const abac = new ABACPolicyEngine();

// Policy: Users can read their own data
abac.addPolicy({
  name: "SelfDataRead",
  rule: ({ subject, resource, action }) =>
    action === "read" &&
    resource.type === "user_data" &&
    subject.id === resource.ownerId,
});

// Policy: Managers can read data of their team members
abac.addPolicy({
  name: "ManagerTeamRead",
  rule: ({ subject, resource, action }) =>
    action === "read" &&
    resource.type === "user_data" &&
    subject.role === "manager" &&
    subject.department === resource.department,
});

// Policy: No access outside business hours
abac.addPolicy({
  name: "BusinessHoursOnly",
  rule: ({ environment }) => {
    const hour = new Date().getHours();
    return hour >= 9 && hour <= 17;
  },
});
```

## Data Protection

### Encryption

#### Encryption at Rest

```javascript
const crypto = require("crypto");

class EncryptionService {
  constructor() {
    this.algorithm = "aes-256-gcm";
    this.keyLength = 32;
    this.ivLength = 16;
    this.tagLength = 16;
  }

  generateKey() {
    return crypto.randomBytes(this.keyLength);
  }

  encrypt(data, key) {
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipher(this.algorithm, key, iv);

    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");

    const tag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString("hex"),
      tag: tag.toString("hex"),
    };
  }

  decrypt(encryptedData, key) {
    const decipher = crypto.createDecipher(
      this.algorithm,
      key,
      Buffer.from(encryptedData.iv, "hex")
    );

    decipher.setAuthTag(Buffer.from(encryptedData.tag, "hex"));

    let decrypted = decipher.update(encryptedData.encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  }
}

// Database field encryption
class EncryptedField {
  constructor(encryptionService, key) {
    this.encryptionService = encryptionService;
    this.key = key;
  }

  encrypt(value) {
    if (!value) return null;
    return JSON.stringify(
      this.encryptionService.encrypt(value.toString(), this.key)
    );
  }

  decrypt(encryptedValue) {
    if (!encryptedValue) return null;
    const data = JSON.parse(encryptedValue);
    return this.encryptionService.decrypt(data, this.key);
  }
}
```

#### Encryption in Transit

```javascript
// TLS configuration for Express.js
const https = require("https");
const fs = require("fs");

const tlsOptions = {
  key: fs.readFileSync("private-key.pem"),
  cert: fs.readFileSync("certificate.pem"),

  // TLS version and cipher configuration
  secureProtocol: "TLSv1_2_method",
  ciphers: [
    "ECDHE-RSA-AES128-GCM-SHA256",
    "ECDHE-RSA-AES256-GCM-SHA384",
    "ECDHE-RSA-AES128-SHA256",
    "ECDHE-RSA-AES256-SHA384",
  ].join(":"),

  // Security headers
  honorCipherOrder: true,

  // Client certificate validation (optional)
  requestCert: false,
  rejectUnauthorized: false,
};

const server = https.createServer(tlsOptions, app);
```

### Key Management

#### Key Rotation Strategy

```javascript
class KeyManager {
  constructor() {
    this.keys = new Map();
    this.currentKeyId = null;
  }

  generateNewKey() {
    const keyId = crypto.randomUUID();
    const key = crypto.randomBytes(32);

    this.keys.set(keyId, {
      key,
      created: new Date(),
      status: "active",
    });

    this.currentKeyId = keyId;
    return keyId;
  }

  rotateKey() {
    // Mark current key as deprecated
    if (this.currentKeyId) {
      const currentKey = this.keys.get(this.currentKeyId);
      currentKey.status = "deprecated";
    }

    // Generate new active key
    return this.generateNewKey();
  }

  getKey(keyId) {
    return this.keys.get(keyId)?.key;
  }

  getCurrentKey() {
    return this.getKey(this.currentKeyId);
  }

  // Automated key rotation
  scheduleKeyRotation(intervalDays = 30) {
    setInterval(() => {
      this.rotateKey();
      console.log("Key rotated automatically");
    }, intervalDays * 24 * 60 * 60 * 1000);
  }
}
```

#### Hardware Security Modules (HSM)

```javascript
// Example using AWS CloudHSM
const AWS = require("aws-sdk");

class HSMKeyManager {
  constructor() {
    this.cloudhsm = new AWS.CloudHSMV2();
  }

  async createKey(keySpec) {
    const params = {
      ClusterId: process.env.HSM_CLUSTER_ID,
      KeySpec: keySpec, // 'AES_256', 'RSA_2048', etc.
      KeyUsage: "ENCRYPT_DECRYPT",
    };

    const result = await this.cloudhsm.generateDataKey(params).promise();
    return result.KeyId;
  }

  async encrypt(keyId, plaintext) {
    const params = {
      KeyId: keyId,
      Plaintext: plaintext,
    };

    const result = await this.cloudhsm.encrypt(params).promise();
    return result.CiphertextBlob;
  }

  async decrypt(keyId, ciphertext) {
    const params = {
      KeyId: keyId,
      CiphertextBlob: ciphertext,
    };

    const result = await this.cloudhsm.decrypt(params).promise();
    return result.Plaintext;
  }
}
```

### Data Loss Prevention (DLP)

#### Sensitive Data Detection

```javascript
class DLPService {
  constructor() {
    this.patterns = {
      ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
      creditCard: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
      email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
    };
  }

  scanText(text) {
    const findings = [];

    for (const [type, pattern] of Object.entries(this.patterns)) {
      const matches = text.match(pattern);
      if (matches) {
        findings.push({
          type,
          count: matches.length,
          samples: matches.slice(0, 3), // First 3 matches
        });
      }
    }

    return findings;
  }

  maskSensitiveData(text) {
    let maskedText = text;

    // Mask SSN
    maskedText = maskedText.replace(this.patterns.ssn, "XXX-XX-XXXX");

    // Mask credit card
    maskedText = maskedText.replace(
      this.patterns.creditCard,
      "XXXX-XXXX-XXXX-XXXX"
    );

    // Mask email
    maskedText = maskedText.replace(this.patterns.email, (match) => {
      const [local, domain] = match.split("@");
      return `${local.charAt(0)}***@${domain}`;
    });

    return maskedText;
  }
}

// DLP middleware
function dlpMiddleware(req, res, next) {
  const dlp = new DLPService();

  // Scan request body for sensitive data
  if (req.body) {
    const bodyText = JSON.stringify(req.body);
    const findings = dlp.scanText(bodyText);

    if (findings.length > 0) {
      console.warn("Sensitive data detected in request:", findings);

      // Optionally block the request
      if (findings.some((f) => f.type === "ssn" || f.type === "creditCard")) {
        return res.status(400).json({
          error: "Request contains sensitive data that cannot be processed",
        });
      }
    }
  }

  next();
}
```

## Network Security

### Transport Layer Security (TLS)

#### TLS Best Practices

```javascript
// Express.js with security headers
const helmet = require("helmet");

app.use(
  helmet({
    // Force HTTPS
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },

    // Content Security Policy
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },

    // Other security headers
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    dnsPrefetchControl: false,
    frameguard: { action: "deny" },
    hidePoweredBy: true,
    ieNoOpen: true,
    noSniff: true,
    originAgentCluster: true,
    permittedCrossDomainPolicies: false,
    referrerPolicy: { policy: "no-referrer" },
    xssFilter: true,
  })
);
```

#### Certificate Management

```javascript
// Automated certificate renewal with Let's Encrypt
const acme = require("acme-client");

class CertificateManager {
  constructor() {
    this.client = new acme.Client({
      directoryUrl: acme.directory.letsencrypt.production,
      accountKey: this.getAccountKey(),
    });
  }

  async requestCertificate(domain) {
    const privateKey = await acme.crypto.createPrivateKey();

    const csr = await acme.crypto.createCsr({
      key: privateKey,
      commonName: domain,
      altNames: [`www.${domain}`],
    });

    const cert = await this.client.auto({
      csr,
      email: process.env.ACME_EMAIL,
      termsOfServiceAgreed: true,
      challengeCreateFn: this.createChallenge,
      challengeRemoveFn: this.removeChallenge,
    });

    return {
      privateKey,
      certificate: cert,
    };
  }

  async createChallenge(authz, challenge, keyAuth) {
    // HTTP-01 challenge implementation
    if (challenge.type === "http-01") {
      const challengePath = `/.well-known/acme-challenge/${challenge.token}`;
      // Store challenge response for verification
      this.storeChallengeResponse(challengePath, keyAuth);
    }
  }

  async removeChallenge(authz, challenge) {
    // Clean up challenge response
    const challengePath = `/.well-known/acme-challenge/${challenge.token}`;
    this.removeChallengeResponse(challengePath);
  }
}
```

### Web Application Firewall (WAF)

#### Custom WAF Implementation

```javascript
class WAFMiddleware {
  constructor() {
    this.rules = [
      this.sqlInjectionRule,
      this.xssRule,
      this.rateLimitRule,
      this.geoBlockingRule,
    ];
  }

  middleware() {
    return async (req, res, next) => {
      try {
        for (const rule of this.rules) {
          const result = await rule(req);
          if (result.block) {
            this.logSecurityEvent(req, result);
            return res.status(403).json({
              error: "Request blocked by security policy",
              reason: result.reason,
            });
          }
        }
        next();
      } catch (error) {
        console.error("WAF error:", error);
        next();
      }
    };
  }

  sqlInjectionRule(req) {
    const sqlPatterns = [
      /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
      /(\%27)|(\')|((\%3D)|(=))[^\n]*((\%27)|(\'))/i,
      /(((\%3C)|<)((\%2F)|\/)*[a-z0-9\%]+((\%3E)|>))/i,
      /((\%3C)|<)((\%69)|i|(\%49))((\%6D)|m|(\%4D))((\%67)|g|(\%47))[^\n]+((\%3E)|>)/i,
    ];

    const checkText =
      JSON.stringify(req.body) + req.url + JSON.stringify(req.query);

    for (const pattern of sqlPatterns) {
      if (pattern.test(checkText)) {
        return { block: true, reason: "SQL injection attempt detected" };
      }
    }

    return { block: false };
  }

  xssRule(req) {
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe[^>]*>.*?<\/iframe>/gi,
    ];

    const checkText = JSON.stringify(req.body) + JSON.stringify(req.query);

    for (const pattern of xssPatterns) {
      if (pattern.test(checkText)) {
        return { block: true, reason: "XSS attempt detected" };
      }
    }

    return { block: false };
  }

  async rateLimitRule(req) {
    const key = req.ip;
    const limit = 100; // requests per minute
    const window = 60 * 1000; // 1 minute

    const count = await this.getRateLimitCount(key, window);

    if (count > limit) {
      return { block: true, reason: "Rate limit exceeded" };
    }

    await this.incrementRateLimitCount(key, window);
    return { block: false };
  }

  geoBlockingRule(req) {
    const blockedCountries = ["CN", "RU", "KP"]; // Example blocked countries
    const country = this.getCountryFromIP(req.ip);

    if (blockedCountries.includes(country)) {
      return { block: true, reason: "Geographic restriction" };
    }

    return { block: false };
  }

  logSecurityEvent(req, result) {
    console.log({
      timestamp: new Date().toISOString(),
      type: "security_block",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      url: req.url,
      method: req.method,
      reason: result.reason,
      headers: req.headers,
      body: req.body,
    });
  }
}
```

### API Security

#### Rate Limiting

```javascript
// Redis-based rate limiting
const redis = require("redis");

class RateLimiter {
  constructor() {
    this.client = redis.createClient();
  }

  async isRateLimited(key, limit, windowMs) {
    const now = Date.now();
    const window = Math.floor(now / windowMs);
    const redisKey = `rate_limit:${key}:${window}`;

    const current = await this.client.incr(redisKey);

    if (current === 1) {
      await this.client.expire(redisKey, Math.ceil(windowMs / 1000));
    }

    return current > limit;
  }

  middleware(limit, windowMs) {
    return async (req, res, next) => {
      const key = req.ip; // or req.user.id for authenticated users

      const isLimited = await this.isRateLimited(key, limit, windowMs);

      if (isLimited) {
        return res.status(429).json({
          error: "Rate limit exceeded",
          retryAfter: Math.ceil(windowMs / 1000),
        });
      }

      next();
    };
  }
}

// Usage
const rateLimiter = new RateLimiter();
app.use("/api/", rateLimiter.middleware(100, 60000)); // 100 requests per minute
```

#### API Key Management

```javascript
class APIKeyManager {
  constructor() {
    this.keys = new Map();
  }

  generateAPIKey(userId, permissions = [], expiresAt = null) {
    const key = crypto.randomBytes(32).toString("hex");
    const hashedKey = crypto.createHash("sha256").update(key).digest("hex");

    this.keys.set(hashedKey, {
      userId,
      permissions,
      createdAt: new Date(),
      expiresAt,
      lastUsed: null,
      usageCount: 0,
    });

    return key; // Return unhashed key to user
  }

  async validateAPIKey(apiKey) {
    const hashedKey = crypto.createHash("sha256").update(apiKey).digest("hex");
    const keyInfo = this.keys.get(hashedKey);

    if (!keyInfo) {
      throw new Error("Invalid API key");
    }

    if (keyInfo.expiresAt && keyInfo.expiresAt < new Date()) {
      throw new Error("API key expired");
    }

    // Update usage statistics
    keyInfo.lastUsed = new Date();
    keyInfo.usageCount++;

    return keyInfo;
  }

  middleware() {
    return async (req, res, next) => {
      const apiKey = req.headers["x-api-key"] || req.query.api_key;

      if (!apiKey) {
        return res.status(401).json({ error: "API key required" });
      }

      try {
        const keyInfo = await this.validateAPIKey(apiKey);
        req.apiKey = keyInfo;
        next();
      } catch (error) {
        return res.status(401).json({ error: error.message });
      }
    };
  }
}
```

## Input Validation and Sanitization

### Server-Side Validation

#### Schema Validation with Joi

```javascript
const Joi = require("joi");

const schemas = {
  createUser: Joi.object({
    name: Joi.string().min(1).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
      )
      .required()
      .messages({
        "string.pattern.base":
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      }),
    age: Joi.number().integer().min(0).max(150),
    phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/),
  }),

  updateUser: Joi.object({
    name: Joi.string().min(1).max(100),
    email: Joi.string().email(),
    age: Joi.number().integer().min(0).max(150),
    phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/),
  }).min(1), // At least one field required

  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    sort: Joi.string().valid(
      "name",
      "email",
      "created_at",
      "-name",
      "-email",
      "-created_at"
    ),
  }),
};

function validateRequest(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Request validation failed",
          details,
        },
      });
    }

    req.body = value;
    next();
  };
}

// Usage
app.post("/users", validateRequest(schemas.createUser), createUserHandler);
```

### Input Sanitization

#### HTML Sanitization

```javascript
const DOMPurify = require("isomorphic-dompurify");

class InputSanitizer {
  sanitizeHTML(input) {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ["p", "br", "strong", "em", "ul", "ol", "li"],
      ALLOWED_ATTR: [],
    });
  }

  sanitizeString(input) {
    if (typeof input !== "string") return input;

    return input
      .trim()
      .replace(/[<>]/g, "") // Remove potential HTML tags
      .replace(/[&]/g, "&amp;")
      .replace(/['"]/g, ""); // Remove quotes to prevent injection
  }

  sanitizeEmail(email) {
    if (typeof email !== "string") return "";

    return email
      .toLowerCase()
      .trim()
      .replace(/[^\w\.\-@]/g, ""); // Keep only valid email characters
  }

  sanitizeFilename(filename) {
    if (typeof filename !== "string") return "";

    return filename
      .replace(/[^\w\.\-]/g, "_") // Replace invalid characters with underscore
      .replace(/\.{2,}/g, ".") // Prevent directory traversal
      .substring(0, 255); // Limit length
  }

  middleware() {
    return (req, res, next) => {
      if (req.body) {
        req.body = this.sanitizeObject(req.body);
      }

      if (req.query) {
        req.query = this.sanitizeObject(req.query);
      }

      next();
    };
  }

  sanitizeObject(obj) {
    if (typeof obj !== "object" || obj === null) {
      return this.sanitizeString(obj);
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.sanitizeObject(item));
    }

    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      const sanitizedKey = this.sanitizeString(key);
      sanitized[sanitizedKey] = this.sanitizeObject(value);
    }

    return sanitized;
  }
}
```

### SQL Injection Prevention

#### Parameterized Queries

```javascript
// Safe database queries using parameterized statements
class UserRepository {
  constructor(db) {
    this.db = db;
  }

  async findByEmail(email) {
    // Safe: parameterized query
    const query = "SELECT * FROM users WHERE email = ?";
    const [rows] = await this.db.execute(query, [email]);
    return rows[0];
  }

  async findByFilters(filters) {
    let query = "SELECT * FROM users WHERE 1=1";
    const params = [];

    if (filters.name) {
      query += " AND name LIKE ?";
      params.push(`%${filters.name}%`);
    }

    if (filters.status) {
      query += " AND status = ?";
      params.push(filters.status);
    }

    if (filters.createdAfter) {
      query += " AND created_at > ?";
      params.push(filters.createdAfter);
    }

    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    params.push(filters.limit || 20, filters.offset || 0);

    const [rows] = await this.db.execute(query, params);
    return rows;
  }

  async create(userData) {
    const query = `
      INSERT INTO users (name, email, password_hash, created_at)
      VALUES (?, ?, ?, NOW())
    `;

    const [result] = await this.db.execute(query, [
      userData.name,
      userData.email,
      userData.passwordHash,
    ]);

    return result.insertId;
  }
}
```

## Security Monitoring and Incident Response

### Security Logging

#### Comprehensive Security Logging

```javascript
const winston = require("winston");

class SecurityLogger {
  constructor() {
    this.logger = winston.createLogger({
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({ filename: "security.log" }),
        new winston.transports.File({ filename: "error.log", level: "error" }),
      ],
    });
  }

  logAuthenticationAttempt(req, success, userId = null) {
    this.logger.info("authentication_attempt", {
      success,
      userId,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      timestamp: new Date().toISOString(),
      email: req.body.email, // Be careful not to log passwords
    });
  }

  logAuthorizationFailure(req, resource, action) {
    this.logger.warn("authorization_failure", {
      userId: req.user?.id,
      resource,
      action,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      url: req.url,
      timestamp: new Date().toISOString(),
    });
  }

  logSuspiciousActivity(req, type, details) {
    this.logger.warn("suspicious_activity", {
      type,
      details,
      userId: req.user?.id,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      url: req.url,
      headers: req.headers,
      timestamp: new Date().toISOString(),
    });
  }

  logDataAccess(req, resource, action, success) {
    this.logger.info("data_access", {
      resource,
      action,
      success,
      userId: req.user?.id,
      ip: req.ip,
      timestamp: new Date().toISOString(),
    });
  }

  logSecurityIncident(severity, type, description, metadata = {}) {
    this.logger.error("security_incident", {
      severity,
      type,
      description,
      metadata,
      timestamp: new Date().toISOString(),
    });
  }
}
```

### Intrusion Detection

#### Anomaly Detection System

```javascript
class IntrusionDetectionSystem {
  constructor() {
    this.userBehaviorProfiles = new Map();
    this.securityLogger = new SecurityLogger();
  }

  analyzeRequest(req) {
    const userId = req.user?.id;
    if (!userId) return;

    const profile = this.getUserProfile(userId);
    const currentBehavior = this.extractBehaviorMetrics(req);

    // Analyze for anomalies
    const anomalies = this.detectAnomalies(profile, currentBehavior);

    if (anomalies.length > 0) {
      this.handleAnomalies(req, anomalies);
    }

    // Update user profile
    this.updateProfile(userId, currentBehavior);
  }

  getUserProfile(userId) {
    if (!this.userBehaviorProfiles.has(userId)) {
      this.userBehaviorProfiles.set(userId, {
        normalRequestRate: 0,
        typicalLocations: new Set(),
        usualUserAgents: new Set(),
        commonEndpoints: new Map(),
        loginTimes: [],
      });
    }

    return this.userBehaviorProfiles.get(userId);
  }

  extractBehaviorMetrics(req) {
    return {
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      endpoint: req.path,
      method: req.method,
      timestamp: new Date(),
      requestSize: JSON.stringify(req.body).length,
    };
  }

  detectAnomalies(profile, currentBehavior) {
    const anomalies = [];

    // Check for unusual location
    if (!profile.typicalLocations.has(currentBehavior.ip)) {
      if (profile.typicalLocations.size > 0) {
        anomalies.push({
          type: "unusual_location",
          severity: "medium",
          details: `Login from new IP: ${currentBehavior.ip}`,
        });
      }
    }

    // Check for unusual user agent
    if (!profile.usualUserAgents.has(currentBehavior.userAgent)) {
      if (profile.usualUserAgents.size > 0) {
        anomalies.push({
          type: "unusual_user_agent",
          severity: "low",
          details: `New user agent: ${currentBehavior.userAgent}`,
        });
      }
    }

    // Check for unusual access patterns
    const endpointCount =
      profile.commonEndpoints.get(currentBehavior.endpoint) || 0;
    if (endpointCount === 0 && profile.commonEndpoints.size > 10) {
      anomalies.push({
        type: "unusual_endpoint",
        severity: "low",
        details: `Accessing unusual endpoint: ${currentBehavior.endpoint}`,
      });
    }

    return anomalies;
  }

  handleAnomalies(req, anomalies) {
    for (const anomaly of anomalies) {
      this.securityLogger.logSuspiciousActivity(
        req,
        anomaly.type,
        anomaly.details
      );

      if (anomaly.severity === "high") {
        // Immediate action required
        this.triggerSecurityResponse(req, anomaly);
      }
    }
  }

  triggerSecurityResponse(req, anomaly) {
    // Send alert to security team
    this.sendSecurityAlert(anomaly);

    // Temporarily limit user access
    this.addToSuspiciousUsersList(req.user.id);

    // Require additional authentication
    req.requireMFA = true;
  }

  updateProfile(userId, behavior) {
    const profile = this.getUserProfile(userId);

    profile.typicalLocations.add(behavior.ip);
    profile.usualUserAgents.add(behavior.userAgent);

    const endpointCount = profile.commonEndpoints.get(behavior.endpoint) || 0;
    profile.commonEndpoints.set(behavior.endpoint, endpointCount + 1);

    // Keep only recent data
    if (profile.typicalLocations.size > 10) {
      const locationsArray = Array.from(profile.typicalLocations);
      profile.typicalLocations = new Set(locationsArray.slice(-10));
    }
  }
}
```

### Incident Response

#### Automated Incident Response

```javascript
class IncidentResponseSystem {
  constructor() {
    this.incidentQueue = [];
    this.responseHandlers = new Map();
    this.setupHandlers();
  }

  setupHandlers() {
    this.responseHandlers.set(
      "sql_injection",
      this.handleSQLInjection.bind(this)
    );
    this.responseHandlers.set("xss_attempt", this.handleXSSAttempt.bind(this));
    this.responseHandlers.set("brute_force", this.handleBruteForce.bind(this));
    this.responseHandlers.set("data_breach", this.handleDataBreach.bind(this));
  }

  reportIncident(type, severity, source, details) {
    const incident = {
      id: crypto.randomUUID(),
      type,
      severity,
      source,
      details,
      timestamp: new Date(),
      status: "new",
      actions: [],
    };

    this.incidentQueue.push(incident);
    this.processIncident(incident);

    return incident.id;
  }

  async processIncident(incident) {
    const handler = this.responseHandlers.get(incident.type);

    if (handler) {
      try {
        await handler(incident);
        incident.status = "handled";
      } catch (error) {
        console.error("Incident handling failed:", error);
        incident.status = "failed";
      }
    } else {
      incident.status = "unhandled";
      this.escalateIncident(incident);
    }
  }

  async handleSQLInjection(incident) {
    // Immediate actions
    await this.blockIP(incident.source.ip);
    await this.alertSecurityTeam(incident);

    // Log action
    incident.actions.push({
      type: "ip_blocked",
      timestamp: new Date(),
      details: `Blocked IP ${incident.source.ip} for SQL injection attempt`,
    });

    // Check for data integrity
    await this.initiateDataIntegrityCheck();
  }

  async handleBruteForce(incident) {
    // Block IP and user account
    await this.blockIP(incident.source.ip);
    await this.temporarilyLockAccount(incident.source.userId);

    // Require additional authentication
    await this.requireMFAForUser(incident.source.userId);

    incident.actions.push({
      type: "account_locked",
      timestamp: new Date(),
      details: `Account ${incident.source.userId} temporarily locked due to brute force attack`,
    });
  }

  async handleDataBreach(incident) {
    // Critical incident - immediate escalation
    await this.escalateIncident(incident);

    // Activate breach response protocol
    await this.activateBreachProtocol();

    // Notify affected users
    await this.notifyAffectedUsers(incident.details.affectedUsers);

    // Preserve evidence
    await this.preserveForensicEvidence(incident);
  }

  async blockIP(ip) {
    // Add to firewall blacklist
    console.log(`Blocking IP: ${ip}`);
    // Implementation depends on infrastructure
  }

  async alertSecurityTeam(incident) {
    // Send immediate alert to security team
    const message = {
      to: "security-team@company.com",
      subject: `Security Incident: ${incident.type}`,
      body: `Incident ID: ${incident.id}\nSeverity: ${
        incident.severity
      }\nDetails: ${JSON.stringify(incident.details, null, 2)}`,
    };

    // Send email, Slack message, SMS, etc.
    await this.sendAlert(message);
  }

  async escalateIncident(incident) {
    // Escalate to senior security personnel
    incident.status = "escalated";

    const escalationMessage = {
      to: "security-lead@company.com",
      subject: `ESCALATED Security Incident: ${incident.type}`,
      body: `This incident requires immediate attention.\nIncident ID: ${incident.id}\n...`,
    };

    await this.sendAlert(escalationMessage);
  }
}
```

## Compliance and Governance

### GDPR Compliance

#### Data Privacy Implementation

```javascript
class GDPRComplianceService {
  constructor() {
    this.consentManager = new ConsentManager();
    this.dataProcessor = new DataProcessor();
  }

  async requestConsent(userId, purposes) {
    return await this.consentManager.requestConsent(userId, purposes);
  }

  async checkConsent(userId, purpose) {
    return await this.consentManager.hasValidConsent(userId, purpose);
  }

  async processDataSubjectRequest(requestType, userId, details) {
    switch (requestType) {
      case "access":
        return await this.handleDataAccess(userId);
      case "rectification":
        return await this.handleDataRectification(userId, details);
      case "erasure":
        return await this.handleDataErasure(userId);
      case "portability":
        return await this.handleDataPortability(userId);
      default:
        throw new Error("Unknown request type");
    }
  }

  async handleDataAccess(userId) {
    // Collect all personal data for the user
    const userData = await this.dataProcessor.collectUserData(userId);

    return {
      personalData: userData,
      processingPurposes: await this.getProcessingPurposes(userId),
      dataRetentionPeriod: await this.getRetentionPeriod(userId),
      thirdPartySharing: await this.getThirdPartySharing(userId),
    };
  }

  async handleDataErasure(userId) {
    // Check if erasure is legally permissible
    const canErase = await this.checkErasurePermissibility(userId);

    if (!canErase.allowed) {
      throw new Error(canErase.reason);
    }

    // Anonymize or delete user data
    await this.dataProcessor.anonymizeUserData(userId);

    // Log the erasure action
    await this.logDataProcessingActivity("erasure", userId);

    return { success: true, erasedAt: new Date() };
  }
}

class ConsentManager {
  async requestConsent(userId, purposes) {
    const consentRecord = {
      userId,
      purposes,
      timestamp: new Date(),
      method: "explicit_opt_in",
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    };

    await this.storeConsentRecord(consentRecord);
    return consentRecord;
  }

  async hasValidConsent(userId, purpose) {
    const consent = await this.getLatestConsent(userId, purpose);

    if (!consent) return false;

    // Check if consent is still valid (not withdrawn, not expired)
    return consent.status === "active" && new Date() < consent.expiresAt;
  }
}
```

### Security Audit and Assessment

#### Security Assessment Framework

```javascript
class SecurityAssessment {
  constructor() {
    this.checks = [
      this.checkAuthentication,
      this.checkAuthorization,
      this.checkEncryption,
      this.checkInputValidation,
      this.checkLogging,
      this.checkNetworkSecurity,
    ];
  }

  async runAssessment() {
    const results = {
      timestamp: new Date(),
      overall: "unknown",
      checks: [],
      recommendations: [],
    };

    for (const check of this.checks) {
      try {
        const result = await check();
        results.checks.push(result);

        if (result.recommendations) {
          results.recommendations.push(...result.recommendations);
        }
      } catch (error) {
        results.checks.push({
          name: check.name,
          status: "error",
          error: error.message,
        });
      }
    }

    results.overall = this.calculateOverallScore(results.checks);
    return results;
  }

  async checkAuthentication() {
    const checks = [
      await this.checkPasswordPolicy(),
      await this.checkMFAImplementation(),
      await this.checkSessionManagement(),
      await this.checkAccountLockout(),
    ];

    return {
      name: "Authentication",
      status: checks.every((c) => c.passed) ? "pass" : "fail",
      details: checks,
      recommendations: checks
        .filter((c) => !c.passed)
        .map((c) => c.recommendation),
    };
  }

  async checkPasswordPolicy() {
    // Check if strong password policy is enforced
    const policy = await this.getPasswordPolicy();

    const requirements = {
      minLength: policy.minLength >= 8,
      requiresUppercase: policy.requiresUppercase,
      requiresLowercase: policy.requiresLowercase,
      requiresNumbers: policy.requiresNumbers,
      requiresSymbols: policy.requiresSymbols,
    };

    const passed = Object.values(requirements).every((req) => req);

    return {
      name: "Password Policy",
      passed,
      details: requirements,
      recommendation: passed
        ? null
        : "Implement stronger password requirements",
    };
  }

  async checkEncryption() {
    const checks = [
      await this.checkTLSConfiguration(),
      await this.checkDataAtRestEncryption(),
      await this.checkKeyManagement(),
    ];

    return {
      name: "Encryption",
      status: checks.every((c) => c.passed) ? "pass" : "fail",
      details: checks,
      recommendations: checks
        .filter((c) => !c.passed)
        .map((c) => c.recommendation),
    };
  }

  calculateOverallScore(checks) {
    const passed = checks.filter((c) => c.status === "pass").length;
    const total = checks.length;
    const percentage = (passed / total) * 100;

    if (percentage >= 90) return "excellent";
    if (percentage >= 80) return "good";
    if (percentage >= 70) return "fair";
    return "poor";
  }
}
```

## Security Best Practices Summary

### Development Practices

- **Secure by Default**: Use secure configurations as defaults
- **Fail Securely**: Ensure failures don't compromise security
- **Defense in Depth**: Multiple layers of security controls
- **Least Privilege**: Minimum necessary access rights
- **Input Validation**: Validate and sanitize all inputs
- **Output Encoding**: Properly encode outputs to prevent injection

### Authentication Best Practices

- **Strong Password Policies**: Enforce complex passwords
- **Multi-Factor Authentication**: Require additional verification
- **Session Management**: Secure session handling and timeout
- **Account Lockout**: Prevent brute force attacks
- **Regular Security Reviews**: Periodic assessment of auth systems

### Data Protection

- **Encryption Everywhere**: Encrypt data in transit and at rest
- **Key Management**: Secure key storage and rotation
- **Data Classification**: Identify and protect sensitive data
- **Access Controls**: Implement proper authorization
- **Data Minimization**: Collect only necessary data

### Operational Security

- **Security Monitoring**: Continuous monitoring and alerting
- **Incident Response**: Prepared response procedures
- **Regular Updates**: Keep software and dependencies current
- **Security Training**: Educate development and operations teams
- **Compliance**: Meet regulatory and industry requirements
