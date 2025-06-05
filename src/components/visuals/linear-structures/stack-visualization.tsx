import React from "react";
import { cn } from "@/src/lib/utils";
import { Badge } from "@/src/components/ui/badge";
import { StackItem } from "./types";

interface StackVisualizationProps {
  items: StackItem[];
  onItemClick?: (item: StackItem, index: number) => void;
}

export function StackVisualization({
  items,
  onItemClick,
}: StackVisualizationProps) {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex flex-col-reverse items-center space-y-reverse space-y-1 max-h-96 overflow-y-auto p-2 border border-gray-200 rounded-lg">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={cn(
              "w-24 h-12 border-2 flex items-center justify-center rounded transition-all duration-300 cursor-pointer",
              item.highlight
                ? "bg-blue-200 border-blue-500 scale-105"
                : "bg-gray-100 border-gray-300 hover:bg-gray-200"
            )}
            style={{
              transform: `translateY(${item.highlight ? "-5px" : "0"})`,
              zIndex: items.length - index,
            }}
            onClick={() => onItemClick?.(item, index)}
          >
            <span className="font-mono font-semibold text-sm">
              {item.value}
            </span>
          </div>
        ))}
        <div className="w-24 h-4 bg-gray-800 rounded-b text-center text-white text-xs flex items-center justify-center">
          Stack
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <Badge variant="outline">Size: {items.length}</Badge>
        <Badge variant="outline">
          Top: {items.length > 0 ? items[items.length - 1].value : "Empty"}
        </Badge>
      </div>
    </div>
  );
}
