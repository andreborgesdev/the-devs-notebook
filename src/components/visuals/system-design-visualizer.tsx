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
import { Input } from "@/src/components/ui/input";
import {
  Monitor,
  Cpu,
  HardDrive,
  Network,
  MemoryStick,
  Server,
  Users,
  Shield,
  Zap,
  ArrowUpDown,
  ArrowRight,
  Database,
  Globe,
} from "lucide-react";

interface SystemDesignVisualizerProps {
  title?: string;
  description?: string;
  className?: string;
  height?: number;
  concept:
    | "caching-strategies"
    | "load-balancing"
    | "database-sharding"
    | "cap-theorem"
    | "scaling-patterns";
}

interface CacheLevel {
  name: string;
  latency: string;
  capacity: string;
  description: string;
  color: string;
}

interface LoadBalancer {
  type: string;
  algorithm: string;
  description: string;
  pros: string[];
  cons: string[];
}

export function SystemDesignVisualizer({
  title,
  description,
  className,
  height = 500,
  concept,
}: SystemDesignVisualizerProps) {
  const [selectedStrategy, setSelectedStrategy] = useState<string>("cdn");
  const [currentLoadBalancer, setCurrentLoadBalancer] =
    useState<string>("round-robin");
  const [selectedShard, setSelectedShard] = useState<number>(0);
  const [capProperty, setCapProperty] = useState<string>("consistency");

  const renderCachingStrategies = () => {
    const cacheStrategies = {
      cdn: {
        name: "Content Delivery Network (CDN)",
        description: "Geographic distribution of static content",
        latency: "50-100ms",
        use_case: "Static assets, images, videos",
        example: "CloudFlare, AWS CloudFront",
      },
      browser: {
        name: "Browser Cache",
        description: "Client-side caching in web browser",
        latency: "0-10ms",
        use_case: "CSS, JS files, images",
        example: "HTTP cache headers",
      },
      reverse_proxy: {
        name: "Reverse Proxy Cache",
        description: "Cache at application gateway level",
        latency: "1-5ms",
        use_case: "API responses, rendered pages",
        example: "Nginx, Varnish",
      },
      application: {
        name: "Application Cache",
        description: "In-memory cache within application",
        latency: "0.1-1ms",
        use_case: "Database query results, session data",
        example: "Redis, Memcached",
      },
      database: {
        name: "Database Cache",
        description: "Built-in database caching mechanisms",
        latency: "1-10ms",
        use_case: "Query results, execution plans",
        example: "MySQL query cache, PostgreSQL shared buffers",
      },
    };

    const cacheLevels: CacheLevel[] = [
      {
        name: "L1 CPU",
        latency: "1-3 cycles",
        capacity: "64KB",
        description: "Fastest cache on CPU",
        color: "bg-red-100 border-red-300",
      },
      {
        name: "L2 CPU",
        latency: "10-25 cycles",
        capacity: "256KB-1MB",
        description: "Second level CPU cache",
        color: "bg-orange-100 border-orange-300",
      },
      {
        name: "L3 CPU",
        latency: "30-70 cycles",
        capacity: "8-64MB",
        description: "Shared CPU cache",
        color: "bg-yellow-100 border-yellow-300",
      },
      {
        name: "RAM",
        latency: "200-300 cycles",
        capacity: "8-128GB",
        description: "System memory",
        color: "bg-green-100 border-green-300",
      },
      {
        name: "SSD",
        latency: "100μs",
        capacity: "1TB+",
        description: "Solid state storage",
        color: "bg-blue-100 border-blue-300",
      },
      {
        name: "HDD",
        latency: "10ms",
        capacity: "10TB+",
        description: "Magnetic disk storage",
        color: "bg-purple-100 border-purple-300",
      },
    ];

    return (
      <div className="space-y-6">
        <Tabs
          value={selectedStrategy}
          onValueChange={setSelectedStrategy}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-5">
            {Object.keys(cacheStrategies).map((key) => (
              <TabsTrigger key={key} value={key} className="text-xs">
                {key.replace("_", " ").toUpperCase()}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(cacheStrategies).map(([key, strategy]) => (
            <TabsContent key={key} value={key} className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border">
                <h3 className="font-semibold text-lg mb-2">{strategy.name}</h3>
                <p className="text-sm text-gray-700 mb-3">
                  {strategy.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-600" />
                    <div>
                      <div className="text-xs text-gray-600">Latency</div>
                      <div className="font-semibold">{strategy.latency}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4 text-blue-600" />
                    <div>
                      <div className="text-xs text-gray-600">Best For</div>
                      <div className="font-semibold text-sm">
                        {strategy.use_case}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-green-600" />
                    <div>
                      <div className="text-xs text-gray-600">Example</div>
                      <div className="font-semibold text-sm">
                        {strategy.example}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="space-y-4">
          <h3 className="font-semibold">Cache Hierarchy & Performance</h3>
          <div className="space-y-2">
            {cacheLevels.map((level, index) => (
              <div
                key={level.name}
                className={cn("p-3 rounded-lg border-2", level.color)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold">{level.name}</h4>
                      <p className="text-xs text-gray-600">
                        {level.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{level.latency}</div>
                    <div className="text-xs text-gray-600">
                      {level.capacity}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderLoadBalancing = () => {
    const loadBalancers: { [key: string]: LoadBalancer } = {
      "round-robin": {
        type: "Round Robin",
        algorithm: "Sequential distribution",
        description: "Requests distributed sequentially to each server",
        pros: [
          "Simple to implement",
          "Fair distribution",
          "No server state needed",
        ],
        cons: ["Doesn't consider server load", "May overload slower servers"],
      },
      "least-connections": {
        type: "Least Connections",
        algorithm: "Route to server with fewest active connections",
        description:
          "Directs traffic to the server handling the least connections",
        pros: [
          "Better for long-lived connections",
          "Adapts to server performance",
        ],
        cons: ["Requires connection tracking", "More complex implementation"],
      },
      weighted: {
        type: "Weighted Round Robin",
        algorithm: "Distribution based on server weights",
        description: "Servers with higher weights receive more requests",
        pros: ["Accounts for server capacity", "Flexible resource allocation"],
        cons: ["Requires weight configuration", "Static weight assignment"],
      },
      "ip-hash": {
        type: "IP Hash",
        algorithm: "Hash client IP to determine server",
        description: "Client IP determines which server handles the request",
        pros: ["Session persistence", "Consistent routing"],
        cons: ["Uneven distribution possible", "Affected by proxy servers"],
      },
      "health-check": {
        type: "Health Check",
        algorithm: "Route only to healthy servers",
        description: "Monitors server health and routes accordingly",
        pros: ["High availability", "Automatic failover"],
        cons: ["Additional overhead", "Complex health monitoring"],
      },
    };

    const servers = [
      { id: 1, name: "Server 1", load: 45, healthy: true, connections: 12 },
      { id: 2, name: "Server 2", load: 78, healthy: true, connections: 23 },
      { id: 3, name: "Server 3", load: 23, healthy: true, connections: 8 },
      { id: 4, name: "Server 4", load: 91, healthy: false, connections: 0 },
    ];

    const getSelectedServer = () => {
      switch (currentLoadBalancer) {
        case "round-robin":
          return 0; // Always first for demo
        case "least-connections":
          return servers.reduce(
            (minIndex, server, index) =>
              server.healthy &&
              server.connections < servers[minIndex].connections
                ? index
                : minIndex,
            0
          );
        case "weighted":
          return 2; // Assume server 3 has highest weight
        case "ip-hash":
          return 1; // Consistent hash result
        case "health-check":
          return servers.findIndex((s) => s.healthy);
        default:
          return 0;
      }
    };

    const selectedServerIndex = getSelectedServer();

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {Object.keys(loadBalancers).map((key) => (
            <Button
              key={key}
              variant={currentLoadBalancer === key ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentLoadBalancer(key)}
            >
              {loadBalancers[key].type}
            </Button>
          ))}
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">
            {loadBalancers[currentLoadBalancer].type}
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            {loadBalancers[currentLoadBalancer].description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-green-700 mb-1">Advantages:</h4>
              <ul className="space-y-1">
                {loadBalancers[currentLoadBalancer].pros.map((pro, index) => (
                  <li key={index} className="text-sm flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    {pro}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-red-700 mb-1">Considerations:</h4>
              <ul className="space-y-1">
                {loadBalancers[currentLoadBalancer].cons.map((con, index) => (
                  <li key={index} className="text-sm flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-lg border-2 border-blue-300">
              <div className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                <span className="font-semibold">Load Balancer</span>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {loadBalancers[currentLoadBalancer].algorithm}
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowUpDown className="h-6 w-6 text-gray-400" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {servers.map((server, index) => (
              <div
                key={server.id}
                className={cn(
                  "p-3 rounded-lg border-2 transition-all duration-300",
                  index === selectedServerIndex
                    ? "bg-green-100 border-green-500 scale-105"
                    : server.healthy
                    ? "bg-gray-100 border-gray-300"
                    : "bg-red-100 border-red-300"
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Server
                    className={cn(
                      "h-4 w-4",
                      server.healthy ? "text-green-600" : "text-red-600"
                    )}
                  />
                  <span className="font-semibold text-sm">{server.name}</span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Load:</span>
                    <span
                      className={cn(
                        "font-semibold",
                        server.load > 80
                          ? "text-red-600"
                          : server.load > 60
                          ? "text-yellow-600"
                          : "text-green-600"
                      )}
                    >
                      {server.load}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Connections:</span>
                    <span className="font-semibold">{server.connections}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge
                      variant={server.healthy ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {server.healthy ? "Healthy" : "Down"}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedServerIndex >= 0 && (
            <div className="text-center p-2 bg-blue-50 rounded">
              <p className="text-sm text-blue-800">
                Request routed to{" "}
                <strong>{servers[selectedServerIndex].name}</strong> using{" "}
                {loadBalancers[currentLoadBalancer].type}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderDatabaseSharding = () => {
    const shardingStrategies = [
      {
        name: "Horizontal Sharding",
        description: "Split rows across multiple databases",
        example: "Users 1-1000 → Shard 1, Users 1001-2000 → Shard 2",
      },
      {
        name: "Vertical Sharding",
        description: "Split columns/tables across databases",
        example: "User profiles → DB1, User activity → DB2",
      },
      {
        name: "Hash-based Sharding",
        description: "Use hash function to determine shard",
        example: "hash(user_id) % num_shards",
      },
    ];

    const shards = [
      {
        id: 0,
        name: "Shard 1",
        range: "Users 1-2500",
        load: 65,
        size: "15GB",
        records: "2,500",
      },
      {
        id: 1,
        name: "Shard 2",
        range: "Users 2501-5000",
        load: 78,
        size: "18GB",
        records: "2,500",
      },
      {
        id: 2,
        name: "Shard 3",
        range: "Users 5001-7500",
        load: 45,
        size: "12GB",
        records: "2,500",
      },
      {
        id: 3,
        name: "Shard 4",
        range: "Users 7501-10000",
        load: 89,
        size: "22GB",
        records: "2,500",
      },
    ];

    const benefits = [
      "Improved performance through parallel processing",
      "Better scalability - add more shards as needed",
      "Reduced database size per shard",
      "Fault isolation - failure affects only one shard",
    ];

    const challenges = [
      "Complex query routing logic required",
      "Cross-shard joins are expensive",
      "Rebalancing data when adding shards",
      "Maintaining data consistency across shards",
    ];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {shardingStrategies.map((strategy, index) => (
            <div key={index} className="p-4 bg-blue-50 rounded-lg border">
              <h3 className="font-semibold mb-2">{strategy.name}</h3>
              <p className="text-sm text-gray-700 mb-2">
                {strategy.description}
              </p>
              <div className="text-xs bg-white p-2 rounded border">
                <strong>Example:</strong> {strategy.example}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Database Shards Overview</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {shards.map((shard) => (
              <div
                key={shard.id}
                className={cn(
                  "p-4 rounded-lg border-2 cursor-pointer transition-all",
                  selectedShard === shard.id
                    ? "bg-blue-100 border-blue-500"
                    : "bg-gray-50 border-gray-300"
                )}
                onClick={() => setSelectedShard(shard.id)}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Database className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold">{shard.name}</span>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Range:</span>
                    <div className="font-semibold">{shard.range}</div>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Load:</span>
                    <Badge
                      variant={
                        shard.load > 80
                          ? "destructive"
                          : shard.load > 60
                          ? "outline"
                          : "default"
                      }
                    >
                      {shard.load}%
                    </Badge>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Size:</span>
                    <span className="font-semibold">{shard.size}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Records:</span>
                    <span className="font-semibold">{shard.records}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedShard >= 0 && (
            <div className="p-4 bg-green-50 rounded-lg border">
              <h4 className="font-semibold mb-2">
                Selected: {shards[selectedShard].name}
              </h4>
              <p className="text-sm text-gray-700">
                This shard contains {shards[selectedShard].range.toLowerCase()}{" "}
                with {shards[selectedShard].records} records totaling{" "}
                {shards[selectedShard].size} in size and running at{" "}
                {shards[selectedShard].load}% capacity.
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border">
            <h4 className="font-semibold text-green-800 mb-3">Benefits</h4>
            <ul className="space-y-2">
              {benefits.map((benefit, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-orange-50 rounded-lg border">
            <h4 className="font-semibold text-orange-800 mb-3">Challenges</h4>
            <ul className="space-y-2">
              {challenges.map((challenge, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2" />
                  {challenge}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderCAPTheorem = () => {
    const capProperties = {
      consistency: {
        name: "Consistency",
        description: "All nodes see the same data simultaneously",
        example: "Bank account balance must be identical across all servers",
        icon: "🔄",
        color: "bg-blue-50 border-blue-300",
      },
      availability: {
        name: "Availability",
        description: "System remains operational and responsive",
        example: "Website stays online even if some servers fail",
        icon: "⚡",
        color: "bg-green-50 border-green-300",
      },
      partition: {
        name: "Partition Tolerance",
        description: "System continues despite network failures",
        example: "Service works even if data centers can't communicate",
        icon: "🌐",
        color: "bg-purple-50 border-purple-300",
      },
    };

    const systemTypes = [
      {
        name: "CA Systems",
        properties: ["Consistency", "Availability"],
        description: "Consistent and Available but not Partition Tolerant",
        examples: ["Traditional RDBMS", "ACID databases"],
        tradeoff: "Cannot handle network partitions",
      },
      {
        name: "CP Systems",
        properties: ["Consistency", "Partition Tolerance"],
        description:
          "Consistent and Partition Tolerant but not Always Available",
        examples: ["MongoDB", "HBase", "Redis Cluster"],
        tradeoff: "May become unavailable during partitions",
      },
      {
        name: "AP Systems",
        properties: ["Availability", "Partition Tolerance"],
        description:
          "Available and Partition Tolerant but Eventually Consistent",
        examples: ["Cassandra", "DynamoDB", "CouchDB"],
        tradeoff: "Data may be temporarily inconsistent",
      },
    ];

    return (
      <div className="space-y-6">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">CAP Theorem</h3>
          <p className="text-sm text-gray-600">
            In any distributed system, you can only guarantee{" "}
            <strong>two</strong> of the three properties simultaneously
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(capProperties).map(([key, property]) => (
            <div
              key={key}
              className={cn(
                "p-4 rounded-lg border-2 cursor-pointer transition-all",
                capProperty === key
                  ? `${property.color} scale-105`
                  : "bg-gray-50 border-gray-300"
              )}
              onClick={() => setCapProperty(key)}
            >
              <div className="text-center mb-3">
                <span className="text-3xl">{property.icon}</span>
                <h3 className="font-semibold text-lg">{property.name}</h3>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                {property.description}
              </p>
              <div className="text-xs bg-white p-2 rounded border">
                <strong>Example:</strong> {property.example}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">System Classifications</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {systemTypes.map((system, index) => (
              <div key={index} className="p-4 bg-white rounded-lg border">
                <h4 className="font-semibold text-lg mb-2">{system.name}</h4>
                <p className="text-sm text-gray-600 mb-3">
                  {system.description}
                </p>

                <div className="space-y-3">
                  <div>
                    <h5 className="font-medium text-sm mb-1">Guarantees:</h5>
                    <div className="flex gap-1">
                      {system.properties.map((prop) => (
                        <Badge key={prop} variant="default" className="text-xs">
                          {prop}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-sm mb-1">Examples:</h5>
                    <div className="flex flex-wrap gap-1">
                      {system.examples.map((example) => (
                        <Badge
                          key={example}
                          variant="outline"
                          className="text-xs"
                        >
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="p-2 bg-orange-50 rounded text-xs">
                    <strong>Trade-off:</strong> {system.tradeoff}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold mb-2">Key Insights</h4>
          <ul className="space-y-1 text-sm">
            <li>• Network partitions are inevitable in distributed systems</li>
            <li>• Most modern systems are either CP or AP, not CA</li>
            <li>• The choice depends on your application's requirements</li>
            <li>• Some systems allow you to tune the trade-offs</li>
          </ul>
        </div>
      </div>
    );
  };

  const renderScalingPatterns = () => {
    const scalingPatterns = {
      horizontal: {
        name: "Horizontal Scaling (Scale Out)",
        description: "Add more servers to handle increased load",
        icon: "↔️",
        pros: [
          "Better fault tolerance",
          "Cost-effective with commodity hardware",
          "Nearly unlimited scaling potential",
        ],
        cons: [
          "Complex data consistency",
          "Network overhead",
          "More operational complexity",
        ],
        examples: [
          "Microservices",
          "Load balancer + web servers",
          "Database sharding",
        ],
      },
      vertical: {
        name: "Vertical Scaling (Scale Up)",
        description: "Increase power of existing servers (CPU, RAM, storage)",
        icon: "⬆️",
        pros: [
          "Simple to implement",
          "No architectural changes",
          "Strong consistency",
        ],
        cons: [
          "Single point of failure",
          "Hardware limits",
          "Expensive high-end hardware",
        ],
        examples: [
          "Upgrading server specs",
          "Adding more CPU cores",
          "Increasing RAM",
        ],
      },
      elastic: {
        name: "Elastic Scaling",
        description: "Automatically scale resources based on demand",
        icon: "🔄",
        pros: [
          "Cost optimization",
          "Handles traffic spikes",
          "Minimal manual intervention",
        ],
        cons: [
          "Complex configuration",
          "Potential for rapid scaling costs",
          "Cold start delays",
        ],
        examples: [
          "AWS Auto Scaling",
          "Kubernetes HPA",
          "Google Cloud Autoscaler",
        ],
      },
    };

    const architecturePatterns = [
      {
        name: "Monolithic",
        description: "Single deployable unit containing all functionality",
        scaling: "Vertical scaling primarily",
        complexity: "Low",
        color: "bg-red-50 border-red-300",
      },
      {
        name: "Service-Oriented",
        description: "Multiple services with clear interfaces",
        scaling: "Mixed vertical and horizontal",
        complexity: "Medium",
        color: "bg-yellow-50 border-yellow-300",
      },
      {
        name: "Microservices",
        description: "Fine-grained services with independent scaling",
        scaling: "Horizontal scaling per service",
        complexity: "High",
        color: "bg-green-50 border-green-300",
      },
      {
        name: "Serverless",
        description: "Function-based compute with automatic scaling",
        scaling: "Automatic elastic scaling",
        complexity: "Medium",
        color: "bg-blue-50 border-blue-300",
      },
    ];

    const [selectedPattern, setSelectedPattern] =
      useState<string>("horizontal");

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {Object.keys(scalingPatterns).map((key) => (
            <Button
              key={key}
              variant={selectedPattern === key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPattern(key)}
            >
              {
                scalingPatterns[key as keyof typeof scalingPatterns].name.split(
                  " "
                )[0]
              }
            </Button>
          ))}
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">
              {
                scalingPatterns[selectedPattern as keyof typeof scalingPatterns]
                  .icon
              }
            </span>
            <h3 className="font-semibold text-lg">
              {
                scalingPatterns[selectedPattern as keyof typeof scalingPatterns]
                  .name
              }
            </h3>
          </div>
          <p className="text-sm text-gray-700 mb-4">
            {
              scalingPatterns[selectedPattern as keyof typeof scalingPatterns]
                .description
            }
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-green-700 mb-2">Advantages:</h4>
              <ul className="space-y-1">
                {scalingPatterns[
                  selectedPattern as keyof typeof scalingPatterns
                ].pros.map((pro, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2" />
                    {pro}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-red-700 mb-2">Disadvantages:</h4>
              <ul className="space-y-1">
                {scalingPatterns[
                  selectedPattern as keyof typeof scalingPatterns
                ].cons.map((con, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2" />
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-medium mb-2">Common Examples:</h4>
            <div className="flex flex-wrap gap-2">
              {scalingPatterns[
                selectedPattern as keyof typeof scalingPatterns
              ].examples.map((example) => (
                <Badge key={example} variant="outline" className="text-xs">
                  {example}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Architecture Patterns & Scaling</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {architecturePatterns.map((pattern, index) => (
              <div
                key={index}
                className={cn("p-4 rounded-lg border-2", pattern.color)}
              >
                <h4 className="font-semibold mb-2">{pattern.name}</h4>
                <p className="text-sm text-gray-700 mb-3">
                  {pattern.description}
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Scaling Approach:</span>
                    <span className="font-semibold">{pattern.scaling}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Complexity:</span>
                    <Badge
                      variant={
                        pattern.complexity === "Low"
                          ? "default"
                          : pattern.complexity === "Medium"
                          ? "outline"
                          : "destructive"
                      }
                    >
                      {pattern.complexity}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold mb-2">Scaling Decision Framework</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h5 className="font-medium mb-1">Consider Vertical When:</h5>
              <ul className="space-y-1">
                <li>• Simple application architecture</li>
                <li>• Strong consistency requirements</li>
                <li>• Limited development resources</li>
              </ul>
            </div>

            <div>
              <h5 className="font-medium mb-1">Consider Horizontal When:</h5>
              <ul className="space-y-1">
                <li>• Need high availability</li>
                <li>• Expecting massive scale</li>
                <li>• Can handle eventual consistency</li>
              </ul>
            </div>

            <div>
              <h5 className="font-medium mb-1">Consider Elastic When:</h5>
              <ul className="space-y-1">
                <li>• Variable traffic patterns</li>
                <li>• Cost optimization priority</li>
                <li>• Cloud-native architecture</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderConcept = () => {
    switch (concept) {
      case "caching-strategies":
        return renderCachingStrategies();
      case "load-balancing":
        return renderLoadBalancing();
      case "database-sharding":
        return renderDatabaseSharding();
      case "cap-theorem":
        return renderCAPTheorem();
      case "scaling-patterns":
        return renderScalingPatterns();
      default:
        return <div>System design concept not implemented</div>;
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

export function CachingStrategiesDemo({ className }: { className?: string }) {
  return (
    <SystemDesignVisualizer
      title="Caching Strategies"
      description="Comprehensive overview of caching levels and strategies in system design"
      className={className}
      height={600}
      concept="caching-strategies"
    />
  );
}

export function LoadBalancingDemo({ className }: { className?: string }) {
  return (
    <SystemDesignVisualizer
      title="Load Balancing Algorithms"
      description="Interactive demonstration of different load balancing strategies"
      className={className}
      height={500}
      concept="load-balancing"
    />
  );
}

export function DatabaseShardingDemo({ className }: { className?: string }) {
  return (
    <SystemDesignVisualizer
      title="Database Sharding"
      description="Understanding horizontal database scaling through sharding"
      className={className}
      height={500}
      concept="database-sharding"
    />
  );
}

export function CAPTheoremDemo({ className }: { className?: string }) {
  return (
    <SystemDesignVisualizer
      title="CAP Theorem"
      description="Explore the trade-offs between Consistency, Availability, and Partition tolerance"
      className={className}
      height={500}
      concept="cap-theorem"
    />
  );
}

export function ScalingPatternsDemo({ className }: { className?: string }) {
  return (
    <SystemDesignVisualizer
      title="Scaling Patterns"
      description="Compare horizontal, vertical, and elastic scaling approaches"
      className={className}
      height={600}
      concept="scaling-patterns"
    />
  );
}
