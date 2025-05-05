# Bit Manipulation and Bitwise Operators

**Bit manipulation** involves operations that directly modify bits of numbers.  
It’s a powerful technique often used for optimizing performance, solving math problems, and handling subsets/combinations efficiently.

## Common Bitwise Operators

| Operator             | Symbol   | Description                                             |
| -------------------- | -------- | ------------------------------------------------------- |
| AND                  | `&`      | 1 if both bits are 1                                    |
| OR                   | `&#124;` | 1 if either bit is 1                                    |
| XOR                  | `^`      | 1 if bits are different                                 |
| NOT                  | `~`      | Inverts all bits                                        |
| Left Shift           | `<<`     | Shifts bits to the left (multiplies by 2)               |
| Right Shift          | `>>`     | Shifts bits to the right (divides by 2, preserves sign) |
| Unsigned Right Shift | `>>>`    | Shifts right, fills with zeros                          |

## Example

```java showLineNumbers
int a = 5; // 0101
int b = 3; // 0011

System.out.println(a & b); // 1 (0001)
System.out.println(a | b); // 7 (0111)
System.out.println(a ^ b); // 6 (0110)
System.out.println(~a); // -6 (invert bits)
System.out.println(a << 1); // 10 (left shift → 1010)
System.out.println(a >> 1); // 2 (right shift → 0010)
```

## Common Bit Tricks

### Check if a number is even or odd

```java showLineNumbers
if ((n & 1) == 0) {
    // Even
} else {
    // Odd
}
```

### Swap two numbers without a temporary variable

```java showLineNumbers
a = a ^ b;
b = a ^ b;
a = a ^ b;
```

### Count set bits (Hamming weight)

```java showLineNumbers
int count = 0;
while (n != 0) {
    count += n & 1;
    n >>= 1;
}
```

### Check if a number is a power of 2

```java showLineNumbers
boolean isPowerOfTwo = (n > 0) && ((n & (n - 1)) == 0);
```

### Turn off the rightmost 1-bit

```java showLineNumbers
n = n & (n - 1);
```

### Isolate the rightmost 1-bit

```java showLineNumbers
int rightMostOne = n & -n;
```

## Use Cases in Algorithms

- **Subsets generation:** Bitmasks can represent subsets efficiently.
- **Dynamic programming (bitmask DP):** State compression for subsets.
- **Bit manipulation puzzles:** Common in interviews (e.g., missing number, single number problems).
- **Optimization:** Bitwise operations are faster than arithmetic for certain tasks.

## Interview Tips

- Be ready to explain how bit operations can replace common arithmetic/logical tasks.
- Know the trick to count set bits in O(1) time using `Integer.bitCount(n)` (Java) or Brian Kernighan’s algorithm.
- Understand how to manipulate bits for subset generation.
- Practice classic problems:
  - Find the missing number.
  - Single number (appears once while others appear twice).
  - Reverse bits.

## Helpful Java Built-in Methods

| Method                          | Description                |
| ------------------------------- | -------------------------- |
| `Integer.bitCount(int n)`       | Counts number of 1 bits    |
| `Integer.highestOneBit(int n)`  | Isolates the highest 1 bit |
| `Integer.lowestOneBit(int n)`   | Isolates the lowest 1 bit  |
| `Integer.toBinaryString(int n)` | Converts to binary string  |

## Summary

Bit manipulation is a low-level but powerful tool for:

- **Efficiency** (faster operations than arithmetic)
- **Memory optimization**
- **Solving complex problems** using elegant tricks

Practice recognizing where bit manipulation simplifies or speeds up solutions!
