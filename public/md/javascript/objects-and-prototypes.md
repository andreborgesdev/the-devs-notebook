# JavaScript Objects and Prototypes

## Objects Fundamentals

### Object Creation Methods

#### Object Literals

```javascript
const person = {
  name: "John",
  age: 30,
  "full-name": "John Doe", // Properties with special characters
  1: "numeric property", // Numeric keys converted to strings

  // Method shorthand (ES6)
  greet() {
    return `Hello, I'm ${this.name}`;
  },

  // Computed property names (ES6)
  [Symbol.toStringTag]: "Person",
  ["dynamic_" + "key"]: "dynamic value",
};
```

#### Constructor Functions

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;

  // Methods defined in constructor (not recommended)
  this.greet = function () {
    return `Hello, I'm ${this.name}`;
  };
}

// Better approach - methods on prototype
Person.prototype.introduce = function () {
  return `Hi, I'm ${this.name} and I'm ${this.age} years old`;
};

const john = new Person("John", 30);
console.log(john.introduce());
```

#### Object.create()

```javascript
const personPrototype = {
  greet() {
    return `Hello, I'm ${this.name}`;
  },

  setAge(age) {
    this.age = age;
  },
};

const person = Object.create(personPrototype);
person.name = "Alice";
person.age = 25;

console.log(person.greet()); // 'Hello, I'm Alice'

// With properties
const anotherPerson = Object.create(personPrototype, {
  name: {
    value: "Bob",
    writable: true,
    enumerable: true,
    configurable: true,
  },
  age: {
    value: 35,
    writable: true,
    enumerable: true,
    configurable: true,
  },
});
```

#### Class Syntax (ES6)

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    return `Hello, I'm ${this.name}`;
  }

  static species() {
    return "Homo sapiens";
  }

  // Getter
  get fullInfo() {
    return `${this.name}, ${this.age} years old`;
  }

  // Setter
  set fullName(value) {
    const [first, last] = value.split(" ");
    this.firstName = first;
    this.lastName = last;
  }
}

const person = new Person("John", 30);
```

### Property Access and Manipulation

#### Property Access Methods

```javascript
const obj = {
  name: "John",
  "full-name": "John Doe",
  age: 30,
};

// Dot notation
console.log(obj.name); // 'John'

// Bracket notation
console.log(obj["name"]); // 'John'
console.log(obj["full-name"]); // 'John Doe'

// Dynamic property access
const prop = "age";
console.log(obj[prop]); // 30

// Property existence
"name" in obj; // true
obj.hasOwnProperty("name"); // true
Object.hasOwnProperty.call(obj, "name"); // Safer approach
```

#### Property Descriptors

```javascript
const obj = {};

Object.defineProperty(obj, "name", {
  value: "John",
  writable: true, // Can be changed
  enumerable: true, // Shows in for...in and Object.keys()
  configurable: true, // Can be deleted or reconfigured
});

// Multiple properties
Object.defineProperties(obj, {
  age: {
    value: 30,
    writable: true,
    enumerable: true,
    configurable: true,
  },
  id: {
    value: 123,
    writable: false, // Read-only
    enumerable: false, // Hidden from enumeration
    configurable: false, // Cannot be deleted
  },
});

// Get descriptor
Object.getOwnPropertyDescriptor(obj, "name");
// { value: 'John', writable: true, enumerable: true, configurable: true }
```

#### Object Property Methods

```javascript
const obj = {
  name: "John",
  age: 30,
  city: "New York",
};

// Get all enumerable properties
Object.keys(obj); // ['name', 'age', 'city']
Object.values(obj); // ['John', 30, 'New York']
Object.entries(obj); // [['name', 'John'], ['age', 30], ['city', 'New York']]

// Get all properties (including non-enumerable)
Object.getOwnPropertyNames(obj); // ['name', 'age', 'city']
Object.getOwnPropertySymbols(obj); // Symbol properties

// Iteration
for (const key in obj) {
  console.log(key, obj[key]);
}

// Convert entries back to object
const entries = [
  ["name", "John"],
  ["age", 30],
];
const newObj = Object.fromEntries(entries);
```

## Prototypes and Inheritance

### Prototype Chain

```javascript
// Every object has a prototype
const obj = {};
console.log(obj.__proto__); // Object.prototype
console.log(Object.getPrototypeOf(obj)); // Better way

// Prototype chain
function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function () {
  return `${this.name} makes a sound`;
};

function Dog(name, breed) {
  Animal.call(this, name); // Call parent constructor
  this.breed = breed;
}

// Set up inheritance
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function () {
  return `${this.name} barks!`;
};

const dog = new Dog("Buddy", "Golden Retriever");
console.log(dog.speak()); // 'Buddy makes a sound'
console.log(dog.bark()); // 'Buddy barks!'

// Prototype chain: dog -> Dog.prototype -> Animal.prototype -> Object.prototype -> null
```

### Prototype Methods

```javascript
// Check prototype relationship
Dog.prototype.isPrototypeOf(dog); // true
Animal.prototype.isPrototypeOf(dog); // true

// instanceof operator
dog instanceof Dog; // true
dog instanceof Animal; // true
dog instanceof Object; // true

// Set prototype
const animal = { type: "mammal" };
const cat = Object.create(animal);
cat.name = "Whiskers";

// Change prototype (not recommended in production)
Object.setPrototypeOf(cat, { type: "feline" });
```

### Modern Class Inheritance (ES6)

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return `${this.name} makes a sound`;
  }

  static getSpecies() {
    return "Unknown species";
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // Call parent constructor
    this.breed = breed;
  }

  speak() {
    return `${this.name} barks!`;
  }

  getInfo() {
    return `${super.speak()} and is a ${this.breed}`;
  }

  static getSpecies() {
    return "Canis lupus familiaris";
  }
}

const dog = new Dog("Max", "Labrador");
console.log(dog.speak()); // 'Max barks!'
console.log(dog.getInfo()); // 'Max barks! and is a Labrador'
console.log(Dog.getSpecies()); // 'Canis lupus familiaris'
```

## Advanced Object Concepts

### Object Composition vs Inheritance

```javascript
// Composition - favor over inheritance
const canFly = {
  fly() {
    return `${this.name} is flying`;
  },
};

const canSwim = {
  swim() {
    return `${this.name} is swimming`;
  },
};

const canWalk = {
  walk() {
    return `${this.name} is walking`;
  },
};

// Create objects with mixed capabilities
function createBird(name) {
  return Object.assign({ name }, canFly, canWalk);
}

function createFish(name) {
  return Object.assign({ name }, canSwim);
}

function createDuck(name) {
  return Object.assign({ name }, canFly, canSwim, canWalk);
}

const sparrow = createBird("Sparrow");
const salmon = createFish("Salmon");
const duck = createDuck("Duck");
```

### Factory Functions

```javascript
function createUser(name, email) {
  let isActive = true;

  return {
    // Public properties
    name,
    email,

    // Public methods
    activate() {
      isActive = true;
      return this;
    },

    deactivate() {
      isActive = false;
      return this;
    },

    getStatus() {
      return isActive ? "active" : "inactive";
    },

    // Method chaining
    updateEmail(newEmail) {
      this.email = newEmail;
      return this;
    },
  };
}

const user = createUser("John", "john@example.com");
user.deactivate().updateEmail("newemail@example.com");
```

### Mixins

```javascript
const Timestamped = {
  init() {
    this.created = new Date();
    return this;
  },

  touch() {
    this.updated = new Date();
    return this;
  },
};

const Serializable = {
  serialize() {
    return JSON.stringify(this);
  },

  deserialize(data) {
    Object.assign(this, JSON.parse(data));
    return this;
  },
};

function createDocument(title, content) {
  const doc = {
    title,
    content,

    setTitle(newTitle) {
      this.title = newTitle;
      this.touch();
      return this;
    },
  };

  // Apply mixins
  return Object.assign(doc, Timestamped, Serializable).init();
}

const doc = createDocument("My Document", "Content here");
```

## Object Patterns

### Module Pattern

```javascript
const Calculator = (function () {
  // Private variables
  let result = 0;
  let history = [];

  // Private methods
  function addToHistory(operation) {
    history.push(operation);
    if (history.length > 10) {
      history.shift();
    }
  }

  // Public API
  return {
    add(value) {
      result += value;
      addToHistory(`+${value}`);
      return this;
    },

    subtract(value) {
      result -= value;
      addToHistory(`-${value}`);
      return this;
    },

    multiply(value) {
      result *= value;
      addToHistory(`*${value}`);
      return this;
    },

    getResult() {
      return result;
    },

    getHistory() {
      return history.slice(); // Return copy
    },

    reset() {
      result = 0;
      history = [];
      return this;
    },
  };
})();

Calculator.add(10).multiply(2).subtract(5);
console.log(Calculator.getResult()); // 15
```

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
    return this;
  }

  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter((cb) => cb !== callback);
    }
    return this;
  }

  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach((callback) => {
        callback.apply(this, args);
      });
    }
    return this;
  }

  once(event, callback) {
    const onceWrapper = (...args) => {
      callback.apply(this, args);
      this.off(event, onceWrapper);
    };
    this.on(event, onceWrapper);
    return this;
  }
}

const emitter = new EventEmitter();

emitter.on("user:login", (user) => {
  console.log(`${user.name} logged in`);
});

emitter.emit("user:login", { name: "John" });
```

### Proxy Pattern (ES6)

```javascript
// Property validation
function createValidatedUser(target) {
  return new Proxy(target, {
    set(obj, prop, value) {
      if (prop === "age" && (typeof value !== "number" || value < 0)) {
        throw new Error("Age must be a positive number");
      }

      if (prop === "email" && !value.includes("@")) {
        throw new Error("Invalid email format");
      }

      obj[prop] = value;
      return true;
    },

    get(obj, prop) {
      if (prop === "fullName") {
        return `${obj.firstName} ${obj.lastName}`;
      }

      return obj[prop];
    },
  });
}

const user = createValidatedUser({});
user.firstName = "John";
user.lastName = "Doe";
user.age = 30;
user.email = "john@example.com";

console.log(user.fullName); // 'John Doe'

// Array negative indexing
function createArrayProxy(array) {
  return new Proxy(array, {
    get(target, prop) {
      if (typeof prop === "string" && /^-\d+$/.test(prop)) {
        const index = target.length + parseInt(prop);
        return target[index];
      }
      return target[prop];
    },
  });
}

const arr = createArrayProxy([1, 2, 3, 4, 5]);
console.log(arr[-1]); // 5
console.log(arr[-2]); // 4
```

## Object Property Features

### Getters and Setters

```javascript
const user = {
  _name: "",
  _age: 0,

  get name() {
    return this._name.toUpperCase();
  },

  set name(value) {
    if (typeof value !== "string") {
      throw new Error("Name must be a string");
    }
    this._name = value.trim();
  },

  get age() {
    return this._age;
  },

  set age(value) {
    if (value < 0 || value > 150) {
      throw new Error("Invalid age");
    }
    this._age = value;
  },

  get canVote() {
    return this._age >= 18;
  },
};

user.name = "john doe";
user.age = 25;
console.log(user.name); // 'JOHN DOE'
console.log(user.canVote); // true
```

### Object Freezing and Sealing

```javascript
const obj = { name: "John", age: 30 };

// Object.freeze - completely immutable
const frozenObj = Object.freeze({ ...obj });
// frozenObj.name = 'Jane'; // Silently fails (throws in strict mode)
// delete frozenObj.age;    // Silently fails
// frozenObj.city = 'NYC';  // Silently fails

Object.isFrozen(frozenObj); // true

// Object.seal - no new properties, existing can be modified
const sealedObj = Object.seal({ ...obj });
sealedObj.name = "Jane"; // Works
// delete sealedObj.age;    // Fails
// sealedObj.city = 'NYC';  // Fails

Object.isSealed(sealedObj); // true

// Object.preventExtensions - no new properties
const nonExtensibleObj = Object.preventExtensions({ ...obj });
nonExtensibleObj.name = "Jane"; // Works
delete nonExtensibleObj.age; // Works
// nonExtensibleObj.city = 'NYC'; // Fails

Object.isExtensible(nonExtensibleObj); // false
```

## Performance and Memory Considerations

### Object Pooling

```javascript
class ObjectPool {
  constructor(createFn, resetFn, maxSize = 100) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.maxSize = maxSize;
    this.pool = [];
  }

  acquire() {
    if (this.pool.length > 0) {
      return this.pool.pop();
    }
    return this.createFn();
  }

  release(obj) {
    if (this.pool.length < this.maxSize) {
      this.resetFn(obj);
      this.pool.push(obj);
    }
  }
}

// Usage
const particlePool = new ObjectPool(
  () => ({ x: 0, y: 0, vx: 0, vy: 0, life: 0 }),
  (obj) => {
    obj.x = obj.y = obj.vx = obj.vy = obj.life = 0;
  }
);
```

### WeakMap and WeakSet

```javascript
// WeakMap - garbage collection friendly
const privateData = new WeakMap();

class User {
  constructor(name) {
    this.name = name;
    privateData.set(this, { password: "", loginCount: 0 });
  }

  login(password) {
    const data = privateData.get(this);
    if (data.password === password) {
      data.loginCount++;
      return true;
    }
    return false;
  }

  setPassword(password) {
    privateData.get(this).password = password;
  }
}

// WeakSet - for object membership
const loggedInUsers = new WeakSet();

function loginUser(user) {
  loggedInUsers.add(user);
}

function isLoggedIn(user) {
  return loggedInUsers.has(user);
}
```

## Common Interview Questions

### Object Comparison

```javascript
// Objects are compared by reference
const obj1 = { name: "John" };
const obj2 = { name: "John" };
const obj3 = obj1;

obj1 === obj2; // false (different objects)
obj1 === obj3; // true (same reference)

// Deep equality function
function deepEqual(a, b) {
  if (a === b) return true;

  if (a == null || b == null) return false;

  if (typeof a !== "object" || typeof b !== "object") return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }

  return true;
}
```

### Property Enumeration

```javascript
const obj = Object.create({ inherited: "value" });
obj.own = "own value";

Object.defineProperty(obj, "nonEnumerable", {
  value: "hidden",
  enumerable: false,
});

// Different iteration methods
for (const key in obj) {
  console.log(key); // 'own', 'inherited'
}

Object.keys(obj); // ['own']
Object.getOwnPropertyNames(obj); // ['own', 'nonEnumerable']
Object.hasOwnProperty.call(obj, "own"); // true
```

Understanding objects and prototypes is crucial for JavaScript mastery. These concepts form the backbone of JavaScript's object-oriented programming capabilities and are frequently tested in technical interviews.
