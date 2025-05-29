"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface AccessibilityState {
  highContrastMode: boolean;
  reducedMotion: boolean;
  focusVisible: boolean;
  screenReaderMode: boolean;
  keyboardNavigation: boolean;
  fontSize: "small" | "medium" | "large" | "extra-large";
  fontFamily: "default" | "serif" | "mono";
  fullWidth: boolean;
  setHighContrastMode: (enabled: boolean) => void;
  setReducedMotion: (enabled: boolean) => void;
  setScreenReaderMode: (enabled: boolean) => void;
  setKeyboardNavigation: (enabled: boolean) => void;
  setFontSize: (size: "small" | "medium" | "large" | "extra-large") => void;
  setFontFamily: (family: "default" | "serif" | "mono") => void;
  setFullWidth: (enabled: boolean) => void;
  toggleHighContrast: () => void;
  toggleFullWidth: () => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
}

const AccessibilityContext = createContext<AccessibilityState | undefined>(
  undefined
);

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error(
      "useAccessibility must be used within an AccessibilityProvider"
    );
  }
  return context;
}

interface AccessibilityProviderProps {
  children: ReactNode;
}

export function AccessibilityProvider({
  children,
}: AccessibilityProviderProps) {
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [focusVisible, setFocusVisible] = useState(false);
  const [screenReaderMode, setScreenReaderMode] = useState(false);
  const [keyboardNavigation, setKeyboardNavigation] = useState(false);
  const [fontSize, setFontSize] = useState<
    "small" | "medium" | "large" | "extra-large"
  >("medium");
  const [fontFamily, setFontFamily] = useState<"default" | "serif" | "mono">(
    "default"
  );
  const [fullWidth, setFullWidth] = useState(false);

  useEffect(() => {
    const savedPreferences = localStorage.getItem("accessibility-preferences");
    if (savedPreferences) {
      try {
        const preferences = JSON.parse(savedPreferences);
        setHighContrastMode(preferences.highContrastMode || false);
        setReducedMotion(preferences.reducedMotion || false);
        setScreenReaderMode(preferences.screenReaderMode || false);
        setKeyboardNavigation(preferences.keyboardNavigation || false);
        setFontSize(preferences.fontSize || "medium");
        setFontFamily(preferences.fontFamily || "default");
        setFullWidth(preferences.fullWidth || false);
      } catch (error) {
        console.warn("Failed to parse accessibility preferences:", error);
      }
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleMediaChange);

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        setKeyboardNavigation(true);
        setFocusVisible(true);
      }
    };

    const handleMouseDown = () => {
      setFocusVisible(false);
    };

    document.addEventListener("keydown", handleTabKey);
    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
      document.removeEventListener("keydown", handleTabKey);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  useEffect(() => {
    const preferences = {
      highContrastMode,
      reducedMotion,
      screenReaderMode,
      keyboardNavigation,
      fontSize,
      fontFamily,
      fullWidth,
    };
    localStorage.setItem(
      "accessibility-preferences",
      JSON.stringify(preferences)
    );

    document.documentElement.setAttribute(
      "data-high-contrast",
      highContrastMode.toString()
    );
    document.documentElement.setAttribute(
      "data-reduced-motion",
      reducedMotion.toString()
    );
    document.documentElement.setAttribute(
      "data-screen-reader",
      screenReaderMode.toString()
    );
    document.documentElement.setAttribute(
      "data-keyboard-nav",
      keyboardNavigation.toString()
    );
    document.documentElement.setAttribute("data-font-size", fontSize);
    document.documentElement.setAttribute("data-font-family", fontFamily);
    document.documentElement.setAttribute(
      "data-full-width",
      fullWidth.toString()
    );

    if (reducedMotion) {
      document.documentElement.style.setProperty("--motion-duration", "0.01ms");
      document.documentElement.style.setProperty("--motion-distance", "0px");
    } else {
      document.documentElement.style.removeProperty("--motion-duration");
      document.documentElement.style.removeProperty("--motion-distance");
    }
  }, [
    highContrastMode,
    reducedMotion,
    screenReaderMode,
    keyboardNavigation,
    fontSize,
    fontFamily,
    fullWidth,
  ]);

  const toggleHighContrast = () => {
    setHighContrastMode(!highContrastMode);
  };

  const toggleFullWidth = () => {
    setFullWidth(!fullWidth);
  };

  const fontSizes = ["small", "medium", "large", "extra-large"] as const;

  const increaseFontSize = () => {
    const currentIndex = fontSizes.indexOf(fontSize);
    if (currentIndex < fontSizes.length - 1) {
      setFontSize(fontSizes[currentIndex + 1]);
    }
  };

  const decreaseFontSize = () => {
    const currentIndex = fontSizes.indexOf(fontSize);
    if (currentIndex > 0) {
      setFontSize(fontSizes[currentIndex - 1]);
    }
  };

  const contextValue: AccessibilityState = {
    highContrastMode,
    reducedMotion,
    focusVisible,
    screenReaderMode,
    keyboardNavigation,
    fontSize,
    fontFamily,
    fullWidth,
    setHighContrastMode,
    setReducedMotion,
    setScreenReaderMode,
    setKeyboardNavigation,
    setFontSize,
    setFontFamily,
    setFullWidth,
    toggleHighContrast,
    toggleFullWidth,
    increaseFontSize,
    decreaseFontSize,
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
    </AccessibilityContext.Provider>
  );
}
