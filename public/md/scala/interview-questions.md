# Scala Interview Questions

## **Core Scala**

### **What are the main features of Scala?**

- Statically typed
- Functional and object-oriented
- Type inference
- Pattern matching
- Immutable collections
- Higher-order functions
- Concurrency with Futures and Akka
- Interoperability with Java

### **What is the difference between `val`, `var`, and `def`?**

- `val`: Immutable variable.
- `var`: Mutable variable.
- `def`: Method or function definition.

### **What are case classes?**

Case classes automatically provide:

- `equals` and `hashCode`
- `toString`
- Copy methods
- Pattern matching support

```scala
case class Person(name: String, age: Int)
```

### **What is pattern matching?**

A mechanism to match values against patterns. Scala’s powerful alternative to switch-case:

```scala
x match {
  case 0 => "zero"
  case _ => "something else"
}
```

## **Functional Programming**

### **What are higher-order functions?**

Functions that take other functions as parameters or return functions.

```scala
def applyTwice(f: Int => Int, x: Int): Int = f(f(x))
```

### **What is currying?**

Transforming a function with multiple parameters into a series of functions each with a single parameter.

```scala
def add(a: Int)(b: Int) = a + b
```

### **Explain immutability in Scala.**

Immutable data structures cannot be changed after creation, promoting thread-safety and functional purity.

### **What is a Monad?**

A Monad wraps a value and provides `map` and `flatMap` to chain computations.

Example: `Option`, `Future`

## **Advanced Scala**

### **What are implicits?**

Implicit values and conversions let the compiler automatically pass arguments or convert types when appropriate.

```scala
implicit val defaultName = "Scala"
def greet(implicit name: String) = s"Hello, $name"
```

### **What are Type Classes?**

Type classes allow ad-hoc polymorphism by defining behavior for types without modifying them.

```scala
trait Show[A] { def show(a: A): String }
```

Libraries like **Cats** and **Scalaz** use this heavily.

### **What is variance (covariance and contravariance)?**

- `+T` (**Covariant**): `List[Cat]` is a subtype of `List[Animal]`.
- `-T` (**Contravariant**): Function arguments can be contravariant.
- No symbol (**Invariant**): No variance.

```scala
class Box[+T]   // Covariant
class Printer[-T] // Contravariant
```

### **What is a companion object?**

An object with the same name as a class defined in the same file. Can hold factory methods and shared utilities.

```scala
class MyClass
object MyClass { def apply() = new MyClass }
```

### **What are Futures and Promises?**

- **Future**: Represents a value that may not yet exist.
- **Promise**: A writable, single-assignment container used to complete a Future.

```scala
val p = Promise[Int]()
val f = p.future
p.success(42)
```

## **Collections**

### **Difference between mutable and immutable collections?**

Immutable collections cannot be modified after creation, while mutable collections can.

```scala
import scala.collection.mutable.ListBuffer
```

### **Difference between `map`, `flatMap`, and `filter`?**

- `map`: Applies a function to each element.
- `flatMap`: Applies a function and flattens the result.
- `filter`: Filters elements based on a predicate.

## **Concurrency and Parallelism**

### **What is Akka?**

A toolkit for building concurrent, distributed, and fault-tolerant applications based on the **Actor Model**.

### **Difference between parallel collections and Futures?**

- **Parallel collections**: Use multiple threads to operate on collections.
- **Futures**: Asynchronous computation.

## **Type System & Advanced Features**

### **What is type erasure?**

Scala (like Java) erases generic type information at runtime due to JVM limitations.

### **What are path-dependent types?**

Types that depend on a specific instance:

```scala
class Outer {
  class Inner
}
```

`Outer#Inner` vs `outerInstance.Inner`

### **What are structural types?**

Allow specifying a type based on its members rather than inheritance:

```scala
type Closeable = { def close(): Unit }
```

### **What is `lazy val`?**

A value that is initialized only once when accessed.

```scala
lazy val data = loadData()
```

### **What is tail recursion?**

A function call where the final result is returned directly from a recursive call, enabling compiler optimization.

```scala
@tailrec
def factorial(n: Int, acc: Int = 1): Int =
  if (n <= 1) acc else factorial(n - 1, n * acc)
```

## **Scala 3 / Dotty Specific**

### **What are extension methods?**

Add methods to existing types:

```scala
extension (s: String) def greet = s"Hello, $s"
```

### **What are union and intersection types?**

- Union (`A | B`): Type is either A or B.
- Intersection (`A & B`): Type conforms to both A and B.

### **What is the difference between `given` and `implicit`?**

`given` and `using` in Scala 3 replace the verbose implicit syntax for type class instances and parameters.

```scala
given intOrdering: Ordering[Int] with { ... }
```

## **Type System & Language Features**

### **What are higher-kinded types and why are they useful?**

Higher-kinded types allow defining type constructors abstractly. They’re essential for writing generic code for types like `List[_]`, `Option[_]`.

```scala
trait Functor[F[_]] {
  def map[A, B](fa: F[A])(f: A => B): F[B]
}
```

### **What is type variance (covariance, contravariance, invariance)?**

- **Covariant (+T)**: Allows `List[Cat]` to be used where `List[Animal]` is expected.
- **Contravariant (-T)**: Useful for parameter types like `Function1`.
- **Invariant**: No variance.

### **What are path-dependent types?**

A type that depends on an instance of another type:

```scala
class Outer { class Inner }
val outer1 = new Outer
val outer2 = new Outer
val i1: outer1.Inner = new outer1.Inner
```

### **Explain the difference between existential types and dependent types.**

Existential types abstract over unknown types (`List[_]`), while dependent types are types depending on values or instances (`outer.Inner`).

## **Functional Programming (FP)**

### **What is a type class in Scala?**

A way to define behavior for types without modifying them. Example: `Ordering`, `Numeric`, or custom ones using `implicit` or `given`.

### **What is the difference between `map`, `flatMap`, and `for-comprehensions`?**

- `map`: Applies a function to the value.
- `flatMap`: Applies a function returning a monad and flattens.
- `for`: Syntactic sugar combining `map`, `flatMap`, and `filter`.

### **Explain implicit resolution priority.**

Scala resolves implicits in this order:

1. Local scope
2. Implicit scope (companion objects, inheritance)
3. Imported implicits

### **What is the difference between `F[_]` and `G[_[_]]`?**

- `F[_]` is a higher-kinded type constructor.
- `G[_[_]]` is a type constructor that takes a type constructor itself.

Example:

```scala
trait Monad[F[_]] { ... }
```

## **Concurrency & Parallelism**

### **What is the difference between Future and Promise?**

- `Future`: Represents a value computed asynchronously.
- `Promise`: A writable placeholder to complete a Future.

### **Explain Akka’s actor model and supervision strategy.**

Actors encapsulate state and behavior. Supervision defines how parent actors handle child actor failures.

### **What is a Fiber (Cats Effect/ZIO) and how does it differ from a Thread?**

Fibers are lightweight, non-blocking concurrency primitives compared to heavyweight JVM threads.

## **Scala 3 (Dotty)**

### **What is the difference between `implicit` and `given/using`?**

Scala 3 replaces `implicit` parameters and conversions with `given` (for declarations) and `using` (for parameters).

```scala
given intOrd: Ordering[Int] = Ordering.Int
def max[T](a: T, b: T)(using Ordering[T]): T = ...
```

### **What are union and intersection types?**

- **Union (`A | B`)**: Value can be type A or B.
- **Intersection (`A & B`)**: Value conforms to both A and B.

### **What are extension methods?**

Adding methods to existing types without modifying them.

```scala
extension (s: String) def greet = s"Hello, $s"
```

## **Advanced Collections & Performance**

### **What is the difference between strict and lazy collections?**

Strict collections evaluate elements eagerly. Lazy collections (e.g., `Stream`, `LazyList`) defer computation until needed.

### **What is the difference between `Seq` and `List`?**

`Seq` is a general sequence trait. `List` is a specific immutable linked list implementation.

### **How does `View` help with performance?**

`View` avoids intermediate collection creation in chained operations by evaluating lazily.

## **Advanced Pattern Matching**

### **What is unapply and how does it work?**

`unapply` allows an object to define how it can be deconstructed during pattern matching.

```scala
object Email {
  def unapply(str: String): Option[(String, String)] = ...
}
```

### **What are extractor objects?**

Objects with `unapply` or `unapplySeq` methods to enable pattern matching.

## **Implicits, Contextual Abstractions & Typelevel Programming**

### **What are context bounds?**

A shorthand for requiring an implicit parameter.

```scala
def max[A: Ordering](a: A, b: A): A = ...
```

### **What is implicit shadowing?**

When an implicit defined in a narrower scope overrides an implicit available in a broader scope.

### **Explain inline given and derived in Scala 3.**

`inline given` allows compile-time resolution. `derived` automatically generates instances for type classes (e.g., `Eq`, `Show`).

## **Metaprogramming**

### **What are macros and do they exist in Scala 3?**

Macros allow compile-time code generation. Scala 3 replaces traditional macros with **inline methods**, **match types**, and **quoted code** (`quotes`/`splices`).

## **Best Practices & Design**

### **How would you enforce immutability?**

- Use `val` for variables.
- Prefer immutable collections.
- Avoid side effects in methods/functions.

### **What is the cake pattern?**

A pattern for dependency injection without frameworks, using self-types and traits.
