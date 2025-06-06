# Rabin-Karp Algorithm

**Rabin-Karp Algorithm** is a string pattern matching algorithm that uses **rolling hash** technique to efficiently find patterns in text. It achieves average-case **O(n + m)** time complexity by comparing hash values instead of characters directly, making it particularly effective for multiple pattern searches.

The algorithm's key innovation is the rolling hash function that allows computing the hash of each substring in constant time after the initial hash computation.

## Key Concepts

- **Rolling Hash**: Efficiently compute hash of sliding window in O(1) time
- **Hash Comparison**: Compare hash values before character-by-character comparison
- **Collision Handling**: Verify matches when hash values are equal
- **Multiple Patterns**: Natural extension to search multiple patterns simultaneously
- **Polynomial Rolling Hash**: Most common implementation using polynomial hash function

## Time and Space Complexity

| Operation         | Time Complexity | Space Complexity |
| ----------------- | --------------- | ---------------- |
| Preprocessing     | O(m)            | O(1)             |
| Best/Average Case | O(n + m)        | O(1)             |
| Worst Case        | O(nm)           | O(1)             |
| Multiple Patterns | O(n + km)       | O(k)             |

**n** = length of text, **m** = length of pattern, **k** = number of patterns

## Rolling Hash Function

The polynomial rolling hash is computed as:

```
hash(s) = (s[0] * base^(m-1) + s[1] * base^(m-2) + ... + s[m-1] * base^0) mod prime
```

For rolling: `hash(s[1..m]) = ((hash(s[0..m-1]) - s[0] * base^(m-1)) * base + s[m]) mod prime`

## Implementation

### Basic Rabin-Karp Algorithm

```typescript
class RabinKarp {
  private readonly BASE = 256;
  private readonly PRIME = 101;

  search(text: string, pattern: string): number[] {
    const matches: number[] = [];
    const n = text.length;
    const m = pattern.length;

    if (m > n) return matches;

    let patternHash = 0;
    let textHash = 0;
    let highestPower = 1;

    for (let i = 0; i < m - 1; i++) {
      highestPower = (highestPower * this.BASE) % this.PRIME;
    }

    for (let i = 0; i < m; i++) {
      patternHash =
        (this.BASE * patternHash + pattern.charCodeAt(i)) % this.PRIME;
      textHash = (this.BASE * textHash + text.charCodeAt(i)) % this.PRIME;
    }

    for (let i = 0; i <= n - m; i++) {
      if (patternHash === textHash && this.isMatch(text, pattern, i)) {
        matches.push(i);
      }

      if (i < n - m) {
        textHash =
          (this.BASE * (textHash - text.charCodeAt(i) * highestPower) +
            text.charCodeAt(i + m)) %
          this.PRIME;

        if (textHash < 0) {
          textHash += this.PRIME;
        }
      }
    }

    return matches;
  }

  private isMatch(text: string, pattern: string, start: number): boolean {
    for (let i = 0; i < pattern.length; i++) {
      if (text[start + i] !== pattern[i]) {
        return false;
      }
    }
    return true;
  }
}
```

### Advanced Rabin-Karp with Double Hashing

```typescript
class DoubleHashRabinKarp {
  private readonly BASE1 = 256;
  private readonly BASE2 = 257;
  private readonly PRIME1 = 1000000007;
  private readonly PRIME2 = 1000000009;

  search(text: string, pattern: string): number[] {
    const matches: number[] = [];
    const n = text.length;
    const m = pattern.length;

    if (m > n) return matches;

    const [patternHash1, patternHash2] = this.computePatternHash(pattern);
    let [textHash1, textHash2] = this.computeInitialTextHash(text, m);

    const power1 = this.modPow(this.BASE1, m - 1, this.PRIME1);
    const power2 = this.modPow(this.BASE2, m - 1, this.PRIME2);

    for (let i = 0; i <= n - m; i++) {
      if (patternHash1 === textHash1 && patternHash2 === textHash2) {
        if (this.isMatch(text, pattern, i)) {
          matches.push(i);
        }
      }

      if (i < n - m) {
        [textHash1, textHash2] = this.rollHash(
          text,
          i,
          m,
          textHash1,
          textHash2,
          power1,
          power2
        );
      }
    }

    return matches;
  }

  private computePatternHash(pattern: string): [number, number] {
    let hash1 = 0,
      hash2 = 0;

    for (let i = 0; i < pattern.length; i++) {
      const char = pattern.charCodeAt(i);
      hash1 = (this.BASE1 * hash1 + char) % this.PRIME1;
      hash2 = (this.BASE2 * hash2 + char) % this.PRIME2;
    }

    return [hash1, hash2];
  }

  private computeInitialTextHash(text: string, m: number): [number, number] {
    let hash1 = 0,
      hash2 = 0;

    for (let i = 0; i < m; i++) {
      const char = text.charCodeAt(i);
      hash1 = (this.BASE1 * hash1 + char) % this.PRIME1;
      hash2 = (this.BASE2 * hash2 + char) % this.PRIME2;
    }

    return [hash1, hash2];
  }

  private rollHash(
    text: string,
    i: number,
    m: number,
    hash1: number,
    hash2: number,
    power1: number,
    power2: number
  ): [number, number] {
    const oldChar = text.charCodeAt(i);
    const newChar = text.charCodeAt(i + m);

    hash1 = (this.BASE1 * (hash1 - oldChar * power1) + newChar) % this.PRIME1;
    hash2 = (this.BASE2 * (hash2 - oldChar * power2) + newChar) % this.PRIME2;

    if (hash1 < 0) hash1 += this.PRIME1;
    if (hash2 < 0) hash2 += this.PRIME2;

    return [hash1, hash2];
  }

  private modPow(base: number, exp: number, mod: number): number {
    let result = 1;
    base %= mod;

    while (exp > 0) {
      if (exp % 2 === 1) {
        result = (result * base) % mod;
      }
      exp = Math.floor(exp / 2);
      base = (base * base) % mod;
    }

    return result;
  }

  private isMatch(text: string, pattern: string, start: number): boolean {
    for (let i = 0; i < pattern.length; i++) {
      if (text[start + i] !== pattern[i]) {
        return false;
      }
    }
    return true;
  }
}
```

### Multiple Pattern Search

```typescript
class MultiPatternRabinKarp {
  private readonly BASE = 256;
  private readonly PRIME = 1000000007;
  private patterns: string[];
  private patternHashes: Map<number, string[]>;

  constructor(patterns: string[]) {
    this.patterns = patterns;
    this.patternHashes = new Map();
    this.preprocessPatterns();
  }

  private preprocessPatterns(): void {
    this.patterns.forEach((pattern) => {
      const hash = this.computeHash(pattern);

      if (!this.patternHashes.has(hash)) {
        this.patternHashes.set(hash, []);
      }

      this.patternHashes.get(hash)!.push(pattern);
    });
  }

  searchAll(text: string): Map<string, number[]> {
    const results = new Map<string, number[]>();

    this.patterns.forEach((pattern) => {
      results.set(pattern, []);
    });

    const uniqueLengths = [...new Set(this.patterns.map((p) => p.length))];

    uniqueLengths.forEach((length) => {
      this.searchByLength(text, length, results);
    });

    return results;
  }

  private searchByLength(
    text: string,
    m: number,
    results: Map<string, number[]>
  ): void {
    const n = text.length;
    if (m > n) return;

    let textHash = 0;
    let power = 1;

    for (let i = 0; i < m - 1; i++) {
      power = (power * this.BASE) % this.PRIME;
    }

    for (let i = 0; i < m; i++) {
      textHash = (this.BASE * textHash + text.charCodeAt(i)) % this.PRIME;
    }

    for (let i = 0; i <= n - m; i++) {
      if (this.patternHashes.has(textHash)) {
        const candidatePatterns = this.patternHashes.get(textHash)!;

        candidatePatterns.forEach((pattern) => {
          if (pattern.length === m && this.isMatch(text, pattern, i)) {
            results.get(pattern)!.push(i);
          }
        });
      }

      if (i < n - m) {
        textHash =
          (this.BASE * (textHash - text.charCodeAt(i) * power) +
            text.charCodeAt(i + m)) %
          this.PRIME;

        if (textHash < 0) {
          textHash += this.PRIME;
        }
      }
    }
  }

  private computeHash(str: string): number {
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
      hash = (this.BASE * hash + str.charCodeAt(i)) % this.PRIME;
    }

    return hash;
  }

  private isMatch(text: string, pattern: string, start: number): boolean {
    for (let i = 0; i < pattern.length; i++) {
      if (text[start + i] !== pattern[i]) {
        return false;
      }
    }
    return true;
  }
}
```

## Step-by-Step Example

Let's trace through searching for pattern "ABC" in text "XYZABCPQR":

### Pattern: "ABC", Text: "XYZABCPQR"

**Hash Calculation (BASE=256, PRIME=101):**

- Pattern hash: (65*256² + 66*256¹ + 67\*256⁰) mod 101 = 33
- Initial text hash: (88*256² + 89*256¹ + 90\*256⁰) mod 101 = 82

```
Position 0: XYZ vs ABC
Text hash: 82, Pattern hash: 33 → No match, roll hash

Position 1: YZA vs ABC
Text hash: 91, Pattern hash: 33 → No match, roll hash

Position 2: ZAB vs ABC
Text hash: 23, Pattern hash: 33 → No match, roll hash

Position 3: ABC vs ABC
Text hash: 33, Pattern hash: 33 → Hash match! Verify characters → MATCH!
```

**Rolling Hash Calculation:**
From position i to i+1: `new_hash = (old_hash - text[i]*power)*BASE + text[i+m]) mod PRIME`

## Advanced Applications

### 1. Plagiarism Detection

```typescript
class PlagiarismDetector {
  private rabinKarp: MultiPatternRabinKarp;

  constructor(private knownTexts: string[], private windowSize: number = 50) {
    const patterns = this.extractPatterns(knownTexts);
    this.rabinKarp = new MultiPatternRabinKarp(patterns);
  }

  private extractPatterns(texts: string[]): string[] {
    const patterns: string[] = [];

    texts.forEach((text) => {
      for (let i = 0; i <= text.length - this.windowSize; i++) {
        patterns.push(text.substring(i, i + this.windowSize));
      }
    });

    return patterns;
  }

  detectPlagiarism(
    document: string
  ): Array<{ start: number; length: number; similarity: number }> {
    const matches = this.rabinKarp.searchAll(document);
    const results: Array<{
      start: number;
      length: number;
      similarity: number;
    }> = [];

    matches.forEach((positions, pattern) => {
      positions.forEach((pos) => {
        results.push({
          start: pos,
          length: pattern.length,
          similarity: this.calculateSimilarity(
            pattern,
            document.substring(pos, pos + pattern.length)
          ),
        });
      });
    });

    return results.sort((a, b) => b.similarity - a.similarity);
  }

  private calculateSimilarity(text1: string, text2: string): number {
    let matches = 0;
    const length = Math.min(text1.length, text2.length);

    for (let i = 0; i < length; i++) {
      if (text1[i] === text2[i]) matches++;
    }

    return matches / length;
  }
}
```

### 2. DNA Sequence Analysis

```typescript
class DNAAnalyzer {
  private readonly NUCLEOTIDES = new Map([
    ["A", 0],
    ["T", 1],
    ["G", 2],
    ["C", 3],
  ]);

  findRepeatedSequences(dna: string, length: number): Map<string, number[]> {
    const sequenceMap = new Map<number, string>();
    const hashPositions = new Map<number, number[]>();
    const rabinKarp = new RabinKarp();

    for (let i = 0; i <= dna.length - length; i++) {
      const sequence = dna.substring(i, i + length);
      const hash = this.computeDNAHash(sequence);

      if (!hashPositions.has(hash)) {
        hashPositions.set(hash, []);
        sequenceMap.set(hash, sequence);
      }

      hashPositions.get(hash)!.push(i);
    }

    const results = new Map<string, number[]>();

    hashPositions.forEach((positions, hash) => {
      if (positions.length > 1) {
        const sequence = sequenceMap.get(hash)!;
        results.set(sequence, positions);
      }
    });

    return results;
  }

  private computeDNAHash(sequence: string): number {
    let hash = 0;
    const base = 4;

    for (let i = 0; i < sequence.length; i++) {
      const nucleotide = this.NUCLEOTIDES.get(sequence[i]) ?? 0;
      hash = hash * base + nucleotide;
    }

    return hash;
  }

  findMutations(
    reference: string,
    sample: string,
    windowSize: number
  ): number[] {
    const mutations: number[] = [];

    for (let i = 0; i <= reference.length - windowSize; i++) {
      const refWindow = reference.substring(i, i + windowSize);
      const positions = new RabinKarp().search(sample, refWindow);

      if (positions.length === 0) {
        mutations.push(i);
      }
    }

    return mutations;
  }
}
```

### 3. Network Pattern Matching

```typescript
class NetworkMonitor {
  private maliciousPatterns: MultiPatternRabinKarp;

  constructor(signatures: string[]) {
    this.maliciousPatterns = new MultiPatternRabinKarp(signatures);
  }

  analyzeTraffic(
    packets: string[]
  ): Array<{ packetIndex: number; threats: string[]; positions: number[] }> {
    const results: Array<{
      packetIndex: number;
      threats: string[];
      positions: number[];
    }> = [];

    packets.forEach((packet, index) => {
      const matches = this.maliciousPatterns.searchAll(packet);
      const threats: string[] = [];
      const positions: number[] = [];

      matches.forEach((pos, pattern) => {
        if (pos.length > 0) {
          threats.push(pattern);
          positions.push(...pos);
        }
      });

      if (threats.length > 0) {
        results.push({
          packetIndex: index,
          threats: [...new Set(threats)],
          positions: positions.sort((a, b) => a - b),
        });
      }
    });

    return results;
  }
}
```

## Performance Optimization Techniques

### 1. Hash Function Selection

```typescript
class OptimizedRabinKarp {
  private static readonly GOOD_PRIMES = [
    1000000007, 1000000009, 1000000021, 1000000033,
  ];

  private static readonly GOOD_BASES = [256, 257, 263, 269];

  static chooseBestParams(
    text: string,
    pattern: string
  ): { base: number; prime: number } {
    let bestBase = this.GOOD_BASES[0];
    let bestPrime = this.GOOD_PRIMES[0];
    let minCollisions = Infinity;

    for (const base of this.GOOD_BASES) {
      for (const prime of this.GOOD_PRIMES) {
        const collisions = this.countCollisions(text, pattern, base, prime);
        if (collisions < minCollisions) {
          minCollisions = collisions;
          bestBase = base;
          bestPrime = prime;
        }
      }
    }

    return { base: bestBase, prime: bestPrime };
  }

  private static countCollisions(
    text: string,
    pattern: string,
    base: number,
    prime: number
  ): number {
    const patternHash = this.computeHash(pattern, base, prime);
    let collisions = 0;

    for (let i = 0; i <= text.length - pattern.length; i++) {
      const substring = text.substring(i, i + pattern.length);
      if (
        this.computeHash(substring, base, prime) === patternHash &&
        substring !== pattern
      ) {
        collisions++;
      }
    }

    return collisions;
  }

  private static computeHash(str: string, base: number, prime: number): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * base + str.charCodeAt(i)) % prime;
    }
    return hash;
  }
}
```

## Comparison with Other String Matching Algorithms

### Performance Comparison

| Algorithm   | Preprocessing | Best Case | Average Case | Worst Case | Multiple Patterns |
| ----------- | ------------- | --------- | ------------ | ---------- | ----------------- |
| Rabin-Karp  | O(m)          | O(n)      | O(n + m)     | O(nm)      | Excellent         |
| KMP         | O(m)          | O(n)      | O(n + m)     | O(n + m)   | Poor              |
| Boyer-Moore | O(m + σ)      | O(n/m)    | O(n)         | O(nm)      | Poor              |
| Naive       | O(1)          | O(n)      | O(nm)        | O(nm)      | Poor              |

### When to Use Rabin-Karp

**✅ Good for:**

- Multiple pattern search
- Patterns with high expected collision rate
- 2D pattern matching
- Rolling hash applications
- Network security (signature matching)

**❌ Avoid when:**

- Single pattern search with guaranteed linear time needed
- Very short patterns
- Memory is extremely limited
- Hash collisions are unacceptable

## Practice Problems

### LeetCode Problems

1. **[28. Implement strStr()](https://leetcode.com/problems/implement-strstr/)** - Basic implementation
2. **[187. Repeated DNA Sequences](https://leetcode.com/problems/repeated-dna-sequences/)** - Rolling hash application
3. **[1044. Longest Duplicate Substring](https://leetcode.com/problems/longest-duplicate-substring/)** - Advanced rolling hash
4. **[1392. Longest Happy Prefix](https://leetcode.com/problems/longest-happy-prefix/)** - Pattern analysis

### Advanced Challenges

1. **2D Pattern Matching**: Extend Rabin-Karp to 2D grids
2. **Fuzzy String Matching**: Allow mismatches with rolling hash
3. **Circular String Matching**: Pattern matching in circular strings
4. **Real-time Stream Processing**: Process streaming data with rolling hash

## Key Insights for Interviews

1. **Hash Collision Handling**: Always verify matches after hash comparison
2. **Rolling Hash Technique**: Key innovation that enables O(1) hash updates
3. **Multiple Pattern Advantage**: Natural extension for searching multiple patterns
4. **Prime Number Selection**: Choose large primes to minimize collisions
5. **Practical Applications**: Widely used in real-world systems (Git, antivirus, etc.)

## Related Algorithms

- **[KMP Algorithm](./kmp-algorithm.md)** - Guaranteed linear time
- **[Boyer-Moore Algorithm](./boyer-moore-algorithm.md)** - Right-to-left scanning
- **[Aho-Corasick Algorithm](./aho-corasick-algorithm.md)** - Multiple pattern matching
- **[Z Algorithm](./z-algorithm.md)** - Linear pattern matching

The Rabin-Karp algorithm demonstrates the power of hashing in algorithm design, providing an elegant solution that balances simplicity with practical effectiveness, especially for multiple pattern matching scenarios.
