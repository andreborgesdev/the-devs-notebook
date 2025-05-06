# Kotlin

## What is Kotlin?

Kotlin is a **modern, statically typed programming language** developed by JetBrains. It runs on the **Java Virtual Machine (JVM)** and can be compiled to JavaScript or native code. Kotlin is fully interoperable with Java and has become a first-class language for Android development.

Kotlin combines **object-oriented** and **functional programming** features, providing concise syntax, null safety, and modern programming paradigms.

## Why Kotlin?

- **Concise**: Reduces boilerplate code significantly compared to Java
- **Safe**: Null safety built into the language
- **Interoperable**: Fully interoperable with existing Java codebases
- **Tool-friendly**: Compatible with all major IDEs (especially IntelliJ IDEA and Android Studio)
- **Modern**: Supports functional programming features, coroutines, and extension functions

## Key Features

| Feature                 | Description                                               |
| ----------------------- | --------------------------------------------------------- |
| **Null Safety**         | Type system distinguishes nullable and non-nullable types |
| **Extension Functions** | Ability to extend existing classes with new functionality |
| **Smart Casts**         | Compiler automatically casts types when safe              |
| **Data Classes**        | Boilerplate-free classes for data containers              |
| **Coroutines**          | Asynchronous programming with lightweight threads         |
| **Type Inference**      | Reduces need for explicit type declarations               |
| **Interoperability**    | Seamless integration with Java libraries and frameworks   |

## Basic Syntax

### Hello World

```kotlin
fun main() {
    println("Hello, Kotlin!")
}
```

### Variables

```kotlin
val name = "Alice"  // Immutable
var age = 30        // Mutable
```

### Functions

```kotlin
fun add(a: Int, b: Int): Int {
    return a + b
}
```

### Conditional Expression

```kotlin
val max = if (a > b) a else b
```

### When Expression (Switch alternative)

```kotlin
val result = when (x) {
    1 -> "One"
    2 -> "Two"
    else -> "Other"
}
```

## Object-Oriented Programming in Kotlin

```kotlin
open class Animal(val name: String) {
    open fun sound() = "Some sound"
}

class Dog(name: String) : Animal(name) {
    override fun sound() = "Bark"
}
```

## Functional Programming in Kotlin

### Lambda Expressions

```kotlin
val double = { x: Int -> x * 2 }
println(double(4))  // Output: 8
```

### Higher-Order Functions

```kotlin
fun operate(x: Int, y: Int, op: (Int, Int) -> Int): Int {
    return op(x, y)
}

val sum = operate(3, 4) { a, b -> a + b }
```

## Null Safety

```kotlin
var name: String? = null
println(name?.length)  // Safe call operator
```

## Coroutines (Asynchronous Programming)

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
    launch {
        delay(1000L)
        println("World!")
    }
    println("Hello,")
}
```

## Extension Functions

```kotlin
fun String.reverse(): String = this.reversed()

println("Kotlin".reverse())  // Output: ntiloK
```

## Data Classes

```kotlin
data class User(val name: String, val age: Int)

val user = User("Bob", 25)
println(user)  // User(name=Bob, age=25)
```

## Interoperability with Java

```kotlin
// Calling a Java method from Kotlin
val list = ArrayList<String>()
list.add("Kotlin")
```

## Common Use Cases

- **Android development** (official language supported by Google)
- **Server-side development** (Spring Boot + Kotlin)
- **Data science** (KotlinDL, Kotlin Jupyter)
- **Cross-platform apps** (Kotlin Multiplatform Mobile - KMM)

## Comparison: Kotlin vs Java

| Feature          | Kotlin                        | Java                               |
| ---------------- | ----------------------------- | ---------------------------------- |
| Null Safety      | Built-in                      | Optional with additional libraries |
| Conciseness      | More concise                  | Verbose                            |
| Extension Funcs  | Supported                     | Not natively supported             |
| Coroutines       | Built-in                      | Requires third-party libraries     |
| Type Inference   | Yes                           | Limited                            |
| Interoperability | Fully interoperable with Java | Native                             |

## Summary

Kotlin is a modern language that improves upon Java by providing features like null safety, concise syntax, functional programming constructs, and coroutines for asynchronous programming. It is highly suitable for Android, server-side, and cross-platform development while maintaining full Java interoperability.
