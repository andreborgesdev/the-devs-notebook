# Spring Testing Interview Questions

## What Are the Different Testing Strategies in Spring?

Spring provides comprehensive testing support with different levels:

- **Unit Testing**: Test individual components in isolation
- **Integration Testing**: Test component interactions
- **Slice Testing**: Test specific layers (Web, Data, etc.)
- **End-to-End Testing**: Test complete application flow

## What Is @SpringBootTest?

`@SpringBootTest` loads the complete application context for integration testing:

```java
@SpringBootTest
class UserServiceIntegrationTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Test
    void shouldCreateAndRetrieveUser() {
        User user = new User("John", "john@example.com");
        User savedUser = userService.createUser(user);

        assertThat(savedUser.getId()).isNotNull();
        assertThat(userRepository.findById(savedUser.getId())).isPresent();
    }
}
```

**WebEnvironment options:**

- `MOCK` (default): Mock web environment
- `RANDOM_PORT`: Starts server on random port
- `DEFINED_PORT`: Starts server on defined port
- `NONE`: No web environment

## What Is @WebMvcTest?

`@WebMvcTest` tests the web layer in isolation:

```java
@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    void shouldReturnUser() throws Exception {
        User user = new User(1L, "John", "john@example.com");
        when(userService.findById(1L)).thenReturn(user);

        mockMvc.perform(get("/users/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("John"))
                .andExpect(jsonPath("$.email").value("john@example.com"));
    }

    @Test
    void shouldCreateUser() throws Exception {
        User inputUser = new User("Jane", "jane@example.com");
        User savedUser = new User(2L, "Jane", "jane@example.com");
        when(userService.createUser(any(User.class))).thenReturn(savedUser);

        mockMvc.perform(post("/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputUser)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.name").value("Jane"));
    }
}
```

## What Is @DataJpaTest?

`@DataJpaTest` tests JPA repositories in isolation:

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
        entityManager.persistAndFlush(user);

        Optional<User> found = userRepository.findByEmail("john@example.com");

        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("John");
    }

    @Test
    void shouldFindByActiveTrue() {
        User activeUser = new User("Active", "active@example.com");
        activeUser.setActive(true);
        User inactiveUser = new User("Inactive", "inactive@example.com");
        inactiveUser.setActive(false);

        entityManager.persist(activeUser);
        entityManager.persist(inactiveUser);
        entityManager.flush();

        List<User> activeUsers = userRepository.findByActiveTrue();

        assertThat(activeUsers).hasSize(1);
        assertThat(activeUsers.get(0).getName()).isEqualTo("Active");
    }
}
```

## What Is @JsonTest?

`@JsonTest` tests JSON serialization and deserialization:

```java
@JsonTest
class UserJsonTest {

    @Autowired
    private JacksonTester<User> json;

    @Test
    void shouldSerializeUser() throws Exception {
        User user = new User(1L, "John", "john@example.com");

        assertThat(this.json.write(user)).isEqualToJson("user.json");
        assertThat(this.json.write(user)).hasJsonPathStringValue("@.name");
        assertThat(this.json.write(user)).extractingJsonPathStringValue("@.name")
                .isEqualTo("John");
    }

    @Test
    void shouldDeserializeUser() throws Exception {
        String content = """
            {
                "id": 1,
                "name": "John",
                "email": "john@example.com"
            }
            """;

        assertThat(this.json.parse(content))
                .usingRecursiveComparison()
                .isEqualTo(new User(1L, "John", "john@example.com"));
    }
}
```

## What Is @MockBean vs @Mock?

- **@MockBean**: Creates mock and adds it to application context
- **@Mock**: Creates mock but doesn't add to Spring context

```java
@SpringBootTest
class ServiceTest {

    @MockBean  // Spring will inject this mock
    private ExternalService externalService;

    @Autowired
    private UserService userService; // Will receive the mocked ExternalService

    @Test
    void shouldUseExternalService() {
        when(externalService.validateEmail("test@example.com")).thenReturn(true);

        boolean result = userService.isValidEmail("test@example.com");

        assertThat(result).isTrue();
        verify(externalService).validateEmail("test@example.com");
    }
}

@ExtendWith(MockitoExtension.class)
class UnitTest {

    @Mock  // Pure Mockito mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void shouldCreateUser() {
        User user = new User("John", "john@example.com");
        when(userRepository.save(any(User.class))).thenReturn(user);

        User result = userService.createUser(user);

        assertThat(result).isEqualTo(user);
    }
}
```

## How to Test Reactive Applications?

```java
@WebFluxTest(UserController.class)
class ReactiveUserControllerTest {

    @Autowired
    private WebTestClient webTestClient;

    @MockBean
    private UserService userService;

    @Test
    void shouldReturnUser() {
        User user = new User(1L, "John", "john@example.com");
        when(userService.findById(1L)).thenReturn(Mono.just(user));

        webTestClient.get()
                .uri("/users/1")
                .exchange()
                .expectStatus().isOk()
                .expectBody(User.class)
                .value(u -> assertThat(u.getName()).isEqualTo("John"));
    }

    @Test
    void shouldStreamUsers() {
        Flux<User> users = Flux.just(
                new User(1L, "John", "john@example.com"),
                new User(2L, "Jane", "jane@example.com")
        );
        when(userService.findAll()).thenReturn(users);

        webTestClient.get()
                .uri("/users")
                .exchange()
                .expectStatus().isOk()
                .expectBodyList(User.class)
                .hasSize(2)
                .contains(new User(1L, "John", "john@example.com"));
    }
}

// Testing reactive streams with StepVerifier
@Test
void shouldTestReactiveStream() {
    Flux<String> flux = userService.getUserNames()
            .filter(name -> name.startsWith("J"));

    StepVerifier.create(flux)
            .expectNext("John")
            .expectNext("Jane")
            .verifyComplete();
}
```

## What Are the Testing Strategies for Reactive Applications?

Testing reactive applications requires specific tools and approaches:

```java
@ExtendWith(SpringExtension.class)
@WebFluxTest(UserController.class)
class UserControllerTest {

    @Autowired
    private WebTestClient webTestClient;

    @MockBean
    private UserService userService;

    @Test
    void shouldReturnUser() {
        User user = new User("1", "John Doe");
        when(userService.findById("1")).thenReturn(Mono.just(user));

        webTestClient.get()
                .uri("/users/1")
                .exchange()
                .expectStatus().isOk()
                .expectBody(User.class)
                .value(u -> assertThat(u.getName()).isEqualTo("John Doe"));
    }

    @Test
    void shouldStreamUsers() {
        Flux<User> users = Flux.just(
                new User("1", "John"),
                new User("2", "Jane")
        );
        when(userService.findAll()).thenReturn(users);

        webTestClient.get()
                .uri("/users")
                .exchange()
                .expectStatus().isOk()
                .expectBodyList(User.class)
                .hasSize(2);
    }
}
```

## How to Test Reactive Streams with StepVerifier?

StepVerifier is the main testing tool for reactive streams:

```java
@Test
void testReactiveStream() {
    Flux<String> flux = Flux.just("A", "B", "C");

    StepVerifier.create(flux)
            .expectNext("A")
            .expectNext("B")
            .expectNext("C")
            .verifyComplete();
}

@Test
void testReactiveStreamWithError() {
    Flux<String> flux = Flux.just("A", "B")
            .concatWith(Flux.error(new RuntimeException("Error")));

    StepVerifier.create(flux)
            .expectNext("A")
            .expectNext("B")
            .expectError(RuntimeException.class)
            .verify();
}

@Test
void testReactiveStreamWithTime() {
    Flux<Long> flux = Flux.interval(Duration.ofSeconds(1)).take(3);

    StepVerifier.withVirtualTime(() -> flux)
            .expectSubscription()
            .thenAwait(Duration.ofSeconds(3))
            .expectNext(0L, 1L, 2L)
            .verifyComplete();
}
```

**Reactive Streams Debugging Tip:** Use `.log()` in Reactor to trace events.

**Key Point:** While WebFlux offers powerful scalability, evaluate its trade-offs, especially if your team or existing ecosystem is deeply familiar with blocking paradigms like Spring MVC.

## How to Test Security Configuration?

```java
@SpringBootTest
@AutoConfigureTestDatabase
class SecurityIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void shouldRequireAuthentication() {
        ResponseEntity<String> response = restTemplate.getForEntity("/users", String.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void shouldAllowAuthenticatedAccess() {
        ResponseEntity<String> response = restTemplate
                .withBasicAuth("user", "password")
                .getForEntity("/users", String.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }
}

@WebMvcTest
@Import(SecurityConfig.class)
class SecurityWebMvcTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(roles = "USER")
    void shouldAllowUserAccess() throws Exception {
        mockMvc.perform(get("/users"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldAllowAdminAccess() throws Exception {
        mockMvc.perform(delete("/users/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void shouldDenyUnauthenticatedAccess() throws Exception {
        mockMvc.perform(get("/users"))
                .andExpect(status().isUnauthorized());
    }
}
```

## What Is @TestConfiguration?

`@TestConfiguration` provides test-specific configuration:

```java
@TestConfiguration
public class TestConfig {

    @Bean
    @Primary
    public Clock testClock() {
        return Clock.fixed(Instant.parse("2023-01-01T00:00:00Z"), ZoneOffset.UTC);
    }

    @Bean
    @Primary
    public EmailService mockEmailService() {
        return Mockito.mock(EmailService.class);
    }
}

@SpringBootTest
@Import(TestConfig.class)
class UserServiceTest {

    @Autowired
    private UserService userService;

    @Autowired
    private Clock clock;

    @Test
    void shouldUseFixedClock() {
        User user = userService.createUser(new User("John", "john@example.com"));
        assertThat(user.getCreatedAt()).isEqualTo(Instant.parse("2023-01-01T00:00:00Z"));
    }
}
```

## How to Test Database Transactions?

```java
@SpringBootTest
@Transactional
class TransactionTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Test
    @Rollback(false)  // Don't rollback this test
    void shouldCommitTransaction() {
        User user = new User("John", "john@example.com");
        userService.createUser(user);

        assertThat(userRepository.count()).isEqualTo(1);
    }

    @Test
    void shouldRollbackTransaction() {
        User user = new User("Jane", "jane@example.com");
        userService.createUser(user);

        // Transaction will be rolled back after test
        assertThat(userRepository.count()).isEqualTo(1);
    }

    @Test
    void shouldHandleTransactionException() {
        assertThatThrownBy(() -> userService.createUserWithError())
                .isInstanceOf(DataIntegrityViolationException.class);

        assertThat(userRepository.count()).isEqualTo(0);
    }
}
```

## What Is @DirtiesContext?

`@DirtiesContext` marks test as modifying the application context:

```java
@SpringBootTest
class ContextModifyingTest {

    @Autowired
    private ConfigurableApplicationContext context;

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    void shouldModifyContext() {
        // This test modifies the application context
        context.getBeanFactory().registerSingleton("testBean", new TestBean());
        assertThat(context.containsBean("testBean")).isTrue();
    }

    @Test
    void shouldHaveCleanContext() {
        // Context is recreated, so testBean won't exist
        assertThat(context.containsBean("testBean")).isFalse();
    }
}
```

## How to Test with Profiles?

```java
@SpringBootTest
@ActiveProfiles("test")
class ProfileBasedTest {

    @Autowired
    private EmailService emailService;

    @Test
    void shouldUseMockEmailService() {
        // Test profile uses mock email service
        assertThat(emailService).isInstanceOf(MockEmailService.class);
    }
}

@TestPropertySource(properties = {
    "spring.profiles.active=test",
    "feature.enabled=true",
    "app.version=test-version"
})
@SpringBootTest
class PropertyBasedTest {

    @Value("${app.version}")
    private String version;

    @Test
    void shouldLoadTestProperties() {
        assertThat(version).isEqualTo("test-version");
    }
}
```

## What Are Test Slices?

Test slices load only specific parts of the application context:

- **@WebMvcTest**: Web layer (controllers, filters, security)
- **@DataJpaTest**: JPA repositories and entities
- **@JsonTest**: JSON serialization/deserialization
- **@WebFluxTest**: Reactive web layer
- **@DataRedisTest**: Redis repositories
- **@DataMongoTest**: MongoDB repositories
- **@JdbcTest**: JDBC components

```java
@WebMvcTest(UserController.class)
@Import({SecurityConfig.class, CustomSerializer.class})
class UserControllerSliceTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    void shouldOnlyLoadWebLayer() {
        // Only web-related beans are loaded
        // Service layer beans are mocked
        mockMvc.perform(get("/users"))
                .andExpect(status().isOk());
    }
}
```

## How to Test Caching?

```java
@SpringBootTest
@EnableCaching
class CacheTest {

    @Autowired
    private UserService userService;

    @Autowired
    private CacheManager cacheManager;

    @Test
    void shouldCacheUserLookup() {
        // First call should hit the database
        User user1 = userService.findById(1L);

        // Second call should use cache
        User user2 = userService.findById(1L);

        assertThat(user1).isEqualTo(user2);

        Cache userCache = cacheManager.getCache("users");
        assertThat(userCache.get(1L)).isNotNull();
    }

    @Test
    void shouldEvictCache() {
        userService.findById(1L);
        userService.updateUser(1L, new User("Updated Name", "updated@example.com"));

        Cache userCache = cacheManager.getCache("users");
        assertThat(userCache.get(1L)).isNull();
    }
}
```
