# Load Balancing

## Overview

Load balancing is a critical technique in system design that distributes incoming network traffic across multiple backend servers to ensure high availability, reliability, and optimal resource utilization. It acts as a traffic dispatcher, intelligently routing requests to the most appropriate server based on various factors and algorithms.

### Core Principles

**Traffic Distribution**

- Evenly distributes incoming requests across multiple servers
- Prevents any single server from becoming overwhelmed
- Optimizes resource utilization across the server farm

**High Availability**

- Eliminates single points of failure
- Provides automatic failover when servers become unavailable
- Ensures continuous service availability even during server maintenance

**Scalability Enhancement**

- Enables horizontal scaling by adding more servers
- Handles increased traffic loads efficiently
- Supports dynamic scaling based on demand

## Load Balancer Types and Layers

### Layer 4 (Transport Layer) Load Balancing

Operates at the TCP/UDP level, making routing decisions based on IP addresses and ports.

```typescript
interface Layer4LoadBalancer {
  distributeConnection(
    clientIP: string,
    clientPort: number,
    protocol: "TCP" | "UDP"
  ): ServerEndpoint;
}

class NetworkLoadBalancer implements Layer4LoadBalancer {
  private servers: ServerEndpoint[] = [];
  private algorithm: LoadBalancingAlgorithm;

  distributeConnection(
    clientIP: string,
    clientPort: number,
    protocol: "TCP" | "UDP"
  ): ServerEndpoint {
    return this.algorithm.selectServer(this.servers, {
      clientIP,
      clientPort,
      protocol,
    });
  }

  addServer(server: ServerEndpoint): void {
    this.servers.push(server);
  }

  removeServer(serverIP: string): void {
    this.servers = this.servers.filter((s) => s.ip !== serverIP);
  }

  healthCheck(): void {
    this.servers.forEach((server) => {
      if (!this.isHealthy(server)) {
        this.markUnhealthy(server);
      }
    });
  }
}

interface ServerEndpoint {
  ip: string;
  port: number;
  isHealthy: boolean;
  activeConnections: number;
  weight: number;
}
```

**Characteristics:**

- Fast and efficient (lower latency)
- Cannot inspect application-layer data
- Suitable for any TCP/UDP traffic
- Limited routing intelligence

### Layer 7 (Application Layer) Load Balancing

Operates at the HTTP/HTTPS level, making routing decisions based on application data.

```typescript
interface Layer7LoadBalancer {
  routeRequest(request: HttpRequest): ServerEndpoint;
}

class ApplicationLoadBalancer implements Layer7LoadBalancer {
  private servers: ServerEndpoint[] = [];
  private routingRules: RoutingRule[] = [];

  routeRequest(request: HttpRequest): ServerEndpoint {
    const applicableRule = this.findMatchingRule(request);
    if (applicableRule) {
      return applicableRule.targetServer;
    }

    return this.algorithm.selectServer(this.servers, request);
  }

  addRoutingRule(rule: RoutingRule): void {
    this.routingRules.push(rule);
  }

  private findMatchingRule(request: HttpRequest): RoutingRule | null {
    return this.routingRules.find((rule) => rule.matches(request)) || null;
  }
}

interface HttpRequest {
  method: string;
  path: string;
  headers: Record<string, string>;
  body?: any;
  clientIP: string;
}

interface RoutingRule {
  condition: (request: HttpRequest) => boolean;
  targetServer: ServerEndpoint;
  matches(request: HttpRequest): boolean;
}

class PathBasedRoutingRule implements RoutingRule {
  constructor(
    private pathPattern: RegExp,
    public targetServer: ServerEndpoint
  ) {}

  matches(request: HttpRequest): boolean {
    return this.pathPattern.test(request.path);
  }

  condition(request: HttpRequest): boolean {
    return this.matches(request);
  }
}
```

**Characteristics:**

- Advanced routing capabilities
- SSL termination support
- Content-based routing
- Request/response modification
- Higher processing overhead

## Load Balancing Algorithms

### 1. Round Robin

Distributes requests sequentially across servers.

```typescript
class RoundRobinAlgorithm implements LoadBalancingAlgorithm {
  private currentIndex = 0;

  selectServer(servers: ServerEndpoint[], context?: any): ServerEndpoint {
    const healthyServers = servers.filter((s) => s.isHealthy);
    if (healthyServers.length === 0) {
      throw new Error("No healthy servers available");
    }

    const server = healthyServers[this.currentIndex % healthyServers.length];
    this.currentIndex++;
    return server;
  }
}
```

**Pros:**

- Simple implementation
- Equal distribution (when requests are similar)
- Low computational overhead

**Cons:**

- Doesn't consider server capacity
- Poor performance with varying request loads
- Not suitable for stateful applications

### 2. Weighted Round Robin

Distributes requests based on server weights/capacities.

```typescript
class WeightedRoundRobinAlgorithm implements LoadBalancingAlgorithm {
  private weightedQueue: ServerEndpoint[] = [];
  private currentIndex = 0;

  constructor(servers: ServerEndpoint[]) {
    this.buildWeightedQueue(servers);
  }

  selectServer(servers: ServerEndpoint[]): ServerEndpoint {
    const healthyServers = this.weightedQueue.filter((s) => s.isHealthy);
    if (healthyServers.length === 0) {
      throw new Error("No healthy servers available");
    }

    const server = healthyServers[this.currentIndex % healthyServers.length];
    this.currentIndex++;
    return server;
  }

  private buildWeightedQueue(servers: ServerEndpoint[]): void {
    this.weightedQueue = [];
    for (const server of servers) {
      for (let i = 0; i < server.weight; i++) {
        this.weightedQueue.push(server);
      }
    }
  }
}
```

### 3. Least Connections

Routes requests to the server with the fewest active connections.

```typescript
class LeastConnectionsAlgorithm implements LoadBalancingAlgorithm {
  selectServer(servers: ServerEndpoint[]): ServerEndpoint {
    const healthyServers = servers.filter((s) => s.isHealthy);
    if (healthyServers.length === 0) {
      throw new Error("No healthy servers available");
    }

    return healthyServers.reduce((min, current) =>
      current.activeConnections < min.activeConnections ? current : min
    );
  }
}
```

**Best for:**

- Long-lived connections
- WebSocket applications
- Streaming services
- Applications with varying request processing times

### 4. Weighted Least Connections

Combines least connections with server weights.

```typescript
class WeightedLeastConnectionsAlgorithm implements LoadBalancingAlgorithm {
  selectServer(servers: ServerEndpoint[]): ServerEndpoint {
    const healthyServers = servers.filter((s) => s.isHealthy);
    if (healthyServers.length === 0) {
      throw new Error("No healthy servers available");
    }

    return healthyServers.reduce((min, current) => {
      const currentRatio = current.activeConnections / current.weight;
      const minRatio = min.activeConnections / min.weight;
      return currentRatio < minRatio ? current : min;
    });
  }
}
```

### 5. IP Hash (Session Affinity)

Routes requests from the same client IP to the same server.

```typescript
class IPHashAlgorithm implements LoadBalancingAlgorithm {
  selectServer(servers: ServerEndpoint[], context: any): ServerEndpoint {
    const healthyServers = servers.filter((s) => s.isHealthy);
    if (healthyServers.length === 0) {
      throw new Error("No healthy servers available");
    }

    const clientIP = context.clientIP || context.request?.clientIP;
    if (!clientIP) {
      return healthyServers[0];
    }

    const hash = this.hashIP(clientIP);
    const index = hash % healthyServers.length;
    return healthyServers[index];
  }

  private hashIP(ip: string): number {
    let hash = 0;
    for (let i = 0; i < ip.length; i++) {
      hash = ((hash << 5) - hash + ip.charCodeAt(i)) & 0xffffffff;
    }
    return Math.abs(hash);
  }
}
```

**Use Cases:**

- Session-based applications
- Shopping carts
- User authentication systems
- Applications requiring server-side state

### 6. Least Response Time

Routes to the server with the lowest response time.

```typescript
class LeastResponseTimeAlgorithm implements LoadBalancingAlgorithm {
  private responseTimeTracker: Map<string, number> = new Map();

  selectServer(servers: ServerEndpoint[]): ServerEndpoint {
    const healthyServers = servers.filter((s) => s.isHealthy);
    if (healthyServers.length === 0) {
      throw new Error("No healthy servers available");
    }

    return healthyServers.reduce((fastest, current) => {
      const currentTime = this.getAverageResponseTime(current);
      const fastestTime = this.getAverageResponseTime(fastest);
      return currentTime < fastestTime ? current : fastest;
    });
  }

  updateResponseTime(server: ServerEndpoint, responseTime: number): void {
    const key = `${server.ip}:${server.port}`;
    const currentAvg = this.responseTimeTracker.get(key) || responseTime;
    const newAvg = currentAvg * 0.8 + responseTime * 0.2;
    this.responseTimeTracker.set(key, newAvg);
  }

  private getAverageResponseTime(server: ServerEndpoint): number {
    const key = `${server.ip}:${server.port}`;
    return this.responseTimeTracker.get(key) || Infinity;
  }
}
```

### 7. Random with Two Choices

Selects two random servers and chooses the one with fewer connections.

```typescript
class RandomTwoChoicesAlgorithm implements LoadBalancingAlgorithm {
  selectServer(servers: ServerEndpoint[]): ServerEndpoint {
    const healthyServers = servers.filter((s) => s.isHealthy);
    if (healthyServers.length === 0) {
      throw new Error("No healthy servers available");
    }

    if (healthyServers.length === 1) {
      return healthyServers[0];
    }

    const index1 = Math.floor(Math.random() * healthyServers.length);
    let index2 = Math.floor(Math.random() * healthyServers.length);
    while (index2 === index1) {
      index2 = Math.floor(Math.random() * healthyServers.length);
    }

    const server1 = healthyServers[index1];
    const server2 = healthyServers[index2];

    return server1.activeConnections <= server2.activeConnections
      ? server1
      : server2;
  }
}
```

## Health Checking and Monitoring

### Health Check Implementation

```typescript
class HealthChecker {
  private healthCheckInterval: number = 30000;
  private timeout: number = 5000;
  private maxRetries: number = 3;

  async performHealthCheck(server: ServerEndpoint): Promise<boolean> {
    let retries = 0;

    while (retries < this.maxRetries) {
      try {
        const isHealthy = await this.checkServerHealth(server);
        if (isHealthy) {
          return true;
        }
      } catch (error) {
        console.error(
          `Health check failed for ${server.ip}:${server.port}`,
          error
        );
      }

      retries++;
      await this.delay(1000 * retries);
    }

    return false;
  }

  private async checkServerHealth(server: ServerEndpoint): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();

      const timeoutId = setTimeout(() => {
        reject(new Error("Health check timeout"));
      }, this.timeout);

      this.sendHealthCheckRequest(server)
        .then((response) => {
          clearTimeout(timeoutId);
          const responseTime = Date.now() - startTime;
          resolve(response.status === 200 && responseTime < this.timeout);
        })
        .catch((error) => {
          clearTimeout(timeoutId);
          reject(error);
        });
    });
  }

  private async sendHealthCheckRequest(server: ServerEndpoint): Promise<any> {
    const url = `http://${server.ip}:${server.port}/health`;

    try {
      const response = await fetch(url, {
        method: "GET",
        timeout: this.timeout,
      });
      return response;
    } catch (error) {
      throw new Error(`Failed to reach server: ${error.message}`);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  startMonitoring(servers: ServerEndpoint[]): void {
    setInterval(async () => {
      const healthChecks = servers.map(async (server) => {
        const isHealthy = await this.performHealthCheck(server);
        server.isHealthy = isHealthy;

        if (!isHealthy) {
          console.warn(
            `Server ${server.ip}:${server.port} marked as unhealthy`
          );
        }
      });

      await Promise.all(healthChecks);
    }, this.healthCheckInterval);
  }
}
```

### Advanced Health Checks

```typescript
interface HealthCheckStrategy {
  check(server: ServerEndpoint): Promise<HealthStatus>;
}

interface HealthStatus {
  isHealthy: boolean;
  responseTime: number;
  details?: any;
}

class HTTPHealthCheck implements HealthCheckStrategy {
  constructor(
    private path: string = "/health",
    private expectedStatusCode: number = 200,
    private timeout: number = 5000
  ) {}

  async check(server: ServerEndpoint): Promise<HealthStatus> {
    const startTime = Date.now();

    try {
      const response = await fetch(
        `http://${server.ip}:${server.port}${this.path}`,
        {
          method: "GET",
          timeout: this.timeout,
        }
      );

      const responseTime = Date.now() - startTime;
      const isHealthy = response.status === this.expectedStatusCode;

      return {
        isHealthy,
        responseTime,
        details: {
          statusCode: response.status,
          statusText: response.statusText,
        },
      };
    } catch (error) {
      return {
        isHealthy: false,
        responseTime: Date.now() - startTime,
        details: { error: error.message },
      };
    }
  }
}

class TCPHealthCheck implements HealthCheckStrategy {
  constructor(private timeout: number = 3000) {}

  async check(server: ServerEndpoint): Promise<HealthStatus> {
    const startTime = Date.now();

    return new Promise((resolve) => {
      const socket = new net.Socket();

      socket.setTimeout(this.timeout);

      socket.connect(server.port, server.ip, () => {
        const responseTime = Date.now() - startTime;
        socket.destroy();
        resolve({
          isHealthy: true,
          responseTime,
          details: { connectionSuccessful: true },
        });
      });

      socket.on("error", (error) => {
        const responseTime = Date.now() - startTime;
        resolve({
          isHealthy: false,
          responseTime,
          details: { error: error.message },
        });
      });

      socket.on("timeout", () => {
        const responseTime = Date.now() - startTime;
        socket.destroy();
        resolve({
          isHealthy: false,
          responseTime,
          details: { error: "Connection timeout" },
        });
      });
    });
  }
}
```

## SSL Termination and Security

### SSL Termination Implementation

```typescript
class SSLTerminatingLoadBalancer {
  private sslContext: any;
  private backends: ServerEndpoint[] = [];

  constructor(sslCertPath: string, sslKeyPath: string) {
    this.initializeSSL(sslCertPath, sslKeyPath);
  }

  private initializeSSL(certPath: string, keyPath: string): void {
    const fs = require("fs");
    const https = require("https");

    const options = {
      cert: fs.readFileSync(certPath),
      key: fs.readFileSync(keyPath),
    };

    this.sslContext = https.createServer(
      options,
      this.handleRequest.bind(this)
    );
  }

  private async handleRequest(req: any, res: any): Promise<void> {
    try {
      const targetServer = this.selectBackendServer();
      const response = await this.proxyRequest(req, targetServer);

      res.writeHead(response.statusCode, response.headers);
      res.end(response.body);
    } catch (error) {
      res.writeHead(502, { "Content-Type": "text/plain" });
      res.end("Bad Gateway");
    }
  }

  private selectBackendServer(): ServerEndpoint {
    const healthyServers = this.backends.filter((s) => s.isHealthy);
    if (healthyServers.length === 0) {
      throw new Error("No healthy backend servers");
    }

    return healthyServers[Math.floor(Math.random() * healthyServers.length)];
  }

  private async proxyRequest(req: any, target: ServerEndpoint): Promise<any> {
    const http = require("http");

    return new Promise((resolve, reject) => {
      const options = {
        hostname: target.ip,
        port: target.port,
        path: req.url,
        method: req.method,
        headers: { ...req.headers, host: `${target.ip}:${target.port}` },
      };

      const proxyReq = http.request(options, (proxyRes: any) => {
        let body = "";
        proxyRes.on("data", (chunk: any) => (body += chunk));
        proxyRes.on("end", () => {
          resolve({
            statusCode: proxyRes.statusCode,
            headers: proxyRes.headers,
            body,
          });
        });
      });

      proxyReq.on("error", reject);

      if (req.body) {
        proxyReq.write(req.body);
      }

      proxyReq.end();
    });
  }
}
```

## High Availability Patterns

### Active-Passive Load Balancer Setup

```typescript
class HALoadBalancerPair {
  private primaryLB: LoadBalancer;
  private secondaryLB: LoadBalancer;
  private virtualIP: string;
  private isPrimary: boolean = true;
  private heartbeatInterval: number = 1000;

  constructor(primaryLB: LoadBalancer, secondaryLB: LoadBalancer, vip: string) {
    this.primaryLB = primaryLB;
    this.secondaryLB = secondaryLB;
    this.virtualIP = vip;
    this.startHeartbeat();
  }

  private startHeartbeat(): void {
    setInterval(() => {
      this.performFailoverCheck();
    }, this.heartbeatInterval);
  }

  private async performFailoverCheck(): Promise<void> {
    if (this.isPrimary) {
      const primaryHealthy = await this.checkLoadBalancerHealth(this.primaryLB);
      if (!primaryHealthy) {
        await this.failover();
      }
    } else {
      const primaryHealthy = await this.checkLoadBalancerHealth(this.primaryLB);
      if (primaryHealthy) {
        await this.failback();
      }
    }
  }

  private async checkLoadBalancerHealth(lb: LoadBalancer): Promise<boolean> {
    try {
      return await lb.healthCheck();
    } catch (error) {
      return false;
    }
  }

  private async failover(): Promise<void> {
    console.log("Initiating failover to secondary load balancer");
    this.isPrimary = false;
    await this.updateVirtualIPRouting(this.secondaryLB);
  }

  private async failback(): Promise<void> {
    console.log("Initiating failback to primary load balancer");
    this.isPrimary = true;
    await this.updateVirtualIPRouting(this.primaryLB);
  }

  private async updateVirtualIPRouting(activeLB: LoadBalancer): Promise<void> {}
}
```

### Global Server Load Balancing (GSLB)

```typescript
class GlobalLoadBalancer {
  private regions: Map<string, RegionalLoadBalancer> = new Map();
  private dnsResolver: DNSResolver;

  addRegion(name: string, loadBalancer: RegionalLoadBalancer): void {
    this.regions.set(name, loadBalancer);
  }

  async routeRequest(clientIP: string, hostname: string): Promise<string> {
    const clientLocation = await this.getClientLocation(clientIP);
    const optimalRegion = this.selectOptimalRegion(clientLocation);

    const regionalLB = this.regions.get(optimalRegion);
    if (!regionalLB || !regionalLB.isHealthy()) {
      return this.getBackupRegion(optimalRegion);
    }

    return regionalLB.getEndpoint();
  }

  private async getClientLocation(clientIP: string): Promise<Location> {
    return { country: "US", region: "west" };
  }

  private selectOptimalRegion(location: Location): string {
    const regionPreferences = {
      US: ["us-west", "us-east"],
      EU: ["eu-west", "eu-central"],
      ASIA: ["asia-pacific", "asia-northeast"],
    };

    return regionPreferences[location.country]?.[0] || "us-east";
  }

  private getBackupRegion(primaryRegion: string): string {
    const backupMappings = {
      "us-west": "us-east",
      "us-east": "us-west",
      "eu-west": "eu-central",
      "eu-central": "eu-west",
    };

    return backupMappings[primaryRegion] || "us-east";
  }
}

interface Location {
  country: string;
  region: string;
}

interface RegionalLoadBalancer {
  isHealthy(): boolean;
  getEndpoint(): string;
}
```

## Performance Optimization

### Connection Pooling

```typescript
class ConnectionPool {
  private pools: Map<string, Connection[]> = new Map();
  private maxConnections: number = 100;
  private minConnections: number = 5;

  async getConnection(server: ServerEndpoint): Promise<Connection> {
    const key = `${server.ip}:${server.port}`;
    let pool = this.pools.get(key);

    if (!pool) {
      pool = [];
      this.pools.set(key, pool);
      await this.initializePool(server, pool);
    }

    const availableConnection = pool.find((conn) => !conn.inUse);
    if (availableConnection) {
      availableConnection.inUse = true;
      return availableConnection;
    }

    if (pool.length < this.maxConnections) {
      const newConnection = await this.createConnection(server);
      pool.push(newConnection);
      newConnection.inUse = true;
      return newConnection;
    }

    return this.waitForAvailableConnection(pool);
  }

  releaseConnection(connection: Connection): void {
    connection.inUse = false;
    connection.lastUsed = Date.now();
  }

  private async initializePool(
    server: ServerEndpoint,
    pool: Connection[]
  ): Promise<void> {
    const connections = await Promise.all(
      Array(this.minConnections)
        .fill(null)
        .map(() => this.createConnection(server))
    );
    pool.push(...connections);
  }

  private async createConnection(server: ServerEndpoint): Promise<Connection> {
    return {
      id: generateId(),
      server,
      socket: await this.establishSocket(server),
      inUse: false,
      createdAt: Date.now(),
      lastUsed: Date.now(),
    };
  }

  private async waitForAvailableConnection(
    pool: Connection[]
  ): Promise<Connection> {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        const available = pool.find((conn) => !conn.inUse);
        if (available) {
          clearInterval(checkInterval);
          available.inUse = true;
          resolve(available);
        }
      }, 10);
    });
  }
}

interface Connection {
  id: string;
  server: ServerEndpoint;
  socket: any;
  inUse: boolean;
  createdAt: number;
  lastUsed: number;
}
```

### Rate Limiting Integration

```typescript
class RateLimitingLoadBalancer {
  private rateLimiter: RateLimiter;
  private loadBalancer: LoadBalancer;

  constructor(rateLimiter: RateLimiter, loadBalancer: LoadBalancer) {
    this.rateLimiter = rateLimiter;
    this.loadBalancer = loadBalancer;
  }

  async handleRequest(request: HttpRequest): Promise<HttpResponse> {
    const isAllowed = await this.rateLimiter.isAllowed(request.clientIP);

    if (!isAllowed) {
      return {
        statusCode: 429,
        headers: { "Content-Type": "text/plain" },
        body: "Too Many Requests",
      };
    }

    return this.loadBalancer.handleRequest(request);
  }
}

class TokenBucketRateLimiter implements RateLimiter {
  private buckets: Map<string, TokenBucket> = new Map();
  private capacity: number;
  private refillRate: number;

  constructor(capacity: number = 100, refillRate: number = 10) {
    this.capacity = capacity;
    this.refillRate = refillRate;
  }

  async isAllowed(clientIP: string): Promise<boolean> {
    const bucket = this.getBucket(clientIP);
    return bucket.consume();
  }

  private getBucket(clientIP: string): TokenBucket {
    let bucket = this.buckets.get(clientIP);
    if (!bucket) {
      bucket = new TokenBucket(this.capacity, this.refillRate);
      this.buckets.set(clientIP, bucket);
    }
    return bucket;
  }
}

class TokenBucket {
  private tokens: number;
  private lastRefill: number;

  constructor(private capacity: number, private refillRate: number) {
    this.tokens = capacity;
    this.lastRefill = Date.now();
  }

  consume(): boolean {
    this.refill();

    if (this.tokens > 0) {
      this.tokens--;
      return true;
    }

    return false;
  }

  private refill(): void {
    const now = Date.now();
    const timePassed = (now - this.lastRefill) / 1000;
    const tokensToAdd = Math.floor(timePassed * this.refillRate);

    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }
}
```

## Load Balancer Technologies

### Popular Load Balancer Solutions

| Technology     | Type              | Features                               | Use Cases                       |
| -------------- | ----------------- | -------------------------------------- | ------------------------------- |
| **NGINX**      | Software          | HTTP/HTTPS, TCP/UDP, SSL termination   | Web applications, microservices |
| **HAProxy**    | Software          | High performance, advanced algorithms  | High-traffic applications       |
| **AWS ALB**    | Cloud Service     | Layer 7, auto-scaling, AWS integration | AWS-based applications          |
| **AWS NLB**    | Cloud Service     | Layer 4, ultra-high performance        | Low-latency applications        |
| **Cloudflare** | Cloud Service     | Global CDN, DDoS protection            | Global web applications         |
| **F5 BIG-IP**  | Hardware/Software | Enterprise features, advanced security | Enterprise applications         |

### Cloud-Native Load Balancing

```typescript
class CloudLoadBalancerAdapter {
  private provider: CloudProvider;
  private loadBalancerConfig: LoadBalancerConfig;

  constructor(provider: CloudProvider) {
    this.provider = provider;
  }

  async createLoadBalancer(config: LoadBalancerConfig): Promise<string> {
    const lbId = await this.provider.createLoadBalancer({
      name: config.name,
      type: config.type,
      scheme: config.scheme,
      subnets: config.subnetIds,
      securityGroups: config.securityGroupIds,
    });

    await this.configureTargetGroup(lbId, config.targets);
    await this.configureListeners(lbId, config.listeners);

    return lbId;
  }

  async updateTargets(lbId: string, targets: Target[]): Promise<void> {
    await this.provider.registerTargets(lbId, targets);
  }

  async enableAutoScaling(
    lbId: string,
    scalingConfig: AutoScalingConfig
  ): Promise<void> {
    await this.provider.enableAutoScaling(lbId, scalingConfig);
  }
}

interface LoadBalancerConfig {
  name: string;
  type: "application" | "network" | "gateway";
  scheme: "internet-facing" | "internal";
  subnetIds: string[];
  securityGroupIds: string[];
  targets: Target[];
  listeners: Listener[];
}

interface Target {
  id: string;
  port: number;
  healthCheckPath?: string;
}

interface Listener {
  port: number;
  protocol: "HTTP" | "HTTPS" | "TCP" | "UDP";
  sslCertificateArn?: string;
  defaultAction: ListenerAction;
}
```

## Monitoring and Observability

### Load Balancer Metrics

```typescript
class LoadBalancerMetrics {
  private metrics: Map<string, MetricValue[]> = new Map();

  recordRequest(
    serverId: string,
    responseTime: number,
    statusCode: number
  ): void {
    this.recordMetric("requests_total", serverId, 1);
    this.recordMetric("response_time", serverId, responseTime);

    if (statusCode >= 500) {
      this.recordMetric("errors_5xx", serverId, 1);
    } else if (statusCode >= 400) {
      this.recordMetric("errors_4xx", serverId, 1);
    }
  }

  recordConnectionCount(serverId: string, count: number): void {
    this.recordMetric("active_connections", serverId, count);
  }

  getMetrics(metricName: string, timeWindow: number = 300000): MetricsSummary {
    const key = metricName;
    const values = this.metrics.get(key) || [];
    const cutoff = Date.now() - timeWindow;
    const recentValues = values.filter((v) => v.timestamp > cutoff);

    return {
      count: recentValues.length,
      average: this.calculateAverage(recentValues),
      min: Math.min(...recentValues.map((v) => v.value)),
      max: Math.max(...recentValues.map((v) => v.value)),
      percentile95: this.calculatePercentile(recentValues, 0.95),
      percentile99: this.calculatePercentile(recentValues, 0.99),
    };
  }

  private recordMetric(name: string, serverId: string, value: number): void {
    const key = `${name}_${serverId}`;
    if (!this.metrics.has(key)) {
      this.metrics.set(key, []);
    }

    this.metrics.get(key)!.push({
      value,
      timestamp: Date.now(),
    });

    this.cleanupOldMetrics(key);
  }

  private cleanupOldMetrics(key: string, maxAge: number = 3600000): void {
    const values = this.metrics.get(key) || [];
    const cutoff = Date.now() - maxAge;
    const filtered = values.filter((v) => v.timestamp > cutoff);
    this.metrics.set(key, filtered);
  }

  private calculateAverage(values: MetricValue[]): number {
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, v) => acc + v.value, 0);
    return sum / values.length;
  }

  private calculatePercentile(
    values: MetricValue[],
    percentile: number
  ): number {
    if (values.length === 0) return 0;
    const sorted = values.map((v) => v.value).sort((a, b) => a - b);
    const index = Math.ceil(sorted.length * percentile) - 1;
    return sorted[index];
  }
}

interface MetricValue {
  value: number;
  timestamp: number;
}

interface MetricsSummary {
  count: number;
  average: number;
  min: number;
  max: number;
  percentile95: number;
  percentile99: number;
}
```

## Best Practices and Guidelines

### Load Balancer Design Principles

1. **Health Checking**: Implement comprehensive health checks for accurate server status
2. **Graceful Degradation**: Handle server failures gracefully without service interruption
3. **Session Persistence**: Use sticky sessions only when necessary; prefer stateless design
4. **Security**: Implement SSL termination, rate limiting, and DDoS protection
5. **Monitoring**: Track key metrics like response times, error rates, and connection counts

### Common Anti-Patterns

```typescript
class LoadBalancerAntiPatterns {
  antiPattern1_NoHealthChecks(): void {}

  antiPattern2_OverlyComplexRouting(): void {}

  antiPattern3_IgnoringMetrics(): void {}

  goodPattern_SimpleEffectiveDesign(): void {}
}
```

### Performance Optimization Tips

1. **Algorithm Selection**: Choose appropriate algorithms based on your traffic patterns
2. **Connection Pooling**: Reuse connections to reduce overhead
3. **Caching**: Cache routing decisions and health check results appropriately
4. **Horizontal Scaling**: Scale load balancers horizontally for high availability
5. **Geographic Distribution**: Use multiple load balancers across regions for global applications

This comprehensive load balancing guide covers essential concepts, implementation patterns, and best practices for designing scalable and reliable distributed systems.
