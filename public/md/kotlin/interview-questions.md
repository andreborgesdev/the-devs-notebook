# Kotlin Interview Questions

## **Core Kotlin**

### **What is Kotlin and how is it different from Java?**

Kotlin is a statically-typed, JVM-based programming language developed by JetBrains. It’s more concise, null-safe, supports functional programming features, and offers modern constructs like coroutines.

### **What are the key features of Kotlin?**

- Null safety
- Data classes
- Extension functions
- Coroutines
- Smart casting
- Interoperability with Java
- Sealed classes

### **What is null safety in Kotlin?**

Kotlin’s type system distinguishes between nullable (`String?`) and non-nullable (`String`) types, preventing NullPointerExceptions at compile time.

### **What are data classes?**

Classes intended to hold data. They automatically generate methods like `equals()`, `hashCode()`, `toString()`, `copy()`, and destructuring declarations.

```kotlin
data class User(val name: String, val age: Int)
```

### **What are extension functions?**

Functions added to existing classes without modifying their code.

```kotlin
fun String.lastChar(): Char = this[this.length - 1]
```

### **What is a companion object?**

A singleton object inside a class that allows defining methods and properties tied to the class rather than to instances.

```kotlin
class MyClass {
    companion object {
        val id = "123"
    }
}
```

### **What is the difference between `val` and `var`?**

- `val`: Immutable reference (cannot be reassigned).
- `var`: Mutable reference (can be reassigned).

## **Advanced Kotlin**

### **What are coroutines in Kotlin?**

Lightweight threads for asynchronous programming. They simplify concurrent code and are managed by the Kotlin runtime, not the OS.

### **What is the difference between `launch` and `async`?**

- `launch`: Returns a `Job` (used for background tasks without a result).
- `async`: Returns a `Deferred` (used for background tasks that produce a result).

### **Explain sealed classes.**

A sealed class restricts class hierarchies, allowing the compiler to know all subclasses at compile time. Useful in `when` expressions for exhaustive checks.

```kotlin
sealed class Result
data class Success(val data: String) : Result()
object Error : Result()
```

### **What are inline functions?**

Functions marked with `inline` are expanded at call sites to avoid function call overhead, useful especially with lambdas.

```kotlin
inline fun doSomething(action: () -> Unit) {
    action()
}
```

### **Explain higher-order functions in Kotlin.**

Functions that take functions as parameters or return functions.

```kotlin
fun operate(x: Int, y: Int, op: (Int, Int) -> Int): Int = op(x, y)
```

### **What is delegation in Kotlin?**

Kotlin allows delegation of interface implementation to another object using `by`.

```kotlin
interface Printer {
    fun print()
}

class MyPrinter : Printer {
    override fun print() = println("Printing...")
}

class PrinterUser(printer: Printer) : Printer by printer
```

### **What is destructuring declaration?**

A concise syntax for unpacking data from objects.

```kotlin
val (name, age) = User("Alice", 25)
```

### **What is typealias in Kotlin?**

Creates an alias for a type, improving readability.

```kotlin
typealias UserMap = Map<String, User>
```

## **Interop & Platform-Specific**

### **How does Kotlin interoperate with Java?**

Kotlin is fully interoperable with Java. You can call Java code from Kotlin and vice versa. Annotations like `@JvmStatic`, `@JvmOverloads` and `@JvmField` help customize JVM interoperability.

### **What is Kotlin Multiplatform?**

A way to share code between platforms (JVM, JS, Native, Android, iOS) while writing platform-specific code where needed.

### **Explain the use of the `expect` and `actual` keywords.**

Used in Kotlin Multiplatform projects to declare platform-agnostic code (`expect`) and provide platform-specific implementations (`actual`).

### **What is the purpose of `lateinit` and `lazy`?**

- `lateinit`: Delays property initialization (non-nullable var).
- `lazy`: Delays value computation until it’s first accessed (immutable val).

```kotlin
val value: String by lazy { "Computed once" }
```

## **Functional Programming in Kotlin**

### **Is Kotlin a functional language?**

Kotlin is not purely functional but supports functional programming paradigms like immutability, higher-order functions, lambdas, and more.

### **What are lambdas in Kotlin?**

Anonymous functions used as values.

```kotlin
val sum = { x: Int, y: Int -> x + y }
```

### **What is the difference between `filter`, `map`, and `flatMap`?**

- `filter`: Returns elements matching a condition.
- `map`: Transforms each element.
- `flatMap`: Flattens the results of applying a function that returns iterables.

## **Best Practices & Patterns**

### **What is scope function? Name a few.**

Functions that execute a block of code in the context of an object:

- `let`
- `run`
- `with`
- `apply`
- `also`

```kotlin
person?.let { println(it.name) }
```

### **What is smart casting?**

Kotlin automatically casts a variable to its target type when the compiler can prove the cast is safe.

```kotlin
if (obj is String) {
    println(obj.length) // Smart cast
}
```

### **What is the difference between `==` and `===` in Kotlin?**

- `==`: Structural equality (calls `equals()`).
- `===`: Referential equality (checks if both references point to the same object).

## **Concurrency**

### **What is the difference between blocking and suspending functions?**

- Blocking functions block the thread.
- Suspending functions (`suspend`) allow the thread to perform other work while waiting for completion.

## **Testing & Tooling**

### **What testing frameworks are commonly used with Kotlin?**

- JUnit (JUnit 4, JUnit 5)
- TestNG
- KotlinTest / Kotest
- MockK

## **DSLs (Domain-Specific Languages)**

### **What are Kotlin DSLs and why are they used?**

Kotlin DSLs are mini-languages designed for a specific domain, improving readability and expressiveness. Kotlin enables DSL creation using:

- Extension functions
- Lambdas with receivers
- Infix functions
- Type-safe builders (e.g., `Gradle Kotlin DSL`, `HTML builders`)

### **What are Type-Safe Builders in Kotlin?**

A Type-Safe Builder leverages Kotlin’s DSL features to allow nested structure building while enforcing compile-time type safety (e.g., `HTML` and `Anko` DSLs).

## **Coroutines (Advanced)**

### **What is structured concurrency in Kotlin?**

Structured concurrency ensures that coroutines run within a defined scope. When the scope is cancelled, all its child coroutines are also cancelled. This avoids resource leaks.

### **What are Coroutine Channels?**

Channels are **concurrency-safe** communication primitives for sending and receiving data between coroutines, similar to queues but designed for coroutines.

Example:

```kotlin
val channel = Channel<Int>()
launch { channel.send(5) }
launch { println(channel.receive()) }
```

### **What is the difference between BroadcastChannel, SharedFlow, and StateFlow?**

- `BroadcastChannel` (deprecated) allowed multicasting values to multiple subscribers.
- `SharedFlow` replaces it and provides a hot stream for multicasting.
- `StateFlow` is a hot flow that emits the current and new states, similar to `LiveData`.

## **Flow (Advanced)**

### **What are cold and hot Flows?**

- **Cold Flows** start emitting when collected (`flow { ... }`).
- **Hot Flows** emit values regardless of collectors (`SharedFlow`, `StateFlow`).

### **What is backpressure and how does Flow handle it?**

Backpressure occurs when data is produced faster than it can be consumed. `Flow` supports backpressure naturally using `suspend` functions and operators like `buffer()` and `conflate()`.

### **Difference between Flow and LiveData?**

`Flow` is Kotlin-native and supports coroutines, operators, and better cancellation, whereas `LiveData` is Android-specific and lifecycle-aware.

## **Inline Classes / Value Classes**

### **What are Inline Classes?**

Inline Classes (renamed **Value Classes** in Kotlin 1.5) wrap a single value without the overhead of an object at runtime. They are ideal for creating **type-safe wrappers** with no memory overhead.

Example:

```kotlin
@JvmInline
value class UserId(val value: String)
```

### **Limitations of Inline/Value Classes?**

- Cannot have mutable properties.
- Can only wrap a single value.
- Some restrictions with generics and inheritance.

## **Contracts**

### **What are Kotlin Contracts?**

Contracts give the compiler additional information about the behavior of functions. They help improve smart casting and null checks.

Example:

```kotlin
fun requireNotNull(value: String?): String {
    contract { returns() implies (value != null) }
    return value ?: throw IllegalArgumentException()
}
```

### **Use cases for Contracts?**

- Improving smart-cast in custom checks.
- Reducing boilerplate around null checks and type checks.

## **Advanced Language Features**

### **What is delegation in Kotlin?**

Delegation allows an object to hand off implementation to another object using the `by` keyword.

Example:

```kotlin
class Logger by ConsoleLogger()
```

### **What are sealed interfaces and classes?**

Sealed types restrict class hierarchies to a known set at compile time, improving exhaustiveness checks in `when` expressions.

### **What are Context Receivers (Kotlin 2.0 feature)?**

They allow functions and properties to operate within a context, reducing the need for multiple receiver lambdas or explicit parameters.

```kotlin
context(User)
fun greet() = println("Hello, ${this.name}")
```

## **Multiplatform & KSP**

### **What is Kotlin Multiplatform (KMP)?**

KMP allows sharing common code between platforms (Android, iOS, web, etc.) while providing platform-specific implementations when needed.

### **What is Kotlin Symbol Processing (KSP)?**

KSP is a Kotlin compiler plugin for annotation processing. It's faster and more Kotlin-friendly than KAPT and is now the standard for code generation.

## **Miscellaneous Advanced Topics**

### **Difference between inline, noinline, and crossinline?**

- **inline**: Inlines function calls.
- **noinline**: Prevents inlining for a specific lambda.
- **crossinline**: Allows inlining but prevents non-local returns.

### **What is reified type and where is it used?**

With `reified` in inline functions, the actual type can be accessed at runtime without needing reflection.

```kotlin
inline fun <reified T> Gson.fromJson(json: String): T =
    this.fromJson(json, T::class.java)
```

### **Explain `suspendCoroutine` and `suspendCancellableCoroutine`.**

- `suspendCoroutine`: Converts a callback-based API into a suspend function.
- `suspendCancellableCoroutine`: Similar but also supports cancellation.

### **What is the difference between runBlocking and launch?**

`runBlocking` blocks the current thread until completion — useful for bridging regular and suspend code. `launch` starts a coroutine without blocking the thread.

## **Key Patterns and Best Practices**

- **Favor Flow over Channels** for stream-like data.
- **Use StateFlow for state management**.
- **Avoid GlobalScope in production code**.
- **Use sealed classes/interfaces for representing state hierarchies.**
- **Prefer Value Classes for type-safe wrappers**.
- **Keep contracts simple** as complex contracts can hinder readability and maintenance.
