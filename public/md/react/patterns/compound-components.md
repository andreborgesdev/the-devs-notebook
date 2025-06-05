# Compound Components Pattern

The Compound Components pattern allows you to create components that work together to form a complete UI, giving users control over how to arrange and use the components while maintaining a clear API.

## Basic Compound Component

### Simple Implementation

```tsx
interface ToggleContextType {
  on: boolean;
  toggle: () => void;
}

const ToggleContext = createContext<ToggleContextType | null>(null);

const useToggle = () => {
  const context = useContext(ToggleContext);
  if (!context) {
    throw new Error("Toggle compound components must be used within Toggle");
  }
  return context;
};

const Toggle = ({ children }: { children: React.ReactNode }) => {
  const [on, setOn] = useState(false);
  const toggle = () => setOn(!on);

  return (
    <ToggleContext.Provider value={{ on, toggle }}>
      {children}
    </ToggleContext.Provider>
  );
};

const ToggleButton = ({ children }: { children: React.ReactNode }) => {
  const { on, toggle } = useToggle();

  return (
    <button onClick={toggle} aria-pressed={on}>
      {children}
    </button>
  );
};

const ToggleOn = ({ children }: { children: React.ReactNode }) => {
  const { on } = useToggle();
  return on ? <>{children}</> : null;
};

const ToggleOff = ({ children }: { children: React.ReactNode }) => {
  const { on } = useToggle();
  return on ? null : <>{children}</>;
};

Toggle.Button = ToggleButton;
Toggle.On = ToggleOn;
Toggle.Off = ToggleOff;

export default Toggle;
```

### Usage

```tsx
const ToggleExample = () => {
  return (
    <Toggle>
      <Toggle.Button>
        <Toggle.On>Turn Off</Toggle.On>
        <Toggle.Off>Turn On</Toggle.Off>
      </Toggle.Button>

      <Toggle.On>
        <div className="success">Feature is ON!</div>
      </Toggle.On>

      <Toggle.Off>
        <div className="muted">Feature is off</div>
      </Toggle.Off>
    </Toggle>
  );
};

const CustomToggleLayout = () => {
  return (
    <Toggle>
      <div className="header">
        <h2>Settings</h2>
        <Toggle.Button>Toggle Feature</Toggle.Button>
      </div>

      <div className="content">
        <Toggle.On>
          <FeatureContent />
        </Toggle.On>
        <Toggle.Off>
          <DisabledMessage />
        </Toggle.Off>
      </div>
    </Toggle>
  );
};
```

## Advanced Compound Component

### Accordion Component

```tsx
interface AccordionContextType {
  openItems: Set<string>;
  toggleItem: (id: string) => void;
  allowMultiple: boolean;
}

const AccordionContext = createContext<AccordionContextType | null>(null);

const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion components must be used within Accordion");
  }
  return context;
};

interface AccordionProps {
  children: React.ReactNode;
  allowMultiple?: boolean;
  defaultOpen?: string[];
}

const Accordion = ({
  children,
  allowMultiple = false,
  defaultOpen = [],
}: AccordionProps) => {
  const [openItems, setOpenItems] = useState(new Set(defaultOpen));

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);

      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(id);
      }

      return newSet;
    });
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, allowMultiple }}>
      <div className="accordion" role="tablist">
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

interface AccordionItemProps {
  children: React.ReactNode;
  id: string;
}

const AccordionItem = ({ children, id }: AccordionItemProps) => {
  return (
    <div className="accordion-item" data-item-id={id}>
      {children}
    </div>
  );
};

interface AccordionHeaderProps {
  children: React.ReactNode;
  id: string;
}

const AccordionHeader = ({ children, id }: AccordionHeaderProps) => {
  const { openItems, toggleItem } = useAccordion();
  const isOpen = openItems.has(id);

  return (
    <button
      className={`accordion-header ${isOpen ? "open" : ""}`}
      onClick={() => toggleItem(id)}
      aria-expanded={isOpen}
      aria-controls={`panel-${id}`}
      id={`header-${id}`}
      role="tab"
    >
      {children}
      <span className={`icon ${isOpen ? "rotate" : ""}`}>▼</span>
    </button>
  );
};

interface AccordionPanelProps {
  children: React.ReactNode;
  id: string;
}

const AccordionPanel = ({ children, id }: AccordionPanelProps) => {
  const { openItems } = useAccordion();
  const isOpen = openItems.has(id);

  return (
    <div
      className={`accordion-panel ${isOpen ? "open" : ""}`}
      id={`panel-${id}`}
      aria-labelledby={`header-${id}`}
      role="tabpanel"
      hidden={!isOpen}
    >
      <div className="accordion-content">{children}</div>
    </div>
  );
};

Accordion.Item = AccordionItem;
Accordion.Header = AccordionHeader;
Accordion.Panel = AccordionPanel;

export default Accordion;
```

### Accordion Usage

```tsx
const AccordionExample = () => {
  return (
    <Accordion allowMultiple defaultOpen={["section1"]}>
      <Accordion.Item id="section1">
        <Accordion.Header id="section1">Getting Started</Accordion.Header>
        <Accordion.Panel id="section1">
          <p>This section covers the basics of getting started.</p>
          <ul>
            <li>Installation</li>
            <li>Setup</li>
            <li>First steps</li>
          </ul>
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item id="section2">
        <Accordion.Header id="section2">Advanced Features</Accordion.Header>
        <Accordion.Panel id="section2">
          <p>Learn about advanced features and configurations.</p>
          <div>
            <h4>Key Features:</h4>
            <p>Feature descriptions go here...</p>
          </div>
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item id="section3">
        <Accordion.Header id="section3">Troubleshooting</Accordion.Header>
        <Accordion.Panel id="section3">
          <p>Common issues and their solutions.</p>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};
```

## Complex Compound Component - Modal

```tsx
interface ModalContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("Modal components must be used within Modal");
  }
  return context;
};

interface ModalProps {
  children: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

const Modal = ({
  children,
  isOpen: controlledOpen,
  onOpenChange,
}: ModalProps) => {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const open = () => {
    if (isControlled) {
      onOpenChange?.(true);
    } else {
      setInternalOpen(true);
    }
  };

  const close = () => {
    if (isControlled) {
      onOpenChange?.(false);
    } else {
      setInternalOpen(false);
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <ModalContext.Provider value={{ isOpen, open, close }}>
      {children}
    </ModalContext.Provider>
  );
};

const ModalTrigger = ({
  children,
  asChild = false,
}: {
  children: React.ReactNode;
  asChild?: boolean;
}) => {
  const { open } = useModal();

  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: open,
    });
  }

  return <button onClick={open}>{children}</button>;
};

const ModalOverlay = ({ children }: { children: React.ReactNode }) => {
  const { isOpen, close } = useModal();

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={close}
      role="dialog"
      aria-modal="true"
    >
      {children}
    </div>
  );
};

const ModalContent = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { isOpen } = useModal();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      contentRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={contentRef}
      className={`modal-content ${className}`}
      onClick={(e) => e.stopPropagation()}
      tabIndex={-1}
      role="document"
    >
      {children}
    </div>
  );
};

const ModalHeader = ({ children }: { children: React.ReactNode }) => {
  return <div className="modal-header">{children}</div>;
};

const ModalTitle = ({ children }: { children: React.ReactNode }) => {
  return <h2 className="modal-title">{children}</h2>;
};

const ModalBody = ({ children }: { children: React.ReactNode }) => {
  return <div className="modal-body">{children}</div>;
};

const ModalFooter = ({ children }: { children: React.ReactNode }) => {
  return <div className="modal-footer">{children}</div>;
};

const ModalClose = ({
  children,
  asChild = false,
}: {
  children: React.ReactNode;
  asChild?: boolean;
}) => {
  const { close } = useModal();

  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: close,
    });
  }

  return (
    <button onClick={close} className="modal-close">
      {children}
    </button>
  );
};

Modal.Trigger = ModalTrigger;
Modal.Overlay = ModalOverlay;
Modal.Content = ModalContent;
Modal.Header = ModalHeader;
Modal.Title = ModalTitle;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
Modal.Close = ModalClose;

export default Modal;
```

### Modal Usage

```tsx
const ModalExample = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <div>
      {/* Controlled Modal */}
      <Modal isOpen={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <Modal.Trigger>
          <button className="danger">Delete Item</button>
        </Modal.Trigger>

        <Modal.Overlay>
          <Modal.Content>
            <Modal.Header>
              <Modal.Title>Confirm Deletion</Modal.Title>
              <Modal.Close asChild>
                <button className="close-icon">×</button>
              </Modal.Close>
            </Modal.Header>

            <Modal.Body>
              <p>
                Are you sure you want to delete this item? This action cannot be
                undone.
              </p>
            </Modal.Body>

            <Modal.Footer>
              <Modal.Close asChild>
                <button className="secondary">Cancel</button>
              </Modal.Close>
              <button
                className="danger"
                onClick={() => {
                  handleDelete();
                  setIsDeleteModalOpen(false);
                }}
              >
                Delete
              </button>
            </Modal.Footer>
          </Modal.Content>
        </Modal.Overlay>
      </Modal>

      {/* Uncontrolled Modal */}
      <Modal>
        <Modal.Trigger>
          <button>Open Settings</button>
        </Modal.Trigger>

        <Modal.Overlay>
          <Modal.Content className="settings-modal">
            <Modal.Header>
              <Modal.Title>Settings</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <SettingsForm />
            </Modal.Body>
          </Modal.Content>
        </Modal.Overlay>
      </Modal>
    </div>
  );
};
```

## Form Compound Component

```tsx
interface FormContextType {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  setValue: (name: string, value: any) => void;
  setError: (name: string, error: string) => void;
  setTouched: (name: string) => void;
  validate: () => boolean;
}

const FormContext = createContext<FormContextType | null>(null);

const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("Form components must be used within Form");
  }
  return context;
};

interface FormProps {
  children: React.ReactNode;
  onSubmit: (values: Record<string, any>) => void;
  validationSchema?: any;
  initialValues?: Record<string, any>;
}

const Form = ({
  children,
  onSubmit,
  validationSchema,
  initialValues = {},
}: FormProps) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const setValue = (name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const setError = (name: string, error: string) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const setTouched = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const validate = () => {
    if (!validationSchema) return true;

    try {
      validationSchema.validateSync(values, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      const newErrors: Record<string, string> = {};
      validationErrors.inner.forEach((error: any) => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(values);
    }
  };

  return (
    <FormContext.Provider
      value={{
        values,
        errors,
        touched,
        setValue,
        setError,
        setTouched,
        validate,
      }}
    >
      <form onSubmit={handleSubmit}>{children}</form>
    </FormContext.Provider>
  );
};

interface FieldProps {
  name: string;
  children: React.ReactNode;
}

const Field = ({ name, children }: FieldProps) => {
  const { errors, touched } = useForm();
  const hasError = touched[name] && errors[name];

  return (
    <div className={`field ${hasError ? "error" : ""}`}>
      {children}
      {hasError && <span className="error-message">{errors[name]}</span>}
    </div>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
}

const Input = ({ name, ...props }: InputProps) => {
  const { values, setValue, setTouched } = useForm();

  return (
    <input
      {...props}
      name={name}
      value={values[name] || ""}
      onChange={(e) => setValue(name, e.target.value)}
      onBlur={() => setTouched(name)}
    />
  );
};

const SubmitButton = ({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button type="submit" {...props}>
      {children}
    </button>
  );
};

Form.Field = Field;
Form.Input = Input;
Form.SubmitButton = SubmitButton;

export default Form;
```

## Benefits and Use Cases

### Benefits

1. **Flexibility**: Users control component composition
2. **Reusability**: Components can be reused in different contexts
3. **Maintainability**: Clear separation of concerns
4. **Accessibility**: Built-in accessibility features
5. **API Clarity**: Intuitive component relationships

### Use Cases

| Component Type | Use Case                          | Benefits                     |
| -------------- | --------------------------------- | ---------------------------- |
| Toggle         | Feature switches, UI state        | Simple state management      |
| Accordion      | FAQ sections, collapsible content | Space-efficient layouts      |
| Modal          | Dialogs, overlays                 | User interaction flows       |
| Form           | Data input, validation            | Form state management        |
| Tabs           | Content organization              | Navigation between sections  |
| Dropdown       | Menus, selects                    | Complex interaction patterns |

## Best Practices

1. **Context Usage**: Use React Context for component communication
2. **Error Boundaries**: Wrap compound components in error boundaries
3. **TypeScript**: Use TypeScript for better API contracts
4. **Accessibility**: Include ARIA attributes and keyboard navigation
5. **Composition**: Allow flexible component composition
6. **Documentation**: Provide clear usage examples
7. **Testing**: Test component interactions thoroughly

## Common Patterns

```tsx
// Provider Pattern
const ComponentProvider = ({ children }) => (
  <Context.Provider value={state}>{children}</Context.Provider>
);

// Static Methods Pattern
Component.SubComponent = SubComponent;

// Render Props Pattern (alternative)
const Component = ({ children }) => {
  return children({ state, actions });
};

// Hook Pattern
const useComponent = () => {
  const context = useContext(ComponentContext);
  return context;
};
```

The Compound Components pattern provides a powerful way to create flexible, reusable UI components that maintain clear APIs while allowing users maximum control over composition and layout.
