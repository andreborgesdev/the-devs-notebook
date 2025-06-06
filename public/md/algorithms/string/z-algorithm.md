# Z Algorithm

**Z Algorithm** is a linear-time string matching algorithm that computes the **Z array** for a given string. The Z array contains, for each position i, the length of the longest substring starting from position i that is also a prefix of the string. This powerful preprocessing enables efficient pattern matching and various string analysis tasks.

The algorithm achieves **O(n)** time complexity through clever use of previously computed information, avoiding redundant character comparisons.

## Key Concepts

- **Z Array (Z Function)**: Z[i] = length of longest substring starting at i that matches prefix
- **Z Box**: Rightmost segment [L, R] where string matches prefix
- **Linear Time**: Each character is examined at most twice
- **No Preprocessing**: Direct computation during single pass
- **Versatile Applications**: Pattern matching, palindromes, periodicity

## Time and Space Complexity

| Operation           | Time Complexity | Space Complexity |
| ------------------- | --------------- | ---------------- |
| Z Array Computation | O(n)            | O(n)             |
| Pattern Matching    | O(n + m)        | O(n + m)         |
| Multiple Queries    | O(1) per query  | O(n)             |

**n** = length of string, **m** = length of pattern

## Z Array Definition

For string S of length n:

- **Z[0]** is undefined (or set to n by convention)
- **Z[i]** = maximum k such that S[0...k-1] = S[i...i+k-1]
- **Z[i]** = 0 if S[0] ≠ S[i]

## Algorithm Visualization

For string "AABAAABA":

```
Index:  0 1 2 3 4 5 6 7
String: A A B A A A B A
Z Array:8 1 0 2 3 1 0 1
```

**Explanation:**

- Z[0] = 8 (entire string)
- Z[1] = 1 ("A" matches prefix "A")
- Z[2] = 0 ("B" doesn't match prefix "A")
- Z[3] = 2 ("AA" matches prefix "AA")
- Z[4] = 3 ("AAA" matches prefix "AAA", but not "AAAB")

## Implementation

### Basic Z Algorithm

```typescript
function computeZArray(str: string): number[] {
  const n = str.length;
  const z = new Array(n).fill(0);

  let l = 0,
    r = 0;

  for (let i = 1; i < n; i++) {
    if (i <= r) {
      z[i] = Math.min(r - i + 1, z[i - l]);
    }

    while (i + z[i] < n && str[z[i]] === str[i + z[i]]) {
      z[i]++;
    }

    if (i + z[i] - 1 > r) {
      l = i;
      r = i + z[i] - 1;
    }
  }

  z[0] = n;
  return z;
}
```

### Z Algorithm for Pattern Matching

```typescript
class ZPatternMatcher {
  search(text: string, pattern: string): number[] {
    const matches: number[] = [];
    const combined = pattern + "$" + text;
    const z = this.computeZArray(combined);

    const patternLength = pattern.length;

    for (let i = patternLength + 1; i < combined.length; i++) {
      if (z[i] === patternLength) {
        matches.push(i - patternLength - 1);
      }
    }

    return matches;
  }

  private computeZArray(str: string): number[] {
    const n = str.length;
    const z = new Array(n).fill(0);

    let l = 0,
      r = 0;

    for (let i = 1; i < n; i++) {
      if (i <= r) {
        z[i] = Math.min(r - i + 1, z[i - l]);
      }

      while (i + z[i] < n && str[z[i]] === str[i + z[i]]) {
        z[i]++;
      }

      if (i + z[i] - 1 > r) {
        l = i;
        r = i + z[i] - 1;
      }
    }

    return z;
  }
}
```

### Advanced Z Algorithm with Multiple Patterns

```typescript
class MultiPatternZMatcher {
  private patterns: string[];
  private combinedString: string;
  private patternInfo: Array<{ pattern: string; start: number; end: number }>;

  constructor(patterns: string[]) {
    this.patterns = patterns;
    this.patternInfo = [];
    this.buildCombinedString();
  }

  private buildCombinedString(): void {
    const separators = ["$", "#", "%", "&", "@"];
    let combined = "";
    let currentPos = 0;

    this.patterns.forEach((pattern, index) => {
      const separator = separators[index % separators.length];

      this.patternInfo.push({
        pattern,
        start: currentPos,
        end: currentPos + pattern.length - 1,
      });

      combined += pattern + separator;
      currentPos += pattern.length + 1;
    });

    this.combinedString = combined;
  }

  searchAll(text: string): Map<string, number[]> {
    const results = new Map<string, number[]>();

    this.patterns.forEach((pattern) => {
      results.set(pattern, []);
    });

    const fullString = this.combinedString + text;
    const z = this.computeZArray(fullString);
    const textStart = this.combinedString.length;

    for (let i = textStart; i < fullString.length; i++) {
      this.patternInfo.forEach(({ pattern, start, end }) => {
        const patternLength = end - start + 1;
        const relativePos =
          (i - textStart + start) % this.combinedString.length;

        if (
          z[i] >= patternLength &&
          this.isPatternMatch(fullString, i, pattern, start)
        ) {
          results.get(pattern)!.push(i - textStart);
        }
      });
    }

    return results;
  }

  private isPatternMatch(
    str: string,
    pos: number,
    pattern: string,
    patternStart: number
  ): boolean {
    for (let i = 0; i < pattern.length; i++) {
      if (str[pos + i] !== str[patternStart + i]) {
        return false;
      }
    }
    return true;
  }

  private computeZArray(str: string): number[] {
    const n = str.length;
    const z = new Array(n).fill(0);

    let l = 0,
      r = 0;

    for (let i = 1; i < n; i++) {
      if (i <= r) {
        z[i] = Math.min(r - i + 1, z[i - l]);
      }

      while (i + z[i] < n && str[z[i]] === str[i + z[i]]) {
        z[i]++;
      }

      if (i + z[i] - 1 > r) {
        l = i;
        r = i + z[i] - 1;
      }
    }

    return z;
  }
}
```

## Step-by-Step Example

Let's compute Z array for string "AABAAABA":

### Initial State

```
String: A A B A A A B A
Index:  0 1 2 3 4 5 6 7
Z:      ? ? ? ? ? ? ? ?
l = 0, r = 0
```

### Step-by-Step Computation

**i = 1:**

- i > r, so compare from scratch
- S[0] = 'A', S[1] = 'A' → match, z[1] = 1
- S[1] = 'A', S[2] = 'B' → no match
- z[1] = 1, update l = 1, r = 1

**i = 2:**

- i > r, so compare from scratch
- S[0] = 'A', S[2] = 'B' → no match
- z[2] = 0

**i = 3:**

- i > r, so compare from scratch
- S[0] = 'A', S[3] = 'A' → match
- S[1] = 'A', S[4] = 'A' → match
- S[2] = 'B', S[5] = 'A' → no match
- z[3] = 2, update l = 3, r = 4

**i = 4:**

- i ≤ r, so z[4] = min(r - i + 1, z[4 - 3]) = min(1, z[1]) = min(1, 1) = 1
- Continue matching: S[1] = 'A', S[5] = 'A' → match
- S[2] = 'B', S[6] = 'B' → match
- S[3] = 'A', S[7] = 'A' → match
- z[4] = 3, update l = 4, r = 6

**Final Z Array: [8, 1, 0, 2, 3, 1, 0, 1]**

## Advanced Applications

### 1. Palindrome Analysis

```typescript
class PalindromeAnalyzer {
  findAllPalindromes(str: string): Array<{ start: number; length: number }> {
    const palindromes: Array<{ start: number; length: number }> = [];

    for (let center = 0; center < str.length; center++) {
      palindromes.push(...this.expandAroundCenter(str, center, center));
      palindromes.push(...this.expandAroundCenter(str, center, center + 1));
    }

    return palindromes.sort((a, b) => a.start - b.start);
  }

  private expandAroundCenter(
    str: string,
    left: number,
    right: number
  ): Array<{ start: number; length: number }> {
    const palindromes: Array<{ start: number; length: number }> = [];

    while (left >= 0 && right < str.length && str[left] === str[right]) {
      palindromes.push({
        start: left,
        length: right - left + 1,
      });
      left--;
      right++;
    }

    return palindromes;
  }

  isPalindrome(str: string): boolean {
    const reversed = str.split("").reverse().join("");
    const combined = str + "$" + reversed;
    const z = computeZArray(combined);

    return z[str.length + 1] === str.length;
  }

  longestPalindromicPrefix(str: string): string {
    const reversed = str.split("").reverse().join("");
    const combined = reversed + "$" + str;
    const z = computeZArray(combined);

    let maxLength = 0;
    for (let i = reversed.length + 1; i < combined.length; i++) {
      const pos = i - reversed.length - 1;
      if (z[i] === str.length - pos) {
        maxLength = Math.max(maxLength, z[i]);
      }
    }

    return str.substring(0, maxLength);
  }
}
```

### 2. String Periodicity Detection

```typescript
class PeriodicityAnalyzer {
  findSmallestPeriod(str: string): number {
    const z = computeZArray(str);
    const n = str.length;

    for (let period = 1; period < n; period++) {
      if (n % period === 0) {
        let isPeriodic = true;

        for (let i = period; i < n; i += period) {
          if (z[i] < Math.min(period, n - i)) {
            isPeriodic = false;
            break;
          }
        }

        if (isPeriodic) {
          return period;
        }
      }
    }

    return n;
  }

  getAllPeriods(str: string): number[] {
    const periods: number[] = [];
    const z = computeZArray(str);
    const n = str.length;

    for (let period = 1; period <= n; period++) {
      if (n % period === 0) {
        let isPeriodic = true;

        for (let i = period; i < n && isPeriodic; i += period) {
          if (z[i] < Math.min(period, n - i)) {
            isPeriodic = false;
          }
        }

        if (isPeriodic) {
          periods.push(period);
        }
      }
    }

    return periods;
  }

  findPeriodicSubstrings(
    str: string,
    minLength: number = 2
  ): Array<{ start: number; length: number; period: number }> {
    const results: Array<{ start: number; length: number; period: number }> =
      [];

    for (let start = 0; start < str.length; start++) {
      for (let length = minLength; start + length <= str.length; length++) {
        const substring = str.substring(start, start + length);
        const period = this.findSmallestPeriod(substring);

        if (period < substring.length) {
          results.push({ start, length, period });
        }
      }
    }

    return results;
  }
}
```

### 3. Efficient String Comparison

```typescript
class StringComparator {
  computeLCP(str1: string, str2: string): number {
    const combined = str1 + "$" + str2;
    const z = computeZArray(combined);

    return z[str1.length + 1];
  }

  findCommonSubstrings(
    str1: string,
    str2: string,
    minLength: number = 1
  ): Array<{ substring: string; positions1: number[]; positions2: number[] }> {
    const results = new Map<
      string,
      { positions1: number[]; positions2: number[] }
    >();

    for (
      let len = minLength;
      len <= Math.min(str1.length, str2.length);
      len++
    ) {
      for (let i = 0; i <= str1.length - len; i++) {
        const substring = str1.substring(i, i + len);

        if (!results.has(substring)) {
          results.set(substring, { positions1: [], positions2: [] });
        }

        results.get(substring)!.positions1.push(i);
      }

      for (let i = 0; i <= str2.length - len; i++) {
        const substring = str2.substring(i, i + len);

        if (results.has(substring)) {
          results.get(substring)!.positions2.push(i);
        }
      }
    }

    return Array.from(results.entries())
      .filter(
        ([_, { positions1, positions2 }]) =>
          positions1.length > 0 && positions2.length > 0
      )
      .map(([substring, positions]) => ({ substring, ...positions }));
  }

  computeEditDistance(str1: string, str2: string): number {
    const lcp = this.computeLCP(str1, str2);

    if (lcp === Math.min(str1.length, str2.length)) {
      return Math.abs(str1.length - str2.length);
    }

    const remaining1 = str1.substring(lcp);
    const remaining2 = str2.substring(lcp);

    return this.levenshteinDistance(remaining1, remaining2) + 0;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const dp = Array(str1.length + 1)
      .fill(null)
      .map(() => Array(str2.length + 1).fill(0));

    for (let i = 0; i <= str1.length; i++) dp[i][0] = i;
    for (let j = 0; j <= str2.length; j++) dp[0][j] = j;

    for (let i = 1; i <= str1.length; i++) {
      for (let j = 1; j <= str2.length; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
      }
    }

    return dp[str1.length][str2.length];
  }
}
```

### 4. DNA Sequence Analysis

```typescript
class DNASequenceAnalyzer {
  findTandemRepeats(
    dna: string,
    minRepeatLength: number = 2
  ): Array<{ start: number; pattern: string; count: number }> {
    const repeats: Array<{ start: number; pattern: string; count: number }> =
      [];

    for (let start = 0; start < dna.length; start++) {
      for (
        let patternLen = minRepeatLength;
        start + patternLen * 2 <= dna.length;
        patternLen++
      ) {
        const pattern = dna.substring(start, start + patternLen);
        let count = 1;
        let pos = start + patternLen;

        while (
          pos + patternLen <= dna.length &&
          dna.substring(pos, pos + patternLen) === pattern
        ) {
          count++;
          pos += patternLen;
        }

        if (count >= 2) {
          repeats.push({ start, pattern, count });
        }
      }
    }

    return repeats.filter(
      (repeat, index, arr) =>
        !arr.some(
          (other, otherIndex) =>
            otherIndex !== index &&
            other.start <= repeat.start &&
            other.start + other.pattern.length * other.count >=
              repeat.start + repeat.pattern.length * repeat.count
        )
    );
  }

  findInvertedRepeats(
    dna: string,
    minLength: number = 4
  ): Array<{ start: number; length: number }> {
    const complement = (base: string): string => {
      const map = { A: "T", T: "A", G: "C", C: "G" };
      return map[base] || base;
    };

    const reverse = (seq: string): string =>
      seq.split("").reverse().map(complement).join("");

    const repeats: Array<{ start: number; length: number }> = [];

    for (let len = minLength; len <= dna.length / 2; len++) {
      for (let start = 0; start <= dna.length - len * 2; start++) {
        const leftSeq = dna.substring(start, start + len);
        const rightSeq = dna.substring(start + len, start + len * 2);

        if (reverse(leftSeq) === rightSeq) {
          repeats.push({ start, length: len * 2 });
        }
      }
    }

    return repeats;
  }
}
```

## Performance Characteristics

### Linear Time Guarantee

The Z algorithm runs in exactly O(n) time because:

1. Each character is compared at most twice
2. The right boundary R only moves forward
3. No backtracking occurs

### Space Efficiency

- **Space**: O(n) for Z array storage
- **In-place**: Cannot be computed in-place due to Z array requirements
- **Cache-friendly**: Sequential memory access pattern

## Comparison with Other String Algorithms

| Algorithm   | Time        | Space  | Preprocessing | Use Case          |
| ----------- | ----------- | ------ | ------------- | ----------------- |
| Z Algorithm | O(n)        | O(n)   | None          | General analysis  |
| KMP         | O(n+m)      | O(m)   | O(m)          | Pattern matching  |
| Boyer-Moore | O(nm) worst | O(m+σ) | O(m+σ)        | Large alphabet    |
| Rabin-Karp  | O(n+m) avg  | O(1)   | O(m)          | Multiple patterns |

## Practice Problems

### LeetCode Problems

1. **[28. Implement strStr()](https://leetcode.com/problems/implement-strstr/)** - Basic pattern matching
2. **[214. Shortest Palindrome](https://leetcode.com/problems/shortest-palindrome/)** - Palindrome analysis
3. **[459. Repeated Substring Pattern](https://leetcode.com/problems/repeated-substring-pattern/)** - Periodicity detection
4. **[796. Rotate String](https://leetcode.com/problems/rotate-string/)** - String rotation

### Advanced Challenges

1. **Longest Palindromic Substring**: Use Z algorithm for linear solution
2. **All Distinct Substrings**: Count using Z array properties
3. **String Matching with Wildcards**: Extend Z algorithm for wildcards
4. **Circular String Matching**: Pattern matching in circular strings

## Key Insights for Interviews

1. **Linear Time**: Guaranteed O(n) performance without worst-case degradation
2. **Simple Implementation**: More straightforward than KMP algorithm
3. **Versatile Applications**: Beyond pattern matching - palindromes, periodicity
4. **Memory Access**: Cache-friendly sequential processing
5. **No Preprocessing**: Direct computation approach

## Related Algorithms

- **[KMP Algorithm](./kmp-algorithm.md)** - Alternative linear pattern matching
- **[Boyer-Moore Algorithm](./boyer-moore-algorithm.md)** - Right-to-left approach
- **[Rabin-Karp Algorithm](./rabin-karp-algorithm.md)** - Hash-based matching
- **[Manacher's Algorithm](../dynamic-programming/longest-palindromic-substring.md)** - Palindrome detection

The Z algorithm elegantly combines simplicity with power, providing a versatile foundation for numerous string processing tasks while maintaining optimal linear time complexity.
