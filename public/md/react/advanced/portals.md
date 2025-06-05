# React Portals

React Portals provide a way to render components outside their parent component's DOM hierarchy. This is particularly useful for modals, tooltips, dropdowns, and other UI elements that need to appear above or outside the normal document flow while maintaining their React component relationship.

## Basic Portal Usage

### Creating a Simple Portal

```tsx
import { createPortal } from "react-dom";

interface PortalProps {
  children: React.ReactNode;
  container?: Element | DocumentFragment;
}

const Portal: React.FC<PortalProps> = ({
  children,
  container = document.body,
}) => {
  return createPortal(children, container);
};

const App: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="app">
      <h1>Main Application</h1>
      <button onClick={() => setShowModal(true)}>Open Modal</button>

      {showModal && (
        <Portal>
          <div className="modal-overlay">
            <div className="modal">
              <h2>Modal Content</h2>
              <p>This modal is rendered outside the app div!</p>
              <button onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
};
```

### Dynamic Portal Container

```tsx
const useDynamicPortal = (containerId?: string) => {
  const [container, setContainer] = useState<Element | null>(null);

  useEffect(() => {
    let element: Element;

    if (containerId) {
      element = document.getElementById(containerId) || document.body;
    } else {
      element = document.createElement("div");
      element.id = `portal-${Date.now()}`;
      document.body.appendChild(element);
    }

    setContainer(element);

    return () => {
      if (!containerId && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, [containerId]);

  const Portal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (!container) return null;
    return createPortal(children, container);
  };

  return Portal;
};

const DynamicModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const Portal = useDynamicPortal();

  if (!isOpen) return null;

  return (
    <Portal>
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>Dynamic Portal Modal</h2>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </Portal>
  );
};
```

## Modal Components with Portals

### Advanced Modal System

```tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: "small" | "medium" | "large" | "fullscreen";
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = "medium",
  closeOnOverlayClick = true,
  closeOnEscape = true,
  children,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<Element | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;

      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements && focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }

    return () => {
      if (previousActiveElement.current) {
        (previousActiveElement.current as HTMLElement).focus();
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Tab") {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>;

      if (focusableElements && focusableElements.length > 0) {
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className={`modal-overlay modal-size-${size}`}
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div ref={modalRef} className="modal-content" role="document">
        {title && (
          <div className="modal-header">
            <h2 id="modal-title">{title}</h2>
            <button
              className="modal-close"
              onClick={onClose}
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        )}
        <div className="modal-body">{children}</div>
      </div>
    </div>,
    document.body
  );
};
```

### Modal Manager Hook

```tsx
interface ModalConfig {
  id: string;
  component: React.ComponentType<any>;
  props?: any;
  options?: {
    persistent?: boolean;
    size?: "small" | "medium" | "large";
    closeOnOverlay?: boolean;
  };
}

const useModalManager = () => {
  const [modals, setModals] = useState<ModalConfig[]>([]);

  const openModal = useCallback((config: Omit<ModalConfig, "id">) => {
    const id = `modal-${Date.now()}-${Math.random()}`;
    const modalConfig: ModalConfig = { ...config, id };

    setModals((prev) => [...prev, modalConfig]);
    return id;
  }, []);

  const closeModal = useCallback((id: string) => {
    setModals((prev) => prev.filter((modal) => modal.id !== id));
  }, []);

  const closeAllModals = useCallback(() => {
    setModals((prev) => prev.filter((modal) => modal.options?.persistent));
  }, []);

  const updateModal = useCallback(
    (id: string, updates: Partial<ModalConfig>) => {
      setModals((prev) =>
        prev.map((modal) =>
          modal.id === id ? { ...modal, ...updates } : modal
        )
      );
    },
    []
  );

  const ModalRenderer: React.FC = () => (
    <>
      {modals.map((modal) => {
        const Component = modal.component;
        return (
          <Modal
            key={modal.id}
            isOpen={true}
            onClose={() => closeModal(modal.id)}
            size={modal.options?.size}
            closeOnOverlayClick={modal.options?.closeOnOverlay}
          >
            <Component {...modal.props} onClose={() => closeModal(modal.id)} />
          </Modal>
        );
      })}
    </>
  );

  return {
    modals,
    openModal,
    closeModal,
    closeAllModals,
    updateModal,
    ModalRenderer,
  };
};

const App: React.FC = () => {
  const { openModal, ModalRenderer } = useModalManager();

  const handleOpenConfirmDialog = () => {
    openModal({
      component: ConfirmDialog,
      props: {
        message: "Are you sure you want to delete this item?",
        onConfirm: () => console.log("Confirmed!"),
      },
      options: {
        size: "small",
        closeOnOverlay: false,
      },
    });
  };

  return (
    <div className="app">
      <button onClick={handleOpenConfirmDialog}>Open Confirm Dialog</button>
      <ModalRenderer />
    </div>
  );
};
```

## Tooltip Component

### Advanced Tooltip with Portal

```tsx
interface TooltipProps {
  content: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  trigger?: "hover" | "click" | "focus";
  delay?: number;
  children: React.ReactElement;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = "top",
  trigger = "hover",
  delay = 300,
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const scrollLeft =
      window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    let x = 0;
    let y = 0;

    switch (position) {
      case "top":
        x = triggerRect.left + triggerRect.width / 2 + scrollLeft;
        y = triggerRect.top + scrollTop;
        break;
      case "bottom":
        x = triggerRect.left + triggerRect.width / 2 + scrollLeft;
        y = triggerRect.bottom + scrollTop;
        break;
      case "left":
        x = triggerRect.left + scrollLeft;
        y = triggerRect.top + triggerRect.height / 2 + scrollTop;
        break;
      case "right":
        x = triggerRect.right + scrollLeft;
        y = triggerRect.top + triggerRect.height / 2 + scrollTop;
        break;
    }

    setTooltipPosition({ x, y });
  }, [position]);

  const showTooltip = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      calculatePosition();
      setIsVisible(true);
    }, delay);
  }, [calculatePosition, delay]);

  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      const handleScroll = () => {
        calculatePosition();
      };

      const handleResize = () => {
        calculatePosition();
      };

      window.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("scroll", handleScroll, true);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [isVisible, calculatePosition]);

  const clonedTrigger = React.cloneElement(children, {
    ref: triggerRef,
    ...(trigger === "hover" && {
      onMouseEnter: showTooltip,
      onMouseLeave: hideTooltip,
    }),
    ...(trigger === "click" && {
      onClick: () => setIsVisible(!isVisible),
    }),
    ...(trigger === "focus" && {
      onFocus: showTooltip,
      onBlur: hideTooltip,
    }),
  });

  return (
    <>
      {clonedTrigger}
      {isVisible &&
        createPortal(
          <div
            ref={tooltipRef}
            className={`tooltip tooltip-${position}`}
            style={{
              position: "absolute",
              left: tooltipPosition.x,
              top: tooltipPosition.y,
              transform: `translate(${
                position === "left"
                  ? "-100%"
                  : position === "right"
                  ? "0%"
                  : "-50%"
              }, ${
                position === "top"
                  ? "-100%"
                  : position === "bottom"
                  ? "0%"
                  : "-50%"
              })`,
              zIndex: 9999,
            }}
          >
            {content}
          </div>,
          document.body
        )}
    </>
  );
};

const TooltipExample: React.FC = () => {
  return (
    <div className="tooltip-examples">
      <Tooltip content="This is a top tooltip" position="top">
        <button>Hover for top tooltip</button>
      </Tooltip>

      <Tooltip content="Click tooltip!" trigger="click" position="bottom">
        <button>Click for bottom tooltip</button>
      </Tooltip>

      <Tooltip
        content={
          <div>
            <strong>Rich Content Tooltip</strong>
            <p>This tooltip can contain any React content!</p>
          </div>
        }
        position="right"
      >
        <span>Rich content tooltip</span>
      </Tooltip>
    </div>
  );
};
```

## Dropdown and Menu Components

### Dropdown with Portal

```tsx
interface DropdownProps {
  trigger: React.ReactElement;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  placement?: "bottom-start" | "bottom-end" | "top-start" | "top-end";
  closeOnClickOutside?: boolean;
  closeOnItemClick?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  isOpen: controlledIsOpen,
  onToggle,
  placement = "bottom-start",
  closeOnClickOutside = true,
  closeOnItemClick = true,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const triggerRef = useRef<HTMLElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const setIsOpen = useCallback(
    (open: boolean) => {
      if (onToggle) {
        onToggle(open);
      } else {
        setInternalIsOpen(open);
      }
    },
    [onToggle]
  );

  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const scrollLeft =
      window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    let x = triggerRect.left + scrollLeft;
    let y = triggerRect.bottom + scrollTop;

    switch (placement) {
      case "bottom-start":
        x = triggerRect.left + scrollLeft;
        y = triggerRect.bottom + scrollTop;
        break;
      case "bottom-end":
        x = triggerRect.right + scrollLeft;
        y = triggerRect.bottom + scrollTop;
        break;
      case "top-start":
        x = triggerRect.left + scrollLeft;
        y = triggerRect.top + scrollTop;
        break;
      case "top-end":
        x = triggerRect.right + scrollLeft;
        y = triggerRect.top + scrollTop;
        break;
    }

    setDropdownPosition({ x, y });
  }, [placement]);

  useEffect(() => {
    if (isOpen) {
      calculatePosition();
    }
  }, [isOpen, calculatePosition]);

  useEffect(() => {
    if (!closeOnClickOutside || !isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, closeOnClickOutside, setIsOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, setIsOpen]);

  const clonedTrigger = React.cloneElement(trigger, {
    ref: triggerRef,
    onClick: () => setIsOpen(!isOpen),
    "aria-expanded": isOpen,
    "aria-haspopup": true,
  });

  const handleItemClick = useCallback(() => {
    if (closeOnItemClick) {
      setIsOpen(false);
    }
  }, [closeOnItemClick, setIsOpen]);

  return (
    <>
      {clonedTrigger}
      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className={`dropdown dropdown-${placement}`}
            style={{
              position: "absolute",
              left: dropdownPosition.x,
              top: dropdownPosition.y,
              transform: placement.includes("end") ? "translateX(-100%)" : "",
              zIndex: 1000,
            }}
            onClick={handleItemClick}
          >
            {children}
          </div>,
          document.body
        )}
    </>
  );
};

const DropdownExample: React.FC = () => {
  return (
    <div className="dropdown-examples">
      <Dropdown trigger={<button>Open Menu</button>} placement="bottom-start">
        <div className="dropdown-menu">
          <button className="dropdown-item">Edit</button>
          <button className="dropdown-item">Delete</button>
          <hr className="dropdown-divider" />
          <button className="dropdown-item">Settings</button>
        </div>
      </Dropdown>
    </div>
  );
};
```

## Notification System

### Toast Notifications with Portal

```tsx
interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  actions?: Array<{
    label: string;
    onClick: () => void;
  }>;
}

interface ToastContextType {
  addToast: (toast: Omit<Toast, "id">) => string;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toastData: Omit<Toast, "id">) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const toast: Toast = { ...toastData, id };

    setToasts((prev) => [...prev, toast]);

    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || 5000);
    }

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const ToastContainer: React.FC = () => {
    if (toasts.length === 0) return null;

    return createPortal(
      <div className="toast-container">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onRemove={() => removeToast(toast.id)}
          />
        ))}
      </div>,
      document.body
    );
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast, clearAllToasts }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

interface ToastItemProps {
  toast: Toast;
  onRemove: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleRemove = useCallback(() => {
    setIsLeaving(true);
    setTimeout(onRemove, 300); // Animation duration
  }, [onRemove]);

  return (
    <div
      className={`toast toast-${toast.type} ${isVisible ? "toast-enter" : ""} ${
        isLeaving ? "toast-exit" : ""
      }`}
    >
      <div className="toast-icon">
        {toast.type === "success" && "✓"}
        {toast.type === "error" && "✕"}
        {toast.type === "warning" && "⚠"}
        {toast.type === "info" && "ℹ"}
      </div>

      <div className="toast-content">
        <div className="toast-title">{toast.title}</div>
        {toast.message && <div className="toast-message">{toast.message}</div>}

        {toast.actions && (
          <div className="toast-actions">
            {toast.actions.map((action, index) => (
              <button
                key={index}
                className="toast-action"
                onClick={action.onClick}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <button className="toast-close" onClick={handleRemove}>
        ×
      </button>
    </div>
  );
};

const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

const ToastExample: React.FC = () => {
  const { addToast } = useToast();

  const showSuccessToast = () => {
    addToast({
      type: "success",
      title: "Success!",
      message: "Your changes have been saved.",
      duration: 3000,
    });
  };

  const showErrorToast = () => {
    addToast({
      type: "error",
      title: "Error occurred",
      message: "Failed to save changes. Please try again.",
      duration: 0, // Persistent
      actions: [
        {
          label: "Retry",
          onClick: () => console.log("Retrying..."),
        },
      ],
    });
  };

  return (
    <div>
      <button onClick={showSuccessToast}>Show Success</button>
      <button onClick={showErrorToast}>Show Error</button>
    </div>
  );
};
```

## Performance and Accessibility

### Optimized Portal Hook

```tsx
const useOptimizedPortal = (containerId?: string) => {
  const [container, setContainer] = useState<Element | null>(null);

  useEffect(() => {
    let element: Element;
    let shouldCleanup = false;

    if (containerId) {
      element = document.getElementById(containerId);
      if (!element) {
        element = document.createElement("div");
        element.id = containerId;
        document.body.appendChild(element);
        shouldCleanup = true;
      }
    } else {
      element = document.createElement("div");
      document.body.appendChild(element);
      shouldCleanup = true;
    }

    setContainer(element);

    return () => {
      if (shouldCleanup && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, [containerId]);

  const Portal = useMemo(() => {
    return ({ children }: { children: React.ReactNode }) => {
      if (!container) return null;
      return createPortal(children, container);
    };
  }, [container]);

  return Portal;
};
```

### Accessible Modal with Focus Management

```tsx
const useAccessibleModal = (isOpen: boolean) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<Element | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previousActiveElement.current = document.activeElement;

    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    if (focusableElements && focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !focusableElements) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTabKey);

    return () => {
      document.removeEventListener("keydown", handleTabKey);
      if (previousActiveElement.current) {
        (previousActiveElement.current as HTMLElement).focus();
      }
    };
  }, [isOpen]);

  return modalRef;
};
```

## Testing Portals

### Testing Portal Components

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "./Modal";

describe("Modal Portal", () => {
  beforeEach(() => {
    const modalRoot = document.createElement("div");
    modalRoot.setAttribute("id", "modal-root");
    document.body.appendChild(modalRoot);
  });

  afterEach(() => {
    const modalRoot = document.getElementById("modal-root");
    if (modalRoot) {
      document.body.removeChild(modalRoot);
    }
  });

  it("should render modal content in portal", () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.getByText("Modal Content")).toBeInTheDocument();

    const modalElement = document.querySelector(".modal-overlay");
    expect(modalElement).toBeInTheDocument();
    expect(modalElement?.parentElement).toBe(document.body);
  });

  it("should handle escape key to close modal", async () => {
    const onClose = jest.fn();
    const user = userEvent.setup();

    render(
      <Modal isOpen={true} onClose={onClose}>
        <div>Modal Content</div>
      </Modal>
    );

    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });

  it("should trap focus within modal", async () => {
    const user = userEvent.setup();

    render(
      <Modal isOpen={true} onClose={() => {}}>
        <div>
          <button>First Button</button>
          <button>Second Button</button>
        </div>
      </Modal>
    );

    const firstButton = screen.getByText("First Button");
    const secondButton = screen.getByText("Second Button");

    expect(firstButton).toHaveFocus();

    await user.tab();
    expect(secondButton).toHaveFocus();

    await user.tab();
    expect(firstButton).toHaveFocus(); // Focus should wrap
  });

  it("should close modal when clicking overlay", async () => {
    const onClose = jest.fn();
    const user = userEvent.setup();

    render(
      <Modal isOpen={true} onClose={onClose} closeOnOverlayClick={true}>
        <div>Modal Content</div>
      </Modal>
    );

    const overlay = document.querySelector(".modal-overlay");
    await user.click(overlay!);

    expect(onClose).toHaveBeenCalled();
  });

  it("should not close modal when clicking content", async () => {
    const onClose = jest.fn();
    const user = userEvent.setup();

    render(
      <Modal isOpen={true} onClose={onClose} closeOnOverlayClick={true}>
        <div>Modal Content</div>
      </Modal>
    );

    await user.click(screen.getByText("Modal Content"));
    expect(onClose).not.toHaveBeenCalled();
  });
});
```

### Testing Toast Notifications

```tsx
describe("Toast Notifications", () => {
  it("should display toast notification", () => {
    render(
      <ToastProvider>
        <ToastExample />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText("Show Success"));

    expect(screen.getByText("Success!")).toBeInTheDocument();
    expect(
      screen.getByText("Your changes have been saved.")
    ).toBeInTheDocument();
  });

  it("should remove toast after duration", async () => {
    jest.useFakeTimers();

    render(
      <ToastProvider>
        <ToastExample />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText("Show Success"));
    expect(screen.getByText("Success!")).toBeInTheDocument();

    jest.advanceTimersByTime(3000);

    await waitFor(() => {
      expect(screen.queryByText("Success!")).not.toBeInTheDocument();
    });

    jest.useRealTimers();
  });
});
```

## Best Practices

### Portal Guidelines

1. **Use portals for UI that needs to escape parent containers**: Modals, tooltips, dropdowns
2. **Maintain React component hierarchy**: Even though DOM is different, React relationships remain
3. **Handle cleanup properly**: Remove portal containers when components unmount
4. **Manage focus correctly**: Ensure accessibility standards are met
5. **Consider z-index management**: Use consistent layering strategies

### Performance Optimization

```tsx
const OptimizedPortal: React.FC<{ children: React.ReactNode }> = memo(
  ({ children }) => {
    const [container] = useState(() => document.createElement("div"));

    useEffect(() => {
      document.body.appendChild(container);
      return () => {
        if (container.parentNode) {
          container.parentNode.removeChild(container);
        }
      };
    }, [container]);

    return createPortal(children, container);
  }
);
```

## Interview Questions

### Basic Questions

**Q: What are React Portals and when would you use them?**

A: React Portals provide a way to render components outside their parent component's DOM hierarchy while maintaining their React component relationship. They're useful for:

- Modals and overlays
- Tooltips and popovers
- Dropdown menus
- Notifications/toasts
- Any UI that needs to escape parent container constraints (z-index, overflow, etc.)

**Q: How do you create a portal in React?**

A: Portals are created using `createPortal` from `react-dom`:

```tsx
import { createPortal } from "react-dom";

const Modal = ({ children }) => {
  return createPortal(<div className="modal">{children}</div>, document.body);
};
```

**Q: Do event handlers work normally with portals?**

A: Yes, events bubble up through the React component tree, not the DOM tree. So event handlers work normally even though the DOM structure is different.

### Intermediate Questions

**Q: How do you handle focus management in portal components?**

A: Focus management in portals requires manual handling:

```tsx
const useModalFocus = (isOpen) => {
  const modalRef = useRef();
  const previousActiveElement = useRef();

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements?.[0]) {
        focusableElements[0].focus();
      }
    }

    return () => {
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen]);

  return modalRef;
};
```

**Q: How do you implement a reusable portal hook?**

A: A reusable portal hook can manage container creation and cleanup:

```tsx
const usePortal = (containerId) => {
  const [container, setContainer] = useState(null);

  useEffect(() => {
    let element;
    if (containerId) {
      element = document.getElementById(containerId) || document.body;
    } else {
      element = document.createElement("div");
      document.body.appendChild(element);
    }

    setContainer(element);

    return () => {
      if (!containerId && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, [containerId]);

  const Portal = ({ children }) => {
    if (!container) return null;
    return createPortal(children, container);
  };

  return Portal;
};
```

**Q: How do you handle cleanup when using portals?**

A: Cleanup involves removing created DOM elements and restoring focus:

```tsx
useEffect(() => {
  const portalContainer = document.createElement("div");
  document.body.appendChild(portalContainer);

  return () => {
    if (portalContainer.parentNode) {
      portalContainer.parentNode.removeChild(portalContainer);
    }
  };
}, []);
```

### Advanced Questions

**Q: How do you implement a modal manager using portals?**

A: A modal manager coordinates multiple modals and their lifecycle:

```tsx
const useModalManager = () => {
  const [modals, setModals] = useState([]);

  const openModal = useCallback((config) => {
    const id = `modal-${Date.now()}`;
    setModals((prev) => [...prev, { ...config, id }]);
    return id;
  }, []);

  const closeModal = useCallback((id) => {
    setModals((prev) => prev.filter((modal) => modal.id !== id));
  }, []);

  const ModalRenderer = () => (
    <>
      {modals.map((modal) => {
        const Component = modal.component;
        return (
          <Portal key={modal.id}>
            <Component {...modal.props} onClose={() => closeModal(modal.id)} />
          </Portal>
        );
      })}
    </>
  );

  return { openModal, closeModal, ModalRenderer };
};
```

**Q: How do you optimize portal performance?**

A: Portal performance optimization strategies:

1. **Memoize portal components**: Use `React.memo` to prevent unnecessary re-renders
2. **Reuse containers**: Don't create new DOM elements unnecessarily
3. **Lazy portal creation**: Only create portals when needed
4. **Proper cleanup**: Remove DOM elements to prevent memory leaks

```tsx
const OptimizedPortal = memo(({ children, containerId }) => {
  const container = useMemo(() => {
    return containerId
      ? document.getElementById(containerId)
      : document.createElement("div");
  }, [containerId]);

  useEffect(() => {
    if (!containerId) {
      document.body.appendChild(container);
      return () => {
        if (container.parentNode) {
          container.parentNode.removeChild(container);
        }
      };
    }
  }, [container, containerId]);

  return createPortal(children, container);
});
```

**Q: How do you test components that use portals?**

A: Testing portal components requires setup for the portal container:

```tsx
describe("Portal Component", () => {
  beforeEach(() => {
    const portalRoot = document.createElement("div");
    portalRoot.setAttribute("id", "portal-root");
    document.body.appendChild(portalRoot);
  });

  afterEach(() => {
    const portalRoot = document.getElementById("portal-root");
    if (portalRoot) {
      document.body.removeChild(portalRoot);
    }
  });

  it("should render content in portal", () => {
    render(<PortalComponent>Test Content</PortalComponent>);

    expect(screen.getByText("Test Content")).toBeInTheDocument();

    const portalElement = document.querySelector("#portal-root");
    expect(portalElement).toContainElement(screen.getByText("Test Content"));
  });
});
```

**Q: What are the accessibility considerations for portals?**

A: Accessibility considerations for portals include:

1. **Focus management**: Trap focus within modals, restore focus on close
2. **ARIA attributes**: Use proper roles, labels, and descriptions
3. **Keyboard navigation**: Support Escape key, Tab navigation
4. **Screen reader support**: Announce modal opening/closing
5. **Focus restoration**: Return focus to triggering element

```tsx
const AccessibleModal = ({ isOpen, onClose, children }) => {
  const modalRef = useRef();

  useEffect(() => {
    if (isOpen) {
      const previousFocus = document.activeElement;
      modalRef.current?.focus();

      return () => {
        previousFocus?.focus();
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div ref={modalRef} tabIndex={-1}>
        {children}
      </div>
    </div>,
    document.body
  );
};
```
