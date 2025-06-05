# Java Design Patterns - Complete Guide

Design patterns are reusable solutions to common problems in software design. They represent best practices and provide a standard vocabulary for developers. This guide covers the most important design patterns used in Java development.

## Table of Contents

1. [Design Pattern Fundamentals](#design-pattern-fundamentals)
2. [Creational Patterns](#creational-patterns)
3. [Structural Patterns](#structural-patterns)
4. [Behavioral Patterns](#behavioral-patterns)
5. [Java-Specific Patterns](#java-specific-patterns)
6. [Anti-Patterns to Avoid](#anti-patterns-to-avoid)
7. [Best Practices](#best-practices)
8. [Interview Tips](#interview-tips)

## Design Pattern Fundamentals

### What Are Design Patterns?

Design patterns are proven solutions to recurring design problems. They provide:

- **Reusability**: Solutions that can be applied to similar problems
- **Communication**: Common vocabulary among developers
- **Best Practices**: Time-tested approaches to common challenges
- **Flexibility**: Code that's easier to maintain and extend

### Classification of Design Patterns

1. **Creational**: Deal with object creation mechanisms
2. **Structural**: Deal with object composition and relationships
3. **Behavioral**: Deal with communication between objects and responsibilities

## Creational Patterns

### 1. Singleton Pattern

**Purpose**: Ensures a class has only one instance and provides global access to it.

```java
public class DatabaseConnection {
    private static volatile DatabaseConnection instance;
    private Connection connection;

    private DatabaseConnection() {
        connection = DriverManager.getConnection("jdbc:h2:mem:testdb");
    }

    public static DatabaseConnection getInstance() {
        if (instance == null) {
            synchronized (DatabaseConnection.class) {
                if (instance == null) {
                    instance = new DatabaseConnection();
                }
            }
        }
        return instance;
    }

    public Connection getConnection() {
        return connection;
    }
}
```

**Enum Singleton (Thread-Safe)**:

```java
public enum DatabaseManager {
    INSTANCE;

    private Connection connection;

    DatabaseManager() {
        connection = DriverManager.getConnection("jdbc:h2:mem:testdb");
    }

    public Connection getConnection() {
        return connection;
    }
}
```

### 2. Factory Pattern

**Purpose**: Creates objects without specifying their exact classes.

```java
public interface Shape {
    void draw();
}

public class Circle implements Shape {
    public void draw() {
        System.out.println("Drawing Circle");
    }
}

public class Rectangle implements Shape {
    public void draw() {
        System.out.println("Drawing Rectangle");
    }
}

public class ShapeFactory {
    public static Shape createShape(String type) {
        return switch (type.toLowerCase()) {
            case "circle" -> new Circle();
            case "rectangle" -> new Rectangle();
            default -> throw new IllegalArgumentException("Unknown shape: " + type);
        };
    }
}
```

### 3. Abstract Factory Pattern

**Purpose**: Provides an interface for creating families of related objects.

```java
public interface GUIFactory {
    Button createButton();
    TextField createTextField();
}

public class WindowsFactory implements GUIFactory {
    public Button createButton() {
        return new WindowsButton();
    }

    public TextField createTextField() {
        return new WindowsTextField();
    }
}

public class MacFactory implements GUIFactory {
    public Button createButton() {
        return new MacButton();
    }

    public TextField createTextField() {
        return new MacTextField();
    }
}
```

### 4. Builder Pattern

**Purpose**: Constructs complex objects step by step.

```java
public class Computer {
    private final String cpu;
    private final String memory;
    private final String storage;
    private final String gpu;
    private final boolean hasWifi;

    private Computer(Builder builder) {
        this.cpu = builder.cpu;
        this.memory = builder.memory;
        this.storage = builder.storage;
        this.gpu = builder.gpu;
        this.hasWifi = builder.hasWifi;
    }

    public static class Builder {
        private String cpu;
        private String memory;
        private String storage;
        private String gpu;
        private boolean hasWifi = false;

        public Builder cpu(String cpu) {
            this.cpu = cpu;
            return this;
        }

        public Builder memory(String memory) {
            this.memory = memory;
            return this;
        }

        public Builder storage(String storage) {
            this.storage = storage;
            return this;
        }

        public Builder gpu(String gpu) {
            this.gpu = gpu;
            return this;
        }

        public Builder wifi(boolean hasWifi) {
            this.hasWifi = hasWifi;
            return this;
        }

        public Computer build() {
            if (cpu == null || memory == null) {
                throw new IllegalStateException("CPU and Memory are required");
            }
            return new Computer(this);
        }
    }
}

Computer computer = new Computer.Builder()
    .cpu("Intel i7")
    .memory("16GB")
    .storage("1TB SSD")
    .wifi(true)
    .build();
```

### 5. Prototype Pattern

**Purpose**: Creates objects by cloning existing instances.

```java
public abstract class Animal implements Cloneable {
    protected String species;
    protected int age;

    public Animal clone() {
        try {
            return (Animal) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new RuntimeException("Clone not supported", e);
        }
    }

    public abstract void makeSound();
}

public class Dog extends Animal {
    private String breed;

    public Dog(String species, int age, String breed) {
        this.species = species;
        this.age = age;
        this.breed = breed;
    }

    public void makeSound() {
        System.out.println("Woof!");
    }

    public Dog clone() {
        return (Dog) super.clone();
    }
}
```

## Structural Patterns

### 1. Adapter Pattern

**Purpose**: Allows incompatible interfaces to work together.

```java
public interface MediaPlayer {
    void play(String audioType, String fileName);
}

public interface AdvancedMediaPlayer {
    void playVlc(String fileName);
    void playMp4(String fileName);
}

public class VlcPlayer implements AdvancedMediaPlayer {
    public void playVlc(String fileName) {
        System.out.println("Playing vlc file: " + fileName);
    }

    public void playMp4(String fileName) {
    }
}

public class MediaAdapter implements MediaPlayer {
    private AdvancedMediaPlayer advancedPlayer;

    public MediaAdapter(String audioType) {
        if ("vlc".equalsIgnoreCase(audioType)) {
            advancedPlayer = new VlcPlayer();
        }
    }

    public void play(String audioType, String fileName) {
        if ("vlc".equalsIgnoreCase(audioType)) {
            advancedPlayer.playVlc(fileName);
        }
    }
}
```

### 2. Decorator Pattern

**Purpose**: Adds new functionality to objects without altering their structure.

```java
public interface Coffee {
    double getCost();
    String getDescription();
}

public class SimpleCoffee implements Coffee {
    public double getCost() {
        return 2.0;
    }

    public String getDescription() {
        return "Simple coffee";
    }
}

public abstract class CoffeeDecorator implements Coffee {
    protected Coffee coffee;

    public CoffeeDecorator(Coffee coffee) {
        this.coffee = coffee;
    }
}

public class MilkDecorator extends CoffeeDecorator {
    public MilkDecorator(Coffee coffee) {
        super(coffee);
    }

    public double getCost() {
        return coffee.getCost() + 0.5;
    }

    public String getDescription() {
        return coffee.getDescription() + ", milk";
    }
}

public class SugarDecorator extends CoffeeDecorator {
    public SugarDecorator(Coffee coffee) {
        super(coffee);
    }

    public double getCost() {
        return coffee.getCost() + 0.2;
    }

    public String getDescription() {
        return coffee.getDescription() + ", sugar";
    }
}

Coffee coffee = new SugarDecorator(new MilkDecorator(new SimpleCoffee()));
```

### 3. Facade Pattern

**Purpose**: Provides a simplified interface to a complex subsystem.

```java
public class HomeTheaterFacade {
    private Amplifier amp;
    private Tuner tuner;
    private DvdPlayer dvd;
    private CdPlayer cd;
    private Projector projector;
    private TheaterLights lights;
    private Screen screen;
    private PopcornPopper popper;

    public HomeTheaterFacade(Amplifier amp, Tuner tuner, DvdPlayer dvd,
                           CdPlayer cd, Projector projector, TheaterLights lights,
                           Screen screen, PopcornPopper popper) {
        this.amp = amp;
        this.tuner = tuner;
        this.dvd = dvd;
        this.cd = cd;
        this.projector = projector;
        this.lights = lights;
        this.screen = screen;
        this.popper = popper;
    }

    public void watchMovie(String movie) {
        System.out.println("Get ready to watch a movie...");
        popper.on();
        popper.pop();
        lights.dim(10);
        screen.down();
        projector.on();
        projector.wideScreenMode();
        amp.on();
        amp.setDvd(dvd);
        amp.setSurroundSound();
        amp.setVolume(5);
        dvd.on();
        dvd.play(movie);
    }

    public void endMovie() {
        System.out.println("Shutting movie theater down...");
        popper.off();
        lights.on();
        screen.up();
        projector.off();
        amp.off();
        dvd.stop();
        dvd.eject();
        dvd.off();
    }
}
```

### 4. Proxy Pattern

**Purpose**: Provides a placeholder or surrogate for another object to control access to it.

```java
public interface Image {
    void display();
}

public class RealImage implements Image {
    private String fileName;

    public RealImage(String fileName) {
        this.fileName = fileName;
        loadFromDisk(fileName);
    }

    public void display() {
        System.out.println("Displaying " + fileName);
    }

    private void loadFromDisk(String fileName) {
        System.out.println("Loading " + fileName);
    }
}

public class ProxyImage implements Image {
    private RealImage realImage;
    private String fileName;

    public ProxyImage(String fileName) {
        this.fileName = fileName;
    }

    public void display() {
        if (realImage == null) {
            realImage = new RealImage(fileName);
        }
        realImage.display();
    }
}
```

## Behavioral Patterns

### 1. Observer Pattern

**Purpose**: Defines a one-to-many dependency between objects.

```java
public interface Observer {
    void update(String message);
}

public interface Subject {
    void addObserver(Observer observer);
    void removeObserver(Observer observer);
    void notifyObservers();
}

public class NewsAgency implements Subject {
    private List<Observer> observers = new ArrayList<>();
    private String news;

    public void addObserver(Observer observer) {
        observers.add(observer);
    }

    public void removeObserver(Observer observer) {
        observers.remove(observer);
    }

    public void notifyObservers() {
        for (Observer observer : observers) {
            observer.update(news);
        }
    }

    public void setNews(String news) {
        this.news = news;
        notifyObservers();
    }
}

public class NewsChannel implements Observer {
    private String name;
    private String news;

    public NewsChannel(String name) {
        this.name = name;
    }

    public void update(String news) {
        this.news = news;
        System.out.println(name + " received news: " + news);
    }
}
```

### 2. Strategy Pattern

**Purpose**: Defines a family of algorithms and makes them interchangeable.

```java
public interface PaymentStrategy {
    void pay(double amount);
}

public class CreditCardPayment implements PaymentStrategy {
    private String cardNumber;
    private String name;

    public CreditCardPayment(String cardNumber, String name) {
        this.cardNumber = cardNumber;
        this.name = name;
    }

    public void pay(double amount) {
        System.out.println("Paid $" + amount + " using Credit Card " + cardNumber);
    }
}

public class PayPalPayment implements PaymentStrategy {
    private String email;

    public PayPalPayment(String email) {
        this.email = email;
    }

    public void pay(double amount) {
        System.out.println("Paid $" + amount + " using PayPal account " + email);
    }
}

public class ShoppingCart {
    private List<Item> items = new ArrayList<>();
    private PaymentStrategy paymentStrategy;

    public void addItem(Item item) {
        items.add(item);
    }

    public void setPaymentStrategy(PaymentStrategy paymentStrategy) {
        this.paymentStrategy = paymentStrategy;
    }

    public void checkout() {
        double total = items.stream().mapToDouble(Item::getPrice).sum();
        paymentStrategy.pay(total);
    }
}
```

### 3. Command Pattern

**Purpose**: Encapsulates a request as an object, allowing you to parameterize clients with different requests.

```java
public interface Command {
    void execute();
    void undo();
}

public class Light {
    private boolean isOn = false;

    public void turnOn() {
        isOn = true;
        System.out.println("Light is ON");
    }

    public void turnOff() {
        isOn = false;
        System.out.println("Light is OFF");
    }
}

public class LightOnCommand implements Command {
    private Light light;

    public LightOnCommand(Light light) {
        this.light = light;
    }

    public void execute() {
        light.turnOn();
    }

    public void undo() {
        light.turnOff();
    }
}

public class RemoteControl {
    private Command[] onCommands;
    private Command[] offCommands;
    private Command undoCommand;

    public RemoteControl() {
        onCommands = new Command[7];
        offCommands = new Command[7];

        Command noCommand = new NoCommand();
        for (int i = 0; i < 7; i++) {
            onCommands[i] = noCommand;
            offCommands[i] = noCommand;
        }
        undoCommand = noCommand;
    }

    public void setCommand(int slot, Command onCommand, Command offCommand) {
        onCommands[slot] = onCommand;
        offCommands[slot] = offCommand;
    }

    public void onButtonPressed(int slot) {
        onCommands[slot].execute();
        undoCommand = onCommands[slot];
    }

    public void offButtonPressed(int slot) {
        offCommands[slot].execute();
        undoCommand = offCommands[slot];
    }

    public void undoButtonPressed() {
        undoCommand.undo();
    }
}
```

### 4. Template Method Pattern

**Purpose**: Defines the skeleton of an algorithm in a superclass, letting subclasses override specific steps.

```java
public abstract class DataProcessor {

    public final void process() {
        readData();
        processData();
        writeData();
    }

    protected abstract void readData();
    protected abstract void processData();
    protected abstract void writeData();

    protected void hook() {
    }
}

public class CSVDataProcessor extends DataProcessor {
    protected void readData() {
        System.out.println("Reading data from CSV file");
    }

    protected void processData() {
        System.out.println("Processing CSV data");
    }

    protected void writeData() {
        System.out.println("Writing processed data to CSV file");
    }
}

public class JSONDataProcessor extends DataProcessor {
    protected void readData() {
        System.out.println("Reading data from JSON file");
    }

    protected void processData() {
        System.out.println("Processing JSON data");
    }

    protected void writeData() {
        System.out.println("Writing processed data to JSON file");
    }
}
```

### 5. State Pattern

**Purpose**: Allows an object to alter its behavior when its internal state changes.

```java
public interface State {
    void insertQuarter();
    void ejectQuarter();
    void turnCrank();
    void dispense();
}

public class GumballMachine {
    private State noQuarterState;
    private State hasQuarterState;
    private State soldState;
    private State soldOutState;

    private State state;
    private int count = 0;

    public GumballMachine(int numberGumballs) {
        noQuarterState = new NoQuarterState(this);
        hasQuarterState = new HasQuarterState(this);
        soldState = new SoldState(this);
        soldOutState = new SoldOutState(this);

        this.count = numberGumballs;
        if (numberGumballs > 0) {
            state = noQuarterState;
        } else {
            state = soldOutState;
        }
    }

    public void insertQuarter() {
        state.insertQuarter();
    }

    public void ejectQuarter() {
        state.ejectQuarter();
    }

    public void turnCrank() {
        state.turnCrank();
        state.dispense();
    }

    public void setState(State state) {
        this.state = state;
    }

    public void releaseBall() {
        System.out.println("A gumball comes rolling out the slot...");
        if (count != 0) {
            count = count - 1;
        }
    }

    public State getNoQuarterState() { return noQuarterState; }
    public State getHasQuarterState() { return hasQuarterState; }
    public State getSoldState() { return soldState; }
    public State getSoldOutState() { return soldOutState; }
    public int getCount() { return count; }
}
```

## Java-Specific Patterns

### 1. MVC Pattern (Model-View-Controller)

```java
public class Student {
    private String rollNo;
    private String name;

    public String getRollNo() { return rollNo; }
    public void setRollNo(String rollNo) { this.rollNo = rollNo; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}

public class StudentView {
    public void printStudentDetails(String studentName, String studentRollNo) {
        System.out.println("Student: ");
        System.out.println("Name: " + studentName);
        System.out.println("Roll No: " + studentRollNo);
    }
}

public class StudentController {
    private Student model;
    private StudentView view;

    public StudentController(Student model, StudentView view) {
        this.model = model;
        this.view = view;
    }

    public void setStudentName(String name) {
        model.setName(name);
    }

    public String getStudentName() {
        return model.getName();
    }

    public void setStudentRollNo(String rollNo) {
        model.setRollNo(rollNo);
    }

    public String getStudentRollNo() {
        return model.getRollNo();
    }

    public void updateView() {
        view.printStudentDetails(model.getName(), model.getRollNo());
    }
}
```

### 2. DAO Pattern (Data Access Object)

```java
public class Student {
    private String name;
    private int rollNo;

    public Student(String name, int rollNo) {
        this.name = name;
        this.rollNo = rollNo;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getRollNo() { return rollNo; }
    public void setRollNo(int rollNo) { this.rollNo = rollNo; }
}

public interface StudentDao {
    List<Student> getAllStudents();
    Student getStudent(int rollNo);
    void updateStudent(Student student);
    void deleteStudent(Student student);
}

public class StudentDaoImpl implements StudentDao {
    private List<Student> students;

    public StudentDaoImpl() {
        students = new ArrayList<>();
        students.add(new Student("Robert", 0));
        students.add(new Student("John", 1));
    }

    public void deleteStudent(Student student) {
        students.remove(student.getRollNo());
        System.out.println("Student: Roll No " + student.getRollNo() + ", deleted from database");
    }

    public List<Student> getAllStudents() {
        return students;
    }

    public Student getStudent(int rollNo) {
        return students.get(rollNo);
    }

    public void updateStudent(Student student) {
        students.get(student.getRollNo()).setName(student.getName());
        System.out.println("Student: Roll No " + student.getRollNo() + ", updated in the database");
    }
}
```

## Anti-Patterns to Avoid

### 1. God Object

```java
public class UserManager {
    public void createUser() { }
    public void deleteUser() { }
    public void sendEmail() { }
    public void generateReport() { }
    public void processPayment() { }
    public void manageInventory() { }
}
```

### 2. Spaghetti Code

Avoid deeply nested conditions and complex control flow.

### 3. Copy-Paste Programming

Avoid duplicating code instead of creating reusable components.

### 4. Golden Hammer

Don't use the same pattern for every problem.

## Best Practices

### Pattern Selection Guidelines

1. **Understand the Problem**: Choose patterns based on actual needs, not popularity
2. **Keep It Simple**: Don't over-engineer with unnecessary patterns
3. **Consider Maintenance**: Patterns should make code easier to maintain
4. **Performance Impact**: Some patterns add overhead
5. **Team Knowledge**: Ensure team understands chosen patterns

### Implementation Tips

1. **Follow SOLID Principles**: Most patterns support SOLID design principles
2. **Use Composition Over Inheritance**: Favor object composition
3. **Program to Interfaces**: Depend on abstractions, not concretions
4. **Favor Immutability**: Make objects immutable when possible
5. **Consider Thread Safety**: Address concurrency concerns

### Common Combinations

- **Strategy + Factory**: Create strategies using factory pattern
- **Observer + Command**: Commands can be observable
- **Decorator + Factory**: Factory creates decorated objects
- **Template Method + Strategy**: Template methods can use strategies

## Interview Tips

### Most Asked Patterns

1. **Singleton**: Implementation variations and thread safety
2. **Factory/Abstract Factory**: Object creation strategies
3. **Observer**: Event handling and loose coupling
4. **Strategy**: Algorithm encapsulation
5. **Decorator**: Adding behavior dynamically

### Key Interview Questions

1. **"Explain the Singleton pattern and its thread-safety issues"**

   - Double-checked locking
   - Enum implementation
   - Initialization-on-demand holder idiom

2. **"When would you use Factory vs Builder pattern?"**

   - Factory: Simple object creation
   - Builder: Complex objects with many parameters

3. **"How does Strategy pattern differ from State pattern?"**

   - Strategy: Different algorithms for same task
   - State: Different behavior based on object state

4. **"What are the disadvantages of design patterns?"**
   - Complexity overhead
   - Performance impact
   - Over-engineering risk

### Real-World Examples

- **Singleton**: Database connections, logging, caching
- **Factory**: GUI components, database drivers
- **Observer**: Event systems, MVC architecture
- **Strategy**: Payment processing, sorting algorithms
- **Decorator**: Java I/O streams, Spring AOP

### Code Quality Points

1. **Demonstrate SOLID principles**
2. **Show understanding of trade-offs**
3. **Explain when NOT to use patterns**
4. **Discuss alternative approaches**
5. **Consider performance implications**

Remember: Design patterns are tools, not rules. Use them judiciously to solve real problems, not to showcase knowledge. Focus on writing clean, maintainable code that solves business requirements effectively.
