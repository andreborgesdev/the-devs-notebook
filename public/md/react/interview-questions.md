# React Interview Questions and Answers

## Fundamentals

**What is React and why is it used?**
React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently manage updates to the UI using a virtual DOM.

**Explain the concept of component-based architecture in React.**
Component-based architecture breaks the UI into independent, reusable pieces called components. Each component manages its own state and logic, promoting modularity and maintainability.

**What is JSX?**
JSX stands for JavaScript XML. It is a syntax extension that allows writing HTML-like code inside JavaScript. Babel transpiles JSX into `React.createElement` calls.

**Describe how JSX works and how it is transpiled to JavaScript.**
JSX is transformed into JavaScript function calls (`React.createElement`) that create virtual DOM nodes.

**What are the differences between functional and class components?**
Functional components are stateless and use hooks for state and lifecycle features. Class components use ES6 classes and have lifecycle methods like `componentDidMount`.

**What is the virtual DOM and how does React use it?**
The virtual DOM is an in-memory representation of the real DOM. React updates the virtual DOM first and then efficiently updates the real DOM using a diffing algorithm.

## State and Props

**What are props in React?**
Props are immutable data passed from parent to child components to configure or customize behavior and appearance.

**What is state in React?**
State is mutable data managed within a component that affects its rendering.

**How can you update state in React?**
By using the `useState` hook in functional components or `this.setState` in class components.

**What is the difference between controlled and uncontrolled components?**
Controlled components manage form data through React state. Uncontrolled components manage their state through the DOM.

## Lifecycle and Hooks

**What are React lifecycle methods?**
Methods like `componentDidMount`, `shouldComponentUpdate`, and `componentWillUnmount` control different stages of a class component's existence.

**What are hooks in React?**
Hooks are functions like `useState`, `useEffect`, and `useContext` that allow functional components to use state and lifecycle features.

**How does `useEffect` work?**
`useEffect` runs side effects after rendering. It can also return a cleanup function.

**What are the rules of hooks?**
Hooks must be called at the top level and only inside React function components or custom hooks.

## Advanced Concepts

**What is Context API?**
A way to pass data deeply through the component tree without prop drilling.

**What is Redux and why might you use it?**
Redux is a state management library that provides a single global state and predictable state updates via actions and reducers.

**What is memoization in React?**
Techniques like `React.memo` and `useMemo` prevent unnecessary re-renders by caching results.

**What is the difference between `useCallback` and `useMemo`?**
`useCallback` memoizes functions, while `useMemo` memoizes the return value of functions.

## Routing

**What is React Router?**
A library for routing in React. Components like `Route`, `Link`, and `Switch` help define and navigate routes.

**What is lazy loading in React?**
Loading components only when needed to reduce initial load time, using `React.lazy` and `Suspense`.

## Performance Optimization

**How can you optimize performance in React apps?**
Memoization, lazy loading, code splitting, avoiding unnecessary re-renders, and using the production build.

**What are keys in React lists and why are they important?**
Keys uniquely identify elements to help React efficiently update the DOM.

## Error Handling

**How can you handle errors in React?**
Using error boundaries with lifecycle methods like `componentDidCatch`.

## Testing

**What tools can be used for testing React components?**
Jest, React Testing Library, and Enzyme.

**What is snapshot testing?**
Capturing a rendered component's output and comparing it to future renders to detect changes.

## Server-Side Rendering and Static Generation

**What is server-side rendering (SSR) in React?**
Rendering components on the server to improve load time and SEO. Next.js supports SSR.

**What is static site generation (SSG)?**
Pre-rendering pages at build time for fast performance.

## Concurrent React

**What is React Concurrent Mode?**
A mode that enables interruptible rendering to improve responsiveness.

**What are Suspense and Suspense for Data Fetching?**
`Suspense` defers rendering parts of the UI. Suspense for Data Fetching integrates data loading with the UI.

## Hooks Internals and Advanced Usage

**Explain how the `useState` hook works internally.**
React stores state variables in a list and associates them with the component instance. State updates trigger re-renders.

**What is the difference between `useEffect` and `useLayoutEffect`?**
`useEffect` runs after painting, while `useLayoutEffect` runs synchronously before painting.

**What is the purpose of the `useRef` hook?**
To persist values across renders and access DOM elements.

**Explain the `useImperativeHandle` hook.**
Used with `forwardRef` to customize the ref instance exposed to parent components.

**What are custom hooks and when should you create them?**
Custom hooks extract reusable logic from components, promoting DRY principles.

## Reconciliation and Rendering

**Describe the reconciliation algorithm in React.**
React compares new and previous virtual DOM trees to update only the necessary parts of the real DOM.

**What are React fibers?**
A new reconciler algorithm that breaks rendering work into units, enabling interruptible rendering.

**How does React batch updates?**
React batches multiple state updates to minimize DOM operations. React 18 introduced automatic batching for more scenarios.

**What is the difference between controlled and uncontrolled components in forms?**
Controlled components use React state; uncontrolled components use the DOM.

## Concurrent React and React 18

**What is Concurrent Mode?**
Allows React to interrupt and pause work to prioritize important updates.

**Explain automatic batching in React 18.**
Multiple updates are automatically batched even across asynchronous boundaries.

**What are transitions (`startTransition`) in React 18?**
Mark updates as non-urgent to keep the UI responsive.

**What is the difference between blocking rendering and concurrent rendering?**
Blocking rendering completes work before moving on. Concurrent rendering allows React to interrupt and prioritize work.

## Suspense and Data Fetching

**What is Suspense in React?**
A feature to delay rendering while waiting for some condition like data fetching.

**What is Suspense for Data Fetching?**
Integrates data fetching with Suspense to streamline asynchronous UI loading.

**Explain the concept of "fallback" in Suspense.**
A UI shown while waiting for the main content to load, such as a spinner.

**How does React 18’s `use` hook work with Suspense?**
`use` suspends rendering until a promise resolves, simplifying data fetching in components.

## Advanced Performance Optimization

**What are the differences between `React.memo`, `useMemo`, and `useCallback`?**
`React.memo` prevents unnecessary re-renders of components. `useMemo` memoizes values. `useCallback` memoizes functions.

**Explain why keys are important in React lists.**
They help React track which items changed, preventing inefficient re-rendering.

**How does lazy loading improve performance in React apps?**
By loading only the components needed for the initial render, reducing load time.

**What is code splitting and how does `React.lazy` work with `Suspense`?**
Code splitting loads parts of code on demand. `React.lazy` allows dynamic import of components, which can be wrapped in `Suspense`.

## Context and State Management

**What are the performance implications of the Context API?**
Frequent value changes can cause unnecessary re-renders in consuming components.

**How is Zustand or Recoil different from Context API and Redux?**
They offer more fine-grained control over state updates and simpler APIs compared to Redux and Context.

**What is prop drilling and how can it be avoided?**
Passing props through intermediate components. Can be avoided using Context, Redux, or state management libraries.

## Testing and Best Practices

**What are the advantages of React Testing Library over Enzyme?**
RTL emphasizes testing components as users interact with them, promoting better test practices.

**How would you test asynchronous logic in React components?**
Using async utilities from React Testing Library like `waitFor` or `findBy` queries.

**What are the trade-offs between snapshot testing and unit testing?**
Snapshots quickly detect UI changes but may lead to false positives. Unit tests provide more control and precision.

## Portals and Error Boundaries

**What are React Portals and why are they used?**
Allow rendering children into a different DOM node. Useful for modals, tooltips, etc.

**What are Error Boundaries?**
Components that catch JavaScript errors during rendering. They can't catch errors in event handlers.

## Server-Side Rendering and Static Generation

**What is server-side rendering (SSR) and how does Next.js implement it?**
SSR renders components on the server before sending HTML to the client. Next.js automates this.

**What is hydration and why is it important?**
Attaching React's event handlers to server-rendered HTML to make it interactive.

**Explain static site generation (SSG) and incremental static regeneration (ISR) in Next.js.**
SSG pre-renders pages at build time. ISR allows updating static content after deployment.

## Miscellaneous Advanced Topics

**What are higher-order components (HOC) and when would you use them?**
Functions that take a component and return a new enhanced component. Useful for cross-cutting concerns like theming or permissions.

**What is render props pattern and what has replaced it in modern React?**
Passing a function as a prop to control rendering. Replaced largely by hooks.

**Explain the differences between useReducer and Redux.**
`useReducer` manages local state with a reducer function. Redux manages global state with a centralized store.

## Patterns and Architectural Decisions

**What are some strategies to scale a large React application?**
Code splitting, component libraries, state management strategies, and feature-based folder structure.

**How do design systems integrate with React applications?**
By providing reusable UI components and consistent styling across the app.

**What are compound components and what problem do they solve?**
A pattern where components share implicit state, improving composability and flexibility in UI design.
