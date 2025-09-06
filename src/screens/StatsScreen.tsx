// src/screens/StatsScreen.tsx
import { Screen } from "@/components/Screen";
import { ThemedText } from "@/components/base/ThemedText";
import { AppTheme } from "@/constants/theme";
import i18n from "@/core/i18n";
import useAppStore from "@/core/store/appStore";
import { useTheme } from "@/core/theme/ThemeContext";
import { ActivityGraph } from "@/features/stats/ActivityGraph";
import { DeedStatsRow } from "@/features/stats/DeedStatsRow";
import { GoalStatsRow } from "@/features/stats/GoalStatsRow";
import {
  IntervalSwitcher,
  TimeInterval,
} from "@/features/stats/IntervalSwitcher";
import { SummaryBox } from "@/features/stats/SummaryBox";
import {
  eachDayOfInterval,
  endOfDay,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

const PRAYER_DEED_IDS = [
  "prayer-fajr",
  "prayer-dhuhr",
  "prayer-asr",
  "prayer-maghrib",
  "prayer-isha",
];

const StatsScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const { isInitialized, deeds, logs } = useAppStore();
  const [interval, setInterval] = useState<TimeInterval>("week");

  const prayerDeeds = useMemo(
    () =>
      PRAYER_DEED_IDS.map((id) => deeds.find((d) => d.id === id)).filter(
        Boolean,
      ),
    [deeds],
  );

  const goalDeeds = useMemo(
    () => deeds.filter((d) => d.goal && !d.isCore),
    [deeds],
  );

  const dateRange = useMemo(() => {
    const today = new Date();
    const range = {
      start: startOfWeek(today),
      end: endOfDay(today),
    };

    if (interval === "month") {
      range.start = startOfMonth(today);
    } else if (interval === "year") {
      range.start = startOfYear(today);
    }

    return eachDayOfInterval(range);
  }, [interval]);

  const filteredLogs = useMemo(() => {
    const intervalStartDate = dateRange[0];
    const intervalEndDate = dateRange[dateRange.length - 1];
    return logs.filter((log) => {
      const logDate = startOfDay(new Date(log.date));
      return logDate >= intervalStartDate && logDate <= intervalEndDate;
    });
  }, [logs, dateRange]);

  const stats = useMemo(() => {
    const prayerLogs = filteredLogs.filter((log) =>
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
  }, [filteredLogs]);

  if (!isInitialized) {
    return (
      <Screen title={i18n.t("screens.stats")}>
        <ActivityIndicator style={{ marginTop: 20 }} />
      </Screen>
    );
  }

  return (
    <Screen title={i18n.t("screens.stats")}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <IntervalSwitcher selected={interval} onSelect={setInterval} />

        {goalDeeds.length > 0 && (
          <>
            <ThemedText style={styles.sectionTitle}>
              {i18n.t("stats.goalProgress")}
            </ThemedText>
            <View style={styles.deedStatsContainer}>
              {goalDeeds.map((deed) => (
                <GoalStatsRow
                  key={deed.id}
                  deed={deed}
                  logs={filteredLogs.filter((l) => l.deedId === deed.id)}
                />
              ))}
            </View>
          </>
        )}

        <ThemedText style={styles.sectionTitle}>
          {i18n.t("stats.prayerPerformance")}
        </ThemedText>
        <View style={styles.summaryGrid}>
          <SummaryBox
            title={i18n.t("stats.inJamaah")}
            color={theme.colors.jamaah}
            percentage={stats.jamaah.percentage}
            count={stats.jamaah.count}
          />
          <SummaryBox
            title={i18n.t("stats.onTime")}
            color={theme.colors.onTime}
            percentage={stats["on-time"].percentage}
            count={stats["on-time"].count}
          />
          <SummaryBox
            title={i18n.t("stats.late")}
            color={theme.colors.late}
            percentage={stats.late.percentage}
            count={stats.late.count}
          />
          <SummaryBox
            title={i18n.t("stats.notPrayed")}
            color={theme.colors.missed}
            percentage={stats.missed.percentage}
            count={stats.missed.count}
          />
        </View>

        <ThemedText style={styles.sectionTitle}>
          {i18n.t("stats.activity")}
        </ThemedText>
        <ActivityGraph
          deeds={prayerDeeds}
          logs={filteredLogs}
          dateRange={dateRange}
        />

        <ThemedText style={styles.sectionTitle}>
          {i18n.t("stats.statsByDeed")}
        </ThemedText>
        <View style={styles.deedStatsContainer}>
          {prayerDeeds.map((deed) => (
            <DeedStatsRow key={deed.id} deed={deed} logs={filteredLogs} />
          ))}
        </View>
      </ScrollView>
    </Screen>
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
    deedStatsContainer: {
      backgroundColor: theme.colors.foreground,
      borderRadius: 16,
      padding: theme.spacing.m,
    },
  });
