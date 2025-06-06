# Spring Web MVC

**For more Spring MVC questions, please check out our article on [Spring MVC interview questions](https://www.baeldung.com/spring-mvc-interview-questions).**

## How to Get _ServletContext_ and _ServletConfig_ Objects in a Spring Bean?

We can access them by implementing Spring-aware interfaces or using the _@Autowired_ annotation:

```java
@Autowired
ServletContext servletContext;

@Autowired
ServletConfig servletConfig;
```

## What Is a Controller in Spring MVC?

All the requests processed by the _DispatcherServlet_ are directed to classes annotated with _@Controller_. Each controller class maps one or more requests to methods that process and execute the requests.

The _Front Controller_ in Spring MVC intercepts incoming requests, converts the payload into an internal data structure, forwards it to the _Model_ for processing, and then passes the results to the _View_ for rendering.

![Spring MVC Architecture](https://www.baeldung.com/wp-content/uploads/2016/08/SpringMVC.png)

## How Does the _@RequestMapping_ Annotation Work?

The _@RequestMapping_ annotation maps web requests to controller methods. It can handle HTTP headers, URI parts using _@PathVariable_, and URI parameters with _@RequestParam_.

More details: [Spring RequestMapping](https://www.baeldung.com/spring-requestmapping).

## What's the Difference Between @RestController and @Controller?

- **@Controller** is used to mark a class as a Spring MVC controller.
- **@RestController** is a specialized version of _@Controller_ that combines it with _@ResponseBody_. Methods return data directly, typically as JSON or XML.

### Key Differences:

1. _@Controller_ is general-purpose, while _@RestController_ is optimized for RESTful web services.
2. _@RestController_ implicitly adds _@ResponseBody_ to all methods, so you don't need to annotate them individually.
3. _@Controller_ works with view resolution (returns views), while _@RestController_ returns data objects.
4. _@RestController_ was introduced in Spring 4.0, _@Controller_ has been around since Spring 2.5.

### Example:

**Using @RestController:**

```java
@RestController
public class BookController {

    @RequestMapping("/book")
    public Book getBook() {
        return new Book("Spring in Action", "Craig Walls");
    }
}
```

**Using @Controller:**

```java
@Controller
public class BookController {

    @RequestMapping("/book")
    @ResponseBody
    public Book getBook() {
        return new Book("Spring in Action", "Craig Walls");
    }
}
```

## What Is the DispatcherServlet?

The DispatcherServlet is the front controller in Spring MVC that:

- Receives all HTTP requests
- Delegates to appropriate handlers (controllers)
- Manages the request-response lifecycle
- Handles view resolution and rendering

## Explain the Spring MVC Request Flow

1. **DispatcherServlet** receives the request
2. **HandlerMapping** finds the appropriate controller
3. **HandlerAdapter** executes the controller method
4. Controller processes request and returns **ModelAndView**
5. **ViewResolver** resolves the view name
6. **View** renders the response
7. DispatcherServlet returns response to client

## What Are the Different Types of @RequestMapping?

```java
@GetMapping("/users")           // GET requests
@PostMapping("/users")          // POST requests
@PutMapping("/users/{id}")      // PUT requests
@DeleteMapping("/users/{id}")   // DELETE requests
@PatchMapping("/users/{id}")    // PATCH requests
```

## What Is @PathVariable and How Is It Used?

`@PathVariable` extracts values from URI template variables:

```java
@GetMapping("/users/{id}")
public User getUser(@PathVariable Long id) {
    return userService.findById(id);
}

@GetMapping("/users/{id}/orders/{orderId}")
public Order getOrder(@PathVariable Long id, @PathVariable Long orderId) {
    return orderService.findByUserAndId(id, orderId);
}
```

## What Is @RequestParam and Its Difference from @PathVariable?

`@RequestParam` extracts query parameters from URL:

```java
@GetMapping("/users")
public List<User> getUsers(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size,
    @RequestParam(required = false) String name) {
    return userService.findUsers(page, size, name);
}
```

**Differences:**

- `@PathVariable`: Extracts from URI path (`/users/{id}`)
- `@RequestParam`: Extracts from query string (`/users?page=1&size=10`)

## What Is @RequestBody and @ResponseBody?

- **@RequestBody**: Binds HTTP request body to method parameter
- **@ResponseBody**: Serializes return value to HTTP response body

```java
@PostMapping("/users")
public ResponseEntity<User> createUser(@RequestBody User user) {
    User savedUser = userService.save(user);
    return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
}
```

## What Is @ModelAttribute?

`@ModelAttribute` binds request parameters to model objects:

```java
@PostMapping("/users")
public String createUser(@ModelAttribute User user, Model model) {
    userService.save(user);
    model.addAttribute("message", "User created successfully");
    return "success";
}
```

## How Do You Handle Exceptions in Spring MVC?

### 1. @ExceptionHandler (Controller-level)

```java
@Controller
public class UserController {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<String> handleUserNotFound(UserNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
}
```

### 2. @ControllerAdvice (Global)

```java
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFound(UserNotFoundException ex) {
        ErrorResponse error = new ErrorResponse("USER_NOT_FOUND", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidation(ValidationException ex) {
        ErrorResponse error = new ErrorResponse("VALIDATION_ERROR", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
}
```

## What Is Content Negotiation in Spring MVC?

Content negotiation determines response format based on client requirements:

```java
@GetMapping(value = "/users/{id}", produces = {
    MediaType.APPLICATION_JSON_VALUE,
    MediaType.APPLICATION_XML_VALUE
})
public User getUser(@PathVariable Long id) {
    return userService.findById(id);
}
```

## What Are HTTP Status Codes and How to Return Them?

```java
@PostMapping("/users")
public ResponseEntity<User> createUser(@RequestBody User user) {
    if (userService.existsByEmail(user.getEmail())) {
        return ResponseEntity.status(HttpStatus.CONFLICT).build();
    }
    User savedUser = userService.save(user);
    return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
}

@DeleteMapping("/users/{id}")
public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
    userService.deleteById(id);
    return ResponseEntity.noContent().build();
}
```

## What Is Validation in Spring MVC?

Spring MVC supports Bean Validation (JSR-303/JSR-380):

```java
public class User {
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
    private String name;

    @Email(message = "Email should be valid")
    @NotBlank(message = "Email is required")
    private String email;

    @Min(value = 18, message = "Age must be at least 18")
    private Integer age;
}

@PostMapping("/users")
public ResponseEntity<User> createUser(@Valid @RequestBody User user, BindingResult result) {
    if (result.hasErrors()) {
        throw new ValidationException("Invalid user data");
    }
    User savedUser = userService.save(user);
    return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
}
```

## What Are Interceptors in Spring MVC?

Interceptors allow preprocessing and postprocessing of requests:

```java
@Component
public class LoggingInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        log.info("Request: {} {}", request.getMethod(), request.getRequestURI());
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) {
        log.info("Response status: {}", response.getStatus());
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        if (ex != null) {
            log.error("Exception occurred: ", ex);
        }
    }
}
```

## What Is CORS and How to Configure It?

Cross-Origin Resource Sharing allows web applications to make requests to different domains:

```java
@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @GetMapping("/users")
    public List<User> getUsers() {
        return userService.findAll();
    }
}

// Global CORS configuration
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

## What Is @InitBinder?

`@InitBinder` customizes data binding for controller methods:

```java
@Controller
public class UserController {

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        binder.registerCustomEditor(Date.class, new CustomDateEditor(dateFormat, false));
        binder.setDisallowedFields("id"); // Prevent binding of id field
    }
}
```

## What Is the Use of WebClient and WebTestClient?

- **WebClient**: A reactive, non-blocking HTTP client.
- **WebTestClient**: Similar to WebClient but designed for testing. It can connect to servers or mock WebFlux applications without needing an actual HTTP server.

## What Is WebClient and How to Use It?

WebClient is the reactive HTTP client replacing RestTemplate:

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
                .onStatus(HttpStatus::is4xxClientError,
                    response -> Mono.error(new ClientException("Client error")))
                .bodyToMono(User.class)
                .timeout(Duration.ofSeconds(10))
                .retryWhen(Retry.backoff(3, Duration.ofSeconds(1)));
    }

    public Mono<User> createUser(User user) {
        return webClient.post()
                .uri("/users")
                .body(Mono.just(user), User.class)
                .retrieve()
                .bodyToMono(User.class);
    }
}
```

**WebClient example:**

```java
WebClient.create()
    .get()
    .uri("/api/data")
    .retrieve()
    .bodyToMono(String.class);
```

**Reference:** [Java Code Geeks](https://www.javacodegeeks.com/2017/08/difference-restcontroller-controller-annotation-spring-mvc-rest.html)
