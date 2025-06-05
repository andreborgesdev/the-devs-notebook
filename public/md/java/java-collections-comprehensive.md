# Java Collections Framework

## Overview

The Java Collections Framework provides a unified architecture for representing and manipulating collections of objects. It includes interfaces, implementations, and algorithms.

### Collection Hierarchy

```
Collection
├── List (ordered, allows duplicates)
│   ├── ArrayList
│   ├── LinkedList
│   ├── Vector
│   └── Stack
├── Set (no duplicates)
│   ├── HashSet
│   ├── LinkedHashSet
│   └── SortedSet
│       └── TreeSet
└── Queue (FIFO)
    ├── LinkedList
    ├── PriorityQueue
    └── Deque
        ├── ArrayDeque
        └── LinkedList

Map (key-value pairs)
├── HashMap
├── LinkedHashMap
├── Hashtable
├── Properties
└── SortedMap
    └── TreeMap
```

## Core Interfaces

### Collection Interface

```java
public interface Collection<E> extends Iterable<E> {
    // Basic operations
    boolean add(E element);
    boolean remove(Object element);
    boolean contains(Object element);
    int size();
    boolean isEmpty();
    void clear();

    // Bulk operations
    boolean addAll(Collection<? extends E> collection);
    boolean removeAll(Collection<?> collection);
    boolean retainAll(Collection<?> collection);
    boolean containsAll(Collection<?> collection);

    // Array operations
    Object[] toArray();
    <T> T[] toArray(T[] array);

    // Java 8+ methods
    default Stream<E> stream();
    default boolean removeIf(Predicate<? super E> filter);
}
```

## List Interface and Implementations

### ArrayList

```java
import java.util.*;

// ArrayList - Resizable array implementation
List<String> arrayList = new ArrayList<>();

// Basic operations
arrayList.add("Java");
arrayList.add("Python");
arrayList.add("JavaScript");
arrayList.add(1, "C++");  // Insert at index

// Access elements
String first = arrayList.get(0);
arrayList.set(2, "TypeScript");  // Update element

// Remove elements
arrayList.remove(0);  // Remove by index
arrayList.remove("Python");  // Remove by value

// Size and checks
int size = arrayList.size();
boolean empty = arrayList.isEmpty();
boolean contains = arrayList.contains("Java");

// Iteration
for (String lang : arrayList) {
    System.out.println(lang);
}

// Index operations
int index = arrayList.indexOf("Java");
int lastIndex = arrayList.lastIndexOf("Java");

// Sublist
List<String> subList = arrayList.subList(1, 3);

// Convert to array
String[] array = arrayList.toArray(new String[0]);
```

### LinkedList

```java
// LinkedList - Doubly-linked list implementation
LinkedList<Integer> linkedList = new LinkedList<>();

// List operations
linkedList.add(10);
linkedList.add(20);
linkedList.add(30);

// Deque operations (both ends)
linkedList.addFirst(5);   // Add to beginning
linkedList.addLast(40);   // Add to end
linkedList.offerFirst(1); // Add to beginning (doesn't throw exception)
linkedList.offerLast(50); // Add to end (doesn't throw exception)

// Remove operations
Integer first = linkedList.removeFirst();
Integer last = linkedList.removeLast();
Integer polled = linkedList.poll();  // Remove and return head
Integer peeked = linkedList.peek();  // Return head without removing

// Stack operations
linkedList.push(100);  // Add to front
Integer popped = linkedList.pop();  // Remove from front
```

### Vector and Stack

```java
// Vector - Synchronized ArrayList
Vector<String> vector = new Vector<>();
vector.add("Element 1");
vector.add("Element 2");

// Stack - LIFO data structure
Stack<Integer> stack = new Stack<>();
stack.push(10);
stack.push(20);
stack.push(30);

Integer top = stack.peek();  // View top element
Integer popped = stack.pop(); // Remove and return top element
boolean empty = stack.empty();
int position = stack.search(10); // 1-based position from top
```

## Set Interface and Implementations

### HashSet

```java
// HashSet - Hash table implementation
Set<String> hashSet = new HashSet<>();

hashSet.add("Apple");
hashSet.add("Banana");
hashSet.add("Orange");
hashSet.add("Apple");  // Duplicate - won't be added

System.out.println(hashSet.size()); // 3

// Check operations
boolean contains = hashSet.contains("Apple");
boolean empty = hashSet.isEmpty();

// Remove operations
hashSet.remove("Banana");
hashSet.clear();

// Set operations
Set<Integer> set1 = new HashSet<>(Arrays.asList(1, 2, 3, 4));
Set<Integer> set2 = new HashSet<>(Arrays.asList(3, 4, 5, 6));

// Union
Set<Integer> union = new HashSet<>(set1);
union.addAll(set2);  // {1, 2, 3, 4, 5, 6}

// Intersection
Set<Integer> intersection = new HashSet<>(set1);
intersection.retainAll(set2);  // {3, 4}

// Difference
Set<Integer> difference = new HashSet<>(set1);
difference.removeAll(set2);  // {1, 2}
```

### LinkedHashSet

```java
// LinkedHashSet - Maintains insertion order
Set<String> linkedHashSet = new LinkedHashSet<>();
linkedHashSet.add("Third");
linkedHashSet.add("First");
linkedHashSet.add("Second");

// Maintains insertion order: Third, First, Second
for (String item : linkedHashSet) {
    System.out.println(item);
}
```

### TreeSet

```java
// TreeSet - Sorted set implementation
Set<Integer> treeSet = new TreeSet<>();
treeSet.add(30);
treeSet.add(10);
treeSet.add(20);
treeSet.add(40);

// Natural ordering: 10, 20, 30, 40
System.out.println(treeSet);

// NavigableSet methods
NavigableSet<Integer> navigableSet = (TreeSet<Integer>) treeSet;
Integer first = navigableSet.first();     // 10
Integer last = navigableSet.last();       // 40
Integer lower = navigableSet.lower(25);   // 20 (greatest < 25)
Integer higher = navigableSet.higher(25); // 30 (smallest > 25)
Integer floor = navigableSet.floor(25);   // 20 (greatest <= 25)
Integer ceiling = navigableSet.ceiling(25); // 30 (smallest >= 25)

// Subset operations
SortedSet<Integer> headSet = navigableSet.headSet(25);   // < 25
SortedSet<Integer> tailSet = navigableSet.tailSet(25);   // >= 25
SortedSet<Integer> subSet = navigableSet.subSet(15, 35); // [15, 35)

// Custom comparator
Set<String> customTreeSet = new TreeSet<>((s1, s2) -> s2.compareTo(s1));
customTreeSet.add("Apple");
customTreeSet.add("Banana");
customTreeSet.add("Cherry");
// Reverse order: Cherry, Banana, Apple
```

## Queue Interface and Implementations

### PriorityQueue

```java
// PriorityQueue - Heap-based priority queue
Queue<Integer> priorityQueue = new PriorityQueue<>();
priorityQueue.offer(30);
priorityQueue.offer(10);
priorityQueue.offer(20);

// Min heap by default
Integer min = priorityQueue.peek();  // 10
Integer removed = priorityQueue.poll();  // 10

// Custom comparator for max heap
Queue<Integer> maxHeap = new PriorityQueue<>((a, b) -> b - a);
maxHeap.offer(30);
maxHeap.offer(10);
maxHeap.offer(20);

Integer max = maxHeap.peek();  // 30

// Priority queue with custom objects
Queue<Task> taskQueue = new PriorityQueue<>((t1, t2) ->
    Integer.compare(t1.getPriority(), t2.getPriority()));

class Task {
    private String name;
    private int priority;

    public Task(String name, int priority) {
        this.name = name;
        this.priority = priority;
    }

    public int getPriority() { return priority; }
    public String getName() { return name; }
}
```

### ArrayDeque

```java
// ArrayDeque - Resizable array implementation of Deque
Deque<String> deque = new ArrayDeque<>();

// Add elements
deque.addFirst("First");
deque.addLast("Last");
deque.offerFirst("New First");
deque.offerLast("New Last");

// Remove elements
String first = deque.removeFirst();
String last = deque.removeLast();
String polledFirst = deque.pollFirst();
String polledLast = deque.pollLast();

// Peek elements
String peekFirst = deque.peekFirst();
String peekLast = deque.peekLast();

// Use as Stack
deque.push("Stack Element");
String popped = deque.pop();

// Use as Queue
deque.offer("Queue Element");
String removed = deque.poll();
```

## Map Interface and Implementations

### HashMap

```java
// HashMap - Hash table implementation
Map<String, Integer> hashMap = new HashMap<>();

// Put operations
hashMap.put("apple", 10);
hashMap.put("banana", 20);
hashMap.put("orange", 15);
hashMap.put("apple", 12);  // Update existing key

// Get operations
Integer appleCount = hashMap.get("apple");  // 12
Integer grapeCount = hashMap.get("grape");  // null
Integer defaultValue = hashMap.getOrDefault("grape", 0);  // 0

// Check operations
boolean hasApple = hashMap.containsKey("apple");
boolean hasValue20 = hashMap.containsValue(20);
boolean empty = hashMap.isEmpty();
int size = hashMap.size();

// Remove operations
Integer removed = hashMap.remove("banana");
hashMap.remove("orange", 15);  // Remove only if value matches

// Iteration
for (Map.Entry<String, Integer> entry : hashMap.entrySet()) {
    System.out.println(entry.getKey() + ": " + entry.getValue());
}

// Key and value sets
Set<String> keys = hashMap.keySet();
Collection<Integer> values = hashMap.values();

// Java 8+ operations
hashMap.forEach((key, value) -> System.out.println(key + ": " + value));
hashMap.putIfAbsent("grape", 25);
hashMap.computeIfAbsent("mango", k -> k.length());
hashMap.computeIfPresent("apple", (k, v) -> v + 5);
hashMap.merge("banana", 30, Integer::sum);
```

### LinkedHashMap

```java
// LinkedHashMap - Maintains insertion order
Map<String, Integer> linkedHashMap = new LinkedHashMap<>();
linkedHashMap.put("third", 3);
linkedHashMap.put("first", 1);
linkedHashMap.put("second", 2);

// Maintains insertion order: third, first, second

// Access-order LinkedHashMap
Map<String, Integer> accessOrder = new LinkedHashMap<>(16, 0.75f, true);
accessOrder.put("A", 1);
accessOrder.put("B", 2);
accessOrder.put("C", 3);
accessOrder.get("A");  // A moves to end: B, C, A
```

### TreeMap

```java
// TreeMap - Red-Black tree implementation
Map<String, Integer> treeMap = new TreeMap<>();
treeMap.put("charlie", 3);
treeMap.put("alice", 1);
treeMap.put("bob", 2);

// Natural ordering: alice, bob, charlie

// NavigableMap operations
NavigableMap<String, Integer> navigableMap = treeMap;
Map.Entry<String, Integer> firstEntry = navigableMap.firstEntry();
Map.Entry<String, Integer> lastEntry = navigableMap.lastEntry();
Map.Entry<String, Integer> lowerEntry = navigableMap.lowerEntry("bob");
Map.Entry<String, Integer> higherEntry = navigableMap.higherEntry("bob");

// Submap operations
SortedMap<String, Integer> headMap = navigableMap.headMap("charlie");
SortedMap<String, Integer> tailMap = navigableMap.tailMap("bob");
SortedMap<String, Integer> subMap = navigableMap.subMap("alice", "charlie");

// Custom comparator
Map<String, Integer> customTreeMap = new TreeMap<>((s1, s2) -> s2.compareTo(s1));
customTreeMap.put("apple", 1);
customTreeMap.put("banana", 2);
// Reverse order: banana, apple
```

### Hashtable and Properties

```java
// Hashtable - Synchronized HashMap
Hashtable<String, String> hashtable = new Hashtable<>();
hashtable.put("key1", "value1");
hashtable.put("key2", "value2");

// Properties - String key-value pairs for configuration
Properties properties = new Properties();
properties.setProperty("database.url", "jdbc:mysql://localhost:3306/db");
properties.setProperty("database.username", "user");
properties.setProperty("database.password", "password");

String url = properties.getProperty("database.url");
String timeout = properties.getProperty("timeout", "30"); // Default value
```

## Performance Comparison

### Time Complexity

| Operation  | ArrayList | LinkedList | HashSet | TreeSet  | HashMap | TreeMap  |
| ---------- | --------- | ---------- | ------- | -------- | ------- | -------- |
| Add        | O(1)\*    | O(1)       | O(1)    | O(log n) | O(1)    | O(log n) |
| Remove     | O(n)      | O(1)\*\*   | O(1)    | O(log n) | O(1)    | O(log n) |
| Get/Search | O(1)      | O(n)       | O(1)    | O(log n) | O(1)    | O(log n) |
| Contains   | O(n)      | O(n)       | O(1)    | O(log n) | O(1)    | O(log n) |

\*Amortized, O(n) when resizing  
\*\*When removing from known position

### Memory Usage

| Collection | Memory Overhead | Notes                      |
| ---------- | --------------- | -------------------------- |
| ArrayList  | Low             | Contiguous array           |
| LinkedList | High            | Node objects with pointers |
| HashSet    | Medium          | Hash table + linked list   |
| TreeSet    | Medium          | Red-Black tree nodes       |
| HashMap    | Medium          | Hash table                 |
| TreeMap    | High            | Red-Black tree nodes       |

## Advanced Collection Operations

### Sorting Collections

```java
List<Integer> numbers = Arrays.asList(3, 1, 4, 1, 5, 9);

// Natural ordering
Collections.sort(numbers);

// Custom comparator
Collections.sort(numbers, (a, b) -> b - a);  // Reverse order

// Using Comparator methods
List<String> words = Arrays.asList("apple", "pie", "a", "longer");
words.sort(Comparator.comparing(String::length));
words.sort(Comparator.comparing(String::length).thenComparing(String::compareTo));
```

### Searching Collections

```java
List<Integer> sortedList = Arrays.asList(1, 3, 5, 7, 9);
int index = Collections.binarySearch(sortedList, 5);  // 2

// Custom comparator
List<String> sortedWords = Arrays.asList("a", "apple", "longer", "pie");
int wordIndex = Collections.binarySearch(sortedWords, "apple",
    Comparator.comparing(String::length));
```

### Collection Utilities

```java
List<String> list = new ArrayList<>(Arrays.asList("a", "b", "c", "d"));

// Reverse
Collections.reverse(list);  // [d, c, b, a]

// Shuffle
Collections.shuffle(list);

// Rotate
Collections.rotate(list, 2);  // Move elements 2 positions right

// Swap
Collections.swap(list, 0, 1);

// Fill
Collections.fill(list, "x");

// Replace all
Collections.replaceAll(list, "x", "y");

// Min/Max
Integer min = Collections.min(Arrays.asList(3, 1, 4, 1, 5));
Integer max = Collections.max(Arrays.asList(3, 1, 4, 1, 5));

// Frequency
int frequency = Collections.frequency(Arrays.asList(1, 2, 1, 3, 1), 1);  // 3

// Disjoint (no common elements)
boolean disjoint = Collections.disjoint(
    Arrays.asList(1, 2, 3),
    Arrays.asList(4, 5, 6)
);  // true
```

### Immutable Collections

```java
// Unmodifiable collections
List<String> mutableList = new ArrayList<>(Arrays.asList("a", "b", "c"));
List<String> immutableList = Collections.unmodifiableList(mutableList);

Set<String> immutableSet = Collections.unmodifiableSet(new HashSet<>(mutableList));
Map<String, Integer> immutableMap = Collections.unmodifiableMap(new HashMap<>());

// Singleton collections
Set<String> singletonSet = Collections.singleton("single");
List<String> singletonList = Collections.singletonList("single");
Map<String, Integer> singletonMap = Collections.singletonMap("key", 1);

// Empty collections
List<String> emptyList = Collections.emptyList();
Set<String> emptySet = Collections.emptySet();
Map<String, Integer> emptyMap = Collections.emptyMap();

// Java 9+ immutable collections
List<String> immutableList9 = List.of("a", "b", "c");
Set<String> immutableSet9 = Set.of("a", "b", "c");
Map<String, Integer> immutableMap9 = Map.of("a", 1, "b", 2);
```

## Choosing the Right Collection

### When to Use List

- **ArrayList**: Random access, more reads than writes
- **LinkedList**: Frequent insertions/deletions, queue/deque operations
- **Vector**: Thread-safe list (consider CopyOnWriteArrayList for better performance)

### When to Use Set

- **HashSet**: Fast lookups, no ordering required
- **LinkedHashSet**: Fast lookups with insertion order
- **TreeSet**: Sorted set, range operations

### When to Use Map

- **HashMap**: Fast key-value lookups, no ordering required
- **LinkedHashMap**: Fast lookups with insertion/access order
- **TreeMap**: Sorted map, range operations
- **ConcurrentHashMap**: Thread-safe map

### When to Use Queue

- **PriorityQueue**: Priority-based processing
- **ArrayDeque**: Stack or queue operations
- **LinkedList**: Simple queue implementation

## Thread-Safe Collections

```java
// Synchronized wrappers
List<String> syncList = Collections.synchronizedList(new ArrayList<>());
Set<String> syncSet = Collections.synchronizedSet(new HashSet<>());
Map<String, Integer> syncMap = Collections.synchronizedMap(new HashMap<>());

// Concurrent collections (preferred)
import java.util.concurrent.*;

List<String> copyOnWriteList = new CopyOnWriteArrayList<>();
Set<String> concurrentSet = ConcurrentHashMap.newKeySet();
Map<String, Integer> concurrentMap = new ConcurrentHashMap<>();
Queue<String> concurrentQueue = new ConcurrentLinkedQueue<>();
```

## Java 8+ Stream Operations

```java
List<String> words = Arrays.asList("apple", "banana", "cherry", "date");

// Filter and collect
List<String> longWords = words.stream()
    .filter(word -> word.length() > 5)
    .collect(Collectors.toList());

// Map and reduce
int totalLength = words.stream()
    .mapToInt(String::length)
    .sum();

// Group by length
Map<Integer, List<String>> groupedByLength = words.stream()
    .collect(Collectors.groupingBy(String::length));

// Partition by predicate
Map<Boolean, List<String>> partitioned = words.stream()
    .collect(Collectors.partitioningBy(word -> word.length() > 5));

// Convert to different collection types
Set<String> wordSet = words.stream()
    .collect(Collectors.toSet());

TreeSet<String> sortedSet = words.stream()
    .collect(Collectors.toCollection(TreeSet::new));
```

## Best Practices

1. **Use interfaces for variable types**: `List<String> list = new ArrayList<>();`
2. **Choose appropriate initial capacity** for ArrayList and HashMap
3. **Use StringBuilder for string concatenation** in loops
4. **Prefer immutable collections** when possible
5. **Use concurrent collections** instead of synchronized wrappers
6. **Override equals() and hashCode()** for custom objects in hash-based collections
7. **Implement Comparable** for custom objects in sorted collections
8. **Use generics** to ensure type safety
9. **Consider memory and performance implications** of your choice
10. **Use Collection.removeIf()** instead of iterator removal in loops

## Interview Tips

### Common Questions

1. **Difference between ArrayList and LinkedList**
2. **How does HashMap work internally?**
3. **What is the time complexity of various operations?**
4. **When would you use TreeSet vs HashSet?**
5. **How do you make a collection thread-safe?**
6. **What is the difference between Comparable and Comparator?**
7. **How does HashSet ensure uniqueness?**
8. **What is the difference between Iterator and ListIterator?**

### Code Examples to Remember

```java
// Efficient way to remove elements while iterating
Iterator<String> iterator = list.iterator();
while (iterator.hasNext()) {
    String item = iterator.next();
    if (condition) {
        iterator.remove();
    }
}

// Or use removeIf (Java 8+)
list.removeIf(item -> condition);

// Sort with multiple criteria
people.sort(Comparator.comparing(Person::getAge)
    .thenComparing(Person::getName));

// Convert array to list
List<String> list = Arrays.asList(array);  // Fixed size
List<String> mutableList = new ArrayList<>(Arrays.asList(array));  // Mutable
```
