# Spring Core

## What Is Spring Framework?

Spring is the most broadly used framework for the development of Java Enterprise Edition applications. The core features of Spring can be used in developing any Java application. Extensions are available for building various web applications on top of the Jakarta EE platform or for using dependency injection in simple standalone applications.

## What Are the Benefits of Using Spring?

- **Lightweight** – Minimal overhead in development.
- **Inversion of Control (IoC)** – Automatic wiring of dependencies.
- **Aspect-Oriented Programming (AOP)** – Separates business logic from system services.
- **IoC Container** – Manages Spring Bean life cycle and configurations.
- **MVC Framework** – Facilitates web applications and RESTful services.
- **Transaction Management** – Reduces boilerplate code.
- **Exception Handling** – Simplifies error handling.

## What Spring Sub-Projects Do You Know?

- **Core** – IoC and DI fundamentals.
- **JDBC** – JDBC-abstraction layer.
- **ORM** – Integration with APIs like JPA, Hibernate.
- **Web** – Multipart upload, Servlet listeners, web context.
- **MVC** – Implements the Model View Controller pattern.
- **AOP** – Aspect-oriented programming support.

## Interceptors

Interceptors intercept requests and process them. They can execute logic before and after request handling using methods like `preHandle()`, `postHandle()`, and `afterCompletion()`.

## Actuator

Provides production-ready features like monitoring, metrics, and health checks through HTTP endpoints or JMX beans.

## What Is Dependency Injection?

An IoC principle where the container instantiates required classes and injects dependencies instead of manual object creation.

## How Can We Inject Beans in Spring?

- Setter injection
- Constructor injection
- Field injection

Configuration can be via XML or annotations.

## Best Way to Inject Beans

Use constructor injection for mandatory dependencies and setter injection for optional ones.

## Difference Between BeanFactory and ApplicationContext

- **BeanFactory** – Lazily instantiates beans.
- **ApplicationContext** – Eagerly instantiates beans and provides additional functionality.

## What Is a Spring Bean?

Java objects managed by the Spring IoC container.

## Default Bean Scope

Singleton.

## How to Define Bean Scope

Use `@Scope` annotation or XML configuration. Supported scopes: Singleton, Prototype, Request, Session, Global-session.

## Are Singleton Beans Thread-Safe?

No. Thread safety depends on the bean implementation.

## Spring Bean Life Cycle

Instantiation → Initialization → Usage → Destruction.

## Spring Java-Based Configuration

Type-safe alternative to XML-based configuration using `@Configuration` classes.

## Multiple Spring Configuration Files

Yes, multiple configurations can be loaded using `@Import` in Java or `<import>` in XML.

## What Is Spring Security?

A module providing authentication, authorization, and protection against common vulnerabilities.

## What Is Spring Boot?

A project providing pre-configured frameworks, automatic configuration, and an embedded server to simplify Spring application development.

## Design Patterns Used in Spring

- Singleton
- Factory
- Prototype
- Adapter
- Proxy
- Template Method
- Front Controller
- DAO
- MVC

## Singleton Scope

Creates a single instance shared across all requests.

## Prototype Scope

Creates a new instance for each request.

## Request Scope

Ties bean lifecycle to an HTTP request.

## Session Scope

Ties bean lifecycle to an HTTP session.

## Global Session Scope

Ties bean lifecycle to a global HTTP session (for portlet contexts).

## Qualifier

Used to distinguish between multiple bean implementations, enabling easy switching between components.
