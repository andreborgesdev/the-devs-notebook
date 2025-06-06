# TypeScript Fundamentals

## Type System Basics

### Primitive Types

```typescript
let isDone: boolean = false;
let decimal: number = 6;
let hex: number = 0xf00d;
let binary: number = 0b1010;
let octal: number = 0o744;
let bigInt: bigint = 100n;
let color: string = "blue";
let templateStr: string = `Hello ${color}`;
let nothing: null = null;
let notDefined: undefined = undefined;
let sym: symbol = Symbol("key");
```

### Type Annotations vs Type Inference

```typescript
// Type annotation (explicit)
let message: string = "Hello World";

// Type inference (implicit)
let inferredMessage = "Hello World"; // TypeScript infers string

// When to use annotations
function greet(name: string): string {
  return `Hello ${name}`;
}

// Multiple types with union
let id: string | number = 123;
id = "ABC123"; // Valid
```

### Arrays and Tuples

```typescript
// Arrays
let numbers: number[] = [1, 2, 3];
let strings: Array<string> = ["a", "b", "c"];
let mixed: (string | number)[] = [1, "two", 3];

// Tuples - fixed length arrays with specific types
let person: [string, number] = ["John", 30];
let rgb: [number, number, number] = [255, 0, 128];

// Optional tuple elements
let optionalTuple: [string, number?] = ["Alice"];

// Rest elements in tuples
let restTuple: [string, ...number[]] = ["John", 1, 2, 3];
```

### Enums

```typescript
// Numeric enums
enum Direction {
  Up, // 0
  Down, // 1
  Left, // 2
  Right, // 3
}

// String enums
enum Color {
  Red = "RED",
  Green = "GREEN",
  Blue = "BLUE",
}

// Heterogeneous enums (mixed)
enum BooleanLikeHeterogeneousEnum {
  No = 0,
  Yes = "YES",
}

// Const enums (inlined at compile time)
const enum HttpStatus {
  OK = 200,
  NotFound = 404,
  InternalServerError = 500,
}
```

### Any, Unknown, and Never

```typescript
// any - disables type checking (avoid when possible)
let anything: any = 42;
anything = "hello";
anything.foo.bar; // No error, but dangerous

// unknown - type-safe alternative to any
let value: unknown = 42;
if (typeof value === "string") {
  console.log(value.toUpperCase()); // Type guard required
}

// never - represents values that never occur
function throwError(message: string): never {
  throw new Error(message);
}

function infiniteLoop(): never {
  while (true) {}
}

// never in conditional types
type NonNullable<T> = T extends null | undefined ? never : T;
```

### Object Types

```typescript
// Object type annotation
let user: {
  name: string;
  age: number;
  email?: string; // Optional property
  readonly id: number; // Read-only property
} = {
  name: "John",
  age: 30,
  id: 1,
};

// Index signatures
let scores: { [subject: string]: number } = {
  math: 95,
  science: 87,
};

// Nested objects
let employee: {
  personal: {
    name: string;
    age: number;
  };
  work: {
    title: string;
    department: string;
  };
} = {
  personal: { name: "Alice", age: 28 },
  work: { title: "Developer", department: "Engineering" },
};
```

### Function Types

```typescript
// Function type annotations
function add(a: number, b: number): number {
  return a + b;
}

// Function expressions
const multiply = (a: number, b: number): number => a * b;

// Function type aliases
type Operation = (a: number, b: number) => number;
const divide: Operation = (a, b) => a / b;

// Optional parameters
function greet(name: string, greeting?: string): string {
  return `${greeting || "Hello"} ${name}`;
}

// Default parameters
function createUser(name: string, role: string = "user"): object {
  return { name, role };
}

// Rest parameters
function sum(...numbers: number[]): number {
  return numbers.reduce((total, num) => total + num, 0);
}

// Function overloads
function combine(a: string, b: string): string;
function combine(a: number, b: number): number;
function combine(a: any, b: any): any {
  return a + b;
}
```

## Type Assertions and Type Guards

### Type Assertions

```typescript
// Angle bracket syntax
let someValue: unknown = "this is a string";
let strLength: number = (<string>someValue).length;

// as syntax (preferred in JSX)
let strLength2: number = (someValue as string).length;

// Non-null assertion operator
function processUser(user?: { name: string }) {
  // Tell TypeScript that user is definitely not null/undefined
  console.log(user!.name);
}
```

### Type Guards

```typescript
// typeof type guards
function padLeft(value: string, padding: string | number) {
  if (typeof padding === "number") {
    return Array(padding + 1).join(" ") + value;
  }
  if (typeof padding === "string") {
    return padding + value;
  }
}

// instanceof type guards
class Dog {
  bark() {
    console.log("Woof!");
  }
}

class Cat {
  meow() {
    console.log("Meow!");
  }
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark(); // TypeScript knows this is a Dog
  } else {
    animal.meow(); // TypeScript knows this is a Cat
  }
}

// in operator type guards
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    animal.swim();
  } else {
    animal.fly();
  }
}

// Custom type guards
function isString(value: any): value is string {
  return typeof value === "string";
}

function processValue(value: string | number) {
  if (isString(value)) {
    console.log(value.toUpperCase()); // TypeScript knows value is string
  } else {
    console.log(value.toFixed(2)); // TypeScript knows value is number
  }
}
```

## Literal Types and Template Literal Types

### Literal Types

```typescript
// String literals
type Direction = "up" | "down" | "left" | "right";
let move: Direction = "up";

// Numeric literals
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;
let roll: DiceRoll = 3;

// Boolean literals
type Success = true;
let isSuccess: Success = true;

// Literal types in functions
function handleRequest(method: "GET" | "POST" | "PUT"): void {
  console.log(`Handling ${method} request`);
}
```

### Template Literal Types

```typescript
// Basic template literal types
type World = "world";
type Greeting = `hello ${World}`; // "hello world"

// With unions
type EmailLocaleIDs = "welcome_email" | "email_heading";
type FooterLocaleIDs = "footer_title" | "footer_sendoff";
type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
// "welcome_email_id" | "email_heading_id" | "footer_title_id" | "footer_sendoff_id"

// Advanced template literal patterns
type PropEventSource<Type> = {
  on<Key extends string & keyof Type>(
    eventName: `${Key}Changed`,
    callback: (newValue: Type[Key]) => void
  ): void;
};

declare function makeWatchedObject<Type>(
  obj: Type
): Type & PropEventSource<Type>;

const person = makeWatchedObject({
  firstName: "Homer",
  age: 42,
});

// Type-safe event names
person.on("firstNameChanged", (newName) => {
  console.log(`New name: ${newName.toUpperCase()}`);
});
```

## Best Practices

### Naming Conventions

```typescript
// PascalCase for types, interfaces, classes, enums
interface UserProfile {}
type ApiResponse = {};
class DatabaseManager {}
enum HttpMethod {}

// camelCase for variables, functions, methods
const userName = "john";
function getUserData() {}

// SCREAMING_SNAKE_CASE for constants
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = "https://api.example.com";
```

### Type Safety Tips

```typescript
// Use strict null checks
// tsconfig.json: "strictNullChecks": true

// Prefer unknown over any
function processApiResponse(data: unknown) {
  if (typeof data === "object" && data !== null) {
    // Safe to use data as object
  }
}

// Use type assertions sparingly
// Bad
const element = document.getElementById("myButton") as HTMLButtonElement;

// Better
const element = document.getElementById("myButton");
if (element instanceof HTMLButtonElement) {
  element.click();
}

// Prefer type unions over any
function processId(id: string | number) {
  // Handle both types explicitly
}
```

### Performance Considerations

```typescript
// Use const assertions for better inference
const colors = ["red", "green", "blue"] as const;
// Type: readonly ["red", "green", "blue"]

// Prefer interfaces over type aliases for object shapes
interface User {
  name: string;
  email: string;
}

// Use type aliases for unions, primitives, and computed types
type Status = "pending" | "approved" | "rejected";
type EventHandler<T> = (event: T) => void;
```
