"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/src/lib/utils";
import {
  Card,
  CardContent,
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
import { Slider } from "@/src/components/ui/slider";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Shuffle,
  ArrowUpDown,
  ArrowRight,
  CheckCircle,
  Circle,
} from "lucide-react";

interface AlgorithmAnimationProps {
  title?: string;
  description?: string;
  className?: string;
  height?: number;
  algorithm:
    | "binary-search"
    | "merge-sort"
    | "quick-sort"
    | "dijkstra"
    | "dfs-bfs";
}

interface AnimationStep {
  description: string;
  array?: number[];
  highlightIndices?: number[];
  comparedIndices?: number[];
  sortedIndices?: number[];
  pivot?: number;
  left?: number;
  right?: number;
  mid?: number;
  found?: boolean;
}

export function AlgorithmAnimation({
  title,
  description,
  className,
  height = 400,
  algorithm,
}: AlgorithmAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState([500]);
  const [steps, setSteps] = useState<AnimationStep[]>([]);
  const [inputArray, setInputArray] = useState<number[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      generateSteps();
    }
  }, [algorithm, isMounted]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep((prev) => prev + 1);
      }, speed[0]);
    } else {
      setIsPlaying(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentStep, steps.length, speed]);

  const generateSteps = () => {
    switch (algorithm) {
      case "binary-search":
        generateBinarySearchSteps();
        break;
      case "merge-sort":
        generateMergeSortSteps();
        break;
      case "quick-sort":
        generateQuickSortSteps();
        break;
      case "dijkstra":
        generateDijkstraSteps();
        break;
      case "dfs-bfs":
        generateDFSBFSSteps();
        break;
    }
  };

  const generateBinarySearchSteps = () => {
    const arr = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
    const target = 11;
    setInputArray(arr);

    const searchSteps: AnimationStep[] = [];
    let left = 0;
    let right = arr.length - 1;

    searchSteps.push({
      description: `Searching for ${target} in sorted array`,
      array: arr,
      highlightIndices: [],
      left,
      right,
    });

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      searchSteps.push({
        description: `Check middle element at index ${mid}: ${arr[mid]}`,
        array: arr,
        highlightIndices: [mid],
        comparedIndices: [mid],
        left,
        right,
        mid,
      });

      if (arr[mid] === target) {
        searchSteps.push({
          description: `Found ${target} at index ${mid}!`,
          array: arr,
          highlightIndices: [mid],
          left,
          right,
          mid,
          found: true,
        });
        break;
      } else if (arr[mid] < target) {
        searchSteps.push({
          description: `${arr[mid]} < ${target}, search right half`,
          array: arr,
          highlightIndices: [mid],
          left: mid + 1,
          right,
          mid,
        });
        left = mid + 1;
      } else {
        searchSteps.push({
          description: `${arr[mid]} > ${target}, search left half`,
          array: arr,
          highlightIndices: [mid],
          left,
          right: mid - 1,
          mid,
        });
        right = mid - 1;
      }
    }

    setSteps(searchSteps);
    setCurrentStep(0);
  };

  const generateMergeSortSteps = () => {
    const arr = [64, 34, 25, 12, 22, 11, 90];
    setInputArray([...arr]);

    const sortSteps: AnimationStep[] = [];

    const mergeSort = (
      array: number[],
      start: number = 0,
      originalArray: number[] = [...array]
    ): number[] => {
      if (array.length <= 1) return array;

      const mid = Math.floor(array.length / 2);
      const left = array.slice(0, mid);
      const right = array.slice(mid);

      sortSteps.push({
        description: `Divide array into: [${left.join(", ")}] and [${right.join(
          ", "
        )}]`,
        array: originalArray,
        highlightIndices: [],
      });

      const sortedLeft: number[] = mergeSort(left, start, originalArray);
      const sortedRight: number[] = mergeSort(
        right,
        start + mid,
        originalArray
      );

      return merge(sortedLeft, sortedRight, start, originalArray);
    };

    const merge = (
      left: number[],
      right: number[],
      start: number,
      originalArray: number[]
    ): number[] => {
      const result = [];
      let leftIndex = 0;
      let rightIndex = 0;

      sortSteps.push({
        description: `Merge [${left.join(", ")}] and [${right.join(", ")}]`,
        array: originalArray,
        highlightIndices: [],
      });

      while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex] < right[rightIndex]) {
          result.push(left[leftIndex]);
          leftIndex++;
        } else {
          result.push(right[rightIndex]);
          rightIndex++;
        }
      }

      result.push(...left.slice(leftIndex));
      result.push(...right.slice(rightIndex));

      for (let i = 0; i < result.length; i++) {
        originalArray[start + i] = result[i];
      }

      sortSteps.push({
        description: `Merged result: [${result.join(", ")}]`,
        array: [...originalArray],
        highlightIndices: Array.from(
          { length: result.length },
          (_, i) => start + i
        ),
      });

      return result;
    };

    sortSteps.push({
      description: "Starting Merge Sort",
      array: arr,
      highlightIndices: [],
    });

    mergeSort(arr);

    sortSteps.push({
      description: "Merge Sort completed!",
      array: arr,
      sortedIndices: Array.from({ length: arr.length }, (_, i) => i),
    });

    setSteps(sortSteps);
    setCurrentStep(0);
  };

  const generateQuickSortSteps = () => {
    const arr = [64, 34, 25, 12, 22, 11, 90];
    setInputArray([...arr]);

    const sortSteps: AnimationStep[] = [];

    sortSteps.push({
      description: "Starting Quick Sort",
      array: [...arr],
      highlightIndices: [],
    });

    const quickSort = (
      array: number[],
      low: number = 0,
      high: number = array.length - 1
    ) => {
      if (low < high) {
        const pivotIndex = partition(array, low, high);
        quickSort(array, low, pivotIndex - 1);
        quickSort(array, pivotIndex + 1, high);
      }
    };

    const partition = (array: number[], low: number, high: number) => {
      const pivot = array[high];
      let i = low - 1;

      sortSteps.push({
        description: `Choose pivot: ${pivot} at index ${high}`,
        array: [...array],
        highlightIndices: [high],
        pivot: high,
      });

      for (let j = low; j < high; j++) {
        sortSteps.push({
          description: `Compare ${array[j]} with pivot ${pivot}`,
          array: [...array],
          highlightIndices: [j, high],
          comparedIndices: [j],
          pivot: high,
        });

        if (array[j] < pivot) {
          i++;
          [array[i], array[j]] = [array[j], array[i]];

          sortSteps.push({
            description: `${array[j]} < ${pivot}, swap positions`,
            array: [...array],
            highlightIndices: [i, j, high],
            pivot: high,
          });
        }
      }

      [array[i + 1], array[high]] = [array[high], array[i + 1]];

      sortSteps.push({
        description: `Place pivot in correct position`,
        array: [...array],
        highlightIndices: [i + 1],
        pivot: i + 1,
      });

      return i + 1;
    };

    quickSort(arr);

    sortSteps.push({
      description: "Quick Sort completed!",
      array: arr,
      sortedIndices: Array.from({ length: arr.length }, (_, i) => i),
    });

    setSteps(sortSteps);
    setCurrentStep(0);
  };

  const generateDijkstraSteps = () => {
    const graph = {
      nodes: ["A", "B", "C", "D", "E"],
      edges: [
        { from: "A", to: "B", weight: 4 },
        { from: "A", to: "C", weight: 2 },
        { from: "B", to: "C", weight: 1 },
        { from: "B", to: "D", weight: 5 },
        { from: "C", to: "D", weight: 8 },
        { from: "C", to: "E", weight: 10 },
        { from: "D", to: "E", weight: 2 },
      ],
    };

    const dijkstraSteps: AnimationStep[] = [];
    const distances = {
      A: 0,
      B: Infinity,
      C: Infinity,
      D: Infinity,
      E: Infinity,
    };
    const visited = new Set();
    const previous: { [key: string]: string | null } = {};

    dijkstraSteps.push({
      description:
        "Initialize: Set distance to start node (A) as 0, others as infinity",
      array: Object.entries(distances).map(([node, dist]) =>
        dist === Infinity ? -1 : dist
      ),
    });

    while (visited.size < graph.nodes.length) {
      let currentNode = null;
      let minDistance = Infinity;

      for (const node of graph.nodes) {
        if (
          !visited.has(node) &&
          distances[node as keyof typeof distances] < minDistance
        ) {
          minDistance = distances[node as keyof typeof distances];
          currentNode = node;
        }
      }

      if (!currentNode) break;

      visited.add(currentNode);

      dijkstraSteps.push({
        description: `Visit node ${currentNode} with distance ${
          distances[currentNode as keyof typeof distances]
        }`,
        array: Object.entries(distances).map(([node, dist]) =>
          dist === Infinity ? -1 : dist
        ),
        highlightIndices: [graph.nodes.indexOf(currentNode)],
      });

      const neighbors = graph.edges.filter((edge) => edge.from === currentNode);

      for (const edge of neighbors) {
        const neighbor = edge.to;
        const newDistance =
          distances[currentNode as keyof typeof distances] + edge.weight;

        if (newDistance < distances[neighbor as keyof typeof distances]) {
          distances[neighbor as keyof typeof distances] = newDistance;
          previous[neighbor] = currentNode;

          dijkstraSteps.push({
            description: `Update distance to ${neighbor}: ${newDistance} (via ${currentNode})`,
            array: Object.entries(distances).map(([node, dist]) =>
              dist === Infinity ? -1 : dist
            ),
            comparedIndices: [graph.nodes.indexOf(neighbor)],
          });
        }
      }
    }

    dijkstraSteps.push({
      description: "Dijkstra's algorithm completed! Shortest paths found.",
      array: Object.entries(distances).map(([node, dist]) =>
        dist === Infinity ? -1 : dist
      ),
      sortedIndices: Array.from({ length: graph.nodes.length }, (_, i) => i),
    });

    setSteps(dijkstraSteps);
    setCurrentStep(0);
  };

  const generateDFSBFSSteps = () => {
    const graph = ["A", "B", "C", "D", "E", "F"];
    const adjacencyList = {
      A: ["B", "C"],
      B: ["A", "D", "E"],
      C: ["A", "F"],
      D: ["B"],
      E: ["B", "F"],
      F: ["C", "E"],
    };

    const dfsSteps: AnimationStep[] = [];
    const visited = new Set();
    const stack = ["A"];

    dfsSteps.push({
      description: "DFS: Start with node A in stack",
      array: [0, -1, -1, -1, -1, -1], // 0 = in stack/current, -1 = unvisited, 1 = visited
      highlightIndices: [0],
    });

    while (stack.length > 0) {
      const current = stack.pop()!;

      if (!visited.has(current)) {
        visited.add(current);

        dfsSteps.push({
          description: `DFS: Visit node ${current}`,
          array: graph.map((node, index) => {
            if (visited.has(node)) return 1;
            if (stack.includes(node)) return 0;
            return -1;
          }),
          highlightIndices: [graph.indexOf(current)],
        });

        const neighbors =
          adjacencyList[current as keyof typeof adjacencyList] || [];
        for (const neighbor of neighbors.reverse()) {
          if (!visited.has(neighbor)) {
            stack.push(neighbor);
          }
        }

        if (stack.length > 0) {
          dfsSteps.push({
            description: `DFS: Add unvisited neighbors to stack: ${stack.join(
              ", "
            )}`,
            array: graph.map((node, index) => {
              if (visited.has(node)) return 1;
              if (stack.includes(node)) return 0;
              return -1;
            }),
          });
        }
      }
    }

    dfsSteps.push({
      description: "DFS traversal completed!",
      array: graph.map(() => 1),
      sortedIndices: Array.from({ length: graph.length }, (_, i) => i),
    });

    setSteps(dfsSteps);
    setCurrentStep(0);
  };

  const resetAnimation = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const renderArray = () => {
    const step = steps[currentStep];
    if (!step) return null;

    const array = step.array || inputArray;

    return (
      <div className="flex justify-center items-center space-x-2 mb-6">
        {array.map((value, index) => {
          let bgColor = "bg-gray-100 border-gray-300";
          let textColor = "text-gray-900";

          if (step.sortedIndices?.includes(index)) {
            bgColor = "bg-green-100 border-green-500";
            textColor = "text-green-800";
          } else if (step.highlightIndices?.includes(index)) {
            bgColor = "bg-blue-100 border-blue-500";
            textColor = "text-blue-800";
          } else if (step.comparedIndices?.includes(index)) {
            bgColor = "bg-yellow-100 border-yellow-500";
            textColor = "text-yellow-800";
          } else if (step.pivot === index) {
            bgColor = "bg-purple-100 border-purple-500";
            textColor = "text-purple-800";
          }

          if (algorithm === "binary-search") {
            if (
              index < (step.left || 0) ||
              index > (step.right || array.length - 1)
            ) {
              bgColor = "bg-gray-50 border-gray-200";
              textColor = "text-gray-400";
            }
            if (step.found && step.highlightIndices?.includes(index)) {
              bgColor = "bg-green-100 border-green-500";
              textColor = "text-green-800";
            }
          }

          if (algorithm === "dfs-bfs") {
            if (value === 1) {
              bgColor = "bg-green-100 border-green-500";
              textColor = "text-green-800";
            } else if (value === 0) {
              bgColor = "bg-blue-100 border-blue-500";
              textColor = "text-blue-800";
            } else {
              bgColor = "bg-gray-100 border-gray-300";
              textColor = "text-gray-900";
            }
          }

          const displayValue =
            algorithm === "dijkstra" && value === -1
              ? "∞"
              : algorithm === "dfs-bfs"
              ? value === 1
                ? "✓"
                : value === 0
                ? "○"
                : "·"
              : value;

          return (
            <div
              key={index}
              className={cn(
                "w-12 h-12 border-2 rounded-lg flex items-center justify-center font-semibold transition-all duration-300",
                bgColor,
                textColor
              )}
            >
              {algorithm === "dijkstra" || algorithm === "dfs-bfs" ? (
                <div className="text-center">
                  <div className="text-xs text-gray-500">
                    {algorithm === "dijkstra"
                      ? ["A", "B", "C", "D", "E"][index]
                      : ["A", "B", "C", "D", "E", "F"][index]}
                  </div>
                  <div>{displayValue}</div>
                </div>
              ) : (
                displayValue
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderControls = () => (
    <div className="flex items-center justify-center gap-2 mb-4">
      <Button
        variant="outline"
        size="sm"
        onClick={prevStep}
        disabled={currentStep === 0}
      >
        <SkipBack className="h-3 w-3" />
      </Button>
      <Button variant="outline" size="sm" onClick={togglePlayPause}>
        {isPlaying ? (
          <Pause className="h-3 w-3" />
        ) : (
          <Play className="h-3 w-3" />
        )}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={nextStep}
        disabled={currentStep === steps.length - 1}
      >
        <SkipForward className="h-3 w-3" />
      </Button>
      <Button variant="outline" size="sm" onClick={resetAnimation}>
        <RotateCcw className="h-3 w-3" />
      </Button>
      <Button variant="outline" size="sm" onClick={generateSteps}>
        <Shuffle className="h-3 w-3" />
      </Button>
    </div>
  );

  const renderSpeedControl = () => (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-sm text-gray-600">Speed:</span>
      <Slider
        value={speed}
        onValueChange={setSpeed}
        max={1000}
        min={100}
        step={100}
        className="w-24"
      />
      <span className="text-xs text-gray-500">{speed[0]}ms</span>
    </div>
  );

  const renderStepInfo = () => {
    const step = steps[currentStep];
    if (!step) return null;

    return (
      <div className="text-center space-y-2">
        <div className="text-sm text-gray-600">
          Step {currentStep + 1} of {steps.length}
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">{step.description}</p>
        </div>
      </div>
    );
  };

  const renderAlgorithmInfo = () => {
    const algorithmData = {
      "binary-search": {
        name: "Binary Search",
        complexity: "O(log n)",
        description: "Efficient search algorithm for sorted arrays",
      },
      "merge-sort": {
        name: "Merge Sort",
        complexity: "O(n log n)",
        description: "Divide and conquer sorting algorithm",
      },
      "quick-sort": {
        name: "Quick Sort",
        complexity: "O(n log n) average, O(n²) worst",
        description: "Efficient in-place sorting algorithm",
      },
      dijkstra: {
        name: "Dijkstra's Algorithm",
        complexity: "O((V + E) log V)",
        description: "Shortest path algorithm for weighted graphs",
      },
      "dfs-bfs": {
        name: "Depth-First Search",
        complexity: "O(V + E)",
        description: "Graph traversal using stack (recursive)",
      },
    };

    const info = algorithmData[algorithm];

    return (
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <h3 className="font-semibold">{info.name}</h3>
        <p className="text-sm text-gray-600">{info.description}</p>
        <Badge variant="outline" className="mt-1">
          Time Complexity: {info.complexity}
        </Badge>
      </div>
    );
  };

  if (!isMounted) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        {(title || description) && (
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                {title && <CardTitle className="text-lg">{title}</CardTitle>}
                {description && (
                  <p className="text-sm text-muted-foreground">{description}</p>
                )}
              </div>
            </div>
          </CardHeader>
        )}
        <CardContent className="space-y-4">
          <div
            style={{ minHeight: `${height}px` }}
            className="flex flex-col justify-center items-center"
          >
            <div className="text-sm text-muted-foreground">
              Loading animation...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      {(title || description) && (
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              {title && <CardTitle className="text-lg">{title}</CardTitle>}
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
          </div>
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        {renderAlgorithmInfo()}

        <div
          style={{ minHeight: `${height}px` }}
          className="flex flex-col justify-center"
        >
          {renderArray()}
          {renderStepInfo()}
        </div>

        <div className="flex justify-center gap-4">{renderSpeedControl()}</div>

        {renderControls()}
      </CardContent>
    </Card>
  );
}

export function BinarySearchAnimationDemo({
  className,
}: {
  className?: string;
}) {
  return (
    <AlgorithmAnimation
      title="Binary Search Algorithm"
      description="Step-by-step visualization of binary search in a sorted array"
      className={className}
      height={300}
      algorithm="binary-search"
    />
  );
}

export function MergeSortAnimationDemo({ className }: { className?: string }) {
  return (
    <AlgorithmAnimation
      title="Merge Sort Algorithm"
      description="Divide and conquer approach to sorting with merge operations"
      className={className}
      height={300}
      algorithm="merge-sort"
    />
  );
}

export function QuickSortAnimationDemo({ className }: { className?: string }) {
  return (
    <AlgorithmAnimation
      title="Quick Sort Algorithm"
      description="In-place sorting using pivot partitioning strategy"
      className={className}
      height={300}
      algorithm="quick-sort"
    />
  );
}

export function DijkstraAnimationDemo({ className }: { className?: string }) {
  return (
    <AlgorithmAnimation
      title="Dijkstra's Shortest Path"
      description="Find shortest paths from source node to all other nodes"
      className={className}
      height={300}
      algorithm="dijkstra"
    />
  );
}

export function DFSAnimationDemo({ className }: { className?: string }) {
  return (
    <AlgorithmAnimation
      title="Depth-First Search (DFS)"
      description="Graph traversal using stack-based approach"
      className={className}
      height={300}
      algorithm="dfs-bfs"
    />
  );
}
