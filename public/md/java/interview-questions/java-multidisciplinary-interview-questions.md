# Java Multidisciplinary Interview Questions & Answers

### What does `public static void main(String[] args)` mean?

- **public**: Accessible by any class.
- **static**: Can be called without creating an object.
- **void**: Does not return a value.
- **main**: Entry point for Java applications.
- **String\[] args**: Command-line arguments.

### Why is Java platform independent?

Java code is compiled into bytecode, which can run on any system with a compatible JVM.

### Why isn’t Java 100% Object-Oriented?

It uses primitive data types (boolean, byte, char, int, float, double, long, short) which are not objects.

### What are wrapper classes?

They convert primitive types into objects (e.g., `Integer`, `Double`).

### What is a singleton class?

A class that allows only one instance. Achieved by making the constructor private.

### `equals()` vs `==`

- **equals()**: Compares values.
- **==**: Compares memory addresses.

### Heap vs Stack Memory

- **Heap**: Stores objects.
- **Stack**: Stores method calls and local variables.

### What are packages?

A way to organize classes and interfaces, avoid name clashes, and control access.

### Why no pointers in Java?

For safety and simplicity; Java handles memory allocation automatically.

### What is the JIT compiler?

Just-In-Time compiler translates bytecode to native machine code at runtime for performance optimization.

### Access Modifiers

- **default**
- **private**
- **protected**
- **public**

### Define a Java class

```java
class Abc {
    // member variables
    // methods
}
```

### What is the `final` keyword?

- **final variable**: Cannot be reassigned.
- **final method**: Cannot be overridden.
- **final class**: Cannot be extended.

### What is the String Pool?

A memory area in the heap storing unique String literals to save memory.

### Constructor chaining

Calling one constructor from another using `this()` or `super()`.

### String vs StringBuilder vs StringBuffer

- **String**: Immutable.
- **StringBuilder**: Mutable, not thread-safe.
- **StringBuffer**: Mutable, thread-safe.

### What is a ClassLoader?

Loads class files at runtime into the JVM.

### Why are Strings immutable?

For security, caching, synchronization, and performance.

### Can you override private/static methods?

No. Private methods are hidden, static methods can be hidden but not overridden.

### How to make an immutable class

- Declare class as `final`.
- Private final fields.
- No setters.
- Perform deep copies in constructors and getters.

### Array assignment

Array references point to memory addresses. Assignments change the reference, not the actual array.

### Pass by value

Java always passes arguments by value. Object references are passed by value, meaning the reference itself is copied.

### Encapsulation

Wrap data (fields) and methods into a single unit. Keep fields private and provide public getters/setters.

### Object cloning

- **Shallow copy**: Copies field values.
- **Deep copy**: Recursively copies all objects.
- Achieved via `clone()` method or copy constructors.

### Primitive Types

Primitive types are predefined data types (byte, short, int, long, float, double, char, boolean).

### `volatile` keyword

Ensures visibility of changes to variables across threads.

### Rules for creating interfaces

- Constants, abstract methods, static methods, default methods allowed.
- Variables must be `public static final`.

### Default methods in interfaces

Provide method implementations in interfaces for backward compatibility.

### Java program life cycle

1. Write source code (.java).
2. Compile to bytecode (.class).
3. Load classes via ClassLoader.
4. Execute bytecode via JVM.

### Differences Between `final`, `finally`, and `finalize`

- **final**: Constant declaration.
- **finally**: Code block that always executes after try/catch.
- **finalize()**: Method called before object garbage collection.

### Explain the three-layer architecture. Why is this architecture used, what are its advantages, and what are the layers?

**Answer:**
The three-layer architecture separates an application into:

- **Presentation Layer (UI)**
- **Business Logic Layer (Service)**
- **Data Access Layer (Repository)**

**Advantages:**

- Separation of concerns
- Easier maintenance
- Scalability
- Improved testability

### What is the difference between passing a variable by value or by reference?

**Answer:**

- **Pass by value:** A copy of the variable’s value is passed. Changes do not affect the original value.
- **Pass by reference:** A reference to the original object is passed. Changes affect the original object.
  Note: Java always passes by value, but when passing objects, the reference itself is passed by value.

### What are the four main concepts in OOP?

**Answer:**
Encapsulation, polymorphism, inheritance, abstraction.

### Do you know what MVC is?

**Answer:**
Yes. Model-View-Controller is a software design pattern that separates the application into three interconnected components:

- **Model:** Data and business logic
- **View:** User interface
- **Controller:** Handles input and updates the model and view

### Which frameworks do you know? What are they for?

**Answer:**
Examples include Spring, Hibernate, ASP.NET, Angular, and React. They help accelerate development, provide structure, and simplify common tasks.

### What is an ORM? Which ones have you used?

**Answer:**
An ORM (Object-Relational Mapping) maps database tables to Java objects. Examples include Hibernate, Entity Framework, and JPA.

### Do you know what design patterns are? Which ones do you know?

**Answer:**
Design patterns are reusable solutions to common software design problems. Common patterns include Singleton (ensures only one instance exists), Factory, Command, and Proxy.

### How is a Singleton implemented?

**Answer:**
By creating a private constructor and providing a static method to get the instance.

### Can I have a private method in an interface?

**Answer:**
Yes. Since Java 9, private methods can be defined inside interfaces to support code reuse among default methods.

### How to make an object fully encapsulated?

**Answer:**
Declare all variables as private and provide public getter and setter methods.

### What is the scope of a variable?

**Answer:**
The scope defines where the variable can be accessed in the code.

### What is inheritance and why is it important?

**Answer:**
Inheritance allows one class to inherit fields and methods from another, promoting code reuse and hierarchical classification.

### Interface vs Abstract class. What are they? What are the differences?

**Answer:**
Both allow abstraction and polymorphism.

- Abstract class: Can have both abstract and concrete methods. Supports constructors and state.
- Interface: Only method declarations and constants (though since Java 8, default and static methods are allowed). Neither can be instantiated directly.

### Is it mandatory to implement all methods of an interface?

**Answer:**
Yes, unless the implementing class is declared abstract.

### What is polymorphism? How is it implemented?

**Answer:**
Polymorphism allows objects to be treated as instances of their parent type. Implemented via method overriding and overloading.

### Difference between class and object?

**Answer:**
A class is a blueprint. An object is an instance of a class.

### What is a static class?

**Answer:**
Cannot be instantiated or have overridden methods. In Java, only nested static classes exist.

### Can a final class be extended?

**Answer:**
No.

### What is a static method?

**Answer:**
A method invoked without creating an instance of the class.

### What is a static variable? And a final variable?

**Answer:**
Static variables belong to the class, not instances. Final variables cannot be reassigned once initialized.

### What data structures do you know?

**Answer:**
List, array, set, map, tree, graph, trie.

### What is object serialization?

**Answer:**
Serialization converts an object into a byte stream for storage or transmission. Deserialization restores the object from the stream.

### What is an inner/nested class? What’s the difference from a normal class?

**Answer:**
An inner class is declared inside another class or interface.
**Advantages:**

- Code clarity
- Can access private members of the outer class
- Modularizes related code

Types: Nested Inner Class, Method Local Inner Class, Static Nested Class, Anonymous Inner Class

### Overriding vs Overloading

**Answer:**

- **Overriding:** Redefining a method in a subclass.
- **Overloading:** Defining multiple methods with the same name but different parameter lists. Return type is not part of the method signature.

### How many constructors can a class have?

**Answer:**
Multiple, as long as each has different parameters (constructor overloading).

### How many access levels do you know?

**Answer:**
Public, private, protected, and package-private (default).

### Which access level should generally be used?

**Answer:**
Private with getters and setters for controlled access.

### What is the Garbage Collector (GC)? How does it work?

**Answer:**
GC automatically reclaims memory by removing objects that are no longer referenced.

### Where is the GC located?

**Answer:**
Inside the JVM.

### What is a .jar, .ear, and .war file?

**Answer:**

- **.jar:** Java Archive containing class files and metadata.
- **.ear:** Enterprise Archive containing multiple modules (web, EJB, etc.).
- **.war:** Web Application Archive containing web components.

### What is a namespace?

**Answer:**
A namespace organizes code and avoids name conflicts (example: pt.isel.turmas).

### Swing (lightweight) vs AWT (heavyweight). Is Swing slower?

**Answer:**
Swing is lightweight and independent of native peers, offering more flexibility. AWT is heavyweight and depends on the platform's GUI components. Swing may be slightly slower but provides more consistent UI across platforms.

### JSP and Servlet. Is JSP a Servlet? Is it interpreted/executed client-side or server-side?

**Answer:**
JSPs are essentially Servlets. They are compiled into Servlets by the server and executed on the server-side.

### What methods must a Servlet have?

**Answer:**
doGet and doPost (depending on the type of HTTP request).

### Difference between an applet and an application?

**Answer:**

- **Java Application:** Runs directly on the JVM with or without a GUI.
- **Applet:** Runs in a web browser, embedded in an HTML page. Applets are now considered obsolete.

### What is the error handling mechanism in Java?

**Answer:**
Exceptions using try/catch blocks.

### How many catch blocks can be associated with a single try?

**Answer:**
Multiple.

### What is the purpose of finally in an exception? Is it always executed?

**Answer:**
The finally block is used to execute code after the try or catch blocks, typically for cleanup operations. It is almost always executed except in cases like System.exit(), JVM crashes, or when the thread is forcibly terminated.

### Why is Java said to be "write once, run anywhere"?

**Answer:**
Because Java code is compiled into bytecode that can run on any platform with a compatible JVM.

### What is RMI and what is it used for?

**Answer:**
RMI (Remote Method Invocation) allows Java programs to invoke methods on remote objects located on different JVMs.

### What is the difference between importing "java.applet.Applet" and "java.applet.\*"?

**Answer:**

- **java.applet.Applet:** Imports only the Applet class.
- **java.applet.\*:** Imports all classes in the java.applet package.

### Are you familiar with regular expressions (regex)? Example of an expression to detect emails?

**Answer:**
Yes. Example regex for email detection:
`^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$`

### Difference between .equals() and == ?

**Answer:**

- **==:** Compares reference/memory addresses.
- **equals():** Compares values/content.

### Difference between = and == ?

**Answer:**

- **=:** Assignment operator.
- **==:** Equality comparison operator.
