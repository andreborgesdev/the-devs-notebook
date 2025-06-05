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

### Advanced Repository Interfaces

```java
public interface UserRepository extends JpaRepository<User, Long>,
                                       JpaSpecificationExecutor<User>,
                                       QuerydslPredicateExecutor<User> {

    Optional<User> findByEmail(String email);
    List<User> findByStatusOrderByCreatedAtDesc(String status);

    @Query("SELECT u FROM User u WHERE u.age >= :minAge")
    List<User> findUsersOlderThan(@Param("minAge") int age);

    @Query(value = "SELECT * FROM users u WHERE u.created_at > ?1", nativeQuery = true)
    List<User> findUsersCreatedAfter(LocalDateTime date);

    @Modifying
    @Query("UPDATE User u SET u.status = :status WHERE u.id = :id")
    int updateUserStatus(@Param("id") Long id, @Param("status") String status);

    @Query("SELECT u FROM User u WHERE u.department.name = :deptName")
    List<User> findByDepartmentName(@Param("deptName") String departmentName);
}
```

### Custom Repository Implementation

```java
public interface UserRepositoryCustom {
    List<User> findUsersWithCustomLogic(String criteria);
    Page<User> findUsersWithComplexSearch(UserSearchCriteria criteria, Pageable pageable);
}

@Repository
public class UserRepositoryImpl implements UserRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<User> findUsersWithCustomLogic(String criteria) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<User> query = cb.createQuery(User.class);
        Root<User> root = query.from(User.class);

        Predicate predicate = cb.like(
            cb.lower(root.get("firstName")),
            "%" + criteria.toLowerCase() + "%"
        );

        query.where(predicate);

        return entityManager.createQuery(query).getResultList();
    }

    @Override
    public Page<User> findUsersWithComplexSearch(UserSearchCriteria criteria, Pageable pageable) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<User> query = cb.createQuery(User.class);
        Root<User> root = query.from(User.class);

        List<Predicate> predicates = new ArrayList<>();

        if (criteria.getName() != null) {
            predicates.add(cb.like(cb.lower(root.get("firstName")),
                "%" + criteria.getName().toLowerCase() + "%"));
        }

        if (criteria.getMinAge() != null) {
            predicates.add(cb.greaterThanOrEqualTo(root.get("age"), criteria.getMinAge()));
        }

        if (criteria.getDepartment() != null) {
            Join<User, Department> deptJoin = root.join("department");
            predicates.add(cb.equal(deptJoin.get("name"), criteria.getDepartment()));
        }

        query.where(predicates.toArray(new Predicate[0]));

        TypedQuery<User> typedQuery = entityManager.createQuery(query);
        typedQuery.setFirstResult((int) pageable.getOffset());
        typedQuery.setMaxResults(pageable.getPageSize());

        List<User> users = typedQuery.getResultList();

        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<User> countRoot = countQuery.from(User.class);
        countQuery.select(cb.count(countRoot));
        countQuery.where(predicates.toArray(new Predicate[0]));

        Long total = entityManager.createQuery(countQuery).getSingleResult();

        return new PageImpl<>(users, pageable, total);
    }
}

public interface UserRepository extends JpaRepository<User, Long>, UserRepositoryCustom {
    // Standard repository methods
}
```

### Query Derivation Advanced Examples

```java
public interface UserRepository extends JpaRepository<User, Long> {

    // Simple property expressions
    List<User> findByFirstName(String firstName);
    List<User> findByFirstNameAndLastName(String firstName, String lastName);
    List<User> findByFirstNameOrLastName(String firstName, String lastName);

    // Ignoring case
    List<User> findByFirstNameIgnoreCase(String firstName);
    List<User> findByFirstNameAndLastNameAllIgnoreCase(String firstName, String lastName);

    // Ordering
    List<User> findByStatusOrderByCreatedAtDesc(String status);
    List<User> findByAgeGreaterThanOrderByFirstNameAscLastNameDesc(Integer age);

    // Limiting results
    User findFirstByOrderByCreatedAtDesc();
    List<User> findTop10ByStatusOrderByCreatedAtDesc(String status);

    // Date comparisons
    List<User> findByCreatedAtAfter(LocalDateTime date);
    List<User> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    // String operations
    List<User> findByFirstNameStartingWith(String prefix);
    List<User> findByEmailContaining(String substring);
    List<User> findByLastNameEndingWith(String suffix);

    // Collection operations
    List<User> findByRolesContaining(Role role);
    List<User> findBySkillsIsEmpty();
    List<User> findBySkillsIsNotEmpty();

    // Null checks
    List<User> findByManagerIsNull();
    List<User> findByManagerIsNotNull();

    // Numeric operations
    List<User> findByAgeGreaterThan(Integer age);
    List<User> findByAgeLessThanEqual(Integer age);
    List<User> findBySalaryBetween(BigDecimal min, BigDecimal max);

    // Boolean operations
    List<User> findByActiveTrue();
    List<User> findByActiveFalse();

    // Nested properties
    List<User> findByAddressCityAndAddressState(String city, String state);
    List<User> findByDepartmentManagerFirstName(String managerFirstName);

    // Count, exists, delete operations
    long countByStatus(String status);
    boolean existsByEmail(String email);
    void deleteByStatus(String status);

    // Distinct
    @Query("SELECT DISTINCT u.department FROM User u")
    List<Department> findDistinctDepartments();
}
```

### Advanced Projections

#### Interface-based Projections

```java
public interface UserSummary {
    String getFirstName();
    String getLastName();
    String getEmail();

    @Value("#{target.firstName + ' ' + target.lastName}")
    String getFullName();

    DepartmentInfo getDepartment();

    interface DepartmentInfo {
        String getName();
        String getLocation();
    }
}

public interface UserStatistics {
    String getDepartment();
    Long getUserCount();
    Double getAverageSalary();
}

// Usage in repository
List<UserSummary> findByStatus(String status);

@Query("SELECT u.department.name as department, COUNT(u) as userCount, AVG(u.salary) as averageSalary " +
       "FROM User u GROUP BY u.department.name")
List<UserStatistics> getUserStatisticsByDepartment();
```

#### Class-based Projections (DTOs)

```java
public class UserProjection {
    private final String firstName;
    private final String lastName;
    private final String email;
    private final String departmentName;

    public UserProjection(String firstName, String lastName, String email, String departmentName) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.departmentName = departmentName;
    }

    // Getters
}

// Repository method
@Query("SELECT new com.example.UserProjection(u.firstName, u.lastName, u.email, u.department.name) " +
       "FROM User u WHERE u.status = :status")
List<UserProjection> findUserProjectionsByStatus(@Param("status") String status);
```

#### Dynamic Projections

```java
public interface UserRepository extends JpaRepository<User, Long> {
    <T> List<T> findByStatus(String status, Class<T> type);
}

// Usage
List<UserSummary> summaries = userRepository.findByStatus("ACTIVE", UserSummary.class);
List<User> entities = userRepository.findByStatus("ACTIVE", User.class);
```

### Specifications for Dynamic Queries

```java
public class UserSpecifications {

    public static Specification<User> hasFirstName(String firstName) {
        return (root, query, criteriaBuilder) ->
            firstName == null ? null : criteriaBuilder.equal(root.get("firstName"), firstName);
    }

    public static Specification<User> hasLastName(String lastName) {
        return (root, query, criteriaBuilder) ->
            lastName == null ? null : criteriaBuilder.equal(root.get("lastName"), lastName);
    }

    public static Specification<User> hasEmail(String email) {
        return (root, query, criteriaBuilder) ->
            email == null ? null : criteriaBuilder.like(
                criteriaBuilder.lower(root.get("email")),
                "%" + email.toLowerCase() + "%"
            );
    }

    public static Specification<User> hasAgeGreaterThan(Integer age) {
        return (root, query, criteriaBuilder) ->
            age == null ? null : criteriaBuilder.greaterThan(root.get("age"), age);
    }

    public static Specification<User> belongsToDepartment(String departmentName) {
        return (root, query, criteriaBuilder) -> {
            if (departmentName == null) return null;
            Join<User, Department> departmentJoin = root.join("department");
            return criteriaBuilder.equal(departmentJoin.get("name"), departmentName);
        };
    }

    public static Specification<User> isActive() {
        return (root, query, criteriaBuilder) ->
            criteriaBuilder.isTrue(root.get("active"));
    }
}

// Service using specifications
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public Page<User> findUsers(UserSearchCriteria criteria, Pageable pageable) {
        Specification<User> spec = Specification.where(null);

        if (criteria.getFirstName() != null) {
            spec = spec.and(UserSpecifications.hasFirstName(criteria.getFirstName()));
        }

        if (criteria.getLastName() != null) {
            spec = spec.and(UserSpecifications.hasLastName(criteria.getLastName()));
        }

        if (criteria.getEmail() != null) {
            spec = spec.and(UserSpecifications.hasEmail(criteria.getEmail()));
        }

        if (criteria.getMinAge() != null) {
            spec = spec.and(UserSpecifications.hasAgeGreaterThan(criteria.getMinAge()));
        }

        if (criteria.getDepartment() != null) {
            spec = spec.and(UserSpecifications.belongsToDepartment(criteria.getDepartment()));
        }

        if (criteria.isActiveOnly()) {
            spec = spec.and(UserSpecifications.isActive());
        }

        return userRepository.findAll(spec, pageable);
    }
}
```

## Transaction Management

Use `@Transactional` to manage transactions:

```java
@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Transactional(readOnly = true)
    public User findById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException("User not found: " + id));
    }

    @Transactional
    public User createUser(CreateUserRequest request) {
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setStatus("ACTIVE");

        User savedUser = userRepository.save(user);

        // This will be part of the same transaction
        auditLogRepository.save(new AuditLog("USER_CREATED", savedUser.getId()));

        return savedUser;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logUserActivity(Long userId, String activity) {
        // This runs in a separate transaction
        auditLogRepository.save(new AuditLog(activity, userId));
    }

    @Transactional(rollbackFor = Exception.class)
    public void updateUserWithAudit(Long userId, UpdateUserRequest request) {
        User user = findById(userId);

        String oldEmail = user.getEmail();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());

        userRepository.save(user);

        if (!oldEmail.equals(request.getEmail())) {
            auditLogRepository.save(new AuditLog("EMAIL_CHANGED", userId,
                "From: " + oldEmail + " To: " + request.getEmail()));
        }
    }
}
```

### Advanced Auditing

```java
@Entity
@EntityListeners(AuditingEntityListener.class)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;
    private String email;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @CreatedBy
    private String createdBy;

    @LastModifiedBy
    private String lastModifiedBy;

    @Version
    private Long version;
}

@Configuration
@EnableJpaAuditing
public class AuditConfig {

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

### Custom Auditing

```java
@Entity
public class AuditableEntity {

    @Embedded
    private AuditMetadata auditMetadata = new AuditMetadata();

    @PrePersist
    public void prePersist() {
        auditMetadata.setCreatedAt(LocalDateTime.now());
        auditMetadata.setCreatedBy(getCurrentUser());
        auditMetadata.setUpdatedAt(LocalDateTime.now());
        auditMetadata.setUpdatedBy(getCurrentUser());
    }

    @PreUpdate
    public void preUpdate() {
        auditMetadata.setUpdatedAt(LocalDateTime.now());
        auditMetadata.setUpdatedBy(getCurrentUser());
    }

    private String getCurrentUser() {
        // Get current user from security context
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}

@Embeddable
public class AuditMetadata {
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;

    // Getters and setters
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

### Event Handling

```java
@Entity
public class User {

    @Id
    @GeneratedValue
    private Long id;

    private String email;
    private String status;

    @DomainEvents
    Collection<Object> domainEvents() {
        List<Object> events = new ArrayList<>();

        if (isNew()) {
            events.add(new UserCreatedEvent(this));
        }

        return events;
    }

    @AfterDomainEventPublication
    void callbackMethod() {
        // Clear events after publication
    }

    private boolean isNew() {
        return this.id == null;
    }
}

@Component
public class UserEventHandler {

    @EventListener
    public void handleUserCreated(UserCreatedEvent event) {
        System.out.println("User created: " + event.getUser().getEmail());
        // Send welcome email, create default settings, etc.
    }
}
```

### Repository Testing

```java
@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    @Test
    void shouldFindByEmail() {
        User user = new User("John", "Doe", "john@example.com");
        entityManager.persistAndFlush(user);

        Optional<User> found = userRepository.findByEmail("john@example.com");

        assertThat(found).isPresent();
        assertThat(found.get().getFirstName()).isEqualTo("John");
    }

    @Test
    void shouldFindUsersWithSpecification() {
        User user1 = new User("John", "Doe", "john@example.com");
        user1.setAge(25);
        User user2 = new User("Jane", "Smith", "jane@example.com");
        user2.setAge(30);

        entityManager.persist(user1);
        entityManager.persist(user2);
        entityManager.flush();

        Specification<User> spec = UserSpecifications.hasAgeGreaterThan(28);
        List<User> users = userRepository.findAll(spec);

        assertThat(users).hasSize(1);
        assertThat(users.get(0).getFirstName()).isEqualTo("Jane");
    }

    @Test
    void shouldReturnCorrectProjection() {
        User user = new User("John", "Doe", "john@example.com");
        entityManager.persistAndFlush(user);

        List<UserSummary> summaries = userRepository.findByStatus("ACTIVE");

        assertThat(summaries).hasSize(1);
        assertThat(summaries.get(0).getFirstName()).isEqualTo("John");
        assertThat(summaries.get(0).getLastName()).isEqualTo("Doe");
    }
}
```

## Useful Links

- [Spring Data Documentation](https://spring.io/projects/spring-data)
- [Spring Data JPA Reference](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/)
- [Baeldung - Spring Data JPA](https://www.baeldung.com/the-persistence-layer-with-spring-data-jpa)

## Useful Links

- [Spring Data Documentation](https://spring.io/projects/spring-data)
- [Spring Data JPA Reference](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/)
- [Baeldung - Spring Data JPA](https://www.baeldung.com/the-persistence-layer-with-spring-data-jpa)
