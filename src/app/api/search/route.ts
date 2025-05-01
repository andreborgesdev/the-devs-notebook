import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter"; // Using gray-matter to potentially parse frontmatter later if needed

const mdDirectory = path.join(process.cwd(), "public", "md");

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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase();

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter 'q' is required" },
      { status: 400 }
    );
  }

  try {
    const allFiles = getAllMdFiles(mdDirectory);
    const results: { title: string; url: string; snippet?: string }[] = [];
    const maxSnippetLength = 150; // Max length for the context snippet

    allFiles.forEach((filePath) => {
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { content } = matter(fileContents); // Separate content from potential frontmatter
      const relativePath = path.relative(mdDirectory, filePath);
      const url = "/" + relativePath.replace(/\.md$/, "");
      // Extract title from the first markdown heading or use filename
      const titleMatch = content.match(/^#\s+(.*)/m);
      let title = path.basename(filePath, ".md"); // Fallback title
      if (titleMatch && titleMatch[1]) {
        title = titleMatch[1];
      }

      const lowerContent = content.toLowerCase();
      const queryIndex = lowerContent.indexOf(query);

      if (title.toLowerCase().includes(query) || queryIndex !== -1) {
        let snippet = "";
        if (queryIndex !== -1) {
          const start = Math.max(0, queryIndex - 50); // Get some context before
          const end = Math.min(
            content.length,
            queryIndex + query.length + 50 // Get some context after
          );
          snippet = content
            .substring(start, end)
            .replace(/\n/g, " ") // Replace newlines for better snippet display
            .trim();
          if (start > 0) snippet = "..." + snippet;
          if (end < content.length) snippet = snippet + "...";
          // Limit snippet length
          if (snippet.length > maxSnippetLength) {
            snippet = snippet.substring(0, maxSnippetLength - 3) + "...";
          }
        }

        results.push({ title, url, snippet });
      }
    });

    // Sort results, maybe prioritize title matches? (Optional)
    // For now, just return as found.

    return NextResponse.json(results);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Failed to search content" },
      { status: 500 }
    );
  }
}
