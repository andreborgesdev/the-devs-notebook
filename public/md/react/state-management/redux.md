# Redux with React

Redux is a predictable state container for JavaScript applications, providing a centralized store for managing application state with unidirectional data flow.

## Core Concepts

### Store

The single source of truth for your application state.

```typescript
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Actions

Plain objects describing what happened in your application.

```typescript
interface IncrementAction {
  type: "counter/increment";
  payload?: number;
}

interface DecrementAction {
  type: "counter/decrement";
  payload?: number;
}

type CounterAction = IncrementAction | DecrementAction;
```

### Reducers

Pure functions that specify how the application's state changes in response to actions.

```typescript
interface CounterState {
  value: number;
  loading: boolean;
  error: string | null;
}

const initialState: CounterState = {
  value: 0,
  loading: false,
  error: null,
};

function counterReducer(
  state = initialState,
  action: CounterAction
): CounterState {
  switch (action.type) {
    case "counter/increment":
      return {
        ...state,
        value: state.value + (action.payload || 1),
      };
    case "counter/decrement":
      return {
        ...state,
        value: state.value - (action.payload || 1),
      };
    default:
      return state;
  }
}
```

## Redux Toolkit (RTK)

Modern Redux development uses Redux Toolkit for better developer experience.

### createSlice

Combines action creators and reducers in one place.

```typescript
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CounterState {
  value: number;
  loading: boolean;
}

const initialState: CounterState = {
  value: 0,
  loading: false,
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
    reset: (state) => {
      state.value = 0;
    },
  },
});

export const { increment, decrement, incrementByAmount, reset } =
  counterSlice.actions;
export default counterSlice.reducer;
```

### createAsyncThunk

Handle asynchronous operations with loading states.

```typescript
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    loading: false,
    error: null,
  } as UserState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
```

## React-Redux Integration

### Provider Setup

Wrap your app with the Redux Provider.

```typescript
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

### Typed Hooks

Create typed versions of useSelector and useDispatch.

```typescript
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### Component Usage

Connect components to Redux state.

```typescript
import React from "react";
import { useAppSelector, useAppDispatch } from "./hooks";
import {
  increment,
  decrement,
  incrementByAmount,
  fetchUsers,
} from "./counterSlice";

const Counter: React.FC = () => {
  const count = useAppSelector((state) => state.counter.value);
  const loading = useAppSelector((state) => state.counter.loading);
  const dispatch = useAppDispatch();

  const handleIncrement = () => {
    dispatch(increment());
  };

  const handleIncrementByFive = () => {
    dispatch(incrementByAmount(5));
  };

  const handleFetchUsers = () => {
    dispatch(fetchUsers());
  };

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={handleIncrement}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
      <button onClick={handleIncrementByFive}>+5</button>
      <button onClick={handleFetchUsers} disabled={loading}>
        {loading ? "Loading..." : "Fetch Users"}
      </button>
    </div>
  );
};
```

## Advanced Patterns

### Normalized State

Structure state for efficient updates and queries.

```typescript
import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const todosAdapter = createEntityAdapter<Todo>();

const todosSlice = createSlice({
  name: "todos",
  initialState: todosAdapter.getInitialState(),
  reducers: {
    addTodo: todosAdapter.addOne,
    updateTodo: todosAdapter.updateOne,
    removeTodo: todosAdapter.removeOne,
    toggleTodo: (state, action) => {
      const todo = state.entities[action.payload];
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
  },
});

export const todosSelectors = todosAdapter.getSelectors<RootState>(
  (state) => state.todos
);
```

### Middleware

Custom middleware for side effects.

```typescript
import { Middleware } from "@reduxjs/toolkit";

const loggingMiddleware: Middleware = (store) => (next) => (action) => {
  console.log("Dispatching:", action);
  const result = next(action);
  console.log("Next state:", store.getState());
  return result;
};

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loggingMiddleware),
});
```

### RTK Query

Data fetching and caching solution.

```typescript
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface User {
  id: string;
  name: string;
  email: string;
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/",
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => "users",
      providesTags: ["User"],
    }),
    getUserById: builder.query<User, string>({
      query: (id) => `users/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
    createUser: builder.mutation<User, Partial<User>>({
      query: (user) => ({
        url: "users",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation<User, { id: string; user: Partial<User> }>({
      query: ({ id, user }) => ({
        url: `users/${id}`,
        method: "PUT",
        body: user,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
} = api;
```

### Component with RTK Query

```typescript
import React from "react";
import { useGetUsersQuery, useCreateUserMutation } from "./api";

const UserList: React.FC = () => {
  const { data: users, error, isLoading, refetch } = useGetUsersQuery();

  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();

  const handleCreateUser = async () => {
    try {
      await createUser({
        name: "New User",
        email: "user@example.com",
      }).unwrap();
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.toString()}</div>;

  return (
    <div>
      <button onClick={handleCreateUser} disabled={isCreating}>
        {isCreating ? "Creating..." : "Add User"}
      </button>
      <button onClick={refetch}>Refresh</button>
      <ul>
        {users?.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};
```

## Testing Redux

### Reducer Testing

```typescript
import { counterReducer, increment, decrement } from "./counterSlice";

describe("counterSlice", () => {
  const initialState = {
    value: 0,
    loading: false,
  };

  it("should handle increment", () => {
    const actual = counterReducer(initialState, increment());
    expect(actual.value).toEqual(1);
  });

  it("should handle decrement", () => {
    const actual = counterReducer(initialState, decrement());
    expect(actual.value).toEqual(-1);
  });
});
```

### Component Testing with Redux

```typescript
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice";
import Counter from "./Counter";

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      counter: counterReducer,
    },
    preloadedState: initialState,
  });
};

const renderWithRedux = (component: React.ReactElement, initialState = {}) => {
  const store = createMockStore(initialState);
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  };
};

describe("Counter", () => {
  it("should display initial count", () => {
    renderWithRedux(<Counter />, {
      counter: { value: 5, loading: false },
    });

    expect(screen.getByText("Count: 5")).toBeInTheDocument();
  });

  it("should increment count when button is clicked", () => {
    const { store } = renderWithRedux(<Counter />);

    fireEvent.click(screen.getByText("+"));

    expect(store.getState().counter.value).toBe(1);
  });
});
```

## Performance Optimization

### Memoized Selectors

```typescript
import { createSelector } from "@reduxjs/toolkit";

const selectTodos = (state: RootState) => state.todos;
const selectFilter = (state: RootState) => state.filter;

export const selectFilteredTodos = createSelector(
  [selectTodos, selectFilter],
  (todos, filter) => {
    switch (filter) {
      case "completed":
        return todos.filter((todo) => todo.completed);
      case "active":
        return todos.filter((todo) => !todo.completed);
      default:
        return todos;
    }
  }
);

export const selectTodoStats = createSelector([selectTodos], (todos) => ({
  total: todos.length,
  completed: todos.filter((todo) => todo.completed).length,
  active: todos.filter((todo) => !todo.completed).length,
}));
```

### Component Optimization

```typescript
import React, { memo } from "react";
import { useAppSelector } from "./hooks";
import { selectFilteredTodos } from "./selectors";

const TodoList: React.FC = memo(() => {
  const todos = useAppSelector(selectFilteredTodos);

  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
});

const TodoItem: React.FC<{ todo: Todo }> = memo(({ todo }) => {
  const dispatch = useAppDispatch();

  return (
    <li>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => dispatch(toggleTodo(todo.id))}
      />
      {todo.text}
    </li>
  );
});
```

## Best Practices

### State Structure

- Keep state normalized
- Separate domain data from UI state
- Use consistent naming conventions
- Avoid deeply nested state

### Actions

- Use descriptive action names
- Include minimal data in payloads
- Use action creators from RTK
- Handle errors consistently

### Selectors

- Use memoized selectors for derived data
- Keep selectors simple and focused
- Colocate selectors with reducers
- Use reselect for complex computations

### Components

- Connect components at the right level
- Use container/presentation pattern
- Memoize expensive components
- Batch related updates

## Migration Strategies

### From Class Components

```typescript
// Before: Class component with connect
class CounterContainer extends Component {
  render() {
    const { count, increment, decrement } = this.props;
    return (
      <Counter count={count} onIncrement={increment} onDecrement={decrement} />
    );
  }
}

const mapStateToProps = (state) => ({
  count: state.counter.value,
});

const mapDispatchToProps = {
  increment,
  decrement,
};

export default connect(mapStateToProps, mapDispatchToProps)(CounterContainer);

// After: Function component with hooks
const CounterContainer: React.FC = () => {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <Counter
      count={count}
      onIncrement={() => dispatch(increment())}
      onDecrement={() => dispatch(decrement())}
    />
  );
};
```

### From Legacy Redux to RTK

```typescript
// Before: Traditional Redux
const INCREMENT = "INCREMENT";
const DECREMENT = "DECREMENT";

const increment = () => ({ type: INCREMENT });
const decrement = () => ({ type: DECREMENT });

const counterReducer = (state = { value: 0 }, action) => {
  switch (action.type) {
    case INCREMENT:
      return { ...state, value: state.value + 1 };
    case DECREMENT:
      return { ...state, value: state.value - 1 };
    default:
      return state;
  }
};

// After: RTK
const counterSlice = createSlice({
  name: "counter",
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
  },
});

export const { increment, decrement } = counterSlice.actions;
export default counterSlice.reducer;
```

## Common Patterns

### Loading States Pattern

```typescript
interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

const createAsyncSlice = <T>(name: string) => {
  return createSlice({
    name,
    initialState: {
      data: null,
      loading: false,
      error: null,
    } as AsyncState<T>,
    reducers: {
      setLoading: (state, action: PayloadAction<boolean>) => {
        state.loading = action.payload;
      },
      setData: (state, action: PayloadAction<T>) => {
        state.data = action.payload;
        state.loading = false;
        state.error = null;
      },
      setError: (state, action: PayloadAction<string>) => {
        state.error = action.payload;
        state.loading = false;
      },
    },
  });
};
```

## Interview Questions

**Q: What is Redux and why would you use it?**
A: Redux is a predictable state container for JavaScript applications. Use it for:

- Complex state logic
- Shared state across components
- Time-travel debugging
- Predictable state updates
- Large applications with many developers

**Q: Explain the Redux data flow.**
A:

1. Component dispatches an action
2. Store passes action to reducer
3. Reducer returns new state
4. Store notifies subscribed components
5. Components re-render with new state

**Q: What's the difference between Redux and Context API?**
A:

- Redux: Better for complex state, time-travel debugging, middleware support
- Context: Simpler setup, built into React, good for theme/auth state
- Redux: Immutable updates, predictable patterns
- Context: Can cause unnecessary re-renders

**Q: What is Redux Toolkit and why use it?**
A: Redux Toolkit (RTK) is the official, opinionated toolset for Redux that:

- Simplifies store setup
- Reduces boilerplate
- Includes best practices by default
- Provides utilities like createSlice and createAsyncThunk
- Built-in Immer for immutable updates

**Q: How do you handle side effects in Redux?**
A: Common approaches:

- Redux Thunk for async actions
- createAsyncThunk in RTK
- Redux Saga for complex flows
- RTK Query for data fetching
- Custom middleware for specific needs
