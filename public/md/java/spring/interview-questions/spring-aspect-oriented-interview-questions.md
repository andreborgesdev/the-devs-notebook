# Spring Aspect-Oriented Programming

## What Is Aspect-Oriented Programming (AOP)?

_Aspects_ enable the modularization of cross-cutting concerns such as transaction management that span multiple types and objects by adding extra behavior to already existing code without modifying affected classes.

Essentially, **it is a way for adding behavior to existing code without modifying that code**.

Here is an example of [aspect-based execution time logging](https://www.baeldung.com/spring-aop-annotation).

## What Are Aspect, Advice, Pointcut and JoinPoint in AOP?

- **Aspect** – a class that implements cross-cutting concerns, such as transaction management.
- **Advice** – the methods that get executed when a specific _JoinPoint_ with matching _Pointcut_ is reached in the application. [More on Advice](https://www.baeldung.com/spring-aop-advice-tutorial).
- **Pointcut** – a set of regular expressions that are matched with _JoinPoint_ to determine whether _Advice_ needs to be executed or not. [More on Pointcut](https://www.baeldung.com/spring-aop-pointcut-tutorial).
- **JoinPoint** – a point during the execution of a program, such as the execution of a method or the handling of an exception.

## What Is Weaving?

According to the [official docs](https://docs.spring.io/spring/docs/current/spring-framework-reference/html/aop.html), _weaving_ is a process that links aspects with other application types or objects to create an advised object. This can be done at compile time, load time, or runtime. Spring AOP, like other pure Java AOP frameworks, performs _weaving_ at runtime.

## What Are the Different Types of Advice?

- **@Before**: Executes before method execution
- **@After**: Executes after method execution (finally block)
- **@AfterReturning**: Executes after successful method execution
- **@AfterThrowing**: Executes when method throws exception
- **@Around**: Surrounds method execution, most powerful advice

```java
@Aspect
@Component
public class LoggingAspect {

    @Before("execution(* com.example.service.*.*(..))")
    public void logBefore(JoinPoint joinPoint) {
        log.info("Executing method: {}", joinPoint.getSignature().getName());
    }

    @AfterReturning(pointcut = "execution(* com.example.service.*.*(..))", returning = "result")
    public void logAfterReturning(JoinPoint joinPoint, Object result) {
        log.info("Method {} returned: {}", joinPoint.getSignature().getName(), result);
    }

    @Around("execution(* com.example.service.*.*(..))")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
        Object result = joinPoint.proceed();
        long endTime = System.currentTimeMillis();
        log.info("Method {} executed in {} ms",
                joinPoint.getSignature().getName(), (endTime - startTime));
        return result;
    }
}
```

## What Are Pointcut Expressions?

Pointcut expressions define where advice should be applied:

```java
@Aspect
@Component
public class SecurityAspect {

    // All methods in service package
    @Pointcut("execution(* com.example.service.*.*(..))")
    public void serviceLayer() {}

    // All methods with @Secured annotation
    @Pointcut("@annotation(com.example.annotation.Secured)")
    public void securedMethods() {}

    // All public methods
    @Pointcut("execution(public * *(..))")
    public void publicMethods() {}

    // Combine pointcuts
    @Before("serviceLayer() && securedMethods()")
    public void checkSecurity(JoinPoint joinPoint) {
        // Security check logic
    }
}
```

## What Is the Difference Between JDK Dynamic Proxy and CGLIB?

**JDK Dynamic Proxy:**

- Used when target implements interfaces
- Creates proxy by implementing same interfaces
- Faster proxy creation

**CGLIB:**

- Used when target doesn't implement interfaces
- Creates proxy by extending target class
- Cannot proxy final classes or methods
- Slower proxy creation, faster method invocation

```java
@Configuration
@EnableAspectJAutoProxy(proxyTargetClass = true) // Force CGLIB
public class AopConfig {
}
```

## What Are the Limitations of Spring AOP?

- Only works with Spring-managed beans
- Cannot intercept private methods
- Cannot intercept static methods
- Cannot intercept final methods (CGLIB)
- Self-invocation doesn't trigger advice
- Runtime weaving only (no compile-time optimization)

## How to Handle Self-Invocation in AOP?

Self-invocation bypasses proxy, so advice won't execute:

```java
@Service
public class UserService {

    @Autowired
    private ApplicationContext applicationContext;

    public void createUser(User user) {
        // This won't trigger advice
        validateUser(user);

        // Solution: Get proxy reference
        UserService proxy = applicationContext.getBean(UserService.class);
        proxy.validateUser(user);
    }

    @Validated
    public void validateUser(User user) {
        // Validation logic
    }
}
```

## What Is @EnableAspectJAutoProxy?

`@EnableAspectJAutoProxy` enables AspectJ auto-proxy functionality:

```java
@Configuration
@EnableAspectJAutoProxy(
    proxyTargetClass = true,  // Use CGLIB instead of JDK proxy
    exposeProxy = true        // Expose proxy via AopContext
)
public class AopConfig {
}
```

## How to Create Custom Annotations for AOP?

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Cacheable {
    String value() default "";
    int expireAfterWrite() default 3600;
}

@Aspect
@Component
public class CacheAspect {

    @Around("@annotation(cacheable)")
    public Object cache(ProceedingJoinPoint joinPoint, Cacheable cacheable) throws Throwable {
        String key = generateKey(joinPoint, cacheable.value());

        Object cachedResult = cacheManager.get(key);
        if (cachedResult != null) {
            return cachedResult;
        }

        Object result = joinPoint.proceed();
        cacheManager.put(key, result, cacheable.expireAfterWrite());
        return result;
    }
}

@Service
public class UserService {

    @Cacheable(value = "users", expireAfterWrite = 1800)
    public User findById(Long id) {
        return userRepository.findById(id);
    }
}
```

## What Is AspectJ vs Spring AOP?

**Spring AOP:**

- Proxy-based (JDK Dynamic Proxy or CGLIB)
- Runtime weaving only
- Spring-managed beans only
- Method-level interception only
- Simpler configuration

**AspectJ:**

- Bytecode weaving (compile-time, post-compile, load-time)
- Works with any Java object
- Field, constructor, method interception
- More powerful but complex
- Better performance

## How to Use AOP for Audit Logging?

```java
@Aspect
@Component
public class AuditAspect {

    @Autowired
    private AuditService auditService;

    @AfterReturning(
        pointcut = "@annotation(auditable)",
        returning = "result"
    )
    public void auditMethod(JoinPoint joinPoint, Auditable auditable, Object result) {
        String methodName = joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();
        String user = SecurityContextHolder.getContext().getAuthentication().getName();

        AuditLog auditLog = AuditLog.builder()
            .action(auditable.action())
            .methodName(methodName)
            .arguments(Arrays.toString(args))
            .result(result.toString())
            .user(user)
            .timestamp(LocalDateTime.now())
            .build();

        auditService.save(auditLog);
    }
}

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Auditable {
    String action();
}

@Service
public class UserService {

    @Auditable(action = "CREATE_USER")
    public User createUser(User user) {
        return userRepository.save(user);
    }

    @Auditable(action = "DELETE_USER")
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
```
