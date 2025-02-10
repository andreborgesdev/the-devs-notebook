import { notFound } from "next/navigation";
import path from "path";
import Markdown from "react-markdown";
import fs from "fs";

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
    <Markdown className="markdown-content mx-auto p-4">{fileContents}</Markdown>
  );
}
