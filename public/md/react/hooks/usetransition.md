# useTransition Hook

## Overview

The `useTransition` hook allows you to mark state updates as non-urgent, keeping the UI responsive during expensive operations. It's part of React's concurrent features.

## Basic Usage

```tsx
import { useTransition, useState } from "react";

function SearchComponent() {
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = (value: string) => {
    setQuery(value); // Urgent update - immediate

    startTransition(() => {
      // Non-urgent update - can be interrupted
      setResults(performExpensiveSearch(value));
    });
  };

  return (
    <div>
      <input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
      />

      {isPending && <div>Searching...</div>}

      <ul>
        {results.map((result) => (
          <li key={result.id}>{result.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Real-World Example

```tsx
function TabComponent() {
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState("posts");
  const [content, setContent] = useState([]);

  const switchTab = (tab: string) => {
    setActiveTab(tab); // Immediate UI update

    startTransition(() => {
      // Heavy computation in background
      setContent(loadTabContent(tab));
    });
  };

  return (
    <div>
      <div className="tabs">
        {["posts", "about", "contact"].map((tab) => (
          <button
            key={tab}
            onClick={() => switchTab(tab)}
            className={activeTab === tab ? "active" : ""}
            disabled={isPending}
          >
            {tab}
            {isPending && activeTab === tab && " (Loading...)"}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {isPending ? (
          <div>Loading content...</div>
        ) : (
          <TabContent data={content} />
        )}
      </div>
    </div>
  );
}
```

## Performance Optimization

```tsx
function DataTable() {
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [data, setData] = useState(initialData);

  const updateTable = (newFilter: string, newSort: string) => {
    // Update UI immediately
    setFilter(newFilter);
    setSortBy(newSort);

    // Defer expensive computation
    startTransition(() => {
      const filtered = initialData.filter((item) =>
        item.name.toLowerCase().includes(newFilter.toLowerCase())
      );
      const sorted = [...filtered].sort((a, b) =>
        a[newSort].localeCompare(b[newSort])
      );
      setData(sorted);
    });
  };

  return (
    <div>
      <div className="controls">
        <input
          value={filter}
          onChange={(e) => updateTable(e.target.value, sortBy)}
          placeholder="Filter..."
        />

        <select
          value={sortBy}
          onChange={(e) => updateTable(filter, e.target.value)}
        >
          <option value="name">Name</option>
          <option value="date">Date</option>
          <option value="status">Status</option>
        </select>
      </div>

      {isPending && <div className="loading-indicator">Updating table...</div>}

      <table className={isPending ? "loading" : ""}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.date}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

## Custom Hook Pattern

```tsx
function useAsyncTransition<T>(asyncFunction: () => Promise<T>) {
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(() => {
    startTransition(async () => {
      try {
        setError(null);
        const result = await asyncFunction();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      }
    });
  }, [asyncFunction]);

  return { data, error, isPending, execute };
}

// Usage
function UserProfile({ userId }: { userId: string }) {
  const { data, error, isPending, execute } = useAsyncTransition(() =>
    fetchUser(userId)
  );

  useEffect(() => {
    execute();
  }, [userId, execute]);

  if (error) return <div>Error: {error.message}</div>;
  if (isPending) return <div>Loading user...</div>;
  if (!data) return <div>No user found</div>;

  return <div>Welcome, {data.name}!</div>;
}
```

## Integration with useDeferredValue

```tsx
function CombinedExample() {
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const handleChange = (value: string) => {
    setQuery(value); // Immediate update

    startTransition(() => {
      // Deferred expensive operations
      performSearch(deferredQuery);
    });
  };

  return (
    <div>
      <input value={query} onChange={(e) => handleChange(e.target.value)} />
      {isPending && <Spinner />}
      <SearchResults query={deferredQuery} />
    </div>
  );
}
```

## Best Practices

### Do Use Transitions For:

- Filtering and sorting large lists
- Tab switching with heavy content
- Search with expensive operations
- Navigation with data loading

### Don't Use Transitions For:

- Urgent updates (typing, hovering, clicking)
- Simple state changes
- Updates that users expect immediately

## Common Patterns

```tsx
// Loading states with transitions
function SmartLoadingComponent() {
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState(null);

  const loadData = () => {
    startTransition(async () => {
      const result = await fetchData();
      setData(result);
    });
  };

  return (
    <div>
      <button onClick={loadData} disabled={isPending}>
        {isPending ? "Loading..." : "Load Data"}
      </button>

      {data && <DataDisplay data={data} />}
    </div>
  );
}
```

## Key Benefits

- **Non-blocking**: Keeps UI responsive during heavy operations
- **Interruptible**: Can be interrupted by more urgent updates
- **Better UX**: Provides loading states for long-running operations
- **Performance**: Prevents UI freezing during expensive computations

The `useTransition` hook is essential for building performant React applications that handle expensive operations without blocking the user interface.
