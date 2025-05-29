"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { usePathname } from "next/navigation";

interface NavigationState {
  openSections: Set<string>;
  activePath: string;
  setOpenSections: (sections: Set<string>) => void;
  toggleSection: (sectionPath: string) => void;
  isMenuOpen: (sectionPath: string) => boolean;
  isActiveOrParent: (itemPath: string) => boolean;
}

const NavigationContext = createContext<NavigationState | undefined>(undefined);

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}

interface NavigationProviderProps {
  children: ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

  // Function to find all parent paths for a given path
  const getParentPaths = (path: string): string[] => {
    const segments = path.split("/").filter(Boolean);
    const parentPaths: string[] = [];

    for (let i = 0; i < segments.length - 1; i++) {
      const parentPath = "/" + segments.slice(0, i + 1).join("/");
      parentPaths.push(parentPath);
    }

    return parentPaths;
  };

  // Initialize open sections based on current path
  useEffect(() => {
    const savedOpenSections = localStorage.getItem("navigation-open-sections");
    let savedSections = new Set<string>();

    if (savedOpenSections) {
      try {
        const parsed = JSON.parse(savedOpenSections);
        savedSections = new Set(parsed);
      } catch (error) {
        console.warn("Failed to parse saved navigation state:", error);
      }
    }

    // Get parent paths for current page
    const currentParentPaths = getParentPaths(pathname);
    const currentParentSet = new Set(currentParentPaths);

    // Only keep saved sections that are still relevant (parent paths of current page or their ancestors)
    const relevantSavedSections = Array.from(savedSections).filter(
      (section) => {
        // Keep if it's a parent of current page
        if (currentParentSet.has(section)) return true;

        // Keep if current page is under this section
        if (pathname.startsWith(section + "/")) return true;

        // Keep if this section is under the same top-level as current page
        const currentTopLevel = currentParentPaths[0];
        if (currentTopLevel && section.startsWith(currentTopLevel + "/"))
          return true;

        return false;
      }
    );

    // Combine relevant saved sections with required parent paths
    const finalOpenSections = new Set([
      ...currentParentPaths,
      ...relevantSavedSections,
    ]);

    setOpenSections(finalOpenSections);
  }, [pathname]);

  // Save to localStorage whenever openSections changes
  useEffect(() => {
    localStorage.setItem(
      "navigation-open-sections",
      JSON.stringify(Array.from(openSections))
    );
  }, [openSections]);

  const toggleSection = (sectionPath: string) => {
    setOpenSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionPath)) {
        newSet.delete(sectionPath);
      } else {
        newSet.add(sectionPath);
      }
      return newSet;
    });
  };

  const isMenuOpen = (sectionPath: string): boolean => {
    return openSections.has(sectionPath);
  };

  const isActiveOrParent = (itemPath: string): boolean => {
    return pathname === itemPath || pathname.startsWith(itemPath + "/");
  };

  const value: NavigationState = {
    openSections,
    activePath: pathname,
    setOpenSections,
    toggleSection,
    isMenuOpen,
    isActiveOrParent,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}
