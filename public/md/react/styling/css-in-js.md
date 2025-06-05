# CSS-in-JS in React

CSS-in-JS is a styling technique where CSS is composed using JavaScript instead of defined in external files. This approach enables dynamic styling, better component encapsulation, and powerful theming capabilities in React applications.

## What is CSS-in-JS?

CSS-in-JS allows developers to write CSS styles directly within JavaScript/TypeScript files, providing several benefits:

- **Dynamic Styling**: Styles can change based on props, state, or any JavaScript logic
- **Component Encapsulation**: Styles are scoped to components, preventing global CSS conflicts
- **Better Developer Experience**: IntelliSense, type checking, and refactoring support
- **Performance Optimizations**: Dead code elimination and automatic vendor prefixing
- **Theming**: Powerful theme systems with runtime theme switching

## Popular CSS-in-JS Libraries

| Library               | Bundle Size | Runtime | Performance | Learning Curve |
| --------------------- | ----------- | ------- | ----------- | -------------- |
| **Emotion**           | ~7kb        | Yes     | Excellent   | Easy           |
| **Styled Components** | ~12kb       | Yes     | Good        | Easy           |
| **JSS**               | ~15kb       | Yes     | Good        | Medium         |
| **Stitches**          | ~5kb        | Minimal | Excellent   | Medium         |
| **Vanilla Extract**   | 0kb         | No      | Excellent   | Hard           |
| **Linaria**           | 0kb         | No      | Excellent   | Medium         |

## Core Concepts

### Template Literals

```tsx
import styled from "styled-components"; // or @emotion/styled

const Button = styled.button`
  background: ${(props) => (props.primary ? "#007bff" : "#6c757d")};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

function App() {
  return (
    <div>
      <Button primary>Primary Button</Button>
      <Button>Secondary Button</Button>
    </div>
  );
}
```

### Object Styles

```tsx
import { css } from "@emotion/react";

const buttonStyles = {
  base: {
    border: "none",
    borderRadius: "4px",
    padding: "12px 24px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  primary: {
    background: "#007bff",
    color: "white",
    "&:hover": {
      background: "#0056b3",
    },
  },
  secondary: {
    background: "#6c757d",
    color: "white",
    "&:hover": {
      background: "#545b62",
    },
  },
};

function Button({ variant = "primary", children, ...props }) {
  return (
    <button css={[buttonStyles.base, buttonStyles[variant]]} {...props}>
      {children}
    </button>
  );
}
```

## Advanced Patterns

### Dynamic Theming

```tsx
import { ThemeProvider } from "styled-components";
import { useState } from "react";

const lightTheme = {
  colors: {
    primary: "#007bff",
    background: "#ffffff",
    text: "#333333",
    surface: "#f8f9fa",
  },
  spacing: {
    small: "8px",
    medium: "16px",
    large: "24px",
  },
};

const darkTheme = {
  colors: {
    primary: "#4dabf7",
    background: "#1a1a1a",
    text: "#ffffff",
    surface: "#2d2d2d",
  },
  spacing: {
    small: "8px",
    medium: "16px",
    large: "24px",
  },
};

const Container = styled.div`
  background: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  min-height: 100vh;
  padding: ${(props) => props.theme.spacing.large};
  transition: all 0.3s ease;
`;

const Card = styled.div`
  background: ${(props) => props.theme.colors.surface};
  padding: ${(props) => props.theme.spacing.large};
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: ${(props) => props.theme.spacing.medium};
`;

const ToggleButton = styled.button`
  background: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  padding: ${(props) => props.theme.spacing.small} ${(props) =>
      props.theme.spacing.medium};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

function App() {
  const [isDark, setIsDark] = useState(false);

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <Container>
        <Card>
          <h1>Theme Demo</h1>
          <p>Current theme: {isDark ? "Dark" : "Light"}</p>
          <ToggleButton onClick={() => setIsDark(!isDark)}>
            Switch Theme
          </ToggleButton>
        </Card>
      </Container>
    </ThemeProvider>
  );
}
```

### Component Variants

```tsx
import styled, { css } from "styled-components";

interface ButtonProps {
  variant?: "solid" | "outline" | "ghost";
  size?: "small" | "medium" | "large";
  color?: "primary" | "secondary" | "success" | "danger";
  fullWidth?: boolean;
}

const getVariantStyles = (variant: string, color: string) => {
  const variants = {
    solid: css`
      background: ${(props) => props.theme.colors[color]};
      color: white;
      border: 2px solid ${(props) => props.theme.colors[color]};
    `,
    outline: css`
      background: transparent;
      color: ${(props) => props.theme.colors[color]};
      border: 2px solid ${(props) => props.theme.colors[color]};

      &:hover {
        background: ${(props) => props.theme.colors[color]};
        color: white;
      }
    `,
    ghost: css`
      background: transparent;
      color: ${(props) => props.theme.colors[color]};
      border: 2px solid transparent;

      &:hover {
        background: ${(props) => props.theme.colors[color]}20;
      }
    `,
  };
  return variants[variant] || variants.solid;
};

const getSizeStyles = (size: string) => {
  const sizes = {
    small: css`
      padding: 6px 12px;
      font-size: 14px;
    `,
    medium: css`
      padding: 10px 20px;
      font-size: 16px;
    `,
    large: css`
      padding: 14px 28px;
      font-size: 18px;
    `,
  };
  return sizes[size] || sizes.medium;
};

const StyledButton = styled.button<ButtonProps>`
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  ${(props) =>
    getVariantStyles(props.variant || "solid", props.color || "primary")}
  ${(props) => getSizeStyles(props.size || "medium")}
  
  ${(props) =>
    props.fullWidth &&
    css`
      width: 100%;
    `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

function Button({ children, ...props }: ButtonProps) {
  return <StyledButton {...props}>{children}</StyledButton>;
}

function ButtonShowcase() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", gap: "8px" }}>
        <Button variant="solid" color="primary">
          Solid Primary
        </Button>
        <Button variant="outline" color="primary">
          Outline Primary
        </Button>
        <Button variant="ghost" color="primary">
          Ghost Primary
        </Button>
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <Button variant="solid" color="success" size="small">
          Small
        </Button>
        <Button variant="solid" color="success" size="medium">
          Medium
        </Button>
        <Button variant="solid" color="success" size="large">
          Large
        </Button>
      </div>

      <Button variant="solid" color="danger" fullWidth>
        Full Width Button
      </Button>
    </div>
  );
}
```

### Responsive Design

```tsx
import styled from "styled-components";

const breakpoints = {
  mobile: "480px",
  tablet: "768px",
  desktop: "1024px",
  widescreen: "1200px",
};

const mediaQueries = {
  mobile: `@media (min-width: ${breakpoints.mobile})`,
  tablet: `@media (min-width: ${breakpoints.tablet})`,
  desktop: `@media (min-width: ${breakpoints.desktop})`,
  widescreen: `@media (min-width: ${breakpoints.widescreen})`,
};

const Grid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;

  ${mediaQueries.tablet} {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  ${mediaQueries.desktop} {
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }

  ${mediaQueries.widescreen} {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const ResponsiveCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  ${mediaQueries.tablet} {
    padding: 24px;
  }

  ${mediaQueries.desktop} {
    padding: 32px;
  }
`;

const ResponsiveText = styled.p`
  font-size: 14px;
  line-height: 1.4;

  ${mediaQueries.tablet} {
    font-size: 16px;
    line-height: 1.5;
  }

  ${mediaQueries.desktop} {
    font-size: 18px;
    line-height: 1.6;
  }
`;

function ResponsiveLayout() {
  return (
    <Grid>
      {Array.from({ length: 8 }, (_, i) => (
        <ResponsiveCard key={i}>
          <h3>Card {i + 1}</h3>
          <ResponsiveText>
            This card adapts to different screen sizes with responsive design.
          </ResponsiveText>
        </ResponsiveCard>
      ))}
    </Grid>
  );
}
```

## Performance Optimization

### Memoization and Caching

```tsx
import { useMemo } from "react";
import { css } from "@emotion/react";

// ❌ Bad - Creates new styles on every render
function BadComponent({ color, size }) {
  return (
    <div
      css={css`
        background: ${color};
        font-size: ${size}px;
      `}
    >
      Content
    </div>
  );
}

// ✅ Good - Memoize styles
function GoodComponent({ color, size }) {
  const styles = useMemo(
    () => css`
      background: ${color};
      font-size: ${size}px;
    `,
    [color, size]
  );

  return <div css={styles}>Content</div>;
}

// ✅ Better - Use styled components for static styles
const OptimizedComponent = styled.div`
  background: ${(props) => props.color};
  font-size: ${(props) => props.size}px;
`;
```

### Style Sharing and Composition

```tsx
import styled, { css } from "styled-components";

// Shared style fragments
const flexCenter = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const buttonBase = css`
  border: none;
  border-radius: 4px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  ${flexCenter}
`;

const Button = styled.button`
  ${buttonBase}
  background: ${(props) => props.theme.colors.primary};
  color: white;

  &:hover {
    background: ${(props) => props.theme.colors.primaryDark};
  }
`;

const IconButton = styled.button`
  ${buttonBase}
  padding: 12px;
  border-radius: 50%;
  background: transparent;
  color: ${(props) => props.theme.colors.text};

  &:hover {
    background: ${(props) => props.theme.colors.surface};
  }
`;

const Card = styled.div`
  ${flexCenter}
  flex-direction: column;
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;
```

### Critical CSS and Code Splitting

```tsx
import { lazy, Suspense } from "react";
import styled from "styled-components";

// Critical styles for above-the-fold content
const HeaderContainer = styled.header`
  background: #007bff;
  color: white;
  padding: 20px;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 20px auto;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// Lazy load components with heavy styles
const HeavyComponent = lazy(() => import("./HeavyComponent"));

function App() {
  return (
    <div>
      <HeaderContainer>
        <h1>My App</h1>
      </HeaderContainer>

      <main>
        <Suspense fallback={<LoadingSpinner />}>
          <HeavyComponent />
        </Suspense>
      </main>
    </div>
  );
}
```

## Server-Side Rendering (SSR)

### Emotion SSR Setup

```tsx
// _document.tsx (Next.js)
import Document, { Html, Head, Main, NextScript } from "next/document";
import { extractCritical } from "@emotion/server";

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    const critical = extractCritical(initialProps.html);
    initialProps.html = critical.html;
    initialProps.styles = (
      <>
        {initialProps.styles}
        <style
          data-emotion-css={critical.ids.join(" ")}
          dangerouslySetInnerHTML={{ __html: critical.css }}
        />
      </>
    );

    return initialProps;
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

### Styled Components SSR

```tsx
// _document.tsx (Next.js)
import Document from "next/document";
import { ServerStyleSheet } from "styled-components";

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
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
}
```

## Testing CSS-in-JS Components

### Jest and Testing Library

```tsx
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import Button from "./Button";

const theme = {
  colors: {
    primary: "#007bff",
    secondary: "#6c757d",
  },
};

const renderWithTheme = (component) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe("Button Component", () => {
  it("renders with primary variant styles", () => {
    renderWithTheme(<Button variant="primary">Click me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toHaveStyle({
      backgroundColor: "#007bff",
      color: "white",
    });
  });

  it("applies custom styles through props", () => {
    renderWithTheme(
      <Button variant="primary" fullWidth>
        Full Width Button
      </Button>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveStyle({
      width: "100%",
    });
  });

  it("handles theme changes", () => {
    const customTheme = {
      colors: {
        primary: "#28a745",
        secondary: "#dc3545",
      },
    };

    render(
      <ThemeProvider theme={customTheme}>
        <Button variant="primary">Themed Button</Button>
      </ThemeProvider>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveStyle({
      backgroundColor: "#28a745",
    });
  });
});
```

### Snapshot Testing

```tsx
import { create } from "react-test-renderer";
import { ThemeProvider } from "styled-components";
import Button from "./Button";

const theme = {
  colors: {
    primary: "#007bff",
    secondary: "#6c757d",
  },
};

describe("Button Snapshots", () => {
  it("matches snapshot for primary variant", () => {
    const tree = create(
      <ThemeProvider theme={theme}>
        <Button variant="primary">Primary Button</Button>
      </ThemeProvider>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("matches snapshot for all variants", () => {
    const tree = create(
      <ThemeProvider theme={theme}>
        <div>
          <Button variant="primary">Primary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </ThemeProvider>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
```

## Best Practices

### Do's and Don'ts

#### ✅ Do's

```tsx
// Use theme values consistently
const Button = styled.button`
  background: ${(props) => props.theme.colors.primary};
  padding: ${(props) => props.theme.spacing.medium};
`;

// Memoize dynamic styles
const DynamicComponent = ({ color }) => {
  const styles = useMemo(
    () => css`
      background: ${color};
    `,
    [color]
  );

  return <div css={styles}>Content</div>;
};

// Use meaningful component names
const PrimaryActionButton = styled.button`...`;
const NavigationHeader = styled.header`...`;

// Compose styles efficiently
const baseStyles = css`...`;
const primaryStyles = css`
  ${baseStyles} ...
`;
```

#### ❌ Don'ts

```tsx
// Don't create styles in render
function BadComponent() {
  return (
    <div
      css={css`
        background: red;
      `}
    >
      {" "}
      // Creates new styles every render Content
    </div>
  );
}

// Don't mix styling approaches
const MixedComponent = styled.div.attrs({
  className: "some-css-class", // Don't mix CSS classes with CSS-in-JS
})`...`;

// Don't use hardcoded values
const BadButton = styled.button`
  background: #007bff; // Use theme values instead
  padding: 12px 24px; // Use spacing from theme
`;

// Don't create deeply nested components
const OverlyComplexComponent = styled.div`
  .header {
    .title {
      .text {
        .span { ... } // Too deeply nested
      }
    }
  }
`;
```

### Performance Tips

1. **Use styled components for static styles**
2. **Memoize dynamic styles with useMemo**
3. **Prefer object styles for frequently changing properties**
4. **Use CSS prop for one-off styles**
5. **Implement proper SSR for faster initial load**
6. **Split large style objects**
7. **Use theme values consistently**

## Common Pitfalls

### Runtime Performance Issues

```tsx
// ❌ Problem: Recreating styles on every render
function SlowComponent({ items }) {
  return (
    <div>
      {items.map((item) => (
        <div
          key={item.id}
          css={css`
            background: ${item.color};
            padding: 16px;
          `}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
}

// ✅ Solution: Pre-compute or memoize styles
const ItemContainer = styled.div`
  padding: 16px;
  background: ${(props) => props.color};
`;

function FastComponent({ items }) {
  return (
    <div>
      {items.map((item) => (
        <ItemContainer key={item.id} color={item.color}>
          {item.name}
        </ItemContainer>
      ))}
    </div>
  );
}
```

### Bundle Size Optimization

```tsx
// ❌ Problem: Importing entire library
import styled from "styled-components";

// ✅ Solution: Tree shaking (modern bundlers handle this)
import styled from "styled-components";

// For older bundlers, use specific imports
import { css } from "@emotion/react";
import styled from "@emotion/styled";
```

## Interview Questions

**Q: What are the main advantages and disadvantages of CSS-in-JS?**

A: **Advantages:**

- Dynamic styling based on props/state
- Component encapsulation and scoping
- Dead code elimination
- Better developer experience with IntelliSense
- Powerful theming capabilities
- No CSS naming conflicts

**Disadvantages:**

- Runtime overhead
- Larger bundle sizes
- Learning curve
- Potential performance issues if misused
- SEO considerations for SSR

**Q: How does CSS-in-JS handle performance compared to traditional CSS?**

A: CSS-in-JS can be slower due to runtime style generation, but offers optimizations like:

- Style deduplication
- Critical CSS extraction
- Component-level code splitting
- Automatic vendor prefixing
- Dead code elimination

Modern libraries like Emotion and Stitches have minimal runtime overhead.

**Q: Explain the difference between styled components and css prop approaches.**

A: **Styled Components:**

- Creates reusable styled elements
- Better for design systems
- Easier to compose and extend
- Better TypeScript support

**CSS Prop:**

- More flexible for one-off styles
- Closer to traditional CSS
- Better for prototyping
- Can be more performant for simple styles

**Q: How would you implement a responsive design system with CSS-in-JS?**

A: Implementation involves:

- Defining breakpoints in theme
- Creating responsive utility functions
- Using media queries in styled components
- Implementing container queries where needed
- Building responsive typography scales
- Creating responsive spacing systems

This comprehensive guide covers CSS-in-JS fundamentals, advanced patterns, performance optimization, and best practices for React applications.
