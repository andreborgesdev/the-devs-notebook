# Leetcode exercises notes

[217] Contains Duplicates

- We can do it with 2 for loop (bruteforce way)
- Sort array and search for consecutive duplicates
- Use a DS like Set, Map or table to identify whether an element has been previously encountered in the array (they don’t accept duplicates).

Set is better than the others in this case.

Set.add = true if added successfully and false is there was already an entry there which is equal

[53] Maximum subarray

If sum of 2 indexes is ≤ 0 we don’t want to consider it.

Start with i=1 do nums[i-1] + nums[i].

- One approach is to N³ find all possible outcomes
- We can use DP or divide and conquer
- When we have situations when we need to do a sliding window on an array, instead of doing i and i+1 and having to check if i+1 is not bigger than the length of the array, it is better to do i,i-1 and start at i=1
- A good approach is to use i,i-1 and if > 0 save sum on nums[i]. This will result in a cumulative sum and we just need to then return the max.

[1] Two sum

- We can do it in 1 or 2 steps with the HM
- We should first look for the element and only then, if we didn’t hit the target, we put the i element to the map (for the 1 step solution, on the 2 step solution we isolate the logics on each for loop). The if statement has to come before the map insertion because in case of duplicates that sum to the target ([3,3], 6), if we insert first the second 3, it is going to override the first one and it will return [] (empty because we check if the number we’re doing the sum with is not itself) as the answer instead of [0,1].

[88] Merge Sorted Array

- We can create a temp array to store the nums1 and write the result to nums1 directly
- Better is to do it without the temp array. For that, we do the inverse sorting array (traverse backwards), starting by the end of the array and finishing at the beginning. At each step we decrement an index unit to the array we inserted one element from. This way, we start by filling the last 0s on nums1. We finish when both arrays indexes are ≥ 0.
- We have to do a second while (indexNums2 ≥ 0) because we need to clear it and combine its remaining to nums1. We have to do that because we use indexNums1 first on the first while and use an and operator, which means that once indexNums1 > 0 we don’t run that loop more, even if indexNums1 is not > 0. We cannot also use an or because if one of the indexes is > 0 then we’ll have an ArrayOutOfBoundsException.

[450] Delete Node in a BST

1 - Find node with value x

2 - If it exists change it either with the leftmost value on the right subtree or the rightmost element on the left subtree.

[977] Squares of a sorted array

- The array is already sorted. We are comparing the first and last elements because after squaring the negative values, we have the possibility of being the highest element.
- Both the extremes can contain the max element (after square), so we are inserting these elements to the last position of the new array to make it sorted.
- We have to start the for loop from the end and insert to the result array from finish to beginning (right to left)

[350] Intersection of two arrays II

- If one element was already inserted it cannot be inserted again
- Brute force solution is straight forward, 2 for loop, one for each array and look for [i]==[j]
- A better approach is to use an HM and save the elements as keys and the frequencies (number of times the same number appears) as value. This for the nums1 array. Then, we iterate through nums2 and check if an element is contained on the HM, if it is we add it to the result and decrement on the frequency.
- Follow up question:
    - What if the given array is already sorted? How could you optimize the algorithm?
        - We could use a two pointer iteration. Because it is an ascending order if they are equal we add to the result, if nums1[i]>nums2[j] then we increment j, and vice-versa. TC is O(Max(n,m)). So the TC is always the biggest array.
    - What if nums1’s size is small compared to nums2’s size? Which algorithm is better?
        - Depends. If the size is small enough we can use Binary Search, otherwise, we use the previous two pointer iteration. Let k be nums1’s size. If O(k log n) < O (Max(n,m)) we do BS, otherwise TPI.
    - What if elements of nums2 are stored on disk, and the memory is limited such that you cannot load all elements into memory at once?
        - In only nums2 cannot fit in-memory, put all elements of nums1 into an HM, read chunks of array that fit into the memory, and record the intersections.
        - OR. Store the two strings in a distributed system (or DB), then using MapReduce technique to solve the problem. Process the string by chunks which fits the memory, then deal with each chunk of data at a time. Processing the strings by streaming, then check.

[121] Best time to buy and sell stock

- We want to search for the largest number following the smallest one.
- A good approach is to track the smallest value and the max profit so that we can calculate the max profit as we iterate through the array and comparing it to the current max one using the min price as the reference for the calculation. If the element is smaller than our current minPrice it becomes the new min that will be used for the next calculation.

[566] Reshape the matrix

- The catch for being able to do it in 1 loop is to use division and mod to calculate which position to write to and to read from
- The 2 loop solution has the same TC O(r*c)
- Since it is a matrix, all the rows are going to have the same amount of columns. So, we can just fetch the number of columns of first row to know the size of the others.
- This allows us to use beforehand if the desired output matrix is valid or not

[118] Pascal’s triangle

- By each row, we have to increase the size by 1
- If it is the first or the last position, the value should be 1.
- For the rest of the indexes we do a sum of 2 elements in-a-row from the last row using a sliding window

[189] Rotate array

- My approach was to save in 2 different arrays the parts to swap and then merge them into nums.
- A simpler approach is to reverse both parts (bellow and above k), and reverse this whole array. (3 reverse thinking) we can just start by reversing the whole array and then both parts.

[36] Valid sudoku

- We have to use one DS to store each rule we want to check (row, column, sub-box repetition). Since we don’t want repetition of chars then Set is the perfect DS.
- For calculating in which sub-box we are, we can do 3 * (i / 3) + (j /3) where i = row and j = column
- A smart/mor readable approach is to use string comparison when adding a new element. F.e. seen.add(number + “ in row” + i). This way we also only need one set (seen) instead of three.

[74] Search a 2D Matrix

- To take full advantage of the sorted feature we can cut the matrix by half (BS). O(log n + log m)
- We should initially check if the array is not null or empty to avoid ArrayOutOfBoundsException.

matrix[midpoint / cols][midpoint % cols]

[283] Move zeroes

- Use pointer for the insert position

[387] First unique character in a string

- Use an HM to record the frequency of each word
- We did it in 2 steps:
    - Build the HM from the String and calculate frequency for each letter
    - Find the index of the first letter where frequency == 1
- It is possible to do it in 1 go if we have an HM and a set. We keep track of the letters we’ve seen on the set and of the unique ones on the HM (in case set.contains(x) then hm.remove(x)). On the return statement we return -1 if HM.size == 0, otherwise we return the first letter.
- We can also create an array and save the char on the ASCII index (this is the most efficient solution)

[383] Ransom Note

- We can also apply the ASCII array trick. We can either use char c, c for the index (we need array of size 128), or do c - ‘a’ and we’ll only need a 26 sized array.
- We can do it in one go by doing a “contains” of each ransom letter on magazine and removing the letter in each step until we iterate the whole ransom.
- We start by counting the frequency of the chars in magazine, then in another loop we substract the elements that correspond to the ransom letters/elements. If it is > 0 then we return false (either not sufficient elements or no same elements at all), otherwise, true.

 [242] Valid anagram

Anagram is when 2 strings have exactly the same characters, independent of the order.

- The solutions are the same as the previous 2 exercises
- In these types of problems, normally we look for a false statement, otherwise true (we return true at the end)
- In this case in specific using the ASCII array is a lot more performant
- What if the inputs contain Unicode characters? How would you adapt your solution in such case?
    - In java, a Unicode could be represented by a single char (BMP, Basic Multilingual Plane) or two chars (high surrogate). Basically, we can use:
        - String.codePointAt(int index) method to get the integer representation of a Unicode (as the key in the HM)
        - Use Character.charCount(int code) to count how many of the characters are used there (to correctly increase our index)
    - Since a Unicode can be represented by multiple chars or bytes we cannot simply use the Unicode character directly as the key of the HM. Moreover, reordering those bytes doesn’t necessarily produce an anagram in the semantic sense. The closest we can get is with graphenes, surrogate pairs, and variant selectors.

[141] LinkedList Cycle

- Start to beware to check for nulls and other requirements at the beginning of the code
- Can you solve it using O(1) memory?
    - Yes. We can use a two pointer solution for that. Let’s call them walker and runner. Both are initialized with head, then by each iteration, walker = walker.next, and runner = runner.next.next, which means that for each iteration, the runner will eventually catch up with the walker, then true, it is a loop. Otherwise, the runner will get to a [null.next](http://null.next) 2x faster and like that we know that there’s a tail and no cycle. In sum, this is just like a chasing problem.

[21] Merge two sorted Lists

- If we create a fakeHead (LN fakedHead = new LN(0)) we don’t need to see if list 1 and/or list2 are null because we are going to return fakeHead.next, and if we don’t add any next then it is going to return null, it will also return list1 if list2 is null and vice-versa.
- By having 2 LN vars (head and handler) we can do handler = head and use the handler throughout the code, and in the ned we can just return [head.next](http://head.next) to return the head for the sorted LL. Since handler points to head, in fact we are adding elements to the head LL. Then, the head var allows us to keep a reference to the head itself.
- We can also use recursion to solve this problem. Although it is a cleaner and more beautiful approach, it’s not a good idea to use recursion for a O(n) solution. This solution will result into a StackOverflowError with some thousand elements as input. It is nice but impactical.
- For the iterative solution we don’t need to create a new LN for the list holder, but it is more convenient to do so. But we could use the head of l1 or l2 instead of creating a new one. Discuss with interviewer.

[203] Remove LinkedList Elements

- On LL problems it is important to maintain a reference to the head, if it is not part of the LL class.
- We can also solve it with recursion
- In this case, we create another fakeHead and [assign.next](http://assign.next) to the head. Then we create another LN called current that we use to iterate through the whole LL and re-arrange pointers in case of LN removal.
- For removing it is good to start at position “-1” (this is new LN() of empty that we created for the fakeHead) because, on a singly pointed LL we always need to check if [current.next](http://current.next) == val so that if it is true we can assign current.next = current.next.next. Otherwise, if we do the check for the current LN we have no way to assign the next LN as the next of the previous LN.

[206] Reverse Linked List

- Can also be done using recursion
- The tricky part here is about managing pointers
- We have to create a LN newHead = null (because this is going to be the new tail). Then, while head ≠ null we save the position of the [head.next](http://head.next) on a LN so that we have a reference to the next node of the head (we need it because we will assign a new value to the head.next during this), then we set head.next = newHead and assign newHead = head. This will make the head point to the head of newHead, then when we assign newHead = head we have the reserved LL on new Head until that point. To finish, we have to do head = next so that head continues to the next node (we use the reference we stored at the beginning).
- At one point there’s a disconnection of pointers on head that’s why we need this reference.

![Reverse a Singly Linked List](https://assets.leetcode.com/users/images/f8d5079c-8f2b-4cb0-9efc-fbb2ad717082_1630999817.3000257.gif)

Reverse a Singly Linked List

[83] Remove duplicates from Sorted List

- Similar to the approach of removing one specific element by val. Only difference is that instead of checking if .next == val we check if head.val == head.next.val.

[167] Two sum II - Input array is sorted

- Works with HM as the normal two sum
- But it is not the point of this exercise. Here, we should do BS

[344] Reverse String

- Use a simple two pointers to track the initial and final positions and swap the chars.
- We can also do it without two pointers by for loop till half of the array and swap

[20] Valid parentheses

- Use a stack. Since we want to check that when we have a closing parentheses the last element on the DS is its matching opening parentheses, it makes a stack the perfect DS to use here.
- A better approach for more readability is to push the closing parenthesis when we have an open one, that way when we have a closing one we just need to pop from the stack and compare both. Save a lot of lines of code.

[557] Reverse words in a String III

- Split words to array and then for each work get array of chars and swap chars with two pointers
- We can directly get the array char and convert each work between a ‘ ‘ space.

[232] Implement Queue using stacks

- We can use 2 stacks, a main and temporary. When we want to push a new element we need it to go to the bottom of the main stack so that the first item is the oldest. For that, every time we push a new element we need to pop all elements from main to temp, push new element, and then pop from temp back to main again.
- Another approach is to push normally to main stack and take care of popping the last element
- The best approach is to push and pop normally, and when peek we check if temp stack is empty. If it isn’t we push to it the pop of the main. In sum, this will invert the main stack to temp in ad-hock
- This is the best approach because it will take amortized O(1)

[876] Middle of the Linked List

- Save root in temp var then one loop to get size of LL, then calculate midPoint and another loop to point temp var LL to midpoint and return that.
- We can also save all values on an array then return midpoint of array.
- The best approach is to use a slower and faster pointer where faster goes 2x as fast. When it hits the tail then the slower will be in the middle.

[144] Binary Tree Preorder Traversal

- The recursive implementation is easier to understand
    - Visit Node
    - Traverse all left
    - Traver all right
- If we use an helper method with recursion we don’t need to instantiate a new list at each recursive all (create a void method and pass the list as param)
- Again, iterative is better than recursive because of the stack overflow
- For the iterative approach we need to use some DS to keep track of the Nodes we have left to visit. The best DS to use here is a Stack, where we first push the right and then left (because we want to do the left first and only when there’s no lefts left we start doing the rights). We only stop when this stack is empty. There’s also a way to only store the right side on the stack
- This is the best approach because we are using an implementation of TreeNode which has no pointer to parent, otherwise we would not need a Stack
- Also, if we get an array as inpuy and only wantede to work with it without any class on top, the approach would be different.

[94] Binary Tree Inorder Traversal

- Recursive
    - Traverse all left
    - Visit Node
    - Traverse all right
- We define a current TreeNode outside the while loop. Then we do one while loop while current is not null or stack is not empty. Then, we do another loop inside while current ≠ null and add current to stack and assign current = current.left (this will make us go all the way until we reach a left leaf). Outside this nested while loop we then assign cur = stack.pop() and add the val to the result. To finish, we assign current = current.right.

[145] Binary Tree Postorder Traversal

- Recursive
    - Traverse all left
    - Traverse all right
    - Visit Node
- For all 3 traversals we can use Morris traversal which uses no recursion and needs no stacks.
- We start to push root to stack. Then, while stack is not empty we create a TreeNode current = stack.pop() and add it to the LL using addFirst(inserts element at the beginning of the LL). Then we check if current left is not null and push it to the stack. Then we do the same for cur.right.
- Since we are inserting using addFirst, the last element inserted is going to be the head of the LL. That said, we have to invert the order of the traversal by adding current node, then adding left to stack and lastly adding right.

[102] Binary Tree Order Traversal

- The common algorithm to use if BFS since it iterates the tree level by level. This makes it easier to know in which level we are and to manage things.
- We can also use DFS but, for it to be easier to tack in which level we are is simpler to do recursion and compute (root.left) and compute (root.right)

[19] Remove Nth Node from End of list

- The catch here is to use a slower and faster pointer. The faster we should initially point to n+1 so that when faster == null, our slower will be 1 element behind the element that we have to delete and then we only have to remove it.

[6] Add binary 

- Use a SB to reverse the number at the end
- Doing a while loop until both are empty (or have been traversed) is the best way to approach it.
- By substracting the charAt(i)-’0’, it will convert the numbers from a char type to int, so we can perform operations on numbers.

[704] Binary Search

- We should use start and end to calculate the middlePoint while start ≤ end,
- if taget > nums[middle] start = middle + 1
- if target < nums[middle] end = middle - 1
- We also have to remember to add start on top of the division for the middle point, otherwise it will be incorrect:
- middlePoint = start + (end - start)

[278] First bad version

- Easy to solve by using BS
- Instead of creating a temp variable to hold the value of the first version we can just return the start since it is going to give us the first bad version also.

[35] Search Insert Position

- Similar to a normal BS. Just have to be aware of ArrayOutOfBoundsException for numbers that should be at index 0 or end of array.

[3] **Longest Substring Without Repeating Characters**

- We can do the brute force for O(n²)
- A better way to do it in O(n) is to use a do a sliding window. We can use a DS to keep track of the chars we have on the current substring we are evaluating. If we move the right pointer one position to the right and that char is already on the list we have to move the left pointer one position to the left. Then, we update the new index of the char and we check if the substring we have now is bigger than the max one observed so far.

[567] **Permutation in String**

- We can do a brute force to generate all possible anagrams and check for them on the s2 string.
- A best approach is to calculate the frequency of the chars for s1 and then we loop through s2 for s2.length - s1.length and we check for each position of s2 if the following s1.length chars in s2 sum to the same char frequency as the ones on s1.
- A even better approach is to use a sliding window. Basically, we still take the approach of counting the chars frequency, but now, we maintain the frequency while sliding the window, instead of for each char of s2 we did a for loop to get the next s1.length chars like we did previously.

[733] **Flood Fill**

- We can do it using DFS or even BFS. It can either be recursive or iterative.
- Say `color` is the color of the starting pixel. Let's floodfill the starting pixel: we change the color of that pixel to the new color, then check the 4 neighboring pixels to make sure they are valid pixels of the same `color`, and of the valid ones, we floodfill those, and so on.
- We can use a function `dfs` to perform a floodfill on a target pixel.
- Basically, the trick here is to check the current node neighbour's and then the neighbours' neighbours, and so on. By doing row - and + 1 and col - and + 1 we will always traverse through the 4-directionally elements and not the diagonal ones.

[695] Max Area of Island

- We can do it using DFS or even BFS. It can either be recursive or iterative.
- Here, we start from the 1st element, but, similarly to the previous exercise, we go the through the neighbours until we hit a base case.

[**617] Merge Two Binary Trees**

Recursive:

We can traverse both the given trees in a preorder fashion. At every step, we check if the current node exists(isn't null) for both the trees. If so, we add the values in the current nodes of both the trees and update the value in the current node of the first tree to reflect this sum obtained. At every step, we also call the original function `mergeTrees()`with the left children and then with the right children of the current nodes of the two trees. If at any step, one of these children happens to be null, we return the child of the other tree(representing the corresponding child subtree) to be added as a child subtree to the calling parent node in the first tree. At the end, the first tree will represent the required resultant merged binary tree.

Iterative:

Use a stack for doing the same. The same logic is applied, in a bit of a different way but the core is the same.

[**116] Populating Next Right Pointers in Each Node**

- We can use DFS or BFS
- The idea here is to connect the [left.next](http://left.next) to the right and do it for the different levels. [left.left.next](http://left.left.next) = left.right, [left.right.next](http://left.right.next) = right.left, ....
- We can also start by doing the .next for the whole left side and then do a if (root.next ≠ null) and connect to the left.right to the right.left and then do the .next for the whole right side
- The iterative BFS is a bit trickier. We use the Queue for it as usual. But the approach changes a bit from the DFS. Here, while queue is not empty we have to get the size of the queue currently (before polling). Then, we check if that node has left, if so we add left and right to the queue. Then, we do a for loop starting at position 1 till size, this will make us skip the leftmost element (because we start at 1) and loop until the last node of that level. For each loop iteration we assign the node at position 1 (prev) .next to the current iteration, we then check if this current one has .left and if so we add left and right nodes to the queue. To finish, we assign current node to prev so that for levels that have more than 2 nodes (after 2nd level) we can point to each node in order, otherwise, the leftmost would be the only one pointing to all of them.

[169] Majority Element

- We have to remember that Java does the floor rounding
- We can do it using brute force
- We can also sort and check for element at n/2. Sorting takes O(n log n)
- A good approach is to use an HM to track the frequency of the numbers. This runs in O(n) and has O(n) space complexity
- For O(1) space complexity we can use ****Boyer-Moore Voting Algorithm.****
- For the unit tests we can:
    - Tests with normal and valid inputs
        - Test even and odd length
    - Edge cases:
        - Pass array as empty
        - Not pass a majority element

[2] **Add Two Numbers**

- The logic is quite straightforward, we just have to be careful about the carry and that we make sure to go until the end of both LL.
- We can use sum / 10 to calculate the carry and sum % 10 to calculate the sum with 1 digit.
- The rest is about taking care of the pointers.

[13] Roman to Integer

- The tricky part in this question is to handle the cases where the digits cannot be counted in a linear way. F.e. 4 because it is IV and not III. To implement the "linear" part it is pretty straightforward. For taking into consideration these special cases we can:
    - At the end check if , f.e., indexOf("IV”) is ≠ -1. If it is it means that we have such 4 in our number. In this case we have to subtract -2 to the total sum. It has to be -2 because we previously summed 1+5 which is 6, so to make it 4 we need to subtract 2. Same for IX. For XL and XC we subtract -20. For CD and CM we subtract -200. And so on.
    - We can check if element in current index is smaller than next one. If it is it means that we have a special case. In this case it is simpler to calculate since we can just subtract the current element to the sum and then on the next iteration we'll add the next one. F.e. for IV we see that I is smaller than V and we subtract 1 to the total. In the next iteration we'll add 5. 5-1 = 4.
- We can use a DS like a map to store the value of the Roman chars.