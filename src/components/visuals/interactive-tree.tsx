"use client";

import React, { useState, useEffect } from "react";
import Tree from "react-d3-tree";
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
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  SkipForward,
} from "lucide-react";

interface TreeNode {
  name: string;
  value?: number | string;
  children?: TreeNode[];
  attributes?: {
    color?: string;
    highlighted?: boolean;
    visited?: boolean;
  };
}

interface InteractiveTreeProps {
  data: TreeNode;
  title?: string;
  description?: string;
  className?: string;
  height?: number;
  orientation?: "vertical" | "horizontal";
  animated?: boolean;
  traversalSteps?: TreeNode[][];
  onNodeClick?: (node: TreeNode) => void;
}

const nodeSize = { x: 120, y: 80 };
const separation = { siblings: 1.2, nonSiblings: 1.5 };

export function InteractiveTree({
  data,
  title,
  description,
  className,
  height = 500,
  orientation = "vertical",
  animated = false,
  traversalSteps = [],
  onNodeClick,
}: InteractiveTreeProps) {
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(0.8);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Validate and clean tree data
  const validateTreeData = (node: TreeNode): TreeNode => {
    const cleanedNode: TreeNode = {
      name: node.name || "unknown",
      value: node.value,
      attributes: node.attributes,
    };

    if (node.children && node.children.length > 0) {
      const validChildren = node.children
        .filter(
          (child): child is TreeNode => child !== null && child !== undefined
        )
        .map(validateTreeData);

      if (validChildren.length > 0) {
        cleanedNode.children = validChildren;
      }
    }

    return cleanedNode;
  };

  const [treeData, setTreeData] = useState(() => validateTreeData(data));

  useEffect(() => {
    setTreeData(validateTreeData(data));
  }, [data]);

  useEffect(() => {
    const centerX = window.innerWidth / 4;
    const centerY = height / 4;
    setTranslate({ x: centerX, y: centerY });
  }, [height]);

  useEffect(() => {
    if (animated && traversalSteps.length > 0 && isPlaying) {
      const timer = setInterval(() => {
        setCurrentStep((prev) => {
          const next = prev + 1;
          if (next >= traversalSteps.length) {
            setIsPlaying(false);
            return 0;
          }
          return next;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isPlaying, traversalSteps.length, animated]);

  const renderCustomNodeElement = ({
    nodeDatum,
    toggleNode,
  }: {
    nodeDatum: any;
    toggleNode: () => void;
  }) => {
    const isHighlighted = nodeDatum.attributes?.highlighted;
    const isVisited = nodeDatum.attributes?.visited;
    const nodeColor = nodeDatum.attributes?.color || "#3b82f6";

    return (
      <g>
        <circle
          r="20"
          fill={isHighlighted ? "#ef4444" : isVisited ? "#10b981" : nodeColor}
          stroke="#1f2937"
          strokeWidth="2"
          className="cursor-pointer transition-all duration-300 hover:stroke-4"
          onClick={() => {
            toggleNode();
            onNodeClick?.(nodeDatum);
          }}
        />
        <text
          fill="white"
          strokeWidth="0"
          x="0"
          y="5"
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
        >
          {nodeDatum.name}
        </text>
        {nodeDatum.value && (
          <text fill="#374151" x="0" y="35" textAnchor="middle" fontSize="10">
            {nodeDatum.value}
          </text>
        )}
      </g>
    );
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.3));
  const handleReset = () => {
    setZoom(0.8);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handlePlay = () => setIsPlaying(!isPlaying);
  const handleStep = () => {
    if (currentStep < traversalSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            {title && <CardTitle className="text-lg">{title}</CardTitle>}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="h-3 w-3" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-3 w-3" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="h-3 w-3" />
            </Button>
            {animated && traversalSteps.length > 0 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePlay}
                  className={isPlaying ? "bg-red-50" : ""}
                >
                  {isPlaying ? (
                    <Pause className="h-3 w-3" />
                  ) : (
                    <Play className="h-3 w-3" />
                  )}
                </Button>
                <Button variant="outline" size="sm" onClick={handleStep}>
                  <SkipForward className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        </div>
        {animated && traversalSteps.length > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline">
              Step {currentStep + 1} of {traversalSteps.length}
            </Badge>
            <div className="text-xs text-muted-foreground">
              {isPlaying ? "Playing..." : "Paused"}
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <div
          className="relative border-t bg-white dark:bg-gray-50"
          style={{ height: `${height}px` }}
        >
          {treeData && treeData.name && (
            <Tree
              data={treeData}
              translate={translate}
              zoom={zoom}
              nodeSize={nodeSize}
              separation={separation}
              orientation={orientation}
              renderCustomNodeElement={renderCustomNodeElement}
              pathFunc="diagonal"
              transitionDuration={300}
              enableLegacyTransitions
              scaleExtent={{ min: 0.1, max: 2 }}
              zoomable
              draggable
              collapsible={false}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function BinarySearchTreeVisualizer({
  values = [8, 3, 10, 1, 6, 14, 4, 7, 13],
  className,
}: {
  values?: number[];
  className?: string;
}) {
  const buildBST = (vals: number[]): TreeNode => {
    if (vals.length === 0) return { name: "empty" };

    const root: TreeNode = { name: vals[0].toString(), value: vals[0] };

    for (let i = 1; i < vals.length; i++) {
      insertNode(root, vals[i]);
    }

    return root;
  };

  const insertNode = (node: TreeNode, value: number) => {
    const nodeValue = parseInt(node.name);

    if (value < nodeValue) {
      if (!node.children) node.children = [];
      if (node.children.length === 0 || !node.children[0]) {
        node.children[0] = { name: value.toString(), value };
      } else {
        insertNode(node.children[0], value);
      }
    } else {
      if (!node.children) node.children = [];
      if (node.children.length < 2) {
        node.children.push({ name: value.toString(), value });
      } else if (!node.children[1]) {
        node.children[1] = { name: value.toString(), value };
      } else {
        insertNode(node.children[1], value);
      }
    }
  };

  const treeData = buildBST(values);

  return (
    <InteractiveTree
      data={treeData}
      title="Binary Search Tree"
      description="Interactive BST visualization with insertion order"
      className={className}
      height={400}
      onNodeClick={(node) => console.log("Clicked node:", node.name)}
    />
  );
}

export function TreeTraversalDemo({
  values = [1, 2, 3, 4, 5, 6, 7],
  className,
}: {
  values?: number[];
  className?: string;
}) {
  const buildCompleteTree = (vals: number[]): TreeNode => {
    if (vals.length === 0) return { name: "empty" };

    const buildNode = (index: number): TreeNode | undefined => {
      if (index >= vals.length) return undefined;

      const leftChild = buildNode(2 * index + 1);
      const rightChild = buildNode(2 * index + 2);

      const children = [leftChild, rightChild].filter(
        (child): child is TreeNode => child !== undefined
      );

      return {
        name: vals[index].toString(),
        value: vals[index],
        children: children.length > 0 ? children : undefined,
      };
    };

    return buildNode(0)!;
  };

  const generateTraversalSteps = (tree: TreeNode): TreeNode[][] => {
    const steps: TreeNode[][] = [];

    const preorderSteps: TreeNode[] = [];
    const preorder = (node: TreeNode | undefined) => {
      if (!node) return;
      preorderSteps.push(node);
      steps.push([...preorderSteps]);
      node.children?.forEach((child) => preorder(child));
    };

    preorder(tree);
    return steps;
  };

  const treeData = buildCompleteTree(values);
  const traversalSteps = generateTraversalSteps(treeData);

  return (
    <InteractiveTree
      data={treeData}
      title="Tree Traversal (Pre-order)"
      description="Watch the pre-order traversal animation"
      className={className}
      height={400}
      animated
      traversalSteps={traversalSteps}
    />
  );
}
