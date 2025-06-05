"use client";

import React, { useState, useEffect, useCallback } from "react";
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
import { FiniteStateMachineVisualizer } from "./advanced-cs-visualizers";
import { Slider } from "@/src/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { cn } from "@/src/lib/utils";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Cpu,
  Clock,
  Database,
  Network,
  Shield,
  Zap,
  Brain,
  Monitor,
  HardDrive,
} from "lucide-react";

interface AlgorithmStep {
  step: number;
  description: string;
  data: any;
  highlight?: number[];
  comparing?: number[];
  swapping?: number[];
}

export function BigOComplexityVisualizer() {
  const [inputSize, setInputSize] = useState([10]);
  const [selectedComplexities, setSelectedComplexities] = useState([
    "O(1)",
    "O(n)",
    "O(n²)",
  ]);

  const complexities = {
    "O(1)": (n: number) => 1,
    "O(log n)": (n: number) => Math.log2(n),
    "O(n)": (n: number) => n,
    "O(n log n)": (n: number) => n * Math.log2(n),
    "O(n²)": (n: number) => n * n,
    "O(2^n)": (n: number) => Math.pow(2, Math.min(n, 20)),
  };

  const colors = {
    "O(1)": "bg-green-500",
    "O(log n)": "bg-blue-500",
    "O(n)": "bg-yellow-500",
    "O(n log n)": "bg-orange-500",
    "O(n²)": "bg-red-500",
    "O(2^n)": "bg-purple-500",
  };

  const maxValue = Math.max(
    ...selectedComplexities.map((comp) =>
      complexities[comp as keyof typeof complexities](inputSize[0])
    )
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Big O Complexity Visualizer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Input Size: {inputSize[0]}
          </label>
          <Slider
            value={inputSize}
            onValueChange={setInputSize}
            max={50}
            min={1}
            step={1}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Select Complexities:</label>
          <div className="flex flex-wrap gap-2">
            {Object.keys(complexities).map((complexity) => (
              <Button
                key={complexity}
                variant={
                  selectedComplexities.includes(complexity)
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() => {
                  setSelectedComplexities((prev) =>
                    prev.includes(complexity)
                      ? prev.filter((c) => c !== complexity)
                      : [...prev, complexity]
                  );
                }}
              >
                {complexity}
              </Button>
            ))}
          </div>
        </div>

        <div className="h-64 bg-gray-50 rounded-lg p-4 relative">
          <div className="flex items-end justify-center gap-4 h-full">
            {selectedComplexities.map((complexity) => {
              const value = complexities[
                complexity as keyof typeof complexities
              ](inputSize[0]);
              const height = (value / maxValue) * 100;

              return (
                <div
                  key={complexity}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="text-xs text-center min-w-16">
                    <div className="font-bold">{Math.round(value)}</div>
                    <div className="text-gray-600">operations</div>
                  </div>
                  <div
                    className={cn(
                      "w-12 rounded-t transition-all duration-500",
                      colors[complexity as keyof typeof colors]
                    )}
                    style={{ height: `${Math.max(height, 2)}%` }}
                  />
                  <div className="text-xs font-medium text-center">
                    {complexity}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-sm text-gray-600 space-y-1">
          <div>
            <strong>Green:</strong> Excellent performance
          </div>
          <div>
            <strong>Yellow/Orange:</strong> Good for most cases
          </div>
          <div>
            <strong>Red/Purple:</strong> Avoid for large inputs
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function MemoryHierarchyVisualizer() {
  const [accessingLevel, setAccessingLevel] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const memoryLevels = [
    {
      name: "CPU Registers",
      size: "1KB",
      speed: "1 cycle",
      color: "bg-green-500",
    },
    { name: "L1 Cache", size: "32KB", speed: "3 cycles", color: "bg-blue-500" },
    {
      name: "L2 Cache",
      size: "256KB",
      speed: "10 cycles",
      color: "bg-yellow-500",
    },
    {
      name: "L3 Cache",
      size: "8MB",
      speed: "40 cycles",
      color: "bg-orange-500",
    },
    { name: "RAM", size: "16GB", speed: "100 cycles", color: "bg-red-500" },
    { name: "SSD", size: "1TB", speed: "100k cycles", color: "bg-purple-500" },
    { name: "HDD", size: "2TB", speed: "500k cycles", color: "bg-gray-500" },
  ];

  const simulateAccess = async (level: number) => {
    setIsAnimating(true);
    setAccessingLevel(level);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setAccessingLevel(null);
    setIsAnimating(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HardDrive className="w-5 h-5" />
          Memory Hierarchy Interactive Demo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-4">
          <div className="text-sm text-gray-600">
            Click on any memory level to simulate data access
          </div>

          <div className="space-y-2">
            {memoryLevels.map((level, index) => (
              <div
                key={index}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all duration-500 cursor-pointer",
                  accessingLevel === index
                    ? "border-blue-500 scale-105 shadow-lg"
                    : "border-gray-200 hover:border-gray-300",
                  level.color,
                  "text-white"
                )}
                onClick={() => !isAnimating && simulateAccess(index)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{level.name}</div>
                    <div className="text-sm opacity-90">
                      Capacity: {level.size}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{level.speed}</div>
                    <div className="text-sm opacity-90">Access Time</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {accessingLevel !== null && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                <span className="text-blue-700">
                  Accessing {memoryLevels[accessingLevel].name}...
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function ProcessSchedulingVisualizer() {
  const [processes, setProcesses] = useState([
    {
      id: 1,
      name: "Process A",
      burstTime: 8,
      priority: 3,
      arrivalTime: 0,
      color: "bg-blue-500",
    },
    {
      id: 2,
      name: "Process B",
      burstTime: 4,
      priority: 1,
      arrivalTime: 1,
      color: "bg-green-500",
    },
    {
      id: 3,
      name: "Process C",
      burstTime: 9,
      priority: 2,
      arrivalTime: 2,
      color: "bg-red-500",
    },
    {
      id: 4,
      name: "Process D",
      burstTime: 5,
      priority: 4,
      arrivalTime: 3,
      color: "bg-yellow-500",
    },
  ]);

  const [algorithm, setAlgorithm] = useState("fcfs");
  const [currentTime, setCurrentTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [schedule, setSchedule] = useState<any[]>([]);

  const algorithms = {
    fcfs: "First Come First Serve",
    sjf: "Shortest Job First",
    priority: "Priority Scheduling",
    roundrobin: "Round Robin",
  };

  const generateSchedule = useCallback(() => {
    let newSchedule: any[] = [];
    let processQueue = [...processes].sort(
      (a, b) => a.arrivalTime - b.arrivalTime
    );
    let time = 0;

    switch (algorithm) {
      case "fcfs":
        processQueue.forEach((process) => {
          newSchedule.push({
            process: process.name,
            color: process.color,
            startTime: Math.max(time, process.arrivalTime),
            duration: process.burstTime,
          });
          time = Math.max(time, process.arrivalTime) + process.burstTime;
        });
        break;

      case "sjf":
        while (processQueue.length > 0) {
          const available = processQueue.filter((p) => p.arrivalTime <= time);
          if (available.length === 0) {
            time = processQueue[0].arrivalTime;
            continue;
          }

          const shortest = available.reduce((prev, curr) =>
            prev.burstTime < curr.burstTime ? prev : curr
          );

          newSchedule.push({
            process: shortest.name,
            color: shortest.color,
            startTime: time,
            duration: shortest.burstTime,
          });

          time += shortest.burstTime;
          processQueue = processQueue.filter((p) => p.id !== shortest.id);
        }
        break;

      case "priority":
        while (processQueue.length > 0) {
          const available = processQueue.filter((p) => p.arrivalTime <= time);
          if (available.length === 0) {
            time = processQueue[0].arrivalTime;
            continue;
          }

          const highest = available.reduce((prev, curr) =>
            prev.priority < curr.priority ? prev : curr
          );

          newSchedule.push({
            process: highest.name,
            color: highest.color,
            startTime: time,
            duration: highest.burstTime,
          });

          time += highest.burstTime;
          processQueue = processQueue.filter((p) => p.id !== highest.id);
        }
        break;
    }

    setSchedule(newSchedule);
  }, [processes, algorithm]);

  useEffect(() => {
    generateSchedule();
  }, [generateSchedule]);

  const startSimulation = () => {
    setIsRunning(true);
    setCurrentTime(0);

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        const maxTime = schedule.reduce(
          (max, item) => Math.max(max, item.startTime + item.duration),
          0
        );

        if (prev >= maxTime) {
          setIsRunning(false);
          clearInterval(interval);
          return maxTime;
        }

        return prev + 0.5;
      });
    }, 200);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setCurrentTime(0);
  };

  const maxTime = schedule.reduce(
    (max, item) => Math.max(max, item.startTime + item.duration),
    20
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cpu className="w-5 h-5" />
          CPU Process Scheduling Simulator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-4 items-center">
          <Select value={algorithm} onValueChange={setAlgorithm}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(algorithms).map(([key, name]) => (
                <SelectItem key={key} value={key}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button onClick={startSimulation} disabled={isRunning}>
              <Play className="w-4 h-4 mr-2" />
              Start
            </Button>
            <Button onClick={resetSimulation} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-sm font-medium">Process Queue:</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {processes.map((process) => (
              <div
                key={process.id}
                className={cn("p-2 rounded text-white text-xs", process.color)}
              >
                <div className="font-semibold">{process.name}</div>
                <div>Burst: {process.burstTime}ms</div>
                <div>Priority: {process.priority}</div>
                <div>Arrival: {process.arrivalTime}ms</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium">Timeline:</div>
            <div className="text-sm text-gray-600">
              Current Time: {currentTime.toFixed(1)}ms
            </div>
          </div>

          <div className="relative bg-gray-100 rounded-lg p-4 h-32">
            <div className="relative h-16 bg-white rounded border">
              {schedule.map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    "absolute h-full flex items-center justify-center text-white text-xs font-semibold",
                    item.color
                  )}
                  style={{
                    left: `${(item.startTime / maxTime) * 100}%`,
                    width: `${(item.duration / maxTime) * 100}%`,
                  }}
                >
                  {item.process}
                </div>
              ))}

              {isRunning && (
                <div
                  className="absolute top-0 bottom-0 w-1 bg-red-600 z-10"
                  style={{ left: `${(currentTime / maxTime) * 100}%` }}
                >
                  <div className="absolute -top-2 -left-2 w-4 h-4 bg-red-600 rounded-full"></div>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-2 text-xs text-gray-600">
              <span>0ms</span>
              <span>{maxTime}ms</span>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-600 space-y-1">
          <div>
            <strong>FCFS:</strong> Processes run in arrival order
          </div>
          <div>
            <strong>SJF:</strong> Shortest processes run first
          </div>
          <div>
            <strong>Priority:</strong> Higher priority processes run first
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function NetworkProtocolVisualizer() {
  const [selectedProtocol, setSelectedProtocol] = useState("tcp");
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [packets, setPackets] = useState<any[]>([]);
  const [step, setStep] = useState(0);

  const protocols = {
    tcp: {
      name: "TCP (Transmission Control Protocol)",
      steps: [
        "SYN: Client initiates connection",
        "SYN-ACK: Server acknowledges and sends SYN",
        "ACK: Client acknowledges, connection established",
        "Data Transfer: Reliable, ordered transmission",
        "FIN: Connection termination initiated",
      ],
      reliable: true,
      ordered: true,
      overhead: "High",
    },
    udp: {
      name: "UDP (User Datagram Protocol)",
      steps: [
        "Direct transmission without handshake",
        "Packet sent immediately",
        "No acknowledgment required",
        "No guarantee of delivery or order",
      ],
      reliable: false,
      ordered: false,
      overhead: "Low",
    },
  };

  const simulateTransmission = async () => {
    setIsTransmitting(true);
    setPackets([]);
    setStep(0);

    const currentProtocol =
      protocols[selectedProtocol as keyof typeof protocols];

    for (let i = 0; i < currentProtocol.steps.length; i++) {
      setStep(i);

      if (selectedProtocol === "tcp") {
        setPackets((prev) => [
          ...prev,
          {
            id: i,
            type: i < 3 ? "control" : i < 4 ? "data" : "control",
            status: "sending",
            message: currentProtocol.steps[i],
          },
        ]);

        await new Promise((resolve) => setTimeout(resolve, 1500));

        setPackets((prev) =>
          prev.map((p) => (p.id === i ? { ...p, status: "delivered" } : p))
        );
      } else {
        setPackets((prev) => [
          ...prev,
          {
            id: i,
            type: "data",
            status: Math.random() > 0.1 ? "delivered" : "lost",
            message: currentProtocol.steps[i],
          },
        ]);

        await new Promise((resolve) => setTimeout(resolve, 800));
      }
    }

    setIsTransmitting(false);
  };

  const resetSimulation = () => {
    setIsTransmitting(false);
    setPackets([]);
    setStep(0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="w-5 h-5" />
          Network Protocol Simulator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-4 items-center">
          <Select value={selectedProtocol} onValueChange={setSelectedProtocol}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(protocols).map(([key, protocol]) => (
                <SelectItem key={key} value={key}>
                  {protocol.name.split("(")[0].trim()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button onClick={simulateTransmission} disabled={isTransmitting}>
              <Play className="w-4 h-4 mr-2" />
              Simulate
            </Button>
            <Button onClick={resetSimulation} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Monitor className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">Client</span>
              </div>
              <div className="text-sm text-gray-600">Sender</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-5 h-5 text-green-600" />
                <span className="font-semibold">Server</span>
              </div>
              <div className="text-sm text-gray-600">Receiver</div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Transmission Log:</div>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {packets.map((packet, index) => (
              <div
                key={packet.id}
                className={cn(
                  "p-2 rounded text-sm flex items-center gap-2",
                  packet.status === "delivered"
                    ? "bg-green-100 text-green-800"
                    : packet.status === "sending"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-red-100 text-red-800"
                )}
              >
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    packet.status === "delivered"
                      ? "bg-green-500"
                      : packet.status === "sending"
                      ? "bg-blue-500 animate-pulse"
                      : "bg-red-500"
                  )}
                />
                <span>{packet.message}</span>
                {packet.status === "lost" && (
                  <Badge variant="destructive" className="ml-auto">
                    Lost
                  </Badge>
                )}
                {packet.status === "sending" && (
                  <Badge variant="default" className="ml-auto">
                    Sending...
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="font-semibold">Reliability</div>
            <Badge
              variant={
                protocols[selectedProtocol as keyof typeof protocols].reliable
                  ? "default"
                  : "destructive"
              }
            >
              {protocols[selectedProtocol as keyof typeof protocols].reliable
                ? "Yes"
                : "No"}
            </Badge>
          </div>
          <div className="text-center">
            <div className="font-semibold">Ordered</div>
            <Badge
              variant={
                protocols[selectedProtocol as keyof typeof protocols].ordered
                  ? "default"
                  : "destructive"
              }
            >
              {protocols[selectedProtocol as keyof typeof protocols].ordered
                ? "Yes"
                : "No"}
            </Badge>
          </div>
          <div className="text-center">
            <div className="font-semibold">Overhead</div>
            <Badge variant="outline">
              {protocols[selectedProtocol as keyof typeof protocols].overhead}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function CSInteractiveVisualizers() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Interactive Computer Science Visualizers
        </h1>
        <p className="text-lg text-muted-foreground">
          Truly interactive educational tools to understand core CS concepts
          through hands-on exploration.
        </p>

        <div className="flex flex-wrap gap-2 my-6">
          <Badge
            variant="secondary"
            className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
          >
            ⚡ Big O Complexity
          </Badge>
          <Badge
            variant="secondary"
            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
          >
            🧠 Memory Hierarchy
          </Badge>
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
          >
            ⚙️ Process Scheduling
          </Badge>
          <Badge
            variant="secondary"
            className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
          >
            🌐 Networking
          </Badge>
          <Badge
            variant="secondary"
            className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
          >
            🤖 Automata Theory
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="complexity" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5">
          <TabsTrigger value="complexity">Complexity</TabsTrigger>
          <TabsTrigger value="memory">Memory</TabsTrigger>
          <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
          <TabsTrigger value="networking">Networking</TabsTrigger>
          <TabsTrigger value="automata">Automata</TabsTrigger>
        </TabsList>

        <TabsContent value="complexity" className="mt-6">
          <BigOComplexityVisualizer />
        </TabsContent>

        <TabsContent value="memory" className="mt-6">
          <MemoryHierarchyVisualizer />
        </TabsContent>

        <TabsContent value="scheduling" className="mt-6">
          <ProcessSchedulingVisualizer />
        </TabsContent>

        <TabsContent value="networking" className="mt-6">
          <NetworkProtocolVisualizer />
        </TabsContent>

        <TabsContent value="automata" className="mt-6">
          <FiniteStateMachineVisualizer />
        </TabsContent>
      </Tabs>
    </div>
  );
}
