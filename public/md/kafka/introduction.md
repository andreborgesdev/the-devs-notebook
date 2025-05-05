# Apache Kafka

**Kafka** is a distributed streaming platform used for building real-time data pipelines and streaming applications.

## Key Concepts

| Concept       | Description                                                            |
| ------------- | ---------------------------------------------------------------------- |
| **Producer**  | Publishes messages to a Kafka topic                                    |
| **Consumer**  | Subscribes to topics and processes messages                            |
| **Topic**     | A category/feed name to which records are published                    |
| **Partition** | Topics are split into partitions for scalability                       |
| **Broker**    | A Kafka server that stores data and serves clients                     |
| **Cluster**   | A group of Kafka brokers                                               |
| **Zookeeper** | Coordinates and manages the Kafka brokers (optional in newer versions) |

## Kafka Workflow

```plaintext
Producer → Topic Partition(s) → Broker(s) → Consumer Group
```

**Producers** send messages → Kafka stores them in **partitions** → **Consumers** read messages.

## Message Retention

- Messages are retained for a configurable amount of time (or indefinitely).
- Consumers can read messages at their own pace.

## Kafka Producer Example (Java)

```java
Properties props = new Properties();
props.put("bootstrap.servers", "localhost:9092");
props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
props.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");

Producer<String, String> producer = new KafkaProducer<>(props);
producer.send(new ProducerRecord<>("my-topic", "key", "Hello Kafka!"));
producer.close();
```

## Kafka Consumer Example (Java)

```java
Properties props = new Properties();
props.put("bootstrap.servers", "localhost:9092");
props.put("group.id", "my-consumer-group");
props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
props.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");

KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);
consumer.subscribe(List.of("my-topic"));

while (true) {
    ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));
    for (ConsumerRecord<String, String> record : records) {
        System.out.printf("Received message: %s%n", record.value());
    }
}
```

## Consumer Groups

- Consumers in the same **group** share the load of reading from partitions.
- Each partition is read by only one consumer in the group.

## Partitioning

- **Key-based partitioning** ensures the same key always goes to the same partition.
- Enables **order guarantees** for messages with the same key.

## Offset Management

- **Offset**: The position of a consumer in a partition.
- Kafka tracks offsets to ensure consumers know where to resume.
- Can be committed **automatically** or **manually**.

## Kafka Guarantees

| Guarantee         | Description                                                      |
| ----------------- | ---------------------------------------------------------------- |
| **At most once**  | Messages may be lost but are never redelivered                   |
| **At least once** | Messages are never lost but may be redelivered                   |
| **Exactly once**  | No message loss or duplication (requires special configurations) |

## Common Use Cases

- Log aggregation
- Real-time analytics
- Event sourcing
- Messaging system replacement
- Stream processing (with Kafka Streams or Kafka Connect)

## Kafka Streams

**Kafka Streams** is a Java library for building stream processing applications on top of Kafka.

```java
StreamsBuilder builder = new StreamsBuilder();
KStream<String, String> stream = builder.stream("input-topic");
stream.mapValues(value -> value.toUpperCase())
      .to("output-topic");

KafkaStreams streams = new KafkaStreams(builder.build(), props);
streams.start();
```

## Kafka Connect

Tool for **integrating Kafka with external systems** (databases, key-value stores, search indexes).

**Example connectors**:

- JDBC Source/Sink
- Elasticsearch
- MongoDB

## Kafka vs Traditional Message Brokers

| Feature           | Kafka      | Traditional Brokers                                        |
| ----------------- | ---------- | ---------------------------------------------------------- |
| **Scalability**   | Horizontal | Often limited                                              |
| **Retention**     | Time-based | Typically queue-based (messages are removed once consumed) |
| **Throughput**    | Very high  | Moderate                                                   |
| **Replayability** | Supported  | Often unsupported                                          |

## Best Practices

- Use **multiple partitions** for scalability.
- Tune **replication factor** for fault tolerance.
- Use **idempotent producers** to avoid duplicates.
- Monitor **lag** to detect slow consumers.
- Use **schema registry** (e.g., Confluent Schema Registry) to manage data formats like Avro or JSON Schema.
