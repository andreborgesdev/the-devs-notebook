# Generic Components in React with TypeScript

Generic components in React provide reusable, type-safe solutions that work with multiple data types while maintaining strict typing.

## Basic Generic Components

### Simple Generic List

```typescript
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string | number;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={keyExtractor(item, index)}>{renderItem(item, index)}</li>
      ))}
    </ul>
  );
}

// Usage
interface User {
  id: number;
  name: string;
  email: string;
}

const users: User[] = [{ id: 1, name: "John", email: "john@example.com" }];

<List
  items={users}
  renderItem={(user) => <span>{user.name}</span>}
  keyExtractor={(user) => user.id}
/>;
```

### Generic Form Field

```typescript
interface FormFieldProps<T> {
  value: T;
  onChange: (value: T) => void;
  validator?: (value: T) => string | null;
  label: string;
  placeholder?: string;
}

function FormField<T extends string | number>({
  value,
  onChange,
  validator,
  label,
  placeholder,
}: FormFieldProps<T>) {
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = (
      typeof value === "number" ? Number(e.target.value) : e.target.value
    ) as T;

    onChange(newValue);

    if (validator) {
      const validationError = validator(newValue);
      setError(validationError);
    }
  };

  return (
    <div>
      <label>{label}</label>
      <input
        type={typeof value === "number" ? "number" : "text"}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
      />
      {error && <span className="error">{error}</span>}
    </div>
  );
}
```

## Advanced Generic Patterns

### Generic Table Component

```typescript
interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  loading?: boolean;
  emptyMessage?: string;
}

function Table<T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  loading = false,
  emptyMessage = "No data available",
}: TableProps<T>) {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (data.length === 0) {
    return <div>{emptyMessage}</div>;
  }

  return (
    <table>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={String(column.key)}>{column.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr
            key={index}
            onClick={() => onRowClick?.(item)}
            style={{ cursor: onRowClick ? "pointer" : "default" }}
          >
            {columns.map((column) => (
              <td key={String(column.key)}>
                {column.render
                  ? column.render(item[column.key], item)
                  : String(item[column.key])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Usage
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

const productColumns: Column<Product>[] = [
  { key: "name", header: "Product Name" },
  {
    key: "price",
    header: "Price",
    render: (price) => `$${price.toFixed(2)}`,
  },
  { key: "category", header: "Category" },
  {
    key: "inStock",
    header: "Stock Status",
    render: (inStock) => (inStock ? "✅ In Stock" : "❌ Out of Stock"),
  },
];

<Table
  data={products}
  columns={productColumns}
  onRowClick={(product) => console.log("Clicked:", product)}
/>;
```

### Generic Modal Component

```typescript
interface ModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  data?: T;
  title: string;
  children: (data: T | undefined) => React.ReactNode;
  actions?: Array<{
    label: string;
    onClick: (data: T | undefined) => void;
    variant?: "primary" | "secondary" | "danger";
  }>;
}

function Modal<T>({
  isOpen,
  onClose,
  data,
  title,
  children,
  actions = [],
}: ModalProps<T>) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose}>×</button>
        </div>
        <div className="modal-body">{children(data)}</div>
        {actions.length > 0 && (
          <div className="modal-footer">
            {actions.map((action, index) => (
              <button
                key={index}
                className={`btn btn-${action.variant || "secondary"}`}
                onClick={() => action.onClick(data)}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Usage
interface UserDetails {
  id: number;
  name: string;
  email: string;
  role: string;
}

const [selectedUser, setSelectedUser] = useState<UserDetails | undefined>();
const [isModalOpen, setIsModalOpen] = useState(false);

<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  data={selectedUser}
  title="User Details"
  actions={[
    {
      label: "Edit",
      onClick: (user) => user && editUser(user),
      variant: "primary",
    },
    {
      label: "Delete",
      onClick: (user) => user && deleteUser(user.id),
      variant: "danger",
    },
  ]}
>
  {(user) =>
    user ? (
      <div>
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
      </div>
    ) : (
      <p>No user selected</p>
    )
  }
</Modal>;
```

## Generic Hooks

### Generic API Hook

```typescript
interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

function useApi<T>(
  fetcher: () => Promise<T>,
  options: UseApiOptions = {}
): ApiState<T> & { refetch: () => Promise<void> } {
  const { immediate = true, onSuccess, onError } = options;

  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await fetcher();
      setState({ data, loading: false, error: null });
      onSuccess?.(data);
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Unknown error");
      setState({ data: null, loading: false, error: err });
      onError?.(err);
    }
  }, [fetcher, onSuccess, onError]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    ...state,
    refetch: execute,
  };
}

// Usage
const fetchUser = async (): Promise<User> => {
  const response = await fetch("/api/user");
  return response.json();
};

const {
  data: user,
  loading,
  error,
  refetch,
} = useApi(fetchUser, {
  onSuccess: (user) => console.log("User loaded:", user),
  onError: (error) => console.error("Failed to load user:", error),
});
```

### Generic Form Hook

```typescript
type FormValues = Record<string, any>;

interface ValidationRule<T> {
  test: (value: T) => boolean;
  message: string;
}

interface UseFormConfig<T extends FormValues> {
  initialValues: T;
  validation?: {
    [K in keyof T]?: ValidationRule<T[K]>[];
  };
  onSubmit: (values: T) => void | Promise<void>;
}

function useForm<T extends FormValues>({
  initialValues,
  validation = {},
  onSubmit,
}: UseFormConfig<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback(
    <K extends keyof T>(name: K, value: T[K]): string | null => {
      const rules = validation[name];
      if (!rules) return null;

      for (const rule of rules) {
        if (!rule.test(value)) {
          return rule.message;
        }
      }
      return null;
    },
    [validation]
  );

  const setValue = useCallback(
    <K extends keyof T>(name: K, value: T[K]) => {
      setValues((prev) => ({ ...prev, [name]: value }));

      if (touched[name]) {
        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error || undefined }));
      }
    },
    [touched, validateField]
  );

  const setFieldTouched = useCallback(
    <K extends keyof T>(name: K) => {
      setTouched((prev) => ({ ...prev, [name]: true }));
      const error = validateField(name, values[name]);
      setErrors((prev) => ({ ...prev, [name]: error || undefined }));
    },
    [values, validateField]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      // Validate all fields
      const allErrors: Partial<Record<keyof T, string>> = {};
      for (const name in values) {
        const error = validateField(name, values[name]);
        if (error) allErrors[name] = error;
      }

      setErrors(allErrors);
      setTouched(
        Object.keys(values).reduce((acc, key) => {
          acc[key as keyof T] = true;
          return acc;
        }, {} as Partial<Record<keyof T, boolean>>)
      );

      if (Object.keys(allErrors).length === 0) {
        try {
          await onSubmit(values);
        } catch (error) {
          console.error("Form submission error:", error);
        }
      }

      setIsSubmitting(false);
    },
    [values, validateField, onSubmit]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    setFieldTouched,
    handleSubmit,
    reset,
  };
}
```

## Constrained Generics

### Component with Type Constraints

```typescript
// Constraint: T must have an 'id' property
interface HasId {
  id: string | number;
}

interface SelectableListProps<T extends HasId> {
  items: T[];
  selectedIds: Array<T["id"]>;
  onSelectionChange: (selectedIds: Array<T["id"]>) => void;
  renderItem: (item: T, isSelected: boolean) => React.ReactNode;
  multiple?: boolean;
}

function SelectableList<T extends HasId>({
  items,
  selectedIds,
  onSelectionChange,
  renderItem,
  multiple = false,
}: SelectableListProps<T>) {
  const handleItemClick = (item: T) => {
    if (multiple) {
      const isSelected = selectedIds.includes(item.id);
      const newSelection = isSelected
        ? selectedIds.filter((id) => id !== item.id)
        : [...selectedIds, item.id];
      onSelectionChange(newSelection);
    } else {
      onSelectionChange([item.id]);
    }
  };

  return (
    <div>
      {items.map((item) => {
        const isSelected = selectedIds.includes(item.id);
        return (
          <div
            key={item.id}
            onClick={() => handleItemClick(item)}
            className={isSelected ? "selected" : ""}
          >
            {renderItem(item, isSelected)}
          </div>
        );
      })}
    </div>
  );
}
```

### Generic Component with Multiple Constraints

```typescript
interface Sortable {
  [key: string]: string | number | Date;
}

interface Filterable {
  [key: string]: any;
}

interface DataGridProps<T extends Sortable & Filterable & HasId> {
  data: T[];
  columns: Array<{
    key: keyof T;
    header: string;
    sortable?: boolean;
    filterable?: boolean;
    render?: (value: T[keyof T], item: T) => React.ReactNode;
  }>;
  pageSize?: number;
}

function DataGrid<T extends Sortable & Filterable & HasId>({
  data,
  columns,
  pageSize = 10,
}: DataGridProps<T>) {
  const [sortBy, setSortBy] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState<Partial<Record<keyof T, string>>>({});
  const [currentPage, setCurrentPage] = useState(1);

  const sortedAndFilteredData = useMemo(() => {
    let result = [...data];

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter((item) =>
          String(item[key as keyof T])
            .toLowerCase()
            .includes(value.toLowerCase())
        );
      }
    });

    // Apply sorting
    if (sortBy) {
      result.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];

        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, filters, sortBy, sortOrder]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedAndFilteredData.slice(start, start + pageSize);
  }, [sortedAndFilteredData, currentPage, pageSize]);

  return (
    <div>
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)}>
                <div>
                  {column.header}
                  {column.sortable && (
                    <button
                      onClick={() => {
                        if (sortBy === column.key) {
                          setSortOrder((prev) =>
                            prev === "asc" ? "desc" : "asc"
                          );
                        } else {
                          setSortBy(column.key);
                          setSortOrder("asc");
                        }
                      }}
                    >
                      {sortBy === column.key
                        ? sortOrder === "asc"
                          ? "↑"
                          : "↓"
                        : "↕"}
                    </button>
                  )}
                </div>
                {column.filterable && (
                  <input
                    type="text"
                    placeholder="Filter..."
                    value={filters[column.key] || ""}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        [column.key]: e.target.value,
                      }))
                    }
                  />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item) => (
            <tr key={item.id}>
              {columns.map((column) => (
                <td key={String(column.key)}>
                  {column.render
                    ? column.render(item[column.key], item)
                    : String(item[column.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

## Best Practices

### Generic Component Design

- Use meaningful constraint names
- Provide sensible defaults for optional generics
- Document generic parameters clearly
- Keep generics as simple as possible

### Type Safety

- Use extends to constrain generic types
- Provide proper type guards when needed
- Avoid any types in generic components
- Use conditional types for complex scenarios

### Performance

- Memoize generic components when appropriate
- Use proper dependency arrays with generic hooks
- Consider React.memo for generic components
- Profile generic components for performance

### Reusability

- Design for common use cases
- Provide escape hatches for edge cases
- Keep component APIs consistent
- Export related types alongside components

## Common Patterns

### Generic Provider Pattern

```typescript
interface ProviderProps<T> {
  value: T;
  children: React.ReactNode;
}

function createGenericProvider<T>() {
  const Context = createContext<T | undefined>(undefined);

  const Provider: React.FC<ProviderProps<T>> = ({ value, children }) => (
    <Context.Provider value={value}>{children}</Context.Provider>
  );

  const useContext = () => {
    const context = React.useContext(Context);
    if (context === undefined) {
      throw new Error("useContext must be used within Provider");
    }
    return context;
  };

  return { Provider, useContext };
}
```

This comprehensive guide covers generic components in React with TypeScript, providing flexible and type-safe solutions for reusable components.
