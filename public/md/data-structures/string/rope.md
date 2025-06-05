# Rope Data Structure

A Rope is a tree-based data structure for efficiently storing and manipulating large strings. It provides much better performance than traditional string concatenation and substring operations, especially for large text documents.

## Structure

- **Leaf Nodes**: Contain actual string data (up to a maximum length)
- **Internal Nodes**: Store the total length of the left subtree
- **Binary Tree**: Each internal node has exactly two children
- **Concatenation**: Represented as tree operations rather than array operations

## Time Complexity

| Operation     | Rope         | String   |
| ------------- | ------------ | -------- |
| Concatenation | O(1)         | O(n + m) |
| Split         | O(log n)     | O(n)     |
| Insert        | O(log n)     | O(n)     |
| Delete        | O(log n)     | O(n)     |
| Index Access  | O(log n)     | O(1)     |
| Substring     | O(log n + k) | O(k)     |

## Implementation

```typescript
abstract class RopeNode {
  abstract length: number;
  abstract charAt(index: number): string;
  abstract substring(start: number, end: number): string;
  abstract toString(): string;
}

class RopeLeaf extends RopeNode {
  data: string;
  length: number;

  constructor(data: string) {
    super();
    this.data = data;
    this.length = data.length;
  }

  charAt(index: number): string {
    if (index < 0 || index >= this.length) {
      throw new Error("Index out of bounds");
    }
    return this.data[index];
  }

  substring(start: number, end: number): string {
    return this.data.substring(start, end);
  }

  toString(): string {
    return this.data;
  }
}

class RopeInternal extends RopeNode {
  left: RopeNode;
  right: RopeNode;
  length: number;
  leftLength: number;

  constructor(left: RopeNode, right: RopeNode) {
    super();
    this.left = left;
    this.right = right;
    this.leftLength = left.length;
    this.length = left.length + right.length;
  }

  charAt(index: number): string {
    if (index < 0 || index >= this.length) {
      throw new Error("Index out of bounds");
    }

    if (index < this.leftLength) {
      return this.left.charAt(index);
    } else {
      return this.right.charAt(index - this.leftLength);
    }
  }

  substring(start: number, end: number): string {
    if (start < 0 || end > this.length || start > end) {
      throw new Error("Invalid substring range");
    }

    if (end <= this.leftLength) {
      return this.left.substring(start, end);
    } else if (start >= this.leftLength) {
      return this.right.substring(
        start - this.leftLength,
        end - this.leftLength
      );
    } else {
      const leftPart = this.left.substring(start, this.leftLength);
      const rightPart = this.right.substring(0, end - this.leftLength);
      return leftPart + rightPart;
    }
  }

  toString(): string {
    return this.left.toString() + this.right.toString();
  }
}

class Rope {
  private root: RopeNode | null;
  private readonly maxLeafLength: number;

  constructor(initialString: string = "", maxLeafLength: number = 8) {
    this.maxLeafLength = maxLeafLength;
    this.root = initialString ? new RopeLeaf(initialString) : null;
  }

  static fromString(str: string, maxLeafLength: number = 8): Rope {
    const rope = new Rope("", maxLeafLength);
    if (str.length > 0) {
      rope.root = rope.buildFromString(str);
    }
    return rope;
  }

  private buildFromString(str: string): RopeNode {
    if (str.length <= this.maxLeafLength) {
      return new RopeLeaf(str);
    }

    const mid = Math.floor(str.length / 2);
    const left = this.buildFromString(str.substring(0, mid));
    const right = this.buildFromString(str.substring(mid));
    return new RopeInternal(left, right);
  }

  length(): number {
    return this.root ? this.root.length : 0;
  }

  charAt(index: number): string {
    if (!this.root) {
      throw new Error("Index out of bounds");
    }
    return this.root.charAt(index);
  }

  substring(start: number, end?: number): string {
    if (!this.root) return "";

    const actualEnd = end !== undefined ? end : this.root.length;
    return this.root.substring(start, actualEnd);
  }

  concat(other: Rope): Rope {
    const result = new Rope("", this.maxLeafLength);

    if (!this.root && !other.root) {
      return result;
    } else if (!this.root) {
      result.root = other.root;
    } else if (!other.root) {
      result.root = this.root;
    } else {
      result.root = new RopeInternal(this.root, other.root);
    }

    return result;
  }

  insert(index: number, str: string): Rope {
    if (index < 0 || index > this.length()) {
      throw new Error("Index out of bounds");
    }

    if (str.length === 0) {
      return this.clone();
    }

    const newRope = Rope.fromString(str, this.maxLeafLength);

    if (index === 0) {
      return newRope.concat(this);
    } else if (index === this.length()) {
      return this.concat(newRope);
    } else {
      const left = this.substring(0, index);
      const right = this.substring(index);
      return Rope.fromString(left, this.maxLeafLength)
        .concat(newRope)
        .concat(Rope.fromString(right, this.maxLeafLength));
    }
  }

  delete(start: number, end: number): Rope {
    if (start < 0 || end > this.length() || start > end) {
      throw new Error("Invalid range");
    }

    if (start === end) {
      return this.clone();
    }

    const before = start > 0 ? this.substring(0, start) : "";
    const after = end < this.length() ? this.substring(end) : "";

    return Rope.fromString(before + after, this.maxLeafLength);
  }

  split(index: number): [Rope, Rope] {
    if (index < 0 || index > this.length()) {
      throw new Error("Index out of bounds");
    }

    const left = Rope.fromString(this.substring(0, index), this.maxLeafLength);
    const right = Rope.fromString(this.substring(index), this.maxLeafLength);

    return [left, right];
  }

  indexOf(searchStr: string, fromIndex: number = 0): number {
    const fullString = this.toString();
    return fullString.indexOf(searchStr, fromIndex);
  }

  lastIndexOf(searchStr: string, fromIndex?: number): number {
    const fullString = this.toString();
    return fullString.lastIndexOf(searchStr, fromIndex);
  }

  replace(searchStr: string, replaceStr: string): Rope {
    const fullString = this.toString();
    const newString = fullString.replace(searchStr, replaceStr);
    return Rope.fromString(newString, this.maxLeafLength);
  }

  replaceAll(searchStr: string, replaceStr: string): Rope {
    const fullString = this.toString();
    const newString = fullString.replaceAll(searchStr, replaceStr);
    return Rope.fromString(newString, this.maxLeafLength);
  }

  toString(): string {
    return this.root ? this.root.toString() : "";
  }

  clone(): Rope {
    return Rope.fromString(this.toString(), this.maxLeafLength);
  }

  rebalance(): Rope {
    const leaves: string[] = [];
    this.collectLeaves(this.root, leaves);
    const fullString = leaves.join("");
    return Rope.fromString(fullString, this.maxLeafLength);
  }

  private collectLeaves(node: RopeNode | null, leaves: string[]): void {
    if (!node) return;

    if (node instanceof RopeLeaf) {
      leaves.push(node.data);
    } else if (node instanceof RopeInternal) {
      this.collectLeaves(node.left, leaves);
      this.collectLeaves(node.right, leaves);
    }
  }

  depth(): number {
    return this.getDepth(this.root);
  }

  private getDepth(node: RopeNode | null): number {
    if (!node || node instanceof RopeLeaf) {
      return 1;
    }

    const internal = node as RopeInternal;
    return (
      1 + Math.max(this.getDepth(internal.left), this.getDepth(internal.right))
    );
  }

  getStats(): { length: number; depth: number; leafCount: number } {
    const leafCount = this.countLeaves(this.root);
    return {
      length: this.length(),
      depth: this.depth(),
      leafCount,
    };
  }

  private countLeaves(node: RopeNode | null): number {
    if (!node) return 0;
    if (node instanceof RopeLeaf) return 1;

    const internal = node as RopeInternal;
    return this.countLeaves(internal.left) + this.countLeaves(internal.right);
  }
}
```

## Usage Examples

```typescript
const rope1 = Rope.fromString("Hello, ");
const rope2 = Rope.fromString("World!");
const combined = rope1.concat(rope2);

console.log(combined.toString()); // "Hello, World!"
console.log(combined.length()); // 13

console.log(combined.charAt(7)); // "W"
console.log(combined.substring(0, 5)); // "Hello"

const inserted = combined.insert(7, "beautiful ");
console.log(inserted.toString()); // "Hello, beautiful World!"

const deleted = inserted.delete(7, 17);
console.log(deleted.toString()); // "Hello, World!"

const [left, right] = combined.split(7);
console.log(left.toString()); // "Hello, "
console.log(right.toString()); // "World!"

console.log(combined.indexOf("World")); // 7
console.log(combined.indexOf("foo")); // -1

const stats = combined.getStats();
console.log(stats); // { length: 13, depth: 2, leafCount: 2 }
```

## Advanced Text Editor Implementation

```typescript
class TextEditor {
  private content: Rope;
  private undoStack: Rope[];
  private redoStack: Rope[];
  private maxUndoLevels: number;

  constructor(initialText: string = "", maxUndoLevels: number = 100) {
    this.content = Rope.fromString(initialText);
    this.undoStack = [];
    this.redoStack = [];
    this.maxUndoLevels = maxUndoLevels;
  }

  getText(): string {
    return this.content.toString();
  }

  getLength(): number {
    return this.content.length();
  }

  insertText(position: number, text: string): void {
    this.saveState();
    this.content = this.content.insert(position, text);
  }

  deleteText(start: number, end: number): void {
    this.saveState();
    this.content = this.content.delete(start, end);
  }

  replaceText(start: number, end: number, newText: string): void {
    this.saveState();
    this.content = this.content.delete(start, end).insert(start, newText);
  }

  findText(searchText: string): number[] {
    const positions: number[] = [];
    const text = this.content.toString();
    let index = 0;

    while (index < text.length) {
      const found = text.indexOf(searchText, index);
      if (found === -1) break;
      positions.push(found);
      index = found + 1;
    }

    return positions;
  }

  replaceAll(searchText: string, replaceText: string): number {
    const positions = this.findText(searchText);
    if (positions.length === 0) return 0;

    this.saveState();
    this.content = this.content.replaceAll(searchText, replaceText);
    return positions.length;
  }

  getLine(lineNumber: number): string {
    const lines = this.content.toString().split("\n");
    return lineNumber < lines.length ? lines[lineNumber] : "";
  }

  getLineCount(): number {
    return this.content.toString().split("\n").length;
  }

  undo(): boolean {
    if (this.undoStack.length === 0) return false;

    this.redoStack.push(this.content);
    this.content = this.undoStack.pop()!;
    return true;
  }

  redo(): boolean {
    if (this.redoStack.length === 0) return false;

    this.undoStack.push(this.content);
    this.content = this.redoStack.pop()!;
    return true;
  }

  private saveState(): void {
    this.undoStack.push(this.content);
    this.redoStack = [];

    if (this.undoStack.length > this.maxUndoLevels) {
      this.undoStack.shift();
    }
  }

  getStats() {
    return {
      ...this.content.getStats(),
      undoLevels: this.undoStack.length,
      redoLevels: this.redoStack.length,
    };
  }
}
```

## Usage in Text Editor

```typescript
const editor = new TextEditor("Hello World");

console.log(editor.getText()); // "Hello World"

editor.insertText(5, ", beautiful");
console.log(editor.getText()); // "Hello, beautiful World"

editor.deleteText(5, 16);
console.log(editor.getText()); // "Hello World"

const positions = editor.findText("o");
console.log(positions); // [4, 7]

editor.replaceAll("o", "0");
console.log(editor.getText()); // "Hell0 W0rld"

editor.undo();
console.log(editor.getText()); // "Hello World"

editor.redo();
console.log(editor.getText()); // "Hell0 W0rld"
```

## Rope-based String Buffer

```typescript
class RopeStringBuffer {
  private rope: Rope;

  constructor() {
    this.rope = new Rope();
  }

  append(str: string): RopeStringBuffer {
    this.rope = this.rope.concat(Rope.fromString(str));
    return this;
  }

  prepend(str: string): RopeStringBuffer {
    this.rope = Rope.fromString(str).concat(this.rope);
    return this;
  }

  insert(index: number, str: string): RopeStringBuffer {
    this.rope = this.rope.insert(index, str);
    return this;
  }

  delete(start: number, end: number): RopeStringBuffer {
    this.rope = this.rope.delete(start, end);
    return this;
  }

  charAt(index: number): string {
    return this.rope.charAt(index);
  }

  substring(start: number, end?: number): string {
    return this.rope.substring(start, end);
  }

  indexOf(searchStr: string): number {
    return this.rope.indexOf(searchStr);
  }

  replace(searchStr: string, replaceStr: string): RopeStringBuffer {
    this.rope = this.rope.replace(searchStr, replaceStr);
    return this;
  }

  length(): number {
    return this.rope.length();
  }

  toString(): string {
    return this.rope.toString();
  }

  clear(): RopeStringBuffer {
    this.rope = new Rope();
    return this;
  }
}
```

## Advantages

- **Efficient Concatenation**: O(1) time complexity
- **Efficient Insertions**: O(log n) instead of O(n)
- **Memory Efficient**: Shared subtrees reduce memory usage
- **Persistent**: Operations create new ropes without modifying originals
- **Scalable**: Handles very large strings efficiently

## Disadvantages

- **Random Access**: O(log n) vs O(1) for arrays
- **Memory Overhead**: Tree structure requires additional pointers
- **Implementation Complexity**: More complex than simple strings
- **Cache Performance**: May have worse cache locality

## Applications

- **Text Editors**: Efficient editing of large documents
- **Version Control**: Git uses rope-like structures
- **Collaborative Editing**: Concurrent text modifications
- **String Processing**: Large-scale text manipulation
- **Programming Languages**: Immutable string implementations

## Performance Comparison

| Operation        | String | Rope         | Scenario               |
| ---------------- | ------ | ------------ | ---------------------- |
| Concat "A" + "B" | O(n+m) | O(1)         | Frequent concatenation |
| Insert at middle | O(n)   | O(log n)     | Text editing           |
| Random access    | O(1)   | O(log n)     | Character lookup       |
| Substring        | O(k)   | O(log n + k) | Extract portions       |

## Key Insights

Ropes excel in scenarios involving:

1. **Large text documents** where traditional string operations become expensive
2. **Frequent concatenations** and insertions in the middle of strings
3. **Undo/redo systems** where immutability is beneficial
4. **Collaborative editing** where multiple users modify text simultaneously

The trade-off is slower random access in exchange for much faster modification operations, making ropes ideal for text editors and document processing systems where edit operations far outnumber character access operations.
