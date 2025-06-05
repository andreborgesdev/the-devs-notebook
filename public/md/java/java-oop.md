# Java Object-Oriented Programming (OOP)

## Core OOP Principles

### 1. Encapsulation

Encapsulation is the bundling of data and methods that operate on that data within a single unit (class), and restricting direct access to some components.

```java
public class BankAccount {
    private double balance;  // Private field
    private String accountNumber;

    public BankAccount(String accountNumber, double initialBalance) {
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
    }

    // Public getter method
    public double getBalance() {
        return balance;
    }

    // Public setter with validation
    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
        }
    }

    public boolean withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            return true;
        }
        return false;
    }
}
```

### 2. Inheritance

Inheritance allows a class to inherit properties and methods from another class.

```java
// Base class
public class Animal {
    protected String name;
    protected int age;

    public Animal(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public void eat() {
        System.out.println(name + " is eating");
    }

    public void sleep() {
        System.out.println(name + " is sleeping");
    }

    // Virtual method (can be overridden)
    public void makeSound() {
        System.out.println(name + " makes a sound");
    }
}

// Derived class
public class Dog extends Animal {
    private String breed;

    public Dog(String name, int age, String breed) {
        super(name, age);  // Call parent constructor
        this.breed = breed;
    }

    @Override
    public void makeSound() {
        System.out.println(name + " barks");
    }

    // Additional method specific to Dog
    public void wagTail() {
        System.out.println(name + " wags tail");
    }
}
```

### 3. Polymorphism

Polymorphism allows objects of different types to be treated as objects of a common base type.

#### Method Overriding (Runtime Polymorphism)

```java
public class Shape {
    public double calculateArea() {
        return 0;
    }

    public void draw() {
        System.out.println("Drawing a shape");
    }
}

public class Circle extends Shape {
    private double radius;

    public Circle(double radius) {
        this.radius = radius;
    }

    @Override
    public double calculateArea() {
        return Math.PI * radius * radius;
    }

    @Override
    public void draw() {
        System.out.println("Drawing a circle");
    }
}

public class Rectangle extends Shape {
    private double width, height;

    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }

    @Override
    public double calculateArea() {
        return width * height;
    }

    @Override
    public void draw() {
        System.out.println("Drawing a rectangle");
    }
}

// Usage
Shape[] shapes = {
    new Circle(5),
    new Rectangle(4, 6),
    new Circle(3)
};

for (Shape shape : shapes) {
    shape.draw();  // Polymorphic method call
    System.out.println("Area: " + shape.calculateArea());
}
```

#### Method Overloading (Compile-time Polymorphism)

```java
public class Calculator {
    public int add(int a, int b) {
        return a + b;
    }

    public double add(double a, double b) {
        return a + b;
    }

    public int add(int a, int b, int c) {
        return a + b + c;
    }

    public String add(String a, String b) {
        return a + b;
    }
}
```

### 4. Abstraction

Abstraction hides implementation details and shows only essential features.

#### Abstract Classes

```java
public abstract class Vehicle {
    protected String make;
    protected String model;
    protected int year;

    public Vehicle(String make, String model, int year) {
        this.make = make;
        this.model = model;
        this.year = year;
    }

    // Concrete method
    public void displayInfo() {
        System.out.println(year + " " + make + " " + model);
    }

    // Abstract methods (must be implemented by subclasses)
    public abstract void start();
    public abstract void stop();
    public abstract double calculateMileage();
}

public class Car extends Vehicle {
    private double fuelCapacity;

    public Car(String make, String model, int year, double fuelCapacity) {
        super(make, model, year);
        this.fuelCapacity = fuelCapacity;
    }

    @Override
    public void start() {
        System.out.println("Car engine started");
    }

    @Override
    public void stop() {
        System.out.println("Car engine stopped");
    }

    @Override
    public double calculateMileage() {
        return 15.5; // km per liter
    }
}
```

#### Interfaces

```java
public interface Drawable {
    void draw();
    void resize(double scale);

    // Default method (Java 8+)
    default void highlight() {
        System.out.println("Highlighting the drawable object");
    }

    // Static method (Java 8+)
    static void printInfo() {
        System.out.println("This is a drawable interface");
    }
}

public interface Movable {
    void move(int x, int y);
    void rotate(double angle);
}

// Multiple interface implementation
public class GraphicalObject implements Drawable, Movable {
    private int x, y;
    private double scale = 1.0;

    @Override
    public void draw() {
        System.out.println("Drawing object at (" + x + ", " + y + ")");
    }

    @Override
    public void resize(double scale) {
        this.scale = scale;
    }

    @Override
    public void move(int x, int y) {
        this.x = x;
        this.y = y;
    }

    @Override
    public void rotate(double angle) {
        System.out.println("Rotating by " + angle + " degrees");
    }
}
```

## Access Modifiers

| Modifier  | Same Class | Same Package | Subclass | Different Package |
| --------- | ---------- | ------------ | -------- | ----------------- |
| private   | ✓          | ✗            | ✗        | ✗                 |
| default   | ✓          | ✓            | ✗        | ✗                 |
| protected | ✓          | ✓            | ✓        | ✗                 |
| public    | ✓          | ✓            | ✓        | ✓                 |

```java
public class AccessExample {
    private int privateField;        // Only within same class
    int defaultField;               // Within same package
    protected int protectedField;   // Within package + subclasses
    public int publicField;         // Anywhere

    private void privateMethod() { }
    void defaultMethod() { }
    protected void protectedMethod() { }
    public void publicMethod() { }
}
```

## Classes and Objects

### Class Definition

```java
public class Person {
    // Instance variables
    private String name;
    private int age;
    private String email;

    // Static variable (shared among all instances)
    private static int totalPersons = 0;

    // Constants
    public static final String SPECIES = "Homo sapiens";

    // Default constructor
    public Person() {
        this("Unknown", 0, "");
    }

    // Parameterized constructor
    public Person(String name, int age, String email) {
        this.name = name;
        this.age = age;
        this.email = email;
        totalPersons++;
    }

    // Copy constructor
    public Person(Person other) {
        this(other.name, other.age, other.email);
    }

    // Getter methods
    public String getName() { return name; }
    public int getAge() { return age; }
    public String getEmail() { return email; }

    // Setter methods
    public void setName(String name) {
        if (name != null && !name.trim().isEmpty()) {
            this.name = name;
        }
    }

    public void setAge(int age) {
        if (age >= 0 && age <= 150) {
            this.age = age;
        }
    }

    public void setEmail(String email) {
        if (email != null && email.contains("@")) {
            this.email = email;
        }
    }

    // Static method
    public static int getTotalPersons() {
        return totalPersons;
    }

    // Instance method
    public void displayInfo() {
        System.out.println("Name: " + name + ", Age: " + age + ", Email: " + email);
    }

    // Override Object methods
    @Override
    public String toString() {
        return "Person{name='" + name + "', age=" + age + ", email='" + email + "'}";
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;

        Person person = (Person) obj;
        return age == person.age &&
               Objects.equals(name, person.name) &&
               Objects.equals(email, person.email);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, age, email);
    }
}
```

### Object Creation and Usage

```java
// Creating objects
Person person1 = new Person();
Person person2 = new Person("John Doe", 30, "john@example.com");
Person person3 = new Person(person2); // Copy constructor

// Using objects
person1.setName("Jane Smith");
person1.setAge(25);
person1.displayInfo();

// Static method call
System.out.println("Total persons: " + Person.getTotalPersons());
```

## Constructor Chaining

```java
public class Employee {
    private String name;
    private int id;
    private double salary;
    private String department;

    // Constructor chaining with this()
    public Employee() {
        this("Unknown", 0);
    }

    public Employee(String name, int id) {
        this(name, id, 0.0);
    }

    public Employee(String name, int id, double salary) {
        this(name, id, salary, "General");
    }

    public Employee(String name, int id, double salary, String department) {
        this.name = name;
        this.id = id;
        this.salary = salary;
        this.department = department;
    }
}

// Inheritance constructor chaining
public class Manager extends Employee {
    private int teamSize;

    public Manager(String name, int id, double salary, String department, int teamSize) {
        super(name, id, salary, department); // Call parent constructor
        this.teamSize = teamSize;
    }
}
```

## Inner Classes

### Non-static Inner Class

```java
public class OuterClass {
    private String outerField = "Outer field";

    public class InnerClass {
        private String innerField = "Inner field";

        public void displayFields() {
            System.out.println(outerField);  // Can access outer class members
            System.out.println(innerField);
        }
    }

    public void createInner() {
        InnerClass inner = new InnerClass();
        inner.displayFields();
    }
}

// Usage
OuterClass outer = new OuterClass();
OuterClass.InnerClass inner = outer.new InnerClass();
```

### Static Nested Class

```java
public class OuterClass {
    private static String staticField = "Static field";
    private String instanceField = "Instance field";

    public static class StaticNestedClass {
        public void display() {
            System.out.println(staticField);    // Can access static members
            // System.out.println(instanceField); // Cannot access instance members
        }
    }
}

// Usage
OuterClass.StaticNestedClass nested = new OuterClass.StaticNestedClass();
```

### Anonymous Inner Class

```java
// Anonymous class implementing interface
Runnable task = new Runnable() {
    @Override
    public void run() {
        System.out.println("Task executing...");
    }
};

// Anonymous class extending class
Thread thread = new Thread() {
    @Override
    public void run() {
        System.out.println("Thread running...");
    }
};
```

### Local Inner Class

```java
public class OuterClass {
    public void method() {
        final String localVariable = "Local variable";

        class LocalInnerClass {
            public void display() {
                System.out.println(localVariable);  // Can access final local variables
            }
        }

        LocalInnerClass local = new LocalInnerClass();
        local.display();
    }
}
```

## Final Keyword

### Final Variables

```java
public class FinalExample {
    // Final instance variable (must be initialized)
    private final int id;

    // Final static variable (constant)
    public static final double PI = 3.14159;

    public FinalExample(int id) {
        this.id = id;  // Final variable can be initialized in constructor
    }

    public void method() {
        final int localFinal = 10;  // Final local variable
        // localFinal = 20;  // Compilation error
    }
}
```

### Final Methods

```java
public class Parent {
    public final void finalMethod() {
        System.out.println("This method cannot be overridden");
    }

    public void normalMethod() {
        System.out.println("This method can be overridden");
    }
}

public class Child extends Parent {
    // public void finalMethod() { }  // Compilation error

    @Override
    public void normalMethod() {
        System.out.println("Overridden method");
    }
}
```

### Final Classes

```java
public final class FinalClass {
    // This class cannot be extended
}

// public class ChildClass extends FinalClass { }  // Compilation error
```

## Object Class Methods

### toString()

```java
public class Book {
    private String title;
    private String author;
    private double price;

    @Override
    public String toString() {
        return "Book{" +
               "title='" + title + '\'' +
               ", author='" + author + '\'' +
               ", price=" + price +
               '}';
    }
}
```

### equals() and hashCode()

```java
public class Student {
    private int id;
    private String name;

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;

        Student student = (Student) obj;
        return id == student.id && Objects.equals(name, student.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name);
    }
}
```

## Interface vs Abstract Class

| Feature               | Interface                   | Abstract Class         |
| --------------------- | --------------------------- | ---------------------- |
| Multiple inheritance  | Yes (implements multiple)   | No (extends one)       |
| Constructor           | No                          | Yes                    |
| Instance variables    | No (only constants)         | Yes                    |
| Method implementation | Default/static methods only | Yes (concrete methods) |
| Access modifiers      | public (default)            | Any access modifier    |
| When to use           | Contract definition         | Partial implementation |

## Composition vs Inheritance

### Composition (Has-a relationship)

```java
public class Engine {
    private int horsepower;

    public void start() {
        System.out.println("Engine started");
    }
}

public class Car {
    private Engine engine;  // Composition

    public Car() {
        this.engine = new Engine();  // Car HAS-A Engine
    }

    public void start() {
        engine.start();  // Delegate to engine
    }
}
```

### Inheritance (Is-a relationship)

```java
public class Vehicle {
    protected void move() {
        System.out.println("Vehicle is moving");
    }
}

public class Car extends Vehicle {  // Car IS-A Vehicle
    @Override
    protected void move() {
        System.out.println("Car is driving");
    }
}
```

## Best Practices

1. **Favor composition over inheritance**
2. **Program to interfaces, not implementations**
3. **Keep classes and methods focused (Single Responsibility Principle)**
4. **Use meaningful names for classes, methods, and variables**
5. **Make fields private and provide public methods for access**
6. **Override equals() and hashCode() together**
7. **Use @Override annotation for clarity**
8. **Follow the Liskov Substitution Principle**
9. **Keep inheritance hierarchies shallow**
10. **Use final for immutable classes and methods that shouldn't be overridden**

## Interview Tips

### Common Questions

1. **Explain the four pillars of OOP**
2. **Difference between abstract class and interface**
3. **What is method overriding vs overloading?**
4. **How does polymorphism work in Java?**
5. **When would you use composition over inheritance?**
6. **What are the access modifiers and their scope?**
7. **Can you override static methods?**
8. **What is the difference between final, finally, and finalize?**

### Code Design Principles

- **SOLID Principles**: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
- **DRY**: Don't Repeat Yourself
- **KISS**: Keep It Simple, Stupid
- **YAGNI**: You Aren't Gonna Need It
