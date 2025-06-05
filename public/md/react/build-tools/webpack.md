# Webpack with React

Webpack is a powerful module bundler that transforms and bundles JavaScript modules, CSS, images, and other assets for web applications. In React development, webpack handles the build process, enabling features like code splitting, hot module replacement, and optimized production builds.

## Basic Webpack Configuration

### Entry and Output Configuration

```javascript
const path = require("path");

module.exports = {
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
    publicPath: "/",
    clean: true,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@utils": path.resolve(__dirname, "src/utils"),
    },
  },
};
```

### Module Rules for React

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
          },
        },
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
        generator: {
          filename: "images/[name].[hash][ext]",
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "fonts/[name].[hash][ext]",
        },
      },
    ],
  },
};
```

## Development Configuration

### Development Server Setup

```javascript
const webpack = require("webpack");

module.exports = {
  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    contentBase: path.join(__dirname, "public"),
    port: 3000,
    hot: true,
    open: true,
    historyApiFallback: true,
    compress: true,
    overlay: {
      warnings: true,
      errors: true,
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development"),
    }),
  ],
};
```

### Hot Module Replacement

```javascript
// src/index.tsx
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

const root = document.getElementById("root");

const render = (Component: React.ComponentType) => {
  ReactDOM.render(<Component />, root);
};

render(App);

if (module.hot) {
  module.hot.accept("./App", () => {
    const NextApp = require("./App").default;
    render(NextApp);
  });
}
```

### Environment Variables

```javascript
const webpack = require("webpack");
const dotenv = require("dotenv");

const env = dotenv.config().parsed || {};
const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      ...envKeys,
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    }),
  ],
};
```

## Production Configuration

### Optimization Settings

```javascript
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "production",
  devtool: "source-map",
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
          },
        },
      }),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
          priority: 10,
        },
        common: {
          name: "common",
          minChunks: 2,
          chunks: "all",
          priority: 5,
          reuseExistingChunk: true,
        },
      },
    },
    runtimeChunk: {
      name: "runtime",
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash].css",
      chunkFilename: "css/[id].[contenthash].css",
    }),
  ],
};
```

### Bundle Analysis

```javascript
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    process.env.ANALYZE &&
      new BundleAnalyzerPlugin({
        analyzerMode: "server",
        openAnalyzer: true,
      }),
  ].filter(Boolean),
};
```

## Code Splitting Strategies

### Dynamic Imports

```javascript
// Route-based splitting
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));

const App = () => (
  <Router>
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Suspense>
  </Router>
);
```

### Webpack Magic Comments

```javascript
// Chunk naming
const Dashboard = lazy(() =>
  import(/* webpackChunkName: "dashboard" */ "./Dashboard")
);

// Preloading
const Settings = lazy(() =>
  import(/* webpackChunkName: "settings", webpackPreload: true */ "./Settings")
);

// Prefetching
const AdminPanel = lazy(() =>
  import(/* webpackChunkName: "admin", webpackPrefetch: true */ "./AdminPanel")
);
```

### Split Chunks Configuration

```javascript
module.exports = {
  optimization: {
    splitChunks: {
      chunks: "all",
      minSize: 20000,
      maxSize: 244000,
      cacheGroups: {
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: "react",
          chunks: "all",
          priority: 20,
        },
        lodash: {
          test: /[\\/]node_modules[\\/]lodash[\\/]/,
          name: "lodash",
          chunks: "all",
          priority: 15,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
          priority: 10,
        },
      },
    },
  },
};
```

## Asset Management

### Image Optimization

```javascript
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  plugins: [
    new ImageMinimizerPlugin({
      minimizer: {
        implementation: ImageMinimizerPlugin.imageminMinify,
        options: {
          plugins: [
            ["imagemin-mozjpeg", { quality: 80 }],
            ["imagemin-pngquant", { quality: [0.6, 0.8] }],
            [
              "imagemin-svgo",
              {
                plugins: [{ removeViewBox: false }, { removeDimensions: true }],
              },
            ],
          ],
        },
      },
    }),
  ],
};
```

### Font Loading

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "fonts/[name].[hash][ext]",
        },
      },
    ],
  },
};

// CSS font preloading
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: "public/index.html",
      templateParameters: {
        preloadFonts: [
          "/fonts/roboto-regular.woff2",
          "/fonts/roboto-bold.woff2",
        ],
      },
    }),
  ],
};
```

## CSS Processing

### CSS Modules Configuration

```javascript
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
                localIdentName: "[name]__[local]--[hash:base64:5]",
              },
            },
          },
        ],
      },
    ],
  },
};
```

### PostCSS Integration

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require("autoprefixer"),
    require("cssnano")({
      preset: "default",
    }),
    require("postcss-custom-properties"),
    require("postcss-nested"),
  ],
};

// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
};
```

## Plugin Configuration

### HTML Template Processing

```javascript
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: "public/index.html",
      filename: "index.html",
      inject: "body",
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
  ],
};
```

### Service Worker Integration

```javascript
const WorkboxPlugin = require("workbox-webpack-plugin");

module.exports = {
  plugins: [
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/api\./,
          handler: "StaleWhileRevalidate",
          options: {
            cacheName: "api-cache",
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 5 * 60,
            },
          },
        },
      ],
    }),
  ],
};
```

## Performance Optimization

### Tree Shaking Configuration

```javascript
module.exports = {
  mode: 'production',
  optimization: {
    usedExports: true,
    sideEffects: false
  }
};

// package.json
{
  "sideEffects": [
    "*.css",
    "*.scss",
    "./src/polyfills.js"
  ]
}
```

### Compression

```javascript
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  plugins: [
    new CompressionPlugin({
      algorithm: "gzip",
      test: /\.(js|css|html|svg)$/,
      threshold: 8192,
      minRatio: 0.8,
    }),
  ],
};
```

## Advanced Configurations

### Module Federation

```javascript
const ModuleFederationPlugin = require("@module-federation/webpack");

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "host",
      filename: "remoteEntry.js",
      remotes: {
        mfApp: "mfApp@http://localhost:3001/remoteEntry.js",
      },
      exposes: {
        "./Button": "./src/components/Button",
      },
      shared: {
        react: { singleton: true },
        "react-dom": { singleton: true },
      },
    }),
  ],
};
```

### Custom Loaders

```javascript
// custom-loader.js
module.exports = function (source) {
  const options = this.getOptions();

  const transformedSource = source.replace(
    /console\.log\([^)]*\);?/g,
    options.removeConsole ? "" : "$&"
  );

  return transformedSource;
};

// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: path.resolve("./custom-loader.js"),
          options: {
            removeConsole: true,
          },
        },
      },
    ],
  },
};
```

## TypeScript Integration

### TypeScript Loader Configuration

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              configFile: "tsconfig.json",
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
      },
    }),
  ],
};
```

### Path Mapping

```javascript
// webpack.config.js
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  resolve: {
    plugins: [new TsconfigPathsPlugin()]
  }
};

// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"],
      "@components/*": ["components/*"],
      "@utils/*": ["utils/*"]
    }
  }
}
```

## Testing Configuration

### Jest Integration

```javascript
// webpack.config.test.js
module.exports = {
  mode: "development",
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: "identity-obj-proxy",
      },
    ],
  },
};

// jest.config.js
module.exports = {
  testEnvironment: "jsdom",
  moduleNameMapping: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss)$": "identity-obj-proxy",
  },
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
};
```

## Debugging and Monitoring

### Source Maps Configuration

```javascript
module.exports = {
  devtool:
    process.env.NODE_ENV === "production" ? "source-map" : "eval-source-map",

  // Advanced source map options
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        sourceMap: true,
        terserOptions: {
          sourceMap: true,
        },
      }),
    ],
  },
};
```

### Build Analytics

```javascript
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");

const smp = new SpeedMeasurePlugin();

module.exports = smp.wrap({
  plugins: [
    new DuplicatePackageCheckerPlugin({
      verbose: true,
      emitError: true,
    }),
  ],
});
```

## Best Practices

### Configuration Organization

```javascript
// webpack.common.js
const common = {
  entry: "./src/index.tsx",
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  module: {
    rules: [
      // Common rules
    ],
  },
};

// webpack.dev.js
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "eval-source-map",
});

// webpack.prod.js
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",
});
```

### Performance Guidelines

1. **Use appropriate devtool for environment**
2. **Implement code splitting strategically**
3. **Optimize asset loading with compression**
4. **Configure proper caching strategies**
5. **Monitor bundle size regularly**
6. **Use tree shaking effectively**
7. **Minimize vendor bundle size**

### Common Pitfalls

- Not configuring proper source maps for debugging
- Overusing dynamic imports causing too many chunks
- Not optimizing CSS extraction for production
- Ignoring bundle analysis and size monitoring
- Misconfiguring hot module replacement
- Not handling environment variables securely

## Interview Questions

### Basic Questions

**Q: What is webpack and how does it work with React?**
A: Webpack is a module bundler that transforms and bundles JavaScript, CSS, and other assets. For React, it compiles JSX, handles imports, enables hot reloading, and creates optimized production bundles.

**Q: Explain the difference between development and production webpack configurations.**
A: Development focuses on fast rebuilds with source maps and hot reloading. Production optimizes for performance with minification, compression, code splitting, and asset optimization.

**Q: What are webpack loaders and plugins?**
A: Loaders transform files during bundling (e.g., ts-loader for TypeScript). Plugins perform broader tasks like HTML generation, asset optimization, and environment variable injection.

### Intermediate Questions

**Q: How do you implement code splitting in webpack?**
A: Use dynamic imports with `import()`, configure `splitChunks` optimization, and implement route-based splitting with React.lazy and Suspense for optimal bundle size.

**Q: Explain webpack's module resolution process.**
A: Webpack resolves modules using extensions, alias configurations, and node module resolution. It follows import paths, checks file extensions, and resolves relative/absolute paths.

### Advanced Questions

**Q: How do you optimize webpack build performance?**
A: Use parallel processing, configure proper caching, implement incremental builds, optimize loader configurations, and use tools like thread-loader for CPU-intensive tasks.

**Q: Design a webpack configuration for a large-scale React application.**
A: Implement module federation for micro-frontends, configure advanced code splitting, set up comprehensive caching strategies, and establish proper monitoring and analytics.
