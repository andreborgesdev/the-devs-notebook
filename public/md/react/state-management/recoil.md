# Recoil State Management

Recoil is an experimental state management library by Facebook that provides a way to manage shared state in React applications through atoms and selectors.

## Core Concepts

### Atoms

Atoms are units of state that components can subscribe to and update.

```typescript
import { atom } from "recoil";

export const counterState = atom<number>({
  key: "counterState",
  default: 0,
});

export const userState = atom<User | null>({
  key: "userState",
  default: null,
});

export const todosState = atom<Todo[]>({
  key: "todosState",
  default: [],
});
```

### Selectors

Selectors are pure functions that derive state based on atoms or other selectors.

```typescript
import { selector } from "recoil";

export const todoStatsState = selector({
  key: "todoStatsState",
  get: ({ get }) => {
    const todos = get(todosState);

    return {
      total: todos.length,
      completed: todos.filter((todo) => todo.completed).length,
      active: todos.filter((todo) => !todo.completed).length,
      percentComplete:
        todos.length === 0
          ? 0
          : (todos.filter((todo) => todo.completed).length / todos.length) *
            100,
    };
  },
});

export const filteredTodosState = selector({
  key: "filteredTodosState",
  get: ({ get }) => {
    const filter = get(todoFilterState);
    const todos = get(todosState);

    switch (filter) {
      case "Show Completed":
        return todos.filter((todo) => todo.completed);
      case "Show Active":
        return todos.filter((todo) => !todo.completed);
      default:
        return todos;
    }
  },
});
```

## Setup and Basic Usage

### RecoilRoot Provider

```typescript
import React from "react";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <RecoilRoot>
    <App />
  </RecoilRoot>
);
```

### Using Atoms in Components

```typescript
import React from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { counterState } from "../atoms";

const Counter: React.FC = () => {
  const [count, setCount] = useRecoilState(counterState);

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
};

const CountDisplay: React.FC = () => {
  const count = useRecoilValue(counterState);

  return <div>Current Count: {count}</div>;
};

const CountControls: React.FC = () => {
  const setCount = useSetRecoilState(counterState);

  return (
    <div>
      <button onClick={() => setCount((prev) => prev + 1)}>+</button>
      <button onClick={() => setCount((prev) => prev - 1)}>-</button>
    </div>
  );
};
```

### Using Selectors

```typescript
import React from "react";
import { useRecoilValue } from "recoil";
import { todoStatsState, filteredTodosState } from "../selectors";

const TodoStats: React.FC = () => {
  const stats = useRecoilValue(todoStatsState);

  return (
    <div>
      <p>Total: {stats.total}</p>
      <p>Completed: {stats.completed}</p>
      <p>Active: {stats.active}</p>
      <p>Completion: {Math.round(stats.percentComplete)}%</p>
    </div>
  );
};

const FilteredTodoList: React.FC = () => {
  const filteredTodos = useRecoilValue(filteredTodosState);

  return (
    <ul>
      {filteredTodos.map((todo) => (
        <li key={todo.id}>
          {todo.text} - {todo.completed ? "Done" : "Pending"}
        </li>
      ))}
    </ul>
  );
};
```

## Advanced Patterns

### Atom Families

Create parameterized atoms for collections of similar state.

```typescript
import { atomFamily } from "recoil";

export const todoItemState = atomFamily<Todo, string>({
  key: "todoItemState",
  default: (id) => ({
    id,
    text: "",
    completed: false,
    category: "personal",
  }),
});

export const todoItemsState = atom<string[]>({
  key: "todoItemsState",
  default: [],
});
```

### Selector Families

Create parameterized selectors for dynamic computations.

```typescript
import { selectorFamily } from "recoil";

export const todoByIdState = selectorFamily({
  key: "todoByIdState",
  get:
    (id: string) =>
    ({ get }) => {
      return get(todoItemState(id));
    },
  set:
    (id: string) =>
    ({ set }, newValue) => {
      set(todoItemState(id), newValue);
    },
});

export const todosByCategoryState = selectorFamily({
  key: "todosByCategoryState",
  get:
    (category: string) =>
    ({ get }) => {
      const todoIds = get(todoItemsState);
      return todoIds
        .map((id) => get(todoItemState(id)))
        .filter((todo) => todo.category === category);
    },
});
```

### Using Families in Components

```typescript
import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { todoItemState, todosByCategoryState } from "../atoms";

interface TodoItemProps {
  id: string;
}

const TodoItem: React.FC<TodoItemProps> = ({ id }) => {
  const [todo, setTodo] = useRecoilState(todoItemState(id));

  return (
    <div>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={(e) =>
          setTodo((prev) => ({ ...prev, completed: e.target.checked }))
        }
      />
      <input
        type="text"
        value={todo.text}
        onChange={(e) => setTodo((prev) => ({ ...prev, text: e.target.value }))}
      />
    </div>
  );
};

const CategoryTodos: React.FC<{ category: string }> = ({ category }) => {
  const todos = useRecoilValue(todosByCategoryState(category));

  return (
    <div>
      <h3>{category}</h3>
      {todos.map((todo) => (
        <TodoItem key={todo.id} id={todo.id} />
      ))}
    </div>
  );
};
```

## Async Selectors and Data Fetching

### Async Selectors

```typescript
import { selector } from "recoil";

export const userProfileState = selector({
  key: "userProfileState",
  get: async ({ get }) => {
    const userId = get(currentUserIdState);
    if (!userId) return null;

    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }
    return response.json();
  },
});

export const userPostsState = selector({
  key: "userPostsState",
  get: async ({ get }) => {
    const user = get(userProfileState);
    if (!user) return [];

    const response = await fetch(`/api/users/${user.id}/posts`);
    if (!response.ok) {
      throw new Error("Failed to fetch user posts");
    }
    return response.json();
  },
});
```

### Using Async Selectors with Suspense

```typescript
import React, { Suspense } from "react";
import { useRecoilValue } from "recoil";
import { userProfileState, userPostsState } from "../selectors";

const UserProfile: React.FC = () => {
  const userProfile = useRecoilValue(userProfileState);

  if (!userProfile) return <div>No user selected</div>;

  return (
    <div>
      <h2>{userProfile.name}</h2>
      <p>{userProfile.email}</p>
      <Suspense fallback={<div>Loading posts...</div>}>
        <UserPosts />
      </Suspense>
    </div>
  );
};

const UserPosts: React.FC = () => {
  const posts = useRecoilValue(userPostsState);

  return (
    <div>
      <h3>Posts</h3>
      {posts.map((post) => (
        <div key={post.id}>
          <h4>{post.title}</h4>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserProfile />
    </Suspense>
  );
};
```

### Error Boundaries with Async State

```typescript
import React from "react";
import { ErrorBoundary } from "react-error-boundary";

const ErrorFallback: React.FC<{
  error: Error;
  resetErrorBoundary: () => void;
}> = ({ error, resetErrorBoundary }) => (
  <div>
    <h2>Something went wrong:</h2>
    <pre>{error.message}</pre>
    <button onClick={resetErrorBoundary}>Try again</button>
  </div>
);

const AsyncDataComponent: React.FC = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<div>Loading...</div>}>
        <UserProfile />
      </Suspense>
    </ErrorBoundary>
  );
};
```

## Loadable Pattern

### Using Loadable for Manual Error Handling

```typescript
import React from "react";
import { useRecoilValueLoadable } from "recoil";
import { userProfileState } from "../selectors";

const UserProfileWithLoadable: React.FC = () => {
  const userProfileLoadable = useRecoilValueLoadable(userProfileState);

  switch (userProfileLoadable.state) {
    case "hasValue":
      const userProfile = userProfileLoadable.contents;
      return userProfile ? (
        <div>
          <h2>{userProfile.name}</h2>
          <p>{userProfile.email}</p>
        </div>
      ) : (
        <div>No user selected</div>
      );
    case "loading":
      return <div>Loading user profile...</div>;
    case "hasError":
      return (
        <div>
          <p>Error loading user profile:</p>
          <p>{userProfileLoadable.contents.message}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      );
  }
};
```

### Refreshable Selectors

```typescript
import { selector, selectorFamily } from "recoil";

export const refreshCounterState = atom({
  key: "refreshCounterState",
  default: 0,
});

export const refreshableUserProfileState = selector({
  key: "refreshableUserProfileState",
  get: async ({ get }) => {
    get(refreshCounterState);
    const userId = get(currentUserIdState);

    if (!userId) return null;

    const response = await fetch(`/api/users/${userId}?t=${Date.now()}`);
    return response.json();
  },
});

const RefreshableUserProfile: React.FC = () => {
  const userProfile = useRecoilValue(refreshableUserProfileState);
  const setRefreshCounter = useSetRecoilState(refreshCounterState);

  const handleRefresh = () => {
    setRefreshCounter((prev) => prev + 1);
  };

  return (
    <div>
      {userProfile && (
        <div>
          <h2>{userProfile.name}</h2>
          <p>{userProfile.email}</p>
        </div>
      )}
      <button onClick={handleRefresh}>Refresh</button>
    </div>
  );
};
```

## Persistence and Synchronization

### Local Storage Persistence

```typescript
import { atom, DefaultValue } from "recoil";

const localStorageEffect =
  (key: string) =>
  ({ setSelf, onSet }: any) => {
    const savedValue = localStorage.getItem(key);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }

    onSet((newValue: any, _: any, isReset: boolean) => {
      if (isReset) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(newValue));
      }
    });
  };

export const persistedCounterState = atom({
  key: "persistedCounterState",
  default: 0,
  effects: [localStorageEffect("counter")],
});

export const userPreferencesState = atom({
  key: "userPreferencesState",
  default: {
    theme: "light",
    language: "en",
    notifications: true,
  },
  effects: [localStorageEffect("userPreferences")],
});
```

### URL Synchronization

```typescript
import { atom } from "recoil";
import { useSearchParams } from "react-router-dom";

const urlSyncEffect =
  (param: string) =>
  ({ setSelf, onSet }: any) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const savedValue = searchParams.get(param);
    if (savedValue != null) {
      setSelf(savedValue);
    }

    onSet((newValue: any) => {
      const newSearchParams = new URLSearchParams(searchParams);
      if (newValue instanceof DefaultValue) {
        newSearchParams.delete(param);
      } else {
        newSearchParams.set(param, newValue);
      }
      setSearchParams(newSearchParams);
    });
  };

export const searchQueryState = atom({
  key: "searchQueryState",
  default: "",
  effects: [urlSyncEffect("q")],
});
```

## Testing Recoil

### Testing Atoms and Selectors

```typescript
import { renderHook } from "@testing-library/react";
import { RecoilRoot, useRecoilValue, useSetRecoilState } from "recoil";
import { counterState, todoStatsState } from "../atoms";

const RecoilWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <RecoilRoot>{children}</RecoilRoot>;

describe("counterState", () => {
  it("should have default value of 0", () => {
    const { result } = renderHook(() => useRecoilValue(counterState), {
      wrapper: RecoilWrapper,
    });

    expect(result.current).toBe(0);
  });

  it("should update value when set", () => {
    const { result } = renderHook(
      () => ({
        count: useRecoilValue(counterState),
        setCount: useSetRecoilState(counterState),
      }),
      { wrapper: RecoilWrapper }
    );

    act(() => {
      result.current.setCount(5);
    });

    expect(result.current.count).toBe(5);
  });
});
```

### Testing Components with Recoil

```typescript
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import Counter from "./Counter";

const renderWithRecoil = (component: React.ReactElement) => {
  return render(<RecoilRoot>{component}</RecoilRoot>);
};

describe("Counter", () => {
  it("should display initial count", () => {
    renderWithRecoil(<Counter />);
    expect(screen.getByText("Count: 0")).toBeInTheDocument();
  });

  it("should increment count when plus button is clicked", () => {
    renderWithRecoil(<Counter />);
    fireEvent.click(screen.getByText("+"));
    expect(screen.getByText("Count: 1")).toBeInTheDocument();
  });
});
```

### Testing with Initial State

```typescript
import { MutableSnapshot } from "recoil";

const renderWithRecoilState = (
  component: React.ReactElement,
  initializeState?: (snapshot: MutableSnapshot) => void
) => {
  return render(
    <RecoilRoot initializeState={initializeState}>{component}</RecoilRoot>
  );
};

describe("Counter with initial state", () => {
  it("should display initial count of 10", () => {
    renderWithRecoilState(<Counter />, (snapshot) => {
      snapshot.set(counterState, 10);
    });

    expect(screen.getByText("Count: 10")).toBeInTheDocument();
  });
});
```

## Performance Optimization

### Subscription Optimization

```typescript
import React, { memo } from "react";
import { useRecoilValue } from "recoil";

const ExpensiveComponent: React.FC<{ id: string }> = memo(({ id }) => {
  const item = useRecoilValue(todoItemState(id));

  return (
    <div>
      <p>{item.text}</p>
      <p>Status: {item.completed ? "Done" : "Pending"}</p>
    </div>
  );
});

const TodoList: React.FC = () => {
  const todoIds = useRecoilValue(todoItemsState);

  return (
    <div>
      {todoIds.map((id) => (
        <ExpensiveComponent key={id} id={id} />
      ))}
    </div>
  );
};
```

### Concurrent Mode Compatibility

```typescript
import React, { useDeferredValue, useTransition } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

const SearchResults: React.FC = () => {
  const query = useRecoilValue(searchQueryState);
  const deferredQuery = useDeferredValue(query);
  const results = useRecoilValue(searchResultsState(deferredQuery));

  return (
    <div>
      {results.map((result) => (
        <div key={result.id}>{result.title}</div>
      ))}
    </div>
  );
};

const SearchInput: React.FC = () => {
  const setQuery = useSetRecoilState(searchQueryState);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      setQuery(e.target.value);
    });
  };

  return (
    <div>
      <input onChange={handleChange} placeholder="Search..." />
      {isPending && <span>Searching...</span>}
    </div>
  );
};
```

## Best Practices

### State Organization

- Use atoms for independent state pieces
- Use selectors for derived state
- Keep atoms as small as possible
- Use atom families for collections

### Performance

- Use memo for expensive components
- Implement proper subscription patterns
- Use concurrent features for better UX
- Avoid unnecessary re-renders

### Error Handling

- Use ErrorBoundary with async selectors
- Implement proper loading states
- Use loadable pattern for manual control
- Provide meaningful error messages

### Testing

- Test atoms and selectors separately
- Use RecoilRoot wrapper for testing
- Initialize state for specific test scenarios
- Mock external dependencies

## Migration Strategies

### From useState to Recoil

```typescript
// Before: Local state
const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<string>("all");

  const addTodo = (text: string) => {
    setTodos((prev) => [
      ...prev,
      { id: Date.now().toString(), text, completed: false },
    ]);
  };

  return (
    <div>
      <TodoList todos={todos} />
      <TodoFilter filter={filter} setFilter={setFilter} />
    </div>
  );
};

// After: Recoil atoms
const TodoApp: React.FC = () => {
  return (
    <div>
      <TodoList />
      <TodoFilter />
    </div>
  );
};

const TodoList: React.FC = () => {
  const todos = useRecoilValue(filteredTodosState);
  return (
    <div>
      {todos.map((todo) => (
        <TodoItem key={todo.id} id={todo.id} />
      ))}
    </div>
  );
};
```

### From Context to Recoil

```typescript
// Before: Context API
const TodoContext = createContext<{
  todos: Todo[];
  addTodo: (text: string) => void;
}>({
  todos: [],
  addTodo: () => {},
});

const TodoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = (text: string) => {
    setTodos((prev) => [
      ...prev,
      { id: Date.now().toString(), text, completed: false },
    ]);
  };

  return (
    <TodoContext.Provider value={{ todos, addTodo }}>
      {children}
    </TodoContext.Provider>
  );
};

// After: Recoil atoms
export const todosState = atom<Todo[]>({
  key: "todosState",
  default: [],
});

export const addTodoState = selector({
  key: "addTodoState",
  get: ({ get }) => get(todosState),
  set: ({ set }, text: string) => {
    set(todosState, (prev) => [
      ...prev,
      { id: Date.now().toString(), text, completed: false },
    ]);
  },
});
```

## Interview Questions

**Q: What is Recoil and how does it differ from other state management solutions?**
A: Recoil is an experimental state management library by Facebook that provides:

- Minimal boilerplate with atoms and selectors
- Built-in support for async operations
- Automatic dependency tracking
- Easy composition of state
- Better React integration than Redux
- Still experimental (not production-ready)

**Q: What are atoms and selectors in Recoil?**
A:

- **Atoms**: Units of state that components can subscribe to and update
- **Selectors**: Pure functions that derive state based on atoms or other selectors
- Atoms hold state, selectors compute derived state
- Both can be used with React hooks

**Q: How do you handle async operations in Recoil?**
A: Using async selectors:

- Return promises from selector get functions
- Use Suspense for loading states
- Use ErrorBoundary for error handling
- Use loadable pattern for manual control

**Q: What are atom families and when would you use them?**
A: Atom families create parameterized atoms:

- Useful for collections of similar state (e.g., todo items)
- Each parameter creates a separate atom instance
- Helpful for managing dynamic lists of data
- Enable fine-grained subscriptions

**Q: How do you test Recoil state?**
A: Testing strategies:

- Wrap components with RecoilRoot
- Use renderHook for testing atoms/selectors
- Initialize state for specific test scenarios
- Test async selectors with proper async handling
- Mock external dependencies in selectors
