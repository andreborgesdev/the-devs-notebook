# KMP (Knuth-Morris-Pratt) Algorithm

**KMP Algorithm** is an efficient string pattern matching algorithm that searches for occurrences of a "pattern" within a main "text" string. It achieves **O(n + m)** time complexity by avoiding redundant character comparisons through preprocessing the pattern.

The key innovation is the **failure function** (also called LPS - Longest Proper Prefix which is also Suffix) that allows skipping characters intelligently when a mismatch occurs.

## Key Concepts

- **Pattern Preprocessing**: Build failure function to avoid redundant comparisons
- **No Backtracking**: Never move backwards in the text string
- **Failure Function (LPS)**: For each position, stores length of longest proper prefix that is also suffix
- **Linear Time**: O(n + m) where n = text length, m = pattern length

## Time and Space Complexity

| Operation           | Time Complexity | Space Complexity |
| ------------------- | --------------- | ---------------- |
| Preprocessing (LPS) | O(m)            | O(m)             |
| Searching           | O(n)            | O(1)             |
| Overall             | O(n + m)        | O(m)             |

**n** = length of text, **m** = length of pattern

## How It Works

### Failure Function (LPS Array)

For pattern "ABABCABAB":

- LPS[0] = 0 (single character has no proper prefix)
- LPS[1] = 0 ("AB" has no matching prefix/suffix)
- LPS[2] = 1 ("ABA" has "A" as prefix and suffix)
- LPS[3] = 2 ("ABAB" has "AB" as prefix and suffix)
- LPS[4] = 0 ("ABABC" has no matching prefix/suffix)
- And so on...

### Pattern Matching Process

When mismatch occurs at position j in pattern:

- If j > 0: Set j = LPS[j-1] and continue matching
- If j = 0: Move to next character in text

## Algorithm Steps

```
1. Preprocessing Phase:
   - Build LPS array for pattern
   - LPS[i] = length of longest proper prefix of pattern[0..i] that is also suffix

2. Searching Phase:
   - Compare text and pattern character by character
   - On mismatch: use LPS array to skip characters intelligently
   - On match: move both pointers forward
```

## Java Implementation

```java showLineNumbers
import java.util.*;

public class KMPAlgorithm {

    public static class KMPResult {
        List<Integer> positions;
        int comparisons;

        KMPResult(List<Integer> positions, int comparisons) {
            this.positions = positions;
            this.comparisons = comparisons;
        }
    }

    // Build LPS (Longest Proper Prefix which is also Suffix) array
    public static int[] buildLPS(String pattern) {
        int m = pattern.length();
        int[] lps = new int[m];
        int len = 0; // Length of previous longest prefix suffix
        int i = 1;

        lps[0] = 0; // lps[0] is always 0

        while (i < m) {
            if (pattern.charAt(i) == pattern.charAt(len)) {
                len++;
                lps[i] = len;
                i++;
            } else {
                if (len != 0) {
                    len = lps[len - 1];
                    // Don't increment i here
                } else {
                    lps[i] = 0;
                    i++;
                }
            }
        }

        return lps;
    }

    // KMP pattern searching
    public static KMPResult search(String text, String pattern) {
        if (pattern.isEmpty()) {
            return new KMPResult(new ArrayList<>(), 0);
        }

        int n = text.length();
        int m = pattern.length();

        // Preprocessing: build LPS array
        int[] lps = buildLPS(pattern);

        List<Integer> positions = new ArrayList<>();
        int i = 0; // Index for text
        int j = 0; // Index for pattern
        int comparisons = 0;

        while (i < n) {
            comparisons++;

            if (text.charAt(i) == pattern.charAt(j)) {
                i++;
                j++;
            }

            if (j == m) {
                // Found a match
                positions.add(i - j);
                j = lps[j - 1];
            } else if (i < n && text.charAt(i) != pattern.charAt(j)) {
                if (j != 0) {
                    j = lps[j - 1];
                } else {
                    i++;
                }
            }
        }

        return new KMPResult(positions, comparisons);
    }

    // Find all occurrences with detailed steps
    public static List<Integer> findAllOccurrences(String text, String pattern) {
        return search(text, pattern).positions;
    }

    // Find first occurrence only
    public static int findFirstOccurrence(String text, String pattern) {
        List<Integer> positions = findAllOccurrences(text, pattern);
        return positions.isEmpty() ? -1 : positions.get(0);
    }

    // Print LPS array construction steps
    public static void printLPSConstruction(String pattern) {
        System.out.println("Building LPS array for pattern: " + pattern);
        int m = pattern.length();
        int[] lps = new int[m];
        int len = 0;
        int i = 1;

        System.out.printf("%-5s %-5s %-10s %-10s\n", "i", "len", "char", "lps[i]");
        System.out.println("------------------------------------");

        lps[0] = 0;
        System.out.printf("%-5d %-5d %-10c %-10d\n", 0, len, pattern.charAt(0), lps[0]);

        while (i < m) {
            if (pattern.charAt(i) == pattern.charAt(len)) {
                len++;
                lps[i] = len;
                System.out.printf("%-5d %-5d %-10c %-10d (match)\n", i, len-1, pattern.charAt(i), lps[i]);
                i++;
            } else {
                if (len != 0) {
                    len = lps[len - 1];
                    System.out.printf("%-5d %-5d %-10c %-10s (fallback)\n", i, len, pattern.charAt(i), "fallback");
                } else {
                    lps[i] = 0;
                    System.out.printf("%-5d %-5d %-10c %-10d (no match)\n", i, len, pattern.charAt(i), lps[i]);
                    i++;
                }
            }
        }

        System.out.println("Final LPS array: " + Arrays.toString(lps));
    }

    // Demonstrate KMP search with steps
    public static void demonstrateSearch(String text, String pattern) {
        System.out.println("\nKMP Search Demonstration:");
        System.out.println("Text: " + text);
        System.out.println("Pattern: " + pattern);

        int[] lps = buildLPS(pattern);
        System.out.println("LPS array: " + Arrays.toString(lps));

        int n = text.length();
        int m = pattern.length();
        int i = 0, j = 0;

        System.out.println("\nStep-by-step search:");
        System.out.printf("%-5s %-5s %-15s %-15s %-10s\n", "Step", "i", "Text Window", "Pattern", "Action");
        System.out.println("------------------------------------------------------------");

        int step = 1;
        while (i < n) {
            String textWindow = i + m <= n ? text.substring(i, i + m) : text.substring(i);
            String currentPattern = pattern.substring(0, Math.min(j + 1, m));

            if (text.charAt(i) == pattern.charAt(j)) {
                String action = "match";
                if (j == m - 1) action = "FOUND!";
                System.out.printf("%-5d %-5d %-15s %-15s %-10s\n", step++, i, textWindow, currentPattern, action);

                i++;
                j++;

                if (j == m) {
                    j = lps[j - 1];
                }
            } else {
                String action = "mismatch";
                if (j != 0) {
                    action = "fallback to j=" + lps[j - 1];
                    j = lps[j - 1];
                } else {
                    action = "advance i";
                    i++;
                }
                System.out.printf("%-5d %-5d %-15s %-15s %-10s\n", step++, i, textWindow, currentPattern, action);
            }

            if (step > 20) break; // Prevent excessive output
        }
    }

    // Example usage and testing
    public static void main(String[] args) {
        // Example 1: Basic pattern matching
        String text1 = "ABABDABACDABABCABCABCABCABC";
        String pattern1 = "ABABCABCABCABC";

        System.out.println("=== Basic KMP Example ===");
        KMPResult result1 = search(text1, pattern1);
        System.out.println("Text: " + text1);
        System.out.println("Pattern: " + pattern1);
        System.out.println("Matches found at positions: " + result1.positions);
        System.out.println("Total comparisons: " + result1.comparisons);

        // Example 2: LPS construction
        System.out.println("\n=== LPS Construction Example ===");
        printLPSConstruction("ABABCABAB");

        // Example 3: Search demonstration
        demonstrateSearch("ABABDABACDABABCABCABCABCABC", "ABABCABCABCABC");
    }
}
```

## Example Walkthrough

### LPS Array Construction for "ABABCABAB"

| i   | len | char | lps[i] | Explanation            |
| --- | --- | ---- | ------ | ---------------------- |
| 0   | 0   | A    | 0      | Base case              |
| 1   | 0   | B    | 0      | A ≠ B, no prefix match |
| 2   | 0   | A    | 1      | A = A, len becomes 1   |
| 3   | 1   | B    | 2      | B = B, len becomes 2   |
| 4   | 2   | C    | 0      | C ≠ A, reset to 0      |
| 5   | 0   | A    | 1      | A = A, len becomes 1   |
| 6   | 1   | B    | 2      | B = B, len becomes 2   |
| 7   | 2   | A    | 3      | A = A, len becomes 3   |
| 8   | 3   | B    | 4      | B = B, len becomes 4   |

**Final LPS: [0, 0, 1, 2, 0, 1, 2, 3, 4]**

### Pattern Matching Example

**Text:** "ABABDABACDABABCABAB"  
**Pattern:** "ABABCABAB"

| Step | i   | j   | Text[i] | Pattern[j] | Action                   |
| ---- | --- | --- | ------- | ---------- | ------------------------ |
| 1    | 0   | 0   | A       | A          | Match, advance both      |
| 2    | 1   | 1   | B       | B          | Match, advance both      |
| 3    | 2   | 2   | A       | A          | Match, advance both      |
| 4    | 3   | 3   | B       | B          | Match, advance both      |
| 5    | 4   | 4   | D       | C          | Mismatch, j = lps[3] = 2 |
| 6    | 4   | 2   | D       | A          | Mismatch, j = lps[1] = 0 |
| 7    | 4   | 0   | D       | A          | Mismatch, advance i      |
| ...  | ... | ... | ...     | ...        | ...                      |

## Advanced Implementations

### KMP with Multiple Patterns (Aho-Corasick-like)

```java showLineNumbers
public class MultiPatternKMP {

    public static Map<String, List<Integer>> searchMultiplePatterns(
            String text, List<String> patterns) {
        Map<String, List<Integer>> results = new HashMap<>();

        for (String pattern : patterns) {
            results.put(pattern, findAllOccurrences(text, pattern));
        }

        return results;
    }
}
```

### Case-Insensitive KMP

```java showLineNumbers
public class CaseInsensitiveKMP {

    public static List<Integer> searchIgnoreCase(String text, String pattern) {
        return KMPAlgorithm.findAllOccurrences(
            text.toLowerCase(), pattern.toLowerCase());
    }
}
```

### KMP with Wildcards

```java showLineNumbers
public class WildcardKMP {
    private static final char WILDCARD = '?';

    public static int[] buildWildcardLPS(String pattern) {
        int m = pattern.length();
        int[] lps = new int[m];
        int len = 0;
        int i = 1;

        while (i < m) {
            if (pattern.charAt(i) == pattern.charAt(len) ||
                pattern.charAt(i) == WILDCARD ||
                pattern.charAt(len) == WILDCARD) {
                len++;
                lps[i] = len;
                i++;
            } else {
                if (len != 0) {
                    len = lps[len - 1];
                } else {
                    lps[i] = 0;
                    i++;
                }
            }
        }

        return lps;
    }

    public static List<Integer> searchWithWildcards(String text, String pattern) {
        int n = text.length();
        int m = pattern.length();
        int[] lps = buildWildcardLPS(pattern);

        List<Integer> positions = new ArrayList<>();
        int i = 0, j = 0;

        while (i < n) {
            if (text.charAt(i) == pattern.charAt(j) || pattern.charAt(j) == WILDCARD) {
                i++;
                j++;
            }

            if (j == m) {
                positions.add(i - j);
                j = lps[j - 1];
            } else if (i < n && text.charAt(i) != pattern.charAt(j) &&
                       pattern.charAt(j) != WILDCARD) {
                if (j != 0) {
                    j = lps[j - 1];
                } else {
                    i++;
                }
            }
        }

        return positions;
    }
}
```

## Applications

### Text Processing and Search Engines

```java showLineNumbers
class TextSearchEngine {

    public class SearchResult {
        String document;
        List<Integer> positions;
        int relevanceScore;

        SearchResult(String document, List<Integer> positions) {
            this.document = document;
            this.positions = positions;
            this.relevanceScore = positions.size();
        }
    }

    public List<SearchResult> searchDocuments(List<String> documents, String query) {
        return documents.stream()
            .map(doc -> new SearchResult(doc, KMPAlgorithm.findAllOccurrences(doc, query)))
            .filter(result -> !result.positions.isEmpty())
            .sorted((a, b) -> Integer.compare(b.relevanceScore, a.relevanceScore))
            .collect(Collectors.toList());
    }
}
```

### DNA Sequence Analysis

```java showLineNumbers
class DNAAnalyzer {

    public static class GeneLocation {
        int position;
        String sequence;

        GeneLocation(int position, String sequence) {
            this.position = position;
            this.sequence = sequence;
        }
    }

    public List<GeneLocation> findGeneSequences(String dna, List<String> genePatterns) {
        List<GeneLocation> locations = new ArrayList<>();

        for (String pattern : genePatterns) {
            List<Integer> positions = KMPAlgorithm.findAllOccurrences(dna, pattern);
            for (int pos : positions) {
                locations.add(new GeneLocation(pos, pattern));
            }
        }

        return locations.stream()
            .sorted(Comparator.comparingInt(g -> g.position))
            .collect(Collectors.toList());
    }

    public boolean hasRepeatedSequence(String dna, String motif, int minOccurrences) {
        List<Integer> occurrences = KMPAlgorithm.findAllOccurrences(dna, motif);
        return occurrences.size() >= minOccurrences;
    }
}
```

### Log File Analysis

```java showLineNumbers
class LogAnalyzer {

    public static class LogPattern {
        String pattern;
        String description;
        int severity;

        LogPattern(String pattern, String description, int severity) {
            this.pattern = pattern;
            this.description = description;
            this.severity = severity;
        }
    }

    public List<String> findSuspiciousActivities(String logContent, List<LogPattern> patterns) {
        List<String> alerts = new ArrayList<>();

        for (LogPattern logPattern : patterns) {
            List<Integer> matches = KMPAlgorithm.findAllOccurrences(logContent, logPattern.pattern);

            if (!matches.isEmpty()) {
                alerts.add(String.format("ALERT [Severity %d]: %s - Found %d occurrences",
                    logPattern.severity, logPattern.description, matches.size()));
            }
        }

        return alerts;
    }
}
```

## Comparison with Other String Matching Algorithms

| Algorithm    | Preprocessing | Search Time             | Space    | Best Use Case                           |
| ------------ | ------------- | ----------------------- | -------- | --------------------------------------- |
| KMP          | O(m)          | O(n)                    | O(m)     | General purpose, guaranteed linear time |
| Boyer-Moore  | O(m + σ)      | O(nm) worst, O(n/m) avg | O(m + σ) | Large alphabets, long patterns          |
| Rabin-Karp   | O(m)          | O(nm) worst, O(n+m) avg | O(1)     | Multiple pattern search                 |
| Z Algorithm  | O(m+n)        | O(m+n)                  | O(m+n)   | String processing, exact matching       |
| Aho-Corasick | O(Σm)         | O(n + z)                | O(Σm)    | Multiple patterns simultaneously        |

**σ** = alphabet size, **z** = number of matches

## Common Optimizations

### Skip-based KMP

```java showLineNumbers
public class OptimizedKMP {

    public static int[] buildOptimizedLPS(String pattern) {
        int m = pattern.length();
        int[] lps = new int[m];
        int[] skip = new int[m];

        // Build standard LPS first
        lps = KMPAlgorithm.buildLPS(pattern);

        // Optimize by avoiding character re-comparison
        for (int i = 0; i < m; i++) {
            if (i > 0 && pattern.charAt(i) == pattern.charAt(lps[i - 1])) {
                skip[i] = skip[lps[i - 1]];
            } else {
                skip[i] = lps[i];
            }
        }

        return skip;
    }
}
```

### Streaming KMP

```java showLineNumbers
public class StreamingKMP {
    private String pattern;
    private int[] lps;
    private int j; // Current position in pattern
    private List<Integer> matches;

    public StreamingKMP(String pattern) {
        this.pattern = pattern;
        this.lps = KMPAlgorithm.buildLPS(pattern);
        this.j = 0;
        this.matches = new ArrayList<>();
    }

    public List<Integer> processChar(char c, int textPosition) {
        List<Integer> newMatches = new ArrayList<>();

        while (j > 0 && pattern.charAt(j) != c) {
            j = lps[j - 1];
        }

        if (pattern.charAt(j) == c) {
            j++;
        }

        if (j == pattern.length()) {
            newMatches.add(textPosition - pattern.length() + 1);
            j = lps[j - 1];
        }

        return newMatches;
    }
}
```

## Interview Tips

### When to Use KMP

1. **Need guaranteed O(n + m) time complexity**
2. **Pattern will be searched multiple times**
3. **Can't afford worst-case quadratic behavior**
4. **Pattern has repeating substructures**

### Key Points to Remember

- **LPS array is crucial**: Understanding how to build it
- **No backtracking in text**: Never move i backwards
- **Failure function optimization**: Core insight of the algorithm
- **Linear time guarantee**: Unlike naive O(nm) approach

### Implementation Details

- **LPS[i] meaning**: Length of longest proper prefix that is also suffix for pattern[0..i]
- **Why it works**: Avoids redundant character comparisons
- **Edge cases**: Empty pattern, single character, pattern longer than text

### Common Interview Questions

1. **"Explain how KMP avoids backtracking"**

   - Uses failure function to skip known non-matching positions

2. **"What is the LPS array and how do you build it?"**

   - Longest proper prefix which is also suffix; built using DP-like approach

3. **"Compare KMP with other string matching algorithms"**

   - Guaranteed linear time vs better average case performance

4. **"Can you implement KMP from scratch?"**
   - Focus on LPS construction and matching logic

## Practice Problems

### Essential LeetCode Problems

1. **Implement strStr()** (Easy) - Direct KMP application
2. **Repeated Substring Pattern** (Easy) - Uses KMP failure function concept
3. **Shortest Palindrome** (Hard) - KMP with string reversal
4. **Find All Anagrams in a String** (Medium) - Pattern matching variant

### Advanced Applications

- **Multiple pattern matching** (extend to Aho-Corasick)
- **Approximate string matching** (with edit distance)
- **Compressed string searching**
- **Regular expression matching** (subset)

### Real-world Use Cases

- **Text editors** (find/replace functionality)
- **Antivirus software** (signature detection)
- **Bioinformatics** (DNA/protein sequence analysis)
- **Network intrusion detection** (payload pattern matching)
