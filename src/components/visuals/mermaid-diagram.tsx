"use client";

import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Copy, Download, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { useToast } from "@/src/hooks/use-toast";

interface MermaidDiagramProps {
  chart: string;
  title?: string;
  description?: string;
  className?: string;
  theme?: "default" | "dark" | "forest" | "neutral";
  interactive?: boolean;
  height?: number;
}

export function MermaidDiagram({
  chart,
  title,
  description,
  className,
  theme = "default",
  interactive = true,
  height = 400,
}: MermaidDiagramProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    if (!elementRef.current) return;

    const renderDiagram = async () => {
      try {
        setIsLoading(true);
        setError(null);

        mermaid.initialize({
          startOnLoad: false,
          theme: theme,
          securityLevel: "loose",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          themeVariables: {
            primaryColor: "#3b82f6",
            primaryTextColor: "#1f2937",
            primaryBorderColor: "#e5e7eb",
            lineColor: "#6b7280",
            sectionBkgColor: "#f9fafb",
            altSectionBkgColor: "#ffffff",
            gridColor: "#e5e7eb",
            secondaryColor: "#f3f4f6",
            tertiaryColor: "#ffffff",
          },
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: "basis",
          },
          sequence: {
            useMaxWidth: true,
            wrap: true,
          },
          gantt: {
            useMaxWidth: true,
          },
        });

        const graphId = `mermaid-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`;

        elementRef.current.innerHTML = "";

        const { svg } = await mermaid.render(graphId, chart);
        elementRef.current.innerHTML = svg;

        const svgElement = elementRef.current.querySelector("svg");
        if (svgElement) {
          svgElement.style.maxWidth = "100%";
          svgElement.style.height = "auto";
          svgElement.style.transform = `scale(${scale})`;
          svgElement.style.transformOrigin = "top left";
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Mermaid rendering error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to render diagram"
        );
        setIsLoading(false);
      }
    };

    renderDiagram();
  }, [chart, theme, scale]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(chart);
      toast({
        title: "Copied!",
        description: "Diagram code copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy diagram code",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const svgElement = elementRef.current?.querySelector("svg");
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      const link = document.createElement("a");
      link.download = `${
        title?.replace(/\s+/g, "-").toLowerCase() || "diagram"
      }.png`;
      link.href = canvas.toDataURL();
      link.click();
    };

    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.5));
  const handleReset = () => setScale(1);

  return (
    <Card className={cn("overflow-hidden", className)}>
      {(title || description || interactive) && (
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              {title && <CardTitle className="text-lg">{title}</CardTitle>}
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
            {interactive && (
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomOut}
                  disabled={scale <= 0.5}
                >
                  <ZoomOut className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  disabled={scale === 1}
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomIn}
                  disabled={scale >= 2}
                >
                  <ZoomIn className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  <Copy className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
      )}
      <CardContent className="p-4">
        <div
          className={cn(
            "relative overflow-auto border rounded-lg bg-white dark:bg-gray-50",
            isLoading && "animate-pulse bg-gray-100"
          )}
          style={{ height: `${height}px` }}
        >
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-sm text-muted-foreground">
                Rendering diagram...
              </div>
            </div>
          )}
          {error && (
            <div className="flex items-center justify-center h-full p-4">
              <div className="text-center">
                <p className="text-sm text-red-600 mb-2">
                  Failed to render diagram
                </p>
                <p className="text-xs text-muted-foreground">{error}</p>
              </div>
            </div>
          )}
          <div
            ref={elementRef}
            className={cn(
              "w-full h-full flex items-center justify-center",
              (isLoading || error) && "hidden"
            )}
          />
        </div>
        {interactive && scale !== 1 && (
          <div className="mt-2 text-xs text-muted-foreground text-center">
            Zoom: {Math.round(scale * 100)}%
          </div>
        )}
      </CardContent>
    </Card>
  );
}
