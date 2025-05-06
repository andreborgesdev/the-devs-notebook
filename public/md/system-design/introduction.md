# System Design

## Introduction

**System Design** involves defining the architecture, components, modules, interfaces, and data for a system to satisfy specified requirements. It plays a crucial role in building scalable, reliable, and maintainable software systems.

## Core Performance Metrics

### Scalability

- Ability of a system to handle growth in users, requests, or data.
- Two types:

  - **Horizontal scaling**: Adding more servers.
  - **Vertical scaling**: Adding more resources (CPU/RAM) to existing servers.

### Reliability

- Probability that a system will perform without failure over a period.
- Common metric: **Mean Time Between Failures (MTBF)**.

**MTBF = (Total Elapsed Time - total downtime) / number of failures**

Example: (24 hours - 4 hours downtime) / 4 failures = 5 hour MTBF

### Availability

- Percentage of time the system is operational.
- **Availability (%) = Uptime / (Uptime + Downtime) × 100 or (available time / total time) × 100**.
- **Highly available systems** use redundancy and failover strategies.

Example: ( 23 hours / 24 hours ) × 100 = 95.83%

**Downtime Table for Availability ("Nines")**

| Availability | Annual Downtime              |
| ------------ | ---------------------------- |
| 99%          | 3 days, 15 hours, 40 minutes |
| 99.9%        | 8 hours, 46 minutes          |
| 99.99%       | 52 minutes, 36 seconds       |
| 99.999%      | 5.26 minutes                 |

### Efficiency

- Measures how well the system utilizes resources.
- Key metrics: **Latency** (response time) and **Throughput** (requests processed per second).

### Manageability

- How easily the system can be monitored, maintained, and debugged.
- Good observability and clear logging are essential.

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
