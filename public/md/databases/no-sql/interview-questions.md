# NoSQL Interview Questions

### What is NoSQL?

NoSQL refers to a broad category of database management systems that do not use the traditional relational model. It stands for **"Not Only SQL"** and is designed to handle large volumes of unstructured, semi-structured, or structured data.

---

### What are the main types of NoSQL databases?

1. **Document-based** (e.g., MongoDB, CouchDB)
2. **Key-Value stores** (e.g., Redis, DynamoDB)
3. **Column-family stores** (e.g., Cassandra, HBase)
4. **Graph databases** (e.g., Neo4j, Amazon Neptune)

---

### When should you choose NoSQL over SQL?

- Handling **large volumes** of unstructured or semi-structured data.
- Need for **horizontal scalability**.
- Requirements for **high availability** and **low latency**.
- **Dynamic schemas** or frequent changes in data structure.

---

### What is eventual consistency?

Eventual consistency is a consistency model used by many NoSQL databases where updates to a database will propagate eventually, but immediate consistency is not guaranteed.

---

### What is the CAP theorem?

The **CAP theorem** states that a distributed database system can provide only two out of the following three guarantees:

- **Consistency**
- **Availability**
- **Partition Tolerance**

NoSQL databases often sacrifice consistency for availability and partition tolerance (AP).

---

### What is sharding?

Sharding is a method for distributing data across multiple machines to improve scalability and performance.

---

### What is denormalization and why is it common in NoSQL?

Denormalization involves combining data into fewer tables or documents to reduce the need for joins, improving query performance. NoSQL databases often use denormalization for scalability and speed.

---

### Explain the difference between MongoDB and Redis.

- **MongoDB**: A document-oriented database storing data in flexible JSON-like documents.
- **Redis**: An in-memory key-value store known for high performance and used for caching, real-time analytics, and messaging.

---

### What is a replica set in MongoDB?

A **replica set** is a group of MongoDB servers that maintain the same data set, providing redundancy and high availability.

---

### How does indexing work in NoSQL databases?

Indexes improve the speed of data retrieval operations by allowing the database to quickly locate the desired data without scanning the entire dataset.

---

### What is the difference between horizontal and vertical scaling?

- **Horizontal Scaling**: Adding more machines/nodes.
- **Vertical Scaling**: Adding more resources (CPU, RAM) to the existing machine.

NoSQL databases generally favor **horizontal scaling**.

---

### What are some common use cases for NoSQL?

- Real-time big data analytics
- Content management
- Internet of Things (IoT) applications
- Social networks
- E-commerce and personalization engines
- Caching solutions

---

### What is a graph database and where is it used?

A graph database uses graph structures for storing data along with nodes, edges, and properties. It is ideal for:

- Social networks
- Fraud detection
- Network and IT operations

---

### Can NoSQL databases handle ACID transactions?

Some NoSQL databases (like MongoDB 4.0+, Redis with transactions) provide **ACID compliance** to a certain degree, but many favor availability and scalability over strict consistency.

---

### What is BASE property in NoSQL?

- **Basically Available**: The system guarantees availability.
- **Soft state**: The state of the system can change over time.
- **Eventual consistency**: The system will eventually become consistent.

---

### What are some limitations of NoSQL?

- Lack of standardization across different NoSQL systems.
- Complex querying compared to SQL.
- Data consistency challenges.
- Potentially higher learning curve.

### Explain the trade-offs between Consistency, Availability, and Partition Tolerance in real-world NoSQL systems.

According to the **CAP theorem**, a distributed system can choose only two out of three properties:

- **CP** (Consistency + Partition tolerance): E.g., MongoDB in strong consistency mode.
- **AP** (Availability + Partition tolerance): E.g., Cassandra, DynamoDB.
  Most NoSQL databases prefer **Availability** and **Partition tolerance** for scalability and fault tolerance, accepting eventual consistency in some cases.

---

### What is tunable consistency?

Tunable consistency allows developers to configure the level of consistency per query or operation. For example, Cassandra lets you set the number of replicas that must acknowledge a read or write operation, offering flexibility between consistency and availability.

---

### How does Cassandra achieve high availability?

Cassandra uses:

- **Peer-to-peer architecture** with no single point of failure.
- **Data replication** across multiple nodes and data centers.
- **Gossip protocols** for node communication.
- Tunable consistency levels for balancing consistency and availability.

---

### What are secondary indexes in NoSQL, and when should you avoid them?

Secondary indexes allow querying on fields other than the primary key. However, they can:

- Introduce write overhead.
- Slow down write-heavy applications.
  In **high-volume write workloads**, it’s often better to denormalize data instead of relying heavily on secondary indexes.

---

### What are the limitations of MapReduce in NoSQL?

- **High latency**: MapReduce jobs are batch processes, unsuitable for real-time querying.
- **Complexity**: Requires writing and maintaining large amounts of code.
- **Not optimal for ad hoc queries**.

Modern NoSQL systems prefer real-time processing engines like **Apache Spark** or **Kafka Streams**.

---

### How do NoSQL databases handle schema evolution?

Most NoSQL databases offer **schema-less** or **dynamic schema** support, allowing changes to document structure without affecting existing data (e.g., adding new fields in MongoDB documents).

---

### What is the difference between strong consistency and eventual consistency?

- **Strong consistency**: Guarantees that once data is written, all subsequent reads return the latest value.
- **Eventual consistency**: Updates will eventually propagate, and reads may initially return stale data.

---

### How does data modeling differ in NoSQL compared to relational databases?

- **NoSQL** emphasizes **query-driven modeling**: design the schema based on how data will be retrieved.
- **RDBMS** follows **3rd Normal Form** for eliminating redundancy.
  NoSQL prefers **denormalization** to avoid expensive joins and improve performance.

---

### What are the advantages and disadvantages of using a wide-column store like Cassandra?

**Advantages:**

- Highly scalable for big data use cases.
- Excellent write performance.
- Supports dynamic columns.

**Disadvantages:**

- Requires careful data modeling.
- Secondary indexes and ad hoc querying are limited.

---

### What consistency model does DynamoDB use?

By default, DynamoDB provides **eventual consistency** for read operations but offers an option for **strongly consistent reads** at the cost of latency and throughput.

---

### Explain quorum in the context of NoSQL.

A **quorum** is the minimum number of nodes that must agree for a read/write operation to succeed. It’s typically calculated as:

```
Quorum = (Replication factor / 2) + 1
```

This ensures that at least one node in the quorum will have the latest data version, aiding consistency.

---

### What is the difference between partitioning and replication?

- **Partitioning (sharding)**: Splits data across multiple nodes for scalability.
- **Replication**: Copies the same data to multiple nodes for redundancy and availability.

Both techniques are commonly used together.

---

### How does MongoDB ensure data durability?

- **Write concerns**: Configure acknowledgment levels for write operations.
- **Journaling**: Logs write operations to disk before confirming to the client.
- **Replica sets**: Provide redundancy and failover.

---

### What is the difference between MongoDB’s replica set and sharded cluster?

- **Replica set**: Copies data across multiple nodes for high availability.
- **Sharded cluster**: Splits data across shards to handle larger datasets and support horizontal scaling.

You can combine both for distributed, fault-tolerant, and scalable deployments.

---

### Explain the difference between optimistic and pessimistic concurrency control in NoSQL.

- **Optimistic**: Assumes conflicts are rare. Transactions proceed without locking, validating changes before commit (e.g., using version numbers).
- **Pessimistic**: Locks data during transactions to prevent concurrent modifications.

NoSQL databases generally favor **optimistic concurrency control** for scalability.

---

### How does Redis achieve high performance?

- In-memory data storage.
- Single-threaded event loop with efficient I/O multiplexing.
- Data persistence options (RDB snapshots or AOF logs).
- Supports **pub/sub**, **Lua scripting**, and **atomic operations**.

---

### How does consistency differ between Couchbase and MongoDB?

- **MongoDB**: Offers **strong consistency** by default within replica sets.
- **Couchbase**: Provides **eventual consistency** by default but can be configured for stronger consistency with the "Durability" and "Consistency" settings.

---

### What is the role of compaction in NoSQL databases like Cassandra?

Compaction merges SSTables (Sorted String Tables) to:

- Reclaim disk space.
- Improve read performance.
- Remove deleted data (tombstones).

---

### What challenges can arise when using NoSQL databases in distributed systems?

- Managing **data consistency** and **replication lag**.
- **Network partitioning** and node failures.
- Complex **data modeling**.
- Lack of **standardized query languages**.
- Potential for **write amplification** and **hot spots**.
