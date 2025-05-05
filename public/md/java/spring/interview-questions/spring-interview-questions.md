# Interview Questions

## Define RestTemplate in Spring

The `RestTemplate` is the main class for client-side access to Spring-based RESTful services. Communication to the server is accomplished using REST constraints. This is similar to other template classes such as `JdbcTemplate`, `HibernateTemplate`, etc. provided by Spring.

The `RestTemplate` provides high-level methods for HTTP methods like GET, POST, PUT, etc., and supports communication using URI templates, URI path parameters, request/response types, and request objects.

**Note:** Commonly used annotations like `@GetMapping`, `@PostMapping`, `@PutMapping`, etc., are provided by Spring 4.3 and later. Prior to that, Spring used `@RequestMapping`.

## What is the use of @RequestMapping?

- Maps requests to specific handler classes or methods.
- In Spring, all incoming web requests are routed by the `DispatcherServlet`. It determines the appropriate controller by scanning classes annotated with `@Controller`.
- Request routing depends on `@RequestMapping` annotations declared in controller classes and their methods.

## What are the differences between the annotations @Controller and @RestController?

| Annotation        | Purpose                                                                                                                          |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `@Controller`     | Returns a `ModelAndView` object and typically used with views (e.g., JSP).                                                       |
| `@RestController` | A specialized version of `@Controller`. Returns data directly (usually JSON or XML). Combines `@Controller` and `@ResponseBody`. |

## What does the annotation @PathVariable do?

The `@PathVariable` annotation is used to bind a method parameter to a URI template variable. It allows parameters to be passed within the URL for data retrieval.

## Is it necessary to keep Spring MVC in the classpath for developing RESTful web services?

Yes. `spring-mvc.jar` (or the corresponding Maven dependency) must be present in the classpath because Spring MVC provides essential annotations like `@RestController`, `@RequestBody`, `@PathVariable`, etc.

## Define HttpMessageConverter in terms of Spring REST

`HttpMessageConverter` is a strategic interface that specifies a converter for transforming HTTP requests and responses.

Spring REST uses `HttpMessageConverter` to convert responses into various formats like JSON or XML. It inspects the "Accept" header in the request to determine the client's expected content type and selects an appropriate converter accordingly.

## Related Topics

- [Spring Core](Spring%20Core%20e80121a710a14a39aa3170669e655826.md)
- [Spring Web MVC](Spring%20Web%20MVC%20dfb585c1f96042a18d497b0ad0fd9986.md)
- [Spring Data Access](Spring%20Data%20Access%20fca946c53fe8419cb892fe82173848d2.md)
- [Spring Aspect-Oriented Programming](Spring%20Aspect-Oriented%20Programming%20049138f78e634aff86e01b96f517e573.md)
- [Spring 5](Spring%205%20fef4c59b486f403089bee14d24f87bec.md)
