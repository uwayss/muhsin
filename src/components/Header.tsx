// src/components/Header.tsx
import { AppTheme } from "@/constants/theme";
import { useTheme } from "@/core/theme/ThemeContext";
import React from "react";
import { StyleSheet } from "react-native";
import { Box } from "./base/Box";
import { ThemedText } from "./base/ThemedText";

export type HeaderProps = {
  title: string;
  subtitle?: string;
  renderLeftAction?: () => React.ReactNode;
  renderRightAction?: () => React.ReactNode;
};

export const Header = ({
  title,
  subtitle,
  renderLeftAction,
  renderRightAction,
}: HeaderProps) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <Box style={styles.container}>
      {/* Left Slot */}
      <Box style={styles.actionSlot}>
        {renderLeftAction && renderLeftAction()}
      </Box>

      {/* Center Slot */}
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

      {/* Right Slot */}
      <Box style={styles.actionSlot}>
        {renderRightAction && renderRightAction()}
      </Box>
    </Box>
  );
};

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing.m,
      height: 60, // A standard header height
      backgroundColor: theme.colors.foreground,
    },
    actionSlot: {
      width: 40, // Fixed width to ensure the title is perfectly centered
      justifyContent: "center",
      alignItems: "center",
    },
    titleContainer: {
      flex: 1, // Takes up the remaining space
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
