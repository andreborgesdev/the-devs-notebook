# Databases

## Importance in System Design

Databases are a critical component of system design. In large-scale applications, they are often the primary performance bottleneck because application servers are stateless and horizontally scalable, while all stateful data resides in the database. Most applications are read-heavy (95%+ reads), emphasizing the importance of optimizing read performance.

**Key Challenge**: Distributed databases introduce complexities like **eventual consistency** and **data integrity maintenance across nodes**.

## Basic Scaling Techniques

- **Indexes**

  - Improve read performance by indexing specific columns.
  - Increase storage requirements and slightly slow down writes and updates.

- **Denormalization**

  - Introduces redundant data to minimize joins.
  - Speeds up reads but slows writes and increases risk of data inconsistency.

- **Connection Pooling**

  - Reuses database connections across multiple application threads, reducing overhead.

- **Caching**

  - Offloads frequent read operations from the database.
  - Less effective for dynamic or frequently updated data.

- **Vertical Scaling**

  - Involves upgrading hardware resources (CPU, RAM, storage).

- **Materialized Views**

  - Precomputed query results stored for fast read access, at the expense of additional storage and update complexity.

## Replication and Partitioning

### Read Replicas

- **Master** handles writes.
- **Replicas** handle reads.
- Must ensure data propagation from master to replicas (eventual consistency or synchronous replication).

### Sharding (Horizontal Partitioning)

- Splits data across multiple databases.
- Queries target specific shards, improving read/write performance.
- Challenges:

  - **Hot keys** can cause load imbalance.
  - Joins across shards are expensive.
  - Fixed number of shards can limit scalability unless resharding is implemented.

### Vertical Partitioning

- Splits tables by functionality.
- Reduces the amount of unnecessary data retrieved in common queries.
- Often used in combination with horizontal partitioning.

## Advanced Partitioning Concepts

- **Consistent Hashing**

  - Minimizes data movement when adding or removing nodes/shards.
  - Common in NoSQL databases like Cassandra and DynamoDB.

- **Geo-Partitioning**

  - Distributes data based on geographic location to minimize latency.

## SQL vs NoSQL

| Feature         | SQL                                | NoSQL                                 |
| --------------- | ---------------------------------- | ------------------------------------- |
| Data structure  | Structured (tables, columns, rows) | Flexible (documents, key-value, etc.) |
| Relationships   | Strong support                     | Limited or none                       |
| ACID compliance | Full                               | Often traded for scalability          |
| Scalability     | Harder to scale horizontally       | Easy horizontal scaling               |
| Consistency     | Strong consistency                 | Eventual consistency                  |

**Trade-off**: SQL sacrifices scalability for strong consistency and relational capabilities.

## CAP Theorem

In distributed databases, only two of the following three can be fully achieved:

- **Consistency (C)**: All nodes see the same data at the same time.
- **Availability (A)**: Every request receives a (non-error) response.
- **Partition Tolerance (P)**: System continues functioning despite network partitions.

**Note**: Most modern distributed databases prioritize **partition tolerance** and trade-off between consistency and availability based on application needs.

## ACID vs BASE

- **ACID (Atomicity, Consistency, Isolation, Durability)**

  - Guarantees reliable transactions.
  - Used by traditional relational databases.

- **BASE (Basically Available, Soft state, Eventual consistency)**

  - Focuses on availability and scalability.
  - Used by many NoSQL systems.

## Best Practices for Database Indexing

1. Design indexes based on workload, not just table structure.
2. Build indexes for query predicates.
3. Focus on the most heavily used queries.
4. Support sorting operations (`GROUP BY`, `ORDER BY`) with indexes.
5. Create unique indexes for primary and foreign keys.
6. Consider covering indexes for index-only access.
7. Balance the number of indexes with write performance.
8. Monitor the impact of data modifications on index performance.

## Query Optimization

- Use **EXPLAIN** or **EXPLAIN ANALYZE** to understand query execution plans.
- Optimize joins and avoid **N+1 query problems**.
- Minimize use of \*\*SELECT \*\*\* in queries.
- Avoid unnecessary subqueries when possible.

## Caching Strategies

- **Write-Through Cache**: Writes go to cache and database simultaneously.
- **Write-Around Cache**: Writes go directly to the database, bypassing the cache.
- **Write-Back Cache**: Writes go to cache first and later to the database (higher risk of data loss).

**Cache Invalidation** is one of the hardest problems in distributed system design — requires careful strategy.

## Transaction Isolation Levels

| Level            | Dirty Read   | Non-repeatable Read | Phantom Read |
| ---------------- | ------------ | ------------------- | ------------ |
| Read Uncommitted | Possible     | Possible            | Possible     |
| Read Committed   | Not Possible | Possible            | Possible     |
| Repeatable Read  | Not Possible | Not Possible        | Possible     |
| Serializable     | Not Possible | Not Possible        | Not Possible |

## NoSQL Categories

- **Key-Value Stores** (Redis, DynamoDB)
- **Document Stores** (MongoDB, CouchDB)
- **Column-Family Stores** (Cassandra, HBase)
- **Graph Databases** (Neo4j, Amazon Neptune)

## Additional Considerations

- **Eventual Consistency**: Acceptable for data that can tolerate slight delays in consistency.
- **Hot Keys**: Avoid concentration of read/write operations on a small set of keys.
- **Materialized Views**: Precomputed query results that improve read performance.
- **Data Modeling**: Align schema design with the most common access patterns.
- **Latency**: Critical for user-facing applications — optimize data locality and indexing.

## Recommended Reading

- [SQL vs NoSQL](https://blog.tryexponent.com/sql-vs-nosql)
- [CAP Theorem](https://blog.tryexponent.com/cap-theorem)
- [Top 10 Steps to Building Useful Database Indexes](https://www.dbta.com/Columns/DBA-Corner/Top-10-Steps-to-Building-Useful-Database-Indexes-100498.aspx)
