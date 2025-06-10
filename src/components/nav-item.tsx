"use client";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@radix-ui/react-collapsible";
import { ChevronRight } from "lucide-react";
import { NavSubmenuTooltip } from "./nav-submenu-tooltip";
import {
  useSidebar,
  SidebarMenuItem,
  SidebarMenuSubItem,
  SidebarMenuButton,
  SidebarMenuSubButton,
  SidebarMenuSub,
} from "./ui/sidebar";
import { useNavigation } from "@/src/contexts/NavigationContext";
import { cn } from "@/src/lib/utils";
import { ReactNode } from "react";

export type ContentItem = {
  title: string;
  url: string;
  icon?: ReactNode | string;
  isActive?: boolean;
  items?: ContentItem[];
};

export function NavItem({ item, depth }: { item: ContentItem; depth: number }) {
  const { open: sidebarOpen, isMobile } = useSidebar();
  const { isMenuOpen, toggleSection, isActiveOrParent, activePath } =
    useNavigation();

  const hasChildren = item.items && item.items.length > 0;
  const isTopLevel = depth === 0;
  const Wrapper = isTopLevel ? SidebarMenuItem : SidebarMenuSubItem;
  const Button = isTopLevel ? SidebarMenuButton : SidebarMenuSubButton;

  // Check if this item or any of its children are active
  const isActive = isActiveOrParent(item.url);
  const isCurrentPage = activePath === item.url;

  // For parent items, determine if they should be open
  // Respect user's manual toggle state - don't force active sections to be open
  const shouldBeOpen = hasChildren && isMenuOpen(item.url);

  const handleToggle = () => {
    if (hasChildren) {
      toggleSection(item.url);
    }
  };

  if (hasChildren) {
    const buttonContent = (
      <Button
        tooltip={sidebarOpen ? item.title : undefined}
        className={cn(
          "flex w-full justify-between",
          isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
        )}
      >
        <div className="flex items-center gap-2">
          <span>{item.icon}</span>
          {sidebarOpen && <span>{item.title}</span>}
        </div>
        <ChevronRight
          className="transition-transform duration-200"
          style={{
            transform: `rotate(${shouldBeOpen ? "90deg" : "0deg"})`,
            display: sidebarOpen ? "block" : "none",
          }}
        />
      </Button>
    );

    return (
      <Collapsible asChild open={shouldBeOpen} onOpenChange={handleToggle}>
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
      <Button
        asChild
        tooltip={item.title}
        className={cn(
          isCurrentPage &&
            "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
        )}
      >
        {linkContent}
      </Button>
    </Wrapper>
  );
}
