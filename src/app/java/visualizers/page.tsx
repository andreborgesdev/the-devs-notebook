"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { JavaCollectionsDemo } from "@/src/components/visuals/concept-visualizer";
import {
  AlgorithmVisualizer,
  bubbleSort,
  selectionSort,
  garbageCollection,
  sortComparison,
  binarySearch,
  producerConsumer,
} from "@/src/components/visuals/algorithm-visualizer";
import { DataStructureVisualizer } from "@/src/components/visuals/data-structure-visualizer";
import ProgrammingConceptsVisualizer from "@/src/components/visuals/programming-concepts-visualizer";
import { Play, Code, Database, Cpu, Lock } from "lucide-react";

const renderVisualizer = (visualizer: any) => {
  const { type, title, description, config } = visualizer;

  const getAlgorithmFunction = (algorithmName: string) => {
    const algorithmMap: { [key: string]: (arr: number[]) => any[] } = {
      "garbage-collection": garbageCollection,
      "sort-comparison": sortComparison,
      "binary-search": binarySearch,
      "producer-consumer": producerConsumer,
      "bubble-sort": bubbleSort,
      "selection-sort": selectionSort,
    };

    return algorithmMap[algorithmName] || bubbleSort;
  };

  switch (type) {
    case "programming-concepts-visualizer":
      return <ProgrammingConceptsVisualizer />;
    case "algorithm-visualizer":
      return (
        <AlgorithmVisualizer
          title={title}
          description={description}
          algorithm={getAlgorithmFunction(config?.algorithm || "bubble-sort")}
          initialArray={config?.initialArray || [64, 34, 25, 12, 22, 11, 90]}
          className="border-0 shadow-none p-0"
        />
      );
    case "data-structure-visualizer":
      return (
        <DataStructureVisualizer
          title={title}
          description={description}
          structure={config?.structure || "stack"}
          initialData={config?.initialData}
          className="border-0 shadow-none p-0"
        />
      );
    case "system-design-visualizer":
    case "flowchart-diagram":
      return (
        <div className="p-8 border border-dashed border-gray-300 rounded-lg text-center text-gray-500">
          <div className="text-lg font-medium mb-2">{title}</div>
          <div className="text-sm">{description}</div>
          <div className="mt-4 text-xs text-gray-400">
            This visualizer is coming soon!
          </div>
        </div>
      );
    default:
      return (
        <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center text-gray-500">
          Unknown visualizer type: {type}
        </div>
      );
  }
};

export default function JavaVisualizersPage() {
  const visualizerCategories = [
    {
      id: "memory",
      title: "Memory Management",
      icon: <Cpu className="h-5 w-5" />,
      description:
        "Explore Java memory model, garbage collection, and heap management",
      visualizers: [
        {
          title: "Java Memory Model Visualizer",
          description:
            "Interactive visualization of heap, stack, and method area",
          type: "programming-concepts-visualizer",
          config: { concept: "java-memory-model" },
          tags: ["Memory", "JVM", "Stack", "Heap"],
        },
        {
          title: "Garbage Collection Simulator",
          description: "See how different GC algorithms work in real-time",
          type: "algorithm-visualizer",
          config: {
            algorithm: "garbage-collection",
            concepts: ["mark-and-sweep", "generational", "concurrent"],
          },
          tags: ["GC", "Performance", "Memory"],
        },
        {
          title: "Object Lifecycle Tracker",
          description: "Track object creation, references, and disposal",
          type: "data-structure-visualizer",
          config: { structure: "object-lifecycle" },
          tags: ["Objects", "References", "Lifecycle"],
        },
      ],
    },
    {
      id: "collections",
      title: "Collections Framework",
      icon: <Database className="h-5 w-5" />,
      description: "Interactive demos of Java collections and data structures",
      visualizers: [
        {
          title: "ArrayList vs LinkedList Performance",
          description: "Compare operations and performance characteristics",
          type: "data-structure-visualizer",
          config: {
            structure: "list-comparison",
            types: ["arraylist", "linkedlist"],
          },
          tags: ["ArrayList", "LinkedList", "Performance"],
        },
        {
          title: "HashMap Internal Structure",
          description: "Visualize hashing, buckets, and collision resolution",
          type: "data-structure-visualizer",
          config: {
            structure: "hashmap",
            showInternals: true,
          },
          tags: ["HashMap", "Hashing", "Collisions"],
        },
        {
          title: "TreeMap Red-Black Tree",
          description: "Interactive red-black tree operations and balancing",
          type: "data-structure-visualizer",
          config: { structure: "red-black-tree" },
          tags: ["TreeMap", "Red-Black Tree", "Balancing"],
        },
        {
          title: "Concurrent Collections",
          description:
            "Visualize thread-safe operations in concurrent collections",
          type: "programming-concepts-visualizer",
          config: { concept: "concurrent-collections" },
          tags: ["Concurrency", "Thread-Safety", "ConcurrentHashMap"],
        },
      ],
    },
    {
      id: "concurrency",
      title: "Concurrency & Threading",
      icon: <Play className="h-5 w-5" />,
      description:
        "Understand Java threading, synchronization, and parallel processing",
      visualizers: [
        {
          title: "Thread Lifecycle Simulator",
          description: "Visualize thread states and transitions",
          type: "programming-concepts-visualizer",
          config: { concept: "thread-lifecycle" },
          tags: ["Threads", "States", "Lifecycle"],
        },
        {
          title: "Synchronization Mechanisms",
          description:
            "Interactive demos of locks, monitors, and synchronization",
          type: "programming-concepts-visualizer",
          config: { concept: "java-synchronization" },
          tags: ["Synchronization", "Locks", "Monitors"],
        },
        {
          title: "Producer-Consumer Problem",
          description: "Classic concurrency problem with different solutions",
          type: "algorithm-visualizer",
          config: { algorithm: "producer-consumer" },
          tags: ["Producer-Consumer", "BlockingQueue", "Wait-Notify"],
        },
        {
          title: "Executor Framework",
          description: "Visualize thread pools and task execution",
          type: "system-design-visualizer",
          config: { concept: "thread-pool" },
          tags: ["ThreadPool", "Executor", "Task Management"],
        },
      ],
    },
    {
      id: "algorithms",
      title: "Java Algorithms",
      icon: <Code className="h-5 w-5" />,
      description: "Algorithm implementations and optimizations in Java",
      visualizers: [
        {
          title: "Sorting Algorithms Comparison",
          description: "Compare Java implementations of sorting algorithms",
          type: "algorithm-visualizer",
          config: {
            algorithm: "sort-comparison",
            language: "java",
          },
          tags: ["Sorting", "Algorithms", "Performance"],
        },
        {
          title: "Stream API Operations",
          description:
            "Visualize Java 8+ Stream operations and transformations",
          type: "programming-concepts-visualizer",
          config: { concept: "java-streams" },
          tags: ["Streams", "Functional", "Lambda"],
        },
        {
          title: "Binary Search Implementation",
          description: "Step-by-step binary search with Java code",
          type: "algorithm-visualizer",
          config: {
            algorithm: "binary-search",
            showCode: true,
            language: "java",
          },
          tags: ["Binary Search", "Arrays", "Algorithms"],
        },
      ],
    },
    {
      id: "spring",
      title: "Spring Framework",
      icon: <Lock className="h-5 w-5" />,
      description: "Spring concepts, dependency injection, and architecture",
      visualizers: [
        {
          title: "Dependency Injection Visualizer",
          description: "Understand Spring IoC container and bean lifecycle",
          type: "system-design-visualizer",
          config: { concept: "spring-di" },
          tags: ["DI", "IoC", "Beans"],
        },
        {
          title: "Spring MVC Request Flow",
          description: "Trace HTTP requests through Spring MVC components",
          type: "flowchart-diagram",
          config: {
            diagram: "spring-mvc-flow",
            interactive: true,
          },
          tags: ["Spring MVC", "Request Flow", "Controllers"],
        },
        {
          title: "Spring Security Filter Chain",
          description: "Visualize security filters and authentication flow",
          type: "system-design-visualizer",
          config: { concept: "spring-security" },
          tags: ["Security", "Filters", "Authentication"],
        },
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-4">
          Java Interactive Visualizers
        </h1>
        <p className="text-xl text-muted-foreground mb-6">
          Explore Java concepts through interactive visualizations covering
          memory management, collections, concurrency, algorithms, and Spring
          framework.
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          <Badge
            variant="secondary"
            className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
          >
            ☕ Java Core
          </Badge>
          <Badge
            variant="secondary"
            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
          >
            🧠 Memory Management
          </Badge>
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
          >
            🔄 Concurrency
          </Badge>
          <Badge
            variant="secondary"
            className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
          >
            🍃 Spring Framework
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="memory" className="w-full">
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

              {category.id === "collections" && (
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">
                          Java Collections Framework Overview
                        </CardTitle>
                        <CardDescription className="text-sm">
                          Interactive visualization of the complete collections
                          hierarchy and implementations
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      <Badge variant="outline" className="text-xs">
                        Collections
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Hierarchy
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Interfaces
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <JavaCollectionsDemo />
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-12 p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-lg border">
        <h3 className="text-lg font-semibold mb-2">💡 Learning Tips</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>
            • Interact with the visualizations to understand concepts better
          </li>
          <li>• Try different inputs and observe how the behavior changes</li>
          <li>• Use these visualizers alongside the theoretical content</li>
          <li>• Experiment with the code playgrounds to reinforce learning</li>
        </ul>
      </div>
    </div>
  );
}
