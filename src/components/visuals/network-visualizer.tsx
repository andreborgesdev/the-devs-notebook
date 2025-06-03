"use client";

import React, { useState, useEffect } from "react";
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
import { Progress } from "@/src/components/ui/progress";
import { Separator } from "@/src/components/ui/separator";
import {
  Play,
  Pause,
  RotateCcw,
  Network,
  Globe,
  Shield,
  Router,
  Database,
} from "lucide-react";

interface NetworkPacket {
  id: string;
  source: string;
  destination: string;
  protocol: string;
  data: string;
  currentLayer: number;
  status: "pending" | "processing" | "completed";
}

interface OSILayer {
  number: number;
  name: string;
  description: string;
  protocols: string[];
  color: string;
}

const osiLayers: OSILayer[] = [
  {
    number: 7,
    name: "Application",
    description: "User interface, network services",
    protocols: ["HTTP", "HTTPS", "FTP", "SMTP"],
    color: "bg-red-500",
  },
  {
    number: 6,
    name: "Presentation",
    description: "Data encryption, compression",
    protocols: ["SSL/TLS", "JPEG", "ASCII"],
    color: "bg-orange-500",
  },
  {
    number: 5,
    name: "Session",
    description: "Session management",
    protocols: ["NetBIOS", "RPC", "SQL"],
    color: "bg-yellow-500",
  },
  {
    number: 4,
    name: "Transport",
    description: "End-to-end communication",
    protocols: ["TCP", "UDP"],
    color: "bg-green-500",
  },
  {
    number: 3,
    name: "Network",
    description: "Routing, IP addressing",
    protocols: ["IP", "ICMP", "OSPF"],
    color: "bg-blue-500",
  },
  {
    number: 2,
    name: "Data Link",
    description: "Frame formatting, error detection",
    protocols: ["Ethernet", "WiFi", "PPP"],
    color: "bg-indigo-500",
  },
  {
    number: 1,
    name: "Physical",
    description: "Physical transmission",
    protocols: ["Cables", "Radio", "Fiber"],
    color: "bg-purple-500",
  },
];

const NetworkVisualizer: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="w-5 h-5" />
          Network Concepts Visualizer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="osi" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="osi">OSI Model</TabsTrigger>
            <TabsTrigger value="tcp">TCP/UDP</TabsTrigger>
            <TabsTrigger value="routing">Routing</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="protocols">Protocols</TabsTrigger>
          </TabsList>

          <TabsContent value="osi">
            <OSIModelDemo />
          </TabsContent>

          <TabsContent value="tcp">
            <TCPUDPDemo />
          </TabsContent>

          <TabsContent value="routing">
            <RoutingDemo />
          </TabsContent>

          <TabsContent value="security">
            <NetworkSecurityDemo />
          </TabsContent>

          <TabsContent value="protocols">
            <ProtocolsDemo />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const OSIModelDemo: React.FC = () => {
  const [activePacket, setActivePacket] = useState<NetworkPacket | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentLayer, setCurrentLayer] = useState(7);

  const startPacketAnimation = () => {
    const packet: NetworkPacket = {
      id: "packet-1",
      source: "Client",
      destination: "Server",
      protocol: "HTTP",
      data: "GET /api/users",
      currentLayer: 7,
      status: "pending",
    };

    setActivePacket(packet);
    setIsAnimating(true);
    setCurrentLayer(7);

    const animateLayer = (layer: number) => {
      setTimeout(() => {
        setCurrentLayer(layer);
        if (layer > 1) {
          animateLayer(layer - 1);
        } else {
          setTimeout(() => {
            animateLayer(2);
          }, 1000);
        }
      }, 1500);
    };

    animateLayer(6);
  };

  const resetAnimation = () => {
    setActivePacket(null);
    setIsAnimating(false);
    setCurrentLayer(7);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Button onClick={startPacketAnimation} disabled={isAnimating}>
          <Play className="w-4 h-4 mr-2" />
          Send Packet
        </Button>
        <Button onClick={resetAnimation} variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">OSI Model Layers</h3>
          {osiLayers.map((layer) => (
            <div
              key={layer.number}
              className={`p-4 rounded-lg border transition-all ${
                currentLayer === layer.number
                  ? `${layer.color} text-white shadow-lg scale-105`
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold">
                  Layer {layer.number}: {layer.name}
                </h4>
                {currentLayer === layer.number && (
                  <Badge variant="secondary">Active</Badge>
                )}
              </div>
              <p className="text-sm opacity-90">{layer.description}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {layer.protocols.map((protocol) => (
                  <Badge key={protocol} variant="outline" className="text-xs">
                    {protocol}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Packet Journey</h3>
          {activePacket && (
            <Card className="p-4">
              <h4 className="font-semibold mb-2">Current Packet</h4>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>ID:</strong> {activePacket.id}
                </p>
                <p>
                  <strong>Source:</strong> {activePacket.source}
                </p>
                <p>
                  <strong>Destination:</strong> {activePacket.destination}
                </p>
                <p>
                  <strong>Protocol:</strong> {activePacket.protocol}
                </p>
                <p>
                  <strong>Data:</strong> {activePacket.data}
                </p>
                <p>
                  <strong>Current Layer:</strong> {currentLayer}
                </p>
              </div>
            </Card>
          )}

          <Card className="p-4">
            <h4 className="font-semibold mb-2">Layer Functions</h4>
            {currentLayer <= 7 && (
              <div className="text-sm">
                <p>
                  <strong>
                    {osiLayers.find((l) => l.number === currentLayer)?.name}{" "}
                    Layer:
                  </strong>
                </p>
                <p>
                  {
                    osiLayers.find((l) => l.number === currentLayer)
                      ?.description
                  }
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

const TCPUDPDemo: React.FC = () => {
  const [selectedProtocol, setSelectedProtocol] = useState<"tcp" | "udp">(
    "tcp"
  );
  const [connectionState, setConnectionState] = useState<
    "idle" | "connecting" | "connected" | "transmitting" | "closing"
  >("idle");
  const [messages, setMessages] = useState<string[]>([]);

  const tcpHandshake = () => {
    setConnectionState("connecting");
    setMessages(["Client: SYN"]);

    setTimeout(() => {
      setMessages((prev) => [...prev, "Server: SYN-ACK"]);
    }, 1000);

    setTimeout(() => {
      setMessages((prev) => [...prev, "Client: ACK"]);
      setConnectionState("connected");
    }, 2000);
  };

  const sendData = () => {
    if (connectionState === "connected") {
      setConnectionState("transmitting");
      setMessages((prev) => [...prev, "Data: Hello Server!"]);

      setTimeout(() => {
        setMessages((prev) => [...prev, "Server: ACK (Data received)"]);
        setConnectionState("connected");
      }, 1000);
    }
  };

  const udpSend = () => {
    setMessages(["UDP: Sending datagram (no handshake)"]);
    setTimeout(() => {
      setMessages((prev) => [...prev, "UDP: Data sent (no acknowledgment)"]);
    }, 500);
  };

  const closeConnection = () => {
    setConnectionState("closing");
    setMessages((prev) => [...prev, "Client: FIN"]);

    setTimeout(() => {
      setMessages((prev) => [...prev, "Server: ACK"]);
    }, 1000);

    setTimeout(() => {
      setMessages((prev) => [...prev, "Server: FIN"]);
    }, 1500);

    setTimeout(() => {
      setMessages((prev) => [...prev, "Client: ACK"]);
      setConnectionState("idle");
    }, 2000);
  };

  const reset = () => {
    setConnectionState("idle");
    setMessages([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Button
          onClick={() => setSelectedProtocol("tcp")}
          variant={selectedProtocol === "tcp" ? "default" : "outline"}
        >
          TCP
        </Button>
        <Button
          onClick={() => setSelectedProtocol("udp")}
          variant={selectedProtocol === "udp" ? "default" : "outline"}
        >
          UDP
        </Button>
        <Button onClick={reset} variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Protocol Comparison</h3>
          <div className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold text-green-600">
                TCP (Transmission Control Protocol)
              </h4>
              <ul className="text-sm mt-2 space-y-1">
                <li>• Connection-oriented</li>
                <li>• Reliable delivery</li>
                <li>• Error checking & correction</li>
                <li>• Flow control</li>
                <li>• Slower but guaranteed</li>
              </ul>
            </Card>
            <Card className="p-4">
              <h4 className="font-semibold text-blue-600">
                UDP (User Datagram Protocol)
              </h4>
              <ul className="text-sm mt-2 space-y-1">
                <li>• Connectionless</li>
                <li>• No reliability guarantee</li>
                <li>• No error correction</li>
                <li>• No flow control</li>
                <li>• Faster but not guaranteed</li>
              </ul>
            </Card>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">
            {selectedProtocol.toUpperCase()} Simulation
          </h3>

          {selectedProtocol === "tcp" && (
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={tcpHandshake}
                  disabled={connectionState !== "idle"}
                >
                  Connect
                </Button>
                <Button
                  onClick={sendData}
                  disabled={connectionState !== "connected"}
                >
                  Send Data
                </Button>
                <Button
                  onClick={closeConnection}
                  disabled={connectionState === "idle"}
                >
                  Close
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Connection State:</span>
                  <Badge
                    variant={
                      connectionState === "connected" ? "default" : "secondary"
                    }
                  >
                    {connectionState}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {selectedProtocol === "udp" && (
            <div className="space-y-4">
              <Button onClick={udpSend}>Send UDP Datagram</Button>
            </div>
          )}

          <Card className="p-4 mt-4">
            <h4 className="font-semibold mb-2">Message Log</h4>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {messages.map((message, index) => (
                <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                  {message}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const RoutingDemo: React.FC = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<
    "dijkstra" | "bellman-ford" | "rip"
  >("dijkstra");
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nodes = ["A", "B", "C", "D", "E"];
  const edges = [
    { from: "A", to: "B", weight: 4 },
    { from: "A", to: "C", weight: 2 },
    { from: "B", to: "C", weight: 1 },
    { from: "B", to: "D", weight: 5 },
    { from: "C", to: "D", weight: 8 },
    { from: "C", to: "E", weight: 10 },
    { from: "D", to: "E", weight: 2 },
  ];

  const routingAlgorithms = {
    dijkstra: {
      name: "Dijkstra's Algorithm",
      description: "Finds shortest path from source to all other nodes",
      steps: [
        "Initialize distances: A=0, others=∞",
        "Visit A, update neighbors: B=4, C=2",
        "Visit C (smallest), update neighbors: B=3, D=10, E=12",
        "Visit B, update neighbors: D=8",
        "Visit D, update neighbors: E=10",
        "Visit E, algorithm complete",
      ],
    },
    "bellman-ford": {
      name: "Bellman-Ford Algorithm",
      description: "Detects negative cycles and finds shortest paths",
      steps: [
        "Initialize distances: A=0, others=∞",
        "Iteration 1: Relax all edges",
        "Iteration 2: Relax all edges",
        "Iteration 3: Relax all edges",
        "Check for negative cycles",
        "Algorithm complete",
      ],
    },
    rip: {
      name: "RIP (Routing Information Protocol)",
      description: "Distance vector routing protocol",
      steps: [
        "Initialize routing table",
        "Send distance vectors to neighbors",
        "Receive updates from neighbors",
        "Update routing table using Bellman-Ford",
        "Repeat every 30 seconds",
        "Handle routing loops with split horizon",
      ],
    },
  };

  const startAnimation = () => {
    setIsAnimating(true);
    setCurrentStep(0);

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const maxSteps = routingAlgorithms[selectedAlgorithm].steps.length;
        if (prev >= maxSteps - 1) {
          clearInterval(interval);
          setIsAnimating(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);
  };

  const reset = () => {
    setCurrentStep(0);
    setIsAnimating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 flex-wrap">
        {Object.keys(routingAlgorithms).map((algo) => (
          <Button
            key={algo}
            onClick={() => setSelectedAlgorithm(algo as any)}
            variant={selectedAlgorithm === algo ? "default" : "outline"}
          >
            {routingAlgorithms[algo as keyof typeof routingAlgorithms].name}
          </Button>
        ))}
        <Button onClick={startAnimation} disabled={isAnimating}>
          <Play className="w-4 h-4 mr-2" />
          Animate
        </Button>
        <Button onClick={reset} variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Network Topology</h3>
          <Card className="p-6">
            <svg width="300" height="200" viewBox="0 0 300 200">
              {nodes.map((node, index) => {
                const x = 50 + (index % 3) * 100;
                const y = 50 + Math.floor(index / 3) * 100;
                return (
                  <g key={node}>
                    <circle
                      cx={x}
                      cy={y}
                      r="20"
                      fill={currentStep > index ? "#3b82f6" : "#e5e7eb"}
                      stroke="#374151"
                      strokeWidth="2"
                    />
                    <text
                      x={x}
                      y={y + 5}
                      textAnchor="middle"
                      className="text-sm font-semibold fill-white"
                    >
                      {node}
                    </text>
                  </g>
                );
              })}

              {edges.map((edge, index) => {
                const fromIndex = nodes.indexOf(edge.from);
                const toIndex = nodes.indexOf(edge.to);
                const x1 = 50 + (fromIndex % 3) * 100;
                const y1 = 50 + Math.floor(fromIndex / 3) * 100;
                const x2 = 50 + (toIndex % 3) * 100;
                const y2 = 50 + Math.floor(toIndex / 3) * 100;

                return (
                  <g key={index}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#6b7280"
                      strokeWidth="2"
                    />
                    <text
                      x={(x1 + x2) / 2}
                      y={(y1 + y2) / 2 - 10}
                      textAnchor="middle"
                      className="text-xs fill-gray-600"
                    >
                      {edge.weight}
                    </text>
                  </g>
                );
              })}
            </svg>
          </Card>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">
            {routingAlgorithms[selectedAlgorithm].name}
          </h3>
          <Card className="p-4 mb-4">
            <p className="text-sm text-gray-600">
              {routingAlgorithms[selectedAlgorithm].description}
            </p>
          </Card>

          <Card className="p-4">
            <h4 className="font-semibold mb-3">Algorithm Steps</h4>
            <div className="space-y-2">
              {routingAlgorithms[selectedAlgorithm].steps.map((step, index) => (
                <div
                  key={index}
                  className={`p-2 rounded text-sm transition-all ${
                    index <= currentStep
                      ? "bg-blue-100 border-blue-200 border"
                      : "bg-gray-50"
                  }`}
                >
                  <span className="font-medium">{index + 1}.</span> {step}
                </div>
              ))}
            </div>

            <div className="mt-4">
              <Progress
                value={
                  (currentStep /
                    (routingAlgorithms[selectedAlgorithm].steps.length - 1)) *
                  100
                }
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const NetworkSecurityDemo: React.FC = () => {
  const [selectedConcept, setSelectedConcept] = useState<
    "encryption" | "firewall" | "vpn" | "ddos"
  >("encryption");
  const [simulationState, setSimulationState] = useState<
    "idle" | "running" | "complete"
  >("idle");

  const securityConcepts = {
    encryption: {
      title: "Encryption & TLS",
      description: "Secure data transmission using cryptographic protocols",
      steps: [
        "Client initiates TLS handshake",
        "Server sends certificate",
        "Client verifies certificate",
        "Key exchange (DH/RSA)",
        "Symmetric encryption established",
        "Secure data transmission",
      ],
    },
    firewall: {
      title: "Firewall Protection",
      description: "Network traffic filtering and access control",
      steps: [
        "Packet arrives at firewall",
        "Check source IP address",
        "Check destination port",
        "Apply security rules",
        "Log decision",
        "Allow or block packet",
      ],
    },
    vpn: {
      title: "VPN Tunnel",
      description: "Secure communication over public networks",
      steps: [
        "User authentication",
        "Tunnel establishment",
        "Encrypt outbound traffic",
        "Route through VPN server",
        "Decrypt at destination",
        "Return traffic encrypted",
      ],
    },
    ddos: {
      title: "DDoS Protection",
      description: "Mitigation of distributed denial of service attacks",
      steps: [
        "Detect unusual traffic patterns",
        "Rate limiting implementation",
        "Traffic analysis",
        "Block malicious IPs",
        "Load balancing",
        "Service restoration",
      ],
    },
  };

  const runSimulation = () => {
    setSimulationState("running");
    setTimeout(() => {
      setSimulationState("complete");
    }, 3000);
  };

  const reset = () => {
    setSimulationState("idle");
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 flex-wrap">
        {Object.keys(securityConcepts).map((concept) => (
          <Button
            key={concept}
            onClick={() => setSelectedConcept(concept as any)}
            variant={selectedConcept === concept ? "default" : "outline"}
          >
            <Shield className="w-4 h-4 mr-2" />
            {securityConcepts[concept as keyof typeof securityConcepts].title}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Security Visualization</h3>
          <Card className="p-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Globe className="w-8 h-8 text-blue-600" />
                </div>

                <div className="flex-1 px-4">
                  {simulationState === "running" && (
                    <div className="animate-pulse">
                      <div className="h-2 bg-gradient-to-r from-blue-500 to-green-500 rounded"></div>
                    </div>
                  )}
                  {simulationState === "complete" && (
                    <div className="h-2 bg-green-500 rounded"></div>
                  )}
                  {simulationState === "idle" && (
                    <div className="h-2 bg-gray-200 rounded"></div>
                  )}
                </div>

                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Database className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="text-sm text-gray-600">
                {selectedConcept === "encryption" &&
                  "Client ↔ Encrypted Channel ↔ Server"}
                {selectedConcept === "firewall" &&
                  "Internet ↔ Firewall ↔ Internal Network"}
                {selectedConcept === "vpn" &&
                  "Client ↔ VPN Tunnel ↔ Remote Network"}
                {selectedConcept === "ddos" &&
                  "Multiple Sources ↔ DDoS Protection ↔ Server"}
              </div>
            </div>
          </Card>

          <div className="mt-4 flex gap-2">
            <Button
              onClick={runSimulation}
              disabled={simulationState === "running"}
            >
              <Play className="w-4 h-4 mr-2" />
              Simulate
            </Button>
            <Button onClick={reset} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">
            {securityConcepts[selectedConcept].title}
          </h3>

          <Card className="p-4 mb-4">
            <p className="text-sm text-gray-600">
              {securityConcepts[selectedConcept].description}
            </p>
          </Card>

          <Card className="p-4">
            <h4 className="font-semibold mb-3">Process Steps</h4>
            <div className="space-y-2">
              {securityConcepts[selectedConcept].steps.map((step, index) => (
                <div
                  key={index}
                  className={`p-3 rounded border text-sm transition-all ${
                    simulationState === "complete"
                      ? "bg-green-50 border-green-200"
                      : simulationState === "running"
                      ? "bg-blue-50 border-blue-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        simulationState === "complete"
                          ? "bg-green-500 text-white"
                          : simulationState === "running"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span>{step}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const ProtocolsDemo: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<
    "http" | "dns" | "smtp" | "ftp"
  >("http");

  const protocolsData = {
    http: {
      name: "HTTP/HTTPS",
      description: "HyperText Transfer Protocol for web communication",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      statusCodes: [
        { code: 200, meaning: "OK", description: "Request successful" },
        { code: 404, meaning: "Not Found", description: "Resource not found" },
        {
          code: 500,
          meaning: "Internal Server Error",
          description: "Server error",
        },
      ],
      headers: ["Content-Type", "Authorization", "Cache-Control", "User-Agent"],
    },
    dns: {
      name: "DNS",
      description:
        "Domain Name System for resolving domain names to IP addresses",
      recordTypes: ["A", "AAAA", "CNAME", "MX", "TXT"],
      process: [
        "User enters domain name",
        "Check local DNS cache",
        "Query recursive DNS server",
        "Query root name servers",
        "Query TLD name servers",
        "Query authoritative servers",
        "Return IP address",
      ],
    },
    smtp: {
      name: "SMTP",
      description: "Simple Mail Transfer Protocol for email transmission",
      commands: ["HELO", "MAIL FROM", "RCPT TO", "DATA", "QUIT"],
      stages: [
        "Connection establishment",
        "Client greeting (HELO)",
        "Sender identification",
        "Recipient specification",
        "Message transmission",
        "Connection termination",
      ],
    },
    ftp: {
      name: "FTP",
      description: "File Transfer Protocol for file sharing",
      modes: ["Active", "Passive"],
      commands: ["USER", "PASS", "LIST", "RETR", "STOR", "QUIT"],
      features: [
        "Two-channel communication",
        "ASCII/Binary modes",
        "Directory navigation",
      ],
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 flex-wrap">
        {Object.keys(protocolsData).map((protocol) => (
          <Button
            key={protocol}
            onClick={() => setSelectedCategory(protocol as any)}
            variant={selectedCategory === protocol ? "default" : "outline"}
          >
            {protocolsData[protocol as keyof typeof protocolsData].name}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Protocol Details</h3>
          <Card className="p-4">
            <h4 className="font-semibold text-lg mb-2">
              {protocolsData[selectedCategory].name}
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              {protocolsData[selectedCategory].description}
            </p>

            {selectedCategory === "http" && (
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium mb-2">HTTP Methods</h5>
                  <div className="flex flex-wrap gap-2">
                    {protocolsData.http.methods.map((method) => (
                      <Badge key={method} variant="outline">
                        {method}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Common Headers</h5>
                  <div className="flex flex-wrap gap-2">
                    {protocolsData.http.headers.map((header) => (
                      <Badge key={header} variant="secondary">
                        {header}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedCategory === "dns" && (
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium mb-2">Record Types</h5>
                  <div className="flex flex-wrap gap-2">
                    {protocolsData.dns.recordTypes.map((type) => (
                      <Badge key={type} variant="outline">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedCategory === "smtp" && (
              <div>
                <h5 className="font-medium mb-2">SMTP Commands</h5>
                <div className="flex flex-wrap gap-2">
                  {protocolsData.smtp.commands.map((command) => (
                    <Badge key={command} variant="outline">
                      {command}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {selectedCategory === "ftp" && (
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium mb-2">Connection Modes</h5>
                  <div className="flex gap-2">
                    {protocolsData.ftp.modes.map((mode) => (
                      <Badge key={mode} variant="outline">
                        {mode}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Features</h5>
                  <ul className="text-sm space-y-1">
                    {protocolsData.ftp.features.map((feature) => (
                      <li key={feature}>• {feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </Card>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">
            {selectedCategory === "http"
              ? "Status Codes"
              : selectedCategory === "dns"
              ? "Resolution Process"
              : selectedCategory === "smtp"
              ? "Email Flow"
              : "FTP Commands"}
          </h3>

          {selectedCategory === "http" && (
            <div className="space-y-2">
              {protocolsData.http.statusCodes.map((status) => (
                <Card key={status.code} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-semibold">
                        {status.code} {status.meaning}
                      </h5>
                      <p className="text-sm text-gray-600">
                        {status.description}
                      </p>
                    </div>
                    <Badge
                      variant={
                        status.code < 300
                          ? "default"
                          : status.code < 400
                          ? "secondary"
                          : status.code < 500
                          ? "destructive"
                          : "destructive"
                      }
                    >
                      {Math.floor(status.code / 100)}xx
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {selectedCategory === "dns" && (
            <div className="space-y-2">
              {protocolsData.dns.process.map((step, index) => (
                <Card key={index} className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <span className="text-sm">{step}</span>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {selectedCategory === "smtp" && (
            <div className="space-y-2">
              {protocolsData.smtp.stages.map((stage, index) => (
                <Card key={index} className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <span className="text-sm">{stage}</span>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {selectedCategory === "ftp" && (
            <div className="space-y-2">
              {protocolsData.ftp.commands.map((command) => (
                <Card key={command} className="p-3">
                  <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                    {command}
                  </code>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkVisualizer;

export {
  OSIModelDemo,
  TCPUDPDemo,
  RoutingDemo,
  NetworkSecurityDemo,
  ProtocolsDemo,
};
