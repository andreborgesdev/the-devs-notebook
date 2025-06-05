# React Memoization Techniques

## Overview

Memoization in React involves caching expensive computations and components to prevent unnecessary work. React provides several built-in hooks and techniques for effective memoization.

## useMemo Hook

### Basic Usage

```javascript
import React, { useMemo, useState } from "react";

const ExpensiveComponent = ({ items, multiplier }) => {
  const expensiveValue = useMemo(() => {
    console.log("Calculating expensive value...");
    return items.reduce((sum, item) => sum + item.value, 0) * multiplier;
  }, [items, multiplier]);

  return <div>Result: {expensiveValue}</div>;
};
```

### Complex Calculations

```javascript
const DataAnalyzer = ({ data, filters }) => {
  const processedData = useMemo(() => {
    console.log("Processing data...");

    return data
      .filter((item) => filters.categories.includes(item.category))
      .filter(
        (item) =>
          item.price >= filters.minPrice && item.price <= filters.maxPrice
      )
      .sort((a, b) => {
        switch (filters.sortBy) {
          case "price":
            return a.price - b.price;
          case "name":
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
  }, [data, filters]);

  const statistics = useMemo(() => {
    if (processedData.length === 0) return null;

    return {
      total: processedData.length,
      averagePrice:
        processedData.reduce((sum, item) => sum + item.price, 0) /
        processedData.length,
      maxPrice: Math.max(...processedData.map((item) => item.price)),
      minPrice: Math.min(...processedData.map((item) => item.price)),
    };
  }, [processedData]);

  return (
    <div>
      {statistics && (
        <div>
          <p>Total items: {statistics.total}</p>
          <p>Average price: ${statistics.averagePrice.toFixed(2)}</p>
          <p>
            Price range: ${statistics.minPrice} - ${statistics.maxPrice}
          </p>
        </div>
      )}
      <ul>
        {processedData.map((item) => (
          <li key={item.id}>
            {item.name} - ${item.price}
          </li>
        ))}
      </ul>
    </div>
  );
};
```

## useCallback Hook

### Event Handlers

```javascript
const TodoList = ({ todos, onUpdate }) => {
  const [filter, setFilter] = useState("all");

  const handleToggle = useCallback(
    (id) => {
      onUpdate((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    },
    [onUpdate]
  );

  const handleDelete = useCallback(
    (id) => {
      onUpdate((prev) => prev.filter((todo) => todo.id !== id));
    },
    [onUpdate]
  );

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case "active":
        return todos.filter((todo) => !todo.completed);
      case "completed":
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  return (
    <div>
      <div>
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("active")}>Active</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
      </div>
      {filteredTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};
```

### API Calls

```javascript
const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${id}`);
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshUser = useCallback(() => {
    fetchUser(userId);
  }, [fetchUser, userId]);

  useEffect(() => {
    fetchUser(userId);
  }, [fetchUser, userId]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : user ? (
        <div>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <button onClick={refreshUser}>Refresh</button>
        </div>
      ) : (
        <p>User not found</p>
      )}
    </div>
  );
};
```

## Advanced Memoization Patterns

### Memoized Selectors

```javascript
const createUserSelector = () => {
  return useMemo(
    () => (users, searchTerm, sortBy) => {
      return users
        .filter(
          (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
          switch (sortBy) {
            case "name":
              return a.name.localeCompare(b.name);
            case "email":
              return a.email.localeCompare(b.email);
            case "created":
              return new Date(b.createdAt) - new Date(a.createdAt);
            default:
              return 0;
          }
        });
    },
    []
  );
};

const UserList = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const userSelector = createUserSelector();

  const filteredUsers = useMemo(() => {
    return userSelector(users, searchTerm, sortBy);
  }, [userSelector, users, searchTerm, sortBy]);

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search users..."
      />
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="name">Name</option>
        <option value="email">Email</option>
        <option value="created">Created Date</option>
      </select>
      <ul>
        {filteredUsers.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};
```

### Computed Properties

```javascript
const OrderSummary = ({ order }) => {
  const calculations = useMemo(() => {
    const subtotal = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = subtotal * 0.08;
    const shipping = subtotal > 50 ? 0 : 5.99;
    const discount = order.coupon
      ? subtotal * (order.coupon.discount / 100)
      : 0;
    const total = subtotal + tax + shipping - discount;

    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      shipping: shipping.toFixed(2),
      discount: discount.toFixed(2),
      total: total.toFixed(2),
      itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
    };
  }, [order.items, order.coupon]);

  return (
    <div className="order-summary">
      <h3>Order Summary ({calculations.itemCount} items)</h3>
      <div>Subtotal: ${calculations.subtotal}</div>
      <div>Tax: ${calculations.tax}</div>
      <div>Shipping: ${calculations.shipping}</div>
      {order.coupon && <div>Discount: -${calculations.discount}</div>}
      <div>
        <strong>Total: ${calculations.total}</strong>
      </div>
    </div>
  );
};
```

## Memoization with Context

```javascript
const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const [primaryColor, setPrimaryColor] = useState("#007bff");

  const themeValue = useMemo(() => {
    const colors = {
      light: {
        background: "#ffffff",
        text: "#333333",
        primary: primaryColor,
        secondary: "#6c757d",
      },
      dark: {
        background: "#333333",
        text: "#ffffff",
        primary: primaryColor,
        secondary: "#adb5bd",
      },
    };

    return {
      theme,
      colors: colors[theme],
      setTheme,
      setPrimaryColor,
      toggleTheme: () =>
        setTheme((prev) => (prev === "light" ? "dark" : "light")),
    };
  }, [theme, primaryColor]);

  return (
    <ThemeContext.Provider value={themeValue}>{children}</ThemeContext.Provider>
  );
};

const ThemedComponent = () => {
  const { colors, toggleTheme } = useContext(ThemeContext);

  const styles = useMemo(
    () => ({
      container: {
        backgroundColor: colors.background,
        color: colors.text,
        padding: "20px",
        borderRadius: "8px",
      },
      button: {
        backgroundColor: colors.primary,
        color: "white",
        border: "none",
        padding: "10px 20px",
        borderRadius: "4px",
      },
    }),
    [colors]
  );

  return (
    <div style={styles.container}>
      <h2>Themed Component</h2>
      <button style={styles.button} onClick={toggleTheme}>
        Toggle Theme
      </button>
    </div>
  );
};
```

## Performance Monitoring

```javascript
const PerformanceMonitor = ({ children, name }) => {
  const renderStart = performance.now();

  useEffect(() => {
    const renderTime = performance.now() - renderStart;
    console.log(`${name} render time: ${renderTime.toFixed(2)}ms`);
  });

  return children;
};

const MemoizedExpensiveComponent = memo(({ data }) => {
  const expensiveCalculation = useMemo(() => {
    const start = performance.now();

    const result = data.reduce((acc, item) => {
      for (let i = 0; i < 1000; i++) {
        acc += Math.sqrt(item.value * i);
      }
      return acc;
    }, 0);

    const end = performance.now();
    console.log(`Expensive calculation took ${(end - start).toFixed(2)}ms`);

    return result;
  }, [data]);

  return (
    <PerformanceMonitor name="ExpensiveComponent">
      <div>
        <h3>Expensive Calculation Result</h3>
        <p>{expensiveCalculation}</p>
      </div>
    </PerformanceMonitor>
  );
});
```

## Best Practices

### ✅ Do

```javascript
const GoodMemoization = ({ items, searchTerm }) => {
  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  const handleClick = useCallback((id) => {
    console.log(`Clicked item ${id}`);
  }, []);

  return (
    <ul>
      {filteredItems.map((item) => (
        <MemoizedListItem key={item.id} item={item} onClick={handleClick} />
      ))}
    </ul>
  );
};
```

### ❌ Don't

```javascript
const BadMemoization = ({ items, searchTerm }) => {
  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, []);

  const handleClick = useCallback(
    (id) => {
      console.log(`Clicked item ${id}`);
    },
    [Math.random()]
  );

  return (
    <ul>
      {filteredItems.map((item) => (
        <li key={item.id} onClick={() => handleClick(item.id)}>
          {item.name}
        </li>
      ))}
    </ul>
  );
};
```

## Common Patterns

### 1. Memoized Factory Functions

```javascript
const useItemProcessor = () => {
  return useCallback((items, processor) => {
    return items.map((item) => processor(item));
  }, []);
};

const ItemList = ({ items }) => {
  const processItems = useItemProcessor();

  const processedItems = useMemo(() => {
    return processItems(items, (item) => ({
      ...item,
      displayName: item.name.toUpperCase(),
      isExpensive: item.price > 100,
    }));
  }, [processItems, items]);

  return (
    <ul>
      {processedItems.map((item) => (
        <li key={item.id}>
          {item.displayName} - ${item.price}
          {item.isExpensive && <span> (Expensive)</span>}
        </li>
      ))}
    </ul>
  );
};
```

### 2. Memoized Custom Hooks

```javascript
const useFilteredAndSortedData = (data, filters, sortConfig) => {
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return item[key].toString().toLowerCase().includes(value.toLowerCase());
      });
    });
  }, [data, filters]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  return sortedData;
};
```

## TypeScript with Memoization

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user" | "guest";
}

interface UserFilters {
  search: string;
  role: string;
}

const UserComponent: React.FC<{ users: User[] }> = ({ users }) => {
  const [filters, setFilters] = useState<UserFilters>({ search: "", role: "" });

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase());
      const matchesRole = !filters.role || user.role === filters.role;
      return matchesSearch && matchesRole;
    });
  }, [users, filters]);

  const handleFilterChange = useCallback((newFilters: Partial<UserFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  return (
    <div>
      <input
        value={filters.search}
        onChange={(e) => handleFilterChange({ search: e.target.value })}
        placeholder="Search users..."
      />
      <select
        value={filters.role}
        onChange={(e) => handleFilterChange({ role: e.target.value })}
      >
        <option value="">All Roles</option>
        <option value="admin">Admin</option>
        <option value="user">User</option>
        <option value="guest">Guest</option>
      </select>
      <ul>
        {filteredUsers.map((user) => (
          <li key={user.id}>
            {user.name} - {user.role}
          </li>
        ))}
      </ul>
    </div>
  );
};
```

## Interview Questions

**Q: What's the difference between useMemo and useCallback?**
A: useMemo memoizes the result of a computation, while useCallback memoizes the function itself. Both help prevent unnecessary re-renders and computations.

**Q: When should you use memoization in React?**
A: Use memoization for expensive calculations, complex data transformations, event handlers passed to child components, and when you want to prevent unnecessary re-renders.

**Q: Can overusing useMemo hurt performance?**
A: Yes, memoization has overhead. Use it only for expensive operations or when preventing unnecessary re-renders of child components.

**Q: How do you debug memoization issues?**
A: Use React DevTools Profiler, add console.logs to dependency arrays, and verify that your dependencies are correctly specified.

## Common Mistakes

1. **Missing dependencies** - Always include all values used inside useMemo/useCallback
2. **Over-memoization** - Don't memoize simple calculations or primitive values
3. **Incorrect comparisons** - Be careful with object and array dependencies
4. **Stale closures** - Ensure callback dependencies are up to date

Effective memoization requires understanding when and how to optimize. Focus on actual performance bottlenecks rather than premature optimization.
