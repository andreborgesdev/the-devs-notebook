import { useEffect, useRef, RefObject } from "react";

export type KeyboardHandler = (event: KeyboardEvent) => void;

export interface UseKeyboardNavigationOptions {
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onEnter?: () => void;
  onEscape?: () => void;
  onSpace?: () => void;
  onTab?: () => void;
  onShiftTab?: () => void;
  onHome?: () => void;
  onEnd?: () => void;
  onPageUp?: () => void;
  onPageDown?: () => void;
  enabled?: boolean;
}

export function useKeyboardNavigation(
  elementRef: RefObject<HTMLElement>,
  options: UseKeyboardNavigationOptions = {}
) {
  const {
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onEnter,
    onEscape,
    onSpace,
    onTab,
    onShiftTab,
    onHome,
    onEnd,
    onPageUp,
    onPageDown,
    enabled = true,
  } = options;

  useEffect(() => {
    if (!enabled) return;

    const element = elementRef.current;
    if (!element) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          onArrowUp?.();
          break;
        case "ArrowDown":
          event.preventDefault();
          onArrowDown?.();
          break;
        case "ArrowLeft":
          event.preventDefault();
          onArrowLeft?.();
          break;
        case "ArrowRight":
          event.preventDefault();
          onArrowRight?.();
          break;
        case "Enter":
          onEnter?.();
          break;
        case "Escape":
          onEscape?.();
          break;
        case " ":
          if (onSpace) {
            event.preventDefault();
            onSpace();
          }
          break;
        case "Tab":
          if (event.shiftKey && onShiftTab) {
            onShiftTab();
          } else if (onTab) {
            onTab();
          }
          break;
        case "Home":
          event.preventDefault();
          onHome?.();
          break;
        case "End":
          event.preventDefault();
          onEnd?.();
          break;
        case "PageUp":
          event.preventDefault();
          onPageUp?.();
          break;
        case "PageDown":
          event.preventDefault();
          onPageDown?.();
          break;
      }
    };

    element.addEventListener("keydown", handleKeyDown);
    return () => element.removeEventListener("keydown", handleKeyDown);
  }, [
    enabled,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onEnter,
    onEscape,
    onSpace,
    onTab,
    onShiftTab,
    onHome,
    onEnd,
    onPageUp,
    onPageDown,
  ]);
}

export function useFocusManagement() {
  const focusedElementRef = useRef<HTMLElement | null>(null);

  const saveFocus = () => {
    focusedElementRef.current = document.activeElement as HTMLElement;
  };

  const restoreFocus = () => {
    if (focusedElementRef.current) {
      focusedElementRef.current.focus();
    }
  };

  const focusFirst = (container: HTMLElement) => {
    const focusableElements = getFocusableElements(container);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  };

  const focusLast = (container: HTMLElement) => {
    const focusableElements = getFocusableElements(container);
    if (focusableElements.length > 0) {
      focusableElements[focusableElements.length - 1].focus();
    }
  };

  return {
    saveFocus,
    restoreFocus,
    focusFirst,
    focusLast,
  };
}

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "textarea:not([disabled])",
    "select:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
    "audio[controls]",
    "video[controls]",
    "details > summary",
  ].join(", ");

  return Array.from(container.querySelectorAll(focusableSelectors)).filter(
    (element) => {
      const htmlElement = element as HTMLElement;
      return (
        htmlElement.offsetParent !== null &&
        !htmlElement.hasAttribute("aria-hidden") &&
        !htmlElement.closest('[aria-hidden="true"]')
      );
    }
  ) as HTMLElement[];
}

export function trapFocus(container: HTMLElement) {
  const focusableElements = getFocusableElements(container);

  if (focusableElements.length === 0) return () => {};

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Tab") {
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  container.addEventListener("keydown", handleKeyDown);
  firstElement.focus();

  return () => {
    container.removeEventListener("keydown", handleKeyDown);
  };
}

export function announceToScreenReader(
  message: string,
  priority: "polite" | "assertive" = "polite"
) {
  const announcement = document.createElement("div");
  announcement.setAttribute("aria-live", priority);
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    if (document.body.contains(announcement)) {
      document.body.removeChild(announcement);
    }
  }, 1000);
}
