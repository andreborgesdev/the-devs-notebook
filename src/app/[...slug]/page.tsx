import { notFound } from "next/navigation";
import path from "path";
import React from "react";
import { MarkdownAsync } from "react-markdown";
import fs from "fs";
import { TableOfContents } from "@/src/components/table-of-contents";
import { ScrollToTop } from "@/src/components/scroll-to-top";
import { SmartImage } from "@/src/components/smart-image";
import { ClientBookmarkButton } from "@/src/components/client-bookmark-button";
import { ClientMarkdownPrintButton } from "@/src/components/client-markdown-print-button";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { generateUniqueHeadingIds } from "@/src/lib/heading-utils";
import {
  optimizeImagePath,
  shouldPreloadImage,
  getImageDimensions,
} from "@/src/lib/image-utils";
import { CopyButton } from "@/src/components/copy-button";
import { CollapsibleCodeBlock } from "@/src/components/collapsible-code-block";

export default async function ContentPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const resolvedParams = await params;

  // Check if slug exists and has at least one element.
  if (!resolvedParams.slug || resolvedParams.slug.length === 0) {
    return notFound();
  }

  const filePath = `${resolvedParams.slug.join("/")}.md`;
  const absoluteFilePath = path.join(process.cwd(), "public", "md", filePath);

  if (!fs.existsSync(absoluteFilePath)) {
    return notFound();
  }

  const fileContents = fs.readFileSync(absoluteFilePath, "utf8");

  // Extract title from the first H1 heading in the markdown
  const titleMatch = fileContents.match(/^#\s+(.+)$/m);
  const pageTitle = titleMatch
    ? titleMatch[1]
    : resolvedParams.slug.join(" / ");
  const pageUrl = `/${resolvedParams.slug.join("/")}`;

  // Generate unique IDs for all headings to ensure consistency with ToC
  const { getHeadingIdByIndex } = generateUniqueHeadingIds(fileContents);

  // Create a closure to track heading index consistently
  const createHeadingIdGetter = () => {
    let headingIndex = 0;
    return () => getHeadingIdByIndex(headingIndex++);
  };

  const getNextHeadingId = createHeadingIdGetter();

  const prettyCodeOptions = {
    theme: {
      dark: "dark-plus",
      light: "github-light",
    },
    defaultLang: "plaintext",
    keepBackground: false,
    onVisitLine(node: any) {
      if (node.children.length === 0) {
        node.children = [{ type: "text", value: " " }];
      }
    },
    onVisitHighlightedLine(node: any) {
      node.properties.className.push("highlighted");
    },
    onVisitHighlightedWord(node: any) {
      node.properties.className = ["word"];
    },
    transformers: [
      {
        name: "add-line-numbers",
        pre(node: any) {
          const code = node.children?.[0];
          if (code && code.tagName === "code") {
            const hasLanguageClass =
              node.properties?.className?.includes("language-") ||
              code.properties?.className?.some?.((cls: string) =>
                cls.startsWith("language-")
              );

            const isMultiLineCodeBlock =
              code.children?.some(
                (child: any) =>
                  child.type === "text" && child.value.includes("\n")
              ) || code.children?.length > 1;

            const isCodeBlock = hasLanguageClass || isMultiLineCodeBlock;

            if (isCodeBlock) {
              code.properties = code.properties || {};
              code.properties["data-line-numbers"] = "";

              const lines =
                code.children?.filter(
                  (child: any) =>
                    child.type === "element" && child.tagName === "span"
                ) || [];

              if (lines.length > 0) {
                const digits = lines.length.toString().length;
                code.properties["data-line-numbers-max-digits"] =
                  digits.toString();

                lines.forEach((line: any) => {
                  line.properties = line.properties || {};
                  line.properties["data-line"] = "";
                });
              }
            }
          }
        },
      },
    ],
  };

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 dark:from-blue-900/10 dark:via-transparent dark:to-purple-900/10 pointer-events-none" />

      <div className="relative flex gap-8">
        <article className="flex-1 prose prose-slate dark:prose-invert mx-auto max-w-4xl p-6 lg:p-8">
          {/* Page Actions */}
          <div className="flex gap-2 mb-6 no-print">
            <ClientMarkdownPrintButton
              title={pageTitle}
              variant="outline"
              size="sm"
            />
            <ClientBookmarkButton title={pageTitle} url={pageUrl} />
          </div>

          <MarkdownAsync
            data-content="markdown"
            className="markdown-content"
            remarkPlugins={[remarkMath, remarkGfm]}
            rehypePlugins={[
              rehypeRaw,
              [rehypePrettyCode, prettyCodeOptions],
              rehypeKatex,
            ]}
            components={{
              h1: ({ children, ...props }) => {
                const id = getNextHeadingId();
                return (
                  <h1
                    id={id}
                    className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl my-8 bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 dark:from-white dark:via-blue-200 dark:to-white bg-clip-text text-transparent"
                    {...props}
                  >
                    {children}
                  </h1>
                );
              },
              h2: ({ children, ...props }) => {
                const id = getNextHeadingId();
                return (
                  <h2
                    id={id}
                    className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 my-6 border-gradient"
                    {...props}
                  >
                    {children}
                  </h2>
                );
              },
              h3: ({ children, ...props }) => {
                const id = getNextHeadingId();
                return (
                  <h3
                    id={id}
                    className="scroll-m-20 text-2xl font-semibold tracking-tight my-4"
                    {...props}
                  >
                    {children}
                  </h3>
                );
              },
              h4: ({ children, ...props }) => {
                const id = getNextHeadingId();
                return (
                  <h4
                    id={id}
                    className="scroll-m-20 text-xl font-semibold tracking-tight my-3"
                    {...props}
                  >
                    {children}
                  </h4>
                );
              },
              h5: ({ children, ...props }) => {
                const id = getNextHeadingId();
                return (
                  <h5
                    id={id}
                    className="scroll-m-20 text-lg font-semibold tracking-tight my-2"
                    {...props}
                  >
                    {children}
                  </h5>
                );
              },
              h6: ({ children, ...props }) => {
                const id = getNextHeadingId();
                return (
                  <h6
                    id={id}
                    className="scroll-m-20 text-base font-semibold tracking-tight my-2"
                    {...props}
                  >
                    {children}
                  </h6>
                );
              },
              a: ({ node, ...props }) => {
                return (
                  <a
                    {...props}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                  />
                );
              },
              blockquote: ({ children, ...props }) => {
                return (
                  <blockquote
                    className="mt-6 border-l-4 border-blue-500 pl-6 italic bg-blue-50/50 dark:bg-blue-900/20 py-4 rounded-r-md"
                    {...props}
                  >
                    {children}
                  </blockquote>
                );
              },
              img: ({ src, alt, ...props }: any) => {
                if (!src || typeof src !== "string") return null;

                const optimizedSrc = optimizeImagePath(src);
                const { width, height } = getImageDimensions(src);
                const priority = shouldPreloadImage(src, 0);

                return (
                  <SmartImage
                    src={optimizedSrc}
                    alt={alt || ""}
                    width={width}
                    height={height}
                    priority={priority}
                    className="my-6 rounded-lg shadow-sm"
                  />
                );
              },
              pre: ({ children, ...props }) => {
                // Extract language from the code element's className
                let language = "";

                const extractLanguage = (node: any): string => {
                  if (node?.props?.className) {
                    const match = node.props.className.match(/language-(\w+)/);
                    if (match) return match[1];
                  }

                  if (Array.isArray(node)) {
                    for (const child of node) {
                      const lang = extractLanguage(child);
                      if (lang) return lang;
                    }
                  }

                  if (node?.props?.children) {
                    return extractLanguage(node.props.children);
                  }

                  return "";
                };

                language = extractLanguage(children) || extractLanguage(props);

                return (
                  <CollapsibleCodeBlock language={language}>
                    {children}
                  </CollapsibleCodeBlock>
                );
              },
            }}
          >
            {fileContents}
          </MarkdownAsync>
        </article>

        <TableOfContents content={fileContents} />
      </div>

      <ScrollToTop />
    </div>
  );
}
