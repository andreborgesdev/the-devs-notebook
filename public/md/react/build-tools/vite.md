# Vite for React

Vite is a modern build tool that provides an extremely fast development experience with instant Hot Module Replacement (HMR) and optimized production builds.

## Getting Started

### Project Setup

```bash
# Create new Vite React project
pnpm create vite my-react-app --template react
cd my-react-app
pnpm install
pnpm dev

# TypeScript template
pnpm create vite my-react-app --template react-ts
```

### Project Structure

```
my-react-app/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── utils/
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Configuration

### Basic Vite Config

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@assets": path.resolve(__dirname, "./src/assets"),
    },
  },
  server: {
    port: 3000,
    open: true,
    cors: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
        },
      },
    },
  },
});
```

### Advanced Configuration

```typescript
// vite.config.ts
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react({
        jsxImportSource: "@emotion/react",
        babel: {
          plugins: ["@emotion/babel-plugin"],
        },
      }),
    ],

    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __API_URL__: JSON.stringify(env.VITE_API_URL),
    },

    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
        "@components": resolve(__dirname, "src/components"),
        "@pages": resolve(__dirname, "src/pages"),
        "@hooks": resolve(__dirname, "src/hooks"),
        "@utils": resolve(__dirname, "src/utils"),
        "@types": resolve(__dirname, "src/types"),
        "@assets": resolve(__dirname, "src/assets"),
      },
    },

    server: {
      port: 3000,
      host: true,
      proxy: {
        "/api": {
          target: "http://localhost:3001",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },

    build: {
      outDir: "dist",
      sourcemap: command === "serve",
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: command !== "serve",
          drop_debugger: command !== "serve",
        },
      },
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes("node_modules")) {
              if (id.includes("react") || id.includes("react-dom")) {
                return "react";
              }
              if (id.includes("react-router")) {
                return "router";
              }
              if (id.includes("lodash") || id.includes("date-fns")) {
                return "utils";
              }
              return "vendor";
            }
          },
        },
      },
    },

    css: {
      modules: {
        localsConvention: "camelCase",
      },
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss";`,
        },
      },
    },
  };
});
```

## Environment Variables

### Environment Setup

```bash
# .env
VITE_APP_TITLE=My React App
VITE_API_URL=http://localhost:3001
VITE_ENVIRONMENT=development

# .env.production
VITE_API_URL=https://api.production.com
VITE_ENVIRONMENT=production

# .env.local (ignored by git)
VITE_SECRET_KEY=local-development-key
```

```typescript
// src/config/env.ts
interface EnvConfig {
  apiUrl: string;
  appTitle: string;
  environment: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

export const env: EnvConfig = {
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:3001",
  appTitle: import.meta.env.VITE_APP_TITLE || "React App",
  environment: import.meta.env.VITE_ENVIRONMENT || "development",
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

// Usage in components
const App = () => {
  useEffect(() => {
    document.title = env.appTitle;
  }, []);

  return (
    <div>
      <h1>{env.appTitle}</h1>
      {env.isDevelopment && <div>Development Mode</div>}
    </div>
  );
};
```

## Plugins and Extensions

### Essential Plugins

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// Additional plugins
import legacy from "@vitejs/plugin-legacy";
import { visualizer } from "rollup-plugin-visualizer";
import eslint from "vite-plugin-eslint";

export default defineConfig({
  plugins: [
    react(),

    // ESLint integration
    eslint({
      cache: false,
      include: [
        "./src/**/*.js",
        "./src/**/*.jsx",
        "./src/**/*.ts",
        "./src/**/*.tsx",
      ],
    }),

    // Legacy browser support
    legacy({
      targets: ["defaults", "not IE 11"],
    }),

    // Bundle analyzer
    visualizer({
      filename: "dist/stats.html",
      open: true,
      gzipSize: true,
    }),
  ],
});
```

### PWA Plugin

```typescript
// vite.config.ts
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
      manifest: {
        name: "My React App",
        short_name: "ReactApp",
        description: "My awesome React application",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            src: "icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
```

## Development Features

### Hot Module Replacement

```typescript
// HMR with state preservation
const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
    </div>
  );
};

// Accept HMR updates
if (import.meta.hot) {
  import.meta.hot.accept();
}
```

### Fast Refresh Configuration

```typescript
// vite.config.ts
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      fastRefresh: true,
      jsxRuntime: "automatic",
    }),
  ],
});
```

### Development Server

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    port: 3000,
    host: "0.0.0.0", // Allow external access
    open: "/dashboard", // Open specific route
    cors: true,

    // Proxy API calls
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on("error", (err, req, res) => {
            console.log("proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req, res) => {
            console.log("Sending Request:", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req, res) => {
            console.log("Received Response:", proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
});
```

## Asset Handling

### Static Assets

```typescript
// Importing static assets
import logoUrl from "@/assets/logo.png";
import iconUrl from "@/assets/icon.svg?url";
import iconComponent from "@/assets/icon.svg?react";

const App = () => {
  return (
    <div>
      <img src={logoUrl} alt="Logo" />
      <img src={iconUrl} alt="Icon" />
      <iconComponent />
    </div>
  );
};
```

### Dynamic Imports

```typescript
// Dynamic asset imports
const loadImage = async (name: string) => {
  const module = await import(`@/assets/images/${name}.png`);
  return module.default;
};

const ImageGallery = () => {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const loadImages = async () => {
      const imageNames = ["hero", "about", "contact"];
      const imageUrls = await Promise.all(
        imageNames.map((name) => loadImage(name))
      );
      setImages(imageUrls);
    };

    loadImages();
  }, []);

  return (
    <div>
      {images.map((url, index) => (
        <img key={index} src={url} alt={`Image ${index}`} />
      ))}
    </div>
  );
};
```

### CSS and Styling

```typescript
// CSS Modules
import styles from "./Button.module.css";

const Button = ({ children, variant = "primary" }) => {
  return (
    <button className={`${styles.button} ${styles[variant]}`}>
      {children}
    </button>
  );
};

// CSS-in-JS (Emotion)
import { css } from "@emotion/react";

const buttonStyles = css`
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #0056b3;
  }
`;

const EmotionButton = ({ children }) => {
  return <button css={buttonStyles}>{children}</button>;
};
```

## Build Optimization

### Code Splitting

```typescript
// Route-based code splitting
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Home = lazy(() => import("@/pages/Home"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Profile = lazy(() => import("@/pages/Profile"));

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};
```

### Bundle Analysis

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    // Bundle analyzer
    visualizer({
      filename: "dist/stats.html",
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],

  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Create separate chunks for better caching
          if (id.includes("node_modules")) {
            if (id.includes("react")) return "react-vendor";
            if (id.includes("router")) return "router";
            if (id.includes("ui-library")) return "ui";
            return "vendor";
          }
        },
      },
    },
  },
});
```

## Testing Integration

### Vitest Configuration

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: true,
  },
});
```

```typescript
// src/test/setup.ts
import "@testing-library/jest-dom";
import { beforeAll, afterEach, afterAll } from "vitest";
import { cleanup } from "@testing-library/react";
import { server } from "./mocks/server";

beforeAll(() => server.listen());
afterEach(() => {
  cleanup();
  server.resetHandlers();
});
afterAll(() => server.close());
```

### Test Utilities

```typescript
// src/test/utils.tsx
import { render, RenderOptions } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </BrowserRouter>
  );
};

const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
```

## Deployment

### Static Hosting

```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview",
    "deploy:netlify": "pnpm build && netlify deploy --prod --dir=dist",
    "deploy:vercel": "pnpm build && vercel --prod"
  }
}
```

### Docker Deployment

```dockerfile
# Multi-stage build
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Performance Comparisons

### Build Speed Comparison

| Project Size            | Vite | CRA  | Webpack |
| ----------------------- | ---- | ---- | ------- |
| Small (50 components)   | 2s   | 15s  | 20s     |
| Medium (200 components) | 5s   | 45s  | 60s     |
| Large (500+ components) | 12s  | 120s | 180s    |

### Development Server

| Feature      | Vite   | CRA    |
| ------------ | ------ | ------ |
| Cold Start   | ~1s    | ~15s   |
| HMR Update   | <100ms | ~1s    |
| Memory Usage | Low    | High   |
| CPU Usage    | Low    | Medium |

## Migration from CRA

### Migration Steps

```bash
# 1. Install Vite and plugins
pnpm add -D vite @vitejs/plugin-react

# 2. Remove CRA dependencies
pnpm remove react-scripts

# 3. Update package.json scripts
```

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

```typescript
// 4. Create vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: ".",
  publicDir: "public",
});
```

```html
<!-- 5. Update index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## Best Practices

1. **Configuration**: Keep config minimal and leverage defaults
2. **Environment Variables**: Use VITE\_ prefix for client-side variables
3. **Code Splitting**: Implement route-based splitting for better performance
4. **Asset Optimization**: Use Vite's built-in asset optimization
5. **Development**: Leverage HMR for faster development cycles
6. **Testing**: Use Vitest for seamless integration
7. **Deployment**: Use static hosting for optimal performance

Vite provides a modern, fast, and efficient development experience for React applications with minimal configuration and excellent performance characteristics.
