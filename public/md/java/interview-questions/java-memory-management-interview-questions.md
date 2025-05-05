# Java Memory Management Interview Questions & Answers

### What does "memory is managed in Java" mean?

Java developers do not need to manually allocate and deallocate memory. The JVM, using its Garbage Collector (GC), handles memory management automatically, unlike languages like C.

### What is garbage collection and its advantages?

Garbage collection identifies unused objects and reclaims their memory. **Advantages**:

- Prevents manual memory management.
- Reduces memory leaks.
- Simplifies development.

### Are there disadvantages to garbage collection?

Yes. GC pauses application threads (**Stop-The-World** pauses), which can impact performance if not tuned properly.

### What is "Stop-The-World"?

During garbage collection, all application threads are paused to allow the GC to run safely. This pause can cause latency issues if not managed well.

### What are stack and heap? What is stored in each?

- **Stack**: Stores method calls, local variables, and object references. Each thread has its own stack.
- **Heap**: Stores all objects created with `new`. Object references live on the stack.

### What is generational garbage collection?

GC divides the heap into:

- **Young Generation**: Newly created objects.
- **Old Generation**: Long-lived objects.
- **PermGen/Metaspace**: Class metadata and interned strings.

Objects surviving multiple GC cycles in the Young Generation are promoted to the Old Generation. This approach optimizes GC performance.

### How does generational garbage collection work?

1. **New objects** → Eden space.
2. On **Minor GC**: Surviving objects move to Survivor spaces.
3. Surviving objects age and eventually move to Old Generation.
4. **Major GC** cleans Old Generation.

### When does an object become eligible for garbage collection?

When it’s no longer reachable from any live thread or static reference.

### How can you trigger garbage collection from code?

You can request GC using `System.gc()` or `Runtime.getRuntime().gc()`, but JVM is not obligated to run it immediately.

### What happens when the heap runs out of space?

An `OutOfMemoryError` is thrown (`java.lang.OutOfMemoryError: heap space`).

### Can an object be "resurrected" after becoming eligible for GC?

Yes, during `finalize()`, an object can become reachable again (e.g., by assigning itself to a static field). However, `finalize()` runs only once per object.

### What are strong, weak, soft, and phantom references?

- **Strong**: Default. Objects are not collected.
- **Soft**: Collected only when memory is low.
- **Weak**: Collected at the next GC cycle.
- **Phantom**: Enqueued after collection; allows notification when object is collected.

### Can objects with circular references be garbage collected?

Yes. GC uses reachability, not reference count, so unreachable circular references are collected.

### How are strings represented in memory?

`String` objects are immutable and contain:

- `char[] value`: The characters.
- `int hash`: Cached hash code.
  Constant strings are interned in a **string pool**.

### What is a `StringBuilder` and its use cases?

`StringBuilder` is a mutable sequence of characters. It avoids creating multiple `String` objects during concatenation, improving performance.

### Difference between appending to `StringBuilder` and using `+`?

Using `+` creates new `String` instances. `StringBuilder` modifies the existing object, which is more efficient, especially in loops.

### Difference between `StringBuilder` and `StringBuffer`?

- **StringBuilder**: Not thread-safe. Faster for single-threaded use.
- **StringBuffer**: Thread-safe. Use when multiple threads may access the same instance.

### Summary

Java’s managed memory model, combined with features like GC, generational collection, and different reference types, provides efficient memory handling while freeing developers from manual management. Proper understanding and tuning can significantly improve application performance.
