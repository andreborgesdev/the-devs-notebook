# Message Queues and Event Streaming

## Overview

Message queues are fundamental components in distributed systems that enable asynchronous communication between services. They decouple producers and consumers, providing reliability, scalability, and fault tolerance.

## Core Concepts

### Message Queue Components

**Producer (Publisher)**

- Service that sends messages to the queue
- Can be applications, microservices, or external systems
- Responsible for message formatting and routing

**Queue/Topic**

- Storage mechanism for messages
- Provides ordering guarantees (depending on implementation)
- Can persist messages for durability

**Consumer (Subscriber)**

- Service that receives and processes messages
- Can acknowledge successful processing
- May implement retry logic for failed messages

**Message Broker**

- Middleware that manages queues and message routing
- Handles connection management and load balancing
- Provides administration and monitoring capabilities

### Message Structure

```json
{
  "id": "msg_12345",
  "timestamp": "2024-01-15T10:30:00Z",
  "type": "order.created",
  "source": "order-service",
  "data": {
    "orderId": "order_67890",
    "customerId": "cust_123",
    "items": [{ "productId": "prod_456", "quantity": 2, "price": 29.99 }],
    "total": 59.98
  },
  "metadata": {
    "version": "1.0",
    "priority": "normal",
    "retryCount": 0
  }
}
```

## Message Queue Patterns

### 1. Point-to-Point (Queue Pattern)

```python
class OrderProcessor:
    def __init__(self, queue_client):
        self.queue = queue_client

    def process_orders(self):
        while True:
            # Only one consumer processes each message
            message = self.queue.receive("order-processing-queue")

            if message:
                try:
                    self.process_order(message.data)
                    self.queue.acknowledge(message.id)
                except Exception as e:
                    self.queue.nack(message.id)
                    self.handle_processing_error(e, message)
```

**Characteristics:**

- One message consumed by exactly one consumer
- Load balancing across multiple consumers
- Message removed after successful processing

### 2. Publish-Subscribe (Topic Pattern)

```python
class EventNotificationSystem:
    def __init__(self, message_broker):
        self.broker = message_broker

    def publish_order_event(self, order_data):
        event = {
            "type": "order.created",
            "data": order_data,
            "timestamp": time.time()
        }

        # Multiple subscribers can receive this message
        self.broker.publish("order-events", event)

class InventoryService:
    def __init__(self, message_broker):
        self.broker = message_broker
        self.broker.subscribe("order-events", self.handle_order_event)

    def handle_order_event(self, event):
        if event["type"] == "order.created":
            self.update_inventory(event["data"])

class EmailService:
    def __init__(self, message_broker):
        self.broker = message_broker
        self.broker.subscribe("order-events", self.handle_order_event)

    def handle_order_event(self, event):
        if event["type"] == "order.created":
            self.send_confirmation_email(event["data"])
```

**Characteristics:**

- One message delivered to multiple subscribers
- Each subscriber receives a copy of the message
- Supports fan-out messaging patterns

### 3. Request-Reply Pattern

```python
class RPCOverMessageQueue:
    def __init__(self, queue_client):
        self.queue = queue_client
        self.pending_requests = {}

    def call_remote_service(self, service_name, method, params):
        correlation_id = str(uuid.uuid4())
        reply_queue = f"reply-{correlation_id}"

        # Create temporary reply queue
        self.queue.create_queue(reply_queue)

        request_message = {
            "method": method,
            "params": params,
            "reply_to": reply_queue,
            "correlation_id": correlation_id
        }

        # Send request
        self.queue.send(f"{service_name}-requests", request_message)

        # Wait for reply with timeout
        reply = self.queue.receive(reply_queue, timeout=30)
        self.queue.delete_queue(reply_queue)

        if reply:
            return reply.data
        else:
            raise TimeoutError("No reply received")
```

## Delivery Guarantees

### At-Most-Once Delivery

- Messages delivered zero or one time
- Fast but may lose messages
- Suitable for metrics, logs, non-critical data

```python
class AtMostOnceProducer:
    def send_message(self, queue_name, message):
        # Fire and forget - no acknowledgment
        try:
            self.queue.send(queue_name, message)
        except Exception:
            # Ignore errors - don't retry
            pass
```

### At-Least-Once Delivery

- Messages delivered one or more times
- Guarantees delivery but may have duplicates
- Most common pattern in distributed systems

```python
class AtLeastOnceProducer:
    def send_message(self, queue_name, message):
        max_retries = 3

        for attempt in range(max_retries):
            try:
                ack = self.queue.send_with_ack(queue_name, message)
                if ack.success:
                    return
            except Exception as e:
                if attempt == max_retries - 1:
                    raise e
                time.sleep(2 ** attempt)  # Exponential backoff
```

### Exactly-Once Delivery

- Messages delivered exactly one time
- Complex to implement, requires coordination
- Used for financial transactions, critical operations

```python
class ExactlyOnceProcessor:
    def __init__(self, queue_client, idempotency_store):
        self.queue = queue_client
        self.processed_messages = idempotency_store

    def process_message(self, message):
        message_id = message.id

        # Check if already processed
        if self.processed_messages.exists(message_id):
            self.queue.acknowledge(message.id)
            return

        # Process in transaction with idempotency check
        with self.begin_transaction():
            if not self.processed_messages.exists(message_id):
                self.do_business_logic(message.data)
                self.processed_messages.set(message_id, True)

            self.queue.acknowledge(message.id)
```

## Message Queue Technologies

### Apache Kafka

**Use Cases:**

- High-throughput streaming
- Event sourcing
- Log aggregation
- Real-time analytics

```python
from kafka import KafkaProducer, KafkaConsumer

# Producer example
producer = KafkaProducer(
    bootstrap_servers=['localhost:9092'],
    value_serializer=lambda x: json.dumps(x).encode('utf-8'),
    retries=3,
    batch_size=16384,
    linger_ms=5
)

def send_order_event(order_data):
    producer.send('order-events', order_data)
    producer.flush()

# Consumer example
consumer = KafkaConsumer(
    'order-events',
    bootstrap_servers=['localhost:9092'],
    value_deserializer=lambda m: json.loads(m.decode('utf-8')),
    group_id='order-processor-group',
    enable_auto_commit=False
)

for message in consumer:
    try:
        process_order(message.value)
        consumer.commit()
    except Exception as e:
        handle_error(e, message)
```

### RabbitMQ

**Use Cases:**

- Traditional messaging
- Request-reply patterns
- Complex routing
- Priority queues

```python
import pika

# Setup connection
connection = pika.BlockingConnection(
    pika.ConnectionParameters('localhost')
)
channel = connection.channel()

# Declare exchange and queue
channel.exchange_declare(exchange='order_exchange', exchange_type='topic')
channel.queue_declare(queue='order_processing', durable=True)
channel.queue_bind(
    exchange='order_exchange',
    queue='order_processing',
    routing_key='order.created'
)

# Producer
def publish_order(order_data):
    channel.basic_publish(
        exchange='order_exchange',
        routing_key='order.created',
        body=json.dumps(order_data),
        properties=pika.BasicProperties(
            delivery_mode=2,  # Make message persistent
            priority=1
        )
    )

# Consumer
def process_order_callback(ch, method, properties, body):
    try:
        order_data = json.loads(body)
        process_order(order_data)
        ch.basic_ack(delivery_tag=method.delivery_tag)
    except Exception as e:
        ch.basic_nack(
            delivery_tag=method.delivery_tag,
            requeue=True
        )

channel.basic_consume(
    queue='order_processing',
    on_message_callback=process_order_callback
)
```

### Amazon SQS

**Use Cases:**

- Cloud-native applications
- Decoupling microservices
- Managed infrastructure
- Integration with AWS services

```python
import boto3

sqs = boto3.client('sqs', region_name='us-east-1')

# Send message
def send_order_message(order_data):
    response = sqs.send_message(
        QueueUrl='https://sqs.us-east-1.amazonaws.com/123456789/order-queue',
        MessageBody=json.dumps(order_data),
        MessageAttributes={
            'OrderType': {
                'StringValue': order_data.get('type', 'standard'),
                'DataType': 'String'
            },
            'Priority': {
                'StringValue': str(order_data.get('priority', 1)),
                'DataType': 'Number'
            }
        }
    )
    return response['MessageId']

# Receive and process messages
def process_orders():
    while True:
        response = sqs.receive_message(
            QueueUrl='https://sqs.us-east-1.amazonaws.com/123456789/order-queue',
            MaxNumberOfMessages=10,
            WaitTimeSeconds=20  # Long polling
        )

        messages = response.get('Messages', [])

        for message in messages:
            try:
                order_data = json.loads(message['Body'])
                process_order(order_data)

                # Delete message after successful processing
                sqs.delete_message(
                    QueueUrl='https://sqs.us-east-1.amazonaws.com/123456789/order-queue',
                    ReceiptHandle=message['ReceiptHandle']
                )
            except Exception as e:
                handle_processing_error(e, message)
```

## Advanced Patterns

### Dead Letter Queues

```python
class MessageProcessor:
    def __init__(self, main_queue, dlq):
        self.main_queue = main_queue
        self.dead_letter_queue = dlq
        self.max_retries = 3

    def process_messages(self):
        while True:
            message = self.main_queue.receive()

            if message:
                retry_count = message.metadata.get('retry_count', 0)

                try:
                    self.process_message(message)
                    self.main_queue.acknowledge(message.id)
                except Exception as e:
                    if retry_count >= self.max_retries:
                        # Send to dead letter queue for manual inspection
                        self.dead_letter_queue.send({
                            'original_message': message.data,
                            'error': str(e),
                            'retry_count': retry_count,
                            'failed_at': time.time()
                        })
                        self.main_queue.acknowledge(message.id)
                    else:
                        # Retry with exponential backoff
                        message.metadata['retry_count'] = retry_count + 1
                        delay = min(300, 2 ** retry_count)  # Max 5 minutes
                        self.main_queue.send_with_delay(message, delay)
                        self.main_queue.acknowledge(message.id)
```

### Message Batching

```python
class BatchProcessor:
    def __init__(self, queue_client, batch_size=100, flush_interval=30):
        self.queue = queue_client
        self.batch_size = batch_size
        self.flush_interval = flush_interval
        self.message_batch = []
        self.last_flush = time.time()

    def add_message(self, message):
        self.message_batch.append(message)

        # Flush if batch is full or time interval exceeded
        if (len(self.message_batch) >= self.batch_size or
            time.time() - self.last_flush > self.flush_interval):
            self.flush_batch()

    def flush_batch(self):
        if self.message_batch:
            try:
                # Process entire batch at once
                self.process_message_batch(self.message_batch)

                # Acknowledge all messages
                for message in self.message_batch:
                    self.queue.acknowledge(message.id)

                self.message_batch.clear()
                self.last_flush = time.time()

            except Exception as e:
                # Handle batch failure - could implement partial retry
                self.handle_batch_error(e, self.message_batch)
```

### Circuit Breaker for Message Processing

```python
class MessageProcessorWithCircuitBreaker:
    def __init__(self, queue_client, failure_threshold=5, timeout=60):
        self.queue = queue_client
        self.circuit_breaker = CircuitBreaker(failure_threshold, timeout)
        self.backup_processor = BackupProcessor()

    def process_messages(self):
        while True:
            message = self.queue.receive()

            if message:
                if self.circuit_breaker.can_execute():
                    try:
                        self.process_message_primary(message)
                        self.circuit_breaker.record_success()
                        self.queue.acknowledge(message.id)
                    except Exception as e:
                        self.circuit_breaker.record_failure()
                        self.fallback_processing(message)
                else:
                    # Circuit is open - use fallback
                    self.fallback_processing(message)

    def fallback_processing(self, message):
        # Use backup processing or store for later
        self.backup_processor.store_for_retry(message)
        self.queue.acknowledge(message.id)
```

## Monitoring and Observability

### Key Metrics

```python
class MessageQueueMetrics:
    def __init__(self, metrics_client):
        self.metrics = metrics_client

    def record_message_published(self, queue_name, message_size):
        self.metrics.increment('messages.published', tags=[f'queue:{queue_name}'])
        self.metrics.histogram('message.size', message_size, tags=[f'queue:{queue_name}'])

    def record_message_processed(self, queue_name, processing_time, success):
        status = 'success' if success else 'failure'
        self.metrics.increment('messages.processed',
                              tags=[f'queue:{queue_name}', f'status:{status}'])
        self.metrics.histogram('message.processing_time', processing_time,
                              tags=[f'queue:{queue_name}'])

    def record_queue_depth(self, queue_name, depth):
        self.metrics.gauge('queue.depth', depth, tags=[f'queue:{queue_name}'])

    def record_consumer_lag(self, consumer_group, topic, lag):
        self.metrics.gauge('consumer.lag', lag,
                          tags=[f'group:{consumer_group}', f'topic:{topic}'])
```

**Essential Monitoring Metrics:**

- Queue depth/backlog
- Message processing rate
- Consumer lag
- Error rates
- Processing latency
- Dead letter queue size

### Health Checks

```python
class QueueHealthChecker:
    def __init__(self, queue_client):
        self.queue = queue_client

    def check_health(self):
        health_status = {
            'status': 'healthy',
            'checks': {}
        }

        # Check connection
        try:
            self.queue.ping()
            health_status['checks']['connection'] = 'healthy'
        except Exception as e:
            health_status['checks']['connection'] = f'unhealthy: {e}'
            health_status['status'] = 'unhealthy'

        # Check queue depths
        critical_queues = ['order-processing', 'payment-processing']
        for queue_name in critical_queues:
            try:
                depth = self.queue.get_queue_depth(queue_name)
                if depth > 1000:  # Alert threshold
                    health_status['checks'][f'{queue_name}_depth'] = f'warning: {depth} messages'
                    if health_status['status'] == 'healthy':
                        health_status['status'] = 'degraded'
                else:
                    health_status['checks'][f'{queue_name}_depth'] = f'healthy: {depth} messages'
            except Exception as e:
                health_status['checks'][f'{queue_name}_depth'] = f'unhealthy: {e}'
                health_status['status'] = 'unhealthy'

        return health_status
```

## Best Practices

### Message Design

- Include message versioning for backward compatibility
- Add correlation IDs for tracing
- Keep messages small and focused
- Include retry and error handling metadata

### Performance Optimization

- Use appropriate batch sizes
- Implement connection pooling
- Configure proper prefetch counts
- Monitor consumer lag and scale accordingly

### Error Handling

- Implement exponential backoff for retries
- Use dead letter queues for poison messages
- Log errors with correlation IDs
- Implement circuit breakers for external dependencies

### Security

- Encrypt sensitive message data
- Use authentication and authorization
- Implement message signing for integrity
- Audit message access and processing

This comprehensive guide covers the essential concepts, patterns, and implementations needed for effective message queue usage in distributed systems.
