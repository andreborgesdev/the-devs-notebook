# Static Site Generation (SSG) in Next.js

Static Site Generation (SSG) pre-renders pages at build time, providing excellent performance and SEO benefits while maintaining the dynamic capabilities of React.

## Static Generation Basics

### Static Pages

```typescript
// app/about/page.tsx
export default function AboutPage() {
  return (
    <div>
      <h1>About Us</h1>
      <p>This page is statically generated at build time.</p>
    </div>
  );
}
```

### Static Generation with Data

```typescript
// app/blog/page.tsx
interface Post {
  id: string;
  title: string;
  excerpt: string;
  date: string;
}

async function getPosts(): Promise<Post[]> {
  const res = await fetch("https://api.example.com/posts", {
    cache: "force-cache", // Cache at build time
  });

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return res.json();
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
          <time>{post.date}</time>
        </article>
      ))}
    </div>
  );
}
```

## Dynamic Static Generation

### Generate Static Params

```typescript
// app/blog/[slug]/page.tsx
interface Post {
  slug: string;
  title: string;
  content: string;
  date: string;
}

interface PageProps {
  params: {
    slug: string;
  };
}

// Generate static paths at build time
export async function generateStaticParams() {
  const posts = await fetch("https://api.example.com/posts").then((res) =>
    res.json()
  );

  return posts.map((post: Post) => ({
    slug: post.slug,
  }));
}

// Generate static content for each path
async function getPost(slug: string): Promise<Post> {
  const res = await fetch(`https://api.example.com/posts/${slug}`, {
    cache: "force-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch post");
  }

  return res.json();
}

export default async function BlogPost({ params }: PageProps) {
  const post = await getPost(params.slug);

  return (
    <article>
      <h1>{post.title}</h1>
      <time>{post.date}</time>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```

### Partial Static Generation

```typescript
// app/products/[category]/page.tsx
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
}

interface PageProps {
  params: {
    category: string;
  };
}

// Generate only popular categories at build time
export async function generateStaticParams() {
  const popularCategories = ["electronics", "clothing", "books"];

  return popularCategories.map((category) => ({
    category,
  }));
}

// Enable ISR for other categories
export const dynamicParams = true;

async function getProducts(category: string): Promise<Product[]> {
  const res = await fetch(
    `https://api.example.com/products?category=${category}`,
    {
      next: { revalidate: 3600 }, // Revalidate every hour
    }
  );

  return res.json();
}

export default async function CategoryPage({ params }: PageProps) {
  const products = await getProducts(params.category);

  return (
    <div>
      <h1>Products in {params.category}</h1>
      <div className="grid">
        {products.map((product) => (
          <div key={product.id} className="card">
            <h3>{product.name}</h3>
            <p>${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Incremental Static Regeneration (ISR)

### Time-Based Revalidation

```typescript
// app/news/page.tsx
interface NewsItem {
  id: string;
  title: string;
  summary: string;
  publishedAt: string;
}

async function getNews(): Promise<NewsItem[]> {
  const res = await fetch("https://api.example.com/news", {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });

  return res.json();
}

export default async function NewsPage() {
  const news = await getNews();

  return (
    <div>
      <h1>Latest News</h1>
      <p>Updated every minute</p>
      {news.map((item) => (
        <article key={item.id}>
          <h2>{item.title}</h2>
          <p>{item.summary}</p>
          <time>{item.publishedAt}</time>
        </article>
      ))}
    </div>
  );
}
```

### On-Demand Revalidation

```typescript
// app/api/revalidate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { path, tag, secret } = body;

  // Verify secret to prevent unauthorized revalidation
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    if (path) {
      // Revalidate specific path
      revalidatePath(path);
    }

    if (tag) {
      // Revalidate by cache tag
      revalidateTag(tag);
    }

    return NextResponse.json({ revalidated: true });
  } catch (error) {
    return NextResponse.json(
      { message: "Error revalidating" },
      { status: 500 }
    );
  }
}
```

### Tagged Cache Revalidation

```typescript
// app/posts/[id]/page.tsx
async function getPost(id: string) {
  const res = await fetch(`https://api.example.com/posts/${id}`, {
    next: {
      tags: [`post-${id}`, "posts"],
      revalidate: 3600,
    },
  });

  return res.json();
}

// Webhook to trigger revalidation
// app/api/webhook/posts/route.ts
export async function POST(request: NextRequest) {
  const { postId, action } = await request.json();

  switch (action) {
    case "updated":
      revalidateTag(`post-${postId}`);
      break;
    case "deleted":
      revalidateTag(`post-${postId}`);
      revalidateTag("posts");
      break;
    case "created":
      revalidateTag("posts");
      break;
  }

  return NextResponse.json({ success: true });
}
```

## Static Export

### Full Static Export

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true, // Required for static export
  },
};

module.exports = nextConfig;
```

### Conditional Static Export

```typescript
// next.config.js
const isStaticExport = process.env.BUILD_STATIC === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(isStaticExport && {
    output: "export",
    trailingSlash: true,
    images: {
      unoptimized: true,
    },
  }),
  // Other config options
};

module.exports = nextConfig;
```

## Content Management Integration

### Markdown Content

```typescript
// lib/markdown.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "content/posts");

interface PostData {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
}

export async function getAllPosts(): Promise<PostData[]> {
  const fileNames = fs.readdirSync(postsDirectory);

  const allPostsData = await Promise.all(
    fileNames.map(async (fileName) => {
      const id = fileName.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      const matterResult = matter(fileContents);
      const processedContent = await remark()
        .use(html)
        .process(matterResult.content);

      return {
        id,
        content: processedContent.toString(),
        ...matterResult.data,
      } as PostData;
    })
  );

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostData(id: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const matterResult = matter(fileContents);
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);

  return {
    id,
    content: processedContent.toString(),
    ...matterResult.data,
  } as PostData;
}
```

### CMS Integration

```typescript
// lib/cms.ts
interface CMSPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  publishedAt: string;
  updatedAt: string;
}

class CMSClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = process.env.CMS_API_URL!;
    this.apiKey = process.env.CMS_API_KEY!;
  }

  private async request(endpoint: string) {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!res.ok) {
      throw new Error(`CMS API error: ${res.status}`);
    }

    return res.json();
  }

  async getAllPosts(): Promise<CMSPost[]> {
    return this.request("/posts?status=published");
  }

  async getPost(slug: string): Promise<CMSPost> {
    return this.request(`/posts/${slug}`);
  }

  async getPostsByTag(tag: string): Promise<CMSPost[]> {
    return this.request(`/posts?tag=${tag}&status=published`);
  }
}

export const cms = new CMSClient();

// Usage in pages
// app/blog/page.tsx
export default async function BlogPage() {
  const posts = await cms.getAllPosts();

  return (
    <div>
      <h1>Blog</h1>
      {posts.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <time>{post.publishedAt}</time>
        </article>
      ))}
    </div>
  );
}
```

## Performance Optimization

### Bundle Analysis

```typescript
// next.config.js
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize bundle size
  experimental: {
    optimizePackageImports: ["lodash", "date-fns"],
  },

  // Compress output
  compress: true,

  // Configure webpack
  webpack: (config) => {
    // Custom webpack configurations
    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
```

### Image Optimization for Static Sites

```typescript
// components/OptimizedImage.tsx
import Image from "next/image";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      style={{
        width: "100%",
        height: "auto",
      }}
    />
  );
}
```

## SEO for Static Sites

### Sitemap Generation

```typescript
// app/sitemap.ts
import { MetadataRoute } from "next";
import { cms } from "@/lib/cms";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await cms.getAllPosts();

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `https://example.com/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: "https://example.com",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: "https://example.com/blog",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...postEntries,
  ];
}
```

### Robots.txt

```typescript
// app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"],
    },
    sitemap: "https://example.com/sitemap.xml",
  };
}
```

### Structured Data

```typescript
// components/StructuredData.tsx
interface BlogPostStructuredDataProps {
  title: string;
  description: string;
  publishedAt: string;
  author: string;
  url: string;
}

export default function BlogPostStructuredData({
  title,
  description,
  publishedAt,
  author,
  url,
}: BlogPostStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    datePublished: publishedAt,
    author: {
      "@type": "Person",
      name: author,
    },
    url,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
```

## Deployment Strategies

### Vercel Deployment

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "out",
  "trailingSlash": true,
  "cleanUrls": true,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### GitHub Pages Deployment

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          BUILD_STATIC: true

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
```

## Best Practices

### Performance

- Use ISR for frequently updated content
- Implement proper caching strategies
- Optimize images and fonts
- Minimize JavaScript bundle size

### SEO

- Generate sitemaps automatically
- Implement structured data
- Use semantic HTML
- Optimize meta tags

### Development

- Use TypeScript for type safety
- Implement proper error handling
- Set up monitoring and analytics
- Use environment variables for configuration

### Content Management

- Version control content when possible
- Implement content validation
- Use consistent data structures
- Plan for content migration

This comprehensive guide covers static site generation in Next.js, providing the knowledge needed to build fast, SEO-friendly static websites with dynamic capabilities.
