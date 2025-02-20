import { SquareTerminal, Bot, BookOpen } from "lucide-react";
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
    title: "Algorithms",
    url: "/algorithms",
    icon: "🧠",
    items: [
      {
        title: "Introduction",
        url: "/algorithms/algorithms",
        icon: "💡",
      },
      {
        title: "Sort",
        url: "/algorithms/sort",
        icon: "📊",
        items: [
          {
            title: "Introduction",
            url: "/algorithms/sort/sort",
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
            title: "Selection Sort",
            url: "/algorithms/sort/selection-sort",
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
            title: "Insertion Sort",
            url: "/algorithms/sort/insertion-sort",
            icon: "📊",
          },
          {
            title: "Bucket Sort",
            url: "/algorithms/sort/bucket-sort",
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
        title: "Big O",
        url: "/algorithms/big-o",
        icon: "📝",
      },
      {
        title: "Tree traversal",
        url: "/algorithms/tree-traversal",
        icon: "🌲",
      },
      {
        title: "Kruskal’s Minimum Spanning Tree",
        url: "/algorithms/kruskal-minimum-spanning-tree",
        icon: "🌲",
      },
      {
        title: "Bit manipulation",
        url: "/algorithms/bit-manipulation",
        icon: "📝",
      },
      {
        title: "Dynamic programming",
        url: "/algorithms/dynamic-programming",
        icon: "📝",
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
      {
        title: "Leetcode exercises",
        url: "/algorithms/leetcode-exercises",
        icon: "📝",
      },
    ],
  },
  {
    title: "Data Structures",
    url: "/data-structures",
    icon: "💾",
    items: [
      {
        title: "Introduction",
        url: "/data-structures/data-structures",
        icon: "💡",
      },
      {
        title: "Array",
        url: "/data-structures/array",
        icon: "💾",
        items: [
          // TODO: Add introduction
          // {
          //   title: "Introduction",
          //   url: "/data-structures/array",
          //   icon: "💡",
          // },
          {
            title: "Longest Common Prefix Array",
            url: "/data-structures/array/longest-common-prefix-array",
            icon: "💾",
          },
          {
            title: "Suffix Arrays",
            url: "/data-structures/array/suffix-arrays",
            icon: "💾",
          },
        ],
      },
      // TODO: Add introduction
      // {
      //   title: "List",
      //   url: "/data-structures/list",
      //   icon: "💾",
      // },
      // {
      //   title: "Linked List",
      //   url: "/data-structures/linked-list",
      //   icon: "💾",
      // },
      // {
      //   title: "Set",
      //   url: "/data-structures/set",
      //   icon: "💾",
      // },
      // {
      //   title: "Stack",
      //   url: "/data-structures/stack",
      //   icon: "💾",
      // },
      {
        title: "Queue",
        url: "/data-structures/queue",
        icon: "💾",
        items: [
          // {
          //   title: "Introduction",
          //   url: "/data-structures/queue/queue",
          //   icon: "💡",
          // },
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
          // TODO: Add introduction
          // {
          //   title: "Introduction",
          //   url: "/data-structures/map/map",
          //   icon: "💡",
          // },
          {
            title: "HashMap",
            url: "/data-structures/map/hash-map",
            icon: "🗺️",
          },
          {
            title: "Hash collision resolution",
            url: "/data-structures/map/hash-collision-resolution",
            icon: "🗺️",
          },
        ],
      },
      {
        title: "Tree",
        url: "/data-structures/tree",
        icon: "🌲",
        items: [
          // TODO: Add introduction
          // {
          //   title: "Introduction",
          //   url: "/data-structures/tree/tree",
          //   icon: "💡",
          // },
          {
            title: "Binary Tree",
            url: "/data-structures/tree/binary-tree",
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
        ],
      },
      {
        title: "Union Find",
        url: "/data-structures/union-find",
        icon: "🔗",
      },
    ],
  },
  {
    title: "Java",
    url: "/java",
    icon: "☕",
    items: [
      // TODO: Add introduction
      // {
      //   title: "Introduction",
      //   url: "/java/java",
      //   icon: "💡",
      // },
      {
        title: "Collections",
        url: "/java/collections/java-collections",
        icon: "💾",
      },
      {
        title: "Cheat sheets",
        url: "/java/java-cheat-sheets",
        icon: "📝",
      },
      {
        title: "Date API",
        url: "/java/java-date-api",
        icon: "📅",
      },
      {
        title: "Memory Management",
        url: "/java/java-memory-management",
        icon: "💾",
      },
      {
        title: "Unit Testing",
        url: "/java/java-unit-testing",
        icon: "🧪",
      },
      {
        title: "Beans",
        url: "/java/java-beans",
        icon: "🫘",
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
        title: "Spring",
        url: "/java/spring",
        icon: "🍃",
        items: [
          // TODO: Add introduction
          // {
          //   title: "Introduction",
          //   url: "/java/spring/spring",
          //   icon: "💡",
          // },
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
                title: "Spring 5",
                url: "/java/spring/interview-questions/spring-5-interview-questions",
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
            title: "Kafka",
            url: "/java/interview-questions/java-kafka-interview-questions",
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
    title: "APIs",
    url: "/apis",
    icon: "🧩",
    items: [
      {
        title: "Introduction",
        url: "/apis/apis",
        icon: "💡",
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
        url: "/design-patterns/design-patterns",
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
        title: "Introduction",
        url: "/system-design/system-design",
        icon: "💡",
      },
      {
        title: "Microservices",
        url: "/system-design/microservices",
        icon: "🗺️",
      },
      {
        title: "Distributed Systems",
        url: "/system-design/distributed-systems",
        icon: "🌍",
      },
      {
        title: "Caching",
        url: "/system-design/caching",
        icon: "💾",
      },
      {
        title: "Load Balancer",
        url: "/system-design/load-balancer",
        icon: "⚖️",
      },
      {
        title: "Scaling",
        url: "/system-design/scaling",
        icon: "⬆️",
      },
      {
        title: "CDN",
        url: "/system-design/cdn",
        icon: "🌍",
      },
      {
        title: "Message Queues",
        url: "/system-design/message-queues",
        icon: "📥",
      },
      {
        title: "Processing Queues",
        url: "/system-design/processing-queues",
        icon: "📥",
      },
      {
        title: "Storage",
        url: "/system-design/storage",
        icon: "💾",
      },
      {
        title: "Distributed file system",
        url: "/system-design/distributed-file-system",
        icon: "🌍",
      },
      {
        title: "Communication",
        url: "/system-design/communication",
        icon: "☎️",
        items: [
          {
            title: "HTTP",
            url: "/system-design/communication/http",
            icon: "🌍",
          },
          {
            title: "Web Sockets",
            url: "/system-design/communication/web-sockets",
            icon: "🌍",
          },
        ],
      },
      {
        title: "Interview Questions",
        url: "/system-design/system-design-interview-questions",
        icon: "❓",
      },
    ],
  },
  {
    title: "Databases",
    url: "/databases",
    icon: "💾",
    items: [
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
            url: "/databases/sql/sql",
            icon: "💡",
          },
          {
            title: "Oracle",
            url: "/databases/sql/oracle",
            icon: "⭕",
          },
        ],
      },
    ],
  },
  {
    title: "OOP",
    url: "/oop",
    icon: "🚙",
  },
  // {
  //   title: "Blockchain",
  //   url: "blockchain",
  //   icon: "🔗",
  //   items: [
  //     {
  //       title: "Introduction",
  //       url: "blockchain",
  //       icon: "💡",
  //     },
  //     {
  //       title: "Bitcoin",
  //       url: "bitcoin",
  //       icon: "🪙",
  //     },
  //     {
  //       title: "Ethereum",
  //       url: "ethereum",
  //       icon: "🪙",
  //     },
  //   ],
  // },
  {
    title: "Cryptography",
    url: "/cryptography/cryptography",
    icon: "🔐",
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
];
