# Load balancer

[https://www.nginx.com/resources/glossary/load-balancing/](https://www.nginx.com/resources/glossary/load-balancing/)

- Balance incoming traffic to multiple servers
- Software or hardware based
- Used to improve reliability and scalability of the applicaion
- Nginx, HAProxy, F5, Citrix

![lb-simple-website](./images/lb-simple-website.png)

![lb-basic-setup](./images/lb-basic-setup.png)

![https://www.nginx.com/wp-content/uploads/2014/07/what-is-load-balancing-diagram-NGINX.png](https://www.nginx.com/wp-content/uploads/2014/07/what-is-load-balancing-diagram-NGINX.png)

### Load Balancing Algorithms (Routing Methods)

Different load balancing algorithms provide different benefits; the choice of load balancing method depends on your needs:

- **Round Robin** – Requests are distributed across the group of servers sequentially.
    - Simple type of routing
    - Can result in uneven traffic
- **Least Connections** – A new request is sent to the server with the fewest current connections to clients. The relative computing capacity of each server is factored into determining which one has the least connections.
    - Routes based on number of clients connections to server
    - Useful for chat or streaming applications
- **Least Time** – Sends requests to the server selected by a formula that combines thefastest response time and fewest active connections. Exclusive to NGINX Plus.
    - Routes based on how quickly servers respond
- **Hash** – Distributes requests based on a key you define, such as the client IP address orthe request URL. NGINX Plus can optionally apply a consistent hash to minimize redistributionof loads if the set of upstream servers changes.
- **IP Hash** – The IP address of the client is used to determine which server receives the request.
    - Routes client to server based on IP
    - Useful for stateful sessions
- **Random with Two Choices** – Picks two servers at random and sends the request to theone that is selected by then applying the Least Connections algorithm (or for NGINX Plusthe Least Time algorithm, if so configured).

## Layer 4 and 7

- Layer 4
    - Only has access to TCP and UDP data
    - Faster
    - Lack of information can lead to uneven traffic
- Layer 7
    - Full access to HTTP protocol and data
    - SSL termination
    - Check for authentication
    - Smarter routing options

![lb-redundant-setup](./images/lb-redundant-setup.png)

## Consistent hashing

Consistent Hashing is a distributed hashing scheme that operates independently of the number of servers or objects in a distributed *hash table* by assigning them a position on an abstract circle, or *hash ring*. This allows servers and objects to scale without affecting the overall system.