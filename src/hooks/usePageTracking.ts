"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackPageView, trackContentView } from "@/src/lib/analytics";

export function usePageTracking() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      trackPageView(pathname);

      // Track specific content views
      if (pathname.includes("/java/")) {
        trackContentView("java", pathname);
      } else if (pathname.includes("/javascript/")) {
        trackContentView("javascript", pathname);
      } else if (pathname.includes("/system-design/")) {
        trackContentView("system-design", pathname);
      } else if (pathname.includes("/algorithms/")) {
        trackContentView("algorithms", pathname);
      } else if (pathname.includes("/cheat-sheet")) {
        trackContentView("cheat-sheet", pathname);
      } else if (pathname.includes("/interview")) {
        trackContentView("interview-prep", pathname);
      }
    }
  }, [pathname]);
}
