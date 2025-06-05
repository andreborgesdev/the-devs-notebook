# Apollo GraphQL Client

Apollo Client is a comprehensive state management library for JavaScript that enables you to manage both local and remote data with GraphQL.

## Installation and Setup

### Basic Installation

```bash
pnpm add @apollo/client graphql
```

### Client Setup

```tsx
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "https://api.example.com/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Post: {
        fields: {
          comments: {
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
    },
    query: {
      errorPolicy: "all",
    },
  },
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts" element={<Posts />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}
```

## Queries

### Basic Query

```tsx
import { useQuery, gql } from "@apollo/client";

const GET_USERS = gql`
  query GetUsers($first: Int, $after: String) {
    users(first: $first, after: $after) {
      edges {
        node {
          id
          name
          email
          avatar
          createdAt
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

interface UsersResponse {
  users: {
    edges: Array<{
      node: User;
      cursor: string;
    }>;
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
  };
}

function UsersList() {
  const { loading, error, data, refetch, fetchMore } = useQuery<UsersResponse>(
    GET_USERS,
    {
      variables: { first: 10 },
      notifyOnNetworkStatusChange: true,
    }
  );

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const users = data?.users.edges.map((edge) => edge.node) || [];

  const handleLoadMore = () => {
    if (data?.users.pageInfo.hasNextPage) {
      fetchMore({
        variables: {
          after: data.users.pageInfo.endCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          return {
            users: {
              ...fetchMoreResult.users,
              edges: [...prev.users.edges, ...fetchMoreResult.users.edges],
            },
          };
        },
      });
    }
  };

  return (
    <div>
      <button onClick={() => refetch()}>Refresh</button>

      <div className="users-grid">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>

      {data?.users.pageInfo.hasNextPage && (
        <button onClick={handleLoadMore}>Load More</button>
      )}
    </div>
  );
}
```

### Query with Variables

```tsx
const GET_POST = gql`
  query GetPost($id: ID!) {
    post(id: $id) {
      id
      title
      content
      publishedAt
      author {
        id
        name
        avatar
      }
      tags {
        id
        name
        color
      }
      comments(first: 5) {
        edges {
          node {
            id
            content
            createdAt
            author {
              id
              name
            }
          }
        }
        pageInfo {
          hasNextPage
        }
      }
    }
  }
`;

function PostDetail({ postId }: { postId: string }) {
  const { loading, error, data } = useQuery(GET_POST, {
    variables: { id: postId },
    skip: !postId,
  });

  if (loading) return <PostSkeleton />;
  if (error) return <ErrorMessage error={error} />;
  if (!data?.post) return <div>Post not found</div>;

  const { post } = data;

  return (
    <article>
      <header>
        <h1>{post.title}</h1>
        <div className="author">
          <img src={post.author.avatar} alt={post.author.name} />
          <span>{post.author.name}</span>
        </div>
        <time>{new Date(post.publishedAt).toLocaleDateString()}</time>
      </header>

      <div className="content">{post.content}</div>

      <div className="tags">
        {post.tags.map((tag) => (
          <Tag key={tag.id} tag={tag} />
        ))}
      </div>

      <CommentsSection comments={post.comments} postId={postId} />
    </article>
  );
}
```

### Lazy Queries

```tsx
import { useLazyQuery } from "@apollo/client";

const SEARCH_POSTS = gql`
  query SearchPosts($query: String!, $filters: PostFilters) {
    searchPosts(query: $query, filters: $filters) {
      id
      title
      excerpt
      publishedAt
      author {
        name
      }
    }
  }
`;

function SearchComponent() {
  const [searchPosts, { loading, data, error }] = useLazyQuery(SEARCH_POSTS);

  const handleSearch = (query: string, filters?: PostFilters) => {
    if (query.trim()) {
      searchPosts({
        variables: { query, filters },
      });
    }
  };

  return (
    <div>
      <SearchForm onSearch={handleSearch} />

      {loading && <div>Searching...</div>}
      {error && <div>Search failed: {error.message}</div>}

      {data?.searchPosts && (
        <div className="search-results">
          {data.searchPosts.map((post) => (
            <SearchResultCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
```

## Mutations

### Basic Mutation

```tsx
import { useMutation, gql } from "@apollo/client";

const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      title
      content
      publishedAt
      author {
        id
        name
      }
    }
  }
`;

const UPDATE_POST = gql`
  mutation UpdatePost($id: ID!, $input: UpdatePostInput!) {
    updatePost(id: $id, input: $input) {
      id
      title
      content
      publishedAt
    }
  }
`;

function CreatePostForm() {
  const [createPost, { loading, error }] = useMutation(CREATE_POST, {
    update(cache, { data: { createPost } }) {
      cache.modify({
        fields: {
          posts(existingPosts = []) {
            const newPostRef = cache.writeFragment({
              data: createPost,
              fragment: gql`
                fragment NewPost on Post {
                  id
                  title
                  content
                  publishedAt
                  author {
                    id
                    name
                  }
                }
              `,
            });
            return [newPostRef, ...existingPosts];
          },
        },
      });
    },
    onCompleted: (data) => {
      console.log("Post created:", data.createPost);
      // Reset form or redirect
    },
    onError: (error) => {
      console.error("Create post error:", error);
    },
  });

  const handleSubmit = async (formData: CreatePostInput) => {
    try {
      await createPost({
        variables: { input: formData },
      });
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        handleSubmit({
          title: formData.get("title") as string,
          content: formData.get("content") as string,
          tags: (formData.get("tags") as string).split(","),
        });
      }}
    >
      <input name="title" placeholder="Post title" required />
      <textarea name="content" placeholder="Post content" required />
      <input name="tags" placeholder="Tags (comma separated)" />

      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Post"}
      </button>

      {error && <div className="error">{error.message}</div>}
    </form>
  );
}
```

### Optimistic Updates

```tsx
const LIKE_POST = gql`
  mutation LikePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likesCount
      isLiked
    }
  }
`;

function LikeButton({ post }: { post: Post }) {
  const [likePost] = useMutation(LIKE_POST, {
    variables: { postId: post.id },
    optimisticResponse: {
      likePost: {
        __typename: "Post",
        id: post.id,
        likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1,
        isLiked: !post.isLiked,
      },
    },
    update(cache, { data }) {
      if (data?.likePost) {
        cache.writeFragment({
          id: cache.identify(post),
          fragment: gql`
            fragment UpdatedPost on Post {
              likesCount
              isLiked
            }
          `,
          data: {
            likesCount: data.likePost.likesCount,
            isLiked: data.likePost.isLiked,
          },
        });
      }
    },
    onError: (error) => {
      console.error("Like failed:", error);
      // Optionally show error message
    },
  });

  return (
    <button
      onClick={() => likePost()}
      className={`like-button ${post.isLiked ? "liked" : ""}`}
    >
      ❤️ {post.likesCount}
    </button>
  );
}
```

### File Upload

```tsx
const UPLOAD_FILE = gql`
  mutation UploadFile($file: Upload!) {
    uploadFile(file: $file) {
      url
      filename
      mimetype
      encoding
    }
  }
`;

function FileUpload() {
  const [uploadFile, { loading, error, data }] = useMutation(UPLOAD_FILE);

  const handleFileUpload = (file: File) => {
    uploadFile({
      variables: { file },
      context: {
        hasUpload: true,
      },
    });
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFileUpload(file);
          }
        }}
      />

      {loading && <div>Uploading...</div>}
      {error && <div>Upload failed: {error.message}</div>}
      {data && <div>File uploaded: {data.uploadFile.url}</div>}
    </div>
  );
}
```

## Subscriptions

### Real-time Updates

```tsx
import { useSubscription, gql } from "@apollo/client";

const COMMENT_ADDED = gql`
  subscription CommentAdded($postId: ID!) {
    commentAdded(postId: $postId) {
      id
      content
      createdAt
      author {
        id
        name
        avatar
      }
    }
  }
`;

function CommentsSection({ postId }: { postId: string }) {
  const { data: subscriptionData } = useSubscription(COMMENT_ADDED, {
    variables: { postId },
    onSubscriptionData: ({ client, subscriptionData }) => {
      if (subscriptionData.data?.commentAdded) {
        client.cache.modify({
          id: client.cache.identify({ __typename: "Post", id: postId }),
          fields: {
            comments(existingComments = []) {
              const newComment = subscriptionData.data.commentAdded;
              return [newComment, ...existingComments];
            },
          },
        });
      }
    },
  });

  const { loading, data } = useQuery(GET_POST_COMMENTS, {
    variables: { postId },
  });

  if (loading) return <div>Loading comments...</div>;

  return (
    <div className="comments-section">
      <h3>Comments</h3>
      {data?.post.comments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
```

## Local State Management

### Local State with Reactive Variables

```tsx
import { makeVar, useReactiveVar } from "@apollo/client";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export const cartItemsVar = makeVar<CartItem[]>([]);
export const isCartOpenVar = makeVar(false);

export function useCart() {
  const cartItems = useReactiveVar(cartItemsVar);
  const isCartOpen = useReactiveVar(isCartOpenVar);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    const currentItems = cartItemsVar();
    const existingItem = currentItems.find((i) => i.id === item.id);

    if (existingItem) {
      cartItemsVar(
        currentItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      cartItemsVar([...currentItems, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId: string) => {
    cartItemsVar(cartItemsVar().filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      cartItemsVar(
        cartItemsVar().map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    }
  };

  const toggleCart = () => {
    isCartOpenVar(!isCartOpenVar());
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return {
    cartItems,
    isCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    toggleCart,
    totalPrice,
    itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
  };
}
```

### Local Fields

```tsx
const GET_POSTS_WITH_LOCAL_STATE = gql`
  query GetPostsWithLocalState {
    posts {
      id
      title
      content
      isBookmarked @client
      readingTime @client
    }
  }
`;

const client = new ApolloClient({
  uri: "https://api.example.com/graphql",
  cache: new InMemoryCache({
    typePolicies: {
      Post: {
        fields: {
          isBookmarked: {
            read(existing = false) {
              return existing;
            },
          },
          readingTime: {
            read(existing, { readField }) {
              if (existing) return existing;

              const content = readField("content") as string;
              const wordsPerMinute = 200;
              const wordCount = content?.split(" ").length || 0;
              return Math.ceil(wordCount / wordsPerMinute);
            },
          },
        },
      },
    },
  }),
});
```

## Error Handling

### GraphQL Error Handling

```tsx
import { ApolloError } from "@apollo/client";

function handleApolloError(error: ApolloError) {
  if (error.networkError) {
    console.error("Network error:", error.networkError);

    if ("statusCode" in error.networkError) {
      switch (error.networkError.statusCode) {
        case 401:
          // Redirect to login
          window.location.href = "/login";
          break;
        case 403:
          // Show unauthorized message
          break;
        case 500:
          // Show server error message
          break;
      }
    }
  }

  if (error.graphQLErrors.length > 0) {
    error.graphQLErrors.forEach((graphQLError) => {
      console.error("GraphQL error:", graphQLError);

      switch (graphQLError.extensions?.code) {
        case "UNAUTHENTICATED":
          // Handle authentication error
          break;
        case "FORBIDDEN":
          // Handle authorization error
          break;
        case "VALIDATION_ERROR":
          // Handle validation errors
          break;
      }
    });
  }
}

function PostsList() {
  const { loading, error, data } = useQuery(GET_POSTS, {
    errorPolicy: "all",
    onError: handleApolloError,
  });

  if (loading) return <div>Loading...</div>;

  if (error) {
    return (
      <ErrorBoundary error={error}>
        <div>Failed to load posts</div>
      </ErrorBoundary>
    );
  }

  return (
    <div>
      {data?.posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

### Error Boundary

```tsx
import { ErrorBoundary } from "react-error-boundary";
import { ApolloError } from "@apollo/client";

function ApolloErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: ApolloError;
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="error-boundary">
      <h2>Something went wrong</h2>
      <details>
        {error.networkError && (
          <p>Network Error: {error.networkError.message}</p>
        )}
        {error.graphQLErrors.map((graphQLError, index) => (
          <p key={index}>GraphQL Error: {graphQLError.message}</p>
        ))}
      </details>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <ErrorBoundary FallbackComponent={ApolloErrorFallback}>
        <Router />
      </ErrorBoundary>
    </ApolloProvider>
  );
}
```

## Testing Apollo Client

### MockedProvider Setup

```tsx
import { MockedProvider } from "@apollo/client/testing";
import { render, screen, waitFor } from "@testing-library/react";

const mocks = [
  {
    request: {
      query: GET_USERS,
      variables: { first: 10 },
    },
    result: {
      data: {
        users: {
          edges: [
            {
              node: {
                id: "1",
                name: "John Doe",
                email: "john@example.com",
                avatar: "https://example.com/avatar.jpg",
                createdAt: "2023-01-01T00:00:00Z",
              },
              cursor: "cursor1",
            },
          ],
          pageInfo: {
            hasNextPage: true,
            endCursor: "cursor1",
          },
        },
      },
    },
  },
];

describe("UsersList", () => {
  it("renders users correctly", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <UsersList />
      </MockedProvider>
    );

    expect(screen.getByText("Loading users...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
  });

  it("handles error state", async () => {
    const errorMocks = [
      {
        request: {
          query: GET_USERS,
          variables: { first: 10 },
        },
        error: new Error("Network error"),
      },
    ];

    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <UsersList />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });
});
```

### Testing Mutations

```tsx
import userEvent from "@testing-library/user-event";

const createPostMock = {
  request: {
    query: CREATE_POST,
    variables: {
      input: {
        title: "Test Post",
        content: "Test content",
        tags: ["test"],
      },
    },
  },
  result: {
    data: {
      createPost: {
        id: "1",
        title: "Test Post",
        content: "Test content",
        publishedAt: "2023-01-01T00:00:00Z",
        author: {
          id: "1",
          name: "Test User",
        },
      },
    },
  },
};

describe("CreatePostForm", () => {
  it("creates a post successfully", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[createPostMock]} addTypename={false}>
        <CreatePostForm />
      </MockedProvider>
    );

    await user.type(screen.getByPlaceholderText("Post title"), "Test Post");
    await user.type(
      screen.getByPlaceholderText("Post content"),
      "Test content"
    );
    await user.type(
      screen.getByPlaceholderText("Tags (comma separated)"),
      "test"
    );

    await user.click(screen.getByText("Create Post"));

    await waitFor(() => {
      expect(screen.getByText("Creating...")).toBeInTheDocument();
    });
  });
});
```

## Performance Optimization

### Fragment Colocation

```tsx
const USER_FRAGMENT = gql`
  fragment UserInfo on User {
    id
    name
    email
    avatar
  }
`;

const POST_FRAGMENT = gql`
  fragment PostInfo on Post {
    id
    title
    excerpt
    publishedAt
    author {
      ...UserInfo
    }
  }
  ${USER_FRAGMENT}
`;

const GET_POSTS = gql`
  query GetPosts {
    posts {
      ...PostInfo
    }
  }
  ${POST_FRAGMENT}
`;
```

### Query Batching

```tsx
import { ApolloClient, InMemoryCache, from } from "@apollo/client";
import { BatchHttpLink } from "@apollo/client/link/batch-http";

const batchLink = new BatchHttpLink({
  uri: "https://api.example.com/graphql",
  batchMax: 5,
  batchInterval: 20,
});

const client = new ApolloClient({
  link: from([authLink, batchLink]),
  cache: new InMemoryCache(),
});
```

### Cache Optimization

```tsx
const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          posts: {
            keyArgs: ["filters"],
            merge(existing = [], incoming, { args }) {
              if (args?.offset === 0) {
                return incoming;
              }
              return [...existing, ...incoming];
            },
          },
        },
      },
      Post: {
        keyFields: ["id"],
      },
    },
  }),
});
```

## Best Practices

### Schema Design

```graphql
type Query {
  user(id: ID!): User
  posts(first: Int, after: String, filters: PostFilters): PostConnection
}

type Mutation {
  createPost(input: CreatePostInput!): CreatePostPayload
  updatePost(id: ID!, input: UpdatePostInput!): UpdatePostPayload
}

type Subscription {
  postUpdated(id: ID!): Post
  commentAdded(postId: ID!): Comment
}

input PostFilters {
  authorId: ID
  tags: [String!]
  published: Boolean
}

type CreatePostPayload {
  post: Post
  errors: [UserError!]
}
```

### Error Handling Strategy

```tsx
const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.error(
          `GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`
        );
      });
    }

    if (networkError) {
      console.error(`Network error: ${networkError}`);

      if (networkError.statusCode === 401) {
        // Handle logout
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  }
);
```

## Interview Questions

**Q: What is Apollo Client and how does it differ from REST API clients?**
A: Apollo Client is a GraphQL client that provides caching, optimistic updates, subscriptions, and normalized cache. Unlike REST clients, it allows requesting specific fields and provides automatic cache management.

**Q: Explain the Apollo Client cache and its benefits.**
A: Apollo uses a normalized cache that stores objects by their ID and type. Benefits include automatic cache updates, query deduplication, optimistic updates, and efficient re-renders.

**Q: How do you handle authentication in Apollo Client?**
A: Use Apollo Link to add authentication headers to requests, handle token refresh, and manage authentication state through context or reactive variables.

**Q: What are Apollo Client policies and when would you use them?**
A: Cache policies determine how queries interact with the cache (cache-first, network-only, cache-and-network). Field policies control how individual fields are read from and written to the cache.

**Q: How do you implement optimistic updates in Apollo?**
A: Use the optimisticResponse option in mutations to immediately update the UI, then revert if the mutation fails or apply the real response when it succeeds.

**Q: What's the difference between useQuery and useLazyQuery?**
A: useQuery executes immediately when the component mounts, while useLazyQuery returns a function that can be called manually to execute the query.
