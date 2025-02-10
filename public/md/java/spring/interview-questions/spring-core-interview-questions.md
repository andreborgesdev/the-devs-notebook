# Spring Core

# **What Is Spring Framework?**

Spring is the most broadly used framework for the development of Java Enterprise Edition applications. Further, the core features of Spring can be used in developing any Java application.

We use its extensions for building various web applications on top of the Jakarta EE platform. We can also just use its dependency injection provisions in simple standalone applications.

# **What Are the Benefits of Using Spring?**

Spring targets to make Jakarta EE development easier, so let's look at the advantages:

- **Lightweight** – There is a slight overhead of using the framework in development.
- **Inversion of Control (IoC)** – Spring container takes care of wiring dependencies of various objects instead of creating or looking for dependent objects.
- **Aspect-Oriented Programming (AOP)** – Spring supports AOP to separate business logic from system services.
- **IoC container** – manages Spring Bean life cycle and project-specific configurations
- **MVC framework** – used to create web applications or RESTful web services, capable of returning XML/JSON responses
- **Transaction management** – reduces the amount of boilerplate code in JDBC operations, file uploading, etc., either by using Java annotations or by Spring Bean XML configuration file
- **Exception Handling** – Spring provides a convenient API for translating technology-specific exceptions into unchecked exceptions.

# **What Spring Sub-Projects Do You Know? Describe Them Briefly.**

- **Core** – a key module that provides fundamental parts of the framework, such as IoC or DI
- **JDBC** – enables a JDBC-abstraction layer that removes the need to do JDBC coding for specific vendor databases
- **ORM integration** – provides integration layers for popular object-relational mapping APIs, such as JPA, JDO and Hibernate
- **Web** – a web-oriented integration module that provides multipart file upload, Servlet listeners and web-oriented application context functionalities
- **MVC framework** – a web module implementing the Model View Controller design pattern
- **AOP module** – aspect-oriented programming implementation allowing the definition of clean method-interceptors and pointcuts

# Interceptors

In order to understand how a Spring interceptor works, let's take a step back and look at the *HandlerMapping*.

The purpose of *HandlerMapping* is to map a handler method to a URL. That way, the *DispatcherServlet* will be able to invoke it when processing a request.

As a matter of fact, the *DispatcherServlet* uses the *HandlerAdapter* to actually invoke the method.

In short, interceptors intercept requests and process them. They help to avoid repetitive handler code such as logging and authorization checks.

Simply put, a **Spring interceptor is a class that either extends the *HandlerInterceptorAdapter* class or implements the *HandlerInterceptor* interface**.

The *HandlerInterceptor* contains three main methods:

- *prehandle()* – called before the execution of the actual handler
- *postHandle()* – called after the handler is executed
- *afterCompletion()* – called after the complete request is finished and the view is generated

These three methods provide flexibility to do all kinds of pre- and post-processing.

# Actuator

In essence, Actuator brings production-ready features to our application.

**Monitoring our app, gathering metrics, understanding traffic, or the state of our database become trivial with this dependency.**

The main benefit of this library is that we can get production-grade tools without having to actually implement these features ourselves.

Actuator is mainly used to **expose operational information about the running application** — health, metrics, info, dump, env, etc. It uses HTTP endpoints or JMX beans to enable us to interact with it.

Once this dependency is on the classpath, several endpoints are available for us out of the box. As with most Spring modules, we can easily configure or extend it in many ways.

# **What Is Dependency Injection?**

Dependency injection, an aspect of Inversion of Control (IoC), is a general concept stating that we do not create our objects manually but instead describe how they should be created. Then an IoC container will instantiate required classes if needed.

# **How Can We Inject Beans in Spring?**

A few different options exist in order to inject Spring beans:

- Setter injection
- Constructor injection
- Field injection

The configuration can be done using XML files or annotations.

For more details, check [this article](https://www.baeldung.com/inversion-control-and-dependency-injection-in-spring).

# **Which Is the Best Way of Injecting Beans and Why?**

**The recommended approach is to use constructor arguments for mandatory dependencies and setters for optional ones**. This is because constructor injection allows injecting values to immutable fields and makes testing easier.

# **What Is the Difference Between BeanFactory and ApplicationContext?**

*BeanFactory* is an interface representing a container that provides and manages bean instances. The default implementation instantiates beans lazily when *getBean()* is called.

In contrast, *ApplicationContext* is an interface representing a container holding all information, metadata and beans in the application. It also extends the *BeanFactory* interface, but the default implementation instantiates beans eagerly when the application starts. However, this behavior can be overridden for individual beans.

For all differences, please refer to [the documentation](https://docs.spring.io/spring/docs/current/spring-framework-reference/html/beans.html).

# **What Is a Spring Bean?**

The Spring Beans are Java Objects that are initialized by the Spring IoC container.

# **What Is the Default Bean Scope in Spring Framework?**

By default, a Spring Bean is initialized as a *singleton*.

# **How to Define the Scope of a Bean?**

In order to set Spring Bean's scope, we can use *@Scope* annotation or “scope” attribute in XML configuration files. Note that there are five supported scopes:

- **Singleton**
- **Prototype**
- **Request**
- **Session**
- **Global-session**

For differences, please look [here](https://docs.spring.io/spring/docs/3.0.0.M4/reference/html/ch03s05.html).

# **Are Singleton Beans Thread-Safe?**

No, singleton beans are not thread-safe, as thread safety is about execution, whereas the singleton is a design pattern focusing on creation. Thread safety depends only on the bean implementation itself.

# **What Does the Spring Bean Life Cycle Look Like?**

First, a Spring bean needs to be instantiated based on Java or XML bean definition. It may also be required to perform some initialization to get it into a usable state. After that, when the bean is no longer required, it will be removed from the IoC container.

![https://i0.wp.com/www.dineshonjava.com/wp-content/uploads/2012/06/Spring-Bean-Life-Cycle.jpg?w=530&ssl=1](https://i0.wp.com/www.dineshonjava.com/wp-content/uploads/2012/06/Spring-Bean-Life-Cycle.jpg?w=530&ssl=1)

# **What Is the Spring Java-Based Configuration?**

It's one of the ways of configuring Spring-based applications in a type-safe manner. It's an alternative to the XML-based configuration.

Also, to migrate a project from XML to Java config, please refer [to this article](https://www.baeldung.com/spring-xml-vs-java-config).

# **Can We Have Multiple Spring Configuration Files in One Project?**

Yes, in large projects, having multiple Spring configurations is recommended to increase maintainability and modularity.

We can load multiple Java-based configuration files:

```java
@Configuration
@Import({MainConfig.class, SchedulerConfig.class})
public class AppConfig {
```

Or we can load one XML file that will contain all other configs:

```java
ApplicationContext context =new ClassPathXmlApplicationContext("spring-all.xml");
```

And inside this XML file we'll have the following:

```jsx
<import resource="main.xml"/>
<import resource="scheduler.xml"/>
```

# **What Is Spring Security?**

Spring Security is a separate module of the Spring framework that focuses on providing authentication and authorization methods in Java applications. It also takes care of most of the common security vulnerabilities such as CSRF attacks.

To use Spring Security in web applications, we can get started with the simple annotation *@EnableWebSecurity*.

For more information, we have a whole series of articles related to [security](https://www.baeldung.com/security-spring).

# **What Is Spring Boot?**

Spring Boot is a project that provides a pre-configured set of frameworks to reduce boilerplate configuration. This way, we can have a Spring application up and running with the smallest amount of code.

**It takes an opinionated view of the Spring platform, which paves the way for a faster and more efficient development ecosystem**.

Here are just a few of the features in Spring Boot:

- Opinionated ‘starter' dependencies to simplify the build and application configuration
- Embedded server to avoid complexity in application deployment
- Metrics, Health check, and externalized configuration
- Automatic config for Spring functionality – whenever possible

# **Name Some of the Design Patterns Used in the Spring Framework?**

- **Singleton Pattern** – singleton-scoped beans
- **Factory Pattern** – Bean Factory classes
- **Prototype Pattern** – prototype-scoped beans
- **Adapter Pattern** – Spring Web and Spring MVC
- **Proxy Pattern** – Spring Aspect-Oriented Programming support
- **Template Method Pattern** – *JdbcTemplate*, *HibernateTemplate*, etc.
- **Front Controller** – Spring MVC *DispatcherServlet*
- **Data Access Object** – Spring DAO support
- **Model View Controller** – Spring MVC

# **How Does the Scope Singleton Work?**

When we define a bean with the *singleton* scope, the container creates a single instance of that bean; all requests for that bean name will return the same object, which is cached. Any modifications to the object will be reflected in all references to the bean. This scope is the default value if no other scope is specified.

# **How Does the Scope Prototype Work?**

Scope *prototype* means that every time we call for an instance of the Bean, Spring will create a new instance and return it. This differs from the default *singleton* scope, where a single object instance is instantiated once per Spring IoC container.

# **How Does the Scope Request Work?**

Scopes a single bean definition to the lifecycle of a single HTTP request; that is each and every HTTP request will have its own instance of a bean created off the back of a single bean definition. Only valid in the context of a web-aware Spring `ApplicationContext`.

# **How Does the Scope Session Work?**

Scopes a single bean definition to the lifecycle of a HTTP `Session`. Only valid in the context of a web-aware Spring `ApplicationContext`.

# **How Does the Scope Global Session Work?**

Scopes a single bean definition to the lifecycle of a global HTTP `Session`
. Typically only valid when used in a portlet context. Only valid in the context of a web-aware Spring `ApplicationContext`.

## Qualifier

A qualifier is a good way of creating modular components that are easily switchable. For example, if we have different implementation for different kinds of DBs we can switch between them in 1 line of code.