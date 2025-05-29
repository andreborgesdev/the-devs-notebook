"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/src/lib/utils";
import { ChevronDown, List } from "lucide-react";
import { generateUniqueHeadingIds, HeadingItem } from "@/src/lib/heading-utils";

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [items, setItems] = useState<HeadingItem[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Extract headers from markdown content using shared utility
  useEffect(() => {
    const { headingItems } = generateUniqueHeadingIds(content);
    setItems(headingItems);
  }, [content]);

  // Handle intersection observer for active heading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Don't update active state if we're currently scrolling from a click
        if (isScrollingRef.current) return;

        // Find all currently intersecting headings
        const visibleHeadings = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => ({
            id: entry.target.id,
            top: entry.boundingClientRect.top,
            element: entry.target,
          }))
          .sort((a, b) => a.top - b.top);

        if (visibleHeadings.length > 0) {
          // Use the first visible heading (closest to top)
          setActiveId(visibleHeadings[0].id);
        } else {
          // If no headings are visible, find the closest one above the viewport
          const allHeadings = Array.from(
            document.querySelectorAll("h1, h2, h3, h4, h5, h6")
          )
            .map((heading) => ({
              id: heading.id,
              top: heading.getBoundingClientRect().top,
              element: heading,
            }))
            .filter((heading) => heading.id); // Only headings with IDs

          const headingsAbove = allHeadings.filter(
            (heading) => heading.top < 100
          );

          if (headingsAbove.length > 0) {
            // Use the last heading above the viewport
            const lastHeadingAbove = headingsAbove[headingsAbove.length - 1];
            setActiveId(lastHeadingAbove.id);
          }
        }
      },
      {
        rootMargin: "-100px 0px -60% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
    headings.forEach((heading) => observer.observe(heading));

    return () => {
      headings.forEach((heading) => observer.unobserve(heading));
    };
  }, [items]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Set scrolling flag to prevent intersection observer from overriding
      isScrollingRef.current = true;

      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Immediately set the active state
      setActiveId(id);

      // Scroll to the element
      element.scrollIntoView({ behavior: "smooth" });

      // Reset scrolling flag after animation completes
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, 1000); // Give enough time for smooth scroll to complete
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Add a small delay before collapsing to prevent flickering
    hoverTimeoutRef.current = setTimeout(() => {
      if (!isExpanded) {
        setIsHovered(false);
      }
    }, 200);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (items.length === 0) return null;

  return (
    <nav
      className="fixed right-8 top-20 hidden w-64 xl:block z-10"
      aria-label="Table of contents"
      role="navigation"
    >
      <div className="sticky top-20">
        <div
          className="relative group"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg blur opacity-50" />
          <div className="relative bg-background/90 backdrop-blur-sm border border-border/50 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            {/* Header with toggle button */}
            <div className="flex items-center justify-between p-4 border-b border-border/30">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                <h4 className="font-semibold text-foreground text-sm">
                  On This Page
                </h4>
              </div>
              <button
                onClick={toggleExpanded}
                className="p-1 rounded-md hover:bg-accent/50 transition-colors duration-200 focus-visible-enhanced"
                aria-label={
                  isExpanded
                    ? "Collapse table of contents"
                    : "Expand table of contents"
                }
                aria-expanded={isExpanded}
                aria-controls="toc-content"
              >
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-muted-foreground transition-transform duration-200",
                    isExpanded || isHovered ? "rotate-0" : "-rotate-90"
                  )}
                />
              </button>
            </div>

            {/* Collapsible content */}
            <div
              id="toc-content"
              className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                isExpanded || isHovered
                  ? "max-h-[70vh] opacity-100"
                  : "max-h-0 opacity-0"
              )}
              aria-hidden={!isExpanded && !isHovered}
            >
              <div className="overflow-y-auto max-h-[60vh] p-4 pt-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                <ul className="space-y-1 text-sm pr-2" role="list">
                  {items.map((item, index) => (
                    <li
                      key={item.id}
                      style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
                      role="listitem"
                    >
                      <button
                        onClick={() => handleClick(item.id)}
                        className={cn(
                          "w-full text-left hover:text-blue-600 dark:hover:text-blue-400 text-muted-foreground",
                          "transition-all duration-200 hover:translate-x-1 relative group/item py-1 px-2 rounded-md hover:bg-accent/30 focus-visible-enhanced",
                          "before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-0 before:h-0.5 before:bg-gradient-to-r before:from-blue-500 before:to-purple-500 before:transition-all before:duration-200",
                          activeId === item.id &&
                            "font-medium text-blue-600 dark:text-blue-400 before:w-3 bg-blue-50/50 dark:bg-blue-900/20"
                        )}
                        aria-label={`Go to section: ${item.text}`}
                        aria-current={
                          activeId === item.id ? "location" : undefined
                        }
                      >
                        <span className="block pl-4 truncate">{item.text}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Collapsed state indicator */}
            {!isExpanded && !isHovered && (
              <div className="p-4 pt-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <List className="w-3 h-3" />
                  <span>{items.length} sections</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
