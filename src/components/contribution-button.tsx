"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import {
  MessageSquare,
  Edit3,
  Heart,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { ContributionModal } from "./contribution-modal";
import { cn } from "@/src/lib/utils";
import { usePathname } from "next/navigation";

interface ContributionButtonProps {
  embedded?: boolean;
}

export function ContributionButton({
  embedded = false,
}: ContributionButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname === "/") return "Homepage";
    const parts = pathname.split("/").filter(Boolean);
    return parts
      .map((part) =>
        part
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      )
      .join(" - ");
  };

  const getPageUrl = () => {
    return typeof window !== "undefined" ? window.location.href : pathname;
  };

  const quickActions = [
    {
      id: "feedback",
      label: "Give Feedback",
      icon: MessageSquare,
      description: "Share your thoughts",
      onClick: () => setIsModalOpen(true),
    },
    {
      id: "improve",
      label: "Suggest Improvement",
      icon: Edit3,
      description: "Help us enhance content",
      onClick: () => setIsModalOpen(true),
    },
  ];

  return (
    <>
      {embedded ? (
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="outline"
          size="icon"
          className={cn(
            "h-8 w-8 rounded-md border-sidebar-border/50",
            "bg-sidebar-background/95 backdrop-blur-sm",
            "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            "hover:scale-105 transition-all duration-200",
            "focus-visible:ring-2 focus-visible:ring-sidebar-ring"
          )}
          aria-label="Help improve this content"
        >
          <Heart className="h-4 w-4" />
        </Button>
      ) : (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
          {/* Quick Action Buttons */}
          {isExpanded && (
            <div className="flex flex-col gap-2 animate-in slide-in-from-bottom-2 duration-200">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.id}
                    onClick={action.onClick}
                    variant="secondary"
                    size="sm"
                    className={cn(
                      "h-10 px-4 bg-background/95 backdrop-blur-sm border shadow-lg",
                      "hover:bg-accent hover:scale-105 transition-all duration-200",
                      "group relative overflow-hidden"
                    )}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Icon className="w-4 h-4 mr-2 relative z-10" />
                    <span className="relative z-10 text-sm font-medium">
                      {action.label}
                    </span>
                  </Button>
                );
              })}
            </div>
          )}

          {/* Main Contribution Button */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-30 group-hover:opacity-60 blur transition-all duration-300" />
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                "relative h-12 w-12 rounded-full p-0 bg-primary text-primary-foreground",
                "hover:scale-110 active:scale-95 transition-all duration-200",
                "shadow-lg hover:shadow-xl",
                "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              )}
              aria-label={
                isExpanded
                  ? "Hide contribution options"
                  : "Show contribution options"
              }
              aria-expanded={isExpanded}
            >
              <div className="relative flex items-center justify-center">
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 transition-transform duration-200" />
                ) : (
                  <Heart className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                )}
              </div>
            </Button>
          </div>

          {/* Tooltip for main button */}
          {!isExpanded && (
            <div className="absolute bottom-14 right-0 pointer-events-none">
              <div className="bg-popover/95 backdrop-blur-sm text-popover-foreground px-3 py-2 rounded-lg text-sm font-medium shadow-lg border opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Help improve this content
                <div className="absolute top-full right-4 w-2 h-2 bg-popover border-r border-b border-border rotate-45 -translate-y-1" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Contribution Modal */}
      <ContributionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pageUrl={getPageUrl()}
        pageTitle={getPageTitle()}
      />
    </>
  );
}
