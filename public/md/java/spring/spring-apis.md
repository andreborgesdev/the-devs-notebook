# Spring and RESTful Web Services

## Overview

Spring makes it easy to create RESTful APIs by providing powerful annotations, simplified request mapping, and easy HTTP client tools like **RestTemplate**. RESTful services follow standard HTTP methods and response codes, making integration with other systems straightforward.

## RestTemplate

`RestTemplate` is Spring's main class for **client-side HTTP access**.  
It simplifies consuming RESTful services:

- Supports methods like **GET**, **POST**, **PUT**, **DELETE**.
- Handles URI templates, path parameters, and request/response mapping.
- Similar in style to Spring's `JdbcTemplate` and `HibernateTemplate`.

```java
RestTemplate restTemplate = new RestTemplate();
String result = restTemplate.getForObject("http://api.example.com/data", String.class);
```

> 🔎 **Note**: As of Spring 5, consider using the **WebClient** from Spring WebFlux for reactive and non-blocking calls.

## Core Annotations for REST APIs

| Annotation                                                     | Purpose                                                                        |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `@RequestMapping`                                              | Maps HTTP requests to controller methods.                                      |
| `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping` | Shorthand for `@RequestMapping` with specific HTTP methods (since Spring 4.3). |
| `@PathVariable`                                                | Binds a URL path variable to a method parameter.                               |
| `@RequestBody`                                                 | Maps the body of a request to a Java object.                                   |
| `@ResponseBody`                                                | Returns Java objects as JSON/XML in the HTTP response.                         |
| `@RestController`                                              | A convenience annotation combining `@Controller` and `@ResponseBody`.          |

## Example: Basic REST Controller

```java
@RestController
@RequestMapping("/api")
public class ProductController {

    @GetMapping("/products/{id}")
    public Product getProduct(@PathVariable Long id) {
        return productService.getById(id);
    }

    @PostMapping("/products")
    public Product addProduct(@RequestBody Product product) {
        return productService.save(product);
    }
}
```

## @Controller vs @RestController

| `@Controller`                                        | `@RestController`                         |
| ---------------------------------------------------- | ----------------------------------------- |
| Returns **views** (like JSP or Thymeleaf templates). | Returns **JSON/XML** by default.          |
| Needs `@ResponseBody` to return data.                | `@ResponseBody` is automatically applied. |

![controller-vs-rest-controller](./images/controller-vs-rest-controller.png)

## DispatcherServlet & Request Mapping

- The **DispatcherServlet** routes incoming HTTP requests to appropriate controllers.
- It scans for `@Controller` or `@RestController` annotations.
- Uses `@RequestMapping` (and related annotations) to map methods to request paths.

## @PathVariable

`@PathVariable` extracts data from the URI.

```java
@GetMapping("/users/{id}")
public User getUser(@PathVariable("id") Long id) {
    return userService.findById(id);
}
```

## HttpMessageConverter

Spring uses **HttpMessageConverter** to:

- Convert Java objects to HTTP responses (JSON, XML, etc.).
- Parse HTTP requests into Java objects.

**Content negotiation** uses the `Accept` header to determine which `HttpMessageConverter` to apply.

> ✅ **Tip**: Spring Boot auto-configures common message converters (e.g., Jackson for JSON).

## Spring MVC Dependency

Spring MVC (`spring-webmvc`) **must be included** when building RESTful services. It provides:

- Core annotations like `@RestController`, `@RequestMapping`, `@RequestBody`.
- Infrastructure for request handling and message conversion.

**Maven dependency example**:

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-webmvc</artifactId>
</dependency>
```

## Advanced RestTemplate Usage

### RestTemplate with Headers and Error Handling

```java
@Service
public class ApiService {

    private final RestTemplate restTemplate;

    public ApiService() {
        this.restTemplate = new RestTemplate();
        this.restTemplate.setErrorHandler(new CustomResponseErrorHandler());
    }

    public User getUserWithHeaders(Long id) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + getToken());
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<User> response = restTemplate.exchange(
            "http://api.example.com/users/{id}",
            HttpMethod.GET,
            entity,
            User.class,
            id
        );

        return response.getBody();
    }

    public void createUserWithRetry(User user) {
        RetryTemplate retryTemplate = new RetryTemplate();
        retryTemplate.setRetryPolicy(new SimpleRetryPolicy(3));

        retryTemplate.execute(context -> {
            return restTemplate.postForObject("/users", user, User.class);
        });
    }
}

@Component
public class CustomResponseErrorHandler implements ResponseErrorHandler {

    @Override
    public boolean hasError(ClientHttpResponse response) throws IOException {
        return response.getStatusCode().series() == HttpStatus.Series.CLIENT_ERROR ||
               response.getStatusCode().series() == HttpStatus.Series.SERVER_ERROR;
    }

    @Override
    public void handleError(ClientHttpResponse response) throws IOException {
        if (response.getStatusCode().series() == HttpStatus.Series.CLIENT_ERROR) {
            throw new ClientException("Client error: " + response.getStatusCode());
        } else if (response.getStatusCode().series() == HttpStatus.Series.SERVER_ERROR) {
            throw new ServerException("Server error: " + response.getStatusCode());
        }
    }
}
```

### RestTemplate Configuration

```java
@Configuration
public class RestTemplateConfig {

    @Bean
    public RestTemplate restTemplate() {
        RestTemplate restTemplate = new RestTemplate();

        // Configure timeouts
        HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
        factory.setConnectTimeout(5000);
        factory.setReadTimeout(10000);
        restTemplate.setRequestFactory(factory);

        // Add interceptors
        restTemplate.getInterceptors().add(new LoggingInterceptor());
        restTemplate.getInterceptors().add(new AuthenticationInterceptor());

        return restTemplate;
    }

    @Bean
    public RestTemplate secureRestTemplate() {
        RestTemplate restTemplate = new RestTemplate();

        // SSL configuration
        SSLContext sslContext = SSLContextBuilder.create()
            .loadTrustMaterial(trustStore, trustStorePassword)
            .loadKeyMaterial(keyStore, keyStorePassword)
            .build();

        SSLConnectionSocketFactory socketFactory = new SSLConnectionSocketFactory(sslContext);
        HttpClient httpClient = HttpClients.custom().setSSLSocketFactory(socketFactory).build();

        restTemplate.setRequestFactory(new HttpComponentsClientHttpRequestFactory(httpClient));

        return restTemplate;
    }
}
```

## Advanced Controller Features

### Request and Response Handling

```java
@RestController
@RequestMapping("/api/v1/users")
@Validated
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<PagedResponse<User>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String search) {

        Pageable pageable = PageRequest.of(page, size,
            sortDir.equals("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending());

        Page<User> users = search != null ?
            userService.searchUsers(search, pageable) :
            userService.getAllUsers(pageable);

        PagedResponse<User> response = new PagedResponse<>(
            users.getContent(),
            users.getNumber(),
            users.getSize(),
            users.getTotalElements(),
            users.getTotalPages(),
            users.isLast()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable @Min(1) Long id) {
        User user = userService.findById(id);
        return ResponseEntity.ok()
            .cacheControl(CacheControl.maxAge(300, TimeUnit.SECONDS))
            .eTag(String.valueOf(user.getVersion()))
            .body(user);
    }

    @PostMapping
    public ResponseEntity<User> createUser(
            @Valid @RequestBody CreateUserRequest request,
            UriComponentsBuilder uriBuilder) {

        User createdUser = userService.createUser(request);

        URI location = uriBuilder.path("/api/v1/users/{id}")
            .buildAndExpand(createdUser.getId())
            .toUri();

        return ResponseEntity.created(location).body(createdUser);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request,
            @RequestHeader(value = "If-Match", required = false) String etag) {

        if (etag != null) {
            userService.validateVersion(id, etag);
        }

        User updatedUser = userService.updateUser(id, request);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<User> updateUserStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {

        User updatedUser = userService.patchUser(id, updates);
        return ResponseEntity.ok(updatedUser);
    }
}
```

### Advanced Request Mapping

```java
@RestController
public class AdvancedMappingController {

    @RequestMapping(
        value = "/api/data",
        method = RequestMethod.GET,
        produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE},
        consumes = MediaType.APPLICATION_JSON_VALUE,
        headers = "X-API-Version=1.0",
        params = "format=json"
    )
    public ResponseEntity<Data> getData() {
        return ResponseEntity.ok(new Data());
    }

    @GetMapping(value = "/files/{filename:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        Resource file = fileService.loadFileAsResource(filename);

        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
            .body(file);
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("description") String description) {

        String fileId = fileService.storeFile(file, description);
        return ResponseEntity.ok(fileId);
    }
}
```

## Exception Handling

### Global Exception Handler

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFound(UserNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(
            "USER_NOT_FOUND",
            ex.getMessage(),
            Instant.now()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleValidationErrors(
            MethodArgumentNotValidException ex) {

        ValidationErrorResponse error = new ValidationErrorResponse(
            "VALIDATION_FAILED",
            "Request validation failed",
            Instant.now()
        );

        ex.getBindingResult().getFieldErrors().forEach(fieldError ->
            error.addFieldError(fieldError.getField(), fieldError.getDefaultMessage())
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(
            DataIntegrityViolationException ex) {

        ErrorResponse error = new ErrorResponse(
            "DATA_INTEGRITY_VIOLATION",
            "Data integrity constraint violated",
            Instant.now()
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        ErrorResponse error = new ErrorResponse(
            "INTERNAL_SERVER_ERROR",
            "An unexpected error occurred",
            Instant.now()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
```

## Content Negotiation

### Multiple Response Formats

```java
@RestController
public class ContentNegotiationController {

    @GetMapping(value = "/data", produces = {
        MediaType.APPLICATION_JSON_VALUE,
        MediaType.APPLICATION_XML_VALUE,
        "application/vnd.api.v1+json"
    })
    public ResponseEntity<Data> getData(HttpServletRequest request) {
        Data data = dataService.getData();

        String acceptHeader = request.getHeader("Accept");
        if (acceptHeader != null && acceptHeader.contains("application/vnd.api.v1+json")) {
            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/vnd.api.v1+json"))
                .body(data);
        }

        return ResponseEntity.ok(data);
    }
}

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
        configurer
            .favorParameter(true)
            .parameterName("format")
            .ignoreAcceptHeader(false)
            .useRegisteredExtensionsOnly(false)
            .defaultContentType(MediaType.APPLICATION_JSON)
            .mediaType("json", MediaType.APPLICATION_JSON)
            .mediaType("xml", MediaType.APPLICATION_XML);
    }
}
```

## API Versioning

### URL Versioning

```java
@RestController
@RequestMapping("/api/v1/users")
public class UserV1Controller {

    @GetMapping("/{id}")
    public UserV1 getUser(@PathVariable Long id) {
        return userService.getUserV1(id);
    }
}

@RestController
@RequestMapping("/api/v2/users")
public class UserV2Controller {

    @GetMapping("/{id}")
    public UserV2 getUser(@PathVariable Long id) {
        return userService.getUserV2(id);
    }
}
```

### Header Versioning

```java
@RestController
public class VersionedController {

    @GetMapping(value = "/users/{id}", headers = "X-API-Version=1.0")
    public UserV1 getUserV1(@PathVariable Long id) {
        return userService.getUserV1(id);
    }

    @GetMapping(value = "/users/{id}", headers = "X-API-Version=2.0")
    public UserV2 getUserV2(@PathVariable Long id) {
        return userService.getUserV2(id);
    }
}
```

## API Documentation

### OpenAPI/Swagger Integration

```java
@Configuration
@EnableSwagger2
public class SwaggerConfig {

    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2)
            .select()
            .apis(RequestHandlerSelectors.basePackage("com.example.controller"))
            .paths(PathSelectors.any())
            .build()
            .apiInfo(apiInfo())
            .securitySchemes(Arrays.asList(apiKey()))
            .securityContexts(Arrays.asList(securityContext()));
    }

    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
            .title("User Management API")
            .description("REST API for managing users")
            .version("1.0.0")
            .contact(new Contact("API Team", "https://example.com", "api@example.com"))
            .build();
    }

    private ApiKey apiKey() {
        return new ApiKey("JWT", "Authorization", "header");
    }

    private SecurityContext securityContext() {
        return SecurityContext.builder()
            .securityReferences(defaultAuth())
            .forPaths(PathSelectors.regex("/api/.*"))
            .build();
    }
}

@RestController
@Api(tags = "User Management")
public class DocumentedController {

    @ApiOperation(value = "Get user by ID", response = User.class)
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Successfully retrieved user"),
        @ApiResponse(code = 404, message = "User not found"),
        @ApiResponse(code = 500, message = "Internal server error")
    })
    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUser(
            @ApiParam(value = "User ID", required = true) @PathVariable Long id) {

        User user = userService.findById(id);
        return ResponseEntity.ok(user);
    }
}
```

## Testing REST Controllers

### MockMvc Testing

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

        mockMvc.perform(get("/api/v1/users/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("John"))
                .andExpect(jsonPath("$.email").value("john@example.com"));
    }

    @Test
    void shouldCreateUser() throws Exception {
        CreateUserRequest request = new CreateUserRequest("John", "john@example.com");
        User createdUser = new User(1L, "John", "john@example.com");

        when(userService.createUser(any(CreateUserRequest.class))).thenReturn(createdUser);

        mockMvc.perform(post("/api/v1/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(header().exists("Location"))
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void shouldHandleValidationErrors() throws Exception {
        CreateUserRequest request = new CreateUserRequest("", "invalid-email");

        mockMvc.perform(post("/api/v1/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpected(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_FAILED"))
                .andExpect(jsonPath("$.fieldErrors").isArray());
    }
}
```

## Summary

- Use `RestTemplate` (or WebClient) for consuming APIs.
- Annotate controllers with `@RestController`.
- Use `@RequestMapping` or `@GetMapping`/`@PostMapping` for routing.
- Handle data binding with `@RequestBody` and `@PathVariable`.
- Let Spring auto-convert responses using `HttpMessageConverter`.
- Implement proper error handling with `@RestControllerAdvice`.
- Use content negotiation for multiple response formats.
- Implement API versioning strategies.
- Document APIs with OpenAPI/Swagger.
- Test controllers comprehensively with MockMvc.
