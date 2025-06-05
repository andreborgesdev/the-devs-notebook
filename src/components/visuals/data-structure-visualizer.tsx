"use client";

import React, { useState, useEffect, useRef } from "react";
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
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Plus,
  Minus,
  Search,
} from "lucide-react";
import { Input } from "@/src/components/ui/input";

interface DataStructureVisualizerProps {
  title?: string;
  description?: string;
  className?: string;
  height?: number;
  structure:
    | "stack"
    | "queue"
    | "hash-table"
    | "graph"
    | "heap"
    | "array"
    | "dynamic-array"
    | "linked-list"
    | "binary-tree"
    | "bst"
    | "avl-tree"
    | "red-black-tree"
    | "trie"
    | "hash-function"
    | "dynamic-hash-table"
    | "bloom-filter"
    | "union-find"
    | "segment-tree"
    | "fenwick-tree"
    | "b-tree"
    | "skip-list";
  initialData?: any[];
}

interface StackItem {
  value: number | string;
  id: string;
  highlight?: boolean;
}

interface QueueItem {
  value: number | string;
  id: string;
  highlight?: boolean;
}

interface HashTableItem {
  key: string;
  value: string;
  hash: number;
  highlight?: boolean;
}

interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  visited?: boolean;
  current?: boolean;
}

interface GraphEdge {
  from: string;
  to: string;
  weight?: number;
  traversed?: boolean;
}

interface HeapItem {
  value: number;
  id: string;
  highlight?: boolean;
}

interface ArrayItem {
  value: number | string;
  id: string;
  index: number;
  highlight?: boolean;
}

interface LinkedListNode {
  value: number | string;
  id: string;
  next?: string;
  highlight?: boolean;
}

interface TreeNode {
  value: number | string;
  id: string;
  left?: string;
  right?: string;
  x?: number;
  y?: number;
  highlight?: boolean;
  visited?: boolean;
}

interface TrieNode {
  char: string;
  id: string;
  isEndOfWord: boolean;
  children: { [key: string]: string };
  highlight?: boolean;
}

export function DataStructureVisualizer({
  title,
  description,
  className,
  height = 400,
  structure,
  initialData = [],
}: DataStructureVisualizerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState([500]);
  const [data, setData] = useState(initialData);
  const [inputValue, setInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [animationStep, setAnimationStep] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const resetVisualization = () => {
    setData(initialData);
    setAnimationStep(0);
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setAnimationStep((prev) => prev + 1);
      }, speed[0]);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, speed]);

  const renderStack = () => {
    const stackItems = data as StackItem[];

    const push = () => {
      if (inputValue.trim()) {
        const newItem: StackItem = {
          value: inputValue,
          id: Date.now().toString(),
          highlight: true,
        };
        setData([...stackItems, newItem]);
        setInputValue("");
        setTimeout(() => {
          setData((prev) =>
            prev.map((item) => ({ ...item, highlight: false }))
          );
        }, 1000);
      }
    };

    const pop = () => {
      if (stackItems.length > 0) {
        const newStack = [...stackItems];
        newStack[newStack.length - 1].highlight = true;
        setData(newStack);
        setTimeout(() => {
          setData((prev) => prev.slice(0, -1));
        }, 500);
      }
    };

    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Enter value"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-32"
            onKeyPress={(e) => e.key === "Enter" && push()}
          />
          <Button onClick={push} size="sm">
            <Plus className="h-3 w-3" />
          </Button>
          <Button onClick={pop} size="sm" variant="outline">
            <Minus className="h-3 w-3" />
          </Button>
        </div>

        <div className="flex flex-col-reverse items-center space-y-reverse space-y-1">
          {stackItems.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                "w-24 h-12 border-2 flex items-center justify-center rounded transition-all duration-300",
                item.highlight
                  ? "bg-blue-200 border-blue-500 scale-105"
                  : "bg-gray-100 border-gray-300"
              )}
              style={{
                transform: `translateY(${item.highlight ? "-5px" : "0"})`,
                zIndex: stackItems.length - index,
              }}
            >
              <span className="font-mono font-semibold">{item.value}</span>
            </div>
          ))}
          <div className="w-24 h-4 bg-gray-800 rounded-b text-center text-white text-xs flex items-center justify-center">
            Stack
          </div>
        </div>

        <Badge variant="outline">
          Top:{" "}
          {stackItems.length > 0
            ? stackItems[stackItems.length - 1].value
            : "Empty"}
        </Badge>
      </div>
    );
  };

  const renderQueue = () => {
    const queueItems = data as QueueItem[];

    const enqueue = () => {
      if (inputValue.trim()) {
        const newItem: QueueItem = {
          value: inputValue,
          id: Date.now().toString(),
          highlight: true,
        };
        setData([...queueItems, newItem]);
        setInputValue("");
        setTimeout(() => {
          setData((prev) =>
            prev.map((item) => ({ ...item, highlight: false }))
          );
        }, 1000);
      }
    };

    const dequeue = () => {
      if (queueItems.length > 0) {
        const newQueue = [...queueItems];
        newQueue[0].highlight = true;
        setData(newQueue);
        setTimeout(() => {
          setData((prev) => prev.slice(1));
        }, 500);
      }
    };

    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Enter value"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-32"
            onKeyPress={(e) => e.key === "Enter" && enqueue()}
          />
          <Button onClick={enqueue} size="sm">
            Enqueue
          </Button>
          <Button onClick={dequeue} size="sm" variant="outline">
            Dequeue
          </Button>
        </div>

        <div className="flex items-center space-x-1">
          <div className="text-sm font-semibold">Front →</div>
          {queueItems.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                "w-16 h-12 border-2 flex items-center justify-center rounded transition-all duration-300",
                item.highlight
                  ? "bg-green-200 border-green-500 scale-105"
                  : "bg-gray-100 border-gray-300"
              )}
            >
              <span className="font-mono font-semibold text-sm">
                {item.value}
              </span>
            </div>
          ))}
          <div className="text-sm font-semibold">← Rear</div>
        </div>

        <div className="flex gap-4">
          <Badge variant="outline">
            Front: {queueItems.length > 0 ? queueItems[0].value : "Empty"}
          </Badge>
          <Badge variant="outline">
            Rear:{" "}
            {queueItems.length > 0
              ? queueItems[queueItems.length - 1].value
              : "Empty"}
          </Badge>
        </div>
      </div>
    );
  };

  const renderHashTable = () => {
    const hashItems = data as HashTableItem[];
    const tableSize = 7;

    const simpleHash = (key: string) => {
      let hash = 0;
      for (let i = 0; i < key.length; i++) {
        hash = (hash + key.charCodeAt(i)) % tableSize;
      }
      return hash;
    };

    const insert = () => {
      if (inputValue.trim()) {
        const [key, value] = inputValue.split(":");
        if (key && value) {
          const hash = simpleHash(key.trim());
          const newItem: HashTableItem = {
            key: key.trim(),
            value: value.trim(),
            hash,
            highlight: true,
          };
          setData([
            ...hashItems.filter((item) => item.key !== key.trim()),
            newItem,
          ]);
          setInputValue("");
          setTimeout(() => {
            setData((prev) =>
              prev.map((item) => ({ ...item, highlight: false }))
            );
          }, 1000);
        }
      }
    };

    const search = () => {
      if (searchValue.trim()) {
        const hash = simpleHash(searchValue.trim());
        setData((prev) =>
          prev.map((item) => ({
            ...item,
            highlight: item.key === searchValue.trim(),
          }))
        );
        setTimeout(() => {
          setData((prev) =>
            prev.map((item) => ({ ...item, highlight: false }))
          );
        }, 2000);
      }
    };

    const table = Array(tableSize)
      .fill(null)
      .map((_, index) => {
        const item = hashItems.find((item) => item.hash === index);
        return { index, item };
      });

    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="key:value"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-32"
            onKeyPress={(e) => e.key === "Enter" && insert()}
          />
          <Button onClick={insert} size="sm">
            Insert
          </Button>
          <Input
            placeholder="Search key"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-24"
            onKeyPress={(e) => e.key === "Enter" && search()}
          />
          <Button onClick={search} size="sm" variant="outline">
            <Search className="h-3 w-3" />
          </Button>
        </div>

        <div className="space-y-1">
          {table.map(({ index, item }) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-600 text-white flex items-center justify-center rounded text-sm font-mono">
                {index}
              </div>
              <div
                className={cn(
                  "w-40 h-8 border-2 flex items-center justify-center rounded transition-all duration-300",
                  item
                    ? item.highlight
                      ? "bg-yellow-200 border-yellow-500"
                      : "bg-blue-100 border-blue-300"
                    : "bg-gray-50 border-gray-300"
                )}
              >
                {item ? (
                  <span className="font-mono text-sm">
                    {item.key}: {item.value}
                  </span>
                ) : (
                  <span className="text-gray-400 text-sm">empty</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <Badge variant="outline">
          Hash Function: key.charCodeAt(i) % {tableSize}
        </Badge>
      </div>
    );
  };

  const renderGraph = () => {
    const nodes: GraphNode[] = [
      { id: "A", label: "A", x: 100, y: 100 },
      { id: "B", label: "B", x: 200, y: 50 },
      { id: "C", label: "C", x: 300, y: 100 },
      { id: "D", label: "D", x: 150, y: 200 },
      { id: "E", label: "E", x: 250, y: 200 },
    ];

    const edges: GraphEdge[] = [
      { from: "A", to: "B" },
      { from: "A", to: "D" },
      { from: "B", to: "C" },
      { from: "B", to: "E" },
      { from: "C", to: "E" },
      { from: "D", to: "E" },
    ];

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-full h-80 border rounded bg-gray-50">
          <svg className="w-full h-full">
            {edges.map((edge, index) => {
              const fromNode = nodes.find((n) => n.id === edge.from)!;
              const toNode = nodes.find((n) => n.id === edge.to)!;
              return (
                <line
                  key={index}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke="#6b7280"
                  strokeWidth="2"
                />
              );
            })}
            {nodes.map((node) => (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="20"
                  fill={
                    node.visited
                      ? "#10b981"
                      : node.current
                      ? "#f59e0b"
                      : "#3b82f6"
                  }
                  stroke="#1f2937"
                  strokeWidth="2"
                />
                <text
                  x={node.x}
                  y={node.y}
                  textAnchor="middle"
                  dy="0.3em"
                  fill="white"
                  fontSize="14"
                  fontWeight="bold"
                >
                  {node.label}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div className="flex gap-2 mt-4">
          <Badge variant="outline" className="bg-blue-100">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            Unvisited
          </Badge>
          <Badge variant="outline" className="bg-yellow-100">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            Current
          </Badge>
          <Badge variant="outline" className="bg-green-100">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            Visited
          </Badge>
        </div>
      </div>
    );
  };

  const renderHeap = () => {
    const heapItems = data as HeapItem[];

    const addToHeap = () => {
      if (inputValue.trim()) {
        const value = parseInt(inputValue);
        if (!isNaN(value)) {
          const newHeap = [
            ...heapItems,
            {
              value,
              id: Date.now().toString(),
              highlight: true,
            },
          ];

          heapifyUp(newHeap, newHeap.length - 1);
          setData(newHeap);
          setInputValue("");

          setTimeout(() => {
            setData((prev) =>
              prev.map((item) => ({ ...item, highlight: false }))
            );
          }, 1000);
        }
      }
    };

    const extractMax = () => {
      if (heapItems.length > 0) {
        const newHeap = [...heapItems];
        newHeap[0] = newHeap[newHeap.length - 1];
        newHeap.pop();

        if (newHeap.length > 0) {
          heapifyDown(newHeap, 0);
        }

        setData(newHeap);
      }
    };

    const heapifyUp = (heap: HeapItem[], index: number) => {
      const parentIndex = Math.floor((index - 1) / 2);
      if (parentIndex >= 0 && heap[index].value > heap[parentIndex].value) {
        [heap[index], heap[parentIndex]] = [heap[parentIndex], heap[index]];
        heapifyUp(heap, parentIndex);
      }
    };

    const heapifyDown = (heap: HeapItem[], index: number) => {
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;
      let largest = index;

      if (
        leftChild < heap.length &&
        heap[leftChild].value > heap[largest].value
      ) {
        largest = leftChild;
      }

      if (
        rightChild < heap.length &&
        heap[rightChild].value > heap[largest].value
      ) {
        largest = rightChild;
      }

      if (largest !== index) {
        [heap[index], heap[largest]] = [heap[largest], heap[index]];
        heapifyDown(heap, largest);
      }
    };

    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Enter number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-32"
            type="number"
            onKeyPress={(e) => e.key === "Enter" && addToHeap()}
          />
          <Button onClick={addToHeap} size="sm">
            Insert
          </Button>
          <Button onClick={extractMax} size="sm" variant="outline">
            Extract Max
          </Button>
        </div>

        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(40px, 1fr))" }}
        >
          {heapItems.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                "w-12 h-12 border-2 flex items-center justify-center rounded-full transition-all duration-300",
                item.highlight
                  ? "bg-yellow-200 border-yellow-500 scale-110"
                  : index === 0
                  ? "bg-red-100 border-red-500"
                  : "bg-blue-100 border-blue-300"
              )}
            >
              <span className="font-mono font-semibold text-sm">
                {item.value}
              </span>
            </div>
          ))}
        </div>

        <Badge variant="outline">
          Max: {heapItems.length > 0 ? heapItems[0]?.value : "Empty"}
        </Badge>
      </div>
    );
  };

  const renderArray = () => {
    const arrayItems = data as ArrayItem[];

    const addElement = () => {
      if (inputValue.trim()) {
        const newItem: ArrayItem = {
          value: inputValue,
          id: Date.now().toString(),
          index: arrayItems.length,
          highlight: true,
        };
        setData([...arrayItems, newItem]);
        setInputValue("");

        setTimeout(() => {
          setData((prev) =>
            prev.map((item) => ({ ...item, highlight: false }))
          );
        }, 1000);
      }
    };

    const removeElement = (index: number) => {
      const newArray = arrayItems.filter((_, i) => i !== index);
      const updatedArray = newArray.map((item, i) => ({ ...item, index: i }));
      setData(updatedArray);
    };

    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Enter value"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-32"
            onKeyPress={(e) => e.key === "Enter" && addElement()}
          />
          <Button onClick={addElement} size="sm">
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          {arrayItems.map((item, index) => (
            <div key={item.id} className="flex flex-col items-center">
              <div className="text-xs text-gray-500 mb-1">[{index}]</div>
              <div
                className={cn(
                  "w-16 h-12 border-2 flex items-center justify-center rounded cursor-pointer transition-all duration-300",
                  item.highlight
                    ? "bg-yellow-200 border-yellow-500 scale-105"
                    : "bg-gray-100 border-gray-300 hover:bg-gray-200"
                )}
                onClick={() => removeElement(index)}
              >
                <span className="font-mono font-semibold text-sm">
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>

        <Badge variant="outline">Length: {arrayItems.length}</Badge>
      </div>
    );
  };

  const renderDynamicArray = () => {
    return renderArray();
  };

  const renderLinkedList = () => {
    const nodes = data as LinkedListNode[];

    const addNode = () => {
      if (inputValue.trim()) {
        const newNode: LinkedListNode = {
          value: inputValue,
          id: Date.now().toString(),
          highlight: true,
        };

        if (nodes.length > 0) {
          const lastNode = nodes[nodes.length - 1];
          lastNode.next = newNode.id;
        }

        setData([...nodes, newNode]);
        setInputValue("");

        setTimeout(() => {
          setData((prev) =>
            prev.map((item) => ({ ...item, highlight: false }))
          );
        }, 1000);
      }
    };

    const removeNode = (nodeId: string) => {
      const nodeIndex = nodes.findIndex((n) => n.id === nodeId);
      if (nodeIndex === -1) return;

      const newNodes = [...nodes];

      if (nodeIndex > 0) {
        newNodes[nodeIndex - 1].next = newNodes[nodeIndex].next;
      }

      newNodes.splice(nodeIndex, 1);
      setData(newNodes);
    };

    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Enter value"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-32"
            onKeyPress={(e) => e.key === "Enter" && addNode()}
          />
          <Button onClick={addNode} size="sm">
            Add Node
          </Button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto p-4">
          {nodes.map((node, index) => (
            <div key={node.id} className="flex items-center gap-2">
              <div
                className={cn(
                  "w-16 h-12 border-2 flex items-center justify-center rounded cursor-pointer transition-all duration-300",
                  node.highlight
                    ? "bg-blue-200 border-blue-500 scale-105"
                    : "bg-gray-100 border-gray-300 hover:bg-gray-200"
                )}
                onClick={() => removeNode(node.id)}
              >
                <span className="font-mono font-semibold text-sm">
                  {node.value}
                </span>
              </div>
              {index < nodes.length - 1 && (
                <div className="text-gray-400">→</div>
              )}
            </div>
          ))}
          {nodes.length > 0 && <div className="text-gray-400">→ null</div>}
        </div>

        <Badge variant="outline">Nodes: {nodes.length}</Badge>
      </div>
    );
  };

  const renderBinaryTree = () => {
    const [treeValues, setTreeValues] = useState<number[]>([
      1, 2, 3, 4, 5, 6, 7,
    ]);
    const [inputValue, setInputValue] = useState("");

    const buildBinaryTree = (values: number[]): any => {
      if (values.length === 0) return { name: "empty" };

      const buildNode = (index: number): any => {
        if (index >= values.length) return undefined;

        const leftChild = buildNode(2 * index + 1);
        const rightChild = buildNode(2 * index + 2);

        const children = [leftChild, rightChild].filter(
          (child): child is any => child !== undefined
        );

        return {
          name: values[index].toString(),
          value: values[index],
          children: children.length > 0 ? children : undefined,
        };
      };

      return buildNode(0);
    };

    const addNode = () => {
      const value = parseInt(inputValue);
      if (!isNaN(value) && !treeValues.includes(value)) {
        setTreeValues([...treeValues, value]);
        setInputValue("");
      }
    };

    const resetTree = () => {
      setTreeValues([1, 2, 3, 4, 5, 6, 7]);
      setInputValue("");
    };

    const treeData = buildBinaryTree(treeValues);

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 items-center justify-center">
          <Input
            placeholder="Add node value"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-32"
            type="number"
            onKeyPress={(e) => e.key === "Enter" && addNode()}
          />
          <Button onClick={addNode} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
          <Button onClick={resetTree} size="sm" variant="outline">
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">Binary Tree Structure</h3>
          <p className="text-sm text-muted-foreground">
            Complete binary tree built level by level (left to right)
          </p>
          <Badge variant="outline">Nodes: {treeValues.length}</Badge>
        </div>

        <div
          className="border rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20"
          style={{ height: height }}
        >
          {treeData && treeData.name && (
            <div className="w-full h-full flex items-center justify-center">
              <svg width="100%" height="100%" viewBox="0 0 800 400">
                {renderTreeNode(treeData, 400, 50, 150, 0)}
              </svg>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTreeNode = (
    node: any,
    x: number,
    y: number,
    xOffset: number,
    level: number
  ): React.ReactElement[] => {
    if (!node) return [];

    const elements: React.ReactElement[] = [];
    const nodeId = `node-${node.name}-${x}-${y}`;

    elements.push(
      <g key={nodeId}>
        <circle
          cx={x}
          cy={y}
          r="20"
          fill="#3b82f6"
          stroke="#1e40af"
          strokeWidth="2"
          className="cursor-pointer transition-all duration-300 hover:fill-blue-400"
        />
        <text
          x={x}
          y={y + 5}
          textAnchor="middle"
          fill="white"
          fontSize="14"
          fontWeight="bold"
        >
          {node.name}
        </text>
      </g>
    );

    if (node.children) {
      const childYOffset = 80;
      const newXOffset = Math.max(50, xOffset * 0.6);

      node.children.forEach((child: any, index: number) => {
        if (child) {
          const childX = index === 0 ? x - newXOffset : x + newXOffset;
          const childY = y + childYOffset;

          elements.push(
            <line
              key={`edge-${nodeId}-${index}`}
              x1={x}
              y1={y + 20}
              x2={childX}
              y2={childY - 20}
              stroke="#64748b"
              strokeWidth="2"
              className="transition-all duration-300"
            />
          );

          elements.push(
            ...renderTreeNode(child, childX, childY, newXOffset, level + 1)
          );
        }
      });
    }

    return elements;
  };

  const renderTrie = () => {
    const trieNodes = data as TrieNode[];

    const insertWord = () => {
      if (inputValue.trim()) {
        const word = inputValue.toLowerCase();
        const newNodes = [...trieNodes];

        let currentId = "root";

        for (let i = 0; i < word.length; i++) {
          const char = word[i];
          let currentNode = newNodes.find((n) => n.id === currentId);

          if (!currentNode) {
            currentNode = {
              char: currentId === "root" ? "" : "",
              id: currentId,
              isEndOfWord: false,
              children: {},
              highlight: false,
            };
            newNodes.push(currentNode);
          }

          const childId = `${currentId}_${char}`;

          if (!currentNode.children[char]) {
            currentNode.children[char] = childId;

            const childNode: TrieNode = {
              char,
              id: childId,
              isEndOfWord: i === word.length - 1,
              children: {},
              highlight: true,
            };

            newNodes.push(childNode);
          } else if (i === word.length - 1) {
            const existingChild = newNodes.find((n) => n.id === childId);
            if (existingChild) {
              existingChild.isEndOfWord = true;
              existingChild.highlight = true;
            }
          }

          currentId = childId;
        }

        setData(newNodes);
        setInputValue("");

        setTimeout(() => {
          setData((prev) =>
            prev.map((item) => ({ ...item, highlight: false }))
          );
        }, 1500);
      }
    };

    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Enter word"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-32"
            onKeyPress={(e) => e.key === "Enter" && insertWord()}
          />
          <Button onClick={insertWord} size="sm">
            Insert Word
          </Button>
        </div>

        <div className="grid gap-2 max-h-64 overflow-y-auto">
          {trieNodes
            .filter((node) => node.id !== "root")
            .map((node) => (
              <div
                key={node.id}
                className={cn(
                  "flex items-center gap-2 p-2 border rounded transition-all duration-300",
                  node.highlight
                    ? "bg-green-200 border-green-500"
                    : node.isEndOfWord
                    ? "bg-blue-100 border-blue-300"
                    : "bg-gray-100 border-gray-300"
                )}
              >
                <span className="font-mono font-bold">{node.char}</span>
                {node.isEndOfWord && (
                  <Badge variant="secondary" className="text-xs">
                    Word End
                  </Badge>
                )}
              </div>
            ))}
        </div>

        <Badge variant="outline">
          Words: {trieNodes.filter((n) => n.isEndOfWord).length}
        </Badge>
      </div>
    );
  };

  const renderHashFunction = () => {
    const [inputValue, setInputValue] = useState("");
    const [hashResults, setHashResults] = useState<
      Array<{ input: string; hash: number; bucket: number }>
    >([]);
    const bucketCount = 7;

    const simpleHash = (str: string): number => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = (hash * 31 + str.charCodeAt(i)) % 1000000007;
      }
      return Math.abs(hash);
    };

    const addToHash = () => {
      if (!inputValue.trim()) return;
      const hash = simpleHash(inputValue);
      const bucket = hash % bucketCount;
      setHashResults((prev) => [
        ...prev.slice(-9),
        {
          input: inputValue,
          hash,
          bucket,
        },
      ]);
      setInputValue("");
    };

    return (
      <div className="p-4 space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter string to hash"
            className="flex-1 px-3 py-2 border rounded-md"
            onKeyPress={(e) => e.key === "Enter" && addToHash()}
          />
          <button
            onClick={addToHash}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Hash
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: bucketCount }, (_, i) => (
            <div key={i} className="border rounded-md p-2 min-h-[100px]">
              <div className="text-center font-bold mb-2">Bucket {i}</div>
              <div className="space-y-1">
                {hashResults
                  .filter((result) => result.bucket === i)
                  .map((result, idx) => (
                    <div key={idx} className="text-xs bg-gray-100 p-1 rounded">
                      {result.input}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {hashResults.length > 0 && (
          <div className="mt-4">
            <h3 className="font-bold mb-2">Hash Results:</h3>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {hashResults.slice(-5).map((result, idx) => (
                <div key={idx} className="text-sm bg-gray-50 p-2 rounded">
                  "{result.input}" → hash: {result.hash} → bucket:{" "}
                  {result.bucket}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderBloomFilter = () => {
    const [inputValue, setInputValue] = useState("");
    const [checkValue, setCheckValue] = useState("");
    const [bitArray, setBitArray] = useState<boolean[]>(
      new Array(20).fill(false)
    );
    const [addedItems, setAddedItems] = useState<string[]>([]);
    const [checkResult, setCheckResult] = useState<{
      item: string;
      result: string;
    } | null>(null);

    const hash1 = (str: string): number => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = (hash * 31 + str.charCodeAt(i)) % 97;
      }
      return Math.abs(hash) % 20;
    };

    const hash2 = (str: string): number => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = (hash * 37 + str.charCodeAt(i)) % 101;
      }
      return Math.abs(hash) % 20;
    };

    const addItem = () => {
      if (!inputValue.trim()) return;
      const pos1 = hash1(inputValue);
      const pos2 = hash2(inputValue);

      setBitArray((prev) => {
        const newArray = [...prev];
        newArray[pos1] = true;
        newArray[pos2] = true;
        return newArray;
      });

      setAddedItems((prev) => [...prev, inputValue]);
      setInputValue("");
    };

    const checkItem = () => {
      if (!checkValue.trim()) return;
      const pos1 = hash1(checkValue);
      const pos2 = hash2(checkValue);

      const mightExist = bitArray[pos1] && bitArray[pos2];
      const actuallyExists = addedItems.includes(checkValue);

      let result = "";
      if (mightExist && actuallyExists) {
        result = "Definitely exists";
      } else if (mightExist && !actuallyExists) {
        result = "False positive - might exist but actually doesn't";
      } else {
        result = "Definitely does not exist";
      }

      setCheckResult({ item: checkValue, result });
      setCheckValue("");
    };

    return (
      <div className="p-4 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-2">Add Item</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Item to add"
                className="flex-1 px-3 py-2 border rounded-md"
                onKeyPress={(e) => e.key === "Enter" && addItem()}
              />
              <button
                onClick={addItem}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Add
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Check Item</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={checkValue}
                onChange={(e) => setCheckValue(e.target.value)}
                placeholder="Item to check"
                className="flex-1 px-3 py-2 border rounded-md"
                onKeyPress={(e) => e.key === "Enter" && checkItem()}
              />
              <button
                onClick={checkItem}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Check
              </button>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold mb-2">Bit Array (size: 20)</h3>
          <div className="grid grid-cols-20 gap-1">
            {bitArray.map((bit, idx) => (
              <div
                key={idx}
                className={`w-8 h-8 border rounded flex items-center justify-center text-xs ${
                  bit ? "bg-red-500 text-white" : "bg-gray-100"
                }`}
              >
                {idx}
              </div>
            ))}
          </div>
        </div>

        {checkResult && (
          <div className="bg-blue-50 p-3 rounded-md">
            <strong>Check result for "{checkResult.item}":</strong>{" "}
            {checkResult.result}
          </div>
        )}

        <div>
          <h3 className="font-bold mb-2">Added Items: {addedItems.length}</h3>
          <div className="flex flex-wrap gap-1">
            {addedItems.map((item, idx) => (
              <span
                key={idx}
                className="bg-green-100 px-2 py-1 rounded text-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderUnionFind = () => {
    const [nodes] = useState(Array.from({ length: 10 }, (_, i) => i));
    const [parent, setParent] = useState<number[]>(
      Array.from({ length: 10 }, (_, i) => i)
    );
    const [rank, setRank] = useState<number[]>(new Array(10).fill(0));
    const [node1, setNode1] = useState("");
    const [node2, setNode2] = useState("");
    const [findNode, setFindNode] = useState("");
    const [findResult, setFindResult] = useState<{
      node: number;
      root: number;
    } | null>(null);

    const find = (x: number): number => {
      if (parent[x] !== x) {
        const root = find(parent[x]);
        setParent((prev) => {
          const newParent = [...prev];
          newParent[x] = root;
          return newParent;
        });
        return root;
      }
      return x;
    };

    const union = () => {
      const n1 = parseInt(node1);
      const n2 = parseInt(node2);
      if (isNaN(n1) || isNaN(n2) || n1 < 0 || n1 >= 10 || n2 < 0 || n2 >= 10)
        return;

      const root1 = find(n1);
      const root2 = find(n2);

      if (root1 !== root2) {
        setRank((prevRank) => {
          const newRank = [...prevRank];

          setParent((prev) => {
            const newParent = [...prev];

            if (newRank[root1] < newRank[root2]) {
              newParent[root1] = root2;
            } else if (newRank[root1] > newRank[root2]) {
              newParent[root2] = root1;
            } else {
              newParent[root2] = root1;
              newRank[root1]++;
            }

            return newParent;
          });

          return newRank;
        });
      }

      setNode1("");
      setNode2("");
    };

    const findRoot = () => {
      const node = parseInt(findNode);
      if (isNaN(node) || node < 0 || node >= 10) return;

      const root = find(node);
      setFindResult({ node, root });
      setFindNode("");
    };

    const reset = () => {
      setParent(Array.from({ length: 10 }, (_, i) => i));
      setRank(new Array(10).fill(0));
      setFindResult(null);
    };

    const getComponentColor = (node: number) => {
      const root = find(node);
      const colors = [
        "bg-red-200",
        "bg-blue-200",
        "bg-green-200",
        "bg-yellow-200",
        "bg-purple-200",
        "bg-pink-200",
        "bg-indigo-200",
        "bg-orange-200",
        "bg-teal-200",
        "bg-cyan-200",
      ];
      return colors[root % colors.length];
    };

    return (
      <div className="p-4 space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-bold mb-2">
              Union Operation
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={node1}
                onChange={(e) => setNode1(e.target.value)}
                placeholder="Node 1"
                min="0"
                max="9"
                className="w-20 px-2 py-1 border rounded"
              />
              <input
                type="number"
                value={node2}
                onChange={(e) => setNode2(e.target.value)}
                placeholder="Node 2"
                min="0"
                max="9"
                className="w-20 px-2 py-1 border rounded"
              />
              <button
                onClick={union}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Union
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">
              Find Operation
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={findNode}
                onChange={(e) => setFindNode(e.target.value)}
                placeholder="Node"
                min="0"
                max="9"
                className="w-20 px-2 py-1 border rounded"
              />
              <button
                onClick={findRoot}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Find
              </button>
            </div>
          </div>

          <div>
            <button
              onClick={reset}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Reset
            </button>
          </div>
        </div>

        <div>
          <h3 className="font-bold mb-2">Nodes (colored by component)</h3>
          <div className="grid grid-cols-10 gap-2">
            {nodes.map((node) => (
              <div
                key={node}
                className={`w-12 h-12 border-2 border-gray-400 rounded-full flex items-center justify-center font-bold ${getComponentColor(
                  node
                )}`}
              >
                {node}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold mb-2">Parent Array</h3>
          <div className="grid grid-cols-10 gap-1">
            {parent.map((p, idx) => (
              <div key={idx} className="text-center">
                <div className="text-xs text-gray-600">Node {idx}</div>
                <div className="bg-gray-100 border rounded px-2 py-1 text-sm">
                  → {p}
                </div>
              </div>
            ))}
          </div>
        </div>

        {findResult && (
          <div className="bg-blue-50 p-3 rounded-md">
            <strong>Find result:</strong> Node {findResult.node} belongs to
            component with root {findResult.root}
          </div>
        )}
      </div>
    );
  };

  const renderSegmentTree = () => {
    const [array, setArray] = useState([1, 3, 5, 7, 9, 11]);
    const [segTree, setSegTree] = useState<number[]>([]);
    const [queryLeft, setQueryLeft] = useState("");
    const [queryRight, setQueryRight] = useState("");
    const [queryResult, setQueryResult] = useState<{
      left: number;
      right: number;
      sum: number;
    } | null>(null);

    useEffect(() => {
      buildSegmentTree();
    }, [array]);

    const buildSegmentTree = () => {
      const n = array.length;
      const tree = new Array(4 * n).fill(0);

      const build = (node: number, start: number, end: number) => {
        if (start === end) {
          tree[node] = array[start];
        } else {
          const mid = Math.floor((start + end) / 2);
          build(2 * node, start, mid);
          build(2 * node + 1, mid + 1, end);
          tree[node] = tree[2 * node] + tree[2 * node + 1];
        }
      };

      if (n > 0) {
        build(1, 0, n - 1);
      }
      setSegTree(tree);
    };

    const querySum = (
      node: number,
      start: number,
      end: number,
      l: number,
      r: number
    ): number => {
      if (r < start || end < l) return 0;
      if (l <= start && end <= r) return segTree[node];

      const mid = Math.floor((start + end) / 2);
      return (
        querySum(2 * node, start, mid, l, r) +
        querySum(2 * node + 1, mid + 1, end, l, r)
      );
    };

    const handleQuery = () => {
      const left = parseInt(queryLeft);
      const right = parseInt(queryRight);
      if (
        isNaN(left) ||
        isNaN(right) ||
        left < 0 ||
        right >= array.length ||
        left > right
      )
        return;

      const sum = querySum(1, 0, array.length - 1, left, right);
      setQueryResult({ left, right, sum });
    };

    const updateArray = (index: number, value: number) => {
      setArray((prev) => {
        const newArray = [...prev];
        newArray[index] = value;
        return newArray;
      });
    };

    return (
      <div className="p-4 space-y-4">
        <div>
          <h3 className="font-bold mb-2">Array</h3>
          <div className="grid grid-cols-6 gap-2">
            {array.map((val, idx) => (
              <div key={idx} className="text-center">
                <div className="text-xs text-gray-600">Index {idx}</div>
                <input
                  type="number"
                  value={val}
                  onChange={(e) =>
                    updateArray(idx, parseInt(e.target.value) || 0)
                  }
                  className="w-full px-2 py-1 border rounded text-center"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-2">
              Range Sum Query
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={queryLeft}
                onChange={(e) => setQueryLeft(e.target.value)}
                placeholder="Left"
                min="0"
                max={array.length - 1}
                className="w-20 px-2 py-1 border rounded"
              />
              <input
                type="number"
                value={queryRight}
                onChange={(e) => setQueryRight(e.target.value)}
                placeholder="Right"
                min="0"
                max={array.length - 1}
                className="w-20 px-2 py-1 border rounded"
              />
              <button
                onClick={handleQuery}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Query
              </button>
            </div>
          </div>
        </div>

        {queryResult && (
          <div className="bg-blue-50 p-3 rounded-md">
            <strong>Range Sum Query:</strong> Sum of elements from index{" "}
            {queryResult.left} to {queryResult.right} = {queryResult.sum}
          </div>
        )}

        <div>
          <h3 className="font-bold mb-2">
            Segment Tree Structure (first few nodes)
          </h3>
          <div className="grid grid-cols-8 gap-1">
            {segTree.slice(1, 9).map((val, idx) => (
              <div
                key={idx}
                className="bg-gray-100 border rounded px-2 py-1 text-center text-sm"
              >
                <div className="text-xs text-gray-600">Node {idx + 1}</div>
                <div>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderFenwickTree = () => {
    const [array, setArray] = useState([1, 3, 5, 7, 9, 11]);
    const [fenwickTree, setFenwickTree] = useState<number[]>([]);
    const [queryIndex, setQueryIndex] = useState("");
    const [updateIndex, setUpdateIndex] = useState("");
    const [updateValue, setUpdateValue] = useState("");
    const [queryResult, setQueryResult] = useState<{
      index: number;
      prefixSum: number;
    } | null>(null);

    useEffect(() => {
      buildFenwickTree();
    }, [array]);

    const buildFenwickTree = () => {
      const n = array.length;
      const tree = new Array(n + 1).fill(0);

      for (let i = 0; i < n; i++) {
        updateFenwick(tree, i + 1, array[i], n);
      }

      setFenwickTree(tree);
    };

    const updateFenwick = (
      tree: number[],
      index: number,
      value: number,
      n: number
    ) => {
      while (index <= n) {
        tree[index] += value;
        index += index & -index;
      }
    };

    const queryFenwick = (tree: number[], index: number): number => {
      let sum = 0;
      while (index > 0) {
        sum += tree[index];
        index -= index & -index;
      }
      return sum;
    };

    const handleQuery = () => {
      const index = parseInt(queryIndex);
      if (isNaN(index) || index < 0 || index >= array.length) return;

      const prefixSum = queryFenwick(fenwickTree, index + 1);
      setQueryResult({ index, prefixSum });
    };

    const handleUpdate = () => {
      const index = parseInt(updateIndex);
      const value = parseInt(updateValue);
      if (isNaN(index) || isNaN(value) || index < 0 || index >= array.length)
        return;

      const oldValue = array[index];
      const diff = value - oldValue;

      setArray((prev) => {
        const newArray = [...prev];
        newArray[index] = value;
        return newArray;
      });

      setFenwickTree((prev) => {
        const newTree = [...prev];
        updateFenwick(newTree, index + 1, diff, array.length);
        return newTree;
      });

      setUpdateIndex("");
      setUpdateValue("");
    };

    return (
      <div className="p-4 space-y-4">
        <div>
          <h3 className="font-bold mb-2">Array</h3>
          <div className="grid grid-cols-6 gap-2">
            {array.map((val, idx) => (
              <div key={idx} className="text-center">
                <div className="text-xs text-gray-600">Index {idx}</div>
                <div className="bg-gray-100 border rounded px-2 py-1">
                  {val}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-2">
              Prefix Sum Query
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={queryIndex}
                onChange={(e) => setQueryIndex(e.target.value)}
                placeholder="Index"
                min="0"
                max={array.length - 1}
                className="w-20 px-2 py-1 border rounded"
              />
              <button
                onClick={handleQuery}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Query
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Update Value</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={updateIndex}
                onChange={(e) => setUpdateIndex(e.target.value)}
                placeholder="Index"
                min="0"
                max={array.length - 1}
                className="w-20 px-2 py-1 border rounded"
              />
              <input
                type="number"
                value={updateValue}
                onChange={(e) => setUpdateValue(e.target.value)}
                placeholder="New Value"
                className="w-24 px-2 py-1 border rounded"
              />
              <button
                onClick={handleUpdate}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Update
              </button>
            </div>
          </div>
        </div>

        {queryResult && (
          <div className="bg-blue-50 p-3 rounded-md">
            <strong>Prefix Sum Query:</strong> Sum of elements from index 0 to{" "}
            {queryResult.index} = {queryResult.prefixSum}
          </div>
        )}

        <div>
          <h3 className="font-bold mb-2">Fenwick Tree (Binary Indexed Tree)</h3>
          <div className="grid grid-cols-7 gap-1">
            {fenwickTree.map((val, idx) => (
              <div
                key={idx}
                className="bg-gray-100 border rounded px-2 py-1 text-center text-sm"
              >
                <div className="text-xs text-gray-600">Index {idx}</div>
                <div>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderBTree = () => (
    <div className="p-4 space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-bold mb-4">B-Tree Structure</h3>
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="text-gray-600 mb-4">
            B-Tree visualization - ideal for database indexing
          </div>
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="bg-blue-200 border-2 border-blue-400 px-4 py-2 rounded">
                [10, 20, 30]
              </div>
            </div>
            <div className="flex justify-center space-x-8">
              <div className="bg-green-200 border-2 border-green-400 px-3 py-2 rounded text-sm">
                [5, 8]
              </div>
              <div className="bg-green-200 border-2 border-green-400 px-3 py-2 rounded text-sm">
                [15, 18]
              </div>
              <div className="bg-green-200 border-2 border-green-400 px-3 py-2 rounded text-sm">
                [25, 28]
              </div>
              <div className="bg-green-200 border-2 border-green-400 px-3 py-2 rounded text-sm">
                [35, 38]
              </div>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            B-Trees maintain sorted data and allow searches, insertions, and
            deletions in O(log n) time. They are widely used in databases and
            file systems for efficient disk access.
          </div>
        </div>
      </div>
    </div>
  );

  const renderSkipList = () => {
    const [values, setValues] = useState([3, 6, 7, 9, 12, 17, 19, 21, 25]);
    const [searchValue, setSearchValue] = useState("");
    const [searchPath, setSearchPath] = useState<number[]>([]);

    const simulateSearch = () => {
      const target = parseInt(searchValue);
      if (isNaN(target)) return;

      const path: number[] = [];
      let current = 0;

      for (let level = 3; level >= 0; level--) {
        while (current < values.length && values[current] < target) {
          path.push(current);
          current = Math.min(current + Math.pow(2, level), values.length - 1);
        }
        if (current < values.length && values[current] === target) {
          path.push(current);
          break;
        }
      }

      setSearchPath(path);
    };

    return (
      <div className="p-4 space-y-4">
        <div className="flex gap-2 items-center">
          <input
            type="number"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search value"
            className="px-3 py-2 border rounded-md"
            onKeyPress={(e) => e.key === "Enter" && simulateSearch()}
          />
          <button
            onClick={simulateSearch}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Search
          </button>
        </div>

        <div>
          <h3 className="font-bold mb-2">Skip List Structure</h3>
          <div className="space-y-2">
            {[3, 2, 1, 0].map((level) => (
              <div key={level} className="flex items-center space-x-2">
                <div className="w-16 text-sm text-gray-600">Level {level}:</div>
                <div className="flex space-x-1">
                  {values.map((val, idx) => {
                    const shouldShow =
                      level === 0 ||
                      (level === 1 && idx % 2 === 0) ||
                      (level === 2 && idx % 4 === 0) ||
                      (level === 3 && idx % 8 === 0);
                    const isInPath = searchPath.includes(idx);

                    return shouldShow ? (
                      <div
                        key={idx}
                        className={`w-8 h-8 border rounded flex items-center justify-center text-xs ${
                          isInPath
                            ? "bg-yellow-200 border-yellow-400"
                            : "bg-gray-100 border-gray-300"
                        }`}
                      >
                        {val}
                      </div>
                    ) : (
                      <div key={idx} className="w-8 h-8"></div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {searchPath.length > 0 && (
          <div className="bg-yellow-50 p-3 rounded-md">
            <strong>Search path:</strong> Visited indices{" "}
            {searchPath.join(" → ")}
          </div>
        )}

        <div className="text-sm text-gray-600">
          Skip lists provide O(log n) search time by maintaining multiple levels
          of linked lists. Higher levels skip more elements, enabling faster
          traversal.
        </div>
      </div>
    );
  };

  const renderDynamicHashTable = () => {
    const [inputValue, setInputValue] = useState("");
    const [buckets, setBuckets] = useState<{ key: string; value: string }[][]>(
      Array(4)
        .fill(null)
        .map(() => [])
    );
    const [loadFactor, setLoadFactor] = useState(0);
    const [tableSize, setTableSize] = useState(4);
    const [itemCount, setItemCount] = useState(0);
    const [isRehashing, setIsRehashing] = useState(false);

    const hash = (key: string, size: number): number => {
      let hash = 0;
      for (let i = 0; i < key.length; i++) {
        hash = (hash * 31 + key.charCodeAt(i)) % 1000;
      }
      return Math.abs(hash) % size;
    };

    const calculateLoadFactor = () => itemCount / tableSize;

    const rehash = (
      oldBuckets: { key: string; value: string }[][],
      newSize: number
    ) => {
      const newBuckets: { key: string; value: string }[][] = Array(newSize)
        .fill(null)
        .map(() => []);
      let count = 0;

      oldBuckets.forEach((bucket) => {
        bucket.forEach((item) => {
          const newIndex = hash(item.key, newSize);
          newBuckets[newIndex].push(item);
          count++;
        });
      });

      return { newBuckets, count };
    };

    const addItem = () => {
      if (!inputValue.trim()) return;

      const [key, value] = inputValue.includes("=")
        ? inputValue.split("=").map((s) => s.trim())
        : [inputValue.trim(), inputValue.trim()];

      if (!key) return;

      const index = hash(key, tableSize);

      setBuckets((prev) => {
        const newBuckets = prev.map((bucket) => [...bucket]);
        const existingIndex = newBuckets[index].findIndex(
          (item) => item.key === key
        );

        if (existingIndex >= 0) {
          newBuckets[index][existingIndex] = { key, value };
        } else {
          newBuckets[index].push({ key, value });
          setItemCount((prevCount) => prevCount + 1);
        }

        return newBuckets;
      });

      setInputValue("");

      setTimeout(() => {
        const newLoadFactor = calculateLoadFactor();
        setLoadFactor(newLoadFactor);

        if (newLoadFactor > 0.75) {
          setIsRehashing(true);
          setTimeout(() => {
            const newSize = tableSize * 2;
            setBuckets((prev) => {
              const { newBuckets } = rehash(prev, newSize);
              setTableSize(newSize);
              setLoadFactor(itemCount / newSize);
              setIsRehashing(false);
              return newBuckets;
            });
          }, 1000);
        }
      }, 100);
    };

    const reset = () => {
      setBuckets(
        Array(4)
          .fill(null)
          .map(() => [])
      );
      setTableSize(4);
      setItemCount(0);
      setLoadFactor(0);
      setIsRehashing(false);
    };

    useEffect(() => {
      setLoadFactor(calculateLoadFactor());
    }, [itemCount, tableSize]);

    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="key=value or just key"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-48"
            onKeyPress={(e) => e.key === "Enter" && addItem()}
          />
          <Button onClick={addItem} size="sm" disabled={isRehashing}>
            Add Item
          </Button>
          <Button onClick={reset} size="sm" variant="outline">
            Reset
          </Button>
        </div>

        <div className="flex gap-4 mb-4">
          <Badge variant={loadFactor > 0.75 ? "destructive" : "outline"}>
            Load Factor: {loadFactor.toFixed(2)}
          </Badge>
          <Badge variant="outline">Size: {tableSize}</Badge>
          <Badge variant="outline">Items: {itemCount}</Badge>
          {isRehashing && (
            <Badge variant="secondary" className="animate-pulse">
              Rehashing...
            </Badge>
          )}
        </div>

        <div
          className={cn(
            "grid gap-2",
            isRehashing && "opacity-50 scale-95 transition-all duration-1000"
          )}
        >
          {buckets.map((bucket, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 flex items-center justify-center rounded text-xs font-mono">
                {index}
              </div>
              <div className="flex-1 min-h-[40px] border-2 border-dashed border-gray-300 rounded p-2 flex flex-wrap gap-1">
                {bucket.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="bg-blue-100 border border-blue-300 rounded px-2 py-1 text-xs"
                  >
                    {item.key}
                    {item.value !== item.key && `=${item.value}`}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-sm text-gray-600 text-center max-w-md">
          Hash table automatically resizes when load factor exceeds 0.75
        </div>
      </div>
    );
  };

  const renderStructure = () => {
    switch (structure) {
      case "stack":
        return renderStack();
      case "queue":
        return renderQueue();
      case "hash-table":
        return renderHashTable();
      case "graph":
        return renderGraph();
      case "heap":
        return renderHeap();
      case "array":
        return renderArray();
      case "dynamic-array":
        return renderDynamicArray();
      case "linked-list":
        return renderLinkedList();
      case "binary-tree":
      case "bst":
      case "avl-tree":
      case "red-black-tree":
        return renderBinaryTree();
      case "trie":
        return renderTrie();
      case "hash-function":
        return renderHashFunction();
      case "dynamic-hash-table":
        return renderDynamicHashTable();
      case "bloom-filter":
        return renderBloomFilter();
      case "union-find":
        return renderUnionFind();
      case "segment-tree":
        return renderSegmentTree();
      case "fenwick-tree":
        return renderFenwickTree();
      case "b-tree":
        return renderBTree();
      case "skip-list":
        return renderSkipList();
      case "dynamic-hash-table":
        return renderDynamicHashTable();
      default:
        return (
          <div className="text-center text-muted-foreground">
            Structure visualization coming soon!
          </div>
        );
    }
  };

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
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={resetVisualization}>
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        <div
          style={{ height: `${height}px` }}
          className="flex items-center justify-center"
        >
          {renderStructure()}
        </div>
      </CardContent>
    </Card>
  );
}

export function StackVisualizerDemo({ className }: { className?: string }) {
  return (
    <DataStructureVisualizer
      title="Stack Data Structure"
      description="Interactive stack visualization with push/pop operations (LIFO)"
      className={className}
      height={300}
      structure="stack"
      initialData={[
        { value: "First", id: "1" },
        { value: "Second", id: "2" },
        { value: "Third", id: "3" },
      ]}
    />
  );
}

export function QueueVisualizerDemo({ className }: { className?: string }) {
  return (
    <DataStructureVisualizer
      title="Queue Data Structure"
      description="Interactive queue visualization with enqueue/dequeue operations (FIFO)"
      className={className}
      height={300}
      structure="queue"
      initialData={[
        { value: "1st", id: "1" },
        { value: "2nd", id: "2" },
        { value: "3rd", id: "3" },
      ]}
    />
  );
}

export function HashTableVisualizerDemo({ className }: { className?: string }) {
  return (
    <DataStructureVisualizer
      title="Hash Table Data Structure"
      description="Interactive hash table with collision handling visualization"
      className={className}
      height={400}
      structure="hash-table"
      initialData={[
        { key: "name", value: "John", hash: 2 },
        { key: "age", value: "25", hash: 5 },
        { key: "city", value: "NYC", hash: 1 },
      ]}
    />
  );
}

export function GraphVisualizerDemo({ className }: { className?: string }) {
  return (
    <DataStructureVisualizer
      title="Graph Data Structure"
      description="Interactive graph visualization for traversal algorithms"
      className={className}
      height={450}
      structure="graph"
      initialData={[]}
    />
  );
}
