# JAVA Collections

A collection is like a little container that can have 0 1 or many elements.

## Collections

The collections framework's top interface is the collection interface on that seem to face which most of the collections extend from. Each collection has two, or more than two in many cases, different components. Firstly, there are the interfaces. Then there's the implementation of those interfaces, So the interfaces here, like the list and sets. They define multiple different data structures that can implement this interface. They define the functional characteristics of the collection, so they define things like ordering, uniqueness. They don't define how the collection is implemented under the hood. If you're declaring a variable, it's a collection.

In Java, you always want to prefer the interface as the type on that variable where possible.

Often there is a particularly popular implementation of that interface implementations define specific data structure, a specific away, off implementing a given interface.

Each data structure has a different set of performance characteristics, so it's important that you know the right data structure to choose when you want a certain interface functional characteristics as well. Implementations are concrete, and in Stan Shal, so while should declare a variable type is the list you would always in Stan, she ate it with a specific implementation.

![java-collections-api](../../images/java-collections-api.png)

![java-map-api](../../images/java-map-api.png)

![java-collections-interfaces-vs-implementation](../../images/java-collections-interfaces-vs-implementation.png)

## Collection Behaviors

It's important to note of the collection interface actually extends another interface. That's to say the iterable interface and the iterable interface allows us to create this object called iterator. That is the way that we loop over the elements within a Java collection. As we'll see in Module 5, there's actually new concept in Java 8 called streams that is proving to be a very popular way of performing some of the same operations on often a better way of doing it. But iterators are still covered because they're absolutely key to collections and you'll see them all over the place in any code that exists in the JDK or in your own code before Java 8.

![java-iterable](../../images/java-iterable.png)

![java-collections-cheat-sheet](../../images/java-collections-cheat-sheet.png)

![https://miro.medium.com/max/1400/1*Ge_3VrVfKOnVIv7OdLXlog.jpeg](https://miro.medium.com/max/1400/1*Ge_3VrVfKOnVIv7OdLXlog.jpeg)

![https://code.intfast.ca/images/JavaCollections.jpg](https://code.intfast.ca/images/JavaCollections.jpg)

![https://miro.medium.com/max/1400/1*ZhEFIo3v6lmnyhc8gI2foQ.png](https://miro.medium.com/max/1400/1*ZhEFIo3v6lmnyhc8gI2foQ.png)

![https://miro.medium.com/max/800/1*QSi6EBlAxXMNDnOyt4liVQ.jpeg](https://miro.medium.com/max/800/1*QSi6EBlAxXMNDnOyt4liVQ.jpeg)
