# Java Strings - Comprehensive Guide

## Overview

String is one of the most fundamental and frequently used classes in Java. Understanding String behavior, memory management, and performance characteristics is crucial for Java developers and technical interviews.

## Key Characteristics

- **Package**: `java.lang` (automatically imported)
- **Immutability**: Once created, String objects cannot be modified
- **String Pool**: Literals are stored in a special memory area for optimization
- **Interfaces**: Implements `Serializable`, `Comparable<String>`, `CharSequence`
- **Thread Safety**: Immutable objects are inherently thread-safe
- **Final Class**: Cannot be extended (security and optimization)in Java

A `String` in Java is a sequence of characters and is one of the most commonly used classes in the language. Java’s `String` class is **immutable**, meaning once a `String` object is created, it cannot be modified.

## Key Characteristics

- Defined in `java.lang` package.
- Immutable: modifying a string creates a new object.
- Interned: string literals are pooled for memory efficiency.
- Implements `Serializable`, `Comparable<String>`, and `CharSequence`.

## String Creation Methods

### Literal vs Constructor

```java
String s1 = "Hello";              // String literal (goes to String Pool)
String s2 = new String("Hello");  // Creates new object in heap
String s3 = "Hello";              // Reuses s1 from String Pool

System.out.println(s1 == s2);     // false (different objects)
System.out.println(s1 == s3);     // true (same pool reference)
System.out.println(s1.equals(s2)); // true (same content)
```

### Character Array

```java
char[] chars = {'H', 'e', 'l', 'l', 'o'};
String s = new String(chars);
```

### StringBuilder/Buffer

```java
StringBuilder sb = new StringBuilder("Hello");
String s = sb.toString();
```

### Byte Array

```java
byte[] bytes = {72, 101, 108, 108, 111}; // ASCII values
String s = new String(bytes);
```

## String Operations - Complete Reference

### Length and Character Access

```java
String str = "Hello World";
int length = str.length();           // 11
char ch = str.charAt(6);             // 'W'
char[] chars = str.toCharArray();    // Convert to char array
byte[] bytes = str.getBytes();       // Convert to byte array
```

### Substring Operations

```java
String str = "Hello World";
String sub1 = str.substring(6);      // "World"
String sub2 = str.substring(0, 5);   // "Hello"
String sub3 = str.substring(6, 11);  // "World"
```

### Search Operations

```java
String str = "Hello World Hello";
int index1 = str.indexOf('o');           // 4 (first occurrence)
int index2 = str.lastIndexOf('o');       // 17 (last occurrence)
int index3 = str.indexOf("World");       // 6
int index4 = str.indexOf('o', 5);        // 7 (search from index 5)
boolean contains = str.contains("World"); // true
```

### Comparison Operations

```java
String s1 = "Hello";
String s2 = "hello";
String s3 = "HELLO";

// Content comparison
boolean eq1 = s1.equals(s2);           // false
boolean eq2 = s1.equalsIgnoreCase(s2); // true

// Lexicographic comparison
int cmp1 = s1.compareTo(s2);           // negative (H < h in ASCII)
int cmp2 = s1.compareToIgnoreCase(s2); // 0 (equal ignoring case)

// Prefix/Suffix checking
boolean starts = s1.startsWith("He");   // true
boolean ends = s1.endsWith("lo");       // true
```

### Case Conversion

```java
String str = "Hello World";
String upper = str.toUpperCase();       // "HELLO WORLD"
String lower = str.toLowerCase();       // "hello world"
```

### Whitespace Operations

```java
String str = "  Hello World  ";
String trimmed = str.trim();            // "Hello World"
String stripped = str.strip();          // Java 11+ (handles Unicode)
String leading = str.stripLeading();    // "Hello World  "
String trailing = str.stripTrailing();  // "  Hello World"
boolean blank = str.isBlank();          // Java 11+ (true if empty or whitespace)
```

### Replacement Operations

```java
String str = "Hello World Hello";
String replaced1 = str.replace('l', 'x');           // "Hexxo Worxd Hexxo"
String replaced2 = str.replace("Hello", "Hi");      // "Hi World Hi"
String replaced3 = str.replaceFirst("Hello", "Hi"); // "Hi World Hello"
String replaced4 = str.replaceAll("Hello", "Hi");   // "Hi World Hi"
```

### Split Operations

```java
String str = "apple,banana,cherry";
String[] fruits = str.split(",");       // ["apple", "banana", "cherry"]
String[] limited = str.split(",", 2);   // ["apple", "banana,cherry"]

String path = "com.example.package";
String[] parts = path.split("\\.");     // Need to escape dot
```

### Join Operations (Java 8+)

```java
String[] words = {"Hello", "World", "Java"};
String joined = String.join(" ", words);     // "Hello World Java"
String csvJoined = String.join(",", words);  // "Hello,World,Java"

List<String> list = Arrays.asList("A", "B", "C");
String result = String.join("-", list);      // "A-B-C"
```

## String Immutability Deep Dive

### Understanding Immutability

```java
String original = "Hello";
String modified = original.concat(" World");

System.out.println(original);  // "Hello" (unchanged)
System.out.println(modified);  // "Hello World" (new object)
System.out.println(original == modified); // false
```

### Memory Impact

```java
String result = "";
for (int i = 0; i < 1000; i++) {
    result += "a"; // Creates 1000 intermediate String objects!
}
```

### Benefits of Immutability

1. **Thread Safety**: Multiple threads can access without synchronization
2. **Caching**: Hash code can be cached (used in HashMap)
3. **Security**: Prevents malicious modification
4. **String Pool**: Enables memory optimization

### Internal Structure

```java
public final class String implements Serializable, Comparable<String>, CharSequence {
    private final char[] value;  // Java 8 and earlier
    private final byte[] value;  // Java 9+ (compact strings)
    private int hash; // Cached hash code
}
```

## String Pool (Interning) Deep Dive

### How String Pool Works

```java
String a = "Hello";          // Goes to String Pool
String b = "Hello";          // Reuses from String Pool
String c = new String("Hello"); // Creates new object in heap
String d = c.intern();       // Moves to String Pool

System.out.println(a == b);  // true (same pool reference)
System.out.println(a == c);  // false (different memory locations)
System.out.println(a == d);  // true (intern() returns pool reference)
```

### String Pool Location

- **Java 7 and earlier**: PermGen space
- **Java 8+**: Heap memory (part of young generation)

### Memory Benefits

```java
String[] array = new String[1000];
for (int i = 0; i < 1000; i++) {
    array[i] = "CONSTANT"; // Only one object created in pool
}
```

### Manual Interning

```java
String dynamic = new StringBuilder("Hello").append(" World").toString();
String interned = dynamic.intern(); // Add to pool if not present

// Use interned version for comparisons
if (interned == "Hello World") {
    System.out.println("Found in pool");
}
```

### Best Practices for String Pool

1. Use string literals when possible
2. Avoid `new String()` constructor for literals
3. Use `intern()` for dynamically created strings used frequently
4. Be cautious with `intern()` - can cause memory leaks in older versions

## StringBuilder vs StringBuffer vs String

### Performance Comparison

```java
// ❌ Inefficient - creates many intermediate objects
String result = "";
for (int i = 0; i < 10000; i++) {
    result += "data"; // O(n²) time complexity
}

// ✅ Efficient - single mutable buffer
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 10000; i++) {
    sb.append("data"); // O(n) time complexity
}
String result = sb.toString();
```

### StringBuilder (Non-Thread-Safe)

```java
StringBuilder sb = new StringBuilder(100); // Initial capacity
sb.append("Hello")
  .append(" ")
  .append("World")
  .insert(5, ",")         // "Hello, World"
  .delete(5, 6)           // "Hello World"
  .reverse();             // "dlroW olleH"

String result = sb.toString();
```

### StringBuffer (Thread-Safe)

```java
StringBuffer sb = new StringBuffer("Initial");
sb.append(" text");  // Synchronized method
sb.insert(7, " more"); // All methods are synchronized

// Thread-safe operations
ExecutorService executor = Executors.newFixedThreadPool(10);
for (int i = 0; i < 100; i++) {
    executor.submit(() -> sb.append("data"));
}
```

### Capacity Management

```java
StringBuilder sb = new StringBuilder(); // Default capacity: 16
sb.append("Very long string that exceeds initial capacity");

// Check capacity
int capacity = sb.capacity();  // Auto-expanded
int length = sb.length();      // Actual content length

// Pre-size for better performance
StringBuilder optimized = new StringBuilder(1000);
```

### Performance Guidelines

| Operation               | String | StringBuilder | StringBuffer |
| ----------------------- | ------ | ------------- | ------------ |
| Single concatenation    | ✅     | ❌            | ❌           |
| Multiple concatenations | ❌     | ✅            | ⚠️           |
| Thread safety           | ✅     | ❌            | ✅           |
| Performance             | Slow   | Fast          | Medium       |

## Java 8+ String Features

### String Processing with Streams

```java
String text = "Hello World Java Programming";
List<String> words = Arrays.stream(text.split(" "))
    .filter(word -> word.length() > 4)
    .map(String::toUpperCase)
    .collect(Collectors.toList());
// ["HELLO", "WORLD", "PROGRAMMING"]

// Character processing
String input = "Hello";
input.chars()
    .mapToObj(c -> (char) c)
    .forEach(System.out::println);
```

### Modern String Methods (Java 11+)

```java
String text = "  Hello World  ";

// Enhanced whitespace handling
boolean blank = text.isBlank();           // false
String stripped = text.strip();          // "Hello World"
String leading = text.stripLeading();    // "Hello World  "
String trailing = text.stripTrailing();  // "  Hello World"

// Repeat strings
String repeated = "Ha".repeat(3);         // "HaHaHa"

// Line processing
String multiline = "Line1\nLine2\nLine3";
multiline.lines()
    .filter(line -> !line.isEmpty())
    .forEach(System.out::println);
```

### Pattern Matching (Java 14+)

```java
String processText(String input) {
    return switch (input.toLowerCase()) {
        case "hello" -> "Greeting received";
        case "bye" -> "Farewell received";
        default -> "Unknown message: " + input;
    };
}
```

## String Conversions and Formatting

### Type Conversions

```java
// Primitive to String
int num = 42;
String s1 = String.valueOf(num);      // "42"
String s2 = Integer.toString(num);    // "42"
String s3 = "" + num;                 // "42" (implicit conversion)

// String to primitive
String str = "123";
int parsed = Integer.parseInt(str);    // 123
double d = Double.parseDouble("3.14"); // 3.14
boolean b = Boolean.parseBoolean("true"); // true

// Handle NumberFormatException
try {
    int invalid = Integer.parseInt("abc");
} catch (NumberFormatException e) {
    System.out.println("Invalid number format");
}
```

### String Formatting

```java
// printf-style formatting
String formatted = String.format("Name: %s, Age: %d, Score: %.2f",
                                 "John", 25, 85.567);

// Text blocks (Java 15+)
String json = """
    {
        "name": "%s",
        "age": %d
    }
    """.formatted("John", 25);

// StringBuilder with formatting
StringBuilder sb = new StringBuilder();
Formatter formatter = new Formatter(sb);
formatter.format("Hello %s, you are %d years old", "Alice", 30);
```

## String Comparison Deep Dive

### Reference vs Content Comparison

```java
String s1 = "Java";
String s2 = "Java";
String s3 = new String("Java");
String s4 = s3.intern();

// Reference comparison (==)
System.out.println(s1 == s2);  // true (same pool reference)
System.out.println(s1 == s3);  // false (different objects)
System.out.println(s1 == s4);  // true (intern returns pool reference)

// Content comparison (equals)
System.out.println(s1.equals(s3));  // true (same content)

// Case-insensitive comparison
String s5 = "JAVA";
System.out.println(s1.equalsIgnoreCase(s5)); // true
```

### Null Safety

```java
String s1 = "Hello";
String s2 = null;

// ❌ Potential NullPointerException
if (s2.equals(s1)) { ... }

// ✅ Safe comparison
if (Objects.equals(s1, s2)) { ... }  // Java 7+
if ("Hello".equals(s2)) { ... }      // Constant first pattern
```

### Lexicographic Comparison

```java
String s1 = "apple";
String s2 = "banana";
String s3 = "Apple";

int result1 = s1.compareTo(s2);  // negative (apple < banana)
int result2 = s2.compareTo(s1);  // positive (banana > apple)
int result3 = s1.compareTo(s1);  // 0 (equal)

// Case-insensitive lexicographic comparison
int result4 = s1.compareToIgnoreCase(s3); // 0 (equal ignoring case)
```

## Regular Expressions with Strings

### Pattern Matching

```java
String email = "user@example.com";
String phonePattern = "\\d{3}-\\d{3}-\\d{4}";
String emailPattern = "^[\\w.-]+@[\\w.-]+\\.\\w+$";

// Direct string methods
boolean isValidEmail = email.matches(emailPattern);
String cleaned = email.replaceAll("[^\\w@.]", "");
String[] parts = email.split("@");
```

### Advanced Regex Usage

```java
import java.util.regex.Pattern;
import java.util.regex.Matcher;

String text = "Phone: 123-456-7890, Alt: 987-654-3210";
Pattern pattern = Pattern.compile("(\\d{3})-(\\d{3})-(\\d{4})");
Matcher matcher = pattern.matcher(text);

while (matcher.find()) {
    String fullMatch = matcher.group();    // "123-456-7890"
    String areaCode = matcher.group(1);    // "123"
    String exchange = matcher.group(2);    // "456"
    String number = matcher.group(3);      // "7890"
}
```

### Common Regex Patterns

```java
// Validation patterns
String digitOnly = "\\d+";
String alphaNumeric = "[a-zA-Z0-9]+";
String email = "^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$";
String url = "^https?://[\\w.-]+\\.[a-zA-Z]{2,}";
String creditCard = "\\d{4}-?\\d{4}-?\\d{4}-?\\d{4}";

// Replacement examples
String text = "Hello123World456";
String letters = text.replaceAll("\\d", "");     // "HelloWorld"
String numbers = text.replaceAll("[a-zA-Z]", ""); // "123456"
```

## Performance Optimization

### Memory Optimization

```java
// ❌ Memory inefficient
List<String> inefficient = new ArrayList<>();
for (int i = 0; i < 1000; i++) {
    inefficient.add("Prefix" + i + "Suffix"); // Creates many intermediate strings
}

// ✅ Memory efficient
List<String> efficient = new ArrayList<>();
StringBuilder template = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    template.setLength(0);  // Reset without creating new object
    template.append("Prefix").append(i).append("Suffix");
    efficient.add(template.toString());
}
```

### String Deduplication (Java 8u20+)

```java
// JVM flag: -XX:+UseStringDeduplication
// Automatically deduplicates identical strings in heap
String[] duplicates = new String[1000];
for (int i = 0; i < 1000; i++) {
    duplicates[i] = new String("DUPLICATE"); // Will be deduplicated
}
```

### Performance Best Practices

1. **Use StringBuilder for multiple concatenations**
2. **Pre-size StringBuilder capacity when known**
3. **Prefer String literals over new String()**
4. **Use intern() judiciously for frequently compared strings**
5. **Consider String deduplication for large applications**

## Common Pitfalls and Best Practices

### Pitfalls to Avoid

1. **Reference vs Content Comparison**

```java
// ❌ Wrong
String s1 = new String("hello");
String s2 = new String("hello");
if (s1 == s2) { ... } // Always false

// ✅ Correct
if (s1.equals(s2)) { ... } // Content comparison
```

2. **Null Pointer Exceptions**

```java
// ❌ Risky
String input = getUserInput(); // Might return null
if (input.equals("expected")) { ... } // NPE if input is null

// ✅ Safe
if ("expected".equals(input)) { ... } // Constant first
if (Objects.equals(input, "expected")) { ... } // Null-safe
```

3. **Inefficient Concatenation**

```java
// ❌ Inefficient - O(n²) complexity
String result = "";
for (String s : list) {
    result += s; // Creates new string each time
}

// ✅ Efficient - O(n) complexity
StringBuilder sb = new StringBuilder();
for (String s : list) {
    sb.append(s);
}
String result = sb.toString();
```

4. **Unnecessary Object Creation**

```java
// ❌ Creates unnecessary object
String s = new String("literal");

// ✅ Uses string pool
String s = "literal";
```

### Best Practices

1. **Always use equals() for content comparison**
2. **Handle null values appropriately**
3. **Use StringBuilder for multiple concatenations**
4. **Trim user input before processing**
5. **Use appropriate method for the task (contains vs indexOf)**
6. **Consider regex for complex pattern matching**
7. **Pre-size collections and builders when size is known**

## Real-World Examples

### Input Validation

```java
public class InputValidator {
    public static boolean isValidEmail(String email) {
        if (email == null || email.isBlank()) {
            return false;
        }

        String pattern = "^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$";
        return email.matches(pattern);
    }

    public static String sanitizeInput(String input) {
        if (input == null) return "";

        return input.trim()
                   .replaceAll("[<>\"']", "") // Remove dangerous characters
                   .replaceAll("\\s+", " ");  // Normalize whitespace
    }
}
```

### Text Processing

```java
public class TextProcessor {
    public static Map<String, Integer> wordCount(String text) {
        if (text == null || text.isBlank()) {
            return Collections.emptyMap();
        }

        return Arrays.stream(text.toLowerCase().split("\\W+"))
                    .filter(word -> !word.isEmpty())
                    .collect(Collectors.groupingBy(
                        word -> word,
                        Collectors.summingInt(w -> 1)
                    ));
    }

    public static String extractNumbers(String text) {
        if (text == null) return "";

        return text.replaceAll("[^0-9]", "");
    }
}
```

### Configuration Management

```java
public class ConfigParser {
    private final Map<String, String> properties = new HashMap<>();

    public void parseConfig(String configText) {
        if (configText == null) return;

        configText.lines()
                  .map(String::trim)
                  .filter(line -> !line.isEmpty() && !line.startsWith("#"))
                  .forEach(this::parseLine);
    }

    private void parseLine(String line) {
        String[] parts = line.split("=", 2);
        if (parts.length == 2) {
            String key = parts[0].trim();
            String value = parts[1].trim();
            properties.put(key, value);
        }
    }

    public String getProperty(String key, String defaultValue) {
        return properties.getOrDefault(key, defaultValue);
    }
}
```

## Interview Questions

### Fundamental Questions

1. **Why are Strings immutable in Java?**

   - Security (prevent malicious modification)
   - Thread safety (no synchronization needed)
   - String pooling (safe to share references)
   - Hash code caching (performance optimization)

2. **What is the difference between String, StringBuilder, and StringBuffer?**

   - String: Immutable, thread-safe, slower for concatenations
   - StringBuilder: Mutable, not thread-safe, fastest for concatenations
   - StringBuffer: Mutable, thread-safe, slower than StringBuilder

3. **Explain String pooling and how intern() works.**
   - String pool stores unique string literals
   - intern() moves string to pool or returns existing reference
   - Memory optimization and faster equality checks

### Advanced Questions

4. **What happens when you use == vs equals() with Strings?**

   - == compares references/memory addresses
   - equals() compares actual content
   - String literals share pool references

5. **How does Java optimize string concatenation with +?**

   - Compiler optimizes simple concatenations
   - Uses StringBuilder for complex expressions
   - Still inefficient in loops

6. **What is the difference between String.valueOf() and toString()?**
   - String.valueOf() handles null safely (returns "null")
   - toString() throws NullPointerException on null
   - String.valueOf() internally calls toString() after null check

### Performance Questions

7. **Why is string concatenation in a loop inefficient?**

   - Creates new String object each iteration
   - O(n²) time complexity due to copying
   - Use StringBuilder for O(n) performance

8. **When would you use intern() and what are its risks?**
   - Use for frequently compared strings
   - Risk: memory leaks in older Java versions
   - String pool has limited size

### Scenario-Based Questions

9. **How would you implement a method to reverse words in a sentence?**

```java
public static String reverseWords(String sentence) {
    if (sentence == null || sentence.isBlank()) {
        return sentence;
    }

    String[] words = sentence.trim().split("\\s+");
    Collections.reverse(Arrays.asList(words));
    return String.join(" ", words);
}
```

10. **How would you check if two strings are anagrams?**

```java
public static boolean areAnagrams(String s1, String s2) {
    if (s1 == null || s2 == null || s1.length() != s2.length()) {
        return false;
    }

    char[] chars1 = s1.toLowerCase().toCharArray();
    char[] chars2 = s2.toLowerCase().toCharArray();

    Arrays.sort(chars1);
    Arrays.sort(chars2);

    return Arrays.equals(chars1, chars2);
}
```

## Summary

String handling is fundamental to Java programming and frequently tested in interviews. Key concepts include:

### Core Concepts

- **Immutability**: Strings cannot be modified after creation
- **String Pool**: Memory optimization for string literals
- **Performance**: Use StringBuilder for multiple concatenations
- **Comparison**: Use equals() for content, == for reference

### Performance Considerations

- String concatenation in loops is O(n²)
- StringBuilder provides O(n) performance
- String pool optimizes memory usage
- Proper capacity sizing improves performance

### Best Practices

- Use string literals instead of new String()
- Handle null values safely
- Use appropriate comparison methods
- Choose right tool: String, StringBuilder, or StringBuffer
- Consider regex for complex pattern matching

### Modern Features

- Java 11+ enhanced string methods (strip, isBlank, repeat)
- Text blocks for multi-line strings
- Pattern matching with switch expressions
- Stream API integration for string processing

Understanding these concepts and being able to explain the trade-offs between different approaches is crucial for Java technical interviews.
