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
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <a
          href="/"
          className={cn(
            "flex flex-row items-center gap-4",
            open ? "p-4" : "p-1"
          )}
        >
          <Image src="/images/logo.png" alt="Logo" width={30} height={30} />
          {open && <p>The dev's notebook</p>}
        </a>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={Content} />
      </SidebarContent>
      <SidebarFooter>
        <ThemeToggle className="flex justify-center" />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
