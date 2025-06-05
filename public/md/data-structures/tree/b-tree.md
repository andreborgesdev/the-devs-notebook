# B-Tree

A B-Tree is a self-balancing tree data structure that maintains sorted data and allows searches, sequential access, insertions, and deletions in logarithmic time. It's specifically designed for systems that read and write large blocks of data, making it ideal for databases and file systems.

## Properties

1. **Minimum Degree (t)**: Defines the range of keys per node
2. **Node Capacity**: Internal nodes can have at most 2t-1 keys
3. **Child Pointers**: Internal nodes with k keys have k+1 children
4. **Balanced Height**: All leaves are at the same level
5. **Sorted Keys**: Keys within each node are sorted
6. **Root Special Case**: Root can have fewer than t-1 keys

## Time Complexity

| Operation | Time Complexity |
| --------- | --------------- |
| Search    | O(log n)        |
| Insert    | O(log n)        |
| Delete    | O(log n)        |
| Space     | O(n)            |

## Implementation

```typescript
class BTreeNode<T> {
  keys: T[];
  children: BTreeNode<T>[];
  isLeaf: boolean;
  minDegree: number;

  constructor(minDegree: number, isLeaf: boolean = false) {
    this.keys = [];
    this.children = [];
    this.isLeaf = isLeaf;
    this.minDegree = minDegree;
  }

  isFull(): boolean {
    return this.keys.length === 2 * this.minDegree - 1;
  }
}

class BTree<T> {
  private root: BTreeNode<T>;
  private minDegree: number;

  constructor(minDegree: number) {
    this.minDegree = minDegree;
    this.root = new BTreeNode<T>(minDegree, true);
  }

  search(key: T): boolean {
    return this.searchNode(this.root, key) !== null;
  }

  private searchNode(node: BTreeNode<T>, key: T): BTreeNode<T> | null {
    let i = 0;

    while (i < node.keys.length && key > node.keys[i]) {
      i++;
    }

    if (i < node.keys.length && key === node.keys[i]) {
      return node;
    }

    if (node.isLeaf) {
      return null;
    }

    return this.searchNode(node.children[i], key);
  }

  insert(key: T): void {
    if (this.root.isFull()) {
      const newRoot = new BTreeNode<T>(this.minDegree, false);
      newRoot.children.push(this.root);
      this.splitChild(newRoot, 0);
      this.root = newRoot;
    }

    this.insertNonFull(this.root, key);
  }

  private insertNonFull(node: BTreeNode<T>, key: T): void {
    let i = node.keys.length - 1;

    if (node.isLeaf) {
      node.keys.push(null as any);

      while (i >= 0 && key < node.keys[i]) {
        node.keys[i + 1] = node.keys[i];
        i--;
      }

      node.keys[i + 1] = key;
    } else {
      while (i >= 0 && key < node.keys[i]) {
        i--;
      }
      i++;

      if (node.children[i].isFull()) {
        this.splitChild(node, i);

        if (key > node.keys[i]) {
          i++;
        }
      }

      this.insertNonFull(node.children[i], key);
    }
  }

  private splitChild(parent: BTreeNode<T>, index: number): void {
    const fullChild = parent.children[index];
    const newChild = new BTreeNode<T>(this.minDegree, fullChild.isLeaf);
    const mid = this.minDegree - 1;

    for (let i = 0; i < mid; i++) {
      newChild.keys.push(fullChild.keys[i + this.minDegree]);
    }

    if (!fullChild.isLeaf) {
      for (let i = 0; i < this.minDegree; i++) {
        newChild.children.push(fullChild.children[i + this.minDegree]);
      }
    }

    parent.children.splice(index + 1, 0, newChild);
    parent.keys.splice(index, 0, fullChild.keys[mid]);

    fullChild.keys.splice(mid);
    if (!fullChild.isLeaf) {
      fullChild.children.splice(this.minDegree);
    }
  }

  delete(key: T): boolean {
    const deleted = this.deleteFromNode(this.root, key);

    if (this.root.keys.length === 0 && !this.root.isLeaf) {
      this.root = this.root.children[0];
    }

    return deleted;
  }

  private deleteFromNode(node: BTreeNode<T>, key: T): boolean {
    let i = 0;

    while (i < node.keys.length && key > node.keys[i]) {
      i++;
    }

    if (i < node.keys.length && key === node.keys[i]) {
      if (node.isLeaf) {
        node.keys.splice(i, 1);
        return true;
      } else {
        return this.deleteInternalNode(node, key, i);
      }
    } else if (!node.isLeaf) {
      const shouldDeleteFromSubtree =
        i === node.keys.length || key < node.keys[i];

      if (node.children[i].keys.length < this.minDegree) {
        this.ensureMinDegree(node, i);

        if (i > node.keys.length) {
          i--;
        }
      }

      return this.deleteFromNode(node.children[i], key);
    }

    return false;
  }

  private deleteInternalNode(
    node: BTreeNode<T>,
    key: T,
    index: number
  ): boolean {
    if (node.children[index].keys.length >= this.minDegree) {
      const predecessor = this.getPredecessor(node.children[index]);
      node.keys[index] = predecessor;
      return this.deleteFromNode(node.children[index], predecessor);
    } else if (node.children[index + 1].keys.length >= this.minDegree) {
      const successor = this.getSuccessor(node.children[index + 1]);
      node.keys[index] = successor;
      return this.deleteFromNode(node.children[index + 1], successor);
    } else {
      this.mergeChildren(node, index);
      return this.deleteFromNode(node.children[index], key);
    }
  }

  private getPredecessor(node: BTreeNode<T>): T {
    while (!node.isLeaf) {
      node = node.children[node.children.length - 1];
    }
    return node.keys[node.keys.length - 1];
  }

  private getSuccessor(node: BTreeNode<T>): T {
    while (!node.isLeaf) {
      node = node.children[0];
    }
    return node.keys[0];
  }

  private ensureMinDegree(parent: BTreeNode<T>, index: number): void {
    if (
      index !== 0 &&
      parent.children[index - 1].keys.length >= this.minDegree
    ) {
      this.borrowFromPrev(parent, index);
    } else if (
      index !== parent.children.length - 1 &&
      parent.children[index + 1].keys.length >= this.minDegree
    ) {
      this.borrowFromNext(parent, index);
    } else {
      if (index !== parent.children.length - 1) {
        this.mergeChildren(parent, index);
      } else {
        this.mergeChildren(parent, index - 1);
      }
    }
  }

  private borrowFromPrev(parent: BTreeNode<T>, index: number): void {
    const child = parent.children[index];
    const sibling = parent.children[index - 1];

    child.keys.unshift(parent.keys[index - 1]);

    if (!child.isLeaf) {
      child.children.unshift(sibling.children.pop()!);
    }

    parent.keys[index - 1] = sibling.keys.pop()!;
  }

  private borrowFromNext(parent: BTreeNode<T>, index: number): void {
    const child = parent.children[index];
    const sibling = parent.children[index + 1];

    child.keys.push(parent.keys[index]);

    if (!child.isLeaf) {
      child.children.push(sibling.children.shift()!);
    }

    parent.keys[index] = sibling.keys.shift()!;
  }

  private mergeChildren(parent: BTreeNode<T>, index: number): void {
    const child = parent.children[index];
    const sibling = parent.children[index + 1];

    child.keys.push(parent.keys[index]);
    child.keys.push(...sibling.keys);

    if (!child.isLeaf) {
      child.children.push(...sibling.children);
    }

    parent.keys.splice(index, 1);
    parent.children.splice(index + 1, 1);
  }

  traverse(): T[] {
    const result: T[] = [];
    this.traverseNode(this.root, result);
    return result;
  }

  private traverseNode(node: BTreeNode<T>, result: T[]): void {
    let i = 0;

    while (i < node.keys.length) {
      if (!node.isLeaf) {
        this.traverseNode(node.children[i], result);
      }
      result.push(node.keys[i]);
      i++;
    }

    if (!node.isLeaf) {
      this.traverseNode(node.children[i], result);
    }
  }

  height(): number {
    return this.getHeight(this.root);
  }

  private getHeight(node: BTreeNode<T>): number {
    if (node.isLeaf) {
      return 1;
    }
    return 1 + this.getHeight(node.children[0]);
  }

  isEmpty(): boolean {
    return this.root.keys.length === 0;
  }

  size(): number {
    return this.getSizeHelper(this.root);
  }

  private getSizeHelper(node: BTreeNode<T>): number {
    let count = node.keys.length;

    if (!node.isLeaf) {
      for (const child of node.children) {
        count += this.getSizeHelper(child);
      }
    }

    return count;
  }

  findMin(): T | null {
    if (this.isEmpty()) return null;

    let current = this.root;
    while (!current.isLeaf) {
      current = current.children[0];
    }

    return current.keys[0];
  }

  findMax(): T | null {
    if (this.isEmpty()) return null;

    let current = this.root;
    while (!current.isLeaf) {
      current = current.children[current.children.length - 1];
    }

    return current.keys[current.keys.length - 1];
  }
}
```

## Usage Examples

```typescript
const btree = new BTree<number>(3);

const values = [10, 20, 5, 6, 12, 30, 7, 17];
values.forEach((val) => btree.insert(val));

console.log(btree.traverse()); // [5, 6, 7, 10, 12, 17, 20, 30]

console.log(btree.search(12)); // true
console.log(btree.search(15)); // false

console.log(`Height: ${btree.height()}`); // Height: 2
console.log(`Size: ${btree.size()}`); // Size: 8

console.log(`Min: ${btree.findMin()}`); // Min: 5
console.log(`Max: ${btree.findMax()}`); // Max: 30

btree.delete(6);
console.log(btree.traverse()); // [5, 7, 10, 12, 17, 20, 30]

btree.delete(12);
console.log(btree.traverse()); // [5, 7, 10, 17, 20, 30]
```

## B+ Tree Variant

```typescript
class BPlusTreeNode<T> {
  keys: T[];
  children: BPlusTreeNode<T>[];
  next: BPlusTreeNode<T> | null;
  isLeaf: boolean;
  minDegree: number;

  constructor(minDegree: number, isLeaf: boolean = false) {
    this.keys = [];
    this.children = [];
    this.next = null;
    this.isLeaf = isLeaf;
    this.minDegree = minDegree;
  }
}

class BPlusTree<T> extends BTree<T> {
  rangeQuery(start: T, end: T): T[] {
    const result: T[] = [];
    let current = this.findLeafNode(start);

    while (current) {
      for (const key of current.keys) {
        if (key >= start && key <= end) {
          result.push(key);
        } else if (key > end) {
          return result;
        }
      }
      current = (current as any).next;
    }

    return result;
  }

  private findLeafNode(key: T): BPlusTreeNode<T> | null {
    let current: any = this.root;

    while (!current.isLeaf) {
      let i = 0;
      while (i < current.keys.length && key >= current.keys[i]) {
        i++;
      }
      current = current.children[i];
    }

    return current;
  }
}
```

## Advanced Operations

```typescript
class BTreeWithRangeOps<T> extends BTree<T> {
  findRange(min: T, max: T): T[] {
    const result: T[] = [];
    this.findRangeHelper(this.root, min, max, result);
    return result;
  }

  private findRangeHelper(
    node: BTreeNode<T>,
    min: T,
    max: T,
    result: T[]
  ): void {
    let i = 0;

    while (i < node.keys.length) {
      if (!node.isLeaf && node.keys[i] > min) {
        this.findRangeHelper(node.children[i], min, max, result);
      }

      if (node.keys[i] >= min && node.keys[i] <= max) {
        result.push(node.keys[i]);
      }

      i++;
    }

    if (
      !node.isLeaf &&
      (node.keys.length === 0 || max > node.keys[node.keys.length - 1])
    ) {
      this.findRangeHelper(node.children[i], min, max, result);
    }
  }

  countInRange(min: T, max: T): number {
    return this.findRange(min, max).length;
  }

  findKthSmallest(k: number): T | null {
    const allKeys = this.traverse();
    return k <= allKeys.length ? allKeys[k - 1] : null;
  }

  findKthLargest(k: number): T | null {
    const allKeys = this.traverse();
    return k <= allKeys.length ? allKeys[allKeys.length - k] : null;
  }
}
```

## Advantages

- **Optimal for Disk Storage**: Minimizes disk I/O operations
- **High Branching Factor**: Reduces tree height
- **Sequential Access**: Efficient range queries
- **Guaranteed Performance**: All operations are O(log n)
- **Self-Balancing**: Maintains optimal structure automatically

## Disadvantages

- **Complex Implementation**: More complex than binary trees
- **Memory Overhead**: Requires more memory per node
- **Cache Misses**: Large nodes may not fit in CPU cache
- **Overkill for Small Data**: Binary trees may be more efficient

## Applications

- **Database Systems**: MySQL, PostgreSQL B+ tree indexes
- **File Systems**: NTFS, ext4, Btrfs directory structures
- **Operating Systems**: Virtual memory management
- **Search Engines**: Inverted index structures
- **Big Data**: Distributed storage systems

## B-Tree Variants

| Variant  | Key Difference      | Use Case                    |
| -------- | ------------------- | --------------------------- |
| B-Tree   | Data in all nodes   | General purpose             |
| B+ Tree  | Data only in leaves | Database indexes            |
| B\* Tree | Higher fill factor  | Space-critical applications |
| 2-3 Tree | Special case (t=2)  | Educational purposes        |

## Performance Comparison

| Tree Type | Height   | Search   | Insert   | Delete   | Range Query  |
| --------- | -------- | -------- | -------- | -------- | ------------ |
| BST       | O(n)     | O(n)     | O(n)     | O(n)     | O(n)         |
| AVL       | O(log n) | O(log n) | O(log n) | O(log n) | O(n)         |
| B-Tree    | O(log n) | O(log n) | O(log n) | O(log n) | O(log n + k) |

## Key Insights

B-Trees are specifically designed for storage systems where the cost of accessing a node is much higher than processing it. They minimize the number of disk accesses by:

1. **Maximizing branching factor** to reduce height
2. **Storing multiple keys per node** to amortize access cost
3. **Maintaining balance** to guarantee performance
4. **Supporting range operations** efficiently

This makes them the foundation of most modern database systems and file systems, where they enable efficient storage and retrieval of large amounts of data.
