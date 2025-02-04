"use client";

import * as React from "react";
import Image from "next/image";
import { BookOpen, Bot, SquareTerminal } from "lucide-react";

import { ContentItem, NavMain } from "@/src/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/src/components/ui/sidebar";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "../lib/utils";

const data: ContentItem[] = [
  {
    title: "Algorithms",
    url: "alogrithms",
    icon: SquareTerminal,
    items: [
      {
        title: "Introduction",
        url: "algorithms",
      },
      {
        title: "History",
        url: "#",
        icon: SquareTerminal,
        items: [
          {
            title: "Playground",
            url: "#",
            icon: SquareTerminal,
            items: [
              {
                title: "Playground",
                url: "#",
                icon: SquareTerminal,
                items: [],
              },
            ],
          },
        ],
      },
      {
        title: "Starred",
        url: "#",
      },
      {
        title: "Settings",
        url: "#",
      },
    ],
  },
  // {
  //   title: "Home",
  //   link: "/",
  //   icon: "🏠",
  // },
  {
    title: "Models",
    url: "#",
    icon: Bot,
    items: [
      {
        title: "Genesis",
        url: "#",
      },
      {
        title: "Explorer",
        url: "#",
      },
      {
        title: "Quantum",
        url: "#",
      },
    ],
  },
  {
    title: "Documentation",
    url: "#",
    icon: BookOpen,
    items: [
      {
        title: "Introduction",
        url: "#",
      },
      {
        title: "Get Started",
        url: "#",
      },
      {
        title: "Tutorials",
        url: "#",
      },
      {
        title: "Changelog",
        url: "#",
      },
    ],
  },
];

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
        <NavMain items={data} />
      </SidebarContent>
      <SidebarFooter>
        <ThemeToggle className="flex justify-center" />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
