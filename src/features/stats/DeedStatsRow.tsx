// src/features/stats/DeedStatsRow.tsx
import { ThemedText } from "@/components/base/ThemedText";
import { AppTheme, ColorTheme } from "@/constants/theme";
import { Deed, DeedLog } from "@/core/data/models";
import { useTheme } from "@/core/theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { StyleSheet, View, I18nManager } from "react-native";
import { colors } from "@/constants/colors";
import i18n from "@/core/i18n";

const PRAYER_STATUS_BREAKDOWN_ORDER = ["jamaah", "on-time", "late", "missed"];

const isColorLight = (hexColor: string) => {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  return r * 0.299 + g * 0.587 + b * 0.114 > 186;
};

export const DeedStatsRow = ({
  deed,
  logs,
}: {
  deed: Deed;
  logs: DeedLog[];
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const deedStats = useMemo(() => {
    const relevantLogs = logs.filter((log) => log.deedId === deed.id);
    const total = relevantLogs.length;
    if (total === 0) return [];

    const counts = relevantLogs.reduce((acc, log) => {
      acc[log.statusId] = (acc[log.statusId] || 0) + 1;
      return acc;
    }, {});

    return PRAYER_STATUS_BREAKDOWN_ORDER.map((statusId) => {
      const count = counts[statusId] || 0;
      const status = deed.statuses.find((s) => s.id === statusId);
      const colorKey = status.color as keyof ColorTheme;
      const hexColor = colors.light[colorKey];

      return {
        id: statusId,
        percentage: (count / total) * 100,
        color: theme.colors[colorKey],
        textColor: isColorLight(hexColor)
          ? theme.colors.text
          : theme.colors.primaryContrast,
      };
    }).filter((item) => item.percentage > 0);
  }, [logs, deed, theme.colors]);

  return (
    <View style={styles.deedStatRow}>
      <MaterialCommunityIcons
        name={deed.icon}
        size={24}
        color={theme.colors.textSecondary}
        style={styles.deedStatIcon}
      />
      <ThemedText style={styles.deedStatName}>
        {i18n.t(`deeds_names.${deed.id}`, { defaultValue: deed.name })}
      </ThemedText>
      <View style={styles.deedStatBar}>
        {deedStats.map((stat) => (
          <View
            key={stat.id}
            style={[
              styles.barSegment,
              { width: `${stat.percentage}%`, backgroundColor: stat.color },
            ]}
          >
            {stat.percentage >= 15 && (
              <ThemedText
                style={[styles.percentageText, { color: stat.textColor }]}
              >
                {stat.percentage.toFixed(0)}%
              </ThemedText>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    deedStatRow: {
      flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
      alignItems: "center",
      marginBottom: theme.spacing.m,
    },
    deedStatIcon: {
      marginHorizontal: theme.spacing.m,
    },
    deedStatName: {
      width: "25%",
      fontWeight: theme.typography.fontWeight.semibold,
      textAlign: I18nManager.isRTL ? "right" : "left",
    },
    deedStatBar: {
      flex: 1,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme.colors.background,
      flexDirection: "row",
      overflow: "hidden",
    },
    barSegment: {
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
    percentageText: {
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.bold,
    },
  });
