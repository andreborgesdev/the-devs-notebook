# TypeScript Interview Questions

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
