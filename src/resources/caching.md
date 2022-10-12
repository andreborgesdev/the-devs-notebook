# Caching

Caching is **a technique that stores a copy of a given resource and serves it back when requested**. When a web cache has a requested resource in its store, it intercepts the request and returns a copy of the stored resource instead of re-downloading the resource from the originating server.

- Saves network calls
- Avoids repeated recomputation
- Reduce db load
- It improves performance of the app and saves money.

We can place cache closer to the service or to the server. An example of closer to the service is in-memory in the service.

![how-does-caching-work](./images/how-does-caching-work.png)

## Speed and performance

- Reading from memory is much faster than disk, 50-200x faster
- Can serve the same amount of traffic with fewer resources
- Pre-calculate and cache data
- Most apps have far more reads than writes, perfect for caching

## Caching layers

- DNS
- CDN
- Application
- Database

## Problems with cache

- Extra call that we have to make
- Trashing - When we are constantly inserting and removing into the cache without ever using the results.
- Data consistency can be a problem. F.e. if we have 2 servers and server 2 updates a resource we have to make sure it was also updated on server's 1 cache, otherwise we'll be serving inconsistent data to the user.

![caching-layers](./images/caching-layers.png)

![caching-pseudocode-retrieval](./images/caching-pseudocode-retrieval.png)

![caching-pseudocode-writing](./images/caching-pseudocode-writing.png)

## Distributed cache

- Works same as traditional cache
- Has built-in functionality to replicate data, shard data across servers, and locate proper server for each key

![distributed-cache](./images/distributed-cache.png)

## Cache policy

The way in which we decide for loading or evicting data.

A cache performance almost entirely depends on our cache policy.

## Cache eviction

- We want to prevent stale data
- Caching only most valuable data to save resources

## Time to live

- Set a time period before a cache entry is deleted
- Used to prevent stale data

## Least Recently and Frequently Used

These are cache eviction strategies. These strategies have less to do with preventing stale data and more to do with trying to keep our most requested data in our cache. 

- LRU
    - Once cache is full, remove last accessed key and add new key
- LFU
    - Track number of time key is accessed
    - Drop least when cache is full
    - This is least frequently used on the real world applications

## Caching strategies

- Cache aside - most common
- Read through
- Write through
    - Writing first to the cache before going through it and writing into the db
    - If we have more more than one server with cache in-memory it doesn't work well
    - If we have financial data, passwords, or other critical or sensitive data we shouldn't use this one.
    - To save network calls with this we can persist plenty of new entries into the cache and then in bulk with 1 communication we can persist it on the db as well.
- Write back
    - Hit db directly and then be sure to make an entry on the cache
    - It is less performant

We can have an hybrid approach. 

## Cache consistency

- How to maintain consistency between database and cache efficiently
- Importance depends on use case
- It is important because we don't want an old piece of data showing to other users for a long time

## In-memory cache

Benefits:

- Faster
- Simpler to implement

Drawbacks:

- Harder to make data consistent across servers
- How to deal with a server crashing?

## Global cache

Like Redis.

It is a distributed cache.

Benefits:

- Servers will all point to it so one server crashing is not a problem anymore. More resilient that way
- More accurate

Drawbacks:

- Slower

## Examples:

Memcache