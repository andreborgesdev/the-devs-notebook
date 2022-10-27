# Suffix Arrays

A suffix is a substring at the end of a string of characters. For our purposes, suffixes are non empty.

A SA is an array which contains the sorted suffixes of a string. 

It provides a space efficient alternative to a suffix tree which itself is a compressed version of a Trie.

Note: SA can do everything suffix trees can with some additional information such as Longest Common Prefix (LCP) array.

**Longest Common Substring (LCS) (K-common substring problem):**

Suppose we have n string, how do we find the longest common substring that appears in at least 2≤k≤n of the strings?

There are some ways but with SA we can find the solution in linear time proportional to the sum of the string lengths O(n1+n2+n3+nm)

To find the LCS first create a new larger string T which is the concatenation of all the strings Si separated by unique sentinels.

T = S1 + “#” + S2 + “$” + S3 + “%”

The sentinels must be unique and lexicographically less than any of the characters contained in any of the strings Si.

If suffixes colours on the SA are not adjacent we can use a sliding window to capture the correct amount of suffix colours.

At each step advance the bottom endpoint or adjust the top endpoint such that the window contains exactly k suffixes of different colours.

For each valid window perform a range query on the LCP array between the bottom and top endpoints. The LCS will be the maximum LCP value for all possible windows. Lucky for us, the minimum sliding range query problem can be solved in a total of O(n) time for all windows.

Alternatively, we can use min range query DS such as a segment tree to perform queries in log(n) time which may be easier but slightly slower running for a total of O(n log n).

**Longest Repeated Substring (LRS)**

We use the LCS for a most efficient approach

Find the maximum LCP value