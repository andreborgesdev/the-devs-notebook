import { SquareTerminal, Bot, BookOpen } from "lucide-react";
import { title } from "process";
import { ReactNode } from "react";

export interface ContentItem {
  title: string;
  url: string;
  icon: ReactNode | string;
  items?: ContentItem[];
}

// Declare all content here to be able to see it on the UI
export const Content: ContentItem[] = [
  {
    title: "Quick Reference Cards",
    url: "/quick-reference",
    icon: "📚",
  },
  {
    title: "Cheat Sheet",
    url: "/cheat-sheet",
    icon: "💾",
  },
  {
    title: "Computer Science",
    url: "/computer-science",
    icon: "💻",
    items: [
      {
        title: "Interactive Visualizers",
        url: "/computer-science/visualizers",
        icon: "🎮",
      },
      {
        title: "Memory",
        url: "/computer-science/memory",
        icon: "💾",
      },
      {
        title: "Processor",
        url: "/computer-science/processor",
        icon: "💻",
      },
      {
        title: "Networking",
        url: "/computer-science/networking",
        icon: "🌐",
      },
      {
        title: "Operating System",
        url: "/computer-science/operating-system",
        icon: "💻",
      },
      {
        title: "Compilers",
        url: "/computer-science/compilers",
        icon: "🔧",
      },
      {
        title: "Database Systems",
        url: "/computer-science/database-systems",
        icon: "🗄️",
      },
      {
        title: "Machine Learning",
        url: "/computer-science/machine-learning",
        icon: "🤖",
      },
      {
        title: "Computer Graphics",
        url: "/computer-science/computer-graphics",
        icon: "🎨",
      },
      {
        title: "Distributed Systems",
        url: "/computer-science/distributed-systems",
        icon: "🌐",
      },
      {
        title: "Software Engineering",
        url: "/computer-science/software-engineering",
        icon: "⚙️",
      },
      {
        title: "Formal Methods",
        url: "/computer-science/formal-methods",
        icon: "📐",
      },
      {
        title: "Human-Computer Interaction",
        url: "/computer-science/human-computer-interaction",
        icon: "👤",
      },
    ],
  },
  {
    title: "Data Structures",
    url: "/data-structures",
    icon: "💾",
    items: [
      // {
      //   title: "Interactive Visualizers",
      //   url: "/data-structures/visualizers",
      //   icon: "🎮",
      // },
      {
        title: "Introduction",
        url: "/data-structures/introduction",
        icon: "💡",
      },
      {
        title: "Array",
        url: "/data-structures/array",
        icon: "💾",
        items: [
          {
            title: "Introduction",
            url: "/data-structures/array/introduction",
            icon: "💡",
          },
          {
            title: "Vector",
            url: "/data-structures/array/vector",
            icon: "💾",
          },
          {
            title: "Suffix Arrays",
            url: "/data-structures/array/suffix-arrays",
            icon: "💾",
          },
        ],
      },
      {
        title: "List",
        url: "/data-structures/list",
        icon: "💾",
        items: [
          {
            title: "Introduction",
            url: "/data-structures/list/introduction",
            icon: "💡",
          },
          {
            title: "Linked List",
            url: "/data-structures/list/linked-list",
            icon: "💾",
          },
        ],
      },
      {
        title: "Set",
        url: "/data-structures/set",
        icon: "💾",
      },
      {
        title: "Stack",
        url: "/data-structures/stack",
        icon: "💾",
      },
      {
        title: "Queue",
        url: "/data-structures/queue",
        icon: "💾",
        items: [
          {
            title: "Introduction",
            url: "/data-structures/queue/introduction",
            icon: "💡",
          },
          {
            title: "Circular Buffer",
            url: "/data-structures/queue/circular-buffer",
            icon: "🔄",
          },
          {
            title: "Deque",
            url: "/data-structures/queue/deque",
            icon: "🔄",
          },
          {
            title: "Priority Queue",
            url: "/data-structures/queue/priority-queue",
            icon: "💾",
          },
        ],
      },
      {
        title: "Map",
        url: "/data-structures/map",
        icon: "🗺️",
        items: [
          {
            title: "Introduction",
            url: "/data-structures/map/introduction",
            icon: "💡",
          },
          {
            title: "Hash Collision",
            url: "/data-structures/map/hash-collision",
            icon: "🗺️",
          },
        ],
      },
      {
        title: "Graph",
        url: "/data-structures/graph",
        icon: "🌐",
        items: [
          {
            title: "Introduction",
            url: "/data-structures/graph/introduction",
            icon: "💡",
          },
        ],
      },
      {
        title: "Tree",
        url: "/data-structures/tree",
        icon: "🌲",
        items: [
          {
            title: "Introduction",
            url: "/data-structures/tree/introduction",
            icon: "💡",
          },
          {
            title: "Binary Tree",
            url: "/data-structures/tree/binary-tree",
            icon: "🌲",
          },
          {
            title: "B-Tree",
            url: "/data-structures/tree/b-tree",
            icon: "🌲",
          },
          {
            title: "Fenwick Tree",
            url: "/data-structures/tree/fenwick-tree",
            icon: "🌲",
          },
          {
            title: "Heap",
            url: "/data-structures/tree/heap",
            icon: "🌲",
          },
          {
            title: "Red-Black Tree",
            url: "/data-structures/tree/red-black-tree",
            icon: "🔴",
          },
          {
            title: "Segment Tree",
            url: "/data-structures/tree/segment-tree",
            icon: "📊",
          },
          {
            title: "Skip List",
            url: "/data-structures/tree/skip-list",
            icon: "🌲",
          },
          {
            title: "Splay Tree",
            url: "/data-structures/tree/splay-tree",
            icon: "🌲",
          },
          {
            title: "Trie",
            url: "/data-structures/tree/trie",
            icon: "🌲",
          },
          {
            title: "Union Find",
            url: "/data-structures/tree/union-find",
            icon: "🔗",
          },
        ],
      },
      {
        title: "String",
        url: "/data-structures/string",
        icon: "📝",
        items: [
          {
            title: "Rope",
            url: "/data-structures/string/rope",
            icon: "🪢",
          },
          {
            title: "Suffix Tree",
            url: "/data-structures/string/suffix-tree",
            icon: "🌲",
          },
        ],
      },
      {
        title: "Advanced",
        url: "/data-structures/advanced",
        icon: "🚀",
        items: [
          {
            title: "Bloom Filter",
            url: "/data-structures/bloom-filter",
            icon: "🌸",
          },
          {
            title: "Persistent Data Structures",
            url: "/data-structures/advanced/persistent-data-structures",
            icon: "💾",
          },
        ],
      },
    ],
  },
  {
    title: "Algorithms",
    url: "/algorithms",
    icon: "🧠",
    items: [
      // {
      //   title: "Interactive Visualizers",
      //   url: "/algorithms/visualizers",
      //   icon: "🎮",
      // },
      {
        title: "Introduction",
        url: "/algorithms/introduction",
        icon: "💡",
      },
      {
        title: "Big O",
        url: "/algorithms/big-o",
        icon: "📝",
      },
      {
        title: "Sort",
        url: "/algorithms/sort",
        icon: "📊",
        items: [
          {
            title: "Introduction",
            url: "/algorithms/sort/introduction",
            icon: "💡",
          },
          {
            title: "Bogo sort",
            url: "/algorithms/sort/bogo-sort",
            icon: "📊",
          },
          {
            title: "Bubble Sort",
            url: "/algorithms/sort/bubble-sort",
            icon: "📊",
          },
          {
            title: "Bucket Sort",
            url: "/algorithms/sort/bucket-sort",
            icon: "📊",
          },
          {
            title: "Counting Sort",
            url: "/algorithms/sort/counting-sort",
            icon: "📊",
          },
          {
            title: "Heap Sort",
            url: "/algorithms/sort/heap-sort",
            icon: "📊",
          },
          {
            title: "Insertion Sort",
            url: "/algorithms/sort/insertion-sort",
            icon: "📊",
          },
          {
            title: "Merge Sort",
            url: "/algorithms/sort/merge-sort",
            icon: "📊",
          },
          {
            title: "Quick Sort",
            url: "/algorithms/sort/quick-sort",
            icon: "📊",
          },
          {
            title: "Radix Sort",
            url: "/algorithms/sort/radix-sort",
            icon: "📊",
          },
          {
            title: "Selection Sort",
            url: "/algorithms/sort/selection-sort",
            icon: "📊",
          },
          {
            title: "Shell Sort",
            url: "/algorithms/sort/shell-sort",
            icon: "📊",
          },
        ],
      },
      {
        title: "Search",
        url: "/algorithms/search",
        icon: "🔎",
        items: [
          {
            title: "Linear Search",
            url: "/algorithms/search/linear-search",
            icon: "🔎",
          },
          {
            title: "Binary Search",
            url: "/algorithms/search/binary-search",
            icon: "🔎",
          },
          {
            title: "Tree traversal",
            url: "/algorithms/search/tree-traversal",
            icon: "🌲",
          },
          {
            title: "BFS",
            url: "/algorithms/search/bfs",
            icon: "🔎",
          },
          {
            title: "DFS",
            url: "/algorithms/search/dfs",
            icon: "🔎",
          },
          {
            title: "DFS vs BFS",
            url: "/algorithms/search/dfs-vs-bfs",
            icon: "🔎",
          },
        ],
      },
      {
        title: "String Algorithms",
        url: "/algorithms/string",
        icon: "🔤",
        items: [
          {
            title: "Aho-Corasick Algorithm",
            url: "/algorithms/string/aho-corasick-algorithm",
            icon: "🔍",
          },
          {
            title: "Boyer-Moore Algorithm",
            url: "/algorithms/string/boyer-moore-algorithm",
            icon: "🔍",
          },
          {
            title: "KMP Algorithm",
            url: "/algorithms/string/kmp-algorithm",
            icon: "🔍",
          },
          {
            title: "Rabin-Karp Algorithm",
            url: "/algorithms/string/rabin-karp-algorithm",
            icon: "🔍",
          },
          {
            title: "Z Algorithm",
            url: "/algorithms/string/z-algorithm",
            icon: "🔍",
          },
        ],
      },
      {
        title: "Graph Algorithms",
        url: "/algorithms/graph",
        icon: "🌐",
        items: [
          {
            title: "A* Pathfinding",
            url: "/algorithms/graph/a-star-pathfinding",
            icon: "🎯",
          },
          {
            title: "Bellman-Ford Algorithm",
            url: "/algorithms/graph/bellman-ford-algorithm",
            icon: "📊",
          },
          {
            title: "Dijkstra Algorithm",
            url: "/algorithms/graph/dijkstra-algorithm",
            icon: "🛣️",
          },
          {
            title: "Floyd-Warshall Algorithm",
            url: "/algorithms/graph/floyd-warshall-algorithm",
            icon: "🔄",
          },
          {
            title: "Kruskal's Minimum Spanning Tree",
            url: "/algorithms/kruskal-minimum-spanning-tree",
            icon: "🌲",
          },
        ],
      },
      {
        title: "Mathematical Algorithms",
        url: "/algorithms/mathematical",
        icon: "🔢",
        items: [
          {
            title: "Euclidean Algorithm",
            url: "/algorithms/mathematical/euclidean-algorithm",
            icon: "🔢",
          },
          {
            title: "Fast Exponentiation",
            url: "/algorithms/mathematical/fast-exponentiation",
            icon: "⚡",
          },
          {
            title: "Lowest Common Ancestor",
            url: "/algorithms/mathematical/lowest-common-ancestor",
            icon: "🌲",
          },
          {
            title: "Modular Arithmetic",
            url: "/algorithms/mathematical/modular-arithmetic",
            icon: "🔢",
          },
          {
            title: "Sieve of Eratosthenes",
            url: "/algorithms/mathematical/sieve-of-eratosthenes",
            icon: "🔍",
          },
          {
            title: "Bit Manipulation",
            url: "/algorithms/bit-manipulation",
            icon: "🔢",
          },
        ],
      },
      {
        title: "Backtracking Algorithms",
        url: "/algorithms/backtracking",
        icon: "🔄",
        items: [
          {
            title: "N-Queens",
            url: "/algorithms/backtracking/n-queens",
            icon: "♛",
          },
          {
            title: "Permutations & Combinations",
            url: "/algorithms/backtracking/permutations-combinations",
            icon: "🔀",
          },
          {
            title: "Subset Sum",
            url: "/algorithms/backtracking/subset-sum",
            icon: "➕",
          },
          {
            title: "Sudoku Solver",
            url: "/algorithms/backtracking/sudoku-solver",
            icon: "🧩",
          },
        ],
      },
      {
        title: "Greedy Algorithms",
        url: "/algorithms/greedy",
        icon: "🎯",
        items: [
          {
            title: "Activity Selection",
            url: "/algorithms/greedy/activity-selection",
            icon: "📅",
          },
        ],
      },
      {
        title: "Data Structure Operations",
        url: "/algorithms/data-structures",
        icon: "🗃️",
        items: [
          {
            title: "Trie Operations",
            url: "/algorithms/data-structures/trie-operations",
            icon: "🌲",
          },
        ],
      },
      {
        title: "Dynamic programming",
        url: "/algorithms/dynamic-programming",
        icon: "🧩",
        items: [
          {
            title: "Introduction",
            url: "/algorithms/dynamic-programming",
            icon: "💡",
          },
          {
            title: "Coin Change",
            url: "/algorithms/dynamic-programming/coin-change",
            icon: "🪙",
          },
          {
            title: "Edit Distance",
            url: "/algorithms/dynamic-programming/edit-distance",
            icon: "✏️",
          },
          {
            title: "Kadane's Algorithm",
            url: "/algorithms/dynamic-programming/kadanes-algorithm",
            icon: "📈",
          },
          {
            title: "Knapsack 0-1",
            url: "/algorithms/dynamic-programming/knapsack-0-1",
            icon: "🎒",
          },
          {
            title: "Longest Common Subsequence",
            url: "/algorithms/dynamic-programming/longest-common-subsequence",
            icon: "🔗",
          },
          {
            title: "Longest Increasing Subsequence",
            url: "/algorithms/dynamic-programming/longest-increasing-subsequence",
            icon: "📊",
          },
          {
            title: "Matrix Chain Multiplication",
            url: "/algorithms/dynamic-programming/matrix-chain-multiplication",
            icon: "🔢",
          },
          {
            title: "Palindrome Partitioning",
            url: "/algorithms/dynamic-programming/palindrome-partitioning",
            icon: "🪞",
          },
        ],
      },
      {
        title: "Recursion",
        url: "/algorithms/recursion",
        icon: "🔄",
      },
      {
        title: "Cheat sheets",
        url: "/algorithms/algorithms-cheat-sheets",
        icon: "📝",
      },
      {
        title: "Notes",
        url: "/algorithms/algorithms-notes",
        icon: "📝",
      },
      // TODO: Curate this
      {
        title: "Techniques",
        url: "/algorithms/Techniques",
        icon: "📝",
        items: [
          {
            title: "General notes",
            url: "/algorithms/algorithms-notes",
            icon: "💡",
          },
          {
            title: "Sliding window",
            url: "/algorithms/algorithms-notes/sliding-window",
            icon: "🪟",
          },
          {
            title: "Two pointers/iterators",
            url: "/algorithms/algorithms-notes/two-pointers",
            icon: "2️",
          },
          {
            title: "Fast and slow pointers",
            url: "/algorithms/algorithms-notes/fast-and-slow-pointers",
            icon: "💾",
          },
          {
            title: "Merge intervals",
            url: "/algorithms/algorithms-notes/merge-intervals",
            icon: "💾",
          },
          {
            title: "Cyclic sort",
            url: "/algorithms/algorithms-notes/cyclic-sort",
            icon: "💾",
          },
          {
            title: "In-place reversal of urled list",
            url: "/algorithms/algorithms-notes/in-place-reversal-of-urled-list",
            icon: "💾",
          },
          {
            title: "Tree BFS",
            url: "/algorithms/algorithms-notes/tree-bfs",
            icon: "🌲",
          },
          {
            title: "Tree DFS",
            url: "/algorithms/algorithms-notes/tree-dfs",
            icon: "🌲",
          },
          {
            title: "Two heaps",
            url: "/algorithms/algorithms-notes/two-heaps",
            icon: "💾",
          },
          {
            title: "Subsets",
            url: "/algorithms/algorithms-notes/subsets",
            icon: "💾",
          },
          {
            title: "Modified binary search",
            url: "/algorithms/algorithms-notes/modified-binary-search",
            icon: "💾",
          },
          {
            title: "Top K elements",
            url: "/algorithms/algorithms-notes/top-k-elements",
            icon: "💾",
          },
          {
            title: "K-way Merge",
            url: "/algorithms/algorithms-notes/k-way-merge",
            icon: "💾",
          },
          {
            title: "Topological sort",
            url: "/algorithms/algorithms-notes/topological-sort",
            icon: "💾",
          },
        ],
      },
    ],
  },
  {
    title: "Java",
    url: "/java",
    icon: "☕",
    items: [
      // {
      //   title: "Interactive Visualizers",
      //   url: "/java/visualizers",
      //   icon: "🎮",
      // },
      {
        title: "Introduction",
        url: "/java/introduction",
        icon: "💡",
      },
      {
        title: "Core Language",
        url: "/java/core",
        icon: "🏗️",
        items: [
          {
            title: "Fundamentals",
            url: "/java/java-fundamentals",
            icon: "🔤",
          },
          {
            title: "Object-Oriented Programming",
            url: "/java/java-oop",
            icon: "🎯",
          },
          {
            title: "Strings",
            url: "/java/java-strings",
            icon: "🔤",
          },
          {
            title: "Exception Handling",
            url: "/java/java-exception-handling",
            icon: "⚠️",
          },
          {
            title: "Generics",
            url: "/java/java-generics",
            icon: "🎭",
          },
        ],
      },
      {
        title: "Data Structures",
        url: "/java/data-structures",
        icon: "💾",
        items: [
          {
            title: "Introduction",
            url: "/java/data-structures/introduction",
            icon: "💡",
          },
          {
            title: "Collections Framework",
            url: "/java/java-collections-comprehensive",
            icon: "📦",
          },
          {
            title: "ArrayList",
            url: "/java/data-structures/array-list",
            icon: "💾",
          },
          {
            title: "HashMap",
            url: "/java/data-structures/hash-map",
            icon: "🗺️",
          },
        ],
      },
      {
        title: "Modern Java",
        url: "/java/modern",
        icon: "🚀",
        items: [
          {
            title: "Java 8+ Features",
            url: "/java/java-8-features",
            icon: "🚀",
          },
          {
            title: "Streams",
            url: "/java/java-streams",
            icon: "💧",
          },
        ],
      },
      {
        title: "Advanced Topics",
        url: "/java/advanced",
        icon: "🎓",
        items: [
          {
            title: "Concurrency & Multithreading",
            url: "/java/java-concurrency",
            icon: "⚡",
          },
          {
            title: "JVM & Garbage Collection",
            url: "/java/java-jvm-gc",
            icon: "🗑️",
          },
          {
            title: "Memory Management",
            url: "/java/java-memory-management",
            icon: "💾",
          },
          {
            title: "Reflection & Annotations",
            url: "/java/java-reflection-annotations",
            icon: "🔍",
          },
          {
            title: "Performance Tuning",
            url: "/java/java-performance-tuning",
            icon: "⚡",
          },
        ],
      },
      {
        title: "Enterprise Development",
        url: "/java/enterprise",
        icon: "🏢",
        items: [
          {
            title: "Design Patterns",
            url: "/java/java-design-patterns",
            icon: "🏛️",
          },
          {
            title: "Database & JDBC",
            url: "/java/java-jdbc-database",
            icon: "🗄️",
          },
          {
            title: "I/O & NIO",
            url: "/java/java-io-nio",
            icon: "📁",
          },
          {
            title: "Beans",
            url: "/java/java-beans",
            icon: "🫘",
          },
        ],
      },
      {
        title: "Development Tools",
        url: "/java/tools",
        icon: "🔧",
        items: [
          {
            title: "Testing Frameworks",
            url: "/java/java-testing-frameworks",
            icon: "🧪",
          },
          {
            title: "Unit Testing",
            url: "/java/java-unit-testing",
            icon: "🧪",
          },
          {
            title: "Build Tools",
            url: "/java/java-build-tools",
            icon: "🔨",
          },
        ],
      },
      {
        title: "Quick Reference",
        url: "/java/reference",
        icon: "📚",
        items: [
          {
            title: "Cheat Sheets",
            url: "/java/java-cheat-sheets",
            icon: "📝",
          },
          {
            title: "Date API",
            url: "/java/java-date-api",
            icon: "📅",
          },
        ],
      },
      {
        title: "How to",
        url: "/java/java-how-to",
        icon: "⁉️",
        items: [
          {
            title: "Create a good HashCode",
            url: "/java/how-to/java-create-a-good-hash-code",
            icon: "⁉️",
          },
          {
            title: "Create a library",
            url: "/java/how-to/java-creating-libs",
            icon: "⁉️",
          },
        ],
      },
      {
        title: "Interview questions",
        url: "/java/java-interview-questions",
        icon: "❓",
        items: [
          {
            title: "Collections",
            url: "/java/interview-questions/java-collections-interview-questions",
            icon: "❓",
          },
          {
            title: "Memory Management",
            url: "/java/interview-questions/java-memory-management-interview-questions",
            icon: "❓",
          },
          {
            title: "Concurrency",
            url: "/java/interview-questions/java-concurrency-interview-questions",
            icon: "❓",
          },
          {
            title: "Type System",
            url: "/java/interview-questions/java-type-system-interview-questions",
            icon: "❓",
          },
          {
            title: "Class structure and initialization",
            url: "/java/interview-questions/java-class-structure-and-initialization-interview-questions",
            icon: "❓",
          },
          {
            title: "Java 8",
            url: "/java/interview-questions/java-8-interview-questions",
            icon: "❓",
          },
          {
            title: "Generics",
            url: "/java/interview-questions/java-generics-interview-questions",
            icon: "❓",
          },
          {
            title: "Flow control",
            url: "/java/interview-questions/java-flow-control-interview-questions",
            icon: "❓",
          },
          {
            title: "Exceptions",
            url: "/java/interview-questions/java-exceptions-interview-questions",
            icon: "❓",
          },
          {
            title: "Annotations",
            url: "/java/interview-questions/java-annotations-interview-questions",
            icon: "❓",
          },
          {
            title: "Streams",
            url: "/java/interview-questions/java-streams-interview-questions",
            icon: "❓",
          },
          {
            title: "Tests",
            url: "/java/interview-questions/java-tests-interview-questions",
            icon: "❓",
          },
          {
            title: "Multidisciplinary questions",
            url: "/java/interview-questions/java-multidisciplinary-interview-questions",
            icon: "❓",
          },
        ],
      },
    ],
  },
  {
    title: "Kotlin",
    url: "/kotlin",
    icon: "🦙",
    items: [
      {
        title: "Introduction",
        url: "/kotlin/introduction",
        icon: "💡",
      },
      {
        title: "Syntax Basics",
        url: "/kotlin/syntax-basics",
        icon: "📝",
      },
      {
        title: "Object-Oriented Programming",
        url: "/kotlin/oop",
        icon: "🏗️",
      },
      {
        title: "Functional Programming",
        url: "/kotlin/functional-programming",
        icon: "🔄",
      },
      {
        title: "Collections & Data Structures",
        url: "/kotlin/collections",
        icon: "💾",
      },
      {
        title: "Null Safety & Error Handling",
        url: "/kotlin/null-safety",
        icon: "🛡️",
      },
      {
        title: "Concurrency & Multithreading",
        url: "/kotlin/concurrency",
        icon: "⚡",
      },
      {
        title: "Coroutines",
        url: "/kotlin/coroutines",
        icon: "🔄",
      },
      {
        title: "Advanced Features",
        url: "/kotlin/advanced-features",
        icon: "🚀",
      },
      {
        title: "Interview Questions",
        url: "/kotlin/interview-questions",
        icon: "❓",
      },
    ],
  },
  {
    title: "Scala",
    url: "/scala",
    icon: "🦙",
    items: [
      {
        title: "Introduction",
        url: "/scala/introduction",
        icon: "💡",
      },
      {
        title: "Interview Questions",
        url: "/scala/interview-questions",
        icon: "❓",
      },
    ],
  },
  {
    title: "Kafka",
    url: "/kafka",
    icon: "📥",
    items: [
      {
        title: "Introduction",
        url: "/kafka/introduction",
        icon: "💡",
      },
      {
        title: "Kafka Streams",
        url: "/kafka/streams",
        icon: "📥",
      },
      {
        title: "Interview Questions",
        url: "/kafka/interview-questions",
        icon: "❓",
      },
    ],
  },
  {
    title: "Spring",
    url: "/java/spring",
    icon: "🍃",
    items: [
      {
        title: "Introduction",
        url: "/java/spring/introduction",
        icon: "💡",
      },
      {
        title: "APIs",
        url: "/java/spring/spring-apis",
        icon: "🍃",
      },
      {
        title: "Security",
        url: "/java/spring/spring-security",
        icon: "🔒",
      },
      {
        title: "Data",
        url: "/java/spring/spring-data",
        icon: "💾",
      },
      {
        title: "JPA",
        url: "/java/spring/spring-jpa",
        icon: "💾",
      },
      {
        title: "Caching",
        url: "/java/spring/spring-caching",
        icon: "💾",
      },
      {
        title: "Boot Configuration",
        url: "/java/spring/spring-boot-configuration",
        icon: "⚙️",
      },
      {
        title: "WebFlux",
        url: "/java/spring/spring-webflux",
        icon: "🌊",
      },
      {
        title: "Cloud",
        url: "/java/spring/spring-cloud",
        icon: "☁️",
      },
      {
        title: "AOP",
        url: "/java/spring/spring-aop",
        icon: "🎯",
      },
      {
        title: "Actuator",
        url: "/java/spring/spring-actuator",
        icon: "📊",
      },
      {
        title: "Validation",
        url: "/java/spring/spring-validation",
        icon: "✅",
      },
      {
        title: "Testing",
        url: "/java/spring/spring-testing",
        icon: "🧪",
      },
      {
        title: "Transactions",
        url: "/java/spring/spring-transactions",
        icon: "💳",
      },
      {
        title: "Batch",
        url: "/java/spring/spring-batch",
        icon: "⚡",
      },
      {
        title: "Integration",
        url: "/java/spring/spring-integration",
        icon: "🔗",
      },
      {
        title: "Interview Questions",
        url: "/java/spring/spring-interview-questions",
        icon: "❓",
        items: [
          {
            title: "Spring Core",
            url: "/java/spring/interview-questions/spring-core-interview-questions",
            icon: "❓",
          },
          {
            title: "Spring Boot",
            url: "/java/spring/interview-questions/spring-boot-interview-questions",
            icon: "❓",
          },
          {
            title: "Spring Security",
            url: "/java/spring/interview-questions/spring-security-interview-questions",
            icon: "❓",
          },
          {
            title: "Spring Testing",
            url: "/java/spring/interview-questions/spring-testing-interview-questions",
            icon: "❓",
          },
          {
            title: "Spring Cloud & Microservices",
            url: "/java/spring/interview-questions/spring-cloud-microservices-interview-questions",
            icon: "❓",
          },
          {
            title: "Spring Data Access",
            url: "/java/spring/interview-questions/spring-data-access-interview-questions",
            icon: "❓",
          },
          {
            title: "Spring Web MVC",
            url: "/java/spring/interview-questions/spring-web-mvc-interview-questions",
            icon: "❓",
          },
          {
            title: "Spring Aspect Oriented Programming",
            url: "/java/spring/interview-questions/spring-aspect-oriented-interview-questions",
            icon: "❓",
          },
        ],
      },
    ],
  },
  {
    title: "APIs",
    url: "/apis",
    icon: "🧩",
    items: [
      {
        title: "Introduction",
        url: "/apis/introduction",
        icon: "💡",
      },
      {
        title: "Interview Questions",
        url: "/apis/interview-questions",
        icon: "❓",
      },
    ],
  },
  {
    title: "Design Patterns",
    url: "/design-patterns",
    icon: "🌍",
    items: [
      {
        title: "Introduction",
        url: "/design-patterns/introduction",
        icon: "💡",
      },
    ],
  },
  {
    title: "System Design",
    url: "/system-design",
    icon: "🗺️",
    items: [
      {
        title: "Fundamentals",
        url: "/system-design/fundamentals",
        icon: "🏗️",
        items: [
          {
            title: "Introduction",
            url: "/system-design/introduction",
            icon: "💡",
          },
          {
            title: "System Design Fundamentals",
            url: "/system-design/fundamentals",
            icon: "🏛️",
          },
          {
            title: "Design Patterns",
            url: "/system-design/design-patterns",
            icon: "🧩",
          },
        ],
      },
      {
        title: "Architecture Patterns",
        url: "/system-design/architecture",
        icon: "🏛️",
        items: [
          {
            title: "Microservices",
            url: "/system-design/microservices",
            icon: "🔬",
          },
          {
            title: "Distributed Systems",
            url: "/system-design/distributed-systems",
            icon: "🌐",
          },
          {
            title: "Event-Driven Architecture",
            url: "/system-design/event-driven-architecture",
            icon: "⚡",
          },
          {
            title: "Actor-Driven Architecture",
            url: "/system-design/actor-driven-architecture",
            icon: "🎭",
          },
          {
            title: "CQRS Architecture",
            url: "/system-design/cqrs-architecture",
            icon: "🔄",
          },
          {
            title: "Hexagonal Architecture",
            url: "/system-design/hexagonal-architecture",
            icon: "⬡",
          },
          {
            title: "Serverless Architecture",
            url: "/system-design/serverless-architecture",
            icon: "☁️",
          },
          {
            title: "Containerization & Orchestration",
            url: "/system-design/containerization-orchestration",
            icon: "📦",
          },
        ],
      },
      {
        title: "Data & Storage",
        url: "/system-design/data",
        icon: "💾",
        items: [
          {
            title: "Databases",
            url: "/system-design/databases",
            icon: "🗄️",
          },
          {
            title: "Storage",
            url: "/system-design/storage",
            icon: "💿",
          },
          {
            title: "Distributed File System",
            url: "/system-design/distributed-file-system",
            icon: "📁",
          },
          {
            title: "Data Consistency",
            url: "/system-design/data-consistency",
            icon: "🔄",
          },
        ],
      },
      {
        title: "Performance & Scalability",
        url: "/system-design/performance",
        icon: "⚡",
        items: [
          {
            title: "Caching",
            url: "/system-design/caching",
            icon: "⚡",
          },
          {
            title: "Advanced Caching",
            url: "/system-design/advanced-caching",
            icon: "🚀",
          },
          {
            title: "Load Balancer",
            url: "/system-design/load-balancer",
            icon: "⚖️",
          },
          {
            title: "Scaling",
            url: "/system-design/scaling",
            icon: "📈",
          },
          {
            title: "CDN",
            url: "/system-design/cdn",
            icon: "🌍",
          },
          {
            title: "Performance Optimization",
            url: "/system-design/performance-optimization",
            icon: "🏃",
          },
        ],
      },
      {
        title: "Communication & Integration",
        url: "/system-design/communication",
        icon: "📡",
        items: [
          {
            title: "API Design",
            url: "/system-design/api-design",
            icon: "🔌",
          },
          {
            title: "Message Queues",
            url: "/system-design/message-queues",
            icon: "📥",
          },
          {
            title: "Processing Queues",
            url: "/system-design/processing-queues",
            icon: "⚙️",
          },
          {
            title: "HTTP",
            url: "/system-design/communication/http",
            icon: "🌐",
          },
          {
            title: "Web Sockets",
            url: "/system-design/communication/web-sockets",
            icon: "🔗",
          },
        ],
      },
      {
        title: "Reliability & Security",
        url: "/system-design/reliability",
        icon: "🛡️",
        items: [
          {
            title: "Reliability Patterns",
            url: "/system-design/reliability-patterns",
            icon: "🔒",
          },
          {
            title: "Security",
            url: "/system-design/security",
            icon: "🔐",
          },
        ],
      },
      {
        title: "Cloud Architecture",
        url: "/system-design/cloud-architecture",
        icon: "☁️",
        items: [
          {
            title: "Cloud Fundamentals",
            url: "/system-design/cloud-architecture/cloud-fundamentals",
            icon: "🌤️",
          },
          {
            title: "AWS Patterns",
            url: "/system-design/cloud-architecture/aws-patterns",
            icon: "🟠",
          },
        ],
      },
      {
        title: "Monitoring & Operations",
        url: "/system-design/monitoring",
        icon: "📊",
        items: [
          {
            title: "Observability & Monitoring",
            url: "/system-design/observability-monitoring",
            icon: "📈",
          },
          {
            title: "Advanced Monitoring",
            url: "/system-design/monitoring/advanced-monitoring",
            icon: "🔍",
          },
          {
            title: "SRE Principles",
            url: "/system-design/monitoring/sre-principles",
            icon: "⚙️",
          },
        ],
      },
      {
        title: "Deployment & DevOps",
        url: "/system-design/deployment",
        icon: "🚀",
        items: [
          {
            title: "CI/CD Strategies",
            url: "/system-design/deployment/ci-cd-strategies",
            icon: "🔄",
          },
          {
            title: "DevOps Culture",
            url: "/system-design/deployment/devops-culture",
            icon: "🤝",
          },
        ],
      },
      {
        title: "Advanced Topics",
        url: "/system-design/advanced-topics",
        icon: "🎓",
        items: [
          {
            title: "Distributed Consensus",
            url: "/system-design/advanced-topics/distributed-consensus",
            icon: "🤝",
          },
          {
            title: "Capacity Planning",
            url: "/system-design/advanced-topics/capacity-planning",
            icon: "📊",
          },
          {
            title: "Disaster Recovery",
            url: "/system-design/advanced-topics/disaster-recovery",
            icon: "🛡️",
          },
          {
            title: "System Design Trade-offs",
            url: "/system-design/advanced-topics/trade-offs",
            icon: "⚖️",
          },
        ],
      },
      {
        title: "Real-World Systems",
        url: "/system-design/real-world-systems",
        icon: "🏢",
        items: [
          {
            title: "Large-Scale Examples",
            url: "/system-design/real-world-systems/large-scale-examples",
            icon: "🏗️",
          },
        ],
      },
      {
        title: "Interview Preparation",
        url: "/system-design/interview",
        icon: "💼",
        items: [
          {
            title: "Interview Cheatsheet",
            url: "/system-design/interview-cheatsheet",
            icon: "📋",
          },
          {
            title: "Interview Tips",
            url: "/system-design/interview-tips",
            icon: "💡",
          },
          {
            title: "Interview Questions",
            url: "/system-design/interview-questions",
            icon: "❓",
          },
        ],
      },
    ],
  },
  {
    title: "Databases",
    url: "/databases",
    icon: "💾",
    items: [
      // {
      //   title: "Interactive Visualizers",
      //   url: "/databases/visualizers",
      //   icon: "🎮",
      // },
      {
        title: "Introduction",
        url: "/databases/databases",
        icon: "💡",
      },
      {
        title: "SQL",
        url: "/databases/sql",
        icon: "💾",
        items: [
          {
            title: "Introduction",
            url: "/databases/sql/introduction",
            icon: "💡",
          },
          {
            title: "MySQL",
            url: "/databases/sql/mysql",
            icon: "💾",
          },
          {
            title: "PostgreSQL",
            url: "/databases/sql/postgresql",
            icon: "💾",
          },
          {
            title: "Oracle/PLSQL",
            url: "/databases/sql/oracle",
            icon: "⭕",
          },
          {
            title: "Interview Questions",
            url: "/databases/sql/interview-questions",
            icon: "❓",
          },
        ],
      },
      {
        title: "NoSQL",
        url: "/databases/no-sql",
        icon: "💾",
        items: [
          {
            title: "Introduction",
            url: "/databases/sql/introduction",
            icon: "💡",
          },
          {
            title: "MongoDB",
            url: "/databases/no-sql/mongodb",
            icon: "🍃",
          },
          {
            title: "Interview Questions",
            url: "/databases/no-sql/interview-questions",
            icon: "❓",
          },
        ],
      },
    ],
  },
  {
    title: "OOP",
    url: "/oop",
    icon: "🚙",
    items: [
      {
        title: "Introduction",
        url: "/oop/introduction",
        icon: "💡",
      },
      {
        title: "Interview Questions",
        url: "/oop/interview-questions",
        icon: "❓",
      },
    ],
  },
  {
    title: "Functional Programming",
    url: "/functional-programming",
    icon: "🔄",
    items: [
      {
        title: "Introduction",
        url: "/functional-programming/introduction",
        icon: "💡",
      },
      {
        title: "Interview Questions",
        url: "/functional-programming/interview-questions",
        icon: "❓",
      },
    ],
  },
  {
    title: "Cryptography",
    url: "/cryptography/cryptography",
    icon: "🔐",
    items: [
      {
        title: "Introduction",
        url: "/cryptography/introduction",
        icon: "💡",
      },
    ],
  },
  {
    title: "IT Books Summarized",
    url: "/it-books",
    icon: "📚",
    items: [
      {
        title: "Clean code",
        url: "/it-books/clean-code",
        icon: "🧹",
      },
      {
        title: "Clean Architecture",
        url: "/it-books/clean-architecture",
        icon: "🧹",
      },
    ],
  },
  {
    title: "Misc",
    url: "/misc",
    icon: "🗺️",
    items: [
      {
        title: "TDD",
        url: "/misc/tdd",
        icon: "🗺️",
      },
      {
        title: "DDD",
        url: "/misc/ddd",
        icon: "🗺️",
      },
      {
        title: "MVC",
        url: "/misc/mvc",
        icon: "🗺️",
      },
      {
        title: "Three tier architecture",
        url: "/misc/three-tier-architecture",
        icon: "🗺️",
      },
      {
        title: "Unit tests",
        url: "/misc/unit-tests",
        icon: "🗺️",
      },
    ],
  },
  {
    title: "JavaScript",
    url: "/javascript",
    icon: "🧩",
    items: [
      // {
      //   title: "Interactive Visualizers",
      //   url: "/javascript/visualizers",
      //   icon: "🎮",
      // },
      {
        title: "Complete Reference Guide",
        url: "/javascript/introduction",
        icon: "💡",
      },
      {
        title: "Core Language",
        url: "/javascript/core",
        icon: "🔧",
        items: [
          {
            title: "Fundamentals",
            url: "/javascript/fundamentals",
            icon: "🔤",
          },
          {
            title: "Functions and Scope",
            url: "/javascript/functions-and-scope",
            icon: "🔧",
          },
          {
            title: "Objects and Prototypes",
            url: "/javascript/objects-and-prototypes",
            icon: "🎯",
          },
          {
            title: "ES6+ Modern Features",
            url: "/javascript/es6-modern-features",
            icon: "⚡",
          },
        ],
      },
      {
        title: "Asynchronous Programming",
        url: "/javascript/async",
        icon: "🔄",
        items: [
          {
            title: "Asynchronous JavaScript",
            url: "/javascript/asynchronous-javascript",
            icon: "⚡",
          },
        ],
      },
      {
        title: "Browser & DOM",
        url: "/javascript/browser",
        icon: "🌐",
        items: [
          {
            title: "DOM and Browser APIs",
            url: "/javascript/dom-and-browser-apis",
            icon: "🌐",
          },
        ],
      },
      {
        title: "Development Practices",
        url: "/javascript/development",
        icon: "🛠️",
        items: [
          {
            title: "Error Handling and Debugging",
            url: "/javascript/error-handling-debugging",
            icon: "🐛",
          },
          {
            title: "Testing Patterns",
            url: "/javascript/testing-patterns",
            icon: "🧪",
          },
          {
            title: "Memory and Performance",
            url: "/javascript/memory-performance",
            icon: "⚡",
          },
        ],
      },
      {
        title: "Architecture & Patterns",
        url: "/javascript/patterns",
        icon: "🏗️",
        items: [
          {
            title: "Design Patterns",
            url: "/javascript/design-patterns",
            icon: "🎨",
          },
        ],
      },
      {
        title: "Interview Preparation",
        url: "/javascript/interview",
        icon: "💼",
        items: [
          {
            title: "Interview Questions",
            url: "/javascript/interview-questions",
            icon: "❓",
          },
          {
            title: "Comprehensive Interview Questions",
            url: "/javascript/comprehensive-interview-questions",
            icon: "📋",
          },
        ],
      },
      {
        title: "Quick Reference",
        url: "/javascript/cheat-sheet",
        icon: "📄",
      },
    ],
  },
  {
    title: "Typescript",
    url: "/typescript",
    icon: "🧩",
    items: [
      {
        title: "Introduction",
        url: "/typescript/introduction",
        icon: "💡",
      },
      {
        title: "Interview Questions",
        url: "/typescript/interview-questions",
        icon: "❓",
      },
    ],
  },
  {
    title: "React",
    url: "/react",
    icon: "⚛️",
    items: [
      // {
      //   title: "Interactive Visualizers",
      //   url: "/react/visualizers",
      //   icon: "🎮",
      // },
      {
        title: "Introduction",
        url: "/react/introduction",
        icon: "💡",
      },
      {
        title: "Fundamentals",
        url: "/react/fundamentals",
        icon: "🔧",
        items: [
          {
            title: "JSX",
            url: "/react/fundamentals/jsx",
            icon: "📄",
          },
          {
            title: "Components",
            url: "/react/fundamentals/components",
            icon: "🧩",
          },
          {
            title: "Props",
            url: "/react/fundamentals/props",
            icon: "📦",
          },
          {
            title: "State",
            url: "/react/fundamentals/state",
            icon: "🔄",
          },
          {
            title: "Event Handling",
            url: "/react/fundamentals/event-handling",
            icon: "👆",
          },
          {
            title: "Conditional Rendering",
            url: "/react/fundamentals/conditional-rendering",
            icon: "🔀",
          },
          {
            title: "Lists and Keys",
            url: "/react/fundamentals/lists-and-keys",
            icon: "📋",
          },
        ],
      },
      {
        title: "Hooks",
        url: "/react/hooks",
        icon: "🪝",
        items: [
          {
            title: "useState",
            url: "/react/hooks/usestate",
            icon: "🔄",
          },
          {
            title: "useEffect",
            url: "/react/hooks/useeffect",
            icon: "⚡",
          },
          {
            title: "useContext",
            url: "/react/hooks/usecontext",
            icon: "🌐",
          },
          {
            title: "useReducer",
            url: "/react/hooks/usereducer",
            icon: "⚙️",
          },
          {
            title: "useRef",
            url: "/react/hooks/useref",
            icon: "📍",
          },
          {
            title: "useMemo",
            url: "/react/hooks/usememo",
            icon: "💾",
          },
          {
            title: "useCallback",
            url: "/react/hooks/usecallback",
            icon: "🔗",
          },
          {
            title: "Custom Hooks",
            url: "/react/hooks/custom-hooks",
            icon: "🛠️",
          },
          {
            title: "useId",
            url: "/react/hooks/useid",
            icon: "🆔",
          },
          {
            title: "useTransition",
            url: "/react/hooks/usetransition",
            icon: "🔄",
          },
          {
            title: "useDeferredValue",
            url: "/react/hooks/usedeferredvalue",
            icon: "⏳",
          },
          {
            title: "Advanced Hooks",
            url: "/react/hooks/advanced-hooks",
            icon: "🚀",
          },
        ],
      },
      {
        title: "Advanced Concepts",
        url: "/react/advanced",
        icon: "🚀",
        items: [
          {
            title: "Context API",
            url: "/react/advanced/context-api",
            icon: "🌐",
          },
          {
            title: "Error Boundaries",
            url: "/react/advanced/error-boundaries",
            icon: "🛡️",
          },
          {
            title: "Portals",
            url: "/react/advanced/portals",
            icon: "🌀",
          },
          {
            title: "Refs and DOM",
            url: "/react/advanced/refs-and-dom",
            icon: "📍",
          },
          {
            title: "Higher-Order Components",
            url: "/react/advanced/higher-order-components",
            icon: "🏗️",
          },
          {
            title: "Render Props",
            url: "/react/advanced/render-props",
            icon: "🎭",
          },
          {
            title: "Forwarding Refs",
            url: "/react/advanced/forwarding-refs",
            icon: "↗️",
          },
          {
            title: "Lazy Loading",
            url: "/react/advanced/lazy-loading",
            icon: "💤",
          },
          {
            title: "Suspense",
            url: "/react/advanced/suspense",
            icon: "⏳",
          },
          {
            title: "Concurrent Features",
            url: "/react/advanced/concurrent-features",
            icon: "⚡",
          },
        ],
      },
      {
        title: "Performance Optimization",
        url: "/react/performance",
        icon: "⚡",
        items: [
          {
            title: "React.memo",
            url: "/react/performance/react-memo",
            icon: "💾",
          },
          {
            title: "Memoization Techniques",
            url: "/react/performance/memoization",
            icon: "🧠",
          },
          {
            title: "Virtual DOM Optimization",
            url: "/react/performance/virtual-dom",
            icon: "🖥️",
          },
          {
            title: "Bundle Splitting",
            url: "/react/performance/bundle-splitting",
            icon: "📦",
          },
          {
            title: "Automatic Batching",
            url: "/react/performance/automatic-batching",
            icon: "📦",
          },
          {
            title: "Concurrent Rendering",
            url: "/react/performance/concurrent-rendering",
            icon: "⚡",
          },
          {
            title: "Profiling and Debugging",
            url: "/react/performance/profiling",
            icon: "🔍",
          },
          {
            title: "Performance Best Practices",
            url: "/react/performance/best-practices",
            icon: "✨",
          },
        ],
      },
      {
        title: "State Management",
        url: "/react/state-management",
        icon: "🗄️",
        items: [
          {
            title: "Local State Patterns",
            url: "/react/state-management/local-state",
            icon: "📍",
          },
          {
            title: "Redux",
            url: "/react/state-management/redux",
            icon: "🔴",
          },
          {
            title: "Redux Toolkit",
            url: "/react/state-management/redux-toolkit",
            icon: "🛠️",
          },
          {
            title: "Zustand",
            url: "/react/state-management/zustand",
            icon: "🐻",
          },
          {
            title: "Recoil",
            url: "/react/state-management/recoil",
            icon: "⚛️",
          },
          {
            title: "Context vs Redux",
            url: "/react/state-management/context-vs-redux",
            icon: "⚖️",
          },
        ],
      },
      {
        title: "Routing",
        url: "/react/routing",
        icon: "🗺️",
        items: [
          {
            title: "React Router Basics",
            url: "/react/routing/basics",
            icon: "🚗",
          },
          {
            title: "Navigation and Links",
            url: "/react/routing/navigation",
            icon: "🧭",
          },
          {
            title: "Nested Routes",
            url: "/react/routing/nested-routes",
            icon: "🪜",
          },
          {
            title: "Route Guards",
            url: "/react/routing/route-guards",
            icon: "🛡️",
          },
          {
            title: "Dynamic Routing",
            url: "/react/routing/dynamic-routing",
            icon: "⚡",
          },
          {
            title: "Query Parameters",
            url: "/react/routing/query-parameters",
            icon: "❓",
          },
        ],
      },
      {
        title: "Forms and Validation",
        url: "/react/forms",
        icon: "📝",
        items: [
          {
            title: "Controlled Components",
            url: "/react/forms/controlled-components",
            icon: "🎛️",
          },
          {
            title: "Uncontrolled Components",
            url: "/react/forms/uncontrolled-components",
            icon: "🔓",
          },
          {
            title: "React Hook Form",
            url: "/react/forms/react-hook-form",
            icon: "🪝",
          },
          {
            title: "Formik",
            url: "/react/forms/formik",
            icon: "📋",
          },
          {
            title: "Validation Patterns",
            url: "/react/forms/validation",
            icon: "✅",
          },
          {
            title: "File Uploads",
            url: "/react/forms/file-uploads",
            icon: "📁",
          },
        ],
      },
      {
        title: "Testing",
        url: "/react/testing",
        icon: "🧪",
        items: [
          {
            title: "Jest Fundamentals",
            url: "/react/testing/jest",
            icon: "🃏",
          },
          {
            title: "React Testing Library",
            url: "/react/testing/react-testing-library",
            icon: "📚",
          },
          {
            title: "Component Testing",
            url: "/react/testing/component-testing",
            icon: "🧩",
          },
          {
            title: "Hooks Testing",
            url: "/react/testing/hooks-testing",
            icon: "🪝",
          },
          {
            title: "Mocking Strategies",
            url: "/react/testing/mocking",
            icon: "🎭",
          },
          {
            title: "E2E Testing",
            url: "/react/testing/e2e-testing",
            icon: "🔄",
          },
          {
            title: "Snapshot Testing",
            url: "/react/testing/snapshot-testing",
            icon: "📸",
          },
        ],
      },
      {
        title: "Styling",
        url: "/react/styling",
        icon: "🎨",
        items: [
          {
            title: "CSS Modules",
            url: "/react/styling/css-modules",
            icon: "📄",
          },
          {
            title: "Styled Components",
            url: "/react/styling/styled-components",
            icon: "💅",
          },
          {
            title: "Emotion",
            url: "/react/styling/emotion",
            icon: "😊",
          },
          {
            title: "Tailwind CSS",
            url: "/react/styling/tailwind",
            icon: "🌊",
          },
          {
            title: "CSS-in-JS",
            url: "/react/styling/css-in-js",
            icon: "🎭",
          },
          {
            title: "Theming",
            url: "/react/styling/theming",
            icon: "🎨",
          },
        ],
      },
      {
        title: "Data Fetching",
        url: "/react/data-fetching",
        icon: "📡",
        items: [
          {
            title: "Fetch API",
            url: "/react/data-fetching/fetch-api",
            icon: "🌐",
          },
          {
            title: "Axios",
            url: "/react/data-fetching/axios",
            icon: "📡",
          },
          {
            title: "React Query",
            url: "/react/data-fetching/react-query",
            icon: "🔍",
          },
          {
            title: "SWR",
            url: "/react/data-fetching/swr",
            icon: "🔄",
          },
          {
            title: "Apollo GraphQL",
            url: "/react/data-fetching/apollo-graphql",
            icon: "🚀",
          },
          {
            title: "Error Handling",
            url: "/react/data-fetching/error-handling",
            icon: "❌",
          },
          {
            title: "Loading States",
            url: "/react/data-fetching/loading-states",
            icon: "⏳",
          },
        ],
      },
      {
        title: "Patterns and Best Practices",
        url: "/react/patterns",
        icon: "🏗️",
        items: [
          {
            title: "Component Composition",
            url: "/react/patterns/composition",
            icon: "🧩",
          },
          {
            title: "Compound Components",
            url: "/react/patterns/compound-components",
            icon: "🔗",
          },
          {
            title: "Provider Pattern",
            url: "/react/patterns/provider-pattern",
            icon: "🏪",
          },
          {
            title: "Container Pattern",
            url: "/react/patterns/container-pattern",
            icon: "📦",
          },
          {
            title: "Prop Drilling Solutions",
            url: "/react/patterns/prop-drilling",
            icon: "🕳️",
          },
          {
            title: "Code Organization",
            url: "/react/patterns/code-organization",
            icon: "📁",
          },
          {
            title: "Design Patterns",
            url: "/react/patterns/design-patterns",
            icon: "🎨",
          },
        ],
      },
      {
        title: "Build Tools and Ecosystem",
        url: "/react/build-tools",
        icon: "🛠️",
        items: [
          {
            title: "Create React App",
            url: "/react/build-tools/create-react-app",
            icon: "⚛️",
          },
          {
            title: "Vite",
            url: "/react/build-tools/vite",
            icon: "⚡",
          },
          {
            title: "Webpack",
            url: "/react/build-tools/webpack",
            icon: "📦",
          },
          {
            title: "Babel",
            url: "/react/build-tools/babel",
            icon: "🗼",
          },
          {
            title: "TypeScript Setup",
            url: "/react/build-tools/typescript",
            icon: "📘",
          },
          {
            title: "ESLint and Prettier",
            url: "/react/build-tools/linting",
            icon: "✨",
          },
        ],
      },
      {
        title: "TypeScript with React",
        url: "/react/typescript",
        icon: "📘",
        items: [
          {
            title: "Basic Types",
            url: "/react/typescript/basic-types",
            icon: "🔤",
          },
          {
            title: "Component Props",
            url: "/react/typescript/component-props",
            icon: "🧩",
          },
          {
            title: "Event Handling",
            url: "/react/typescript/event-handling",
            icon: "👆",
          },
          {
            title: "Hooks with TypeScript",
            url: "/react/typescript/hooks",
            icon: "🪝",
          },
          {
            title: "Generic Components",
            url: "/react/typescript/generic-components",
            icon: "🔄",
          },
          {
            title: "Advanced Patterns",
            url: "/react/typescript/advanced-patterns",
            icon: "🚀",
          },
        ],
      },
      {
        title: "Server-Side Rendering",
        url: "/react/ssr",
        icon: "🖥️",
        items: [
          {
            title: "Next.js Basics",
            url: "/react/ssr/nextjs-basics",
            icon: "⚡",
          },
          {
            title: "Static Site Generation",
            url: "/react/ssr/static-generation",
            icon: "📄",
          },
          {
            title: "Server Components",
            url: "/react/ssr/server-components",
            icon: "🖥️",
          },
          {
            title: "Hydration",
            url: "/react/ssr/hydration",
            icon: "💧",
          },
          {
            title: "Performance Optimization",
            url: "/react/ssr/performance",
            icon: "⚡",
          },
        ],
      },
      {
        title: "Development Workflow",
        url: "/react/development-workflow",
        icon: "🔧",
        items: [
          {
            title: "Strict Mode",
            url: "/react/development-workflow/strict-mode",
            icon: "🛡️",
          },
        ],
      },
      {
        title: "Interview Questions",
        url: "/react/interview-questions",
        icon: "❓",
      },
      {
        title: "Cheat Sheet",
        url: "/react/cheat-sheet",
        icon: "📋",
      },
      {
        title: "Best Practices Guide",
        url: "/react/best-practices",
        icon: "✨",
      },
    ],
  },
  {
    title: "React Native",
    url: "/react-native",
    icon: "⚛️",
    items: [
      {
        title: "Introduction",
        url: "/react-native/introduction",
        icon: "💡",
      },
      {
        title: "Interview Questions",
        url: "/react-native/interview-questions",
        icon: "❓",
      },
    ],
  },
  {
    title: "Interviews",
    url: "/interviews",
    icon: "💼",
    items: [
      {
        title: "Technical questions tips",
        url: "/interviews/solving-algorithms-tips",
        icon: "💡",
      },
      {
        title: "Optimize & Solve Techniques",
        url: "/interviews/optimize-solve-techniques",
        icon: "💡",
      },
      {
        title: "Cheat Sheets",
        url: "/interviews/cheat-sheets",
        icon: "💡",
      },
    ],
  },
];
