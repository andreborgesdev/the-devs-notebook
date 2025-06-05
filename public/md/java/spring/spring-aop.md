# Spring AOP (Aspect-Oriented Programming)

Spring AOP enables separation of cross-cutting concerns like logging, security, and transaction management from business logic through aspects.

## Core Concepts

### Aspect

A module that encapsulates cross-cutting concerns.

### Join Point

A point during program execution where an aspect can be applied (method execution, exception handling, etc.).

### Pointcut

An expression that defines where advice should be applied.

### Advice

Action taken by an aspect at a particular join point.

### Weaving

The process of linking aspects with application code.

## Types of Advice

| Advice Type     | Description                                          | Annotation        |
| --------------- | ---------------------------------------------------- | ----------------- |
| Before          | Executes before join point                           | `@Before`         |
| After Returning | Executes after successful method execution           | `@AfterReturning` |
| After Throwing  | Executes when method throws exception                | `@AfterThrowing`  |
| After (Finally) | Executes after method execution (success or failure) | `@After`          |
| Around          | Surrounds join point execution                       | `@Around`         |

## Enabling AOP

### Configuration

```java
@Configuration
@EnableAspectJAutoProxy
public class AopConfig {
}
```

### Maven Dependency

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
```

## Creating Aspects

### Basic Aspect

```java
@Aspect
@Component
public class LoggingAspect {

    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);

    @Before("execution(* com.example.service.*.*(..))")
    public void logMethodEntry(JoinPoint joinPoint) {
        logger.info("Entering method: {} with arguments: {}",
            joinPoint.getSignature().getName(),
            Arrays.toString(joinPoint.getArgs()));
    }

    @AfterReturning(pointcut = "execution(* com.example.service.*.*(..))", returning = "result")
    public void logMethodExit(JoinPoint joinPoint, Object result) {
        logger.info("Exiting method: {} with result: {}",
            joinPoint.getSignature().getName(),
            result);
    }

    @AfterThrowing(pointcut = "execution(* com.example.service.*.*(..))", throwing = "exception")
    public void logException(JoinPoint joinPoint, Exception exception) {
        logger.error("Exception in method: {} with message: {}",
            joinPoint.getSignature().getName(),
            exception.getMessage());
    }
}
```

## Pointcut Expressions

### Execution Pointcuts

```java
@Component
@Aspect
public class PointcutExamples {

    // Any method in service package
    @Pointcut("execution(* com.example.service.*.*(..))")
    public void serviceLayer() {}

    // Methods returning User
    @Pointcut("execution(com.example.model.User com.example.service.*.*(..))")
    public void userReturningMethods() {}

    // Methods with specific parameter types
    @Pointcut("execution(* com.example.service.*.*(String, ..))")
    public void methodsWithStringFirstParam() {}

    // Methods with any number of parameters
    @Pointcut("execution(* com.example.service.*.*(..))")
    public void anyServiceMethod() {}

    // Specific method
    @Pointcut("execution(* com.example.service.UserService.findById(Long))")
    public void findByIdMethod() {}
}
```

### Annotation Pointcuts

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Auditable {
    String value() default "";
}

@Aspect
@Component
public class AuditAspect {

    @Around("@annotation(auditable)")
    public Object auditMethod(ProceedingJoinPoint joinPoint, Auditable auditable) throws Throwable {
        long startTime = System.currentTimeMillis();

        try {
            Object result = joinPoint.proceed();
            long endTime = System.currentTimeMillis();

            logger.info("Audit - Method: {}, Operation: {}, Duration: {}ms",
                joinPoint.getSignature().getName(),
                auditable.value(),
                endTime - startTime);

            return result;
        } catch (Exception e) {
            logger.error("Audit - Method: {}, Operation: {}, Error: {}",
                joinPoint.getSignature().getName(),
                auditable.value(),
                e.getMessage());
            throw e;
        }
    }
}
```

### Using Custom Annotations

```java
@Service
public class UserService {

    @Auditable("USER_CREATION")
    public User createUser(User user) {
        // Business logic
        return userRepository.save(user);
    }

    @Auditable("USER_RETRIEVAL")
    public User findById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException("User not found"));
    }
}
```

## Around Advice

### Performance Monitoring

```java
@Aspect
@Component
public class PerformanceAspect {

    @Around("@annotation(com.example.annotation.Timed)")
    public Object measureExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.nanoTime();

        try {
            Object result = joinPoint.proceed();
            long endTime = System.nanoTime();
            long duration = (endTime - startTime) / 1_000_000; // Convert to milliseconds

            logger.info("Method {} executed in {} ms",
                joinPoint.getSignature().getName(),
                duration);

            return result;
        } catch (Exception e) {
            logger.error("Method {} failed after {} ms",
                joinPoint.getSignature().getName(),
                (System.nanoTime() - startTime) / 1_000_000);
            throw e;
        }
    }
}

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Timed {
}
```

### Caching Aspect

```java
@Aspect
@Component
public class CachingAspect {

    private final Map<String, Object> cache = new ConcurrentHashMap<>();

    @Around("@annotation(cacheable)")
    public Object cacheMethod(ProceedingJoinPoint joinPoint, Cacheable cacheable) throws Throwable {
        String key = generateKey(joinPoint);

        if (cache.containsKey(key)) {
            logger.info("Cache hit for key: {}", key);
            return cache.get(key);
        }

        logger.info("Cache miss for key: {}", key);
        Object result = joinPoint.proceed();
        cache.put(key, result);

        return result;
    }

    private String generateKey(ProceedingJoinPoint joinPoint) {
        return joinPoint.getSignature().getName() +
               Arrays.toString(joinPoint.getArgs());
    }
}
```

## Security Aspects

### Authorization Aspect

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RequiresRole {
    String value();
}

@Aspect
@Component
public class SecurityAspect {

    @Before("@annotation(requiresRole)")
    public void checkAuthorization(JoinPoint joinPoint, RequiresRole requiresRole) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new SecurityException("User not authenticated");
        }

        boolean hasRole = authentication.getAuthorities().stream()
            .anyMatch(auth -> auth.getAuthority().equals("ROLE_" + requiresRole.value()));

        if (!hasRole) {
            throw new SecurityException("Insufficient privileges. Required role: " + requiresRole.value());
        }
    }
}
```

### Usage

```java
@Service
public class AdminService {

    @RequiresRole("ADMIN")
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    @RequiresRole("MANAGER")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
```

## Pointcut Combinations

### Complex Pointcuts

```java
@Aspect
@Component
public class ComplexPointcuts {

    @Pointcut("execution(* com.example.service.*.*(..))")
    public void serviceLayer() {}

    @Pointcut("execution(public * *(..))")
    public void publicMethods() {}

    @Pointcut("within(com.example.service..*)")
    public void inServicePackage() {}

    @Pointcut("@annotation(org.springframework.transaction.annotation.Transactional)")
    public void transactionalMethods() {}

    // Combine pointcuts
    @Before("serviceLayer() && publicMethods()")
    public void beforePublicServiceMethods() {
        logger.info("Executing public service method");
    }

    @Around("inServicePackage() && transactionalMethods()")
    public Object aroundTransactionalServiceMethods(ProceedingJoinPoint joinPoint) throws Throwable {
        logger.info("Starting transactional service method");
        Object result = joinPoint.proceed();
        logger.info("Completed transactional service method");
        return result;
    }
}
```

## Exception Handling Aspects

### Global Exception Logging

```java
@Aspect
@Component
public class ExceptionHandlingAspect {

    @AfterThrowing(pointcut = "execution(* com.example.service.*.*(..))", throwing = "exception")
    public void handleServiceException(JoinPoint joinPoint, Exception exception) {
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();

        logger.error("Exception in {}.{}: {}", className, methodName, exception.getMessage(), exception);

        // Additional handling based on exception type
        if (exception instanceof DataAccessException) {
            // Database-related exception handling
            notificationService.sendAlert("Database error in " + className + "." + methodName);
        } else if (exception instanceof SecurityException) {
            // Security-related exception handling
            auditService.logSecurityViolation(className, methodName, exception.getMessage());
        }
    }
}
```

## Validation Aspects

### Parameter Validation

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidateParams {
}

@Aspect
@Component
public class ValidationAspect {

    private final Validator validator;

    public ValidationAspect(Validator validator) {
        this.validator = validator;
    }

    @Before("@annotation(validateParams)")
    public void validateParameters(JoinPoint joinPoint, ValidateParams validateParams) {
        Object[] args = joinPoint.getArgs();

        for (Object arg : args) {
            if (arg != null) {
                Set<ConstraintViolation<Object>> violations = validator.validate(arg);

                if (!violations.isEmpty()) {
                    StringBuilder message = new StringBuilder("Validation failed: ");
                    for (ConstraintViolation<Object> violation : violations) {
                        message.append(violation.getPropertyPath())
                               .append(" ")
                               .append(violation.getMessage())
                               .append("; ");
                    }
                    throw new IllegalArgumentException(message.toString());
                }
            }
        }
    }
}
```

## Testing Aspects

### Unit Testing Aspects

```java
@ExtendWith(MockitoExtension.class)
class LoggingAspectTest {

    @Mock
    private Logger logger;

    @InjectMocks
    private LoggingAspect loggingAspect;

    @Test
    void shouldLogMethodEntry() {
        JoinPoint joinPoint = mock(JoinPoint.class);
        Signature signature = mock(Signature.class);

        when(joinPoint.getSignature()).thenReturn(signature);
        when(signature.getName()).thenReturn("testMethod");
        when(joinPoint.getArgs()).thenReturn(new Object[]{"arg1", "arg2"});

        loggingAspect.logMethodEntry(joinPoint);

        verify(logger).info(eq("Entering method: {} with arguments: {}"),
                           eq("testMethod"),
                           eq("[arg1, arg2]"));
    }
}
```

### Integration Testing with Aspects

```java
@SpringBootTest
@EnableAspectJAutoProxy
class AspectsIntegrationTest {

    @Autowired
    private UserService userService;

    @MockBean
    private UserRepository userRepository;

    @Test
    void shouldApplyLoggingAspect() {
        User user = new User("John", "Doe");
        when(userRepository.save(any(User.class))).thenReturn(user);

        // This will trigger the logging aspect
        User result = userService.createUser(user);

        assertNotNull(result);
        // Verify logging occurred (if using a test logger)
    }
}
```

## Best Practices

### Performance Considerations

- Use specific pointcuts to avoid unnecessary weaving
- Be careful with Around advice as it can impact performance
- Consider using compile-time weaving for better performance in production

### Design Guidelines

- Keep aspects focused on single concerns
- Use appropriate advice types for different scenarios
- Avoid complex logic in aspects
- Document pointcut expressions clearly

### Error Handling

- Handle exceptions in Around advice properly
- Don't swallow exceptions unless intended
- Log aspect-related errors appropriately

### Testing

- Write unit tests for aspect logic
- Test pointcut expressions thoroughly
- Use integration tests to verify aspect application

## Common Pitfalls

### Self-Invocation

```java
@Service
public class UserService {

    @Auditable
    public User createUser(User user) {
        // This won't trigger the aspect
        return this.saveUser(user);
    }

    @Auditable
    public User saveUser(User user) {
        return userRepository.save(user);
    }
}
```

### Solution: Use AspectJ or inject self-reference

```java
@Service
public class UserService {

    @Autowired
    private UserService self;

    @Auditable
    public User createUser(User user) {
        // This will trigger the aspect
        return self.saveUser(user);
    }

    @Auditable
    public User saveUser(User user) {
        return userRepository.save(user);
    }
}
```

## Summary

Spring AOP provides powerful capabilities for implementing cross-cutting concerns in a clean, modular way. Key benefits include separation of concerns, code reusability, and centralized handling of common functionalities like logging, security, and performance monitoring. Proper use of pointcuts, advice types, and best practices ensures maintainable and efficient aspect-oriented applications.
