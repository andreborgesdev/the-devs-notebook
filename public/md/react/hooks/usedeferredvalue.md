# useDeferredValue Hook

## Overview

The `useDeferredValue` hook allows you to defer updates to non-critical parts of the UI, keeping the interface responsive during expensive operations. It works by delaying the propagation of a value.

## Basic Usage

```tsx
import { useDeferredValue, useState } from "react";

function SearchComponent() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />

      {/* Updates immediately */}
      <div>Current input: {query}</div>

      {/* Updates with lower priority */}
      <ExpensiveSearchResults query={deferredQuery} />
    </div>
  );
}

function ExpensiveSearchResults({ query }) {
  // This will use the deferred value, allowing input to stay responsive
  const results = useMemo(() => {
    return performExpensiveSearch(query);
  }, [query]);

  return (
    <ul>
      {results.map((result) => (
        <li key={result.id}>{result.name}</li>
      ))}
    </ul>
  );
}
```

## Real-World Example

```tsx
function ProductCatalog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 1000]);

  // Defer expensive filtering operations
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const deferredCategory = useDeferredValue(category);
  const deferredPriceRange = useDeferredValue(priceRange);

  return (
    <div>
      <div className="filters">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products..."
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
        </select>

        <PriceRangeSlider value={priceRange} onChange={setPriceRange} />
      </div>

      {/* Shows immediate feedback */}
      <div className="search-info">Searching for: "{searchTerm}"</div>

      {/* Uses deferred values for expensive filtering */}
      <ProductList
        searchTerm={deferredSearchTerm}
        category={deferredCategory}
        priceRange={deferredPriceRange}
      />
    </div>
  );
}
```

## Performance Optimization

```tsx
function DataVisualization() {
  const [selectedData, setSelectedData] = useState("sales");
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [chartType, setChartType] = useState("line");

  // Defer expensive chart rendering
  const deferredData = useDeferredValue(selectedData);
  const deferredDateRange = useDeferredValue(dateRange);
  const deferredChartType = useDeferredValue(chartType);

  return (
    <div>
      <div className="controls">
        <select
          value={selectedData}
          onChange={(e) => setSelectedData(e.target.value)}
        >
          <option value="sales">Sales Data</option>
          <option value="users">User Analytics</option>
          <option value="revenue">Revenue</option>
        </select>

        <DateRangePicker value={dateRange} onChange={setDateRange} />

        <ChartTypeSelector value={chartType} onChange={setChartType} />
      </div>

      {/* Expensive chart component uses deferred values */}
      <ExpensiveChart
        data={deferredData}
        dateRange={deferredDateRange}
        type={deferredChartType}
      />
    </div>
  );
}
```

## Custom Hook Pattern

```tsx
function useDeferredSearch<T>(
  items: T[],
  searchTerm: string,
  searchFn: (item: T, term: string) => boolean
) {
  const deferredSearchTerm = useDeferredValue(searchTerm);

  const filteredItems = useMemo(() => {
    if (!deferredSearchTerm) return items;
    return items.filter((item) => searchFn(item, deferredSearchTerm));
  }, [items, deferredSearchTerm, searchFn]);

  // Return both immediate term for UI and filtered results
  return {
    searchTerm, // immediate value for input
    deferredSearchTerm, // deferred for computation
    filteredItems,
    isSearching: searchTerm !== deferredSearchTerm,
  };
}

// Usage
function UserDirectory() {
  const [searchTerm, setSearchTerm] = useState("");
  const users = useUsers(); // Some data source

  const {
    searchTerm: currentSearch,
    filteredItems: filteredUsers,
    isSearching,
  } = useDeferredSearch(users, searchTerm, (user, term) =>
    user.name.toLowerCase().includes(term.toLowerCase())
  );

  return (
    <div>
      <input
        value={currentSearch}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search users..."
      />

      {isSearching && <div>Filtering...</div>}

      <UserList users={filteredUsers} />
    </div>
  );
}
```

## Integration with useTransition

```tsx
function CombinedOptimization() {
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    startTransition(() => {
      const searchResults = performExpensiveSearch(deferredQuery);
      setResults(searchResults);
    });
  }, [deferredQuery]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />

      {isPending && <div>Searching...</div>}

      <div className={isPending ? "loading" : ""}>
        {results.map((result) => (
          <ResultItem key={result.id} item={result} />
        ))}
      </div>
    </div>
  );
}
```

## Advanced Patterns

### Debounced Deferred Value

```tsx
function useDebounceDeferred<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const deferredValue = useDeferredValue(debouncedValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return deferredValue;
}

function SmartSearch() {
  const [query, setQuery] = useState("");
  const debouncedDeferredQuery = useDebounceDeferred(query, 300);

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <SearchResults query={debouncedDeferredQuery} />
    </div>
  );
}
```

### Conditional Deferring

```tsx
function ConditionalDeferredValue({ enabled, value }) {
  const deferredValue = useDeferredValue(value);

  // Only use deferred value when enabled
  return enabled ? deferredValue : value;
}
```

## Best Practices

### Use useDeferredValue For:

- Search results that require expensive filtering
- Charts and visualizations with heavy computations
- Large lists that need sorting/filtering
- Any UI that can show stale data temporarily

### Don't Use For:

- Critical UI updates that must be immediate
- Simple state changes
- Values that users expect to update instantly

## Key Benefits

- **Responsive UI**: Keeps critical interactions fast
- **Automatic**: No manual debouncing needed
- **Smart**: React decides when to update based on priority
- **Interruptible**: Updates can be interrupted by urgent changes

## Common Patterns

```tsx
// Loading indicator with deferred values
function DeferredLoadingExample() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />

      <div className={isStale ? "stale" : ""}>
        {isStale && <div>Updating...</div>}
        <SearchResults query={deferredQuery} />
      </div>
    </div>
  );
}
```

The `useDeferredValue` hook is perfect for optimizing expensive UI updates while maintaining a responsive user experience.
