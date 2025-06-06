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

Java objects managed by the Spring IoC container. Beans are instantiated, configured, and managed by the Spring container through metadata configuration.

## Default Bean Scope

Singleton - only one instance per Spring container.

## How to Define Bean Scope

Use `@Scope` annotation or XML configuration. Supported scopes:

- **Singleton**: One instance per container (default)
- **Prototype**: New instance each time requested
- **Request**: One instance per HTTP request
- **Session**: One instance per HTTP session
- **Application**: One instance per ServletContext
- **WebSocket**: One instance per WebSocket session

## Are Singleton Beans Thread-Safe?

No. Spring doesn't manage thread safety - it depends on the bean implementation. Singleton beans should be stateless or immutable to be thread-safe.

## Spring Bean Life Cycle

1. **Instantiation**: Container creates bean instance
2. **Property Population**: Dependencies injected
3. **BeanNameAware.setBeanName()**: If bean implements BeanNameAware
4. **BeanFactoryAware.setBeanFactory()**: If bean implements BeanFactoryAware
5. **ApplicationContextAware.setApplicationContext()**: If bean implements ApplicationContextAware
6. **@PostConstruct or InitializingBean.afterPropertiesSet()**: Custom initialization
7. **Bean ready for use**
8. **@PreDestroy or DisposableBean.destroy()**: Before container shutdown

## What Are the Different Types of Dependency Injection?

- **Constructor Injection**: Dependencies injected through constructor
- **Setter Injection**: Dependencies injected through setter methods
- **Field Injection**: Dependencies injected directly into fields using `@Autowired`

## What Is the Difference Between @Component, @Service, @Repository, and @Controller?

- **@Component**: Generic stereotype annotation for any Spring-managed component
- **@Service**: Specialization of @Component for service layer
- **@Repository**: Specialization of @Component for data access layer, provides exception translation
- **@Controller**: Specialization of @Component for presentation layer (Spring MVC)

## What Is @Autowired and How Does It Work?

`@Autowired` enables automatic dependency injection. Spring resolves dependencies by type, then by name if multiple candidates exist.

```java
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository; // Field injection

    @Autowired
    public UserService(UserRepository userRepository) { // Constructor injection
        this.userRepository = userRepository;
    }
}
```

## What Is @Qualifier and When Would You Use It?

`@Qualifier` resolves ambiguity when multiple beans of the same type exist:

```java
@Service
public class NotificationService {
    @Autowired
    @Qualifier("emailNotifier")
    private NotificationProvider notificationProvider;
}
```

## What Is the Difference Between @Configuration and @Component?

- **@Configuration**: Indicates a class declares `@Bean` methods, processed by CGLIB for proxy creation
- **@Component**: General-purpose stereotype annotation for Spring-managed components

## What Is @Primary Annotation?

`@Primary` gives preference to a bean when multiple candidates exist for injection, eliminating the need for `@Qualifier`.

## What Are Circular Dependencies and How Does Spring Handle Them?

Circular dependencies occur when Bean A depends on Bean B, and Bean B depends on Bean A. Spring detects and resolves constructor circular dependencies by throwing `BeanCurrentlyInCreationException`. Setter injection can resolve some circular dependencies.

## What Is @Lazy Annotation?

`@Lazy` delays bean initialization until first access, useful for expensive-to-create beans or breaking circular dependencies.

## What Is the Difference Between ApplicationContext and BeanFactory?

- **BeanFactory**: Basic container with lazy initialization
- **ApplicationContext**: Advanced container with eager initialization, internationalization, event propagation, and additional features

## What Is @Profile and How Is It Used?

`@Profile` allows conditional bean registration based on active profiles:

```java
@Configuration
@Profile("dev")
public class DevConfig {
    @Bean
    public DataSource dataSource() {
        return new EmbeddedDatabaseBuilder().build();
    }
}
```

## What Is @Conditional Annotation?

`@Conditional` enables conditional bean creation based on custom conditions:

```java
@Bean
@Conditional(WindowsCondition.class)
public FileService windowsFileService() {
    return new WindowsFileService();
}
```

## What Is Spring Java-Based Configuration?

Type-safe alternative to XML configuration using `@Configuration` classes with `@Bean` methods:

```java
@Configuration
public class AppConfig {
    @Bean
    public UserService userService() {
        return new UserService(userRepository());
    }

    @Bean
    public UserRepository userRepository() {
        return new JpaUserRepository();
    }
}
```

## Can You Have Multiple Spring Configuration Files?

Yes, multiple configurations can be loaded using:

- `@Import` in Java configuration
- `@ComponentScan` for package scanning
- `@PropertySource` for properties files
- XML `<import>` elements

## What Are Spring Profiles?

Profiles provide environment-specific bean configurations. Activate using:

- `spring.profiles.active` system property
- `@ActiveProfiles` in tests
- Environment variables

## What Is Spring Expression Language (SpEL)?

Powerful expression language supporting:

- Property access and method invocation
- Mathematical and logical operations
- Regular expressions
- Collection selection and projection

```java
@Value("#{systemProperties['user.name']}")
private String username;

@Value("#{T(java.lang.Math).random() * 100}")
private double randomNumber;
```

## What Is @Value Annotation?

`@Value` injects values from properties files, system properties, or SpEL expressions:

```java
@Value("${app.name}")
private String appName;

@Value("#{userService.getUserCount()}")
private int userCount;
```

## What Is @PropertySource?

`@PropertySource` loads external properties files into Spring Environment:

```java
@Configuration
@PropertySource("classpath:application.properties")
public class AppConfig {
    @Autowired
    private Environment env;

    @Bean
    public DataSource dataSource() {
        return new DriverManagerDataSource(
            env.getProperty("db.url"),
            env.getProperty("db.username"),
            env.getProperty("db.password")
        );
    }
}
```

## What Are ApplicationEvents in Spring?

Spring provides event publishing and listening mechanism:

```java
@Component
public class UserRegistrationListener {
    @EventListener
    public void handleUserRegistration(UserRegisteredEvent event) {
        // Send welcome email
    }
}

@Service
public class UserService {
    @Autowired
    private ApplicationEventPublisher publisher;

    public void registerUser(User user) {
        // Save user
        publisher.publishEvent(new UserRegisteredEvent(user));
    }
}
```

## What Is @PostConstruct and @PreDestroy?

Lifecycle callback annotations:

- `@PostConstruct`: Executed after dependency injection
- `@PreDestroy`: Executed before bean destruction

```java
@Service
public class DatabaseService {
    @PostConstruct
    public void initConnection() {
        // Initialize database connection
    }

    @PreDestroy
    public void closeConnection() {
        // Close database connection
    }
}
```

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

```java
Mono<String> mono = Mono.just("single value");
Flux<String> flux = Flux.just("value1", "value2", "value3");
```

## What Are the Disadvantages of Using Reactive Streams?

- Debugging is more difficult.
- Limited support for reactive data stores.
- Steeper learning curve.

## Can We Use Both Web MVC and WebFlux in the Same Application?

No. Spring Boot auto-configures either Spring MVC or Spring WebFlux based on classpath dependencies. Also, they have different paradigms (blocking vs. non-blocking) and cannot run together.

## How Does WebFlux Handle Backpressure?

Backpressure prevents fast producers from overwhelming slow consumers:

```java
@RestController
public class ReactiveController {

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> streamData() {
        return Flux.interval(Duration.ofSeconds(1))
                .map(i -> "Data " + i)
                .onBackpressureBuffer(100) // Buffer up to 100 items
                .doOnRequest(n -> log.info("Requested {} items", n));
    }
}
```

## What Are Reactive Operators?

Common operators for transforming reactive streams:

```java
@Service
public class ReactiveUserService {

    public Flux<User> getAllUsers() {
        return userRepository.findAll()
                .filter(user -> user.isActive())
                .map(this::enrichUser)
                .flatMap(this::validateUser)
                .onErrorResume(ex -> Flux.empty())
                .doOnNext(user -> log.info("Processing user: {}", user.getId()));
    }

    public Mono<User> getUserById(String id) {
        return userRepository.findById(id)
                .switchIfEmpty(Mono.error(new UserNotFoundException("User not found")))
                .timeout(Duration.ofSeconds(5))
                .retry(3);
    }
}
```

## What Is Functional Web Programming in WebFlux?

Alternative to annotation-based controllers using functional programming:

```java
@Configuration
public class RouterConfig {

    @Bean
    public RouterFunction<ServerResponse> routes(UserHandler userHandler) {
        return RouterFunctions
                .route(GET("/users").and(accept(APPLICATION_JSON)), userHandler::getAllUsers)
                .andRoute(GET("/users/{id}").and(accept(APPLICATION_JSON)), userHandler::getUser)
                .andRoute(POST("/users").and(accept(APPLICATION_JSON)), userHandler::createUser)
                .andRoute(PUT("/users/{id}").and(accept(APPLICATION_JSON)), userHandler::updateUser)
                .andRoute(DELETE("/users/{id}"), userHandler::deleteUser);
    }
}

@Component
public class UserHandler {

    private final UserService userService;

    public Mono<ServerResponse> getAllUsers(ServerRequest request) {
        return ServerResponse.ok()
                .contentType(APPLICATION_JSON)
                .body(userService.findAll(), User.class);
    }

    public Mono<ServerResponse> getUser(ServerRequest request) {
        String id = request.pathVariable("id");
        return userService.findById(id)
                .flatMap(user -> ServerResponse.ok()
                        .contentType(APPLICATION_JSON)
                        .body(Mono.just(user), User.class))
                .switchIfEmpty(ServerResponse.notFound().build());
    }
}
```

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
