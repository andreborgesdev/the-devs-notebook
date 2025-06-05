# Styled Components

Styled Components is a popular CSS-in-JS library that allows you to write CSS directly in JavaScript, creating styled React components with full theming and dynamic styling capabilities.

## Introduction

Styled Components utilizes tagged template literals to style components, offering a seamless integration between CSS and JavaScript with powerful theming and dynamic styling features.

### Key Features

| Feature                   | Description                            |
| ------------------------- | -------------------------------------- |
| **CSS-in-JS**             | Write CSS directly in JavaScript files |
| **Dynamic Styling**       | Styles based on props and state        |
| **Automatic Scoping**     | No class name collisions               |
| **Theming**               | Built-in theming support               |
| **Server-Side Rendering** | SSR support out of the box             |

## Installation and Setup

```bash
pnpm add styled-components
pnpm add -D @types/styled-components
```

### Basic Configuration

```tsx
// types/styled.d.ts
import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      text: string;
      error: string;
      success: string;
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    breakpoints: {
      mobile: string;
      tablet: string;
      desktop: string;
    };
  }
}
```

## Basic Usage

### Simple Styled Components

```tsx
import styled from "styled-components";

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
    transform: none;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
`;

function App() {
  return (
    <div>
      <Title>Welcome to My App</Title>
      <Button onClick={() => console.log("Clicked!")}>Click Me</Button>
    </div>
  );
}
```

### Props-Based Styling

```tsx
interface ButtonProps {
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  loading?: boolean;
}

const StyledButton = styled.button<ButtonProps>`
  /* Base styles */
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;

  /* Size variants */
  ${({ size = "medium" }) => {
    switch (size) {
      case "small":
        return `
          padding: 8px 16px;
          font-size: 12px;
        `;
      case "large":
        return `
          padding: 16px 32px;
          font-size: 16px;
        `;
      default:
        return `
          padding: 12px 24px;
          font-size: 14px;
        `;
    }
  }}

  /* Color variants */
  ${({ variant = "primary" }) => {
    switch (variant) {
      case "secondary":
        return `
          background-color: #6c757d;
          color: white;
          &:hover { background-color: #545b62; }
        `;
      case "danger":
        return `
          background-color: #dc3545;
          color: white;
          &:hover { background-color: #c82333; }
        `;
      default:
        return `
          background-color: #007bff;
          color: white;
          &:hover { background-color: #0056b3; }
        `;
    }
  }}
  
  /* Full width */
  ${({ fullWidth }) =>
    fullWidth &&
    `
    width: 100%;
  `}
  
  /* Loading state */
  ${({ loading }) =>
    loading &&
    `
    pointer-events: none;
    opacity: 0.7;
  `}
  
  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

function Button({
  children,
  loading,
  ...props
}: ButtonProps & {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <StyledButton {...props}>
      {loading && <LoadingSpinner />}
      {children}
    </StyledButton>
  );
}
```

## Advanced Patterns

### Component Extension

```tsx
const BaseButton = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
`;

const PrimaryButton = styled(BaseButton)`
  background-color: #007bff;
  color: white;

  &:hover {
    background-color: #0056b3;
  }
`;

const OutlineButton = styled(BaseButton)`
  background-color: transparent;
  color: #007bff;
  border: 2px solid #007bff;

  &:hover {
    background-color: #007bff;
    color: white;
  }
`;

const IconButton = styled(BaseButton)`
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 20px;
    height: 20px;
  }
`;
```

### Polymorphic Components

```tsx
interface FlexProps {
  direction?: "row" | "column";
  align?: "flex-start" | "center" | "flex-end" | "stretch";
  justify?:
    | "flex-start"
    | "center"
    | "flex-end"
    | "space-between"
    | "space-around";
  gap?: string;
  wrap?: boolean;
  as?: keyof JSX.IntrinsicElements;
}

const Flex = styled.div<FlexProps>`
  display: flex;
  flex-direction: ${({ direction = "row" }) => direction};
  align-items: ${({ align = "stretch" }) => align};
  justify-content: ${({ justify = "flex-start" }) => justify};
  gap: ${({ gap = "0" }) => gap};
  flex-wrap: ${({ wrap }) => (wrap ? "wrap" : "nowrap")};
`;

// Usage
function Layout() {
  return (
    <Flex direction="column" gap="1rem">
      <Flex as="header" justify="space-between" align="center">
        <h1>Title</h1>
        <nav>Navigation</nav>
      </Flex>
      <Flex as="main" direction="column" gap="2rem">
        <section>Content</section>
      </Flex>
    </Flex>
  );
}
```

## Theming System

### Theme Definition

```tsx
// theme.ts
export const lightTheme = {
  colors: {
    primary: "#007bff",
    secondary: "#6c757d",
    success: "#28a745",
    danger: "#dc3545",
    warning: "#ffc107",
    info: "#17a2b8",
    background: "#ffffff",
    surface: "#f8f9fa",
    text: "#212529",
    textSecondary: "#6c757d",
    border: "#dee2e6",
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    xxl: "3rem",
  },
  breakpoints: {
    mobile: "576px",
    tablet: "768px",
    desktop: "992px",
    large: "1200px",
  },
  borderRadius: {
    sm: "2px",
    md: "4px",
    lg: "8px",
    xl: "12px",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 3px rgba(0, 0, 0, 0.12)",
    md: "0 4px 6px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px rgba(0, 0, 0, 0.1)",
  },
};

export const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: "#4dabf7",
    background: "#1a1a1a",
    surface: "#2d2d2d",
    text: "#ffffff",
    textSecondary: "#b3b3b3",
    border: "#404040",
  },
};

export type Theme = typeof lightTheme;
```

### Theme Provider Setup

```tsx
// ThemeProvider.tsx
import React, { createContext, useContext, useState } from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { lightTheme, darkTheme, Theme } from "./theme";

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark(!isDark);
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
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
```

### Using Theme in Components

```tsx
const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: all 0.2s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.lg};
    transform: translateY(-2px);
  }
`;

const ResponsiveContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    padding: ${({ theme }) => theme.spacing.xl};
  }
`;

const ThemeToggle = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

function App() {
  const { toggleTheme, isDark } = useTheme();

  return (
    <ResponsiveContainer>
      <Card>
        <h1>Themed Component</h1>
        <p>This component adapts to the current theme.</p>
        <ThemeToggle onClick={toggleTheme}>
          Switch to {isDark ? "Light" : "Dark"} Theme
        </ThemeToggle>
      </Card>
    </ResponsiveContainer>
  );
}
```

## Animation and Transitions

```tsx
import styled, { keyframes, css } from "styled-components";

// Keyframe animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const Modal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  ${({ isOpen }) =>
    isOpen
      ? css`
          animation: ${fadeIn} 0.3s ease-out;
        `
      : css`
          display: none;
        `}
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  animation: ${slideUp} 0.3s ease-out;
`;

const PulseButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    animation: ${pulse} 0.5s ease-in-out;
  }
`;
```

## Server-Side Rendering

```tsx
// _document.tsx (Next.js)
import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";
import { ServerStyleSheet } from "styled-components";

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
```

## Performance Optimization

### Styled Components Configuration

```tsx
// babel.config.js
module.exports = {
  plugins: [
    [
      "babel-plugin-styled-components",
      {
        displayName: true,
        fileName: true,
        minify: true,
        transpileTemplateLiterals: true,
      },
    ],
  ],
};
```

### Component Memoization

```tsx
import React, { memo } from "react";
import styled from "styled-components";

const ExpensiveComponent = styled.div`
  /* Complex styles */
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
`;

export default memo(ExpensiveComponent);
```

### CSS Helper Functions

```tsx
// utils/styled.ts
import { css } from "styled-components";

export const truncateText = css`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const visuallyHidden = css`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

export const clearfix = css`
  &::after {
    content: "";
    display: table;
    clear: both;
  }
`;

export const aspectRatio = (ratio: string) => css`
  position: relative;

  &::before {
    content: "";
    display: block;
    padding-top: ${ratio};
  }

  > * {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;
```

## Best Practices

### Component Organization

```tsx
// Button/index.tsx
export { default } from "./Button";
export type { ButtonProps } from "./Button";

// Button/Button.tsx
import React from "react";
import { StyledButton, LoadingSpinner } from "./Button.styles";

export interface ButtonProps {
  variant?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

function Button({ children, loading, ...props }: ButtonProps) {
  return (
    <StyledButton {...props}>
      {loading && <LoadingSpinner />}
      {children}
    </StyledButton>
  );
}

export default Button;

// Button/Button.styles.ts
import styled from "styled-components";
import { ButtonProps } from "./Button";

export const StyledButton = styled.button<ButtonProps>`
  /* Styles here */
`;

export const LoadingSpinner = styled.div`
  /* Spinner styles */
`;
```

### Type Safety

```tsx
interface StyledProps {
  $primary?: boolean;
  $size?: "small" | "large";
}

const Button = styled.button<StyledProps>`
  background: ${({ $primary, theme }) =>
    $primary ? theme.colors.primary : theme.colors.secondary};

  ${({ $size }) =>
    $size === "small" &&
    css`
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
    `}
`;

// Usage with transient props (prefixed with $)
<Button $primary $size="small">
  Click me
</Button>;
```

## Styled Components vs Alternatives

| Feature            | Styled Components | Emotion   | CSS Modules |
| ------------------ | ----------------- | --------- | ----------- |
| **Learning Curve** | Medium            | Medium    | Low         |
| **Bundle Size**    | Medium            | Small     | Minimal     |
| **Dynamic Styles** | Excellent         | Excellent | Limited     |
| **Theming**        | Built-in          | Good      | Manual      |
| **Performance**    | Good              | Better    | Best        |
| **TypeScript**     | Excellent         | Good      | Good        |

## Common Pitfalls

### Avoid Styled Components in Render

```tsx
// ❌ Bad: Creates new component on every render
function App() {
  const StyledDiv = styled.div`
    color: red;
  `;

  return <StyledDiv>Content</StyledDiv>;
}

// ✅ Good: Define outside component
const StyledDiv = styled.div`
  color: red;
`;

function App() {
  return <StyledDiv>Content</StyledDiv>;
}
```

### Prop Forwarding Issues

```tsx
// ❌ Bad: All props forwarded to DOM
const Button = styled.button<{ loading: boolean }>`
  /* styles */
`;

// ✅ Good: Use transient props or shouldForwardProp
const Button = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== "loading",
})<{ loading: boolean }>`
  /* styles */
`;

// Or use transient props
const Button = styled.button<{ $loading: boolean }>`
  /* styles */
`;
```

## Interview Questions

**Q: What are the advantages of Styled Components over traditional CSS?**
A: Dynamic styling based on props, automatic scoping, built-in theming, no class name collisions, and seamless JavaScript integration.

**Q: How do you handle performance concerns with Styled Components?**
A: Use the babel plugin, avoid creating styled components in render, memoize expensive components, and consider CSS extraction for SSG.

**Q: What's the difference between CSS-in-JS and CSS Modules?**
A: CSS-in-JS provides runtime dynamic styling and theming but has larger bundle sizes, while CSS Modules offer build-time optimization with limited dynamic capabilities.

**Q: How do you implement responsive design with Styled Components?**
A: Use theme breakpoints, media query helpers, and props-based conditional styling for responsive behavior.

**Q: What are transient props in Styled Components?**
A: Props prefixed with $ that are consumed by styled components but not passed to the underlying DOM element, preventing React warnings.
