# Next.js Basics for React SSR

Next.js is a React framework that provides server-side rendering, static site generation, and many other features out of the box.

## Getting Started

### Installation and Setup

```bash
# Create a new Next.js app
npx create-next-app@latest my-app --typescript --tailwind --eslint --app

# Navigate to the project
cd my-app

# Start development server
npm run dev
```

### Project Structure

```
my-app/
├── app/                  # App Router (Next.js 13+)
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── loading.tsx      # Loading UI
├── components/          # Reusable components
├── lib/                # Utility functions
├── public/             # Static assets
├── next.config.js      # Next.js configuration
└── package.json
```

## App Router (Next.js 13+)

### File-Based Routing

```typescript
// app/layout.tsx - Root Layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header>
          <nav>My App Navigation</nav>
        </header>
        <main>{children}</main>
        <footer>© 2024 My App</footer>
      </body>
    </html>
  );
}

// app/page.tsx - Home Page
export default function HomePage() {
  return (
    <div>
      <h1>Welcome to My App</h1>
      <p>This is the home page</p>
    </div>
  );
}

// app/about/page.tsx - About Page
export default function AboutPage() {
  return (
    <div>
      <h1>About Us</h1>
      <p>Learn more about our company</p>
    </div>
  );
}
```

### Dynamic Routes

```typescript
// app/blog/[slug]/page.tsx
interface PageProps {
  params: {
    slug: string;
  };
}

export default function BlogPost({ params }: PageProps) {
  return (
    <div>
      <h1>Blog Post: {params.slug}</h1>
    </div>
  );
}

// app/products/[category]/[id]/page.tsx
interface ProductPageProps {
  params: {
    category: string;
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <div>
      <h1>
        Product {params.id} in {params.category}
      </h1>
    </div>
  );
}
```

### Catch-All Routes

```typescript
// app/docs/[...slug]/page.tsx
interface DocsPageProps {
  params: {
    slug: string[];
  };
}

export default function DocsPage({ params }: DocsPageProps) {
  const path = params.slug.join("/");

  return (
    <div>
      <h1>Documentation: {path}</h1>
    </div>
  );
}

// Optional catch-all: [[...slug]]
// Matches /docs, /docs/a, /docs/a/b, etc.
```

## Data Fetching

### Server Components (Default)

```typescript
// app/posts/page.tsx
interface Post {
  id: number;
  title: string;
  body: string;
}

async function getPosts(): Promise<Post[]> {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
    cache: "force-cache", // Default caching
  });

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return res.json();
}

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
        </article>
      ))}
    </div>
  );
}
```

### Client Components

```typescript
"use client"; // Required for client components

import { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

export default function UsersClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        const userData = await res.json();
        setUsers(userData);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Loading users...</div>;

  return (
    <div>
      <h1>Users (Client-side)</h1>
      {users.map((user) => (
        <div key={user.id}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
}
```

## API Routes

### Basic API Route

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";

interface User {
  id: number;
  name: string;
  email: string;
}

const users: User[] = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
];

export async function GET() {
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const newUser: User = {
    id: users.length + 1,
    name: body.name,
    email: body.email,
  };

  users.push(newUser);

  return NextResponse.json(newUser, { status: 201 });
}
```

### Dynamic API Routes

```typescript
// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const userId = parseInt(params.id);

  // Fetch user from database
  const user = await getUserById(userId);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const userId = parseInt(params.id);
  const body = await request.json();

  // Update user in database
  const updatedUser = await updateUser(userId, body);

  return NextResponse.json(updatedUser);
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const userId = parseInt(params.id);

  // Delete user from database
  await deleteUser(userId);

  return NextResponse.json({ message: "User deleted" });
}
```

## Layouts and Templates

### Nested Layouts

```typescript
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <nav>
          <a href="/dashboard">Overview</a>
          <a href="/dashboard/analytics">Analytics</a>
          <a href="/dashboard/settings">Settings</a>
        </nav>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}

// app/dashboard/analytics/layout.tsx
export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="analytics-toolbar">
        <select>
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
        </select>
      </div>
      {children}
    </div>
  );
}
```

### Loading States

```typescript
// app/posts/loading.tsx
export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded mb-4"></div>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  );
}

// app/posts/error.tsx
("use client");

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="error-boundary">
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

## Metadata and SEO

### Static Metadata

```typescript
// app/about/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - My App",
  description: "Learn more about our company and team",
  keywords: ["about", "company", "team"],
  openGraph: {
    title: "About Us",
    description: "Learn more about our company",
    images: ["/og-about.jpg"],
  },
};

export default function AboutPage() {
  return <div>About content</div>;
}
```

### Dynamic Metadata

```typescript
// app/blog/[slug]/page.tsx
import { Metadata } from "next";

interface PageProps {
  params: { slug: string };
}

async function getPost(slug: string) {
  const res = await fetch(`https://api.example.com/posts/${slug}`);
  return res.json();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const post = await getPost(params.slug);

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage],
    },
  };
}

export default async function BlogPost({ params }: PageProps) {
  const post = await getPost(params.slug);

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
```

## Navigation

### Link Component

```typescript
import Link from "next/link";

export default function Navigation() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/blog">Blog</Link>

      {/* Dynamic links */}
      <Link href={`/user/${userId}`}>Profile</Link>

      {/* External links */}
      <Link href="https://example.com" target="_blank">
        External Link
      </Link>

      {/* Programmatic navigation */}
      <Link
        href="/dashboard"
        className="nav-link"
        prefetch={false} // Disable prefetching
      >
        Dashboard
      </Link>
    </nav>
  );
}
```

### useRouter Hook

```typescript
"use client";

import { useRouter } from "next/navigation";

export default function ClientComponent() {
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    const result = await submitForm(formData);

    if (result.success) {
      // Navigate programmatically
      router.push("/success");

      // Or replace current entry
      router.replace("/success");

      // Go back
      router.back();

      // Refresh current route
      router.refresh();
    }
  };

  return <form action={handleSubmit}>{/* form fields */}</form>;
}
```

## Middleware

### Basic Middleware

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check authentication
  const token = request.cookies.get("auth-token");

  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Add custom headers
  const response = NextResponse.next();
  response.headers.set("X-Custom-Header", "value");

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
```

## Environment Variables

### Configuration

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://api.example.com
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
```

```typescript
// lib/config.ts
export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL!,
  databaseUrl: process.env.DATABASE_URL!,
  jwtSecret: process.env.JWT_SECRET!,
};

// Usage in components (client-side)
("use client");

export default function ApiComponent() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Only NEXT_PUBLIC_ variables are available on client

  return <div>API URL: {apiUrl}</div>;
}
```

## Performance Optimization

### Image Optimization

```typescript
import Image from "next/image";

export default function Gallery() {
  return (
    <div>
      {/* Optimized images */}
      <Image
        src="/hero.jpg"
        alt="Hero image"
        width={800}
        height={600}
        priority // Load immediately
      />

      {/* Responsive images */}
      <Image
        src="/profile.jpg"
        alt="Profile"
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover"
      />

      {/* External images */}
      <Image
        src="https://example.com/image.jpg"
        alt="External image"
        width={400}
        height={300}
        loader={({ src, width, quality }) => {
          return `${src}?w=${width}&q=${quality || 75}`;
        }}
      />
    </div>
  );
}
```

### Font Optimization

```typescript
// app/layout.tsx
import { Inter, Roboto_Mono } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.className} ${robotoMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

## Best Practices

### Code Organization

- Use App Router for new projects
- Organize components by feature
- Keep server and client components separate
- Use TypeScript for better type safety

### Performance

- Use Server Components by default
- Add 'use client' only when needed
- Optimize images and fonts
- Implement proper caching strategies

### SEO

- Define metadata for all pages
- Use semantic HTML structure
- Implement structured data
- Optimize Core Web Vitals

### Security

- Validate all inputs
- Use environment variables for secrets
- Implement proper authentication
- Set up CORS properly

### Development Experience

- Use TypeScript for better DX
- Set up ESLint and Prettier
- Implement error boundaries
- Use proper loading states

This comprehensive guide covers Next.js basics for React server-side rendering, providing a solid foundation for building modern web applications.
