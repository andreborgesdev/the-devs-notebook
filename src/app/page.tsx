import { AppSidebar } from "@/src/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/src/components/ui/breadcrumb";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/src/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import path from "path";
import fs from "fs";
import { notFound } from "next/navigation";
import { remark } from "remark";
import Markdown from "react-markdown";

// export async function generateMetadata({
//   params,
// }: {
//   params: { slug: string[] };
// }) {
//   return {
//     title: params.slug.join("/"),
//   };
// }

export default async function Home({ params }: { params: { slug: string[] } }) {
  // const slugPath = params.slug.join("/");
  // const filePath = path.join(process.cwd(), "public", slugPath, "index.md");
  const filePath = path.join(process.cwd(), "public", "md", "algorithms.md");

  if (!fs.existsSync(filePath)) {
    return notFound();
  }

  const fileContents = fs.readFileSync(filePath, "utf8");

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
            <Markdown className="markdown-content mx-auto p-4">
              {fileContents}
            </Markdown>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
