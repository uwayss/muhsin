// src/app/index/_layout.tsx
import Stack from "expo-router/stack";

export default function _layout() {
  return (
    <Stack
      initialRouteName="main"
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
