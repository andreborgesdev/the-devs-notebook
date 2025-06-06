# System Design Fundamentals

## Introduction

System design is the process of defining the architecture, components, modules, interfaces, and data for a system to satisfy specified requirements. It encompasses both the high-level architecture decisions and low-level implementation details needed to build scalable, reliable, and maintainable software systems.

In technical interviews and real-world scenarios, system design demonstrates your ability to:

- Think at scale and handle complexity
- Make informed trade-offs between competing requirements
- Design for failure and recovery
- Balance technical and business constraints
- Communicate architectural decisions effectively

## Core Performance Metrics

### Scalability

**Definition**: The capability of a system to handle increased load by adding resources.

**Types of Scaling**:

**Horizontal Scaling (Scale Out)**

```
Advantages:
- Nearly unlimited scaling potential
- Improved fault tolerance
- Cost-effective with commodity hardware
- Geographic distribution possible

Challenges:
- Increased complexity
- Data consistency issues
- Network latency between nodes
- Load balancing requirements

Best For:
- Web applications
- Microservices
- Stateless applications
- High-availability systems
```

**Vertical Scaling (Scale Up)**

```
Advantages:
- Simple implementation
- No application changes required
- Strong consistency maintained
- Lower operational complexity

Limitations:
- Hardware ceiling limits
- Exponential cost increases
- Single point of failure
- Downtime during upgrades

Best For:
- Legacy applications
- Databases requiring ACID properties
- Monolithic architectures
- Early-stage applications
```

**Scalability Patterns**:

- Load balancing and distribution
- Caching at multiple levels
- Database sharding and replication
- Microservices architecture
- Content delivery networks (CDNs)
- Auto-scaling based on metrics

### Reliability

**Definition**: The probability that a system performs correctly during a specific time duration.

**Key Concepts**:

**Mean Time Between Failures (MTBF)**

```
MTBF = (Total Elapsed Time - Total Downtime) / Number of Failures

Example:
- Operating time: 8,760 hours (1 year)
- Downtime: 8.76 hours
- Failures: 3
- MTBF = (8,760 - 8.76) / 3 = 2,917 hours
```

**Mean Time To Recovery (MTTR)**

```
MTTR = Total Downtime / Number of Incidents

Target MTTR varies by system criticality:
- Critical systems: < 1 hour
- Business systems: < 4 hours
- Development systems: < 24 hours
```

**Reliability Strategies**:

- Redundancy and replication
- Graceful degradation
- Circuit breaker patterns
- Health checks and monitoring
- Automated failover
- Disaster recovery planning

### Availability

**Definition**: The percentage of time a system is operational and accessible.

**Calculation**:

```
Availability = (Uptime / Total Time) × 100
Availability = (MTBF / (MTBF + MTTR)) × 100

Example:
- Uptime: 8,751.24 hours
- Total time: 8,760 hours
- Availability = (8,751.24 / 8,760) × 100 = 99.90%
```

**Availability Levels ("Nines")**:

| Availability | Annual Downtime | Monthly Downtime | Daily Downtime |
| ------------ | --------------- | ---------------- | -------------- |
| 90%          | 36.53 days      | 73 hours         | 2.4 hours      |
| 99%          | 3.65 days       | 7.31 hours       | 14.40 minutes  |
| 99.9%        | 8.77 hours      | 43.83 minutes    | 1.44 minutes   |
| 99.99%       | 52.60 minutes   | 4.38 minutes     | 8.64 seconds   |
| 99.999%      | 5.26 minutes    | 26.30 seconds    | 0.864 seconds  |
| 99.9999%     | 31.56 seconds   | 2.63 seconds     | 0.0864 seconds |

**High Availability Patterns**:

- Active-active configurations
- Load balancing across multiple zones
- Database master-slave replication
- Content delivery networks
- Circuit breakers and bulkheads
- Graceful degradation strategies

### Performance

**Latency**: Time to process a single request

```
Types of Latency:
- Network latency: 1-100ms (depending on distance)
- Database query: 1-100ms (depending on complexity)
- Cache lookup: 0.1-1ms
- Memory access: 100ns
- Disk seek: 10ms
```

**Throughput**: Number of requests processed per unit time

```
Factors Affecting Throughput:
- Server capacity (CPU, memory, I/O)
- Network bandwidth
- Database performance
- Application efficiency
- Caching effectiveness
```

**Response Time Distribution**:

```
Percentiles Matter:
- p50 (median): 50% of requests faster than this
- p95: 95% of requests faster than this
- p99: 99% of requests faster than this
- p99.9: 99.9% of requests faster than this

Focus on high percentiles for user experience
Tail latency can significantly impact overall system performance
```

### Consistency

**Definition**: All nodes see the same data at the same time.

**Consistency Models**:

**Strong Consistency**

```
Guarantees:
- All reads receive the most recent write
- All nodes see identical data simultaneously
- ACID properties maintained

Trade-offs:
+ Data accuracy guaranteed
- Higher latency
- Reduced availability during partitions
- Scalability limitations

Use Cases: Financial transactions, inventory management
```

**Eventual Consistency**

```
Guarantees:
- System will become consistent over time
- No guarantees on convergence timing
- Temporary inconsistencies allowed

Trade-offs:
+ Better performance and availability
+ Improved scalability
- Complex application logic
- User experience considerations

Use Cases: Social media feeds, DNS, email systems
```

**Weak Consistency**

```
Guarantees:
- Best effort consistency
- No timing guarantees
- Applications handle inconsistencies

Trade-offs:
+ Highest performance
+ Maximum availability
- Complex error handling
- Potential data loss scenarios

Use Cases: Real-time gaming, live streaming, sensor data
```

## Key Design Principles

### Keep Data Close

- Reduce latency by minimizing the distance between data and application.
- Use **caching** and **content delivery networks (CDNs)**.

### Minimize Latency

- Avoid unnecessary network calls.
- Store frequently accessed data in-memory.
- Replicate data geographically.

## System Design Techniques

### Indexing

- Use indexes to speed up query performance.
- Trade-off: Increases write latency and storage overhead.

### Caching

- Store frequently accessed data in faster storage layers.
- Tools: Redis, Memcached.

### Sharding (Horizontal Partitioning)

- Split data across multiple databases to distribute load.
- Beware of **hot keys** and **join limitations**.

### Vertical Partitioning

- Divide a table's columns into different physical storage.
- Helps optimize read/write patterns.

### Connection Pooling

- Reuse existing database connections to reduce overhead.

## Architectural Patterns

### Three-Tier Architecture

- **Presentation Tier**: User interface.
- **Application Tier**: Business logic.
- **Data Tier**: Data storage and management.

### MapReduce

- Distributed computation model for processing large data sets.
- Frameworks: Hadoop, Spark.

### Asynchronous Processing

- Use message queues (e.g., RabbitMQ, Kafka) for non-blocking operations.

### Rate Limiting

- Control the number of requests to protect APIs from overuse and abuse.

## Scaling: Horizontal vs Vertical

| Scaling Type       | Description                       | Example                      |
| ------------------ | --------------------------------- | ---------------------------- |
| Horizontal Scaling | Adding more servers (nodes)       | Adding more web servers      |
| Vertical Scaling   | Adding more resources to a server | Increasing server RAM or CPU |

## Latency: Key Takeaways

- **Cache frequently accessed data**.
- **Use CDNs** to serve static content.
- **Replicate data** across regions for disaster recovery and lower latency.

**Latency Numbers**

| Access Type       | Time             | Converted Time |
| ----------------- | ---------------- | -------------- |
| CPU Cycle         | 0.3 ns           | 1 S            |
| CPU L1 Cache      | 1 ns             | 3 S            |
| CPU L2 Cache      | 3 ns             | 9 S            |
| CPU L3 Cache      | 13 ns            | 43 S           |
| Main Memory (RAM) | 120 ns           | 6 minutes      |
| SSD               | 150 microseconds | 6 days         |
| HDD               | 10 ms            | 12 months      |
| SF to NYC         | 40 ms            | 4 years        |
| SF to Australia   | 183 ms           | 19 years       |

## Common Numbers Developers Should Know

| Operation                          | Latency Estimate |
| ---------------------------------- | ---------------- |
| L1 cache reference                 | \~0.5 ns         |
| SSD random read                    | \~150 μs         |
| Round trip within same data center | \~0.5 ms         |
| Round trip US to Europe            | \~75 ms          |

_Reference: "Latency Numbers Every Programmer Should Know"_

## Data Size Basics

| Type           | Size Estimate |
| -------------- | ------------- |
| Char           | 1 byte        |
| Integer        | 4 bytes       |
| Unix Timestamp | 4 bytes       |

- 8 bits → 1 byte
- 1024 bytes → 1 kilobyte
- 1024 kilobytes → 1 megabyte
- 1024 megabytes → 1 gigabyte
- 1024 gigabytes → 1 terabyte

### Time

60 Seconds × 60 Minutes = 3600 Seconds per Hour
3600 × 24 hours = 86400 Seconds per Day
86400 × 30 days = 2,500,000 seconds per Month

### Traffic

- **Estimate total number of requests app will receive**
- **Average Daily Active Users × average reads/writes per user**

10 Million DAU × 30 photos viewed = 300 Million Photo Requests
10 Million DAU × 1 photo upload = 10 Million Photo Writes

300 Million Requests ÷ 86400 = 3472 Requests per Second
10 Million Writes ÷ 86400 = 115 Writes per Second

### Memory

- **Read Requests per day x Average Request size x 0.2**

300 Million Requests × 500 Bytes = 150 Gigabytes
150GB × 0.2 (20%) = 30 Gigabytes
30GB × 3 (replication) = 90 Gigabytes

### Bandwidth

- **Requests per day x Request size**

300 Million Requests × 1.5MB = 450,000 Gigabytes
450,000GB ÷ 86400 seconds = 5.2GB per second

### Storage

- **Writes per day x Size of write x Time to store data**

10 Million Writes × 1.5MB = 15 TB per day
15TB × 365 days × 10 years = 55 Petabytes

## System Design Considerations

- Identify bottlenecks.
- Prioritize scalability and availability according to business requirements.
- Design for **failure** (assume components will fail and plan recovery).
- Apply **CAP Theorem**:

  - You can only choose two out of **Consistency**, **Availability**, and **Partition Tolerance** in distributed systems.

## Useful Tools and Resources

- **High Scalability Blog**: [highscalability.com](http://highscalability.com/)
- **System Design Primer**: [GitHub](https://github.com/donnemartin/system-design-primer)
- **Awesome System Design**: [GitHub](https://github.com/madd86/awesome-system-design)
- **FreeCodeCamp Guide**: [Systems Design for Interviews](https://www.freecodecamp.org/news/systems-design-for-interviews/)

## Summary

System design requires careful consideration of scalability, availability, reliability, efficiency, and maintainability. By applying best practices and architectural patterns, engineers can build robust and efficient systems capable of handling real-world demands.

## Useful links

[http://highscalability.com/](http://highscalability.com/)

[https://github.com/donnemartin/system-design-primer](https://github.com/donnemartin/system-design-primer)

[https://github.com/madd86/awesome-system-design](https://github.com/madd86/awesome-system-design)

[https://blog.pramp.com/how-to-succeed-in-a-system-design-interview-27b35de0df26](https://blog.pramp.com/how-to-succeed-in-a-system-design-interview-27b35de0df26)

[https://www.systemdesignnotes.com/](https://www.systemdesignnotes.com/)

[https://www.freecodecamp.org/news/systems-design-for-interviews/](https://www.freecodecamp.org/news/systems-design-for-interviews/)

[https://medium.com/the-andela-way/system-design-in-software-development-f360ce6fcbb9](https://medium.com/the-andela-way/system-design-in-software-development-f360ce6fcbb9)

[https://www.interviewbit.com/courses/system-design/](https://www.interviewbit.com/courses/system-design/)

[https://www.codemag.com/Article/1909071/Design-Patterns-for-Distributed-Systems](https://www.codemag.com/Article/1909071/Design-Patterns-for-Distributed-Systems)

[https://github.com/donnemartin/system-design-primer#study-guide](https://github.com/donnemartin/system-design-primer#study-guide)

[https://github.com/donnemartin/system-design-primer#how-to-approach-a-system-design-interview-question](https://github.com/donnemartin/system-design-primer#how-to-approach-a-system-design-interview-question)

[https://github.com/donnemartin/system-design-primer#system-design-interview-questions-with-solutions](https://github.com/donnemartin/system-design-primer#system-design-interview-questions-with-solutions)

[https://github.com/donnemartin/system-design-primer#object-oriented-design-interview-questions-with-solutions](https://github.com/donnemartin/system-design-primer#object-oriented-design-interview-questions-with-solutions)

[https://github.com/donnemartin/system-design-primer#additional-system-design-interview-questions](https://github.com/donnemartin/system-design-primer#additional-system-design-interview-questions)

[https://www.teamblind.com/post/Giving-back---how-I-cleared-L6-System-Design---Part-1-4yufM3RY](https://www.teamblind.com/post/Giving-back---how-I-cleared-L6-System-Design---Part-1-4yufM3RY)

[https://www.youtube.com/channel/UC9vLsnF6QPYuH51njmIooCQ](https://www.youtube.com/channel/UC9vLsnF6QPYuH51njmIooCQ)

[https://www.youtube.com/channel/UCn1XnDWhsLS5URXTi5wtFTA](https://www.youtube.com/channel/UCn1XnDWhsLS5URXTi5wtFTA)

[https://www.youtube.com/channel/UCRPMAqdtSgd0Ipeef7iFsKw](https://www.youtube.com/channel/UCRPMAqdtSgd0Ipeef7iFsKw)

[https://www.youtube.com/watch?v=DSGsa0pu8-k](https://www.youtube.com/watch?v=DSGsa0pu8-k)

[https://www.youtube.com/watch?v=ZgdS0EUmn70](https://www.youtube.com/watch?v=ZgdS0EUmn70)

[https://www.youtube.com/watch?v=MbjObHmDbZo&list=PLouYZxI9X31w4soyXyMjvHTTZTQAF_2nn&index=3&t=227s](https://www.youtube.com/watch?v=MbjObHmDbZo&list=PLouYZxI9X31w4soyXyMjvHTTZTQAF_2nn&index=3&t=227s)
