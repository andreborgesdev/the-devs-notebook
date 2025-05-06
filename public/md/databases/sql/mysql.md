# MySQL

MySQL is an open-source relational database management system (RDBMS) that uses **Structured Query Language (SQL)** for database access and manipulation. It is widely used in web development, enterprise applications, and data warehousing.

## Key Features

- **Open-source** and cross-platform.
- Supports **SQL standards**.
- **ACID compliance** with InnoDB storage engine.
- **Multi-user and multi-threaded**.
- Offers **replication**, **partitioning**, and **sharding**.
- Supports **stored procedures**, **triggers**, **views**, and **cursors**.
- Integrated with many programming languages (PHP, Python, Java, etc.).

## Storage Engines

MySQL supports multiple storage engines. The two most popular are:

| Storage Engine | Description                                                                             |
| -------------- | --------------------------------------------------------------------------------------- |
| **InnoDB**     | Default engine, supports transactions, row-level locking, foreign keys. ACID compliant. |
| **MyISAM**     | Older engine, fast read operations, no transaction support, table-level locking.        |

## Data Types

**Numeric**: INT, BIGINT, DECIMAL, FLOAT, DOUBLE
**String**: CHAR, VARCHAR, TEXT, BLOB
**Date & Time**: DATE, DATETIME, TIMESTAMP, TIME, YEAR
**JSON**: Supported for semi-structured data

## Common SQL Commands

### Creating a Database

```sql
CREATE DATABASE mydb;
```

### Creating a Table

```sql
CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    salary DECIMAL(10, 2),
    hire_date DATE
);
```

### Inserting Data

```sql
INSERT INTO employees (name, salary, hire_date)
VALUES ('John Doe', 50000.00, '2024-06-01');
```

### Querying Data

```sql
SELECT name, salary FROM employees WHERE salary > 40000;
```

### Updating Data

```sql
UPDATE employees SET salary = salary * 1.1 WHERE id = 1;
```

### Deleting Data

```sql
DELETE FROM employees WHERE id = 3;
```

## Indexing

Indexes improve read performance but may slow down writes.

```sql
CREATE INDEX idx_salary ON employees(salary);
```

**Best Practices**:

- Index columns used in WHERE, JOIN, ORDER BY clauses.
- Avoid over-indexing to prevent write overhead.

## Joins

```sql
-- INNER JOIN example
SELECT e.name, d.department_name
FROM employees e
JOIN departments d ON e.department_id = d.id;
```

## Transactions

Used to execute multiple statements as a single unit.

```sql
START TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
```

Use `ROLLBACK;` to undo changes if needed.

## Stored Procedures

```sql
DELIMITER $$

CREATE PROCEDURE GetEmployeeSalary(IN emp_id INT)
BEGIN
    SELECT salary FROM employees WHERE id = emp_id;
END $$

DELIMITER ;
```

## User Management and Security

```sql
-- Create user
CREATE USER 'username'@'localhost' IDENTIFIED BY 'password';

-- Grant privileges
GRANT ALL PRIVILEGES ON mydb.* TO 'username'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;
```

**Best Practices**:

- Follow **principle of least privilege**.
- Use strong passwords.
- Keep MySQL updated to patch security vulnerabilities.

## Replication

MySQL supports **master-slave replication** for scaling read operations and **master-master replication** for higher availability.

```bash
# Basic concept (commands depend on configuration)
CHANGE MASTER TO MASTER_HOST='master_host', MASTER_USER='rep_user', MASTER_PASSWORD='rep_pass';
START SLAVE;
```

## Backup and Restore

```bash
# Backup
mysqldump -u username -p mydb > backup.sql

# Restore
mysql -u username -p mydb < backup.sql
```

## Performance Optimization

- **Use EXPLAIN** to analyze query plans.
- Optimize indexes.
- Normalize data but consider denormalization for read-heavy workloads.
- Cache frequent queries (using tools like Redis or Memcached).
- Tune MySQL server parameters (`my.cnf` or `my.ini`).

## ACID Properties

MySQL’s InnoDB engine supports:

- **Atomicity**: Transactions are all-or-nothing.
- **Consistency**: Transactions bring the database from one valid state to another.
- **Isolation**: Concurrent transactions do not interfere.
- **Durability**: Once committed, changes persist even in crashes.

## Differences: MySQL vs Other RDBMS

| Feature           | MySQL        | PostgreSQL  | Oracle     |
| ----------------- | ------------ | ----------- | ---------- |
| License           | Open Source  | Open Source | Commercial |
| ACID Compliance   | Yes (InnoDB) | Yes         | Yes        |
| JSON Support      | Yes          | Advanced    | Yes        |
| Partitioning      | Basic        | Advanced    | Advanced   |
| Replication       | Yes          | Advanced    | Advanced   |
| Stored Procedures | Yes          | Yes         | Yes        |

## When to Use MySQL

- Web and mobile applications.
- Read-heavy applications.
- Applications requiring open-source licensing.
- Projects needing broad community support and compatibility.
