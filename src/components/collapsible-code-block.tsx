"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Code } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { CopyButton } from "@/src/components/copy-button";
import { cn } from "@/src/lib/utils";
import { useUserPreferences } from "@/src/contexts/user-preferences";

interface CollapsibleCodeBlockProps {
  children: React.ReactNode;
  className?: string;
  language?: string;
  defaultExpanded?: boolean;
}

export function CollapsibleCodeBlock({
  children,
  className,
  language,
  defaultExpanded,
}: CollapsibleCodeBlockProps) {
  const { codeBlocksExpanded } = useUserPreferences();
  // Use user preference if no explicit defaultExpanded is provided
  const initialExpanded =
    defaultExpanded !== undefined ? defaultExpanded : codeBlocksExpanded;
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  useEffect(() => {
    // Only update if no explicit defaultExpanded was provided
    if (defaultExpanded === undefined) {
      setIsExpanded(codeBlocksExpanded);
    }
  }, [codeBlocksExpanded, defaultExpanded]);

  const getLanguageLabel = (lang?: string) => {
    if (!lang) return "Code";

    const languageMap: Record<string, string> = {
      js: "JavaScript",
      ts: "TypeScript",
      tsx: "TypeScript JSX",
      jsx: "JavaScript JSX",
      py: "Python",
      java: "Java",
      cpp: "C++",
      c: "C",
      cs: "C#",
      go: "Go",
      rs: "Rust",
      php: "PHP",
      rb: "Ruby",
      kt: "Kotlin",
      swift: "Swift",
      dart: "Dart",
      sh: "Shell",
      bash: "Bash",
      zsh: "Zsh",
      powershell: "PowerShell",
      sql: "SQL",
      html: "HTML",
      css: "CSS",
      scss: "SCSS",
      sass: "Sass",
      less: "Less",
      json: "JSON",
      yaml: "YAML",
      yml: "YAML",
      xml: "XML",
      md: "Markdown",
      dockerfile: "Dockerfile",
      makefile: "Makefile",
      gitignore: "Gitignore",
    };

    return (
      languageMap[lang.toLowerCase()] ||
      lang.charAt(0).toUpperCase() + lang.slice(1)
    );
  };

  return (
    <div className="relative group my-6 collapsible-code-block">
      <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-t-lg border border-b-0 print:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 p-0 h-auto toggle-button"
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          <Code className="h-4 w-4" />
          {getLanguageLabel(language)}
          <span className="text-xs text-slate-500 dark:text-slate-400">
            ({isExpanded ? "Hide" : "Show"} code)
          </span>
        </Button>
      </div>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out print:!max-h-none print:!opacity-100",
          isExpanded
            ? "max-h-[2000px] opacity-100 collapsible-code-expanded"
            : "max-h-0 opacity-0 collapsible-code-collapsed"
        )}
      >
        <div className="relative">
          <pre
            className={cn(
              "relative rounded-none rounded-b-lg border border-t-0 bg-muted overflow-x-auto shadow-sm m-0 print:rounded-lg print:border",
              className
            )}
          >
            {children}
          </pre>
          {isExpanded && <CopyButton />}
        </div>
      </div>
    </div>
  );
}
