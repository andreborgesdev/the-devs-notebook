# Software Engineering Principles

## Overview

Software Engineering Principles are fundamental guidelines and best practices that help developers build maintainable, scalable, and robust software systems. These principles guide decision-making throughout the software development lifecycle.

## SOLID Principles

### Single Responsibility Principle (SRP)

**"A class should have only one reason to change"**

```typescript
// Bad: Multiple responsibilities
class User {
  name: string;
  email: string;

  save() {
    /* database logic */
  }
  sendEmail() {
    /* email logic */
  }
  validateEmail() {
    /* validation logic */
  }
}

// Good: Separate responsibilities
class User {
  constructor(public name: string, public email: string) {}
}

class UserRepository {
  save(user: User) {
    /* database logic */
  }
}

class EmailService {
  send(to: string, message: string) {
    /* email logic */
  }
}

class EmailValidator {
  validate(email: string): boolean {
    /* validation logic */
  }
}
```

### Open-Closed Principle (OCP)

**"Software entities should be open for extension, but closed for modification"**

```typescript
// Bad: Modifying existing code for new shapes
class AreaCalculator {
  calculate(shapes: any[]): number {
    let area = 0;
    for (const shape of shapes) {
      if (shape.type === "circle") {
        area += Math.PI * shape.radius ** 2;
      } else if (shape.type === "rectangle") {
        area += shape.width * shape.height;
      }
    }
    return area;
  }
}

// Good: Extension without modification
interface Shape {
  calculateArea(): number;
}

class Circle implements Shape {
  constructor(private radius: number) {}
  calculateArea(): number {
    return Math.PI * this.radius ** 2;
  }
}

class Rectangle implements Shape {
  constructor(private width: number, private height: number) {}
  calculateArea(): number {
    return this.width * this.height;
  }
}

class AreaCalculator {
  calculate(shapes: Shape[]): number {
    return shapes.reduce((sum, shape) => sum + shape.calculateArea(), 0);
  }
}
```

### Liskov Substitution Principle (LSP)

**"Objects of a superclass should be replaceable with objects of its subclasses"**

### Interface Segregation Principle (ISP)

**"Clients should not be forced to depend on interfaces they don't use"**

### Dependency Inversion Principle (DIP)

**"Depend on abstractions, not concretions"**

## Design Patterns

### Creational Patterns

- **Singleton**: Single instance creation
- **Factory Method**: Object creation interface
- **Abstract Factory**: Family of related objects
- **Builder**: Complex object construction
- **Prototype**: Object cloning

### Structural Patterns

- **Adapter**: Interface compatibility
- **Decorator**: Dynamic behavior addition
- **Facade**: Simplified interface
- **Composite**: Tree structure handling
- **Proxy**: Placeholder/surrogate object

### Behavioral Patterns

- **Observer**: Event notification system
- **Strategy**: Algorithm family selection
- **Command**: Encapsulate requests
- **State**: Object behavior changes
- **Template Method**: Algorithm skeleton

## Code Quality Principles

### DRY (Don't Repeat Yourself)

```typescript
// Bad: Code duplication
function calculateCircleArea(radius: number): number {
  return Math.PI * radius * radius;
}

function calculateCircleCircumference(radius: number): number {
  return 2 * Math.PI * radius;
}

// Good: Extract common functionality
class Circle {
  constructor(private radius: number) {}

  getArea(): number {
    return Math.PI * this.radius ** 2;
  }

  getCircumference(): number {
    return 2 * Math.PI * this.radius;
  }
}
```

### KISS (Keep It Simple, Stupid)

- **Simplicity over complexity**
- **Readable code over clever code**
- **Clear intent over optimization**
- **Straightforward solutions**

### YAGNI (You Aren't Gonna Need It)

- **Don't build features until needed**
- **Avoid premature optimization**
- **Focus on current requirements**
- **Iterative development approach**

## Clean Code Principles

### Naming Conventions

```typescript
// Bad: Unclear naming
let d; // elapsed time in days
function calc(x, y) {
  return x * y;
}

// Good: Descriptive naming
let elapsedTimeInDays;
function calculateArea(width: number, height: number): number {
  return width * height;
}
```

### Function Design

- **Small functions**: One responsibility
- **Descriptive names**: Clear purpose
- **Few parameters**: Easier to understand
- **No side effects**: Predictable behavior
- **Single level of abstraction**: Consistent detail level

### Comments and Documentation

```typescript
// Bad: Unnecessary comments
let x = 5; // Set x to 5
i++; // Increment i

// Good: Meaningful comments
// Calculate compound interest using A = P(1 + r/n)^(nt)
function calculateCompoundInterest(
  principal: number,
  rate: number,
  compoundFrequency: number,
  time: number
): number {
  return (
    principal * Math.pow(1 + rate / compoundFrequency, compoundFrequency * time)
  );
}
```

## Software Architecture Principles

### Separation of Concerns

- **Modular design**: Distinct functionalities
- **Layer separation**: UI, business logic, data
- **Component isolation**: Independent modules
- **Cross-cutting concerns**: Logging, security

### High Cohesion, Low Coupling

- **High Cohesion**: Related functionality together
- **Low Coupling**: Minimal dependencies
- **Interface-based design**: Abstract dependencies
- **Dependency injection**: Inversion of control

### Principle of Least Knowledge (Law of Demeter)

```typescript
// Bad: Violates Law of Demeter
class Customer {
  private address: Address;

  getZipCode(): string {
    return this.address.getZipCode(); // OK
  }

  getCountryCode(): string {
    return this.address.getCountry().getCode(); // Violation!
  }
}

// Good: Encapsulation
class Customer {
  private address: Address;

  getZipCode(): string {
    return this.address.getZipCode();
  }

  getCountryCode(): string {
    return this.address.getCountryCode(); // Delegate to address
  }
}
```

## Testing Principles

### Test-Driven Development (TDD)

```typescript
// 1. Write failing test
describe("Calculator", () => {
  it("should add two numbers correctly", () => {
    const calculator = new Calculator();
    expect(calculator.add(2, 3)).toBe(5);
  });
});

// 2. Write minimal code to pass
class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }
}

// 3. Refactor if needed
```

### Test Pyramid

- **Unit Tests**: Fast, isolated, many
- **Integration Tests**: Component interaction, moderate
- **End-to-End Tests**: Full system, few, expensive

### Testing Best Practices

- **AAA Pattern**: Arrange, Act, Assert
- **Independent Tests**: No shared state
- **Descriptive Names**: Clear test purpose
- **Single Assertion**: One concept per test
- **Test Edge Cases**: Boundary conditions

## Error Handling Principles

### Fail Fast

```typescript
function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error("Division by zero is not allowed");
  }
  return a / b;
}
```

### Exception Handling

- **Use exceptions for exceptional cases**
- **Provide meaningful error messages**
- **Handle exceptions at appropriate level**
- **Clean up resources in finally blocks**
- **Don't ignore exceptions**

### Defensive Programming

```typescript
function processUserData(userData: UserData | null): ProcessedData {
  // Validate input
  if (!userData) {
    throw new Error("User data is required");
  }

  if (!userData.email || !isValidEmail(userData.email)) {
    throw new Error("Valid email is required");
  }

  // Process with confidence
  return {
    id: userData.id,
    email: userData.email.toLowerCase(),
    name: userData.name?.trim() || "Unknown",
  };
}
```

## Performance Principles

### Premature Optimization

- **"Premature optimization is the root of all evil"** - Donald Knuth
- **Measure before optimizing**
- **Profile to find bottlenecks**
- **Optimize for readability first**

### Algorithmic Complexity

- **Understand Big O notation**
- **Choose appropriate data structures**
- **Consider time vs space trade-offs**
- **Cache expensive computations**

### Resource Management

```typescript
// Good: Resource cleanup
class DatabaseConnection {
  private connection: Connection;

  async execute(query: string): Promise<Result> {
    try {
      await this.connection.open();
      return await this.connection.query(query);
    } finally {
      await this.connection.close();
    }
  }
}
```

## Security Principles

### Defense in Depth

- **Multiple security layers**
- **Input validation**
- **Authentication and authorization**
- **Encryption in transit and at rest**
- **Regular security updates**

### Principle of Least Privilege

- **Grant minimum necessary permissions**
- **Role-based access control**
- **Time-limited access tokens**
- **Regular permission audits**

### Security by Design

```typescript
// Good: Secure by default
class UserService {
  async createUser(userData: CreateUserRequest): Promise<User> {
    // Validate input
    this.validateUserData(userData);

    // Hash password
    const hashedPassword = await this.hashPassword(userData.password);

    // Sanitize data
    const sanitizedData = this.sanitizeUserData(userData);

    return await this.userRepository.create({
      ...sanitizedData,
      password: hashedPassword,
    });
  }
}
```

## Development Process Principles

### Continuous Integration/Continuous Deployment (CI/CD)

- **Automated testing**: Every commit tested
- **Frequent integration**: Merge conflicts avoided
- **Automated deployment**: Consistent releases
- **Fast feedback**: Quick issue identification

### Version Control Best Practices

- **Meaningful commit messages**: Clear change description
- **Small, focused commits**: Single responsibility
- **Feature branches**: Isolated development
- **Code reviews**: Quality assurance

### Agile Principles

- **Iterative development**: Short feedback cycles
- **Customer collaboration**: Regular communication
- **Responding to change**: Adaptability over planning
- **Working software**: Functional deliverables

## Code Review Principles

### What to Look For

- **Correctness**: Does it work as intended?
- **Readability**: Is it easy to understand?
- **Maintainability**: Can it be easily modified?
- **Performance**: Are there obvious bottlenecks?
- **Security**: Are there vulnerabilities?

### Review Process

```markdown
Code Review Checklist:
□ Code follows style guidelines
□ Tests are included and passing
□ Documentation is updated
□ No obvious security issues
□ Performance considerations addressed
□ Error handling is appropriate
□ Code is self-documenting
```

## Refactoring Principles

### When to Refactor

- **Before adding new features**
- **When fixing bugs**
- **During code reviews**
- **When code smells are detected**

### Refactoring Techniques

- **Extract Method**: Break down large functions
- **Rename**: Improve naming clarity
- **Move Method**: Better class organization
- **Extract Class**: Separate responsibilities
- **Inline**: Simplify unnecessary abstractions

### Code Smells

```typescript
// Code smell: Long parameter list
function createUser(
  name: string,
  email: string,
  age: number,
  address: string,
  phone: string,
  department: string,
  role: string,
  salary: number
) {
  /* ... */
}

// Refactored: Use objects
interface UserData {
  personalInfo: PersonalInfo;
  contactInfo: ContactInfo;
  employmentInfo: EmploymentInfo;
}

function createUser(userData: UserData) {
  /* ... */
}
```

## Documentation Principles

### Types of Documentation

- **Code Comments**: Why, not what
- **API Documentation**: Usage examples
- **Architecture Documentation**: System overview
- **User Documentation**: How-to guides

### Documentation Best Practices

- **Keep it up to date**: Sync with code changes
- **Write for your audience**: Different levels of detail
- **Use examples**: Concrete illustrations
- **Version control**: Track documentation changes

## Team Collaboration

### Communication Principles

- **Clear requirements**: Understand before coding
- **Regular updates**: Progress communication
- **Knowledge sharing**: Document decisions
- **Constructive feedback**: Growth-oriented reviews

### Best Practices

- **Pair Programming**: Knowledge transfer
- **Code Standards**: Consistent style
- **Regular Meetings**: Alignment and planning
- **Mentoring**: Skill development

## Interview Tips

### Common Questions

1. **Explain SOLID principles**: Single Responsibility, Open-Closed, etc.
2. **What is technical debt?**: Shortcuts and their consequences
3. **How do you ensure code quality?**: Testing, reviews, standards
4. **Describe a design pattern**: Implementation and use cases
5. **What is refactoring?**: Code improvement without behavior change

### System Design Principles

- **Scalability**: Handle increasing load
- **Reliability**: System uptime and fault tolerance
- **Maintainability**: Easy to modify and extend
- **Performance**: Response time and throughput
- **Security**: Data protection and access control

### Best Practices Discussion

- Code review processes
- Testing strategies
- Documentation approaches
- Team collaboration methods
- Continuous improvement practices

Software Engineering Principles provide the foundation for building high-quality, maintainable software systems that can evolve with changing requirements and scale with business growth.
