# OOP

### What is Object-Oriented Programming?

Object-Oriented Programming (OOP) is a programming paradigm based on the concept of "objects", which can contain data and code: data in the form of fields (often known as attributes or properties), and code in the form of procedures (often known as methods). OOP implements real-world entities like inheritance, polymorphism, encapsulation, and abstraction.

### Why use OOP?

- Simplifies complex problems by modeling them as objects
- Encourages code reuse through inheritance
- Promotes encapsulation for data security
- Supports polymorphism for flexibility
- Facilitates problem decomposition

### Main features of OOP

- **Inheritance**: Allows one class to inherit the properties and methods of another.
- **Encapsulation**: Bundles data and methods that operate on the data within one unit and restricts access to some components.
- **Polymorphism**: Allows entities to take multiple forms.
- **Abstraction**: Hides complex implementation details and shows only essential features.

### Limitations of OOP

- Not always suitable for small or simple problems
- Can require intensive testing and planning
- Potentially increases complexity and development time

### Class vs. Object

- **Class**: Blueprint for creating objects; defines properties and behaviors.
- **Object**: Instance of a class containing actual values and functionality.

### Encapsulation

Encapsulation hides the internal state of an object and requires all interaction to be performed through an object's methods.

### Abstraction

Abstraction hides complex implementation details and exposes only essential features.

### Difference Between Encapsulation and Abstraction

- **Encapsulation**: Information hiding (restricting access to internal state)
- **Abstraction**: Implementation hiding (simplifying interface)

### Polymorphism

Polymorphism enables a single interface to represent different underlying forms (data types). Types include:

- Compile-time (method overloading)
- Runtime (method overriding)

### Inheritance

Inheritance allows one class to derive properties and behavior from another class.

### Types of Inheritance

- Single
- Multiple (not supported directly in Java, but possible via interfaces)
- Multilevel
- Hierarchical
- Hybrid

### Composition vs. Aggregation vs. Association

- **Association**: General relationship between objects
- **Aggregation**: Has-a relationship where child can exist independently
- **Composition**: Stronger form of aggregation where child cannot exist without parent

### Constructor vs. Destructor

- **Constructor**: Initializes an object
- **Destructor**: Cleans up when object is no longer needed (automatic in Java via Garbage Collector)

### Inline Function

Instructs the compiler to insert the complete function code at each point the function is called.

### Virtual Function

A function that can be overridden in a derived class.

### Pure Virtual Function

Declares a function without implementing it; forces derived classes to provide implementation.

### Function Overloading vs. Method Overriding

- **Overloading**: Same method name, different parameters (compile-time)
- **Overriding**: Same method signature in subclass (runtime)

### Static Method and Members

Static members belong to the class, not instances. Static methods cannot use non-static data.

### Abstract Class vs. Interface

| Feature     | Abstract Class                              | Interface                                                            |
| ----------- | ------------------------------------------- | -------------------------------------------------------------------- |
| Methods     | Can have both abstract and concrete methods | Only abstract methods (Java 7), default and static methods (Java 8+) |
| Variables   | Can have instance variables                 | Only constants (public static final)                                 |
| Inheritance | Single inheritance                          | Multiple inheritance                                                 |

### Marker Interface

An interface with no methods or fields, used to mark a class for special treatment by tools or the compiler.

### Access Modifiers

- **Private**: Accessible only within the class
- **Protected**: Accessible within the package and subclasses
- **Public**: Accessible from any other class
- **Default (package-private)**: Accessible within the package

### Super Keyword

Used to access superclass methods and constructors.

### This Keyword

Refers to the current object instance.

### Final Keyword

Prevents further modification:

- **Variable**: Constant value
- **Method**: Cannot be overridden
- **Class**: Cannot be subclassed

### Garbage Collection (GC)

Automatic memory management in Java. Unreachable objects are automatically removed by the Garbage Collector.

### Exception vs. Error

|             | Exception                         | Error                                |
| ----------- | --------------------------------- | ------------------------------------ |
| Recoverable | Yes                               | No                                   |
| Example     | IOException, NullPointerException | OutOfMemoryError, StackOverflowError |

### Try/Catch/Finally

- **Try**: Code block to monitor for exceptions
- **Catch**: Handles the exception
- **Finally**: Executes code after try/catch, regardless of outcome

### Dynamic (Runtime) vs. Compile-Time Polymorphism

- **Dynamic**: Method overriding (decided at runtime)
- **Compile-Time**: Method overloading (decided at compile time)

### Copy Constructor

Special constructor used to create a new object as a copy of an existing object.

### Early vs. Late Binding

- **Early (Static)**: Method calls are resolved at compile time
- **Late (Dynamic)**: Method calls are resolved at runtime

### Sealed Modifier

Restricts which classes can extend or implement a class or interface (introduced in Java 17).

### Association Example

Teacher and Student: multiple students can associate with multiple teachers.

### Aggregation Example

Department and Teachers: Teachers can exist without a department.

### Composition Example

House and Rooms: Rooms cannot exist without the house.

### Friend Function (C++)

Not supported in Java. Java uses package-private and protected access instead.

### Static Method Restrictions

Static methods cannot access non-static members directly.

### Tokens

Smallest element in the program, such as keywords, operators, identifiers, etc.

### Can an Abstract Class Have Instances?

No, abstract classes cannot be instantiated directly.

### Does Java Support Operator Overloading?

No, Java does not support custom operator overloading.

### Difference Between Structure and Class

Structures (not present in Java) default to public access, while classes default to private. Structures typically group data, while classes encapsulate data and behavior.

### Key OOP Design Principles

- **Single Responsibility**
- **Open/Closed**
- **Liskov Substitution**
- **Interface Segregation**
- **Dependency Inversion**

These principles guide effective and maintainable object-oriented design.

### Can Java Run Without OOP?

Yes, small programs can be written without explicit use of OOP, but for larger applications OOP is essential.

### Multiple Inheritance in Java

Java does not support multiple inheritance with classes but achieves it through interfaces.

### Example of Early and Late Binding

Provided in the original content for compile-time and runtime polymorphism.

### Finalize Method

Deprecated in Java 9 and removed in Java 18. Previously used for cleanup before GC.

### Exception Handling Example

```java
try {
    int result = 10 / 0;
} catch (ArithmeticException e) {
    System.out.println("Cannot divide by zero");
} finally {
    System.out.println("Cleanup actions");
}
```

### Constructors Types

- Default Constructor
- Parameterized Constructor
- Copy Constructor

### Memory Usage

Classes themselves do not consume memory until objects are instantiated.

### Overloading vs. Overriding Table

| Feature     | Overloading                            | Overriding                                  |
| ----------- | -------------------------------------- | ------------------------------------------- |
| Definition  | Same method name, different parameters | Same method name and parameters in subclass |
| Binding     | Compile-time                           | Runtime                                     |
| Inheritance | Not required                           | Required                                    |

### Other Programming Paradigms

- Imperative
- Declarative
- Functional
- Logical
- Procedural

### Can Static Methods Use Non-Static Members?

No, static methods cannot directly access non-static members.

### Java's Default Access Modifier

Package-private (default): accessible only within the same package.

### Can We Call Base Method Without Creating an Instance?

Yes, if the method is static.

### Difference Between New and Override Keywords

- **New**: Hides the base class method.
- **Override**: Replaces base class method implementation.

### Abstract Class vs. Interface Summary

Abstract classes can have both abstract and concrete methods, fields, and constructors, whereas interfaces cannot have constructors and prior to Java 8 could only have abstract methods.

### Example of Final Variable

```java
final int MAX_SPEED = 120;
```

### Example of Ternary Operator

```java
String result = (score >= 50) ? "Pass" : "Fail";
```
