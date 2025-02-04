# DFS vs BFS

| BFS                                                                                                                                                              	| DFS                                                                                                                                                                       	|
|------------------------------------------------------------------------------------------------------------------------------------------------------------------	|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| BFS(Breadth First Search) uses Queue data structure for finding the shortest path.                                                                               	| DFS(Depth First Search) uses Stack data structure.                                                                                                                        	|
| BFS stands for Breadth First Search.                                                                                                                             	| DFS stands for Depth First Search.                                                                                                                                        	|
| BFS can be used to find single source shortest path in an unweighted graph, because in BFS, we reach a vertex with minimum number of edges from a source vertex. 	| In DFS, we might traverse through more edges to reach a destination vertex from a source.                                                                                 	|
| BFS is more suitable for searching vertices which are closer to the given source.                                                                                	| DFS is more suitable when there are solutions away from source.                                                                                                           	|
| BFS considers all neighbors first and therefore not suitable for decision making trees used in games or puzzles.                                                 	| DFS is more suitable for game or puzzle problems. We make a decision, then explore all paths through this decision. And if this decision leads to win situation, we stop. 	|
| The Time complexity of BFS is O(V + E) when Adjacency List is used and O(V^2) when Adjacency Matrix is used, where V stands for vertices and E stands for edges. 	| The Time complexity of DFS is also O(V + E) when Adjacency List is used and O(V^2) when Adjacency Matrix is used, where V stands for vertices and E stands for edges.     	|
| Here, siblings are visited before the children                                                                                                                   	| Here, children are visited before the siblings                                                                                                                            	|

![https://miro.medium.com/max/1280/1*GT9oSo0agIeIj6nTg3jFEA.gif](https://miro.medium.com/max/1280/1*GT9oSo0agIeIj6nTg3jFEA.gif)

![https://miro.medium.com/max/750/0*ZIsIX-f-j7kvxJMW.png](https://miro.medium.com/max/750/0*ZIsIX-f-j7kvxJMW.png)

![DFS & BFS Algorithms](https://miro.medium.com/max/1400/1*Js-o5Lsxh7v0DmTmsLavTg.gif)

DFS & BFS Algorithms

- **Depth-First Search (DFS) Algorithm:** It starts with the root node and first visits all nodes of one branch as deep as possible of the chosen Node and before backtracking, it visits all other branches in a similar fashion. There are three sub-types under this, which we will cover in this article.
- **Breadth-First Search (BFS) Algorithm:** It also starts from the root node and visits all nodes of current depth before moving to the next depth in the tree. We will cover one algorithm of BFS type in the upcoming section.