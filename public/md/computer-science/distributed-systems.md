# Distributed Systems

## Overview

Distributed Systems are collections of independent computers that appear to users as a single coherent system. They enable scalability, fault tolerance, and geographic distribution of computing resources.

## Core Concepts

### Fundamental Characteristics

- **Distribution Transparency**: Hide complexity from users
- **Scalability**: Handle increasing load gracefully
- **Fault Tolerance**: Continue operation despite failures
- **Concurrency**: Handle multiple simultaneous requests
- **Consistency**: Maintain data integrity across nodes

### Network Communication

- **Message Passing**: Inter-process communication
- **Remote Procedure Calls (RPC)**: Function calls across network
- **Request-Response Patterns**: Synchronous communication
- **Publish-Subscribe**: Asynchronous messaging
- **Event-Driven Architecture**: Reactive systems

## Distributed System Models

### Architectural Patterns

- **Client-Server**: Centralized service model
- **Peer-to-Peer**: Decentralized equal nodes
- **Microservices**: Loosely coupled services
- **Service-Oriented Architecture (SOA)**: Enterprise integration
- **Serverless**: Function-as-a-Service model

### Communication Models

- **Synchronous**: Blocking operations
- **Asynchronous**: Non-blocking operations
- **Message Queues**: Buffered communication
- **Streaming**: Continuous data flow
- **Batch Processing**: Bulk data operations

## Consistency Models

### Strong Consistency

- **Linearizability**: Operations appear instantaneous
- **Sequential Consistency**: Program order preservation
- **Causal Consistency**: Causally related operations order
- **ACID Properties**: Atomicity, Consistency, Isolation, Durability

### Eventual Consistency

- **BASE Properties**: Basically Available, Soft state, Eventual consistency
- **Convergence**: All replicas eventually agree
- **Conflict Resolution**: Handling concurrent updates
- **Vector Clocks**: Tracking causal relationships

### CAP Theorem

**Consistency, Availability, Partition tolerance** - choose two:

- **CA Systems**: Traditional RDBMS (single point of failure)
- **CP Systems**: Strong consistency, sacrifice availability
- **AP Systems**: High availability, eventual consistency

## Consensus Algorithms

### Raft Algorithm

```
Leader Election Process:
1. Nodes start as followers
2. Timeout triggers candidate state
3. Candidate requests votes
4. Majority vote wins leadership
5. Leader sends heartbeats
```

### Paxos Algorithm

- **Basic Paxos**: Single-value consensus
- **Multi-Paxos**: Sequence of values
- **Byzantine Paxos**: Handles malicious failures
- **Fast Paxos**: Reduced message rounds

### Byzantine Fault Tolerance

- **Problem**: Handling malicious nodes
- **PBFT**: Practical Byzantine Fault Tolerance
- **Requirements**: 3f+1 nodes for f failures
- **Applications**: Blockchain, critical systems

## Replication Strategies

### Primary-Backup Replication

- **Master-Slave**: Single write node
- **Failover**: Backup becomes primary
- **Read Replicas**: Scale read operations
- **Synchronous vs Asynchronous**: Trade-offs

### Multi-Master Replication

- **Active-Active**: Multiple write nodes
- **Conflict Resolution**: Last-writer-wins, merge
- **Quorum Systems**: Majority consensus
- **Gossip Protocols**: Peer-to-peer updates

### Partitioning (Sharding)

```
Consistent Hashing:
1. Hash nodes and keys to ring
2. Key belongs to next clockwise node
3. Virtual nodes for load balancing
4. Minimal reshuffling on changes
```

## Distributed Algorithms

### Leader Election

- **Bully Algorithm**: Highest ID wins
- **Ring Algorithm**: Token-based election
- **Raft Election**: Randomized timeouts
- **Failure Detection**: Heartbeat mechanisms

### Mutual Exclusion

- **Centralized Approach**: Single coordinator
- **Distributed Approach**: Majority voting
- **Token Ring**: Circulating permission
- **Lamport's Algorithm**: Logical timestamps

### Distributed Snapshots

- **Chandy-Lamport Algorithm**: Global state capture
- **Cut Property**: Consistent global state
- **Marker Messages**: Snapshot coordination
- **Applications**: Checkpointing, debugging

## Time and Ordering

### Logical Clocks

```python
# Lamport Timestamps
class LamportClock:
    def __init__(self):
        self.time = 0

    def tick(self):
        self.time += 1
        return self.time

    def update(self, received_time):
        self.time = max(self.time, received_time) + 1
```

### Vector Clocks

- **Causal Ordering**: Partial order of events
- **Concurrent Events**: Cannot determine order
- **Version Vectors**: Distributed version control
- **Conflict Detection**: Identify concurrent updates

### Physical Clocks

- **Network Time Protocol (NTP)**: Clock synchronization
- **Clock Skew**: Drift between clocks
- **Berkeley Algorithm**: Average-based sync
- **Cristian's Algorithm**: Client-server sync

## Distributed Storage

### Distributed File Systems

- **GFS (Google File System)**: Large-scale storage
- **HDFS (Hadoop)**: Fault-tolerant file system
- **Ceph**: Object, block, and file storage
- **Lustre**: High-performance computing

### NoSQL Databases

- **Document Stores**: MongoDB, CouchDB
- **Key-Value Stores**: Redis, DynamoDB
- **Column Family**: Cassandra, HBase
- **Graph Databases**: Neo4j, Amazon Neptune

### Distributed Transactions

```
Two-Phase Commit (2PC):
Phase 1 - Prepare:
  Coordinator asks all participants to prepare
  Participants vote yes/no
Phase 2 - Commit:
  If all yes: commit
  If any no: abort
```

## Message Passing Systems

### Message Queues

- **Point-to-Point**: One producer, one consumer
- **Publish-Subscribe**: One producer, many consumers
- **Topic-Based**: Content-based routing
- **Queue-Based**: Load balancing consumers

### Stream Processing

- **Apache Kafka**: Distributed streaming platform
- **Apache Pulsar**: Multi-tenant messaging
- **RabbitMQ**: AMQP message broker
- **Apache Storm**: Real-time computation

### Event Sourcing

- **Event Store**: Immutable event log
- **Replay**: Reconstruct state from events
- **Snapshots**: Performance optimization
- **CQRS**: Command Query Responsibility Segregation

## Scalability Patterns

### Horizontal Scaling

- **Load Balancing**: Distribute requests
- **Partitioning**: Divide data/load
- **Replication**: Multiple copies
- **Caching**: Reduce backend load

### Vertical Scaling

- **Scale Up**: More powerful hardware
- **Resource Optimization**: CPU, memory, I/O
- **Bottleneck Identification**: Performance profiling
- **Capacity Planning**: Growth prediction

### Microservices Architecture

```
Service Characteristics:
- Single responsibility
- Independently deployable
- Decentralized governance
- Failure isolation
- Technology diversity
```

## Fault Tolerance

### Failure Models

- **Crash Failures**: Node stops responding
- **Omission Failures**: Messages lost
- **Timing Failures**: Performance degradation
- **Byzantine Failures**: Arbitrary behavior

### Recovery Strategies

- **Checkpointing**: Periodic state saves
- **Rollback Recovery**: Return to known state
- **Forward Recovery**: Fix and continue
- **Redundancy**: Multiple copies

### Circuit Breaker Pattern

```python
class CircuitBreaker:
    def __init__(self, failure_threshold=5, timeout=60):
        self.failure_count = 0
        self.failure_threshold = failure_threshold
        self.timeout = timeout
        self.state = 'CLOSED'
        self.last_failure_time = None

    def call(self, func, *args, **kwargs):
        if self.state == 'OPEN':
            if time.time() - self.last_failure_time > self.timeout:
                self.state = 'HALF_OPEN'
            else:
                raise Exception("Circuit breaker is OPEN")

        try:
            result = func(*args, **kwargs)
            self.reset()
            return result
        except Exception as e:
            self.record_failure()
            raise e
```

## Performance and Monitoring

### Metrics and Monitoring

- **Latency**: Response time measurement
- **Throughput**: Requests per second
- **Availability**: Uptime percentage
- **Error Rate**: Failure percentage
- **Resource Utilization**: CPU, memory, network

### Distributed Tracing

- **Jaeger**: End-to-end tracing
- **Zipkin**: Request flow tracking
- **OpenTelemetry**: Observability framework
- **Correlation IDs**: Request tracking

### Load Testing

- **Stress Testing**: Peak load handling
- **Volume Testing**: Large data sets
- **Endurance Testing**: Long-term stability
- **Spike Testing**: Sudden load increases

## Security in Distributed Systems

### Authentication and Authorization

- **OAuth 2.0**: Delegated authorization
- **JWT Tokens**: Stateless authentication
- **RBAC**: Role-based access control
- **Service Mesh**: Inter-service security

### Network Security

- **TLS/SSL**: Transport encryption
- **VPN**: Virtual private networks
- **Firewalls**: Network filtering
- **Zero Trust**: Never trust, always verify

### Data Security

- **Encryption at Rest**: Stored data protection
- **Encryption in Transit**: Communication security
- **Key Management**: Secure key distribution
- **Data Integrity**: Checksums and hashing

## Industry Examples

### Large-Scale Systems

- **Google**: MapReduce, Bigtable, Spanner
- **Amazon**: DynamoDB, S3, Lambda
- **Facebook**: Cassandra, Memcached
- **Netflix**: Microservices architecture

### Open Source Projects

- **Apache Kafka**: Streaming platform
- **Apache Spark**: Big data processing
- **Kubernetes**: Container orchestration
- **Elasticsearch**: Distributed search

### Cloud Platforms

- **AWS**: Elastic services
- **Google Cloud**: Global infrastructure
- **Azure**: Enterprise integration
- **Multi-Cloud**: Vendor independence

## Design Patterns

### Saga Pattern

```
Distributed Transaction Management:
1. Break transaction into steps
2. Each step has compensating action
3. Execute steps sequentially
4. On failure, execute compensations
```

### CQRS (Command Query Responsibility Segregation)

- **Separate Models**: Read and write separation
- **Event Sourcing**: Event-driven updates
- **Eventual Consistency**: Async synchronization
- **Scalability**: Independent scaling

### Bulkhead Pattern

- **Resource Isolation**: Prevent cascade failures
- **Thread Pools**: Separate execution contexts
- **Connection Pools**: Database isolation
- **Rate Limiting**: Prevent resource exhaustion

## Interview Tips

### Common Questions

1. **Explain CAP theorem**: Consistency, Availability, Partition tolerance
2. **Compare SQL vs NoSQL**: ACID vs BASE properties
3. **Describe eventual consistency**: Convergence without conflicts
4. **What is a distributed transaction?**: ACID across multiple nodes
5. **How do you handle network partitions?**: Fault tolerance strategies

### System Design Questions

- Design a distributed cache (Redis-like)
- Design a chat application (WhatsApp-like)
- Design a URL shortener (bit.ly-like)
- Design a content delivery network
- Design a distributed file system

### Technical Deep Dives

- Consensus algorithms implementation
- Consistent hashing mechanics
- Vector clock comparisons
- Byzantine fault tolerance
- Distributed deadlock detection

## Best Practices

### Architecture Design

- Design for failure from the beginning
- Implement circuit breakers and timeouts
- Use idempotent operations
- Plan for eventual consistency
- Monitor everything

### Development

- Write comprehensive tests
- Implement proper logging
- Use correlation IDs
- Handle partial failures gracefully
- Document failure modes

### Operations

- Automate deployment pipelines
- Implement proper monitoring
- Plan for disaster recovery
- Conduct regular failure testing
- Maintain runbooks

Distributed Systems enable building scalable, fault-tolerant applications that can serve millions of users across the globe while maintaining performance and reliability.
