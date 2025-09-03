// FILE: src/navigation/AppNavigator.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@/core/theme/ThemeContext";
import i18n from "@/core/i18n";
import { NavigatorScreenParams } from "@react-navigation/native";

// Import Screens
import StatsScreen from "@/screens/StatsScreen";
import HomeScreen from "@/screens/HomeScreen";
import AddDeedScreen from "@/screens/AddDeedScreen";
import CreateDeedScreen from "@/screens/CreateDeedScreen";
import ConfigureFrequencyScreen from "@/screens/ConfigureFrequencyScreen";
import ConfigureGoalScreen from "@/screens/ConfigureGoalScreen";
import ConfigureParentScreen from "@/screens/ConfigureParentScreen";
import SettingsScreen from "@/screens/SettingsScreen";
import DeedManagerScreen from "@/screens/DeedManagerScreen";
import NotificationsScreen from "@/screens/NotificationsScreen";

// Define Param Lists for Type Safety
export type HomeStackParamList = {
  HomeMain: undefined;
  AddDeed: undefined;
  CreateDeed: { deedId?: string };
  ConfigureFrequency: undefined;
  ConfigureGoal: undefined;
  ConfigureParent: undefined;
};

export type SettingsStackParamList = {
  SettingsMain: undefined;
  DeedManager: undefined;
  Notifications: undefined;
};

export type TabParamList = {
  Stats: undefined;
  Home: NavigatorScreenParams<HomeStackParamList>;
  Settings: NavigatorScreenParams<SettingsStackParamList>;
};

// Create Navigators
const Tab = createBottomTabNavigator<TabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();

function TabBarIcon(props: {
  name: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  color: string;
}) {
  return (
    <MaterialCommunityIcons size={28} style={{ marginBottom: -3 }} {...props} />
  );
}

// Main Tab Navigator
export default function AppNavigator() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      id={undefined}
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.foreground,
          borderTopColor: theme.colors.background,
        },
        headerShown: false,
      }}
      initialRouteName="Home"
    >
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          title: i18n.t("tabs.stats"),
          tabBarLabel: i18n.t("tabs.stats"),
          tabBarIcon: ({ color }) => (
            <TabBarIcon name={"trending-up"} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        options={{
          title: i18n.t("tabs.home"),
          tabBarLabel: i18n.t("tabs.home"),
          tabBarIcon: ({ color }) => <TabBarIcon name={"home"} color={color} />,
        }}
      >
        {() => (
          <HomeStack.Navigator
            id={undefined}
            screenOptions={{ headerShown: false }}
          >
            <HomeStack.Screen name="HomeMain" component={HomeScreen} />
            <HomeStack.Screen name="AddDeed" component={AddDeedScreen} />
            <HomeStack.Screen name="CreateDeed" component={CreateDeedScreen} />
            <HomeStack.Screen
              name="ConfigureFrequency"
              component={ConfigureFrequencyScreen}
            />
            <HomeStack.Screen
              name="ConfigureGoal"
              component={ConfigureGoalScreen}
            />
            <HomeStack.Screen
              name="ConfigureParent"
              component={ConfigureParentScreen}
            />
          </HomeStack.Navigator>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Settings"
        options={{
          headerShown: false,
          title: i18n.t("tabs.settings"),
          tabBarLabel: i18n.t("tabs.settings"),
          tabBarIcon: ({ color }) => <TabBarIcon name={"cog"} color={color} />,
        }}
      >
        {() => (
          <SettingsStack.Navigator
            id={undefined}
            screenOptions={{ headerShown: false }}
          >
            <SettingsStack.Screen
              name="SettingsMain"
              component={SettingsScreen}
            />
            <SettingsStack.Screen
              name="DeedManager"
              component={DeedManagerScreen}
            />
            <SettingsStack.Screen
              name="Notifications"
              component={NotificationsScreen}
            />
          </SettingsStack.Navigator>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
