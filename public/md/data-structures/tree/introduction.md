# Trees

A **tree** is a hierarchical, non-linear data structure made up of **nodes**, where each node can point to multiple children but only one parent (except the root).

Trees are widely used in databases, filesystems, parsers, search algorithms, and more.

## Key Terminology

- **Node**: An individual element in a tree.
- **Root**: The topmost node with no parent.
- **Leaf**: A node with no children.
- **Edge**: The connection between a parent and child.
- **Height**: The number of edges on the longest path from the root to a leaf.
- **Depth**: The number of edges from the root to a given node.
- **Subtree**: A tree formed from any node and its descendants.

## Tree Types

| Tree Type                    | Description                                                        |
| ---------------------------- | ------------------------------------------------------------------ |
| **Binary Tree**              | Each node has at most two children (`left`, `right`)               |
| **Binary Search Tree (BST)** | Binary tree with ordered nodes: `left < root < right`              |
| **Balanced Tree**            | A tree where height is minimized (e.g., AVL, Red-Black Tree)       |
| **Full Tree**                | Every node has 0 or 2 children                                     |
| **Complete Tree**            | All levels are full except possibly the last, filled left to right |
| **Perfect Tree**             | All levels completely filled                                       |
| **N-ary Tree**               | A node can have `N` children                                       |
| **Trie**                     | Tree used for string/prefix storage                                |
| **Heap**                     | Complete binary tree with a max/min heap property                  |

## Common Operations (BST)

| Operation | Time Complexity (Average) | Time Complexity (Worst) |
| --------- | ------------------------- | ----------------------- |
| Search    | O(log n)                  | O(n)                    |
| Insert    | O(log n)                  | O(n)                    |
| Delete    | O(log n)                  | O(n)                    |

> Worst-case occurs when tree becomes unbalanced (e.g., all nodes inserted in sorted order).

## Traversal Methods

| Type            | Order                                       |
| --------------- | ------------------------------------------- |
| **In-order**    | Left → Node → Right (sorted output for BST) |
| **Pre-order**   | Node → Left → Right                         |
| **Post-order**  | Left → Right → Node                         |
| **Level-order** | Breadth-first traversal using a queue       |

## Java Example: Basic Binary Tree Node

```java showLineNumbers
class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int x) {
    val = x;
    }
}
```

## Java Example: In-order Traversal (Recursive)

```java showLineNumbers
void inOrder(TreeNode root) {
    if (root == null) return;
    inOrder(root.left);
    System.out.print(root.val + " ");
    inOrder(root.right);
}
```

## Common Interview Problems

- Validate a Binary Search Tree
- Lowest Common Ancestor (LCA)
- Diameter of a tree
- Convert a tree to a doubly linked list
- Level order / Zigzag level order traversal
- Serialize and deserialize a tree
- Find kth smallest/largest in BST

## Tips for Interview and Practice

- Use recursion for most tree traversals — but understand the stack behavior.
- For BFS (level order), use a queue.
- Edge cases: empty tree, single node, skewed trees (like a linked list).
- Know when to use DFS vs BFS based on the problem (e.g., shortest path → BFS).
