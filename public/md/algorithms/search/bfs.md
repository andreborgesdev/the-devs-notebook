# BFS

## BFS

**[BFS stands for Breadth First Search](https://www.geeksforgeeks.org/breadth-first-search-or-bfs-for-a-graph/)** is a ***vertex*** based technique for finding a shortest path in graph. It uses a **[Queue data structure](https://www.geeksforgeeks.org/queue-data-structure/)** which follows first in first out. 

In BFS, one vertex is selected at a time when it is visited and marked then its adjacent are visited and stored in the queue. 

It is slower than DFS.

The goal is to start at a node and traverse the entire graph. 

- First by visiting all the neighbours of the starting node
- Then by visiting all the neighbours of the second node we visited and so on so forth, expanding through all the neighbours as we go.

We can think about each iteration of the BFS as expanding the frontier from one node outwards at each iteration as we go on.

Input:

```
        A
       / \
      B   C
     /   / \
    D   E   F
```

Output:

`A, B, C, D, E, F`