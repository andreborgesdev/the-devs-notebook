# Writing a Good `hashCode` in Java

The `hashCode()` method is fundamental when working with hash-based collections like `HashMap`, `HashSet`, and `Hashtable`. A good `hashCode` implementation directly affects the performance and correctness of your code.

A **contract** exists between `hashCode()` and `equals()`:

- If two objects are equal according to the `equals()` method, they **must** have the same hash code.
- However, two objects with the same hash code **do not have to** be equal.

## Key Guidelines for Implementing `hashCode()`

### 1. Use the Same Fields as `equals()`

The fields that determine equality should be the ones used to compute the hash code. If `equals()` depends on fields `a`, `b`, and `c`, then `hashCode()` should also use these fields.

### 2. Avoid Using Mutable Fields

Mutable fields can break the contract. If the field changes after inserting into a hash-based collection, the object might "disappear" or become unreachable.

> Best Practice: Only use immutable fields like `final` variables in `hashCode()`.

### 3. Be Careful with Collections

If your object contains collections (`List`, `Set`, etc.):

- **Do not directly call `hashCode()`** on them without careful thought.
- Prefer using defensive copies or immutable collections to ensure consistency.

### 4. Use a Standard HashCode Algorithm

A commonly recommended approach is:

- Start with a non-zero constant (often 17).
- For each significant field, compute the hash contribution:
  - Multiply the current result by a prime number (commonly 31).
  - Add the field’s hash code to it.

Example:

```java
@Override
public int hashCode() {
int result = 17;
result = 31 _ result + (firstName != null ? firstName.hashCode() : 0);
result = 31 _ result + (lastName != null ? lastName.hashCode() : 0);
result = 31 \* result + age;
return result;
}
```

## Example: Proper `equals()` and `hashCode()`

```java
public class Person {
private final String firstName;
private final String lastName;
private final int age;

    public Person(String firstName, String lastName, int age) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Person)) return false;
        Person person = (Person) o;
        return age == person.age &&
               Objects.equals(firstName, person.firstName) &&
               Objects.equals(lastName, person.lastName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(firstName, lastName, age);
    }

}
```

Notice here we use `Objects.hash(...)` which internally uses a good hash algorithm (although sometimes it can introduce slight overhead compared to manually optimizing the function).

## Extra Tips

- Always override both `equals()` and `hashCode()` together.
- Try to ensure the distribution of hash codes is uniform to avoid clustering.
- Prefer prime numbers (e.g., 31) for multiplication. Prime numbers help distribute the hash codes better.
- When using floating-point fields:
  - For `float`, use `Float.floatToIntBits(value)`.
  - For `double`, use `Double.doubleToLongBits(value)` then combine bits into an `int`.

## Why It Matters

Bad `hashCode()` implementations can lead to:

- Performance degradation (lots of hash collisions -> degrading into linked lists inside hash tables).
- Logical bugs (unable to retrieve objects from a `HashSet`, etc.).

Good `hashCode()` = fast lookups, efficient memory usage, and correctness.

## Resources for Further Reading

- [How to Implement Java's hashCode() Correctly – SitePoint](https://www.sitepoint.com/how-to-implement-javas-hashcode-correctly/)
- [Guide to hashCode() in Java – Baeldung](https://www.baeldung.com/java-hashcode)
