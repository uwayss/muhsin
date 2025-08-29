// src/components/Screen.tsx
import React from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "@/core/theme/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Box } from "./base/Box";
import { Header, HeaderProps } from "./Header";
import { AppTheme } from "@/constants/theme";

// The Screen can now accept all HeaderProps, plus its own children
type ScreenProps = Partial<HeaderProps> & {
  children: React.ReactNode;
};

export const Screen = ({ children, title, ...headerProps }: ScreenProps) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = getStyles(theme);

  return (
    <Box
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      {/* Conditionally render the header ONLY if a title is provided */}
      {title && <Header title={title} {...headerProps} />}

      {/* The main content of the screen */}
      <Box style={styles.content}>{children}</Box>
    </Box>
  );
};

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      paddingHorizontal: theme.spacing.m,
      paddingVertical: theme.spacing.l,
    },
  });
