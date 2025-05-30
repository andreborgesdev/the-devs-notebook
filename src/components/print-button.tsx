"use client";

import { useState } from "react";
import { Printer, Download, FileText } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { cn } from "@/src/lib/utils";

interface PrintButtonProps {
  title?: string;
  className?: string;
  variant?: "default" | "ghost" | "outline" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  showLabel?: boolean;
}

export function PrintButton({
  title = "Print Page",
  className,
  variant = "ghost",
  size = "sm",
  showLabel = false,
}: PrintButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handlePrintClean = () => {
    setIsLoading(true);

    const originalTitle = document.title;
    const pageTitle = title || document.title;

    document.title = `${pageTitle} - Print Version`;

    document.body.setAttribute("data-print-mode", "clean");

    setTimeout(() => {
      window.print();

      setTimeout(() => {
        document.body.removeAttribute("data-print-mode");
        document.title = originalTitle;
        setIsLoading(false);
      }, 100);
    }, 100);
  };

  const handleSavePDF = async () => {
    setIsLoading(true);

    try {
      const originalTitle = document.title;
      const pageTitle = title || document.title;

      document.title = `${pageTitle} - PDF Version`;
      document.body.setAttribute("data-print-mode", "pdf");

      setTimeout(() => {
        window.print();

        setTimeout(() => {
          document.body.removeAttribute("data-print-mode");
          document.title = originalTitle;
          setIsLoading(false);
        }, 100);
      }, 100);
    } catch (error) {
      console.error("Error preparing PDF:", error);
      setIsLoading(false);
    }
  };

  const button = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn(
            "group transition-all duration-200",
            isLoading && "opacity-50 cursor-not-allowed",
            className
          )}
          disabled={isLoading}
          aria-label="Print options"
        >
          <Printer
            className={cn(
              "h-4 w-4 transition-all duration-200",
              showLabel && "mr-2"
            )}
          />
          {showLabel && <span className="text-xs">Print</span>}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Print Options</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handlePrint} className="cursor-pointer">
          <Printer className="h-4 w-4 mr-2" />
          Print Page
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handlePrintClean} className="cursor-pointer">
          <FileText className="h-4 w-4 mr-2" />
          Print Clean Version
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleSavePDF} className="cursor-pointer">
          <Download className="h-4 w-4 mr-2" />
          Save as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (!showLabel) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent>
            <p>Print or save as PDF</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
}
