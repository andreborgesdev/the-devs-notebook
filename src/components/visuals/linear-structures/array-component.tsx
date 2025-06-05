import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { VisualizationControls, ArrayVisualization, ArrayItem } from "./index";

interface ArrayComponentProps {
  initialData?: ArrayItem[];
}

export function ArrayComponent({ initialData = [] }: ArrayComponentProps) {
  const [items, setItems] = useState<ArrayItem[]>(initialData);
  const [inputValue, setInputValue] = useState("");

  const addElement = () => {
    if (!inputValue.trim()) return;

    const newItem: ArrayItem = {
      value: inputValue.trim(),
      id: Date.now().toString(),
      index: items.length,
      highlight: true,
    };

    setItems((prev) => [...prev, newItem]);
    setInputValue("");

    setTimeout(() => {
      setItems((prev) => prev.map((item) => ({ ...item, highlight: false })));
    }, 1000);
  };

  const removeElement = (index: number) => {
    setItems((prev) => {
      const newArray = prev.filter((_, i) => i !== index);
      return newArray.map((item, i) => ({ ...item, index: i }));
    });
  };

  const clearArray = () => {
    setItems([]);
  };

  const handleItemClick = (item: ArrayItem, index: number) => {
    removeElement(index);
  };

  const actions = [
    {
      label: "Add",
      onClick: addElement,
      icon: <Plus className="h-3 w-3 mr-1" />,
    },
    {
      label: "Clear",
      onClick: clearArray,
      variant: "outline" as const,
      icon: <Trash2 className="h-3 w-3 mr-1" />,
    },
  ];

  return (
    <div className="flex flex-col items-center space-y-4">
      <VisualizationControls
        inputValue={inputValue}
        onInputChange={setInputValue}
        onInputSubmit={addElement}
        actions={actions}
      />
      <ArrayVisualization items={items} onItemClick={handleItemClick} />
    </div>
  );
}
