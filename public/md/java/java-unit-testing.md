# Java Unit Testing

**Unit testing** is a fundamental practice in Java development to ensure individual components (methods, classes) work as expected in isolation.

The most popular Java unit testing frameworks are:

- **JUnit** (industry standard)
- **Mockito** (mocking framework)
- **AssertJ / Hamcrest** (for advanced assertions)
- **Spring Boot Test** (for testing Spring Boot applications)

## Why Unit Testing?

- **Validates correctness** of code.
- Helps catch regressions early.
- Supports **refactoring** with confidence.
- Improves **documentation** — tests show how the code is expected to behave.
- Makes debugging easier by isolating bugs.

## Basic JUnit Example

```java
import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

public class CalculatorTest {

    @Test
    public void testAddition() {
        Calculator calculator = new Calculator();
        assertEquals(5, calculator.add(2, 3));
    }
}
```

## Mocking Dependencies

To test a class without calling its actual dependencies (to avoid slow, complex, or unpredictable behavior), use **mocking**.

### Mockito Example

```java
import static org.mockito.Mockito.*;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

public class PaymentServiceTest {

    @Test
    public void testPaymentProcessing() {
        PaymentGateway gateway = Mockito.mock(PaymentGateway.class);
        when(gateway.process()).thenReturn("Success");

        PaymentService service = new PaymentService(gateway);
        assertEquals("Success", service.makePayment());
    }
}
```

## Testing with Spring Boot

When using **Spring Boot**, dependencies are injected into classes by the Spring container. During testing, we can replace those dependencies with mocks.

### Use `@MockBean` Instead of `@Autowired`

```java
@SpringBootTest
public class OrderServiceTest {

    @MockBean
    private PaymentGateway paymentGateway;  // Mocked dependency

    @Autowired
    private OrderService orderService;

    @Test
    public void testOrderPayment() {
        when(paymentGateway.process()).thenReturn("Approved");

        String result = orderService.pay();
        assertEquals("Approved", result);
    }
}
```

**Why `@MockBean`?**

- Replaces the real Spring bean in the `ApplicationContext` with a mock.
- Prevents the real dependency from being called (no DB hits, no external API calls, etc.).
- Keeps the test isolated and fast.

✅ **Tip**: Always prefer `@MockBean` over `@Autowired` for class dependencies in tests unless you specifically want to test the real behavior of the dependency.

## Key Annotations

| Annotation                   | Description                                                 |
| ---------------------------- | ----------------------------------------------------------- |
| `@Test`                      | Marks a method as a test case                               |
| `@BeforeEach` / `@AfterEach` | Setup/teardown before or after each test                    |
| `@BeforeAll` / `@AfterAll`   | Setup/teardown once before or after all tests               |
| `@Mock`                      | Declares a mock object                                      |
| `@InjectMocks`               | Automatically injects mocks into the class under test       |
| `@MockBean`                  | Spring Boot annotation to replace a Spring bean with a mock |

## Best Practices

- Test **small units** in isolation.
- **Mock external dependencies** (databases, web services).
- Use **meaningful assertion messages**.
- Keep tests **fast**.
- Follow the **Arrange-Act-Assert** pattern.
- Aim for **high code coverage**, but prioritize **meaningful** tests over simply increasing numbers.

## Interview Tip

Be ready to explain:

- Why mocking is essential for unit tests.
- Difference between **unit tests** and **integration tests**.
- Common JUnit and Mockito annotations.
- How Spring Boot’s `@MockBean` simplifies dependency mocking.
