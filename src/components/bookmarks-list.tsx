"use client";

import { useState } from "react";
import {
  Bookmark,
  Search,
  Filter,
  Download,
  Upload,
  Trash2,
  Calendar,
  ExternalLink,
  Tag,
  Folder,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
import { useBookmarks } from "@/src/contexts/BookmarkContext";
import { cn } from "@/src/lib/utils";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

type SortOption = "newest" | "oldest" | "title" | "category";
type FilterOption = "all" | string;

export function BookmarksList() {
  const {
    bookmarks,
    removeBookmark,
    exportBookmarks,
    importBookmarks,
    clearAllBookmarks,
  } = useBookmarks();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FilterOption>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [isImporting, setIsImporting] = useState(false);

  const categories = Array.from(
    new Set(bookmarks.map((b) => b.category).filter(Boolean))
  ) as string[];

  const filteredBookmarks = bookmarks
    .filter((bookmark) => {
      const matchesSearch = searchQuery
        ? bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bookmark.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          bookmark.tags?.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : true;

      const matchesCategory =
        selectedCategory === "all" || bookmark.category === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.bookmarkedAt - a.bookmarkedAt;
        case "oldest":
          return a.bookmarkedAt - b.bookmarkedAt;
        case "title":
          return a.title.localeCompare(b.title);
        case "category":
          return (a.category || "").localeCompare(b.category || "");
        default:
          return 0;
      }
    });

  const handleExport = () => {
    const data = exportBookmarks();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `devs-notebook-bookmarks-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      importBookmarks(content);
      setIsImporting(false);
    };
    reader.onerror = () => {
      setIsImporting(false);
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-muted rounded-full p-6 mb-4">
          <Bookmark className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No bookmarks yet</h3>
        <p className="text-muted-foreground mb-4 max-w-md">
          Start bookmarking important topics to build your personal knowledge
          collection. Use the bookmark button on any topic page to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Bookmarks</h2>
          <p className="text-muted-foreground">
            {bookmarks.length} saved topic{bookmarks.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Download JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isImporting}
            />
            <Button variant="outline" size="sm" disabled={isImporting}>
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear all bookmarks?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. All your bookmarks will be
                  permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={clearAllBookmarks}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Clear All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bookmarks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  {selectedCategory === "all" ? "All" : selectedCategory}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as SortOption)}
          >
            <SelectTrigger className="w-32">
              <SelectValue>
                <div className="flex items-center gap-2">
                  {sortBy === "newest" || sortBy === "oldest" ? (
                    <Calendar className="h-4 w-4" />
                  ) : sortBy === "title" ? (
                    <SortAsc className="h-4 w-4" />
                  ) : (
                    <Folder className="h-4 w-4" />
                  )}
                  {sortBy === "newest" && "Newest"}
                  {sortBy === "oldest" && "Oldest"}
                  {sortBy === "title" && "Title"}
                  {sortBy === "category" && "Category"}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="title">Title A-Z</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredBookmarks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No bookmarks match your current filters.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredBookmarks.map((bookmark) => (
            <Card
              key={bookmark.id}
              className="group hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {bookmark.icon && (
                      <span className="text-lg mt-0.5">{bookmark.icon}</span>
                    )}
                    <div className="space-y-1">
                      <CardTitle className="text-base leading-none">
                        <Link
                          href={bookmark.url}
                          className="hover:text-primary transition-colors"
                        >
                          {bookmark.title}
                        </Link>
                      </CardTitle>
                      {bookmark.description && (
                        <CardDescription className="text-sm">
                          {bookmark.description}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <Link href={bookmark.url}>
                        <ExternalLink className="h-3 w-3" />
                        <span className="sr-only">Open {bookmark.title}</span>
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => removeBookmark(bookmark.url)}
                    >
                      <Trash2 className="h-3 w-3" />
                      <span className="sr-only">Remove bookmark</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    {bookmark.category && (
                      <div className="flex items-center gap-1">
                        <Folder className="h-3 w-3" />
                        <span>{bookmark.category}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {formatDistanceToNow(new Date(bookmark.bookmarkedAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                  {bookmark.tags && bookmark.tags.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      <div className="flex gap-1">
                        {bookmark.tags.slice(0, 3).map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs px-1 py-0"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {bookmark.tags.length > 3 && (
                          <span className="text-xs">
                            +{bookmark.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
