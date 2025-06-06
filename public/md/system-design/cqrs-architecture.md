# CQRS (Command Query Responsibility Segregation)

## Overview

Command Query Responsibility Segregation (CQRS) is an architectural pattern that separates read and write operations using different models. This separation allows for optimized data models and operations for both reading and writing, leading to better performance, scalability, and maintainability.

## Core Principles

### Separation of Concerns

- **Commands**: Operations that change state (writes)
- **Queries**: Operations that return data (reads)
- **Different Models**: Separate models optimized for their specific purpose

### Eventual Consistency

- Write and read models may be temporarily inconsistent
- Consistency is achieved through event propagation
- Trade-off between consistency and performance

## Basic CQRS Implementation

### Command Side (Write Model)

```typescript
interface Command {
  id: string;
  timestamp: Date;
  userId: string;
}

interface CommandHandler<T extends Command> {
  handle(command: T): Promise<void>;
}

interface CommandResult {
  success: boolean;
  errors?: string[];
  data?: any;
}

abstract class BaseCommand implements Command {
  id: string;
  timestamp: Date;
  userId: string;

  constructor(userId: string) {
    this.id = crypto.randomUUID();
    this.timestamp = new Date();
    this.userId = userId;
  }
}
```

### User Management Commands

```typescript
class CreateUserCommand extends BaseCommand {
  constructor(
    userId: string,
    public readonly userData: {
      name: string;
      email: string;
      role: string;
    }
  ) {
    super(userId);
  }
}

class UpdateUserCommand extends BaseCommand {
  constructor(
    userId: string,
    public readonly targetUserId: string,
    public readonly updates: Partial<{
      name: string;
      email: string;
      role: string;
    }>
  ) {
    super(userId);
  }
}

class DeactivateUserCommand extends BaseCommand {
  constructor(
    userId: string,
    public readonly targetUserId: string,
    public readonly reason: string
  ) {
    super(userId);
  }
}
```

### Command Handlers

```typescript
class CreateUserCommandHandler implements CommandHandler<CreateUserCommand> {
  constructor(
    private userRepository: UserRepository,
    private eventBus: EventBus,
    private validator: UserValidator
  ) {}

  async handle(command: CreateUserCommand): Promise<void> {
    // Validate command
    const validationResult = await this.validator.validateUserData(
      command.userData
    );
    if (!validationResult.isValid) {
      throw new ValidationError(validationResult.errors);
    }

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(
      command.userData.email
    );
    if (existingUser) {
      throw new BusinessError("User with this email already exists");
    }

    // Create user aggregate
    const user = new User(
      crypto.randomUUID(),
      command.userData.name,
      command.userData.email,
      command.userData.role
    );

    // Save to write model
    await this.userRepository.save(user);

    // Publish events
    await this.eventBus.publish(
      new UserCreatedEvent(
        user.id,
        user.name,
        user.email,
        user.role,
        command.timestamp
      )
    );
  }
}

class UpdateUserCommandHandler implements CommandHandler<UpdateUserCommand> {
  constructor(
    private userRepository: UserRepository,
    private eventBus: EventBus,
    private validator: UserValidator
  ) {}

  async handle(command: UpdateUserCommand): Promise<void> {
    const user = await this.userRepository.findById(command.targetUserId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Apply updates
    const updatedUser = user.update(command.updates);

    // Save changes
    await this.userRepository.save(updatedUser);

    // Publish events
    await this.eventBus.publish(
      new UserUpdatedEvent(user.id, command.updates, command.timestamp)
    );
  }
}
```

### Query Side (Read Model)

```typescript
interface Query<T> {
  execute(): Promise<T>;
}

interface QueryHandler<TQuery extends Query<TResult>, TResult> {
  handle(query: TQuery): Promise<TResult>;
}

class GetUserProfileQuery implements Query<UserProfile> {
  constructor(public readonly userId: string) {}

  async execute(): Promise<UserProfile> {
    // This would be handled by a query handler
    throw new Error("Should be handled by QueryHandler");
  }
}

class GetUserListQuery implements Query<UserListResult> {
  constructor(
    public readonly filters: UserFilters,
    public readonly pagination: PaginationOptions
  ) {}

  async execute(): Promise<UserListResult> {
    throw new Error("Should be handled by QueryHandler");
  }
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: Date;
  lastLoginAt?: Date;
  profileImageUrl?: string;
}

interface UserListResult {
  users: UserSummary[];
  totalCount: number;
  hasMore: boolean;
}

interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}
```

### Query Handlers

```typescript
class GetUserProfileQueryHandler
  implements QueryHandler<GetUserProfileQuery, UserProfile>
{
  constructor(private readModelRepository: ReadModelRepository) {}

  async handle(query: GetUserProfileQuery): Promise<UserProfile> {
    const userProfile = await this.readModelRepository.getUserProfile(
      query.userId
    );

    if (!userProfile) {
      throw new NotFoundError("User profile not found");
    }

    return userProfile;
  }
}

class GetUserListQueryHandler
  implements QueryHandler<GetUserListQuery, UserListResult>
{
  constructor(private readModelRepository: ReadModelRepository) {}

  async handle(query: GetUserListQuery): Promise<UserListResult> {
    const result = await this.readModelRepository.getUserList(
      query.filters,
      query.pagination
    );

    return {
      users: result.users,
      totalCount: result.totalCount,
      hasMore:
        result.totalCount > query.pagination.offset + query.pagination.limit,
    };
  }
}
```

## Event-Driven Synchronization

### Events

```typescript
interface DomainEvent {
  id: string;
  aggregateId: string;
  eventType: string;
  eventData: any;
  timestamp: Date;
  version: number;
}

class UserCreatedEvent implements DomainEvent {
  id: string;
  eventType = "UserCreated";
  version = 1;

  constructor(
    public aggregateId: string,
    public name: string,
    public email: string,
    public role: string,
    public timestamp: Date
  ) {
    this.id = crypto.randomUUID();
  }

  get eventData() {
    return {
      name: this.name,
      email: this.email,
      role: this.role,
    };
  }
}

class UserUpdatedEvent implements DomainEvent {
  id: string;
  eventType = "UserUpdated";
  version = 1;

  constructor(
    public aggregateId: string,
    public updates: Record<string, any>,
    public timestamp: Date
  ) {
    this.id = crypto.randomUUID();
  }

  get eventData() {
    return this.updates;
  }
}
```

### Event Handlers for Read Model Updates

```typescript
interface EventHandler<T extends DomainEvent> {
  handle(event: T): Promise<void>;
}

class UserCreatedEventHandler implements EventHandler<UserCreatedEvent> {
  constructor(private readModelRepository: ReadModelRepository) {}

  async handle(event: UserCreatedEvent): Promise<void> {
    const userProfile: UserProfile = {
      id: event.aggregateId,
      name: event.name,
      email: event.email,
      role: event.role,
      status: "active",
      createdAt: event.timestamp,
    };

    await this.readModelRepository.createUserProfile(userProfile);

    // Update denormalized views
    await this.readModelRepository.updateUserList(userProfile);
    await this.readModelRepository.updateRoleStatistics(event.role, 1);
  }
}

class UserUpdatedEventHandler implements EventHandler<UserUpdatedEvent> {
  constructor(private readModelRepository: ReadModelRepository) {}

  async handle(event: UserUpdatedEvent): Promise<void> {
    await this.readModelRepository.updateUserProfile(
      event.aggregateId,
      event.updates
    );

    // Update related denormalized data
    if (event.updates.role) {
      await this.readModelRepository.updateUserRoleInLists(
        event.aggregateId,
        event.updates.role
      );
    }
  }
}
```

## Advanced CQRS Patterns

### Projection Management

```typescript
interface Projection {
  name: string;
  version: number;
  rebuild(): Promise<void>;
  updateFromEvent(event: DomainEvent): Promise<void>;
}

class UserProfileProjection implements Projection {
  name = "UserProfile";
  version = 1;

  constructor(
    private eventStore: EventStore,
    private readModelRepository: ReadModelRepository
  ) {}

  async rebuild(): Promise<void> {
    // Clear existing projection
    await this.readModelRepository.clearUserProfiles();

    // Replay all events
    const events = await this.eventStore.getAllEvents([
      "UserCreated",
      "UserUpdated",
    ]);

    for (const event of events) {
      await this.updateFromEvent(event);
    }
  }

  async updateFromEvent(event: DomainEvent): Promise<void> {
    switch (event.eventType) {
      case "UserCreated":
        await this.handleUserCreated(event as UserCreatedEvent);
        break;
      case "UserUpdated":
        await this.handleUserUpdated(event as UserUpdatedEvent);
        break;
    }
  }

  private async handleUserCreated(event: UserCreatedEvent): Promise<void> {
    const profile: UserProfile = {
      id: event.aggregateId,
      name: event.name,
      email: event.email,
      role: event.role,
      status: "active",
      createdAt: event.timestamp,
    };

    await this.readModelRepository.createUserProfile(profile);
  }

  private async handleUserUpdated(event: UserUpdatedEvent): Promise<void> {
    await this.readModelRepository.updateUserProfile(
      event.aggregateId,
      event.updates
    );
  }
}
```

### Saga Pattern for Complex Workflows

```typescript
interface Saga {
  id: string;
  status: "running" | "completed" | "failed";
  steps: SagaStep[];
}

interface SagaStep {
  name: string;
  status: "pending" | "completed" | "failed";
  compensationCommand?: Command;
}

class UserRegistrationSaga implements Saga {
  id: string;
  status: "running" | "completed" | "failed" = "running";
  steps: SagaStep[] = [];

  constructor() {
    this.id = crypto.randomUUID();
    this.initializeSteps();
  }

  private initializeSteps(): void {
    this.steps = [
      { name: "CreateUser", status: "pending" },
      { name: "SendWelcomeEmail", status: "pending" },
      { name: "CreateUserProfile", status: "pending" },
      { name: "AssignDefaultRole", status: "pending" },
    ];
  }

  async execute(userData: any): Promise<void> {
    try {
      // Step 1: Create User
      await this.executeStep("CreateUser", async () => {
        const command = new CreateUserCommand(userData.userId, userData);
        await this.commandBus.send(command);
      });

      // Step 2: Send Welcome Email
      await this.executeStep("SendWelcomeEmail", async () => {
        const command = new SendWelcomeEmailCommand(
          userData.email,
          userData.name
        );
        await this.commandBus.send(command);
      });

      // Step 3: Create User Profile
      await this.executeStep("CreateUserProfile", async () => {
        const command = new CreateProfileCommand(
          userData.userId,
          userData.profileData
        );
        await this.commandBus.send(command);
      });

      // Step 4: Assign Default Role
      await this.executeStep("AssignDefaultRole", async () => {
        const command = new AssignRoleCommand(userData.userId, "user");
        await this.commandBus.send(command);
      });

      this.status = "completed";
    } catch (error) {
      this.status = "failed";
      await this.compensate();
      throw error;
    }
  }

  private async executeStep(
    stepName: string,
    action: () => Promise<void>
  ): Promise<void> {
    const step = this.steps.find((s) => s.name === stepName);
    if (!step) throw new Error(`Step ${stepName} not found`);

    try {
      await action();
      step.status = "completed";
    } catch (error) {
      step.status = "failed";
      throw error;
    }
  }

  private async compensate(): Promise<void> {
    const completedSteps = this.steps
      .filter((s) => s.status === "completed")
      .reverse();

    for (const step of completedSteps) {
      if (step.compensationCommand) {
        try {
          await this.commandBus.send(step.compensationCommand);
        } catch (error) {
          console.error(`Compensation failed for step ${step.name}:`, error);
        }
      }
    }
  }
}
```

## Read Model Optimization

### Denormalization Strategies

```typescript
class DenormalizedReadModel {
  constructor(private database: Database) {}

  // Denormalized user data with embedded relationships
  async createUserDocument(event: UserCreatedEvent): Promise<void> {
    const userDocument = {
      id: event.aggregateId,
      name: event.name,
      email: event.email,
      role: event.role,
      status: "active",
      createdAt: event.timestamp,

      // Embedded profile data
      profile: {
        bio: "",
        avatar: "",
        preferences: {},
      },

      // Embedded statistics
      stats: {
        loginCount: 0,
        lastLoginAt: null,
        postsCount: 0,
        followersCount: 0,
      },

      // Embedded permissions based on role
      permissions: this.getPermissionsForRole(event.role),
    };

    await this.database.collection("users").insertOne(userDocument);
  }

  // Materialized view for user listings
  async updateUserListView(userId: string, updates: any): Promise<void> {
    await this.database
      .collection("user_list_view")
      .updateOne({ id: userId }, { $set: updates });
  }

  // Aggregated statistics
  async updateUserRoleStats(role: string, delta: number): Promise<void> {
    await this.database
      .collection("role_stats")
      .updateOne({ role }, { $inc: { count: delta } }, { upsert: true });
  }
}
```

### Caching Strategies

```typescript
class CachedReadModel {
  constructor(
    private cache: CacheService,
    private database: Database,
    private ttl: number = 3600 // 1 hour
  ) {}

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const cacheKey = `user:profile:${userId}`;

    // Try cache first
    const cached = await this.cache.get<UserProfile>(cacheKey);
    if (cached) {
      return cached;
    }

    // Fallback to database
    const profile = await this.database
      .collection("users")
      .findOne({ id: userId });
    if (profile) {
      await this.cache.set(cacheKey, profile, this.ttl);
    }

    return profile;
  }

  async invalidateUserCache(userId: string): Promise<void> {
    const patterns = [
      `user:profile:${userId}`,
      `user:list:*`, // Invalidate list caches that might contain this user
      `user:stats:*`,
    ];

    for (const pattern of patterns) {
      await this.cache.delete(pattern);
    }
  }

  async getUserList(filters: UserFilters): Promise<UserListResult> {
    const cacheKey = `user:list:${this.hashFilters(filters)}`;

    const cached = await this.cache.get<UserListResult>(cacheKey);
    if (cached) {
      return cached;
    }

    const result = await this.queryUserList(filters);
    await this.cache.set(cacheKey, result, this.ttl);

    return result;
  }
}
```

## Error Handling and Resilience

### Command Validation

```typescript
interface ValidationRule<T> {
  validate(value: T): ValidationResult;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

class CreateUserCommandValidator {
  private rules: ValidationRule<CreateUserCommand>[] = [];

  constructor() {
    this.rules = [
      new EmailValidationRule(),
      new NameValidationRule(),
      new RoleValidationRule(),
    ];
  }

  validate(command: CreateUserCommand): ValidationResult {
    const errors: string[] = [];

    for (const rule of this.rules) {
      const result = rule.validate(command);
      if (!result.isValid) {
        errors.push(...result.errors);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

class EmailValidationRule implements ValidationRule<CreateUserCommand> {
  validate(command: CreateUserCommand): ValidationResult {
    const email = command.userData.email;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      return {
        isValid: false,
        errors: ["Invalid email format"],
      };
    }

    return { isValid: true, errors: [] };
  }
}
```

### Eventual Consistency Handling

```typescript
class EventualConsistencyManager {
  constructor(private eventBus: EventBus, private retryPolicy: RetryPolicy) {}

  async handleEventProcessingFailure(
    event: DomainEvent,
    handler: string,
    error: Error
  ): Promise<void> {
    const failureEvent = new EventProcessingFailedEvent(
      event.id,
      handler,
      error.message,
      new Date()
    );

    await this.eventBus.publish(failureEvent);

    // Retry with exponential backoff
    await this.retryPolicy.execute(async () => {
      await this.reprocessEvent(event, handler);
    });
  }

  async ensureEventualConsistency(): Promise<void> {
    // Check for unprocessed events
    const unprocessedEvents = await this.findUnprocessedEvents();

    for (const event of unprocessedEvents) {
      try {
        await this.processEvent(event);
      } catch (error) {
        console.error(`Failed to process event ${event.id}:`, error);
        // Handle failure appropriately
      }
    }
  }

  private async findUnprocessedEvents(): Promise<DomainEvent[]> {
    // Query for events that haven't been processed by all handlers
    return await this.eventStore.getUnprocessedEvents();
  }
}
```

## Testing Strategies

### Command Testing

```typescript
describe("CreateUserCommandHandler", () => {
  let handler: CreateUserCommandHandler;
  let mockRepository: jest.Mocked<UserRepository>;
  let mockEventBus: jest.Mocked<EventBus>;
  let mockValidator: jest.Mocked<UserValidator>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
    } as any;

    mockEventBus = {
      publish: jest.fn(),
    } as any;

    mockValidator = {
      validateUserData: jest.fn(),
    } as any;

    handler = new CreateUserCommandHandler(
      mockRepository,
      mockEventBus,
      mockValidator
    );
  });

  it("should create user successfully", async () => {
    // Arrange
    const command = new CreateUserCommand("user-123", {
      name: "John Doe",
      email: "john@example.com",
      role: "user",
    });

    mockValidator.validateUserData.mockResolvedValue({
      isValid: true,
      errors: [],
    });
    mockRepository.findByEmail.mockResolvedValue(null);

    // Act
    await handler.handle(command);

    // Assert
    expect(mockRepository.save).toHaveBeenCalled();
    expect(mockEventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: "UserCreated",
        name: "John Doe",
        email: "john@example.com",
      })
    );
  });

  it("should throw error when user already exists", async () => {
    // Arrange
    const command = new CreateUserCommand("user-123", {
      name: "John Doe",
      email: "john@example.com",
      role: "user",
    });

    mockValidator.validateUserData.mockResolvedValue({
      isValid: true,
      errors: [],
    });
    mockRepository.findByEmail.mockResolvedValue({
      id: "existing-user",
    } as any);

    // Act & Assert
    await expect(handler.handle(command)).rejects.toThrow(
      "User with this email already exists"
    );
    expect(mockRepository.save).not.toHaveBeenCalled();
    expect(mockEventBus.publish).not.toHaveBeenCalled();
  });
});
```

### Query Testing

```typescript
describe("GetUserProfileQueryHandler", () => {
  let handler: GetUserProfileQueryHandler;
  let mockRepository: jest.Mocked<ReadModelRepository>;

  beforeEach(() => {
    mockRepository = {
      getUserProfile: jest.fn(),
    } as any;

    handler = new GetUserProfileQueryHandler(mockRepository);
  });

  it("should return user profile", async () => {
    // Arrange
    const expectedProfile: UserProfile = {
      id: "user-123",
      name: "John Doe",
      email: "john@example.com",
      role: "user",
      status: "active",
      createdAt: new Date(),
    };

    mockRepository.getUserProfile.mockResolvedValue(expectedProfile);

    const query = new GetUserProfileQuery("user-123");

    // Act
    const result = await handler.handle(query);

    // Assert
    expect(result).toEqual(expectedProfile);
    expect(mockRepository.getUserProfile).toHaveBeenCalledWith("user-123");
  });
});
```

## Real-World Implementation Example

### E-commerce Order System

```typescript
// Commands
class CreateOrderCommand extends BaseCommand {
  constructor(
    userId: string,
    public readonly orderData: {
      items: OrderItem[];
      shippingAddress: Address;
      paymentMethod: string;
    }
  ) {
    super(userId);
  }
}

class UpdateOrderStatusCommand extends BaseCommand {
  constructor(
    userId: string,
    public readonly orderId: string,
    public readonly status: OrderStatus,
    public readonly reason?: string
  ) {
    super(userId);
  }
}

// Queries
class GetOrderHistoryQuery implements Query<OrderHistoryResult> {
  constructor(
    public readonly userId: string,
    public readonly pagination: PaginationOptions
  ) {}

  async execute(): Promise<OrderHistoryResult> {
    throw new Error("Handled by QueryHandler");
  }
}

class GetOrderAnalyticsQuery implements Query<OrderAnalytics> {
  constructor(
    public readonly dateRange: DateRange,
    public readonly filters: AnalyticsFilters
  ) {}

  async execute(): Promise<OrderAnalytics> {
    throw new Error("Handled by QueryHandler");
  }
}

// Event Handlers for Read Model
class OrderCreatedEventHandler implements EventHandler<OrderCreatedEvent> {
  async handle(event: OrderCreatedEvent): Promise<void> {
    // Update order list view
    await this.readModelRepository.addToOrderList({
      id: event.aggregateId,
      userId: event.userId,
      status: "pending",
      total: event.total,
      createdAt: event.timestamp,
    });

    // Update user statistics
    await this.readModelRepository.incrementUserOrderCount(event.userId);

    // Update product statistics
    for (const item of event.items) {
      await this.readModelRepository.updateProductOrderCount(
        item.productId,
        item.quantity
      );
    }
  }
}
```

## Benefits of CQRS

### Performance Benefits

- **Optimized Reads**: Read models can be denormalized for fast queries
- **Optimized Writes**: Write models can focus on business logic and validation
- **Independent Scaling**: Scale read and write sides independently

### Flexibility Benefits

- **Technology Diversity**: Use different databases for reads and writes
- **Model Evolution**: Evolve read and write models independently
- **Multiple Views**: Create multiple read models for different use cases

### Maintenance Benefits

- **Separation of Concerns**: Clear separation between read and write logic
- **Testability**: Easy to test commands and queries independently
- **Debugging**: Clear audit trail through events

## Challenges and Considerations

### Complexity

- Increased architectural complexity
- More moving parts to manage
- Steeper learning curve

### Eventual Consistency

- Read models may lag behind write models
- Need to handle stale data scenarios
- Complex consistency requirements may not be suitable

### Operational Overhead

- More infrastructure to manage
- Event sourcing and projection management
- Monitoring and debugging complexity

CQRS is a powerful architectural pattern that provides significant benefits for complex systems with different read and write requirements. When combined with Event Sourcing, it creates a robust foundation for scalable, maintainable applications.
