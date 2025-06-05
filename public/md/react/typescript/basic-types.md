# React TypeScript Basic Types

## Overview

TypeScript integration with React provides type safety, better developer experience, and improved code maintainability. This guide covers fundamental types and patterns for React applications.

## Component Types

### Function Components

```tsx
import React from "react";

// Basic function component
function Welcome(): JSX.Element {
  return <h1>Hello, World!</h1>;
}

// Function component with implicit return type
const Greeting = () => {
  return <p>Welcome to React with TypeScript!</p>;
};

// Using React.FC (Function Component) type
const Header: React.FC = () => {
  return <header>My App Header</header>;
};

// React.FC with generic for props
interface HeaderProps {
  title: string;
}

const PageHeader: React.FC<HeaderProps> = ({ title }) => {
  return <h1>{title}</h1>;
};
```

### Component with Props

```tsx
interface UserProps {
  name: string;
  age: number;
  email?: string; // Optional prop
  isActive: boolean;
}

function User({ name, age, email, isActive }: UserProps) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
      {email && <p>Email: {email}</p>}
      <p>Status: {isActive ? "Active" : "Inactive"}</p>
    </div>
  );
}

// Using the component
function App() {
  return (
    <User name="John Doe" age={30} email="john@example.com" isActive={true} />
  );
}
```

### Children Props

```tsx
interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};

// More specific children types
interface ListProps {
  children: React.ReactElement<ItemProps>[];
}

interface ItemProps {
  value: string;
}

const Item: React.FC<ItemProps> = ({ value }) => <li>{value}</li>;

const List: React.FC<ListProps> = ({ children }) => {
  return <ul>{children}</ul>;
};

// Usage
function App() {
  return (
    <List>
      <Item value="First item" />
      <Item value="Second item" />
    </List>
  );
}
```

## State Types

### useState Hook Types

```tsx
import React, { useState } from "react";

function StateExamples() {
  // Type inference
  const [count, setCount] = useState(0); // number
  const [name, setName] = useState(""); // string
  const [isVisible, setIsVisible] = useState(true); // boolean

  // Explicit typing
  const [age, setAge] = useState<number>(25);
  const [items, setItems] = useState<string[]>([]);

  // Union types
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  // Object state
  interface User {
    id: number;
    name: string;
    email: string;
  }

  const [user, setUser] = useState<User | null>(null);

  // Complex state with default
  interface FormState {
    email: string;
    password: string;
    rememberMe: boolean;
  }

  const [formState, setFormState] = useState<FormState>({
    email: "",
    password: "",
    rememberMe: false,
  });

  return (
    <div>
      <p>Count: {count}</p>
      <p>Name: {name}</p>
      <p>Status: {status}</p>
      {user && <p>User: {user.name}</p>}
    </div>
  );
}
```

### useReducer Hook Types

```tsx
interface State {
  count: number;
  error: string | null;
  loading: boolean;
}

type Action =
  | { type: "INCREMENT" }
  | { type: "DECREMENT" }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "RESET" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, count: state.count + 1 };
    case "DECREMENT":
      return { ...state, count: state.count - 1 };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "RESET":
      return { count: 0, error: null, loading: false };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, {
    count: 0,
    error: null,
    loading: false,
  });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: "INCREMENT" })}>+</button>
      <button onClick={() => dispatch({ type: "DECREMENT" })}>-</button>
      <button onClick={() => dispatch({ type: "RESET" })}>Reset</button>
    </div>
  );
}
```

## Ref Types

### useRef Hook Types

```tsx
import React, { useRef, useEffect } from "react";

function RefExamples() {
  // DOM element refs
  const inputRef = useRef<HTMLInputElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Mutable value refs
  const countRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Object refs
  interface TimerControls {
    start: () => void;
    stop: () => void;
    reset: () => void;
  }

  const timerControlsRef = useRef<TimerControls | null>(null);

  useEffect(() => {
    // Focus input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Setup timer controls
    timerControlsRef.current = {
      start: () => {
        timerRef.current = setInterval(() => {
          countRef.current += 1;
        }, 1000);
      },
      stop: () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      },
      reset: () => {
        countRef.current = 0;
      },
    };
  }, []);

  const handleClick = () => {
    if (inputRef.current) {
      console.log(inputRef.current.value);
    }
  };

  return (
    <div ref={divRef}>
      <input ref={inputRef} type="text" />
      <button ref={buttonRef} onClick={handleClick}>
        Log Input Value
      </button>
    </div>
  );
}
```

### Forward Ref Types

```tsx
interface InputProps {
  placeholder?: string;
  disabled?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ placeholder, disabled }, ref) => {
    return (
      <input
        ref={ref}
        placeholder={placeholder}
        disabled={disabled}
        className="custom-input"
      />
    );
  }
);

Input.displayName = "Input";

// Usage
function App() {
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div>
      <Input ref={inputRef} placeholder="Enter text..." />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  );
}
```

## Union and Literal Types

### String Literal Types

```tsx
type ButtonVariant = "primary" | "secondary" | "danger";
type Size = "small" | "medium" | "large";

interface ButtonProps {
  variant: ButtonVariant;
  size: Size;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  variant,
  size,
  disabled = false,
  children,
  onClick,
}) => {
  const getButtonClass = () => {
    return `btn btn-${variant} btn-${size}`;
  };

  return (
    <button className={getButtonClass()} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};

// Usage with type safety
function App() {
  return (
    <div>
      <Button variant="primary" size="large">
        Primary Button
      </Button>
      <Button variant="danger" size="small">
        Delete
      </Button>
      {/* TypeScript will error on invalid variants */}
      {/* <Button variant="invalid" size="medium">Error</Button> */}
    </div>
  );
}
```

### Discriminated Unions

```tsx
interface LoadingState {
  status: "loading";
}

interface SuccessState {
  status: "success";
  data: any[];
}

interface ErrorState {
  status: "error";
  error: string;
}

type AsyncState = LoadingState | SuccessState | ErrorState;

interface AsyncComponentProps {
  state: AsyncState;
}

const AsyncComponent: React.FC<AsyncComponentProps> = ({ state }) => {
  switch (state.status) {
    case "loading":
      return <div>Loading...</div>;
    case "success":
      return (
        <div>
          <h2>Success!</h2>
          <ul>
            {state.data.map((item, index) => (
              <li key={index}>{JSON.stringify(item)}</li>
            ))}
          </ul>
        </div>
      );
    case "error":
      return <div>Error: {state.error}</div>;
    default:
      // TypeScript ensures exhaustive checking
      const _exhaustiveCheck: never = state;
      return _exhaustiveCheck;
  }
};
```

## Utility Types

### Common Utility Types with React

```tsx
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  isActive: boolean;
}

// Pick specific properties
type UserSummary = Pick<User, "id" | "name" | "email">;

// Omit specific properties
type CreateUserInput = Omit<User, "id">;

// Make all properties optional
type PartialUser = Partial<User>;

// Make all properties required
type RequiredUser = Required<PartialUser>;

// Component using utility types
interface UserCardProps {
  user: UserSummary;
  onEdit?: (user: PartialUser) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit }) => {
  const handleEdit = () => {
    if (onEdit) {
      onEdit({ name: "Updated Name" }); // Only partial data needed
    }
  };

  return (
    <div>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <button onClick={handleEdit}>Edit</button>
    </div>
  );
};
```

### Record and Mapped Types

```tsx
type ThemeColors = "primary" | "secondary" | "success" | "danger";

// Record type for color mapping
type ColorMap = Record<ThemeColors, string>;

const colors: ColorMap = {
  primary: "#007bff",
  secondary: "#6c757d",
  success: "#28a745",
  danger: "#dc3545",
};

// Mapped type for component variants
type ComponentVariants = {
  [K in ThemeColors]: React.FC<{ children: React.ReactNode }>;
};

const createVariantComponent = (color: string) => {
  return ({ children }: { children: React.ReactNode }) => (
    <div style={{ color }}>{children}</div>
  );
};

const variants: ComponentVariants = {
  primary: createVariantComponent(colors.primary),
  secondary: createVariantComponent(colors.secondary),
  success: createVariantComponent(colors.success),
  danger: createVariantComponent(colors.danger),
};
```

## Advanced Patterns

### Conditional Types

```tsx
type ConditionalProps<T> = T extends string
  ? { text: T; onClick: () => void }
  : { data: T; onSubmit: (data: T) => void };

function ConditionalComponent<T>(props: ConditionalProps<T>) {
  if (typeof props === "object" && "text" in props) {
    return <button onClick={props.onClick}>{props.text}</button>;
  } else {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          props.onSubmit(props.data);
        }}
      >
        <pre>{JSON.stringify(props.data, null, 2)}</pre>
        <button type="submit">Submit</button>
      </form>
    );
  }
}
```

### Template Literal Types

```tsx
type Breakpoint = "sm" | "md" | "lg" | "xl";
type Property = "margin" | "padding";
type Side = "top" | "right" | "bottom" | "left";

type ResponsiveClass = `${Property}-${Side}-${Breakpoint}`;

interface ResponsiveProps {
  className?: ResponsiveClass;
  children: React.ReactNode;
}

const ResponsiveDiv: React.FC<ResponsiveProps> = ({ className, children }) => {
  return <div className={className}>{children}</div>;
};

// Usage with type safety
function App() {
  return (
    <ResponsiveDiv className="margin-top-lg">
      Content with responsive margin
    </ResponsiveDiv>
  );
}
```

## Type Guards

### Custom Type Guards

```tsx
interface Dog {
  type: "dog";
  breed: string;
  bark: () => void;
}

interface Cat {
  type: "cat";
  color: string;
  meow: () => void;
}

type Pet = Dog | Cat;

// Type guard functions
function isDog(pet: Pet): pet is Dog {
  return pet.type === "dog";
}

function isCat(pet: Pet): pet is Cat {
  return pet.type === "cat";
}

interface PetComponentProps {
  pet: Pet;
}

const PetComponent: React.FC<PetComponentProps> = ({ pet }) => {
  if (isDog(pet)) {
    return (
      <div>
        <h3>Dog: {pet.breed}</h3>
        <button onClick={pet.bark}>Bark!</button>
      </div>
    );
  }

  if (isCat(pet)) {
    return (
      <div>
        <h3>Cat: {pet.color}</h3>
        <button onClick={pet.meow}>Meow!</button>
      </div>
    );
  }

  return null;
};
```

### Generic Type Guards

```tsx
function isArrayOfType<T>(
  value: unknown,
  typeGuard: (item: unknown) => item is T
): value is T[] {
  return Array.isArray(value) && value.every(typeGuard);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

interface ListProps<T> {
  items: unknown;
  renderItem: (item: T) => React.ReactNode;
  typeGuard: (item: unknown) => item is T;
}

function SafeList<T>({ items, renderItem, typeGuard }: ListProps<T>) {
  if (!isArrayOfType(items, typeGuard)) {
    return <div>Invalid data format</div>;
  }

  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// Usage
function App() {
  const stringData = ["apple", "banana", "cherry"];
  const numberData = [1, 2, 3, 4, 5];

  return (
    <div>
      <SafeList
        items={stringData}
        typeGuard={isString}
        renderItem={(item) => <strong>{item}</strong>}
      />
      <SafeList
        items={numberData}
        typeGuard={isNumber}
        renderItem={(item) => <em>{item * 2}</em>}
      />
    </div>
  );
}
```

## Module Declaration

### Extending Global Types

```tsx
// types/global.d.ts
declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void;
    dataLayer: any[];
  }
}

// Custom module declarations
declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.svg" {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

// Usage in components
function AnalyticsComponent() {
  const trackEvent = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "click", {
        event_category: "button",
        event_label: "header-cta",
      });
    }
  };

  return <button onClick={trackEvent}>Track Event</button>;
}
```

## Best Practices

### Consistent Naming Conventions

```tsx
// Interface names with 'Props' suffix for components
interface UserCardProps {
  user: User;
  onEdit: (id: string) => void;
}

// Type aliases for unions and complex types
type Status = "idle" | "loading" | "success" | "error";
type EventHandler<T = void> = (data: T) => void;

// Generic constraints
interface Repository<T extends { id: string }> {
  findById: (id: string) => Promise<T | null>;
  save: (entity: T) => Promise<T>;
  delete: (id: string) => Promise<void>;
}
```

### Strict Type Checking

```tsx
// Enable strict mode in tsconfig.json
interface StrictComponentProps {
  // Use readonly for arrays that shouldn't be mutated
  readonly items: readonly string[];
  // Use never for impossible cases
  impossible?: never;
  // Use unknown instead of any when possible
  data: unknown;
}

const StrictComponent: React.FC<StrictComponentProps> = ({ items, data }) => {
  // Type narrowing with unknown
  const renderData = () => {
    if (typeof data === "string") {
      return <p>{data}</p>;
    }
    if (typeof data === "object" && data !== null) {
      return <pre>{JSON.stringify(data, null, 2)}</pre>;
    }
    return <p>No data available</p>;
  };

  return (
    <div>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      {renderData()}
    </div>
  );
};
```

## Common Patterns

### Higher-Order Component Types

```tsx
interface WithLoadingProps {
  loading: boolean;
}

function withLoading<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P & WithLoadingProps> {
  return ({ loading, ...props }) => {
    if (loading) {
      return <div>Loading...</div>;
    }
    return <Component {...(props as P)} />;
  };
}

// Usage
interface UserListProps {
  users: User[];
}

const UserList: React.FC<UserListProps> = ({ users }) => (
  <ul>
    {users.map((user) => (
      <li key={user.id}>{user.name}</li>
    ))}
  </ul>
);

const UserListWithLoading = withLoading(UserList);

// Usage with both original and HOC props
function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  return <UserListWithLoading users={users} loading={loading} />;
}
```

## Interview Questions

**Q: What's the difference between `interface` and `type` in TypeScript React?**
A: Both can define component props, but `interface` can be extended and merged, while `type` supports unions, intersections, and computed properties. Use `interface` for object shapes and `type` for unions and complex types.

**Q: How do you type a component that accepts any valid HTML attributes?**
A: Use intersection types with React's built-in attribute types: `interface Props extends React.HTMLAttributes<HTMLDivElement> { customProp: string; }`

**Q: What's the purpose of `React.FC` and should you use it?**
A: `React.FC` provides implicit `children` prop and return type checking, but many prefer explicit typing for better control and to avoid implicit children when not needed.

**Q: How do you handle optional props vs props with default values?**
A: Use `?` for truly optional props, and provide defaults in destructuring or with default parameters: `{ required, optional = 'default' }: Props`

**Q: What's the best way to type event handlers?**
A: Use React's built-in event types: `React.MouseEvent<HTMLButtonElement>`, `React.ChangeEvent<HTMLInputElement>`, etc., for proper type safety and autocomplete.
