# HashMap

A **HashMap** is part of Java’s `java.util` package and implements the `Map` interface. It stores key-value pairs and allows fast retrieval based on the key using a hashing mechanism.

## Key Characteristics

- Stores data in key-value pairs.
- Keys must be unique; values can be duplicated.
- Allows one `null` key and multiple `null` values.
- Does **not maintain insertion order**.
- Not synchronized — use `Collections.synchronizedMap()` or `ConcurrentHashMap` for thread safety.

## Time Complexity (Average Case)

| Operation                      | Time Complexity |
| ------------------------------ | --------------- |
| `put(key, value)`              | O(1)            |
| `get(key)`                     | O(1)            |
| `remove(key)`                  | O(1)            |
| Iteration over keys or entries | O(n)            |

> In the worst case (e.g., due to poor hash distribution), operations degrade to O(n), but Java uses techniques to avoid this.

## Hash Calculation

- When a key is inserted, `HashMap` calls the key’s `hashCode()` method.
- The hash code is **transformed** internally (using a hash spreading function) to reduce collisions and determine the **bucket index**:

```java
int hash = key.hashCode();
int index = (n - 1) & hash; // where n is the array length (capacity)
```

- This calculation ensures the key-value pair is stored at an index in the underlying array (called a "bucket").

## Hash Collisions

Two different keys can generate the same hash code or be placed in the same bucket (due to array index calculation). This is called a **hash collision**.

### How Java Handles Collisions:

- **Java 7 and earlier**: Each bucket is a **linked list**. Collisions are resolved by adding elements to the end of the list.
- **Java 8 and newer**:
  - If the number of elements in a bucket exceeds **8** (and total size is > 64), the linked list is replaced with a **balanced tree (red-black tree)**.
  - This reduces the time complexity from O(n) to O(log n) in heavily collided buckets.

## Capacity & Load Factor

- Default capacity: `16`
- Default load factor: `0.75`
- When the number of entries exceeds `capacity * loadFactor`, the HashMap resizes (doubles) and **rehashes** all entries.

> Resizing is expensive, so choosing an appropriate initial capacity can improve performance.

## Example: Basic Usage

```java
Map<String, Integer> map = new HashMap<>();

map.put("apple", 1);
map.put("banana", 2);
map.put("cherry", 3);

System.out.println(map.get("banana")); // 2

map.remove("cherry");

System.out.println(map.containsKey("apple")); // true
System.out.println(map.containsValue(3));     // false
```

## Null Handling

```java
Map<String, String> map = new HashMap<>();

map.put(null, "value1");
map.put("key1", null);
map.put("key2", null);

System.out.println(map.get(null));   // value1
System.out.println(map.get("key1")); // null
```

## Iteration Example

```java
Map<String, Integer> map = new HashMap<>();
map.put("a", 1);
map.put("b", 2);
map.put("c", 3);

for (Map.Entry<String, Integer> entry : map.entrySet()) {
    System.out.println(entry.getKey() + ": " + entry.getValue());
}
```

## When to Use

- You need fast lookups, inserts, and deletions by key.
- You don't care about order.
- You use unique identifiers (IDs, usernames, etc.) as keys.

## When Not to Use

- You need to preserve insertion order → use `LinkedHashMap`.
- You need sorted keys → use `TreeMap`.
- You need thread safety → use `ConcurrentHashMap`.

## Best Practices and Pitfalls

- **Avoid mutable keys**: Always use immutable types (e.g., `String`, `Integer`) or override `hashCode()` and `equals()` properly in custom key classes.
- **Avoid frequent resizing**: Set initial capacity when size is predictable.
- **Don’t rely on iteration order**: HashMap does not guarantee order.
- **Beware of poor hashCode implementations**: They lead to more collisions and degrade performance.
