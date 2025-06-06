# Fast Exponentiation (Exponentiation by Squaring)

## Overview

Fast Exponentiation, also known as Exponentiation by Squaring or Binary Exponentiation, is an algorithm for computing large integer powers efficiently. Instead of performing n multiplications for a^n, it reduces the problem to O(log n) multiplications by utilizing the binary representation of the exponent.

## Key Concepts

- **Binary Representation**: Using the binary form of the exponent to optimize calculations
- **Modular Exponentiation**: Computing (a^n) mod m efficiently for cryptographic applications
- **Matrix Exponentiation**: Extending the concept to matrix multiplication for sequence problems
- **Recursive vs Iterative**: Both approaches achieve the same logarithmic complexity

## Time & Space Complexity

- **Time Complexity**: O(log n)
- **Space Complexity**: O(1) for iterative, O(log n) for recursive

## Core Algorithm

### Basic Principle

The algorithm is based on the identity:

- If n is even: a^n = (a^(n/2))^2
- If n is odd: a^n = a × a^(n-1)

### Recursive Implementation

```typescript
function fastPowerRecursive(base: number, exponent: number): number {
  if (exponent === 0) return 1;
  if (exponent === 1) return base;

  if (exponent % 2 === 0) {
    const half = fastPowerRecursive(base, exponent / 2);
    return half * half;
  } else {
    return base * fastPowerRecursive(base, exponent - 1);
  }
}
```

### Iterative Implementation

```typescript
function fastPowerIterative(base: number, exponent: number): number {
  if (exponent === 0) return 1;

  let result = 1;
  let currentBase = base;
  let currentExponent = exponent;

  while (currentExponent > 0) {
    if (currentExponent % 2 === 1) {
      result *= currentBase;
    }
    currentBase *= currentBase;
    currentExponent = Math.floor(currentExponent / 2);
  }

  return result;
}
```

### Optimized Binary Method

```typescript
function fastPowerBinary(base: number, exponent: number): number {
  if (exponent === 0) return 1;

  let result = 1;
  let currentBase = base;

  while (exponent > 0) {
    if (exponent & 1) {
      result *= currentBase;
    }
    currentBase *= currentBase;
    exponent >>= 1;
  }

  return result;
}
```

## Modular Exponentiation

### Basic Modular Exponentiation

```typescript
function modularExponentiation(
  base: number,
  exponent: number,
  modulus: number
): number {
  if (modulus === 1) return 0;

  let result = 1;
  base = base % modulus;

  while (exponent > 0) {
    if (exponent % 2 === 1) {
      result = (result * base) % modulus;
    }
    exponent = Math.floor(exponent / 2);
    base = (base * base) % modulus;
  }

  return result;
}
```

### Large Number Modular Exponentiation

```typescript
class BigIntegerExponentiation {
  static modPow(base: bigint, exponent: bigint, modulus: bigint): bigint {
    if (modulus === 1n) return 0n;

    let result = 1n;
    base = base % modulus;

    while (exponent > 0n) {
      if (exponent % 2n === 1n) {
        result = (result * base) % modulus;
      }
      exponent = exponent / 2n;
      base = (base * base) % modulus;
    }

    return result;
  }

  static powerMod(base: string, exp: string, mod: string): string {
    const baseBig = BigInt(base);
    const expBig = BigInt(exp);
    const modBig = BigInt(mod);

    return this.modPow(baseBig, expBig, modBig).toString();
  }
}
```

## Matrix Exponentiation

### Matrix Multiplication

```typescript
type Matrix = number[][];

function multiplyMatrices(a: Matrix, b: Matrix): Matrix {
  const rows = a.length;
  const cols = b[0].length;
  const result: Matrix = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(0));

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      for (let k = 0; k < a[0].length; k++) {
        result[i][j] += a[i][k] * b[k][j];
      }
    }
  }

  return result;
}

function matrixPower(matrix: Matrix, n: number): Matrix {
  if (n === 0) {
    const size = matrix.length;
    const identity: Matrix = Array(size)
      .fill(null)
      .map((_, i) =>
        Array(size)
          .fill(null)
          .map((_, j) => (i === j ? 1 : 0))
      );
    return identity;
  }

  if (n === 1) return matrix;

  if (n % 2 === 0) {
    const half = matrixPower(matrix, n / 2);
    return multiplyMatrices(half, half);
  } else {
    return multiplyMatrices(matrix, matrixPower(matrix, n - 1));
  }
}
```

### Fibonacci using Matrix Exponentiation

```typescript
function fibonacciMatrix(n: number): number {
  if (n <= 1) return n;

  const baseMatrix: Matrix = [
    [1, 1],
    [1, 0],
  ];

  const resultMatrix = matrixPower(baseMatrix, n - 1);
  return resultMatrix[0][0];
}

function fibonacciModular(n: number, mod: number): number {
  if (n <= 1) return n;

  function matrixModPower(
    matrix: Matrix,
    exp: number,
    modulus: number
  ): Matrix {
    if (exp === 0)
      return [
        [1, 0],
        [0, 1],
      ];
    if (exp === 1) return matrix.map((row) => row.map((val) => val % modulus));

    if (exp % 2 === 0) {
      const half = matrixModPower(matrix, exp / 2, modulus);
      return multiplyMatricesMod(half, half, modulus);
    } else {
      return multiplyMatricesMod(
        matrix,
        matrixModPower(matrix, exp - 1, modulus),
        modulus
      );
    }
  }

  function multiplyMatricesMod(a: Matrix, b: Matrix, mod: number): Matrix {
    const result = multiplyMatrices(a, b);
    return result.map((row) => row.map((val) => val % mod));
  }

  const baseMatrix: Matrix = [
    [1, 1],
    [1, 0],
  ];
  const resultMatrix = matrixModPower(baseMatrix, n - 1, mod);
  return resultMatrix[0][0];
}
```

## Step-by-Step Example

### Computing 2^10 using Fast Exponentiation

```
Binary representation of 10: 1010

Step-by-step calculation:
10 = 8 + 2 = 2³ + 2¹

Method 1 (Binary):
2^10 = 2^(8+2) = 2^8 × 2^2

Step 1: 2^1 = 2
Step 2: 2^2 = 4
Step 3: 2^4 = 16
Step 4: 2^8 = 256

Result: 2^10 = 2^8 × 2^2 = 256 × 4 = 1024

Method 2 (Iterative):
exponent = 10 (binary: 1010)
base = 2, result = 1

Iteration 1: 10 & 1 = 0, result = 1, base = 4, exponent = 5
Iteration 2: 5 & 1 = 1, result = 4, base = 16, exponent = 2
Iteration 3: 2 & 1 = 0, result = 4, base = 256, exponent = 1
Iteration 4: 1 & 1 = 1, result = 1024, base = 65536, exponent = 0

Final result: 1024
```

## Real-World Applications

### RSA Cryptography

```typescript
class RSACrypto {
  private n: number;
  private e: number;
  private d: number;

  constructor(p: number, q: number, e: number = 65537) {
    this.n = p * q;
    this.e = e;

    const phi = (p - 1) * (q - 1);
    this.d = this.modularInverse(e, phi);
  }

  encrypt(message: number): number {
    return modularExponentiation(message, this.e, this.n);
  }

  decrypt(ciphertext: number): number {
    return modularExponentiation(ciphertext, this.d, this.n);
  }

  private modularInverse(a: number, m: number): number {
    for (let x = 1; x < m; x++) {
      if ((a * x) % m === 1) return x;
    }
    throw new Error("Modular inverse does not exist");
  }

  encryptString(message: string): number[] {
    return message.split("").map((char) => this.encrypt(char.charCodeAt(0)));
  }

  decryptString(ciphertext: number[]): string {
    return ciphertext
      .map((num) => String.fromCharCode(this.decrypt(num)))
      .join("");
  }
}
```

### Diffie-Hellman Key Exchange

```typescript
class DiffieHellman {
  private p: number;
  private g: number;

  constructor(prime: number, generator: number) {
    this.p = prime;
    this.g = generator;
  }

  generatePrivateKey(): number {
    return Math.floor(Math.random() * (this.p - 2)) + 1;
  }

  generatePublicKey(privateKey: number): number {
    return modularExponentiation(this.g, privateKey, this.p);
  }

  generateSharedSecret(theirPublicKey: number, myPrivateKey: number): number {
    return modularExponentiation(theirPublicKey, myPrivateKey, this.p);
  }

  simulateKeyExchange(): {
    alicePrivate: number;
    bobPrivate: number;
    alicePublic: number;
    bobPublic: number;
    sharedSecret: number;
  } {
    const alicePrivate = this.generatePrivateKey();
    const bobPrivate = this.generatePrivateKey();

    const alicePublic = this.generatePublicKey(alicePrivate);
    const bobPublic = this.generatePublicKey(bobPrivate);

    const aliceShared = this.generateSharedSecret(bobPublic, alicePrivate);
    const bobShared = this.generateSharedSecret(alicePublic, bobPrivate);

    if (aliceShared !== bobShared) {
      throw new Error("Key exchange failed");
    }

    return {
      alicePrivate,
      bobPrivate,
      alicePublic,
      bobPublic,
      sharedSecret: aliceShared,
    };
  }
}
```

### Fast Sequence Computation

```typescript
class SequenceComputer {
  static linearRecurrence(
    coefficients: number[],
    initialTerms: number[],
    n: number
  ): number {
    if (n < initialTerms.length) return initialTerms[n];

    const k = coefficients.length;
    const transformMatrix: Matrix = Array(k)
      .fill(null)
      .map(() => Array(k).fill(0));

    for (let i = 0; i < k - 1; i++) {
      transformMatrix[i][i + 1] = 1;
    }

    for (let i = 0; i < k; i++) {
      transformMatrix[k - 1][i] = coefficients[k - 1 - i];
    }

    const resultMatrix = matrixPower(transformMatrix, n - k + 1);

    let result = 0;
    for (let i = 0; i < k; i++) {
      result += resultMatrix[0][i] * initialTerms[k - 1 - i];
    }

    return result;
  }

  static tribonacci(n: number): number {
    if (n <= 1) return 0;
    if (n === 2) return 1;

    return this.linearRecurrence([1, 1, 1], [0, 0, 1], n);
  }

  static lucasNumbers(n: number): number {
    if (n === 0) return 2;
    if (n === 1) return 1;

    return this.linearRecurrence([1, 1], [2, 1], n);
  }
}
```

## Performance Optimization

### Memoization for Repeated Calculations

```typescript
class OptimizedExponentiation {
  private cache = new Map<string, number>();

  fastPowerMemoized(base: number, exponent: number): number {
    const key = `${base}_${exponent}`;

    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    let result: number;
    if (exponent === 0) {
      result = 1;
    } else if (exponent === 1) {
      result = base;
    } else if (exponent % 2 === 0) {
      const half = this.fastPowerMemoized(base, exponent / 2);
      result = half * half;
    } else {
      result = base * this.fastPowerMemoized(base, exponent - 1);
    }

    this.cache.set(key, result);
    return result;
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }
}
```

### Batch Exponentiation

```typescript
function batchExponentiation(base: number, exponents: number[]): number[] {
  const sortedExponents = [...exponents].sort((a, b) => a - b);
  const results = new Map<number, number>();

  let currentPower = 1;
  let currentBase = base;
  let currentExponent = 0;

  for (const exp of sortedExponents) {
    while (currentExponent < exp) {
      if ((exp - currentExponent) & 1) {
        currentPower *= currentBase;
        currentExponent++;
      } else {
        const jump = Math.floor((exp - currentExponent) / 2);
        currentBase = fastPowerIterative(currentBase, 2);
        currentExponent += jump;
      }
    }
    results.set(exp, currentPower);
  }

  return exponents.map((exp) => results.get(exp)!);
}
```

## Related Algorithms

- **[Euclidean Algorithm](./euclidean-algorithm.md)**: Used for modular inverse calculation
- **[Modular Arithmetic](./modular-arithmetic.md)**: Foundation for modular exponentiation
- **[Prime Factorization](./prime-factorization.md)**: Uses fast exponentiation for primality testing
- **[Matrix Algorithms](../matrix/matrix-multiplication.md)**: Matrix exponentiation applications

## LeetCode Problems

1. **[50. Pow(x, n)](https://leetcode.com/problems/powx-n/)**
2. **[372. Super Pow](https://leetcode.com/problems/super-pow/)**
3. **[509. Fibonacci Number](https://leetcode.com/problems/fibonacci-number/)** (Matrix approach)
4. **[1137. N-th Tribonacci Number](https://leetcode.com/problems/n-th-tribonacci-number/)**
5. **[1823. Find the Winner of the Circular Game](https://leetcode.com/problems/find-the-winner-of-the-circular-game/)**

## Implementation Challenges

### Challenge 1: Multi-base Exponentiation

```typescript
function multiBaseExponentiation(bases: number[], exponent: number): number {
  return bases.reduce(
    (product, base) => product * fastPowerIterative(base, exponent),
    1
  );
}

function alternatingBaseExponentiation(
  bases: number[],
  exponents: number[]
): number {
  if (bases.length !== exponents.length) {
    throw new Error("Bases and exponents arrays must have the same length");
  }

  return bases.reduce(
    (product, base, index) =>
      product * fastPowerIterative(base, exponents[index]),
    1
  );
}
```

### Challenge 2: Modular Exponentiation with Multiple Moduli

```typescript
function chineseRemainderExponentiation(
  base: number,
  exponent: number,
  moduli: number[]
): number[] {
  return moduli.map((mod) => modularExponentiation(base, exponent, mod));
}

function batchModularExponentiation(
  operations: Array<{ base: number; exponent: number; modulus: number }>
): number[] {
  return operations.map((op) =>
    modularExponentiation(op.base, op.exponent, op.modulus)
  );
}
```

Fast Exponentiation is a fundamental algorithm that appears in numerous computational contexts, from basic arithmetic to advanced cryptography. Its logarithmic time complexity makes it indispensable for handling large numbers efficiently, and its applications in modular arithmetic form the backbone of modern cryptographic systems.
