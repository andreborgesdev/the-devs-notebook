# Reliability and Fault Tolerance Patterns

## Overview

Reliability patterns ensure systems continue operating correctly even when components fail. Fault tolerance is the ability to continue operating in the presence of failures. These patterns are essential for building resilient distributed systems that can handle various failure scenarios gracefully.

## Fundamental Reliability Concepts

### Types of Failures

#### Hardware Failures

- Server crashes and hardware malfunctions
- Network outages and connectivity issues
- Storage device failures
- Power outages and infrastructure problems

#### Software Failures

- Application bugs and memory leaks
- Deadlocks and race conditions
- Configuration errors
- Dependency failures

#### Human Errors

- Configuration mistakes
- Deployment errors
- Operational mistakes
- Security breaches

### Reliability Metrics

#### Availability

- **Uptime Percentage**: System operational time
- **MTBF (Mean Time Between Failures)**: Average time between failures
- **MTTR (Mean Time To Recovery)**: Average time to restore service
- **RTO (Recovery Time Objective)**: Maximum acceptable downtime
- **RPO (Recovery Point Objective)**: Maximum acceptable data loss

#### Service Level Objectives (SLOs)

```
99.9%   = 8.77 hours downtime per year
99.99%  = 52.6 minutes downtime per year
99.999% = 5.26 minutes downtime per year
```

## Circuit Breaker Pattern

### Concept

Prevent cascading failures by temporarily stopping calls to failing services, allowing them time to recover.

### Implementation

```javascript
class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.recoveryTimeout = options.recoveryTimeout || 60000;
    this.monitoringPeriod = options.monitoringPeriod || 10000;

    this.state = "CLOSED"; // CLOSED, OPEN, HALF_OPEN
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.successCount = 0;
  }

  async call(operation) {
    if (this.state === "OPEN") {
      if (Date.now() - this.lastFailureTime >= this.recoveryTimeout) {
        this.state = "HALF_OPEN";
        this.successCount = 0;
      } else {
        throw new Error("Circuit breaker is OPEN");
      }
    }

    try {
      const result = await operation();

      if (this.state === "HALF_OPEN") {
        this.successCount++;
        if (this.successCount >= 3) {
          this.state = "CLOSED";
          this.failureCount = 0;
        }
      }

      return result;
    } catch (error) {
      this.failureCount++;
      this.lastFailureTime = Date.now();

      if (
        this.state === "HALF_OPEN" ||
        this.failureCount >= this.failureThreshold
      ) {
        this.state = "OPEN";
      }

      throw error;
    }
  }
}
```

### Usage Example

```javascript
const apiCircuitBreaker = new CircuitBreaker({
  failureThreshold: 3,
  recoveryTimeout: 30000,
});

async function callExternalAPI() {
  try {
    return await apiCircuitBreaker.call(async () => {
      const response = await fetch("https://api.example.com/data");
      if (!response.ok) throw new Error("API call failed");
      return response.json();
    });
  } catch (error) {
    return { error: "Service temporarily unavailable" };
  }
}
```

## Retry Pattern

### Exponential Backoff

```javascript
class RetryPolicy {
  constructor(options = {}) {
    this.maxRetries = options.maxRetries || 3;
    this.baseDelay = options.baseDelay || 1000;
    this.maxDelay = options.maxDelay || 30000;
    this.backoffMultiplier = options.backoffMultiplier || 2;
  }

  async execute(operation, context = {}) {
    let lastError;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        if (attempt === this.maxRetries || !this.isRetryable(error)) {
          throw error;
        }

        const delay = Math.min(
          this.baseDelay * Math.pow(this.backoffMultiplier, attempt),
          this.maxDelay
        );

        await this.sleep(delay + Math.random() * 1000); // Add jitter
      }
    }

    throw lastError;
  }

  isRetryable(error) {
    // Define which errors are worth retrying
    return (
      error.code === "NETWORK_ERROR" ||
      error.code === "TIMEOUT" ||
      (error.status >= 500 && error.status < 600)
    );
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
```

### Retry with Circuit Breaker

```javascript
class ResilientService {
  constructor() {
    this.circuitBreaker = new CircuitBreaker();
    this.retryPolicy = new RetryPolicy();
  }

  async callService(operation) {
    return this.retryPolicy.execute(async () => {
      return this.circuitBreaker.call(operation);
    });
  }
}
```

## Bulkhead Pattern

### Concept

Isolate critical resources to prevent failures in one area from affecting others.

### Thread Pool Isolation

```javascript
class BulkheadExecutor {
  constructor() {
    this.pools = new Map();
  }

  createPool(name, size) {
    this.pools.set(name, {
      queue: [],
      activeJobs: 0,
      maxConcurrency: size,
    });
  }

  async execute(poolName, task) {
    const pool = this.pools.get(poolName);
    if (!pool) throw new Error(`Pool ${poolName} not found`);

    return new Promise((resolve, reject) => {
      const job = { task, resolve, reject };

      if (pool.activeJobs < pool.maxConcurrency) {
        this.executeJob(pool, job);
      } else {
        pool.queue.push(job);
      }
    });
  }

  async executeJob(pool, job) {
    pool.activeJobs++;

    try {
      const result = await job.task();
      job.resolve(result);
    } catch (error) {
      job.reject(error);
    } finally {
      pool.activeJobs--;

      if (pool.queue.length > 0) {
        const nextJob = pool.queue.shift();
        this.executeJob(pool, nextJob);
      }
    }
  }
}
```

### Resource Isolation

```javascript
// Separate connection pools for different services
const userServicePool = new DatabasePool({
  host: "user-db.example.com",
  maxConnections: 10,
});

const orderServicePool = new DatabasePool({
  host: "order-db.example.com",
  maxConnections: 10,
});

const reportingPool = new DatabasePool({
  host: "reporting-db.example.com",
  maxConnections: 5,
});
```

## Timeout Pattern

### Request Timeouts

```javascript
class TimeoutWrapper {
  static async withTimeout(
    promise,
    timeoutMs,
    timeoutMessage = "Operation timed out"
  ) {
    return Promise.race([
      promise,
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
      }),
    ]);
  }
}

// Usage
async function fetchWithTimeout(url) {
  const fetchPromise = fetch(url);
  return TimeoutWrapper.withTimeout(
    fetchPromise,
    5000,
    "Fetch request timed out"
  );
}
```

### Cascading Timeouts

```javascript
class ServiceCall {
  constructor() {
    this.timeouts = {
      database: 1000,
      externalAPI: 3000,
      total: 5000,
    };
  }

  async processRequest(request) {
    const startTime = Date.now();

    try {
      // Database call with timeout
      const userData = await TimeoutWrapper.withTimeout(
        this.getUserData(request.userId),
        this.timeouts.database
      );

      // Check remaining time
      const elapsed = Date.now() - startTime;
      const remainingTime = this.timeouts.total - elapsed;

      if (remainingTime <= 0) {
        throw new Error("Total timeout exceeded");
      }

      // External API call with adjusted timeout
      const apiTimeout = Math.min(this.timeouts.externalAPI, remainingTime);
      const enrichmentData = await TimeoutWrapper.withTimeout(
        this.getEnrichmentData(userData),
        apiTimeout
      );

      return { userData, enrichmentData };
    } catch (error) {
      if (error.message.includes("timeout")) {
        // Handle timeout gracefully
        return this.getFallbackResponse(request);
      }
      throw error;
    }
  }
}
```

## Graceful Degradation

### Feature Toggles

```javascript
class FeatureToggle {
  constructor() {
    this.features = new Map();
    this.loadFeatureConfig();
  }

  isEnabled(featureName, context = {}) {
    const feature = this.features.get(featureName);
    if (!feature) return false;

    // Global toggle
    if (!feature.enabled) return false;

    // Percentage rollout
    if (feature.percentage < 100) {
      const hash = this.hashContext(context);
      return hash % 100 < feature.percentage;
    }

    // User-specific rules
    if (feature.userRules && context.userId) {
      return feature.userRules.includes(context.userId);
    }

    return true;
  }

  async executeWithFallback(
    featureName,
    primaryFunction,
    fallbackFunction,
    context = {}
  ) {
    if (this.isEnabled(featureName, context)) {
      try {
        return await primaryFunction();
      } catch (error) {
        console.warn(`Feature ${featureName} failed, falling back:`, error);
        return await fallbackFunction();
      }
    }

    return await fallbackFunction();
  }
}
```

### Service Degradation

```javascript
class RecommendationService {
  constructor() {
    this.featureToggle = new FeatureToggle();
    this.cache = new Cache();
  }

  async getRecommendations(userId) {
    const context = { userId };

    // Try ML-based recommendations
    if (this.featureToggle.isEnabled("ml_recommendations", context)) {
      try {
        return await this.getMLRecommendations(userId);
      } catch (error) {
        console.warn("ML recommendations failed, degrading to rule-based");
      }
    }

    // Fallback to rule-based recommendations
    if (this.featureToggle.isEnabled("rule_based_recommendations", context)) {
      try {
        return await this.getRuleBasedRecommendations(userId);
      } catch (error) {
        console.warn("Rule-based recommendations failed, using cached");
      }
    }

    // Final fallback to cached popular items
    return await this.getCachedPopularItems();
  }
}
```

## Health Checks and Monitoring

### Health Check Implementation

```javascript
class HealthChecker {
  constructor() {
    this.checks = new Map();
    this.cache = new Map();
    this.cacheTTL = 30000; // 30 seconds
  }

  registerCheck(name, checkFunction, options = {}) {
    this.checks.set(name, {
      check: checkFunction,
      timeout: options.timeout || 5000,
      critical: options.critical || false,
    });
  }

  async runHealthChecks() {
    const results = {};
    const promises = [];

    for (const [name, config] of this.checks) {
      promises.push(this.runSingleCheck(name, config));
    }

    const checkResults = await Promise.allSettled(promises);

    let overallHealth = "healthy";
    checkResults.forEach((result, index) => {
      const checkName = Array.from(this.checks.keys())[index];
      const checkConfig = this.checks.get(checkName);

      if (result.status === "fulfilled") {
        results[checkName] = result.value;
      } else {
        results[checkName] = {
          status: "unhealthy",
          error: result.reason.message,
        };

        if (checkConfig.critical) {
          overallHealth = "unhealthy";
        } else if (overallHealth === "healthy") {
          overallHealth = "degraded";
        }
      }
    });

    return {
      status: overallHealth,
      timestamp: new Date().toISOString(),
      checks: results,
    };
  }

  async runSingleCheck(name, config) {
    const cacheKey = `health_${name}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.result;
    }

    const result = await TimeoutWrapper.withTimeout(
      config.check(),
      config.timeout
    );

    this.cache.set(cacheKey, {
      result,
      timestamp: Date.now(),
    });

    return result;
  }
}

// Usage
const healthChecker = new HealthChecker();

healthChecker.registerCheck(
  "database",
  async () => {
    await database.ping();
    return { status: "healthy", responseTime: 23 };
  },
  { critical: true }
);

healthChecker.registerCheck("external_api", async () => {
  const response = await fetch("https://api.example.com/health");
  return {
    status: response.ok ? "healthy" : "unhealthy",
    statusCode: response.status,
  };
});
```

## Load Shedding

### Priority-Based Load Shedding

```javascript
class LoadShedder {
  constructor(options = {}) {
    this.maxConcurrency = options.maxConcurrency || 100;
    this.currentLoad = 0;
    this.priorities = {
      CRITICAL: 1,
      HIGH: 2,
      NORMAL: 3,
      LOW: 4,
    };
  }

  async execute(operation, priority = "NORMAL") {
    if (this.shouldShed(priority)) {
      throw new Error("Request shed due to high load");
    }

    this.currentLoad++;

    try {
      return await operation();
    } finally {
      this.currentLoad--;
    }
  }

  shouldShed(priority) {
    const loadPercentage = this.currentLoad / this.maxConcurrency;
    const priorityLevel = this.priorities[priority];

    // Shed low priority requests first
    if (priorityLevel === 4 && loadPercentage > 0.8) return true;
    if (priorityLevel === 3 && loadPercentage > 0.9) return true;
    if (priorityLevel === 2 && loadPercentage > 0.95) return true;
    if (priorityLevel === 1 && loadPercentage > 0.98) return true;

    return false;
  }
}
```

### Adaptive Load Shedding

```javascript
class AdaptiveLoadShedder {
  constructor() {
    this.responseTimeHistory = [];
    this.errorRateHistory = [];
    this.windowSize = 100;
    this.responseTimeThreshold = 1000; // ms
    this.errorRateThreshold = 0.1; // 10%
  }

  recordMetrics(responseTime, isError) {
    this.responseTimeHistory.push(responseTime);
    this.errorRateHistory.push(isError ? 1 : 0);

    if (this.responseTimeHistory.length > this.windowSize) {
      this.responseTimeHistory.shift();
      this.errorRateHistory.shift();
    }
  }

  shouldShedRequest() {
    if (this.responseTimeHistory.length < 10) return false;

    const avgResponseTime =
      this.responseTimeHistory.reduce((a, b) => a + b, 0) /
      this.responseTimeHistory.length;

    const errorRate =
      this.errorRateHistory.reduce((a, b) => a + b, 0) /
      this.errorRateHistory.length;

    return (
      avgResponseTime > this.responseTimeThreshold ||
      errorRate > this.errorRateThreshold
    );
  }
}
```

## Disaster Recovery Patterns

### Data Replication

```javascript
class ReplicatedDataStore {
  constructor(primary, replicas) {
    this.primary = primary;
    this.replicas = replicas;
    this.replicationStrategy = "async"; // sync, async, semi-sync
  }

  async write(key, value) {
    // Write to primary first
    await this.primary.write(key, value);

    if (this.replicationStrategy === "sync") {
      // Synchronous replication - wait for all replicas
      await Promise.all(
        this.replicas.map((replica) => replica.write(key, value))
      );
    } else if (this.replicationStrategy === "semi-sync") {
      // Wait for at least one replica
      await Promise.race(
        this.replicas.map((replica) => replica.write(key, value))
      );
    } else {
      // Asynchronous replication - fire and forget
      this.replicas.forEach((replica) => {
        replica.write(key, value).catch((error) => {
          console.error("Replica write failed:", error);
        });
      });
    }
  }

  async read(key) {
    try {
      return await this.primary.read(key);
    } catch (error) {
      // Fallback to replicas on primary failure
      for (const replica of this.replicas) {
        try {
          return await replica.read(key);
        } catch (replicaError) {
          continue;
        }
      }
      throw new Error("All data sources unavailable");
    }
  }
}
```

### Failover Mechanisms

```javascript
class FailoverManager {
  constructor(services) {
    this.services = services;
    this.currentIndex = 0;
    this.healthChecker = new HealthChecker();
  }

  async executeWithFailover(operation) {
    let lastError;

    for (let attempt = 0; attempt < this.services.length; attempt++) {
      const service = this.services[this.currentIndex];

      try {
        // Check service health
        const health = await this.healthChecker.checkService(service);
        if (!health.healthy) {
          throw new Error("Service unhealthy");
        }

        return await operation(service);
      } catch (error) {
        lastError = error;
        console.warn(`Service ${service.name} failed, trying next:`, error);

        // Move to next service
        this.currentIndex = (this.currentIndex + 1) % this.services.length;
      }
    }

    throw new Error(`All services failed. Last error: ${lastError.message}`);
  }
}
```

## Testing Reliability Patterns

### Chaos Engineering

```javascript
class ChaosMonkey {
  constructor(config = {}) {
    this.config = {
      failureRate: 0.01, // 1% failure rate
      latencyRate: 0.05, // 5% latency injection rate
      maxLatency: 5000, // 5 second max latency
      ...config,
    };
  }

  async intercept(operation, serviceName) {
    if (Math.random() < this.config.failureRate) {
      throw new Error(`Chaos Monkey: Simulated failure in ${serviceName}`);
    }

    if (Math.random() < this.config.latencyRate) {
      const latency = Math.random() * this.config.maxLatency;
      await new Promise((resolve) => setTimeout(resolve, latency));
    }

    return await operation();
  }
}
```

### Reliability Testing

```javascript
class ReliabilityTester {
  constructor() {
    this.testResults = [];
  }

  async testCircuitBreaker(service, options = {}) {
    const results = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      circuitBreakerTrips: 0,
    };

    // Simulate load
    for (let i = 0; i < options.requestCount || 1000; i++) {
      try {
        await service.call();
        results.successfulRequests++;
      } catch (error) {
        results.failedRequests++;
        if (error.message.includes("Circuit breaker")) {
          results.circuitBreakerTrips++;
        }
      }
      results.totalRequests++;
    }

    return results;
  }

  async testRetryPolicy(operation, expectedFailures) {
    const attempts = [];
    let success = false;

    try {
      await operation();
      success = true;
    } catch (error) {
      // Expected to fail after retries
    }

    return {
      success,
      totalAttempts: attempts.length,
      expectedFailures: expectedFailures,
    };
  }
}
```

## Best Practices

### Design Principles

1. **Fail Fast**: Detect and report failures quickly
2. **Fail Safe**: Default to safe state when failures occur
3. **Isolation**: Isolate failures to prevent cascade
4. **Redundancy**: Have backup systems and data
5. **Monitoring**: Continuously monitor system health

### Implementation Guidelines

1. **Timeout Everything**: Set timeouts on all external calls
2. **Circuit Break**: Use circuit breakers for external dependencies
3. **Retry Wisely**: Implement intelligent retry strategies
4. **Degrade Gracefully**: Provide reduced functionality when possible
5. **Monitor Continuously**: Track reliability metrics

### Common Pitfalls

1. **Ignoring Cascading Failures**: Not considering downstream effects
2. **Over-Complex Retry Logic**: Making retry mechanisms too complicated
3. **Insufficient Testing**: Not testing failure scenarios
4. **Poor Monitoring**: Inadequate visibility into system health
5. **Resource Exhaustion**: Not implementing proper bulkheading

## Conclusion

Reliability patterns are essential for building robust distributed systems. Key takeaways:

1. **Multiple Defense Layers**: Use multiple patterns together
2. **Test Failure Scenarios**: Regularly test how systems handle failures
3. **Monitor Everything**: Comprehensive monitoring is crucial
4. **Plan for Failures**: Assume failures will happen and prepare
5. **Learn from Incidents**: Use failures as learning opportunities

Implementing these patterns requires careful consideration of trade-offs between complexity, performance, and reliability. Start with the most critical patterns for your use case and gradually add others as needed.
