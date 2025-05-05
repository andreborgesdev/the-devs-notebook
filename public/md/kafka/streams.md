# Kafka Streams Deep Dive

**Kafka Streams** is a Java library for building distributed, scalable, and fault-tolerant stream processing applications natively integrated with Apache Kafka.

## Key Concepts

| Concept           | Description                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------- |
| **Stream**        | An unbounded sequence of records (continuous flow of data)                                        |
| **KStream**       | Represents a record stream where each record is an independent key-value pair                     |
| **KTable**        | Represents a changelog stream where each key holds its latest value (similar to a database table) |
| **GlobalKTable**  | Like KTable but fully replicated on all nodes                                                     |
| **Topology**      | The logical flow of data transformations                                                          |
| **Processor API** | Low-level API for custom processing logic                                                         |

## Kafka Streams Architecture

```plaintext
Producer → Kafka Topic → Kafka Streams App → Output Topic → Consumer
```

Kafka Streams applications are **stateful** and **distributed** across multiple instances (scale out horizontally).

## Streams DSL vs Processor API

| API               | Description                                                       |
| ----------------- | ----------------------------------------------------------------- |
| **Streams DSL**   | High-level, functional-style API (recommended for most use cases) |
| **Processor API** | Low-level API for custom processors and fine-grained control      |

## KStream Example

```java
StreamsBuilder builder = new StreamsBuilder();
KStream<String, String> stream = builder.stream("input-topic");

stream.mapValues(value -> value.toUpperCase())
      .to("output-topic");

KafkaStreams streams = new KafkaStreams(builder.build(), props);
streams.start();
```

## KTable Example

```java
StreamsBuilder builder = new StreamsBuilder();
KTable<String, String> table = builder.table("user-profiles");

table.toStream().foreach((key, value) ->
    System.out.println("User " + key + " has profile " + value));
```

## Stream Transformations

| Operation                | Description                              |
| ------------------------ | ---------------------------------------- |
| **map**                  | Transform both key and value             |
| **mapValues**            | Transform value only                     |
| **filter**               | Filter records                           |
| **flatMap**              | Output multiple records per input        |
| **groupByKey / groupBy** | Repartition stream for aggregations      |
| **aggregate**            | Custom aggregation                       |
| **reduce**               | Reduce by key                            |
| **join**                 | Join two streams or a stream and a table |

## Windowed Operations

For handling time-based aggregations:

```java
stream.groupByKey()
      .windowedBy(TimeWindows.of(Duration.ofMinutes(5)))
      .count()
      .toStream()
      .foreach((windowedKey, count) ->
          System.out.println("Count in window: " + count));
```

**Window types**:

- **Tumbling**: Non-overlapping, fixed-size windows
- **Hopping**: Overlapping windows
- **Session**: Dynamic windows based on inactivity gaps

## State Stores

Kafka Streams allows you to maintain **stateful computations** (counts, aggregations, etc.) using **state stores**:

```java
Materialized<String, Long, KeyValueStore<Bytes, byte[]>> store =
    Materialized.as("counts-store");
```

State is backed by **local disk** and changelogged to Kafka for fault tolerance.

## Fault Tolerance

- Kafka Streams **replays records** from topics to recover state.
- State stores can be **restored automatically** from changelog topics.
- Supports **exactly-once semantics (EOS)** to avoid duplicates.

## Scaling and Parallelism

- Kafka Streams automatically assigns **partitions** to application instances.
- To increase parallelism, **increase the number of partitions** in the input topic and run more instances of the app.

## Interactive Queries

Kafka Streams supports **querying state stores** directly from the app (e.g., exposing via REST API):

```java
ReadOnlyKeyValueStore<String, Long> store =
    streams.store(StoreQueryParameters.fromNameAndType("counts-store", QueryableStoreTypes.keyValueStore()));

Long count = store.get("key");
```

## Benefits of Kafka Streams

✅ No external cluster or separate processing framework required
✅ Elastic scalability
✅ Strong delivery guarantees: **at-least-once** and **exactly-once**
✅ Supports both **stateless** and **stateful** processing
✅ Native Kafka integration
✅ Lightweight library (no need for separate services like Flink or Spark)

## When to Use Kafka Streams

- Real-time aggregations and joins
- Data enrichment
- Event-driven microservices
- ETL pipelines
- Pattern detection and anomaly detection

## Comparison: Kafka Streams vs Kafka Consumer

| Feature                 | Kafka Consumer          | Kafka Streams                  |
| ----------------------- | ----------------------- | ------------------------------ |
| **Level**               | Low-level               | High-level                     |
| **Stream processing**   | Manual                  | Built-in                       |
| **Fault tolerance**     | Manual handling         | Automatic                      |
| **Scaling**             | Manual                  | Automatic partition assignment |
| **Stateful processing** | Must implement yourself | Built-in state stores          |

## Common Use Case Patterns

| Pattern                  | Example                            |
| ------------------------ | ---------------------------------- |
| **Filter**               | Drop invalid events                |
| **Map/FlatMap**          | Transform records                  |
| **Join**                 | Enrich streams with reference data |
| **Aggregate**            | Count, sum, average                |
| **Windowed Aggregation** | Compute stats over time windows    |
