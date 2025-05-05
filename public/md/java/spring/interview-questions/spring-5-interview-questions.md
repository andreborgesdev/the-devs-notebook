# Spring 5 Q\&A

## What Is Reactive Programming?

Reactive programming is about non-blocking, event-driven applications that scale with a small number of threads. A key concept is back pressure, which prevents producers from overwhelming consumers.

**Benefits:**

- Better utilization of multicore and multi-CPU hardware
- Increased performance through reduced serialization

Reactive programming is event-driven. When applied following the [Reactive Manifesto](https://www.reactivemanifesto.org/), it helps build reactive systems with these characteristics:

- Responsive
- Resilient
- Elastic
- Message-driven

## What Is Spring WebFlux?

[Spring WebFlux](https://docs.spring.io/spring/docs/current/spring-framework-reference/web-reactive.html#webflux) is Spring's reactive-stack web framework. Unlike Spring MVC, it is fully non-blocking and supports reactive programming models.

## What Are the Mono and Flux Types?

Spring WebFlux uses Project Reactor, which provides:

- **Mono**: Represents 0 or 1 asynchronous values.
- **Flux**: Represents 0 to N asynchronous values.

Both implement the `Publisher` interface and are lazy and immutable.

## What Is the Use of WebClient and WebTestClient?

- **WebClient**: A reactive, non-blocking HTTP client.
- **WebTestClient**: Similar to WebClient but designed for testing. It can connect to servers or mock WebFlux applications without needing an actual HTTP server.

## What Are the Disadvantages of Using Reactive Streams?

- Debugging is more difficult.
- Limited support for reactive data stores.
- Steeper learning curve.

## Is Spring 5 Compatible With Older Versions of Java?

No. Spring 5 requires **Java 8 or higher** because it takes advantage of Java 8 features.

## How Does Spring 5 Integrate With JDK 9 Modularity?

Spring 5 has been modularized to align with Java 9's module system, allowing more fine-grained dependency management.

**Example:**

```java
module com.hello {
    exports com.hello;
}
```

A client module:

```java
module com.hello.client {
    requires com.hello;
}
```

## Can We Use Both Web MVC and WebFlux in the Same Application?

No. Spring Boot auto-configures either Spring MVC or Spring WebFlux based on classpath dependencies. Also, they have different paradigms (blocking vs. non-blocking) and cannot run together.

## Additional Notes

**Mono vs Flux:**

```java
Mono<String> mono = Mono.just("single value");
Flux<String> flux = Flux.just("value1", "value2", "value3");
```

**WebClient example:**

```java
WebClient.create()
    .get()
    .uri("/api/data")
    .retrieve()
    .bodyToMono(String.class);
```

**Reactive Streams Debugging Tip:** Use `.log()` in Reactor to trace events.

**Key Point:** While WebFlux offers powerful scalability, evaluate its trade-offs, especially if your team or existing ecosystem is deeply familiar with blocking paradigms like Spring MVC.
