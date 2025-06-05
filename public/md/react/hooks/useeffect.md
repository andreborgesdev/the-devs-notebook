# useEffect Hook

## Overview

The `useEffect` hook lets you perform side effects in functional components. It serves the same purpose as `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount` combined in React class components.

## Basic Syntax

```javascript
useEffect(() => {
  // Side effect logic

  return () => {
    // Cleanup logic (optional)
  };
}, [dependencies]); // Dependency array (optional)
```

## Effect Patterns

### Effect with No Dependencies (Runs Every Render)

```javascript
import React, { useState, useEffect } from "react";

function Component() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("Runs on every render");
  });

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### Effect with Empty Dependencies (Runs Once)

```javascript
function Component() {
  const [data, setData] = useState(null);

  useEffect(() => {
    console.log("Runs only once after mount");
    fetchData().then(setData);
  }, []); // Empty dependency array

  return <div>{data ? JSON.stringify(data) : "Loading..."}</div>;
}
```

### Effect with Dependencies (Runs When Dependencies Change)

```javascript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchUser(userId).then((userData) => {
      setUser(userData);
      setLoading(false);
    });
  }, [userId]); // Runs when userId changes

  return (
    <div>{loading ? "Loading..." : user ? user.name : "User not found"}</div>
  );
}
```

## Data Fetching Examples

### Basic API Call

```javascript
function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/posts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

### Dependent API Calls

```javascript
function UserPosts({ userId }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  // Fetch user data
  useEffect(() => {
    if (userId) {
      fetchUser(userId).then(setUser);
    }
  }, [userId]);

  // Fetch user posts (depends on user data)
  useEffect(() => {
    if (user?.id) {
      fetchUserPosts(user.id).then(setPosts);
    }
  }, [user?.id]);

  return (
    <div>
      {user && <h2>{user.name}'s Posts</h2>}
      {posts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

## Cleanup Functions

### Event Listeners

```javascript
function WindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array

  return <div>Window width: {width}px</div>;
}
```

### Timers and Intervals

```javascript
function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive]);

  return (
    <div>
      <p>Time: {seconds}s</p>
      <button onClick={() => setIsActive(!isActive)}>
        {isActive ? "Pause" : "Start"}
      </button>
      <button onClick={() => setSeconds(0)}>Reset</button>
    </div>
  );
}
```

### Subscriptions

```javascript
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const subscription = subscribeToRoom(roomId, (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [roomId]);

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>{message.text}</div>
      ))}
    </div>
  );
}
```

## Advanced Patterns

### Custom Hook for Data Fetching

```javascript
function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchData();
    }
  }, [url]);

  return { data, loading, error };
}

// Usage
function UserProfile({ userId }) {
  const { data: user, loading, error } = useApi(`/api/users/${userId}`);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>User not found</div>;

  return <div>Hello, {user.name}!</div>;
}
```

### Conditional Effects

```javascript
function ConditionalEffect({ shouldFetch, query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!shouldFetch || !query) {
      return;
    }

    const searchResults = async () => {
      const response = await fetch(`/api/search?q=${query}`);
      const data = await response.json();
      setResults(data);
    };

    searchResults();
  }, [shouldFetch, query]);

  return (
    <div>
      {results.map((result) => (
        <div key={result.id}>{result.title}</div>
      ))}
    </div>
  );
}
```

### Debounced Effects

```javascript
function SearchInput() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      const response = await fetch(`/api/search?q=${query}`);
      const data = await response.json();
      setResults(data);
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <ul>
        {results.map((result) => (
          <li key={result.id}>{result.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Multiple Effects

```javascript
function UserDashboard({ userId }) {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [onlineStatus, setOnlineStatus] = useState(false);

  // Effect for user data
  useEffect(() => {
    if (userId) {
      fetchUser(userId).then(setUser);
    }
  }, [userId]);

  // Effect for notifications
  useEffect(() => {
    if (userId) {
      fetchNotifications(userId).then(setNotifications);
    }
  }, [userId]);

  // Effect for online status
  useEffect(() => {
    const handleOnline = () => setOnlineStatus(true);
    const handleOffline = () => setOnlineStatus(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div>
      <div>Status: {onlineStatus ? "Online" : "Offline"}</div>
      {user && <div>Welcome, {user.name}!</div>}
      <div>Notifications: {notifications.length}</div>
    </div>
  );
}
```

## Interview Questions

### Q: What's the difference between useEffect dependencies?

| Dependencies                     | Behavior                      | Use Case                 |
| -------------------------------- | ----------------------------- | ------------------------ |
| No dependency array              | Runs on every render          | Rare, usually not needed |
| Empty array `[]`                 | Runs once after mount         | API calls, subscriptions |
| With dependencies `[dep1, dep2]` | Runs when dependencies change | Dependent computations   |

### Q: Why do we need cleanup functions?

Cleanup functions prevent:

- Memory leaks from subscriptions
- Multiple event listeners
- Running timers after component unmount
- Incomplete async operations

### Q: What happens if you forget dependencies?

ESLint with `react-hooks/exhaustive-deps` will warn you. Missing dependencies can lead to:

- Stale closures
- Infinite loops
- Inconsistent state

## Common Patterns Comparison

### Class Component vs useEffect

```javascript
// Class Component
class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = { user: null };
  }

  componentDidMount() {
    this.fetchUser(this.props.userId);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.userId !== this.props.userId) {
      this.fetchUser(this.props.userId);
    }
  }

  componentWillUnmount() {
    // Cleanup
  }

  fetchUser(userId) {
    // Fetch logic
  }

  render() {
    return <div>{this.state.user?.name}</div>;
  }
}

// Functional Component with useEffect
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);

  return <div>{user?.name}</div>;
}
```

## Best Practices

| Practice                     | Description                                 | Example                    |
| ---------------------------- | ------------------------------------------- | -------------------------- |
| **Include all dependencies** | Add all variables from component scope      | `[userId, status]`         |
| **Separate concerns**        | Use multiple effects for different purposes | User data vs notifications |
| **Cleanup properly**         | Always cleanup subscriptions and timers     | `return () => cleanup()`   |
| **Handle async correctly**   | Use cleanup flags for async operations      | `let cancelled = false`    |
| **Use custom hooks**         | Extract reusable effect logic               | `useApi`, `useDebounce`    |

## Common Mistakes

### Missing Dependencies

```javascript
// ❌ Wrong - Missing dependency
function Component({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, []); // Missing userId dependency

  return <div>{user?.name}</div>;
}

// ✅ Correct
useEffect(() => {
  fetchUser(userId).then(setUser);
}, [userId]);
```

### Infinite Loops

```javascript
// ❌ Wrong - Causes infinite loop
function Component() {
  const [user, setUser] = useState({});

  useEffect(() => {
    setUser({ name: "John" });
  }, [user]); // user object changes every time

  return <div>{user.name}</div>;
}

// ✅ Correct - Use specific property
useEffect(() => {
  if (!user.name) {
    setUser({ name: "John" });
  }
}, [user.name]);
```

### Not Handling Cleanup

```javascript
// ❌ Wrong - No cleanup
function Component() {
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Running...");
    }, 1000);
  }, []);

  return <div>Component</div>;
}

// ✅ Correct - With cleanup
useEffect(() => {
  const interval = setInterval(() => {
    console.log("Running...");
  }, 1000);

  return () => clearInterval(interval);
}, []);
```

## Async/Await in useEffect

```javascript
// ❌ Wrong - useEffect callback cannot be async
useEffect(async () => {
  const data = await fetchData();
  setData(data);
}, []);

// ✅ Correct - Define async function inside
useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await fetch("/api/data");
      const result = await data.json();
      setData(result);
    } catch (error) {
      setError(error.message);
    }
  };

  fetchData();
}, []);

// ✅ Alternative - Using .then()
useEffect(() => {
  fetch("/api/data")
    .then((response) => response.json())
    .then(setData)
    .catch((error) => setError(error.message));
}, []);
```

## Performance Considerations

- Effects run after every completed render
- Cleanup functions run before the next effect and on unmount
- Use dependency arrays to control when effects run
- Expensive operations should be memoized or moved to useMemo/useCallback
- Consider using useLayoutEffect for DOM measurements

## TypeScript Usage

```typescript
import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

function UserProfile({ userId }: { userId: number }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async (): Promise<void> => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        const userData: User = await response.json();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return (
    <div>{loading ? "Loading..." : user ? user.name : "User not found"}</div>
  );
}
```
