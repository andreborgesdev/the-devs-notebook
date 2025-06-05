# Suffix Tree

A Suffix Tree is a compressed trie of all suffixes of a given string. It provides efficient solutions to many string processing problems and is fundamental in bioinformatics, text analysis, and pattern matching algorithms.

## Structure

- **Root**: Empty string
- **Leaves**: Represent suffixes
- **Edges**: Labeled with substrings
- **Path Compression**: Chains of single-child nodes are compressed
- **Suffix Links**: Connect nodes for efficient construction

## Time Complexity

| Operation                  | Time Complexity                                        |
| -------------------------- | ------------------------------------------------------ |
| Construction               | O(n) with Ukkonen's algorithm                          |
| Pattern Search             | O(m + occ) where m = pattern length, occ = occurrences |
| Longest Common Substring   | O(n)                                                   |
| Longest Repeated Substring | O(n)                                                   |
| All Substrings             | O(n²)                                                  |

## Implementation

```typescript
class SuffixTreeNode {
  children: Map<string, SuffixTreeNode>;
  start: number;
  end: number | { value: number };
  suffixIndex: number;
  suffixLink: SuffixTreeNode | null;

  constructor(start: number, end: number | { value: number }) {
    this.children = new Map();
    this.start = start;
    this.end = end;
    this.suffixIndex = -1;
    this.suffixLink = null;
  }

  getEdgeLength(): number {
    const endValue = typeof this.end === "object" ? this.end.value : this.end;
    return endValue - this.start + 1;
  }
}

class SuffixTree {
  private text: string;
  private root: SuffixTreeNode;
  private globalEnd: { value: number };
  private activeNode: SuffixTreeNode;
  private activeEdge: number;
  private activeLength: number;
  private remainingSuffixCount: number;
  private leafEnd: { value: number };
  private rootEnd: number;
  private splitEnd: number;
  private size: number;

  constructor(text: string) {
    this.text = text + "$"; // Add sentinel character
    this.size = this.text.length;
    this.globalEnd = { value: -1 };
    this.leafEnd = { value: -1 };
    this.rootEnd = -1;
    this.splitEnd = -1;

    this.root = new SuffixTreeNode(-1, this.rootEnd);
    this.activeNode = this.root;
    this.activeEdge = -1;
    this.activeLength = 0;
    this.remainingSuffixCount = 0;

    this.buildSuffixTree();
  }

  private buildSuffixTree(): void {
    for (let i = 0; i < this.size; i++) {
      this.extendSuffixTree(i);
    }

    this.setSuffixIndexByDFS(this.root, 0);
  }

  private extendSuffixTree(pos: number): void {
    this.leafEnd.value = pos;
    this.remainingSuffixCount++;
    let lastNewNode: SuffixTreeNode | null = null;

    while (this.remainingSuffixCount > 0) {
      if (this.activeLength === 0) {
        this.activeEdge = pos;
      }

      const edgeChar = this.text[this.activeEdge];

      if (!this.activeNode.children.has(edgeChar)) {
        const leaf = new SuffixTreeNode(pos, this.leafEnd);
        this.activeNode.children.set(edgeChar, leaf);

        if (lastNewNode) {
          lastNewNode.suffixLink = this.activeNode;
          lastNewNode = null;
        }
      } else {
        const next = this.activeNode.children.get(edgeChar)!;

        if (this.walkDown(next)) {
          continue;
        }

        const nextEndValue =
          typeof next.end === "object" ? next.end.value : next.end;

        if (this.text[next.start + this.activeLength] === this.text[pos]) {
          if (lastNewNode && this.activeNode !== this.root) {
            lastNewNode.suffixLink = this.activeNode;
            lastNewNode = null;
          }

          this.activeLength++;
          break;
        }

        this.splitEnd = next.start + this.activeLength - 1;
        const split = new SuffixTreeNode(next.start, this.splitEnd);
        this.activeNode.children.set(edgeChar, split);

        const leaf = new SuffixTreeNode(pos, this.leafEnd);
        split.children.set(this.text[pos], leaf);

        next.start += this.activeLength;
        split.children.set(this.text[next.start], next);

        if (lastNewNode) {
          lastNewNode.suffixLink = split;
        }

        lastNewNode = split;
      }

      this.remainingSuffixCount--;

      if (this.activeNode === this.root && this.activeLength > 0) {
        this.activeLength--;
        this.activeEdge = pos - this.remainingSuffixCount + 1;
      } else if (this.activeNode !== this.root) {
        this.activeNode = this.activeNode.suffixLink || this.root;
      }
    }
  }

  private walkDown(currNode: SuffixTreeNode): boolean {
    const edgeLength = currNode.getEdgeLength();

    if (this.activeLength >= edgeLength) {
      this.activeEdge += edgeLength;
      this.activeLength -= edgeLength;
      this.activeNode = currNode;
      return true;
    }

    return false;
  }

  private setSuffixIndexByDFS(node: SuffixTreeNode, labelHeight: number): void {
    if (!node) return;

    let leaf = true;

    for (const [, child] of node.children) {
      if (child) {
        leaf = false;
        this.setSuffixIndexByDFS(child, labelHeight + child.getEdgeLength());
      }
    }

    if (leaf) {
      node.suffixIndex = this.size - labelHeight;
    }
  }

  search(pattern: string): number[] {
    const occurrences: number[] = [];
    const node = this.searchHelper(pattern);

    if (node) {
      this.collectSuffixIndices(node, occurrences);
    }

    return occurrences.sort((a, b) => a - b);
  }

  private searchHelper(pattern: string): SuffixTreeNode | null {
    let currentNode = this.root;
    let i = 0;

    while (i < pattern.length) {
      const char = pattern[i];

      if (!currentNode.children.has(char)) {
        return null;
      }

      const childNode = currentNode.children.get(char)!;
      let j = childNode.start;
      const endValue =
        typeof childNode.end === "object" ? childNode.end.value : childNode.end;

      while (j <= endValue && i < pattern.length) {
        if (this.text[j] !== pattern[i]) {
          return null;
        }
        j++;
        i++;
      }

      if (i < pattern.length) {
        currentNode = childNode;
      } else {
        return childNode;
      }
    }

    return currentNode;
  }

  private collectSuffixIndices(
    node: SuffixTreeNode,
    occurrences: number[]
  ): void {
    if (node.suffixIndex !== -1) {
      occurrences.push(node.suffixIndex);
      return;
    }

    for (const [, child] of node.children) {
      this.collectSuffixIndices(child, occurrences);
    }
  }

  longestCommonSubstring(other: SuffixTree): string {
    const combined = this.text.slice(0, -1) + "#" + other.text;
    const combinedTree = new SuffixTree(combined);

    return combinedTree.findLongestCommonSubstring(this.text.length - 1);
  }

  private findLongestCommonSubstring(firstStringLength: number): string {
    let maxLength = 0;
    let startIndex = 0;

    this.findLCSHelper(this.root, 0, firstStringLength, {
      maxLength,
      startIndex,
    });

    return this.text.substring(startIndex, startIndex + maxLength);
  }

  private findLCSHelper(
    node: SuffixTreeNode,
    depth: number,
    firstStringLength: number,
    result: { maxLength: number; startIndex: number }
  ): { hasFirst: boolean; hasSecond: boolean } {
    if (!node) return { hasFirst: false, hasSecond: false };

    let hasFirst = false;
    let hasSecond = false;

    if (node.suffixIndex !== -1) {
      if (node.suffixIndex < firstStringLength) {
        hasFirst = true;
      } else {
        hasSecond = true;
      }
      return { hasFirst, hasSecond };
    }

    for (const [, child] of node.children) {
      const childResult = this.findLCSHelper(
        child,
        depth + child.getEdgeLength(),
        firstStringLength,
        result
      );

      hasFirst = hasFirst || childResult.hasFirst;
      hasSecond = hasSecond || childResult.hasSecond;
    }

    if (hasFirst && hasSecond && depth > result.maxLength) {
      result.maxLength = depth;
      result.startIndex =
        node.suffixIndex !== -1
          ? node.suffixIndex
          : this.getFirstSuffixIndex(node);
    }

    return { hasFirst, hasSecond };
  }

  private getFirstSuffixIndex(node: SuffixTreeNode): number {
    if (node.suffixIndex !== -1) {
      return node.suffixIndex;
    }

    for (const [, child] of node.children) {
      const index = this.getFirstSuffixIndex(child);
      if (index !== -1) return index;
    }

    return -1;
  }

  longestRepeatedSubstring(): string {
    let maxLength = 0;
    let startIndex = 0;

    this.findLRSHelper(this.root, 0, { maxLength, startIndex });

    return this.text.substring(startIndex, startIndex + maxLength);
  }

  private findLRSHelper(
    node: SuffixTreeNode,
    depth: number,
    result: { maxLength: number; startIndex: number }
  ): void {
    if (!node) return;

    if (node.children.size > 0 && depth > result.maxLength) {
      result.maxLength = depth;
      result.startIndex = this.getFirstSuffixIndex(node);
    }

    for (const [, child] of node.children) {
      this.findLRSHelper(child, depth + child.getEdgeLength(), result);
    }
  }

  getAllSubstrings(): string[] {
    const substrings: string[] = [];
    this.collectSubstrings(this.root, "", substrings);
    return substrings.filter((s) => s.length > 0 && !s.includes("$"));
  }

  private collectSubstrings(
    node: SuffixTreeNode,
    current: string,
    substrings: string[]
  ): void {
    if (current.length > 0) {
      substrings.push(current);
    }

    for (const [char, child] of node.children) {
      const endValue =
        typeof child.end === "object" ? child.end.value : child.end;
      const edgeLabel = this.text.substring(child.start, endValue + 1);
      this.collectSubstrings(child, current + edgeLabel, substrings);
    }
  }

  countOccurrences(pattern: string): number {
    return this.search(pattern).length;
  }

  hasSubstring(pattern: string): boolean {
    return this.searchHelper(pattern) !== null;
  }

  printTree(): void {
    console.log("Suffix Tree:");
    this.printHelper(this.root, "", 0);
  }

  private printHelper(
    node: SuffixTreeNode,
    prefix: string,
    depth: number
  ): void {
    const indent = "  ".repeat(depth);

    if (node === this.root) {
      console.log(`${indent}ROOT`);
    } else {
      const endValue = typeof node.end === "object" ? node.end.value : node.end;
      const edgeLabel = this.text.substring(node.start, endValue + 1);
      const suffix =
        node.suffixIndex !== -1 ? ` [suffix: ${node.suffixIndex}]` : "";
      console.log(`${indent}${edgeLabel}${suffix}`);
    }

    for (const [, child] of node.children) {
      this.printHelper(child, prefix, depth + 1);
    }
  }

  getStats(): {
    textLength: number;
    nodeCount: number;
    leafCount: number;
    maxDepth: number;
  } {
    const stats = {
      textLength: this.text.length - 1,
      nodeCount: 0,
      leafCount: 0,
      maxDepth: 0,
    };

    this.collectStats(this.root, 0, stats);

    return stats;
  }

  private collectStats(
    node: SuffixTreeNode,
    depth: number,
    stats: { nodeCount: number; leafCount: number; maxDepth: number }
  ): void {
    stats.nodeCount++;
    stats.maxDepth = Math.max(stats.maxDepth, depth);

    if (node.children.size === 0) {
      stats.leafCount++;
    }

    for (const [, child] of node.children) {
      this.collectStats(child, depth + 1, stats);
    }
  }
}
```

## Usage Examples

```typescript
const text = "banana";
const suffixTree = new SuffixTree(text);

console.log(suffixTree.search("ana")); // [1, 3] - positions where "ana" occurs

console.log(suffixTree.hasSubstring("nan")); // true
console.log(suffixTree.hasSubstring("xyz")); // false

console.log(suffixTree.countOccurrences("a")); // 3

console.log(suffixTree.longestRepeatedSubstring()); // "ana"

const allSubstrings = suffixTree.getAllSubstrings();
console.log(allSubstrings); // All substrings of "banana"

const text2 = "bandana";
const suffixTree2 = new SuffixTree(text2);
console.log(suffixTree.longestCommonSubstring(suffixTree2)); // "ana"

suffixTree.printTree();
// ROOT
//   $
//   a [suffix: 5]
//     $ [suffix: 1]
//     na [suffix: 3]
//       $ [suffix: 1]
//       na$ [suffix: 3]
//   ...

const stats = suffixTree.getStats();
console.log(stats); // { textLength: 6, nodeCount: 10, leafCount: 6, maxDepth: 4 }
```

## Advanced String Algorithms

```typescript
class SuffixTreeAlgorithms {
  static findLongestPalindrome(text: string): string {
    const reversed = text.split("").reverse().join("");
    const combined = text + "#" + reversed;
    const tree = new SuffixTree(combined);

    return tree.longestCommonSubstring(new SuffixTree(reversed));
  }

  static findAllRepeats(
    text: string,
    minLength: number = 2
  ): Array<{
    pattern: string;
    positions: number[];
    count: number;
  }> {
    const tree = new SuffixTree(text);
    const substrings = tree
      .getAllSubstrings()
      .filter((s) => s.length >= minLength);

    const repeats: Array<{
      pattern: string;
      positions: number[];
      count: number;
    }> = [];

    for (const substring of substrings) {
      const positions = tree.search(substring);
      if (positions.length > 1) {
        repeats.push({
          pattern: substring,
          positions,
          count: positions.length,
        });
      }
    }

    return repeats.sort((a, b) => b.count - a.count);
  }

  static kasaiLCP(text: string): number[] {
    const n = text.length;
    const suffixes: Array<{ suffix: string; index: number }> = [];

    for (let i = 0; i < n; i++) {
      suffixes.push({ suffix: text.substring(i), index: i });
    }

    suffixes.sort((a, b) => a.suffix.localeCompare(b.suffix));

    const lcp: number[] = new Array(n).fill(0);
    const rank: number[] = new Array(n);

    for (let i = 0; i < n; i++) {
      rank[suffixes[i].index] = i;
    }

    let h = 0;
    for (let i = 0; i < n; i++) {
      if (rank[i] > 0) {
        const j = suffixes[rank[i] - 1].index;
        while (i + h < n && j + h < n && text[i + h] === text[j + h]) {
          h++;
        }
        lcp[rank[i]] = h;
        if (h > 0) h--;
      }
    }

    return lcp;
  }

  static findMaximalRepeats(text: string): Array<{
    pattern: string;
    positions: number[];
    leftExtensions: Set<string>;
    rightExtensions: Set<string>;
  }> {
    const tree = new SuffixTree(text);
    const repeats = this.findAllRepeats(text);
    const maximal: Array<{
      pattern: string;
      positions: number[];
      leftExtensions: Set<string>;
      rightExtensions: Set<string>;
    }> = [];

    for (const repeat of repeats) {
      const leftExt = new Set<string>();
      const rightExt = new Set<string>();

      for (const pos of repeat.positions) {
        if (pos > 0) {
          leftExt.add(text[pos - 1]);
        }
        if (pos + repeat.pattern.length < text.length) {
          rightExt.add(text[pos + repeat.pattern.length]);
        }
      }

      if (leftExt.size > 1 || rightExt.size > 1) {
        maximal.push({
          pattern: repeat.pattern,
          positions: repeat.positions,
          leftExtensions: leftExt,
          rightExtensions: rightExt,
        });
      }
    }

    return maximal;
  }
}
```

## Bioinformatics Applications

```typescript
class BioinformaticsSuffixTree extends SuffixTree {
  findORFs(minLength: number = 60): Array<{
    start: number;
    end: number;
    frame: number;
    sequence: string;
  }> {
    const startCodons = ["ATG"];
    const stopCodons = ["TAA", "TAG", "TGA"];
    const orfs: Array<{
      start: number;
      end: number;
      frame: number;
      sequence: string;
    }> = [];

    for (let frame = 0; frame < 3; frame++) {
      for (let i = frame; i < this.text.length - 3; i += 3) {
        const codon = this.text.substring(i, i + 3);

        if (startCodons.includes(codon)) {
          for (let j = i + 3; j < this.text.length - 3; j += 3) {
            const stopCodon = this.text.substring(j, j + 3);

            if (stopCodons.includes(stopCodon)) {
              const length = j - i;
              if (length >= minLength) {
                orfs.push({
                  start: i,
                  end: j + 3,
                  frame,
                  sequence: this.text.substring(i, j + 3),
                });
              }
              break;
            }
          }
        }
      }
    }

    return orfs;
  }

  findTandemRepeats(
    minLength: number = 2,
    maxPeriod: number = 10
  ): Array<{
    start: number;
    period: number;
    copies: number;
    sequence: string;
  }> {
    const repeats: Array<{
      start: number;
      period: number;
      copies: number;
      sequence: string;
    }> = [];

    for (let period = 1; period <= maxPeriod; period++) {
      for (let start = 0; start <= this.text.length - period * 2; start++) {
        const pattern = this.text.substring(start, start + period);
        let copies = 1;
        let pos = start + period;

        while (pos + period <= this.text.length) {
          const nextPattern = this.text.substring(pos, pos + period);
          if (nextPattern === pattern) {
            copies++;
            pos += period;
          } else {
            break;
          }
        }

        if (copies >= 2 && copies * period >= minLength) {
          repeats.push({
            start,
            period,
            copies,
            sequence: this.text.substring(start, start + copies * period),
          });
        }
      }
    }

    return repeats.filter(
      (repeat, index, arr) =>
        !arr.some(
          (other, otherIndex) =>
            otherIndex !== index &&
            other.start <= repeat.start &&
            other.start + other.copies * other.period >=
              repeat.start + repeat.copies * repeat.period
        )
    );
  }
}
```

## Applications

- **Text Processing**: Pattern matching, text indexing
- **Bioinformatics**: DNA sequence analysis, gene finding
- **Data Compression**: Finding repeated patterns
- **Plagiarism Detection**: Document similarity
- **String Algorithms**: Longest common substring, suffix arrays
- **Search Engines**: Full-text search optimization

## Advantages

- **Linear Construction**: O(n) time with Ukkonen's algorithm
- **Fast Pattern Matching**: O(m + occ) for pattern search
- **Multiple Queries**: Efficient for multiple pattern searches
- **Rich Information**: Provides all suffix relationships
- **Versatile**: Solves many string problems efficiently

## Disadvantages

- **Space Complexity**: O(n²) space in worst case
- **Implementation Complexity**: Difficult to implement correctly
- **Practical Overhead**: Large constant factors
- **Memory Usage**: Can be memory-intensive for large texts

## Suffix Tree vs Alternatives

| Structure    | Construction    | Search     | Space           | Use Case          |
| ------------ | --------------- | ---------- | --------------- | ----------------- |
| Suffix Tree  | O(n)            | O(m + occ) | O(n²) worst     | Multiple patterns |
| Suffix Array | O(n log n)      | O(m log n) | O(n)            | Space-efficient   |
| Trie         | O(total length) | O(m)       | O(total length) | Dictionary lookup |
| KMP          | O(n + m)        | O(n + m)   | O(m)            | Single pattern    |

## Key Insights

Suffix Trees are most valuable when:

1. **Multiple pattern searches** are needed on the same text
2. **Complex string analysis** like finding repeats or common substrings
3. **Bioinformatics applications** requiring efficient sequence analysis
4. **Real-time applications** where preprocessing time can be amortized

The trade-off is high space usage and implementation complexity for extremely fast query performance on preprocessed text.
