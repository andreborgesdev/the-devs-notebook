"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/src/components/ui/sidebar";
import { ContentItem, NavItem } from "./nav-item";

export function NavMain({ items }: { items: ContentItem[] }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Core concepts</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <NavItem key={item.title} item={item} depth={0} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
