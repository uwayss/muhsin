// src/features/stats/SummaryBox.tsx
import { ThemedText } from "@/components/base/ThemedText";
import { AppTheme } from "@/constants/theme";
import i18n from "@/core/i18n";
import { useTheme } from "@/core/theme/ThemeContext";
import React from "react";
import { StyleSheet, View } from "react-native";

type SummaryBoxProps = {
  title: string;
  color: string;
  percentage: number;
  count: number;
};

export const SummaryBox = ({
  title,
  color,
  percentage,
  count,
}: SummaryBoxProps) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  return (
    <View style={styles.summaryBox}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={[styles.summaryDot, { backgroundColor: color }]} />
        <ThemedText style={styles.summaryTitle}>{title}</ThemedText>
      </View>
      <ThemedText style={styles.summaryPercentage}>
        {percentage.toFixed(0)}%
      </ThemedText>
      <ThemedText style={styles.summaryCount}>
        {i18n.t("stats.times", { count })}
      </ThemedText>
      <View style={styles.summaryBar}>
        <View
          style={[
            styles.summaryBarFill,
            { width: `${percentage}%`, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  );
};

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    summaryBox: {
      width: "48%",
      backgroundColor: theme.colors.foreground,
      borderRadius: 16,
      padding: theme.spacing.m,
      marginBottom: theme.spacing.s,
    },
    summaryDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: theme.spacing.s,
    },
    summaryTitle: {
      fontSize: theme.typography.fontSize.s,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    summaryPercentage: {
      fontSize: theme.typography.fontSize.xxl,
      fontWeight: theme.typography.fontWeight.bold,
      marginTop: theme.spacing.s,
    },
    summaryCount: {
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.textSecondary,
    },
    summaryBar: {
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.colors.background,
      marginTop: theme.spacing.m,
      overflow: "hidden",
    },
    summaryBarFill: {
      height: "100%",
    },
  });
