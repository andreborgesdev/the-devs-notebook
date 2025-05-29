"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/src/components/ui/sidebar";
import { ContentItem, NavItem } from "./nav-item";

export function NavMain({ items }: { items: ContentItem[] }) {
  return (
    <SidebarGroup className="px-0">
      <SidebarGroupLabel className="px-4 text-xs uppercase tracking-wider text-sidebar-foreground/70 font-medium mb-2">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
          Core concepts
        </div>
      </SidebarGroupLabel>
      <SidebarMenu className="space-y-1">
        {items.map((item) => (
          <NavItem key={item.title} item={item} depth={0} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
