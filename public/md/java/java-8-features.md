# Java 8+ Features - Complete Guide

## Lambda Expressions

### Syntax

```java
// Traditional anonymous class
Runnable r1 = new Runnable() {
    @Override
    public void run() {
        System.out.println("Hello World");
    }
};

// Lambda expression
Runnable r2 = () -> System.out.println("Hello World");

// With parameters
(int a, int b) -> a + b
(a, b) -> a + b  // Type inference
a -> a * 2       // Single parameter
() -> 42         // No parameters
```

### Functional Interfaces

```java
@FunctionalInterface
public interface Calculator {
    int calculate(int x, int y);
}

Calculator add = (x, y) -> x + y;
Calculator multiply = (x, y) -> x * y;

// Built-in functional interfaces
Predicate<String> isEmpty = String::isEmpty;
Function<String, Integer> length = String::length;
Consumer<String> printer = System.out::println;
Supplier<String> supplier = () -> "Hello";
```

### Method References

```java
// Static method reference
Function<String, Integer> parseInt = Integer::parseInt;

// Instance method reference
String str = "hello";
Supplier<String> upper = str::toUpperCase;

// Constructor reference
Supplier<List<String>> listSupplier = ArrayList::new;
Function<String, Integer> constructor = Integer::new;

// Instance method of arbitrary object
List<String> names = Arrays.asList("John", "Jane");
names.sort(String::compareToIgnoreCase);
```

## Stream API

### Stream Creation

```java
// From collections
List<String> list = Arrays.asList("a", "b", "c");
Stream<String> stream = list.stream();

// From arrays
Stream<String> streamFromArray = Arrays.stream(new String[]{"a", "b", "c"});

// Stream.of()
Stream<String> streamOf = Stream.of("a", "b", "c");

// Generate streams
Stream<Integer> infiniteStream = Stream.generate(() -> (int)(Math.random() * 100));
Stream<Integer> limitedStream = Stream.iterate(0, n -> n + 2).limit(10);

// Primitive streams
IntStream intStream = IntStream.range(1, 100);
DoubleStream doubleStream = DoubleStream.of(1.0, 2.0, 3.0);
```

### Intermediate Operations

```java
List<String> names = Arrays.asList("John", "Jane", "Jack", "Jill", "James");

// Filter
names.stream()
    .filter(name -> name.startsWith("J"))
    .collect(Collectors.toList());

// Map
names.stream()
    .map(String::toUpperCase)
    .map(String::length)
    .collect(Collectors.toList());

// FlatMap
List<List<String>> listOfLists = Arrays.asList(
    Arrays.asList("a", "b"),
    Arrays.asList("c", "d")
);
listOfLists.stream()
    .flatMap(Collection::stream)
    .collect(Collectors.toList()); // [a, b, c, d]

// Distinct
Stream.of(1, 2, 2, 3, 3, 3)
    .distinct()
    .collect(Collectors.toList()); // [1, 2, 3]

// Sorted
names.stream()
    .sorted()
    .sorted(Comparator.reverseOrder())
    .collect(Collectors.toList());

// Peek (for debugging)
names.stream()
    .peek(System.out::println)
    .map(String::toUpperCase)
    .collect(Collectors.toList());

// Skip and Limit
names.stream()
    .skip(2)
    .limit(3)
    .collect(Collectors.toList());
```

### Terminal Operations

```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

// Collect
List<Integer> evenNumbers = numbers.stream()
    .filter(n -> n % 2 == 0)
    .collect(Collectors.toList());

// Reduce
Optional<Integer> sum = numbers.stream()
    .reduce((a, b) -> a + b);

int sum2 = numbers.stream()
    .reduce(0, Integer::sum);

// forEach
numbers.stream()
    .forEach(System.out::println);

// Match operations
boolean hasEven = numbers.stream()
    .anyMatch(n -> n % 2 == 0);

boolean allPositive = numbers.stream()
    .allMatch(n -> n > 0);

boolean noneNegative = numbers.stream()
    .noneMatch(n -> n < 0);

// Find operations
Optional<Integer> first = numbers.stream()
    .filter(n -> n > 3)
    .findFirst();

Optional<Integer> any = numbers.stream()
    .filter(n -> n > 3)
    .findAny();

// Count
long count = numbers.stream()
    .filter(n -> n > 2)
    .count();

// Min/Max
Optional<Integer> min = numbers.stream()
    .min(Integer::compareTo);

Optional<Integer> max = numbers.stream()
    .max(Integer::compareTo);
```

## Advanced Collectors

### Grouping and Partitioning

```java
List<Person> people = Arrays.asList(
    new Person("John", 25, "Engineer"),
    new Person("Jane", 30, "Manager"),
    new Person("Jack", 25, "Engineer")
);

// Group by age
Map<Integer, List<Person>> byAge = people.stream()
    .collect(Collectors.groupingBy(Person::getAge));

// Group by profession and count
Map<String, Long> professionCount = people.stream()
    .collect(Collectors.groupingBy(
        Person::getProfession,
        Collectors.counting()
    ));

// Partition by age
Map<Boolean, List<Person>> partitioned = people.stream()
    .collect(Collectors.partitioningBy(p -> p.getAge() > 26));

// Multi-level grouping
Map<String, Map<Integer, List<Person>>> multiLevel = people.stream()
    .collect(Collectors.groupingBy(
        Person::getProfession,
        Collectors.groupingBy(Person::getAge)
    ));

// Custom collectors
String names = people.stream()
    .map(Person::getName)
    .collect(Collectors.joining(", ", "[", "]"));

DoubleSummaryStatistics stats = people.stream()
    .collect(Collectors.summarizingDouble(Person::getAge));
```

### Custom Collectors

```java
// Creating custom collector
Collector<String, ?, String> customJoiner = Collector.of(
    StringBuilder::new,           // supplier
    (sb, s) -> sb.append(s),     // accumulator
    StringBuilder::append,        // combiner
    StringBuilder::toString       // finisher
);

// Using the custom collector
String result = Stream.of("a", "b", "c")
    .collect(customJoiner);
```

## Optional Class

### Basic Usage

```java
// Creating Optional
Optional<String> optional1 = Optional.of("Hello");
Optional<String> optional2 = Optional.ofNullable(null);
Optional<String> optional3 = Optional.empty();

// Checking for value
if (optional1.isPresent()) {
    System.out.println(optional1.get());
}

// Better way
optional1.ifPresent(System.out::println);

// Default values
String value = optional2.orElse("Default");
String value2 = optional2.orElseGet(() -> "Default from supplier");
String value3 = optional2.orElseThrow(() -> new RuntimeException("No value"));
```

### Advanced Optional Operations

```java
Optional<String> optional = Optional.of("Hello World");

// Map
Optional<Integer> length = optional.map(String::length);

// FlatMap
Optional<String> upperCase = optional
    .flatMap(s -> s.isEmpty() ? Optional.empty() : Optional.of(s.toUpperCase()));

// Filter
Optional<String> filtered = optional
    .filter(s -> s.length() > 5);

// Chaining
String result = Optional.ofNullable(getString())
    .filter(s -> !s.isEmpty())
    .map(String::toUpperCase)
    .orElse("DEFAULT");

// Java 9+ additions
optional.ifPresentOrElse(
    System.out::println,
    () -> System.out.println("Empty")
);

// Java 11+ additions
Optional<String> or = optional
    .or(() -> Optional.of("Alternative"));
```

## Default Methods in Interfaces

### Basic Default Methods

```java
public interface Vehicle {
    void start();

    // Default method
    default void stop() {
        System.out.println("Vehicle stopped");
    }

    default void honk() {
        System.out.println("Beep beep!");
    }

    // Static method
    static void service() {
        System.out.println("Vehicle serviced");
    }
}

public class Car implements Vehicle {
    @Override
    public void start() {
        System.out.println("Car started");
    }

    // Can override default method
    @Override
    public void stop() {
        System.out.println("Car stopped with brakes");
    }
}
```

### Multiple Inheritance with Default Methods

```java
public interface Flyable {
    default void move() {
        System.out.println("Flying");
    }
}

public interface Swimmable {
    default void move() {
        System.out.println("Swimming");
    }
}

// Must resolve conflict
public class Duck implements Flyable, Swimmable {
    @Override
    public void move() {
        Flyable.super.move(); // Explicitly call one
        // Or provide custom implementation
    }
}
```

## Java 9+ Features

### Module System

```java
// module-info.java
module com.example.myapp {
    requires java.logging;
    requires transitive java.sql;
    exports com.example.myapp.api;
    opens com.example.myapp.internal to java.reflection;
}
```

### Enhanced Stream API

```java
// takeWhile and dropWhile
Stream.of(1, 2, 3, 4, 5, 6)
    .takeWhile(n -> n < 4)
    .forEach(System.out::println); // 1, 2, 3

Stream.of(1, 2, 3, 4, 5, 6)
    .dropWhile(n -> n < 4)
    .forEach(System.out::println); // 4, 5, 6

// iterate with predicate
Stream.iterate(1, n -> n < 20, n -> n * 2)
    .forEach(System.out::println); // 1, 2, 4, 8, 16

// ofNullable
Stream.ofNullable(getNullableValue())
    .forEach(System.out::println);
```

### Java 10+ Features

```java
// var keyword (Local Variable Type Inference)
var list = new ArrayList<String>();
var map = new HashMap<String, Integer>();
var stream = list.stream().filter(s -> s.length() > 5);

// Collection factory methods
List<String> immutableList = List.of("a", "b", "c");
Set<String> immutableSet = Set.of("a", "b", "c");
Map<String, Integer> immutableMap = Map.of("a", 1, "b", 2);
```

### Pattern Matching (Java 14+)

```java
// Switch expressions
String dayType = switch (dayOfWeek) {
    case MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY -> "Weekday";
    case SATURDAY, SUNDAY -> "Weekend";
};

// Pattern matching for instanceof (Java 16+)
if (obj instanceof String s) {
    System.out.println(s.toUpperCase());
}

// Records (Java 14+)
public record Person(String name, int age) {
    // Compact constructor
    public Person {
        if (age < 0) throw new IllegalArgumentException("Age cannot be negative");
    }

    // Custom methods
    public boolean isAdult() {
        return age >= 18;
    }
}
```

### Text Blocks (Java 15+)

```java
String json = """
    {
        "name": "John",
        "age": 30,
        "city": "New York"
    }
    """;

String sql = """
    SELECT p.name, p.age, a.street
    FROM person p
    JOIN address a ON p.id = a.person_id
    WHERE p.age > 18
    """;
```

## Performance Considerations

### Stream Performance

```java
// Parallel streams for CPU-intensive operations
List<Integer> largeList = IntStream.range(0, 1_000_000)
    .boxed()
    .collect(Collectors.toList());

// Sequential
long sum1 = largeList.stream()
    .mapToInt(Integer::intValue)
    .sum();

// Parallel
long sum2 = largeList.parallelStream()
    .mapToInt(Integer::intValue)
    .sum();

// Use primitive streams when possible
int sum3 = IntStream.range(0, 1_000_000)
    .parallel()
    .sum();
```

### Lambda Performance Tips

```java
// Avoid creating new objects in lambdas
list.stream()
    .map(s -> s.toUpperCase()) // Good
    .map(s -> new StringBuilder(s).toString()) // Avoid

// Reuse method references
Predicate<String> isEmpty = String::isEmpty; // Reusable
list.stream().filter(isEmpty);

// Consider parallel processing for large datasets
list.parallelStream()
    .filter(complexPredicate())
    .collect(Collectors.toList());
```

## Best Practices

### Lambda Expressions

1. Keep lambdas short and focused
2. Use method references when possible
3. Avoid side effects in lambdas
4. Consider creating named methods for complex logic

### Stream API

1. Use primitive streams for performance
2. Avoid parallel streams for small datasets
3. Don't reuse streams
4. Prefer forEach only for side effects
5. Use collect() instead of reduce() for mutable reduction

### Optional

1. Never call get() without checking isPresent()
2. Use orElse() for simple defaults, orElseGet() for expensive operations
3. Don't use Optional for fields, method parameters, or collections
4. Use Optional.map() and flatMap() for transformations

## Common Interview Questions

### Lambda Expressions

**Q: What are lambda expressions and their benefits?**
A: Lambda expressions are anonymous functions that provide a concise way to represent functional interfaces. Benefits include:

- Reduced boilerplate code
- Improved readability
- Enable functional programming
- Better performance than anonymous classes

**Q: What is a functional interface?**
A: An interface with exactly one abstract method. Can have default and static methods.

### Stream API

**Q: Difference between map() and flatMap()?**
A: map() transforms each element 1:1, flatMap() transforms each element to a stream and flattens the result.

**Q: When to use parallel streams?**
A: For CPU-intensive operations on large datasets (>10,000 elements) where the processing time per element is significant.

### Optional

**Q: Why was Optional introduced?**
A: To eliminate NullPointerException and make null handling explicit and safer.

**Q: Should Optional be used for method parameters?**
A: Generally no, it adds unnecessary overhead. Use overloaded methods or nullable parameters instead.

### Java 8+ Features

**Q: What are default methods and why were they added?**
A: Methods with implementation in interfaces, added to allow interface evolution without breaking existing implementations.

**Q: Explain method references types?**
A: Four types:

1. Static method reference (Class::staticMethod)
2. Instance method reference (instance::instanceMethod)
3. Instance method of arbitrary object (Class::instanceMethod)
4. Constructor reference (Class::new)
