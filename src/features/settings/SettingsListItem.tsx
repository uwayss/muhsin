// src/features/settings/SettingsListItem.tsx
import { ThemedText } from "@/components/base/ThemedText";
import { AppTheme } from "@/constants/theme";
import useAppStore from "@/core/store/appStore";
import { useTheme } from "@/core/theme/ThemeContext";
import { triggerHaptic } from "@/core/utils/haptics";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Switch,
  TouchableOpacity,
  I18nManager,
} from "react-native";
import { SettingsItem } from "./settingsData";
import i18n from "@/core/i18n";

type SettingsListItemProps = {
  item: SettingsItem;
  isFirst: boolean;
  isLast: boolean;
  onPress: (item: SettingsItem) => void;
};

export const SettingsListItem = ({
  item,
  isFirst,
  isLast,
  onPress,
}: SettingsListItemProps) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const settings = useAppStore((state) => state.settings);
  const toggleHaptics = useAppStore((state) => state.toggleHaptics);

  const value = item.type === "toggle" ? settings[item.stateKey] : false;

  const handleToggle = () => {
    if (item.type === "toggle" && item.stateKey === "isHapticsEnabled") {
      toggleHaptics();
      triggerHaptic();
    }
  };

  const handlePress = () => {
    triggerHaptic();
    onPress(item);
  };

  const containerStyle = [
    styles.container,
    isFirst && styles.isFirst,
    isLast && styles.isLast,
  ];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={handlePress}
      disabled={item.type === "toggle"}
      activeOpacity={0.7}
    >
      <MaterialCommunityIcons
        name={item.icon}
        size={24}
        color={
          item.type === "action" && item.color
            ? item.color
            : theme.colors.textSecondary
        }
        style={styles.icon}
      />
      <ThemedText
        style={[
          styles.label,
          item.type === "action" && item.color ? { color: item.color } : {},
        ]}
      >
        {item.label}
      </ThemedText>

      {item.type === "toggle" && (
        <Switch
          value={value}
          onValueChange={handleToggle}
          trackColor={{
            false: theme.colors.background,
            true: theme.colors.primary,
          }}
          thumbColor={theme.colors.text}
          style={{ height: 24 }}
        />
      )}
      {(item.type === "navigation" ||
        item.type === "modal" ||
        (item.type === "action" &&
          item.label !== i18n.t("settings.privacy") &&
          !item.color)) && (
        <MaterialCommunityIcons
          name={I18nManager.isRTL ? "chevron-left" : "chevron-right"}
          size={24}
          color={theme.colors.textSecondary}
        />
      )}
    </TouchableOpacity>
  );
};

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.m,
      paddingVertical: theme.spacing.s + 4,
      backgroundColor: theme.colors.foreground,
    },
    isFirst: { borderTopLeftRadius: 16, borderTopRightRadius: 16 },
    isLast: { borderBottomLeftRadius: 16, borderBottomRightRadius: 16 },
    icon: { marginEnd: theme.spacing.m },
    label: {
      flex: 1,
      fontSize: theme.typography.fontSize.m,
      textAlign: I18nManager.isRTL ? "right" : "left",
    },
  });
