export interface BaseItem {
  value: string | number;
  id: string;
  highlight?: boolean;
}

export interface StackItem extends BaseItem {}

export interface QueueItem extends BaseItem {}

export interface ArrayItem extends BaseItem {
  index: number;
}

export interface LinkedListNode extends BaseItem {
  next?: string;
}

export interface VisualizationControlsProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onInputSubmit: () => void;
  actions: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "destructive";
    icon?: React.ReactNode;
  }[];
}
