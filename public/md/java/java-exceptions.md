# Java Exceptions

## What Is an Exception?

An **exception** is an abnormal event that occurs during the execution of a program and disrupts its normal flow.

## Purpose of `throw` and `throws`

- `throws`: Declares exceptions a method might throw.

  ```java
  public void simpleMethod() throws Exception {
      // code
  }
  ```

- `throw`: Actually throws an exception.

  ```java
  if (task.isTooComplicated()) {
      throw new TooComplicatedException("The task is too complicated");
  }
  ```

## Handling Exceptions

Use `try-catch-finally`:

```java
try {
    // risky code
} catch (ExceptionType ex) {
    // handle exception
} finally {
    // cleanup
}
```

## Catching Multiple Exceptions

### Broad Catch (Not recommended)

```java
catch (Exception ex) { }
```

### Multiple Catches

```java
catch (FileNotFoundException ex) { }
catch (EOFException ex) { }
```

### Multi-catch (Java 7+)

```java
catch (FileNotFoundException | EOFException ex) { }
```

## Checked vs Unchecked Exceptions

| Type      | Must Handle? | Example                                        |
| --------- | ------------ | ---------------------------------------------- |
| Checked   | Yes          | IOException, SQLException                      |
| Unchecked | No           | NullPointerException, IllegalArgumentException |

- **Checked**: Must be caught or declared (`throws`).
- **Unchecked**: Subclasses of `RuntimeException`.

## Exception vs Error

| Aspect       | Exception                   | Error                                |
| ------------ | --------------------------- | ------------------------------------ |
| Recoverable? | Often yes                   | Usually no                           |
| Examples     | IOException, ParseException | OutOfMemoryError, StackOverflowError |

## Exception Chaining

```java
try {
    task.readConfigFile();
} catch (FileNotFoundException ex) {
    throw new TaskException("Could not perform task", ex);
}
```

## Stacktrace

A stacktrace shows the method call history leading to an exception. Essential for debugging.

## Custom Exceptions

Create when standard exceptions don’t fit:

```java
public class MyCustomException extends Exception {
    public MyCustomException(String message) {
        super(message);
    }
}
```

## Exception Handling in Lambdas

- Can throw **unchecked exceptions** in standard functional interfaces.
- Can throw **checked exceptions** with custom functional interfaces:

  ```java
  @FunctionalInterface
  interface CheckedFunction<T> {
      void apply(T t) throws Exception;
  }
  ```

## Overriding Methods and Exceptions

| Parent Method Throws | Child Method Can Throw                       |
| -------------------- | -------------------------------------------- |
| Nothing              | Unchecked only                               |
| Checked exceptions   | Same, subset, or narrower checked exceptions |
| Unchecked exceptions | Any unchecked exceptions                     |

**Example:**

```java
class Parent {
    void doSomething() throws IOException { }
}

class Child extends Parent {
    void doSomething() throws FileNotFoundException { }
}
```

## Sneaky Throws (Advanced)

Throw checked exceptions without declaring:

```java
public <T extends Throwable> T sneakyThrow(Throwable ex) throws T {
    throw (T) ex;
}
```

## Best Practices: Checked vs Unchecked

**Checked**:

> If the client **can** recover (e.g., file not found).
> **Unchecked**:
> If the client **cannot** reasonably recover (e.g., null pointer).

## Advantages of Using Exceptions

- Cleaner separation of error-handling and business logic.
- Supports exception propagation.
- Enables flexible and maintainable error handling.

## Example: Null Pointer Exception in Array

```java
Integer[][] ints = { {1, 2, 3}, {null}, {7, 8, 9} };
System.out.println(ints[1][1].intValue());
```

**Throws**: `ArrayIndexOutOfBoundsException`

## Exception Handling Summary

| Term    | Description                                |
| ------- | ------------------------------------------ |
| try     | Code that may throw an exception.          |
| catch   | Handles the exception.                     |
| finally | Executes always, for cleanup.              |
| throw   | Used to throw an exception.                |
| throws  | Declares an exception in method signature. |
