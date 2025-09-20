// FILE: src/screens/StatsScreen.tsx
import { Screen } from "@/components/Screen";
import { ThemedText } from "@/components/base/ThemedText";
import { AppTheme } from "@/constants/theme";
import i18n from "@/core/i18n";
import useAppStore from "@/core/store/appStore";
import { useTheme } from "@/core/theme/ThemeContext";
import { ActivityGraph } from "@/features/stats/ActivityGraph";
import { DeedStatsRow } from "@/features/stats/DeedStatsRow";
import { ExpandableSection } from "@/features/stats/ExpandableSection";
import { GoalStatsRow } from "@/features/stats/GoalStatsRow";
import { SegmentedControl } from "@/features/stats/SegmentedControl";
import { TimeInterval } from "@/features/stats/types";
import { SummaryBox } from "@/features/stats/SummaryBox";
import {
  eachDayOfInterval,
  endOfDay,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
} from "date-fns";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  InteractionManager,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

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
  const [isLoading, setIsLoading] = useState(true);

  const [displayData, setDisplayData] = useState<{
    filteredLogs: any[];
    stats: any;
  } | null>(null);

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

  // --- Data specifically for the graph (last 60 days) ---
  const graphData = useMemo(() => {
    const today = new Date();
    const sixtyDaysAgo = startOfDay(subDays(today, 59)); // Changed from 89 to 59 for ~2 months
    const dateRange = eachDayOfInterval({ start: sixtyDaysAgo, end: today });
    const relevantLogs = logs.filter(
      (log) => new Date(log.date) >= sixtyDaysAgo,
    );
    return { dateRange, logs: relevantLogs };
  }, [logs]);

  // --- Data for all other stats (affected by interval switcher) ---
  useEffect(() => {
    setIsLoading(true);
    InteractionManager.runAfterInteractions(() => {
      if (!isInitialized) return;

      const today = new Date();
      let dateRangeForFilter;
      if (interval === "all") {
        const firstLogDate =
          logs.length > 0
            ? new Date(logs.reduce((a, b) => (a.date < b.date ? a : b)).date)
            : today;
        dateRangeForFilter = { start: startOfDay(firstLogDate), end: today };
      } else {
        const range = { start: startOfWeek(today), end: endOfDay(today) };
        if (interval === "month") range.start = startOfMonth(today);
        if (interval === "year") range.start = startOfYear(today);
        dateRangeForFilter = range;
      }

      const filtered =
        interval === "all"
          ? logs
          : logs.filter((log) => {
              const logDate = startOfDay(new Date(log.date));
              return (
                logDate >= dateRangeForFilter.start &&
                logDate <= dateRangeForFilter.end
              );
            });

      const prayerLogs = filtered.filter((log) =>
        PRAYER_DEED_IDS.includes(log.deedId),
      );
      const total = prayerLogs.length;
      const counts = prayerLogs.reduce(
        (acc, log) => {
          acc[log.statusId] = (acc[log.statusId] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );
      const calculatedStats = {
        jamaah: {
          count: counts.jamaah || 0,
          percentage: total > 0 ? ((counts.jamaah || 0) / total) * 100 : 0,
        },
        "on-time": {
          count: counts["on-time"] || 0,
          percentage: total > 0 ? ((counts["on-time"] || 0) / total) * 100 : 0,
        },
        late: {
          count: counts.late || 0,
          percentage: total > 0 ? ((counts.late || 0) / total) * 100 : 0,
        },
        missed: {
          count: counts.missed || 0,
          percentage: total > 0 ? ((counts.missed || 0) / total) * 100 : 0,
        },
      };

      setDisplayData({
        filteredLogs: filtered,
        stats: calculatedStats,
      });
      setIsLoading(false);
    });
  }, [isInitialized, interval, logs]);

  const segmentedOptions = [
    { label: i18n.t("intervals.week"), value: "week" as TimeInterval },
    { label: i18n.t("intervals.month"), value: "month" as TimeInterval },
    { label: i18n.t("intervals.year"), value: "year" as TimeInterval },
    { label: i18n.t("intervals.allTime"), value: "all" as TimeInterval },
  ];

  const renderContent = () => {
    if (isLoading || !displayData) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <>
        <SegmentedControl
          options={segmentedOptions}
          selected={interval}
          onSelect={setInterval}
        />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ThemedText style={styles.sectionTitle}>
            {i18n.t("stats.prayerPerformance")}
          </ThemedText>
          <View style={styles.summaryGrid}>
            <SummaryBox
              title={i18n.t("stats.inJamaah")}
              color={theme.colors.jamaah}
              percentage={displayData.stats.jamaah.percentage}
              count={displayData.stats.jamaah.count}
            />
            <SummaryBox
              title={i18n.t("stats.onTime")}
              color={theme.colors.onTime}
              percentage={displayData.stats["on-time"].percentage}
              count={displayData.stats["on-time"].count}
            />
            <SummaryBox
              title={i18n.t("stats.late")}
              color={theme.colors.late}
              percentage={displayData.stats.late.percentage}
              count={displayData.stats.late.count}
            />
            <SummaryBox
              title={i18n.t("stats.notPrayed")}
              color={theme.colors.missed}
              percentage={displayData.stats.missed.percentage}
              count={displayData.stats.missed.count}
            />
          </View>

          {goalDeeds.length > 0 && (
            <View>
              <ThemedText style={styles.sectionTitle}>
                {i18n.t("stats.goalProgress")}
              </ThemedText>
              <View style={styles.card}>
                {goalDeeds.map((deed) => (
                  <GoalStatsRow
                    key={deed.id}
                    deed={deed}
                    logs={displayData.filteredLogs.filter(
                      (l) => l.deedId === deed.id,
                    )}
                  />
                ))}
              </View>
            </View>
          )}

          <ThemedText style={styles.sectionTitle}>
            {i18n.t("stats.statsByDeed")}
          </ThemedText>
          <ExpandableSection title={i18n.t("stats.fardPrayers")}>
            {prayerDeeds.map((deed) => (
              <DeedStatsRow
                key={deed.id}
                deed={deed}
                logs={displayData.filteredLogs}
              />
            ))}
          </ExpandableSection>
        </ScrollView>
      </>
    );
  };

  return (
    <Screen title={i18n.t("screens.stats")}>
      <ThemedText style={styles.sectionTitle}>
        {i18n.t("stats.activity")}
      </ThemedText>
      <ActivityGraph
        deeds={prayerDeeds}
        logs={graphData.logs}
        dateRange={graphData.dateRange}
      />
      {renderContent()}
    </Screen>
  );
};

export default StatsScreen;

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    scrollContent: {
      paddingBottom: theme.spacing.xl,
    },
    sectionTitle: {
      fontWeight: theme.typography.fontWeight.bold,
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.l,
      marginBottom: theme.spacing.s,
    },
    summaryGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginHorizontal: -theme.spacing.xs, // Counteract summary box margin
    },
    card: {
      backgroundColor: theme.colors.foreground,
      borderRadius: 16,
      padding: theme.spacing.m,
    },
  });
