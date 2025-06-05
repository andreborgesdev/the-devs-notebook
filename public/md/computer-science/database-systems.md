# Database Systems

## Overview

Database systems are software applications that store, organize, and manage data efficiently. They provide mechanisms for data storage, retrieval, update, and administration while ensuring data integrity, security, and concurrent access.

## Database Models

### Relational Model

- Tables with rows and columns
- Primary and foreign keys
- ACID properties
- SQL query language
- Examples: PostgreSQL, MySQL, Oracle

### NoSQL Models

#### Document Databases

- JSON-like documents
- Flexible schema
- Examples: MongoDB, CouchDB

#### Key-Value Stores

- Simple key-value pairs
- High performance
- Examples: Redis, DynamoDB

#### Column-Family

- Wide column stores
- Scalable for big data
- Examples: Cassandra, HBase

#### Graph Databases

- Nodes and edges
- Relationship-focused
- Examples: Neo4j, Amazon Neptune

## ACID Properties

### Atomicity

- All-or-nothing transactions
- Rollback on failure
- Consistent state guarantee

### Consistency

- Database constraints maintained
- Valid state transitions
- Referential integrity

### Isolation

- Concurrent transaction separation
- Isolation levels (Read Uncommitted, Read Committed, Repeatable Read, Serializable)
- Locking mechanisms

### Durability

- Persistent storage guarantee
- Write-ahead logging
- Recovery mechanisms

## SQL Fundamentals

### Data Definition Language (DDL)

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE users ADD COLUMN age INTEGER;
DROP TABLE old_table;
```

### Data Manipulation Language (DML)

```sql
INSERT INTO users (name, email) VALUES ('John Doe', 'john@email.com');
UPDATE users SET age = 25 WHERE id = 1;
DELETE FROM users WHERE age < 18;
```

### Data Query Language (DQL)

```sql
SELECT u.name, p.title
FROM users u
JOIN posts p ON u.id = p.user_id
WHERE u.age > 21
ORDER BY u.name
LIMIT 10;
```

### Advanced SQL Features

- Window functions
- Common Table Expressions (CTEs)
- Stored procedures and functions
- Triggers and views

## Database Design

### Entity-Relationship (ER) Modeling

- Entities and attributes
- Relationships and cardinality
- Weak entities and identifying relationships

### Normalization

- **1NF**: Atomic values, no repeating groups
- **2NF**: Remove partial dependencies
- **3NF**: Remove transitive dependencies
- **BCNF**: Stronger form of 3NF
- **4NF/5NF**: Multi-valued and join dependencies

### Denormalization

- Performance optimization
- Redundant data storage
- Trade-offs with consistency

## Indexing and Performance

### Index Types

- **B-tree**: Balanced tree structure, range queries
- **Hash**: Fast equality lookups
- **Bitmap**: Sparse data, analytical queries
- **Full-text**: Text search capabilities
- **Spatial**: Geographic data

### Query Optimization

- Query execution plans
- Cost-based optimization
- Statistics and cardinality estimation
- Join algorithms (nested loop, hash, merge)

### Performance Tuning

- Index selection and maintenance
- Query rewriting
- Partitioning strategies
- Connection pooling

## Concurrency Control

### Locking Mechanisms

- **Shared locks**: Multiple readers
- **Exclusive locks**: Single writer
- **Intention locks**: Hierarchical locking
- **Deadlock detection and prevention**

### Timestamp Ordering

- Transaction timestamps
- Read and write timestamps
- Thomas Write Rule

### Multiversion Concurrency Control (MVCC)

- Multiple data versions
- Snapshot isolation
- No read locks needed

## Recovery and Reliability

### Transaction Logging

- Write-ahead logging (WAL)
- Redo and undo logs
- Checkpointing

### Recovery Algorithms

- ARIES algorithm
- Immediate vs deferred updates
- Shadow paging

### Backup and Restore

- Full, incremental, differential backups
- Point-in-time recovery
- Hot vs cold backups

## Distributed Databases

### Distributed Architecture

- Data distribution strategies
- Horizontal vs vertical partitioning
- Replication schemes

### CAP Theorem

- **Consistency**: All nodes see same data
- **Availability**: System remains operational
- **Partition tolerance**: Continues despite network failures
- Choose any two of three

### Consensus Algorithms

- Raft consensus
- Paxos protocol
- Byzantine fault tolerance

### Eventual Consistency

- BASE properties (Basically Available, Soft state, Eventual consistency)
- Conflict resolution strategies
- Vector clocks

## Big Data Technologies

### MapReduce and Hadoop

- Distributed processing framework
- HDFS file system
- Batch processing paradigm

### Apache Spark

- In-memory computing
- RDDs and DataFrames
- Stream processing

### Data Warehousing

- OLAP vs OLTP
- Star and snowflake schemas
- ETL processes

## Modern Database Trends

### NewSQL Databases

- ACID compliance at scale
- Horizontal scalability
- Examples: CockroachDB, VoltDB

### Time-Series Databases

- Optimized for time-stamped data
- Examples: InfluxDB, TimescaleDB

### In-Memory Databases

- RAM-based storage
- Ultra-fast performance
- Examples: Redis, SAP HANA

### Serverless Databases

- Auto-scaling capabilities
- Pay-per-use pricing
- Examples: DynamoDB, FaunaDB

## Database Security

### Authentication and Authorization

- User management
- Role-based access control
- Principle of least privilege

### Data Encryption

- Encryption at rest
- Encryption in transit
- Key management

### SQL Injection Prevention

- Parameterized queries
- Input validation
- Stored procedures

### Auditing and Compliance

- Activity logging
- Regulatory requirements (GDPR, HIPAA)
- Data masking and anonymization

## Interview Topics

### Common Questions

- Explain ACID properties
- Compare SQL vs NoSQL
- Describe database normalization
- Discuss indexing strategies

### Design Questions

- Design a URL shortener database
- Schema for social media platform
- Chat application data model
- E-commerce system design

### Performance Questions

- Query optimization techniques
- Handling high concurrency
- Scaling strategies
- Caching approaches

## Best Practices

### Schema Design

- Understand access patterns
- Plan for scalability
- Use appropriate data types
- Consider future requirements

### Query Writing

- Use indexes effectively
- Avoid N+1 problems
- Minimize data transfer
- Use connection pooling

### Operations

- Regular backups
- Monitor performance metrics
- Capacity planning
- Security updates
