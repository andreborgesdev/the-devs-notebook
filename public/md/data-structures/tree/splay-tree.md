# Splay Tree

A Splay Tree is a self-adjusting binary search tree where recently accessed elements are moved to the root through a series of tree rotations called "splaying". This provides excellent performance for sequences of operations that exhibit temporal locality.

## Key Concept

Every time a node is accessed (searched, inserted, or deleted), it's moved to the root through rotations. This ensures frequently accessed elements are near the root, providing faster access times.

## Time Complexity

| Operation | Amortized | Worst Case |
| --------- | --------- | ---------- |
| Search    | O(log n)  | O(n)       |
| Insert    | O(log n)  | O(n)       |
| Delete    | O(log n)  | O(n)       |
| Space     | O(n)      | O(n)       |

## Splaying Operations

1. **Zig**: Node is child of root
2. **Zig-Zig**: Node and parent are both left/right children
3. **Zig-Zag**: Node is left child of right child (or vice versa)

## Implementation

```typescript
class SplayNode<T> {
  data: T;
  left: SplayNode<T> | null;
  right: SplayNode<T> | null;
  parent: SplayNode<T> | null;

  constructor(data: T) {
    this.data = data;
    this.left = null;
    this.right = null;
    this.parent = null;
  }
}

class SplayTree<T> {
  private root: SplayNode<T> | null;

  constructor() {
    this.root = null;
  }

  private rightRotate(x: SplayNode<T>): SplayNode<T> {
    const y = x.left!;
    x.left = y.right;

    if (y.right) {
      y.right.parent = x;
    }

    y.parent = x.parent;

    if (!x.parent) {
      this.root = y;
    } else if (x === x.parent.right) {
      x.parent.right = y;
    } else {
      x.parent.left = y;
    }

    y.right = x;
    x.parent = y;

    return y;
  }

  private leftRotate(x: SplayNode<T>): SplayNode<T> {
    const y = x.right!;
    x.right = y.left;

    if (y.left) {
      y.left.parent = x;
    }

    y.parent = x.parent;

    if (!x.parent) {
      this.root = y;
    } else if (x === x.parent.left) {
      x.parent.left = y;
    } else {
      x.parent.right = y;
    }

    y.left = x;
    x.parent = y;

    return y;
  }

  private splay(node: SplayNode<T>): void {
    while (node.parent) {
      if (!node.parent.parent) {
        if (node.parent.left === node) {
          this.rightRotate(node.parent);
        } else {
          this.leftRotate(node.parent);
        }
      } else if (
        node.parent.left === node &&
        node.parent.parent.left === node.parent
      ) {
        this.rightRotate(node.parent.parent);
        this.rightRotate(node.parent);
      } else if (
        node.parent.right === node &&
        node.parent.parent.right === node.parent
      ) {
        this.leftRotate(node.parent.parent);
        this.leftRotate(node.parent);
      } else if (
        node.parent.left === node &&
        node.parent.parent.right === node.parent
      ) {
        this.rightRotate(node.parent);
        this.leftRotate(node.parent);
      } else {
        this.leftRotate(node.parent);
        this.rightRotate(node.parent);
      }
    }
  }

  search(data: T): boolean {
    const node = this.searchNode(data);
    if (node) {
      this.splay(node);
      return true;
    }
    return false;
  }

  private searchNode(data: T): SplayNode<T> | null {
    let current = this.root;

    while (current) {
      if (data === current.data) {
        return current;
      } else if (data < current.data) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    return null;
  }

  insert(data: T): void {
    if (!this.root) {
      this.root = new SplayNode(data);
      return;
    }

    let current = this.root;
    let parent: SplayNode<T> | null = null;

    while (current) {
      parent = current;
      if (data < current.data) {
        current = current.left;
      } else if (data > current.data) {
        current = current.right;
      } else {
        this.splay(current);
        return;
      }
    }

    const newNode = new SplayNode(data);
    newNode.parent = parent;

    if (data < parent!.data) {
      parent!.left = newNode;
    } else {
      parent!.right = newNode;
    }

    this.splay(newNode);
  }

  delete(data: T): boolean {
    const node = this.searchNode(data);
    if (!node) {
      return false;
    }

    this.splay(node);

    if (!node.left) {
      this.transplant(node, node.right);
    } else if (!node.right) {
      this.transplant(node, node.left);
    } else {
      const successor = this.minimum(node.right);
      if (successor.parent !== node) {
        this.transplant(successor, successor.right);
        successor.right = node.right;
        successor.right.parent = successor;
      }
      this.transplant(node, successor);
      successor.left = node.left;
      successor.left.parent = successor;
    }

    return true;
  }

  private transplant(u: SplayNode<T>, v: SplayNode<T> | null): void {
    if (!u.parent) {
      this.root = v;
    } else if (u === u.parent.left) {
      u.parent.left = v;
    } else {
      u.parent.right = v;
    }

    if (v) {
      v.parent = u.parent;
    }
  }

  private minimum(node: SplayNode<T>): SplayNode<T> {
    while (node.left) {
      node = node.left;
    }
    return node;
  }

  private maximum(node: SplayNode<T>): SplayNode<T> {
    while (node.right) {
      node = node.right;
    }
    return node;
  }

  findMin(): T | null {
    if (!this.root) return null;

    const minNode = this.minimum(this.root);
    this.splay(minNode);
    return minNode.data;
  }

  findMax(): T | null {
    if (!this.root) return null;

    const maxNode = this.maximum(this.root);
    this.splay(maxNode);
    return maxNode.data;
  }

  inOrderTraversal(): T[] {
    const result: T[] = [];
    this.inOrderHelper(this.root, result);
    return result;
  }

  private inOrderHelper(node: SplayNode<T> | null, result: T[]): void {
    if (node) {
      this.inOrderHelper(node.left, result);
      result.push(node.data);
      this.inOrderHelper(node.right, result);
    }
  }

  preOrderTraversal(): T[] {
    const result: T[] = [];
    this.preOrderHelper(this.root, result);
    return result;
  }

  private preOrderHelper(node: SplayNode<T> | null, result: T[]): void {
    if (node) {
      result.push(node.data);
      this.preOrderHelper(node.left, result);
      this.preOrderHelper(node.right, result);
    }
  }

  getRoot(): T | null {
    return this.root ? this.root.data : null;
  }

  isEmpty(): boolean {
    return this.root === null;
  }

  size(): number {
    return this.sizeHelper(this.root);
  }

  private sizeHelper(node: SplayNode<T> | null): number {
    if (!node) return 0;
    return 1 + this.sizeHelper(node.left) + this.sizeHelper(node.right);
  }
}
```

## Usage Examples

```typescript
const splayTree = new SplayTree<number>();

splayTree.insert(10);
splayTree.insert(5);
splayTree.insert(15);
splayTree.insert(3);
splayTree.insert(7);

console.log(splayTree.getRoot()); // 7 (last inserted becomes root)

splayTree.search(3);
console.log(splayTree.getRoot()); // 3 (searched element becomes root)

console.log(splayTree.inOrderTraversal()); // [3, 5, 7, 10, 15]

splayTree.delete(5);
console.log(splayTree.inOrderTraversal()); // [3, 7, 10, 15]

const min = splayTree.findMin();
console.log(`Min: ${min}`); // Min: 3
console.log(splayTree.getRoot()); // 3 (min element becomes root after findMin)

const max = splayTree.findMax();
console.log(`Max: ${max}`); // Max: 15
console.log(splayTree.getRoot()); // 15 (max element becomes root after findMax)
```

## Advanced Features

```typescript
class SplayTreeWithStats<T> extends SplayTree<T> {
  private accessCount: Map<T, number>;

  constructor() {
    super();
    this.accessCount = new Map();
  }

  search(data: T): boolean {
    const found = super.search(data);
    if (found) {
      this.accessCount.set(data, (this.accessCount.get(data) || 0) + 1);
    }
    return found;
  }

  insert(data: T): void {
    super.insert(data);
    this.accessCount.set(data, (this.accessCount.get(data) || 0) + 1);
  }

  getAccessCount(data: T): number {
    return this.accessCount.get(data) || 0;
  }

  getMostAccessed(): T | null {
    let maxCount = 0;
    let mostAccessed: T | null = null;

    for (const [data, count] of this.accessCount) {
      if (count > maxCount) {
        maxCount = count;
        mostAccessed = data;
      }
    }

    return mostAccessed;
  }

  getAccessStats(): Array<{ data: T; count: number }> {
    return Array.from(this.accessCount.entries())
      .map(([data, count]) => ({ data, count }))
      .sort((a, b) => b.count - a.count);
  }
}
```

## Splay Tree Operations Visualization

```typescript
class VisualizableSplayTree<T> extends SplayTree<T> {
  private operations: string[];

  constructor() {
    super();
    this.operations = [];
  }

  insert(data: T): void {
    this.operations.push(`INSERT(${data})`);
    super.insert(data);
    this.operations.push(`ROOT: ${this.getRoot()}`);
  }

  search(data: T): boolean {
    this.operations.push(`SEARCH(${data})`);
    const result = super.search(data);
    this.operations.push(`ROOT: ${this.getRoot()}, FOUND: ${result}`);
    return result;
  }

  delete(data: T): boolean {
    this.operations.push(`DELETE(${data})`);
    const result = super.delete(data);
    this.operations.push(`ROOT: ${this.getRoot()}, DELETED: ${result}`);
    return result;
  }

  getOperationHistory(): string[] {
    return [...this.operations];
  }

  clearHistory(): void {
    this.operations = [];
  }
}
```

## Advantages

- **Adaptive Performance**: Frequently accessed elements are faster to access
- **Simple Implementation**: No complex balancing rules
- **Temporal Locality**: Excellent for access patterns with locality
- **Self-Optimizing**: Automatically adjusts to usage patterns
- **Amortized Efficiency**: Good average performance over sequences

## Disadvantages

- **Worst-Case Performance**: Can degrade to O(n) for single operations
- **Tree Shape Instability**: Structure changes with every access
- **Not Suitable for All Patterns**: Poor for uniform random access
- **Memory Overhead**: Parent pointers required

## Applications

- **Caches**: LRU-like behavior for frequently accessed data
- **Compilers**: Symbol tables with locality of reference
- **Text Editors**: Recently accessed documents/functions
- **Database Systems**: Index structures for temporal data
- **Operating Systems**: Page replacement algorithms

## Splay Tree vs Other Trees

| Feature           | Splay Tree | AVL Tree | Red-Black Tree |
| ----------------- | ---------- | -------- | -------------- |
| Balance Guarantee | No         | Yes      | Yes            |
| Worst Case        | O(n)       | O(log n) | O(log n)       |
| Amortized         | O(log n)   | O(log n) | O(log n)       |
| Access Adaptation | Yes        | No       | No             |
| Implementation    | Simple     | Complex  | Medium         |
| Memory            | O(n)       | O(n)     | O(n)           |

## Key Insights

Splay Trees excel in scenarios with temporal locality where recently accessed elements are likely to be accessed again soon. They're particularly effective for:

1. **Cache-like structures** where recent items are hot
2. **Compiler symbol tables** where variables are accessed in clusters
3. **Text processing** where certain words/phrases are accessed repeatedly

The self-adjusting nature makes them a unique choice among tree structures, trading worst-case guarantees for adaptive performance that matches real-world access patterns.
