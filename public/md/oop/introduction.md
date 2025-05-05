# Object-Oriented Programming (OOP)

## What is OOP?

Object-Oriented Programming (OOP) is a programming paradigm based on **objects** and **classes**, modeling real-world entities. It emphasizes grouping data and behavior together, allowing modular, reusable, and maintainable code.

Java is a fully object-oriented language where everything except primitives is an object.

## Why OOP?

- Simplifies complex software design
- Encourages **code reuse** through inheritance
- Promotes **encapsulation** for data protection
- Enables **polymorphism** for flexibility
- Makes maintenance and testing easier
- Allows abstraction to hide internal details

## Four Pillars of OOP

| Concept           | Description                                                                                                                 |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Encapsulation** | Bundles data (fields) and behavior (methods) and restricts direct access. Use `private` fields and `public` getters/setters |
| **Abstraction**   | Hides complex implementation details and exposes only essential features via abstract classes or interfaces                 |
| **Inheritance**   | Enables a new class to acquire properties and behavior of an existing class. Promotes code reuse                            |
| **Polymorphism**  | Allows objects to be treated as instances of their parent class, enabling dynamic behavior                                  |

## Important Concepts

### Class

A blueprint/template defining data (fields) and behavior (methods)

### Object

An instance of a class that holds state and behavior

### Method Overloading

Defining multiple methods in the same class with the same name but different parameters (compile-time polymorphism)

### Method Overriding

Providing a new implementation of an inherited method in a subclass (runtime polymorphism)

### Constructor

A special method used to initialize new objects. It has the same name as the class and no return type

### Abstract Class

Cannot be instantiated. Can have both abstract (no implementation) and concrete methods. Supports partial abstraction

### Interface

A contract specifying methods that implementing classes must provide. Supports multiple inheritance

### Access Modifiers

| Modifier    | Scope                                         |
| ----------- | --------------------------------------------- |
| `private`   | Accessible within the same class only         |
| `default`   | Accessible within the same package            |
| `protected` | Accessible in the same package and subclasses |
| `public`    | Accessible from any other class               |

### `this` keyword

Refers to the current object of the class

### `super` keyword

Refers to the superclass and allows access to parent methods/constructors

## Key Java OOP Features

- **Final** classes and methods prevent inheritance and overriding
- **Static** methods belong to the class, not instances
- **Dynamic Binding** (Late Binding) resolves overridden methods at runtime
- **Encapsulation** enables hiding data and controlling access via getters/setters
- **Abstraction** allows focusing on essential operations without worrying about the details
- **Inheritance** promotes code reuse and logical hierarchy
- **Polymorphism** increases flexibility and maintainability

## Common Relationships

- **Association**: General relationship (e.g., Teacher - Student)
- **Aggregation**: "Has-a" relationship where child can exist independently (e.g., Department - Teacher)
- **Composition**: Strong "Has-a" relationship where child cannot exist without the parent (e.g., House - Rooms)

## Java OOP Best Practices

- Prefer **interfaces** when possible
- Use **composition** over inheritance where appropriate
- Keep classes **cohesive** and focused
- Follow the **SOLID principles** for clean OOP design

## Real-world Example

```java
class Animal {
    void sound() {
        System.out.println("Animal makes a sound");
    }
}

class Dog extends Animal {
    @Override
    void sound() {
        System.out.println("Dog barks");
    }
}

public class TestOOP {
    public static void main(String[] args) {
        Animal myDog = new Dog();
        myDog.sound();  // Output: Dog barks
    }
}
```

## Summary

OOP is the foundation of modern Java development. Understanding its core principles and best practices is essential for building scalable, reusable, and maintainable applications.
