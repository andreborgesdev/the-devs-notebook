# React E2E Testing

End-to-end testing ensures your React application works correctly from the user's perspective by testing complete user workflows.

## Cypress Testing

### Basic Setup

```json
{
  "devDependencies": {
    "cypress": "^13.0.0",
    "@testing-library/cypress": "^10.0.0"
  },
  "scripts": {
    "cy:open": "cypress open",
    "cy:run": "cypress run",
    "cy:run:headless": "cypress run --headless"
  }
}
```

```typescript
import "./commands";
import "@testing-library/cypress/add-commands";

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      seedDatabase(): Chainable<void>;
      resetDatabase(): Chainable<void>;
    }
  }
}
```

### Custom Commands

```typescript
Cypress.Commands.add("login", (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit("/login");
    cy.get('[data-testid="email"]').type(email);
    cy.get('[data-testid="password"]').type(password);
    cy.get('[data-testid="login-button"]').click();
    cy.url().should("include", "/dashboard");
  });
});

Cypress.Commands.add("seedDatabase", () => {
  cy.task("seedDb");
});

Cypress.Commands.add("resetDatabase", () => {
  cy.task("resetDb");
});
```

### User Authentication Flow

```typescript
describe("User Authentication", () => {
  beforeEach(() => {
    cy.resetDatabase();
    cy.seedDatabase();
  });

  it("should allow user to login", () => {
    cy.visit("/login");

    cy.get('[data-testid="email"]').type("user@example.com");
    cy.get('[data-testid="password"]').type("password123");
    cy.get('[data-testid="login-button"]').click();

    cy.url().should("include", "/dashboard");
    cy.get('[data-testid="user-name"]').should("contain", "John Doe");
    cy.get('[data-testid="logout-button"]').should("be.visible");
  });

  it("should handle login errors", () => {
    cy.visit("/login");

    cy.get('[data-testid="email"]').type("invalid@example.com");
    cy.get('[data-testid="password"]').type("wrongpassword");
    cy.get('[data-testid="login-button"]').click();

    cy.get('[data-testid="error-message"]')
      .should("be.visible")
      .and("contain", "Invalid credentials");
    cy.url().should("include", "/login");
  });

  it("should logout user", () => {
    cy.login("user@example.com", "password123");
    cy.visit("/dashboard");

    cy.get('[data-testid="logout-button"]').click();

    cy.url().should("include", "/login");
    cy.get('[data-testid="login-form"]').should("be.visible");
  });
});
```

### Form Testing

```typescript
describe("Contact Form", () => {
  beforeEach(() => {
    cy.visit("/contact");
  });

  it("should submit form successfully", () => {
    cy.get('[data-testid="name"]').type("John Doe");
    cy.get('[data-testid="email"]').type("john@example.com");
    cy.get('[data-testid="subject"]').select("General Inquiry");
    cy.get('[data-testid="message"]').type("This is a test message");

    cy.intercept("POST", "/api/contact", {
      statusCode: 200,
      body: { success: true, id: "123" },
    }).as("submitForm");

    cy.get('[data-testid="submit-button"]').click();

    cy.wait("@submitForm");
    cy.get('[data-testid="success-message"]')
      .should("be.visible")
      .and("contain", "Message sent successfully");
  });

  it("should validate required fields", () => {
    cy.get('[data-testid="submit-button"]').click();

    cy.get('[data-testid="name-error"]')
      .should("be.visible")
      .and("contain", "Name is required");
    cy.get('[data-testid="email-error"]')
      .should("be.visible")
      .and("contain", "Email is required");
  });

  it("should validate email format", () => {
    cy.get('[data-testid="name"]').type("John Doe");
    cy.get('[data-testid="email"]').type("invalid-email");
    cy.get('[data-testid="submit-button"]').click();

    cy.get('[data-testid="email-error"]')
      .should("be.visible")
      .and("contain", "Please enter a valid email");
  });
});
```

### API Integration Testing

```typescript
describe("User Management", () => {
  beforeEach(() => {
    cy.login("admin@example.com", "admin123");
  });

  it("should create new user", () => {
    cy.visit("/admin/users");

    cy.get('[data-testid="add-user-button"]').click();

    cy.get('[data-testid="user-name"]').type("Jane Smith");
    cy.get('[data-testid="user-email"]').type("jane@example.com");
    cy.get('[data-testid="user-role"]').select("Editor");

    cy.intercept("POST", "/api/users", {
      statusCode: 201,
      body: {
        id: "456",
        name: "Jane Smith",
        email: "jane@example.com",
        role: "Editor",
      },
    }).as("createUser");

    cy.get('[data-testid="save-user-button"]').click();

    cy.wait("@createUser");
    cy.get('[data-testid="user-list"]').should("contain", "Jane Smith");
  });

  it("should edit existing user", () => {
    cy.visit("/admin/users");

    cy.get('[data-testid="user-row-123"]')
      .find('[data-testid="edit-button"]')
      .click();

    cy.get('[data-testid="user-name"]').clear().type("John Updated");

    cy.intercept("PUT", "/api/users/123", {
      statusCode: 200,
      body: {
        id: "123",
        name: "John Updated",
        email: "john@example.com",
        role: "Admin",
      },
    }).as("updateUser");

    cy.get('[data-testid="save-user-button"]').click();

    cy.wait("@updateUser");
    cy.get('[data-testid="user-list"]').should("contain", "John Updated");
  });

  it("should delete user", () => {
    cy.visit("/admin/users");

    cy.get('[data-testid="user-row-123"]')
      .find('[data-testid="delete-button"]')
      .click();

    cy.get('[data-testid="confirm-delete-button"]').click();

    cy.intercept("DELETE", "/api/users/123", {
      statusCode: 204,
    }).as("deleteUser");

    cy.wait("@deleteUser");
    cy.get('[data-testid="user-row-123"]').should("not.exist");
  });
});
```

### Navigation and Routing

```typescript
describe("Navigation", () => {
  beforeEach(() => {
    cy.login("user@example.com", "password123");
  });

  it("should navigate through main sections", () => {
    cy.visit("/dashboard");

    cy.get('[data-testid="nav-projects"]').click();
    cy.url().should("include", "/projects");
    cy.get('[data-testid="projects-title"]').should("be.visible");

    cy.get('[data-testid="nav-settings"]').click();
    cy.url().should("include", "/settings");
    cy.get('[data-testid="settings-title"]').should("be.visible");

    cy.get('[data-testid="nav-dashboard"]').click();
    cy.url().should("include", "/dashboard");
    cy.get('[data-testid="dashboard-title"]').should("be.visible");
  });

  it("should handle protected routes", () => {
    cy.window().then((win) => {
      win.localStorage.removeItem("authToken");
    });

    cy.visit("/admin");
    cy.url().should("include", "/login");
    cy.get('[data-testid="login-form"]').should("be.visible");
  });

  it("should maintain state during navigation", () => {
    cy.visit("/projects");

    cy.get('[data-testid="search-input"]').type("React Project");
    cy.get('[data-testid="filter-status"]').select("Active");

    cy.get('[data-testid="nav-dashboard"]').click();
    cy.get('[data-testid="nav-projects"]').click();

    cy.get('[data-testid="search-input"]').should(
      "have.value",
      "React Project"
    );
    cy.get('[data-testid="filter-status"]').should("have.value", "Active");
  });
});
```

## Playwright Testing

### Basic Setup

```json
{
  "devDependencies": {
    "@playwright/test": "^1.40.0"
  },
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

```typescript
import { test, expect, Page } from "@playwright/test";

class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("/login");
  }

  async login(email: string, password: string) {
    await this.page.fill('[data-testid="email"]', email);
    await this.page.fill('[data-testid="password"]', password);
    await this.page.click('[data-testid="login-button"]');
  }

  async getErrorMessage() {
    return this.page.textContent('[data-testid="error-message"]');
  }
}

class Dashboard {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("/dashboard");
  }

  async getUserName() {
    return this.page.textContent('[data-testid="user-name"]');
  }

  async logout() {
    await this.page.click('[data-testid="logout-button"]');
  }
}
```

### Page Object Model

```typescript
test.describe("User Authentication", () => {
  let loginPage: LoginPage;
  let dashboard: Dashboard;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboard = new Dashboard(page);
  });

  test("should login successfully", async ({ page }) => {
    await loginPage.goto();
    await loginPage.login("user@example.com", "password123");

    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('[data-testid="user-name"]')).toContainText(
      "John Doe"
    );
  });

  test("should handle login errors", async ({ page }) => {
    await loginPage.goto();
    await loginPage.login("invalid@example.com", "wrongpassword");

    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain("Invalid credentials");
    await expect(page).toHaveURL(/.*login/);
  });
});
```

### Visual Testing

```typescript
test.describe("Visual Regression", () => {
  test("homepage should match screenshot", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveScreenshot("homepage.png");
  });

  test("login form should match screenshot", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator('[data-testid="login-form"]')).toHaveScreenshot(
      "login-form.png"
    );
  });

  test("dashboard with data should match screenshot", async ({ page }) => {
    await page.goto("/login");
    await page.fill('[data-testid="email"]', "user@example.com");
    await page.fill('[data-testid="password"]', "password123");
    await page.click('[data-testid="login-button"]');

    await page.waitForSelector('[data-testid="dashboard-content"]');
    await expect(page).toHaveScreenshot("dashboard-full.png");
  });
});
```

### Mobile Testing

```typescript
test.describe("Mobile Experience", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("should display mobile navigation", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.locator('[data-testid="mobile-menu-button"]')
    ).toBeVisible();
    await expect(page.locator('[data-testid="desktop-nav"]')).not.toBeVisible();
  });

  test("should open mobile menu", async ({ page }) => {
    await page.goto("/");

    await page.click('[data-testid="mobile-menu-button"]');
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
  });
});
```

### Performance Testing

```typescript
test.describe("Performance", () => {
  test("homepage should load quickly", async ({ page }) => {
    const startTime = Date.now();
    await page.goto("/");
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(3000);
  });

  test("should not have console errors", async ({ page }) => {
    const errors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.goto("/");
    expect(errors).toHaveLength(0);
  });

  test("should pass accessibility checks", async ({ page }) => {
    await page.goto("/");

    const accessibilityScanResults = await page.evaluate(() => {
      return new Promise((resolve) => {
        // @ts-ignore
        window.axe.run().then(resolve);
      });
    });

    // @ts-ignore
    expect(accessibilityScanResults.violations).toHaveLength(0);
  });
});
```

## Cross-Browser Testing

### Browser Configuration

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
    },
  ],
});
```

### Browser-Specific Tests

```typescript
test.describe("Browser Compatibility", () => {
  test("should work in Chrome", async ({ page, browserName }) => {
    test.skip(browserName !== "chromium");

    await page.goto("/");
    await expect(page.locator('[data-testid="chrome-feature"]')).toBeVisible();
  });

  test("should work in Firefox", async ({ page, browserName }) => {
    test.skip(browserName !== "firefox");

    await page.goto("/");
    await expect(page.locator('[data-testid="firefox-feature"]')).toBeVisible();
  });
});
```

## CI/CD Integration

### GitHub Actions

```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Start application
        run: npm start &

      - name: Wait for app
        run: npx wait-on http://localhost:3000

      - name: Run E2E tests
        run: npx playwright test

      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

### Docker E2E Testing

```dockerfile
FROM mcr.microsoft.com/playwright:v1.40.0-focal

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

CMD ["npm", "run", "test:e2e"]
```

## Best Practices

### Test Data Management

```typescript
const testData = {
  users: {
    admin: {
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
    },
    user: {
      email: "user@example.com",
      password: "user123",
      role: "user",
    },
  },
  projects: {
    active: {
      name: "Active Project",
      status: "active",
      description: "Test project description",
    },
  },
};

test("should create project as admin", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(
    testData.users.admin.email,
    testData.users.admin.password
  );

  // Continue with test...
});
```

### Test Isolation

```typescript
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  await page.route("/api/**", (route) => {
    if (route.request().method() === "POST") {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true }),
      });
    } else {
      route.continue();
    }
  });
});
```

### Waiting Strategies

```typescript
test("should wait for dynamic content", async ({ page }) => {
  await page.goto("/dashboard");

  await page.waitForSelector('[data-testid="user-data"]');

  await page.waitForFunction(
    () => document.querySelectorAll('[data-testid="project-item"]').length > 0
  );

  await expect(
    page.locator('[data-testid="loading-spinner"]')
  ).not.toBeVisible();

  await expect(page.locator('[data-testid="project-list"]')).toContainText(
    "My Projects"
  );
});
```

## Interview Questions

**Q: What's the difference between E2E testing and integration testing?**
A: E2E tests complete user workflows across the entire application stack, while integration tests focus on specific component interactions. E2E tests are slower but catch more real-world issues.

**Q: How do you handle flaky E2E tests?**
A: Use proper waiting strategies, test data isolation, retry mechanisms, and stable selectors. Avoid hard-coded timeouts and ensure test environment consistency.

**Q: What are the benefits of Page Object Model?**
A: Reduces code duplication, improves maintainability, provides better abstraction, makes tests more readable, and centralizes element selectors.

**Q: How do you test responsive design in E2E tests?**
A: Set different viewport sizes, test mobile-specific elements, verify responsive behavior, and use device emulation for mobile testing.

**Q: How do you handle authentication in E2E tests?**
A: Use session persistence, API-based login, test user accounts, and avoid repeated login flows through session management.
