# React Development Workflow & DevOps

Modern React development requires efficient workflows that span from local development to production deployment. This comprehensive guide covers development setup, CI/CD pipelines, monitoring, and production best practices.

## Development Environment Setup

### Modern Development Stack

```typescript
interface DevelopmentEnvironment {
  packageManager: "pnpm" | "npm" | "yarn";
  nodeVersion: string;
  editor: string;
  extensions: string[];
  tooling: DevelopmentTools;
}

interface DevelopmentTools {
  bundler: "vite" | "webpack" | "turbopack";
  typeChecker: "typescript" | "flow";
  linter: "eslint";
  formatter: "prettier";
  testing: TestingTools;
  devServer: DevServerConfig;
}

interface TestingTools {
  unitTesting: "jest" | "vitest";
  componentTesting: "react-testing-library";
  e2e: "playwright" | "cypress";
  coverage: "c8" | "istanbul";
}

const optimalDevEnvironment: DevelopmentEnvironment = {
  packageManager: "pnpm",
  nodeVersion: "18.17.0",
  editor: "vscode",
  extensions: [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-playwright.playwright",
    "ms-vscode.vscode-jest",
  ],
  tooling: {
    bundler: "vite",
    typeChecker: "typescript",
    linter: "eslint",
    formatter: "prettier",
    testing: {
      unitTesting: "vitest",
      componentTesting: "react-testing-library",
      e2e: "playwright",
      coverage: "c8",
    },
    devServer: {
      port: 3000,
      hot: true,
      overlay: true,
      proxy: {
        "/api": "http://localhost:8000",
      },
    },
  },
};
```

### Development Scripts and Automation

```json
{
  "scripts": {
    "dev": "vite --host",
    "build": "tsc && vite build",
    "build:analyze": "npm run build && npx vite-bundle-analyzer dist",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint src --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,js,jsx,json,css,md}\"",
    "type-check": "tsc --noEmit",
    "pre-commit": "lint-staged",
    "prepare": "husky install",
    "clean": "rimraf dist node_modules/.cache",
    "deps:update": "pnpm update --interactive",
    "deps:audit": "pnpm audit --audit-level moderate"
  }
}
```

### Git Hooks and Quality Gates

```typescript
// .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged

// .husky/commit-msg
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx commitlint --edit $1

// lint-staged.config.js
module.exports = {
  '*.{ts,tsx}': [
    'eslint --fix',
    'prettier --write',
    'bash -c "tsc --noEmit"',
    'vitest related --run'
  ],
  '*.{js,jsx,json,css,md}': ['prettier --write'],
  '*.{ts,tsx,js,jsx}': ['vitest related --run --reporter=silent']
};

// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New feature
        'fix',      // Bug fix
        'docs',     // Documentation
        'style',    // Formatting
        'refactor', // Code refactoring
        'test',     // Adding tests
        'chore',    // Maintenance
        'perf',     // Performance improvements
        'ci',       // CI/CD changes
        'build',    // Build system changes
        'revert'    // Reverting changes
      ]
    ],
    'subject-max-length': [2, 'always', 72],
    'body-max-line-length': [2, 'always', 100]
  }
};
```

## CI/CD Pipeline Implementation

### GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: "18.17.0"
  PNPM_VERSION: "8.6.0"

jobs:
  quality-checks:
    name: Quality Checks
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Get pnpm store directory
        shell: bash
        run: echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_ENV

      - name: Setup pnpm cache
        uses: actions/cache@v3
        with:
          path: ${{ env.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Type checking
        run: pnpm type-check

      - name: Linting
        run: pnpm lint

      - name: Format checking
        run: pnpm format:check

      - name: Security audit
        run: pnpm audit --audit-level moderate
        continue-on-error: true

  testing:
    name: Testing
    runs-on: ubuntu-latest
    needs: quality-checks

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js and pnpm
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Unit tests
        run: pnpm test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella

      - name: Install Playwright browsers
        run: pnpm exec playwright install --with-deps

      - name: E2E tests
        run: pnpm test:e2e

      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: test-results
          path: test-results/

  build:
    name: Build Application
    runs-on: ubuntu-latest
    needs: [quality-checks, testing]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js and pnpm
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build application
        run: pnpm build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
          VITE_APP_VERSION: ${{ github.sha }}

      - name: Bundle analysis
        run: pnpm build:analyze

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/

  security-scan:
    name: Security Scanning
    runs-on: ubuntu-latest
    needs: build

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: "fs"
          scan-ref: "."
          format: "sarif"
          output: "trivy-results.sarif"

      - name: Upload Trivy scan results
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: "trivy-results.sarif"

  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: [build, security-scan]
    if: github.ref == 'refs/heads/develop'
    environment: staging

    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: dist
          path: dist/

      - name: Deploy to staging
        run: |
          echo "Deploying to staging environment"
          # Add your deployment commands here

  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: [build, security-scan]
    if: github.ref == 'refs/heads/main'
    environment: production

    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: dist
          path: dist/

      - name: Deploy to production
        run: |
          echo "Deploying to production environment"
          # Add your deployment commands here

      - name: Create release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: v${{ github.run_number }}
          release_name: Release ${{ github.run_number }}
          draft: false
          prerelease: false
```

### Docker Integration

```dockerfile
# Dockerfile.development
FROM node:18-alpine AS development

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@8.6.0

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start development server
CMD ["pnpm", "dev", "--host"]

# Dockerfile.production
FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm@8.6.0

FROM base AS dependencies

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

FROM base AS build

WORKDIR /app

# Copy package files and install all dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source code and build
COPY . .
RUN pnpm build

FROM nginx:alpine AS production

# Copy built application
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose for Development

```yaml
# docker-compose.yml
version: "3.8"

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.development
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - VITE_API_URL=http://localhost:8000
    depends_on:
      - api
    networks:
      - app-network

  api:
    image: your-api-image:latest
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://user:password@db:5432/appdb
    depends_on:
      - db
    networks:
      - app-network

  db:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=appdb
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    networks:
      - app-network

volumes:
  postgres_data:

networks:
  app-network:
    driver: bridge
```

## Production Deployment Strategies

### Vercel Deployment Configuration

```typescript
// vercel.json
{
  "version": 2,
  "framework": "vite",
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "installCommand": "pnpm install --frozen-lockfile",
  "devCommand": "pnpm dev",
  "regions": ["iad1", "sfo1"],
  "functions": {
    "app/api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains; preload"
        }
      ]
    },
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/app/api/$1"
    }
  ],
  "env": {
    "VITE_API_URL": "@vite_api_url",
    "VITE_APP_VERSION": "@vite_app_version"
  }
}
```

### Netlify Configuration

```toml
# netlify.toml
[build]
  base = "."
  command = "pnpm build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18.17.0"
  PNPM_VERSION = "8.6.0"

[[plugins]]
  package = "@netlify/plugin-lighthouse"

  [plugins.inputs.thresholds]
    performance = 0.9
    accessibility = 0.9
    best-practices = 0.9
    seo = 0.9

[[plugins]]
  package = "netlify-plugin-pnpm"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### AWS Deployment with CDK

```typescript
import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as iam from "aws-cdk-lib/aws-iam";

export class ReactAppStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 bucket for hosting
    const websiteBucket = new s3.Bucket(this, "WebsiteBucket", {
      bucketName: `react-app-${cdk.Stack.of(this).account}-${
        cdk.Stack.of(this).region
      }`,
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Origin Access Identity for CloudFront
    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      "OriginAccessIdentity"
    );

    // Grant CloudFront access to S3 bucket
    websiteBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ["s3:GetObject"],
        resources: [websiteBucket.arnForObjects("*")],
        principals: [
          new iam.CanonicalUserPrincipal(
            originAccessIdentity.cloudFrontOriginAccessIdentityS3CanonicalUserId
          ),
        ],
      })
    );

    // CloudFront distribution
    const distribution = new cloudfront.Distribution(this, "Distribution", {
      defaultBehavior: {
        origin: new origins.S3Origin(websiteBucket, {
          originAccessIdentity,
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        compress: true,
      },
      additionalBehaviors: {
        "/static/*": {
          origin: new origins.S3Origin(websiteBucket, {
            originAccessIdentity,
          }),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy:
            cloudfront.CachePolicy.CACHING_OPTIMIZED_FOR_UNCOMPRESSED_OBJECTS,
          compress: true,
        },
      },
      defaultRootObject: "index.html",
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
        },
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
        },
      ],
      enableIpv6: true,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
    });

    // Deploy website to S3
    new s3deploy.BucketDeployment(this, "DeployWebsite", {
      sources: [s3deploy.Source.asset("./dist")],
      destinationBucket: websiteBucket,
      distribution,
      distributionPaths: ["/*"],
    });

    // Output the CloudFront URL
    new cdk.CfnOutput(this, "DistributionDomainName", {
      value: distribution.domainName,
      description: "CloudFront distribution domain name",
    });
  }
}
```

## Performance Monitoring and Analytics

### Application Performance Monitoring

```typescript
interface PerformanceConfig {
  vitalsThresholds: WebVitalsThresholds;
  errorTracking: ErrorTrackingConfig;
  userAnalytics: UserAnalyticsConfig;
  customMetrics: CustomMetricsConfig;
}

interface WebVitalsThresholds {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

class PerformanceMonitoringService {
  private config: PerformanceConfig;
  private observer: PerformanceObserver;

  constructor(config: PerformanceConfig) {
    this.config = config;
    this.initializeMonitoring();
  }

  private initializeMonitoring(): void {
    this.setupWebVitalsTracking();
    this.setupErrorTracking();
    this.setupUserInteractionTracking();
    this.setupCustomMetrics();
  }

  private setupWebVitalsTracking(): void {
    import("web-vitals").then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(this.handleMetric.bind(this));
      getFID(this.handleMetric.bind(this));
      getFCP(this.handleMetric.bind(this));
      getLCP(this.handleMetric.bind(this));
      getTTFB(this.handleMetric.bind(this));
    });
  }

  private handleMetric(metric: any): void {
    const threshold = this.config.vitalsThresholds[metric.name.toLowerCase()];
    const isGood = metric.value <= threshold;

    analytics.track("Web Vital", {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      isGood,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType,
    });

    if (!isGood) {
      console.warn(
        `Web Vital ${metric.name} exceeded threshold: ${metric.value} > ${threshold}`
      );
    }
  }

  private setupErrorTracking(): void {
    window.addEventListener("error", (event) => {
      this.trackError({
        type: "javascript",
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        timestamp: Date.now(),
      });
    });

    window.addEventListener("unhandledrejection", (event) => {
      this.trackError({
        type: "promise",
        message: event.reason?.message || "Unhandled Promise Rejection",
        stack: event.reason?.stack,
        timestamp: Date.now(),
      });
    });
  }

  private trackError(error: any): void {
    analytics.track("Application Error", {
      ...error,
      userAgent: navigator.userAgent,
      url: window.location.href,
      referrer: document.referrer,
    });
  }

  setupCustomMetrics(): void {
    performance.mark("app-start");

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === "measure") {
          analytics.track("Custom Performance Metric", {
            name: entry.name,
            duration: entry.duration,
            startTime: entry.startTime,
          });
        }
      }
    });

    observer.observe({ entryTypes: ["measure"] });
  }

  trackComponentRender(componentName: string, renderTime: number): void {
    analytics.track("Component Render", {
      component: componentName,
      renderTime,
      timestamp: Date.now(),
    });
  }

  trackUserInteraction(
    action: string,
    element: string,
    additionalData?: any
  ): void {
    analytics.track("User Interaction", {
      action,
      element,
      timestamp: Date.now(),
      ...additionalData,
    });
  }
}

const performanceMonitor = new PerformanceMonitoringService({
  vitalsThresholds: {
    fcp: 1800, // 1.8s
    lcp: 2500, // 2.5s
    fid: 100, // 100ms
    cls: 0.1, // 0.1
    ttfb: 800, // 800ms
  },
  errorTracking: {
    enabled: true,
    sampleRate: 1.0,
  },
  userAnalytics: {
    trackClicks: true,
    trackScrolling: true,
    trackFormSubmissions: true,
  },
  customMetrics: {
    trackComponentRenders: true,
    trackApiCalls: true,
    trackRouteChanges: true,
  },
});
```

### Real User Monitoring (RUM)

```typescript
class RealUserMonitoring {
  private sessionId: string;
  private userId?: string;
  private startTime: number;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = performance.now();
    this.initialize();
  }

  private initialize(): void {
    this.trackPageView();
    this.setupNavigationTracking();
    this.setupResourceTracking();
    this.setupUserBehaviorTracking();
  }

  private trackPageView(): void {
    const navigationEntry = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;

    if (navigationEntry) {
      analytics.track("Page View", {
        url: window.location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        sessionId: this.sessionId,
        userId: this.userId,
        loadTime: navigationEntry.loadEventEnd - navigationEntry.loadEventStart,
        domContentLoadedTime:
          navigationEntry.domContentLoadedEventEnd -
          navigationEntry.domContentLoadedEventStart,
        timeToFirstByte:
          navigationEntry.responseStart - navigationEntry.requestStart,
        dnsTime:
          navigationEntry.domainLookupEnd - navigationEntry.domainLookupStart,
        connectionTime:
          navigationEntry.connectEnd - navigationEntry.connectStart,
        renderTime: navigationEntry.loadEventEnd - navigationEntry.responseEnd,
      });
    }
  }

  private setupNavigationTracking(): void {
    let currentPath = window.location.pathname;

    const trackNavigation = () => {
      const newPath = window.location.pathname;
      if (newPath !== currentPath) {
        performance.mark("route-change-start");

        setTimeout(() => {
          performance.mark("route-change-end");
          performance.measure(
            "route-change",
            "route-change-start",
            "route-change-end"
          );

          const measure = performance.getEntriesByName("route-change")[0];

          analytics.track("Route Change", {
            from: currentPath,
            to: newPath,
            duration: measure.duration,
            sessionId: this.sessionId,
            userId: this.userId,
          });

          currentPath = newPath;
        }, 0);
      }
    };

    window.addEventListener("popstate", trackNavigation);

    const originalPushState = history.pushState;
    history.pushState = function (...args) {
      originalPushState.apply(history, args);
      trackNavigation();
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function (...args) {
      originalReplaceState.apply(history, args);
      trackNavigation();
    };
  }

  private setupResourceTracking(): void {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === "resource") {
          const resourceEntry = entry as PerformanceResourceTiming;

          analytics.track("Resource Load", {
            name: resourceEntry.name,
            type: this.getResourceType(resourceEntry.name),
            duration: resourceEntry.duration,
            size: resourceEntry.transferSize,
            cached: resourceEntry.transferSize === 0,
            sessionId: this.sessionId,
          });
        }
      }
    });

    observer.observe({ entryTypes: ["resource"] });
  }

  private getResourceType(url: string): string {
    if (url.includes(".js")) return "script";
    if (url.includes(".css")) return "stylesheet";
    if (url.match(/\.(png|jpg|jpeg|gif|webp|svg)$/)) return "image";
    if (url.includes("/api/")) return "api";
    return "other";
  }

  private setupUserBehaviorTracking(): void {
    let scrollDepth = 0;
    let maxScrollDepth = 0;

    const trackScrollDepth = throttle(() => {
      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      scrollDepth = Math.round((window.scrollY / documentHeight) * 100);

      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;

        if (maxScrollDepth >= 25 && maxScrollDepth < 50) {
          analytics.track("Scroll Depth", {
            depth: "25%",
            sessionId: this.sessionId,
          });
        } else if (maxScrollDepth >= 50 && maxScrollDepth < 75) {
          analytics.track("Scroll Depth", {
            depth: "50%",
            sessionId: this.sessionId,
          });
        } else if (maxScrollDepth >= 75 && maxScrollDepth < 100) {
          analytics.track("Scroll Depth", {
            depth: "75%",
            sessionId: this.sessionId,
          });
        } else if (maxScrollDepth >= 100) {
          analytics.track("Scroll Depth", {
            depth: "100%",
            sessionId: this.sessionId,
          });
        }
      }
    }, 100);

    window.addEventListener("scroll", trackScrollDepth);

    document.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;

      analytics.track("Click", {
        element: target.tagName.toLowerCase(),
        className: target.className,
        id: target.id,
        text: target.textContent?.slice(0, 100),
        x: event.clientX,
        y: event.clientY,
        sessionId: this.sessionId,
      });
    });

    let interactionCount = 0;
    const trackInteraction = throttle(() => {
      interactionCount++;

      if (interactionCount === 1) {
        analytics.track("First Interaction", {
          timeToFirstInteraction: performance.now() - this.startTime,
          sessionId: this.sessionId,
        });
      }
    }, 1000);

    ["click", "keydown", "touchstart"].forEach((eventType) => {
      document.addEventListener(eventType, trackInteraction, { once: true });
    });
  }

  setUserId(userId: string): void {
    this.userId = userId;
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

function throttle(func: Function, limit: number) {
  let inThrottle: boolean;
  return function (this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

const rum = new RealUserMonitoring();
```

## Development Best Practices

### Code Quality Standards

```typescript
// ESLint configuration for strict quality standards
module.exports = {
  extends: [
    '@typescript-eslint/recommended',
    '@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier'
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react-hooks/exhaustive-deps': 'error',
    'import/order': ['error', {
      'groups': ['builtin', 'external', 'internal', 'parent', 'sibling'],
      'newlines-between': 'always',
      'alphabetize': { order: 'asc' }
    }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'error',
    'no-var': 'error'
  }
};

// TypeScript strict configuration
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noUncheckedSideEffectImports": true
  }
}
```

### Performance Budget Configuration

```typescript
interface PerformanceBudget {
  bundleSize: BundleSizeLimits;
  loadTime: LoadTimeLimits;
  networkRequests: NetworkLimits;
  cachePolicy: CachePolicy;
}

interface BundleSizeLimits {
  main: number; // Main bundle size in KB
  vendor: number; // Vendor bundle size in KB
  async: number; // Async chunk size in KB
  total: number; // Total bundle size in KB
}

const performanceBudget: PerformanceBudget = {
  bundleSize: {
    main: 250, // 250KB main bundle
    vendor: 500, // 500KB vendor bundle
    async: 100, // 100KB async chunks
    total: 1000, // 1MB total
  },
  loadTime: {
    fcp: 1800, // First Contentful Paint < 1.8s
    lcp: 2500, // Largest Contentful Paint < 2.5s
    tti: 3500, // Time to Interactive < 3.5s
    fid: 100, // First Input Delay < 100ms
  },
  networkRequests: {
    initial: 20, // Max 20 requests for initial load
    total: 50, // Max 50 total requests
  },
  cachePolicy: {
    static: "1y", // Static assets cache for 1 year
    api: "5m", // API responses cache for 5 minutes
    html: "no-cache", // HTML no cache
  },
};

// Bundle analyzer webpack plugin configuration
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      reportFilename: "bundle-report.html",
      openAnalyzer: false,
      generateStatsFile: true,
      statsFilename: "bundle-stats.json",
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
      maxSize: performanceBudget.bundleSize.async * 1024,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
          maxSize: performanceBudget.bundleSize.vendor * 1024,
        },
        common: {
          name: "common",
          minChunks: 2,
          chunks: "all",
          enforce: true,
        },
      },
    },
  },
};
```

## Interview Questions

### Basic Level

**Q: What is the importance of a development workflow in React projects?**

A: A development workflow provides:

- Consistent development environment across team members
- Automated quality checks (linting, testing, type checking)
- Standardized commit practices and code formatting
- Efficient deployment processes
- Performance monitoring and optimization
- Error tracking and debugging capabilities

**Q: What are the key components of a modern React CI/CD pipeline?**

A: A modern React CI/CD pipeline includes:

- Code quality checks (ESLint, Prettier, TypeScript)
- Automated testing (unit, integration, e2e)
- Security scanning (vulnerability assessment)
- Build optimization and bundle analysis
- Deployment to staging and production environments
- Performance monitoring and alerting

**Q: How do you set up environment-specific configurations in React?**

A: Environment configurations can be managed through:

- Environment variables (VITE*\* or REACT_APP*\*)
- Configuration files per environment
- Build-time variable replacement
- Runtime configuration loading
- Docker environment variables
- Platform-specific deployment configurations

### Intermediate Level

**Q: How do you implement performance monitoring in a React application?**

A: Performance monitoring involves:

- Web Vitals tracking (FCP, LCP, FID, CLS, TTFB)
- Real User Monitoring (RUM) for actual user experience
- Error tracking and crash reporting
- Custom metrics for business-specific KPIs
- Resource loading and bundle analysis
- User interaction and behavior tracking

**Q: What strategies do you use for optimizing build and deployment processes?**

A: Build and deployment optimization strategies:

- Bundle splitting and lazy loading
- Tree shaking to eliminate dead code
- Image optimization and compression
- CDN usage for static assets
- Caching strategies at multiple levels
- Progressive Web App (PWA) features
- Server-side rendering for critical pages

**Q: How do you handle secrets and environment variables securely?**

A: Secure handling of secrets:

- Never commit secrets to version control
- Use environment variables for configuration
- Implement secrets management services (AWS Secrets Manager, Azure Key Vault)
- Separate build-time and runtime configurations
- Use encrypted deployment pipelines
- Implement principle of least privilege access

### Advanced Level

**Q: How do you implement blue-green deployment for React applications?**

A: Blue-green deployment implementation:

- Maintain two identical production environments
- Deploy new version to inactive environment
- Run automated tests on new deployment
- Switch traffic gradually using load balancer
- Monitor performance and error rates
- Implement quick rollback mechanisms
- Use feature flags for controlled releases

**Q: What are the best practices for monitoring React application performance in production?**

A: Production monitoring best practices:

- Implement comprehensive error boundaries
- Use Real User Monitoring (RUM) for actual performance data
- Set up performance budgets and alerting
- Track Core Web Vitals and business metrics
- Implement distributed tracing for API calls
- Monitor bundle sizes and loading performance
- Use A/B testing for performance optimizations

**Q: How do you implement infrastructure as code for React deployments?**

A: Infrastructure as Code (IaC) implementation:

- Use AWS CDK, Terraform, or CloudFormation for infrastructure
- Version control infrastructure configurations
- Implement automated infrastructure testing
- Use immutable infrastructure patterns
- Implement multi-environment deployment strategies
- Monitor infrastructure costs and performance
- Implement disaster recovery and backup strategies

React development workflow and DevOps practices are essential for building scalable, maintainable, and performant applications. Modern workflows emphasize automation, monitoring, and continuous improvement to deliver high-quality user experiences while maintaining development efficiency.
