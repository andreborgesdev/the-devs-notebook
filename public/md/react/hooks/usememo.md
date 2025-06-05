# React useMemo Hook

## Overview

The `useMemo` hook memoizes the result of a computation and only recomputes when its dependencies change. It's used to optimize performance by avoiding expensive calculations on every render.

## Basic Syntax

```javascript
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

## Simple Example

```javascript
import React, { useState, useMemo } from "react";

function ExpensiveCalculation({ items, multiplier }) {
  const expensiveValue = useMemo(() => {
    console.log("Computing expensive value...");
    return items.reduce((sum, item) => sum + item * multiplier, 0);
  }, [items, multiplier]);

  return (
    <div>
      <p>Result: {expensiveValue}</p>
    </div>
  );
}

function App() {
  const [items] = useState([1, 2, 3, 4, 5]);
  const [multiplier, setMultiplier] = useState(1);
  const [count, setCount] = useState(0);

  return (
    <div>
      <ExpensiveCalculation items={items} multiplier={multiplier} />
      <button onClick={() => setMultiplier((m) => m + 1)}>
        Increase Multiplier
      </button>
      <button onClick={() => setCount((c) => c + 1)}>Count: {count}</button>
    </div>
  );
}
```

## Filtering and Sorting Large Lists

```javascript
import React, { useState, useMemo } from "react";

function UserList({ users }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const filteredAndSortedUsers = useMemo(() => {
    console.log("Filtering and sorting users...");

    let filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "email") {
        return a.email.localeCompare(b.email);
      } else if (sortBy === "age") {
        return a.age - b.age;
      }
      return 0;
    });
  }, [users, searchTerm, sortBy]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="name">Sort by Name</option>
        <option value="email">Sort by Email</option>
        <option value="age">Sort by Age</option>
      </select>

      <div>
        {filteredAndSortedUsers.map((user) => (
          <div key={user.id}>
            <h3>{user.name}</h3>
            <p>
              {user.email} - Age: {user.age}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Complex Object Creation

```javascript
import React, { useState, useMemo } from "react";

function ChartComponent({ data, config }) {
  const chartData = useMemo(() => {
    console.log("Processing chart data...");

    return {
      datasets: data.map((series) => ({
        ...series,
        backgroundColor: config.colors[series.name] || "#000",
        borderColor: config.colors[series.name] || "#000",
        data: series.values.map((value) => value * config.scale),
      })),
      labels: data[0]?.labels || [],
      options: {
        ...config.options,
        scales: {
          ...config.options?.scales,
          y: {
            ...config.options?.scales?.y,
            max:
              Math.max(...data.flatMap((s) => s.values)) * config.scale * 1.1,
          },
        },
      },
    };
  }, [data, config]);

  return (
    <div>
      <h3>Chart</h3>
      <pre>{JSON.stringify(chartData, null, 2)}</pre>
    </div>
  );
}
```

## Memoizing Props Objects

```javascript
import React, { useState, useMemo } from "react";

const ChildComponent = React.memo(({ user, config }) => {
  console.log("ChildComponent rendered");
  return (
    <div>
      <h3>{user.name}</h3>
      <p>Theme: {config.theme}</p>
    </div>
  );
});

function Parent() {
  const [count, setCount] = useState(0);
  const [userName, setUserName] = useState("John");
  const [theme, setTheme] = useState("light");

  const userObject = useMemo(
    () => ({
      name: userName,
      id: 1,
    }),
    [userName]
  );

  const configObject = useMemo(
    () => ({
      theme,
      settings: { enableAnimations: true },
    }),
    [theme]
  );

  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>Count: {count}</button>
      <button onClick={() => setUserName((name) => name + "!")}>
        Change Name
      </button>
      <button
        onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
      >
        Toggle Theme
      </button>

      <ChildComponent user={userObject} config={configObject} />
    </div>
  );
}
```

## Custom Hook with useMemo

```javascript
import { useMemo } from "react";

function useFilteredData(data, filters) {
  return useMemo(() => {
    if (!data || !filters) return [];

    return data.filter((item) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;

        if (typeof value === "string") {
          return item[key]
            ?.toString()
            .toLowerCase()
            .includes(value.toLowerCase());
        }

        if (
          typeof value === "object" &&
          value.min !== undefined &&
          value.max !== undefined
        ) {
          return item[key] >= value.min && item[key] <= value.max;
        }

        return item[key] === value;
      });
    });
  }, [data, filters]);
}

function ProductList({ products }) {
  const [filters, setFilters] = useState({
    name: "",
    category: "",
    price: { min: 0, max: 1000 },
  });

  const filteredProducts = useFilteredData(products, filters);

  return (
    <div>
      <input
        placeholder="Search by name"
        onChange={(e) => setFilters((f) => ({ ...f, name: e.target.value }))}
      />

      <select
        onChange={(e) =>
          setFilters((f) => ({ ...f, category: e.target.value }))
        }
      >
        <option value="">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>

      <div>
        Price Range: ${filters.price.min} - ${filters.price.max}
        <input
          type="range"
          min="0"
          max="1000"
          value={filters.price.max}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              price: { ...f.price, max: parseInt(e.target.value) },
            }))
          }
        />
      </div>

      {filteredProducts.map((product) => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>
            {product.category} - ${product.price}
          </p>
        </div>
      ))}
    </div>
  );
}
```

## Context Value Optimization

```javascript
import React, { createContext, useContext, useState, useMemo } from "react";

const AppContext = createContext();

function AppProvider({ children }) {
  const [user, setUser] = useState({ name: "John", id: 1 });
  const [settings, setSettings] = useState({ theme: "light" });

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      settings,
      setSettings,
      actions: {
        updateUserName: (name) => setUser((u) => ({ ...u, name })),
        toggleTheme: () =>
          setSettings((s) => ({
            ...s,
            theme: s.theme === "light" ? "dark" : "light",
          })),
      },
    }),
    [user, settings]
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

function UserProfile() {
  const { user, actions } = useContext(AppContext);

  return (
    <div>
      <h2>{user.name}</h2>
      <button onClick={() => actions.updateUserName("Jane")}>
        Change Name
      </button>
    </div>
  );
}
```

## Performance Comparison

```javascript
import React, { useState, useMemo } from "react";

function PerformanceDemo() {
  const [count, setCount] = useState(0);
  const [items] = useState(Array.from({ length: 10000 }, (_, i) => i));

  const expensiveCalculationWithMemo = useMemo(() => {
    console.log("With useMemo: Computing...");
    const start = performance.now();
    const result = items.reduce((sum, item) => sum + Math.sqrt(item), 0);
    const end = performance.now();
    console.log(`With useMemo took: ${end - start}ms`);
    return result;
  }, [items]);

  const expensiveCalculationWithoutMemo = (() => {
    console.log("Without useMemo: Computing...");
    const start = performance.now();
    const result = items.reduce((sum, item) => sum + Math.sqrt(item), 0);
    const end = performance.now();
    console.log(`Without useMemo took: ${end - start}ms`);
    return result;
  })();

  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>Count: {count}</button>
      <p>With Memo: {expensiveCalculationWithMemo}</p>
      <p>Without Memo: {expensiveCalculationWithoutMemo}</p>
    </div>
  );
}
```

## TypeScript Usage

```typescript
import React, { useMemo } from "react";

interface User {
  id: number;
  name: string;
  age: number;
}

interface FilterOptions {
  minAge?: number;
  nameFilter?: string;
}

function UserComponent({
  users,
  filters,
}: {
  users: User[];
  filters: FilterOptions;
}) {
  const filteredUsers = useMemo<User[]>(() => {
    return users.filter((user) => {
      if (filters.minAge && user.age < filters.minAge) return false;
      if (filters.nameFilter && !user.name.includes(filters.nameFilter))
        return false;
      return true;
    });
  }, [users, filters]);

  const userStats = useMemo(
    () => ({
      total: filteredUsers.length,
      averageAge:
        filteredUsers.reduce((sum, user) => sum + user.age, 0) /
          filteredUsers.length || 0,
      names: filteredUsers.map((user) => user.name),
    }),
    [filteredUsers]
  );

  return (
    <div>
      <p>Total Users: {userStats.total}</p>
      <p>Average Age: {userStats.averageAge.toFixed(1)}</p>
    </div>
  );
}
```

## When to Use useMemo

| Use useMemo                   | Don't use useMemo              |
| ----------------------------- | ------------------------------ |
| Expensive calculations        | Simple calculations            |
| Complex object creation       | Primitive values               |
| Large list filtering/sorting  | Small arrays                   |
| Props for memoized components | Every computation              |
| Context values                | Basic string/number operations |

## Interview Questions

### Q1: What is the purpose of useMemo?

**Answer:** useMemo optimizes performance by memoizing expensive computations. It only recalculates when dependencies change, preventing unnecessary work on every render.

### Q2: When should you use useMemo?

**Answer:** Use useMemo for:

- Expensive calculations or computations
- Creating objects/arrays that are passed to memoized components
- Complex filtering or sorting operations
- Context values that contain objects
- When profiling shows performance issues

### Q3: What's the difference between useMemo and useCallback?

**Answer:**

- **useMemo**: Memoizes the result of a computation (values)
- **useCallback**: Memoizes a function definition
- useMemo returns the computed value, useCallback returns the function

### Q4: Can useMemo cause memory leaks?

**Answer:** useMemo can potentially cause memory issues if:

- Dependencies array includes objects that change frequently
- Memoized values are large and not garbage collected
- Overusing memoization for simple computations
- Dependencies include functions or objects that change on every render

## Best Practices

1. **Profile first** - Only optimize when there's a proven performance issue
2. **Use with expensive operations** - Don't memoize simple calculations
3. **Stable dependencies** - Ensure dependencies don't change unnecessarily
4. **Memoize context values** - Prevent unnecessary re-renders of consumers
5. **Combine with React.memo** - Use together for maximum optimization
6. **Watch dependency arrays** - Include all used variables in dependencies
7. **Consider alternatives** - Sometimes restructuring components is better

## Common Mistakes

1. **Overusing useMemo** - Not every calculation needs memoization
2. **Unstable dependencies** - Objects/functions that change on every render
3. **Missing dependencies** - Can lead to stale closures and bugs
4. **Memoizing primitives** - Unnecessary for strings, numbers, booleans
5. **Creating objects in dependency array** - Defeats the purpose of memoization
6. **Not profiling** - Optimizing without measuring actual performance impact

## Performance Considerations

- useMemo has overhead - only use when benefits outweigh costs
- Memory usage increases with memoized values
- Dependency comparison happens on every render
- Best for computations that take more time than dependency checking
- Consider React.memo for component-level optimization
- Use React DevTools Profiler to measure impact
