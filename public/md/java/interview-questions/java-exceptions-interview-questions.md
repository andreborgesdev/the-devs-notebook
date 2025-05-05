# Java Exceptions Interview Questions & Answers

### What is an exception?

An exception is an abnormal event that disrupts the normal flow of a program's execution.

### What is the purpose of the throw and throws keywords?

- `throws`: Declares exceptions a method might throw.
- `throw`: Actually throws an exception.

Example:

```java
public void method() throws IOException {
    // code
}
if (error) {
    throw new IllegalArgumentException("Invalid argument");
}
```

### How can you handle an exception?

Using `try-catch-finally`:

```java
try {
    // code
} catch (IOException ex) {
    // handle
} finally {
    // cleanup
}
```

### How can you catch multiple exceptions?

1. Single catch block for a broad exception.
2. Multiple catch blocks for specific exceptions.
3. Multi-catch block:

```java
catch (IOException | SQLException ex) {
    // handle
}
```

### Difference between checked and unchecked exceptions?

- **Checked**: Must be handled or declared. (e.g., IOException)
- **Unchecked**: Not required to be handled. (e.g., NullPointerException)

### Difference between Exception and Error?

- **Exception**: Recoverable conditions.
- **Error**: Serious problems typically outside program control (e.g., OutOfMemoryError).

### What exception is thrown by this code?

```java
Integer[][] ints = { {1, 2, 3}, {null}, {7, 8, 9} };
System.out.println(ints[1][1].intValue());
```

Throws **ArrayIndexOutOfBoundsException**.

### What is exception chaining?

Attaching one exception to another to preserve the cause:

```java
catch (IOException ex) {
    throw new CustomException("Higher-level context", ex);
}
```

### What is a stack trace?

A report showing the method calls leading to an exception.

### Why subclass an exception?

To represent custom error conditions and provide additional context.

### Advantages of exceptions

- Cleaner separation of error handling.
- Error propagation without extra code.
- Grouping exceptions via class hierarchy.

### Can lambdas throw checked exceptions?

- **Standard functional interfaces**: Only unchecked exceptions.
- **Custom functional interfaces**: Can declare checked exceptions.

### Rules when overriding methods that throw exceptions

- Cannot throw new or broader checked exceptions.
- Can throw fewer, narrower, or unchecked exceptions.

### Will this code compile?

```java
throw new RuntimeException(new Exception("Cause"));
```

Yes. RuntimeException is unchecked.

### Can you throw a checked exception from a method without declaring it?

Yes, using a generic "sneaky throw" technique:

```java
public <T extends Throwable> void sneakyThrow(Throwable t) throws T {
    throw (T) t;
}
```

### When to use checked vs unchecked exceptions?

- **Checked**: When recovery is possible.
- **Unchecked**: When recovery is unlikely or represents programming errors.

Example:

```java
if (!isValid(fileName)) {
    throw new InvalidFileNameException("Invalid file"); // checked
}
if (fileName == null) {
    throw new NullPointerException("Filename is null"); // unchecked
}
```

### References

- Oracle Java Documentation
- Baeldung: [Java Checked vs Unchecked Exceptions](https://www.baeldung.com/java-checked-unchecked-exceptions)
