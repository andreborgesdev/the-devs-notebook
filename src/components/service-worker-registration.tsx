"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const registerSW = async () => {
        try {
          const registration = await navigator.serviceWorker.register(
            "/sw.js",
            {
              scope: "/",
            }
          );

          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  if (
                    confirm("A new version is available. Reload to update?")
                  ) {
                    window.location.reload();
                  }
                }
              });
            }
          });

          if (registration.waiting) {
            if (confirm("A new version is available. Reload to update?")) {
              registration.waiting.postMessage({ type: "SKIP_WAITING" });
              window.location.reload();
            }
          }

          console.log("ServiceWorker registration successful");
        } catch (error) {
          console.log("ServiceWorker registration failed:", error);
        }
      };

      registerSW();
    }
  }, []);

  return null;
}
