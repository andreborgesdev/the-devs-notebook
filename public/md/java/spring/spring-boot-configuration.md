# Spring Boot Configuration

Spring Boot's configuration system is designed for flexibility and ease of use, supporting multiple configuration sources with a clear precedence order.

## Configuration Sources Priority

Spring Boot loads configuration from multiple sources in this order (higher priority overrides lower):

| Priority | Source                    | Example                      |
| -------- | ------------------------- | ---------------------------- |
| 1        | Command line arguments    | `--server.port=8080`         |
| 2        | System properties         | `-Dserver.port=8080`         |
| 3        | Environment variables     | `SERVER_PORT=8080`           |
| 4        | Profile-specific files    | `application-prod.yml`       |
| 5        | Application configuration | `application.yml/properties` |
| 6        | Default properties        | Spring Boot defaults         |

## Application Properties vs YAML

### Properties Format

```properties
server.port=8080
server.servlet.context-path=/api

spring.datasource.url=jdbc:mysql://localhost:3306/mydb
spring.datasource.username=user
spring.datasource.password=password

logging.level.com.example=DEBUG
logging.file.name=app.log
```

### YAML Format

```yaml
server:
  port: 8080
  servlet:
    context-path: /api

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/mydb
    username: user
    password: password

logging:
  level:
    com.example: DEBUG
  file:
    name: app.log
```

## Profiles

Profiles allow environment-specific configurations:

### Activating Profiles

```bash
# Command line
java -jar app.jar --spring.profiles.active=prod

# Environment variable
export SPRING_PROFILES_ACTIVE=prod

# application.yml
spring:
  profiles:
    active: prod
```

### Profile-Specific Configuration Files

```
application.yml           # Common configuration
application-dev.yml       # Development profile
application-test.yml      # Test profile
application-prod.yml      # Production profile
```

### Profile-Specific Beans

```java
@Configuration
@Profile("dev")
public class DevConfiguration {

    @Bean
    public DataSource dataSource() {
        return new EmbeddedDatabaseBuilder()
            .setType(EmbeddedDatabaseType.H2)
            .build();
    }
}

@Configuration
@Profile("prod")
public class ProdConfiguration {

    @Bean
    public DataSource dataSource() {
        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setJdbcUrl("jdbc:mysql://prod-server:3306/mydb");
        return dataSource;
    }
}
```

## Configuration Properties Classes

### Creating Custom Configuration Properties

```java
@ConfigurationProperties(prefix = "app")
@Component
public class AppProperties {

    private String name;
    private String version;
    private Security security = new Security();

    public static class Security {
        private boolean enabled = true;
        private String secretKey;

        // getters and setters
    }

    // getters and setters
}
```

### Using in Application YAML

```yaml
app:
  name: My Application
  version: 1.0.0
  security:
    enabled: true
    secret-key: ${SECRET_KEY:default-secret}
```

### Injecting Configuration Properties

```java
@Service
public class UserService {

    private final AppProperties appProperties;

    public UserService(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    public void processUser() {
        if (appProperties.getSecurity().isEnabled()) {
            // Security processing
        }
    }
}
```

## External Configuration

### Environment Variables

```bash
# Replace dots with underscores and use uppercase
export SERVER_PORT=8080
export SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/mydb
```

### Configuration Files Location

Spring Boot searches for configuration files in this order:

1. `/config` subdirectory of current directory
2. Current directory
3. `config` package in classpath
4. Root of classpath

### External Configuration File

```bash
# Specify external config file
java -jar app.jar --spring.config.location=classpath:/custom.yml,/path/to/external.yml
```

## Common Configuration Examples

### Database Configuration

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/mydb
    username: ${DB_USERNAME:admin}
    password: ${DB_PASSWORD:secret}
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000

  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
```

### Logging Configuration

```yaml
logging:
  level:
    org.springframework.web: DEBUG
    com.example: INFO
    org.hibernate.SQL: DEBUG
  pattern:
    console: "%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n"
    file: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"
  file:
    name: logs/application.log
    max-size: 10MB
    max-history: 30
```

### Security Configuration

```yaml
spring:
  security:
    user:
      name: admin
      password: ${ADMIN_PASSWORD:admin123}
      roles: ADMIN

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics
  endpoint:
    health:
      show-details: when-authorized
```

## Configuration Validation

### Using Bean Validation

```java
@ConfigurationProperties(prefix = "app")
@Validated
@Component
public class AppProperties {

    @NotBlank
    private String name;

    @Min(1)
    @Max(65535)
    private int port;

    @Valid
    private Database database = new Database();

    public static class Database {
        @NotBlank
        private String url;

        @Min(1)
        @Max(100)
        private int maxConnections = 10;

        // getters and setters
    }

    // getters and setters
}
```

## Configuration Processing

### Custom Configuration Processor

```java
@ConfigurationPropertiesBinding
@Component
public class StringToListConverter implements Converter<String, List<String>> {

    @Override
    public List<String> convert(String source) {
        return Arrays.asList(source.split(","));
    }
}
```

### Configuration Metadata

Create `src/main/resources/META-INF/additional-spring-configuration-metadata.json`:

```json
{
  "properties": [
    {
      "name": "app.features",
      "type": "java.util.List<java.lang.String>",
      "description": "List of enabled features"
    }
  ]
}
```

## Best Practices

### Security Best Practices

- Never commit sensitive data to version control
- Use environment variables for secrets
- Use placeholder syntax with defaults: `${SECRET:default-value}`
- Consider using external secret management systems

### Configuration Organization

- Group related properties together
- Use meaningful property names
- Document custom properties
- Validate configuration at startup

### Environment-Specific Configuration

```yaml
spring:
  config:
    activate:
      on-profile: dev
  datasource:
    url: jdbc:h2:mem:testdb
---
spring:
  config:
    activate:
      on-profile: prod
  datasource:
    url: jdbc:postgresql://prod-server:5432/mydb
```

## Testing Configuration

### Testing with Profiles

```java
@SpringBootTest
@ActiveProfiles("test")
class UserServiceTest {

    @Test
    void testUserService() {
        // Test with test profile configuration
    }
}
```

### Testing with Custom Properties

```java
@SpringBootTest(properties = {
    "app.feature.enabled=true",
    "app.max-users=100"
})
class ConfigurationTest {

    @Autowired
    private AppProperties appProperties;

    @Test
    void testConfiguration() {
        assertTrue(appProperties.getFeature().isEnabled());
        assertEquals(100, appProperties.getMaxUsers());
    }
}
```

## Configuration Tips

### Performance Optimization

- Use connection pooling for databases
- Configure appropriate timeouts
- Set reasonable cache sizes
- Monitor memory usage with appropriate heap settings

### Debugging Configuration

```bash
# Enable configuration debug logging
--debug

# Show all configuration properties
--trace
```

### Configuration Documentation

- Document all custom properties
- Provide examples in README
- Use meaningful property names
- Group related properties with common prefixes

## Summary

| Concept             | Best Practice                         |
| ------------------- | ------------------------------------- |
| **File Format**     | Prefer YAML for readability           |
| **Profiles**        | Use for environment-specific config   |
| **Externalization** | Keep secrets in environment variables |
| **Validation**      | Validate configuration at startup     |
| **Organization**    | Group related properties together     |
| **Security**        | Never commit sensitive data           |

Spring Boot's configuration system provides flexibility while maintaining convention over configuration principles. Proper configuration management is crucial for maintainable applications across different environments.
