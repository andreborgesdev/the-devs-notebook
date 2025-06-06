# Sieve of Eratosthenes

## Overview

The Sieve of Eratosthenes is an ancient algorithm for finding all prime numbers up to a given limit. It systematically eliminates composite numbers by marking multiples of each prime, leaving only the prime numbers unmarked. This algorithm is highly efficient for generating all primes in a range and forms the foundation for many number-theoretic applications.

## Key Concepts

- **Prime Numbers**: Natural numbers greater than 1 with exactly two divisors (1 and themselves)
- **Composite Numbers**: Natural numbers with more than two divisors
- **Sieving**: The process of eliminating composite numbers by marking multiples
- **Optimization Techniques**: Various methods to reduce time and space complexity

## Time & Space Complexity

- **Time Complexity**: O(n log log n)
- **Space Complexity**: O(n)
- **Optimized versions**: Can achieve O(n) time and O(√n) space

## Basic Implementation

### Standard Sieve of Eratosthenes

```typescript
function sieveOfEratosthenes(limit: number): number[] {
  if (limit < 2) return [];

  const isPrime = new Array(limit + 1).fill(true);
  isPrime[0] = isPrime[1] = false;

  for (let i = 2; i * i <= limit; i++) {
    if (isPrime[i]) {
      for (let j = i * i; j <= limit; j += i) {
        isPrime[j] = false;
      }
    }
  }

  const primes: number[] = [];
  for (let i = 2; i <= limit; i++) {
    if (isPrime[i]) {
      primes.push(i);
    }
  }

  return primes;
}
```

### Optimized Boolean Array Version

```typescript
function optimizedSieve(limit: number): boolean[] {
  const isPrime = new Array(limit + 1).fill(true);
  isPrime[0] = isPrime[1] = false;

  for (let i = 2; i * i <= limit; i++) {
    if (isPrime[i]) {
      for (let j = i * i; j <= limit; j += i) {
        isPrime[j] = false;
      }
    }
  }

  return isPrime;
}

function getPrimesFromSieve(sieve: boolean[]): number[] {
  const primes: number[] = [];
  for (let i = 2; i < sieve.length; i++) {
    if (sieve[i]) primes.push(i);
  }
  return primes;
}
```

## Advanced Optimizations

### Segmented Sieve

```typescript
class SegmentedSieve {
  private smallPrimes: number[];

  constructor(limit: number) {
    const sqrtLimit = Math.floor(Math.sqrt(limit));
    this.smallPrimes = sieveOfEratosthenes(sqrtLimit);
  }

  sieveRange(low: number, high: number): number[] {
    const size = high - low + 1;
    const isPrime = new Array(size).fill(true);

    for (const prime of this.smallPrimes) {
      const start = Math.max(prime * prime, Math.ceil(low / prime) * prime);

      for (let j = start; j <= high; j += prime) {
        isPrime[j - low] = false;
      }
    }

    const primes: number[] = [];
    const startIdx = Math.max(0, 2 - low);

    for (let i = startIdx; i < size; i++) {
      if (isPrime[i]) {
        primes.push(low + i);
      }
    }

    return primes;
  }

  countPrimesInRange(low: number, high: number): number {
    return this.sieveRange(low, high).length;
  }
}
```

### Wheel Factorization Sieve

```typescript
class WheelSieve {
  private wheel: number[];
  private wheelSize: number;

  constructor(primes: number[] = [2, 3, 5]) {
    this.generateWheel(primes);
  }

  private generateWheel(primes: number[]): void {
    const product = primes.reduce((a, b) => a * b, 1);
    const wheel: number[] = [];

    for (let i = 1; i < product; i++) {
      if (primes.every((p) => i % p !== 0)) {
        wheel.push(i);
      }
    }

    this.wheel = wheel;
    this.wheelSize = product;
  }

  sieve(limit: number): number[] {
    if (limit < 2) return [];

    const isPrime = new Array(limit + 1).fill(false);
    const basePrimes = [2, 3, 5].filter((p) => p <= limit);
    basePrimes.forEach((p) => (isPrime[p] = true));

    for (let base = 0; base * this.wheelSize <= limit; base++) {
      for (const offset of this.wheel) {
        const num = base * this.wheelSize + offset;
        if (num > limit) break;
        if (num > 1) isPrime[num] = true;
      }
    }

    for (let i = 2; i * i <= limit; i++) {
      if (isPrime[i]) {
        for (let j = i * i; j <= limit; j += i) {
          isPrime[j] = false;
        }
      }
    }

    return isPrime
      .map((prime, index) => (prime ? index : -1))
      .filter((num) => num > 1);
  }
}
```

### Bit-Optimized Sieve

```typescript
class BitSieve {
  private bits: Uint32Array;
  private limit: number;

  constructor(limit: number) {
    this.limit = limit;
    this.bits = new Uint32Array(Math.ceil(limit / 32));
    this.bits.fill(0xffffffff);
    this.setBit(0, false);
    this.setBit(1, false);
  }

  private setBit(index: number, value: boolean): void {
    const wordIndex = Math.floor(index / 32);
    const bitIndex = index % 32;

    if (value) {
      this.bits[wordIndex] |= 1 << bitIndex;
    } else {
      this.bits[wordIndex] &= ~(1 << bitIndex);
    }
  }

  private getBit(index: number): boolean {
    const wordIndex = Math.floor(index / 32);
    const bitIndex = index % 32;
    return (this.bits[wordIndex] & (1 << bitIndex)) !== 0;
  }

  sieve(): void {
    for (let i = 2; i * i <= this.limit; i++) {
      if (this.getBit(i)) {
        for (let j = i * i; j <= this.limit; j += i) {
          this.setBit(j, false);
        }
      }
    }
  }

  getPrimes(): number[] {
    const primes: number[] = [];
    for (let i = 2; i <= this.limit; i++) {
      if (this.getBit(i)) {
        primes.push(i);
      }
    }
    return primes;
  }

  isPrime(n: number): boolean {
    return n <= this.limit && this.getBit(n);
  }
}
```

## Step-by-Step Example

### Finding all primes up to 30

```
Initial array: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]

Step 1: Start with 2 (first prime)
Mark multiples of 2: 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30
Remaining: [2, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29]

Step 2: Next unmarked is 3
Mark multiples of 3 starting from 3²=9: 9, 15, 21, 27
Remaining: [2, 3, 5, 7, 11, 13, 17, 19, 23, 25, 29]

Step 3: Next unmarked is 5
Mark multiples of 5 starting from 5²=25: 25
Remaining: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]

Step 4: Next unmarked is 7
7² = 49 > 30, so we're done

Final primes: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
```

## Real-World Applications

### Prime Number Generator Service

```typescript
class PrimeService {
  private primeCache = new Map<number, number[]>();
  private sieveCache = new Map<number, boolean[]>();

  generatePrimes(limit: number): number[] {
    if (this.primeCache.has(limit)) {
      return this.primeCache.get(limit)!;
    }

    const primes = sieveOfEratosthenes(limit);
    this.primeCache.set(limit, primes);
    return primes;
  }

  isPrime(n: number): boolean {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;

    const limit = Math.ceil(Math.sqrt(n));
    let sieve = this.sieveCache.get(limit);

    if (!sieve) {
      sieve = optimizedSieve(limit);
      this.sieveCache.set(limit, sieve);
    }

    for (let i = 3; i <= limit; i += 2) {
      if (sieve[i] && n % i === 0) {
        return false;
      }
    }

    return true;
  }

  nextPrime(n: number): number {
    if (n < 2) return 2;

    let candidate = n + 1;
    while (!this.isPrime(candidate)) {
      candidate++;
    }
    return candidate;
  }

  primeFactors(n: number): number[] {
    const factors: number[] = [];
    const primes = this.generatePrimes(Math.floor(Math.sqrt(n)) + 1);

    for (const prime of primes) {
      while (n % prime === 0) {
        factors.push(prime);
        n /= prime;
      }
      if (n === 1) break;
    }

    if (n > 1) factors.push(n);
    return factors;
  }
}
```

### Cryptographic Prime Generation

```typescript
class CryptographicPrimes {
  static generateSafePrimes(bitLength: number): number[] {
    const limit = Math.pow(2, bitLength);
    const primes = sieveOfEratosthenes(Math.floor(limit / 2));
    const safePrimes: number[] = [];

    for (const p of primes) {
      const q = 2 * p + 1;
      if (q < limit && this.isPrimeMillerRabin(q)) {
        safePrimes.push(q);
      }
    }

    return safePrimes;
  }

  static generateTwinPrimes(limit: number): Array<[number, number]> {
    const primes = sieveOfEratosthenes(limit);
    const twinPrimes: Array<[number, number]> = [];

    for (let i = 0; i < primes.length - 1; i++) {
      if (primes[i + 1] - primes[i] === 2) {
        twinPrimes.push([primes[i], primes[i + 1]]);
      }
    }

    return twinPrimes;
  }

  private static isPrimeMillerRabin(n: number, k: number = 5): boolean {
    if (n < 2) return false;
    if (n === 2 || n === 3) return true;
    if (n % 2 === 0) return false;

    let r = 0;
    let d = n - 1;
    while (d % 2 === 0) {
      d /= 2;
      r++;
    }

    for (let i = 0; i < k; i++) {
      const a = 2 + Math.floor(Math.random() * (n - 3));
      let x = this.modPow(a, d, n);

      if (x === 1 || x === n - 1) continue;

      let composite = true;
      for (let j = 0; j < r - 1; j++) {
        x = this.modPow(x, 2, n);
        if (x === n - 1) {
          composite = false;
          break;
        }
      }

      if (composite) return false;
    }

    return true;
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
}
```

### Mathematical Analysis Tools

```typescript
class PrimeAnalysis {
  static primeGaps(limit: number): Map<number, number> {
    const primes = sieveOfEratosthenes(limit);
    const gaps = new Map<number, number>();

    for (let i = 1; i < primes.length; i++) {
      const gap = primes[i] - primes[i - 1];
      gaps.set(gap, (gaps.get(gap) || 0) + 1);
    }

    return gaps;
  }

  static primeCountingFunction(limit: number): number[] {
    const isPrime = optimizedSieve(limit);
    const pi: number[] = [0, 0];

    for (let i = 2; i <= limit; i++) {
      pi[i] = pi[i - 1] + (isPrime[i] ? 1 : 0);
    }

    return pi;
  }

  static estimatePrimeDensity(n: number): {
    actual: number;
    logarithmicEstimate: number;
    error: number;
  } {
    const actualCount = sieveOfEratosthenes(n).length;
    const estimate = n / Math.log(n);
    const error = Math.abs(actualCount - estimate) / actualCount;

    return {
      actual: actualCount,
      logarithmicEstimate: estimate,
      error: error * 100,
    };
  }

  static goldenbachConjecture(
    limit: number
  ): Map<number, Array<[number, number]>> {
    const primes = new Set(sieveOfEratosthenes(limit));
    const representations = new Map<number, Array<[number, number]>>();

    for (let n = 4; n <= limit; n += 2) {
      const pairs: Array<[number, number]> = [];

      for (const p of primes) {
        if (p > n / 2) break;
        if (primes.has(n - p)) {
          pairs.push([p, n - p]);
        }
      }

      representations.set(n, pairs);
    }

    return representations;
  }
}
```

## Performance Benchmarks

### Comparison of Different Sieve Implementations

```typescript
class SieveBenchmark {
  static compareImplementations(limit: number): void {
    const implementations = [
      { name: "Standard Sieve", fn: () => sieveOfEratosthenes(limit) },
      {
        name: "Segmented Sieve",
        fn: () => new SegmentedSieve(limit).sieveRange(2, limit),
      },
      { name: "Wheel Sieve", fn: () => new WheelSieve().sieve(limit) },
      {
        name: "Bit Sieve",
        fn: () => {
          const sieve = new BitSieve(limit);
          sieve.sieve();
          return sieve.getPrimes();
        },
      },
    ];

    implementations.forEach((impl) => {
      const start = performance.now();
      const primes = impl.fn();
      const end = performance.now();

      console.log(
        `${impl.name}: ${primes.length} primes found in ${(end - start).toFixed(
          2
        )}ms`
      );
    });
  }

  static memoryUsageAnalysis(limits: number[]): void {
    limits.forEach((limit) => {
      const standardMemory = (limit + 1) * 1;
      const bitMemory = Math.ceil(limit / 8);
      const segmentedMemory = Math.ceil(Math.sqrt(limit));

      console.log(`Limit ${limit}:`);
      console.log(`  Standard: ${(standardMemory / 1024).toFixed(2)} KB`);
      console.log(`  Bit-optimized: ${(bitMemory / 1024).toFixed(2)} KB`);
      console.log(`  Segmented: ${(segmentedMemory / 1024).toFixed(2)} KB`);
    });
  }
}
```

## Related Algorithms

- **[Fast Exponentiation](./fast-exponentiation.md)**: Used in primality testing
- **[Euclidean Algorithm](./euclidean-algorithm.md)**: GCD calculations with primes
- **[Miller-Rabin Primality Test](./miller-rabin-test.md)**: Probabilistic primality testing
- **[Prime Factorization](./prime-factorization.md)**: Uses sieve-generated primes

## LeetCode Problems

1. **[204. Count Primes](https://leetcode.com/problems/count-primes/)**
2. **[762. Prime Number of Set Bits in Binary Representation](https://leetcode.com/problems/prime-number-of-set-bits-in-binary-representation/)**
3. **[866. Prime Palindrome](https://leetcode.com/problems/prime-palindrome/)**
4. **[952. Largest Component Size by Common Factor](https://leetcode.com/problems/largest-component-size-by-common-factor/)**
5. **[1175. Prime Arrangements](https://leetcode.com/problems/prime-arrangements/)**

## Implementation Challenges

### Challenge 1: Distributed Sieve

```typescript
class DistributedSieve {
  static async distributedSieve(
    limit: number,
    workers: number
  ): Promise<number[]> {
    const chunkSize = Math.ceil(limit / workers);
    const promises: Promise<number[]>[] = [];

    for (let i = 0; i < workers; i++) {
      const start = i * chunkSize + 2;
      const end = Math.min((i + 1) * chunkSize + 1, limit);

      if (start <= end) {
        promises.push(this.sieveChunk(start, end, limit));
      }
    }

    const chunks = await Promise.all(promises);
    return chunks.flat().sort((a, b) => a - b);
  }

  private static async sieveChunk(
    start: number,
    end: number,
    limit: number
  ): Promise<number[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const segmentedSieve = new SegmentedSieve(limit);
        resolve(segmentedSieve.sieveRange(start, end));
      }, 0);
    });
  }
}
```

### Challenge 2: Dynamic Sieve Extension

```typescript
class DynamicSieve {
  private currentLimit: number = 0;
  private isPrime: boolean[] = [];
  private primes: number[] = [];

  extendTo(newLimit: number): void {
    if (newLimit <= this.currentLimit) return;

    const oldLimit = this.currentLimit;
    this.currentLimit = newLimit;

    if (oldLimit === 0) {
      this.isPrime = optimizedSieve(newLimit);
      this.primes = getPrimesFromSieve(this.isPrime);
      return;
    }

    const newArray = new Array(newLimit + 1).fill(true);
    for (let i = 0; i <= oldLimit; i++) {
      newArray[i] = this.isPrime[i];
    }

    for (const prime of this.primes) {
      const start = Math.max(
        prime * prime,
        Math.ceil((oldLimit + 1) / prime) * prime
      );
      for (let j = start; j <= newLimit; j += prime) {
        newArray[j] = false;
      }
    }

    for (let i = Math.max(2, oldLimit + 1); i * i <= newLimit; i++) {
      if (newArray[i]) {
        for (let j = i * i; j <= newLimit; j += i) {
          newArray[j] = false;
        }
      }
    }

    this.isPrime = newArray;

    for (let i = oldLimit + 1; i <= newLimit; i++) {
      if (this.isPrime[i]) {
        this.primes.push(i);
      }
    }
  }

  getPrimes(): number[] {
    return [...this.primes];
  }

  checkPrime(n: number): boolean {
    if (n > this.currentLimit) {
      this.extendTo(Math.max(n, this.currentLimit * 2));
    }
    return n >= 2 && this.isPrime[n];
  }
}
```

The Sieve of Eratosthenes remains one of the most elegant and efficient algorithms for prime generation, with numerous optimizations and applications in modern computing, from cryptography to mathematical research. Its simplicity combined with its effectiveness makes it an essential tool in any programmer's algorithmic toolkit.
