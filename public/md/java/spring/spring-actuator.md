# Spring Actuator

Spring Boot Actuator provides production-ready features for monitoring and managing Spring Boot applications through HTTP endpoints and JMX.

## Getting Started

### Dependencies

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

### Basic Configuration

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics
  endpoint:
    health:
      show-details: always
```

## Built-in Endpoints

### Health Endpoint

Provides application health information.

```bash
GET /actuator/health
```

```json
{
  "status": "UP",
  "components": {
    "db": {
      "status": "UP",
      "details": {
        "database": "H2",
        "validationQuery": "isValid()"
      }
    },
    "diskSpace": {
      "status": "UP",
      "details": {
        "total": 250685575168,
        "free": 25068557516,
        "threshold": 10485760,
        "path": "/."
      }
    }
  }
}
```

### Info Endpoint

Displays application information.

```yaml
info:
  application:
    name: User Service
    version: 1.0.0
    description: RESTful User Management Service
  build:
    artifact: user-service
    version: ${project.version}
    time: ${maven.build.timestamp}
```

### Metrics Endpoint

Provides application metrics.

```bash
GET /actuator/metrics
GET /actuator/metrics/jvm.memory.used
GET /actuator/metrics/http.server.requests
```

### Environment Endpoint

Shows environment properties.

```bash
GET /actuator/env
GET /actuator/env/server.port
```

## Custom Health Indicators

### Simple Health Indicator

```java
@Component
public class DatabaseHealthIndicator implements HealthIndicator {

    private final DataSource dataSource;

    public DatabaseHealthIndicator(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public Health health() {
        try (Connection connection = dataSource.getConnection()) {
            if (connection.isValid(1)) {
                return Health.up()
                    .withDetail("database", "Available")
                    .withDetail("type", connection.getMetaData().getDatabaseProductName())
                    .build();
            }
        } catch (SQLException e) {
            return Health.down()
                .withDetail("database", "Unavailable")
                .withException(e)
                .build();
        }
        return Health.down().withDetail("database", "Connection invalid").build();
    }
}
```

### External Service Health Indicator

```java
@Component
public class ExternalApiHealthIndicator implements HealthIndicator {

    private final RestTemplate restTemplate;
    private final String externalApiUrl;

    public ExternalApiHealthIndicator(RestTemplate restTemplate,
                                    @Value("${external.api.url}") String externalApiUrl) {
        this.restTemplate = restTemplate;
        this.externalApiUrl = externalApiUrl;
    }

    @Override
    public Health health() {
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(
                externalApiUrl + "/health", String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                return Health.up()
                    .withDetail("external-api", "Available")
                    .withDetail("status", response.getStatusCode())
                    .build();
            } else {
                return Health.down()
                    .withDetail("external-api", "Unhealthy")
                    .withDetail("status", response.getStatusCode())
                    .build();
            }
        } catch (Exception e) {
            return Health.down()
                .withDetail("external-api", "Unavailable")
                .withException(e)
                .build();
        }
    }
}
```

### Reactive Health Indicator

```java
@Component
public class ReactiveHealthIndicator implements ReactiveHealthIndicator {

    private final WebClient webClient;

    public ReactiveHealthIndicator(WebClient webClient) {
        this.webClient = webClient;
    }

    @Override
    public Mono<Health> health() {
        return webClient.get()
            .uri("/api/status")
            .retrieve()
            .bodyToMono(String.class)
            .map(response -> Health.up()
                .withDetail("service", "Available")
                .withDetail("response", response)
                .build())
            .onErrorReturn(Health.down()
                .withDetail("service", "Unavailable")
                .build())
            .timeout(Duration.ofSeconds(5));
    }
}
```

## Custom Metrics

### Counter Metrics

```java
@Service
public class UserService {

    private final Counter userCreationCounter;
    private final Counter userDeletionCounter;

    public UserService(MeterRegistry meterRegistry) {
        this.userCreationCounter = Counter.builder("users.created")
            .description("Number of users created")
            .register(meterRegistry);

        this.userDeletionCounter = Counter.builder("users.deleted")
            .description("Number of users deleted")
            .register(meterRegistry);
    }

    public User createUser(User user) {
        User savedUser = userRepository.save(user);
        userCreationCounter.increment();
        return savedUser;
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
        userDeletionCounter.increment();
    }
}
```

### Timer Metrics

```java
@Service
public class PaymentService {

    private final Timer paymentProcessingTimer;

    public PaymentService(MeterRegistry meterRegistry) {
        this.paymentProcessingTimer = Timer.builder("payment.processing.time")
            .description("Payment processing time")
            .register(meterRegistry);
    }

    public PaymentResult processPayment(Payment payment) {
        return paymentProcessingTimer.recordCallable(() -> {
            // Payment processing logic
            return performPaymentProcessing(payment);
        });
    }

    @Timed(value = "payment.validation.time", description = "Payment validation time")
    public boolean validatePayment(Payment payment) {
        // Validation logic
        return true;
    }
}
```

### Gauge Metrics

```java
@Component
public class SystemMetrics {

    private final List<Order> activeOrders = new ArrayList<>();

    public SystemMetrics(MeterRegistry meterRegistry) {
        Gauge.builder("orders.active.count")
            .description("Number of active orders")
            .register(meterRegistry, this, SystemMetrics::getActiveOrdersCount);

        Gauge.builder("system.memory.usage")
            .description("System memory usage percentage")
            .register(meterRegistry, this, SystemMetrics::getMemoryUsagePercentage);
    }

    private double getActiveOrdersCount(SystemMetrics systemMetrics) {
        return activeOrders.size();
    }

    private double getMemoryUsagePercentage(SystemMetrics systemMetrics) {
        Runtime runtime = Runtime.getRuntime();
        long totalMemory = runtime.totalMemory();
        long freeMemory = runtime.freeMemory();
        return ((double) (totalMemory - freeMemory) / totalMemory) * 100;
    }
}
```

## Custom Endpoints

### Simple Custom Endpoint

```java
@Component
@Endpoint(id = "features")
public class FeaturesEndpoint {

    private final Map<String, Boolean> features = new HashMap<>();

    public FeaturesEndpoint() {
        features.put("user-registration", true);
        features.put("payment-processing", false);
        features.put("email-notifications", true);
    }

    @ReadOperation
    public Map<String, Boolean> getFeatures() {
        return features;
    }

    @ReadOperation
    public Boolean getFeature(@Selector String featureName) {
        return features.get(featureName);
    }

    @WriteOperation
    public void toggleFeature(@Selector String featureName) {
        features.computeIfPresent(featureName, (key, value) -> !value);
    }
}
```

### Web-Only Endpoint

```java
@Component
@WebEndpoint(id = "cache")
public class CacheEndpoint {

    private final CacheManager cacheManager;

    public CacheEndpoint(CacheManager cacheManager) {
        this.cacheManager = cacheManager;
    }

    @ReadOperation
    public Map<String, Object> getCacheInfo() {
        Map<String, Object> cacheInfo = new HashMap<>();

        cacheManager.getCacheNames().forEach(cacheName -> {
            Cache cache = cacheManager.getCache(cacheName);
            if (cache instanceof CaffeineCache) {
                com.github.benmanes.caffeine.cache.Cache<Object, Object> nativeCache =
                    ((CaffeineCache) cache).getNativeCache();

                cacheInfo.put(cacheName, Map.of(
                    "size", nativeCache.estimatedSize(),
                    "hitRate", nativeCache.stats().hitRate(),
                    "missRate", nativeCache.stats().missRate()
                ));
            }
        });

        return cacheInfo;
    }

    @WriteOperation
    public void clearCache(@Selector String cacheName) {
        Cache cache = cacheManager.getCache(cacheName);
        if (cache != null) {
            cache.clear();
        }
    }
}
```

## Info Contributors

### Custom Info Contributor

```java
@Component
public class BuildInfoContributor implements InfoContributor {

    @Override
    public void contribute(Info.Builder builder) {
        builder.withDetail("build", Map.of(
            "timestamp", Instant.now(),
            "version", getClass().getPackage().getImplementationVersion(),
            "java-version", System.getProperty("java.version"),
            "spring-boot-version", SpringBootVersion.getVersion()
        ));
    }
}
```

### Git Info Contributor

```java
@Component
public class GitInfoContributor implements InfoContributor {

    @Override
    public void contribute(Info.Builder builder) {
        try {
            Properties gitProperties = new Properties();
            gitProperties.load(getClass().getResourceAsStream("/git.properties"));

            builder.withDetail("git", Map.of(
                "branch", gitProperties.getProperty("git.branch"),
                "commit", Map.of(
                    "id", gitProperties.getProperty("git.commit.id.abbrev"),
                    "time", gitProperties.getProperty("git.commit.time")
                )
            ));
        } catch (Exception e) {
            builder.withDetail("git", "Information not available");
        }
    }
}
```

## Security Configuration

### Securing Actuator Endpoints

```java
@Configuration
@EnableWebSecurity
public class ActuatorSecurityConfig {

    @Bean
    public SecurityFilterChain actuatorFilterChain(HttpSecurity http) throws Exception {
        http.securityMatcher(EndpointRequest.toAnyEndpoint())
            .authorizeHttpRequests(authz -> authz
                .requestMatchers(EndpointRequest.to("health", "info")).permitAll()
                .requestMatchers(EndpointRequest.toAnyEndpoint()).hasRole("ADMIN")
            )
            .httpBasic(withDefaults());

        return http.build();
    }
}
```

### Custom Security for Endpoints

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,env
  endpoint:
    health:
      show-details: when-authorized
      roles: ADMIN
    env:
      show-values: when-authorized
      roles: ADMIN
```

## Production Configuration

### Comprehensive Production Setup

```yaml
management:
  endpoints:
    web:
      base-path: /manage
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: when-authorized
      probes:
        enabled: true
    info:
      enabled: true
    metrics:
      enabled: true
  health:
    livenessstate:
      enabled: true
    readinessstate:
      enabled: true
  metrics:
    tags:
      application: ${spring.application.name}
      environment: ${spring.profiles.active}
    export:
      prometheus:
        enabled: true
```

### Kubernetes Health Probes

```yaml
management:
  endpoint:
    health:
      probes:
        enabled: true
  health:
    livenessstate:
      enabled: true
    readinessstate:
      enabled: true
```

Kubernetes configuration:

```yaml
apiVersion: apps/v1
kind: Deployment
spec:
  template:
    spec:
      containers:
        - name: app
          livenessProbe:
            httpGet:
              path: /actuator/health/liveness
              port: 8080
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /actuator/health/readiness
              port: 8080
            initialDelaySeconds: 5
            periodSeconds: 5
```

## Monitoring Integration

### Prometheus Integration

```yaml
management:
  metrics:
    export:
      prometheus:
        enabled: true
    tags:
      application: user-service
      version: 1.0.0
```

### Micrometer Custom Metrics

```java
@Service
public class BusinessMetricsService {

    private final MeterRegistry meterRegistry;

    public BusinessMetricsService(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;
    }

    public void recordOrderValue(double orderValue, String region) {
        Timer.Sample sample = Timer.start(meterRegistry);

        // Business logic

        sample.stop(Timer.builder("order.processing.time")
            .tag("region", region)
            .register(meterRegistry));

        meterRegistry.counter("orders.completed", "region", region).increment();
        meterRegistry.gauge("order.value", Tags.of("region", region), orderValue);
    }
}
```

## Testing Actuator

### Testing Health Indicators

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ActuatorHealthTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void healthEndpointShouldReturnUp() {
        ResponseEntity<Map> response = restTemplate.getForEntity("/actuator/health", Map.class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("UP", response.getBody().get("status"));
    }

    @Test
    void customHealthIndicatorShouldBeIncluded() {
        ResponseEntity<Map> response = restTemplate.getForEntity("/actuator/health", Map.class);

        Map<String, Object> components = (Map<String, Object>) response.getBody().get("components");
        assertTrue(components.containsKey("database"));
    }
}
```

### Testing Custom Endpoints

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class CustomEndpointTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void featuresEndpointShouldReturnFeatures() {
        ResponseEntity<Map> response = restTemplate.getForEntity("/actuator/features", Map.class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().containsKey("user-registration"));
    }

    @Test
    void shouldToggleFeature() {
        restTemplate.postForEntity("/actuator/features/user-registration", null, Void.class);

        ResponseEntity<Boolean> response = restTemplate.getForEntity(
            "/actuator/features/user-registration", Boolean.class);

        assertFalse(response.getBody());
    }
}
```

## Best Practices

### Security

- Secure sensitive endpoints with authentication
- Use different ports for management endpoints in production
- Limit exposure of sensitive information
- Implement role-based access control

### Performance

- Be mindful of metrics collection overhead
- Use appropriate sampling rates for high-throughput applications
- Consider caching for expensive health checks
- Monitor the monitoring (meta-monitoring)

### Monitoring

- Implement meaningful health checks that reflect application health
- Use appropriate metric types (counter, gauge, timer, distribution summary)
- Add relevant tags to metrics for better observability
- Set up alerting based on health and metrics

### Documentation

- Document custom endpoints and their purpose
- Provide clear descriptions for custom metrics
- Document health check dependencies
- Maintain monitoring runbooks

## Summary

Spring Boot Actuator provides comprehensive production-ready features for monitoring and managing applications. Key capabilities include health monitoring, metrics collection, custom endpoints, and integration with monitoring systems. Proper configuration and security considerations ensure robust application observability in production environments.
