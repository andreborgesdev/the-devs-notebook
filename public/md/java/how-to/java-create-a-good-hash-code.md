# Create a good HashCode

**When implementing hashCode :**

1. Use the same fields that are used in equals (or a subset thereof).
2. Better not include mutable fields.
3. Consider not calling hashCode on collections.
4. Use a common algorithm unless patterns in input data counteract them.

[https://www.sitepoint.com/how-to-implement-javas-hashcode-correctly/](https://www.sitepoint.com/how-to-implement-javas-hashcode-correctly/)

[https://www.baeldung.com/java-hashcode](https://www.baeldung.com/java-hashcode)
