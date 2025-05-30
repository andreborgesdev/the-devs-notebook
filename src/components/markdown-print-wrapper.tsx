"use client";

import { forwardRef, ReactNode } from "react";
import { cn } from "@/src/lib/utils";

interface MarkdownPrintWrapperProps {
  children: ReactNode;
  title: string;
  className?: string;
}

export const MarkdownPrintWrapper = forwardRef<
  HTMLDivElement,
  MarkdownPrintWrapperProps
>(({ children, title, className }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "print-content max-w-none w-full",
        "print:!block print:!static print:!transform-none print:!shadow-none",
        "print:!max-w-none print:!m-0 print:!p-8",
        "print:text-black print:bg-white",
        className
      )}
    >
      <div className="print:block hidden mb-8 border-b border-gray-300 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-sm text-gray-600">
          Generated from The Dev's Notebook - {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="markdown-content space-y-6">{children}</div>

      <div className="print:block hidden mt-8 pt-4 border-t border-gray-300">
        <p className="text-xs text-gray-500 text-center">
          Generated from The Dev's Notebook
        </p>
      </div>
    </div>
  );
});

MarkdownPrintWrapper.displayName = "MarkdownPrintWrapper";
