"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import {
  Settings,
  Eye,
  Type,
  Minus,
  Plus,
  Volume2,
  Keyboard,
  X,
  Sun,
  MoonStar,
  Monitor,
  Maximize,
  AlignLeft,
  Printer,
} from "lucide-react";
import { useAccessibility } from "@/src/contexts/AccessibilityContext";
import { useTheme } from "next-themes";
import { cn } from "@/src/lib/utils";

interface SettingsPanelProps {
  className?: string;
  embedded?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export function SettingsPanel({
  className,
  embedded = false,
  isOpen: externalIsOpen,
  onClose,
}: SettingsPanelProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = onClose
    ? (open: boolean) => {
        if (!open) onClose();
      }
    : setInternalIsOpen;
  const {
    highContrastMode,
    screenReaderMode,
    keyboardNavigation,
    fontSize,
    fontFamily,
    fullWidth,
    toggleHighContrast,
    setScreenReaderMode,
    setKeyboardNavigation,
    setFontFamily,
    toggleFullWidth,
    increaseFontSize,
    decreaseFontSize,
  } = useAccessibility();

  const handleTogglePanel = () => {
    setIsOpen(!isOpen);
  };

  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", "polite");
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = message;
    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  const handleHighContrastToggle = () => {
    toggleHighContrast();
    announceToScreenReader(
      `High contrast mode ${!highContrastMode ? "enabled" : "disabled"}`
    );
  };

  const handleScreenReaderToggle = () => {
    const newState = !screenReaderMode;
    setScreenReaderMode(newState);
    announceToScreenReader(
      `Screen reader optimizations ${newState ? "enabled" : "disabled"}`
    );
  };

  const handleKeyboardNavToggle = () => {
    const newState = !keyboardNavigation;
    setKeyboardNavigation(newState);
    announceToScreenReader(
      `Keyboard navigation helpers ${newState ? "enabled" : "disabled"}`
    );
  };

  const handleFontSizeIncrease = () => {
    increaseFontSize();
    announceToScreenReader("Font size increased");
  };

  const handleFontSizeDecrease = () => {
    decreaseFontSize();
    announceToScreenReader("Font size decreased");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (isOpen && event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen]);

  const handleFontFamilyChange = (family: "default" | "serif" | "mono") => {
    setFontFamily(family);
    announceToScreenReader(`Font changed to ${family}`);
  };

  const handleFullWidthToggle = () => {
    toggleFullWidth();
    announceToScreenReader(
      `Full width mode ${!fullWidth ? "enabled" : "disabled"}`
    );
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    announceToScreenReader(`Theme changed to ${newTheme}`);
  };

  React.useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.altKey && event.key === "s") {
        event.preventDefault();
        setIsOpen(!isOpen);
        announceToScreenReader("Settings panel toggled");
      }
    };

    document.addEventListener("keydown", handleKeyboard);
    return () => document.removeEventListener("keydown", handleKeyboard);
  }, [isOpen]);

  return (
    <div className={cn(embedded ? "" : "fixed top-4 right-4 z-50", className)}>
      {externalIsOpen === undefined && (
        <Button
          onClick={handleTogglePanel}
          variant="outline"
          size="icon"
          className={cn(
            embedded ? "" : "shadow-lg border-2",
            "transition-all duration-200",
            embedded ? "" : "hover:scale-105 focus:scale-105",
            embedded
              ? "bg-transparent border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              : "bg-background/90 backdrop-blur-sm",
            isOpen &&
              (embedded
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700")
          )}
          aria-label={`${
            isOpen ? "Close" : "Open"
          } settings panel. Keyboard shortcut: Alt + S`}
          aria-expanded={isOpen}
          aria-controls="settings-panel"
        >
          {isOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Settings className="h-4 w-4" />
          )}
        </Button>
      )}

      {isOpen && (
        <div
          ref={panelRef}
          id="settings-panel"
          role="dialog"
          aria-label="Settings and accessibility options"
          className={cn(
            embedded
              ? "absolute bottom-2 left-0 w-80 z-[100]"
              : "absolute top-12 right-0 w-80",
            "rounded-lg border shadow-xl",
            "bg-background/95 backdrop-blur-md",
            "animate-in slide-in-from-top-2 fade-in-0 duration-200",
            "max-h-[80vh] md:max-h-[70vh] flex flex-col"
          )}
        >
          <div className="p-6 flex-1 overflow-y-auto scrollbar-thin space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Settings</h3>
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-muted-foreground" />
                {externalIsOpen !== undefined && onClose && (
                  <Button
                    onClick={() => setIsOpen(false)}
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    aria-label="Close settings panel"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Appearance Section */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Appearance
              </h4>

              {/* Theme Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Theme</label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    onClick={() => handleThemeChange("light")}
                    variant={theme === "light" ? "default" : "outline"}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Sun className="h-3 w-3" />
                    Light
                  </Button>
                  <Button
                    onClick={() => handleThemeChange("dark")}
                    variant={theme === "dark" ? "default" : "outline"}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <MoonStar className="h-3 w-3" />
                    Dark
                  </Button>
                  <Button
                    onClick={() => handleThemeChange("system")}
                    variant={theme === "system" ? "default" : "outline"}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Monitor className="h-3 w-3" />
                    Auto
                  </Button>
                </div>
              </div>

              {/* High Contrast */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <label
                    htmlFor="high-contrast"
                    className="text-sm font-medium"
                  >
                    High Contrast
                  </label>
                </div>
                <Button
                  id="high-contrast"
                  onClick={handleHighContrastToggle}
                  variant={highContrastMode ? "default" : "outline"}
                  size="sm"
                  aria-pressed={highContrastMode}
                  className="min-w-16"
                >
                  {highContrastMode ? "On" : "Off"}
                </Button>
              </div>
            </div>

            <Separator />

            {/* Typography Section */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Typography
              </h4>

              {/* Font Family */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Font Family</label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    onClick={() => handleFontFamilyChange("default")}
                    variant={fontFamily === "default" ? "default" : "outline"}
                    size="sm"
                    className="text-xs"
                  >
                    Default
                  </Button>
                  <Button
                    onClick={() => handleFontFamilyChange("serif")}
                    variant={fontFamily === "serif" ? "default" : "outline"}
                    size="sm"
                    className="text-xs font-serif"
                  >
                    Serif
                  </Button>
                  <Button
                    onClick={() => handleFontFamilyChange("mono")}
                    variant={fontFamily === "mono" ? "default" : "outline"}
                    size="sm"
                    className="text-xs font-mono"
                  >
                    Mono
                  </Button>
                </div>
              </div>

              {/* Font Size */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  <span className="text-sm font-medium">Font Size</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleFontSizeDecrease}
                    variant="outline"
                    size="sm"
                    disabled={fontSize === "small"}
                    aria-label="Decrease font size"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span
                    className="min-w-20 text-center text-xs bg-muted rounded px-2 py-1 capitalize"
                    aria-label={`Current font size: ${fontSize}`}
                  >
                    {fontSize}
                  </span>
                  <Button
                    onClick={handleFontSizeIncrease}
                    variant="outline"
                    size="sm"
                    disabled={fontSize === "extra-large"}
                    aria-label="Increase font size"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Layout Section */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Layout
              </h4>

              {/* Full Width */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Maximize className="h-4 w-4" />
                  <label htmlFor="full-width" className="text-sm font-medium">
                    Full Width
                  </label>
                </div>
                <Button
                  id="full-width"
                  onClick={handleFullWidthToggle}
                  variant={fullWidth ? "default" : "outline"}
                  size="sm"
                  aria-pressed={fullWidth}
                  className="min-w-16"
                >
                  {fullWidth ? "On" : "Off"}
                </Button>
              </div>
            </div>

            <Separator />

            {/* Print Section */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Print & Export
              </h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Printer className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Print Current Page
                    </span>
                  </div>
                  <Button
                    onClick={() => {
                      const contentElement =
                        document.querySelector('[data-content="markdown"]') ||
                        document.querySelector(".markdown-content") ||
                        document.querySelector("article");
                      if (contentElement) {
                        window.print();
                      } else {
                        alert("No content found to print");
                      }
                    }}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    Print
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Use the print button on any page for advanced options</p>
                  <p>• Print styles automatically hide navigation elements</p>
                  <p>• Clean mode removes all UI elements for pure content</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Accessibility Section */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Accessibility
              </h4>

              {/* Screen Reader Mode */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4" />
                  <label
                    htmlFor="screen-reader"
                    className="text-sm font-medium"
                  >
                    Screen Reader Mode
                  </label>
                </div>
                <Button
                  id="screen-reader"
                  onClick={handleScreenReaderToggle}
                  variant={screenReaderMode ? "default" : "outline"}
                  size="sm"
                  aria-pressed={screenReaderMode}
                  className="min-w-16"
                >
                  {screenReaderMode ? "On" : "Off"}
                </Button>
              </div>

              {/* Keyboard Navigation */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Keyboard className="h-4 w-4" />
                  <label htmlFor="keyboard-nav" className="text-sm font-medium">
                    Keyboard Navigation
                  </label>
                </div>
                <Button
                  id="keyboard-nav"
                  onClick={handleKeyboardNavToggle}
                  variant={keyboardNavigation ? "default" : "outline"}
                  size="sm"
                  aria-pressed={keyboardNavigation}
                  className="min-w-16"
                >
                  {keyboardNavigation ? "On" : "Off"}
                </Button>
              </div>
            </div>

            <div className="pt-2 border-t text-xs text-muted-foreground">
              Press Alt + S to toggle this panel
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
