# Networking

## Overview

**Computer Networking** involves the exchange of data between computing devices over shared media. Networks allow resource sharing, communication, and distributed computing.

---

## OSI Model (Open Systems Interconnection)

| Layer | Name         | Description                                    |
| ----- | ------------ | ---------------------------------------------- |
| 7     | Application  | Network process to application (HTTP, SMTP)    |
| 6     | Presentation | Data representation and encryption (SSL/TLS)   |
| 5     | Session      | Establish, manage, and terminate sessions      |
| 4     | Transport    | Reliable delivery (TCP/UDP)                    |
| 3     | Network      | Path determination and logical addressing (IP) |
| 2     | Data Link    | MAC addressing, switches, error detection      |
| 1     | Physical     | Transmission media and signaling               |

### Key Concepts:

- **Encapsulation**: Each layer adds its own header.
- **Segmentation and Reassembly**: Performed by Transport Layer.

---

## TCP/IP Model

| Layer | OSI Equivalent          | Protocols                    |
| ----- | ----------------------- | ---------------------------- |
| 4     | Application (7-5)       | HTTP/S, FTP, SMTP, DNS, DHCP |
| 3     | Transport (4)           | TCP, UDP                     |
| 2     | Internet (3)            | IP, ICMP, ARP                |
| 1     | Network Interface (2-1) | Ethernet, Wi-Fi              |

**TCP/IP** is the foundational protocol suite of the Internet.

---

## Core Networking Protocols

### DNS (Domain Name System)

- Resolves human-readable domain names (e.g., `example.com`) to IP addresses.
- Hierarchical structure (root, TLD, domain).

### DHCP (Dynamic Host Configuration Protocol)

- Dynamically assigns IP addresses and other network configuration to devices.

### HTTP/HTTPS (HyperText Transfer Protocol / Secure)

- **HTTP**: Application layer protocol for distributed, collaborative hypermedia.
- **HTTPS**: Adds SSL/TLS encryption for secure communication.

---

## Firewalls and Proxies

### Firewalls

- Control incoming and outgoing network traffic based on security rules.
- Can operate at various OSI layers (packet filtering, stateful inspection).

### Proxies

- Act as intermediaries for requests between clients and servers.
- Types: Forward Proxy, Reverse Proxy.
- Functions: Caching, access control, load balancing.

---

## Load Balancing and Redundancy

**Purpose**: Distribute network or application traffic across multiple servers to ensure reliability and scalability.

### Common Algorithms:

- **Round Robin**
- **Least Connections**
- **IP Hash**
- **Least Response Time**

### Layers:

- **Layer 4 Load Balancing**: TCP/UDP level.
- **Layer 7 Load Balancing**: HTTP/S level (content-based routing).

**Redundancy**: Duplicate systems and components to ensure availability during failures.

```plaintext
[ Client Requests ]
        ↓
[ Load Balancer ]
        ↓
[ Multiple Servers (Redundant) ]
```

---

## CDN (Content Delivery Network)

**Concept**: Distributed network of proxy servers deployed globally to cache and deliver content closer to users.

### Benefits:

- Reduce latency by serving data from nearby locations.
- Save bandwidth and reduce server load.
- Improve redundancy and reliability.

### Popular CDNs:

- Cloudflare
- AWS CloudFront
- Google Cloud CDN
- Akamai

---

## Network Address Translation (NAT)

- Allows multiple devices on a local network to share a single public IP.
- Modifies IP header information in packets during transmission.

---

## Ports and Sockets

| Protocol | Default Port |
| -------- | ------------ |
| HTTP     | 80           |
| HTTPS    | 443          |
| FTP      | 21           |
| SSH      | 22           |
| DNS      | 53           |

**Socket** = IP Address + Port Number

---

## Transport Protocols

| Protocol | Description                                     |
| -------- | ----------------------------------------------- |
| TCP      | Reliable, connection-oriented, ordered delivery |
| UDP      | Connectionless, faster but no guarantees        |

**Use Case**:

- **TCP**: Web browsing, email.
- **UDP**: Streaming, gaming.

---

## Additional Concepts

### IP Addressing

- **IPv4**: 32-bit address (e.g., 192.168.0.1).
- **IPv6**: 128-bit address for scalability.

### ARP (Address Resolution Protocol)

- Resolves IP addresses to MAC addresses.

### ICMP (Internet Control Message Protocol)

- Used for error messages and diagnostics (e.g., ping).

---

## Summary

Understanding networking is critical for system design, cloud architecture, and software engineering. Key areas include:

- OSI and TCP/IP models
- Core protocols (DNS, DHCP, HTTP/S)
- Firewalls and proxies
- Load balancing and redundancy
- CDN principles
- Ports, sockets, and transport protocols
