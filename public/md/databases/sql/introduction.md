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

SQL joins combine rows from two or more tables based on related columns between them. Understanding joins is crucial for working with relational databases.

### Sample Tables

```sql
-- employees table
id | name     | department_id | salary
1  | Alice    | 101          | 75000
2  | Bob      | 102          | 65000
3  | Charlie  | 101          | 85000
4  | Diana    | NULL         | 70000

-- departments table
id  | name        | location
101 | Engineering | New York
102 | Marketing   | Boston
103 | Sales       | Chicago
```

### INNER JOIN

Returns only rows that have matching values in both tables.

```sql
SELECT e.name, d.name AS department_name
FROM employees e
INNER JOIN departments d ON e.department_id = d.id;
```

**Result:**

```
name    | department_name
Alice   | Engineering
Bob     | Marketing
Charlie | Engineering
```

_Note: Diana is excluded (NULL department_id), Sales department is excluded (no employees)_

### LEFT JOIN (LEFT OUTER JOIN)

Returns all rows from the left table and matching rows from the right table. NULL values for non-matching right table columns.

```sql
SELECT e.name, d.name AS department_name
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id;
```

**Result:**

```
name    | department_name
Alice   | Engineering
Bob     | Marketing
Charlie | Engineering
Diana   | NULL
```

_Note: All employees included, Diana gets NULL for department_

### RIGHT JOIN (RIGHT OUTER JOIN)

Returns all rows from the right table and matching rows from the left table. NULL values for non-matching left table columns.

```sql
SELECT e.name, d.name AS department_name
FROM employees e
RIGHT JOIN departments d ON e.department_id = d.id;
```

**Result:**

```
name    | department_name
Alice   | Engineering
Bob     | Marketing
Charlie | Engineering
NULL    | Sales
```

_Note: All departments included, Sales gets NULL for employee_

### FULL OUTER JOIN

Returns all rows when there's a match in either table. NULL values where no match exists.

```sql
SELECT e.name, d.name AS department_name
FROM employees e
FULL OUTER JOIN departments d ON e.department_id = d.id;
```

**Result:**

```
name    | department_name
Alice   | Engineering
Bob     | Marketing
Charlie | Engineering
Diana   | NULL
NULL    | Sales
```

_Note: All employees and all departments included_

### SELF JOIN

Joins a table with itself, useful for hierarchical data or comparing rows within the same table.

```sql
-- Find employees with higher salaries than Alice
SELECT e1.name AS employee, e2.name AS higher_paid_than
FROM employees e1
JOIN employees e2 ON e1.salary > e2.salary
WHERE e2.name = 'Alice';
```

### CROSS JOIN

Returns the Cartesian product of both tables (every row from first table combined with every row from second table).

```sql
SELECT e.name, d.name AS department_name
FROM employees e
CROSS JOIN departments d;
```

**Result:** 4 employees × 3 departments = 12 rows

### Join Performance Tips

1. **Use indexes** on join columns
2. **Filter early** with WHERE clauses
3. **Choose appropriate join types** based on data requirements
4. **Avoid unnecessary columns** in SELECT clause

### Common Join Patterns

```sql
-- Multiple table joins
SELECT e.name, d.name AS dept, p.title AS project
FROM employees e
JOIN departments d ON e.department_id = d.id
JOIN employee_projects ep ON e.id = ep.employee_id
JOIN projects p ON ep.project_id = p.id;

-- Conditional joins
SELECT e.name, d.name AS department_name
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id AND d.location = 'New York';
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
