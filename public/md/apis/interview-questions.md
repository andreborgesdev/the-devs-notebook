## REST Interview Questions & Answers

### What does it mean for an HTTP method to be idempotent?

An HTTP method is **idempotent** if making identical requests multiple times results in the same server state. Examples include GET, HEAD, PUT, and DELETE. POST is not idempotent.

### What is REST?

REST (Representational State Transfer) is an architectural style for building web services that use HTTP for communication. REST emphasizes statelessness, scalability, and a uniform interface.

### What is a REST Resource?

A REST resource represents any content exposed by a RESTful service, such as text, images, or data. Each resource is identified by a URI.

### What is a URI?

A **Uniform Resource Identifier (URI)** uniquely identifies resources:

```plaintext
<protocol>://<service-name>/<ResourceType>/<ResourceID>
```

### What are the key features of RESTful web services?

- Client-Server model
- Uses HTTP protocol
- Stateless communication
- Cacheable
- Resource identification through URIs
- Supports multiple data formats (JSON, XML)

### What is statelessness in REST?

The server does not store client session information. Each request contains all the necessary information for processing.

### What is JAX-RS?

**Java API for RESTful Web Services (JAX-RS)** is a Java specification for building RESTful services using annotations.

### What are HTTP status codes?

- **2xx**: Success (e.g., 200 OK, 201 Created)
- **4xx**: Client errors (e.g., 400 Bad Request, 404 Not Found)
- **5xx**: Server errors (e.g., 500 Internal Server Error)

### What are the common HTTP methods?

- **GET**: Retrieve data
- **POST**: Create new resources
- **PUT**: Update existing resources
- **DELETE**: Delete resources
- **PATCH**: Partially update resources
- **OPTIONS**: Fetch supported methods

### Are HTTP methods idempotent and safe?

- **Idempotent**: GET, PUT, DELETE, HEAD, OPTIONS, TRACE
- **Safe**: GET, HEAD, OPTIONS (do not modify resources)

### What are some disadvantages of RESTful web services?

- Statelessness limits session management
- Security relies on the underlying HTTP protocol

### What is messaging in REST?

Communication between client and server using HTTP requests and responses.

### How does REST compare to SOAP?

| Feature      | REST                       | SOAP                       |
| ------------ | -------------------------- | -------------------------- |
| Simplicity   | Simple                     | Complex                    |
| Data Formats | Multiple (JSON, XML, etc.) | XML only                   |
| Security     | Inherits from HTTP/HTTPS   | Built-in advanced security |
| Performance  | Fast and lightweight       | Slower due to XML overhead |

### What are URI design best practices?

- Use plural nouns
- Use hyphens or underscores for readability
- Prefer lowercase
- Maintain backward compatibility
- Use appropriate HTTP methods without embedding them in URIs

### What are REST API development best practices?

- Prefer JSON format
- Use proper HTTP methods and status codes
- Implement error handling
- Use pagination and filtering for large datasets
- Implement security (SSL/TLS, role-based access control)
- Use caching where appropriate
- Version APIs using URIs (e.g., /v1/)

### How can REST services be tested?

Tools like Postman, Swagger, and JMeter can be used for functional and performance testing.

### What is the difference between idempotent and safe methods?

- **Safe methods**: Do not alter server state (e.g., GET).
- **Idempotent methods**: May alter state but repeated calls yield the same outcome (e.g., PUT, DELETE).

### What is the difference between PUT and POST?

- **PUT**: Updates or creates a resource at a known URI (idempotent).
- **POST**: Creates a new resource at a server-defined URI (not idempotent).

### What makes REST scalable?

Statelessness enables horizontal scalability as servers do not share session data.

### REST vs Web Sockets?

| Feature       | REST             | Web Sockets       |
| ------------- | ---------------- | ----------------- |
| Communication | Request/Response | Full-duplex       |
| Best for      | CRUD operations  | Real-time updates |

### Can TLS be used in REST?

Yes, REST services can use TLS to encrypt communication and authenticate servers.

### What is payload in REST?

Payload refers to the data sent in the request body, commonly used in POST and PUT requests.

### Is it possible to send payload in GET and DELETE?

No, payloads should not be included in GET and DELETE requests.

### What is HTTP Basic Authentication?

Credentials are sent as a base64-encoded string in the "Authorization" header. It should only be used over HTTPS.

### What factors influence choosing SOAP vs REST?

- **Advanced security**: SOAP
- **Strict contracts**: SOAP
- **Data format flexibility and simplicity**: REST
- **Stateless communication and scalability**: REST

### Can RESTful resources be shared across clients safely?

Yes, new instances of resource handlers are typically created per request, ensuring thread safety.

### How does HTTP Basic Authentication work?

The username and password are combined and base64 encoded, then sent in the `Authorization` header.

### What is the difference between REST and AJAX?

REST is an architectural style for APIs. AJAX is a client-side technique to make asynchronous HTTP requests.

### What is addressing in REST?

Addressing refers to locating resources using URIs.

### What are the core components of an HTTP Request?

- Method
- URI
- HTTP Version
- Headers
- Body (optional)

### What are the core components of an HTTP Response?

- Status Code
- HTTP Version
- Headers
- Body

### What is the maximum payload size in POST methods?

There is no theoretical limit, but practical limits depend on server configuration and bandwidth considerations.

### How can RESTful Web Services be tested?

Tools like Postman, Swagger, and JMeter.

### What are common web service integration styles?

- Shared database
- Batch file transfer
- Remote Procedure Calls (RPC)
- Message-Oriented Middleware (MOM)

### When should you use REST or WebSockets?

Use REST for stateless CRUD operations and WebSockets for real-time, full-duplex communication.

### Can REST APIs handle advanced transactions?

Not directly. For complex transaction management, SOAP or external transaction managers are preferred.
