"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useToast } from "@/src/hooks/use-toast";

interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  icon?: string;
  description?: string;
  category?: string;
  bookmarkedAt: number;
  tags?: string[];
}

interface BookmarkState {
  bookmarks: BookmarkItem[];
  isBookmarked: (url: string) => boolean;
  addBookmark: (item: Omit<BookmarkItem, "id" | "bookmarkedAt">) => void;
  removeBookmark: (url: string) => void;
  toggleBookmark: (item: Omit<BookmarkItem, "id" | "bookmarkedAt">) => void;
  getBookmarksByCategory: (category?: string) => BookmarkItem[];
  searchBookmarks: (query: string) => BookmarkItem[];
  exportBookmarks: () => string;
  importBookmarks: (data: string) => boolean;
  clearAllBookmarks: () => void;
}

const BookmarkContext = createContext<BookmarkState | undefined>(undefined);

export function useBookmarks() {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error("useBookmarks must be used within a BookmarkProvider");
  }
  return context;
}

interface BookmarkProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = "devs-notebook-bookmarks";

export function BookmarkProvider({ children }: BookmarkProviderProps) {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsHydrated(true);
    const savedBookmarks = localStorage.getItem(STORAGE_KEY);
    if (savedBookmarks) {
      try {
        const parsed = JSON.parse(savedBookmarks);
        if (Array.isArray(parsed)) {
          setBookmarks(parsed);
        }
      } catch (error) {
        console.warn("Failed to parse saved bookmarks:", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    }
  }, [bookmarks, isHydrated]);

  const isBookmarked = (url: string): boolean => {
    if (!isHydrated) return false;
    return bookmarks.some((bookmark) => bookmark.url === url);
  };

  const addBookmark = (item: Omit<BookmarkItem, "id" | "bookmarkedAt">) => {
    if (isBookmarked(item.url)) {
      toast({
        title: "Already bookmarked",
        description: "This topic is already in your bookmarks.",
        variant: "default",
      });
      return;
    }

    const newBookmark: BookmarkItem = {
      ...item,
      id: generateId(),
      bookmarkedAt: Date.now(),
    };

    setBookmarks((prev) => [newBookmark, ...prev]);
    toast({
      title: "Bookmark added",
      description: `"${item.title}" has been bookmarked.`,
      variant: "default",
    });
  };

  const removeBookmark = (url: string) => {
    const bookmark = bookmarks.find((b) => b.url === url);
    if (!bookmark) return;

    setBookmarks((prev) => prev.filter((bookmark) => bookmark.url !== url));
    toast({
      title: "Bookmark removed",
      description: `"${bookmark.title}" has been removed from bookmarks.`,
      variant: "default",
    });
  };

  const toggleBookmark = (item: Omit<BookmarkItem, "id" | "bookmarkedAt">) => {
    if (isBookmarked(item.url)) {
      removeBookmark(item.url);
    } else {
      addBookmark(item);
    }
  };

  const getBookmarksByCategory = (category?: string): BookmarkItem[] => {
    if (!category) return bookmarks;
    return bookmarks.filter((bookmark) => bookmark.category === category);
  };

  const searchBookmarks = (query: string): BookmarkItem[] => {
    if (!query.trim()) return bookmarks;

    const searchTerm = query.toLowerCase();
    return bookmarks.filter(
      (bookmark) =>
        bookmark.title.toLowerCase().includes(searchTerm) ||
        bookmark.description?.toLowerCase().includes(searchTerm) ||
        bookmark.category?.toLowerCase().includes(searchTerm) ||
        bookmark.tags?.some((tag) => tag.toLowerCase().includes(searchTerm))
    );
  };

  const exportBookmarks = (): string => {
    const exportData = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      bookmarks: bookmarks,
    };
    return JSON.stringify(exportData, null, 2);
  };

  const importBookmarks = (data: string): boolean => {
    try {
      const parsed = JSON.parse(data);

      if (parsed.bookmarks && Array.isArray(parsed.bookmarks)) {
        const validBookmarks = parsed.bookmarks.filter(
          (bookmark: any) =>
            bookmark.title &&
            bookmark.url &&
            typeof bookmark.title === "string" &&
            typeof bookmark.url === "string"
        );

        setBookmarks(validBookmarks);
        toast({
          title: "Bookmarks imported",
          description: `Successfully imported ${validBookmarks.length} bookmarks.`,
          variant: "default",
        });
        return true;
      }
    } catch (error) {
      toast({
        title: "Import failed",
        description: "Failed to import bookmarks. Invalid file format.",
        variant: "destructive",
      });
    }
    return false;
  };

  const clearAllBookmarks = () => {
    setBookmarks([]);
    toast({
      title: "Bookmarks cleared",
      description: "All bookmarks have been removed.",
      variant: "default",
    });
  };

  const value: BookmarkState = {
    bookmarks,
    isBookmarked,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    getBookmarksByCategory,
    searchBookmarks,
    exportBookmarks,
    importBookmarks,
    clearAllBookmarks,
  };

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
