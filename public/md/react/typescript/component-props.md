# React TypeScript Component Props

## Overview

Proper prop typing is essential for type-safe React components. This guide covers comprehensive patterns for defining, validating, and working with component props in TypeScript.

## Basic Prop Interfaces

### Simple Props

```tsx
interface WelcomeProps {
  name: string;
  age: number;
  isStudent: boolean;
}

const Welcome: React.FC<WelcomeProps> = ({ name, age, isStudent }) => {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>Age: {age}</p>
      <p>Status: {isStudent ? "Student" : "Not a student"}</p>
    </div>
  );
};

// Usage
<Welcome name="Alice" age={25} isStudent={true} />;
```

### Optional Props

```tsx
interface CardProps {
  title: string;
  description?: string; // Optional
  imageUrl?: string;    // Optional
  onClick?: () => void; // Optional callback
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  imageUrl,
  onClick
}) => {
  return (
    <div className="card" onClick={onClick}>
      {imageUrl && <img src={imageUrl} alt={title} />}
      <h3>{title}</h3>
      {description && <p>{description}</p>}
    </div>
  );
};

// Usage with different prop combinations
<Card title="Basic Card" />
<Card
  title="Full Card"
  description="This card has all props"
  imageUrl="/image.jpg"
  onClick={() => console.log('Clicked!')}
/>
```

### Default Props Pattern

```tsx
interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  onClick?: () => void;
}

// Method 1: Default parameters
const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "medium",
  disabled = false,
  onClick,
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// Method 2: Default props (legacy)
Button.defaultProps = {
  variant: "primary",
  size: "medium",
  disabled: false,
};
```

## Advanced Prop Patterns

### Union Type Props

```tsx
type AlertVariant = "info" | "success" | "warning" | "error";

interface AlertProps {
  variant: AlertVariant;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const Alert: React.FC<AlertProps> = ({
  variant,
  message,
  dismissible = false,
  onDismiss,
}) => {
  const getIcon = () => {
    switch (variant) {
      case "info":
        return "ℹ️";
      case "success":
        return "✅";
      case "warning":
        return "⚠️";
      case "error":
        return "❌";
    }
  };

  return (
    <div className={`alert alert-${variant}`}>
      <span className="alert-icon">{getIcon()}</span>
      <span className="alert-message">{message}</span>
      {dismissible && (
        <button onClick={onDismiss} className="alert-dismiss">
          ×
        </button>
      )}
    </div>
  );
};
```

### Generic Props

```tsx
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
}

function List<T>({
  items,
  renderItem,
  keyExtractor,
  emptyMessage = "No items found",
}: ListProps<T>) {
  if (items.length === 0) {
    return <div className="empty-state">{emptyMessage}</div>;
  }

  return (
    <ul className="list">
      {items.map((item, index) => (
        <li key={keyExtractor(item)}>{renderItem(item, index)}</li>
      ))}
    </ul>
  );
}

// Usage with different types
interface User {
  id: number;
  name: string;
  email: string;
}

interface Product {
  id: string;
  title: string;
  price: number;
}

function App() {
  const users: User[] = [
    { id: 1, name: "John", email: "john@example.com" },
    { id: 2, name: "Jane", email: "jane@example.com" },
  ];

  const products: Product[] = [
    { id: "p1", title: "Laptop", price: 999 },
    { id: "p2", title: "Mouse", price: 25 },
  ];

  return (
    <div>
      <List
        items={users}
        renderItem={(user) => (
          <div>
            <strong>{user.name}</strong> - {user.email}
          </div>
        )}
        keyExtractor={(user) => user.id}
      />

      <List
        items={products}
        renderItem={(product) => (
          <div>
            {product.title} - ${product.price}
          </div>
        )}
        keyExtractor={(product) => product.id}
      />
    </div>
  );
}
```

### Discriminated Union Props

```tsx
interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

interface ConfirmModalProps extends BaseModalProps {
  type: "confirm";
  message: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

interface FormModalProps extends BaseModalProps {
  type: "form";
  children: React.ReactNode;
  onSubmit: (data: any) => void;
}

interface InfoModalProps extends BaseModalProps {
  type: "info";
  content: React.ReactNode;
}

type ModalProps = ConfirmModalProps | FormModalProps | InfoModalProps;

const Modal: React.FC<ModalProps> = (props) => {
  if (!props.isOpen) return null;

  const renderContent = () => {
    switch (props.type) {
      case "confirm":
        return (
          <div>
            <p>{props.message}</p>
            <div className="modal-actions">
              <button onClick={props.onConfirm}>
                {props.confirmText || "Confirm"}
              </button>
              <button onClick={props.onClose}>
                {props.cancelText || "Cancel"}
              </button>
            </div>
          </div>
        );

      case "form":
        return (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              props.onSubmit(Object.fromEntries(formData));
            }}
          >
            {props.children}
            <button type="submit">Submit</button>
          </form>
        );

      case "info":
        return (
          <div>
            {props.content}
            <button onClick={props.onClose}>Close</button>
          </div>
        );
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{props.title}</h2>
        {renderContent()}
      </div>
    </div>
  );
};

// Usage examples
function App() {
  const [confirmModal, setConfirmModal] = useState(false);
  const [formModal, setFormModal] = useState(false);
  const [infoModal, setInfoModal] = useState(false);

  return (
    <div>
      <Modal
        type="confirm"
        isOpen={confirmModal}
        onClose={() => setConfirmModal(false)}
        title="Delete Item"
        message="Are you sure you want to delete this item?"
        onConfirm={() => {
          console.log("Item deleted");
          setConfirmModal(false);
        }}
      />

      <Modal
        type="form"
        isOpen={formModal}
        onClose={() => setFormModal(false)}
        title="Add User"
        onSubmit={(data) => {
          console.log("Form data:", data);
          setFormModal(false);
        }}
      >
        <input name="name" placeholder="Name" required />
        <input name="email" type="email" placeholder="Email" required />
      </Modal>

      <Modal
        type="info"
        isOpen={infoModal}
        onClose={() => setInfoModal(false)}
        title="Information"
        content={<p>This is some important information.</p>}
      />
    </div>
  );
}
```

## Children Props

### Flexible Children Types

```tsx
interface ContainerProps {
  children: React.ReactNode;
  padding?: boolean;
  centered?: boolean;
}

const Container: React.FC<ContainerProps> = ({
  children,
  padding = true,
  centered = false,
}) => {
  const className = [
    "container",
    padding && "container-padded",
    centered && "container-centered",
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={className}>{children}</div>;
};

// Specific children types
interface TabsProps {
  children: React.ReactElement<TabProps>[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

interface TabProps {
  id: string;
  label: string;
  children: React.ReactNode;
}

const Tab: React.FC<TabProps> = ({ children }) => {
  return <div className="tab-content">{children}</div>;
};

const Tabs: React.FC<TabsProps> = ({ children, activeTab, onTabChange }) => {
  return (
    <div className="tabs">
      <div className="tab-headers">
        {children.map((tab) => (
          <button
            key={tab.props.id}
            className={`tab-header ${
              tab.props.id === activeTab ? "active" : ""
            }`}
            onClick={() => onTabChange(tab.props.id)}
          >
            {tab.props.label}
          </button>
        ))}
      </div>
      <div className="tab-panels">
        {children.find((tab) => tab.props.id === activeTab)}
      </div>
    </div>
  );
};

// Usage
function App() {
  const [activeTab, setActiveTab] = useState("tab1");

  return (
    <Tabs activeTab={activeTab} onTabChange={setActiveTab}>
      <Tab id="tab1" label="First Tab">
        <p>Content of first tab</p>
      </Tab>
      <Tab id="tab2" label="Second Tab">
        <p>Content of second tab</p>
      </Tab>
    </Tabs>
  );
}
```

### Render Props Pattern

```tsx
interface RenderProps<T> {
  data: T;
  loading: boolean;
  error: Error | null;
}

interface DataFetcherProps<T> {
  url: string;
  children: (props: RenderProps<T>) => React.ReactNode;
  // Alternative render prop
  render?: (props: RenderProps<T>) => React.ReactNode;
}

function DataFetcher<T>({ url, children, render }: DataFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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

  const renderProps: RenderProps<T> = {
    data: data as T,
    loading,
    error,
  };

  return <>{render ? render(renderProps) : children(renderProps)}</>;
}

// Usage
interface User {
  id: number;
  name: string;
  email: string;
}

function App() {
  return (
    <div>
      {/* Children as function */}
      <DataFetcher<User[]> url="/api/users">
        {({ data, loading, error }) => {
          if (loading) return <div>Loading users...</div>;
          if (error) return <div>Error: {error.message}</div>;
          return (
            <ul>
              {data?.map((user) => (
                <li key={user.id}>
                  {user.name} - {user.email}
                </li>
              ))}
            </ul>
          );
        }}
      </DataFetcher>

      {/* Render prop */}
      <DataFetcher<User[]>
        url="/api/users"
        render={({ data, loading, error }) => {
          if (loading) return <div>Loading...</div>;
          if (error) return <div>Error!</div>;
          return <div>Found {data?.length} users</div>;
        }}
      />
    </div>
  );
}
```

## HTML Attribute Props

### Extending HTML Props

```tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className,
  ...htmlProps
}) => {
  return (
    <div className="input-group">
      <label className="input-label">{label}</label>
      <input
        {...htmlProps}
        className={`input ${error ? "input-error" : ""} ${className || ""}`}
      />
      {error && <span className="input-error-text">{error}</span>}
      {helperText && <span className="input-helper-text">{helperText}</span>}
    </div>
  );
};

// Usage with full HTML input support
<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  required
  error="Invalid email format"
  helperText="We'll never share your email"
  onChange={(e) => console.log(e.target.value)}
/>;
```

### Button with HTML Props

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "medium",
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  className,
  ...htmlProps
}) => {
  const buttonClass = [
    "btn",
    `btn-${variant}`,
    `btn-${size}`,
    loading && "btn-loading",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      {...htmlProps}
      className={buttonClass}
      disabled={disabled || loading}
    >
      {loading && <span className="spinner" />}
      {leftIcon && <span className="btn-icon-left">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="btn-icon-right">{rightIcon}</span>}
    </button>
  );
};

// Usage
<Button
  variant="primary"
  size="large"
  onClick={() => console.log("Clicked!")}
  leftIcon={<span>👍</span>}
  type="submit"
  form="my-form"
>
  Submit Form
</Button>;
```

## Complex Prop Patterns

### Compound Components

```tsx
interface AccordionContextType {
  openItems: string[];
  toggleItem: (id: string) => void;
  allowMultiple: boolean;
}

const AccordionContext = React.createContext<AccordionContextType | null>(null);

interface AccordionProps {
  children: React.ReactNode;
  allowMultiple?: boolean;
  defaultOpen?: string[];
}

const Accordion: React.FC<AccordionProps> & {
  Item: React.FC<AccordionItemProps>;
  Header: React.FC<AccordionHeaderProps>;
  Content: React.FC<AccordionContentProps>;
} = ({ children, allowMultiple = false, defaultOpen = [] }) => {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return allowMultiple ? [...prev, id] : [id];
      }
    });
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, allowMultiple }}>
      <div className="accordion">{children}</div>
    </AccordionContext.Provider>
  );
};

interface AccordionItemProps {
  id: string;
  children: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ id, children }) => {
  return (
    <div className="accordion-item" data-id={id}>
      {children}
    </div>
  );
};

interface AccordionHeaderProps {
  children: React.ReactNode;
}

const AccordionHeader: React.FC<AccordionHeaderProps> = ({ children }) => {
  const context = useContext(AccordionContext);
  if (!context)
    throw new Error("AccordionHeader must be used within Accordion");

  const item = useContext(AccordionItemContext);
  if (!item)
    throw new Error("AccordionHeader must be used within AccordionItem");

  const isOpen = context.openItems.includes(item.id);

  return (
    <button
      className={`accordion-header ${isOpen ? "open" : ""}`}
      onClick={() => context.toggleItem(item.id)}
    >
      {children}
      <span className="accordion-icon">{isOpen ? "−" : "+"}</span>
    </button>
  );
};

interface AccordionContentProps {
  children: React.ReactNode;
}

const AccordionContent: React.FC<AccordionContentProps> = ({ children }) => {
  const context = useContext(AccordionContext);
  if (!context)
    throw new Error("AccordionContent must be used within Accordion");

  const item = useContext(AccordionItemContext);
  if (!item)
    throw new Error("AccordionContent must be used within AccordionItem");

  const isOpen = context.openItems.includes(item.id);

  return (
    <div className={`accordion-content ${isOpen ? "open" : ""}`}>
      {children}
    </div>
  );
};

// Compound assignment
Accordion.Item = AccordionItem;
Accordion.Header = AccordionHeader;
Accordion.Content = AccordionContent;

// Usage
function App() {
  return (
    <Accordion allowMultiple defaultOpen={["item1"]}>
      <Accordion.Item id="item1">
        <Accordion.Header>Section 1</Accordion.Header>
        <Accordion.Content>Content for section 1</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item id="item2">
        <Accordion.Header>Section 2</Accordion.Header>
        <Accordion.Content>Content for section 2</Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
}
```

### Polymorphic Components

```tsx
type ElementType = keyof JSX.IntrinsicElements | React.ComponentType<any>;

type PolymorphicRef<E extends ElementType> =
  React.ComponentPropsWithRef<E>["ref"];

type PolymorphicComponentProp<E extends ElementType, P> = P & {
  as?: E;
} & Omit<React.ComponentPropsWithRef<E>, keyof P | "as">;

type PolymorphicComponent<P, D extends ElementType = "div"> = <
  E extends ElementType = D
>(
  props: PolymorphicComponentProp<E, P> & { ref?: PolymorphicRef<E> }
) => React.ReactElement | null;

interface BoxProps {
  children: React.ReactNode;
  padding?: "small" | "medium" | "large";
  margin?: "small" | "medium" | "large";
}

const Box: PolymorphicComponent<BoxProps> = React.forwardRef<
  HTMLElement,
  PolymorphicComponentProp<ElementType, BoxProps>
>(({ as: Element = "div", children, padding, margin, ...props }, ref) => {
  const className = [
    "box",
    padding && `box-padding-${padding}`,
    margin && `box-margin-${margin}`,
    props.className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Element {...props} ref={ref} className={className}>
      {children}
    </Element>
  );
});

// Usage
function App() {
  return (
    <div>
      {/* Renders as div */}
      <Box padding="medium">Default box</Box>

      {/* Renders as section */}
      <Box as="section" padding="large">
        Section box
      </Box>

      {/* Renders as button with onClick */}
      <Box as="button" padding="small" onClick={() => console.log("Clicked!")}>
        Button box
      </Box>

      {/* Renders as Link component */}
      <Box as={Link} to="/about" padding="medium">
        Link box
      </Box>
    </div>
  );
}
```

## Prop Validation Patterns

### Runtime Validation

```tsx
interface UserProps {
  name: string;
  age: number;
  email: string;
  role: "admin" | "user" | "guest";
}

function validateUserProps(props: UserProps): string[] {
  const errors: string[] = [];

  if (!props.name.trim()) {
    errors.push("Name is required");
  }

  if (props.age < 0 || props.age > 150) {
    errors.push("Age must be between 0 and 150");
  }

  if (!props.email.includes("@")) {
    errors.push("Email must be valid");
  }

  return errors;
}

const UserProfile: React.FC<UserProps> = (props) => {
  const errors = validateUserProps(props);

  if (errors.length > 0) {
    return (
      <div className="error">
        <h3>Validation Errors:</h3>
        <ul>
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="user-profile">
      <h2>{props.name}</h2>
      <p>Age: {props.age}</p>
      <p>Email: {props.email}</p>
      <p>Role: {props.role}</p>
    </div>
  );
};
```

### Prop Constraints with Generics

```tsx
interface SelectOption<T> {
  value: T;
  label: string;
  disabled?: boolean;
}

interface SelectProps<T> {
  options: SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  placeholder?: string;
  multiple?: boolean;
}

function Select<T extends string | number>({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  multiple = false,
}: SelectProps<T>) {
  return (
    <select
      value={value as string}
      onChange={(e) => {
        const selectedValue = e.target.value as T;
        onChange(selectedValue);
      }}
      multiple={multiple}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value as string}
          disabled={option.disabled}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}

// Usage
function App() {
  const [stringValue, setStringValue] = useState<string>("");
  const [numberValue, setNumberValue] = useState<number>(0);

  const stringOptions: SelectOption<string>[] = [
    { value: "react", label: "React" },
    { value: "vue", label: "Vue" },
    { value: "angular", label: "Angular" },
  ];

  const numberOptions: SelectOption<number>[] = [
    { value: 1, label: "One" },
    { value: 2, label: "Two" },
    { value: 3, label: "Three" },
  ];

  return (
    <div>
      <Select
        options={stringOptions}
        value={stringValue}
        onChange={setStringValue}
        placeholder="Choose a framework"
      />

      <Select
        options={numberOptions}
        value={numberValue}
        onChange={setNumberValue}
        placeholder="Choose a number"
      />
    </div>
  );
}
```

## Best Practices

### Consistent Prop Naming

```tsx
// Good: Consistent naming patterns
interface ComponentProps {
  // Boolean props: is/has/can/should prefix
  isVisible: boolean;
  hasError: boolean;
  canEdit: boolean;
  shouldAutoFocus: boolean;

  // Event handlers: on prefix
  onClick: () => void;
  onSubmit: (data: any) => void;
  onValueChange: (value: string) => void;

  // Render props: render prefix or children
  renderHeader: () => React.ReactNode;
  renderFooter?: () => React.ReactNode;
  children: React.ReactNode;

  // Data props: clear, descriptive names
  userData: User;
  itemList: Item[];
  currentPage: number;
}
```

### Prop Documentation

```tsx
/**
 * A reusable card component for displaying content with consistent styling
 */
interface CardProps {
  /** The main content of the card */
  children: React.ReactNode;

  /** Optional title displayed at the top of the card */
  title?: string;

  /** Visual variant of the card */
  variant?: "default" | "elevated" | "outlined";

  /** Whether the card should be clickable */
  clickable?: boolean;

  /** Callback fired when the card is clicked (only if clickable is true) */
  onClick?: () => void;

  /** Additional CSS classes to apply */
  className?: string;

  /**
   * Custom styles to apply to the card
   * @deprecated Use className instead
   */
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  variant = "default",
  clickable = false,
  onClick,
  className,
  style,
}) => {
  // Component implementation
  return (
    <div
      className={`card card-${variant} ${clickable ? "card-clickable" : ""} ${
        className || ""
      }`}
      onClick={clickable ? onClick : undefined}
      style={style}
    >
      {title && <h3 className="card-title">{title}</h3>}
      <div className="card-content">{children}</div>
    </div>
  );
};
```

## Interview Questions

**Q: What's the difference between optional props and props with default values?**
A: Optional props (`prop?: type`) can be undefined and must be checked before use. Props with default values are guaranteed to have a value and don't need undefined checks.

**Q: How do you type a component that accepts all HTML div attributes plus custom props?**
A: Use intersection types: `interface Props extends React.HTMLAttributes<HTMLDivElement> { customProp: string; }`

**Q: What are the benefits of using discriminated unions for props?**
A: Discriminated unions ensure type safety across different component variants, preventing invalid prop combinations and providing better IntelliSense.

**Q: How do you handle generic props in React components?**
A: Define the component as a generic function: `function Component<T>(props: Props<T>)` and use type constraints when needed.

**Q: What's the best way to handle children props with specific types?**
A: Use `React.ReactElement<SpecificProps>[]` for specific component types, or `React.ReactNode` for any valid React content.
