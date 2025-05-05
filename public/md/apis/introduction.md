# APIs

Application Programming Interfaces (APIs) allow software systems to communicate over defined protocols, typically using **HTTP** for web-based RESTful services.

## RESTful Web Services

**REST (Representational State Transfer)** is an architectural style using HTTP to access and manipulate resources represented as data (usually JSON or XML).

**Key REST constraints:**

- **Stateless**: Each request from client to server must contain all necessary information.
- **Cacheable**: Resources can declare themselves cacheable to improve performance.
- **Client-Server**: Separation of concerns between UI and data storage.
- **Uniform Interface**: Standardized methods like GET, POST, PUT, DELETE.
- **Layered System**: Intermediary servers can improve scalability.

## REST Resources

Every piece of content (object, data, or service) exposed by a REST API is a **resource**.

**Resource Identification**:

- Uniquely identified by **URI (Uniform Resource Identifier)**.

```text
https://api.example.com/users/123
```

## HTTP Methods

| Method  | CRUD Mapping   | Idempotent | Safe | Description                 |
| ------- | -------------- | ---------- | ---- | --------------------------- |
| GET     | Read           | Yes        | Yes  | Retrieve resource data      |
| POST    | Create         | No         | No   | Create a new resource       |
| PUT     | Update/Replace | Yes        | No   | Update or create resource   |
| PATCH   | Update/Partial | No         | No   | Partially update a resource |
| DELETE  | Delete         | Yes        | No   | Remove a resource           |
| OPTIONS | -              | Yes        | Yes  | Get supported operations    |

## Idempotent HTTP Methods

A method is **idempotent** if making the same request multiple times results in the same server state.

- **Idempotent**: GET, PUT, DELETE
- **Not Idempotent**: POST, PATCH

**Example**:
Deleting a resource multiple times still results in the resource being deleted (or not found), so DELETE is idempotent.

## URI Design Best Practices

- Use **plural nouns**: `/users` not `/user`.
- Use **lowercase** letters.
- Use **hyphens (-)** to separate words.
- Use **forward slashes (/)** for hierarchy.
- Avoid using HTTP method names in URIs.

```text
GET /users/123/addresses
```

## HTTP Status Codes

| Code | Meaning               |
| ---- | --------------------- |
| 200  | OK                    |
| 201  | Created               |
| 204  | No Content            |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 500  | Internal Server Error |
| 502  | Bad Gateway           |
| 503  | Service Unavailable   |

## Statelessness

Each API request is independent. No client context is stored on the server between requests.

```text
Good for scalability and caching.
```

## REST vs SOAP

| Feature         | REST              | SOAP               |
| --------------- | ----------------- | ------------------ |
| Protocol        | HTTP              | HTTP, SMTP, more   |
| Data Format     | JSON, XML, others | XML only           |
| Simplicity      | Simple            | Complex            |
| Performance     | Lightweight       | Heavier due to XML |
| Caching Support | Yes               | No                 |
| Security        | SSL/TLS, OAuth    | WS-Security        |

## REST vs WebSockets

| Feature       | REST             | WebSockets              |
| ------------- | ---------------- | ----------------------- |
| Communication | Request/Response | Full-duplex             |
| State         | Stateless        | Stateful                |
| Use Case      | CRUD operations  | Real-time communication |

## Payload & Messaging

- **Payload**: Data sent in the request body (mainly for POST, PUT, PATCH).
- **Messaging**: Exchange of data between client and server via HTTP requests and responses.

## API Versioning

To prevent breaking changes, version your APIs:

```text
/v1/users/123
```

## Security Considerations

- **HTTPS**: Always secure data transmission.
- **Authentication**: Basic Auth, OAuth2, JWT.
- **Rate Limiting**: Prevent abuse.
- **Input Validation**: Prevent injections and attacks.

## Error Handling Best Practices

- Return proper **status codes**.
- Include helpful **error messages**.
- Do not expose sensitive details in error responses.

```json
{
  "error": "Invalid input data",
  "code": 400
}
```

## Caching

Use HTTP headers like `Cache-Control` and `ETag` to minimize server load and latency.

## Safe vs Idempotent Methods

| Method | Safe | Idempotent |
| ------ | ---- | ---------- |
| GET    | Yes  | Yes        |
| POST   | No   | No         |
| PUT    | No   | Yes        |
| DELETE | No   | Yes        |

## Testing REST APIs

**Tools**:

- **Postman**: Request testing and automation.
- **Swagger**: API documentation and testing.
- **JMeter**: Performance testing.

## Common Integration Styles

- **Shared Database**
- **Batch File Transfer**
- **Remote Procedure Calls (RPC)**
- **Asynchronous Messaging (MOM)**
