"use client";

import React, { ReactNode } from "react";
import { cn } from "@/src/lib/utils";
import { useAccessibility } from "@/src/contexts/AccessibilityContext";

interface FocusIndicatorProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "prominent" | "subtle";
  disabled?: boolean;
}

export function FocusIndicator({
  children,
  className,
  variant = "default",
  disabled = false,
}: FocusIndicatorProps) {
  const { keyboardNavigation, highContrastMode } = useAccessibility();

  const focusStyles = cn(
    // Base focus styles
    "focus:outline-none focus-visible:outline-none",

    // Default variant
    variant === "default" && [
      "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      keyboardNavigation && "focus:ring-2 focus:ring-ring focus:ring-offset-2",
      highContrastMode &&
        "focus-visible:ring-4 focus-visible:ring-yellow-400 focus-visible:ring-offset-4",
    ],

    // Prominent variant for important interactive elements
    variant === "prominent" && [
      "focus-visible:ring-3 focus-visible:ring-blue-500 focus-visible:ring-offset-3",
      "focus-visible:shadow-lg focus-visible:scale-105",
      keyboardNavigation &&
        "focus:ring-3 focus:ring-blue-500 focus:ring-offset-3 focus:shadow-lg focus:scale-105",
      highContrastMode &&
        "focus-visible:ring-4 focus-visible:ring-yellow-400 focus-visible:ring-offset-4 focus-visible:bg-yellow-50 dark:focus-visible:bg-yellow-900/20",
    ],

    // Subtle variant for dense interfaces
    variant === "subtle" && [
      "focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1",
      keyboardNavigation && "focus:ring-1 focus:ring-ring focus:ring-offset-1",
      highContrastMode &&
        "focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2",
    ],

    // Transitions
    !disabled && "transition-all duration-200",

    // High contrast enhancements
    highContrastMode && [
      "border-2 border-transparent",
      "focus-visible:border-yellow-400",
      keyboardNavigation && "focus:border-yellow-400",
    ],

    className
  );

  return <div className={focusStyles}>{children}</div>;
}

interface AccessibleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "prominent" | "subtle";
  children: ReactNode;
}

export function AccessibleButton({
  variant = "default",
  children,
  className,
  ...props
}: AccessibleButtonProps) {
  return (
    <FocusIndicator variant={variant} disabled={props.disabled}>
      <button
        className={cn("rounded-md transition-colors duration-200", className)}
        {...props}
      >
        {children}
      </button>
    </FocusIndicator>
  );
}

interface AccessibleLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "default" | "prominent" | "subtle";
  children: ReactNode;
}

export function AccessibleLink({
  variant = "default",
  children,
  className,
  ...props
}: AccessibleLinkProps) {
  return (
    <FocusIndicator variant={variant}>
      <a
        className={cn("rounded-md transition-colors duration-200", className)}
        {...props}
      >
        {children}
      </a>
    </FocusIndicator>
  );
}
