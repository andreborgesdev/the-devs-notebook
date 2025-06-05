# useId Hook

## Overview

The `useId` hook generates unique, stable IDs that are consistent across server and client renders. It's essential for accessibility and avoiding hydration mismatches in SSR applications.

## Basic Usage

```tsx
import { useId } from "react";

function FormComponent() {
  const id = useId();

  return (
    <form>
      <label htmlFor={`${id}-name`}>Name:</label>
      <input id={`${id}-name`} type="text" />

      <label htmlFor={`${id}-email`}>Email:</label>
      <input id={`${id}-email`} type="email" />
    </form>
  );
}
```

## Multiple IDs

```tsx
function ContactForm() {
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();

  return (
    <form>
      <div>
        <label htmlFor={nameId}>Name:</label>
        <input id={nameId} type="text" name="name" />
      </div>

      <div>
        <label htmlFor={emailId}>Email:</label>
        <input id={emailId} type="email" name="email" />
      </div>

      <div>
        <label htmlFor={messageId}>Message:</label>
        <textarea id={messageId} name="message" />
      </div>
    </form>
  );
}
```

## Accessibility Best Practices

```tsx
function AccessibleForm() {
  const formId = useId();
  const errorId = useId();

  return (
    <div>
      <form id={formId}>
        <label htmlFor={`${formId}-username`}>Username:</label>
        <input
          id={`${formId}-username`}
          type="text"
          aria-describedby={errorId}
          aria-invalid="true"
        />
      </form>

      <div id={errorId} role="alert">
        Username is required
      </div>
    </div>
  );
}
```

## SSR Considerations

```tsx
function SSRSafeComponent() {
  const id = useId();

  return (
    <div>
      <input id={`input-${id}`} />
      <label htmlFor={`input-${id}`}>
        This ID is consistent across server and client
      </label>
    </div>
  );
}
```

## Common Patterns

### Form Field Component

```tsx
interface FieldProps {
  label: string;
  type?: string;
  required?: boolean;
}

function Field({ label, type = "text", required }: FieldProps) {
  const id = useId();

  return (
    <div>
      <label htmlFor={id}>
        {label}
        {required && <span aria-label="required">*</span>}
      </label>
      <input id={id} type={type} required={required} aria-required={required} />
    </div>
  );
}
```

### Reusable Input Component

```tsx
interface InputProps {
  label: string;
  error?: string;
  helperText?: string;
}

function Input({ label, error, helperText, ...props }: InputProps) {
  const id = useId();
  const errorId = useId();
  const helperId = useId();

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        aria-describedby={`${helperText ? helperId : ""} ${
          error ? errorId : ""
        }`}
        aria-invalid={!!error}
        {...props}
      />

      {helperText && (
        <div id={helperId} className="helper-text">
          {helperText}
        </div>
      )}

      {error && (
        <div id={errorId} className="error-text" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
```

## Key Benefits

- **SSR Safe**: Prevents hydration mismatches
- **Unique**: Guarantees unique IDs across components
- **Stable**: IDs remain consistent across re-renders
- **Accessible**: Improves form accessibility with proper labeling

## Best Practices

1. Use for form elements that need `id` and `htmlFor` attributes
2. Combine with prefixes for semantic meaning
3. Don't use for generating keys in lists
4. Ideal for accessibility attributes like `aria-describedby`

## Common Mistakes

```tsx
// ❌ Don't use for React keys
function BadExample({ items }) {
  const id = useId();
  return (
    <ul>
      {items.map((item, index) => (
        <li key={`${id}-${index}`}>{item}</li>
      ))}
    </ul>
  );
}

// ✅ Use stable item properties for keys
function GoodExample({ items }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

The `useId` hook is essential for building accessible React applications, especially when dealing with forms and SSR scenarios.
