"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Slider } from "@/src/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Play, Pause, RotateCcw, Code } from "lucide-react";

interface SortingStep {
  array: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
  step: string;
}

export const SortingAlgorithmVisualizer: React.FC = () => {
  const [array, setArray] = useState<number[]>([64, 34, 25, 12, 22, 11, 90]);
  const [algorithm, setAlgorithm] = useState<string>("bubble");
  const [steps, setSteps] = useState<SortingStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [arraySize, setArraySize] = useState([7]);

  const generateRandomArray = (size: number) => {
    return Array.from(
      { length: size },
      () => Math.floor(Math.random() * 100) + 1
    );
  };

  const bubbleSort = (arr: number[]): SortingStep[] => {
    const steps: SortingStep[] = [];
    const workingArray = [...arr];
    const n = workingArray.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        steps.push({
          array: [...workingArray],
          comparing: [j, j + 1],
          swapping: [],
          sorted: Array.from({ length: i }, (_, k) => n - 1 - k),
          step: `Comparing elements at positions ${j} and ${j + 1}`,
        });

        if (workingArray[j] > workingArray[j + 1]) {
          [workingArray[j], workingArray[j + 1]] = [
            workingArray[j + 1],
            workingArray[j],
          ];
          steps.push({
            array: [...workingArray],
            comparing: [],
            swapping: [j, j + 1],
            sorted: Array.from({ length: i }, (_, k) => n - 1 - k),
            step: `Swapped elements at positions ${j} and ${j + 1}`,
          });
        }
      }
    }

    steps.push({
      array: [...workingArray],
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: n }, (_, k) => k),
      step: "Sorting complete!",
    });

    return steps;
  };

  const selectionSort = (arr: number[]): SortingStep[] => {
    const steps: SortingStep[] = [];
    const workingArray = [...arr];
    const n = workingArray.length;

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;

      for (let j = i + 1; j < n; j++) {
        steps.push({
          array: [...workingArray],
          comparing: [minIdx, j],
          swapping: [],
          sorted: Array.from({ length: i }, (_, k) => k),
          step: `Finding minimum in unsorted portion. Current min at ${minIdx}, checking ${j}`,
        });

        if (workingArray[j] < workingArray[minIdx]) {
          minIdx = j;
        }
      }

      if (minIdx !== i) {
        [workingArray[i], workingArray[minIdx]] = [
          workingArray[minIdx],
          workingArray[i],
        ];
        steps.push({
          array: [...workingArray],
          comparing: [],
          swapping: [i, minIdx],
          sorted: Array.from({ length: i + 1 }, (_, k) => k),
          step: `Swapped minimum element to position ${i}`,
        });
      }
    }

    steps.push({
      array: [...workingArray],
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: n }, (_, k) => k),
      step: "Sorting complete!",
    });

    return steps;
  };

  const insertionSort = (arr: number[]): SortingStep[] => {
    const steps: SortingStep[] = [];
    const workingArray = [...arr];
    const n = workingArray.length;

    for (let i = 1; i < n; i++) {
      const key = workingArray[i];
      let j = i - 1;

      steps.push({
        array: [...workingArray],
        comparing: [i],
        swapping: [],
        sorted: Array.from({ length: i }, (_, k) => k),
        step: `Inserting element ${key} into sorted portion`,
      });

      while (j >= 0 && workingArray[j] > key) {
        steps.push({
          array: [...workingArray],
          comparing: [j, j + 1],
          swapping: [],
          sorted: Array.from({ length: i }, (_, k) => k),
          step: `Comparing ${workingArray[j]} with ${key}`,
        });

        workingArray[j + 1] = workingArray[j];
        steps.push({
          array: [...workingArray],
          comparing: [],
          swapping: [j, j + 1],
          sorted: Array.from({ length: i }, (_, k) => k),
          step: `Shifting ${workingArray[j]} to the right`,
        });
        j--;
      }

      workingArray[j + 1] = key;
      steps.push({
        array: [...workingArray],
        comparing: [],
        swapping: [j + 1],
        sorted: Array.from({ length: i + 1 }, (_, k) => k),
        step: `Placed ${key} in correct position`,
      });
    }

    steps.push({
      array: [...workingArray],
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: n }, (_, k) => k),
      step: "Sorting complete!",
    });

    return steps;
  };

  const runSortingAlgorithm = () => {
    let sortingSteps: SortingStep[] = [];

    switch (algorithm) {
      case "bubble":
        sortingSteps = bubbleSort(array);
        break;
      case "selection":
        sortingSteps = selectionSort(array);
        break;
      case "insertion":
        sortingSteps = insertionSort(array);
        break;
      default:
        sortingSteps = bubbleSort(array);
    }

    setSteps(sortingSteps);
    setCurrentStep(0);
  };

  const reset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    const newArray = generateRandomArray(arraySize[0]);
    setArray(newArray);
    setSteps([]);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && steps.length > 0 && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep((prev) => prev + 1);
      }, 1000);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, steps.length]);

  useEffect(() => {
    const newArray = generateRandomArray(arraySize[0]);
    setArray(newArray);
    setSteps([]);
    setCurrentStep(0);
  }, [arraySize]);

  const currentStepData = steps[currentStep];
  const displayArray = currentStepData ? currentStepData.array : array;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          Interactive Sorting Visualizer
        </CardTitle>
        <CardDescription>
          Watch how different sorting algorithms work step by step
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Algorithm</label>
              <Select value={algorithm} onValueChange={setAlgorithm}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bubble">Bubble Sort</SelectItem>
                  <SelectItem value="selection">Selection Sort</SelectItem>
                  <SelectItem value="insertion">Insertion Sort</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Array Size: {arraySize[0]}
              </label>
              <Slider
                value={arraySize}
                onValueChange={setArraySize}
                min={5}
                max={12}
                step={1}
                className="w-[120px]"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={runSortingAlgorithm} disabled={isPlaying}>
              Start Sorting
            </Button>
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={steps.length === 0}
              variant="outline"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <Button onClick={reset} variant="outline">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div
              className="flex items-end justify-center gap-2 mb-4"
              style={{ height: "200px" }}
            >
              {displayArray.map((value, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center transition-all duration-300 ${
                    currentStepData?.comparing.includes(index)
                      ? "scale-110"
                      : ""
                  }`}
                >
                  <div
                    className={`w-8 rounded-t transition-all duration-300 ${
                      currentStepData?.sorted.includes(index)
                        ? "bg-green-500"
                        : currentStepData?.comparing.includes(index)
                        ? "bg-yellow-500"
                        : currentStepData?.swapping.includes(index)
                        ? "bg-red-500"
                        : "bg-blue-500"
                    }`}
                    style={{ height: `${(value / 100) * 150}px` }}
                  />
                  <span className="text-xs mt-1 font-mono">{value}</span>
                </div>
              ))}
            </div>

            {currentStepData && (
              <div className="text-center">
                <Badge variant="outline">
                  Step {currentStep + 1} of {steps.length}
                </Badge>
                <p className="mt-2 text-sm">{currentStepData.step}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Legend:</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span>Unsorted</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span>Comparing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span>Swapping</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>Sorted</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Complexity:</h4>
              {algorithm === "bubble" && (
                <div className="space-y-1">
                  <div>Time: O(n²)</div>
                  <div>Space: O(1)</div>
                  <div>Stable: Yes</div>
                </div>
              )}
              {algorithm === "selection" && (
                <div className="space-y-1">
                  <div>Time: O(n²)</div>
                  <div>Space: O(1)</div>
                  <div>Stable: No</div>
                </div>
              )}
              {algorithm === "insertion" && (
                <div className="space-y-1">
                  <div>Time: O(n²)</div>
                  <div>Space: O(1)</div>
                  <div>Stable: Yes</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
