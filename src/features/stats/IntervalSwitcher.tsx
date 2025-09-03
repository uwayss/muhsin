// src/features/stats/IntervalSwitcher.tsx
import { ThemedText } from "@/components/base/ThemedText";
import { AppTheme } from "@/constants/theme";
import i18n from "@/core/i18n";
import { useTheme } from "@/core/theme/ThemeContext";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export type TimeInterval = "week" | "month" | "year";

type IntervalSwitcherProps = {
  selected: TimeInterval;
  onSelect: (interval: TimeInterval) => void;
};

export const IntervalSwitcher = ({
  selected,
  onSelect,
}: IntervalSwitcherProps) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const options: { label: string; value: TimeInterval }[] = [
    { label: i18n.t("intervals.week"), value: "week" },
    { label: i18n.t("intervals.month"), value: "month" },
    { label: i18n.t("intervals.year"), value: "year" },
  ];
  return (
    <View style={styles.switcherContainer}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={[
            styles.switcherButton,
            selected === opt.value && styles.switcherSelected,
          ]}
          onPress={() => onSelect(opt.value)}
        >
          <ThemedText
            style={[
              styles.switcherText,
              selected === opt.value && styles.switcherSelectedText,
            ]}
          >
            {opt.label}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    switcherContainer: {
      flexDirection: "row",
      backgroundColor: theme.colors.foreground,
      borderRadius: 8,
      overflow: "hidden",
      marginBottom: theme.spacing.m,
      marginTop: theme.spacing.m, // Added top margin
    },
    switcherButton: {
      flex: 1,
      padding: theme.spacing.m,
      alignItems: "center",
    },
    switcherSelected: {
      backgroundColor: theme.colors.primary,
    },
    switcherText: {
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.s,
    },
    switcherSelectedText: {
      color: theme.colors.primaryContrast,
    },
  });
