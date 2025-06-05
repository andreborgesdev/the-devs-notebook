# React useReducer Hook

## Overview

The `useReducer` hook is an alternative to `useState` for managing complex state logic. It's particularly useful when state updates involve multiple values or when the next state depends on the previous one.

## Basic Syntax

```javascript
const [state, dispatch] = useReducer(reducer, initialState);
```

## Simple Counter Example

```javascript
import React, { useReducer } from "react";

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    case "reset":
      return initialState;
    default:
      throw new Error("Unknown action type");
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
    </div>
  );
}
```

## Advanced Shopping Cart Example

```javascript
import React, { useReducer } from "react";

const initialState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
};

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM":
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          total: state.total + action.payload.price,
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
        total: state.total + action.payload.price,
      };

    case "REMOVE_ITEM":
      const itemToRemove = state.items.find(
        (item) => item.id === action.payload
      );
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
        total: state.total - itemToRemove.price * itemToRemove.quantity,
      };

    case "UPDATE_QUANTITY":
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      const priceDiff = (quantity - item.quantity) * item.price;

      return {
        ...state,
        items: state.items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        ),
        total: state.total + priceDiff,
      };

    case "CLEAR_CART":
      return { ...initialState };

    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };

    default:
      return state;
  }
}

function ShoppingCart() {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (product) => {
    dispatch({ type: "ADD_ITEM", payload: product });
  };

  const removeItem = (id) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeItem(id);
    } else {
      dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
    }
  };

  return (
    <div>
      <h2>Shopping Cart</h2>
      <p>Total: ${state.total.toFixed(2)}</p>
      {state.items.map((item) => (
        <div key={item.id}>
          <span>
            {item.name} - ${item.price}
          </span>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
          />
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </div>
      ))}
      <button onClick={() => dispatch({ type: "CLEAR_CART" })}>
        Clear Cart
      </button>
    </div>
  );
}
```

## Lazy Initialization

```javascript
function init(initialCount) {
  return { count: initialCount };
}

function Counter({ initialCount }) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);

  return (
    // Component JSX
  );
}
```

## useReducer vs useState

| Feature         | useState                        | useReducer                           |
| --------------- | ------------------------------- | ------------------------------------ |
| Complexity      | Simple state updates            | Complex state logic                  |
| State Structure | Single values or simple objects | Complex objects with multiple fields |
| Update Logic    | Direct state updates            | Centralized reducer function         |
| Testing         | Harder to test logic            | Easy to test reducer pure function   |
| Performance     | Good for simple cases           | Better for complex state transitions |
| Debugging       | Limited debugging info          | Action-based debugging               |

## Common Patterns

### Form State Management

```javascript
const formReducer = (state, action) => {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        [action.field]: action.value,
        errors: {
          ...state.errors,
          [action.field]: null,
        },
      };
    case "SET_ERROR":
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.field]: action.error,
        },
      };
    case "RESET_FORM":
      return action.initialState;
    default:
      return state;
  }
};

function ContactForm() {
  const initialState = {
    name: "",
    email: "",
    message: "",
    errors: {},
  };

  const [state, dispatch] = useReducer(formReducer, initialState);

  const handleChange = (field, value) => {
    dispatch({ type: "SET_FIELD", field, value });
  };

  const validate = () => {
    const errors = {};
    if (!state.name) errors.name = "Name is required";
    if (!state.email) errors.email = "Email is required";

    Object.keys(errors).forEach((field) => {
      dispatch({ type: "SET_ERROR", field, error: errors[field] });
    });

    return Object.keys(errors).length === 0;
  };

  return (
    <form>
      <input
        value={state.name}
        onChange={(e) => handleChange("name", e.target.value)}
        placeholder="Name"
      />
      {state.errors.name && <span>{state.errors.name}</span>}

      <input
        value={state.email}
        onChange={(e) => handleChange("email", e.target.value)}
        placeholder="Email"
      />
      {state.errors.email && <span>{state.errors.email}</span>}

      <textarea
        value={state.message}
        onChange={(e) => handleChange("message", e.target.value)}
        placeholder="Message"
      />

      <button type="button" onClick={validate}>
        Submit
      </button>
    </form>
  );
}
```

### Async Actions with useReducer

```javascript
const asyncReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, data: action.payload };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function useAsyncData(url) {
  const [state, dispatch] = useReducer(asyncReducer, {
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_START" });
      try {
        const response = await fetch(url);
        const data = await response.json();
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_ERROR", payload: error.message });
      }
    };

    fetchData();
  }, [url]);

  return state;
}
```

## TypeScript Usage

```typescript
interface State {
  count: number;
  error: string | null;
}

type Action =
  | { type: "increment" }
  | { type: "decrement" }
  | { type: "reset" }
  | { type: "set_error"; payload: string };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "increment":
      return { ...state, count: state.count + 1 };
    case "decrement":
      return { ...state, count: state.count - 1 };
    case "reset":
      return { count: 0, error: null };
    case "set_error":
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

function TypedCounter() {
  const [state, dispatch] = useReducer(reducer, { count: 0, error: null });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
    </div>
  );
}
```

## Interview Questions

### Q1: When would you use useReducer instead of useState?

**Answer:** Use useReducer when:

- State logic is complex with multiple sub-values
- Next state depends on the previous one
- You want to optimize performance for components that trigger deep updates
- State updates involve multiple actions
- You need predictable state transitions
- Testing complex state logic in isolation

### Q2: How do you handle async operations with useReducer?

**Answer:** useReducer itself doesn't handle async operations directly. You can:

1. Use useEffect for side effects
2. Dispatch actions before and after async operations
3. Create custom hooks that combine useReducer with async logic
4. Use middleware patterns for complex async flows

### Q3: What are the advantages of useReducer over useState?

**Answer:**

- Centralized state update logic
- More predictable state transitions
- Better for complex state objects
- Easier to test (pure reducer functions)
- Better debugging with action-based updates
- Performance benefits for complex state updates

### Q4: Can you explain the reducer pattern?

**Answer:** The reducer pattern is a predictable way to update state:

- Takes current state and action as arguments
- Returns new state based on action type
- Must be pure functions (no side effects)
- Follows the pattern: `(state, action) => newState`

## Best Practices

1. **Keep reducers pure** - No side effects, API calls, or mutations
2. **Use descriptive action types** - Make them self-documenting
3. **Normalize complex state** - Flatten nested structures when possible
4. **Handle default cases** - Always include a default case in switch statements
5. **Use TypeScript** - Type your state and actions for better development experience
6. **Separate concerns** - Keep reducer logic separate from component logic
7. **Test reducers** - Write unit tests for reducer functions
8. **Use action creators** - Create functions to generate actions consistently

## Common Mistakes

1. **Mutating state directly** - Always return new state objects
2. **Forgetting default case** - Can cause errors with unknown actions
3. **Complex logic in components** - Move complex logic to reducers
4. **Not handling loading states** - Include loading/error states in complex scenarios
5. **Overusing useReducer** - Don't use it for simple state that useState can handle
6. **Side effects in reducers** - Keep reducers pure and handle side effects elsewhere

## Performance Considerations

- useReducer can be more performant than useState for complex state updates
- Reducers should be memoized if they're expensive to recreate
- Consider using useCallback for dispatch functions passed to children
- Split large reducers into smaller, focused ones when possible
