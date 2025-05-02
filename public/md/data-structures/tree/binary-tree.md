# Binary Trees

A **Binary Tree** is a hierarchical, non-linear data structure where each node has **at most two children**, typically referred to as the **left child** and the **right child**. It starts from a **root** node, and nodes without children are called **leaves**.

## Terminology

- **Node**: A fundamental part of a tree containing data and pointers to its children.
- **Root**: The topmost node in the tree. It's the only node with no parent.
- **Edge**: The link between a parent node and its child node. A binary tree with $N$ nodes has $N-1$ edges.
- **Parent**: A node that has child nodes branching from it.
- **Child**: Nodes branching from a parent node. A node can have a left child and/or a right child.
- **Siblings**: Nodes that share the same parent.
- **Leaf Node (Terminal Node)**: A node with no children (degree 0).
- **Internal Node (Branch Node)**: A node with at least one child. In a _full_ or _strictly_ binary tree, internal nodes have exactly two children.
- **Subtree**: A tree formed by a node and its descendants. In a binary tree, these are the left and right subtrees.
- **Height (of a node)**: The length (number of edges) of the longest path from that node to a leaf node. Leaf nodes have a height of 0.
- **Height (of a tree)**: The height of the root node. An empty tree has height -1; a tree with one node has height 0.
- **Depth / Level (of a node)**: The length (number of edges) of the unique path from the root to that node. The root node is at level 0.

## Types of Binary Trees

| Type                     | Description                                                                                                                      | Key Properties                                                                                                                                                                                      |
| :----------------------- | :------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Full Binary Tree**     | Every node has either 0 or 2 children. No node has only one child. Also called a _proper_ or _strictly_ binary tree.             | Number of leaf nodes = Number of internal nodes + 1 ($L = I + 1$). Total nodes $N = 2I + 1$ or $N = 2L - 1$.                                                                                        |
| **Complete Binary Tree** | All levels are completely filled except possibly the last level. The last level is filled from left to right.                    | Can have between 1 and $2^h$ nodes at the last level $h$. Useful for heap implementation. An almost complete binary tree has leaves at level $d$ or $d-1$, with level $d$ nodes pushed to the left. |
| **Perfect Binary Tree**  | A tree that is both _full_ and _complete_. All internal nodes have 2 children, and all leaf nodes are at the same level (depth). | Total nodes $N = 2^{h+1} - 1$, where $h$ is the height. Number of leaf nodes $L = 2^h$. Number of leaf nodes $L = (N+1)/2$.                                                                         |
| **Balanced Binary Tree** | The height difference between the left and right subtrees for _any_ node is at most 1. Ensures logarithmic height ($O(\log n)$). | Examples include AVL trees and Red-Black trees. Guarantees $O(\log n)$ time for search, insert, delete operations.                                                                                  |
| **Degenerate Tree**      | Each internal node has only one child. Performance degrades to that of a linked list ($O(n)$).                                   | **Skewed Tree**: A type of degenerate tree where all nodes are either left children (left-skewed) or right children (right-skewed).                                                                 |

## Properties & Formulas

- **Max Nodes at Level $L$**: $2^L$ (where root is at level 0).
- **Max Nodes in Tree of Height $H$**: $2^{H+1} - 1$ (where height of single node tree is 0).
- **Min Height for $N$ Nodes**: $\lfloor \log_2 N \rfloor$ (or $\lceil \log_2 (N+1) \rceil - 1$).
- **Min Levels for $L$ Leaves**: $\lceil \log_2 L \rceil + 1$ (assuming root is level 1) or $\lfloor \log_2 L \rfloor$ (if root is level 0).
- **Edges in a Tree with $N$ Nodes**: $N - 1$.
- **Full Binary Tree**: Leaf nodes ($L$) = Internal nodes ($I$) + 1. Total nodes $N = 2I + 1 = 2L - 1$.

## Tree Traversals

Visiting every node exactly once.

### Depth-First Search (DFS)

Explore as far down one branch as possible before backtracking. Uses a stack (implicitly in recursion, explicitly in iteration). Time Complexity: $O(N)$. Space Complexity: $O(H)$ (height of the tree, for recursion stack), which is $O(\log N)$ for balanced trees and $O(N)$ for skewed trees.

1.  **Pre-order (NLR - Node, Left, Right)**: Visit the current node, then recursively traverse the left subtree, then the right subtree.
    - _Use Case_: Copying a tree, getting prefix expression from an expression tree.
2.  **In-order (LNR - Left, Node, Right)**: Recursively traverse the left subtree, visit the current node, then recursively traverse the right subtree.
    - _Use Case_: Retrieving data in sorted order from a Binary Search Tree (BST).
3.  **Post-order (LRN - Left, Right, Node)**: Recursively traverse the left subtree, then the right subtree, then visit the current node.
    - _Use Case_: Deleting nodes safely (process children before parent), getting postfix expression.

### Breadth-First Search (BFS) / Level Order

Visit nodes level by level, from left to right. Uses a queue.

- Time Complexity: $O(N)$.
- Space Complexity: $O(W)$, where $W$ is the maximum width of the tree (can be up to $O(N)$ for a complete tree).
- _Use Case_: Finding the shortest path between two nodes (in terms of edges), level-based processing.

## Operations & Complexity

| Operation     | Average Case (Balanced Tree) | Worst Case (Skewed Tree) | Notes                                                                                            |
| :------------ | :--------------------------- | :----------------------- | :----------------------------------------------------------------------------------------------- |
| **Search**    | $O(\log N)$                  | $O(N)$                   | General binary tree search requires traversal ($O(N)$). BSTs optimize this.                      |
| **Insert**    | $O(\log N)$                  | $O(N)$                   | Simple insertion (e.g., first available spot level-order) can be $O(N)$. BST insertion varies    |
| **Delete**    | $O(\log N)$                  | $O(N)$                   | Deletion often involves finding the node ($O(H)$) and replacing it, possibly with restructuring. |
| **Traversal** | $O(N)$                       | $O(N)$                   | All traversal methods visit each node once.                                                      |

_Note: For general (non-BST) binary trees, search, insert, and delete often require traversing a significant portion of the tree, leading to $O(N)$ complexity in the worst case. Balanced BSTs (like AVL, Red-Black) guarantee $O(\log N)$ for these operations._

## Applications

Binary trees are fundamental in various computing areas:

- **Binary Search Trees (BSTs)**: Efficient searching, insertion, deletion ($O(\log N)$ average). Used in databases indexing and symbol tables.
- **Heaps (Priority Queues)**: Often implemented using complete binary trees. Used in scheduling (OS), pathfinding (A\*), heapsort.
- **Expression Trees**: Representing and evaluating mathematical or logical expressions. Used by compilers and calculators.
- **Huffman Coding Trees**: Used in data compression algorithms (like .jpeg, .mp3).
- **Decision Trees**: Used in machine learning for classification and regression.
- **Syntax Trees**: Used by compilers to parse source code.
- **File Systems / Hierarchical Data**: Representing directory structures.
- **Network Routing**: Tries (often related to binary trees) used in routers. Binary Space Partitioning (BSP) trees used in 3D graphics/games.

## Binary Search Tree

A BST is a BT that satisfies the **BST invariant →** the left subtree has smaller elements and right subtree has larger elements

Note: We can, or cannot, allow duplicate values in our tree. BST allow for duplicate values, but most of the time we are only interested in having unique elements inside our tree

| Complexity |       | Operation |
| ---------- | ----- | --------- |
| Average    | Worst |           |
| O(log n)   | O(n)  | Insert    |
| O(log n)   | O(n)  | Delete    |
| O(log n)   | O(n)  | Remove    |
| O(log n)   | O(n)  | Search    |

Worst is if it degenerates to being a linear tree. The linear behaviour is very bad and is the reason why balanced BST (BBST) were invented

If we do an inorder traversal on a BST, the values printed will be in increasing order.

**Inserting elements into a BST:**

BST elements must be **comparable so that we can order them inside the tree.**

When inserting an element we want to compare its value to the value stored in the current node we’re considering to decide one of the following:

- Recurse down the left subtree (< case)
- Recurse down the right subtree (> case)
- Handle finding a duplicate value (= case)
- Create a new node (found a null (leaf))

First element we insert is going to be the root.

We don’t swap elements on insert like on the heaps.

**Removing elements from a BST:**

It can be done in 2 steps:

1 - Find the element we wish to remove (if it exists)

2 - Replace the node we want to remove with its successor (if any) to maintain the BST invariant.

**Find phase:**

We start on the root node when searching our BST for a node with a particular value. One of four things will happen:

1 - We hit a null node at which point we know the value doesn’t exist within our BST

2 - Comparator value equal to 0 (found it)

3 - Comparator value less than 0 (the value, if it exists, is in the left subtree)

4 - Comparator value greater than 0 (the value, if it exists, is in the right subtree)

**Remove phase:**

We can encounter 4 cases:

Case 1 - If the node we wish to remove is a leaf node then we may do so without side effects

Case 2 and 3 - The successor of the node we are trying to remove in these cases will be the root node of the left/right subtree. It may be the case that we are removing the root node of the BST in which case its immediate child becomes the new root, as we would expect.

Case 4 - In this case, both can be the successor of the node we’re trying to remove. The successor can either be the largest value ins the left subtree or the smallest value in the right subtree.

- The largest value in the left subtree satisfies the BST invariant since it:
  - Is larger than everything in the left subtree. This follows immediately from the definition of being the largest.
  - Is smaller than everything in the right subtree because it was found in the left subtree.
- The smallest value in the right subtree satisfies the BST invariant since it:
  - Is smaller than everything in the right subtree. This follows immediately from the definition of being the smallest.
  - Is larger than everything in the left subtree because it was found in the right subtree.

If we chose right subtree, we enter it and then we dig as far left as possible without changing directions.

If we chose left subtree, we enter it and then we dig as far right as possible without changing directions.

Copy the value from the node found in the subtree to the node we want to remove. Then, we have to remove the node we found in the subtree. Luckily, the node we find will always be either case 1, 2, or 3 to remove.

### Balanced Binary Search Tree

It is a self-balancing BST. This type of tree will adjust itself in order to maintain a low (logarithmic) height, allowing for faster operations such as insertions and deletions.

| Complexity |          | Operation |
| ---------- | -------- | --------- |
| Average    | Worst    |           |
| O(log n)   | O(log n) | Insert    |
| O(log n)   | O(log n) | Remove    |
| O(log n)   | O(log n) | Search    |

**Tree rotations:**

The secret ingredient to most BBST algorithms is the clever usage of a tree invariant and tree rotations.

A tree invariant is a property/rule you impose on your tree that it must meet after every operation. To ensure that the invariant is always satisfied, a series of tree rotations are always applied.

![https://visualgo.net/img/tree_rotation.png](https://visualgo.net/img/tree_rotation.png)

In the left tree we know that A<P<B<Q<C and this remains true for the right subtree, so we didn’t break the BST invariant and, therefore, this is a valid transformation.

In some BBST implementations where we often need to access the parent/uncle nodes (such as RB trees), it’s convenient for nodes to not only have a reference to the left and right child nodes but also to the parent node. This can complicate tree rotations because instead of updating three pointers, now we have to update 6.

### AVL Trees

An AVL tree is one of many types of BBST which allow for O(log n) insertion, deletion, and search operations.

It was the first type of BBST to be discovered. Soon after, many other types of BBST started to emerge, including the 2-3 three, the AA tree, the scapegoat tree, and its main rival, the red-black tree.

**AVL tree invariant:**

The property which keeps an AVL tree balanced is called the Balance Factor (BF).

BF(node) = H(node.right) - H(node.left)

Where H(x) is the height of the node X. Recall that H(x) is calculated as the number of edges between X and the furthest leaf.

The invariant in the AVL which forces it to remain balanced is the requirement that the balance factor is always either -1, 0, or 1.

**Node information to store:**

- The actual value we’re storing in the node.

Note: This value must be comparable so we know how to insert it.

- A value storing this node’s balance factor.
- The height of this node in the tree.
- Pointers to the left/right child nodes.

If the BF is ≠ -1,0, or 1 it means it is +/-2, which can be adjusted using tree rotations (right rotation, left-right rotation, left rotation, right-left rotation).

**Remove elements from an AVL tree**

Similar to remove nodes from a BST.

For a BST it can be seen as a two step process:

1 - Find the element we wish to remove (if it exists)

2 - Replace the node we want to remove with its successor (if any) to maintain the BST invariant.

Augmenting the remove algorithm from a plain BST implementation to an AVL tree is just as easy as adding two lines of code to update the balance factor and rebalance the tree.
