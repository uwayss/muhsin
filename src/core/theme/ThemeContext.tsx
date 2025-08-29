// src/core/theme/ThemeContext.tsx
import React, { createContext, useContext } from "react";
import { useColorScheme } from "react-native";
import { AppTheme, ColorTheme, theme } from "@/constants/theme";

interface ThemeContextType {
  theme: AppTheme;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Select the correct color palette based on the system theme
  const activeColors: ColorTheme = isDark
    ? theme.colors.dark
    : theme.colors.light;

  // Combine the active colors with the static tokens (spacing, typography)
  const activeTheme: AppTheme = {
    ...theme,
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
