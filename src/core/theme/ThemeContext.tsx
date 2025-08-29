// src/core/theme/ThemeContext.tsx
import React, { createContext, useContext } from "react";
import { useColorScheme } from "react-native";
import { AppTheme, ColorTheme, theme as defaultTheme } from "@/constants/theme";
import useAppStore from "../store/appStore";

interface ThemeContextType {
  theme: AppTheme;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const userThemePreference = useAppStore((state) => state.settings.theme);

  const activeColorScheme =
    userThemePreference === "system" ? systemColorScheme : userThemePreference;

  const isDark = activeColorScheme === "dark";

  const activeColors: ColorTheme = isDark
    ? defaultTheme.colors.dark
    : defaultTheme.colors.light;

  const activeTheme: AppTheme = {
    ...defaultTheme,
    colors: activeColors,
  };

  return (
    <ThemeContext.Provider value={{ theme: activeTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
