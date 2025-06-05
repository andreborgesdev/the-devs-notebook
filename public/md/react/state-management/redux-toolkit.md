# Redux Toolkit (RTK) with React

Redux Toolkit is the official, opinionated, batteries-included toolset for efficient Redux development. It simplifies Redux usage while maintaining its core principles.

## Setup and Installation

### Basic Setup

```bash
npm install @reduxjs/toolkit react-redux
```

```tsx
// store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authSlice from "./slices/authSlice";
import postsSlice from "./slices/postsSlice";
import uiSlice from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    posts: postsSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

```tsx
// App.tsx
import { Provider } from "react-redux";
import { store } from "./store";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Header />
        <Main />
      </div>
    </Provider>
  );
}

export default App;
```

## Creating Slices

### Basic Slice with createSlice

```tsx
// store/slices/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  updateProfile,
} = authSlice.actions;

export default authSlice.reducer;
```

### Complex Slice with Nested State

```tsx
// store/slices/postsSlice.ts
import { createSlice, PayloadAction, nanoid } from "@reduxjs/toolkit";

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  comments: Comment[];
}

interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

interface PostsState {
  posts: Post[];
  selectedPost: Post | null;
  loading: boolean;
  error: string | null;
  filters: {
    author: string;
    sortBy: "newest" | "oldest" | "popular";
    searchQuery: string;
  };
}

const initialState: PostsState = {
  posts: [],
  selectedPost: null,
  loading: false,
  error: null,
  filters: {
    author: "",
    sortBy: "newest",
    searchQuery: "",
  },
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addPost: {
      reducer: (state, action: PayloadAction<Post>) => {
        state.posts.unshift(action.payload);
      },
      prepare: (title: string, content: string, author: string) => {
        const id = nanoid();
        const now = new Date().toISOString();
        return {
          payload: {
            id,
            title,
            content,
            author,
            createdAt: now,
            updatedAt: now,
            likes: 0,
            comments: [],
          },
        };
      },
    },
    updatePost: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Post> }>
    ) => {
      const { id, updates } = action.payload;
      const postIndex = state.posts.findIndex((post) => post.id === id);
      if (postIndex !== -1) {
        state.posts[postIndex] = {
          ...state.posts[postIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deletePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
      if (state.selectedPost?.id === action.payload) {
        state.selectedPost = null;
      }
    },
    likePost: (state, action: PayloadAction<string>) => {
      const post = state.posts.find((post) => post.id === action.payload);
      if (post) {
        post.likes += 1;
      }
    },
    addComment: (
      state,
      action: PayloadAction<{ postId: string; content: string; author: string }>
    ) => {
      const { postId, content, author } = action.payload;
      const post = state.posts.find((post) => post.id === postId);
      if (post) {
        post.comments.push({
          id: nanoid(),
          content,
          author,
          createdAt: new Date().toISOString(),
        });
      }
    },
    setSelectedPost: (state, action: PayloadAction<string | null>) => {
      const postId = action.payload;
      state.selectedPost = postId
        ? state.posts.find((post) => post.id === postId) || null
        : null;
    },
    setFilters: (
      state,
      action: PayloadAction<Partial<PostsState["filters"]>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const {
  addPost,
  updatePost,
  deletePost,
  likePost,
  addComment,
  setSelectedPost,
  setFilters,
  clearFilters,
} = postsSlice.actions;

export default postsSlice.reducer;
```

## Async Actions with createAsyncThunk

### Basic Async Thunk

```tsx
// store/slices/authSlice.ts (extended)
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface LoginCredentials {
  email: string;
  password: string;
}

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Login failed");
      }

      const user = await response.json();
      localStorage.setItem("token", user.token);
      return user;
    } catch (error) {
      return rejectWithValue("Network error occurred");
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("No token found");
      }

      const response = await fetch("/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        return rejectWithValue("Failed to fetch profile");
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue("Network error occurred");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Fetch profile cases
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
```

### Complex Async Operations

```tsx
// store/slices/postsSlice.ts (extended)
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (
    params: { page?: number; limit?: number; author?: string },
    { rejectWithValue }
  ) => {
    try {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.set("page", params.page.toString());
      if (params.limit) searchParams.set("limit", params.limit.toString());
      if (params.author) searchParams.set("author", params.author);

      const response = await fetch(`/api/posts?${searchParams}`);
      if (!response.ok) {
        return rejectWithValue("Failed to fetch posts");
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue("Network error occurred");
    }
  }
);

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (
    postData: { title: string; content: string },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const token = localStorage.getItem("token");

      if (!state.auth.isAuthenticated || !token) {
        return rejectWithValue("Authentication required");
      }

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...postData,
          author: state.auth.user?.name,
        }),
      });

      if (!response.ok) {
        return rejectWithValue("Failed to create post");
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue("Network error occurred");
    }
  }
);

// Extended slice with async reducers
const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // ... existing reducers
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});
```

## Selectors and useSelector

### Basic Selectors

```tsx
// store/selectors/authSelectors.ts
import { RootState } from "../index";

export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

// Usage in components
function UserProfile() {
  const user = useAppSelector(selectUser);
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>Not logged in</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

### Memoized Selectors with createSelector

```tsx
// store/selectors/postsSelectors.ts
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../index";

export const selectPosts = (state: RootState) => state.posts.posts;
export const selectPostsFilters = (state: RootState) => state.posts.filters;
export const selectSelectedPost = (state: RootState) =>
  state.posts.selectedPost;

export const selectFilteredPosts = createSelector(
  [selectPosts, selectPostsFilters],
  (posts, filters) => {
    let filtered = posts;

    if (filters.author) {
      filtered = filtered.filter((post) =>
        post.author.toLowerCase().includes(filters.author.toLowerCase())
      );
    }

    if (filters.searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.title
            .toLowerCase()
            .includes(filters.searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }

    switch (filters.sortBy) {
      case "newest":
        return [...filtered].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return [...filtered].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "popular":
        return [...filtered].sort((a, b) => b.likes - a.likes);
      default:
        return filtered;
    }
  }
);

export const selectPostById = createSelector(
  [selectPosts, (_: RootState, postId: string) => postId],
  (posts, postId) => posts.find((post) => post.id === postId)
);

export const selectPostStats = createSelector([selectPosts], (posts) => ({
  totalPosts: posts.length,
  totalLikes: posts.reduce((sum, post) => sum + post.likes, 0),
  totalComments: posts.reduce((sum, post) => sum + post.comments.length, 0),
  mostPopularPost: posts.reduce(
    (max, post) => (post.likes > max.likes ? post : max),
    posts[0] || { likes: 0 }
  ),
}));
```

## React Components with RTK

### Connected Components

```tsx
// components/PostList.tsx
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { fetchPosts, setFilters } from "../store/slices/postsSlice";
import {
  selectFilteredPosts,
  selectPostsFilters,
  selectPostStats,
} from "../store/selectors/postsSelectors";

function PostList() {
  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectFilteredPosts);
  const filters = useAppSelector(selectPostsFilters);
  const stats = useAppSelector(selectPostStats);
  const loading = useAppSelector((state) => state.posts.loading);

  useEffect(() => {
    dispatch(fetchPosts({}));
  }, [dispatch]);

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    dispatch(setFilters(newFilters));
  };

  if (loading) return <div>Loading posts...</div>;

  return (
    <div>
      <div className="stats">
        <span>Total Posts: {stats.totalPosts}</span>
        <span>Total Likes: {stats.totalLikes}</span>
        <span>Total Comments: {stats.totalComments}</span>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search posts..."
          value={filters.searchQuery}
          onChange={(e) => handleFilterChange({ searchQuery: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filter by author..."
          value={filters.author}
          onChange={(e) => handleFilterChange({ author: e.target.value })}
        />
        <select
          value={filters.sortBy}
          onChange={(e) =>
            handleFilterChange({
              sortBy: e.target.value as typeof filters.sortBy,
            })
          }
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>

      <div className="posts">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

// components/PostCard.tsx
function PostCard({ post }: { post: Post }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const handleLike = () => {
    dispatch(likePost(post.id));
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this post?")) {
      dispatch(deletePost(post.id));
    }
  };

  return (
    <div className="post-card">
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <div className="post-meta">
        <span>By {post.author}</span>
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>
      <div className="post-actions">
        <button onClick={handleLike}>👍 {post.likes}</button>
        <span>💬 {post.comments.length}</span>
        {user?.name === post.author && (
          <button onClick={handleDelete}>🗑️ Delete</button>
        )}
      </div>
    </div>
  );
}
```

### Form Components with RTK

```tsx
// components/LoginForm.tsx
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { loginUser, clearError } from "../store/slices/authSlice";
import {
  selectAuthLoading,
  selectAuthError,
} from "../store/selectors/authSelectors";

function LoginForm() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(loginUser(formData));

    if (loginUser.fulfilled.match(result)) {
      console.log("Login successful");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (error) {
      dispatch(clearError());
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="Email"
        required
      />

      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleInputChange}
        placeholder="Password"
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
```

## RTK Query Integration

### Basic API Slice

```tsx
// store/api/apiSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Post", "User"],
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => "/posts",
      providesTags: ["Post"],
    }),
    getPost: builder.query<Post, string>({
      query: (id) => `/posts/${id}`,
      providesTags: (result, error, id) => [{ type: "Post", id }],
    }),
    createPost: builder.mutation<Post, Omit<Post, "id">>({
      query: (newPost) => ({
        url: "/posts",
        method: "POST",
        body: newPost,
      }),
      invalidatesTags: ["Post"],
    }),
    updatePost: builder.mutation<Post, Partial<Post> & Pick<Post, "id">>({
      query: ({ id, ...patch }) => ({
        url: `/posts/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Post", id }],
    }),
    deletePost: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Post"],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = apiSlice;
```

### Using RTK Query in Components

```tsx
// components/PostListWithRTKQuery.tsx
import {
  useGetPostsQuery,
  useCreatePostMutation,
  useDeletePostMutation,
} from "../store/api/apiSlice";

function PostListWithRTKQuery() {
  const { data: posts, error, isLoading, refetch } = useGetPostsQuery();

  const [createPost, { isLoading: isCreating }] = useCreatePostMutation();
  const [deletePost] = useDeletePostMutation();

  const handleCreatePost = async (postData: Omit<Post, "id">) => {
    try {
      await createPost(postData).unwrap();
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading posts</div>;

  return (
    <div>
      <button onClick={() => refetch()}>Refresh Posts</button>

      <CreatePostForm onSubmit={handleCreatePost} loading={isCreating} />

      {posts?.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <button onClick={() => deletePost(post.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

## Best Practices

### Folder Structure

```
src/
├── store/
│   ├── index.ts
│   ├── slices/
│   │   ├── authSlice.ts
│   │   ├── postsSlice.ts
│   │   └── uiSlice.ts
│   ├── selectors/
│   │   ├── authSelectors.ts
│   │   └── postsSelectors.ts
│   └── api/
│       └── apiSlice.ts
├── components/
├── hooks/
└── utils/
```

### Type Safety

```tsx
// types/store.ts
export interface RootState {
  auth: AuthState;
  posts: PostsState;
  ui: UiState;
}

export interface AppDispatch {
  (action: AnyAction): any;
}

// hooks/redux.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

## RTK vs Other Solutions

| Feature                | RTK                  | Redux             | Context API | Zustand  |
| ---------------------- | -------------------- | ----------------- | ----------- | -------- |
| **Bundle Size**        | ~10KB                | ~15KB             | 0KB         | ~2KB     |
| **Learning Curve**     | Medium               | High              | Low         | Low      |
| **DevTools**           | Excellent            | Excellent         | Limited     | Good     |
| **TypeScript Support** | Excellent            | Good              | Good        | Good     |
| **Async Handling**     | Built-in (RTK Query) | Middleware needed | Manual      | Built-in |
| **Performance**        | Excellent            | Excellent         | Good        | Good     |

## Interview Questions

### Q: What problems does Redux Toolkit solve compared to vanilla Redux?

**Answer:** RTK reduces boilerplate code, provides good defaults, includes utilities like createSlice and createAsyncThunk, has built-in Immer for immutable updates, and includes RTK Query for data fetching.

### Q: When should you use RTK Query vs regular async thunks?

**Answer:** Use RTK Query for server state management (caching, refetching, optimistic updates). Use async thunks for complex client-side state logic or when you need more control over the async flow.

### Q: How does RTK handle immutability?

**Answer:** RTK uses Immer internally, allowing you to write "mutative" logic in reducers that actually produces immutable updates. This makes the code more readable while maintaining Redux's immutability principles.

### Q: What are the performance benefits of using selectors?

**Answer:** Selectors prevent unnecessary re-renders by computing derived state, can be memoized with createSelector, and allow components to subscribe only to the specific parts of state they need.
