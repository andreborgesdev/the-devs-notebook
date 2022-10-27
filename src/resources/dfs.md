# DFS

### DFS

**[DFS stands for Depth First Search](https://www.geeksforgeeks.org/depth-first-search-or-dfs-for-a-graph/)** is an ***edge*** based technique. It uses the **[Stack data structure](https://www.geeksforgeeks.org/stack-data-structure/)**, performs two stages:

- Visited vertices are pushed into stack
- If there is no vertices then visited vertices are popped.

If we do a DFS recursively, of course we don't  need to use a Stack to keep track of the data. Here, we use the concept of visited element and we can use a DS with type boolean for that, or, to have less space complexity we can use a flag directly on the input, like -1 for the visited elements (only if -1 is not used on the exercise logic).

Input:

```
        A
       / \
      B   C
     /   / \
    D   E   F
```

Output:

`A, B, D, C, E, F`

There are three things that you need to consider once you have identified that a question can be sovled using DFS

1. The base case ( return condition )
2. Mark that node as visited
3. Given that I am at a particular node what operations do I need to perform

The below solution explains how the above methodology can be used to sovle any DFS solution

1. The base case :

The current node cannota ) Exit the matrix bounding conditionb ) DIfferent from the base colorc ) Be a node that we have already visited

```
        if(sc < 0 || sc >= cl || sr < 0 || sr >= rl || image[sr][sc] != baseColor || visited[sr][sc]) {
            return;
        }

```

1. Mark the node as visited ( I have used another matrix to do it. There are different ways to do it

```
        visited[sr][sc] = true;

```

1. The operation that I need to perform at every node is to check tell all the nodes that are adjucent to me to check their if they are the same color as I am and if yes change their color ( Now the recursion - > every node needs to do what I am doing )

```
        image[sr][sc] = newColor;
        dfs(image, sr + 1, sc, newColor, baseColor, visited);
        dfs(image, sr, sc + 1, newColor, baseColor, visited);
        dfs(image, sr - 1, sc, newColor, baseColor, visited);
        dfs(image, sr , sc - 1, newColor, baseColor, visited);
```