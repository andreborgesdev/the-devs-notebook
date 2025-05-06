# Load Balancer

## What is a Load Balancer?

A **Load Balancer (LB)** distributes incoming network traffic across multiple backend servers to:

- Improve application **reliability** and **availability**
- Enhance **scalability** by balancing the load
- Prevent any single server from becoming a bottleneck or point of failure

Load balancers can be **software-based** or **hardware-based**.

**Common tools:** NGINX, HAProxy, F5, Citrix

## Key Benefits

- **Distributes client requests** efficiently to avoid overloading any single server
- **Improves fault tolerance** by rerouting traffic if a server fails
- **Enhances scalability** to handle increased user demand
- Supports **zero-downtime deployments** by draining traffic from servers needing maintenance or updates

## Load Balancing Algorithms

| Algorithm                   | Description                                                                                       | Best For                             |
| --------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **Round Robin**             | Sequentially distributes requests to servers                                                      | Simple use cases                     |
| **Least Connections**       | Sends requests to the server with the fewest active connections                                   | Chat, streaming, and real-time apps  |
| **Least Time**              | Chooses server with the fastest response time and fewest active connections (NGINX Plus only)     | Time-sensitive workloads             |
| **Hash**                    | Distributes requests based on a user-defined key (e.g., client IP, request URL)                   | Custom routing needs                 |
| **IP Hash**                 | Assigns clients to servers based on their IP address                                              | Stateful sessions, sticky sessions   |
| **Random with Two Choices** | Picks two servers at random, then uses Least Connections or Least Time to choose the final server | Balanced randomness with performance |

## Load Balancing Layers

| Layer                     | Characteristics                                                                                        |
| ------------------------- | ------------------------------------------------------------------------------------------------------ |
| **Layer 4 (Transport)**   | Works at TCP/UDP level. Fast but limited in routing decisions.                                         |
| **Layer 7 (Application)** | Full access to HTTP/HTTPS protocols. Enables SSL termination, authentication, and intelligent routing. |

## Consistent Hashing

**Consistent Hashing** assigns servers and objects a position on a virtual hash ring:

- Efficiently handles dynamic changes in the number of servers
- Minimizes load redistribution when servers are added or removed
- Useful for **stateful** systems and caching solutions

## Common Deployment Patterns

- **Basic Setup**: Single load balancer distributing traffic to backend servers.
- **Redundant Setup**: Multiple load balancers to avoid single points of failure.

## Example Use Case

**Scenario**: A website receiving high volumes of traffic.

**Solution**:  
Use a load balancer to distribute incoming requests across multiple application servers. Choose **Least Connections** for real-time applications (e.g., chat or video streaming), or **Round Robin** for standard web traffic.

## Visuals

# Redundant LB setup

```plaintext
 User ---> Internet ---> Load Balancers ---> Web Servers ---> Application
                        |
                        |-- example.com (active LB)
                        |
                        |-- Passive (standby LB)
```
