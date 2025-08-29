// src/components/Header.tsx
import { AppTheme } from "@/constants/theme";
import { useTheme } from "@/core/theme/ThemeContext";
import React from "react";
import { StyleSheet } from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";
import { Box } from "./base/Box";
import { ThemedText } from "./base/ThemedText";

export type HeaderProps = {
  title: string;
  subtitle?: string;
  renderLeftAction?: () => React.ReactNode;
  renderRightAction?: () => React.ReactNode;
  insets: EdgeInsets;
};

export const Header = ({
  title,
  subtitle,
  renderLeftAction,
  renderRightAction,
  insets,
}: HeaderProps) => {
  const { theme } = useTheme();
  const styles = getStyles(theme, insets);

  return (
    <Box style={styles.container}>
      <Box style={styles.actionSlot}>
        {renderLeftAction && renderLeftAction()}
      </Box>

      <Box style={styles.titleContainer}>
        <ThemedText style={styles.title} numberOfLines={1}>
          {title}
        </ThemedText>
        {subtitle && (
          <ThemedText style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </ThemedText>
        )}
      </Box>

      <Box style={styles.actionSlot}>
        {renderRightAction && renderRightAction()}
      </Box>
    </Box>
  );
};

const getStyles = (theme: AppTheme, insets: EdgeInsets) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing.m,
      height: 60 + insets.top,
      paddingTop: insets.top,
      backgroundColor: theme.colors.foreground,
    },
    actionSlot: {
      width: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    titleContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: theme.typography.fontSize.l,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    subtitle: {
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
  });
