# Spring WebFlux

Spring WebFlux is Spring's reactive web framework introduced in Spring 5, designed for building reactive, non-blocking web applications that can handle high concurrency with fewer threads.

## Reactive Programming Fundamentals

### What is Reactive Programming?

Reactive programming is about handling asynchronous data streams and the propagation of changes. Key principles:

- **Non-blocking**: Operations don't block threads
- **Asynchronous**: Operations complete at some point in the future
- **Back-pressure**: Consumers can signal producers to slow down
- **Resilient**: Systems remain responsive under failure

### Reactive Streams API

The foundation consists of four interfaces:

```java
public interface Publisher<T> {
    void subscribe(Subscriber<? super T> subscriber);
}

public interface Subscriber<T> {
    void onSubscribe(Subscription subscription);
    void onNext(T item);
    void onError(Throwable throwable);
    void onComplete();
}

public interface Subscription {
    void request(long n);
    void cancel();
}

public interface Processor<T, R> extends Subscriber<T>, Publisher<R> {}
```

## Project Reactor Types

### Mono - 0 or 1 Element

```java
// Creating Mono
Mono<String> mono = Mono.just("Hello");
Mono<String> emptyMono = Mono.empty();
Mono<String> errorMono = Mono.error(new RuntimeException("Error"));

// From suppliers
Mono<String> monoFromSupplier = Mono.fromSupplier(() -> "Hello World");

// From Callable
Mono<String> monoFromCallable = Mono.fromCallable(() -> {
    Thread.sleep(100);
    return "Async Hello";
});
```

### Flux - 0 to N Elements

```java
// Creating Flux
Flux<String> flux = Flux.just("A", "B", "C");
Flux<Integer> range = Flux.range(1, 5);
Flux<String> fromIterable = Flux.fromIterable(Arrays.asList("X", "Y", "Z"));

// Infinite streams
Flux<Long> interval = Flux.interval(Duration.ofSeconds(1));

// From Stream
Flux<String> fromStream = Flux.fromStream(Stream.of("a", "b", "c"));
```

## Basic Operations

### Transforming Data

```java
// Map - transform each element
Flux<String> names = Flux.just("john", "jane", "bob");
Flux<String> upperNames = names.map(String::toUpperCase);

// FlatMap - transform and flatten
Flux<String> words = Flux.just("hello world", "spring boot");
Flux<String> splitWords = words.flatMap(sentence ->
    Flux.fromArray(sentence.split(" ")));

// Filter - select elements
Flux<Integer> numbers = Flux.range(1, 10);
Flux<Integer> evenNumbers = numbers.filter(n -> n % 2 == 0);

// Take - limit elements
Flux<Integer> firstThree = numbers.take(3);

// Skip - skip elements
Flux<Integer> skipFirst = numbers.skip(2);
```

### Combining Streams

```java
// Merge - combine multiple streams
Flux<String> flux1 = Flux.just("A", "B");
Flux<String> flux2 = Flux.just("C", "D");
Flux<String> merged = Flux.merge(flux1, flux2);

// Zip - combine corresponding elements
Flux<String> names = Flux.just("John", "Jane");
Flux<Integer> ages = Flux.just(25, 30);
Flux<String> zipped = Flux.zip(names, ages,
    (name, age) -> name + " is " + age + " years old");

// Concat - sequential combination
Flux<String> concatenated = Flux.concat(flux1, flux2);
```

### Error Handling

```java
// OnErrorReturn - provide fallback value
Flux<String> withFallback = flux
    .onErrorReturn("Default Value");

// OnErrorResume - switch to alternative stream
Flux<String> withAlternative = flux
    .onErrorResume(error -> Flux.just("Alternative", "Stream"));

// Retry - retry on error
Flux<String> withRetry = flux
    .retry(3)
    .retryWhen(Retry.fixedDelay(3, Duration.ofSeconds(1)));

// DoOnError - side effect on error
Flux<String> withErrorLogging = flux
    .doOnError(error -> log.error("Error occurred", error));
```

## WebFlux Controllers

### Annotation-Based Controllers

```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public Flux<User> getAllUsers() {
        return userService.findAll();
    }

    @GetMapping("/{id}")
    public Mono<User> getUser(@PathVariable String id) {
        return userService.findById(id);
    }

    @PostMapping
    public Mono<User> createUser(@RequestBody Mono<User> userMono) {
        return userMono.flatMap(userService::save);
    }

    @PutMapping("/{id}")
    public Mono<User> updateUser(@PathVariable String id,
                                @RequestBody Mono<User> userMono) {
        return userMono.flatMap(user -> {
            user.setId(id);
            return userService.save(user);
        });
    }

    @DeleteMapping("/{id}")
    public Mono<Void> deleteUser(@PathVariable String id) {
        return userService.deleteById(id);
    }

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<User> streamUsers() {
        return userService.findAll()
            .delayElements(Duration.ofSeconds(1));
    }
}
```

### Functional Routing

```java
@Configuration
public class UserRoutes {

    @Bean
    public RouterFunction<ServerResponse> userRouter(UserHandler userHandler) {
        return RouterFunctions
            .route(GET("/api/users"), userHandler::getAllUsers)
            .andRoute(GET("/api/users/{id}"), userHandler::getUser)
            .andRoute(POST("/api/users"), userHandler::createUser)
            .andRoute(PUT("/api/users/{id}"), userHandler::updateUser)
            .andRoute(DELETE("/api/users/{id}"), userHandler::deleteUser);
    }
}

@Component
public class UserHandler {

    private final UserService userService;

    public UserHandler(UserService userService) {
        this.userService = userService;
    }

    public Mono<ServerResponse> getAllUsers(ServerRequest request) {
        return ServerResponse.ok()
            .contentType(MediaType.APPLICATION_JSON)
            .body(userService.findAll(), User.class);
    }

    public Mono<ServerResponse> getUser(ServerRequest request) {
        String id = request.pathVariable("id");
        return userService.findById(id)
            .flatMap(user -> ServerResponse.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(user))
            .switchIfEmpty(ServerResponse.notFound().build());
    }

    public Mono<ServerResponse> createUser(ServerRequest request) {
        return request.bodyToMono(User.class)
            .flatMap(userService::save)
            .flatMap(user -> ServerResponse.status(HttpStatus.CREATED)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(user));
    }
}
```

## WebClient - Reactive HTTP Client

### Basic Usage

```java
@Service
public class ExternalApiService {

    private final WebClient webClient;

    public ExternalApiService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder
            .baseUrl("https://api.example.com")
            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .build();
    }

    public Mono<User> getUser(String id) {
        return webClient.get()
            .uri("/users/{id}", id)
            .retrieve()
            .bodyToMono(User.class);
    }

    public Flux<User> getAllUsers() {
        return webClient.get()
            .uri("/users")
            .retrieve()
            .bodyToFlux(User.class);
    }

    public Mono<User> createUser(User user) {
        return webClient.post()
            .uri("/users")
            .bodyValue(user)
            .retrieve()
            .bodyToMono(User.class);
    }
}
```

### Advanced WebClient Configuration

```java
@Configuration
public class WebClientConfig {

    @Bean
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder()
            .clientConnector(new ReactorClientHttpConnector(
                HttpClient.create()
                    .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 5000)
                    .responseTimeout(Duration.ofSeconds(5))
                    .doOnConnected(conn ->
                        conn.addHandlerLast(new ReadTimeoutHandler(5))
                            .addHandlerLast(new WriteTimeoutHandler(5)))
            ))
            .defaultHeaders(headers -> {
                headers.add(HttpHeaders.USER_AGENT, "MyApp/1.0");
            })
            .filter(ExchangeFilterFunction.ofRequestProcessor(request -> {
                log.info("Request: {} {}", request.method(), request.url());
                return Mono.just(request);
            }))
            .filter(ExchangeFilterFunction.ofResponseProcessor(response -> {
                log.info("Response status: {}", response.statusCode());
                return Mono.just(response);
            }));
    }
}
```

## Reactive Data Access

### Reactive Repositories

```java
public interface UserRepository extends ReactiveMongoRepository<User, String> {

    Flux<User> findByLastName(String lastName);

    @Query("{ 'age': { $gte: ?0, $lte: ?1 } }")
    Flux<User> findByAgeBetween(int minAge, int maxAge);

    Mono<User> findByEmail(String email);

    Flux<User> findByLastNameIgnoreCase(String lastName);
}

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Flux<User> findAll() {
        return userRepository.findAll();
    }

    public Mono<User> findById(String id) {
        return userRepository.findById(id);
    }

    public Mono<User> save(User user) {
        return userRepository.save(user);
    }

    public Mono<Void> deleteById(String id) {
        return userRepository.deleteById(id);
    }
}
```

## Server-Sent Events (SSE)

### Streaming Data

```java
@RestController
public class StreamController {

    @GetMapping(value = "/events", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<String>> streamEvents() {
        return Flux.interval(Duration.ofSeconds(1))
            .map(sequence -> ServerSentEvent.<String>builder()
                .id(String.valueOf(sequence))
                .event("message")
                .data("Event " + sequence)
                .build());
    }

    @GetMapping(value = "/notifications", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<Notification> streamNotifications() {
        return notificationService.getNotificationStream()
            .delayElements(Duration.ofMillis(500));
    }
}
```

## Testing WebFlux

### Testing Controllers

```java
@WebFluxTest(UserController.class)
class UserControllerTest {

    @Autowired
    private WebTestClient webTestClient;

    @MockBean
    private UserService userService;

    @Test
    void shouldGetAllUsers() {
        List<User> users = Arrays.asList(
            new User("1", "John", "Doe"),
            new User("2", "Jane", "Smith")
        );

        when(userService.findAll()).thenReturn(Flux.fromIterable(users));

        webTestClient.get()
            .uri("/api/users")
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus().isOk()
            .expectHeader().contentType(MediaType.APPLICATION_JSON)
            .expectBodyList(User.class)
            .hasSize(2);
    }

    @Test
    void shouldGetUserById() {
        User user = new User("1", "John", "Doe");

        when(userService.findById("1")).thenReturn(Mono.just(user));

        webTestClient.get()
            .uri("/api/users/1")
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus().isOk()
            .expectBody(User.class)
            .value(u -> {
                assertEquals("John", u.getFirstName());
                assertEquals("Doe", u.getLastName());
            });
    }

    @Test
    void shouldCreateUser() {
        User user = new User("1", "John", "Doe");

        when(userService.save(any(User.class))).thenReturn(Mono.just(user));

        webTestClient.post()
            .uri("/api/users")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(user)
            .exchange()
            .expectStatus().isOk()
            .expectBody(User.class)
            .value(u -> assertEquals("John", u.getFirstName()));
    }
}
```

### Testing Reactive Services

```java
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        userService = new UserService(userRepository);
    }

    @Test
    void shouldFindAllUsers() {
        List<User> users = Arrays.asList(
            new User("1", "John", "Doe"),
            new User("2", "Jane", "Smith")
        );

        when(userRepository.findAll()).thenReturn(Flux.fromIterable(users));

        StepVerifier.create(userService.findAll())
            .expectNext(users.get(0))
            .expectNext(users.get(1))
            .verifyComplete();
    }

    @Test
    void shouldHandleError() {
        when(userRepository.findById("1"))
            .thenReturn(Mono.error(new RuntimeException("Database error")));

        StepVerifier.create(userService.findById("1"))
            .expectError(RuntimeException.class)
            .verify();
    }
}
```

## Performance Considerations

### Backpressure Handling

```java
// Drop elements when consumer is slow
Flux<Integer> withDrop = source.onBackpressureDrop();

// Buffer elements (use with caution)
Flux<Integer> withBuffer = source.onBackpressureBuffer(1000);

// Use latest element only
Flux<Integer> withLatest = source.onBackpressureLatest();

// Custom backpressure strategy
Flux<Integer> withCustom = source.onBackpressureError();
```

### Thread Pool Configuration

```java
@Configuration
public class ReactorConfig {

    @Bean
    public Scheduler customScheduler() {
        return Schedulers.newParallel("custom", 4);
    }

    @Bean
    public Scheduler ioScheduler() {
        return Schedulers.newBoundedElastic(10, 100, "io");
    }
}
```

## Common Patterns

### Request/Response with Validation

```java
@PostMapping("/users")
public Mono<ResponseEntity<User>> createUser(@RequestBody Mono<User> userMono) {
    return userMono
        .flatMap(this::validateUser)
        .flatMap(userService::save)
        .map(user -> ResponseEntity.status(HttpStatus.CREATED).body(user))
        .onErrorResume(ValidationException.class,
            ex -> Mono.just(ResponseEntity.badRequest().build()));
}

private Mono<User> validateUser(User user) {
    if (user.getEmail() == null || !user.getEmail().contains("@")) {
        return Mono.error(new ValidationException("Invalid email"));
    }
    return Mono.just(user);
}
```

### Parallel Processing

```java
public Flux<ProcessedData> processDataInParallel(Flux<Data> dataFlux) {
    return dataFlux
        .parallel(4)
        .runOn(Schedulers.parallel())
        .map(this::processData)
        .sequential();
}
```

## WebFlux vs Spring MVC

| Aspect                | WebFlux                       | Spring MVC                 |
| --------------------- | ----------------------------- | -------------------------- |
| **Programming Model** | Reactive, Non-blocking        | Imperative, Blocking       |
| **Concurrency**       | Event loop, few threads       | Thread per request         |
| **Data Types**        | Mono, Flux                    | POJOs, Collections         |
| **Performance**       | High concurrency, low latency | High throughput            |
| **Learning Curve**    | Steeper                       | Gentler                    |
| **Use Cases**         | I/O intensive, real-time      | CPU intensive, traditional |

## Best Practices

### Error Handling

- Use `onErrorResume` for recovery
- Log errors with `doOnError`
- Provide meaningful error responses
- Handle timeouts appropriately

### Performance

- Use appropriate schedulers
- Handle backpressure properly
- Avoid blocking operations
- Monitor reactive streams health

### Testing

- Use `StepVerifier` for reactive testing
- Test error scenarios
- Use `WebTestClient` for integration tests
- Mock reactive repositories properly

## Summary

WebFlux enables building reactive applications that can handle high concurrency with fewer resources. While it has a steeper learning curve, it's powerful for I/O-intensive applications and real-time systems. Choose WebFlux when you need:

- High concurrency
- Non-blocking I/O
- Streaming data
- Integration with reactive databases
- Backpressure handling
