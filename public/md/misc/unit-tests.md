# Unit Tests

## Overview

**Unit testing** is a software testing technique where individual components or functions of an application are tested in isolation to ensure they work as expected. These tests are typically automated and written by developers during the development process.

## Purpose and Benefits

### Primary Goal

- **Confidence in Code Changes**: Unit tests enable developers to **refactor** and extend code with confidence, reducing the fear of introducing new bugs.

### Key Benefits

- **Improved Code Quality**: Catches bugs early in the development cycle.
- **Easier Maintenance**: Facilitates safe code changes and refactoring.
- **Reduced Costs**: Early bug detection lowers the long-term cost of fixing defects.
- **Documentation**: Tests serve as living documentation for how individual units should behave.
- **Faster Development**: Automated tests replace manual testing efforts, speeding up the development cycle.
- **Supports Agile Practices**: Encourages iterative development and continuous integration.

## Characteristics of Good Unit Tests

- **Isolated**: Tests a single unit of work without relying on external systems like databases, file systems, or network resources.
- **Deterministic**: Produces the same result every time it is run.
- **Fast**: Runs quickly to support rapid development cycles.
- **Readable**: Clearly communicates the purpose and expected outcome.
- **Repeatable**: Can be run multiple times without side effects.

## What to Test

- **Methods and Functions**: Core business logic, edge cases, and error handling.
- **Validation Logic**: Data validation rules.
- **Boundary Conditions**: Inputs at the edge of acceptable ranges.

_Note_: Unit tests should avoid testing integration points (databases, APIs, etc.). Those are the domain of **integration tests**.

## Common Unit Testing Frameworks

| Language   | Frameworks           |
| ---------- | -------------------- |
| Java       | JUnit, TestNG        |
| JavaScript | Jest, Mocha, Jasmine |
| Python     | unittest, pytest     |
| C# (.NET)  | MSTest, xUnit, NUnit |
| Ruby       | RSpec, Minitest      |

## Best Practices

- Write tests alongside or before writing production code (**Test-Driven Development** is one approach).
- Test both positive and negative cases.
- Keep test code clean and maintainable.
- Mock dependencies to isolate units when necessary.
- Regularly run the tests in Continuous Integration (CI) pipelines.

## Limitations

- Unit tests alone cannot guarantee the absence of bugs. They must be complemented by **integration tests**, **system tests**, and **user acceptance tests**.
- Poorly written tests can become a maintenance burden.

## Example (Java - JUnit)

```java
import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

public class CalculatorTest {
    @Test
    public void testAddition() {
        Calculator calc = new Calculator();
        int result = calc.add(2, 3);
        assertEquals(5, result, "2 + 3 should equal 5");
    }
}
```

## Summary

Unit testing is a fundamental practice for producing reliable, maintainable software. By validating individual components in isolation, it reduces long-term costs, improves code quality, and supports agile and DevOps workflows.
