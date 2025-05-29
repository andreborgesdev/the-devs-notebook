"use client";

import React from "react";
import { cn } from "@/src/lib/utils";

export function SkipNavigation() {
  const skipLinks = [
    { href: "#main-content", text: "Skip to main content" },
    { href: "#sidebar-navigation", text: "Skip to navigation" },
    { href: "#search-bar", text: "Skip to search" },
    { href: "#table-of-contents", text: "Skip to table of contents" },
  ];

  return (
    <div className="sr-only focus-within:not-sr-only">
      <nav
        aria-label="Skip navigation links"
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] bg-background border-b shadow-lg",
          "transform -translate-y-full focus-within:translate-y-0",
          "transition-transform duration-200"
        )}
      >
        <div className="container mx-auto px-4 py-2">
          <ul className="flex gap-4 flex-wrap">
            {skipLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={cn(
                    "inline-block px-4 py-2 rounded-md font-medium",
                    "bg-primary text-primary-foreground",
                    "hover:bg-primary/90 focus:bg-primary/90",
                    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring",
                    "transition-colors duration-200"
                  )}
                  onFocus={(e) => {
                    // Announce to screen readers
                    const announcement = document.createElement("div");
                    announcement.setAttribute("aria-live", "polite");
                    announcement.className = "sr-only";
                    announcement.textContent = `Skip link: ${link.text}`;
                    document.body.appendChild(announcement);

                    setTimeout(() => {
                      document.body.removeChild(announcement);
                    }, 1000);
                  }}
                >
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
}
