# Design Patterns

Design Patterns are proven solutions to common software design problems. They help create flexible, reusable, and maintainable code by offering templates for solving recurring design challenges.

**Useful Resources**  
[Refactoring Guru](https://refactoring.guru/design-patterns)

## SOLID Principles

1. **Single Responsibility Principle (SRP)** – A class should have only one reason to change.
2. **Open/Closed Principle (OCP)** – Classes should be open for extension but closed for modification.
3. **Liskov Substitution Principle (LSP)** – Subtypes must be substitutable for their base types.
4. **Interface Segregation Principle (ISP)** – Prefer small, client-specific interfaces over large general-purpose ones.
5. **Dependency Inversion Principle (DIP)** – High-level modules should not depend on low-level modules; both should depend on abstractions.

## Creational Design Patterns

### Singleton

Ensures a class has only one instance and provides a global access point.

```java
public class Singleton {
private static Singleton instance;
private Singleton() {}
public static Singleton getInstance() {
if (instance == null) {
instance = new Singleton();
}
return instance;
}
}
```

_Used for:_ Configuration settings, logging, caches.

### Builder

Separates the construction of a complex object from its representation.

_Used for:_ When an object requires numerous parameters or complex setup.

### Factory Method

Defines an interface for creating an object but lets subclasses decide which class to instantiate.

```java
public class CardGame {
public static CardGame createCardGame(GameType type) {
if (type == GameType.Poker) {
return new PokerGame();
} else if (type == GameType.BlackJack) {
return new BlackJackGame();
}
return null;
}
}
```

### Abstract Factory

An abstraction over multiple factories, useful when your system needs to support multiple families of related objects.

_Example:_ UI toolkit that supports multiple operating systems.

### Prototype

Creates new objects by cloning existing ones rather than creating from scratch.

## Structural Design Patterns

### Facade

Provides a simplified interface to a complex subsystem.

_Example:_ A hotel booking facade that hides the complexity of multiple APIs.

### Proxy

Creates a surrogate or placeholder to control access to another object.

_Example:_ Virtual proxy for lazy-loading heavy resources.

### Composite

Treats individual objects and compositions of objects uniformly.

_Example:_ File system hierarchies (folders and files).

## Behavioral Design Patterns

### Template Method

Defines the skeleton of an algorithm, deferring some steps to subclasses.

### Chain of Responsibility

Passes a request along a chain of handlers.

_Example:_ Event handling systems, logging frameworks.

### Command

Encapsulates a request as an object, allowing you to parameterize clients with requests and support undo/redo.

### Strategy

Defines a family of interchangeable algorithms and makes them interchangeable at runtime.

_Example:_ Different sorting algorithms or payment methods.

### Mediator

Encapsulates how a set of objects interact to promote loose coupling.

## Other Common Patterns

### Observer

Defines a dependency between objects so that when one changes, all its dependents are notified.

_Example:_ Event listeners.

### Decorator

Adds new responsibilities to an object dynamically.

### Adapter

Converts the interface of a class into another interface clients expect.

_Example:_ Power plug adapters.

### State

Allows an object to alter its behavior when its internal state changes.

### Memento

Captures and restores an object's internal state without violating encapsulation (useful for undo mechanisms).

## Design Pattern Categories

| Creational       | Structural | Behavioral               |
| ---------------- | ---------- | ------------------------ |
| Singleton        | Facade     | Template Method          |
| Factory Method   | Proxy      | Chain of Responsibility  |
| Abstract Factory | Composite  | Command                  |
| Builder          | Decorator  | Strategy                 |
| Prototype        | Adapter    | Mediator                 |
|                  | Bridge     | Observer, State, Memento |

## Notes

- Always prefer **composition over inheritance** when using design patterns.
- Patterns should solve problems, not add unnecessary complexity. Use them when a genuine need arises.
- Many patterns work well together (e.g., Factory + Strategy, Composite + Iterator).
