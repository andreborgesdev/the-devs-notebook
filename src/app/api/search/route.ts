import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const mdDirectory = path.join(process.cwd(), "public", "md");

interface SearchResult {
  title: string;
  url: string;
  snippet?: string;
  category?: string;
  type?: string;
  score: number;
}

// Function to recursively get all markdown files
function getAllMdFiles(dirPath: string, arrayOfFiles: string[] = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(function (file) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllMdFiles(fullPath, arrayOfFiles);
    } else if (path.extname(fullPath) === ".md") {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

// Function to determine category from file path
function getCategoryFromPath(filePath: string): string {
  const relativePath = path.relative(mdDirectory, filePath);
  const pathParts = relativePath.split(path.sep);

  if (pathParts.length > 0) {
    return pathParts[0];
  }
  return "other";
}

// Function to determine content type
function getContentType(filePath: string): string {
  const relativePath = path.relative(mdDirectory, filePath);

  if (
    relativePath.includes("cheat-sheet") ||
    relativePath.includes("cheatsheet")
  ) {
    return "Cheat Sheet";
  }
  if (relativePath.includes("introduction") || relativePath.includes("intro")) {
    return "Introduction";
  }
  if (relativePath.includes("example") || relativePath.includes("tutorial")) {
    return "Tutorial";
  }
  if (relativePath.includes("reference")) {
    return "Reference";
  }

  return "Guide";
}

// Function to calculate search score
function calculateScore(
  query: string,
  title: string,
  content: string,
  category: string
): number {
  let score = 0;
  const queryLower = query.toLowerCase();
  const titleLower = title.toLowerCase();
  const contentLower = content.toLowerCase();

  // Title exact match gets highest score
  if (titleLower === queryLower) {
    score += 100;
  } else if (titleLower.includes(queryLower)) {
    // Partial title match
    score += 50;
    // Bonus for title starts with query
    if (titleLower.startsWith(queryLower)) {
      score += 20;
    }
  }

  // Content matches
  const contentMatches = (contentLower.match(new RegExp(queryLower, "g")) || [])
    .length;
  score += contentMatches * 2;

  // Category bonus (if searching in specific category)
  if (category.includes(queryLower)) {
    score += 10;
  }

  // Bonus for shorter titles (more specific)
  if (title.length < 20) {
    score += 5;
  }

  return score;
}

// Function to extract better snippet with highlighting context
function extractSnippet(
  content: string,
  query: string,
  maxLength: number = 200
): string {
  const queryLower = query.toLowerCase();
  const contentLower = content.toLowerCase();
  const queryIndex = contentLower.indexOf(queryLower);

  if (queryIndex === -1) {
    // No direct match, return beginning of content
    return content.substring(0, maxLength).replace(/\n/g, " ").trim() + "...";
  }

  // Try to center the query in the snippet
  const start = Math.max(0, queryIndex - Math.floor(maxLength / 2));
  const end = Math.min(content.length, start + maxLength);

  let snippet = content.substring(start, end).replace(/\n/g, " ").trim();

  // Clean up snippet boundaries
  if (start > 0) {
    // Find the first space to avoid cutting words
    const firstSpace = snippet.indexOf(" ");
    if (firstSpace > 0 && firstSpace < 50) {
      snippet = snippet.substring(firstSpace);
    }
    snippet = "..." + snippet;
  }

  if (end < content.length) {
    // Find the last space to avoid cutting words
    const lastSpace = snippet.lastIndexOf(" ");
    if (lastSpace > snippet.length - 50) {
      snippet = snippet.substring(0, lastSpace);
    }
    snippet = snippet + "...";
  }

  return snippet;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase();
  const categoryFilter = searchParams.get("category");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter 'q' is required" },
      { status: 400 }
    );
  }

  try {
    const allFiles = getAllMdFiles(mdDirectory);
    const results: SearchResult[] = [];

    allFiles.forEach((filePath) => {
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { content } = matter(fileContents);
      const relativePath = path.relative(mdDirectory, filePath);
      const url = "/" + relativePath.replace(/\.md$/, "");

      const category = getCategoryFromPath(filePath);
      const contentType = getContentType(filePath);

      // Apply category filter if specified
      if (categoryFilter && category !== categoryFilter) {
        return;
      }

      const titleMatch = content.match(/^#\s+(.*)/m);
      let title = path.basename(filePath, ".md");
      if (titleMatch && titleMatch[1]) {
        title = titleMatch[1];
      }

      const titleMatches = title.toLowerCase().includes(query);
      const contentMatches = content.toLowerCase().includes(query);

      if (titleMatches || contentMatches) {
        const score = calculateScore(query, title, content, category);
        const snippet = contentMatches ? extractSnippet(content, query) : "";

        results.push({
          title,
          url,
          snippet,
          category,
          type: contentType,
          score,
        });
      }
    });

    // Sort by score (highest first), then by title
    results.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.title.localeCompare(b.title);
    });

    // Limit results to top 20 for performance
    const limitedResults = results.slice(0, 20);

    return NextResponse.json(limitedResults);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Failed to search content" },
      { status: 500 }
    );
  }
}
