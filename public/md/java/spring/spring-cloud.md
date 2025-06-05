# Spring Cloud

Spring Cloud provides tools for building robust cloud-native applications with patterns like service discovery, circuit breakers, configuration management, and more.

## Core Components

### Service Discovery with Eureka

#### Eureka Server

```java
@SpringBootApplication
@EnableEurekaServer
public class EurekaServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaServerApplication.class, args);
    }
}
```

```yaml
server:
  port: 8761

eureka:
  client:
    register-with-eureka: false
    fetch-registry: false
  server:
    enable-self-preservation: false
```

#### Eureka Client

```java
@SpringBootApplication
@EnableEurekaClient
public class UserServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }
}
```

```yaml
spring:
  application:
    name: user-service

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
  instance:
    prefer-ip-address: true
```

## API Gateway with Spring Cloud Gateway

### Basic Gateway Configuration

```java
@SpringBootApplication
public class GatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }
}
```

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://user-service
          predicates:
            - Path=/api/users/**
          filters:
            - StripPrefix=1
        - id: order-service
          uri: lb://order-service
          predicates:
            - Path=/api/orders/**
          filters:
            - StripPrefix=1
```

### Custom Filters

```java
@Component
public class LoggingGatewayFilterFactory extends AbstractGatewayFilterFactory<LoggingGatewayFilterFactory.Config> {

    public LoggingGatewayFilterFactory() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            log.info("Request: {} {}", request.getMethod(), request.getURI());

            return chain.filter(exchange).then(Mono.fromRunnable(() -> {
                ServerHttpResponse response = exchange.getResponse();
                log.info("Response: {}", response.getStatusCode());
            }));
        };
    }

    public static class Config {
        // Configuration properties
    }
}
```

## Circuit Breaker with Resilience4j

### Configuration

```yaml
resilience4j:
  circuitbreaker:
    instances:
      user-service:
        sliding-window-size: 10
        minimum-number-of-calls: 5
        failure-rate-threshold: 50
        wait-duration-in-open-state: 10s
        permitted-number-of-calls-in-half-open-state: 3
  retry:
    instances:
      user-service:
        max-attempts: 3
        wait-duration: 1s
```

### Circuit Breaker Usage

```java
@Service
public class UserService {

    private final WebClient webClient;

    public UserService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    @CircuitBreaker(name = "user-service", fallbackMethod = "getUserFallback")
    @Retry(name = "user-service")
    public Mono<User> getUser(String id) {
        return webClient.get()
            .uri("http://user-service/api/users/{id}", id)
            .retrieve()
            .bodyToMono(User.class);
    }

    public Mono<User> getUserFallback(String id, Exception ex) {
        return Mono.just(new User(id, "Unknown", "User"));
    }
}
```

## Configuration Management

### Spring Cloud Config Server

```java
@SpringBootApplication
@EnableConfigServer
public class ConfigServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(ConfigServerApplication.class, args);
    }
}
```

```yaml
server:
  port: 8888

spring:
  cloud:
    config:
      server:
        git:
          uri: https://github.com/your-org/config-repo
          default-label: main
```

### Config Client

```yaml
spring:
  application:
    name: user-service
  cloud:
    config:
      uri: http://localhost:8888
      fail-fast: true
  config:
    import: "configserver:http://localhost:8888"
```

### Refreshable Configuration

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
```

## Load Balancing

### With RestTemplate

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

    private final RestTemplate restTemplate;

    public OrderService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public User getUser(String id) {
        return restTemplate.getForObject("http://user-service/api/users/{id}", User.class, id);
    }
}
```

### With WebClient

```java
@Configuration
public class WebClientConfig {

    @Bean
    @LoadBalanced
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    }
}
```

## Distributed Tracing

### Sleuth Configuration

```yaml
spring:
  sleuth:
    sampler:
      probability: 1.0
    zipkin:
      base-url: http://localhost:9411
```

### Custom Spans

```java
@Service
public class UserService {

    private final Tracer tracer;

    public UserService(Tracer tracer) {
        this.tracer = tracer;
    }

    public User processUser(String id) {
        Span span = tracer.nextSpan().name("process-user").start();
        try (Tracer.SpanInScope ws = tracer.withSpanInScope(span)) {
            span.tag("user.id", id);
            // Processing logic
            return findUser(id);
        } finally {
            span.end();
        }
    }
}
```

## Message-Driven Microservices

### Spring Cloud Stream

```java
@EnableBinding(Sink.class)
@SpringBootApplication
public class MessageConsumerApplication {

    @StreamListener(Sink.INPUT)
    public void handleMessage(String message) {
        log.info("Received message: {}", message);
    }

    public static void main(String[] args) {
        SpringApplication.run(MessageConsumerApplication.class, args);
    }
}
```

```yaml
spring:
  cloud:
    stream:
      bindings:
        input:
          destination: user-events
          group: user-service
      kafka:
        binder:
          brokers: localhost:9092
```

## Service Mesh Integration

### Consul Integration

```yaml
spring:
  cloud:
    consul:
      host: localhost
      port: 8500
      discovery:
        health-check-path: /actuator/health
        health-check-interval: 10s
        instance-id: ${spring.application.name}:${random.value}
```

## Security in Microservices

### OAuth2 Resource Server

```java
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.oauth2ResourceServer(oauth2 -> oauth2.jwt(withDefaults()));
        return http.build();
    }
}
```

### JWT Token Relay

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://user-service
          predicates:
            - Path=/api/users/**
          filters:
            - TokenRelay=
```

## Monitoring and Health Checks

### Actuator Endpoints

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: always
  health:
    circuitbreakers:
      enabled: true
```

### Custom Health Indicators

```java
@Component
public class ExternalServiceHealthIndicator implements HealthIndicator {

    private final WebClient webClient;

    public ExternalServiceHealthIndicator(WebClient webClient) {
        this.webClient = webClient;
    }

    @Override
    public Health health() {
        try {
            String response = webClient.get()
                .uri("http://external-service/health")
                .retrieve()
                .bodyToMono(String.class)
                .block(Duration.ofSeconds(5));

            return Health.up()
                .withDetail("external-service", "Available")
                .build();
        } catch (Exception e) {
            return Health.down()
                .withDetail("external-service", "Unavailable")
                .withException(e)
                .build();
        }
    }
}
```

## Best Practices

### Configuration Management

- Use external configuration servers
- Implement configuration refresh without restart
- Secure sensitive configuration data
- Version configuration changes

### Service Communication

- Implement circuit breakers for external calls
- Use retry mechanisms with exponential backoff
- Implement proper timeout configurations
- Use asynchronous communication where possible

### Monitoring and Observability

- Implement distributed tracing
- Use centralized logging
- Monitor service health and metrics
- Implement proper alerting

### Security

- Implement OAuth2/JWT for authentication
- Use API Gateway for centralized security
- Implement proper CORS policies
- Secure service-to-service communication

## Testing Cloud Applications

### Integration Testing

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureTestDatabase
class UserServiceIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void shouldCreateUser() {
        User user = new User("John", "Doe");

        ResponseEntity<User> response = restTemplate.postForEntity("/api/users", user, User.class);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody().getId());
    }
}
```

### Contract Testing

```java
@SpringBootTest
@AutoConfigureStubRunner(ids = "com.example:user-service:+:stubs:8080")
class OrderServiceContractTest {

    @Autowired
    private OrderService orderService;

    @Test
    void shouldGetUserFromContract() {
        User user = orderService.getUser("1");

        assertNotNull(user);
        assertEquals("John", user.getFirstName());
    }
}
```

## Summary

Spring Cloud provides comprehensive tools for building resilient, scalable microservices architectures. Key patterns include service discovery, API gateways, circuit breakers, configuration management, and distributed tracing. Proper implementation of these patterns ensures robust cloud-native applications that can handle failures gracefully and scale effectively.
