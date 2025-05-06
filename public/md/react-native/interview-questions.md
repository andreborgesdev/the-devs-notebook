# React Native Interview Questions and Answers

### Fundamentals

**What is React Native?**
React Native is a framework developed by Meta (formerly Facebook) that allows developers to build mobile applications using JavaScript and React. It uses native components rather than web components for building the UI, enabling near-native performance.

**How is React Native different from React?**
While both use JavaScript and share similar design principles, React is for building web applications and uses the DOM, whereas React Native targets mobile platforms and uses native components like `<View>`, `<Text>`, and `<Image>`.

**What platforms does React Native support?**
Primarily iOS and Android. Community support also enables development for Windows, macOS, and web.

### Components and Styling

**What are core components in React Native?**
Examples include `<View>`, `<Text>`, `<Image>`, `<ScrollView>`, `<FlatList>`, and `<TouchableOpacity>`.

**How does styling work in React Native?**
Styles are written in JavaScript objects using a CSS-like syntax. React Native provides a `StyleSheet.create` method to optimize and organize styles.

```javascript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
```

### Navigation

**How is navigation handled in React Native?**
React Navigation is the most popular library, offering stack, tab, and drawer navigators. React Native also supports deep linking and URL handling for navigation.

**What is the difference between StackNavigator and TabNavigator?**

- **StackNavigator**: Manages a stack of screens, allowing push/pop navigation.
- **TabNavigator**: Creates bottom or top tabs for easy switching between screens.

### State Management

**How is state managed in React Native apps?**
Small apps can use `useState` and `useReducer`. For larger apps:

- Context API
- Redux
- Zustand
- MobX
- Recoil

**Is Redux still relevant for React Native?**
Yes, especially in complex apps that need predictable state management, although many teams are adopting lighter solutions like Zustand or Recoil.

### Performance Optimization

**How can performance be optimized in React Native?**

- Use `React.memo` for pure functional components.
- Use FlatList or SectionList for efficient list rendering.
- Use the `useCallback` and `useMemo` hooks.
- Optimize images using appropriate formats and resolutions.
- Avoid anonymous functions in JSX.
- Offload heavy computation to native modules or worker threads.

**What is the purpose of the `shouldComponentUpdate` method?**
It allows class components to prevent unnecessary re-renders by returning `false` when updates are not needed.

### Native Modules and Bridging

**What are Native Modules in React Native?**
Native Modules allow integration of native code (Java/Kotlin for Android, Objective-C/Swift for iOS) into a React Native app for performance-critical operations or to access platform-specific APIs.

**How do you create a Native Module?**
By writing native code and exposing it to JavaScript using the React Native bridge, although the new architecture encourages using TurboModules and JSI (JavaScript Interface) for better performance.

### Animations

**What libraries are used for animations in React Native?**

- Animated API (built-in)
- React Native Reanimated (preferred for complex animations)
- Lottie for rendering animations from Adobe After Effects

**What are the benefits of using React Native Reanimated?**
It offers better performance by running animations on the UI thread, reducing lag and jank compared to the Animated API.

### Testing

**What tools are used for testing React Native apps?**

- Unit Testing: Jest
- Component Testing: React Native Testing Library
- End-to-End Testing: Detox

**What is snapshot testing in React Native?**
Snapshot testing captures the rendered output of a component and compares it with future runs to detect unintended UI changes.

### Debugging and Development Tools

**What tools are available for debugging React Native apps?**

- React Developer Tools
- Flipper
- Chrome DevTools
- Remote Debugging
- Console logs and breakpoints in IDEs

**What is Flipper?**
A platform for debugging iOS and Android apps. It supports React Native inspection, network requests, Redux, and more.

### Advanced Topics

**What is the difference between React Native CLI and Expo?**

- **React Native CLI**: Offers full control and flexibility, including native code customization.
- **Expo**: Provides a managed workflow with many built-in APIs but can be restrictive for advanced native customization.

**What are TurboModules?**
TurboModules improve the communication between JavaScript and native code by optimizing how native modules are loaded and accessed.

**What is JSI (JavaScript Interface)?**
JSI replaces the traditional bridge, enabling faster and more flexible communication between JavaScript and native code. It also lays the groundwork for new concurrent rendering patterns.

**Explain the concept of Hermes engine.**
Hermes is a lightweight JavaScript engine optimized for running React Native apps on Android (and now iOS). It reduces app size, improves startup time, and provides better memory usage.

### Code Splitting and Lazy Loading

**Is code splitting available in React Native?**
While not as straightforward as in web development, dynamic imports and lazy loading can be implemented. Libraries like `react-native-dynamic-bundle` can help.

### Continuous Integration/Continuous Deployment (CI/CD)

**What tools are used for CI/CD in React Native?**

- GitHub Actions
- Bitrise
- App Center
- Fastlane for app store deployments

### Architecture and Best Practices

**What are some best practices for structuring React Native apps?**

- Modularize code into components, hooks, and services.
- Use TypeScript for better type safety.
- Keep styles separate and reusable.
- Manage navigation state cleanly.
- Adopt modern state management solutions.
- Monitor and optimize app performance continuously.

## Advanced React Native Patterns

**What is the container/presenter pattern?**
It separates logic from UI:

- **Container**: Handles data fetching, state management, and side effects.
- **Presenter**: Pure UI component receiving props from the container.

**What is a Higher-Order Component (HOC) in React Native?**
A function that takes a component and returns an enhanced component. It’s useful for cross-cutting concerns like authentication or theming.

```javascript
const withLogging = (Component) => (props) => {
  console.log("Component rendered");
  return <Component {...props} />;
};
```

**What are render props?**
A technique for sharing logic by passing a function as a prop that returns a React element.

**What is the benefit of using Hooks over HOCs and render props?**
Hooks avoid nesting complexity, making code cleaner and easier to follow, especially with deeply nested HOCs or multiple render props.

**What is a compound component pattern?**
A design where components work together, usually sharing implicit state via context, useful for building complex UI components like accordions or tabs.

## React Native with TypeScript

**Why use TypeScript in React Native?**
It provides static typing, autocompletion, and early detection of bugs, leading to more maintainable and scalable code.

**How do you type props and state in React Native functional components?**

```typescript
type Props = {
  title: string;
};

const MyComponent: React.FC<Props> = ({ title }) => {
  return <Text>{title}</Text>;
};
```

**What are the benefits of using interfaces for props?**
Interfaces allow easy extension and merging, making the codebase more flexible and readable.

**How do you type FlatList or SectionList items in TypeScript?**

```typescript
<FlatList<ItemType>
  data={data}
  renderItem={({ item }) => <Text>{item.name}</Text>}
/>
```

**What is the difference between `any`, `unknown`, and `never` in TypeScript?**

- `any`: Disables type checking.
- `unknown`: Safer alternative to `any`. Type must be checked before use.
- `never`: Represents values that never occur (e.g., function throws an error or infinite loop).

## React Native + Redux Toolkit

**Why use Redux Toolkit in React Native apps?**
Redux Toolkit simplifies Redux development by:

- Reducing boilerplate code.
- Providing best practices out of the box.
- Offering built-in support for Immer for immutable updates.

**What is `createSlice` and how does it work?**
`createSlice` combines reducers and actions into a single function, reducing boilerplate.

```typescript
const counterSlice = createSlice({
  name: "counter",
  initialState: 0,
  reducers: {
    increment: (state) => state + 1,
    decrement: (state) => state - 1,
  },
});
```

**How does Redux Toolkit improve asynchronous logic handling?**
It provides `createAsyncThunk`, simplifying async action creators and handling loading/error states.

**What are the advantages of using Redux Toolkit over traditional Redux?**

- Eliminates manual action type constants.
- Reduces the need for switch statements.
- Encourages writing "mutative" logic safely with Immer.
- Streamlines async workflows.

**Can Redux Toolkit be used with TypeScript?**
Yes, Redux Toolkit has excellent TypeScript support, enabling strict typing of state, actions, and thunks.

**How would you connect Redux Toolkit slices to React Native components?**

```typescript
const count = useSelector((state: RootState) => state.counter.value);
const dispatch = useDispatch();
dispatch(counterSlice.actions.increment());
```

**What is RTK Query?**
An advanced data-fetching and caching solution integrated with Redux Toolkit. It eliminates the need for libraries like Axios or manual Redux async actions in many cases.

## Bonus: Advanced Topics

**What is the new React Native Architecture (Fabric and TurboModules)?**
The new architecture includes Fabric (new rendering system) and TurboModules (improved native module loading) to increase performance, reduce bridge overhead, and enable concurrent rendering.

**What are the benefits of JSI (JavaScript Interface)?**
JSI removes the traditional bridge between JS and native code, enabling faster data transfer and easier integration with new engines like Hermes.

**How does Flipper help in React Native development?**
Flipper provides visual debugging tools for inspecting the app’s state, Redux actions, network requests, and performance in real-time.
