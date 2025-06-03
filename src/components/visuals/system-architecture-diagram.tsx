"use client";

import React, { useState, useCallback } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  ConnectionMode,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";
import { cn } from "@/src/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { RotateCcw, Download, Share2 } from "lucide-react";

interface SystemArchitectureDiagramProps {
  title?: string;
  description?: string;
  className?: string;
  height?: number;
  initialNodes?: Node[];
  initialEdges?: Edge[];
  interactive?: boolean;
  theme?: "light" | "dark";
}

const nodeTypes = {
  custom: CustomNode,
};

function CustomNode({ data }: { data: any }) {
  return (
    <div
      className={cn(
        "px-4 py-2 shadow-lg rounded-lg border-2 bg-white min-w-[120px] text-center",
        data.type === "database" && "bg-blue-50 border-blue-300",
        data.type === "api" && "bg-green-50 border-green-300",
        data.type === "frontend" && "bg-purple-50 border-purple-300",
        data.type === "service" && "bg-orange-50 border-orange-300",
        data.type === "external" && "bg-gray-50 border-gray-300"
      )}
    >
      <div className="flex items-center justify-center mb-1">
        {data.icon && <span className="text-lg mr-2">{data.icon}</span>}
        <div className="font-semibold text-sm">{data.label}</div>
      </div>
      {data.description && (
        <div className="text-xs text-gray-600">{data.description}</div>
      )}
      {data.tech && (
        <Badge variant="secondary" className="mt-1 text-xs">
          {data.tech}
        </Badge>
      )}
    </div>
  );
}

export function SystemArchitectureDiagram({
  title,
  description,
  className,
  height = 600,
  initialNodes = [],
  initialEdges = [],
  interactive = true,
  theme = "light",
}: SystemArchitectureDiagramProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const resetLayout = () => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  };

  const downloadDiagram = () => {
    console.log("Download functionality would be implemented here");
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
            {interactive && (
              <div className="flex gap-1">
                <Button variant="outline" size="sm" onClick={resetLayout}>
                  <RotateCcw className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm" onClick={downloadDiagram}>
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <div style={{ height: `${height}px` }} className="relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            connectionMode={ConnectionMode.Loose}
            fitView
            className={theme === "dark" ? "dark" : ""}
          >
            <Controls position="top-right" />
            <Background />
            {interactive && (
              <Panel position="top-left">
                <Badge variant="outline" className="bg-white">
                  {interactive ? "Interactive Mode" : "View Only"}
                </Badge>
              </Panel>
            )}
          </ReactFlow>
        </div>
      </CardContent>
    </Card>
  );
}

export function ThreeTierArchitectureDemo({
  className,
}: {
  className?: string;
}) {
  const initialNodes: Node[] = [
    {
      id: "client",
      type: "custom",
      position: { x: 250, y: 50 },
      data: {
        label: "Client Browser",
        type: "frontend",
        icon: "🌐",
        description: "User Interface",
        tech: "React/HTML/CSS",
      },
    },
    {
      id: "lb",
      type: "custom",
      position: { x: 250, y: 150 },
      data: {
        label: "Load Balancer",
        type: "service",
        icon: "⚖️",
        description: "Traffic Distribution",
        tech: "Nginx/ALB",
      },
    },
    {
      id: "web1",
      type: "custom",
      position: { x: 100, y: 250 },
      data: {
        label: "Web Server 1",
        type: "service",
        icon: "🖥️",
        description: "Application Logic",
        tech: "Node.js/Java",
      },
    },
    {
      id: "web2",
      type: "custom",
      position: { x: 400, y: 250 },
      data: {
        label: "Web Server 2",
        type: "service",
        icon: "🖥️",
        description: "Application Logic",
        tech: "Node.js/Java",
      },
    },
    {
      id: "db",
      type: "custom",
      position: { x: 250, y: 400 },
      data: {
        label: "Database",
        type: "database",
        icon: "🗄️",
        description: "Data Storage",
        tech: "PostgreSQL/MySQL",
      },
    },
    {
      id: "cache",
      type: "custom",
      position: { x: 450, y: 350 },
      data: {
        label: "Cache",
        type: "database",
        icon: "⚡",
        description: "Fast Data Access",
        tech: "Redis/Memcached",
      },
    },
  ];

  const initialEdges: Edge[] = [
    { id: "e1", source: "client", target: "lb", animated: true },
    { id: "e2", source: "lb", target: "web1" },
    { id: "e3", source: "lb", target: "web2" },
    { id: "e4", source: "web1", target: "db" },
    { id: "e5", source: "web2", target: "db" },
    { id: "e6", source: "web1", target: "cache", style: { stroke: "#10b981" } },
    { id: "e7", source: "web2", target: "cache", style: { stroke: "#10b981" } },
  ];

  return (
    <SystemArchitectureDiagram
      title="Three-Tier Architecture"
      description="Interactive diagram showing presentation, application, and data tiers"
      className={className}
      height={500}
      initialNodes={initialNodes}
      initialEdges={initialEdges}
      interactive={true}
    />
  );
}

export function MicroservicesArchitectureDemo({
  className,
}: {
  className?: string;
}) {
  const initialNodes: Node[] = [
    {
      id: "gateway",
      type: "custom",
      position: { x: 300, y: 50 },
      data: {
        label: "API Gateway",
        type: "api",
        icon: "🚪",
        description: "Single Entry Point",
        tech: "Kong/Zuul",
      },
    },
    {
      id: "auth",
      type: "custom",
      position: { x: 100, y: 150 },
      data: {
        label: "Auth Service",
        type: "service",
        icon: "🔐",
        description: "Authentication",
        tech: "Node.js",
      },
    },
    {
      id: "user",
      type: "custom",
      position: { x: 300, y: 150 },
      data: {
        label: "User Service",
        type: "service",
        icon: "👤",
        description: "User Management",
        tech: "Java",
      },
    },
    {
      id: "order",
      type: "custom",
      position: { x: 500, y: 150 },
      data: {
        label: "Order Service",
        type: "service",
        icon: "📦",
        description: "Order Processing",
        tech: "Python",
      },
    },
    {
      id: "notification",
      type: "custom",
      position: { x: 700, y: 150 },
      data: {
        label: "Notification Service",
        type: "service",
        icon: "📱",
        description: "Messaging",
        tech: "Go",
      },
    },
    {
      id: "db1",
      type: "custom",
      position: { x: 100, y: 300 },
      data: {
        label: "Auth DB",
        type: "database",
        icon: "🗄️",
        tech: "PostgreSQL",
      },
    },
    {
      id: "db2",
      type: "custom",
      position: { x: 300, y: 300 },
      data: {
        label: "User DB",
        type: "database",
        icon: "🗄️",
        tech: "MongoDB",
      },
    },
    {
      id: "db3",
      type: "custom",
      position: { x: 500, y: 300 },
      data: {
        label: "Order DB",
        type: "database",
        icon: "🗄️",
        tech: "PostgreSQL",
      },
    },
    {
      id: "messagebus",
      type: "custom",
      position: { x: 400, y: 250 },
      data: {
        label: "Message Bus",
        type: "service",
        icon: "📨",
        description: "Event Streaming",
        tech: "Kafka/RabbitMQ",
      },
    },
  ];

  const initialEdges: Edge[] = [
    { id: "e1", source: "gateway", target: "auth" },
    { id: "e2", source: "gateway", target: "user" },
    { id: "e3", source: "gateway", target: "order" },
    { id: "e4", source: "auth", target: "db1" },
    { id: "e5", source: "user", target: "db2" },
    { id: "e6", source: "order", target: "db3" },
    { id: "e7", source: "order", target: "messagebus", animated: true },
    { id: "e8", source: "messagebus", target: "notification", animated: true },
  ];

  return (
    <SystemArchitectureDiagram
      title="Microservices Architecture"
      description="Scalable microservices with independent databases and messaging"
      className={className}
      height={400}
      initialNodes={initialNodes}
      initialEdges={initialEdges}
      interactive={true}
    />
  );
}
