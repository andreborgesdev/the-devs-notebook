"use client";

import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/src/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/src/components/ui/sidebar";

export type ContentItem = {
  title: string;
  url: string;
  icon?: string;
  isActive?: boolean;
  items?: ContentItem[];
};

function NavItem({ item, depth }: { item: ContentItem; depth: number }) {
  const hasChildren = item.items && item.items.length > 0;
  const isTopLevel = depth === 0;
  const Wrapper = isTopLevel ? SidebarMenuItem : SidebarMenuSubItem;
  const Button = isTopLevel ? SidebarMenuButton : SidebarMenuSubButton;

  if (hasChildren) {
    return (
      <Collapsible asChild defaultOpen={item.isActive}>
        <Wrapper>
          <CollapsibleTrigger asChild>
            <Button tooltip={item.title}>
              <span>{item.icon}</span>
              <span>{item.title}</span>
              <ChevronRight className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.items?.map((child) => (
                <NavItem key={child.title} item={child} depth={depth + 1} />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Wrapper>
      </Collapsible>
    );
  }

  return (
    <Wrapper>
      <Button asChild tooltip={item.title}>
        <a href={item.url}>
          <span>{item.icon}</span>
          <span>{item.title}</span>
        </a>
      </Button>
    </Wrapper>
  );
}

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
