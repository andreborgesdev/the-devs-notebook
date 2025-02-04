# Java 8

# **What New Features Were Added in Java 8?**

Java 8 ships with several new features, but the most significant are the following:

- **Lambda Expressions** − a new language feature allowing us to treat actions as objects
- **Method References** − enable us to define Lambda Expressions by referring to methods directly using their names
- ***Optional*** − special wrapper class used for expressing optionality
- **Functional Interface** – an interface with maximum one abstract method; implementation can be provided using a Lambda Expression
- **Default methods** − give us the ability to add full implementations in interfaces besides abstract methods
- **Nashorn, JavaScript Engine** − Java-based engine for executing and evaluating JavaScript code
- ***Stream* API** − a special iterator class that allows us to process collections of objects in a functional manner
- **Date API** − an improved, immutable JodaTime-inspired Date API

Along with these new features, lots of feature enhancements are done under the hood at both the compiler and JVM level.

# **What Is a Method Reference?**

A method reference is a Java 8 construct that can be used for referencing a method without invoking it. It's used for treating methods as Lambda Expressions. They only work as syntactic sugar to reduce the verbosity of some lambdas. This way the following code:

```java
(o) -> o.toString();
```

Can become:

```java
Object::toString();
```

A method reference can be identified by a double colon separating a class or object name, and the name of the method. It has different variations, such as constructor reference:

```java
String::new;
```

Static method reference:

```java
String::valueOf;
```

Bound instance method reference:

```java
str::toString;
```

Unbound instance method reference:

```java
String::toString;
```

We can read a detailed description of method references with full examples by following [this link](https://www.codementor.io/eh3rrera/using-java-8-method-reference-du10866vx) and [this one](https://www.baeldung.com/java-8-double-colon-operator).

# **What Is the Meaning of String::Valueof Expression?**

It's a static method reference to the *valueOf* method of the *String* class.

# **What Is *Optional*? How Can It Be Used?**

*Optional* is a new class in Java 8 that encapsulates an optional value, i.e. a value that is either there or not. It's a wrapper around an object, and we can think of it as a container of zero or one element.

*Optional* has a special *Optional.empty()* value instead of wrapped *null*. Thus it can be used instead of a nullable value to get rid of *NullPointerException* in many cases.

We can read a dedicated article about *Optional* [here](https://www.baeldung.com/java-optional).

The main purpose of *Optional*, as designed by its creators, is to be a return type of methods that previously would return *null*. Such methods would require us to write boilerplate code to check the return value, and we could sometimes forget to do a defensive check. In Java 8, an *Optional* return type explicitly requires us to handle null or non-null wrapped values differently.

For instance, the *Stream.min()* method calculates the minimum value in a stream of values. But what if the stream is empty? If it wasn't for *Optional*, the method would return *null* or throw an exception.

However, it returns an *Optional* value, which may be *Optional.empty()* (the second case). This allows us to easily handle such cases:

```java
int min1 = Arrays.stream(newint[]{1, 2, 3, 4, 5})
  .min()
  .orElse(0);
assertEquals(1, min1);

int min2 = Arrays.stream(newint[]{})
  .min()
  .orElse(0);
assertEquals(0, min2);

```

It's worth noting that *Optional* is not a general purpose class like *Option* in Scala. It's not recommended that we use it as a field value in entity classes, which is clearly indicated by it not implementing the *Serializable* interface.

# **Describe Some of the Functional Interfaces in the Standard Library**

There are a lot of functional interfaces in the *java.util.function* package. The more common ones include, but are not limited to:

- *Function* – it takes one argument and returns a result
- *Consumer* – it takes one argument and returns no result (represents a side effect)
- *Supplier* – it takes no arguments and returns a result
- *Predicate* – it takes one argument and returns a boolean
- *BiFunction* – it takes two arguments and returns a result
- *BinaryOperator* – it is similar to a *BiFunction*, taking two arguments and returning a result. The two arguments and the result are all of the same types.
- *UnaryOperator* – it is similar to a *Function*, taking a single argument and returning a result of the same type

For more on functional interfaces, see the article [“Functional Interfaces in Java 8.”](https://www.baeldung.com/java-8-functional-interfaces)

# **What Is a Functional Interface? What Are the Rules of Defining a Functional Interface?**

A functional interface is an interface with one single abstract method (*default* methods do not count), no more, no less.

Where an instance of such an interface is required, a Lambda Expression can be used instead. More formally put: *Functional interfaces* provide target types for lambda expressions and method references.

The arguments and return type of such an expression directly match those of the single abstract method.

For instance, the *Runnable* interface is a functional interface, so instead of:

```java
Thread thread = new Thread(new Runnable() {
public void run() {
        System.out.println("Hello World!");
    }
});
```

We could simply do:

```java
Thread thread = new Thread(() -> System.out.println("Hello World!"));
```

Functional interfaces are usually annotated with the *@FunctionalInterface* annotation, which is informative and doesn't affect the semantics.

# **What Is a Default Method and When Do We Use It?**

A default method is a method with an implementation, which can be found in an interface.

We can use a default method to add a new functionality to an interface, while maintaining backward compatibility with classes that are already implementing the interface:

```java
publicinterfaceVehicle {
publicvoidmove();
defaultvoidhoot() {
        System.out.println("peep!");
    }
}
```

Usually when we add a new abstract method to an interface, all implementing classes will break until they implement the new abstract method. In Java 8, this problem was solved by using the default method.

For example, the *Collection* interface does not have a *forEach* method declaration. Thus adding such a method would simply break the whole collections API.

Java 8 introduced the default method so that the *Collection* interface can have a default implementation of the *forEach* method without requiring the classes implementing this interface to implement the same.

# **Will the Following Code Compile?**

```java
@FunctionalInterface
publicinterfaceFunction2<T,U,V> {
public Vapply(T t, U u);

defaultvoidcount() {
        // increment counter
    }
}
```

Yes, the code will compile because it follows the functional interface specification of defining only a single abstract method. The second method, *count*, is a default method that does not increase the abstract method count.

# **What Is a Lambda Expression and What Is It Used For?**

In very simple terms, a lambda expression is a function that we can reference and pass around as an object.

Moreover, lambda expressions introduce functional style processing in Java, and facilitate the writing of compact and easy-to-read code.

As a result, lambda expressions are a natural replacement for anonymous classes such as method arguments. One of their main uses is to define inline implementations of functional interfaces.

# **Explain the Syntax and Characteristics of a Lambda Expression**

A lambda expression consists of two parts, the parameter part and the expressions part separated by a forward arrow:

```java
params -> expressions
```

Any lambda expression has the following characteristics:

- **Optional type declaration** – when declaring the parameters on the left-hand side of the lambda, we don't need to declare their types as the compiler can infer them from their values. So *int param -> …* and *param ->…* are all valid
- **Optional parentheses** – when only a single parameter is declared, we don't need to place it in parentheses. This means *param -> …* and *(param) -> …* are all valid, but when more than one parameter is declared, parentheses are required
- **Optional curly braces** – when the expressions part only has a single statement, there is no need for curly braces. This means that *param – > statement* and *param – > {statement;}* are all valid, but curly braces are required when there is more than one statement
- **Optional return statement** – when the expression returns a value and it is wrapped inside curly braces, then we don't need a return statement. That means *(a, b) – > {return a+b;}* and *(a, b) – > {a+b;}* are both valid

To read more about Lambda expressions, follow [this link](https://www.tutorialspoint.com/java8/java8_lambda_expressions.htm) and [this one](https://www.baeldung.com/java-8-lambda-expressions-tips).

# **What Is Nashorn in Java8?**

[Nashorn](https://www.baeldung.com/java-nashorn) is the new Javascript processing engine for the Java platform that shipped with Java 8. Until JDK 7, the Java platform used Mozilla Rhino for the same purpose, as a Javascript processing engine.

Nashorn provides better compliance with the ECMA normalized JavaScript specification and better runtime performance than its predecessor.

# **What Is JJS?**

In Java 8, *jjs* is the new executable or command line tool we use to execute Javascript code at the console.

# **Tell Us About the New Date and Time API in Java 8**

A long-standing problem for Java developers has been the inadequate support for the date and time manipulations required by ordinary developers.

The existing classes such as *java.util.Date* and *SimpleDateFormatter* aren’t thread-safe, leading to potential concurrency issues for users.

Poor API design is also a reality in the old Java Data API. Here's just a quick example: years in *java.util.Date* start at 1900, months start at 1, and days start at 0, which is not very intuitive.

These issues and several others have led to the popularity of third-party date and time libraries, such as Joda-Time.

In order to address these problems and provide better support in JDK, a new date and time API, which is free of these problems, has been designed for Java SE 8 under the package *java.time*.