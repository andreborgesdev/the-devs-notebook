# Spring Aspect-Oriented Programming

# **What Is Aspect-Oriented Programming (AOP)?**

*Aspects* enable the modularization of cross-cutting concerns such as transaction management that span multiple types and objects by adding extra behavior to already existing code without modifying affected classes.

Essentially, **it is a way for adding behavior to existing code without modifying that code**.

Here is the example of [aspect-based execution time logging](https://www.baeldung.com/spring-aop-annotation).

# **What Are Aspect, Advice, Pointcut and JoinPoint in AOP?**

- ***Aspect*** – a class that implements cross-cutting concerns, such as transaction management
- ***Advice*** – the methods that get executed when a specific *JoinPoint* with matching *Pointcut* is reached in the application. [https://www.baeldung.com/spring-aop-advice-tutorial](https://www.baeldung.com/spring-aop-advice-tutorial)
- ***Pointcut*** – a set of regular expressions that are matched with *JoinPoint* to determine whether *Advice* needs to be executed or not. [https://www.baeldung.com/spring-aop-pointcut-tutorial](https://www.baeldung.com/spring-aop-pointcut-tutorial)
- ***JoinPoint*** – a point during the execution of a program, such as the execution of a method or the handling of an exception

# **What Is Weaving?**

According to the [official docs](https://docs.spring.io/spring/docs/current/spring-framework-reference/html/aop.html), *weaving* is a process that links aspects with other application types or objects to create an advised object. This can be done at compile time, load time, or runtime. Spring AOP, like other pure Java AOP frameworks, performs *weaving* at runtime.