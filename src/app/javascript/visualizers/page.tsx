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
import { ReactLifecycleDemo } from "@/src/components/visuals/concept-visualizer";
import { MermaidDiagram } from "@/src/components/visuals/mermaid-diagram";

export default function JavaScriptVisualizersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">
          JavaScript Interactive Visualizers
        </h1>
        <p className="text-lg text-muted-foreground">
          Explore JavaScript concepts through interactive visualizations and
          practical examples.
        </p>
      </div>

      <Tabs defaultValue="fundamentals" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="fundamentals">Fundamentals</TabsTrigger>
          <TabsTrigger value="async">Async</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="fundamentals" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Execution Context
                  <Badge variant="secondary">Engine</Badge>
                </CardTitle>
                <CardDescription>
                  Understanding JavaScript execution context and call stack
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded">
                    <h4 className="font-semibold mb-2">
                      Global Execution Context
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Global Object (window/global)</li>
                      <li>• this binding</li>
                      <li>• Outer Environment: null</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-blue-50 rounded">
                    <h4 className="font-semibold mb-2">
                      Function Execution Context
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Arguments object</li>
                      <li>• Local variables</li>
                      <li>• this binding</li>
                      <li>• Outer Environment reference</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Call Stack Visualization
                  <Badge variant="secondary">Runtime</Badge>
                </CardTitle>
                <CardDescription>
                  How function calls are managed in memory
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  chart={`graph TB
                    subgraph "Call Stack"
                      Stack3[Function 2 Context]
                      Stack2[Function 1 Context]
                      Stack1[Global Context]
                    end
                    
                    subgraph "Execution Flow"
                      Call1[function1() called] -.-> Stack2
                      Call2[function2() called] -.-> Stack3
                      Return1[function2() returns] -.-> Pop2[Pop from stack]
                      Return2[function1() returns] -.-> Pop1[Pop from stack]
                    end
                    
                    Stack3 -.-> Stack2 -.-> Stack1
                    
                    style Stack1 fill:#e8f5e8
                    style Stack2 fill:#fff9c4
                    style Stack3 fill:#ffecb3`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Hoisting Visualization
                  <Badge variant="secondary">Behavior</Badge>
                </CardTitle>
                <CardDescription>
                  Understand variable and function hoisting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  chart={`graph TB
                    subgraph "Code Written"
                      Code[console.log(x); // undefined<br/>var x = 5;<br/>console.log(x); // 5<br/><br/>sayHello(); // "Hello!"<br/>function sayHello() {<br/>  console.log("Hello!");<br/>}]
                    end
                    
                    subgraph "How JavaScript Interprets"
                      Interpreted[var x; // hoisted, undefined<br/>function sayHello() { // hoisted<br/>  console.log("Hello!");<br/>}<br/><br/>console.log(x); // undefined<br/>x = 5;<br/>console.log(x); // 5<br/>sayHello(); // "Hello!"]
                    end
                    
                    subgraph "Hoisting Rules"
                      Rules[• var declarations hoisted (undefined)<br/>• function declarations fully hoisted<br/>• let/const hoisted but not initialized<br/>• function expressions not hoisted]
                    end
                    
                    Code -.-> Interpreted
                    Interpreted -.-> Rules
                    
                    style Code fill:#fff9c4
                    style Interpreted fill:#c8e6c9
                    style Rules fill:#e1f5fe`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Scope Chain
                  <Badge variant="secondary">Lexical</Badge>
                </CardTitle>
                <CardDescription>
                  How JavaScript resolves variable access
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  chart={`graph LR
                    subgraph "Nested Functions"
                      Global[Global Scope<br/>var a = 1;]
                      Outer[Outer Function<br/>var b = 2;]
                      Inner[Inner Function<br/>var c = 3;<br/>console.log(a,b,c);]
                    end
                    
                    subgraph "Scope Chain Resolution"
                      LookupC[Look for 'c'] -.-> InnerScope[Inner Scope: Found c=3]
                      LookupB[Look for 'b'] -.-> OuterScope[Outer Scope: Found b=2]
                      LookupA[Look for 'a'] -.-> GlobalScope[Global Scope: Found a=1]
                    end
                    
                    Inner -.-> Outer -.-> Global
                    
                    style InnerScope fill:#c8e6c9
                    style OuterScope fill:#fff9c4
                    style GlobalScope fill:#ffecb3`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Closures
                  <Badge variant="secondary">Advanced</Badge>
                </CardTitle>
                <CardDescription>
                  Functions that remember their lexical environment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  chart={`graph TB
                    subgraph "Closure Example"
                      OuterFunc[function outer(x) {<br/>  return function inner(y) {<br/>    return x + y;<br/>  };<br/>}]
                      
                      Call[const addFive = outer(5);]
                      Result[addFive(3); // returns 8]
                    end
                    
                    subgraph "Memory Model"
                      InnerFunc[Inner Function]
                      LexEnv[Lexical Environment<br/>x: 5 (from outer)]
                      Closure[Closure: Inner + LexEnv]
                    end
                    
                    Call -.-> Closure
                    Closure -.-> Result
                    
                    style Closure fill:#c8e6c9
                    style LexEnv fill:#e8f5e8
                    style Result fill:#fff9c4`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Prototype Chain
                  <Badge variant="secondary">Inheritance</Badge>
                </CardTitle>
                <CardDescription>
                  How JavaScript objects inherit properties
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  chart={`graph TB
                    subgraph "Prototype Chain"
                      Obj[myObject<br/>{name: "John"}]
                      Proto1[myObject.__proto__<br/>(Constructor.prototype)]
                      Proto2[Constructor.prototype.__proto__<br/>(Object.prototype)]
                      Proto3[Object.prototype.__proto__<br/>null]
                    end
                    
                    subgraph "Property Lookup"
                      Lookup[myObject.toString()]
                      Step1[1. Check myObject] -.-> NotFound1[Not found]
                      Step2[2. Check Constructor.prototype] -.-> NotFound2[Not found]
                      Step3[3. Check Object.prototype] -.-> Found[Found toString!]
                    end
                    
                    Obj -.-> Proto1 -.-> Proto2 -.-> Proto3
                    
                    style Found fill:#c8e6c9
                    style Proto2 fill:#e8f5e8
                    style Obj fill:#fff9c4`}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="async" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Event Loop
                  <Badge variant="secondary">Concurrency</Badge>
                </CardTitle>
                <CardDescription>
                  How JavaScript handles asynchronous operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  chart={`graph LR
                    subgraph "JavaScript Runtime"
                      CallStack[Call Stack]
                      WebAPIs[Web APIs<br/>setTimeout<br/>DOM events<br/>HTTP requests]
                      CallbackQueue[Callback Queue]
                      EventLoop[Event Loop]
                    end
                    
                    CallStack -.-> WebAPIs
                    WebAPIs -.-> CallbackQueue
                    CallbackQueue -.-> EventLoop
                    EventLoop -.-> CallStack
                    
                    style CallStack fill:#c8e6c9
                    style WebAPIs fill:#fff9c4
                    style EventLoop fill:#ffecb3`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Promise States
                  <Badge variant="secondary">Async</Badge>
                </CardTitle>
                <CardDescription>
                  Understanding Promise lifecycle and state transitions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  chart={`stateDiagram-v2
                    [*] --> Pending: new Promise()
                    Pending --> Fulfilled: resolve(value)
                    Pending --> Rejected: reject(reason)
                    Fulfilled --> [*]: .then()
                    Rejected --> [*]: .catch()
                    
                    note right of Pending : Asynchronous operation in progress
                    note right of Fulfilled : Operation completed successfully
                    note right of Rejected : Operation failed with error`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Async/Await Flow
                  <Badge variant="secondary">ES2017</Badge>
                </CardTitle>
                <CardDescription>
                  How async/await syntax works under the hood
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  chart={`graph TB
                    subgraph "Async Function"
                      AsyncFunc[async function fetchData() {<br/>  const response = await fetch('/api');<br/>  const data = await response.json();<br/>  return data;<br/>}]
                    end
                    
                    subgraph "Execution Flow"
                      Start[Function called]
                      Await1[await fetch('/api')]
                      Suspend1[Function suspended]
                      Resume1[Promise resolves, function resumes]
                      Await2[await response.json()]
                      Suspend2[Function suspended again]
                      Resume2[Promise resolves, function resumes]
                      Return[Return final data]
                    end
                    
                    Start -.-> Await1 -.-> Suspend1 -.-> Resume1 -.-> Await2 -.-> Suspend2 -.-> Resume2 -.-> Return
                    
                    style Suspend1 fill:#fff9c4
                    style Suspend2 fill:#fff9c4
                    style Resume1 fill:#c8e6c9
                    style Resume2 fill:#c8e6c9`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Microtasks vs Macrotasks
                  <Badge variant="secondary">Event Loop</Badge>
                </CardTitle>
                <CardDescription>
                  Understanding task queue priorities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  chart={`graph TB
                    subgraph "Task Queues"
                      Micro[Microtask Queue<br/>• Promise.then()<br/>• queueMicrotask()<br/>• MutationObserver]
                      Macro[Macrotask Queue<br/>• setTimeout()<br/>• setInterval()<br/>• DOM events]
                    end
                    
                    subgraph "Event Loop Priority"
                      CallStackEmpty{Call Stack Empty?}
                      CheckMicro[Check Microtask Queue]
                      ExecMicro[Execute All Microtasks]
                      CheckMacro[Check Macrotask Queue]
                      ExecMacro[Execute One Macrotask]
                    end
                    
                    CallStackEmpty -.-> CheckMicro
                    CheckMicro -.-> ExecMicro
                    ExecMicro -.-> CheckMacro
                    CheckMacro -.-> ExecMacro
                    ExecMacro -.-> CallStackEmpty
                    
                    style Micro fill:#c8e6c9
                    style Macro fill:#fff9c4
                    style ExecMicro fill:#e8f5e8`}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patterns" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Module Pattern
                  <Badge variant="secondary">Design Pattern</Badge>
                </CardTitle>
                <CardDescription>
                  Encapsulation and private variables in JavaScript
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  chart={`graph TB
                    subgraph "Module Pattern (IIFE)"
                      IIFE[const MyModule = (function() {<br/>  let privateVar = 0;<br/>  function privateMethod() { ... }<br/><br/>  return {<br/>    publicMethod: function() { ... },<br/>    get count() { return privateVar; }<br/>  };<br/>})();]
                    end
                    
                    subgraph "Benefits"
                      Encapsulation[Data Encapsulation<br/>Private variables protected]
                      Namespace[Namespace Creation<br/>Avoid global pollution]
                      Singleton[Singleton Pattern<br/>Single instance]
                    end
                    
                    IIFE -.-> Encapsulation
                    IIFE -.-> Namespace
                    IIFE -.-> Singleton
                    
                    style IIFE fill:#c8e6c9
                    style Encapsulation fill:#e8f5e8
                    style Namespace fill:#fff9c4`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Observer Pattern
                  <Badge variant="secondary">Behavioral</Badge>
                </CardTitle>
                <CardDescription>
                  Event-driven programming with observers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  chart={`graph TB
                    subgraph "Observer Pattern"
                      Subject[Subject/Observable<br/>• addObserver()<br/>• removeObserver()<br/>• notifyObservers()]
                      
                      Observer1[Observer 1<br/>update()]
                      Observer2[Observer 2<br/>update()]
                      Observer3[Observer 3<br/>update()]
                    end
                    
                    subgraph "Event Flow"
                      StateChange[State Change in Subject]
                      Notify[Notify All Observers]
                      Updates[Observers Update Themselves]
                    end
                    
                    Subject -.-> Observer1
                    Subject -.-> Observer2
                    Subject -.-> Observer3
                    
                    StateChange -.-> Notify -.-> Updates
                    
                    style Subject fill:#c8e6c9
                    style Observer1 fill:#e8f5e8
                    style Observer2 fill:#e8f5e8
                    style Observer3 fill:#e8f5e8`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Factory Pattern
                  <Badge variant="secondary">Creational</Badge>
                </CardTitle>
                <CardDescription>
                  Object creation without specifying exact classes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  chart={`graph TB
                    subgraph "Factory Function"
                      Factory[function createUser(type) {<br/>  switch(type) {<br/>    case 'admin': return new Admin();<br/>    case 'user': return new User();<br/>    case 'guest': return new Guest();<br/>  }<br/>}]
                    end
                    
                    subgraph "Created Objects"
                      Admin[Admin Object<br/>• permissions: all<br/>• canDelete: true]
                      User[User Object<br/>• permissions: limited<br/>• canEdit: true]
                      Guest[Guest Object<br/>• permissions: read-only<br/>• canView: true]
                    end
                    
                    Factory -.-> Admin
                    Factory -.-> User
                    Factory -.-> Guest
                    
                    style Factory fill:#c8e6c9
                    style Admin fill:#ffcdd2
                    style User fill:#fff9c4
                    style Guest fill:#e8f5e8`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Functional Programming
                  <Badge variant="secondary">Paradigm</Badge>
                </CardTitle>
                <CardDescription>
                  Pure functions and immutability concepts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  chart={`graph TB
                    subgraph "Functional Concepts"
                      Pure[Pure Functions<br/>• Same input → Same output<br/>• No side effects<br/>• Predictable]
                      
                      Immutable[Immutability<br/>• Data doesn't change<br/>• Create new objects<br/>• Prevents bugs]
                      
                      HigherOrder[Higher-Order Functions<br/>• Take functions as params<br/>• Return functions<br/>• map, filter, reduce]
                    end
                    
                    subgraph "Benefits"
                      Testable[Easier Testing<br/>Predictable behavior]
                      Parallel[Parallelization<br/>No shared state]
                      Debug[Easier Debugging<br/>No hidden state]
                    end
                    
                    Pure -.-> Testable
                    Immutable -.-> Parallel
                    HigherOrder -.-> Debug
                    
                    style Pure fill:#c8e6c9
                    style Immutable fill:#e8f5e8
                    style HigherOrder fill:#fff9c4`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  React Component Lifecycle
                  <Badge variant="secondary">React</Badge>
                </CardTitle>
                <CardDescription>
                  Interactive React lifecycle demonstration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReactLifecycleDemo />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
