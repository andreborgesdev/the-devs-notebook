"use client";

import * as React from "react";
import Image from "next/image";
import { NavMain } from "@/src/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/src/components/ui/sidebar";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "../lib/utils";
import { Content } from "../data/Content";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar();

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="border-r-0 bg-gradient-to-b from-sidebar-background to-sidebar-background/95"
    >
      <SidebarHeader className="border-b border-sidebar-border/50">
        <a
          href="/"
          className={cn(
            "flex flex-row items-center gap-4 transition-all duration-200 hover:bg-sidebar-accent/50 rounded-lg",
            open ? "p-4" : "p-1"
          )}
        >
          <div className="relative">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={30}
              height={30}
              className="rounded-md shadow-sm"
            />
            <div className="absolute inset-0 rounded-md bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 hover:opacity-100 transition-opacity duration-200" />
          </div>
          {open && (
            <div className="flex flex-col">
              <p className="font-semibold text-sidebar-foreground">
                The dev's notebook
              </p>
              <p className="text-xs text-sidebar-foreground/70">
                Knowledge hub
              </p>
            </div>
          )}
        </a>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-purple-500/5 rounded-lg" />
          <NavMain items={Content} />
        </div>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border/50 p-4">
        <ThemeToggle className="flex justify-center" />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
