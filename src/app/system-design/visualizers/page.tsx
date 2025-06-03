"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { MermaidDiagram } from "@/src/components/visuals/mermaid-diagram";
import {
  DesignPatternsDemo,
  MicroservicesPatternsDemo,
} from "@/src/components/visuals/concept-visualizer";

export default function SystemDesignVisualizersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">
          System Design Interactive Visualizers
        </h1>
        <p className="text-lg text-muted-foreground">
          Explore system design concepts through interactive visualizations and
          simulations.
        </p>
      </div>

      <Tabs defaultValue="architecture" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
          <TabsTrigger value="scaling">Scaling</TabsTrigger>
          <TabsTrigger value="databases">Data Storage</TabsTrigger>
          <TabsTrigger value="messaging">Messaging</TabsTrigger>
          <TabsTrigger value="caching">Caching</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="architecture" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Microservices Architecture
                  <Badge variant="secondary">Interactive</Badge>
                </CardTitle>
                <CardDescription>
                  Visualize microservices communication patterns and service
                  boundaries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  title="Microservices Architecture"
                  chart={`graph TB
    A[API Gateway] --> B[User Service]
    A --> C[Order Service]
    A --> D[Payment Service]
    A --> E[Notification Service]
    
    B --> F[(User DB)]
    C --> G[(Order DB)]
    D --> H[(Payment DB)]
    
    C --> I[Message Queue]
    D --> I
    I --> E
    
    E --> J[Email Service]
    E --> K[SMS Service]`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Load Balancer Types
                  <Badge variant="secondary">Simulation</Badge>
                </CardTitle>
                <CardDescription>
                  Compare different load balancing algorithms and their behavior
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  title="Load Balancer Types"
                  chart={`graph TB
    Client[Client Requests] --> LB[Load Balancer]
    
    LB --> S1[Server 1<br/>Load: 20%]
    LB --> S2[Server 2<br/>Load: 45%]
    LB --> S3[Server 3<br/>Load: 30%]
    
    subgraph "Algorithms"
      RR[Round Robin]
      WRR[Weighted Round Robin]
      LC[Least Connections]
      IP[IP Hash]
    end`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  API Gateway Pattern
                  <Badge variant="secondary">Interactive</Badge>
                </CardTitle>
                <CardDescription>
                  Explore API gateway functionality and request routing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  title="API Gateway Pattern"
                  chart={`graph LR
    Client --> Gateway[API Gateway]
    
    Gateway --> Auth[Authentication]
    Gateway --> RL[Rate Limiting]
    Gateway --> LB[Load Balancing]
    Gateway --> Log[Logging]
    
    Gateway --> MS1[Microservice 1]
    Gateway --> MS2[Microservice 2]
    Gateway --> MS3[Microservice 3]`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Service Mesh
                  <Badge variant="secondary">Visual</Badge>
                </CardTitle>
                <CardDescription>
                  Understand service mesh architecture and sidecar proxies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  title="Service Mesh"
                  chart={`graph TB
    subgraph "Service A Pod"
      SA[Service A]
      PA[Proxy A]
      SA <--> PA
    end
    
    subgraph "Service B Pod"
      SB[Service B]
      PB[Proxy B]
      SB <--> PB
    end
    
    subgraph "Service C Pod"
      SC[Service C]
      PC[Proxy C]
      SC <--> PC
    end
    
    PA <--> PB
    PB <--> PC
    PA <--> PC
    
    CP[Control Plane] --> PA
    CP --> PB
    CP --> PC`}
                />
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg mb-2">
                  Design Patterns Overview
                </CardTitle>
                <CardDescription className="text-sm">
                  Interactive catalog of common design patterns organized by
                  category
                </CardDescription>
                <div className="flex flex-wrap gap-1 mt-3">
                  <Badge variant="outline" className="text-xs">
                    Patterns
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Architecture
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Interactive
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <DesignPatternsDemo />
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg mb-2">
                  Microservices Patterns
                </CardTitle>
                <CardDescription className="text-sm">
                  Essential patterns for building and managing microservices
                  architecture
                </CardDescription>
                <div className="flex flex-wrap gap-1 mt-3">
                  <Badge variant="outline" className="text-xs">
                    Microservices
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Patterns
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Distributed
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <MicroservicesPatternsDemo />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scaling" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Horizontal vs Vertical Scaling
                  <Badge variant="secondary">Comparison</Badge>
                </CardTitle>
                <CardDescription>
                  Compare scaling strategies and their trade-offs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  title="Horizontal vs Vertical Scaling"
                  chart={`graph TB
    subgraph "Vertical Scaling"
      V1[Server<br/>2 CPU, 4GB RAM] --> V2[Server<br/>4 CPU, 8GB RAM] --> V3[Server<br/>8 CPU, 16GB RAM]
    end
    
    subgraph "Horizontal Scaling"
      H1[Server 1<br/>2 CPU, 4GB RAM]
      H2[Server 2<br/>2 CPU, 4GB RAM]
      H3[Server 3<br/>2 CPU, 4GB RAM]
      LB[Load Balancer] --> H1
      LB --> H2
      LB --> H3
    end`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Auto Scaling Simulator
                  <Badge variant="secondary">Simulation</Badge>
                </CardTitle>
                <CardDescription>
                  Simulate auto-scaling behavior under different load patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  title="Auto Scaling Simulator"
                  chart={`graph TB
    M[Metrics Collector] --> ASG[Auto Scaling Group]
    ASG --> T[Thresholds<br/>CPU > 70% = Scale Up<br/>CPU < 30% = Scale Down]
    
    T --> SU[Scale Up<br/>Add Instance]
    T --> SD[Scale Down<br/>Remove Instance]
    
    ASG --> I1[Instance 1]
    ASG --> I2[Instance 2]
    ASG --> I3[Instance 3 - Pending]`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  CDN Distribution
                  <Badge variant="secondary">Geographic</Badge>
                </CardTitle>
                <CardDescription>
                  Visualize content distribution and edge server placement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  title="CDN Distribution"
                  chart={`graph TB
    Origin[Origin Server<br/>US East]
    
    Origin --> CDN1[CDN Edge<br/>US West]
    Origin --> CDN2[CDN Edge<br/>Europe]
    Origin --> CDN3[CDN Edge<br/>Asia]
    
    CDN1 --> U1[User 1<br/>California]
    CDN2 --> U2[User 2<br/>London]
    CDN3 --> U3[User 3<br/>Tokyo]`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Circuit Breaker Pattern
                  <Badge variant="secondary">State Machine</Badge>
                </CardTitle>
                <CardDescription>
                  Understand circuit breaker states and transitions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  title="Circuit Breaker Pattern"
                  chart={`stateDiagram-v2
    [*] --> Closed
    Closed --> Open : Failure threshold reached
    Open --> HalfOpen : Timeout period
    HalfOpen --> Closed : Success
    HalfOpen --> Open : Failure
    
    note right of Closed : Requests pass through
    note right of Open : Requests fail fast
    note right of HalfOpen : Limited requests allowed`}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="databases" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Database Sharding
                  <Badge variant="secondary">Partitioning</Badge>
                </CardTitle>
                <CardDescription>
                  Explore different sharding strategies and data distribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  title="Database Sharding"
                  chart={`graph TB
    App[Application] --> Router[Shard Router]
    
    Router --> S1[Shard 1<br/>Users 1-1000]
    Router --> S2[Shard 2<br/>Users 1001-2000]
    Router --> S3[Shard 3<br/>Users 2001-3000]
    
    S1 --> DB1[(Database 1)]
    S2 --> DB2[(Database 2)]
    S3 --> DB3[(Database 3)]`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Master-Slave Replication
                  <Badge variant="secondary">Replication</Badge>
                </CardTitle>
                <CardDescription>
                  Visualize database replication patterns and failover
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  title="Master-Slave Replication"
                  chart={`graph TB
    App[Application]
    
    App --> Master[(Master DB<br/>Read/Write)]
    App --> Slave1[(Slave DB 1<br/>Read Only)]
    App --> Slave2[(Slave DB 2<br/>Read Only)]
    
    Master -.-> Slave1
    Master -.-> Slave2
    
    style Master fill:#e1f5fe
    style Slave1 fill:#f3e5f5
    style Slave2 fill:#f3e5f5`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  CAP Theorem
                  <Badge variant="secondary">Theory</Badge>
                </CardTitle>
                <CardDescription>
                  Understand consistency, availability, and partition tolerance
                  trade-offs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  title="CAP Theorem"
                  chart={`graph TB
    CAP[CAP Theorem<br/>Pick Any Two]
    
    CAP --> C[Consistency<br/>All nodes see same data]
    CAP --> A[Availability<br/>System remains operational]
    CAP --> P[Partition Tolerance<br/>System continues despite network failures]
    
    C --- CP[CP Systems<br/>MongoDB, Redis]
    A --- AP[AP Systems<br/>Cassandra, DynamoDB]
    P --- CA[CA Systems<br/>RDBMS in single datacenter]`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  ACID vs BASE
                  <Badge variant="secondary">Properties</Badge>
                </CardTitle>
                <CardDescription>
                  Compare database consistency models and guarantees
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  title="ACID vs BASE"
                  chart={`graph LR
    subgraph "ACID"
      A1[Atomicity]
      C1[Consistency]
      I1[Isolation]
      D1[Durability]
    end
    
    subgraph "BASE"
      BA[Basically Available]
      S[Soft State]
      E[Eventually Consistent]
    end
    
    ACID --> RDBMS[Relational Databases]
    BASE --> NoSQL[NoSQL Databases]`}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="messaging" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Message Queue Patterns
                  <Badge variant="secondary">Messaging</Badge>
                </CardTitle>
                <CardDescription>
                  Explore different message queue patterns and use cases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  title="Message Queue Patterns"
                  chart={`graph TB
    P[Producer] --> Q[Message Queue]
    Q --> C1[Consumer 1]
    Q --> C2[Consumer 2]
    Q --> C3[Consumer 3]
    
    subgraph "Queue Types"
      FIFO[FIFO Queue]
      Priority[Priority Queue]
      Delay[Delay Queue]
    end`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Pub/Sub Architecture
                  <Badge variant="secondary">Decoupling</Badge>
                </CardTitle>
                <CardDescription>
                  Understand publish-subscribe patterns and event-driven
                  architecture
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  title="Pub/Sub Architecture"
                  chart={`graph TB
    P1[Publisher 1] --> T1[Topic: Orders]
    P2[Publisher 2] --> T1
    
    T1 --> S1[Subscriber 1<br/>Inventory Service]
    T1 --> S2[Subscriber 2<br/>Email Service]
    T1 --> S3[Subscriber 3<br/>Analytics Service]
    
    P3[Publisher 3] --> T2[Topic: Users]
    T2 --> S4[Subscriber 4<br/>Notification Service]`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Event Sourcing
                  <Badge variant="secondary">Pattern</Badge>
                </CardTitle>
                <CardDescription>
                  Visualize event sourcing pattern and event replay
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  title="Event Sourcing"
                  chart={`graph TB
    Command[Command] --> A[Aggregate]
    A --> E1[Event 1<br/>Account Created]
    A --> E2[Event 2<br/>Money Deposited]
    A --> E3[Event 3<br/>Money Withdrawn]
    
    E1 --> ES[Event Store]
    E2 --> ES
    E3 --> ES
    
    ES --> P1[Projection 1<br/>Account Balance]
    ES --> P2[Projection 2<br/>Transaction History]`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  CQRS Pattern
                  <Badge variant="secondary">Architecture</Badge>
                </CardTitle>
                <CardDescription>
                  Explore Command Query Responsibility Segregation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  title="CQRS Pattern"
                  chart={`graph TB
    UI[User Interface]
    
    UI --> Commands[Command Side]
    UI --> Queries[Query Side]
    
    Commands --> CDB[(Write Database)]
    Queries --> RDB[(Read Database)]
    
    CDB -.-> Sync[Synchronization] -.-> RDB`}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="caching" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Cache Patterns
                  <Badge variant="secondary">Strategies</Badge>
                </CardTitle>
                <CardDescription>
                  Compare different caching strategies and their use cases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  title="Cache Patterns"
                  chart={`graph TB
    App[Application]
    
    subgraph "Cache-Aside"
      App --> C1[Cache]
      App --> DB1[(Database)]
    end
    
    subgraph "Write-Through"
      App --> C2[Cache]
      C2 --> DB2[(Database)]
    end
    
    subgraph "Write-Behind"
      App --> C3[Cache]
      C3 -.-> DB3[(Database)]
    end`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Cache Eviction Policies
                  <Badge variant="secondary">Algorithms</Badge>
                </CardTitle>
                <CardDescription>
                  Simulate different cache eviction algorithms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  title="Cache Eviction Policies"
                  chart={`graph TB
    Cache[Cache Full]
    
    Cache --> LRU[LRU<br/>Least Recently Used]
    Cache --> LFU[LFU<br/>Least Frequently Used]
    Cache --> FIFO[FIFO<br/>First In, First Out]
    Cache --> Random[Random<br/>Random Eviction]
    
    LRU --> Evict1[Remove oldest accessed]
    LFU --> Evict2[Remove least accessed]
    FIFO --> Evict3[Remove first added]
    Random --> Evict4[Remove random item]`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Distributed Cache
                  <Badge variant="secondary">Distribution</Badge>
                </CardTitle>
                <CardDescription>
                  Explore distributed caching architectures
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  title="Distributed Cache"
                  chart={`graph TB
    App1[App Instance 1] --> Redis1[Redis Node 1]
    App2[App Instance 2] --> Redis2[Redis Node 2]
    App3[App Instance 3] --> Redis3[Redis Node 3]
    
    Redis1 <--> Redis2
    Redis2 <--> Redis3
    Redis1 <--> Redis3
    
    style Redis1 fill:#e1f5fe
    style Redis2 fill:#e1f5fe
    style Redis3 fill:#e1f5fe`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Cache Hierarchy
                  <Badge variant="secondary">Levels</Badge>
                </CardTitle>
                <CardDescription>
                  Understand multi-level caching strategies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  title="Cache Hierarchy"
                  chart={`graph TB
    Browser[Browser Cache<br/>L1 - Fastest]
    CDN[CDN Cache<br/>L2 - Fast]
    App[Application Cache<br/>L3 - Medium]
    DB[Database Cache<br/>L4 - Slow]
    Disk[(Disk Storage<br/>L5 - Slowest)]
    
    Browser --> CDN
    CDN --> App
    App --> DB
    DB --> Disk`}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Observability Pillars
                  <Badge variant="secondary">Monitoring</Badge>
                </CardTitle>
                <CardDescription>
                  Understand the three pillars of observability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  title="Observability Pillars"
                  chart={`graph TB
    App[Application]
    
    App --> Metrics[Metrics<br/>Prometheus, Grafana]
    App --> Logs[Logs<br/>ELK Stack, Fluentd]
    App --> Traces[Traces<br/>Jaeger, Zipkin]
    
    Metrics --> Dashboard1[Performance Dashboard]
    Logs --> Dashboard2[Log Analysis]
    Traces --> Dashboard3[Distributed Tracing]`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Health Check Patterns
                  <Badge variant="secondary">Reliability</Badge>
                </CardTitle>
                <CardDescription>
                  Explore different health check strategies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  title="Health Check Patterns"
                  chart={`graph TB
    LB[Load Balancer] --> HC[Health Checks]
    
    HC --> Basic[Basic Check<br/>/health]
    HC --> Deep[Deep Check<br/>Database connectivity]
    HC --> Custom[Custom Check<br/>Business logic]
    
    Basic --> S1[Service 1 ✅]
    Deep --> S2[Service 2 ❌]
    Custom --> S3[Service 3 ⚠️]`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Alerting Strategies
                  <Badge variant="secondary">Notifications</Badge>
                </CardTitle>
                <CardDescription>
                  Design effective alerting and escalation policies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  title="Alerting Strategies"
                  chart={`graph TB
    Metrics[Metrics Collection] --> Rules[Alert Rules]
    
    Rules --> Warning[Warning Level<br/>5min threshold]
    Rules --> Critical[Critical Level<br/>1min threshold]
    
    Warning --> Email[Email Notification]
    Critical --> SMS[SMS Alert]
    Critical --> Escalate[Escalate to On-Call]
    
    Escalate --> Manager[Manager Notification]`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  SLA/SLO/SLI Framework
                  <Badge variant="secondary">Metrics</Badge>
                </CardTitle>
                <CardDescription>
                  Understand service level objectives and indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  title="SLA/SLO/SLI Framework"
                  chart={`graph TB
    SLI[SLI<br/>Service Level Indicators<br/>Actual measurements]
    SLO[SLO<br/>Service Level Objectives<br/>Target performance]
    SLA[SLA<br/>Service Level Agreement<br/>Contract with consequences]
    
    SLI --> Examples1[Response time<br/>Error rate<br/>Throughput]
    SLO --> Examples2[99.9% uptime<br/>< 200ms latency<br/>< 0.1% errors]
    SLA --> Examples3[Credits for downtime<br/>Financial penalties<br/>Contract terms]`}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
