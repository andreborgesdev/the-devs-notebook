# TypeScript Modules and Namespaces

## ES6 Modules

### Basic Module Exports and Imports

```typescript
// math.ts - Named exports
export function add(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}

export const PI = 3.14159;

// Export interface
export interface Calculator {
  add(a: number, b: number): number;
  subtract(a: number, b: number): number;
}

// Export class
export class ScientificCalculator implements Calculator {
  add(a: number, b: number): number {
    return a + b;
  }

  subtract(a: number, b: number): number {
    return a - b;
  }

  multiply(a: number, b: number): number {
    return a * b;
  }

  power(base: number, exponent: number): number {
    return Math.pow(base, exponent);
  }
}

// Export type alias
export type Operation = "add" | "subtract" | "multiply" | "divide";

// main.ts - Import and usage
import { add, subtract, PI, ScientificCalculator, Operation } from "./math";
import type { Calculator } from "./math"; // Type-only import

const result1 = add(5, 3);
const result2 = subtract(10, 4);
console.log(`PI = ${PI}`);

const calc: Calculator = new ScientificCalculator();
const operation: Operation = "multiply";
```

### Default Exports

```typescript
// logger.ts - Default export
export default class Logger {
  private prefix: string;

  constructor(prefix: string = "[LOG]") {
    this.prefix = prefix;
  }

  info(message: string): void {
    console.log(`${this.prefix} INFO: ${message}`);
  }

  error(message: string): void {
    console.error(`${this.prefix} ERROR: ${message}`);
  }

  warn(message: string): void {
    console.warn(`${this.prefix} WARN: ${message}`);
  }
}

// Additional named exports in the same file
export const LOG_LEVELS = {
  INFO: "info",
  ERROR: "error",
  WARN: "warn",
} as const;

export type LogLevel = (typeof LOG_LEVELS)[keyof typeof LOG_LEVELS];

// app.ts - Import default and named exports
import Logger, { LOG_LEVELS, LogLevel } from "./logger";

const logger = new Logger("[APP]");
logger.info("Application started");

const level: LogLevel = LOG_LEVELS.ERROR;
logger.error("Something went wrong");
```

### Re-exports and Barrel Patterns

```typescript
// models/user.ts
export interface User {
  id: string;
  name: string;
  email: string;
}

export class UserService {
  async getUser(id: string): Promise<User> {
    // Implementation
    return { id, name: "John", email: "john@example.com" };
  }
}

// models/product.ts
export interface Product {
  id: string;
  name: string;
  price: number;
}

export class ProductService {
  async getProduct(id: string): Promise<Product> {
    // Implementation
    return { id, name: "MacBook", price: 2000 };
  }
}

// models/index.ts - Barrel export
export { User, UserService } from "./user";
export { Product, ProductService } from "./product";

// Re-export with renaming
export { User as UserModel, Product as ProductModel } from "./models";

// Re-export all
export * from "./user";
export * from "./product";

// app.ts - Import from barrel
import { User, Product, UserService, ProductService } from "./models";

// utils/index.ts - Mixed re-exports
export { default as Logger } from "./logger";
export * from "./math";
export type { Calculator } from "./calculator";
```

### Dynamic Imports

```typescript
// Dynamic imports for code splitting
async function loadMathModule() {
  const mathModule = await import("./math");

  const result = mathModule.add(5, 3);
  console.log(result);

  // Access default export
  const Calculator = mathModule.default;
  if (Calculator) {
    const calc = new Calculator();
  }

  return mathModule;
}

// Conditional loading
async function loadFeature(featureName: string) {
  switch (featureName) {
    case "charts":
      const { ChartComponent } = await import("./features/charts");
      return ChartComponent;

    case "analytics":
      const { AnalyticsService } = await import("./features/analytics");
      return AnalyticsService;

    default:
      throw new Error(`Unknown feature: ${featureName}`);
  }
}

// Dynamic import with error handling
async function safeImport<T>(modulePath: string): Promise<T | null> {
  try {
    const module = await import(modulePath);
    return module.default || module;
  } catch (error) {
    console.error(`Failed to load module ${modulePath}:`, error);
    return null;
  }
}

// Usage with top-level await (in modern environments)
const mathUtils = await safeImport<typeof import("./math")>("./math");
if (mathUtils) {
  console.log(mathUtils.add(1, 2));
}
```

## Module Resolution

### Path Mapping and Module Resolution

```typescript
// tsconfig.json - Path mapping configuration
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"],
      "@components/*": ["components/*"],
      "@utils/*": ["utils/*"],
      "@types/*": ["types/*"],
      "@services/*": ["services/*"]
    }
  }
}

// Usage with path mapping
import { Button } from '@components/Button';
import { ApiClient } from '@services/ApiClient';
import { User } from '@types/User';
import { formatDate } from '@utils/dateUtils';

// types/api.ts
export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    totalPages: number;
    totalItems: number;
  };
}

// services/ApiClient.ts
import type { ApiResponse, PaginatedResponse } from '@types/api';

export class ApiClient {
  constructor(private baseUrl: string) {}

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    return response.json();
  }

  async getPaginated<T>(endpoint: string, page: number = 1): Promise<PaginatedResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}?page=${page}`);
    return response.json();
  }
}
```

### Module Augmentation

```typescript
// Extending existing modules
declare module "lodash" {
  interface LoDashStatic {
    customUtility(value: any): string;
  }
}

// Global augmentation
declare global {
  interface Window {
    myCustomProperty: string;
    myCustomMethod(): void;
  }

  namespace NodeJS {
    interface ProcessEnv {
      CUSTOM_API_KEY: string;
      CUSTOM_ENV: "development" | "production" | "test";
    }
  }
}

// Using augmented types
window.myCustomProperty = "Hello World";
const apiKey = process.env.CUSTOM_API_KEY; // Type-safe environment variable

// Module merging with interfaces
// file1.ts
export interface Config {
  apiUrl: string;
}

// file2.ts
export interface Config {
  timeout: number;
}

// The merged interface will have both properties
// { apiUrl: string; timeout: number; }
```

## Namespaces

### Basic Namespace Declaration

```typescript
// Traditional namespace syntax
namespace Geometry {
  export interface Point {
    x: number;
    y: number;
  }

  export interface Circle {
    center: Point;
    radius: number;
  }

  export function distance(p1: Point, p2: Point): number {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  export function circleArea(circle: Circle): number {
    return Math.PI * circle.radius * circle.radius;
  }

  // Nested namespaces
  export namespace Shapes {
    export class Rectangle {
      constructor(
        public width: number,
        public height: number,
        public position: Point
      ) {}

      area(): number {
        return this.width * this.height;
      }

      contains(point: Point): boolean {
        return (
          point.x >= this.position.x &&
          point.x <= this.position.x + this.width &&
          point.y >= this.position.y &&
          point.y <= this.position.y + this.height
        );
      }
    }

    export class Triangle {
      constructor(public p1: Point, public p2: Point, public p3: Point) {}

      area(): number {
        // Using Shoelace formula
        return Math.abs(
          (this.p1.x * (this.p2.y - this.p3.y) +
            this.p2.x * (this.p3.y - this.p1.y) +
            this.p3.x * (this.p1.y - this.p2.y)) /
            2
        );
      }
    }
  }
}

// Usage
const point1: Geometry.Point = { x: 0, y: 0 };
const point2: Geometry.Point = { x: 3, y: 4 };
const dist = Geometry.distance(point1, point2); // 5

const circle: Geometry.Circle = { center: point1, radius: 5 };
const area = Geometry.circleArea(circle);

const rect = new Geometry.Shapes.Rectangle(10, 20, point1);
const triangle = new Geometry.Shapes.Triangle(point1, point2, { x: 0, y: 4 });
```

### Namespace Merging and Aliases

```typescript
// Namespace merging - multiple declarations merge together
namespace Utils {
  export function formatDate(date: Date): string {
    return date.toLocaleDateString();
  }
}

namespace Utils {
  export function formatTime(date: Date): string {
    return date.toLocaleTimeString();
  }
}

namespace Utils {
  export function formatDateTime(date: Date): string {
    return `${formatDate(date)} ${formatTime(date)}`;
  }
}

// All functions are available in the merged namespace
const now = new Date();
console.log(Utils.formatDate(now));
console.log(Utils.formatTime(now));
console.log(Utils.formatDateTime(now));

// Namespace aliases for convenience
namespace VeryLongNamespaceName {
  export namespace AnotherLongNamespaceName {
    export class ImportantClass {
      doSomething(): void {
        console.log("Doing something important");
      }
    }

    export function importantFunction(): void {
      console.log("Executing important function");
    }
  }
}

// Create aliases
import VLNN = VeryLongNamespaceName;
import ALN = VeryLongNamespaceName.AnotherLongNamespaceName;

// Use aliases
const instance = new ALN.ImportantClass();
ALN.importantFunction();
```

### Internal Modules vs External Modules

```typescript
// Internal module (namespace) - everything in one file
namespace App {
  export namespace Models {
    export interface User {
      id: string;
      name: string;
    }

    export interface Product {
      id: string;
      name: string;
      price: number;
    }
  }

  export namespace Services {
    export class UserService {
      getUser(id: string): Models.User {
        return { id, name: "John Doe" };
      }
    }

    export class ProductService {
      getProduct(id: string): Models.Product {
        return { id, name: "Sample Product", price: 99.99 };
      }
    }
  }

  export namespace Utils {
    export function generateId(): string {
      return Math.random().toString(36).substr(2, 9);
    }

    export function formatPrice(price: number): string {
      return `$${price.toFixed(2)}`;
    }
  }
}

// Usage of internal modules
const userService = new App.Services.UserService();
const user = userService.getUser("123");
const formattedPrice = App.Utils.formatPrice(99.99);

// Contrast with external modules (preferred modern approach)
// user.service.ts
export interface User {
  id: string;
  name: string;
}

export class UserService {
  getUser(id: string): User {
    return { id, name: "John Doe" };
  }
}

// product.service.ts
export interface Product {
  id: string;
  name: string;
  price: number;
}

export class ProductService {
  getProduct(id: string): Product {
    return { id, name: "Sample Product", price: 99.99 };
  }
}

// utils.ts
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}
```

## Module vs Namespace Decision Guide

### When to Use Modules (Preferred)

```typescript
// ✅ Use modules for:
// 1. Code that will be consumed by other applications
// 2. Code that needs tree-shaking
// 3. Modern applications
// 4. When you want explicit dependency management

// user-api.ts
export interface User {
  id: string;
  name: string;
  email: string;
}

export async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

export async function createUser(userData: Omit<User, "id">): Promise<User> {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return response.json();
}

// Clear imports and exports
import { User, fetchUser, createUser } from "./user-api";

// Benefits:
// - Tree-shaking support
// - Clear dependency graph
// - Standard ES6 syntax
// - Better IDE support
// - Works with bundlers
```

### When to Use Namespaces (Limited Use Cases)

```typescript
// ✅ Use namespaces for:
// 1. Organizing types and constants
// 2. Internal organization within a module
// 3. Legacy code migration
// 4. Ambient declarations

// api-types.ts
export namespace API {
  export namespace Users {
    export interface CreateRequest {
      name: string;
      email: string;
    }

    export interface UpdateRequest {
      name?: string;
      email?: string;
    }

    export interface Response {
      id: string;
      name: string;
      email: string;
      createdAt: string;
      updatedAt: string;
    }
  }

  export namespace Products {
    export interface CreateRequest {
      name: string;
      price: number;
      categoryId: string;
    }

    export interface Response {
      id: string;
      name: string;
      price: number;
      category: {
        id: string;
        name: string;
      };
    }
  }

  export const STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500,
  } as const;
}

// Usage provides good organization
import { API } from "./api-types";

function createUser(
  data: API.Users.CreateRequest
): Promise<API.Users.Response> {
  // Implementation
}

function updateUser(
  id: string,
  data: API.Users.UpdateRequest
): Promise<API.Users.Response> {
  // Implementation
}
```

## Advanced Module Patterns

### Module Factories

```typescript
// Module factory pattern
export function createApiClient(config: { baseUrl: string; apiKey: string }) {
  const { baseUrl, apiKey } = config;

  async function request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  return {
    get: <T>(endpoint: string) => request<T>(endpoint),
    post: <T>(endpoint: string, data: any) =>
      request<T>(endpoint, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    put: <T>(endpoint: string, data: any) =>
      request<T>(endpoint, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: <T>(endpoint: string) =>
      request<T>(endpoint, {
        method: "DELETE",
      }),
  };
}

// Usage
const api = createApiClient({
  baseUrl: "https://api.example.com",
  apiKey: "your-api-key",
});

const users = await api.get<User[]>("/users");
const newUser = await api.post<User>("/users", {
  name: "John",
  email: "john@example.com",
});
```

### Plugin System with Modules

```typescript
// Plugin interface
export interface Plugin {
  name: string;
  version: string;
  init(app: Application): void;
  destroy?(): void;
}

// Application core
export class Application {
  private plugins: Map<string, Plugin> = new Map();

  installPlugin(plugin: Plugin): void {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin ${plugin.name} is already installed`);
    }

    this.plugins.set(plugin.name, plugin);
    plugin.init(this);
    console.log(`Plugin ${plugin.name} v${plugin.version} installed`);
  }

  uninstallPlugin(name: string): void {
    const plugin = this.plugins.get(name);
    if (plugin) {
      plugin.destroy?.();
      this.plugins.delete(name);
      console.log(`Plugin ${name} uninstalled`);
    }
  }

  getPlugin(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }
}

// Example plugins
// logger-plugin.ts
export const LoggerPlugin: Plugin = {
  name: "logger",
  version: "1.0.0",

  init(app: Application): void {
    // Add logging functionality to the app
    console.log("Logger plugin initialized");
  },

  destroy(): void {
    console.log("Logger plugin destroyed");
  },
};

// analytics-plugin.ts
export const AnalyticsPlugin: Plugin = {
  name: "analytics",
  version: "2.1.0",

  init(app: Application): void {
    // Add analytics functionality
    console.log("Analytics plugin initialized");
  },
};

// Usage
const app = new Application();
app.installPlugin(LoggerPlugin);
app.installPlugin(AnalyticsPlugin);
```

## Best Practices

### Module Organization

```typescript
// ✅ Good: Logical grouping and clear exports
// features/user/index.ts
export { UserService } from "./user.service";
export { UserRepository } from "./user.repository";
export { UserController } from "./user.controller";
export type { User, CreateUserDto, UpdateUserDto } from "./user.types";

// features/user/user.types.ts
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
}

// ✅ Good: Separation of concerns
// config/database.ts
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

export function createDatabaseConfig(): DatabaseConfig {
  return {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    database: process.env.DB_NAME || "myapp",
    username: process.env.DB_USER || "user",
    password: process.env.DB_PASS || "password",
  };
}

// ✅ Good: Utility modules
// utils/validation.ts
export function isEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isStrongPassword(password: string): boolean {
  return (
    password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)
  );
}

export const ValidationRules = {
  email: isEmail,
  strongPassword: isStrongPassword,
} as const;
```

### Performance Considerations

```typescript
// ✅ Use type-only imports for better tree-shaking
import type { User } from "./types/user";
import type { ApiResponse } from "./types/api";
import { fetchUser } from "./services/user-service"; // Only runtime import

// ✅ Lazy loading for large modules
async function loadChartingLibrary() {
  const { Chart } = await import("./heavy-charting-library");
  return Chart;
}

// ✅ Avoid circular dependencies
// Instead of: A imports B, B imports A
// Use: A imports C, B imports C (shared dependencies)

// ✅ Use barrel exports wisely (avoid performance issues)
// Good for small, related modules
export * from "./user";
export * from "./product";

// Avoid for large modules (creates large bundles)
// export * from './entire-large-library';
```
