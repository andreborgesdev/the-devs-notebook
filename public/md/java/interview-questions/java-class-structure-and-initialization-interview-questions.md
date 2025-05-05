# Java Class Structure and Initialization Interview Questions & Answers

### Describe the meaning of the final keyword when applied to a class, method, field, or a local variable.

- A **final class** cannot be subclassed.
- A **final method** cannot be overridden.
- A **final field** must be initialized once and cannot be modified afterward.
- A **final variable** can only be assigned once.

### What is a default method?

Starting with Java 8, interfaces can have methods with default implementations using the `default` keyword. Default methods allow interface evolution without breaking existing implementations.

Example:

```java
public interface Iterable<T> {
    Iterator<T> iterator();
    default void forEach(Consumer<? super T> action) { /* implementation */ }
}
```

### What are static class members?

Static fields and methods belong to the class itself, not to instances. They are resolved at compile time and do not depend on object instances.

### May a class be declared abstract without abstract members? What could be the purpose?

Yes. An abstract class without abstract members cannot be instantiated but can provide shared implementation and serve as a base class in a hierarchy.

### What is constructor chaining?

Constructor chaining allows one constructor to call another, reducing duplication.

Example:

```java
public Discount() { this(10); }
public Discount(int percent) { this(percent, 2); }
```

### What is overriding and overloading of methods? How are they different?

- **Overriding**: A subclass provides a new implementation of a method defined in a superclass.
- **Overloading**: Methods with the same name but different parameters exist in the same class.

### Can you override a static method?

No. Static methods are resolved at compile time and cannot be overridden, though a subclass can declare a new static method with the same signature (this is called hiding, not overriding).

### What is an immutable class, and how can you create one?

An immutable class cannot change state after creation. To create one:

- Declare fields as `private` and `final`.
- Initialize all fields in the constructor.
- Do not provide setters.
- Make the class `final` or all methods `final` to prevent subclassing.

### How do you compare two enum values: with equals() or ==?

Both work. Since enums are singleton instances, `==` is usually preferred for simplicity and performance.

### What is an initializer block? What is a static initializer block?

- **Initializer block**: Runs common code for all constructors.
- **Static initializer block**: Runs once when the class is loaded, used to initialize static fields.

### What is a marker interface? What are notable examples?

A marker interface has no methods but conveys metadata about a class.
Examples: `Serializable`, `Cloneable`, and `Remote`.

### What is a singleton and how can it be implemented in Java?

A singleton ensures only one instance exists.

Example:

```java
public class Singleton {
    private static Singleton instance = new Singleton();
    private Singleton() {}
    public static Singleton getInstance() { return instance; }
}
```

For lazy initialization with thread safety, use **double-checked locking** or an **enum singleton**.

### What is a var-arg? What are its restrictions? How is it used?

A var-arg lets a method accept an arbitrary number of arguments.
Restrictions:

- Only one var-arg parameter per method.
- Must be the last parameter.

Example:

```java
public static <T> boolean addAll(Collection<? super T> c, T... elements) { ... }
```

### Can you access an overridden method of a superclass? Can you access an overridden method of a super-superclass similarly?

Yes, you can access a superclass method using `super.methodName()`. However, there’s no direct syntax to call a method overridden two or more levels up the hierarchy.

Example:

```java
public void clear() {
    super.clear();
}
```
