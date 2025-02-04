# Streams

# **What Is a Stream? How Does It Differ From a Collection?**

In simple terms, a stream is an iterator whose role is to accept a set of actions to apply on each of the elements it contains.

The *stream* represents a sequence of objects from a source such as a collection, which supports aggregate operations. They were designed to make collection processing simple and concise. Contrary to the collections, the logic of iteration is implemented inside the stream, so we can use methods like *map* and *flatMap* for performing a declarative processing.

Additionally, the *Stream* API is fluent and allows pipelining:

```java
int sum = Arrays.stream(newint[]{1, 2, 3})
  .filter(i -> i >= 2)
  .map(i -> i * 3)
  .sum();
```

Another important distinction from collections is that streams are inherently lazily loaded and processed.

# **What Is the Difference Between Intermediate and Terminal Operations?**

We combine stream operations into pipelines to process streams. All operations are either intermediate or terminal.

Intermediate operations are those operations that return *Stream* itself, allowing for further operations on a stream.

**These operations are always lazy**, i.e. they do not process the stream at the call site. An intermediate operation can only process data when there is a terminal operation. Some of the intermediate operations are *filter*, *map* and *flatMap*.

In contrast, terminal operations terminate the pipeline and initiate stream processing. The stream is passed through all intermediate operations during terminal operation call. Terminal operations include *forEach*, *reduce, Collect* and *sum*.

To drive this point home, let's look at an example with side effects:

```java
public static void main(String[] args) {
    System.out.println("Stream without terminal operation");

    Arrays.stream(newint[] { 1, 2, 3 }).map(i -> {
        System.out.println("doubling " + i);
				return i * 2;
    });

    System.out.println("Stream with terminal operation");
    Arrays.stream(newint[] { 1, 2, 3 }).map(i -> {
        System.out.println("doubling " + i);
				return i * 2;
    }).sum();
}
```

The output will be as follows:

```
Stream without terminal operation
Stream with terminal operation
doubling 1
doubling 2
doubling 3
```

As we can see, the intermediate operations are only triggered when a terminal operation exists.

The intermediate Stream operation returns another Stream, which means you can further call other methods of Stream class to compose a pipeline.

For example after calling map() or flatMap() you can still call filter() method on Stream.

On the other hand, the terminal operation produces a result other than Streams like a value or a Collection.

Once a terminal method like

[forEach()](https://javarevisited.blogspot.com/2015/09/java-8-foreach-loop-example.html#axzz5Hvw8WGhy)

or

[collect()](https://javarevisited.blogspot.com/2018/05/java-8-filter-map-collect-stream-example.html)

is called, you cannot call any other method of Stream or reuse the Stream.

![https://3.bp.blogspot.com/-5Lf3xg8RCZ4/W8MUfZ9BSKI/AAAAAAAAMbE/dc_zHZUAUYAaht8ZRAyAkEYe5JiFZzT8gCLcBGAs/w610-h324/Java%2B8%2BStream%2BExamples.png](https://3.bp.blogspot.com/-5Lf3xg8RCZ4/W8MUfZ9BSKI/AAAAAAAAMbE/dc_zHZUAUYAaht8ZRAyAkEYe5JiFZzT8gCLcBGAs/w610-h324/Java%2B8%2BStream%2BExamples.png)

# **What Is the Difference Between *Map* and *flatMap* Stream Operation?**

There is a difference in signature between *map* and *flatMap*. Generally speaking, a *map* operation wraps its return value inside its ordinal type, while *flatMap* does not.

For example, in *Optional*, a *map* operation would return *Optional<String>* type, while *flatMap* would return *String* type.

So after mapping, we need to unwrap (read “flatten”) the object to retrieve the value, whereas after flat mapping, there is no such need as the object is already flattened. We apply the same concept to mapping and flat mapping in *Stream*.

Both *map* and *flatMap* are intermediate stream operations that receive a function and apply this function to all the elements of a stream.

The difference is that for the *map*, this function returns a value, but for *flatMap*, this function returns a stream. The *flatMap* operation “flattens” the streams into one.

Here's an example where we take a map of users' names and lists of phones and “flatten” it down to a list of phones of all the users using *flatMap*:

```java
Map<String, List<String>> people =new HashMap<>();
people.put("John", Arrays.asList("555-1123", "555-3389"));
people.put("Mary", Arrays.asList("555-2243", "555-5264"));
people.put("Steve", Arrays.asList("555-6654", "555-3242"));

List<String> phones = people.values().stream()
  .flatMap(Collection::stream)
    .collect(Collectors.toList());
```

# **What Is Stream Pipelining in Java 8?**

Stream pipelining is the concept of chaining operations together. We do this by splitting the operations that can happen on a stream into two categories: intermediate operations and terminal operations.

Each intermediate operation returns an instance of Stream itself when it runs. Therefore, we can set up an arbitrary number of intermediate operations to process data, forming a processing pipeline.

There must then be a terminal operation which returns a final value and terminates the pipeline.

### **What does the map() function do? why you use it?**

The map() function perform map functional operation in Java. This means it can transform one type of object to others by applying a function.

For example, if you have a List of String and you want to convert that to a List of Integer, you can use map() to do so.

Just supply a function to convert String to Integer e.g., parseInt() to map() and it will apply that to all elements of List and give you a List of Integer. In other words, the map can convert one object to another.

![https://3.bp.blogspot.com/-rN4VzB5fh2k/W8MTGl24vZI/AAAAAAAAMaw/dnlBDHhJTAMCdYs4IaSqNJgc6xtzkiN1wCLcBGAs/w598-h325/Java%2B8%2BComparator%2Bexample.png](https://3.bp.blogspot.com/-rN4VzB5fh2k/W8MTGl24vZI/AAAAAAAAMaw/dnlBDHhJTAMCdYs4IaSqNJgc6xtzkiN1wCLcBGAs/w598-h325/Java%2B8%2BComparator%2Bexample.png)

### **What does the filter() method do? when you use it?**

The filter method is used to filter elements that satisfy a certain condition that is specified using a Predicate function.

A predicate function is nothing but a function that takes an Object and returns a boolean. For example, if you have a List of Integer and you want a list of even integers.

In this case, you can use the filter to achieve that. You supply a function to check if a number is even or odd, just like this function, and filter will apply this to stream elements and filter the elements which satisfy the condition and which don't.

### **What does the flatmap() function do? why you need it?**

**The flatmap function is an extension of the map function.** Apart from transforming one object into another, it can also flatten it.

For example, if you have a list of the list but you want to combine all elements of lists into just one list. In this case, you can use flatMap() for flattening. At the same time, you can also transform an object like you do use map() function.

### **What does the peek() method do? When should you use it?**

The peek() method of Stream class allows you to see through a Stream pipeline. You can peek through each step and print meaningful messages on the console. It's generally used for debugging issues related to lambda expression and Stream processing.

### **What do you mean by saying Stream is lazy?**

When we say Stream is lazy, we mean that most of the methods are defined on Java .util.stream.Stream class is lazy i.e. they will not work by just including them on the Stream pipeline, i.e. data will not be returned if we only have intermediate steps that return Stream.

They only work when you call a terminal method on the Stream and finish as soon as they find the data they are looking for rather than scanning through the whole set of data.

### **What is a functional interface in Java 8?**

As the name suggests, a functional interface is an interface that represents a function. Technically, an interface with just one abstract method is called a functional interface.

You can also use @FunctionalInterface to annotate a functional interface. In that case, the compiler will verify if the interface actually contains just one abstract method or not. It's like the [@Override annotation](http://javarevisited.blogspot.sg/2012/11/why-use-override-annotation-in-java.html), which prevents you from accidental errors.

**Another useful thing to know is that If a method accepts a functional interface, then you can pass a lambda expression to it.**

Some examples of the functional interface are Runnable, Callable, Comparator, and Comparable from old API and Supplier, Consumer, and Predicate, etc. from new function API.

### **What is the difference between a normal and functional interface in Java?**

The normal interface in Java can contain any number of abstract methods, while the functional interface can only contain just one abstract method.

You might be thinking why they are called functional interfaces? Once you know the answer, it might be a little easier for you to remember the concept.

Well, they are called functional interfaces because they wrap a function as an interface. The function is represented by the single abstract method on the interface.

## **What is the difference between the findFirst() and findAny() method?**

The findFirst() method will return the first element meeting the criterion i.e. Predicate, while the findAny() method will return any element meeting the criterion, very useful while working with a parallel stream. You can further see [this](http://www.java67.com/2018/03/java-8-stream-find-first-and-filter-example.html) article for a working example of the findFirst() method in Java 8.

## **What is a Predicate interface?**

A Predicate is a functional interface that represents a function, which takes an Object and returns a boolean. It is used in several Stream methods like [filter()](https://javarevisited.blogspot.com/2018/05/java-8-filter-map-collect-stream-example.html), which uses Predicate to filter unwanted elements.here is how a Predicate function looks like:

```java
public boolean test(T object){
   return boolean; 
}
```

You can see it just has one test() method which takes an object and returns a boolean. The method is used to test a condition if it passes; it returns true otherwise false.

## **What are Supplier and Consumer Functional interface?**

The Supplier is a functional interface that returns an object. It's similar to the factory method or new(), which returns an object.The Supplier has get() functional method, which doesn't take any argument and return an object of type T. This means you can use it anytime you need an object.Since it is a functional interface, you can also use it as the assignment target for a [lambda expression](https://javarevisited.blogspot.sg/2014/02/10-example-of-lambda-expressions-in-java8.html) or [method reference](https://javarevisited.blogspot.com/2017/03/what-is-method-references-in-java-8-example.html).

A Consumer is also a functional interface in JDK 8, which represents an operation that accepts a single input argument and returns no result.Unlike other functional interfaces, Consumer is expected to operate via side-effects. The functional method of Consumer is accept(T t), and because it's a functional interface, you can use it as the assignment target for a lambda expression or method interface in [Java 8](https://javarevisited.blogspot.com/2018/08/top-5-java-8-courses-to-learn-online.html).

## **Can you convert an array to Stream? How?**

Yes, you can convert an array to Stream in Java. The Stream class provides a factory method to create a Stream from an array, like Stream .of(T ...) which accepts a variable argument, that means you can also pass an array to it as shown in the following example:

```
String[] languages = {"Java", "Python", "JavaScript"};
Stream numbers = Stream.of(languages);
numbers.forEach(System.out::println);

Output:
Java
Python
JavaScript
```

So, yes, it's possible to convert an array to Stream in Java 8. You can even [convert an ArrayList to Stream](http://www.java67.com/2017/04/how-to-convert-java-8-stream-to-array-and-list-in-java.html), as explained in that article.

## **What is the parallel Stream? How can you get a parallel stream from a List?**

A parallel stream can parallel execute stream processing tasks. For example, if you have a parallel stream of 1 million orders and you are looking for orders worth more than 1 million, then you can use a [filter](http://javarevisited.blogspot.sg/2015/02/how-to-filter-collections-in-java-8.html#axzz54XTmd0RX) to do that.Unlike sequential Stream, the parallel Stream can launch multiple threads to search for those orders on the different parts of the Stream and then combine the result.In short, the parallel Stream can paralyze execution, but, as Cay S. Horstman mentioned in [Core Java S.E. for the Impatient](https://www.java67.com/2015/05/best-book-to-learn-java-for-beginners.html), there is significant overhead or parallelism, which only pays off if you are doing bulk data operation.

## Difference between streams and loops

**Streams are a more declarative style**. Or a more **expressive** style. It may be considered better to declare your intent in code, than to describe *how* it's done:

```java
 return people
     .filter( p -> p.age() < 19)
     .collect(toList());

```

... says quite clearly that you're filtering matching elements from a list, whereas:

```java
 List<Person> filtered = new ArrayList<>();
 for(Person p : people) {
     if(p.age() < 19) {
         filtered.add(p);
     }
 }
 return filtered;

```

Says "I'm doing a loop". The purpose of the loop is buried deeper in the logic.

Streams are often **terser**. The same example shows this. Terser isn't always better, but if you can be terse and expressive at the same time, so much the better.

**Streams have a strong affinity with functions**. Java 8 introduces lambdas and functional interfaces, which opens a whole toybox of powerful techniques. Streams provide the most convenient and natural way to apply functions to sequences of objects.

**Streams encourage less mutability**. This is sort of related to the functional programming aspect -- the kind of programs you write using streams tend to be the kind of programs where you don't modify objects.

**Streams encourage looser coupling**. Your stream-handling code doesn't need to know the source of the stream, or its eventual terminating method.

**Streams can succinctly express quite sophisticated behaviour**. For example:

```
 stream.filter(myfilter).findFirst();

```

Might look at first glance as if it filters the whole stream, then returns the first element. But in fact `findFirst()` drives the whole operation, so it efficiently stops after finding one item.

**Streams provide scope for future efficiency gains**. Some people have benchmarked and found that single-threaded streams from in-memory `List`s or arrays can be slower than the equivalent loop. This is plausible because there are more objects and overheads in play.

But streams scale. As well as Java's built-in support for parallel stream operations, there are a few libraries for distributed map-reduce using Streams as the API, because the model fits.

**Disadvantages?**

**Performance**: A `for` loop through an array is extremely lightweight both in terms of heap and CPU usage. If raw speed and memory thriftiness is a priority, using a stream is worse.

**Familiarity**.The world is full of experienced procedural programmers, from many language backgrounds, for whom loops are familiar and streams are novel. In some environments, you want to write code that's familiar to that kind of person.

**Cognitive overhead**. Because of its declarative nature, and increased abstraction from what's happening underneath, you may need to build a new mental model of how code relates to execution. Actually you only need to do this when things go wrong, or if you need to deeply analyse performance or subtle bugs. When it "just works", it just works.

**Debuggers** are improving, but even now, when you're stepping through stream code in a debugger, it can be harder work than the equivalent loop, because a simple loop is very close to the variables and code locations that a traditional debugger works with.

Also: [https://blog.jdriven.com/2019/10/loop/](https://blog.jdriven.com/2019/10/loop/)

## Implement a Stream<T>

The JDK's standard implementation of `Stream` is the internal class `java.util.stream.ReferencePipeline`, you cannot instantiate it directly.

Instead you can use `java.util.stream.Stream.builder()`, `java.util.stream.StreamSupport.stream(Spliterator<T>, boolean)` and various[1](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html#of-T...-), [2](https://docs.oracle.com/javase/8/docs/api/java/util/stream/package-summary.html#StreamSources) other static factory methods to create an instance of the default implementation.

Using a spliterator is probably the most powerful approach as it allows you to provide objects lazily while also enabling efficient parallelization if your source can be divided into multiple chunks.

Additionally you can also convert streams back into spliterators, wrap them in a custom spliterator and then convert them back into a stream if you need to implement your own *stateful intermediate operations* - e.g. due to shortcomings in the standard APIs - since most available intermediate ops [are not allowed to be stateful](https://docs.oracle.com/javase/8/docs/api/java/util/stream/package-summary.html#Statelessness).See [this SO answer](https://stackoverflow.com/a/28363324/1362755) for an example.

In principle you could write your own implementation of the stream interface, but that would be quite tedious.

Uma pergunta de nível médio seria:

- Qual o nome do padrão de uso dos Streams? Qual a diferença entre processar uma lista com um ciclo e com um Stream? O que é o que Stream faz por trás do pano que lhe confere vantagens?

Pegando no mesmo tema e elevando a dificuldade:

- Como implementarias tu o Stream<T>? Que cuidados terias de ter para manter o seu desempenho?