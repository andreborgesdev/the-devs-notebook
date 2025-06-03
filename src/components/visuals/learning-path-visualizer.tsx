"use client";

import React, { useState, useEffect, useCallback } from "react";
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
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Play,
  Pause,
  RotateCcw,
  Book,
  Clock,
  Target,
  Trophy,
  AlertCircle,
} from "lucide-react";

interface LearningPath {
  id: string;
  title: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: string;
  steps: LearningStep[];
  currentStep: number;
  completed: boolean;
}

interface LearningStep {
  id: string;
  title: string;
  type: "concept" | "practice" | "quiz" | "project";
  content: string;
  duration: number;
  completed: boolean;
  prerequisites?: string[];
}

interface StudySession {
  id: string;
  subject: string;
  startTime: number;
  duration: number;
  active: boolean;
  breaks: number[];
}

interface FlashCard {
  id: string;
  question: string;
  answer: string;
  category: string;
  difficulty: number;
  lastReviewed?: number;
  reviewCount: number;
  confidence: number;
}

const LearningPathVisualizer: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Book className="w-5 h-5" />
          Learning Path Visualizer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="paths" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="paths">Learning Paths</TabsTrigger>
            <TabsTrigger value="study">Study Timer</TabsTrigger>
            <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="paths">
            <LearningPathsDemo />
          </TabsContent>

          <TabsContent value="study">
            <StudyTimerDemo />
          </TabsContent>

          <TabsContent value="flashcards">
            <FlashcardsDemo />
          </TabsContent>

          <TabsContent value="progress">
            <ProgressTrackingDemo />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const LearningPathsDemo: React.FC = () => {
  const [selectedPath, setSelectedPath] = useState<string>(
    "javascript-fundamentals"
  );
  const [paths, setPaths] = useState<LearningPath[]>([
    {
      id: "javascript-fundamentals",
      title: "JavaScript Fundamentals",
      difficulty: "beginner",
      duration: "4 weeks",
      currentStep: 2,
      completed: false,
      steps: [
        {
          id: "variables",
          title: "Variables and Data Types",
          type: "concept",
          content: "Learn about let, const, var and primitive data types",
          duration: 30,
          completed: true,
        },
        {
          id: "functions",
          title: "Functions",
          type: "concept",
          content: "Function declarations, expressions, and arrow functions",
          duration: 45,
          completed: true,
        },
        {
          id: "arrays",
          title: "Arrays and Objects",
          type: "practice",
          content: "Working with arrays and objects, methods and properties",
          duration: 60,
          completed: false,
        },
        {
          id: "control-flow",
          title: "Control Flow",
          type: "concept",
          content: "If statements, loops, and conditional logic",
          duration: 40,
          completed: false,
        },
        {
          id: "dom-manipulation",
          title: "DOM Manipulation",
          type: "practice",
          content: "Selecting and modifying HTML elements",
          duration: 90,
          completed: false,
        },
        {
          id: "final-project",
          title: "Build a Todo App",
          type: "project",
          content: "Apply all concepts to build a complete application",
          duration: 180,
          completed: false,
        },
      ],
    },
    {
      id: "react-basics",
      title: "React Basics",
      difficulty: "intermediate",
      duration: "6 weeks",
      currentStep: 0,
      completed: false,
      steps: [
        {
          id: "jsx",
          title: "JSX and Components",
          type: "concept",
          content: "Understanding JSX syntax and component structure",
          duration: 45,
          completed: false,
          prerequisites: ["javascript-fundamentals"],
        },
        {
          id: "props-state",
          title: "Props and State",
          type: "concept",
          content: "Component communication and state management",
          duration: 60,
          completed: false,
        },
        {
          id: "hooks",
          title: "React Hooks",
          type: "practice",
          content: "useState, useEffect, and custom hooks",
          duration: 90,
          completed: false,
        },
        {
          id: "routing",
          title: "React Router",
          type: "concept",
          content: "Client-side routing and navigation",
          duration: 75,
          completed: false,
        },
        {
          id: "react-project",
          title: "Build a Weather App",
          type: "project",
          content: "Create a multi-component React application",
          duration: 240,
          completed: false,
        },
      ],
    },
    {
      id: "data-structures",
      title: "Data Structures & Algorithms",
      difficulty: "advanced",
      duration: "8 weeks",
      currentStep: 1,
      completed: false,
      steps: [
        {
          id: "arrays-strings",
          title: "Arrays and Strings",
          type: "concept",
          content: "Array manipulation and string algorithms",
          duration: 60,
          completed: true,
        },
        {
          id: "linked-lists",
          title: "Linked Lists",
          type: "practice",
          content: "Singly and doubly linked lists implementation",
          duration: 90,
          completed: false,
        },
        {
          id: "stacks-queues",
          title: "Stacks and Queues",
          type: "concept",
          content: "LIFO and FIFO data structures",
          duration: 75,
          completed: false,
        },
        {
          id: "trees",
          title: "Trees and Graphs",
          type: "practice",
          content: "Binary trees, BSTs, and graph traversal",
          duration: 120,
          completed: false,
        },
        {
          id: "algorithms",
          title: "Sorting and Searching",
          type: "concept",
          content: "Common algorithms and their complexities",
          duration: 100,
          completed: false,
        },
        {
          id: "dsa-project",
          title: "Algorithm Visualizer",
          type: "project",
          content: "Build a tool to visualize algorithms",
          duration: 300,
          completed: false,
        },
      ],
    },
  ]);

  const currentPath = paths.find((p) => p.id === selectedPath);

  const completeStep = (stepId: string) => {
    setPaths((prev) =>
      prev.map((path) =>
        path.id === selectedPath
          ? {
              ...path,
              steps: path.steps.map((step) =>
                step.id === stepId ? { ...step, completed: true } : step
              ),
              currentStep: Math.min(
                path.currentStep + 1,
                path.steps.length - 1
              ),
            }
          : path
      )
    );
  };

  const resetPath = () => {
    setPaths((prev) =>
      prev.map((path) =>
        path.id === selectedPath
          ? {
              ...path,
              currentStep: 0,
              completed: false,
              steps: path.steps.map((step) => ({ ...step, completed: false })),
            }
          : path
      )
    );
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case "concept":
        return <Book className="w-4 h-4" />;
      case "practice":
        return <Target className="w-4 h-4" />;
      case "quiz":
        return <AlertCircle className="w-4 h-4" />;
      case "project":
        return <Trophy className="w-4 h-4" />;
      default:
        return <Book className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500";
      case "intermediate":
        return "bg-yellow-500";
      case "advanced":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 flex-wrap">
        {paths.map((path) => (
          <Button
            key={path.id}
            onClick={() => setSelectedPath(path.id)}
            variant={selectedPath === path.id ? "default" : "outline"}
            className="flex items-center gap-2"
          >
            <div
              className={`w-2 h-2 rounded-full ${getDifficultyColor(
                path.difficulty
              )}`}
            ></div>
            {path.title}
          </Button>
        ))}
      </div>

      {currentPath && (
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Card className="p-4 mb-4">
              <h3 className="text-lg font-semibold mb-2">
                {currentPath.title}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <Badge variant="outline">{currentPath.difficulty}</Badge>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {currentPath.duration}
                </span>
                <span>
                  {currentPath.steps.filter((s) => s.completed).length}/
                  {currentPath.steps.length} completed
                </span>
              </div>

              <div className="mt-4">
                <Progress
                  value={
                    (currentPath.steps.filter((s) => s.completed).length /
                      currentPath.steps.length) *
                    100
                  }
                />
              </div>
            </Card>

            <div className="flex gap-2 mb-4">
              <Button onClick={resetPath} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Path
              </Button>
            </div>

            <div className="space-y-2">
              {currentPath.steps.map((step, index) => (
                <Card
                  key={step.id}
                  className={`p-4 transition-all ${
                    step.completed
                      ? "border-green-500 bg-green-50"
                      : index === currentPath.currentStep
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded ${
                          step.completed
                            ? "bg-green-500 text-white"
                            : index === currentPath.currentStep
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {getStepIcon(step.type)}
                      </div>
                      <div>
                        <h4 className="font-semibold">{step.title}</h4>
                        <p className="text-sm text-gray-600">{step.content}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">{step.type}</Badge>
                          <span className="text-xs text-gray-500">
                            {step.duration} min
                          </span>
                        </div>
                      </div>
                    </div>

                    {!step.completed && index <= currentPath.currentStep && (
                      <Button size="sm" onClick={() => completeStep(step.id)}>
                        Complete
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">
              Learning Path Visualization
            </h3>
            <Card className="p-6">
              <svg width="300" height="400" viewBox="0 0 300 400">
                {currentPath.steps.map((step, index) => {
                  const y = 50 + index * 60;
                  const isCompleted = step.completed;
                  const isCurrent = index === currentPath.currentStep;

                  return (
                    <g key={step.id}>
                      {index > 0 && (
                        <line
                          x1="150"
                          y1={y - 60 + 25}
                          x2="150"
                          y2={y - 5}
                          stroke={
                            isCompleted || index <= currentPath.currentStep
                              ? "#3b82f6"
                              : "#d1d5db"
                          }
                          strokeWidth="3"
                        />
                      )}

                      <circle
                        cx="150"
                        cy={y}
                        r="20"
                        fill={
                          isCompleted
                            ? "#10b981"
                            : isCurrent
                            ? "#3b82f6"
                            : "#e5e7eb"
                        }
                        stroke="#374151"
                        strokeWidth="2"
                      />

                      <text
                        x="150"
                        y={y + 5}
                        textAnchor="middle"
                        className="text-xs font-semibold fill-white"
                      >
                        {index + 1}
                      </text>

                      <text x="180" y={y - 5} className="text-sm font-medium">
                        {step.title}
                      </text>

                      <text
                        x="180"
                        y={y + 10}
                        className="text-xs fill-gray-500"
                      >
                        {step.type} • {step.duration}min
                      </text>
                    </g>
                  );
                })}
              </svg>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

const StudyTimerDemo: React.FC = () => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [currentSession, setCurrentSession] = useState<StudySession | null>(
    null
  );
  const [timerMode, setTimerMode] = useState<"pomodoro" | "custom">("pomodoro");
  const [customDuration, setCustomDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [subject, setSubject] = useState("");

  const pomodoroSettings = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (currentSession) {
        setSessions((prev) => [...prev, { ...currentSession, active: false }]);
        setCurrentSession(null);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, currentSession]);

  const startSession = () => {
    if (!subject.trim()) return;

    const duration =
      timerMode === "pomodoro" ? pomodoroSettings.work : customDuration * 60;
    setTimeLeft(duration);

    const session: StudySession = {
      id: Math.random().toString(36),
      subject: subject.trim(),
      startTime: Date.now(),
      duration,
      active: true,
      breaks: [],
    };

    setCurrentSession(session);
    setIsRunning(true);
  };

  const pauseSession = () => {
    setIsRunning(!isRunning);
  };

  const stopSession = () => {
    if (currentSession) {
      setSessions((prev) => [...prev, { ...currentSession, active: false }]);
      setCurrentSession(null);
    }
    setIsRunning(false);
    setTimeLeft(
      timerMode === "pomodoro" ? pomodoroSettings.work : customDuration * 60
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getTotalStudyTime = () => {
    return sessions.reduce((total, session) => total + session.duration, 0);
  };

  const getSessionsBySubject = () => {
    const grouped = sessions.reduce((acc, session) => {
      acc[session.subject] = (acc[session.subject] || 0) + session.duration;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped).map(([subject, duration]) => ({
      subject,
      duration,
      percentage: (duration / getTotalStudyTime()) * 100,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Study Timer</h3>

          <div className="space-y-4">
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="What are you studying?"
              />
            </div>

            <div>
              <Label>Timer Mode</Label>
              <Select
                value={timerMode}
                onValueChange={(value: any) => setTimerMode(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pomodoro">Pomodoro (25 min)</SelectItem>
                  <SelectItem value="custom">Custom Duration</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {timerMode === "custom" && (
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={customDuration}
                  onChange={(e) => setCustomDuration(Number(e.target.value))}
                  min="1"
                  max="120"
                />
              </div>
            )}

            <div className="text-center">
              <div className="text-6xl font-mono font-bold mb-4">
                {formatTime(timeLeft)}
              </div>

              <div className="mb-4">
                <Progress
                  value={
                    (((timerMode === "pomodoro"
                      ? pomodoroSettings.work
                      : customDuration * 60) -
                      timeLeft) /
                      (timerMode === "pomodoro"
                        ? pomodoroSettings.work
                        : customDuration * 60)) *
                    100
                  }
                />
              </div>

              <div className="flex gap-2 justify-center">
                {!currentSession ? (
                  <Button onClick={startSession} disabled={!subject.trim()}>
                    <Play className="w-4 h-4 mr-2" />
                    Start
                  </Button>
                ) : (
                  <>
                    <Button onClick={pauseSession}>
                      {isRunning ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                    <Button onClick={stopSession} variant="outline">
                      Stop
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Study Statistics</h3>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {sessions.length}
                </div>
                <div className="text-sm text-gray-600">Sessions</div>
              </Card>

              <Card className="p-3 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.floor(getTotalStudyTime() / 60)}m
                </div>
                <div className="text-sm text-gray-600">Total Time</div>
              </Card>
            </div>

            <div>
              <h4 className="font-medium mb-2">Time by Subject</h4>
              <div className="space-y-2">
                {getSessionsBySubject().map((item) => (
                  <div key={item.subject} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{item.subject}</span>
                      <span>{Math.floor(item.duration / 60)}m</span>
                    </div>
                    <Progress value={item.percentage} />
                  </div>
                ))}
              </div>
            </div>

            {currentSession && (
              <Card className="p-3 bg-blue-50">
                <h4 className="font-medium text-blue-800">Current Session</h4>
                <p className="text-sm text-blue-600">
                  {currentSession.subject}
                </p>
                <p className="text-xs text-blue-500">
                  Started{" "}
                  {new Date(currentSession.startTime).toLocaleTimeString()}
                </p>
              </Card>
            )}
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Recent Sessions</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No study sessions yet
            </div>
          ) : (
            sessions
              .slice(-10)
              .reverse()
              .map((session) => (
                <div
                  key={session.id}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded"
                >
                  <div>
                    <span className="font-medium">{session.subject}</span>
                    <span className="text-sm text-gray-600 ml-2">
                      {new Date(session.startTime).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {Math.floor(session.duration / 60)} minutes
                  </div>
                </div>
              ))
          )}
        </div>
      </Card>
    </div>
  );
};

const FlashcardsDemo: React.FC = () => {
  const [flashcards, setFlashcards] = useState<FlashCard[]>([
    {
      id: "1",
      question: "What is closure in JavaScript?",
      answer:
        "A closure is a function that has access to variables from an outer function scope even after the outer function has returned.",
      category: "JavaScript",
      difficulty: 3,
      reviewCount: 0,
      confidence: 0,
    },
    {
      id: "2",
      question: "What is the time complexity of binary search?",
      answer:
        "O(log n) - Binary search eliminates half of the remaining elements with each comparison.",
      category: "Algorithms",
      difficulty: 2,
      reviewCount: 0,
      confidence: 0,
    },
    {
      id: "3",
      question: "What is the difference between == and === in JavaScript?",
      answer:
        "== performs type coercion before comparison, while === performs strict equality comparison without type conversion.",
      category: "JavaScript",
      difficulty: 1,
      reviewCount: 0,
      confidence: 0,
    },
    {
      id: "4",
      question: "What is a React Hook?",
      answer:
        "Hooks are functions that let you use state and other React features in functional components.",
      category: "React",
      difficulty: 2,
      reviewCount: 0,
      confidence: 0,
    },
  ]);

  const [currentCard, setCurrentCard] = useState<FlashCard | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studyMode, setStudyMode] = useState<"all" | "category">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const categories = [...new Set(flashcards.map((card) => card.category))];

  const getStudyCards = () => {
    let cards = flashcards;
    if (studyMode === "category" && selectedCategory) {
      cards = cards.filter((card) => card.category === selectedCategory);
    }
    return cards.sort((a, b) => a.confidence - b.confidence);
  };

  const startStudySession = () => {
    const cards = getStudyCards();
    if (cards.length > 0) {
      setCurrentCard(cards[0]);
      setShowAnswer(false);
    }
  };

  const nextCard = () => {
    const cards = getStudyCards();
    const currentIndex = cards.findIndex((card) => card.id === currentCard?.id);
    const nextIndex = (currentIndex + 1) % cards.length;
    setCurrentCard(cards[nextIndex]);
    setShowAnswer(false);
  };

  const rateCard = (difficulty: "easy" | "medium" | "hard") => {
    if (!currentCard) return;

    const confidenceChange = {
      easy: 1,
      medium: 0.5,
      hard: -0.5,
    };

    setFlashcards((prev) =>
      prev.map((card) =>
        card.id === currentCard.id
          ? {
              ...card,
              reviewCount: card.reviewCount + 1,
              confidence: Math.max(
                0,
                Math.min(5, card.confidence + confidenceChange[difficulty])
              ),
              lastReviewed: Date.now(),
            }
          : card
      )
    );

    nextCard();
  };

  const addNewCard = () => {
    const newCard: FlashCard = {
      id: Math.random().toString(36),
      question: "New question?",
      answer: "New answer",
      category: "General",
      difficulty: 2,
      reviewCount: 0,
      confidence: 0,
    };
    setFlashcards((prev) => [...prev, newCard]);
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 1) return "bg-green-500";
    if (difficulty <= 3) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 4) return "text-green-600";
    if (confidence >= 2) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Study Session</h3>

          <div className="space-y-4">
            <div>
              <Label>Study Mode</Label>
              <Select
                value={studyMode}
                onValueChange={(value: any) => setStudyMode(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cards</SelectItem>
                  <SelectItem value="category">By Category</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {studyMode === "category" && (
              <div>
                <Label>Category</Label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button onClick={startStudySession} className="w-full">
              <Play className="w-4 h-4 mr-2" />
              Start Study Session
            </Button>
          </div>

          {currentCard && (
            <div className="mt-6 p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <Badge variant="outline">{currentCard.category}</Badge>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${getDifficultyColor(
                      currentCard.difficulty
                    )}`}
                  ></div>
                  <span className="text-sm text-gray-600">
                    Difficulty {currentCard.difficulty}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold mb-2">Question:</h4>
                <p className="text-gray-700">{currentCard.question}</p>
              </div>

              {showAnswer ? (
                <div>
                  <h4 className="font-semibold mb-2">Answer:</h4>
                  <p className="text-gray-700 mb-4">{currentCard.answer}</p>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => rateCard("easy")}
                      variant="outline"
                      size="sm"
                    >
                      Easy
                    </Button>
                    <Button
                      onClick={() => rateCard("medium")}
                      variant="outline"
                      size="sm"
                    >
                      Medium
                    </Button>
                    <Button
                      onClick={() => rateCard("hard")}
                      variant="outline"
                      size="sm"
                    >
                      Hard
                    </Button>
                  </div>
                </div>
              ) : (
                <Button onClick={() => setShowAnswer(true)} className="w-full">
                  Show Answer
                </Button>
              )}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Flashcard Statistics</h3>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {flashcards.length}
                </div>
                <div className="text-sm text-gray-600">Total Cards</div>
              </Card>

              <Card className="p-3 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {flashcards.filter((card) => card.confidence >= 4).length}
                </div>
                <div className="text-sm text-gray-600">Mastered</div>
              </Card>
            </div>

            <div>
              <h4 className="font-medium mb-2">Cards by Category</h4>
              <div className="space-y-2">
                {categories.map((category) => {
                  const categoryCards = flashcards.filter(
                    (card) => card.category === category
                  );
                  const masteredCards = categoryCards.filter(
                    (card) => card.confidence >= 4
                  );

                  return (
                    <div key={category} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{category}</span>
                        <span>
                          {masteredCards.length}/{categoryCards.length}
                        </span>
                      </div>
                      <Progress
                        value={
                          (masteredCards.length / categoryCards.length) * 100
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <Button onClick={addNewCard} variant="outline" className="w-full">
              Add New Card
            </Button>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">All Flashcards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
          {flashcards.map((card) => (
            <Card key={card.id} className="p-3">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline">{card.category}</Badge>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${getDifficultyColor(
                      card.difficulty
                    )}`}
                  ></div>
                  <span
                    className={`text-sm font-medium ${getConfidenceColor(
                      card.confidence
                    )}`}
                  >
                    {card.confidence.toFixed(1)}
                  </span>
                </div>
              </div>
              <h4 className="font-medium text-sm mb-1">{card.question}</h4>
              <p className="text-xs text-gray-600">
                Reviewed {card.reviewCount} times
              </p>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};

const ProgressTrackingDemo: React.FC = () => {
  const [goals, setGoals] = useState([
    {
      id: "1",
      title: "Complete JavaScript Course",
      target: 100,
      current: 75,
      deadline: "2024-03-15",
      category: "Learning",
    },
    {
      id: "2",
      title: "Build 5 React Projects",
      target: 5,
      current: 3,
      deadline: "2024-04-01",
      category: "Projects",
    },
    {
      id: "3",
      title: "Study 200 Hours",
      target: 200,
      current: 145,
      deadline: "2024-05-01",
      category: "Study Time",
    },
  ]);

  const [achievements] = useState([
    {
      id: "1",
      title: "First Course Completed",
      description: "Completed your first learning path",
      earned: true,
    },
    {
      id: "2",
      title: "Study Streak",
      description: "7 days of consistent studying",
      earned: true,
    },
    {
      id: "3",
      title: "Flashcard Master",
      description: "Reviewed 100 flashcards",
      earned: false,
    },
    {
      id: "4",
      title: "Project Builder",
      description: "Built 10 projects",
      earned: false,
    },
  ]);

  const weeklyData = [
    { day: "Mon", hours: 2.5 },
    { day: "Tue", hours: 1.8 },
    { day: "Wed", hours: 3.2 },
    { day: "Thu", hours: 2.1 },
    { day: "Fri", hours: 1.5 },
    { day: "Sat", hours: 4.0 },
    { day: "Sun", hours: 2.8 },
  ];

  const updateGoalProgress = (goalId: string, increment: number) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              current: Math.min(goal.target, goal.current + increment),
            }
          : goal
      )
    );
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-green-500";
    if (percentage >= 70) return "bg-blue-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Learning Goals</h3>

          <div className="space-y-4">
            {goals.map((goal) => {
              const percentage = (goal.current / goal.target) * 100;
              const daysLeft = getDaysUntilDeadline(goal.deadline);

              return (
                <Card key={goal.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{goal.title}</h4>
                    <Badge variant="outline">{goal.category}</Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>
                        {goal.current} / {goal.target}
                      </span>
                      <span>{percentage.toFixed(0)}%</span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${getProgressColor(
                          percentage
                        )}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between text-xs text-gray-600">
                      <span>
                        Deadline: {new Date(goal.deadline).toLocaleDateString()}
                      </span>
                      <span className={daysLeft < 7 ? "text-red-600" : ""}>
                        {daysLeft > 0 ? `${daysLeft} days left` : "Overdue"}
                      </span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => updateGoalProgress(goal.id, 1)}
                    className="mt-2"
                    disabled={goal.current >= goal.target}
                  >
                    Update Progress
                  </Button>
                </Card>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Weekly Study Hours</h3>

          <div className="space-y-4">
            <div className="flex justify-between items-end h-32">
              {weeklyData.map((data, index) => (
                <div
                  key={data.day}
                  className="flex flex-col items-center gap-2"
                >
                  <div
                    className="w-8 bg-blue-500 rounded-t"
                    style={{ height: `${(data.hours / 4) * 100}%` }}
                  ></div>
                  <span className="text-xs">{data.day}</span>
                  <span className="text-xs text-gray-600">{data.hours}h</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <Card className="p-3 text-center">
                <div className="text-xl font-bold text-blue-600">
                  {weeklyData
                    .reduce((sum, day) => sum + day.hours, 0)
                    .toFixed(1)}
                  h
                </div>
                <div className="text-sm text-gray-600">This Week</div>
              </Card>

              <Card className="p-3 text-center">
                <div className="text-xl font-bold text-green-600">
                  {(
                    weeklyData.reduce((sum, day) => sum + day.hours, 0) / 7
                  ).toFixed(1)}
                  h
                </div>
                <div className="text-sm text-gray-600">Daily Average</div>
              </Card>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Achievements</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((achievement) => (
            <Card
              key={achievement.id}
              className={`p-4 text-center transition-all ${
                achievement.earned
                  ? "border-yellow-500 bg-yellow-50"
                  : "border-gray-200 bg-gray-50 opacity-60"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  achievement.earned
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-300 text-gray-500"
                }`}
              >
                <Trophy className="w-6 h-6" />
              </div>
              <h4 className="font-medium text-sm mb-1">{achievement.title}</h4>
              <p className="text-xs text-gray-600">{achievement.description}</p>
              {achievement.earned && (
                <Badge variant="outline" className="mt-2">
                  Earned
                </Badge>
              )}
            </Card>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Learning Insights</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <h4 className="font-medium text-green-600 mb-2">Strengths</h4>
            <ul className="text-sm space-y-1">
              <li>• Consistent daily study habits</li>
              <li>• Strong progress in JavaScript</li>
              <li>• Regular project completion</li>
            </ul>
          </Card>

          <Card className="p-4">
            <h4 className="font-medium text-yellow-600 mb-2">
              Areas to Improve
            </h4>
            <ul className="text-sm space-y-1">
              <li>• Increase flashcard review frequency</li>
              <li>• Focus more on algorithm practice</li>
              <li>• Set shorter-term milestones</li>
            </ul>
          </Card>

          <Card className="p-4">
            <h4 className="font-medium text-blue-600 mb-2">Recommendations</h4>
            <ul className="text-sm space-y-1">
              <li>• Join study groups for motivation</li>
              <li>• Practice coding challenges daily</li>
              <li>• Create a portfolio website</li>
            </ul>
          </Card>
        </div>
      </Card>
    </div>
  );
};

export default LearningPathVisualizer;

export {
  LearningPathsDemo,
  StudyTimerDemo,
  FlashcardsDemo,
  ProgressTrackingDemo,
};
