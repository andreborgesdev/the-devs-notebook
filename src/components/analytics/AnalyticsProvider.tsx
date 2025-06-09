"use client";

import { useEffect } from "react";
import { usePageTracking } from "@/src/hooks/usePageTracking";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  usePageTracking();

  return <>{children}</>;
}
