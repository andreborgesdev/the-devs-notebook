# Java Fundamentals

## Data Types and Variables

### Primitive Types

| Type    | Size    | Range                                      | Default  | Wrapper   |
| ------- | ------- | ------------------------------------------ | -------- | --------- |
| boolean | 1 bit   | true, false                                | false    | Boolean   |
| byte    | 8 bits  | -128 to 127                                | 0        | Byte      |
| char    | 16 bits | 0 to 65,535 (Unicode)                      | '\u0000' | Character |
| short   | 16 bits | -32,768 to 32,767                          | 0        | Short     |
| int     | 32 bits | -2,147,483,648 to 2,147,483,647            | 0        | Integer   |
| long    | 64 bits | -9,223,372,036,854,775,808 to 9,223,372... | 0L       | Long      |
| float   | 32 bits | ±3.40282347E+38F                           | 0.0f     | Float     |
| double  | 64 bits | ±1.79769313486231570E+308                  | 0.0      | Double    |

### Variable Declaration and Initialization

```java
int age = 25;
double salary = 50000.50;
String name = "John";
boolean isActive = true;

final int MAX_SIZE = 100;

var list = new ArrayList<String>();
```

### Type Casting

```java
int x = 10;
double y = x;        // Implicit widening
int z = (int) y;     // Explicit narrowing

Integer boxed = 42;  // Autoboxing
int unboxed = boxed; // Unboxing
```

## Operators

### Arithmetic Operators

| Operator | Description    | Example    |
| -------- | -------------- | ---------- |
| +        | Addition       | a + b      |
| -        | Subtraction    | a - b      |
| \*       | Multiplication | a \* b     |
| /        | Division       | a / b      |
| %        | Modulus        | a % b      |
| ++       | Increment      | ++a or a++ |
| --       | Decrement      | --a or a-- |

### Comparison Operators

| Operator | Description              | Example |
| -------- | ------------------------ | ------- |
| ==       | Equal to                 | a == b  |
| !=       | Not equal to             | a != b  |
| >        | Greater than             | a > b   |
| <        | Less than                | a < b   |
| >=       | Greater than or equal to | a >= b  |
| <=       | Less than or equal to    | a <= b  |

### Logical Operators

| Operator | Description | Example  |
| -------- | ----------- | -------- |
| &&       | Logical AND | a && b   |
| \|\|     | Logical OR  | a \|\| b |
| !        | Logical NOT | !a       |

### Bitwise Operators

| Operator | Description    | Example |
| -------- | -------------- | ------- |
| &        | Bitwise AND    | a & b   |
| \|       | Bitwise OR     | a \| b  |
| ^        | Bitwise XOR    | a ^ b   |
| ~        | Bitwise NOT    | ~a      |
| <<       | Left shift     | a << 2  |
| >>       | Right shift    | a >> 2  |
| >>>      | Unsigned right | a >>> 2 |

### Ternary Operator

```java
String result = (score >= 60) ? "Pass" : "Fail";
int max = (a > b) ? a : b;
```

## Control Flow Statements

### If-Else Statements

```java
if (condition) {
    // code
} else if (anotherCondition) {
    // code
} else {
    // code
}
```

### Switch Statements

```java
switch (grade) {
    case 'A':
        System.out.println("Excellent");
        break;
    case 'B':
        System.out.println("Good");
        break;
    case 'C':
        System.out.println("Average");
        break;
    default:
        System.out.println("Invalid grade");
}

// Switch expressions (Java 14+)
String result = switch (day) {
    case MONDAY, FRIDAY, SUNDAY -> "6";
    case TUESDAY -> "7";
    case THURSDAY, SATURDAY -> "8";
    case WEDNESDAY -> "9";
};
```

### Loops

#### For Loop

```java
for (int i = 0; i < 10; i++) {
    System.out.println(i);
}

// Enhanced for loop
String[] names = {"John", "Jane", "Bob"};
for (String name : names) {
    System.out.println(name);
}
```

#### While Loop

```java
int i = 0;
while (i < 10) {
    System.out.println(i);
    i++;
}
```

#### Do-While Loop

```java
int i = 0;
do {
    System.out.println(i);
    i++;
} while (i < 10);
```

### Break and Continue

```java
for (int i = 0; i < 10; i++) {
    if (i == 3) continue;  // Skip iteration
    if (i == 7) break;     // Exit loop
    System.out.println(i);
}

// Labeled break/continue
outer: for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        if (i == 1 && j == 1) break outer;
        System.out.println(i + "," + j);
    }
}
```

## Methods

### Method Declaration

```java
[access_modifier] [static] [final] return_type method_name(parameters) [throws exceptions] {
    // method body
    return value; // if not void
}
```

### Examples

```java
public static int add(int a, int b) {
    return a + b;
}

private void printMessage(String message) {
    System.out.println(message);
}

public final double calculateArea(double radius) {
    return Math.PI * radius * radius;
}
```

### Method Overloading

```java
public class Calculator {
    public int add(int a, int b) {
        return a + b;
    }

    public double add(double a, double b) {
        return a + b;
    }

    public int add(int a, int b, int c) {
        return a + b + c;
    }
}
```

### Variable Arguments (Varargs)

```java
public void printNumbers(int... numbers) {
    for (int num : numbers) {
        System.out.println(num);
    }
}

// Usage
printNumbers(1, 2, 3, 4, 5);
printNumbers(new int[]{1, 2, 3});
```

## Arrays

### Array Declaration and Initialization

```java
int[] numbers = new int[5];
int[] values = {1, 2, 3, 4, 5};
int[] data = new int[]{10, 20, 30};

String[] names = new String[3];
names[0] = "Alice";
names[1] = "Bob";
names[2] = "Charlie";
```

### Multidimensional Arrays

```java
int[][] matrix = new int[3][4];
int[][] grid = {{1, 2}, {3, 4}, {5, 6}};

// Jagged arrays
int[][] jagged = new int[3][];
jagged[0] = new int[2];
jagged[1] = new int[4];
jagged[2] = new int[3];
```

### Array Operations

```java
int[] arr = {5, 2, 8, 1, 9};

// Length
System.out.println(arr.length);

// Iteration
for (int i = 0; i < arr.length; i++) {
    System.out.println(arr[i]);
}

for (int value : arr) {
    System.out.println(value);
}

// Copying
int[] copy = Arrays.copyOf(arr, arr.length);
int[] range = Arrays.copyOfRange(arr, 1, 4);

// Sorting
Arrays.sort(arr);

// Searching
int index = Arrays.binarySearch(arr, 5);

// Converting to string
System.out.println(Arrays.toString(arr));
```

## String Handling

### String Creation

```java
String str1 = "Hello";           // String literal
String str2 = new String("Hello"); // String object
String str3 = new String(new char[]{'H', 'e', 'l', 'l', 'o'});
```

### String Methods

```java
String text = "Hello World";

// Basic operations
int length = text.length();
char ch = text.charAt(0);
String sub = text.substring(0, 5);
int index = text.indexOf("World");
boolean contains = text.contains("llo");

// Case operations
String upper = text.toUpperCase();
String lower = text.toLowerCase();

// Comparison
boolean equals = text.equals("Hello World");
boolean equalsIgnoreCase = text.equalsIgnoreCase("hello world");
int compare = text.compareTo("Hello");

// Modification
String trimmed = text.trim();
String replaced = text.replace("World", "Java");
String[] parts = text.split(" ");

// Checking
boolean starts = text.startsWith("Hello");
boolean ends = text.endsWith("World");
boolean empty = text.isEmpty();
```

### StringBuilder and StringBuffer

```java
StringBuilder sb = new StringBuilder();
sb.append("Hello");
sb.append(" ");
sb.append("World");
sb.insert(5, " Beautiful");
sb.delete(5, 15);
String result = sb.toString();

// StringBuffer (thread-safe)
StringBuffer buffer = new StringBuffer("Hello");
buffer.append(" World");
```

## Input/Output

### Console Input

```java
import java.util.Scanner;

Scanner scanner = new Scanner(System.in);

System.out.print("Enter your name: ");
String name = scanner.nextLine();

System.out.print("Enter your age: ");
int age = scanner.nextInt();

scanner.close();
```

### Console Output

```java
System.out.println("Hello World");
System.out.print("No newline");
System.err.println("Error message");

// Formatted output
System.out.printf("Name: %s, Age: %d%n", "John", 25);
String formatted = String.format("Price: $%.2f", 19.99);
```

## Constants and Final

```java
public class Constants {
    public static final int MAX_SIZE = 100;
    public static final String APP_NAME = "MyApp";
    public static final double PI = 3.14159;

    private final int id;

    public Constants(int id) {
        this.id = id;  // final field must be initialized
    }
}
```

## Common Patterns and Best Practices

### Null Safety

```java
String text = getText();
if (text != null && !text.isEmpty()) {
    process(text);
}

// Using Optional (Java 8+)
Optional<String> optional = Optional.ofNullable(getText());
optional.ifPresent(this::process);
```

### Defensive Programming

```java
public void processArray(int[] array) {
    if (array == null) {
        throw new IllegalArgumentException("Array cannot be null");
    }

    if (array.length == 0) {
        return; // Handle empty array
    }

    // Process array
}
```

### Resource Management

```java
// Try-with-resources (Java 7+)
try (Scanner scanner = new Scanner(System.in)) {
    String input = scanner.nextLine();
    // scanner automatically closed
}
```

## Interview Tips

### Common Mistakes to Avoid

1. **String comparison with ==**: Use `equals()` method
2. **Array bounds**: Always check array length
3. **Null pointer exceptions**: Check for null before method calls
4. **Integer overflow**: Be aware of primitive type limits
5. **Infinite loops**: Ensure loop conditions eventually become false

### Performance Considerations

1. **StringBuilder over String concatenation** in loops
2. **Enhanced for loops** for better readability
3. **Appropriate data types** for memory efficiency
4. **Avoid unnecessary object creation** in loops

### Code Quality

1. **Meaningful variable names**
2. **Consistent indentation and formatting**
3. **Single responsibility principle** for methods
4. **Proper exception handling**
5. **Comments for complex logic**
