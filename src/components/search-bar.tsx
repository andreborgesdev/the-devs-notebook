"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Input } from "@/src/components/ui/input";
import Link from "next/link";
import { SearchIcon, XIcon, Loader2 } from "lucide-react";
import { useDebounce } from "@/src/hooks/use-debounce";

interface SearchResult {
  title: string;
  url: string;
  snippet?: string;
}

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null); // Ref for the input element

  const fetchResults = useCallback(async (searchQuery: string) => {
    if (!searchQuery) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}`
      );
      if (!response.ok) {
        throw new Error("Search request failed");
      }
      const data: SearchResult[] = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Failed to fetch search results:", error);
      setResults([]); // Clear results on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResults(debouncedQuery);
  }, [debouncedQuery, fetchResults]);

  // Close results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Add keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Cmd+K on Mac or Ctrl+K on other OS
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault(); // Prevent default browser behavior (like opening search)
        inputRef.current?.focus(); // Focus the search input
        setIsFocused(true); // Ensure the results dropdown can open
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Cleanup listener on component unmount
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsLoading(false);
  };

  const showResults =
    isFocused && (query.length > 0 || results.length > 0 || isLoading);

  return (
    <div ref={searchContainerRef} className="relative w-full max-w-md">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef} // Assign the ref to the input
          type="search"
          placeholder="Search (⌘K / Ctrl+K)" // Update placeholder
          className="w-full pl-9 pr-9" // Padding for icons
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          aria-label="Search documentation"
        />
        {query && !isLoading && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <XIcon className="h-4 w-4" />
          </button>
        )}
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {showResults && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover p-2 text-popover-foreground shadow-md max-h-96 overflow-y-auto">
          {isLoading && results.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Loading...
            </div>
          )}
          {!isLoading && debouncedQuery && results.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No results found for "{debouncedQuery}".
            </div>
          )}
          {results.length > 0 && (
            <ul>
              {results.map((result) => (
                <li key={result.url}>
                  <Link
                    href={result.url}
                    className="block rounded-sm p-2 hover:bg-accent hover:text-accent-foreground"
                    onClick={() => setIsFocused(false)} // Close on selection
                  >
                    <div className="font-medium">{result.title}</div>
                    {result.snippet && (
                      <p
                        className="text-xs text-muted-foreground mt-1 line-clamp-2"
                        title={result.snippet}
                      >
                        {result.snippet}
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
