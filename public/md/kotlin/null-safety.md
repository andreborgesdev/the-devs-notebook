# Kotlin Null Safety and Error Handling

## Null Safety System

### Nullable vs Non-Nullable Types

```kotlin
var nonNullString: String = "Hello"
var nullableString: String? = null

nonNullString = "World"      // OK
nullableString = null        // OK
nullableString = "World"     // OK
```

### Nullable Type Operations

```kotlin
val nullableString: String? = "Hello"

val length = nullableString?.length        // Safe call - returns Int? or null
val upperCase = nullableString?.uppercase() // Chain safe calls

val lengthOrZero = nullableString?.length ?: 0  // Elvis operator for default
val text = nullableString ?: "Default text"     // Elvis for default value

val forceLength = nullableString!!.length      // Not-null assertion (risky!)
```

## Safe Call Operator

### Basic Safe Calls

```kotlin
data class Person(val name: String, val address: Address?)
data class Address(val street: String, val city: String)

val person: Person? = getPerson()
val cityName = person?.address?.city  // Chain of safe calls
```

### Safe Calls with let

```kotlin
val person: Person? = getPerson()

person?.let { p ->
    println("Person name: ${p.name}")
    println("Address: ${p.address}")
}

person?.address?.let { address ->
    println("Street: ${address.street}")
    println("City: ${address.city}")
}
```

### Safe Calls in Collections

```kotlin
val people: List<Person>? = getPeople()

people?.forEach { person ->
    println(person.name)
}

val firstPersonCity = people?.firstOrNull()?.address?.city
val cities = people?.mapNotNull { it.address?.city }
```

## Elvis Operator

### Basic Elvis Usage

```kotlin
fun processName(name: String?): String {
    return name ?: "Unknown"
}

val length = text?.length ?: 0
val message = errorMessage ?: "No error"
```

### Elvis with Early Return

```kotlin
fun processUser(user: User?): String {
    val safeUser = user ?: return "No user provided"
    return "Processing ${safeUser.name}"
}

fun validateInput(input: String?): Boolean {
    val trimmed = input?.trim() ?: return false
    return trimmed.isNotEmpty()
}
```

### Chaining Elvis Operators

```kotlin
fun getDisplayName(user: User?): String {
    return user?.fullName
        ?: user?.firstName
        ?: user?.username
        ?: "Anonymous"
}
```

## Not-Null Assertion

### When to Use !!

```kotlin
val userInput: String? = readLine()

val validated = validateInput(userInput)
if (validated) {
    val length = userInput!!.length  // We know it's not null
}

val list = mutableListOf<String>()
list.add("item")
val first = list.first()  // Better than list[0]!!
```

### Avoiding !! Anti-patterns

```kotlin
val config: Config? = loadConfig()

config!!.database.host     // Bad - can throw NPE
config?.database?.host     // Better - returns null safely

if (config != null) {      // Best - smart cast
    config.database.host
}
```

## Smart Casts

### Basic Smart Casting

```kotlin
fun processValue(value: Any?) {
    if (value is String) {
        println(value.length)  // Smart cast to String
    }

    if (value != null) {
        println(value.toString())  // Smart cast to non-null
    }
}
```

### Smart Casting with Nullable Types

```kotlin
fun processNullable(text: String?) {
    if (text != null) {
        println(text.length)     // Smart cast to String
        println(text.uppercase()) // No need for safe call
    }
}

fun processWithElvis(text: String?) {
    val safeText = text ?: return
    println(safeText.length)  // Smart cast after Elvis return
}
```

### Complex Smart Casting

```kotlin
sealed class Result<out T>
data class Success<T>(val data: T) : Result<T>()
data class Error(val message: String) : Result<Nothing>()

fun handleResult(result: Result<String>) {
    when (result) {
        is Success -> {
            println("Data: ${result.data}")  // Smart cast to Success
            println("Length: ${result.data.length}")
        }
        is Error -> {
            println("Error: ${result.message}")  // Smart cast to Error
        }
    }
}
```

## Exception Handling

### Try-Catch Expressions

```kotlin
val result = try {
    parseInt(input)
} catch (e: NumberFormatException) {
    null
}

val safeResult = try {
    performRiskyOperation()
} catch (e: Exception) {
    e.printStackTrace()
    defaultValue
}
```

### Multiple Catch Blocks

```kotlin
fun parseAndProcess(input: String): String? {
    return try {
        val number = input.toInt()
        processNumber(number)
    } catch (e: NumberFormatException) {
        println("Invalid number format: $input")
        null
    } catch (e: IllegalArgumentException) {
        println("Invalid argument: ${e.message}")
        null
    } catch (e: Exception) {
        println("Unexpected error: ${e.message}")
        null
    } finally {
        println("Cleanup operations")
    }
}
```

### Custom Exceptions

```kotlin
class ValidationException(message: String) : Exception(message)
class NetworkException(message: String, cause: Throwable) : Exception(message, cause)

fun validateUser(user: User) {
    if (user.email.isBlank()) {
        throw ValidationException("Email cannot be blank")
    }
    if (user.age < 0) {
        throw ValidationException("Age cannot be negative")
    }
}
```

## Result and Either Patterns

### Custom Result Type

```kotlin
sealed class Result<out T, out E> {
    data class Success<out T>(val value: T) : Result<T, Nothing>()
    data class Failure<out E>(val error: E) : Result<Nothing, E>()

    fun <R> map(transform: (T) -> R): Result<R, E> = when (this) {
        is Success -> Success(transform(value))
        is Failure -> this
    }

    fun <R> flatMap(transform: (T) -> Result<R, E>): Result<R, E> = when (this) {
        is Success -> transform(value)
        is Failure -> this
    }

    fun getOrElse(default: T): T = when (this) {
        is Success -> value
        is Failure -> default
    }
}
```

### Using Result Pattern

```kotlin
fun divide(a: Double, b: Double): Result<Double, String> {
    return if (b == 0.0) {
        Result.Failure("Division by zero")
    } else {
        Result.Success(a / b)
    }
}

fun processCalculation() {
    val result = divide(10.0, 2.0)
        .map { it * 2 }
        .flatMap { divide(it, 3.0) }

    when (result) {
        is Result.Success -> println("Result: ${result.value}")
        is Result.Failure -> println("Error: ${result.error}")
    }
}
```

### Either Pattern

```kotlin
sealed class Either<out L, out R> {
    data class Left<out L>(val value: L) : Either<L, Nothing>()
    data class Right<out R>(val value: R) : Either<Nothing, R>()

    fun <T> fold(left: (L) -> T, right: (R) -> T): T = when (this) {
        is Left -> left(value)
        is Right -> right(value)
    }

    fun <T> map(transform: (R) -> T): Either<L, T> = when (this) {
        is Left -> this
        is Right -> Right(transform(value))
    }
}
```

## Validation Patterns

### Input Validation

```kotlin
data class ValidationError(val field: String, val message: String)

fun validateEmail(email: String): List<ValidationError> {
    val errors = mutableListOf<ValidationError>()

    if (email.isBlank()) {
        errors.add(ValidationError("email", "Email is required"))
    } else if (!email.contains("@")) {
        errors.add(ValidationError("email", "Email must contain @"))
    }

    return errors
}

fun validateUser(user: User): List<ValidationError> {
    return validateEmail(user.email) +
           validateAge(user.age) +
           validateName(user.name)
}
```

### Precondition Checks

```kotlin
fun processUser(user: User?) {
    require(user != null) { "User cannot be null" }
    require(user.age >= 0) { "Age must be non-negative" }
    check(user.isActive) { "User must be active" }

    // Process user...
}

fun divide(a: Int, b: Int): Int {
    require(b != 0) { "Divisor cannot be zero" }
    return a / b
}
```

## Defensive Programming

### Safe Collection Access

```kotlin
fun getFirstUser(users: List<User>?): User? {
    return users?.firstOrNull()
}

fun processUsers(users: List<User>?) {
    users?.forEach { user ->
        user.name?.let { name ->
            println("Processing: $name")
        }
    }
}
```

### Safe Resource Management

```kotlin
fun processFile(filename: String): String? {
    return try {
        File(filename).readText()
    } catch (e: IOException) {
        println("Error reading file: ${e.message}")
        null
    }
}

fun safeFileOperation(filename: String) {
    File(filename).takeIf { it.exists() }?.let { file ->
        try {
            val content = file.readText()
            processContent(content)
        } catch (e: IOException) {
            println("Error processing file: ${e.message}")
        }
    } ?: println("File does not exist: $filename")
}
```

## Null Safety Best Practices

### Prefer Safe Calls

```kotlin
fun getUserCity(userId: String): String? {
    return getUserById(userId)?.address?.city
}
```

### Use let for Non-Null Processing

```kotlin
user?.let { u ->
    println("Name: ${u.name}")
    println("Email: ${u.email}")
    sendWelcomeEmail(u)
}
```

### Avoid !! Unless Absolutely Necessary

```kotlin
val config = loadConfig() ?: throw IllegalStateException("Config required")
val host = config.database.host  // Smart cast, no !! needed

val items = getItems()
if (items.isNotEmpty()) {
    val first = items.first()  // Better than items[0]!!
}
```

### Use Meaningful Default Values

```kotlin
fun getDisplayName(user: User?): String {
    return user?.name?.takeIf { it.isNotBlank() } ?: "Anonymous User"
}

fun getPageSize(config: Config?): Int {
    return config?.pageSize?.takeIf { it > 0 } ?: 20
}
```

### Fail Fast with Meaningful Errors

```kotlin
fun processOrder(order: Order?) {
    requireNotNull(order) { "Order cannot be null" }
    require(order.items.isNotEmpty()) { "Order must contain items" }
    require(order.total > 0) { "Order total must be positive" }

    // Process order...
}
```
