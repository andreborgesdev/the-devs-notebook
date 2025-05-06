# React Native

## Overview

**React Native** is an open-source framework developed by Facebook for building **mobile applications** using JavaScript and React. It allows developers to build apps for **iOS**, **Android**, and other platforms using a single codebase, leveraging native platform capabilities.

| Feature                  | Description                                               |
| ------------------------ | --------------------------------------------------------- |
| Cross-Platform           | Write once, deploy to iOS, Android, Windows, and more     |
| Uses React               | Component-based, declarative UI design                    |
| Native Modules           | Access native device features through bridges and modules |
| Fast Refresh             | Enables instant feedback during development               |
| Strong Community Support | Large ecosystem of libraries and tools                    |

## Core Concepts

### Components

React Native provides a set of built-in components:

```javascript
import { Text, View } from "react-native";

function App() {
  return (
    <View>
      <Text>Hello, React Native!</Text>
    </View>
  );
}
```

| Component  | Purpose              |
| ---------- | -------------------- |
| View       | Container for layout |
| Text       | Display text         |
| Image      | Display images       |
| ScrollView | Scrollable container |
| TextInput  | User text input      |
| Button     | Clickable button     |

### Styling

Uses a style object similar to CSS but in JavaScript:

```javascript
const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
};
```

- Uses **Flexbox** for layout.
- Units are **density-independent pixels**.
- No cascade or inheritance like web CSS.

### Navigation

Popular libraries:

- **React Navigation** (most common)
- **React Native Navigation** (native experience)

Example:

```javascript
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### State Management

- React’s `useState`, `useReducer`
- Context API
- Redux, MobX, Zustand, Recoil for complex apps

### API Access

- **Fetch API** for HTTP requests.
- Axios as an alternative for advanced use cases.

### Platform-Specific Code

```javascript
import { Platform } from "react-native";

if (Platform.OS === "ios") {
  // iOS-specific code
} else {
  // Android-specific code
}
```

### Native Modules & Native Code

For accessing device hardware or platform-specific APIs:

- **Native Modules** (Java/Obj-C/Swift/Kotlin)
- Bridging JavaScript and native code

Libraries like:

- `react-native-camera`
- `react-native-device-info`
- `react-native-fs`

## Performance Optimization

- **FlatList** for efficient rendering of large lists.
- Avoid unnecessary re-renders using `React.memo`.
- Use `useCallback` and `useMemo` hooks.
- Offload intensive work to native modules or background threads.

## Testing

| Type               | Tools                        |
| ------------------ | ---------------------------- |
| Unit Testing       | Jest                         |
| Component Testing  | React Native Testing Library |
| End-to-End Testing | Detox, Appium                |

## Development Tools

| Tool         | Purpose                                    |
| ------------ | ------------------------------------------ |
| Expo         | Eases development with managed workflow    |
| Fast Refresh | See changes immediately during development |
| Flipper      | Debugging platform for React Native apps   |

## Best Practices

- Keep components small and focused.
- Use TypeScript for better type safety.
- Manage assets efficiently (images, fonts).
- Optimize navigation performance.
- Profile app performance regularly.
- Use community packages wisely (check maintenance status).

## Popular Libraries

| Purpose              | Libraries                                 |
| -------------------- | ----------------------------------------- |
| Navigation           | React Navigation                          |
| Forms                | Formik, React Hook Form                   |
| Animations           | React Native Reanimated, Lottie           |
| State Management     | Redux, MobX, Zustand, Recoil              |
| HTTP Requests        | Axios, Fetch                              |
| UI Components        | React Native Paper, NativeBase, UI Kitten |
| Internationalization | react-i18next                             |

## Limitations

- Performance can lag behind fully native apps for intensive tasks.
- Native code knowledge is often required for advanced functionality.
- Complex animations can require native bridging.

## Summary

React Native is a **powerful framework for building cross-platform mobile applications** using React and JavaScript. With access to native features, a rich ecosystem of libraries, and a strong developer community, it enables efficient mobile development without sacrificing user experience.
