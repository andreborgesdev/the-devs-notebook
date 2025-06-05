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

## Advanced JPA Features

### Entity Lifecycle

JPA entities have specific lifecycle states:

```java
@Entity
@EntityListeners(AuditingEntityListener.class)
public class User {

    @Id @GeneratedValue
    private Long id;

    @PrePersist
    void prePersist() {
        this.createdAt = Instant.now();
    }

    @PostPersist
    void postPersist() {
        System.out.println("Entity persisted: " + this.id);
    }

    @PreUpdate
    void preUpdate() {
        this.updatedAt = Instant.now();
    }

    @PostLoad
    void postLoad() {
        System.out.println("Entity loaded: " + this.id);
    }
}
```

### Entity Listeners

```java
@Entity
@EntityListeners({AuditingEntityListener.class, CustomEntityListener.class})
public class Product {
    // Entity fields
}

public class CustomEntityListener {

    @PrePersist
    public void prePersist(Object entity) {
        if (entity instanceof Auditable) {
            ((Auditable) entity).setCreatedDate(LocalDateTime.now());
        }
    }

    @PreUpdate
    public void preUpdate(Object entity) {
        if (entity instanceof Auditable) {
            ((Auditable) entity).setLastModifiedDate(LocalDateTime.now());
        }
    }
}
```

## Advanced Queries

### JPQL Advanced Examples

```java
@Repository
public class UserRepository {

    @PersistenceContext
    private EntityManager entityManager;

    // Joins and Projections
    @Query("SELECT new com.example.dto.UserSummaryDTO(u.name, u.email, COUNT(o)) " +
           "FROM User u LEFT JOIN u.orders o " +
           "GROUP BY u.id, u.name, u.email")
    List<UserSummaryDTO> findUserSummaries();

    // Subqueries
    @Query("SELECT u FROM User u WHERE u.id IN " +
           "(SELECT o.user.id FROM Order o WHERE o.total > :amount)")
    List<User> findUsersWithOrdersAbove(@Param("amount") BigDecimal amount);

    // Case Expressions
    @Query("SELECT u.name, " +
           "CASE WHEN u.age < 18 THEN 'Minor' " +
           "     WHEN u.age >= 65 THEN 'Senior' " +
           "     ELSE 'Adult' END " +
           "FROM User u")
    List<Object[]> findUsersWithAgeCategory();

    // Functions
    @Query("SELECT u FROM User u WHERE UPPER(u.name) LIKE UPPER(CONCAT('%', :name, '%'))")
    List<User> findByNameIgnoreCase(@Param("name") String name);
}
```

### Native Queries

```java
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query(value = "SELECT * FROM products p WHERE p.price > :price " +
                   "AND p.category_id IN (SELECT id FROM categories WHERE active = true)",
           nativeQuery = true)
    List<Product> findActiveProductsAbovePrice(@Param("price") BigDecimal price);

    @Query(value = "SELECT p.*, c.name as category_name FROM products p " +
                   "JOIN categories c ON p.category_id = c.id " +
                   "WHERE p.created_date BETWEEN :startDate AND :endDate",
           nativeQuery = true)
    List<Object[]> findProductsWithCategoryInDateRange(@Param("startDate") LocalDate start,
                                                       @Param("endDate") LocalDate end);
}
```

### Criteria API

```java
@Repository
public class ProductSearchRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public List<Product> findProductsByCriteria(String name, BigDecimal minPrice,
                                              BigDecimal maxPrice, String categoryName) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Product> query = cb.createQuery(Product.class);
        Root<Product> root = query.from(Product.class);

        List<Predicate> predicates = new ArrayList<>();

        if (name != null) {
            predicates.add(cb.like(cb.lower(root.get("name")),
                                 "%" + name.toLowerCase() + "%"));
        }

        if (minPrice != null) {
            predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
        }

        if (maxPrice != null) {
            predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
        }

        if (categoryName != null) {
            Join<Product, Category> categoryJoin = root.join("category");
            predicates.add(cb.equal(categoryJoin.get("name"), categoryName));
        }

        query.where(predicates.toArray(new Predicate[0]));
        query.orderBy(cb.asc(root.get("name")));

        return entityManager.createQuery(query).getResultList();
    }
}
```

## Performance Optimization

### Batch Processing

```java
@Repository
@Transactional
public class BatchUserRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public void saveUsersInBatch(List<User> users) {
        int batchSize = 25;
        for (int i = 0; i < users.size(); i++) {
            entityManager.persist(users.get(i));

            if (i % batchSize == 0 && i > 0) {
                entityManager.flush();
                entityManager.clear();
            }
        }
        entityManager.flush();
        entityManager.clear();
    }

    public void updateUsersInBatch(List<User> users) {
        int batchSize = 25;
        for (int i = 0; i < users.size(); i++) {
            entityManager.merge(users.get(i));

            if (i % batchSize == 0 && i > 0) {
                entityManager.flush();
                entityManager.clear();
            }
        }
    }
}
```

### Fetch Strategies

```java
@Entity
public class Order {

    @Id @GeneratedValue
    private Long id;

    @OneToMany(mappedBy = "order", fetch = FetchType.LAZY)
    private List<OrderItem> items = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;
}

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("SELECT o FROM Order o JOIN FETCH o.items JOIN FETCH o.customer")
    List<Order> findAllWithItemsAndCustomer();

    @EntityGraph(attributePaths = {"items", "customer"})
    List<Order> findByStatus(OrderStatus status);

    @EntityGraph(type = EntityGraph.EntityGraphType.FETCH,
                attributePaths = {"items.product", "customer.address"})
    Optional<Order> findWithDetailsById(Long id);
}
```

### Second Level Cache

```java
@Entity
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE, region = "productCache")
public class Product {

    @Id @GeneratedValue
    private Long id;

    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @OneToMany(mappedBy = "product")
    private List<Review> reviews = new ArrayList<>();
}

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @QueryHints(@QueryHint(name = "org.hibernate.cacheable", value = "true"))
    @Query("SELECT p FROM Product p WHERE p.category = :category")
    List<Product> findByCategoryWithCache(@Param("category") Category category);
}
```

## Advanced Relationships

### Composite Keys

```java
@Embeddable
public class OrderItemId implements Serializable {

    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "product_id")
    private Long productId;

    // constructors, equals, hashCode
}

@Entity
public class OrderItem {

    @EmbeddedId
    private OrderItemId id;

    @ManyToOne
    @MapsId("orderId")
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne
    @MapsId("productId")
    @JoinColumn(name = "product_id")
    private Product product;

    private Integer quantity;
    private BigDecimal unitPrice;
}
```

### Polymorphic Associations

```java
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "payment_type")
public abstract class Payment {

    @Id @GeneratedValue
    private Long id;

    private BigDecimal amount;
    private LocalDateTime paymentDate;
}

@Entity
@DiscriminatorValue("CREDIT_CARD")
public class CreditCardPayment extends Payment {

    private String cardNumber;
    private String expiryDate;
}

@Entity
@DiscriminatorValue("BANK_TRANSFER")
public class BankTransferPayment extends Payment {

    private String bankAccount;
    private String routingNumber;
}
```

### Bidirectional Relationships

```java
@Entity
public class Author {

    @Id @GeneratedValue
    private Long id;

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Book> books = new ArrayList<>();

    public void addBook(Book book) {
        books.add(book);
        book.setAuthor(this);
    }

    public void removeBook(Book book) {
        books.remove(book);
        book.setAuthor(null);
    }
}

@Entity
public class Book {

    @Id @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private Author author;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Book)) return false;
        Book book = (Book) o;
        return Objects.equals(id, book.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
```

## Custom Repository Implementation

```java
public interface UserRepositoryCustom {
    List<User> findUsersWithComplexCriteria(UserSearchCriteria criteria);
    Page<User> findUsersWithDynamicQuery(Pageable pageable, String... filters);
}

@Repository
public class UserRepositoryImpl implements UserRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<User> findUsersWithComplexCriteria(UserSearchCriteria criteria) {
        StringBuilder jpql = new StringBuilder("SELECT u FROM User u WHERE 1=1");
        Map<String, Object> parameters = new HashMap<>();

        if (criteria.getName() != null) {
            jpql.append(" AND LOWER(u.name) LIKE LOWER(:name)");
            parameters.put("name", "%" + criteria.getName() + "%");
        }

        if (criteria.getMinAge() != null) {
            jpql.append(" AND u.age >= :minAge");
            parameters.put("minAge", criteria.getMinAge());
        }

        if (criteria.getEmail() != null) {
            jpql.append(" AND u.email = :email");
            parameters.put("email", criteria.getEmail());
        }

        TypedQuery<User> query = entityManager.createQuery(jpql.toString(), User.class);
        parameters.forEach(query::setParameter);

        return query.getResultList();
    }
}

public interface UserRepository extends JpaRepository<User, Long>, UserRepositoryCustom {
    // Standard Spring Data JPA methods
}
```

## Auditing

```java
@EntityListeners(AuditingEntityListener.class)
@MappedSuperclass
public abstract class AuditableEntity {

    @CreatedDate
    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @LastModifiedDate
    @Column(name = "last_modified_date")
    private LocalDateTime lastModifiedDate;

    @CreatedBy
    @Column(name = "created_by", updatable = false)
    private String createdBy;

    @LastModifiedBy
    @Column(name = "last_modified_by")
    private String lastModifiedBy;
}

@Configuration
@EnableJpaAuditing
public class JpaAuditingConfig {

    @Bean
    public AuditorAware<String> auditorProvider() {
        return () -> {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return Optional.of("system");
            }
            return Optional.of(authentication.getName());
        };
    }
}
```

## Testing JPA

### Repository Testing

```java
@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    @Test
    void shouldFindUserByEmail() {
        User user = new User("John", "john@example.com");
        entityManager.persistAndFlush(user);

        Optional<User> found = userRepository.findByEmail("john@example.com");

        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("John");
    }

    @Test
    void shouldUpdateUserAge() {
        User user = new User("Jane", "jane@example.com");
        user.setAge(25);
        User saved = entityManager.persistAndFlush(user);

        saved.setAge(26);
        userRepository.save(saved);
        entityManager.flush();
        entityManager.clear();

        User updated = entityManager.find(User.class, saved.getId());
        assertThat(updated.getAge()).isEqualTo(26);
    }

    @Test
    void shouldHandlePessimisticLocking() {
        User user = new User("Alice", "alice@example.com");
        entityManager.persistAndFlush(user);

        User lockedUser = userRepository.findById(user.getId(), LockModeType.PESSIMISTIC_WRITE);

        assertThat(lockedUser).isNotNull();
    }
}
```

### Integration Testing

```java
@SpringBootTest
@Transactional
class UserServiceIntegrationTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Test
    void shouldCreateUserWithProfile() {
        UserCreateRequest request = new UserCreateRequest("Bob", "bob@example.com");

        User created = userService.createUser(request);

        assertThat(created.getId()).isNotNull();

        Optional<User> found = userRepository.findById(created.getId());
        assertThat(found).isPresent();
        assertThat(found.get().getProfile()).isNotNull();
    }

    @Test
    @Rollback
    void shouldHandleTransactionalBehavior() {
        User user = new User("Charlie", "charlie@example.com");
        userRepository.save(user);

        try {
            userService.updateUserWithException(user.getId());
        } catch (RuntimeException e) {
            // Expected exception
        }

        User found = userRepository.findById(user.getId()).orElse(null);
        assertThat(found.getName()).isEqualTo("Charlie"); // Should not be updated
    }
}
```

## Best Practices

### Entity Design

1. **Always implement equals() and hashCode()** for entities
2. **Use business keys** when possible for equals/hashCode
3. **Keep entities lightweight** - avoid heavy computations in getters
4. **Use appropriate fetch strategies** - LAZY by default, EAGER only when needed
5. **Implement bidirectional associations carefully**

### Performance Guidelines

1. **Use pagination** for large result sets
2. **Implement batch processing** for bulk operations
3. **Leverage second-level cache** for read-heavy entities
4. **Use projections and DTOs** to limit data transfer
5. **Monitor and optimize SQL queries** generated by JPA
6. **Consider native queries** for complex operations

### Transaction Management

```java
@Service
@Transactional(readOnly = true)
public class UserService {

    @Transactional
    public User createUser(UserCreateRequest request) {
        // Write operations
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logUserActivity(Long userId, String activity) {
        // Separate transaction for logging
    }

    @Transactional(rollbackFor = {BusinessException.class})
    public void processUserData(Long userId) throws BusinessException {
        // Custom rollback conditions
    }
}
```

## Resources

- [JPA vs JDBC](https://www.baeldung.com/jpa-vs-jdbc)
- [Hibernate Inheritance](https://www.baeldung.com/hibernate-inheritance)
- [Vertabelo ORM Guide](https://vertabelo.com/blog/orms-under-the-hood/)
- [Object–relational impedance mismatch](https://en.wikipedia.org/wiki/Object–relational_impedance_mismatch)
- [JPA Performance Best Practices](https://vladmihalcea.com/jpa-hibernate-performance-tuning/)
- [Spring Data JPA Reference](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/)
- [Hibernate User Guide](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html)
