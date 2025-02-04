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

[https://www.baeldung.com/hibernate-inheritance](https://www.baeldung.com/hibernate-inheritance)

[https://www.logicbig.com/tutorials/java-ee-tutorial/jpa/joined-table-inheritance.html](https://www.logicbig.com/tutorials/java-ee-tutorial/jpa/joined-table-inheritance.html)

# 3.3 Relations

## 3.3.1 One to One

[https://www.baeldung.com/jpa-one-to-one](https://www.baeldung.com/jpa-one-to-one)

## 3.3.2 One to Many

[https://www.baeldung.com/hibernate-one-to-many](https://www.baeldung.com/hibernate-one-to-many)

## 3.3.3 Many to Many

[https://www.baeldung.com/hibernate-many-to-many](https://www.baeldung.com/hibernate-many-to-many)

## 3.3.4 Join Column

[https://www.baeldung.com/jpa-join-column](https://www.baeldung.com/jpa-join-column)

[https://www.baeldung.com/jpa-joincolumn-vs-mappedby](https://www.baeldung.com/jpa-joincolumn-vs-mappedby)

## 3.3.5 Cascade Types

[https://www.baeldung.com/jpa-cascade-types](https://www.baeldung.com/jpa-cascade-types)

## 3.3.6 Inheritance

[https://www.baeldung.com/hibernate-inheritance](https://www.baeldung.com/hibernate-inheritance)

## 3.3.7 Lazy Loading Issue

[https://www.baeldung.com/hibernate-lazy-loading-workaround](https://www.baeldung.com/hibernate-lazy-loading-workaround)

## 3.3.8 N+1 Query Problem

[https://vladmihalcea.com/n-plus-1-query-problem/](https://vladmihalcea.com/n-plus-1-query-problem/)

# 3.4 Cascade types

The following JPA cascade types can be used in a relation:

- CascadeType.PERSIST: save() or persist() operations cascade to related entities
- CascadeType.MERGE: related entities are merged when the owning entity is merged
- CascadeType.REFRESH: does the same thing for the refresh() operation
- CascadeType.REMOVE: removes all related entities association with this setting when the owning entity is deleted
- CascadeType.DETACH: detaches all related entities if a “manual detach” occurs
- CascadeType.ALL: shorthand for all of the above cascade operations

***Note***: There is no default cascade type in JPA, by default no operations are cascaded.

More information about JPA and Hibernate cascade types:

[https://techrocking.com/cascade-in-jpa-and-hibernate/](https://techrocking.com/cascade-in-jpa-and-hibernate/)