# API Design and Architecture

## REST API Design

### REST Principles

#### Stateless

- Each request contains all information needed to process it
- Server doesn't store client context between requests
- Improves scalability and reliability
- Enables horizontal scaling and load balancing

#### Client-Server Architecture

- Clear separation between client and server responsibilities
- Client handles user interface and user experience
- Server handles data storage and business logic
- Independent evolution of client and server

#### Cacheable

- Responses should be cacheable when appropriate
- Improves performance and reduces server load
- Use appropriate HTTP cache headers
- Consider cache invalidation strategies

#### Uniform Interface

- Consistent interface between components
- Resource identification through URIs
- Resource manipulation through representations
- Self-descriptive messages
- Hypermedia as the engine of application state (HATEOAS)

#### Layered System

- Architecture can be composed of hierarchical layers
- Each layer only knows about immediate layers
- Intermediary layers (proxies, gateways) are transparent
- Improves scalability and security

### HTTP Methods and Their Usage

#### GET

- **Purpose**: Retrieve resource representation
- **Idempotent**: Yes
- **Safe**: Yes (no side effects)
- **Cacheable**: Yes

```http
GET /api/users/123
GET /api/users?page=1&limit=10
GET /api/users/123/orders
```

#### POST

- **Purpose**: Create new resource or execute action
- **Idempotent**: No
- **Safe**: No
- **Cacheable**: Generally no

```http
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

#### PUT

- **Purpose**: Create or completely replace resource
- **Idempotent**: Yes
- **Safe**: No
- **Cacheable**: No

```http
PUT /api/users/123
Content-Type: application/json

{
  "id": 123,
  "name": "John Smith",
  "email": "john.smith@example.com"
}
```

#### PATCH

- **Purpose**: Partially update resource
- **Idempotent**: Depends on implementation
- **Safe**: No
- **Cacheable**: No

```http
PATCH /api/users/123
Content-Type: application/json

{
  "email": "newemail@example.com"
}
```

#### DELETE

- **Purpose**: Remove resource
- **Idempotent**: Yes
- **Safe**: No
- **Cacheable**: No

```http
DELETE /api/users/123
```

### Resource Design

#### URI Structure

```
Protocol: https://
Host: api.example.com
Base Path: /v1
Resource Path: /users/123/orders/456
Query Parameters: ?status=pending&sort=date
```

#### Resource Naming Conventions

- **Use Nouns**: Resources represent entities, not actions
- **Plural Names**: Collections should use plural nouns
- **Hierarchical Structure**: Reflect resource relationships
- **Lowercase with Hyphens**: Consistent formatting

**Good Examples:**

```
GET /api/users
GET /api/users/123
GET /api/users/123/orders
GET /api/product-categories
```

**Poor Examples:**

```
GET /api/getUsers
GET /api/user
GET /api/Users
GET /api/productCategories
```

#### Resource Relationships

**Nested Resources:**

```
GET /api/users/123/orders          # Orders for specific user
POST /api/users/123/orders         # Create order for user
GET /api/users/123/orders/456      # Specific order for user
```

**Independent Resources with References:**

```
GET /api/orders?user_id=123        # Orders filtered by user
GET /api/orders/456                # Order with user_id field
```

### HTTP Status Codes

#### Success Codes (2xx)

- **200 OK**: Successful GET, PUT, PATCH
- **201 Created**: Successful POST that creates resource
- **202 Accepted**: Request accepted for async processing
- **204 No Content**: Successful DELETE or PUT with no response body

#### Client Error Codes (4xx)

- **400 Bad Request**: Invalid request syntax or validation errors
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Authenticated but not authorized
- **404 Not Found**: Resource doesn't exist
- **409 Conflict**: Resource conflict (duplicate, version mismatch)
- **422 Unprocessable Entity**: Validation errors
- **429 Too Many Requests**: Rate limit exceeded

#### Server Error Codes (5xx)

- **500 Internal Server Error**: Generic server error
- **502 Bad Gateway**: Invalid response from upstream server
- **503 Service Unavailable**: Server temporarily unavailable
- **504 Gateway Timeout**: Upstream server timeout

### Request and Response Design

#### Request Headers

```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
User-Agent: MyApp/1.0
X-Request-ID: 550e8400-e29b-41d4-a716-446655440000
```

#### Response Headers

```http
Content-Type: application/json
Cache-Control: public, max-age=300
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
Location: /api/users/123
X-Rate-Limit-Remaining: 99
X-Request-ID: 550e8400-e29b-41d4-a716-446655440000
```

#### Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid data",
    "details": [
      {
        "field": "email",
        "message": "Email address is required"
      },
      {
        "field": "age",
        "message": "Age must be between 18 and 120"
      }
    ],
    "request_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### API Versioning

#### URL Path Versioning

```http
GET /api/v1/users
GET /api/v2/users
```

**Pros:**

- Clear and explicit
- Easy to implement
- Cacheable

**Cons:**

- URL proliferation
- Multiple API versions to maintain

#### Header Versioning

```http
GET /api/users
Accept: application/vnd.api.v1+json
```

**Pros:**

- Clean URLs
- More RESTful

**Cons:**

- Less visible
- Harder to test manually

#### Query Parameter Versioning

```http
GET /api/users?version=1
GET /api/users?v=2
```

**Pros:**

- Easy to implement
- Backward compatible

**Cons:**

- Clutters query parameters
- Less professional appearance

#### Content Negotiation

```http
GET /api/users
Accept: application/json; version=1
```

**Pros:**

- Most RESTful approach
- Flexible content types

**Cons:**

- Complex implementation
- Less tooling support

### Pagination

#### Offset-Based Pagination

```http
GET /api/users?page=2&limit=20
GET /api/users?offset=20&limit=20
```

**Response:**

```json
{
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total_pages": 15,
    "total_count": 300,
    "has_next": true,
    "has_previous": true
  }
}
```

#### Cursor-Based Pagination

```http
GET /api/users?cursor=eyJpZCI6MTIzfQ&limit=20
```

**Response:**

```json
{
  "data": [...],
  "pagination": {
    "next_cursor": "eyJpZCI6MTQzfQ",
    "previous_cursor": "eyJpZCI6MTAzfQ",
    "has_next": true,
    "has_previous": true
  }
}
```

#### Link Header Pagination (GitHub Style)

```http
Link: <https://api.example.com/users?page=3&limit=20>; rel="next",
      <https://api.example.com/users?page=1&limit=20>; rel="first",
      <https://api.example.com/users?page=15&limit=20>; rel="last"
```

### Filtering, Sorting, and Searching

#### Filtering

```http
GET /api/users?status=active&role=admin
GET /api/orders?created_after=2023-01-01&amount_gt=100
GET /api/products?category=electronics&in_stock=true
```

#### Sorting

```http
GET /api/users?sort=created_at
GET /api/users?sort=-created_at          # Descending
GET /api/users?sort=name,created_at      # Multiple fields
GET /api/users?sort=name,-created_at     # Mixed order
```

#### Searching

```http
GET /api/users?search=john
GET /api/products?q=laptop
GET /api/articles?search=title:api,content:design
```

#### Field Selection

```http
GET /api/users?fields=id,name,email
GET /api/users?include=profile,orders
GET /api/users?exclude=password,internal_notes
```

## GraphQL API Design

### Core Concepts

#### Schema Definition

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
  createdAt: DateTime!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
  publishedAt: DateTime
}

type Query {
  user(id: ID!): User
  users(first: Int, after: String): UserConnection
  post(id: ID!): Post
}

type Mutation {
  createUser(input: CreateUserInput!): User
  updateUser(id: ID!, input: UpdateUserInput!): User
  deleteUser(id: ID!): Boolean
}
```

#### Queries

```graphql
query GetUser {
  user(id: "123") {
    id
    name
    email
    posts {
      id
      title
      publishedAt
    }
  }
}
```

#### Mutations

```graphql
mutation CreateUser {
  createUser(input: { name: "John Doe", email: "john@example.com" }) {
    id
    name
    email
  }
}
```

#### Subscriptions

```graphql
subscription PostUpdates {
  postAdded {
    id
    title
    author {
      name
    }
  }
}
```

### GraphQL Advantages

#### Single Endpoint

- One URL for all operations
- Simplified API surface
- Easier to version and deploy

#### Flexible Data Fetching

- Clients specify exactly what data they need
- Reduces over-fetching and under-fetching
- Multiple resources in single request

#### Strong Type System

- Schema serves as contract
- Automatic validation
- Better tooling and IDE support

#### Real-time Subscriptions

- Built-in support for real-time updates
- WebSocket-based by default
- Efficient update delivery

### GraphQL Challenges

#### Complexity

- Steeper learning curve
- More complex caching
- Query complexity analysis needed

#### Performance Considerations

- N+1 query problem
- Requires DataLoader pattern
- Query depth and complexity limits

#### Caching Difficulties

- HTTP-level caching less effective
- Need for application-level caching
- Cache invalidation complexity

### DataLoader Pattern

```javascript
const userLoader = new DataLoader(async (userIds) => {
  const users = await User.findByIds(userIds);
  return userIds.map((id) => users.find((user) => user.id === id));
});

// In resolver
const resolvers = {
  Post: {
    author: (post) => userLoader.load(post.authorId),
  },
};
```

## RPC API Design

### gRPC

#### Protocol Buffers Schema

```protobuf
syntax = "proto3";

package user.v1;

service UserService {
  rpc GetUser(GetUserRequest) returns (GetUserResponse);
  rpc CreateUser(CreateUserRequest) returns (CreateUserResponse);
  rpc ListUsers(ListUsersRequest) returns (ListUsersResponse);
  rpc UpdateUser(UpdateUserRequest) returns (UpdateUserResponse);
  rpc DeleteUser(DeleteUserRequest) returns (DeleteUserResponse);
}

message User {
  string id = 1;
  string name = 2;
  string email = 3;
  int64 created_at = 4;
}

message GetUserRequest {
  string id = 1;
}

message GetUserResponse {
  User user = 1;
}
```

#### gRPC Advantages

- **High Performance**: Binary protocol, HTTP/2
- **Type Safety**: Strong typing with Protocol Buffers
- **Streaming**: Client, server, and bidirectional streaming
- **Language Agnostic**: Code generation for many languages
- **Built-in Features**: Authentication, load balancing, retries

#### gRPC Disadvantages

- **Limited Browser Support**: Requires proxy for web clients
- **Learning Curve**: Protocol Buffers and gRPC concepts
- **Debugging**: Binary protocol harder to debug
- **Firewalls**: HTTP/2 may be blocked

### JSON-RPC

#### Request Format

```json
{
  "jsonrpc": "2.0",
  "method": "user.create",
  "params": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "id": 1
}
```

#### Response Format

```json
{
  "jsonrpc": "2.0",
  "result": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "id": 1
}
```

#### Error Response

```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32602,
    "message": "Invalid params",
    "data": {
      "field": "email",
      "message": "Invalid email format"
    }
  },
  "id": 1
}
```

## API Security

### Authentication

#### JWT (JSON Web Tokens)

```javascript
// Token structure
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user123",
    "iat": 1516239022,
    "exp": 1516242622,
    "roles": ["user", "admin"]
  },
  "signature": "signature_string"
}
```

**Advantages:**

- Stateless authentication
- Self-contained tokens
- Cross-domain compatibility
- Mobile-friendly

**Considerations:**

- Token revocation complexity
- Token size limitations
- Secure storage requirements

#### OAuth 2.0

**Authorization Code Flow:**

```
1. Client redirects user to authorization server
2. User authenticates and grants permission
3. Authorization server redirects back with code
4. Client exchanges code for access token
5. Client uses access token for API requests
```

**Client Credentials Flow:**

```
1. Client authenticates with authorization server
2. Authorization server returns access token
3. Client uses access token for API requests
```

#### API Keys

```http
GET /api/users
Authorization: Bearer your-api-key-here
X-API-Key: your-api-key-here
```

**Use Cases:**

- Service-to-service authentication
- Rate limiting and quotas
- Simple authentication for public APIs

### Authorization

#### Role-Based Access Control (RBAC)

```json
{
  "user": {
    "id": "123",
    "roles": ["user", "moderator"]
  },
  "roles": {
    "user": ["read:profile", "update:profile"],
    "moderator": ["read:users", "delete:posts"],
    "admin": ["*"]
  }
}
```

#### Attribute-Based Access Control (ABAC)

```json
{
  "subject": {
    "id": "123",
    "department": "engineering",
    "level": "senior"
  },
  "resource": {
    "type": "document",
    "classification": "confidential",
    "owner": "456"
  },
  "action": "read",
  "environment": {
    "time": "business_hours",
    "location": "office"
  }
}
```

### Input Validation and Sanitization

#### Schema Validation

```javascript
// JSON Schema example
const userSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      minLength: 1,
      maxLength: 100,
    },
    email: {
      type: "string",
      format: "email",
    },
    age: {
      type: "integer",
      minimum: 0,
      maximum: 150,
    },
  },
  required: ["name", "email"],
  additionalProperties: false,
};
```

#### SQL Injection Prevention

```javascript
// BAD - Vulnerable to SQL injection
const query = `SELECT * FROM users WHERE email = '${email}'`;

// GOOD - Using parameterized queries
const query = "SELECT * FROM users WHERE email = ?";
db.query(query, [email]);
```

#### XSS Prevention

```javascript
// HTML encoding
function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
```

### Rate Limiting

#### Fixed Window Rate Limiting

```javascript
const rateLimits = new Map();

function fixedWindowRateLimit(key, limit, windowMs) {
  const now = Date.now();
  const windowStart = Math.floor(now / windowMs) * windowMs;
  const windowKey = `${key}:${windowStart}`;

  const current = rateLimits.get(windowKey) || 0;

  if (current >= limit) {
    throw new Error("Rate limit exceeded");
  }

  rateLimits.set(windowKey, current + 1);
}
```

#### Sliding Window Rate Limiting

```javascript
function slidingWindowRateLimit(key, limit, windowMs) {
  const now = Date.now();
  const requests = rateLimits.get(key) || [];

  // Remove old requests outside the window
  const validRequests = requests.filter((time) => now - time < windowMs);

  if (validRequests.length >= limit) {
    throw new Error("Rate limit exceeded");
  }

  validRequests.push(now);
  rateLimits.set(key, validRequests);
}
```

#### Token Bucket Rate Limiting

```javascript
class TokenBucket {
  constructor(capacity, refillRate) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refillRate = refillRate;
    this.lastRefill = Date.now();
  }

  consume(tokens = 1) {
    this.refill();

    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }

    return false;
  }

  refill() {
    const now = Date.now();
    const tokensToAdd = ((now - this.lastRefill) / 1000) * this.refillRate;
    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }
}
```

## API Documentation

### OpenAPI (Swagger) Specification

#### Basic Structure

```yaml
openapi: 3.0.3
info:
  title: User API
  description: API for managing users
  version: 1.0.0
servers:
  - url: https://api.example.com/v1
    description: Production server
paths:
  /users:
    get:
      summary: List users
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
            maximum: 100
      responses:
        "200":
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: "#/components/schemas/User"
                  pagination:
                    $ref: "#/components/schemas/Pagination"
    post:
      summary: Create user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/CreateUserRequest"
      responses:
        "201":
          description: User created
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/User"
        "400":
          description: Bad request
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
          example: "123"
        name:
          type: string
          example: "John Doe"
        email:
          type: string
          format: email
          example: "john@example.com"
        createdAt:
          type: string
          format: date-time
    CreateUserRequest:
      type: object
      required:
        - name
        - email
      properties:
        name:
          type: string
          minLength: 1
          maxLength: 100
        email:
          type: string
          format: email
    Error:
      type: object
      properties:
        error:
          type: object
          properties:
            code:
              type: string
            message:
              type: string
            details:
              type: array
              items:
                type: object
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
security:
  - bearerAuth: []
```

### Documentation Best Practices

#### Clear Descriptions

- Explain purpose and behavior
- Provide context and use cases
- Include business rules and constraints
- Document error conditions

#### Complete Examples

```yaml
examples:
  CreateUserExample:
    summary: Create a new user
    value:
      name: "John Doe"
      email: "john@example.com"
      age: 30
  ErrorExample:
    summary: Validation error
    value:
      error:
        code: "VALIDATION_ERROR"
        message: "Invalid input data"
        details:
          - field: "email"
            message: "Email is required"
```

#### Interactive Documentation

- Swagger UI for testing
- Code generation capabilities
- Multiple language examples
- Authentication testing

## API Testing

### Unit Testing

#### Testing REST Endpoints

```javascript
// Jest + Supertest example
const request = require("supertest");
const app = require("../app");

describe("User API", () => {
  test("GET /users should return user list", async () => {
    const response = await request(app)
      .get("/api/users")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.pagination).toBeDefined();
  });

  test("POST /users should create user", async () => {
    const userData = {
      name: "John Doe",
      email: "john@example.com",
    };

    const response = await request(app)
      .post("/api/users")
      .send(userData)
      .expect("Content-Type", /json/)
      .expect(201);

    expect(response.body.name).toBe(userData.name);
    expect(response.body.email).toBe(userData.email);
    expect(response.body.id).toBeDefined();
  });
});
```

### Integration Testing

#### Database Integration

```javascript
describe("User API Integration", () => {
  beforeEach(async () => {
    await setupTestDatabase();
  });

  afterEach(async () => {
    await cleanupTestDatabase();
  });

  test("should persist user to database", async () => {
    const userData = { name: "John", email: "john@test.com" };

    const response = await request(app)
      .post("/api/users")
      .send(userData)
      .expect(201);

    // Verify user exists in database
    const user = await User.findById(response.body.id);
    expect(user).toBeTruthy();
    expect(user.name).toBe(userData.name);
  });
});
```

### Load Testing

#### API Performance Testing

```javascript
// k6 load test example
import http from "k6/http";
import { check } from "k6";

export let options = {
  stages: [
    { duration: "2m", target: 100 }, // Ramp up
    { duration: "5m", target: 100 }, // Stay at 100 users
    { duration: "2m", target: 200 }, // Ramp up to 200
    { duration: "5m", target: 200 }, // Stay at 200 users
    { duration: "2m", target: 0 }, // Ramp down
  ],
};

export default function () {
  let response = http.get("https://api.example.com/users");

  check(response, {
    "status is 200": (r) => r.status === 200,
    "response time < 500ms": (r) => r.timings.duration < 500,
  });
}
```

## API Monitoring and Analytics

### Metrics Collection

#### Key API Metrics

- **Request Rate**: Requests per second
- **Response Time**: P50, P95, P99 latencies
- **Error Rate**: Percentage of failed requests
- **Throughput**: Data transferred per second
- **Availability**: Uptime percentage

#### Custom Metrics

```javascript
const prometheus = require("prom-client");

const httpRequestDuration = new prometheus.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
});

const httpRequestsTotal = new prometheus.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

// Middleware to collect metrics
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = (Date.now() - start) / 1000;

    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration);

    httpRequestsTotal
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .inc();
  });

  next();
});
```

### Error Tracking

#### Structured Error Logging

```javascript
const winston = require("winston");

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error("API Error", {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    headers: req.headers,
    body: req.body,
    user: req.user?.id,
    requestId: req.headers["x-request-id"],
  });

  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "An internal error occurred",
      requestId: req.headers["x-request-id"],
    },
  });
});
```

### Health Checks

#### Health Check Endpoint

```javascript
app.get("/health", async (req, res) => {
  const checks = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    external_api: await checkExternalAPI(),
  };

  const allHealthy = Object.values(checks).every((check) => check.healthy);

  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? "healthy" : "unhealthy",
    timestamp: new Date().toISOString(),
    checks,
  });
});

async function checkDatabase() {
  try {
    await db.raw("SELECT 1");
    return { healthy: true, responseTime: 10 };
  } catch (error) {
    return { healthy: false, error: error.message };
  }
}
```

### API Analytics

#### Usage Analytics

```javascript
// Track API usage patterns
const analytics = {
  recordAPICall: (endpoint, userId, responseTime, statusCode) => {
    const event = {
      timestamp: new Date(),
      endpoint,
      userId,
      responseTime,
      statusCode,
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
    };

    // Send to analytics service
    analyticsService.track(event);
  },
};
```

#### Rate Limiting Analytics

```javascript
// Monitor rate limiting effectiveness
const rateLimitAnalytics = {
  blocked: new prometheus.Counter({
    name: "rate_limit_blocked_total",
    help: "Total blocked requests due to rate limiting",
    labelNames: ["endpoint", "reason"],
  }),

  recordBlock: (endpoint, reason) => {
    rateLimitAnalytics.blocked.labels(endpoint, reason).inc();
  },
};
```

## API Best Practices

### Design Principles

- **Consistency**: Use consistent naming and patterns
- **Simplicity**: Keep interfaces simple and intuitive
- **Backward Compatibility**: Avoid breaking changes
- **Error Handling**: Provide clear, actionable error messages
- **Documentation**: Maintain up-to-date, comprehensive documentation

### Performance Optimization

- **Caching**: Implement appropriate caching strategies
- **Pagination**: Always paginate large result sets
- **Field Selection**: Allow clients to specify needed fields
- **Compression**: Use gzip compression for responses
- **Connection Pooling**: Reuse database connections

### Security Best Practices

- **HTTPS Everywhere**: Always use HTTPS in production
- **Input Validation**: Validate and sanitize all inputs
- **Rate Limiting**: Protect against abuse and DDoS
- **Authentication**: Use strong authentication methods
- **Authorization**: Implement proper access controls
- **Secrets Management**: Secure API keys and secrets

### Operational Excellence

- **Monitoring**: Comprehensive metrics and alerting
- **Logging**: Structured, searchable logs
- **Health Checks**: Proactive health monitoring
- **Deployment**: Automated, reliable deployment processes
- **Testing**: Comprehensive test coverage
