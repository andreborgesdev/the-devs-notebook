# Trie Data Structure Operations

The **Trie** (Prefix Tree) is a tree-like data structure used to efficiently store and retrieve strings, especially useful for prefix-based operations like autocomplete and spell checking.

## Problem Statement

Implement a Trie data structure that supports:

- **Insert**: Add a word to the trie
- **Search**: Check if a word exists in the trie
- **StartsWith**: Check if there's any word with given prefix
- **Delete**: Remove a word from the trie

## Key Concepts

- **Prefix Sharing**: Common prefixes share the same path
- **Space Efficiency**: Reduces storage for related strings
- **Fast Prefix Operations**: O(L) time for prefix queries where L is string length

## Time and Space Complexity

| Operation   | Time Complexity | Space Complexity             |
| ----------- | --------------- | ---------------------------- |
| Insert      | O(L)            | O(ALPHABET_SIZE × N × L)     |
| Search      | O(L)            | O(1)                         |
| StartsWith  | O(L)            | O(1)                         |
| Delete      | O(L)            | O(1)                         |
| **Overall** | **O(L)**        | **O(ALPHABET_SIZE × N × L)** |

**L** = average length of strings, **N** = number of strings

## Java Implementation

### Basic Trie Implementation

```java showLineNumbers
public class Trie {

    static class TrieNode {
        TrieNode[] children;
        boolean isEndOfWord;

        public TrieNode() {
            children = new TrieNode[26]; // For lowercase letters
            isEndOfWord = false;
        }
    }

    private TrieNode root;

    public Trie() {
        root = new TrieNode();
    }

    public void insert(String word) {
        TrieNode current = root;

        for (char c : word.toCharArray()) {
            int index = c - 'a';
            if (current.children[index] == null) {
                current.children[index] = new TrieNode();
            }
            current = current.children[index];
        }

        current.isEndOfWord = true;
    }

    public boolean search(String word) {
        TrieNode node = searchNode(word);
        return node != null && node.isEndOfWord;
    }

    public boolean startsWith(String prefix) {
        return searchNode(prefix) != null;
    }

    private TrieNode searchNode(String word) {
        TrieNode current = root;

        for (char c : word.toCharArray()) {
            int index = c - 'a';
            if (current.children[index] == null) {
                return null;
            }
            current = current.children[index];
        }

        return current;
    }

    public static void demonstrateBasicTrie() {
        Trie trie = new Trie();

        // Insert words
        trie.insert("apple");
        trie.insert("app");
        trie.insert("apricot");
        trie.insert("banana");

        // Test searches
        System.out.println("Search 'app': " + trie.search("app")); // true
        System.out.println("Search 'apple': " + trie.search("apple")); // true
        System.out.println("Search 'appl': " + trie.search("appl")); // false

        // Test prefix searches
        System.out.println("StartsWith 'app': " + trie.startsWith("app")); // true
        System.out.println("StartsWith 'apr': " + trie.startsWith("apr")); // true
        System.out.println("StartsWith 'ban': " + trie.startsWith("ban")); // true
        System.out.println("StartsWith 'cat': " + trie.startsWith("cat")); // false
    }
}
```

### Enhanced Trie with Additional Operations

```java showLineNumbers
import java.util.*;

public class EnhancedTrie {

    static class TrieNode {
        TrieNode[] children;
        boolean isEndOfWord;
        int wordCount; // Number of words ending at this node
        int prefixCount; // Number of words passing through this node
        String word; // Store the actual word (for some operations)

        public TrieNode() {
            children = new TrieNode[26];
            isEndOfWord = false;
            wordCount = 0;
            prefixCount = 0;
            word = null;
        }
    }

    private TrieNode root;

    public EnhancedTrie() {
        root = new TrieNode();
    }

    public void insert(String word) {
        TrieNode current = root;

        for (char c : word.toCharArray()) {
            int index = c - 'a';
            if (current.children[index] == null) {
                current.children[index] = new TrieNode();
            }
            current = current.children[index];
            current.prefixCount++;
        }

        if (!current.isEndOfWord) {
            current.isEndOfWord = true;
            current.word = word;
        }
        current.wordCount++;
    }

    public boolean delete(String word) {
        return deleteHelper(root, word, 0);
    }

    private boolean deleteHelper(TrieNode node, String word, int index) {
        if (index == word.length()) {
            if (!node.isEndOfWord) {
                return false; // Word doesn't exist
            }

            node.wordCount--;
            if (node.wordCount == 0) {
                node.isEndOfWord = false;
                node.word = null;
            }

            // Return true if current node has no children (can be deleted)
            return !hasChildren(node) && node.wordCount == 0;
        }

        char c = word.charAt(index);
        int charIndex = c - 'a';
        TrieNode childNode = node.children[charIndex];

        if (childNode == null) {
            return false; // Word doesn't exist
        }

        childNode.prefixCount--;
        boolean shouldDeleteChild = deleteHelper(childNode, word, index + 1);

        if (shouldDeleteChild) {
            node.children[charIndex] = null;

            // Return true if current node has no children and is not end of another word
            return !node.isEndOfWord && !hasChildren(node);
        }

        return false;
    }

    private boolean hasChildren(TrieNode node) {
        for (TrieNode child : node.children) {
            if (child != null) return true;
        }
        return false;
    }

    public int countWordsWithPrefix(String prefix) {
        TrieNode node = searchNode(prefix);
        return node != null ? node.prefixCount : 0;
    }

    public List<String> getAllWordsWithPrefix(String prefix) {
        List<String> result = new ArrayList<>();
        TrieNode prefixNode = searchNode(prefix);

        if (prefixNode != null) {
            collectAllWords(prefixNode, new StringBuilder(prefix), result);
        }

        return result;
    }

    private void collectAllWords(TrieNode node, StringBuilder prefix, List<String> result) {
        if (node.isEndOfWord) {
            result.add(prefix.toString());
        }

        for (int i = 0; i < 26; i++) {
            if (node.children[i] != null) {
                prefix.append((char) ('a' + i));
                collectAllWords(node.children[i], prefix, result);
                prefix.deleteCharAt(prefix.length() - 1);
            }
        }
    }

    public String longestCommonPrefix() {
        StringBuilder lcp = new StringBuilder();
        TrieNode current = root;

        while (current != null && !current.isEndOfWord && countChildren(current) == 1) {
            for (int i = 0; i < 26; i++) {
                if (current.children[i] != null) {
                    lcp.append((char) ('a' + i));
                    current = current.children[i];
                    break;
                }
            }
        }

        return lcp.toString();
    }

    private int countChildren(TrieNode node) {
        int count = 0;
        for (TrieNode child : node.children) {
            if (child != null) count++;
        }
        return count;
    }

    private TrieNode searchNode(String word) {
        TrieNode current = root;

        for (char c : word.toCharArray()) {
            int index = c - 'a';
            if (current.children[index] == null) {
                return null;
            }
            current = current.children[index];
        }

        return current;
    }
}
```

### Compressed Trie (Radix Tree)

```java showLineNumbers
public class CompressedTrie {

    static class RadixNode {
        Map<Character, RadixNode> children;
        String edgeLabel;
        boolean isEndOfWord;

        public RadixNode() {
            children = new HashMap<>();
            edgeLabel = "";
            isEndOfWord = false;
        }

        public RadixNode(String label) {
            this();
            this.edgeLabel = label;
        }
    }

    private RadixNode root;

    public CompressedTrie() {
        root = new RadixNode();
    }

    public void insert(String word) {
        insertHelper(root, word, 0);
    }

    private void insertHelper(RadixNode node, String word, int index) {
        if (index >= word.length()) {
            node.isEndOfWord = true;
            return;
        }

        char firstChar = word.charAt(index);

        if (!node.children.containsKey(firstChar)) {
            // Create new node with remaining string
            RadixNode newNode = new RadixNode(word.substring(index));
            newNode.isEndOfWord = true;
            node.children.put(firstChar, newNode);
            return;
        }

        RadixNode child = node.children.get(firstChar);
        String edgeLabel = child.edgeLabel;
        String remaining = word.substring(index);

        int commonPrefix = findCommonPrefix(edgeLabel, remaining);

        if (commonPrefix == edgeLabel.length()) {
            // Entire edge matches, continue with remaining string
            insertHelper(child, word, index + commonPrefix);
        } else {
            // Split the edge
            RadixNode splitNode = new RadixNode(edgeLabel.substring(0, commonPrefix));

            // Update existing child
            child.edgeLabel = edgeLabel.substring(commonPrefix);
            splitNode.children.put(child.edgeLabel.charAt(0), child);

            // Create new node for new string
            if (commonPrefix < remaining.length()) {
                RadixNode newNode = new RadixNode(remaining.substring(commonPrefix));
                newNode.isEndOfWord = true;
                splitNode.children.put(newNode.edgeLabel.charAt(0), newNode);
            } else {
                splitNode.isEndOfWord = true;
            }

            node.children.put(firstChar, splitNode);
        }
    }

    private int findCommonPrefix(String str1, String str2) {
        int i = 0;
        while (i < str1.length() && i < str2.length() && str1.charAt(i) == str2.charAt(i)) {
            i++;
        }
        return i;
    }

    public boolean search(String word) {
        RadixNode node = searchNode(word);
        return node != null && node.isEndOfWord;
    }

    private RadixNode searchNode(String word) {
        RadixNode current = root;
        int index = 0;

        while (index < word.length()) {
            char c = word.charAt(index);

            if (!current.children.containsKey(c)) {
                return null;
            }

            current = current.children.get(c);
            String edgeLabel = current.edgeLabel;

            if (index + edgeLabel.length() > word.length()) {
                return null;
            }

            if (!word.substring(index, index + edgeLabel.length()).equals(edgeLabel)) {
                return null;
            }

            index += edgeLabel.length();
        }

        return current;
    }
}
```

## Advanced Applications

### 1. Autocomplete System

```java showLineNumbers
public class AutocompleteSystem {

    static class SuggestionNode extends Trie.TrieNode {
        int frequency;

        public SuggestionNode() {
            super();
            frequency = 0;
        }
    }

    private SuggestionNode root;
    private StringBuilder currentInput;

    public AutocompleteSystem(String[] sentences, int[] times) {
        root = new SuggestionNode();
        currentInput = new StringBuilder();

        for (int i = 0; i < sentences.length; i++) {
            insertWithFrequency(sentences[i], times[i]);
        }
    }

    private void insertWithFrequency(String sentence, int frequency) {
        SuggestionNode current = root;

        for (char c : sentence.toCharArray()) {
            int index = getIndex(c);
            if (current.children[index] == null) {
                current.children[index] = new SuggestionNode();
            }
            current = (SuggestionNode) current.children[index];
        }

        current.isEndOfWord = true;
        current.frequency += frequency;
    }

    public List<String> input(char c) {
        if (c == '#') {
            // End of input, store the sentence
            String sentence = currentInput.toString();
            insertWithFrequency(sentence, 1);
            currentInput.setLength(0);
            return new ArrayList<>();
        }

        currentInput.append(c);
        return getTopSuggestions(currentInput.toString(), 3);
    }

    private List<String> getTopSuggestions(String prefix, int k) {
        SuggestionNode prefixNode = (SuggestionNode) searchNode(prefix);
        if (prefixNode == null) {
            return new ArrayList<>();
        }

        List<Map.Entry<String, Integer>> suggestions = new ArrayList<>();
        collectSuggestions(prefixNode, new StringBuilder(prefix), suggestions);

        // Sort by frequency (descending) then by lexicographical order
        suggestions.sort((a, b) -> {
            if (a.getValue().equals(b.getValue())) {
                return a.getKey().compareTo(b.getKey());
            }
            return b.getValue() - a.getValue();
        });

        return suggestions.stream()
                .limit(k)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }

    private void collectSuggestions(SuggestionNode node, StringBuilder prefix,
                                   List<Map.Entry<String, Integer>> suggestions) {
        if (node.isEndOfWord) {
            suggestions.add(new AbstractMap.SimpleEntry<>(prefix.toString(), node.frequency));
        }

        for (int i = 0; i < node.children.length; i++) {
            if (node.children[i] != null) {
                char nextChar = (i < 26) ? (char) ('a' + i) : (char) ('0' + i - 26);
                prefix.append(nextChar);
                collectSuggestions((SuggestionNode) node.children[i], prefix, suggestions);
                prefix.deleteCharAt(prefix.length() - 1);
            }
        }
    }

    private int getIndex(char c) {
        if (c >= 'a' && c <= 'z') return c - 'a';
        if (c >= '0' && c <= '9') return c - '0' + 26;
        return 36; // For space or other characters
    }
}
```

### 2. IP Address Trie (Routing Table)

```java showLineNumbers
public class IPTrie {

    static class IPNode {
        IPNode[] children; // 0 and 1 for binary representation
        String route; // Next hop information
        int prefixLength;

        public IPNode() {
            children = new IPNode[2];
            route = null;
            prefixLength = 0;
        }
    }

    private IPNode root;

    public IPTrie() {
        root = new IPNode();
    }

    public void addRoute(String ipPrefix, int prefixLength, String nextHop) {
        IPNode current = root;
        String binaryIP = ipToBinary(ipPrefix);

        for (int i = 0; i < prefixLength; i++) {
            int bit = binaryIP.charAt(i) - '0';
            if (current.children[bit] == null) {
                current.children[bit] = new IPNode();
            }
            current = current.children[bit];
        }

        current.route = nextHop;
        current.prefixLength = prefixLength;
    }

    public String longestPrefixMatch(String ip) {
        IPNode current = root;
        String binaryIP = ipToBinary(ip);
        String bestMatch = null;

        for (int i = 0; i < binaryIP.length() && current != null; i++) {
            if (current.route != null) {
                bestMatch = current.route;
            }

            int bit = binaryIP.charAt(i) - '0';
            current = current.children[bit];
        }

        if (current != null && current.route != null) {
            bestMatch = current.route;
        }

        return bestMatch;
    }

    private String ipToBinary(String ip) {
        StringBuilder binary = new StringBuilder();
        String[] parts = ip.split("\\.");

        for (String part : parts) {
            int num = Integer.parseInt(part);
            binary.append(String.format("%8s", Integer.toBinaryString(num)).replace(' ', '0'));
        }

        return binary.toString();
    }
}
```

## Real-world Applications

### Text Processing

- **Autocomplete** and **type-ahead** features
- **Spell checkers** and **word suggestions**
- **Text compression** algorithms

### Networking

- **IP routing tables** (longest prefix matching)
- **URL routing** in web frameworks
- **DNS resolution** optimization

### Bioinformatics

- **DNA sequence** storage and search
- **Protein structure** analysis
- **Genome assembly** algorithms

## Interview Tips

### Common Questions

1. **"When would you use a Trie over a HashMap?"**

   - When you need prefix operations, memory efficiency for similar strings, or ordered traversal

2. **"How to optimize space usage?"**

   - Use compressed tries (radix trees), lazy node creation, or alphabet-specific optimizations

3. **"How to handle different character sets?"**
   - Use HashMap for children instead of fixed array, or adapt array size

### Implementation Notes

- **Choose appropriate alphabet size**: 26 for lowercase, 128 for ASCII, HashMap for Unicode
- **Consider memory vs speed tradeoffs**: Arrays are faster, HashMaps save space
- **Handle deletion carefully**: Remove nodes only when safe

### Quick Decision Framework

- **Prefix operations needed** → Trie
- **Only exact word lookups** → HashMap
- **Space is critical** → Compressed Trie
- **Unicode support needed** → HashMap-based Trie

## Practice Problems

### Essential LeetCode Problems

1. **Implement Trie (Prefix Tree)** (Medium) - Basic implementation
2. **Word Search II** (Hard) - Trie + backtracking
3. **Design Add and Search Words Data Structure** (Medium) - Wildcard support
4. **Longest Word in Dictionary** (Easy) - Trie application

### Advanced Applications

- **Replace Words** (Medium) - Root replacement
- **Map Sum Pairs** (Medium) - Trie with values
- **Palindrome Pairs** (Hard) - Complex Trie usage
- **Design Search Autocomplete System** (Hard) - Real-world application

### Real-world Systems

- **Search engines** with autocomplete
- **Network routing** implementations
- **File system** path optimization
- **Configuration management** systems

## Summary

**Trie data structures** excel at prefix-based operations and string storage with shared prefixes. The key insights are understanding when tries provide advantages over other data structures, implementing efficient node representations, and extending basic operations for specific applications. Mastering tries is essential for text processing and many system design scenarios.
