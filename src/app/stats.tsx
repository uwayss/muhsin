// src/app/stats.tsx
import { Screen } from "@/components/Screen";
import { ThemedText } from "@/components/base/ThemedText";
import { AppTheme } from "@/constants/theme";
import useAppStore from "@/core/store/appStore";
import { useTheme } from "@/core/theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { eachDayOfInterval, endOfWeek, isSameDay, startOfWeek } from "date-fns";
import React, { useMemo } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

const PRAYER_DEED_IDS = [
  "prayer-fajr",
  "prayer-dhuhr",
  "prayer-asr",
  "prayer-maghrib",
  "prayer-isha",
];
const PRAYER_STATUS_BREAKDOWN_ORDER = ["jamaah", "on-time", "late", "missed"];

const StatsScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const { isInitialized, deeds, logs } = useAppStore();

  const prayerDeeds = useMemo(() => {
    return PRAYER_DEED_IDS.map((id) => deeds.find((d) => d.id === id)).filter(
      Boolean,
    );
  }, [deeds]);

  const stats = useMemo(() => {
    const prayerLogs = logs.filter((log) =>
      PRAYER_DEED_IDS.includes(log.deedId),
    );
    const total = prayerLogs.length;
    if (total === 0) {
      return {
        jamaah: { count: 0, percentage: 0 },
        "on-time": { count: 0, percentage: 0 },
        late: { count: 0, percentage: 0 },
        missed: { count: 0, percentage: 0 },
      };
    }
    const counts = prayerLogs.reduce(
      (acc, log) => {
        acc[log.statusId] = (acc[log.statusId] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      jamaah: {
        count: counts.jamaah || 0,
        percentage: ((counts.jamaah || 0) / total) * 100,
      },
      "on-time": {
        count: counts["on-time"] || 0,
        percentage: ((counts["on-time"] || 0) / total) * 100,
      },
      late: {
        count: counts.late || 0,
        percentage: ((counts.late || 0) / total) * 100,
      },
      missed: {
        count: counts.missed || 0,
        percentage: ((counts.missed || 0) / total) * 100,
      },
    };
  }, [logs]);

  if (!isInitialized) {
    return (
      <Screen title="Stats">
        <ActivityIndicator style={{ marginTop: 20 }} />
      </Screen>
    );
  }

  return (
    <Screen title="Stats">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText style={styles.sectionTitle}>Prayer Performance</ThemedText>
        <View style={styles.summaryGrid}>
          <SummaryBox
            title="In Jama'ah"
            color={theme.colors.jamaah}
            percentage={stats.jamaah.percentage}
            count={stats.jamaah.count}
          />
          <SummaryBox
            title="On Time"
            color={theme.colors.onTime}
            percentage={stats["on-time"].percentage}
            count={stats["on-time"].count}
          />
          <SummaryBox
            title="Late"
            color={theme.colors.late}
            percentage={stats.late.percentage}
            count={stats.late.count}
          />
          <SummaryBox
            title="Not Prayed"
            color={theme.colors.missed}
            percentage={stats.missed.percentage}
            count={stats.missed.count}
          />
        </View>

        <ThemedText style={styles.sectionTitle}>Activity</ThemedText>
        <ActivityGraph deeds={prayerDeeds} logs={logs} />

        <ThemedText style={styles.sectionTitle}>Stats by Deed</ThemedText>
        <View style={styles.deedStatsContainer}>
          {prayerDeeds.map((deed) => (
            <DeedStatsRow key={deed.id} deed={deed} logs={logs} />
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
};

// --- Child Components ---

const SummaryBox = ({ title, color, percentage, count }) => {
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
      <ThemedText style={styles.summaryCount}>{count} times</ThemedText>
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

const ActivityGraph = ({ deeds, logs }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const dateRange = useMemo(() => {
    const today = new Date();
    return eachDayOfInterval({
      start: startOfWeek(today, { weekStartsOn: 1 }),
      end: endOfWeek(today, { weekStartsOn: 1 }),
    });
  }, []);

  return (
    <View style={styles.graphContainer}>
      <View style={styles.graphYAxis}>
        {deeds.map((deed) => (
          <MaterialCommunityIcons
            key={deed.id}
            name={deed.icon}
            size={20}
            color={theme.colors.textSecondary}
            style={styles.graphIcon}
          />
        ))}
      </View>
      <View style={styles.graphGrid}>
        {dateRange.map((date) => (
          <View key={date.toISOString()} style={styles.graphColumn}>
            {deeds.map((deed) => {
              const log = logs.find(
                (l) =>
                  l.deedId === deed.id && isSameDay(new Date(l.date), date),
              );
              const status = log
                ? deed.statuses.find((s) => s.id === log.statusId)
                : null;
              const cellColor = status
                ? theme.colors[status.color]
                : theme.colors.background;
              return (
                <View
                  key={deed.id}
                  style={[styles.graphCell, { backgroundColor: cellColor }]}
                />
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
};

const DeedStatsRow = ({ deed, logs }) => {
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
      return {
        percentage: (count / total) * 100,
        color: theme.colors[status.color],
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
      <ThemedText style={styles.deedStatName}>{deed.name}</ThemedText>
      <View style={styles.deedStatBar}>
        {deedStats.map((stat, index) => (
          <View
            key={index}
            style={{
              width: `${stat.percentage}%`,
              height: "100%",
              backgroundColor: stat.color,
            }}
          />
        ))}
      </View>
    </View>
  );
};

export default StatsScreen;

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    scrollContent: { paddingBottom: theme.spacing.l },
    sectionTitle: {
      fontWeight: theme.typography.fontWeight.bold,
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.textSecondary,
      textTransform: "uppercase",
      marginTop: theme.spacing.l,
      marginBottom: theme.spacing.s,
    },
    summaryGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
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
    graphContainer: {
      flexDirection: "row",
      backgroundColor: theme.colors.foreground,
      borderRadius: 16,
      padding: theme.spacing.m,
    },
    graphYAxis: {
      justifyContent: "space-around",
      marginRight: theme.spacing.s,
    },
    graphIcon: {
      height: 20,
    },
    graphGrid: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-around",
    },
    graphColumn: {
      justifyContent: "space-around",
    },
    graphCell: {
      width: 20,
      height: 20,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.colors.foreground,
    },
    deedStatsContainer: {
      backgroundColor: theme.colors.foreground,
      borderRadius: 16,
      padding: theme.spacing.m,
    },
    deedStatRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.m,
    },
    deedStatIcon: {
      marginRight: theme.spacing.m,
    },
    deedStatName: {
      width: "20%",
      fontWeight: theme.typography.fontWeight.semibold,
    },
    deedStatBar: {
      flex: 1,
      height: 12,
      borderRadius: 6,
      backgroundColor: theme.colors.background,
      flexDirection: "row",
      overflow: "hidden",
      marginLeft: theme.spacing.m,
    },
  });
