# System Design Fundamentals

## Core Concepts

### What is System Design?

System design is the process of defining architecture, components, modules, interfaces, and data flow to satisfy specified requirements. It involves making trade-offs between different architectural choices to meet business and technical constraints.

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
