"use client";

import { useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { useBookmarks } from "@/src/contexts/BookmarkContext";
import { cn } from "@/src/lib/utils";

interface BookmarkButtonProps {
  title: string;
  url: string;
  icon?: string;
  description?: string;
  category?: string;
  tags?: string[];
  className?: string;
  variant?: "default" | "ghost" | "outline" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  showLabel?: boolean;
}

export function BookmarkButton({
  title,
  url,
  icon,
  description,
  category,
  tags,
  className,
  variant = "ghost",
  size = "sm",
  showLabel = false,
}: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [isAnimating, setIsAnimating] = useState(false);

  const bookmarked = isBookmarked(url);

  const handleClick = () => {
    setIsAnimating(true);
    toggleBookmark({
      title,
      url,
      icon,
      description,
      category,
      tags,
    });

    setTimeout(() => setIsAnimating(false), 300);
  };

  const ButtonIcon = bookmarked ? BookmarkCheck : Bookmark;

  const button = (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={cn(
        "group transition-all duration-200",
        bookmarked &&
          "text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300",
        isAnimating && "scale-110",
        className
      )}
      aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      <ButtonIcon
        className={cn(
          "h-4 w-4 transition-all duration-200",
          bookmarked && "fill-current",
          isAnimating && "animate-pulse",
          showLabel && "mr-2"
        )}
      />
      {showLabel && (
        <span className="text-xs">
          {bookmarked ? "Bookmarked" : "Bookmark"}
        </span>
      )}
    </Button>
  );

  if (!showLabel) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent>
            <p>{bookmarked ? "Remove bookmark" : "Bookmark this topic"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
}
