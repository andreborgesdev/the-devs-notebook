# React Components

## Introduction to Components

Components are the building blocks of React applications. They are reusable pieces of code that return JSX to describe what should appear on the screen.

## Types of Components

### Function Components (Recommended)

```javascript
// Basic function component
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// Arrow function component
const Welcome = (props) => {
  return <h1>Hello, {props.name}</h1>;
};

// Implicit return
const Welcome = ({ name }) => <h1>Hello, {name}</h1>;
```

### Class Components (Legacy)

```javascript
import React, { Component } from "react";

class Welcome extends Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

### Comparison: Function vs Class Components

| Feature                    | Function Components | Class Components  |
| -------------------------- | ------------------- | ----------------- |
| **Syntax**                 | Simple, concise     | More verbose      |
| **State**                  | useState hook       | this.state        |
| **Lifecycle**              | useEffect hook      | Lifecycle methods |
| **Performance**            | Generally better    | Good              |
| **Learning curve**         | Easier              | Steeper           |
| **Current recommendation** | ✅ Preferred        | ❌ Legacy         |

## Component Anatomy

### Basic Structure

```javascript
import React from "react";

// 1. Import dependencies
import "./UserCard.css";
import defaultAvatar from "../assets/default-avatar.png";

// 2. Define the component
function UserCard({ user, onEdit, onDelete }) {
  // 3. Component logic (hooks, variables, functions)
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    onEdit(user.id);
  };

  // 4. Return JSX
  return (
    <div className="user-card">
      <img src={user.avatar || defaultAvatar} alt={`${user.name}'s avatar`} />
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <div className="actions">
        <button onClick={handleEdit}>Edit</button>
        <button onClick={() => onDelete(user.id)}>Delete</button>
      </div>
    </div>
  );
}

// 5. Export the component
export default UserCard;
```

## Component Props

### Receiving Props

```javascript
// Object destructuring (recommended)
function UserProfile({ name, email, age, isActive }) {
  return (
    <div className={`profile ${isActive ? "active" : "inactive"}`}>
      <h2>{name}</h2>
      <p>Email: {email}</p>
      <p>Age: {age}</p>
    </div>
  );
}

// Props object
function UserProfile(props) {
  return (
    <div className={`profile ${props.isActive ? "active" : "inactive"}`}>
      <h2>{props.name}</h2>
      <p>Email: {props.email}</p>
      <p>Age: {props.age}</p>
    </div>
  );
}
```

### Default Props

```javascript
// Method 1: Default parameters
function Button({
  children,
  variant = "primary",
  size = "medium",
  disabled = false,
}) {
  return (
    <button className={`btn btn-${variant} btn-${size}`} disabled={disabled}>
      {children}
    </button>
  );
}

// Method 2: defaultProps (legacy)
function Button({ children, variant, size, disabled }) {
  return (
    <button className={`btn btn-${variant} btn-${size}`} disabled={disabled}>
      {children}
    </button>
  );
}

Button.defaultProps = {
  variant: "primary",
  size: "medium",
  disabled: false,
};
```

### Prop Types (Runtime Type Checking)

```javascript
import PropTypes from "prop-types";

function UserCard({ user, onEdit, onDelete }) {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <button onClick={() => onEdit(user.id)}>Edit</button>
      <button onClick={() => onDelete(user.id)}>Delete</button>
    </div>
  );
}

UserCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    avatar: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
```

### Complex Props Examples

```javascript
// Passing functions as props
function TodoList({ todos, onToggle, onDelete, onEdit }) {
  return (
    <div>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={() => onToggle(todo.id)}
          onDelete={() => onDelete(todo.id)}
          onEdit={(text) => onEdit(todo.id, text)}
        />
      ))}
    </div>
  );
}

// Passing objects as props
function ProductCard({ product, settings, actions }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>

      {settings.showDescription && <p>{product.description}</p>}

      {settings.showActions && (
        <div>
          <button onClick={actions.addToCart}>Add to Cart</button>
          <button onClick={actions.addToWishlist}>♡</button>
        </div>
      )}
    </div>
  );
}
```

## Component Composition

### Children Prop

```javascript
// Basic children usage
function Card({ children }) {
  return (
    <div className="card">
      <div className="card-content">{children}</div>
    </div>
  );
}

// Usage
function App() {
  return (
    <Card>
      <h2>Card Title</h2>
      <p>Card content goes here</p>
      <button>Action Button</button>
    </Card>
  );
}
```

### Multiple Children Slots

```javascript
function Layout({ header, sidebar, children, footer }) {
  return (
    <div className="layout">
      <header className="header">{header}</header>
      <div className="main">
        <aside className="sidebar">{sidebar}</aside>
        <main className="content">{children}</main>
      </div>
      <footer className="footer">{footer}</footer>
    </div>
  );
}

// Usage
function App() {
  return (
    <Layout header={<Navigation />} sidebar={<Sidebar />} footer={<Footer />}>
      <h1>Main Content</h1>
      <p>This is the main content area</p>
    </Layout>
  );
}
```

### Render Props Pattern

```javascript
function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return render(position);
}

// Usage
function App() {
  return (
    <MouseTracker
      render={({ x, y }) => (
        <div>
          Mouse position: {x}, {y}
        </div>
      )}
    />
  );
}
```

## Component State Management

### Local State with useState

```javascript
function Counter() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  const increment = () => setCount(count + step);
  const decrement = () => setCount(count - step);
  const reset = () => setCount(0);

  return (
    <div>
      <h2>Count: {count}</h2>
      <div>
        <label>
          Step:
          <input
            type="number"
            value={step}
            onChange={(e) => setStep(Number(e.target.value))}
          />
        </label>
      </div>
      <div>
        <button onClick={decrement}>-</button>
        <button onClick={reset}>Reset</button>
        <button onClick={increment}>+</button>
      </div>
    </div>
  );
}
```

### Complex State with useReducer

```javascript
const initialState = {
  user: null,
  loading: false,
  error: null,
};

function userReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, user: action.payload };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    default:
      return state;
  }
}

function UserProfile({ userId }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  useEffect(() => {
    dispatch({ type: "FETCH_START" });
    fetchUser(userId)
      .then((user) => dispatch({ type: "FETCH_SUCCESS", payload: user }))
      .catch((error) =>
        dispatch({ type: "FETCH_ERROR", payload: error.message })
      );
  }, [userId]);

  if (state.loading) return <div>Loading...</div>;
  if (state.error) return <div>Error: {state.error}</div>;
  if (!state.user) return <div>No user found</div>;

  return (
    <div>
      <h2>{state.user.name}</h2>
      <p>{state.user.email}</p>
      <button onClick={() => dispatch({ type: "LOGOUT" })}>Logout</button>
    </div>
  );
}
```

## Component Lifecycle with Hooks

### Effect Hook for Side Effects

```javascript
function UserData({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Component did mount & userId changed
  useEffect(() => {
    let isCancelled = false;

    setLoading(true);
    fetchUser(userId).then((userData) => {
      if (!isCancelled) {
        setUser(userData);
        setLoading(false);
      }
    });

    // Cleanup function (component will unmount)
    return () => {
      isCancelled = true;
    };
  }, [userId]);

  // Component will unmount
  useEffect(() => {
    return () => {
      console.log("Component unmounting");
    };
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>{user?.name}</h2>
      <p>{user?.email}</p>
    </div>
  );
}
```

## Component Communication Patterns

### Parent to Child (Props)

```javascript
// Parent component
function App() {
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useState({ name: "John", role: "admin" });

  return (
    <div>
      <Header theme={theme} user={user} />
      <Main theme={theme} />
      <Footer theme={theme} />
    </div>
  );
}

// Child component
function Header({ theme, user }) {
  return (
    <header className={`header theme-${theme}`}>
      <h1>Welcome, {user.name}</h1>
      <span>Role: {user.role}</span>
    </header>
  );
}
```

### Child to Parent (Callback Props)

```javascript
// Parent component
function TodoApp() {
  const [todos, setTodos] = useState([]);

  const addTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
    };
    setTodos([...todos, newTodo]);
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div>
      <TodoForm onAddTodo={addTodo} />
      <TodoList todos={todos} onToggleTodo={toggleTodo} />
    </div>
  );
}

// Child components
function TodoForm({ onAddTodo }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAddTodo(text);
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a todo..."
      />
      <button type="submit">Add</button>
    </form>
  );
}
```

### Sibling Communication (Lift State Up)

```javascript
function ShoppingApp() {
  const [cart, setCart] = useState([]);
  const [products] = useState([
    { id: 1, name: "Laptop", price: 999 },
    { id: 2, name: "Phone", price: 699 },
  ]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  return (
    <div>
      <ProductList products={products} onAddToCart={addToCart} />
      <Cart items={cart} onRemoveFromCart={removeFromCart} />
    </div>
  );
}
```

## Higher-Order Components (HOC)

```javascript
// HOC that adds loading functionality
function withLoading(WrappedComponent) {
  return function WithLoadingComponent(props) {
    if (props.isLoading) {
      return <div>Loading...</div>;
    }
    return <WrappedComponent {...props} />;
  };
}

// Usage
const UserListWithLoading = withLoading(UserList);

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  return <UserListWithLoading users={users} isLoading={loading} />;
}
```

## Component Best Practices

### 1. Single Responsibility Principle

```javascript
// ❌ Bad: Component doing too much
function UserDashboard({ userId }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Too much logic in one component
  // ...
}

// ✅ Good: Split into smaller components
function UserDashboard({ userId }) {
  return (
    <div className="dashboard">
      <UserProfile userId={userId} />
      <UserPosts userId={userId} />
      <UserNotifications userId={userId} />
    </div>
  );
}
```

### 2. Props Interface Design

```javascript
// ❌ Bad: Too many individual props
function Button({ text, color, size, bold, italic, underline, onClick }) {
  // ...
}

// ✅ Good: Group related props
function Button({ children, variant, size, style, onClick }) {
  // variant can be 'primary', 'secondary', 'danger'
  // style can contain color, font styles
}
```

### 3. Component Naming

```javascript
// ✅ Good naming conventions
function UserProfileCard({ user }) {
  /* ... */
}
function NavigationMenu({ items }) {
  /* ... */
}
function SearchInput({ onSearch }) {
  /* ... */
}
function LoadingSpinner({ size }) {
  /* ... */
}
```

### 4. Extract Custom Hooks

```javascript
// ✅ Extract logic into custom hooks
function useUser(userId) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(userId).then((userData) => {
      setUser(userData);
      setLoading(false);
    });
  }, [userId]);

  return { user, loading };
}

// Clean component using custom hook
function UserProfile({ userId }) {
  const { user, loading } = useUser(userId);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

### 5. Memoization for Performance

```javascript
import React, { memo } from "react";

// Memoized component prevents unnecessary re-renders
const UserCard = memo(function UserCard({ user, onEdit, onDelete }) {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <button onClick={() => onEdit(user.id)}>Edit</button>
      <button onClick={() => onDelete(user.id)}>Delete</button>
    </div>
  );
});

// Custom comparison function
const UserCard = memo(
  function UserCard({ user, onEdit, onDelete }) {
    // Component implementation
  },
  (prevProps, nextProps) => {
    return (
      prevProps.user.id === nextProps.user.id &&
      prevProps.user.name === nextProps.user.name
    );
  }
);
```

## Component Testing

### Basic Component Test

```javascript
import { render, screen, fireEvent } from "@testing-library/react";
import Counter from "./Counter";

test("renders initial count", () => {
  render(<Counter />);
  expect(screen.getByText("Count: 0")).toBeInTheDocument();
});

test("increments count when button clicked", () => {
  render(<Counter />);
  const button = screen.getByText("+");
  fireEvent.click(button);
  expect(screen.getByText("Count: 1")).toBeInTheDocument();
});
```

Understanding components is fundamental to React development. They form the building blocks of your application and mastering them will make you a more effective React developer.
