# WebSockets in System Design

**WebSockets** provide a full-duplex communication channel over a single, long-lived TCP connection. This technology enables real-time, bidirectional communication between clients and servers, making it a critical tool in modern system design for applications requiring low-latency updates.

## What Are WebSockets?

The **WebSocket API** allows the establishment of a persistent connection between a client (typically a browser) and a server. Once established, both parties can send data to each other at any time without the overhead of repeatedly opening and closing connections, as required in traditional HTTP request-response models.

| Protocol | ws\:// (unencrypted) or wss\:// (encrypted over TLS/SSL) |
| -------- | -------------------------------------------------------- |

## How WebSockets Work

1. **Handshake**:
   Initiated by the client using an HTTP/HTTPS request upgraded to the WebSocket protocol.
2. **Connection Upgrade**:
   Server acknowledges and upgrades the connection.
3. **Persistent Communication**:
   Client and server exchange messages asynchronously over the open connection.

## Advantages

- **Low latency**: No need for repeated HTTP requests.
- **Reduced overhead**: Eliminates the need for HTTP headers after the initial handshake.
- **Full-duplex**: Both server and client can send messages independently.
- **Real-time communication**: Ideal for apps requiring instant updates.

## Use Cases

| Use Case                | Examples                    |
| ----------------------- | --------------------------- |
| Real-time collaboration | Google Docs, Figma          |
| Messaging & Chat        | Slack, WhatsApp Web         |
| Online gaming           | Multiplayer games           |
| Financial platforms     | Stock tickers, trading apps |
| Live notifications      | News feeds, sports updates  |

## WebSockets vs Long Polling

| Feature    | WebSockets                      | Long Polling                        |
| ---------- | ------------------------------- | ----------------------------------- |
| Connection | Persistent                      | Re-established per message          |
| Latency    | Low                             | Higher due to request/response loop |
| Overhead   | Minimal after initial handshake | Higher due to repeated HTTP headers |
| Complexity | Moderate                        | Simple to implement                 |

## Scalability Considerations

- **Connection limits**: Each WebSocket connection consumes server resources (memory and file descriptors).
- **Load balancing**: Sticky sessions or connection-aware load balancers are often required.
- **Horizontal scaling**: Distributed systems must manage state (e.g., via Redis or pub/sub mechanisms).

## Security Considerations

- Use **wss\://** for encrypted communication.
- Validate all incoming messages to prevent injection attacks.
- Implement rate limiting and connection throttling to prevent abuse.

## Design Best Practices

- Use **heartbeat** or **ping/pong** mechanisms to detect dead connections.
- Employ **backpressure** strategies to avoid overwhelming clients or servers.
- Consider **graceful degradation** (fallback to long polling) for environments not supporting WebSockets.
- Use protocols like **Socket.IO** or **SignalR** for robust fallback and feature support.

## Alternatives

| Protocol                 | Best For                             |
| ------------------------ | ------------------------------------ |
| Server-Sent Events (SSE) | One-way streaming updates            |
| HTTP/2 Streams           | Multiplexed streaming over HTTP      |
| WebRTC                   | Peer-to-peer media and data channels |

## Key Takeaways

- WebSockets are essential for **real-time**, **bidirectional**, **low-latency** communication.
- While powerful, they introduce scalability and state management challenges.
- Proper implementation and infrastructure planning are vital for production use.
