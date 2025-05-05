# Creating Libraries in Java

Creating a Java library allows you to package and share common code across multiple projects efficiently.

## Using Spring to Create a Library

When building a library with **Spring**, keep the following in mind:

- **Remove the main application class**  
  Delete any `@SpringBootApplication` annotated class. A library should not define an application entry point.

- **Prefer `@Bean` over `@Service`**  
  Define beans explicitly in configuration classes rather than using `@Service`.  
  This avoids accidental application context scanning and potential conflicts when the library is consumed.

```java
@Configuration
public class MyLibraryConfig {
@Bean
public MyService myService() {
return new MyService();
}
}
```

If you use `@Service` and the consuming application scans for components, you might expose unwanted classes or cause bean registration issues.

## Structuring the Library

- Keep packages well-structured and avoid leaking internal classes.
- Expose only the necessary classes as `public`.
- Use JavaDocs to document the public API.

## Maven Considerations

### Direct vs Transitive Dependencies

- **Direct dependencies**:  
  Explicitly declared in your library’s `pom.xml`.

```xml
<dependency>
<groupId>org.apache.commons</groupId>
<artifactId>commons-lang3</artifactId>
<version>3.12.0</version>
</dependency>
```

- **Transitive dependencies**:  
  Automatically included when your direct dependencies rely on other libraries. You can inspect them using:

```
mvn dependency:tree
```

### Optional Dependencies

Sometimes, you might want to expose an optional dependency that the consuming project can choose to include:

```xml
<dependency>
<groupId>com.example</groupId>
<artifactId>optional-lib</artifactId>
<version>1.0</version>
<optional>true</optional>
</dependency>
```

### Dependency Scopes

Use appropriate scopes for dependencies:

| Scope      | Description                                                                      |
| ---------- | -------------------------------------------------------------------------------- |
| `compile`  | Available at compile-time and runtime. Default scope.                            |
| `provided` | Required for compilation but expected to be provided by the runtime environment. |
| `runtime`  | Not needed for compilation but required during execution.                        |
| `test`     | Used only for testing purposes.                                                  |

## Testing Your Library

- Write **unit tests** for your public APIs.
- Use **integration tests** to validate how the library interacts with real-world scenarios.
- If using Spring, consider writing tests using `@SpringBootTest` or context slices.

## Publishing Your Library

Once the library is ready:

- Package it as a `.jar`.
- Deploy to:
  - **Internal repositories** like Nexus or Artifactory.
  - **Public repositories** like Maven Central or JCenter (if open source).

## Useful Links

- [Baeldung: Maven Optional Dependency](https://www.baeldung.com/maven-optional-dependency)
- [Baeldung: Maven Dependency Scopes](https://www.baeldung.com/maven-dependency-scopes)
