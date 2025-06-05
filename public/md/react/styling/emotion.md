# Emotion CSS-in-JS with React

Emotion is a performant and flexible CSS-in-JS library designed for writing CSS styles with JavaScript. It provides a powerful API for styling React components with great runtime performance and developer experience.

## Installation and Setup

### Installation

```bash
pnpm install @emotion/react @emotion/styled

# For CSS prop support
pnpm install @emotion/babel-plugin
```

### TypeScript Support

```bash
pnpm install @types/react
```

### Babel Configuration

```javascript
// .babelrc or babel.config.js
{
  "presets": ["@babel/preset-react"],
  "plugins": ["@emotion/babel-plugin"]
}
```

### CSS Prop JSX Pragma

```typescript
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
```

## Basic Usage

### Styled Components

```tsx
import styled from "@emotion/styled";

const Button = styled.button`
  background-color: ${(props) => (props.primary ? "#007bff" : "#6c757d")};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.primary ? "#0056b3" : "#545b62")};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

function App() {
  return (
    <div>
      <Button primary>Primary Button</Button>
      <Button>Secondary Button</Button>
      <Button disabled>Disabled Button</Button>
    </div>
  );
}
```

### CSS Prop

```tsx
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const cardStyle = css`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin: 16px 0;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }
`;

function Card({ children }) {
  return <div css={cardStyle}>{children}</div>;
}

function DynamicCard({ danger, success, children }) {
  return (
    <div
      css={[
        cardStyle,
        danger &&
          css`
            border-left: 4px solid #dc3545;
            background: #fff5f5;
          `,
        success &&
          css`
            border-left: 4px solid #28a745;
            background: #f5fff5;
          `,
      ]}
    >
      {children}
    </div>
  );
}
```

## Advanced Patterns

### Component Variants

```tsx
import styled from "@emotion/styled";

interface ButtonProps {
  variant?: "primary" | "secondary" | "danger" | "success";
  size?: "small" | "medium" | "large";
}

const getVariantStyles = (variant: string) => {
  const variants = {
    primary: css`
      background: #007bff;
      color: white;
      &:hover {
        background: #0056b3;
      }
    `,
    secondary: css`
      background: #6c757d;
      color: white;
      &:hover {
        background: #545b62;
      }
    `,
    danger: css`
      background: #dc3545;
      color: white;
      &:hover {
        background: #c82333;
      }
    `,
    success: css`
      background: #28a745;
      color: white;
      &:hover {
        background: #1e7e34;
      }
    `,
  };
  return variants[variant] || variants.primary;
};

const getSizeStyles = (size: string) => {
  const sizes = {
    small: css`
      padding: 8px 16px;
      font-size: 14px;
    `,
    medium: css`
      padding: 12px 24px;
      font-size: 16px;
    `,
    large: css`
      padding: 16px 32px;
      font-size: 18px;
    `,
  };
  return sizes[size] || sizes.medium;
};

const StyledButton = styled.button<ButtonProps>`
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;

  ${(props) => getVariantStyles(props.variant || "primary")}
  ${(props) => getSizeStyles(props.size || "medium")}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

function Button({
  variant = "primary",
  size = "medium",
  children,
  ...props
}: ButtonProps) {
  return (
    <StyledButton variant={variant} size={size} {...props}>
      {children}
    </StyledButton>
  );
}
```

### Composition and Inheritance

```tsx
import styled from "@emotion/styled";

const BaseButton = styled.button`
  border: none;
  border-radius: 4px;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
`;

const PrimaryButton = styled(BaseButton)`
  background: #007bff;
  color: white;

  &:hover {
    background: #0056b3;
  }
`;

const OutlineButton = styled(BaseButton)`
  background: transparent;
  border: 2px solid #007bff;
  color: #007bff;

  &:hover {
    background: #007bff;
    color: white;
  }
`;

const IconButton = styled(PrimaryButton)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

function ButtonShowcase() {
  return (
    <div>
      <PrimaryButton>Primary</PrimaryButton>
      <OutlineButton>Outline</OutlineButton>
      <IconButton>
        <span>🚀</span>
        With Icon
      </IconButton>
    </div>
  );
}
```

## Theming System

### Theme Provider Setup

```tsx
import { ThemeProvider } from "@emotion/react";

const theme = {
  colors: {
    primary: "#007bff",
    secondary: "#6c757d",
    success: "#28a745",
    danger: "#dc3545",
    warning: "#ffc107",
    info: "#17a2b8",
    light: "#f8f9fa",
    dark: "#343a40",
    white: "#ffffff",
    gray: {
      100: "#f8f9fa",
      200: "#e9ecef",
      300: "#dee2e6",
      400: "#ced4da",
      500: "#adb5bd",
      600: "#6c757d",
      700: "#495057",
      800: "#343a40",
      900: "#212529",
    },
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
  },
  typography: {
    fontSizes: {
      xs: "12px",
      sm: "14px",
      md: "16px",
      lg: "18px",
      xl: "20px",
      xxl: "24px",
    },
    fontWeights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.7,
    },
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },
  shadows: {
    sm: "0 1px 3px rgba(0, 0, 0, 0.12)",
    md: "0 4px 6px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px rgba(0, 0, 0, 0.1)",
  },
  borderRadius: {
    sm: "2px",
    md: "4px",
    lg: "8px",
    xl: "12px",
    full: "9999px",
  },
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppContent />
    </ThemeProvider>
  );
}
```

### Using Theme in Components

```tsx
import styled from "@emotion/styled";
import { useTheme } from "@emotion/react";

const ThemedButton = styled.button`
  background: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.white};
  padding: ${(props) => props.theme.spacing.md} ${(props) =>
      props.theme.spacing.lg};
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.typography.fontSizes.md};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  box-shadow: ${(props) => props.theme.shadows.sm};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => props.theme.colors.secondary};
    box-shadow: ${(props) => props.theme.shadows.md};
  }

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    padding: ${(props) => props.theme.spacing.lg} ${(props) =>
        props.theme.spacing.xl};
    font-size: ${(props) => props.theme.typography.fontSizes.lg};
  }
`;

function ThemedComponent() {
  const theme = useTheme();

  return (
    <div
      css={{
        background: theme.colors.gray[100],
        padding: theme.spacing.xl,
        borderRadius: theme.borderRadius.lg,
      }}
    >
      <ThemedButton>Themed Button</ThemedButton>
    </div>
  );
}
```

## Dark Mode Implementation

```tsx
import { useState, createContext, useContext } from "react";
import { ThemeProvider } from "@emotion/react";

const lightTheme = {
  colors: {
    background: "#ffffff",
    surface: "#f8f9fa",
    text: "#212529",
    textSecondary: "#6c757d",
    primary: "#007bff",
    border: "#dee2e6",
  },
};

const darkTheme = {
  colors: {
    background: "#1a1a1a",
    surface: "#2d2d2d",
    text: "#ffffff",
    textSecondary: "#adb5bd",
    primary: "#4dabf7",
    border: "#495057",
  },
};

const ThemeContext = createContext({
  isDark: false,
  toggleTheme: () => {},
});

const Container = styled.div`
  background: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  min-height: 100vh;
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const Card = styled.div`
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 8px;
  padding: 24px;
  margin: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ToggleButton = styled.button`
  background: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

function ThemeContextProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

function App() {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  return (
    <Container>
      <Card>
        <h1>Theme Switcher Demo</h1>
        <p>Current theme: {isDark ? "Dark" : "Light"}</p>
        <ToggleButton onClick={toggleTheme}>
          Switch to {isDark ? "Light" : "Dark"} Theme
        </ToggleButton>
      </Card>
    </Container>
  );
}
```

## Animations and Transitions

```tsx
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const AnimatedCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.6s ease-out;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const PulseButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  animation: ${pulse} 2s infinite;

  &:hover {
    animation-play-state: paused;
  }
`;

const SlidePanel = styled.div`
  background: #f8f9fa;
  border-right: 1px solid #dee2e6;
  height: 100vh;
  width: 250px;
  position: fixed;
  left: 0;
  top: 0;
  animation: ${slideIn} 0.3s ease-out;
  z-index: 1000;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: ${keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  `} 1s linear infinite;
`;

function AnimatedDemo() {
  return (
    <div>
      <AnimatedCard>
        <h3>Animated Card</h3>
        <p>This card animates in and has hover effects.</p>
        <PulseButton>Pulsing Button</PulseButton>
      </AnimatedCard>

      <div
        css={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          padding: "20px",
        }}
      >
        <LoadingSpinner />
        <span>Loading...</span>
      </div>
    </div>
  );
}
```

## Performance Optimization

### Object Styles Caching

```tsx
import { useMemo } from "react";

function OptimizedComponent({ color, size, isActive }) {
  const styles = useMemo(
    () => ({
      button: css`
        background: ${color};
        font-size: ${size}px;
        opacity: ${isActive ? 1 : 0.6};
        transition: all 0.2s ease;
      `,
      container: css`
        display: flex;
        align-items: center;
        gap: 16px;
      `,
    }),
    [color, size, isActive]
  );

  return (
    <div css={styles.container}>
      <button css={styles.button}>Optimized Button</button>
    </div>
  );
}
```

### Conditional Styles Optimization

```tsx
const Button = styled.button`
  ${({ variant, size, fullWidth }) => css`
    // Base styles
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    // Conditional styles applied efficiently
    ${variant === "primary" &&
    css`
      background: #007bff;
      color: white;
      &:hover {
        background: #0056b3;
      }
    `}

    ${variant === "outline" &&
    css`
      background: transparent;
      border: 2px solid #007bff;
      color: #007bff;
      &:hover {
        background: #007bff;
        color: white;
      }
    `}
    
    ${size === "small" &&
    css`
      padding: 8px 16px;
      font-size: 14px;
    `}
    
    ${size === "large" &&
    css`
      padding: 16px 32px;
      font-size: 18px;
    `}
    
    ${fullWidth &&
    css`
      width: 100%;
    `}
  `}
`;
```

## Best Practices

### Component Organization

```
components/
├── Button/
│   ├── Button.tsx
│   ├── Button.styles.ts
│   ├── Button.types.ts
│   ├── Button.test.tsx
│   └── index.ts
├── Card/
│   ├── Card.tsx
│   ├── Card.styles.ts
│   └── index.ts
└── theme/
    ├── colors.ts
    ├── typography.ts
    ├── spacing.ts
    └── index.ts
```

### Separating Styles

```typescript
// Button.styles.ts
import styled, { css } from "@emotion/styled";

export const baseButtonStyles = css`
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
`;

export const StyledButton = styled.button`
  ${baseButtonStyles}

  ${(props) =>
    props.variant === "primary" &&
    css`
      background: ${props.theme.colors.primary};
      color: white;
    `}
`;

// Button.tsx
import { StyledButton } from "./Button.styles";

export function Button({ children, ...props }) {
  return <StyledButton {...props}>{children}</StyledButton>;
}
```

### Type Safety

```typescript
// Button.types.ts
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

// Button.tsx
const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "medium",
  fullWidth = false,
  loading = false,
  icon,
  children,
  disabled,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner />}
      {icon && <IconWrapper>{icon}</IconWrapper>}
      {children}
    </StyledButton>
  );
};
```

## Common Pitfalls

### Avoid Dynamic Styles in Render

```tsx
// ❌ Bad - Creates new styles on every render
function BadComponent({ color }) {
  return (
    <div
      css={css`
        background: ${color};
      `}
    >
      Content
    </div>
  );
}

// ✅ Good - Memoize dynamic styles
function GoodComponent({ color }) {
  const styles = useMemo(
    () => css`
      background: ${color};
    `,
    [color]
  );

  return <div css={styles}>Content</div>;
}
```

### Prefer Theme Values

```tsx
// ❌ Bad - Hardcoded values
const Button = styled.button`
  background: #007bff;
  padding: 12px 24px;
  font-size: 16px;
`;

// ✅ Good - Use theme values
const Button = styled.button`
  background: ${(props) => props.theme.colors.primary};
  padding: ${(props) => props.theme.spacing.md} ${(props) =>
      props.theme.spacing.lg};
  font-size: ${(props) => props.theme.typography.fontSizes.md};
`;
```

## Comparison with Other Solutions

| Feature              | Emotion   | Styled Components | CSS Modules | Tailwind  |
| -------------------- | --------- | ----------------- | ----------- | --------- |
| Runtime              | Yes       | Yes               | No          | No        |
| Bundle Size          | Small     | Medium            | Small       | Small     |
| CSS-in-JS            | Yes       | Yes               | No          | No        |
| Theme Support        | Excellent | Excellent         | Manual      | Built-in  |
| Performance          | Excellent | Good              | Excellent   | Excellent |
| Developer Experience | Excellent | Excellent         | Good        | Good      |
| SSR Support          | Yes       | Yes               | Yes         | Yes       |
| Dynamic Styles       | Easy      | Easy              | Difficult   | Difficult |

## Interview Questions

**Q: What are the main differences between Emotion and Styled Components?**

A: Key differences include:

- Bundle size: Emotion is smaller
- Performance: Emotion has better runtime performance
- API: Emotion provides both `styled` and `css` APIs
- Theming: Both support theming but Emotion's is more flexible
- SSR: Emotion has better SSR support out of the box

**Q: How does Emotion handle CSS extraction and optimization?**

A: Emotion uses several optimization techniques:

- Automatic CSS deduplication
- Critical CSS extraction
- Dead code elimination
- Runtime style injection optimization
- Compile-time optimizations with babel plugin

**Q: How would you implement responsive design with Emotion?**

A: Multiple approaches:

```tsx
// Using theme breakpoints
const ResponsiveComponent = styled.div`
  padding: 16px;

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    padding: 32px;
  }
`;

// Using CSS-in-JS with helper functions
const mqUp = (breakpoint) => `@media (min-width: ${breakpoint})`;

const Component = () => (
  <div
    css={css`
      font-size: 14px;
      ${mqUp("768px")} {
        font-size: 16px;
      }
    `}
  >
    Content
  </div>
);
```

**Q: How do you handle TypeScript with Emotion?**

A: TypeScript integration involves:

- Installing `@types/react`
- Using JSX pragma for css prop
- Typing theme interface
- Creating typed styled components
- Using proper prop interfaces for components

This comprehensive guide covers Emotion's key concepts, advanced patterns, performance optimization, and best practices for building maintainable React applications with CSS-in-JS.
