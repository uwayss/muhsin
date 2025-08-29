import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
}) {
  return (
    <MaterialCommunityIcons size={28} style={{ marginBottom: -3 }} {...props} />
  );
}

const tabData: {
  name: string;
  title: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
}[] = [
  { name: "stats", title: "Stats", icon: "trending-up" },
  { name: "index", title: "Home", icon: "home" },
  { name: "settings", title: "Settings", icon: "cog" },
];

export default function RootTabBar() {
  return (
    <Tabs initialRouteName="index">
      {tabData.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            headerShown: false,
            title: tab.title,
            tabBarLabel: tab.title,
            tabBarIcon: () => {
              return <TabBarIcon name={tab.icon} />;
            },
          }}
        />
      ))}
    </Tabs>
  );
}
