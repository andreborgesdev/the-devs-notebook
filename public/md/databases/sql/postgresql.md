# PostgreSQL

**PostgreSQL** (also called Postgres) is a powerful, open-source object-relational database system (ORDBMS) known for its robustness, extensibility, and standards compliance. It supports advanced data types and performance optimization features, making it a popular choice for complex applications.

## Key Features

- **ACID-compliant** for reliable transactions.
- **Standards-compliant SQL** (full ANSI SQL support).
- **Extensibility**: Supports custom data types, operators, and functions.
- **Advanced indexing**: B-tree, Hash, GiST, GIN, SP-GiST, BRIN.
- **JSON and JSONB support** for semi-structured data.
- **MVCC (Multi-Version Concurrency Control)**: High concurrency without read locks.
- **Advanced concurrency control**.
- **Stored procedures** with multiple language support (PL/pgSQL, PL/Python, PL/Perl, etc.).
- **Full-text search**, GIS extensions (PostGIS), and materialized views.
- Supports **replication**, **partitioning**, and **sharding**.

## Data Types

- **Numeric**: SMALLINT, INTEGER, BIGINT, DECIMAL, NUMERIC, REAL, DOUBLE PRECISION.
- **Character**: CHAR, VARCHAR, TEXT.
- **Date/Time**: DATE, TIME, TIMESTAMP, INTERVAL.
- **Boolean**.
- **Array**: Supports one-dimensional and multi-dimensional arrays.
- **JSON / JSONB**: Native support for JSON data.
- **UUID**, **XML**, **HSTORE** (key-value pairs).

## Common SQL Syntax

### Create Database

```sql
CREATE DATABASE mydb;
```

### Create Table

```sql
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    salary NUMERIC(10, 2),
    hire_date DATE
);
```

### Insert Data

```sql
INSERT INTO employees (name, salary, hire_date)
VALUES ('John Doe', 55000, '2024-05-01');
```

### Select Data

```sql
SELECT name, salary FROM employees WHERE salary > 50000;
```

## Indexing

```sql
CREATE INDEX idx_salary ON employees (salary);
```

PostgreSQL supports **expression indexes**, **partial indexes**, and **covering indexes** (INCLUDE).

## Transactions

```sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
```

Use `ROLLBACK;` to cancel a transaction.

## Views and Materialized Views

```sql
-- Simple view
CREATE VIEW high_salary AS
SELECT name, salary FROM employees WHERE salary > 100000;

-- Materialized view
CREATE MATERIALIZED VIEW emp_summary AS
SELECT department, AVG(salary) FROM employees GROUP BY department;
```

## JSON/JSONB Operations

```sql
-- Store JSON data
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_data JSONB
);

-- Query JSONB
SELECT order_data->>'customer' FROM orders WHERE id = 1;
```

## Stored Procedures and Functions

### Function Example

```sql
CREATE FUNCTION get_salary(emp_id INT) RETURNS NUMERIC AS $$
BEGIN
    RETURN (SELECT salary FROM employees WHERE id = emp_id);
END;
$$ LANGUAGE plpgsql;
```

### Procedure Example

```sql
CREATE PROCEDURE update_salary(emp_id INT, increment NUMERIC)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE employees SET salary = salary + increment WHERE id = emp_id;
END;
$$;
```

## Partitioning

PostgreSQL supports **table partitioning** for scalability:

```sql
CREATE TABLE measurements (
    city_id INT,
    log_date DATE,
    peaktemp INT,
    unitsales INT
) PARTITION BY RANGE (log_date);
```

## Concurrency and MVCC

PostgreSQL uses **Multi-Version Concurrency Control (MVCC)** to allow concurrent reads and writes without blocking, improving performance in highly concurrent environments.

## Replication

- **Streaming replication** for high availability.
- Supports **logical replication** for selective table replication.
- Supports **synchronous** and **asynchronous** replication.

## Extensions

PostgreSQL can be extended easily:

- **PostGIS**: Spatial database extension.
- **pg_stat_statements**: Query performance tracking.
- **uuid-ossp**: UUID generation.

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

## Security

- Role-based access control.
- Row-level security (RLS).
- TLS/SSL support for encrypted connections.

```sql
-- Create role and grant privileges
CREATE ROLE analyst LOGIN PASSWORD 'securepassword';
GRANT SELECT ON employees TO analyst;
```

## ACID Compliance

- **Atomicity**: Ensures all operations in a transaction are completed.
- **Consistency**: Guarantees data integrity constraints.
- **Isolation**: Uses MVCC to isolate transactions.
- **Durability**: Transactions are permanently recorded.

## PostgreSQL vs Other RDBMS

| Feature       | PostgreSQL  | MySQL       | Oracle     |
| ------------- | ----------- | ----------- | ---------- |
| Licensing     | Open Source | Open Source | Commercial |
| ACID Support  | Full        | InnoDB Only | Full       |
| JSON Support  | Advanced    | Yes         | Yes        |
| Concurrency   | MVCC        | MVCC        | MVCC       |
| Partitioning  | Advanced    | Basic       | Advanced   |
| Extensibility | High        | Moderate    | Moderate   |

## Use Cases

- Web and mobile applications.
- Analytical workloads.
- GIS and spatial applications (PostGIS).
- JSON document storage and querying.
- Applications requiring complex queries and data types.

## Advantages

- Open source with enterprise-grade features.
- Extensible and customizable.
- Excellent concurrency and performance.
- Active community and robust documentation.

## Limitations

- Vertical scaling required for extremely large datasets without sharding.
- Write-heavy workloads can require tuning.
