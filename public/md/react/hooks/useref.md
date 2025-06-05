# React useRef Hook

## Overview

The `useRef` hook returns a mutable ref object whose `.current` property is initialized to the passed argument. The returned object persists throughout the component's lifetime and doesn't trigger re-renders when mutated.

## Basic Syntax

```javascript
const refContainer = useRef(initialValue);
```

## DOM Element Access

```javascript
import React, { useRef, useEffect } from "react";

function FocusInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div>
      <input ref={inputRef} type="text" placeholder="I will be focused" />
      <button onClick={handleClick}>Focus Input</button>
    </div>
  );
}
```

## Storing Previous Values

```javascript
import React, { useState, useRef, useEffect } from "react";

function PreviousValue() {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef();

  useEffect(() => {
    prevCountRef.current = count;
  });

  const prevCount = prevCountRef.current;

  return (
    <div>
      <h2>Current: {count}</h2>
      <h2>Previous: {prevCount}</h2>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

## Custom Hook for Previous Value

```javascript
function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}

function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <p>
        Current: {count}, Previous: {prevCount}
      </p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}
```

## Storing Mutable Values

```javascript
import React, { useRef, useState } from "react";

function Timer() {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  const startTimer = () => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resetTimer = () => {
    stopTimer();
    setSeconds(0);
  };

  return (
    <div>
      <p>Time: {seconds}s</p>
      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
      <button onClick={resetTimer}>Reset</button>
    </div>
  );
}
```

## Measuring DOM Elements

```javascript
import React, { useRef, useState, useLayoutEffect } from "react";

function MeasureElement() {
  const elementRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (elementRef.current) {
      const { offsetWidth, offsetHeight } = elementRef.current;
      setDimensions({ width: offsetWidth, height: offsetHeight });
    }
  });

  return (
    <div>
      <div
        ref={elementRef}
        style={{
          width: "200px",
          height: "100px",
          backgroundColor: "lightblue",
          padding: "20px",
        }}
      >
        Measured Element
      </div>
      <p>Width: {dimensions.width}px</p>
      <p>Height: {dimensions.height}px</p>
    </div>
  );
}
```

## Scroll Position Tracking

```javascript
import React, { useRef, useState, useEffect } from "react";

function ScrollTracker() {
  const scrollRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const handleScroll = () => {
      setScrollPosition(element.scrollTop);
    };

    element.addEventListener("scroll", handleScroll);
    return () => element.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <p>Scroll Position: {scrollPosition}px</p>
      <div
        ref={scrollRef}
        style={{
          height: "200px",
          overflow: "auto",
          border: "1px solid #ccc",
        }}
      >
        {Array.from({ length: 50 }, (_, i) => (
          <div key={i} style={{ padding: "10px" }}>
            Item {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## File Upload with Progress

```javascript
import React, { useRef, useState } from "react";

function FileUploader() {
  const fileInputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    const file = fileInputRef.current?.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          setUploadProgress(progress);
        }
      };

      xhr.onload = () => {
        setIsUploading(false);
        setUploadProgress(100);
      };

      xhr.open("POST", "/upload");
      xhr.send(formData);
    } catch (error) {
      setIsUploading(false);
      console.error("Upload failed:", error);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: "none" }}
        onChange={() => setUploadProgress(0)}
      />
      <button onClick={triggerFileSelect}>Select File</button>
      <button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? "Uploading..." : "Upload"}
      </button>
      {uploadProgress > 0 && (
        <div>
          <div>Progress: {uploadProgress.toFixed(0)}%</div>
          <div
            style={{
              width: "200px",
              height: "10px",
              backgroundColor: "#f0f0f0",
              borderRadius: "5px",
            }}
          >
            <div
              style={{
                width: `${uploadProgress}%`,
                height: "100%",
                backgroundColor: "#4caf50",
                borderRadius: "5px",
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
```

## Imperative API with forwardRef

```javascript
import React, { useRef, useImperativeHandle, forwardRef } from "react";

const CustomInput = forwardRef((props, ref) => {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    blur: () => {
      inputRef.current?.blur();
    },
    getValue: () => {
      return inputRef.current?.value;
    },
    setValue: (value) => {
      if (inputRef.current) {
        inputRef.current.value = value;
      }
    },
  }));

  return <input ref={inputRef} {...props} />;
});

function Parent() {
  const customInputRef = useRef(null);

  const handleFocus = () => {
    customInputRef.current?.focus();
  };

  const handleGetValue = () => {
    const value = customInputRef.current?.getValue();
    alert(`Current value: ${value}`);
  };

  return (
    <div>
      <CustomInput ref={customInputRef} placeholder="Custom input" />
      <button onClick={handleFocus}>Focus Input</button>
      <button onClick={handleGetValue}>Get Value</button>
    </div>
  );
}
```

## Canvas Drawing Example

```javascript
import React, { useRef, useEffect, useState } from "react";

function DrawingCanvas() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 2;
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const context = canvas.getContext("2d");
    context.beginPath();
    context.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const context = canvas.getContext("2d");
    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        style={{ border: "1px solid #ccc", cursor: "crosshair" }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <br />
      <button onClick={clearCanvas}>Clear Canvas</button>
    </div>
  );
}
```

## useRef vs useState

| Feature            | useRef                     | useState                 |
| ------------------ | -------------------------- | ------------------------ |
| Triggers re-render | No                         | Yes                      |
| Mutable            | Yes (.current property)    | No (requires setState)   |
| Persistence        | Persists across renders    | Persists across renders  |
| Initial value      | Set once                   | Can be function or value |
| Use case           | DOM access, mutable values | Component state          |

## TypeScript Usage

```typescript
import React, { useRef, useEffect } from "react";

interface User {
  id: number;
  name: string;
}

function TypedRefs() {
  const inputRef = useRef<HTMLInputElement>(null);
  const userRef = useRef<User | null>(null);
  const countRef = useRef<number>(0);

  useEffect(() => {
    inputRef.current?.focus();

    userRef.current = { id: 1, name: "John" };

    countRef.current = 10;
  }, []);

  const handleClick = () => {
    if (inputRef.current) {
      const value = inputRef.current.value;
      console.log("Input value:", value);
    }

    if (userRef.current) {
      console.log("User:", userRef.current.name);
    }

    console.log("Count:", countRef.current);
  };

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={handleClick}>Log Values</button>
    </div>
  );
}
```

## Interview Questions

### Q1: What's the difference between useRef and useState?

**Answer:**

- **useRef**: Doesn't trigger re-renders when changed, mutable via .current property, used for DOM access and storing mutable values
- **useState**: Triggers re-renders when updated, immutable (requires setState), used for component state that affects rendering

### Q2: When would you use useRef instead of useState?

**Answer:** Use useRef when:

- Accessing DOM elements directly
- Storing values that don't affect rendering (timers, intervals, previous values)
- Keeping mutable values that persist across renders
- Implementing imperative APIs
- Avoiding unnecessary re-renders

### Q3: How do you access DOM elements with useRef?

**Answer:**

1. Create a ref: `const myRef = useRef(null)`
2. Attach to element: `<div ref={myRef}>`
3. Access in effects or handlers: `myRef.current`

### Q4: Can useRef hold any type of value?

**Answer:** Yes, useRef can hold any mutable value including:

- DOM elements
- Numbers, strings, objects
- Timer IDs
- Previous state values
- Instance variables
- Functions or class instances

## Best Practices

1. **Initialize with null for DOM refs** - Use `useRef(null)` for DOM element references
2. **Check for null** - Always check `ref.current` exists before using
3. **Don't read/write during render** - Only access ref.current in effects or event handlers
4. **Use for imperative operations** - DOM manipulation, focus management, scroll position
5. **Combine with useEffect** - Use effects for side effects with refs
6. **Type your refs in TypeScript** - Specify the element type for better type safety
7. **Clean up side effects** - Clear intervals/timeouts stored in refs

## Common Mistakes

1. **Accessing ref.current during render** - Can cause inconsistent behavior
2. **Forgetting null checks** - Can cause runtime errors
3. **Using for state that affects rendering** - Use useState instead
4. **Not cleaning up** - Memory leaks with intervals, event listeners
5. **Overusing refs** - Prefer React patterns over imperative DOM manipulation
6. **Mutating ref during render** - Should only be done in effects or handlers

## Performance Considerations

- useRef doesn't cause re-renders, making it performance-friendly
- Good for storing values that change frequently but don't need to trigger updates
- Useful for optimization when combined with useCallback and useMemo
- Helps avoid creating new objects on every render
