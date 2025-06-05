# Red-Black Tree

A Red-Black Tree is a type of self-balancing binary search tree where each node has an extra bit to store the color of the node (red or black). These color bits ensure that the tree remains approximately balanced during insertions and deletions.

## Properties

1. **Node Color**: Every node is either red or black
2. **Root Property**: The root node is always black
3. **Red Property**: Red nodes cannot have red children (no two red nodes can be adjacent)
4. **Black Property**: Every path from root to null contains the same number of black nodes
5. **Leaf Property**: All leaves (null nodes) are considered black

## Time Complexity

| Operation | Average  | Worst Case |
| --------- | -------- | ---------- |
| Search    | O(log n) | O(log n)   |
| Insert    | O(log n) | O(log n)   |
| Delete    | O(log n) | O(log n)   |
| Space     | O(n)     | O(n)       |

## Implementation

```typescript
enum Color {
  RED = "RED",
  BLACK = "BLACK",
}

class RBNode<T> {
  data: T;
  color: Color;
  left: RBNode<T> | null;
  right: RBNode<T> | null;
  parent: RBNode<T> | null;

  constructor(data: T, color: Color = Color.RED) {
    this.data = data;
    this.color = color;
    this.left = null;
    this.right = null;
    this.parent = null;
  }
}

class RedBlackTree<T> {
  private root: RBNode<T> | null;
  private readonly NIL: RBNode<T>;

  constructor() {
    this.NIL = new RBNode<T>(null as any, Color.BLACK);
    this.root = this.NIL;
  }

  insert(data: T): void {
    const newNode = new RBNode(data);
    newNode.left = this.NIL;
    newNode.right = this.NIL;

    let parent: RBNode<T> | null = null;
    let current = this.root;

    while (current !== this.NIL) {
      parent = current;
      if (data < current.data) {
        current = current.left!;
      } else {
        current = current.right!;
      }
    }

    newNode.parent = parent;

    if (parent === null) {
      this.root = newNode;
    } else if (data < parent.data) {
      parent.left = newNode;
    } else {
      parent.right = newNode;
    }

    if (newNode.parent === null) {
      newNode.color = Color.BLACK;
      return;
    }

    if (newNode.parent.parent === null) {
      return;
    }

    this.fixInsert(newNode);
  }

  private fixInsert(node: RBNode<T>): void {
    while (node.parent && node.parent.color === Color.RED) {
      if (node.parent === node.parent.parent?.left) {
        const uncle = node.parent.parent.right;

        if (uncle && uncle.color === Color.RED) {
          uncle.color = Color.BLACK;
          node.parent.color = Color.BLACK;
          node.parent.parent.color = Color.RED;
          node = node.parent.parent;
        } else {
          if (node === node.parent.right) {
            node = node.parent;
            this.leftRotate(node);
          }

          if (node.parent && node.parent.parent) {
            node.parent.color = Color.BLACK;
            node.parent.parent.color = Color.RED;
            this.rightRotate(node.parent.parent);
          }
        }
      } else {
        const uncle = node.parent.parent?.left;

        if (uncle && uncle.color === Color.RED) {
          uncle.color = Color.BLACK;
          node.parent.color = Color.BLACK;
          node.parent.parent!.color = Color.RED;
          node = node.parent.parent!;
        } else {
          if (node === node.parent.left) {
            node = node.parent;
            this.rightRotate(node);
          }

          if (node.parent && node.parent.parent) {
            node.parent.color = Color.BLACK;
            node.parent.parent.color = Color.RED;
            this.leftRotate(node.parent.parent);
          }
        }
      }

      if (node === this.root) {
        break;
      }
    }

    if (this.root) {
      this.root.color = Color.BLACK;
    }
  }

  private leftRotate(x: RBNode<T>): void {
    const y = x.right!;
    x.right = y.left;

    if (y.left !== this.NIL) {
      y.left!.parent = x;
    }

    y.parent = x.parent;

    if (x.parent === null) {
      this.root = y;
    } else if (x === x.parent.left) {
      x.parent.left = y;
    } else {
      x.parent.right = y;
    }

    y.left = x;
    x.parent = y;
  }

  private rightRotate(x: RBNode<T>): void {
    const y = x.left!;
    x.left = y.right;

    if (y.right !== this.NIL) {
      y.right!.parent = x;
    }

    y.parent = x.parent;

    if (x.parent === null) {
      this.root = y;
    } else if (x === x.parent.right) {
      x.parent.right = y;
    } else {
      x.parent.left = y;
    }

    y.right = x;
    x.parent = y;
  }

  search(data: T): RBNode<T> | null {
    let current = this.root;

    while (current !== this.NIL && current !== null) {
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

  delete(data: T): void {
    const nodeToDelete = this.search(data);
    if (!nodeToDelete) return;

    let y = nodeToDelete;
    let yOriginalColor = y.color;
    let x: RBNode<T>;

    if (nodeToDelete.left === this.NIL) {
      x = nodeToDelete.right!;
      this.transplant(nodeToDelete, nodeToDelete.right!);
    } else if (nodeToDelete.right === this.NIL) {
      x = nodeToDelete.left!;
      this.transplant(nodeToDelete, nodeToDelete.left!);
    } else {
      y = this.minimum(nodeToDelete.right!);
      yOriginalColor = y.color;
      x = y.right!;

      if (y.parent === nodeToDelete) {
        x.parent = y;
      } else {
        this.transplant(y, y.right!);
        y.right = nodeToDelete.right;
        y.right!.parent = y;
      }

      this.transplant(nodeToDelete, y);
      y.left = nodeToDelete.left;
      y.left!.parent = y;
      y.color = nodeToDelete.color;
    }

    if (yOriginalColor === Color.BLACK) {
      this.fixDelete(x);
    }
  }

  private transplant(u: RBNode<T>, v: RBNode<T>): void {
    if (u.parent === null) {
      this.root = v;
    } else if (u === u.parent.left) {
      u.parent.left = v;
    } else {
      u.parent.right = v;
    }
    v.parent = u.parent;
  }

  private minimum(node: RBNode<T>): RBNode<T> {
    while (node.left !== this.NIL) {
      node = node.left!;
    }
    return node;
  }

  private fixDelete(x: RBNode<T>): void {
    while (x !== this.root && x.color === Color.BLACK) {
      if (x === x.parent?.left) {
        let w = x.parent.right!;

        if (w.color === Color.RED) {
          w.color = Color.BLACK;
          x.parent.color = Color.RED;
          this.leftRotate(x.parent);
          w = x.parent.right!;
        }

        if (w.left!.color === Color.BLACK && w.right!.color === Color.BLACK) {
          w.color = Color.RED;
          x = x.parent;
        } else {
          if (w.right!.color === Color.BLACK) {
            w.left!.color = Color.BLACK;
            w.color = Color.RED;
            this.rightRotate(w);
            w = x.parent!.right!;
          }

          w.color = x.parent!.color;
          x.parent!.color = Color.BLACK;
          w.right!.color = Color.BLACK;
          this.leftRotate(x.parent!);
          x = this.root!;
        }
      } else {
        let w = x.parent!.left!;

        if (w.color === Color.RED) {
          w.color = Color.BLACK;
          x.parent!.color = Color.RED;
          this.rightRotate(x.parent!);
          w = x.parent!.left!;
        }

        if (w.right!.color === Color.BLACK && w.left!.color === Color.BLACK) {
          w.color = Color.RED;
          x = x.parent!;
        } else {
          if (w.left!.color === Color.BLACK) {
            w.right!.color = Color.BLACK;
            w.color = Color.RED;
            this.leftRotate(w);
            w = x.parent!.left!;
          }

          w.color = x.parent!.color;
          x.parent!.color = Color.BLACK;
          w.left!.color = Color.BLACK;
          this.rightRotate(x.parent!);
          x = this.root!;
        }
      }
    }
    x.color = Color.BLACK;
  }

  inOrderTraversal(): T[] {
    const result: T[] = [];
    this.inOrderHelper(this.root, result);
    return result;
  }

  private inOrderHelper(node: RBNode<T> | null, result: T[]): void {
    if (node && node !== this.NIL) {
      this.inOrderHelper(node.left, result);
      result.push(node.data);
      this.inOrderHelper(node.right, result);
    }
  }
}
```

## Usage Examples

```typescript
const rbTree = new RedBlackTree<number>();

rbTree.insert(10);
rbTree.insert(5);
rbTree.insert(15);
rbTree.insert(3);
rbTree.insert(7);
rbTree.insert(12);
rbTree.insert(17);

console.log(rbTree.inOrderTraversal()); // [3, 5, 7, 10, 12, 15, 17]

const foundNode = rbTree.search(7);
console.log(foundNode ? "Found" : "Not found"); // Found

rbTree.delete(5);
console.log(rbTree.inOrderTraversal()); // [3, 7, 10, 12, 15, 17]
```

## Advantages

- **Guaranteed Balance**: Height is always O(log n)
- **Predictable Performance**: All operations are guaranteed O(log n)
- **Efficient**: Better worst-case performance than AVL trees for insertions/deletions
- **Self-Organizing**: Automatically maintains balance

## Disadvantages

- **Complex Implementation**: More complex than basic BST
- **Memory Overhead**: Extra color bit per node
- **Slower Lookups**: Slightly slower than AVL trees for search-heavy workloads

## Applications

- **Language Libraries**: Java TreeMap, C++ std::map
- **Operating Systems**: Linux CFS scheduler
- **Databases**: Some database indexing systems
- **Memory Management**: Kernel memory allocators

## Red-Black vs AVL Trees

| Aspect                    | Red-Black Tree         | AVL Tree         |
| ------------------------- | ---------------------- | ---------------- |
| Balance Factor            | Color-based            | Height-based     |
| Rotations (Insert)        | ≤ 2                    | ≤ 2              |
| Rotations (Delete)        | ≤ 3                    | O(log n)         |
| Search Performance        | Good                   | Better           |
| Insert/Delete Performance | Better                 | Good             |
| Use Case                  | Frequent modifications | Frequent lookups |

## Key Insights

Red-Black Trees provide an excellent balance between search performance and modification efficiency. They're particularly well-suited for applications that require frequent insertions and deletions while maintaining reasonable search performance.

The color-coding scheme is simpler to implement than AVL's height balancing, making Red-Black Trees a popular choice in many standard library implementations.
