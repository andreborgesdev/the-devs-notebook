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

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const [isClient, setIsClient] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Ensure we're on the client side for portal
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate dropdown position when focused
  useEffect(() => {
    if (isFocused && searchContainerRef.current) {
      const rect = searchContainerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
      });
    }
  }, [isFocused]);

  // Update position on window resize and scroll
  useEffect(() => {
    const updatePosition = () => {
      if (isFocused && searchContainerRef.current) {
        const rect = searchContainerRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + 8,
          left: rect.left,
          width: rect.width,
        });
      }
    };

    if (isFocused) {
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);
      return () => {
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition, true);
      };
    }
  }, [isFocused]);

  // Load search history from localStorage
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

  // Auto-scroll to selected item
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      // Use requestAnimationFrame to ensure DOM is fully updated
      requestAnimationFrame(() => {
        const selectedElement = resultsRef.current?.querySelector(
          `[data-search-index="${selectedIndex}"]`
        ) as HTMLElement;

        if (selectedElement) {
          // Use scrollIntoView for reliable scrolling behavior
          selectedElement.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "nearest",
          });
        }
      });
    }
  }, [selectedIndex]);

  const showResults =
    isFocused &&
    (query.length > 0 ||
      results.length > 0 ||
      isLoading ||
      (showHistory && searchHistory.length > 0));

  // Close search modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Element;

      if (!isFocused) return;

      const isClickInsideSearch = searchContainerRef.current?.contains(target);
      const isClickInsideResults = resultsRef.current?.contains(target);

      if (!isClickInsideSearch && !isClickInsideResults) {
        setIsFocused(false);
        setSelectedIndex(-1);
        setShowHistory(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isFocused]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showResults) return;

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
          setIsFocused(false);
          setSelectedIndex(-1);
          setShowHistory(false);
          inputRef.current?.blur();
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
      showResults,
    ]
  ); // Added showResults to dependencies

  // Add keyboard shortcut listener
  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        setIsFocused(true);
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, []);

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsLoading(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    setIsFocused(true);
    setShowHistory(!debouncedQuery && searchHistory.length > 0);
  };

  const handleBlur = () => {
    // Let click-outside handler manage closing the search
    // This prevents conflicts between blur and click events
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowHistory(!value && searchHistory.length > 0);
    setSelectedIndex(-1);
  };

  const handleResultClick = (result: SearchResult) => {
    saveToHistory(query);
    setIsFocused(false);
    setSelectedIndex(-1);
    setShowHistory(false);
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

  // Search Results Component (for portal)
  const SearchResults = () => (
    <div
      ref={resultsRef}
      id="search-results"
      className="fixed rounded-xl border border-border/50 bg-background/95 backdrop-blur-md shadow-2xl max-h-96 overflow-hidden"
      style={{
        top: dropdownPosition.top,
        left: dropdownPosition.left,
        width: dropdownPosition.width,
        zIndex: 9999,
      }}
      role="listbox"
      aria-label="Search results"
    >
      <div className="overflow-y-auto max-h-96 scrollbar-thin scrollbar-thumb-border">
        {/* Search History */}
        {!debouncedQuery && searchHistory.length > 0 && (
          <div className="p-3 border-b border-border/30">
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
                  data-search-index={index}
                  onClick={() => {
                    setQuery(historyItem);
                    saveToHistory(historyItem);
                  }}
                  className={cn(
                    "w-full text-left p-2 rounded-lg hover:bg-accent/50 transition-colors duration-200 flex items-center gap-3",
                    selectedIndex === index && "bg-accent"
                  )}
                >
                  <Hash className="w-3.5 h-3.5 text-muted-foreground/60" />
                  <span className="text-sm">{historyItem}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && results.length === 0 && (
          <div className="p-6 text-center">
            <Loader2
              className="w-6 h-6 animate-spin mx-auto mb-3 text-primary"
              aria-hidden="true"
            />
            <p className="text-sm text-muted-foreground" aria-live="polite">
              Searching through documentation...
            </p>
          </div>
        )}

        {/* No Results */}
        {!isLoading && debouncedQuery && results.length === 0 && (
          <div className="p-6 text-center">
            <SearchIcon className="w-8 h-8 mx-auto mb-3 text-muted-foreground/50" />
            <p
              className="text-sm text-muted-foreground mb-2"
              aria-live="polite"
            >
              No results found for "{debouncedQuery}"
            </p>
            <p className="text-xs text-muted-foreground/70">
              Try adjusting your search terms or selecting a different category
            </p>
          </div>
        )}

        {/* Search Results */}
        {results.length > 0 && (
          <div className="p-2">
            {debouncedQuery && (
              <div className="flex items-center gap-2 px-3 py-2 mb-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  {results.length} result{results.length !== 1 ? "s" : ""} found
                </span>
              </div>
            )}

            <ul className="space-y-1" role="listbox">
              {results.map((result, index) => {
                const isSelected =
                  selectedIndex ===
                  (searchHistory.length > 0 && !debouncedQuery
                    ? index + searchHistory.length
                    : index);
                return (
                  <li
                    key={result.url}
                    role="option"
                    aria-selected={isSelected}
                    data-search-index={
                      searchHistory.length > 0 && !debouncedQuery
                        ? index + searchHistory.length
                        : index
                    }
                  >
                    <Link
                      href={`${result.url}?q=${encodeURIComponent(
                        query.trim()
                      )}`}
                      onClick={() => handleResultClick(result)}
                      className={cn(
                        "block rounded-lg p-3 transition-all duration-200 group focus-visible-enhanced border border-transparent",
                        isSelected
                          ? "bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20"
                          : "hover:bg-gradient-to-r hover:from-accent/50 hover:to-accent/30"
                      )}
                      aria-describedby={
                        result.snippet ? `snippet-${index}` : undefined
                      }
                    >
                      <div className="flex items-start gap-3">
                        {result.category && (
                          <div
                            className={cn(
                              "flex items-center justify-center w-8 h-8 rounded-lg text-white text-xs font-medium",
                              getCategoryColor(result.category)
                            )}
                          >
                            {getCategoryIcon(result.category) ||
                              result.category.charAt(0).toUpperCase()}
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3
                              className={cn(
                                "font-medium text-foreground group-hover:text-primary transition-colors truncate",
                                isSelected && "text-primary"
                              )}
                            >
                              {result.title}
                            </h3>
                            {result.type && (
                              <Badge variant="secondary" className="text-xs">
                                {result.type}
                              </Badge>
                            )}
                          </div>

                          {result.snippet && (
                            <p
                              id={`snippet-${index}`}
                              className="text-sm text-muted-foreground line-clamp-2 leading-relaxed"
                              title={result.snippet}
                            >
                              {result.snippet}
                            </p>
                          )}

                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-muted-foreground/70 truncate">
                              {result.url}
                            </span>
                            {isSelected && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground/70">
                                <ArrowUp className="w-3 h-3" />
                                <ArrowDown className="w-3 h-3" />
                                <span>Navigate</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Quick Actions Footer */}
        {(results.length > 0 || searchHistory.length > 0) && (
          <div className="border-t border-border/30 p-3 bg-muted/20">
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
              <div className="flex items-center gap-1">
                <Filter className="w-3 h-3" />
                <span>Filter by category</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div
        ref={searchContainerRef}
        className="relative w-full max-w-2xl"
        id="search-bar"
      >
        {/* Search Input */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative bg-background/90 backdrop-blur-md border border-border/50 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 overflow-hidden">
            {/* Category Filter Bar */}
            <div className="flex items-center gap-1 p-2 border-b border-border/30 bg-gradient-to-r from-muted/30 to-muted/10">
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
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
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap",
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {category.name}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Search Input Field */}
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
              <Input
                ref={inputRef}
                type="search"
                placeholder="Search documentation... (⌘K / Ctrl+K)"
                className="w-full pl-11 pr-11 py-4 text-base border-0 bg-transparent focus:ring-2 focus:ring-primary/20 focus:ring-offset-0 focus-visible-enhanced placeholder:text-muted-foreground/70"
                value={query}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                aria-label="Search documentation"
                aria-expanded={showResults}
                aria-haspopup="listbox"
                role="combobox"
                aria-autocomplete="list"
                aria-describedby={showResults ? "search-results" : undefined}
              />

              {/* Clear Button */}
              {query && !isLoading && (
                <Button
                  onClick={handleClear}
                  variant="ghost"
                  size="sm"
                  className="absolute right-3 top-1/2 h-6 w-6 p-0 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus-visible-enhanced rounded-full"
                  aria-label="Clear search"
                >
                  <XIcon className="h-3.5 w-3.5" />
                </Button>
              )}

              {/* Loading Spinner */}
              {isLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2
                    className="h-4 w-4 animate-spin text-primary"
                    aria-hidden="true"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Portal for Search Results */}
      {showResults &&
        isClient &&
        createPortal(<SearchResults />, document.body)}
    </>
  );
}
