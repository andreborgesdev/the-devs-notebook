# Tree traversal

*“In computer science, **tree traversal** (also known as **tree search**) is a form of graph traversal and refers to the process of visiting (checking and/or updating) each node in a tree data structure, exactly once. Such traversals are classified by the order in which the nodes are visited.”*

Tree Traversal Algorithms can be classified broadly in the following two categories by the order in which the nodes are visited: DFS and BFS

There are three types of DFS tree traversal: Preorder, Inorder, and Postorder.

The only BFS tree traversal is Level order.

These three types of traversal are naturally defined recursively:

Preorder → prints **before** the recursive calls. Print the value of the current node then traverse the left subtree followed by the right subtree

Inorder → prints **between** the recursive calls. Print the left subtree, then print the value of the node and continue traversing the right subtree. ***Important Fact:** Inorder Traversal of Binary Search Tree will always give you Nodes in sorted manner.*

Postorder → prints **after** the recursive calls. Traverse the left subtree followed by the right subtree then print the value of the node

Lever order → We want to print the nodes as they appear, one layer at a time. To obtain this ordering we want to do a BFS from the root node down the leaf nodes. To do a BFD we will need to maintain a Queue of the nodes left to explore. Begin with the root inside of the queue and finish when the queue is empty. At each iteration we add the left child and then the right child of the current node to our Queue and remove the current node, inserting it into our ordered list.

# Inorder Traversal

1. Go to left-subtree
2. Visit Node
3. Go to right-subtree

```java
public void inorderTraversal(TreeNode root) {
	if (root != null) {
		inorderTraversal(root.left);
		System.out.print(root.data + " ");
		inorderTraversal(root.right);
	}
}
```

![Inorder Traversal](https://miro.medium.com/max/1000/1*bxQlukgMC9cGv_MFUllX2Q.gif)


# Preorder Traversal

1. Visit Node
2. Go to left-subtree
3. Go to right-subtree

```java
public void preorderTraversal(TreeNode root) {
	if (root != null) {
		System.out.print(root.data + " ");
		preorderTraversal(root.left);
		preorderTraversal(root.right);
	}
}
```

![Preorder Traversal](https://miro.medium.com/max/1000/1*UGoV21qO6N8JED-ozsbXWw.gif)

# Postorder Traversal

1. Go to left-subtree
2. Go to right-subtree
3. Visit Node

```java
public void postorderTraversal(TreeNode root) {
	if (root != null) {
		postorderTraversal(root.left);
		postorderTraversal(root.right);
		System.out.print(root.data + " ");
	}
}
```

![Postorder Traversal](https://miro.medium.com/max/1000/1*UGrzA4qtLCaaCiNAKZyj_w.gif)

# Level Order Traversal

Level order traversal follows BFS(Breadth-First Search) to visit/modify every node of the tree.
As BFS suggests, the breadth of the tree takes priority first and then move to depth. In simple words, we will visit all the nodes present at the same level one-by-one from left to right and then move to the next level to visit all the nodes of that level.

Implementation is slightly challenging here than the above three traversals. We will use a Queue(FIFO) data structure to implement Level order traversal, where after visiting a Node, we simply put its left and right children to queue sequentially.

Here, the order of adding children in the queue is important as we have to traverse left-to-right at the same level. Check out the below gist for more understanding.

```java
public void levelorderTraversal(TreeNode root) {
	if (root == null) {
		return;
	}

	Queue<TreeNode> queue = new LinkedList<>();
	queue.add(root);

	while (!queue.isEmpty()) {
		TreeNode node = queue.remove();
		System.out.print(node.data + " ");

		if (node.left != null) {
			queue.add(node.left);
		}

		if (node.right != null) {
			queue.add(node.right);
		}
	}
}
```

![Level Order Traversal](https://miro.medium.com/max/1000/1*2NIfAdSadsdK2rP015f6Xg.gif)