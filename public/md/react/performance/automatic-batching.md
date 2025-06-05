# Automatic Batching

## Overview

React automatically batches multiple state updates into a single re-render for better performance. This optimization happens for all updates, including those in promises, timeouts, and native event handlers.

## What is Batching?

Batching groups multiple state updates into a single re-render to improve performance by reducing unnecessary re-renders.

```tsx
function Counter() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  console.log("Render"); // Only logs once per batch

  const handleClick = () => {
    setCount((c) => c + 1); // Doesn't re-render yet
    setFlag((f) => !f); // Doesn't re-render yet
    // React batches both updates into one re-render
  };

  return (
    <div>
      <button onClick={handleClick}>
        Count: {count}, Flag: {flag.toString()}
      </button>
    </div>
  );
}
```

## Automatic Batching Examples

### Event Handlers (Always Batched)

```tsx
function EventBatching() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);

  console.log("Rendering"); // Only logs once

  const handleSubmit = () => {
    setCount((c) => c + 1);
    setName("John");
    setAge(25);
    // All three updates are batched automatically
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>Count: {count}</div>
      <div>Name: {name}</div>
      <div>Age: {age}</div>
      <button type="submit">Update All</button>
    </form>
  );
}
```

### Async Operations (React 18+)

```tsx
function AsyncBatching() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  console.log("Rendering");

  const fetchData = async () => {
    setLoading(true);
    setCount((c) => c + 1);
    // These are batched even in async context

    try {
      const response = await fetch("/api/data");
      const result = await response.json();

      setData(result);
      setLoading(false);
      setCount((c) => c + 1);
      // These three updates are also batched
    } catch (error) {
      setLoading(false);
      setData(null);
      // Error handling updates are batched too
    }
  };

  return (
    <div>
      <button onClick={fetchData}>Fetch Data</button>
      <div>Count: {count}</div>
      <div>Loading: {loading.toString()}</div>
      <div>Data: {JSON.stringify(data)}</div>
    </div>
  );
}
```

### Timeouts and Intervals

```tsx
function TimerBatching() {
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((s) => {
        if (s === 59) {
          setMinutes((m) => {
            if (m === 59) {
              setHours((h) => h + 1);
              return 0;
            }
            return m + 1;
          });
          return 0;
        }
        return s + 1;
      });
      // All updates within the same tick are batched
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
      {String(seconds).padStart(2, "0")}
    </div>
  );
}
```

## Performance Benefits

### Before Automatic Batching

```tsx
// This would cause 3 separate re-renders in older React versions
setTimeout(() => {
  setCount((c) => c + 1); // Re-render 1
  setFlag((f) => !f); // Re-render 2
  setName("John"); // Re-render 3
}, 1000);
```

### With Automatic Batching

```tsx
// Now all three updates are batched into one re-render
setTimeout(() => {
  setCount((c) => c + 1); // Queued
  setFlag((f) => !f); // Queued
  setName("John"); // Queued
  // Single re-render with all updates
}, 1000);
```

## Opting Out of Batching

Sometimes you need to force synchronous updates:

```tsx
import { flushSync } from "react-dom";

function OptOutExample() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  const handleClick = () => {
    flushSync(() => {
      setCount((c) => c + 1);
    });
    // Re-render happens here

    flushSync(() => {
      setFlag((f) => !f);
    });
    // Another re-render happens here
  };

  return (
    <button onClick={handleClick}>
      Count: {count}, Flag: {flag.toString()}
    </button>
  );
}
```

## Real-World Scenarios

### Form Validation

```tsx
function FormWithValidation() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateAndSubmit = async () => {
    // Clear previous state
    setEmailError("");
    setIsValid(false);
    setIsSubmitting(true);
    // All batched into one re-render

    const emailIsValid = email.includes("@");

    if (!emailIsValid) {
      setEmailError("Invalid email format");
      setIsSubmitting(false);
      // Batched error state update
      return;
    }

    try {
      await submitForm({ email });
      setIsValid(true);
      setIsSubmitting(false);
      // Success state batched
    } catch (error) {
      setEmailError("Submission failed");
      setIsSubmitting(false);
      // Error state batched
    }
  };

  return (
    <form onSubmit={validateAndSubmit}>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      {emailError && <div className="error">{emailError}</div>}
      <button disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
      {isValid && <div className="success">Form submitted!</div>}
    </form>
  );
}
```

### Shopping Cart Updates

```tsx
function ShoppingCart() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [discount, setDiscount] = useState(0);

  const addItem = (newItem) => {
    setItems((prev) => [...prev, newItem]);
    setItemCount((prev) => prev + 1);
    setTotal((prev) => prev + newItem.price);

    // Apply bulk discount
    if (itemCount + 1 >= 5) {
      setDiscount(0.1);
    }
    // All updates batched automatically
  };

  const removeItem = (itemId) => {
    const item = items.find((i) => i.id === itemId);
    if (item) {
      setItems((prev) => prev.filter((i) => i.id !== itemId));
      setItemCount((prev) => prev - 1);
      setTotal((prev) => prev - item.price);

      if (itemCount - 1 < 5) {
        setDiscount(0);
      }
      // Removal updates also batched
    }
  };

  return (
    <div>
      <div>Items: {itemCount}</div>
      <div>Total: ${(total * (1 - discount)).toFixed(2)}</div>
      {discount > 0 && <div>Discount: {discount * 100}%</div>}
      {/* Cart items rendered here */}
    </div>
  );
}
```

## Best Practices

### Trust Automatic Batching

```tsx
// ✅ Don't worry about batching manually
const updateMultipleStates = () => {
  setState1(newValue1);
  setState2(newValue2);
  setState3(newValue3);
  // React handles batching automatically
};
```

### Use flushSync Sparingly

```tsx
// ❌ Avoid unless absolutely necessary
flushSync(() => {
  setState(newValue);
});

// ✅ Only use for specific DOM measurements
flushSync(() => {
  setHeight(newHeight);
});
const measuredHeight = elementRef.current.scrollHeight;
```

### Optimize State Structure

```tsx
// ✅ Better: Single state object for related data
const [formState, setFormState] = useState({
  email: "",
  password: "",
  isValid: false,
  errors: {},
});

// Update all at once
setFormState((prev) => ({
  ...prev,
  email: newEmail,
  isValid: validateEmail(newEmail),
  errors: { ...prev.errors, email: null },
}));
```

## Performance Monitoring

```tsx
function PerformanceMonitor() {
  const [renderCount, setRenderCount] = useState(0);

  useEffect(() => {
    setRenderCount((prev) => prev + 1);
  });

  return <div>Render count: {renderCount}</div>;
}
```

## Key Benefits

- **Fewer Re-renders**: Multiple state updates trigger single re-render
- **Better Performance**: Reduced computation and DOM updates
- **Automatic**: No manual optimization needed
- **Consistent**: Works across all update contexts (events, async, timers)

Automatic batching significantly improves React application performance by intelligently grouping state updates, reducing unnecessary re-renders while maintaining predictable behavior.
