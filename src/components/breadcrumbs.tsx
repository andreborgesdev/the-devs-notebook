"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "./ui/breadcrumb";
import { Content, ContentItem } from "@/src/data/Content";

// Helper function to find a content item by its URL recursively
function findContentItemByUrl(
  url: string,
  items: ContentItem[]
): ContentItem | undefined {
  for (const item of items) {
    if (item.url === url) {
      return item;
    }
    if (item.items) {
      const found = findContentItemByUrl(url, item.items);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
}

export function Breadcrumbs() {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        {paths.map((path, index) => {
          const currentHref = `/${paths.slice(0, index + 1).join("/")}`;
          const isLast = index === paths.length - 1;
          const formattedPath = path
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

          // Find the ContentItem corresponding to this level's URL
          const contentItem = findContentItemByUrl(currentHref, Content);

          // Determine if this breadcrumb should be clickable and find the intro page URL
          let isClickable = false;
          let introPageUrl = "";
          if (!isLast && contentItem?.items) {
            const introItem = contentItem.items.find(
              (item) => item.title === "Introduction"
            );
            if (introItem) {
              isClickable = true;
              introPageUrl = introItem.url; // Use the URL of the Introduction item
            }
          }

          return (
            <React.Fragment key={path}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  // Always render the last item as BreadcrumbPage
                  <BreadcrumbPage>{formattedPath}</BreadcrumbPage>
                ) : isClickable ? (
                  // Render as a link if it's not the last and has an intro page
                  <BreadcrumbLink href={introPageUrl}>
                    {formattedPath}
                  </BreadcrumbLink>
                ) : (
                  // Render non-clickable text if no intro page exists or it's not applicable
                  <BreadcrumbPage className="font-normal text-muted-foreground">
                    {formattedPath}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
