"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { Input } from "@/src/components/ui/input";
import Link from "next/link";
import {
  SearchIcon,
  XIcon,
  Loader2,
  Clock,
  TrendingUp,
  FileText,
  Code,
  Database,
  Cpu,
  Filter,
  ArrowUp,
  ArrowDown,
  Hash,
} from "lucide-react";
import { useDebounce } from "@/src/hooks/use-debounce";
import { cn } from "@/src/lib/utils";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";

interface SearchResult {
  title: string;
  url: string;
  snippet?: string;
  category?: string;
  type?: string;
  score?: number;
}

interface SearchCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const searchCategories: SearchCategory[] = [
  {
    id: "all",
    name: "All",
    icon: SearchIcon,
    color: "bg-gradient-to-r from-blue-500 to-purple-500",
  },
  {
    id: "algorithms",
    name: "Algorithms",
    icon: TrendingUp,
    color: "bg-gradient-to-r from-green-500 to-emerald-500",
  },
  {
    id: "data-structures",
    name: "Data Structures",
    icon: Database,
    color: "bg-gradient-to-r from-orange-500 to-red-500",
  },
  {
    id: "java",
    name: "Java",
    icon: Code,
    color: "bg-gradient-to-r from-amber-500 to-yellow-500",
  },
  {
    id: "javascript",
    name: "JavaScript",
    icon: FileText,
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
  },
  {
    id: "computer-science",
    name: "CS Concepts",
    icon: Cpu,
    color: "bg-gradient-to-r from-cyan-500 to-blue-500",
  },
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const savedHistory = localStorage.getItem("search-history");
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveToHistory = useCallback(
    (searchQuery: string) => {
      if (!searchQuery.trim()) return;
      const newHistory = [
        searchQuery,
        ...searchHistory.filter((h) => h !== searchQuery),
      ].slice(0, 5);
      setSearchHistory(newHistory);
      localStorage.setItem("search-history", JSON.stringify(newHistory));
    },
    [searchHistory]
  );

  const fetchResults = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery) {
        setResults([]);
        setIsLoading(false);
        setSelectedIndex(-1);
        return;
      }

      setIsLoading(true);
      try {
        const categoryParam =
          selectedCategory !== "all" ? `&category=${selectedCategory}` : "";
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(searchQuery)}${categoryParam}`
        );
        if (!response.ok) {
          throw new Error("Search request failed");
        }
        const data: SearchResult[] = await response.json();
        setResults(data);
        setSelectedIndex(-1);
      } catch (error) {
        console.error("Failed to fetch search results:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedCategory]
  );

  useEffect(() => {
    fetchResults(debouncedQuery);
  }, [debouncedQuery, fetchResults]);

  const showResults =
    query.length > 0 ||
    results.length > 0 ||
    isLoading ||
    (showHistory && searchHistory.length > 0);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const totalItems =
        results.length +
        (searchHistory.length > 0 && !debouncedQuery
          ? searchHistory.length
          : 0);

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % totalItems);
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev <= 0 ? totalItems - 1 : prev - 1));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0) {
            if (!debouncedQuery && selectedIndex < searchHistory.length) {
              const historyItem = searchHistory[selectedIndex];
              setQuery(historyItem);
              saveToHistory(historyItem);
            } else {
              const resultIndex = !debouncedQuery
                ? selectedIndex - searchHistory.length
                : selectedIndex;
              const result = results[resultIndex];
              if (result) {
                saveToHistory(query);
                onClose();
                const searchParams = new URLSearchParams({ q: query.trim() });
                window.location.href = `${
                  result.url
                }?${searchParams.toString()}`;
              }
            }
          } else if (query.trim()) {
            saveToHistory(query);
          }
          break;
        case "Escape":
          onClose();
          break;
      }
    },
    [
      results,
      selectedIndex,
      searchHistory,
      debouncedQuery,
      query,
      saveToHistory,
      onClose,
    ]
  );

  const handleResultClick = (result: SearchResult) => {
    saveToHistory(query);
    onClose();
  };

  const getCategoryIcon = (category: string) => {
    const cat = searchCategories.find((c) => c.id === category);
    if (!cat) return null;
    const Icon = cat.icon;
    return <Icon className="w-3 h-3" />;
  };

  const getCategoryColor = (category: string) => {
    const cat = searchCategories.find((c) => c.id === category);
    return cat?.color || "bg-gray-500";
  };

  if (!isOpen || !isClient) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed left-1/2 top-16 -translate-x-1/2 w-full max-w-3xl px-4">
        <div className="bg-background border border-border rounded-2xl shadow-2xl overflow-hidden">
          {/* Header with Categories */}
          <div className="border-b border-border/50 p-4">
            <div className="flex items-center gap-2 mb-4">
              <SearchIcon className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Search Documentation
              </span>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="ml-auto h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              {searchCategories.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.id;
                return (
                  <Button
                    key={category.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {category.name}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Search Input */}
          <div className="relative p-4">
            <SearchIcon className="absolute left-7 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="search"
              placeholder="Type to search..."
              className="w-full pl-14 pr-4 py-3 text-lg border-0 bg-muted/30 focus:bg-background focus:ring-2 focus:ring-primary/20"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowHistory(!e.target.value && searchHistory.length > 0);
                setSelectedIndex(-1);
              }}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto scrollbar-thin">
            {/* Search History */}
            {!debouncedQuery && searchHistory.length > 0 && (
              <div className="px-4 pb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Recent Searches
                  </span>
                </div>
                <div className="space-y-1">
                  {searchHistory.map((historyItem, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setQuery(historyItem);
                        saveToHistory(historyItem);
                      }}
                      className={cn(
                        "w-full text-left p-3 rounded-lg hover:bg-accent/50 transition-colors flex items-center gap-3",
                        selectedIndex === index && "bg-accent"
                      )}
                    >
                      <Hash className="w-4 h-4 text-muted-foreground/60" />
                      <span className="text-sm">{historyItem}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading */}
            {isLoading && (
              <div className="p-8 text-center">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3 text-primary" />
                <p className="text-sm text-muted-foreground">
                  Searching through documentation...
                </p>
              </div>
            )}

            {/* No Results */}
            {!isLoading && debouncedQuery && results.length === 0 && (
              <div className="p-8 text-center">
                <SearchIcon className="w-8 h-8 mx-auto mb-3 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground mb-2">
                  No results found for "{debouncedQuery}"
                </p>
                <p className="text-xs text-muted-foreground/70">
                  Try different keywords or select another category
                </p>
              </div>
            )}

            {/* Results */}
            {results.length > 0 && (
              <div className="px-4 pb-4">
                {debouncedQuery && (
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">
                      {results.length} result{results.length !== 1 ? "s" : ""}{" "}
                      found
                    </span>
                  </div>
                )}

                <div className="space-y-2">
                  {results.map((result, index) => {
                    const isSelected =
                      selectedIndex ===
                      (searchHistory.length > 0 && !debouncedQuery
                        ? index + searchHistory.length
                        : index);
                    return (
                      <Link
                        key={result.url}
                        href={`${result.url}?q=${encodeURIComponent(
                          query.trim()
                        )}`}
                        onClick={() => handleResultClick(result)}
                        className={cn(
                          "block rounded-lg p-4 transition-all duration-200 border border-transparent",
                          isSelected
                            ? "bg-primary/10 border-primary/20"
                            : "hover:bg-accent/50"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          {result.category && (
                            <div
                              className={cn(
                                "flex items-center justify-center w-10 h-10 rounded-lg text-white text-sm font-medium",
                                getCategoryColor(result.category)
                              )}
                            >
                              {getCategoryIcon(result.category) ||
                                result.category.charAt(0).toUpperCase()}
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-foreground">
                                {result.title}
                              </h3>
                              {result.type && (
                                <Badge variant="secondary" className="text-xs">
                                  {result.type}
                                </Badge>
                              )}
                            </div>

                            {result.snippet && (
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                {result.snippet}
                              </p>
                            )}

                            <span className="text-xs text-muted-foreground/70">
                              {result.url}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-border/50 px-4 py-3 bg-muted/20">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <ArrowUp className="w-3 h-3" />
                  <ArrowDown className="w-3 h-3" />
                  <span>Navigate</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-background/50 rounded text-xs">
                    Enter
                  </kbd>
                  <span>Select</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-background/50 rounded text-xs">
                    Esc
                  </kbd>
                  <span>Close</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
