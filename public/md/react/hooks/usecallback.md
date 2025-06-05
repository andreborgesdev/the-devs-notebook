# React useCallback Hook

## Overview

The `useCallback` hook returns a memoized callback function that only changes when its dependencies change. It's used to optimize performance by preventing unnecessary re-renders of child components that receive the callback as a prop.

## Basic Syntax

```javascript
const memoizedCallback = useCallback(() => {
  // callback function
}, [dependencies]);
```

## Basic Example

```javascript
import React, { useState, useCallback } from "react";

const ChildComponent = React.memo(({ onClick, name }) => {
  console.log(`Rendering ${name}`);
  return <button onClick={onClick}>Click {name}</button>;
});

function Parent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("John");

  const handleClick = useCallback(() => {
    console.log("Button clicked!");
  }, []);

  const handleNameClick = useCallback(() => {
    setName((prevName) => (prevName === "John" ? "Jane" : "John"));
  }, []);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>

      <ChildComponent onClick={handleClick} name="Static" />
      <ChildComponent onClick={handleNameClick} name="Dynamic" />
    </div>
  );
}
```

## With Dependencies

```javascript
import React, { useState, useCallback } from "react";

function SearchComponent({ items }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");

  const handleSearch = useCallback(
    (query) => {
      console.log(`Searching for "${query}" in category "${category}"`);

      const filteredItems = items.filter((item) => {
        const matchesQuery = item.name
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesCategory =
          category === "all" || item.category === category;
        return matchesQuery && matchesCategory;
      });

      return filteredItems;
    },
    [items, category]
  );

  const handleCategoryChange = useCallback((newCategory) => {
    setCategory(newCategory);
  }, []);

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search items..."
      />

      <SearchResults
        onSearch={handleSearch}
        searchTerm={searchTerm}
        onCategoryChange={handleCategoryChange}
      />
    </div>
  );
}

const SearchResults = React.memo(
  ({ onSearch, searchTerm, onCategoryChange }) => {
    console.log("SearchResults rendered");

    const results = onSearch(searchTerm);

    return (
      <div>
        <select onChange={(e) => onCategoryChange(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="books">Books</option>
        </select>

        {results.map((item) => (
          <div key={item.id}>{item.name}</div>
        ))}
      </div>
    );
  }
);
```

## Event Handlers with Parameters

```javascript
import React, { useState, useCallback } from "react";

function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Learn React", completed: false },
    { id: 2, text: "Master Hooks", completed: false },
  ]);

  const toggleTodo = useCallback((id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  }, []);

  const addTodo = useCallback((text) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
    };
    setTodos((prevTodos) => [...prevTodos, newTodo]);
  }, []);

  return (
    <div>
      <AddTodoForm onAdd={addTodo} />
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />
      ))}
    </div>
  );
}

const TodoItem = React.memo(({ todo, onToggle, onDelete }) => {
  console.log(`Rendering todo: ${todo.text}`);

  return (
    <div>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span
        style={{ textDecoration: todo.completed ? "line-through" : "none" }}
      >
        {todo.text}
      </span>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </div>
  );
});

const AddTodoForm = React.memo(({ onAdd }) => {
  const [text, setText] = useState("");

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (text.trim()) {
        onAdd(text.trim());
        setText("");
      }
    },
    [text, onAdd]
  );

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add new todo..."
      />
      <button type="submit">Add</button>
    </form>
  );
});
```

## API Calls with useCallback

```javascript
import React, { useState, useCallback, useEffect } from "react";

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async (id) => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/users/${id}`);
      if (!response.ok) throw new Error("User not found");

      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(
    async (userData) => {
      setLoading(true);

      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        });

        if (!response.ok) throw new Error("Update failed");

        const updatedUser = await response.json();
        setUser(updatedUser);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  useEffect(() => {
    fetchUser(userId);
  }, [fetchUser, userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user found</div>;

  return (
    <div>
      <UserDetails user={user} onUpdate={updateUser} />
      <RefreshButton onRefresh={() => fetchUser(userId)} />
    </div>
  );
}

const UserDetails = React.memo(({ user, onUpdate }) => {
  console.log("UserDetails rendered");

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <button onClick={() => onUpdate({ ...user, lastSeen: new Date() })}>
        Update Last Seen
      </button>
    </div>
  );
});

const RefreshButton = React.memo(({ onRefresh }) => {
  console.log("RefreshButton rendered");

  return <button onClick={onRefresh}>Refresh User</button>;
});
```

## Custom Hook with useCallback

```javascript
import { useState, useCallback } from "react";

function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return { value, toggle, setTrue, setFalse };
}

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error("Error writing to localStorage:", error);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error("Error removing from localStorage:", error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

function Settings() {
  const darkMode = useToggle(false);
  const [username, setUsername, removeUsername] = useLocalStorage(
    "username",
    ""
  );

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={darkMode.value}
          onChange={darkMode.toggle}
        />
        Dark Mode
      </label>

      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />

      <button onClick={removeUsername}>Clear Username</button>
    </div>
  );
}
```

## Debounced Callbacks

```javascript
import React, { useState, useCallback, useRef } from "react";

function useDebounce(callback, delay) {
  const timeoutRef = useRef(null);

  const debouncedCallback = useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return [debouncedCallback, cancel];
}

function SearchInput({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSearch = useCallback(
    (searchQuery) => {
      console.log("Searching for:", searchQuery);
      onSearch(searchQuery);
    },
    [onSearch]
  );

  const [debouncedSearch] = useDebounce(handleSearch, 500);

  const handleInputChange = useCallback(
    (e) => {
      const value = e.target.value;
      setQuery(value);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  return (
    <input
      type="text"
      value={query}
      onChange={handleInputChange}
      placeholder="Search..."
    />
  );
}
```

## Performance Comparison

```javascript
import React, { useState, useCallback } from "react";

const ExpensiveChild = React.memo(({ onClick, name }) => {
  console.log(`Rendering ${name} child`);

  const renderTime = performance.now();
  while (performance.now() - renderTime < 1) {}

  return <button onClick={onClick}>{name} Button (Expensive Render)</button>;
});

function PerformanceDemo() {
  const [count, setCount] = useState(0);
  const [otherState, setOtherState] = useState(0);

  const callbackWithoutMemo = () => {
    console.log("Without useCallback");
  };

  const callbackWithMemo = useCallback(() => {
    console.log("With useCallback");
  }, []);

  const callbackWithDependency = useCallback(() => {
    console.log("With dependency:", count);
  }, [count]);

  return (
    <div>
      <p>Count: {count}</p>
      <p>Other: {otherState}</p>

      <button onClick={() => setCount((c) => c + 1)}>Increment Count</button>
      <button onClick={() => setOtherState((s) => s + 1)}>
        Increment Other
      </button>

      <ExpensiveChild onClick={callbackWithoutMemo} name="Without Memo" />
      <ExpensiveChild onClick={callbackWithMemo} name="With Memo" />
      <ExpensiveChild onClick={callbackWithDependency} name="With Dependency" />
    </div>
  );
}
```

## TypeScript Usage

```typescript
import React, { useCallback } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserListProps {
  users: User[];
  onUserSelect: (user: User) => void;
  onUserDelete: (id: number) => void;
}

function UserList({ users, onUserSelect, onUserDelete }: UserListProps) {
  const handleUserClick = useCallback(
    (user: User) => {
      onUserSelect(user);
    },
    [onUserSelect]
  );

  const handleDeleteClick = useCallback(
    (e: React.MouseEvent, id: number) => {
      e.stopPropagation();
      onUserDelete(id);
    },
    [onUserDelete]
  );

  return (
    <div>
      {users.map((user) => (
        <div key={user.id} onClick={() => handleUserClick(user)}>
          <span>{user.name}</span>
          <button onClick={(e) => handleDeleteClick(e, user.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

function useApi<T>() {
  const get = useCallback(async (url: string): Promise<T> => {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Request failed");
    return response.json();
  }, []);

  const post = useCallback(
    async (url: string, data: Partial<T>): Promise<T> => {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Request failed");
      return response.json();
    },
    []
  );

  return { get, post };
}
```

## useCallback vs useMemo

| Feature     | useCallback                  | useMemo                        |
| ----------- | ---------------------------- | ------------------------------ |
| Returns     | Memoized function            | Memoized value                 |
| Use case    | Event handlers, callbacks    | Expensive computations         |
| Example     | `useCallback(() => {}, [])`  | `useMemo(() => compute(), [])` |
| Performance | Prevents function recreation | Prevents computation           |

## Interview Questions

### Q1: What is the purpose of useCallback?

**Answer:** useCallback memoizes a function to prevent it from being recreated on every render. This is crucial for performance when passing callbacks to memoized child components, as it prevents unnecessary re-renders.

### Q2: When should you use useCallback?

**Answer:** Use useCallback when:

- Passing callbacks to memoized child components
- Functions are used as dependencies in other hooks
- Creating expensive functions that don't need to change
- Optimizing performance in large component trees

### Q3: What happens if you forget dependencies in useCallback?

**Answer:** Forgetting dependencies can lead to stale closures where the callback references old values. Always include all variables from component scope that are used inside the callback.

### Q4: Is useCallback always beneficial?

**Answer:** No, useCallback has overhead. Only use it when:

- The function is passed to memoized components
- The function is a dependency of other hooks
- Profiling shows performance benefits
- The cost of recreation is higher than memoization overhead

## Best Practices

1. **Use with React.memo** - Most effective when combined with memoized components
2. **Include all dependencies** - Always include variables used inside the callback
3. **Don't overuse** - Only use when there's a proven performance benefit
4. **Stable references** - Ensure dependencies don't change unnecessarily
5. **Profile performance** - Measure before and after optimization
6. **Consider useRef** - For callbacks that don't need to change
7. **Combine with useMemo** - Use both for comprehensive optimization

## Common Mistakes

1. **Missing dependencies** - Leads to stale closures and bugs
2. **Overusing useCallback** - Not every function needs memoization
3. **Unstable dependencies** - Objects or functions that change every render
4. **Not using with React.memo** - useCallback alone doesn't prevent re-renders
5. **Including functions in dependencies** - Can create infinite loops
6. **Optimizing too early** - Profile first, optimize later

## Performance Considerations

- useCallback has memory overhead for storing memoized functions
- Dependency comparison happens on every render
- Most beneficial with deeply nested component trees
- Combine with React.memo for maximum effect
- Consider if the callback really needs to be stable
- Use React DevTools Profiler to measure impact
