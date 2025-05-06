# Processing Queues

## What is a Processing Queue?

A **Processing Queue** is a data structure or system component that holds tasks, jobs, or events waiting to be processed. It decouples task submission from task execution, enabling **asynchronous** and **parallel processing**. Processing queues are essential in distributed and scalable systems where workloads vary over time or must be balanced across multiple workers.

## Why Use a Processing Queue?

- **Asynchronous execution**: Producers can continue submitting tasks without waiting for them to finish.
- **Load leveling**: Handles spikes in workload by queuing excess tasks.
- **Fault tolerance**: Tasks remain in the queue if a worker fails.
- **Scalability**: Easy to add or remove workers to meet demand.
- **Decoupling**: Separates the responsibility of task creation and task processing.

## Key Components

| Component              | Description                                              |
| ---------------------- | -------------------------------------------------------- |
| **Producer**           | Creates tasks and places them in the queue               |
| **Queue (Broker)**     | Stores tasks until a worker retrieves and processes them |
| **Consumer (Worker)**  | Retrieves and processes tasks                            |
| **Notifier / Monitor** | Tracks worker health and task status                     |

## Typical Workflow

```plaintext
[Producer] ---> [Processing Queue] ---> [Worker 1 / Worker 2 / ...]
```

## Example Use Cases

- Sending emails or SMS notifications
- Processing video or image uploads
- Running background jobs (e.g., data cleanup, batch processing)
- Order fulfillment in e-commerce
- Distributed computing tasks

## Priority and Scheduling

Processing queues can support:

- **Prioritized tasks**: Urgent tasks can jump ahead in the queue.
- **Scheduled tasks**: Execute at a specified time or after a delay.
- **Rate limiting**: Control the pace of task processing to avoid overloading resources.

## Fault Tolerance and Recovery

If a worker crashes:

- The queue retains unprocessed tasks.
- A monitor or notifier can reassign tasks to other available workers.
- Some systems use **consistent hashing** to prevent duplicate processing.

## Common Technologies

| Tool                      | Description                                                       |
| ------------------------- | ----------------------------------------------------------------- |
| **RabbitMQ**              | Advanced message broker supporting complex routing and priorities |
| **Kafka**                 | Distributed event streaming platform                              |
| **Amazon SQS**            | Scalable cloud-based queue                                        |
| **Redis Lists / Streams** | Lightweight in-memory processing queues                           |
| **Celery (Python)**       | Task queue often used with Redis or RabbitMQ                      |

## Key Design Considerations

- **At-least-once vs. exactly-once processing**: Handling duplicates if needed.
- **Ordering guarantees**: Some queues preserve order, others do not.
- **Visibility timeouts**: Prevent task loss if a worker crashes during processing.
- **Dead-letter queues**: For handling tasks that repeatedly fail.

## Processing Queue vs. Message Queue

| Feature  | Message Queue                  | Processing Queue                               |
| -------- | ------------------------------ | ---------------------------------------------- |
| Purpose  | Communication between services | Manage and execute tasks asynchronously        |
| Example  | Event notification             | Job execution (e.g., image resizing)           |
| Coupling | Loosely coupled communication  | Often tightly integrated with worker processes |
