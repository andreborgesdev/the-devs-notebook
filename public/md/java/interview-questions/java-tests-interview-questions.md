# Testing

### What is the "Test Pyramid"? Why is it shaped like a pyramid?

The **Test Pyramid** is a concept that illustrates the ideal distribution of automated tests across different layers of an application. The pyramid shape reflects the recommended proportion of each type of test.

**Typical layers:**

- **Unit Tests (Base):**

  - Test individual components in isolation.
  - Fast, reliable, and numerous.
  - Example: Testing a single method or class behavior.

- **Integration Tests (Middle):**

  - Test the interaction between multiple components or systems (e.g., database, APIs).
  - Slower than unit tests and fewer in number.

- **End-to-End (E2E) / UI Tests (Top):**

  - Test the whole application from the user’s perspective.
  - Slowest, most brittle, and should be few.

### What is the difference between Unit Tests, Integration Tests, and End-to-End (E2E) Tests?

- **Unit Tests:**
  Test individual units of code (methods, classes). Fast and isolated.

- **Integration Tests:**
  Test how different modules or services work together (e.g., service and database).

- **End-to-End (E2E) Tests:**
  Simulate real user scenarios to validate the whole system flow, usually through the UI.

### What are the characteristics of a good Unit Test?

- Fast execution
- Deterministic (always produces the same result)
- Tests one thing only
- Independent (can run alone without dependencies)
- Easy to read and maintain

### What is mocking? Why do we use mocks in testing?

**Mocking** refers to creating fake versions of dependencies or objects that simulate the behavior of real ones.
**Purpose:** To isolate the unit under test and control its environment (e.g., prevent database calls during unit testing).

### What is Test-Driven Development (TDD)?

A development process where you:

1. Write a failing test for a new feature.
2. Write the minimum code needed to pass the test.
3. Refactor the code while keeping the test green (passing).

This cycle is often called **Red-Green-Refactor**.

### What is Behavior-Driven Development (BDD)? How does it differ from TDD?

**BDD** focuses on writing tests in a natural language style that describes behavior (often using tools like Cucumber).
**Difference:**

- TDD emphasizes testing at the code level.
- BDD emphasizes collaboration between developers, QA, and business stakeholders to define behavior.

### What are Test Doubles?

Test doubles are generic terms for objects that substitute real components in tests. Types include:

- **Dummy:** Placeholder objects passed around but never used.
- **Fake:** Real implementation but simplified (e.g., in-memory DB).
- **Stub:** Returns predefined responses.
- **Mock:** Verifies interactions.
- **Spy:** Records how it was used.

### What is Code Coverage? Is 100% coverage necessary?

**Code coverage** measures how much of your code is exercised by tests.
100% coverage is not always necessary; while high coverage is desirable, it does not guarantee good test quality.
Focus should be on **testing critical paths and edge cases**, not just achieving numbers.

### What is Continuous Integration (CI) in testing?

CI is a practice where developers integrate code into a shared repository frequently, and each integration is verified by automated tests.
**Benefits:**

- Early detection of integration issues
- Faster feedback loops

### What is Regression Testing?

**Regression testing** ensures that changes or additions to the codebase have not introduced new bugs in existing functionality.

### What are flaky tests? How do you handle them?

**Flaky tests** pass or fail intermittently without changes to the code.
**Causes:** Timing issues, environmental dependencies, or external services.
**Solutions:** Identify and fix instability, isolate dependencies, or rework test logic.

### What are Parameterized Tests?

Tests that run the same test logic against multiple sets of input values.
**Benefit:** Reduces code duplication and improves test coverage.

### What is the Arrange-Act-Assert (AAA) pattern in testing?

A pattern for structuring test code:

1. **Arrange:** Set up the test data and environment.
2. **Act:** Invoke the method under test.
3. **Assert:** Verify the outcome.

### What is the difference between black-box and white-box testing?

- **Black-box testing:** Focuses on input/output behavior without knowledge of internal code.
- **White-box testing:** Tests with knowledge of the internal structure and implementation.

### When should you use Integration Tests over Unit Tests?

Use integration tests when you need to validate the interaction between multiple components or when mocking the dependencies would be impractical or misleading.

### What are the pros and cons of using UI-based E2E tests?

**Pros:**

- Validate real user flows
- Catch integration issues not detected by lower-level tests

**Cons:**

- Slow execution
- Brittle (sensitive to UI changes)
- Higher maintenance cost

### What is the difference between Assertions and Expectations?

Both are ways to validate test outcomes:

- **Assertions:** Direct checks in most test frameworks (e.g., `assertEquals`).
- **Expectations:** Often used in mocking frameworks to verify interactions or side effects (e.g., `expect(mock).toHaveBeenCalled()`).
