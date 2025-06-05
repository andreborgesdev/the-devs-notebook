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

## Advanced Caching Patterns

### Conditional Caching

Use conditions to control when caching should occur:

```java
@Cacheable(value = "users", condition = "#id > 10")
public User getUserById(Long id) {
    return userRepository.findById(id).orElse(null);
}

@Cacheable(value = "users", unless = "#result == null")
public User getUserByEmail(String email) {
    return userRepository.findByEmail(email);
}
```

### Cache with TTL (Time To Live)

```java
@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();
        cacheManager.setCaffeine(Caffeine.newBuilder()
            .expireAfterWrite(Duration.ofMinutes(10))
            .maximumSize(1000));
        return cacheManager;
    }
}
```

### Multiple Cache Names

```java
@Cacheable({"users", "userProfiles"})
public User getUserById(Long id) {
    return userRepository.findById(id).orElse(null);
}

@CacheEvict(value = {"users", "userProfiles"}, key = "#id")
public void deleteUser(Long id) {
    userRepository.deleteById(id);
}
```

### Cache Synchronization

Prevent cache stampede by synchronizing cache loading:

```java
@Cacheable(value = "users", sync = true)
public User getUserById(Long id) {
    return userRepository.findById(id).orElse(null);
}
```

## Cache Providers Configuration

### Caffeine Cache

```java
@Configuration
@EnableCaching
public class CaffeineConfig {

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();
        cacheManager.setCaffeine(caffeineCacheBuilder());
        return cacheManager;
    }

    Caffeine<Object, Object> caffeineCacheBuilder() {
        return Caffeine.newBuilder()
            .initialCapacity(100)
            .maximumSize(500)
            .expireAfterAccess(Duration.ofMinutes(5))
            .weakKeys()
            .recordStats();
    }
}
```

### Redis Cache

```java
@Configuration
@EnableCaching
public class RedisConfig {

    @Bean
    public LettuceConnectionFactory redisConnectionFactory() {
        return new LettuceConnectionFactory(
            new RedisStandaloneConfiguration("localhost", 6379));
    }

    @Bean
    public CacheManager cacheManager() {
        RedisCacheConfiguration cacheConfig = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(60))
            .serializeKeysWith(RedisSerializationContext.SerializationPair
                .fromSerializer(new StringRedisSerializer()))
            .serializeValuesWith(RedisSerializationContext.SerializationPair
                .fromSerializer(new GenericJackson2JsonRedisSerializer()));

        return RedisCacheManager.builder(redisConnectionFactory())
            .cacheDefaults(cacheConfig)
            .build();
    }
}
```

### EhCache Configuration

```java
@Configuration
@EnableCaching
public class EhCacheConfig {

    @Bean
    public CacheManager cacheManager() {
        EhCacheCacheManager cacheManager = new EhCacheCacheManager();
        cacheManager.setCacheManager(ehCacheManagerFactory().getObject());
        return cacheManager;
    }

    @Bean
    public EhCacheManagerFactoryBean ehCacheManagerFactory() {
        EhCacheManagerFactoryBean cacheManagerFactoryBean =
            new EhCacheManagerFactoryBean();
        cacheManagerFactoryBean.setConfigLocation(
            new ClassPathResource("ehcache.xml"));
        cacheManagerFactoryBean.setShared(true);
        return cacheManagerFactoryBean;
    }
}
```

## Complex Key Generation

### Custom Key Generator

```java
@Component
public class CustomKeyGenerator implements KeyGenerator {

    @Override
    public Object generate(Object target, Method method, Object... params) {
        return target.getClass().getSimpleName() + "_" +
               method.getName() + "_" +
               StringUtils.arrayToDelimitedString(params, "_");
    }
}

@Configuration
@EnableCaching
public class CacheConfig implements CachingConfigurer {

    @Override
    public KeyGenerator keyGenerator() {
        return new CustomKeyGenerator();
    }
}
```

### SpEL Key Expressions

```java
@Cacheable(value = "usersByRole", key = "#user.role.name + '_' + #user.department")
public List<User> getUsersByRoleAndDepartment(User user) {
    return userRepository.findByRoleAndDepartment(user.getRole(), user.getDepartment());
}

@Cacheable(value = "reports", key = "T(java.time.LocalDate).now().toString() + '_' + #reportType")
public Report generateDailyReport(String reportType) {
    return reportService.generateReport(reportType);
}
```

## Cache Eviction Strategies

### All Entries Eviction

```java
@CacheEvict(value = "users", allEntries = true)
public void clearAllUsers() {
    // Method implementation
}

@CacheEvict(value = "users", allEntries = true, beforeInvocation = true)
public void updateUserData() {
    // Clear cache before method execution
}
```

### Scheduled Cache Eviction

```java
@Component
public class CacheEvictionScheduler {

    @Autowired
    private CacheManager cacheManager;

    @Scheduled(fixedRate = 3600000) // Every hour
    public void evictAllCaches() {
        cacheManager.getCacheNames()
            .forEach(cacheName -> cacheManager.getCache(cacheName).clear());
    }
}
```

## Multi-Level Caching

```java
@Configuration
@EnableCaching
public class MultiLevelCacheConfig {

    @Bean
    @Primary
    public CacheManager cacheManager() {
        CompositeCacheManager cacheManager = new CompositeCacheManager();
        cacheManager.setCacheManagers(Arrays.asList(
            caffeineCacheManager(),
            redisCacheManager()
        ));
        cacheManager.setFallbackToNoOpCache(false);
        return cacheManager;
    }

    @Bean
    public CacheManager caffeineCacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();
        cacheManager.setCaffeine(Caffeine.newBuilder()
            .maximumSize(1000)
            .expireAfterWrite(Duration.ofMinutes(5)));
        return cacheManager;
    }

    @Bean
    public CacheManager redisCacheManager() {
        return RedisCacheManager.builder(redisConnectionFactory())
            .cacheDefaults(RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofHours(1)))
            .build();
    }
}
```

## Cache Statistics and Monitoring

### Caffeine Statistics

```java
@Component
public class CacheMetrics {

    @Autowired
    private CacheManager cacheManager;

    @EventListener
    @Async
    public void handleCacheStatistics(ApplicationReadyEvent event) {
        if (cacheManager instanceof CaffeineCacheManager) {
            CaffeineCacheManager caffeineCacheManager = (CaffeineCacheManager) cacheManager;
            caffeineCacheManager.getCacheNames().forEach(cacheName -> {
                Cache cache = caffeineCacheManager.getCache(cacheName);
                if (cache instanceof CaffeineCache) {
                    com.github.benmanes.caffeine.cache.Cache<Object, Object> nativeCache =
                        ((CaffeineCache) cache).getNativeCache();

                    CacheStats stats = nativeCache.stats();
                    System.out.println("Cache: " + cacheName);
                    System.out.println("Hit rate: " + stats.hitRate());
                    System.out.println("Miss count: " + stats.missCount());
                    System.out.println("Eviction count: " + stats.evictionCount());
                }
            });
        }
    }
}
```

### Custom Cache Event Listener

```java
@Component
public class CacheEventLogger {

    @EventListener
    public void handleCacheGetEvent(CacheGetEvent event) {
        System.out.println("Cache GET: " + event.getCacheName() + " - " + event.getKey());
    }

    @EventListener
    public void handleCachePutEvent(CachePutEvent event) {
        System.out.println("Cache PUT: " + event.getCacheName() + " - " + event.getKey());
    }

    @EventListener
    public void handleCacheEvictEvent(CacheEvictEvent event) {
        System.out.println("Cache EVICT: " + event.getCacheName() + " - " + event.getKey());
    }
}
```

## Cache Testing

### Test Cache Behavior

```java
@SpringBootTest
@EnableCaching
class CacheIntegrationTest {

    @Autowired
    private UserService userService;

    @Autowired
    private CacheManager cacheManager;

    @Test
    void shouldCacheUserData() {
        User user = userService.getUserById(1L);

        verify(userRepository, times(1)).findById(1L);

        User cachedUser = userService.getUserById(1L);

        verify(userRepository, times(1)).findById(1L);
        assertThat(user).isEqualTo(cachedUser);
    }

    @Test
    void shouldEvictCacheOnUpdate() {
        userService.getUserById(1L);

        Cache cache = cacheManager.getCache("users");
        assertThat(cache.get(1L)).isNotNull();

        userService.updateUser(1L, new User());

        assertThat(cache.get(1L)).isNull();
    }

    @Test
    void shouldHandleCacheMiss() {
        Cache cache = cacheManager.getCache("users");
        cache.evict(1L);

        User user = userService.getUserById(1L);

        assertThat(user).isNotNull();
        verify(userRepository, times(1)).findById(1L);
    }
}
```

### Mock Cache Manager for Testing

```java
@TestConfiguration
public class TestCacheConfig {

    @Bean
    @Primary
    public CacheManager cacheManager() {
        return new NoOpCacheManager();
    }
}
```

## Performance Optimization

### Cache Warming

```java
@Component
public class CacheWarmupService {

    @Autowired
    private UserService userService;

    @EventListener(ApplicationReadyEvent.class)
    public void warmupCache() {
        List<Long> popularUserIds = userRepository.findPopularUserIds();
        popularUserIds.forEach(userService::getUserById);
    }
}
```

### Async Cache Population

```java
@Service
public class UserService {

    @Async
    @CachePut(value = "users", key = "#id")
    public CompletableFuture<User> preloadUser(Long id) {
        User user = userRepository.findById(id).orElse(null);
        return CompletableFuture.completedFuture(user);
    }
}
```

## Best Practices

### Cache Configuration Guidelines

1. **Choose appropriate cache sizes** based on memory constraints
2. **Set reasonable TTL values** to balance freshness and performance
3. **Monitor cache hit rates** and adjust strategies accordingly
4. **Use distributed caching** for multi-instance deployments
5. **Implement proper serialization** for distributed caches

### Common Pitfalls

1. **Over-caching**: Not all methods benefit from caching
2. **Cache key collisions**: Ensure unique keys across different methods
3. **Memory leaks**: Configure proper eviction policies
4. **Stale data**: Implement appropriate cache invalidation strategies
5. **Testing complexity**: Use proper test configurations

### Production Checklist

- [ ] Configure appropriate cache sizes and TTL
- [ ] Set up cache monitoring and alerting
- [ ] Implement cache warming for critical data
- [ ] Test cache eviction and invalidation strategies
- [ ] Document cache keys and expiration policies
- [ ] Configure distributed cache clustering if needed
- [ ] Set up cache statistics collection
- [ ] Implement circuit breaker patterns for cache failures

## Useful Links

- [Spring Cache Tutorial – Baeldung](https://www.baeldung.com/spring-cache-tutorial)
- [Hibernate Second-Level Cache – Baeldung](https://www.baeldung.com/hibernate-second-level-cache)
- [Caffeine Cache Documentation](https://github.com/ben-manes/caffeine)
- [Redis Spring Data Documentation](https://spring.io/projects/spring-data-redis)
