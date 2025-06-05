"use client";

import { useState, useRef } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useToast } from "@/src/hooks/use-toast";
import { cn } from "@/src/lib/utils";

interface CopyButtonProps {
  content?: string;
  className?: string;
  targetSelector?: string;
}

export function CopyButton({
  content,
  className,
  targetSelector,
}: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const extractTextContent = () => {
    if (content) return content;

    if (targetSelector && containerRef.current) {
      const targetElement = containerRef.current.querySelector(targetSelector);
      if (targetElement) {
        return targetElement.textContent || "";
      }
    }

    if (containerRef.current) {
      const codeElement = containerRef.current
        .closest(".relative")
        ?.querySelector("code");
      if (codeElement) {
        return codeElement.textContent || "";
      }
    }

    return "";
  };

  const handleCopy = async () => {
    try {
      const textToCopy = extractTextContent();
      if (textToCopy) {
        await navigator.clipboard.writeText(textToCopy);
        setIsCopied(true);

        toast({
          title: "Copied to clipboard",
          description: "Code has been copied to your clipboard",
          variant: "success",
        });

        setTimeout(() => setIsCopied(false), 2000);
      } else {
        toast({
          title: "Nothing to copy",
          description: "No code content found to copy",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to copy:", error);
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div ref={containerRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleCopy}
        className={cn(
          "absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity z-10",
          "bg-background/80 backdrop-blur-sm hover:bg-background",
          "border border-border/50",
          isCopied && "text-green-600",
          className
        )}
        aria-label={isCopied ? "Copied!" : "Copy code"}
      >
        {isCopied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
