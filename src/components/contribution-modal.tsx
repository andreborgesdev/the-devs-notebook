"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Badge } from "@/src/components/ui/badge";
import { Separator } from "@/src/components/ui/separator";
import {
  X,
  Send,
  FileEdit,
  AlertCircle,
  Plus,
  Lightbulb,
  Bug,
  BookOpen,
  Users,
  CheckCircle,
  Star,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useToast } from "@/src/hooks/use-toast";

interface ContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageUrl?: string;
  pageTitle?: string;
}

interface ContributionFormData {
  type:
    | "correction"
    | "improvement"
    | "new-content"
    | "bug-report"
    | "suggestion";
  title: string;
  description: string;
  email: string;
  severity: "low" | "medium" | "high";
  section?: string;
}

const contributionTypes = [
  {
    id: "correction" as const,
    name: "Content Correction",
    description: "Fix typos, errors, or outdated information",
    icon: FileEdit,
    color: "bg-blue-500",
    examples: ["Typos", "Outdated code", "Incorrect explanations"],
  },
  {
    id: "improvement" as const,
    name: "Content Improvement",
    description: "Enhance existing content with better explanations",
    icon: Lightbulb,
    color: "bg-green-500",
    examples: ["Better examples", "Clearer explanations", "Additional context"],
  },
  {
    id: "new-content" as const,
    name: "New Content",
    description: "Suggest new topics or sections to add",
    icon: Plus,
    color: "bg-purple-500",
    examples: ["New algorithms", "Missing topics", "Advanced concepts"],
  },
  {
    id: "bug-report" as const,
    name: "Bug Report",
    description: "Report technical issues with the platform",
    icon: Bug,
    color: "bg-red-500",
    examples: ["Broken links", "Display issues", "Search problems"],
  },
  {
    id: "suggestion" as const,
    name: "General Suggestion",
    description: "Share ideas for improving the platform",
    icon: MessageSquare,
    color: "bg-orange-500",
    examples: ["UI improvements", "New features", "Better navigation"],
  },
];

const severityLevels = [
  { id: "low" as const, name: "Low", color: "bg-gray-500" },
  { id: "medium" as const, name: "Medium", color: "bg-yellow-500" },
  { id: "high" as const, name: "High", color: "bg-red-500" },
];

export function ContributionModal({
  isOpen,
  onClose,
  pageUrl,
  pageTitle,
}: ContributionModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ContributionFormData>({
    type: "correction",
    title: "",
    description: "",
    email: "",
    severity: "medium",
    section: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isOpen && step === 2 && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isOpen, step]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const resetForm = () => {
    setStep(1);
    setFormData({
      type: "correction",
      title: "",
      description: "",
      email: "",
      severity: "medium",
      section: "",
    });
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleTypeSelect = (type: ContributionFormData["type"]) => {
    setFormData((prev) => ({ ...prev, type }));
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const contributionData = {
        ...formData,
        pageUrl,
        pageTitle,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      };

      console.log("Contribution submitted:", contributionData);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Contribution Submitted!",
        description:
          "Thank you for helping improve the developer's notebook. We'll review your contribution soon.",
        variant: "success",
      });

      handleClose();
    } catch (error) {
      console.error("Error submitting contribution:", error);
      toast({
        title: "Submission Failed",
        description:
          "There was an error submitting your contribution. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedType = contributionTypes.find(
    (type) => type.id === formData.type
  );

  if (!isOpen || !isClient) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {step === 1 && (
          <Card className="w-full border-0 shadow-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">
                      Contribute to The Dev's Notebook
                    </CardTitle>
                    <CardDescription>
                      Help us improve by sharing your feedback and suggestions
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground mb-6">
                {pageTitle && (
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4" />
                    <span>
                      Current page: <strong>{pageTitle}</strong>
                    </span>
                  </div>
                )}
                Select the type of contribution you'd like to make:
              </div>

              <div className="grid gap-3">
                {contributionTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => handleTypeSelect(type.id)}
                      className="group p-4 border border-border rounded-lg hover:border-primary/50 hover:bg-accent/50 transition-all duration-200 text-left"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "p-2 rounded-lg text-white",
                            type.color
                          )}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {type.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {type.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {type.examples.map((example, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                {example}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-primary mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-foreground mb-1">
                      Your contributions help everyone learn better!
                    </p>
                    <p className="text-muted-foreground">
                      All submissions are reviewed by our team. High-quality
                      contributions may be featured and you'll be credited for
                      your help.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && selectedType && (
          <Card className="w-full border-0 shadow-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="p-2 hover:bg-accent rounded-lg transition-colors"
                    aria-label="Go back"
                  >
                    <selectedType.icon className="w-5 h-5" />
                  </button>
                  <div>
                    <CardTitle className="text-xl">
                      {selectedType.name}
                    </CardTitle>
                    <CardDescription>
                      {selectedType.description}
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Title <span className="text-red-500">*</span>
                    </label>
                    <Input
                      ref={titleInputRef}
                      id="title"
                      placeholder={`Brief description of your ${selectedType.name.toLowerCase()}`}
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  {(formData.type === "correction" ||
                    formData.type === "improvement") && (
                    <div>
                      <label
                        htmlFor="section"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
                        Section/Location
                      </label>
                      <Input
                        id="section"
                        placeholder="Which section needs attention? (e.g., 'JavaScript Arrays', 'React Hooks')"
                        value={formData.section}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            section: e.target.value,
                          }))
                        }
                      />
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Description <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      id="description"
                      placeholder="Provide detailed information about your contribution..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows={6}
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Be as specific as possible. Include examples, references,
                      or suggestions for improvement.
                    </p>
                  </div>

                  {(formData.type === "bug-report" ||
                    formData.type === "correction") && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3">
                        Priority Level
                      </label>
                      <div className="flex gap-2">
                        {severityLevels.map((level) => (
                          <button
                            key={level.id}
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                severity: level.id,
                              }))
                            }
                            className={cn(
                              "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all",
                              formData.severity === level.id
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            <div
                              className={cn(
                                "w-2 h-2 rounded-full",
                                level.color
                              )}
                            />
                            {level.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Email (optional)
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Provide your email if you'd like us to follow up or credit
                      you for your contribution.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      !formData.title.trim() ||
                      !formData.description.trim()
                    }
                    className="min-w-[120px]"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        Submit
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>,
    document.body
  );
}
