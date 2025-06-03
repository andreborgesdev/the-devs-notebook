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
  structure: "stack" | "queue" | "hash-table" | "graph" | "heap";
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
  const intervalRef = useRef<NodeJS.Timeout>();

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
      default:
        return <div>Structure not implemented</div>;
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
