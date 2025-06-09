import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Crimson_Text } from "next/font/google";
import { Suspense } from "react";
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
import { CompactSearchBar } from "@/src/components/compact-search-bar";
import { NavigationProvider } from "@/src/contexts/NavigationContext";
import { AccessibilityProvider } from "@/src/contexts/AccessibilityContext";
import { BookmarkProvider } from "@/src/contexts/BookmarkContext";
import { AccessibilityWrapper } from "@/src/components/accessibility-wrapper";
import { ImageOptimizationProvider } from "@/src/components/image-optimization-provider";
import { SkipNavigation } from "@/src/components/skip-navigation";
import { SearchScroller } from "@/src/components/search-scroller";
import { Toaster } from "@/src/components/ui/toaster";
import { ServiceWorkerRegistration } from "@/src/components/service-worker-registration";
import { PWAInstallPrompt } from "@/src/components/pwa-install-prompt";
import { GoogleAnalytics } from "@/src/components/analytics/GoogleAnalytics";
import { AnalyticsProvider } from "@/src/components/analytics/AnalyticsProvider";

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
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Dev's Notebook",
  },
  openGraph: {
    type: "website",
    siteName: "The Dev's Notebook",
    title: "The dev's notebook",
    description: "Comprehensive development notes and cheat sheets",
  },
  keywords: [
    "development",
    "programming",
    "java",
    "javascript",
    "react",
    "kotlin",
    "scala",
    "cheat sheets",
    "notes",
    "offline reading",
  ],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="application-name" content="Dev's Notebook" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Dev's Notebook" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/logo.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/logo.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${crimsonText.variable} font-sans antialiased`}
      >
        <AccessibilityProvider>
          <AccessibilityWrapper>
            <AnalyticsProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <SkipNavigation />
                <BookmarkProvider>
                  <NavigationProvider>
                    <ImageOptimizationProvider />
                    <SidebarProvider>
                      <AppSidebar />
                      <SidebarInset>
                        <header
                          id="main-header"
                          className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background/80 backdrop-blur-md px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
                          role="banner"
                        >
                          <div className="flex items-center gap-2">
                            <SidebarTrigger className="-ml-1 hover:bg-accent/50" />
                            <Separator
                              orientation="vertical"
                              className="mr-2 h-4"
                            />
                            <Breadcrumbs />
                          </div>
                          <div className="flex items-center">
                            <CompactSearchBar />
                          </div>
                        </header>
                        <main
                          id="main-content"
                          className="flex flex-1 flex-col gap-4 p-4"
                          role="main"
                          tabIndex={-1}
                        >
                          <Suspense fallback={null}>
                            <SearchScroller contentSelector="#main-content" />
                          </Suspense>
                          <div className="min-h-[100vh] flex-1 rounded-xl bg-gradient-to-br from-background to-muted/30 border shadow-sm md:min-h-min">
                            {children}
                          </div>
                        </main>
                      </SidebarInset>
                    </SidebarProvider>
                  </NavigationProvider>
                </BookmarkProvider>
              </ThemeProvider>
            </AnalyticsProvider>
          </AccessibilityWrapper>
        </AccessibilityProvider>
        <ServiceWorkerRegistration />
        <PWAInstallPrompt />
        <GoogleAnalytics />
        <Toaster />
      </body>
    </html>
  );
}
