# TypeScript Interfaces and Types

## Interfaces

### Basic Interface Declaration

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

const user: User = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  isActive: true,
};
```

### Optional and Readonly Properties

```typescript
interface Product {
  readonly id: number; // Cannot be changed after creation
  name: string;
  price: number;
  description?: string; // Optional property
  tags?: string[]; // Optional array
  readonly createdAt: Date; // Readonly date
}

const product: Product = {
  id: 1,
  name: "MacBook Pro",
  price: 2399,
  createdAt: new Date(),
};

// product.id = 2; // Error: Cannot assign to 'id' because it is read-only
```

### Index Signatures

```typescript
interface StringDictionary {
  [key: string]: string;
}

interface NumberDictionary {
  [key: string]: number;
  length: number; // OK, length is a number
  name: string; // Error: Property 'name' must be number
}

// Multiple index signatures
interface MixedDictionary {
  [key: string]: string | number;
  [key: number]: string; // Numeric indices must be assignable to string indices
}

// Generic index signature
interface Dictionary<T> {
  [key: string]: T;
}

const scores: Dictionary<number> = {
  math: 95,
  science: 87,
  english: 92,
};
```

### Function Types in Interfaces

```typescript
interface Calculator {
  add(a: number, b: number): number;
  subtract: (a: number, b: number) => number;
  multiply(a: number, b: number): number;
  divide?: (a: number, b: number) => number; // Optional method
}

const calc: Calculator = {
  add(a, b) {
    return a + b;
  },
  subtract: (a, b) => a - b,
  multiply: function (a, b) {
    return a * b;
  },
};

// Interface for constructor functions
interface ClockConstructor {
  new (hour: number, minute: number): Clock;
}

interface Clock {
  currentTime: Date;
  setTime(d: Date): void;
}

function createClock(
  ctor: ClockConstructor,
  hour: number,
  minute: number
): Clock {
  return new ctor(hour, minute);
}
```

### Interface Inheritance

```typescript
interface Animal {
  name: string;
  age: number;
}

interface Dog extends Animal {
  breed: string;
  bark(): void;
}

interface Cat extends Animal {
  indoor: boolean;
  meow(): void;
}

// Multiple inheritance
interface Bird extends Animal {
  canFly: boolean;
}

interface Pet {
  owner: string;
}

interface PetBird extends Bird, Pet {
  cageSize: string;
}

const myPetBird: PetBird = {
  name: "Tweety",
  age: 2,
  canFly: true,
  owner: "Alice",
  cageSize: "large",
};
```

### Interface Merging

```typescript
interface User {
  name: string;
}

interface User {
  age: number;
}

interface User {
  email: string;
}

// Merged interface has all properties
const user: User = {
  name: "John",
  age: 30,
  email: "john@example.com",
};

// Augmenting library interfaces
declare global {
  interface Window {
    myCustomProperty: string;
  }
}

window.myCustomProperty = "Hello World";
```

## Type Aliases

### Basic Type Aliases

```typescript
// Primitive type aliases
type UserID = string;
type Score = number;
type IsActive = boolean;

// Object type aliases
type Point = {
  x: number;
  y: number;
};

type User = {
  id: UserID;
  name: string;
  score: Score;
  isActive: IsActive;
  position: Point;
};
```

### Union and Intersection Types

```typescript
// Union types
type Status = "pending" | "approved" | "rejected";
type ID = string | number;
type Theme = "light" | "dark" | "auto";

function setTheme(theme: Theme) {
  document.body.className = theme;
}

// Intersection types
type Person = {
  name: string;
  age: number;
};

type Employee = {
  employeeId: string;
  department: string;
};

type WorkingPerson = Person & Employee;

const worker: WorkingPerson = {
  name: "John",
  age: 30,
  employeeId: "EMP001",
  department: "Engineering",
};

// Complex intersections
type Timestamped = {
  createdAt: Date;
  updatedAt: Date;
};

type Article = {
  title: string;
  content: string;
  author: string;
} & Timestamped;
```

### Conditional Types

```typescript
// Basic conditional types
type IsString<T> = T extends string ? true : false;
type Test1 = IsString<string>; // true
type Test2 = IsString<number>; // false

// Conditional types with infer
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;
type FuncReturn = ReturnType<() => string>; // string

// Distributive conditional types
type ToArray<T> = T extends any ? T[] : never;
type StringOrNumberArray = ToArray<string | number>; // string[] | number[]

// Advanced conditional type example
type NonNullable<T> = T extends null | undefined ? never : T;
type ApiResponse<T> = T extends string
  ? { message: T }
  : T extends number
  ? { code: T }
  : T extends boolean
  ? { success: T }
  : never;
```

### Mapped Types

```typescript
// Basic mapped types
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

type Required<T> = {
  [P in keyof T]-?: T[P];
};

// Custom mapped types
type Stringify<T> = {
  [K in keyof T]: string;
};

type User = {
  id: number;
  name: string;
  age: number;
};

type StringifiedUser = Stringify<User>;
// { id: string; name: string; age: string; }

// Mapped types with conditional logic
type NullableKeys<T> = {
  [K in keyof T]: null extends T[K] ? K : never;
}[keyof T];

type OptionalKeys<T> = {
  [K in keyof T]: {} extends Pick<T, K> ? K : never;
}[keyof T];

// Template literals in mapped types
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type UserGetters = Getters<User>;
// { getId: () => number; getName: () => string; getAge: () => number; }
```

## Interfaces vs Type Aliases

### When to Use Interfaces

```typescript
// ✅ Use interfaces for object shapes that might be extended
interface BaseComponent {
  render(): void;
}

interface Button extends BaseComponent {
  onClick(): void;
}

// ✅ Use interfaces for public API contracts
interface ApiClient {
  get<T>(url: string): Promise<T>;
  post<T>(url: string, data: any): Promise<T>;
}

// ✅ Use interfaces when you need declaration merging
interface jQuery {
  addClass(className: string): jQuery;
}

interface jQuery {
  removeClass(className: string): jQuery;
}
```

### When to Use Type Aliases

```typescript
// ✅ Use type aliases for unions
type Status = "loading" | "success" | "error";
type Theme = "light" | "dark";

// ✅ Use type aliases for computed types
type EventHandlers<T> = {
  [K in keyof T as `on${Capitalize<string & K>}`]: (value: T[K]) => void;
};

// ✅ Use type aliases for conditional types
type ApiResponse<T> = T extends string ? { message: T } : { data: T };

// ✅ Use type aliases for primitive aliases
type UserID = string;
type Timestamp = number;

// ✅ Use type aliases for function types
type EventHandler = (event: Event) => void;
type Validator<T> = (value: T) => boolean;
```

### Interoperability

```typescript
// Interface extending type alias
type Point = {
  x: number;
  y: number;
};

interface Circle extends Point {
  radius: number;
}

// Type alias using interface
interface User {
  name: string;
  age: number;
}

type UserWithID = User & {
  id: string;
};

// Both work together seamlessly
const user: UserWithID = {
  id: "123",
  name: "John",
  age: 30,
};

const circle: Circle = {
  x: 0,
  y: 0,
  radius: 5,
};
```

## Advanced Interface Patterns

### Generic Interfaces

```typescript
interface Repository<T> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
  findAll(): Promise<T[]>;
}

interface User {
  id: string;
  name: string;
  email: string;
}

class UserRepository implements Repository<User> {
  async findById(id: string): Promise<User | null> {
    // Implementation
    return null;
  }

  async save(user: User): Promise<User> {
    // Implementation
    return user;
  }

  async delete(id: string): Promise<void> {
    // Implementation
  }

  async findAll(): Promise<User[]> {
    // Implementation
    return [];
  }
}
```

### Hybrid Types

```typescript
// Callable interface
interface Counter {
  (start: number): string;
  interval: number;
  reset(): void;
}

function getCounter(): Counter {
  let counter = function (start: number) {
    return `Count: ${start}`;
  } as Counter;

  counter.interval = 123;
  counter.reset = function () {};
  return counter;
}

const c = getCounter();
c(10); // Call as function
c.reset(); // Call method
c.interval = 5; // Access property
```

### Interface for Classes

```typescript
interface Flyable {
  fly(): void;
  altitude: number;
}

interface Swimmable {
  swim(): void;
  depth: number;
}

// Class implementing multiple interfaces
class Duck implements Flyable, Swimmable {
  altitude: number = 0;
  depth: number = 0;

  fly(): void {
    this.altitude = 100;
    console.log("Flying at altitude:", this.altitude);
  }

  swim(): void {
    this.depth = 5;
    console.log("Swimming at depth:", this.depth);
  }
}

// Static side interface
interface ClockConstructor {
  new (hour: number, minute: number): Clock;
  staticMethod(): void;
}

interface Clock {
  currentTime: Date;
  setTime(d: Date): void;
}

const ClockClass: ClockConstructor = class implements Clock {
  currentTime: Date = new Date();

  constructor(hour: number, minute: number) {
    this.setTime(new Date());
  }

  setTime(d: Date): void {
    this.currentTime = d;
  }

  static staticMethod(): void {
    console.log("Static method called");
  }
};
```
