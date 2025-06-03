# Kotlin Best Practices & Interview Tips

## Code Style & Conventions

### Naming Conventions

```kotlin
// Classes: PascalCase
class UserRepository

// Functions and variables: camelCase
fun getUserName(): String
val userName = "John"

// Constants: UPPER_SNAKE_CASE
const val MAX_RETRY_COUNT = 3

// Package names: lowercase
package com.example.myapp.data
```

### Property Declarations

```kotlin
// Prefer val over var
val immutableList = listOf(1, 2, 3)
var mutableCounter = 0

// Use backing properties when needed
class ViewModel {
    private val _uiState = MutableStateFlow(UiState.Loading)
    val uiState: StateFlow<UiState> = _uiState.asStateFlow()
}

// Late initialization
class Activity {
    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
    }
}
```

## Function Design Patterns

### Extension Functions vs Member Functions

```kotlin
// Good: Extension for utility functions
fun String.isValidEmail(): Boolean {
    return android.util.Patterns.EMAIL_ADDRESS.matcher(this).matches()
}

// Bad: Should be member function
class Calculator {
    fun add(a: Int, b: Int): Int = a + b
}

// Don't do this as extension
fun Calculator.multiply(a: Int, b: Int): Int = a * b
```

### Higher-Order Functions

```kotlin
// Generic retry function
suspend fun <T> retry(
    times: Int = 3,
    delay: Long = 1000,
    action: suspend () -> T
): T {
    repeat(times - 1) {
        try {
            return action()
        } catch (e: Exception) {
            delay(delay)
        }
    }
    return action()
}

// Usage
val result = retry(times = 5, delay = 500) {
    api.fetchData()
}
```

### DSL Creation

```kotlin
// HTML DSL example
@DslMarker
annotation class HtmlTagMarker

@HtmlTagMarker
abstract class Tag(val name: String) {
    val children = mutableListOf<Tag>()
    val attributes = mutableMapOf<String, String>()

    protected fun <T : Tag> initTag(tag: T, init: T.() -> Unit): T {
        tag.init()
        children.add(tag)
        return tag
    }

    override fun toString(): String =
        "<$name${renderAttributes()}>${children.joinToString("")}</$name>"

    private fun renderAttributes(): String =
        if (attributes.isEmpty()) ""
        else attributes.entries.joinToString("", " ") { "${it.key}=\"${it.value}\"" }
}

class HTML : Tag("html")
class Body : Tag("body")
class P : Tag("p")

fun HTML.body(init: Body.() -> Unit) = initTag(Body(), init)
fun Body.p(init: P.() -> Unit) = initTag(P(), init)

fun html(init: HTML.() -> Unit): HTML = HTML().apply(init)

// Usage
val webpage = html {
    body {
        p { }
    }
}
```

## Error Handling Patterns

### Result Pattern Implementation

```kotlin
sealed class Result<out T> {
    data class Success<T>(val value: T) : Result<T>()
    data class Failure(val exception: Throwable) : Result<Nothing>()

    inline fun <R> map(transform: (T) -> R): Result<R> = when (this) {
        is Success -> Success(transform(value))
        is Failure -> this
    }

    inline fun <R> flatMap(transform: (T) -> Result<R>): Result<R> = when (this) {
        is Success -> transform(value)
        is Failure -> this
    }

    inline fun onSuccess(action: (T) -> Unit): Result<T> {
        if (this is Success) action(value)
        return this
    }

    inline fun onFailure(action: (Throwable) -> Unit): Result<T> {
        if (this is Failure) action(exception)
        return this
    }
}

// Extension for suspend functions
suspend fun <T> Result.Companion.catching(block: suspend () -> T): Result<T> {
    return try {
        Success(block())
    } catch (e: Exception) {
        Failure(e)
    }
}

// Usage
suspend fun fetchUser(id: String): Result<User> = Result.catching {
    api.getUser(id)
}
```

### Either Type for Railway-Oriented Programming

```kotlin
sealed class Either<out L, out R> {
    data class Left<L>(val value: L) : Either<L, Nothing>()
    data class Right<R>(val value: R) : Either<Nothing, R>()

    inline fun <T> fold(ifLeft: (L) -> T, ifRight: (R) -> T): T = when (this) {
        is Left -> ifLeft(value)
        is Right -> ifRight(value)
    }

    inline fun <T> map(f: (R) -> T): Either<L, T> = when (this) {
        is Left -> this
        is Right -> Right(f(value))
    }

    inline fun <T> flatMap(f: (R) -> Either<L, T>): Either<L, T> = when (this) {
        is Left -> this
        is Right -> f(value)
    }
}

// Usage
fun divide(a: Int, b: Int): Either<String, Int> =
    if (b == 0) Either.Left("Division by zero")
    else Either.Right(a / b)
```

## Coroutine Patterns

### Channel Patterns

```kotlin
// Producer-Consumer with Channel
class EventProcessor {
    private val eventChannel = Channel<Event>(Channel.UNLIMITED)

    fun start() = CoroutineScope(Dispatchers.Default).launch {
        for (event in eventChannel) {
            processEvent(event)
        }
    }

    suspend fun sendEvent(event: Event) {
        eventChannel.send(event)
    }

    private suspend fun processEvent(event: Event) {
        // Process event
        delay(100)
        println("Processed: $event")
    }
}
```

### Flow Operators Best Practices

```kotlin
class DataRepository {
    fun getDataStream(): Flow<List<Data>> = flow {
        emit(getLocalData()) // Emit cached data first
        emit(getRemoteData()) // Then fresh data
    }
    .catch { exception ->
        emit(emptyList()) // Fallback on error
    }
    .distinctUntilChanged() // Avoid duplicate emissions
    .flowOn(Dispatchers.IO) // Perform on IO thread

    fun searchData(query: String): Flow<List<Data>> = flow {
        emit(performSearch(query))
    }
    .debounce(300) // Wait for user to stop typing
    .filter { it.isNotEmpty() } // Only search non-empty queries
    .distinctUntilChanged() // Avoid duplicate searches
    .flatMapLatest { query -> // Cancel previous search
        flow { emit(performSearch(query)) }
    }
}
```

## Testing Patterns

### Coroutine Testing

```kotlin
@ExperimentalCoroutinesApi
class UserRepositoryTest {

    @get:Rule
    val mainDispatcherRule = MainDispatcherRule()

    private val testDispatcher = UnconfinedTestDispatcher()
    private val testScope = TestScope(testDispatcher)

    @Test
    fun `should fetch user successfully`() = testScope.runTest {
        // Given
        val mockApi = mockk<UserApi>()
        coEvery { mockApi.getUser(any()) } returns mockUser
        val repository = UserRepository(mockApi)

        // When
        val result = repository.getUser("123")

        // Then
        assertEquals(mockUser, result)
        coVerify { mockApi.getUser("123") }
    }

    @Test
    fun `should handle network timeout`() = testScope.runTest {
        // Given
        val mockApi = mockk<UserApi>()
        coEvery { mockApi.getUser(any()) } throws SocketTimeoutException()
        val repository = UserRepository(mockApi)

        // When & Then
        assertThrows<SocketTimeoutException> {
            repository.getUser("123")
        }
    }
}
```

### Flow Testing

```kotlin
@Test
fun `should emit loading then success states`() = runTest {
    // Given
    val repository = mockk<UserRepository>()
    coEvery { repository.getUser(any()) } returns mockUser
    val viewModel = UserViewModel(repository)

    // When
    viewModel.loadUser("123")

    // Then
    val states = mutableListOf<UiState>()
    val job = launch {
        viewModel.uiState.collect { states.add(it) }
    }

    advanceUntilIdle()

    assertEquals(
        listOf(UiState.Loading, UiState.Success(mockUser)),
        states
    )

    job.cancel()
}
```

## Performance Optimization

### Memory Management

```kotlin
// Use object pools for frequent allocations
class ObjectPool<T>(
    private val factory: () -> T,
    private val reset: (T) -> Unit
) {
    private val pool = ConcurrentLinkedQueue<T>()

    fun acquire(): T = pool.poll() ?: factory()

    fun release(item: T) {
        reset(item)
        pool.offer(item)
    }
}

// Example usage
val stringBuilderPool = ObjectPool(
    factory = { StringBuilder() },
    reset = { it.clear() }
)
```

### Collection Optimizations

```kotlin
// Use appropriate collection types
val frequentLookups = HashMap<String, User>() // O(1) lookup
val maintainOrder = LinkedHashMap<String, User>() // Maintains insertion order
val sortedKeys = TreeMap<String, User>() // Sorted keys
val uniqueItems = HashSet<String>() // O(1) contains check

// Prefer sequences for chain operations
val result = largeList
    .asSequence()
    .filter { it.isActive }
    .map { it.name }
    .take(10)
    .toList() // Only process what's needed

// Use primitive arrays when possible
val intArray = IntArray(1000) // More efficient than Array<Int>
val booleanArray = BooleanArray(1000) // More efficient than Array<Boolean>
```

## Interview Preparation Checklist

### Core Concepts to Master

1. **Null Safety**

   - Nullable vs non-nullable types
   - Safe call operator (?.)
   - Elvis operator (?:)
   - Not-null assertion (!!)

2. **Coroutines**

   - Suspend functions
   - Coroutine builders (launch, async, runBlocking)
   - Structured concurrency
   - Exception handling
   - Channels and Flow

3. **Collections**

   - List, Set, Map differences
   - Mutable vs immutable
   - Collection operations (map, filter, reduce)
   - Sequences vs collections

4. **Classes and Objects**

   - Data classes
   - Sealed classes
   - Object declarations vs expressions
   - Companion objects

5. **Functions**
   - Extension functions
   - Higher-order functions
   - Inline functions
   - Lambda expressions

### Common Interview Questions by Category

**Basic Syntax**

- Explain val vs var
- What is string interpolation?
- How do you handle null safety?

**OOP Concepts**

- Difference between abstract classes and interfaces
- What are data classes?
- Explain inheritance in Kotlin

**Functional Programming**

- What are higher-order functions?
- Explain map, filter, and reduce
- What are lambda expressions?

**Concurrency**

- What are coroutines?
- Difference between launch and async
- What is structured concurrency?

**Advanced Topics**

- What are inline functions?
- Explain delegation
- What are sealed classes?

### Code Challenges to Practice

1. **Implement a simple cache with LRU eviction**
2. **Create a retry mechanism with exponential backoff**
3. **Build a type-safe builder DSL**
4. **Implement a thread-safe counter**
5. **Create a Flow that combines multiple sources**
6. **Write a suspend function that handles timeouts**

### Performance Questions

- How do coroutines compare to threads in terms of memory?
- When would you use sequences instead of collections?
- What are the benefits of inline functions?
- How do you optimize Flow operations?

### Best Practices to Remember

1. **Prefer immutability** - Use val over var when possible
2. **Use appropriate scopes** - Don't use GlobalScope in production
3. **Handle exceptions properly** - Use try-catch in suspend functions
4. **Optimize for readability** - Use meaningful names and clear structure
5. **Test your code** - Write unit tests for suspend functions and flows
6. **Follow conventions** - Stick to Kotlin coding standards

## Common Interview Mistakes to Avoid

### Memory Leaks

```kotlin
// ❌ WRONG: Memory leak
class MyActivity : Activity() {
    private val job = GlobalScope.launch {
        // Never gets cancelled
    }
}

// ✅ CORRECT: Proper lifecycle management
class MyActivity : Activity() {
    private val scope = CoroutineScope(Job() + Dispatchers.Main)

    override fun onDestroy() {
        super.onDestroy()
        scope.cancel()
    }
}
```

### Blocking Main Thread

```kotlin
// ❌ WRONG: Blocking main thread
fun loadData() {
    runBlocking {
        val data = repository.getData()
        updateUI(data)
    }
}

// ✅ CORRECT: Non-blocking approach
fun loadData() {
    lifecycleScope.launch {
        val data = withContext(Dispatchers.IO) {
            repository.getData()
        }
        updateUI(data)
    }
}
```

### Improper Exception Handling

```kotlin
// ❌ WRONG: Unhandled exceptions
suspend fun fetchData(): Data {
    return api.getData() // Can throw exception
}

// ✅ CORRECT: Proper exception handling
suspend fun fetchData(): Result<Data> {
    return try {
        Result.success(api.getData())
    } catch (e: Exception) {
        Result.failure(e)
    }
}
```

## Quick Reference Cheat Sheet

### Essential Kotlin Syntax

```kotlin
// Variables
val immutable = "Cannot change"
var mutable = "Can change"

// Null safety
val nullable: String? = null
val safe = nullable?.length ?: 0

// Functions
fun add(a: Int, b: Int): Int = a + b
suspend fun fetchData(): Data = withContext(Dispatchers.IO) { ... }

// Classes
data class User(val name: String, val age: Int)
sealed class Result<T> { ... }

// Collections
val list = listOf(1, 2, 3)
val map = mapOf("key" to "value")

// Coroutines
launch { /* fire and forget */ }
async { /* returns Deferred */ }
runBlocking { /* blocks thread */ }

// Flow
flow { emit(data) }
    .map { transform(it) }
    .collect { use(it) }
```

### Key Differences from Java

| Feature             | Java             | Kotlin                 |
| ------------------- | ---------------- | ---------------------- |
| Null Safety         | Manual checks    | Built-in type system   |
| String Templates    | Concatenation    | `"Hello $name"`        |
| Data Classes        | Boilerplate      | `data class User(...)` |
| Extension Functions | Not available    | `fun String.reverse()` |
| Coroutines          | Third-party libs | Built-in               |
| Type Inference      | Limited          | Comprehensive          |

## Final Interview Tips

1. **Practice coding on a whiteboard** - Many interviews still use this format
2. **Know the standard library** - Be familiar with common collection operations
3. **Understand performance implications** - Know when to use sequences vs collections
4. **Be prepared for Android-specific questions** - If interviewing for Android role
5. **Review error handling patterns** - Especially with coroutines and Flow
6. **Practice explaining concepts** - Clear communication is as important as coding
7. **Know when NOT to use features** - Understanding trade-offs shows expertise

Good luck with your interview tomorrow! 🚀
