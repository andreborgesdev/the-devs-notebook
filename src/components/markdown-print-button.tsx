"use client";

import { useState, useRef } from "react";
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
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface MarkdownPrintButtonProps {
  title?: string;
  className?: string;
  variant?: "default" | "ghost" | "outline" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  showLabel?: boolean;
}

export function MarkdownPrintButton({
  title = "Print Page",
  className,
  variant = "ghost",
  size = "sm",
  showLabel = false,
}: MarkdownPrintButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const getMarkdownContent = () => {
    const contentSelectors = [
      '[data-content="markdown"]',
      ".markdown-content",
      "article",
      "main",
      ".prose",
    ];

    for (const selector of contentSelectors) {
      const element = document.querySelector(selector);
      if (element) return element as HTMLElement;
    }

    const allDivs = Array.from(document.querySelectorAll("div"));
    return allDivs.reduce((largest, current) => {
      return current.textContent &&
        current.textContent.length > (largest?.textContent?.length || 0)
        ? current
        : largest;
    }) as HTMLElement;
  };

  const createPrintWindow = (content: string, pageTitle: string) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return null;

    const styles = `
      <style>
        * { box-sizing: border-box; }
        body {
          font-family: system-ui, -apple-system, sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 20mm;
          color: #000;
          background: #fff;
          font-size: 12pt;
        }
        h1 { font-size: 24pt; margin: 0 0 16pt 0; color: #1a1a1a; break-after: avoid; }
        h2 { font-size: 18pt; margin: 16pt 0 12pt 0; color: #2a2a2a; break-after: avoid; }
        h3 { font-size: 14pt; margin: 12pt 0 8pt 0; color: #3a3a3a; break-after: avoid; }
        h4, h5, h6 { font-size: 12pt; margin: 8pt 0 6pt 0; font-weight: bold; break-after: avoid; }
        p { margin: 0 0 12pt 0; orphans: 2; widows: 2; }
        pre {
          background: #f5f5f5;
          border: 1pt solid #ddd;
          border-radius: 3pt;
          padding: 8pt;
          margin: 12pt 0;
          font-family: 'Courier New', monospace;
          font-size: 10pt;
          overflow-wrap: break-word;
          white-space: pre-wrap;
        }
        code {
          background: #f0f0f0;
          padding: 2pt 4pt;
          border-radius: 2pt;
          font-family: 'Courier New', monospace;
          font-size: 10pt;
        }
        pre code { background: none; padding: 0; }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 12pt 0;
          break-inside: avoid;
        }
        th, td {
          border: 1pt solid #ddd;
          padding: 6pt 8pt;
          text-align: left;
        }
        th { background: #f9f9f9; font-weight: bold; }
        blockquote {
          border-left: 3pt solid #ddd;
          margin: 12pt 0;
          padding-left: 12pt;
          color: #666;
        }
        ul, ol { margin: 12pt 0; padding-left: 20pt; }
        li { margin: 4pt 0; }
        a { color: #0066cc; text-decoration: underline; }
        a:after { content: " (" attr(href) ")"; font-size: 9pt; color: #666; }
        img { max-width: 100%; height: auto; margin: 12pt 0; }
        .no-print { display: none !important; }
        .print-header {
          border-bottom: 1pt solid #ddd;
          padding-bottom: 12pt;
          margin-bottom: 20pt;
        }
        .print-footer {
          border-top: 1pt solid #ddd;
          padding-top: 12pt;
          margin-top: 20pt;
          text-align: center;
          font-size: 9pt;
          color: #666;
        }
      </style>
    `;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${pageTitle}</title>
          <meta charset="utf-8">
          ${styles}
        </head>
        <body>
          <div class="print-header">
            <h1>${pageTitle}</h1>
            <p style="margin: 0; font-size: 10pt; color: #666;">
              Generated from The Dev's Notebook - ${new Date().toLocaleDateString()}
            </p>
          </div>
          ${content}
          <div class="print-footer">
            Generated from The Dev's Notebook
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    return printWindow;
  };

  const handlePrint = () => {
    setIsLoading(true);

    try {
      const contentElement = getMarkdownContent();
      if (!contentElement) {
        alert("Could not find content to print");
        setIsLoading(false);
        return;
      }

      const clonedContent = contentElement.cloneNode(true) as HTMLElement;

      const elementsToRemove = clonedContent.querySelectorAll(
        ".no-print, button, .print-button, nav, .navigation, .sidebar, .dropdown, .tooltip"
      );
      elementsToRemove.forEach((el) => el.remove());

      const printWindow = createPrintWindow(clonedContent.innerHTML, title);
      if (!printWindow) {
        setIsLoading(false);
        return;
      }

      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
          setIsLoading(false);
        }, 500);
      };
    } catch (error) {
      console.error("Print error:", error);
      setIsLoading(false);
    }
  };

  const handleSavePDF = async () => {
    setIsLoading(true);

    try {
      const contentElement = getMarkdownContent();
      if (!contentElement) {
        alert("Could not find content to convert to PDF");
        setIsLoading(false);
        return;
      }

      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.width = "210mm";
      container.style.padding = "20mm";
      container.style.backgroundColor = "white";
      container.style.fontFamily = "system-ui, -apple-system, sans-serif";
      container.style.fontSize = "12pt";
      container.style.lineHeight = "1.6";
      container.style.color = "#000";

      const clonedContent = contentElement.cloneNode(true) as HTMLElement;
      const elementsToRemove = clonedContent.querySelectorAll(
        ".no-print, button, .print-button, nav, .navigation, .sidebar, .dropdown, .tooltip"
      );
      elementsToRemove.forEach((el) => el.remove());

      const header = document.createElement("div");
      header.innerHTML = `
        <h1 style="margin: 0 0 16pt 0; font-size: 24pt; color: #1a1a1a;">${title}</h1>
        <p style="margin: 0 0 20pt 0; font-size: 10pt; color: #666; border-bottom: 1pt solid #ddd; padding-bottom: 12pt;">
          Generated from The Dev's Notebook - ${new Date().toLocaleDateString()}
        </p>
      `;

      container.appendChild(header);
      container.appendChild(clonedContent);
      document.body.appendChild(container);

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 170;
      const pageHeight = 257;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 20;

      pdf.addImage(imgData, "PNG", 20, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 20;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 20, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      document.body.removeChild(container);

      const fileName = title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      pdf.save(`${fileName}.pdf`);
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
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
          <Printer className="h-4 w-4" />
          {showLabel && <span className="ml-2">Print</span>}
          {isLoading && (
            <div className="ml-2 h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Print & Export</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handlePrint} disabled={isLoading}>
          <FileText className="mr-2 h-4 w-4" />
          Print Clean Version
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleSavePDF} disabled={isLoading}>
          <Download className="mr-2 h-4 w-4" />
          Download as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (showLabel) {
    return button;
  }

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
