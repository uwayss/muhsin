// src/app/_layout.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ThemeProvider, useTheme } from "@/core/theme/ThemeContext";
import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import useAppStore from "@/core/store/appStore";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import i18n from "@/core/i18n";
import { useForceUpdate } from "@/core/hooks/useForceUpdate";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  color: string;
}) {
  return (
    <MaterialCommunityIcons size={28} style={{ marginBottom: -3 }} {...props} />
  );
}

function RootTabBar() {
  const { theme } = useTheme();
  const language = useAppStore((state) => state.settings.language); // Listen for language changes
  const forceUpdate = useForceUpdate(); // A custom hook to force re-render

  useEffect(() => {
    useAppStore.getState().initialize();
  }, []);

  // When the language changes, we need to force the UI to re-render
  // because i18n-js is not a stateful library.
  useEffect(() => {
    forceUpdate();
  }, [language, forceUpdate]);

  const tabData = [
    {
      name: "stats",
      title: i18n.t("tabs.stats"),
      icon: "trending-up" as const,
    },
    { name: "home", title: i18n.t("tabs.home"), icon: "home" as const },
    { name: "settings", title: i18n.t("tabs.settings"), icon: "cog" as const },
  ];

  return (
    <>
      <StatusBar style={"auto"} />
      <Tabs
        initialRouteName="home"
        screenOptions={{
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textSecondary,
          tabBarStyle: {
            backgroundColor: theme.colors.foreground,
            borderTopColor: theme.colors.background,
          },
          headerShown: false,
        }}
      >
        {tabData.map((tab) => (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              headerShown: false,
              title: tab.title,
              tabBarLabel: tab.title,
              tabBarIcon: ({ color }) => (
                <TabBarIcon name={tab.icon} color={color} />
              ),
            }}
          />
        ))}
      </Tabs>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <RootTabBar />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
