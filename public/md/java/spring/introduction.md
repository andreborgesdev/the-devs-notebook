# Spring Framework

**Spring** is a powerful, feature-rich framework for building Java applications. It simplifies enterprise application development by providing infrastructure support such as dependency injection, data access, transaction management, and more.

Spring promotes **loose coupling** through dependency injection and aspect-oriented programming, making applications easier to test, maintain, and scale.

## Key Features

| Feature                               | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| **Dependency Injection (DI)**         | Manage object creation and wiring                            |
| **Aspect-Oriented Programming (AOP)** | Modularize cross-cutting concerns like logging, transactions |
| **Spring Boot**                       | Simplifies Spring app setup with auto-configuration          |
| **Spring Data**                       | Simplified data access and repository support                |
| **Spring MVC**                        | Build web applications with REST APIs and templating         |
| **Spring Security**                   | Authentication and authorization support                     |
| **Spring Cloud**                      | Tools for microservices architecture                         |

## Core Concept: Dependency Injection (DI)

At its heart, Spring uses **Dependency Injection (DI)** to manage application components (beans). Instead of creating objects manually, Spring creates and wires dependencies automatically.

```java showLineNumbers
@Component
public class UserService {

@Autowired
private UserRepository userRepository;

// UserRepository is injected automatically by Spring

}
```

**Common annotations:**

| Annotation        | Purpose                                                 |
| ----------------- | ------------------------------------------------------- |
| `@Component`      | Marks a Java class as a Spring bean                     |
| `@Service`        | Specialization of `@Component` for service classes      |
| `@Repository`     | Specialization for DAO classes, adds exception handling |
| `@Controller`     | Marks a controller for Spring MVC                       |
| `@RestController` | `@Controller` + `@ResponseBody` for REST APIs           |
| `@Autowired`      | Injects dependencies automatically                      |
| `@Qualifier`      | Specifies which bean to inject when multiple exist      |
| `@Primary`        | Marks a bean as preferred for autowiring                |

## Bean Scopes

| Scope         | Description                                     |
| ------------- | ----------------------------------------------- |
| `singleton`   | One shared instance (default)                   |
| `prototype`   | New instance every time it’s requested          |
| `request`     | One instance per HTTP request (web apps only)   |
| `session`     | One instance per HTTP session (web apps only)   |
| `application` | One instance per ServletContext (web apps only) |
| `websocket`   | One instance per WebSocket                      |

## Spring Boot Essentials

Spring Boot **simplifies application setup** by offering:

- Auto-configuration
- Embedded servers (Tomcat, Jetty)
- Minimal configuration (`application.properties` or `application.yml`)
- Dependency management via **Spring Boot Starters**

Example:

```java showLineNumbers
@SpringBootApplication
public class MyApp {
public static void main(String\[] args) {
SpringApplication.run(MyApp.class, args);
}
}
```

## Dependency Management

**Direct dependencies**: Explicitly declared in `pom.xml` or `build.gradle`.

```xml <dependency> <groupId>org.springframework.boot</groupId> <artifactId>spring-boot-starter-web</artifactId> </dependency>

```

**Transitive dependencies**: Automatically included by direct dependencies.
View them using:

```bash
mvn dependency\:tree
```

**Tip**: Use _optional_ or _provided_ scopes carefully to avoid dependency bloat.

## Spring Data & Repositories

```java showLineNumbers
public interface UserRepository extends JpaRepository\<User, Long> {
List<User> findByLastName(String lastName);
}
```

Spring Data auto-generates the necessary queries based on method names!

## Spring MVC - REST Controller Example

```java showLineNumbers
@RestController
@RequestMapping("/api/users")
public class UserController {

@Autowired
private UserService userService;

@GetMapping("/{id}")
public User getUser(@PathVariable Long id) {
return userService.findById(id);
}

}
```

## Testing in Spring

**Key Annotations:**

| Annotation        | Purpose                                                      |
| ----------------- | ------------------------------------------------------------ |
| `@SpringBootTest` | Load the full application context                            |
| `@WebMvcTest`     | Test only MVC components                                     |
| `@MockBean`       | Mock a bean for testing without calling real implementations |

Example:

```java showLineNumbers
@SpringBootTest
public class UserServiceTest {

@MockBean
private UserRepository userRepository;

@Autowired
private UserService userService;

@Test
void testFindUser() {
    // Test logic here
}

}
```

## Common Mistakes

- **Forgetting bean scope**: Misuse of prototype/singleton can lead to unexpected behavior.
- **Mixing constructor and field injection**: Prefer constructor injection for immutability and testability.
- **Ignoring transitive dependencies**: Unintentional versions may cause runtime issues.
- **Circular dependencies**: Can occur if beans depend on each other improperly.

## When to Use Spring

- **Enterprise applications**: Large, scalable apps with many components.
- **Microservices**: Use Spring Boot + Spring Cloud for distributed systems.
- **Web development**: REST APIs or server-side rendered web apps.
- **Data access**: Simplify persistence using Spring Data and repositories.

## Summary Cheatsheet

| Concept                   | Best Practice                                            |
| ------------------------- | -------------------------------------------------------- |
| DI                        | Use constructor injection where possible                 |
| Bean scopes               | Default to singleton unless necessary                    |
| Testing                   | Use `@MockBean` to avoid real dependency calls           |
| Spring Boot configuration | Use `application.yml` for clean configs                  |
| Dependency management     | Keep `pom.xml` clean; watch for transitive deps          |
| Layer separation          | Controller → Service → Repository for clear architecture |

**Pro Tip:**
Mastering Spring means understanding **dependency management**, **DI**, and keeping your beans **loosely coupled**. Always be mindful of bean scopes and prefer immutability.
