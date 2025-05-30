"use client";

import { BookmarkButton } from "@/src/components/bookmark-button";
import { useEffect, useState } from "react";

interface ClientBookmarkButtonProps {
  title: string;
  url: string;
}

export function ClientBookmarkButton({
  title,
  url,
}: ClientBookmarkButtonProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="h-9 w-9 animate-pulse bg-muted rounded-md" />;
  }

  return <BookmarkButton title={title} url={url} variant="default" size="sm" />;
}
