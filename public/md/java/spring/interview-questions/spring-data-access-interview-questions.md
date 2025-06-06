# Spring Data Access

## What Is Spring _JdbcTemplate_ Class and How to Use It?

The Spring JDBC template is the primary API through which we can access database operations logic that we’re interested in:

- Creation and closing of connections
- Executing statements and stored procedure calls
- Iterating over the _ResultSet_ and returning results

To use it, we'll need to define the simple configuration of _DataSource_:

```java
@Configuration
@ComponentScan("org.baeldung.jdbc")
public class SpringJdbcConfig {
    @Bean
    public DataSource mysqlDataSource() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName("com.mysql.jdbc.Driver");
        dataSource.setUrl("jdbc:mysql://localhost:3306/springjdbc");
        dataSource.setUsername("guest_user");
        dataSource.setPassword("guest_password");

        return dataSource;
    }
}
```

For further explanation, check out [this quick article](https://www.baeldung.com/spring-jdbc-jdbctemplate).

## How to Enable Transactions in Spring and What Are Their Benefits?

There are two distinct ways to configure _Transactions_ — with annotations or by using Aspect-Oriented Programming (AOP).

**Benefits of using Spring Transactions:**

- Consistent programming model across different transaction APIs (JTA, JDBC, Hibernate, JPA, JDO)
- Support for declarative transaction management
- Simpler API for programmatic transaction management compared to complex transaction APIs like JTA
- Seamless integration with Spring's various data access abstractions

## What Is Spring DAO?

Spring Data Access Object (DAO) is Spring's support provided to work with data access technologies like JDBC, Hibernate, and JPA in a consistent and easy way.

For a more in-depth look, refer to [this series](https://www.baeldung.com/persistence-with-spring-series/) discussing persistence in Spring.

## What's the Difference Between JpaRepository and CrudRepository?

`JpaRepository` extends `PagingAndSortingRepository`, which in turn extends `CrudRepository`.

**Main functions:**

- `CrudRepository`: Provides CRUD functions.
- `PagingAndSortingRepository`: Adds methods for pagination and sorting records.
- `JpaRepository`: Adds JPA-related methods such as flushing the persistence context and batch deletions.

**Hierarchy summary:**

```text
JpaRepository ➞ PagingAndSortingRepository ➞ CrudRepository
```

Because of this inheritance, `JpaRepository` includes all the functions of `CrudRepository` and `PagingAndSortingRepository`.

**Tip:** If you don't need features from `JpaRepository` and `PagingAndSortingRepository`, use `CrudRepository`.

## What Is @Transactional and How Does It Work?

`@Transactional` provides declarative transaction management:

```java
@Service
@Transactional
public class UserService {

    @Transactional(readOnly = true)
    public User findById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException("User not found"));
    }

    @Transactional(rollbackFor = Exception.class)
    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new DuplicateEmailException("Email already exists");
        }
        return userRepository.save(user);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void auditUserAction(String action) {
        auditRepository.save(new AuditLog(action, LocalDateTime.now()));
    }
}
```

## What Are Transaction Propagation Types?

- **REQUIRED** (default): Use existing transaction or create new one
- **REQUIRES_NEW**: Always create new transaction, suspend existing one
- **SUPPORTS**: Use existing transaction if present, execute non-transactionally otherwise
- **NOT_SUPPORTED**: Execute non-transactionally, suspend existing transaction
- **MANDATORY**: Use existing transaction, throw exception if none exists
- **NEVER**: Execute non-transactionally, throw exception if transaction exists
- **NESTED**: Execute within nested transaction if existing transaction present

## What Are Transaction Isolation Levels?

- **READ_UNCOMMITTED**: Allows dirty reads, non-repeatable reads, phantom reads
- **READ_COMMITTED**: Prevents dirty reads, allows non-repeatable reads and phantom reads
- **REPEATABLE_READ**: Prevents dirty reads and non-repeatable reads, allows phantom reads
- **SERIALIZABLE**: Prevents all phenomena, highest isolation level

```java
@Transactional(isolation = Isolation.READ_COMMITTED)
public List<User> getActiveUsers() {
    return userRepository.findByActiveTrue();
}
```

## What Is Spring Data JPA?

Spring Data JPA provides repository abstraction over JPA:

```java
public interface UserRepository extends JpaRepository<User, Long> {

    List<User> findByLastName(String lastName);

    List<User> findByAgeGreaterThan(int age);

    @Query("SELECT u FROM User u WHERE u.email = ?1")
    Optional<User> findByEmail(String email);

    @Query(value = "SELECT * FROM users WHERE active = true", nativeQuery = true)
    List<User> findActiveUsersNative();

    @Modifying
    @Query("UPDATE User u SET u.active = false WHERE u.lastLoginDate < :date")
    int deactivateInactiveUsers(@Param("date") LocalDateTime date);
}
```

## What Is @Entity and @Table?

- **@Entity**: Marks a class as JPA entity
- **@Table**: Specifies database table details

```java
@Entity
@Table(name = "users",
       indexes = @Index(name = "idx_email", columnList = "email"),
       uniqueConstraints = @UniqueConstraint(columnNames = "email"))
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at")
    private Date createdAt;
}
```

## What Are JPA Relationships?

### One-to-Many

```java
@Entity
public class Department {
    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Employee> employees = new ArrayList<>();
}

@Entity
public class Employee {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;
}
```

### Many-to-Many

```java
@Entity
public class Student {
    @ManyToMany
    @JoinTable(name = "student_course",
               joinColumns = @JoinColumn(name = "student_id"),
               inverseJoinColumns = @JoinColumn(name = "course_id"))
    private Set<Course> courses = new HashSet<>();
}
```

## What Is the Difference Between save() and saveAndFlush()?

- **save()**: Persists entity to persistence context, may not immediately write to database
- **saveAndFlush()**: Persists entity and immediately flushes changes to database

```java
@Service
public class UserService {

    public User createUser(User user) {
        User savedUser = userRepository.save(user);
        // ID might not be available immediately
        return savedUser;
    }

    public User createUserWithImmediateId(User user) {
        User savedUser = userRepository.saveAndFlush(user);
        // ID is guaranteed to be available
        return savedUser;
    }
}
```

## What Is @Repository and Its Benefits?

`@Repository` is a stereotype annotation that:

- Marks a class as Data Access Object (DAO)
- Enables automatic exception translation from database-specific exceptions to Spring's DataAccessException
- Makes the class eligible for component scanning

```java
@Repository
public class UserDaoImpl implements UserDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<User> findByStatus(String status) {
        String sql = "SELECT * FROM users WHERE status = ?";
        return jdbcTemplate.query(sql, new UserRowMapper(), status);
    }
}
```

## What Is Connection Pooling and How to Configure It?

Connection pooling improves performance by reusing database connections:

```java
@Configuration
public class DatabaseConfig {

    @Bean
    @ConfigurationProperties("spring.datasource.hikari")
    public HikariDataSource dataSource() {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:mysql://localhost:3306/mydb");
        config.setUsername("user");
        config.setPassword("password");
        config.setMaximumPoolSize(20);
        config.setMinimumIdle(5);
        config.setConnectionTimeout(30000);
        config.setIdleTimeout(600000);
        config.setMaxLifetime(1800000);
        return new HikariDataSource(config);
    }
}
```

For more information:

- [Difference between CrudRepository and JpaRepository](https://www.tutorialspoint.com/difference-between-crudrepository-and-jparepository-in-java)
- [Baeldung Spring Data Repositories](https://www.baeldung.com/spring-data-repositories)
