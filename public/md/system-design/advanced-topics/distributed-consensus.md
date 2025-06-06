# Distributed Consensus and Coordination

## Consensus Algorithms

### The Consensus Problem

**Definition**: Agreement among distributed systems on a single data value or system state, even in the presence of failures.

**Challenges:**

- **Network Partitions**: Communication failures between nodes
- **Node Failures**: Individual node crashes or becomes unresponsive
- **Byzantine Failures**: Malicious or arbitrarily faulty behavior
- **Timing Issues**: Variable message delays and processing times

**Requirements:**

- **Agreement**: All correct nodes decide on the same value
- **Validity**: Decided value must be proposed by some node
- **Termination**: All correct nodes eventually decide
- **Integrity**: Each node decides at most once

### Raft Consensus Algorithm

#### Raft Basics

**Roles:**

- **Leader**: Handles all client requests and log replication
- **Follower**: Passive nodes that respond to leader requests
- **Candidate**: Nodes attempting to become leader during elections

**Terms**: Logical clock dividing time into consecutive terms

#### Leader Election

1. **Follower Timeout**: Follower doesn't receive heartbeat from leader
2. **Become Candidate**: Increment term and vote for itself
3. **Request Votes**: Send vote requests to other nodes
4. **Majority Wins**: Candidate with majority votes becomes leader
5. **Heartbeat**: New leader sends heartbeats to maintain authority

#### Log Replication

1. **Client Request**: Client sends command to leader
2. **Append Entry**: Leader appends entry to its log
3. **Replicate**: Leader sends entry to all followers
4. **Majority Ack**: Wait for majority acknowledgment
5. **Commit**: Leader commits entry and responds to client
6. **Follower Commit**: Followers commit entry in next heartbeat

#### Safety Properties

- **Election Safety**: At most one leader per term
- **Leader Append-Only**: Leader never overwrites log entries
- **Log Matching**: Identical entries at same index across logs
- **Leader Completeness**: Committed entries present in future leaders
- **State Machine Safety**: Same state machine execution across nodes

### Practical Byzantine Fault Tolerance (PBFT)

#### Byzantine Fault Model

**Assumptions:**

- Up to f Byzantine (malicious) nodes in system of 3f + 1 nodes
- Cryptographic signatures prevent message forgery
- Network is asynchronous but messages eventually delivered

#### PBFT Protocol Phases

1. **Request**: Client sends request to primary replica
2. **Pre-prepare**: Primary broadcasts request to all backups
3. **Prepare**: Backups broadcast prepare messages
4. **Commit**: After receiving 2f prepare messages, broadcast commit
5. **Reply**: After receiving 2f + 1 commit messages, execute and reply

#### View Changes

- **Primary Failure Detection**: Timeout-based failure detection
- **View Change**: Transition to new primary replica
- **New View**: New primary proves legitimacy with proof messages
- **State Transfer**: Synchronize state across replicas

### Practical Considerations

#### CAP Theorem Implications

- **Consistency vs Availability**: Choose based on application requirements
- **Partition Tolerance**: Always required in distributed systems
- **Configuration**: 2f + 1 nodes for crash faults, 3f + 1 for Byzantine

#### Performance Characteristics

- **Raft**: Efficient for crash-fault tolerance
- **PBFT**: Higher overhead but handles malicious faults
- **Network Overhead**: Message complexity affects performance
- **Latency**: Consensus adds latency to operations

## Distributed Coordination

### Apache Zookeeper

#### ZooKeeper Architecture

**Components:**

- **ZooKeeper Ensemble**: Cluster of ZooKeeper servers
- **Client Library**: API for application integration
- **Znode Hierarchy**: Tree-like namespace for data storage
- **Session Management**: Client session lifecycle management

**Data Model:**

- **Znodes**: File-like entities storing data
- **Hierarchical Namespace**: Unix-like file system structure
- **Sequential Nodes**: Automatically numbered nodes
- **Ephemeral Nodes**: Nodes tied to client sessions

#### ZooKeeper Guarantees

- **Sequential Consistency**: Client operations executed in order
- **Atomicity**: Operations succeed or fail completely
- **Single System Image**: Same view for all clients
- **Durability**: Updates persist until overwritten
- **Timeliness**: Bounded staleness guarantees

#### Common Use Cases

- **Configuration Management**: Centralized configuration storage
- **Service Discovery**: Dynamic service registration and lookup
- **Distributed Locking**: Mutual exclusion across processes
- **Leader Election**: Elect single leader among multiple candidates
- **Group Membership**: Track active members in distributed group

### etcd

#### etcd Architecture

**Components:**

- **Raft Consensus**: Built on Raft consensus algorithm
- **gRPC API**: High-performance RPC framework
- **Watch API**: Real-time notification of key changes
- **Lease System**: TTL-based key expiration

**Features:**

- **Strong Consistency**: Linearizable read/write operations
- **High Availability**: Tolerates minority node failures
- **SSL/TLS Security**: Encrypted client-server communication
- **Multi-version Concurrency Control**: MVCC for consistent reads

#### etcd Use Cases

- **Kubernetes**: Configuration and service discovery
- **Service Discovery**: Dynamic service registration
- **Configuration Management**: Distributed configuration storage
- **Distributed Locking**: Coordination primitives
- **Leader Election**: Single leader selection

### Consul

#### Consul Architecture

**Components:**

- **Consul Agent**: Runs on every node in cluster
- **Consul Server**: Maintains cluster state
- **Consul Client**: Forwards requests to servers
- **Gossip Protocol**: Membership and failure detection

**Features:**

- **Service Discovery**: Automatic service registration and health checking
- **Health Checking**: Monitor service and node health
- **KV Store**: Distributed key-value storage
- **Multi-Datacenter**: Native multi-datacenter support
- **Access Control**: Fine-grained security policies

#### Consul Use Cases

- **Service Mesh**: Service-to-service communication
- **Load Balancer Configuration**: Dynamic load balancer updates
- **Service Discovery**: Find and connect to services
- **Health Monitoring**: Track service health across infrastructure
- **Configuration Management**: Runtime configuration updates

## Distributed Locking

### Lock Types

#### Exclusive Locks

- **Mutual Exclusion**: Only one process holds lock at a time
- **Critical Sections**: Protect shared resources
- **Strong Consistency**: Prevent race conditions
- **Use Cases**: Database updates, file modifications

#### Shared Locks (Read Locks)

- **Multiple Readers**: Multiple processes can hold read locks
- **Reader-Writer Pattern**: Coordinate read and write access
- **Performance**: Better read scalability
- **Use Cases**: Cache refresh, read-heavy workloads

#### Distributed Semaphores

- **Counting Semaphore**: Limit number of concurrent processes
- **Resource Pools**: Manage finite resource access
- **Rate Limiting**: Control request rates
- **Use Cases**: Connection pools, API rate limiting

### Lock Implementation Patterns

#### ZooKeeper-based Locking

```
/locks
  /lock-00000001  (ephemeral sequential)
  /lock-00000002  (ephemeral sequential)
  /lock-00000003  (ephemeral sequential)
```

**Algorithm:**

1. Create ephemeral sequential node
2. Get children of lock directory
3. If lowest numbered node, acquire lock
4. Otherwise, watch previous node for deletion
5. When previous node deleted, acquire lock

#### Redis-based Locking (Redlock)

**Single Instance:**

```
SET lock_key unique_value PX 30000 NX
```

**Multi-Instance (Redlock):**

1. Get current time in milliseconds
2. Try to acquire lock on all N instances
3. Consider lock acquired if majority instances locked
4. Adjust lock validity time for acquisition latency
5. Release lock on all instances if not acquired

#### Database-based Locking

**Optimistic Locking:**

- Use version numbers or timestamps
- Check version before update
- Retry on version mismatch

**Pessimistic Locking:**

- Acquire exclusive database lock
- Hold lock during entire transaction
- Higher consistency, lower concurrency

### Lock Challenges

#### Deadlock Prevention

- **Lock Ordering**: Always acquire locks in same order
- **Timeout**: Set timeouts on lock acquisition
- **Deadlock Detection**: Monitor for circular dependencies
- **Retry Logic**: Exponential backoff on lock failures

#### Lock Granularity

- **Fine-grained**: Higher concurrency, more complexity
- **Coarse-grained**: Lower concurrency, simpler implementation
- **Hierarchical**: Nested lock structures
- **Intent Locks**: Signal intention to lock at finer granularity

#### Split-brain Prevention

- **Majority Quorum**: Require majority for lock acquisition
- **Fencing Tokens**: Use monotonically increasing tokens
- **Lease-based**: Time-bound lock ownership
- **External Coordination**: Use external coordinator service

## Leader Election

### Election Algorithms

#### Bully Algorithm

**Process:**

1. Node detects leader failure
2. Send election message to higher-ID nodes
3. If no response, declare itself leader
4. If response received, wait for victory message
5. New leader sends victory message to all nodes

**Characteristics:**

- **Assumption**: Nodes have unique IDs
- **Complexity**: O(n²) messages in worst case
- **Use Cases**: Small clusters with stable membership

#### Ring Algorithm

**Process:**

1. Node starts election by sending message around ring
2. Each node adds its ID to message
3. Message returns to initiator with all active IDs
4. Node with highest ID becomes leader
5. Leader announcement sent around ring

**Characteristics:**

- **Topology**: Logical ring structure required
- **Complexity**: O(n) messages per election
- **Use Cases**: Systems with ring topology

#### ZooKeeper-based Election

**Process:**

1. Create ephemeral sequential node in election directory
2. Get list of all election nodes
3. If created node has lowest sequence number, become leader
4. Otherwise, watch the next lower numbered node
5. When watched node is deleted, check if now leader

**Advantages:**

- **Fault Tolerance**: Handles node failures gracefully
- **Fairness**: FIFO ordering of leadership candidates
- **Scalability**: Efficient for large clusters

### Leader Responsibilities

#### Coordination Tasks

- **Work Distribution**: Assign tasks to follower nodes
- **State Synchronization**: Maintain consistent state across cluster
- **Conflict Resolution**: Resolve conflicts between nodes
- **Resource Management**: Allocate shared resources

#### Health Monitoring

- **Heartbeat**: Send periodic heartbeats to followers
- **Failure Detection**: Monitor follower node health
- **Cluster Membership**: Maintain list of active nodes
- **Split-brain Prevention**: Ensure single leader per partition

### Lease-based Leadership

#### Lease Mechanism

- **Time-bound Leadership**: Leadership expires after lease period
- **Renewal**: Leader must renew lease before expiration
- **Automatic Failover**: New election if lease not renewed
- **Clock Synchronization**: Requires synchronized clocks

#### Implementation Considerations

- **Lease Duration**: Balance between failover speed and stability
- **Renewal Frequency**: Prevent false leader failures
- **Clock Skew**: Account for clock differences between nodes
- **Network Partitions**: Handle partition scenarios gracefully

## Coordination Patterns

### Barriers and Synchronization

#### Distributed Barriers

**Purpose**: Synchronize distributed processes at specific points

**Implementation:**

1. Processes register at barrier
2. Wait until all expected processes arrive
3. Release all processes simultaneously
4. Clean up barrier state

**Use Cases:**

- **Batch Processing**: Synchronize job phases
- **Map-Reduce**: Coordinate map and reduce phases
- **Distributed Testing**: Synchronize test execution

#### Rendezvous Points

**Purpose**: Coordinate meeting of distributed processes

**Patterns:**

- **Publisher-Subscriber**: Message passing coordination
- **Request-Response**: Synchronous communication
- **Group Communication**: Multi-party coordination

### Configuration Management

#### Dynamic Configuration

**Requirements:**

- **Real-time Updates**: Configuration changes without restarts
- **Consistency**: Same configuration across all nodes
- **Rollback**: Ability to revert configuration changes
- **Validation**: Ensure configuration correctness

**Implementation Patterns:**

- **Pull Model**: Nodes periodically fetch configuration
- **Push Model**: Configuration pushed to nodes
- **Hybrid Model**: Combination of pull and push

#### Configuration Versioning

- **Version Numbers**: Track configuration changes
- **Atomic Updates**: All-or-nothing configuration changes
- **Staged Rollouts**: Gradual configuration deployment
- **A/B Testing**: Test configuration changes on subset

### Service Discovery

#### Registration Patterns

- **Self-Registration**: Services register themselves
- **Third-party Registration**: External agent registers services
- **Sidecar Registration**: Sidecar proxy handles registration

#### Discovery Patterns

- **Client-side Discovery**: Client queries registry directly
- **Server-side Discovery**: Load balancer queries registry
- **Service Mesh**: Proxy handles discovery and routing

#### Health Checking

- **Active Checks**: Registry actively checks service health
- **Passive Checks**: Services report their own health
- **Synthetic Monitoring**: External health validation

## Best Practices

### Consensus Implementation

- **Understand Trade-offs**: Choose appropriate consensus algorithm
- **Handle Partitions**: Design for network partition scenarios
- **Monitor Performance**: Track consensus latency and throughput
- **Test Failures**: Regularly test failure scenarios

### Coordination Design

- **Minimize Coordination**: Reduce distributed coordination needs
- **Async Where Possible**: Use asynchronous patterns when feasible
- **Timeout Handling**: Set appropriate timeouts for coordination
- **Failure Recovery**: Design robust failure recovery mechanisms

### Lock Management

- **Short Lock Duration**: Minimize lock hold times
- **Deadlock Prevention**: Implement deadlock prevention strategies
- **Lock Granularity**: Choose appropriate lock granularity
- **Alternative Approaches**: Consider lock-free algorithms when possible

### Operational Excellence

- **Monitoring**: Comprehensive monitoring of coordination services
- **Alerting**: Alert on coordination service failures
- **Documentation**: Document coordination patterns and procedures
- **Testing**: Regular testing of coordination mechanisms
