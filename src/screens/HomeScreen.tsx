// src/screens/HomeScreen.tsx
import { Box } from "@/components/base/Box";
import { Screen } from "@/components/Screen";
import { ThemedText } from "@/components/base/ThemedText";
import { FAB } from "@/components/FAB";
import { AppTheme } from "@/constants/theme";
import { Deed, DeedLog, DeedStatus } from "@/core/data/models";
import i18n, { dateLocales } from "@/core/i18n";
import useAppStore from "@/core/store/appStore";
import { useTheme } from "@/core/theme/ThemeContext";
import { formatHijriDate } from "@/core/utils/dateFormatter";
import { DeedListItem } from "@/features/deeds/DeedListItem";
import { LogDeedModal } from "@/features/deeds/LogDeedModal";
import { LogGoalModal } from "@/features/deeds/LogGoalModal";
import { DateScroller } from "@/features/home/DateScroller";
import { HomeStackParamList } from "@/navigation/AppNavigator";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { format, formatISO, getDay } from "date-fns";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  I18nManager,
  SectionList,
  StyleSheet,
} from "react-native";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "HomeMain"
>;

const HomeScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation<HomeScreenNavigationProp>();

  // --- Global State ---
  const { isInitialized, deeds, logs, addOrUpdateLog, settings } =
    useAppStore();
  const activeLocale = dateLocales[settings.language];

  // --- Local State ---
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLogDeedModalVisible, setLogDeedModalVisible] = useState(false);
  const [isLogGoalModalVisible, setLogGoalModalVisible] = useState(false);
  const [selectedDeed, setSelectedDeed] = useState<Deed | null>(null);
  const [selectedLog, setSelectedLog] = useState<DeedLog | undefined>(
    undefined,
  );

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
    const dayOfWeek = getDay(selectedDate);

    // Filter out deeds that have a parent
    const visibleDeeds = deeds.filter((deed) => {
      if (deed.parentId) return false;

      if (!deed.frequency) {
        return true;
      }
      if (
        deed.frequency.type === "daily" ||
        deed.frequency.type === "monthly" ||
        deed.frequency.type === "yearly"
      ) {
        return true;
      }
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

  const handleOpenModal = (deed: Deed) => {
    const log = logsForSelectedDate.find((l) => l.deedId === deed.id);
    setSelectedDeed(deed);
    setSelectedLog(log);

    if (deed.goal) {
      setLogGoalModalVisible(true);
    } else {
      setLogDeedModalVisible(true);
    }
  };

  const handleLogStatus = (status: DeedStatus) => {
    if (!selectedDeed) return;
    addOrUpdateLog(selectedDeed, selectedDate, status);
    // Do not close modal here to allow child deed logging
  };

  const handleLogGoal = (value: number) => {
    if (!selectedDeed) return;
    // For goals, we determine status based on value.
    const status =
      value > 0
        ? selectedDeed.statuses.find((s) => s.id === "completed")!
        : selectedDeed.statuses.find((s) => s.id === "missed")!;
    addOrUpdateLog(selectedDeed, selectedDate, status, value);
    setLogGoalModalVisible(false);
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
                onPress={() => handleOpenModal(deed)}
              />
            );
          }}
          contentContainerStyle={styles.listContent}
        />
        <FAB onPress={() => navigation.navigate("AddDeed")} />
      </Box>
      <LogDeedModal
        isVisible={isLogDeedModalVisible}
        deed={selectedDeed}
        date={selectedDate}
        onClose={() => setLogDeedModalVisible(false)}
        onLogStatus={handleLogStatus}
      />
      <LogGoalModal
        isVisible={isLogGoalModalVisible}
        deed={selectedDeed}
        log={selectedLog}
        date={selectedDate}
        onClose={() => setLogGoalModalVisible(false)}
        onLogGoal={handleLogGoal}
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
      textAlign: I18nManager.isRTL ? "right" : "left",
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
