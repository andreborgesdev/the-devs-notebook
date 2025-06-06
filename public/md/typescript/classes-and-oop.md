# TypeScript Classes and OOP

## Class Basics

### Class Declaration and Constructor

```typescript
class Person {
  // Property declarations
  name: string;
  age: number;
  private _id: string;
  protected department: string;
  readonly birthYear: number;

  // Constructor
  constructor(name: string, age: number, id: string, department: string) {
    this.name = name;
    this.age = age;
    this._id = id;
    this.department = department;
    this.birthYear = new Date().getFullYear() - age;
  }

  // Methods
  greet(): string {
    return `Hello, my name is ${this.name}`;
  }

  // Getter
  get id(): string {
    return this._id;
  }

  // Setter
  set id(value: string) {
    if (value.length < 3) {
      throw new Error("ID must be at least 3 characters");
    }
    this._id = value;
  }

  // Static method
  static createFromString(data: string): Person {
    const [name, age, id, department] = data.split(",");
    return new Person(name, parseInt(age), id, department);
  }

  // Static property
  static species: string = "Homo sapiens";
}

// Usage
const person = new Person("John", 30, "P001", "Engineering");
console.log(person.greet()); // "Hello, my name is John"
console.log(person.id); // "P001" (using getter)
person.id = "P002"; // Using setter

const personFromString = Person.createFromString("Jane,25,P003,Marketing");
```

### Access Modifiers

```typescript
class BankAccount {
  public accountNumber: string; // Accessible everywhere (default)
  private balance: number; // Only accessible within this class
  protected interestRate: number; // Accessible in this class and subclasses
  readonly accountType: string; // Cannot be modified after initialization

  constructor(
    accountNumber: string,
    initialBalance: number,
    accountType: string
  ) {
    this.accountNumber = accountNumber;
    this.balance = initialBalance;
    this.interestRate = 0.02;
    this.accountType = accountType;
  }

  // Public method
  public getBalance(): number {
    return this.balance;
  }

  // Private method
  private calculateInterest(): number {
    return this.balance * this.interestRate;
  }

  // Protected method
  protected applyInterest(): void {
    this.balance += this.calculateInterest();
  }

  public deposit(amount: number): void {
    if (amount > 0) {
      this.balance += amount;
    }
  }

  public withdraw(amount: number): boolean {
    if (amount > 0 && amount <= this.balance) {
      this.balance -= amount;
      return true;
    }
    return false;
  }
}

class SavingsAccount extends BankAccount {
  constructor(accountNumber: string, initialBalance: number) {
    super(accountNumber, initialBalance, "Savings");
  }

  // Can access protected members from parent
  public monthlyInterest(): void {
    this.applyInterest(); // ✅ OK - protected method
    // console.log(this.balance); // ❌ Error - private member
    console.log(this.interestRate); // ✅ OK - protected property
  }
}
```

### Parameter Properties

```typescript
// Shorthand for declaring and initializing properties
class Product {
  constructor(
    public readonly id: string,
    public name: string,
    private _price: number,
    protected supplier: string
  ) {}

  get price(): number {
    return this._price;
  }

  set price(value: number) {
    if (value < 0) {
      throw new Error("Price cannot be negative");
    }
    this._price = value;
  }
}

// Equivalent to:
class ProductLongForm {
  public readonly id: string;
  public name: string;
  private _price: number;
  protected supplier: string;

  constructor(id: string, name: string, price: number, supplier: string) {
    this.id = id;
    this.name = name;
    this._price = price;
    this.supplier = supplier;
  }
}
```

## Inheritance and Polymorphism

### Class Inheritance

```typescript
// Base class
abstract class Animal {
  protected name: string;
  protected age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  // Concrete method
  eat(): void {
    console.log(`${this.name} is eating`);
  }

  // Abstract method - must be implemented by subclasses
  abstract makeSound(): void;
  abstract move(): void;

  // Template method pattern
  dailyRoutine(): void {
    this.eat();
    this.move();
    this.makeSound();
    this.sleep();
  }

  private sleep(): void {
    console.log(`${this.name} is sleeping`);
  }
}

class Dog extends Animal {
  private breed: string;

  constructor(name: string, age: number, breed: string) {
    super(name, age); // Call parent constructor
    this.breed = breed;
  }

  makeSound(): void {
    console.log(`${this.name} barks: Woof!`);
  }

  move(): void {
    console.log(`${this.name} runs on four legs`);
  }

  // Dog-specific method
  fetch(): void {
    console.log(`${this.name} fetches the ball`);
  }

  // Override parent method
  eat(): void {
    console.log(`${this.name} the ${this.breed} is eating dog food`);
  }
}

class Bird extends Animal {
  private canFly: boolean;

  constructor(name: string, age: number, canFly: boolean) {
    super(name, age);
    this.canFly = canFly;
  }

  makeSound(): void {
    console.log(`${this.name} chirps`);
  }

  move(): void {
    if (this.canFly) {
      console.log(`${this.name} flies`);
    } else {
      console.log(`${this.name} walks`);
    }
  }
}

// Usage
const dog = new Dog("Rex", 5, "Golden Retriever");
const bird = new Bird("Tweety", 2, true);

dog.dailyRoutine();
bird.dailyRoutine();

// Polymorphism
const animals: Animal[] = [dog, bird];
animals.forEach((animal) => {
  animal.makeSound(); // Different behavior based on actual type
});
```

### Method Overriding and super

```typescript
class Vehicle {
  protected brand: string;
  protected year: number;

  constructor(brand: string, year: number) {
    this.brand = brand;
    this.year = year;
  }

  start(): void {
    console.log(`${this.brand} vehicle is starting...`);
  }

  getInfo(): string {
    return `${this.year} ${this.brand}`;
  }
}

class Car extends Vehicle {
  private doors: number;

  constructor(brand: string, year: number, doors: number) {
    super(brand, year);
    this.doors = doors;
  }

  // Override parent method
  start(): void {
    super.start(); // Call parent method
    console.log("Engine started, ready to drive!");
  }

  // Override with additional functionality
  getInfo(): string {
    const baseInfo = super.getInfo(); // Get parent implementation
    return `${baseInfo} with ${this.doors} doors`;
  }

  // Car-specific method
  honk(): void {
    console.log("Beep beep!");
  }
}

class ElectricCar extends Car {
  private batteryCapacity: number;

  constructor(
    brand: string,
    year: number,
    doors: number,
    batteryCapacity: number
  ) {
    super(brand, year, doors);
    this.batteryCapacity = batteryCapacity;
  }

  // Override grandparent and parent methods
  start(): void {
    console.log("Electric vehicle starting silently...");
    console.log("Battery check complete, ready to drive!");
  }

  charge(): void {
    console.log(`Charging ${this.batteryCapacity}kWh battery...`);
  }

  getInfo(): string {
    const carInfo = super.getInfo();
    return `${carInfo}, ${this.batteryCapacity}kWh battery`;
  }
}
```

## Interfaces and Classes

### Implementing Interfaces

```typescript
// Interface definition
interface Flyable {
  altitude: number;
  fly(): void;
  land(): void;
}

interface Swimmable {
  depth: number;
  swim(): void;
  surface(): void;
}

// Class implementing single interface
class Airplane implements Flyable {
  altitude: number = 0;

  fly(): void {
    this.altitude = 10000;
    console.log(`Flying at ${this.altitude} feet`);
  }

  land(): void {
    this.altitude = 0;
    console.log("Landed safely");
  }

  // Additional airplane-specific methods
  taxi(): void {
    console.log("Taxiing on runway");
  }
}

// Class implementing multiple interfaces
class Duck implements Flyable, Swimmable {
  altitude: number = 0;
  depth: number = 0;

  // Flyable implementation
  fly(): void {
    this.altitude = 50;
    console.log(`Duck flying at ${this.altitude} feet`);
  }

  land(): void {
    this.altitude = 0;
    console.log("Duck landed");
  }

  // Swimmable implementation
  swim(): void {
    this.depth = 2;
    console.log(`Duck swimming at ${this.depth} feet depth`);
  }

  surface(): void {
    this.depth = 0;
    console.log("Duck surfaced");
  }

  // Duck-specific methods
  quack(): void {
    console.log("Quack quack!");
  }
}

// Using interfaces for type checking
function makeFly(flyable: Flyable): void {
  flyable.fly();
}

function makeSwim(swimmable: Swimmable): void {
  swimmable.swim();
}

const airplane = new Airplane();
const duck = new Duck();

makeFly(airplane); // ✅ OK
makeFly(duck); // ✅ OK
makeSwim(duck); // ✅ OK
// makeSwim(airplane); // ❌ Error: Airplane doesn't implement Swimmable
```

### Interface for Class Structure

```typescript
// Interface describing class structure
interface ClockInterface {
  currentTime: Date;
  setTime(d: Date): void;
  getTime(): string;
}

// Interface for constructor
interface ClockConstructor {
  new (hour: number, minute: number): ClockInterface;
}

// Class implementing the interface
class DigitalClock implements ClockInterface {
  currentTime: Date;

  constructor(hour: number, minute: number) {
    this.currentTime = new Date();
    this.currentTime.setHours(hour, minute, 0, 0);
  }

  setTime(d: Date): void {
    this.currentTime = d;
  }

  getTime(): string {
    return this.currentTime.toLocaleTimeString();
  }
}

class AnalogClock implements ClockInterface {
  currentTime: Date;

  constructor(hour: number, minute: number) {
    this.currentTime = new Date();
    this.currentTime.setHours(hour, minute, 0, 0);
  }

  setTime(d: Date): void {
    this.currentTime = d;
  }

  getTime(): string {
    const hour = this.currentTime.getHours();
    const minute = this.currentTime.getMinutes();
    return `${hour}:${minute.toString().padStart(2, "0")}`;
  }
}

// Factory function using constructor interface
function createClock(
  ctor: ClockConstructor,
  hour: number,
  minute: number
): ClockInterface {
  return new ctor(hour, minute);
}

const digitalClock = createClock(DigitalClock, 10, 30);
const analogClock = createClock(AnalogClock, 15, 45);
```

## Generic Classes

### Basic Generic Classes

```typescript
// Generic class with type parameter
class Container<T> {
  private _value: T;

  constructor(value: T) {
    this._value = value;
  }

  get value(): T {
    return this._value;
  }

  set value(newValue: T) {
    this._value = newValue;
  }

  clone(): Container<T> {
    return new Container(this._value);
  }
}

// Usage with different types
const stringContainer = new Container<string>("Hello");
const numberContainer = new Container<number>(42);
const boolContainer = new Container(true); // Type inferred as boolean

console.log(stringContainer.value.toUpperCase()); // Type-safe string methods
console.log(numberContainer.value.toFixed(2)); // Type-safe number methods
```

### Generic Class with Constraints

```typescript
// Generic class with constraints
interface Identifiable {
  id: string;
}

class Repository<T extends Identifiable> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  findById(id: string): T | undefined {
    return this.items.find((item) => item.id === id);
  }

  update(id: string, updates: Partial<T>): boolean {
    const index = this.items.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.items[index] = { ...this.items[index], ...updates };
      return true;
    }
    return false;
  }

  delete(id: string): boolean {
    const index = this.items.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }

  getAll(): T[] {
    return [...this.items];
  }
}

// Usage with specific types
interface User extends Identifiable {
  name: string;
  email: string;
}

interface Product extends Identifiable {
  name: string;
  price: number;
}

const userRepo = new Repository<User>();
const productRepo = new Repository<Product>();

userRepo.add({ id: "1", name: "John", email: "john@example.com" });
productRepo.add({ id: "P1", name: "MacBook", price: 2000 });
```

### Static Members in Generic Classes

```typescript
class MathUtils<T extends number> {
  // Static properties are shared across all instances
  static readonly PI: number = Math.PI;
  static calculations: number = 0;

  private value: T;

  constructor(value: T) {
    this.value = value;
    MathUtils.calculations++;
  }

  // Static methods cannot use generic type parameters
  static add(a: number, b: number): number {
    MathUtils.calculations++;
    return a + b;
  }

  static getCalculationCount(): number {
    return MathUtils.calculations;
  }

  // Instance methods can use generic type
  multiply(factor: T): T {
    MathUtils.calculations++;
    return (this.value * factor) as T;
  }

  getValue(): T {
    return this.value;
  }
}

// Static members are accessed on the class, not instances
console.log(MathUtils.PI);
console.log(MathUtils.add(5, 3));

const math1 = new MathUtils(10);
const math2 = new MathUtils(20);

console.log(MathUtils.getCalculationCount()); // Shared across all instances
```

## Advanced Class Patterns

### Abstract Classes and Template Method Pattern

```typescript
abstract class DataProcessor<T> {
  // Template method - defines the algorithm structure
  public processData(data: T[]): T[] {
    const validated = this.validateData(data);
    const processed = this.transformData(validated);
    const result = this.saveData(processed);
    this.logResult(result);
    return result;
  }

  // Abstract methods - must be implemented by subclasses
  protected abstract validateData(data: T[]): T[];
  protected abstract transformData(data: T[]): T[];
  protected abstract saveData(data: T[]): T[];

  // Concrete method - common implementation
  protected logResult(result: T[]): void {
    console.log(`Processed ${result.length} items`);
  }
}

interface UserData {
  id: string;
  name: string;
  email: string;
  age: number;
}

class UserDataProcessor extends DataProcessor<UserData> {
  protected validateData(data: UserData[]): UserData[] {
    return data.filter(
      (user) =>
        user.email.includes("@") && user.age >= 0 && user.name.length > 0
    );
  }

  protected transformData(data: UserData[]): UserData[] {
    return data.map((user) => ({
      ...user,
      name: user.name.trim(),
      email: user.email.toLowerCase(),
    }));
  }

  protected saveData(data: UserData[]): UserData[] {
    // Simulate saving to database
    console.log(`Saving ${data.length} users to database`);
    return data;
  }

  // Override parent method
  protected logResult(result: UserData[]): void {
    super.logResult(result);
    console.log(
      `Average age: ${
        result.reduce((sum, user) => sum + user.age, 0) / result.length
      }`
    );
  }
}
```

### Mixins Pattern

```typescript
// Mixin functions
type Constructor<T = {}> = new (...args: any[]) => T;

// Timestamp mixin
function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    createdAt: Date = new Date();
    updatedAt: Date = new Date();

    touch(): void {
      this.updatedAt = new Date();
    }

    getAge(): number {
      return Date.now() - this.createdAt.getTime();
    }
  };
}

// Activatable mixin
function Activatable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    isActive: boolean = false;

    activate(): void {
      this.isActive = true;
    }

    deactivate(): void {
      this.isActive = false;
    }

    toggle(): void {
      this.isActive = !this.isActive;
    }
  };
}

// Base class
class User {
  constructor(public name: string, public email: string) {}

  greet(): string {
    return `Hello, I'm ${this.name}`;
  }
}

// Apply mixins
const TimestampedUser = Timestamped(User);
const ActivatableUser = Activatable(User);
const EnhancedUser = Timestamped(Activatable(User));

// Usage
const user = new EnhancedUser("John", "john@example.com");
user.activate();
user.touch();

console.log(user.greet()); // From User
console.log(user.isActive); // From Activatable
console.log(user.getAge()); // From Timestamped
console.log(user.createdAt); // From Timestamped
```

### Decorator Pattern with Classes

```typescript
// Method decorator
function Log(
  target: any,
  propertyName: string,
  descriptor: PropertyDescriptor
) {
  const method = descriptor.value;

  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${propertyName} with arguments:`, args);
    const result = method.apply(this, args);
    console.log(`${propertyName} returned:`, result);
    return result;
  };
}

// Property decorator
function ReadOnly(target: any, propertyName: string) {
  let value: any;

  const getter = () => value;
  const setter = () => {
    throw new Error(`Cannot set read-only property ${propertyName}`);
  };

  Object.defineProperty(target, propertyName, {
    get: getter,
    set: setter,
    enumerable: true,
    configurable: true,
  });
}

// Class decorator
function Sealed(target: any) {
  Object.seal(target);
  Object.seal(target.prototype);
}

@Sealed
class Calculator {
  @ReadOnly
  public readonly version: string = "1.0.0";

  @Log
  add(a: number, b: number): number {
    return a + b;
  }

  @Log
  multiply(a: number, b: number): number {
    return a * b;
  }
}

// Usage
const calc = new Calculator();
console.log(calc.add(5, 3)); // Logs method call and result
console.log(calc.multiply(4, 7)); // Logs method call and result
// calc.version = "2.0.0";        // Error: Cannot set read-only property
```

## Best Practices

### Class Design Principles

```typescript
// ✅ Single Responsibility Principle - Each class has one reason to change
class EmailValidator {
  validate(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

class EmailSender {
  constructor(private validator: EmailValidator) {}

  send(to: string, subject: string, body: string): boolean {
    if (!this.validator.validate(to)) {
      throw new Error("Invalid email address");
    }
    // Send email logic
    return true;
  }
}

// ✅ Open/Closed Principle - Open for extension, closed for modification
abstract class Shape {
  abstract calculateArea(): number;
}

class Rectangle extends Shape {
  constructor(private width: number, private height: number) {
    super();
  }

  calculateArea(): number {
    return this.width * this.height;
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }

  calculateArea(): number {
    return Math.PI * this.radius ** 2;
  }
}

// ✅ Liskov Substitution Principle - Subclasses should be substitutable
function calculateTotalArea(shapes: Shape[]): number {
  return shapes.reduce((total, shape) => total + shape.calculateArea(), 0);
}

// ✅ Interface Segregation - Clients shouldn't depend on interfaces they don't use
interface Readable {
  read(): string;
}

interface Writable {
  write(data: string): void;
}

interface ReadWrite extends Readable, Writable {}

class FileReader implements Readable {
  read(): string {
    return "file content";
  }
}

class FileWriter implements Writable {
  write(data: string): void {
    console.log(`Writing: ${data}`);
  }
}

class FileHandler implements ReadWrite {
  read(): string {
    return "file content";
  }

  write(data: string): void {
    console.log(`Writing: ${data}`);
  }
}

// ✅ Dependency Inversion - Depend on abstractions, not concretions
interface Logger {
  log(message: string): void;
}

class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(message);
  }
}

class FileLogger implements Logger {
  log(message: string): void {
    // Log to file
  }
}

class UserService {
  constructor(private logger: Logger) {} // Depends on abstraction

  createUser(userData: any): void {
    // Create user logic
    this.logger.log("User created successfully");
  }
}

// Usage - can inject any logger implementation
const userService1 = new UserService(new ConsoleLogger());
const userService2 = new UserService(new FileLogger());
```

### Performance and Memory Considerations

```typescript
// ✅ Use readonly for immutable data
class ImmutablePoint {
  constructor(public readonly x: number, public readonly y: number) {}

  // Return new instance instead of modifying existing
  move(deltaX: number, deltaY: number): ImmutablePoint {
    return new ImmutablePoint(this.x + deltaX, this.y + deltaY);
  }
}

// ✅ Use private fields (#) for true privacy (ES2022+)
class ModernClass {
  #privateField: string;

  constructor(value: string) {
    this.#privateField = value;
  }

  #privateMethod(): string {
    return this.#privateField;
  }

  public getPrivateValue(): string {
    return this.#privateMethod();
  }
}

// ✅ Use static methods for utility functions
class MathHelper {
  static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  static lerp(start: number, end: number, t: number): number {
    return start + (end - start) * t;
  }

  // No need to instantiate for utility functions
}

// Usage: MathHelper.clamp(15, 0, 10) instead of new MathHelper().clamp(...)
```
