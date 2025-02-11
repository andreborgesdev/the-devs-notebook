import { notFound } from "next/navigation";
import path from "path";
import Markdown from "react-markdown";
import fs from "fs";
import { TableOfContents } from "@/src/components/table-of-contents";
import { ScrollToTop } from "@/src/components/scroll-to-top";

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

  return (
    <div className="relative">
      <article className="prose prose-slate dark:prose-invert mx-auto max-w-4xl p-4">
        <Markdown
          className="markdown-content"
          components={{
            // Add IDs to headings for scroll targeting
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
        </Markdown>
      </article>
      <TableOfContents content={fileContents} />
      <ScrollToTop />
    </div>
  );
}
