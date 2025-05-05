# Java Flow Control Interview Questions & Answers

### What are _if-then_ and _if-then-else_ statements?

They execute code conditionally based on a boolean expression:

```java
if (age >= 21) {
    // code if true
} else {
    // code if false
}
```

Java only supports boolean expressions as conditions.

### Describe the _switch_ statement. What types can be used in the _switch_ clause?

_switch_ selects execution paths based on a variable’s value. Types allowed:

- byte, short, char, int
- Enum
- String

```java
switch (value) {
    case "A":
        // code
        break;
    default:
        // code
}
```

### What happens without a _break_ statement in a _switch_ case?

The execution falls through to subsequent cases until a break is found.

### When to use _switch_ vs _if-then-else_?

- _switch_: Testing one variable against many constant values.
- _if-then-else_: Evaluating ranges or complex conditions.

### What types of loops does Java support?

- **for**: Predefined number of iterations.
- **while**: Runs while a condition is true.
- **do-while**: Runs at least once, then checks the condition.

### What is an enhanced _for_ loop?

Simplifies iterating over arrays or collections:

```java
for (String item : items) {
    // process item
}
```

### How can you exit a loop early?

Use the _break_ statement to exit the loop immediately.

### Difference between unlabeled and labeled _break_?

- **Unlabeled break**: Exits the innermost loop or _switch_.
- **Labeled break**: Exits an outer loop specified by a label.

Example:

```java
outer: for (...) {
    for (...) {
        if (condition) break outer;
    }
}
```

### Difference between unlabeled and labeled _continue_?

- **Unlabeled continue**: Skips to the next iteration of the innermost loop.
- **Labeled continue**: Skips to the next iteration of an outer loop.

### How does execution flow in a _try-catch-finally_ construct?

- Code in _try_ runs first.
- If an exception occurs, the matching _catch_ block executes.
- Regardless of exceptions, the _finally_ block executes.

### When might the _finally_ block not execute?

If the JVM exits or the thread is killed during execution.

### What is the result of this code?

```java
public static int assignment() {
    int number = 1;
    try {
        number = 3;
        if (true) throw new Exception("Test");
    } catch (Exception ex) {
        return number;
    } finally {
        number = 4;
    }
}
System.out.println(assignment());
```

**Output**: 3. The value returned in the _catch_ block is returned before the _finally_ block can modify it.

### When is _try-finally_ useful even without exceptions?

To ensure resource cleanup when using _break_, _continue_, or _return_ statements.

Example:

```java
HeavyProcess process = new HeavyProcess();
try {
    return process.heavyTask();
} finally {
    process.cleanup();
}
```

### How does _try-with-resources_ work?

Automatically closes resources that implement _AutoCloseable_ or _Closeable_:

```java
try (FileReader reader = new FileReader("file.txt")) {
    // use reader
}
```

### Summary

Java provides robust flow control mechanisms:

- Conditional branching (_if_, _switch_)
- Loops (_for_, _while_, _do-while_, enhanced _for_)
- Loop control (_break_, _continue_, labeled/unlabeled)
- Exception handling (_try-catch-finally_, _try-with-resources_)

These constructs allow developers to manage program logic, handle errors gracefully, and ensure proper resource management.
