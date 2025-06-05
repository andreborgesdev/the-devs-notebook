# Java Exception Handling - Complete Guide

## Exception Hierarchy

### Exception Class Structure

```java
// Throwable (root class)
//   ├── Error (system errors, not recoverable)
//   │   ├── OutOfMemoryError
//   │   ├── StackOverflowError
//   │   └── VirtualMachineError
//   └── Exception
//       ├── RuntimeException (unchecked)
//       │   ├── NullPointerException
//       │   ├── IllegalArgumentException
//       │   ├── IndexOutOfBoundsException
//       │   ├── ClassCastException
//       │   └── NumberFormatException
//       └── Checked Exceptions
//           ├── IOException
//           ├── SQLException
//           ├── ClassNotFoundException
//           └── ParseException
```

### Checked vs Unchecked Exceptions

```java
// Checked exceptions - must be handled or declared
public void readFile(String filename) throws IOException {
    FileReader file = new FileReader(filename); // IOException must be handled
}

// Unchecked exceptions - runtime exceptions
public void divide(int a, int b) {
    int result = a / b; // May throw ArithmeticException
}

// Error - system level, shouldn't be caught
public void recursiveMethod() {
    recursiveMethod(); // Will cause StackOverflowError
}
```

## Try-Catch-Finally

### Basic Exception Handling

```java
public void basicExceptionHandling() {
    try {
        int result = 10 / 0;
        System.out.println("Result: " + result);
    } catch (ArithmeticException e) {
        System.out.println("Cannot divide by zero: " + e.getMessage());
    } finally {
        System.out.println("This always executes");
    }
}

// Multiple catch blocks
public void multipleCatchBlocks() {
    try {
        String str = null;
        int length = str.length(); // NullPointerException
        int[] arr = new int[5];
        arr[10] = 1; // ArrayIndexOutOfBoundsException
    } catch (NullPointerException e) {
        System.out.println("Null pointer exception: " + e.getMessage());
    } catch (ArrayIndexOutOfBoundsException e) {
        System.out.println("Array index out of bounds: " + e.getMessage());
    } catch (Exception e) {
        System.out.println("General exception: " + e.getMessage());
    }
}

// Multi-catch (Java 7+)
public void multiCatch() {
    try {
        // Some risky code
    } catch (IOException | SQLException e) {
        System.out.println("Database or file error: " + e.getMessage());
        // Note: e is implicitly final
    }
}
```

### Try-with-Resources

```java
// Traditional approach
public void traditionalResourceHandling() {
    FileInputStream fis = null;
    try {
        fis = new FileInputStream("file.txt");
        // Use the resource
    } catch (IOException e) {
        e.printStackTrace();
    } finally {
        if (fis != null) {
            try {
                fis.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}

// Try-with-resources (Java 7+)
public void tryWithResources() {
    try (FileInputStream fis = new FileInputStream("file.txt");
         BufferedReader reader = new BufferedReader(new InputStreamReader(fis))) {

        String line = reader.readLine();
        System.out.println(line);
    } catch (IOException e) {
        e.printStackTrace();
    }
    // Resources automatically closed
}

// Multiple resources
public void multipleResources() {
    try (FileInputStream input = new FileInputStream("input.txt");
         FileOutputStream output = new FileOutputStream("output.txt");
         Scanner scanner = new Scanner(input)) {

        while (scanner.hasNextLine()) {
            String line = scanner.nextLine();
            output.write(line.getBytes());
        }
    } catch (IOException e) {
        e.printStackTrace();
    }
}

// Custom resource (implements AutoCloseable)
public class CustomResource implements AutoCloseable {
    public void doSomething() {
        System.out.println("Doing something...");
    }

    @Override
    public void close() throws Exception {
        System.out.println("Cleaning up custom resource");
    }
}

public void customResourceUsage() {
    try (CustomResource resource = new CustomResource()) {
        resource.doSomething();
    } catch (Exception e) {
        e.printStackTrace();
    }
}
```

## Custom Exceptions

### Creating Custom Exceptions

```java
// Custom checked exception
public class BusinessLogicException extends Exception {
    private String errorCode;

    public BusinessLogicException(String message) {
        super(message);
    }

    public BusinessLogicException(String message, Throwable cause) {
        super(message, cause);
    }

    public BusinessLogicException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}

// Custom unchecked exception
public class InvalidConfigurationException extends RuntimeException {
    public InvalidConfigurationException(String message) {
        super(message);
    }

    public InvalidConfigurationException(String message, Throwable cause) {
        super(message, cause);
    }
}

// Using custom exceptions
public class UserService {
    public void createUser(String username, String email) throws BusinessLogicException {
        if (username == null || username.trim().isEmpty()) {
            throw new BusinessLogicException("Username cannot be empty", "USER_001");
        }

        if (!isValidEmail(email)) {
            throw new BusinessLogicException("Invalid email format", "USER_002");
        }

        // Create user logic
    }

    public void updateConfiguration(Properties config) {
        if (config == null) {
            throw new InvalidConfigurationException("Configuration cannot be null");
        }

        // Update configuration logic
    }

    private boolean isValidEmail(String email) {
        return email != null && email.contains("@");
    }
}
```

### Exception Chaining

```java
public class ServiceLayer {
    public void processData(String data) throws BusinessLogicException {
        try {
            // Simulate data processing that might fail
            parseData(data);
        } catch (NumberFormatException e) {
            // Chain the original exception
            throw new BusinessLogicException("Failed to process data: invalid number format", e);
        } catch (IOException e) {
            // Chain with additional context
            throw new BusinessLogicException("Failed to process data: I/O error occurred", e);
        }
    }

    private void parseData(String data) throws IOException {
        if (data.contains("invalid")) {
            throw new IOException("Invalid data format");
        }

        Integer.parseInt(data); // May throw NumberFormatException
    }
}

// Usage
public void handleService() {
    ServiceLayer service = new ServiceLayer();
    try {
        service.processData("invalid123");
    } catch (BusinessLogicException e) {
        System.out.println("Business error: " + e.getMessage());
        System.out.println("Root cause: " + e.getCause().getClass().getSimpleName());
        e.printStackTrace(); // Shows full stack trace with chained exceptions
    }
}
```

## Exception Handling Best Practices

### Proper Exception Handling

```java
public class BestPracticesExample {

    // Good: Specific exception handling
    public String readFileContent(String filename) {
        try (BufferedReader reader = Files.newBufferedReader(Paths.get(filename))) {
            return reader.lines().collect(Collectors.joining("\n"));
        } catch (NoSuchFileException e) {
            logger.warn("File not found: {}", filename);
            return "";
        } catch (AccessDeniedException e) {
            logger.error("Access denied for file: {}", filename);
            throw new ServiceException("Cannot access file", e);
        } catch (IOException e) {
            logger.error("I/O error reading file: {}", filename, e);
            throw new ServiceException("File read error", e);
        }
    }

    // Good: Fail-fast validation
    public void processOrder(Order order) {
        Objects.requireNonNull(order, "Order cannot be null");

        if (order.getItems().isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one item");
        }

        if (order.getTotal().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Order total must be positive");
        }

        // Process order
    }

    // Good: Resource cleanup
    public void processFile(String inputFile, String outputFile) throws ProcessingException {
        InputStream input = null;
        OutputStream output = null;

        try {
            input = new FileInputStream(inputFile);
            output = new FileOutputStream(outputFile);

            // Process files
            processStreams(input, output);

        } catch (IOException e) {
            throw new ProcessingException("File processing failed", e);
        } finally {
            closeQuietly(input);
            closeQuietly(output);
        }
    }

    private void closeQuietly(Closeable closeable) {
        if (closeable != null) {
            try {
                closeable.close();
            } catch (IOException e) {
                logger.warn("Failed to close resource", e);
            }
        }
    }
}
```

### Anti-Patterns to Avoid

```java
public class AntiPatterns {

    // BAD: Swallowing exceptions
    public void badExceptionHandling() {
        try {
            riskyOperation();
        } catch (Exception e) {
            // Silent failure - very bad!
        }
    }

    // BAD: Generic exception catching
    public void genericCatch() {
        try {
            specificOperation();
        } catch (Exception e) { // Too generic
            System.out.println("Something went wrong");
        }
    }

    // BAD: Exception for control flow
    public boolean hasNumber(String str) {
        try {
            Integer.parseInt(str);
            return true;
        } catch (NumberFormatException e) {
            return false; // Don't use exceptions for control flow
        }
    }

    // BETTER: Proper validation
    public boolean hasNumberBetter(String str) {
        return str != null && str.matches("-?\\d+");
    }

    // BAD: Losing original exception
    public void losingOriginalException() {
        try {
            riskyOperation();
        } catch (SpecificException e) {
            throw new RuntimeException("Operation failed"); // Lost original cause
        }
    }

    // BETTER: Preserve original exception
    public void preservingOriginalException() {
        try {
            riskyOperation();
        } catch (SpecificException e) {
            throw new RuntimeException("Operation failed", e); // Preserved cause
        }
    }
}
```

## Advanced Exception Handling

### Exception Handling in Multithreading

```java
public class ThreadExceptionHandling {

    // Handle exceptions in threads
    public void handleThreadExceptions() {
        Thread thread = new Thread(() -> {
            try {
                // Risky operation
                riskyThreadOperation();
            } catch (Exception e) {
                // Handle exception in thread
                handleThreadException(e);
            }
        });

        // Set uncaught exception handler
        thread.setUncaughtExceptionHandler((t, e) -> {
            System.err.println("Uncaught exception in thread " + t.getName() + ": " + e.getMessage());
            e.printStackTrace();
        });

        thread.start();
    }

    // Exception handling with ExecutorService
    public void handleExecutorExceptions() {
        ExecutorService executor = Executors.newFixedThreadPool(4);

        Future<String> future = executor.submit(() -> {
            // This might throw an exception
            return riskyOperation();
        });

        try {
            String result = future.get(); // Exception thrown here if task failed
            System.out.println("Result: " + result);
        } catch (ExecutionException e) {
            Throwable cause = e.getCause(); // Get the actual exception
            System.err.println("Task failed: " + cause.getMessage());
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println("Task interrupted");
        } finally {
            executor.shutdown();
        }
    }

    // CompletableFuture exception handling
    public void handleCompletableFutureExceptions() {
        CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
            return riskyOperation();
        }).exceptionally(throwable -> {
            System.err.println("Exception occurred: " + throwable.getMessage());
            return "Default value";
        }).handle((result, throwable) -> {
            if (throwable != null) {
                return "Error: " + throwable.getMessage();
            }
            return "Success: " + result;
        });

        try {
            String result = future.get();
            System.out.println(result);
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }
    }
}
```

### Functional Exception Handling

```java
public class FunctionalExceptionHandling {

    // Handling exceptions in streams
    public List<Integer> parseNumbers(List<String> strings) {
        return strings.stream()
            .map(this::safeParseInt)
            .filter(Optional::isPresent)
            .map(Optional::get)
            .collect(Collectors.toList());
    }

    private Optional<Integer> safeParseInt(String str) {
        try {
            return Optional.of(Integer.parseInt(str));
        } catch (NumberFormatException e) {
            return Optional.empty();
        }
    }

    // Custom functional interface for exception handling
    @FunctionalInterface
    public interface ThrowingFunction<T, R> {
        R apply(T t) throws Exception;

        static <T, R> Function<T, Optional<R>> wrap(ThrowingFunction<T, R> function) {
            return t -> {
                try {
                    return Optional.of(function.apply(t));
                } catch (Exception e) {
                    return Optional.empty();
                }
            };
        }
    }

    // Usage of wrapped function
    public void useWrappedFunction() {
        List<String> strings = Arrays.asList("1", "2", "invalid", "3");

        List<Integer> numbers = strings.stream()
            .map(ThrowingFunction.wrap(Integer::parseInt))
            .filter(Optional::isPresent)
            .map(Optional::get)
            .collect(Collectors.toList());
    }
}
```

## Exception Handling Patterns

### Circuit Breaker Pattern

```java
public class CircuitBreaker {
    private enum State { CLOSED, OPEN, HALF_OPEN }

    private State state = State.CLOSED;
    private int failureCount = 0;
    private long lastFailureTime = 0;
    private final int failureThreshold = 5;
    private final long timeout = 60000; // 1 minute

    public <T> T execute(Supplier<T> operation) throws Exception {
        if (state == State.OPEN) {
            if (System.currentTimeMillis() - lastFailureTime > timeout) {
                state = State.HALF_OPEN;
            } else {
                throw new Exception("Circuit breaker is OPEN");
            }
        }

        try {
            T result = operation.get();
            onSuccess();
            return result;
        } catch (Exception e) {
            onFailure();
            throw e;
        }
    }

    private void onSuccess() {
        failureCount = 0;
        state = State.CLOSED;
    }

    private void onFailure() {
        failureCount++;
        lastFailureTime = System.currentTimeMillis();

        if (failureCount >= failureThreshold) {
            state = State.OPEN;
        }
    }
}
```

### Retry Pattern

```java
public class RetryHandler {

    public <T> T executeWithRetry(Supplier<T> operation, int maxRetries, long delayMs) throws Exception {
        Exception lastException = null;

        for (int attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                return operation.get();
            } catch (Exception e) {
                lastException = e;

                if (attempt == maxRetries) {
                    break;
                }

                // Exponential backoff
                long delay = delayMs * (1L << attempt);
                try {
                    Thread.sleep(delay);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    throw new Exception("Retry interrupted", ie);
                }
            }
        }

        throw new Exception("Operation failed after " + (maxRetries + 1) + " attempts", lastException);
    }
}
```

## Performance Considerations

### Exception Performance Impact

```java
public class ExceptionPerformance {

    // Exceptions are expensive - avoid in hot paths
    public boolean isNumericSlow(String str) {
        try {
            Integer.parseInt(str);
            return true;
        } catch (NumberFormatException e) {
            return false; // Slow due to exception creation
        }
    }

    // Better approach
    public boolean isNumericFast(String str) {
        if (str == null || str.isEmpty()) {
            return false;
        }

        for (int i = 0; i < str.length(); i++) {
            if (!Character.isDigit(str.charAt(i))) {
                return false;
            }
        }
        return true;
    }

    // Pre-validate to avoid exceptions
    public void processFile(String filename) throws IOException {
        Path path = Paths.get(filename);

        // Check before accessing
        if (!Files.exists(path)) {
            throw new FileNotFoundException("File not found: " + filename);
        }

        if (!Files.isReadable(path)) {
            throw new IOException("File is not readable: " + filename);
        }

        // Now safely process the file
        try (BufferedReader reader = Files.newBufferedReader(path)) {
            // Process file
        }
    }
}
```

## Common Interview Questions

### Exception Hierarchy

**Q: What's the difference between Error and Exception?**
A: Error represents serious system-level problems that applications shouldn't try to handle (OutOfMemoryError, StackOverflowError). Exception represents conditions that applications can reasonably handle.

**Q: What are checked and unchecked exceptions?**
A: Checked exceptions must be declared in method signature or handled (IOException, SQLException). Unchecked exceptions are runtime exceptions that don't require explicit handling (NullPointerException, IllegalArgumentException).

### Exception Handling Mechanisms

**Q: What happens if finally block throws an exception?**
A: The exception from finally block suppresses the original exception. The original exception becomes a suppressed exception.

**Q: When is finally block not executed?**
A: When JVM exits (System.exit()), JVM crashes, or thread is killed.

### Best Practices

**Q: Should you catch Exception or RuntimeException?**
A: Generally no, catch specific exceptions. Catching generic Exception/RuntimeException can hide bugs and make debugging difficult.

**Q: How do you handle exceptions in streams?**
A: Wrap throwing operations in Optional, create wrapper functions, or extract to separate methods with proper exception handling.

### Advanced Topics

**Q: What is exception chaining?**
A: Linking exceptions to preserve the original cause while providing additional context. Use constructor that takes Throwable cause parameter.

**Q: How do thread exceptions work?**
A: Uncaught exceptions in threads don't affect other threads. Use UncaughtExceptionHandler to handle them properly.
