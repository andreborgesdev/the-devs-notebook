"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MoreHorizontal,
  Bookmark,
  Settings,
  Heart,
  Download,
  Wifi,
  WifiOff,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/src/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { Badge } from "@/src/components/ui/badge";
import { useBookmarks } from "@/src/contexts/BookmarkContext";
import { useOfflineContent } from "@/src/hooks/use-offline-content";

const POPULAR_PAGES = [
  { title: "Java Cheat Sheet", url: "/java" },
  { title: "JavaScript Basics", url: "/javascript" },
  { title: "React Guide", url: "/react" },
  { title: "Algorithms", url: "/algorithms" },
  { title: "Data Structures", url: "/data-structures" },
  { title: "Design Patterns", url: "/design-patterns" },
  { title: "Quick Reference", url: "/quick-reference" },
];

interface SidebarActionsProps {
  isOpen: boolean;
  onSettingsClick: () => void;
  onContributionClick: () => void;
  onOfflineClick: () => void;
}

export function SidebarActions({
  isOpen,
  onSettingsClick,
  onContributionClick,
  onOfflineClick,
}: SidebarActionsProps) {
  const { bookmarks } = useBookmarks();
  const bookmarkCount = bookmarks.length;
  const [isOfflineDialogOpen, setIsOfflineDialogOpen] = useState(false);

  const {
    cacheStatus,
    isLoading,
    cacheCurrentPage,
    cacheMultiplePages,
    clearCache,
  } = useOfflineContent();

  const handleCachePopularContent = () => {
    const urls = POPULAR_PAGES.map((page) => page.url);
    cacheMultiplePages(urls);
  };

  const handleOfflineButtonClick = () => {
    setIsOfflineDialogOpen(true);
    onOfflineClick();
  };

  const actions = [
    {
      id: "offline",
      icon: cacheStatus.isOnline ? Download : WifiOff,
      label: "Offline Reading",
      onClick: handleOfflineButtonClick,
    },
    {
      id: "bookmarks",
      icon: Bookmark,
      label: "Bookmarks",
      href: "/bookmarks",
      badge: bookmarkCount > 0 ? bookmarkCount : undefined,
    },
    {
      id: "settings",
      icon: Settings,
      label: "Settings",
      onClick: onSettingsClick,
    },
    // {
    //   id: "contribution",
    //   icon: Heart,
    //   label: "Contribution",
    //   onClick: onContributionClick,
    // },
  ];

  return (
    <>
      {isOpen ? (
        <div className="flex items-center justify-between gap-1">
          {actions.map((action) => {
            const Icon = action.icon;

            const ButtonComponent = (
              <TooltipProvider key={action.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-md transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground relative"
                      onClick={action.onClick}
                      asChild={!!action.href}
                    >
                      {action.href ? (
                        <Link href={action.href}>
                          <Icon className="h-4 w-4" />
                          {action.badge && (
                            <div className="absolute -top-1 -right-1 h-2 w-2 bg-blue-500 rounded-full" />
                          )}
                        </Link>
                      ) : (
                        <>
                          <Icon className="h-4 w-4" />
                          {action.badge && (
                            <div className="absolute -top-1 -right-1 h-2 w-2 bg-blue-500 rounded-full" />
                          )}
                        </>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>
                      {action.label} {action.badge && `(${action.badge})`}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );

            return ButtonComponent;
          })}
        </div>
      ) : (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-md transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end" className="w-48">
              {actions.map((action) => {
                const Icon = action.icon;

                if (action.href) {
                  return (
                    <DropdownMenuItem key={action.id} asChild>
                      <Link
                        href={action.href}
                        className="flex items-center gap-2"
                      >
                        <Icon className="h-4 w-4" />
                        <span>{action.label}</span>
                        {action.badge && (
                          <span className="ml-auto text-xs bg-sidebar-accent px-1.5 py-0.5 rounded-full">
                            {action.badge}
                          </span>
                        )}
                      </Link>
                    </DropdownMenuItem>
                  );
                }

                return (
                  <DropdownMenuItem
                    key={action.id}
                    onClick={action.onClick}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{action.label}</span>
                    {action.badge && (
                      <span className="ml-auto text-xs bg-sidebar-accent px-1.5 py-0.5 rounded-full">
                        {action.badge}
                      </span>
                    )}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <Sheet open={isOfflineDialogOpen} onOpenChange={setIsOfflineDialogOpen}>
        <SheetContent side="left" className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              {cacheStatus.isOnline ? (
                <Wifi className="h-5 w-5" />
              ) : (
                <WifiOff className="h-5 w-5" />
              )}
              Offline Reading
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Status: {cacheStatus.isOnline ? "Online" : "Offline"}
              </span>
              <Badge variant="outline" className="text-xs">
                {cacheStatus.totalCachedItems} cached
              </Badge>
            </div>

            {cacheStatus.isOnline && (
              <div className="space-y-2">
                <Button
                  onClick={cacheCurrentPage}
                  disabled={isLoading || !cacheStatus.isServiceWorkerReady}
                  size="sm"
                  variant="outline"
                  className="w-full text-xs"
                >
                  {isLoading ? (
                    <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-3 w-3 mr-2" />
                  )}
                  Cache Current Page
                </Button>

                <Button
                  onClick={handleCachePopularContent}
                  disabled={isLoading || !cacheStatus.isServiceWorkerReady}
                  size="sm"
                  variant="outline"
                  className="w-full text-xs"
                >
                  {isLoading ? (
                    <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-3 w-3 mr-2" />
                  )}
                  Cache Popular Content
                </Button>
              </div>
            )}

            {cacheStatus.totalCachedItems > 0 && (
              <Button
                onClick={clearCache}
                size="sm"
                variant="outline"
                className="w-full text-xs text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3 mr-2" />
                Clear Cache
              </Button>
            )}

            {!cacheStatus.isOnline && (
              <div className="bg-muted/50 rounded-md p-3">
                <p className="text-xs text-muted-foreground">
                  You're offline. Cached content is available for reading.
                </p>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
