import { notFound } from "next/navigation";
import path from "path";
import { MarkdownAsync } from "react-markdown";
import fs from "fs";
import { TableOfContents } from "@/src/components/table-of-contents";
import { ScrollToTop } from "@/src/components/scroll-to-top";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import { transformerCopyButton } from "@rehype-pretty/transformers";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { generateUniqueHeadingIds } from "@/src/lib/heading-utils";

export default async function ContentPage({
  params,
}: {
  params: { slug?: string[] };
}) {
  // Check if slug exists and has at least one element.
  if (!params.slug || params.slug.length === 0) {
    return notFound();
  }

  const filePath = `${params.slug.join("/")}.md`;
  const absoluteFilePath = path.join(process.cwd(), "public", "md", filePath);

  if (!fs.existsSync(absoluteFilePath)) {
    return notFound();
  }

  const fileContents = fs.readFileSync(absoluteFilePath, "utf8");

  // Generate unique IDs for all headings to ensure consistency with ToC
  const { getHeadingIdByIndex } = generateUniqueHeadingIds(fileContents);

  // Create a closure to track heading index consistently
  const createHeadingIdGetter = () => {
    let headingIndex = 0;
    return () => getHeadingIdByIndex(headingIndex++);
  };

  const getNextHeadingId = createHeadingIdGetter();

  const prettyCodeOptions = {
    // Use one of Shiki's packaged themes
    theme: {
      dark: "dark-plus",
      light: "github-light",
    },
    // Callback hooks for customization if needed
    onVisitLine(node: any) {
      // Prevent lines from collapsing in `display: grid` mode, and allow empty
      // lines to be copy/pasted
      if (node.children.length === 0) {
        node.children = [{ type: "text", value: " " }];
      }
    },
    onVisitHighlightedLine(node: any) {
      // Each line node by default has `class="line"`.
      node.properties.className.push("highlighted");
    },
    onVisitHighlightedWord(node: any) {
      // Each word node has no className by default.
      node.properties.className = ["word"];
    },
    transformers: [
      transformerCopyButton({
        visibility: "always",
        feedbackDuration: 3_000,
      }),
    ],
  };

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 dark:from-blue-900/10 dark:via-transparent dark:to-purple-900/10 pointer-events-none" />

      <div className="relative flex gap-8">
        <article className="flex-1 prose prose-slate dark:prose-invert mx-auto max-w-4xl p-6 lg:p-8">
          <MarkdownAsync
            className="markdown-content"
            remarkPlugins={[remarkMath, remarkGfm]}
            rehypePlugins={[
              [rehypePrettyCode, prettyCodeOptions],
              rehypeKatex,
              rehypeRaw,
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
              pre: ({ children, ...props }) => {
                return (
                  <pre
                    className="relative rounded-lg border bg-muted overflow-x-auto shadow-sm"
                    {...props}
                  >
                    {children}
                  </pre>
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
