# Java Collections Interview Questions & Answers

### Describe the Collections type hierarchy. What are the main interfaces, and what are the differences between them?

- **Iterable**: Represents objects that can be iterated (supports _for-each_ loop).
- **Collection**: Extends _Iterable_, adding methods for adding, removing, and querying elements.
- **List**: Ordered collection, allows index-based access.
- **Set**: Unordered collection of distinct elements.
- **Queue**: Supports ordering and additional methods for processing elements.
- **Map**: Key-value pairs (does not extend _Collection_).

### Describe various implementations of the Map interface and their use case differences.

- **HashMap**: Fast O(1) access, no order, not thread-safe.
- **LinkedHashMap**: Preserves insertion order, slight overhead.
- **TreeMap**: Ordered by natural order or comparator, O(log n) access.
- **ConcurrentHashMap**: Thread-safe with high concurrency, especially for read operations.
- **Hashtable**: Thread-safe but legacy, all methods synchronized (less efficient than ConcurrentHashMap).

### Explain the difference between LinkedList and ArrayList.

- **ArrayList**: Backed by an array, fast index-based access (O(1)), slow insertions/deletions in the middle.
- **LinkedList**: Doubly linked list, efficient insertions/deletions (O(1)) but slower access (O(n)) and higher memory overhead.
- In practice, _ArrayList_ often outperforms _LinkedList_ even for insertions due to optimized array copying.

### What is the difference between HashSet and TreeSet?

- **HashSet**: Backed by a HashMap, no guaranteed order.
- **TreeSet**: Backed by a TreeMap, maintains elements in sorted order.
- **TreeSet** also implements _NavigableSet_, allowing range queries and ordering operations.

### How is HashMap implemented? How does it use hashCode and equals? What is the time complexity of put and get?

- HashMap uses an array of buckets indexed by hash codes.
- If multiple keys map to the same bucket (collision), a red-black tree (since Java 8) holds the entries.
- _hashCode_ determines the bucket; _equals_ compares keys for equality.
- **Average time complexity**: O(1) for put/get.
- **Worst case**: O(log n) if many keys collide into the same bucket.

### What is the purpose of the initial capacity and load factor in a HashMap? What are their default values?

- **Initial capacity**: Size of the internal array (rounded to the nearest power of two). Default: 16.
- **Load factor**: Threshold to resize the map when the number of entries exceeds (capacity × load factor). Default: 0.75.
- Resizing and rehashing are costly operations, so setting an appropriate initial capacity is important for performance.

### Describe special collections for enums. What are the benefits compared to regular collections?

- **EnumSet**: Internally a bit vector—extremely efficient for storing enum values.
- **EnumMap**: Backed by an array indexed by the enum’s ordinal.
- Both provide constant-time access and memory efficiency compared to general-purpose collections.

### What is the difference between fail-fast and fail-safe iterators?

- **Fail-fast**: Throws _ConcurrentModificationException_ if the collection is modified during iteration (e.g., _HashMap_, _ArrayList_).
- **Fail-safe**: Iterate over a snapshot or copy, allowing modifications without exception (e.g., _ConcurrentHashMap_, _CopyOnWriteArrayList_).
- Fail-safe iterators may have higher memory use and may not reflect the latest state.

### How can you use Comparable and Comparator interfaces to sort collections?

- **Comparable**: The class implements `compareTo` for natural ordering. Used directly by sorting methods.
- **Comparator**: External comparison logic. Can sort objects without modifying the class.
- Since Java 8, comparators can be expressed with lambda expressions.

Example:

```java
List<Integer> list = Arrays.asList(5, 2, 3, 4, 1);
Collections.sort(list); // Natural order
Collections.sort(list, (a, b) -> b - a); // Descending order
```
