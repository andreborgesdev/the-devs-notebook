# Domain-Driven Design (DDD)

**Domain-Driven Design (DDD)** is an approach to software development that emphasizes modeling software to match a complex domain's business concepts and logic. It promotes a deep collaboration between technical experts and domain experts to create models that reflect real-world processes.

## Key Characteristics

- **Focus on Domain Logic**: Core business logic is the primary concern.
- **Iterative Refinement**: The model evolves through continuous collaboration with domain experts.
- **Ubiquitous Language**: A common, precise language used by developers and domain experts.
- **Bounded Contexts**: Large models are divided into smaller, manageable pieces with clear boundaries.

## Core Concepts

### Domain Model

A **domain model** is an abstract representation of the domain's entities, their behaviors, and relationships. It provides a blueprint for solving domain-specific problems in software.

### Building Blocks

1. **Entity**

   - Object defined by its identity rather than attributes.
   - Example: `Customer`, `Order`.

2. **Value Object**

   - Immutable object identified only by its attributes.
   - Example: `Address`, `Money`.

3. **Aggregate**

   - A cluster of related entities and value objects treated as a single unit.
   - Example: `Order` (root) with `OrderItems` as children.

4. **Aggregate Root**

   - The main entity through which the aggregate is accessed and modified.

5. **Repository**

   - Provides methods to access and persist aggregates.
   - Example: `OrderRepository`.

6. **Factory**

   - Handles complex creation logic for aggregates.

7. **Service**

   - Encapsulates domain logic that doesn’t naturally fit into an entity or value object.

## Ubiquitous Language

A **ubiquitous language** is developed collaboratively by the development team and domain experts. It ensures all team members use the same terms consistently in code, documentation, and discussions.

## Bounded Context

A **bounded context** defines a boundary within which a particular domain model applies. Different contexts may use different models and need clear integration strategies (e.g., REST APIs, messaging).

## Strategic Design Patterns

- **Context Mapping**: Visualizing and documenting how bounded contexts relate to each other.
- **Anti-Corruption Layer (ACL)**: Prevents one context from being polluted by another’s model.
- **Shared Kernel**: Shared subset of the domain model between contexts.
- **Customer/Supplier**: Defines how contexts interact when one depends on another.

## Applying DDD with Test-Driven Development (TDD)

- **DDD** defines _what to build_: clear models and business rules.
- **TDD** defines _how to build_: tests guide implementation, ensuring the design is testable and robust.
- DDD provides the structure; TDD ensures correctness and drives out design details.

## DDD in Agile Development

- **Ubiquitous Language** ensures smooth communication.
- **Domain Modeling** aids in understanding and refining requirements.
- **Bounded Contexts** align with Agile team boundaries and allow parallel development.

## Example (Simplified)

```java
public class Order {
    private final OrderId id;
    private final List<OrderItem> items;

    public Order(OrderId id) {
        this.id = id;
        this.items = new ArrayList<>();
    }

    public void addItem(Product product, int quantity) {
        this.items.add(new OrderItem(product, quantity));
    }

    // Business rules and behaviors
}
```

Here, `Order` is an **Entity** and **Aggregate Root**, `OrderItem` could be a **Value Object**, and persistence would be handled by a **Repository**.

## Advantages

- Aligns software design closely with business goals.
- Encourages rich models and reduces accidental complexity.
- Promotes maintainability, testability, and scalability.

## Challenges

- Steep learning curve.
- Requires strong collaboration with domain experts.
- Potential over-engineering for simple domains.

## When to Use DDD

✅ Complex business domains
✅ Long-term projects with evolving requirements
✅ Teams with close collaboration between developers and domain experts

## When Not to Use

❌ Simple CRUD applications
❌ Projects with minimal domain logic
❌ Very short-term projects
