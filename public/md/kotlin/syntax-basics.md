# Kotlin Syntax Basics

## Variables and Data Types

### Variable Declarations

```kotlin
val immutable = "Cannot be changed"
var mutable = "Can be changed"
lateinit var delayed: String
```

### Type System

| Type      | Size    | Range                                                   |
| --------- | ------- | ------------------------------------------------------- |
| `Byte`    | 8 bits  | -128 to 127                                             |
| `Short`   | 16 bits | -32,768 to 32,767                                       |
| `Int`     | 32 bits | -2,147,483,648 to 2,147,483,647                         |
| `Long`    | 64 bits | -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807 |
| `Float`   | 32 bits | IEEE 754                                                |
| `Double`  | 64 bits | IEEE 754                                                |
| `Boolean` | -       | true/false                                              |
| `Char`    | 16 bits | Unicode character                                       |

### Nullable Types

```kotlin
var nullable: String? = null
var nonNull: String = "Cannot be null"

val length = nullable?.length ?: 0
val forceLength = nullable!!.length
```

## Control Flow

### Conditional Expressions

```kotlin
val result = if (condition) "true" else "false"

when (value) {
    1 -> "one"
    2, 3 -> "two or three"
    in 4..10 -> "between 4 and 10"
    is String -> "is a string"
    else -> "other"
}
```

### Loops

```kotlin
for (i in 1..10) { }
for (i in 1 until 10) { }
for (i in 10 downTo 1) { }
for (i in 1..10 step 2) { }

repeat(5) { index -> }

while (condition) { }
do { } while (condition)
```

### Ranges

```kotlin
val range = 1..10
val charRange = 'a'..'z'
val downRange = 10 downTo 1
val stepRange = 1..10 step 2
```

## Functions

### Function Declaration

```kotlin
fun basic(param: String): String {
    return "Hello $param"
}

fun singleExpression(x: Int) = x * 2

fun withDefaults(name: String = "World") = "Hello $name"

fun varargs(vararg numbers: Int) = numbers.sum()
```

### Higher-Order Functions

```kotlin
fun operate(x: Int, y: Int, operation: (Int, Int) -> Int) = operation(x, y)

val sum = operate(5, 3) { a, b -> a + b }
val multiply = operate(5, 3, Int::times)
```

### Lambda Expressions

```kotlin
val lambda = { x: Int, y: Int -> x + y }
val shortLambda: (Int) -> Int = { it * 2 }

listOf(1, 2, 3).map { it * 2 }
    .filter { it > 2 }
    .forEach { println(it) }
```

## Collections

### List Operations

```kotlin
val list = listOf(1, 2, 3)
val mutableList = mutableListOf(1, 2, 3)

list.map { it * 2 }
list.filter { it > 1 }
list.reduce { acc, item -> acc + item }
list.fold(0) { acc, item -> acc + item }
```

### Set Operations

```kotlin
val set = setOf(1, 2, 3)
val mutableSet = mutableSetOf(1, 2, 3)

val union = set1 union set2
val intersection = set1 intersect set2
val difference = set1 subtract set2
```

### Map Operations

```kotlin
val map = mapOf("key" to "value")
val mutableMap = mutableMapOf("key" to "value")

map.getValue("key")
map.getOrDefault("key", "default")
map.getOrElse("key") { "default" }
```

## String Operations

### String Templates

```kotlin
val name = "Kotlin"
val message = "Hello $name"
val length = "Length is ${name.length}"
```

### String Functions

```kotlin
val text = "Hello World"
text.uppercase()
text.lowercase()
text.capitalize()
text.reversed()
text.substring(0, 5)
text.split(" ")
text.replace("World", "Kotlin")
text.contains("Hello")
text.startsWith("Hello")
text.endsWith("World")
```

### Raw Strings

```kotlin
val rawString = """
    This is a raw string
    with multiple lines
    and no escape sequences needed
""".trimIndent()
```

## Operators

### Comparison Operators

```kotlin
== != < > <= >=
=== !==  // Reference equality
```

### Logical Operators

```kotlin
&& || !
```

### Elvis Operator

```kotlin
val result = nullable ?: "default value"
```

### Safe Call Operator

```kotlin
val length = nullable?.length
```

### Not-null Assertion

```kotlin
val length = nullable!!.length
```

## Type Checking and Casting

### Smart Casts

```kotlin
if (obj is String) {
    println(obj.length)
}

when (obj) {
    is String -> obj.length
    is Int -> obj + 1
    else -> 0
}
```

### Explicit Casting

```kotlin
val string = obj as String
val stringOrNull = obj as? String
```

## Scope Functions

### let

```kotlin
nullable?.let { value ->
    println("Value is $value")
}
```

### run

```kotlin
val result = "Hello".run {
    println(this)
    length
}
```

### with

```kotlin
val result = with(stringBuilder) {
    append("Hello")
    append(" World")
    toString()
}
```

### apply

```kotlin
val person = Person().apply {
    name = "John"
    age = 30
}
```

### also

```kotlin
val result = "Hello".also {
    println("The value is $it")
}
```

## Exception Handling

### Try-Catch

```kotlin
try {
    riskyOperation()
} catch (e: SpecificException) {
    handleSpecific(e)
} catch (e: Exception) {
    handleGeneral(e)
} finally {
    cleanup()
}
```

### Try as Expression

```kotlin
val result = try {
    parse(input)
} catch (e: NumberFormatException) {
    null
}
```

## Basic I/O

### Reading Input

```kotlin
val input = readLine()
val number = readLine()?.toIntOrNull()
```

### Printing Output

```kotlin
println("Hello World")
print("No newline")
printf("Formatted %s %d", "text", 42)
```

## Common Patterns

### Destructuring

```kotlin
val (name, age) = person
val (first, second) = pair
val (_, second) = pair  // Ignore first
```

### Creating Pairs and Triples

```kotlin
val pair = "key" to "value"
val pair2 = Pair("key", "value")
val triple = Triple("a", "b", "c")
```

### Validation

```kotlin
require(condition) { "Condition must be true" }
check(condition) { "State must be valid" }
error("This should not happen")
```

## Performance Tips

Use `when` instead of multiple `if-else` chains
Prefer `val` over `var` when possible
Use appropriate collection types (List vs Set vs Map)
Consider using `sequence` for large data processing
Use `inline` functions for higher-order functions called frequently
