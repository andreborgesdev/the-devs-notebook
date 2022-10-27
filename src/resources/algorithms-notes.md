# Notes from the exercises

### Useful links

[https://seanprashad.com/leetcode-patterns/](https://seanprashad.com/leetcode-patterns/)

[https://hackernoon.com/14-patterns-to-ace-any-coding-interview-question-c5bb3357f6ed](https://hackernoon.com/14-patterns-to-ace-any-coding-interview-question-c5bb3357f6ed)

[https://interviews.school/](https://interviews.school/)

[https://visualgo.net/en](https://visualgo.net/en)

### Arrays

- Some useful techniques are:
    - Sliding window (if we do i and i-1 we don't have to check if i+1 is bigger than length) When we have situations when we need to do a sliding window on an array, instead of doing i and i+1 and having to check if i+1 is not bigger than the length of the array, it is better to do i,i-1 and start at i=1.
    - DP
    - Divide and Conquer
- Sometimes when we need to return an array as the answer we can just work on top of the array that was given as input (to start just create a new one to avoid mistakes but on the refactoring part we can think about it. Take into consideration that not all types of problems allow for this).
- It's common to have to track frequency of an element. We can use some kind of Map for this.
- It makes a difference on the algorithm when we want to search on a sorted array, we can use techniques such as:
    - Two pointer where we can just iteratively compare the values on the arrays without having to start from the beginning again. This changes the TC from O(N²) to O(Max(N,M))
    - Binary Search. This will depend on the size of the arrays. Let k be nums1's size. If O(k log N) < O(Max(N,M)) we do BS, otherwise TPI
- If one array cannot fit in-memory we can:
    - Put all elements of the other array into an HM and read chunks of the array that fits into the memory, and record the intersections.
    - 1 - Store two arrays in a distributed system (or DB), then using MapReduce technique to solve the problem
    - 2 - Processing the arrays by chunk, which fits the memory, then deal with each chunk of data at a time
    - 3 - Processing the arrays using Streams.

### Bi-dimensional Arrays

- Matrixes:
    - Column size is equal for all rows, so if we want to know the column size for all rows we can just do [0].length

### Strings

- The most common ways of dealing with strings is either with substring/charAt(index) or array of char/String
- Since we can convert them to Arrays the techniques there apply here as well
- When we are dealing with frequency of chars we can create a Map as stated previously or here can even create an array where the indexes are the ASCII values of the char and then we do [char]++ or [char]—. Like this for the alphabet we need an array with size 128, but if we do [char - 'a'] then we only need 26. We can only do this for lowercase letters.
- As a rule of thumb (really generalized take it with a grain of salt) we normally look for a false statement in our code, otherwise we return true;
- If a String contains Unicode characters:
    - In Java, a Unicode could be represented by a single char (BMP, Basic Multilingual Plane) or two chars (high surrogate).
    - String.atCodePointAt(int index) method to get the integer representation of a Unicode (as the key in the HM)
    - Character.charCount(int code) to count how many of the characters are used there (to correctly increase our index)
    - Since a unicode can be represented by multiple chars or bytes, we cannot simply use the Unicode character directly as the key of the HM
    - For more information search for graphenes, surrogate pairs, and variation selection.

### LinkedLists

- The hard part of LL is to think clearly about how the pointers work and how we should get our way to handle them correctly
- Start to beware to check for nulls and other requirements at the beginning of the code
- If asked for the head of the LL we should create a reference for it (local var that points to the head of the LL), if it is not part of the LL class definition
- Normally we can solve the problems with recursion but if the time complexity is O(N) then we could have an input big and get a StackOverflow error
- We can sometimes use two pointers for a more performant solution
- Sometimes we want to create a new LN fakeHead = new LN(0) and then [fakeHead.next](http://fakeHead.next) = head so that we start at position "-1". This is useful special for removel of specific elements since we want to compare .next.val and if it is == val then we have to to .next = .next.next and if we have a singly LL we have no way to point backwards to the previous Node. Here I initalized the LN with 0 but it is irrelevant because we are going to return fakeHead.next. This means that fakeHead is going to reference the head still so we need to assign it to another LN handler = fakeHead and we will use this one to traverse through the LL and make the operations
- When we want to invert/reverse a LL we create it as LN fakeHead = null because it is going to be the tail
    - For this one the approach is to make the head pointers point backwards
- For getting a LL middle the best approach is to use a slower and faster pointer. The slower pointer does .next and the faster pointer does .next.next. By the time the faster pointer gets to the end the the slower one will be at the middle of the traversing.

### Stacks/Queues

- When we want to create a queue from a stack we can just pop the elements from one stack to another because the elements will be inverted
- When we use Queue = new LinkedList we should use offer() and poll() instead of add() and remove()

### Trees

- We can traverse a tree using pre, in, post, or level order traversal.
- For most problems we can almost always use DFS or BFS and we can use recursive or iterative approaches
- *Inorder Traversal of Binary Search Tree will always give you Nodes in sorted manner.*

## Sum:

```
If input array is sorted then
- Binary search
- Two pointers

If asked for all permutations/subsets then
- Backtracking

If given a tree then
- DFS
- BFS

If given a graph then
- DFS
- BFS

If given a linked list then
- Two pointers

If recursion is banned then
- Stack

If must solve in-place then
- Swap corresponding values
- Store one or more different values in the same pointer

If asked for maximum/minimum subarray/subset/options then
- Dynamic programming

If asked for top/least K items then
- Heap

If asked for common strings then
- Map
- Trie

Else
- Map/Set for O(1) time & O(n) space
- Sort input for O(nlogn) time and O(1) space
```