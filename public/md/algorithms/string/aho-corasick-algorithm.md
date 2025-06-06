# Aho-Corasick Algorithm

**Aho-Corasick Algorithm** is a highly efficient string matching algorithm that can search for multiple patterns simultaneously in a single pass through the text. It builds an **automaton** (finite state machine) that processes each character exactly once, achieving **O(n + m + z)** time complexity where z is the number of pattern occurrences.

The algorithm combines the concepts of **trie data structure** and **KMP failure function** to create a powerful pattern matching automaton with failure links for efficient backtracking.

## Key Concepts

- **Trie Construction**: Build prefix tree of all patterns
- **Failure Links**: Connect states for efficient backtracking when mismatches occur
- **Output Links**: Direct paths to pattern matches in current state
- **Single Pass Processing**: Process text character by character without backtracking
- **Multiple Pattern Matching**: Find all patterns simultaneously

## Time and Space Complexity

| Operation       | Time Complexity | Space Complexity |
| --------------- | --------------- | ---------------- |
| Preprocessing   | O(m)            | O(m \* σ)        |
| Text Processing | O(n)            | O(m \* σ)        |
| Total           | O(n + m + z)    | O(m \* σ)        |

**n** = text length, **m** = total length of all patterns, **σ** = alphabet size, **z** = number of matches

## Algorithm Components

### 1. Trie Construction

Build a trie containing all patterns, where each node represents a state in the automaton.

### 2. Failure Link Construction

For each state, compute failure link that points to the longest proper suffix that is also a prefix.

### 3. Output Link Construction

Precompute which patterns end at each state for efficient result collection.

## Implementation

### Complete Aho-Corasick Implementation

```typescript
class AhoCorasick {
  private root: TrieNode;
  private patterns: string[];

  constructor(patterns: string[]) {
    this.patterns = patterns;
    this.root = new TrieNode();
    this.buildTrie();
    this.buildFailureLinks();
    this.buildOutputLinks();
  }

  private buildTrie(): void {
    this.patterns.forEach((pattern, index) => {
      let current = this.root;

      for (const char of pattern) {
        if (!current.children.has(char)) {
          current.children.set(char, new TrieNode());
        }
        current = current.children.get(char)!;
      }

      current.output.push(index);
      current.isEndOfPattern = true;
    });
  }

  private buildFailureLinks(): void {
    const queue: TrieNode[] = [];

    this.root.children.forEach((child) => {
      child.failure = this.root;
      queue.push(child);
    });

    while (queue.length > 0) {
      const current = queue.shift()!;

      current.children.forEach((child, char) => {
        queue.push(child);

        let temp = current.failure;
        while (temp !== null && !temp.children.has(char)) {
          temp = temp.failure;
        }

        if (temp !== null) {
          child.failure = temp.children.get(char)!;
        } else {
          child.failure = this.root;
        }

        if (child.failure === child) {
          child.failure = this.root;
        }
      });
    }
  }

  private buildOutputLinks(): void {
    const queue: TrieNode[] = [this.root];

    while (queue.length > 0) {
      const current = queue.shift()!;

      current.children.forEach((child) => {
        queue.push(child);

        let temp = child.failure;
        while (temp !== null && temp.output.length === 0) {
          temp = temp.failure;
        }

        if (temp !== null && temp.output.length > 0) {
          child.outputLink = temp;
        }
      });
    }
  }

  search(
    text: string
  ): Array<{ pattern: string; position: number; patternIndex: number }> {
    const results: Array<{
      pattern: string;
      position: number;
      patternIndex: number;
    }> = [];
    let current = this.root;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];

      while (current !== this.root && !current.children.has(char)) {
        current = current.failure!;
      }

      if (current.children.has(char)) {
        current = current.children.get(char)!;
      }

      this.collectMatches(current, i, results);
    }

    return results;
  }

  private collectMatches(
    node: TrieNode,
    position: number,
    results: Array<{ pattern: string; position: number; patternIndex: number }>
  ): void {
    let current: TrieNode | null = node;

    while (current !== null) {
      current.output.forEach((patternIndex) => {
        const pattern = this.patterns[patternIndex];
        results.push({
          pattern,
          position: position - pattern.length + 1,
          patternIndex,
        });
      });

      current = current.outputLink;
    }
  }

  searchCount(text: string): Map<string, number> {
    const counts = new Map<string, number>();
    const matches = this.search(text);

    matches.forEach(({ pattern }) => {
      counts.set(pattern, (counts.get(pattern) || 0) + 1);
    });

    return counts;
  }

  hasAnyPattern(text: string): boolean {
    let current = this.root;

    for (const char of text) {
      while (current !== this.root && !current.children.has(char)) {
        current = current.failure!;
      }

      if (current.children.has(char)) {
        current = current.children.get(char)!;

        if (current.output.length > 0 || current.outputLink !== null) {
          return true;
        }
      }
    }

    return false;
  }
}

class TrieNode {
  children: Map<string, TrieNode>;
  failure: TrieNode | null;
  output: number[];
  outputLink: TrieNode | null;
  isEndOfPattern: boolean;

  constructor() {
    this.children = new Map();
    this.failure = null;
    this.output = [];
    this.outputLink = null;
    this.isEndOfPattern = false;
  }
}
```

### Optimized Aho-Corasick for Large Alphabets

```typescript
class OptimizedAhoCorasick {
  private root: CompactTrieNode;
  private patterns: string[];
  private alphabet: Set<string>;

  constructor(patterns: string[]) {
    this.patterns = patterns;
    this.alphabet = new Set();
    this.extractAlphabet();
    this.root = new CompactTrieNode();
    this.buildAutomaton();
  }

  private extractAlphabet(): void {
    this.patterns.forEach((pattern) => {
      for (const char of pattern) {
        this.alphabet.add(char);
      }
    });
  }

  private buildAutomaton(): void {
    this.buildTrie();
    this.buildFailureAndOutputLinks();
  }

  private buildTrie(): void {
    this.patterns.forEach((pattern, index) => {
      let current = this.root;

      for (const char of pattern) {
        if (!current.children[char]) {
          current.children[char] = new CompactTrieNode();
        }
        current = current.children[char];
      }

      current.patternIndices.push(index);
    });
  }

  private buildFailureAndOutputLinks(): void {
    const queue: CompactTrieNode[] = [];

    Object.values(this.root.children).forEach((child) => {
      if (child) {
        child.failure = this.root;
        queue.push(child);
      }
    });

    while (queue.length > 0) {
      const current = queue.shift()!;

      this.alphabet.forEach((char) => {
        const child = current.children[char];
        if (child) {
          queue.push(child);

          let failureNode = current.failure;
          while (failureNode && !failureNode.children[char]) {
            failureNode = failureNode.failure;
          }

          if (failureNode && failureNode.children[char]) {
            child.failure = failureNode.children[char];
          } else {
            child.failure = this.root;
          }

          child.patternIndices.push(...child.failure.patternIndices);
        }
      });
    }
  }

  search(text: string): Array<{ pattern: string; position: number }> {
    const results: Array<{ pattern: string; position: number }> = [];
    let current = this.root;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];

      while (current !== this.root && !current.children[char]) {
        current = current.failure!;
      }

      if (current.children[char]) {
        current = current.children[char];

        current.patternIndices.forEach((patternIndex) => {
          const pattern = this.patterns[patternIndex];
          results.push({
            pattern,
            position: i - pattern.length + 1,
          });
        });
      }
    }

    return results;
  }
}

class CompactTrieNode {
  children: { [key: string]: CompactTrieNode };
  failure: CompactTrieNode | null;
  patternIndices: number[];

  constructor() {
    this.children = {};
    this.failure = null;
    this.patternIndices = [];
  }
}
```

## Step-by-Step Example

Let's build Aho-Corasick automaton for patterns ["HE", "SHE", "HIS", "HERS"]:

### Step 1: Build Trie

```
     root
    /  |  \
   H   S   (other chars)
  /|   |
 E I   H
   |   |
   S   E
```

### Step 2: Add Failure Links

```
Node "HE": failure → root
Node "SHE": failure → "HE"
Node "HIS": failure → root
Node "HERS": failure → root
```

### Step 3: Search in "USHERS"

```
Position 0: U → root
Position 1: S → root → S
Position 2: H → root → S → SH
Position 3: E → SH → SHE (match "SHE" at position 1)
Position 4: R → failure to "HE" → root
Position 5: S → root → S
```

## Advanced Applications

### 1. Virus Scanner

```typescript
class VirusScanner {
  private ahoCorasick: AhoCorasick;
  private virusSignatures: Map<string, VirusInfo>;

  constructor(
    signatures: Array<{ pattern: string; name: string; severity: number }>
  ) {
    const patterns = signatures.map((sig) => sig.pattern);
    this.ahoCorasick = new AhoCorasick(patterns);

    this.virusSignatures = new Map();
    signatures.forEach((sig) => {
      this.virusSignatures.set(sig.pattern, {
        name: sig.name,
        severity: sig.severity,
      });
    });
  }

  scanFile(fileContent: string): ScanResult {
    const matches = this.ahoCorasick.search(fileContent);
    const threats: Threat[] = [];

    matches.forEach((match) => {
      const virusInfo = this.virusSignatures.get(match.pattern);
      if (virusInfo) {
        threats.push({
          name: virusInfo.name,
          pattern: match.pattern,
          position: match.position,
          severity: virusInfo.severity,
        });
      }
    });

    return {
      isClean: threats.length === 0,
      threats: threats.sort((a, b) => b.severity - a.severity),
      scanTime: Date.now(),
    };
  }

  scanDirectory(
    files: Array<{ name: string; content: string }>
  ): DirectoryScanResult {
    const results = new Map<string, ScanResult>();
    let totalThreats = 0;

    files.forEach((file) => {
      const result = this.scanFile(file.content);
      results.set(file.name, result);
      totalThreats += result.threats.length;
    });

    return {
      fileResults: results,
      totalFiles: files.length,
      infectedFiles: Array.from(results.values()).filter((r) => !r.isClean)
        .length,
      totalThreats,
    };
  }
}

interface VirusInfo {
  name: string;
  severity: number;
}

interface Threat {
  name: string;
  pattern: string;
  position: number;
  severity: number;
}

interface ScanResult {
  isClean: boolean;
  threats: Threat[];
  scanTime: number;
}

interface DirectoryScanResult {
  fileResults: Map<string, ScanResult>;
  totalFiles: number;
  infectedFiles: number;
  totalThreats: number;
}
```

### 2. Content Filter

```typescript
class ContentFilter {
  private profanityFilter: AhoCorasick;
  private spamFilter: AhoCorasick;
  private replacements: Map<string, string>;

  constructor(
    profanityWords: string[],
    spamPatterns: string[],
    replacements: Map<string, string> = new Map()
  ) {
    this.profanityFilter = new AhoCorasick(profanityWords);
    this.spamFilter = new AhoCorasick(spamPatterns);
    this.replacements = replacements;
  }

  filterContent(text: string): FilterResult {
    const profanityMatches = this.profanityFilter.search(text);
    const spamMatches = this.spamFilter.search(text);

    let filteredText = text;
    let replacementCount = 0;

    const allMatches = [...profanityMatches, ...spamMatches].sort(
      (a, b) => b.position - a.position
    );

    allMatches.forEach((match) => {
      const replacement =
        this.replacements.get(match.pattern) ||
        "*".repeat(match.pattern.length);

      filteredText =
        filteredText.substring(0, match.position) +
        replacement +
        filteredText.substring(match.position + match.pattern.length);

      replacementCount++;
    });

    return {
      originalText: text,
      filteredText,
      isProfane: profanityMatches.length > 0,
      isSpam: spamMatches.length > 0,
      replacementCount,
      matches: {
        profanity: profanityMatches,
        spam: spamMatches,
      },
    };
  }

  analyzeContent(text: string): ContentAnalysis {
    const profanityCounts = this.profanityFilter.searchCount(text);
    const spamCounts = this.spamFilter.searchCount(text);

    const profanityScore = Array.from(profanityCounts.values()).reduce(
      (sum, count) => sum + count,
      0
    );
    const spamScore = Array.from(spamCounts.values()).reduce(
      (sum, count) => sum + count,
      0
    );

    return {
      profanityScore,
      spamScore,
      overallScore: profanityScore + spamScore * 2,
      recommendation: this.getRecommendation(profanityScore, spamScore),
      detailedMatches: {
        profanity: profanityCounts,
        spam: spamCounts,
      },
    };
  }

  private getRecommendation(profanityScore: number, spamScore: number): string {
    if (spamScore > 5) return "Block - High spam content";
    if (profanityScore > 10) return "Block - Excessive profanity";
    if (profanityScore > 3 || spamScore > 1)
      return "Review - Moderate filtering needed";
    return "Allow - Content appears clean";
  }
}

interface FilterResult {
  originalText: string;
  filteredText: string;
  isProfane: boolean;
  isSpam: boolean;
  replacementCount: number;
  matches: {
    profanity: Array<{ pattern: string; position: number }>;
    spam: Array<{ pattern: string; position: number }>;
  };
}

interface ContentAnalysis {
  profanityScore: number;
  spamScore: number;
  overallScore: number;
  recommendation: string;
  detailedMatches: {
    profanity: Map<string, number>;
    spam: Map<string, number>;
  };
}
```

### 3. Bioinformatics - DNA Pattern Matching

```typescript
class DNAPatternMatcher {
  private ahoCorasick: AhoCorasick;
  private motifs: Map<string, MotifInfo>;

  constructor(
    motifs: Array<{ sequence: string; name: string; function: string }>
  ) {
    const patterns = motifs.map((motif) => motif.sequence);
    this.ahoCorasick = new AhoCorasick(patterns);

    this.motifs = new Map();
    motifs.forEach((motif) => {
      this.motifs.set(motif.sequence, {
        name: motif.name,
        function: motif.function,
      });
    });
  }

  findMotifs(dnaSequence: string): MotifAnalysis {
    const matches = this.ahoCorasick.search(dnaSequence);
    const foundMotifs: FoundMotif[] = [];

    matches.forEach((match) => {
      const motifInfo = this.motifs.get(match.pattern);
      if (motifInfo) {
        foundMotifs.push({
          sequence: match.pattern,
          name: motifInfo.name,
          function: motifInfo.function,
          position: match.position,
          length: match.pattern.length,
        });
      }
    });

    return {
      totalMotifs: foundMotifs.length,
      uniqueMotifs: new Set(foundMotifs.map((m) => m.name)).size,
      motifs: foundMotifs.sort((a, b) => a.position - b.position),
      coverage: this.calculateCoverage(foundMotifs, dnaSequence.length),
    };
  }

  findOverlappingMotifs(dnaSequence: string): Array<MotifCluster> {
    const motifs = this.findMotifs(dnaSequence).motifs;
    const clusters: Array<MotifCluster> = [];

    motifs.forEach((motif) => {
      const overlapping = motifs.filter(
        (other) => other !== motif && this.isOverlapping(motif, other)
      );

      if (overlapping.length > 0) {
        clusters.push({
          region: {
            start: Math.min(
              motif.position,
              ...overlapping.map((m) => m.position)
            ),
            end: Math.max(
              motif.position + motif.length,
              ...overlapping.map((m) => m.position + m.length)
            ),
          },
          motifs: [motif, ...overlapping],
        });
      }
    });

    return this.mergeOverlappingClusters(clusters);
  }

  private calculateCoverage(
    motifs: FoundMotif[],
    sequenceLength: number
  ): number {
    const coveredPositions = new Set<number>();

    motifs.forEach((motif) => {
      for (let i = motif.position; i < motif.position + motif.length; i++) {
        coveredPositions.add(i);
      }
    });

    return coveredPositions.size / sequenceLength;
  }

  private isOverlapping(motif1: FoundMotif, motif2: FoundMotif): boolean {
    return !(
      motif1.position + motif1.length <= motif2.position ||
      motif2.position + motif2.length <= motif1.position
    );
  }

  private mergeOverlappingClusters(
    clusters: Array<MotifCluster>
  ): Array<MotifCluster> {
    const merged: Array<MotifCluster> = [];
    const processed = new Set<number>();

    clusters.forEach((cluster, index) => {
      if (processed.has(index)) return;

      const mergedCluster = {
        region: { ...cluster.region },
        motifs: [...cluster.motifs],
      };

      for (let i = index + 1; i < clusters.length; i++) {
        if (processed.has(i)) continue;

        const other = clusters[i];
        if (this.clustersOverlap(mergedCluster, other)) {
          mergedCluster.region.start = Math.min(
            mergedCluster.region.start,
            other.region.start
          );
          mergedCluster.region.end = Math.max(
            mergedCluster.region.end,
            other.region.end
          );
          mergedCluster.motifs.push(...other.motifs);
          processed.add(i);
        }
      }

      merged.push(mergedCluster);
      processed.add(index);
    });

    return merged;
  }

  private clustersOverlap(
    cluster1: MotifCluster,
    cluster2: MotifCluster
  ): boolean {
    return !(
      cluster1.region.end <= cluster2.region.start ||
      cluster2.region.end <= cluster1.region.start
    );
  }
}

interface MotifInfo {
  name: string;
  function: string;
}

interface FoundMotif {
  sequence: string;
  name: string;
  function: string;
  position: number;
  length: number;
}

interface MotifAnalysis {
  totalMotifs: number;
  uniqueMotifs: number;
  motifs: FoundMotif[];
  coverage: number;
}

interface MotifCluster {
  region: { start: number; end: number };
  motifs: FoundMotif[];
}
```

## Performance Characteristics

### Time Complexity Analysis

- **Preprocessing**: O(m) where m is total length of all patterns
- **Search**: O(n) where n is text length
- **Output**: O(z) where z is number of matches
- **Total**: O(n + m + z)

### Space Complexity

- **Trie Storage**: O(m × σ) in worst case
- **Practical Usage**: Much less due to shared prefixes
- **Failure Links**: O(number of states)

### Comparison with Alternatives

| Approach             | Time           | Space    | Multiple Patterns |
| -------------------- | -------------- | -------- | ----------------- |
| Aho-Corasick         | O(n + m + z)   | O(m × σ) | Excellent         |
| Multiple KMP         | O(n × k + m)   | O(m)     | Good              |
| Multiple Boyer-Moore | O(n × k)       | O(m × σ) | Good              |
| Suffix Array         | O(n + m log n) | O(n)     | Excellent         |

## Practice Problems

### LeetCode Problems

1. **[1032. Stream of Characters](https://leetcode.com/problems/stream-of-characters/)** - Direct Aho-Corasick application
2. **[336. Palindrome Pairs](https://leetcode.com/problems/palindrome-pairs/)** - Advanced trie usage
3. **[1803. Count Pairs With XOR in a Range](https://leetcode.com/problems/count-pairs-with-xor-in-a-range/)** - Trie with bit manipulation

### Implementation Challenges

1. **Case-Insensitive Matching**: Extend for case-insensitive patterns
2. **Wildcard Patterns**: Support patterns with wildcard characters
3. **Approximate Matching**: Allow edit distance in pattern matching
4. **Streaming Processing**: Process infinite streams efficiently

## Key Insights for Interviews

1. **When to Use**: Multiple pattern search, especially with overlapping patterns
2. **Preprocessing Cost**: Upfront cost pays off for multiple searches
3. **Memory Usage**: Can be significant for large pattern sets
4. **Real-world Applications**: Antivirus, content filtering, bioinformatics
5. **Implementation Complexity**: More complex than single pattern algorithms

## Related Algorithms

- **[KMP Algorithm](./kmp-algorithm.md)** - Single pattern linear matching
- **[Boyer-Moore Algorithm](./boyer-moore-algorithm.md)** - Single pattern with skip heuristics
- **[Rabin-Karp Algorithm](./rabin-karp-algorithm.md)** - Hash-based multiple pattern matching
- **[Suffix Arrays](../../data-structures/array/suffix-arrays.md)** - Alternative for multiple pattern queries

The Aho-Corasick algorithm represents the gold standard for multiple pattern matching, elegantly combining trie structures with failure links to achieve optimal linear-time performance across all patterns simultaneously.
