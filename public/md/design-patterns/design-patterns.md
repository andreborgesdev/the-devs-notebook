# Design Patterns

Useful Links:

- [https://refactoring.guru/design-patterns](https://refactoring.guru/design-patterns)

## SOLID Design Principles

1. Single Responsibility - a class should only have one responsibility. It should do one thing and one thing only. Furthermore, it should only have one reason to change.
2. Open for Extension/Closed for Modification or Open/Closed - classes should be open for extension, but closed for modification. In doing so, we stop ourselves from modifying existing code and causing potential new bugs in an otherwise happy application.
3. Liskov Substitution - if class A is a subtype of class B, then we should be able to replace B with A without disrupting the behavior of our program.
4. Interface Segregation - larger interfaces should be split into smaller ones. By doing so, we can ensure that implementing classes only need to be concerned about the methods that are of interest to them.
5. Dependency Inversion - The principle of Dependency Inversion refers to the decoupling of software modules. This way, instead of high-level modules depending on low-level modules, both will depend on abstractions.

## Singleton pattern

The singleton pattern ensures that a class has only one instance and ensures access to the instance through the application. It can be useful in cases where you have a "global" object with exactly one instance.

It should be noted that many people dislike the Singleton design pattern, even calling it an "anti-pattern". One reason for this is that it can interfere with unit testing.

```java
public class Restaurant {
	private static Restaurant _instance = null;
	protected Restaurant() {...}
	public static Restaurant getInstance() {
		if (_instance == null) {
			_instance = new Restaurant();
		}
		
		return _instance;
	}	
}
```

## Template Method Design Pattern

Template method design pattern is to define an algorithm as a skeleton of operations and leave the details to be implemented by the child classes. The overall structure and sequence of the algorithm is preserved by the parent class.
Template means Pre-set format like HTML templates which has a fixed pre-set format. Similarly in the template method pattern, we have a pre-set structure method called template method which consists of steps. This steps can be an abstract method which will be implemented by its subclasses.
This behavioural design pattern is one of the easiest to understand and implement. This design pattern is used popularly in framework development. This helps to avoid code duplication also.

## Builder Design Pattern

Builder pattern aims to “Separate the construction of a complex object from its representation so that the same construction process can create different representations.” It is used to construct a complex object step by step and the final step will return the object. The process of constructing an object should be generic so that it can be used to create different representations of the same object.

## Chain of Responsibility Design Pattern

Chain of responsibility pattern is used to achieve loose coupling in software design where a request from the client is passed to a chain of objects to process them. Later, the object in the chain will decide themselves who will be processing the request and whether the request is required to be sent to the next object in the chain or not.

## Factory Method Design Pattern

It is a creational design pattern which talks about the creation of an object. The factory design pattern says that define an interface ( A java interface or an abstract class) and let the subclasses decide which object to instantiate. The factory method in the interface lets a class defer the instantiation to one or more concrete subclasses. Since this design patterns talk about instantiation of an object and so it comes under the category of creational design pattern. If we notice the name Factory method, that means there is a method which is a factory, and in general factories are involved with creational stuff and here with this an object is being created. It is one of the best ways to create an object where object creation logic is hidden to the client.

Example:

```java
public class CardGame {
	public static CardGame createCardGame(GameType type) {
		if (type == GameType.Poker) {
			return new PokerGame();
		} else if (type == GameType.BlackJack) {
			return new BlackJackGame();
		}

		return null;
	}
}
```

## Facade Design Pattern

Facade is a part of Gang of Four design pattern and it is categorized under Structural design patterns. Before we dig into the details of it, let us discuss some examples which will be solved by this particular Pattern.
So, As the name suggests, it means the face of the building. The people walking past the road can only see this glass face of the building. They do not know anything about it, the wiring, the pipes and other complexities. It hides all the complexities of the building and displays a friendly face.
Same goes for the Facade Design Pattern. **It hides the complexities of the system and provides an interface to the client from where the client can access the system.**

## Proxy Design Pattern

Proxy pattern is used when we need to create a wrapper to cover the main object’s complexity from the client.
Proxy means ‘in place of’, representing’ or ‘in place of’ or ‘on behalf of’ are literal meanings of proxy and that directly explains Proxy Design Pattern.
Proxies are also called surrogates, handles, and wrappers. They are closely related in structure, but not purpose, to Adapters and Decorators.
A real world example can be a cheque or credit card is a proxy for what is in our bank account. It can be used in place of cash, and provides a means of accessing that cash when required. And that’s exactly what the Proxy pattern does – “Controls and manage access to the object they are protecting“.

## Composite Design Pattern

Composite pattern is a partitioning design pattern and describes a group of objects that is treated the same way as a single instance of the same type of object. The intent of a composite is to “compose” objects into tree structures to represent part-whole hierarchies. It allows you to have a tree structure and ask each node in the tree structure to perform a task.

## Prototype Design Pattern

Prototype allows us to hide the complexity of making new instances from the client. The concept is to copy an existing object rather than creating a new instance from scratch, something that may include costly operations. The existing object acts as a prototype and contains the state of the object. The newly copied object may change same properties only if required. This approach saves costly resources and time, especially when the object creation is a heavy process.
The prototype pattern is a creational design pattern. Prototype patterns is required, when object creation is time consuming, and costly operation, so we create object with existing object itself. One of the best available way to create object from existing objects are clone() method. Clone is the simplest approach to implement prototype pattern. However, it is your call to decide how to copy existing object based on your business model.

## Abstract Factory Pattern

Abstract Factory design pattern is one of the Creational pattern. Abstract Factory pattern is almost similar to Factory Pattern is considered as another layer of abstraction over factory pattern. Abstract Factory patterns work around a super-factory which creates other factories.
Abstract factory pattern implementation provides us a framework that allows us to create objects that follow a general pattern. So at runtime, abstract factory is coupled with any desired concrete factory which can create objects of desired type.

## Creational Pattern

Creational design patterns are concerned with the way of creating objects. These design patterns are used when a decision must be made at the time of instantiation of a class (i.e. creating an object of a class).

## Mediator Pattern

A Mediator Pattern says that "to define an object that encapsulates how a set of objects interact".

## Command Pattern

**Command** is a behavioral design pattern that turns a request into a stand-alone object that contains all information about the request. This transformation lets you pass requests as a method arguments, delay or queue a request’s execution, and support undoable operations.

## Strategy Pattern

**Strategy** is a behavioral design pattern that lets you define a family of algorithms, put each of them into a separate class, and make their objects interchangeable.