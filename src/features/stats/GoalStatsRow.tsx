// src/features/stats/GoalStatsRow.tsx
import { ThemedText } from "@/components/base/ThemedText";
import { AppTheme } from "@/constants/theme";
import { Deed, DeedLog } from "@/core/data/models";
import i18n from "@/core/i18n";
import { useTheme } from "@/core/theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";

export const GoalStatsRow = ({
  deed,
  logs,
}: {
  deed: Deed;
  logs: DeedLog[];
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const { totalProgress, percentage } = useMemo(() => {
    if (!deed.goal || logs.length === 0) {
      return { totalProgress: 0, percentage: 0 };
    }

    const total = logs.reduce((sum, log) => sum + (log.value || 0), 0);
    const target = deed.goal.value * logs.length; // Simple target: daily goal * num days logged

    return {
      totalProgress: total,
      percentage: target > 0 ? (total / target) * 100 : 0,
    };
  }, [logs, deed]);

  if (!deed.goal) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons
          name={deed.icon}
          size={20}
          color={theme.colors.textSecondary}
        />
        <ThemedText style={styles.deedName}>
          {i18n.t(`deeds_names.${deed.id}`, { defaultValue: deed.name })}
        </ThemedText>
        <ThemedText style={styles.progressText}>
          {`${totalProgress} / ${deed.goal.value * logs.length} ${
            deed.goal.unit
          }`}
        </ThemedText>
      </View>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${Math.min(percentage, 100)}%` },
          ]}
        />
      </View>
    </View>
  );
};

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      marginBottom: theme.spacing.m,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.s,
    },
    deedName: {
      flex: 1,
      marginStart: theme.spacing.s,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    progressText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.s,
    },
    progressBar: {
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.background,
      overflow: "hidden",
    },
    progressBarFill: {
      height: "100%",
      backgroundColor: theme.colors.primary,
    },
  });
