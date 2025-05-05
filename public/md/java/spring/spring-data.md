# Spring Data

Spring Data is a high-level **data access framework** designed to simplify interaction with data sources such as relational databases, NoSQL databases, and even cloud data services. It reduces boilerplate code for data persistence and repository access while supporting advanced query features.

## Key Features

- **Repository abstraction**: Provides interfaces like `CrudRepository`, `JpaRepository`, and `PagingAndSortingRepository`.
- **Query method keywords**: Derive queries directly from method names (`findByEmail`, `countByStatus`).
- **Pagination & Sorting**: Simple support for paginated and sorted results.
- **Custom queries**: Supports JPQL, native SQL, and query derivation.
- **Integration with various data stores**: JPA, MongoDB, Cassandra, Redis, Elasticsearch, Neo4j, and more.
- **Auditing**: Easily track created/updated dates and users.

## Core Concepts

### Repositories

**CrudRepository**
Basic CRUD operations (`save`, `findById`, `delete`, etc.).

**JpaRepository**
Adds JPA-specific methods like `flush`, `findAll(Pageable pageable)`.

**PagingAndSortingRepository**
Adds methods for pagination and sorting.

**Example**:

```java
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByStatusOrderByCreatedAtDesc(String status);
}
```

### Query Derivation

Create queries just by defining method names:

```java
List<User> findByFirstNameAndLastName(String firstName, String lastName);
Long countByStatus(String status);
```

### @Query Annotation

For more complex queries:

```java
@Query("SELECT u FROM User u WHERE u.age >= :minAge")
List<User> findUsersOlderThan(@Param("minAge") int age);
```

### Pagination & Sorting

```java
Page<User> findAll(Pageable pageable);
List<User> findAll(Sort sort);
```

**Example**:

```java
Pageable pageable = PageRequest.of(0, 10, Sort.by("createdAt").descending());
Page<User> page = userRepository.findAll(pageable);
```

## Auditing

Enable automatic setting of created/modified dates:

```java
@Entity
@EntityListeners(AuditingEntityListener.class)
public class User {

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    // other fields
}
```

In your configuration:

```java
@EnableJpaAuditing
```

## Common Annotations

| Annotation                       | Purpose                                                |
| -------------------------------- | ------------------------------------------------------ |
| @Entity                          | Marks a class as a JPA entity                          |
| @Id                              | Marks a field as the primary key                       |
| @GeneratedValue                  | Auto-generates primary key values                      |
| @Query                           | Defines custom queries                                 |
| @CreatedDate / @LastModifiedDate | Automatically set auditing fields                      |
| @Modifying                       | Used with @Query for modifying queries (update/delete) |

## Transaction Management

Use `@Transactional` to manage transactions:

```java
@Transactional
public void updateUserStatus(Long userId, String status) {
    userRepository.findById(userId).ifPresent(user -> {
        user.setStatus(status);
        userRepository.save(user);
    });
}
```

## Spring Data and Projections

You can return only partial data using projections:

```java
public interface UserSummary {
    String getFirstName();
    String getLastName();
}

List<UserSummary> findByStatus(String status);
```

## Useful Links

- [Spring Data Documentation](https://spring.io/projects/spring-data)
- [Spring Data JPA Reference](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/)
- [Baeldung - Spring Data JPA](https://www.baeldung.com/the-persistence-layer-with-spring-data-jpa)
