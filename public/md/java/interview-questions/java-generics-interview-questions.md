# Java Generics Interview Questions & Answers

### What is a generic type parameter?

A **generic type parameter** allows a type to be specified as a parameter in a class, method, or interface declaration. Example:

```java
public interface Consumer<T> {
    void consume(T parameter);
}
```

### What are the advantages of using generic types?

- **Type safety**: Avoids `ClassCastException` by enforcing compile-time type checking.
- **Eliminates casting**: No need to cast returned objects.
- **Code reuse**: Write algorithms that work for different types without duplication.

### What is type erasure?

**Type erasure** means generic type information is removed during compilation to maintain backward compatibility with older Java versions. The JVM does not retain generic type information at runtime.

### Can a generic type be omitted when instantiating an object?

Yes, but it results in a raw type and typically generates compiler warnings. Omitting generic types is discouraged.

### How does a generic method differ from a generic type?

A **generic method** introduces a type parameter specific to the method:

```java
public static <T> T returnType(T argument) {
    return argument;
}
```

### What is type inference?

The compiler determines the generic type based on method arguments:

```java
Integer i = returnType(5);
```

### What is a bounded type parameter?

Restricts the types that can be used as generic arguments:

```java
public class Cage<T extends Animal> {
    void addAnimal(T animal) {}
}
```

### Can you declare multiple bounded type parameters?

Yes. If one bound is a class, it must be the first:

```java
public class Cage<T extends Animal & Comparable<T>> {}
```

### What is a wildcard type?

A **wildcard type** represents an unknown type and is denoted by `?`:

```java
List<?> list = new ArrayList<String>();
```

### What is an upper bounded wildcard?

Specifies that the wildcard extends a certain type:

```java
List<? extends Animal> animals;
```

Allows passing a list of `Animal` or its subclasses.

### What is an unbounded wildcard?

A wildcard with no bounds:

```java
List<?> list;
```

Represents any type.

### What is a lower bounded wildcard?

Specifies that the wildcard is a superclass of a type:

```java
List<? super Animal> list;
```

Allows adding instances of `Animal` or its subclasses.

### When to use upper vs lower bounded types (PECS principle)?

- **Producer Extends**: Use `? extends T` when a structure produces values.
- **Consumer Super**: Use `? super T` when a structure consumes values.

### Are there situations where generic type information is available at runtime?

Yes, when a generic type appears in a class signature. Reflection can retrieve it:

```java
(Class<T>) ((ParameterizedType) getClass()
    .getGenericSuperclass()).getActualTypeArguments()[0];
```

### Summary

Generics provide:

- Compile-time type safety
- Code reuse
- Cleaner APIs

Understanding wildcards, bounds, type erasure, and the PECS principle is crucial for advanced generic programming.
