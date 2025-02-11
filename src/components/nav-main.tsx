"use client";

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
  useSidebar,
} from "@/src/components/ui/sidebar";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { NavSubmenuTooltip } from "./nav-submenu-tooltip";

export type ContentItem = {
  title: string;
  url: string;
  icon?: string;
  isActive?: boolean;
  items?: ContentItem[];
};

function NavItem({ item, depth }: { item: ContentItem; depth: number }) {
  const [open, setOpen] = useState(item.isActive);
  const { open: sidebarOpen, isMobile } = useSidebar();
  const hasChildren = item.items && item.items.length > 0;
  const isTopLevel = depth === 0;
  const Wrapper = isTopLevel ? SidebarMenuItem : SidebarMenuSubItem;
  const Button = isTopLevel ? SidebarMenuButton : SidebarMenuSubButton;

  if (hasChildren) {
    const buttonContent = (
      <Button
        tooltip={sidebarOpen ? item.title : undefined}
        className="flex w-full justify-between"
      >
        <div className="flex items-center gap-2">
          <span>{item.icon}</span>
          <span>{item.title}</span>
        </div>
        <ChevronRight
          className="transition-transform duration-200"
          style={{
            transform: `rotate(${open ? "90deg" : "0deg"})`,
          }}
        />
      </Button>
    );

    return (
      <Collapsible
        asChild
        defaultOpen={item.isActive}
        open={open}
        onOpenChange={setOpen}
      >
        <Wrapper>
          <CollapsibleTrigger asChild>
            {!sidebarOpen && hasChildren && !isMobile ? (
              <NavSubmenuTooltip item={item}>{buttonContent}</NavSubmenuTooltip>
            ) : (
              buttonContent
            )}
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

  const linkContent = (
    <a href={item.url} className="flex gap-2">
      <span>{item.icon}</span>
      <span>{item.title}</span>
    </a>
  );

  return (
    <Wrapper>
      <Button asChild tooltip={item.title}>
        {linkContent}
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
