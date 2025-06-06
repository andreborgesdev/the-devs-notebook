# Hexagonal Architecture (Ports and Adapters)

## Overview

Hexagonal Architecture, also known as Ports and Adapters pattern, is an architectural pattern that isolates the core business logic from external concerns through well-defined interfaces. It promotes testability, maintainability, and flexibility by creating a clear separation between the application's business rules and its infrastructure dependencies.

## Core Concepts

### The Hexagon

The hexagon represents the application's core business logic, completely isolated from external systems and infrastructure concerns.

### Ports

Ports are interfaces that define how the application communicates with the outside world. They represent the application's API and define contracts for external interactions.

### Adapters

Adapters implement the ports and handle the actual communication with external systems like databases, web frameworks, message queues, etc.

### Dependency Inversion

External systems depend on the core application through ports, not the other way around. This allows the core logic to remain independent of infrastructure concerns.

## Architecture Structure

```typescript
// Core Domain (Inner Hexagon)
interface Port {
  // Defines the contract for external communication
}

class BusinessLogic {
  // Contains core business rules and logic
  // Depends only on ports, not on concrete implementations
}

// Infrastructure (Outer Hexagon)
class Adapter implements Port {
  // Implements the port interface
  // Handles actual communication with external systems
}
```

## Implementation Example: User Management System

### Domain Layer (Core)

```typescript
// Domain Entities
class User {
  constructor(
    private readonly id: UserId,
    private name: string,
    private email: Email,
    private status: UserStatus,
    private createdAt: Date
  ) {}

  updateName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new DomainError("Name cannot be empty");
    }
    this.name = newName;
  }

  updateEmail(newEmail: Email): void {
    this.email = newEmail;
  }

  activate(): void {
    if (this.status === UserStatus.ACTIVE) {
      throw new DomainError("User is already active");
    }
    this.status = UserStatus.ACTIVE;
  }

  deactivate(): void {
    if (this.status === UserStatus.INACTIVE) {
      throw new DomainError("User is already inactive");
    }
    this.status = UserStatus.INACTIVE;
  }

  getId(): UserId {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): Email {
    return this.email;
  }

  getStatus(): UserStatus {
    return this.status;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }
}

// Value Objects
class UserId {
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new DomainError("User ID cannot be empty");
    }
  }

  toString(): string {
    return this.value;
  }

  equals(other: UserId): boolean {
    return this.value === other.value;
  }
}

class Email {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(private readonly value: string) {
    if (!Email.EMAIL_REGEX.test(value)) {
      throw new DomainError("Invalid email format");
    }
  }

  toString(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}

enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
}

class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DomainError";
  }
}
```

### Ports (Interfaces)

```typescript
// Primary Ports (Driving Side - Application API)
interface UserService {
  createUser(userData: CreateUserRequest): Promise<CreateUserResponse>;
  getUserById(userId: string): Promise<GetUserResponse>;
  updateUser(
    userId: string,
    updates: UpdateUserRequest
  ): Promise<UpdateUserResponse>;
  activateUser(userId: string): Promise<void>;
  deactivateUser(userId: string): Promise<void>;
  searchUsers(criteria: SearchCriteria): Promise<SearchUsersResponse>;
}

interface CreateUserRequest {
  name: string;
  email: string;
}

interface CreateUserResponse {
  userId: string;
  name: string;
  email: string;
  status: string;
  createdAt: Date;
}

interface GetUserResponse {
  userId: string;
  name: string;
  email: string;
  status: string;
  createdAt: Date;
}

interface UpdateUserRequest {
  name?: string;
  email?: string;
}

interface UpdateUserResponse {
  userId: string;
  name: string;
  email: string;
  status: string;
  updatedAt: Date;
}

interface SearchCriteria {
  name?: string;
  email?: string;
  status?: UserStatus;
  limit?: number;
  offset?: number;
}

interface SearchUsersResponse {
  users: GetUserResponse[];
  totalCount: number;
  hasMore: boolean;
}

// Secondary Ports (Driven Side - Infrastructure Dependencies)
interface UserRepository {
  save(user: User): Promise<void>;
  findById(userId: UserId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  findByCriteria(criteria: SearchCriteria): Promise<User[]>;
  count(criteria: SearchCriteria): Promise<number>;
  delete(userId: UserId): Promise<void>;
}

interface EmailService {
  sendWelcomeEmail(email: string, name: string): Promise<void>;
  sendAccountActivationEmail(email: string, name: string): Promise<void>;
  sendAccountDeactivationEmail(email: string, name: string): Promise<void>;
}

interface EventPublisher {
  publishUserCreated(event: UserCreatedEvent): Promise<void>;
  publishUserUpdated(event: UserUpdatedEvent): Promise<void>;
  publishUserActivated(event: UserActivatedEvent): Promise<void>;
  publishUserDeactivated(event: UserDeactivatedEvent): Promise<void>;
}

interface Logger {
  info(message: string, context?: any): void;
  warn(message: string, context?: any): void;
  error(message: string, error?: Error, context?: any): void;
}
```

### Application Service (Core Business Logic)

```typescript
class UserServiceImpl implements UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
    private readonly eventPublisher: EventPublisher,
    private readonly logger: Logger
  ) {}

  async createUser(userData: CreateUserRequest): Promise<CreateUserResponse> {
    try {
      this.logger.info("Creating new user", { email: userData.email });

      // Validate business rules
      const email = new Email(userData.email);
      const existingUser = await this.userRepository.findByEmail(email);

      if (existingUser) {
        throw new BusinessError("User with this email already exists");
      }

      // Create user
      const userId = new UserId(this.generateUserId());
      const user = new User(
        userId,
        userData.name,
        email,
        UserStatus.ACTIVE,
        new Date()
      );

      // Save user
      await this.userRepository.save(user);

      // Send welcome email
      await this.emailService.sendWelcomeEmail(email.toString(), userData.name);

      // Publish domain event
      await this.eventPublisher.publishUserCreated(
        new UserCreatedEvent(
          userId.toString(),
          userData.name,
          email.toString(),
          new Date()
        )
      );

      this.logger.info("User created successfully", {
        userId: userId.toString(),
      });

      return {
        userId: userId.toString(),
        name: user.getName(),
        email: user.getEmail().toString(),
        status: user.getStatus(),
        createdAt: user.getCreatedAt(),
      };
    } catch (error) {
      this.logger.error("Failed to create user", error, {
        email: userData.email,
      });
      throw error;
    }
  }

  async getUserById(userId: string): Promise<GetUserResponse> {
    try {
      const userIdObj = new UserId(userId);
      const user = await this.userRepository.findById(userIdObj);

      if (!user) {
        throw new NotFoundError("User not found");
      }

      return {
        userId: user.getId().toString(),
        name: user.getName(),
        email: user.getEmail().toString(),
        status: user.getStatus(),
        createdAt: user.getCreatedAt(),
      };
    } catch (error) {
      this.logger.error("Failed to get user", error, { userId });
      throw error;
    }
  }

  async updateUser(
    userId: string,
    updates: UpdateUserRequest
  ): Promise<UpdateUserResponse> {
    try {
      const userIdObj = new UserId(userId);
      const user = await this.userRepository.findById(userIdObj);

      if (!user) {
        throw new NotFoundError("User not found");
      }

      // Apply updates
      if (updates.name) {
        user.updateName(updates.name);
      }

      if (updates.email) {
        const newEmail = new Email(updates.email);
        const existingUser = await this.userRepository.findByEmail(newEmail);

        if (existingUser && !existingUser.getId().equals(userIdObj)) {
          throw new BusinessError("Email is already in use by another user");
        }

        user.updateEmail(newEmail);
      }

      // Save changes
      await this.userRepository.save(user);

      // Publish domain event
      await this.eventPublisher.publishUserUpdated(
        new UserUpdatedEvent(userId, updates, new Date())
      );

      this.logger.info("User updated successfully", { userId });

      return {
        userId: user.getId().toString(),
        name: user.getName(),
        email: user.getEmail().toString(),
        status: user.getStatus(),
        updatedAt: new Date(),
      };
    } catch (error) {
      this.logger.error("Failed to update user", error, { userId });
      throw error;
    }
  }

  async activateUser(userId: string): Promise<void> {
    try {
      const userIdObj = new UserId(userId);
      const user = await this.userRepository.findById(userIdObj);

      if (!user) {
        throw new NotFoundError("User not found");
      }

      user.activate();
      await this.userRepository.save(user);

      await this.emailService.sendAccountActivationEmail(
        user.getEmail().toString(),
        user.getName()
      );

      await this.eventPublisher.publishUserActivated(
        new UserActivatedEvent(userId, new Date())
      );

      this.logger.info("User activated successfully", { userId });
    } catch (error) {
      this.logger.error("Failed to activate user", error, { userId });
      throw error;
    }
  }

  async searchUsers(criteria: SearchCriteria): Promise<SearchUsersResponse> {
    try {
      const users = await this.userRepository.findByCriteria(criteria);
      const totalCount = await this.userRepository.count(criteria);

      const userResponses = users.map((user) => ({
        userId: user.getId().toString(),
        name: user.getName(),
        email: user.getEmail().toString(),
        status: user.getStatus(),
        createdAt: user.getCreatedAt(),
      }));

      return {
        users: userResponses,
        totalCount,
        hasMore: (criteria.offset || 0) + users.length < totalCount,
      };
    } catch (error) {
      this.logger.error("Failed to search users", error, { criteria });
      throw error;
    }
  }

  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

class BusinessError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BusinessError";
  }
}

class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}
```

### Domain Events

```typescript
interface DomainEvent {
  eventId: string;
  occurredAt: Date;
}

class UserCreatedEvent implements DomainEvent {
  eventId: string;
  occurredAt: Date;

  constructor(
    public readonly userId: string,
    public readonly name: string,
    public readonly email: string,
    occurredAt: Date
  ) {
    this.eventId = `user_created_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    this.occurredAt = occurredAt;
  }
}

class UserUpdatedEvent implements DomainEvent {
  eventId: string;
  occurredAt: Date;

  constructor(
    public readonly userId: string,
    public readonly updates: Record<string, any>,
    occurredAt: Date
  ) {
    this.eventId = `user_updated_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    this.occurredAt = occurredAt;
  }
}

class UserActivatedEvent implements DomainEvent {
  eventId: string;
  occurredAt: Date;

  constructor(public readonly userId: string, occurredAt: Date) {
    this.eventId = `user_activated_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    this.occurredAt = occurredAt;
  }
}

class UserDeactivatedEvent implements DomainEvent {
  eventId: string;
  occurredAt: Date;

  constructor(public readonly userId: string, occurredAt: Date) {
    this.eventId = `user_deactivated_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    this.occurredAt = occurredAt;
  }
}
```

## Adapters (Infrastructure)

### Database Adapter

```typescript
class MongoUserRepository implements UserRepository {
  constructor(
    private readonly database: Database,
    private readonly collectionName: string = "users"
  ) {}

  async save(user: User): Promise<void> {
    const collection = this.database.collection(this.collectionName);
    const document = this.toDocument(user);

    await collection.replaceOne({ _id: document._id }, document, {
      upsert: true,
    });
  }

  async findById(userId: UserId): Promise<User | null> {
    const collection = this.database.collection(this.collectionName);
    const document = await collection.findOne({ _id: userId.toString() });

    return document ? this.toDomain(document) : null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const collection = this.database.collection(this.collectionName);
    const document = await collection.findOne({ email: email.toString() });

    return document ? this.toDomain(document) : null;
  }

  async findByCriteria(criteria: SearchCriteria): Promise<User[]> {
    const collection = this.database.collection(this.collectionName);
    const query = this.buildQuery(criteria);

    const documents = await collection
      .find(query)
      .limit(criteria.limit || 50)
      .skip(criteria.offset || 0)
      .toArray();

    return documents.map((doc) => this.toDomain(doc));
  }

  async count(criteria: SearchCriteria): Promise<number> {
    const collection = this.database.collection(this.collectionName);
    const query = this.buildQuery(criteria);

    return await collection.countDocuments(query);
  }

  async delete(userId: UserId): Promise<void> {
    const collection = this.database.collection(this.collectionName);
    await collection.deleteOne({ _id: userId.toString() });
  }

  private toDocument(user: User): any {
    return {
      _id: user.getId().toString(),
      name: user.getName(),
      email: user.getEmail().toString(),
      status: user.getStatus(),
      createdAt: user.getCreatedAt(),
    };
  }

  private toDomain(document: any): User {
    return new User(
      new UserId(document._id),
      document.name,
      new Email(document.email),
      document.status,
      document.createdAt
    );
  }

  private buildQuery(criteria: SearchCriteria): any {
    const query: any = {};

    if (criteria.name) {
      query.name = { $regex: criteria.name, $options: "i" };
    }

    if (criteria.email) {
      query.email = { $regex: criteria.email, $options: "i" };
    }

    if (criteria.status) {
      query.status = criteria.status;
    }

    return query;
  }
}
```

### Email Service Adapter

```typescript
class SMTPEmailService implements EmailService {
  constructor(
    private readonly smtpClient: SMTPClient,
    private readonly templateEngine: TemplateEngine
  ) {}

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const template = await this.templateEngine.render("welcome", { name });

    await this.smtpClient.send({
      to: email,
      subject: "Welcome to Our Platform!",
      html: template,
    });
  }

  async sendAccountActivationEmail(email: string, name: string): Promise<void> {
    const template = await this.templateEngine.render("activation", { name });

    await this.smtpClient.send({
      to: email,
      subject: "Account Activated",
      html: template,
    });
  }

  async sendAccountDeactivationEmail(
    email: string,
    name: string
  ): Promise<void> {
    const template = await this.templateEngine.render("deactivation", { name });

    await this.smtpClient.send({
      to: email,
      subject: "Account Deactivated",
      html: template,
    });
  }
}
```

### Event Publisher Adapter

```typescript
class RabbitMQEventPublisher implements EventPublisher {
  constructor(
    private readonly messageQueue: MessageQueue,
    private readonly exchangeName: string = "domain_events"
  ) {}

  async publishUserCreated(event: UserCreatedEvent): Promise<void> {
    await this.messageQueue.publish(
      this.exchangeName,
      "user.created",
      JSON.stringify(event)
    );
  }

  async publishUserUpdated(event: UserUpdatedEvent): Promise<void> {
    await this.messageQueue.publish(
      this.exchangeName,
      "user.updated",
      JSON.stringify(event)
    );
  }

  async publishUserActivated(event: UserActivatedEvent): Promise<void> {
    await this.messageQueue.publish(
      this.exchangeName,
      "user.activated",
      JSON.stringify(event)
    );
  }

  async publishUserDeactivated(event: UserDeactivatedEvent): Promise<void> {
    await this.messageQueue.publish(
      this.exchangeName,
      "user.deactivated",
      JSON.stringify(event)
    );
  }
}
```

### HTTP REST Adapter

```typescript
class UserController {
  constructor(private readonly userService: UserService) {}

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const createUserRequest: CreateUserRequest = {
        name: req.body.name,
        email: req.body.email,
      };

      const response = await this.userService.createUser(createUserRequest);

      res.status(201).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      const response = await this.userService.getUserById(userId);

      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      const updateRequest: UpdateUserRequest = {
        name: req.body.name,
        email: req.body.email,
      };

      const response = await this.userService.updateUser(userId, updateRequest);

      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async activateUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      await this.userService.activateUser(userId);

      res.status(204).send();
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async searchUsers(req: Request, res: Response): Promise<void> {
    try {
      const searchCriteria: SearchCriteria = {
        name: req.query.name as string,
        email: req.query.email as string,
        status: req.query.status as UserStatus,
        limit: parseInt(req.query.limit as string) || 50,
        offset: parseInt(req.query.offset as string) || 0,
      };

      const response = await this.userService.searchUsers(searchCriteria);

      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  private handleError(error: Error, res: Response): void {
    if (error instanceof DomainError || error instanceof BusinessError) {
      res.status(400).json({ error: error.message });
    } else if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
```

### GraphQL Adapter

```typescript
class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserResponse)
  async user(@Arg("id") id: string): Promise<GetUserResponse> {
    return await this.userService.getUserById(id);
  }

  @Query(() => [UserResponse])
  async users(
    @Arg("criteria", { nullable: true }) criteria?: SearchCriteriaInput
  ): Promise<SearchUsersResponse> {
    const searchCriteria: SearchCriteria = criteria || {};
    return await this.userService.searchUsers(searchCriteria);
  }

  @Mutation(() => UserResponse)
  async createUser(
    @Arg("input") input: CreateUserInput
  ): Promise<CreateUserResponse> {
    const createUserRequest: CreateUserRequest = {
      name: input.name,
      email: input.email,
    };

    return await this.userService.createUser(createUserRequest);
  }

  @Mutation(() => UserResponse)
  async updateUser(
    @Arg("id") id: string,
    @Arg("input") input: UpdateUserInput
  ): Promise<UpdateUserResponse> {
    const updateRequest: UpdateUserRequest = {
      name: input.name,
      email: input.email,
    };

    return await this.userService.updateUser(id, updateRequest);
  }

  @Mutation(() => Boolean)
  async activateUser(@Arg("id") id: string): Promise<boolean> {
    await this.userService.activateUser(id);
    return true;
  }
}
```

## Dependency Injection and Configuration

### Application Composition

```typescript
class ApplicationContainer {
  private readonly container: Container;

  constructor() {
    this.container = new Container();
    this.configureContainer();
  }

  private configureContainer(): void {
    // Infrastructure adapters
    this.container.bind<Database>("Database").to(MongoDatabase);
    this.container.bind<MessageQueue>("MessageQueue").to(RabbitMQAdapter);
    this.container.bind<SMTPClient>("SMTPClient").to(NodemailerSMTPClient);
    this.container
      .bind<TemplateEngine>("TemplateEngine")
      .to(HandlebarsTemplateEngine);
    this.container.bind<Logger>("Logger").to(WinstonLogger);

    // Secondary adapters (driven)
    this.container
      .bind<UserRepository>("UserRepository")
      .to(MongoUserRepository);
    this.container.bind<EmailService>("EmailService").to(SMTPEmailService);
    this.container
      .bind<EventPublisher>("EventPublisher")
      .to(RabbitMQEventPublisher);

    // Core service
    this.container.bind<UserService>("UserService").to(UserServiceImpl);

    // Primary adapters (driving)
    this.container.bind<UserController>("UserController").to(UserController);
    this.container.bind<UserResolver>("UserResolver").to(UserResolver);
  }

  get<T>(token: string): T {
    return this.container.get<T>(token);
  }
}
```

### Application Bootstrap

```typescript
class Application {
  private readonly container: ApplicationContainer;
  private readonly httpServer: HttpServer;
  private readonly graphqlServer: GraphQLServer;

  constructor() {
    this.container = new ApplicationContainer();
    this.httpServer = new HttpServer();
    this.graphqlServer = new GraphQLServer();
  }

  async start(): Promise<void> {
    // Configure HTTP routes
    const userController = this.container.get<UserController>("UserController");
    this.httpServer.configureRoutes(userController);

    // Configure GraphQL schema
    const userResolver = this.container.get<UserResolver>("UserResolver");
    this.graphqlServer.configureResolvers(userResolver);

    // Start servers
    await this.httpServer.start();
    await this.graphqlServer.start();

    console.log("Application started successfully");
  }

  async stop(): Promise<void> {
    await this.httpServer.stop();
    await this.graphqlServer.stop();
    console.log("Application stopped");
  }
}
```

## Testing Strategies

### Unit Testing Core Logic

```typescript
describe("UserServiceImpl", () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockEmailService: jest.Mocked<EmailService>;
  let mockEventPublisher: jest.Mocked<EventPublisher>;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(() => {
    mockUserRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByCriteria: jest.fn(),
      count: jest.fn(),
      delete: jest.fn(),
    };

    mockEmailService = {
      sendWelcomeEmail: jest.fn(),
      sendAccountActivationEmail: jest.fn(),
      sendAccountDeactivationEmail: jest.fn(),
    };

    mockEventPublisher = {
      publishUserCreated: jest.fn(),
      publishUserUpdated: jest.fn(),
      publishUserActivated: jest.fn(),
      publishUserDeactivated: jest.fn(),
    };

    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };

    userService = new UserServiceImpl(
      mockUserRepository,
      mockEmailService,
      mockEventPublisher,
      mockLogger
    );
  });

  describe("createUser", () => {
    it("should create user successfully", async () => {
      // Arrange
      const createUserRequest: CreateUserRequest = {
        name: "John Doe",
        email: "john@example.com",
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);

      // Act
      const result = await userService.createUser(createUserRequest);

      // Assert
      expect(result.name).toBe("John Doe");
      expect(result.email).toBe("john@example.com");
      expect(result.status).toBe(UserStatus.ACTIVE);
      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalledWith(
        "john@example.com",
        "John Doe"
      );
      expect(mockEventPublisher.publishUserCreated).toHaveBeenCalled();
    });

    it("should throw error when user already exists", async () => {
      // Arrange
      const createUserRequest: CreateUserRequest = {
        name: "John Doe",
        email: "john@example.com",
      };

      const existingUser = new User(
        new UserId("existing-user"),
        "Existing User",
        new Email("john@example.com"),
        UserStatus.ACTIVE,
        new Date()
      );

      mockUserRepository.findByEmail.mockResolvedValue(existingUser);

      // Act & Assert
      await expect(userService.createUser(createUserRequest)).rejects.toThrow(
        "User with this email already exists"
      );

      expect(mockUserRepository.save).not.toHaveBeenCalled();
      expect(mockEmailService.sendWelcomeEmail).not.toHaveBeenCalled();
    });
  });
});
```

### Integration Testing with Test Doubles

```typescript
describe("UserService Integration Tests", () => {
  let userService: UserService;
  let inMemoryUserRepository: InMemoryUserRepository;
  let mockEmailService: MockEmailService;

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    mockEmailService = new MockEmailService();
    const mockEventPublisher = new MockEventPublisher();
    const mockLogger = new ConsoleLogger();

    userService = new UserServiceImpl(
      inMemoryUserRepository,
      mockEmailService,
      mockEventPublisher,
      mockLogger
    );
  });

  it("should handle complete user lifecycle", async () => {
    // Create user
    const createRequest: CreateUserRequest = {
      name: "John Doe",
      email: "john@example.com",
    };

    const createResponse = await userService.createUser(createRequest);
    expect(createResponse.name).toBe("John Doe");

    // Get user
    const getResponse = await userService.getUserById(createResponse.userId);
    expect(getResponse.name).toBe("John Doe");

    // Update user
    const updateRequest: UpdateUserRequest = {
      name: "John Smith",
    };

    const updateResponse = await userService.updateUser(
      createResponse.userId,
      updateRequest
    );
    expect(updateResponse.name).toBe("John Smith");

    // Verify email was sent
    expect(mockEmailService.getEmailsSent()).toHaveLength(1);
    expect(mockEmailService.getEmailsSent()[0].to).toBe("john@example.com");
  });
});

class InMemoryUserRepository implements UserRepository {
  private users: Map<string, User> = new Map();

  async save(user: User): Promise<void> {
    this.users.set(user.getId().toString(), user);
  }

  async findById(userId: UserId): Promise<User | null> {
    return this.users.get(userId.toString()) || null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.getEmail().equals(email)) {
        return user;
      }
    }
    return null;
  }

  // ... other methods
}
```

## Benefits of Hexagonal Architecture

### Testability

- Core business logic can be tested in isolation
- Easy to create test doubles for external dependencies
- Clear separation between business logic and infrastructure

### Maintainability

- Clear boundaries between different concerns
- Changes to external systems don't affect business logic
- Easy to understand and modify code structure

### Flexibility

- Easy to swap implementations of external dependencies
- Can support multiple interfaces (REST, GraphQL, CLI)
- Technology-agnostic core business logic

### Scalability

- Different parts of the system can be scaled independently
- Infrastructure adapters can be optimized separately
- Clear interfaces make it easy to introduce caching, load balancing, etc.

## Challenges and Considerations

### Initial Complexity

- More upfront design and architecture decisions
- Steeper learning curve for developers new to the pattern
- More interfaces and classes to manage

### Over-abstraction

- Risk of creating unnecessary abstractions
- Can lead to overly complex code for simple applications
- Balance between flexibility and simplicity

### Performance Considerations

- Additional layers may introduce slight performance overhead
- Careful design needed for high-performance requirements
- Consider the cost of abstraction vs. benefits

## Best Practices

### Port Design

- Keep ports focused and cohesive
- Use domain language in port interfaces
- Avoid leaking infrastructure concerns into ports

### Adapter Implementation

- Keep adapters thin and focused on translation
- Handle infrastructure-specific concerns in adapters
- Use appropriate error handling and logging

### Dependency Management

- Use dependency injection containers for complex applications
- Consider using factory patterns for adapter creation
- Keep configuration externalized and environment-specific

### Testing Strategy

- Focus unit tests on core business logic
- Use integration tests for adapter implementations
- Create comprehensive test suites with different test doubles

Hexagonal Architecture provides a robust foundation for building maintainable, testable, and flexible applications. When implemented correctly, it creates clear boundaries between business logic and infrastructure concerns, making systems easier to understand, test, and evolve over time.
