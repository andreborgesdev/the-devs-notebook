import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Crimson_Text } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Separator } from "@radix-ui/react-separator";
import { AppSidebar } from "../components/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "../components/ui/sidebar";
import { Breadcrumbs } from "@/src/components/breadcrumbs";
import { SearchBar } from "@/src/components/search-bar"; // Import the SearchBar
import { NavigationProvider } from "@/src/contexts/NavigationContext";
import { ImageOptimizationProvider } from "@/src/components/image-optimization-provider";
import "katex/dist/katex.min.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

const crimsonText = Crimson_Text({
  variable: "--font-crimson",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "The dev's notebook",
  description:
    "The dev's notebook. Notes to study development. Java Kotlin Scala JavaScript TypeScript React Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${crimsonText.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NavigationProvider>
            <ImageOptimizationProvider />
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background/80 backdrop-blur-md px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                  <div className="flex items-center gap-2">
                    <SidebarTrigger className="-ml-1 hover:bg-accent/50" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumbs />
                  </div>
                  <div className="flex items-center">
                    <SearchBar />
                  </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                  <div className="min-h-[100vh] flex-1 rounded-xl bg-gradient-to-br from-background to-muted/30 border shadow-sm md:min-h-min">
                    {children}
                  </div>
                </div>
              </SidebarInset>
            </SidebarProvider>
          </NavigationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
