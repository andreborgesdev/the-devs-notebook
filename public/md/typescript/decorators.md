# TypeScript Decorators

## Decorator Fundamentals

### What are Decorators?

Decorators are a special kind of declaration that can be attached to classes, methods, accessors, properties, or parameters. They use the `@expression` syntax and are executed at runtime.

```typescript
// Enable decorators in tsconfig.json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}

// Basic decorator structure
function MyDecorator(target: any, propertyKey?: string, descriptor?: PropertyDescriptor) {
  console.log('Decorator called!');
}

@MyDecorator
class Example {
  @MyDecorator
  property: string = "value";

  @MyDecorator
  method() {
    return "Hello World";
  }
}
```

### Decorator Types

```typescript
// Class decorator
function ClassDecorator<T extends { new (...args: any[]): {} }>(
  constructor: T
) {
  return class extends constructor {
    newProperty = "new property";
    hello = "override";
  };
}

// Method decorator
function MethodDecorator(
  target: any,
  propertyName: string,
  descriptor: PropertyDescriptor
) {
  console.log("Method decorator called");
}

// Property decorator
function PropertyDecorator(target: any, propertyName: string) {
  console.log("Property decorator called");
}

// Parameter decorator
function ParameterDecorator(
  target: any,
  propertyName: string,
  parameterIndex: number
) {
  console.log("Parameter decorator called");
}

// Accessor decorator
function AccessorDecorator(
  target: any,
  propertyName: string,
  descriptor: PropertyDescriptor
) {
  console.log("Accessor decorator called");
}

@ClassDecorator
class DecoratedClass {
  @PropertyDecorator
  property: string;

  @AccessorDecorator
  get value() {
    return this.property;
  }

  @MethodDecorator
  method(@ParameterDecorator param: string) {
    return param;
  }
}
```

## Class Decorators

### Basic Class Decorator

```typescript
// Simple class decorator
function Component(config: { selector: string; template: string }) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      selector = config.selector;
      template = config.template;

      render() {
        console.log(`Rendering ${this.selector}: ${this.template}`);
      }
    };
  };
}

@Component({
  selector: "app-user",
  template: "<div>User Component</div>",
})
class UserComponent {
  name: string = "John";

  getName() {
    return this.name;
  }
}

const user = new UserComponent();
// user now has selector, template, and render method
(user as any).render(); // "Rendering app-user: <div>User Component</div>"
```

### Advanced Class Decorators

```typescript
// Decorator factory for dependency injection
function Injectable(token?: string) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    const injectionToken = token || constructor.name;

    // Add metadata for DI container
    Reflect.defineMetadata("injectable", true, constructor);
    Reflect.defineMetadata("token", injectionToken, constructor);

    return constructor;
  };
}

// Singleton decorator
function Singleton<T extends { new (...args: any[]): {} }>(constructor: T) {
  let instance: T | undefined;

  return class extends constructor {
    constructor(...args: any[]) {
      if (instance) {
        return instance;
      }
      super(...args);
      instance = this as any;
    }
  };
}

// Entity decorator for ORM-like functionality
function Entity(tableName: string) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      static tableName = tableName;

      save() {
        console.log(`Saving to table: ${tableName}`);
        return this;
      }

      static findAll() {
        console.log(`Finding all from table: ${tableName}`);
        return [];
      }

      static findById(id: string) {
        console.log(`Finding by ID from table: ${tableName}`);
        return null;
      }
    };
  };
}

@Injectable("UserService")
@Singleton
@Entity("users")
class User {
  constructor(public name: string, public email: string) {}
}

const user1 = new User("John", "john@example.com");
const user2 = new User("Jane", "jane@example.com");
console.log(user1 === user2); // true (singleton)
(user1 as any).save(); // "Saving to table: users"
```

## Method Decorators

### Basic Method Decorators

```typescript
// Logging decorator
function Log(
  target: any,
  propertyName: string,
  descriptor: PropertyDescriptor
) {
  const method = descriptor.value;

  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${propertyName} with arguments:`, args);
    const result = method.apply(this, args);
    console.log(`${propertyName} returned:`, result);
    return result;
  };
}

// Timing decorator
function Measure(
  target: any,
  propertyName: string,
  descriptor: PropertyDescriptor
) {
  const method = descriptor.value;

  descriptor.value = function (...args: any[]) {
    const start = performance.now();
    const result = method.apply(this, args);
    const end = performance.now();
    console.log(`${propertyName} took ${end - start} milliseconds`);
    return result;
  };
}

// Validation decorator
function Validate(
  target: any,
  propertyName: string,
  descriptor: PropertyDescriptor
) {
  const method = descriptor.value;

  descriptor.value = function (...args: any[]) {
    for (const arg of args) {
      if (arg === null || arg === undefined) {
        throw new Error(
          `Invalid argument in ${propertyName}: null or undefined`
        );
      }
    }
    return method.apply(this, args);
  };
}

class Calculator {
  @Log
  @Measure
  @Validate
  add(a: number, b: number): number {
    return a + b;
  }

  @Log
  multiply(a: number, b: number): number {
    return a * b;
  }
}

const calc = new Calculator();
calc.add(5, 3); // Logs: calling, timing, result
```

### Advanced Method Decorators

```typescript
// Retry decorator
function Retry(attempts: number = 3, delay: number = 1000) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      for (let i = 0; i < attempts; i++) {
        try {
          return await method.apply(this, args);
        } catch (error) {
          if (i === attempts - 1) {
            throw error;
          }
          console.log(`Attempt ${i + 1} failed, retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    };
  };
}

// Cache decorator
function Cache(ttl: number = 5000) {
  const cache = new Map<string, { value: any; timestamp: number }>();

  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const key = `${propertyName}_${JSON.stringify(args)}`;
      const cached = cache.get(key);

      if (cached && Date.now() - cached.timestamp < ttl) {
        console.log(`Cache hit for ${propertyName}`);
        return cached.value;
      }

      const result = method.apply(this, args);
      cache.set(key, { value: result, timestamp: Date.now() });
      console.log(`Cache miss for ${propertyName}, result cached`);
      return result;
    };
  };
}

// Authorization decorator
function RequireRole(roles: string[]) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;

    descriptor.value = function (...args: any[]) {
      // In real app, get current user from context
      const currentUser = { roles: ["user", "admin"] }; // Mock user

      const hasRequiredRole = roles.some((role) =>
        currentUser.roles.includes(role)
      );
      if (!hasRequiredRole) {
        throw new Error(`Access denied. Required roles: ${roles.join(", ")}`);
      }

      return method.apply(this, args);
    };
  };
}

class ApiService {
  @Retry(3, 1000)
  async fetchData(url: string): Promise<any> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  }

  @Cache(10000)
  expensiveCalculation(n: number): number {
    console.log("Performing expensive calculation...");
    return n * n * n;
  }

  @RequireRole(["admin"])
  deleteUser(userId: string): void {
    console.log(`Deleting user ${userId}`);
  }

  @RequireRole(["user", "admin"])
  getProfile(): any {
    return { name: "John", email: "john@example.com" };
  }
}
```

## Property Decorators

### Basic Property Decorators

```typescript
// ReadOnly decorator
function ReadOnly(target: any, propertyName: string) {
  Object.defineProperty(target, propertyName, {
    writable: false,
    configurable: false,
  });
}

// Required decorator
function Required(target: any, propertyName: string) {
  let value: any;

  Object.defineProperty(target, propertyName, {
    get() {
      if (value === undefined) {
        throw new Error(`Property ${propertyName} is required but not set`);
      }
      return value;
    },
    set(newValue: any) {
      if (newValue === null || newValue === undefined) {
        throw new Error(`Property ${propertyName} cannot be null or undefined`);
      }
      value = newValue;
    },
    enumerable: true,
    configurable: true,
  });
}

// Default value decorator
function Default(defaultValue: any) {
  return function (target: any, propertyName: string) {
    let value: any = defaultValue;

    Object.defineProperty(target, propertyName, {
      get() {
        return value;
      },
      set(newValue: any) {
        value = newValue;
      },
      enumerable: true,
      configurable: true,
    });
  };
}

class User {
  @ReadOnly
  id: string = Math.random().toString(36);

  @Required
  name: string;

  @Default("user@example.com")
  email: string;

  @Default(18)
  age: number;
}

const user = new User();
// user.id = 'new-id'; // Error: Cannot assign to read only property
user.name = "John"; // OK
console.log(user.email); // 'user@example.com'
```

### Advanced Property Decorators

```typescript
// Validation decorators
function MinLength(length: number) {
  return function (target: any, propertyName: string) {
    let value: string;

    Object.defineProperty(target, propertyName, {
      get() {
        return value;
      },
      set(newValue: string) {
        if (typeof newValue === "string" && newValue.length < length) {
          throw new Error(
            `${propertyName} must be at least ${length} characters long`
          );
        }
        value = newValue;
      },
      enumerable: true,
      configurable: true,
    });
  };
}

function Email(target: any, propertyName: string) {
  let value: string;

  Object.defineProperty(target, propertyName, {
    get() {
      return value;
    },
    set(newValue: string) {
      if (
        typeof newValue === "string" &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newValue)
      ) {
        throw new Error(`${propertyName} must be a valid email address`);
      }
      value = newValue;
    },
    enumerable: true,
    configurable: true,
  });
}

function Range(min: number, max: number) {
  return function (target: any, propertyName: string) {
    let value: number;

    Object.defineProperty(target, propertyName, {
      get() {
        return value;
      },
      set(newValue: number) {
        if (
          typeof newValue === "number" &&
          (newValue < min || newValue > max)
        ) {
          throw new Error(`${propertyName} must be between ${min} and ${max}`);
        }
        value = newValue;
      },
      enumerable: true,
      configurable: true,
    });
  };
}

// Observable decorator
function Observable(target: any, propertyName: string) {
  let value: any;
  const observers: Array<(newValue: any, oldValue: any) => void> = [];

  Object.defineProperty(target, propertyName, {
    get() {
      return value;
    },
    set(newValue: any) {
      const oldValue = value;
      value = newValue;
      observers.forEach((observer) => observer(newValue, oldValue));
    },
    enumerable: true,
    configurable: true,
  });

  // Add observer method
  const observerMethodName = `observe${propertyName
    .charAt(0)
    .toUpperCase()}${propertyName.slice(1)}`;
  target[observerMethodName] = function (
    callback: (newValue: any, oldValue: any) => void
  ) {
    observers.push(callback);
  };
}

class UserProfile {
  @MinLength(2)
  firstName: string;

  @MinLength(2)
  lastName: string;

  @Email
  email: string;

  @Range(13, 120)
  age: number;

  @Observable
  status: string;
}

const profile = new UserProfile();
(profile as any).observeStatus((newStatus: string, oldStatus: string) => {
  console.log(`Status changed from ${oldStatus} to ${newStatus}`);
});

profile.firstName = "John";
profile.email = "john@example.com";
profile.age = 25;
profile.status = "online"; // Triggers observer
```

## Parameter Decorators

### Basic Parameter Decorators

```typescript
// Parameter validation decorator
function ValidateType(expectedType: string) {
  return function (target: any, propertyName: string, parameterIndex: number) {
    const existingTypes =
      Reflect.getMetadata("validate-types", target, propertyName) || [];
    existingTypes[parameterIndex] = expectedType;
    Reflect.defineMetadata(
      "validate-types",
      existingTypes,
      target,
      propertyName
    );
  };
}

// Method decorator that uses parameter metadata
function ValidateParams(
  target: any,
  propertyName: string,
  descriptor: PropertyDescriptor
) {
  const method = descriptor.value;

  descriptor.value = function (...args: any[]) {
    const types =
      Reflect.getMetadata("validate-types", target, propertyName) || [];

    for (let i = 0; i < args.length; i++) {
      const expectedType = types[i];
      if (expectedType && typeof args[i] !== expectedType) {
        throw new Error(
          `Parameter ${i} should be of type ${expectedType}, got ${typeof args[
            i
          ]}`
        );
      }
    }

    return method.apply(this, args);
  };
}

class Calculator {
  @ValidateParams
  add(
    @ValidateType("number") a: number,
    @ValidateType("number") b: number
  ): number {
    return a + b;
  }

  @ValidateParams
  greet(@ValidateType("string") name: string): string {
    return `Hello, ${name}!`;
  }
}

const calc = new Calculator();
console.log(calc.add(5, 3)); // 8
// calc.add('5', 3); // Error: Parameter 0 should be of type number, got string
```

### Advanced Parameter Decorators

```typescript
// Dependency injection parameter decorator
const DIContainer = new Map<string, any>();

function Inject(token: string) {
  return function (
    target: any,
    propertyName: string | symbol | undefined,
    parameterIndex: number
  ) {
    const existingTokens = Reflect.getMetadata("inject-tokens", target) || [];
    existingTokens[parameterIndex] = token;
    Reflect.defineMetadata("inject-tokens", existingTokens, target);
  };
}

// Constructor injection
function Injectable<T extends { new (...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    constructor(...args: any[]) {
      const tokens = Reflect.getMetadata("inject-tokens", constructor) || [];
      const injectedArgs = tokens.map((token: string) => {
        const dependency = DIContainer.get(token);
        if (!dependency) {
          throw new Error(`No provider found for ${token}`);
        }
        return dependency;
      });

      super(...injectedArgs);
    }
  };
}

// Register services
DIContainer.set("Logger", {
  log: (msg: string) => console.log(`[LOG] ${msg}`),
});
DIContainer.set("Database", {
  query: (sql: string) => console.log(`[DB] ${sql}`),
});

@Injectable
class UserService {
  constructor(
    @Inject("Logger") private logger: any,
    @Inject("Database") private db: any
  ) {}

  createUser(name: string): void {
    this.logger.log(`Creating user: ${name}`);
    this.db.query(`INSERT INTO users (name) VALUES ('${name}')`);
  }
}

const userService = new UserService();
userService.createUser("John"); // Uses injected dependencies

// Query parameter decorator for API routes
function Query(name?: string) {
  return function (target: any, propertyName: string, parameterIndex: number) {
    const existingQueries =
      Reflect.getMetadata("query-params", target, propertyName) || [];
    existingQueries[parameterIndex] = name || `param${parameterIndex}`;
    Reflect.defineMetadata(
      "query-params",
      existingQueries,
      target,
      propertyName
    );
  };
}

function Body(target: any, propertyName: string, parameterIndex: number) {
  Reflect.defineMetadata("body-param", parameterIndex, target, propertyName);
}

// Route decorator that processes parameters
function Route(path: string, method: string = "GET") {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (request: any) {
      const queryParams =
        Reflect.getMetadata("query-params", target, propertyName) || [];
      const bodyParamIndex = Reflect.getMetadata(
        "body-param",
        target,
        propertyName
      );

      const args: any[] = [];

      queryParams.forEach((paramName: string, index: number) => {
        args[index] = request.query[paramName];
      });

      if (bodyParamIndex !== undefined) {
        args[bodyParamIndex] = request.body;
      }

      return originalMethod.apply(this, args);
    };

    console.log(`Registered route: ${method} ${path}`);
  };
}

class UserController {
  @Route("/users", "GET")
  getUsers(@Query("page") page: string, @Query("limit") limit: string) {
    return `Getting users - page: ${page}, limit: ${limit}`;
  }

  @Route("/users", "POST")
  createUser(@Body userData: any) {
    return `Creating user: ${JSON.stringify(userData)}`;
  }
}
```

## Decorator Composition and Factories

### Decorator Factories

```typescript
// Configurable decorators using factories
function RateLimit(requestsPerMinute: number) {
  const requestCounts = new Map<string, { count: number; timestamp: number }>();

  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const key = `${target.constructor.name}.${propertyName}`;
      const now = Date.now();
      const windowStart = now - 60000; // 1 minute window

      let requestData = requestCounts.get(key);
      if (!requestData || requestData.timestamp < windowStart) {
        requestData = { count: 0, timestamp: now };
      }

      if (requestData.count >= requestsPerMinute) {
        throw new Error(
          `Rate limit exceeded. Max ${requestsPerMinute} requests per minute.`
        );
      }

      requestData.count++;
      requestCounts.set(key, requestData);

      return method.apply(this, args);
    };
  };
}

function Throttle(delayMs: number) {
  let lastCall = 0;

  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const now = Date.now();
      if (now - lastCall < delayMs) {
        throw new Error(
          `Method called too frequently. Wait ${delayMs}ms between calls.`
        );
      }
      lastCall = now;
      return method.apply(this, args);
    };
  };
}

function Deprecate(message?: string, version?: string) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const deprecationMessage = message || `${propertyName} is deprecated`;
      const versionInfo = version ? ` (deprecated since v${version})` : "";
      console.warn(`⚠️  ${deprecationMessage}${versionInfo}`);

      return method.apply(this, args);
    };
  };
}

class ApiService {
  @RateLimit(10)
  fetchData(): string {
    return "Data fetched";
  }

  @Throttle(1000)
  saveData(data: any): void {
    console.log("Data saved:", data);
  }

  @Deprecate("Use fetchDataV2 instead", "2.0.0")
  fetchDataLegacy(): string {
    return "Legacy data";
  }
}
```

### Multiple Decorator Composition

```typescript
// Combining multiple decorators
function Authenticated(
  target: any,
  propertyName: string,
  descriptor: PropertyDescriptor
) {
  const method = descriptor.value;

  descriptor.value = function (...args: any[]) {
    // Mock authentication check
    const isAuthenticated = true; // In real app, check auth token
    if (!isAuthenticated) {
      throw new Error("Authentication required");
    }
    return method.apply(this, args);
  };
}

function Authorized(roles: string[]) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;

    descriptor.value = function (...args: any[]) {
      // Mock authorization check
      const userRoles = ["user"]; // In real app, get from auth context
      const hasRole = roles.some((role) => userRoles.includes(role));
      if (!hasRole) {
        throw new Error("Insufficient permissions");
      }
      return method.apply(this, args);
    };
  };
}

function AuditLog(action: string) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;

    descriptor.value = function (...args: any[]) {
      console.log(
        `Audit: ${action} performed by user at ${new Date().toISOString()}`
      );
      const result = method.apply(this, args);
      console.log(`Audit: ${action} completed successfully`);
      return result;
    };
  };
}

class AdminController {
  @Authenticated
  @Authorized(["admin"])
  @AuditLog("Delete User")
  @RateLimit(5)
  deleteUser(userId: string): void {
    console.log(`Deleting user ${userId}`);
  }

  @Authenticated
  @Authorized(["admin", "moderator"])
  @AuditLog("Ban User")
  @Measure
  banUser(userId: string, reason: string): void {
    console.log(`Banning user ${userId} for: ${reason}`);
  }
}

// Decorator execution order: bottom to top
// For method decorators: RateLimit -> AuditLog -> Authorized -> Authenticated
```

## Real-World Examples

### ORM-Style Decorators

```typescript
// Database entity decorators
function Entity(tableName: string) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    Reflect.defineMetadata("tableName", tableName, constructor);
    return constructor;
  };
}

function Column(options?: {
  name?: string;
  type?: string;
  nullable?: boolean;
}) {
  return function (target: any, propertyName: string) {
    const columns = Reflect.getMetadata("columns", target.constructor) || [];
    columns.push({
      propertyName,
      columnName: options?.name || propertyName,
      type: options?.type || "varchar",
      nullable: options?.nullable || false,
    });
    Reflect.defineMetadata("columns", columns, target.constructor);
  };
}

function PrimaryKey(target: any, propertyName: string) {
  Reflect.defineMetadata("primaryKey", propertyName, target.constructor);
}

function ForeignKey(referencedTable: string, referencedColumn: string) {
  return function (target: any, propertyName: string) {
    const foreignKeys =
      Reflect.getMetadata("foreignKeys", target.constructor) || [];
    foreignKeys.push({
      propertyName,
      referencedTable,
      referencedColumn,
    });
    Reflect.defineMetadata("foreignKeys", foreignKeys, target.constructor);
  };
}

@Entity("users")
class User {
  @PrimaryKey
  @Column({ type: "uuid" })
  id: string;

  @Column({ type: "varchar", nullable: false })
  name: string;

  @Column({ name: "email_address", type: "varchar" })
  email: string;

  @Column({ type: "timestamp" })
  createdAt: Date;
}

@Entity("posts")
class Post {
  @PrimaryKey
  @Column({ type: "uuid" })
  id: string;

  @Column({ type: "varchar" })
  title: string;

  @Column({ type: "text" })
  content: string;

  @ForeignKey("users", "id")
  @Column({ name: "user_id", type: "uuid" })
  userId: string;
}

// Repository with metadata
class Repository<T> {
  constructor(private entityClass: new () => T) {}

  getTableName(): string {
    return Reflect.getMetadata("tableName", this.entityClass);
  }

  getColumns(): any[] {
    return Reflect.getMetadata("columns", this.entityClass) || [];
  }

  getPrimaryKey(): string {
    return Reflect.getMetadata("primaryKey", this.entityClass);
  }

  generateCreateSQL(): string {
    const tableName = this.getTableName();
    const columns = this.getColumns();

    const columnDefinitions = columns
      .map(
        (col) =>
          `${col.columnName} ${col.type}${col.nullable ? "" : " NOT NULL"}`
      )
      .join(", ");

    return `CREATE TABLE ${tableName} (${columnDefinitions})`;
  }
}

const userRepo = new Repository(User);
console.log(userRepo.generateCreateSQL());
// CREATE TABLE users (id uuid NOT NULL, name varchar NOT NULL, email_address varchar NOT NULL, createdAt timestamp NOT NULL)
```

### API Route Decorators

```typescript
// Express-style decorators
const routes: Array<{
  path: string;
  method: string;
  handler: string;
  middlewares: string[];
}> = [];

function Controller(basePath: string) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    Reflect.defineMetadata("basePath", basePath, constructor);
    return constructor;
  };
}

function Get(path: string) {
  return createRouteDecorator("GET", path);
}

function Post(path: string) {
  return createRouteDecorator("POST", path);
}

function Put(path: string) {
  return createRouteDecorator("PUT", path);
}

function Delete(path: string) {
  return createRouteDecorator("DELETE", path);
}

function createRouteDecorator(method: string, path: string) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const basePath = Reflect.getMetadata("basePath", target.constructor) || "";
    const middlewares =
      Reflect.getMetadata("middlewares", target, propertyName) || [];

    routes.push({
      path: basePath + path,
      method,
      handler: `${target.constructor.name}.${propertyName}`,
      middlewares,
    });
  };
}

function UseMiddleware(middlewareName: string) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const middlewares =
      Reflect.getMetadata("middlewares", target, propertyName) || [];
    middlewares.push(middlewareName);
    Reflect.defineMetadata("middlewares", middlewares, target, propertyName);
  };
}

@Controller("/api/users")
class UserController {
  @Get("/")
  getAllUsers() {
    return "Get all users";
  }

  @Get("/:id")
  getUserById() {
    return "Get user by ID";
  }

  @Post("/")
  @UseMiddleware("validation")
  @UseMiddleware("auth")
  createUser() {
    return "Create user";
  }

  @Put("/:id")
  @UseMiddleware("auth")
  updateUser() {
    return "Update user";
  }

  @Delete("/:id")
  @UseMiddleware("auth")
  @UseMiddleware("admin")
  deleteUser() {
    return "Delete user";
  }
}

console.log("Registered routes:", routes);
// Routes are automatically collected and can be used to configure Express app
```

## Best Practices and Performance

### Decorator Performance

```typescript
// ✅ Good: Cache metadata to avoid repeated reflection calls
const metadataCache = new Map<any, any>();

function CachedValidation(rules: any[]) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const cacheKey = `${target.constructor.name}.${propertyName}`;

    if (!metadataCache.has(cacheKey)) {
      metadataCache.set(cacheKey, rules);
    }

    const method = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const cachedRules = metadataCache.get(cacheKey);
      // Use cached rules for validation
      return method.apply(this, args);
    };
  };
}

// ✅ Good: Use WeakMap for memory efficiency
const instanceData = new WeakMap();

function TrackInstances(
  target: any,
  propertyName: string,
  descriptor: PropertyDescriptor
) {
  const method = descriptor.value;

  descriptor.value = function (...args: any[]) {
    if (!instanceData.has(this)) {
      instanceData.set(this, { callCount: 0 });
    }

    const data = instanceData.get(this);
    data.callCount++;

    return method.apply(this, args);
  };
}

// ❌ Avoid: Heavy computation in decorators
function ExpensiveDecorator(
  target: any,
  propertyName: string,
  descriptor: PropertyDescriptor
) {
  // This runs at class definition time, not method call time
  const expensiveComputation = Array.from({ length: 10000 }, (_, i) => i * i);

  const method = descriptor.value;
  descriptor.value = function (...args: any[]) {
    // Heavy work should be here, not above
    return method.apply(this, args);
  };
}
```

### Type Safety with Decorators

```typescript
// Type-safe decorator factories
type Constructor<T = {}> = new (...args: any[]) => T;

function Mixin<T extends Constructor>(Base: T) {
  return class extends Base {
    mixedInProperty: string = "mixed in";

    mixedInMethod(): string {
      return "Hello from mixin";
    }
  };
}

// Generic decorators with proper typing
function Validate<T>(validator: (value: T) => boolean, message?: string) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;

    descriptor.value = function (value: T, ...rest: any[]) {
      if (!validator(value)) {
        throw new Error(message || `Validation failed for ${propertyName}`);
      }
      return method.apply(this, [value, ...rest]);
    };
  };
}

class StringValidator {
  @Validate<string>(
    (value: string) => value.length > 0,
    "String cannot be empty"
  )
  processString(value: string): string {
    return value.toUpperCase();
  }
}

// Decorator with proper return type inference
function WithRetry<T extends (...args: any[]) => Promise<any>>(
  attempts: number = 3
) {
  return function (
    target: any,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<T>
  ): TypedPropertyDescriptor<T> {
    const method = descriptor.value!;

    descriptor.value = async function (
      ...args: Parameters<T>
    ): Promise<ReturnType<T>> {
      for (let i = 0; i < attempts; i++) {
        try {
          return await method.apply(this, args);
        } catch (error) {
          if (i === attempts - 1) throw error;
        }
      }
      throw new Error("All retry attempts failed");
    } as T;

    return descriptor;
  };
}
```
