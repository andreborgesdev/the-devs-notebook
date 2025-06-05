# JSX (JavaScript XML)

## What is JSX?

JSX is a syntax extension for JavaScript that allows you to write HTML-like code directly in your JavaScript files. It makes React code more readable and intuitive.

## JSX Fundamentals

### Basic Syntax

```javascript
// JSX
const element = <h1>Hello, world!</h1>;

// Equivalent JavaScript (after Babel compilation)
const element = React.createElement("h1", null, "Hello, world!");
```

### JSX vs HTML Differences

| HTML       | JSX         | Reason                                   |
| ---------- | ----------- | ---------------------------------------- |
| `class`    | `className` | `class` is a reserved word in JavaScript |
| `for`      | `htmlFor`   | `for` is a reserved word in JavaScript   |
| `tabindex` | `tabIndex`  | JSX uses camelCase                       |
| `onclick`  | `onClick`   | JSX uses camelCase                       |

### JSX Rules

1. **Return a single root element**

   ```javascript
   // ❌ Wrong
   function Component() {
     return (
       <h1>Title</h1>
       <p>Paragraph</p>
     );
   }

   // ✅ Correct
   function Component() {
     return (
       <div>
         <h1>Title</h1>
         <p>Paragraph</p>
       </div>
     );
   }

   // ✅ Also correct (React Fragment)
   function Component() {
     return (
       <>
         <h1>Title</h1>
         <p>Paragraph</p>
       </>
     );
   }
   ```

2. **Close all tags**

   ```javascript
   // ❌ Wrong
   <img src="image.jpg">
   <input type="text">

   // ✅ Correct
   <img src="image.jpg" />
   <input type="text" />
   ```

3. **Use camelCase for attributes**

   ```javascript
   // ❌ Wrong
   <div onclick={handleClick} tabindex="0">

   // ✅ Correct
   <div onClick={handleClick} tabIndex="0">
   ```

## JavaScript Expressions in JSX

### Embedding Expressions

```javascript
function Greeting({ name, age }) {
  const isAdult = age >= 18;

  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>You are {age} years old</p>
      <p>Status: {isAdult ? "Adult" : "Minor"}</p>
      <p>Next year you'll be {age + 1}</p>
    </div>
  );
}
```

### Complex Expressions

```javascript
function UserProfile({ user }) {
  return (
    <div>
      <h1>{user.firstName + " " + user.lastName}</h1>
      <p>{user.email.toLowerCase()}</p>
      <p>Joined: {new Date(user.joinDate).toLocaleDateString()}</p>
      <div>
        Hobbies:{" "}
        {user.hobbies
          .map((hobby) => hobby.charAt(0).toUpperCase() + hobby.slice(1))
          .join(", ")}
      </div>
    </div>
  );
}
```

### Function Calls in JSX

```javascript
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function ProductCard({ product }) {
  return (
    <div>
      <h3>{product.name}</h3>
      <p>{formatCurrency(product.price)}</p>
      <p>Stock: {Math.max(0, product.stock)} items</p>
    </div>
  );
}
```

## Conditional Rendering in JSX

### Ternary Operator

```javascript
function LoginButton({ isLoggedIn, onLogin, onLogout }) {
  return (
    <button onClick={isLoggedIn ? onLogout : onLogin}>
      {isLoggedIn ? "Logout" : "Login"}
    </button>
  );
}
```

### Logical AND Operator

```javascript
function NotificationBell({ notifications }) {
  return (
    <div>
      <span>🔔</span>
      {notifications.length > 0 && (
        <span className="badge">{notifications.length}</span>
      )}
    </div>
  );
}
```

### Complex Conditional Rendering

```javascript
function UserStatus({ user }) {
  return (
    <div>
      {user ? (
        user.isActive ? (
          <span className="status-online">● Online</span>
        ) : (
          <span className="status-offline">● Offline</span>
        )
      ) : (
        <span className="status-unknown">● Unknown</span>
      )}
    </div>
  );
}
```

### Switch-like Pattern

```javascript
function StatusIcon({ status }) {
  const getStatusIcon = () => {
    switch (status) {
      case "loading":
        return "⏳";
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      default:
        return "❓";
    }
  };

  return <span>{getStatusIcon()}</span>;
}
```

## Lists and Keys in JSX

### Basic List Rendering

```javascript
function FruitList({ fruits }) {
  return (
    <ul>
      {fruits.map((fruit) => (
        <li key={fruit.id}>
          {fruit.name} - ${fruit.price}
        </li>
      ))}
    </ul>
  );
}
```

### Complex List Items

```javascript
function TodoList({ todos, onToggle, onDelete }) {
  return (
    <div>
      {todos.map((todo) => (
        <div
          key={todo.id}
          className={`todo ${todo.completed ? "completed" : ""}`}
        >
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
          />
          <span>{todo.text}</span>
          <button onClick={() => onDelete(todo.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

### Nested Lists

```javascript
function CategoryList({ categories }) {
  return (
    <div>
      {categories.map((category) => (
        <div key={category.id}>
          <h3>{category.name}</h3>
          <ul>
            {category.items.map((item) => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
```

## Event Handling in JSX

### Basic Event Handlers

```javascript
function Button() {
  const handleClick = () => {
    alert("Button clicked!");
  };

  return <button onClick={handleClick}>Click me</button>;
}
```

### Inline Event Handlers

```javascript
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

### Event Object

```javascript
function FormExample() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  const handleInputChange = (e) => {
    console.log("Input value:", e.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        onChange={handleInputChange}
        placeholder="Type something"
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Passing Parameters to Event Handlers

```javascript
function ButtonGroup({ items, onItemClick }) {
  return (
    <div>
      {items.map((item) => (
        <button key={item.id} onClick={() => onItemClick(item.id)}>
          {item.name}
        </button>
      ))}
    </div>
  );
}
```

## Attributes and Props in JSX

### Static Attributes

```javascript
function ImageCard() {
  return (
    <div className="card">
      <img
        src="/images/placeholder.jpg"
        alt="Placeholder"
        width="300"
        height="200"
      />
    </div>
  );
}
```

### Dynamic Attributes

```javascript
function DynamicImage({ src, alt, size = "medium" }) {
  const getSizeClass = (size) => {
    const sizes = {
      small: "w-16 h-16",
      medium: "w-32 h-32",
      large: "w-64 h-64",
    };
    return sizes[size] || sizes.medium;
  };

  return (
    <img src={src} alt={alt} className={`rounded ${getSizeClass(size)}`} />
  );
}
```

### Conditional Attributes

```javascript
function Input({ isRequired, isDisabled, ...props }) {
  return (
    <input
      {...props}
      required={isRequired}
      disabled={isDisabled}
      className={`form-input ${isDisabled ? "opacity-50" : ""}`}
    />
  );
}
```

### Data Attributes

```javascript
function AnalyticsButton({ children, event, category }) {
  return (
    <button
      data-event={event}
      data-category={category}
      data-testid="analytics-button"
      onClick={(e) => {
        // Analytics tracking
        console.log("Event:", e.target.dataset.event);
      }}
    >
      {children}
    </button>
  );
}
```

## JSX Fragments

### React.Fragment

```javascript
function UserInfo({ user }) {
  return (
    <React.Fragment>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </React.Fragment>
  );
}
```

### Short Syntax

```javascript
function UserInfo({ user }) {
  return (
    <>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </>
  );
}
```

### Fragment with Keys

```javascript
function DefinitionList({ terms }) {
  return (
    <dl>
      {terms.map((term) => (
        <React.Fragment key={term.id}>
          <dt>{term.term}</dt>
          <dd>{term.definition}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
```

## Styling in JSX

### Inline Styles

```javascript
function StyledComponent() {
  const styles = {
    container: {
      padding: "20px",
      backgroundColor: "#f0f0f0",
      borderRadius: "8px",
    },
    title: {
      color: "#333",
      fontSize: "24px",
      fontWeight: "bold",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Styled Title</h1>
    </div>
  );
}
```

### Dynamic Styles

```javascript
function AlertBox({ type, children }) {
  const getAlertStyles = (type) => {
    const baseStyles = {
      padding: "12px",
      borderRadius: "4px",
      marginBottom: "16px",
    };

    const typeStyles = {
      success: { backgroundColor: "#d4edda", color: "#155724" },
      warning: { backgroundColor: "#fff3cd", color: "#856404" },
      error: { backgroundColor: "#f8d7da", color: "#721c24" },
    };

    return { ...baseStyles, ...typeStyles[type] };
  };

  return <div style={getAlertStyles(type)}>{children}</div>;
}
```

### CSS Classes

```javascript
function Button({ variant = "primary", size = "medium", children }) {
  const getClassName = () => {
    return `btn btn-${variant} btn-${size}`;
  };

  return <button className={getClassName()}>{children}</button>;
}
```

## JSX Compilation and Babel

### Babel Transformation

```javascript
// JSX
const element = (
  <div className="container">
    <h1>Hello, {name}!</h1>
    <p>Welcome to React</p>
  </div>
);

// Compiled JavaScript
const element = React.createElement(
  "div",
  { className: "container" },
  React.createElement("h1", null, "Hello, ", name, "!"),
  React.createElement("p", null, "Welcome to React")
);
```

### React 17+ JSX Transform

```javascript
// New JSX Transform (React 17+)
// Imports are automatically added
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";

const element = _jsxs("div", {
  className: "container",
  children: [
    _jsxs("h1", { children: ["Hello, ", name, "!"] }),
    _jsx("p", { children: "Welcome to React" }),
  ],
});
```

## Common JSX Patterns

### Render Props Pattern

```javascript
function DataFetcher({ url, render }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, [url]);

  return render({ data, loading });
}

// Usage
function App() {
  return (
    <DataFetcher
      url="/api/users"
      render={({ data, loading }) =>
        loading ? <div>Loading...</div> : <UserList users={data} />
      }
    />
  );
}
```

### Children as Function

```javascript
function Toggle({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return <div>{children({ isOpen, toggle: () => setIsOpen(!isOpen) })}</div>;
}

// Usage
function App() {
  return (
    <Toggle>
      {({ isOpen, toggle }) => (
        <div>
          <button onClick={toggle}>{isOpen ? "Hide" : "Show"}</button>
          {isOpen && <div>Content to toggle</div>}
        </div>
      )}
    </Toggle>
  );
}
```

## JSX Best Practices

### Formatting and Readability

```javascript
// ✅ Good formatting
function UserCard({ user }) {
  return (
    <div className="user-card">
      <div className="user-header">
        <img
          src={user.avatar}
          alt={`${user.name}'s avatar`}
          className="avatar"
        />
        <div className="user-info">
          <h3 className="user-name">{user.name}</h3>
          <p className="user-email">{user.email}</p>
        </div>
      </div>

      <div className="user-stats">
        <span>Posts: {user.postCount}</span>
        <span>Followers: {user.followerCount}</span>
      </div>
    </div>
  );
}
```

### Extracting Complex JSX

```javascript
// Extract complex JSX into separate functions
function UserStats({ user }) {
  return (
    <div className="user-stats">
      <div className="stat">
        <span className="stat-number">{user.postCount}</span>
        <span className="stat-label">Posts</span>
      </div>
      <div className="stat">
        <span className="stat-number">{user.followerCount}</span>
        <span className="stat-label">Followers</span>
      </div>
      <div className="stat">
        <span className="stat-number">{user.followingCount}</span>
        <span className="stat-label">Following</span>
      </div>
    </div>
  );
}

function UserCard({ user }) {
  return (
    <div className="user-card">
      <UserHeader user={user} />
      <UserStats user={user} />
    </div>
  );
}
```

## Common JSX Mistakes

### 1. Forgetting to wrap expressions

```javascript
// ❌ Wrong
<div>Hello {name} how are you?</div>

// ✅ Correct
<div>Hello {name}, how are you?</div>
```

### 2. Using reserved words

```javascript
// ❌ Wrong
<div class="container" for="input">

// ✅ Correct
<div className="container" htmlFor="input">
```

### 3. Not handling null/undefined values

```javascript
// ❌ Wrong (can throw error)
<div>{user.name.toUpperCase()}</div>

// ✅ Correct
<div>{user?.name?.toUpperCase() || 'No name'}</div>
```

JSX is the heart of React development. Mastering it will make you more productive and help you write cleaner, more maintainable React code.
