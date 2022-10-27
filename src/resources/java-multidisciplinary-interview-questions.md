# Multi disciplinary questions

![https://moriohcdn.b-cdn.net/6e11e90625.png](https://moriohcdn.b-cdn.net/6e11e90625.png)

### **Explain public static void main(String args[]) in Java.**

main() in Java is the entry point for any Java program. It is always written as **public static void main(String[] args)**.

- **public**: Public is an access modifier, which is used to specify who can access this method. Public means that this Method will be accessible by any Class.
- **static**: It is a keyword in java which identifies it is class-based. main() is made static in Java so that it can be accessed without creating the instance of a Class. In case, main is not made static then the compiler will throw an error as **main**() is called by the JVM before any objects are made and only static methods can be directly invoked via the class.
- **void**: It is the return type of the method. Void defines the method which will not return any value.
- **main**: It is the name of the method which is searched by JVM as a starting point for an application with a particular signature only. It is the method where the main execution occurs.
- **String args[]**: It is the parameter passed to the main method.

### **Why Java is platform independent?**

Java is called platform independent because of its byte codes which can run on any system irrespective of its underlying operating system.

### **Why Java is not 100% Object-oriented?**

Java is not 100% Object-oriented because it makes use of eight primitive data types such as boolean, byte, char, int, float, double, long, short which are not objects.

### **What are wrapper classes in Java?**

Wrapper classes convert the Java primitives into the reference types (objects). Every primitive data type has a class dedicated to it. These are known as wrapper classes because they “wrap” the primitive data type into an object of that class.

### **What is singleton class in Java and how can we make a class singleton?**

Singleton class is a class whose only one instance can be created at any given time, in one JVM. A class can be made singleton by making its constructor private.

### **What is the difference between equals() and == in Java?**

Equals() method is defined in Object class in Java and used for checking equality of two objects defined by business logic.

“==” or equality operator in Java is a binary operator provided by Java programming language and used to compare primitives and objects. 

*public boolean equals(Object o)* is the method provided by the Object class. The default implementation uses == operator to compare two objects. For example: method can be overridden like String class. equals() method is used to compare the values of two objects.

**In simple words, == checks if both objects point to the same memory location whereas .equals() evaluates to the comparison of values in the objects.**

### **What are the differences between Heap and Stack Memory in Java?**

![java-stack-vs-heap](./images/java-stack-vs-heap.png)

### **What is a package in Java? List down various advantages of packages.**

Packages in Java, are the collection of related classes and interfaces which are bundled together. By using packages, developers can easily modularize the code and optimize its reuse. Also, the code within the packages can be imported by other classes and reused. Below I have listed down a few of its advantages:

- Packages help in avoiding name clashes
- They provide easier access control on the code
- Packages can also contain hidden classes which are not visible to the outer classes and only used within the package
- Creates a proper hierarchical structure which makes it easier to locate the related classes

### **Why pointers are not used in Java?**

Java doesn’t use pointers because they are unsafe and increases the complexity of the program. Since, Java is known for its simplicity of code, adding the concept of pointers will be contradicting. Moreover, since JVM is responsible for implicit memory allocation, thus in order to avoid direct access to memory by the user,  pointers are discouraged in Java.

### **What is JIT compiler in Java?**

JIT stands for Just-In-Time compiler in Java. It is a program that helps in converting the Java bytecode into instructions that are sent directly to the processor. By default, the JIT compiler is enabled in Java and is activated whenever a Java method is invoked. The JIT compiler then compiles the bytecode of the invoked method into native machine code, compiling it “just in time” to execute. Once the method has been compiled, the JVM summons the compiled code of that method directly rather than interpreting it. This is why it is often responsible for the performance optimization of Java applications at the run time.

## ****What are access modifiers in Java?****

In Java, access modifiers are special keywords which are used to restrict the access of a class, constructor, data member and method in another class. Java supports four types of access modifiers:

1. *Default*
2. *Private*
3. *Protected*
4. *Public*

![java-access-modifiers](./images/java-access-modifiers.png)

### **Define a Java Class.**

A class in Java is a blueprint which includes all your data.  A class contains fields (variables) and methods to describe the behavior of an object. Let’s have a look at the syntax of a class.

```java
class Abc {
	member variables // class body
	methods
}
```

An object is a real-world entity that has a state and behavior. An object has three characteristics:

1. State
2. Behavior
3. Identity

### **What is final keyword in Java?**

**final** is a special keyword in Java that is used as a non-access modifier. A final variable can be used in different contexts such as:

- **final variable**

When the final keyword is used with a variable then its value can’t be changed once assigned. In case the no value has been assigned to the final variable then using only the class constructor a value can be assigned to it.

- **final method**

When a method is declared final then it can’t be overridden by the inheriting class.

- **final class**

When a class is declared as final in Java, it can’t be extended by any subclass class but it can extend other class.

### **What is Java String Pool?**

Java String pool refers to a collection of Strings which are stored in heap memory. In this, whenever a new object is created, String pool first checks whether the object is already present in the pool or not. If it is present, then the same reference is returned to the variable else new object will be created in the String pool and the respective reference will be returned.

![https://d1jnx9ba8s6j9r.cloudfront.net/blog/wp-content/uploads/2019/04/String-pool-503x300.png](https://d1jnx9ba8s6j9r.cloudfront.net/blog/wp-content/uploads/2019/04/String-pool-503x300.png)

### **What is constructor chaining in Java?**

In Java, constructor chaining is the process of calling one constructor from another with respect to the current object. Constructor chaining is possible only through legacy where a subclass constructor is responsible for invoking the superclass’ constructor first. There could be any number of classes in the constructor chain. Constructor chaining can be achieved in two ways:

1. Within the same class using this()
2. From base class using super()

### **Difference between String, StringBuilder, and StringBuffer.**

![java-strings-differences](./images/java-strings-differences.png)

### **What is a classloader in Java?**

The **Java ClassLoader** is a subset of JVM (Java Virtual Machine) that is responsible for loading the class files. Whenever a Java program is executed it is first loaded by the classloader. Java provides three built-in classloaders:

1. Bootstrap ClassLoader
2. Extension ClassLoader
3. System/Application ClassLoader

### **Why Java Strings are immutable in nature?**

In Java, string objects are immutable in nature which simply means once the String object is created its state cannot be modified. Whenever you try to update the value of that object instead of updating the values of that particular object, Java creates a new string object. Java String objects are immutable as String objects are generally cached in the String pool. Since String literals are usually shared between multiple clients, action from one client might affect the rest. It enhances security, caching, synchronization, and performance of the application.

### **Can you override a private or static method in Java?**

You cannot override a private or static method in Java. If you create a similar method with the same return type and same method arguments in child class then it will hide the superclass method; this is known as method hiding. Similarly, you cannot override a private method in subclass because it’s not accessible there. What you can do is create another private method with the same name in the child class.

## How to make an immutable class?

Immutable class in java means that once an object is created, we cannot change its content. In Java, all the **[wrapper classes](https://www.geeksforgeeks.org/wrapper-classes-java/)** (like Integer, Boolean, Byte, Short) and String class is immutable. We can create our own immutable class as well. Prior to going ahead do go through characteristics of immutability in order to have a good understanding while implementing the same. Following are the requirements:

- The class must be declared as final so that child classes can’t be created.
- Data members in the class must be declared private so that direct access is not allowed.
- Data members in the class must be declared as final so that we can’t change the value of it after object creation.
- A parameterized constructor should initialize all the fields performing a deep copy so that data members can’t be modified with an object reference.
    - Deep Copy of objects should be performed in the getter methods to return a copy rather than returning the actual object reference)

# Array assignment

Array `a` is assigned with a new array:

![https://i.stack.imgur.com/HtGo8.png](https://i.stack.imgur.com/HtGo8.png)

Array `b` is assigned to the instance behind `a`:

![https://i.stack.imgur.com/Vc7BZ.png](https://i.stack.imgur.com/Vc7BZ.png)

Array `c` is assigned with a new array:

![https://i.stack.imgur.com/eKUa6.png](https://i.stack.imgur.com/eKUa6.png)

And finally `a` is assigned to the instance behind `c`, `b` was not re-assigned and still keeps a reference to the old `a`:

![https://i.stack.imgur.com/StbFs.png](https://i.stack.imgur.com/StbFs.png)

# Pass by value and reference

[https://stackoverflow.com/a/40523/7931798](https://stackoverflow.com/a/40523/7931798)

[https://stackoverflow.com/a/73021/7931798](https://stackoverflow.com/a/73021/7931798)

By definition, *pass by value* means you are making a copy in memory of the actual parameter's value that is passed in, a copy of the contents of the actual parameter. Use pass by value when when you are only "using" the parameter for some computation, not changing it for the client program.

In *pass by reference* (also called pass by address), a copy of the address of the actual parameter is stored. Use pass by reference when you are changing the parameter passed in by the client program.

**Java always passes arguments by value, NOT by reference**. In your example, you are still passing `obj` by its value, not the reference itself. Inside your method `changeName`, you are assigning another (local) reference, `obj`, to the same object you passed it as an argument. Once you modify that reference, you are modifying the original reference, `obj`, which is passed as an argument.

Java passes arguments by value. However, suppose a Dog myDog = new Dog("foo”) resides in memory address 42. After we pass it to a function, if we try to do myDog = new Dog("fifi”) this value will not be assigned to the myDog outside of this function. However, if we change some of its properties with a setter these changes will be exposed the the myDog outside of this function but it is the same myDog on the memory address 42, it didn't change the value, just its properties.

So, if we do = it will not assign the value to the parameter value but if we do a set it will change its properties without changing the memory address.

---

**EDIT:**

Let me explain this through an example:

```
public class Main
{
     public static void main(String[] args)
     {
          Foo f = new Foo("f");
          changeReference(f); // It won't change the reference!
          modifyReference(f); // It will change the object that the reference refers to!
     }
     public static void changeReference(Foo a)
     {
          Foo b = new Foo("b");
          a = b;
     }
     public static void modifyReference(Foo c)
     {
          c.setAttribute("c");
     }
}

```

I will explain this in steps:

1- Declaring a reference named `f` of type `Foo` and assign it to a new object of type `Foo` with an attribute `"f"`.

```
Foo f = new Foo("f");

```

![https://i.stack.imgur.com/arXpP.png](https://i.stack.imgur.com/arXpP.png)

2- From the method side, a reference of type `Foo` with a name `a` is declared and it's initially assigned to `null`.

```
public static void changeReference(Foo a)

```

![https://i.stack.imgur.com/k2LBD.png](https://i.stack.imgur.com/k2LBD.png)

3- As you call the method `changeReference`, the reference `a` will be assigned to the object which is passed as an argument.

```
changeReference(f);

```

![https://i.stack.imgur.com/1Ez74.png](https://i.stack.imgur.com/1Ez74.png)

4- Declaring a reference named `b` of type `Foo` and assign it to a new object of type `Foo` with an attribute `"b"`.

```
Foo b = new Foo("b");

```

![https://i.stack.imgur.com/Krx4N.png](https://i.stack.imgur.com/Krx4N.png)

5- `a = b` is re-assigning the reference `a` NOT `f` to the object whose its attribute is `"b"`.

![https://i.stack.imgur.com/rCluu.png](https://i.stack.imgur.com/rCluu.png)

---

6- As you call `modifyReference(Foo c)` method, a reference `c` is created and assigned to the object with attribute `"f"`.

![https://i.stack.imgur.com/PRZPg.png](https://i.stack.imgur.com/PRZPg.png)

7- `c.setAttribute("c");` will change the attribute of the object that reference `c` points to it, and it's same object that reference `f` points to it.

![https://i.stack.imgur.com/H9Qsf.png](https://i.stack.imgur.com/H9Qsf.png)

# Completely encapsulate an object

The process of wrapping up the data and, the code acting on the data together is known as encapsulation. This is a protective mechanism where we hide the data of one class from (an object of) another.

Since, variables hold the data of a class to encapsulate a class you need to declare the required variables (that you want to hide) private and provide public methods to access (read/write) them (getters and setters).

By doing so, you can access the variables only in the current class, they will be hidden from other classes, and can be accessed only through the provided methods. Therefore, it is also known as data hiding.

## **Encapsulating a class/object completely**

To encapsulate a class/ object completely you need to

- Declare all the variables of a the as private.
- Provide public setter and getter methods to modify and view their values.

## **What is object cloning in Java?**

Object cloning in Java is the process of creating an exact copy of an object. It basically means the ability to create an object with a similar state as the original object. To achieve this, Java provides a method **clone()** to make use of this functionality. This method creates a new instance of the class of the current object and then initializes all its fields with the exact same contents of corresponding fields. To object clone(), the marker interface **java.lang.Cloneable** must be implemented to avoid any runtime exceptions. One thing you must note is Object clone() is a protected method, thus you need to override it.

## Types of clones in Java

When we want to copy an object in Java, there are two possibilities that we need to consider, a shallow copy and a deep copy.

**For the shallow copy approach, we only copy field values, therefore the copy might be dependant on the original object. In the deep copy approach, we make sure that all the objects in the tree are deeply copied, so the copy isn't dependant on any earlier existing object that might ever change.**

A lazy copy can be defined as a combination of both shallow copy and deep copy. The mechanism follows a simple approach – at the initial state, shallow copy approach is used. A counter is also used to keep a track on how many objects share the data. When the program wants to modify the original object, it checks whether the object is shared or not. If the object is shared, then the deep copy mechanism is initiated.

A shallow copy is one in which **we only copy values of fields** from one object to another:

```java
@Test
public void whenShallowCopying_thenObjectsShouldNotBeSame() {

    Address address = new Address("Downing St 10", "London", "England");
    User pm = new User("Prime", "Minister", address);
    
    User shallowCopy = new User(
      pm.getFirstName(), pm.getLastName(), pm.getAddress());

    assertThat(shallowCopy)
      .isNotSameAs(pm);
}
```

In this case, *pm != shallowCopy*, which means that **they're different objects; however, the problem is that when we change any of the original *address'* properties, this will also affect the *shallowCopy*‘s address**.

We wouldn't bother with it if *Address* was immutable, but it's not:

```java
@Test
public void whenModifyingOriginalObject_ThenCopyShouldChange() {
 
    Address address = new Address("Downing St 10", "London", "England");
    User pm = new User("Prime", "Minister", address);
    User shallowCopy = new User(
      pm.getFirstName(), pm.getLastName(), pm.getAddress());

    address.setCountry("Great Britain");
    assertThat(shallowCopy.getAddress().getCountry())
      .isEqualTo(pm.getAddress().getCountry());
}
```

A deep copy is an alternative that solves this problem. Its advantage is that **each mutable object in the object graph is recursively copied**.

Since the copy isn't dependent on any mutable object that was created earlier, it won't get modified by accident like we saw with the shallow copy.

In the following sections, we'll discuss several deep copy implementations and demonstrate this advantage.

![https://media.geeksforgeeks.org/wp-content/uploads/shallow-copy.png](https://media.geeksforgeeks.org/wp-content/uploads/shallow-copy.png)

### **Copy Constructor**

The first implementation we'll examine is based on copy constructors:

```java
public Address(Address that) {
	this(that.getStreet(), that.getCity(), that.getCountry());
}
```

```java
public User(User that) {
	this(that.getFirstName(), that.getLastName(),new Address(that.getAddress()));
}
```

In the above implementation of the deep copy, we haven't created new *Strings* in our copy constructor because *String* is an immutable class.

As a result, they can't be modified by accident. Let's see if this works:

```java
@Test
public void whenModifyingOriginalObject_thenCopyShouldNotChange() {
    Address address = new Address("Downing St 10", "London", "England");
    User pm = new User("Prime", "Minister", address);
    User deepCopy = new User(pm);

    address.setCountry("Great Britain");
    assertNotEquals(
      pm.getAddress().getCountry(), 
      deepCopy.getAddress().getCountry());
}
```

### Cloneable Interface

The second implementation is based on the clone method inherited from *Object*. It's protected, but we need to override it as *public*.

We'll also add a marker interface, *Cloneable,* to the classes to indicate that the classes are actually cloneable.

Let's add the *clone()* method to the *Address* class:

```java
@Override
public Object clone() {
    try {
        return (Address) super.clone();
    } catch (CloneNotSupportedException e) {
        return new Address(this.street, this.getCity(), this.getCountry());
    }
}
```

Now let's implement *clone()* for the *User* class:

```java
@Override
public Object clone() {
    User user = null;
    try {
        user = (User) super.clone();
    } catch (CloneNotSupportedException e) {
        user = new User(
          this.getFirstName(), this.getLastName(), this.getAddress());
    }
    user.address = (Address) this.address.clone();
    return user;
}
```

**Note that the *super.clone()* call returns a shallow copy of an object, but we set deep copies of mutable fields manually, so the result is correct:**

```java
@Test
public void whenModifyingOriginalObject_thenCloneCopyShouldNotChange() {
    Address address = new Address("Downing St 10", "London", "England");
    User pm = new User("Prime", "Minister", address);
    User deepCopy = (User) pm.clone();

    address.setCountry("Great Britain");

    assertThat(deepCopy.getAddress().getCountry())
      .isNotEqualTo(pm.getAddress().getCountry());
}
```

![https://media.geeksforgeeks.org/wp-content/uploads/deep-copy.png](https://media.geeksforgeeks.org/wp-content/uploads/deep-copy.png)

## Primitive Types

![https://static.javatpoint.com/images/java-data-types.png](https://static.javatpoint.com/images/java-data-types.png)

![java-primitive-types](./images/java-primitive-types.png)

## Volatile keyword

In the absence of necessary synchronizations, the compiler, runtime, or processors may apply all sorts of optimizations. Even though these optimizations are beneficial most of the time, sometimes they can cause subtle issues.

Caching and reordering are among those optimizations that may surprise us in concurrent contexts. Java and the JVM provide many ways to control [memory order](https://www.baeldung.com/java-variable-handles#memory-ordering), and the *volatile* keyword is one of them.

It guarantees that when we write a value to a member variable, all threads will see the new value of the variable after the write.

[https://www.baeldung.com/java-volatile](https://www.baeldung.com/java-volatile)

# **Rules for Creating Interfaces**

In an interface, we're allowed to use:

- **[constants variables](https://www.baeldung.com/java-final)**
- **[abstract methods](https://www.baeldung.com/java-abstract-class)**
- **[static methods](https://www.baeldung.com/java-static-default-methods)**
- **[default methods](https://www.baeldung.com/java-static-default-methods)**

We also should remember that:

- we can't instantiate interfaces directly
- an interface can be empty, with no methods or variables in it
- we can't use the *final* word in the interface definition, as it will result in a compiler error
- all interface declarations should have the *public* or default access modifier; the *abstract* modifier will be added automatically by the compiler
- an interface method can't be *protected* or *final*
- up until Java 9, interface methods could not be *private*; however, Java 9 introduced the possibility to define **[private methods in interfaces](https://www.baeldung.com/java-interface-private-methods)**
- interface variables are *public*, *static*, and *final* by definition; we're not allowed to change their visibility

## Interface variables

They should be public static final

Interface variables are static because Java interfaces cannot be instantiated in their own right; the value of the variable must be assigned in a static context in which no instance exists. The final modifier ensures the value assigned to the interface variable is a true constant that cannot be re-assigned by program code.

## Default keyword

Like regular interface methods, **default methods are implicitly public;** there's no need to specify the *public* modifier.

Unlike regular interface methods, we **declare them with the *default* keyword at the beginning of the method signature**, and they **provide an implementation**.

```java
public interface MyInterface {
    
    // regular interface methods
    
    default void defaultMethod() {
        // default method implementation
    }
}
```

The reason why the Java 8 release included *default* methods is pretty obvious.

In a typical design based on abstractions, where an interface has one or multiple implementations, if one or more methods are added to the interface, all the implementations will be forced to implement them too. Otherwise, the design will just break down.

Default interface methods are an efficient way to deal with this issue. They **allow us to add new methods to an interface that are automatically available in the implementations**. Therefore, we don't need to modify the implementing classes.

In this way, **backward compatibility is neatly preserved** without having to refactor the implementers.

To better understand the functionality of *default* interface methods, let's create a simple example.

Suppose we have a naive *Vehicle* interface and just one implementation. There could be more, but let's keep it that simple:

```java
public interface Vehicle {
    
    String getBrand();
    
    String speedUp();
    
    String slowDown();
    
    default String turnAlarmOn() {
        return "Turning the vehicle alarm on.";
    }
    
    default String turnAlarmOff() {
        return "Turning the vehicle alarm off.";
    }
}
```

Now let's write the implementing class:

```java
public class Car implements Vehicle {

    private String brand;
    
    // constructors/getters
    
    @Override
    public String getBrand() {
        return brand;
    }
    
    @Override
    public String speedUp() {
        return "The car is speeding up.";
    }
    
    @Override
    public String slowDown() {
        return "The car is slowing down.";
    }
}
```

Finally, let's define a typical *main* class, which creates an instance of *Car* and calls its methods:

```java
public static void main(String[] args) { 
    Vehicle car = new Car("BMW");
    System.out.println(car.getBrand());
    System.out.println(car.speedUp());
    System.out.println(car.slowDown());
    System.out.println(car.turnAlarmOn());
    System.out.println(car.turnAlarmOff());
}
```

Please notice how the *default* methods, *turnAlarmOn()* and *turnAlarmOff(),* from our *Vehicle* interface are **automatically available in the *Car* class**.

Furthermore, if at some point we decide to add more *default* methods to the *Vehicle* interface, the application will still continue working, and we won't have to force the class to provide implementations for the new methods.

The most common use of interface default methods is **to incrementally provide additional functionality to a given type without breaking down the implementing classes.**

In addition, we can use them to **provide additional functionality around an existing abstract method**:

```java
public interface Vehicle {
    
    // additional interface methods 
    
    double getSpeed();
    
    default double getSpeedInKMH(double speed) {
       // conversion      
    }
}
```

For more: [https://www.baeldung.com/java-static-default-methods](https://www.baeldung.com/java-static-default-methods)

## Life cycle of a Java program

![https://www.startertutorials.com/corejava/wp-content/uploads/2014/09/Java-life-cycle.jpg](https://www.startertutorials.com/corejava/wp-content/uploads/2014/09/Java-life-cycle.jpg)

[https://www.startertutorials.com/corejava/life-cycle-java-program.html](https://www.startertutorials.com/corejava/life-cycle-java-program.html)

## **Differences Between Final, Finally and Finalize in Java**

[https://www.baeldung.com/java-final-finally-finalize](https://www.baeldung.com/java-final-finally-finalize)

# QUESTIONS FROM REDDIT (TEMP)

# JAVA/.Net/POO

· Explicar a Arquitetura três camadas? Porque se usa esta arquitetura, quais as suas vantagens? Quais são as camadas?

· Qual a diferença entre passar uma variável por valor ou referência?

· Quatro conceitos principais em OO?

- R - Encapsulamento, polimorfismo, herança, abstração.

· Sabe o que é MVC?

· Que frameworks conheces? Para que servem?

· O que é um ORM? Quais já usaste?

· Padrões desenho saber o que são? Quais conhece? Singleton? (R – instância única de uma classe) Factory? Command? Proxy?

· Como se implementa um Singleton?

· Posso ter um método private numa interface?

- R – Sim. Desde o Java 8 existe o conceito de default methods nas interfaces, e os private methods podem ser methods que esses default chamam

· Como tornar um objeto completamente encapsulado?

· O que é o Scope de uma variável?

· O que é herança? Porque é que é importante?

· Interface VS Classe abstrata. Já ouviste falar? O que são? Para que servem? Quais as diferenças?

- R - Permitem implementar polimorfismo; uma pode ser estendida (classe abstrata) a outra implementada (interface); nenhuma delas pode ser instanciada.

· Quem implementa uma interface é obrigado a implementar os seus métodos?

- Yes, it is mandatory to implement all the methods in a class that implements an interface until and unless that class is declared as an abstract class.

· O que é o Polimorfismo? Como se implementa o mesmo (exemplo)?

· Diferença entre classe e objeto?

- R – objeto é uma instância da classe

· O que é uma classe Static?

- R - Não pode ser instanciada nem se pode fazer overriden de métodos.

· Uma classe final pode ser estendida?

- R – Não.

· O que é um método Static?

- R - Invocado sem necessidade de instanciar a classe.

· O que é uma variável Static? E uma variável final?

- R - In Java, static variables are also called class variables. That is, they belong to a class and not a particular instance. As a result, **class initialization will initialize static variables.** In contrast, a class's instance will initialize the instance variables (non-static variables). All the instances of a class share the class's static variables.

· Que tipo de estruturas de dados conheces?

- R- List, array, set, maps, Tree, Graphs, Trie

· O que é a serialização de um objeto?

- R - Serialization is the conversion of an object to a series of bytes, so that the object can be easily saved to persistent storage or streamed across a communication link. The byte stream can then be deserialized - converted into a replica of the original object.

· O que é uma inner/nested class? P- Qual é a diferença de uma "inner" classe para uma classe normal?

- R - In Java, inner class refers to the class that is declared inside class or interface which were mainly introduced, to sum up, same logically relatable classes as Java is purely object-oriented so bringing it closer to the real world.

**There are certain advantages associated with inner classes are as follows:**

- Making code clean and readable.
- Private methods of the outer class can be accessed, so bringing a new dimension and making it closer to the real world.
- Optimizing the code module.

### **Types of Inner Classes**

There are basically four types of inner classes in java.

1. Nested Inner Class
2. Method Local Inner Classes
3. Static Nested Classes
4. Anonymous Inner Classes

· Overriding VS Overloading

- R - Redefinição do método vs vários métodos com mesmo nome, mas assinaturas diferentes – atenção que o tipo de retorno não faz parte da assinatura, esse tem que se manter igual tal como o nome.

· Quantos construtores podemos ter?

- R – vários, desde que os construtores recebam atributos diferentes

· Quantos níveis de acesso conheces?

- R – public / private / protected / package protected – default

· Qual o que se deve usar sempre?

- R- private com gets/seters

· O que é o GC (garbage collector)? Como funciona?

- R- Algoritmo de limpeza de memoria, objetos não referenciados

· Onde está o GC?

- R – JVM (java virtual machine)

· O que é um .jar? .ear? .war?

- R - Biblioteca de classes + conjunto de jar + webdescriptor app web

· O que é um namespace?

- R - Serve para organizar o código (ex: pt.isel.turmas)

· Swing (lightweight) vs AWT (heavyweight - depende dos native peers)? Swing mais lento?

o JSP? Servlet? JSP é uma Servlet? Jasper converte JSP em Servlet? Interpretada/Executada lado cliente ou servidor?

· Que métodos tem uma Servlet obrigatoriamente que ter?

- R - doGet / doPost

· Diferença entre um applet e uma aplicação?

**Java Application:**Java Application is just like a Java program that runs on an underlying **[operating system](https://www.geeksforgeeks.org/operating-systems/)** with the support of a **[virtual machine](https://www.geeksforgeeks.org/jvm-works-jvm-architecture/)**. It is also known as an **application program**. The **[graphical user interface](https://www.geeksforgeeks.org/what-is-the-difference-between-gui-and-cui/)** is not necessary to execute the java applications, it can be run with or without it.

**[Java Applet](https://www.geeksforgeeks.org/java-applet-basics/):**An applet is a Java program that can be embedded into a **[web page](https://www.geeksforgeeks.org/difference-between-static-and-dynamic-web-pages/)**. It runs inside the **[web browser](https://www.geeksforgeeks.org/difference-between-web-browser-and-web-server/)** and works at client side. An applet is embedded in an **[HTML page](https://www.geeksforgeeks.org/html-basics/)** using the **APPLET** or **OBJECT** tag and hosted on a web server. Applets are used to make the web site more dynamic and entertaining.

· Qual o mecanismo de tratamento de erros/ faltas no JAVA?

- R – Exceções; Try/ Catch

· Quantos catchs posso ter associados ao mesmo try?

- R - Vários

· Qual o objectivo do finnally numa exceção? É sempre executado?

- R - Yes, `finally` will be called after the execution of the `try` or `catch` code blocks.

The only times `finally` won't be called are:

1. If you invoke `System.exit()`
2. If you invoke `Runtime.getRuntime().halt(exitStatus)`
3. If the JVM crashes first
4. If the JVM reaches an infinite loop (or some other non-interruptable, non-terminating statement) in the `try` or `catch` block
5. If the OS forcibly terminates the JVM process; e.g., `kill -9 <pid>` on UNIX
6. If the host system dies; e.g., power failure, hardware error, OS panic, et cetera
7. If the `finally` block is going to be executed by a daemon thread and all other non-daemon threads exit before `finally` is called

· Porque é que se diz que o Java é "write once run anywhere"?

- R - Because of the JVM

· O que é RMI? Para que é utilizado?

· Qual a diferença ao importar "java.applet.Applet" e importar "java.applet.*"?

· Conhece expressões regulares (regex)? Exemplo de uma expressão para detetar email?

- R - Regular expressions are patterns used to match character combinations in strings.

· Diferença entre .equals() e == ?

· Diferença entre = e == ?