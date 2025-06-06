# TypeScript Configuration and Tooling

## tsconfig.json Configuration

### Essential Configuration Options

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "module": "CommonJS",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "removeComments": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts", "**/*.spec.ts"]
}
```

### Compiler Options Explained

#### Target and Module Options

```json
{
  "target": "ES2020", // JavaScript version to compile to
  "lib": ["ES2020", "DOM"], // Library files to include
  "module": "CommonJS", // Module system (CommonJS, ESNext, AMD, etc.)
  "moduleResolution": "node" // Module resolution strategy
}
```

#### Strict Type Checking

```json
{
  "strict": true, // Enable all strict checks
  "noImplicitAny": true, // Error on implicit 'any'
  "strictNullChecks": true, // Strict null/undefined checks
  "strictFunctionTypes": true, // Strict function type checks
  "strictBindCallApply": true, // Strict bind/call/apply checks
  "noImplicitThis": true, // Error on implicit 'this'
  "alwaysStrict": true, // Parse in strict mode
  "exactOptionalPropertyTypes": true // Exact optional property types
}
```

#### Additional Checks

```json
{
  "noUnusedLocals": true, // Error on unused locals
  "noUnusedParameters": true, // Error on unused parameters
  "noImplicitReturns": true, // Error on missing returns
  "noFallthroughCasesInSwitch": true, // Error on fallthrough cases
  "noUncheckedIndexedAccess": true, // Strict indexed access
  "allowUnreachableCode": false // Error on unreachable code
}
```

### Project Configuration

#### Multiple Projects (Project References)

```json
{
  "references": [
    { "path": "./packages/core" },
    { "path": "./packages/utils" },
    { "path": "./packages/ui" }
  ]
}
```

#### Path Mapping

```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"],
      "@components/*": ["components/*"],
      "@utils/*": ["utils/*"],
      "@types/*": ["types/*"]
    }
  }
}
```

### Environment-Specific Configurations

#### Development Configuration

```json
{
  "compilerOptions": {
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,
    "removeComments": false,
    "noEmitOnError": false
  }
}
```

#### Production Configuration

```json
{
  "compilerOptions": {
    "sourceMap": false,
    "declaration": false,
    "removeComments": true,
    "noEmitOnError": true,
    "optimization": true
  }
}
```

## TypeScript CLI Commands

### Basic Commands

```bash
# Compile TypeScript files
tsc

# Compile specific file
tsc app.ts

# Watch mode - recompile on changes
tsc --watch

# Compile with specific config
tsc --project tsconfig.prod.json

# Check for errors without emitting
tsc --noEmit

# Generate declaration files only
tsc --declaration --emitDeclarationOnly
```

### Advanced CLI Options

```bash
# Compile with specific target
tsc --target ES2020

# Include specific libraries
tsc --lib ES2020,DOM

# Set module system
tsc --module ESNext

# Enable strict mode
tsc --strict

# Show detailed diagnostics
tsc --diagnostics

# List files that would be compiled
tsc --listFiles
```

## Package.json Scripts

### Development Scripts

```json
{
  "scripts": {
    "build": "tsc",
    "build:watch": "tsc --watch",
    "build:prod": "tsc --project tsconfig.prod.json",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf dist",
    "dev": "ts-node src/index.ts",
    "start": "node dist/index.js"
  }
}
```

### Testing and Quality Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "format": "prettier --write src/**/*.ts",
    "type-coverage": "type-coverage --detail"
  }
}
```

## Development Tools

### Essential Dependencies

```json
{
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^18.0.0",
    "ts-node": "^10.9.0",
    "tsx": "^3.12.0",
    "@typescript-eslint/eslint-plugin": "^5.0.0",
    "@typescript-eslint/parser": "^5.0.0",
    "prettier": "^2.8.0",
    "jest": "^29.0.0",
    "@types/jest": "^29.0.0",
    "ts-jest": "^29.0.0"
  }
}
```

### Runtime Execution Tools

#### ts-node Configuration

```json
{
  "ts-node": {
    "esm": true,
    "experimentalSpecifierResolution": "node",
    "transpileOnly": true,
    "compilerOptions": {
      "module": "ESNext"
    }
  }
}
```

#### tsx (Modern ts-node alternative)

```bash
# Install tsx
pnpm add -D tsx

# Run TypeScript directly
tsx src/app.ts

# Watch mode
tsx watch src/app.ts
```

## Linting and Formatting

### ESLint Configuration

```json
{
  "extends": [
    "@typescript-eslint/recommended",
    "@typescript-eslint/recommended-requiring-type-checking"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/prefer-const": "error",
    "@typescript-eslint/no-inferrable-types": "error"
  }
}
```

### Prettier Configuration

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

## Testing Setup

### Jest Configuration

```json
{
  "preset": "ts-jest",
  "testEnvironment": "node",
  "roots": ["<rootDir>/src"],
  "testMatch": ["**/__tests__/**/*.ts", "**/*.test.ts"],
  "collectCoverageFrom": ["src/**/*.ts", "!src/**/*.d.ts", "!src/__tests__/**"],
  "coverageReporters": ["text", "lcov", "html"],
  "setupFilesAfterEnv": ["<rootDir>/src/test-setup.ts"]
}
```

### Vitest Configuration (Modern Alternative)

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
});
```

## Build Tools Integration

### Webpack Configuration

```javascript
const path = require("path");

module.exports = {
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};
```

### Vite Configuration

```typescript
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "MyLib",
      fileName: "my-lib",
    },
  },
});
```

### Rollup Configuration

```javascript
import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/bundle.cjs.js",
      format: "cjs",
    },
    {
      file: "dist/bundle.esm.js",
      format: "esm",
    },
  ],
  plugins: [
    nodeResolve(),
    typescript({
      tsconfig: "./tsconfig.json",
    }),
  ],
};
```

## Type Declaration Files

### Creating Declaration Files

```typescript
// types/global.d.ts
declare global {
  interface Window {
    myGlobalFunction: () => void;
  }

  var API_URL: string;
}

// Module declarations
declare module "*.json" {
  const value: any;
  export default value;
}

declare module "*.css" {
  const classes: { [key: string]: string };
  export default classes;
}

// Ambient module declarations
declare module "my-untyped-library" {
  export function someFunction(param: string): number;
  export const someConstant: string;
}
```

### Package Declaration

```json
{
  "name": "my-package",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "require": "./dist/index.js",
      "import": "./dist/index.mjs"
    }
  },
  "files": ["dist"]
}
```

## Debugging Configuration

### VS Code Launch Configuration

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug TypeScript",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/src/index.ts",
      "runtimeArgs": ["-r", "ts-node/register"],
      "env": {
        "TS_NODE_PROJECT": "${workspaceFolder}/tsconfig.json"
      },
      "sourceMaps": true,
      "cwd": "${workspaceRoot}",
      "protocol": "inspector"
    }
  ]
}
```

### Chrome DevTools

```json
{
  "compilerOptions": {
    "sourceMap": true,
    "inlineSourceMap": false,
    "inlineSources": false
  }
}
```

## Performance Optimization

### Compilation Performance

```json
{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": ".tsbuildinfo",
    "skipLibCheck": true,
    "skipDefaultLibCheck": true
  },
  "ts-node": {
    "transpileOnly": true,
    "files": true
  }
}
```

### Build Optimization

```bash
# Use project references for large projects
tsc --build

# Parallel compilation
tsc --build --parallel

# Watch mode with incremental compilation
tsc --build --watch --incremental
```

## Continuous Integration

### GitHub Actions

```yaml
name: TypeScript CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "pnpm"

      - run: pnpm install
      - run: pnpm run type-check
      - run: pnpm run lint
      - run: pnpm run test
      - run: pnpm run build
```

## Best Practices

### Configuration Best Practices

1. **Enable strict mode** - Catch more errors
2. **Use project references** - Better performance for large projects
3. **Configure path mapping** - Cleaner imports
4. **Set up incremental compilation** - Faster builds
5. **Use appropriate target/lib** - Match your runtime environment
6. **Enable source maps** - Better debugging experience
7. **Configure declaration generation** - For library development

### Development Workflow

1. **Start with strict configuration**
2. **Use ts-node or tsx for development**
3. **Set up watch mode for rapid iteration**
4. **Configure your editor for TypeScript**
5. **Use type-only imports where appropriate**
6. **Regularly update TypeScript version**
7. **Monitor compilation performance**

### Common Configuration Patterns

#### Library Development

```json
{
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "outDir": "dist",
    "target": "ES2020",
    "module": "CommonJS",
    "moduleResolution": "node"
  }
}
```

#### Application Development

```json
{
  "compilerOptions": {
    "noEmit": true,
    "jsx": "react-jsx",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true
  }
}
```

#### Node.js Backend

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "lib": ["ES2020"],
    "types": ["node"]
  }
}
```

This comprehensive configuration guide covers all essential aspects of TypeScript tooling and setup for professional development workflows.
