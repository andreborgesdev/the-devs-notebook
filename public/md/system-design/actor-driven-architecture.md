# Actor-Driven Architecture

## Overview

The Actor Model is a concurrent computation model where "actors" are fundamental units of computation that encapsulate state and behavior. This architecture pattern is designed to handle massive concurrency and provide fault tolerance in distributed systems.

## Core Principles

### Isolated State

Each actor maintains its own private state that cannot be accessed directly by other actors. This eliminates the need for locks and prevents race conditions.

### Message Passing

Actors communicate exclusively through asynchronous message passing. Messages are immutable and are processed one at a time by each actor.

### Location Transparency

Actors can be distributed across multiple machines and networks. The location of an actor is transparent to other actors sending messages to it.

### Fault Isolation

Actor failures don't affect other actors. Failed actors can be restarted by supervisor actors without impacting the rest of the system.

## Actor Model Components

### Actor

```typescript
interface Actor {
  receive(message: Message): void;
  send(target: ActorRef, message: Message): void;
  spawn(actorClass: ActorConstructor): ActorRef;
  stop(): void;
}

interface Message {
  type: string;
  data?: any;
  sender?: ActorRef;
}

interface ActorRef {
  path: string;
  send(message: Message): void;
}
```

### Basic Actor Implementation

```typescript
abstract class BaseActor implements Actor {
  protected children: Map<string, ActorRef> = new Map();
  protected parent?: ActorRef;

  abstract receive(message: Message): void;

  send(target: ActorRef, message: Message): void {
    target.send({
      ...message,
      sender: this.getSelf(),
    });
  }

  spawn(actorClass: ActorConstructor, name?: string): ActorRef {
    const actor = new actorClass();
    const ref = new ActorRefImpl(actor, this.generatePath(name));
    this.children.set(name || ref.path, ref);
    return ref;
  }

  stop(): void {
    this.children.forEach((child) => child.stop());
    this.children.clear();
  }

  private getSelf(): ActorRef {
    return new ActorRefImpl(this, this.getPath());
  }
}
```

### User Management Actor Example

```typescript
interface UserState {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
}

class UserActor extends BaseActor {
  private state: UserState;

  constructor(userId: string) {
    super();
    this.state = {
      id: userId,
      name: "",
      email: "",
      status: "inactive",
    };
  }

  receive(message: Message): void {
    switch (message.type) {
      case "UPDATE_PROFILE":
        this.updateProfile(message.data);
        break;

      case "GET_PROFILE":
        this.sendProfile(message.sender!);
        break;

      case "ACTIVATE_USER":
        this.activateUser();
        break;

      case "DEACTIVATE_USER":
        this.deactivateUser();
        break;

      default:
        console.warn(`Unknown message type: ${message.type}`);
    }
  }

  private updateProfile(profileData: Partial<UserState>): void {
    this.state = { ...this.state, ...profileData };
    console.log(`User ${this.state.id} profile updated`);
  }

  private sendProfile(sender: ActorRef): void {
    sender.send({
      type: "PROFILE_RESPONSE",
      data: { ...this.state },
    });
  }

  private activateUser(): void {
    this.state.status = "active";
    console.log(`User ${this.state.id} activated`);
  }

  private deactivateUser(): void {
    this.state.status = "inactive";
    console.log(`User ${this.state.id} deactivated`);
  }
}
```

## Supervisor Hierarchies

### Supervisor Actor

```typescript
interface SupervisionStrategy {
  handleFailure(child: ActorRef, error: Error): "restart" | "stop" | "escalate";
}

class OneForOneStrategy implements SupervisionStrategy {
  handleFailure(
    child: ActorRef,
    error: Error
  ): "restart" | "stop" | "escalate" {
    if (error instanceof ValidationError) {
      return "restart";
    }
    if (error instanceof CriticalError) {
      return "escalate";
    }
    return "stop";
  }
}

class SupervisorActor extends BaseActor {
  private supervisionStrategy: SupervisionStrategy;

  constructor(strategy: SupervisionStrategy = new OneForOneStrategy()) {
    super();
    this.supervisionStrategy = strategy;
  }

  receive(message: Message): void {
    switch (message.type) {
      case "CHILD_FAILED":
        this.handleChildFailure(message.data.child, message.data.error);
        break;

      case "SPAWN_CHILD":
        this.spawnChild(message.data.actorClass, message.data.name);
        break;

      default:
        this.routeMessage(message);
    }
  }

  private handleChildFailure(child: ActorRef, error: Error): void {
    const action = this.supervisionStrategy.handleFailure(child, error);

    switch (action) {
      case "restart":
        this.restartChild(child);
        break;
      case "stop":
        this.stopChild(child);
        break;
      case "escalate":
        this.escalateFailure(error);
        break;
    }
  }

  private restartChild(child: ActorRef): void {
    child.stop();
    // Respawn child actor
    console.log(`Restarting child actor: ${child.path}`);
  }

  private routeMessage(message: Message): void {
    // Route messages to appropriate child actors
    const targetChild = this.findTargetChild(message);
    if (targetChild) {
      targetChild.send(message);
    }
  }
}
```

## Distributed Actor Systems

### Remote Actor Communication

```typescript
interface RemoteActorSystem {
  deployActor(actorClass: ActorConstructor, nodeId: string): Promise<ActorRef>;
  getRemoteActor(actorPath: string): Promise<ActorRef>;
  sendToRemote(actorPath: string, message: Message): Promise<void>;
}

class DistributedActorSystem implements RemoteActorSystem {
  private nodes: Map<string, ActorNode> = new Map();
  private localActors: Map<string, Actor> = new Map();

  async deployActor(
    actorClass: ActorConstructor,
    nodeId: string
  ): Promise<ActorRef> {
    const node = this.nodes.get(nodeId);
    if (!node) {
      throw new Error(`Node ${nodeId} not found`);
    }

    return await node.deployActor(actorClass);
  }

  async getRemoteActor(actorPath: string): Promise<ActorRef> {
    const [nodeId, localPath] = this.parseActorPath(actorPath);
    const node = this.nodes.get(nodeId);

    if (!node) {
      throw new Error(`Node ${nodeId} not available`);
    }

    return new RemoteActorRef(actorPath, node);
  }

  async sendToRemote(actorPath: string, message: Message): Promise<void> {
    const remoteActor = await this.getRemoteActor(actorPath);
    remoteActor.send(message);
  }
}
```

### Cluster Management

```typescript
interface ClusterManager {
  joinCluster(nodeId: string): Promise<void>;
  leaveCluster(nodeId: string): Promise<void>;
  getClusterState(): ClusterState;
  handleNodeFailure(nodeId: string): Promise<void>;
}

interface ClusterState {
  nodes: ClusterNode[];
  leader: string;
  partitions: Partition[];
}

interface ClusterNode {
  id: string;
  address: string;
  status: "up" | "down" | "unreachable";
  roles: string[];
}

class ActorClusterManager implements ClusterManager {
  private clusterState: ClusterState;
  private failureDetector: FailureDetector;

  async joinCluster(nodeId: string): Promise<void> {
    const node: ClusterNode = {
      id: nodeId,
      address: this.getNodeAddress(nodeId),
      status: "up",
      roles: ["worker"],
    };

    this.clusterState.nodes.push(node);
    await this.broadcastClusterChange("NODE_JOINED", node);
  }

  async handleNodeFailure(nodeId: string): Promise<void> {
    const node = this.clusterState.nodes.find((n) => n.id === nodeId);
    if (node) {
      node.status = "down";
      await this.redistributeActors(nodeId);
      await this.broadcastClusterChange("NODE_FAILED", node);
    }
  }

  private async redistributeActors(failedNodeId: string): Promise<void> {
    const actorsToRedistribute = await this.getActorsOnNode(failedNodeId);

    for (const actor of actorsToRedistribute) {
      const targetNode = this.selectTargetNode();
      await this.migrateActor(actor, targetNode);
    }
  }
}
```

## Message Patterns

### Request-Response Pattern

```typescript
class RequestResponseActor extends BaseActor {
  private pendingRequests: Map<string, ActorRef> = new Map();

  receive(message: Message): void {
    switch (message.type) {
      case "REQUEST":
        this.handleRequest(message);
        break;
      case "RESPONSE":
        this.handleResponse(message);
        break;
    }
  }

  private handleRequest(message: Message): void {
    const requestId = this.generateRequestId();
    this.pendingRequests.set(requestId, message.sender!);

    // Process request asynchronously
    this.processRequest(message.data)
      .then((result) => {
        this.send(message.sender!, {
          type: "RESPONSE",
          data: { requestId, result },
        });
      })
      .catch((error) => {
        this.send(message.sender!, {
          type: "ERROR",
          data: { requestId, error: error.message },
        });
      });
  }

  private async processRequest(data: any): Promise<any> {
    // Implement request processing logic
    return { processed: true, data };
  }
}
```

### Publish-Subscribe Pattern

```typescript
class EventBusActor extends BaseActor {
  private subscribers: Map<string, Set<ActorRef>> = new Map();

  receive(message: Message): void {
    switch (message.type) {
      case "SUBSCRIBE":
        this.subscribe(message.data.topic, message.sender!);
        break;
      case "UNSUBSCRIBE":
        this.unsubscribe(message.data.topic, message.sender!);
        break;
      case "PUBLISH":
        this.publish(message.data.topic, message.data.event);
        break;
    }
  }

  private subscribe(topic: string, subscriber: ActorRef): void {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, new Set());
    }
    this.subscribers.get(topic)!.add(subscriber);
  }

  private unsubscribe(topic: string, subscriber: ActorRef): void {
    const topicSubscribers = this.subscribers.get(topic);
    if (topicSubscribers) {
      topicSubscribers.delete(subscriber);
    }
  }

  private publish(topic: string, event: any): void {
    const subscribers = this.subscribers.get(topic);
    if (subscribers) {
      subscribers.forEach((subscriber) => {
        subscriber.send({
          type: "EVENT",
          data: { topic, event },
        });
      });
    }
  }
}
```

## Performance Considerations

### Message Throughput Optimization

```typescript
class HighThroughputActor extends BaseActor {
  private messageBuffer: Message[] = [];
  private batchSize = 100;
  private flushInterval = 10; // milliseconds

  receive(message: Message): void {
    this.messageBuffer.push(message);

    if (this.messageBuffer.length >= this.batchSize) {
      this.processBatch();
    }
  }

  private processBatch(): void {
    const batch = this.messageBuffer.splice(0, this.batchSize);

    // Process messages in batch for better performance
    batch.forEach((message) => this.processMessage(message));
  }

  private startFlushTimer(): void {
    setInterval(() => {
      if (this.messageBuffer.length > 0) {
        this.processBatch();
      }
    }, this.flushInterval);
  }
}
```

### Memory Management

```typescript
class MemoryEfficientActor extends BaseActor {
  private stateCache: LRUCache<string, any>;
  private maxCacheSize = 1000;

  constructor() {
    super();
    this.stateCache = new LRUCache(this.maxCacheSize);
  }

  receive(message: Message): void {
    switch (message.type) {
      case "GET_STATE":
        this.getState(message.data.key, message.sender!);
        break;
      case "SET_STATE":
        this.setState(message.data.key, message.data.value);
        break;
      case "CLEANUP":
        this.cleanup();
        break;
    }
  }

  private getState(key: string, sender: ActorRef): void {
    const value = this.stateCache.get(key);
    sender.send({
      type: "STATE_RESPONSE",
      data: { key, value },
    });
  }

  private setState(key: string, value: any): void {
    this.stateCache.set(key, value);
  }

  private cleanup(): void {
    this.stateCache.clear();
    // Perform garbage collection hints
    if (global.gc) {
      global.gc();
    }
  }
}
```

## Real-World Use Cases

### Financial Trading System

```typescript
class TradingActor extends BaseActor {
  private portfolio: Map<string, number> = new Map();
  private riskLimits: Map<string, number> = new Map();

  receive(message: Message): void {
    switch (message.type) {
      case "PLACE_ORDER":
        this.placeOrder(message.data);
        break;
      case "MARKET_DATA":
        this.processMarketData(message.data);
        break;
      case "RISK_CHECK":
        this.performRiskCheck(message.data);
        break;
    }
  }

  private placeOrder(orderData: any): void {
    const riskApproved = this.checkRiskLimits(orderData);

    if (riskApproved) {
      this.executeOrder(orderData);
    } else {
      this.rejectOrder(orderData, "Risk limits exceeded");
    }
  }

  private checkRiskLimits(order: any): boolean {
    const currentExposure = this.portfolio.get(order.symbol) || 0;
    const riskLimit = this.riskLimits.get(order.symbol) || 0;

    return Math.abs(currentExposure + order.quantity) <= riskLimit;
  }
}
```

### IoT Device Management

```typescript
class IoTDeviceActor extends BaseActor {
  private deviceState: DeviceState;
  private healthCheckInterval: NodeJS.Timeout;

  constructor(deviceId: string) {
    super();
    this.deviceState = {
      id: deviceId,
      status: "offline",
      lastSeen: new Date(),
      metrics: {},
    };

    this.startHealthCheck();
  }

  receive(message: Message): void {
    switch (message.type) {
      case "DEVICE_DATA":
        this.processDeviceData(message.data);
        break;
      case "COMMAND":
        this.executeCommand(message.data);
        break;
      case "HEALTH_CHECK":
        this.respondToHealthCheck(message.sender!);
        break;
    }
  }

  private processDeviceData(data: any): void {
    this.deviceState.lastSeen = new Date();
    this.deviceState.status = "online";
    this.deviceState.metrics = { ...data };

    // Publish metrics to monitoring system
    this.publishMetrics();
  }

  private startHealthCheck(): void {
    this.healthCheckInterval = setInterval(() => {
      const timeSinceLastSeen =
        Date.now() - this.deviceState.lastSeen.getTime();
      if (timeSinceLastSeen > 60000) {
        // 1 minute
        this.deviceState.status = "offline";
      }
    }, 30000); // Check every 30 seconds
  }
}
```

## Benefits

### Scalability

- **Horizontal Scaling**: Actors can be distributed across multiple machines
- **Elastic Scaling**: Add or remove actors based on demand
- **Load Distribution**: Messages naturally distribute load across actors

### Fault Tolerance

- **Isolation**: Actor failures don't cascade to other actors
- **Supervision**: Supervisor hierarchies manage actor lifecycle
- **Self-Healing**: Failed actors can be automatically restarted

### Concurrency

- **Lock-Free**: No shared mutable state eliminates need for locks
- **Parallel Processing**: Multiple actors can process messages simultaneously
- **Asynchronous**: Non-blocking message passing improves responsiveness

### Maintainability

- **Encapsulation**: Each actor encapsulates its state and behavior
- **Modularity**: Clear separation of concerns
- **Testability**: Actors can be easily unit tested in isolation

## Challenges and Considerations

### Message Ordering

- Messages between two actors are ordered, but global ordering is not guaranteed
- Use correlation IDs and sequence numbers when ordering is critical

### Debugging Complexity

- Distributed actor systems can be difficult to debug
- Implement comprehensive logging and tracing
- Use actor monitoring and visualization tools

### Memory Management

- Actors hold references to other actors, which can lead to memory leaks
- Implement proper cleanup and garbage collection strategies

### Network Partitions

- Remote actors may become unreachable due to network issues
- Implement retry mechanisms and circuit breakers
- Design for eventual consistency

## Technologies and Frameworks

### Akka (Scala/Java)

- Mature actor framework with clustering support
- Extensive ecosystem and tooling
- Production-ready with excellent performance

### Orleans (.NET)

- Microsoft's actor framework
- Virtual actors with automatic activation/deactivation
- Built-in persistence and state management

### Proto.Actor (Go/.NET/Java)

- Cross-platform actor framework
- High performance and low latency
- Inspired by Erlang/OTP and Akka

### Erlang/OTP

- Original actor model implementation
- "Let it crash" philosophy
- Excellent for telecommunications and distributed systems

## Best Practices

### Actor Design

- Keep actors lightweight and focused on single responsibility
- Avoid blocking operations in actor message handlers
- Use finite state machines for complex actor behavior

### Message Design

- Design immutable messages
- Keep messages small and focused
- Use strong typing for message contracts

### Supervision Strategy

- Design appropriate supervision hierarchies
- Choose the right supervision strategy for each use case
- Monitor actor health and performance

### Testing

- Test actors in isolation using mock message passing
- Test supervision behavior with failure injection
- Use integration tests for actor system interactions

Actor-Driven Architecture provides a powerful model for building highly concurrent, fault-tolerant, and scalable distributed systems. When implemented correctly, it can handle millions of actors processing messages concurrently while maintaining system stability and performance.
