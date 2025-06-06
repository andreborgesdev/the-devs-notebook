# Caching

## Overview

Caching is a fundamental technique in system design that stores frequently accessed data in a high-speed storage layer to reduce latency, improve performance, and decrease load on backend systems. It acts as a temporary storage mechanism between the client and the primary data source.

### Core Principles

**Performance Optimization**

- Reduces average response time by serving frequently requested data from fast storage
- Minimizes expensive operations (database queries, network calls, computations)
- Improves system throughput and user experience

**Resource Efficiency**

- Reduces load on backend systems (databases, APIs, services)
- Optimizes network bandwidth usage
- Lowers computational overhead for repeated operations

**Scalability Enhancement**

- Enables systems to handle higher traffic volumes
- Provides horizontal scaling capabilities through distributed caching
- Reduces bottlenecks in data access patterns

## Cache Hierarchy and Placement

### Multi-Level Cache Architecture

```plaintext
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Browser   │ -> │     CDN     │ -> │  Load Bal.  │ -> │   Server    │
│    Cache    │    │    Cache    │    │    Cache    │    │   Cache     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                                 |
┌─────────────┐    ┌─────────────┐    ┌─────────────┐           v
│  Database   │ <- │ Application │ <- │  In-Memory  │    ┌─────────────┐
│    Cache    │    │    Cache    │    │    Cache    │    │  Distributed│
└─────────────┘    └─────────────┘    └─────────────┘    │    Cache    │
                                                          └─────────────┘
```

### Cache Placement Strategies

| Level  | Location  | Latency | Use Case             | Examples                   |
| ------ | --------- | ------- | -------------------- | -------------------------- |
| **L1** | CPU Cache | ~1ns    | Processor operations | CPU L1/L2/L3               |
| **L2** | Memory    | ~100ns  | Application data     | In-memory stores           |
| **L3** | Local SSD | ~10μs   | Local persistence    | Local Redis                |
| **L4** | Network   | ~1ms    | Distributed cache    | Redis Cluster              |
| **L5** | CDN       | ~10ms   | Global content       | CloudFlare, AWS CloudFront |

## Caching Patterns and Strategies

### 1. Cache-Aside (Lazy Loading)

The application manages the cache directly.

```typescript
class CacheAsideService {
  private cache: Map<string, any> = new Map();
  private database: Database;

  async get(key: string): Promise<any> {
    const cached = this.cache.get(key);
    if (cached) {
      return cached;
    }

    const data = await this.database.query(key);
    this.cache.set(key, data);
    return data;
  }

  async update(key: string, data: any): Promise<void> {
    await this.database.update(key, data);
    this.cache.delete(key);
  }
}
```

**Pros:**

- Simple implementation
- Cache only what's needed
- Resilient to cache failures

**Cons:**

- Cache miss penalty
- Potential cache inconsistency
- Complex invalidation logic

### 2. Read-Through Cache

Cache sits between application and database, handling data loading automatically.

```typescript
class ReadThroughCache {
  private cache: Map<string, any> = new Map();
  private database: Database;

  async get(key: string): Promise<any> {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    const data = await this.loadFromDatabase(key);
    this.cache.set(key, data);
    return data;
  }

  private async loadFromDatabase(key: string): Promise<any> {
    return await this.database.query(key);
  }
}
```

### 3. Write-Through Cache

Writes go through the cache to the database synchronously.

```typescript
class WriteThroughCache {
  private cache: Map<string, any> = new Map();
  private database: Database;

  async set(key: string, data: any): Promise<void> {
    this.cache.set(key, data);
    await this.database.update(key, data);
  }

  async get(key: string): Promise<any> {
    return this.cache.get(key);
  }
}
```

**Pros:**

- Strong consistency
- No data loss risk
- Simple recovery

**Cons:**

- Higher write latency
- Unnecessary cache storage
- Write bottleneck

### 4. Write-Behind (Write-Back) Cache

Writes to cache immediately, database updates happen asynchronously.

```typescript
class WriteBehindCache {
  private cache: Map<string, any> = new Map();
  private dirtyKeys: Set<string> = new Set();
  private database: Database;

  constructor() {
    setInterval(() => this.flushDirtyData(), 5000);
  }

  async set(key: string, data: any): Promise<void> {
    this.cache.set(key, data);
    this.dirtyKeys.add(key);
  }

  private async flushDirtyData(): Promise<void> {
    const keysToFlush = Array.from(this.dirtyKeys);
    for (const key of keysToFlush) {
      const data = this.cache.get(key);
      await this.database.update(key, data);
      this.dirtyKeys.delete(key);
    }
  }
}
```

**Pros:**

- Low write latency
- High write throughput
- Batch optimizations

**Cons:**

- Data loss risk
- Complex consistency
- Eventual consistency

### 5. Refresh-Ahead Cache

Proactively refreshes cache entries before they expire.

```typescript
class RefreshAheadCache {
  private cache: Map<string, CacheEntry> = new Map();
  private database: Database;

  async get(key: string): Promise<any> {
    const entry = this.cache.get(key);

    if (!entry || this.isExpired(entry)) {
      return await this.loadAndCache(key);
    }

    if (this.shouldRefresh(entry)) {
      this.refreshAsync(key);
    }

    return entry.data;
  }

  private shouldRefresh(entry: CacheEntry): boolean {
    const refreshThreshold = entry.ttl * 0.8;
    return Date.now() - entry.timestamp > refreshThreshold;
  }

  private async refreshAsync(key: string): Promise<void> {
    try {
      const data = await this.database.query(key);
      this.cache.set(key, {
        data,
        timestamp: Date.now(),
        ttl: 300000,
      });
    } catch (error) {
      console.error(`Failed to refresh cache for key ${key}:`, error);
    }
  }
}

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}
```

## Cache Eviction Policies

### Common Eviction Algorithms

```typescript
abstract class EvictionPolicy<K, V> {
  abstract evict(cache: Map<K, V>): K | null;
  abstract recordAccess(key: K): void;
}

class LRUEvictionPolicy<K, V> extends EvictionPolicy<K, V> {
  private accessOrder: Map<K, number> = new Map();
  private counter = 0;

  recordAccess(key: K): void {
    this.accessOrder.set(key, ++this.counter);
  }

  evict(cache: Map<K, V>): K | null {
    let lruKey: K | null = null;
    let oldestAccess = Infinity;

    for (const [key, accessTime] of this.accessOrder) {
      if (accessTime < oldestAccess) {
        oldestAccess = accessTime;
        lruKey = key;
      }
    }

    if (lruKey) {
      this.accessOrder.delete(lruKey);
    }

    return lruKey;
  }
}

class LFUEvictionPolicy<K, V> extends EvictionPolicy<K, V> {
  private frequency: Map<K, number> = new Map();

  recordAccess(key: K): void {
    this.frequency.set(key, (this.frequency.get(key) || 0) + 1);
  }

  evict(cache: Map<K, V>): K | null {
    let lfuKey: K | null = null;
    let minFrequency = Infinity;

    for (const [key, freq] of this.frequency) {
      if (freq < minFrequency) {
        minFrequency = freq;
        lfuKey = key;
      }
    }

    if (lfuKey) {
      this.frequency.delete(lfuKey);
    }

    return lfuKey;
  }
}
```

### Eviction Policy Comparison

| Policy     | Use Case                   | Pros                                    | Cons                               |
| ---------- | -------------------------- | --------------------------------------- | ---------------------------------- |
| **LRU**    | Time-based access patterns | Simple, effective for temporal locality | Poor for cyclic access patterns    |
| **LFU**    | Frequency-based patterns   | Good for popular content                | Slow to adapt to changing patterns |
| **FIFO**   | Simple use cases           | Very simple implementation              | Ignores access patterns            |
| **Random** | Uniform access patterns    | Low overhead, simple                    | No intelligence in selection       |
| **TTL**    | Time-sensitive data        | Automatic expiration                    | May evict popular items            |

## Advanced Caching Techniques

### 1. Cache Warming

```typescript
class CacheWarmingService {
  private cache: Map<string, any> = new Map();
  private database: Database;

  async warmup(keys: string[]): Promise<void> {
    const promises = keys.map(async (key) => {
      try {
        const data = await this.database.query(key);
        this.cache.set(key, data);
      } catch (error) {
        console.error(`Failed to warm cache for key ${key}:`, error);
      }
    });

    await Promise.all(promises);
  }

  async preloadPopularContent(): Promise<void> {
    const popularKeys = await this.database.getPopularKeys();
    await this.warmup(popularKeys);
  }
}
```

### 2. Cache Partitioning and Sharding

```typescript
class ShardedCache {
  private shards: Map<string, any>[];
  private shardCount: number;

  constructor(shardCount: number = 8) {
    this.shardCount = shardCount;
    this.shards = Array.from({ length: shardCount }, () => new Map());
  }

  private getShardIndex(key: string): number {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = ((hash << 5) - hash + key.charCodeAt(i)) & 0xffffffff;
    }
    return Math.abs(hash) % this.shardCount;
  }

  set(key: string, value: any): void {
    const shardIndex = this.getShardIndex(key);
    this.shards[shardIndex].set(key, value);
  }

  get(key: string): any {
    const shardIndex = this.getShardIndex(key);
    return this.shards[shardIndex].get(key);
  }

  delete(key: string): boolean {
    const shardIndex = this.getShardIndex(key);
    return this.shards[shardIndex].delete(key);
  }
}
```

### 3. Multi-Level Caching

```typescript
class MultiLevelCache {
  private l1Cache: Map<string, any> = new Map();
  private l2Cache: Map<string, any> = new Map();
  private database: Database;
  private l1MaxSize = 100;
  private l2MaxSize = 1000;

  async get(key: string): Promise<any> {
    let data = this.l1Cache.get(key);
    if (data) {
      return data;
    }

    data = this.l2Cache.get(key);
    if (data) {
      this.promoteToL1(key, data);
      return data;
    }

    data = await this.database.query(key);
    this.set(key, data);
    return data;
  }

  set(key: string, data: any): void {
    this.promoteToL1(key, data);
    this.l2Cache.set(key, data);
    this.evictIfNecessary();
  }

  private promoteToL1(key: string, data: any): void {
    if (this.l1Cache.size >= this.l1MaxSize) {
      const firstKey = this.l1Cache.keys().next().value;
      const demotedData = this.l1Cache.get(firstKey);
      this.l1Cache.delete(firstKey);
      this.l2Cache.set(firstKey, demotedData);
    }
    this.l1Cache.set(key, data);
  }

  private evictIfNecessary(): void {
    while (this.l2Cache.size > this.l2MaxSize) {
      const firstKey = this.l2Cache.keys().next().value;
      this.l2Cache.delete(firstKey);
    }
  }
}
```

## Distributed Caching

### Consistent Hashing for Cache Distribution

```typescript
class ConsistentHashRing {
  private ring: Map<number, string> = new Map();
  private nodes: Set<string> = new Set();
  private virtualNodes: number;

  constructor(virtualNodes: number = 150) {
    this.virtualNodes = virtualNodes;
  }

  addNode(node: string): void {
    if (this.nodes.has(node)) return;

    this.nodes.add(node);
    for (let i = 0; i < this.virtualNodes; i++) {
      const hash = this.hash(`${node}:${i}`);
      this.ring.set(hash, node);
    }
  }

  removeNode(node: string): void {
    if (!this.nodes.has(node)) return;

    this.nodes.delete(node);
    for (let i = 0; i < this.virtualNodes; i++) {
      const hash = this.hash(`${node}:${i}`);
      this.ring.delete(hash);
    }
  }

  getNode(key: string): string | null {
    if (this.ring.size === 0) return null;

    const hash = this.hash(key);
    const sortedHashes = Array.from(this.ring.keys()).sort((a, b) => a - b);

    for (const ringHash of sortedHashes) {
      if (hash <= ringHash) {
        return this.ring.get(ringHash)!;
      }
    }

    return this.ring.get(sortedHashes[0])!;
  }

  private hash(input: string): number {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      hash = ((hash << 5) - hash + input.charCodeAt(i)) & 0xffffffff;
    }
    return Math.abs(hash);
  }
}

class DistributedCache {
  private hashRing: ConsistentHashRing;
  private cacheNodes: Map<string, CacheNode>;

  constructor() {
    this.hashRing = new ConsistentHashRing();
    this.cacheNodes = new Map();
  }

  addCacheNode(nodeId: string, node: CacheNode): void {
    this.cacheNodes.set(nodeId, node);
    this.hashRing.addNode(nodeId);
  }

  async get(key: string): Promise<any> {
    const nodeId = this.hashRing.getNode(key);
    if (!nodeId) throw new Error("No cache nodes available");

    const node = this.cacheNodes.get(nodeId);
    return await node?.get(key);
  }

  async set(key: string, value: any): Promise<void> {
    const nodeId = this.hashRing.getNode(key);
    if (!nodeId) throw new Error("No cache nodes available");

    const node = this.cacheNodes.get(nodeId);
    await node?.set(key, value);
  }
}

interface CacheNode {
  get(key: string): Promise<any>;
  set(key: string, value: any): Promise<void>;
  delete(key: string): Promise<boolean>;
}
```

## Cache Invalidation Strategies

### 1. Time-Based Invalidation (TTL)

```typescript
class TTLCache {
  private cache: Map<string, CacheEntry> = new Map();

  set(key: string, value: any, ttlMs: number = 300000): void {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}

interface CacheEntry {
  value: any;
  expiresAt: number;
}
```

### 2. Event-Based Invalidation

```typescript
class EventBasedCache {
  private cache: Map<string, any> = new Map();
  private dependencies: Map<string, Set<string>> = new Map();
  private eventEmitter: EventEmitter;

  constructor(eventEmitter: EventEmitter) {
    this.eventEmitter = eventEmitter;
    this.setupEventListeners();
  }

  set(key: string, value: any, dependencies: string[] = []): void {
    this.cache.set(key, value);

    for (const dep of dependencies) {
      if (!this.dependencies.has(dep)) {
        this.dependencies.set(dep, new Set());
      }
      this.dependencies.get(dep)!.add(key);
    }
  }

  get(key: string): any {
    return this.cache.get(key);
  }

  private setupEventListeners(): void {
    this.eventEmitter.on("data_updated", (resource: string) => {
      this.invalidateByDependency(resource);
    });
  }

  private invalidateByDependency(dependency: string): void {
    const dependentKeys = this.dependencies.get(dependency);
    if (dependentKeys) {
      for (const key of dependentKeys) {
        this.cache.delete(key);
      }
      this.dependencies.delete(dependency);
    }
  }
}
```

### 3. Cache Tags and Hierarchical Invalidation

```typescript
class TaggedCache {
  private cache: Map<string, CacheItem> = new Map();
  private tagIndex: Map<string, Set<string>> = new Map();

  set(key: string, value: any, tags: string[] = []): void {
    this.cache.set(key, { value, tags });

    for (const tag of tags) {
      if (!this.tagIndex.has(tag)) {
        this.tagIndex.set(tag, new Set());
      }
      this.tagIndex.get(tag)!.add(key);
    }
  }

  get(key: string): any {
    return this.cache.get(key)?.value;
  }

  invalidateByTag(tag: string): void {
    const keys = this.tagIndex.get(tag);
    if (keys) {
      for (const key of keys) {
        const item = this.cache.get(key);
        if (item) {
          for (const itemTag of item.tags) {
            this.tagIndex.get(itemTag)?.delete(key);
          }
        }
        this.cache.delete(key);
      }
      this.tagIndex.delete(tag);
    }
  }

  invalidateByPattern(pattern: RegExp): void {
    const keysToDelete: string[] = [];

    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        keysToDelete.push(key);
      }
    }

    for (const key of keysToDelete) {
      this.invalidateKey(key);
    }
  }

  private invalidateKey(key: string): void {
    const item = this.cache.get(key);
    if (item) {
      for (const tag of item.tags) {
        this.tagIndex.get(tag)?.delete(key);
      }
    }
    this.cache.delete(key);
  }
}

interface CacheItem {
  value: any;
  tags: string[];
}
```

## Performance Optimization

### Cache Performance Metrics

```typescript
class CacheMetrics {
  private hits = 0;
  private misses = 0;
  private totalLatency = 0;
  private requestCount = 0;

  recordHit(latencyMs: number): void {
    this.hits++;
    this.recordLatency(latencyMs);
  }

  recordMiss(latencyMs: number): void {
    this.misses++;
    this.recordLatency(latencyMs);
  }

  private recordLatency(latencyMs: number): void {
    this.totalLatency += latencyMs;
    this.requestCount++;
  }

  getHitRatio(): number {
    const total = this.hits + this.misses;
    return total === 0 ? 0 : this.hits / total;
  }

  getAverageLatency(): number {
    return this.requestCount === 0 ? 0 : this.totalLatency / this.requestCount;
  }

  getStats() {
    return {
      hitRatio: this.getHitRatio(),
      averageLatency: this.getAverageLatency(),
      totalRequests: this.requestCount,
      hits: this.hits,
      misses: this.misses,
    };
  }

  reset(): void {
    this.hits = 0;
    this.misses = 0;
    this.totalLatency = 0;
    this.requestCount = 0;
  }
}
```

### Cache Compression

```typescript
import { gzip, gunzip } from "zlib";
import { promisify } from "util";

const gzipAsync = promisify(gzip);
const gunzipAsync = promisify(gunzip);

class CompressedCache {
  private cache: Map<string, Buffer> = new Map();
  private compressionThreshold = 1024;

  async set(key: string, value: any): Promise<void> {
    const serialized = JSON.stringify(value);
    const buffer = Buffer.from(serialized, "utf8");

    if (buffer.length > this.compressionThreshold) {
      const compressed = await gzipAsync(buffer);
      this.cache.set(key, compressed);
    } else {
      this.cache.set(key, buffer);
    }
  }

  async get(key: string): Promise<any | null> {
    const buffer = this.cache.get(key);
    if (!buffer) return null;

    try {
      let data: Buffer;
      if (this.isCompressed(buffer)) {
        data = await gunzipAsync(buffer);
      } else {
        data = buffer;
      }

      return JSON.parse(data.toString("utf8"));
    } catch (error) {
      console.error("Failed to decompress/parse cached data:", error);
      this.cache.delete(key);
      return null;
    }
  }

  private isCompressed(buffer: Buffer): boolean {
    return buffer.length > 2 && buffer[0] === 0x1f && buffer[1] === 0x8b;
  }
}
```

## Cache Technologies Comparison

### In-Memory Caches

| Technology        | Type               | Features                         | Use Cases                     |
| ----------------- | ------------------ | -------------------------------- | ----------------------------- |
| **Redis**         | Key-Value          | Persistence, clustering, pub/sub | Session store, real-time apps |
| **Memcached**     | Key-Value          | Simple, fast, distributed        | Simple caching, session store |
| **Hazelcast**     | In-Memory Grid     | Distributed computing, SQL       | Complex data processing       |
| **Apache Ignite** | In-Memory Platform | SQL, transactions, ML            | Big data, real-time analytics |

### Application-Level Caches

```typescript
class ApplicationCache {
  private static instance: ApplicationCache;
  private cache: Map<string, any> = new Map();
  private metrics: CacheMetrics = new CacheMetrics();

  static getInstance(): ApplicationCache {
    if (!ApplicationCache.instance) {
      ApplicationCache.instance = new ApplicationCache();
    }
    return ApplicationCache.instance;
  }

  async get(key: string): Promise<any> {
    const startTime = Date.now();
    const value = this.cache.get(key);
    const latency = Date.now() - startTime;

    if
```
