# TypeScript Interview Questions

## Core Concepts

### What is TypeScript?

TypeScript is a statically typed superset of JavaScript developed by Microsoft that compiles to plain JavaScript. It adds optional static typing, interfaces, generics, and other features to JavaScript.

**Key Features:**

- Static type checking at compile time
- Enhanced IDE support with IntelliSense
- ES6+ features support
- Code refactoring capabilities
- Better tooling and debugging

### What are the main benefits of using TypeScript?

1. **Early Error Detection** - Catch errors at compile time
2. **Better Code Documentation** - Types serve as documentation
3. **Enhanced IDE Support** - Better autocomplete and refactoring
4. **Improved Maintainability** - Easier to maintain large codebases
5. **Better Refactoring** - Safe refactoring with type checking
6. **Team Collaboration** - Clear contracts between code components

### Difference between `any`, `unknown`, and `never`

```typescript
// any - Disables type checking completely
let value: any = 42;
value.foo.bar; // No error, but might crash at runtime

// unknown - Type-safe any
let userInput: unknown;
// userInput.toUpperCase(); // Error: must check type first
if (typeof userInput === "string") {
  userInput.toUpperCase(); // OK
}

// never - Represents values that never occur
function throwError(): never {
  throw new Error("Something went wrong");
}
```

### What are TypeScript's primitive types?

- `string` - Text data
- `number` - Numeric values (integers and floats)
- `boolean` - True/false values
- `bigint` - Large integers (ES2020)
- `symbol` - Unique identifiers
- `undefined` - Undefined value
- `null` - Null value

## Types and Interfaces

### Difference between `type` aliases and `interface`

```typescript
// Interface - Extendable and mergeable
interface User {
  name: string;
  age: number;
}

interface User {
  email: string; // Declaration merging - adds to existing interface
}

// Type alias - More flexible
type UserType = {
  name: string;
  age: number;
};

type ID = string | number; // Union types
type UserWithId = UserType & { id: ID }; // Intersection
```

**When to use:**

- **Interface**: Object shapes, when you need extension/merging
- **Type**: Unions, intersections, computed types, primitives

### Can interfaces extend types and vice versa?

```typescript
type PersonType = {
  name: string;
  age: number;
};

// Interface extending type
interface Employee extends PersonType {
  employeeId: string;
}

// Type extending interface
interface Manager {
  department: string;
}

type ManagerEmployee = Employee & Manager;
```

### What is structural typing?

TypeScript uses structural typing (duck typing) - if two types have the same structure, they're considered compatible.

```typescript
interface Bird {
  fly(): void;
}

class Airplane {
  fly() {
    console.log("Flying");
  }
}

function makeFly(flyable: Bird) {
  flyable.fly();
}

makeFly(new Airplane()); // Works! Airplane has the same structure as Bird
```

## Advanced Types

### Union and Intersection Types

```typescript
// Union - OR relationship
type StringOrNumber = string | number;

// Intersection - AND relationship
type Person = { name: string };
type Employee = { employeeId: string };
type PersonEmployee = Person & Employee; // Must have both properties

// Discriminated Union
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; sideLength: number };

function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
  }
}
```

### What are literal types?

Literal types represent exact values rather than general types.

```typescript
type Direction = "up" | "down" | "left" | "right";
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;
type Theme = "light" | "dark";

function move(direction: Direction) {
  // direction can only be one of the specified strings
}
```

### What are mapped types?

Mapped types create new types by transforming properties of existing types.

```typescript
type User = {
  id: number;
  name: string;
  email: string;
};

// Make all properties optional
type PartialUser = Partial<User>;

// Make all properties readonly
type ReadonlyUser = Readonly<User>;

// Custom mapped type
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

type NullableUser = Nullable<User>;
```

## Generics

### What are generics?

Generics allow creating reusable components that work with multiple types while maintaining type safety.

```typescript
function identity<T>(arg: T): T {
  return arg;
}

// Usage
let output = identity<string>("hello"); // Type is string
let numberOutput = identity(42); // Type inferred as number

// Generic interfaces
interface GenericIdentityFn<T> {
  (arg: T): T;
}

// Generic classes
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}
```

### Generic Constraints

Constraining generics to certain types using `extends`.

```typescript
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length); // Now we know it has a .length property
  return arg;
}

// Using keyof constraint
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

### Conditional Types

Types that resolve based on conditions.

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

// More complex example
type ApiResponse<T> = T extends string
  ? { message: T }
  : T extends number
  ? { code: T }
  : { data: T };
```

## Utility Types

### Common Utility Types

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Partial<T> - All properties optional
type UserUpdate = Partial<User>;

// Required<T> - All properties required
type RequiredUser = Required<Partial<User>>;

// Pick<T, K> - Select specific properties
type PublicUser = Pick<User, "id" | "name" | "email">;

// Omit<T, K> - Exclude specific properties
type CreateUser = Omit<User, "id">;

// Record<K, T> - Map keys to type
type UserRoles = Record<string, "admin" | "user" | "guest">;

// ReturnType<T> - Extract return type of function
function getUser() {
  return { id: 1, name: "John" };
}
type UserReturnType = ReturnType<typeof getUser>;
```

## Functions and Classes

### Function Overloads

```typescript
function makeDate(timestamp: number): Date;
function makeDate(m: number, d: number, y: number): Date;
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
  if (d !== undefined && y !== undefined) {
    return new Date(y, mOrTimestamp, d);
  } else {
    return new Date(mOrTimestamp);
  }
}
```

### Class Property Decorators and Access Modifiers

```typescript
class BankAccount {
  public accountNumber: string; // Accessible everywhere
  protected balance: number; // Accessible in class and subclasses
  private pin: string; // Only accessible within this class

  constructor(accountNumber: string, initialBalance: number, pin: string) {
    this.accountNumber = accountNumber;
    this.balance = initialBalance;
    this.pin = pin;
  }

  // Getter/Setter
  get currentBalance(): number {
    return this.balance;
  }

  set currentBalance(amount: number) {
    if (amount >= 0) {
      this.balance = amount;
    }
  }
}
```

## Type Guards

### Built-in Type Guards

```typescript
function processValue(value: string | number) {
  if (typeof value === "string") {
    // TypeScript knows value is string here
    return value.toUpperCase();
  } else {
    // TypeScript knows value is number here
    return value.toFixed(2);
  }
}

// instanceof guard
if (error instanceof Error) {
  console.log(error.message);
}
```

### Custom Type Guards

```typescript
interface Bird {
  fly(): void;
}

interface Fish {
  swim(): void;
}

// Custom type guard
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

// Usage
function move(pet: Fish | Bird) {
  if (isFish(pet)) {
    pet.swim(); // TypeScript knows it's Fish
  } else {
    pet.fly(); // TypeScript knows it's Bird
  }
}
```

## Modules and Namespaces

### Module Resolution

TypeScript supports two resolution strategies:

1. **Node Resolution** (default)
2. **Classic Resolution** (legacy)

```typescript
// Relative imports
import { helper } from "./utils/helper";

// Non-relative imports
import * as React from "react";
import { Component } from "@angular/core";
```

### Declaration Merging

```typescript
// Multiple interface declarations merge
interface User {
  name: string;
}

interface User {
  age: number;
}

// Merged interface has both properties
const user: User = {
  name: "John",
  age: 30,
};
```

## Configuration and Tooling

### Important tsconfig.json Options

```json
{
  "compilerOptions": {
    "strict": true, // Enable all strict type checks
    "noImplicitAny": true, // Error on implicit any
    "strictNullChecks": true, // Null/undefined handling
    "noImplicitReturns": true, // Error on missing returns
    "noUnusedLocals": true, // Error on unused variables
    "exactOptionalPropertyTypes": true, // Strict optional properties
    "target": "ES2020", // Target JavaScript version
    "module": "CommonJS", // Module system
    "moduleResolution": "node", // Module resolution strategy
    "esModuleInterop": true, // CommonJS/ES module interop
    "allowSyntheticDefaultImports": true, // Allow default imports
    "resolveJsonModule": true, // Import JSON files
    "declaration": true, // Generate .d.ts files
    "sourceMap": true // Generate source maps
  }
}
```

## Advanced Interview Topics

### Template Literal Types

```typescript
type Greeting = `Hello, ${string}!`;
type Color = "red" | "green" | "blue";
type Quantity = "one" | "two" | "three";
type SeussFish = `${Quantity} ${Color} fish`;
// "one red fish" | "one green fish" | "one blue fish" | ...
```

### Indexed Access Types

```typescript
type Person = {
  name: string;
  age: number;
  address: {
    street: string;
    city: string;
  };
};

type Name = Person["name"]; // string
type Address = Person["address"]; // { street: string; city: string; }
type Street = Person["address"]["street"]; // string
```

### keyof and typeof Operators

```typescript
interface Person {
  name: string;
  age: number;
}

type PersonKeys = keyof Person; // "name" | "age"

const person = {
  name: "John",
  age: 30,
};

type PersonType = typeof person; // { name: string; age: number; }
```

### Async/Promise Types

```typescript
// Async function return types
async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/users/${id}`);
  return response.json();
}

// Awaited utility type
type UserType = Awaited<ReturnType<typeof fetchUser>>; // User

// Promise handling
function handlePromise<T>(promise: Promise<T>): Promise<T | Error> {
  return promise.catch((error) =>
    error instanceof Error ? error : new Error(String(error))
  );
}
```

## Performance and Best Practices

### TypeScript Performance Tips

1. Use `interface` over `type` for object shapes
2. Avoid deep nesting in types
3. Use `const assertions` for immutable data
4. Prefer `unknown` over `any`
5. Use type narrowing instead of type assertions
6. Enable `strict` mode
7. Use `readonly` for immutable properties

### Common Pitfalls to Avoid

1. Overusing `any` type
2. Not using strict mode
3. Ignoring TypeScript errors
4. Not leveraging utility types
5. Complex type gymnastics instead of simple solutions
6. Not using proper error handling with `unknown`terview Questions

## Fundamentals

What is TypeScript?
TypeScript is a statically typed superset of JavaScript that compiles to plain JavaScript.

What are the main benefits of using TypeScript?
Static typing, early error detection, enhanced code readability, better IDE support, and improved maintainability.

What is the difference between `any`, `unknown`, and `never` types?
`any` disables type checking, `unknown` is a safer alternative that requires type checking before usage, and `never` represents values that never occur (e.g., functions that throw or never return).

What are TypeScript’s primitive types?
`string`, `number`, `boolean`, `bigint`, `symbol`, `undefined`, and `null`.

## Types and Interfaces

What is the difference between `type` aliases and `interface`?
Both can describe object shapes. `interface` is extendable and can be merged, while `type` aliases can use advanced type features like union, intersection, and mapped types.

Can interfaces extend types and vice versa?
Yes. An `interface` can extend a `type` and a `type` can use intersections to combine interfaces.

What is structural typing?
TypeScript uses structural typing, meaning compatibility is based on the shape (properties and methods) rather than explicit declarations.

Explain optional and readonly properties in interfaces.
Optional properties use `?` (e.g., `name?: string`) and readonly properties use the `readonly` keyword to prevent reassignment.

## Advanced Types

What are union and intersection types?
Union types allow a value to be one of several types (e.g., `string | number`), while intersection types combine multiple types into one (e.g., `A & B`).

What are literal types?
Literal types constrain a value to specific strings, numbers, or booleans (e.g., `type Direction = 'up' | 'down'`).

What is a discriminated union?
A pattern combining union types and literal types with a common property to narrow down the type using control flow.

What are mapped types?
Types that create new types by transforming properties of existing types (e.g., `Partial<T>`, `Readonly<T>`).

## Generics

What are generics in TypeScript?
Generics allow creating reusable components that work with multiple types while preserving type safety.

Explain generic constraints.
Constraints restrict the kinds of types that can be passed as generic parameters using the `extends` keyword.

What are conditional types?
Types that resolve to different types based on a condition (e.g., `T extends U ? X : Y`).

What are utility types in TypeScript?
Built-in types that transform types, such as `Partial<T>`, `Required<T>`, `Pick<T, K>`, `Omit<T, K>`, and `Record<K, T>`.

## Functions and Classes

How do you type functions in TypeScript?
By specifying parameter and return types (e.g., `(a: number, b: number) => number`).

What are function overloads?
Providing multiple type signatures for a single function to allow different argument combinations.

How does `this` typing work in TypeScript?
The type of `this` can be explicitly declared in methods using a fake parameter (e.g., `method(this: SomeType)`).

How do you enforce strict typing for class properties and methods?
By declaring property types in the class definition and using access modifiers (`public`, `private`, `protected`).

## Modules and Namespaces

What is the difference between internal and external modules?
Internal modules are namespaces (deprecated in favor of ES6 modules). External modules use `import`/`export` syntax.

How does module resolution work in TypeScript?
TypeScript looks for `.ts`, `.tsx`, `.d.ts`, and package definitions following Node.js or Classic resolution strategies.

What is declaration merging?
The process where TypeScript combines multiple declarations for the same name into a single definition.

## TypeScript and JavaScript Interoperability

How do you consume JavaScript libraries in TypeScript?
By using type declaration files (`.d.ts`) or DefinitelyTyped packages (`@types/*`).

What are ambient declarations?
Declarations used to describe the shape of libraries or code written in plain JavaScript so TypeScript can type-check them.

How can you avoid runtime errors when using third-party JavaScript code?
Use accurate type declarations and perform runtime checks where necessary.

## Configuration and Tooling

What is `tsconfig.json`?
A file that configures the TypeScript compiler options and specifies which files to include or exclude.

What is `strict` mode in TypeScript?
A mode that enables all strict type-checking options for more rigorous and safe type checking.

What is the purpose of `esModuleInterop`?
It allows default imports from CommonJS modules in a way compatible with ES6 module syntax.

## Advanced Topics

What are Type Guards?
Techniques to narrow down types at runtime using `typeof`, `instanceof`, or custom guard functions.

What is declaration merging?
When TypeScript automatically merges multiple declarations of the same name into a single entity (e.g., interface merging).

What are Indexed Access Types?
Accessing a property type via another type (e.g., `T[K]`).

What are template literal types?
Types that construct new string literal types from existing ones using template literal syntax (e.g., \`\`type Greeting = \`Hello, \${string}\`\`\`).

What are keyof and typeof operators?
`keyof` gets the union of property names from a type. `typeof` gets the type of a value.

What are TypeScript Decorators?
Special annotations prefixed by `@` that can modify classes, methods, properties, or parameters (experimental feature).

What are module augmentation and declaration merging used for?
They extend or add new types to existing modules or interfaces.

## Asynchronous and Modern Features

How do you type asynchronous functions?
By returning `Promise<Type>` from the function signature.

What are utility types like Awaited?
`Awaited<T>` helps extract the type that a Promise resolves to.

What is the difference between `unknown` and `any` in async functions?
`unknown` forces type checking before use, whereas `any` bypasses type safety.
