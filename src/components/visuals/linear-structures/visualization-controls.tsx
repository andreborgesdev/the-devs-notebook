import React from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { VisualizationControlsProps } from "./types";

export function VisualizationControls({
  inputValue,
  onInputChange,
  onInputSubmit,
  actions,
}: VisualizationControlsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4 justify-center">
      <Input
        placeholder="Enter value"
        value={inputValue}
        onChange={(e) => onInputChange(e.target.value)}
        className="w-32"
        onKeyPress={(e) => e.key === "Enter" && onInputSubmit()}
      />
      {actions.map((action, index) => (
        <Button
          key={index}
          onClick={action.onClick}
          size="sm"
          variant={action.variant || "default"}
        >
          {action.icon}
          {action.label}
        </Button>
      ))}
    </div>
  );
}
