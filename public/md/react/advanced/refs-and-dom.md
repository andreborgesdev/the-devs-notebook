# React Refs and DOM Manipulation

Refs provide a way to access DOM nodes or React elements created in the render method. They offer an escape hatch to imperatively modify children outside of the typical React data flow.

## Understanding Refs

Refs serve as a bridge between React's declarative paradigm and imperative DOM operations, allowing direct access to DOM elements when necessary.

### When to Use Refs

```typescript
// Good use cases for refs
const ComponentWithRefs = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Focus management
  const focusInput = () => {
    inputRef.current?.focus();
  };

  // Canvas operations
  const drawOnCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.fillRect(0, 0, 100, 100);
    }
  };

  // Media control
  const playVideo = () => {
    videoRef.current?.play();
  };

  return (
    <div>
      <input ref={inputRef} type="text" />
      <canvas ref={canvasRef} width={200} height={200} />
      <video ref={videoRef} src="video.mp4" />

      <button onClick={focusInput}>Focus Input</button>
      <button onClick={drawOnCanvas}>Draw</button>
      <button onClick={playVideo}>Play Video</button>
    </div>
  );
};
```

### Avoiding Refs Anti-patterns

```typescript
// ❌ Don't use refs for data that can be state
const BadExample = () => {
  const countRef = useRef(0);

  const increment = () => {
    countRef.current += 1;
    // This won't trigger re-render
  };

  return <div>{countRef.current}</div>;
};

// ✅ Use state for data that affects rendering
const GoodExample = () => {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount((prev) => prev + 1);
  };

  return <div>{count}</div>;
};
```

## useRef Hook

The useRef hook creates a mutable ref object that persists for the full lifetime of the component.

### Basic useRef Usage

```typescript
interface TimerComponent {
  start: () => void;
  stop: () => void;
  reset: () => void;
}

const Timer: React.FC = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = () => {
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
  };

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
    }
  };

  const reset = () => {
    stop();
    setSeconds(0);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div>
      <div>Time: {seconds}s</div>
      <button onClick={start} disabled={isRunning}>
        Start
      </button>
      <button onClick={stop} disabled={!isRunning}>
        Stop
      </button>
      <button onClick={reset}>Reset</button>
    </div>
  );
};
```

### Storing Previous Values

```typescript
const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};

const CounterWithPrevious = () => {
  const [count, setCount] = useState(0);
  const previousCount = usePrevious(count);

  return (
    <div>
      <div>Current: {count}</div>
      <div>Previous: {previousCount ?? 'None'}</div>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
};
```

## createRef and Class Components

In class components, refs are created using createRef or callback refs.

### createRef in Class Components

```typescript
class ClassComponentWithRef extends React.Component {
  private inputRef = React.createRef<HTMLInputElement>();
  private scrollRef = React.createRef<HTMLDivElement>();

  componentDidMount() {
    this.inputRef.current?.focus();
  }

  scrollToTop = () => {
    this.scrollRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  render() {
    return (
      <div>
        <input ref={this.inputRef} type="text" />
        <div ref={this.scrollRef} style={{ height: 200, overflow: "auto" }}>
          {/* Long content */}
        </div>
        <button onClick={this.scrollToTop}>Scroll to Top</button>
      </div>
    );
  }
}
```

## Callback Refs

Callback refs provide more control over when refs are set and unset.

### Basic Callback Refs

```typescript
const CallbackRefExample = () => {
  const [node, setNode] = useState<HTMLDivElement | null>(null);

  const measuredRef = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      setNode(node);
      console.log("Element height:", node.getBoundingClientRect().height);
    }
  }, []);

  return (
    <div>
      <div ref={measuredRef}>This element's height is measured</div>
      {node && <div>Height: {node.getBoundingClientRect().height}px</div>}
    </div>
  );
};
```

### Dynamic Callback Refs

```typescript
interface ListItem {
  id: string;
  text: string;
}

const DynamicRefList = () => {
  const [items, setItems] = useState<ListItem[]>([
    { id: "1", text: "Item 1" },
    { id: "2", text: "Item 2" },
    { id: "3", text: "Item 3" },
  ]);

  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const setItemRef = useCallback((id: string) => {
    return (node: HTMLDivElement | null) => {
      if (node) {
        itemRefs.current.set(id, node);
      } else {
        itemRefs.current.delete(id);
      }
    };
  }, []);

  const scrollToItem = (id: string) => {
    const element = itemRefs.current.get(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <div style={{ height: 200, overflow: "auto" }}>
        {items.map((item) => (
          <div
            key={item.id}
            ref={setItemRef(item.id)}
            style={{ height: 100, border: "1px solid #ccc", margin: 10 }}
          >
            {item.text}
          </div>
        ))}
      </div>

      {items.map((item) => (
        <button key={item.id} onClick={() => scrollToItem(item.id)}>
          Scroll to {item.text}
        </button>
      ))}
    </div>
  );
};
```

## DOM Manipulation Patterns

### Focus Management

```typescript
const FocusManager = () => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [currentFocus, setCurrentFocus] = useState(0);

  const setInputRef = (index: number) => (el: HTMLInputElement | null) => {
    inputRefs.current[index] = el;
  };

  const focusNext = () => {
    const nextIndex = (currentFocus + 1) % 3;
    inputRefs.current[nextIndex]?.focus();
    setCurrentFocus(nextIndex);
  };

  const focusPrevious = () => {
    const prevIndex = currentFocus === 0 ? 2 : currentFocus - 1;
    inputRefs.current[prevIndex]?.focus();
    setCurrentFocus(prevIndex);
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <div>
      {[0, 1, 2].map((index) => (
        <input
          key={index}
          ref={setInputRef(index)}
          type="text"
          placeholder={`Input ${index + 1}`}
          onFocus={() => setCurrentFocus(index)}
        />
      ))}

      <div>
        <button onClick={focusPrevious}>Previous</button>
        <button onClick={focusNext}>Next</button>
      </div>
    </div>
  );
};
```

### Scroll Management

```typescript
const ScrollManager = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;

    setIsAtTop(scrollTop === 0);
    setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 1);
  }, []);

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToBottom = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <div>
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        style={{
          height: 200,
          overflow: "auto",
          border: "1px solid #ccc",
        }}
      >
        {Array.from({ length: 50 }, (_, i) => (
          <div key={i} style={{ padding: 10 }}>
            Item {i + 1}
          </div>
        ))}
      </div>

      <div>
        <button onClick={scrollToTop} disabled={isAtTop}>
          Scroll to Top
        </button>
        <button onClick={scrollToBottom} disabled={isAtBottom}>
          Scroll to Bottom
        </button>
      </div>
    </div>
  );
};
```

## Advanced Ref Patterns

### Ref Forwarding with Custom Hooks

```typescript
interface UseElementSizeReturn {
  ref: React.RefCallback<HTMLElement>;
  size: { width: number; height: number };
}

const useElementSize = (): UseElementSizeReturn => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const ref = useCallback((node: HTMLElement | null) => {
    if (node) {
      const resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) {
          setSize({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          });
        }
      });

      resizeObserver.observe(node);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, []);

  return { ref, size };
};

const ResizableComponent = () => {
  const { ref, size } = useElementSize();

  return (
    <div>
      <div
        ref={ref}
        style={{
          width: "50%",
          height: 200,
          backgroundColor: "#f0f0f0",
          resize: "both",
          overflow: "auto",
        }}
      >
        Resize me!
      </div>
      <div>
        Size: {size.width}x{size.height}
      </div>
    </div>
  );
};
```

### Imperative Handle

```typescript
interface VideoPlayerRef {
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  getCurrentTime: () => number;
}

interface VideoPlayerProps {
  src: string;
  onTimeUpdate?: (time: number) => void;
}

const VideoPlayer = React.forwardRef<VideoPlayerRef, VideoPlayerProps>(
  ({ src, onTimeUpdate }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useImperativeHandle(
      ref,
      () => ({
        play: () => {
          videoRef.current?.play();
        },
        pause: () => {
          videoRef.current?.pause();
        },
        seek: (time: number) => {
          if (videoRef.current) {
            videoRef.current.currentTime = time;
          }
        },
        getCurrentTime: () => {
          return videoRef.current?.currentTime ?? 0;
        },
      }),
      []
    );

    const handleTimeUpdate = () => {
      const currentTime = videoRef.current?.currentTime ?? 0;
      onTimeUpdate?.(currentTime);
    };

    return (
      <video
        ref={videoRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        controls
      />
    );
  }
);

const VideoControls = () => {
  const videoRef = useRef<VideoPlayerRef>(null);
  const [currentTime, setCurrentTime] = useState(0);

  const handlePlay = () => {
    videoRef.current?.play();
  };

  const handlePause = () => {
    videoRef.current?.pause();
  };

  const handleSeek = (time: number) => {
    videoRef.current?.seek(time);
  };

  return (
    <div>
      <VideoPlayer
        ref={videoRef}
        src="video.mp4"
        onTimeUpdate={setCurrentTime}
      />

      <div>Current Time: {currentTime.toFixed(2)}s</div>

      <div>
        <button onClick={handlePlay}>Play</button>
        <button onClick={handlePause}>Pause</button>
        <button onClick={() => handleSeek(30)}>Seek to 30s</button>
      </div>
    </div>
  );
};
```

## Performance Considerations

### Avoiding Unnecessary Re-renders

```typescript
const ExpensiveComponent = React.memo(({ data }: { data: string[] }) => {
  console.log("ExpensiveComponent rendered");

  return (
    <div>
      {data.map((item, index) => (
        <div key={index}>{item}</div>
      ))}
    </div>
  );
});

const ParentWithRefs = () => {
  const [count, setCount] = useState(0);
  const expensiveRef = useRef<HTMLDivElement>(null);

  // This won't cause re-render
  const updateRefValue = () => {
    if (expensiveRef.current) {
      expensiveRef.current.style.backgroundColor =
        count % 2 === 0 ? "red" : "blue";
    }
  };

  const data = useMemo(() => ["item1", "item2", "item3"], []);

  return (
    <div>
      <div>Count: {count}</div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={updateRefValue}>Change Color</button>

      <div ref={expensiveRef}>
        <ExpensiveComponent data={data} />
      </div>
    </div>
  );
};
```

### Cleanup with Refs

```typescript
const ComponentWithCleanup = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, []);

  return (
    <div>
      <div style={{ height: "150vh" }}>Scroll down</div>
      <div
        ref={elementRef}
        style={{
          height: 100,
          backgroundColor: isVisible ? "green" : "red",
        }}
      >
        {isVisible ? "Visible" : "Not Visible"}
      </div>
    </div>
  );
};
```

## Testing Refs

### Testing Components with Refs

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "@testing-library/react";

const FocusableInput = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    inputRef.current?.focus();
  };

  return (
    <div>
      <input ref={inputRef} data-testid="input" />
      <button onClick={handleFocus} data-testid="focus-button">
        Focus Input
      </button>
    </div>
  );
};

describe("FocusableInput", () => {
  it("should focus input when button is clicked", () => {
    render(<FocusableInput />);

    const input = screen.getByTestId("input");
    const button = screen.getByTestId("focus-button");

    expect(input).not.toHaveFocus();

    fireEvent.click(button);

    expect(input).toHaveFocus();
  });
});
```

### Testing Imperative Handles

```typescript
const TestableComponent = React.forwardRef<
  { getValue: () => string },
  { initialValue: string }
>(({ initialValue }, ref) => {
  const [value, setValue] = useState(initialValue);

  useImperativeHandle(
    ref,
    () => ({
      getValue: () => value,
    }),
    [value]
  );

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      data-testid="input"
    />
  );
});

describe("TestableComponent", () => {
  it("should expose getValue method through ref", () => {
    const ref = React.createRef<{ getValue: () => string }>();

    render(<TestableComponent ref={ref} initialValue="test" />);

    expect(ref.current?.getValue()).toBe("test");

    const input = screen.getByTestId("input");
    fireEvent.change(input, { target: { value: "updated" } });

    expect(ref.current?.getValue()).toBe("updated");
  });
});
```

## Best Practices

### Do's and Don'ts

```typescript
// ✅ Good: Using refs for DOM access
const GoodRefUsage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      // Imperative canvas operations
    }
  };

  return <canvas ref={canvasRef} onClick={draw} />;
};

// ❌ Bad: Using refs for state
const BadRefUsage = () => {
  const countRef = useRef(0);

  const increment = () => {
    countRef.current += 1;
    // This won't trigger re-render!
  };

  return <div>{countRef.current}</div>;
};

// ✅ Good: Proper cleanup
const GoodCleanup = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      console.log("tick");
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return <div>Timer running</div>;
};
```

## Common Interview Questions

### Basic Questions

**Q: What are refs in React and when should you use them?**

Refs provide a way to access DOM nodes or React elements directly. Use them for:

- Managing focus, text selection, or media playback
- Triggering imperative animations
- Integrating with third-party DOM libraries
- Storing mutable values that don't cause re-renders

**Q: What's the difference between useRef and createRef?**

- `useRef` is for functional components and persists the same ref object across re-renders
- `createRef` is for class components and creates a new ref object on each render
- `useRef` can also store mutable values that persist across renders

**Q: How do you access a DOM element using refs?**

```typescript
const MyComponent = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    inputRef.current?.focus(); // Access DOM element
  };

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>Focus</button>
    </div>
  );
};
```

### Intermediate Questions

**Q: What are callback refs and when would you use them?**

Callback refs are functions that receive the DOM element as an argument. They're useful when you need more control over when the ref is set:

```typescript
const CallbackRefExample = () => {
  const [height, setHeight] = useState(0);

  const measuredRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);

  return <div ref={measuredRef}>Measured content</div>;
};
```

**Q: How do you forward refs in React?**

Use `React.forwardRef` to pass refs through components:

```typescript
const FancyButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => (
    <button ref={ref} className="fancy-button" {...props}>
      {children}
    </button>
  )
);
```

**Q: What's useImperativeHandle and when would you use it?**

`useImperativeHandle` customizes the instance value exposed to parent components when using ref. It's useful for exposing imperative methods:

```typescript
const VideoPlayer = React.forwardRef<VideoRef, VideoProps>((props, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useImperativeHandle(ref, () => ({
    play: () => videoRef.current?.play(),
    pause: () => videoRef.current?.pause(),
  }));

  return <video ref={videoRef} {...props} />;
});
```

### Advanced Questions

**Q: How do you handle refs with dynamic lists?**

Use a Map or callback pattern to manage multiple refs:

```typescript
const DynamicList = ({ items }: { items: Item[] }) => {
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const setItemRef = (id: string) => (node: HTMLDivElement | null) => {
    if (node) {
      itemRefs.current.set(id, node);
    } else {
      itemRefs.current.delete(id);
    }
  };

  return (
    <div>
      {items.map((item) => (
        <div key={item.id} ref={setItemRef(item.id)}>
          {item.content}
        </div>
      ))}
    </div>
  );
};
```

**Q: How do you test components that use refs?**

Focus on testing the behavior rather than the ref itself:

```typescript
import { render, screen, fireEvent } from "@testing-library/react";

test("should focus input when button clicked", () => {
  render(<FocusableComponent />);

  const input = screen.getByRole("textbox");
  const button = screen.getByRole("button");

  expect(input).not.toHaveFocus();
  fireEvent.click(button);
  expect(input).toHaveFocus();
});
```

**Q: What are the performance implications of using refs?**

- Refs don't cause re-renders when their values change
- They're useful for storing mutable values without triggering updates
- Overusing refs can make components harder to test and reason about
- Always clean up subscriptions and intervals stored in refs

These patterns and practices ensure effective and safe usage of refs in React applications, providing the necessary escape hatch for imperative operations while maintaining React's declarative nature.
