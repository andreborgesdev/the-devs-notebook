"use client";

import React, { useState, useEffect, useCallback } from "react";
import { cn } from "@/src/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Slider } from "@/src/components/ui/slider";
import { Play, Pause, RotateCcw, SkipForward, SkipBack } from "lucide-react";

interface AlgorithmStep {
  array: number[];
  comparing?: number[];
  swapping?: number[];
  sorted?: number[];
  description: string;
  complexity?: string;
}

interface AlgorithmVisualizerProps {
  title: string;
  description?: string;
  algorithm: (arr: number[]) => AlgorithmStep[];
  initialArray?: number[];
  className?: string;
  height?: number;
}

export function AlgorithmVisualizer({
  title,
  description,
  algorithm,
  initialArray = [64, 34, 25, 12, 22, 11, 90],
  className,
  height = 400,
}: AlgorithmVisualizerProps) {
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState([500]);
  const [array, setArray] = useState(initialArray);

  useEffect(() => {
    const algorithmSteps = algorithm([...array]);
    setSteps(algorithmSteps);
    setCurrentStep(0);
  }, [array, algorithm]);

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, speed[0]);
      return () => clearTimeout(timer);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, steps.length, speed]);

  const resetVisualization = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const shuffleArray = () => {
    if (typeof window !== "undefined") {
      const newArray = [...array].sort(() => Math.random() - 0.5);
      setArray(newArray);
      setIsPlaying(false);
    }
  };

  const currentStepData = steps[currentStep] || {
    array: array,
    description: "Ready to start",
  };
  const maxValue = Math.max(...initialArray);

  const getBarColor = (index: number, value: number) => {
    if (currentStepData.sorted?.includes(index)) return "bg-green-500";
    if (currentStepData.swapping?.includes(index)) return "bg-red-500";
    if (currentStepData.comparing?.includes(index)) return "bg-yellow-500";
    return "bg-blue-500";
  };

  const getBarHeight = (value: number) => {
    return (value / maxValue) * 200;
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              <SkipBack className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={currentStep >= steps.length - 1}
            >
              {isPlaying ? (
                <Pause className="h-3 w-3" />
              ) : (
                <Play className="h-3 w-3" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentStep(Math.min(steps.length - 1, currentStep + 1))
              }
              disabled={currentStep >= steps.length - 1}
            >
              <SkipForward className="h-3 w-3" />
            </Button>
            <Button variant="outline" size="sm" onClick={resetVisualization}>
              <RotateCcw className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              Step {currentStep + 1} of {steps.length}
            </Badge>
            {currentStepData.complexity && (
              <Badge variant="secondary">{currentStepData.complexity}</Badge>
            )}
          </div>
          <div className="flex items-center gap-2 flex-1">
            <span className="text-sm text-muted-foreground">Speed:</span>
            <Slider
              value={speed}
              onValueChange={setSpeed}
              max={1000}
              min={100}
              step={100}
              className="w-24"
            />
          </div>
          <Button variant="outline" size="sm" onClick={shuffleArray}>
            Shuffle
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div
            className="flex items-end justify-center gap-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
            style={{ height: `${height * 0.6}px` }}
          >
            {currentStepData.array.map((value, index) => (
              <div key={index} className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "transition-all duration-300 rounded-t-md min-w-[30px] flex items-end justify-center text-white text-xs font-bold",
                    getBarColor(index, value)
                  )}
                  style={{ height: `${getBarHeight(value)}px` }}
                >
                  {value}
                </div>
                <div className="text-xs text-muted-foreground">{index}</div>
              </div>
            ))}
          </div>

          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm font-medium">{currentStepData.description}</p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Unsorted</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span>Comparing</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Swapping</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Sorted</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function bubbleSort(arr: number[]): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const array = [...arr];
  const n = array.length;

  steps.push({
    array: [...array],
    description:
      "Starting Bubble Sort: Compare adjacent elements and swap if needed",
  });

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        array: [...array],
        comparing: [j, j + 1],
        description: `Comparing elements at positions ${j} and ${j + 1}: ${
          array[j]
        } and ${array[j + 1]}`,
        complexity: "O(n²)",
      });

      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        steps.push({
          array: [...array],
          swapping: [j, j + 1],
          description: `Swapped ${array[j + 1]} and ${array[j]} because ${
            array[j + 1]
          } > ${array[j]}`,
          complexity: "O(n²)",
        });
      }
    }
    steps.push({
      array: [...array],
      sorted: Array.from({ length: n - i }, (_, idx) => n - 1 - idx),
      description: `Element at position ${
        n - 1 - i
      } is now in its correct position`,
      complexity: "O(n²)",
    });
  }

  steps.push({
    array: [...array],
    sorted: Array.from({ length: n }, (_, idx) => idx),
    description: "Bubble Sort completed! Array is now sorted.",
    complexity: "O(n²)",
  });

  return steps;
}

export function selectionSort(arr: number[]): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const array = [...arr];
  const n = array.length;

  steps.push({
    array: [...array],
    description:
      "Starting Selection Sort: Find minimum element and place it at the beginning",
  });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    steps.push({
      array: [...array],
      comparing: [i],
      description: `Finding minimum element from position ${i} to ${n - 1}`,
      complexity: "O(n²)",
    });

    for (let j = i + 1; j < n; j++) {
      steps.push({
        array: [...array],
        comparing: [minIdx, j],
        description: `Comparing ${array[minIdx]} at position ${minIdx} with ${array[j]} at position ${j}`,
        complexity: "O(n²)",
      });

      if (array[j] < array[minIdx]) {
        minIdx = j;
        steps.push({
          array: [...array],
          comparing: [minIdx],
          description: `New minimum found: ${array[minIdx]} at position ${minIdx}`,
          complexity: "O(n²)",
        });
      }
    }

    if (minIdx !== i) {
      [array[i], array[minIdx]] = [array[minIdx], array[i]];
      steps.push({
        array: [...array],
        swapping: [i, minIdx],
        description: `Swapped minimum element ${array[i]} to position ${i}`,
        complexity: "O(n²)",
      });
    }

    steps.push({
      array: [...array],
      sorted: Array.from({ length: i + 1 }, (_, idx) => idx),
      description: `Elements from position 0 to ${i} are now sorted`,
      complexity: "O(n²)",
    });
  }

  steps.push({
    array: [...array],
    sorted: Array.from({ length: n }, (_, idx) => idx),
    description: "Selection Sort completed! Array is now sorted.",
    complexity: "O(n²)",
  });

  return steps;
}

export function garbageCollection(arr: number[]): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const memory = [...arr];
  const n = memory.length;

  steps.push({
    array: [...memory],
    description: "Memory state before garbage collection - objects allocated",
  });

  const reachable = new Set([0, 1, 2]);

  steps.push({
    array: [...memory],
    comparing: Array.from(reachable),
    description:
      "Mark phase: Identifying reachable objects from root references",
    complexity: "O(n)",
  });

  const unreachable = [];
  for (let i = 0; i < n; i++) {
    if (!reachable.has(i)) {
      unreachable.push(i);
    }
  }

  steps.push({
    array: [...memory],
    swapping: unreachable,
    description: "Sweep phase: Marking unreachable objects for collection",
    complexity: "O(n)",
  });

  for (const idx of unreachable) {
    memory[idx] = 0;
  }

  steps.push({
    array: [...memory],
    sorted: Array.from(reachable),
    description:
      "Memory after garbage collection - unreachable objects removed",
    complexity: "O(n)",
  });

  return steps;
}

export function sortComparison(arr: number[]): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const array1 = [...arr];
  const array2 = [...arr];

  steps.push({
    array: [...array1],
    description: "Comparing Bubble Sort vs Quick Sort performance",
  });

  bubbleSort(array1).forEach((step, index) => {
    if (index % 3 === 0) {
      steps.push({
        ...step,
        description: `Bubble Sort: ${step.description}`,
        complexity: "O(n²)",
      });
    }
  });

  steps.push({
    array: [...array2],
    description: "Quick Sort implementation (more efficient)",
  });

  const quickSortSteps = quickSort(array2);
  quickSortSteps.slice(0, 5).forEach((step) => {
    steps.push({
      ...step,
      description: `Quick Sort: ${step.description}`,
      complexity: "O(n log n)",
    });
  });

  return steps;
}

export function quickSort(arr: number[]): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const array = [...arr];

  function partition(low: number, high: number): number {
    const pivot = array[high];
    let i = low - 1;

    steps.push({
      array: [...array],
      comparing: [high],
      description: `Choosing pivot: ${pivot}`,
      complexity: "O(n log n)",
    });

    for (let j = low; j < high; j++) {
      if (array[j] < pivot) {
        i++;
        [array[i], array[j]] = [array[j], array[i]];
        steps.push({
          array: [...array],
          swapping: [i, j],
          description: `Swapping ${array[i]} and ${array[j]}`,
          complexity: "O(n log n)",
        });
      }
    }

    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    return i + 1;
  }

  function sort(low: number, high: number) {
    if (low < high) {
      const pi = partition(low, high);
      sort(low, pi - 1);
      sort(pi + 1, high);
    }
  }

  sort(0, array.length - 1);

  steps.push({
    array: [...array],
    sorted: Array.from({ length: array.length }, (_, i) => i),
    description: "Quick Sort completed!",
    complexity: "O(n log n)",
  });

  return steps;
}

export function binarySearch(arr: number[]): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const sortedArray = [...arr].sort((a, b) => a - b);
  const target = sortedArray[Math.floor(sortedArray.length / 2)];
  let left = 0;
  let right = sortedArray.length - 1;

  steps.push({
    array: [...sortedArray],
    description: `Binary Search: Looking for ${target} in sorted array`,
  });

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    steps.push({
      array: [...sortedArray],
      comparing: [mid],
      description: `Checking middle element at index ${mid}: ${sortedArray[mid]}`,
      complexity: "O(log n)",
    });

    if (sortedArray[mid] === target) {
      steps.push({
        array: [...sortedArray],
        sorted: [mid],
        description: `Found ${target} at index ${mid}!`,
        complexity: "O(log n)",
      });
      break;
    } else if (sortedArray[mid] < target) {
      left = mid + 1;
      steps.push({
        array: [...sortedArray],
        comparing: Array.from({ length: right - left + 1 }, (_, i) => left + i),
        description: `${sortedArray[mid]} < ${target}, search right half`,
        complexity: "O(log n)",
      });
    } else {
      right = mid - 1;
      steps.push({
        array: [...sortedArray],
        comparing: Array.from({ length: right - left + 1 }, (_, i) => left + i),
        description: `${sortedArray[mid]} > ${target}, search left half`,
        complexity: "O(log n)",
      });
    }
  }

  return steps;
}

export function producerConsumer(arr: number[]): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const buffer = new Array(5).fill(0);
  const producers = arr.slice(0, 3);
  const consumers = arr.slice(3);

  steps.push({
    array: [...buffer],
    description: "Producer-Consumer Problem: Shared buffer initialized",
  });

  let bufferIndex = 0;
  producers.forEach((item, index) => {
    if (bufferIndex < buffer.length) {
      buffer[bufferIndex] = item;
      steps.push({
        array: [...buffer],
        comparing: [bufferIndex],
        description: `Producer ${index + 1} adds item ${item} to buffer`,
        complexity: "O(1)",
      });
      bufferIndex++;
    }
  });

  let consumeIndex = 0;
  consumers.forEach((_, index) => {
    if (consumeIndex < bufferIndex) {
      const consumed = buffer[consumeIndex];
      buffer[consumeIndex] = 0;
      steps.push({
        array: [...buffer],
        swapping: [consumeIndex],
        description: `Consumer ${index + 1} consumes item ${consumed}`,
        complexity: "O(1)",
      });
      consumeIndex++;
    }
  });

  return steps;
}

export function BubbleSortDemo({ className }: { className?: string }) {
  return (
    <AlgorithmVisualizer
      title="Bubble Sort Algorithm"
      description="Watch how bubble sort works by comparing adjacent elements"
      algorithm={bubbleSort}
      className={className}
    />
  );
}

export function SelectionSortDemo({ className }: { className?: string }) {
  return (
    <AlgorithmVisualizer
      title="Selection Sort Algorithm"
      description="Visualize selection sort finding the minimum element in each iteration"
      algorithm={selectionSort}
      className={className}
    />
  );
}

export function GarbageCollectionDemo({ className }: { className?: string }) {
  return (
    <AlgorithmVisualizer
      title="Garbage Collection Algorithm"
      description="Understand how garbage collection works in memory management"
      algorithm={garbageCollection}
      className={className}
    />
  );
}

export function SortComparisonDemo({ className }: { className?: string }) {
  return (
    <AlgorithmVisualizer
      title="Sort Comparison"
      description="Compare Bubble Sort and Quick Sort algorithms"
      algorithm={sortComparison}
      className={className}
    />
  );
}

export function QuickSortDemo({ className }: { className?: string }) {
  return (
    <AlgorithmVisualizer
      title="Quick Sort Algorithm"
      description="Watch the efficient quick sort algorithm in action"
      algorithm={quickSort}
      className={className}
    />
  );
}

export function BinarySearchDemo({ className }: { className?: string }) {
  return (
    <AlgorithmVisualizer
      title="Binary Search Algorithm"
      description="See how binary search quickly finds an element in a sorted array"
      algorithm={binarySearch}
      className={className}
    />
  );
}

export function ProducerConsumerDemo({ className }: { className?: string }) {
  return (
    <AlgorithmVisualizer
      title="Producer-Consumer Problem"
      description="Visualize the producer-consumer problem with a shared buffer"
      algorithm={producerConsumer}
      className={className}
    />
  );
}
