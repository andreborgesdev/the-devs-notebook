"use client";

import { PrintButton } from "@/src/components/print-button";
import { useEffect, useState } from "react";

interface ClientPrintButtonProps {
  title?: string;
  className?: string;
  variant?: "default" | "ghost" | "outline" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  showLabel?: boolean;
}

export function ClientPrintButton({
  title,
  className,
  variant = "ghost",
  size = "sm",
  showLabel = false,
}: ClientPrintButtonProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="h-9 w-9 animate-pulse bg-muted rounded-md" />;
  }

  return (
    <PrintButton
      title={title}
      className={className}
      variant={variant}
      size={size}
      showLabel={showLabel}
    />
  );
}
