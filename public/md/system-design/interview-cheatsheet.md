# System Design Interview Cheatsheet

## Pre-Interview Preparation

### Essential Knowledge Areas

**System Design Fundamentals**

- Scalability patterns (horizontal vs vertical)
- Availability and reliability calculations
- CAP theorem and consistency models
- Performance metrics (latency, throughput, QPS)

**Data Storage Systems**

- SQL vs NoSQL trade-offs
- Database sharding and partitioning
- Replication strategies (master-slave, master-master)
- ACID properties and eventual consistency

**System Architecture Patterns**

- Microservices vs monolithic architecture
- Event-driven architecture and message queues
- Load balancing strategies
- Caching layers and CDN usage

**Infrastructure Components**

- Load balancers (Layer 4 vs Layer 7)
- API gateways and reverse proxies
- Container orchestration (Kubernetes basics)
- Cloud services overview (AWS/GCP/Azure)

## Interview Structure and Approach

### 1. Requirements Clarification (5-10 minutes)

**Functional Requirements Questions**

```
- What are the core features we need to support?
- Who are the main users and what are their use cases?
- What is the expected user interaction flow?
- Are there any specific business rules or constraints?
- What platforms need to be supported (web, mobile, API)?
```

**Non-Functional Requirements Questions**

```
- How many users do we expect (DAU/MAU)?
- What is the expected read/write ratio?
- What are the latency requirements (p95, p99)?
- What is the acceptable downtime (SLA requirements)?
- Are there any compliance or security requirements?
- What is the data retention period?
```

**Scale Estimation Template**

```python
# Example: Social Media Platform
daily_active_users = 100_000_000
posts_per_user_per_day = 2
reads_per_post = 100

# Write QPS
write_qps = (daily_active_users * posts_per_user_per_day) / (24 * 3600)
write_qps = 100M * 2 / 86400 = ~2,300 QPS

# Read QPS
read_qps = write_qps * reads_per_post = 2,300 * 100 = 230,000 QPS

# Storage estimation
post_size = 1KB  # average post size
daily_storage = daily_active_users * posts_per_user_per_day * post_size
yearly_storage = daily_storage * 365
```

### 2. High-Level Design (10-15 minutes)

**Component Identification Checklist**

- [ ] Client applications (web, mobile)
- [ ] Load balancers
- [ ] API gateway/reverse proxy
- [ ] Application servers
- [ ] Databases (primary, replicas, caches)
- [ ] Message queues/streaming systems
- [ ] File storage systems
- [ ] CDN for static content
- [ ] Monitoring and logging systems

**Standard Architecture Template**

```
[Clients] -> [CDN] -> [Load Balancer] -> [API Gateway]
    -> [App Servers] -> [Cache] -> [Database]
            ↓
    [Message Queue] -> [Background Workers]
            ↓
    [File Storage/CDN]
```

### 3. Detailed Design (15-20 minutes)

**Database Design Considerations**

_SQL Database Choice_

```
Use when:
- Strong consistency requirements
- Complex queries and transactions
- Well-defined schema
- ACID compliance needed

Popular options: PostgreSQL, MySQL
```

_NoSQL Database Choice_

```
Document Stores (MongoDB, DynamoDB):
- Flexible schema, JSON-like documents
- Good for content management, catalogs

Key-Value (Redis, DynamoDB):
- Simple key-value operations
- Caching, session storage

Column-Family (Cassandra, HBase):
- Write-heavy workloads
- Time-series data, logging

Graph (Neo4j, Amazon Neptune):
- Relationship-heavy data
- Social networks, recommendation engines
```

**Caching Strategy Decision Tree**

```
Cache Pattern Selection:
├── Read-heavy workload?
│   ├── Yes -> Cache-Aside or Read-Through
│   └── No -> Consider Write-Through/Write-Behind
├── Data consistency critical?
│   ├── Yes -> Write-Through
│   └── No -> Write-Behind for performance
└── Cache failures acceptable?
    ├── Yes -> Cache-Aside
    └── No -> Read-Through with fallback
```

**API Design Principles**

```rest
# RESTful API Design
POST   /api/v1/users              # Create user
GET    /api/v1/users/{id}         # Get user
PUT    /api/v1/users/{id}         # Update user
DELETE /api/v1/users/{id}         # Delete user
GET    /api/v1/users/{id}/posts   # Get user's posts

# Pagination
GET /api/v1/posts?page=1&limit=20&sort=created_at:desc

# Filtering
GET /api/v1/posts?category=tech&status=published&author_id=123
```

### 4. Scale and Optimization (10-15 minutes)

**Scaling Patterns Cheatsheet**

_Database Scaling_

```
Vertical Scaling:
- Increase CPU, RAM, storage
- Limited by hardware constraints
- Good for initial scaling

Horizontal Scaling:
- Read Replicas: Handle read traffic
- Sharding: Distribute write traffic
- Federation: Split by feature/service

Sharding Strategies:
- Hash-based: Consistent distribution
- Range-based: Natural data boundaries
- Directory-based: Lookup service for location
```

_Application Scaling_

```
Stateless Services:
- Easy horizontal scaling
- Load balancer distribution
- Auto-scaling groups

Microservices Benefits:
- Independent scaling
- Technology diversity
- Fault isolation
- Team ownership

Service Mesh (Istio/Linkerd):
- Traffic management
- Security policies
- Observability
```

**Performance Optimization Techniques**

_Caching Layers_

```
Browser Cache (Client-side):
- Static assets, API responses
- Controlled by Cache-Control headers

CDN (Edge caching):
- Static content, images, videos
- Geographically distributed

Application Cache:
- In-memory: Redis, Memcached
- Database query results, session data

Database Cache:
- Query result cache
- Buffer pool optimization
```

_Asynchronous Processing_

```
Message Queues:
- Decouple services
- Handle traffic spikes
- Background processing

Event Streaming:
- Real-time data processing
- Apache Kafka, AWS Kinesis
- Event sourcing patterns
```

## Common System Design Questions

### 1. Design a URL Shortener (like bit.ly)

**Key Components:**

- URL encoding service (Base62 encoding)
- Database for URL mappings
- Cache for popular URLs
- Analytics service
- Rate limiting

**Database Schema:**

```sql
CREATE TABLE url_mappings (
    short_url VARCHAR(7) PRIMARY KEY,
    long_url TEXT NOT NULL,
    user_id BIGINT,
    created_at TIMESTAMP,
    expires_at TIMESTAMP,
    click_count BIGINT DEFAULT 0
);

CREATE INDEX idx_user_id ON url_mappings(user_id);
CREATE INDEX idx_created_at ON url_mappings(created_at);
```

### 2. Design a Chat System (like WhatsApp)

**Key Components:**

- WebSocket connections for real-time messaging
- Message queue for delivery guarantees
- User presence service
- Push notification service
- Media file storage

**Message Flow:**

```
User A -> WebSocket Server -> Message Queue -> WebSocket Server -> User B
                    ↓
              Database (persistence)
                    ↓
              Push Notification (if offline)
```

### 3. Design a Social Media Feed (like Twitter)

**Key Components:**

- User timeline generation (pull vs push model)
- Tweet storage and retrieval
- Media storage (images, videos)
- Recommendation engine
- Trending topics service

**Feed Generation Strategies:**

```
Pull Model (Timeline on demand):
- Fetch tweets when user requests
- Lower storage, higher latency
- Good for users with many followers

Push Model (Pre-computed timeline):
- Pre-generate feeds for all users
- Higher storage, lower latency
- Good for active users

Hybrid Model:
- Push for active users
- Pull for inactive users
- Celebrity user special handling
```

### 4. Design a Video Streaming Service (like YouTube)

**Key Components:**

- Video upload and processing pipeline
- Content Delivery Network (CDN)
- Video transcoding service
- Metadata database
- Recommendation system

**Video Processing Pipeline:**

```
Upload -> Virus Scan -> Transcoding -> Thumbnail Generation -> CDN Upload -> Database Update
```

## System Design Patterns Reference

### 1. Reliability Patterns

**Circuit Breaker Pattern**

```python
class CircuitBreaker:
    def __init__(self, failure_threshold=5, timeout=60):
        self.failure_threshold = failure_threshold
        self.timeout = timeout
        self.failure_count = 0
        self.last_failure_time = None
        self.state = 'CLOSED'  # CLOSED, OPEN, HALF_OPEN

    def call(self, func, *args, **kwargs):
        if self.state == 'OPEN':
            if time.time() - self.last_failure_time > self.timeout:
                self.state = 'HALF_OPEN'
            else:
                raise CircuitBreakerOpenException()

        try:
            result = func(*args, **kwargs)
            if self.state == 'HALF_OPEN':
                self.state = 'CLOSED'
                self.failure_count = 0
            return result
        except Exception as e:
            self.failure_count += 1
            self.last_failure_time = time.time()

            if self.failure_count >= self.failure_threshold:
                self.state = 'OPEN'

            raise e
```

**Retry with Exponential Backoff**

```python
def retry_with_backoff(func, max_retries=3, base_delay=1):
    for attempt in range(max_retries):
        try:
            return func()
        except Exception as e:
            if attempt == max_retries - 1:
                raise e

            delay = base_delay * (2 ** attempt) + random.uniform(0, 1)
            time.sleep(delay)
```

### 2. Data Consistency Patterns

**Saga Pattern (Distributed Transactions)**

```python
class SagaOrchestrator:
    def __init__(self):
        self.steps = []
        self.compensations = []

    def add_step(self, action, compensation):
        self.steps.append(action)
        self.compensations.append(compensation)

    def execute(self):
        completed_steps = 0

        try:
            for step in self.steps:
                step.execute()
                completed_steps += 1
        except Exception as e:
            # Compensate in reverse order
            for i in range(completed_steps - 1, -1, -1):
                self.compensations[i].execute()
            raise e
```

### 3. Performance Patterns

**CQRS (Command Query Responsibility Segregation)**

```python
# Command side (writes)
class UserCommandHandler:
    def __init__(self, write_db, event_bus):
        self.write_db = write_db
        self.event_bus = event_bus

    def create_user(self, command):
        user = User(command.user_data)
        self.write_db.save(user)
        self.event_bus.publish(UserCreatedEvent(user.id))

# Query side (reads)
class UserQueryHandler:
    def __init__(self, read_db):
        self.read_db = read_db

    def get_user_profile(self, user_id):
        return self.read_db.get_user_view(user_id)
```

## Common Interview Mistakes to Avoid

### 1. Technical Mistakes

- Jumping to solution without understanding requirements
- Not considering scalability from the beginning
- Ignoring data consistency requirements
- Over-engineering simple problems
- Under-estimating complexity of distributed systems

### 2. Communication Mistakes

- Not asking clarifying questions
- Speaking too fast or too quietly
- Not explaining trade-offs clearly
- Not engaging with interviewer feedback
- Not managing time effectively

### 3. Design Mistakes

- Single points of failure
- Not considering edge cases
- Inadequate error handling
- Poor API design
- Ignoring monitoring and observability

## Final Tips for Success

### During the Interview

1. **Think out loud** - Share your thought process
2. **Ask questions** - Clarify requirements and constraints
3. **Start simple** - Begin with basic design, then optimize
4. **Consider trade-offs** - Discuss pros and cons of decisions
5. **Be flexible** - Adapt based on interviewer feedback

### Technical Preparation

1. **Practice drawing** - Get comfortable with whiteboard/digital tools
2. **Know the numbers** - Memorize key performance metrics
3. **Study real systems** - Understand how major platforms work
4. **Practice estimation** - Get comfortable with back-of-envelope calculations

### Key Numbers to Remember

**Latency Numbers**

```
L1 cache reference:           0.5 ns
Branch mispredict:            5 ns
L2 cache reference:           7 ns
Memory reference:             100 ns
SSD random read:              150,000 ns
Network round trip (same DC): 500,000 ns
Disk seek:                    10,000,000 ns
Network round trip (CA->NY):  150,000,000 ns
```

**Capacity Numbers**

```
QPS handled by typical web server: 1,000
QPS handled by typical database:   1,000
Storage capacity of typical server: 1-4 TB
Daily storage growth (Twitter):     500 GB
Global internet traffic:            50,000 GB/s
```

This cheatsheet provides a comprehensive framework for approaching system design interviews systematically while covering essential patterns and common pitfalls.
