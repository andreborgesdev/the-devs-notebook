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

## **Android-Specific Kotlin Features**

### **What are Android-specific coroutine scopes?**

- `viewModelScope`: Automatically cancelled when ViewModel is cleared
- `lifecycleScope`: Tied to lifecycle events (Activity/Fragment)
- `GlobalScope`: Should be avoided in Android (survives app restarts)

```kotlin
class MyViewModel : ViewModel() {
    fun loadData() {
        viewModelScope.launch {
            // Will be cancelled when ViewModel is destroyed
        }
    }
}
```

### **How do you handle configuration changes with coroutines?**

Use `ViewModel` with `viewModelScope` to survive configuration changes:

```kotlin
class UserRepository {
    suspend fun getUser(): User = withContext(Dispatchers.IO) {
        // Network call
    }
}

class UserViewModel(private val repository: UserRepository) : ViewModel() {
    private val _user = MutableStateFlow<User?>(null)
    val user: StateFlow<User?> = _user.asStateFlow()

    fun loadUser() {
        viewModelScope.launch {
            _user.value = repository.getUser()
        }
    }
}
```

### **What is the difference between `runBlocking` and `runBlockingTest`?**

- `runBlocking`: Blocks current thread until completion
- `runBlockingTest` (deprecated, now `runTest`): For testing coroutines with virtual time

```kotlin
@Test
fun testCoroutine() = runTest {
    // Virtual time, no actual delays
    delay(1000)
    // Test completes immediately
}
```

## **Memory Management & Performance**

### **How do coroutines help with memory management?**

Coroutines use much less memory than threads:

- Thread: ~1MB stack space
- Coroutine: ~few KB
- Can run hundreds of thousands of coroutines simultaneously

### **What are common memory leaks with coroutines?**

```kotlin
// Bad - GlobalScope creates memory leak
GlobalScope.launch {
    // This continues running even after Activity is destroyed
}

// Good - Use appropriate scope
lifecycleScope.launch {
    // Automatically cancelled with lifecycle
}
```

### **How to optimize collection operations in Kotlin?**

```kotlin
// Prefer sequences for large datasets
val result = list.asSequence()
    .filter { it.isActive }
    .map { it.name }
    .take(100)
    .toList()

// Use appropriate collection types
val uniqueItems = hashSetOf<String>() // O(1) lookup
val orderedItems = linkedSetOf<String>() // Maintains order
```

## **Error Handling & Testing**

### **How to handle exceptions in coroutines?**

```kotlin
// Using try-catch
suspend fun fetchData(): Result<Data> {
    return try {
        val data = api.getData()
        Result.success(data)
    } catch (e: Exception) {
        Result.failure(e)
    }
}

// Using CoroutineExceptionHandler
val handler = CoroutineExceptionHandler { _, exception ->
    Log.e("Error", "Coroutine failed", exception)
}

launch(handler) {
    // Coroutine code
}
```

### **How to test suspend functions?**

```kotlin
@Test
fun testSuspendFunction() = runTest {
    val result = repository.getData()
    assertEquals(expectedData, result)
}

// Testing with delays
@Test
fun testWithDelay() = runTest {
    launch {
        delay(1000) // Virtual time
        updateState()
    }

    advanceTimeBy(1000)
    assertEquals(expectedState, actualState)
}
```

### **What is `SupervisorJob` and when to use it?**

`SupervisorJob` prevents child coroutine failures from cancelling siblings:

```kotlin
val supervisor = SupervisorJob()
val scope = CoroutineScope(Dispatchers.Default + supervisor)

scope.launch {
    // If this fails, it won't cancel other children
    throw Exception("Child 1 failed")
}

scope.launch {
    // This continues running even if child 1 fails
    doWork()
}
```

## **Advanced Patterns & Architecture**

### **How to implement Repository pattern with coroutines?**

```kotlin
interface UserRepository {
    suspend fun getUser(id: String): User
    fun getUserFlow(id: String): Flow<User>
}

class UserRepositoryImpl(
    private val api: UserApi,
    private val dao: UserDao
) : UserRepository {

    override suspend fun getUser(id: String): User {
        return try {
            val user = api.getUser(id)
            dao.insertUser(user)
            user
        } catch (e: Exception) {
            dao.getUser(id) // Fallback to cache
        }
    }

    override fun getUserFlow(id: String): Flow<User> = flow {
        emit(dao.getUser(id)) // Emit cached first
        try {
            val fresh = api.getUser(id)
            dao.insertUser(fresh)
            emit(fresh) // Emit fresh data
        } catch (e: Exception) {
            // Handle error
        }
    }
}
```

### **How to implement Clean Architecture with Kotlin coroutines?**

```kotlin
// Domain Layer
interface GetUserUseCase {
    suspend operator fun invoke(userId: String): Result<User>
}

class GetUserUseCaseImpl(
    private val repository: UserRepository
) : GetUserUseCase {
    override suspend fun invoke(userId: String): Result<User> {
        return try {
            Result.success(repository.getUser(userId))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}

// Presentation Layer
class UserViewModel(
    private val getUserUseCase: GetUserUseCase
) : ViewModel() {

    private val _uiState = MutableStateFlow(UserUiState.Loading)
    val uiState: StateFlow<UserUiState> = _uiState.asStateFlow()

    fun loadUser(userId: String) {
        viewModelScope.launch {
            _uiState.value = UserUiState.Loading
            getUserUseCase(userId)
                .onSuccess { _uiState.value = UserUiState.Success(it) }
                .onFailure { _uiState.value = UserUiState.Error(it.message) }
        }
    }
}

sealed class UserUiState {
    object Loading : UserUiState()
    data class Success(val user: User) : UserUiState()
    data class Error(val message: String?) : UserUiState()
}
```

## **Flow Advanced Patterns**

### **How to combine multiple Flows?**

```kotlin
// Combine latest values from multiple flows
val userFlow: Flow<User> = ...
val settingsFlow: Flow<Settings> = ...

val combinedFlow = combine(userFlow, settingsFlow) { user, settings ->
    UserWithSettings(user, settings)
}

// Merge multiple flows
val flow1: Flow<Event> = ...
val flow2: Flow<Event> = ...
val mergedFlow = merge(flow1, flow2)
```

### **How to handle Flow transformations?**

```kotlin
flow {
    emit(userRepository.getUsers())
}
.map { users -> users.filter { it.isActive } }
.flatMapLatest { users ->
    flow {
        users.forEach { user ->
            emit(user.name)
            delay(100)
        }
    }
}
.catch { exception ->
    emit("Error: ${exception.message}")
}
.flowOn(Dispatchers.IO)
.collect { result ->
    updateUI(result)
}
```

## **Practical Coding Challenges**

### **Implement a retry mechanism with exponential backoff**

```kotlin
suspend fun <T> retryWithBackoff(
    times: Int = 3,
    initialDelay: Long = 100,
    maxDelay: Long = 1000,
    factor: Double = 2.0,
    block: suspend () -> T
): T {
    var currentDelay = initialDelay
    repeat(times - 1) {
        try {
            return block()
        } catch (e: Exception) {
            delay(currentDelay)
            currentDelay = (currentDelay * factor).toLong().coerceAtMost(maxDelay)
        }
    }
    return block() // Last attempt
}

// Usage
val data = retryWithBackoff {
    api.getData() // May fail and retry
}
```

### **Implement a simple cache with expiration**

```kotlin
class ExpiringCache<K, V>(private val expiration: Long) {
    private data class CacheEntry<V>(val value: V, val timestamp: Long)
    private val cache = ConcurrentHashMap<K, CacheEntry<V>>()

    fun put(key: K, value: V) {
        cache[key] = CacheEntry(value, System.currentTimeMillis())
    }

    fun get(key: K): V? {
        val entry = cache[key] ?: return null
        return if (System.currentTimeMillis() - entry.timestamp < expiration) {
            entry.value
        } else {
            cache.remove(key)
            null
        }
    }
}
```

### **Implement a thread-safe counter with coroutines**

```kotlin
class ThreadSafeCounter {
    private var value = 0
    private val mutex = Mutex()

    suspend fun increment(): Int = mutex.withLock {
        ++value
    }

    suspend fun get(): Int = mutex.withLock {
        value
    }
}

// Alternative using Atomic
class AtomicCounter {
    private val value = AtomicInteger(0)

    fun increment(): Int = value.incrementAndGet()
    fun get(): Int = value.get()
}
```

## **Common Interview Scenarios**

### **How would you handle a network request with loading, success, and error states?**

```kotlin
sealed class Resource<T> {
    class Loading<T> : Resource<T>()
    data class Success<T>(val data: T) : Resource<T>()
    data class Error<T>(val message: String) : Resource<T>()
}

class DataRepository {
    fun getData(): Flow<Resource<List<Data>>> = flow {
        emit(Resource.Loading())
        try {
            val data = api.getData()
            emit(Resource.Success(data))
        } catch (e: Exception) {
            emit(Resource.Error(e.message ?: "Unknown error"))
        }
    }
}
```

### **How to implement pagination with Paging 3 library?**

```kotlin
class UserPagingSource(private val api: UserApi) : PagingSource<Int, User>() {
    override suspend fun load(params: LoadParams<Int>): LoadResult<Int, User> {
        return try {
            val page = params.key ?: 1
            val response = api.getUsers(page)

            LoadResult.Page(
                data = response.users,
                prevKey = if (page == 1) null else page - 1,
                nextKey = if (response.hasMore) page + 1 else null
            )
        } catch (e: Exception) {
            LoadResult.Error(e)
        }
    }

    override fun getRefreshKey(state: PagingState<Int, User>): Int? {
        return state.anchorPosition?.let { anchorPosition ->
            state.closestPageToPosition(anchorPosition)?.prevKey?.plus(1)
                ?: state.closestPageToPosition(anchorPosition)?.nextKey?.minus(1)
        }
    }
}
```

### **How to implement a search feature with debouncing?**

```kotlin
class SearchViewModel : ViewModel() {
    private val searchQuery = MutableStateFlow("")

    val searchResults = searchQuery
        .debounce(300) // Wait 300ms after user stops typing
        .filter { it.length >= 3 } // Only search for 3+ characters
        .distinctUntilChanged() // Don't search for same query
        .flatMapLatest { query ->
            repository.search(query)
                .catch { emit(emptyList()) }
        }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    fun updateSearchQuery(query: String) {
        searchQuery.value = query
    }
}
```

## **Performance & Optimization Tips**

### **Best practices for coroutine performance**

```kotlin
// Use appropriate dispatcher
launch(Dispatchers.IO) { /* I/O operations */ }
launch(Dispatchers.Default) { /* CPU-intensive work */ }
launch(Dispatchers.Main) { /* UI updates */ }

// Prefer StateFlow over LiveData for better performance
private val _state = MutableStateFlow(initialState)
val state = _state.asStateFlow()

// Use collectLatest for cancellable operations
state.collectLatest { state ->
    // Previous collection is cancelled when new state arrives
    processState(state)
}

// Optimize Flow operations
data.asFlow()
    .filter { it.isValid }
    .map { transform(it) }
    .flowOn(Dispatchers.Default) // Upstream operations run on Default
    .collect { updateUI(it) } // UI update on Main
```

### **Memory optimization techniques**

```kotlin
// Use sequences for large collections
val result = hugeList.asSequence()
    .filter { predicate(it) }
    .map { transform(it) }
    .take(100)
    .toList() // Only materialize needed items

// Prefer primitive collections when possible
val intArray = IntArray(1000) // More memory efficient than Array<Int>

// Use lazy initialization
val expensiveResource by lazy {
    createExpensiveResource()
}
```

### **Must-Know Concepts**

- [ ] Null safety (nullable types, safe calls, Elvis operator)
- [ ] Data classes vs regular classes
- [ ] Extension functions vs member functions
- [ ] Coroutines: launch vs async vs runBlocking
- [ ] Flow vs LiveData vs Observable
- [ ] Sealed classes for state management
- [ ] Higher-order functions and lambdas
- [ ] Scope functions (let, run, with, apply, also)
- [ ] Collections operations (map, filter, reduce, flatMap)
- [ ] Error handling in coroutines

### **Android-Specific Topics**

- [ ] viewModelScope vs lifecycleScope vs GlobalScope
- [ ] StateFlow vs SharedFlow vs MutableLiveData
- [ ] Configuration changes handling
- [ ] Background processing best practices
- [ ] Memory leak prevention

### **Common Coding Challenges**

- [ ] Implement retry mechanism with exponential backoff
- [ ] Create thread-safe counter using coroutines
- [ ] Build simple cache with expiration
- [ ] Handle network states (loading/success/error)
- [ ] Implement search with debouncing
- [ ] Combine multiple data sources with Flow

### **Performance & Optimization**

- [ ] When to use sequences vs collections
- [ ] Memory management with coroutines
- [ ] Appropriate dispatcher selection
- [ ] Flow operators best practices
- [ ] Collection optimization techniques

### **Key Gotchas to Remember**

- [ ] Don't use GlobalScope in production Android apps
- [ ] Always handle exceptions in coroutines
- [ ] Use structured concurrency principles
- [ ] Prefer StateFlow over SharedFlow for state
- [ ] Cancel coroutines properly to avoid leaks
- [ ] Use appropriate thread dispatchers

**You're well-prepared! The comprehensive content above covers everything you need for tomorrow's interview. Focus on understanding the concepts rather than memorizing syntax. Good luck! 🎯**
