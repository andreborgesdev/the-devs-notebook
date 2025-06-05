# Persistent Data Structures

Persistent data structures preserve previous versions of themselves when modified, allowing access to multiple versions simultaneously. They enable efficient functional programming patterns and provide natural support for undo operations, version control, and concurrent access.

## Types of Persistence

1. **Partially Persistent**: Can query any previous version but only update the latest
2. **Fully Persistent**: Can both query and update any version
3. **Confluently Persistent**: Can combine (merge) different versions

## Implementation Strategies

### Path Copying

Copy the path from root to modified node, sharing unchanged subtrees.

### Fat Node Method

Store all versions of data in each node with timestamps.

### Node Copying

Copy entire nodes when modified, sharing unchanged nodes.

## Persistent List Implementation

```typescript
abstract class PersistentList<T> {
  abstract length: number;
  abstract get(index: number): T;
  abstract set(index: number, value: T): PersistentList<T>;
  abstract push(value: T): PersistentList<T>;
  abstract pop(): PersistentList<T>;
  abstract toArray(): T[];
}

class EmptyList<T> extends PersistentList<T> {
  length = 0;

  get(index: number): T {
    throw new Error("Index out of bounds");
  }

  set(index: number, value: T): PersistentList<T> {
    throw new Error("Index out of bounds");
  }

  push(value: T): PersistentList<T> {
    return new ConsList(value, this);
  }

  pop(): PersistentList<T> {
    throw new Error("Cannot pop from empty list");
  }

  toArray(): T[] {
    return [];
  }
}

class ConsList<T> extends PersistentList<T> {
  constructor(private head: T, private tail: PersistentList<T>) {
    super();
  }

  get length(): number {
    return 1 + this.tail.length;
  }

  get(index: number): T {
    if (index < 0 || index >= this.length) {
      throw new Error("Index out of bounds");
    }

    if (index === 0) {
      return this.head;
    }

    return this.tail.get(index - 1);
  }

  set(index: number, value: T): PersistentList<T> {
    if (index < 0 || index >= this.length) {
      throw new Error("Index out of bounds");
    }

    if (index === 0) {
      return new ConsList(value, this.tail);
    }

    return new ConsList(this.head, this.tail.set(index - 1, value));
  }

  push(value: T): PersistentList<T> {
    return new ConsList(value, this);
  }

  pop(): PersistentList<T> {
    return this.tail;
  }

  toArray(): T[] {
    return [this.head, ...this.tail.toArray()];
  }

  forEach(fn: (value: T, index: number) => void): void {
    this.forEachHelper(fn, 0);
  }

  private forEachHelper(
    fn: (value: T, index: number) => void,
    index: number
  ): void {
    fn(this.head, index);
    if (this.tail instanceof ConsList) {
      this.tail.forEachHelper(fn, index + 1);
    }
  }

  map<U>(fn: (value: T) => U): PersistentList<U> {
    return new ConsList(fn(this.head), this.tail.map(fn));
  }

  filter(predicate: (value: T) => boolean): PersistentList<T> {
    const filteredTail = this.tail.filter(predicate);
    return predicate(this.head)
      ? new ConsList(this.head, filteredTail)
      : filteredTail;
  }

  reverse(): PersistentList<T> {
    return this.reverseHelper(new EmptyList<T>());
  }

  private reverseHelper(acc: PersistentList<T>): PersistentList<T> {
    const newAcc = acc.push(this.head);
    return this.tail instanceof EmptyList
      ? newAcc
      : (this.tail as ConsList<T>).reverseHelper(newAcc);
  }
}

function persistentList<T>(...items: T[]): PersistentList<T> {
  let list: PersistentList<T> = new EmptyList<T>();
  for (let i = items.length - 1; i >= 0; i--) {
    list = list.push(items[i]);
  }
  return list;
}
```

## Persistent Vector (Trie-based)

```typescript
const BRANCH_FACTOR = 32;
const MASK = BRANCH_FACTOR - 1;

abstract class PersistentVectorNode<T> {
  abstract get(index: number, shift: number): T;
  abstract set(index: number, value: T, shift: number): PersistentVectorNode<T>;
  abstract push(value: T, shift: number): PersistentVectorNode<T>;
}

class VectorLeaf<T> extends PersistentVectorNode<T> {
  constructor(private array: T[]) {
    super();
  }

  get(index: number, shift: number): T {
    return this.array[index & MASK];
  }

  set(index: number, value: T, shift: number): PersistentVectorNode<T> {
    const newArray = [...this.array];
    newArray[index & MASK] = value;
    return new VectorLeaf(newArray);
  }

  push(value: T, shift: number): PersistentVectorNode<T> {
    if (this.array.length < BRANCH_FACTOR) {
      return new VectorLeaf([...this.array, value]);
    }

    return new VectorBranch<T>([this, new VectorLeaf([value])]);
  }

  getArray(): T[] {
    return [...this.array];
  }
}

class VectorBranch<T> extends PersistentVectorNode<T> {
  constructor(private children: PersistentVectorNode<T>[]) {
    super();
  }

  get(index: number, shift: number): T {
    const childIndex = (index >>> shift) & MASK;
    return this.children[childIndex].get(index, shift - 5);
  }

  set(index: number, value: T, shift: number): PersistentVectorNode<T> {
    const childIndex = (index >>> shift) & MASK;
    const newChildren = [...this.children];
    newChildren[childIndex] = this.children[childIndex].set(
      index,
      value,
      shift - 5
    );
    return new VectorBranch(newChildren);
  }

  push(value: T, shift: number): PersistentVectorNode<T> {
    const lastChildIndex = this.children.length - 1;

    if (this.children.length < BRANCH_FACTOR) {
      const newChildren = [...this.children];
      try {
        newChildren[lastChildIndex] = this.children[lastChildIndex].push(
          value,
          shift - 5
        );
        return new VectorBranch(newChildren);
      } catch {
        newChildren.push(new VectorLeaf([value]));
        return new VectorBranch(newChildren);
      }
    }

    return new VectorBranch([this, new VectorLeaf([value])]);
  }
}

class PersistentVector<T> {
  constructor(
    private root: PersistentVectorNode<T> | null = null,
    private _length: number = 0,
    private shift: number = 5
  ) {}

  get length(): number {
    return this._length;
  }

  get(index: number): T {
    if (index < 0 || index >= this._length) {
      throw new Error("Index out of bounds");
    }

    if (!this.root) {
      throw new Error("Vector is empty");
    }

    return this.root.get(index, this.shift);
  }

  set(index: number, value: T): PersistentVector<T> {
    if (index < 0 || index >= this._length) {
      throw new Error("Index out of bounds");
    }

    if (!this.root) {
      throw new Error("Vector is empty");
    }

    const newRoot = this.root.set(index, value, this.shift);
    return new PersistentVector(newRoot, this._length, this.shift);
  }

  push(value: T): PersistentVector<T> {
    if (!this.root) {
      return new PersistentVector(new VectorLeaf([value]), 1, 5);
    }

    const newRoot = this.root.push(value, this.shift);
    let newShift = this.shift;

    if (
      newRoot instanceof VectorBranch &&
      this._length === 1 << (this.shift + 5)
    ) {
      newShift += 5;
    }

    return new PersistentVector(newRoot, this._length + 1, newShift);
  }

  pop(): PersistentVector<T> {
    if (this._length === 0) {
      throw new Error("Cannot pop from empty vector");
    }

    if (this._length === 1) {
      return new PersistentVector<T>();
    }

    return new PersistentVector(this.root, this._length - 1, this.shift);
  }

  toArray(): T[] {
    const result: T[] = [];
    for (let i = 0; i < this._length; i++) {
      result.push(this.get(i));
    }
    return result;
  }

  map<U>(fn: (value: T, index: number) => U): PersistentVector<U> {
    let result = new PersistentVector<U>();
    for (let i = 0; i < this._length; i++) {
      result = result.push(fn(this.get(i), i));
    }
    return result;
  }

  filter(predicate: (value: T, index: number) => boolean): PersistentVector<T> {
    let result = new PersistentVector<T>();
    for (let i = 0; i < this._length; i++) {
      const value = this.get(i);
      if (predicate(value, i)) {
        result = result.push(value);
      }
    }
    return result;
  }

  forEach(fn: (value: T, index: number) => void): void {
    for (let i = 0; i < this._length; i++) {
      fn(this.get(i), i);
    }
  }
}

function persistentVector<T>(...items: T[]): PersistentVector<T> {
  let vector = new PersistentVector<T>();
  for (const item of items) {
    vector = vector.push(item);
  }
  return vector;
}
```

## Persistent Map (Hash Array Mapped Trie)

```typescript
const HASH_BITS = 5;
const HASH_SIZE = 1 << HASH_BITS;
const HASH_MASK = HASH_SIZE - 1;

function hash(key: any): number {
  if (typeof key === "string") {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = ((hash << 5) - hash + key.charCodeAt(i)) & 0xffffffff;
    }
    return hash >>> 0;
  }

  if (typeof key === "number") {
    return key >>> 0;
  }

  return (
    JSON.stringify(key)
      .split("")
      .reduce((a, b) => {
        a = (a << 5) - a + b.charCodeAt(0);
        return a & a;
      }, 0) >>> 0
  );
}

class HAMTNode<K, V> {
  constructor(
    public bitmap: number = 0,
    public entries: Array<[K, V] | HAMTNode<K, V>> = []
  ) {}

  get(key: K, keyHash: number, shift: number): V | undefined {
    const mask = 1 << ((keyHash >>> shift) & HASH_MASK);

    if ((this.bitmap & mask) === 0) {
      return undefined;
    }

    const index = this.getIndex(mask);
    const entry = this.entries[index];

    if (Array.isArray(entry)) {
      return entry[0] === key ? entry[1] : undefined;
    }

    return entry.get(key, keyHash, shift + HASH_BITS);
  }

  set(key: K, value: V, keyHash: number, shift: number): HAMTNode<K, V> {
    const mask = 1 << ((keyHash >>> shift) & HASH_MASK);
    const index = this.getIndex(mask);

    if ((this.bitmap & mask) === 0) {
      const newEntries = [...this.entries];
      newEntries.splice(index, 0, [key, value]);
      return new HAMTNode(this.bitmap | mask, newEntries);
    }

    const entry = this.entries[index];

    if (Array.isArray(entry)) {
      if (entry[0] === key) {
        if (entry[1] === value) return this;
        const newEntries = [...this.entries];
        newEntries[index] = [key, value];
        return new HAMTNode(this.bitmap, newEntries);
      }

      const existingHash = hash(entry[0]);
      const newNode = new HAMTNode<K, V>()
        .set(entry[0], entry[1], existingHash, shift + HASH_BITS)
        .set(key, value, keyHash, shift + HASH_BITS);

      const newEntries = [...this.entries];
      newEntries[index] = newNode;
      return new HAMTNode(this.bitmap, newEntries);
    }

    const newChild = entry.set(key, value, keyHash, shift + HASH_BITS);
    if (newChild === entry) return this;

    const newEntries = [...this.entries];
    newEntries[index] = newChild;
    return new HAMTNode(this.bitmap, newEntries);
  }

  delete(key: K, keyHash: number, shift: number): HAMTNode<K, V> | null {
    const mask = 1 << ((keyHash >>> shift) & HASH_MASK);

    if ((this.bitmap & mask) === 0) {
      return this;
    }

    const index = this.getIndex(mask);
    const entry = this.entries[index];

    if (Array.isArray(entry)) {
      if (entry[0] !== key) return this;

      if (this.entries.length === 1) {
        return null;
      }

      const newEntries = [...this.entries];
      newEntries.splice(index, 1);
      return new HAMTNode(this.bitmap & ~mask, newEntries);
    }

    const newChild = entry.delete(key, keyHash, shift + HASH_BITS);
    if (newChild === entry) return this;

    if (newChild === null) {
      if (this.entries.length === 1) {
        return null;
      }

      const newEntries = [...this.entries];
      newEntries.splice(index, 1);
      return new HAMTNode(this.bitmap & ~mask, newEntries);
    }

    const newEntries = [...this.entries];
    newEntries[index] = newChild;
    return new HAMTNode(this.bitmap, newEntries);
  }

  private getIndex(mask: number): number {
    return this.popCount(this.bitmap & (mask - 1));
  }

  private popCount(bitmap: number): number {
    bitmap = bitmap - ((bitmap >>> 1) & 0x55555555);
    bitmap = (bitmap & 0x33333333) + ((bitmap >>> 2) & 0x33333333);
    return (((bitmap + (bitmap >>> 4)) & 0x0f0f0f0f) * 0x01010101) >>> 24;
  }

  *entries(): IterableIterator<[K, V]> {
    for (const entry of this.entries) {
      if (Array.isArray(entry)) {
        yield entry;
      } else {
        yield* entry.entries();
      }
    }
  }
}

class PersistentMap<K, V> {
  constructor(
    private root: HAMTNode<K, V> | null = null,
    private _size: number = 0
  ) {}

  get size(): number {
    return this._size;
  }

  get(key: K): V | undefined {
    if (!this.root) return undefined;
    return this.root.get(key, hash(key), 0);
  }

  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  set(key: K, value: V): PersistentMap<K, V> {
    const keyHash = hash(key);
    const hadKey = this.has(key);

    if (!this.root) {
      const newRoot = new HAMTNode<K, V>().set(key, value, keyHash, 0);
      return new PersistentMap(newRoot, 1);
    }

    const newRoot = this.root.set(key, value, keyHash, 0);
    const newSize = hadKey ? this._size : this._size + 1;

    return new PersistentMap(newRoot, newSize);
  }

  delete(key: K): PersistentMap<K, V> {
    if (!this.root || !this.has(key)) {
      return this;
    }

    const newRoot = this.root.delete(key, hash(key), 0);
    return new PersistentMap(newRoot, this._size - 1);
  }

  entries(): IterableIterator<[K, V]> {
    return this.root ? this.root.entries() : [][Symbol.iterator]();
  }

  keys(): IterableIterator<K> {
    return this.map(([key]) => key);
  }

  values(): IterableIterator<V> {
    return this.map(([, value]) => value);
  }

  private *map<T>(fn: ([K, V]) => T): IterableIterator<T> {
    for (const entry of this.entries()) {
      yield fn(entry);
    }
  }

  forEach(fn: (value: V, key: K) => void): void {
    for (const [key, value] of this.entries()) {
      fn(value, key);
    }
  }

  toObject(): Record<string, V> {
    const result: Record<string, V> = {};
    for (const [key, value] of this.entries()) {
      result[String(key)] = value;
    }
    return result;
  }
}

function persistentMap<K, V>(entries?: Iterable<[K, V]>): PersistentMap<K, V> {
  let map = new PersistentMap<K, V>();
  if (entries) {
    for (const [key, value] of entries) {
      map = map.set(key, value);
    }
  }
  return map;
}
```

## Usage Examples

```typescript
const list1 = persistentList(1, 2, 3);
const list2 = list1.push(4);
const list3 = list1.set(1, 99);

console.log(list1.toArray()); // [1, 2, 3]
console.log(list2.toArray()); // [1, 2, 3, 4]
console.log(list3.toArray()); // [1, 99, 3]

const vector1 = persistentVector(1, 2, 3, 4, 5);
const vector2 = vector1.set(2, 99);
const vector3 = vector1.push(6);

console.log(vector1.toArray()); // [1, 2, 3, 4, 5]
console.log(vector2.toArray()); // [1, 2, 99, 4, 5]
console.log(vector3.toArray()); // [1, 2, 3, 4, 5, 6]

const map1 = persistentMap([
  ["a", 1],
  ["b", 2],
]);
const map2 = map1.set("c", 3);
const map3 = map1.delete("a");

console.log(map1.toObject()); // { a: 1, b: 2 }
console.log(map2.toObject()); // { a: 1, b: 2, c: 3 }
console.log(map3.toObject()); // { b: 2 }
```

## Time/Space Complexity

| Operation           | Persistent List        | Persistent Vector | Persistent Map    |
| ------------------- | ---------------------- | ----------------- | ----------------- |
| Access              | O(n)                   | O(log₃₂ n) ≈ O(1) | O(log₃₂ n) ≈ O(1) |
| Update              | O(n)                   | O(log₃₂ n)        | O(log₃₂ n)        |
| Insert/Delete       | O(1) head, O(n) middle | O(log₃₂ n)        | O(log₃₂ n)        |
| Space per operation | O(log n)               | O(log₃₂ n)        | O(log₃₂ n)        |

## Advantages

- **Version History**: Access to all previous versions
- **Thread Safety**: Naturally immutable and thread-safe
- **Undo Operations**: Trivial to implement undo/redo
- **Memory Sharing**: Structural sharing reduces memory usage
- **Functional Programming**: Enables pure functional patterns

## Disadvantages

- **Performance Overhead**: Slower than mutable versions
- **Memory Usage**: Can use more memory than mutable structures
- **Learning Curve**: Different programming model
- **GC Pressure**: More allocations can stress garbage collection

## Applications

- **Version Control**: Git-like systems
- **Undo/Redo Systems**: Text editors, CAD software
- **Functional Languages**: Clojure, Haskell, F#
- **State Management**: Redux, Immutable.js
- **Concurrent Programming**: Lock-free data sharing
- **Database Systems**: MVCC implementations

## Real-World Libraries

- **Clojure**: Built-in persistent collections
- **Immutable.js**: JavaScript persistent data structures
- **Mori**: ClojureScript data structures for JavaScript
- **Seamless-Immutable**: Lightweight immutable data
- **Immer**: Produce immutable state with mutations

## Key Insights

Persistent data structures excel in:

1. **Scenarios requiring version history** or undo functionality
2. **Functional programming** paradigms
3. **Concurrent environments** where immutability prevents race conditions
4. **State management** in reactive applications

The key trade-off is slower individual operations in exchange for structural sharing, version preservation, and thread safety. They're particularly valuable in applications where the ability to access previous states is crucial.
