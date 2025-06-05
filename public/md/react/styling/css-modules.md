# CSS Modules in React

CSS Modules provide a way to write CSS that's locally scoped to components by default, avoiding styling conflicts and creating maintainable stylesheets.

## What are CSS Modules?

CSS Modules automatically generate unique class names for your CSS, ensuring styles are scoped to specific components without global conflicts.

### Key Benefits

| Feature          | Description                                   |
| ---------------- | --------------------------------------------- |
| **Local Scope**  | Class names are locally scoped by default     |
| **No Conflicts** | Automatically generated unique class names    |
| **Maintainable** | Clear component-style relationships           |
| **Standard CSS** | Use regular CSS syntax with powerful features |

## Basic Setup

### Create React App (Built-in)

```css
/* Button.module.css */
.button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.button:hover {
  background-color: #0056b3;
}

.primary {
  background-color: #007bff;
}

.secondary {
  background-color: #6c757d;
}

.large {
  padding: 16px 32px;
  font-size: 16px;
}

.small {
  padding: 8px 16px;
  font-size: 12px;
}
```

```tsx
// Button.tsx
import React from "react";
import styles from "./Button.module.css";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "small" | "large";
  onClick?: () => void;
  disabled?: boolean;
}

function Button({
  children,
  variant = "primary",
  size,
  onClick,
  disabled,
}: ButtonProps) {
  const baseClasses = [styles.button];

  if (variant) {
    baseClasses.push(styles[variant]);
  }

  if (size) {
    baseClasses.push(styles[size]);
  }

  return (
    <button
      className={baseClasses.join(" ")}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
```

## Advanced Patterns

### Conditional Classes

```tsx
// Card.tsx
import React from "react";
import styles from "./Card.module.css";

interface CardProps {
  children: React.ReactNode;
  elevated?: boolean;
  clickable?: boolean;
  loading?: boolean;
}

function Card({ children, elevated, clickable, loading }: CardProps) {
  const classes = [
    styles.card,
    elevated && styles.elevated,
    clickable && styles.clickable,
    loading && styles.loading,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      {loading && <div className={styles.loadingOverlay} />}
      {children}
    </div>
  );
}

export default Card;
```

```css
/* Card.module.css */
.card {
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 16px;
  position: relative;
  transition: all 0.2s ease;
}

.elevated {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.clickable {
  cursor: pointer;
}

.clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.loading {
  pointer-events: none;
}

.loadingOverlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}

.loadingOverlay::after {
  content: "";
  width: 20px;
  height: 20px;
  border: 2px solid #007bff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

### Dynamic Class Composition

```tsx
// Alert.tsx
import React from "react";
import styles from "./Alert.module.css";

type AlertType = "success" | "warning" | "error" | "info";

interface AlertProps {
  type: AlertType;
  title?: string;
  children: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
}

function Alert({ type, title, children, dismissible, onDismiss }: AlertProps) {
  const alertClasses = [
    styles.alert,
    styles[type],
    dismissible && styles.dismissible,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={alertClasses} role="alert">
      {title && <div className={styles.title}>{title}</div>}
      <div className={styles.content}>{children}</div>
      {dismissible && (
        <button
          className={styles.closeButton}
          onClick={onDismiss}
          aria-label="Close alert"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default Alert;
```

## CSS Variables and Theming

```css
/* theme.module.css */
.lightTheme {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --background-color: #ffffff;
  --text-color: #333333;
  --border-color: #e0e0e0;
  --shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.darkTheme {
  --primary-color: #4dabf7;
  --secondary-color: #868e96;
  --background-color: #1a1a1a;
  --text-color: #ffffff;
  --border-color: #333333;
  --shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.themed {
  background-color: var(--background-color);
  color: var(--text-color);
  border-color: var(--border-color);
}
```

```tsx
// ThemeProvider.tsx
import React, { createContext, useContext, useState } from "react";
import styles from "./theme.module.css";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
}>({
  theme: "light",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const themeClass = theme === "light" ? styles.lightTheme : styles.darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={themeClass}>{children}</div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

## Working with Global Styles

```css
/* globals.module.css */
:global(.no-scroll) {
  overflow: hidden;
}

:global(.visually-hidden) {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.5);
}

.modal :global(.focus-trap) {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}
```

## Responsive Design

```css
/* Layout.module.css */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.grid {
  display: grid;
  gap: 16px;
}

.col1 {
  grid-template-columns: 1fr;
}
.col2 {
  grid-template-columns: repeat(2, 1fr);
}
.col3 {
  grid-template-columns: repeat(3, 1fr);
}
.col4 {
  grid-template-columns: repeat(4, 1fr);
}

@media (max-width: 768px) {
  .col2,
  .col3,
  .col4 {
    grid-template-columns: 1fr;
  }

  .container {
    padding: 0 12px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .col3,
  .col4 {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

```tsx
// ResponsiveGrid.tsx
import React from "react";
import styles from "./Layout.module.css";

interface GridProps {
  children: React.ReactNode;
  columns: 1 | 2 | 3 | 4;
  className?: string;
}

function ResponsiveGrid({ children, columns, className }: GridProps) {
  const gridClass = styles[`col${columns}`];
  const classes = [styles.grid, gridClass, className].filter(Boolean).join(" ");

  return <div className={classes}>{children}</div>;
}

export default ResponsiveGrid;
```

## Animation with CSS Modules

```css
/* animations.module.css */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}

.slideUp {
  animation: slideUp 0.4s ease-out;
}

.pulse {
  animation: pulse 2s infinite;
}

.delayed {
  animation-delay: 0.2s;
  animation-fill-mode: both;
}
```

## Best Practices

### File Organization

```
components/
├── Button/
│   ├── Button.tsx
│   ├── Button.module.css
│   ├── Button.test.tsx
│   └── index.ts
├── Card/
│   ├── Card.tsx
│   ├── Card.module.css
│   └── index.ts
└── shared/
    ├── variables.module.css
    ├── mixins.module.css
    └── animations.module.css
```

### Naming Conventions

```css
/* Good naming conventions */
.componentName {
} /* Component root */
.componentName__element {
} /* Element within component */
.componentName--modifier {
} /* Component variant */

/* Examples */
.button {
}
.button__text {
}
.button--primary {
}
.button--large {
}
```

### Composition Over Inheritance

```css
/* Base styles */
.baseInput {
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.baseInput:focus {
  outline: none;
  border-color: var(--primary-color);
}

/* Composed styles */
.textInput {
  composes: baseInput;
}

.emailInput {
  composes: baseInput;
  background-image: url("mail-icon.svg");
  background-repeat: no-repeat;
  background-position: right 8px center;
  padding-right: 32px;
}

.searchInput {
  composes: baseInput;
  border-radius: 20px;
  padding-left: 40px;
}
```

## TypeScript Integration

```tsx
// types/styles.ts
export interface StyleProps {
  className?: string;
  style?: React.CSSProperties;
}

// hooks/useStyles.ts
import { useMemo } from "react";

export function useStyles(
  baseStyles: Record<string, string>,
  conditions: Record<string, boolean> = {}
) {
  return useMemo(() => {
    const classes: string[] = [];

    Object.entries(conditions).forEach(([key, condition]) => {
      if (condition && baseStyles[key]) {
        classes.push(baseStyles[key]);
      }
    });

    return classes.join(" ");
  }, [baseStyles, conditions]);
}
```

## CSS Modules vs Other Solutions

| Feature            | CSS Modules | Styled Components | Tailwind             |
| ------------------ | ----------- | ----------------- | -------------------- |
| **Bundle Size**    | Small       | Medium            | Large (with purging) |
| **Learning Curve** | Low         | Medium            | Medium               |
| **Dynamic Styles** | Limited     | Excellent         | Limited              |
| **Theming**        | Manual      | Built-in          | Configuration        |
| **SSR Support**    | Excellent   | Good              | Excellent            |
| **Dev Experience** | Good        | Excellent         | Good                 |

## Common Pitfalls

### Avoid Global Pollution

```css
/* ❌ Bad: Global styles */
.button {
  /* This affects all elements with class "button" */
}

/* ✅ Good: CSS Modules */
.button {
  /* This is locally scoped */
}
```

### Proper Class Composition

```tsx
// ❌ Bad: String concatenation
const className = styles.button + " " + styles.primary;

// ✅ Good: Array filtering
const className = [styles.button, styles.primary].filter(Boolean).join(" ");

// ✅ Better: Helper function
const cn = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(" ");

const className = cn(styles.button, isPrimary && styles.primary);
```

## Performance Optimization

### CSS Module Bundle Analysis

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.module\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[name]__[local]___[hash:base64:5]",
              },
            },
          },
        ],
      },
    ],
  },
};
```

### Critical CSS Extraction

```tsx
// CriticalStyles.tsx
import { useEffect } from "react";

function CriticalStyles() {
  useEffect(() => {
    // Load non-critical CSS after initial render
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/non-critical.css";
    document.head.appendChild(link);
  }, []);

  return null;
}

export default CriticalStyles;
```

## Interview Questions

**Q: What are CSS Modules and how do they solve styling conflicts?**
A: CSS Modules automatically scope CSS by generating unique class names, preventing global namespace pollution and styling conflicts between components.

**Q: How do you handle dynamic styles with CSS Modules?**
A: Use conditional class application, CSS variables for dynamic values, or combine with inline styles for computed values.

**Q: What's the difference between CSS Modules and CSS-in-JS?**
A: CSS Modules use build-time class name generation with standard CSS, while CSS-in-JS creates styles at runtime with JavaScript.

**Q: How do you share styles between components with CSS Modules?**
A: Use the `composes` property to inherit styles, shared CSS files for common styles, or CSS variables for values.

**Q: What are the performance implications of CSS Modules?**
A: CSS Modules have minimal runtime overhead since class names are resolved at build time, with no JavaScript execution cost for styling.
