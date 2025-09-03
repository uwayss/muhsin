// src/components/FAB.tsx
import { AppTheme } from "@/constants/theme";
import { useTheme } from "@/core/theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  I18nManager,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

export const FAB = (props: TouchableOpacityProps) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.7} {...props}>
      <MaterialCommunityIcons
        name="plus"
        size={32}
        color={theme.colors.primaryContrast}
      />
    </TouchableOpacity>
  );
};

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      bottom: theme.spacing.l,
      [I18nManager.isRTL ? "left" : "right"]: theme.spacing.l,
      width: 60,
      height: 60,
      borderRadius: 16,
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
  });
