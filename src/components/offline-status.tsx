"use client";

import { useState, useEffect } from "react";
import { Wifi, WifiOff, Download } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";

export function OfflineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [isServiceWorkerReady, setIsServiceWorkerReady] = useState(false);
  const [cacheStatus, setCacheStatus] = useState<Record<string, number>>({});

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then(() => {
        setIsServiceWorkerReady(true);
      });
    }
  }, []);

  const cacheCurrentPage = async () => {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "CACHE_CONTENT",
        url: window.location.pathname,
      });
    }
  };

  const getCacheStatus = async () => {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      const messageChannel = new MessageChannel();

      messageChannel.port1.onmessage = (event) => {
        setCacheStatus(event.data);
      };

      navigator.serviceWorker.controller.postMessage(
        { type: "GET_CACHE_STATUS" },
        [messageChannel.port2]
      );
    }
  };

  useEffect(() => {
    getCacheStatus();
  }, [isServiceWorkerReady]);

  const totalCachedItems = Object.values(cacheStatus).reduce(
    (sum, count) => sum + count,
    0
  );

  return (
    <div className="flex items-center space-x-2">
      <Badge variant={isOnline ? "default" : "secondary"} className="text-xs">
        {isOnline ? (
          <>
            <Wifi className="h-3 w-3 mr-1" />
            Online
          </>
        ) : (
          <>
            <WifiOff className="h-3 w-3 mr-1" />
            Offline
          </>
        )}
      </Badge>

      {isServiceWorkerReady && (
        <>
          <Badge variant="outline" className="text-xs">
            {totalCachedItems} cached
          </Badge>

          {isOnline && (
            <Button
              onClick={cacheCurrentPage}
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs"
            >
              <Download className="h-3 w-3 mr-1" />
              Cache page
            </Button>
          )}
        </>
      )}
    </div>
  );
}
