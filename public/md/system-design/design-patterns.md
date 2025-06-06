# System Design Patterns

Essential architectural patterns for building scalable, resilient distributed systems. These patterns solve common problems in system design and are frequently discussed in senior engineering interviews.

## Architectural Patterns

### Circuit Breaker Pattern

Prevents cascading failures by wrapping external service calls and monitoring failure rates.

```typescript
class CircuitBreaker<T> {
  private failureCount = 0;
  private nextAttempt = Date.now();
  private state: "CLOSED" | "OPEN" | "HALF_OPEN" = "CLOSED";

  constructor(
    private failureThreshold: number = 5,
    private recoveryTimeout: number = 60000,
    private monitoringPeriod: number = 10000
  ) {}

  async execute(operation: () => Promise<T>): Promise<T> {
    if (this.state === "OPEN") {
      if (this.nextAttempt <= Date.now()) {
        this.state = "HALF_OPEN";
      } else {
        throw new Error("Circuit breaker is OPEN");
      }
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
    this.state = "CLOSED";
  }

  private onFailure(): void {
    this.failureCount++;
    if (this.failureCount >= this.failureThreshold) {
      this.state = "OPEN";
      this.nextAttempt = Date.now() + this.recoveryTimeout;
    }
  }
}
```

**Use Cases:**

- API gateway to microservices
- Database connection failures
- Third-party service integrations
- Network partition handling

**Benefits:**

- Prevents resource exhaustion
- Enables graceful degradation
- Provides fast failure response
- Allows automatic recovery

### Bulkhead Pattern

Isolates critical resources to prevent total system failure when one component fails.

```typescript
interface ResourcePool<T> {
  acquire(): Promise<T>;
  release(resource: T): void;
  size(): number;
}

class BulkheadResourceManager {
  private pools = new Map<string, ResourcePool<any>>();

  createPool<T>(
    name: string,
    factory: () => T,
    maxSize: number
  ): ResourcePool<T> {
    const pool = new ResourcePoolImpl(factory, maxSize);
    this.pools.set(name, pool);
    return pool;
  }

  async executeWithBulkhead<T>(
    poolName: string,
    operation: (resource: any) => Promise<T>
  ): Promise<T> {
    const pool = this.pools.get(poolName);
    if (!pool) {
      throw new Error(`Pool ${poolName} not found`);
    }

    const resource = await pool.acquire();
    try {
      return await operation(resource);
    } finally {
      pool.release(resource);
    }
  }
}

class ResourcePoolImpl<T> implements ResourcePool<T> {
  private available: T[] = [];
  private inUse = new Set<T>();

  constructor(private factory: () => T, private maxSize: number) {
    for (let i = 0; i < maxSize; i++) {
      this.available.push(factory());
    }
  }

  async acquire(): Promise<T> {
    return new Promise((resolve, reject) => {
      if (this.available.length > 0) {
        const resource = this.available.pop()!;
        this.inUse.add(resource);
        resolve(resource);
      } else {
        reject(new Error("No resources available"));
      }
    });
  }

  release(resource: T): void {
    if (this.inUse.has(resource)) {
      this.inUse.delete(resource);
      this.available.push(resource);
    }
  }

  size(): number {
    return this.available.length + this.inUse.size;
  }
}
```

**Implementation Examples:**

- Database connection pools
- Thread pools for different operations
- Memory partitions
- Network bandwidth allocation

### Saga Pattern

Manages distributed transactions across multiple services through choreography or orchestration.

```typescript
interface SagaStep<T> {
  execute(data: T): Promise<any>;
  compensate(data: T): Promise<void>;
}

class SagaOrchestrator<T> {
  private steps: SagaStep<T>[] = [];
  private executedSteps: number = 0;

  addStep(step: SagaStep<T>): SagaOrchestrator<T> {
    this.steps.push(step);
    return this;
  }

  async execute(data: T): Promise<void> {
    try {
      for (let i = 0; i < this.steps.length; i++) {
        await this.steps[i].execute(data);
        this.executedSteps = i + 1;
      }
    } catch (error) {
      await this.compensate(data);
      throw error;
    }
  }

  private async compensate(data: T): Promise<void> {
    for (let i = this.executedSteps - 1; i >= 0; i--) {
      try {
        await this.steps[i].compensate(data);
      } catch (compensationError) {
        console.error(`Compensation failed for step ${i}:`, compensationError);
      }
    }
  }
}

class PaymentStep implements SagaStep<OrderData> {
  async execute(data: OrderData): Promise<void> {
    await this.paymentService.processPayment(data.paymentInfo);
  }

  async compensate(data: OrderData): Promise<void> {
    await this.paymentService.refundPayment(data.paymentInfo);
  }
}

class InventoryStep implements SagaStep<OrderData> {
  async execute(data: OrderData): Promise<void> {
    await this.inventoryService.reserveItems(data.items);
  }

  async compensate(data: OrderData): Promise<void> {
    await this.inventoryService.releaseItems(data.items);
  }
}
```

**Use Cases:**

- E-commerce order processing
- Financial transactions
- Multi-service workflows
- Data consistency across microservices

### CQRS (Command Query Responsibility Segregation)

Separates read and write operations using different models optimized for their respective purposes.

```typescript
interface Command {
  type: string;
  payload: any;
  timestamp: Date;
}

interface Event {
  aggregateId: string;
  type: string;
  payload: any;
  version: number;
  timestamp: Date;
}

class EventStore {
  private events = new Map<string, Event[]>();

  async append(aggregateId: string, events: Event[]): Promise<void> {
    const existingEvents = this.events.get(aggregateId) || [];
    this.events.set(aggregateId, [...existingEvents, ...events]);
  }

  async getEvents(aggregateId: string): Promise<Event[]> {
    return this.events.get(aggregateId) || [];
  }
}

class UserCommandHandler {
  constructor(private eventStore: EventStore, private eventBus: EventBus) {}

  async handle(command: Command): Promise<void> {
    switch (command.type) {
      case "CREATE_USER":
        await this.createUser(command);
        break;
      case "UPDATE_USER":
        await this.updateUser(command);
        break;
    }
  }

  private async createUser(command: Command): Promise<void> {
    const event: Event = {
      aggregateId: command.payload.id,
      type: "USER_CREATED",
      payload: command.payload,
      version: 1,
      timestamp: new Date(),
    };

    await this.eventStore.append(command.payload.id, [event]);
    await this.eventBus.publish(event);
  }
}

class UserQueryHandler {
  private projections = new Map<string, UserProjection>();

  constructor(private eventBus: EventBus) {
    eventBus.subscribe("USER_CREATED", this.handleUserCreated.bind(this));
    eventBus.subscribe("USER_UPDATED", this.handleUserUpdated.bind(this));
  }

  async getUserById(id: string): Promise<UserProjection | null> {
    return this.projections.get(id) || null;
  }

  async getAllUsers(): Promise<UserProjection[]> {
    return Array.from(this.projections.values());
  }

  private handleUserCreated(event: Event): void {
    this.projections.set(event.aggregateId, {
      id: event.aggregateId,
      ...event.payload,
      version: event.version,
    });
  }

  private handleUserUpdated(event: Event): void {
    const existing = this.projections.get(event.aggregateId);
    if (existing) {
      this.projections.set(event.aggregateId, {
        ...existing,
        ...event.payload,
        version: event.version,
      });
    }
  }
}
```

## Communication Patterns

### Event Sourcing

Stores all changes as a sequence of events, enabling complete audit trails and temporal queries.

```typescript
abstract class AggregateRoot {
  protected id: string;
  protected version = 0;
  private uncommittedEvents: Event[] = [];

  constructor(id: string) {
    this.id = id;
  }

  protected addEvent(event: Event): void {
    event.version = this.version + 1;
    this.uncommittedEvents.push(event);
    this.apply(event);
  }

  abstract apply(event: Event): void;

  getUncommittedEvents(): Event[] {
    return [...this.uncommittedEvents];
  }

  markEventsAsCommitted(): void {
    this.uncommittedEvents = [];
  }

  loadFromHistory(events: Event[]): void {
    events.forEach((event) => {
      this.apply(event);
    });
  }
}

class User extends AggregateRoot {
  private name: string = "";
  private email: string = "";
  private isActive = false;

  static create(id: string, name: string, email: string): User {
    const user = new User(id);
    user.addEvent({
      aggregateId: id,
      type: "USER_CREATED",
      payload: { name, email },
      version: 0,
      timestamp: new Date(),
    });
    return user;
  }

  updateEmail(newEmail: string): void {
    if (this.email !== newEmail) {
      this.addEvent({
        aggregateId: this.id,
        type: "USER_EMAIL_UPDATED",
        payload: { oldEmail: this.email, newEmail },
        version: 0,
        timestamp: new Date(),
      });
    }
  }

  apply(event: Event): void {
    switch (event.type) {
      case "USER_CREATED":
        this.name = event.payload.name;
        this.email = event.payload.email;
        this.isActive = true;
        break;
      case "USER_EMAIL_UPDATED":
        this.email = event.payload.newEmail;
        break;
    }
    this.version = event.version;
  }
}
```

### Publish-Subscribe Pattern

Decouples message producers from consumers through event-driven communication.

```typescript
interface Message {
  topic: string;
  payload: any;
  timestamp: Date;
  correlationId?: string;
}

interface Subscriber {
  handle(message: Message): Promise<void>;
}

class EventBus {
  private subscribers = new Map<string, Set<Subscriber>>();
  private deadLetterQueue: Message[] = [];

  async subscribe(topic: string, subscriber: Subscriber): Promise<void> {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, new Set());
    }
    this.subscribers.get(topic)!.add(subscriber);
  }

  async unsubscribe(topic: string, subscriber: Subscriber): Promise<void> {
    const topicSubscribers = this.subscribers.get(topic);
    if (topicSubscribers) {
      topicSubscribers.delete(subscriber);
    }
  }

  async publish(message: Message): Promise<void> {
    const subscribers = this.subscribers.get(message.topic);
    if (!subscribers || subscribers.size === 0) {
      console.warn(`No subscribers for topic: ${message.topic}`);
      return;
    }

    const promises = Array.from(subscribers).map(async (subscriber) => {
      try {
        await subscriber.handle(message);
      } catch (error) {
        console.error(`Subscriber error for topic ${message.topic}:`, error);
        this.deadLetterQueue.push(message);
      }
    });

    await Promise.allSettled(promises);
  }

  getDeadLetterQueue(): Message[] {
    return [...this.deadLetterQueue];
  }
}

class EmailNotificationSubscriber implements Subscriber {
  async handle(message: Message): Promise<void> {
    if (message.topic === "USER_CREATED") {
      await this.sendWelcomeEmail(message.payload.email);
    } else if (message.topic === "ORDER_COMPLETED") {
      await this.sendOrderConfirmation(message.payload);
    }
  }

  private async sendWelcomeEmail(email: string): Promise<void> {
    console.log(`Sending welcome email to: ${email}`);
  }

  private async sendOrderConfirmation(orderData: any): Promise<void> {
    console.log(`Sending order confirmation for: ${orderData.orderId}`);
  }
}
```

## Data Patterns

### Database per Service

Each microservice owns and manages its own database, ensuring loose coupling.

```typescript
interface UserRepository {
  save(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
}

interface OrderRepository {
  save(order: Order): Promise<void>;
  findById(id: string): Promise<Order | null>;
  findByUserId(userId: string): Promise<Order[]>;
}

class UserService {
  constructor(
    private userRepository: UserRepository,
    private eventBus: EventBus
  ) {}

  async createUser(userData: CreateUserRequest): Promise<User> {
    const user = new User(userData.id, userData.name, userData.email);
    await this.userRepository.save(user);

    await this.eventBus.publish({
      topic: "USER_CREATED",
      payload: { id: user.id, name: user.name, email: user.email },
      timestamp: new Date(),
    });

    return user;
  }

  async getUserProfile(id: string): Promise<UserProfile | null> {
    const user = await this.userRepository.findById(id);
    return user ? this.mapToProfile(user) : null;
  }
}

class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private eventBus: EventBus,
    private userServiceClient: UserServiceClient
  ) {}

  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    const userExists = await this.userServiceClient.userExists(
      orderData.userId
    );
    if (!userExists) {
      throw new Error("User not found");
    }

    const order = new Order(orderData.id, orderData.userId, orderData.items);
    await this.orderRepository.save(order);

    await this.eventBus.publish({
      topic: "ORDER_CREATED",
      payload: { orderId: order.id, userId: order.userId },
      timestamp: new Date(),
    });

    return order;
  }
}
```

### Data Synchronization Patterns

Maintaining consistency across distributed databases.

```typescript
interface OutboxEvent {
  id: string;
  aggregateId: string;
  eventType: string;
  payload: any;
  createdAt: Date;
  processed: boolean;
}

class OutboxPattern {
  constructor(private database: Database, private eventBus: EventBus) {}

  async saveWithEvents(
    aggregateData: any,
    events: OutboxEvent[]
  ): Promise<void> {
    await this.database.transaction(async (tx) => {
      await tx.save("aggregates", aggregateData);

      for (const event of events) {
        await tx.save("outbox_events", {
          ...event,
          processed: false,
        });
      }
    });

    this.processOutboxEvents();
  }

  private async processOutboxEvents(): Promise<void> {
    const unprocessedEvents = await this.database.query(
      "SELECT * FROM outbox_events WHERE processed = false ORDER BY createdAt"
    );

    for (const event of unprocessedEvents) {
      try {
        await this.eventBus.publish({
          topic: event.eventType,
          payload: event.payload,
          timestamp: event.createdAt,
        });

        await this.database.update("outbox_events", event.id, {
          processed: true,
        });
      } catch (error) {
        console.error(`Failed to process outbox event ${event.id}:`, error);
      }
    }
  }
}
```

## Resilience Patterns

### Retry Pattern with Exponential Backoff

Automatically retries failed operations with increasing delays.

```typescript
interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  jitter: boolean;
}

class RetryableOperation<T> {
  private static readonly DEFAULT_CONFIG: RetryConfig = {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 30000,
    backoffMultiplier: 2,
    jitter: true,
  };

  constructor(
    private operation: () => Promise<T>,
    private config: Partial<RetryConfig> = {}
  ) {
    this.config = { ...RetryableOperation.DEFAULT_CONFIG, ...config };
  }

  async execute(): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= this.config.maxAttempts!; attempt++) {
      try {
        return await this.operation();
      } catch (error) {
        lastError = error as Error;

        if (attempt === this.config.maxAttempts) {
          throw new Error(
            `Operation failed after ${attempt} attempts: ${lastError.message}`
          );
        }

        const delay = this.calculateDelay(attempt);
        await this.sleep(delay);
      }
    }

    throw lastError!;
  }

  private calculateDelay(attempt: number): number {
    const exponentialDelay =
      this.config.baseDelay! *
      Math.pow(this.config.backoffMultiplier!, attempt - 1);

    const delay = Math.min(exponentialDelay, this.config.maxDelay!);

    return this.config.jitter! ? delay * (0.5 + Math.random() * 0.5) : delay;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

async function withRetry<T>(
  operation: () => Promise<T>,
  config?: Partial<RetryConfig>
): Promise<T> {
  return new RetryableOperation(operation, config).execute();
}
```

### Timeout Pattern

Prevents operations from hanging indefinitely.

```typescript
class TimeoutError extends Error {
  constructor(timeoutMs: number) {
    super(`Operation timed out after ${timeoutMs}ms`);
    this.name = "TimeoutError";
  }
}

async function withTimeout<T>(
  operation: Promise<T>,
  timeoutMs: number
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new TimeoutError(timeoutMs));
    }, timeoutMs);
  });

  return Promise.race([operation, timeoutPromise]);
}

class ServiceClient {
  constructor(private defaultTimeoutMs: number = 5000) {}

  async fetchUserData(userId: string, timeoutMs?: number): Promise<UserData> {
    const operation = this.httpClient.get(`/users/${userId}`);
    return withTimeout(operation, timeoutMs || this.defaultTimeoutMs);
  }

  async createOrder(orderData: OrderData): Promise<Order> {
    const operation = this.httpClient.post("/orders", orderData);
    return withTimeout(operation, 10000); // Longer timeout for writes
  }
}
```

## Performance Patterns

### Cache-Aside Pattern

Application manages cache alongside the database.

```typescript
interface Cache<T> {
  get(key: string): Promise<T | null>;
  set(key: string, value: T, ttlSeconds?: number): Promise<void>;
  delete(key: string): Promise<void>;
}

class CacheAsideService<T> {
  constructor(
    private cache: Cache<T>,
    private dataSource: DataSource<T>,
    private defaultTtl = 3600
  ) {}

  async get(key: string): Promise<T | null> {
    let data = await this.cache.get(key);

    if (data === null) {
      data = await this.dataSource.get(key);
      if (data !== null) {
        await this.cache.set(key, data, this.defaultTtl);
      }
    }

    return data;
  }

  async update(key: string, data: T): Promise<void> {
    await this.dataSource.update(key, data);
    await this.cache.delete(key); // Invalidate cache
  }

  async create(key: string, data: T): Promise<void> {
    await this.dataSource.create(key, data);
    await this.cache.set(key, data, this.defaultTtl);
  }

  async delete(key: string): Promise<void> {
    await this.dataSource.delete(key);
    await this.cache.delete(key);
  }
}
```

### Write-Behind Caching

Cache handles writes asynchronously to improve performance.

```typescript
interface WriteOperation<T> {
  key: string;
  data: T;
  operation: "CREATE" | "UPDATE" | "DELETE";
  timestamp: Date;
}

class WriteBehindCache<T> {
  private writeQueue: WriteOperation<T>[] = [];
  private isProcessing = false;

  constructor(
    private cache: Cache<T>,
    private dataSource: DataSource<T>,
    private batchSize = 10,
    private flushInterval = 5000
  ) {
    setInterval(() => this.flush(), flushInterval);
  }

  async get(key: string): Promise<T | null> {
    return this.cache.get(key);
  }

  async set(key: string, data: T): Promise<void> {
    await this.cache.set(key, data);
    this.queueWrite({
      key,
      data,
      operation: "UPDATE",
      timestamp: new Date(),
    });
  }

  async delete(key: string): Promise<void> {
    await this.cache.delete(key);
    this.queueWrite({
      key,
      data: null as any,
      operation: "DELETE",
      timestamp: new Date(),
    });
  }

  private queueWrite(operation: WriteOperation<T>): void {
    this.writeQueue.push(operation);

    if (this.writeQueue.length >= this.batchSize) {
      this.flush();
    }
  }

  private async flush(): Promise<void> {
    if (this.isProcessing || this.writeQueue.length === 0) {
      return;
    }

    this.isProcessing = true;
    const operations = this.writeQueue.splice(0, this.batchSize);

    try {
      await this.processBatch(operations);
    } catch (error) {
      console.error("Failed to flush write operations:", error);
      this.writeQueue.unshift(...operations);
    } finally {
      this.isProcessing = false;
    }
  }

  private async processBatch(operations: WriteOperation<T>[]): Promise<void> {
    for (const op of operations) {
      try {
        switch (op.operation) {
          case "CREATE":
          case "UPDATE":
            await this.dataSource.update(op.key, op.data);
            break;
          case "DELETE":
            await this.dataSource.delete(op.key);
            break;
        }
      } catch (error) {
        console.error(`Failed to process operation for key ${op.key}:`, error);
      }
    }
  }
}
```

## Interview Tips

### Pattern Selection Guide

**When to use Circuit Breaker:**

- External service dependencies
- High failure rates possible
- Need fast failure response

**When to use Saga:**

- Multi-service transactions
- Need compensation logic
- ACID properties across services

**When to use CQRS:**

- Different read/write patterns
- Complex query requirements
- High read/write volume disparity

**When to use Event Sourcing:**

- Audit trail requirements
- Complex business logic
- Temporal queries needed

### Common Interview Questions

1. **How do you handle distributed transactions?**

   - Avoid when possible, use Saga pattern when necessary
   - Discuss eventual consistency vs strong consistency
   - Mention compensation patterns

2. **How do you ensure data consistency across services?**

   - Event-driven architecture
   - Outbox pattern for reliable publishing
   - Database per service principle

3. **How do you handle service failures?**

   - Circuit breakers for fast failures
   - Retry with exponential backoff
   - Bulkhead pattern for isolation
   - Graceful degradation strategies

4. **How do you optimize for performance?**
   - Caching strategies (cache-aside, write-through, write-behind)
   - Asynchronous processing
   - Connection pooling
   - Database sharding and partitioning

### Design Considerations

**Scalability:**

- Horizontal scaling over vertical
- Stateless service design
- Load balancing strategies
- Data partitioning approaches

**Reliability:**

- Redundancy and replication
- Health checks and monitoring
- Graceful degradation
- Disaster recovery planning

**Consistency:**

- Choose appropriate consistency model
- Understand CAP theorem implications
- Plan for network partitions
- Design idempotent operations

**Security:**

- Authentication and authorization
- Service-to-service security
- Data encryption in transit and at rest
- API rate limiting and throttling

These patterns provide the foundation for building robust, scalable distributed systems that can handle real-world production demands while maintaining reliability and performance.
