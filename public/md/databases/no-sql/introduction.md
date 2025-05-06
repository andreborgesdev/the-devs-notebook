# NoSQL

**NoSQL** (Not Only SQL) databases provide a flexible alternative to traditional relational databases (RDBMS) for handling a wide variety of data models. They are designed to excel in scalability, availability, and performance, especially for big data and real-time web applications.

## Key Characteristics

- **Schema-less** or dynamic schemas.
- Supports **horizontal scaling** (easy to distribute data across many servers).
- Designed for **high availability** and **fault tolerance**.
- Often prioritize **eventual consistency** over strong consistency.
- Optimized for **read/write performance**.
- Better suited for **unstructured** and **semi-structured** data.

## Categories of NoSQL Databases

### 1. **Key-Value Stores**

- **Model**: Simple key-value pairs.
- **Use case**: Caching, session management, simple data retrieval.
- **Examples**: Redis, Amazon DynamoDB, Riak.

```json
{
  "user:123": {
    "name": "Alice",
    "email": "alice@example.com"
  }
}
```

### 2. **Document Stores**

- **Model**: Documents typically stored in JSON, BSON, or XML format.
- **Use case**: Content management, catalogs, event logging.
- **Examples**: MongoDB, CouchDB, Amazon DocumentDB.

```json
{
  "user_id": "123",
  "name": "Alice",
  "email": "alice@example.com",
  "purchases": ["book", "pen"]
}
```

### 3. **Column-Family Stores**

- **Model**: Columns grouped into families (wide-column stores).
- **Use case**: Time-series data, recommendation engines, large-scale data warehouses.
- **Examples**: Apache Cassandra, HBase, ScyllaDB.

```plaintext
Row Key | Name | Email            | Purchases
--------|------|------------------|-------------------
user:123|Alice |alice@example.com |book, pen
```

### 4. **Graph Databases**

- **Model**: Nodes and relationships (edges).
- **Use case**: Social networks, fraud detection, recommendation systems.
- **Examples**: Neo4j, Amazon Neptune, ArangoDB.

```plaintext
(Alice) -[FRIEND]-> (Bob)
```

## ACID vs BASE

| Property             | ACID (SQL) | BASE (NoSQL) |
| -------------------- | ---------- | ------------ |
| Atomicity            | Yes        | No           |
| Consistency          | Yes        | Eventual     |
| Isolation            | Yes        | No           |
| Durability           | Yes        | Best-effort  |
| Basic Availability   | No         | Yes          |
| Soft State           | No         | Yes          |
| Eventual Consistency | No         | Yes          |

- **ACID**: Guarantees data validity even in the event of errors, power failures, etc.
- **BASE**: Prioritizes availability and scalability over immediate consistency.

## CAP Theorem and NoSQL

According to the **CAP Theorem**, distributed systems can only provide two out of three guarantees:

- **Consistency (C)**
- **Availability (A)**
- **Partition tolerance (P)**

Most NoSQL systems choose **AP** or **CP**, depending on use cases.

## Use Cases for NoSQL

- **Real-time analytics** (e.g., logs, events).
- **Social media data** storage.
- **E-commerce catalogs**.
- **IoT data ingestion**.
- **Content management systems**.
- **Personalization engines**.

## Advantages

- **Scalability**: Easily add nodes without downtime.
- **Flexibility**: Store different data formats without changing schema.
- **Performance**: Optimized for high-speed read and write operations.
- **High availability**: Designed to work across multiple servers and data centers.

## Limitations

- **Eventual consistency** may not be suitable for all applications.
- **Complex transactions** across multiple data items are difficult.
- **Less mature tooling** compared to relational databases.
- Query languages can vary widely between systems.

## Popular NoSQL Databases Comparison

| Database  | Type               | Strengths                                |
| --------- | ------------------ | ---------------------------------------- |
| MongoDB   | Document           | Flexible schema, powerful query language |
| Redis     | Key-Value          | Fast in-memory operations, caching       |
| Cassandra | Column-Family      | High availability, scalability           |
| Neo4j     | Graph              | Efficient relationship queries           |
| DynamoDB  | Key-Value/Document | Managed service, scalability             |

## When to Use NoSQL

- When your application demands **horizontal scaling**.
- When dealing with **large volumes of varied data**.
- When **flexibility** is important (changing schema).
- When the workload is **read/write-heavy**.
- When **high availability** is a requirement.

## When to Prefer SQL

- When **ACID transactions** are critical.
- When dealing with **structured data** and complex relationships.
- When **strong consistency** is required.
- When using **standardized query languages (SQL)**.
