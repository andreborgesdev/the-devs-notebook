# Java Beans

A **Java Bean** is a reusable software component that follows specific conventions, making it easy to manipulate in development environments and frameworks like Spring.

At its core, a Java Bean is:

- A **POJO** (Plain Old Java Object)
- Has a **no-argument constructor**
- Implements **Serializable** (optional, but often recommended)
- Provides **getter and setter** methods to access properties

```java
public class User {
    private String name;
    private int age;

    // No-argument constructor
    public User() {}

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }
}
```

## Java Beans in Spring Framework

In Spring, beans are the objects managed by the Spring IoC (Inversion of Control) container. You can define them in XML or using annotations.

### Declaring a Bean

```java
@Component
public class MyService {
    // service logic
}
```

or explicitly:

```java
@Bean
public MyService myService() {
    return new MyService();
}
```

## @Primary

When multiple beans qualify for autowiring, Spring uses `@Primary` to resolve ambiguity.

```java
@Bean
@Primary
public PaymentService creditCardPaymentService() {
    return new CreditCardPaymentService();
}
```

**Use case**: If more than one `PaymentService` bean exists, the one marked `@Primary` is chosen by default.

## @Qualifier

If multiple beans match and no `@Primary` is specified, or if you want to override `@Primary`, use `@Qualifier`:

```java
@Autowired
@Qualifier("paypalPaymentService")
private PaymentService paymentService;
```

## Bean Scopes

Spring supports different bean scopes, determining how many instances of a bean Spring creates and how long they live:

| Scope           | Description                                        |
| --------------- | -------------------------------------------------- |
| **singleton**   | Single shared instance (default)                   |
| **prototype**   | A new instance is created each time it’s requested |
| **request**     | One instance per HTTP request (web apps only)      |
| **session**     | One instance per HTTP session                      |
| **application** | One instance per ServletContext                    |
| **websocket**   | One instance per WebSocket session                 |

## Summary

| Annotation   | Purpose                                                            |
| ------------ | ------------------------------------------------------------------ |
| `@Primary`   | Sets a default bean to be autowired when multiple candidates exist |
| `@Qualifier` | Specifies the exact bean to inject                                 |
| `@Bean`      | Declares a bean explicitly                                         |
| `@Component` | Marks a class as a Spring-managed bean                             |

**Tip**: Always remember the **singleton** scope is default — unless you specifically define another scope.

## Interview Quick Notes

- Java Beans must have **getters/setters** and a **no-arg constructor**.
- Spring beans can be configured using annotations or XML.
- Use `@Primary` or `@Qualifier` to resolve dependency ambiguity.
- Understand **bean scopes** — especially singleton vs prototype for coding interviews.
