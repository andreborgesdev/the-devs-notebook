# Spring Validation

Spring provides comprehensive validation support through Bean Validation (JSR-303/JSR-380) and custom validation mechanisms for ensuring data integrity and business rule compliance.

## Bean Validation Basics

### Dependencies

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

### Basic Annotations

| Annotation  | Description                                | Example                                   |
| ----------- | ------------------------------------------ | ----------------------------------------- |
| `@NotNull`  | Field cannot be null                       | `@NotNull String name`                    |
| `@NotEmpty` | Field cannot be null or empty              | `@NotEmpty String email`                  |
| `@NotBlank` | Field cannot be null, empty, or whitespace | `@NotBlank String password`               |
| `@Size`     | String/Collection size constraints         | `@Size(min=2, max=50) String name`        |
| `@Min/@Max` | Numeric minimum/maximum values             | `@Min(18) int age`                        |
| `@Email`    | Valid email format                         | `@Email String email`                     |
| `@Pattern`  | Regular expression validation              | `@Pattern(regexp="\\d{10}") String phone` |

## Model Validation

### Basic Entity Validation

```java
public class User {

    @NotNull(message = "ID cannot be null")
    private Long id;

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
    private String name;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    @Min(value = 18, message = "Age must be at least 18")
    @Max(value = 120, message = "Age must be less than 120")
    private Integer age;

    @Pattern(regexp = "\\d{10}", message = "Phone number must be 10 digits")
    private String phoneNumber;

    @Past(message = "Birth date must be in the past")
    private LocalDate birthDate;

    @Future(message = "Registration date must be in the future")
    private LocalDateTime registrationDate;
}
```

### Nested Object Validation

```java
public class Address {

    @NotBlank(message = "Street is required")
    private String street;

    @NotBlank(message = "City is required")
    private String city;

    @Pattern(regexp = "\\d{5}", message = "ZIP code must be 5 digits")
    private String zipCode;
}

public class User {

    @NotBlank(message = "Name is required")
    private String name;

    @Valid
    @NotNull(message = "Address is required")
    private Address address;

    @Valid
    private List<@Valid PhoneNumber> phoneNumbers;
}
```

## Controller Validation

### Request Body Validation

```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    @PostMapping
    public ResponseEntity<User> createUser(@Valid @RequestBody User user) {
        User savedUser = userService.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody User user) {
        User updatedUser = userService.update(id, user);
        return ResponseEntity.ok(updatedUser);
    }
}
```

### Path Variable Validation

```java
@RestController
@RequestMapping("/api/users")
@Validated
public class UserController {

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(
            @PathVariable @Min(value = 1, message = "ID must be positive") Long id) {
        User user = userService.findById(id);
        return ResponseEntity.ok(user);
    }

    @GetMapping
    public ResponseEntity<List<User>> getUsers(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size) {
        List<User> users = userService.findAll(page, size);
        return ResponseEntity.ok(users);
    }
}
```

## Validation Groups

### Defining Validation Groups

```java
public interface CreateGroup {}
public interface UpdateGroup {}

public class User {

    @NotNull(groups = UpdateGroup.class, message = "ID is required for updates")
    private Long id;

    @NotBlank(groups = {CreateGroup.class, UpdateGroup.class}, message = "Name is required")
    @Size(min = 2, max = 50, groups = {CreateGroup.class, UpdateGroup.class})
    private String name;

    @Email(groups = {CreateGroup.class, UpdateGroup.class})
    @NotBlank(groups = CreateGroup.class, message = "Email is required for new users")
    private String email;

    @NotBlank(groups = CreateGroup.class, message = "Password is required for new users")
    @Size(min = 8, groups = CreateGroup.class, message = "Password must be at least 8 characters")
    private String password;
}
```

### Using Validation Groups

```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    @PostMapping
    public ResponseEntity<User> createUser(
            @Validated(CreateGroup.class) @RequestBody User user) {
        User savedUser = userService.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @Validated(UpdateGroup.class) @RequestBody User user) {
        User updatedUser = userService.update(id, user);
        return ResponseEntity.ok(updatedUser);
    }
}
```

## Custom Validators

### Simple Custom Validator

```java
@Target({ElementType.FIELD, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = UniqueEmailValidator.class)
public @interface UniqueEmail {
    String message() default "Email already exists";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

@Component
public class UniqueEmailValidator implements ConstraintValidator<UniqueEmail, String> {

    private final UserRepository userRepository;

    public UniqueEmailValidator(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public boolean isValid(String email, ConstraintValidatorContext context) {
        if (email == null) {
            return true; // Let @NotNull handle null values
        }
        return !userRepository.existsByEmail(email);
    }
}
```

### Complex Custom Validator

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = PasswordMatchValidator.class)
public @interface PasswordMatch {
    String message() default "Passwords do not match";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};

    String password();
    String confirmPassword();
}

public class PasswordMatchValidator implements ConstraintValidator<PasswordMatch, Object> {

    private String passwordField;
    private String confirmPasswordField;

    @Override
    public void initialize(PasswordMatch annotation) {
        this.passwordField = annotation.password();
        this.confirmPasswordField = annotation.confirmPassword();
    }

    @Override
    public boolean isValid(Object object, ConstraintValidatorContext context) {
        try {
            Object password = getFieldValue(object, passwordField);
            Object confirmPassword = getFieldValue(object, confirmPasswordField);

            return Objects.equals(password, confirmPassword);
        } catch (Exception e) {
            return false;
        }
    }

    private Object getFieldValue(Object object, String fieldName) throws Exception {
        Field field = object.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        return field.get(object);
    }
}
```

### Using Custom Validators

```java
@PasswordMatch(password = "password", confirmPassword = "confirmPassword")
public class UserRegistrationRequest {

    @NotBlank
    private String name;

    @UniqueEmail
    @Email
    private String email;

    @NotBlank
    @Size(min = 8)
    private String password;

    @NotBlank
    private String confirmPassword;
}
```

## Service Layer Validation

### Method-Level Validation

```java
@Service
@Validated
public class UserService {

    public User createUser(@Valid User user) {
        return userRepository.save(user);
    }

    public User findById(@NotNull @Min(1) Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException("User not found"));
    }

    public List<User> findByAgeRange(
            @Min(value = 0, message = "Minimum age cannot be negative") Integer minAge,
            @Max(value = 150, message = "Maximum age cannot exceed 150") Integer maxAge) {

        if (minAge != null && maxAge != null && minAge > maxAge) {
            throw new IllegalArgumentException("Minimum age cannot be greater than maximum age");
        }

        return userRepository.findByAgeBetween(minAge, maxAge);
    }
}
```

### Programmatic Validation

```java
@Service
public class ValidationService {

    private final Validator validator;

    public ValidationService(Validator validator) {
        this.validator = validator;
    }

    public void validateUser(User user) {
        Set<ConstraintViolation<User>> violations = validator.validate(user);

        if (!violations.isEmpty()) {
            StringBuilder message = new StringBuilder("Validation failed: ");
            for (ConstraintViolation<User> violation : violations) {
                message.append(violation.getPropertyPath())
                       .append(" ")
                       .append(violation.getMessage())
                       .append("; ");
            }
            throw new ValidationException(message.toString());
        }
    }

    public void validateUserForGroup(User user, Class<?> group) {
        Set<ConstraintViolation<User>> violations = validator.validate(user, group);

        if (!violations.isEmpty()) {
            throw new ValidationException("Validation failed for group: " + group.getSimpleName());
        }
    }
}
```

## Error Handling

### Global Exception Handler

```java
@ControllerAdvice
public class ValidationExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
            errors.put(error.getField(), error.getDefaultMessage()));

        ErrorResponse errorResponse = new ErrorResponse(
            "Validation failed",
            errors
        );

        return ResponseEntity.badRequest().body(errorResponse);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolation(
            ConstraintViolationException ex) {

        Map<String, String> errors = new HashMap<>();
        ex.getConstraintViolations().forEach(violation ->
            errors.put(violation.getPropertyPath().toString(), violation.getMessage()));

        ErrorResponse errorResponse = new ErrorResponse(
            "Constraint violation",
            errors
        );

        return ResponseEntity.badRequest().body(errorResponse);
    }
}

public class ErrorResponse {
    private String message;
    private Map<String, String> errors;
    private LocalDateTime timestamp;

    public ErrorResponse(String message, Map<String, String> errors) {
        this.message = message;
        this.errors = errors;
        this.timestamp = LocalDateTime.now();
    }
}
```

## Advanced Validation Scenarios

### Conditional Validation

```java
public class ConditionalValidationExample {

    @NotNull
    private String type;

    @NotBlank
    @ConditionalValidation(dependsOn = "type", values = {"PERSONAL"},
                          message = "SSN is required for personal accounts")
    private String ssn;

    @NotBlank
    @ConditionalValidation(dependsOn = "type", values = {"BUSINESS"},
                          message = "Tax ID is required for business accounts")
    private String taxId;
}

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ConditionalValidator.class)
public @interface ConditionalValidation {
    String message() default "Conditional validation failed";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};

    String dependsOn();
    String[] values();
}
```

### Cross-Field Validation

```java
@DateRange(start = "startDate", end = "endDate")
public class Event {

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;

    @NotBlank
    private String name;
}

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = DateRangeValidator.class)
public @interface DateRange {
    String message() default "End date must be after start date";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};

    String start();
    String end();
}
```

## Testing Validation

### Unit Testing Validators

```java
class UserValidationTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void shouldValidateValidUser() {
        User user = new User();
        user.setName("John Doe");
        user.setEmail("john@example.com");
        user.setAge(25);

        Set<ConstraintViolation<User>> violations = validator.validate(user);

        assertTrue(violations.isEmpty());
    }

    @Test
    void shouldFailValidationForInvalidEmail() {
        User user = new User();
        user.setName("John Doe");
        user.setEmail("invalid-email");
        user.setAge(25);

        Set<ConstraintViolation<User>> violations = validator.validate(user);

        assertEquals(1, violations.size());
        assertEquals("Invalid email format", violations.iterator().next().getMessage());
    }

    @Test
    void shouldValidateWithGroups() {
        User user = new User();
        user.setName("John Doe");
        // Missing email for create group

        Set<ConstraintViolation<User>> violations = validator.validate(user, CreateGroup.class);

        assertFalse(violations.isEmpty());
        assertTrue(violations.stream()
            .anyMatch(v -> v.getMessage().contains("Email is required")));
    }
}
```

### Integration Testing

```java
@SpringBootTest
@AutoConfigureTestDatabase
class UserControllerValidationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void shouldReturnValidationErrorForInvalidUser() {
        User invalidUser = new User();
        invalidUser.setName(""); // Invalid name
        invalidUser.setEmail("invalid-email"); // Invalid email

        ResponseEntity<ErrorResponse> response = restTemplate.postForEntity(
            "/api/users", invalidUser, ErrorResponse.class);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().getErrors().containsKey("name"));
        assertTrue(response.getBody().getErrors().containsKey("email"));
    }
}
```

## Configuration

### Custom Validation Configuration

```java
@Configuration
public class ValidationConfig {

    @Bean
    public LocalValidatorFactoryBean validator() {
        LocalValidatorFactoryBean validatorFactory = new LocalValidatorFactoryBean();
        validatorFactory.setValidationMessageSource(messageSource());
        return validatorFactory;
    }

    @Bean
    public MessageSource messageSource() {
        ReloadableResourceBundleMessageSource messageSource =
            new ReloadableResourceBundleMessageSource();
        messageSource.setBasename("classpath:validation-messages");
        messageSource.setDefaultEncoding("UTF-8");
        return messageSource;
    }

    @Bean
    public MethodValidationPostProcessor methodValidationPostProcessor() {
        MethodValidationPostProcessor processor = new MethodValidationPostProcessor();
        processor.setValidator(validator());
        return processor;
    }
}
```

### Custom Messages

```properties
# validation-messages.properties
user.name.required=Name is required and cannot be empty
user.email.invalid=Please provide a valid email address
user.age.range=Age must be between {min} and {max}
user.password.weak=Password must contain at least 8 characters with numbers and symbols
```

## Best Practices

### Validation Design

- Use appropriate validation annotations for different data types
- Implement custom validators for business-specific rules
- Use validation groups for different scenarios
- Keep validation logic separate from business logic

### Performance

- Avoid expensive operations in validators
- Cache validation results when appropriate
- Use validation groups to avoid unnecessary validations
- Consider async validation for external dependencies

### Error Handling

- Provide clear, user-friendly error messages
- Use internationalization for error messages
- Return comprehensive validation errors
- Log validation failures for monitoring

### Testing

- Write unit tests for custom validators
- Test validation scenarios in integration tests
- Verify error messages and structure
- Test validation groups and conditional logic

## Summary

Spring Validation provides comprehensive support for data validation through Bean Validation annotations, custom validators, and flexible configuration options. Proper validation ensures data integrity, improves user experience, and maintains application reliability. Key aspects include model validation, controller validation, custom validators, error handling, and testing strategies.
