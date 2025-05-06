# Scala

## Overview

**Scala** (Scalable Language) is a **general-purpose programming language** that combines **object-oriented** and **functional programming** paradigms. Designed to address the shortcomings of Java, Scala runs on the **Java Virtual Machine (JVM)** and interoperates seamlessly with Java code.

## Key Features

| Feature                 | Description                                           |
| ----------------------- | ----------------------------------------------------- |
| Static Typing           | Powerful type inference system                        |
| Functional Programming  | First-class functions, immutability, pattern matching |
| Object-Oriented         | Pure object-oriented model (everything is an object)  |
| Interoperable with Java | Can use Java libraries and frameworks directly        |
| Concurrency Support     | Actor model (via Akka), Futures, Promises             |
| Expressiveness          | Concise syntax reducing boilerplate code              |
| Type Safety             | Compile-time type checking to catch errors early      |

## Basic Syntax

```scala
object HelloWorld {
  def main(args: Array[String]): Unit = {
    println("Hello, world!")
  }
}
```

## Variables and Values

```scala
val immutableValue: Int = 10    // Immutable
var mutableVariable: Int = 5    // Mutable
```

## Functions

```scala
def add(a: Int, b: Int): Int = a + b
println(add(3, 4)) // Output: 7
```

## Classes and Objects

```scala
class Person(val name: String) {
  def greet(): String = s"Hello, $name!"
}

val person = new Person("Alice")
println(person.greet())
```

## Case Classes

Case classes are immutable and have built-in support for pattern matching.

```scala
case class Point(x: Int, y: Int)

val p1 = Point(1, 2)
val p2 = p1.copy(y = 5)
```

## Traits (Mixins)

```scala
trait Greeter {
  def greet(name: String): String = s"Hello, $name!"
}

class Person extends Greeter

val person = new Person()
println(person.greet("Bob"))
```

## Pattern Matching

```scala
def describe(x: Any): String = x match {
  case 1          => "One"
  case "hello"    => "A greeting"
  case _: Int     => "Some integer"
  case _          => "Something else"
}
```

## Collections

### Immutable Collections

```scala
val numbers = List(1, 2, 3)
val newNumbers = numbers.map(_ * 2)  // List(2, 4, 6)
```

### Mutable Collections

```scala
import scala.collection.mutable.ListBuffer

val buffer = ListBuffer(1, 2, 3)
buffer += 4  // ListBuffer(1, 2, 3, 4)
```

## Functional Programming Concepts

- **First-class Functions**
- **Immutability**
- **Higher-order Functions**
- **Currying**

```scala
val add = (x: Int, y: Int) => x + y

def multiplyBy(factor: Int)(x: Int): Int = factor * x
val double = multiplyBy(2) _
println(double(5))  // Output: 10
```

## Futures (Concurrency)

```scala
import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global

val future = Future {
  Thread.sleep(1000)
  42
}

future.foreach(println)
```

## Akka (Actor Model)

```scala
import akka.actor._

class HelloActor extends Actor {
  def receive = {
    case "hello" => println("Hello back!")
    case _       => println("Unknown message")
  }
}

val system = ActorSystem("MySystem")
val actor = system.actorOf(Props[HelloActor], name = "helloactor")
actor ! "hello"
```

## Interoperability with Java

```scala
import java.util.Date

val now = new Date()
println(now.toString)
```

## Scala vs Java

| Feature          | Scala                        | Java                            |
| ---------------- | ---------------------------- | ------------------------------- |
| Syntax           | Concise                      | Verbose                         |
| Paradigms        | Object-Oriented + Functional | Primarily Object-Oriented       |
| Type Inference   | Yes                          | Limited                         |
| Pattern Matching | Yes                          | No (until Java 17 previews)     |
| Null Safety      | Safer with `Option` type     | Possible `NullPointerException` |
| Interoperability | Fully compatible with Java   | Java only                       |

## Best Practices

- Prefer `val` over `var` for immutability.
- Use **pattern matching** instead of complex conditionals.
- Leverage **case classes** for data modeling.
- Utilize **traits** for code reuse.
- Take advantage of **higher-order functions** and **collections API**.
- Handle optional values using `Option` and avoid `null`.

## Ecosystem and Tools

| Tool / Library | Purpose                               |
| -------------- | ------------------------------------- |
| sbt            | Scala build tool                      |
| Akka           | Concurrency and distributed computing |
| Play Framework | Web development                       |
| Cats / Scalaz  | Functional programming libraries      |
| Spark          | Big data processing                   |

## Summary

Scala is a powerful, expressive, and concise language that brings together the best of object-oriented and functional programming. With strong type safety, a rich collection API, and seamless Java interoperability, it’s ideal for a wide range of applications from simple scripts to large-scale distributed systems.
