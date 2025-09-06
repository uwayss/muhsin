// src/features/deeds/DeedListItem.tsx
import { Box } from "@/components/base/Box";
import { ThemedText } from "@/components/base/ThemedText";
import { AppTheme } from "@/constants/theme";
import { Deed, DeedLog } from "@/core/data/models";
import i18n from "@/core/i18n";
import { useTheme } from "@/core/theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

type DeedListItemProps = {
  deed: Deed;
  log: DeedLog | undefined;
  onPress: () => void;
};

const renderStatus = (
  deed: Deed,
  log: DeedLog | undefined,
  theme: AppTheme,
  styles: ReturnType<typeof getStyles>,
) => {
  if (!log) return null;

  // Render goal progress if the deed has a goal and a value is logged
  if (deed.goal && typeof log.value === "number") {
    const isComplete = log.value >= deed.goal.value;
    return (
      <Box
        style={[
          styles.statusBadge,
          isComplete ? styles.goalComplete : styles.goalInProgress,
        ]}
      >
        <ThemedText
          style={[
            styles.goalText,
            isComplete ? styles.goalCompleteText : styles.goalInProgressText,
          ]}
        >
          {log.value} / {deed.goal.value}
        </ThemedText>
      </Box>
    );
  }

  // Render default status icon
  const status = deed.statuses.find((s) => s.id === log.statusId);
  if (!status) return null;

  return (
    <Box
      style={[
        styles.statusBadge,
        { backgroundColor: theme.colors[status.color] },
      ]}
    >
      <MaterialCommunityIcons
        name={status.icon}
        size={16}
        color={theme.colors.primaryContrast}
      />
    </Box>
  );
};

export const DeedListItem = ({ deed, log, onPress }: DeedListItemProps) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Box style={styles.container}>
        <MaterialCommunityIcons
          name={deed.icon}
          size={28}
          color={theme.colors.textSecondary}
        />
        <ThemedText style={styles.deedName}>
          {i18n.t(`deeds_names.${deed.id}`, { defaultValue: deed.name })}
        </ThemedText>

        {renderStatus(deed, log, theme, styles)}
      </Box>
    </TouchableOpacity>
  );
};

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      padding: theme.spacing.m,
      backgroundColor: theme.colors.foreground,
      borderRadius: 8,
      marginBottom: theme.spacing.s,
    },
    deedName: {
      flex: 1,
      marginStart: theme.spacing.m,
      fontSize: theme.typography.fontSize.m,
    },
    statusBadge: {
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.s,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      minWidth: 32,
    },
    goalInProgress: {
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    goalComplete: {
      backgroundColor: theme.colors.primary,
    },
    goalText: {
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    goalInProgressText: {
      color: theme.colors.primary,
    },
    goalCompleteText: {
      color: theme.colors.primaryContrast,
    },
  });
