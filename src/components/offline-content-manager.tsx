"use client";

import { useState } from "react";
import { Download, Trash2, Wifi, WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { useOfflineContent } from "@/src/hooks/use-offline-content";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/src/components/ui/collapsible";

const POPULAR_PAGES = [
  { title: "Java Cheat Sheet", url: "/java" },
  { title: "JavaScript Basics", url: "/javascript" },
  { title: "React Guide", url: "/react" },
  { title: "Algorithms", url: "/algorithms" },
  { title: "Data Structures", url: "/data-structures" },
  { title: "Design Patterns", url: "/design-patterns" },
  { title: "Quick Reference", url: "/quick-reference" },
];

export function OfflineContentManager({
  isOpen: sidebarOpen = true,
}: {
  isOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
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

  if (!sidebarOpen) {
    return (
      <Button
        variant="ghost"
        className="w-full justify-center p-2"
        title="Offline Reading"
      >
        {cacheStatus.isOnline ? (
          <Wifi className="h-4 w-4" />
        ) : (
          <WifiOff className="h-4 w-4" />
        )}
      </Button>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-sm font-medium"
        >
          {cacheStatus.isOnline ? (
            <Wifi className="h-4 w-4" />
          ) : (
            <WifiOff className="h-4 w-4" />
          )}
          Offline Reading
          <Badge variant="secondary" className="ml-auto">
            {cacheStatus.totalCachedItems}
          </Badge>
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="space-y-2 px-4 pb-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Status: {cacheStatus.isOnline ? "Online" : "Offline"}
            </span>
            <Badge variant="outline" className="text-xs">
              {cacheStatus.totalCachedItems} cached
            </Badge>
          </div>

          {cacheStatus.isOnline && (
            <>
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
            </>
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
            <div className="bg-muted/50 rounded-md p-2">
              <p className="text-xs text-muted-foreground">
                You're offline. Cached content is available for reading.
              </p>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
