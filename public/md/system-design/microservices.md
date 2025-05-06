# Microservices

## What Are Microservices?

Microservices Architecture is a software design approach where an application is composed of small, independent services that are:

- Focused on a specific business capability
- Loosely coupled and independently deployable
- Autonomous in data storage and lifecycle
- Developed and maintained by small, cross-functional teams

## Monolithic vs SOA vs Microservices

| Architecture  | Description                                                                          |
| ------------- | ------------------------------------------------------------------------------------ |
| Monolithic    | Single unit, tightly coupled                                                         |
| SOA           | Services communicate over an enterprise service bus (ESB)                            |
| Microservices | Independent services communicating via lightweight protocols (REST, gRPC, messaging) |

## Key Features

- Decoupling: Enables flexibility and ease of change
- Componentization: Services can be replaced or upgraded independently
- Business Capability Alignment: Each service focuses on a single responsibility
- Team Autonomy: Small teams manage individual services
- Continuous Delivery: Supports frequent software releases
- Decentralized Governance and Data: Teams choose tools and manage data independently

## Core Components

- API Gateway
- Containers and Orchestration (Docker, Kubernetes)
- Service Discovery (Eureka, Consul)
- Message Brokers (Kafka, RabbitMQ)
- Cloud Infrastructure
- Infrastructure as Code (IaC)

## Spring Boot and Spring Cloud

Spring Boot simplifies the creation of production-ready Spring applications.

Spring Cloud provides tools for distributed systems including service discovery, load balancing, resilience, and configuration management.

Spring Boot Actuator offers REST endpoints for monitoring and managing applications.

## Communication Between Services

| Communication Type | Examples                            |
| ------------------ | ----------------------------------- |
| Synchronous        | REST, gRPC                          |
| Asynchronous       | Messaging systems (Kafka, RabbitMQ) |

## Testing Pyramid

| Layer  | Tests                           | Priority |
| ------ | ------------------------------- | -------- |
| Bottom | Unit tests, performance tests   | Highest  |
| Middle | Integration tests, stress tests | Moderate |
| Top    | Acceptance tests, UI tests      | Lowest   |

Mike Cohn’s Test Pyramid recommends maximizing unit tests and minimizing slower end-to-end tests.

## Design Principles

- High Cohesion and Loose Coupling
- Bounded Context (Domain-Driven Design)
- Idempotence to ensure repeatable operations
- Semantic Monitoring for business-process level testing
- Continuous Monitoring for real-time system visibility

## Benefits

- Independent deployment
- Scalability and agility
- Fault isolation
- Technology diversity
- Enhanced team autonomy

## Challenges

- Complex testing and monitoring
- Operational overhead
- Latency and network failures
- Security management
- Requires experienced development teams

## Common Tools

| Purpose           | Tools           |
| ----------------- | --------------- |
| Mocking           | Wiremock        |
| Containers        | Docker          |
| Resilience        | Hystrix         |
| Service Discovery | Eureka          |
| Messaging         | Kafka, RabbitMQ |

## Advanced Concepts

PACT and Consumer-Driven Contracts (CDC) for safe integration testing

Reactive Extensions (Rx) for combining multiple asynchronous calls

OAuth for secure authorization

Distributed Transactions should be avoided; use compensation patterns instead

Containers enable resource-efficient deployment (Docker, Kubernetes)

## Domain-Driven Design (DDD) and Microservices

- Align services with business domains
- Use Bounded Contexts to isolate domain models per service
- Promote modularity and clarity

## End-to-End Testing

End-to-end testing validates the cooperation of multiple services to ensure the complete user journey functions as expected.

## Monitoring and Dashboards

- Health monitoring
- Deployment tracking
- Change auditing
- Dependency visualization

## Summary

Microservices enable scalable, resilient, and agile software development by decomposing applications into independently deployable services. While they offer significant benefits, they also introduce complexity requiring experienced teams, robust testing strategies, and effective monitoring.

![https://microservices.io/i/MicroservicePatternLanguage.jpg](https://microservices.io/i/MicroservicePatternLanguage.jpg)

![https://s3.ap-south-1.amazonaws.com/myinterviewtrainer-domestic/public_assets/assets/000/000/704/original/Microservices_Interview.jpg?1626854337](https://s3.ap-south-1.amazonaws.com/myinterviewtrainer-domestic/public_assets/assets/000/000/704/original/Microservices_Interview.jpg?1626854337)

![https://s3.ap-south-1.amazonaws.com/myinterviewtrainer-domestic/public_assets/assets/000/000/727/original/features_of_Microservices.jpg?1626881999](https://s3.ap-south-1.amazonaws.com/myinterviewtrainer-domestic/public_assets/assets/000/000/727/original/features_of_Microservices.jpg?1626881999)

![https://s3.ap-south-1.amazonaws.com/myinterviewtrainer-domestic/public_assets/assets/000/000/722/original/Spring_Cloud.jpg?1626879524](https://s3.ap-south-1.amazonaws.com/myinterviewtrainer-domestic/public_assets/assets/000/000/722/original/Spring_Cloud.jpg?1626879524)

![https://s3.ap-south-1.amazonaws.com/myinterviewtrainer-domestic/public_assets/assets/000/000/724/original/Cohesion_and_Coupling.jpg?1626880158](https://s3.ap-south-1.amazonaws.com/myinterviewtrainer-domestic/public_assets/assets/000/000/724/original/Cohesion_and_Coupling.jpg?1626880158)

![https://s3.ap-south-1.amazonaws.com/myinterviewtrainer-domestic/public_assets/assets/000/000/725/original/Bounded_Context.jpg?1626880284](https://s3.ap-south-1.amazonaws.com/myinterviewtrainer-domestic/public_assets/assets/000/000/725/original/Bounded_Context.jpg?1626880284)

![https://s3.ap-south-1.amazonaws.com/myinterviewtrainer-domestic/public_assets/assets/000/000/726/original/Domain_driven_design.jpg?1626881958](https://s3.ap-south-1.amazonaws.com/myinterviewtrainer-domestic/public_assets/assets/000/000/726/original/Domain_driven_design.jpg?1626881958)

![https://s3.ap-south-1.amazonaws.com/myinterviewtrainer-domestic/public_assets/assets/000/000/728/original/explain-type-of-tests-mostly-used-in-microservices.jpg?1626883218](https://s3.ap-south-1.amazonaws.com/myinterviewtrainer-domestic/public_assets/assets/000/000/728/original/explain-type-of-tests-mostly-used-in-microservices.jpg?1626883218)

![https://s3.ap-south-1.amazonaws.com/myinterviewtrainer-domestic/public_assets/assets/000/000/729/original/Mike_Cohn%E2%80%99s_Test_Pyramid.jpg?1626883363](https://s3.ap-south-1.amazonaws.com/myinterviewtrainer-domestic/public_assets/assets/000/000/729/original/Mike_Cohn%E2%80%99s_Test_Pyramid.jpg?1626883363)

![https://s3.ap-south-1.amazonaws.com/myinterviewtrainer-domestic/public_assets/assets/000/000/730/original/Explain_Container_in_Microservices.jpg?1626883462](https://s3.ap-south-1.amazonaws.com/myinterviewtrainer-domestic/public_assets/assets/000/000/730/original/Explain_Container_in_Microservices.jpg?1626883462)
