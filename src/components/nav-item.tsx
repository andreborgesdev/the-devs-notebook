"use client";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@radix-ui/react-collapsible";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { NavSubmenuTooltip } from "./nav-submenu-tooltip";
import {
  useSidebar,
  SidebarMenuItem,
  SidebarMenuSubItem,
  SidebarMenuButton,
  SidebarMenuSubButton,
  SidebarMenuSub,
} from "./ui/sidebar";

export type ContentItem = {
  title: string;
  url: string;
  icon?: string;
  isActive?: boolean;
  items?: ContentItem[];
};

export function NavItem({ item, depth }: { item: ContentItem; depth: number }) {
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
          {sidebarOpen && <span>{item.title}</span>}
        </div>
        <ChevronRight
          className="transition-transform duration-200"
          style={{
            transform: `rotate(${sidebarOpen ? "90deg" : "0deg"})`,
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
      {sidebarOpen && <span>{item.title}</span>}
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
