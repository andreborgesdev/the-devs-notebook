"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface SearchScrollerProps {
  contentSelector?: string;
}

export function SearchScroller({
  contentSelector = ".prose, .markdown-content, main",
}: SearchScrollerProps) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q");

  useEffect(() => {
    if (!searchQuery) return;

    const contentElement = document.querySelector(contentSelector);
    if (!contentElement) return;

    const findTextPosition = (element: Element, query: string) => {
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          const tagName = parent.tagName.toLowerCase();
          if (["script", "style", "noscript"].includes(tagName)) {
            return NodeFilter.FILTER_REJECT;
          }
          if (parent.closest("pre, code")) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        },
      });

      const queryTerms = query
        .toLowerCase()
        .split(/\s+/)
        .filter((term) => term.length > 1);

      let bestMatch: { node: Text; position: number; score: number } | null =
        null;

      let node;
      while ((node = walker.nextNode())) {
        const textNode = node as Text;
        const text = textNode.textContent || "";
        const textLower = text.toLowerCase();

        for (const term of queryTerms) {
          const index = textLower.indexOf(term);
          if (index !== -1) {
            const score = term.length;
            if (!bestMatch || score > bestMatch.score) {
              bestMatch = { node: textNode, position: index, score };
            }
          }
        }
      }

      return bestMatch;
    };

    setTimeout(() => {
      const match = findTextPosition(contentElement, searchQuery);
      if (match) {
        const range = document.createRange();
        range.setStart(match.node, match.position);
        range.setEnd(match.node, match.position + 1);

        const rect = range.getBoundingClientRect();
        const headerHeight = 100;
        const elementPosition = rect.top + window.pageYOffset;
        const offsetPosition = elementPosition - headerHeight;

        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: "smooth",
        });
      }
    }, 100);
  }, [searchQuery, contentSelector]);

  return null;
}
