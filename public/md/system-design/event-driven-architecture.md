# Event-Driven Architecture

## Overview

Event-Driven Architecture (EDA) is a design pattern where components communicate through the production and consumption of events. Events represent significant occurrences or state changes in the system, enabling loose coupling, scalability, and real-time responsiveness.

## Core Concepts

### Events

#### Event Structure

```javascript
const orderCreatedEvent = {
  eventId: "123e4567-e89b-12d3-a456-426614174000",
  eventType: "OrderCreated",
  eventVersion: "1.0",
  timestamp: "2024-01-15T10:30:00Z",
  source: "order-service",
  data: {
    orderId: "order-123",
    customerId: "customer-456",
    items: [{ productId: "product-789", quantity: 2, price: 29.99 }],
    totalAmount: 59.98,
    status: "pending",
  },
  metadata: {
    correlationId: "corr-123",
    causationId: "user-action-456",
    userId: "user-789",
  },
};
```

#### Event Types

##### Domain Events

```javascript
// Business domain events
const userRegisteredEvent = {
  eventType: "UserRegistered",
  data: {
    userId: "user-123",
    email: "user@example.com",
    registrationDate: "2024-01-15T10:30:00Z",
  },
};

const paymentProcessedEvent = {
  eventType: "PaymentProcessed",
  data: {
    paymentId: "payment-456",
    orderId: "order-123",
    amount: 99.99,
    status: "successful",
  },
};
```

##### System Events

```javascript
// System-level events
const serviceStartedEvent = {
  eventType: "ServiceStarted",
  data: {
    serviceName: "order-service",
    version: "1.2.3",
    instanceId: "instance-abc",
  },
};

const errorOccurredEvent = {
  eventType: "ErrorOccurred",
  data: {
    service: "payment-service",
    error: "Connection timeout",
    stackTrace: "...",
  },
};
```

### Event Producers

#### Event Publisher

```javascript
class EventPublisher {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.eventStore = new EventStore();
  }

  async publishEvent(event) {
    // Validate event
    this.validateEvent(event);

    // Add metadata
    const enrichedEvent = this.enrichEvent(event);

    // Store event (for event sourcing)
    await this.eventStore.append(enrichedEvent);

    // Publish to event bus
    await this.eventBus.publish(enrichedEvent);

    return enrichedEvent;
  }

  enrichEvent(event) {
    return {
      ...event,
      eventId: event.eventId || this.generateEventId(),
      timestamp: event.timestamp || new Date().toISOString(),
      eventVersion: event.eventVersion || "1.0",
      source: event.source || this.getServiceName(),
    };
  }

  validateEvent(event) {
    if (!event.eventType) {
      throw new Error("Event must have eventType");
    }
    if (!event.data) {
      throw new Error("Event must have data");
    }
  }

  generateEventId() {
    return require("crypto").randomUUID();
  }
}
```

#### Aggregate Root with Events

```javascript
class Order {
  constructor(orderId, customerId) {
    this.orderId = orderId;
    this.customerId = customerId;
    this.items = [];
    this.status = "draft";
    this.events = [];
  }

  addItem(productId, quantity, price) {
    this.items.push({ productId, quantity, price });

    this.addEvent({
      eventType: "ItemAddedToOrder",
      data: {
        orderId: this.orderId,
        productId,
        quantity,
        price,
      },
    });
  }

  confirm() {
    if (this.status !== "draft") {
      throw new Error("Can only confirm draft orders");
    }

    this.status = "confirmed";

    this.addEvent({
      eventType: "OrderConfirmed",
      data: {
        orderId: this.orderId,
        customerId: this.customerId,
        items: this.items,
        totalAmount: this.calculateTotal(),
        confirmedAt: new Date().toISOString(),
      },
    });
  }

  addEvent(event) {
    this.events.push(event);
  }

  getUncommittedEvents() {
    return [...this.events];
  }

  markEventsAsCommitted() {
    this.events = [];
  }

  calculateTotal() {
    return this.items.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );
  }
}
```

### Event Consumers

#### Event Handler

```javascript
class OrderEventHandler {
  constructor(inventoryService, notificationService, analyticsService) {
    this.inventoryService = inventoryService;
    this.notificationService = notificationService;
    this.analyticsService = analyticsService;
  }

  async handleOrderConfirmed(event) {
    const { orderId, customerId, items } = event.data;

    try {
      // Reserve inventory
      await this.inventoryService.reserveItems(orderId, items);

      // Send confirmation email
      await this.notificationService.sendOrderConfirmation(customerId, orderId);

      // Update analytics
      await this.analyticsService.recordOrderConfirmed(event.data);

      console.log(`Order ${orderId} processed successfully`);
    } catch (error) {
      console.error(`Failed to process order ${orderId}:`, error);

      // Publish compensation event
      await this.publishEvent({
        eventType: "OrderProcessingFailed",
        data: {
          orderId,
          error: error.message,
          originalEvent: event,
        },
      });
    }
  }

  async handlePaymentProcessed(event) {
    const { orderId, paymentId, status } = event.data;

    if (status === "successful") {
      await this.publishEvent({
        eventType: "OrderPaymentConfirmed",
        data: { orderId, paymentId },
      });
    } else {
      await this.publishEvent({
        eventType: "OrderPaymentFailed",
        data: { orderId, paymentId, reason: event.data.failureReason },
      });
    }
  }
}
```

#### Event Router/Dispatcher

```javascript
class EventDispatcher {
  constructor() {
    this.handlers = new Map();
    this.middlewares = [];
  }

  registerHandler(eventType, handler) {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType).push(handler);
  }

  addMiddleware(middleware) {
    this.middlewares.push(middleware);
  }

  async dispatch(event) {
    // Apply middlewares
    let processedEvent = event;
    for (const middleware of this.middlewares) {
      processedEvent = await middleware(processedEvent);
    }

    const handlers = this.handlers.get(event.eventType) || [];

    if (handlers.length === 0) {
      console.warn(`No handlers registered for event type: ${event.eventType}`);
      return;
    }

    // Execute handlers concurrently
    const promises = handlers.map((handler) =>
      this.executeHandler(handler, processedEvent)
    );

    const results = await Promise.allSettled(promises);

    // Log failed handlers
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(
          `Handler ${index} failed for event ${event.eventType}:`,
          result.reason
        );
      }
    });

    return results;
  }

  async executeHandler(handler, event) {
    const startTime = Date.now();

    try {
      await handler(event);
      const duration = Date.now() - startTime;
      console.log(`Handler executed successfully in ${duration}ms`);
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`Handler failed after ${duration}ms:`, error);
      throw error;
    }
  }
}
```

## Event Bus Implementations

### In-Memory Event Bus

```javascript
class InMemoryEventBus {
  constructor() {
    this.subscribers = new Map();
    this.eventStore = [];
  }

  subscribe(eventType, handler, options = {}) {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }

    this.subscribers.get(eventType).push({
      handler,
      options,
    });
  }

  async publish(event) {
    // Store event
    this.eventStore.push({
      ...event,
      publishedAt: Date.now(),
    });

    const subscribers = this.subscribers.get(event.eventType) || [];

    // Process synchronous subscribers first
    const syncSubscribers = subscribers.filter((sub) => !sub.options.async);
    for (const { handler } of syncSubscribers) {
      try {
        await handler(event);
      } catch (error) {
        console.error("Synchronous handler failed:", error);
      }
    }

    // Process asynchronous subscribers
    const asyncSubscribers = subscribers.filter((sub) => sub.options.async);
    const asyncPromises = asyncSubscribers.map(({ handler }) =>
      handler(event).catch((error) => {
        console.error("Asynchronous handler failed:", error);
      })
    );

    Promise.all(asyncPromises);

    return event;
  }

  getEvents(eventType = null) {
    if (eventType) {
      return this.eventStore.filter((event) => event.eventType === eventType);
    }
    return [...this.eventStore];
  }
}
```

### Message Queue Event Bus

```javascript
class MessageQueueEventBus {
  constructor(messageQueue) {
    this.messageQueue = messageQueue;
    this.subscriptions = new Map();
  }

  async publish(event) {
    const message = {
      id: event.eventId,
      type: event.eventType,
      payload: JSON.stringify(event),
      headers: {
        "content-type": "application/json",
        "event-version": event.eventVersion,
        source: event.source,
      },
    };

    // Publish to topic/queue based on event type
    const topic = this.getTopicForEvent(event.eventType);
    await this.messageQueue.publish(topic, message);

    return event;
  }

  async subscribe(eventType, handler, options = {}) {
    const topic = this.getTopicForEvent(eventType);
    const subscriptionId = `${eventType}-${Date.now()}`;

    const subscription = await this.messageQueue.subscribe(
      topic,
      async (message) => {
        try {
          const event = JSON.parse(message.payload);

          // Apply retry logic
          if (options.retries) {
            await this.executeWithRetry(handler, event, options.retries);
          } else {
            await handler(event);
          }

          // Acknowledge message
          await message.ack();
        } catch (error) {
          console.error(`Handler failed for event ${eventType}:`, error);

          if (options.deadLetterQueue) {
            await this.sendToDeadLetterQueue(message, error);
          }

          await message.nack();
        }
      },
      {
        durable: options.durable !== false,
        exclusive: options.exclusive || false,
      }
    );

    this.subscriptions.set(subscriptionId, subscription);
    return subscriptionId;
  }

  async executeWithRetry(handler, event, maxRetries) {
    let attempt = 0;

    while (attempt <= maxRetries) {
      try {
        await handler(event);
        return;
      } catch (error) {
        attempt++;

        if (attempt > maxRetries) {
          throw error;
        }

        // Exponential backoff
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  getTopicForEvent(eventType) {
    // Route events to topics based on type
    const topicMap = {
      OrderCreated: "orders",
      OrderConfirmed: "orders",
      PaymentProcessed: "payments",
      UserRegistered: "users",
    };

    return topicMap[eventType] || "default";
  }
}
```

## Event Sourcing

### Event Store

```javascript
class EventStore {
  constructor(database) {
    this.database = database;
  }

  async append(aggregateId, events, expectedVersion = -1) {
    const transaction = await this.database.beginTransaction();

    try {
      // Get current version
      const currentVersion = await this.getCurrentVersion(aggregateId);

      // Check optimistic concurrency
      if (expectedVersion !== -1 && currentVersion !== expectedVersion) {
        throw new Error("Concurrency conflict");
      }

      // Append events
      for (let i = 0; i < events.length; i++) {
        const event = {
          ...events[i],
          aggregateId,
          version: currentVersion + i + 1,
          position: await this.getNextGlobalPosition(),
        };

        await this.database.insertEvent(event);
      }

      await transaction.commit();

      // Publish events to event bus
      await this.publishEvents(events);

      return currentVersion + events.length;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getEvents(aggregateId, fromVersion = 0) {
    const query = `
      SELECT * FROM events 
      WHERE aggregate_id = ? AND version > ? 
      ORDER BY version ASC
    `;

    const rows = await this.database.query(query, [aggregateId, fromVersion]);

    return rows.map((row) => ({
      eventId: row.event_id,
      eventType: row.event_type,
      data: JSON.parse(row.data),
      metadata: JSON.parse(row.metadata),
      version: row.version,
      timestamp: row.timestamp,
    }));
  }

  async getEventStream(fromPosition = 0, maxCount = 1000) {
    const query = `
      SELECT * FROM events 
      WHERE position > ? 
      ORDER BY position ASC 
      LIMIT ?
    `;

    return await this.database.query(query, [fromPosition, maxCount]);
  }

  async replayEvents(aggregateId, toVersion = null) {
    const events = await this.getEvents(aggregateId);

    if (toVersion !== null) {
      return events.filter((event) => event.version <= toVersion);
    }

    return events;
  }
}
```

### Aggregate Reconstruction

```javascript
class AggregateRepository {
  constructor(eventStore) {
    this.eventStore = eventStore;
    this.snapshots = new Map();
  }

  async load(aggregateId, AggregateClass) {
    // Try to load from snapshot first
    const snapshot = await this.loadSnapshot(aggregateId);

    let aggregate;
    let fromVersion = 0;

    if (snapshot) {
      aggregate = this.reconstructFromSnapshot(snapshot, AggregateClass);
      fromVersion = snapshot.version;
    } else {
      aggregate = new AggregateClass(aggregateId);
    }

    // Load events since snapshot
    const events = await this.eventStore.getEvents(aggregateId, fromVersion);

    // Apply events to reconstruct current state
    for (const event of events) {
      aggregate.applyEvent(event);
    }

    return aggregate;
  }

  async save(aggregate) {
    const uncommittedEvents = aggregate.getUncommittedEvents();

    if (uncommittedEvents.length === 0) {
      return;
    }

    const expectedVersion = aggregate.version - uncommittedEvents.length;

    try {
      await this.eventStore.append(
        aggregate.getId(),
        uncommittedEvents,
        expectedVersion
      );

      aggregate.markEventsAsCommitted();

      // Create snapshot if needed
      if (this.shouldCreateSnapshot(aggregate)) {
        await this.saveSnapshot(aggregate);
      }
    } catch (error) {
      throw new Error(`Failed to save aggregate: ${error.message}`);
    }
  }

  shouldCreateSnapshot(aggregate) {
    return aggregate.version % 100 === 0; // Snapshot every 100 events
  }

  async saveSnapshot(aggregate) {
    const snapshot = {
      aggregateId: aggregate.getId(),
      version: aggregate.version,
      data: aggregate.getSnapshot(),
      timestamp: new Date().toISOString(),
    };

    await this.database.saveSnapshot(snapshot);
    this.snapshots.set(aggregate.getId(), snapshot);
  }
}
```

## Sagas and Process Managers

### Saga Implementation

```javascript
class OrderProcessingSaga {
  constructor(eventBus, services) {
    this.eventBus = eventBus;
    this.services = services;
    this.state = new Map();

    this.registerHandlers();
  }

  registerHandlers() {
    this.eventBus.subscribe("OrderCreated", this.handleOrderCreated.bind(this));
    this.eventBus.subscribe(
      "PaymentProcessed",
      this.handlePaymentProcessed.bind(this)
    );
    this.eventBus.subscribe(
      "InventoryReserved",
      this.handleInventoryReserved.bind(this)
    );
    this.eventBus.subscribe(
      "ShippingScheduled",
      this.handleShippingScheduled.bind(this)
    );
  }

  async handleOrderCreated(event) {
    const { orderId, customerId, items, totalAmount } = event.data;

    // Initialize saga state
    this.state.set(orderId, {
      orderId,
      customerId,
      items,
      totalAmount,
      status: "processing",
      steps: {
        paymentProcessed: false,
        inventoryReserved: false,
        shippingScheduled: false,
      },
    });

    // Start payment processing
    await this.services.paymentService.processPayment({
      orderId,
      customerId,
      amount: totalAmount,
    });
  }

  async handlePaymentProcessed(event) {
    const { orderId, status } = event.data;
    const sagaState = this.state.get(orderId);

    if (!sagaState) return;

    if (status === "successful") {
      sagaState.steps.paymentProcessed = true;

      // Reserve inventory
      await this.services.inventoryService.reserveItems(
        orderId,
        sagaState.items
      );
    } else {
      // Payment failed - cancel order
      await this.cancelOrder(orderId, "Payment failed");
    }
  }

  async handleInventoryReserved(event) {
    const { orderId, status } = event.data;
    const sagaState = this.state.get(orderId);

    if (!sagaState) return;

    if (status === "reserved") {
      sagaState.steps.inventoryReserved = true;

      // Schedule shipping
      await this.services.shippingService.scheduleShipping(orderId);
    } else {
      // Inventory reservation failed - compensate
      await this.compensatePayment(orderId);
      await this.cancelOrder(orderId, "Inventory unavailable");
    }
  }

  async handleShippingScheduled(event) {
    const { orderId } = event.data;
    const sagaState = this.state.get(orderId);

    if (!sagaState) return;

    sagaState.steps.shippingScheduled = true;

    // Check if all steps completed
    if (this.allStepsCompleted(sagaState)) {
      await this.completeOrder(orderId);
    }
  }

  allStepsCompleted(sagaState) {
    return Object.values(sagaState.steps).every((step) => step === true);
  }

  async completeOrder(orderId) {
    await this.eventBus.publish({
      eventType: "OrderCompleted",
      data: { orderId },
    });

    this.state.delete(orderId);
  }

  async cancelOrder(orderId, reason) {
    await this.eventBus.publish({
      eventType: "OrderCancelled",
      data: { orderId, reason },
    });

    this.state.delete(orderId);
  }

  async compensatePayment(orderId) {
    await this.services.paymentService.refundPayment(orderId);
  }
}
```

### Process Manager with State Persistence

```javascript
class ProcessManager {
  constructor(eventBus, processStore) {
    this.eventBus = eventBus;
    this.processStore = processStore;
    this.processes = new Map();
  }

  async handleEvent(event) {
    const processId = this.getProcessIdFromEvent(event);

    if (!processId) return;

    let process = this.processes.get(processId);

    if (!process) {
      // Load process from store
      process = await this.processStore.load(processId);

      if (!process) {
        // Create new process
        process = this.createProcess(event);
      }

      this.processes.set(processId, process);
    }

    // Apply event to process
    const commands = await process.handle(event);

    // Execute resulting commands
    for (const command of commands) {
      await this.executeCommand(command);
    }

    // Save process state
    await this.processStore.save(process);

    // Clean up completed processes
    if (process.isCompleted()) {
      this.processes.delete(processId);
      await this.processStore.delete(processId);
    }
  }

  async executeCommand(command) {
    switch (command.type) {
      case "PublishEvent":
        await this.eventBus.publish(command.event);
        break;
      case "SendCommand":
        await this.commandBus.send(command.command);
        break;
      case "SetTimeout":
        setTimeout(() => {
          this.handleTimeout(command.processId, command.timeoutId);
        }, command.delay);
        break;
    }
  }

  async handleTimeout(processId, timeoutId) {
    const process = this.processes.get(processId);

    if (process) {
      const commands = await process.handleTimeout(timeoutId);

      for (const command of commands) {
        await this.executeCommand(command);
      }
    }
  }
}
```

## Event Patterns

### Event Notification

```javascript
class EventNotificationPattern {
  constructor(eventBus) {
    this.eventBus = eventBus;
  }

  async processOrder(order) {
    // Process the order
    await this.saveOrder(order);

    // Notify other services
    await this.eventBus.publish({
      eventType: "OrderProcessed",
      data: {
        orderId: order.id,
        customerId: order.customerId,
        timestamp: new Date().toISOString(),
      },
    });
  }
}
```

### Event-Carried State Transfer

```javascript
class EventCarriedStateTransfer {
  constructor(eventBus) {
    this.eventBus = eventBus;
  }

  async updateUser(userId, updates) {
    const user = await this.getUserRepository().findById(userId);

    // Apply updates
    Object.assign(user, updates);
    await this.getUserRepository().save(user);

    // Publish full user state
    await this.eventBus.publish({
      eventType: "UserUpdated",
      data: {
        userId: user.id,
        email: user.email,
        name: user.name,
        address: user.address,
        preferences: user.preferences,
        version: user.version,
        updatedAt: user.updatedAt,
      },
    });
  }
}
```

### Event Sourcing Pattern

```javascript
class EventSourcingPattern {
  constructor(eventStore) {
    this.eventStore = eventStore;
  }

  async handleCommand(command) {
    const aggregate = await this.loadAggregate(command.aggregateId);

    // Execute command to generate events
    const events = aggregate.handle(command);

    // Append events to event store
    await this.eventStore.append(
      command.aggregateId,
      events,
      aggregate.version
    );

    // Publish events
    for (const event of events) {
      await this.eventBus.publish(event);
    }
  }

  async loadAggregate(aggregateId) {
    const events = await this.eventStore.getEvents(aggregateId);

    const aggregate = new Aggregate(aggregateId);

    for (const event of events) {
      aggregate.apply(event);
    }

    return aggregate;
  }
}
```

## Testing Event-Driven Systems

### Event Testing Framework

```javascript
class EventTestFramework {
  constructor() {
    this.recordedEvents = [];
    this.eventHandlers = new Map();
  }

  recordEvent(event) {
    this.recordedEvents.push({
      ...event,
      recordedAt: Date.now(),
    });
  }

  expectEvent(eventType, matcher = null) {
    const events = this.recordedEvents.filter((e) => e.eventType === eventType);

    if (events.length === 0) {
      throw new Error(`Expected event ${eventType} but none were recorded`);
    }

    if (matcher) {
      const matchingEvents = events.filter((event) => matcher(event));

      if (matchingEvents.length === 0) {
        throw new Error(
          `Expected event ${eventType} matching criteria but none found`
        );
      }
    }

    return events;
  }

  expectEventSequence(...eventTypes) {
    if (this.recordedEvents.length < eventTypes.length) {
      throw new Error("Not enough events recorded");
    }

    for (let i = 0; i < eventTypes.length; i++) {
      if (this.recordedEvents[i].eventType !== eventTypes[i]) {
        throw new Error(
          `Expected event ${eventTypes[i]} at position ${i}, got ${this.recordedEvents[i].eventType}`
        );
      }
    }
  }

  clearRecordedEvents() {
    this.recordedEvents = [];
  }

  async simulateEventSequence(events) {
    for (const event of events) {
      await this.publishEvent(event);
    }
  }
}
```

### Integration Testing

```javascript
describe("Order Processing Saga", () => {
  let eventBus;
  let saga;
  let testFramework;

  beforeEach(() => {
    testFramework = new EventTestFramework();
    eventBus = new TestEventBus(testFramework);
    saga = new OrderProcessingSaga(eventBus, mockServices);
  });

  test("should complete order when all steps succeed", async () => {
    // Given
    const orderId = "order-123";

    // When
    await eventBus.publish({
      eventType: "OrderCreated",
      data: {
        orderId,
        customerId: "customer-456",
        items: [],
        totalAmount: 100,
      },
    });

    await eventBus.publish({
      eventType: "PaymentProcessed",
      data: { orderId, status: "successful" },
    });

    await eventBus.publish({
      eventType: "InventoryReserved",
      data: { orderId, status: "reserved" },
    });

    await eventBus.publish({
      eventType: "ShippingScheduled",
      data: { orderId },
    });

    // Then
    testFramework.expectEvent(
      "OrderCompleted",
      (event) => event.data.orderId === orderId
    );
  });

  test("should cancel order when payment fails", async () => {
    // Given
    const orderId = "order-123";

    // When
    await eventBus.publish({
      eventType: "OrderCreated",
      data: {
        orderId,
        customerId: "customer-456",
        items: [],
        totalAmount: 100,
      },
    });

    await eventBus.publish({
      eventType: "PaymentProcessed",
      data: { orderId, status: "failed", failureReason: "Insufficient funds" },
    });

    // Then
    testFramework.expectEvent(
      "OrderCancelled",
      (event) =>
        event.data.orderId === orderId && event.data.reason === "Payment failed"
    );
  });
});
```

## Best Practices

### Event Design

1. **Event Naming**: Use past tense verbs (UserRegistered, OrderShipped)
2. **Event Granularity**: Balance between too fine-grained and too coarse
3. **Event Versioning**: Include version information for backward compatibility
4. **Event Immutability**: Events should never be modified after creation

### Error Handling

1. **Idempotency**: Ensure event handlers can be safely retried
2. **Dead Letter Queues**: Handle permanently failed messages
3. **Circuit Breakers**: Prevent cascading failures
4. **Compensating Actions**: Implement saga patterns for complex transactions

### Performance Considerations

1. **Event Batching**: Process multiple events together when possible
2. **Async Processing**: Use asynchronous event handling for better throughput
3. **Event Filtering**: Only subscribe to relevant events
4. **Snapshotting**: Use snapshots for event sourcing to improve performance

## Conclusion

Event-Driven Architecture enables building scalable, loosely-coupled systems that can react to changes in real-time. Key benefits include:

1. **Loose Coupling**: Services communicate through events rather than direct calls
2. **Scalability**: Components can be scaled independently
3. **Flexibility**: Easy to add new functionality by subscribing to events
4. **Auditability**: Complete audit trail through event history
5. **Real-time Processing**: Immediate reaction to system changes

Successful implementation requires careful consideration of event design, error handling, and testing strategies. Start with simple event notification patterns and evolve to more complex patterns like event sourcing as needed.
