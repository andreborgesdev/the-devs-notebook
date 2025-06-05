# Compilers & Programming Languages

## Overview

Compilers are programs that translate high-level programming languages into machine code or another target language. Understanding compiler design is crucial for system programming and language development.

## Compilation Process

### Lexical Analysis (Tokenization)

- Breaks source code into tokens
- Removes whitespace and comments
- Identifies keywords, identifiers, operators, literals

### Syntax Analysis (Parsing)

- Builds abstract syntax tree (AST)
- Checks grammatical structure
- Uses context-free grammars
- Common parsing techniques: recursive descent, LR, LALR

### Semantic Analysis

- Type checking and inference
- Symbol table management
- Scope resolution
- Declaration and usage validation

### Code Generation

- Intermediate representation (IR)
- Target machine code generation
- Register allocation
- Instruction selection

### Optimization

- Constant folding and propagation
- Dead code elimination
- Loop optimization
- Inlining and vectorization

## Programming Language Paradigms

### Imperative Programming

- Sequential execution
- Mutable state
- Examples: C, Java, Python

### Functional Programming

- Functions as first-class citizens
- Immutable data structures
- Higher-order functions
- Examples: Haskell, Lisp, ML

### Object-Oriented Programming

- Encapsulation and inheritance
- Polymorphism
- Message passing
- Examples: Java, C++, Smalltalk

### Logic Programming

- Declarative approach
- Rule-based systems
- Backtracking search
- Examples: Prolog, Datalog

## Type Systems

### Static vs Dynamic Typing

- **Static**: Types checked at compile time
- **Dynamic**: Types checked at runtime
- Trade-offs in safety vs flexibility

### Strong vs Weak Typing

- **Strong**: Strict type enforcement
- **Weak**: Implicit type conversions
- Impact on program correctness

### Type Inference

- Automatic type deduction
- Hindley-Milner algorithm
- Benefits for programmer productivity

## Runtime Systems

### Memory Management

- Stack vs heap allocation
- Garbage collection strategies
- Reference counting

### Exception Handling

- Structured exception handling
- Stack unwinding
- Error propagation

### Concurrency Support

- Threading models
- Synchronization primitives
- Actor model implementations

## Domain-Specific Languages (DSLs)

### Internal DSLs

- Embedded in host language
- Fluent interfaces
- Method chaining

### External DSLs

- Standalone syntax
- Custom parsers
- Specialized tooling

### Examples

- SQL for databases
- HTML/CSS for web
- Regex for pattern matching
- Make for build systems

## Language Implementation Techniques

### Interpreters

- Direct execution of source code
- Faster development cycle
- Runtime flexibility

### Compilers

- Ahead-of-time compilation
- Better runtime performance
- Static analysis opportunities

### Just-In-Time (JIT) Compilation

- Runtime compilation
- Dynamic optimization
- Examples: JVM, .NET CLR

### Transpilation

- Source-to-source translation
- Language interoperability
- Examples: TypeScript to JavaScript

## Modern Compiler Technologies

### LLVM

- Modular compiler infrastructure
- Intermediate representation
- Multiple frontend/backend support

### WebAssembly

- Portable compilation target
- Near-native performance in browsers
- Language agnostic

### Profile-Guided Optimization (PGO)

- Runtime profiling information
- Optimized hot paths
- Feedback-driven compilation

## Language Design Principles

### Orthogonality

- Independent language features
- Minimal special cases
- Consistent behavior

### Simplicity

- Easy to learn and use
- Minimal syntax overhead
- Clear semantics

### Expressiveness

- Natural problem representation
- High-level abstractions
- Domain-specific constructs

### Performance

- Efficient compilation
- Runtime optimization
- Resource management

## Interview Topics

### Common Questions

- Explain the compilation process phases
- Compare interpreters vs compilers
- Describe type system trade-offs
- Discuss memory management strategies

### Implementation Challenges

- Recursive descent parsing
- Symbol table design
- Code generation for expressions
- Register allocation algorithms

### Language Comparison

- C vs C++ vs Rust
- Java vs C# vs Kotlin
- Python vs Ruby vs JavaScript
- Haskell vs ML vs F#

## Best Practices

### Compiler Design

- Separate concerns clearly
- Use well-defined interfaces
- Implement incremental compilation
- Provide good error messages

### Language Design

- Consistency in syntax and semantics
- Backward compatibility considerations
- Standard library design
- Community and ecosystem

### Performance Optimization

- Profile before optimizing
- Understand target architecture
- Consider memory hierarchy
- Minimize allocations
