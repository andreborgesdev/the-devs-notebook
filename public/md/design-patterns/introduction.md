# Design Patterns

Design Patterns are proven solutions to common software design problems. They help create flexible, reusable, and maintainable code by offering templates for solving recurring design challenges.

**Useful Resources**  
[Refactoring Guru](https://refactoring.guru/design-patterns)

## SOLID Principles

### Single Responsibility Principle (SRP)

A class should have only one reason to change.

```java
// Bad: Multiple responsibilities
class User {
    private String name;
    private String email;

    public void save() {
        // Database logic
    }

    public void sendEmail() {
        // Email logic
    }

    public void generateReport() {
        // Report logic
    }
}

// Good: Single responsibility
class User {
    private String name;
    private String email;
}

class UserRepository {
    public void save(User user) {
        // Database logic
    }
}

class EmailService {
    public void sendEmail(User user) {
        // Email logic
    }
}

class ReportGenerator {
    public void generateReport(User user) {
        // Report logic
    }
}
```

### Open/Closed Principle (OCP)

Classes should be open for extension but closed for modification.

```java
// Bad: Modifying existing code for new shapes
class AreaCalculator {
    public double calculateArea(Object shape) {
        if (shape instanceof Rectangle) {
            Rectangle rectangle = (Rectangle) shape;
            return rectangle.width * rectangle.height;
        } else if (shape instanceof Circle) {
            Circle circle = (Circle) shape;
            return Math.PI * circle.radius * circle.radius;
        }
        return 0;
    }
}

// Good: Open for extension, closed for modification
interface Shape {
    double calculateArea();
}

class Rectangle implements Shape {
    private double width, height;

    public double calculateArea() {
        return width * height;
    }
}

class Circle implements Shape {
    private double radius;

    public double calculateArea() {
        return Math.PI * radius * radius;
    }
}

class AreaCalculator {
    public double calculateArea(Shape shape) {
        return shape.calculateArea();
    }
}
```

### Liskov Substitution Principle (LSP)

Subtypes must be substitutable for their base types.

```java
// Bad: Violates LSP
class Bird {
    public void fly() {
        System.out.println("Flying");
    }
}

class Penguin extends Bird {
    @Override
    public void fly() {
        throw new UnsupportedOperationException("Penguins can't fly");
    }
}

// Good: Follows LSP
abstract class Bird {
    public abstract void move();
}

class FlyingBird extends Bird {
    public void move() {
        fly();
    }

    public void fly() {
        System.out.println("Flying");
    }
}

class Penguin extends Bird {
    public void move() {
        swim();
    }

    public void swim() {
        System.out.println("Swimming");
    }
}
```

### Interface Segregation Principle (ISP)

Prefer small, client-specific interfaces over large general-purpose ones.

```java
// Bad: Fat interface
interface Worker {
    void work();
    void eat();
    void sleep();
}

class Robot implements Worker {
    public void work() { /* work */ }
    public void eat() { /* robots don't eat */ }
    public void sleep() { /* robots don't sleep */ }
}

// Good: Segregated interfaces
interface Workable {
    void work();
}

interface Eatable {
    void eat();
}

interface Sleepable {
    void sleep();
}

class Human implements Workable, Eatable, Sleepable {
    public void work() { /* work */ }
    public void eat() { /* eat */ }
    public void sleep() { /* sleep */ }
}

class Robot implements Workable {
    public void work() { /* work */ }
}
```

### Dependency Inversion Principle (DIP)

High-level modules should not depend on low-level modules; both should depend on abstractions.

```java
// Bad: High-level depends on low-level
class MySQLDatabase {
    public void save(String data) {
        System.out.println("Saving to MySQL: " + data);
    }
}

class OrderService {
    private MySQLDatabase database = new MySQLDatabase();

    public void processOrder(String order) {
        database.save(order);
    }
}

// Good: Both depend on abstraction
interface Database {
    void save(String data);
}

class MySQLDatabase implements Database {
    public void save(String data) {
        System.out.println("Saving to MySQL: " + data);
    }
}

class PostgreSQLDatabase implements Database {
    public void save(String data) {
        System.out.println("Saving to PostgreSQL: " + data);
    }
}

class OrderService {
    private Database database;

    public OrderService(Database database) {
        this.database = database;
    }

    public void processOrder(String order) {
        database.save(order);
    }
}
```

## Creational Design Patterns

### Singleton

Ensures a class has only one instance and provides a global access point.

```java
public class Singleton {
    private static Singleton instance;
    private Singleton() {}

    public static Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}
```

_Used for:_ Configuration settings, logging, caches.

### Builder

Separates the construction of a complex object from its representation.

```java
public class Pizza {
    private String dough;
    private String sauce;
    private String topping;

    private Pizza(Builder builder) {
        this.dough = builder.dough;
        this.sauce = builder.sauce;
        this.topping = builder.topping;
    }

    public static class Builder {
        private String dough;
        private String sauce;
        private String topping;

        public Builder dough(String dough) {
            this.dough = dough;
            return this;
        }

        public Builder sauce(String sauce) {
            this.sauce = sauce;
            return this;
        }

        public Builder topping(String topping) {
            this.topping = topping;
            return this;
        }

        public Pizza build() {
            return new Pizza(this);
        }
    }
}

Pizza pizza = new Pizza.Builder()
    .dough("thin")
    .sauce("tomato")
    .topping("mozzarella")
    .build();
```

_Used for:_ When an object requires numerous parameters or complex setup.

### Factory Method

Defines an interface for creating an object but lets subclasses decide which class to instantiate.

```java
public abstract class CardGame {
    public abstract void play();

    public static CardGame createCardGame(GameType type) {
        switch (type) {
            case POKER:
                return new PokerGame();
            case BLACKJACK:
                return new BlackJackGame();
            default:
                throw new IllegalArgumentException("Unknown game type");
        }
    }
}

class PokerGame extends CardGame {
    public void play() {
        System.out.println("Playing Poker");
    }
}
```

### Abstract Factory

An abstraction over multiple factories, useful when your system needs to support multiple families of related objects.

```java
interface GUIFactory {
    Button createButton();
    Checkbox createCheckbox();
}

class WindowsFactory implements GUIFactory {
    public Button createButton() {
        return new WindowsButton();
    }

    public Checkbox createCheckbox() {
        return new WindowsCheckbox();
    }
}

class MacFactory implements GUIFactory {
    public Button createButton() {
        return new MacButton();
    }

    public Checkbox createCheckbox() {
        return new MacCheckbox();
    }
}
```

_Example:_ UI toolkit that supports multiple operating systems.

### Prototype

Creates new objects by cloning existing ones rather than creating from scratch.

```java
abstract class Shape implements Cloneable {
    protected String type;

    abstract void draw();

    public Object clone() {
        Object clone = null;
        try {
            clone = super.clone();
        } catch (CloneNotSupportedException e) {
            e.printStackTrace();
        }
        return clone;
    }
}

class Circle extends Shape {
    public Circle() {
        type = "Circle";
    }

    public void draw() {
        System.out.println("Drawing a Circle");
    }
}
```

## Structural Design Patterns

### Facade

Provides a simplified interface to a complex subsystem.

```java
class HotelBookingFacade {
    private FlightBooking flightBooking;
    private HotelReservation hotelReservation;
    private CarRental carRental;

    public HotelBookingFacade() {
        this.flightBooking = new FlightBooking();
        this.hotelReservation = new HotelReservation();
        this.carRental = new CarRental();
    }

    public void bookCompletePackage(String destination, Date checkIn, Date checkOut) {
        flightBooking.bookFlight(destination);
        hotelReservation.reserveRoom(destination, checkIn, checkOut);
        carRental.rentCar(destination, checkIn, checkOut);
    }
}
```

_Example:_ A hotel booking facade that hides the complexity of multiple APIs.

### Proxy

Creates a surrogate or placeholder to control access to another object.

```java
interface Image {
    void display();
}

class RealImage implements Image {
    private String filename;

    public RealImage(String filename) {
        this.filename = filename;
        loadFromDisk();
    }

    private void loadFromDisk() {
        System.out.println("Loading " + filename);
    }

    public void display() {
        System.out.println("Displaying " + filename);
    }
}

class ProxyImage implements Image {
    private RealImage realImage;
    private String filename;

    public ProxyImage(String filename) {
        this.filename = filename;
    }

    public void display() {
        if (realImage == null) {
            realImage = new RealImage(filename);
        }
        realImage.display();
    }
}
```

_Example:_ Virtual proxy for lazy-loading heavy resources.

### Composite

Treats individual objects and compositions of objects uniformly.

```java
interface FileComponent {
    void showDetails();
}

class File implements FileComponent {
    private String name;

    public File(String name) {
        this.name = name;
    }

    public void showDetails() {
        System.out.println("File: " + name);
    }
}

class Folder implements FileComponent {
    private String name;
    private List<FileComponent> components = new ArrayList<>();

    public Folder(String name) {
        this.name = name;
    }

    public void addComponent(FileComponent component) {
        components.add(component);
    }

    public void showDetails() {
        System.out.println("Folder: " + name);
        for (FileComponent component : components) {
            component.showDetails();
        }
    }
}
```

_Example:_ File system hierarchies (folders and files).

### Adapter

Converts the interface of a class into another interface clients expect.

```java
interface MediaPlayer {
    void play(String audioType, String fileName);
}

interface AdvancedMediaPlayer {
    void playVlc(String fileName);
    void playMp4(String fileName);
}

class VlcPlayer implements AdvancedMediaPlayer {
    public void playVlc(String fileName) {
        System.out.println("Playing vlc file: " + fileName);
    }

    public void playMp4(String fileName) {
    }
}

class MediaAdapter implements MediaPlayer {
    AdvancedMediaPlayer advancedPlayer;

    public MediaAdapter(String audioType) {
        if (audioType.equalsIgnoreCase("vlc")) {
            advancedPlayer = new VlcPlayer();
        }
    }

    public void play(String audioType, String fileName) {
        if (audioType.equalsIgnoreCase("vlc")) {
            advancedPlayer.playVlc(fileName);
        }
    }
}
```

_Example:_ Power plug adapters.

### Decorator

Adds new responsibilities to an object dynamically.

```java
interface Coffee {
    double cost();
    String description();
}

class SimpleCoffee implements Coffee {
    public double cost() {
        return 2.0;
    }

    public String description() {
        return "Simple coffee";
    }
}

abstract class CoffeeDecorator implements Coffee {
    protected Coffee coffee;

    public CoffeeDecorator(Coffee coffee) {
        this.coffee = coffee;
    }
}

class MilkDecorator extends CoffeeDecorator {
    public MilkDecorator(Coffee coffee) {
        super(coffee);
    }

    public double cost() {
        return coffee.cost() + 0.5;
    }

    public String description() {
        return coffee.description() + ", milk";
    }
}
```

### Bridge

Separates an abstraction from its implementation so both can vary independently.

```java
interface DrawingAPI {
    void drawCircle(double x, double y, double radius);
}

class DrawingAPI1 implements DrawingAPI {
    public void drawCircle(double x, double y, double radius) {
        System.out.println("API1: Circle at " + x + "," + y + " radius " + radius);
    }
}

abstract class Shape {
    protected DrawingAPI drawingAPI;

    protected Shape(DrawingAPI drawingAPI) {
        this.drawingAPI = drawingAPI;
    }

    public abstract void draw();
}

class Circle extends Shape {
    private double x, y, radius;

    public Circle(double x, double y, double radius, DrawingAPI drawingAPI) {
        super(drawingAPI);
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    public void draw() {
        drawingAPI.drawCircle(x, y, radius);
    }
}
```

## Behavioral Design Patterns

### Template Method

Defines the skeleton of an algorithm, deferring some steps to subclasses.

```java
abstract class DataProcessor {
    public final void process() {
        readData();
        processData();
        writeData();
    }

    abstract void readData();
    abstract void processData();
    abstract void writeData();
}

class CSVDataProcessor extends DataProcessor {
    void readData() {
        System.out.println("Reading CSV data");
    }

    void processData() {
        System.out.println("Processing CSV data");
    }

    void writeData() {
        System.out.println("Writing CSV data");
    }
}
```

### Chain of Responsibility

Passes a request along a chain of handlers.

```java
abstract class Logger {
    public static int INFO = 1;
    public static int DEBUG = 2;
    public static int ERROR = 3;

    protected int level;
    protected Logger nextLogger;

    public void setNextLogger(Logger nextLogger) {
        this.nextLogger = nextLogger;
    }

    public void logMessage(int level, String message) {
        if (this.level <= level) {
            write(message);
        }
        if (nextLogger != null) {
            nextLogger.logMessage(level, message);
        }
    }

    abstract protected void write(String message);
}

class ConsoleLogger extends Logger {
    public ConsoleLogger(int level) {
        this.level = level;
    }

    protected void write(String message) {
        System.out.println("Console: " + message);
    }
}
```

_Example:_ Event handling systems, logging frameworks.

### Command

Encapsulates a request as an object, allowing you to parameterize clients with requests and support undo/redo.

```java
interface Command {
    void execute();
    void undo();
}

class Light {
    public void turnOn() {
        System.out.println("Light is on");
    }

    public void turnOff() {
        System.out.println("Light is off");
    }
}

class LightOnCommand implements Command {
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

class RemoteControl {
    private Command command;

    public void setCommand(Command command) {
        this.command = command;
    }

    public void pressButton() {
        command.execute();
    }

    public void pressUndo() {
        command.undo();
    }
}
```

### Strategy

Defines a family of interchangeable algorithms and makes them interchangeable at runtime.

```java
interface PaymentStrategy {
    void pay(double amount);
}

class CreditCardPayment implements PaymentStrategy {
    private String cardNumber;

    public CreditCardPayment(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public void pay(double amount) {
        System.out.println("Paid $" + amount + " using Credit Card " + cardNumber);
    }
}

class PayPalPayment implements PaymentStrategy {
    private String email;

    public PayPalPayment(String email) {
        this.email = email;
    }

    public void pay(double amount) {
        System.out.println("Paid $" + amount + " using PayPal " + email);
    }
}

class ShoppingCart {
    private PaymentStrategy paymentStrategy;

    public void setPaymentStrategy(PaymentStrategy paymentStrategy) {
        this.paymentStrategy = paymentStrategy;
    }

    public void checkout(double amount) {
        paymentStrategy.pay(amount);
    }
}
```

_Example:_ Different sorting algorithms or payment methods.

### Observer

Defines a dependency between objects so that when one changes, all its dependents are notified.

```java
interface Observer {
    void update(String message);
}

interface Subject {
    void attach(Observer observer);
    void detach(Observer observer);
    void notifyObservers();
}

class NewsAgency implements Subject {
    private List<Observer> observers = new ArrayList<>();
    private String news;

    public void attach(Observer observer) {
        observers.add(observer);
    }

    public void detach(Observer observer) {
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

class NewsChannel implements Observer {
    private String name;

    public NewsChannel(String name) {
        this.name = name;
    }

    public void update(String news) {
        System.out.println(name + " received news: " + news);
    }
}
```

_Example:_ Event listeners.

### Mediator

Encapsulates how a set of objects interact to promote loose coupling.

```java
interface Mediator {
    void sendMessage(String message, Colleague colleague);
}

abstract class Colleague {
    protected Mediator mediator;

    public Colleague(Mediator mediator) {
        this.mediator = mediator;
    }

    public abstract void send(String message);
    public abstract void receive(String message);
}

class ChatMediator implements Mediator {
    private List<Colleague> colleagues = new ArrayList<>();

    public void addColleague(Colleague colleague) {
        colleagues.add(colleague);
    }

    public void sendMessage(String message, Colleague sender) {
        for (Colleague colleague : colleagues) {
            if (colleague != sender) {
                colleague.receive(message);
            }
        }
    }
}

class User extends Colleague {
    private String name;

    public User(Mediator mediator, String name) {
        super(mediator);
        this.name = name;
    }

    public void send(String message) {
        mediator.sendMessage(message, this);
    }

    public void receive(String message) {
        System.out.println(name + " received: " + message);
    }
}
```

### State

Allows an object to alter its behavior when its internal state changes.

```java
interface State {
    void doAction(Context context);
}

class StartState implements State {
    public void doAction(Context context) {
        System.out.println("Player is in start state");
        context.setState(this);
    }
}

class StopState implements State {
    public void doAction(Context context) {
        System.out.println("Player is in stop state");
        context.setState(this);
    }
}

class Context {
    private State state;

    public void setState(State state) {
        this.state = state;
    }

    public State getState() {
        return state;
    }
}
```

### Memento

Captures and restores an object's internal state without violating encapsulation (useful for undo mechanisms).

```java
class Memento {
    private String state;

    public Memento(String state) {
        this.state = state;
    }

    public String getState() {
        return state;
    }
}

class Originator {
    private String state;

    public void setState(String state) {
        this.state = state;
    }

    public String getState() {
        return state;
    }

    public Memento saveStateToMemento() {
        return new Memento(state);
    }

    public void getStateFromMemento(Memento memento) {
        state = memento.getState();
    }
}

class Caretaker {
    private List<Memento> mementoList = new ArrayList<>();

    public void add(Memento state) {
        mementoList.add(state);
    }

    public Memento get(int index) {
        return mementoList.get(index);
    }
}
```

### Iterator

Provides a way to access elements of a collection sequentially without exposing its underlying representation.

```java
interface Iterator<T> {
    boolean hasNext();
    T next();
}

interface Container<T> {
    Iterator<T> getIterator();
}

class NameRepository implements Container<String> {
    private String[] names = {"John", "Jane", "Jack", "Jill"};

    public Iterator<String> getIterator() {
        return new NameIterator();
    }

    private class NameIterator implements Iterator<String> {
        int index;

        public boolean hasNext() {
            return index < names.length;
        }

        public String next() {
            if (hasNext()) {
                return names[index++];
            }
            return null;
        }
    }
}
```

### Visitor

Represents an operation to be performed on elements of an object structure without changing their classes.

```java
interface Visitor {
    void visit(Book book);
    void visit(CD cd);
}

interface ItemElement {
    void accept(Visitor visitor);
}

class Book implements ItemElement {
    private int price;
    private String isbnNumber;

    public Book(int cost, String isbn) {
        this.price = cost;
        this.isbnNumber = isbn;
    }

    public int getPrice() {
        return price;
    }

    public String getIsbnNumber() {
        return isbnNumber;
    }

    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}

class ShoppingCartVisitor implements Visitor {
    public void visit(Book book) {
        int cost = book.getPrice();
        if (cost > 50) {
            cost = cost - 5;
        }
        System.out.println("Book ISBN:" + book.getIsbnNumber() + " cost =" + cost);
    }

    public void visit(CD cd) {
        System.out.println("CD Location:" + cd.getLocation() + " cost =" + cd.getPrice());
    }
}
```

## Design Pattern Categories

| Creational       | Structural | Behavioral              |
| ---------------- | ---------- | ----------------------- |
| Singleton        | Facade     | Template Method         |
| Factory Method   | Proxy      | Chain of Responsibility |
| Abstract Factory | Composite  | Command                 |
| Builder          | Decorator  | Strategy                |
| Prototype        | Adapter    | Mediator                |
|                  | Bridge     | Observer                |
|                  |            | State                   |
|                  |            | Memento                 |
|                  |            | Iterator                |
|                  |            | Visitor                 |

## Notes

- Always prefer **composition over inheritance** when using design patterns.
- Patterns should solve problems, not add unnecessary complexity. Use them when a genuine need arises.
- Many patterns work well together (e.g., Factory + Strategy, Composite + Iterator).
- **Iterator** and **Visitor** are essential behavioral patterns for collection traversal and operations.
- **Bridge** is a crucial structural pattern for separating abstraction from implementation.
