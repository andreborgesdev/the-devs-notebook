# Strings in Java

A `String` in Java is a sequence of characters and is one of the most commonly used classes in the language. Java’s `String` class is **immutable**, meaning once a `String` object is created, it cannot be modified.

## Key Characteristics

- Defined in `java.lang` package.
- Immutable: modifying a string creates a new object.
- Interned: string literals are pooled for memory efficiency.
- Implements `Serializable`, `Comparable<String>`, and `CharSequence`.

## Creating Strings

```java
String s1 = "hello";              // string literal (pooled)
String s2 = new String("hello");  // new object (not interned)
```

## Common String Operations

| Operation                         | Description                             | Example                   |
| --------------------------------- | --------------------------------------- | ------------------------- |
| `length()`                        | Returns number of characters            | `s.length()`              |
| `charAt(i)`                       | Character at index `i`                  | `s.charAt(0)`             |
| `substring(a, b)`                 | Substring from index `a` to `b-1`       | `s.substring(1, 4)`       |
| `indexOf()`                       | Finds position of a character or string | `s.indexOf("el")`         |
| `contains()`                      | Checks if string contains a sequence    | `s.contains("ell")`       |
| `equals()`                        | Compares content                        | `s1.equals(s2)`           |
| `equalsIgnoreCase()`              | Case-insensitive comparison             | `s1.equalsIgnoreCase(s2)` |
| `compareTo()`                     | Lexicographic comparison                | `s1.compareTo(s2)`        |
| `toLowerCase()` / `toUpperCase()` | Case conversion                         | `s.toLowerCase()`         |
| `trim()`                          | Removes leading/trailing whitespace     | `s.trim()`                |
| `replace()`                       | Replaces characters or substrings       | `s.replace("l", "p")`     |
| `split()`                         | Splits a string by delimiter            | `s.split(",")`            |
| `startsWith()` / `endsWith()`     | Checks prefixes/suffixes                | `s.startsWith("he")`      |

## String Immutability

```java
String s = "hello";
s = s + " world"; // a new object is created; s now references the new string
```

Because of immutability:

- It's thread-safe.
- Reduces bugs from unexpected changes.
- Can lead to performance issues in loops (see `StringBuilder` and `StringBuffer` below).

## String Pool (Interning)

```java
String a = "test";
String b = "test";
System.out.println(a == b); // true, same pool reference

String c = new String("test");
System.out.println(a == c); // false, different objects
```

Use `intern()` to manually place a string into the pool:

```java
String d = c.intern();
System.out.println(a == d); // true
```

## Performance Tip: Use StringBuilder

In performance-critical code (especially loops), prefer `StringBuilder`:

```java
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append("data");
}
String result = sb.toString();
```

- `StringBuilder` is faster for single-threaded use.
- `StringBuffer` is thread-safe (but slower).

## StringBuffer (Thread-Safe Mutable String)

`StringBuffer` is similar to `StringBuilder`, but it's **synchronized**, meaning it is safe for use in **multi-threaded** contexts. Every method is thread-safe via synchronized blocks.

```java
StringBuffer sb = new StringBuffer("hello");
sb.append(" world");
System.out.println(sb.toString()); // hello world
```

### How It Works Internally

- Backed by a **mutable character array**.
- Grows as needed (typically doubling the array size).
- Synchronization is applied to most methods using `synchronized` keyword to avoid race conditions.
- Example of internal growth logic:
  ```java
  if (count + newLength > value.length) {
      expandCapacity(count + newLength);
  }
  ```

### When to Use

Use `StringBuffer` instead of `StringBuilder` when:

- Multiple threads are modifying the same string instance.
- You need guaranteed data consistency without implementing your own synchronization.

## Converting Between Types

```java
int number = 42;
String s = String.valueOf(number); // "42"

String input = "123";
int parsed = Integer.parseInt(input); // 123
```

## String Comparison: `==` vs `equals()`

- `==` compares **references**.
- `equals()` compares **values**.

```java
String x = "java";
String y = new String("java");

System.out.println(x == y);       // false
System.out.println(x.equals(y));  // true
```

## Regular Expressions

Use `matches`, `replaceAll`, `split`, etc.:

```java
String email = "test@example.com";
boolean valid = email.matches("^[\\w.-]+@[\\w.-]+\\.\\w+$");
```

## Common Pitfalls

- Using `==` instead of `equals()` for comparison.
- Inefficient string concatenation in loops.
- Not trimming user input before comparison or storage.
- Not handling `null` values before calling string methods.

## Real-World Example

```java
public class StringExample {
    public static void main(String[] args) {
        String fullName = " Ada Lovelace ";
        fullName = fullName.trim().toUpperCase();

        if (fullName.startsWith("ADA")) {
            System.out.println("Hello, " + fullName + "!");
        }
    }
}
```

## When to Use

- Working with fixed textual data.
- Matching patterns, parsing input.
- Keys in maps or other collections (since they're immutable and hashable).
