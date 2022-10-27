# Binary Tree

A BT is a tree for which every node has at most two child nodes.

A complete BT is a tree in which at every level, except possible the last, is completely filled and all the nodes are as far left as possible. We want to fill the rows.

# Binary Search Tree

A BST is a BT that satisfies the **BST invariant →** the left subtree has smaller elements and right subtree has larger elements

Note: We can, or cannot, allow duplicate values in our tree. BST allow for duplicate values, but most of the time we are only interested in having unique elements inside our tree

| Complexity |  | Operation |
| --- | --- | --- |
| Average | Worst |  |
| O(log n) | O(n) | Insert |
| O(log n) | O(n) | Delete |
| O(log n) | O(n) | Remove |
| O(log n) | O(n) | Search |

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

# Balanced Binary Search Tree

It is a self-balancing BST. This type of tree will adjust itself in order to maintain a low (logarithmic) height, allowing for faster operations such as insertions and deletions.

| Complexity |  | Operation |
| --- | --- | --- |
| Average | Worst |  |
| O(log n) | O(log n) | Insert  |
| O(log n) | O(log n) | Remove  |
| O(log n) | O(log n) | Search |

**Tree rotations:**

The secret ingredient to most BBST algorithms is the clever usage of a tree invariant and tree rotations.

A tree invariant is a property/rule you impose on your tree that it must meet after every operation. To ensure that the invariant is always satisfied, a series of tree rotations are always applied.

![https://visualgo.net/img/tree_rotation.png](https://visualgo.net/img/tree_rotation.png)

In the left tree we know that A<P<B<Q<C and this remains true for the right subtree, so we didn’t break the BST invariant and, therefore, this is a valid transformation.

In some BBST implementations where we often need to access the parent/uncle nodes (such as RB trees), it’s convenient for nodes to not only have a reference to the left and right child nodes but also to the parent node. This can complicate tree rotations because instead of updating three pointers, now we have to update 6.

# AVL Trees

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