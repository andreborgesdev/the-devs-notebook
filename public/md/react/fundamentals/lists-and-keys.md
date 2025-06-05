# Lists and Keys in React

Rendering lists is a common requirement in React applications. Understanding how to properly render lists and use keys is crucial for performance and avoiding bugs.

## Basic List Rendering

### Simple Array Rendering

```jsx
function NumberList() {
  const numbers = [1, 2, 3, 4, 5];

  return (
    <ul>
      {numbers.map((number) => (
        <li key={number}>{number}</li>
      ))}
    </ul>
  );
}
```

### Object Array Rendering

```jsx
function UserList() {
  const users = [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" },
    { id: 3, name: "Charlie", email: "charlie@example.com" },
  ];

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          <strong>{user.name}</strong> - {user.email}
        </li>
      ))}
    </ul>
  );
}
```

## Understanding Keys

### Why Keys Are Important

Keys help React identify which items have changed, been added, or removed. This enables React to update the DOM efficiently.

```jsx
function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Learn React", completed: false },
    { id: 2, text: "Build an app", completed: true },
  ]);

  const addTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
    };
    setTodos([...todos, newTodo]);
  };

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
          />
          <span>{todo.text}</span>
        </li>
      ))}
    </ul>
  );
}
```

### Bad Key Examples

```jsx
function BadKeyExamples({ items }) {
  return (
    <div>
      {/* Using array index - problematic for dynamic lists */}
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item.name}</li>
        ))}
      </ul>

      {/* Using random values - causes unnecessary re-renders */}
      <ul>
        {items.map((item) => (
          <li key={Math.random()}>{item.name}</li>
        ))}
      </ul>

      {/* Using non-unique values - React will warn */}
      <ul>
        {items.map((item) => (
          <li key={item.category}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Good Key Examples

```jsx
function GoodKeyExamples({ items }) {
  return (
    <div>
      {/* Using unique, stable ID */}
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>

      {/* Combination of properties for uniqueness */}
      <ul>
        {items.map((item) => (
          <li key={`${item.category}-${item.id}`}>{item.name}</li>
        ))}
      </ul>

      {/* Using stable content when no ID available */}
      <ul>
        {items.map((item) => (
          <li key={item.name}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Advanced List Patterns

### Nested Lists

```jsx
function CategoryList() {
  const categories = [
    {
      id: 1,
      name: "Electronics",
      products: [
        { id: 101, name: "Laptop", price: 999 },
        { id: 102, name: "Phone", price: 699 },
      ],
    },
    {
      id: 2,
      name: "Books",
      products: [
        { id: 201, name: "React Guide", price: 29 },
        { id: 202, name: "JavaScript Handbook", price: 39 },
      ],
    },
  ];

  return (
    <div>
      {categories.map((category) => (
        <div key={category.id} className="category">
          <h2>{category.name}</h2>
          <ul>
            {category.products.map((product) => (
              <li key={product.id}>
                {product.name} - ${product.price}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
```

### Conditional List Items

```jsx
function FilteredUserList({ users, showInactive = false }) {
  const filteredUsers = users.filter((user) => showInactive || user.isActive);

  return (
    <div>
      <h2>Users ({filteredUsers.length})</h2>
      <ul>
        {filteredUsers.map((user) => (
          <li key={user.id} className={user.isActive ? "active" : "inactive"}>
            <span>{user.name}</span>
            {user.isAdmin && <span className="badge">Admin</span>}
            {!user.isActive && <span className="status">Inactive</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Dynamic List Operations

```jsx
function DynamicTodoList() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodo = {
        id: crypto.randomUUID(),
        text: inputValue.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setTodos([...todos, newTodo]);
      setInputValue("");
    }
  };

  const removeTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const moveTodoUp = (index) => {
    if (index > 0) {
      const newTodos = [...todos];
      [newTodos[index], newTodos[index - 1]] = [
        newTodos[index - 1],
        newTodos[index],
      ];
      setTodos(newTodos);
    }
  };

  return (
    <div>
      <div className="add-todo">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addTodo()}
          placeholder="Add a todo..."
        />
        <button onClick={addTodo}>Add</button>
      </div>

      <ul className="todo-list">
        {todos.map((todo, index) => (
          <li
            key={todo.id}
            className={`todo-item ${todo.completed ? "completed" : ""}`}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span className="todo-text">{todo.text}</span>
            <div className="todo-actions">
              <button onClick={() => moveTodoUp(index)} disabled={index === 0}>
                ↑
              </button>
              <button onClick={() => removeTodo(todo.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {todos.length === 0 && (
        <p className="empty-state">No todos yet. Add one above!</p>
      )}
    </div>
  );
}
```

## List Performance Optimization

### React.memo for List Items

```jsx
const TodoItem = React.memo(function TodoItem({ todo, onToggle, onDelete }) {
  console.log("Rendering TodoItem:", todo.id);

  return (
    <li className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span>{todo.text}</span>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </li>
  );
});

function OptimizedTodoList() {
  const [todos, setTodos] = useState([]);

  const handleToggle = useCallback((id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const handleDelete = useCallback((id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      ))}
    </ul>
  );
}
```

### Virtual Scrolling for Large Lists

```jsx
function VirtualList({ items, itemHeight = 50, containerHeight = 400 }) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef();

  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );

    return items.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      index: startIndex + index,
    }));
  }, [items, scrollTop, itemHeight, containerHeight]);

  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };

  const totalHeight = items.length * itemHeight;
  const offsetY = Math.floor(scrollTop / itemHeight) * itemHeight;

  return (
    <div
      ref={containerRef}
      style={{ height: containerHeight, overflow: "auto" }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item) => (
            <div
              key={item.id}
              style={{ height: itemHeight }}
              className="list-item"
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

## Sorting and Filtering Lists

### Sortable List

```jsx
function SortableUserList() {
  const [users, setUsers] = useState([
    { id: 1, name: "Alice", age: 25, email: "alice@example.com" },
    { id: 2, name: "Bob", age: 30, email: "bob@example.com" },
    { id: 3, name: "Charlie", age: 22, email: "charlie@example.com" },
  ]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const sortedUsers = useMemo(() => {
    if (!sortConfig.key) return users;

    return [...users].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [users, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return "↕️";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort("name")}>
              Name {getSortIcon("name")}
            </th>
            <th onClick={() => handleSort("age")}>Age {getSortIcon("age")}</th>
            <th onClick={() => handleSort("email")}>
              Email {getSortIcon("email")}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.age}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### Searchable and Filterable List

```jsx
function SearchableProductList() {
  const [products] = useState([
    {
      id: 1,
      name: "Laptop",
      category: "Electronics",
      price: 999,
      inStock: true,
    },
    { id: 2, name: "Book", category: "Education", price: 29, inStock: false },
    {
      id: 3,
      name: "Phone",
      category: "Electronics",
      price: 699,
      inStock: true,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "inStock" && product.inStock) ||
        (stockFilter === "outOfStock" && !product.inStock);

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchTerm, categoryFilter, stockFilter]);

  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div>
      <div className="filters">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
        >
          <option value="all">All Stock Status</option>
          <option value="inStock">In Stock</option>
          <option value="outOfStock">Out of Stock</option>
        </select>
      </div>

      <div className="results">
        <p>Found {filteredProducts.length} products</p>
        <ul>
          {filteredProducts.map((product) => (
            <li key={product.id} className="product-item">
              <h3>{product.name}</h3>
              <p>Category: {product.category}</p>
              <p>Price: ${product.price}</p>
              <p className={product.inStock ? "in-stock" : "out-of-stock"}>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

## TypeScript with Lists

```tsx
interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user" | "moderator";
  isActive: boolean;
}

interface UserListProps {
  users: User[];
  onUserClick?: (user: User) => void;
  showInactive?: boolean;
}

function TypedUserList({
  users,
  onUserClick,
  showInactive = false,
}: UserListProps): JSX.Element {
  const filteredUsers = useMemo(() => {
    return users.filter((user) => showInactive || user.isActive);
  }, [users, showInactive]);

  const handleUserClick = (user: User) => {
    onUserClick?.(user);
  };

  const getRoleBadgeColor = (role: User["role"]): string => {
    switch (role) {
      case "admin":
        return "red";
      case "moderator":
        return "orange";
      case "user":
        return "blue";
      default:
        return "gray";
    }
  };

  return (
    <ul className="user-list">
      {filteredUsers.map((user) => (
        <li
          key={user.id}
          className={`user-item ${!user.isActive ? "inactive" : ""}`}
          onClick={() => handleUserClick(user)}
        >
          <div className="user-info">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>
          <div className="user-meta">
            <span
              className="role-badge"
              style={{ backgroundColor: getRoleBadgeColor(user.role) }}
            >
              {user.role}
            </span>
            {!user.isActive && <span className="inactive-label">Inactive</span>}
          </div>
        </li>
      ))}
    </ul>
  );
}
```

## List Component Patterns

### Render Props Pattern

```jsx
function DataList({ data, children }) {
  return (
    <div className="data-list">
      {data.map((item, index) => (
        <div key={item.id || index} className="list-item">
          {children(item, index)}
        </div>
      ))}
    </div>
  );
}

function App() {
  const users = [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" },
  ];

  return (
    <DataList data={users}>
      {(user, index) => (
        <>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <small>Item #{index + 1}</small>
        </>
      )}
    </DataList>
  );
}
```

### Compound Component Pattern

```jsx
function List({ children }) {
  return <ul className="list">{children}</ul>;
}

function ListItem({ children, ...props }) {
  return (
    <li className="list-item" {...props}>
      {children}
    </li>
  );
}

function ListHeader({ children }) {
  return <h2 className="list-header">{children}</h2>;
}

List.Item = ListItem;
List.Header = ListHeader;

function UsersList({ users }) {
  return (
    <div>
      <List.Header>Users</List.Header>
      <List>
        {users.map((user) => (
          <List.Item key={user.id}>
            {user.name} - {user.email}
          </List.Item>
        ))}
      </List>
    </div>
  );
}
```

## Common List Patterns Comparison

| Pattern             | Use Case                 | Pros                   | Cons                                 |
| ------------------- | ------------------------ | ---------------------- | ------------------------------------ |
| Basic map()         | Simple lists             | Easy to understand     | Limited flexibility                  |
| Filtered lists      | Dynamic filtering        | Efficient with useMemo | Can be complex with multiple filters |
| Virtual scrolling   | Large datasets           | Great performance      | Implementation complexity            |
| Sortable lists      | User-controlled ordering | Good UX                | State management complexity          |
| Render props        | Flexible rendering       | Highly reusable        | Can be verbose                       |
| Compound components | Complex list structures  | Clean API              | More setup required                  |

## Best Practices

1. **Always Use Keys**: Provide unique, stable keys for list items
2. **Avoid Index as Key**: Don't use array index as key for dynamic lists
3. **Optimize with React.memo**: Memoize list items to prevent unnecessary re-renders
4. **Use useMemo for Expensive Operations**: Memoize filtering, sorting, and transformations
5. **Handle Empty States**: Always provide feedback when lists are empty
6. **Implement Virtual Scrolling**: For large lists (>1000 items)
7. **Debounce Search**: Debounce search input to avoid excessive filtering
8. **Consider Accessibility**: Add proper ARIA labels and keyboard navigation

## Common Mistakes

1. **Using Array Index as Key**: Causes React to incorrectly track items
2. **Creating Functions in Render**: Creating new functions for each item causes re-renders
3. **Not Handling Empty Lists**: Showing empty containers without feedback
4. **Expensive Operations in Render**: Performing expensive computations without memoization
5. **Missing Keys**: Forgetting to add keys to list items
6. **Mutating State Directly**: Directly modifying array state instead of creating new arrays

## Interview Questions

**Q: Why are keys important in React lists?**
A: Keys help React identify which items have changed, been added, or removed, enabling efficient DOM updates and maintaining component state correctly.

**Q: When is it acceptable to use array index as a key?**
A: Only when the list is static, items are never reordered, and no items are added/removed from the middle of the list.

**Q: How do you optimize performance for large lists?**
A: Use React.memo for list items, implement virtual scrolling, memoize expensive operations with useMemo, and avoid creating functions in render.

**Q: What's the difference between using array index and unique ID as keys?**
A: Unique IDs maintain component identity when items are reordered or removed, while indices can cause React to incorrectly associate state with the wrong items.

**Q: How do you handle dynamic list operations efficiently?**
A: Use functional state updates, implement proper key strategies, memoize callback functions with useCallback, and consider using useReducer for complex list operations.
