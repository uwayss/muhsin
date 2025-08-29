// src/app/index/home.tsx
import { Box } from "@/components/base/Box";
import { Screen } from "@/components/Screen";
import { ThemedText } from "@/components/base/ThemedText";
import { FAB } from "@/components/FAB";
import { AppTheme } from "@/constants/theme";
import { MOCK_DEEDS, MOCK_LOGS } from "@/core/data/mock";
import { Deed, DeedLog, DeedStatus } from "@/core/data/models";
import { useTheme } from "@/core/theme/ThemeContext";
import { formatHijriDate } from "@/core/utils/dateFormatter";
import { DeedListItem } from "@/features/deeds/DeedListItem";
import { LogDeedModal } from "@/features/deeds/LogDeedModal";
import { DateScroller } from "@/features/home/DateScroller";
import { format, formatISO } from "date-fns";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, StyleSheet } from "react-native";

const HomeScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [logs, setLogs] = useState<DeedLog[]>(MOCK_LOGS);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDeed, setSelectedDeed] = useState<Deed | null>(null);

  const { gregorianDate, hijriDate } = useMemo(() => {
    return {
      gregorianDate: format(selectedDate, "MMMM d"),
      hijriDate: formatHijriDate(selectedDate),
    };
  }, [selectedDate]);

  const logsForSelectedDate = useMemo(() => {
    const dateString = formatISO(selectedDate, { representation: "date" });
    return logs.filter((log) => log.date === dateString);
  }, [selectedDate, logs]);

  const handleOpenLogModal = (deed: Deed) => {
    setSelectedDeed(deed);
    setIsModalVisible(true);
  };

  const handleLogStatus = (status: DeedStatus) => {
    if (!selectedDeed) return;
    const dateString = formatISO(selectedDate, { representation: "date" });
    const existingLogIndex = logs.findIndex(
      (log) => log.deedId === selectedDeed.id && log.date === dateString,
    );
    if (existingLogIndex > -1) {
      const updatedLogs = [...logs];
      updatedLogs[existingLogIndex].statusId = status.id;
      setLogs(updatedLogs);
    } else {
      const newLog: DeedLog = {
        id: `log-${Date.now()}`,
        deedId: selectedDeed.id,
        date: dateString,
        statusId: status.id,
      };
      setLogs([...logs, newLog]);
    }
    setIsModalVisible(false);
    setSelectedDeed(null);
  };

  return (
    <Screen title={gregorianDate} subtitle={hijriDate}>
      <DateScroller
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />
      <Box style={{ flex: 1 }}>
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
    },
    listContent: {
      paddingTop: theme.spacing.m,
    },
  });
