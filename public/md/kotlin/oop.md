# Kotlin Object-Oriented Programming

## Classes and Objects

### Basic Class Definition

```kotlin
class Person(val firstName: String, val lastName: String) {
    var age: Int = 0

    init {
        println("Person created: $firstName $lastName")
    }

    constructor(firstName: String, lastName: String, age: Int) : this(firstName, lastName) {
        this.age = age
    }

    fun getFullName() = "$firstName $lastName"
}
```

### Properties

```kotlin
class Rectangle(width: Int, height: Int) {
    val area: Int
        get() = width * height

    var width: Int = width
        set(value) {
            if (value > 0) field = value
        }

    var height: Int = height
        private set
}
```

### Data Classes

```kotlin
data class User(
    val id: Long,
    val name: String,
    val email: String
) {
    fun domain() = email.substringAfter("@")
}

val user1 = User(1, "John", "john@example.com")
val user2 = user1.copy(name = "Jane")
val (id, name, email) = user1
```

### Sealed Classes

```kotlin
sealed class Result<out T>
data class Success<T>(val data: T) : Result<T>()
data class Error(val exception: Throwable) : Result<Nothing>()
object Loading : Result<Nothing>()

fun handleResult(result: Result<String>) = when (result) {
    is Success -> "Data: ${result.data}"
    is Error -> "Error: ${result.exception.message}"
    Loading -> "Loading..."
}
```

### Enum Classes

```kotlin
enum class Direction(val degrees: Int) {
    NORTH(0),
    EAST(90),
    SOUTH(180),
    WEST(270);

    fun opposite() = when (this) {
        NORTH -> SOUTH
        SOUTH -> NORTH
        EAST -> WEST
        WEST -> EAST
    }
}
```

## Inheritance

### Open Classes and Override

```kotlin
open class Animal(val name: String) {
    open fun sound() = "Some sound"
    open val legs: Int = 4
}

class Dog(name: String) : Animal(name) {
    override fun sound() = "Woof!"
    override val legs = 4
}

class Spider(name: String) : Animal(name) {
    override val legs = 8
}
```

### Abstract Classes

```kotlin
abstract class Shape {
    abstract val area: Double
    abstract fun perimeter(): Double

    fun describe() = "Shape with area $area"
}

class Circle(val radius: Double) : Shape() {
    override val area = Math.PI * radius * radius
    override fun perimeter() = 2 * Math.PI * radius
}
```

## Interfaces

### Basic Interface

```kotlin
interface Drawable {
    fun draw()
    fun resize(factor: Double) {
        println("Resizing by factor $factor")
    }
}

interface Clickable {
    fun click()
    fun showTooltip() = println("Tooltip")
}

class Button : Drawable, Clickable {
    override fun draw() = println("Drawing button")
    override fun click() = println("Button clicked")
}
```

### Interface with Properties

```kotlin
interface Named {
    val name: String
    val displayName: String
        get() = name.uppercase()
}

class Person(override val name: String) : Named
```

## Delegation

### Class Delegation

```kotlin
interface Repository {
    fun save(data: String)
    fun load(): String
}

class FileRepository : Repository {
    override fun save(data: String) = println("Saving to file: $data")
    override fun load() = "File data"
}

class CachedRepository(
    private val repository: Repository
) : Repository by repository {

    private var cache: String? = null

    override fun load(): String {
        return cache ?: repository.load().also { cache = it }
    }
}
```

### Property Delegation

```kotlin
class LazyExample {
    val expensiveValue: String by lazy {
        println("Computing expensive value...")
        "Computed result"
    }
}

class ObservableExample {
    var name: String by Delegates.observable("Initial") { property, old, new ->
        println("$property changed from $old to $new")
    }
}
```

## Companion Objects

### Static-like Members

```kotlin
class MathUtils {
    companion object {
        const val PI = 3.14159

        fun max(a: Int, b: Int) = if (a > b) a else b

        @JvmStatic
        fun min(a: Int, b: Int) = if (a < b) a else b
    }
}

val max = MathUtils.max(5, 3)
val pi = MathUtils.PI
```

### Factory Pattern

```kotlin
class User private constructor(val id: Long, val name: String) {
    companion object {
        fun create(name: String): User {
            val id = generateId()
            return User(id, name)
        }

        private fun generateId() = System.currentTimeMillis()
    }
}
```

## Nested and Inner Classes

### Nested Classes

```kotlin
class Outer {
    private val outerProperty = "Outer"

    class Nested {
        fun doSomething() = "Nested class function"
    }

    inner class Inner {
        fun accessOuter() = outerProperty
    }
}

val nested = Outer.Nested()
val inner = Outer().Inner()
```

## Object Expressions and Declarations

### Object Expressions (Anonymous Objects)

```kotlin
val clickListener = object : ClickListener {
    override fun onClick() {
        println("Clicked!")
    }
}

val comparator = object : Comparator<String> {
    override fun compare(a: String, b: String) = a.length.compareTo(b.length)
}
```

### Object Declarations (Singletons)

```kotlin
object DatabaseConnection {
    fun connect() = println("Connected to database")
    fun disconnect() = println("Disconnected from database")
}

object StringUtils {
    fun reverse(input: String) = input.reversed()
    fun isPalindrome(input: String) = input == input.reversed()
}
```

## Visibility Modifiers

| Modifier    | Class Members                   | Top-level             |
| ----------- | ------------------------------- | --------------------- |
| `public`    | Visible everywhere              | Visible everywhere    |
| `private`   | Visible within class            | Visible within file   |
| `protected` | Visible in class and subclasses | Not applicable        |
| `internal`  | Visible within module           | Visible within module |

```kotlin
class Example {
    public val publicProperty = "Public"
    private val privateProperty = "Private"
    protected val protectedProperty = "Protected"
    internal val internalProperty = "Internal"

    private fun privateFunction() { }
    protected open fun protectedFunction() { }
    internal fun internalFunction() { }
}
```

## Extension Functions and Properties

### Extension Functions

```kotlin
fun String.removeSpaces() = this.replace(" ", "")
fun List<Int>.average() = this.sum().toDouble() / this.size
fun <T> List<T>.secondOrNull() = if (size >= 2) this[1] else null

"Hello World".removeSpaces()
listOf(1, 2, 3, 4).average()
```

### Extension Properties

```kotlin
val String.lastIndex: Int
    get() = this.length - 1

val <T> List<T>.lastIndex: Int
    get() = size - 1
```

### Member vs Extension

```kotlin
class Example {
    fun memberFunction() = "Member"
}

fun Example.memberFunction() = "Extension"
fun Example.extensionFunction() = "Extension only"

val example = Example()
example.memberFunction()    // Calls member function
example.extensionFunction() // Calls extension function
```

## Generic Classes and Functions

### Generic Classes

```kotlin
class Box<T>(private val item: T) {
    fun get(): T = item
    fun isEmpty() = false
}

class Pair<A, B>(val first: A, val second: B)

val stringBox = Box("Hello")
val intBox = Box(42)
val pair = Pair("Key", 123)
```

### Generic Functions

```kotlin
fun <T> singletonList(item: T): List<T> = listOf(item)
fun <T> List<T>.swap(index1: Int, index2: Int): List<T> {
    val mutable = this.toMutableList()
    val tmp = mutable[index1]
    mutable[index1] = mutable[index2]
    mutable[index2] = tmp
    return mutable
}
```

### Type Constraints

```kotlin
fun <T : Comparable<T>> sort(list: List<T>): List<T> = list.sorted()
fun <T> copyWhenGreater(list: List<T>, threshold: T): List<T>
    where T : Comparable<T>, T : Number = list.filter { it > threshold }
```

### Variance

```kotlin
interface Producer<out T> {
    fun produce(): T
}

interface Consumer<in T> {
    fun consume(item: T)
}

class Box<T>(private val item: T) : Producer<T>, Consumer<T> {
    override fun produce(): T = item
    override fun consume(item: T) { }
}
```

## Design Patterns with Kotlin

### Builder Pattern

```kotlin
class HttpRequest private constructor(
    val url: String,
    val method: String,
    val headers: Map<String, String>,
    val body: String?
) {
    class Builder {
        private var url: String = ""
        private var method: String = "GET"
        private var headers: MutableMap<String, String> = mutableMapOf()
        private var body: String? = null

        fun url(url: String) = apply { this.url = url }
        fun method(method: String) = apply { this.method = method }
        fun header(key: String, value: String) = apply { headers[key] = value }
        fun body(body: String) = apply { this.body = body }

        fun build() = HttpRequest(url, method, headers, body)
    }

    companion object {
        fun builder() = Builder()
    }
}
```

### Observer Pattern

```kotlin
interface Observer<T> {
    fun onChanged(value: T)
}

class Observable<T>(private var value: T) {
    private val observers = mutableListOf<Observer<T>>()

    fun addObserver(observer: Observer<T>) {
        observers.add(observer)
    }

    fun setValue(newValue: T) {
        value = newValue
        observers.forEach { it.onChanged(newValue) }
    }
}
```

## Common OOP Interview Questions

**Q: What's the difference between abstract classes and interfaces?**

- Abstract classes can have state and concrete implementations
- Interfaces are purely contracts (except default implementations)
- A class can implement multiple interfaces but extend only one abstract class

**Q: When to use data classes vs regular classes?**

- Use data classes for simple data containers
- Use regular classes when you need complex behavior or inheritance

**Q: What's the difference between object expressions and object declarations?**

- Object expressions create anonymous instances
- Object declarations create singletons

**Q: How does Kotlin handle multiple inheritance conflicts?**

- Use explicit override and super calls
- Compiler requires explicit resolution of conflicts
