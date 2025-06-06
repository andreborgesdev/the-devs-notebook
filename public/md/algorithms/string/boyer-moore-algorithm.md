# Boyer-Moore String Matching Algorithm

**Boyer-Moore Algorithm** is an efficient string pattern matching algorithm that searches for occurrences of a pattern within a text by comparing characters from right to left. It achieves excellent average-case performance through two key heuristics that allow skipping large portions of the text.

The algorithm preprocesses the pattern to create lookup tables that enable intelligent character skipping when mismatches occur, often achieving **sublinear time complexity** in practice.

## Key Concepts

- **Right-to-Left Comparison**: Match pattern from right to left
- **Bad Character Heuristic**: Skip based on mismatched character in text
- **Good Suffix Heuristic**: Skip based on matched suffix pattern
- **Preprocessing Phase**: Build lookup tables for both heuristics
- **Sublinear Performance**: Can skip multiple characters at once

## Time and Space Complexity

| Operation     | Time Complexity | Space Complexity |
| ------------- | --------------- | ---------------- |
| Preprocessing | O(m + σ)        | O(m + σ)         |
| Best Case     | O(n/m)          | O(m + σ)         |
| Average Case  | O(n)            | O(m + σ)         |
| Worst Case    | O(nm)           | O(m + σ)         |

**n** = length of text, **m** = length of pattern, **σ** = alphabet size

## Algorithm Components

### 1. Bad Character Heuristic

When a mismatch occurs, skip the pattern based on the rightmost occurrence of the mismatched character in the pattern.

### 2. Good Suffix Heuristic

When a mismatch occurs after matching a suffix, skip based on:

- Previous occurrence of the matched suffix in the pattern
- Longest prefix that matches a suffix of the matched part

## Implementation

### Basic Boyer-Moore Algorithm

```typescript
class BoyerMoore {
  private pattern: string;
  private patternLength: number;
  private badCharTable: Map<string, number>;
  private goodSuffixTable: number[];

  constructor(pattern: string) {
    this.pattern = pattern;
    this.patternLength = pattern.length;
    this.badCharTable = new Map();
    this.goodSuffixTable = new Array(pattern.length);

    this.buildBadCharacterTable();
    this.buildGoodSuffixTable();
  }

  private buildBadCharacterTable(): void {
    for (let i = 0; i < this.patternLength; i++) {
      this.badCharTable.set(this.pattern[i], i);
    }
  }

  private buildGoodSuffixTable(): void {
    const borderArray = new Array(this.patternLength);
    this.computeBorderArray(borderArray);

    for (let i = 0; i < this.patternLength; i++) {
      this.goodSuffixTable[i] = this.patternLength;
    }

    let j = 0;
    for (let i = this.patternLength - 1; i >= 0; i--) {
      if (borderArray[i] === i + 1) {
        for (; j < this.patternLength - 1 - i; j++) {
          if (this.goodSuffixTable[j] === this.patternLength) {
            this.goodSuffixTable[j] = this.patternLength - 1 - i;
          }
        }
      }
    }

    for (let i = 0; i <= this.patternLength - 2; i++) {
      this.goodSuffixTable[this.patternLength - 1 - borderArray[i]] =
        this.patternLength - 1 - i;
    }
  }

  private computeBorderArray(borderArray: number[]): void {
    const reversed = this.pattern.split("").reverse().join("");
    borderArray[0] = 0;

    for (let i = 1; i < this.patternLength; i++) {
      let j = borderArray[i - 1];

      while (j > 0 && reversed[i] !== reversed[j]) {
        j = borderArray[j - 1];
      }

      if (reversed[i] === reversed[j]) {
        j++;
      }

      borderArray[i] = j;
    }
  }

  search(text: string): number[] {
    const matches: number[] = [];
    const textLength = text.length;
    let shift = 0;

    while (shift <= textLength - this.patternLength) {
      let j = this.patternLength - 1;

      while (j >= 0 && this.pattern[j] === text[shift + j]) {
        j--;
      }

      if (j < 0) {
        matches.push(shift);
        shift += this.goodSuffixTable[0];
      } else {
        const badCharShift = Math.max(
          1,
          j - (this.badCharTable.get(text[shift + j]) ?? -1)
        );
        const goodSuffixShift = this.goodSuffixTable[j];

        shift += Math.max(badCharShift, goodSuffixShift);
      }
    }

    return matches;
  }
}
```

### Simplified Boyer-Moore (Bad Character Only)

```typescript
function boyerMooreSimple(text: string, pattern: string): number[] {
  const matches: number[] = [];
  const n = text.length;
  const m = pattern.length;

  const badChar = buildBadCharTable(pattern);

  let shift = 0;
  while (shift <= n - m) {
    let j = m - 1;

    while (j >= 0 && pattern[j] === text[shift + j]) {
      j--;
    }

    if (j < 0) {
      matches.push(shift);
      shift += m;
    } else {
      const lastOccurrence = badChar.get(text[shift + j]) ?? -1;
      shift += Math.max(1, j - lastOccurrence);
    }
  }

  return matches;
}

function buildBadCharTable(pattern: string): Map<string, number> {
  const badChar = new Map<string, number>();

  for (let i = 0; i < pattern.length; i++) {
    badChar.set(pattern[i], i);
  }

  return badChar;
}
```

## Step-by-Step Example

Let's trace through searching for pattern "ABAA" in text "ABAAABCDABCDABDE":

### Pattern: "ABAA", Text: "ABAAABCDABCDABDE"

```
Initial alignment:
Text:    A B A A A B C D A B C D A B D E
Pattern: A B A A
         ↑ ↑ ↑ ↑
Compare from right to left: A=A, A=A, B=A (mismatch)
```

**Step 1**: Mismatch at position 2 (B vs A)

- Bad character: 'A' last occurs at position 3 in pattern
- Shift = max(1, 2 - 3) = max(1, -1) = 1

**Step 2**: New alignment at position 1

```
Text:    A B A A A B C D A B C D A B D E
Pattern:   A B A A
           ↑ ↑ ↑ ↑
```

**Step 3**: Match found at position 1, continue search...

## Advanced Variations

### Horspool Algorithm (Simplified Boyer-Moore)

```typescript
function horspool(text: string, pattern: string): number[] {
  const matches: number[] = [];
  const n = text.length;
  const m = pattern.length;

  const shift = new Array(256).fill(m);

  for (let i = 0; i < m - 1; i++) {
    shift[pattern.charCodeAt(i)] = m - 1 - i;
  }

  let pos = 0;
  while (pos <= n - m) {
    let j = m - 1;

    while (j >= 0 && pattern[j] === text[pos + j]) {
      j--;
    }

    if (j < 0) {
      matches.push(pos);
    }

    pos += shift[text.charCodeAt(pos + m - 1)];
  }

  return matches;
}
```

### Boyer-Moore with Sunday Optimization

```typescript
function boyerMooreSunday(text: string, pattern: string): number[] {
  const matches: number[] = [];
  const n = text.length;
  const m = pattern.length;

  const shift = new Map<string, number>();

  for (let i = 0; i < m; i++) {
    shift.set(pattern[i], m - i);
  }

  let pos = 0;
  while (pos <= n - m) {
    let j = 0;

    while (j < m && pattern[j] === text[pos + j]) {
      j++;
    }

    if (j === m) {
      matches.push(pos);
    }

    if (pos + m < n) {
      const nextChar = text[pos + m];
      pos += shift.get(nextChar) ?? m + 1;
    } else {
      break;
    }
  }

  return matches;
}
```

## Use Cases and Applications

### 1. Text Editors and IDEs

```typescript
class TextSearchEngine {
  private boyerMoore: BoyerMoore;

  constructor(private searchTerm: string) {
    this.boyerMoore = new BoyerMoore(searchTerm);
  }

  findAllOccurrences(
    document: string
  ): Array<{ line: number; column: number }> {
    const positions = this.boyerMoore.search(document);
    const results: Array<{ line: number; column: number }> = [];

    positions.forEach((pos) => {
      const beforeText = document.substring(0, pos);
      const line = beforeText.split("\n").length;
      const column = pos - beforeText.lastIndexOf("\n");
      results.push({ line, column });
    });

    return results;
  }
}
```

### 2. Network Intrusion Detection

```typescript
class PatternMatcher {
  private patterns: Map<string, BoyerMoore>;

  constructor(signatures: string[]) {
    this.patterns = new Map();
    signatures.forEach((sig) => {
      this.patterns.set(sig, new BoyerMoore(sig));
    });
  }

  detectThreats(networkPacket: string): string[] {
    const threats: string[] = [];

    this.patterns.forEach((matcher, signature) => {
      if (matcher.search(networkPacket).length > 0) {
        threats.push(signature);
      }
    });

    return threats;
  }
}
```

### 3. DNA Sequence Analysis

```typescript
function findGeneMutations(dnaSequence: string, targetGene: string): number[] {
  const boyerMoore = new BoyerMoore(targetGene);
  return boyerMoore.search(dnaSequence);
}

function findAllVariants(
  dnaSequence: string,
  geneFamily: string[]
): Map<string, number[]> {
  const results = new Map<string, number[]>();

  geneFamily.forEach((gene) => {
    const positions = findGeneMutations(dnaSequence, gene);
    if (positions.length > 0) {
      results.set(gene, positions);
    }
  });

  return results;
}
```

## Performance Characteristics

### Best Case Scenario

- **Time**: O(n/m) - when pattern doesn't appear in text
- **Condition**: Large alphabet, long pattern, no matches

### Worst Case Scenario

- **Time**: O(nm) - when every character matches until the last
- **Condition**: Small alphabet, repetitive pattern and text

### Practical Performance

- Excellent for large alphabets (English text, DNA sequences)
- Superior to KMP for longer patterns
- Particularly effective when pattern is unlikely to occur

## Comparison with Other Algorithms

| Algorithm   | Preprocessing | Best Case | Average Case | Worst Case | Space    |
| ----------- | ------------- | --------- | ------------ | ---------- | -------- |
| Boyer-Moore | O(m + σ)      | O(n/m)    | O(n)         | O(nm)      | O(m + σ) |
| KMP         | O(m)          | O(n)      | O(n)         | O(n)       | O(m)     |
| Rabin-Karp  | O(m)          | O(n)      | O(n)         | O(nm)      | O(1)     |
| Naive       | O(1)          | O(n)      | O(nm)        | O(nm)      | O(1)     |

## Practice Problems

### LeetCode Problems

1. **[28. Implement strStr()](https://leetcode.com/problems/implement-strstr/)** - Basic pattern matching
2. **[214. Shortest Palindrome](https://leetcode.com/problems/shortest-palindrome/)** - Advanced string manipulation
3. **[459. Repeated Substring Pattern](https://leetcode.com/problems/repeated-substring-pattern/)** - Pattern analysis

### Implementation Challenges

1. **Multiple Pattern Search**: Extend Boyer-Moore for multiple patterns
2. **Case-Insensitive Search**: Modify for case-insensitive matching
3. **Wildcard Pattern Matching**: Support for wildcard characters
4. **Approximate String Matching**: Allow for character substitutions

## Key Insights for Interviews

1. **When to Use**: Boyer-Moore excels with long patterns and large alphabets
2. **Space-Time Tradeoff**: Uses more space for preprocessing but gains in search speed
3. **Practical Applications**: Most text editors use Boyer-Moore variants
4. **Implementation Complexity**: Full implementation is complex; simplified version often sufficient
5. **Character Set Matters**: Performance heavily depends on alphabet size

## Related Algorithms

- **[KMP Algorithm](./kmp-algorithm.md)** - Linear time guaranteed
- **[Rabin-Karp](./rabin-karp-algorithm.md)** - Rolling hash approach
- **[Aho-Corasick](./aho-corasick-algorithm.md)** - Multiple pattern matching
- **[Z Algorithm](./z-algorithm.md)** - Linear time pattern matching

The Boyer-Moore algorithm represents a perfect example of how intelligent preprocessing can dramatically improve average-case performance, making it the algorithm of choice for many real-world text search applications.
