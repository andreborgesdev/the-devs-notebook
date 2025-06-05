# Linting and Code Quality for React

Code linting and quality tools ensure consistent code style, catch potential bugs early, and maintain high code standards across React applications. This guide covers ESLint, Prettier, and other essential tools for React development.

## ESLint Configuration

### Basic ESLint Setup

```json
{
  "env": {
    "browser": true,
    "es2021": true,
    "node": true,
    "jest": true
  },
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": "latest",
    "sourceType": "module",
    "project": "./tsconfig.json"
  },
  "plugins": [
    "react",
    "react-hooks",
    "@typescript-eslint",
    "jsx-a11y",
    "import"
  ],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  },
  "settings": {
    "react": {
      "version": "detect"
    },
    "import/resolver": {
      "typescript": {
        "alwaysTryTypes": true
      }
    }
  }
}
```

### Advanced ESLint Rules

```json
{
  "rules": {
    "react/jsx-uses-react": "off",
    "react/jsx-uses-vars": "error",
    "react/jsx-key": "error",
    "react/jsx-no-duplicate-props": "error",
    "react/jsx-no-undef": "error",
    "react/jsx-pascal-case": "error",
    "react/no-deprecated": "warn",
    "react/no-direct-mutation-state": "error",
    "react/no-is-mounted": "error",
    "react/no-typos": "error",
    "react/require-render-return": "error",
    "react/self-closing-comp": "warn",
    "react/sort-comp": "warn",

    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-non-null-assertion": "warn",
    "@typescript-eslint/prefer-const": "error",
    "@typescript-eslint/no-var-requires": "error",
    "@typescript-eslint/ban-types": "error",
    "@typescript-eslint/consistent-type-definitions": ["error", "interface"],

    "import/order": [
      "error",
      {
        "groups": [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index"
        ],
        "newlines-between": "always",
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        }
      }
    ],
    "import/no-unresolved": "error",
    "import/no-cycle": "error",
    "import/no-unused-modules": "warn",

    "jsx-a11y/alt-text": "error",
    "jsx-a11y/anchor-has-content": "error",
    "jsx-a11y/anchor-is-valid": "error",
    "jsx-a11y/click-events-have-key-events": "warn",
    "jsx-a11y/label-has-associated-control": "error"
  }
}
```

### Environment-Specific Configuration

```json
{
  "overrides": [
    {
      "files": [
        "**/*.test.ts",
        "**/*.test.tsx",
        "**/*.spec.ts",
        "**/*.spec.tsx"
      ],
      "env": {
        "jest": true
      },
      "extends": ["plugin:testing-library/react"],
      "rules": {
        "@typescript-eslint/no-non-null-assertion": "off",
        "testing-library/await-async-query": "error",
        "testing-library/no-await-sync-query": "error",
        "testing-library/no-debugging-utils": "warn",
        "testing-library/no-dom-import": "error"
      }
    },
    {
      "files": ["**/*.stories.ts", "**/*.stories.tsx"],
      "rules": {
        "import/no-anonymous-default-export": "off"
      }
    }
  ]
}
```

## Prettier Configuration

### Prettier Setup

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "quoteProps": "as-needed",
  "jsxSingleQuote": true,
  "proseWrap": "preserve"
}
```

### ESLint-Prettier Integration

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": [
      "error",
      {
        "semi": true,
        "singleQuote": true,
        "printWidth": 100
      }
    ]
  }
}
```

### File-Specific Formatting

```json
{
  "overrides": [
    {
      "files": "*.json",
      "options": {
        "printWidth": 200
      }
    },
    {
      "files": "*.md",
      "options": {
        "proseWrap": "always",
        "printWidth": 80
      }
    }
  ]
}
```

## Husky and Git Hooks

### Husky Setup

```json
{
  "scripts": {
    "prepare": "husky install"
  },
  "devDependencies": {
    "husky": "^8.0.0",
    "lint-staged": "^13.0.0"
  }
}
```

### Pre-commit Hook Configuration

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

### Lint-Staged Configuration

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,scss,json,md}": ["prettier --write"],
    "*.{ts,tsx}": ["bash -c 'npm run type-check'"]
  }
}
```

### Commit Message Linting

```json
{
  "devDependencies": {
    "@commitlint/cli": "^17.0.0",
    "@commitlint/config-conventional": "^17.0.0"
  }
}
```

```javascript
// commitlint.config.js
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "test",
        "chore",
        "perf",
        "ci",
        "build",
        "revert",
      ],
    ],
    "subject-max-length": [2, "always", 100],
    "body-max-line-length": [2, "always", 200],
  },
};
```

## TypeScript Type Checking

### Type Checking Configuration

```json
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "type-check:watch": "tsc --noEmit --watch",
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix"
  }
}
```

### Strict TypeScript Configuration

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noUncheckedIndexedAccess": true
  }
}
```

## Code Quality Metrics

### SonarQube Integration

```javascript
// sonar-project.properties
sonar.projectKey=my-react-app
sonar.projectName=My React App
sonar.projectVersion=1.0
sonar.sources=src
sonar.tests=src
sonar.test.inclusions=**/*.test.ts,**/*.test.tsx,**/*.spec.ts,**/*.spec.tsx
sonar.coverage.exclusions=**/*.test.ts,**/*.test.tsx,**/*.spec.ts,**/*.spec.tsx,**/node_modules/**
sonar.typescript.lcov.reportPaths=coverage/lcov.info
```

### Code Coverage Configuration

```json
{
  "scripts": {
    "test:coverage": "jest --coverage",
    "test:coverage:watch": "jest --coverage --watchAll"
  },
  "jest": {
    "collectCoverageFrom": [
      "src/**/*.{ts,tsx}",
      "!src/**/*.d.ts",
      "!src/**/*.stories.{ts,tsx}",
      "!src/index.tsx"
    ],
    "coverageReporters": ["text", "lcov", "html"],
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

## Bundle Analysis

### Bundle Size Monitoring

```json
{
  "scripts": {
    "analyze": "npm run build && npx webpack-bundle-analyzer build/static/js/*.js",
    "size-limit": "size-limit",
    "size-limit:ci": "size-limit --json"
  },
  "size-limit": [
    {
      "path": "build/static/js/*.js",
      "limit": "300 KB"
    },
    {
      "path": "build/static/css/*.css",
      "limit": "50 KB"
    }
  ]
}
```

### Performance Budgets

```javascript
// webpack.config.js
module.exports = {
  performance: {
    maxAssetSize: 250000,
    maxEntrypointSize: 250000,
    hints: "warning",
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },
};
```

## Security Linting

### Security-Focused ESLint Rules

```json
{
  "extends": ["plugin:security/recommended"],
  "plugins": ["security"],
  "rules": {
    "security/detect-object-injection": "warn",
    "security/detect-non-literal-regexp": "warn",
    "security/detect-unsafe-regex": "error",
    "security/detect-buffer-noassert": "error",
    "security/detect-child-process": "warn",
    "security/detect-disable-mustache-escape": "error",
    "security/detect-eval-with-expression": "error",
    "security/detect-no-csrf-before-method-override": "error",
    "security/detect-non-literal-fs-filename": "warn",
    "security/detect-non-literal-require": "warn",
    "security/detect-possible-timing-attacks": "warn",
    "security/detect-pseudoRandomBytes": "error"
  }
}
```

### Dependency Security Scanning

```json
{
  "scripts": {
    "audit": "npm audit",
    "audit:fix": "npm audit fix",
    "security:check": "npm audit && snyk test",
    "security:monitor": "snyk monitor"
  }
}
```

## Custom ESLint Rules

### Creating Custom Rules

```javascript
// eslint-rules/no-console-log.js
module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow console.log statements",
      category: "Best Practices",
      recommended: false,
    },
    fixable: "code",
    schema: [],
  },
  create(context) {
    return {
      CallExpression(node) {
        if (
          node.callee.type === "MemberExpression" &&
          node.callee.object.name === "console" &&
          node.callee.property.name === "log"
        ) {
          context.report({
            node,
            message: "Unexpected console.log statement.",
            fix(fixer) {
              return fixer.remove(node.parent);
            },
          });
        }
      },
    };
  },
};
```

### React-Specific Custom Rules

```javascript
// eslint-rules/require-default-props.js
module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Require default props for optional props in TypeScript components",
      category: "Best Practices",
    },
    schema: [],
  },
  create(context) {
    return {
      'VariableDeclarator[id.name][init.type="ArrowFunctionExpression"]'(node) {
        const componentName = node.id.name;

        if (isReactComponent(node)) {
          checkForDefaultProps(context, node, componentName);
        }
      },
    };
  },
};

function isReactComponent(node) {
  const init = node.init;
  if (!init || init.type !== "ArrowFunctionExpression") return false;

  const body = init.body;
  if (body.type === "JSXElement" || body.type === "JSXFragment") return true;
  if (body.type === "BlockStatement") {
    return body.body.some(
      (stmt) =>
        stmt.type === "ReturnStatement" &&
        (stmt.argument?.type === "JSXElement" ||
          stmt.argument?.type === "JSXFragment")
    );
  }

  return false;
}
```

## IDE Integration

### VS Code Settings

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "typescript.preferences.organizeImportsIntoGroups": true,
  "typescript.preferences.includePackageJsonAutoImports": "auto"
}
```

### EditorConfig

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false

[*.{json,yml,yaml}]
indent_size = 2
```

## CI/CD Integration

### GitHub Actions Workflow

```yaml
name: Code Quality

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

### Quality Gates

```json
{
  "scripts": {
    "quality:check": "npm run lint && npm run type-check && npm run test:coverage && npm run size-limit",
    "pre-push": "npm run quality:check"
  }
}
```

## Performance Monitoring

### Lighthouse CI Configuration

```json
{
  "ci": {
    "collect": {
      "startServerCommand": "npm run serve",
      "url": ["http://localhost:3000"]
    },
    "assert": {
      "assertions": {
        "categories:performance": ["warn", { "minScore": 0.8 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:best-practices": ["warn", { "minScore": 0.8 }],
        "categories:seo": ["warn", { "minScore": 0.8 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

## Best Practices

### Linting Strategy

1. **Start with recommended configurations**
2. **Gradually increase strictness**
3. **Use environment-specific overrides**
4. **Implement automatic fixing where possible**
5. **Monitor and adjust rules based on team feedback**
6. **Integrate with CI/CD pipeline**
7. **Regular dependency updates**

### Code Quality Metrics

- **Maintainability Index**: Measure code complexity
- **Technical Debt Ratio**: Track code quality over time
- **Code Coverage**: Ensure adequate test coverage
- **Duplication**: Minimize code duplication
- **Cyclomatic Complexity**: Keep functions simple

### Common Pitfalls

- Over-configuring rules causing developer friction
- Not maintaining consistency across team members
- Ignoring performance impact of linting tools
- Not updating configurations with new best practices
- Failing to educate team on rule rationale

## Interview Questions

### Basic Questions

**Q: What is ESLint and why is it important for React development?**
A: ESLint is a static code analysis tool that identifies problematic patterns in JavaScript/TypeScript code. For React, it helps enforce best practices, catch bugs early, and maintain consistent code style across the team.

**Q: How do you integrate Prettier with ESLint?**
A: Install eslint-config-prettier to disable conflicting ESLint rules, use eslint-plugin-prettier to run Prettier as an ESLint rule, and configure both tools to work together without conflicts.

**Q: What are pre-commit hooks and how do they improve code quality?**
A: Pre-commit hooks are scripts that run before each commit, automatically checking code quality, running lints, formatting code, and preventing bad commits from entering the repository.

### Intermediate Questions

**Q: How do you configure ESLint for different environments (development, testing, production)?**
A: Use ESLint's `env` and `overrides` configurations to apply different rules for different file types and environments, such as allowing console.log in development but not production.

**Q: Explain the difference between ESLint rules: error, warn, and off.**
A: `error` stops the build/process, `warn` shows warnings but allows continuation, and `off` disables the rule completely. Choose based on rule criticality and team workflow.

### Advanced Questions

**Q: How would you create a custom ESLint rule for React components?**
A: Create a plugin that analyzes the AST, identify specific patterns in React components, and provide meaningful error messages and auto-fixes where possible.

**Q: Design a comprehensive code quality pipeline for a large React application.**
A: Implement multi-stage quality checks including linting, type checking, testing, security scanning, performance budgets, and automated code review tools integrated with CI/CD.
