"use client";

import { useEffect, useState } from "react";
import { cn } from "@/src/lib/utils";

interface TableOfContentsItem {
  id: string;
  level: number;
  text: string;
}

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [items, setItems] = useState<TableOfContentsItem[]>([]);

  // Extract headers from markdown content
  useEffect(() => {
    const headingLines = content
      .split("\n")
      .filter((line) => line.startsWith("#"));

    const extractedItems = headingLines.map((line) => {
      const level = line.match(/^#+/)?.[0].length || 0;
      const text = line.replace(/^#+\s+/, "");
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      return { id, level, text };
    });

    setItems(extractedItems);
  }, [content]);

  // Handle intersection observer for active heading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -80% 0px" }
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
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (items.length === 0) return null;

  return (
    <nav className="fixed right-8 top-20 hidden w-64 xl:block">
      <h4 className="mb-4 font-medium">On This Page</h4>
      <ul className="space-y-2 text-sm">
        {items.map((item) => (
          <li
            key={item.id}
            style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
          >
            <button
              onClick={() => handleClick(item.id)}
              className={cn(
                "text-left hover:text-foreground text-muted-foreground",
                "transition-colors duration-200",
                activeId === item.id && "font-medium text-foreground"
              )}
            >
              {item.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
