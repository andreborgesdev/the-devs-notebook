# TypeScript

## Overview

**TypeScript** is a **superset of JavaScript** that adds optional static typing and other powerful features to the language. It compiles down to standard JavaScript, making it compatible with any JavaScript runtime.

| Feature        | Description                                                 |
| -------------- | ----------------------------------------------------------- |
| Static Typing  | Types checked at compile time                               |
| ESNext Support | Supports latest JavaScript features before browser adoption |
| Tooling        | Better autocompletion, navigation, and refactoring          |
| Compatibility  | Compiles to clean, standard JavaScript                      |

## Why TypeScript?

- Early detection of bugs
- Better IDE support and autocompletion
- Easier code refactoring
- Scales well in large codebases
- Improved documentation via types

## Basic Syntax

```typescript
// Variable with type
let count: number = 5;

// Function with parameter and return types
function add(a: number, b: number): number {
  return a + b;
}

// Arrays
let names: string[] = ["Alice", "Bob"];

// Tuples
let person: [string, number] = ["John", 30];

// Enums
enum Direction {
  Up,
  Down,
  Left,
  Right,
}

// Interfaces
interface User {
  name: string;
  age: number;
}

let user: User = { name: "Alice", age: 25 };
```

## Type Annotations

| Type           | Example                                                    |
| -------------- | ---------------------------------------------------------- |
| Number         | `let n: number = 10;`                                      |
| String         | `let s: string = "text";`                                  |
| Boolean        | `let b: boolean = true;`                                   |
| Array          | `let arr: number[] = [1,2];`                               |
| Tuple          | `let tup: [string, number] = ["a", 1];`                    |
| Enum           | `enum Direction { Up, Down }`                              |
| Any            | `let x: any = "could be anything";`                        |
| Void           | `function log(): void { console.log("log"); }`             |
| Null/Undefined | `null`, `undefined`                                        |
| Never          | For functions that never return (`throw` or infinite loop) |

## Functions

```typescript
function greet(name: string = "Guest"): string {
  return `Hello, ${name}`;
}

// Arrow function
const multiply = (a: number, b: number): number => a * b;
```

## Classes and Inheritance

```typescript
class Animal {
  constructor(public name: string) {}

  speak(): void {
    console.log(`${this.name} makes a sound`);
  }
}

class Dog extends Animal {
  speak(): void {
    console.log(`${this.name} barks`);
  }
}

const dog = new Dog("Buddy");
dog.speak(); // Buddy barks
```

## Interfaces vs Types

```typescript
interface Car {
  brand: string;
  speed: number;
}

type Bike = {
  brand: string;
  gear: number;
};
```

**Interfaces** are extendable and preferred for object shapes. **Types** can represent primitives, unions, and more complex types.

## Generics

```typescript
function identity<T>(value: T): T {
  return value;
}

let num = identity<number>(42);
```

## Union and Intersection Types

```typescript
// Union
let id: number | string;
id = 123;
id = "ABC";

// Intersection
interface A {
  propA: string;
}
interface B {
  propB: number;
}
type AB = A & B;

let obj: AB = { propA: "value", propB: 42 };
```

## Type Narrowing

```typescript
function printId(id: number | string) {
  if (typeof id === "string") {
    console.log(id.toUpperCase());
  } else {
    console.log(id.toFixed(2));
  }
}
```

## Type Assertions

```typescript
let someValue: any = "this is a string";
let strLength: number = (someValue as string).length;
```

## Advanced Features

- **Mapped Types**
  Transform existing types

```typescript
type ReadonlyUser = Readonly<User>;
```

- **Conditional Types**
  Type based on a condition

```typescript
type Message<T> = T extends string ? string : never;
```

- **Utility Types**
  Provided by TypeScript

| Utility      | Description                 |
| ------------ | --------------------------- |
| Partial<T>   | All properties optional     |
| Required<T>  | All properties required     |
| Readonly<T>  | All properties readonly     |
| Pick\<T,K>   | Pick specific properties    |
| Omit\<T,K>   | Omit specific properties    |
| Record\<K,T> | Map keys to a specific type |

## TypeScript vs JavaScript

| Feature             | JavaScript      | TypeScript                        |
| ------------------- | --------------- | --------------------------------- |
| Typing              | Dynamic         | Optional static typing            |
| Compile-time checks | No              | Yes                               |
| Latest ES features  | Partial support | Full (transpiled if needed)       |
| Tooling             | Good            | Excellent (autocompletion, etc)   |
| Learning Curve      | Low             | Moderate (due to typing concepts) |

## TypeScript and System Design

| Area                 | Role of TypeScript                            |
| -------------------- | --------------------------------------------- |
| Frontend Development | Enhances scalability and maintainability      |
| Backend Development  | Used with Node.js, NestJS                     |
| API Contracts        | Improves consistency and reliability          |
| Microservices        | Helps with contract-first development         |
| Serverless           | AWS Lambda and other FaaS services support it |

## Tooling

| Purpose     | Tool/Library                |
| ----------- | --------------------------- |
| Compiler    | `tsc` (TypeScript Compiler) |
| Linting     | TSLint (deprecated), ESLint |
| Formatter   | Prettier                    |
| Testing     | Jest, Mocha, Jasmine        |
| Build Tools | Webpack, Rollup             |
| Frameworks  | Angular, NestJS, Next.js    |

## Best Practices

- Prefer `interface` over `type` for object structures
- Use `strict` mode for type safety
- Leverage generics for reusable components
- Avoid using `any` whenever possible
- Use utility types to reduce repetitive code
- Keep types and interfaces small and focused

## Summary

TypeScript brings **strong typing, better tooling, and modern features** to JavaScript development. It enhances code quality, maintainability, and developer productivity, making it a popular choice for large-scale applications and professional teams.
