# Kotlin Functional Programming

## Functional Programming Philosophy

**Kotlin seamlessly blends object-oriented and functional programming paradigms.** While not a purely functional language, Kotlin provides powerful functional features that enable cleaner, more maintainable code through immutability, higher-order functions, and declarative programming styles.

**Core Functional Concepts:**

- **Immutability**: Prefer `val` over `var`, use immutable collections
- **Pure Functions**: Functions without side effects that always return the same output for the same input
- **Higher-Order Functions**: Functions that take other functions as parameters or return functions
- **Function Composition**: Building complex operations by combining simpler functions
- **Declarative Style**: Describing what you want rather than how to achieve it

**Benefits of Functional Programming in Kotlin:**

- **Reduced Bugs**: Immutable data prevents many common errors
- **Better Testability**: Pure functions are easier to test
- **Parallel Processing**: Immutable data is naturally thread-safe
- **Code Reusability**: Higher-order functions enable generic, reusable components
- **Readability**: Declarative code is often more self-documenting

**When to Use Functional Approaches:**

- Data transformations (mapping, filtering, reducing)
- Event handling and reactive programming
- Concurrent programming scenarios
- Complex business logic that benefits from composition
- Anywhere immutability and predictability are important

## First-Class Functions

**Functions in Kotlin are first-class citizens.** They can be stored in variables, passed as arguments, returned from other functions, and created at runtime. This enables powerful abstractions and flexible code design.

**Function Type Syntax:**

- `(ParameterTypes) -> ReturnType`
- `() -> Unit` for functions with no parameters returning nothing
- `(String, Int) -> Boolean` for functions taking String and Int, returning Boolean
- Function types can be nullable: `((Int) -> String)?`

### Function Types

```kotlin
val add: (Int, Int) -> Int = { x, y -> x + y }
val greet: (String) -> String = { "Hello, $it!" }
val log: () -> Unit = { println("Logging...") }

fun processNumbers(numbers: List<Int>, operation: (Int) -> Int): List<Int> {
    return numbers.map(operation)
}
```

### Function References

```kotlin
fun double(x: Int) = x * 2
fun String.exclaim() = "$this!"

val numbers = listOf(1, 2, 3, 4)
val doubled = numbers.map(::double)
val strings = listOf("hello", "world")
val exclaimed = strings.map(String::exclaim)
```

## Lambda Expressions

### Basic Lambda Syntax

```kotlin
val lambda = { x: Int, y: Int -> x + y }
val shortLambda: (Int) -> Int = { it * 2 }

listOf(1, 2, 3).forEach { println(it) }
listOf(1, 2, 3).map { it * 2 }
listOf(1, 2, 3).filter { it > 1 }
```

### Lambda with Receivers

```kotlin
val buildString = StringBuilder().apply {
    append("Hello")
    append(" ")
    append("World")
}.toString()

val html = html {
    head {
        title { +"My Page" }
    }
    body {
        h1 { +"Welcome" }
        p { +"This is a paragraph" }
    }
}
```

## Higher-Order Functions

### Functions Returning Functions

```kotlin
fun multiplier(factor: Int): (Int) -> Int {
    return { number -> number * factor }
}

val double = multiplier(2)
val triple = multiplier(3)
println(double(5))  // 10
println(triple(5))  // 15
```

### Functions with Function Parameters

```kotlin
fun <T, R> List<T>.mapIndexed(transform: (index: Int, T) -> R): List<R> {
    val result = mutableListOf<R>()
    for (i in indices) {
        result.add(transform(i, this[i]))
    }
    return result
}

val indexed = listOf("a", "b", "c").mapIndexed { index, value -> "$index: $value" }
```

## Collection Operations

### Transformation Operations

```kotlin
val numbers = listOf(1, 2, 3, 4, 5)

val doubled = numbers.map { it * 2 }
val strings = numbers.map { "Number: $it" }
val flattened = listOf(listOf(1, 2), listOf(3, 4)).flatten()
val flatMapped = listOf("hello", "world").flatMap { it.toList() }
```

### Filtering Operations

```kotlin
val numbers = listOf(1, 2, 3, 4, 5, 6)

val evens = numbers.filter { it % 2 == 0 }
val odds = numbers.filterNot { it % 2 == 0 }
val notNull = listOf(1, null, 2, null, 3).filterNotNull()
val indexed = numbers.filterIndexed { index, value -> index % 2 == 0 }
```

### Aggregation Operations

```kotlin
val numbers = listOf(1, 2, 3, 4, 5)

val sum = numbers.sum()
val average = numbers.average()
val max = numbers.maxOrNull()
val min = numbers.minOrNull()
val count = numbers.count { it > 3 }

val customSum = numbers.fold(0) { acc, n -> acc + n }
val customProduct = numbers.reduce { acc, n -> acc * n }
```

### Grouping Operations

```kotlin
val words = listOf("apple", "banana", "apricot", "blueberry")

val grouped = words.groupBy { it.first() }
val partitioned = words.partition { it.startsWith("a") }
val chunked = (1..10).chunked(3)
```

## Sequences

### Lazy Evaluation

```kotlin
val sequence = sequence {
    println("Generating...")
    for (i in 1..5) {
        yield(i * i)
    }
}

val result = sequence
    .filter { it > 5 }
    .map { it * 2 }
    .take(2)
    .toList()
```

### Performance Benefits

```kotlin
val largeList = (1..1_000_000).toList()

val listResult = largeList
    .map { it * 2 }
    .filter { it > 1000 }
    .take(10)

val sequenceResult = largeList.asSequence()
    .map { it * 2 }
    .filter { it > 1000 }
    .take(10)
    .toList()
```

## Currying and Partial Application

### Manual Currying

```kotlin
fun add(x: Int) = { y: Int -> x + y }
fun multiply(x: Int) = { y: Int -> { z: Int -> x * y * z } }

val add5 = add(5)
val result = add5(3)  // 8

val multiplyBy2And3 = multiply(2)(3)
val finalResult = multiplyBy2And3(4)  // 24
```

### Partial Application Helper

```kotlin
fun <A, B, C> ((A, B) -> C).partial1(a: A): (B) -> C = { b -> this(a, b) }
fun <A, B, C> ((A, B) -> C).partial2(b: B): (A) -> C = { a -> this(a, b) }

val add = { x: Int, y: Int -> x + y }
val add5 = add.partial1(5)
val addTo10 = add.partial2(10)
```

## Function Composition

### Basic Composition

```kotlin
infix fun <A, B, C> ((B) -> C).compose(f: (A) -> B): (A) -> C {
    return { a -> this(f(a)) }
}

val addOne = { x: Int -> x + 1 }
val double = { x: Int -> x * 2 }
val addOneThenDouble = double compose addOne

println(addOneThenDouble(5))  // 12
```

### Pipeline Operator

```kotlin
infix fun <T, R> T.pipe(f: (T) -> R): R = f(this)

val result = 5
    .pipe { it + 1 }
    .pipe { it * 2 }
    .pipe { "Result: $it" }
```

## Immutability

### Immutable Data Structures

```kotlin
data class Person(val name: String, val age: Int, val addresses: List<String>) {
    fun withName(newName: String) = copy(name = newName)
    fun withAge(newAge: Int) = copy(age = newAge)
    fun addAddress(address: String) = copy(addresses = addresses + address)
}

val person = Person("John", 30, listOf("123 Main St"))
val updatedPerson = person.withAge(31).addAddress("456 Oak Ave")
```

### Copy and Modify Pattern

```kotlin
fun List<Int>.updateAt(index: Int, value: Int): List<Int> {
    return this.toMutableList().apply { this[index] = value }
}

fun Map<String, Int>.updateValue(key: String, value: Int): Map<String, Int> {
    return this.toMutableMap().apply { this[key] = value }
}
```

## Monads and Functional Patterns

### Maybe/Option Pattern

```kotlin
sealed class Maybe<out T> {
    object None : Maybe<Nothing>()
    data class Some<T>(val value: T) : Maybe<T>()

    fun <R> map(f: (T) -> R): Maybe<R> = when (this) {
        is None -> None
        is Some -> Some(f(value))
    }

    fun <R> flatMap(f: (T) -> Maybe<R>): Maybe<R> = when (this) {
        is None -> None
        is Some -> f(value)
    }

    fun getOrElse(default: T): T = when (this) {
        is None -> default
        is Some -> value
    }
}
```

### Result Pattern

```kotlin
sealed class Result<out T, out E> {
    data class Success<T>(val value: T) : Result<T, Nothing>()
    data class Failure<E>(val error: E) : Result<Nothing, E>()

    fun <R> map(f: (T) -> R): Result<R, E> = when (this) {
        is Success -> Success(f(value))
        is Failure -> this
    }

    fun <R> flatMap(f: (T) -> Result<R, E>): Result<R, E> = when (this) {
        is Success -> f(value)
        is Failure -> this
    }
}
```

## Tail Recursion

### Basic Tail Recursion

```kotlin
tailrec fun factorial(n: Long, accumulator: Long = 1): Long {
    return if (n <= 1) accumulator
    else factorial(n - 1, n * accumulator)
}

tailrec fun fibonacci(n: Int, a: Long = 0, b: Long = 1): Long {
    return when (n) {
        0 -> a
        1 -> b
        else -> fibonacci(n - 1, b, a + b)
    }
}
```

### Tail Recursive List Operations

```kotlin
tailrec fun <T> List<T>.sumTailRec(accumulator: Int = 0): Int {
    return if (isEmpty()) accumulator
    else drop(1).sumTailRec(accumulator + first() as Int)
}

tailrec fun <T> List<T>.reverseTailRec(accumulator: List<T> = emptyList()): List<T> {
    return if (isEmpty()) accumulator
    else drop(1).reverseTailRec(listOf(first()) + accumulator)
}
```

## Function Builders and DSLs

### Simple DSL

```kotlin
class SqlBuilder {
    private val conditions = mutableListOf<String>()

    fun where(condition: String) {
        conditions.add(condition)
    }

    fun build() = "SELECT * FROM table WHERE ${conditions.joinToString(" AND ")}"
}

fun sql(builder: SqlBuilder.() -> Unit): String {
    return SqlBuilder().apply(builder).build()
}

val query = sql {
    where("age > 18")
    where("name IS NOT NULL")
}
```

### Type-Safe Builder

```kotlin
@DslMarker
annotation class HtmlDsl

@HtmlDsl
class HtmlElement(val name: String) {
    private val children = mutableListOf<HtmlElement>()
    private val attributes = mutableMapOf<String, String>()

    operator fun String.unaryPlus() {
        children.add(HtmlElement("text").apply {
            attributes["content"] = this@unaryPlus
        })
    }

    fun element(name: String, init: HtmlElement.() -> Unit) {
        children.add(HtmlElement(name).apply(init))
    }
}

fun html(init: HtmlElement.() -> Unit) = HtmlElement("html").apply(init)
fun HtmlElement.head(init: HtmlElement.() -> Unit) = element("head", init)
fun HtmlElement.body(init: HtmlElement.() -> Unit) = element("body", init)
```

## Advanced Functional Concepts

### Memoization

```kotlin
class Memoize<T, R>(private val f: (T) -> R) : (T) -> R {
    private val cache = mutableMapOf<T, R>()

    override operator fun invoke(x: T): R {
        return cache.getOrPut(x) { f(x) }
    }
}

fun <T, R> ((T) -> R).memoize(): (T) -> R = Memoize(this)

val memoizedFib = { n: Int ->
    if (n <= 1) n.toLong() else memoizedFib(n - 1) + memoizedFib(n - 2)
}.memoize()
```

### Lazy Evaluation

```kotlin
class Lazy<T>(private val initializer: () -> T) {
    private var _value: T? = null
    private var initialized = false

    val value: T
        get() {
            if (!initialized) {
                _value = initializer()
                initialized = true
            }
            return _value!!
        }
}

fun <T> lazy(initializer: () -> T) = Lazy(initializer)
```

## Functional Programming Best Practices

### Prefer Pure Functions

```kotlin
fun impure(list: MutableList<Int>) {
    list.add(1)  // Modifies input
}

fun pure(list: List<Int>): List<Int> {
    return list + 1  // Returns new list
}
```

### Use Immutable Data

```kotlin
val mutableState = mutableListOf<String>()
val immutableState = listOf<String>()

fun updateState(current: List<String>, newItem: String): List<String> {
    return current + newItem
}
```

### Function Composition over Inheritance

```kotlin
val processors = listOf<(String) -> String>(
    { it.trim() },
    { it.lowercase() },
    { it.replace(" ", "_") }
)

fun processString(input: String): String {
    return processors.fold(input) { acc, processor -> processor(acc) }
}
```

### Error Handling with Functional Patterns

```kotlin
fun divide(a: Double, b: Double): Result<Double, String> {
    return if (b == 0.0) {
        Result.Failure("Division by zero")
    } else {
        Result.Success(a / b)
    }
}

val result = divide(10.0, 2.0)
    .map { it * 2 }
    .flatMap { divide(it, 3.0) }
```
