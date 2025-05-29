"use client";

import { useEffect } from "react";
import { useAccessibility } from "@/src/contexts/AccessibilityContext";

interface AccessibilityWrapperProps {
  children: React.ReactNode;
}

export function AccessibilityWrapper({ children }: AccessibilityWrapperProps) {
  const {
    highContrastMode,
    reducedMotion,
    screenReaderMode,
    keyboardNavigation,
    fontSize,
  } = useAccessibility();

  useEffect(() => {
    const htmlElement = document.documentElement;
    const bodyElement = document.body;

    if (highContrastMode) {
      htmlElement.setAttribute("data-high-contrast", "true");
    } else {
      htmlElement.removeAttribute("data-high-contrast");
    }

    if (reducedMotion) {
      htmlElement.setAttribute("data-reduced-motion", "true");
    } else {
      htmlElement.removeAttribute("data-reduced-motion");
    }

    if (screenReaderMode) {
      htmlElement.setAttribute("data-screen-reader", "true");
    } else {
      htmlElement.removeAttribute("data-screen-reader");
    }

    if (keyboardNavigation) {
      htmlElement.setAttribute("data-keyboard-nav", "true");
    } else {
      htmlElement.removeAttribute("data-keyboard-nav");
    }

    htmlElement.setAttribute("data-font-size", fontSize);

    bodyElement.className = bodyElement.className.replace(
      /data-font-size-\w+/g,
      ""
    );
    bodyElement.classList.add(`data-font-size-${fontSize}`);
  }, [
    highContrastMode,
    reducedMotion,
    screenReaderMode,
    keyboardNavigation,
    fontSize,
  ]);

  return <>{children}</>;
}
