# SQL

**Structured Query Language (SQL)** is the standard language for relational database management systems (RDBMS). SQL enables the creation, retrieval, updating, and management of data stored in relational databases.

## Core Concepts

### What is a Database?

A database is an organized collection of data that can be easily accessed, managed, and updated. Databases support efficient data storage and retrieval.

### What is DBMS?

**Database Management System (DBMS)** is system software that facilitates the creation, retrieval, and management of data in databases. It ensures data consistency and controlled access.

### What is RDBMS?

**Relational Database Management System (RDBMS)** stores data in tables and supports relationships between tables. Examples: MySQL, PostgreSQL, SQL Server, Oracle.

### What is SQL?

**Structured Query Language (SQL)** is used to interact with RDBMS by querying, updating, and managing data.

### SQL vs MySQL

- **SQL**: Language for querying relational databases.
- **MySQL**: An open-source RDBMS that uses SQL.

## Data Definition Language (DDL)

Commands used to define and modify database structure:

```sql
CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    department_id INT
);

ALTER TABLE employees ADD hire_date DATE;
DROP TABLE old_employees;
```

## Data Manipulation Language (DML)

Commands used to manage data:

```sql
INSERT INTO employees (id, name, department_id) VALUES (1, 'John Doe', 101);
UPDATE employees SET name = 'Jane Doe' WHERE id = 1;
DELETE FROM employees WHERE id = 1;
```

## Data Control Language (DCL)

Controls access to data:

```sql
GRANT SELECT, INSERT ON employees TO analyst;
REVOKE INSERT ON employees FROM analyst;
```

## Transaction Control Language (TCL)

Manages transactions:

```sql
BEGIN TRANSACTION;
UPDATE employees SET department_id = 5 WHERE id = 1;
COMMIT;
```

## Query Clauses

```sql
SELECT name, department_id
FROM employees
WHERE department_id = 5
GROUP BY department_id
HAVING COUNT(*) > 10
ORDER BY name ASC
LIMIT 10;
```

## Joins

- **INNER JOIN**
- **LEFT JOIN**
- **RIGHT JOIN**
- **FULL OUTER JOIN**
- **SELF JOIN**
- **CROSS JOIN**

```sql
SELECT e.name, d.name
FROM employees e
INNER JOIN departments d ON e.department_id = d.id;
```

## Subqueries

```sql
SELECT name FROM employees
WHERE department_id = (
    SELECT id FROM departments WHERE name = 'HR'
);
```

## Constraints

- **NOT NULL**
- **UNIQUE**
- **PRIMARY KEY**
- **FOREIGN KEY**
- **CHECK**
- **DEFAULT**

## Indexing

Speeds up data retrieval:

```sql
CREATE INDEX idx_department_id ON employees(department_id);
```

### Clustered vs Non-Clustered Index

- **Clustered**: Alters the physical order of data.
- **Non-clustered**: Maintains a separate structure from data.

## Keys

- **Primary Key**: Unique row identifier.
- **Foreign Key**: Enforces referential integrity.

## Views

```sql
CREATE VIEW dept_employees AS
SELECT e.name, d.name AS department_name
FROM employees e
JOIN departments d ON e.department_id = d.id;
```

## ACID Properties

- **Atomicity**: All or nothing.
- **Consistency**: Data remains valid.
- **Isolation**: Concurrent transactions execute independently.
- **Durability**: Committed data persists.

## Normalization

| Normal Form | Purpose                        |
| ----------- | ------------------------------ |
| 1NF         | Eliminate repeating groups     |
| 2NF         | Remove partial dependencies    |
| 3NF         | Remove transitive dependencies |
| BCNF        | Stronger version of 3NF        |

## Denormalization

Involves adding redundancy for performance improvement, typically for read-heavy applications.

## Aggregate Functions

```sql
SELECT department_id, COUNT(*) FROM employees GROUP BY department_id;
```

Functions: `COUNT()`, `SUM()`, `AVG()`, `MIN()`, `MAX()`

## Scalar Functions

Examples: `LEN()`, `UCASE()`, `NOW()`, `ROUND()`

## Transactions

```sql
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
```

## Pattern Matching

```sql
SELECT * FROM employees WHERE name LIKE 'A%';
```

Wildcards:

- `%` for zero or more characters.
- `_` for exactly one character.

## Stored Procedures

```sql
CREATE PROCEDURE GetEmployees()
BEGIN
    SELECT * FROM employees;
END;
```

## Functions vs Stored Procedures

| Feature             | Function                   | Stored Procedure                   |
| ------------------- | -------------------------- | ---------------------------------- |
| Return Type         | Must return a value        | Optional                           |
| Usage               | Can be used in SQL queries | Cannot be used directly in queries |
| Exception Handling  | Not allowed                | Allowed                            |
| Transaction Support | No                         | Yes                                |

## OLTP vs OLAP

| Feature | OLTP          | OLAP            |
| ------- | ------------- | --------------- |
| Purpose | Transactional | Analytical      |
| Queries | Simple, fast  | Complex, slower |
| Data    | Current       | Historical      |

## Collation

Defines how data is sorted and compared, considering case, accent, kana, and width sensitivity.

## Cursors

```sql
DECLARE my_cursor CURSOR FOR
SELECT name FROM employees;
OPEN my_cursor;
FETCH NEXT FROM my_cursor INTO @name;
CLOSE my_cursor;
DEALLOCATE my_cursor;
```

## UNION, MINUS, INTERSECT

```sql
SELECT name FROM employees
UNION
SELECT name FROM managers;
```

## Transactions and Isolation Levels

| Isolation Level  | Dirty Read | Non-repeatable Read | Phantom Read |
| ---------------- | ---------- | ------------------- | ------------ |
| Read Uncommitted | Yes        | Yes                 | Yes          |
| Read Committed   | No         | Yes                 | Yes          |
| Repeatable Read  | No         | No                  | Yes          |
| Serializable     | No         | No                  | No           |

## Common SQL Interview Topics

- Writing complex queries and joins.
- Optimizing queries with indexing.
- Understanding normalization/denormalization.
- ACID properties.
- Transactions and isolation levels.
- Query execution plans (`EXPLAIN`).
- Stored procedures vs functions.
- Difference between OLTP and OLAP.
- Pattern matching with `LIKE`.

## Additional Resources

- [SQL vs NoSQL](https://blog.tryexponent.com/sql-vs-nosql)
- [CAP Theorem](https://blog.tryexponent.com/cap-theorem)
- [SQL Style Guide](https://www.sqlstyle.guide/)
