import React from "react";
import { cn } from "@/src/lib/utils";
import { Badge } from "@/src/components/ui/badge";
import { ArrayItem } from "./types";

interface ArrayVisualizationProps {
  items: ArrayItem[];
  onItemClick?: (item: ArrayItem, index: number) => void;
}

export function ArrayVisualization({
  items,
  onItemClick,
}: ArrayVisualizationProps) {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="w-full max-w-5xl border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <div className="flex items-center gap-1 min-w-max pb-2">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="flex flex-col items-center flex-shrink-0"
              >
                <div className="text-xs text-gray-500 mb-1">[{index}]</div>
                <div
                  className={cn(
                    "w-16 h-12 border-2 flex items-center justify-center rounded cursor-pointer transition-all duration-300",
                    item.highlight
                      ? "bg-yellow-200 border-yellow-500 scale-105"
                      : "bg-gray-100 border-gray-300 hover:bg-gray-200"
                  )}
                  onClick={() => onItemClick?.(item, index)}
                >
                  <span className="font-mono font-semibold text-sm">
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="text-gray-500 text-center py-8 w-full">
                Array is empty
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <Badge variant="outline">Length: {items.length}</Badge>
        {items.length > 0 && (
          <>
            <Badge variant="outline">First: {items[0].value}</Badge>
            <Badge variant="outline">
              Last: {items[items.length - 1].value}
            </Badge>
          </>
        )}
      </div>
    </div>
  );
}
