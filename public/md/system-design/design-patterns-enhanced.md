# System Design Patterns

## Introduction

System design patterns are proven solutions to common architectural problems in distributed systems. These patterns help build scalable, reliable, and maintainable systems by providing blueprints for solving recurring challenges.

## Resilience Patterns

### Circuit Breaker Pattern

**Problem**: Prevent cascading failures when external services are unavailable or slow.

**Solution**: Monitor service calls and "break the circuit" when failure rate exceeds threshold.

```typescript
enum CircuitState {
  CLOSED = "CLOSED", // Normal operation
  OPEN = "OPEN", // Failing fast
  HALF_OPEN = "HALF_OPEN", // Testing recovery
}

class CircuitBreaker {
  private state = CircuitState.CLOSED;
  private failureCount = 0;
  private nextAttempt: number = 0;

  constructor(
    private failureThreshold: number = 5,
    private timeout: number = 60000,
    private retryTimeout: number = 30000
  ) {}

  async call<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() < this.nextAttempt) {
        throw new Error("Circuit breaker OPEN");
      }
      this.state = CircuitState.HALF_OPEN;
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    this.state = CircuitState.CLOSED;
  }

  private onFailure(): void {
    this.failureCount++;
    if (this.failureCount >= this.failureThreshold) {
      this.state = CircuitState.OPEN;
      this.nextAttempt = Date.now() + this.retryTimeout;
    }
  }
}
```

**Use Cases**:

- External API calls
- Database connections
- Microservice communication
- Third-party integrations

### Bulkhead Pattern

**Problem**: Isolate resources to prevent one failing component from bringing down the entire system.

**Solution**: Separate resource pools for different operations or tenants.

```typescript
class ResourcePool<T> {
  private available: T[] = [];
  private inUse: Set<T> = new Set();

  constructor(
    private factory: () => T,
    private maxSize: number,
    private cleanup?: (resource: T) => void
  ) {
    for (let i = 0; i < maxSize; i++) {
      this.available.push(this.factory());
    }
  }

  async acquire(): Promise<T> {
    if (this.available.length === 0) {
      throw new Error("No resources available");
    }

    const resource = this.available.pop()!;
    this.inUse.add(resource);
    return resource;
  }

  release(resource: T): void {
    if (this.inUse.has(resource)) {
      this.inUse.delete(resource);
      this.available.push(resource);
    }
  }
}

class BulkheadService {
  private criticalPool = new ResourcePool(
    () => new DatabaseConnection("critical"),
    10
  );

  private regularPool = new ResourcePool(
    () => new DatabaseConnection("regular"),
    20
  );

  async executeCriticalOperation(operation: (conn: any) => Promise<any>) {
    const connection = await this.criticalPool.acquire();
    try {
      return await operation(connection);
    } finally {
      this.criticalPool.release(connection);
    }
  }
}
```

**Applications**:

- Thread pools
- Connection pools
- Memory partitions
- CPU resource allocation

### Retry Pattern

**Problem**: Handle transient failures in distributed systems.

**Solution**: Retry failed operations with exponential backoff and jitter.

```typescript
interface RetryOptions {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  jitter: boolean;
}

class RetryHandler {
  async execute<T>(
    operation: () => Promise<T>,
    options: RetryOptions
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        if (attempt === options.maxAttempts) {
          break;
        }

        if (!this.isRetryableError(error)) {
          throw error;
        }

        const delay = this.calculateDelay(attempt, options);
        await this.sleep(delay);
      }
    }

    throw lastError!;
  }

  private calculateDelay(attempt: number, options: RetryOptions): number {
    const exponentialDelay =
      options.initialDelay * Math.pow(options.backoffMultiplier, attempt - 1);

    let delay = Math.min(exponentialDelay, options.maxDelay);

    if (options.jitter) {
      delay = delay * (0.5 + Math.random() * 0.5);
    }

    return delay;
  }

  private isRetryableError(error: any): boolean {
    return (
      error.code === "TIMEOUT" ||
      error.code === "CONNECTION_REFUSED" ||
      error.status >= 500
    );
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
```

## Data Management Patterns

### Database per Service

**Problem**: Shared databases create tight coupling between services.

**Solution**: Each service owns its data and database schema.

```typescript
class UserService {
  private userDb: UserDatabase;

  async createUser(userData: CreateUserRequest): Promise<User> {
    const user = await this.userDb.create(userData);

    await this.eventBus.publish(
      new UserCreatedEvent({
        userId: user.id,
        email: user.email,
        timestamp: new Date(),
      })
    );

    return user;
  }
}

class OrderService {
  private orderDb: OrderDatabase;
  private userCache: Map<string, UserSummary> = new Map();

  constructor(private eventBus: EventBus) {
    this.eventBus.subscribe(
      UserCreatedEvent,
      this.handleUserCreated.bind(this)
    );
  }

  private async handleUserCreated(event: UserCreatedEvent): Promise<void> {
    this.userCache.set(event.userId, {
      id: event.userId,
      email: event.email,
    });
  }

  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    const userSummary = this.userCache.get(orderData.userId);
    if (!userSummary) {
      throw new Error("User not found");
    }

    return await this.orderDb.create({
      ...orderData,
      userEmail: userSummary.email,
    });
  }
}
```

### Saga Pattern

**Problem**: Maintain data consistency across multiple services without distributed transactions.

**Solution**: Coordinate transactions through choreography or orchestration.

```typescript
interface SagaStep {
  execute(): Promise<any>;
  compensate(): Promise<void>;
}

class OrderSaga {
  private steps: SagaStep[] = [];
  private executedSteps: SagaStep[] = [];

  constructor(private orderData: OrderData) {
    this.steps = [
      new ReserveInventoryStep(orderData.items),
      new ProcessPaymentStep(orderData.payment),
      new CreateShipmentStep(orderData.shipping),
      new SendConfirmationStep(orderData.user),
    ];
  }

  async execute(): Promise<void> {
    try {
      for (const step of this.steps) {
        await step.execute();
        this.executedSteps.push(step);
      }
    } catch (error) {
      await this.compensate();
      throw error;
    }
  }

  private async compensate(): Promise<void> {
    for (const step of this.executedSteps.reverse()) {
      try {
        await step.compensate();
      } catch (compensationError) {
        console.error("Compensation failed:", compensationError);
      }
    }
  }
}

class ProcessPaymentStep implements SagaStep {
  constructor(private paymentData: PaymentData) {}

  async execute(): Promise<void> {
    await paymentService.charge(this.paymentData);
  }

  async compensate(): Promise<void> {
    await paymentService.refund(this.paymentData.transactionId);
  }
}
```

### Event Sourcing

**Problem**: Track all changes to application state and enable event-driven architectures.

**Solution**: Store events instead of current state, rebuild state by replaying events.

```typescript
abstract class Event {
  constructor(
    public readonly aggregateId: string,
    public readonly version: number,
    public readonly timestamp: Date
  ) {}
}

class UserRegisteredEvent extends Event {
  constructor(
    aggregateId: string,
    version: number,
    public readonly email: string,
    public readonly name: string
  ) {
    super(aggregateId, version, new Date());
  }
}

class EventStore {
  private events: Map<string, Event[]> = new Map();

  async appendEvents(
    aggregateId: string,
    expectedVersion: number,
    events: Event[]
  ): Promise<void> {
    const existingEvents = this.events.get(aggregateId) || [];

    if (existingEvents.length !== expectedVersion) {
      throw new Error("Concurrency conflict");
    }

    const newEvents = [...existingEvents, ...events];
    this.events.set(aggregateId, newEvents);

    for (const event of events) {
      await this.publishEvent(event);
    }
  }

  async getEvents(aggregateId: string, fromVersion?: number): Promise<Event[]> {
    const events = this.events.get(aggregateId) || [];
    return fromVersion ? events.slice(fromVersion) : events;
  }

  private async publishEvent(event: Event): Promise<void> {
    await eventBus.publish(event);
  }
}

class UserAggregate {
  private version = 0;
  private uncommittedEvents: Event[] = [];

  constructor(
    private id: string,
    private email?: string,
    private name?: string
  ) {}

  static async fromHistory(
    id: string,
    events: Event[]
  ): Promise<UserAggregate> {
    const user = new UserAggregate(id);

    for (const event of events) {
      user.applyEvent(event);
    }

    return user;
  }

  register(email: string, name: string): void {
    if (this.email) {
      throw new Error("User already registered");
    }

    const event = new UserRegisteredEvent(
      this.id,
      this.version + 1,
      email,
      name
    );
    this.applyEvent(event);
    this.uncommittedEvents.push(event);
  }

  private applyEvent(event: Event): void {
    if (event instanceof UserRegisteredEvent) {
      this.email = event.email;
      this.name = event.name;
    }
    this.version = event.version;
  }

  getUncommittedEvents(): Event[] {
    return [...this.uncommittedEvents];
  }

  markEventsAsCommitted(): void {
    this.uncommittedEvents = [];
  }
}
```

## Communication Patterns

### API Gateway Pattern

**Problem**: Multiple clients need different data formats and authentication methods.

**Solution**: Single entry point that handles routing, authentication, and response transformation.

```typescript
class APIGateway {
  private routes: Map<string, RouteHandler> = new Map();
  private middleware: Middleware[] = [];

  constructor(
    private authService: AuthenticationService,
    private rateLimit: RateLimiter
  ) {
    this.middleware = [
      new AuthenticationMiddleware(authService),
      new RateLimitingMiddleware(rateLimit),
      new LoggingMiddleware(),
      new MetricsMiddleware(),
    ];
  }

  async handleRequest(request: Request): Promise<Response> {
    let context = new RequestContext(request);

    for (const middleware of this.middleware) {
      context = await middleware.process(context);
      if (context.response) {
        return context.response;
      }
    }

    const handler = this.routes.get(request.path);
    if (!handler) {
      return new Response(404, "Not Found");
    }

    return await handler.handle(context);
  }

  registerRoute(path: string, handler: RouteHandler): void {
    this.routes.set(path, handler);
  }
}

class UserServiceHandler implements RouteHandler {
  constructor(private userService: UserServiceClient) {}

  async handle(context: RequestContext): Promise<Response> {
    const userId = context.request.params.id;
    const user = await this.userService.getUser(userId);

    if (context.request.clientType === "mobile") {
      return new Response(200, this.transformForMobile(user));
    }

    return new Response(200, user);
  }

  private transformForMobile(user: User): MobileUserResponse {
    return {
      id: user.id,
      name: user.name,
      avatar: user.profileImage?.thumbnail,
    };
  }
}
```

### Backend for Frontend (BFF)

**Problem**: Different client types need different data structures and APIs.

**Solution**: Create specific backend services for each frontend type.

```typescript
class MobileBFF {
  constructor(
    private userService: UserService,
    private productService: ProductService,
    private orderService: OrderService
  ) {}

  async getUserDashboard(userId: string): Promise<MobileDashboard> {
    const [user, recentOrders, recommendations] = await Promise.all([
      this.userService.getUser(userId),
      this.orderService.getRecentOrders(userId, 5),
      this.productService.getRecommendations(userId, 10),
    ]);

    return {
      user: {
        name: user.name,
        avatar: user.profileImage?.thumbnail,
        loyaltyPoints: user.loyaltyPoints,
      },
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        status: order.status,
        total: order.total,
        itemCount: order.items.length,
      })),
      recommendations: recommendations.map((product) => ({
        id: product.id,
        name: product.name,
        image: product.images[0]?.thumbnail,
        price: product.price,
      })),
    };
  }
}

class WebBFF {
  constructor(
    private userService: UserService,
    private productService: ProductService,
    private orderService: OrderService,
    private analyticsService: AnalyticsService
  ) {}

  async getUserDashboard(userId: string): Promise<WebDashboard> {
    const [user, orderHistory, analytics, recommendations] = await Promise.all([
      this.userService.getUser(userId),
      this.orderService.getOrderHistory(userId),
      this.analyticsService.getUserAnalytics(userId),
      this.productService.getRecommendations(userId, 20),
    ]);

    return {
      user: user,
      orderHistory: orderHistory,
      analytics: analytics,
      recommendations: recommendations,
    };
  }
}
```

### Message Queue Patterns

**Problem**: Decouple services and handle asynchronous processing.

**Solution**: Use message queues for reliable asynchronous communication.

```typescript
interface Message {
  id: string;
  type: string;
  payload: any;
  timestamp: Date;
  retryCount?: number;
}

class MessageQueue {
  private queues: Map<string, Message[]> = new Map();
  private deadLetterQueue: Message[] = [];
  private maxRetries = 3;

  async publish(queueName: string, message: Message): Promise<void> {
    const queue = this.queues.get(queueName) || [];
    queue.push(message);
    this.queues.set(queueName, queue);
  }

  async subscribe(
    queueName: string,
    handler: (message: Message) => Promise<void>
  ): Promise<void> {
    setInterval(async () => {
      const queue = this.queues.get(queueName);
      if (!queue || queue.length === 0) return;

      const message = queue.shift()!;

      try {
        await handler(message);
      } catch (error) {
        await this.handleFailedMessage(queueName, message, error);
      }
    }, 1000);
  }

  private async handleFailedMessage(
    queueName: string,
    message: Message,
    error: Error
  ): Promise<void> {
    message.retryCount = (message.retryCount || 0) + 1;

    if (message.retryCount <= this.maxRetries) {
      setTimeout(() => {
        this.publish(queueName, message);
      }, Math.pow(2, message.retryCount) * 1000);
    } else {
      this.deadLetterQueue.push(message);
      console.error(`Message sent to DLQ: ${message.id}`, error);
    }
  }
}

class OrderProcessor {
  constructor(private messageQueue: MessageQueue) {
    this.messageQueue.subscribe("order.created", this.processOrder.bind(this));
  }

  private async processOrder(message: Message): Promise<void> {
    const orderData = message.payload;

    await this.validateOrder(orderData);
    await this.reserveInventory(orderData);
    await this.processPayment(orderData);

    await this.messageQueue.publish("order.confirmed", {
      id: crypto.randomUUID(),
      type: "ORDER_CONFIRMED",
      payload: { orderId: orderData.id },
      timestamp: new Date(),
    });
  }
}
```

## Caching Patterns

### Cache-Aside Pattern

**Problem**: Reduce database load and improve response times.

**Solution**: Application manages cache directly, loading data on cache miss.

```typescript
class CacheAsideRepository<T> {
  constructor(
    private database: Database,
    private cache: Cache,
    private keyGenerator: (id: string) => string,
    private ttl: number = 3600
  ) {}

  async get(id: string): Promise<T | null> {
    const cacheKey = this.keyGenerator(id);

    let data = await this.cache.get(cacheKey);
    if (data) {
      return JSON.parse(data) as T;
    }

    data = await this.database.findById(id);
    if (data) {
      await this.cache.set(cacheKey, JSON.stringify(data), this.ttl);
    }

    return data;
  }

  async update(id: string, data: T): Promise<void> {
    await this.database.update(id, data);

    const cacheKey = this.keyGenerator(id);
    await this.cache.delete(cacheKey);
  }
}
```

### Write-Through Cache

**Problem**: Ensure cache consistency with every write operation.

**Solution**: Write to cache and database simultaneously.

```typescript
class WriteThroughCache<T> {
  constructor(
    private database: Database,
    private cache: Cache,
    private keyGenerator: (id: string) => string,
    private ttl: number = 3600
  ) {}

  async get(id: string): Promise<T | null> {
    const cacheKey = this.keyGenerator(id);
    const cached = await this.cache.get(cacheKey);

    if (cached) {
      return JSON.parse(cached) as T;
    }

    const data = await this.database.findById(id);
    if (data) {
      await this.cache.set(cacheKey, JSON.stringify(data), this.ttl);
    }

    return data;
  }

  async create(data: T): Promise<void> {
    const result = await this.database.create(data);
    const cacheKey = this.keyGenerator(result.id);

    await this.cache.set(cacheKey, JSON.stringify(result), this.ttl);
  }

  async update(id: string, data: T): Promise<void> {
    const result = await this.database.update(id, data);
    const cacheKey = this.keyGenerator(id);

    await this.cache.set(cacheKey, JSON.stringify(result), this.ttl);
  }
}
```

### Distributed Cache Invalidation

**Problem**: Keep distributed caches synchronized when data changes.

**Solution**: Use event-driven cache invalidation across all cache instances.

```typescript
class DistributedCacheManager {
  private localCache: Map<string, CacheEntry> = new Map();

  constructor(private eventBus: EventBus, private nodeId: string) {
    this.eventBus.subscribe(
      "cache.invalidate",
      this.handleInvalidation.bind(this)
    );
  }

  async get(key: string): Promise<any> {
    const entry = this.localCache.get(key);

    if (entry && entry.expiresAt > Date.now()) {
      return entry.value;
    }

    this.localCache.delete(key);
    return null;
  }

  async set(key: string, value: any, ttl: number): Promise<void> {
    const entry: CacheEntry = {
      value,
      expiresAt: Date.now() + ttl * 1000,
      version: Date.now(),
    };

    this.localCache.set(key, entry);
  }

  async invalidate(key: string): Promise<void> {
    this.localCache.delete(key);

    await this.eventBus.publish("cache.invalidate", {
      key,
      sourceNodeId: this.nodeId,
      timestamp: Date.now(),
    });
  }

  private async handleInvalidation(event: any): Promise<void> {
    if (event.sourceNodeId !== this.nodeId) {
      this.localCache.delete(event.key);
    }
  }
}
```

## Monitoring and Observability Patterns

### Health Check Pattern

**Problem**: Monitor service health and enable automated recovery.

**Solution**: Provide standardized health check endpoints.

```typescript
interface HealthCheck {
  name: string;
  check(): Promise<HealthStatus>;
}

enum HealthStatus {
  HEALTHY = "HEALTHY",
  UNHEALTHY = "UNHEALTHY",
  DEGRADED = "DEGRADED",
}

class DatabaseHealthCheck implements HealthCheck {
  name = "database";

  constructor(private database: Database) {}

  async check(): Promise<HealthStatus> {
    try {
      await this.database.ping();
      return HealthStatus.HEALTHY;
    } catch (error) {
      return HealthStatus.UNHEALTHY;
    }
  }
}

class HealthCheckService {
  private checks: HealthCheck[] = [];

  addCheck(check: HealthCheck): void {
    this.checks.push(check);
  }

  async checkHealth(): Promise<HealthReport> {
    const results: HealthCheckResult[] = [];
    let overallStatus = HealthStatus.HEALTHY;

    for (const check of this.checks) {
      try {
        const status = await check.check();
        results.push({ name: check.name, status });

        if (status === HealthStatus.UNHEALTHY) {
          overallStatus = HealthStatus.UNHEALTHY;
        } else if (
          status === HealthStatus.DEGRADED &&
          overallStatus === HealthStatus.HEALTHY
        ) {
          overallStatus = HealthStatus.DEGRADED;
        }
      } catch (error) {
        results.push({
          name: check.name,
          status: HealthStatus.UNHEALTHY,
          error: error.message,
        });
        overallStatus = HealthStatus.UNHEALTHY;
      }
    }

    return {
      status: overallStatus,
      checks: results,
      timestamp: new Date(),
    };
  }
}
```

### Correlation ID Pattern

**Problem**: Track requests across multiple services in distributed systems.

**Solution**: Generate and propagate correlation IDs through all service calls.

```typescript
class CorrelationIdMiddleware {
  async process(request: Request, next: Function): Promise<Response> {
    const correlationId =
      request.headers["x-correlation-id"] || this.generateCorrelationId();

    request.correlationId = correlationId;

    const logger = new CorrelationLogger(correlationId);
    request.logger = logger;

    try {
      logger.info("Request started", {
        method: request.method,
        path: request.path,
      });

      const response = await next(request);

      response.headers["x-correlation-id"] = correlationId;
      logger.info("Request completed", { statusCode: response.statusCode });

      return response;
    } catch (error) {
      logger.error("Request failed", { error: error.message });
      throw error;
    }
  }

  private generateCorrelationId(): string {
    return crypto.randomUUID();
  }
}

class ServiceClient {
  async makeRequest(
    url: string,
    data: any,
    correlationId?: string
  ): Promise<any> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (correlationId) {
      headers["x-correlation-id"] = correlationId;
    }

    return await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
  }
}
```

## Deployment Patterns

### Blue-Green Deployment

**Problem**: Deploy new versions with zero downtime and quick rollback capability.

**Solution**: Maintain two identical production environments, switching between them.

```typescript
class BlueGreenDeployment {
  private environments = {
    blue: new Environment("blue"),
    green: new Environment("green"),
  };

  private activeEnvironment: "blue" | "green" = "blue";

  async deploy(newVersion: string): Promise<void> {
    const inactiveEnvironment =
      this.activeEnvironment === "blue" ? "green" : "blue";
    const targetEnv = this.environments[inactiveEnvironment];

    console.log(
      `Deploying version ${newVersion} to ${inactiveEnvironment} environment`
    );

    await targetEnv.deploy(newVersion);
    await this.healthCheck(targetEnv);
    await this.runSmokeTests(targetEnv);

    console.log(`Switching traffic to ${inactiveEnvironment} environment`);
    await this.switchTraffic(inactiveEnvironment);

    this.activeEnvironment = inactiveEnvironment;

    console.log(`Deployment complete. ${inactiveEnvironment} is now active`);
  }

  async rollback(): Promise<void> {
    const previousEnvironment =
      this.activeEnvironment === "blue" ? "green" : "blue";

    console.log(`Rolling back to ${previousEnvironment} environment`);
    await this.switchTraffic(previousEnvironment);

    this.activeEnvironment = previousEnvironment;
    console.log(`Rollback complete`);
  }

  private async healthCheck(environment: Environment): Promise<void> {
    const isHealthy = await environment.healthCheck();
    if (!isHealthy) {
      throw new Error(`Health check failed for ${environment.name}`);
    }
  }

  private async switchTraffic(environment: "blue" | "green"): Promise<void> {
    await loadBalancer.updateUpstream(this.environments[environment].endpoints);
  }
}
```

### Canary Deployment

**Problem**: Minimize risk when deploying new versions by gradual rollout.

**Solution**: Route small percentage of traffic to new version, gradually increasing.

```typescript
class CanaryDeployment {
  private canaryWeight = 0;

  constructor(
    private productionEnvironment: Environment,
    private canaryEnvironment: Environment,
    private loadBalancer: LoadBalancer
  ) {}

  async deploy(newVersion: string): Promise<void> {
    await this.canaryEnvironment.deploy(newVersion);
    await this.healthCheck(this.canaryEnvironment);

    const stages = [5, 10, 25, 50, 75, 100];

    for (const weight of stages) {
      console.log(`Routing ${weight}% traffic to canary`);
      await this.updateTrafficWeight(weight);

      await this.monitorMetrics();
      await this.sleep(300000); // Wait 5 minutes

      const metrics = await this.getMetrics();
      if (!this.isHealthy(metrics)) {
        await this.rollback();
        throw new Error("Canary deployment failed - rolling back");
      }
    }

    await this.promoteCanary();
  }

  private async updateTrafficWeight(weight: number): Promise<void> {
    this.canaryWeight = weight;
    await this.loadBalancer.updateWeights({
      production: 100 - weight,
      canary: weight,
    });
  }

  private async isHealthy(metrics: DeploymentMetrics): boolean {
    return (
      metrics.errorRate < 0.01 &&
      metrics.responseTime < 200 &&
      metrics.throughput > metrics.baseline.throughput * 0.9
    );
  }

  private async rollback(): Promise<void> {
    console.log("Rolling back canary deployment");
    await this.updateTrafficWeight(0);
    this.canaryWeight = 0;
  }

  private async promoteCanary(): Promise<void> {
    console.log("Promoting canary to production");
    await this.productionEnvironment.deploy(this.canaryEnvironment.version);
    await this.updateTrafficWeight(0);
  }
}
```

## Security Patterns

### OAuth 2.0 with JWT

**Problem**: Secure API access with token-based authentication.

**Solution**: Use OAuth 2.0 flow with JWT tokens for stateless authentication.

```typescript
class JWTAuthenticationService {
  constructor(private secretKey: string, private tokenExpiry: number = 3600) {}

  generateToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + this.tokenExpiry,
    };

    return jwt.sign(payload, this.secretKey);
  }

  verifyToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, this.secretKey) as TokenPayload;
    } catch (error) {
      return null;
    }
  }

  refreshToken(oldToken: string): string | null {
    const payload = this.verifyToken(oldToken);
    if (!payload) return null;

    if (payload.exp - Math.floor(Date.now() / 1000) > 300) {
      return null; // Don't refresh if more than 5 minutes left
    }

    return this.generateToken({
      id: payload.sub,
      email: payload.email,
      roles: payload.roles,
    } as User);
  }
}

class AuthenticationMiddleware {
  constructor(private authService: JWTAuthenticationService) {}

  authenticate(requiredRoles?: string[]) {
    return async (request: Request, next: Function): Promise<Response> => {
      const authHeader = request.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) {
        return new Response(401, "Unauthorized");
      }

      const token = authHeader.substring(7);
      const payload = this.authService.verifyToken(token);

      if (!payload) {
        return new Response(401, "Invalid token");
      }

      if (
        requiredRoles &&
        !this.hasRequiredRoles(payload.roles, requiredRoles)
      ) {
        return new Response(403, "Insufficient permissions");
      }

      request.user = payload;
      return await next(request);
    };
  }

  private hasRequiredRoles(
    userRoles: string[],
    requiredRoles: string[]
  ): boolean {
    return requiredRoles.every((role) => userRoles.includes(role));
  }
}
```

## Summary

System design patterns provide proven solutions to common architectural challenges. Key principles for applying these patterns:

**Pattern Selection Guidelines**:

- Start simple, add complexity when needed
- Consider trade-offs between consistency, availability, and partition tolerance
- Design for failure and recovery
- Implement comprehensive monitoring and observability
- Choose patterns based on specific requirements and constraints

**Common Pattern Categories**:

- **Resilience**: Circuit breaker, bulkhead, retry patterns
- **Data Management**: Database per service, saga, event sourcing
- **Communication**: API gateway, BFF, message queues
- **Caching**: Cache-aside, write-through, distributed invalidation
- **Monitoring**: Health checks, correlation IDs, distributed tracing
- **Deployment**: Blue-green, canary, rolling deployments
- **Security**: OAuth 2.0, JWT, authentication middleware

These patterns form the foundation for building robust, scalable distributed systems. Understanding when and how to apply them is crucial for system architecture decisions and technical interviews.
