# Message Queue

## What is a Message Queue?

A **Message Queue (MQ)** is a form of asynchronous service-to-service communication used in distributed systems. It allows producers (senders) to post messages to a queue where consumers (receivers) can retrieve and process them independently.

**Analogy**:
Imagine a pizza restaurant:

- A customer orders a pizza (**producer**).
- The order is added to a queue of pending pizzas (**message queue**).
- When ready, a chef (**consumer**) processes the order and the customer receives the pizza.
- Meanwhile, the customer can do other things while waiting (**asynchronous operation**).

## Key Concepts

- **Producer**: Sends a message to the queue.
- **Queue**: Holds the message until a consumer processes it.
- **Consumer**: Receives and processes the message.
- **Broker**: The middleware managing the queue (e.g., RabbitMQ, Kafka).

## Benefits

- **Asynchronous Processing**: Decouples producers and consumers.
- **Fault Tolerance**: Messages remain in the queue until successfully processed, even if a server crashes.
- **Load Balancing**: Distributes work evenly among available consumers.
- **Scalability**: Easy to add more consumers to handle increased load.
- **Priority Handling**: Supports prioritization (e.g., quick tasks like filling a drink vs. baking a pizza).

## Crash Recovery

If a server crashes:

- A **notifier** monitors server health.
- Unfinished jobs (tracked in a persistent database) are reassigned to healthy servers.
- Load balancers with **consistent hashing** ensure that duplicate processing does not occur.

## Message Queue vs. Synchronous Processing

| Synchronous                                    | Message Queue (Asynchronous)                 |
| ---------------------------------------------- | -------------------------------------------- |
| Tight coupling between sender and receiver     | Loose coupling between producer and consumer |
| Sender waits for receiver to finish processing | Sender continues without waiting             |
| Failure in receiver affects sender             | Queue holds messages until receiver is ready |

## Common Message Queues

| Tool          | Notes                                                 |
| ------------- | ----------------------------------------------------- |
| RabbitMQ      | Reliable message broker supporting multiple protocols |
| Kafka         | Distributed streaming platform, high throughput       |
| Amazon SQS    | Fully managed cloud message queue                     |
| ActiveMQ      | Open-source message broker                            |
| Redis Streams | Lightweight, fast message queue feature in Redis      |

## Usage Patterns

- **Task Queues**: Background job processing (e.g., sending emails, generating reports).
- **Event Sourcing**: Systems emitting events to queues for further processing.
- **Decoupled Microservices**: Facilitating communication between microservices without tight dependencies.

## Key Considerations

- **At-least-once vs. Exactly-once delivery**: Trade-offs between guaranteed delivery and avoiding duplicates.
- **Ordering**: Some queues guarantee message ordering, others do not.
- **Persistence**: Ensuring messages survive broker or server crashes.

## Example Workflow

```plaintext
[Producer] ---> [Message Queue] ---> [Consumer 1 / Consumer 2 / ...]
```
