import { Metadata } from "next";
import Link from "next/link";
import { WifiOff, BookOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/src/components/ui/button";

export const metadata: Metadata = {
  title: "Offline - The Dev's Notebook",
  description: "You are currently offline. Some content may not be available.",
};

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-muted rounded-full p-6">
            <WifiOff className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">You're offline</h1>
          <p className="text-muted-foreground">
            Don't worry! You can still access previously viewed content and
            cached notes.
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <BookOpen className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">
              Available offline content:
            </span>
          </div>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Previously viewed notes and cheat sheets</li>
            <li>• Cached images and diagrams</li>
            <li>• Core navigation and interface</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go to Homepage
            </Link>
          </Button>

          <p className="text-xs text-muted-foreground">
            Full functionality will be restored when you're back online.
          </p>
        </div>
      </div>
    </div>
  );
}
