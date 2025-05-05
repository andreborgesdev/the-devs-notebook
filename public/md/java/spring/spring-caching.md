# Spring Caching

**Spring Caching** provides a simple and powerful abstraction for adding caching behavior to methods, minimizing redundant operations like repetitive database calls or expensive computations.

## Why Caching?

- **Improve performance** by reducing method execution time.
- **Reduce resource consumption** (e.g., database or API calls).
- **Enhance scalability** for high-load applications.

## Enabling Caching

Add the `@EnableCaching` annotation in your configuration class:

```java
@Configuration
@EnableCaching
public class CacheConfig {
    // Additional cache manager configuration if needed
}
```

## Basic Annotations

| Annotation    | Purpose                                                 |
| ------------- | ------------------------------------------------------- |
| `@Cacheable`  | Caches method result.                                   |
| `@CachePut`   | Updates (or adds) cache data when the method is called. |
| `@CacheEvict` | Removes data from the cache.                            |

### Example: @Cacheable

```java
@Cacheable("users")
public User getUserById(Long id) {
    return userRepository.findById(id).orElse(null);
}
```

### Example: @CacheEvict

```java
@CacheEvict(value = "users", key = "#id")
public void deleteUser(Long id) {
    userRepository.deleteById(id);
}
```

## Cache Manager

By default, Spring Boot configures **ConcurrentMapCacheManager** for simple in-memory caching.

```java
@Bean
public CacheManager cacheManager() {
    return new ConcurrentMapCacheManager("users");
}
```

For production use, consider **distributed caches** like:

- **Ehcache**
- **Caffeine**
- **Redis**
- **Hazelcast**

## Cache Key Customization

The cache key is automatically generated from the method parameters but can be customized:

```java
@Cacheable(value = "users", key = "#email")
public User getUserByEmail(String email) { ... }
```

Or even using complex SpEL (Spring Expression Language) expressions:

```java
@Cacheable(value = "users", key = "#user.id + '-' + #user.email")
```

## Hibernate Second-Level Cache

When using JPA or Hibernate, you may also use a **second-level cache** to cache entities directly rather than relying solely on Spring’s method-level caching.

**Key point**:
_If you don’t want a distributed cache or the performance gain is minimal, adding a cache layer on top of JPA usually doesn’t make sense._

Enable with providers like:

- Ehcache
- Infinispan
- Hazelcast

Example:

```java
@Entity
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class User {
    ...
}
```

## Important Considerations

- **Don’t cache mutable data** unless you have proper eviction strategies.
- **Avoid over-caching**: Not all data or methods benefit from caching.
- **Cache consistency**: Think about how updates and deletes affect cached data.
- **Method Visibility**: Only `public` methods will be proxied and cached by default.

## When NOT to use Spring Cache over JPA

If your persistence layer already benefits from **Hibernate first-level** and optionally **second-level caching**, adding Spring caching on top may introduce complexity without real benefit—especially if you're not distributing the cache across multiple nodes.

## Useful Links

- [Spring Cache Tutorial – Baeldung](https://www.baeldung.com/spring-cache-tutorial)
- [Hibernate Second-Level Cache – Baeldung](https://www.baeldung.com/hibernate-second-level-cache)
