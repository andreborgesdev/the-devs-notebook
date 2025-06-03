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
import { Progress } from "@/src/components/ui/progress";
import {
  CheckCircle,
  XCircle,
  HelpCircle,
  RotateCcw,
  Trophy,
  Target,
  Brain,
} from "lucide-react";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  codeExample?: string;
}

interface QuizVisualizerProps {
  title?: string;
  description?: string;
  className?: string;
  height?: number;
  questions: QuizQuestion[];
  timeLimit?: number;
}

interface QuizState {
  currentQuestion: number;
  selectedAnswer: number | null;
  answers: (number | null)[];
  showExplanation: boolean;
  isComplete: boolean;
  score: number;
  startTime: number;
  timeRemaining: number;
}

export function QuizVisualizer({
  title,
  description,
  className,
  height = 600,
  questions,
  timeLimit,
}: QuizVisualizerProps) {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    selectedAnswer: null,
    answers: new Array(questions.length).fill(null),
    showExplanation: false,
    isComplete: false,
    score: 0,
    startTime: 0,
    timeRemaining: timeLimit || 0,
  });

  useEffect(() => {
    setQuizState((prev) => ({
      ...prev,
      startTime: Date.now(),
    }));
  }, []);

  const currentQ = questions[quizState.currentQuestion];
  const isLastQuestion = quizState.currentQuestion === questions.length - 1;
  const progress = ((quizState.currentQuestion + 1) / questions.length) * 100;

  useEffect(() => {
    if (timeLimit && !quizState.isComplete) {
      const timer = setInterval(() => {
        setQuizState((prev) => {
          if (prev.timeRemaining <= 1) {
            return { ...prev, timeRemaining: 0, isComplete: true };
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLimit, quizState.isComplete]);

  const selectAnswer = (answerIndex: number) => {
    setQuizState((prev) => ({
      ...prev,
      selectedAnswer: answerIndex,
    }));
  };

  const submitAnswer = () => {
    if (quizState.selectedAnswer === null) return;

    const newAnswers = [...quizState.answers];
    newAnswers[quizState.currentQuestion] = quizState.selectedAnswer;

    setQuizState((prev) => ({
      ...prev,
      answers: newAnswers,
      showExplanation: true,
    }));
  };

  const nextQuestion = () => {
    if (isLastQuestion) {
      finishQuiz();
    } else {
      setQuizState((prev) => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        selectedAnswer: prev.answers[prev.currentQuestion + 1],
        showExplanation: false,
      }));
    }
  };

  const previousQuestion = () => {
    if (quizState.currentQuestion > 0) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestion: prev.currentQuestion - 1,
        selectedAnswer: prev.answers[prev.currentQuestion - 1],
        showExplanation: false,
      }));
    }
  };

  const finishQuiz = () => {
    const score = quizState.answers.reduce((acc, answer, index) => {
      return acc + (answer === questions[index].correctAnswer ? 1 : 0);
    }, 0);

    setQuizState((prev) => ({
      ...prev,
      isComplete: true,
      score,
    }));
  };

  const resetQuiz = () => {
    setQuizState({
      currentQuestion: 0,
      selectedAnswer: null,
      answers: new Array(questions.length).fill(null),
      showExplanation: false,
      isComplete: false,
      score: 0,
      startTime: Date.now(),
      timeRemaining: timeLimit || 0,
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getScoreColor = () => {
    const percentage = (quizState.score / questions.length) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (quizState.isComplete) {
    const percentage = Math.round((quizState.score / questions.length) * 100);

    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Trophy className="h-16 w-16 text-yellow-500" />
          </div>
          <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-4">
            <div className={cn("text-4xl font-bold", getScoreColor())}>
              {quizState.score}/{questions.length}
            </div>
            <div className="text-lg text-gray-600">{percentage}% Correct</div>

            <Progress value={percentage} className="w-full" />

            <div className="flex justify-center gap-4 text-sm text-gray-600">
              <div>Questions: {questions.length}</div>
              {timeLimit && (
                <div>
                  Time: {formatTime(timeLimit - quizState.timeRemaining)}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {
                  quizState.answers.filter(
                    (answer, i) => answer === questions[i].correctAnswer
                  ).length
                }
              </div>
              <div className="text-sm text-green-700">Correct</div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {
                  quizState.answers.filter(
                    (answer, i) =>
                      answer !== null && answer !== questions[i].correctAnswer
                  ).length
                }
              </div>
              <div className="text-sm text-red-700">Incorrect</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">
                {quizState.answers.filter((answer) => answer === null).length}
              </div>
              <div className="text-sm text-gray-700">Skipped</div>
            </div>
          </div>

          <Button onClick={resetQuiz} className="mt-6">
            <RotateCcw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

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
            {timeLimit && (
              <Badge variant="outline" className="text-lg px-3 py-1">
                ⏰ {formatTime(quizState.timeRemaining)}
              </Badge>
            )}
          </div>
        </CardHeader>
      )}
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge variant="secondary">
              Question {quizState.currentQuestion + 1} of {questions.length}
            </Badge>
            <Badge className={getDifficultyColor(currentQ.difficulty)}>
              {currentQ.difficulty}
            </Badge>
            <Badge variant="outline">{currentQ.category}</Badge>
          </div>
          <div className="text-sm text-gray-500">
            Progress: {Math.round(progress)}%
          </div>
        </div>

        <Progress value={progress} className="w-full" />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold leading-relaxed">
            {currentQ.question}
          </h3>

          {currentQ.codeExample && (
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm">
                <code>{currentQ.codeExample}</code>
              </pre>
            </div>
          )}

          <div className="space-y-3">
            {currentQ.options.map((option, index) => {
              const isSelected = quizState.selectedAnswer === index;
              const isCorrect = index === currentQ.correctAnswer;
              const isWrong =
                quizState.showExplanation && isSelected && !isCorrect;
              const showCorrect = quizState.showExplanation && isCorrect;

              return (
                <button
                  key={index}
                  onClick={() =>
                    !quizState.showExplanation && selectAnswer(index)
                  }
                  disabled={quizState.showExplanation}
                  className={cn(
                    "w-full p-4 text-left border-2 rounded-lg transition-all duration-200",
                    "hover:border-blue-300 hover:bg-blue-50",
                    isSelected &&
                      !quizState.showExplanation &&
                      "border-blue-500 bg-blue-50",
                    showCorrect && "border-green-500 bg-green-50",
                    isWrong && "border-red-500 bg-red-50",
                    quizState.showExplanation && "cursor-not-allowed"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex-1">{option}</span>
                    {quizState.showExplanation && (
                      <div className="ml-2">
                        {showCorrect && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                        {isWrong && (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {quizState.showExplanation && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <HelpCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">
                    Explanation
                  </h4>
                  <p className="text-blue-700 text-sm">
                    {currentQ.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={previousQuestion}
            disabled={quizState.currentQuestion === 0}
          >
            Previous
          </Button>

          <div className="flex gap-2">
            {!quizState.showExplanation ? (
              <Button
                onClick={submitAnswer}
                disabled={quizState.selectedAnswer === null}
              >
                Submit Answer
              </Button>
            ) : (
              <Button onClick={nextQuestion}>
                {isLastQuestion ? "Finish Quiz" : "Next Question"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function JavaScriptQuizDemo({ className }: { className?: string }) {
  const questions: QuizQuestion[] = [
    {
      id: "js1",
      question: "What will this code output?",
      options: ["undefined", "null", "0", "ReferenceError"],
      correctAnswer: 0,
      explanation:
        "Variables declared with 'var' are hoisted and initialized with 'undefined'.",
      difficulty: "medium",
      category: "JavaScript",
      codeExample: `console.log(x);
var x = 5;`,
    },
    {
      id: "js2",
      question: "Which method adds an element to the end of an array?",
      options: ["push()", "pop()", "shift()", "unshift()"],
      correctAnswer: 0,
      explanation:
        "push() adds elements to the end of an array and returns the new length.",
      difficulty: "easy",
      category: "JavaScript",
    },
    {
      id: "js3",
      question: "What is the result of '3' + 2 in JavaScript?",
      options: ["5", "'32'", "NaN", "TypeError"],
      correctAnswer: 1,
      explanation:
        "JavaScript performs string concatenation when one operand is a string.",
      difficulty: "easy",
      category: "JavaScript",
    },
    {
      id: "js4",
      question: "What will this arrow function return?",
      options: ["undefined", "5", "function", "Error"],
      correctAnswer: 1,
      explanation:
        "Arrow functions with a single expression return that expression implicitly.",
      difficulty: "medium",
      category: "JavaScript",
      codeExample: `const add = x => x + 2;
console.log(add(3));`,
    },
  ];

  return (
    <QuizVisualizer
      title="JavaScript Knowledge Quiz"
      description="Test your JavaScript fundamentals with interactive questions"
      className={className}
      height={600}
      questions={questions}
      timeLimit={300}
    />
  );
}

export function JavaQuizDemo({ className }: { className?: string }) {
  const questions: QuizQuestion[] = [
    {
      id: "java1",
      question: "Which of these is NOT a pillar of OOP?",
      options: ["Encapsulation", "Inheritance", "Compilation", "Polymorphism"],
      correctAnswer: 2,
      explanation:
        "The four pillars of OOP are Encapsulation, Inheritance, Polymorphism, and Abstraction.",
      difficulty: "easy",
      category: "Java OOP",
    },
    {
      id: "java2",
      question: "What is the time complexity of HashMap.get()?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      correctAnswer: 0,
      explanation:
        "HashMap provides O(1) average time complexity for get operations due to hashing.",
      difficulty: "medium",
      category: "Java Collections",
    },
    {
      id: "java3",
      question: "What will this code print?",
      options: ["Child", "Parent", "Compilation Error", "Runtime Error"],
      correctAnswer: 0,
      explanation:
        "Method overriding: the child class method is called at runtime (dynamic binding).",
      difficulty: "hard",
      category: "Java OOP",
      codeExample: `class Parent {
    void display() { System.out.println("Parent"); }
}
class Child extends Parent {
    void display() { System.out.println("Child"); }
}
Parent p = new Child();
p.display();`,
    },
    {
      id: "java4",
      question: "Which collection allows duplicate elements?",
      options: ["Set", "List", "Map keys", "All of the above"],
      correctAnswer: 1,
      explanation:
        "List interface allows duplicate elements, while Set does not allow duplicates.",
      difficulty: "easy",
      category: "Java Collections",
    },
  ];

  return (
    <QuizVisualizer
      title="Java Programming Quiz"
      description="Challenge your Java knowledge with OOP and Collections questions"
      className={className}
      height={600}
      questions={questions}
      timeLimit={400}
    />
  );
}

export function SystemDesignQuizDemo({ className }: { className?: string }) {
  const questions: QuizQuestion[] = [
    {
      id: "sd1",
      question: "What does CAP theorem stand for?",
      options: [
        "Consistency, Availability, Performance",
        "Consistency, Availability, Partition Tolerance",
        "Caching, API, Performance",
        "Concurrency, Atomicity, Persistence",
      ],
      correctAnswer: 1,
      explanation:
        "CAP theorem states you can only guarantee two out of three: Consistency, Availability, and Partition Tolerance.",
      difficulty: "medium",
      category: "System Design",
    },
    {
      id: "sd2",
      question: "Which is NOT a benefit of microservices?",
      options: [
        "Independent deployment",
        "Technology diversity",
        "Reduced complexity",
        "Team autonomy",
      ],
      correctAnswer: 2,
      explanation:
        "Microservices actually increase overall system complexity, though they reduce individual service complexity.",
      difficulty: "medium",
      category: "System Design",
    },
    {
      id: "sd3",
      question: "What is the primary purpose of a load balancer?",
      options: [
        "Data storage",
        "Request routing and distribution",
        "Authentication",
        "Data encryption",
      ],
      correctAnswer: 1,
      explanation:
        "Load balancers distribute incoming requests across multiple servers to improve performance and availability.",
      difficulty: "easy",
      category: "System Design",
    },
    {
      id: "sd4",
      question:
        "Which caching strategy writes to cache and database simultaneously?",
      options: [
        "Cache-aside",
        "Write-through",
        "Write-behind",
        "Refresh-ahead",
      ],
      correctAnswer: 1,
      explanation:
        "Write-through caching writes data to both cache and database at the same time, ensuring consistency.",
      difficulty: "hard",
      category: "System Design",
    },
  ];

  return (
    <QuizVisualizer
      title="System Design Quiz"
      description="Test your understanding of distributed systems and architecture patterns"
      className={className}
      height={600}
      questions={questions}
      timeLimit={250}
    />
  );
}
