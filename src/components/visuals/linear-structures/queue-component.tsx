import React, { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { VisualizationControls, QueueVisualization, QueueItem } from "./index";

interface QueueComponentProps {
  initialData?: QueueItem[];
}

export function QueueComponent({ initialData = [] }: QueueComponentProps) {
  const [items, setItems] = useState<QueueItem[]>(initialData);
  const [inputValue, setInputValue] = useState("");

  const enqueue = () => {
    if (!inputValue.trim()) return;

    const newItem: QueueItem = {
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

  const dequeue = () => {
    if (items.length === 0) return;

    setItems((prev) => {
      const newItems = [...prev];
      newItems[0].highlight = true;
      return newItems;
    });

    setTimeout(() => {
      setItems((prev) => prev.slice(1));
    }, 500);
  };

  const handleItemClick = (item: QueueItem, index: number) => {
    if (index === 0) {
      dequeue();
    }
  };

  const actions = [
    {
      label: "Enqueue",
      onClick: enqueue,
      icon: <ArrowRight className="h-3 w-3 mr-1" />,
    },
    {
      label: "Dequeue",
      onClick: dequeue,
      variant: "outline" as const,
      icon: <ArrowLeft className="h-3 w-3 mr-1" />,
    },
  ];

  return (
    <div className="flex flex-col items-center space-y-4">
      <VisualizationControls
        inputValue={inputValue}
        onInputChange={setInputValue}
        onInputSubmit={enqueue}
        actions={actions}
      />
      <QueueVisualization items={items} onItemClick={handleItemClick} />
    </div>
  );
}
