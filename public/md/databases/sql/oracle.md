# Oracle

**Oracle Database** (often simply called _Oracle_) is one of the most popular and powerful relational database management systems (RDBMS), widely used in enterprise environments for managing large and complex datasets.

## Key Features

- **Multi-model database**: Supports relational, JSON, XML, spatial, graph, and more.
- **High availability**: Features like Real Application Clusters (RAC) and Data Guard.
- **Advanced security**: Data encryption, fine-grained access control, auditing.
- **Performance tuning**: Optimizer hints, partitioning, parallel query execution.
- **PL/SQL**: Oracle’s proprietary procedural language extension to SQL.

## Architecture Overview

| Component     | Description                                                |
| ------------- | ---------------------------------------------------------- |
| **Instance**  | The set of Oracle background processes and memory.         |
| **Database**  | The physical storage of data.                              |
| **SGA & PGA** | Shared Global Area and Program Global Area (memory areas). |
| **Process**   | Background and user processes handle database operations.  |

## SQL and PL/SQL

Oracle uses standard SQL along with PL/SQL for procedural logic.

```sql
BEGIN
    DBMS_OUTPUT.PUT_LINE('Hello, Oracle!');
END;
/
```

## Common Objects

- **Tables**: Store data.
- **Views**: Virtual tables based on queries.
- **Indexes**: Speed up queries.
- **Sequences**: Generate unique numbers.
- **Synonyms**: Aliases for database objects.

## Table Functions

**Table functions** return a collection type that can be queried like a table. They are useful when complex filtering or transformation is needed before querying the data.

**Advantages**:

- Accept parameters (unlike standard views).
- Optimize performance by enabling efficient index usage in sub-queries.
- Promote reusability and modular query design.

```sql
CREATE OR REPLACE TYPE number_table AS TABLE OF NUMBER;
/

CREATE OR REPLACE FUNCTION get_filtered_numbers(p_min NUMBER)
RETURN number_table PIPELINED IS
BEGIN
    FOR i IN 1..100 LOOP
        IF i > p_min THEN
            PIPE ROW(i);
        END IF;
    END LOOP;
    RETURN;
END;
/

-- Using the table function in a query
SELECT * FROM TABLE(get_filtered_numbers(50));
```

**Use Case Tip**:
If you need to pass parameters into a query used inside a view or sub-query, **table functions can be used as views with parameters**, improving flexibility and potentially performance—because the Oracle Optimizer can better utilize indexes during sub-query execution.

## Performance Features

- **Indexes**: B-tree, bitmap, function-based.
- **Materialized Views**: Precompute and store complex query results.
- **Partitioning**: Divide tables into manageable pieces.
- **Query Optimizer**: Determines the best execution plan.
- **Hints**: Allow manual tuning of queries.

## Transactions and Concurrency

Oracle supports **ACID** transactions and provides advanced concurrency control through mechanisms like:

- **Locks**: Implicit and explicit.
- **Multi-version Concurrency Control (MVCC)**: Readers don't block writers.

## Security

- **Roles and privileges**: Fine-grained access control.
- **Data encryption**: Transparent Data Encryption (TDE).
- **Auditing**: User actions and data access.

## Backup and Recovery

- **RMAN (Recovery Manager)**: For backups and restores.
- **Data Pump**: For export and import of data.
- **Flashback Technology**: Query and recover past data states.

## Advanced Topics

- **Oracle RAC**: Clustered database for high availability and scalability.
- **Oracle Data Guard**: Disaster recovery and failover solution.
- **PL/SQL Collections and Bulk Processing**: Optimize performance for large data operations.
- **Table Partitioning Strategies**: Range, list, hash, and composite partitioning.

## Useful Oracle-Specific SQL Functions

| Function            | Purpose                         |
| ------------------- | ------------------------------- |
| `NVL(expr1, expr2)` | Returns expr2 if expr1 is NULL. |
| `DECODE()`          | Conditional querying.           |
| `TO_DATE()`         | Convert string to date.         |
| `ROWNUM`            | Assign row numbers.             |
| `CONNECT BY`        | Hierarchical queries.           |

## Sample Query

```sql
SELECT employee_id, first_name, department_id
FROM employees
WHERE department_id IN (10, 20)
ORDER BY first_name;
```

## When to Use Table Functions for Performance

- When filtering logic is too complex for standard WHERE clauses.
- When you need parameterized "views."
- When sub-queries would benefit from improved index utilization.

By encapsulating logic inside table functions, Oracle’s **Cost-Based Optimizer (CBO)** can generate better execution plans and leverage indexes efficiently even inside deeply nested sub-queries.

## PL/SQL (Procedural Language for SQL)

**PL/SQL** is Oracle’s procedural extension to SQL. It combines SQL’s data manipulation capabilities with procedural programming features, offering greater control over data processing and application logic.

### Key Features

- **Block-structured**: Code is organized into blocks containing **declarations**, **execution statements**, and **exception handlers**.
- **Tight SQL integration**: Seamlessly executes SQL commands.
- **Control structures**: Supports IF statements, loops, CASE, etc.
- **Exception handling**: Robust error management.
- **Modularity**: Use of procedures, functions, packages, and triggers.
- **Portability**: PL/SQL code can run unchanged across different Oracle environments.

### Basic PL/SQL Block Structure

```sql
DECLARE
    -- Variable declarations
    v_employee_name VARCHAR2(100);
BEGIN
    -- Executable statements
    SELECT first_name INTO v_employee_name
    FROM employees
    WHERE employee_id = 100;

    DBMS_OUTPUT.PUT_LINE('Employee Name: ' || v_employee_name);
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('No employee found.');
END;
/
```

### Control Structures

```sql
-- IF statement
IF v_salary > 5000 THEN
    DBMS_OUTPUT.PUT_LINE('High salary');
END IF;

-- LOOP
FOR i IN 1..10 LOOP
    DBMS_OUTPUT.PUT_LINE('Counter: ' || i);
END LOOP;
```

### Procedures

Reusable subprograms for executing logic without returning a value.

```sql
CREATE OR REPLACE PROCEDURE greet_employee(p_emp_id NUMBER) AS
    v_name VARCHAR2(100);
BEGIN
    SELECT first_name INTO v_name
    FROM employees
    WHERE employee_id = p_emp_id;

    DBMS_OUTPUT.PUT_LINE('Hello, ' || v_name);
END;
/
```

### Functions

Similar to procedures but **return a value**.

```sql
CREATE OR REPLACE FUNCTION get_employee_salary(p_emp_id NUMBER) RETURN NUMBER IS
    v_salary NUMBER;
BEGIN
    SELECT salary INTO v_salary
    FROM employees
    WHERE employee_id = p_emp_id;

    RETURN v_salary;
END;
/
```

### Packages

A **package** is a schema object that groups logically related PL/SQL types, variables, procedures, functions, and cursors.

```sql
CREATE OR REPLACE PACKAGE employee_pkg AS
    PROCEDURE hire_employee(p_name VARCHAR2, p_salary NUMBER);
    FUNCTION get_total_employees RETURN NUMBER;
END employee_pkg;
/
```

### Exception Handling

PL/SQL supports handling of runtime errors using the `EXCEPTION` section.

```sql
BEGIN
    -- risky operations
EXCEPTION
    WHEN ZERO_DIVIDE THEN
        DBMS_OUTPUT.PUT_LINE('Division by zero occurred.');
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('An unexpected error occurred.');
END;
```

### Cursors

**Explicit cursors** allow control over query processing row by row.

```sql
DECLARE
    CURSOR emp_cursor IS
        SELECT employee_id, first_name FROM employees WHERE department_id = 10;
BEGIN
    FOR emp_record IN emp_cursor LOOP
        DBMS_OUTPUT.PUT_LINE('ID: ' || emp_record.employee_id || ' Name: ' || emp_record.first_name);
    END LOOP;
END;
/
```

**Implicit cursors** are automatically created for single-row queries like `SELECT INTO`.

### Bulk Collect & FORALL

**Bulk operations** significantly improve performance by minimizing context switches between SQL and PL/SQL engines.

```sql
DECLARE
    TYPE emp_sal_tab IS TABLE OF employees.salary%TYPE;
    v_salaries emp_sal_tab;
BEGIN
    SELECT salary BULK COLLECT INTO v_salaries FROM employees;

    FORALL i IN 1..v_salaries.COUNT
        UPDATE employees SET salary = salary * 1.05 WHERE salary = v_salaries(i);
END;
/
```

### Dynamic SQL

**Execute immediate** allows dynamic execution of SQL statements built at runtime.

```sql
DECLARE
    v_table_name VARCHAR2(30) := 'EMPLOYEES';
    v_sql VARCHAR2(200);
BEGIN
    v_sql := 'SELECT COUNT(*) FROM ' || v_table_name;
    EXECUTE IMMEDIATE v_sql INTO v_count;
END;
```

### Advantages of PL/SQL

- **Reduced network traffic**: Multiple SQL statements can be bundled in a single PL/SQL block.
- **Better performance**: Compiled and stored in the database, reducing parsing overhead.
- **Security**: Code encapsulation using packages and access control.
- **Maintainability**: Modular programming supports easier debugging and maintenance.
