# Distributed Systems

## What Is a Distributed System?

A **distributed system** is a computing environment where multiple independent components—running on different machines—work together to perform tasks. These components communicate over a network and coordinate actions to achieve a common goal. Complexity is abstracted away from the user, providing the illusion of a single coherent system.

**Key Principle:**
_Avoid distributed systems unless necessary. Added complexity only makes sense when scalability or reliability demands cannot be met by simpler designs._

## Characteristics of Distributed Systems

- **No shared clock:** Nodes do not share a global clock, making synchronization challenging.
- **No shared memory:** Communication occurs via message passing or remote procedure calls (RPC).
- **Shared resources:** Components often share resources like databases or file storage.
- **Concurrency:** Multiple processes execute simultaneously.
- **Consistency:** Maintaining data consistency across nodes is non-trivial.

## Common Challenges

### The Eight Fallacies of Distributed Computing

1. The network is reliable.
2. Latency is zero.
3. Bandwidth is infinite.
4. The network is secure.
5. Topology does not change.
6. There is one administrator.
7. Transport cost is zero.
8. The network is homogeneous.

**Note:**
_Assuming any of these fallacies will likely lead to fragile system designs._

### Communication Issues

- Client cannot locate the server.
- Server crashes mid-request.
- Server response is delayed or lost.
- Client crashes before receiving a response.

**Mitigation:**
Protocols must account for retries, timeouts, and failure detection.

## Benefits

- **Reliability:** Fault tolerance through replication and redundancy.
- **Scalability:** Horizontal scaling to accommodate increased load.
- **Performance:** Reduced latency by distributing work closer to data sources or users.
- **Cost-effectiveness:** Commodity hardware can be used instead of scaling a single expensive server.

## Best Practices

- **Keep It Simple:** Start with monolithic designs and evolve into distributed systems only when necessary.
- **Graceful Degradation:** Design services to handle partial failures.
- **Consistency Models:** Choose between strong consistency, eventual consistency, or custom models based on use case.
- **Observability:** Implement comprehensive logging, monitoring, and tracing.

## Typical Use Cases

- Large-scale web applications (e.g., social networks, e-commerce platforms)
- Data-intensive processing systems (e.g., Hadoop, Spark)
- Distributed databases and file storage (e.g., Cassandra, Amazon S3)
- Microservices architectures
