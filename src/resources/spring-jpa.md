# Spring JPA

[https://www.baeldung.com/jpa-vs-jdbc](https://www.baeldung.com/jpa-vs-jdbc)

[https://en.wikipedia.org/wiki/Object–relational_impedance_mismatch](https://en.wikipedia.org/wiki/Object%E2%80%93relational_impedance_mismatch)

JPA is a specification. Hibernate, and EclipseLink are a couple of its implementations.

You have to specify the persistence provider(Hibernate, EclipseLink) in order to use the JPA implementation. The persistence providers have the implementation classes for JPA specifications.

**JPA:** It Is just a specification. In simpler words. Set of interfaces.

**Hibernate, Eclipse Link, Apache OpenJPA:** A few of the many implementations of JPA. In addition to providing the basic implementations for the JPA specifications, Hibernate and other implementations provide their additional functionalities. You can choose based on your need

**Spring Data:**

- It provides additional abstraction.
- When you use Hibernate/Eclipse Link you still have to write some boilerplate code. By using Spring JPA you can avoid that.
- The most important thing to note is Spring data uses Hibernate by Default due to Springboot's Opinionated nature. You can change the default behavior if you would like.
- When you run the following command in a Springboot project that uses Spring JPA(with default configuration), you will see Hibernate jars being used.

> Maven: mvn dependency:tree
> 
> 
> Gradle: `gradle dependencies`
> 

Use Spring JdbcTemplate if you don't want to access your database schema via a domain model. Using JdbcTemplate you are using a lower level access, with more flexibility, but probably also more boilerplate.

Spring JdbcTemplate can be more easily used with exotic database schemas and a stored procedure focus. Using JPA you need to make sure that database schema maps correctly to the domain model.

Both technologies need developers knowing relational databases, SQL and transactions. With JPA you get more hidden complexity though.

JPA is to my knowledge more easily pluggable to data caching layers, since the object oriented focus makes cache entry identification, update and invalidation easier.

You can fine tune JdbcTemplate based backends better, but there is for most cases more code involved.

Some other aspect to consider is that although with JPA you get a domain model for your database schema you will often need to use additional DTO classes. Using JdbcTemplate you can directly operate with DTO classes.

![https://vertabelo.com/blog/orms-under-the-hood/object-first-approach.png](https://vertabelo.com/blog/orms-under-the-hood/object-first-approach.png)

![https://vertabelo.com/blog/orms-under-the-hood/database-first-approach.png](https://vertabelo.com/blog/orms-under-the-hood/database-first-approach.png)

Generally, there are two approaches that are followed. The first one is **“Domain model centric”**
 in which the code drives database design, while the second one, **“Relational model centric”**
, places database design as the first step followed by the code.

[https://vertabelo.com/blog/orms-under-the-hood/](https://vertabelo.com/blog/orms-under-the-hood/)