"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/src/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import {
  Play,
  Square,
  RotateCcw,
  CheckCircle,
  XCircle,
  Code,
  Terminal,
  FileText,
} from "lucide-react";

interface CodePlaygroundProps {
  title?: string;
  description?: string;
  className?: string;
  height?: number;
  language: "javascript" | "java" | "python";
  initialCode?: string;
  examples?: CodeExample[];
}

interface CodeExample {
  name: string;
  description: string;
  code: string;
  expectedOutput?: string;
}

interface TestCase {
  input: string;
  expected: string;
  actual?: string;
  passed?: boolean;
}

export function CodePlayground({
  title,
  description,
  className,
  height = 600,
  language,
  initialCode = "",
  examples = [],
}: CodePlaygroundProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [activeExample, setActiveExample] = useState(0);
  const [testResults, setTestResults] = useState<TestCase[]>([]);
  const outputRef = useRef<HTMLDivElement>(null);

  const getDefaultCode = () => {
    switch (language) {
      case "javascript":
        return `// JavaScript Playground
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Test the function
console.log("Fibonacci sequence:");
for (let i = 0; i < 10; i++) {
  console.log(\`F(\${i}) = \${fibonacci(i)}\`);
}`;

      case "java":
        return `// Java Playground
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
        
        // Bubble Sort Example
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        System.out.println("Original array:");
        printArray(arr);
        
        bubbleSort(arr);
        System.out.println("Sorted array:");
        printArray(arr);
    }
    
    static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n-1; i++) {
            for (int j = 0; j < n-i-1; j++) {
                if (arr[j] > arr[j+1]) {
                    int temp = arr[j];
                    arr[j] = arr[j+1];
                    arr[j+1] = temp;
                }
            }
        }
    }
    
    static void printArray(int[] arr) {
        for (int value : arr) {
            System.out.print(value + " ");
        }
        System.out.println();
    }
}`;

      case "python":
        return `# Python Playground
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quicksort(left) + middle + quicksort(right)

# Test the function
numbers = [3, 6, 8, 10, 1, 2, 1]
print(f"Original: {numbers}")
print(f"Sorted: {quicksort(numbers)}")

# List comprehension example
squares = [x**2 for x in range(10)]
print(f"Squares: {squares}")`;

      default:
        return "";
    }
  };

  const mockRunCode = () => {
    setIsRunning(true);
    setOutput("Running...");

    setTimeout(() => {
      let mockOutput = "";

      switch (language) {
        case "javascript":
          if (code.includes("fibonacci")) {
            mockOutput = `Fibonacci sequence:
F(0) = 0
F(1) = 1
F(2) = 1
F(3) = 2
F(4) = 3
F(5) = 5
F(6) = 8
F(7) = 13
F(8) = 21
F(9) = 34`;
          } else {
            mockOutput = "Code executed successfully!";
          }
          break;

        case "java":
          if (code.includes("bubbleSort")) {
            mockOutput = `Hello, Java!
Original array:
64 34 25 12 22 11 90 
Sorted array:
11 12 22 25 34 64 90`;
          } else {
            mockOutput = "Java program compiled and executed successfully!";
          }
          break;

        case "python":
          if (code.includes("quicksort")) {
            mockOutput = `Original: [3, 6, 8, 10, 1, 2, 1]
Sorted: [1, 1, 2, 3, 6, 8, 10]
Squares: [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]`;
          } else {
            mockOutput = "Python script executed successfully!";
          }
          break;

        default:
          mockOutput = "Code executed!";
      }

      setOutput(mockOutput);
      setIsRunning(false);
    }, 1500);
  };

  const resetCode = () => {
    setCode(getDefaultCode());
    setOutput("");
    setTestResults([]);
  };

  const loadExample = (index: number) => {
    if (examples[index]) {
      setCode(examples[index].code);
      setActiveExample(index);
      setOutput("");
      setTestResults([]);
    }
  };

  const runTests = () => {
    const mockTests: TestCase[] = [
      {
        input: "fibonacci(5)",
        expected: "5",
        actual: "5",
        passed: true,
      },
      {
        input: "fibonacci(10)",
        expected: "55",
        actual: "55",
        passed: true,
      },
      {
        input: "fibonacci(0)",
        expected: "0",
        actual: "0",
        passed: true,
      },
    ];

    setTestResults(mockTests);
  };

  const getSyntaxHighlighting = (code: string) => {
    return code.split("\n").map((line, index) => (
      <div key={index} className="flex">
        <span className="text-gray-400 w-8 text-right pr-2 select-none">
          {index + 1}
        </span>
        <span className="flex-1">{line}</span>
      </div>
    ));
  };

  useEffect(() => {
    if (!code && language) {
      setCode(getDefaultCode());
    }
  }, [language]);

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
            <Badge variant="outline" className="capitalize">
              {language}
            </Badge>
          </div>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <div style={{ height: `${height}px` }} className="flex flex-col">
          <Tabs defaultValue="editor" className="flex-1">
            <div className="border-b px-4 py-2">
              <TabsList>
                <TabsTrigger value="editor" className="flex items-center gap-2">
                  <Code className="h-3 w-3" />
                  Editor
                </TabsTrigger>
                <TabsTrigger value="output" className="flex items-center gap-2">
                  <Terminal className="h-3 w-3" />
                  Output
                </TabsTrigger>
                {examples.length > 0 && (
                  <TabsTrigger
                    value="examples"
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-3 w-3" />
                    Examples
                  </TabsTrigger>
                )}
              </TabsList>
            </div>

            <TabsContent value="editor" className="flex-1 m-0">
              <div className="h-full flex flex-col">
                <div className="flex items-center gap-2 p-3 border-b bg-gray-50">
                  <Button
                    onClick={mockRunCode}
                    size="sm"
                    disabled={isRunning}
                    className="flex items-center gap-2"
                  >
                    {isRunning ? (
                      <Square className="h-3 w-3" />
                    ) : (
                      <Play className="h-3 w-3" />
                    )}
                    {isRunning ? "Running..." : "Run"}
                  </Button>
                  <Button onClick={resetCode} size="sm" variant="outline">
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                  {language === "javascript" && (
                    <Button onClick={runTests} size="sm" variant="outline">
                      Run Tests
                    </Button>
                  )}
                </div>

                <div className="flex-1 relative">
                  <Textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="h-full resize-none border-0 rounded-none font-mono text-sm"
                    placeholder={`Enter your ${language} code here...`}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="output" className="flex-1 m-0">
              <div className="h-full flex flex-col">
                <div className="p-3 border-b bg-gray-50">
                  <h3 className="font-semibold text-sm">Console Output</h3>
                </div>
                <div
                  ref={outputRef}
                  className="flex-1 p-4 font-mono text-sm bg-black text-green-400 overflow-auto"
                >
                  {output ? (
                    <pre className="whitespace-pre-wrap">{output}</pre>
                  ) : (
                    <div className="text-gray-500">
                      No output yet. Run your code to see results.
                    </div>
                  )}
                </div>

                {testResults.length > 0 && (
                  <div className="border-t p-4">
                    <h4 className="font-semibold mb-3">Test Results</h4>
                    <div className="space-y-2">
                      {testResults.map((test, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 border rounded"
                        >
                          <div className="flex items-center gap-2">
                            {test.passed ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            <code className="text-sm">{test.input}</code>
                          </div>
                          <div className="text-sm text-gray-600">
                            Expected: {test.expected} | Got: {test.actual}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {examples.length > 0 && (
              <TabsContent value="examples" className="flex-1 m-0">
                <div className="h-full flex">
                  <div className="w-1/3 border-r">
                    <div className="p-3 border-b bg-gray-50">
                      <h3 className="font-semibold text-sm">Examples</h3>
                    </div>
                    <div className="p-2 space-y-1">
                      {examples.map((example, index) => (
                        <Button
                          key={index}
                          variant={
                            activeExample === index ? "default" : "ghost"
                          }
                          size="sm"
                          className="w-full justify-start text-left h-auto p-2"
                          onClick={() => loadExample(index)}
                        >
                          <div>
                            <div className="font-medium">{example.name}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {example.description}
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="p-3 border-b bg-gray-50">
                      <h3 className="font-semibold text-sm">Preview</h3>
                    </div>
                    <div className="p-4 h-full overflow-auto">
                      <pre className="text-sm font-mono whitespace-pre-wrap bg-gray-50 p-3 rounded">
                        {examples[activeExample]?.code ||
                          "Select an example to preview"}
                      </pre>
                    </div>
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}

export function JavaScriptPlaygroundDemo({
  className,
}: {
  className?: string;
}) {
  const examples: CodeExample[] = [
    {
      name: "Array Methods",
      description: "Common array operations and methods",
      code: `// Array manipulation examples
const numbers = [1, 2, 3, 4, 5];

// Map - transform each element
const doubled = numbers.map(x => x * 2);
console.log("Doubled:", doubled);

// Filter - select elements
const evens = numbers.filter(x => x % 2 === 0);
console.log("Evens:", evens);

// Reduce - aggregate
const sum = numbers.reduce((acc, x) => acc + x, 0);
console.log("Sum:", sum);

// Chaining methods
const result = numbers
  .filter(x => x > 2)
  .map(x => x * x)
  .reduce((acc, x) => acc + x, 0);
console.log("Filtered, squared, summed:", result);`,
    },
    {
      name: "Promises & Async",
      description: "Asynchronous programming patterns",
      code: `// Promise example
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Async/await
async function example() {
  console.log("Starting...");
  await delay(1000);
  console.log("After 1 second");
  
  try {
    const result = await fetchData();
    console.log("Data:", result);
  } catch (error) {
    console.log("Error:", error.message);
  }
}

function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      Math.random() > 0.5 
        ? resolve({ data: "Success!" })
        : reject(new Error("Failed to fetch"));
    }, 500);
  });
}

example();`,
    },
  ];

  return (
    <CodePlayground
      title="JavaScript Interactive Playground"
      description="Practice JavaScript concepts with live code execution"
      className={className}
      height={500}
      language="javascript"
      examples={examples}
    />
  );
}

export function JavaPlaygroundDemo({ className }: { className?: string }) {
  const examples: CodeExample[] = [
    {
      name: "Collections Example",
      description: "Working with Java collections",
      code: `import java.util.*;

public class CollectionsDemo {
    public static void main(String[] args) {
        // ArrayList example
        List<String> list = new ArrayList<>();
        list.add("Java");
        list.add("Python");
        list.add("JavaScript");
        
        System.out.println("List: " + list);
        
        // HashMap example
        Map<String, Integer> scores = new HashMap<>();
        scores.put("Alice", 95);
        scores.put("Bob", 87);
        scores.put("Charlie", 92);
        
        System.out.println("Scores: " + scores);
        
        // Stream operations
        list.stream()
            .filter(lang -> lang.startsWith("J"))
            .forEach(System.out::println);
    }
}`,
    },
    {
      name: "OOP Example",
      description: "Object-oriented programming concepts",
      code: `// Interface
interface Shape {
    double getArea();
    void draw();
}

// Abstract class
abstract class Animal {
    protected String name;
    
    public Animal(String name) {
        this.name = name;
    }
    
    public abstract void makeSound();
    
    public void sleep() {
        System.out.println(name + " is sleeping");
    }
}

// Concrete classes
class Dog extends Animal {
    public Dog(String name) {
        super(name);
    }
    
    @Override
    public void makeSound() {
        System.out.println(name + " says Woof!");
    }
}

class Circle implements Shape {
    private double radius;
    
    public Circle(double radius) {
        this.radius = radius;
    }
    
    @Override
    public double getArea() {
        return Math.PI * radius * radius;
    }
    
    @Override
    public void draw() {
        System.out.println("Drawing a circle");
    }
}`,
    },
  ];

  return (
    <CodePlayground
      title="Java Interactive Playground"
      description="Practice Java programming with OOP concepts and collections"
      className={className}
      height={500}
      language="java"
      examples={examples}
    />
  );
}

export function PythonPlaygroundDemo({ className }: { className?: string }) {
  const examples: CodeExample[] = [
    {
      name: "Data Structures",
      description: "Python built-in data structures",
      code: `# Lists, tuples, sets, dictionaries
fruits = ['apple', 'banana', 'cherry']
coordinates = (10, 20)
unique_numbers = {1, 2, 3, 3, 4}
person = {'name': 'Alice', 'age': 30}

print("List:", fruits)
print("Tuple:", coordinates)
print("Set:", unique_numbers)
print("Dict:", person)

# List comprehensions
squares = [x**2 for x in range(1, 6)]
even_squares = [x**2 for x in range(1, 11) if x % 2 == 0]

print("Squares:", squares)
print("Even squares:", even_squares)

# Dictionary comprehension
word_lengths = {word: len(word) for word in fruits}
print("Word lengths:", word_lengths)`,
    },
    {
      name: "Classes & Inheritance",
      description: "Object-oriented programming in Python",
      code: `class Vehicle:
    def __init__(self, brand, model):
        self.brand = brand
        self.model = model
        
    def start(self):
        print(f"{self.brand} {self.model} is starting")
        
    def __str__(self):
        return f"{self.brand} {self.model}"

class Car(Vehicle):
    def __init__(self, brand, model, doors):
        super().__init__(brand, model)
        self.doors = doors
        
    def honk(self):
        print("Beep beep!")

class ElectricCar(Car):
    def __init__(self, brand, model, doors, battery_capacity):
        super().__init__(brand, model, doors)
        self.battery_capacity = battery_capacity
        
    def charge(self):
        print(f"Charging {self.battery_capacity}kWh battery")

# Usage
tesla = ElectricCar("Tesla", "Model 3", 4, 75)
print(tesla)
tesla.start()
tesla.honk()
tesla.charge()`,
    },
  ];

  return (
    <CodePlayground
      title="Python Interactive Playground"
      description="Practice Python programming with data structures and OOP"
      className={className}
      height={500}
      language="python"
      examples={examples}
    />
  );
}
