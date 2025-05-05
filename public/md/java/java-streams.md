# Java Streams

The **Streams API** (Java 8+) provides a functional-style abstraction for processing sequences of data.

```java
List<String> names = List.of("Alice", "Bob", "Charlie");
names.stream().filter(n -> n.startsWith("A")).forEach(System.out::println);
```

## Key Characteristics

- **Declarative**: Focus on _what_ to do, not _how_ to do it.
- **Lazy evaluation**: Operations are evaluated only when necessary.
- **Can be parallelized**: Simple switch from `.stream()` to `.parallelStream()`.

## Stream Creation

```java
Stream<String> empty = Stream.empty();
Stream<String> of = Stream.of("one", "two", "three");
List<Integer> list = List.of(1, 2, 3);
Stream<Integer> fromList = list.stream();
```

## Common Intermediate Operations

| Method              | Description                             |
| ------------------- | --------------------------------------- |
| `filter(Predicate)` | Selects elements that match a condition |
| `map(Function)`     | Transforms each element                 |
| `flatMap(Function)` | Flattens nested structures              |
| `distinct()`        | Removes duplicates                      |
| `sorted()`          | Sorts elements                          |
| `peek(Consumer)`    | Performs an action for debugging        |

**Example**:

```java
List<String> result = list.stream()
    .filter(s -> s.startsWith("A"))
    .map(String::toUpperCase)
    .sorted()
    .collect(Collectors.toList());
```

## Common Terminal Operations

| Method                   | Description                               |
| ------------------------ | ----------------------------------------- |
| `collect(Collector)`     | Accumulates results into a collection     |
| `forEach(Consumer)`      | Performs an action for each element       |
| `count()`                | Counts the elements                       |
| `reduce(BinaryOperator)` | Reduces the stream to a single value      |
| `anyMatch(Predicate)`    | Checks if any element matches a condition |
| `allMatch(Predicate)`    | Checks if all elements match              |
| `noneMatch(Predicate)`   | Checks if no element matches              |
| `findFirst()`            | Retrieves the first element               |
| `findAny()`              | Retrieves any element                     |

**Example**:

```java
long count = list.stream()
    .filter(s -> s.length() > 3)
    .count();
```

## Collectors

| Collector                       | Purpose                         |
| ------------------------------- | ------------------------------- |
| `toList()`                      | Collects to a `List`            |
| `toSet()`                       | Collects to a `Set`             |
| `toMap(keyMapper, valueMapper)` | Collects to a `Map`             |
| `joining()`                     | Concatenates strings            |
| `groupingBy(Function)`          | Groups elements by a classifier |
| `partitioningBy(Predicate)`     | Partitions into two groups      |

**Example**:

```java
String result = list.stream()
    .collect(Collectors.joining(", "));
```

## Primitive Streams

For efficiency, Java provides primitive stream types:

```java
IntStream.range(1, 5).forEach(System.out::println); // Outputs 1 2 3 4
```

| Stream         | Purpose            |
| -------------- | ------------------ |
| `IntStream`    | Stream of `int`    |
| `LongStream`   | Stream of `long`   |
| `DoubleStream` | Stream of `double` |

## Parallel Streams

```java
list.parallelStream().forEach(System.out::println);
```

**Warning**: Use parallel streams cautiously — benefits depend on data size and environment.

## Lazy Evaluation Example

```java
Stream<String> stream = Stream.of("one", "two", "three")
    .filter(s -> {
        System.out.println("Filtering: " + s);
        return s.length() > 3;
    });
// No output yet!
stream.forEach(System.out::println); // Triggers filtering
```

## Best Practices

- Prefer **streams** for transformations and aggregations.
- Avoid using streams for **side effects** — use `forEach()` sparingly.
- Remember that **streams can be consumed only once**.
- Consider **collecting results** rather than mutating external data structures.
