import React from "react";
import { cn } from "@/src/lib/utils";
import { Badge } from "@/src/components/ui/badge";
import { QueueItem } from "./types";

interface QueueVisualizationProps {
  items: QueueItem[];
  onItemClick?: (item: QueueItem, index: number) => void;
}

export function QueueVisualization({
  items,
  onItemClick,
}: QueueVisualizationProps) {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="w-full max-w-5xl border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <div className="flex items-center space-x-2 min-w-max pb-2">
            <div className="text-sm font-semibold whitespace-nowrap text-blue-600">
              Front →
            </div>
            <div className="flex space-x-1">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className={cn(
                    "w-16 h-12 border-2 flex items-center justify-center rounded transition-all duration-300 cursor-pointer flex-shrink-0",
                    item.highlight
                      ? "bg-green-200 border-green-500 scale-105"
                      : "bg-gray-100 border-gray-300 hover:bg-gray-200"
                  )}
                  onClick={() => onItemClick?.(item, index)}
                >
                  <span className="font-mono font-semibold text-sm">
                    {item.value}
                  </span>
                </div>
              ))}
              {items.length === 0 && (
                <div className="text-gray-500 text-center py-3 px-8">
                  Queue is empty
                </div>
              )}
            </div>
            <div className="text-sm font-semibold whitespace-nowrap text-blue-600">
              ← Rear
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <Badge variant="outline">Size: {items.length}</Badge>
        <Badge variant="outline">
          Front: {items.length > 0 ? items[0].value : "Empty"}
        </Badge>
        <Badge variant="outline">
          Rear: {items.length > 0 ? items[items.length - 1].value : "Empty"}
        </Badge>
      </div>
    </div>
  );
}
