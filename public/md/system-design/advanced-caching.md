# Advanced Caching Strategies

Comprehensive guide to caching patterns, strategies, and implementations for high-performance distributed systems. Essential knowledge for system design interviews and building scalable applications.

## Caching Fundamentals

### Cache Hierarchy

```
CPU Registers (1 cycle) → L1 Cache (2-4 cycles) → L2 Cache (10-20 cycles) →
L3 Cache (20-40 cycles) → RAM (100-300 cycles) → SSD (50,000 cycles) →
Network (millions of cycles)
```

**Key Principle:** Place frequently accessed data as close to the consumer as possible.

### Cache Performance Metrics

```typescript
interface CacheMetrics {
  hitRate: number; // Percentage of requests served from cache
  missRate: number; // Percentage of requests that missed cache
  latency: number; // Average response time
  throughput: number; // Requests per second
  evictionRate: number; // Items evicted per time period
}

class CacheMonitor {
  private hits = 0;
  private misses = 0;
  private totalLatency = 0;
  private requestCount = 0;

  recordHit(latency: number): void {
    this.hits++;
    this.recordLatency(latency);
  }

  recordMiss(latency: number): void {
    this.misses++;
    this.recordLatency(latency);
  }

  private recordLatency(latency: number): void {
    this.totalLatency += latency;
    this.requestCount++;
  }

  getMetrics(): CacheMetrics {
    const total = this.hits + this.misses;
    return {
      hitRate: total > 0 ? (this.hits / total) * 100 : 0,
      missRate: total > 0 ? (this.misses / total) * 100 : 0,
      latency:
        this.requestCount > 0 ? this.totalLatency / this.requestCount : 0,
      throughput: this.requestCount / (Date.now() / 1000),
      evictionRate: 0, // Calculated separately
    };
  }
}
```

## Cache Patterns

### Cache-Aside (Lazy Loading)

Application manages cache explicitly alongside the database.

```typescript
class CacheAsideRepository<T> {
  constructor(
    private cache: CacheStore<T>,
    private database: DatabaseStore<T>,
    private monitor: CacheMonitor,
    private ttl = 3600
  ) {}

  async get(key: string): Promise<T | null> {
    const startTime = Date.now();

    let data = await this.cache.get(key);
    if (data !== null) {
      this.monitor.recordHit(Date.now() - startTime);
      return data;
    }

    data = await this.database.get(key);
    const latency = Date.now() - startTime;

    if (data !== null) {
      await this.cache.set(key, data, this.ttl);
      this.monitor.recordMiss(latency);
      return data;
    }

    this.monitor.recordMiss(latency);
    return null;
  }

  async update(key: string, data: T): Promise<void> {
    await this.database.update(key, data);
    await this.cache.delete(key); // Invalidate to maintain consistency
  }

  async delete(key: string): Promise<void> {
    await this.database.delete(key);
    await this.cache.delete(key);
  }
}
```

**Pros:** Simple, application has full control, cache failures don't affect system
**Cons:** Cache misses involve two round trips, potential for stale data

### Write-Through Caching

Writes go through cache to database synchronously.

```typescript
class WriteThroughCache<T> {
  constructor(
    private cache: CacheStore<T>,
    private database: DatabaseStore<T>,
    private ttl = 3600
  ) {}

  async get(key: string): Promise<T | null> {
    let data = await this.cache.get(key);
    if (data !== null) {
      return data;
    }

    data = await this.database.get(key);
    if (data !== null) {
      await this.cache.set(key, data, this.ttl);
    }
    return data;
  }

  async set(key: string, data: T): Promise<void> {
    await this.cache.set(key, data, this.ttl);
    await this.database.set(key, data);
  }

  async delete(key: string): Promise<void> {
    await this.cache.delete(key);
    await this.database.delete(key);
  }
}
```

**Pros:** Data consistency, immediate cache population
**Cons:** Higher write latency, unused data in cache

### Write-Behind (Write-Back) Caching

Cache handles writes asynchronously, improving write performance.

```typescript
interface WriteOperation<T> {
  key: string;
  data: T;
  operation: "SET" | "DELETE";
  timestamp: Date;
  retryCount: number;
}

class WriteBehindCache<T> {
  private writeQueue: WriteOperation<T>[] = [];
  private isProcessing = false;
  private pendingWrites = new Set<string>();

  constructor(
    private cache: CacheStore<T>,
    private database: DatabaseStore<T>,
    private batchSize = 50,
    private flushInterval = 5000,
    private maxRetries = 3
  ) {
    setInterval(() => this.flushPendingWrites(), flushInterval);
  }

  async get(key: string): Promise<T | null> {
    return this.cache.get(key);
  }

  async set(key: string, data: T): Promise<void> {
    await this.cache.set(key, data);
    this.queueWrite({
      key,
      data,
      operation: "SET",
      timestamp: new Date(),
      retryCount: 0,
    });
  }

  async delete(key: string): Promise<void> {
    await this.cache.delete(key);
    this.queueWrite({
      key,
      data: null as any,
      operation: "DELETE",
      timestamp: new Date(),
      retryCount: 0,
    });
  }

  private queueWrite(operation: WriteOperation<T>): void {
    if (!this.pendingWrites.has(operation.key)) {
      this.writeQueue.push(operation);
      this.pendingWrites.add(operation.key);
    }

    if (this.writeQueue.length >= this.batchSize) {
      this.flushPendingWrites();
    }
  }

  private async flushPendingWrites(): Promise<void> {
    if (this.isProcessing || this.writeQueue.length === 0) {
      return;
    }

    this.isProcessing = true;
    const batch = this.writeQueue.splice(0, this.batchSize);

    const failedOperations: WriteOperation<T>[] = [];

    for (const operation of batch) {
      try {
        if (operation.operation === "SET") {
          await this.database.set(operation.key, operation.data);
        } else {
          await this.database.delete(operation.key);
        }
        this.pendingWrites.delete(operation.key);
      } catch (error) {
        console.error(
          `Write-behind operation failed for key ${operation.key}:`,
          error
        );

        if (operation.retryCount < this.maxRetries) {
          operation.retryCount++;
          failedOperations.push(operation);
        } else {
          console.error(`Max retries exceeded for key ${operation.key}`);
          this.pendingWrites.delete(operation.key);
        }
      }
    }

    this.writeQueue.unshift(...failedOperations);
    this.isProcessing = false;
  }

  async forceFlush(): Promise<void> {
    while (this.writeQueue.length > 0) {
      await this.flushPendingWrites();
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
}
```

**Pros:** Excellent write performance, batch operations
**Cons:** Risk of data loss, eventual consistency

### Refresh-Ahead Caching

Proactively refreshes cache entries before they expire.

```typescript
class RefreshAheadCache<T> {
  private refreshThreshold = 0.8; // Refresh when 80% of TTL elapsed
  private refreshingKeys = new Set<string>();

  constructor(
    private cache: CacheStore<T>,
    private database: DatabaseStore<T>,
    private defaultTtl = 3600
  ) {}

  async get(key: string): Promise<T | null> {
    const cacheEntry = await this.cache.getWithMetadata(key);

    if (cacheEntry) {
      this.scheduleRefreshIfNeeded(key, cacheEntry.createdAt, this.defaultTtl);
      return cacheEntry.data;
    }

    const data = await this.database.get(key);
    if (data !== null) {
      await this.cache.set(key, data, this.defaultTtl);
    }
    return data;
  }

  private scheduleRefreshIfNeeded(
    key: string,
    createdAt: Date,
    ttl: number
  ): void {
    const elapsed = (Date.now() - createdAt.getTime()) / 1000;
    const shouldRefresh = elapsed > ttl * this.refreshThreshold;

    if (shouldRefresh && !this.refreshingKeys.has(key)) {
      this.refreshingKeys.add(key);
      this.refreshAsync(key).finally(() => {
        this.refreshingKeys.delete(key);
      });
    }
  }

  private async refreshAsync(key: string): Promise<void> {
    try {
      const freshData = await this.database.get(key);
      if (freshData !== null) {
        await this.cache.set(key, freshData, this.defaultTtl);
      }
    } catch (error) {
      console.error(`Failed to refresh cache key ${key}:`, error);
    }
  }
}
```

## Eviction Algorithms

### LRU (Least Recently Used)

```typescript
class LRUCache<T> {
  private cache = new Map<string, T>();
  private usage = new Map<string, number>();
  private currentTime = 0;

  constructor(private maxSize: number) {}

  get(key: string): T | null {
    const value = this.cache.get(key);
    if (value !== undefined) {
      this.usage.set(key, ++this.currentTime);
      return value;
    }
    return null;
  }

  set(key: string, value: T): void {
    if (this.cache.has(key)) {
      this.cache.set(key, value);
      this.usage.set(key, ++this.currentTime);
      return;
    }

    if (this.cache.size >= this.maxSize) {
      this.evictLeastRecentlyUsed();
    }

    this.cache.set(key, value);
    this.usage.set(key, ++this.currentTime);
  }

  private evictLeastRecentlyUsed(): void {
    let lruKey = "";
    let lruTime = Number.MAX_SAFE_INTEGER;

    for (const [key, time] of this.usage) {
      if (time < lruTime) {
        lruTime = time;
        lruKey = key;
      }
    }

    this.cache.delete(lruKey);
    this.usage.delete(lruKey);
  }
}
```

### LFU (Least Frequently Used)

```typescript
class LFUCache<T> {
  private cache = new Map<string, T>();
  private frequencies = new Map<string, number>();
  private minFrequency = 0;
  private frequencyGroups = new Map<number, Set<string>>();

  constructor(private maxSize: number) {}

  get(key: string): T | null {
    const value = this.cache.get(key);
    if (value !== undefined) {
      this.incrementFrequency(key);
      return value;
    }
    return null;
  }

  set(key: string, value: T): void {
    if (this.maxSize <= 0) return;

    if (this.cache.has(key)) {
      this.cache.set(key, value);
      this.incrementFrequency(key);
      return;
    }

    if (this.cache.size >= this.maxSize) {
      this.evictLeastFrequentlyUsed();
    }

    this.cache.set(key, value);
    this.frequencies.set(key, 1);

    if (!this.frequencyGroups.has(1)) {
      this.frequencyGroups.set(1, new Set());
    }
    this.frequencyGroups.get(1)!.add(key);
    this.minFrequency = 1;
  }

  private incrementFrequency(key: string): void {
    const currentFreq = this.frequencies.get(key)!;
    const newFreq = currentFreq + 1;

    this.frequencies.set(key, newFreq);

    this.frequencyGroups.get(currentFreq)!.delete(key);
    if (
      this.frequencyGroups.get(currentFreq)!.size === 0 &&
      currentFreq === this.minFrequency
    ) {
      this.minFrequency++;
    }

    if (!this.frequencyGroups.has(newFreq)) {
      this.frequencyGroups.set(newFreq, new Set());
    }
    this.frequencyGroups.get(newFreq)!.add(key);
  }

  private evictLeastFrequentlyUsed(): void {
    const lruGroup = this.frequencyGroups.get(this.minFrequency)!;
    const keyToEvict = lruGroup.values().next().value;

    lruGroup.delete(keyToEvict);
    this.cache.delete(keyToEvict);
    this.frequencies.delete(keyToEvict);
  }
}
```

### TTL-based Eviction

```typescript
interface CacheEntry<T> {
  data: T;
  expiresAt: Date;
}

class TTLCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private expirationTimer: NodeJS.Timeout;

  constructor(private cleanupInterval = 60000) {
    this.expirationTimer = setInterval(() => this.cleanup(), cleanupInterval);
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (entry.expiresAt <= new Date()) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set(key: string, value: T, ttlSeconds: number = 3600): void {
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000);
    this.cache.set(key, { data: value, expiresAt });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  private cleanup(): void {
    const now = new Date();
    const expiredKeys: string[] = [];

    for (const [key, entry] of this.cache) {
      if (entry.expiresAt <= now) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach((key) => this.cache.delete(key));
  }

  destroy(): void {
    clearInterval(this.expirationTimer);
    this.cache.clear();
  }
}
```

## Distributed Caching

### Consistent Hashing for Cache Distribution

```typescript
interface CacheNode {
  id: string;
  host: string;
  port: number;
  weight: number;
}

class ConsistentHashRing {
  private ring = new Map<number, CacheNode>();
  private sortedHashes: number[] = [];
  private virtualNodeCount = 150;

  addNode(node: CacheNode): void {
    for (let i = 0; i < this.virtualNodeCount * node.weight; i++) {
      const hash = this.hash(`${node.id}:${i}`);
      this.ring.set(hash, node);
    }
    this.sortedHashes = Array.from(this.ring.keys()).sort((a, b) => a - b);
  }

  removeNode(nodeId: string): void {
    const toRemove: number[] = [];
    for (const [hash, node] of this.ring) {
      if (node.id === nodeId) {
        toRemove.push(hash);
      }
    }
    toRemove.forEach((hash) => this.ring.delete(hash));
    this.sortedHashes = Array.from(this.ring.keys()).sort((a, b) => a - b);
  }

  getNode(key: string): CacheNode | null {
    if (this.sortedHashes.length === 0) return null;

    const hash = this.hash(key);

    let nodeHash = this.sortedHashes.find((h) => h >= hash);
    if (!nodeHash) {
      nodeHash = this.sortedHashes[0]; // Wrap around
    }

    return this.ring.get(nodeHash) || null;
  }

  private hash(key: string): number {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      const char = key.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
}

class DistributedCache<T> {
  private hashRing = new ConsistentHashRing();
  private nodeClients = new Map<string, CacheClient<T>>();

  addNode(node: CacheNode, client: CacheClient<T>): void {
    this.hashRing.addNode(node);
    this.nodeClients.set(node.id, client);
  }

  removeNode(nodeId: string): void {
    this.hashRing.removeNode(nodeId);
    this.nodeClients.delete(nodeId);
  }

  async get(key: string): Promise<T | null> {
    const node = this.hashRing.getNode(key);
    if (!node) return null;

    const client = this.nodeClients.get(node.id);
    return client ? client.get(key) : null;
  }

  async set(key: string, value: T, ttl?: number): Promise<void> {
    const node = this.hashRing.getNode(key);
    if (!node) return;

    const client = this.nodeClients.get(node.id);
    if (client) {
      await client.set(key, value, ttl);
    }
  }

  async delete(key: string): Promise<void> {
    const node = this.hashRing.getNode(key);
    if (!node) return;

    const client = this.nodeClients.get(node.id);
    if (client) {
      await client.delete(key);
    }
  }
}
```

### Cache Replication and Failover

```typescript
class ReplicatedCache<T> {
  private primaryCache: CacheClient<T>;
  private replicas: CacheClient<T>[] = [];
  private isHealthy = new Map<CacheClient<T>, boolean>();

  constructor(primary: CacheClient<T>, replicas: CacheClient<T>[] = []) {
    this.primaryCache = primary;
    this.replicas = replicas;
    this.initializeHealthChecks();
  }

  async get(key: string): Promise<T | null> {
    if (this.isHealthy.get(this.primaryCache)) {
      try {
        return await this.primaryCache.get(key);
      } catch (error) {
        console.error("Primary cache error:", error);
        this.markUnhealthy(this.primaryCache);
      }
    }

    for (const replica of this.replicas) {
      if (this.isHealthy.get(replica)) {
        try {
          return await replica.get(key);
        } catch (error) {
          console.error("Replica cache error:", error);
          this.markUnhealthy(replica);
        }
      }
    }

    return null;
  }

  async set(key: string, value: T, ttl?: number): Promise<void> {
    const writePromises: Promise<void>[] = [];

    if (this.isHealthy.get(this.primaryCache)) {
      writePromises.push(
        this.primaryCache.set(key, value, ttl).catch((error) => {
          console.error("Primary write failed:", error);
          this.markUnhealthy(this.primaryCache);
        })
      );
    }

    for (const replica of this.replicas) {
      if (this.isHealthy.get(replica)) {
        writePromises.push(
          replica.set(key, value, ttl).catch((error) => {
            console.error("Replica write failed:", error);
            this.markUnhealthy(replica);
          })
        );
      }
    }

    await Promise.allSettled(writePromises);
  }

  private initializeHealthChecks(): void {
    const allNodes = [this.primaryCache, ...this.replicas];

    allNodes.forEach((node) => {
      this.isHealthy.set(node, true);
      setInterval(() => this.healthCheck(node), 30000);
    });
  }

  private async healthCheck(cache: CacheClient<T>): Promise<void> {
    try {
      await cache.ping();
      this.isHealthy.set(cache, true);
    } catch (error) {
      this.markUnhealthy(cache);
    }
  }

  private markUnhealthy(cache: CacheClient<T>): void {
    this.isHealthy.set(cache, false);
    setTimeout(() => this.healthCheck(cache), 10000);
  }
}
```

## Cache Warming Strategies

### Predictive Cache Warming

```typescript
interface AccessPattern {
  key: string;
  accessCount: number;
  lastAccessed: Date;
  accessFrequency: number;
}

class PredictiveCacheWarmer<T> {
  private accessPatterns = new Map<string, AccessPattern>();

  constructor(
    private cache: CacheStore<T>,
    private dataSource: DataSource<T>,
    private analysisWindow = 24 * 60 * 60 * 1000 // 24 hours
  ) {
    setInterval(() => this.analyzeAndWarm(), 60 * 60 * 1000); // Hourly
  }

  recordAccess(key: string): void {
    const pattern = this.accessPatterns.get(key) || {
      key,
      accessCount: 0,
      lastAccessed: new Date(),
      accessFrequency: 0,
    };

    pattern.accessCount++;
    pattern.lastAccessed = new Date();
    pattern.accessFrequency = this.calculateFrequency(pattern);

    this.accessPatterns.set(key, pattern);
  }

  private calculateFrequency(pattern: AccessPattern): number {
    const timeSinceFirstAccess =
      Date.now() -
      (Date.now() -
        pattern.accessCount * (this.analysisWindow / pattern.accessCount));
    return pattern.accessCount / (timeSinceFirstAccess / this.analysisWindow);
  }

  private async analyzeAndWarm(): Promise<void> {
    const hotKeys = Array.from(this.accessPatterns.values())
      .filter((pattern) => {
        const isRecent =
          Date.now() - pattern.lastAccessed.getTime() < this.analysisWindow;
        const isFrequent = pattern.accessFrequency > 0.1; // More than 10% of analysis window
        return isRecent && isFrequent;
      })
      .sort((a, b) => b.accessFrequency - a.accessFrequency)
      .slice(0, 100); // Top 100 hot keys

    const warmingPromises = hotKeys.map(async (pattern) => {
      const inCache = await this.cache.get(pattern.key);
      if (!inCache) {
        try {
          const data = await this.dataSource.get(pattern.key);
          if (data) {
            await this.cache.set(pattern.key, data);
          }
        } catch (error) {
          console.error(`Failed to warm cache for key ${pattern.key}:`, error);
        }
      }
    });

    await Promise.allSettled(warmingPromises);
  }
}
```

### Time-based Cache Warming

```typescript
class ScheduledCacheWarmer<T> {
  private warmingSchedules = new Map<string, NodeJS.Timeout>();

  constructor(
    private cache: CacheStore<T>,
    private dataSource: DataSource<T>
  ) {}

  scheduleWarming(key: string, cronPattern: string, ttl: number = 3600): void {
    const schedule = this.parseCronPattern(cronPattern);
    const intervalMs = this.calculateInterval(schedule);

    const timerId = setInterval(async () => {
      try {
        const data = await this.dataSource.get(key);
        if (data) {
          await this.cache.set(key, data, ttl);
        }
      } catch (error) {
        console.error(`Scheduled warming failed for key ${key}:`, error);
      }
    }, intervalMs);

    this.warmingSchedules.set(key, timerId);
  }

  unscheduleWarming(key: string): void {
    const timerId = this.warmingSchedules.get(key);
    if (timerId) {
      clearInterval(timerId);
      this.warmingSchedules.delete(key);
    }
  }

  async warmNow(keys: string[]): Promise<void> {
    const warmingPromises = keys.map(async (key) => {
      try {
        const data = await this.dataSource.get(key);
        if (data) {
          await this.cache.set(key, data);
        }
      } catch (error) {
        console.error(`Immediate warming failed for key ${key}:`, error);
      }
    });

    await Promise.allSettled(warmingPromises);
  }

  private parseCronPattern(pattern: string): any {
    // Simplified cron parsing - in practice, use a proper cron library
    return { pattern };
  }

  private calculateInterval(schedule: any): number {
    // Simplified - return hourly for this example
    return 60 * 60 * 1000;
  }
}
```

## Cache Security

### Secure Cache Implementation

```typescript
class SecureCache<T> {
  private encryptionKey: Buffer;

  constructor(
    private cache: CacheStore<string>,
    encryptionKey: string,
    private maxValueSize = 1024 * 1024 // 1MB
  ) {
    this.encryptionKey = Buffer.from(encryptionKey, "hex");
  }

  async get(key: string): Promise<T | null> {
    const sanitizedKey = this.sanitizeKey(key);
    const encryptedData = await this.cache.get(sanitizedKey);

    if (!encryptedData) return null;

    try {
      const decryptedData = this.decrypt(encryptedData);
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error("Failed to decrypt cache data:", error);
      await this.cache.delete(sanitizedKey);
      return null;
    }
  }

  async set(key: string, value: T, ttl?: number): Promise<void> {
    const sanitizedKey = this.sanitizeKey(key);
    const serializedValue = JSON.stringify(value);

    if (serializedValue.length > this.maxValueSize) {
      throw new Error(`Value too large: ${serializedValue.length} bytes`);
    }

    const encryptedData = this.encrypt(serializedValue);
    await this.cache.set(sanitizedKey, encryptedData, ttl);
  }

  async delete(key: string): Promise<void> {
    const sanitizedKey = this.sanitizeKey(key);
    await this.cache.delete(sanitizedKey);
  }

  private sanitizeKey(key: string): string {
    // Remove potentially dangerous characters
    return key.replace(/[^a-zA-Z0-9:_-]/g, "_");
  }

  private encrypt(data: string): string {
    const crypto = require("crypto");
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher("aes-256-cbc", this.encryptionKey);

    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");

    return iv.toString("hex") + ":" + encrypted;
  }

  private decrypt(encryptedData: string): string {
    const crypto = require("crypto");
    const [ivHex, encrypted] = encryptedData.split(":");
    const iv = Buffer.from(ivHex, "hex");

    const decipher = crypto.createDecipher("aes-256-cbc", this.encryptionKey);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  }
}
```

## Performance Optimization

### Cache Compression

```typescript
class CompressedCache<T> {
  constructor(
    private cache: CacheStore<string>,
    private compressionThreshold = 1024 // Compress if larger than 1KB
  ) {}

  async get(key: string): Promise<T | null> {
    const data = await this.cache.get(key);
    if (!data) return null;

    try {
      const decompressed = this.decompress(data);
      return JSON.parse(decompressed);
    } catch (error) {
      console.error("Failed to decompress cache data:", error);
      return null;
    }
  }

  async set(key: string, value: T, ttl?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    const data =
      serialized.length > this.compressionThreshold
        ? this.compress(serialized)
        : serialized;

    await this.cache.set(key, data, ttl);
  }

  private compress(data: string): string {
    const zlib = require("zlib");
    const compressed = zlib.deflateSync(Buffer.from(data, "utf8"));
    return "compressed:" + compressed.toString("base64");
  }

  private decompress(data: string): string {
    if (!data.startsWith("compressed:")) {
      return data; // Not compressed
    }

    const zlib = require("zlib");
    const compressed = Buffer.from(data.substring(11), "base64");
    const decompressed = zlib.inflateSync(compressed);
    return decompressed.toString("utf8");
  }
}
```

### Multi-Level Caching

```typescript
class MultiLevelCache<T> {
  constructor(
    private l1Cache: CacheStore<T>, // Fast, small (memory)
    private l2Cache: CacheStore<T>, // Medium, larger (Redis)
    private l3Cache: CacheStore<T> // Slow, largest (disk/network)
  ) {}

  async get(key: string): Promise<T | null> {
    let data = await this.l1Cache.get(key);
    if (data !== null) {
      return data;
    }

    data = await this.l2Cache.get(key);
    if (data !== null) {
      await this.l1Cache.set(key, data, 300); // 5 min in L1
      return data;
    }

    data = await this.l3Cache.get(key);
    if (data !== null) {
      await this.l1Cache.set(key, data, 300);
      await this.l2Cache.set(key, data, 3600); // 1 hour in L2
      return data;
    }

    return null;
  }

  async set(key: string, value: T): Promise<void> {
    await Promise.all([
      this.l1Cache.set(key, value, 300),
      this.l2Cache.set(key, value, 3600),
      this.l3Cache.set(key, value, 86400), // 24 hours in L3
    ]);
  }

  async delete(key: string): Promise<void> {
    await Promise.all([
      this.l1Cache.delete(key),
      this.l2Cache.delete(key),
      this.l3Cache.delete(key),
    ]);
  }
}
```

## Interview Questions & Answers

### Common Cache Interview Scenarios

**Q: How do you handle cache invalidation in a distributed system?**

**A: Cache invalidation strategies:**

1. **TTL-based expiration** for time-sensitive data
2. **Event-driven invalidation** using message queues
3. **Version-based invalidation** with cache keys containing version numbers
4. **Tag-based invalidation** for related data groups

```typescript
class DistributedCacheInvalidation {
  constructor(private eventBus: EventBus, private cacheNodes: CacheNode[]) {
    this.eventBus.subscribe(
      "CACHE_INVALIDATE",
      this.handleInvalidation.bind(this)
    );
  }

  async invalidateKey(key: string): Promise<void> {
    await this.eventBus.publish({
      type: "CACHE_INVALIDATE",
      payload: { key },
      timestamp: new Date(),
    });
  }

  private async handleInvalidation(event: any): Promise<void> {
    const { key } = event.payload;
    const promises = this.cacheNodes.map((node) => node.delete(key));
    await Promise.allSettled(promises);
  }
}
```

**Q: How do you prevent cache stampede?**

**A: Cache stampede prevention techniques:**

```typescript
class AntiStampedeCache<T> {
  private lockManager = new Map<string, Promise<T | null>>();

  async get(key: string): Promise<T | null> {
    let data = await this.cache.get(key);
    if (data !== null) return data;

    // Check if another request is already fetching this key
    if (this.lockManager.has(key)) {
      return this.lockManager.get(key)!;
    }

    // Create a promise for this fetch operation
    const fetchPromise = this.fetchAndCache(key);
    this.lockManager.set(key, fetchPromise);

    try {
      data = await fetchPromise;
    } finally {
      this.lockManager.delete(key);
    }

    return data;
  }

  private async fetchAndCache(key: string): Promise<T | null> {
    const data = await this.dataSource.get(key);
    if (data !== null) {
      await this.cache.set(key, data);
    }
    return data;
  }
}
```

**Q: How do you implement cache warming for a recommendation system?**

**A: Recommendation cache warming strategy:**

```typescript
class RecommendationCacheWarmer {
  async warmUserRecommendations(): Promise<void> {
    const activeUsers = await this.getActiveUsers();
    const chunks = this.chunkArray(activeUsers, 100);

    for (const chunk of chunks) {
      const promises = chunk.map(async (user) => {
        try {
          const recommendations = await this.ml.generateRecommendations(
            user.id
          );
          await this.cache.set(
            `recommendations:${user.id}`,
            recommendations,
            3600 // 1 hour TTL
          );
        } catch (error) {
          console.error(`Failed to warm recommendations for user ${user.id}`);
        }
      });

      await Promise.allSettled(promises);
      await this.sleep(100); // Rate limiting
    }
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}
```

**Key Takeaways:**

1. **Choose the right caching pattern** based on read/write patterns and consistency requirements
2. **Implement proper eviction policies** to maximize cache efficiency
3. **Monitor cache performance** with hit rates, latency, and throughput metrics
4. **Plan for cache failures** with fallback mechanisms and graceful degradation
5. **Consider security implications** especially for sensitive data
6. **Design for scalability** with distributed caching and consistent hashing
7. **Optimize for your specific use case** with compression, multi-level caching, or specialized algorithms

Effective caching is crucial for system performance and scalability, requiring careful consideration of data access patterns, consistency requirements, and operational complexity.
