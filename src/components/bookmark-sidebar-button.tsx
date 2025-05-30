"use client";

import Link from "next/link";
import { Bookmark } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { useBookmarks } from "@/src/contexts/BookmarkContext";
import { cn } from "@/src/lib/utils";

interface BookmarkSidebarButtonProps {
  isOpen: boolean;
}

export function BookmarkSidebarButton({ isOpen }: BookmarkSidebarButtonProps) {
  const { bookmarks } = useBookmarks();
  const bookmarkCount = bookmarks.length;

  const ButtonContent = () => (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "h-8 w-8 rounded-md transition-all duration-200",
        isOpen
          ? "w-full justify-start bg-transparent hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          : "bg-transparent hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}
      asChild
    >
      <Link href="/bookmarks">
        <div className="relative">
          <Bookmark className="h-4 w-4" />
          {bookmarkCount > 0 && (
            <div className="absolute -top-1 -right-1 h-2 w-2 bg-blue-500 rounded-full" />
          )}
        </div>
        {isOpen && (
          <>
            <span className="ml-2">Bookmarks</span>
            {bookmarkCount > 0 && (
              <span className="ml-auto text-xs bg-sidebar-accent px-1.5 py-0.5 rounded-full">
                {bookmarkCount}
              </span>
            )}
          </>
        )}
      </Link>
    </Button>
  );

  if (!isOpen) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <ButtonContent />
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Bookmarks {bookmarkCount > 0 && `(${bookmarkCount})`}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return <ButtonContent />;
}
