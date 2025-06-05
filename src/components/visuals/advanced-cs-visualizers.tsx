"use client";

import React, { useState, useEffect, useRef } from "react";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  Cpu,
  Database,
  Network,
  Code,
} from "lucide-react";

interface SortingStep {
  array: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
  step: string;
}

interface FSMState {
  name: string;
  x: number;
  y: number;
  isAccepting: boolean;
  isActive: boolean;
}

interface FSMTransition {
  from: string;
  to: string;
  label: string;
  isActive: boolean;
}

export const FiniteStateMachineVisualizer: React.FC = () => {
  const [states, setStates] = useState<FSMState[]>([
    { name: "q0", x: 100, y: 150, isAccepting: false, isActive: true },
    { name: "q1", x: 250, y: 100, isAccepting: false, isActive: false },
    { name: "q2", x: 250, y: 200, isAccepting: true, isActive: false },
  ]);

  const [transitions, setTransitions] = useState<FSMTransition[]>([
    { from: "q0", to: "q1", label: "a", isActive: false },
    { from: "q0", to: "q0", label: "b", isActive: false },
    { from: "q1", to: "q2", label: "b", isActive: false },
    { from: "q1", to: "q0", label: "a", isActive: false },
    { from: "q2", to: "q2", label: "a,b", isActive: false },
  ]);

  const [inputString, setInputString] = useState("abb");
  const [currentInput, setCurrentInput] = useState("");
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string>("");

  const processInput = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    setCurrentInput("");
    setCurrentPosition(0);
    setResult("");

    let currentState = "q0";
    const newStates = states.map((s) => ({
      ...s,
      isActive: s.name === currentState,
    }));
    setStates(newStates);

    for (let i = 0; i < inputString.length; i++) {
      const symbol = inputString[i];
      setCurrentInput(inputString.substring(0, i + 1));
      setCurrentPosition(i);

      const transition = transitions.find(
        (t) => t.from === currentState && t.label.includes(symbol)
      );

      if (transition) {
        setTransitions((prev) =>
          prev.map((t) => ({
            ...t,
            isActive:
              t.from === transition.from &&
              t.to === transition.to &&
              t.label === transition.label,
          }))
        );

        await new Promise((resolve) => setTimeout(resolve, 1000));

        currentState = transition.to;
        setStates((prev) =>
          prev.map((s) => ({ ...s, isActive: s.name === currentState }))
        );

        await new Promise((resolve) => setTimeout(resolve, 500));
      } else {
        setResult("❌ Rejected - No valid transition");
        setIsProcessing(false);
        return;
      }
    }

    const finalState = states.find((s) => s.name === currentState);
    if (finalState?.isAccepting) {
      setResult("✅ Accepted - Reached accepting state");
    } else {
      setResult("❌ Rejected - Not in accepting state");
    }

    setTransitions((prev) => prev.map((t) => ({ ...t, isActive: false })));
    setIsProcessing(false);
  };

  const reset = () => {
    setCurrentInput("");
    setCurrentPosition(0);
    setResult("");
    setIsProcessing(false);
    setStates((prev) => prev.map((s) => ({ ...s, isActive: s.name === "q0" })));
    setTransitions((prev) => prev.map((t) => ({ ...t, isActive: false })));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5" />
          Finite State Machine Visualizer
        </CardTitle>
        <CardDescription>
          Interactive FSM that accepts strings ending with "abb"
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4 items-center">
            <div className="space-y-2">
              <label className="text-sm font-medium">Input String:</label>
              <input
                type="text"
                value={inputString}
                onChange={(e) => setInputString(e.target.value)}
                className="px-3 py-2 border rounded-md"
                placeholder="Enter string (a, b)"
                disabled={isProcessing}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={processInput}
                disabled={isProcessing || !inputString}
              >
                {isProcessing ? "Processing..." : "Process Input"}
              </Button>
              <Button onClick={reset} variant="outline">
                Reset
              </Button>
            </div>
          </div>

          <div
            className="relative bg-muted rounded-lg p-4"
            style={{ height: "300px" }}
          >
            <svg width="100%" height="100%" className="absolute inset-0">
              {transitions.map((transition, index) => {
                const fromState = states.find(
                  (s) => s.name === transition.from
                )!;
                const toState = states.find((s) => s.name === transition.to)!;

                if (transition.from === transition.to) {
                  const cx = fromState.x + 20;
                  const cy = fromState.y - 30;
                  return (
                    <g key={index}>
                      <circle
                        cx={cx}
                        cy={cy}
                        r="15"
                        fill="none"
                        stroke={transition.isActive ? "#ef4444" : "#64748b"}
                        strokeWidth={transition.isActive ? "3" : "2"}
                      />
                      <text
                        x={cx}
                        y={cy - 20}
                        textAnchor="middle"
                        fontSize="12"
                        fill="#374151"
                      >
                        {transition.label}
                      </text>
                    </g>
                  );
                }

                return (
                  <g key={index}>
                    <line
                      x1={fromState.x + 20}
                      y1={fromState.y + 20}
                      x2={toState.x + 20}
                      y2={toState.y + 20}
                      stroke={transition.isActive ? "#ef4444" : "#64748b"}
                      strokeWidth={transition.isActive ? "3" : "2"}
                      markerEnd="url(#arrowhead)"
                    />
                    <text
                      x={(fromState.x + toState.x) / 2 + 20}
                      y={(fromState.y + toState.y) / 2 + 15}
                      textAnchor="middle"
                      fontSize="12"
                      fill="#374151"
                    >
                      {transition.label}
                    </text>
                  </g>
                );
              })}

              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
                </marker>
              </defs>
            </svg>

            {states.map((state) => (
              <div
                key={state.name}
                className={`absolute w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  state.isActive
                    ? "bg-blue-500 text-white border-blue-600 scale-110"
                    : "bg-white border-gray-400"
                } ${state.isAccepting ? "border-double border-4" : ""}`}
                style={{ left: state.x, top: state.y }}
              >
                {state.name}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Input Processing:</h4>
              <div className="font-mono text-lg">
                {currentInput && (
                  <>
                    <span className="text-green-600">{currentInput}</span>
                    <span className="text-gray-400">
                      {inputString.substring(currentInput.length)}
                    </span>
                  </>
                )}
                {!currentInput && inputString && (
                  <span className="text-gray-400">{inputString}</span>
                )}
              </div>
              {result && (
                <div className="mt-2">
                  <Badge
                    variant={result.includes("✅") ? "default" : "destructive"}
                  >
                    {result}
                  </Badge>
                </div>
              )}
            </div>

            <div>
              <h4 className="font-semibold mb-2">State Legend:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full border-2 border-gray-400 bg-white flex items-center justify-center text-xs">
                    q
                  </div>
                  <span>Normal state</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full border-4 border-double border-gray-400 bg-white flex items-center justify-center text-xs">
                    q
                  </div>
                  <span>Accepting state</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full border-2 border-blue-600 bg-blue-500 flex items-center justify-center text-xs text-white">
                    q
                  </div>
                  <span>Current state</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const AdvancedCSVisualizers: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Advanced Computer Science Visualizers
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Interactive demonstrations of advanced computer science concepts
          including automata theory and computational models.
        </p>
      </div>

      <FiniteStateMachineVisualizer />
    </div>
  );
};
