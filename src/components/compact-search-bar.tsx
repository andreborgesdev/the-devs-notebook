"use client";

import { useState, useEffect } from "react";
import { SearchIcon, Command } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { SearchModal } from "./search-modal";

export function CompactSearchBar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setIsModalOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-72 xl:justify-between xl:px-3 xl:py-2"
      >
        <div className="flex items-center">
          <SearchIcon className="h-4 w-4 xl:mr-2" />
          <span className="hidden xl:inline-flex">Search documentation...</span>
        </div>
        <kbd className="pointer-events-none hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 xl:flex">
          <Command className="h-3 w-3" />K
        </kbd>
      </Button>

      <SearchModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
