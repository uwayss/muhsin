// FILE: src/app/settings/notifications.tsx
import { Screen } from "@/components/Screen";
import { ThemedText } from "@/components/base/ThemedText";
import { AppTheme } from "@/constants/theme";
import useAppStore from "@/core/store/appStore";
import { useTheme } from "@/core/theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Switch, TouchableOpacity, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const NotificationsScreen = () => {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme);

  const { settings, setReminderTime, toggleReminder } = useAppStore();
  const { isReminderEnabled, reminderTime } = settings;

  const [isPickerVisible, setPickerVisible] = useState(false);

  const showDatePicker = () => {
    setPickerVisible(true);
  };

  const hideDatePicker = () => {
    setPickerVisible(false);
  };

  const handleConfirm = (date: Date) => {
    setReminderTime(format(date, "HH:mm"));
    hideDatePicker();
  };

  const reminderDate = new Date();
  const [hours, minutes] = (reminderTime || "20:00").split(":").map(Number);
  reminderDate.setHours(hours);
  reminderDate.setMinutes(minutes);

  return (
    <>
      <Screen
        title="Notifications"
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
          <View style={styles.row}>
            <ThemedText style={styles.label}>Daily reminder</ThemedText>
            <Switch
              value={isReminderEnabled}
              onValueChange={toggleReminder}
              trackColor={{
                false: theme.colors.background,
                true: theme.colors.primary,
              }}
              thumbColor={theme.colors.foreground}
            />
          </View>

          {isReminderEnabled && (
            <TouchableOpacity style={styles.row} onPress={showDatePicker}>
              <ThemedText style={styles.label}>Time</ThemedText>
              <View style={styles.valueContainer}>
                <ThemedText style={styles.valueText}>{reminderTime}</ThemedText>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  color={theme.colors.textSecondary}
                />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </Screen>
      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        date={reminderDate}
        is24Hour
        themeVariant={isDark ? "dark" : "light"}
      />
    </>
  );
};

export default NotificationsScreen;

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      marginTop: theme.spacing.m,
      backgroundColor: theme.colors.foreground,
      borderRadius: 16,
      overflow: "hidden",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: theme.spacing.m,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.background,
    },
    label: {
      fontSize: theme.typography.fontSize.m,
    },
    valueContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    valueText: {
      color: theme.colors.textSecondary,
      marginRight: theme.spacing.xs,
    },
  });
