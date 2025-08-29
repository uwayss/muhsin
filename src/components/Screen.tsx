// src/components/Screen.tsx
import { AppTheme } from "@/constants/theme";
import { useTheme } from "@/core/theme/ThemeContext";
import React from "react";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Box } from "./base/Box";
import { Header, HeaderProps } from "./Header";

// Omit 'insets' from HeaderProps as Screen will provide it automatically
type ScreenProps = Partial<Omit<HeaderProps, "insets">> & {
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
          // paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      {title && <Header title={title} {...headerProps} insets={insets} />}

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
    },
  });
