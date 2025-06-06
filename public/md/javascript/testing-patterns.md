# JavaScript Testing Patterns and Methodologies

## Testing Fundamentals

### Testing Types Overview

```javascript
// Unit Tests - Testing individual functions/components
function add(a, b) {
  return a + b;
}

// Test
test("add function should return sum of two numbers", () => {
  expect(add(2, 3)).toBe(5);
  expect(add(-1, 1)).toBe(0);
  expect(add(0, 0)).toBe(0);
});

// Integration Tests - Testing component interactions
class UserService {
  constructor(database) {
    this.database = database;
  }

  async createUser(userData) {
    const user = await this.database.save(userData);
    await this.sendWelcomeEmail(user.email);
    return user;
  }
}

// End-to-End Tests - Testing complete user workflows
// Using tools like Cypress, Playwright, or Selenium
```

### Test Structure (AAA Pattern)

```javascript
describe("UserValidator", () => {
  test("should validate user email format", () => {
    // Arrange
    const validator = new UserValidator();
    const validEmail = "user@example.com";
    const invalidEmail = "invalid-email";

    // Act
    const validResult = validator.validateEmail(validEmail);
    const invalidResult = validator.validateEmail(invalidEmail);

    // Assert
    expect(validResult.isValid).toBe(true);
    expect(invalidResult.isValid).toBe(false);
    expect(invalidResult.errors).toContain("Invalid email format");
  });
});
```

## Jest Testing Framework

### Basic Jest Setup

```javascript
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "jest": {
    "testEnvironment": "node",
    "collectCoverageFrom": [
      "src/**/*.js",
      "!src/index.js"
    ]
  }
}

// Basic test file
describe('Calculator', () => {
  let calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  afterEach(() => {
    calculator = null;
  });

  beforeAll(() => {
    console.log('Starting calculator tests');
  });

  afterAll(() => {
    console.log('Finished calculator tests');
  });

  test('should add two numbers correctly', () => {
    expect(calculator.add(2, 3)).toBe(5);
  });

  test('should throw error for invalid input', () => {
    expect(() => calculator.add('a', 'b')).toThrow('Invalid input');
  });
});
```

### Jest Matchers

```javascript
describe("Jest Matchers Examples", () => {
  test("common matchers", () => {
    // Equality
    expect(2 + 2).toBe(4);
    expect({ name: "John" }).toEqual({ name: "John" });
    expect({ name: "John" }).toStrictEqual({ name: "John" });

    // Truthiness
    expect(true).toBeTruthy();
    expect(false).toBeFalsy();
    expect(null).toBeNull();
    expect(undefined).toBeUndefined();
    expect("Hello").toBeDefined();

    // Numbers
    expect(2 + 2).toBeGreaterThan(3);
    expect(3.14).toBeCloseTo(3.1, 1);

    // Strings
    expect("Hello World").toMatch(/World/);
    expect("Hello World").toContain("World");

    // Arrays
    expect(["apple", "banana", "orange"]).toContain("banana");
    expect([1, 2, 3]).toHaveLength(3);

    // Exceptions
    expect(() => {
      throw new Error("Something went wrong");
    }).toThrow("Something went wrong");

    // Objects
    expect({ name: "John", age: 30 }).toHaveProperty("name");
    expect({ name: "John", age: 30 }).toHaveProperty("age", 30);
  });
});
```

### Async Testing

```javascript
describe("Async Testing", () => {
  // Promise-based testing
  test("async function returns correct data", async () => {
    const data = await fetchUserData(1);
    expect(data).toEqual({
      id: 1,
      name: "John Doe",
      email: "john@example.com",
    });
  });

  // Testing promise rejections
  test("should handle fetch errors", async () => {
    await expect(fetchUserData(-1)).rejects.toThrow("User not found");
  });

  // Testing with resolves/rejects
  test("promise resolves with user data", () => {
    return expect(fetchUserData(1)).resolves.toHaveProperty("id", 1);
  });

  test("promise rejects with error", () => {
    return expect(fetchUserData(-1)).rejects.toThrow();
  });
});
```

## Mocking and Spies

### Function Mocking

```javascript
describe("Mocking Examples", () => {
  test("mock implementation", () => {
    const mockFn = jest.fn();
    mockFn.mockReturnValue(42);

    expect(mockFn()).toBe(42);
    expect(mockFn).toHaveBeenCalled();
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test("mock with different return values", () => {
    const mockFn = jest.fn();
    mockFn.mockReturnValueOnce(1).mockReturnValueOnce(2).mockReturnValue(3);

    expect(mockFn()).toBe(1);
    expect(mockFn()).toBe(2);
    expect(mockFn()).toBe(3);
    expect(mockFn()).toBe(3);
  });

  test("mock async functions", async () => {
    const mockAsyncFn = jest.fn();
    mockAsyncFn.mockResolvedValue({ data: "test" });

    const result = await mockAsyncFn();
    expect(result).toEqual({ data: "test" });
  });
});
```

### Module Mocking

```javascript
// __mocks__/axios.js
export default {
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
};

// test file
import axios from "axios";
import { fetchUserData } from "../userService";

jest.mock("axios");
const mockedAxios = axios;

describe("UserService", () => {
  test("should fetch user data", async () => {
    const userData = { id: 1, name: "John" };
    mockedAxios.get.mockResolvedValue({ data: userData });

    const result = await fetchUserData(1);

    expect(mockedAxios.get).toHaveBeenCalledWith("/api/users/1");
    expect(result).toEqual(userData);
  });
});
```

### Spying on Methods

```javascript
describe("Spying Examples", () => {
  test("spy on object method", () => {
    const user = {
      name: "John",
      greet() {
        return `Hello, ${this.name}!`;
      },
    };

    const greetSpy = jest.spyOn(user, "greet");

    const greeting = user.greet();

    expect(greetSpy).toHaveBeenCalled();
    expect(greeting).toBe("Hello, John!");

    greetSpy.mockRestore();
  });

  test("spy on console methods", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    console.log("test message");

    expect(consoleSpy).toHaveBeenCalledWith("test message");

    consoleSpy.mockRestore();
  });
});
```

## Test-Driven Development (TDD)

### TDD Cycle Example

```javascript
// 1. RED - Write a failing test
describe("StringUtils", () => {
  test("should capitalize first letter of each word", () => {
    expect(StringUtils.capitalize("hello world")).toBe("Hello World");
  });
});

// 2. GREEN - Write minimal code to pass
class StringUtils {
  static capitalize(str) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
}

// 3. REFACTOR - Improve the code
class StringUtils {
  static capitalize(str) {
    if (!str || typeof str !== "string") {
      return str;
    }

    return str
      .split(" ")
      .map((word) => this.capitalizeWord(word))
      .join(" ");
  }

  static capitalizeWord(word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }
}

// Add more tests
describe("StringUtils", () => {
  test("should handle empty strings", () => {
    expect(StringUtils.capitalize("")).toBe("");
  });

  test("should handle null/undefined", () => {
    expect(StringUtils.capitalize(null)).toBe(null);
    expect(StringUtils.capitalize(undefined)).toBe(undefined);
  });

  test("should handle single words", () => {
    expect(StringUtils.capitalize("hello")).toBe("Hello");
  });
});
```

## Behavior-Driven Development (BDD)

### BDD with Jest

```javascript
describe("User Registration Feature", () => {
  describe("Given a new user wants to register", () => {
    let userService;
    let emailService;

    beforeEach(() => {
      emailService = { sendWelcomeEmail: jest.fn() };
      userService = new UserService(emailService);
    });

    describe("When they provide valid information", () => {
      test("Then they should be successfully registered", async () => {
        const userData = {
          email: "user@example.com",
          password: "securePassword123",
          name: "John Doe",
        };

        const result = await userService.register(userData);

        expect(result.success).toBe(true);
        expect(result.user.email).toBe(userData.email);
        expect(emailService.sendWelcomeEmail).toHaveBeenCalledWith(
          userData.email
        );
      });
    });

    describe("When they provide invalid email", () => {
      test("Then registration should fail with validation error", async () => {
        const userData = {
          email: "invalid-email",
          password: "securePassword123",
          name: "John Doe",
        };

        await expect(userService.register(userData)).rejects.toThrow(
          "Invalid email format"
        );
      });
    });
  });
});
```

## Testing Patterns

### Page Object Model (for UI testing)

```javascript
class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = '[data-testid="email-input"]';
    this.passwordInput = '[data-testid="password-input"]';
    this.loginButton = '[data-testid="login-button"]';
    this.errorMessage = '[data-testid="error-message"]';
  }

  async login(email, password) {
    await this.page.fill(this.emailInput, email);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.loginButton);
  }

  async getErrorMessage() {
    return await this.page.textContent(this.errorMessage);
  }

  async isLoginButtonEnabled() {
    return await this.page.isEnabled(this.loginButton);
  }
}

// Usage in tests
describe("Login Functionality", () => {
  let page;
  let loginPage;

  beforeEach(async () => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    await page.goto("/login");
  });

  test("should login with valid credentials", async () => {
    await loginPage.login("user@example.com", "password123");

    await expect(page).toHaveURL("/dashboard");
  });
});
```

### Factory Pattern for Test Data

```javascript
class UserFactory {
  static create(overrides = {}) {
    return {
      id: Math.random().toString(36).substr(2, 9),
      name: "John Doe",
      email: "john@example.com",
      age: 30,
      role: "user",
      createdAt: new Date().toISOString(),
      ...overrides,
    };
  }

  static createAdmin(overrides = {}) {
    return this.create({
      role: "admin",
      permissions: ["read", "write", "delete"],
      ...overrides,
    });
  }

  static createMany(count, overrides = {}) {
    return Array.from({ length: count }, (_, index) =>
      this.create({
        id: `user-${index}`,
        email: `user${index}@example.com`,
        ...overrides,
      })
    );
  }
}

// Usage
describe("User Management", () => {
  test("should handle multiple users", () => {
    const users = UserFactory.createMany(5);
    const admin = UserFactory.createAdmin({ name: "Admin User" });

    expect(users).toHaveLength(5);
    expect(admin.role).toBe("admin");
  });
});
```

### Builder Pattern for Complex Objects

```javascript
class UserBuilder {
  constructor() {
    this.user = {
      name: "Default User",
      email: "default@example.com",
      age: 25,
      preferences: {},
    };
  }

  withName(name) {
    this.user.name = name;
    return this;
  }

  withEmail(email) {
    this.user.email = email;
    return this;
  }

  withAge(age) {
    this.user.age = age;
    return this;
  }

  withPreferences(preferences) {
    this.user.preferences = { ...this.user.preferences, ...preferences };
    return this;
  }

  build() {
    return { ...this.user };
  }
}

// Usage
describe("User Preferences", () => {
  test("should handle complex user configurations", () => {
    const user = new UserBuilder()
      .withName("Advanced User")
      .withAge(35)
      .withPreferences({
        theme: "dark",
        notifications: true,
        language: "en",
      })
      .build();

    expect(user.preferences.theme).toBe("dark");
  });
});
```

## Performance Testing

### Benchmarking Functions

```javascript
describe("Performance Tests", () => {
  test("function should execute within time limit", () => {
    const start = performance.now();

    const result = expensiveFunction(1000);

    const end = performance.now();
    const executionTime = end - start;

    expect(executionTime).toBeLessThan(100); // 100ms limit
    expect(result).toBeDefined();
  });

  test("should handle large datasets efficiently", () => {
    const largeArray = Array.from({ length: 10000 }, (_, i) => i);

    const start = Date.now();
    const result = processLargeArray(largeArray);
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(50);
    expect(result).toHaveLength(10000);
  });
});
```

### Memory Testing

```javascript
describe("Memory Usage Tests", () => {
  test("should not create memory leaks", () => {
    const initialMemory = process.memoryUsage().heapUsed;

    for (let i = 0; i < 1000; i++) {
      createAndDestroyObject();
    }

    global.gc && global.gc(); // Force garbage collection

    const finalMemory = process.memoryUsage().heapUsed;
    const memoryIncrease = finalMemory - initialMemory;

    expect(memoryIncrease).toBeLessThan(1024 * 1024); // Less than 1MB
  });
});
```

## Testing Best Practices

### Test Organization

```javascript
// Good: Descriptive test names
describe("UserValidator", () => {
  describe("validateEmail", () => {
    test("should return true for valid email format", () => {
      // test implementation
    });

    test("should return false for email without @ symbol", () => {
      // test implementation
    });

    test("should return false for email without domain", () => {
      // test implementation
    });
  });

  describe("validatePassword", () => {
    test("should return true for password with minimum 8 characters", () => {
      // test implementation
    });

    test("should return false for password shorter than 8 characters", () => {
      // test implementation
    });
  });
});
```

### Test Data Management

```javascript
// Good: Use constants for test data
const VALID_USER_DATA = {
  name: "John Doe",
  email: "john@example.com",
  password: "securePassword123",
};

const INVALID_EMAIL_DATA = {
  ...VALID_USER_DATA,
  email: "invalid-email",
};

// Good: Setup and teardown
describe("Database Tests", () => {
  let database;

  beforeAll(async () => {
    database = await setupTestDatabase();
  });

  afterAll(async () => {
    await cleanupTestDatabase(database);
  });

  beforeEach(async () => {
    await database.clear();
    await database.seed(TEST_DATA);
  });

  test("should create user successfully", async () => {
    const user = await database.createUser(VALID_USER_DATA);
    expect(user.id).toBeDefined();
  });
});
```

## Common Testing Scenarios

### API Testing

```javascript
describe("User API", () => {
  test("GET /api/users should return all users", async () => {
    const response = await request(app).get("/api/users");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("users");
    expect(Array.isArray(response.body.users)).toBe(true);
  });

  test("POST /api/users should create new user", async () => {
    const userData = {
      name: "John Doe",
      email: "john@example.com",
    };

    const response = await request(app).post("/api/users").send(userData);

    expect(response.status).toBe(201);
    expect(response.body.user.name).toBe(userData.name);
    expect(response.body.user.id).toBeDefined();
  });
});
```

### Component Testing (React example)

```javascript
import { render, screen, fireEvent } from "@testing-library/react";
import UserProfile from "./UserProfile";

describe("UserProfile Component", () => {
  const mockUser = {
    name: "John Doe",
    email: "john@example.com",
    avatar: "/avatar.jpg",
  };

  test("should display user information", () => {
    render(<UserProfile user={mockUser} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /avatar/i })).toHaveAttribute(
      "src",
      "/avatar.jpg"
    );
  });

  test("should call onEdit when edit button is clicked", () => {
    const mockOnEdit = jest.fn();
    render(<UserProfile user={mockUser} onEdit={mockOnEdit} />);

    fireEvent.click(screen.getByRole("button", { name: /edit/i }));

    expect(mockOnEdit).toHaveBeenCalledWith(mockUser);
  });
});
```

## Common Interview Questions

**Q: What's the difference between unit, integration, and e2e tests?**
A:

- **Unit tests**: Test individual functions/components in isolation
- **Integration tests**: Test how multiple components work together
- **E2E tests**: Test complete user workflows from start to finish

**Q: When should you use mocks vs stubs vs spies?**
A:

- **Mocks**: Replace entire objects/functions with fake implementations
- **Stubs**: Replace specific methods with predetermined responses
- **Spies**: Monitor calls to real methods without changing behavior

**Q: What is Test-Driven Development (TDD)?**
A: A development approach where you write tests before implementation (Red-Green-Refactor cycle)

**Q: How do you test async code?**
A: Use async/await in tests, return promises, or use Jest's resolves/rejects matchers

**Q: What makes a good test?**
A: Good tests are: Fast, Independent, Repeatable, Self-validating, and Timely (FIRST principles)

This comprehensive testing guide covers all essential patterns and methodologies for JavaScript testing, crucial for technical interviews and production development.
