// src/app/_layout.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ThemeProvider, useTheme } from "@/core/theme/ThemeContext";
import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import useAppStore from "@/core/store/appStore";
import { GestureHandlerRootView } from "react-native-gesture-handler";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  color: string;
}) {
  return (
    <MaterialCommunityIcons size={28} style={{ marginBottom: -3 }} {...props} />
  );
}

const tabData = [
  { name: "stats", title: "Stats", icon: "trending-up" as const },
  { name: "index", title: "Home", icon: "home" as const },
  { name: "settings", title: "Settings", icon: "cog" as const },
];

function RootTabBar() {
  const { theme } = useTheme();

  useEffect(() => {
    useAppStore.getState().initialize();
  }, []);

  return (
    <>
      <StatusBar style={"auto"} />
      <Tabs
        initialRouteName="index"
        screenOptions={{
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textSecondary,
          tabBarStyle: {
            backgroundColor: theme.colors.foreground,
            borderTopColor: theme.colors.background,
          },
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
