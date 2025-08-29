// src/app/index/home.tsx
import { Screen } from "@/components/Screen";
import { ThemedText } from "@/components/base/ThemedText";
import { AppTheme } from "@/constants/theme";
import { MOCK_DEEDS, MOCK_LOGS } from "@/core/data/mock";
import { useTheme } from "@/core/theme/ThemeContext";
import { DeedListItem } from "@/features/deeds/DeedListItem";
import { DateScroller } from "@/features/home/DateScroller";
import { format, formatISO } from "date-fns";
import HijriDate from "hijri-date"; // Use the main import
import React, { useMemo, useState } from "react";
import { FlatList, StyleSheet } from "react-native";

const HomeScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [selectedDate, setSelectedDate] = useState(new Date("2025-08-29"));

  const { gregorianDate, hijriDate } = useMemo(() => {
    const hijri = new HijriDate(selectedDate);
    return {
      gregorianDate: format(selectedDate, "MMMM d"),
      // Corrected: Use iYYYY, iMMMM, iD for hijri-date formatting
      hijriDate: hijri.format("iMMMM iD, iYYYY"),
    };
  }, [selectedDate]);

  const logsForSelectedDate = useMemo(() => {
    const dateString = formatISO(selectedDate, { representation: "date" });
    return MOCK_LOGS.filter((log) => log.date === dateString);
  }, [selectedDate]);

  return (
    <Screen title={gregorianDate} subtitle={hijriDate}>
      <DateScroller
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />

      <FlatList
        data={MOCK_DEEDS}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
          <ThemedText style={styles.categoryTitle}>PRAYERS</ThemedText>
        )}
        renderItem={({ item: deed }) => {
          const log = logsForSelectedDate.find((l) => l.deedId === deed.id);
          return (
            <DeedListItem
              deed={deed}
              log={log}
              onPress={() => alert(`Log ${deed.name} for ${gregorianDate}`)}
            />
          );
        }}
        contentContainerStyle={styles.listContent}
      />
    </Screen>
  );
};

export default HomeScreen;

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    categoryTitle: {
      fontWeight: theme.typography.fontWeight.bold,
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.textSecondary,
      textTransform: "uppercase",
      marginBottom: theme.spacing.s,
    },
    listContent: {
      paddingTop: theme.spacing.m,
    },
  });
