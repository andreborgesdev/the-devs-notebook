import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { VisualizationControls } from "./visualization-controls";
import { StackVisualization } from "./stack-visualization";
import { StackItem } from "./types";

interface StackComponentProps {
  initialData?: StackItem[];
}

export function StackComponent({ initialData = [] }: StackComponentProps) {
  const [items, setItems] = useState<StackItem[]>(initialData);
  const [inputValue, setInputValue] = useState("");

  const push = () => {
    if (!inputValue.trim()) return;

    const newItem: StackItem = {
      value: inputValue.trim(),
      id: Date.now().toString(),
      highlight: true,
    };

    setItems((prev) => [...prev, newItem]);
    setInputValue("");

    setTimeout(() => {
      setItems((prev) => prev.map((item) => ({ ...item, highlight: false })));
    }, 1000);
  };

  const pop = () => {
    if (items.length === 0) return;

    setItems((prev) => {
      const newItems = [...prev];
      newItems[newItems.length - 1].highlight = true;
      return newItems;
    });

    setTimeout(() => {
      setItems((prev) => prev.slice(0, -1));
    }, 500);
  };

  const handleItemClick = (item: StackItem, index: number) => {
    if (index === items.length - 1) {
      pop();
    }
  };

  const actions = [
    {
      label: "Push",
      onClick: push,
      icon: <Plus className="h-3 w-3 mr-1" />,
    },
    {
      label: "Pop",
      onClick: pop,
      variant: "outline" as const,
      icon: <Minus className="h-3 w-3 mr-1" />,
    },
  ];

  return (
    <div className="flex flex-col items-center space-y-4">
      <VisualizationControls
        inputValue={inputValue}
        onInputChange={setInputValue}
        onInputSubmit={push}
        actions={actions}
      />
      <StackVisualization items={items} onItemClick={handleItemClick} />
    </div>
  );
}
