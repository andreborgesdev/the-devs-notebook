"use client";

import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { Sun, MoonStar } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div className={cn(className)}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        <Sun className="h-5 w-5 rotate-0 scale-0 transition-transform dark:-rotate-90 dark:scale-100" />
        <MoonStar className="absolute h-5 w-5 rotate-0 scale-100 transition-transform dark:rotate-0 dark:scale-0" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  );
}
