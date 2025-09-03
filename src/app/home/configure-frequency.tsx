// src/app/index/configure-frequency.tsx
import { Screen } from "@/components/Screen";
import { ThemedText } from "@/components/base/ThemedText";
import { AppTheme } from "@/constants/theme";
import { DeedFrequency } from "@/core/data/models";
import i18n from "@/core/i18n";
import useAppStore from "@/core/store/appStore";
import { useTheme } from "@/core/theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View, TextInput } from "react-native";
const DAYS = [
  { label: i18n.t("frequency.days_abbr.sun"), value: 0 },
  { label: i18n.t("frequency.days_abbr.mon"), value: 1 },
  { label: i18n.t("frequency.days_abbr.tue"), value: 2 },
  { label: i18n.t("frequency.days_abbr.wed"), value: 3 },
  { label: i18n.t("frequency.days_abbr.thu"), value: 4 },
  { label: i18n.t("frequency.days_abbr.fri"), value: 5 },
  { label: i18n.t("frequency.days_abbr.sat"), value: 6 },
];
const ConfigureFrequencyScreen = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { draftDeed, updateDraftDeed } = useAppStore();
  const frequency = draftDeed?.frequency || { type: "daily" };
  const setType = (type: DeedFrequency["type"]) => {
    const newFrequency: DeedFrequency = { type };
    if (type === "weekly") {
      newFrequency.days = frequency.days || [];
    } else if (type === "monthly" || type === "yearly") {
      newFrequency.count = frequency.count || 1;
    }
    updateDraftDeed({ frequency: newFrequency });
  };
  const toggleDay = (dayValue: number) => {
    if (frequency.type !== "weekly") return;
    const currentDays = frequency.days || [];
    const newDays = currentDays.includes(dayValue)
      ? currentDays.filter((d) => d !== dayValue)
      : [...currentDays, dayValue];
    updateDraftDeed({ frequency: { ...frequency, days: newDays.sort() } });
  };
  const handleCountChange = (text: string) => {
    const count = parseInt(text, 10);
    if (!isNaN(count) && count > 0) {
      updateDraftDeed({ frequency: { ...frequency, count } });
    }
  };
  return (
    <Screen
      title={i18n.t("screens.configureFrequency")}
      renderLeftAction={() => (
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons
            name="chevron-left"
            size={32}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      )}
    >
      <View style={styles.container}>
        <ThemedText style={styles.sectionHeader}>
          {i18n.t("frequency.type")}
        </ThemedText>
        <View style={styles.optionGroup}>
          <OptionButton
            label={i18n.t("frequency.daily")}
            selected={frequency.type === "daily"}
            onPress={() => setType("daily")}
          />
          <OptionButton
            label={i18n.t("frequency.weekly")}
            selected={frequency.type === "weekly"}
            onPress={() => setType("weekly")}
          />
          <OptionButton
            label={i18n.t("frequency.monthly")}
            selected={frequency.type === "monthly"}
            onPress={() => setType("monthly")}
          />
          <OptionButton
            label={i18n.t("frequency.yearly")}
            selected={frequency.type === "yearly"}
            onPress={() => setType("yearly")}
          />
        </View>{" "}
        {frequency.type === "weekly" && (
          <>
            <ThemedText style={styles.sectionHeader}>
              {i18n.t("frequency.selectDays")}
            </ThemedText>
            <View style={styles.daySelector}>
              {DAYS.map((day) => (
                <DayButton
                  key={day.value}
                  label={day.label}
                  selected={(frequency.days || []).includes(day.value)}
                  onPress={() => toggleDay(day.value)}
                />
              ))}
            </View>
          </>
        )}
        {(frequency.type === "monthly" || frequency.type === "yearly") && (
          <>
            <ThemedText style={styles.sectionHeader}>
              {i18n.t("frequency.howManyTimes", {
                interval: frequency.type.replace("ly", ""),
              })}
            </ThemedText>
            <View style={styles.countContainer}>
              <TextInput
                style={styles.countInput}
                keyboardType="number-pad"
                value={frequency.count?.toString() || "1"}
                onChangeText={handleCountChange}
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>
          </>
        )}
      </View>
    </Screen>
  );
};
// Helper Components
const OptionButton = ({ label, selected, onPress }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  return (
    <TouchableOpacity
      style={[styles.optionButton, selected && styles.selected]}
      onPress={onPress}
    >
      <ThemedText style={[styles.optionText, selected && styles.selectedText]}>
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
};
const DayButton = ({ label, selected, onPress }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  return (
    <TouchableOpacity
      style={[styles.dayButton, selected && styles.selectedDay]}
      onPress={onPress}
    >
      <ThemedText style={[styles.dayText, selected && styles.selectedText]}>
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
};
export default ConfigureFrequencyScreen;
const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { paddingTop: theme.spacing.m },
    sectionHeader: {
      marginTop: theme.spacing.l,
      marginBottom: theme.spacing.s,
      color: theme.colors.textSecondary,
      textTransform: "uppercase",
      fontWeight: theme.typography.fontWeight.bold,
    },
    optionGroup: {
      flexDirection: "row",
      backgroundColor: theme.colors.foreground,
      borderRadius: 8,
      overflow: "hidden",
    },
    optionButton: { flex: 1, padding: theme.spacing.m, alignItems: "center" },
    selected: { backgroundColor: theme.colors.primary },
    optionText: {
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.s,
    },
    selectedText: { color: theme.colors.primaryContrast },
    daySelector: {
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: theme.colors.foreground,
      borderRadius: 8,
      padding: theme.spacing.s,
    },
    dayButton: {
      flex: 1,
      height: 44,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: theme.spacing.xs / 2,
    },
    selectedDay: { backgroundColor: theme.colors.primary },
    dayText: {
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.text,
    },
    countContainer: {
      backgroundColor: theme.colors.foreground,
      borderRadius: 8,
      padding: theme.spacing.m,
    },
    countInput: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.m,
      textAlign: "center",
    },
  });
