# Data Consistency in Distributed Systems

## Overview

Data consistency in distributed systems refers to maintaining uniform data across multiple nodes, ensuring all participants see the same data at the same time. This is challenging due to network partitions, failures, and the trade-offs between consistency, availability, and partition tolerance (CAP theorem).

## CAP Theorem

### Core Principles

The CAP theorem states that distributed systems can guarantee at most two of three properties:

#### Consistency (C)

- All nodes see the same data simultaneously
- Every read receives the most recent write
- Strong consistency guarantees data correctness

#### Availability (A)

- System remains operational and responsive
- Every request receives a response (success or failure)
- No single point of failure affects system availability

#### Partition Tolerance (P)

- System continues operating despite network failures
- Communication between nodes may be lost
- Essential for distributed systems

### CAP Trade-offs

#### CP Systems (Consistency + Partition Tolerance)

```
Examples: HBase, MongoDB (with strong consistency), Redis Cluster
Trade-off: Sacrifice availability during network partitions
Use Case: Financial systems, inventory management
```

#### AP Systems (Availability + Partition Tolerance)

```
Examples: Cassandra, DynamoDB, CouchDB
Trade-off: Sacrifice strong consistency for availability
Use Case: Social media, content delivery, analytics
```

#### CA Systems (Consistency + Availability)

```
Examples: Traditional RDBMS in single-node deployments
Limitation: Cannot handle network partitions
Use Case: Single-datacenter applications
```

## Consistency Models

### Strong Consistency

#### Linearizability

```javascript
// Linearizable system guarantees operations appear instantaneous
class LinearizableStore {
  constructor() {
    this.data = new Map();
    this.clock = 0;
  }

  async write(key, value) {
    const timestamp = ++this.clock;

    // Synchronously replicate to all nodes
    await this.replicateToAll(key, value, timestamp);

    this.data.set(key, { value, timestamp });
    return { success: true, timestamp };
  }

  async read(key) {
    // Always return most recent value
    const entry = this.data.get(key);
    return entry ? entry.value : null;
  }

  async replicateToAll(key, value, timestamp) {
    const replicas = this.getActiveReplicas();
    const promises = replicas.map((replica) =>
      replica.write(key, value, timestamp)
    );

    // Wait for all replicas to acknowledge
    await Promise.all(promises);
  }
}
```

#### Sequential Consistency

```javascript
// Operations appear to execute in some sequential order
class SequentialStore {
  constructor() {
    this.data = new Map();
    this.operationQueue = [];
    this.processing = false;
  }

  async write(key, value) {
    return new Promise((resolve, reject) => {
      this.operationQueue.push({
        type: "write",
        key,
        value,
        resolve,
        reject,
        timestamp: Date.now(),
      });

      this.processQueue();
    });
  }

  async processQueue() {
    if (this.processing) return;
    this.processing = true;

    while (this.operationQueue.length > 0) {
      const operation = this.operationQueue.shift();

      try {
        if (operation.type === "write") {
          await this.performWrite(operation.key, operation.value);
          operation.resolve({ success: true });
        }
      } catch (error) {
        operation.reject(error);
      }
    }

    this.processing = false;
  }
}
```

### Eventual Consistency

#### Basic Eventual Consistency

```javascript
class EventuallyConsistentStore {
  constructor(nodeId, peers = []) {
    this.nodeId = nodeId;
    this.peers = peers;
    this.data = new Map();
    this.vectorClock = new VectorClock(nodeId);
    this.syncInterval = 5000; // 5 seconds

    this.startSyncProcess();
  }

  async write(key, value) {
    // Write locally first
    this.vectorClock.increment();
    const timestamp = this.vectorClock.copy();

    this.data.set(key, {
      value,
      timestamp,
      nodeId: this.nodeId,
    });

    // Asynchronously propagate to peers
    this.propagateAsync(key, value, timestamp);

    return { success: true, timestamp };
  }

  async read(key) {
    const entry = this.data.get(key);
    return entry ? entry.value : null;
  }

  async propagateAsync(key, value, timestamp) {
    const promises = this.peers.map((peer) => {
      return this.sendToPeer(peer, {
        type: "update",
        key,
        value,
        timestamp,
        sourceNode: this.nodeId,
      }).catch((error) => {
        console.warn(`Failed to propagate to peer ${peer.id}:`, error);
      });
    });

    // Don't wait for all peers
    Promise.allSettled(promises);
  }

  async receiveUpdate(update) {
    const { key, value, timestamp, sourceNode } = update;
    const currentEntry = this.data.get(key);

    // Apply if newer or concurrent
    if (
      !currentEntry ||
      this.shouldApplyUpdate(currentEntry.timestamp, timestamp)
    ) {
      this.data.set(key, {
        value,
        timestamp,
        nodeId: sourceNode,
      });
    }
  }

  shouldApplyUpdate(currentTimestamp, newTimestamp) {
    return (
      newTimestamp.isAfter(currentTimestamp) ||
      newTimestamp.isConcurrent(currentTimestamp)
    );
  }
}
```

#### Causal Consistency

```javascript
class CausallyConsistentStore {
  constructor(nodeId) {
    this.nodeId = nodeId;
    this.data = new Map();
    this.causalHistory = new Map(); // key -> set of causally related operations
    this.vectorClock = new VectorClock(nodeId);
  }

  async write(key, value, dependencies = []) {
    this.vectorClock.increment();
    const timestamp = this.vectorClock.copy();

    // Track causal dependencies
    const causalDeps = new Set(dependencies);
    const existingEntry = this.data.get(key);
    if (existingEntry) {
      causalDeps.add(existingEntry.timestamp);
    }

    this.data.set(key, {
      value,
      timestamp,
      dependencies: Array.from(causalDeps),
    });

    this.causalHistory.set(key, causalDeps);

    return { success: true, timestamp };
  }

  async read(key) {
    const entry = this.data.get(key);
    return entry
      ? {
          value: entry.value,
          dependencies: entry.dependencies,
        }
      : null;
  }

  canApplyUpdate(update) {
    // Check if all causal dependencies are satisfied
    for (const dep of update.dependencies) {
      if (!this.hasDependency(dep)) {
        return false;
      }
    }
    return true;
  }
}
```

## Consensus Algorithms

### Raft Consensus

#### Leader Election

```javascript
class RaftNode {
  constructor(nodeId, peers) {
    this.nodeId = nodeId;
    this.peers = peers;
    this.state = "FOLLOWER"; // FOLLOWER, CANDIDATE, LEADER
    this.currentTerm = 0;
    this.votedFor = null;
    this.log = [];
    this.commitIndex = 0;
    this.lastApplied = 0;

    this.electionTimeout = this.randomElectionTimeout();
    this.heartbeatInterval = 50; // ms

    this.startElectionTimer();
  }

  async startElection() {
    this.state = "CANDIDATE";
    this.currentTerm++;
    this.votedFor = this.nodeId;
    this.electionTimeout = this.randomElectionTimeout();

    console.log(
      `Node ${this.nodeId} starting election for term ${this.currentTerm}`
    );

    const votes = [this.nodeId]; // Vote for self

    // Request votes from peers
    const votePromises = this.peers.map((peer) =>
      this.requestVote(peer).catch(() => null)
    );

    const voteResponses = await Promise.allSettled(votePromises);

    voteResponses.forEach((response, index) => {
      if (response.status === "fulfilled" && response.value?.voteGranted) {
        votes.push(this.peers[index].nodeId);
      }
    });

    // Check if won election
    if (votes.length > Math.floor((this.peers.length + 1) / 2)) {
      this.becomeLeader();
    } else {
      this.becomeFollower();
    }
  }

  async requestVote(peer) {
    const request = {
      term: this.currentTerm,
      candidateId: this.nodeId,
      lastLogIndex: this.log.length - 1,
      lastLogTerm: this.log.length > 0 ? this.log[this.log.length - 1].term : 0,
    };

    const response = await peer.sendVoteRequest(request);

    if (response.term > this.currentTerm) {
      this.currentTerm = response.term;
      this.votedFor = null;
      this.becomeFollower();
    }

    return response;
  }

  becomeLeader() {
    console.log(
      `Node ${this.nodeId} became leader for term ${this.currentTerm}`
    );
    this.state = "LEADER";
    this.startHeartbeat();
  }

  startHeartbeat() {
    if (this.state !== "LEADER") return;

    setInterval(() => {
      if (this.state === "LEADER") {
        this.sendHeartbeat();
      }
    }, this.heartbeatInterval);
  }
}
```

#### Log Replication

```javascript
class RaftLogReplication extends RaftNode {
  async appendEntries(entries) {
    if (this.state !== "LEADER") {
      throw new Error("Only leader can append entries");
    }

    // Add entries to local log
    entries.forEach((entry) => {
      this.log.push({
        ...entry,
        term: this.currentTerm,
        index: this.log.length,
      });
    });

    // Replicate to followers
    const replicationPromises = this.peers.map((peer) =>
      this.replicateToFollower(peer)
    );

    const results = await Promise.allSettled(replicationPromises);

    // Count successful replications
    let successCount = 1; // Leader counts as success
    results.forEach((result) => {
      if (result.status === "fulfilled" && result.value.success) {
        successCount++;
      }
    });

    // Commit if majority replicated
    if (successCount > Math.floor((this.peers.length + 1) / 2)) {
      this.commitIndex = this.log.length - 1;
      this.applyCommittedEntries();
      return { success: true, committed: true };
    }

    return { success: true, committed: false };
  }

  async replicateToFollower(follower) {
    const nextIndex = follower.nextIndex || 0;
    const prevLogIndex = nextIndex - 1;
    const prevLogTerm = prevLogIndex >= 0 ? this.log[prevLogIndex].term : 0;

    const request = {
      term: this.currentTerm,
      leaderId: this.nodeId,
      prevLogIndex,
      prevLogTerm,
      entries: this.log.slice(nextIndex),
      leaderCommit: this.commitIndex,
    };

    const response = await follower.sendAppendEntries(request);

    if (response.success) {
      follower.nextIndex = this.log.length;
      follower.matchIndex = this.log.length - 1;
    } else {
      // Decrement nextIndex and retry
      follower.nextIndex = Math.max(0, follower.nextIndex - 1);
    }

    return response;
  }
}
```

### Practical Byzantine Fault Tolerance (PBFT)

```javascript
class PBFTNode {
  constructor(nodeId, nodes) {
    this.nodeId = nodeId;
    this.nodes = nodes;
    this.view = 0;
    this.sequenceNumber = 0;
    this.state = "NORMAL";

    this.messageLog = new Map();
    this.preparedMessages = new Map();
    this.committedMessages = new Map();
  }

  async processRequest(request) {
    if (!this.isPrimary()) {
      throw new Error("Only primary can process requests");
    }

    const sequenceNumber = ++this.sequenceNumber;
    const message = {
      view: this.view,
      sequenceNumber,
      request,
      timestamp: Date.now(),
    };

    // Phase 1: Pre-prepare
    await this.broadcast("PRE_PREPARE", message);

    return sequenceNumber;
  }

  async handlePrePrepare(message) {
    if (this.isPrimary()) return; // Primary doesn't handle its own pre-prepare

    // Validate message
    if (!this.validateMessage(message)) {
      return;
    }

    // Store message
    this.messageLog.set(message.sequenceNumber, message);

    // Phase 2: Prepare
    await this.broadcast("PREPARE", {
      view: this.view,
      sequenceNumber: message.sequenceNumber,
      digest: this.computeDigest(message),
    });
  }

  async handlePrepare(prepareMessage) {
    const { sequenceNumber, digest } = prepareMessage;

    if (!this.preparedMessages.has(sequenceNumber)) {
      this.preparedMessages.set(sequenceNumber, new Set());
    }

    this.preparedMessages.get(sequenceNumber).add(prepareMessage.nodeId);

    // Check if we have enough prepare messages (2f + 1)
    const requiredPrepares = 2 * this.getFaultTolerance() + 1;
    if (this.preparedMessages.get(sequenceNumber).size >= requiredPrepares) {
      // Phase 3: Commit
      await this.broadcast("COMMIT", {
        view: this.view,
        sequenceNumber,
        digest,
      });
    }
  }

  async handleCommit(commitMessage) {
    const { sequenceNumber } = commitMessage;

    if (!this.committedMessages.has(sequenceNumber)) {
      this.committedMessages.set(sequenceNumber, new Set());
    }

    this.committedMessages.get(sequenceNumber).add(commitMessage.nodeId);

    // Check if we have enough commit messages
    const requiredCommits = 2 * this.getFaultTolerance() + 1;
    if (this.committedMessages.get(sequenceNumber).size >= requiredCommits) {
      // Execute the request
      const message = this.messageLog.get(sequenceNumber);
      await this.executeRequest(message.request);
    }
  }

  getFaultTolerance() {
    return Math.floor((this.nodes.length - 1) / 3);
  }
}
```

## Conflict Resolution Strategies

### Last-Writer-Wins (LWW)

```javascript
class LWWRegister {
  constructor() {
    this.value = null;
    this.timestamp = 0;
    this.nodeId = null;
  }

  write(value, timestamp, nodeId) {
    if (
      timestamp > this.timestamp ||
      (timestamp === this.timestamp && nodeId > this.nodeId)
    ) {
      this.value = value;
      this.timestamp = timestamp;
      this.nodeId = nodeId;
      return true;
    }
    return false;
  }

  read() {
    return {
      value: this.value,
      timestamp: this.timestamp,
      nodeId: this.nodeId,
    };
  }

  merge(other) {
    if (
      other.timestamp > this.timestamp ||
      (other.timestamp === this.timestamp && other.nodeId > this.nodeId)
    ) {
      this.value = other.value;
      this.timestamp = other.timestamp;
      this.nodeId = other.nodeId;
    }
  }
}
```

### Multi-Value Register (MVR)

```javascript
class MultiValueRegister {
  constructor() {
    this.values = new Map(); // timestamp -> {value, nodeId}
    this.vectorClock = new VectorClock();
  }

  write(value, nodeId) {
    this.vectorClock.increment(nodeId);
    const timestamp = this.vectorClock.copy();

    // Remove dominated values
    const newValues = new Map();
    let dominated = false;

    for (const [ts, entry] of this.values) {
      if (timestamp.dominates(ts)) {
        // New value dominates existing value, remove it
        continue;
      } else if (ts.dominates(timestamp)) {
        // Existing value dominates new value
        dominated = true;
      }
      newValues.set(ts, entry);
    }

    if (!dominated) {
      newValues.set(timestamp, { value, nodeId });
    }

    this.values = newValues;
    return timestamp;
  }

  read() {
    // Return all concurrent values
    return Array.from(this.values.values()).map((entry) => entry.value);
  }

  merge(other) {
    const mergedValues = new Map(this.values);

    for (const [timestamp, entry] of other.values) {
      let shouldAdd = true;
      const toRemove = [];

      for (const [existingTs, existingEntry] of mergedValues) {
        if (timestamp.dominates(existingTs)) {
          toRemove.push(existingTs);
        } else if (existingTs.dominates(timestamp)) {
          shouldAdd = false;
          break;
        }
      }

      if (shouldAdd) {
        toRemove.forEach((ts) => mergedValues.delete(ts));
        mergedValues.set(timestamp, entry);
      }
    }

    this.values = mergedValues;
  }
}
```

### Operational Transformation (OT)

```javascript
class OperationalTransform {
  constructor() {
    this.document = "";
    this.operations = [];
    this.state = new Map(); // nodeId -> operation count
  }

  generateOperation(type, position, content, nodeId) {
    const operation = {
      id: this.generateOperationId(nodeId),
      type, // 'insert' or 'delete'
      position,
      content,
      nodeId,
      timestamp: Date.now(),
      dependencies: new Map(this.state),
    };

    this.state.set(nodeId, (this.state.get(nodeId) || 0) + 1);
    return operation;
  }

  applyOperation(operation) {
    // Transform operation against all operations since its dependencies
    const transformedOp = this.transformOperation(operation);

    if (transformedOp.type === "insert") {
      this.document =
        this.document.slice(0, transformedOp.position) +
        transformedOp.content +
        this.document.slice(transformedOp.position);
    } else if (transformedOp.type === "delete") {
      this.document =
        this.document.slice(0, transformedOp.position) +
        this.document.slice(transformedOp.position + transformedOp.length);
    }

    this.operations.push(transformedOp);
    return transformedOp;
  }

  transformOperation(operation) {
    let transformedOp = { ...operation };

    // Find operations that need to be transformed against
    const operationsToTransform = this.operations.filter((op) =>
      this.shouldTransform(operation, op)
    );

    // Apply transformations
    for (const op of operationsToTransform) {
      transformedOp = this.transform(transformedOp, op);
    }

    return transformedOp;
  }

  transform(op1, op2) {
    if (op1.type === "insert" && op2.type === "insert") {
      if (op2.position <= op1.position) {
        return {
          ...op1,
          position: op1.position + op2.content.length,
        };
      }
    } else if (op1.type === "insert" && op2.type === "delete") {
      if (op2.position < op1.position) {
        return {
          ...op1,
          position: op1.position - op2.length,
        };
      }
    } else if (op1.type === "delete" && op2.type === "insert") {
      if (op2.position <= op1.position) {
        return {
          ...op1,
          position: op1.position + op2.content.length,
        };
      }
    } else if (op1.type === "delete" && op2.type === "delete") {
      if (op2.position < op1.position) {
        return {
          ...op1,
          position: op1.position - op2.length,
        };
      }
    }

    return op1;
  }
}
```

## Vector Clocks

### Implementation

```javascript
class VectorClock {
  constructor(nodeId, initialClock = {}) {
    this.nodeId = nodeId;
    this.clock = new Map(Object.entries(initialClock));
    if (!this.clock.has(nodeId)) {
      this.clock.set(nodeId, 0);
    }
  }

  increment(nodeId = this.nodeId) {
    const current = this.clock.get(nodeId) || 0;
    this.clock.set(nodeId, current + 1);
  }

  update(otherClock) {
    for (const [nodeId, timestamp] of otherClock.clock) {
      const current = this.clock.get(nodeId) || 0;
      this.clock.set(nodeId, Math.max(current, timestamp));
    }
    this.increment();
  }

  compare(other) {
    const allNodes = new Set([...this.clock.keys(), ...other.clock.keys()]);

    let thisGreater = false;
    let otherGreater = false;

    for (const nodeId of allNodes) {
      const thisValue = this.clock.get(nodeId) || 0;
      const otherValue = other.clock.get(nodeId) || 0;

      if (thisValue > otherValue) {
        thisGreater = true;
      } else if (otherValue > thisValue) {
        otherGreater = true;
      }
    }

    if (thisGreater && !otherGreater) return 1; // this > other
    if (otherGreater && !thisGreater) return -1; // this < other
    if (!thisGreater && !otherGreater) return 0; // this == other
    return null; // concurrent
  }

  dominates(other) {
    return this.compare(other) === 1;
  }

  isConcurrent(other) {
    return this.compare(other) === null;
  }

  copy() {
    return new VectorClock(this.nodeId, Object.fromEntries(this.clock));
  }

  toString() {
    const clockObj = Object.fromEntries(this.clock);
    return JSON.stringify(clockObj);
  }
}
```

## Consistency Patterns in Practice

### Read Repair

```javascript
class ReadRepairStore {
  constructor(replicas, readQuorum = 2, writeQuorum = 2) {
    this.replicas = replicas;
    this.readQuorum = readQuorum;
    this.writeQuorum = writeQuorum;
  }

  async read(key) {
    // Read from multiple replicas
    const readPromises = this.replicas
      .slice(0, this.readQuorum)
      .map((replica) => replica.read(key).catch((error) => ({ error })));

    const responses = await Promise.all(readPromises);
    const validResponses = responses.filter((r) => !r.error);

    if (validResponses.length === 0) {
      throw new Error("All read replicas failed");
    }

    // Find the most recent value
    const mostRecent = validResponses.reduce((latest, current) => {
      if (!latest || current.timestamp > latest.timestamp) {
        return current;
      }
      return latest;
    });

    // Perform read repair in background
    this.performReadRepair(key, mostRecent, validResponses);

    return mostRecent.value;
  }

  async performReadRepair(key, latestValue, responses) {
    const staleReplicas = [];

    responses.forEach((response, index) => {
      if (response.timestamp < latestValue.timestamp) {
        staleReplicas.push(this.replicas[index]);
      }
    });

    // Update stale replicas asynchronously
    const repairPromises = staleReplicas.map((replica) =>
      replica
        .write(key, latestValue.value, latestValue.timestamp)
        .catch((error) => console.warn("Read repair failed:", error))
    );

    Promise.all(repairPromises);
  }
}
```

### Hinted Handoff

```javascript
class HintedHandoffStore {
  constructor(replicas, hints = new Map()) {
    this.replicas = replicas;
    this.hints = hints; // nodeId -> [{key, value, timestamp, originalReplica}]
    this.hintedHandoffInterval = 10000; // 10 seconds

    this.startHintedHandoffProcess();
  }

  async write(key, value) {
    const timestamp = Date.now();
    const targetReplicas = this.getReplicasForKey(key);
    const promises = [];

    targetReplicas.forEach((replica) => {
      if (replica.isAvailable()) {
        promises.push(replica.write(key, value, timestamp));
      } else {
        // Store hint for unavailable replica
        this.storeHint(replica.id, {
          key,
          value,
          timestamp,
          originalReplica: replica.id,
        });
      }
    });

    const results = await Promise.allSettled(promises);
    const successCount = results.filter((r) => r.status === "fulfilled").length;

    if (successCount >= this.writeQuorum) {
      return { success: true, timestamp };
    } else {
      throw new Error("Write quorum not achieved");
    }
  }

  storeHint(nodeId, hint) {
    if (!this.hints.has(nodeId)) {
      this.hints.set(nodeId, []);
    }
    this.hints.get(nodeId).push(hint);
  }

  startHintedHandoffProcess() {
    setInterval(() => {
      this.processHints();
    }, this.hintedHandoffInterval);
  }

  async processHints() {
    for (const [nodeId, hints] of this.hints) {
      const replica = this.getReplica(nodeId);

      if (replica && replica.isAvailable()) {
        const hintsToProcess = [...hints];
        this.hints.delete(nodeId);

        // Send hints to recovered replica
        const promises = hintsToProcess.map((hint) =>
          replica.write(hint.key, hint.value, hint.timestamp).catch((error) => {
            console.warn(`Failed to handoff hint to ${nodeId}:`, error);
            // Re-store failed hints
            this.storeHint(nodeId, hint);
          })
        );

        await Promise.allSettled(promises);
      }
    }
  }
}
```

## Best Practices

### Designing for Consistency

1. **Choose Appropriate Consistency Level**

   - Strong consistency for financial transactions
   - Eventual consistency for social media feeds
   - Causal consistency for collaborative editing

2. **Implement Proper Conflict Resolution**

   - Use vector clocks for concurrent detection
   - Implement application-specific merge functions
   - Provide user conflict resolution interfaces

3. **Monitor Consistency Metrics**
   - Track read/write latencies
   - Monitor replica lag
   - Alert on consistency violations

### Common Pitfalls

1. **Ignoring Network Partitions**

   - Always design for partition tolerance
   - Implement proper failure detection
   - Have clear partition handling strategies

2. **Over-Engineering Consistency**

   - Don't use strong consistency everywhere
   - Consider business requirements
   - Balance consistency with performance

3. **Poor Conflict Resolution**
   - Avoid simple last-writer-wins for complex data
   - Implement proper merge semantics
   - Test conflict scenarios thoroughly

## Conclusion

Data consistency in distributed systems requires careful consideration of trade-offs between consistency, availability, and partition tolerance. Key principles include:

1. **Understand CAP Theorem**: Choose the right trade-offs for your use case
2. **Select Appropriate Consistency Models**: Match consistency requirements to business needs
3. **Implement Proper Conflict Resolution**: Handle concurrent updates gracefully
4. **Use Consensus When Needed**: Implement strong consistency where required
5. **Monitor and Test**: Continuously verify consistency guarantees

The choice of consistency model significantly impacts system architecture, performance, and complexity. Start with simpler models and evolve based on requirements and operational experience.
