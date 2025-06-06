# Spring Cloud and Microservices Interview Questions

## What Are Microservices?

Microservices are an architectural approach where applications are built as a collection of small, independent services that communicate over well-defined APIs.

**Benefits:**

- Independent deployment and scaling
- Technology diversity
- Fault isolation
- Team autonomy
- Better maintainability

**Challenges:**

- Distributed system complexity
- Network latency and failures
- Data consistency
- Service discovery and communication
- Monitoring and debugging

## What Is Spring Cloud?

Spring Cloud provides tools for building distributed systems and microservices:

- **Service Discovery**: Eureka, Consul, Zookeeper
- **Circuit Breakers**: Hystrix, Resilience4j
- **API Gateway**: Spring Cloud Gateway, Zuul
- **Configuration Management**: Spring Cloud Config
- **Load Balancing**: Ribbon, Spring Cloud LoadBalancer
- **Distributed Tracing**: Sleuth, Zipkin

## What Is Service Discovery?

Service discovery allows services to find and communicate with each other without hardcoding network locations.

### Eureka Server

```java
@SpringBootApplication
@EnableEurekaServer
public class EurekaServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaServerApplication.class, args);
    }
}

# application.yml
server:
  port: 8761
eureka:
  client:
    register-with-eureka: false
    fetch-registry: false
```

### Eureka Client

```java
@SpringBootApplication
@EnableEurekaClient
public class UserServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }
}

# application.yml
spring:
  application:
    name: user-service
eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
```

## What Is an API Gateway?

API Gateway is a single entry point for all client requests, providing:

- Request routing
- Authentication and authorization
- Rate limiting
- Request/response transformation
- Load balancing

### Spring Cloud Gateway

```java
@SpringBootApplication
public class GatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("user-service", r -> r.path("/users/**")
                        .uri("lb://user-service"))
                .route("order-service", r -> r.path("/orders/**")
                        .uri("lb://order-service"))
                .build();
    }
}

# application.yml
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://user-service
          predicates:
            - Path=/users/**
          filters:
            - AddRequestHeader=X-Request-Source, Gateway
        - id: order-service
          uri: lb://order-service
          predicates:
            - Path=/orders/**
          filters:
            - CircuitBreaker=order-circuit-breaker
```

## What Is Circuit Breaker Pattern?

Circuit Breaker prevents cascading failures by monitoring service calls and failing fast when a service is unavailable.

### Resilience4j Circuit Breaker

```java
@Service
public class UserService {

    @Autowired
    private RestTemplate restTemplate;

    @CircuitBreaker(name = "user-service", fallbackMethod = "fallbackUser")
    @Retry(name = "user-service")
    @TimeLimiter(name = "user-service")
    public CompletableFuture<User> getUser(Long id) {
        return CompletableFuture.supplyAsync(() ->
            restTemplate.getForObject("/users/" + id, User.class));
    }

    public CompletableFuture<User> fallbackUser(Long id, Exception ex) {
        return CompletableFuture.completedFuture(
            new User(id, "Fallback User", "fallback@example.com"));
    }
}

# application.yml
resilience4j:
  circuitbreaker:
    instances:
      user-service:
        failure-rate-threshold: 50
        wait-duration-in-open-state: 10s
        sliding-window-size: 10
        minimum-number-of-calls: 5
  retry:
    instances:
      user-service:
        max-attempts: 3
        wait-duration: 1s
```

## What Is Spring Cloud Config?

Spring Cloud Config provides centralized configuration management for distributed systems.

### Config Server

```java
@SpringBootApplication
@EnableConfigServer
public class ConfigServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(ConfigServerApplication.class, args);
    }
}

# application.yml
server:
  port: 8888
spring:
  cloud:
    config:
      server:
        git:
          uri: https://github.com/myorg/config-repo
          search-paths: '{application}'
```

### Config Client

```java
@RestController
@RefreshScope
public class ConfigController {

    @Value("${app.message:Default Message}")
    private String message;

    @GetMapping("/message")
    public String getMessage() {
        return message;
    }
}

# bootstrap.yml
spring:
  application:
    name: user-service
  cloud:
    config:
      uri: http://localhost:8888
      fail-fast: true
      retry:
        max-attempts: 6
        initial-interval: 1000
```

## What Is Load Balancing in Spring Cloud?

Load balancing distributes requests across multiple service instances.

### Using RestTemplate with LoadBalancer

```java
@Configuration
public class RestTemplateConfig {

    @Bean
    @LoadBalanced
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}

@Service
public class OrderService {

    @Autowired
    private RestTemplate restTemplate;

    public User getUser(Long userId) {
        // Will be load balanced across user-service instances
        return restTemplate.getForObject("http://user-service/users/" + userId, User.class);
    }
}
```

### Using WebClient with LoadBalancer

```java
@Configuration
public class WebClientConfig {

    @Bean
    @LoadBalanced
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    }

    @Bean
    public WebClient webClient(WebClient.Builder builder) {
        return builder.build();
    }
}

@Service
public class OrderService {

    @Autowired
    private WebClient webClient;

    public Mono<User> getUser(Long userId) {
        return webClient.get()
                .uri("http://user-service/users/" + userId)
                .retrieve()
                .bodyToMono(User.class);
    }
}
```

## What Is Distributed Tracing?

Distributed tracing tracks requests across multiple services to understand system behavior and performance.

### Spring Cloud Sleuth with Zipkin

```java
@SpringBootApplication
public class UserServiceApplication {

    @Bean
    public Sender sender() {
        return OkHttpSender.create("http://localhost:9411/api/v2/spans");
    }
}

# application.yml
spring:
  sleuth:
    zipkin:
      base-url: http://localhost:9411
    sampler:
      probability: 1.0
  application:
    name: user-service
```

### Custom Spans

```java
@Service
public class UserService {

    @Autowired
    private Tracer tracer;

    public User processUser(User user) {
        Span span = tracer.nextSpan()
                .name("user-validation")
                .tag("user.id", user.getId().toString())
                .start();

        try (Tracer.SpanInScope ws = tracer.withSpanInScope(span)) {
            // Business logic
            validateUser(user);
            return enrichUser(user);
        } finally {
            span.end();
        }
    }
}
```

## What Is Event-Driven Architecture?

Event-driven architecture uses events to trigger and communicate between services.

### Spring Cloud Stream

```java
@Component
public class UserEventHandler {

    @StreamListener("user-events")
    public void handleUserCreated(UserCreatedEvent event) {
        log.info("User created: {}", event.getUserId());
        // Process the event
        sendWelcomeEmail(event.getUserId());
    }

    @StreamListener("user-events")
    @SendTo("user-notifications")
    public NotificationEvent handleUserUpdated(UserUpdatedEvent event) {
        log.info("User updated: {}", event.getUserId());
        return new NotificationEvent("User profile updated", event.getUserId());
    }
}

@Service
public class UserService {

    @Autowired
    private MessageChannel userEventsChannel;

    public User createUser(User user) {
        User savedUser = userRepository.save(user);

        UserCreatedEvent event = new UserCreatedEvent(savedUser.getId(), savedUser.getEmail());
        userEventsChannel.send(MessageBuilder.withPayload(event).build());

        return savedUser;
    }
}

# application.yml
spring:
  cloud:
    stream:
      bindings:
        user-events:
          destination: user.events
          group: user-service
        user-notifications:
          destination: user.notifications
      kafka:
        binder:
          brokers: localhost:9092
```

## What Are Microservice Design Patterns?

### Database per Service

Each microservice owns its data and database:

```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue
    private Long id;
    private String name;
    private String email;
}

@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue
    private Long id;
    private Long userId; // Reference to user, not foreign key
    private BigDecimal amount;
}
```

### Saga Pattern for Distributed Transactions

```java
@Component
public class OrderSaga {

    @SagaOrchestrationStart
    public void processOrder(OrderCreatedEvent event) {
        // Step 1: Reserve inventory
        sagaManager.choreography()
                .step("reserve-inventory")
                .compensate("release-inventory")
                .invoke(inventoryService::reserveItems, event.getItems());

        // Step 2: Process payment
        sagaManager.choreography()
                .step("process-payment")
                .compensate("refund-payment")
                .invoke(paymentService::processPayment, event.getPayment());

        // Step 3: Ship order
        sagaManager.choreography()
                .step("ship-order")
                .compensate("cancel-shipment")
                .invoke(shippingService::shipOrder, event.getOrderId());
    }
}
```

### CQRS (Command Query Responsibility Segregation)

```java
// Command side
@Service
public class UserCommandService {

    @Autowired
    private UserWriteRepository writeRepository;

    @Autowired
    private EventPublisher eventPublisher;

    public void createUser(CreateUserCommand command) {
        User user = new User(command.getName(), command.getEmail());
        writeRepository.save(user);

        eventPublisher.publish(new UserCreatedEvent(user.getId(), user.getEmail()));
    }
}

// Query side
@Service
public class UserQueryService {

    @Autowired
    private UserReadRepository readRepository;

    public UserProjection findById(Long id) {
        return readRepository.findProjectionById(id);
    }

    public List<UserSummary> findUserSummaries() {
        return readRepository.findAllSummaries();
    }
}
```

## How to Handle Data Consistency in Microservices?

### Eventually Consistent with Events

```java
@EventHandler
public class OrderProjectionHandler {

    @Autowired
    private OrderProjectionRepository repository;

    @EventListener
    public void on(OrderCreatedEvent event) {
        OrderProjection projection = new OrderProjection(
            event.getOrderId(),
            event.getUserId(),
            event.getAmount(),
            OrderStatus.PENDING
        );
        repository.save(projection);
    }

    @EventListener
    public void on(PaymentProcessedEvent event) {
        OrderProjection projection = repository.findByOrderId(event.getOrderId());
        projection.setStatus(OrderStatus.PAID);
        repository.save(projection);
    }
}
```

## What Is Service Mesh?

Service mesh provides infrastructure layer for service-to-service communication:

- **Traffic management**: Load balancing, routing, retries
- **Security**: mTLS, authentication, authorization
- **Observability**: Metrics, logging, tracing

### Istio with Spring Boot

```yaml
apiVersion: v1
kind: Service
metadata:
  name: user-service
spec:
  selector:
    app: user-service
  ports:
    - port: 8080
---
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: user-service
spec:
  http:
    - match:
        - uri:
            prefix: "/users"
      route:
        - destination:
            host: user-service
          weight: 90
        - destination:
            host: user-service-v2
          weight: 10
```

## How to Monitor Microservices?

### Health Checks

```java
@Component
public class DatabaseHealthIndicator implements HealthIndicator {

    @Autowired
    private DataSource dataSource;

    @Override
    public Health health() {
        try (Connection connection = dataSource.getConnection()) {
            return Health.up()
                    .withDetail("database", "Available")
                    .build();
        } catch (SQLException e) {
            return Health.down(e)
                    .withDetail("database", "Unavailable")
                    .build();
        }
    }
}
```

### Metrics with Micrometer

```java
@RestController
public class UserController {

    private final Counter userCreationCounter;
    private final Timer userLookupTimer;

    public UserController(MeterRegistry meterRegistry) {
        this.userCreationCounter = Counter.builder("user.creation")
                .description("Number of users created")
                .register(meterRegistry);
        this.userLookupTimer = Timer.builder("user.lookup")
                .description("User lookup time")
                .register(meterRegistry);
    }

    @PostMapping("/users")
    public User createUser(@RequestBody User user) {
        userCreationCounter.increment();
        return userService.createUser(user);
    }

    @GetMapping("/users/{id}")
    public User getUser(@PathVariable Long id) {
        return Timer.Sample.start(userLookupTimer)
                .stop(userService.findById(id));
    }
}
```

## What Are the Best Practices for Microservices?

1. **Single Responsibility**: Each service should have one business capability
2. **Database per Service**: Avoid shared databases
3. **API Versioning**: Support backward compatibility
4. **Circuit Breakers**: Handle service failures gracefully
5. **Centralized Logging**: Aggregate logs from all services
6. **Security**: Implement authentication and authorization
7. **Monitoring**: Track health, metrics, and distributed traces
8. **Automated Testing**: Unit, integration, and contract testing
9. **CI/CD**: Automated deployment pipelines
10. **Documentation**: Keep API documentation up to date
