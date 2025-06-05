import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  VisualizationControls,
  LinkedListVisualization,
  LinkedListNode,
} from "./index";

interface LinkedListComponentProps {
  initialData?: LinkedListNode[];
}

export function LinkedListComponent({
  initialData = [],
}: LinkedListComponentProps) {
  const [nodes, setNodes] = useState<LinkedListNode[]>(initialData);
  const [inputValue, setInputValue] = useState("");

  const addNode = () => {
    if (!inputValue.trim()) return;

    const newNode: LinkedListNode = {
      value: inputValue.trim(),
      id: Date.now().toString(),
      highlight: true,
    };

    if (nodes.length > 0) {
      const lastNode = nodes[nodes.length - 1];
      lastNode.next = newNode.id;
    }

    setNodes((prev) => [...prev, newNode]);
    setInputValue("");

    setTimeout(() => {
      setNodes((prev) => prev.map((node) => ({ ...node, highlight: false })));
    }, 1000);
  };

  const removeNode = (nodeId: string) => {
    const nodeIndex = nodes.findIndex((n) => n.id === nodeId);
    if (nodeIndex === -1) return;

    setNodes((prev) => {
      const newNodes = [...prev];

      if (nodeIndex > 0) {
        newNodes[nodeIndex - 1].next = newNodes[nodeIndex].next;
      }

      newNodes.splice(nodeIndex, 1);
      return newNodes;
    });
  };

  const clearList = () => {
    setNodes([]);
  };

  const handleNodeClick = (node: LinkedListNode, index: number) => {
    removeNode(node.id);
  };

  const actions = [
    {
      label: "Add Node",
      onClick: addNode,
      icon: <Plus className="h-3 w-3 mr-1" />,
    },
    {
      label: "Clear",
      onClick: clearList,
      variant: "outline" as const,
      icon: <Trash2 className="h-3 w-3 mr-1" />,
    },
  ];

  return (
    <div className="flex flex-col items-center space-y-4">
      <VisualizationControls
        inputValue={inputValue}
        onInputChange={setInputValue}
        onInputSubmit={addNode}
        actions={actions}
      />
      <LinkedListVisualization nodes={nodes} onNodeClick={handleNodeClick} />
    </div>
  );
}
