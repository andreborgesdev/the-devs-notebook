# Sliding window

The Sliding Window pattern is used to perform a required operation on a specific window size of a given array or linked list, such as finding the longest subarray containing all 1s. Sliding Windows start from the 1st element and keep shifting right by one element and adjust the length of the window according to the problem that you are solving. In some cases, the window size remains constant and in other cases the sizes grows or shrinks.

[https://hackernoon.com/_next/image?url=https%3A%2F%2Fcdn.hackernoon.com%2Fimages%2FG9YRlqC9joZNTWsi1ul7tRkO6tv1-8i6d3wi0.jpg&w=3840&q=75](https://hackernoon.com/_next/image?url=https%3A%2F%2Fcdn.hackernoon.com%2Fimages%2FG9YRlqC9joZNTWsi1ul7tRkO6tv1-8i6d3wi0.jpg&w=3840&q=75)

**Following are some ways you can identify that the given problem might require a sliding window:**

- The problem input is a linear data structure such as a linked list, array, or string
- You’re asked to find the longest/shortest substring, subarray, or a desired value

Common problems you use the sliding window pattern with:

- Maximum sum subarray of size ‘K’ (easy)
- Longest substring with ‘K’ distinct characters (medium)
- String anagrams (hard)

This technique shows how a nested for loop in some problems can be converted to a single for loop to reduce the time complexity.

Generally speaking a sliding window is a sub-list that runs over an underlying collection. I.e., if you have an array like

```
[a b c d e f g h]

```

a sliding window of size 3 would run over it like

```
[a b c]
  [b c d]
    [c d e]
      [d e f]
        [e f g]
          [f g h]

```

This is useful if you for instance want to compute a running average, or if you want to create a set of all adjacent pairs etc.