# Java Annotations Interview Questions & Answers

### What are annotations? What are their typical use cases?

Annotations are metadata attached to program elements without affecting the program’s logic.

Typical use cases:

- **Information for the compiler** – e.g., detecting errors or suppressing warnings
- **Compile-time and deployment-time processing** – tools can process annotations to generate code or configuration
- **Runtime processing** – annotations can be examined at runtime to alter program behavior

### Describe some useful annotations from the standard library.

- `@Override` – indicates that a method overrides a superclass method
- `@Deprecated` – marks elements as obsolete
- `@SuppressWarnings` – suppresses specific compiler warnings
- `@FunctionalInterface` – denotes a functional interface (Java 8+)

### How can you create an annotation?

Annotations are defined similarly to interfaces using the `@interface` keyword:

```java
public @interface SimpleAnnotation {
    String value();
    int[] types();
}
```

They can also include default values:

```java
public @interface SimpleAnnotation {
    String value() default "This is an element";
    int[] types() default {1, 2, 3};
}
```

### What object types can be returned from an annotation method declaration?

Allowed return types:

- Primitive types
- `String`
- `Class`
- `Enum`
- Arrays of the above types

Example:

```java
enum Complexity { LOW, HIGH }

public @interface ComplexAnnotation {
    Class<?> value();
    int[] types();
    Complexity complexity();
}
```

### Which program elements can be annotated?

Annotations can be applied to:

- Classes, constructors, methods, fields, parameters
- Local variables, loop variables, resource variables
- Other annotations
- Packages
- Type uses (Java 8+)

Example:

```java
@SimpleAnnotation
public class MyClass { }
```

### Is there a way to limit where an annotation can be applied?

Yes, using `@Target`. Example:

```java
@Target(ElementType.FIELD)
public @interface SimpleAnnotation { }
```

Multiple targets can be specified:

```java
@Target({ ElementType.FIELD, ElementType.METHOD })
```

### What are meta-annotations?

Annotations applied to other annotations. Example:

```java
@Target(ElementType.ANNOTATION_TYPE)
public @interface SimpleAnnotation { }
```

### What are repeating annotations?

Annotations that can be applied multiple times to the same element.

Define the repeatable annotation:

```java
@Repeatable(Schedules.class)
public @interface Schedule {
    String time() default "morning";
}
```

Define the container:

```java
public @interface Schedules {
    Schedule[] value();
}
```

Usage:

```java
@Schedule
@Schedule(time = "afternoon")
void scheduledMethod() { }
```

### How can you retrieve annotations? How does this relate to its retention policy?

Annotations can be retrieved using Reflection or annotation processors. Retention policies determine availability:

- `SOURCE` – discarded by the compiler
- `CLASS` – kept in the class file, not available at runtime
- `RUNTIME` – available through reflection at runtime

Example:

```java
@Retention(RetentionPolicy.RUNTIME)
public @interface Description {
    String value();
}
```

Retrieval:

```java
Description desc = MyClass.class.getAnnotation(Description.class);
System.out.println(desc.value());
```

### Will the following code compile?

```java
@Target({ ElementType.FIELD, ElementType.TYPE, ElementType.FIELD })
public @interface TestAnnotation {
    int[] value() default {};
}
```

No. The `@Target` annotation lists `ElementType.FIELD` twice, which causes a compile-time error. Remove duplicates to fix.

### Is it possible to extend annotations?

No. Annotations implicitly extend `java.lang.annotation.Annotation`. Trying to extend another annotation leads to a compilation error.

```java
public @interface MyAnnotation extends OtherAnnotation { } // Error
```
