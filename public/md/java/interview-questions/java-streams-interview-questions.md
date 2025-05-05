# Java Streams Interview Questions

### What is a Stream? How does it differ from a Collection?

A Stream is a sequence of objects that supports aggregate operations. Unlike collections, where iteration logic is explicit, Streams use declarative operations such as `map` and `flatMap`. Streams are lazily evaluated, support fluent method chaining (pipelining), and can be parallelized easily.

Example:

```java
int sum = Arrays.stream(new int[]{1, 2, 3})
  .filter(i -> i >= 2)
  .map(i -> i * 3)
  .sum();
```

### What is the difference between Intermediate and Terminal operations?

- **Intermediate operations:** Return a new Stream and are lazy (`filter`, `map`, `flatMap`).
- **Terminal operations:** Trigger processing and produce a result or side-effect (`forEach`, `collect`, `reduce`, `sum`).

```java
// Terminal operation triggers processing:
Arrays.stream(new int[] { 1, 2, 3 })
    .map(i -> i * 2)
    .sum();
```

### What is the difference between `map` and `flatMap`?

- `map` applies a function and wraps the result (e.g., returns Stream\<Stream<T>> when applied to nested structures).
- `flatMap` flattens the result, returning a single stream with the transformed values.

```java
Map<String, List<String>> people = new HashMap<>();
List<String> phones = people.values().stream()
  .flatMap(Collection::stream)
  .collect(Collectors.toList());
```

### What is Stream Pipelining?

Stream pipelining refers to chaining multiple intermediate operations followed by a terminal operation. This allows data processing in stages and enables optimizations like lazy evaluation and parallelization.

### What does `map()` do and why use it?

`map()` transforms each element of a stream by applying a function. It's used to convert elements from one type to another or to modify values.

Example: Converting a List<String> to List<Integer>:

```java
List<Integer> numbers = strings.stream()
    .map(Integer::parseInt)
    .collect(Collectors.toList());
```

### What does `filter()` do and when to use it?

`filter()` selects elements that satisfy a given predicate. Use it to exclude unwanted data.

Example:

```java
List<Integer> evens = numbers.stream()
    .filter(n -> n % 2 == 0)
    .collect(Collectors.toList());
```

### What does `flatMap()` do and why use it?

`flatMap()` both transforms and flattens elements. It's especially useful when working with nested collections.

### What does `peek()` do? When to use it?

`peek()` lets you inspect each element as it flows through the pipeline. It's typically used for debugging.

### What does it mean when we say Streams are lazy?

Streams do not process data until a terminal operation is invoked. Intermediate operations build a processing pipeline but don't execute until necessary.

### What is a Functional Interface in Java 8?

An interface with exactly one abstract method, used as the target for lambda expressions. Examples: `Runnable`, `Callable`, `Comparator`, `Predicate`, `Supplier`, `Consumer`.

```java
@FunctionalInterface
interface MyFunction {
    void apply();
}
```

### Difference between a normal and functional interface?

A normal interface can have multiple abstract methods. A functional interface can only have one abstract method, allowing it to represent a single function and be used with lambdas.

### What is the difference between `findFirst()` and `findAny()`?

- `findFirst()`: Returns the first matching element.
- `findAny()`: Returns any matching element, optimized for parallel streams.

### What is the `Predicate` interface?

A functional interface that takes an object and returns a boolean, often used with `filter()`.

```java
Predicate<String> startsWithA = s -> s.startsWith("A");
```

### What are the `Supplier` and `Consumer` functional interfaces?

- **Supplier:** Provides objects without taking any input.
- **Consumer:** Takes an input and performs an action without returning a result.

### Can you convert an array to a Stream?

Yes. Example:

```java
String[] languages = {"Java", "Python"};
Stream<String> stream = Stream.of(languages);
```

### What is a parallel Stream? How to get one?

A parallel Stream divides tasks across multiple threads:

```java
List<String> list = Arrays.asList("a", "b", "c");
Stream<String> parallelStream = list.parallelStream();
```

### Difference between Streams and loops

- **Streams:** Declarative, concise, can express complex operations, encourage immutability, easier to parallelize.
- **Loops:** Imperative, familiar, explicit control, more efficient in certain simple cases.

### How to implement a `Stream<T>`?

Usually, use `Stream.builder()` or `StreamSupport.stream()`. Creating a custom Stream implementation is complex and generally unnecessary.

### What is the design pattern behind Streams? What advantage do they offer over loops?

Streams use the **Pipeline** pattern and promote **functional programming** concepts. Unlike loops, Streams:

- Promote a declarative style.
- Allow lazy and parallel evaluation.
- Enable fluent chaining of operations.
- Reduce mutability and improve readability.
