# Kotlin Collections and Data Structures

## Collection Hierarchy

### Collection Types

```kotlin
interface Collection<out E> : Iterable<E>
interface MutableCollection<E> : Collection<E>, MutableIterable<E>

interface List<out E> : Collection<E>
interface MutableList<E> : List<E>, MutableCollection<E>

interface Set<out E> : Collection<E>
interface MutableSet<E> : Set<E>, MutableCollection<E>

interface Map<K, out V>
interface MutableMap<K, V> : Map<K, V>
```

## Lists

### List Creation

```kotlin
val immutableList = listOf(1, 2, 3, 4, 5)
val mutableList = mutableListOf(1, 2, 3, 4, 5)
val arrayList = arrayListOf(1, 2, 3, 4, 5)
val emptyList = emptyList<Int>()
val listOfNulls = List(5) { null }
val listOfIndices = List(5) { it }
```

### List Operations

```kotlin
val list = listOf(1, 2, 3, 4, 5)

list[0]                    // Get element
list.get(0)               // Get element safely
list.getOrNull(10)        // Returns null if index out of bounds
list.getOrElse(10) { -1 } // Returns default if index out of bounds

list.first()              // First element
list.last()               // Last element
list.firstOrNull()        // First or null
list.lastOrNull()         // Last or null

list.indexOf(3)           // Index of element
list.lastIndexOf(3)       // Last index of element
list.contains(3)          // Check if contains
3 in list                 // Check if contains (operator)

list.subList(1, 4)        // Sublist
list.take(3)              // First n elements
list.drop(2)              // Skip first n elements
list.takeLast(3)          // Last n elements
list.dropLast(2)          // Skip last n elements
```

### List Modification (Mutable)

```kotlin
val mutableList = mutableListOf(1, 2, 3)

mutableList.add(4)                    // Add to end
mutableList.add(0, 0)                 // Add at index
mutableList.addAll(listOf(5, 6))      // Add all
mutableList.addAll(2, listOf(1, 2))   // Add all at index

mutableList.remove(2)                 // Remove element
mutableList.removeAt(0)               // Remove at index
mutableList.removeAll(listOf(1, 2))   // Remove all
mutableList.retainAll(listOf(3, 4))   // Keep only specified

mutableList[0] = 10                   // Set element
mutableList.set(1, 20)                // Set element

mutableList.clear()                   // Remove all elements
```

## Sets

### Set Creation

```kotlin
val immutableSet = setOf(1, 2, 3, 3, 4)  // Duplicates removed
val mutableSet = mutableSetOf(1, 2, 3)
val hashSet = hashSetOf(1, 2, 3)
val linkedSet = linkedSetOf(1, 2, 3)      // Preserves insertion order
val sortedSet = sortedSetOf(3, 1, 4, 2)   // Sorted order
val emptySet = emptySet<Int>()
```

### Set Operations

```kotlin
val set1 = setOf(1, 2, 3, 4)
val set2 = setOf(3, 4, 5, 6)

set1.contains(3)          // Check membership
3 in set1                 // Check membership (operator)

set1 union set2           // Union: [1, 2, 3, 4, 5, 6]
set1 intersect set2       // Intersection: [3, 4]
set1 subtract set2        // Difference: [1, 2]

set1.isEmpty()            // Check if empty
set1.isNotEmpty()         // Check if not empty
set1.size                 // Size
```

### Set Modification (Mutable)

```kotlin
val mutableSet = mutableSetOf(1, 2, 3)

mutableSet.add(4)                    // Add element
mutableSet.addAll(setOf(5, 6))       // Add all
mutableSet += 7                      // Add element (operator)
mutableSet += setOf(8, 9)            // Add all (operator)

mutableSet.remove(1)                 // Remove element
mutableSet.removeAll(setOf(2, 3))    // Remove all
mutableSet -= 4                      // Remove element (operator)
mutableSet -= setOf(5, 6)            // Remove all (operator)

mutableSet.retainAll(setOf(7, 8, 9)) // Keep only specified
mutableSet.clear()                   // Remove all
```

## Maps

### Map Creation

```kotlin
val immutableMap = mapOf("a" to 1, "b" to 2, "c" to 3)
val mutableMap = mutableMapOf("a" to 1, "b" to 2)
val hashMap = hashMapOf("a" to 1, "b" to 2)
val linkedMap = linkedMapOf("a" to 1, "b" to 2)  // Preserves insertion order
val sortedMap = sortedMapOf("c" to 3, "a" to 1, "b" to 2)  // Sorted by keys
val emptyMap = emptyMap<String, Int>()
```

### Map Operations

```kotlin
val map = mapOf("a" to 1, "b" to 2, "c" to 3)

map["a"]                     // Get value (nullable)
map.get("a")                 // Get value (nullable)
map.getValue("a")            // Get value (throws if not found)
map.getOrDefault("d", 0)     // Get or default
map.getOrElse("d") { 0 }     // Get or compute default

map.containsKey("a")         // Check if key exists
map.containsValue(2)         // Check if value exists
"a" in map                   // Check if key exists (operator)

map.keys                     // All keys
map.values                   // All values
map.entries                  // All key-value pairs

map.isEmpty()                // Check if empty
map.isNotEmpty()             // Check if not empty
map.size                     // Size
```

### Map Modification (Mutable)

```kotlin
val mutableMap = mutableMapOf("a" to 1, "b" to 2)

mutableMap["c"] = 3                           // Put
mutableMap.put("d", 4)                        // Put
mutableMap.putAll(mapOf("e" to 5, "f" to 6))  // Put all

mutableMap.remove("a")                        // Remove by key
mutableMap.remove("b", 2)                     // Remove by key-value pair

mutableMap.clear()                            // Remove all

mutableMap.getOrPut("g") { 7 }                // Get or put if absent
```

## Specialized Collections

### Arrays

```kotlin
val intArray = intArrayOf(1, 2, 3, 4, 5)
val stringArray = arrayOf("a", "b", "c")
val nullableArray = arrayOfNulls<String>(5)
val primitiveArray = IntArray(5) { it * 2 }

intArray[0] = 10
val first = intArray[0]
val size = intArray.size

intArray.forEach { println(it) }
val list = intArray.toList()
val mutableList = intArray.toMutableList()
```

### Ranges

```kotlin
val range = 1..10                    // Inclusive range
val exclusiveRange = 1 until 10      // Exclusive end
val downRange = 10 downTo 1          // Descending
val stepRange = 1..10 step 2         // With step
val charRange = 'a'..'z'             // Character range

range.contains(5)                    // Check membership
5 in range                           // Check membership (operator)
range.first                          // First element
range.last                           // Last element
range.step                           // Step value

for (i in range) { }                 // Iteration
range.forEach { }                    // Functional iteration
```

### Sequences

```kotlin
val sequence = sequenceOf(1, 2, 3, 4, 5)
val generatedSequence = generateSequence(1) { it + 1 }
val listSequence = listOf(1, 2, 3).asSequence()

val infiniteSequence = generateSequence(0) { it + 1 }
val fibonacci = generateSequence(1 to 1) { (a, b) -> b to (a + b) }
    .map { it.first }

val result = sequence
    .filter { it % 2 == 0 }
    .map { it * 2 }
    .take(3)
    .toList()
```

## Collection Operations

### Transformation

```kotlin
val numbers = listOf(1, 2, 3, 4, 5)

numbers.map { it * 2 }                        // Transform each element
numbers.mapIndexed { i, v -> i to v }         // Transform with index
numbers.mapNotNull { if (it > 3) it else null } // Transform and filter nulls

numbers.flatMap { listOf(it, it) }            // Flatten after mapping
numbers.associateWith { it * 2 }              // Create map with values
numbers.associateBy { it.toString() }         // Create map with keys
```

### Filtering

```kotlin
val numbers = listOf(1, 2, 3, 4, 5, 6)

numbers.filter { it % 2 == 0 }                // Keep matching elements
numbers.filterNot { it % 2 == 0 }            // Remove matching elements
numbers.filterIndexed { i, _ -> i % 2 == 0 } // Filter with index
numbers.filterIsInstance<Int>()               // Filter by type

val mixed = listOf(1, null, 2, null, 3)
mixed.filterNotNull()                         // Remove nulls
```

### Grouping and Partitioning

```kotlin
val words = listOf("apple", "banana", "apricot", "blueberry")

words.groupBy { it.first() }                  // Group by key
words.groupBy({ it.length }, { it.uppercase() }) // Group by key with value transform
words.partition { it.startsWith("a") }        // Split into two lists

val numbers = 1..10
numbers.chunked(3)                            // Split into chunks
numbers.windowed(3)                           // Sliding window
```

### Aggregation

```kotlin
val numbers = listOf(1, 2, 3, 4, 5)

numbers.sum()                                 // Sum
numbers.average()                             // Average
numbers.count()                               // Count all
numbers.count { it > 3 }                      // Count matching
numbers.maxOrNull()                           // Maximum
numbers.minOrNull()                           // Minimum
numbers.maxByOrNull { it }                    // Maximum by selector
numbers.minByOrNull { it }                    // Minimum by selector

numbers.fold(0) { acc, n -> acc + n }         // Fold with initial value
numbers.reduce { acc, n -> acc + n }          // Reduce without initial
numbers.runningFold(0) { acc, n -> acc + n }  // Running fold
numbers.runningReduce { acc, n -> acc + n }   // Running reduce
```

### Searching

```kotlin
val numbers = listOf(1, 2, 3, 4, 5)

numbers.find { it > 3 }                       // First matching or null
numbers.findLast { it > 3 }                   // Last matching or null
numbers.first { it > 3 }                      // First matching (throws if none)
numbers.last { it > 3 }                       // Last matching (throws if none)
numbers.firstOrNull { it > 10 }               // First matching or null
numbers.lastOrNull { it > 10 }                // Last matching or null

numbers.single { it == 3 }                    // Single matching (throws if none or multiple)
numbers.singleOrNull { it == 3 }              // Single matching or null

numbers.any { it > 3 }                        // Any matching
numbers.all { it > 0 }                        // All matching
numbers.none { it > 10 }                      // None matching
```

## Performance Considerations

### Collection Performance

| Operation        | ArrayList | LinkedList | HashSet | HashMap |
| ---------------- | --------- | ---------- | ------- | ------- |
| Access by index  | O(1)      | O(n)       | N/A     | N/A     |
| Insert at end    | O(1)      | O(1)       | O(1)    | O(1)    |
| Insert at middle | O(n)      | O(1)\*     | N/A     | N/A     |
| Remove by index  | O(n)      | O(1)\*     | N/A     | N/A     |
| Search           | O(n)      | O(n)       | O(1)    | O(1)    |
| Contains         | O(n)      | O(n)       | O(1)    | O(1)    |

\*If you have a reference to the node

### When to Use What

```kotlin
val list = arrayListOf<Int>()           // Random access, dynamic size
val linkedList = mutableListOf<Int>()   // Frequent insertions/deletions
val set = hashSetOf<Int>()              // Unique elements, fast lookup
val map = hashMapOf<String, Int>()      // Key-value pairs, fast lookup
val sequence = list.asSequence()       // Lazy evaluation for large data
```

## Advanced Collection Operations

### Custom Comparators

```kotlin
val people = listOf(
    Person("Alice", 30),
    Person("Bob", 25),
    Person("Charlie", 35)
)

people.sortedBy { it.age }                    // Sort by property
people.sortedByDescending { it.age }          // Sort descending
people.sortedWith(compareBy { it.name })      // Sort with comparator
people.sortedWith(compareBy<Person> { it.age }.thenBy { it.name }) // Multiple criteria
```

### Zip and Unzip

```kotlin
val names = listOf("Alice", "Bob", "Charlie")
val ages = listOf(30, 25, 35)

val pairs = names.zip(ages)               // List of pairs
val people = names.zip(ages) { name, age -> Person(name, age) }

val (unzippedNames, unzippedAges) = pairs.unzip()
```

### Collection Building

```kotlin
val list = buildList {
    add(1)
    add(2)
    addAll(listOf(3, 4, 5))
}

val set = buildSet {
    add(1)
    add(2)
    add(2)  // Won't be added (duplicate)
}

val map = buildMap {
    put("a", 1)
    put("b", 2)
    putAll(mapOf("c" to 3, "d" to 4))
}
```
