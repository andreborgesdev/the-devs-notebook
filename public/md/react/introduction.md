# React

## Overview

**React** is a **JavaScript library for building user interfaces**, developed by Facebook. It emphasizes building UIs from encapsulated components, enabling efficient, declarative rendering and state management.

| Feature             | Description                                           |
| ------------------- | ----------------------------------------------------- |
| Declarative         | Describe what you want the UI to look like            |
| Component-based     | Build encapsulated, reusable UI components            |
| Unidirectional data | Data flows from parent to child                       |
| Virtual DOM         | Efficiently updates and renders the UI                |
| JSX                 | JavaScript syntax extension for defining UI structure |

## Key Concepts

### JSX

```javascript
const element = <h1>Hello, world!</h1>;
```

- Syntax extension mixing JavaScript and HTML.
- Transpiled by Babel to `React.createElement()`.

### Components

**Function Component**

```javascript
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

**Class Component**

```javascript
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

### Props

- Read-only data passed from parent to child components.

```javascript
<Welcome name="Alice" />
```

### State

- Local mutable data managed inside components.

```javascript
const [count, setCount] = React.useState(0);
```

### Event Handling

```javascript
<button onClick={() => setCount(count + 1)}>Click me</button>
```

## Lifecycle Methods (Class Components)

| Method               | Description                                       |
| -------------------- | ------------------------------------------------- |
| componentDidMount    | Runs after the component is added to the DOM      |
| componentDidUpdate   | Runs after updates                                |
| componentWillUnmount | Runs before the component is removed from the DOM |

## Hooks (Function Components)

| Hook                | Purpose                                    |
| ------------------- | ------------------------------------------ |
| useState            | State management                           |
| useEffect           | Side effects (componentDidMount/DidUpdate) |
| useContext          | Consume context                            |
| useReducer          | Complex state logic                        |
| useRef              | Mutable refs                               |
| useMemo/useCallback | Memoization                                |

```javascript
import React, { useState, useEffect } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  return <button onClick={() => setCount(count + 1)}>Count {count}</button>;
}
```

## Conditional Rendering

```javascript
{
  isLoggedIn ? <Dashboard /> : <Login />;
}
```

## Lists and Keys

```javascript
const items = ["Apple", "Banana", "Cherry"];
const listItems = items.map((item) => <li key={item}>{item}</li>);
```

## Forms

```javascript
function Form() {
  const [value, setValue] = useState("");
  return (
    <form>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
    </form>
  );
}
```

## Lifting State Up

- Move shared state to the closest common ancestor component.

## Context API

```javascript
const ThemeContext = React.createContext("light");

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}
```

## React Router (Routing)

```javascript
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## State Management

| Library     | Purpose                                         |
| ----------- | ----------------------------------------------- |
| Redux       | Centralized state container                     |
| Zustand     | Simple, modern state management                 |
| Recoil      | State management with atomic design             |
| Context API | Lightweight built-in solution for sharing state |

## Performance Optimization

- Memoization (`React.memo`, `useMemo`)
- Lazy loading (`React.lazy`, `Suspense`)
- Virtualization (react-window, react-virtualized)

## React Ecosystem

| Area       | Tools/Libraries                          |
| ---------- | ---------------------------------------- |
| Routing    | React Router                             |
| State Mgmt | Redux, Zustand, Recoil                   |
| Forms      | Formik, React Hook Form                  |
| Testing    | Jest, React Testing Library              |
| Styling    | Styled-components, Emotion, Tailwind CSS |

## Best Practices

- Use function components and hooks.
- Keep components small and focused.
- Use keys when rendering lists.
- Lift state up only when needed.
- Co-locate state and effects.
- Prefer controlled components for forms.
- Optimize renders with memoization when appropriate.

## Advanced Topics

| Concept                     | Description                                        |
| --------------------------- | -------------------------------------------------- |
| Error Boundaries            | Catch errors in components                         |
| Portals                     | Render children into a DOM node outside the parent |
| Suspense                    | Graceful loading for async components              |
| Server-Side Rendering (SSR) | Render React on the server for better SEO          |
| Concurrent Mode             | Experimental mode for better async rendering       |

## TypeScript with React

```typescript
interface Props {
  name: string;
}

const Welcome: React.FC<Props> = ({ name }) => <h1>Hello, {name}</h1>;
```

## Summary

**React** provides a powerful and flexible way to build complex UIs using a component-based architecture. Its ecosystem supports robust development for both small and large-scale applications, with first-class support for state management, routing, forms, and more.
