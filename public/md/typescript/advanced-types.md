# TypeScript Advanced Types

## Utility Types

### Built-in Utility Types

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  isActive: boolean;
}

// Partial<T> - Makes all properties optional
type PartialUser = Partial<User>;
// { id?: string; name?: string; email?: string; age?: number; isActive?: boolean; }

function updateUser(id: string, updates: Partial<User>): User {
  // Can update any subset of user properties
  return { ...getCurrentUser(id), ...updates };
}

// Required<T> - Makes all properties required
interface OptionalConfig {
  theme?: "light" | "dark";
  language?: string;
  notifications?: boolean;
}

type RequiredConfig = Required<OptionalConfig>;
// { theme: 'light' | 'dark'; language: string; notifications: boolean; }

// Readonly<T> - Makes all properties readonly
type ReadonlyUser = Readonly<User>;
const user: ReadonlyUser = {
  id: "1",
  name: "John",
  email: "john@example.com",
  age: 30,
  isActive: true,
};
// user.name = "Jane"; // Error: Cannot assign to 'name' because it is read-only

// Pick<T, K> - Select specific properties
type UserSummary = Pick<User, "id" | "name" | "email">;
// { id: string; name: string; email: string; }

// Omit<T, K> - Exclude specific properties
type CreateUserRequest = Omit<User, "id">;
// { name: string; email: string; age: number; isActive: boolean; }

// Record<K, T> - Create object type with specific keys and values
type UserRoles = Record<string, "admin" | "user" | "guest">;
const roles: UserRoles = {
  user1: "admin",
  user2: "user",
  user3: "guest",
};

type StatusCodes = Record<number, string>;
const httpCodes: StatusCodes = {
  200: "OK",
  404: "Not Found",
  500: "Internal Server Error",
};
```

### Advanced Utility Type Usage

```typescript
// Exclude<T, U> - Remove types from union
type AllColors = "red" | "green" | "blue" | "yellow";
type PrimaryColors = Exclude<AllColors, "yellow">; // 'red' | 'green' | 'blue'

// Extract<T, U> - Extract types from union
type StringOrNumber = string | number | boolean;
type OnlyStringOrNumber = Extract<StringOrNumber, string | number>; // string | number

// NonNullable<T> - Remove null and undefined
type MaybeString = string | null | undefined;
type DefinitelyString = NonNullable<MaybeString>; // string

// ReturnType<T> - Get function return type
function getUser(): User {
  return {} as User;
}
type UserReturnType = ReturnType<typeof getUser>; // User

// Parameters<T> - Get function parameter types
function createUser(name: string, age: number): User {
  return {} as User;
}
type CreateUserParams = Parameters<typeof createUser>; // [string, number]

// ConstructorParameters<T> - Get constructor parameter types
class ApiClient {
  constructor(baseUrl: string, timeout: number) {}
}
type ApiClientParams = ConstructorParameters<typeof ApiClient>; // [string, number]

// InstanceType<T> - Get instance type of constructor
type ApiClientInstance = InstanceType<typeof ApiClient>; // ApiClient
```

## Conditional Types

### Basic Conditional Types

```typescript
// Basic conditional type syntax: T extends U ? X : Y
type IsString<T> = T extends string ? true : false;

type Test1 = IsString<string>; // true
type Test2 = IsString<number>; // false
type Test3 = IsString<"hello">; // true

// Nested conditional types
type TypeName<T> = T extends string
  ? "string"
  : T extends number
  ? "number"
  : T extends boolean
  ? "boolean"
  : T extends undefined
  ? "undefined"
  : T extends Function
  ? "function"
  : "object";

type T1 = TypeName<string>; // "string"
type T2 = TypeName<number>; // "number"
type T3 = TypeName<() => void>; // "function"

// Conditional types with generic constraints
type MessageOf<T> = T extends { message: infer M } ? M : never;

type EmailContent = MessageOf<{ message: string; sender: string }>; // string
type NoMessage = MessageOf<{ data: number }>; // never
```

### Distributive Conditional Types

```typescript
// When conditional types are applied to union types, they distribute
type ToArray<T> = T extends any ? T[] : never;
type StringOrNumberArray = ToArray<string | number>; // string[] | number[]

// This is equivalent to:
type StringOrNumberArrayExpanded = ToArray<string> | ToArray<number>; // string[] | number[]

// To prevent distribution, wrap in a tuple
type ToArrayNonDistributive<T> = [T] extends [any] ? T[] : never;
type SingleArray = ToArrayNonDistributive<string | number>; // (string | number)[]

// Practical example: filtering union types
type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

interface Example {
  name: string;
  age: number;
  getName(): string;
  setAge(age: number): void;
}

type ExampleData = NonFunctionProperties<Example>;
// { name: string; age: number; }
```

### Infer Keyword

```typescript
// infer allows you to extract types within conditional types
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

function greet(): string {
  return "Hello";
}

type GreetReturn = ReturnType<typeof greet>; // string

// Multiple infer usage
type Swap<T> = T extends [infer A, infer B] ? [B, A] : never;
type SwappedTuple = Swap<[string, number]>; // [number, string]

// Infer with arrays
type Head<T> = T extends [infer H, ...any[]] ? H : never;
type Tail<T> = T extends [any, ...infer T] ? T : never;

type FirstElement = Head<[1, 2, 3, 4]>; // 1
type RestElements = Tail<[1, 2, 3, 4]>; // [2, 3, 4]

// Advanced infer patterns
type FunctionArgs<T> = T extends (...args: infer A) => any ? A : never;
type PromiseType<T> = T extends Promise<infer U> ? U : T;
type ArrayElement<T> = T extends (infer U)[] ? U : never;

// Recursive conditional types with infer
type Flatten<T> = T extends Array<infer U> ? Flatten<U> : T;
type NestedArray = number[][][];
type FlatNumber = Flatten<NestedArray>; // number

// String manipulation with infer
type GetFirstChar<T> = T extends `${infer First}${string}` ? First : never;
type FirstCharOfHello = GetFirstChar<"hello">; // "h"
```

## Template Literal Types

### Basic Template Literals

```typescript
// Basic template literal types
type World = "world";
type Greeting = `hello ${World}`; // "hello world"

// With unions
type Color = "red" | "blue" | "green";
type Quantity = "one" | "two" | "many";
type ColorfulItems = `${Quantity} ${Color} items`;
// "one red items" | "one blue items" | "one green items" |
// "two red items" | "two blue items" | "two green items" |
// "many red items" | "many blue items" | "many green items"

// Practical example: CSS properties
type CSSProperty = "margin" | "padding";
type CSSDirection = "top" | "right" | "bottom" | "left";
type CSSProperties = `${CSSProperty}-${CSSDirection}`;
// "margin-top" | "margin-right" | "margin-bottom" | "margin-left" |
// "padding-top" | "padding-right" | "padding-bottom" | "padding-left"
```

### Advanced Template Literal Patterns

```typescript
// Event names pattern
type EventName<T> = T extends `${infer Event}Event` ? Event : never;
type ClickEvent = EventName<"clickEvent">; // "click"
type HoverEvent = EventName<"hoverEvent">; // "hover"

// Property getters/setters
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type Setters<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
};

interface Person {
  name: string;
  age: number;
}

type PersonGetters = Getters<Person>;
// { getName: () => string; getAge: () => number; }

type PersonSetters = Setters<Person>;
// { setName: (value: string) => void; setAge: (value: number) => void; }

// URL path parsing
type ParsePath<T> = T extends `/${infer Segment}/${infer Rest}`
  ? [Segment, ...ParsePath<`/${Rest}`>]
  : T extends `/${infer Segment}`
  ? [Segment]
  : [];

type ApiPath = ParsePath<"/api/users/123">; // ["api", "users", "123"]

// String manipulation utilities
type Trim<T> = T extends ` ${infer Rest}`
  ? Trim<Rest>
  : T extends `${infer Rest} `
  ? Trim<Rest>
  : T;

type TrimmedString = Trim<"  hello world  ">; // "hello world"

// Camel case conversion
type CamelCase<S> = S extends `${infer P1}_${infer P2}${infer P3}`
  ? `${P1}${Uppercase<P2>}${CamelCase<P3>}`
  : S;

type CamelCased = CamelCase<"hello_world_foo">; // "helloWorldFoo"
```

### Template Literals with Functions

```typescript
// Type-safe route definitions
type RouteParam<T> = T extends `${string}:${infer Param}/${infer Rest}`
  ? Param | RouteParam<Rest>
  : T extends `${string}:${infer Param}`
  ? Param
  : never;

type UserRouteParams = RouteParam<"/users/:id/posts/:postId">; // "id" | "postId"

// Dynamic method generation
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type ApiEndpoint = "users" | "posts" | "comments";

type ApiMethods = {
  [K in `${Lowercase<HttpMethod>}${Capitalize<ApiEndpoint>}`]: (
    id?: string
  ) => Promise<any>;
};

// Results in:
// {
//   getUsers: (id?: string) => Promise<any>;
//   postUsers: (id?: string) => Promise<any>;
//   putUsers: (id?: string) => Promise<any>;
//   deleteUsers: (id?: string) => Promise<any>;
//   getPosts: (id?: string) => Promise<any>;
//   ... etc
// }

// SQL-like query builder types
type SelectClause<T> = {
  [K in keyof T as `select${Capitalize<string & K>}`]: () => SelectClause<T>;
} & {
  where: <K extends keyof T>(column: K, value: T[K]) => SelectClause<T>;
  execute: () => Promise<T[]>;
};

declare function query<T>(): SelectClause<T>;

// Usage would be type-safe:
const userQuery = query<User>()
  .selectName()
  .selectEmail()
  .where("age", 30)
  .execute();
```

## Mapped Types Deep Dive

### Advanced Mapped Type Patterns

```typescript
// Key remapping with template literals
type EventHandlers<T> = {
  [K in keyof T as `on${Capitalize<string & K>}Change`]?: (value: T[K]) => void;
};

interface FormData {
  username: string;
  email: string;
  age: number;
}

type FormEventHandlers = EventHandlers<FormData>;
// {
//   onUsernameChange?: (value: string) => void;
//   onEmailChange?: (value: string) => void;
//   onAgeChange?: (value: number) => void;
// }

// Conditional mapped types
type NullableKeys<T> = {
  [K in keyof T]: null extends T[K] ? K : never;
}[keyof T];

type RequiredKeys<T> = {
  [K in keyof T]: null extends T[K] ? never : K;
}[keyof T];

interface MixedInterface {
  required: string;
  optional?: string;
  nullable: string | null;
  both?: string | null;
}

type NullableProperties = NullableKeys<MixedInterface>; // "nullable" | "both"
type RequiredProperties = RequiredKeys<MixedInterface>; // "required"

// Deep mapped types
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

interface NestedConfig {
  api: {
    url: string;
    timeout?: number;
    retries?: {
      count: number;
      delay?: number;
    };
  };
  ui?: {
    theme: "light" | "dark";
    language?: string;
  };
}

type PartialConfig = DeepPartial<NestedConfig>;
type CompleteConfig = DeepRequired<NestedConfig>;
```

### Mapped Types with Filters

```typescript
// Filter by type
type PickByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

type OmitByType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K];
};

interface UserProfile {
  id: string;
  name: string;
  age: number;
  isActive: boolean;
  createdAt: Date;
  updateProfile: (data: Partial<UserProfile>) => void;
  delete: () => void;
}

type StringProperties = PickByType<UserProfile, string>; // { id: string; name: string; }
type NonFunctionProperties = OmitByType<UserProfile, Function>;
// { id: string; name: string; age: number; isActive: boolean; createdAt: Date; }

// Complex filtering
type PublicProperties<T> = {
  [K in keyof T as K extends `_${string}` ? never : K]: T[K];
};

interface InternalAPI {
  publicMethod(): void;
  _privateMethod(): void;
  publicProperty: string;
  _privateProperty: number;
}

type PublicAPI = PublicProperties<InternalAPI>;
// { publicMethod: () => void; publicProperty: string; }
```

## Type Manipulation Techniques

### Recursive Types

```typescript
// JSON type definition
type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

const validJSON: JSONValue = {
  name: "John",
  age: 30,
  hobbies: ["reading", "coding"],
  address: {
    street: "123 Main St",
    city: "Anytown",
  },
};

// Recursive path type
type Path<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? K | `${K}.${Path<T[K]>}`
          : K
        : never;
    }[keyof T]
  : never;

type UserPaths = Path<User>;
// "id" | "name" | "email" | "age" | "isActive"

// Deep get function
type Get<T, P> = P extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? Get<T[Key], Rest>
    : never
  : P extends keyof T
  ? T[P]
  : never;

function get<T, P extends Path<T>>(obj: T, path: P): Get<T, P> {
  // Implementation would parse the path and traverse the object
  return undefined as any;
}

// Type-safe usage
const user = { profile: { name: "John", settings: { theme: "dark" } } };
const theme = get(user, "profile.settings.theme"); // Type: string
```

### Higher-Order Type Functions

```typescript
// Compose utility types
type Compose<F, G> = F extends (arg: any) => infer R1
  ? G extends (arg: R1) => infer R2
    ? (arg: Parameters<F>[0]) => R2
    : never
  : never;

// Apply multiple transformations
type Transform1<T> = T extends string ? T[] : never;
type Transform2<T> = T extends any[] ? T[0] : never;

type ComposedTransform<T> = Compose<Transform1<T>, Transform2<T>>;

// Functional programming patterns in types
type Curry<F> = F extends (arg1: infer A, arg2: infer B) => infer R
  ? (arg1: A) => (arg2: B) => R
  : never;

type CurriedAdd = Curry<(a: number, b: number) => number>;
// (arg1: number) => (arg2: number) => number

// Pipeline type operations
type Pipeline<T, Ops extends readonly any[]> = Ops extends readonly [
  infer First,
  ...infer Rest
]
  ? First extends (arg: T) => infer R
    ? Pipeline<R, Rest>
    : never
  : T;

type StringToNumberToString = Pipeline<
  string,
  [(s: string) => number, (n: number) => string]
>; // string
```

## Best Practices for Advanced Types

### Performance Optimization

```typescript
// ✅ Use type aliases to avoid recomputation
type CommonMappedType<T> = {
  [K in keyof T]: T[K] | null;
};

type User1 = CommonMappedType<{ name: string; age: number }>;
type User2 = CommonMappedType<{ email: string; role: string }>;

// ❌ Avoid deeply nested conditional types when possible
type DeepNested<T> = T extends { a: infer A }
  ? A extends { b: infer B }
    ? B extends { c: infer C }
      ? C extends { d: infer D }
        ? D
        : never
      : never
    : never
  : never;

// ✅ Break down complex types
type ExtractA<T> = T extends { a: infer A } ? A : never;
type ExtractB<T> = T extends { b: infer B } ? B : never;
type ExtractC<T> = T extends { c: infer C } ? C : never;
type ExtractD<T> = T extends { d: infer D } ? D : never;

type BetterDeepNested<T> = ExtractD<ExtractC<ExtractB<ExtractA<T>>>>;
```

### Type Safety Best Practices

```typescript
// ✅ Use branded types for domain modeling
type UserId = string & { readonly __brand: unique symbol };
type ProductId = string & { readonly __brand: unique symbol };

function getUserById(id: UserId): User | null {
  // Implementation
  return null;
}

// This prevents mixing up different ID types
const userId = "user123" as UserId;
const productId = "product456" as ProductId;

getUserById(userId); // ✅ OK
// getUserById(productId); // ❌ Error: ProductId not assignable to UserId

// ✅ Use exhaustive checking with never
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number }
  | { kind: "rectangle"; width: number; height: number };

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.size ** 2;
    case "rectangle":
      return shape.width * shape.height;
    default:
      // This ensures all cases are handled
      const _exhaustive: never = shape;
      return _exhaustive;
  }
}

// ✅ Use assertion functions for runtime type checking
function isString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error("Expected string");
  }
}

function processValue(value: unknown) {
  isString(value);
  // TypeScript now knows value is string
  console.log(value.toUpperCase());
}
```
