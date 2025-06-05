# React forwardRef and Ref Forwarding

Ref forwarding is a technique for automatically passing a ref through a component to one of its children. This is particularly useful for reusable component libraries and when you need to access DOM elements in parent components.

## Understanding forwardRef

forwardRef allows a component to take a ref it receives and pass it down to a child component. This creates a direct connection between parent and child DOM elements.

### Basic forwardRef Implementation

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "primary", size = "medium", className, children, ...props },
    ref
  ) => {
    const baseClasses =
      "px-4 py-2 rounded font-medium focus:outline-none focus:ring-2";
    const variantClasses = {
      primary: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-300",
      secondary:
        "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-300",
    };
    const sizeClasses = {
      small: "text-sm px-2 py-1",
      medium: "text-base px-4 py-2",
      large: "text-lg px-6 py-3",
    };

    const classes = `${baseClasses} ${variantClasses[variant]} ${
      sizeClasses[size]
    } ${className || ""}`;

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

const App = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    buttonRef.current?.focus();
  };

  return (
    <div>
      <Button ref={buttonRef} variant="primary">
        Focus me
      </Button>
      <button onClick={handleClick}>Focus the button above</button>
    </div>
  );
};
```

### Forward Ref with Custom Components

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    const inputId = useId();
    const errorId = useId();
    const helperId = useId();

    return (
      <div className="input-group">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium mb-1">
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2
            ${
              error
                ? "border-red-500 focus:ring-red-300"
                : "border-gray-300 focus:ring-blue-300"
            }
            ${className || ""}
          `}
          aria-describedby={
            [error && errorId, helperText && helperId]
              .filter(Boolean)
              .join(" ") || undefined
          }
          aria-invalid={!!error}
          {...props}
        />

        {error && (
          <p id={errorId} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={helperId} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

const ContactForm = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!nameRef.current?.value) {
      newErrors.name = "Name is required";
      nameRef.current?.focus();
    }

    if (!emailRef.current?.value) {
      newErrors.email = "Email is required";
      if (!newErrors.name) emailRef.current?.focus();
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Form submitted successfully");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        ref={nameRef}
        label="Name"
        placeholder="Enter your name"
        error={errors.name}
      />

      <Input
        ref={emailRef}
        type="email"
        label="Email"
        placeholder="Enter your email"
        error={errors.email}
        helperText="We'll never share your email"
      />

      <button type="submit">Submit</button>
    </form>
  );
};
```

## Advanced forwardRef Patterns

### Conditional Ref Forwarding

```typescript
interface ConditionalRefProps {
  as?: "button" | "div" | "span";
  children: React.ReactNode;
  onClick?: () => void;
}

const ConditionalRef = React.forwardRef<
  HTMLButtonElement | HTMLDivElement | HTMLSpanElement,
  ConditionalRefProps
>(({ as = "div", children, onClick, ...props }, ref) => {
  const commonProps = {
    ...props,
    children,
    onClick,
  };

  switch (as) {
    case "button":
      return (
        <button ref={ref as React.Ref<HTMLButtonElement>} {...commonProps} />
      );
    case "span":
      return <span ref={ref as React.Ref<HTMLSpanElement>} {...commonProps} />;
    default:
      return <div ref={ref as React.Ref<HTMLDivElement>} {...commonProps} />;
  }
});

ConditionalRef.displayName = "ConditionalRef";
```

### Ref Forwarding with Compound Components

```typescript
interface ModalContextValue {
  isOpen: boolean;
  close: () => void;
}

const ModalContext = React.createContext<ModalContextValue | null>(null);

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> & {
  Header: typeof ModalHeader;
  Body: typeof ModalBody;
  Footer: typeof ModalFooter;
} = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <ModalContext.Provider value={{ isOpen, close: onClose }}>
      <div className="modal-overlay" onClick={onClose}>
        <div
          ref={modalRef}
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
        >
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  );
};

const ModalHeader = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode }
>(({ children }, ref) => (
  <div ref={ref} className="modal-header">
    {children}
  </div>
));

const ModalBody = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode }
>(({ children }, ref) => (
  <div ref={ref} className="modal-body">
    {children}
  </div>
));

const ModalFooter = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode }
>(({ children }, ref) => (
  <div ref={ref} className="modal-footer">
    {children}
  </div>
));

ModalHeader.displayName = "ModalHeader";
ModalBody.displayName = "ModalBody";
ModalFooter.displayName = "ModalFooter";

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

const ModalExample = () => {
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  const openModal = () => {
    setIsOpen(true);
    setTimeout(() => {
      headerRef.current?.focus();
    }, 100);
  };

  return (
    <div>
      <button onClick={openModal}>Open Modal</button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Modal.Header ref={headerRef}>
          <h2>Modal Title</h2>
        </Modal.Header>

        <Modal.Body>
          <p>Modal content goes here...</p>
        </Modal.Body>

        <Modal.Footer>
          <button onClick={() => setIsOpen(false)}>Close</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
```

### Generic forwardRef Components

```typescript
interface ListItemProps<T> {
  item: T;
  renderItem: (item: T) => React.ReactNode;
  onSelect?: (item: T) => void;
  isSelected?: boolean;
}

function createListItem<T>() {
  return React.forwardRef<HTMLLIElement, ListItemProps<T>>(
    ({ item, renderItem, onSelect, isSelected, ...props }, ref) => (
      <li
        ref={ref}
        className={`list-item ${isSelected ? "selected" : ""}`}
        onClick={() => onSelect?.(item)}
        tabIndex={0}
        role="option"
        aria-selected={isSelected}
        {...props}
      >
        {renderItem(item)}
      </li>
    )
  );
}

const StringListItem = createListItem<string>();
const UserListItem = createListItem<User>();

interface SelectableListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  onSelectionChange?: (selectedItems: T[]) => void;
  getItemKey: (item: T) => string;
}

function SelectableList<T>({
  items,
  renderItem,
  onSelectionChange,
  getItemKey,
}: SelectableListProps<T>) {
  const [selectedItems, setSelectedItems] = useState<T[]>([]);
  const itemRefs = useRef<Map<string, HTMLLIElement>>(new Map());

  const setItemRef = (key: string) => (el: HTMLLIElement | null) => {
    if (el) {
      itemRefs.current.set(key, el);
    } else {
      itemRefs.current.delete(key);
    }
  };

  const handleSelect = (item: T) => {
    const newSelection = selectedItems.includes(item)
      ? selectedItems.filter((selected) => selected !== item)
      : [...selectedItems, item];

    setSelectedItems(newSelection);
    onSelectionChange?.(newSelection);
  };

  const handleKeyDown = (e: React.KeyboardEvent, item: T) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect(item);
    }
  };

  const ListItem = createListItem<T>();

  return (
    <ul role="listbox" aria-multiselectable="true">
      {items.map((item) => {
        const key = getItemKey(item);
        const isSelected = selectedItems.includes(item);

        return (
          <ListItem
            key={key}
            ref={setItemRef(key)}
            item={item}
            renderItem={renderItem}
            onSelect={handleSelect}
            isSelected={isSelected}
            onKeyDown={(e) => handleKeyDown(e, item)}
          />
        );
      })}
    </ul>
  );
}

const ListExample = () => {
  const users = [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" },
    { id: 3, name: "Charlie", email: "charlie@example.com" },
  ];

  return (
    <SelectableList
      items={users}
      getItemKey={(user) => user.id.toString()}
      renderItem={(user) => (
        <div>
          <strong>{user.name}</strong>
          <br />
          <small>{user.email}</small>
        </div>
      )}
      onSelectionChange={(selected) => {
        console.log("Selected users:", selected);
      }}
    />
  );
};
```

## useImperativeHandle with forwardRef

### Custom Imperative API

```typescript
interface TextInputRef {
  focus: () => void;
  blur: () => void;
  clear: () => void;
  getValue: () => string;
  setValue: (value: string) => void;
  select: () => void;
}

interface TextInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "ref"> {
  onValueChange?: (value: string) => void;
}

const TextInput = React.forwardRef<TextInputRef, TextInputProps>(
  ({ onValueChange, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState(props.defaultValue?.toString() || "");

    useImperativeHandle(
      ref,
      () => ({
        focus: () => {
          inputRef.current?.focus();
        },
        blur: () => {
          inputRef.current?.blur();
        },
        clear: () => {
          setValue("");
          onValueChange?.("");
        },
        getValue: () => {
          return value;
        },
        setValue: (newValue: string) => {
          setValue(newValue);
          onValueChange?.(newValue);
        },
        select: () => {
          inputRef.current?.select();
        },
      }),
      [value, onValueChange]
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      onValueChange?.(newValue);
      props.onChange?.(e);
    };

    return (
      <input ref={inputRef} value={value} onChange={handleChange} {...props} />
    );
  }
);

TextInput.displayName = "TextInput";

const TextInputExample = () => {
  const inputRef = useRef<TextInputRef>(null);

  const handleFocus = () => inputRef.current?.focus();
  const handleClear = () => inputRef.current?.clear();
  const handleSelect = () => inputRef.current?.select();
  const handleGetValue = () => {
    const value = inputRef.current?.getValue();
    alert(`Current value: ${value}`);
  };

  return (
    <div>
      <TextInput
        ref={inputRef}
        placeholder="Enter some text"
        onValueChange={(value) => console.log("Value changed:", value)}
      />

      <div>
        <button onClick={handleFocus}>Focus</button>
        <button onClick={handleClear}>Clear</button>
        <button onClick={handleSelect}>Select All</button>
        <button onClick={handleGetValue}>Get Value</button>
      </div>
    </div>
  );
};
```

### Complex Component with Multiple Refs

```typescript
interface FormRef {
  submit: () => void;
  reset: () => void;
  validate: () => boolean;
  focusFirstError: () => void;
  getFormData: () => Record<string, any>;
}

interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  validation?: (value: string) => string | null;
}

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ name, label, type = "text", required, validation, ...props }, ref) => {
    const [value, setValue] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [touched, setTouched] = useState(false);

    const validate = useCallback(() => {
      let errorMessage: string | null = null;

      if (required && !value.trim()) {
        errorMessage = `${label} is required`;
      } else if (validation && value) {
        errorMessage = validation(value);
      }

      setError(errorMessage);
      return !errorMessage;
    }, [value, required, validation, label]);

    const handleBlur = () => {
      setTouched(true);
      validate();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      if (touched) {
        setTimeout(validate, 0);
      }
    };

    // Expose validation method to parent
    useImperativeHandle(
      ref,
      () =>
        ({
          ...ref,
          validate,
          hasError: () => !!error,
          focus: () => ref?.current?.focus(),
          getValue: () => value,
          setValue: (newValue: string) => setValue(newValue),
        } as any),
      [validate, error, value]
    );

    return (
      <div className="form-field">
        <label htmlFor={name}>{label}</label>
        <input
          ref={ref}
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          {...props}
        />
        {touched && error && <span className="error">{error}</span>}
      </div>
    );
  }
);

const AdvancedForm = React.forwardRef<
  FormRef,
  { onSubmit: (data: Record<string, any>) => void }
>(({ onSubmit }, ref) => {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const fieldRefs = [nameRef, emailRef, phoneRef];

  useImperativeHandle(
    ref,
    () => ({
      submit: () => {
        handleSubmit();
      },
      reset: () => {
        fieldRefs.forEach((fieldRef) => {
          (fieldRef.current as any)?.setValue?.("");
        });
      },
      validate: () => {
        return fieldRefs.every((fieldRef) =>
          (fieldRef.current as any)?.validate?.()
        );
      },
      focusFirstError: () => {
        const firstErrorField = fieldRefs.find((fieldRef) =>
          (fieldRef.current as any)?.hasError?.()
        );
        (firstErrorField?.current as any)?.focus?.();
      },
      getFormData: () => {
        return {
          name: (nameRef.current as any)?.getValue?.(),
          email: (emailRef.current as any)?.getValue?.(),
          phone: (phoneRef.current as any)?.getValue?.(),
        };
      },
    }),
    []
  );

  const handleSubmit = () => {
    const isValid = fieldRefs.every((fieldRef) =>
      (fieldRef.current as any)?.validate?.()
    );

    if (isValid) {
      const formData = {
        name: (nameRef.current as any)?.getValue?.(),
        email: (emailRef.current as any)?.getValue?.(),
        phone: (phoneRef.current as any)?.getValue?.(),
      };
      onSubmit(formData);
    } else {
      const firstErrorField = fieldRefs.find((fieldRef) =>
        (fieldRef.current as any)?.hasError?.()
      );
      (firstErrorField?.current as any)?.focus?.();
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <FormField ref={nameRef} name="name" label="Name" required />

      <FormField
        ref={emailRef}
        name="email"
        label="Email"
        type="email"
        required
        validation={(value) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value) ? null : "Invalid email format";
        }}
      />

      <FormField
        ref={phoneRef}
        name="phone"
        label="Phone"
        validation={(value) => {
          const phoneRegex = /^\d{10}$/;
          return phoneRegex.test(value) ? null : "Phone must be 10 digits";
        }}
      />

      <button type="submit">Submit</button>
    </form>
  );
});

const FormExample = () => {
  const formRef = useRef<FormRef>(null);

  const handleExternalSubmit = () => {
    formRef.current?.submit();
  };

  const handleReset = () => {
    formRef.current?.reset();
  };

  const handleValidate = () => {
    const isValid = formRef.current?.validate();
    if (!isValid) {
      formRef.current?.focusFirstError();
    }
    alert(isValid ? "Form is valid" : "Form has errors");
  };

  return (
    <div>
      <AdvancedForm
        ref={formRef}
        onSubmit={(data) => console.log("Form submitted:", data)}
      />

      <div>
        <button onClick={handleExternalSubmit}>External Submit</button>
        <button onClick={handleReset}>Reset Form</button>
        <button onClick={handleValidate}>Validate</button>
      </div>
    </div>
  );
};
```

## Testing forwardRef Components

### Testing Ref Forwarding

```typescript
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("Button with forwardRef", () => {
  it("should forward ref to button element", () => {
    const ref = React.createRef<HTMLButtonElement>();

    render(<Button ref={ref}>Test Button</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.textContent).toBe("Test Button");
  });

  it("should focus button via ref", async () => {
    const ref = React.createRef<HTMLButtonElement>();

    render(<Button ref={ref}>Test Button</Button>);

    ref.current?.focus();

    expect(ref.current).toHaveFocus();
  });
});

describe("TextInput with useImperativeHandle", () => {
  it("should expose imperative methods", () => {
    const ref = React.createRef<TextInputRef>();

    render(<TextInput ref={ref} />);

    expect(ref.current).toHaveProperty("focus");
    expect(ref.current).toHaveProperty("clear");
    expect(ref.current).toHaveProperty("getValue");
    expect(ref.current).toHaveProperty("setValue");
  });

  it("should clear input via imperative method", () => {
    const ref = React.createRef<TextInputRef>();

    render(<TextInput ref={ref} defaultValue="test" />);

    expect(ref.current?.getValue()).toBe("test");

    ref.current?.clear();

    expect(ref.current?.getValue()).toBe("");
  });
});
```

## Performance Considerations

### Avoiding Unnecessary Re-renders

```typescript
// ❌ Poor performance: Creates new ref on every render
const BadExample = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Button ref={React.createRef()}>Button</Button>
      <span>{count}</span>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

// ✅ Good performance: Stable ref
const GoodExample = () => {
  const [count, setCount] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div>
      <Button ref={buttonRef}>Button</Button>
      <span>{count}</span>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

// ✅ Even better: Memoized component
const MemoizedButton = React.memo(Button);

const OptimizedExample = () => {
  const [count, setCount] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div>
      <MemoizedButton ref={buttonRef}>Button</MemoizedButton>
      <span>{count}</span>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};
```

## Best Practices

### Do's and Don'ts

```typescript
// ✅ Good: Always use displayName
const GoodComponent = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  return <div ref={ref} {...props} />;
});

GoodComponent.displayName = "GoodComponent";

// ❌ Bad: Missing displayName (debugging issues)
const BadComponent = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  return <div ref={ref} {...props} />;
});

// ✅ Good: Proper TypeScript types
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "primary" | "secondary";
}

const TypedButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, ...props }, ref) => {
    return <button ref={ref} data-variant={variant} {...props} />;
  }
);

// ✅ Good: Conditional ref forwarding
const ConditionalButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ disabled, ...props }, ref) => {
    return disabled ? <span {...props} /> : <button ref={ref} {...props} />;
  }
);
```

## Common Interview Questions

### Basic Questions

**Q: What is forwardRef in React?**

forwardRef is a React API that allows a component to take a ref it receives and pass it down to a child component. It's used to expose DOM elements or component instances to parent components.

```typescript
const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => (
  <input ref={ref} {...props} />
));
```

**Q: When would you use forwardRef?**

- Building reusable component libraries
- When parent components need direct access to child DOM elements
- For focus management, scrolling, or triggering animations
- When creating wrapper components that should expose the underlying element

**Q: What's the difference between ref and forwardRef?**

- `ref` is used to access DOM elements or component instances directly
- `forwardRef` is used to pass refs through component boundaries
- Regular function components can't receive refs directly, but forwardRef enables this

### Intermediate Questions

**Q: How do you type forwardRef components in TypeScript?**

```typescript
interface ButtonProps {
  variant: "primary" | "secondary";
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, children, ...props }, ref) => (
    <button ref={ref} data-variant={variant} {...props}>
      {children}
    </button>
  )
);
```

**Q: What is useImperativeHandle and how does it work with forwardRef?**

useImperativeHandle customizes the instance value exposed to parent components when using ref. It's used with forwardRef to expose custom methods:

```typescript
const CustomInput = React.forwardRef<
  { focus: () => void; getValue: () => string },
  InputProps
>((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    getValue: () => inputRef.current?.value || "",
  }));

  return <input ref={inputRef} {...props} />;
});
```

**Q: How do you handle multiple refs in a single component?**

```typescript
const MultiRefComponent = React.forwardRef<HTMLDivElement, Props>(
  (props, ref) => {
    const internalRef = useRef<HTMLDivElement>(null);

    // Merge external and internal refs
    const mergedRef = useMemo(() => {
      if (typeof ref === "function") {
        return (node: HTMLDivElement | null) => {
          ref(node);
          internalRef.current = node;
        };
      } else if (ref) {
        return (node: HTMLDivElement | null) => {
          ref.current = node;
          internalRef.current = node;
        };
      }
      return internalRef;
    }, [ref]);

    return <div ref={mergedRef} {...props} />;
  }
);
```

### Advanced Questions

**Q: How do you test components that use forwardRef?**

Test the ref forwarding behavior and exposed methods:

```typescript
test("forwards ref to underlying element", () => {
  const ref = React.createRef<HTMLButtonElement>();
  render(<Button ref={ref}>Test</Button>);

  expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  expect(ref.current?.textContent).toBe("Test");
});

test("exposes imperative methods", () => {
  const ref = React.createRef<CustomInputRef>();
  render(<CustomInput ref={ref} />);

  expect(typeof ref.current?.focus).toBe("function");
  expect(typeof ref.current?.getValue).toBe("function");
});
```

**Q: What are the performance implications of forwardRef?**

- forwardRef itself has minimal performance impact
- The main consideration is ref stability - avoid creating new refs on every render
- Use React.memo with forwardRef components when appropriate
- Be careful with useImperativeHandle dependencies to avoid unnecessary updates

**Q: How do you handle conditional ref forwarding?**

```typescript
const ConditionalRef = React.forwardRef<HTMLElement, Props>(
  ({ asButton, ...props }, ref) => {
    if (asButton) {
      return <button ref={ref as React.Ref<HTMLButtonElement>} {...props} />;
    }
    return <div ref={ref as React.Ref<HTMLDivElement>} {...props} />;
  }
);
```

forwardRef is essential for building flexible and reusable components that integrate well with the broader React ecosystem, enabling parent components to interact with child DOM elements when necessary while maintaining component encapsulation.
