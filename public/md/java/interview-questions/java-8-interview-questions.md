# Java 8 Interview Questions & Answers

### 1. What new features were added in Java 8?

Key features include:

- **Lambda Expressions** – treat actions as objects.
- **Method References** – shorthand for lambdas referring to methods.
- **Optional** – container for potentially absent values.
- **Functional Interfaces** – interfaces with a single abstract method.
- **Default Methods** – method implementations in interfaces.
- **Nashorn** – JavaScript engine.
- **Stream API** – functional-style processing of collections.
- **New Date/Time API** – immutable, thread-safe date/time classes.

### 2. What is a method reference?

A shorthand notation for lambdas referring to existing methods using `::`.
Example:

```java
(o) -> o.toString();   // lambda
Object::toString;      // method reference
```

Types include:

- Constructor reference: `String::new`
- Static method: `String::valueOf`
- Bound instance: `str::toString`
- Unbound instance: `String::toString`

### 3. What does `String::valueOf` mean?

It’s a static method reference pointing to `String.valueOf()`.

### 4. What is _Optional_ and how is it used?

`Optional` is a container for values that may or may not be present.
Instead of returning `null`, methods can return `Optional.empty()` to avoid `NullPointerException`.
Example:

```java
Optional<String> name = Optional.ofNullable(getName());
String result = name.orElse("default");
```

### 5. What are some functional interfaces in the Java standard library?

Located in `java.util.function`:

- `Function<T, R>` – takes T, returns R.
- `Consumer<T>` – takes T, returns nothing.
- `Supplier<T>` – returns T, no input.
- `Predicate<T>` – takes T, returns boolean.
- `BiFunction<T, U, R>` – takes T & U, returns R.
- `UnaryOperator<T>` / `BinaryOperator<T>` – special cases of `Function`/`BiFunction` for same-type arguments and results.

### 6. What is a functional interface?

An interface with **one abstract method**.
Lambda expressions and method references can implement them directly.
The `@FunctionalInterface` annotation signals intent but isn’t mandatory.

Example:

```java
@FunctionalInterface
public interface Converter<F, T> {
    T convert(F from);
}
```

### 7. What are default methods and when are they used?

**Default methods** allow interfaces to provide implementations without affecting existing classes.

Example:

```java
interface Vehicle {
    void move();
    default void honk() { System.out.println("peep!"); }
}
```

Used to evolve interfaces without breaking backward compatibility.

### 8. Will the following code compile?

```java
@FunctionalInterface
public interface Function2<T,U,V> {
    V apply(T t, U u);
    default void count() { }
}
```

**Yes**. It defines one abstract method and a default method, adhering to functional interface rules.

### 9. What is a lambda expression and what is it used for?

A **lambda expression** is a concise way to represent an anonymous function that can be passed around as an object.

Example:

```java
(a, b) -> a + b
```

Used to implement functional interfaces, enabling cleaner and more functional code patterns.

### 10. Explain the syntax and characteristics of a lambda expression.

Syntax:

```java
(parameters) -> expression or { statements }
```

Characteristics:

- Type inference possible.
- Parentheses optional for single parameter.
- Curly braces optional for single statement.
- Return keyword optional for single expression.

Example:

```java
x -> x * x
```

### 11. What is Nashorn?

A **JavaScript engine** introduced in Java 8, replacing Rhino, offering better performance and ECMA compliance.

### 12. What is JJS?

`jjs` is the **command-line tool** provided in Java 8 to execute JavaScript code using the Nashorn engine.

### 13. What improvements were made in the Java 8 Date and Time API?

The `java.time` package introduced:

- Immutable, thread-safe classes.
- Intuitive and consistent APIs.
- Inspired by Joda-Time.
- Fixes issues in `java.util.Date` and `SimpleDateFormat` (e.g., thread safety, confusing indexing).

Example:

```java
LocalDate today = LocalDate.now();
```
