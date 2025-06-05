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
import { SortingAlgorithmVisualizer } from "@/src/components/visuals/sorting-visualizer";
import { BarChart3, Search, Route, Zap, Brain, Target } from "lucide-react";

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
    case "interactive-sorting-visualizer":
      return <SortingAlgorithmVisualizer />;
    default:
      return <div>Visualizer type not supported: {visualizer.type}</div>;
  }
}

export default function AlgorithmsVisualizersPage() {
  const visualizerCategories = [
    {
      id: "sorting",
      title: "Sorting Algorithms",
      icon: <BarChart3 className="h-5 w-5" />,
      description: "Compare and visualize different sorting algorithms",
      visualizers: [
        {
          title: "Interactive Sorting Visualizer",
          description:
            "Step-by-step interactive visualization of sorting algorithms with detailed controls",
          type: "interactive-sorting-visualizer",
          tags: [
            "Interactive",
            "Step-by-step",
            "Bubble Sort",
            "Selection Sort",
            "Insertion Sort",
          ],
        },
        {
          title: "Sorting Algorithm Race",
          description:
            "Watch multiple sorting algorithms compete on the same dataset",
          type: "algorithm-visualizer",
          config: {
            algorithm: "sort-race",
            algorithms: [
              "bubble",
              "insertion",
              "selection",
              "merge",
              "quick",
              "heap",
            ],
          },
          tags: ["Sorting", "Comparison", "Performance"],
        },
        {
          title: "Bubble Sort Step-by-Step",
          description:
            "Detailed visualization of bubble sort with swap highlighting",
          type: "algorithm-visualizer",
          config: {
            algorithm: "bubble-sort",
            showSwaps: true,
            showComparisons: true,
          },
          tags: ["Bubble Sort", "O(n²)", "Swaps"],
        },
        {
          title: "Quick Sort Partitioning",
          description: "Visualize pivot selection and partitioning process",
          type: "algorithm-visualizer",
          config: {
            algorithm: "quick-sort",
            showPartitions: true,
            pivotStrategies: ["first", "last", "random", "median-of-three"],
          },
          tags: ["Quick Sort", "Divide & Conquer", "Partitioning"],
        },
        {
          title: "Merge Sort Divide & Conquer",
          description: "See how merge sort divides and merges subarrays",
          type: "algorithm-visualizer",
          config: {
            algorithm: "merge-sort",
            showDivisions: true,
            showMerging: true,
          },
          tags: ["Merge Sort", "Divide & Conquer", "O(n log n)"],
        },
        {
          title: "Heap Sort Visualization",
          description: "Build max heap and extract elements in sorted order",
          type: "algorithm-visualizer",
          config: {
            algorithm: "heap-sort",
            showHeapify: true,
            showExtraction: true,
          },
          tags: ["Heap Sort", "Max Heap", "In-place"],
        },
        {
          title: "Radix Sort Digit Processing",
          description: "Sort numbers by processing individual digits",
          type: "algorithm-visualizer",
          config: {
            algorithm: "radix-sort",
            base: 10,
            showBuckets: true,
          },
          tags: ["Radix Sort", "Non-comparison", "Linear Time"],
        },
      ],
    },
    {
      id: "searching",
      title: "Search Algorithms",
      icon: <Search className="h-5 w-5" />,
      description: "Find elements efficiently with various search strategies",
      visualizers: [
        {
          title: "Linear vs Binary Search",
          description: "Compare sequential and binary search performance",
          type: "algorithm-visualizer",
          config: {
            algorithm: "search-comparison",
            types: ["linear", "binary"],
          },
          tags: ["Linear Search", "Binary Search", "O(log n)"],
        },
        {
          title: "Binary Search Tree Search",
          description: "Navigate through BST to find target values",
          type: "algorithm-visualizer",
          config: {
            algorithm: "bst-search",
            showPath: true,
          },
          tags: ["BST", "Tree Search", "Logarithmic"],
        },
        {
          title: "Hash Table Lookup",
          description: "Constant time search with collision handling",
          type: "algorithm-visualizer",
          config: {
            algorithm: "hash-search",
            collisionMethods: ["chaining", "linear-probing"],
          },
          tags: ["Hash Table", "O(1)", "Collisions"],
        },
        {
          title: "String Pattern Matching",
          description: "Find patterns in text using KMP and Boyer-Moore",
          type: "algorithm-visualizer",
          config: {
            algorithm: "string-matching",
            algorithms: ["naive", "kmp", "boyer-moore"],
          },
          tags: ["Pattern Matching", "KMP", "Boyer-Moore"],
        },
      ],
    },
    {
      id: "graph",
      title: "Graph Algorithms",
      icon: <Route className="h-5 w-5" />,
      description: "Explore graph traversal and pathfinding algorithms",
      visualizers: [
        {
          title: "BFS vs DFS Traversal",
          description:
            "Compare breadth-first and depth-first graph exploration",
          type: "algorithm-visualizer",
          config: {
            algorithm: "graph-traversal",
            showQueue: true,
            showStack: true,
          },
          tags: ["BFS", "DFS", "Graph Traversal"],
        },
        {
          title: "Dijkstra's Shortest Path",
          description: "Find shortest paths in weighted graphs",
          type: "algorithm-visualizer",
          config: {
            algorithm: "dijkstra",
            showDistances: true,
            showPriorityQueue: true,
          },
          tags: ["Dijkstra", "Shortest Path", "Priority Queue"],
        },
        {
          title: "A* Pathfinding",
          description: "Intelligent pathfinding with heuristic guidance",
          type: "algorithm-visualizer",
          config: {
            algorithm: "a-star",
            showHeuristic: true,
            obstacles: true,
          },
          tags: ["A*", "Heuristic", "Pathfinding"],
        },
        {
          title: "Minimum Spanning Tree",
          description: "Build MST using Kruskal's and Prim's algorithms",
          type: "algorithm-visualizer",
          config: {
            algorithm: "mst",
            showEdgeWeights: true,
            algorithms: ["kruskal", "prim"],
          },
          tags: ["MST", "Kruskal", "Prim"],
        },
        {
          title: "Topological Sort",
          description: "Order vertices in directed acyclic graphs",
          type: "algorithm-visualizer",
          config: {
            algorithm: "topological-sort",
            showInDegree: true,
          },
          tags: ["Topological Sort", "DAG", "Dependencies"],
        },
        {
          title: "Strongly Connected Components",
          description: "Find SCCs using Kosaraju's and Tarjan's algorithms",
          type: "algorithm-visualizer",
          config: {
            algorithm: "scc",
            algorithms: ["kosaraju", "tarjan"],
          },
          tags: ["SCC", "Kosaraju", "Tarjan"],
        },
      ],
    },
    {
      id: "dynamic",
      title: "Dynamic Programming",
      icon: <Brain className="h-5 w-5" />,
      description: "Solve complex problems by breaking them into subproblems",
      visualizers: [
        {
          title: "Fibonacci Memoization",
          description:
            "Compare naive recursion with memoized dynamic programming",
          type: "algorithm-visualizer",
          config: {
            algorithm: "fibonacci",
            showMemoization: true,
            showCallStack: true,
          },
          tags: ["Fibonacci", "Memoization", "Recursion"],
        },
        {
          title: "Longest Common Subsequence",
          description: "Build LCS table step by step",
          type: "algorithm-visualizer",
          config: {
            algorithm: "lcs",
            showTable: true,
            showBacktrack: true,
          },
          tags: ["LCS", "DP Table", "Subsequence"],
        },
        {
          title: "Knapsack Problem",
          description:
            "Optimize item selection with weight and value constraints",
          type: "algorithm-visualizer",
          config: {
            algorithm: "knapsack",
            variant: "0-1",
            showTable: true,
          },
          tags: ["Knapsack", "Optimization", "DP"],
        },
        {
          title: "Edit Distance (Levenshtein)",
          description:
            "Calculate minimum edits to transform one string to another",
          type: "algorithm-visualizer",
          config: {
            algorithm: "edit-distance",
            operations: ["insert", "delete", "substitute"],
          },
          tags: ["Edit Distance", "String DP", "Levenshtein"],
        },
        {
          title: "Coin Change Problem",
          description: "Find minimum coins needed for a target amount",
          type: "algorithm-visualizer",
          config: {
            algorithm: "coin-change",
            showTable: true,
            unlimited: true,
          },
          tags: ["Coin Change", "Greedy vs DP", "Optimization"],
        },
      ],
    },
    {
      id: "greedy",
      title: "Greedy Algorithms",
      icon: <Target className="h-5 w-5" />,
      description: "Make locally optimal choices for global optimization",
      visualizers: [
        {
          title: "Activity Selection",
          description: "Select maximum non-overlapping activities",
          type: "algorithm-visualizer",
          config: {
            algorithm: "activity-selection",
            showTimeline: true,
          },
          tags: ["Activity Selection", "Greedy", "Scheduling"],
        },
        {
          title: "Fractional Knapsack",
          description: "Maximize value with fractional item selection",
          type: "algorithm-visualizer",
          config: {
            algorithm: "fractional-knapsack",
            showValueDensity: true,
          },
          tags: ["Fractional Knapsack", "Greedy", "Value Density"],
        },
        {
          title: "Huffman Coding",
          description: "Build optimal prefix-free codes for compression",
          type: "algorithm-visualizer",
          config: {
            algorithm: "huffman-coding",
            showFrequencies: true,
            showTree: true,
          },
          tags: ["Huffman Coding", "Compression", "Priority Queue"],
        },
        {
          title: "Job Scheduling",
          description: "Schedule jobs to minimize completion time",
          type: "algorithm-visualizer",
          config: {
            algorithm: "job-scheduling",
            showGanttChart: true,
          },
          tags: ["Job Scheduling", "Deadlines", "Penalties"],
        },
      ],
    },
    {
      id: "advanced",
      title: "Advanced Algorithms",
      icon: <Zap className="h-5 w-5" />,
      description: "Complex algorithms for specialized problems",
      visualizers: [
        {
          title: "Backtracking: N-Queens",
          description: "Place N queens on chessboard without conflicts",
          type: "algorithm-visualizer",
          config: {
            algorithm: "n-queens",
            showBacktrack: true,
            boardSize: 8,
          },
          tags: ["N-Queens", "Backtracking", "Constraint Satisfaction"],
        },
        {
          title: "Network Flow: Ford-Fulkerson",
          description: "Find maximum flow through a network",
          type: "algorithm-visualizer",
          config: {
            algorithm: "max-flow",
            showResidualGraph: true,
          },
          tags: ["Max Flow", "Ford-Fulkerson", "Network"],
        },
        {
          title: "Convex Hull: Graham Scan",
          description: "Find convex hull of a set of points",
          type: "algorithm-visualizer",
          config: {
            algorithm: "convex-hull",
            showAngles: true,
          },
          tags: ["Convex Hull", "Graham Scan", "Computational Geometry"],
        },
        {
          title: "Fast Fourier Transform",
          description: "Efficient polynomial multiplication using FFT",
          type: "algorithm-visualizer",
          config: {
            algorithm: "fft",
            showComplexNumbers: true,
          },
          tags: ["FFT", "Signal Processing", "Divide & Conquer"],
        },
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent mb-4">
          Algorithms Interactive Visualizers
        </h1>
        <p className="text-xl text-muted-foreground mb-6">
          Understand algorithms through step-by-step visualizations. See how
          algorithms work, compare their performance, and learn their
          applications.
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
          >
            📊 Sorting
          </Badge>
          <Badge
            variant="secondary"
            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
          >
            🔍 Searching
          </Badge>
          <Badge
            variant="secondary"
            className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
          >
            🕸️ Graph Algorithms
          </Badge>
          <Badge
            variant="secondary"
            className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
          >
            🧠 Dynamic Programming
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="sorting" className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-8">
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
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-12 p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg border">
        <h3 className="text-lg font-semibold mb-2">
          🚀 Algorithm Mastery Tips
        </h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>
            • Focus on understanding the algorithm logic before memorizing code
          </li>
          <li>• Pay attention to time and space complexity trade-offs</li>
          <li>• Try different input sizes to see how algorithms scale</li>
          <li>• Compare similar algorithms to understand when to use each</li>
          <li>• Practice implementing algorithms after visualizing them</li>
          <li>• Connect algorithms to real-world applications and use cases</li>
        </ul>
      </div>
    </div>
  );
}
