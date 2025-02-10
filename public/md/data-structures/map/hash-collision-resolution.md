# Hash collision resolution

**Separate chaining** deals with hash collisions by maintaining a DS (usually a LL) to hold all the different values which hashed to a particular value.

Note: The DS used to cache items which hashed to a particular values is not limited to a LL. Some implementations use one or a mixture of: arrays, BT, self balancing BT, etc. Some of these are much more memory intensive or complex to implement than a simple LL which is why they might be less popular. Java has an hybrid approach with HM, they switch to a BT or a SBBT once the chain gets to a certain length.

Each position in the HT is actually a LL.

To search, we calculate the H(x) and then look on the LL for it.

![https://media.geeksforgeeks.org/wp-content/cdn-uploads/gq/2015/07/hashChaining1.png](https://media.geeksforgeeks.org/wp-content/cdn-uploads/gq/2015/07/hashChaining1.png)

To **remove** key-value pairs from an HT with separate chaining we lookup for the value and we delete it.

**Open addressing** deals with hash collisions by finding another place withing the HT for the object to go by offsetting it from the position to which it hashed to. When using it as an hash collision resolution technique, the key-value pairs are stored in the table (array) itself as opposed to a DS like in separate chaining. This means we need to care a great deal about the size of our HT and how many elements are currently in the table.

If the position our key hashed to is occupied we try another position in the HT by offsetting the current position subject to a probing sequence P(x). We keep doing this until an unoccupied slot is found.

There are infinite amount of probing sequences we can come up with like:

- Linear probing → P(x) = ax + b (b is obsolete) where a, b are constants
- Quadratic probing → P(x) = ax² + bx + c where a ≠ 0, otherwise we have a linear probing and where a, b, c are constants.
- Double Hashing → P(k, x) = x * H2(k) where H2(k) is a secondary hash function and must have the same type of the keys as H1(k)
- Pseudo random number generator → P(k, x) = x * RNG(H(k), x) where RNG is a random number generator function seeded with H(k).

**mod N** is an important operation for everything related to hashed calculation.

With the P(x) we’ll always find a spot because our load factor is kept under a certain threshold.

**Big issue with open addressing:** Chaos with cycles. Most randomly selected probing sequences modulo N will produce a cycle shorter than the table size. This becomes problematic when we’re trying to insert a key-value pair and all the buckets on the cycle are occupied, we will get stuck in an infinite loop.

Not all P(x) are viable, they produce cycles which are shorter than the table size. 

In general, the consensus is that we don’t handle this issue, instead, we avoid it altogether by restricting our domain of probing functions to those which produce a cycle of exactly length N. There are a few exceptions with special properties that can product shorter cycles.

Techniques such as linear probing, quadratic probing, and double hashing are all subject to the issue of causing cycles which is why the **probing functions used with these methods are very specific.**

Notice that open addressing is very sensitive to the hashing function and probing function used. This is not something we have to worry (as much) if we are using separate chaining as a collision resolution method.

Q: Which values of the constant a in P(x) = ax produce a full cycle modulo N?

A: This happens when a and N are relatively primes. Two numbers are relatively primes if their greatest common denominator (GCD) is equal to 1. Hence, when GCD(a,n) = 1, the probing function P(x) be able to generate a complete cycle and we will always be able to find an empty bucket. F.e. GCD(9,6) = 3 and not 1! So we can get an infinite loop while inserting. A common choice for P(x) is P(x) = 1x since GCD(n,1) = 1 no matter the choice of N (table size).

If threshold = x it means that when we have inserted x elements into the HT we have to re-size the table to make it bigger. We add the elements from the old to the new table by traversing the old table in ascending order on index (as normal).

**Quadratic probing:**

Q: How do we pick a probing function we can work with (without infinite looping)?

A: There are numerous ways, but three of the most popular approaches are:

1 - Let P(x) = x², keep the table size a prime number > 3 and also keep a α ≤ 1/2

2 - Let P(x) = (x² + x) / 2 and keep the table size power of two

3 - Let P(x) = (-1^x) * x² and keep the table size a prime N where N congruent 3 mod 4

**Double Hashing:**

Notice that double hashing reduces to linear probing (except that the constant is unknown until runtime). To fix the issue of cycles, pick the table size to be a prime number and also compute the value of **Δ**

**Δ = H2(k) mod n**

If **Δ** = 0 then we are guaranteed to be stuck in a cycle, so when this happens set **Δ** = 1.

Notice that 1 ≤ **Δ** < N and GCD(**Δ**,n) = 1 since N is prime. Hence, with these conditions we know that modulo n the sequence H1(k),H1(k)+1**Δ**,H1(k)+2**Δ**,... is certain to have order n.

**Constructing H2(k)**

Suppose the key k has type T. Whenever we want to use double hashing as a collision resolution method we need to fabricate a new function H2(k) that knows how to hash keys of type T. We have a systematic way to effectively produce a new hash function every time we need one because luckily for us, the keys we need to hash are always composed of the same fundamental building block. In particular: integers, strings, real numbers, fixed length vectors, etc.

There are many well known high quality H(x) for these fundamental data types. Hence, we can use and combine them to construct our function H2(k). Frequently, the H(x) selected to compose H2(k) are picked from a pool of H(x) called universal hash functions which generally operate on one fundamental data type.

**Removing elements using open addressing:**

The solution for the naïve removing problem is to place a unique marker called tombstone instead of null, to indicate that the bucket should be skipped during a search.

Tombstones count as filled slots in the HT so they increase the load factor and will be removed when the table is resized. Additionally, when inserting a new (k, v) pair you can replace buckets with tombstones with the new key-value-pair.

Instead of probing all tombstones every time we want to search for an element, we can just save the place of the first tombstone we encountered on the probing. As an optimization we can replace this earlier tombstone encountered with the value we did a lookup for. The next time we lookup the key it will be found much fast. We call this **lazy deletion.**