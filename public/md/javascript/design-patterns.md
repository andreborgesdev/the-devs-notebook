# JavaScript Design Patterns

## Creational Patterns

### Singleton Pattern

```javascript
class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }

    this.connection = null;
    this.isConnected = false;
    Database.instance = this;

    return this;
  }

  connect() {
    if (!this.isConnected) {
      this.connection = "Database connection established";
      this.isConnected = true;
    }
    return this.connection;
  }

  disconnect() {
    this.connection = null;
    this.isConnected = false;
  }
}

// Usage
const db1 = new Database();
const db2 = new Database();
console.log(db1 === db2); // true

// Module-based Singleton
const ConfigManager = (() => {
  let instance = null;
  let config = {};

  return {
    getInstance() {
      if (!instance) {
        instance = {
          get(key) {
            return config[key];
          },
          set(key, value) {
            config[key] = value;
          },
          getAll() {
            return { ...config };
          },
        };
      }
      return instance;
    },
  };
})();
```

### Factory Pattern

```javascript
class UserFactory {
  static createUser(type, data) {
    switch (type) {
      case "admin":
        return new AdminUser(data);
      case "moderator":
        return new ModeratorUser(data);
      case "regular":
        return new RegularUser(data);
      default:
        throw new Error(`Unknown user type: ${type}`);
    }
  }
}

class User {
  constructor({ name, email }) {
    this.name = name;
    this.email = email;
    this.permissions = [];
  }
}

class AdminUser extends User {
  constructor(data) {
    super(data);
    this.permissions = ["read", "write", "delete", "manage_users"];
    this.role = "admin";
  }
}

class ModeratorUser extends User {
  constructor(data) {
    super(data);
    this.permissions = ["read", "write", "moderate"];
    this.role = "moderator";
  }
}

class RegularUser extends User {
  constructor(data) {
    super(data);
    this.permissions = ["read"];
    this.role = "user";
  }
}

// Abstract Factory Pattern
class UIFactory {
  static createButton(theme) {
    const factories = {
      light: LightThemeFactory,
      dark: DarkThemeFactory,
      mobile: MobileThemeFactory,
    };

    const factory = factories[theme];
    if (!factory) {
      throw new Error(`Unknown theme: ${theme}`);
    }

    return factory.createButton();
  }
}

class LightThemeFactory {
  static createButton() {
    return {
      render() {
        return '<button class="light-button">Click me</button>';
      },
    };
  }
}

class DarkThemeFactory {
  static createButton() {
    return {
      render() {
        return '<button class="dark-button">Click me</button>';
      },
    };
  }
}
```

### Builder Pattern

```javascript
class QueryBuilder {
  constructor() {
    this.query = {
      select: [],
      from: "",
      where: [],
      orderBy: [],
      limit: null,
    };
  }

  select(fields) {
    this.query.select = Array.isArray(fields) ? fields : [fields];
    return this;
  }

  from(table) {
    this.query.from = table;
    return this;
  }

  where(condition) {
    this.query.where.push(condition);
    return this;
  }

  orderBy(field, direction = "ASC") {
    this.query.orderBy.push(`${field} ${direction}`);
    return this;
  }

  limitTo(count) {
    this.query.limit = count;
    return this;
  }

  build() {
    const { select, from, where, orderBy, limit } = this.query;

    let sql = `SELECT ${select.join(", ")} FROM ${from}`;

    if (where.length > 0) {
      sql += ` WHERE ${where.join(" AND ")}`;
    }

    if (orderBy.length > 0) {
      sql += ` ORDER BY ${orderBy.join(", ")}`;
    }

    if (limit) {
      sql += ` LIMIT ${limit}`;
    }

    return sql;
  }
}

// Usage
const query = new QueryBuilder()
  .select(["name", "email", "age"])
  .from("users")
  .where("age > 18")
  .where('status = "active"')
  .orderBy("name")
  .limitTo(10)
  .build();
```

## Structural Patterns

### Adapter Pattern

```javascript
// Old API
class OldPaymentGateway {
  makePayment(amount) {
    return `Payment of $${amount} processed via old gateway`;
  }
}

// New API
class NewPaymentGateway {
  processPayment(paymentData) {
    return `Payment of $${paymentData.amount} processed via new gateway`;
  }
}

// Adapter
class PaymentGatewayAdapter {
  constructor(gateway) {
    this.gateway = gateway;
  }

  makePayment(amount) {
    if (this.gateway instanceof OldPaymentGateway) {
      return this.gateway.makePayment(amount);
    } else if (this.gateway instanceof NewPaymentGateway) {
      return this.gateway.processPayment({ amount });
    }
  }
}

// Usage
const oldGateway = new PaymentGatewayAdapter(new OldPaymentGateway());
const newGateway = new PaymentGatewayAdapter(new NewPaymentGateway());

console.log(oldGateway.makePayment(100));
console.log(newGateway.makePayment(100));
```

### Decorator Pattern

```javascript
class Coffee {
  cost() {
    return 5;
  }

  description() {
    return "Simple coffee";
  }
}

class CoffeeDecorator {
  constructor(coffee) {
    this.coffee = coffee;
  }

  cost() {
    return this.coffee.cost();
  }

  description() {
    return this.coffee.description();
  }
}

class MilkDecorator extends CoffeeDecorator {
  cost() {
    return this.coffee.cost() + 2;
  }

  description() {
    return this.coffee.description() + ", milk";
  }
}

class SugarDecorator extends CoffeeDecorator {
  cost() {
    return this.coffee.cost() + 1;
  }

  description() {
    return this.coffee.description() + ", sugar";
  }
}

class WhipDecorator extends CoffeeDecorator {
  cost() {
    return this.coffee.cost() + 3;
  }

  description() {
    return this.coffee.description() + ", whipped cream";
  }
}

// Usage
let coffee = new Coffee();
coffee = new MilkDecorator(coffee);
coffee = new SugarDecorator(coffee);
coffee = new WhipDecorator(coffee);

console.log(coffee.description()); // Simple coffee, milk, sugar, whipped cream
console.log(coffee.cost()); // 11

// Function-based Decorator
function withLogging(fn) {
  return function (...args) {
    console.log(`Calling ${fn.name} with args:`, args);
    const result = fn.apply(this, args);
    console.log(`${fn.name} returned:`, result);
    return result;
  };
}

function withTiming(fn) {
  return function (...args) {
    const start = performance.now();
    const result = fn.apply(this, args);
    const end = performance.now();
    console.log(`${fn.name} took ${end - start}ms`);
    return result;
  };
}

// Usage
const add = (a, b) => a + b;
const loggedAdd = withLogging(add);
const timedLoggedAdd = withTiming(loggedAdd);
```

### Facade Pattern

```javascript
class CPU {
  freeze() {
    console.log("CPU frozen");
  }
  jump(position) {
    console.log(`CPU jumping to ${position}`);
  }
  execute() {
    console.log("CPU executing");
  }
}

class Memory {
  load(position, data) {
    console.log(`Loading data at position ${position}`);
  }
}

class HardDrive {
  read(lba, size) {
    console.log(`Reading ${size} bytes from ${lba}`);
    return "boot data";
  }
}

// Facade
class ComputerFacade {
  constructor() {
    this.cpu = new CPU();
    this.memory = new Memory();
    this.hardDrive = new HardDrive();
  }

  start() {
    console.log("Starting computer...");
    this.cpu.freeze();
    const bootData = this.hardDrive.read(0, 1024);
    this.memory.load(0, bootData);
    this.cpu.jump(0);
    this.cpu.execute();
    console.log("Computer started!");
  }
}

// Usage
const computer = new ComputerFacade();
computer.start();
```

## Behavioral Patterns

### Observer Pattern

```javascript
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter((cb) => cb !== callback);
    }
  }

  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach((callback) => callback(data));
    }
  }

  once(event, callback) {
    const wrapper = (data) => {
      callback(data);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }
}

// Usage
class UserService extends EventEmitter {
  createUser(userData) {
    const user = { id: Date.now(), ...userData };
    this.emit("userCreated", user);
    return user;
  }

  deleteUser(userId) {
    this.emit("userDeleted", { id: userId });
  }
}

const userService = new UserService();

userService.on("userCreated", (user) => {
  console.log("New user created:", user.name);
});

userService.on("userCreated", (user) => {
  console.log("Sending welcome email to:", user.email);
});

userService.on("userDeleted", (user) => {
  console.log("User deleted:", user.id);
});

userService.createUser({ name: "John", email: "john@example.com" });
```

### Strategy Pattern

```javascript
class PaymentProcessor {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  processPayment(amount, details) {
    return this.strategy.process(amount, details);
  }
}

class CreditCardStrategy {
  process(amount, details) {
    console.log(`Processing $${amount} via Credit Card`);
    console.log(`Card ending in: ${details.cardNumber.slice(-4)}`);
    return { success: true, transactionId: "cc_" + Date.now() };
  }
}

class PayPalStrategy {
  process(amount, details) {
    console.log(`Processing $${amount} via PayPal`);
    console.log(`PayPal account: ${details.email}`);
    return { success: true, transactionId: "pp_" + Date.now() };
  }
}

class BankTransferStrategy {
  process(amount, details) {
    console.log(`Processing $${amount} via Bank Transfer`);
    console.log(`Account: ${details.accountNumber}`);
    return { success: true, transactionId: "bt_" + Date.now() };
  }
}

// Usage
const processor = new PaymentProcessor(new CreditCardStrategy());
processor.processPayment(100, { cardNumber: "1234567890123456" });

processor.setStrategy(new PayPalStrategy());
processor.processPayment(200, { email: "user@example.com" });

// Sorting Strategy Example
class SortContext {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  sort(data) {
    return this.strategy.sort([...data]);
  }
}

class BubbleSortStrategy {
  sort(data) {
    const arr = [...data];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }
    return arr;
  }
}

class QuickSortStrategy {
  sort(data) {
    if (data.length <= 1) return data;

    const pivot = data[Math.floor(data.length / 2)];
    const left = data.filter((x) => x < pivot);
    const middle = data.filter((x) => x === pivot);
    const right = data.filter((x) => x > pivot);

    return [...this.sort(left), ...middle, ...this.sort(right)];
  }
}
```

### Command Pattern

```javascript
class Command {
  execute() {
    throw new Error("Execute method must be implemented");
  }

  undo() {
    throw new Error("Undo method must be implemented");
  }
}

class CreateFileCommand extends Command {
  constructor(fileSystem, filename, content) {
    super();
    this.fileSystem = fileSystem;
    this.filename = filename;
    this.content = content;
  }

  execute() {
    this.fileSystem.createFile(this.filename, this.content);
  }

  undo() {
    this.fileSystem.deleteFile(this.filename);
  }
}

class DeleteFileCommand extends Command {
  constructor(fileSystem, filename) {
    super();
    this.fileSystem = fileSystem;
    this.filename = filename;
    this.backup = null;
  }

  execute() {
    this.backup = this.fileSystem.getFile(this.filename);
    this.fileSystem.deleteFile(this.filename);
  }

  undo() {
    if (this.backup) {
      this.fileSystem.createFile(this.filename, this.backup);
    }
  }
}

class FileSystemInvoker {
  constructor() {
    this.history = [];
    this.currentIndex = -1;
  }

  execute(command) {
    command.execute();
    this.history = this.history.slice(0, this.currentIndex + 1);
    this.history.push(command);
    this.currentIndex++;
  }

  undo() {
    if (this.currentIndex >= 0) {
      const command = this.history[this.currentIndex];
      command.undo();
      this.currentIndex--;
    }
  }

  redo() {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      const command = this.history[this.currentIndex];
      command.execute();
    }
  }
}

// Macro Command
class MacroCommand extends Command {
  constructor(commands) {
    super();
    this.commands = commands;
  }

  execute() {
    this.commands.forEach((command) => command.execute());
  }

  undo() {
    this.commands.reverse().forEach((command) => command.undo());
  }
}
```

### State Pattern

```javascript
class TrafficLight {
  constructor() {
    this.redState = new RedState(this);
    this.yellowState = new YellowState(this);
    this.greenState = new GreenState(this);

    this.currentState = this.redState;
  }

  setState(state) {
    this.currentState = state;
  }

  change() {
    this.currentState.change();
  }

  getState() {
    return this.currentState.constructor.name;
  }
}

class TrafficLightState {
  constructor(trafficLight) {
    this.trafficLight = trafficLight;
  }

  change() {
    throw new Error("Change method must be implemented");
  }
}

class RedState extends TrafficLightState {
  change() {
    console.log("Red -> Green");
    this.trafficLight.setState(this.trafficLight.greenState);
  }
}

class YellowState extends TrafficLightState {
  change() {
    console.log("Yellow -> Red");
    this.trafficLight.setState(this.trafficLight.redState);
  }
}

class GreenState extends TrafficLightState {
  change() {
    console.log("Green -> Yellow");
    this.trafficLight.setState(this.trafficLight.yellowState);
  }
}

// Document State Example
class Document {
  constructor() {
    this.draftState = new DraftState(this);
    this.reviewState = new ReviewState(this);
    this.publishedState = new PublishedState(this);

    this.currentState = this.draftState;
    this.content = "";
  }

  setState(state) {
    this.currentState = state;
  }

  edit(content) {
    this.currentState.edit(content);
  }

  review() {
    this.currentState.review();
  }

  publish() {
    this.currentState.publish();
  }
}

class DocumentState {
  constructor(document) {
    this.document = document;
  }
}

class DraftState extends DocumentState {
  edit(content) {
    this.document.content = content;
    console.log("Document edited");
  }

  review() {
    console.log("Document sent for review");
    this.document.setState(this.document.reviewState);
  }

  publish() {
    console.log("Draft cannot be published directly");
  }
}

class ReviewState extends DocumentState {
  edit(content) {
    console.log("Document is under review, editing not allowed");
  }

  review() {
    console.log("Document is already under review");
  }

  publish() {
    console.log("Document published");
    this.document.setState(this.document.publishedState);
  }
}

class PublishedState extends DocumentState {
  edit(content) {
    console.log("Creating new draft from published document");
    this.document.content = content;
    this.document.setState(this.document.draftState);
  }

  review() {
    console.log("Published document cannot be reviewed");
  }

  publish() {
    console.log("Document is already published");
  }
}
```

## Module Patterns

### Module Pattern (IIFE)

```javascript
const Calculator = (() => {
  let result = 0;

  function add(x) {
    result += x;
    return this;
  }

  function subtract(x) {
    result -= x;
    return this;
  }

  function multiply(x) {
    result *= x;
    return this;
  }

  function getResult() {
    return result;
  }

  function reset() {
    result = 0;
    return this;
  }

  return {
    add,
    subtract,
    multiply,
    getResult,
    reset,
  };
})();

// Usage
Calculator.add(5).multiply(2).subtract(3).getResult(); // 7
```

### Revealing Module Pattern

```javascript
const UserManager = (() => {
  let users = [];
  let currentUser = null;

  function addUser(user) {
    users.push({ ...user, id: Date.now() });
    return users[users.length - 1];
  }

  function removeUser(id) {
    users = users.filter((user) => user.id !== id);
  }

  function findUser(id) {
    return users.find((user) => user.id === id);
  }

  function getAllUsers() {
    return [...users];
  }

  function setCurrentUser(id) {
    currentUser = findUser(id);
  }

  function getCurrentUser() {
    return currentUser;
  }

  function isLoggedIn() {
    return currentUser !== null;
  }

  return {
    add: addUser,
    remove: removeUser,
    find: findUser,
    getAll: getAllUsers,
    login: setCurrentUser,
    getCurrentUser,
    isLoggedIn,
  };
})();
```

## Advanced Patterns

### Mixin Pattern

```javascript
const CanFly = {
  fly() {
    console.log(`${this.name} is flying`);
  },

  land() {
    console.log(`${this.name} has landed`);
  },
};

const CanSwim = {
  swim() {
    console.log(`${this.name} is swimming`);
  },

  dive() {
    console.log(`${this.name} is diving`);
  },
};

const CanWalk = {
  walk() {
    console.log(`${this.name} is walking`);
  },

  run() {
    console.log(`${this.name} is running`);
  },
};

function mixin(target, ...sources) {
  Object.assign(target.prototype, ...sources);
}

class Bird {
  constructor(name) {
    this.name = name;
  }
}

class Fish {
  constructor(name) {
    this.name = name;
  }
}

class Duck {
  constructor(name) {
    this.name = name;
  }
}

mixin(Bird, CanFly, CanWalk);
mixin(Fish, CanSwim);
mixin(Duck, CanFly, CanSwim, CanWalk);

const eagle = new Bird("Eagle");
eagle.fly(); // Eagle is flying

const shark = new Fish("Shark");
shark.swim(); // Shark is swimming

const mallard = new Duck("Mallard");
mallard.fly(); // Mallard is flying
mallard.swim(); // Mallard is swimming
mallard.walk(); // Mallard is walking
```

### Proxy Pattern

```javascript
class BankAccount {
  constructor(balance) {
    this.balance = balance;
  }

  withdraw(amount) {
    if (amount <= this.balance) {
      this.balance -= amount;
      return `Withdrew $${amount}. Balance: $${this.balance}`;
    }
    return "Insufficient funds";
  }

  deposit(amount) {
    this.balance += amount;
    return `Deposited $${amount}. Balance: $${this.balance}`;
  }
}

class BankAccountProxy {
  constructor(bankAccount, user) {
    this.bankAccount = bankAccount;
    this.user = user;
  }

  withdraw(amount) {
    if (this.user.isAuthenticated && this.user.hasPermission("withdraw")) {
      if (amount > 1000 && !this.user.isVip) {
        return "Large withdrawals require VIP status";
      }
      return this.bankAccount.withdraw(amount);
    }
    return "Access denied";
  }

  deposit(amount) {
    if (this.user.isAuthenticated) {
      return this.bankAccount.deposit(amount);
    }
    return "Access denied";
  }

  getBalance() {
    if (this.user.isAuthenticated) {
      return this.bankAccount.balance;
    }
    return "Access denied";
  }
}

// Virtual Proxy for lazy loading
class ImageProxy {
  constructor(url) {
    this.url = url;
    this.image = null;
  }

  async display() {
    if (!this.image) {
      console.log("Loading image...");
      this.image = await this.loadImage();
    }
    console.log(`Displaying image: ${this.url}`);
    return this.image;
  }

  async loadImage() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Image data for ${this.url}`);
      }, 1000);
    });
  }
}
```

## Functional Programming Patterns

### Higher-Order Functions

```javascript
const withAuth = (fn) => {
  return function (req, res, ...args) {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    return fn(req, res, ...args);
  };
};

const withValidation = (schema) => {
  return (fn) => {
    return function (req, res, ...args) {
      const errors = schema.validate(req.body);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }
      return fn(req, res, ...args);
    };
  };
};

const withLogging = (fn) => {
  return function (...args) {
    console.log(`Calling ${fn.name} with:`, args);
    const result = fn.apply(this, args);
    console.log(`${fn.name} returned:`, result);
    return result;
  };
};

// Compose functions
const compose =
  (...fns) =>
  (value) =>
    fns.reduceRight((acc, fn) => fn(acc), value);
const pipe =
  (...fns) =>
  (value) =>
    fns.reduce((acc, fn) => fn(acc), value);

// Usage
const addOne = (x) => x + 1;
const double = (x) => x * 2;
const square = (x) => x * x;

const composedFn = compose(square, double, addOne);
const pipedFn = pipe(addOne, double, square);

console.log(composedFn(3)); // square(double(addOne(3))) = square(8) = 64
console.log(pipedFn(3)); // square(double(addOne(3))) = square(8) = 64
```

## Common Design Pattern Interview Questions

**Q: What is the Singleton pattern and when would you use it?**
A: Singleton ensures only one instance of a class exists. Use for database connections, loggers, or configuration managers.

**Q: Explain the difference between Factory and Abstract Factory patterns.**
A: Factory creates objects of one type, Abstract Factory creates families of related objects.

**Q: When would you use the Observer pattern?**
A: When you need to notify multiple objects about state changes, like event systems or MVC architectures.

**Q: What's the difference between Strategy and State patterns?**
A: Strategy selects algorithms at runtime, State changes behavior based on internal state.

**Q: How does the Decorator pattern differ from inheritance?**
A: Decorator adds behavior at runtime without modifying the original class, while inheritance is compile-time.

**Q: What are the benefits of using design patterns?**
A: Reusable solutions, common vocabulary, best practices, and proven architectures.

This comprehensive guide covers essential JavaScript design patterns crucial for technical interviews and scalable application development.
