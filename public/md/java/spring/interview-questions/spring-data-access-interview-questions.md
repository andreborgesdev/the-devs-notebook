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

For more information:

- [Difference between CrudRepository and JpaRepository](https://www.tutorialspoint.com/difference-between-crudrepository-and-jparepository-in-java)
- [Baeldung Spring Data Repositories](https://www.baeldung.com/spring-data-repositories)
