# Java Testing Frameworks - Complete Guide

Testing is a critical aspect of software development. This comprehensive guide covers JUnit, Mockito, and other essential testing frameworks and techniques in Java, providing everything needed for writing effective tests and preparing for technical interviews.

## Table of Contents

1. [Testing Fundamentals](#testing-fundamentals)
2. [JUnit 5 Complete Guide](#junit-5-complete-guide)
3. [Mockito Framework](#mockito-framework)
4. [Advanced Testing Techniques](#advanced-testing-techniques)
5. [Test-Driven Development (TDD)](#test-driven-development-tdd)
6. [Integration Testing](#integration-testing)
7. [Performance Testing](#performance-testing)
8. [Best Practices](#best-practices)
9. [Common Testing Patterns](#common-testing-patterns)
10. [Interview Tips](#interview-tips)

## Testing Fundamentals

### Types of Testing

1. **Unit Tests**: Test individual components in isolation
2. **Integration Tests**: Test component interactions
3. **End-to-End Tests**: Test complete user workflows
4. **Performance Tests**: Test system performance under load
5. **Security Tests**: Test for security vulnerabilities

### Testing Principles

- **AAA Pattern**: Arrange, Act, Assert
- **FIRST Principles**: Fast, Independent, Repeatable, Self-validating, Timely
- **Test Pyramid**: More unit tests, fewer integration tests, minimal E2E tests

### Test Structure Example

```java
public class CalculatorTest {

    @Test
    public void shouldAddTwoNumbers() {
        Calculator calculator = new Calculator();

        int result = calculator.add(2, 3);

        assertEquals(5, result);
    }
}
```

## JUnit 5 Complete Guide

### JUnit 5 Architecture

JUnit 5 consists of three components:

- **JUnit Platform**: Foundation for launching testing frameworks
- **JUnit Jupiter**: Programming and extension model for writing tests
- **JUnit Vintage**: Provides backward compatibility with JUnit 3 and 4

### Basic Annotations

```java
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

public class BasicAnnotationsExample {

    @BeforeAll
    static void setUpBeforeClass() {
        System.out.println("Executed once before all tests");
    }

    @AfterAll
    static void tearDownAfterClass() {
        System.out.println("Executed once after all tests");
    }

    @BeforeEach
    void setUp() {
        System.out.println("Executed before each test");
    }

    @AfterEach
    void tearDown() {
        System.out.println("Executed after each test");
    }

    @Test
    void testMethod() {
        assertTrue(true);
    }

    @Test
    @DisplayName("Custom test name for better readability")
    void testWithCustomName() {
        assertNotNull("Hello World");
    }

    @Test
    @Disabled("Temporarily disabled for maintenance")
    void disabledTest() {
        fail("This test should not run");
    }
}
```

### Assertions

```java
public class AssertionsExample {

    @Test
    void basicAssertions() {
        assertEquals(5, 2 + 3);
        assertNotEquals(4, 2 + 3);
        assertTrue(5 > 3);
        assertFalse(5 < 3);
        assertNull(null);
        assertNotNull("Hello");
    }

    @Test
    void arrayAssertions() {
        int[] expected = {1, 2, 3};
        int[] actual = {1, 2, 3};
        assertArrayEquals(expected, actual);
    }

    @Test
    void stringAssertions() {
        String text = "Hello World";
        assertEquals("Hello World", text);
        assertTrue(text.startsWith("Hello"));
        assertTrue(text.endsWith("World"));
        assertTrue(text.contains("lo Wo"));
    }

    @Test
    void exceptionAssertions() {
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            throw new IllegalArgumentException("Invalid argument");
        });

        assertEquals("Invalid argument", exception.getMessage());

        assertDoesNotThrow(() -> {
            "This should not throw an exception".length();
        });
    }

    @Test
    void groupedAssertions() {
        Person person = new Person("John", "Doe", 30);

        assertAll("person",
            () -> assertEquals("John", person.getFirstName()),
            () -> assertEquals("Doe", person.getLastName()),
            () -> assertEquals(30, person.getAge())
        );
    }

    @Test
    void customAssertionMessage() {
        int result = 2 + 2;
        assertEquals(4, result, "2 + 2 should equal 4");

        assertEquals(4, result, () -> "2 + 2 should equal 4, but was " + result);
    }

    @Test
    void timeoutAssertions() {
        assertTimeout(Duration.ofSeconds(2), () -> {
            Thread.sleep(1000);
            return "Completed within timeout";
        });

        assertTimeoutPreemptively(Duration.ofSeconds(1), () -> {
            Thread.sleep(500);
            return "Completed preemptively";
        });
    }
}
```

### Parameterized Tests

```java
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.*;

public class ParameterizedTestExample {

    @ParameterizedTest
    @ValueSource(strings = {"hello", "world", "junit"})
    void testWithValueSource(String word) {
        assertNotNull(word);
        assertTrue(word.length() > 0);
    }

    @ParameterizedTest
    @ValueSource(ints = {1, 2, 3, 4, 5})
    void testWithIntValues(int number) {
        assertTrue(number > 0);
        assertTrue(number <= 5);
    }

    @ParameterizedTest
    @EnumSource(TimeUnit.class)
    void testWithEnumSource(TimeUnit timeUnit) {
        assertNotNull(timeUnit);
    }

    @ParameterizedTest
    @CsvSource({
        "1, 1, 2",
        "2, 3, 5",
        "5, 7, 12"
    })
    void testAddition(int a, int b, int expected) {
        Calculator calculator = new Calculator();
        assertEquals(expected, calculator.add(a, b));
    }

    @ParameterizedTest
    @CsvFileSource(resources = "/test-data.csv")
    void testWithCsvFile(String input, String expected) {
        assertEquals(expected.toUpperCase(), input.toUpperCase());
    }

    @ParameterizedTest
    @MethodSource("stringProvider")
    void testWithMethodSource(String argument) {
        assertNotNull(argument);
    }

    static Stream<String> stringProvider() {
        return Stream.of("apple", "banana", "cherry");
    }

    @ParameterizedTest
    @MethodSource("complexObjectProvider")
    void testWithComplexObjects(Person person) {
        assertNotNull(person.getName());
        assertTrue(person.getAge() > 0);
    }

    static Stream<Person> complexObjectProvider() {
        return Stream.of(
            new Person("John", "Doe", 25),
            new Person("Jane", "Smith", 30),
            new Person("Bob", "Johnson", 35)
        );
    }

    @ParameterizedTest
    @ArgumentsSource(CustomArgumentsProvider.class)
    void testWithCustomArgumentsProvider(String input, int expected) {
        assertEquals(expected, input.length());
    }

    static class CustomArgumentsProvider implements ArgumentsProvider {
        @Override
        public Stream<? extends Arguments> provideArguments(ExtensionContext context) {
            return Stream.of(
                Arguments.of("hello", 5),
                Arguments.of("world", 5),
                Arguments.of("test", 4)
            );
        }
    }
}
```

### Dynamic Tests

```java
public class DynamicTestExample {

    @TestFactory
    Stream<DynamicTest> dynamicTestsFromCollection() {
        List<String> inputs = Arrays.asList("hello", "world", "dynamic");

        return inputs.stream()
            .map(input -> DynamicTest.dynamicTest(
                "Testing: " + input,
                () -> assertTrue(input.length() > 0)
            ));
    }

    @TestFactory
    Stream<DynamicTest> dynamicTestsWithComplexLogic() {
        return IntStream.range(1, 6)
            .mapToObj(i -> DynamicTest.dynamicTest(
                "Test for number: " + i,
                () -> {
                    if (i % 2 == 0) {
                        assertTrue(i % 2 == 0, i + " should be even");
                    } else {
                        assertTrue(i % 2 != 0, i + " should be odd");
                    }
                }
            ));
    }

    @TestFactory
    Stream<DynamicNode> dynamicTestsWithContainers() {
        return Stream.of(
            DynamicContainer.dynamicContainer("Numbers",
                Stream.of(
                    DynamicTest.dynamicTest("Positive", () -> assertTrue(5 > 0)),
                    DynamicTest.dynamicTest("Negative", () -> assertTrue(-5 < 0))
                )
            ),
            DynamicContainer.dynamicContainer("Strings",
                Stream.of(
                    DynamicTest.dynamicTest("Not empty", () -> assertFalse("hello".isEmpty())),
                    DynamicTest.dynamicTest("Contains", () -> assertTrue("hello".contains("ell")))
                )
            )
        );
    }
}
```

### Custom Extensions

```java
public class TimingExtension implements BeforeTestExecutionCallback, AfterTestExecutionCallback {

    private static final Logger logger = LoggerFactory.getLogger(TimingExtension.class);
    private static final String START_TIME = "start time";

    @Override
    public void beforeTestExecution(ExtensionContext context) throws Exception {
        getStore(context).put(START_TIME, System.currentTimeMillis());
    }

    @Override
    public void afterTestExecution(ExtensionContext context) throws Exception {
        Method testMethod = context.getRequiredTestMethod();
        long startTime = getStore(context).remove(START_TIME, long.class);
        long duration = System.currentTimeMillis() - startTime;

        logger.info("Method [{}] took {} ms.", testMethod.getName(), duration);
    }

    private ExtensionContext.Store getStore(ExtensionContext context) {
        return context.getStore(ExtensionContext.Namespace.create(getClass(), context.getRequiredTestMethod()));
    }
}

@ExtendWith(TimingExtension.class)
public class TimedTest {

    @Test
    void timedTest() throws InterruptedException {
        Thread.sleep(100);
        assertTrue(true);
    }
}
```

## Mockito Framework

### Basic Mocking

```java
import org.mockito.*;
import static org.mockito.Mockito.*;

public class BasicMockingExample {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldReturnUserWhenValidId() {
        User expectedUser = new User(1L, "John Doe", "john@example.com");
        when(userRepository.findById(1L)).thenReturn(expectedUser);

        User actualUser = userService.getUserById(1L);

        assertEquals(expectedUser, actualUser);
        verify(userRepository).findById(1L);
    }

    @Test
    void shouldThrowExceptionWhenUserNotFound() {
        when(userRepository.findById(999L)).thenReturn(null);

        assertThrows(UserNotFoundException.class, () -> {
            userService.getUserById(999L);
        });

        verify(userRepository).findById(999L);
    }

    @Test
    void shouldCreateUserSuccessfully() {
        User newUser = new User(null, "Jane Doe", "jane@example.com");
        User savedUser = new User(2L, "Jane Doe", "jane@example.com");

        when(userRepository.save(newUser)).thenReturn(savedUser);

        User result = userService.createUser(newUser);

        assertEquals(savedUser, result);
        verify(userRepository).save(newUser);
    }
}
```

### Advanced Mocking Techniques

```java
public class AdvancedMockingExample {

    @Mock
    private EmailService emailService;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldHandleMultipleMethodCalls() {
        User user = new User(1L, "John", "john@example.com");

        when(userRepository.findById(1L))
            .thenReturn(user)
            .thenThrow(new RuntimeException("Database error"));

        User result1 = userService.getUserById(1L);
        assertEquals(user, result1);

        assertThrows(RuntimeException.class, () -> {
            userService.getUserById(1L);
        });

        verify(userRepository, times(2)).findById(1L);
    }

    @Test
    void shouldUseArgumentMatchers() {
        when(userRepository.findByEmail(anyString())).thenReturn(new User());
        when(userRepository.save(any(User.class))).thenReturn(new User());

        userService.createUser(new User(null, "Test", "test@example.com"));

        verify(userRepository).save(argThat(user ->
            user.getName().equals("Test") && user.getEmail().equals("test@example.com")
        ));
    }

    @Test
    void shouldCaptureArguments() {
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        ArgumentCaptor<String> emailCaptor = ArgumentCaptor.forClass(String.class);

        User newUser = new User(null, "John", "john@example.com");
        when(userRepository.save(any(User.class))).thenReturn(newUser);

        userService.createUserWithWelcomeEmail(newUser);

        verify(userRepository).save(userCaptor.capture());
        verify(emailService).sendWelcomeEmail(emailCaptor.capture());

        assertEquals("John", userCaptor.getValue().getName());
        assertEquals("john@example.com", emailCaptor.getValue());
    }

    @Test
    void shouldMockVoidMethods() {
        doNothing().when(emailService).sendEmail(anyString(), anyString());
        doThrow(new RuntimeException("Email failed")).when(emailService).sendEmail(eq("invalid@email"), anyString());

        assertDoesNotThrow(() -> {
            emailService.sendEmail("valid@email.com", "Test message");
        });

        assertThrows(RuntimeException.class, () -> {
            emailService.sendEmail("invalid@email", "Test message");
        });
    }

    @Test
    void shouldUseAnswers() {
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(100L);
            return user;
        });

        User user = new User(null, "Test", "test@example.com");
        User saved = userService.createUser(user);

        assertEquals(100L, saved.getId());
    }

    @Test
    void shouldVerifyInteractions() {
        when(userRepository.findById(1L)).thenReturn(new User());

        userService.getUserById(1L);
        userService.getUserById(1L);

        verify(userRepository, times(2)).findById(1L);
        verify(userRepository, atLeast(1)).findById(1L);
        verify(userRepository, atMost(3)).findById(1L);
        verify(userRepository, never()).deleteById(anyLong());

        verifyNoMoreInteractions(userRepository);
    }
}
```

### Spying on Real Objects

```java
public class SpyingExample {

    @Test
    void shouldSpyOnRealObject() {
        List<String> list = new ArrayList<>();
        List<String> spyList = spy(list);

        spyList.add("one");
        spyList.add("two");

        verify(spyList).add("one");
        verify(spyList).add("two");

        assertEquals(2, spyList.size());
        assertEquals("one", spyList.get(0));
    }

    @Test
    void shouldPartiallyMockRealObject() {
        UserService realUserService = new UserService();
        UserService spyUserService = spy(realUserService);

        when(spyUserService.getCurrentTime()).thenReturn(1234567890L);

        doReturn("Mocked validation").when(spyUserService).validateUser(any(User.class));

        User user = new User(1L, "John", "john@example.com");
        String result = spyUserService.processUser(user);

        verify(spyUserService).validateUser(user);
        verify(spyUserService).getCurrentTime();
    }
}
```

### Testing with MockitoExtension

```java
@ExtendWith(MockitoExtension.class)
public class MockitoExtensionExample {

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private UserService userService;

    @Test
    void shouldInjectMocksAutomatically() {
        when(userRepository.findById(1L)).thenReturn(new User(1L, "John", "john@example.com"));

        User user = userService.getUserById(1L);

        assertNotNull(user);
        assertEquals("John", user.getName());
    }

    @Test
    void shouldWorkWithParameterizedMocks(@Mock EmailService parameterizedEmailService) {
        when(parameterizedEmailService.isEmailValid("test@example.com")).thenReturn(true);

        boolean result = parameterizedEmailService.isEmailValid("test@example.com");

        assertTrue(result);
    }
}
```

## Advanced Testing Techniques

### Testing Asynchronous Code

```java
public class AsynchronousTestingExample {

    @Test
    void shouldTestCompletableFuture() throws Exception {
        CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            return "Async result";
        });

        String result = future.get(1, TimeUnit.SECONDS);
        assertEquals("Async result", result);
    }

    @Test
    void shouldTestAsynchronousServiceCall() {
        AsyncUserService asyncUserService = new AsyncUserService();
        CountDownLatch latch = new CountDownLatch(1);
        AtomicReference<User> result = new AtomicReference<>();

        asyncUserService.getUserAsync(1L, user -> {
            result.set(user);
            latch.countDown();
        });

        assertDoesNotThrow(() -> {
            assertTrue(latch.await(2, TimeUnit.SECONDS));
        });

        assertNotNull(result.get());
    }

    @Test
    void shouldTestWithAwaitility() {
        AsyncUserService service = new AsyncUserService();
        service.startAsyncProcess();

        await().atMost(2, TimeUnit.SECONDS)
               .until(() -> service.isProcessComplete());

        assertTrue(service.isProcessComplete());
    }
}
```

### Testing Exception Scenarios

```java
public class ExceptionTestingExample {

    @Test
    void shouldTestExceptionMessage() {
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> new User(null, "", "invalid-email")
        );

        assertEquals("Invalid email format", exception.getMessage());
    }

    @Test
    void shouldTestExceptionCause() {
        Exception exception = assertThrows(Exception.class, () -> {
            throw new Exception("Outer exception", new RuntimeException("Inner exception"));
        });

        assertEquals("Outer exception", exception.getMessage());
        assertInstanceOf(RuntimeException.class, exception.getCause());
        assertEquals("Inner exception", exception.getCause().getMessage());
    }

    @Test
    void shouldTestMultipleExceptions() {
        assertAll(
            () -> assertThrows(IllegalArgumentException.class, () -> validateAge(-1)),
            () -> assertThrows(IllegalArgumentException.class, () -> validateAge(151)),
            () -> assertDoesNotThrow(() -> validateAge(25))
        );
    }

    private void validateAge(int age) {
        if (age < 0 || age > 150) {
            throw new IllegalArgumentException("Invalid age: " + age);
        }
    }
}
```

### Testing with Test Doubles

```java
public class TestDoublesExample {

    interface PaymentGateway {
        PaymentResult processPayment(Payment payment);
    }

    static class StubPaymentGateway implements PaymentGateway {
        private final PaymentResult result;

        public StubPaymentGateway(PaymentResult result) {
            this.result = result;
        }

        @Override
        public PaymentResult processPayment(Payment payment) {
            return result;
        }
    }

    static class FakePaymentGateway implements PaymentGateway {
        private final Map<String, PaymentResult> responses = new HashMap<>();

        public void setResponse(String cardNumber, PaymentResult result) {
            responses.put(cardNumber, result);
        }

        @Override
        public PaymentResult processPayment(Payment payment) {
            return responses.getOrDefault(payment.getCardNumber(),
                   new PaymentResult(false, "Card not configured"));
        }
    }

    @Test
    void shouldUseStubForTesting() {
        PaymentGateway stubGateway = new StubPaymentGateway(
            new PaymentResult(true, "Success"));
        PaymentService paymentService = new PaymentService(stubGateway);

        Payment payment = new Payment("1234-5678-9012-3456", 100.0);
        PaymentResult result = paymentService.processPayment(payment);

        assertTrue(result.isSuccessful());
    }

    @Test
    void shouldUseFakeForTesting() {
        FakePaymentGateway fakeGateway = new FakePaymentGateway();
        fakeGateway.setResponse("valid-card", new PaymentResult(true, "Success"));
        fakeGateway.setResponse("invalid-card", new PaymentResult(false, "Declined"));

        PaymentService paymentService = new PaymentService(fakeGateway);

        Payment validPayment = new Payment("valid-card", 100.0);
        Payment invalidPayment = new Payment("invalid-card", 100.0);

        assertTrue(paymentService.processPayment(validPayment).isSuccessful());
        assertFalse(paymentService.processPayment(invalidPayment).isSuccessful());
    }
}
```

## Test-Driven Development (TDD)

### TDD Cycle Example

```java
public class TDDExample {

    @Test
    void shouldReturnEmptyStringForZero() {
        FizzBuzz fizzBuzz = new FizzBuzz();

        assertEquals("", fizzBuzz.convert(0));
    }

    @Test
    void shouldReturnNumberAsStringForRegularNumbers() {
        FizzBuzz fizzBuzz = new FizzBuzz();

        assertEquals("1", fizzBuzz.convert(1));
        assertEquals("2", fizzBuzz.convert(2));
    }

    @Test
    void shouldReturnFizzForMultiplesOfThree() {
        FizzBuzz fizzBuzz = new FizzBuzz();

        assertEquals("Fizz", fizzBuzz.convert(3));
        assertEquals("Fizz", fizzBuzz.convert(6));
        assertEquals("Fizz", fizzBuzz.convert(9));
    }

    @Test
    void shouldReturnBuzzForMultiplesOfFive() {
        FizzBuzz fizzBuzz = new FizzBuzz();

        assertEquals("Buzz", fizzBuzz.convert(5));
        assertEquals("Buzz", fizzBuzz.convert(10));
    }

    @Test
    void shouldReturnFizzBuzzForMultiplesOfFifteen() {
        FizzBuzz fizzBuzz = new FizzBuzz();

        assertEquals("FizzBuzz", fizzBuzz.convert(15));
        assertEquals("FizzBuzz", fizzBuzz.convert(30));
    }
}

public class FizzBuzz {
    public String convert(int number) {
        if (number == 0) return "";
        if (number % 15 == 0) return "FizzBuzz";
        if (number % 3 == 0) return "Fizz";
        if (number % 5 == 0) return "Buzz";
        return String.valueOf(number);
    }
}
```

### BDD-Style Testing

```java
public class BDDStyleExample {

    private UserService userService;
    private User user;
    private Exception exception;

    @BeforeEach
    void setUp() {
        userService = new UserService();
    }

    @Test
    void shouldCreateUserWhenValidDataProvided() {
        givenValidUserData();
        whenCreatingUser();
        thenUserShouldBeCreatedSuccessfully();
    }

    @Test
    void shouldThrowExceptionWhenInvalidEmailProvided() {
        givenInvalidEmailData();
        whenCreatingUser();
        thenExceptionShouldBeThrown();
    }

    private void givenValidUserData() {
        user = new User(null, "John Doe", "john@example.com");
    }

    private void givenInvalidEmailData() {
        user = new User(null, "John Doe", "invalid-email");
    }

    private void whenCreatingUser() {
        try {
            user = userService.createUser(user);
        } catch (Exception e) {
            exception = e;
        }
    }

    private void thenUserShouldBeCreatedSuccessfully() {
        assertNotNull(user);
        assertNotNull(user.getId());
        assertNull(exception);
    }

    private void thenExceptionShouldBeThrown() {
        assertNotNull(exception);
        assertInstanceOf(IllegalArgumentException.class, exception);
    }
}
```

## Integration Testing

### Spring Boot Integration Tests

```java
@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@TestPropertySource(locations = "classpath:application-test.properties")
public class UserServiceIntegrationTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TestEntityManager testEntityManager;

    @Test
    @Transactional
    @Rollback
    void shouldSaveAndRetrieveUser() {
        User user = new User(null, "John Doe", "john@example.com");

        User savedUser = userService.createUser(user);

        assertNotNull(savedUser.getId());
        assertEquals("John Doe", savedUser.getName());

        User retrievedUser = userService.getUserById(savedUser.getId());
        assertEquals(savedUser, retrievedUser);
    }

    @Test
    void shouldHandleTransactionRollback() {
        User user = new User(null, "Jane Doe", "jane@example.com");

        assertThrows(TransactionException.class, () -> {
            userService.createUserWithError(user);
        });

        List<User> users = userRepository.findByName("Jane Doe");
        assertTrue(users.isEmpty());
    }
}
```

### Database Testing with TestContainers

```java
@Testcontainers
public class DatabaseIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:13")
            .withDatabaseName("testdb")
            .withUsername("test")
            .withPassword("test");

    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        String jdbcUrl = postgres.getJdbcUrl();
        String username = postgres.getUsername();
        String password = postgres.getPassword();

        DataSource dataSource = DataSourceBuilder.create()
                .url(jdbcUrl)
                .username(username)
                .password(password)
                .build();

        userRepository = new UserRepository(dataSource);
    }

    @Test
    void shouldPersistUser() {
        User user = new User(null, "John Doe", "john@example.com");

        User savedUser = userRepository.save(user);

        assertNotNull(savedUser.getId());
        assertEquals("John Doe", savedUser.getName());
    }
}
```

### REST API Testing

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class UserControllerIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private UserRepository userRepository;

    @Test
    void shouldCreateUserViaAPI() {
        User user = new User(null, "John Doe", "john@example.com");

        ResponseEntity<User> response = restTemplate.postForEntity("/api/users", user, User.class);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertNotNull(response.getBody().getId());
    }

    @Test
    void shouldGetUserViaAPI() {
        User savedUser = userRepository.save(new User(null, "Jane Doe", "jane@example.com"));

        ResponseEntity<User> response = restTemplate.getForEntity("/api/users/" + savedUser.getId(), User.class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(savedUser.getName(), response.getBody().getName());
    }

    @Test
    void shouldHandleUserNotFound() {
        ResponseEntity<String> response = restTemplate.getForEntity("/api/users/999", String.class);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }
}
```

## Performance Testing

### JMH (Java Microbenchmark Harness)

```java
@State(Scope.Benchmark)
@BenchmarkMode(Mode.AverageTime)
@OutputTimeUnit(TimeUnit.NANOSECONDS)
@Warmup(iterations = 3, time = 1, timeUnit = TimeUnit.SECONDS)
@Measurement(iterations = 5, time = 1, timeUnit = TimeUnit.SECONDS)
@Fork(1)
public class StringConcatenationBenchmark {

    private String[] strings;

    @Setup
    public void setup() {
        strings = new String[]{"Hello", " ", "World", "!"};
    }

    @Benchmark
    public String concatenateWithPlus() {
        String result = "";
        for (String s : strings) {
            result += s;
        }
        return result;
    }

    @Benchmark
    public String concatenateWithStringBuilder() {
        StringBuilder sb = new StringBuilder();
        for (String s : strings) {
            sb.append(s);
        }
        return sb.toString();
    }

    @Benchmark
    public String concatenateWithStringJoiner() {
        StringJoiner joiner = new StringJoiner("");
        for (String s : strings) {
            joiner.add(s);
        }
        return joiner.toString();
    }
}
```

### Load Testing with JUnit

```java
public class LoadTestExample {

    @Test
    void shouldHandleConcurrentUsers() throws InterruptedException {
        int threadCount = 10;
        int requestsPerThread = 100;
        CountDownLatch latch = new CountDownLatch(threadCount);
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger errorCount = new AtomicInteger(0);

        UserService userService = new UserService();

        for (int i = 0; i < threadCount; i++) {
            new Thread(() -> {
                try {
                    for (int j = 0; j < requestsPerThread; j++) {
                        try {
                            User user = new User(null, "User" + j, "user" + j + "@example.com");
                            userService.createUser(user);
                            successCount.incrementAndGet();
                        } catch (Exception e) {
                            errorCount.incrementAndGet();
                        }
                    }
                } finally {
                    latch.countDown();
                }
            }).start();
        }

        latch.await(30, TimeUnit.SECONDS);

        System.out.println("Successful requests: " + successCount.get());
        System.out.println("Failed requests: " + errorCount.get());

        assertTrue(successCount.get() > errorCount.get());
    }
}
```

## Best Practices

### Test Organization

```java
@DisplayName("User Service Tests")
public class UserServiceTest {

    @Nested
    @DisplayName("Creating Users")
    class CreatingUsers {

        @Test
        @DisplayName("Should create user with valid data")
        void shouldCreateUserWithValidData() {
        }

        @Test
        @DisplayName("Should throw exception with invalid email")
        void shouldThrowExceptionWithInvalidEmail() {
        }
    }

    @Nested
    @DisplayName("Finding Users")
    class FindingUsers {

        @Test
        @DisplayName("Should find user by valid ID")
        void shouldFindUserByValidId() {
        }

        @Test
        @DisplayName("Should return null for invalid ID")
        void shouldReturnNullForInvalidId() {
        }
    }
}
```

### Test Data Builders

```java
public class UserTestDataBuilder {
    private Long id = 1L;
    private String name = "John Doe";
    private String email = "john@example.com";
    private int age = 25;

    public static UserTestDataBuilder aUser() {
        return new UserTestDataBuilder();
    }

    public UserTestDataBuilder withId(Long id) {
        this.id = id;
        return this;
    }

    public UserTestDataBuilder withName(String name) {
        this.name = name;
        return this;
    }

    public UserTestDataBuilder withEmail(String email) {
        this.email = email;
        return this;
    }

    public UserTestDataBuilder withAge(int age) {
        this.age = age;
        return this;
    }

    public User build() {
        return new User(id, name, email, age);
    }
}

@Test
void shouldTestWithBuilder() {
    User user = aUser()
        .withName("Jane Doe")
        .withEmail("jane@example.com")
        .withAge(30)
        .build();

    assertNotNull(user);
    assertEquals("Jane Doe", user.getName());
}
```

### Custom Matchers

```java
public class UserMatcher extends TypeSafeMatcher<User> {
    private final String expectedName;
    private final String expectedEmail;

    public UserMatcher(String expectedName, String expectedEmail) {
        this.expectedName = expectedName;
        this.expectedEmail = expectedEmail;
    }

    @Override
    protected boolean matchesSafely(User user) {
        return Objects.equals(user.getName(), expectedName) &&
               Objects.equals(user.getEmail(), expectedEmail);
    }

    @Override
    public void describeTo(Description description) {
        description.appendText("a user with name ").appendValue(expectedName)
                  .appendText(" and email ").appendValue(expectedEmail);
    }

    public static UserMatcher userWithNameAndEmail(String name, String email) {
        return new UserMatcher(name, email);
    }
}

@Test
void shouldUseCustomMatcher() {
    User user = new User(1L, "John Doe", "john@example.com");

    assertThat(user, userWithNameAndEmail("John Doe", "john@example.com"));
}
```

## Common Testing Patterns

### Object Mother Pattern

```java
public class UserMother {

    public static User validUser() {
        return new User(1L, "John Doe", "john@example.com", 25);
    }

    public static User userWithInvalidEmail() {
        return new User(2L, "Jane Doe", "invalid-email", 30);
    }

    public static User minorUser() {
        return new User(3L, "Bob Smith", "bob@example.com", 17);
    }

    public static User elderlyUser() {
        return new User(4L, "Alice Johnson", "alice@example.com", 75);
    }

    public static List<User> multipleUsers() {
        return Arrays.asList(
            validUser(),
            new User(5L, "Charlie Brown", "charlie@example.com", 35),
            new User(6L, "Diana Prince", "diana@example.com", 28)
        );
    }
}
```

### Page Object Pattern (for UI Testing)

```java
public class LoginPage {
    private final WebDriver driver;

    @FindBy(id = "username")
    private WebElement usernameField;

    @FindBy(id = "password")
    private WebElement passwordField;

    @FindBy(id = "login-button")
    private WebElement loginButton;

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        PageFactory.initElements(driver, this);
    }

    public void enterUsername(String username) {
        usernameField.clear();
        usernameField.sendKeys(username);
    }

    public void enterPassword(String password) {
        passwordField.clear();
        passwordField.sendKeys(password);
    }

    public DashboardPage clickLogin() {
        loginButton.click();
        return new DashboardPage(driver);
    }

    public DashboardPage login(String username, String password) {
        enterUsername(username);
        enterPassword(password);
        return clickLogin();
    }
}
```

## Interview Tips

### Common Testing Interview Questions

1. **"What's the difference between unit tests and integration tests?"**

   - Unit tests: Test individual components in isolation
   - Integration tests: Test component interactions

2. **"Explain the difference between mocks, stubs, and fakes"**

   - Mocks: Verify behavior and interactions
   - Stubs: Provide predefined responses
   - Fakes: Working implementations with shortcuts

3. **"What is Test-Driven Development (TDD)?"**

   - Red: Write failing test
   - Green: Write minimal code to pass
   - Refactor: Improve code quality

4. **"How do you test private methods?"**

   - Test through public interface
   - Extract to separate class
   - Use reflection (last resort)

5. **"What makes a good test?"**
   - Fast, Independent, Repeatable, Self-validating, Timely

### Key Testing Principles

- **Test behavior, not implementation**
- **Keep tests simple and focused**
- **Use descriptive test names**
- **Follow the AAA pattern**
- **Isolate dependencies with mocks**
- **Test edge cases and error conditions**
- **Maintain test code quality**

### Performance Considerations

- **Fast feedback loop** is crucial
- **Parallel test execution** for faster builds
- **Proper test categorization** (unit, integration, E2E)
- **Mock external dependencies** to avoid flaky tests
- **Use test slices** in Spring Boot for focused testing

Remember: Good tests are an investment in code quality, maintainability, and developer confidence. They should serve as documentation and enable safe refactoring.
