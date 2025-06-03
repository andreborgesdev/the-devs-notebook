'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { Badge } from '@/src/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs'
import { Slider } from '@/src/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select'
import { Progress } from '@/src/components/ui/progress'
import { Play, Pause, RotateCcw, Zap, Code, GitBranch, Cpu, Database, Users } from 'lucide-react'

interface FunctionCall {
  id: string
  name: string
  params: any[]
  returnValue?: any
  startTime: number
  endTime?: number
  status: 'pending' | 'executing' | 'completed' | 'error'
}

interface MemoryBlock {
  id: string
  type: 'stack' | 'heap' | 'global'
  address: string
  value: any
  size: number
  allocated: boolean
}

interface AsyncOperation {
  id: string
  type: 'promise' | 'callback' | 'async-await'
  status: 'pending' | 'resolved' | 'rejected'
  result?: any
}

const ProgrammingConceptsVisualizer: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="w-5 h-5" />
          Programming Concepts Visualizer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="execution" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="execution">Execution</TabsTrigger>
            <TabsTrigger value="memory">Memory</TabsTrigger>
            <TabsTrigger value="async">Async</TabsTrigger>
            <TabsTrigger value="oop">OOP</TabsTrigger>
            <TabsTrigger value="functional">Functional</TabsTrigger>
          </TabsList>

          <TabsContent value="execution">
            <CallStackDemo />
          </TabsContent>

          <TabsContent value="memory">
            <MemoryManagementDemo />
          </TabsContent>

          <TabsContent value="async">
            <AsyncProgrammingDemo />
          </TabsContent>

          <TabsContent value="oop">
            <OOPConceptsDemo />
          </TabsContent>

          <TabsContent value="functional">
            <FunctionalProgrammingDemo />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

const CallStackDemo: React.FC = () => {
  const [callStack, setCallStack] = useState<FunctionCall[]>([])
  const [currentExecution, setCurrentExecution] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [executionSpeed, setExecutionSpeed] = useState([1000])

  const sampleProgram = [
    { name: 'main', code: 'function main() { calculateTotal(); }' },
    { name: 'calculateTotal', code: 'function calculateTotal() { return add(5, multiply(3, 2)); }' },
    { name: 'multiply', code: 'function multiply(a, b) { return a * b; }' },
    { name: 'add', code: 'function add(a, b) { return a + b; }' }
  ]

  const executeProgram = async () => {
    setIsRunning(true)
    setCallStack([])
    
    const addToStack = (name: string, params: any[] = []) => {
      const call: FunctionCall = {
        id: `call-${Date.now()}-${name}`,
        name,
        params,
        startTime: Date.now(),
        status: 'executing'
      }
      setCallStack(prev => [...prev, call])
      setCurrentExecution(call.id)
      return call.id
    }

    const removeFromStack = (id: string, returnValue?: any) => {
      setCallStack(prev => prev.map(call => 
        call.id === id 
          ? { ...call, status: 'completed', returnValue, endTime: Date.now() }
          : call
      ))
      setTimeout(() => {
        setCallStack(prev => prev.filter(call => call.id !== id))
      }, 500)
    }

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

    try {
      const mainId = addToStack('main', [])
      await delay(executionSpeed[0])

      const calculateTotalId = addToStack('calculateTotal', [])
      await delay(executionSpeed[0])

      const multiplyId = addToStack('multiply', [3, 2])
      await delay(executionSpeed[0])
      removeFromStack(multiplyId, 6)
      await delay(executionSpeed[0])

      const addId = addToStack('add', [5, 6])
      await delay(executionSpeed[0])
      removeFromStack(addId, 11)
      await delay(executionSpeed[0])

      removeFromStack(calculateTotalId, 11)
      await delay(executionSpeed[0])

      removeFromStack(mainId, undefined)
      await delay(executionSpeed[0])

    } finally {
      setIsRunning(false)
      setCurrentExecution(null)
    }
  }

  const reset = () => {
    setCallStack([])
    setCurrentExecution(null)
    setIsRunning(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center">
        <Button onClick={executeProgram} disabled={isRunning}>
          <Play className="w-4 h-4 mr-2" />
          Execute Program
        </Button>
        <Button onClick={reset} variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-sm">Speed:</span>
          <Slider
            value={executionSpeed}
            onValueChange={setExecutionSpeed}
            max={2000}
            min={200}
            step={200}
            className="w-32"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Source Code</h3>
          <div className="space-y-2">
            {sampleProgram.map((func, index) => (
              <Card 
                key={func.name} 
                className={`p-3 transition-all ${
                  callStack.some(call => call.name === func.name && call.status === 'executing')
                    ? 'border-blue-500 bg-blue-50'
                    : ''
                }`}
              >
                <code className="text-sm">{func.code}</code>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Call Stack</h3>
          <Card className="p-4 min-h-80">
            <div className="space-y-2">
              {callStack.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  Call stack is empty
                </div>
              )}
              {callStack.map((call, index) => (
                <div
                  key={call.id}
                  className={`p-3 rounded border transition-all ${
                    call.id === currentExecution
                      ? 'border-blue-500 bg-blue-100'
                      : call.status === 'completed'
                      ? 'border-green-500 bg-green-100'
                      : 'border-gray-300 bg-gray-50'
                  }`}
                  style={{ marginBottom: index === callStack.length - 1 ? 0 : '8px' }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">{call.name}()</h4>
                      {call.params.length > 0 && (
                        <p className="text-sm text-gray-600">
                          Parameters: {call.params.join(', ')}
                        </p>
                      )}
                      {call.returnValue !== undefined && (
                        <p className="text-sm text-green-600">
                          Returns: {call.returnValue}
                        </p>
                      )}
                    </div>
                    <Badge variant={
                      call.status === 'executing' ? 'default' :
                      call.status === 'completed' ? 'secondary' : 'destructive'
                    }>
                      {call.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

const MemoryManagementDemo: React.FC = () => {
  const [memoryBlocks, setMemoryBlocks] = useState<MemoryBlock[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState<'javascript' | 'java' | 'c++'>('javascript')
  const [step, setStep] = useState(0)

  const memoryOperations = {
    javascript: [
      { action: 'declare', code: 'let x = 5;', type: 'stack', value: 5 },
      { action: 'declare', code: 'let obj = {name: "John"};', type: 'heap', value: { name: 'John' } },
      { action: 'declare', code: 'let arr = [1, 2, 3];', type: 'heap', value: [1, 2, 3] },
      { action: 'modify', code: 'obj.age = 30;', type: 'heap', value: { name: 'John', age: 30 } },
      { action: 'gc', code: '// Garbage collection', type: 'cleanup', value: null }
    ],
    java: [
      { action: 'declare', code: 'int x = 5;', type: 'stack', value: 5 },
      { action: 'declare', code: 'Person p = new Person();', type: 'heap', value: 'Person object' },
      { action: 'declare', code: 'int[] arr = new int[3];', type: 'heap', value: [0, 0, 0] },
      { action: 'modify', code: 'p.setName("John");', type: 'heap', value: 'Person{name: John}' },
      { action: 'gc', code: '// GC when p goes out of scope', type: 'cleanup', value: null }
    ],
    'c++': [
      { action: 'declare', code: 'int x = 5;', type: 'stack', value: 5 },
      { action: 'declare', code: 'int* ptr = new int(10);', type: 'heap', value: 10 },
      { action: 'declare', code: 'int arr[3] = {1,2,3};', type: 'stack', value: [1, 2, 3] },
      { action: 'modify', code: '*ptr = 20;', type: 'heap', value: 20 },
      { action: 'free', code: 'delete ptr;', type: 'cleanup', value: null }
    ]
  }

  const executeStep = () => {
    const operations = memoryOperations[selectedLanguage]
    if (step >= operations.length) return

    const op = operations[step]
    
    if (op.action === 'declare') {
      const newBlock: MemoryBlock = {
        id: `block-${Date.now()}-${step}`,
        type: op.type as 'stack' | 'heap',
        address: `0x${(0x100000 + step * 0x1000).toString(16)}`,
        value: op.value,
        size: op.type === 'stack' ? 4 : 16,
        allocated: true
      }
      setMemoryBlocks(prev => [...prev, newBlock])
    } else if (op.action === 'modify') {
      setMemoryBlocks(prev => prev.map((block, index) => 
        index === prev.length - 2 ? { ...block, value: op.value } : block
      ))
    } else if (op.action === 'gc' || op.action === 'free') {
      setMemoryBlocks(prev => prev.filter(block => block.type !== 'heap'))
    }

    setStep(prev => prev + 1)
  }

  const reset = () => {
    setMemoryBlocks([])
    setStep(0)
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center">
        <Select
          value={selectedLanguage}
          onValueChange={(value) => {
            setSelectedLanguage(value as any)
            reset()
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="java">Java</SelectItem>
            <SelectItem value="c++">C++</SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          onClick={executeStep} 
          disabled={step >= memoryOperations[selectedLanguage].length}
        >
          <Play className="w-4 h-4 mr-2" />
          Next Step
        </Button>
        <Button onClick={reset} variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Code Execution</h3>
          <div className="space-y-2">
            {memoryOperations[selectedLanguage].map((op, index) => (
              <Card 
                key={index}
                className={`p-3 transition-all ${
                  index === step - 1 
                    ? 'border-blue-500 bg-blue-50'
                    : index < step
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200'
                }`}
              >
                <code className="text-sm">{op.code}</code>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Stack Memory</h3>
          <Card className="p-4 min-h-60">
            <div className="space-y-2">
              {memoryBlocks.filter(block => block.type === 'stack').map((block) => (
                <div key={block.id} className="p-2 bg-blue-100 border border-blue-300 rounded">
                  <div className="text-xs text-gray-600">{block.address}</div>
                  <div className="font-mono text-sm">{JSON.stringify(block.value)}</div>
                </div>
              ))}
              {memoryBlocks.filter(block => block.type === 'stack').length === 0 && (
                <div className="text-center text-gray-500 py-4">Stack Empty</div>
              )}
            </div>
          </Card>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Heap Memory</h3>
          <Card className="p-4 min-h-60">
            <div className="space-y-2">
              {memoryBlocks.filter(block => block.type === 'heap').map((block) => (
                <div key={block.id} className="p-2 bg-green-100 border border-green-300 rounded">
                  <div className="text-xs text-gray-600">{block.address}</div>
                  <div className="font-mono text-sm">{JSON.stringify(block.value)}</div>
                  <div className="text-xs text-gray-500">{block.size} bytes</div>
                </div>
              ))}
              {memoryBlocks.filter(block => block.type === 'heap').length === 0 && (
                <div className="text-center text-gray-500 py-4">Heap Empty</div>
              )}
            </div>
          </Card>
        </div>
      </div>

      <Card className="p-4">
        <h4 className="font-semibold mb-2">Memory Management Characteristics</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-blue-600">JavaScript</h5>
            <ul className="space-y-1 text-gray-600">
              <li>• Automatic garbage collection</li>
              <li>• Mark and sweep algorithm</li>
              <li>• No manual memory management</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-green-600">Java</h5>
            <ul className="space-y-1 text-gray-600">
              <li>• Automatic garbage collection</li>
              <li>• Generational GC</li>
              <li>• Reference counting</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-purple-600">C++</h5>
            <ul className="space-y-1 text-gray-600">
              <li>• Manual memory management</li>
              <li>• new/delete operators</li>
              <li>• RAII pattern</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}

const AsyncProgrammingDemo: React.FC = () => {
  const [asyncOperations, setAsyncOperations] = useState<AsyncOperation[]>([])
  const [eventLoop, setEventLoop] = useState<string[]>([])
  const [selectedPattern, setSelectedPattern] = useState<'promises' | 'async-await' | 'callbacks'>('promises')
  const [isRunning, setIsRunning] = useState(false)

  const promiseDemo = async () => {
    setIsRunning(true)
    setAsyncOperations([])
    setEventLoop(['Promise chain started'])

    const createOperation = (id: string, type: 'promise' | 'callback' | 'async-await') => {
      const op: AsyncOperation = { id, type, status: 'pending' }
      setAsyncOperations(prev => [...prev, op])
      return op
    }

    const resolveOperation = (id: string, result: any) => {
      setAsyncOperations(prev => prev.map(op => 
        op.id === id ? { ...op, status: 'resolved', result } : op
      ))
    }

    try {
      setEventLoop(prev => [...prev, 'fetch() called'])
      const fetchOp = createOperation('fetch', 'promise')
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      resolveOperation('fetch', 'User data')
      setEventLoop(prev => [...prev, 'Promise resolved'])

      setEventLoop(prev => [...prev, '.then() executed'])
      const processOp = createOperation('process', 'promise')
      
      await new Promise(resolve => setTimeout(resolve, 800))
      resolveOperation('process', 'Processed data')
      setEventLoop(prev => [...prev, 'Data processed'])

      setEventLoop(prev => [...prev, 'Promise chain completed'])
    } finally {
      setIsRunning(false)
    }
  }

  const asyncAwaitDemo = async () => {
    setIsRunning(true)
    setAsyncOperations([])
    setEventLoop(['async function called'])

    try {
      setEventLoop(prev => [...prev, 'await fetchUser()'])
      const userOp: AsyncOperation = { id: 'user', type: 'async-await', status: 'pending' }
      setAsyncOperations([userOp])
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      setAsyncOperations(prev => prev.map(op => 
        op.id === 'user' ? { ...op, status: 'resolved', result: 'User data' } : op
      ))
      setEventLoop(prev => [...prev, 'User data received'])

      setEventLoop(prev => [...prev, 'await processData()'])
      const processOp: AsyncOperation = { id: 'process', type: 'async-await', status: 'pending' }
      setAsyncOperations(prev => [...prev, processOp])
      
      await new Promise(resolve => setTimeout(resolve, 800))
      setAsyncOperations(prev => prev.map(op => 
        op.id === 'process' ? { ...op, status: 'resolved', result: 'Processed data' } : op
      ))
      setEventLoop(prev => [...prev, 'Processing complete'])

      setEventLoop(prev => [...prev, 'async function complete'])
    } finally {
      setIsRunning(false)
    }
  }

  const callbackDemo = async () => {
    setIsRunning(true)
    setAsyncOperations([])
    setEventLoop(['Callback pattern started'])

    const callbacks = ['getData', 'processData', 'saveData']
    
    for (let i = 0; i < callbacks.length; i++) {
      setEventLoop(prev => [...prev, `${callbacks[i]} called`])
      const op: AsyncOperation = { id: callbacks[i], type: 'callback', status: 'pending' }
      setAsyncOperations(prev => [...prev, op])
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      setAsyncOperations(prev => prev.map(op => 
        op.id === callbacks[i] ? { ...op, status: 'resolved', result: `${callbacks[i]} result` } : op
      ))
      setEventLoop(prev => [...prev, `${callbacks[i]} callback executed`])
    }
    
    setEventLoop(prev => [...prev, 'All callbacks complete'])
    setIsRunning(false)
  }

  const reset = () => {
    setAsyncOperations([])
    setEventLoop([])
    setIsRunning(false)
  }

  const demos = {
    promises: promiseDemo,
    'async-await': asyncAwaitDemo,
    callbacks: callbackDemo
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center">
        <Select
          value={selectedPattern}
          onValueChange={(value) => setSelectedPattern(value as any)}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="promises">Promises</SelectItem>
            <SelectItem value="async-await">Async/Await</SelectItem>
            <SelectItem value="callbacks">Callbacks</SelectItem>
          </SelectContent>
        </Select>
        
        <Button onClick={demos[selectedPattern]} disabled={isRunning}>
          <Play className="w-4 h-4 mr-2" />
          Run Demo
        </Button>
        <Button onClick={reset} variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Async Operations</h3>
          <Card className="p-4 min-h-60">
            <div className="space-y-3">
              {asyncOperations.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No operations running
                </div>
              )}
              {asyncOperations.map((op) => (
                <div
                  key={op.id}
                  className={`p-3 rounded border transition-all ${
                    op.status === 'pending' 
                      ? 'border-yellow-500 bg-yellow-50'
                      : op.status === 'resolved'
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">{op.id}</h4>
                      <p className="text-sm text-gray-600">Type: {op.type}</p>
                      {op.result && (
                        <p className="text-sm text-green-600">Result: {op.result}</p>
                      )}
                    </div>
                    <Badge variant={
                      op.status === 'pending' ? 'secondary' :
                      op.status === 'resolved' ? 'default' : 'destructive'
                    }>
                      {op.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Event Loop</h3>
          <Card className="p-4 min-h-60">
            <div className="space-y-2">
              {eventLoop.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  Event loop idle
                </div>
              )}
              {eventLoop.map((event, index) => (
                <div
                  key={index}
                  className="p-2 bg-blue-50 border border-blue-200 rounded flex items-center gap-2"
                >
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm">{event}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Card className="p-4">
        <h4 className="font-semibold mb-3">Async Pattern Comparison</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-blue-600">Promises</h5>
            <ul className="space-y-1 text-gray-600">
              <li>• Chainable with .then()</li>
              <li>• Error handling with .catch()</li>
              <li>• Better than callbacks</li>
              <li>• Can lead to promise chains</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-green-600">Async/Await</h5>
            <ul className="space-y-1 text-gray-600">
              <li>• Synchronous-looking code</li>
              <li>• Built on promises</li>
              <li>• try/catch error handling</li>
              <li>• Most readable pattern</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-purple-600">Callbacks</h5>
            <ul className="space-y-1 text-gray-600">
              <li>• Original async pattern</li>
              <li>• Can lead to callback hell</li>
              <li>• Error handling in callback</li>
              <li>• Still used in some APIs</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}

const OOPConceptsDemo: React.FC = () => {
  const [selectedConcept, setSelectedConcept] = useState<'inheritance' | 'polymorphism' | 'encapsulation' | 'abstraction'>('inheritance')
  const [currentExample, setCurrentExample] = useState(0)

  const concepts = {
    inheritance: {
      title: 'Inheritance',
      description: 'Child classes inherit properties and methods from parent classes',
      examples: [
        {
          name: 'Basic Inheritance',
          parent: 'Animal',
          children: ['Dog', 'Cat', 'Bird'],
          properties: ['name', 'age'],
          methods: ['eat()', 'sleep()']
        }
      ]
    },
    polymorphism: {
      title: 'Polymorphism',
      description: 'Objects of different types can be treated as instances of the same type',
      examples: [
        {
          name: 'Method Overriding',
          base: 'Shape',
          implementations: ['Circle', 'Rectangle', 'Triangle'],
          method: 'calculateArea()',
          behaviors: ['π * r²', 'width * height', '0.5 * base * height']
        }
      ]
    },
    encapsulation: {
      title: 'Encapsulation',
      description: 'Bundling data and methods together, hiding internal details',
      examples: [
        {
          name: 'Bank Account',
          class: 'BankAccount',
          private: ['balance', 'accountNumber'],
          public: ['deposit()', 'withdraw()', 'getBalance()'],
          protected: ['validateTransaction()']
        }
      ]
    },
    abstraction: {
      title: 'Abstraction',
      description: 'Hiding complex implementation details behind a simple interface',
      examples: [
        {
          name: 'Vehicle Interface',
          abstract: 'Vehicle',
          methods: ['start()', 'stop()', 'accelerate()'],
          implementations: ['Car', 'Motorcycle', 'Truck']
        }
      ]
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4 flex-wrap">
        {Object.keys(concepts).map((concept) => (
          <Button
            key={concept}
            onClick={() => setSelectedConcept(concept as any)}
            variant={selectedConcept === concept ? 'default' : 'outline'}
          >
            {concepts[concept as keyof typeof concepts].title}
          </Button>
        ))}
      </div>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-2">
          {concepts[selectedConcept].title}
        </h3>
        <p className="text-gray-600 mb-4">
          {concepts[selectedConcept].description}
        </p>

        {selectedConcept === 'inheritance' && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="inline-block p-4 bg-blue-100 border-2 border-blue-300 rounded-lg">
                <h4 className="font-semibold">Animal (Parent)</h4>
                <div className="text-sm text-gray-600">
                  <p>Properties: name, age</p>
                  <p>Methods: eat(), sleep()</p>
                </div>
              </div>
              
              <div className="flex justify-center gap-4 mt-6">
                {['Dog', 'Cat', 'Bird'].map((animal) => (
                  <div key={animal} className="text-center">
                    <div className="w-px h-8 bg-gray-400 mx-auto"></div>
                    <div className="p-3 bg-green-100 border-2 border-green-300 rounded-lg">
                      <h5 className="font-medium">{animal}</h5>
                      <div className="text-xs text-gray-600">
                        <p>Inherits from Animal</p>
                        <p>+ specific methods</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedConcept === 'polymorphism' && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="inline-block p-4 bg-purple-100 border-2 border-purple-300 rounded-lg">
                <h4 className="font-semibold">Shape (Base Class)</h4>
                <div className="text-sm text-gray-600">
                  <p>Abstract method: calculateArea()</p>
                </div>
              </div>
              
              <div className="flex justify-center gap-4 mt-6">
                {[
                  { name: 'Circle', formula: 'π * r²' },
                  { name: 'Rectangle', formula: 'w * h' },
                  { name: 'Triangle', formula: '0.5 * b * h' }
                ].map((shape) => (
                  <div key={shape.name} className="text-center">
                    <div className="w-px h-8 bg-gray-400 mx-auto"></div>
                    <div className="p-3 bg-yellow-100 border-2 border-yellow-300 rounded-lg">
                      <h5 className="font-medium">{shape.name}</h5>
                      <div className="text-xs text-gray-600">
                        <p>calculateArea():</p>
                        <code>{shape.formula}</code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedConcept === 'encapsulation' && (
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-3 bg-red-50 border-red-200">
              <h5 className="font-medium text-red-700 mb-2">Private</h5>
              <ul className="text-sm space-y-1">
                <li>- balance</li>
                <li>- accountNumber</li>
              </ul>
              <p className="text-xs text-red-600 mt-2">Only accessible within class</p>
            </Card>
            
            <Card className="p-3 bg-yellow-50 border-yellow-200">
              <h5 className="font-medium text-yellow-700 mb-2">Protected</h5>
              <ul className="text-sm space-y-1">
                <li># validateTransaction()</li>
              </ul>
              <p className="text-xs text-yellow-600 mt-2">Accessible to subclasses</p>
            </Card>
            
            <Card className="p-3 bg-green-50 border-green-200">
              <h5 className="font-medium text-green-700 mb-2">Public</h5>
              <ul className="text-sm space-y-1">
                <li>+ deposit()</li>
                <li>+ withdraw()</li>
                <li>+ getBalance()</li>
              </ul>
              <p className="text-xs text-green-600 mt-2">Accessible everywhere</p>
            </Card>
          </div>
        )}

        {selectedConcept === 'abstraction' && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="inline-block p-4 bg-gray-100 border-2 border-gray-400 rounded-lg border-dashed">
                <h4 className="font-semibold">Vehicle (Abstract)</h4>
                <div className="text-sm text-gray-600">
                  <p>Abstract methods:</p>
                  <p>start(), stop(), accelerate()</p>
                </div>
              </div>
              
              <div className="flex justify-center gap-4 mt-6">
                {['Car', 'Motorcycle', 'Truck'].map((vehicle) => (
                  <div key={vehicle} className="text-center">
                    <div className="w-px h-8 bg-gray-400 mx-auto"></div>
                    <div className="p-3 bg-blue-100 border-2 border-blue-300 rounded-lg">
                      <h5 className="font-medium">{vehicle}</h5>
                      <div className="text-xs text-gray-600">
                        <p>Implements all</p>
                        <p>abstract methods</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

const FunctionalProgrammingDemo: React.FC = () => {
  const [selectedConcept, setSelectedConcept] = useState<'pure-functions' | 'immutability' | 'higher-order' | 'composition'>('pure-functions')
  const [demoStep, setDemoStep] = useState(0)

  const concepts = {
    'pure-functions': {
      title: 'Pure Functions',
      description: 'Functions that always return the same output for the same input and have no side effects',
      examples: [
        {
          type: 'Pure',
          code: 'const add = (a, b) => a + b',
          explanation: 'Always returns same result, no side effects'
        },
        {
          type: 'Impure',
          code: 'let count = 0; const increment = () => ++count',
          explanation: 'Modifies external state, different results'
        }
      ]
    },
    immutability: {
      title: 'Immutability',
      description: 'Data cannot be changed after creation; create new data instead',
      examples: [
        {
          type: 'Mutable',
          code: 'arr.push(4); // Modifies original array',
          explanation: 'Changes existing data structure'
        },
        {
          type: 'Immutable',
          code: 'const newArr = [...arr, 4]; // New array',
          explanation: 'Creates new data structure'
        }
      ]
    },
    'higher-order': {
      title: 'Higher-Order Functions',
      description: 'Functions that take other functions as parameters or return functions',
      examples: [
        {
          type: 'map',
          code: 'arr.map(x => x * 2)',
          explanation: 'Transform each element'
        },
        {
          type: 'filter',
          code: 'arr.filter(x => x > 5)',
          explanation: 'Select elements that match condition'
        },
        {
          type: 'reduce',
          code: 'arr.reduce((sum, x) => sum + x, 0)',
          explanation: 'Accumulate values into single result'
        }
      ]
    },
    composition: {
      title: 'Function Composition',
      description: 'Combining simple functions to create more complex ones',
      examples: [
        {
          type: 'Basic',
          code: 'const compose = (f, g) => x => f(g(x))',
          explanation: 'Combine two functions'
        },
        {
          type: 'Pipeline',
          code: 'pipe(add1, multiply2, subtract3)(5)',
          explanation: 'Chain multiple operations'
        }
      ]
    }
  }

  const higherOrderDemo = () => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    
    return (
      <div className="space-y-4">
        <div className="p-3 bg-gray-50 rounded">
          <h5 className="font-medium mb-2">Original Array</h5>
          <div className="flex gap-2">
            {data.map((item, index) => (
              <div key={index} className="w-8 h-8 bg-blue-100 border border-blue-300 rounded flex items-center justify-center text-sm">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 bg-gray-50 rounded">
          <h5 className="font-medium mb-2">map(x => x * 2)</h5>
          <div className="flex gap-2">
            {data.map(x => x * 2).map((item, index) => (
              <div key={index} className="w-8 h-8 bg-green-100 border border-green-300 rounded flex items-center justify-center text-sm">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 bg-gray-50 rounded">
          <h5 className="font-medium mb-2">filter(x => x > 5)</h5>
          <div className="flex gap-2">
            {data.filter(x => x > 5).map((item, index) => (
              <div key={index} className="w-8 h-8 bg-yellow-100 border border-yellow-300 rounded flex items-center justify-center text-sm">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 bg-gray-50 rounded">
          <h5 className="font-medium mb-2">reduce((sum, x) => sum + x, 0)</h5>
          <div className="w-12 h-8 bg-purple-100 border border-purple-300 rounded flex items-center justify-center text-sm">
            {data.reduce((sum, x) => sum + x, 0)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4 flex-wrap">
        {Object.keys(concepts).map((concept) => (
          <Button
            key={concept}
            onClick={() => setSelectedConcept(concept as any)}
            variant={selectedConcept === concept ? 'default' : 'outline'}
          >
            {concepts[concept as keyof typeof concepts].title}
          </Button>
        ))}
      </div>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-2">
          {concepts[selectedConcept].title}
        </h3>
        <p className="text-gray-600 mb-4">
          {concepts[selectedConcept].description}
        </p>

        {selectedConcept === 'higher-order' ? (
          higherOrderDemo()
        ) : (
          <div className="space-y-4">
            {concepts[selectedConcept].examples.map((example, index) => (
              <Card key={index} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium">{example.type}</h5>
                  <Badge variant={
                    example.type === 'Pure' || example.type === 'Immutable' 
                      ? 'default' 
                      : 'secondary'
                  }>
                    {example.type === 'Pure' || example.type === 'Immutable' ? 'Good' : 
                     example.type === 'Impure' || example.type === 'Mutable' ? 'Avoid' : 'Example'}
                  </Badge>
                </div>
                <code className="block p-2 bg-gray-100 rounded text-sm mb-2">
                  {example.code}
                </code>
                <p className="text-sm text-gray-600">{example.explanation}</p>
              </Card>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-4">
        <h4 className="font-semibold mb-3">Functional Programming Benefits</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-green-600">Advantages</h5>
            <ul className="space-y-1 text-gray-600">
              <li>• Easier to test and debug</li>
              <li>• More predictable code</li>
              <li>• Better for parallel processing</li>
              <li>• Reduced complexity</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-blue-600">Key Principles</h5>
            <ul className="space-y-1 text-gray-600">
              <li>• Avoid state mutation</li>
              <li>• Use pure functions</li>
              <li>• Favor composition</li>
              <li>• Think in transformations</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default ProgrammingConceptsVisualizer

export {
  CallStackDemo,
  MemoryManagementDemo,
  AsyncProgrammingDemo,
  OOPConceptsDemo,
  FunctionalProgrammingDemo
}
