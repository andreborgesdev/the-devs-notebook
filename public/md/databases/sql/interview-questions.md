# SQL Interview Questions

### What is a Database?

A database is an organized collection of data, stored and retrieved digitally from a computer system. Databases can be vast and complex, often developed using design and modeling techniques.

### What is DBMS?

DBMS (Database Management System) is software responsible for creating, retrieving, updating, and managing databases. It ensures data consistency, organization, and accessibility.

### What is RDBMS? How is it different from DBMS?

RDBMS (Relational Database Management System) stores data in tables with defined relationships between them, unlike DBMS which doesn't require relational structure.

### What is SQL?

SQL (Structured Query Language) is the standard language used to manage and manipulate relational databases.

### Difference between SQL and MySQL

- **SQL**: A query language.
- **MySQL**: An RDBMS that uses SQL to manage databases.

### What are Tables and Fields?

- **Table**: Collection of data organized in rows and columns.
- **Field**: Column in a table.

### What are Constraints?

Rules applied to table columns to ensure data integrity, such as NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY, CHECK, DEFAULT, and INDEX.

### What is a Primary Key?

A column (or set of columns) that uniquely identifies each row in a table.

### What is a UNIQUE Constraint?

Ensures all values in a column are unique across the table.

### What is a Foreign Key?

A field (or collection of fields) in one table that refers to the PRIMARY KEY in another table.

### What is a Join? List its types.

Combines rows from two or more tables:

- INNER JOIN
- LEFT JOIN
- RIGHT JOIN
- FULL OUTER JOIN
- SELF JOIN
- CROSS JOIN

### What is a Self-Join?

A join where a table is joined to itself.

### What is a Cross-Join?

Returns the Cartesian product of two tables.

### What is an Index?

A data structure that improves the speed of data retrieval. Types include:

- Unique and Non-Unique Index
- Clustered and Non-Clustered Index

### Clustered vs. Non-clustered Index

- **Clustered**: Alters the table's physical order.
- **Non-clustered**: Creates a separate index structure.

### What is Data Integrity?

Ensures data accuracy and consistency over its lifecycle.

### What is a Query?

A request for data from a database.

### What is a Subquery?

A query nested inside another query. Types:

- Correlated
- Non-Correlated

### SELECT Statement

Used to retrieve data from a database.

### Common Clauses with SELECT

- WHERE
- ORDER BY
- GROUP BY
- HAVING

### UNION, MINUS, INTERSECT

- **UNION**: Combines result sets.
- **MINUS**: Returns rows from the first query not in the second.
- **INTERSECT**: Returns common rows from both queries.

### What is a Cursor?

A database object used to retrieve, manipulate, and navigate through result sets.

### Entities and Relationships

- **Entity**: Real-world object.
- **Relationship**: Link between entities.

### Types of Relationships

- One-to-One
- One-to-Many / Many-to-One
- Many-to-Many
- Self-Referencing

### What is an Alias?

A temporary name assigned to a table or column.

### What is a View?

A virtual table based on the result of a SELECT query.

### What is Normalization?

Organizing data to minimize redundancy. Forms include:

- 1NF
- 2NF
- 3NF
- BCNF

### What is Denormalization?

The process of introducing redundancy to improve read performance.

### TRUNCATE vs DELETE vs DROP

- **TRUNCATE**: Removes all rows and frees space.
- **DELETE**: Removes specified rows.
- **DROP**: Deletes the entire table structure and data.

### Aggregate vs Scalar Functions

- **Aggregate**: Operate on sets of values (SUM, AVG, COUNT).
- **Scalar**: Operate on individual values (LEN, UCASE, LCASE).

### User-defined Functions

Functions created by users. Types:

- Scalar
- Table-Valued (Inline, Multi-statement)

### What is OLTP?

Online Transaction Processing, optimized for managing transactional data.

### OLTP vs OLAP

- **OLTP**: Transaction-oriented, simple queries.
- **OLAP**: Analytical, complex queries.

### What is Collation?

Set of rules determining how data is sorted and compared, with sensitivity to case, accents, kana, and width.

### What is a Stored Procedure?

A saved collection of SQL statements to perform a specific task.

### Recursive Stored Procedure

A procedure that calls itself until a termination condition is met.

### Stored Procedure vs Function

- Procedures can return zero or multiple values.
- Functions return a single value and can be used in SELECT statements.

### Create Empty Table with Same Structure

```sql
SELECT * INTO new_table FROM existing_table WHERE 1=2;
```

### Pattern Matching

Using LIKE and wildcards (% and \_) to search for patterns in data.

### ACID Properties

- **Atomicity**: All-or-nothing transactions.
- **Consistency**: Transactions maintain database rules.
- **Isolation**: Concurrent transactions don’t interfere.
- **Durability**: Once committed, changes are permanent.

### What is a Transaction?

A logical unit of work containing one or more SQL statements. Either fully completed (COMMIT) or undone (ROLLBACK).

### What is a CTE (Common Table Expression) and why would you use it?

A **CTE** is a named temporary result set that can be referenced within a `SELECT`, `INSERT`, `UPDATE`, or `DELETE` statement.
It improves:

- Readability and maintainability of complex queries.
- Ability to create recursive queries.

```sql
WITH SalesCTE AS (
   SELECT Salesperson, SUM(Sales) AS TotalSales
   FROM Sales
   GROUP BY Salesperson
)
SELECT * FROM SalesCTE WHERE TotalSales > 10000;
```

---

### What’s the difference between a CTE and a subquery?

- **CTEs** can be self-referencing and can improve readability.
- **Subqueries** are typically embedded and less reusable.
- In some databases (like SQL Server), CTEs can be recursive — subqueries cannot.

---

### Explain the difference between ROW_NUMBER(), RANK(), and DENSE_RANK().

| Function     | Gaps in Ranking? | Duplicates?                    |
| ------------ | ---------------- | ------------------------------ |
| ROW_NUMBER() | No               | Always unique                  |
| RANK()       | Yes              | Same rank for ties, gaps exist |
| DENSE_RANK() | No               | Same rank for ties, no gaps    |

```sql
SELECT Name, Department,
ROW_NUMBER() OVER (PARTITION BY Department ORDER BY Salary DESC) AS RowNum,
RANK() OVER (PARTITION BY Department ORDER BY Salary DESC) AS RankNum,
DENSE_RANK() OVER (PARTITION BY Department ORDER BY Salary DESC) AS DenseRankNum
FROM Employees;
```

---

### What is a Window Function and how does it differ from aggregate functions?

**Window functions** perform a calculation across a set of rows related to the current row without collapsing the result set like aggregate functions do.

Example:

```sql
SELECT Name, Salary,
AVG(Salary) OVER (PARTITION BY Department) AS DeptAvgSalary
FROM Employees;
```

---

### What are the pros and cons of indexing?

**Pros:**

- Faster query performance, especially for `SELECT` statements with `WHERE`, `ORDER BY`, and `JOIN`.

**Cons:**

- Slower writes (`INSERT`, `UPDATE`, `DELETE`).
- Increased disk space usage.
- Can become fragmented over time.

---

### What is a covering index?

A **covering index** includes all columns required by a query, allowing it to be satisfied entirely by the index without looking up the table’s data (avoiding "bookmark lookups").

---

### How would you optimize a slow SQL query?

Techniques include:

- Reviewing execution plans.
- Adding appropriate indexes.
- Rewriting joins and subqueries.
- Using `EXISTS` instead of `IN` for large subqueries.
- Avoiding `SELECT *`.
- Partitioning large tables.

---

### What are clustered vs. non-clustered indexes?

| Clustered Index              | Non-clustered Index        |
| ---------------------------- | -------------------------- |
| Sorts & stores the data rows | Separate from data rows    |
| One per table                | Multiple allowed per table |
| Faster for range queries     | Better for point lookups   |

---

### What is query plan caching?

Query plans are compiled and stored in a cache so the database can reuse execution strategies for repeated queries, reducing compilation overhead.

---

### What are Isolation Levels in SQL?

Defines how/when changes made by transactions become visible to other transactions:

- **READ UNCOMMITTED**: Dirty reads allowed.
- **READ COMMITTED**: No dirty reads.
- **REPEATABLE READ**: No dirty or non-repeatable reads.
- **SERIALIZABLE**: Fully isolated; highest overhead.

---

### What are dirty reads, non-repeatable reads, and phantom reads?

| Issue               | Description                                          |
| ------------------- | ---------------------------------------------------- |
| Dirty read          | Reading uncommitted changes from another transaction |
| Non-repeatable read | Data read twice yields different values              |
| Phantom read        | New rows appear or disappear in repeated queries     |

---

### What’s the difference between DELETE, TRUNCATE, and DROP?

| Command  | Removes Data | Removes Structure | Rollback Possible |
| -------- | ------------ | ----------------- | ----------------- |
| DELETE   | Yes          | No                | Yes               |
| TRUNCATE | Yes          | No                | Often No          |
| DROP     | Yes          | Yes               | No                |

---

### What is the difference between an INNER JOIN and an OUTER JOIN?

| Join Type        | Returns                                      |
| ---------------- | -------------------------------------------- |
| INNER JOIN       | Matching rows only                           |
| LEFT OUTER JOIN  | All rows from left + matched rows from right |
| RIGHT OUTER JOIN | All rows from right + matched rows from left |
| FULL OUTER JOIN  | All rows from both sides                     |

---

### Explain the difference between scalar and inline table-valued functions.

- **Scalar functions**: Return a single value.
- **Inline table-valued functions**: Return a table and tend to perform better because they can be inlined by the query optimizer.

---

### What is a pivot and unpivot operation?

- **Pivot**: Rotates rows into columns.
- **Unpivot**: Rotates columns into rows.

Example pivot:

```sql
SELECT Department,
       SUM(CASE WHEN Month = 'Jan' THEN Sales ELSE 0 END) AS JanSales
FROM SalesData
GROUP BY Department;
```

---

### What is the difference between EXISTS and IN?

- `EXISTS` stops processing once a match is found (better for correlated subqueries).
- `IN` compares against a complete list and can perform worse with large subqueries.

---

### How do you handle hierarchical data in SQL?

Using **recursive CTEs**:

```sql
WITH RecursiveCTE AS (
    SELECT ID, ParentID, Name
    FROM Categories
    WHERE ParentID IS NULL
    UNION ALL
    SELECT c.ID, c.ParentID, c.Name
    FROM Categories c
    INNER JOIN RecursiveCTE r ON c.ParentID = r.ID
)
SELECT * FROM RecursiveCTE;
```

---

### What is the purpose of query hints?

Query hints override the default behavior of the query optimizer to influence execution plans (e.g., forcing index usage, join types, etc.).

Example:

```sql
SELECT * FROM Employees WITH (INDEX (idx_name));
```

---

### How do partitions improve query performance?

- Break large tables into smaller, manageable pieces.
- Improve query performance by scanning only relevant partitions.
- Enhance maintenance and backup strategies.

---

### What’s the difference between SARGable and non-SARGable queries?

**SARGable** queries can use indexes efficiently (e.g., `WHERE column = value`).
**Non-SARGable** queries can't use indexes effectively (e.g., `WHERE FUNCTION(column) = value`).

---

### What are ACID properties and how do modern SQL engines handle them?

**Atomicity, Consistency, Isolation, Durability** — modern databases handle ACID compliance using transaction logs, locks, MVCC (Multi-Version Concurrency Control), and write-ahead logging.
