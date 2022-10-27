# Priority Queue

A PQ is an ADT that operates similar to a normal queue except that each element has a certain priority. The priority of the elements in the PQ determine the order in which elements are removed from the PQ.

Note: PQs only support comparable data, meaning the data inserted into the PQ must be able to be ordered in some way, either from least to greatest or greatest to least. This is so that we are able to assign relative priorities to each element.

The PQ is not ordered by priority.

PQs are usually implemented with heaps since this gives them the best possible time complexity.

Heaps are the canonical underlying DS for PQ. PQs are even sometimes wrongly called heaps.

Note: Since PQ is an ADT, heaps are not the only way to implement it. Example, we could use an unsorted list, but this would not give us the best possible time complexity.

There are many types of heaps we could use to implement a PQ, including:

- Binary heap
- Fibonacci heap
- Binomial heap
- Pairing heap
- ...

Complexity of PQ with binary heaps:

| Operation | Complexity |
| --- | --- |
| O(n) | Binary Heap construction |
| O(log n) | Polling (removing from root) → Because we have to restore the heap invariant |
| O(1) | Peeking |
| O(log n) | Adding |
| O(n) | Naïve removing (remove an element which is not root) |
| O(log n) | Advanced removing with help from hash table → * Using an HT to help optimize these operations does take up linear space and also adds some overhead to the binary heap implementation. It adds overhead because we’re accessing our table a lot during swaps |
| O(n) | Naïve contains |
| O(1) | Contains check with help of hash table * |

Turning a min PQ into a max PQ:

- Some languages only provide a min PQ. We can use negation for that. Because if x ≤ y then x comes out of the PQ before y, so the negation of this is if x ≥ y then y comes out before x. The negation is ≥ and not only > because of the way comparators work.
- Specifically for numbers we can negate them before inserting into the PQ and negate them again when when they come out.
- For string we negate the comparator (negate the -1, 0, and 1 possible outputs).

For PQ we normally want to remove the root value since it is the highest priority one. We call this operation polling

# Indexed Priority Queue

It is a traditional PQ variant which on top of the regular PQ operations supports quick updates and deletions and key-value pairs.

In cases where it is very important to be able to dynamically update the priority (value) of certain keys.

The IPQ DS lets us do this efficiently. The first step to using an IPQ is to assign index values to al the keys forming a bidirectional mapping between our N keys and the domain [0,N) (N open).

Often, they keys themselves are integers in the range [0,N) so there’s no need for the mapping, but it’s handy to be able to support any type of key (like names).

If k is the key we want to update, first get the key’s index: ki = map[k], then use ki with the IPQ.

| Complexity | Operation |
| --- | --- |
| O(logn) | delete (ki) |
| O(1) | valueOf (ki) |
| O(1) | contains (ki) |
| O(1) | peekMinKeyIndex |
| O(logn) | pollMinKeyIndex |
| O(1) | peekMinValue |
| O(logn) | pollMinValue |
| O(logn) | insert (ki, value) |
| O(logn) | update (ki, value) |
| O(logn) | decreaseKey (ki, value) |
| O(logn) | increase (ki, value) |

We can create a map (array) for position (to map from value to heap) and one for inverse mapping to map from the heap position to a value.

Inserting is the same as BH except that we have to maintain our maps and update them, specially in case there’s a swim up to satisfy the invariant.

Remove is improved from O(n) on a PQ to O(logn) in a IPQ because of the ki. For polling and removing we also have to maintain the mappings.

Update also takes O(logn) due to O(1) lookup time to find the node and O(logn) time to ajust where the key value pair should appear in the heap. Again, we could have to swim or sink (because of the change in the value) so we have to maintain the maps.

Decrease and increase key → In many applications (e.g. Dijstra’s and Prims Algorithm) it is often useful to only update a given key to make its value either always smaller (or larger). In the event that a worse value is given, the value in the IPQ should not be updated. In such situations it is useful to define a more restricting form of update operation we call increaseKey(ki,v) and decreaseKey(ki,v).