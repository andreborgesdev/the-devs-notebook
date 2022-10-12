# Spring RESTful Web Services

### **Define RestTemplate in Spring.**

The RestTemplate is the main class meant for the client-side access for Spring-based RESTful services. The communication to the server is accomplished using the REST constraints. This is similar to other template classes such as JdbcTemplate, HibernateTemplate, etc provided by Spring. The RestTemplate provides high-level implementation details for the HTTP Methods like GET, POST, PUT, etc, and gives the methods to communicate using the URI template, URI path params, request/response types, request object, etc as part of arguments.

- Commonly used annotations like @GetMapping, @PostMapping, @PutMapping, etc are provided by this class from Spring 4.3. Prior to that, Spring provided (and still provides) @RequestMapping annotation to indicate what methods were being used.

### **What is the use of @RequestMapping?**

- The annotation is used for mapping requests to specific handler classes or methods.
- In spring, all the incoming web request routing is handled by Dispatcher Servlet. When it gets the request, it determines which controller is meant for processing the request by means of request handlers. The Dispatcher Servlet scans all the classes annotated with @Controller. The process of routing requests depends on @RequestMapping annotations that are declared inside the controller classes and their methods.

## **What are the differences between the annotations @Controller and @RestController?**

![controller-vs-rest-controller](./images/controller-vs-rest-controller.png)

### **What does the annotation @PathVariable do?**

@PathVariable annotation is used for passing the parameter with the URL that is required to get the data. Spring MVC provides support for URL customization for data retrieval using @PathVariable annotation.

### **Is it necessary to keep Spring MVC in the classpath for developing RESTful web services?**

Yes. **[Spring MVC](https://www.interviewbit.com/spring-interview-questions/)** needs to be on the classpath of the application while developing RESTful web services using Spring. This is because, the Spring MVC provides the necessary annotations like @RestController, @RequestBody, @PathVariable, etc. Hence the spring-mvc.jar needs to be on the classpath or the corresponding Maven entry in the pom.xml.

### **Define HttpMessageConverter in terms of Spring REST?**

HttpMessageConverter is a strategic interface that specified a converter for conversion between HTTP Requests and responses. Spring REST uses the HttpMessageConverter for converting responses to various data formats like JSON, XML, etc. Spring makes use of the “Accept” header for determining the type of content the client expects. Based on this, Spring would find the registered message converter interface that is capable of this conversion.