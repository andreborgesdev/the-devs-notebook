# Java

## Overview

**Java** is a high-level, object-oriented, class-based, general-purpose programming language. It is designed to have as few implementation dependencies as possible, promoting portability and robustness.

| Feature              | Description                                        |
| -------------------- | -------------------------------------------------- |
| Platform Independent | Write Once, Run Anywhere (WORA)                    |
| Object-Oriented      | Supports encapsulation, inheritance, polymorphism  |
| Strongly Typed       | Explicit data types and compile-time type checking |
| Multi-threaded       | Built-in concurrency support                       |
| Rich API             | Extensive standard libraries                       |
| Memory Management    | Automatic garbage collection                       |

## Basic Syntax

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

## Core Concepts

### Data Types

| Type      | Example                     |
| --------- | --------------------------- |
| Primitive | int, double, boolean, char  |
| Reference | Arrays, Classes, Interfaces |

### Control Flow

```java
if (condition) { ... } else { ... }

for (int i = 0; i < 10; i++) { ... }

while (condition) { ... }
```

### Methods

```java
public int add(int a, int b) {
    return a + b;
}
```

## Object-Oriented Programming (OOP) Principles

| Principle     | Description                                                    |
| ------------- | -------------------------------------------------------------- |
| Encapsulation | Data hiding using access modifiers                             |
| Inheritance   | Code reuse by extending existing classes                       |
| Polymorphism  | Ability to present the same interface for different data types |
| Abstraction   | Hiding complex implementation details                          |

```java
class Animal {
    void sound() {
        System.out.println("Animal makes a sound");
    }
}

class Dog extends Animal {
    void sound() {
        System.out.println("Dog barks");
    }
}
```

## Memory Management

- **Heap**: Stores objects and class instances
- **Stack**: Stores method frames and local variables
- **Garbage Collector**: Reclaims unused memory automatically

## Exception Handling

```java
try {
    int result = 10 / 0;
} catch (ArithmeticException e) {
    System.out.println("Cannot divide by zero.");
} finally {
    System.out.println("Always executes.");
}
```

## Generics

```java
List<String> list = new ArrayList<>();
list.add("Java");
```

## Multithreading

```java
class MyThread extends Thread {
    public void run() {
        System.out.println("Thread running");
    }
}

MyThread t = new MyThread();
t.start();
```

## Collections Framework

| Interface | Implementations           |
| --------- | ------------------------- |
| List      | ArrayList, LinkedList     |
| Set       | HashSet, TreeSet          |
| Map       | HashMap, TreeMap          |
| Queue     | LinkedList, PriorityQueue |

## Java 8+ Features

| Feature               | Example                                            |
| --------------------- | -------------------------------------------------- |
| Lambda Expressions    | `(a, b) -> a + b`                                  |
| Stream API            | `list.stream().filter(x -> x > 10).collect()`      |
| Optional              | `Optional.ofNullable(value)`                       |
| Default Methods       | Interfaces can have default method implementations |
| Functional Interfaces | `@FunctionalInterface` annotation                  |

## Input/Output (I/O)

```java
import java.io.*;

BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
String input = reader.readLine();
```

## File Handling

```java
File file = new File("example.txt");
if (file.exists()) {
    System.out.println("File exists.");
}
```

## Networking

```java
import java.net.*;

URL url = new URL("https://example.com");
URLConnection conn = url.openConnection();
```

## JDBC (Java Database Connectivity)

```java
Connection conn = DriverManager.getConnection(url, username, password);
Statement stmt = conn.createStatement();
ResultSet rs = stmt.executeQuery("SELECT * FROM users");
```

## Best Practices

- Follow **naming conventions** (camelCase, PascalCase for classes)
- Use **design patterns** where appropriate (Singleton, Factory, etc.)
- Minimize the use of **static** where possible
- Leverage **interfaces** and **abstraction**
- Write **unit tests** (JUnit, TestNG)
- Keep methods **short and focused**
- Use **Java Streams and Lambdas** for cleaner, functional-style code

## Common Tools & Libraries

| Purpose              | Tools/Libraries        |
| -------------------- | ---------------------- |
| Build Tools          | Maven, Gradle          |
| Testing              | JUnit, TestNG, Mockito |
| Dependency Injection | Spring, Guice          |
| Logging              | Log4j, SLF4J           |
| Web Framework        | Spring Boot            |
| JSON Processing      | Jackson, Gson          |

## Concurrency & Multithreading

### Thread Creation

```java
Thread t = new Thread(() -> System.out.println("Thread running"));
t.start();
```

### Executor Service

```java
ExecutorService executor = Executors.newFixedThreadPool(10);
executor.submit(() -> System.out.println("Task executed"));
executor.shutdown();
```

### Synchronization

```java
synchronized void increment() {
    count++;
}
```

### Locks

```java
Lock lock = new ReentrantLock();
lock.lock();
try {
    // critical section
} finally {
    lock.unlock();
}
```

## Java Memory Model

- **Heap**: Object storage
- **Stack**: Method call frames
- **PermGen/Metaspace**: Class metadata (Java 8+ uses Metaspace)

### Garbage Collection (GC)

- **Serial GC**: Single-threaded, suitable for small applications
- **Parallel GC**: Multi-threaded for stop-the-world phases
- **G1 GC**: Low-pause, region-based collector
- **ZGC/Shenandoah**: Scalable, low-latency collectors

## Generics & Type Erasure

```java
List<String> list = new ArrayList<>();
```

**Type erasure**: Generic types are replaced with their bounds or Object at runtime.

## Reflection

```java
Class<?> clazz = Class.forName("com.example.MyClass");
Method method = clazz.getMethod("myMethod");
method.invoke(clazz.getDeclaredConstructor().newInstance());
```

## Annotations

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface MyAnnotation {
    String value();
}
```

## Functional Programming in Java

### Lambdas

```java
(List<Integer> list) -> list.forEach(System.out::println);
```

### Streams

```java
List<String> filtered = names.stream()
                             .filter(name -> name.startsWith("A"))
                             .collect(Collectors.toList());
```

### Optional

```java
Optional<String> name = Optional.ofNullable(getName());
name.ifPresent(System.out::println);
```

## Java Modules (Java 9+)

```java
module my.module {
    requires java.sql;
    exports com.example.mypackage;
}
```

## Design Patterns

| Pattern   | Purpose                                        |
| --------- | ---------------------------------------------- |
| Singleton | Single instance across the application         |
| Factory   | Creates objects without specifying exact class |
| Builder   | Constructs complex objects step by step        |
| Observer  | Allows objects to subscribe to events          |
| Strategy  | Encapsulates interchangeable behaviors         |

## Best Practices

- Prefer **Immutable** objects
- Use **Streams** and **Lambdas** for cleaner code
- Properly manage **resources** using try-with-resources
- Avoid **premature optimization**
- Use **dependency injection** frameworks like Spring

## Tools & Libraries

| Purpose               | Tools/Libraries       |
| --------------------- | --------------------- |
| Dependency Management | Maven, Gradle         |
| Testing               | JUnit 5, Mockito      |
| Code Quality          | SonarQube, Checkstyle |
| Logging               | Log4j2, SLF4J         |
| REST APIs             | Spring Boot, JAX-RS   |

## Summary

Java is a versatile, powerful language widely used for enterprise applications, web development, mobile apps (Android), and backend services. Its strong community, backward compatibility, and constant evolution (e.g., Java 17 and beyond) make it a top choice for scalable and maintainable software development.
