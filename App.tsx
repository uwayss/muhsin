// FILE: App.tsx
import { ThemeProvider } from "@/core/theme/ThemeContext";
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import useAppStore from "@/core/store/appStore";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import i18n from "@/core/i18n";
import { useForceUpdate } from "@/core/hooks/useForceUpdate";
import { I18nManager } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "@/navigation/AppNavigator";

I18nManager.allowRTL(true);

function AppContent() {
  const language = useAppStore((state) => state.settings.language);
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    useAppStore.getState().initialize();
  }, []);

  useEffect(() => {
    forceUpdate();
  }, [language, forceUpdate]);

  return <AppNavigator />;
}

export default function App() {
  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <AppContent />
          <StatusBar style={"auto"} />
        </NavigationContainer>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
