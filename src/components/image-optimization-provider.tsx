"use client";

import { useImageOptimization } from "@/src/hooks/useImageOptimization";

export function ImageOptimizationProvider() {
  useImageOptimization();
  return null;
}
