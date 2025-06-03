"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { MermaidDiagram } from "@/src/components/visuals/mermaid-diagram";

export default function ComputerScienceVisualizersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Computer Science Interactive Visualizers
        </h1>
        <p className="text-lg text-muted-foreground">
          Explore fundamental computer science concepts through interactive
          visualizations.
        </p>
      </div>

      <Tabs defaultValue="complexity" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="complexity">Complexity</TabsTrigger>
          <TabsTrigger value="automata">Automata</TabsTrigger>
          <TabsTrigger value="memory">Memory</TabsTrigger>
          <TabsTrigger value="networking">Networking</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="theory">Theory</TabsTrigger>
        </TabsList>

        <TabsContent value="complexity" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Big O Notation Visualizer
                  <Badge variant="secondary">Interactive</Badge>
                </CardTitle>
                <CardDescription>
                  Compare time complexities and their growth patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  chart={`graph LR
                    subgraph "Time Complexity Growth"
                      O1[O(1)<br/>Constant]
                      OlogN[O(log n)<br/>Logarithmic]
                      ON[O(n)<br/>Linear]
                      ONlogN[O(n log n)<br/>Linearithmic]
                      ON2[O(n²)<br/>Quadratic]
                      ON3[O(n³)<br/>Cubic]
                      O2N[O(2^n)<br/>Exponential]
                    end
                    
                    O1 -.-> Best[Best Performance]
                    O2N -.-> Worst[Worst Performance]
                    
                    style O1 fill:#c8e6c9
                    style OlogN fill:#dcedc8
                    style ON fill:#fff9c4
                    style ONlogN fill:#ffecb3
                    style ON2 fill:#ffcdd2
                    style O2N fill:#ffcdd2`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Algorithm Complexity Comparison
                  <Badge variant="secondary">Analysis</Badge>
                </CardTitle>
                <CardDescription>
                  Compare common algorithms and their complexities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  chart={`graph TB
                    subgraph "Sorting Algorithms"
                      Bubble[Bubble Sort<br/>O(n²)]
                      Selection[Selection Sort<br/>O(n²)]
                      Insertion[Insertion Sort<br/>O(n²)]
                      Merge[Merge Sort<br/>O(n log n)]
                      Quick[Quick Sort<br/>O(n log n) avg<br/>O(n²) worst]
                      Heap[Heap Sort<br/>O(n log n)]
                    end
                    
                    subgraph "Search Algorithms"
                      Linear[Linear Search<br/>O(n)]
                      Binary[Binary Search<br/>O(log n)]
                      Hash[Hash Table<br/>O(1) avg]
                    end
                    
                    style Merge fill:#c8e6c9
                    style Quick fill:#c8e6c9
                    style Binary fill:#c8e6c9
                    style Hash fill:#a5d6a7`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Space-Time Tradeoffs
                  <Badge variant="secondary">Optimization</Badge>
                </CardTitle>
                <CardDescription>
                  Understanding memory vs computation trade-offs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  chart={`graph LR
                    Problem[Algorithm Problem]
                    Problem -.-> TimeOpt[Time Optimization<br/>Use more memory]
                    Problem -.-> SpaceOpt[Space Optimization<br/>Use more computation]
                    
                    TimeOpt -.-> Ex1[Example: Memoization<br/>Store computed results<br/>O(n) time, O(n) space]
                    SpaceOpt -.-> Ex2[Example: Recursive<br/>Recompute results<br/>O(2^n) time, O(1) space]
                    
                    style TimeOpt fill:#c8e6c9
                    style SpaceOpt fill:#fff9c4
                    style Ex1 fill:#e8f5e8
                    style Ex2 fill:#fff3e0`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  P vs NP Problem
                  <Badge variant="secondary">Theory</Badge>
                </CardTitle>
                <CardDescription>
                  The most famous unsolved problem in computer science
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  chart={`graph TB
                    P[P Problems<br/>Polynomial Time<br/>Easy to solve]
                    NP[NP Problems<br/>Nondeterministic Polynomial<br/>Easy to verify]
                    NPComplete[NP-Complete<br/>Hardest NP problems]
                    NPHard[NP-Hard<br/>At least as hard as NP-Complete]
                    
                    P -.-> Examples1[Examples:<br/>Sorting, Searching<br/>Graph traversal]
                    NP -.-> Examples2[Examples:<br/>SAT, TSP verification<br/>Subset sum verification]
                    NPComplete -.-> Examples3[Examples:<br/>SAT, TSP, Knapsack<br/>3-Coloring]
                    
                    P -.-> NP
                    NP -.-> NPComplete
                    NPComplete -.-> NPHard
                    
                    Question[P = NP ?]
                    
                    style P fill:#c8e6c9
                    style NP fill:#fff9c4
                    style NPComplete fill:#ffecb3
                    style Question fill:#e1f5fe`}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="automata" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Finite State Automaton
                  <Badge variant="secondary">Interactive</Badge>
                </CardTitle>
                <CardDescription>
                  Visualize finite state machines and their transitions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  chart={`stateDiagram-v2
                    [*] --> q0
                    q0 --> q1 : a
                    q0 --> q0 : b
                    q1 --> q2 : b
                    q1 --> q0 : a
                    q2 --> q2 : a,b
                    q2 --> [*]
                    
                    note left of q1 : Intermediate state
                    note right of q2 : Accepting state`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Turing Machine Model
                  <Badge variant="secondary">Theoretical</Badge>
                </CardTitle>
                <CardDescription>
                  Components of a Turing machine
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  chart={`graph TB
                    subgraph "Turing Machine Components"
                      Tape[Infinite Tape<br/>...□□a□b□c□□...]
                      Head[Read/Write Head<br/>Points to current cell]
                      State[Finite Control<br/>Current state q_i]
                      Program[Transition Function<br/>δ(state, symbol) → (new_state, new_symbol, direction)]
                    end
                    
                    Tape -.-> Head
                    Head -.-> State
                    State -.-> Program
                    Program -.-> State
                    
                    style Tape fill:#fff9c4
                    style Head fill:#ffecb3
                    style State fill:#c8e6c9
                    style Program fill:#e8f5e8`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Regular Expressions to DFA
                  <Badge variant="secondary">Conversion</Badge>
                </CardTitle>
                <CardDescription>
                  Convert regular expressions to deterministic finite automata
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  chart={`graph TB
                    Regex[Regular Expression: (a|b)*abb]
                    Regex -.-> NFA[Non-deterministic FA]
                    NFA -.-> DFA[Deterministic FA]
                    DFA -.-> Minimized[Minimized DFA]
                    
                    subgraph "DFA States"
                      S0[q0: Start]
                      S1[q1: Seen 'a']
                      S2[q2: Seen 'ab']
                      S3[q3: Accepted 'abb']
                    end
                    
                    S0 -.-> S1
                    S1 -.-> S2
                    S2 -.-> S3
                    
                    style Regex fill:#e1f5fe
                    style DFA fill:#f3e5f5
                    style S3 fill:#c8e6c9`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Context-Free Grammars
                  <Badge variant="secondary">Parsing</Badge>
                </CardTitle>
                <CardDescription>
                  Parse trees and context-free language generation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  chart={`graph TB
                    Grammar[Context-Free Grammar<br/>S → aSb | ε]
                    
                    subgraph "Parse Tree"
                      S1[S] -.-> a1[a]
                      S1 -.-> S2[S]
                      S1 -.-> b1[b]
                      S2 -.-> a2[a]
                      S2 -.-> S3[S]
                      S2 -.-> b2[b]
                      S3 -.-> eps[ε]
                    end
                    
                    Grammar -.-> Result[Generates: aabb<br/>Language: a^n b^n where n ≥ 0]
                    
                    style Grammar fill:#fff3e0
                    style S1 fill:#e8f5e8
                    style S3 fill:#e8f5e8`}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="memory" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Memory Hierarchy
                  <Badge variant="secondary">Architecture</Badge>
                </CardTitle>
                <CardDescription>
                  Speed vs capacity trade-offs in computer memory
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  chart={`graph TB
                    subgraph "Memory Hierarchy"
                      CPU[CPU Registers<br/>~1 cycle<br/>~1KB]
                      L1[L1 Cache<br/>~3 cycles<br/>~32KB]
                      L2[L2 Cache<br/>~10 cycles<br/>~256KB]
                      L3[L3 Cache<br/>~40 cycles<br/>~8MB]
                      RAM[Main Memory<br/>~100 cycles<br/>~16GB]
                      SSD[SSD Storage<br/>~100,000 cycles<br/>~1TB]
                      HDD[HDD Storage<br/>~500,000 cycles<br/>~2TB]
                    end
                    
                    CPU -.-> L1 -.-> L2 -.-> L3 -.-> RAM -.-> SSD -.-> HDD
                    
                    style CPU fill:#c8e6c9
                    style L1 fill:#dcedc8
                    style L2 fill:#fff9c4
                    style L3 fill:#ffecb3
                    style RAM fill:#ffcdd2
                    style SSD fill:#f8bbd9
                    style HDD fill:#ffcdd2`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Virtual Memory Management
                  <Badge variant="secondary">OS Concept</Badge>
                </CardTitle>
                <CardDescription>
                  How operating systems manage memory virtualization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  chart={`graph LR
                    Program[Program<br/>Virtual Address Space]
                    Program -.-> VirtAddr[Virtual Addresses<br/>0x1000, 0x2000, 0x3000]
                    VirtAddr -.-> MMU[Memory Management Unit<br/>Page Table Translation]
                    MMU -.-> PhysAddr[Physical Addresses<br/>0xA000, 0xB000, 0xC000]
                    PhysAddr -.-> RAM[Physical RAM]
                    
                    subgraph "Page Fault Handling"
                      PageFault[Page Not in RAM]
                      PageFault -.-> Disk[Load from Disk]
                      Disk -.-> RAM
                    end
                    
                    style Program fill:#e8f5e8
                    style MMU fill:#fff9c4
                    style PageTable fill:#f3e5f5
                    style RAM fill:#c8e6c9`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Cache Replacement Policies
                  <Badge variant="secondary">Algorithms</Badge>
                </CardTitle>
                <CardDescription>
                  Different strategies for cache management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  chart={`graph TB
                    CacheFull[Cache Full - Need Replacement]
                    CacheFull -.-> Random[Random<br/>Random selection]
                    CacheFull -.-> FIFO[FIFO<br/>First In, First Out]
                    CacheFull -.-> LRU[LRU<br/>Least Recently Used]
                    CacheFull -.-> LFU[LFU<br/>Least Frequently Used]
                    CacheFull -.-> Optimal[Optimal<br/>Replace furthest future use]
                    
                    LRU -.-> Best[Best practical choice<br/>Good locality performance]
                    Optimal -.-> Theoretical[Theoretical optimum<br/>Requires future knowledge]
                    
                    style LRU fill:#c8e6c9
                    style Optimal fill:#e8f5e8
                    style Random fill:#ffecb3
                    style FIFO fill:#fff9c4`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Garbage Collection
                  <Badge variant="secondary">Memory Management</Badge>
                </CardTitle>
                <CardDescription>
                  Automatic memory management strategies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  chart={`graph TB
                    subgraph "Garbage Collection Types"
                      MarkSweep[Mark & Sweep<br/>Mark reachable, sweep unreachable]
                      Copying[Copying GC<br/>Copy live objects to new space]
                      Generational[Generational<br/>Young/Old generation separation]
                      Incremental[Incremental<br/>Small chunks to reduce pauses]
                    end
                    
                    Heap[Memory Heap<br/>Objects and References]
                    Heap -.-> Root[Root Set<br/>Stack, Global variables]
                    Root -.-> Reachable[Reachable Objects]
                    
                    style MarkSweep fill:#fff9c4
                    style Copying fill:#ffecb3
                    style Generational fill:#fff3e0
                    style Heap fill:#e8f5e8`}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="networking" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  OSI Model Layers
                  <Badge variant="secondary">Networking</Badge>
                </CardTitle>
                <CardDescription>
                  The seven layers of network communication
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  chart={`graph TB
                    subgraph "OSI Model"
                      App[7. Application Layer<br/>HTTP, FTP, SMTP, DNS]
                      Pres[6. Presentation Layer<br/>Encryption, Compression, Translation]
                      Sess[5. Session Layer<br/>Session Management, Checkpoints]
                      Trans[4. Transport Layer<br/>TCP, UDP, Port Numbers]
                      Net[3. Network Layer<br/>IP, Routing, Logical Addressing]
                      Data[2. Data Link Layer<br/>Ethernet, WiFi, Frame Processing]
                      Phys[1. Physical Layer<br/>Cables, Radio Waves, Electrical Signals]
                    end
                    
                    App -.-> Pres -.-> Sess -.-> Trans -.-> Net -.-> Data -.-> Phys
                    
                    style App fill:#e8f5e8
                    style Trans fill:#c8e6c9
                    style Net fill:#fff9c4
                    style Phys fill:#fff3e0`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  TCP vs UDP
                  <Badge variant="secondary">Protocols</Badge>
                </CardTitle>
                <CardDescription>
                  Comparison of connection-oriented vs connectionless protocols
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  chart={`graph LR
                    subgraph "TCP - Transmission Control Protocol"
                      TCP[Reliable Delivery<br/>Connection-oriented<br/>Error checking<br/>Flow control]
                      TCPUse[Use cases:<br/>Web browsing (HTTP)<br/>Email (SMTP)<br/>File transfer (FTP)]
                    end
                    
                    subgraph "UDP - User Datagram Protocol"
                      UDP[Fast Delivery<br/>Connectionless<br/>No error checking<br/>No flow control]
                      UDPUse[Use cases:<br/>Live streaming<br/>Gaming<br/>DNS queries]
                    end
                    
                    TCP -.-> TCPUse
                    UDP -.-> UDPUse
                    
                    style TCP fill:#c8e6c9
                    style UDP fill:#fff9c4`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Network Topologies
                  <Badge variant="secondary">Architecture</Badge>
                </CardTitle>
                <CardDescription>
                  Different ways to connect network devices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  chart={`graph TB
                    subgraph "Star Topology"
                      Hub[Hub/Switch] -.-> N1[Node 1]
                      Hub -.-> N2[Node 2]
                      Hub -.-> N3[Node 3]
                      Hub -.-> N4[Node 4]
                    end
                    
                    subgraph "Ring Topology"
                      R1[Node 1] -.-> R2[Node 2]
                      R2 -.-> R3[Node 3]
                      R3 -.-> R4[Node 4]
                      R4 -.-> R1
                    end
                    
                    subgraph "Mesh Topology"
                      M1[Node 1] -.-> M2[Node 2]
                      M1 -.-> M3[Node 3]
                      M2 -.-> M3
                      M2 -.-> M4[Node 4]
                      M3 -.-> M4
                    end
                    
                    style Hub fill:#e1f5fe
                    style R1 fill:#fff9c4
                    style M1 fill:#e8f5e8`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Routing Algorithms
                  <Badge variant="secondary">Pathfinding</Badge>
                </CardTitle>
                <CardDescription>
                  How routers find the best path through networks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  chart={`graph TB
                    subgraph "Routing Types"
                      Static[Static Routing<br/>Manually configured<br/>Simple, predictable]
                      Dynamic[Dynamic Routing<br/>Automatically adapts<br/>Complex, flexible]
                    end
                    
                    Dynamic -.-> RIP[RIP - Distance Vector<br/>Hop count metric<br/>Max 15 hops]
                    Dynamic -.-> OSPF[OSPF - Link State<br/>Bandwidth metric<br/>Faster convergence]
                    Dynamic -.-> BGP[BGP - Path Vector<br/>Internet backbone<br/>Policy-based routing]
                    
                    Example[Example Network:<br/>A ↔ B ↔ C<br/>Route from A to C]
                    Example -.-> Direct[Direct: A → B → C]
                    Example -.-> Alternative[Alternative paths<br/>if link fails]
                    
                    style OSPF fill:#c8e6c9
                    style BGP fill:#e8f5e8
                    style Static fill:#fff9c4`}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Cryptographic Hash Functions
                  <Badge variant="secondary">Cryptography</Badge>
                </CardTitle>
                <CardDescription>
                  One-way functions for data integrity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  chart={`graph LR
                    Input[Input: Any size data<br/>"Hello World"]
                    Input -.-> HashFunc[Hash Function<br/>SHA-256, MD5, etc.]
                    HashFunc -.-> Output[Output: Fixed-size digest<br/>a591a6d40bf420404...]
                    
                    subgraph "Properties"
                      Deterministic[Same input → Same output]
                      OneWay[Hard to reverse]
                      Avalanche[Small change → Big difference]
                      Collision[Hard to find two inputs with same hash]
                    end
                    
                    style HashFunc fill:#c8e6c9
                    style OneWay fill:#fff9c4
                    style Collision fill:#e8f5e8`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Public Key Cryptography
                  <Badge variant="secondary">Encryption</Badge>
                </CardTitle>
                <CardDescription>
                  Asymmetric encryption and digital signatures
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  chart={`graph TB
                    subgraph "Key Generation"
                      KeyGen[Generate Key Pair]
                      KeyGen -.-> PubKey[Public Key<br/>Share with everyone]
                      KeyGen -.-> PrivKey[Private Key<br/>Keep secret]
                    end
                    
                    subgraph "Encryption"
                      Message[Plain Text] -.-> PubKey
                      PubKey -.-> Encrypted[Encrypted Message]
                      Encrypted -.-> PrivKey
                      PrivKey -.-> Decrypted[Decrypted Text]
                    end
                    
                    subgraph "Digital Signatures"
                      Doc[Document] -.-> PrivKey
                      PrivKey -.-> Signature[Digital Signature]
                      Signature -.-> PubKey
                      PubKey -.-> Verified[Signature Verified]
                    end
                    
                    style PubKey fill:#e8f5e8
                    style PrivKey fill:#ffcdd2
                    style Verified fill:#c8e6c9`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Common Security Threats
                  <Badge variant="secondary">Vulnerabilities</Badge>
                </CardTitle>
                <CardDescription>
                  Major cybersecurity threats and countermeasures
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  chart={`graph TB
                    subgraph "Network Attacks"
                      MITM[Man-in-the-Middle<br/>Intercept communications]
                      DDoS[DDoS<br/>Overwhelm with traffic]
                      Packet[Packet Sniffing<br/>Capture network data]
                    end
                    
                    subgraph "Application Attacks"
                      Injection[SQL Injection<br/>Malicious database queries]
                      XSS[Cross-Site Scripting<br/>Inject malicious scripts]
                      CSRF[Cross-Site Request Forgery<br/>Unauthorized actions]
                    end
                    
                    subgraph "Countermeasures"
                      MITM -.-> TLS[TLS/SSL Encryption]
                      DDoS -.-> Firewall[Firewalls & Rate Limiting]
                      Injection -.-> Validation[Input Validation]
                      XSS -.-> Sanitization[Output Sanitization]
                    end
                    
                    style TLS fill:#c8e6c9
                    style Validation fill:#c8e6c9
                    style Sanitization fill:#c8e6c9
                    style MITM fill:#ffcdd2
                    style Injection fill:#ffcdd2`}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="theory" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Theory of Computation
                  <Badge variant="secondary">Theoretical</Badge>
                </CardTitle>
                <CardDescription>
                  Fundamental models of computation and their capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  chart={`graph TB
                    Computation[Models of Computation]
                    Computation -.-> RAM[Random Access Machine<br/>Models real computers<br/>Unit-cost memory access]
                    Computation -.-> TM[Turing Machine<br/>Theoretical foundation<br/>Infinite tape model]
                    
                    TM -.-> Universal[Universal Turing Machine<br/>Can simulate any TM<br/>Stored program concept]
                    TM -.-> Church[Church-Turing Thesis<br/>TM captures all effective computation]
                    
                    Church -.-> Implications[Implications:<br/>Some problems are unsolvable<br/>Limits of computation]
                    
                    style TM fill:#c8e6c9
                    style Universal fill:#e8f5e8
                    style Church fill:#fff3e0`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Computational Complexity Classes
                  <Badge variant="secondary">Complexity</Badge>
                </CardTitle>
                <CardDescription>
                  Classification of computational problems by difficulty
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  chart={`graph TB
                    Problems[All Problems]
                    Problems -.-> Undecidable[Undecidable Problems<br/>No algorithm can solve]
                    Problems -.-> Decidable[Decidable Problems<br/>Algorithm exists]
                    
                    Decidable -.-> ExpTime[Exponential Time<br/>Harder problems]
                    Decidable -.-> PolyTime[Polynomial Time<br/>Tractable problems]
                    
                    Undecidable -.-> Halting[Halting Problem<br/>Cannot determine if program halts]
                    Undecidable -.-> Equivalence[Program Equivalence<br/>Cannot determine if programs equivalent]
                    
                    PolyTime -.-> Examples1[Examples:<br/>Sorting, Searching<br/>Shortest Path]
                    ExpTime -.-> Examples2[Examples:<br/>Traveling Salesman<br/>Boolean Satisfiability]
                    
                    style PolyTime fill:#c8e6c9
                    style ExpTime fill:#fff9c4
                    style Halting fill:#ffcdd2
                    style Decidable fill:#e8f5e8`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Information Theory
                  <Badge variant="secondary">Mathematics</Badge>
                </CardTitle>
                <CardDescription>
                  Quantifying and transmitting information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  chart={`graph TB
                    Info[Information Theory]
                    Info -.-> Entropy[Entropy<br/>Measure of information content<br/>H(X) = -Σ p(x) log p(x)]
                    Info -.-> Channel[Channel Capacity<br/>Maximum information rate<br/>Shannon's Theorem]
                    
                    Entropy -.-> LowEnt[Low Entropy<br/>Predictable data<br/>Easy to compress]
                    Entropy -.-> HighEnt[High Entropy<br/>Random data<br/>Hard to compress]
                    
                    Channel -.-> Coding[Error Correction<br/>Detect and fix errors<br/>Hamming codes, Reed-Solomon]
                    
                    Info -.-> Compression[Data Compression]
                    Compression -.-> Lossless[Lossless<br/>ZIP, LZ77, Huffman]
                    Compression -.-> Lossy[Lossy<br/>JPEG, MP3, MPEG]
                    
                    style Entropy fill:#c8e6c9
                    style Channel fill:#e8f5e8
                    style Lossless fill:#fff9c4
                    style HighEnt fill:#ffecb3`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Graph Theory Applications
                  <Badge variant="secondary">Applications</Badge>
                </CardTitle>
                <CardDescription>
                  How graph theory applies across computer science
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  chart={`graph TB
                    GraphTheory[Graph Theory in CS]
                    GraphTheory -.-> Networks[Computer Networks<br/>Routing algorithms<br/>Network topology design]
                    GraphTheory -.-> Algorithms[Graph Algorithms<br/>Shortest path, MST<br/>Flow networks]
                    GraphTheory -.-> DB[Database Design<br/>Relationship modeling<br/>Query optimization]
                    GraphTheory -.-> AI[Artificial Intelligence<br/>State space search<br/>Knowledge representation]
                    GraphTheory -.-> Compilers[Compiler Design<br/>Control flow graphs<br/>Register allocation]
                    
                    Networks -.-> Examples1[Examples:<br/>Router connectivity<br/>Friend relationships]
                    Algorithms -.-> Examples2[Examples:<br/>Dijkstra's algorithm<br/>Kruskal's algorithm]
                    AI -.-> Examples3[Examples:<br/>Game trees<br/>Neural networks]
                    Compilers -.-> Examples4[Examples:<br/>Dead code elimination<br/>Register allocation]
                    
                    style GraphTheory fill:#c8e6c9
                    style Networks fill:#e8f5e8
                    style AI fill:#fff3e0
                    style Algorithms fill:#fff9c4`}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
