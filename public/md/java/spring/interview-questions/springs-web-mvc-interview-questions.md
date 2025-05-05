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

**Reference:** [Java Code Geeks](https://www.javacodegeeks.com/2017/08/difference-restcontroller-controller-annotation-spring-mvc-rest.html)
