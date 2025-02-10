# Spring Web MVC

**For more Spring MVC questions, please check out our article on [Spring MVC interview questions](https://www.baeldung.com/spring-mvc-interview-questions)**.

# **How to Get *ServletContext* and *ServletConfig* Objects in a Spring Bean?**

We can do either by implementing Spring-aware interfaces. The complete list is available [here](http://www.buggybread.com/2015/03/spring-framework-list-of-aware.html).

We could also use *@Autowired* annotation on those beans:

```java
@Autowired
ServletContext servletContext;

@Autowired
ServletConfig servletConfig;
```

# **What Is a Controller in Spring MVC?**

Simply put, all the requests processed by the *DispatcherServlet* are directed to classes annotated with *@Controller*. Each controller class maps one or more requests to methods that process and execute the requests with provided inputs.

To take a step back, we recommend having a look at the concept of the [Front Controller in the typical Spring MVC architecture](https://www.baeldung.com/spring-controllers).

***Front Controller* in the typical Spring *Model View Controller* architecture**.

At a very high level, here are the main responsibilities we're looking at:

- Intercepts incoming requests
- Converts the payload of the request to the internal structure of the data
- Sends the data to *Model* for further processing
- Gets processed data from the *Model* and advances that data to the *View* for rendering

![https://www.baeldung.com/wp-content/uploads/2016/08/SpringMVC.png](https://www.baeldung.com/wp-content/uploads/2016/08/SpringMVC.png)

![request-controller-flow](./images/request-controller-flow.png)

# **How Does the *@RequestMapping* Annotation Work?**

The *@RequestMapping* annotation is used to map web requests to Spring Controller methods. In addition to simple use cases, we can use it for mapping of HTTP headers, binding parts of the URI with *@PathVariable,* and working with URI parameters and the *@RequestParam* annotation.

More details on *@RequestMapping* are available [here](https://www.baeldung.com/spring-requestmapping).

## What's the difference between the @RestController and the @Controller?

The `@RestController` annotation in Spring MVC is nothing but a combination of the `@Controller` and the `@ResponseBody`annotation. It was added into Spring 4.0 to make the development of RESTful Web Services in Spring framework easier. If you are familiar with the [REST web services](http://www.java67.com/2017/04/3-great-books-to-learn-java-web-services-soap-and-restful.html) you know that the fundamental difference between a web application an a REST API is that the response from a web application is a generally view of HTML + CSS + JavaScript while REST API just return data in form of JSON or XML. This difference is also obvious in the `@Controller` and the `@RestController` annotation. The job of the `@Controller` is to create a Map of model object and find a view but the `@RestController` simply returns the object and object data is directly written into HTTP response as JSON or XML. This can also be done with the traditional `@Controller` and the use of the `@ResponseBody` annotation but since this is the default behavior of RESTful Web services, Spring introduced `@RestController` which combined the behavior of `@Controller` and `@ResponseBody` together.

Here are some important differences between these two annotations.

1. The `@Controller` is a common annotation which is used to mark a class as Spring MVC Controller while the `@RestController` is a special controller used in [RESTFul web services](https://javarevisited.blogspot.sg/2015/08/difference-between-soap-and-restfull-webservice-java.html) and the equivalent of `@Controller + @ResponseBody`.
2. The `@RestController` is relatively new, added only on Spring 4.0 but `@Controller` is an old annotation, exists since Spring started supporting annotation, and officially it was added on Spring 2.5 version.
3. The `@Controller` annotation indicates that the class is a “Controller” e.g. a web controller while the `@RestController` annotation indicates that the class is a controller where `@RequestMapping` methods assume `@ResponseBody` semantics by default i.e. servicing REST API.
4. The `@Controller` is a specialization of `@Component` annotation while `@RestController` is a specialization of `@Controller` annotation. It is actually a convenience controller annotated with `@Controller` and `@ResponseBody` as shown below.
    
    
    1
    
    2
    
    3
    
    4
    
    5
    
    6
    
    `@Target(value=TYPE)`
    
    `@Retention(value=RUNTIME)`
    
    `@Documented`
    
    `@Controller`
    
    `@ResponseBody`
    
    **`public`** `@interface` `RestController`
    
    and here is how the declaration of `@Controller` looks like:
    
    1
    
    2
    
    3
    
    4
    
    5
    
    `@Target(value=TYPE)`
    
    `@Retention(value=RUNTIME)`
    
    `@Documented`
    
    `@Component`
    
    **`public`** `@interface` `Controller`
    
5. One of the key difference between `@Controler` and `@RestCotroller` in Spring MVC is that once you mark a class as `@RestController` then every method is written a domain object instead of a view. You can see Bryan Hassen’s [Introduction to Spring MVC 4](https://www.shareasale.com/m-pr.cfm?merchantID=53701&userID=880419&productID=557072989) to learn more about how to use the `@RestController` annotation in your Spring based application.
6. Another key difference between `@RestController` and `@Controller` is that you don’t need to use `@ResponseBody` on every handler method once you annotate the class with `@RestController` as shown below:
    
    **with @RestControler:**
    
    1
    
    2
    
    3
    
    4
    
    5
    
    6
    
    7
    
    8
    
    9
    
    `@RestController`
    
    **`public`** **`class`** `Book{`
    
    `@RequestMapping(value={"/book"})`
    
    **`public`** `Book getBook(){`
    
    `//...`
    
    **`return`** `book;`
    
    `}`
    
    `}`
    
    **without @RestController:**
    
    01
    
    02
    
    03
    
    04
    
    05
    
    06
    
    07
    
    08
    
    09
    
    10
    
    `@Controller`
    
    **`public`** **`class`** `Book{`
    
    `@RequestMapping(value={"/book"})`
    
    `@ResponseBody`
    
    **`public`** `Book getBook(){`
    
    `//...`
    
    **`return`** `book;`
    
    `}`
    
    `}`
    

You can see that if you use Spring MVC `@Controller` annotation to create a [RESTful response](https://javarevisited.blogspot.sg/2017/02/how-to-consume-json-from-restful-web-services-Spring-RESTTemplate-Example.html) you need to annotate each method with the `@ResponseBody` annotation, which is not required when you use `@RestController`. It not only makes your code more readable but also saves a couple of key strokes for you.

[https://www.javacodegeeks.com/2017/08/difference-restcontroller-controller-annotation-spring-mvc-rest.html](https://www.javacodegeeks.com/2017/08/difference-restcontroller-controller-annotation-spring-mvc-rest.html)