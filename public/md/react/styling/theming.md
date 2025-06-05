# Theming in React

Theming is a design system approach that allows you to define and manage consistent visual styles across your React application. It enables dynamic style switching, maintains design consistency, and provides a centralized way to manage colors, typography, spacing, and other design tokens.

## What is Theming?

A theme is a collection of design tokens that define the visual appearance of your application:

- **Colors**: Primary, secondary, semantic colors, and color schemes
- **Typography**: Font families, sizes, weights, and line heights
- **Spacing**: Margins, paddings, and layout dimensions
- **Components**: Default styles and variants for UI components
- **Breakpoints**: Responsive design configurations
- **Shadows, borders, and other visual properties**

## Theme Structure

### Basic Theme Object

```typescript
interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    error: string;
    warning: string;
    success: string;
    info: string;
  };
  typography: {
    fontFamily: {
      primary: string;
      secondary: string;
      mono: string;
    };
    fontSize: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
    };
    fontWeight: {
      light: number;
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
}

const lightTheme: Theme = {
  colors: {
    primary: "#007bff",
    secondary: "#6c757d",
    background: "#ffffff",
    surface: "#f8f9fa",
    text: "#212529",
    textSecondary: "#6c757d",
    error: "#dc3545",
    warning: "#ffc107",
    success: "#28a745",
    info: "#17a2b8",
  },
  typography: {
    fontFamily: {
      primary: '"Inter", system-ui, sans-serif',
      secondary: '"Playfair Display", serif',
      mono: '"JetBrains Mono", "Fira Code", monospace',
    },
    fontSize: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      md: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      xxl: "1.5rem", // 24px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  spacing: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    xxl: "3rem", // 48px
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },
  shadows: {
    sm: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
    md: "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)",
  },
  borderRadius: {
    sm: "0.125rem", // 2px
    md: "0.375rem", // 6px
    lg: "0.5rem", // 8px
    full: "9999px",
  },
};

const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    primary: "#4dabf7",
    secondary: "#adb5bd",
    background: "#1a1a1a",
    surface: "#2d2d2d",
    text: "#ffffff",
    textSecondary: "#adb5bd",
    error: "#ff6b6b",
    warning: "#ffd43b",
    success: "#51cf66",
    info: "#74c0fc",
  },
};
```

## Theme Providers

### Context API Theme Provider

```tsx
import React, { createContext, useContext, useState, useEffect } from "react";

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: "light" | "dark";
  persistTheme?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
  persistTheme = true,
}: ThemeProviderProps) {
  const [isDark, setIsDark] = useState(() => {
    if (persistTheme && typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      return saved ? saved === "dark" : defaultTheme === "dark";
    }
    return defaultTheme === "dark";
  });

  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setIsDark((prev) => {
      const newValue = !prev;
      if (persistTheme && typeof window !== "undefined") {
        localStorage.setItem("theme", newValue ? "dark" : "light");
      }
      return newValue;
    });
  };

  const setTheme = (newTheme: Theme) => {
    // Custom theme logic
  };

  // Apply theme to CSS custom properties
  useEffect(() => {
    const root = document.documentElement;

    // Set CSS custom properties
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });

    // Set dark mode class
    root.classList.toggle("dark", isDark);
  }, [theme, isDark]);

  const value = {
    theme,
    isDark,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
```

### Styled Components Theme Provider

```tsx
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { useTheme } from "./ThemeContext";

function StyledComponentsThemeProvider({ children }) {
  const { theme } = useTheme();

  return <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>;
}

function App() {
  return (
    <ThemeProvider>
      <StyledComponentsThemeProvider>
        <AppContent />
      </StyledComponentsThemeProvider>
    </ThemeProvider>
  );
}
```

## Theme-Aware Components

### Using Theme with Styled Components

```tsx
import styled from "styled-components";

const Card = styled.div`
  background: ${(props) => props.theme.colors.surface};
  color: ${(props) => props.theme.colors.text};
  padding: ${(props) => props.theme.spacing.lg};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  box-shadow: ${(props) => props.theme.shadows.md};
  margin-bottom: ${(props) => props.theme.spacing.md};
  transition: all 0.3s ease;

  &:hover {
    box-shadow: ${(props) => props.theme.shadows.lg};
    transform: translateY(-2px);
  }
`;

const Button = styled.button`
  background: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  padding: ${(props) => props.theme.spacing.sm} ${(props) =>
      props.theme.spacing.lg};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.typography.fontSize.md};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  font-family: ${(props) => props.theme.typography.fontFamily.primary};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  ${(props) =>
    props.variant === "secondary" &&
    `
    background: ${props.theme.colors.secondary};
  `}

  ${(props) =>
    props.variant === "outline" &&
    `
    background: transparent;
    border: 2px solid ${props.theme.colors.primary};
    color: ${props.theme.colors.primary};
    
    &:hover {
      background: ${props.theme.colors.primary};
      color: white;
    }
  `}
`;

const Typography = styled.div`
  font-family: ${(props) => props.theme.typography.fontFamily.primary};
  color: ${(props) => props.theme.colors.text};
  line-height: ${(props) => props.theme.typography.lineHeight.normal};

  &.heading {
    font-size: ${(props) => props.theme.typography.fontSize.xxl};
    font-weight: ${(props) => props.theme.typography.fontWeight.bold};
    margin-bottom: ${(props) => props.theme.spacing.lg};
  }

  &.subheading {
    font-size: ${(props) => props.theme.typography.fontSize.lg};
    font-weight: ${(props) => props.theme.typography.fontWeight.semibold};
    color: ${(props) => props.theme.colors.textSecondary};
    margin-bottom: ${(props) => props.theme.spacing.md};
  }

  &.body {
    font-size: ${(props) => props.theme.typography.fontSize.md};
    font-weight: ${(props) => props.theme.typography.fontWeight.normal};
    line-height: ${(props) => props.theme.typography.lineHeight.relaxed};
  }
`;
```

### Using Theme with CSS-in-JS (Emotion)

```tsx
import { css } from "@emotion/react";
import { useTheme } from "./ThemeContext";

function ThemedCard({ children }) {
  const { theme } = useTheme();

  const cardStyles = css`
    background: ${theme.colors.surface};
    color: ${theme.colors.text};
    padding: ${theme.spacing.lg};
    border-radius: ${theme.borderRadius.lg};
    box-shadow: ${theme.shadows.md};
    margin-bottom: ${theme.spacing.md};
    transition: all 0.3s ease;

    &:hover {
      box-shadow: ${theme.shadows.lg};
      transform: translateY(-2px);
    }
  `;

  return <div css={cardStyles}>{children}</div>;
}

function ThemedButton({ variant = "primary", children, ...props }) {
  const { theme } = useTheme();

  const baseStyles = css`
    border: none;
    padding: ${theme.spacing.sm} ${theme.spacing.lg};
    border-radius: ${theme.borderRadius.md};
    font-size: ${theme.typography.fontSize.md};
    font-weight: ${theme.typography.fontWeight.medium};
    font-family: ${theme.typography.fontFamily.primary};
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

  const variantStyles = {
    primary: css`
      background: ${theme.colors.primary};
      color: white;
    `,
    secondary: css`
      background: ${theme.colors.secondary};
      color: white;
    `,
    outline: css`
      background: transparent;
      border: 2px solid ${theme.colors.primary};
      color: ${theme.colors.primary};

      &:hover {
        background: ${theme.colors.primary};
        color: white;
      }
    `,
  };

  return (
    <button css={[baseStyles, variantStyles[variant]]} {...props}>
      {children}
    </button>
  );
}
```

## Advanced Theming Patterns

### Nested Themes

```tsx
interface ThemeVariant extends Theme {
  name: string;
  parent?: string;
}

const corporateTheme: ThemeVariant = {
  ...lightTheme,
  name: "corporate",
  colors: {
    ...lightTheme.colors,
    primary: "#2c3e50",
    secondary: "#34495e",
    background: "#ecf0f1",
  },
};

const gameTheme: ThemeVariant = {
  ...darkTheme,
  name: "game",
  colors: {
    ...darkTheme.colors,
    primary: "#e74c3c",
    secondary: "#f39c12",
    background: "#0f0f0f",
  },
  typography: {
    ...darkTheme.typography,
    fontFamily: {
      ...darkTheme.typography.fontFamily,
      primary: '"Orbitron", "Roboto", sans-serif',
    },
  },
};

function NestedThemeProvider({ theme, children }) {
  const parentTheme = useTheme();

  const mergedTheme = {
    ...parentTheme.theme,
    ...theme,
    colors: {
      ...parentTheme.theme.colors,
      ...theme.colors,
    },
  };

  return (
    <ThemeContext.Provider
      value={{
        ...parentTheme,
        theme: mergedTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <div>
        <h1>Main Theme</h1>

        <NestedThemeProvider theme={corporateTheme}>
          <Card>
            <h2>Corporate Section</h2>
            <Button>Corporate Button</Button>
          </Card>
        </NestedThemeProvider>

        <NestedThemeProvider theme={gameTheme}>
          <Card>
            <h2>Gaming Section</h2>
            <Button>Game Button</Button>
          </Card>
        </NestedThemeProvider>
      </div>
    </ThemeProvider>
  );
}
```

### Theme Variants and Modes

```tsx
type ThemeMode = "light" | "dark" | "auto";
type ThemeVariant = "default" | "corporate" | "game" | "minimal";

interface ExtendedThemeContextType extends ThemeContextType {
  mode: ThemeMode;
  variant: ThemeVariant;
  setMode: (mode: ThemeMode) => void;
  setVariant: (variant: ThemeVariant) => void;
}

const themeVariants = {
  default: lightTheme,
  corporate: corporateTheme,
  game: gameTheme,
  minimal: {
    ...lightTheme,
    colors: {
      ...lightTheme.colors,
      primary: "#000000",
      secondary: "#666666",
      background: "#ffffff",
      surface: "#fafafa",
    },
    shadows: {
      sm: "none",
      md: "0 1px 3px rgba(0, 0, 0, 0.1)",
      lg: "0 2px 6px rgba(0, 0, 0, 0.1)",
      xl: "0 4px 12px rgba(0, 0, 0, 0.1)",
    },
  },
};

function ExtendedThemeProvider({ children }) {
  const [mode, setMode] = useState<ThemeMode>("light");
  const [variant, setVariant] = useState<ThemeVariant>("default");

  const isDark = useMemo(() => {
    if (mode === "auto") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return mode === "dark";
  }, [mode]);

  const theme = useMemo(() => {
    const baseTheme = themeVariants[variant];
    return isDark ? createDarkVersion(baseTheme) : baseTheme;
  }, [variant, isDark]);

  // Listen for system theme changes
  useEffect(() => {
    if (mode === "auto") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        // Trigger re-render
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [mode]);

  const value = {
    theme,
    isDark,
    mode,
    variant,
    setMode,
    setVariant,
    toggleTheme: () => setMode(isDark ? "light" : "dark"),
    setTheme: () => {}, // Implement custom theme logic
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
```

### Dynamic Theme Generation

```tsx
interface ThemeGenerator {
  generateFromColor: (primaryColor: string) => Theme;
  generateFromImage: (imageUrl: string) => Promise<Theme>;
  generateAccessiblePalette: (baseColor: string) => ColorPalette;
}

function generateColorPalette(baseColor: string) {
  // Use color manipulation library like chroma-js or polished
  const base = chroma(baseColor);

  return {
    50: base.brighten(2.5).hex(),
    100: base.brighten(2).hex(),
    200: base.brighten(1.5).hex(),
    300: base.brighten(1).hex(),
    400: base.brighten(0.5).hex(),
    500: base.hex(),
    600: base.darken(0.5).hex(),
    700: base.darken(1).hex(),
    800: base.darken(1.5).hex(),
    900: base.darken(2).hex(),
  };
}

function generateThemeFromColor(primaryColor: string): Theme {
  const primaryPalette = generateColorPalette(primaryColor);
  const grayPalette = generateColorPalette("#6b7280");

  return {
    ...lightTheme,
    colors: {
      primary: primaryPalette[500],
      secondary: grayPalette[500],
      background: "#ffffff",
      surface: grayPalette[50],
      text: grayPalette[900],
      textSecondary: grayPalette[600],
      error: "#ef4444",
      warning: "#f59e0b",
      success: "#10b981",
      info: primaryPalette[400],
    },
  };
}

function DynamicThemeGenerator() {
  const { setTheme } = useTheme();
  const [colorInput, setColorInput] = useState("#007bff");

  const handleGenerateTheme = () => {
    const newTheme = generateThemeFromColor(colorInput);
    setTheme(newTheme);
  };

  return (
    <div>
      <label>
        Primary Color:
        <input
          type="color"
          value={colorInput}
          onChange={(e) => setColorInput(e.target.value)}
        />
      </label>
      <button onClick={handleGenerateTheme}>Generate Theme</button>
    </div>
  );
}
```

## CSS Custom Properties Integration

### CSS Variables Theme

```css
/* global.css */
:root {
  /* Light theme */
  --color-primary: #007bff;
  --color-secondary: #6c757d;
  --color-background: #ffffff;
  --color-surface: #f8f9fa;
  --color-text: #212529;
  --color-text-secondary: #6c757d;

  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.125rem;

  --border-radius-sm: 0.125rem;
  --border-radius-md: 0.375rem;
  --border-radius-lg: 0.5rem;

  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.dark {
  --color-primary: #4dabf7;
  --color-secondary: #adb5bd;
  --color-background: #1a1a1a;
  --color-surface: #2d2d2d;
  --color-text: #ffffff;
  --color-text-secondary: #adb5bd;
}

/* Component styles using CSS variables */
.card {
  background: var(--color-surface);
  color: var(--color-text);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
}

.button {
  background: var(--color-primary);
  color: white;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-md);
  border: none;
  cursor: pointer;
}
```

### Hybrid Approach

```tsx
import { css } from "@emotion/react";

function HybridThemedComponent() {
  const { theme } = useTheme();

  const styles = css`
    /* Mix CSS variables with theme values */
    background: var(--color-surface, ${theme.colors.surface});
    color: var(--color-text, ${theme.colors.text});
    padding: var(--spacing-lg, ${theme.spacing.lg});

    /* Use theme for complex calculations */
    border: 1px solid ${theme.colors.primary}40;
    box-shadow: ${theme.shadows.md};

    /* Responsive using theme breakpoints */
    @media (min-width: ${theme.breakpoints.md}) {
      padding: var(--spacing-xl, ${theme.spacing.xl});
    }
  `;

  return <div css={styles}>Hybrid themed component</div>;
}
```

## Testing Themed Components

### Jest Testing Setup

```tsx
import { render } from "@testing-library/react";
import { ThemeProvider } from "./ThemeContext";
import { lightTheme, darkTheme } from "./themes";

const renderWithTheme = (component, theme = lightTheme) => {
  return render(
    <ThemeProvider defaultTheme={theme === darkTheme ? "dark" : "light"}>
      {component}
    </ThemeProvider>
  );
};

describe("ThemedButton", () => {
  it("applies light theme styles correctly", () => {
    const { getByRole } = renderWithTheme(
      <Button>Click me</Button>,
      lightTheme
    );

    const button = getByRole("button");
    expect(button).toHaveStyle({
      backgroundColor: lightTheme.colors.primary,
      color: "white",
    });
  });

  it("applies dark theme styles correctly", () => {
    const { getByRole } = renderWithTheme(<Button>Click me</Button>, darkTheme);

    const button = getByRole("button");
    expect(button).toHaveStyle({
      backgroundColor: darkTheme.colors.primary,
    });
  });

  it("responds to theme changes", () => {
    const { getByRole, rerender } = renderWithTheme(
      <Button>Click me</Button>,
      lightTheme
    );

    let button = getByRole("button");
    expect(button).toHaveStyle({
      backgroundColor: lightTheme.colors.primary,
    });

    rerender(
      <ThemeProvider defaultTheme="dark">
        <Button>Click me</Button>
      </ThemeProvider>
    );

    button = getByRole("button");
    expect(button).toHaveStyle({
      backgroundColor: darkTheme.colors.primary,
    });
  });
});
```

### Storybook Integration

```tsx
// .storybook/preview.tsx
import { ThemeProvider } from "../src/theme/ThemeProvider";
import { lightTheme, darkTheme } from "../src/theme/themes";

export const globalTypes = {
  theme: {
    name: "Theme",
    description: "Global theme for components",
    defaultValue: "light",
    toolbar: {
      icon: "circlehollow",
      items: [
        { value: "light", title: "Light" },
        { value: "dark", title: "Dark" },
      ],
    },
  },
};

const withTheme = (Story, context) => {
  const theme = context.globals.theme === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeProvider defaultTheme={context.globals.theme}>
      <div
        style={{
          background: theme.colors.background,
          color: theme.colors.text,
          minHeight: "100vh",
          padding: "20px",
        }}
      >
        <Story {...context} />
      </div>
    </ThemeProvider>
  );
};

export const decorators = [withTheme];
```

## Best Practices

### Theme Design Principles

1. **Consistency**: Use consistent naming conventions and value scales
2. **Accessibility**: Ensure sufficient color contrast and readable typography
3. **Scalability**: Design themes that can grow with your application
4. **Performance**: Minimize runtime theme calculations
5. **Maintainability**: Keep themes organized and well-documented

### Implementation Guidelines

```tsx
// ✅ Good: Consistent naming and structure
const theme = {
  colors: {
    primary: "#007bff",
    primaryHover: "#0056b3",
    primaryActive: "#004085",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },
};

// ❌ Bad: Inconsistent naming and magic values
const theme = {
  primaryColor: "#007bff",
  blueHover: "#0056b3",
  primaryPressed: "#004085",
  smallSpace: "8px",
  mediumPadding: "20px", // Not following scale
  large: "24px",
};

// ✅ Good: Use theme values consistently
const Button = styled.button`
  background: ${(props) => props.theme.colors.primary};
  padding: ${(props) => props.theme.spacing.sm} ${(props) =>
      props.theme.spacing.md};
`;

// ❌ Bad: Mix theme values with hardcoded values
const Button = styled.button`
  background: ${(props) => props.theme.colors.primary};
  padding: 8px 20px; // Hardcoded values
`;
```

## Interview Questions

**Q: What are the benefits of using a theming system in React?**

A: Benefits include:

- **Consistency**: Ensures uniform design across the application
- **Maintainability**: Centralized style management
- **Flexibility**: Easy theme switching and customization
- **Accessibility**: Better support for user preferences (dark mode, reduced motion)
- **Developer Experience**: Better IntelliSense and type safety
- **Performance**: Optimized style delivery and caching

**Q: How would you implement dark mode in a React application?**

A: Implementation approaches:

1. **Context API**: Store theme state and provide toggle function
2. **CSS Variables**: Use CSS custom properties for dynamic switching
3. **localStorage**: Persist user theme preference
4. **System Preference**: Respect `prefers-color-scheme` media query
5. **Theme Provider**: Wrap app with theme context provider

**Q: What are the trade-offs between CSS-in-JS theming and CSS custom properties?**

A: **CSS-in-JS Theming:**

- Pros: Dynamic values, better TypeScript support, component scoping
- Cons: Runtime overhead, larger bundle size

**CSS Custom Properties:**

- Pros: Better performance, smaller bundle, native browser support
- Cons: Limited dynamic capabilities, less type safety

**Q: How do you ensure theme accessibility?**

A: Accessibility considerations:

- **Color Contrast**: Meet WCAG guidelines (4.5:1 for normal text)
- **Focus Indicators**: Ensure visible focus states
- **Reduced Motion**: Respect `prefers-reduced-motion`
- **High Contrast**: Support high contrast mode
- **Color Independence**: Don't rely solely on color for information
- **Testing**: Use accessibility testing tools and real devices

This comprehensive guide covers theming fundamentals, implementation patterns, advanced techniques, and best practices for creating maintainable and accessible React applications.
