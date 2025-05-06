# HTTP in System Design

HTTP (HyperText Transfer Protocol) is the foundation of web communication. In system design, understanding how HTTP operates and how to optimize its use is essential for building scalable, reliable, and performant applications.

## Key Characteristics

| Feature       | Description                                                                         |
| ------------- | ----------------------------------------------------------------------------------- |
| Protocol Type | Stateless request-response protocol                                                 |
| Methods       | GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD                                        |
| Headers       | Provide meta-information about requests and responses                               |
| Status Codes  | 1xx Informational, 2xx Success, 3xx Redirection, 4xx Client Error, 5xx Server Error |
| Statelessness | Each request is independent; no client context is stored on the server              |

## HTTP Versions

| Version  | Key Features                                                                      |
| -------- | --------------------------------------------------------------------------------- |
| HTTP/1.1 | Persistent connections (keep-alive), pipelining, but no true multiplexing         |
| HTTP/2   | Multiplexing, header compression (HPACK), stream prioritization                   |
| HTTP/3   | Uses QUIC over UDP, multiplexing without head-of-line blocking, improved security |

## Real-Time Communication Techniques

### Long Polling

**Definition**
A strategy where the client sends a request to the server and the server holds the connection open until new data is available or a timeout is reached. Once data is sent, the client immediately sends a new request.

**Advantages**

- Simple to implement.
- Compatible with older browsers and HTTP infrastructure.

**Disadvantages**

- Higher server resource usage under load.
- Increased latency compared to more modern solutions.

**Use Cases**

- Notifications
- Chat applications
- Systems where WebSockets are not feasible

### WebSockets

**Full-duplex communication** channel over a single persistent TCP connection. Reduces overhead compared to repeated HTTP requests.

**Use Cases**

- Real-time dashboards
- Collaborative apps
- Online gaming

### Server-Sent Events (SSE)

**One-way streaming** from the server to the client. Ideal for continuous updates.

**Use Cases**

- News feeds
- Social media updates
- Stock tickers

## HTTP and Caching

Caching reduces latency and minimizes load on backend systems.

| Mechanism     | Description                                                 |
| ------------- | ----------------------------------------------------------- |
| Cache-Control | Directives for caching mechanisms in requests and responses |
| ETag          | Unique identifier for a specific version of a resource      |
| Last-Modified | Timestamp of last resource modification                     |

**Common Caching Layers**

- Browser cache
- CDN (Content Delivery Network)
- Reverse proxy cache (e.g., Varnish, NGINX)

## Load Balancing and HTTP

HTTP traffic is often balanced across multiple servers to ensure scalability and reliability.

| Algorithm         | Description                                      |
| ----------------- | ------------------------------------------------ |
| Round Robin       | Requests distributed sequentially                |
| Least Connections | Routes to server with fewest active connections  |
| IP Hash           | Uses client IP to consistently route to a server |

## REST vs GraphQL vs gRPC

| Protocol | Description                        | Use Case                                     |
| -------- | ---------------------------------- | -------------------------------------------- |
| REST     | Stateless, resource-based HTTP API | CRUD operations, public APIs                 |
| GraphQL  | Flexible query language over HTTP  | Front-end driven data fetching requirements  |
| gRPC     | High-performance RPC over HTTP/2   | Low-latency service-to-service communication |

## Security Considerations

- Use HTTPS for encrypted communication.
- Implement proper authentication and authorization.
- Protect against common HTTP vulnerabilities (e.g., injection attacks, CSRF).

## Key Takeaways

- **HTTP is stateless**: Use mechanisms like cookies, tokens, or headers to maintain client state.
- **Latency matters**: HTTP/2 and HTTP/3 offer significant performance improvements.
- **Choose the right real-time strategy**: Long Polling, WebSockets, or SSE depending on use case.
- **Cache strategically**: Reduce backend load and improve response times.
- **Consider advanced patterns**: Like REST, GraphQL, or gRPC based on system requirements.
