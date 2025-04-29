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
    <div className="relative">
      <article className="prose prose-slate dark:prose-invert mx-auto max-w-4xl p-4">
        <MarkdownAsync
          className="markdown-content"
          remarkPlugins={[remarkMath]}
          rehypePlugins={[[rehypePrettyCode, prettyCodeOptions], rehypeKatex]}
          components={{
            h1: ({ children, ...props }) => {
              const id = children
                ?.toString()
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-");
              return (
                <h1 id={id} {...props}>
                  {children}
                </h1>
              );
            },
            h2: ({ children, ...props }) => {
              const id = children
                ?.toString()
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-");
              return (
                <h2 id={id} {...props}>
                  {children}
                </h2>
              );
            },
            h3: ({ children, ...props }) => {
              const id = children
                ?.toString()
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-");
              return (
                <h3 id={id} {...props}>
                  {children}
                </h3>
              );
            },
            h4: ({ children, ...props }) => {
              const id = children
                ?.toString()
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-");
              return (
                <h4 id={id} {...props}>
                  {children}
                </h4>
              );
            },
            h5: ({ children, ...props }) => {
              const id = children
                ?.toString()
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-");
              return (
                <h5 id={id} {...props}>
                  {children}
                </h5>
              );
            },
            h6: ({ children, ...props }) => {
              const id = children
                ?.toString()
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-");
              return (
                <h6 id={id} {...props}>
                  {children}
                </h6>
              );
            },
          }}
        >
          {fileContents}
        </MarkdownAsync>
      </article>
      <TableOfContents content={fileContents} />
      <ScrollToTop />
    </div>
  );
}
