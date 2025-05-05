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

## Summary

- Use `RestTemplate` (or WebClient) for consuming APIs.
- Annotate controllers with `@RestController`.
- Use `@RequestMapping` or `@GetMapping`/`@PostMapping` for routing.
- Handle data binding with `@RequestBody` and `@PathVariable`.
- Let Spring auto-convert responses using `HttpMessageConverter`.
