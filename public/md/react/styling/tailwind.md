# Tailwind CSS with React

Tailwind CSS is a utility-first CSS framework that provides low-level utility classes to build custom designs directly in your markup, offering rapid development and consistent design systems.

## Introduction

Tailwind CSS takes a different approach from traditional CSS frameworks by providing atomic utility classes instead of pre-designed components.

### Key Advantages

| Feature               | Description                                          |
| --------------------- | ---------------------------------------------------- |
| **Utility-First**     | Compose designs from small, reusable utility classes |
| **Responsive Design** | Built-in responsive design system                    |
| **Design System**     | Consistent spacing, colors, and typography           |
| **Performance**       | Purges unused CSS in production                      |
| **Customization**     | Highly configurable design tokens                    |

## Installation and Setup

### With Create React App

```bash
pnpm add -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          900: "#1e3a8a",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
```

### CSS Setup

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom base styles */
@layer base {
  html {
    font-family: "Inter", system-ui, sans-serif;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    @apply font-semibold text-gray-900;
  }

  a {
    @apply text-blue-600 hover:text-blue-800 transition-colors;
  }
}

/* Custom components */
@layer components {
  .btn {
    @apply px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2;
  }

  .btn-primary {
    @apply bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500;
  }

  .btn-secondary {
    @apply bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500;
  }

  .card {
    @apply bg-white rounded-lg shadow-md border border-gray-200 p-6;
  }
}

/* Custom utilities */
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }

  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

## Basic Component Patterns

### Button Component

```tsx
import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500",
        secondary:
          "bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-500",
        outline:
          "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-500",
        ghost: "text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-500",
        danger:
          "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

function Button({
  className,
  variant,
  size,
  loading,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}

export default Button;
```

### Card Component

```tsx
import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

function Card({
  className,
  hover,
  padding = "md",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-lg border border-gray-200 shadow-sm",
        hover && "hover:shadow-md transition-shadow duration-200",
        {
          "p-0": padding === "none",
          "p-4": padding === "sm",
          "p-6": padding === "md",
          "p-8": padding === "lg",
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mb-4", className)} {...props}>
      {children}
    </div>
  );
}

function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-lg font-semibold text-gray-900", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("text-gray-600", className)} {...props}>
      {children}
    </div>
  );
}

function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mt-4 pt-4 border-t border-gray-200", className)}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
```

## Layout Components

### Grid System

```tsx
import React from "react";
import { cn } from "@/lib/utils";

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: "sm" | "md" | "lg" | "xl";
  responsive?: boolean;
}

function Grid({
  className,
  cols = 1,
  gap = "md",
  responsive = true,
  children,
  ...props
}: GridProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
    12: "grid-cols-12",
  };

  const gridGap = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  };

  return (
    <div
      className={cn(
        "grid",
        responsive ? "grid-cols-1 sm:grid-cols-2" : gridCols[cols],
        responsive && cols > 2 && `lg:${gridCols[cols]}`,
        gridGap[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "col";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  gap?: "sm" | "md" | "lg" | "xl";
  wrap?: boolean;
}

function Flex({
  className,
  direction = "row",
  align = "stretch",
  justify = "start",
  gap = "md",
  wrap = false,
  children,
  ...props
}: FlexProps) {
  const alignItems = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  };

  const justifyContent = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
  };

  const gapSize = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  };

  return (
    <div
      className={cn(
        "flex",
        direction === "col" ? "flex-col" : "flex-row",
        alignItems[align],
        justifyContent[justify],
        gapSize[gap],
        wrap && "flex-wrap",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Grid, Flex };
```

### Container and Section

```tsx
import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

function Container({
  className,
  size = "lg",
  children,
  ...props
}: ContainerProps) {
  const sizes = {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    full: "max-w-full",
  };

  return (
    <div
      className={cn("mx-auto px-4 sm:px-6 lg:px-8", sizes[size], className)}
      {...props}
    >
      {children}
    </div>
  );
}

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  padding?: "sm" | "md" | "lg" | "xl";
  background?: "white" | "gray" | "blue" | "transparent";
}

function Section({
  className,
  padding = "lg",
  background = "transparent",
  children,
  ...props
}: SectionProps) {
  const paddingSize = {
    sm: "py-8",
    md: "py-12",
    lg: "py-16",
    xl: "py-24",
  };

  const backgrounds = {
    white: "bg-white",
    gray: "bg-gray-50",
    blue: "bg-blue-50",
    transparent: "bg-transparent",
  };

  return (
    <section
      className={cn(paddingSize[padding], backgrounds[background], className)}
      {...props}
    >
      {children}
    </section>
  );
}

export { Container, Section };
```

## Form Components

### Input Component

```tsx
import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, label, error, helperText, startIcon, endIcon, ...props },
    ref
  ) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative">
          {startIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="text-gray-400">{startIcon}</div>
            </div>
          )}
          <input
            className={cn(
              "block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm",
              startIcon && "pl-10",
              endIcon && "pr-10",
              error &&
                "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500",
              className
            )}
            ref={ref}
            {...props}
          />
          {endIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <div className="text-gray-400">{endIcon}</div>
            </div>
          )}
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
```

### Select Component

```tsx
import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <select
          className={cn(
            "block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm",
            error &&
              "border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500",
            className
          )}
          ref={ref}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
```

## Responsive Design Patterns

### Mobile-First Approach

```tsx
function ResponsiveLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-first navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900">Logo</h1>
              </div>
            </div>

            {/* Desktop menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a
                  href="#"
                  className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  About
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Contact
                </a>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Hero section */}
        <div className="text-center py-12 sm:py-16 lg:py-20">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Welcome to Our Platform
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Build amazing applications with our comprehensive toolkit
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="w-full sm:w-auto">
              Get Started
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Learn More
            </Button>
          </div>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Feature {item}
              </h3>
              <p className="text-gray-600 text-sm">
                Description of feature {item} and its benefits for users.
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
```

## Dark Mode Implementation

```tsx
// ThemeProvider.tsx
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as Theme;
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateResolvedTheme = () => {
      if (theme === "system") {
        setResolvedTheme(mediaQuery.matches ? "dark" : "light");
      } else {
        setResolvedTheme(theme as "light" | "dark");
      }
    };

    updateResolvedTheme();
    mediaQuery.addEventListener("change", updateResolvedTheme);

    return () => mediaQuery.removeEventListener("change", updateResolvedTheme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
    localStorage.setItem("theme", theme);
  }, [theme, resolvedTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

// ThemeToggle.tsx
function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-md bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          className="dark:hidden"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
        <path
          className="hidden dark:block"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
        />
      </svg>
    </button>
  );
}
```

## Animation and Transitions

```tsx
import React, { useState } from "react";
import { cn } from "@/lib/utils";

function AnimatedComponents() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-8 p-8">
      {/* Fade transitions */}
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Toggle Modal
        </button>

        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setIsOpen(false)}
            />
            <div className="relative bg-white p-6 rounded-lg shadow-lg animate-slide-up max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Modal Title</h3>
              <p className="text-gray-600 mb-4">
                This is a modal with smooth animations.
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Loading states */}
      <div>
        <button
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 2000);
          }}
          disabled={loading}
          className={cn(
            "px-6 py-3 rounded-md font-medium transition-all duration-200",
            loading
              ? "bg-blue-400 text-white cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105"
          )}
        >
          {loading && (
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
          {loading ? "Loading..." : "Start Process"}
        </button>
      </div>

      {/* Hover effects */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              Card {item}
            </h3>
            <p className="text-gray-600 text-sm">
              Hover over this card to see the animation effects.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Performance Optimization

### Utility Class Optimization

```javascript
// tailwind.config.js - Production optimization
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {},
  },
  plugins: [],
  // Remove unused styles in production
  purge: {
    enabled: process.env.NODE_ENV === "production",
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
    safelist: [
      // Keep dynamic classes
      "bg-red-500",
      "bg-green-500",
      "bg-blue-500",
    ],
  },
};
```

### Class Name Utility

```tsx
// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage examples
const buttonClass = cn(
  "px-4 py-2 rounded-md",
  isPrimary && "bg-blue-600 text-white",
  isSecondary && "bg-gray-200 text-gray-900",
  isDisabled && "opacity-50 cursor-not-allowed"
);
```

## Best Practices

### Component Design System

```tsx
// Design tokens
export const tokens = {
  colors: {
    brand: {
      50: "#eff6ff",
      500: "#3b82f6",
      900: "#1e3a8a",
    },
  },
  spacing: {
    xs: "0.5rem",
    sm: "1rem",
    md: "1.5rem",
    lg: "2rem",
  },
  borderRadius: {
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
  },
};

// Component variants with CVA
const cardVariants = cva("rounded-lg border transition-all duration-200", {
  variants: {
    variant: {
      default: "bg-white border-gray-200 shadow-sm",
      outlined: "bg-white border-gray-300",
      elevated: "bg-white border-gray-200 shadow-lg",
      filled: "bg-gray-50 border-gray-200",
    },
    padding: {
      none: "p-0",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    },
  },
  defaultVariants: {
    variant: "default",
    padding: "md",
  },
});
```

### Responsive Design Guidelines

```tsx
// Breakpoint utilities
const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

// Mobile-first responsive classes
const responsiveClasses = {
  // Typography
  heading: "text-2xl sm:text-3xl lg:text-4xl",
  body: "text-sm sm:text-base",

  // Spacing
  section: "py-8 sm:py-12 lg:py-16",
  container: "px-4 sm:px-6 lg:px-8",

  // Layout
  grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  flex: "flex flex-col sm:flex-row",
};
```

## Tailwind vs Other Solutions

| Feature                | Tailwind CSS         | Styled Components | CSS Modules |
| ---------------------- | -------------------- | ----------------- | ----------- |
| **Learning Curve**     | Medium               | Medium            | Low         |
| **Bundle Size**        | Small (with purging) | Medium            | Minimal     |
| **Development Speed**  | Fast                 | Medium            | Slow        |
| **Design Consistency** | Excellent            | Manual            | Manual      |
| **Customization**      | Excellent            | Excellent         | Limited     |
| **Responsive Design**  | Built-in             | Manual            | Manual      |

## Common Pitfalls

### Class Name Order

```tsx
// ❌ Bad: Classes might conflict
className="p-4 p-6"

// ✅ Good: Use cn utility for merging
className={cn('p-4', largeSize && 'p-6')}
```

### Performance Anti-patterns

```tsx
// ❌ Bad: Inline objects recreated on each render
<div style={{ padding: '1rem' }}>

// ✅ Good: Use Tailwind classes
<div className="p-4">
```

## Interview Questions

**Q: What are the advantages of utility-first CSS?**
A: Faster development, consistent design system, smaller CSS bundle, easier maintenance, and built-in responsive design patterns.

**Q: How does Tailwind CSS handle responsive design?**
A: Mobile-first approach with responsive prefixes (sm:, md:, lg:) that apply styles at specific breakpoints.

**Q: What's the difference between Tailwind and traditional CSS frameworks?**
A: Tailwind provides low-level utility classes for building custom designs, while traditional frameworks provide pre-designed components.

**Q: How do you optimize Tailwind CSS for production?**
A: Enable purging to remove unused styles, use the official Tailwind plugins, and leverage CDN for faster loading.

**Q: How do you handle component variants in Tailwind?**
A: Use libraries like class-variance-authority (CVA) or custom utility functions to manage conditional classes and component variants.
