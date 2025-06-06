# TypeScript Generics

## Generic Basics

### Why Generics?

Generics allow you to write reusable, type-safe code that works with multiple types while preserving type information.

```typescript
// Without generics - not reusable
function identityString(arg: string): string {
  return arg;
}

function identityNumber(arg: number): number {
  return arg;
}

// With generics - reusable and type-safe
function identity<T>(arg: T): T {
  return arg;
}

const stringResult = identity<string>("hello"); // Type: string
const numberResult = identity<number>(42); // Type: number
const boolResult = identity(true); // Type inferred as boolean
```

### Generic Functions

```typescript
// Basic generic function
function swap<T, U>(a: T, b: U): [U, T] {
  return [b, a];
}

const swapped = swap("hello", 42); // Type: [number, string]

// Generic function with multiple type parameters
function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

const merged = merge({ name: "John" }, { age: 30 });
// Type: { name: string } & { age: number }

// Generic array functions
function getFirst<T>(arr: T[]): T | undefined {
  return arr[0];
}

function getLast<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}

const numbers = [1, 2, 3, 4, 5];
const firstNumber = getFirst(numbers); // Type: number | undefined
const lastNumber = getLast(numbers); // Type: number | undefined
```

### Generic Interfaces

```typescript
// Generic interface
interface Container<T> {
  value: T;
  getValue(): T;
  setValue(value: T): void;
}

class StringContainer implements Container<string> {
  constructor(public value: string) {}

  getValue(): string {
    return this.value;
  }

  setValue(value: string): void {
    this.value = value;
  }
}

// Generic interface with multiple type parameters
interface KeyValuePair<K, V> {
  key: K;
  value: V;
}

const stringNumberPair: KeyValuePair<string, number> = {
  key: "age",
  value: 30,
};

// Generic interface for functions
interface Transformer<T, U> {
  (input: T): U;
}

const stringToNumber: Transformer<string, number> = (str) => parseInt(str);
const numberToString: Transformer<number, string> = (num) => num.toString();
```

### Generic Classes

```typescript
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;

  constructor(zeroValue: T, addFn: (x: T, y: T) => T) {
    this.zeroValue = zeroValue;
    this.add = addFn;
  }
}

const myGenericNumber = new GenericNumber<number>(0, (x, y) => x + y);
console.log(myGenericNumber.add(5, 10)); // 15

const myGenericString = new GenericNumber<string>("", (x, y) => x + y);
console.log(myGenericString.add("Hello ", "World")); // "Hello World"

// Generic class with constraints
class Repository<T extends { id: string }> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  findById(id: string): T | undefined {
    return this.items.find((item) => item.id === id);
  }

  getAll(): T[] {
    return [...this.items];
  }
}

interface User {
  id: string;
  name: string;
  email: string;
}

const userRepo = new Repository<User>();
userRepo.add({ id: "1", name: "John", email: "john@example.com" });
```

## Generic Constraints

### Basic Constraints

```typescript
// Constraining to objects with a length property
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length); // Now we know it has a .length property
  return arg;
}

loggingIdentity("hello"); // OK
loggingIdentity([1, 2, 3]); // OK
loggingIdentity({ length: 10, value: 3 }); // OK
// loggingIdentity(3);           // Error: number doesn't have length

// Multiple constraints
interface Named {
  name: string;
}

interface Aged {
  age: number;
}

function processEntity<T extends Named & Aged>(entity: T): string {
  return `${entity.name} is ${entity.age} years old`;
}

processEntity({ name: "John", age: 30, city: "NYC" }); // OK
```

### Keyof Constraints

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person = { name: "John", age: 30, city: "NYC" };

const name = getProperty(person, "name"); // Type: string
const age = getProperty(person, "age"); // Type: number
// const invalid = getProperty(person, "invalidKey"); // Error

// Advanced keyof usage
function updateProperty<T, K extends keyof T>(
  obj: T,
  key: K,
  value: T[K]
): void {
  obj[key] = value;
}

updateProperty(person, "age", 31); // OK
// updateProperty(person, "age", "thirty");  // Error: string not assignable to number
```

### Conditional Type Constraints

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

function processValue<T>(value: NonNullable<T>): T {
  // value is guaranteed to not be null or undefined
  return value;
}

// Using conditional constraints
type ApiResponse<T> = T extends string
  ? { message: T }
  : T extends number
  ? { code: T }
  : { data: T };

function handleResponse<T>(data: T): ApiResponse<T> {
  if (typeof data === "string") {
    return { message: data } as ApiResponse<T>;
  }
  if (typeof data === "number") {
    return { code: data } as ApiResponse<T>;
  }
  return { data } as ApiResponse<T>;
}
```

## Advanced Generic Patterns

### Generic Type Aliases

```typescript
// Generic type aliases
type Result<T, E = Error> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: E;
    };

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return { success: false, error: "Division by zero" };
  }
  return { success: true, data: a / b };
}

// Utility type aliases
type Optional<T> = {
  [K in keyof T]?: T[K];
};

type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

type Flatten<T> = T extends Array<infer U> ? U : T;
type StringArray = string[];
type FlatString = Flatten<StringArray>; // string
```

### Generic Utility Functions

```typescript
// Generic array utilities
function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}

function groupBy<T, K extends keyof T>(
  array: T[],
  key: K
): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    return {
      ...groups,
      [groupKey]: [...(groups[groupKey] || []), item],
    };
  }, {} as Record<string, T[]>);
}

// Usage
const users = [
  { name: "John", department: "Engineering" },
  { name: "Jane", department: "Marketing" },
  { name: "Bob", department: "Engineering" },
];

const grouped = groupBy(users, "department");
// { Engineering: [...], Marketing: [...] }
```

### Generic Higher-Order Functions

```typescript
// Generic function composition
type Func<A, B> = (a: A) => B;

function compose<A, B, C>(f: Func<B, C>, g: Func<A, B>): Func<A, C> {
  return (a: A) => f(g(a));
}

const addOne = (x: number) => x + 1;
const toString = (x: number) => x.toString();
const addOneAndStringify = compose(toString, addOne);

console.log(addOneAndStringify(5)); // "6"

// Generic curry function
function curry<A, B, C>(fn: (a: A, b: B) => C): (a: A) => (b: B) => C {
  return (a: A) => (b: B) => fn(a, b);
}

const add = (a: number, b: number) => a + b;
const curriedAdd = curry(add);
const add5 = curriedAdd(5);
console.log(add5(3)); // 8

// Generic memoization
function memoize<Args extends any[], Return>(
  fn: (...args: Args) => Return
): (...args: Args) => Return {
  const cache = new Map<string, Return>();

  return (...args: Args): Return => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

const expensiveOperation = memoize((n: number): number => {
  console.log(`Computing for ${n}`);
  return n * n;
});
```

## Generic Inference

### Type Inference with Generics

```typescript
// TypeScript can infer generic types
function createArray<T>(item: T, count: number): T[] {
  return new Array(count).fill(item);
}

const stringArray = createArray("hello", 3); // Type inferred as string[]
const numberArray = createArray(42, 5); // Type inferred as number[]

// Inference with multiple parameters
function zip<T, U>(arr1: T[], arr2: U[]): Array<[T, U]> {
  return arr1.map((item, index) => [item, arr2[index]]);
}

const names = ["John", "Jane"];
const ages = [30, 25];
const zipped = zip(names, ages); // Type: Array<[string, number]>

// Inference with constraints
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    result[key] = obj[key];
  });
  return result;
}

const user = { name: "John", age: 30, email: "john@example.com" };
const picked = pick(user, ["name", "age"]); // Type: { name: string; age: number; }
```

### Advanced Inference Patterns

```typescript
// Inference with conditional types
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

async function getData(): Promise<string> {
  return "data";
}

type DataType = UnwrapPromise<ReturnType<typeof getData>>; // string

// Inference with tuple types
function tuple<T extends readonly any[]>(...args: T): T {
  return args;
}

const result = tuple("hello", 42, true); // Type: readonly ["hello", 42, true]

// Inference with mapped types
type EventHandlers<T> = {
  [K in keyof T as `on${Capitalize<string & K>}`]?: (value: T[K]) => void;
};

function createEventSystem<T extends Record<string, any>>(
  initialState: T
): T & EventHandlers<T> {
  // Implementation would go here
  return {} as T & EventHandlers<T>;
}

const eventSystem = createEventSystem({
  count: 0,
  name: "example",
});

// Available methods: onCount, onName (with proper types)
eventSystem.onCount = (count) => console.log(count); // count is number
eventSystem.onName = (name) => console.log(name); // name is string
```

## Real-World Generic Examples

### API Client with Generics

```typescript
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    return response.json();
  }

  async post<T, U = any>(endpoint: string, data: U): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async put<T, U = any>(endpoint: string, data: U): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  }
}

// Usage with proper typing
interface User {
  id: string;
  name: string;
  email: string;
}

interface CreateUserRequest {
  name: string;
  email: string;
}

const api = new ApiClient("https://api.example.com");

// Type-safe API calls
const users = await api.get<User[]>("/users");
const newUser = await api.post<User, CreateUserRequest>("/users", {
  name: "John",
  email: "john@example.com",
});
```

### Generic State Management

```typescript
interface State<T> {
  data: T;
  loading: boolean;
  error: string | null;
}

type Action<T> =
  | { type: "LOADING" }
  | { type: "SUCCESS"; payload: T }
  | { type: "ERROR"; payload: string }
  | { type: "RESET" };

function createReducer<T>(initialData: T) {
  return function reducer(state: State<T>, action: Action<T>): State<T> {
    switch (action.type) {
      case "LOADING":
        return { ...state, loading: true, error: null };
      case "SUCCESS":
        return { data: action.payload, loading: false, error: null };
      case "ERROR":
        return { ...state, loading: false, error: action.payload };
      case "RESET":
        return { data: initialData, loading: false, error: null };
      default:
        return state;
    }
  };
}

// Usage
const userReducer = createReducer<User | null>(null);
const usersReducer = createReducer<User[]>([]);

// Type-safe dispatch
const userState = userReducer(
  { data: null, loading: false, error: null },
  {
    type: "SUCCESS",
    payload: { id: "1", name: "John", email: "john@example.com" },
  }
);
```

## Best Practices

### Generic Naming Conventions

```typescript
// ✅ Good: Descriptive single letters
function map<T, U>(array: T[], fn: (item: T) => U): U[] {
  return array.map(fn);
}

// ✅ Good: Descriptive names for complex generics
function createValidator<TInput, TOutput, TError>(
  validate: (input: TInput) => TOutput | TError
): Validator<TInput, TOutput, TError> {
  // Implementation
}

// ❌ Avoid: Non-descriptive names
function process<A, B, C, D>(a: A, b: B): C & D {
  // Hard to understand what A, B, C, D represent
}
```

### Generic Constraints Best Practices

```typescript
// ✅ Use specific constraints
interface Serializable {
  toString(): string;
}

function serialize<T extends Serializable>(item: T): string {
  return item.toString();
}

// ✅ Use union constraints when appropriate
function processId<T extends string | number>(id: T): T {
  // Can handle both string and number IDs
  return id;
}

// ❌ Avoid overly restrictive constraints
function badExample<T extends { a: string; b: number; c: boolean }>(
  item: T
): T {
  // Too specific, reduces reusability
  return item;
}
```

### Performance Considerations

```typescript
// ✅ Use generic constraints to avoid runtime checks
function processItems<T extends { id: string }>(items: T[]): T[] {
  return items.filter((item) => item.id.length > 0); // Type-safe access to id
}

// ❌ Avoid using any with generics
function badGeneric<T>(item: T): any {
  return item; // Loses all type information
}

// ✅ Use conditional types for better inference
type SmartDefault<T> = T extends string
  ? ""
  : T extends number
  ? 0
  : T extends boolean
  ? false
  : null;
```
