# Longest Common Prefix Array

The LCP array is an array which every index tracks how many characters two sorted adjacent suffixes have in common.

By convention LCP[0] is undefined, but for most purposes it’s fine to set it to zero.

Note: There exists many methods for efficiently constructing the LCP array in O(n log n) and O(n).

A good usage for SA/LCP arrays is to find unique substring.