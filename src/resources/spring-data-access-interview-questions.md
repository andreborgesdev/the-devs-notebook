# Spring Data Access

# **What Is Spring *JdbcTemplate* Class and How to Use It?**

The Spring JDBC template is the primary API through which we can access database operations logic that we’re interested in:

- Creation and closing of connections
- Executing statements and stored procedure calls
- Iterating over the *ResultSet* and returning results

In order to use it, we'll need to define the simple configuration of *DataSource*:

```java
@Configuration
@ComponentScan("org.baeldung.jdbc")
publicclassSpringJdbcConfig {
    @Bean
public DataSourcemysqlDataSource() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName("com.mysql.jdbc.Driver");
        dataSource.setUrl("jdbc:mysql://localhost:3306/springjdbc");
        dataSource.setUsername("guest_user");
        dataSource.setPassword("guest_password");

return dataSource;
    }
}
```

For further explanation, check out [this quick article](https://www.baeldung.com/spring-jdbc-jdbctemplate).

# **How to Enable Transactions in Spring and What Are Their Benefits?**

There are two distinct ways to configure *Transactions* — with annotations or by using Aspect-Oriented Programming (AOP) — each with their advantages.

Here are the benefits of using Spring Transactions, according to the [official docs](https://docs.spring.io/spring/docs/current/spring-framework-reference/html/transaction.html):

- Provide a consistent programming model across different transaction APIs such as JTA, JDBC, Hibernate, JPA and JDO
- Support declarative transaction management
- Provide a simpler API for programmatic transaction management than some complex transaction APIs such as JTA
- Integrate very well with Spring's various data access abstractions

# **What Is Spring DAO?**

Spring Data Access Object (DAO) is Spring's support provided to work with data access technologies like JDBC, Hibernate and JPA in a consistent and easy way.

There is an [entire series](https://www.baeldung.com/persistence-with-spring-series/) discussing persistence in Spring that provides a more in-depth look.

## What's the difference between JPARepository and CrudRepository?

`[JpaRepository](http://static.springsource.org/spring-data/data-jpa/docs/current/api/org/springframework/data/jpa/repository/JpaRepository.html)` extends `[PagingAndSortingRepository](http://static.springsource.org/spring-data/data-commons/docs/current/api/org/springframework/data/repository/PagingAndSortingRepository.html)` which in turn extends `[CrudRepository](http://static.springsource.org/spring-data/data-commons/docs/current/api/org/springframework/data/repository/CrudRepository.html)`.

Their main functions are:

- `[CrudRepository](http://static.springsource.org/spring-data/data-commons/docs/current/api/org/springframework/data/repository/CrudRepository.html)` mainly provides CRUD functions.
- `[PagingAndSortingRepository](http://static.springsource.org/spring-data/data-commons/docs/current/api/org/springframework/data/repository/PagingAndSortingRepository.html)` provides methods to do pagination and sorting records.
- `[JpaRepository](http://static.springsource.org/spring-data/data-jpa/docs/current/api/org/springframework/data/jpa/repository/JpaRepository.html)` provides some JPA-related methods such as flushing the persistence context and deleting records in a batch.

Because of the inheritance mentioned above, `JpaRepository` will have all the functions of `CrudRepository` and `PagingAndSortingRepository`. So if you don't need the repository to have the functions provided by `JpaRepository` and `PagingAndSortingRepository` , use `CrudRepository`.

[https://www.tutorialspoint.com/difference-between-crudrepository-and-jparepository-in-java](https://www.tutorialspoint.com/difference-between-crudrepository-and-jparepository-in-java)

[https://www.baeldung.com/spring-data-repositories](https://www.baeldung.com/spring-data-repositories)