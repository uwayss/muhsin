// src/app/settings/notifications.tsx
import { Screen } from "@/components/Screen";
import { ThemedText } from "@/components/base/ThemedText";
import { AppTheme } from "@/constants/theme";
import { useTheme } from "@/core/theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";

const NotificationsScreen = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [isReminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime] = useState("20:00"); // Default time

  const handleTimePress = () => {
    Alert.alert(
      "Feature Coming Soon",
      "Setting a custom reminder time will be available in a future update.",
    );
  };

  return (
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
            onValueChange={setReminderEnabled}
            trackColor={{
              false: theme.colors.background,
              true: theme.colors.primary,
            }}
            thumbColor={theme.colors.foreground}
          />
        </View>

        {isReminderEnabled && (
          <TouchableOpacity style={styles.row} onPress={handleTimePress}>
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
