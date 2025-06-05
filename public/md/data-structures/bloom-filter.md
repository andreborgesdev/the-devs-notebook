# Bloom Filter

A **Bloom Filter** is a space-efficient probabilistic data structure used to test whether an element is a member of a set. It can have **false positives** but **never false negatives** - if it says an element is not in the set, it's definitely not there, but if it says an element is in the set, it might be wrong.

## Key Characteristics

- **Probabilistic**: May return false positives, never false negatives
- **Space Efficient**: Uses much less memory than storing actual elements
- **Fast Operations**: Constant time insertion and lookup
- **Immutable Size**: Fixed size bit array, cannot grow
- **No Deletions**: Standard Bloom filters don't support element removal

## How It Works

1. **Bit Array**: Uses a bit array of size `m`
2. **Hash Functions**: Uses `k` independent hash functions
3. **Insertion**: Set bits at positions given by hash functions
4. **Lookup**: Check if all bits at hash positions are set

## Mathematical Foundation

For a Bloom filter with:

- `m` = number of bits in the array
- `n` = number of elements to insert
- `k` = number of hash functions

**Optimal number of hash functions:**

```
k = (m/n) * ln(2)
```

**False positive probability:**

```
p ≈ (1 - e^(-kn/m))^k
```

**Optimal bit array size for desired false positive rate:**

```
m = -(n * ln(p)) / (ln(2))^2
```

## Java Implementation

```java showLineNumbers
import java.util.BitSet;
import java.util.function.Function;

public class BloomFilter<T> {
    private final BitSet bitSet;
    private final int size;
    private final int numHashFunctions;
    private final Function<T, Integer>[] hashFunctions;

    @SuppressWarnings("unchecked")
    public BloomFilter(int size, int numHashFunctions) {
        this.size = size;
        this.numHashFunctions = numHashFunctions;
        this.bitSet = new BitSet(size);

        // Create hash functions
        this.hashFunctions = new Function[numHashFunctions];
        for (int i = 0; i < numHashFunctions; i++) {
            final int seed = i;
            this.hashFunctions[i] = item -> hash(item, seed);
        }
    }

    public void add(T item) {
        for (Function<T, Integer> hashFunction : hashFunctions) {
            int hash = Math.abs(hashFunction.apply(item)) % size;
            bitSet.set(hash);
        }
    }

    public boolean mightContain(T item) {
        for (Function<T, Integer> hashFunction : hashFunctions) {
            int hash = Math.abs(hashFunction.apply(item)) % size;
            if (!bitSet.get(hash)) {
                return false; // Definitely not in set
            }
        }
        return true; // Might be in set (could be false positive)
    }

    private int hash(T item, int seed) {
        return item.hashCode() ^ (seed * 31);
    }

    public double getFalsePositiveProbability(int numElements) {
        double ratio = (double) numElements / size;
        return Math.pow(1 - Math.exp(-numHashFunctions * ratio), numHashFunctions);
    }

    public int size() {
        return size;
    }

    public int getNumHashFunctions() {
        return numHashFunctions;
    }
}
```

## Enhanced Implementation with Murmur3 Hash

```java showLineNumbers
import java.nio.charset.StandardCharsets;

public class OptimizedBloomFilter {
    private final BitSet bitSet;
    private final int size;
    private final int numHashFunctions;

    public OptimizedBloomFilter(int expectedElements, double falsePositiveRate) {
        this.size = optimalSize(expectedElements, falsePositiveRate);
        this.numHashFunctions = optimalHashFunctions(size, expectedElements);
        this.bitSet = new BitSet(size);
    }

    public void add(String item) {
        byte[] bytes = item.getBytes(StandardCharsets.UTF_8);
        int hash1 = murmur3Hash(bytes, 0);
        int hash2 = murmur3Hash(bytes, hash1);

        for (int i = 0; i < numHashFunctions; i++) {
            int hash = Math.abs((hash1 + i * hash2) % size);
            bitSet.set(hash);
        }
    }

    public boolean mightContain(String item) {
        byte[] bytes = item.getBytes(StandardCharsets.UTF_8);
        int hash1 = murmur3Hash(bytes, 0);
        int hash2 = murmur3Hash(bytes, hash1);

        for (int i = 0; i < numHashFunctions; i++) {
            int hash = Math.abs((hash1 + i * hash2) % size);
            if (!bitSet.get(hash)) {
                return false;
            }
        }
        return true;
    }

    private static int optimalSize(int expectedElements, double falsePositiveRate) {
        return (int) Math.ceil(-expectedElements * Math.log(falsePositiveRate) / Math.pow(Math.log(2), 2));
    }

    private static int optimalHashFunctions(int size, int expectedElements) {
        return Math.max(1, (int) Math.round((double) size / expectedElements * Math.log(2)));
    }

    private int murmur3Hash(byte[] data, int seed) {
        // Simplified Murmur3 hash implementation
        int h = seed;
        for (byte b : data) {
            h ^= b & 0xFF;
            h *= 0x1b873593;
            h = Integer.rotateLeft(h, 15);
            h *= 0xe6546b64;
        }
        h ^= data.length;
        h ^= h >>> 16;
        h *= 0x85ebca6b;
        h ^= h >>> 13;
        h *= 0xc2b2ae35;
        h ^= h >>> 16;
        return h;
    }
}
```

## Time and Space Complexity

| Operation | Time Complexity | Space Complexity |
| --------- | --------------- | ---------------- |
| Insert    | O(k)            | O(m)             |
| Lookup    | O(k)            | O(m)             |

Where:

- `k` = number of hash functions
- `m` = size of bit array

## Real-World Use Cases

### 1. **Web Crawling**

Check if a URL has already been crawled without storing all URLs

```java
BloomFilter<String> crawledUrls = new BloomFilter<>(1000000, 5);

public boolean shouldCrawl(String url) {
    if (crawledUrls.mightContain(url)) {
        return false; // Probably already crawled
    }
    crawledUrls.add(url);
    return true;
}
```

### 2. **Database Query Optimization**

Avoid expensive disk lookups for non-existent keys

### 3. **Cache Systems**

Quickly check if data might be in cache before expensive lookup

### 4. **Network Security**

Detect malicious URLs, IPs, or patterns

### 5. **Distributed Systems**

Reduce network calls by pre-filtering requests

```java
// Example: Distributed cache with Bloom filter
public class DistributedCache {
    private BloomFilter<String> bloomFilter;
    private RemoteCache remoteCache;

    public String get(String key) {
        if (!bloomFilter.mightContain(key)) {
            return null; // Definitely not in cache
        }

        // Might be in cache, check remote
        return remoteCache.get(key);
    }

    public void put(String key, String value) {
        bloomFilter.add(key);
        remoteCache.put(key, value);
    }
}
```

## Counting Bloom Filter

A variant that supports deletions by using counters instead of bits:

```java showLineNumbers
public class CountingBloomFilter<T> {
    private final int[] counters;
    private final int size;
    private final int numHashFunctions;

    public CountingBloomFilter(int size, int numHashFunctions) {
        this.size = size;
        this.numHashFunctions = numHashFunctions;
        this.counters = new int[size];
    }

    public void add(T item) {
        for (int i = 0; i < numHashFunctions; i++) {
            int hash = hash(item, i) % size;
            counters[hash]++;
        }
    }

    public void remove(T item) {
        if (!mightContain(item)) {
            return; // Item definitely not present
        }

        for (int i = 0; i < numHashFunctions; i++) {
            int hash = hash(item, i) % size;
            if (counters[hash] > 0) {
                counters[hash]--;
            }
        }
    }

    public boolean mightContain(T item) {
        for (int i = 0; i < numHashFunctions; i++) {
            int hash = hash(item, i) % size;
            if (counters[hash] == 0) {
                return false;
            }
        }
        return true;
    }

    private int hash(T item, int seed) {
        return Math.abs(item.hashCode() ^ (seed * 31));
    }
}
```

## Bloom Filter Variants

### 1. **Scalable Bloom Filter**

Automatically grows when false positive rate becomes too high

### 2. **Compressed Bloom Filter**

Uses compression to reduce memory usage

### 3. **Deletable Bloom Filter**

Allows deletions without using counters

### 4. **Stable Bloom Filter**

Continuously evicts stale information

## Advantages

- **Memory Efficient**: Much smaller than storing actual elements
- **Fast Operations**: Constant time operations
- **Privacy Preserving**: Doesn't store actual data
- **Scalable**: Performance doesn't degrade with dataset size

## Disadvantages

- **False Positives**: May incorrectly report element presence
- **No Deletions**: Cannot remove elements (in standard version)
- **Fixed Size**: Cannot grow after creation
- **No Element Retrieval**: Cannot get actual elements back

## Configuration Guidelines

### Choosing Parameters

1. **Determine acceptable false positive rate** (e.g., 1%, 0.1%)
2. **Estimate number of elements** to insert
3. **Calculate optimal bit array size** and hash functions
4. **Consider memory constraints**

### Example Configurations

```java
// For 1 million URLs with 1% false positive rate
BloomFilter urlFilter = new BloomFilter(9585058, 7);

// For 100,000 user IDs with 0.1% false positive rate
BloomFilter userFilter = new BloomFilter(1437759, 10);
```

## Interview Tips

- **Understand the trade-off**: Space efficiency vs accuracy
- **Know the math**: False positive probability calculation
- **Discuss use cases**: Where false positives are acceptable
- **Compare with alternatives**: Hash sets, caches, databases
- **Explain limitations**: No deletions, no exact counts

## Common Pitfalls

1. **Hash function quality**: Poor hash functions increase false positives
2. **Parameter selection**: Wrong size/hash count affects performance
3. **Overflow**: Ensure bit array size fits in memory
4. **Thread safety**: Standard implementation is not thread-safe

## Performance Comparison

| Data Structure | Space | Insert | Lookup   | False Positives |
| -------------- | ----- | ------ | -------- | --------------- |
| HashSet        | O(n)  | O(1)   | O(1)     | None            |
| Bloom Filter   | O(m)  | O(k)   | O(k)     | Possible        |
| Sorted Array   | O(n)  | O(n)   | O(log n) | None            |

## Summary

**Bloom Filters** are powerful probabilistic data structures that provide memory-efficient membership testing with the trade-off of possible false positives. They're essential for large-scale systems where memory efficiency is crucial and occasional false positives are acceptable. Understanding their mathematical foundation and practical applications is valuable for system design interviews and real-world distributed systems.
