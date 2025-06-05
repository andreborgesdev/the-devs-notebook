# Query Parameters in React

Query parameters (also known as search parameters or URL parameters) are key-value pairs that appear after the `?` in a URL. They provide a way to pass additional information to a route without changing the route structure itself, making them perfect for filtering, pagination, search, and maintaining application state in the URL.

## Basic Query Parameter Handling

### Using useSearchParams Hook

```tsx
import { useSearchParams, useNavigate } from "react-router-dom";

const ProductList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const category = searchParams.get("category") || "all";
  const sortBy = searchParams.get("sort") || "name";
  const search = searchParams.get("search") || "";

  const updateQueryParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  return (
    <div>
      <SearchInput
        value={search}
        onChange={(value) => updateQueryParam("search", value)}
      />

      <CategoryFilter
        value={category}
        onChange={(value) => updateQueryParam("category", value)}
      />

      <SortSelector
        value={sortBy}
        onChange={(value) => updateQueryParam("sort", value)}
      />

      <ProductGrid
        page={currentPage}
        category={category}
        sortBy={sortBy}
        search={search}
      />

      <Pagination
        currentPage={currentPage}
        onPageChange={(page) => updateQueryParam("page", page.toString())}
      />
    </div>
  );
};
```

### URL State Management Hook

```tsx
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

interface QueryState {
  [key: string]: string | number | boolean | string[] | undefined;
}

interface UseURLStateOptions {
  defaultValues?: QueryState;
  serialize?: (value: any) => string;
  deserialize?: (value: string, key: string) => any;
}

export const useURLState = <T extends QueryState>(
  options: UseURLStateOptions = {}
): [T, (updates: Partial<T>) => void, (key: keyof T) => void] => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { defaultValues = {}, serialize, deserialize } = options;

  const state = useMemo(() => {
    const result = { ...defaultValues } as T;

    searchParams.forEach((value, key) => {
      if (deserialize) {
        result[key as keyof T] = deserialize(value, key);
      } else {
        // Basic type inference
        if (value === "true" || value === "false") {
          result[key as keyof T] = (value === "true") as any;
        } else if (!isNaN(Number(value)) && value !== "") {
          result[key as keyof T] = Number(value) as any;
        } else if (value.includes(",")) {
          result[key as keyof T] = value.split(",") as any;
        } else {
          result[key as keyof T] = value as any;
        }
      }
    });

    return result;
  }, [searchParams, defaultValues, deserialize]);

  const updateState = useCallback(
    (updates: Partial<T>) => {
      const newParams = new URLSearchParams(searchParams);

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          newParams.delete(key);
        } else {
          const serializedValue = serialize
            ? serialize(value)
            : Array.isArray(value)
            ? value.join(",")
            : String(value);
          newParams.set(key, serializedValue);
        }
      });

      setSearchParams(newParams);
    },
    [searchParams, setSearchParams, serialize]
  );

  const removeParam = useCallback(
    (key: keyof T) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete(key as string);
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  return [state, updateState, removeParam];
};
```

## Advanced Query Parameter Patterns

### Complex Filter Management

```tsx
interface FilterState {
  search: string;
  category: string[];
  priceRange: [number, number];
  rating: number;
  inStock: boolean;
  sortBy: string;
  sortOrder: "asc" | "desc";
  page: number;
  pageSize: number;
}

const useProductFilters = () => {
  const [filters, updateFilters, removeFilter] = useURLState<FilterState>({
    defaultValues: {
      search: "",
      category: [],
      priceRange: [0, 1000],
      rating: 0,
      inStock: false,
      sortBy: "name",
      sortOrder: "asc",
      page: 1,
      pageSize: 20,
    },
    serialize: (value) => {
      if (Array.isArray(value)) {
        return value.join(",");
      }
      if (typeof value === "object") {
        return JSON.stringify(value);
      }
      return String(value);
    },
    deserialize: (value, key) => {
      switch (key) {
        case "category":
          return value ? value.split(",") : [];
        case "priceRange":
          return value ? JSON.parse(value) : [0, 1000];
        case "inStock":
          return value === "true";
        case "rating":
        case "page":
        case "pageSize":
          return parseInt(value, 10) || 0;
        default:
          return value;
      }
    },
  });

  const resetFilters = useCallback(() => {
    updateFilters({
      search: "",
      category: [],
      priceRange: [0, 1000],
      rating: 0,
      inStock: false,
      page: 1,
    });
  }, [updateFilters]);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.search !== "" ||
      filters.category.length > 0 ||
      filters.priceRange[0] > 0 ||
      filters.priceRange[1] < 1000 ||
      filters.rating > 0 ||
      filters.inStock
    );
  }, [filters]);

  return {
    filters,
    updateFilters,
    removeFilter,
    resetFilters,
    hasActiveFilters,
  };
};

const ProductFilters: React.FC = () => {
  const { filters, updateFilters, resetFilters, hasActiveFilters } =
    useProductFilters();

  return (
    <div className="product-filters">
      <div className="filter-header">
        <h3>Filters</h3>
        {hasActiveFilters && (
          <button onClick={resetFilters} className="reset-filters">
            Clear All
          </button>
        )}
      </div>

      <SearchInput
        value={filters.search}
        onChange={(search) => updateFilters({ search, page: 1 })}
        placeholder="Search products..."
      />

      <CategoryFilter
        selected={filters.category}
        onChange={(category) => updateFilters({ category, page: 1 })}
      />

      <PriceRangeSlider
        value={filters.priceRange}
        onChange={(priceRange) => updateFilters({ priceRange, page: 1 })}
        min={0}
        max={1000}
      />

      <RatingFilter
        value={filters.rating}
        onChange={(rating) => updateFilters({ rating, page: 1 })}
      />

      <Checkbox
        checked={filters.inStock}
        onChange={(inStock) => updateFilters({ inStock, page: 1 })}
        label="In Stock Only"
      />

      <SortControls
        sortBy={filters.sortBy}
        sortOrder={filters.sortOrder}
        onSortChange={(sortBy, sortOrder) =>
          updateFilters({ sortBy, sortOrder, page: 1 })
        }
      />
    </div>
  );
};
```

### Synchronized State Management

```tsx
interface TableState {
  page: number;
  pageSize: number;
  sortColumn: string;
  sortDirection: "asc" | "desc";
  filters: Record<string, string>;
  selectedRows: string[];
}

const useTableState = () => {
  const [urlState, updateURLState] = useURLState<TableState>({
    defaultValues: {
      page: 1,
      pageSize: 10,
      sortColumn: "id",
      sortDirection: "asc",
      filters: {},
      selectedRows: [],
    },
  });

  const [localState, setLocalState] = useState({
    isLoading: false,
    data: [],
    totalCount: 0,
  });

  // Sync URL state changes with data fetching
  useEffect(() => {
    const fetchData = async () => {
      setLocalState((prev) => ({ ...prev, isLoading: true }));

      try {
        const response = await fetch(
          "/api/data?" +
            new URLSearchParams({
              page: String(urlState.page),
              pageSize: String(urlState.pageSize),
              sortColumn: urlState.sortColumn,
              sortDirection: urlState.sortDirection,
              ...urlState.filters,
            })
        );

        const result = await response.json();

        setLocalState((prev) => ({
          ...prev,
          data: result.data,
          totalCount: result.total,
          isLoading: false,
        }));
      } catch (error) {
        setLocalState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    fetchData();
  }, [urlState]);

  const updateTableState = useCallback(
    (updates: Partial<TableState>) => {
      // Reset to first page when filters or sorting change
      if (updates.filters || updates.sortColumn || updates.sortDirection) {
        updates.page = 1;
      }

      updateURLState(updates);
    },
    [updateURLState]
  );

  return {
    ...urlState,
    ...localState,
    updateTableState,
  };
};
```

## Form State Synchronization

### Form with URL State

```tsx
interface SearchFormState {
  query: string;
  type: "all" | "posts" | "users" | "products";
  dateRange: "all" | "today" | "week" | "month" | "year";
  tags: string[];
}

const SearchForm: React.FC = () => {
  const [urlState, updateURLState] = useURLState<SearchFormState>({
    defaultValues: {
      query: "",
      type: "all",
      dateRange: "all",
      tags: [],
    },
  });

  const [formData, setFormData] = useState(urlState);
  const [isDirty, setIsDirty] = useState(false);

  // Sync URL state to form when URL changes (e.g., back/forward navigation)
  useEffect(() => {
    setFormData(urlState);
    setIsDirty(false);
  }, [urlState]);

  // Track form changes
  useEffect(() => {
    const hasChanges = Object.keys(formData).some(
      (key) =>
        formData[key as keyof SearchFormState] !==
        urlState[key as keyof SearchFormState]
    );
    setIsDirty(hasChanges);
  }, [formData, urlState]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateURLState(formData);
    setIsDirty(false);
  };

  const handleReset = () => {
    const defaultState = {
      query: "",
      type: "all" as const,
      dateRange: "all" as const,
      tags: [],
    };
    setFormData(defaultState);
    updateURLState(defaultState);
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <input
        type="text"
        value={formData.query}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, query: e.target.value }))
        }
        placeholder="Search..."
        className="search-input"
      />

      <select
        value={formData.type}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            type: e.target.value as SearchFormState["type"],
          }))
        }
      >
        <option value="all">All Types</option>
        <option value="posts">Posts</option>
        <option value="users">Users</option>
        <option value="products">Products</option>
      </select>

      <select
        value={formData.dateRange}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            dateRange: e.target.value as SearchFormState["dateRange"],
          }))
        }
      >
        <option value="all">All Time</option>
        <option value="today">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
        <option value="year">This Year</option>
      </select>

      <TagSelector
        selected={formData.tags}
        onChange={(tags) => setFormData((prev) => ({ ...prev, tags }))}
      />

      <div className="form-actions">
        <button type="submit" disabled={!isDirty}>
          Search
        </button>
        <button type="button" onClick={handleReset}>
          Reset
        </button>
      </div>
    </form>
  );
};
```

### Auto-save Form State

```tsx
const useAutoSaveForm = <T extends Record<string, any>>(
  initialData: T,
  saveDelay: number = 1000
) => {
  const [urlState, updateURLState] = useURLState<T>({
    defaultValues: initialData,
  });

  const [formData, setFormData] = useState(urlState);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // Auto-save to URL after delay
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      updateURLState(formData);
    }, saveDelay);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [formData, updateURLState, saveDelay]);

  // Sync URL changes back to form (browser navigation)
  useEffect(() => {
    setFormData(urlState);
  }, [urlState]);

  return [formData, setFormData] as const;
};

const DraftEditor: React.FC = () => {
  const [formData, setFormData] = useAutoSaveForm(
    {
      title: "",
      content: "",
      tags: [],
      category: "",
      status: "draft",
    },
    2000
  );

  return (
    <div className="draft-editor">
      <input
        type="text"
        value={formData.title}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, title: e.target.value }))
        }
        placeholder="Post title..."
      />

      <textarea
        value={formData.content}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, content: e.target.value }))
        }
        placeholder="Write your post..."
        rows={20}
      />

      <div className="metadata">
        <select
          value={formData.category}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, category: e.target.value }))
          }
        >
          <option value="">Select Category</option>
          <option value="tech">Technology</option>
          <option value="design">Design</option>
          <option value="business">Business</option>
        </select>

        <TagInput
          value={formData.tags}
          onChange={(tags) => setFormData((prev) => ({ ...prev, tags }))}
        />
      </div>
    </div>
  );
};
```

## Pagination and Data Loading

### Cursor-based Pagination

```tsx
interface PaginationState {
  cursor?: string;
  limit: number;
  hasMore: boolean;
}

const useInfiniteScroll = <T,>(
  fetcher: (
    cursor?: string,
    limit?: number
  ) => Promise<{
    data: T[];
    nextCursor?: string;
    hasMore: boolean;
  }>
) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const cursor = searchParams.get("cursor") || undefined;
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  const loadMore = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const result = await fetcher(cursor, limit);

      if (cursor) {
        setData((prev) => [...prev, ...result.data]);
      } else {
        setData(result.data);
      }

      if (result.nextCursor) {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("cursor", result.nextCursor);
        setSearchParams(newParams);
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [cursor, limit, loading, fetcher, searchParams, setSearchParams]);

  const reset = useCallback(() => {
    setData([]);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("cursor");
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (!cursor) {
      loadMore();
    }
  }, [cursor, loadMore]);

  return {
    data,
    loading,
    error,
    loadMore,
    reset,
    hasMore: !!cursor,
  };
};
```

### Smart Pagination Component

```tsx
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
}

const SmartPagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  maxVisiblePages = 5,
}) => {
  const [searchParams] = useSearchParams();

  const getVisiblePages = useMemo(() => {
    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, totalPages, maxVisiblePages]);

  const createPageURL = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    return `?${params.toString()}`;
  };

  return (
    <nav className="pagination" aria-label="Pagination">
      {showFirstLast && currentPage > 1 && (
        <Link to={createPageURL(1)} className="pagination-link">
          First
        </Link>
      )}

      {showPrevNext && currentPage > 1 && (
        <Link to={createPageURL(currentPage - 1)} className="pagination-link">
          Previous
        </Link>
      )}

      {getVisiblePages.map((page) => (
        <Link
          key={page}
          to={createPageURL(page)}
          className={`pagination-link ${page === currentPage ? "active" : ""}`}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </Link>
      ))}

      {showPrevNext && currentPage < totalPages && (
        <Link to={createPageURL(currentPage + 1)} className="pagination-link">
          Next
        </Link>
      )}

      {showFirstLast && currentPage < totalPages && (
        <Link to={createPageURL(totalPages)} className="pagination-link">
          Last
        </Link>
      )}
    </nav>
  );
};
```

## Search and Filtering

### Debounced Search

```tsx
const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const SearchableList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState(searchParams.get('search') || '');

  const debouncedSearch = useDebounce(inputValue, 300);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearch) {
      params.set('search', debouncedSearch);
      params.delete('page'); // Reset to first page
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  }, [debouncedSearch, searchParams, setSearchParams]);

  // Sync URL changes back to input (browser navigation)
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    if (urlSearch !== inputValue) {
      setInputValue(urlSearch);
    }
  }, [searchParams]);

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search..."
        className="search-input"
      />
      <SearchResults query={debouncedSearch} />
    </div>
  );
};
```

### Advanced Filter Component

```tsx
interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterGroupProps {
  title: string;
  paramKey: string;
  options: FilterOption[];
  multiple?: boolean;
  searchable?: boolean;
}

const FilterGroup: React.FC<FilterGroupProps> = ({
  title,
  paramKey,
  options,
  multiple = false,
  searchable = false,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterSearch, setFilterSearch] = useState("");

  const selectedValues = useMemo(() => {
    const value = searchParams.get(paramKey);
    return value ? value.split(",") : [];
  }, [searchParams, paramKey]);

  const filteredOptions = useMemo(() => {
    if (!searchable || !filterSearch) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(filterSearch.toLowerCase())
    );
  }, [options, filterSearch, searchable]);

  const handleToggle = (optionId: string) => {
    const params = new URLSearchParams(searchParams);

    if (multiple) {
      const current = selectedValues;
      const updated = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];

      if (updated.length > 0) {
        params.set(paramKey, updated.join(","));
      } else {
        params.delete(paramKey);
      }
    } else {
      if (selectedValues.includes(optionId)) {
        params.delete(paramKey);
      } else {
        params.set(paramKey, optionId);
      }
    }

    params.delete("page"); // Reset pagination
    setSearchParams(params);
  };

  return (
    <div className="filter-group">
      <h4>{title}</h4>

      {searchable && (
        <input
          type="text"
          value={filterSearch}
          onChange={(e) => setFilterSearch(e.target.value)}
          placeholder={`Search ${title.toLowerCase()}...`}
          className="filter-search"
        />
      )}

      <div className="filter-options">
        {filteredOptions.map((option) => (
          <label key={option.id} className="filter-option">
            <input
              type={multiple ? "checkbox" : "radio"}
              checked={selectedValues.includes(option.id)}
              onChange={() => handleToggle(option.id)}
            />
            <span>{option.label}</span>
            {option.count && (
              <span className="filter-count">({option.count})</span>
            )}
          </label>
        ))}
      </div>
    </div>
  );
};
```

## SEO and Sharing

### SEO-Friendly URLs

```tsx
const useSEOFriendlyURL = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const generateSEOURL = useCallback(
    (params: Record<string, string>) => {
      const urlParams = new URLSearchParams();

      // Only include non-default values
      Object.entries(params).forEach(([key, value]) => {
        if (value && value !== "all" && value !== "1" && value !== "default") {
          urlParams.set(key, value);
        }
      });

      const search = urlParams.toString();
      return `${location.pathname}${search ? `?${search}` : ""}`;
    },
    [location.pathname]
  );

  const generateShareableURL = useCallback(() => {
    const baseURL = window.location.origin;
    const currentURL = generateSEOURL(Object.fromEntries(searchParams));
    return `${baseURL}${currentURL}`;
  }, [searchParams, generateSEOURL]);

  const getCanonicalURL = useCallback(() => {
    // Remove pagination and sorting for canonical URL
    const params = new URLSearchParams(searchParams);
    params.delete("page");
    params.delete("sort");
    params.delete("order");

    const search = params.toString();
    return `${window.location.origin}${location.pathname}${
      search ? `?${search}` : ""
    }`;
  }, [searchParams, location.pathname]);

  return {
    generateSEOURL,
    generateShareableURL,
    getCanonicalURL,
  };
};

const ProductPage: React.FC = () => {
  const { generateShareableURL, getCanonicalURL } = useSEOFriendlyURL();
  const [searchParams] = useSearchParams();

  const pageTitle = useMemo(() => {
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let title = "Products";
    if (search) title += ` - Search: ${search}`;
    if (category && category !== "all") title += ` - ${category}`;

    return title;
  }, [searchParams]);

  const shareURL = generateShareableURL();
  const canonicalURL = getCanonicalURL();

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <link rel="canonical" href={canonicalURL} />
        <meta property="og:url" content={shareURL} />
        <meta property="og:title" content={pageTitle} />
      </Helmet>

      <div className="product-page">
        <ProductFilters />
        <ProductGrid />

        <ShareButton url={shareURL} title={pageTitle} />
      </div>
    </>
  );
};
```

## Testing Query Parameters

### Testing URL State Hooks

```tsx
import { renderHook, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useURLState } from "./useURLState";

const wrapper = ({ children, initialEntries = ["/"] }) => (
  <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
);

describe("useURLState", () => {
  it("should initialize with default values", () => {
    const { result } = renderHook(
      () => useURLState({ defaultValues: { page: 1, search: "" } }),
      { wrapper }
    );

    expect(result.current[0]).toEqual({ page: 1, search: "" });
  });

  it("should read initial values from URL", () => {
    const { result } = renderHook(
      () => useURLState({ defaultValues: { page: 1, search: "" } }),
      {
        wrapper: ({ children }) =>
          wrapper({
            children,
            initialEntries: ["/?page=2&search=test"],
          }),
      }
    );

    expect(result.current[0]).toEqual({ page: 2, search: "test" });
  });

  it("should update URL when state changes", () => {
    const { result } = renderHook(
      () => useURLState({ defaultValues: { page: 1, search: "" } }),
      { wrapper }
    );

    act(() => {
      result.current[1]({ page: 3, search: "new search" });
    });

    expect(result.current[0]).toEqual({ page: 3, search: "new search" });
  });

  it("should remove empty values from URL", () => {
    const { result } = renderHook(
      () => useURLState({ defaultValues: { page: 1, search: "" } }),
      {
        wrapper: ({ children }) =>
          wrapper({
            children,
            initialEntries: ["/?page=2&search=test"],
          }),
      }
    );

    act(() => {
      result.current[1]({ page: 1, search: "" });
    });

    expect(result.current[0]).toEqual({ page: 1, search: "" });
  });
});
```

### Integration Testing

```tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { ProductList } from "./ProductList";

const renderProductList = (initialEntries = ["/products"]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <ProductList />
    </MemoryRouter>
  );
};

describe("ProductList with Query Parameters", () => {
  beforeEach(() => {
    // Mock API calls
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            products: [],
            total: 0,
            page: 1,
          }),
      })
    ) as jest.Mock;
  });

  it("should update URL when search input changes", async () => {
    const user = userEvent.setup();
    renderProductList();

    const searchInput = screen.getByPlaceholderText("Search products...");
    await user.type(searchInput, "laptop");

    await waitFor(() => {
      expect(window.location.search).toContain("search=laptop");
    });
  });

  it("should reset page when filters change", async () => {
    const user = userEvent.setup();
    renderProductList(["/products?page=3"]);

    const categorySelect = screen.getByDisplayValue("All Categories");
    await user.selectOptions(categorySelect, "electronics");

    await waitFor(() => {
      expect(window.location.search).toContain("category=electronics");
      expect(window.location.search).not.toContain("page=3");
    });
  });

  it("should maintain state when navigating back and forward", async () => {
    renderProductList(["/products?search=phone&category=electronics&page=2"]);

    expect(screen.getByDisplayValue("phone")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Electronics")).toBeInTheDocument();
    expect(screen.getByText("Page 2")).toBeInTheDocument();
  });

  it("should handle multiple filters simultaneously", async () => {
    const user = userEvent.setup();
    renderProductList();

    const searchInput = screen.getByPlaceholderText("Search products...");
    const categorySelect = screen.getByDisplayValue("All Categories");
    const inStockCheckbox = screen.getByLabelText("In Stock Only");

    await user.type(searchInput, "tablet");
    await user.selectOptions(categorySelect, "electronics");
    await user.click(inStockCheckbox);

    await waitFor(() => {
      const searchParams = new URLSearchParams(window.location.search);
      expect(searchParams.get("search")).toBe("tablet");
      expect(searchParams.get("category")).toBe("electronics");
      expect(searchParams.get("inStock")).toBe("true");
    });
  });
});
```

## Performance Optimization

### Memoized Query Processing

```tsx
const useOptimizedQueryState = <T extends Record<string, any>>(
  defaultValues: T,
  dependencies: (keyof T)[] = []
) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const parsedState = useMemo(() => {
    const result = { ...defaultValues };

    searchParams.forEach((value, key) => {
      if (key in defaultValues) {
        // Type-aware parsing
        const defaultValue = defaultValues[key as keyof T];
        if (typeof defaultValue === "number") {
          result[key as keyof T] = parseInt(value, 10) as T[keyof T];
        } else if (typeof defaultValue === "boolean") {
          result[key as keyof T] = (value === "true") as T[keyof T];
        } else if (Array.isArray(defaultValue)) {
          result[key as keyof T] = value.split(",") as T[keyof T];
        } else {
          result[key as keyof T] = value as T[keyof T];
        }
      }
    });

    return result;
  }, [searchParams, ...dependencies]);

  const updateState = useCallback(
    (updates: Partial<T>) => {
      const newParams = new URLSearchParams(searchParams);

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === null) {
          newParams.delete(key);
        } else if (Array.isArray(value)) {
          if (value.length > 0) {
            newParams.set(key, value.join(","));
          } else {
            newParams.delete(key);
          }
        } else {
          newParams.set(key, String(value));
        }
      });

      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  return [parsedState, updateState] as const;
};
```

### Virtual Scrolling with URL State

```tsx
import { FixedSizeList as List } from "react-window";

const VirtualizedList: React.FC = () => {
  const [state, updateState] = useOptimizedQueryState({
    search: "",
    sortBy: "name",
    itemHeight: 50,
    visibleRange: [0, 20],
  });

  const { data, totalCount } = useInfiniteQuery({
    queryKey: ["items", state.search, state.sortBy],
    queryFn: ({ pageParam = 0 }) =>
      fetchItems({
        search: state.search,
        sortBy: state.sortBy,
        offset: pageParam,
        limit: 50,
      }),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length * 50 : undefined;
    },
  });

  const allItems = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data]
  );

  const handleScroll = useCallback(
    ({ visibleStartIndex, visibleStopIndex }) => {
      updateState({
        visibleRange: [visibleStartIndex, visibleStopIndex],
      });
    },
    [updateState]
  );

  const Row = ({ index, style }) => {
    const item = allItems[index];
    return (
      <div style={style}>
        {item ? <ItemComponent item={item} /> : <LoadingItem />}
      </div>
    );
  };

  return (
    <List
      height={600}
      itemCount={totalCount}
      itemSize={state.itemHeight}
      onItemsRendered={handleScroll}
    >
      {Row}
    </List>
  );
};
```

## Best Practices

### URL Design Principles

1. **Semantic URLs**: Use meaningful parameter names that describe the data
2. **Default values**: Don't include default values in URLs to keep them clean
3. **Type safety**: Always validate and type query parameters
4. **State persistence**: Maintain important application state in the URL
5. **SEO optimization**: Structure URLs for search engine optimization

### Error Handling and Validation

```tsx
const useValidatedQueryParams = <T extends Record<string, any>>(
  schema: Record<keyof T, (value: string) => T[keyof T] | null>
) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [errors, setErrors] = useState<Record<keyof T, string>>(
    {} as Record<keyof T, string>
  );

  const validatedParams = useMemo(() => {
    const result = {} as T;
    const newErrors = {} as Record<keyof T, string>;

    Object.entries(schema).forEach(([key, validator]) => {
      const value = searchParams.get(key);
      if (value) {
        try {
          const validated = validator(value);
          if (validated !== null) {
            result[key as keyof T] = validated;
          } else {
            newErrors[key as keyof T] = `Invalid value: ${value}`;
          }
        } catch (error) {
          newErrors[key as keyof T] = `Validation error: ${error.message}`;
        }
      }
    });

    setErrors(newErrors);
    return result;
  }, [searchParams, schema]);

  return {
    params: validatedParams,
    errors,
    hasErrors: Object.keys(errors).length > 0,
  };
};
```

## Interview Questions

### Basic Questions

**Q: What are query parameters in React Router?**

A: Query parameters (also called search parameters) are key-value pairs that appear after the `?` in a URL. They're used to pass additional information to a route without changing the route structure. In React Router, they're accessed using the `useSearchParams` hook.

```tsx
// URL: /products?category=electronics&page=2
const [searchParams] = useSearchParams();
const category = searchParams.get("category"); // 'electronics'
const page = searchParams.get("page"); // '2'
```

**Q: How do you update query parameters in React Router?**

A: Query parameters are updated using the `setSearchParams` function from the `useSearchParams` hook:

```tsx
const [searchParams, setSearchParams] = useSearchParams();

// Update a single parameter
const updateCategory = (category) => {
  const newParams = new URLSearchParams(searchParams);
  newParams.set("category", category);
  setSearchParams(newParams);
};
```

**Q: What's the difference between route parameters and query parameters?**

A: Route parameters are part of the URL path structure (`:id` in `/users/:id`) and define the route itself. Query parameters are optional key-value pairs after the `?` that don't affect route matching but provide additional data to the component.

### Intermediate Questions

**Q: How do you handle complex state management with query parameters?**

A: Complex state management with query parameters involves creating custom hooks that handle serialization, deserialization, and type conversion:

```tsx
const useURLState = (defaultValues) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const state = useMemo(() => {
    const result = { ...defaultValues };
    searchParams.forEach((value, key) => {
      // Type conversion logic
      if (typeof defaultValues[key] === "number") {
        result[key] = parseInt(value, 10);
      } else if (typeof defaultValues[key] === "boolean") {
        result[key] = value === "true";
      } else {
        result[key] = value;
      }
    });
    return result;
  }, [searchParams, defaultValues]);

  const updateState = useCallback(
    (updates) => {
      const newParams = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === "") {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
      });
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  return [state, updateState];
};
```

**Q: How do you implement debounced search with query parameters?**

A: Debounced search requires separating the input state from the URL state to avoid updating the URL on every keystroke:

```tsx
const SearchComponent = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState(
    searchParams.get("search") || ""
  );

  const debouncedSearch = useDebounce(inputValue, 300);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    } else {
      params.delete("search");
    }
    setSearchParams(params);
  }, [debouncedSearch]);

  return (
    <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
  );
};
```

**Q: How do you handle pagination with query parameters?**

A: Pagination with query parameters involves tracking the current page and updating it based on user actions:

```tsx
const PaginatedList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const goToPage = (page) => {
    const params = new URLSearchParams(searchParams);
    if (page === 1) {
      params.delete("page"); // Keep URLs clean
    } else {
      params.set("page", page.toString());
    }
    setSearchParams(params);
  };

  // Reset to page 1 when filters change
  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    params.set(key, value);
    params.delete("page"); // Reset pagination
    setSearchParams(params);
  };
};
```

### Advanced Questions

**Q: How do you optimize performance when dealing with many query parameters?**

A: Performance optimization strategies include:

1. **Memoization**: Memoize query parameter parsing and state derivation
2. **Debouncing**: Debounce URL updates for rapid changes
3. **Selective updates**: Only update URL when necessary values change
4. **Batch updates**: Batch multiple parameter updates together

```tsx
const useOptimizedQueryState = (defaultValues, dependencies = []) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const state = useMemo(() => {
    // Expensive parsing logic here
    return parseSearchParams(searchParams, defaultValues);
  }, [searchParams, ...dependencies]);

  const updateState = useMemo(
    () =>
      debounce((updates) => {
        const newParams = new URLSearchParams(searchParams);
        // Batch update logic
        Object.entries(updates).forEach(([key, value]) => {
          if (value !== undefined) {
            newParams.set(key, String(value));
          } else {
            newParams.delete(key);
          }
        });
        setSearchParams(newParams);
      }, 100),
    [searchParams, setSearchParams]
  );

  return [state, updateState];
};
```

**Q: How do you handle query parameter validation and error states?**

A: Query parameter validation involves creating schemas and error handling:

```tsx
const useValidatedQueryParams = (validators) => {
  const [searchParams] = useSearchParams();
  const [errors, setErrors] = useState({});

  const validatedParams = useMemo(() => {
    const result = {};
    const newErrors = {};

    Object.entries(validators).forEach(([key, validator]) => {
      const value = searchParams.get(key);
      if (value) {
        try {
          const validated = validator(value);
          if (validated !== null) {
            result[key] = validated;
          } else {
            newErrors[key] = `Invalid ${key}: ${value}`;
          }
        } catch (error) {
          newErrors[key] = error.message;
        }
      }
    });

    setErrors(newErrors);
    return result;
  }, [searchParams, validators]);

  return {
    params: validatedParams,
    errors,
    hasErrors: Object.keys(errors).length > 0,
  };
};

// Usage
const validators = {
  page: (value) => {
    const num = parseInt(value, 10);
    return !isNaN(num) && num > 0 ? num : null;
  },
  category: (value) => {
    const allowed = ["electronics", "books", "clothing"];
    return allowed.includes(value) ? value : null;
  },
};
```

**Q: How do you implement SEO-friendly URLs with query parameters?**

A: SEO-friendly URLs require careful parameter management and canonical URL generation:

```tsx
const useSEOFriendlyURL = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const getCanonicalURL = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    // Remove pagination and sorting for canonical
    params.delete("page");
    params.delete("sort");
    params.delete("order");

    const search = params.toString();
    return `${window.location.origin}${location.pathname}${
      search ? `?${search}` : ""
    }`;
  }, [searchParams, location.pathname]);

  const generateTitle = useCallback(() => {
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let title = "Products";
    if (search) title += ` - Search: ${search}`;
    if (category) title += ` - ${category}`;

    return title;
  }, [searchParams]);

  return { getCanonicalURL, generateTitle };
};
```

**Q: How do you test components that use query parameters?**

A: Testing query parameter components requires setting up router context and mocking URL state:

```tsx
const renderWithRouter = (component, initialEntries = ["/"]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>{component}</MemoryRouter>
  );
};

describe("SearchComponent", () => {
  it("should read initial search from URL", () => {
    renderWithRouter(<SearchComponent />, ["/?search=test"]);

    expect(screen.getByDisplayValue("test")).toBeInTheDocument();
  });

  it("should update URL when search changes", async () => {
    const user = userEvent.setup();
    renderWithRouter(<SearchComponent />);

    const input = screen.getByRole("textbox");
    await user.type(input, "new search");

    await waitFor(() => {
      expect(window.location.search).toContain("search=new%20search");
    });
  });
});
```
