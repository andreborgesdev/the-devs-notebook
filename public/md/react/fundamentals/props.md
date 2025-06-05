# Props in React

## Overview

Props (properties) are the mechanism for passing data from parent components to child components in React. They are read-only and help make components reusable and modular.

## Basic Props Usage

### Simple Props

```javascript
// Parent Component
function App() {
  return (
    <div>
      <Greeting name="John" age={25} />
      <Greeting name="Sarah" age={30} />
    </div>
  );
}

// Child Component
function Greeting({ name, age }) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>You are {age} years old.</p>
    </div>
  );
}
```

### Props with Default Values

```javascript
function Button({ text, variant, disabled }) {
  return (
    <button className={`btn btn-${variant}`} disabled={disabled}>
      {text}
    </button>
  );
}

// Using default parameters
function Button({ text = "Click me", variant = "primary", disabled = false }) {
  return (
    <button className={`btn btn-${variant}`} disabled={disabled}>
      {text}
    </button>
  );
}

// Usage
function App() {
  return (
    <div>
      <Button text="Submit" variant="success" />
      <Button text="Cancel" variant="danger" />
      <Button /> {/* Uses default values */}
    </div>
  );
}
```

## Props Types

### Primitive Props

```javascript
function UserCard({
  name, // string
  age, // number
  isActive, // boolean
  avatar, // string (URL)
}) {
  return (
    <div className="user-card">
      <img src={avatar} alt={name} />
      <h3>{name}</h3>
      <p>Age: {age}</p>
      <span className={isActive ? "active" : "inactive"}>
        {isActive ? "Online" : "Offline"}
      </span>
    </div>
  );
}

// Usage
<UserCard
  name="John Doe"
  age={28}
  isActive={true}
  avatar="/avatars/john.jpg"
/>;
```

### Object Props

```javascript
function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <span className="price">${product.price}</span>
      <div className="rating">{"★".repeat(product.rating)}</div>
    </div>
  );
}

// Usage
const product = {
  id: 1,
  name: "Laptop",
  description: "High-performance laptop",
  price: 999,
  rating: 4,
  image: "/products/laptop.jpg",
};

<ProductCard product={product} />;
```

### Array Props

```javascript
function TagList({ tags }) {
  return (
    <div className="tag-list">
      {tags.map((tag) => (
        <span key={tag} className="tag">
          {tag}
        </span>
      ))}
    </div>
  );
}

// Usage
<TagList tags={["React", "JavaScript", "Frontend"]} />;
```

### Function Props (Event Handlers)

```javascript
function SearchBox({ onSearch, onClear }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <button type="submit">Search</button>
      <button type="button" onClick={onClear}>
        Clear
      </button>
    </form>
  );
}

// Usage
function App() {
  const handleSearch = (query) => {
    console.log("Searching for:", query);
  };

  const handleClear = () => {
    console.log("Clearing search");
  };

  return <SearchBox onSearch={handleSearch} onClear={handleClear} />;
}
```

## Advanced Props Patterns

### Destructuring Props

```javascript
// ✅ Destructuring in function parameters
function UserProfile({ name, email, avatar, isOnline }) {
  return (
    <div className="user-profile">
      <img src={avatar} alt={name} />
      <h2>{name}</h2>
      <p>{email}</p>
      <span className={isOnline ? "online" : "offline"}>
        {isOnline ? "🟢" : "🔴"}
      </span>
    </div>
  );
}

// Alternative: Destructuring in function body
function UserProfile(props) {
  const { name, email, avatar, isOnline } = props;

  return (
    <div className="user-profile">
      <img src={avatar} alt={name} />
      <h2>{name}</h2>
      <p>{email}</p>
      <span className={isOnline ? "online" : "offline"}>
        {isOnline ? "🟢" : "🔴"}
      </span>
    </div>
  );
}
```

### Rest Props and Spread Operator

```javascript
function Input({ label, error, ...inputProps }) {
  return (
    <div className="input-group">
      <label>{label}</label>
      <input {...inputProps} />
      {error && <span className="error">{error}</span>}
    </div>
  );
}

// Usage - all additional props are passed to input
<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  required
  autoComplete="email"
  error="Invalid email format"
/>;
```

### Conditional Props

```javascript
function Button({ variant, size, disabled, loading, children, ...props }) {
  const classes = [
    "btn",
    variant && `btn-${variant}`,
    size && `btn-${size}`,
    disabled && "btn-disabled",
    loading && "btn-loading",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading ? "Loading..." : children}
    </button>
  );
}

// Usage
<Button variant="primary" size="large" loading={true}>
  Submit
</Button>;
```

### Props with Children

```javascript
function Card({ title, children }) {
  return (
    <div className="card">
      <div className="card-header">
        <h3>{title}</h3>
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
}

// Usage
<Card title="User Information">
  <p>Name: John Doe</p>
  <p>Email: john@example.com</p>
  <button>Edit Profile</button>
</Card>;
```

### Render Props Pattern

```javascript
function DataFetcher({ url, render }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [url]);

  return render({ data, loading, error });
}

// Usage
<DataFetcher
  url="/api/users"
  render={({ data, loading, error }) => {
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    return (
      <ul>
        {data.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    );
  }}
/>;
```

## Component Composition

### Compound Components

```javascript
function Tabs({ children, defaultTab = 0 }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className="tabs">
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child, {
          isActive: index === activeTab,
          onClick: () => setActiveTab(index),
          index,
        })
      )}
    </div>
  );
}

function Tab({ children, isActive, onClick, label }) {
  return (
    <div>
      <button className={`tab ${isActive ? "active" : ""}`} onClick={onClick}>
        {label}
      </button>
      {isActive && <div className="tab-content">{children}</div>}
    </div>
  );
}

// Usage
<Tabs defaultTab={0}>
  <Tab label="Tab 1">
    <p>Content for tab 1</p>
  </Tab>
  <Tab label="Tab 2">
    <p>Content for tab 2</p>
  </Tab>
  <Tab label="Tab 3">
    <p>Content for tab 3</p>
  </Tab>
</Tabs>;
```

### Higher-Order Component (HOC) Props

```javascript
function withLoading(WrappedComponent) {
  return function WithLoadingComponent({ isLoading, ...props }) {
    if (isLoading) {
      return <div>Loading...</div>;
    }
    return <WrappedComponent {...props} />;
  };
}

// Usage
const UserListWithLoading = withLoading(UserList);

<UserListWithLoading
  users={users}
  isLoading={loading}
  onUserClick={handleUserClick}
/>;
```

## Props Validation and Types

### PropTypes (Development)

```javascript
import PropTypes from "prop-types";

function UserCard({ name, age, email, isActive, hobbies, onEdit }) {
  return (
    <div className="user-card">
      <h3>{name}</h3>
      <p>Age: {age}</p>
      <p>Email: {email}</p>
      <p>Status: {isActive ? "Active" : "Inactive"}</p>
      <div>Hobbies: {hobbies.join(", ")}</div>
      <button onClick={onEdit}>Edit</button>
    </div>
  );
}

UserCard.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number.isRequired,
  email: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  hobbies: PropTypes.arrayOf(PropTypes.string),
  onEdit: PropTypes.func.isRequired,
};

UserCard.defaultProps = {
  isActive: false,
  hobbies: [],
};
```

### TypeScript Props

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

interface UserCardProps {
  user: User;
  isSelected?: boolean;
  onSelect: (user: User) => void;
  onEdit?: (user: User) => void;
  children?: React.ReactNode;
}

function UserCard({
  user,
  isSelected = false,
  onSelect,
  onEdit,
  children,
}: UserCardProps) {
  return (
    <div className={`user-card ${isSelected ? "selected" : ""}`}>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <button onClick={() => onSelect(user)}>
        {isSelected ? "Deselect" : "Select"}
      </button>
      {onEdit && <button onClick={() => onEdit(user)}>Edit</button>}
      {children}
    </div>
  );
}
```

## Common Props Patterns

### Configuration Props

```javascript
function DataTable({
  data,
  columns,
  sortable = true,
  filterable = true,
  paginated = true,
  pageSize = 10,
  onSort,
  onFilter,
  onPageChange,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState(null);
  const [filters, setFilters] = useState({});

  return (
    <div className="data-table">
      {filterable && (
        <div className="table-filters">{/* Filter controls */}</div>
      )}
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>
                {column.label}
                {sortable && (
                  <button onClick={() => handleSort(column.key)}>Sort</button>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td key={column.key}>{row[column.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {paginated && (
        <div className="table-pagination">{/* Pagination controls */}</div>
      )}
    </div>
  );
}
```

### Theme Props

```javascript
function Button({
  variant = "primary",
  size = "medium",
  theme = "light",
  children,
  ...props
}) {
  const themeClasses = {
    light: {
      primary: "bg-blue-500 text-white",
      secondary: "bg-gray-500 text-white",
      danger: "bg-red-500 text-white",
    },
    dark: {
      primary: "bg-blue-700 text-gray-100",
      secondary: "bg-gray-700 text-gray-100",
      danger: "bg-red-700 text-gray-100",
    },
  };

  const sizeClasses = {
    small: "px-2 py-1 text-sm",
    medium: "px-4 py-2",
    large: "px-6 py-3 text-lg",
  };

  const className = [
    "button",
    themeClasses[theme][variant],
    sizeClasses[size],
  ].join(" ");

  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
}
```

## Interview Questions

### Q: What is the difference between props and state?

| Aspect         | Props              | State                   |
| -------------- | ------------------ | ----------------------- |
| **Mutability** | Immutable          | Mutable                 |
| **Ownership**  | Passed from parent | Owned by component      |
| **Purpose**    | Configuration/data | Internal component data |
| **Updates**    | Parent updates     | Component updates       |

### Q: How do you pass data from child to parent?

```javascript
// Parent component
function Parent() {
  const [message, setMessage] = useState("");

  const handleMessage = (msg) => {
    setMessage(msg);
  };

  return (
    <div>
      <p>Message from child: {message}</p>
      <Child onMessage={handleMessage} />
    </div>
  );
}

// Child component
function Child({ onMessage }) {
  const sendMessage = () => {
    onMessage("Hello from child!");
  };

  return <button onClick={sendMessage}>Send Message to Parent</button>;
}
```

### Q: Can you modify props inside a component?

No, props are read-only. You should never modify props directly:

```javascript
// ❌ Wrong - Don't modify props
function Component({ user }) {
  user.name = "Modified"; // This is wrong!
  return <div>{user.name}</div>;
}

// ✅ Correct - Use local state if you need to modify
function Component({ user }) {
  const [localUser, setLocalUser] = useState(user);

  const updateUser = () => {
    setLocalUser({ ...localUser, name: "Modified" });
  };

  return (
    <div>
      <div>{localUser.name}</div>
      <button onClick={updateUser}>Update</button>
    </div>
  );
}
```

## Best Practices

| Practice                   | Description                                | Example                                                       |
| -------------------------- | ------------------------------------------ | ------------------------------------------------------------- |
| **Destructure props**      | Extract props in function parameters       | `function Comp({ name, age }) {}`                             |
| **Use default parameters** | Provide fallback values                    | `function Comp({ name = 'Anonymous' }) {}`                    |
| **Keep props minimal**     | Pass only necessary data                   | Avoid passing entire objects when only one property is needed |
| **Use composition**        | Break complex components into smaller ones | Parent provides layout, children provide content              |
| **Validate props**         | Use PropTypes or TypeScript                | Catch errors early in development                             |

## Common Mistakes

### Directly Mutating Props

```javascript
// ❌ Wrong
function TodoList({ todos }) {
  const addTodo = () => {
    todos.push({ id: Date.now(), text: 'New todo' }); // Mutation!
  };

  return (
    // JSX
  );
}

// ✅ Correct
function TodoList({ todos, onAddTodo }) {
  const addTodo = () => {
    onAddTodo({ id: Date.now(), text: 'New todo' });
  };

  return (
    // JSX
  );
}
```

### Missing Key Props in Lists

```javascript
// ❌ Wrong - Missing key
function UserList({ users }) {
  return (
    <ul>
      {users.map((user) => (
        <li>{user.name}</li> // Missing key prop
      ))}
    </ul>
  );
}

// ✅ Correct
function UserList({ users }) {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Using Array Index as Key

```javascript
// ❌ Avoid using index as key
{
  items.map((item, index) => <Item key={index} data={item} />);
}

// ✅ Use unique identifier
{
  items.map((item) => <Item key={item.id} data={item} />);
}
```

## Performance Considerations

- Props comparison triggers re-renders
- Use React.memo for expensive components
- Avoid creating new objects/functions in render
- Consider useMemo/useCallback for complex props

```javascript
// ❌ Creates new object on every render
function Parent() {
  return <Child config={{ theme: "dark", size: "large" }} />;
}

// ✅ Memoize or define outside render
const config = { theme: "dark", size: "large" };

function Parent() {
  return <Child config={config} />;
}

// ✅ Or use useMemo for dynamic values
function Parent({ theme, size }) {
  const config = useMemo(() => ({ theme, size }), [theme, size]);
  return <Child config={config} />;
}
```
