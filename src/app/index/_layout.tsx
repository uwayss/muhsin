import Stack from "expo-router/stack";

export default function _layout() {
  return (
    <Stack
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
