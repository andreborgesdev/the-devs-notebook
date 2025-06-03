# Kotlin Advanced Features

## Inline Functions

### Basic Inline Functions

```kotlin
inline fun <T> measureTime(block: () -> T): Pair<T, Long> {
    val start = System.currentTimeMillis()
    val result = block()
    val time = System.currentTimeMillis() - start
    return result to time
}

val (result, time) = measureTime {
    expensiveOperation()
}
```

### noinline Parameter

```kotlin
inline fun processData(
    data: List<String>,
    inline transform: (String) -> String,
    noinline logger: (String) -> Unit
) {
    data.forEach { item ->
        val transformed = transform(item)
        logger("Processed: $transformed")
    }
}
```

### crossinline Parameter

```kotlin
inline fun launchWithLogging(crossinline action: () -> Unit) {
    thread {
        println("Starting operation...")
        action()  // Cannot do non-local return here
        println("Operation completed")
    }
}
```

## Reified Type Parameters

### Basic Reified Usage

```kotlin
inline fun <reified T> isInstance(value: Any): Boolean {
    return value is T
}

inline fun <reified T> castOrNull(value: Any): T? {
    return value as? T
}

val isString = isInstance<String>("Hello")  // true
val number = castOrNull<Int>("Hello")       // null
```

### Reified with Reflection

```kotlin
import kotlin.reflect.full.*

inline fun <reified T : Any> getClassInfo(): String {
    val kClass = T::class
    return buildString {
        appendLine("Class: ${kClass.simpleName}")
        appendLine("Properties: ${kClass.memberProperties.map { it.name }}")
        appendLine("Functions: ${kClass.memberFunctions.map { it.name }}")
    }
}

data class User(val name: String, val age: Int)
println(getClassInfo<User>())
```

### Reified in Generic Functions

```kotlin
inline fun <reified T> fromJson(json: String): T {
    return when (T::class) {
        String::class -> json as T
        Int::class -> json.toInt() as T
        else -> throw IllegalArgumentException("Unsupported type")
    }
}

val name = fromJson<String>("\"John\"")
val age = fromJson<Int>("25")
```

## Delegation

### Class Delegation

```kotlin
interface Repository {
    fun save(data: String)
    fun load(): String
}

class DatabaseRepository : Repository {
    override fun save(data: String) = println("Saving to database: $data")
    override fun load() = "Database data"
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
import kotlin.properties.Delegates
import kotlin.reflect.KProperty

class LoggingDelegate<T>(initialValue: T) {
    private var value = initialValue

    operator fun getValue(thisRef: Any?, property: KProperty<*>): T {
        println("Getting ${property.name} = $value")
        return value
    }

    operator fun setValue(thisRef: Any?, property: KProperty<*>, value: T) {
        println("Setting ${property.name} = $value")
        this.value = value
    }
}

class Example {
    var name: String by LoggingDelegate("Initial")
    val lazyValue: String by lazy { "Computed once" }
    var observableValue: String by Delegates.observable("Initial") { prop, old, new ->
        println("${prop.name} changed from $old to $new")
    }
}
```

### Custom Map Delegation

```kotlin
class Person(map: Map<String, Any>) {
    val name: String by map
    val age: Int by map
    val email: String by map
}

val person = Person(mapOf(
    "name" to "John",
    "age" to 30,
    "email" to "john@example.com"
))
```

## Sealed Classes and Interfaces

### Sealed Classes for State Management

```kotlin
sealed class UiState<out T> {
    object Loading : UiState<Nothing>()
    data class Success<T>(val data: T) : UiState<T>()
    data class Error(val exception: Throwable) : UiState<Nothing>()
}

fun handleUiState(state: UiState<String>) = when (state) {
    is UiState.Loading -> "Loading..."
    is UiState.Success -> "Data: ${state.data}"
    is UiState.Error -> "Error: ${state.exception.message}"
}
```

### Sealed Interfaces (Kotlin 1.5+)

```kotlin
sealed interface Command
class MoveCommand(val direction: String) : Command
class AttackCommand(val target: String) : Command
object QuitCommand : Command

fun executeCommand(command: Command) = when (command) {
    is MoveCommand -> "Moving ${command.direction}"
    is AttackCommand -> "Attacking ${command.target}"
    QuitCommand -> "Quitting game"
}
```

### Nested Sealed Classes

```kotlin
sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()

    sealed class Error : Result<Nothing>() {
        object NetworkError : Error()
        object ParseError : Error()
        data class UnknownError(val message: String) : Error()
    }
}
```

## Value Classes (Inline Classes)

### Basic Value Classes

```kotlin
@JvmInline
value class UserId(val value: String)

@JvmInline
value class Email(val value: String) {
    init {
        require(value.contains("@")) { "Invalid email format" }
    }
}

fun processUser(id: UserId, email: Email) {
    println("Processing user ${id.value} with email ${email.value}")
}
```

### Value Classes with Methods

```kotlin
@JvmInline
value class Password(val value: String) {
    fun isStrong(): Boolean {
        return value.length >= 8 &&
               value.any { it.isDigit() } &&
               value.any { it.isUpperCase() }
    }

    fun hash(): String = value.hashCode().toString()
}

val password = Password("SecurePass123")
if (password.isStrong()) {
    println("Password hash: ${password.hash()}")
}
```

### Value Classes for Type Safety

```kotlin
@JvmInline
value class Meters(val value: Double)

@JvmInline
value class Seconds(val value: Double)

@JvmInline
value class MetersPerSecond(val value: Double)

fun calculateSpeed(distance: Meters, time: Seconds): MetersPerSecond {
    return MetersPerSecond(distance.value / time.value)
}

val speed = calculateSpeed(Meters(100.0), Seconds(10.0))
```

## Contracts

### Basic Contracts

```kotlin
import kotlin.contracts.*

fun requireNotNull(value: String?): String {
    contract {
        returns() implies (value != null)
    }
    return value ?: throw IllegalArgumentException("Value cannot be null")
}

fun processValue(input: String?) {
    val safeValue = requireNotNull(input)
    println(safeValue.length)  // Smart cast works here
}
```

### Contracts with Lambdas

```kotlin
inline fun <T> T.applyIf(condition: Boolean, block: T.() -> Unit): T {
    contract {
        callsInPlace(block, InvocationKind.AT_MOST_ONCE)
    }
    if (condition) {
        block()
    }
    return this
}

val result = "Hello"
    .applyIf(true) { println(this) }
    .applyIf(false) { println("This won't run") }
```

## Type Aliases

### Basic Type Aliases

```kotlin
typealias UserMap = Map<String, User>
typealias EventHandler = (Event) -> Unit
typealias ValidationResult = Either<List<ValidationError>, User>

val users: UserMap = mapOf("1" to User("John"))
val handler: EventHandler = { event -> println("Handling $event") }
```

### Generic Type Aliases

```kotlin
typealias Repository<T> = suspend (String) -> Result<T, DatabaseError>
typealias Cache<K, V> = MutableMap<K, V>

val userRepository: Repository<User> = { id ->
    try {
        Result.Success(fetchUser(id))
    } catch (e: Exception) {
        Result.Failure(DatabaseError.ConnectionFailed)
    }
}
```

## Extension Functions and Properties

### Advanced Extension Functions

```kotlin
fun <T> List<T>.second(): T = this[1]
fun <T> List<T>.secondOrNull(): T? = if (size >= 2) this[1] else null

fun String.isValidEmail(): Boolean {
    return this.contains("@") && this.contains(".")
}

fun <T> T.applyIf(condition: Boolean, block: T.() -> T): T {
    return if (condition) block() else this
}
```

### Extension Properties

```kotlin
val String.lastIndex: Int
    get() = this.length - 1

val <T> List<T>.lastIndex: Int
    get() = size - 1

var StringBuilder.lastChar: Char
    get() = this[length - 1]
    set(value) { this[length - 1] = value }
```

### Extensions on Nullable Types

```kotlin
fun String?.isNullOrEmpty(): Boolean = this == null || this.isEmpty()

fun <T> T?.ifNull(action: () -> Unit): T? {
    if (this == null) action()
    return this
}

val result = getValue()
    .ifNull { println("Value was null") }
    ?.process()
```

## DSL Construction

### HTML DSL Example

```kotlin
@DslMarker
annotation class HtmlDsl

@HtmlDsl
class HtmlElement(val name: String) {
    val attributes = mutableMapOf<String, String>()
    val children = mutableListOf<HtmlElement>()

    operator fun String.unaryPlus() {
        children.add(HtmlElement("text").apply {
            attributes["content"] = this@unaryPlus
        })
    }
}

fun html(init: HtmlElement.() -> Unit): HtmlElement {
    return HtmlElement("html").apply(init)
}

fun HtmlElement.head(init: HtmlElement.() -> Unit) {
    children.add(HtmlElement("head").apply(init))
}

fun HtmlElement.body(init: HtmlElement.() -> Unit) {
    children.add(HtmlElement("body").apply(init))
}

fun HtmlElement.h1(init: HtmlElement.() -> Unit) {
    children.add(HtmlElement("h1").apply(init))
}

val page = html {
    head {
        +"Page Title"
    }
    body {
        h1 {
            +"Welcome"
        }
    }
}
```

### SQL DSL Example

```kotlin
class SqlQuery {
    private val conditions = mutableListOf<String>()
    private val orderBy = mutableListOf<String>()
    private var limitValue: Int? = null

    fun where(condition: String) {
        conditions.add(condition)
    }

    fun orderBy(column: String, direction: String = "ASC") {
        orderBy.add("$column $direction")
    }

    fun limit(count: Int) {
        limitValue = count
    }

    fun build(table: String): String = buildString {
        append("SELECT * FROM $table")
        if (conditions.isNotEmpty()) {
            append(" WHERE ${conditions.joinToString(" AND ")}")
        }
        if (orderBy.isNotEmpty()) {
            append(" ORDER BY ${orderBy.joinToString(", ")}")
        }
        limitValue?.let { append(" LIMIT $it") }
    }
}

fun select(table: String, init: SqlQuery.() -> Unit): String {
    return SqlQuery().apply(init).build(table)
}

val query = select("users") {
    where("age > 18")
    where("active = true")
    orderBy("name")
    limit(10)
}
```

## Reflection

### Basic Reflection

```kotlin
import kotlin.reflect.*
import kotlin.reflect.full.*

data class Person(val name: String, var age: Int) {
    fun greet() = "Hello, I'm $name"
}

val person = Person("John", 30)
val kClass = person::class

println("Class name: ${kClass.simpleName}")
println("Properties: ${kClass.memberProperties.map { it.name }}")
println("Functions: ${kClass.memberFunctions.map { it.name }}")

kClass.memberProperties.forEach { prop ->
    println("${prop.name}: ${prop.get(person)}")
}
```

### Calling Functions Dynamically

```kotlin
fun callFunction(obj: Any, functionName: String, vararg args: Any?): Any? {
    val kClass = obj::class
    val function = kClass.memberFunctions.find { it.name == functionName }
    return function?.call(obj, *args)
}

val result = callFunction(person, "greet")
println(result)  // "Hello, I'm John"
```

### Property Reflection

```kotlin
fun setProperty(obj: Any, propertyName: String, value: Any?) {
    val kClass = obj::class
    val property = kClass.memberProperties.find { it.name == propertyName }
    if (property is KMutableProperty<*>) {
        property.setter.call(obj, value)
    }
}

setProperty(person, "age", 31)
println(person.age)  // 31
```

## Annotations

### Creating Custom Annotations

```kotlin
@Target(AnnotationTarget.FUNCTION, AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
annotation class Cacheable(val ttl: Int = 3600)

@Target(AnnotationTarget.PROPERTY)
@Retention(AnnotationRetention.RUNTIME)
annotation class JsonField(val name: String = "")

@Repeatable
@Target(AnnotationTarget.CLASS)
annotation class Author(val name: String)
```

### Processing Annotations

```kotlin
@Cacheable(ttl = 1800)
class UserService {

    @Cacheable
    fun getUser(id: String): User {
        return User(id, "User $id")
    }
}

fun processCacheableAnnotations(obj: Any) {
    val kClass = obj::class

    kClass.annotations.filterIsInstance<Cacheable>().forEach { annotation ->
        println("Class cache TTL: ${annotation.ttl}")
    }

    kClass.memberFunctions.forEach { function ->
        function.annotations.filterIsInstance<Cacheable>().forEach { annotation ->
            println("Function ${function.name} cache TTL: ${annotation.ttl}")
        }
    }
}
```

## Advanced Type System Features

### Variance

```kotlin
interface Producer<out T> {
    fun produce(): T
}

interface Consumer<in T> {
    fun consume(item: T)
}

interface Processor<T> : Producer<T>, Consumer<T>

class StringProducer : Producer<String> {
    override fun produce() = "Hello"
}

class AnyConsumer : Consumer<Any> {
    override fun consume(item: Any) = println(item)
}

val producer: Producer<Any> = StringProducer()  // Covariance
val consumer: Consumer<String> = AnyConsumer()  // Contravariance
```

### Type Projections

```kotlin
fun copy(from: Array<out Any>, to: Array<in Any>) {
    assert(from.size == to.size)
    for (i in from.indices) {
        to[i] = from[i]
    }
}

val stringArray = arrayOf("a", "b", "c")
val anyArray = arrayOfNulls<Any>(3)
copy(stringArray, anyArray)
```

### Star Projections

```kotlin
fun printList(list: List<*>) {
    for (item in list) {
        println(item)  // item is Any?
    }
}

printList(listOf(1, 2, 3))
printList(listOf("a", "b", "c"))
```
