# React Snapshot Testing

Snapshot testing captures component output at a point in time and compares it against future renders to detect unexpected changes.

## Jest Snapshot Testing

### Basic Snapshot Tests

```tsx
import { render } from "@testing-library/react";
import { Button } from "./Button";

interface ButtonProps {
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  children: ReactNode;
  onClick?: () => void;
}

function Button({
  variant = "primary",
  size = "medium",
  disabled = false,
  children,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

describe("Button Component", () => {
  it("should match snapshot with default props", () => {
    const { container } = render(<Button>Click me</Button>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should match snapshot with primary variant", () => {
    const { container } = render(
      <Button variant="primary">Primary Button</Button>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should match snapshot with secondary variant", () => {
    const { container } = render(
      <Button variant="secondary">Secondary Button</Button>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should match snapshot when disabled", () => {
    const { container } = render(<Button disabled>Disabled Button</Button>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should match snapshot with different sizes", () => {
    const sizes: Array<"small" | "medium" | "large"> = [
      "small",
      "medium",
      "large",
    ];

    sizes.forEach((size) => {
      const { container } = render(<Button size={size}>{size} Button</Button>);
      expect(container.firstChild).toMatchSnapshot(`button-${size}`);
    });
  });
});
```

### Complex Component Snapshots

```tsx
import { render } from "@testing-library/react";
import { UserCard } from "./UserCard";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "admin" | "user" | "moderator";
  isOnline: boolean;
  lastSeen: Date;
}

function UserCard({
  user,
  showActions = true,
}: {
  user: User;
  showActions?: boolean;
}) {
  return (
    <div className="user-card">
      <div className="user-avatar">
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} />
        ) : (
          <div className="avatar-placeholder">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <span className={`status ${user.isOnline ? "online" : "offline"}`} />
      </div>

      <div className="user-info">
        <h3>{user.name}</h3>
        <p>{user.email}</p>
        <span className={`role role-${user.role}`}>{user.role}</span>

        {!user.isOnline && (
          <p className="last-seen">
            Last seen: {user.lastSeen.toLocaleDateString()}
          </p>
        )}
      </div>

      {showActions && (
        <div className="user-actions">
          <button>Edit</button>
          <button>Delete</button>
        </div>
      )}
    </div>
  );
}

describe("UserCard Component", () => {
  const mockUser: User = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    isOnline: true,
    lastSeen: new Date("2023-01-01T12:00:00Z"),
  };

  it("should match snapshot for online user", () => {
    const { container } = render(<UserCard user={mockUser} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should match snapshot for offline user", () => {
    const offlineUser = { ...mockUser, isOnline: false };
    const { container } = render(<UserCard user={offlineUser} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should match snapshot without actions", () => {
    const { container } = render(
      <UserCard user={mockUser} showActions={false} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should match snapshot with avatar", () => {
    const userWithAvatar = {
      ...mockUser,
      avatar: "https://example.com/avatar.jpg",
    };
    const { container } = render(<UserCard user={userWithAvatar} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should match snapshot for different roles", () => {
    const roles: Array<"admin" | "user" | "moderator"> = [
      "admin",
      "user",
      "moderator",
    ];

    roles.forEach((role) => {
      const userWithRole = { ...mockUser, role };
      const { container } = render(<UserCard user={userWithRole} />);
      expect(container.firstChild).toMatchSnapshot(`user-card-${role}`);
    });
  });
});
```

### Snapshot with Props Variations

```tsx
import { render } from "@testing-library/react";
import { Alert } from "./Alert";

interface AlertProps {
  type: "success" | "warning" | "error" | "info";
  title?: string;
  message: string;
  dismissible?: boolean;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary";
  }>;
}

function Alert({
  type,
  title,
  message,
  dismissible = false,
  actions,
}: AlertProps) {
  return (
    <div className={`alert alert-${type}`}>
      {dismissible && (
        <button className="alert-close" aria-label="Close">
          ×
        </button>
      )}

      {title && <h4 className="alert-title">{title}</h4>}
      <p className="alert-message">{message}</p>

      {actions && actions.length > 0 && (
        <div className="alert-actions">
          {actions.map((action, index) => (
            <button
              key={index}
              className={`btn btn-${action.variant || "primary"}`}
              onClick={action.onClick}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

describe("Alert Component", () => {
  const baseProps = {
    message: "This is a test message",
  };

  describe("Alert Types", () => {
    const types: Array<"success" | "warning" | "error" | "info"> = [
      "success",
      "warning",
      "error",
      "info",
    ];

    types.forEach((type) => {
      it(`should match snapshot for ${type} alert`, () => {
        const { container } = render(<Alert {...baseProps} type={type} />);
        expect(container.firstChild).toMatchSnapshot();
      });
    });
  });

  describe("Alert Variations", () => {
    it("should match snapshot with title", () => {
      const { container } = render(
        <Alert {...baseProps} type="info" title="Information" />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("should match snapshot when dismissible", () => {
      const { container } = render(
        <Alert {...baseProps} type="warning" dismissible />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("should match snapshot with actions", () => {
      const actions = [
        { label: "Confirm", onClick: jest.fn(), variant: "primary" as const },
        { label: "Cancel", onClick: jest.fn(), variant: "secondary" as const },
      ];

      const { container } = render(
        <Alert {...baseProps} type="error" actions={actions} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("should match snapshot with all props", () => {
      const actions = [{ label: "OK", onClick: jest.fn() }];

      const { container } = render(
        <Alert
          type="success"
          title="Success!"
          message="Operation completed successfully"
          dismissible
          actions={actions}
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
```

### Inline Snapshots

```tsx
import { render } from "@testing-library/react";
import { Badge } from "./Badge";

function Badge({
  children,
  variant = "default",
  size = "medium",
}: {
  children: ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "danger";
  size?: "small" | "medium" | "large";
}) {
  return (
    <span className={`badge badge-${variant} badge-${size}`}>{children}</span>
  );
}

describe("Badge Component", () => {
  it("should render default badge", () => {
    const { container } = render(<Badge>Default</Badge>);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <span
        class="badge badge-default badge-medium"
      >
        Default
      </span>
    `);
  });

  it("should render primary badge", () => {
    const { container } = render(<Badge variant="primary">Primary</Badge>);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <span
        class="badge badge-primary badge-medium"
      >
        Primary
      </span>
    `);
  });

  it("should render small badge", () => {
    const { container } = render(<Badge size="small">Small</Badge>);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <span
        class="badge badge-default badge-small"
      >
        Small
      </span>
    `);
  });
});
```

## Property-Based Snapshot Testing

### Generating Test Cases

```tsx
import { render } from "@testing-library/react";
import { Card } from "./Card";

interface CardProps {
  title?: string;
  content: string;
  footer?: string;
  variant?: "default" | "bordered" | "elevated";
  clickable?: boolean;
}

function Card({
  title,
  content,
  footer,
  variant = "default",
  clickable = false,
}: CardProps) {
  return (
    <div
      className={`card card-${variant} ${clickable ? "card-clickable" : ""}`}
    >
      {title && <div className="card-header">{title}</div>}
      <div className="card-body">{content}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}

describe("Card Component", () => {
  const testCases = [
    {
      name: "minimal card",
      props: { content: "Simple content" },
    },
    {
      name: "card with title",
      props: {
        title: "Card Title",
        content: "Card content",
      },
    },
    {
      name: "card with footer",
      props: {
        content: "Card content",
        footer: "Card footer",
      },
    },
    {
      name: "complete card",
      props: {
        title: "Complete Card",
        content: "This is the content",
        footer: "Footer text",
      },
    },
    {
      name: "bordered clickable card",
      props: {
        title: "Clickable Card",
        content: "Click me!",
        variant: "bordered" as const,
        clickable: true,
      },
    },
    {
      name: "elevated card",
      props: {
        content: "Elevated card content",
        variant: "elevated" as const,
      },
    },
  ];

  testCases.forEach(({ name, props }) => {
    it(`should match snapshot for ${name}`, () => {
      const { container } = render(<Card {...props} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
```

### Dynamic Content Snapshots

```tsx
import { render } from "@testing-library/react";
import { PostList } from "./PostList";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: Date;
  tags: string[];
}

function PostList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return <div className="empty-state">No posts found</div>;
  }

  return (
    <div className="post-list">
      {posts.map((post) => (
        <article key={post.id} className="post-item">
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
          <div className="post-meta">
            <span>By {post.author}</span>
            <span>{post.publishedAt.toLocaleDateString()}</span>
          </div>
          <div className="post-tags">
            {post.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

describe("PostList Component", () => {
  const createMockPost = (overrides = {}): Post => ({
    id: "1",
    title: "Test Post",
    excerpt: "This is a test post excerpt",
    author: "John Doe",
    publishedAt: new Date("2023-01-01T12:00:00Z"),
    tags: ["react", "testing"],
    ...overrides,
  });

  it("should match snapshot with empty posts", () => {
    const { container } = render(<PostList posts={[]} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should match snapshot with single post", () => {
    const posts = [createMockPost()];
    const { container } = render(<PostList posts={posts} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should match snapshot with multiple posts", () => {
    const posts = [
      createMockPost({ id: "1", title: "First Post" }),
      createMockPost({
        id: "2",
        title: "Second Post",
        author: "Jane Smith",
        tags: ["javascript", "web"],
      }),
      createMockPost({
        id: "3",
        title: "Third Post",
        excerpt: "Different excerpt for third post",
        tags: ["react", "hooks", "testing"],
      }),
    ];

    const { container } = render(<PostList posts={posts} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
```

## Snapshot Serializers

### Custom Serializers

```tsx
import { render } from "@testing-library/react";

expect.addSnapshotSerializer({
  test: (val) =>
    val && typeof val.type === "string" && val.type.includes("Date"),
  serialize: (val) => `Date: ${val.toISOString()}`,
});

expect.addSnapshotSerializer({
  test: (val) => val && val.$$typeof === Symbol.for("react.element"),
  serialize: (val, config, indentation, depth, refs, printer) => {
    const props = { ...val.props };
    delete props.children;

    return `<${val.type}${
      Object.keys(props).length > 0
        ? " " +
          Object.keys(props)
            .map((key) => `${key}=${JSON.stringify(props[key])}`)
            .join(" ")
        : ""
    }>${
      val.props.children
        ? printer(val.props.children, config, indentation, depth, refs)
        : ""
    }</${val.type}>`;
  },
});

function TimestampComponent({ timestamp }: { timestamp: Date }) {
  return (
    <div>
      <span>Current time: {timestamp.toISOString()}</span>
    </div>
  );
}

describe("TimestampComponent", () => {
  it("should match snapshot with custom serializer", () => {
    const fixedDate = new Date("2023-01-01T12:00:00Z");
    const { container } = render(<TimestampComponent timestamp={fixedDate} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
```

### Ignoring Dynamic Values

```tsx
import { render } from "@testing-library/react";
import { v4 as uuidv4 } from "uuid";

function generateSnapshot(component: ReactElement) {
  const { container } = render(component);
  const html = container.innerHTML;

  return html
    .replace(/id="[^"]*"/g, 'id="[DYNAMIC_ID]"')
    .replace(/data-testid="[^"]*-\d+"/g, 'data-testid="[DYNAMIC_TESTID]"')
    .replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/g, "[TIMESTAMP]");
}

function DynamicComponent() {
  const id = uuidv4();
  const timestamp = new Date();

  return (
    <div id={id} data-testid={`component-${Date.now()}`}>
      <span>Generated at: {timestamp.toISOString()}</span>
      <input id={`input-${id}`} />
    </div>
  );
}

describe("DynamicComponent", () => {
  it("should match snapshot ignoring dynamic values", () => {
    const snapshot = generateSnapshot(<DynamicComponent />);
    expect(snapshot).toMatchSnapshot();
  });
});
```

## Snapshot Testing Best Practices

### Focused Snapshots

```tsx
import { render } from "@testing-library/react";
import { ComplexForm } from "./ComplexForm";

describe("ComplexForm Component", () => {
  it("should match snapshot for form structure only", () => {
    const { container } = render(<ComplexForm />);

    const formStructure = container.querySelector("form");
    const fieldsets = Array.from(
      formStructure?.querySelectorAll("fieldset") || []
    ).map((fieldset) => ({
      legend: fieldset.querySelector("legend")?.textContent,
      fields: Array.from(
        fieldset.querySelectorAll("input, select, textarea")
      ).map((field) => ({
        type: field.tagName.toLowerCase(),
        name: field.getAttribute("name"),
        required: field.hasAttribute("required"),
      })),
    }));

    expect(fieldsets).toMatchSnapshot();
  });

  it("should match snapshot for validation errors", () => {
    const { container } = render(<ComplexForm />);

    const errorElements = container.querySelectorAll(".error-message");
    const errors = Array.from(errorElements).map((el) => ({
      field: el.getAttribute("data-field"),
      message: el.textContent,
    }));

    expect(errors).toMatchSnapshot();
  });
});
```

### Snapshot Testing Hooks

```tsx
import { renderHook } from "@testing-library/react";
import { useCounter } from "./useCounter";

describe("useCounter Hook", () => {
  it("should match snapshot for initial state", () => {
    const { result } = renderHook(() => useCounter(0));

    expect({
      count: result.current.count,
      actions: Object.keys(result.current).filter((key) => key !== "count"),
    }).toMatchInlineSnapshot(`
      {
        "actions": [
          "increment",
          "decrement",
          "reset",
        ],
        "count": 0,
      }
    `);
  });

  it("should match snapshot after state changes", () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.increment();
      result.current.increment();
    });

    expect({
      count: result.current.count,
      hasIncremented: result.current.count > 5,
    }).toMatchInlineSnapshot(`
      {
        "count": 7,
        "hasIncremented": true,
      }
    `);
  });
});
```

### Snapshot Organization

```tsx
describe("Navigation Component", () => {
  describe("Desktop Navigation", () => {
    beforeEach(() => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 1024,
      });
    });

    it("should match desktop navigation snapshot", () => {
      const { container } = render(<Navigation />);
      expect(container.firstChild).toMatchSnapshot("desktop-navigation");
    });
  });

  describe("Mobile Navigation", () => {
    beforeEach(() => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 375,
      });
    });

    it("should match mobile navigation snapshot", () => {
      const { container } = render(<Navigation />);
      expect(container.firstChild).toMatchSnapshot("mobile-navigation");
    });

    it("should match mobile menu open snapshot", () => {
      const { container } = render(<Navigation defaultOpen />);
      expect(container.firstChild).toMatchSnapshot("mobile-menu-open");
    });
  });
});
```

## Updating Snapshots

### Selective Updates

```bash
npm test -- --updateSnapshot

npm test -- -u

npm test -- --testNamePattern="Button" --updateSnapshot

npm test Component.test.tsx --updateSnapshot
```

### Review Process

```tsx
describe("Updated Component", () => {
  it("should review snapshot changes carefully", () => {
    const { container } = render(<UpdatedComponent />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
```

## Interview Questions

**Q: When should you use snapshot testing?**
A: Use snapshot testing for components with stable output, regression prevention, and detecting unintended changes. Avoid for components with dynamic content or frequently changing UI.

**Q: How do you handle dynamic data in snapshots?**
A: Mock dynamic values, use custom serializers, or normalize data before snapshotting. Focus on structural changes rather than dynamic content.

**Q: What are the pros and cons of snapshot testing?**
A: Pros: Easy to write, catches regressions, good for stable components. Cons: Brittle with frequent changes, can hide real issues, requires careful review of updates.

**Q: How do you organize snapshot files?**
A: Use descriptive names, group related snapshots, create focused snapshots for specific features, and keep snapshots in version control for team review.

**Q: When should you update snapshots?**
A: Update when intentional changes are made, after careful review of differences, when refactoring components, or when fixing bugs that change output.
