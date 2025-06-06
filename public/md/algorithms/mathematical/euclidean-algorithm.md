# Euclidean Algorithm

## Overview

The Euclidean Algorithm is one of the oldest known algorithms for finding the Greatest Common Divisor (GCD) of two integers. It's based on the principle that the GCD of two numbers doesn't change if the larger number is replaced by its difference with the smaller number.

## Key Concepts

- **GCD (Greatest Common Divisor)**: The largest positive integer that divides both numbers without remainder
- **LCM (Least Common Multiple)**: The smallest positive integer that is divisible by both numbers
- **Extended Euclidean Algorithm**: Finds coefficients for Bézout's identity: ax + by = gcd(a, b)

## Time & Space Complexity

- **Time Complexity**: O(log(min(a, b)))
- **Space Complexity**: O(1) for iterative, O(log(min(a, b))) for recursive

## Implementations

### Basic Euclidean Algorithm

```typescript
function gcd(a: number, b: number): number {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return Math.abs(a);
}

function gcdRecursive(a: number, b: number): number {
  if (b === 0) return Math.abs(a);
  return gcdRecursive(b, a % b);
}
```

### LCM Implementation

```typescript
function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

function lcmArray(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((acc, num) => lcm(acc, num));
}
```

### Extended Euclidean Algorithm

```typescript
interface ExtendedGcdResult {
  gcd: number;
  x: number;
  y: number;
}

function extendedGcd(a: number, b: number): ExtendedGcdResult {
  if (b === 0) {
    return { gcd: a, x: 1, y: 0 };
  }

  const result = extendedGcd(b, a % b);
  const x = result.y;
  const y = result.x - Math.floor(a / b) * result.y;

  return { gcd: result.gcd, x, y };
}

function modularInverse(a: number, m: number): number | null {
  const result = extendedGcd(a, m);
  if (result.gcd !== 1) return null;
  return ((result.x % m) + m) % m;
}
```

### Binary GCD (Stein's Algorithm)

```typescript
function binaryGcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);

  if (a === 0) return b;
  if (b === 0) return a;

  let shift = 0;
  while (((a | b) & 1) === 0) {
    a >>= 1;
    b >>= 1;
    shift++;
  }

  while ((a & 1) === 0) a >>= 1;

  do {
    while ((b & 1) === 0) b >>= 1;

    if (a > b) {
      const temp = a;
      a = b;
      b = temp;
    }

    b = b - a;
  } while (b !== 0);

  return a << shift;
}
```

## Step-by-Step Example

### Finding GCD(252, 105)

```
Step 1: gcd(252, 105)
        252 = 105 × 2 + 42
        So gcd(252, 105) = gcd(105, 42)

Step 2: gcd(105, 42)
        105 = 42 × 2 + 21
        So gcd(105, 42) = gcd(42, 21)

Step 3: gcd(42, 21)
        42 = 21 × 2 + 0
        So gcd(42, 21) = 21

Therefore: GCD(252, 105) = 21
```

### Extended Euclidean Example

Finding coefficients for 252x + 105y = gcd(252, 105) = 21:

```
Step 1: 252 = 105 × 2 + 42
Step 2: 105 = 42 × 2 + 21
Step 3: 42 = 21 × 2 + 0

Working backwards:
21 = 105 - 42 × 2
21 = 105 - (252 - 105 × 2) × 2
21 = 105 - 252 × 2 + 105 × 4
21 = 105 × 5 - 252 × 2

Therefore: x = -2, y = 5
Verification: 252(-2) + 105(5) = -504 + 525 = 21 ✓
```

## Real-World Applications

### Cryptography Key Generation

```typescript
function generateCoprimePair(n: number): [number, number] {
  let a: number, b: number;
  do {
    a = Math.floor(Math.random() * n) + 1;
    b = Math.floor(Math.random() * n) + 1;
  } while (gcd(a, n) !== 1 || gcd(b, n) !== 1);

  return [a, b];
}

function rsaKeyGeneration(
  p: number,
  q: number
): {
  n: number;
  phi: number;
  e: number;
  d: number | null;
} {
  const n = p * q;
  const phi = (p - 1) * (q - 1);
  const e = 65537;

  if (gcd(e, phi) !== 1) {
    throw new Error("e and phi(n) must be coprime");
  }

  const d = modularInverse(e, phi);
  return { n, phi, e, d };
}
```

### Fraction Simplification

```typescript
class Fraction {
  numerator: number;
  denominator: number;

  constructor(num: number, den: number) {
    if (den === 0) throw new Error("Denominator cannot be zero");

    const gcdValue = gcd(Math.abs(num), Math.abs(den));
    this.numerator = num / gcdValue;
    this.denominator = den / gcdValue;

    if (this.denominator < 0) {
      this.numerator = -this.numerator;
      this.denominator = -this.denominator;
    }
  }

  add(other: Fraction): Fraction {
    const num =
      this.numerator * other.denominator + other.numerator * this.denominator;
    const den = this.denominator * other.denominator;
    return new Fraction(num, den);
  }

  multiply(other: Fraction): Fraction {
    return new Fraction(
      this.numerator * other.numerator,
      this.denominator * other.denominator
    );
  }

  toString(): string {
    return this.denominator === 1
      ? this.numerator.toString()
      : `${this.numerator}/${this.denominator}`;
  }
}
```

### Grid Path Optimization

```typescript
function optimizeGridMovement(
  width: number,
  height: number
): {
  stepX: number;
  stepY: number;
  totalSteps: number;
} {
  const gcdValue = gcd(width, height);
  const stepX = width / gcdValue;
  const stepY = height / gcdValue;

  return {
    stepX,
    stepY,
    totalSteps: gcdValue,
  };
}

function findLatticePoints(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  return gcd(dx, dy) + 1;
}
```

## Performance Analysis

### Comparison of GCD Algorithms

```typescript
function benchmarkGcdAlgorithms(
  a: number,
  b: number,
  iterations: number = 10000
) {
  const algorithms = [
    { name: "Euclidean (Iterative)", fn: gcd },
    { name: "Euclidean (Recursive)", fn: gcdRecursive },
    { name: "Binary GCD", fn: binaryGcd },
  ];

  algorithms.forEach((algo) => {
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      algo.fn(a + i, b + i);
    }
    const end = performance.now();
    console.log(`${algo.name}: ${(end - start).toFixed(2)}ms`);
  });
}
```

### Memory Usage Analysis

```typescript
function analyzeGcdComplexity(maxValue: number) {
  const results: Array<{ input: number; steps: number }> = [];

  function countSteps(a: number, b: number): number {
    let steps = 0;
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
      steps++;
    }
    return steps;
  }

  for (let i = 1; i <= maxValue; i++) {
    for (let j = i + 1; j <= maxValue; j++) {
      const steps = countSteps(j, i);
      results.push({ input: j, steps });
    }
  }

  const maxSteps = Math.max(...results.map((r) => r.steps));
  const avgSteps =
    results.reduce((sum, r) => sum + r.steps, 0) / results.length;

  return { maxSteps, avgSteps, theoretical: Math.log2(maxValue) * 2 };
}
```

## Related Algorithms

- **[Modular Arithmetic](./modular-arithmetic.md)**: Uses GCD for modular inverse
- **[Prime Factorization](./prime-factorization.md)**: GCD helps in factorization
- **[Chinese Remainder Theorem](./chinese-remainder-theorem.md)**: Requires coprime moduli
- **[Fast Exponentiation](./fast-exponentiation.md)**: Often combined with modular arithmetic

## LeetCode Problems

1. **[1071. Greatest Common Divisor of Strings](https://leetcode.com/problems/greatest-common-divisor-of-strings/)**
2. **[365. Water and Jug Problem](https://leetcode.com/problems/water-and-jug-problem/)**
3. **[858. Mirror Reflection](https://leetcode.com/problems/mirror-reflection/)**
4. **[914. X of a Kind in a Deck of Cards](https://leetcode.com/problems/x-of-a-kind-in-a-deck-of-cards/)**
5. **[1979. Find Greatest Common Divisor of Array](https://leetcode.com/problems/find-greatest-common-divisor-of-array/)**

## Implementation Challenges

### Challenge 1: Batch GCD Calculation

```typescript
function batchGcd(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  if (numbers.length === 1) return Math.abs(numbers[0]);

  return numbers.reduce((acc, num) => gcd(acc, num));
}

function parallelGcd(numbers: number[]): number {
  if (numbers.length <= 2) return batchGcd(numbers);

  const mid = Math.floor(numbers.length / 2);
  const left = parallelGcd(numbers.slice(0, mid));
  const right = parallelGcd(numbers.slice(mid));

  return gcd(left, right);
}
```

### Challenge 2: GCD-based Encryption

```typescript
class GcdBasedCipher {
  private key: number;
  private modulus: number;

  constructor(key: number, modulus: number) {
    if (gcd(key, modulus) !== 1) {
      throw new Error("Key and modulus must be coprime");
    }
    this.key = key;
    this.modulus = modulus;
  }

  encrypt(plaintext: string): string {
    return plaintext
      .split("")
      .map((char) => {
        const code = char.charCodeAt(0);
        const encrypted = (code * this.key) % this.modulus;
        return String.fromCharCode(encrypted);
      })
      .join("");
  }

  decrypt(ciphertext: string): string {
    const inverse = modularInverse(this.key, this.modulus);
    if (inverse === null) throw new Error("Cannot decrypt: no modular inverse");

    return ciphertext
      .split("")
      .map((char) => {
        const code = char.charCodeAt(0);
        const decrypted = (code * inverse) % this.modulus;
        return String.fromCharCode(decrypted);
      })
      .join("");
  }
}
```

The Euclidean Algorithm is fundamental to many areas of computer science and mathematics, providing an efficient way to compute GCD and solve various number-theoretic problems. Its applications range from cryptography to algorithm optimization, making it an essential tool for any programmer's toolkit.
