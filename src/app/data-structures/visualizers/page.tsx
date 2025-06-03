"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { AlgorithmVisualizer } from "@/src/components/visuals/algorithm-visualizer";
import { DataStructureVisualizer } from "@/src/components/visuals/data-structure-visualizer";
import ProgrammingConceptsVisualizer from "@/src/components/visuals/programming-concepts-visualizer";
import {
  BinarySearchTreeVisualizer,
  TreeTraversalDemo,
} from "@/src/components/visuals/interactive-tree";
import { Database, List, TreePine, Network, Hash, Layers } from "lucide-react";

function renderVisualizer(visualizer: any) {
  switch (visualizer.type) {
    case "algorithm-visualizer":
      return (
        <AlgorithmVisualizer
          title={visualizer.title}
          description={visualizer.description}
          algorithm={(arr: number[]) => []} // Default empty algorithm
        />
      );
    case "data-structure-visualizer":
      return (
        <DataStructureVisualizer
          title={visualizer.title}
          description={visualizer.description}
          structure={visualizer.config?.structure || "stack"}
          initialData={visualizer.config?.initialData}
        />
      );
    case "programming-concepts-visualizer":
      return <ProgrammingConceptsVisualizer />;
    case "interactive-tree":
      if (visualizer.config?.component === "binary-search-tree") {
        return <BinarySearchTreeVisualizer />;
      } else if (visualizer.config?.component === "tree-traversal") {
        return <TreeTraversalDemo />;
      }
      return <BinarySearchTreeVisualizer />;
    default:
      return <div>Visualizer type not supported: {visualizer.type}</div>;
  }
}

export default function DataStructuresVisualizersPage() {
  const visualizerCategories = [
    {
      id: "linear",
      title: "Linear Structures",
      icon: <List className="h-5 w-5" />,
      description:
        "Arrays, lists, stacks, and queues with interactive operations",
      visualizers: [
        {
          title: "Array Operations Visualizer",
          description:
            "Insert, delete, search operations with complexity analysis",
          type: "data-structure-visualizer",
          config: {
            structure: "array",
            showComplexity: true,
            operations: ["insert", "delete", "search", "sort"],
          },
          tags: ["Array", "Operations", "Big O"],
        },
        {
          title: "Dynamic Array Growth",
          description: "Watch how dynamic arrays resize and reallocate memory",
          type: "data-structure-visualizer",
          config: {
            structure: "dynamic-array",
            showMemory: true,
          },
          tags: ["Dynamic Array", "Memory", "Reallocation"],
        },
        {
          title: "Linked List Implementation",
          description:
            "Singly and doubly linked lists with pointer manipulation",
          type: "data-structure-visualizer",
          config: {
            structure: "linked-list",
            types: ["singly", "doubly", "circular"],
          },
          tags: ["Linked List", "Pointers", "Traversal"],
        },
        {
          title: "Stack LIFO Operations",
          description:
            "Push, pop, and peek operations with real-world applications",
          type: "data-structure-visualizer",
          config: {
            structure: "stack",
            applications: ["function-calls", "expression-eval", "undo-redo"],
          },
          tags: ["Stack", "LIFO", "Function Calls"],
        },
        {
          title: "Queue FIFO Operations",
          description:
            "Enqueue, dequeue with circular and priority queue variants",
          type: "data-structure-visualizer",
          config: {
            structure: "queue",
            variants: ["simple", "circular", "priority", "deque"],
          },
          tags: ["Queue", "FIFO", "Priority Queue"],
        },
      ],
    },
    {
      id: "trees",
      title: "Tree Structures",
      icon: <TreePine className="h-5 w-5" />,
      description: "Binary trees, heaps, tries, and advanced tree structures",
      visualizers: [
        {
          title: "Binary Tree Traversal",
          description:
            "In-order, pre-order, and post-order traversal animations",
          type: "data-structure-visualizer",
          config: {
            structure: "binary-tree",
            traversals: ["inorder", "preorder", "postorder", "level-order"],
          },
          tags: ["Binary Tree", "Traversal", "DFS", "BFS"],
        },
        {
          title: "Binary Search Tree Operations",
          description:
            "Insert, delete, search with tree balancing visualization",
          type: "data-structure-visualizer",
          config: {
            structure: "bst",
            operations: ["insert", "delete", "search", "min", "max"],
          },
          tags: ["BST", "Search", "Insert", "Delete"],
        },
        {
          title: "AVL Tree Self-Balancing",
          description:
            "Watch AVL rotations maintain tree balance automatically",
          type: "data-structure-visualizer",
          config: {
            structure: "avl-tree",
            showRotations: true,
            showHeights: true,
          },
          tags: ["AVL Tree", "Balancing", "Rotations"],
        },
        {
          title: "Red-Black Tree Properties",
          description: "Explore red-black tree invariants and recoloring",
          type: "data-structure-visualizer",
          config: {
            structure: "red-black-tree",
            showProperties: true,
          },
          tags: ["Red-Black Tree", "Properties", "Recoloring"],
        },
        {
          title: "Heap Operations",
          description:
            "Min/max heap with heapify, insert, and extract operations",
          type: "data-structure-visualizer",
          config: {
            structure: "heap",
            types: ["min-heap", "max-heap"],
            operations: ["insert", "extract", "heapify"],
          },
          tags: ["Heap", "Priority Queue", "Heapify"],
        },
        {
          title: "Trie (Prefix Tree)",
          description: "Build and search tries for string operations",
          type: "data-structure-visualizer",
          config: {
            structure: "trie",
            operations: ["insert", "search", "prefix-search", "delete"],
          },
          tags: ["Trie", "Prefix Tree", "String Search"],
        },
      ],
    },
    {
      id: "graphs",
      title: "Graph Structures",
      icon: <Network className="h-5 w-5" />,
      description: "Graph representations, traversals, and algorithms",
      visualizers: [
        {
          title: "Graph Representations",
          description:
            "Compare adjacency matrix vs adjacency list representations",
          type: "data-structure-visualizer",
          config: {
            structure: "graph",
            representations: [
              "adjacency-matrix",
              "adjacency-list",
              "edge-list",
            ],
          },
          tags: ["Graph", "Adjacency Matrix", "Adjacency List"],
        },
        {
          title: "Graph Traversal Algorithms",
          description: "BFS and DFS with step-by-step visualization",
          type: "algorithm-visualizer",
          config: {
            algorithm: "graph-traversal",
            types: ["bfs", "dfs"],
          },
          tags: ["BFS", "DFS", "Traversal", "Queue", "Stack"],
        },
        {
          title: "Shortest Path Algorithms",
          description: "Dijkstra's and Bellman-Ford algorithms in action",
          type: "algorithm-visualizer",
          config: {
            algorithm: "shortest-path",
            types: ["dijkstra", "bellman-ford", "floyd-warshall"],
          },
          tags: ["Dijkstra", "Shortest Path", "Weighted Graph"],
        },
        {
          title: "Minimum Spanning Tree",
          description: "Kruskal's and Prim's algorithms for MST construction",
          type: "algorithm-visualizer",
          config: {
            algorithm: "mst",
            types: ["kruskal", "prim"],
          },
          tags: ["MST", "Kruskal", "Prim", "Union Find"],
        },
        {
          title: "Topological Sorting",
          description: "Sort directed acyclic graphs topologically",
          type: "algorithm-visualizer",
          config: {
            algorithm: "topological-sort",
            methods: ["kahn", "dfs"],
          },
          tags: ["Topological Sort", "DAG", "Kahn's Algorithm"],
        },
      ],
    },
    {
      id: "hashing",
      title: "Hash Tables",
      icon: <Hash className="h-5 w-5" />,
      description:
        "Hash functions, collision resolution, and hash table implementations",
      visualizers: [
        {
          title: "Hash Function Comparison",
          description:
            "Compare different hash functions and their distributions",
          type: "data-structure-visualizer",
          config: {
            structure: "hash-function",
            functions: ["division", "multiplication", "universal"],
          },
          tags: ["Hash Function", "Distribution", "Collisions"],
        },
        {
          title: "Collision Resolution Strategies",
          description: "Chaining vs open addressing collision handling",
          type: "data-structure-visualizer",
          config: {
            structure: "hash-table",
            collisionMethods: [
              "chaining",
              "linear-probing",
              "quadratic-probing",
              "double-hashing",
            ],
          },
          tags: ["Collisions", "Chaining", "Open Addressing"],
        },
        {
          title: "Dynamic Hash Table Resizing",
          description: "Watch hash tables grow and rehash elements",
          type: "data-structure-visualizer",
          config: {
            structure: "dynamic-hash-table",
            showRehashing: true,
          },
          tags: ["Resizing", "Rehashing", "Load Factor"],
        },
        {
          title: "Bloom Filter",
          description: "Probabilistic data structure for membership testing",
          type: "data-structure-visualizer",
          config: {
            structure: "bloom-filter",
            showProbabilities: true,
          },
          tags: ["Bloom Filter", "Probabilistic", "False Positives"],
        },
      ],
    },
    {
      id: "advanced",
      title: "Advanced Structures",
      icon: <Database className="h-5 w-5" />,
      description: "Specialized data structures for complex problems",
      visualizers: [
        {
          title: "Disjoint Set (Union-Find)",
          description: "Union by rank and path compression optimizations",
          type: "data-structure-visualizer",
          config: {
            structure: "union-find",
            optimizations: ["union-by-rank", "path-compression"],
          },
          tags: ["Union Find", "Disjoint Set", "Path Compression"],
        },
        {
          title: "Segment Tree",
          description: "Range queries and updates with lazy propagation",
          type: "data-structure-visualizer",
          config: {
            structure: "segment-tree",
            operations: ["range-sum", "range-min", "range-max", "lazy-update"],
          },
          tags: ["Segment Tree", "Range Query", "Lazy Propagation"],
        },
        {
          title: "Fenwick Tree (BIT)",
          description: "Binary Indexed Tree for efficient prefix sum queries",
          type: "data-structure-visualizer",
          config: {
            structure: "fenwick-tree",
            operations: ["update", "prefix-sum", "range-sum"],
          },
          tags: ["Fenwick Tree", "BIT", "Prefix Sum"],
        },
        {
          title: "B-Tree Operations",
          description:
            "Multi-way search tree used in databases and file systems",
          type: "data-structure-visualizer",
          config: {
            structure: "b-tree",
            order: 4,
            operations: ["insert", "delete", "search", "split", "merge"],
          },
          tags: ["B-Tree", "Database", "Multi-way Tree"],
        },
        {
          title: "Skip List",
          description: "Probabilistic alternative to balanced trees",
          type: "data-structure-visualizer",
          config: {
            structure: "skip-list",
            showLevels: true,
          },
          tags: ["Skip List", "Probabilistic", "Multi-level"],
        },
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-4">
          Data Structures Interactive Visualizers
        </h1>
        <p className="text-xl text-muted-foreground mb-6">
          Master data structures through interactive visualizations. Explore
          operations, understand complexities, and see algorithms in action.
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          <Badge
            variant="secondary"
            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
          >
            📊 Arrays & Lists
          </Badge>
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
          >
            🌲 Trees & Heaps
          </Badge>
          <Badge
            variant="secondary"
            className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
          >
            🕸️ Graphs
          </Badge>
          <Badge
            variant="secondary"
            className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
          >
            # Hash Tables
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="linear" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          {visualizerCategories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="flex items-center gap-2"
            >
              {category.icon}
              <span className="hidden sm:inline">{category.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {visualizerCategories.map((category) => (
          <TabsContent
            key={category.id}
            value={category.id}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-2">{category.title}</h2>
              <p className="text-muted-foreground">{category.description}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {category.visualizers.map((visualizer, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">
                          {visualizer.title}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {visualizer.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {visualizer.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>{renderVisualizer(visualizer)}</CardContent>
                </Card>
              ))}

              {category.id === "trees" && (
                <>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">
                            Interactive Binary Search Tree
                          </CardTitle>
                          <CardDescription className="text-sm">
                            Build and manipulate a binary search tree with
                            interactive controls
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-3">
                        <Badge variant="outline" className="text-xs">
                          BST
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Interactive
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Real-time
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <BinarySearchTreeVisualizer />
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">
                            Tree Traversal Visualizer
                          </CardTitle>
                          <CardDescription className="text-sm">
                            Step through different tree traversal algorithms
                            with animations
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-3">
                        <Badge variant="outline" className="text-xs">
                          Traversal
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Animation
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Step-by-step
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <TreeTraversalDemo />
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border">
        <h3 className="text-lg font-semibold mb-2">🎯 Learning Strategy</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>
            • Start with linear structures before moving to trees and graphs
          </li>
          <li>• Pay attention to time and space complexity annotations</li>
          <li>• Try different input sizes to see how algorithms scale</li>
          <li>• Compare similar data structures to understand trade-offs</li>
          <li>• Practice implementing the structures you visualize</li>
        </ul>
      </div>
    </div>
  );
}
