# Spring Transactions

## Overview

Spring's transaction management provides a consistent programming model across different transaction APIs and offers both declarative and programmatic transaction management support.

## Transaction Management Types

### Declarative Transaction Management

#### @Transactional Annotation

```java
@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Transactional(readOnly = true)
    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
    }

    @Transactional(propagation = Propagation.REQUIRED,
                   isolation = Isolation.READ_COMMITTED,
                   timeout = 30,
                   rollbackFor = Exception.class)
    public User createUser(String name, String email) {
        User user = new User(name, email);
        User savedUser = userRepository.save(user);
        emailService.sendWelcomeEmail(savedUser);
        return savedUser;
    }

    @Transactional(noRollbackFor = BusinessWarningException.class)
    public void updateUserProfile(Long userId, UserProfile profile) {
        User user = findById(userId);
        user.updateProfile(profile);
        userRepository.save(user);

        // This exception won't cause rollback
        if (profile.hasWarnings()) {
            throw new BusinessWarningException("Profile has warnings");
        }
    }
}
```

#### XML Configuration

```xml
<tx:advice id="txAdvice" transaction-manager="transactionManager">
    <tx:attributes>
        <tx:method name="find*" read-only="true"/>
        <tx:method name="get*" read-only="true"/>
        <tx:method name="*" propagation="REQUIRED" rollback-for="Exception"/>
    </tx:attributes>
</tx:advice>

<aop:config>
    <aop:pointcut id="serviceMethods"
                  expression="execution(* com.example.service.*.*(..))"/>
    <aop:advisor advice-ref="txAdvice" pointcut-ref="serviceMethods"/>
</aop:config>
```

### Programmatic Transaction Management

#### TransactionTemplate

```java
@Service
public class UserService {

    @Autowired
    private TransactionTemplate transactionTemplate;

    @Autowired
    private UserRepository userRepository;

    public User createUserWithTemplate(String name, String email) {
        return transactionTemplate.execute(status -> {
            try {
                User user = new User(name, email);
                User savedUser = userRepository.save(user);

                // Additional operations
                processUserCreation(savedUser);

                return savedUser;
            } catch (Exception e) {
                status.setRollbackOnly();
                throw new RuntimeException("User creation failed", e);
            }
        });
    }

    public void updateUserWithCallback(Long userId, Consumer<User> updateFunction) {
        transactionTemplate.executeWithoutResult(status -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new UserNotFoundException(userId));

            updateFunction.accept(user);
            userRepository.save(user);
        });
    }
}
```

#### PlatformTransactionManager

```java
@Service
public class UserService {

    @Autowired
    private PlatformTransactionManager transactionManager;

    @Autowired
    private UserRepository userRepository;

    public User createUserManually(String name, String email) {
        TransactionDefinition def = new DefaultTransactionDefinition();
        TransactionStatus status = transactionManager.getTransaction(def);

        try {
            User user = new User(name, email);
            User savedUser = userRepository.save(user);

            // Commit the transaction
            transactionManager.commit(status);
            return savedUser;

        } catch (Exception e) {
            transactionManager.rollback(status);
            throw new RuntimeException("Transaction failed", e);
        }
    }
}
```

## Transaction Propagation

### Propagation Types

```java
@Service
public class OrderService {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private InventoryService inventoryService;

    @Transactional(propagation = Propagation.REQUIRED)
    public void processOrder(Order order) {
        // This method starts a new transaction
        saveOrder(order);

        // These methods participate in the same transaction
        paymentService.processPayment(order);
        inventoryService.updateInventory(order);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logOrderEvent(OrderEvent event) {
        // This method always starts a new transaction
        // Even if called from within another transaction
        orderEventRepository.save(event);
    }

    @Transactional(propagation = Propagation.SUPPORTS)
    public Order findOrder(Long orderId) {
        // This method supports transaction if one exists
        // But doesn't require one
        return orderRepository.findById(orderId).orElse(null);
    }

    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    public void generateReport() {
        // This method executes outside of any transaction
        // Existing transaction is suspended
        reportGenerator.generate();
    }

    @Transactional(propagation = Propagation.NEVER)
    public void validateData(Data data) {
        // This method must not execute within a transaction
        // Throws exception if transaction exists
        dataValidator.validate(data);
    }
}
```

### Propagation Examples

```java
@Service
@Transactional
public class ParentService {

    @Autowired
    private ChildService childService;

    public void parentMethod() {
        // Transaction T1 starts here
        performParentOperation();

        // Child method behavior depends on propagation
        childService.childMethod();

        // If child method fails, what happens to T1?
    }
}

@Service
public class ChildService {

    @Transactional(propagation = Propagation.REQUIRED)
    public void childMethodRequired() {
        // Participates in T1 - if this fails, T1 rolls back
        performChildOperation();
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void childMethodRequiresNew() {
        // Creates new transaction T2 - if this fails, only T2 rolls back
        performChildOperation();
    }

    @Transactional(propagation = Propagation.NESTED)
    public void childMethodNested() {
        // Creates nested transaction - can be rolled back independently
        performChildOperation();
    }
}
```

## Transaction Isolation

### Isolation Levels

```java
@Service
public class BankingService {

    @Transactional(isolation = Isolation.READ_UNCOMMITTED)
    public BigDecimal getBalanceQuick(Long accountId) {
        // Allows dirty reads - fastest but least consistent
        return accountRepository.findById(accountId).getBalance();
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public BigDecimal getBalanceStable(Long accountId) {
        // Prevents dirty reads but allows non-repeatable reads
        return accountRepository.findById(accountId).getBalance();
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public TransferResult validateTransfer(Long fromId, Long toId, BigDecimal amount) {
        // Prevents dirty and non-repeatable reads
        Account from = accountRepository.findById(fromId);
        Account to = accountRepository.findById(toId);

        // These reads will return same values throughout transaction
        BigDecimal fromBalance1 = from.getBalance();
        performSomeOperation();
        BigDecimal fromBalance2 = from.getBalance(); // Same as fromBalance1

        return new TransferResult(fromBalance1.compareTo(amount) >= 0);
    }

    @Transactional(isolation = Isolation.SERIALIZABLE)
    public void performCriticalOperation(Long accountId) {
        // Highest isolation - prevents all phenomena but slowest
        Account account = accountRepository.findById(accountId);
        performComplexCalculation(account);
        accountRepository.save(account);
    }
}
```

### Isolation Problems and Solutions

```java
@Service
public class IsolationExampleService {

    // Dirty Read Problem
    @Transactional(isolation = Isolation.READ_UNCOMMITTED)
    public void demonstrateDirtyRead() {
        // Thread 1: Modifies data but hasn't committed
        // Thread 2: Reads uncommitted data (dirty read)
        // Thread 1: Rolls back - Thread 2 has invalid data
    }

    // Non-Repeatable Read Problem
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void demonstrateNonRepeatableRead(Long accountId) {
        BigDecimal balance1 = getBalance(accountId); // $100

        // Another transaction modifies and commits balance to $200

        BigDecimal balance2 = getBalance(accountId); // $200

        // balance1 != balance2 within same transaction
    }

    // Phantom Read Problem
    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public void demonstratePhantomRead() {
        List<Account> accounts1 = accountRepository.findByStatus("ACTIVE"); // 5 accounts

        // Another transaction inserts new ACTIVE account and commits

        List<Account> accounts2 = accountRepository.findByStatus("ACTIVE"); // 6 accounts

        // Different result set sizes within same transaction
    }
}
```

## Transaction Configuration

### Java Configuration

```java
@Configuration
@EnableTransactionManagement
public class TransactionConfig {

    @Bean
    public PlatformTransactionManager transactionManager(DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }

    @Bean
    public TransactionTemplate transactionTemplate(PlatformTransactionManager transactionManager) {
        TransactionTemplate template = new TransactionTemplate(transactionManager);
        template.setTimeout(30);
        template.setIsolationLevel(TransactionDefinition.ISOLATION_READ_COMMITTED);
        return template;
    }
}
```

### Multiple Transaction Managers

```java
@Configuration
@EnableTransactionManagement
public class MultipleTransactionManagerConfig {

    @Bean
    @Primary
    public PlatformTransactionManager primaryTransactionManager(
            @Qualifier("primaryDataSource") DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }

    @Bean
    public PlatformTransactionManager secondaryTransactionManager(
            @Qualifier("secondaryDataSource") DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }
}

@Service
public class MultiDbService {

    @Transactional("primaryTransactionManager")
    public void updatePrimaryDb() {
        // Uses primary transaction manager
    }

    @Transactional("secondaryTransactionManager")
    public void updateSecondaryDb() {
        // Uses secondary transaction manager
    }
}
```

## Distributed Transactions

### JTA Configuration

```java
@Configuration
public class JtaConfig {

    @Bean
    public JtaTransactionManager transactionManager() {
        return new JtaTransactionManager();
    }

    @Bean
    public DataSource dataSource() {
        // XA DataSource configuration
        return new XADataSourceWrapper();
    }
}
```

### Two-Phase Commit Example

```java
@Service
@Transactional
public class DistributedTransactionService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private JmsTemplate jmsTemplate;

    public void processDistributedOrder(Order order) {
        // Phase 1: Prepare all resources
        orderRepository.save(order);              // DB 1
        paymentRepository.save(order.getPayment()); // DB 2
        jmsTemplate.send("order.queue", order);    // JMS

        // Phase 2: Commit all resources
        // Handled automatically by JTA transaction manager
    }
}
```

## Error Handling and Rollback

### Custom Rollback Rules

```java
@Service
public class OrderService {

    @Transactional(rollbackFor = {BusinessException.class, ValidationException.class},
                   noRollbackFor = {LoggingException.class, MetricsException.class})
    public Order processOrder(OrderRequest request) {
        try {
            Order order = createOrder(request);
            validateOrder(order);
            saveOrder(order);
            return order;
        } catch (LoggingException e) {
            // Transaction continues - no rollback
            log.warn("Logging failed but order processed", e);
            return order;
        } catch (BusinessException e) {
            // Transaction rolls back
            throw e;
        }
    }

    @Transactional
    public void processWithManualRollback(Order order) {
        try {
            processOrder(order);
        } catch (RecoverableException e) {
            // Mark for rollback manually
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            throw new OrderProcessingException("Order processing failed", e);
        }
    }
}
```

### Transaction Event Handling

```java
@Component
public class TransactionEventListener {

    @TransactionalEventListener(phase = TransactionPhase.BEFORE_COMMIT)
    public void handleBeforeCommit(OrderCreatedEvent event) {
        // Executed before transaction commit
        validateOrderBeforeCommit(event.getOrder());
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleAfterCommit(OrderCreatedEvent event) {
        // Executed after successful commit
        sendOrderConfirmationEmail(event.getOrder());
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_ROLLBACK)
    public void handleAfterRollback(OrderCreatedEvent event) {
        // Executed after rollback
        logOrderFailure(event.getOrder());
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMPLETION)
    public void handleAfterCompletion(OrderCreatedEvent event) {
        // Executed after commit or rollback
        cleanupResources(event.getOrder());
    }
}

@Service
@Transactional
public class OrderService {

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    public Order createOrder(OrderRequest request) {
        Order order = new Order(request);
        Order savedOrder = orderRepository.save(order);

        // Event will be handled based on transaction outcome
        eventPublisher.publishEvent(new OrderCreatedEvent(savedOrder));

        return savedOrder;
    }
}
```

## Performance Considerations

### Transaction Boundaries

```java
@Service
public class OptimizedService {

    // BAD: Transaction too broad
    @Transactional
    public void processLargeDataSet(List<Data> dataSet) {
        for (Data data : dataSet) {
            processData(data);
            performExpensiveOperation(data); // Network call, file I/O
        }
    }

    // GOOD: Narrow transaction scope
    @Transactional
    public void processDataOptimized(Data data) {
        processData(data);
    }

    public void processLargeDataSetOptimized(List<Data> dataSet) {
        for (Data data : dataSet) {
            processDataOptimized(data); // Each in separate transaction
            performExpensiveOperation(data); // Outside transaction
        }
    }
}
```

### Read-Only Transactions

```java
@Service
@Transactional(readOnly = true)
public class ReportService {

    public ReportData generateReport(ReportCriteria criteria) {
        // Read-only transaction enables optimizations:
        // - Hibernate won't flush session
        // - Database optimizations
        // - Connection pool optimizations

        List<Order> orders = orderRepository.findByCriteria(criteria);
        List<Customer> customers = customerRepository.findByCriteria(criteria);

        return ReportData.builder()
                .orders(orders)
                .customers(customers)
                .build();
    }

    @Transactional(readOnly = false) // Override class-level setting
    public void updateReportCache(ReportData data) {
        reportCacheRepository.save(data);
    }
}
```

## Testing Transactions

### Transaction Testing

```java
@SpringBootTest
@Transactional
class TransactionTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Test
    @Rollback
    void shouldRollbackTransaction() {
        User user = userService.createUser("John", "john@example.com");
        assertThat(user.getId()).isNotNull();

        // Transaction will be rolled back after test
    }

    @Test
    @Commit
    void shouldCommitTransaction() {
        User user = userService.createUser("Jane", "jane@example.com");
        assertThat(user.getId()).isNotNull();

        // Transaction will be committed after test
    }

    @Test
    void shouldTestTransactionPropagation() {
        assertThrows(DataIntegrityViolationException.class, () -> {
            userService.createUsersWithDifferentPropagation();
        });

        // Verify transaction behavior
        List<User> users = userRepository.findAll();
        assertThat(users).hasSize(expectedSize);
    }
}
```

This comprehensive guide covers Spring's transaction management capabilities, from basic declarative transactions to complex distributed transaction scenarios, with practical examples and best practices for each concept.
