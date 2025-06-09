# System Design Fundamentals

## Core Concepts

### What is System Design?

System design is the process of defining architecture, components, modules, interfaces, and data flow to satisfy specified requirements. It involves making trade-offs between different architectural choices to meet business and technical constraints.

In technical interviews and real-world scenarios, system design demonstrates your ability to:

- Think at scale and handle complexity
- Make informed trade-offs between competing requirements
- Design for failure and recovery
- Balance technical and business constraints
- Communicate architectural decisions effectively

### Key Goals

- **Scalability**: Handle increasing load gracefully
- **Reliability**: System continues to work correctly during failures
- **Availability**: System remains operational over time
- **Performance**: Low latency and high throughput
- **Consistency**: Data remains consistent across the system
- **Security**: Protection against threats and unauthorized access

## System Design Process

### 1. Requirements Gathering

#### Functional Requirements

- What the system needs to do
- User stories and use cases
- Business logic and workflows
- Data processing requirements

#### Non-Functional Requirements

- **Performance**: Response time, throughput, latency
- **Scalability**: Expected growth, load patterns
- **Availability**: Uptime requirements (99.9%, 99.99%)
- **Consistency**: Data consistency needs
- **Security**: Authentication, authorization, data protection
- **Compliance**: Legal and regulatory requirements

### 2. Capacity Estimation

#### Traffic Estimation

```
Daily Active Users (DAU) × Actions per User = Total Requests
Read:Write Ratio (typically 100:1 or 1000:1)
Peak Traffic = Average × Peak Factor (2-10x)
```

#### Storage Estimation

```
Data per User × Number of Users = Total Storage
Growth Rate × Time Period = Future Storage Needs
Replication Factor × Base Storage = Total Storage with Redundancy
```

#### Bandwidth Estimation

```
Average Request Size × Requests per Second = Bandwidth
Peak Traffic × Average Response Size = Peak Bandwidth
```

### 3. System Interface Definition

#### API Design

- RESTful endpoints
- GraphQL schemas
- RPC interfaces
- Message formats

#### Data Models

- Entity relationships
- Schema design
- Data validation rules
- Indexing strategy

### 4. High-Level Architecture

#### Component Identification

- User interface layer
- Application/business logic layer
- Data access layer
- External service integrations

#### Service Boundaries

- Microservices decomposition
- Service responsibilities
- Inter-service communication
- Data ownership

### 5. Detailed Design

#### Database Design

- SQL vs NoSQL choice
- Schema design and normalization
- Partitioning and sharding strategy
- Indexing and query optimization

#### Caching Strategy

- Cache levels and types
- Cache invalidation policies
- Cache-aside vs write-through patterns
- Distributed caching considerations

#### Load Balancing

- Load balancer placement
- Balancing algorithms
- Health checks and failover
- Session affinity requirements

## Core Performance Metrics

### Scalability

**Definition**: The capability of a system to handle increased load by adding resources.

**Types of Scaling**:

**Horizontal Scaling (Scale Out)**

```
Advantages:
- Nearly unlimited scaling potential
- Improved fault tolerance
- Cost-effective with commodity hardware
- Geographic distribution possible

Challenges:
- Increased complexity
- Data consistency issues
- Network latency between nodes
- Load balancing requirements

Best For:
- Web applications
- Microservices
- Stateless applications
- High-availability systems
```

**Vertical Scaling (Scale Up)**

```
Advantages:
- Simple implementation
- No application changes required
- Strong consistency maintained
- Lower operational complexity

Limitations:
- Hardware ceiling limits
- Exponential cost increases
- Single point of failure
- Downtime during upgrades

Best For:
- Legacy applications
- Databases requiring ACID properties
- Monolithic architectures
- Early-stage applications
```

**Scalability Patterns**:

- Load balancing and distribution
- Caching at multiple levels
- Database sharding and replication
- Microservices architecture
- Content delivery networks (CDNs)
- Auto-scaling based on metrics

### Reliability

**Definition**: The probability that a system performs correctly during a specific time duration.

**Key Concepts**:

**Mean Time Between Failures (MTBF)**

```
MTBF = (Total Elapsed Time - Total Downtime) / Number of Failures

Example:
- Operating time: 8,760 hours (1 year)
- Downtime: 8.76 hours
- Failures: 3
- MTBF = (8,760 - 8.76) / 3 = 2,917 hours
```

**Mean Time To Recovery (MTTR)**

```
MTTR = Total Downtime / Number of Incidents

Target MTTR varies by system criticality:
- Critical systems: < 1 hour
- Business systems: < 4 hours
- Development systems: < 24 hours
```

**Reliability Strategies**:

- Redundancy and replication
- Graceful degradation
- Circuit breaker patterns
- Health checks and monitoring
- Automated failover
- Disaster recovery planning

### Availability

**Definition**: The percentage of time a system is operational and accessible.

**Calculation**:

```
Availability = (Uptime / Total Time) × 100
Availability = (MTBF / (MTBF + MTTR)) × 100

Example:
- Uptime: 8,751.24 hours
- Total time: 8,760 hours
- Availability = (8,751.24 / 8,760) × 100 = 99.90%
```

**Availability Levels ("Nines")**:

| Availability | Annual Downtime | Monthly Downtime | Daily Downtime |
| ------------ | --------------- | ---------------- | -------------- |
| 90%          | 36.53 days      | 73 hours         | 2.4 hours      |
| 99%          | 3.65 days       | 7.31 hours       | 14.40 minutes  |
| 99.9%        | 8.77 hours      | 43.83 minutes    | 1.44 minutes   |
| 99.99%       | 52.60 minutes   | 4.38 minutes     | 8.64 seconds   |
| 99.999%      | 5.26 minutes    | 26.30 seconds    | 0.864 seconds  |
| 99.9999%     | 31.56 seconds   | 2.63 seconds     | 0.0864 seconds |

**High Availability Patterns**:

- Active-active configurations
- Load balancing across multiple zones
- Database master-slave replication
- Content delivery networks
- Circuit breakers and bulkheads
- Graceful degradation strategies

### Performance

**Latency**: Time to process a single request

```
Types of Latency:
- Network latency: 1-100ms (depending on distance)
- Database query: 1-100ms (depending on complexity)
- Cache lookup: 0.1-1ms
- Memory access: 100ns
- Disk seek: 10ms
```

**Throughput**: Number of requests processed per unit time

```
Factors Affecting Throughput:
- Server capacity (CPU, memory, I/O)
- Network bandwidth
- Database performance
- Application efficiency
- Caching effectiveness
```

**Response Time Distribution**:

```
Percentiles Matter:
- p50 (median): 50% of requests faster than this
- p95: 95% of requests faster than this
- p99: 99% of requests faster than this
- p99.9: 99.9% of requests faster than this

Focus on high percentiles for user experience
Tail latency can significantly impact overall system performance
```

### Consistency

**Definition**: All nodes see the same data at the same time.

**Consistency Models**:

**Strong Consistency**

```
Guarantees:
- All reads receive the most recent write
- All nodes see identical data simultaneously
- ACID properties maintained

Trade-offs:
+ Data accuracy guaranteed
- Higher latency
- Reduced availability during partitions
- Scalability limitations

Use Cases: Financial transactions, inventory management
```

**Eventual Consistency**

```
Guarantees:
- System will become consistent over time
- No guarantees on convergence timing
- Temporary inconsistencies allowed

Trade-offs:
+ Better performance and availability
+ Improved scalability
- Complex application logic
- User experience considerations

Use Cases: Social media feeds, DNS, email systems
```

**Weak Consistency**

```
Guarantees:
- Best effort consistency
- No timing guarantees
- Applications handle inconsistencies

Trade-offs:
+ Highest performance
+ Maximum availability
- Complex error handling
- Potential data loss scenarios

Use Cases: Real-time gaming, live streaming, sensor data
```

## System Design Principles

### Single Responsibility Principle

Each component should have one reason to change and one primary responsibility.

### Separation of Concerns

Divide system into distinct sections that address separate concerns.

### Don't Repeat Yourself (DRY)

Avoid duplication of functionality across the system.

### Keep It Simple, Stupid (KISS)

Prefer simple solutions over complex ones when they meet requirements.

### You Aren't Gonna Need It (YAGNI)

Don't build features until they're actually needed.

### Fail Fast

Design systems to fail quickly and visibly when something goes wrong.

### Defense in Depth

Implement multiple layers of security and error handling.

## Common Trade-offs

### Performance vs Consistency

- **Strong Consistency**: All nodes see the same data simultaneously
- **Eventual Consistency**: Nodes will become consistent over time
- **Performance Impact**: Strong consistency requires coordination overhead

### Availability vs Consistency (CAP Theorem)

- **CA Systems**: Consistent and Available (single node systems)
- **CP Systems**: Consistent and Partition-tolerant (traditional databases)
- **AP Systems**: Available and Partition-tolerant (NoSQL systems)

### Space vs Time Complexity

- **Caching**: Use more memory to reduce computation time
- **Indexing**: Use more storage to speed up queries
- **Precomputation**: Store results to avoid real-time calculation

### Cost vs Performance

- **Hardware**: More powerful hardware costs more
- **Redundancy**: High availability requires duplicate resources
- **Geographic Distribution**: Global presence increases infrastructure costs

## Design Patterns for Scale

### Horizontal Partitioning (Sharding)

- Split data across multiple databases
- Each shard contains a subset of data
- Requires careful partition key selection
- Challenges: Cross-shard queries, rebalancing

### Vertical Partitioning

- Split tables by columns or features
- Separate read and write workloads
- Microservices often use vertical partitioning
- Benefits: Independent scaling, technology diversity

### Replication

- **Master-Slave**: One write node, multiple read replicas
- **Master-Master**: Multiple write nodes with conflict resolution
- **Read Replicas**: Scale read operations
- **Geographic Replication**: Reduce latency globally

### Circuit Breaker Pattern

- Prevent cascading failures
- Fast failure when downstream services are unavailable
- Automatic recovery when services become healthy
- Implementation: States (Closed, Open, Half-Open)

## System Components

### Load Balancers

- **Layer 4**: Transport layer (TCP/UDP)
- **Layer 7**: Application layer (HTTP/HTTPS)
- **Algorithms**: Round-robin, least connections, weighted
- **Health Checks**: Monitor backend health

### Reverse Proxies

- SSL termination
- Request routing
- Compression and caching
- Security filtering

### Message Queues

- **Point-to-Point**: One producer, one consumer
- **Publish-Subscribe**: One producer, multiple consumers
- **Benefits**: Decoupling, reliability, scalability
- **Technologies**: RabbitMQ, Apache Kafka, Amazon SQS

### Caching Layers

- **Browser Cache**: Client-side caching
- **CDN**: Geographic content distribution
- **Application Cache**: In-memory caching (Redis, Memcached)
- **Database Cache**: Query result caching

## Latency Numbers Every Developer Should Know

| Access Type       | Time             | Converted Time |
| ----------------- | ---------------- | -------------- |
| CPU Cycle         | 0.3 ns           | 1 S            |
| CPU L1 Cache      | 1 ns             | 3 S            |
| CPU L2 Cache      | 3 ns             | 9 S            |
| CPU L3 Cache      | 13 ns            | 43 S           |
| Main Memory (RAM) | 120 ns           | 6 minutes      |
| SSD               | 150 microseconds | 6 days         |
| HDD               | 10 ms            | 12 months      |
| SF to NYC         | 40 ms            | 4 years        |
| SF to Australia   | 183 ms           | 19 years       |

## Capacity Planning

### Data Size Basics

| Type           | Size Estimate |
| -------------- | ------------- |
| Char           | 1 byte        |
| Integer        | 4 bytes       |
| Unix Timestamp | 4 bytes       |

- 8 bits → 1 byte
- 1024 bytes → 1 kilobyte
- 1024 kilobytes → 1 megabyte
- 1024 megabytes → 1 gigabyte
- 1024 gigabytes → 1 terabyte

### Time Calculations

60 Seconds × 60 Minutes = 3600 Seconds per Hour
3600 × 24 hours = 86400 Seconds per Day
86400 × 30 days = 2,500,000 seconds per Month

### Traffic Estimation

**Estimate total number of requests app will receive**
**Average Daily Active Users × average reads/writes per user**

10 Million DAU × 30 photos viewed = 300 Million Photo Requests
10 Million DAU × 1 photo upload = 10 Million Photo Writes

300 Million Requests ÷ 86400 = 3472 Requests per Second
10 Million Writes ÷ 86400 = 115 Writes per Second

### Memory Estimation

**Read Requests per day x Average Request size x 0.2**

300 Million Requests × 500 Bytes = 150 Gigabytes
150GB × 0.2 (20%) = 30 Gigabytes
30GB × 3 (replication) = 90 Gigabytes

### Bandwidth Estimation

**Requests per day x Request size**

300 Million Requests × 1.5MB = 450,000 Gigabytes
450,000GB ÷ 86400 seconds = 5.2GB per second

### Storage Estimation

**Writes per day x Size of write x Time to store data**

10 Million Writes × 1.5MB = 15 TB per day
15TB × 365 days × 10 years = 55 Petabytes

## Monitoring and Observability

### Key Metrics

- **Latency**: Response time for requests
- **Throughput**: Requests handled per second
- **Error Rate**: Percentage of failed requests
- **Saturation**: Resource utilization levels

### Logging Strategy

- **Structured Logging**: Consistent log format
- **Log Levels**: ERROR, WARN, INFO, DEBUG
- **Correlation IDs**: Track requests across services
- **Centralized Logging**: Aggregate logs from all services

### Distributed Tracing

- Track requests across multiple services
- Identify bottlenecks and failures
- Tools: Jaeger, Zipkin, AWS X-Ray

## Security Considerations

### Authentication and Authorization

- **Authentication**: Verify user identity
- **Authorization**: Control access to resources
- **JWT Tokens**: Stateless authentication
- **OAuth 2.0**: Third-party authentication

### Data Protection

- **Encryption in Transit**: HTTPS/TLS
- **Encryption at Rest**: Database and file encryption
- **Key Management**: Secure key storage and rotation
- **Data Masking**: Protect sensitive data in non-production

### API Security

- **Rate Limiting**: Prevent abuse and DDoS
- **Input Validation**: Sanitize user inputs
- **SQL Injection Prevention**: Use parameterized queries
- **CORS Policy**: Control cross-origin requests

## Testing Strategies

### Unit Testing

- Test individual components in isolation
- Mock external dependencies
- High test coverage for business logic
- Fast execution for developer feedback

### Integration Testing

- Test component interactions
- Database integration tests
- API endpoint testing
- Service-to-service communication

### Load Testing

- Test system performance under load
- Identify bottlenecks and breaking points
- Validate auto-scaling behavior
- Tools: JMeter, Artillery, k6

### Chaos Engineering

- Intentionally introduce failures
- Test system resilience and recovery
- Validate monitoring and alerting
- Tools: Chaos Monkey, Gremlin

## Deployment and Operations

### Deployment Strategies

- **Blue-Green**: Switch between two identical environments
- **Canary**: Gradual rollout to subset of users
- **Rolling**: Update instances one by one
- **Feature Flags**: Control feature availability

### Infrastructure as Code

- Version-controlled infrastructure
- Reproducible environments
- Automated provisioning
- Tools: Terraform, CloudFormation, Ansible

### Container Orchestration

- **Docker**: Application containerization
- **Kubernetes**: Container orchestration
- **Service Mesh**: Inter-service communication
- **Auto-scaling**: Dynamic resource allocation

## Best Practices

### Design for Failure

- Assume components will fail
- Implement graceful degradation
- Use timeouts and retries
- Design idempotent operations

### Start Simple, Scale Gradually

- Begin with monolithic architecture if appropriate
- Identify scaling bottlenecks through monitoring
- Refactor to microservices when necessary
- Avoid premature optimization

### Document Architecture Decisions

- Record architectural decision records (ADRs)
- Document trade-offs and reasoning
- Keep documentation updated
- Share knowledge across team

### Performance Optimization

- Profile and measure before optimizing
- Optimize the most impactful bottlenecks first
- Consider caching at multiple levels
- Use appropriate data structures and algorithms

### Error Handling

- Implement comprehensive error handling
- Use structured error responses
- Log errors with sufficient context
- Provide meaningful error messages to users

## Interview Tips

### Approach

1. **Clarify Requirements**: Ask questions about scale, features, constraints
2. **Estimate Scale**: Calculate users, data, traffic
3. **High-Level Design**: Draw major components and data flow
4. **Detail Critical Components**: Focus on complex or unique parts
5. **Address Bottlenecks**: Identify and solve scaling issues
6. **Consider Trade-offs**: Discuss alternatives and their implications

### Common Mistakes

- Jumping into details too quickly
- Not asking clarifying questions
- Ignoring non-functional requirements
- Not considering failure scenarios
- Over-engineering for unrealistic scale

### Communication

- Think out loud during design process
- Explain trade-offs and reasoning
- Ask for feedback and clarification
- Be open to alternative approaches
- Draw diagrams to illustrate concepts

## Architectural Patterns

### Three-Tier Architecture

- **Presentation Tier**: User interface
- **Application Tier**: Business logic
- **Data Tier**: Data storage and management

### MapReduce

- Distributed computation model for processing large data sets
- Frameworks: Hadoop, Spark

### Asynchronous Processing

- Use message queues (e.g., RabbitMQ, Kafka) for non-blocking operations

### Rate Limiting

- Control the number of requests to protect APIs from overuse and abuse

## System Design Techniques

### Indexing

- Use indexes to speed up query performance
- Trade-off: Increases write latency and storage overhead

### Caching

- Store frequently accessed data in faster storage layers
- Tools: Redis, Memcached

### Sharding (Horizontal Partitioning)

- Split data across multiple databases to distribute load
- Beware of hot keys and join limitations

### Connection Pooling

- Reuse existing database connections to reduce overhead

## Useful Resources

- **High Scalability Blog**: [highscalability.com](http://highscalability.com/)
- **System Design Primer**: [GitHub](https://github.com/donnemartin/system-design-primer)
- **Awesome System Design**: [GitHub](https://github.com/madd86/awesome-system-design)
- **FreeCodeCamp Guide**: [Systems Design for Interviews](https://www.freecodecamp.org/news/systems-design-for-interviews/)

## Additional Resources

[http://highscalability.com/](http://highscalability.com/)

[https://github.com/donnemartin/system-design-primer](https://github.com/donnemartin/system-design-primer)

[https://github.com/madd86/awesome-system-design](https://github.com/madd86/awesome-system-design)

[https://blog.pramp.com/how-to-succeed-in-a-system-design-interview-27b35de0df26](https://blog.pramp.com/how-to-succeed-in-a-system-design-interview-27b35de0df26)

[https://www.systemdesignnotes.com/](https://www.systemdesignnotes.com/)

[https://www.freecodecamp.org/news/systems-design-for-interviews/](https://www.freecodecamp.org/news/systems-design-for-interviews/)

[https://medium.com/the-andela-way/system-design-in-software-development-f360ce6fcbb9](https://medium.com/the-andela-way/system-design-in-software-development-f360ce6fcbb9)

[https://www.interviewbit.com/courses/system-design/](https://www.interviewbit.com/courses/system-design/)

[https://www.codemag.com/Article/1909071/Design-Patterns-for-Distributed-Systems](https://www.codemag.com/Article/1909071/Design-Patterns-for-Distributed-Systems)

[https://github.com/donnemartin/system-design-primer#study-guide](https://github.com/donnemartin/system-design-primer#study-guide)

[https://github.com/donnemartin/system-design-primer#how-to-approach-a-system-design-interview-question](https://github.com/donnemartin/system-design-primer#how-to-approach-a-system-design-interview-question)

[https://github.com/donnemartin/system-design-primer#system-design-interview-questions-with-solutions](https://github.com/donnemartin/system-design-primer#system-design-interview-questions-with-solutions)

[https://github.com/donnemartin/system-design-primer#object-oriented-design-interview-questions-with-solutions](https://github.com/donnemartin/system-design-primer#object-oriented-design-interview-questions-with-solutions)

[https://github.com/donnemartin/system-design-primer#additional-system-design-interview-questions](https://github.com/donnemartin/system-design-primer#additional-system-design-interview-questions)

[https://www.teamblind.com/post/Giving-back---how-I-cleared-L6-System-Design---Part-1-4yufM3RY](https://www.teamblind.com/post/Giving-back---how-I-cleared-L6-System-Design---Part-1-4yufM3RY)

[https://www.youtube.com/channel/UC9vLsnF6QPYuH51njmIooCQ](https://www.youtube.com/channel/UC9vLsnF6QPYuH51njmIooCQ)

[https://www.youtube.com/channel/UCn1XnDWhsLS5URXTi5wtFTA](https://www.youtube.com/channel/UCn1XnDWhsLS5URXTi5wtFTA)

[https://www.youtube.com/channel/UCRPMAqdtSgd0Ipeef7iFsKw](https://www.youtube.com/channel/UCRPMAqdtSgd0Ipeef7iFsKw)

[https://www.youtube.com/watch?v=DSGsa0pu8-k](https://www.youtube.com/watch?v=DSGsa0pu8-k)

[https://www.youtube.com/watch?v=ZgdS0EUmn70](https://www.youtube.com/watch?v=ZgdS0EUmn70)

[https://www.youtube.com/watch?v=MbjObHmDbZo&list=PLouYZxI9X31w4soyXyMjvHTTZTQAF_2nn&index=3&t=227s](https://www.youtube.com/watch?v=MbjObHmDbZo&list=PLouYZxI9X31w4soyXyMjvHTTZTQAF_2nn&index=3&t=227s)
