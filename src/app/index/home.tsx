// src/app/index/home.tsx
import { Box } from "@/components/base/Box";
import { Screen } from "@/components/Screen";
import { ThemedText } from "@/components/base/ThemedText";
import { FAB } from "@/components/FAB";
import { AppTheme } from "@/constants/theme";
import { Deed, DeedStatus } from "@/core/data/models";
import i18n, { dateLocales } from "@/core/i18n";
import useAppStore from "@/core/store/appStore";
import { useTheme } from "@/core/theme/ThemeContext";
import { formatHijriDate } from "@/core/utils/dateFormatter";
import { DeedListItem } from "@/features/deeds/DeedListItem";
import { LogDeedModal } from "@/features/deeds/LogDeedModal";
import { DateScroller } from "@/features/home/DateScroller";
import { format, formatISO, getDay } from "date-fns";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, SectionList, StyleSheet } from "react-native";

const HomeScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const router = useRouter();

  // --- Global State ---
  const { isInitialized, deeds, logs, addOrUpdateLog, settings } =
    useAppStore();
  const activeLocale = dateLocales[settings.language];

  // --- Local State ---
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDeed, setSelectedDeed] = useState<Deed | null>(null);

  // --- Memos ---
  const { gregorianDate, hijriDate } = useMemo(() => {
    return {
      gregorianDate: format(selectedDate, "MMMM d", {
        locale: activeLocale,
      }),
      hijriDate: formatHijriDate(selectedDate),
    };
  }, [selectedDate, activeLocale]);

  const logsForSelectedDate = useMemo(() => {
    const dateString = formatISO(selectedDate, { representation: "date" });
    return logs.filter((log) => log.date === dateString);
  }, [selectedDate, logs]);

  const deedsBySection = useMemo(() => {
    const dayOfWeek = getDay(selectedDate); // 0 = Sunday, 1 = Monday, etc.

    const visibleDeeds = deeds.filter((deed) => {
      if (!deed.frequency) {
        return true;
      }
      // Show daily, monthly, and yearly deeds every day.
      if (
        deed.frequency.type === "daily" ||
        deed.frequency.type === "monthly" ||
        deed.frequency.type === "yearly"
      ) {
        return true;
      }
      // For weekly deeds, only show them on their selected days.
      if (deed.frequency.type === "weekly") {
        return deed.frequency.days?.includes(dayOfWeek) ?? false;
      }
      return false;
    });

    const sections: { title: string; data: Deed[] }[] = [];
    const deedsByCategory = visibleDeeds.reduce(
      (acc, deed) => {
        (acc[deed.category] = acc[deed.category] || []).push(deed);
        return acc;
      },
      {} as Record<string, Deed[]>,
    );

    for (const [category, deedsInSection] of Object.entries(deedsByCategory)) {
      sections.push({
        title: i18n.t(`categories.${category}`, { defaultValue: category }),
        data: deedsInSection,
      });
    }
    return sections;
  }, [deeds, selectedDate]);

  // --- Handlers ---
  const handleOpenLogModal = (deed: Deed) => {
    setSelectedDeed(deed);
    setIsModalVisible(true);
  };

  const handleLogStatus = (status: DeedStatus) => {
    if (!selectedDeed) return;
    addOrUpdateLog(selectedDeed, selectedDate, status);
    setIsModalVisible(false);
    setSelectedDeed(null);
  };

  if (!isInitialized) {
    return (
      <Screen title={i18n.t("screens.homeLoading")}>
        <Box style={styles.centered}>
          <ActivityIndicator />
        </Box>
      </Screen>
    );
  }

  return (
    <Screen title={gregorianDate} subtitle={hijriDate}>
      <DateScroller
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        locale={activeLocale}
      />
      <Box style={{ flex: 1 }}>
        <SectionList
          sections={deedsBySection}
          keyExtractor={(item) => item.id}
          renderSectionHeader={({ section: { title } }) => (
            <ThemedText style={styles.categoryTitle}>{title}</ThemedText>
          )}
          renderItem={({ item: deed }) => {
            const log = logsForSelectedDate.find((l) => l.deedId === deed.id);
            return (
              <DeedListItem
                deed={deed}
                log={log}
                onPress={() => handleOpenLogModal(deed)}
              />
            );
          }}
          contentContainerStyle={styles.listContent}
        />
        <FAB onPress={() => router.push("/add-deed")} />
      </Box>
      <LogDeedModal
        isVisible={isModalVisible}
        deed={selectedDeed}
        onClose={() => setIsModalVisible(false)}
        onLogStatus={handleLogStatus}
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
      marginTop: theme.spacing.m,
      textAlign: "left", // Explicitly set for LTR/RTL consistency
    },
    listContent: {
      paddingTop: theme.spacing.s,
    },
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });
