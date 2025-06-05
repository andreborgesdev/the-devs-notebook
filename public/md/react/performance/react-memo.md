# React.memo Performance Optimization

## Overview

React.memo is a higher-order component that provides memoization for functional components. It prevents unnecessary re-renders by only updating when props have changed, similar to how PureComponent works for class components.

## Basic Usage

```javascript
import React, { memo } from "react";

const ExpensiveComponent = memo(({ name, age }) => {
  console.log("Component rendered");

  return (
    <div>
      <h3>{name}</h3>
      <p>Age: {age}</p>
    </div>
  );
});
```

## Custom Comparison Function

```javascript
const UserCard = memo(
  ({ user, settings }) => {
    return (
      <div>
        <h3>{user.name}</h3>
        <p>{user.email}</p>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.user.id === nextProps.user.id &&
      prevProps.user.name === nextProps.user.name &&
      prevProps.user.email === nextProps.user.email
    );
  }
);
```

## Practical Example

```javascript
import React, { useState, memo, useCallback } from "react";

const TodoItem = memo(({ todo, onToggle, onDelete }) => {
  console.log(`TodoItem ${todo.id} rendered`);

  return (
    <div className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span>{todo.text}</span>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </div>
  );
});

const TodoList = () => {
  const [todos, setTodos] = useState([
    { id: 1, text: "Learn React", completed: false },
    { id: 2, text: "Build a project", completed: true },
  ]);

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
    <div>
      {todos.map((todo) => (
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

## With TypeScript

```typescript
interface UserProps {
  user: {
    id: number;
    name: string;
    email: string;
  };
  isSelected: boolean;
}

const UserComponent = memo<UserProps>(
  ({ user, isSelected }) => {
    return (
      <div className={`user ${isSelected ? "selected" : ""}`}>
        <h3>{user.name}</h3>
        <p>{user.email}</p>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.user.id === nextProps.user.id &&
      prevProps.isSelected === nextProps.isSelected
    );
  }
);
```

## Performance Comparison

| Scenario                               | Without React.memo | With React.memo    |
| -------------------------------------- | ------------------ | ------------------ |
| Parent re-renders with same props      | Child re-renders   | Child skips render |
| Parent re-renders with different props | Child re-renders   | Child re-renders   |
| Sibling component updates              | Child re-renders   | Child skips render |
| Grandparent updates                    | Child re-renders   | Child skips render |

## Advanced Patterns

### Memo with Complex Objects

```javascript
const ComplexComponent = memo(
  ({ config, data }) => {
    return (
      <div>
        <h3>{config.title}</h3>
        <p>{data.description}</p>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      JSON.stringify(prevProps.config) === JSON.stringify(nextProps.config) &&
      JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data)
    );
  }
);
```

### Memo with Refs

```javascript
const ComponentWithRef = memo(
  forwardRef(({ value, onChange }, ref) => {
    return (
      <input
        ref={ref}
        value={value}
        onChange={onChange}
        placeholder="Enter text"
      />
    );
  })
);
```

## Best Practices

### ✅ Do

```javascript
const ListItem = memo(({ item, onSelect }) => {
  return <li onClick={() => onSelect(item.id)}>{item.name}</li>;
});

const ExpensiveList = memo(({ items, selectedId }) => {
  const handleSelect = useCallback((id) => {
    // Handle selection
  }, []);

  return (
    <ul>
      {items.map((item) => (
        <ListItem key={item.id} item={item} onSelect={handleSelect} />
      ))}
    </ul>
  );
});
```

### ❌ Don't

```javascript
const BadExample = memo(({ items }) => {
  return (
    <ul>
      {items.map((item) => (
        <li
          key={item.id}
          onClick={() => console.log(item.id)}
          style={{ color: Math.random() > 0.5 ? "red" : "blue" }}
        >
          {item.name}
        </li>
      ))}
    </ul>
  );
});
```

## Common Pitfalls

### 1. Inline Objects and Functions

```javascript
const Parent = () => {
  const [count, setCount] = useState(0);

  return (
    <Child config={{ theme: "dark" }} onClick={() => console.log("clicked")} />
  );
};
```

**Solution:**

```javascript
const Parent = () => {
  const [count, setCount] = useState(0);

  const config = useMemo(() => ({ theme: "dark" }), []);
  const handleClick = useCallback(() => console.log("clicked"), []);

  return <Child config={config} onClick={handleClick} />;
};
```

### 2. Deep Object Comparison

```javascript
const DeepComponent = memo(
  ({ user }) => {
    return <div>{user.profile.preferences.theme}</div>;
  },
  (prevProps, nextProps) => {
    return _.isEqual(prevProps.user, nextProps.user);
  }
);
```

## Performance Monitoring

```javascript
const MonitoredComponent = memo(({ data }) => {
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    console.log(`Component rendered ${renderCount.current} times`);
  });

  return <div>{data.title}</div>;
});
```

## Interview Questions

**Q: When should you use React.memo?**
A: Use React.memo for components that render frequently with the same props, especially leaf components in large lists or components with expensive render logic.

**Q: What's the difference between React.memo and useMemo?**
A: React.memo memoizes entire components, while useMemo memoizes values. React.memo prevents re-renders, useMemo prevents expensive calculations.

**Q: Can React.memo make your app slower?**
A: Yes, if overused on components that frequently receive different props, the comparison overhead can outweigh the benefits.

**Q: How does React.memo handle children prop?**
A: React.memo performs shallow comparison, so passing different children will trigger re-renders unless you provide a custom comparison function.

## Common Mistakes

1. **Overusing memo** - Don't memo every component
2. **Passing new objects/functions** - Use useCallback and useMemo
3. **Incorrect comparison logic** - Test your custom comparison functions
4. **Ignoring children changes** - Account for children in comparisons

## Performance Testing

```javascript
const PerformanceTest = () => {
  const [counter, setCounter] = useState(0);
  const [data] = useState(
    Array.from({ length: 1000 }, (_, i) => ({ id: i, name: `Item ${i}` }))
  );

  return (
    <div>
      <button onClick={() => setCounter((c) => c + 1)}>
        Counter: {counter}
      </button>
      {data.map((item) => (
        <MemoizedItem key={item.id} item={item} />
      ))}
    </div>
  );
};

const MemoizedItem = memo(({ item }) => {
  console.log(`Rendering item ${item.id}`);
  return <div>{item.name}</div>;
});
```

## Real-world Example

```javascript
import React, { memo, useState, useCallback, useMemo } from "react";

const ProductCard = memo(
  ({ product, onAddToCart, isInCart }) => {
    const discountedPrice = useMemo(() => {
      return product.price * (1 - product.discount);
    }, [product.price, product.discount]);

    return (
      <div className="product-card">
        <img src={product.image} alt={product.name} />
        <h3>{product.name}</h3>
        <p className="price">
          {product.discount > 0 && (
            <span className="original">${product.price}</span>
          )}
          <span className="current">${discountedPrice.toFixed(2)}</span>
        </p>
        <button onClick={() => onAddToCart(product.id)} disabled={isInCart}>
          {isInCart ? "In Cart" : "Add to Cart"}
        </button>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.product.id === nextProps.product.id &&
      prevProps.product.price === nextProps.product.price &&
      prevProps.product.discount === nextProps.product.discount &&
      prevProps.isInCart === nextProps.isInCart
    );
  }
);

const ProductList = ({ products, cartItems }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const handleAddToCart = useCallback((productId) => {
    console.log(`Adding product ${productId} to cart`);
  }, []);

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search products..."
      />
      <div className="product-grid">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            isInCart={cartItems.includes(product.id)}
          />
        ))}
      </div>
    </div>
  );
};
```

React.memo is a powerful optimization tool when used correctly. Focus on components that render frequently and have stable props for the best performance benefits.
