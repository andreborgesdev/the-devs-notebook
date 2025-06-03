"use client";
import React from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import { cn } from "@/src/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { RotateCcw, Download } from "lucide-react";

interface FlowchartDiagramProps {
  title?: string;
  description?: string;
  className?: string;
  height?: number;
  initialNodes?: any[];
  initialEdges?: any[];
  theme?: "light" | "dark";
}

export function FlowchartDiagram({
  title,
  description,
  className,
  height = 400,
  initialNodes = [],
  initialEdges = [],
  theme = "light",
}: FlowchartDiagramProps) {
  const processedNodes = initialNodes.map((node: any, index) => {
    let position = node.position;
    if (!position) {
      const cols = Math.ceil(Math.sqrt(initialNodes.length));
      const row = Math.floor(index / cols);
      const col = index % cols;
      position = {
        x: col * 200 + 100,
        y: row * 150 + 100,
      };
    }

    return {
      id: node.id,
      type: node.type || "default",
      position,
      data: {
        label: node.label || `Node ${index + 1}`,
      },
    };
  });

  const processedEdges = initialEdges.map((edge: any, index) => ({
    id: edge.id || `edge-${index}`,
    source: edge.from || edge.source,
    target: edge.to || edge.target,
    label: edge.label,
    type: "smoothstep",
    markerEnd: { type: MarkerType.ArrowClosed },
  }));

  const [nodes, setNodes] = useNodesState(processedNodes);
  const [edges, setEdges] = useEdgesState(processedEdges);

  const resetLayout = () => {
    setNodes(processedNodes);
    setEdges(processedEdges);
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
              <Button variant="outline" size="sm" onClick={resetLayout}>
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <div style={{ height: `${height}px` }} className="relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            connectionMode={ConnectionMode.Loose}
            fitView
            className={theme === "dark" ? "dark" : ""}
            defaultEdgeOptions={{
              type: "smoothstep",
              markerEnd: { type: MarkerType.ArrowClosed },
            }}
          >
            <Controls position="top-right" />
            <Background />
          </ReactFlow>
        </div>
      </CardContent>
    </Card>
  );
}
