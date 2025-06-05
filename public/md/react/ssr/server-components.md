# Server Components in React

React Server Components (RSC) enable rendering components on the server, reducing bundle size and improving performance by keeping server-only code out of the client bundle.

## Understanding Server Components

### Server vs Client Components

```typescript
// Server Component (default in Next.js 13+)
// app/posts/page.tsx
async function getPosts() {
  const res = await fetch("https://api.example.com/posts");
  return res.json();
}

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <div>
      <h1>Posts</h1>
      {posts.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </article>
      ))}
    </div>
  );
}

// Client Component
// components/InteractiveButton.tsx
("use client");

import { useState } from "react";

export default function InteractiveButton() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>
  );
}
```

### Component Composition

```typescript
// Server Component that uses Client Component
// app/dashboard/page.tsx
import InteractiveButton from "@/components/InteractiveButton";
import UserProfile from "@/components/UserProfile";

async function getDashboardData(userId: string) {
  const res = await fetch(`https://api.example.com/users/${userId}/dashboard`);
  return res.json();
}

export default async function DashboardPage() {
  const data = await getDashboardData("user-123");

  return (
    <div>
      <h1>Dashboard</h1>

      {/* Server-rendered user profile */}
      <UserProfile user={data.user} />

      {/* Client-side interactive element */}
      <InteractiveButton />

      {/* Server-rendered stats */}
      <div className="stats">
        <div>Posts: {data.stats.posts}</div>
        <div>Views: {data.stats.views}</div>
      </div>
    </div>
  );
}
```

## Data Fetching in Server Components

### Direct Database Access

```typescript
// lib/db.ts
import { sql } from "@vercel/postgres";

export interface User {
  id: string;
  name: string;
  email: string;
  created_at: Date;
}

export async function getUsers(): Promise<User[]> {
  const { rows } = await sql<User>`
    SELECT id, name, email, created_at 
    FROM users 
    ORDER BY created_at DESC
  `;
  return rows;
}

export async function getUser(id: string): Promise<User | null> {
  const { rows } = await sql<User>`
    SELECT id, name, email, created_at 
    FROM users 
    WHERE id = ${id}
  `;
  return rows[0] || null;
}

// app/users/page.tsx
import { getUsers } from "@/lib/db";

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div>
      <h1>Users</h1>
      <div className="grid">
        {users.map((user) => (
          <div key={user.id} className="card">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <small>{user.created_at.toLocaleDateString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Multiple Data Sources

```typescript
// app/user/[id]/page.tsx
import { getUser } from "@/lib/db";
import { getUserPosts } from "@/lib/api";
import { getUserSettings } from "@/lib/settings";

interface PageProps {
  params: { id: string };
}

export default async function UserPage({ params }: PageProps) {
  // Fetch data in parallel
  const [user, posts, settings] = await Promise.all([
    getUser(params.id),
    getUserPosts(params.id),
    getUserSettings(params.id),
  ]);

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div>
      <header>
        <h1>{user.name}</h1>
        <p>{user.email}</p>
      </header>

      <section>
        <h2>Posts ({posts.length})</h2>
        {posts.map((post) => (
          <article key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
          </article>
        ))}
      </section>

      <aside>
        <h2>Settings</h2>
        <ul>
          <li>Theme: {settings.theme}</li>
          <li>Notifications: {settings.notifications ? "On" : "Off"}</li>
        </ul>
      </aside>
    </div>
  );
}
```

## Caching Strategies

### Request Memoization

```typescript
// lib/cache.ts
const cache = new Map();

export async function getCachedUser(id: string) {
  if (cache.has(id)) {
    return cache.get(id);
  }

  const user = await fetch(`https://api.example.com/users/${id}`).then((res) =>
    res.json()
  );

  cache.set(id, user);
  return user;
}

// Automatic request deduplication
export async function getUser(id: string) {
  // Next.js automatically deduplicates identical requests
  const res = await fetch(`https://api.example.com/users/${id}`);
  return res.json();
}

// Multiple calls to getUser with same ID will only make one request
```

### Fetch with Cache Control

```typescript
// Different caching strategies
export async function getStaticData() {
  const res = await fetch("https://api.example.com/config", {
    cache: "force-cache", // Cache indefinitely
  });
  return res.json();
}

export async function getDynamicData() {
  const res = await fetch("https://api.example.com/live-data", {
    cache: "no-store", // Never cache
  });
  return res.json();
}

export async function getTimedData() {
  const res = await fetch("https://api.example.com/news", {
    next: { revalidate: 300 }, // Revalidate every 5 minutes
  });
  return res.json();
}

export async function getTaggedData() {
  const res = await fetch("https://api.example.com/posts", {
    next: { tags: ["posts"] }, // Cache with tags for targeted invalidation
  });
  return res.json();
}
```

## Streaming and Suspense

### Streaming Components

```typescript
// app/dashboard/page.tsx
import { Suspense } from "react";
import UserProfile from "./UserProfile";
import RecentPosts from "./RecentPosts";
import Analytics from "./Analytics";

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>

      {/* Fast-loading component renders immediately */}
      <Suspense fallback={<div>Loading profile...</div>}>
        <UserProfile />
      </Suspense>

      {/* Slow components stream in when ready */}
      <div className="grid">
        <Suspense fallback={<div>Loading posts...</div>}>
          <RecentPosts />
        </Suspense>

        <Suspense fallback={<div>Loading analytics...</div>}>
          <Analytics />
        </Suspense>
      </div>
    </div>
  );
}

// components/RecentPosts.tsx
async function getPosts() {
  // Simulate slow API
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const res = await fetch("https://api.example.com/posts");
  return res.json();
}

export default async function RecentPosts() {
  const posts = await getPosts();

  return (
    <div>
      <h2>Recent Posts</h2>
      {posts.slice(0, 5).map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

### Loading Templates

```typescript
// app/loading.tsx - Global loading template
export default function Loading() {
  return (
    <div className="loading">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
}

// app/dashboard/loading.tsx - Dashboard-specific loading
export default function DashboardLoading() {
  return (
    <div>
      <div className="h-8 bg-gray-200 rounded mb-4 animate-pulse"></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
}
```

## Server Actions

### Form Handling

```typescript
// app/contact/page.tsx
import { redirect } from "next/navigation";

async function createContact(formData: FormData) {
  "use server"; // Server Action

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  // Validate data
  if (!name || !email || !message) {
    throw new Error("All fields are required");
  }

  // Save to database
  await saveContact({ name, email, message });

  // Redirect after successful submission
  redirect("/thank-you");
}

export default function ContactPage() {
  return (
    <form action={createContact}>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" required />
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required />
      </div>

      <div>
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" required />
      </div>

      <button type="submit">Send Message</button>
    </form>
  );
}
```

### Data Mutations

```typescript
// lib/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  // Validate
  if (!title || !content) {
    return { error: "Title and content are required" };
  }

  try {
    // Save to database
    const post = await savePost({ title, content });

    // Revalidate the posts page
    revalidatePath("/posts");

    // Redirect to the new post
    redirect(`/posts/${post.id}`);
  } catch (error) {
    return { error: "Failed to create post" };
  }
}

export async function deletePost(id: string) {
  try {
    await removePost(id);
    revalidatePath("/posts");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete post" };
  }
}

// components/PostForm.tsx
import { createPost } from "@/lib/actions";

export default function PostForm() {
  return (
    <form action={createPost}>
      <input name="title" placeholder="Post title" required />
      <textarea name="content" placeholder="Post content" required />
      <button type="submit">Create Post</button>
    </form>
  );
}
```

## Error Handling

### Error Boundaries

```typescript
// app/error.tsx - Global error boundary
"use client";

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
      <details>
        <summary>Error details</summary>
        <pre>{error.message}</pre>
      </details>
      <button onClick={reset}>Try again</button>
    </div>
  );
}

// app/dashboard/error.tsx - Dashboard-specific error
("use client");

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="dashboard-error">
      <h2>Dashboard Error</h2>
      <p>Unable to load dashboard data</p>
      <button onClick={reset}>Retry</button>
    </div>
  );
}
```

### Not Found Handling

```typescript
// app/not-found.tsx
export default function NotFound() {
  return (
    <div className="not-found">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <a href="/">Go home</a>
    </div>
  );
}

// app/posts/[id]/not-found.tsx
export default function PostNotFound() {
  return (
    <div>
      <h1>Post Not Found</h1>
      <p>The post you're looking for doesn't exist.</p>
      <a href="/posts">View all posts</a>
    </div>
  );
}

// app/posts/[id]/page.tsx
import { notFound } from "next/navigation";

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);

  if (!post) {
    notFound(); // Triggers not-found.tsx
  }

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
```

## Advanced Patterns

### Composition with Server and Client Components

```typescript
// Server Component wrapper
// app/blog/page.tsx
import BlogHeader from "./BlogHeader";
import PostList from "./PostList";
import Sidebar from "./Sidebar";

export default async function BlogPage() {
  const [posts, categories, featured] = await Promise.all([
    getPosts(),
    getCategories(),
    getFeaturedPosts(),
  ]);

  return (
    <div className="blog-layout">
      <BlogHeader featured={featured} />

      <main>
        <PostList posts={posts} />
      </main>

      <aside>
        <Sidebar categories={categories} />
      </aside>
    </div>
  );
}

// Mixed Server/Client components
// components/PostList.tsx
import PostCard from "./PostCard";
import LoadMoreButton from "./LoadMoreButton"; // Client component

interface PostListProps {
  posts: Post[];
}

export default function PostList({ posts }: PostListProps) {
  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {/* Client component for interactivity */}
      <LoadMoreButton />
    </div>
  );
}
```

### Data Streaming with React Suspense

```typescript
// app/analytics/page.tsx
import { Suspense } from "react";
import PageViews from "./PageViews";
import UserStats from "./UserStats";
import RevenueChart from "./RevenueChart";

export default function AnalyticsPage() {
  return (
    <div>
      <h1>Analytics Dashboard</h1>

      <div className="analytics-grid">
        <Suspense fallback={<SkeletonCard />}>
          <PageViews />
        </Suspense>

        <Suspense fallback={<SkeletonCard />}>
          <UserStats />
        </Suspense>

        <Suspense fallback={<SkeletonChart />}>
          <RevenueChart />
        </Suspense>
      </div>
    </div>
  );
}

// Each component fetches its own data
// components/PageViews.tsx
async function getPageViews() {
  const res = await fetch("https://analytics.example.com/pageviews", {
    next: { revalidate: 300 },
  });
  return res.json();
}

export default async function PageViews() {
  const data = await getPageViews();

  return (
    <div className="card">
      <h3>Page Views</h3>
      <div className="metric">{data.total.toLocaleString()}</div>
      <div className="change">+{data.change}% from last month</div>
    </div>
  );
}
```

## Best Practices

### Server Component Guidelines

- Use Server Components by default
- Keep server-only code in Server Components
- Fetch data as close to where it's used as possible
- Use Suspense for better loading experiences

### Performance Optimization

- Minimize client bundle size
- Use streaming for better perceived performance
- Implement proper caching strategies
- Avoid prop drilling between server and client

### Data Fetching

- Fetch data in parallel when possible
- Use proper cache strategies based on data freshness
- Handle loading and error states gracefully
- Implement request deduplication

### Error Handling

- Provide meaningful error messages
- Use error boundaries appropriately
- Handle not found cases explicitly
- Implement proper fallbacks

### Security

- Keep sensitive data in Server Components
- Validate all inputs in Server Actions
- Use proper authentication checks
- Sanitize data before rendering

This comprehensive guide covers React Server Components, providing the knowledge needed to build efficient, modern web applications with excellent performance and user experience.
