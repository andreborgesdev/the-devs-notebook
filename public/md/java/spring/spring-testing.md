# Spring Testing

## Overview

Spring Testing provides comprehensive support for unit and integration testing of Spring applications. It includes powerful annotations, test contexts, and mock support to make testing Spring applications efficient and effective.

## Test Context Framework

### @SpringBootTest

```java
@SpringBootTest
class ApplicationIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void contextLoads() {
        assertThat(restTemplate).isNotNull();
    }
}
```

### @WebMvcTest

```java
@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    void shouldReturnUser() throws Exception {
        User user = new User("John", "john@example.com");
        when(userService.findById(1L)).thenReturn(user);

        mockMvc.perform(get("/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("John"));
    }
}
```

### @DataJpaTest

```java
@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    @Test
    void shouldFindByEmail() {
        User user = new User("John", "john@example.com");
        entityManager.persist(user);
        entityManager.flush();

        Optional<User> found = userRepository.findByEmail("john@example.com");

        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("John");
    }
}
```

## Testing Annotations

### Core Test Annotations

```java
@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = TestConfig.class)
class ServiceTest {

    @Autowired
    private UserService userService;

    @Test
    void shouldCreateUser() {
        User user = userService.createUser("John", "john@example.com");
        assertThat(user.getId()).isNotNull();
    }
}
```

### Test Configuration

```java
@TestConfiguration
public class TestConfig {

    @Bean
    @Primary
    public UserService mockUserService() {
        return Mockito.mock(UserService.class);
    }

    @Bean
    public TestDataSource testDataSource() {
        return new EmbeddedDatabaseBuilder()
                .setType(EmbeddedDatabaseType.H2)
                .build();
    }
}
```

## Mock Support

### @MockBean and @SpyBean

```java
@SpringBootTest
class UserServiceIntegrationTest {

    @MockBean
    private EmailService emailService;

    @SpyBean
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Test
    void shouldSendWelcomeEmail() {
        User user = userService.registerUser("John", "john@example.com");

        verify(emailService).sendWelcomeEmail(user);
        verify(userRepository).save(any(User.class));
    }
}
```

### Manual Mocking

```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private UserService userService;

    @Test
    void shouldRegisterUser() {
        User user = new User("John", "john@example.com");
        when(userRepository.save(any(User.class))).thenReturn(user);

        User result = userService.registerUser("John", "john@example.com");

        assertThat(result.getName()).isEqualTo("John");
        verify(emailService).sendWelcomeEmail(user);
    }
}
```

## Web Layer Testing

### MockMvc Testing

```java
@WebMvcTest
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    void shouldCreateUser() throws Exception {
        User user = new User(1L, "John", "john@example.com");
        when(userService.createUser(any(), any())).thenReturn(user);

        mockMvc.perform(post("/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"John\",\"email\":\"john@example.com\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("John"));
    }

    @Test
    void shouldValidateInput() throws Exception {
        mockMvc.perform(post("/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"\",\"email\":\"invalid\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors").isArray());
    }
}
```

### WebTestClient (WebFlux)

```java
@WebFluxTest(UserController.class)
class UserControllerWebFluxTest {

    @Autowired
    private WebTestClient webTestClient;

    @MockBean
    private UserService userService;

    @Test
    void shouldReturnUser() {
        User user = new User("John", "john@example.com");
        when(userService.findById(1L)).thenReturn(Mono.just(user));

        webTestClient.get()
                .uri("/users/1")
                .exchange()
                .expectStatus().isOk()
                .expectBody(User.class)
                .value(u -> assertThat(u.getName()).isEqualTo("John"));
    }
}
```

## Data Layer Testing

### Repository Testing

```java
@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    @Test
    void shouldFindActiveUsers() {
        User activeUser = new User("John", "john@example.com", true);
        User inactiveUser = new User("Jane", "jane@example.com", false);

        entityManager.persist(activeUser);
        entityManager.persist(inactiveUser);
        entityManager.flush();

        List<User> activeUsers = userRepository.findByActiveTrue();

        assertThat(activeUsers).hasSize(1);
        assertThat(activeUsers.get(0).getName()).isEqualTo("John");
    }

    @Test
    void shouldExecuteCustomQuery() {
        entityManager.persistAndFlush(new User("John", "john@gmail.com"));
        entityManager.persistAndFlush(new User("Jane", "jane@yahoo.com"));

        List<User> gmailUsers = userRepository.findByEmailDomain("gmail.com");

        assertThat(gmailUsers).hasSize(1);
        assertThat(gmailUsers.get(0).getName()).isEqualTo("John");
    }
}
```

### Custom Repository Testing

```java
@DataJpaTest
class CustomUserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Test
    void shouldFindUsersByComplexCriteria() {
        User user1 = new User("John", "john@example.com", 25, "Developer");
        User user2 = new User("Jane", "jane@example.com", 30, "Manager");

        entityManager.persist(user1);
        entityManager.persist(user2);
        entityManager.flush();

        List<User> developers = userRepository.findByAgeRangeAndRole(20, 28, "Developer");

        assertThat(developers).hasSize(1);
        assertThat(developers.get(0).getName()).isEqualTo("John");
    }
}
```

## Integration Testing

### Full Application Testing

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ApplicationIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private UserRepository userRepository;

    @Test
    void shouldCompleteUserWorkflow() {
        CreateUserRequest request = new CreateUserRequest("John", "john@example.com");

        ResponseEntity<User> response = restTemplate.postForEntity("/users", request, User.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody().getName()).isEqualTo("John");

        Optional<User> savedUser = userRepository.findById(response.getBody().getId());
        assertThat(savedUser).isPresent();
    }
}
```

### Transaction Testing

```java
@SpringBootTest
@Transactional
class TransactionalTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Test
    @Rollback
    void shouldRollbackOnException() {
        assertThrows(EmailAlreadyExistsException.class, () -> {
            userService.createUser("John", "john@example.com");
            userService.createUser("Jane", "john@example.com"); // Same email
        });

        List<User> users = userRepository.findAll();
        assertThat(users).isEmpty(); // Both operations rolled back
    }

    @Test
    @Commit
    void shouldCommitTransaction() {
        userService.createUser("John", "john@example.com");

        List<User> users = userRepository.findAll();
        assertThat(users).hasSize(1);
    }
}
```

## Test Profiles and Properties

### Test Configuration

```yaml
# application-test.yml
spring:
  datasource:
    url: jdbc:h2:mem:testdb
    driver-class-name: org.h2.Driver
  jpa:
    hibernate:
      ddl-auto: create-drop
  mail:
    host: localhost
    port: 2525
```

### Profile-based Testing

```java
@SpringBootTest
@ActiveProfiles("test")
class ProfileBasedTest {

    @Value("${app.feature.enabled:false}")
    private boolean featureEnabled;

    @Test
    void shouldUseTestProfile() {
        assertThat(featureEnabled).isFalse();
    }
}
```

### Property Testing

```java
@SpringBootTest(properties = {
    "app.max-users=100",
    "app.feature.premium=true"
})
class PropertyOverrideTest {

    @Value("${app.max-users}")
    private int maxUsers;

    @Test
    void shouldOverrideProperties() {
        assertThat(maxUsers).isEqualTo(100);
    }
}
```

## Testing Utilities

### TestContainers Integration

```java
@SpringBootTest
@Testcontainers
class DatabaseIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:13")
            .withDatabaseName("testdb")
            .withUsername("test")
            .withPassword("test");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    private UserRepository userRepository;

    @Test
    void shouldConnectToDatabase() {
        User user = new User("John", "john@example.com");
        User saved = userRepository.save(user);

        assertThat(saved.getId()).isNotNull();
    }
}
```

### Custom Test Slices

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@SpringBootTest
@AutoConfigureTestDatabase
@TestPropertySource(properties = {
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
public @interface IntegrationTest {
}
```

## Testing Best Practices

### Test Structure

```java
@SpringBootTest
class UserServiceTest {

    @Autowired
    private UserService userService;

    @MockBean
    private EmailService emailService;

    @BeforeEach
    void setUp() {
        // Setup common test data
    }

    @Test
    @DisplayName("Should create user with valid data")
    void shouldCreateUserWithValidData() {
        // Given
        String name = "John";
        String email = "john@example.com";

        // When
        User result = userService.createUser(name, email);

        // Then
        assertThat(result)
                .isNotNull()
                .satisfies(user -> {
                    assertThat(user.getName()).isEqualTo(name);
                    assertThat(user.getEmail()).isEqualTo(email);
                    assertThat(user.getId()).isNotNull();
                });

        verify(emailService).sendWelcomeEmail(result);
    }
}
```

### Test Data Builders

```java
public class UserTestDataBuilder {
    private String name = "John Doe";
    private String email = "john@example.com";
    private boolean active = true;

    public static UserTestDataBuilder aUser() {
        return new UserTestDataBuilder();
    }

    public UserTestDataBuilder withName(String name) {
        this.name = name;
        return this;
    }

    public UserTestDataBuilder withEmail(String email) {
        this.email = email;
        return this;
    }

    public UserTestDataBuilder inactive() {
        this.active = false;
        return this;
    }

    public User build() {
        return new User(name, email, active);
    }
}

// Usage
@Test
void shouldFindActiveUsers() {
    User activeUser = aUser().withName("John").build();
    User inactiveUser = aUser().withName("Jane").inactive().build();

    userRepository.save(activeUser);
    userRepository.save(inactiveUser);

    List<User> activeUsers = userService.findActiveUsers();

    assertThat(activeUsers).hasSize(1);
    assertThat(activeUsers.get(0).getName()).isEqualTo("John");
}
```

This comprehensive guide covers Spring Testing from basic unit tests to complex integration testing scenarios, providing practical examples for testing all layers of a Spring application.
