# Skip List

A Skip List is a probabilistic data structure that allows fast search, insertion, and deletion operations in a sorted sequence of elements. It uses multiple layers of linked lists with "express lanes" that skip over many elements, providing O(log n) expected time complexity.

## Structure

Skip Lists consist of multiple levels:

- **Level 0**: Contains all elements (base level)
- **Higher Levels**: Contain subsets of elements for faster traversal
- **Headers**: Sentinel nodes at the beginning of each level
- **Express Lanes**: Higher levels act as shortcuts

## Time Complexity

| Operation | Average  | Worst Case |
| --------- | -------- | ---------- |
| Search    | O(log n) | O(n)       |
| Insert    | O(log n) | O(n)       |
| Delete    | O(log n) | O(n)       |
| Space     | O(n)     | O(n log n) |

## Implementation

```typescript
class SkipListNode<T> {
  data: T;
  forward: (SkipListNode<T> | null)[];

  constructor(data: T, level: number) {
    this.data = data;
    this.forward = new Array(level + 1).fill(null);
  }
}

class SkipList<T> {
  private header: SkipListNode<T>;
  private maxLevel: number;
  private level: number;
  private probability: number;

  constructor(maxLevel: number = 16, probability: number = 0.5) {
    this.maxLevel = maxLevel;
    this.level = 0;
    this.probability = probability;
    this.header = new SkipListNode<T>(null as any, maxLevel);
  }

  private randomLevel(): number {
    let level = 0;
    while (Math.random() < this.probability && level < this.maxLevel) {
      level++;
    }
    return level;
  }

  search(target: T): SkipListNode<T> | null {
    let current = this.header;

    for (let i = this.level; i >= 0; i--) {
      while (
        current.forward[i] &&
        this.compare(current.forward[i]!.data, target) < 0
      ) {
        current = current.forward[i]!;
      }
    }

    current = current.forward[0];

    if (current && this.compare(current.data, target) === 0) {
      return current;
    }

    return null;
  }

  insert(data: T): void {
    const update: (SkipListNode<T> | null)[] = new Array(
      this.maxLevel + 1
    ).fill(null);
    let current = this.header;

    for (let i = this.level; i >= 0; i--) {
      while (
        current.forward[i] &&
        this.compare(current.forward[i]!.data, data) < 0
      ) {
        current = current.forward[i]!;
      }
      update[i] = current;
    }

    current = current.forward[0];

    if (!current || this.compare(current.data, data) !== 0) {
      const newLevel = this.randomLevel();

      if (newLevel > this.level) {
        for (let i = this.level + 1; i <= newLevel; i++) {
          update[i] = this.header;
        }
        this.level = newLevel;
      }

      const newNode = new SkipListNode(data, newLevel);

      for (let i = 0; i <= newLevel; i++) {
        newNode.forward[i] = update[i]!.forward[i];
        update[i]!.forward[i] = newNode;
      }
    }
  }

  delete(target: T): boolean {
    const update: (SkipListNode<T> | null)[] = new Array(
      this.maxLevel + 1
    ).fill(null);
    let current = this.header;

    for (let i = this.level; i >= 0; i--) {
      while (
        current.forward[i] &&
        this.compare(current.forward[i]!.data, target) < 0
      ) {
        current = current.forward[i]!;
      }
      update[i] = current;
    }

    current = current.forward[0];

    if (current && this.compare(current.data, target) === 0) {
      for (let i = 0; i <= this.level; i++) {
        if (update[i]!.forward[i] !== current) {
          break;
        }
        update[i]!.forward[i] = current.forward[i];
      }

      while (this.level > 0 && !this.header.forward[this.level]) {
        this.level--;
      }

      return true;
    }

    return false;
  }

  private compare(a: T, b: T): number {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }

  display(): void {
    for (let i = this.level; i >= 0; i--) {
      let current = this.header.forward[i];
      const levelData: T[] = [];

      while (current) {
        levelData.push(current.data);
        current = current.forward[i];
      }

      console.log(`Level ${i}: [${levelData.join(", ")}]`);
    }
  }

  toArray(): T[] {
    const result: T[] = [];
    let current = this.header.forward[0];

    while (current) {
      result.push(current.data);
      current = current.forward[0];
    }

    return result;
  }

  size(): number {
    let count = 0;
    let current = this.header.forward[0];

    while (current) {
      count++;
      current = current.forward[0];
    }

    return count;
  }

  isEmpty(): boolean {
    return this.header.forward[0] === null;
  }

  getFirst(): T | null {
    const firstNode = this.header.forward[0];
    return firstNode ? firstNode.data : null;
  }

  getLast(): T | null {
    let current = this.header;

    for (let i = this.level; i >= 0; i--) {
      while (current.forward[i]) {
        current = current.forward[i]!;
      }
    }

    return current === this.header ? null : current.data;
  }
}
```

## Usage Examples

```typescript
const skipList = new SkipList<number>();

skipList.insert(3);
skipList.insert(6);
skipList.insert(7);
skipList.insert(9);
skipList.insert(12);
skipList.insert(19);
skipList.insert(17);

console.log(skipList.toArray()); // [3, 6, 7, 9, 12, 17, 19]

skipList.display();
// Level 2: [6, 17]
// Level 1: [3, 6, 12, 17]
// Level 0: [3, 6, 7, 9, 12, 17, 19]

const found = skipList.search(12);
console.log(found ? "Found 12" : "Not found"); // Found 12

skipList.delete(7);
console.log(skipList.toArray()); // [3, 6, 9, 12, 17, 19]

console.log(`Size: ${skipList.size()}`); // Size: 6
console.log(`First: ${skipList.getFirst()}`); // First: 3
console.log(`Last: ${skipList.getLast()}`); // Last: 19
```

## Advanced Usage

```typescript
class SkipListWithRange<T> extends SkipList<T> {
  rangeQuery(start: T, end: T): T[] {
    const result: T[] = [];
    let current = this.header;

    for (let i = this.level; i >= 0; i--) {
      while (
        current.forward[i] &&
        this.compare(current.forward[i]!.data, start) < 0
      ) {
        current = current.forward[i]!;
      }
    }

    current = current.forward[0];

    while (current && this.compare(current.data, end) <= 0) {
      if (this.compare(current.data, start) >= 0) {
        result.push(current.data);
      }
      current = current.forward[0];
    }

    return result;
  }

  findPredecessor(target: T): T | null {
    let current = this.header;
    let predecessor: SkipListNode<T> | null = null;

    for (let i = this.level; i >= 0; i--) {
      while (
        current.forward[i] &&
        this.compare(current.forward[i]!.data, target) < 0
      ) {
        current = current.forward[i]!;
        predecessor = current;
      }
    }

    return predecessor && predecessor !== this.header ? predecessor.data : null;
  }

  findSuccessor(target: T): T | null {
    let current = this.header;

    for (let i = this.level; i >= 0; i--) {
      while (
        current.forward[i] &&
        this.compare(current.forward[i]!.data, target) <= 0
      ) {
        current = current.forward[i]!;
      }
    }

    return current.forward[0] ? current.forward[0].data : null;
  }
}
```

## Advantages

- **Probabilistic Balance**: No complex balancing operations required
- **Simple Implementation**: Easier to implement than balanced trees
- **Good Cache Performance**: Linear memory layout at base level
- **Concurrent Access**: Easier to make thread-safe than trees
- **Range Queries**: Efficient range operations

## Disadvantages

- **Random Performance**: Worst-case can be O(n)
- **Memory Overhead**: Extra pointers for higher levels
- **Not Deterministic**: Performance depends on random choices
- **Space Complexity**: Can use O(n log n) space in worst case

## Applications

- **Databases**: MemSQL, LevelDB use skip list variants
- **Redis**: Sorted sets implementation
- **Concurrent Programming**: Lock-free concurrent skip lists
- **Game Development**: Efficient sorted collections
- **Network Protocols**: P2P systems and DHTs

## Skip List vs Other Structures

| Structure  | Search     | Insert     | Delete     | Space | Deterministic |
| ---------- | ---------- | ---------- | ---------- | ----- | ------------- |
| Skip List  | O(log n)\* | O(log n)\* | O(log n)\* | O(n)  | No            |
| BST        | O(log n)   | O(log n)   | O(log n)   | O(n)  | Yes           |
| Array      | O(log n)   | O(n)       | O(n)       | O(n)  | Yes           |
| Hash Table | O(1)\*     | O(1)\*     | O(1)\*     | O(n)  | No            |

\*Expected time complexity

## Key Insights

Skip Lists provide an elegant probabilistic alternative to balanced trees. They're particularly valuable in concurrent environments due to their simpler structure and the ability to implement lock-free operations more easily than with tree-based structures.

The randomized nature makes them self-balancing without complex rotation operations, making them an excellent choice for applications where implementation simplicity is important while still requiring good average-case performance.
