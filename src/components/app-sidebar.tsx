"use client";

import * as React from "react";
import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NavMain } from "@/src/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/src/components/ui/sidebar";
import { SidebarActions } from "./sidebar-actions";
import { SettingsPanel } from "./settings-panel";
import { ContributionButton } from "./contribution-button";
import { ContributionModal } from "./contribution-modal";
import { cn } from "../lib/utils";
import { Content } from "../data/Content";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar();
  const pathname = usePathname();

  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);
  const [isOfflineManagerOpen, setIsOfflineManagerOpen] = useState(false);

  const getPageTitle = () => {
    if (pathname === "/") return "Homepage";
    const parts = pathname.split("/").filter(Boolean);
    return parts
      .map((part) =>
        part
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      )
      .join(" - ");
  };

  const getPageUrl = () => {
    return typeof window !== "undefined" ? window.location.href : pathname;
  };

  const handleSettingsClick = () => {
    setIsSettingsPanelOpen(true);
  };

  const handleContributionClick = () => {
    setIsContributionModalOpen(true);
  };

  const handleOfflineClick = () => {
    setIsOfflineManagerOpen(!isOfflineManagerOpen);
  };

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="border-r-0 bg-gradient-to-b from-sidebar-background to-sidebar-background/95"
      role="navigation"
      aria-label="Main navigation"
    >
      <SidebarHeader className="border-b border-sidebar-border/50">
        <a
          href="/"
          className={cn(
            "flex flex-row items-center gap-4 transition-all duration-200 hover:bg-sidebar-accent/50 rounded-lg focus-visible-enhanced",
            open ? "p-4" : "p-1"
          )}
          aria-label="Go to homepage - The dev's notebook"
        >
          <div className="relative">
            <Image
              src="/images/logo.png"
              alt="The dev's notebook logo"
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
      <SidebarContent
        className="px-2 py-4"
        role="main"
        aria-label="Navigation topics"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-purple-500/5 rounded-lg" />
          <NavMain items={Content} />
        </div>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border/50 p-4">
        <SidebarActions
          isOpen={open}
          onSettingsClick={handleSettingsClick}
          onContributionClick={handleContributionClick}
          onOfflineClick={handleOfflineClick}
        />
      </SidebarFooter>
      <SidebarRail />

      {/* Modals and Panels */}
      <SettingsPanel
        embedded={true}
        className="absolute bottom-16 left-2 z-[100]"
        isOpen={isSettingsPanelOpen}
        onClose={() => setIsSettingsPanelOpen(false)}
      />

      <ContributionModal
        isOpen={isContributionModalOpen}
        onClose={() => setIsContributionModalOpen(false)}
        pageUrl={getPageUrl()}
        pageTitle={getPageTitle()}
      />
    </Sidebar>
  );
}
