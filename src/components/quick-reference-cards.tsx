"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/src/lib/utils";
import { useToast } from "@/src/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Search,
  Code,
  Database,
  Zap,
  Globe,
  Brain,
  Clock,
  CheckCircle,
  ArrowRight,
  Filter,
  Hash,
  Copy,
  ExternalLink,
} from "lucide-react";

interface QuickReferenceItem {
  id: string;
  title: string;
  category: string;
  description: string;
  content: {
    syntax?: string;
    example?: string;
    notes?: string[];
    complexity?: string;
    usage?: string[];
  };
  tags: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  language?: string;
}

interface QuickReferenceCardsProps {
  items?: QuickReferenceItem[];
  title?: string;
  description?: string;
  className?: string;
}

const difficultyColors = {
  beginner:
    "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  intermediate:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  advanced: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
};

const categoryIcons = {
  "Data Structures": Database,
  Algorithms: Brain,
  JavaScript: Code,
  TypeScript: Code,
  Java: Code,
  Python: Code,
  React: Globe,
  "System Design": Zap,
  "Big O": Clock,
  Patterns: Hash,
  Default: Code,
};

export function QuickReferenceCards({
  items = [],
  title = "Quick Reference",
  description = "Essential cheat sheets and quick references for developers",
  className,
}: QuickReferenceCardsProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  const categories = useMemo(() => {
    if (!items || items.length === 0) return [];
    const cats = Array.from(new Set(items.map((item) => item.category)));
    return cats.sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    if (!items || items.length === 0) return [];
    return items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const matchesDifficulty =
        selectedDifficulty === "all" || item.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [items, searchTerm, selectedCategory, selectedDifficulty]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "The code has been copied to your clipboard.",
        variant: "success",
      });
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast({
        title: "Copy failed",
        description: "Failed to copy the code to clipboard.",
        variant: "destructive",
      });
    }
  };

  const getCategoryIcon = (category: string) => {
    const IconComponent =
      categoryIcons[category as keyof typeof categoryIcons] ||
      categoryIcons.Default;
    return IconComponent;
  };

  return (
    <div className={cn("w-full space-y-6", className)}>
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search references..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-md border border-input bg-background text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 rounded-md border border-input bg-background text-sm"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Showing {filteredItems.length} of {items.length} references
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const IconComponent = getCategoryIcon(item.category);

          return (
            <Card
              key={item.id}
              className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base truncate">
                        {item.title}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.category}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn("text-xs", difficultyColors[item.difficulty])}
                  >
                    {item.difficulty}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                {item.content.syntax && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Syntax
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(item.content.syntax || "")
                        }
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <pre className="text-xs bg-muted/50 p-3 rounded-md overflow-x-auto font-mono border">
                      <code>{item.content.syntax}</code>
                    </pre>
                  </div>
                )}

                {item.content.example && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Example
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(item.content.example || "")
                        }
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <pre className="text-xs bg-accent/50 p-3 rounded-md overflow-x-auto font-mono border">
                      <code>{item.content.example}</code>
                    </pre>
                  </div>
                )}

                {item.content.complexity && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Complexity:
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {item.content.complexity}
                    </Badge>
                  </div>
                )}

                {item.content.usage && item.content.usage.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Common Uses
                    </h4>
                    <ul className="space-y-1">
                      {item.content.usage.slice(0, 2).map((use, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-xs"
                        >
                          <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{use}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {item.content.notes && item.content.notes.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Key Notes
                    </h4>
                    <ul className="space-y-1">
                      {item.content.notes.slice(0, 2).map((note, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-xs"
                        >
                          <div className="h-1 w-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground">{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 3).map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs px-2 py-0"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {item.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs px-2 py-0">
                        +{item.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No references found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or filters to find what you're
            looking for.
          </p>
        </div>
      )}
    </div>
  );
}
