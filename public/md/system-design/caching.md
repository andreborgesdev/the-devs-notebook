# Caching

## Overview

Caching is a technique that stores a copy of a given resource and serves it back when requested. If a web cache has the requested resource, it intercepts the request and returns the cached copy instead of re-fetching or recomputing the resource.

**Application Caching**

```plaintext
Client ---> App Server ---> Cache ---> Database
                 |             ^
                 |             |
                 |<------------|
```

**Web Caching**

```plaintext
             +-----------+
             | DNS Server|
             +-----------+
                   ^
                   |
Client <---------->|
   |
   |
   v
+---------+
|   CDN   |
+---------+
   |
   v
+------------+             +-------+            +-----------+
| App Layer  | <---------> | Cache | ---------> | Database  |
+------------+             +-------+            +-----------+
```

**Key Benefits:**

- Reduces network calls
- Avoids repeated recomputation
- Decreases database load
- Improves application performance and reduces operational costs

**Cache placement:** Cache can be placed close to the service (e.g., in-memory) or closer to the server.

## Speed and Performance

- Memory access is typically 50–200x faster than disk.
- Enables serving high traffic with fewer resources.
- Supports pre-calculated data caching.
- Most applications have more reads than writes, making them ideal candidates for caching.

## Caching Layers

- DNS cache
- CDN (Content Delivery Network)
- Application-level cache
- Database cache

## Common Problems

- **Additional latency**: Cache lookups introduce extra calls.
- **Thrashing**: Frequent insertions/removals without effective cache hits.
- **Data inconsistency**: Changes in data may not reflect across all caches.

## Distributed Cache

- Functions similarly to traditional cache.
- Supports replication, sharding, and efficient key lookup across servers.
- Examples: Redis, Memcached.

## Cache Policies

Policies govern how data is loaded into or evicted from the cache. Cache performance is highly dependent on the chosen policy.

## Cache Eviction

Goals:

- Prevent stale data.
- Retain only the most valuable data.

**Time to Live (TTL):** Specifies the time duration before a cache entry expires.

## Eviction Strategies

- **Least Recently Used (LRU)**: Removes the least recently accessed item when the cache is full.
- **Least Frequently Used (LFU)**: Tracks access frequency and evicts the least frequently used item. Common in real-world applications.

## Caching Strategies

| Strategy      | Description                                                                                      |
| ------------- | ------------------------------------------------------------------------------------------------ |
| Cache Aside   | Application reads/writes to cache as needed. Most common strategy.                               |
| Read Through  | Application reads through the cache; if a miss occurs, data is fetched and stored in the cache.  |
| Write Through | Writes data to cache first, then persists it to the database. Caution with sensitive data.       |
| Write Back    | Writes data directly to the database and updates the cache afterward. Generally less performant. |

Hybrid approaches are also possible depending on the use case.

## Cache Consistency

Maintaining synchronization between the database and the cache is critical, especially for:

- Real-time applications
- Scenarios where stale data must be minimized

## In-Memory Cache vs Global Cache

| Type            | Benefits                                   | Drawbacks                                             |
| --------------- | ------------------------------------------ | ----------------------------------------------------- |
| In-Memory Cache | Fast, simple to implement                  | Hard to maintain consistency across servers; volatile |
| Global Cache    | Resilient, accurate, shared across servers | Slightly slower due to network latency                |

**Example Technologies:**

- In-Memory: Application-native memory stores
- Distributed/Global: Redis, Memcached

## Examples

# Caching Pseudocode - Retrieval

```python
def app_request(tweet_id):
    cache = {}

    data = cache.get(tweet_id)

    if data:
        return data
    else:
        data = db_query(tweet_id)
        # set data in cache
        cache[tweet_id] = data
        return data
```

# Caching Pseudocode - Writing

```python
def app_update(tweet_id, data):
    cache = {}

    db_update(data)

    cache.pop(tweet_id)
```

## Summary

Caching improves performance, scalability, and cost efficiency by reducing expensive operations such as disk reads, network calls, and database queries. Proper cache design considers eviction strategies, consistency models, and appropriate caching layers to maximize effectiveness.
