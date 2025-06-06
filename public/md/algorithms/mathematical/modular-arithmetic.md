# Modular Arithmetic

## Overview

Modular Arithmetic is a system of arithmetic for integers where numbers "wrap around" when reaching a certain modulus. It's fundamental in computer science, particularly in cryptography, hashing, and algorithm design. The concept involves performing arithmetic operations and then taking the remainder when divided by a fixed positive integer called the modulus.

## Key Concepts

- **Modulus (m)**: The positive integer that defines the modular system
- **Congruence**: Two integers a and b are congruent modulo m if (a - b) is divisible by m
- **Modular Inverse**: For integer a, its modular inverse a⁻¹ modulo m satisfies (a × a⁻¹) ≡ 1 (mod m)
- **Chinese Remainder Theorem**: System for solving simultaneous congruences with pairwise coprime moduli
- **Fermat's Little Theorem**: If p is prime and a is not divisible by p, then aᵖ⁻¹ ≡ 1 (mod p)

## Time & Space Complexity

| Operation                 | Time       | Space |
| ------------------------- | ---------- | ----- |
| Addition/Subtraction      | O(1)       | O(1)  |
| Multiplication            | O(1)       | O(1)  |
| Modular Exponentiation    | O(log n)   | O(1)  |
| Modular Inverse           | O(log m)   | O(1)  |
| Chinese Remainder Theorem | O(n log m) | O(n)  |

## Basic Operations

### Fundamental Modular Operations

```typescript
class ModularArithmetic {
  private mod: number;

  constructor(modulus: number) {
    if (modulus <= 0) throw new Error("Modulus must be positive");
    this.mod = modulus;
  }

  add(a: number, b: number): number {
    return ((a % this.mod) + (b % this.mod)) % this.mod;
  }

  subtract(a: number, b: number): number {
    return ((a % this.mod) - (b % this.mod) + this.mod) % this.mod;
  }

  multiply(a: number, b: number): number {
    return ((a % this.mod) * (b % this.mod)) % this.mod;
  }

  power(base: number, exponent: number): number {
    if (exponent < 0)
      throw new Error("Negative exponents require modular inverse");

    let result = 1;
    base = base % this.mod;

    while (exponent > 0) {
      if (exponent & 1) {
        result = this.multiply(result, base);
      }
      exponent >>= 1;
      base = this.multiply(base, base);
    }

    return result;
  }

  inverse(a: number): number | null {
    const gcdResult = this.extendedGcd(a, this.mod);
    if (gcdResult.gcd !== 1) return null;

    return ((gcdResult.x % this.mod) + this.mod) % this.mod;
  }

  divide(a: number, b: number): number | null {
    const bInverse = this.inverse(b);
    if (bInverse === null) return null;

    return this.multiply(a, bInverse);
  }

  private extendedGcd(
    a: number,
    b: number
  ): { gcd: number; x: number; y: number } {
    if (b === 0) return { gcd: a, x: 1, y: 0 };

    const result = this.extendedGcd(b, a % b);
    return {
      gcd: result.gcd,
      x: result.y,
      y: result.x - Math.floor(a / b) * result.y,
    };
  }
}
```

### Large Number Modular Arithmetic

```typescript
class BigModularArithmetic {
  private mod: bigint;

  constructor(modulus: bigint) {
    if (modulus <= 0n) throw new Error("Modulus must be positive");
    this.mod = modulus;
  }

  add(a: bigint, b: bigint): bigint {
    return ((a % this.mod) + (b % this.mod)) % this.mod;
  }

  subtract(a: bigint, b: bigint): bigint {
    return ((a % this.mod) - (b % this.mod) + this.mod) % this.mod;
  }

  multiply(a: bigint, b: bigint): bigint {
    return ((a % this.mod) * (b % this.mod)) % this.mod;
  }

  power(base: bigint, exponent: bigint): bigint {
    if (exponent < 0n)
      throw new Error("Negative exponents require modular inverse");

    let result = 1n;
    base = base % this.mod;

    while (exponent > 0n) {
      if (exponent & 1n) {
        result = this.multiply(result, base);
      }
      exponent >>= 1n;
      base = this.multiply(base, base);
    }

    return result;
  }

  inverse(a: bigint): bigint | null {
    const gcdResult = this.extendedGcd(a, this.mod);
    if (gcdResult.gcd !== 1n) return null;

    return ((gcdResult.x % this.mod) + this.mod) % this.mod;
  }

  private extendedGcd(
    a: bigint,
    b: bigint
  ): { gcd: bigint; x: bigint; y: bigint } {
    if (b === 0n) return { gcd: a, x: 1n, y: 0n };

    const result = this.extendedGcd(b, a % b);
    return {
      gcd: result.gcd,
      x: result.y,
      y: result.x - (a / b) * result.y,
    };
  }
}
```

## Advanced Techniques

### Chinese Remainder Theorem

```typescript
class ChineseRemainderTheorem {
  static solve(remainders: number[], moduli: number[]): number | null {
    if (remainders.length !== moduli.length) return null;
    if (!this.areModuliPairwiseCoprime(moduli)) return null;

    const n = remainders.length;
    const M = moduli.reduce((prod, mod) => prod * mod, 1);
    let result = 0;

    for (let i = 0; i < n; i++) {
      const Mi = M / moduli[i];
      const yi = this.modularInverse(Mi, moduli[i]);

      if (yi === null) return null;

      result += remainders[i] * Mi * yi;
    }

    return ((result % M) + M) % M;
  }

  static solveBig(remainders: bigint[], moduli: bigint[]): bigint | null {
    if (remainders.length !== moduli.length) return null;

    const n = remainders.length;
    const M = moduli.reduce((prod, mod) => prod * mod, 1n);
    let result = 0n;

    for (let i = 0; i < n; i++) {
      const Mi = M / moduli[i];
      const yi = this.modularInverseBig(Mi, moduli[i]);

      if (yi === null) return null;

      result += remainders[i] * Mi * yi;
    }

    return ((result % M) + M) % M;
  }

  private static areModuliPairwiseCoprime(moduli: number[]): boolean {
    for (let i = 0; i < moduli.length; i++) {
      for (let j = i + 1; j < moduli.length; j++) {
        if (this.gcd(moduli[i], moduli[j]) !== 1) return false;
      }
    }
    return true;
  }

  private static gcd(a: number, b: number): number {
    return b === 0 ? a : this.gcd(b, a % b);
  }

  private static modularInverse(a: number, m: number): number | null {
    const result = this.extendedGcd(a, m);
    return result.gcd === 1 ? ((result.x % m) + m) % m : null;
  }

  private static modularInverseBig(a: bigint, m: bigint): bigint | null {
    const result = this.extendedGcdBig(a, m);
    return result.gcd === 1n ? ((result.x % m) + m) % m : null;
  }

  private static extendedGcd(
    a: number,
    b: number
  ): { gcd: number; x: number; y: number } {
    if (b === 0) return { gcd: a, x: 1, y: 0 };
    const result = this.extendedGcd(b, a % b);
    return {
      gcd: result.gcd,
      x: result.y,
      y: result.x - Math.floor(a / b) * result.y,
    };
  }

  private static extendedGcdBig(
    a: bigint,
    b: bigint
  ): { gcd: bigint; x: bigint; y: bigint } {
    if (b === 0n) return { gcd: a, x: 1n, y: 0n };
    const result = this.extendedGcdBig(b, a % b);
    return {
      gcd: result.gcd,
      x: result.y,
      y: result.x - (a / b) * result.y,
    };
  }
}
```

### Modular Linear Equation Solver

```typescript
class ModularLinearEquations {
  static solveLinear(a: number, b: number, m: number): number[] {
    const gcdResult = this.extendedGcd(a, m);
    const g = gcdResult.gcd;

    if (b % g !== 0) return [];

    const x0 = (gcdResult.x * (b / g)) % m;
    const solutions: number[] = [];

    for (let i = 0; i < g; i++) {
      solutions.push((((x0 + i * (m / g)) % m) + m) % m);
    }

    return solutions.sort((a, b) => a - b);
  }

  static solveSystem(
    equations: Array<{ a: number; b: number; m: number }>
  ): number | null {
    if (equations.length === 0) return null;

    let currentRemainder = equations[0].b;
    let currentModulus = equations[0].m;

    for (let i = 1; i < equations.length; i++) {
      const eq = equations[i];
      const solutions = this.solveLinear(
        currentModulus,
        eq.b - currentRemainder,
        eq.m
      );

      if (solutions.length === 0) return null;

      currentRemainder = currentRemainder + currentModulus * solutions[0];
      currentModulus = this.lcm(currentModulus, eq.m);
    }

    return (
      ((currentRemainder % currentModulus) + currentModulus) % currentModulus
    );
  }

  private static extendedGcd(
    a: number,
    b: number
  ): { gcd: number; x: number; y: number } {
    if (b === 0) return { gcd: a, x: 1, y: 0 };
    const result = this.extendedGcd(b, a % b);
    return {
      gcd: result.gcd,
      x: result.y,
      y: result.x - Math.floor(a / b) * result.y,
    };
  }

  private static gcd(a: number, b: number): number {
    return b === 0 ? a : this.gcd(b, a % b);
  }

  private static lcm(a: number, b: number): number {
    return Math.abs(a * b) / this.gcd(a, b);
  }
}
```

### Quadratic Residues

```typescript
class QuadraticResidue {
  static isQuadraticResidue(a: number, p: number): boolean {
    if (!this.isPrime(p)) throw new Error("p must be prime");

    a = ((a % p) + p) % p;
    if (a === 0) return true;

    return this.modPow(a, (p - 1) / 2, p) === 1;
  }

  static legendreSymbol(a: number, p: number): number {
    if (!this.isPrime(p)) throw new Error("p must be prime");

    a = ((a % p) + p) % p;
    if (a === 0) return 0;

    const result = this.modPow(a, (p - 1) / 2, p);
    return result === p - 1 ? -1 : result;
  }

  static tonelliShanks(n: number, p: number): number[] {
    if (!this.isQuadraticResidue(n, p)) return [];

    if (p % 4 === 3) {
      const r = this.modPow(n, (p + 1) / 4, p);
      return [r, p - r];
    }

    let q = p - 1;
    let s = 0;
    while (q % 2 === 0) {
      q /= 2;
      s++;
    }

    if (s === 1) {
      const r = this.modPow(n, (p + 1) / 4, p);
      return [r, p - r];
    }

    let z = 2;
    while (this.isQuadraticResidue(z, p)) z++;

    let m = s;
    let c = this.modPow(z, q, p);
    let t = this.modPow(n, q, p);
    let r = this.modPow(n, (q + 1) / 2, p);

    while (t % p !== 1) {
      let i = 1;
      let temp = (t * t) % p;
      while (temp % p !== 1) {
        temp = (temp * temp) % p;
        i++;
      }

      const b = this.modPow(c, this.modPow(2, m - i - 1, p - 1), p);
      m = i;
      c = (b * b) % p;
      t = (t * c) % p;
      r = (r * b) % p;
    }

    return [r, p - r];
  }

  private static modPow(base: number, exp: number, mod: number): number {
    let result = 1;
    base %= mod;
    while (exp > 0) {
      if (exp & 1) result = (result * base) % mod;
      base = (base * base) % mod;
      exp >>= 1;
    }
    return result;
  }

  private static isPrime(n: number): boolean {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;

    for (let i = 3; i * i <= n; i += 2) {
      if (n % i === 0) return false;
    }
    return true;
  }
}
```

## Step-by-Step Examples

### Chinese Remainder Theorem Example

Solve the system:

```
x ≡ 2 (mod 3)
x ≡ 3 (mod 5)
x ≡ 2 (mod 7)
```

**Solution:**

```
Step 1: Check if moduli are pairwise coprime
gcd(3,5) = 1, gcd(3,7) = 1, gcd(5,7) = 1 ✓

Step 2: Calculate M = 3 × 5 × 7 = 105

Step 3: Calculate Mi values
M₁ = 105/3 = 35
M₂ = 105/5 = 21
M₃ = 105/7 = 15

Step 4: Find modular inverses
35 × y₁ ≡ 1 (mod 3) → 2 × y₁ ≡ 1 (mod 3) → y₁ = 2
21 × y₂ ≡ 1 (mod 5) → 1 × y₂ ≡ 1 (mod 5) → y₂ = 1
15 × y₃ ≡ 1 (mod 7) → 1 × y₃ ≡ 1 (mod 7) → y₃ = 1

Step 5: Calculate solution
x = (2×35×2 + 3×21×1 + 2×15×1) mod 105
x = (140 + 63 + 30) mod 105
x = 233 mod 105 = 23

Verification:
23 mod 3 = 2 ✓
23 mod 5 = 3 ✓
23 mod 7 = 2 ✓
```

## Real-World Applications

### Hash Function Implementation

```typescript
class ModularHashFunction {
  private readonly prime: number;
  private readonly base: number;

  constructor(prime: number = 1000000007, base: number = 31) {
    this.prime = prime;
    this.base = base;
  }

  hashString(str: string): number {
    let hash = 0;
    let power = 1;

    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i) - "a".charCodeAt(0) + 1;
      hash = (hash + ((charCode * power) % this.prime)) % this.prime;
      power = (power * this.base) % this.prime;
    }

    return hash;
  }

  rollingHash(str: string, windowSize: number): number[] {
    if (str.length < windowSize) return [];

    const hashes: number[] = [];
    let currentHash = 0;
    let power = 1;

    for (let i = 0; i < windowSize - 1; i++) {
      power = (power * this.base) % this.prime;
    }

    for (let i = 0; i < windowSize; i++) {
      const charCode = str.charCodeAt(i) - "a".charCodeAt(0) + 1;
      currentHash = (currentHash * this.base + charCode) % this.prime;
    }
    hashes.push(currentHash);

    for (let i = windowSize; i < str.length; i++) {
      const oldChar = str.charCodeAt(i - windowSize) - "a".charCodeAt(0) + 1;
      const newChar = str.charCodeAt(i) - "a".charCodeAt(0) + 1;

      currentHash =
        (currentHash - ((oldChar * power) % this.prime) + this.prime) %
        this.prime;
      currentHash = (currentHash * this.base + newChar) % this.prime;

      hashes.push(currentHash);
    }

    return hashes;
  }

  hashArray(arr: number[]): number {
    let hash = 0;
    let power = 1;

    for (const num of arr) {
      hash = (hash + ((num * power) % this.prime)) % this.prime;
      power = (power * this.base) % this.prime;
    }

    return hash;
  }
}
```

### Cryptographic Applications

```typescript
class ModularCryptography {
  static elGamalKeyGeneration(
    p: number,
    g: number
  ): {
    publicKey: { p: number; g: number; y: number };
    privateKey: number;
  } {
    const x = Math.floor(Math.random() * (p - 2)) + 1;
    const modArith = new ModularArithmetic(p);
    const y = modArith.power(g, x);

    return {
      publicKey: { p, g, y },
      privateKey: x,
    };
  }

  static elGamalEncrypt(
    message: number,
    publicKey: { p: number; g: number; y: number }
  ): { c1: number; c2: number } {
    const k = Math.floor(Math.random() * (publicKey.p - 2)) + 1;
    const modArith = new ModularArithmetic(publicKey.p);

    const c1 = modArith.power(publicKey.g, k);
    const c2 = modArith.multiply(message, modArith.power(publicKey.y, k));

    return { c1, c2 };
  }

  static elGamalDecrypt(
    ciphertext: { c1: number; c2: number },
    privateKey: number,
    p: number
  ): number {
    const modArith = new ModularArithmetic(p);
    const s = modArith.power(ciphertext.c1, privateKey);
    const sInverse = modArith.inverse(s);

    if (sInverse === null) throw new Error("Cannot decrypt");

    return modArith.multiply(ciphertext.c2, sInverse);
  }

  static diffieHellman(
    p: number,
    g: number
  ): {
    alicePublic: number;
    bobPublic: number;
    sharedSecret: number;
  } {
    const alicePrivate = Math.floor(Math.random() * (p - 2)) + 1;
    const bobPrivate = Math.floor(Math.random() * (p - 2)) + 1;

    const modArith = new ModularArithmetic(p);

    const alicePublic = modArith.power(g, alicePrivate);
    const bobPublic = modArith.power(g, bobPrivate);

    const aliceShared = modArith.power(bobPublic, alicePrivate);
    const bobShared = modArith.power(alicePublic, bobPrivate);

    if (aliceShared !== bobShared) {
      throw new Error("Key exchange failed");
    }

    return {
      alicePublic,
      bobPublic,
      sharedSecret: aliceShared,
    };
  }
}
```

### Random Number Generation

```typescript
class ModularRandomGenerator {
  private seed: number;
  private readonly a: number;
  private readonly c: number;
  private readonly m: number;

  constructor(seed: number = Date.now()) {
    this.seed = seed;
    this.a = 1664525;
    this.c = 1013904223;
    this.m = Math.pow(2, 32);
  }

  next(): number {
    this.seed = (this.a * this.seed + this.c) % this.m;
    return this.seed;
  }

  nextFloat(): number {
    return this.next() / this.m;
  }

  nextRange(min: number, max: number): number {
    return min + Math.floor(this.nextFloat() * (max - min + 1));
  }

  nextGaussian(): number {
    let u = 0,
      v = 0;
    while (u === 0) u = this.nextFloat();
    while (v === 0) v = this.nextFloat();

    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  setSeed(seed: number): void {
    this.seed = seed;
  }

  generateSequence(length: number): number[] {
    const sequence: number[] = [];
    for (let i = 0; i < length; i++) {
      sequence.push(this.next());
    }
    return sequence;
  }

  static mersenneTwister(seed: number = Date.now()): () => number {
    const mt: number[] = new Array(624);
    let index = 0;

    mt[0] = seed;
    for (let i = 1; i < 624; i++) {
      mt[i] = (1812433253 * (mt[i - 1] ^ (mt[i - 1] >>> 30)) + i) >>> 0;
    }

    function generateNumbers(): void {
      for (let i = 0; i < 624; i++) {
        const y = (mt[i] & 0x80000000) + (mt[(i + 1) % 624] & 0x7fffffff);
        mt[i] = mt[(i + 397) % 624] ^ (y >>> 1);
        if (y % 2 !== 0) {
          mt[i] = mt[i] ^ 0x9908b0df;
        }
      }
    }

    return function (): number {
      if (index >= 624) {
        generateNumbers();
        index = 0;
      }

      let y = mt[index++];
      y = y ^ (y >>> 11);
      y = y ^ ((y << 7) & 0x9d2c5680);
      y = y ^ ((y << 15) & 0xefc60000);
      y = y ^ (y >>> 18);

      return (y >>> 0) / 4294967296;
    };
  }
}
```

## Performance Benchmarks

### Modular Arithmetic Performance Comparison

```typescript
class ModularPerformanceBenchmark {
  static compareImplementations(iterations: number = 1000000): void {
    const modulus = 1000000007;
    const numbers = Array.from({ length: 1000 }, () =>
      Math.floor(Math.random() * modulus)
    );

    console.log(
      `Benchmarking ${iterations} operations with modulus ${modulus}`
    );

    const implementations = [
      {
        name: "Built-in % operator",
        fn: (a: number, b: number) => (a + b) % modulus,
      },
      {
        name: "Modular class",
        fn: (() => {
          const mod = new ModularArithmetic(modulus);
          return (a: number, b: number) => mod.add(a, b);
        })(),
      },
      {
        name: "Inline modular",
        fn: (a: number, b: number) => ((a % modulus) + (b % modulus)) % modulus,
      },
    ];

    implementations.forEach((impl) => {
      const start = performance.now();

      for (let i = 0; i < iterations; i++) {
        const idx1 = i % numbers.length;
        const idx2 = (i + 1) % numbers.length;
        impl.fn(numbers[idx1], numbers[idx2]);
      }

      const end = performance.now();
      console.log(`${impl.name}: ${(end - start).toFixed(2)}ms`);
    });
  }

  static benchmarkModularExponentiation(
    base: number,
    maxExponent: number
  ): void {
    const modulus = 1000000007;
    const exponents = Array.from(
      { length: 100 },
      () => Math.floor(Math.random() * maxExponent) + 1
    );

    const methods = [
      {
        name: "Fast Exponentiation",
        fn: (b: number, e: number) => {
          const mod = new ModularArithmetic(modulus);
          return mod.power(b, e);
        },
      },
      {
        name: "Native BigInt",
        fn: (b: number, e: number) => {
          return Number(BigInt(b) ** BigInt(e) % BigInt(modulus));
        },
      },
    ];

    methods.forEach((method) => {
      const start = performance.now();

      exponents.forEach((exp) => {
        method.fn(base, exp);
      });

      const end = performance.now();
      console.log(
        `${method.name} (exp up to ${maxExponent}): ${(end - start).toFixed(
          2
        )}ms`
      );
    });
  }
}
```

## Related Algorithms

- **[Euclidean Algorithm](./euclidean-algorithm.md)**: Essential for modular inverse calculation
- **[Fast Exponentiation](./fast-exponentiation.md)**: Core technique for modular exponentiation
- **[Prime Factorization](./prime-factorization.md)**: Used in various modular arithmetic applications
- **[Miller-Rabin Test](./miller-rabin-test.md)**: Uses modular exponentiation for primality testing

## LeetCode Problems

1. **[509. Fibonacci Number](https://leetcode.com/problems/fibonacci-number/)** (Matrix exponentiation)
2. **[372. Super Pow](https://leetcode.com/problems/super-pow/)**
3. **[1015. Smallest Integer Divisible by K](https://leetcode.com/problems/smallest-integer-divisible-by-k/)**
4. **[1553. Minimum Number of Days to Eat N Oranges](https://leetcode.com/problems/minimum-number-of-days-to-eat-n-oranges/)**
5. **[1808. Maximize Number of Nice Divisors](https://leetcode.com/problems/maximize-number-of-nice-divisors/)**

## Implementation Challenges

### Challenge 1: Modular Matrix Operations

```typescript
class ModularMatrix {
  private mod: number;
  private matrix: number[][];

  constructor(matrix: number[][], modulus: number) {
    this.matrix = matrix.map((row) => [...row]);
    this.mod = modulus;
    this.normalize();
  }

  private normalize(): void {
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        this.matrix[i][j] =
          ((this.matrix[i][j] % this.mod) + this.mod) % this.mod;
      }
    }
  }

  add(other: ModularMatrix): ModularMatrix {
    if (
      this.matrix.length !== other.matrix.length ||
      this.matrix[0].length !== other.matrix[0].length
    ) {
      throw new Error("Matrix dimensions must match");
    }

    const result = this.matrix.map((row, i) =>
      row.map((val, j) => (val + other.matrix[i][j]) % this.mod)
    );

    return new ModularMatrix(result, this.mod);
  }

  multiply(other: ModularMatrix): ModularMatrix {
    if (this.matrix[0].length !== other.matrix.length) {
      throw new Error("Invalid matrix dimensions for multiplication");
    }

    const rows = this.matrix.length;
    const cols = other.matrix[0].length;
    const inner = this.matrix[0].length;

    const result = Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(0));

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        for (let k = 0; k < inner; k++) {
          result[i][j] =
            (result[i][j] + this.matrix[i][k] * other.matrix[k][j]) % this.mod;
        }
      }
    }

    return new ModularMatrix(result, this.mod);
  }

  power(exponent: number): ModularMatrix {
    if (this.matrix.length !== this.matrix[0].length) {
      throw new Error("Matrix must be square for exponentiation");
    }

    const size = this.matrix.length;
    let result = new ModularMatrix(
      Array(size)
        .fill(null)
        .map((_, i) =>
          Array(size)
            .fill(null)
            .map((_, j) => (i === j ? 1 : 0))
        ),
      this.mod
    );

    let base = new ModularMatrix(this.matrix, this.mod);

    while (exponent > 0) {
      if (exponent & 1) {
        result = result.multiply(base);
      }
      base = base.multiply(base);
      exponent >>= 1;
    }

    return result;
  }

  determinant(): number {
    if (this.matrix.length !== this.matrix[0].length) {
      throw new Error("Matrix must be square");
    }

    const n = this.matrix.length;
    const temp = this.matrix.map((row) => [...row]);
    let det = 1;
    const modArith = new ModularArithmetic(this.mod);

    for (let i = 0; i < n; i++) {
      let pivot = i;
      for (let j = i + 1; j < n; j++) {
        if (Math.abs(temp[j][i]) > Math.abs(temp[pivot][i])) {
          pivot = j;
        }
      }

      if (pivot !== i) {
        [temp[i], temp[pivot]] = [temp[pivot], temp[i]];
        det = modArith.subtract(0, det);
      }

      det = modArith.multiply(det, temp[i][i]);
      if (det === 0) return 0;

      const invPivot = modArith.inverse(temp[i][i]);
      if (invPivot === null) return 0;

      for (let j = i + 1; j < n; j++) {
        const factor = modArith.multiply(temp[j][i], invPivot);
        for (let k = i; k < n; k++) {
          temp[j][k] = modArith.subtract(
            temp[j][k],
            modArith.multiply(factor, temp[i][k])
          );
        }
      }
    }

    return det;
  }

  getMatrix(): number[][] {
    return this.matrix.map((row) => [...row]);
  }
}
```

### Challenge 2: Discrete Logarithm (Baby-Step Giant-Step)

```typescript
class DiscreteLogarithm {
  static babyStepGiantStep(a: number, b: number, p: number): number | null {
    const n = Math.ceil(Math.sqrt(p));
    const modArith = new ModularArithmetic(p);

    const babySteps = new Map<number, number>();
    let gamma = 1;

    for (let j = 0; j < n; j++) {
      if (gamma === b) return j;
      babySteps.set(gamma, j);
      gamma = modArith.multiply(gamma, a);
    }

    const factor = modArith.inverse(modArith.power(a, n));
    if (factor === null) return null;

    let y = b;
    for (let i = 0; i < n; i++) {
      if (babySteps.has(y)) {
        const result = i * n + babySteps.get(y)!;
        if (result > 0) return result;
      }
      y = modArith.multiply(y, factor);
    }

    return null;
  }

  static pollardRho(a: number, b: number, p: number): number | null {
    function f(x: number, a: number, b: number): [number, number, number] {
      const [xi, ai, bi] = x;
      const modArith = new ModularArithmetic(p - 1);

      if (xi % 3 === 0) {
        return [
          modArith.multiply(xi, xi),
          modArith.multiply(ai, 2),
          modArith.multiply(bi, 2),
        ];
      } else if (xi % 3 === 1) {
        return [modArith.multiply(xi, a), modArith.add(ai, 1), bi];
      } else {
        return [modArith.multiply(xi, b), ai, modArith.add(bi, 1)];
      }
    }

    let tortoise = [1, 0, 0];
    let hare = [1, 0, 0];

    do {
      tortoise = f(tortoise, a, b);
      hare = f(f(hare, a, b), a, b);
    } while (tortoise[0] !== hare[0]);

    const modArith = new ModularArithmetic(p - 1);
    const r = modArith.subtract(tortoise[1], hare[1]);
    const s = modArith.subtract(hare[2], tortoise[2]);

    if (s === 0) return null;

    const sInverse = modArith.inverse(s);
    if (sInverse === null) return null;

    return modArith.multiply(r, sInverse);
  }
}
```

Modular Arithmetic forms the mathematical foundation for many advanced algorithms in computer science, particularly in cryptography, number theory, and competitive programming. Its efficient implementation is crucial for handling large numbers and complex mathematical operations in computational systems.
