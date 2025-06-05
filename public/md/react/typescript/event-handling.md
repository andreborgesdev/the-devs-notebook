# React TypeScript Event Handling

## Overview

Proper event handling in React with TypeScript ensures type safety, better developer experience, and prevents common runtime errors. This guide covers comprehensive patterns for handling all types of events.

## Form Events

### Input Events

```tsx
import React, { useState } from "react";

interface FormData {
  name: string;
  email: string;
  age: number;
  bio: string;
}

const FormComponent: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    age: 0,
    bio: "",
  });

  // Text input handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }));
  };

  // Textarea handler
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Select handler
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="Full Name"
      />

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="Email"
      />

      <input
        type="number"
        name="age"
        value={formData.age}
        onChange={handleInputChange}
        placeholder="Age"
      />

      <textarea
        name="bio"
        value={formData.bio}
        onChange={handleTextareaChange}
        placeholder="Biography"
      />
    </form>
  );
};
```

### Form Submission Events

```tsx
interface LoginFormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // Validation
      const newErrors: Partial<LoginFormData> = {};
      if (!formData.username.trim()) {
        newErrors.username = "Username is required";
      }
      if (!formData.password) {
        newErrors.password = "Password is required";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      // Submit form
      await submitLogin(formData);
      console.log("Login successful");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof LoginFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          placeholder="Username"
        />
        {errors.username && <span className="error">{errors.username}</span>}
      </div>

      <div>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Password"
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleInputChange}
          />
          Remember me
        </label>
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

async function submitLogin(data: LoginFormData): Promise<void> {
  // Mock API call
  return new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
}
```

### File Input Events

```tsx
interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  accept = "*/*",
  multiple = false,
  maxSize = 5 * 1024 * 1024, // 5MB default
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const validateFiles = (files: FileList): File[] => {
    const validFiles: File[] = [];
    const newErrors: string[] = [];

    Array.from(files).forEach((file) => {
      if (file.size > maxSize) {
        newErrors.push(
          `${file.name} is too large (max ${maxSize / 1024 / 1024}MB)`
        );
      } else {
        validFiles.push(file);
      }
    });

    setErrors(newErrors);
    return validFiles;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const validFiles = validateFiles(files);
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragOut = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files) {
      const validFiles = validateFiles(e.dataTransfer.files);
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    }
  };

  return (
    <div>
      <div
        className={`file-drop-zone ${dragActive ? "active" : ""}`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="file-input"
        />
        <p>Drag and drop files here or click to select</p>
      </div>

      {errors.length > 0 && (
        <div className="errors">
          {errors.map((error, index) => (
            <p key={index} className="error">
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

// Usage
const App: React.FC = () => {
  const handleFilesSelected = (files: File[]) => {
    console.log("Selected files:", files);
    files.forEach((file) => {
      console.log(`File: ${file.name}, Size: ${file.size}, Type: ${file.type}`);
    });
  };

  return (
    <FileUpload
      onFilesSelected={handleFilesSelected}
      accept="image/*"
      multiple
      maxSize={10 * 1024 * 1024} // 10MB
    />
  );
};
```

## Mouse Events

### Click Events

```tsx
interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDoubleClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  onDoubleClick,
  disabled = false,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    console.log("Click event:", {
      button: e.button, // 0: left, 1: middle, 2: right
      ctrlKey: e.ctrlKey,
      shiftKey: e.shiftKey,
      altKey: e.altKey,
      metaKey: e.metaKey,
      clientX: e.clientX,
      clientY: e.clientY,
    });

    onClick?.(e);
  };

  const handleDoubleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    console.log("Double click event");
    onDoubleClick?.(e);
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent browser context menu
    console.log("Right click detected");
  };

  return (
    <button
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
```

### Mouse Movement Events

```tsx
interface MousePosition {
  x: number;
  y: number;
}

const MouseTracker: React.FC = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMousePosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovering(true);
    console.log("Mouse entered");
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovering(false);
    setIsDragging(false);
    console.log("Mouse left");
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    console.log("Mouse down");
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(false);
    console.log("Mouse up");
  };

  return (
    <div
      className={`mouse-tracker ${isHovering ? "hovering" : ""} ${
        isDragging ? "dragging" : ""
      }`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{
        width: "400px",
        height: "300px",
        border: "2px solid #ccc",
        position: "relative",
        cursor: isDragging ? "grabbing" : "grab",
      }}
    >
      <p>
        Mouse Position: {mousePosition.x}, {mousePosition.y}
      </p>
      <p>Hovering: {isHovering ? "Yes" : "No"}</p>
      <p>Dragging: {isDragging ? "Yes" : "No"}</p>
    </div>
  );
};
```

## Keyboard Events

### Key Press Events

```tsx
interface SearchInputProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  placeholder = "Search...",
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          onSearch(suggestions[selectedIndex]);
          setQuery(suggestions[selectedIndex]);
        } else {
          onSearch(query);
        }
        setSuggestions([]);
        setSelectedIndex(-1);
        break;

      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;

      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;

      case "Escape":
        setSuggestions([]);
        setSelectedIndex(-1);
        break;

      case "Tab":
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          e.preventDefault();
          setQuery(suggestions[selectedIndex]);
          setSuggestions([]);
          setSelectedIndex(-1);
        }
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);

    // Mock suggestions
    if (value.length > 1) {
      const mockSuggestions = [
        `${value} suggestion 1`,
        `${value} suggestion 2`,
        `${value} suggestion 3`,
      ];
      setSuggestions(mockSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle character input
    console.log("Key pressed:", e.key);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle key release
    console.log("Key released:", e.key);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onKeyPress={handleKeyPress}
        onKeyUp={handleKeyUp}
        placeholder={placeholder}
        className="search-input"
      />

      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className={`suggestion ${
                index === selectedIndex ? "selected" : ""
              }`}
              onClick={() => {
                setQuery(suggestion);
                onSearch(suggestion);
                setSuggestions([]);
                setSelectedIndex(-1);
              }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

### Global Keyboard Events

```tsx
const useKeyboardShortcuts = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        console.log("Save shortcut triggered");
      }

      // Ctrl/Cmd + Z
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        console.log("Undo shortcut triggered");
      }

      // Escape key
      if (e.key === "Escape") {
        console.log("Escape pressed");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
};

const KeyboardShortcutDemo: React.FC = () => {
  useKeyboardShortcuts();

  return (
    <div>
      <h2>Keyboard Shortcuts Demo</h2>
      <p>Try pressing:</p>
      <ul>
        <li>Ctrl/Cmd + S (Save)</li>
        <li>Ctrl/Cmd + Z (Undo)</li>
        <li>Escape</li>
      </ul>
    </div>
  );
};
```

## Focus Events

### Focus and Blur Events

```tsx
interface ValidatedInputProps {
  label: string;
  type?: string;
  required?: boolean;
  validator?: (value: string) => string | null;
}

const ValidatedInput: React.FC<ValidatedInputProps> = ({
  label,
  type = "text",
  required = false,
  validator,
}) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [hasBeenTouched, setHasBeenTouched] = useState(false);

  const validate = (inputValue: string) => {
    if (required && !inputValue.trim()) {
      return "This field is required";
    }
    if (validator) {
      return validator(inputValue);
    }
    return null;
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    console.log("Input focused");
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setHasBeenTouched(true);

    const validationError = validate(value);
    setError(validationError);

    console.log("Input blurred");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    // Clear error while typing if field has been touched
    if (hasBeenTouched && error) {
      const validationError = validate(newValue);
      setError(validationError);
    }
  };

  return (
    <div className="validated-input">
      <label>
        {label}
        {required && <span className="required">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`
          input 
          ${isFocused ? "focused" : ""}
          ${error ? "error" : ""}
          ${hasBeenTouched && !error ? "valid" : ""}
        `}
      />
      {error && hasBeenTouched && (
        <span className="error-message">{error}</span>
      )}
    </div>
  );
};

// Usage
const ValidationDemo: React.FC = () => {
  const emailValidator = (value: string): string | null => {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Please enter a valid email address";
    }
    return null;
  };

  return (
    <form>
      <ValidatedInput label="Name" required />
      <ValidatedInput
        label="Email"
        type="email"
        required
        validator={emailValidator}
      />
    </form>
  );
};
```

## Touch Events

### Touch Gesture Events

```tsx
interface TouchPosition {
  x: number;
  y: number;
}

interface SwipeDirection {
  direction: "left" | "right" | "up" | "down" | null;
  distance: number;
}

const TouchGestureDetector: React.FC = () => {
  const [touchStart, setTouchStart] = useState<TouchPosition | null>(null);
  const [touchEnd, setTouchEnd] = useState<TouchPosition | null>(null);
  const [swipe, setSwipe] = useState<SwipeDirection>({
    direction: null,
    distance: 0,
  });

  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
    });
    setTouchEnd(null);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    setTouchEnd({
      x: touch.clientX,
      y: touch.clientY,
    });
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;
    const isUpSwipe = distanceY > minSwipeDistance;
    const isDownSwipe = distanceY < -minSwipeDistance;

    let direction: SwipeDirection["direction"] = null;
    let distance = 0;

    if (isLeftSwipe) {
      direction = "left";
      distance = distanceX;
    } else if (isRightSwipe) {
      direction = "right";
      distance = Math.abs(distanceX);
    } else if (isUpSwipe) {
      direction = "up";
      distance = distanceY;
    } else if (isDownSwipe) {
      direction = "down";
      distance = Math.abs(distanceY);
    }

    setSwipe({ direction, distance });
    console.log("Swipe detected:", direction, distance);
  };

  return (
    <div
      className="touch-detector"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        width: "300px",
        height: "200px",
        border: "2px solid #007bff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        backgroundColor: swipe.direction ? "#e6f3ff" : "#f8f9fa",
      }}
    >
      <div>
        <p>Swipe me!</p>
        {swipe.direction && (
          <p>
            Last swipe: {swipe.direction} ({swipe.distance.toFixed(0)}px)
          </p>
        )}
      </div>
    </div>
  );
};
```

## Custom Event Handlers

### Reusable Event Hook

```tsx
interface UseEventHandlerOptions<T extends HTMLElement> {
  preventDefault?: boolean;
  stopPropagation?: boolean;
  condition?: (e: Event) => boolean;
}

function useEventHandler<T extends HTMLElement, E extends Event>(
  eventType: string,
  handler: (e: E) => void,
  options: UseEventHandlerOptions<T> = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const eventHandler = (e: Event) => {
      if (options.condition && !options.condition(e)) return;

      if (options.preventDefault) e.preventDefault();
      if (options.stopPropagation) e.stopPropagation();

      handler(e as E);
    };

    element.addEventListener(eventType, eventHandler);
    return () => element.removeEventListener(eventType, eventHandler);
  }, [eventType, handler, options]);

  return ref;
}

// Usage
const CustomEventDemo: React.FC = () => {
  const clickRef = useEventHandler<HTMLButtonElement, MouseEvent>(
    "click",
    (e) => console.log("Custom click handler:", e.button),
    { preventDefault: true }
  );

  const wheelRef = useEventHandler<HTMLDivElement, WheelEvent>(
    "wheel",
    (e) => console.log("Wheel event:", e.deltaY),
    {
      preventDefault: true,
      condition: (e) => (e as WheelEvent).ctrlKey,
    }
  );

  return (
    <div>
      <button ref={clickRef}>Click me (custom handler)</button>

      <div
        ref={wheelRef}
        style={{
          width: "200px",
          height: "200px",
          border: "1px solid #ccc",
          marginTop: "20px",
        }}
      >
        Scroll with Ctrl pressed
      </div>
    </div>
  );
};
```

### Event Delegation Pattern

```tsx
interface ListItem {
  id: string;
  name: string;
  type: "edit" | "delete" | "view";
}

const EventDelegationList: React.FC = () => {
  const [items, setItems] = useState<ListItem[]>([
    { id: "1", name: "Item 1", type: "edit" },
    { id: "2", name: "Item 2", type: "delete" },
    { id: "3", name: "Item 3", type: "view" },
  ]);

  const handleListClick = (e: React.MouseEvent<HTMLUListElement>) => {
    const target = e.target as HTMLElement;
    const button = target.closest("button");

    if (!button) return;

    const itemId = button.dataset.itemId;
    const action = button.dataset.action;

    if (!itemId || !action) return;

    switch (action) {
      case "edit":
        console.log("Edit item:", itemId);
        break;
      case "delete":
        console.log("Delete item:", itemId);
        setItems((prev) => prev.filter((item) => item.id !== itemId));
        break;
      case "view":
        console.log("View item:", itemId);
        break;
    }
  };

  return (
    <ul onClick={handleListClick} className="item-list">
      {items.map((item) => (
        <li key={item.id} className="item">
          <span>{item.name}</span>
          <div className="item-actions">
            <button data-item-id={item.id} data-action="edit">
              Edit
            </button>
            <button data-item-id={item.id} data-action="view">
              View
            </button>
            <button data-item-id={item.id} data-action="delete">
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};
```

## Best Practices

### Event Handler Typing

```tsx
// Generic event handler type
type EventHandler<T extends HTMLElement, E extends React.SyntheticEvent<T>> = (
  event: E
) => void;

// Specific event handler types
type ClickHandler = EventHandler<
  HTMLButtonElement,
  React.MouseEvent<HTMLButtonElement>
>;
type ChangeHandler = EventHandler<
  HTMLInputElement,
  React.ChangeEvent<HTMLInputElement>
>;
type SubmitHandler = EventHandler<
  HTMLFormElement,
  React.FormEvent<HTMLFormElement>
>;

interface ComponentProps {
  onClick?: ClickHandler;
  onChange?: ChangeHandler;
  onSubmit?: SubmitHandler;
}
```

### Event Handler Optimization

```tsx
const OptimizedEventHandling: React.FC = () => {
  const [count, setCount] = useState(0);

  // Memoized event handlers to prevent unnecessary re-renders
  const handleIncrement = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  const handleDecrement = useCallback(() => {
    setCount((prev) => prev - 1);
  }, []);

  const handleReset = useCallback(() => {
    setCount(0);
  }, []);

  // Complex event handler with dependencies
  const handleComplexAction = useCallback((multiplier: number) => {
    return (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setCount((prev) => prev * multiplier);
    };
  }, []);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>+</button>
      <button onClick={handleDecrement}>-</button>
      <button onClick={handleReset}>Reset</button>
      <button onClick={handleComplexAction(2)}>×2</button>
    </div>
  );
};
```

## Interview Questions

**Q: What's the difference between React's SyntheticEvent and native DOM events?**
A: SyntheticEvent provides cross-browser compatibility and consistent API. It wraps native events but behaves the same across all browsers. You can access the native event via `e.nativeEvent`.

**Q: How do you properly type event handlers for different HTML elements?**
A: Use React's built-in event types: `React.MouseEvent<HTMLButtonElement>`, `React.ChangeEvent<HTMLInputElement>`, etc. The generic parameter specifies the target element type.

**Q: When should you use event delegation in React?**
A: Event delegation is useful for dynamic lists where you have many similar elements with similar handlers. It's more memory efficient than attaching individual handlers to each element.

**Q: How do you prevent memory leaks with event listeners in React?**
A: Always clean up event listeners in useEffect cleanup functions, use refs to ensure elements exist before adding listeners, and use useCallback to prevent recreating handlers unnecessarily.

**Q: What's the proper way to handle form submission events?**
A: Always call `e.preventDefault()` to prevent default form submission, extract form data using FormData API or controlled inputs, handle validation, and manage loading/error states appropriately.
