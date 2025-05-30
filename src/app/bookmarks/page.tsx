"use client";

import { BookmarksList } from "@/src/components/bookmarks-list";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { useBookmarks } from "@/src/contexts/BookmarkContext";
import { Bookmark, BookmarkX } from "lucide-react";

export default function BookmarksPage() {
  const { bookmarks } = useBookmarks();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Bookmark className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Bookmarks</h1>
          <p className="text-muted-foreground">
            Manage and organize your saved topics for quick access
          </p>
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <Card className="mx-auto max-w-md">
          <CardHeader className="text-center">
            <BookmarkX className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <CardTitle>No Bookmarks Yet</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Start bookmarking topics by clicking the bookmark button on any
              content page.
            </p>
          </CardContent>
        </Card>
      ) : (
        <BookmarksList />
      )}
    </div>
  );
}
