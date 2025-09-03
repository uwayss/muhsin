// src/app/settings/notifications.tsx
import { Screen } from "@/components/Screen";
import { ThemedText } from "@/components/base/ThemedText";
import { AppTheme } from "@/constants/theme";
import i18n from "@/core/i18n";
import useAppStore from "@/core/store/appStore";
import { useTheme } from "@/core/theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

const NotificationsScreen = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const { settings, setReminderTime, toggleReminder } = useAppStore();
  const { isReminderEnabled, reminderTime } = settings;

  const [isPickerVisible, setPickerVisible] = useState(false);

  const reminderDate = new Date();
  const [hours, minutes] = (reminderTime || "20:00").split(":").map(Number);
  reminderDate.setHours(hours);
  reminderDate.setMinutes(minutes);
  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setPickerVisible(false);
    if (event.type === "set" && selectedDate) {
      setReminderTime(format(selectedDate, "HH:mm"));
    }
  };
  const showPicker = () => {
    setPickerVisible(true);
  };

  return (
    <>
      <Screen
        title={i18n.t("screens.notifications")}
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
            <ThemedText style={styles.label}>
              {i18n.t("settings.dailyReminder")}
            </ThemedText>
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
            <TouchableOpacity style={styles.row} onPress={showPicker}>
              <ThemedText style={styles.label}>
                {i18n.t("settings.time")}
              </ThemedText>
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
      {isPickerVisible && (
        <DateTimePicker
          value={reminderDate}
          mode="time"
          is24Hour={true}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChange}
        />
      )}
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
      marginEnd: theme.spacing.xs,
    },
  });
