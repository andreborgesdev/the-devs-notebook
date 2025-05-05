# Trie

A **Trie** (also called **Prefix Tree**) is a specialized tree data structure used to efficiently store and retrieve keys in a dataset of strings.  
It is especially useful for solving problems involving prefixes, word searches, autocomplete, and spell-checking.

## Key Concepts

- Each node represents a single character.
- The **root** node is usually empty or null.
- Paths from the root to a node represent prefixes of the stored strings.
- A flag (often called `isEndOfWord` or similar) marks whether a node completes a valid word.

## Time and Space Complexity

| Operation     | Time Complexity |
| ------------- | --------------- |
| Insert        | O(L)            |
| Search        | O(L)            |
| Prefix Search | O(L)            |

L = Length of the word/prefix.

**Space Complexity:** O(N \* L)  
N = Number of words, L = Average word length (but optimized using shared prefixes).

## Example Structure

```
Insert: "cat", "car", "dog"

        root
       /    \
      c      d
      |       |
      a       o
     / \       |
    t   r      g
```

## Java Example

```java showLineNumbers
import java.util.HashMap;

class TrieNode {
HashMap<Character, TrieNode> children = new HashMap<>();
boolean isEndOfWord = false;
}

public class Trie {
private TrieNode root;

    public Trie() {
        root = new TrieNode();
    }

    // Insert a word into the trie
    public void insert(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            node = node.children.computeIfAbsent(c, k -> new TrieNode());
        }
        node.isEndOfWord = true;
    }

    // Search for a full word
    public boolean search(String word) {
        TrieNode node = findNode(word);
        return node != null && node.isEndOfWord;
    }

    // Search for a prefix
    public boolean startsWith(String prefix) {
        return findNode(prefix) != null;
    }

    // Helper function
    private TrieNode findNode(String s) {
        TrieNode node = root;
        for (char c : s.toCharArray()) {
            node = node.children.get(c);
            if (node == null) return null;
        }
        return node;
    }

    public static void main(String[] args) {
        Trie trie = new Trie();
        trie.insert("cat");
        trie.insert("car");
        trie.insert("dog");

        System.out.println(trie.search("cat")); // true
        System.out.println(trie.search("cab")); // false
        System.out.println(trie.startsWith("ca")); // true
    }

}
```

## Advantages

- **Fast prefix queries** → much faster than searching in lists or sets.
- **Space-efficient for shared prefixes** → saves space when storing related strings.
- **Flexible** → can store additional metadata at nodes (counts, indexes, etc.).

## Disadvantages

- Higher space overhead than simpler structures like HashMap or Set when storing unrelated strings.
- Performance can degrade with very long strings or large alphabets unless carefully optimized.

## Common Applications

- **Autocomplete / Autosuggest**
- **Spell checkers**
- **IP routing (Longest Prefix Match)**
- **Word games (Boggle, Scrabble solvers)**
- **Prefix-based search**

## Interview Tips

- Be ready to explain how shared prefixes save space.
- Know how to implement insert, search, and prefix search.
- Be aware of **Trie compression** (Suffix Trees, Radix Trees) for optimizing space.
- Understand when a HashMap/Set is a better fit (e.g., when prefix queries are not needed).
