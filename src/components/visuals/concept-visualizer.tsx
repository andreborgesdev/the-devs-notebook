"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/src/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import {
  Layers,
  ArrowRight,
  RotateCcw,
  Play,
  Pause,
  Database,
  Globe,
  Server,
  Users,
  Zap,
} from "lucide-react";

interface ConceptVisualizerProps {
  title?: string;
  description?: string;
  className?: string;
  height?: number;
  concept:
    | "react-lifecycle"
    | "java-collections"
    | "design-patterns"
    | "microservices-patterns";
}

interface LifecyclePhase {
  phase: string;
  methods: string[];
  description: string;
  color: string;
  active?: boolean;
}

interface CollectionStructure {
  name: string;
  type: "interface" | "class";
  parent?: string;
  implementations?: string[];
  methods: string[];
  color: string;
}

interface DesignPattern {
  name: string;
  category: "creational" | "structural" | "behavioral";
  intent: string;
  structure: string[];
  color: string;
}

interface MicroservicePattern {
  name: string;
  type: "communication" | "data" | "deployment" | "resilience";
  description: string;
  components: string[];
  color: string;
}

export function ConceptVisualizer({
  title,
  description,
  className,
  height = 500,
  concept,
}: ConceptVisualizerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const renderReactLifecycle = () => {
    const phases: LifecyclePhase[] = [
      {
        phase: "Mounting",
        methods: ["constructor()", "componentDidMount()"],
        description: "Component is being created and inserted into the DOM",
        color: "bg-green-100 border-green-300",
        active: currentStep === 0,
      },
      {
        phase: "Updating",
        methods: ["componentDidUpdate()", "getSnapshotBeforeUpdate()"],
        description: "Component is being re-rendered as a result of changes",
        color: "bg-blue-100 border-blue-300",
        active: currentStep === 1,
      },
      {
        phase: "Unmounting",
        methods: ["componentWillUnmount()"],
        description: "Component is being removed from the DOM",
        color: "bg-red-100 border-red-300",
        active: currentStep === 2,
      },
    ];

    const modernMethods = [
      "useState()",
      "useEffect()",
      "useContext()",
      "useReducer()",
      "useMemo()",
      "useCallback()",
    ];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {phases.map((phase, index) => (
            <div
              key={phase.phase}
              className={cn(
                "p-4 rounded-lg border-2 transition-all duration-300",
                phase.color,
                phase.active && "scale-105 shadow-lg"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <Layers className="h-5 w-5" />
                <h3 className="font-semibold">{phase.phase}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">{phase.description}</p>
              <div className="space-y-1">
                {phase.methods.map((method) => (
                  <Badge key={method} variant="outline" className="text-xs">
                    {method}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-purple-50 border-2 border-purple-300 rounded-lg">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Modern React Hooks
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {modernMethods.map((hook) => (
              <Badge key={hook} variant="secondary" className="justify-center">
                {hook}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentStep(Math.min(2, currentStep + 1))}
            disabled={currentStep === 2}
          >
            Next
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentStep(0)}>
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  };

  const renderJavaCollections = () => {
    const collections: CollectionStructure[] = [
      {
        name: "Collection",
        type: "interface",
        methods: ["add()", "remove()", "size()", "isEmpty()"],
        color: "bg-blue-50 border-blue-300",
      },
      {
        name: "List",
        type: "interface",
        parent: "Collection",
        implementations: ["ArrayList", "LinkedList", "Vector"],
        methods: ["get()", "set()", "indexOf()"],
        color: "bg-green-50 border-green-300",
      },
      {
        name: "Set",
        type: "interface",
        parent: "Collection",
        implementations: ["HashSet", "TreeSet", "LinkedHashSet"],
        methods: ["No duplicates", "Mathematical set"],
        color: "bg-yellow-50 border-yellow-300",
      },
      {
        name: "Map",
        type: "interface",
        implementations: ["HashMap", "TreeMap", "LinkedHashMap"],
        methods: ["put()", "get()", "keySet()", "values()"],
        color: "bg-purple-50 border-purple-300",
      },
    ];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collections.map((collection) => (
            <div
              key={collection.name}
              className={cn("p-4 rounded-lg border-2", collection.color)}
            >
              <div className="flex items-center gap-2 mb-3">
                <Database className="h-5 w-5" />
                <h3 className="font-semibold">{collection.name}</h3>
                <Badge
                  variant={
                    collection.type === "interface" ? "default" : "secondary"
                  }
                >
                  {collection.type}
                </Badge>
              </div>

              {collection.parent && (
                <div className="mb-2">
                  <span className="text-sm text-gray-600">Extends: </span>
                  <Badge variant="outline">{collection.parent}</Badge>
                </div>
              )}

              {collection.implementations && (
                <div className="mb-3">
                  <span className="text-sm text-gray-600 block mb-1">
                    Implementations:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {collection.implementations.map((impl) => (
                      <Badge key={impl} variant="secondary" className="text-xs">
                        {impl}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <span className="text-sm text-gray-600 block mb-1">
                  Key Methods:
                </span>
                <div className="space-y-1">
                  {collection.methods.map((method) => (
                    <div
                      key={method}
                      className="text-sm font-mono bg-white px-2 py-1 rounded"
                    >
                      {method}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-gray-50 rounded border">
            <h4 className="font-semibold mb-2">Big O Complexity</h4>
            <div className="space-y-1 text-sm">
              <div>ArrayList: get O(1), add O(1)</div>
              <div>LinkedList: get O(n), add O(1)</div>
              <div>HashMap: get/put O(1) avg</div>
              <div>TreeMap: get/put O(log n)</div>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded border">
            <h4 className="font-semibold mb-2">When to Use</h4>
            <div className="space-y-1 text-sm">
              <div>List: Ordered data with duplicates</div>
              <div>Set: Unique elements only</div>
              <div>Map: Key-value relationships</div>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded border">
            <h4 className="font-semibold mb-2">Thread Safety</h4>
            <div className="space-y-1 text-sm">
              <div>Vector: Thread-safe (legacy)</div>
              <div>Collections.synchronizedXxx()</div>
              <div>ConcurrentHashMap</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDesignPatterns = () => {
    const patterns: DesignPattern[] = [
      {
        name: "Singleton",
        category: "creational",
        intent: "Ensure a class has only one instance",
        structure: [
          "Private constructor",
          "Static instance",
          "Public accessor",
        ],
        color: "bg-red-50 border-red-300",
      },
      {
        name: "Factory Method",
        category: "creational",
        intent: "Create objects without specifying exact classes",
        structure: [
          "Creator interface",
          "Concrete creators",
          "Product hierarchy",
        ],
        color: "bg-red-50 border-red-300",
      },
      {
        name: "Adapter",
        category: "structural",
        intent: "Allow incompatible interfaces to work together",
        structure: ["Target interface", "Adapter class", "Adaptee"],
        color: "bg-blue-50 border-blue-300",
      },
      {
        name: "Facade",
        category: "structural",
        intent: "Provide simplified interface to complex subsystem",
        structure: ["Facade class", "Subsystem classes", "Client"],
        color: "bg-blue-50 border-blue-300",
      },
      {
        name: "Observer",
        category: "behavioral",
        intent: "Define dependency between objects for notifications",
        structure: ["Subject", "Observer interface", "Concrete observers"],
        color: "bg-green-50 border-green-300",
      },
      {
        name: "Strategy",
        category: "behavioral",
        intent: "Define family of algorithms and make them interchangeable",
        structure: ["Context", "Strategy interface", "Concrete strategies"],
        color: "bg-green-50 border-green-300",
      },
    ];

    const categories = ["creational", "structural", "behavioral"] as const;

    return (
      <Tabs defaultValue="creational" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="capitalize">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {patterns
                .filter((pattern) => pattern.category === category)
                .map((pattern) => (
                  <div
                    key={pattern.name}
                    className={cn("p-4 rounded-lg border-2", pattern.color)}
                  >
                    <h3 className="font-semibold mb-2">{pattern.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {pattern.intent}
                    </p>
                    <div>
                      <span className="text-sm font-medium">Structure:</span>
                      <ul className="mt-1 space-y-1">
                        {pattern.structure.map((item) => (
                          <li
                            key={item}
                            className="text-sm flex items-center gap-2"
                          >
                            <ArrowRight className="h-3 w-3" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    );
  };

  const renderMicroservicesPatterns = () => {
    const patterns: MicroservicePattern[] = [
      {
        name: "API Gateway",
        type: "communication",
        description: "Single entry point for all client requests",
        components: ["Router", "Auth", "Rate Limiting", "Load Balancer"],
        color: "bg-blue-50 border-blue-300",
      },
      {
        name: "Circuit Breaker",
        type: "resilience",
        description: "Prevent cascading failures in distributed systems",
        components: ["Monitor", "Fallback", "Recovery", "Threshold"],
        color: "bg-red-50 border-red-300",
      },
      {
        name: "Database per Service",
        type: "data",
        description: "Each service owns its data and database",
        components: ["Service DB", "Data Sync", "Event Sourcing", "CQRS"],
        color: "bg-green-50 border-green-300",
      },
      {
        name: "Service Mesh",
        type: "communication",
        description:
          "Infrastructure layer for service-to-service communication",
        components: ["Proxy", "Control Plane", "Observability", "Security"],
        color: "bg-blue-50 border-blue-300",
      },
      {
        name: "Saga Pattern",
        type: "data",
        description: "Manage distributed transactions across services",
        components: [
          "Orchestrator",
          "Compensations",
          "State Machine",
          "Events",
        ],
        color: "bg-green-50 border-green-300",
      },
      {
        name: "Container Deployment",
        type: "deployment",
        description: "Package and deploy services as containers",
        components: ["Docker", "Kubernetes", "Registry", "Orchestration"],
        color: "bg-purple-50 border-purple-300",
      },
    ];

    const types = [
      "communication",
      "data",
      "deployment",
      "resilience",
    ] as const;
    const typeIcons = {
      communication: Globe,
      data: Database,
      deployment: Server,
      resilience: Zap,
    };

    return (
      <Tabs defaultValue="communication" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {types.map((type) => {
            const Icon = typeIcons[type];
            return (
              <TabsTrigger
                key={type}
                value={type}
                className="capitalize flex items-center gap-1"
              >
                <Icon className="h-3 w-3" />
                {type}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {types.map((type) => (
          <TabsContent key={type} value={type} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {patterns
                .filter((pattern) => pattern.type === type)
                .map((pattern) => (
                  <div
                    key={pattern.name}
                    className={cn("p-4 rounded-lg border-2", pattern.color)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {React.createElement(typeIcons[pattern.type], {
                        className: "h-5 w-5",
                      })}
                      <h3 className="font-semibold">{pattern.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {pattern.description}
                    </p>
                    <div>
                      <span className="text-sm font-medium">Components:</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {pattern.components.map((component) => (
                          <Badge
                            key={component}
                            variant="outline"
                            className="text-xs"
                          >
                            {component}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    );
  };

  const renderConcept = () => {
    switch (concept) {
      case "react-lifecycle":
        return renderReactLifecycle();
      case "java-collections":
        return renderJavaCollections();
      case "design-patterns":
        return renderDesignPatterns();
      case "microservices-patterns":
        return renderMicroservicesPatterns();
      default:
        return <div>Concept not implemented</div>;
    }
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      {(title || description) && (
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              {title && <CardTitle className="text-lg">{title}</CardTitle>}
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
          </div>
        </CardHeader>
      )}
      <CardContent>
        <div style={{ minHeight: `${height}px` }}>{renderConcept()}</div>
      </CardContent>
    </Card>
  );
}

export function ReactLifecycleDemo({ className }: { className?: string }) {
  return (
    <ConceptVisualizer
      title="React Component Lifecycle"
      description="Interactive visualization of React component lifecycle methods and modern hooks"
      className={className}
      height={400}
      concept="react-lifecycle"
    />
  );
}

export function JavaCollectionsDemo({ className }: { className?: string }) {
  return (
    <ConceptVisualizer
      title="Java Collections Framework"
      description="Visual guide to Java collections hierarchy, implementations, and use cases"
      className={className}
      height={500}
      concept="java-collections"
    />
  );
}

export function DesignPatternsDemo({ className }: { className?: string }) {
  return (
    <ConceptVisualizer
      title="Design Patterns Overview"
      description="Interactive catalog of common design patterns organized by category"
      className={className}
      height={400}
      concept="design-patterns"
    />
  );
}

export function MicroservicesPatternsDemo({
  className,
}: {
  className?: string;
}) {
  return (
    <ConceptVisualizer
      title="Microservices Patterns"
      description="Essential patterns for building and managing microservices architecture"
      className={className}
      height={400}
      concept="microservices-patterns"
    />
  );
}
