# Type System

## Describe the Place of the Object Class in the Type Hierarchy. Which Types Inherit from Object, and Which Don’t? Do Arrays Inherit from Object? Can a Lambda Expression Be Assigned to an Object Variable?

The `java.lang.Object` is at the top of the class hierarchy in Java. All classes inherit from it, either explicitly, implicitly (when the `extends` keyword is omitted), or transitively via the chain of inheritance.

However, there are eight primitive types that do not inherit from `Object`: `boolean`, `byte`, `short`, `char`, `int`, `float`, `long`, and `double`.

Arrays are objects too. They can be assigned to an `Object` reference, and all `Object` methods may be called on them.

Lambda expressions can't be assigned directly to an `Object` variable because `Object` is not a functional interface. However, a lambda can be assigned to a functional interface variable, which can then be assigned to an `Object` variable.

## Explain the Difference Between Primitive and Reference Types.

Reference types inherit from `java.lang.Object` and can themselves be inherited (except for `final` classes). Primitive types do not inherit and cannot be subclassed.

Primitive arguments are always passed by value. Changes made to a primitive argument inside a method do not affect the original value.

Primitive types are typically stored directly in memory cells, while reference types include an object header, which adds overhead. This is why primitive types exist—to save memory space.

## Describe the Different Primitive Types and the Amount of Memory They Occupy.

- `boolean`: Size is JVM-dependent.
- `byte`: 8-bit signed value.
- `short`: 16-bit signed value.
- `char`: 16-bit unsigned value.
- `int`: 32-bit signed value.
- `long`: 64-bit signed value.
- `float`: 32-bit floating point.
- `double`: 64-bit floating point.

## What Is the Difference Between an Abstract Class and an Interface? What Are the Use Cases of One and the Other?

An abstract class (`abstract` modifier) can't be instantiated but can be subclassed. Interfaces (declared with `interface`) cannot be instantiated but can be implemented.

- A class can implement multiple interfaces but can extend only one abstract class.
- Abstract classes often serve as base types in hierarchies and can provide default method implementations.
- Interfaces define contracts a class agrees to fulfill and allow mixing multiple functionalities.

## What Are the Restrictions on the Members (Fields and Methods) of an Interface Type?

- Fields are implicitly `public static final`.
- Methods are implicitly `public`. They can be `abstract` or `default`.
- Instance fields are not allowed.

## What Is the Difference Between an Inner Class and a Static Nested Class?

- **Inner class:** Requires an instance of the enclosing class to be instantiated. It can access the outer class instance.
- **Static nested class:** Does not require an instance of the enclosing class and behaves like a top-level class nested inside another class.

## Does Java Have Multiple Inheritance?

Java does not support multiple inheritance for classes (a class can only extend one superclass). However, a class can implement multiple interfaces.

## What Are the Wrapper Classes? What Is Autoboxing?

Each primitive type has a wrapper class: `Boolean`, `Byte`, `Short`, `Character`, `Integer`, `Float`, `Long`, and `Double`.

Autoboxing is the automatic conversion between primitives and their corresponding wrapper classes by the compiler.

## Describe the Difference Between equals() and ==

- `==` compares object references (memory addresses) or primitive values.
- `equals()` compares object values. It is defined in `Object` and often overridden for custom comparisons (e.g., `String.equals`).

## Suppose You Have a Variable That References an Instance of a Class Type. How Do You Check That an Object Is an Instance of This Class?

Use the `Class.isInstance()` method:

```java
Class<?> clazz = Integer.class;
boolean result = clazz.isInstance(new Integer(5));
```

## What Is an Anonymous Class? Describe Its Use Case.

An anonymous class is a one-shot class defined and instantiated simultaneously without a name.

**Use case:** Before Java 8, commonly used for implementing single-method interfaces like `Runnable`. Still useful for creating instances with multiple method implementations or slight modifications of existing classes.

Example:

```java
Map<String, Integer> ages = new HashMap<String, Integer>() {{
    put("David", 30);
    put("John", 25);
    put("Mary", 29);
    put("Sophie", 22);
}};
```
