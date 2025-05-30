"use client";

import { useState, useEffect, useCallback } from "react";

interface CacheStatus {
  isOnline: boolean;
  isServiceWorkerReady: boolean;
  cachedPages: string[];
  totalCachedItems: number;
}

export function useOfflineContent() {
  const [cacheStatus, setCacheStatus] = useState<CacheStatus>({
    isOnline: true,
    isServiceWorkerReady: false,
    cachedPages: [],
    totalCachedItems: 0,
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const updateOnlineStatus = () => {
      setCacheStatus((prev) => ({ ...prev, isOnline: navigator.onLine }));
    };

    updateOnlineStatus();
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then(() => {
        setCacheStatus((prev) => ({ ...prev, isServiceWorkerReady: true }));
        updateCacheStatus();
      });
    }
  }, []);

  const updateCacheStatus = useCallback(async () => {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      const messageChannel = new MessageChannel();

      messageChannel.port1.onmessage = (event) => {
        const totalItems = Object.values(
          event.data as Record<string, number>
        ).reduce((sum, count) => sum + count, 0);

        setCacheStatus((prev) => ({
          ...prev,
          totalCachedItems: totalItems,
        }));
      };

      navigator.serviceWorker.controller.postMessage(
        { type: "GET_CACHE_STATUS" },
        [messageChannel.port2]
      );
    }
  }, []);

  const cacheCurrentPage = useCallback(async () => {
    if (!cacheStatus.isServiceWorkerReady || !cacheStatus.isOnline) return;

    setIsLoading(true);

    try {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: "CACHE_CONTENT",
          url: window.location.pathname,
        });

        setTimeout(() => {
          updateCacheStatus();
          setIsLoading(false);
        }, 1000);
      }
    } catch (error) {
      console.error("Failed to cache current page:", error);
      setIsLoading(false);
    }
  }, [
    cacheStatus.isServiceWorkerReady,
    cacheStatus.isOnline,
    updateCacheStatus,
  ]);

  const cacheMultiplePages = useCallback(
    async (urls: string[]) => {
      if (!cacheStatus.isServiceWorkerReady || !cacheStatus.isOnline) return;

      setIsLoading(true);

      try {
        for (const url of urls) {
          if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
              type: "CACHE_CONTENT",
              url,
            });
          }
        }

        setTimeout(() => {
          updateCacheStatus();
          setIsLoading(false);
        }, 2000);
      } catch (error) {
        console.error("Failed to cache pages:", error);
        setIsLoading(false);
      }
    },
    [cacheStatus.isServiceWorkerReady, cacheStatus.isOnline, updateCacheStatus]
  );

  const clearCache = useCallback(async () => {
    if ("caches" in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
      updateCacheStatus();
    }
  }, [updateCacheStatus]);

  return {
    cacheStatus,
    isLoading,
    cacheCurrentPage,
    cacheMultiplePages,
    clearCache,
    updateCacheStatus,
  };
}
