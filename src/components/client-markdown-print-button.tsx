"use client";

import { useState, useEffect } from "react";
import { MarkdownPrintButton } from "@/src/components/markdown-print-button";

interface ClientMarkdownPrintButtonProps {
  title?: string;
  className?: string;
  variant?: "default" | "ghost" | "outline" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  showLabel?: boolean;
}

export function ClientMarkdownPrintButton(
  props: ClientMarkdownPrintButtonProps
) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div
        className="h-8 w-8 bg-muted animate-pulse rounded-md"
        aria-label="Loading print button"
      />
    );
  }

  return <MarkdownPrintButton {...props} />;
}
