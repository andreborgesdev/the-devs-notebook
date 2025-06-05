"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/src/components/ui/sidebar";
import { ContentItem, NavItem } from "./nav-item";

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "core":
      return "from-blue-500 to-purple-500";
    case "frameworks":
      return "from-green-500 to-teal-500";
    case "resources":
      return "from-orange-500 to-red-500";
    default:
      return "from-blue-500 to-purple-500";
  }
};

const getCategoryTitle = (category: string) => {
  switch (category) {
    case "core":
      return "Core Concepts";
    case "frameworks":
      return "Frameworks & Libraries";
    case "resources":
      return "Resources";
    default:
      return "Core Concepts & Languages";
  }
};

export function NavMain({ items }: { items: ContentItem[] }) {
  // Core concepts and programming languages
  const coreItems = items.filter((item) =>
    [
      "Computer Science",
      "Data Structures",
      "Algorithms",
      "Java",
      "Kotlin",
      "Scala",
      "JavaScript",
      "Typescript",
      "OOP",
      "Functional Programming",
      "Cryptography",
      "System Design",
      "Databases",
      "APIs",
      "Design Patterns",
    ].includes(item.title)
  );

  // Frameworks and libraries
  const frameworkItems = items.filter((item) =>
    ["React", "React Native", "Kafka"].includes(item.title)
  );

  // Resources and reference materials
  const resourceItems = items.filter((item) =>
    [
      "Quick Reference Cards",
      "Cheat Sheet",
      "IT Books Summarized",
      "Interviews",
      "Misc",
    ].includes(item.title)
  );

  const renderGroup = (categoryItems: ContentItem[], category: string) => (
    <SidebarGroup key={category} className="px-0 mb-2">
      <SidebarGroupLabel className="px-4 text-xs uppercase tracking-wider text-sidebar-foreground/70 font-medium mb-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-1.5 h-1.5 bg-gradient-to-r ${getCategoryIcon(
              category
            )} rounded-full`}
          />
          {getCategoryTitle(category)}
        </div>
      </SidebarGroupLabel>
      <SidebarMenu className="space-y-1">
        {categoryItems.map((item) => (
          <NavItem key={item.title} item={item} depth={0} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );

  return (
    <>
      {renderGroup(coreItems, "core")}
      {renderGroup(frameworkItems, "frameworks")}
      {renderGroup(resourceItems, "resources")}
    </>
  );
}
