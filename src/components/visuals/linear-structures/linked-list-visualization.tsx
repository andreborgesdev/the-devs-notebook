import React from "react";
import { cn } from "@/src/lib/utils";
import { Badge } from "@/src/components/ui/badge";
import { LinkedListNode } from "./types";

interface LinkedListVisualizationProps {
  nodes: LinkedListNode[];
  onNodeClick?: (node: LinkedListNode, index: number) => void;
}

export function LinkedListVisualization({
  nodes,
  onNodeClick,
}: LinkedListVisualizationProps) {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="w-full max-w-5xl border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max pb-2">
            {nodes.map((node, index) => (
              <React.Fragment key={node.id}>
                <div
                  className={cn(
                    "w-16 h-12 border-2 flex items-center justify-center rounded cursor-pointer transition-all duration-300 flex-shrink-0",
                    node.highlight
                      ? "bg-blue-200 border-blue-500 scale-105"
                      : "bg-gray-100 border-gray-300 hover:bg-gray-200"
                  )}
                  onClick={() => onNodeClick?.(node, index)}
                >
                  <span className="font-mono font-semibold text-sm">
                    {node.value}
                  </span>
                </div>
                {index < nodes.length - 1 && (
                  <div className="text-gray-400 flex-shrink-0 text-lg">→</div>
                )}
              </React.Fragment>
            ))}
            {nodes.length > 0 && (
              <div className="text-gray-400 flex-shrink-0 text-lg">→ null</div>
            )}
            {nodes.length === 0 && (
              <div className="text-gray-500 text-center py-8 w-full">
                Linked list is empty
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <Badge variant="outline">Nodes: {nodes.length}</Badge>
        {nodes.length > 0 && (
          <>
            <Badge variant="outline">Head: {nodes[0].value}</Badge>
            <Badge variant="outline">
              Tail: {nodes[nodes.length - 1].value}
            </Badge>
          </>
        )}
      </div>
    </div>
  );
}
