# Tree Traversal

**Tree traversal** (also known as **tree search**) refers to the process of visiting (checking and/or updating) each node in a tree data structure exactly once.  
Traversals are classified by the order in which the nodes are visited.

## Categories of Traversal

**1. Depth-First Search (DFS)**

- **Preorder** → Node → Left → Right
- **Inorder** → Left → Node → Right
- **Postorder** → Left → Right → Node

**2. Breadth-First Search (BFS)**

- **Level Order** → Visit nodes level by level, left to right.

## Depth-First Search (DFS) Traversals

### Inorder Traversal

Order:

1. Left subtree
2. Visit Node
3. Right subtree

> **Note:** Inorder Traversal of a **Binary Search Tree (BST)** returns nodes in **sorted order**.

```java showLineNumbers
public void inorderTraversal(TreeNode root) {
    if (root != null) {
        inorderTraversal(root.left);
        System.out.print(root.data + " ");
        inorderTraversal(root.right);
    }
}
```

![Inorder Traversal](https://miro.medium.com/max/1000/1*bxQlukgMC9cGv_MFUllX2Q.gif)

### Preorder Traversal

Order:

1. Visit Node
2. Left subtree
3. Right subtree

```java showLineNumbers
public void preorderTraversal(TreeNode root) {
    if (root != null) {
        System.out.print(root.data + " ");
        preorderTraversal(root.left);
        preorderTraversal(root.right);
    }
}
```

![Preorder Traversal](https://miro.medium.com/max/1000/1*UGoV21qO6N8JED-ozsbXWw.gif)

### Postorder Traversal

Order:

1. Left subtree
2. Right subtree
3. Visit Node

```java showLineNumbers
public void postorderTraversal(TreeNode root) {
    if (root != null) {
        postorderTraversal(root.left);
        postorderTraversal(root.right);
        System.out.print(root.data + " ");
    }
}
```

![Postorder Traversal](https://miro.medium.com/max/1000/1*UGrzA4qtLCaaCiNAKZyj_w.gif)

## Breadth-First Search (BFS) Traversal

### Level Order Traversal

- Visit nodes level by level.
- Uses a **Queue** to track nodes.

Order:

1. Add root to queue.
2. While the queue is not empty:
   - Remove node from front.
   - Visit node.
   - Add left and right children to the queue.

```java showLineNumbers
public void levelorderTraversal(TreeNode root) {
if (root == null) return;

    Queue<TreeNode> queue = new LinkedList<>();
    queue.add(root);

    while (!queue.isEmpty()) {
        TreeNode node = queue.remove();
        System.out.print(node.data + " ");

        if (node.left != null) queue.add(node.left);
        if (node.right != null) queue.add(node.right);
    }

}
```

![Level Order Traversal](https://miro.medium.com/max/1000/1*2NIfAdSadsdK2rP015f6Xg.gif)

## Summary

| Traversal   | Order               | Typical Use                              |
| ----------- | ------------------- | ---------------------------------------- |
| Inorder     | Left → Node → Right | Get sorted data from BST                 |
| Preorder    | Node → Left → Right | Copy tree, serialize structure           |
| Postorder   | Left → Right → Node | Delete tree, evaluate expressions        |
| Level Order | Level by level      | BFS, shortest path, balanced tree checks |

## Interview Tips

- Know both **recursive** and **iterative** implementations (using Stack or Queue).
- Understand when to use **DFS vs BFS** depending on the problem.
- For **large trees**, iterative versions may prevent stack overflow.
- BFS Level Order is useful for shortest path problems in trees.
