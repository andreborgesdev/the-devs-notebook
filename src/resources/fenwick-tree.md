# Fenwick Tree (Binary Indexed Tree)

A prefix sum array is great for static arrays, but takes O(n) for updates. And this is why the Fenwick Tree (FT) was created.

It is a DS that supports sum range queries as well as setting values in a static array and getting the value of the prefix sum up some index efficiently.

| Complexity | Operation |
| --- | --- |
| O(n) | Construction |
| O(log n) | Point Update |
| O(log n) | Range Sum |
| O(log n) | Range Update |
| N/A | Adding Index |
| N/A | Removing Index |

We can’t add or remove elements from the array

Unlike a regular array, in a FT a specific cell is responsible for other cells as well. The position of the least significant bit (LSB) determines the range of responsibility that cell has to the cells bellow itself.

Index 12 in binary is 1100

LSB is at position 3, so this index is responsible for 2^(3-1) = 4 cells bellow itself.

10 = 1010 → 2^(2-1) = 2 cells bellow itself

11 = 1011 → 2^(1-1) = 1 cells bellow itself

All odd values have their first LSB set in the first position, so they are only responsible for themselves.

**Range queries:**

In a FT we may compute the **prefix sum** **up to a certain index, which ultimately lets us perform range sum queries.

Idea: Suppose we want to find the prefix sum of [1,i], then we start at i and cascade downwards until we reach zero, adding the value at each of the indices we encounter.

![https://media.geeksforgeeks.org/wp-content/cdn-uploads/BITSum.png](https://media.geeksforgeeks.org/wp-content/cdn-uploads/BITSum.png)

If we want the internal sum between [x,y] but they don’t have a connection we have to compute the prefix sum of [1,y], then we will compute the prefix sum of [1,11] (not inclusive, we want the value at position 11) and get the difference.

Worst case, a range query might make us have to do two queries that cost log2(n) operations.

**Fenwick Tree point updates:**

Point updates are the opposite of the previous. Here, we want to add the LSB to propagate the value up to the cells responsible for us.

**Fenwick Tree construction:**

We initialize it with the values from the array that this FT belongs to. Then, add the value in the current cell to the immediate cell that is responsible for it (parents). Similar to what we did for point updates but only one cell at a time. This will make the “cascading” effect in range queries possible by propagating the value in each cell throughout the tree.

Let i be the current index. The immediate cell above us is at position j given by:

j := i + LSB(i)

If one cell doesn’t have parents we ignore it (don’t do the sum)