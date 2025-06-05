"use client";

import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { cn } from "@/src/lib/utils";
import { ContentItem } from "./nav-item";
import { ChevronRight } from "lucide-react";
import { useRef } from "react";

interface NavSubmenuTooltipProps {
  item: ContentItem;
  children: React.ReactNode;
  side?: "left" | "right";
  sideOffset?: number;
}

function SubMenuItem({
  item,
  depth = 0,
}: {
  item: ContentItem;
  depth?: number;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasChildren = item.items && item.items.length > 0;

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 100); // Small delay to prevent flickering
  };

  if (hasChildren) {
    return (
      <Tooltip open={isOpen}>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "flex w-full items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-sm outline-none text-popover-foreground",
              "hover:bg-accent",
              "focus:bg-accent"
            )}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="flex items-center gap-2">
              {item.icon && <span>{item.icon}</span>}
              <span>{item.title}</span>
            </div>
            <ChevronRight className="h-4 w-4" />
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          sideOffset={4}
          className="w-48 p-0"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="rounded-md border bg-popover p-1 text-popover-foreground">
            {item.items?.map((subItem) => (
              <SubMenuItem
                key={subItem.title}
                item={subItem}
                depth={depth + 1}
              />
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <a
      href={item.url}
      className={cn(
        "flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none text-popover-foreground",
        "hover:bg-accent",
        "focus:bg-accent"
      )}
    >
      {item.icon && <span>{item.icon}</span>}
      <span>{item.title}</span>
    </a>
  );
}

export function NavSubmenuTooltip({
  item,
  children,
  side = "right",
  sideOffset = 12,
}: NavSubmenuTooltipProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 100);
  };

  // Show submenu tooltip for items with children
  return (
    <Tooltip open={isOpen}>
      <TooltipTrigger
        asChild
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </TooltipTrigger>
      <TooltipContent
        side={side}
        sideOffset={sideOffset}
        className="w-48 p-0"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="rounded-md border bg-popover text-popover-foreground p-1">
          {item.items?.map((subItem) => (
            <SubMenuItem key={subItem.title} item={subItem} />
          ))}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
