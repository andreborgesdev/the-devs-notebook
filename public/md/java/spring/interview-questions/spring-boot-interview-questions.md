# Spring Boot Interview Questions

## What Is Spring Boot and How Does It Differ from Spring Framework?

Spring Boot is built on top of Spring Framework and provides:

- **Auto-configuration**: Automatically configures applications based on classpath
- **Starter dependencies**: Curated dependency sets for common use cases
- **Embedded servers**: No need for external server deployment
- **Production-ready features**: Metrics, health checks, monitoring
- **Opinionated defaults**: Sensible configuration out-of-the-box

## What Is @SpringBootApplication?

`@SpringBootApplication` is a meta-annotation combining:

```java
@SpringBootApplication
// Equivalent to:
@Configuration      // Marks class as configuration source
@EnableAutoConfiguration  // Enables Spring Boot auto-configuration
@ComponentScan     // Enables component scanning

public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

## How Does Spring Boot Auto-Configuration Work?

Auto-configuration uses conditional annotations to configure beans:

```java
@Configuration
@ConditionalOnClass(RedisTemplate.class)
@EnableConfigurationProperties(RedisProperties.class)
public class RedisAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean(RedisConnectionFactory.class)
    public RedisConnectionFactory redisConnectionFactory(RedisProperties properties) {
        return new JedisConnectionFactory(properties.getHost(), properties.getPort());
    }

    @Bean
    @ConditionalOnMissingBean(RedisTemplate.class)
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(factory);
        return template;
    }
}
```

## What Are the Key Advantages of Spring Boot?

Spring Boot simplifies Spring application development through:

- **Auto-configuration**: Automatically configures Spring based on classpath
- **Starter dependencies**: Pre-configured dependency sets
- **Embedded servers**: Built-in Tomcat, Jetty, or Undertow
- **Production-ready features**: Metrics, health checks, externalized configuration
- **No XML configuration**: Java-based or annotation-driven configuration

```java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

## What Are Spring Boot Starters?

Starters provide dependency management for specific features:

```xml
<!-- Web applications -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- JPA with Hibernate -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- Security -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

Starters are dependency descriptors that provide all necessary dependencies for specific functionality:

- **spring-boot-starter-web**: Web applications with Spring MVC
- **spring-boot-starter-data-jpa**: JPA with Hibernate
- **spring-boot-starter-security**: Spring Security
- **spring-boot-starter-test**: Testing with JUnit, Mockito, AssertJ
- **spring-boot-starter-actuator**: Production monitoring

## What Is application.properties vs application.yml?

Both configure Spring Boot applications:

**application.properties:**

```properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/mydb
spring.datasource.username=user
spring.datasource.password=password
logging.level.com.example=DEBUG
```

**application.yml:**

```yaml
server:
  port: 8080
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/mydb
    username: user
    password: password
logging:
  level:
    com.example: DEBUG
```

## How to Handle Different Environments in Spring Boot?

Use profiles for environment-specific configuration:

```yaml
# application.yml
spring:
  profiles:
    active: dev

---
spring:
  profiles: dev
  datasource:
    url: jdbc:h2:mem:testdb
server:
  port: 8080

---
spring:
  profiles: prod
  datasource:
    url: jdbc:mysql://prod-server:3306/mydb
server:
  port: 80
```

```java
@Component
@Profile("prod")
public class ProductionEmailService implements EmailService {
    // Production email implementation
}

@Component
@Profile("dev")
public class MockEmailService implements EmailService {
    // Mock email implementation for development
}
```

## What Is @ConfigurationProperties?

Binds external properties to strongly-typed configuration classes:

```java
@ConfigurationProperties(prefix = "app")
@Data
@Component
public class AppProperties {
    private String name;
    private String version;
    private Security security = new Security();
    private List<String> allowedOrigins = new ArrayList<>();

    @Data
    public static class Security {
        private boolean enabled = true;
        private String secretKey;
        private int tokenExpiration = 3600;
    }
}

# application.yml
app:
  name: MyApplication
  version: 1.0.0
  security:
    enabled: true
    secret-key: mySecretKey
    token-expiration: 7200
  allowed-origins:
    - http://localhost:3000
    - https://mydomain.com
```

## What Is Spring Boot DevTools?

DevTools provides development-time features:

- **Automatic restart**: Restarts application when classpath changes
- **Live reload**: Automatically refreshes browser
- **Property defaults**: Development-friendly default values
- **Remote debugging**: Debug applications running remotely

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
    <optional>true</optional>
</dependency>
```

## What Are Spring Boot Actuator Endpoints?

Actuator provides production-ready monitoring endpoints:

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,env,beans,loggers
  endpoint:
    health:
      show-details: always
    shutdown:
      enabled: true
```

Common endpoints:

- `/actuator/health` - Application health status
- `/actuator/info` - Application information
- `/actuator/metrics` - Application metrics
- `/actuator/env` - Environment properties
- `/actuator/beans` - Spring beans information
- `/actuator/loggers` - Logger configuration

## How to Create Custom Health Indicators?

```java
@Component
public class DatabaseHealthIndicator implements HealthIndicator {

    @Autowired
    private DataSource dataSource;

    @Override
    public Health health() {
        try (Connection connection = dataSource.getConnection()) {
            if (connection.isValid(2)) {
                return Health.up()
                        .withDetail("database", "Available")
                        .withDetail("validationQuery", "SELECT 1")
                        .build();
            }
        } catch (SQLException e) {
            return Health.down(e)
                    .withDetail("database", "Unavailable")
                    .build();
        }
        return Health.down()
                .withDetail("database", "Unknown")
                .build();
    }
}
```

## What Is @ConditionalOnProperty?

Conditionally creates beans based on property values:

```java
@Configuration
public class FeatureConfiguration {

    @Bean
    @ConditionalOnProperty(
        prefix = "feature",
        name = "caching",
        havingValue = "true",
        matchIfMissing = false
    )
    public CacheManager redisCacheManager() {
        return new RedisCacheManager(redisConnectionFactory());
    }

    @Bean
    @ConditionalOnProperty(
        prefix = "feature",
        name = "caching",
        havingValue = "false"
    )
    public CacheManager noOpCacheManager() {
        return new NoOpCacheManager();
    }
}

# application.yml
feature:
  caching: true
```

## How to Create Custom Auto-Configuration?

```java
@Configuration
@ConditionalOnClass(MyService.class)
@EnableConfigurationProperties(MyServiceProperties.class)
public class MyServiceAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean
    public MyService myService(MyServiceProperties properties) {
        return new MyService(properties.getUrl(), properties.getTimeout());
    }

    @Bean
    @ConditionalOnBean(MyService.class)
    @ConditionalOnProperty(prefix = "myservice", name = "health-check", havingValue = "true")
    public MyServiceHealthIndicator myServiceHealthIndicator(MyService myService) {
        return new MyServiceHealthIndicator(myService);
    }
}

@ConfigurationProperties(prefix = "myservice")
@Data
public class MyServiceProperties {
    private String url = "http://localhost:8080";
    private int timeout = 5000;
    private boolean healthCheck = true;
}

# META-INF/spring.factories
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
com.example.autoconfigure.MyServiceAutoConfiguration
```

## What Is the Difference Between @Component and @Bean?

- **@Component**: Marks a class for auto-detection and automatic instantiation
- **@Bean**: Explicitly declares a bean in configuration class

```java
@Component
public class UserService {
    // Spring automatically creates this bean
}

@Configuration
public class AppConfig {

    @Bean
    public RestTemplate restTemplate() {
        // Manually configure and return bean
        RestTemplate template = new RestTemplate();
        template.setRequestFactory(new HttpComponentsClientHttpRequestFactory());
        return template;
    }
}
```

## How to Handle Externalized Configuration?

Spring Boot supports various configuration sources in order of precedence:

1. Command line arguments
2. System properties
3. OS environment variables
4. Profile-specific properties
5. Application properties
6. Default properties

```java
@Service
public class ConfigurationService {

    @Value("${app.name:Default App}")
    private String appName;

    @Value("${server.port:8080}")
    private int serverPort;

    @Value("${feature.enabled:false}")
    private boolean featureEnabled;

    @Autowired
    private Environment environment;

    public String getDatabaseUrl() {
        return environment.getProperty("spring.datasource.url", "jdbc:h2:mem:testdb");
    }
}
```

## What Are Spring Boot Testing Annotations?

```java
@SpringBootTest
@TestPropertySource(locations = "classpath:test.properties")
class ApplicationTests {

    @Autowired
    private UserService userService;

    @Test
    void contextLoads() {
        assertThat(userService).isNotNull();
    }
}

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    void shouldReturnUser() throws Exception {
        when(userService.findById(1L)).thenReturn(new User("John"));

        mockMvc.perform(get("/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("John"));
    }
}

@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    @Test
    void shouldFindByEmail() {
        User user = new User("john@example.com", "John");
        entityManager.persistAndFlush(user);

        Optional<User> found = userRepository.findByEmail("john@example.com");
        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("John");
    }
}
```

## How to Create Executable JAR with Spring Boot?

Spring Boot Maven plugin creates executable JAR:

```xml
<plugin>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-maven-plugin</artifactId>
    <configuration>
        <mainClass>com.example.Application</mainClass>
    </configuration>
</plugin>
```

```bash
# Build executable JAR
mvn clean package

# Run the application
java -jar target/myapp-1.0.0.jar

# With system properties
java -Dspring.profiles.active=prod -jar target/myapp-1.0.0.jar
```

## What Is @SpringBootTest vs @WebMvcTest?

- **@SpringBootTest**: Loads complete application context, integration testing
- **@WebMvcTest**: Loads only web layer, unit testing controllers

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class IntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void shouldCreateUser() {
        User user = new User("John", "john@example.com");
        ResponseEntity<User> response = restTemplate.postForEntity("/users", user, User.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    }
}

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    void shouldReturnUsers() throws Exception {
        mockMvc.perform(get("/users"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }
}
```

## How Does Spring Boot Auto-Configuration Work in Detail?

Auto-configuration automatically configures Spring beans based on classpath content:

```java
@ConditionalOnClass(DataSource.class)
@ConditionalOnMissingBean(DataSource.class)
@EnableConfigurationProperties(DataSourceProperties.class)
public class DataSourceAutoConfiguration {

    @Bean
    @ConditionalOnProperty(prefix = "spring.datasource", name = "url")
    public DataSource dataSource(DataSourceProperties properties) {
        return properties.initializeDataSourceBuilder().build();
    }
}
```

## What Are Configuration Properties in Spring Boot?

`@ConfigurationProperties` binds external properties to Java objects:

```java
@ConfigurationProperties(prefix = "app")
@Data
public class AppProperties {
    private String name;
    private String version;
    private Database database = new Database();

    @Data
    public static class Database {
        private String url;
        private String username;
        private String password;
    }
}

# application.yml
app:
  name: MyApp
  version: 1.0.0
  database:
    url: jdbc:mysql://localhost:3306/mydb
    username: user
    password: password
```

## What Is Spring Boot Actuator and Its Key Features?

Actuator provides production-ready monitoring and management features:

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: always
```

Common endpoints:

- `/actuator/health`: Application health status
- `/actuator/info`: Application information
- `/actuator/metrics`: Application metrics
- `/actuator/env`: Environment properties
- `/actuator/beans`: Spring beans information
