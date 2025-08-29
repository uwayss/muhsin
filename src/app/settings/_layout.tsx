// src/app/settings/_layout.tsx
import Stack from "expo-router/stack";

export default function SettingsLayout() {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
