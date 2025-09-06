// src/screens/NotificationsScreen.tsx
import { Screen } from "@/components/Screen";
import { ThemedText } from "@/components/base/ThemedText";
import { AppTheme } from "@/constants/theme";
import i18n from "@/core/i18n";
import {
  scheduleTestNotificationIn5s,
  sendTestNotification,
} from "@/core/services/notificationService";
import useAppStore from "@/core/store/appStore";
import { useTheme } from "@/core/theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";

const NotificationsScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const { settings, setReminderTime, toggleReminder } = useAppStore();
  const { isReminderEnabled, reminderTime, isDevMode } = settings;

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
          <TouchableOpacity onPress={() => navigation.goBack()}>
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

        {isDevMode && (
          <View style={styles.devContainer}>
            <ThemedText style={styles.devTitle}>
              {i18n.t("devMenu.title")}
            </ThemedText>
            <TouchableOpacity
              style={styles.devButton}
              onPress={sendTestNotification}
            >
              <ThemedText style={styles.devButtonText}>
                {i18n.t("devMenu.sendTest")}
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.devButton}
              onPress={scheduleTestNotificationIn5s}
            >
              <ThemedText style={styles.devButtonText}>
                {i18n.t("devMenu.scheduleTest")}
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}
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
    devContainer: {
      marginTop: theme.spacing.xl,
      backgroundColor: theme.colors.foreground,
      borderRadius: 16,
      padding: theme.spacing.m,
    },
    devTitle: {
      fontSize: theme.typography.fontSize.s,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.textSecondary,
      textTransform: "uppercase",
      textAlign: "center",
      marginBottom: theme.spacing.m,
    },
    devButton: {
      backgroundColor: theme.colors.primary,
      padding: theme.spacing.m,
      borderRadius: 8,
      alignItems: "center",
      marginBottom: theme.spacing.s,
    },
    devButtonText: {
      color: theme.colors.primaryContrast,
      fontWeight: theme.typography.fontWeight.semibold,
    },
  });
