# Spring JPA

**JPA (Java Persistence API)** is a **specification** that defines a standard for ORM (Object Relational Mapping) in Java. It’s not an implementation itself.

Hibernate, EclipseLink, and Apache OpenJPA are popular **implementations** of JPA. Spring Data JPA builds on top of these implementations to provide even more abstraction and reduce boilerplate code.

## Key Concepts

### JPA vs JDBC

| Feature          | JPA                                                        | JDBC                      |
| ---------------- | ---------------------------------------------------------- | ------------------------- |
| Level            | Higher-level abstraction                                   | Lower-level               |
| Boilerplate Code | Minimal (Spring Data JPA reduces it further)               | More boilerplate required |
| Mapping          | Maps Java objects to relational tables                     | Manual mapping            |
| Flexibility      | Easy to use with domain models                             | Better for exotic schemas |
| Caching          | Built-in caching support (especially second-level caching) | Manual caching (if any)   |

**[Detailed comparison](https://www.baeldung.com/jpa-vs-jdbc)**

## Spring Data JPA

**Spring Data** provides a layer of abstraction over JPA implementations like Hibernate:

- Reduces boilerplate code
- Supports **method name queries** and **JPQL**
- Integrates seamlessly with Spring Boot
- Uses Hibernate as the default JPA provider, but you can change it

```java
public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByLastName(String lastName);
}
```

## ORM & Impedance Mismatch

JPA attempts to solve the **Object–Relational Impedance Mismatch**, which refers to the conceptual differences between the object-oriented model and the relational database model.

**[More details](https://en.wikipedia.org/wiki/Object–relational_impedance_mismatch)**

## Domain Model First vs Relational Model First

- **Domain model centric**: Code drives the database design.
- **Relational model centric**: Database design comes first, followed by the code.

![Domain Model First](https://vertabelo.com/blog/orms-under-the-hood/object-first-approach.png)
![Database First](https://vertabelo.com/blog/orms-under-the-hood/database-first-approach.png)

**[Read more](https://vertabelo.com/blog/orms-under-the-hood/)**

## Common Relationships

| Relationship | Description                                             | Resources                                                   |
| ------------ | ------------------------------------------------------- | ----------------------------------------------------------- |
| One-to-One   | Each entity instance relates to one instance of another | [Baeldung](https://www.baeldung.com/jpa-one-to-one)         |
| One-to-Many  | One entity relates to many instances of another         | [Baeldung](https://www.baeldung.com/hibernate-one-to-many)  |
| Many-to-Many | Each instance of one entity relates to many of another  | [Baeldung](https://www.baeldung.com/hibernate-many-to-many) |

**Join Column**: [@JoinColumn guide](https://www.baeldung.com/jpa-join-column)
**JoinColumn vs MappedBy**: [Explanation](https://www.baeldung.com/jpa-joincolumn-vs-mappedby)

## Cascade Types

| Type    | Effect                                         |
| ------- | ---------------------------------------------- |
| PERSIST | Cascade save() / persist() to related entities |
| MERGE   | Cascade merge                                  |
| REFRESH | Cascade refresh                                |
| REMOVE  | Cascade delete                                 |
| DETACH  | Cascade detach                                 |
| ALL     | Shorthand for all above                        |

**Note**: No default cascade type in JPA.

**[More info](https://techrocking.com/cascade-in-jpa-and-hibernate/)**

## Inheritance

JPA supports several inheritance strategies:

- **Single Table**
- **Joined**
- **Table per Class**

**[Hibernate Inheritance](https://www.baeldung.com/hibernate-inheritance)**
**[Joined Table Inheritance Example](https://www.logicbig.com/tutorials/java-ee-tutorial/jpa/joined-table-inheritance.html)**

## Lazy Loading

**Lazy loading** delays the loading of related data until it’s explicitly accessed.

**[Lazy Loading Workaround](https://www.baeldung.com/hibernate-lazy-loading-workaround)**

## N+1 Query Problem

When fetching related entities lazily in a loop, it may cause excessive queries (one for the parent and one per child entity).

**[N+1 Problem Explained](https://vladmihalcea.com/n-plus-1-query-problem/)**

## Tips

- Use **Spring JdbcTemplate** if you prefer full control over SQL and don’t want to map database schemas to Java objects.
- Use **JPA/Spring Data JPA** for domain-driven design and object-centric development.
- Be mindful of **LazyInitializationException** when using lazy loading outside the persistence context.
- Prefer **DTO projections** for performance when dealing with large queries or complex object graphs.

## Resources

- [JPA vs JDBC](https://www.baeldung.com/jpa-vs-jdbc)
- [Hibernate Inheritance](https://www.baeldung.com/hibernate-inheritance)
- [Vertabelo ORM Guide](https://vertabelo.com/blog/orms-under-the-hood/)
- [Object–relational impedance mismatch](https://en.wikipedia.org/wiki/Object–relational_impedance_mismatch)
