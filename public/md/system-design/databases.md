# Database Design and Management

## Relational Database Design

### Entity-Relationship Modeling

#### Entities and Attributes

- **Entity**: Real-world object or concept (User, Order, Product)
- **Attributes**: Properties of entities (UserID, Name, Email)
- **Primary Key**: Unique identifier for each entity instance
- **Foreign Key**: References primary key of another entity

#### Relationships

- **One-to-One**: Each entity instance relates to exactly one instance of another
- **One-to-Many**: One entity instance relates to multiple instances of another
- **Many-to-Many**: Multiple instances relate to multiple instances (requires junction table)

#### ER Diagram Symbols

```
[Entity] - Rectangle
(Attribute) - Oval
{Relationship} - Diamond
Primary Key - Underlined attribute
Foreign Key - Dashed underline
```

### Normalization

#### First Normal Form (1NF)

- **Atomic Values**: Each column contains indivisible values
- **No Repeating Groups**: No arrays or lists in columns
- **Unique Rows**: Each row is unique (has primary key)

**Example Violation:**

```sql
CREATE TABLE students (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    courses VARCHAR(200)  -- "Math,Science,History" - NOT 1NF
);
```

**1NF Compliant:**

```sql
CREATE TABLE students (
    id INT PRIMARY KEY,
    name VARCHAR(100)
);

CREATE TABLE student_courses (
    student_id INT,
    course VARCHAR(50),
    FOREIGN KEY (student_id) REFERENCES students(id)
);
```

#### Second Normal Form (2NF)

- Must be in 1NF
- **No Partial Dependencies**: Non-key attributes depend on entire primary key
- Applies only to tables with composite primary keys

**Example Violation:**

```sql
CREATE TABLE order_items (
    order_id INT,
    product_id INT,
    quantity INT,
    product_name VARCHAR(100),  -- Depends only on product_id
    PRIMARY KEY (order_id, product_id)
);
```

**2NF Compliant:**

```sql
CREATE TABLE order_items (
    order_id INT,
    product_id INT,
    quantity INT,
    PRIMARY KEY (order_id, product_id)
);

CREATE TABLE products (
    product_id INT PRIMARY KEY,
    product_name VARCHAR(100)
);
```

#### Third Normal Form (3NF)

- Must be in 2NF
- **No Transitive Dependencies**: Non-key attributes don't depend on other non-key attributes

**Example Violation:**

```sql
CREATE TABLE employees (
    emp_id INT PRIMARY KEY,
    name VARCHAR(100),
    dept_id INT,
    dept_name VARCHAR(50)  -- Depends on dept_id, not emp_id
);
```

**3NF Compliant:**

```sql
CREATE TABLE employees (
    emp_id INT PRIMARY KEY,
    name VARCHAR(100),
    dept_id INT,
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
);

CREATE TABLE departments (
    dept_id INT PRIMARY KEY,
    dept_name VARCHAR(50)
);
```

#### Boyce-Codd Normal Form (BCNF)

- Stricter version of 3NF
- Every determinant must be a candidate key
- Eliminates all redundancy based on functional dependencies

### Denormalization

#### When to Denormalize

- **Read-Heavy Workloads**: When read performance is critical
- **Complex Joins**: When normalized queries are too expensive
- **Reporting Requirements**: When aggregated data is frequently needed
- **Caching Strategy**: When calculated values are stored for performance

#### Denormalization Techniques

- **Storing Derived Data**: Calculated columns (total_amount, full_name)
- **Duplicating Data**: Storing foreign key data locally
- **Materialized Views**: Pre-computed query results
- **Redundant Relationships**: Direct relationships that bypass intermediate tables

#### Trade-offs

- **Benefits**: Improved read performance, simplified queries
- **Costs**: Increased storage, data inconsistency risk, complex updates

## Database Types and Selection

### Relational Databases (RDBMS)

#### Characteristics

- **ACID Properties**: Atomicity, Consistency, Isolation, Durability
- **Structured Data**: Fixed schema with defined relationships
- **SQL Interface**: Standardized query language
- **Mature Ecosystem**: Extensive tooling and expertise

#### Popular RDBMS

- **PostgreSQL**: Full-featured, extensible, strong consistency
- **MySQL**: Fast, reliable, wide adoption
- **Oracle**: Enterprise features, high performance
- **SQL Server**: Microsoft ecosystem integration

#### Use Cases

- **Financial Systems**: Transactions requiring strong consistency
- **ERP Systems**: Complex business logic and relationships
- **User Management**: Authentication and authorization systems
- **Inventory Management**: Product catalogs with relationships

### NoSQL Databases

#### Document Databases

**Characteristics:**

- Store data as documents (JSON, BSON)
- Flexible schema
- Nested data structures
- Horizontal scaling

**Examples:** MongoDB, CouchDB, Amazon DocumentDB

**Use Cases:**

- Content management systems
- Product catalogs with varying attributes
- User profiles and preferences
- Real-time analytics

**Example Document:**

```json
{
  "_id": "user123",
  "name": "John Doe",
  "email": "john@example.com",
  "addresses": [
    {
      "type": "home",
      "street": "123 Main St",
      "city": "Anytown",
      "country": "USA"
    }
  ],
  "preferences": {
    "newsletter": true,
    "theme": "dark"
  }
}
```

#### Key-Value Stores

**Characteristics:**

- Simple key-value pairs
- High performance and scalability
- Limited query capabilities
- Eventual consistency

**Examples:** Redis, Amazon DynamoDB, Riak

**Use Cases:**

- Session storage
- Caching layer
- Shopping carts
- User preferences
- Configuration data

#### Column-Family Databases

**Characteristics:**

- Data stored in column families
- Optimized for write-heavy workloads
- Distributed architecture
- Flexible schema within column families

**Examples:** Cassandra, HBase, Amazon SimpleDB

**Use Cases:**

- Time-series data
- IoT sensor data
- Logging and analytics
- Recommendation engines

**Example Schema:**

```
User Column Family:
- Row Key: user_id
- Columns: name, email, created_at, last_login

UserActivity Column Family:
- Row Key: user_id
- Columns: activity_timestamp:activity_type
```

#### Graph Databases

**Characteristics:**

- Nodes and relationships as first-class citizens
- Optimized for traversing relationships
- ACID properties
- Complex relationship queries

**Examples:** Neo4j, Amazon Neptune, ArangoDB

**Use Cases:**

- Social networks
- Recommendation systems
- Fraud detection
- Knowledge graphs
- Network analysis

### Database Selection Criteria

#### Data Structure

- **Structured**: Relational databases
- **Semi-structured**: Document databases
- **Unstructured**: Object stores
- **Highly connected**: Graph databases

#### Scalability Requirements

- **Vertical Scaling**: Traditional RDBMS
- **Horizontal Scaling**: NoSQL databases
- **Read Replicas**: Master-slave architectures
- **Sharding**: Distributed data across nodes

#### Consistency Requirements

- **Strong Consistency**: RDBMS, some NoSQL
- **Eventual Consistency**: Most NoSQL systems
- **Tunable Consistency**: Cassandra, DynamoDB

#### Query Complexity

- **Complex Joins**: SQL databases
- **Simple Lookups**: Key-value stores
- **Full-text Search**: Elasticsearch, Solr
- **Graph Traversal**: Graph databases

## Database Scaling Strategies

### Vertical Scaling (Scale Up)

- **CPU**: More processing power
- **Memory**: Increased RAM for caching
- **Storage**: Faster disks (SSD vs HDD)
- **Network**: Higher bandwidth connections

**Limitations:**

- Hardware limits
- Single point of failure
- Cost increases exponentially
- Downtime for upgrades

### Horizontal Scaling (Scale Out)

#### Read Replicas

**Master-Slave Replication:**

- Master handles writes
- Slaves handle reads
- Asynchronous replication
- Read scalability

**Master-Master Replication:**

- Multiple write nodes
- Conflict resolution required
- Active-active setup
- Geographic distribution

#### Database Sharding

**Horizontal Partitioning:**

- Split data across multiple databases
- Each shard contains subset of data
- Application-level routing
- Independent scaling

**Sharding Strategies:**

1. **Range-based**: Partition by value ranges
2. **Hash-based**: Use hash function on partition key
3. **Directory-based**: Lookup service for shard location
4. **Geographic**: Partition by location

**Sharding Challenges:**

- Cross-shard queries
- Rebalancing data
- Hotspot management
- Transaction complexity

### Caching Strategies

#### Cache Patterns

**Cache-Aside (Lazy Loading):**

```python
def get_user(user_id):
    # Try cache first
    user = cache.get(f"user:{user_id}")
    if user is None:
        # Cache miss - fetch from database
        user = database.get_user(user_id)
        # Store in cache
        cache.set(f"user:{user_id}", user, ttl=3600)
    return user
```

**Write-Through:**

```python
def update_user(user_id, data):
    # Update database
    database.update_user(user_id, data)
    # Update cache
    cache.set(f"user:{user_id}", data, ttl=3600)
```

**Write-Behind (Write-Back):**

```python
def update_user(user_id, data):
    # Update cache immediately
    cache.set(f"user:{user_id}", data, ttl=3600)
    # Asynchronously update database
    queue.enqueue('update_database', user_id, data)
```

#### Cache Levels

1. **Browser Cache**: Client-side caching
2. **CDN**: Geographic content distribution
3. **Reverse Proxy**: Nginx, Varnish
4. **Application Cache**: Redis, Memcached
5. **Database Cache**: Query result caching

#### Cache Invalidation

**TTL (Time To Live):**

- Automatic expiration
- Simple but may serve stale data
- Good for data that changes predictably

**Event-based Invalidation:**

- Invalidate on data changes
- More complex but ensures freshness
- Requires careful coordination

**Cache Tags:**

- Group related cache entries
- Invalidate by tag when related data changes
- Useful for complex dependencies

## Advanced Database Concepts

### ACID Properties

#### Atomicity

- **All or Nothing**: Transactions complete fully or not at all
- **Rollback**: Failed transactions leave no partial changes
- **Implementation**: Transaction logs, write-ahead logging

#### Consistency

- **Data Integrity**: Database rules and constraints are maintained
- **Referential Integrity**: Foreign key constraints enforced
- **Business Rules**: Custom constraints and triggers

#### Isolation

- **Concurrent Transactions**: Multiple transactions don't interfere
- **Isolation Levels**: Read uncommitted, read committed, repeatable read, serializable
- **Locking**: Pessimistic and optimistic concurrency control

#### Durability

- **Persistence**: Committed changes survive system failures
- **Write-Ahead Logging**: Changes logged before being applied
- **Backup and Recovery**: Point-in-time recovery capabilities

### CAP Theorem

#### Consistency

- All nodes see the same data simultaneously
- Strong consistency requires coordination
- May impact availability during partitions

#### Availability

- System remains operational
- Can respond to requests even during failures
- May serve stale data during partitions

#### Partition Tolerance

- System continues despite network failures
- Essential for distributed systems
- Must choose between consistency and availability during partitions

#### Practical Implications

- **CA Systems**: Traditional single-node databases
- **CP Systems**: MongoDB (default), HBase, Redis Cluster
- **AP Systems**: Cassandra, CouchDB, DynamoDB (eventually consistent)

### BASE Properties

#### Basically Available

- System remains available most of the time
- May have reduced functionality during failures
- Graceful degradation preferred over complete failure

#### Soft State

- Data may change over time due to consistency requirements
- No guarantee of immediate consistency
- Eventually consistent systems

#### Eventually Consistent

- System will become consistent over time
- No guarantees about when consistency is achieved
- Conflicts resolved through versioning or timestamps

## Database Performance Optimization

### Indexing Strategies

#### B-Tree Indexes

- **Structure**: Balanced tree structure
- **Use Cases**: Range queries, sorting, equality
- **Performance**: O(log n) for searches
- **Maintenance**: Automatically balanced

```sql
-- Single column index
CREATE INDEX idx_user_email ON users(email);

-- Composite index
CREATE INDEX idx_user_status_created ON users(status, created_at);

-- Partial index
CREATE INDEX idx_active_users ON users(email) WHERE status = 'active';
```

#### Hash Indexes

- **Structure**: Hash table
- **Use Cases**: Equality lookups only
- **Performance**: O(1) for exact matches
- **Limitations**: No range queries

#### Bitmap Indexes

- **Structure**: Bit arrays for each distinct value
- **Use Cases**: Low cardinality columns
- **Benefits**: Very compact, fast aggregations
- **Limitations**: High update overhead

### Query Optimization

#### Execution Plans

```sql
-- PostgreSQL
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'user@example.com';

-- MySQL
EXPLAIN FORMAT=JSON SELECT * FROM users WHERE email = 'user@example.com';
```

#### Query Optimization Techniques

1. **Use Indexes**: Ensure queries can use existing indexes
2. **Limit Results**: Use LIMIT to reduce data transfer
3. **Select Specific Columns**: Avoid SELECT \*
4. **Optimize JOINs**: Use appropriate join types and order
5. **Subquery Optimization**: Consider JOIN alternatives

#### Common Anti-patterns

- **N+1 Queries**: Multiple queries in loops
- **Missing Indexes**: Full table scans on large tables
- **Unnecessary JOINs**: Fetching unused related data
- **Large IN Clauses**: Use EXISTS or temporary tables instead

### Connection Management

#### Connection Pooling

```python
# Python example with SQLAlchemy
from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool

engine = create_engine(
    'postgresql://user:password@localhost/dbname',
    poolclass=QueuePool,
    pool_size=20,
    max_overflow=30,
    pool_pre_ping=True,
    pool_recycle=3600
)
```

#### Connection Pool Configuration

- **Pool Size**: Number of persistent connections
- **Max Overflow**: Additional connections when pool is full
- **Pool Timeout**: Wait time for available connection
- **Connection Lifetime**: Recycle connections periodically

## Database Security

### Access Control

#### Authentication Methods

- **Password-based**: Traditional username/password
- **Certificate-based**: Client certificates for authentication
- **Kerberos**: Integrated with Active Directory
- **LDAP**: Centralized user management

#### Authorization Levels

```sql
-- User management
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'secure_password';

-- Grant specific privileges
GRANT SELECT, INSERT, UPDATE ON app_db.users TO 'app_user'@'localhost';

-- Role-based access
CREATE ROLE 'read_only';
GRANT SELECT ON app_db.* TO 'read_only';
GRANT 'read_only' TO 'report_user'@'localhost';
```

### Data Protection

#### Encryption at Rest

- **Transparent Data Encryption (TDE)**: Automatic encryption
- **Column-level Encryption**: Specific sensitive columns
- **Tablespace Encryption**: Encrypt specific storage areas
- **Key Management**: Secure key storage and rotation

#### Encryption in Transit

- **SSL/TLS**: Encrypt client-server communication
- **Certificate Validation**: Verify server identity
- **Connection String**: Configure encrypted connections

```python
# Python connection with SSL
import psycopg2

conn = psycopg2.connect(
    host="localhost",
    database="mydb",
    user="user",
    password="password",
    sslmode="require",
    sslcert="client-cert.pem",
    sslkey="client-key.pem",
    sslrootcert="ca-cert.pem"
)
```

#### Data Masking and Anonymization

- **Dynamic Data Masking**: Runtime data obscuring
- **Static Data Masking**: Permanent test data anonymization
- **Tokenization**: Replace sensitive data with tokens
- **Format Preserving Encryption**: Maintain data format

## Database Monitoring and Maintenance

### Performance Monitoring

#### Key Metrics

- **Query Performance**: Execution time, frequency
- **Resource Utilization**: CPU, memory, disk I/O
- **Connection Statistics**: Active connections, pool usage
- **Lock Contention**: Blocking queries, deadlocks
- **Replication Lag**: Delay between master and slaves

#### Monitoring Tools

- **Built-in Tools**: pg_stat_statements (PostgreSQL), Performance Schema (MySQL)
- **Third-party Tools**: DataDog, New Relic, Prometheus
- **Log Analysis**: Slow query logs, error logs

### Backup and Recovery

#### Backup Types

**Full Backup:**

- Complete database snapshot
- Longest backup time
- Fastest recovery
- Baseline for incremental backups

**Incremental Backup:**

- Only changed data since last backup
- Faster backup process
- Longer recovery time
- Requires backup chain

**Transaction Log Backup:**

- Continuous backup of transaction logs
- Point-in-time recovery
- Minimal data loss
- Essential for production systems

#### Recovery Strategies

**Point-in-Time Recovery (PITR):**

```bash
# PostgreSQL example
pg_basebackup -D /backup/base -Ft -z -P -U postgres
# Restore to specific timestamp
pg_ctl stop -D /data
rm -rf /data/*
tar -xzf /backup/base/base.tar.gz -C /data
# Configure recovery.conf for PITR
```

#### Disaster Recovery

- **RTO (Recovery Time Objective)**: Maximum acceptable downtime
- **RPO (Recovery Point Objective)**: Maximum acceptable data loss
- **Geographic Replication**: Cross-region backup storage
- **Automated Testing**: Regular recovery procedure validation

### Database Maintenance

#### Regular Maintenance Tasks

```sql
-- PostgreSQL vacuum and analyze
VACUUM ANALYZE users;

-- MySQL optimize table
OPTIMIZE TABLE users;

-- Update statistics
ANALYZE TABLE users;

-- Check table integrity
CHECK TABLE users;
```

#### Index Maintenance

- **Rebuild Fragmented Indexes**: Improve performance
- **Drop Unused Indexes**: Save storage and update overhead
- **Monitor Index Usage**: Identify missing or redundant indexes
- **Partitioned Index Maintenance**: Handle partition-specific indexes

#### Capacity Planning

- **Growth Projections**: Estimate future storage needs
- **Performance Trends**: Identify degradation patterns
- **Resource Planning**: Scale infrastructure proactively
- **Archive Strategy**: Move old data to cheaper storage

## Database Best Practices

### Schema Design

- **Consistent Naming**: Use clear, consistent naming conventions
- **Appropriate Data Types**: Choose optimal types for storage and performance
- **Constraint Usage**: Implement business rules at database level
- **Documentation**: Document schema design and business rules

### Application Integration

- **Connection Pooling**: Reuse database connections efficiently
- **Prepared Statements**: Prevent SQL injection and improve performance
- **Transaction Management**: Keep transactions short and focused
- **Error Handling**: Handle database errors gracefully

### Security Practices

- **Principle of Least Privilege**: Grant minimum necessary permissions
- **Regular Updates**: Keep database software current
- **Audit Logging**: Track sensitive data access
- **Penetration Testing**: Regular security assessments

### Operational Excellence

- **Monitoring and Alerting**: Proactive issue detection
- **Automated Backups**: Regular, tested backup procedures
- **Documentation**: Maintain operational runbooks
- **Disaster Recovery**: Tested recovery procedures
